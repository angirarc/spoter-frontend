"use client"

import {
    ClipboardListIcon,
    FolderIcon,
    MoreHorizontalIcon,
    ShareIcon,
    type LucideIcon,
} from "lucide-react";
import { BarLoader, ClipLoader } from "react-spinners";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { useTripStore } from "@/store/tripStore";
import { useEffect } from "react";

export function NavDocuments({
    items,
}: {
    items: {
        name: string
        url: string
        icon: LucideIcon
    }[]
}) {
    const { isMobile } = useSidebar();
    const { trips, getTrips, state } = useTripStore();

    const isLoading = state.getTrips.status === "LOADING";

    useEffect(() => {
        getTrips();
    }, []);

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel className="flex items-center">Previous Trips{" "}{ isLoading && <ClipLoader className="ml-3" size={12} /> }</SidebarGroupLabel>
            <SidebarMenu>
                {
                    trips.length > 0 ?
                        trips.map((trip) => (
                            <SidebarMenuItem key={trip.id}>
                                <SidebarMenuButton asChild>
                                    {/* <a href={item.url}> */}
                                        <ClipboardListIcon />
                                        <span>{trip.pickup_location} - {trip.dropoff_location}</span>
                                    {/* </a> */}
                                </SidebarMenuButton>
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
                                        <DropdownMenuItem>
                                            <FolderIcon />
                                            <span>View Trip</span>
                                        </DropdownMenuItem>
                                        {
                                            trip.end_time === null && (
                                                <DropdownMenuItem>
                                                    <ShareIcon />
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
                {/* <SidebarMenuItem>
                    <SidebarMenuButton className="text-sidebar-foreground/70">
                        <MoreHorizontalIcon className="text-sidebar-foreground/70" />
                        <span>More</span>
                    </SidebarMenuButton>
                </SidebarMenuItem> */}
            </SidebarMenu>
        </SidebarGroup>
    )
}