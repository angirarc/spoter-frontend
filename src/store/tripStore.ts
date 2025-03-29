'use client';

import { create } from 'zustand';

import { LogPayload, TripPayload } from '@/lib/types/payloads';
import { TripModel, LogModel, MapBoxFeature, MapBoxResponse, MapboxDirectionsResponse } from '@/lib/types/models';
import { initialState, LoadingStatus, newStatus } from '@/lib/types/state';

import { handleError } from '@/lib/utils';
import { tripService } from '@/lib/services/tripService';
import axios from 'axios';

interface TripState {
    state: LoadingStatus;
    trips: TripModel[];
    instructions: string[];
    selectedTrip?: TripModel;
    logs: LogModel[];
    selectedLog?: LogModel;
    searchResults: MapBoxFeature[];
    userLocation?: MapBoxFeature;

    searchLocations: (str: string) => Promise<void>;
    reverseGeocoding: (lang: number, long: number, callback?: (feat: MapBoxFeature) => void) => Promise<void>;
    getTripInstructions: (latitude: number[], longitude: number[]) => Promise<void>;
    getTrips: () => Promise<void>;
    getSingleTrip: (id: number) => Promise<void>;
    selectTrip: (trip?: TripModel) => void;
    selectLog: (log?: LogModel) => void;
    createTrip: (payload: TripPayload, callback?: () => void) => Promise<void>;
    updateTrip: (id: number, payload: TripPayload, callback?: () => void) => Promise<void>;
    getTripLogs: (id: number) => Promise<void>;
    createTripLog: (id: number, payload: LogPayload, callback?: () => void) => Promise<void>;
    updateTripLog: (id: number, payload: LogPayload, callback?: () => void) => Promise<void>;
    deleteTripLog: (id: number) => Promise<void>;
    endTrip: (id: number) => Promise<void>;
    deleteTrip: (id: number) => Promise<void>;
}

let initialStatus: LoadingStatus = {}
let functions = ['getTrips', 'createTrip', 'searchLocations', 'reverseGeocoding', 'getSingleTrip', 'updateTrip', 'getTripLogs', 'createTripLog', 'updateTripLog', 'deleteTripLog', 'endTrip', 'deleteTrip']
functions.forEach((func) => initialStatus[func] = initialState);

const mapBoxApi = process.env.NEXT_PUBLIC_MAPBOX_API_KEY || '';

export const useTripStore = create<TripState>((set, get) => ({
    state: initialStatus,
    trips: [],
    instructions: [],
    selectedTrip: undefined,
    logs: [],
    selectedLog: undefined,
    searchResults: [],
    userLocation: undefined,

    searchLocations: async (str) => {
        const { state } = get();
        if (state?.searchLocations?.status === 'LOADING') return;
        try {
            set({ state: newStatus(state, 'searchLocations', 'LOADING') });
            const resp = await axios.get<MapBoxResponse>(`https://api.mapbox.com/search/geocode/v6/forward?q=${str}&access_token=${mapBoxApi}`);
            set({ searchResults: resp.data.features, state: newStatus(state, 'searchLocations', 'SUCCESS') });
        } catch (error) {
            handleError(error, set, state, 'searchLocations');
        }
    },
    reverseGeocoding: async (lat, long, callback) => {
        const { state } = get();
        if (state?.reverseGeocoding?.status === 'LOADING') return;
        try {
            set({ state: newStatus(state, 'reverseGeocoding', 'LOADING') });
            console.log({state})
            const resp = await axios.get<MapBoxResponse>(`https://api.mapbox.com/search/geocode/v6/reverse?longitude=${long}&latitude=${lat}&access_token=${mapBoxApi}`);
            console.log({resp})
            let patch: any = { searchResults: resp.data.features, state: newStatus(state, 'reverseGeocoding', 'SUCCESS') };
            if (resp.data.features?.length > 0) {
                patch['userLocation'] = resp.data.features[0];
                if (callback) callback(resp.data.features[0])
            }
            set(patch);
        } catch (error) {
            handleError(error, set, state, 'reverseGeocoding');
        }
    },
    getTripInstructions: async (latitude, longitude) => {
        const { state } = get();
        if (state?.getTripInstructions?.status === 'LOADING') return;
        try {
            const lat = latitude.join(',');
            const long = longitude.join(',');
            set({ state: newStatus(state, 'getTripInstructions', 'LOADING') });
            const resp = await axios.get<MapboxDirectionsResponse>(`https://api.mapbox.com/directions/v5/mapbox/driving/${lat};${long}?access_token=${mapBoxApi}`);
            let instructions: string[] = [];
            resp.data.routes.forEach((route) => 
                route.legs.forEach((leg) => 
                    leg.notifications.forEach((notif) => 
                        instructions.push(notif.details.message))))
            set({ instructions, state: newStatus(state, 'getTripInstructions', 'SUCCESS') });
        } catch (error) {
            handleError(error, set, state, 'getTripInstructions');
        }
    },
    getTrips: async () => {
        const { state } = get();
        if (state?.getTrips?.status === 'LOADING') return;
        try {
            set({ state: newStatus(state, 'getTrips', 'LOADING') });
            const resp = await tripService.getTrips();
            set({ trips: resp, state: newStatus(state, 'getTrips', 'SUCCESS') });
        } catch (error) {
            handleError(error, set, state, 'getTrips');
        }
    },
    createTrip: async (payload, callback) => {
        const { state, getTrips } = get();
        if (state?.createTrip?.status === 'LOADING') return;
        try {
            set({ state: newStatus(state, 'createTrip', 'LOADING') });
            const resp = await tripService.createTrip(payload);
            set({ state: newStatus(state, 'createTrip', 'SUCCESS'), selectedTrip: resp });
            getTrips();
            if (callback) callback();
        } catch (error) {
            handleError(error, set, state, 'createTrip');
        }
    },
    getSingleTrip: async (id) => {
        const { state } = get();
        if (state?.getSingleTrip?.status === 'LOADING') return;
        try {
            set({ state: newStatus(state, 'getSingleTrip', 'LOADING') });
            await tripService.getSingleTrip(id);
            set({ state: newStatus(state, 'getSingleTrip', 'SUCCESS') });
        } catch (error) {
            handleError(error, set, state, 'getSingleTrip');
        }
    },
    selectTrip: (trip) => {
        set({ selectedTrip: trip });
    },
    selectLog: (log) => {
        set({ selectedLog: log });
    },
    updateTrip: async (id, payload, callback) => {
        const { state } = get();
        if (state?.updateTrip?.status === 'LOADING') return;
        try {
            set({ state: newStatus(state, 'updateTrip', 'LOADING') });
            await tripService.updateTrip(id, payload);
            const resp = await tripService.getSingleTrip(id);
            set({ selectedTrip: resp, state: newStatus(state, 'updateTrip', 'SUCCESS') });
            if (callback) callback();
        } catch (error) {
            handleError(error, set, state, 'updateTrip');
        }
    },
    getTripLogs: async (id) => {
        const { state } = get();
        if (state?.getTripLogs?.status === 'LOADING') return;
        try {
            set({ state: newStatus(state, 'getTripLogs', 'LOADING') });
            const resp = await tripService.getTripLogs(id);
            set({ logs: resp, state: newStatus(state, 'getTripLogs', 'SUCCESS') });
        } catch (error) {
            handleError(error, set, state, 'getTripLogs');
        }
    },
    createTripLog: async (id, payload, callback) => {
        const { state, getTripLogs, selectedTrip } = get();
        if (state?.createTripLog?.status === 'LOADING') return;
        try {
            set({ state: newStatus(state, 'createTripLog', 'LOADING') });
            await tripService.createTripLog(id, payload);

            if (selectedTrip) getTripLogs(selectedTrip.id);
            const resp = await tripService.getSingleTrip(id);
            set({ selectedTrip: resp, state: newStatus(state, 'createTripLog', 'SUCCESS') });
            if (callback) callback();
        } catch (error) {
            handleError(error, set, state, 'createTripLog');
        }
    },
    updateTripLog: async (id, payload, callback) => {
        const { state, getTripLogs, selectedTrip } = get();
        if (state?.updateTripLog?.status === 'LOADING') return;
        try {
            set({ state: newStatus(state, 'updateTripLog', 'LOADING') });
            await tripService.updateTripLog(id, payload);
            set({ state: newStatus(state, 'updateTripLog', 'SUCCESS') });

            if (selectedTrip) getTripLogs(selectedTrip.id);
            if (callback) callback();
        } catch (error) {
            handleError(error, set, state, 'updateTripLog');
        }
    },
    deleteTripLog: async (id) => {
        const { state, getTripLogs, selectedTrip } = get();
        if (state?.deleteTripLog?.status === 'LOADING') return;
        try {
            set({ state: newStatus(state, 'deleteTripLog', 'LOADING') });
            await tripService.deleteTripLog(id);
            set({ state: newStatus(state, 'deleteTripLog', 'SUCCESS') });

            if (selectedTrip) getTripLogs(selectedTrip.id);
        } catch (error) {
            handleError(error, set, state, 'deleteTripLog');
        }
    },
    endTrip: async (id) => {
        const { state, getTrips } = get();
        if (state?.endTrip?.status === 'LOADING') return;
        try {
            set({ state: newStatus(state, 'endTrip', 'LOADING') });
            await tripService.endTrip(id);
            const resp = await tripService.getSingleTrip(id);
            set({ selectedTrip: resp, state: newStatus(state, 'endTrip', 'SUCCESS') });
            getTrips();
        } catch (error) {
            handleError(error, set, state, 'endTrip');
        }
    },
    deleteTrip: async (id) => {
        const { state, getTrips } = get();
        if (state?.deleteTrip?.status === 'LOADING') return;
        try {
            set({ state: newStatus(state, 'deleteTrip', 'LOADING') });
            await tripService.deleteTrip(id);
            set({ state: newStatus(state, 'deleteTrip', 'SUCCESS'), selectedTrip: undefined, trips: get().trips.filter((trip) => trip.id !== id), logs: [], selectedLog: undefined, instructions: [], searchResults: []  });
            getTrips();
        } catch (error) {
            handleError(error, set, state, 'deleteTrip');
        }
    }
}));