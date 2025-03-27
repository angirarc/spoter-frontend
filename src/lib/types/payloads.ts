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
    dropoff_location: string;
    route_instructions: string[];
    cycle_used: string;
}

export interface LogPayload {
    current_location: string;
    memo: string;
    driving_time: number;
    rest_breaks: number[];
}