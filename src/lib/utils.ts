// Type definitions for environment variables and other types

import { twMerge } from "tailwind-merge"
import { clsx, type ClassValue } from "clsx"
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

import { LoadingStatus, newStatus } from "./types/state";
import { clearAuth, getAccessToken } from "./sharePreference";

const API_BASE_URL: string = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000/api';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

class HttpClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.initializeInterceptors();
  }

  private initializeInterceptors() {
    // Request interceptor for adding auth token
    this.instance.interceptors.request.use(
      (config) => {
        const token = getAccessToken();
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for handling common errors
    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        const { response } = error;

        // Handle authentication errors
        if (response && response.status === 401) {
          // Clear token and redirect to login if needed
          clearAuth();
          // For now, we'll just log this as we're assuming the user is authenticated
          console.error('Authentication error: Token expired or invalid');
        }

        // Handle server errors
        if (response && response.status >= 500) {
          console.error('Server error:', response.data);
        }

        return Promise.reject(error);
      }
    );
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.get<T>(url, config);
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.post<T>(url, data, config);
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.put<T>(url, data, config);
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.delete<T>(url, config);
  }

  public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.patch<T>(url, data, config);
  }
}

export const httpClient = new HttpClient();

const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data.message ?? error.request ? 'No Response Received' : 'Unknown error occurred';
  } else if (error instanceof Error) {
    return error.message;
  } else {
    return 'Unknown error occurred';
  }
};

export const handleError = (e: unknown, set: any, status: LoadingStatus, fn: string) => {
  const message = getErrorMessage(e);
  set({ state: newStatus(status, fn, 'ERROR', message, e) });
};