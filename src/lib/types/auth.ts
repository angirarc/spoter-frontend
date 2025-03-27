export interface AuthResponse {
    user: {
        id: number;
        name: string;
        email: string;
    };
    token: string;
}