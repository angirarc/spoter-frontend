'use client';

import { create } from 'zustand';

import { TripPayload } from '@/lib/types/payloads';
import { TripModel, LogModel } from '@/lib/types/models';
import { initialState, LoadingStatus, newStatus } from '@/lib/types/state';

import { handleError } from '@/lib/utils';
import { tripService } from '@/lib/services/tripService';

interface TripState {
    state: LoadingStatus;
    trips: TripModel[];
    selectedTrip?: TripModel;
    logs: LogModel[];
    selectedLog?: LogModel;

    getTrips: () => Promise<void>;
    createTrip: (payload: TripPayload) => Promise<void>;
    getSingleTrip: (id: number) => Promise<void>;
    updateTrip: (id: number, payload: TripPayload) => Promise<void>;
    getTripLogs: (id: number) => Promise<void>;
    createTripLog: (id: number, payload: LogModel) => Promise<void>;
    updateTripLog: (id: number, payload: LogModel) => Promise<void>;
    deleteTripLog: (id: number) => Promise<void>;
    endTrip: (id: number) => Promise<void>;
    deleteTrip: (id: number) => Promise<void>;
}

let initialStatus: LoadingStatus = {}
let functions = ['getTrips', 'createTrip', 'getSingleTrip', 'updateTrip', 'getTripLogs', 'createTripLog', 'updateTripLog', 'deleteTripLog', 'endTrip', 'deleteTrip']
functions.forEach((func) => initialStatus[func] = initialState);

export const useTripStore = create<TripState>((set, get) => ({
    state: initialStatus,
    trips: [],
    selectedTrip: undefined,
    logs: [],
    selectedLog: undefined,
    
    getTrips: async () => {
        const { state } = get();
        try {
            set({ state: newStatus(state, 'getTrips', 'LOADING') });
            const resp = await tripService.getTrips();
            set({ trips: resp, state: newStatus(state, 'getTrips', 'SUCCESS') });
        } catch (error) {
            handleError(error, set, state, 'getTrips');
        }
    },
    createTrip: async (payload) => {
        const { state } = get();
        try {
            set({ state: newStatus(state, 'createTrip', 'LOADING') });
            await tripService.createTrip(payload);
            set({ state: newStatus(state, 'createTrip', 'SUCCESS') });
        } catch (error) {
            handleError(error, set, state, 'createTrip');
        }
    },
    getSingleTrip: async (id) => {
        const { state } = get();
        try {
            set({ state: newStatus(state, 'getSingleTrip', 'LOADING') });
            await tripService.getSingleTrip(id);
            set({ state: newStatus(state, 'getSingleTrip', 'SUCCESS') });
        } catch (error) {
            handleError(error, set, state, 'getSingleTrip');
        }
    },
    updateTrip: async (id, payload) => {
        const { state } = get();
        try {
            set({ state: newStatus(state, 'updateTrip', 'LOADING') });
            await tripService.updateTrip(id, payload);
            set({ state: newStatus(state, 'updateTrip', 'SUCCESS') });
        } catch (error) {
            handleError(error, set, state, 'updateTrip');
        }
    },
    getTripLogs: async (id) => {
        const { state } = get();
        try {
            set({ state: newStatus(state, 'getTripLogs', 'LOADING') });
            const resp = await tripService.getTripLogs(id);
            set({ logs: resp, state: newStatus(state, 'getTripLogs', 'SUCCESS') });
        } catch (error) {
            handleError(error, set, state, 'getTripLogs');
        }
    },
    createTripLog: async (id, payload) => {
        const { state } = get();
        try {
            set({ state: newStatus(state, 'createTripLog', 'LOADING') });
            await tripService.createTripLog(id, payload);
            set({ state: newStatus(state, 'createTripLog', 'SUCCESS') });
        } catch (error) {
            handleError(error, set, state, 'createTripLog');
        }
    },
    updateTripLog: async (id, payload) => {
        const { state } = get();
        try {
            set({ state: newStatus(state, 'updateTripLog', 'LOADING') });
            await tripService.updateTripLog(id, payload);
            set({ state: newStatus(state, 'updateTripLog', 'SUCCESS') });
        } catch (error) {
            handleError(error, set, state, 'updateTripLog');
        }
    },
    deleteTripLog: async (id) => {
        const { state } = get();
        try {
            set({ state: newStatus(state, 'deleteTripLog', 'LOADING') });
            await tripService.deleteTripLog(id);
            set({ state: newStatus(state, 'deleteTripLog', 'SUCCESS') });
        } catch (error) {
            handleError(error, set, state, 'deleteTripLog');
        }
    },
    endTrip: async (id) => {
        const { state } = get();
        try {
            set({ state: newStatus(state, 'endTrip', 'LOADING') });
            await tripService.endTrip(id);
            set({ state: newStatus(state, 'endTrip', 'SUCCESS') });
        } catch (error) {
            handleError(error, set, state, 'endTrip');
        }
    },
    deleteTrip: async (id) => {
        const { state } = get();
        try {
            set({ state: newStatus(state, 'deleteTrip', 'LOADING') });
            await tripService.endTrip(id);
            set({ state: newStatus(state, 'deleteTrip', 'SUCCESS') });
        } catch (error) {
            handleError(error, set, state, 'deleteTrip');
        }
    }
}));