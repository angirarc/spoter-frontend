'use client';

import * as yup from "yup";
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { Edit2Icon, PlusCircleIcon, ClockIcon, MapPinIcon, TruckIcon } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { TripModel } from '@/lib/types/models';
import { useTripStore } from '@/store/tripStore';
import TripForm from '@/components/trip-form';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AlertNotif from "@/components/alert-notif";
import useToggle from "@/hooks/use-toggle";
import ConfirmDialog from "./confirm-dialog";
import { ClipLoader } from "react-spinners";

interface TripDetailsProps {
  trip: TripModel;
}

const schema = yup.object().shape({
  memo: yup.string().required(),
  driving_time: yup.string(),
  rest_breaks: yup.string(),
});

const TripDetails = ({ trip }: TripDetailsProps) => {
  const { reverseGeocoding, endTrip, userLocation, createTripLog, state } = useTripStore();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLogDialogOpen, setIsLogDialogOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('');

  const [endModal, toggleEndModal] = useToggle();

  const { 
      reset,
      register, 
      getValues,
      formState: { isValid } 
  } = useForm({
      resolver: yupResolver(schema)
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        reverseGeocoding(pos.coords.latitude, pos.coords.longitude);
        setCurrentLocation(`${pos.coords.latitude}, ${pos.coords.longitude}`);
      });
    }
  }, [isLogDialogOpen, reverseGeocoding]);

  const current = userLocation?.properties.full_address ?? currentLocation;

  const logIsLoading = state.createTripLog.status === 'LOADING';

  const handleCreateLog = async () => {
    const vals = getValues();
    const breaks = (vals.rest_breaks ?? '').split(',').map(b => parseInt(b.trim())).filter(b => !isNaN(b));

    await createTripLog(trip.id, {
      current_location: currentLocation,
      location_name: current,
      memo: vals.memo,
      driving_time: vals.driving_time ? parseFloat(vals.driving_time) : 0,
      rest_breaks: breaks
    }, () => {
      reset();
      setIsLogDialogOpen(false);
    });
  };

  const handleEndTrip = async () => {
    await endTrip(trip.id);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not started';
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
  };

  const getTotalDrivingTime = () => {
    const hours = Math.floor(trip.total_driving_time / 60);
    const minutes = trip.total_driving_time % 60;
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="px-2 mb-4">

      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold">{trip.pickup_name} → {trip.dropoff_name}</h3>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <Badge variant={trip.end_time ? 'outline' : trip.start_time ? 'default' : 'outline'}>
              {trip.end_time ? 'Completed' : trip.start_time ? 'In Progress' : 'Not Started'}
            </Badge>
            <span className="ml-2">{trip.cycle_used}</span>
          </div>
        </div>
        {!trip.end_time && (
          <Button variant="ghost" size="icon" onClick={() => setIsEditDialogOpen(true)}>
            <Edit2Icon className="h-4 w-4" />
          </Button>
        )}
      </div>

      <ConfirmDialog
        open={endModal}
        toggle={toggleEndModal}
        onConfirm={handleEndTrip}
        title="Are you sure you want to end this trip?"
        description="This action cannot be undone. This will end this trip." />
      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div className="flex items-center">
          <MapPinIcon className="h-4 w-4 mr-2 text-gray-500" />
          <span>From: {trip.pickup_name}</span>
        </div>
        <div className="flex items-center">
          <MapPinIcon className="h-4 w-4 mr-2 text-gray-500" />
          <span>To: {trip.dropoff_name}</span>
        </div>
        <div className="flex items-center">
          <ClockIcon className="h-4 w-4 mr-2 text-gray-500" />
          <span>Start: {formatDate(trip.start_time)}</span>
        </div>
        <div className="flex items-center">
          <ClockIcon className="h-4 w-4 mr-2 text-gray-500" />
          <span>End: {formatDate(trip.end_time)}</span>
        </div>
        {trip.total_driving_time > 0 && (
          <div className="flex items-center col-span-2">
            <TruckIcon className="h-4 w-4 mr-2 text-gray-500" />
            <span>Total Driving Time: {getTotalDrivingTime()}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-4">
        {!trip.end_time && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLogDialogOpen(true)}
            className="flex items-center"
          >
            <PlusCircleIcon className="h-4 w-4 mr-1" />
            Add Log
          </Button>
        )}
        {trip.start_time && !trip.end_time && (
          <Button
            variant="default"
            size="sm"
            onClick={toggleEndModal}
          >
            End Trip
          </Button>
        )}
      </div>

      {/* Edit Trip Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Trip</DialogTitle>
          </DialogHeader>
          <TripForm 
            trip={trip}
            callback={() => setIsEditDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Add Log Dialog */}
      <Dialog open={isLogDialogOpen} onOpenChange={setIsLogDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Trip Log</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            { state.createTripLog.status === 'ERROR' &&
              <AlertNotif
                type="destructive"
                title="An Error Occurred"
                message={ state.createTripLog.message ?? '' } />
            }
            { state.createTripLog.status === 'SUCCESS' &&
              <AlertNotif
                type="default"
                title="Success!"
                message="Trip Log Created Successfully" />
            }
            <div className="grid gap-2">
              <Label htmlFor="location">Current Location</Label>
              <Input
                id="location"
                type="text"
                disabled
                value={current}
                placeholder={ state.reverseGeocoding.status === 'LOADING' ? "Getting your location..." :  state.reverseGeocoding.status === 'ERROR' ? "Failed to get your location" : "Current Location" }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="memo">Memo</Label>
              <Textarea
                id="memo"
                placeholder="Type your message here."
                {...register('memo')}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="time">Driving Time (minutes)</Label>
              <Input
                id="time"
                type="number"
                placeholder="Driving Time"
                {...register('driving_time')}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="breaks">Rest Breaks (comma separated minutes)</Label>
              <Input
                id="breaks"
                type="text"
                placeholder="15, 30, 45"
                {...register('rest_breaks')}
              />
            </div>
            <Button
              onClick={handleCreateLog}
              disabled={logIsLoading || !isValid}
              className="w-full flex">
              {
                  logIsLoading &&
                  <ClipLoader color='white' size="14" />
              }
              Create New Log
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TripDetails;