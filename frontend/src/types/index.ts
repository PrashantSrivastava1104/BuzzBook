
export interface User {
    id: number;
    name: string;
    email: string;
    role: 'user' | 'admin';
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface Trip {
    id: number;
    name: string;
    start_time: string;
    total_seats: number;
    price: number;
}

export interface Seat {
    id: number;
    trip_id: number;
    seat_number: number;
    status: 'AVAILABLE' | 'BOOKED' | 'LOCKED'; // LOCKED is usually internal but good to have
    booking_id?: number;
}

export interface TripDetails {
    trip: Trip;
    seats: Seat[];
}
