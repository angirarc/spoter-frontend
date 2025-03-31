import Select from 'react-select';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from "react";
// import { Check, ChevronsUpDown } from "lucide-react";

import { MapBoxFeature, TripModel } from '@/lib/types/models';

// import { cn } from "@/lib/utils";
import { useTripStore } from "@/store/tripStore";

// import {
//     Command,
//     CommandEmpty,
//     CommandGroup,
//     CommandInput,
//     CommandItem,
//     CommandList,
// } from "@/components/ui/command"
// import {
//     Popover,
//     PopoverContent,
//     PopoverTrigger,
// } from "@/components/ui/popover"
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import AlertNotif from './alert-notif';
import { ClipLoader } from 'react-spinners';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const getCoordinates = (location: string) => {
    const coords = location.split(', ');
    return {
        latitude: parseFloat(coords[0]),
        longitude: parseFloat(coords[1])
    };
}

export const LocationSelect = ({ value, setValue }: { value?: MapBoxFeature, setValue: (value?: MapBoxFeature) => void }) => {
    const { searchResults, searchLocations, state } = useTripStore();

    const debouncedSearch = useCallback(
        debounce((value: string) => {
            // Remove the async/await as searchLocations already returns a Promise
            searchLocations(value);
        }, 500),
        [searchLocations],
    );

    const isLoading = state.searchLocations.status === 'LOADING';
    const changeValue = (selected: any) => {
        if (selected) {
            let eq = searchResults.find(res => res.id === selected.value);
            if (eq) setValue(eq);
        } else {
            setValue(undefined);
        }
    }

    // Make sure value is a valid MapBoxFeature before accessing its properties
    let formattedValue = null;
    if (value && typeof value === 'object' && value.id && value.properties && value.properties.full_address) {
        formattedValue = {
            value: value.id,
            label: value.properties.full_address
        };
    }

    return (
        <Select
            isClearable={true}
            onChange={changeValue}
            options={(isLoading ? [] : searchResults).map(res => ({
                value: res.id,
                label: res.properties.full_address,
            }))}
            isLoading={isLoading}
            onInputChange={e => debouncedSearch(e)}
            value={formattedValue} />
    )
}

const TripForm = ({
    callback,
    trip
}: {
    trip?: TripModel;
    callback?: () => void
}) => {
    const { instructions, createTrip, updateTrip, state, getTripInstructions } = useTripStore();
    const [cycle, setCycle] = useState<any>(trip ? { label: trip.cycle_used, value: trip.cycle_used } : undefined);
    const [pickup, setPickup] = useState<any>(trip ? {
        id: trip.pickup_name,
        properties: {
            coordinates: getCoordinates(trip.pickup_location),
            full_address: trip.pickup_name
        }
    } : undefined);
    const [dropoff, setDropoff] = useState<any>(trip ? {
        id: trip.dropoff_name,
        properties: {
            coordinates: getCoordinates(trip.dropoff_location),
            full_address: trip.dropoff_name
        }
    } : undefined);


    const options = [
        { value: '14 Day Trip', label: '14 Day Trip' },
        { value: '30 Day Trip', label: '30 Day Trip' },
        { value: '35 Day Trip', label: '35 Day Trip' },
    ];

    const currState = trip ? state.updateTrip : state.createTrip;

    const handleSubmit = () => {
        const payload = {
            pickup_location: `${pickup?.properties.coordinates.longitude}, ${pickup?.properties.coordinates.latitude}`,
            pickup_name: pickup?.properties.full_address || '',
            dropoff_location: `${dropoff?.properties.coordinates.longitude}, ${dropoff?.properties.coordinates.latitude}`,
            dropoff_name: dropoff?.properties.full_address || '',
            cycle_used: cycle ? cycle?.value : '',
            route_instructions: ['Begin', ...instructions]
        }

        const clbk = () => {
            setCycle(undefined);
            setPickup(undefined);
            setDropoff(undefined);
            if (callback) callback()
        }

        if (trip) {
            updateTrip(trip.id, payload, clbk);
        } else {
            createTrip(payload, clbk);
        }
    }

    const isLoading = currState.status === 'LOADING';

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
                <Select
                    options={options}
                    value={cycle}
                    onChange={setCycle} />
            </div>
            {currState.status === 'ERROR' &&
                <AlertNotif
                    type="destructive"
                    title={ 'An Error Was Encountered' }
                    message={currState.message ?? '' } />
            }
            <Button
                onClick={handleSubmit}
                type="submit"
                disabled={isLoading}
                className="w-full flex">
                {
                    isLoading &&
                    <ClipLoader color='white' size="14" />
                }
                {trip ? 'Update' : 'Create'} Trip
            </Button>
        </div>
    )
}

export default TripForm;