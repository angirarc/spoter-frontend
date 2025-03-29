export interface UserModel {
    id: number;
    name: string;
    email: string;
}

export interface TripModel {
    id: number;
    pickup_location: string;
    pickup_name: string;
    dropoff_location: string;
    dropoff_name: string;
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
    location_name: string;
    memo: string;
    driving_time: number;
    rest_breaks: number[];
    createdOn: string;
}

export interface MapBoxFeature {
    type: string;
    id: string;
    geometry: {
        type: string;
        coordinates: number[];
    }
    properties: {
        mapbox_id: string;
        feature_type: string;
        full_address: string;
        name: string;
        name_preferred: string;
        coordinates: {
            longitude: number;
            latitude: number;
        },
        place_formatted: string;
        bbox: number[];
    }
}

export interface MapBoxResponse {
    type: string;
    features: MapBoxFeature[];
    attribution: string;
}

export interface MapboxDirectionsWaypoint {
    distance: number;
    name: string;
    location: number[];
}

export interface MapboxDirectionsRoute {
    weight_name: string;
    weight: number;
    duration: number;
    distance: number;
    legs: {
        notifications: {
            details: {
                actual_value: string;
                message: string;
            },
            subtype: string;
            type: string;
            geometry_index_end: number;
            geometry_index_start: number;
        }[];
        via_waypoints: number[];
        admins: {
            iso_3166_1_alpha3: string;
            iso_3166_1: string;
        }[];
        weight: number;
        duration: number;
        steps: any[];
        distance: number;
        summary: string;
    }[]
    geometry: string;
}   

export interface MapboxDirectionsResponse {
    code: string;
    uuid: string;
    waypoints: MapboxDirectionsWaypoint[];
    routes: MapboxDirectionsRoute[];
}