export interface UserModel {
    id: number;
    name: string;
    email: string;
}

export interface TripModel {
    id: number;
    pickup_location: string;
    dropoff_location: string;
    start_time: string;
    end_time: string;
    total_driving_time: number;
    route_instructions: string[];
    cycle_used: string;
    createdOn: string;
    user: number;
}

export interface LogModel {
    id: number;
    trip: number;
    current_location: string;
    memo: string;
    driving_time: number;
    rest_breaks: number[];
    createdOn: string;
}