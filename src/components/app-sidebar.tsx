"use client"

import * as React from "react"
import {
    ArrowUpCircleIcon,
    ClipboardListIcon,
    DeleteIcon,
    EyeIcon,
    MoreHorizontalIcon,
    PlusCircleIcon,
    UsersIcon,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenuAction,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
    SidebarGroupContent,
} from "@/components/ui/sidebar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import NavUser from "@/components/nav-user";
import { useTripStore } from "@/store/tripStore";
import { ClipLoader } from "react-spinners"
import { TripModel } from "@/lib/types/models"
import ConfirmDialog from "./confirm-dialog"
import useToggle from "@/hooks/use-toggle"



const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
    const { isMobile } = useSidebar();
    const { trips, getTrips, state, selectTrip, selectedTrip, deleteTrip } = useTripStore();
    const [deleteModal, toggleDeleteModal] = useToggle();

    const isLoading = state.getTrips.status === "LOADING";

    // Trigger modal
    const selectForDelete = (trip: TripModel) => {
        selectTrip(trip);
        toggleDeleteModal();
    }

    const performDelete = () => {
        if (selectedTrip?.id) deleteTrip(selectedTrip.id)
    }

    React.useEffect(() => {
        getTrips();
    }, [getTrips]);

    const previousTrips = () => (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel className="flex items-center">Previous Trips{" "}{isLoading && <ClipLoader className="ml-3" size={12} />}</SidebarGroupLabel>
            <SidebarMenu>
                {
                    trips.length > 0 ?
                        trips.map((trip) => (
                            <SidebarMenuItem key={trip.id}>
                                <SidebarMenuItem>
                                    <SidebarMenuButton className={selectedTrip?.id === trip?.id ? 'bg-gray-200' : ''} tooltip="Trip">
                                        <>
                                            <ClipboardListIcon color={ trip?.end_time ? 'green' : trip?.start_time ? 'blue' : 'orange'} />
                                            <span>{trip.pickup_name} - {trip.dropoff_name}</span>
                                        </>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <SidebarMenuAction
                                            showOnHover
                                            className="rounded-sm data-[state=open]:bg-accent"
                                        >
                                            <MoreHorizontalIcon />
                                            <span className="sr-only">More</span>
                                        </SidebarMenuAction>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        className="w-24 rounded-lg"
                                        side={isMobile ? "bottom" : "right"}
                                        align={isMobile ? "end" : "start"}
                                    >
                                        <DropdownMenuItem onClick={() => selectTrip(trip)}>
                                            <EyeIcon />
                                            <span>View Trip</span>
                                        </DropdownMenuItem>
                                        {
                                            trip.end_time === null && (
                                                <DropdownMenuItem onClick={() => selectForDelete(trip)}>
                                                    <DeleteIcon />
                                                    <span>Delete Trip</span>
                                                </DropdownMenuItem>
                                            )
                                        }
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </SidebarMenuItem>
                        ))
                        : (
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild className="text-sidebar-foreground/70">
                                    <span>Please click above to create a new trip</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                }
                <ConfirmDialog
                    open={deleteModal}
                    toggle={toggleDeleteModal}
                    onConfirm={performDelete}
                    title="Are you sure you want to delete this trip?"
                    description="This action cannot be undone. This will permanently delete the trip from your account." />
                {/* <SidebarMenuItem>
                    <SidebarMenuButton className="text-sidebar-foreground/70">
                        <MoreHorizontalIcon className="text-sidebar-foreground/70" />
                        <span>More</span>
                    </SidebarMenuButton>
                </SidebarMenuItem> */}
            </SidebarMenu>
        </SidebarGroup>
    )

    const navItems = () => (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu>
                    <SidebarMenuItem className="flex items-center gap-2">
                        <SidebarMenuButton
                            onClick={() => selectTrip()}
                            tooltip="Create New Trip"
                            className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
                        >
                            <PlusCircleIcon />
                            <span>Create New Trip</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                        >
                            <a href="#">
                                <ArrowUpCircleIcon className="h-5 w-5" />
                                <span className="text-base font-semibold">Spotter Dashboard</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                {navItems()}
                <SidebarGroup>
                    <SidebarGroupContent className="flex flex-col gap-2">
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton tooltip="Users">
                                    <UsersIcon />
                                    <span>Users</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                {previousTrips()}
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    )
}

export default AppSidebar;