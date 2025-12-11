
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// --- Mock Data ---
let USERS = [];
let TRIPS = [
    { id: 1, name: 'Mumbai → Pune', start_time: new Date(Date.now() + 3600000).toISOString(), total_seats: 40, price: 450 },
    { id: 2, name: 'Delhi → Jaipur', start_time: new Date(Date.now() + 7200000).toISOString(), total_seats: 40, price: 550 },
    { id: 3, name: 'Bangalore → Chennai', start_time: new Date(Date.now() + 86400000).toISOString(), total_seats: 40, price: 650 },
    { id: 4, name: 'Hyderabad → Vijayawada', start_time: new Date(Date.now() + 172800000).toISOString(), total_seats: 40, price: 400 },
    { id: 5, name: 'Kolkata → Bhubaneswar', start_time: new Date(Date.now() + 259200000).toISOString(), total_seats: 40, price: 500 },
    { id: 6, name: 'Ahmedabad → Udaipur', start_time: new Date(Date.now() + 345600000).toISOString(), total_seats: 40, price: 480 }
];
let BOOKINGS = [];

// Generate Seats for trips
const generateSeats = (tripId) => {
    return Array.from({ length: 40 }, (_, i) => ({
        id: (tripId * 100) + (i + 1),
        trip_id: tripId,
        seat_number: i + 1,
        status: 'AVAILABLE'
    }));
};

let SEATS = TRIPS.flatMap(trip => generateSeats(trip.id));

// Unbook seat 9 for Delhi → Jaipur (trip_id: 2, seat_number: 9)
const seat9Index = SEATS.findIndex(s => s.trip_id === 2 && s.seat_number === 9);
if (seat9Index !== -1 && SEATS[seat9Index].status === 'BOOKED') {
    SEATS[seat9Index].status = 'AVAILABLE';
    console.log('✅ Unbookked seat 9 for Delhi → Jaipur');
}

// --- Routes ---

// Auth (Mock)
app.post('/api/auth/login', (req, res) => {
    res.json({
        token: 'mock-jwt-token',
        user: { id: 1, name: 'Test User', email: req.body.email, role: 'user' }
    });
});

app.post('/api/auth/register', (req, res) => {
    res.json({
        token: 'mock-jwt-token',
        user: { id: Date.now(), name: req.body.name, email: req.body.email, role: 'user' }
    });
});

// Trips
app.get('/api/trips', (req, res) => {
    const tripsWithAvailability = TRIPS.map(trip => {
        const availableSeats = SEATS.filter(s => s.trip_id === trip.id && s.status === 'AVAILABLE').length;
        return { ...trip, available_seats: availableSeats };
    });
    res.json(tripsWithAvailability);
});

app.get('/api/trips/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const trip = TRIPS.find(t => t.id === id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const tripSeats = SEATS.filter(s => s.trip_id === id);
    res.json({ trip, seats: tripSeats });
});

app.post('/api/trips', (req, res) => {
    const newTrip = { ...req.body, id: TRIPS.length + 1 };
    TRIPS.push(newTrip);
    SEATS = [...SEATS, ...generateSeats(newTrip.id)];
    res.json({ message: 'Trip created', trip: newTrip });
});

// Bookings
app.post('/api/bookings', (req, res) => {
    const { tripId, seatIds } = req.body;

    // Check availability
    const taken = SEATS.filter(s => seatIds.includes(s.id) && s.status === 'BOOKED');
    if (taken.length > 0) {
        return res.status(409).json({ message: `Concurrency Error (Mock): Seats ${taken.map(t => t.seat_number)} are already booked.` });
    }

    // Book them
    SEATS = SEATS.map(s => {
        if (seatIds.includes(s.id)) return { ...s, status: 'BOOKED' };
        return s;
    });

    res.status(201).json({ message: 'Booking successful (Mock)', bookingId: Date.now() });
});

app.listen(PORT, () => {
    console.log(`\nAllows full frontend testing without Postgres!`);
    console.log(`>>> MOCK SERVER running on http://localhost:${PORT}`);
});
