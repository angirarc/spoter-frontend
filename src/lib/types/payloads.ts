export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
}

export interface TripPayload {
    pickup_location: string;
    pickup_name: string;
    dropoff_location: string;
    dropoff_name: string;
    route_instructions: string[];
    cycle_used: string;
}

export interface LogPayload {
    current_location: string;
    location_name: string;
    memo: string;
    driving_time: number;
    rest_breaks: number[];
}