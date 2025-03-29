import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { MapBoxFeature } from '@/lib/types/models';

import { cn } from "@/lib/utils";
import { useTripStore } from "@/store/tripStore";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const LocationSelect = ({ value, setValue }: { value?: MapBoxFeature, setValue: (value: MapBoxFeature) => void }) => {
    const { searchResults, searchLocations, state } = useTripStore();
    const [open, setOpen] = useState(false)

    const debouncedSearch = useCallback(
        debounce(async (value: string) => {
            await searchLocations(value);
        }, 500),
        [searchLocations],
    );

    const isLoading = state.searchLocations.status === 'LOADING';

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {value
                        ? value?.properties.full_address
                        : "Select location..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput onInput={e => debouncedSearch(e.currentTarget.value)} placeholder="Search location..." />
                    <CommandList>
                        <CommandEmpty>{isLoading ? 'Searching...' : 'No location found.'}</CommandEmpty>
                        <CommandGroup>
                            {searchResults.map((res) => (
                                <CommandItem
                                    key={res.id}
                                    value={res.id}
                                    onSelect={(currentValue) => {
                                        setValue(res)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value?.id === res.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {res.properties.full_address}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

const TripForm = ({ submit, callback }: { submit: any, callback?: () => void }) => {
    const { instructions, getTripInstructions } = useTripStore();
    const [cycle, setCycle] = useState<string>();
    const [pickup, setPickup] = useState<MapBoxFeature>();
    const [dropoff, setDropoff] = useState<MapBoxFeature>();

    const handleSubmit = () => {
        submit({
            pickup_location: `${pickup?.properties.coordinates.longitude}, ${pickup?.properties.coordinates.latitude}`,
            pickup_name: pickup?.properties.full_address || '',
            dropoff_location: `${dropoff?.properties.coordinates.longitude}, ${dropoff?.properties.coordinates.latitude}`,
            dropoff_name: dropoff?.properties.full_address || '',
            cycle_used: cycle || '',
            route_instructions: ['Begin', ...instructions]
        }, () => {
            setCycle(undefined);
            setPickup(undefined);
            setDropoff(undefined);
            if (callback) callback()
        })
    }

    useEffect(() => {
        if (pickup && dropoff) {
            getTripInstructions(
                [pickup?.properties.coordinates.latitude, pickup?.properties.coordinates.longitude],
                [dropoff?.properties.coordinates.latitude, dropoff?.properties.coordinates.longitude]
            )
        }
    }, [pickup, dropoff])

    return (
        <div className="grid gap-6">
            <div className="grid gap-2">
                <Label htmlFor="pickup">Pickup Location</Label>
                <LocationSelect value={pickup} setValue={setPickup} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="dropoff">Dropoff Location</Label>
                <LocationSelect value={dropoff} setValue={setDropoff} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="cycle">Cycle Used</Label>
                <Select onValueChange={setCycle} defaultValue={cycle}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Cycle Used" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="14 Day Trip">14 Day Trip</SelectItem>
                        <SelectItem value="30 Day Trip">30 Day Trip</SelectItem>
                        <SelectItem value="35 Day Trip">35 Day Trip</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button
                onClick={handleSubmit}
                type="submit"
                className="w-full">
                Create Trip
            </Button>
        </div>
    )
}

export default TripForm;