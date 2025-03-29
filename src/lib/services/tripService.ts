import { httpClient } from '@/lib/utils';
import { LogModel, TripModel } from '../types/models';
import { TripPayload, LogPayload } from '@/lib/types/payloads';

class TripService {
  async getTrips(): Promise<TripModel[]> {
    try {
      const response = await httpClient.get<TripModel[]>('/trips/');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createTrip(payload: TripPayload): Promise<TripModel> {
    try {
      const response = await httpClient.post<TripModel>(
        '/trips/',
        payload
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getSingleTrip(id: number): Promise<TripModel> {
    try {
      const response = await httpClient.get<TripModel>(`/trips/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateTrip(id: number, payload: TripPayload): Promise<TripModel> {
    try {
      const response = await httpClient.patch<TripModel>(`/trips/${id}`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getTripLogs(id: number): Promise<LogModel[]> {
    try {
      const response = await httpClient.get<LogModel[]>(`/trips/${id}/logs`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createTripLog(id: number, payload: LogPayload): Promise<LogModel> {
    try {
      const response = await httpClient.post<LogModel>(`/trips/${id}/logs`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateTripLog(id: number, payload: LogPayload): Promise<LogModel> {
    try {
      const response = await httpClient.patch<LogModel>(`/logs/${id}`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteTripLog(id: number): Promise<null> {
    try {
      const response = await httpClient.delete<null>(`/logs/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async endTrip(id: number): Promise<LogModel> {
    try {
      const response = await httpClient.patch<LogModel>(`/trips/${id}/end`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteTrip(id: number): Promise<null> {
    try {
      const response = await httpClient.delete<null>(`/trips/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const tripService = new TripService();