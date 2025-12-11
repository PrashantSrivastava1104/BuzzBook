
import pool from './config/db.js';

const TRIPS = [
    { name: 'Mumbai → Pune', start_time: new Date(Date.now() + 3600000).toISOString(), total_seats: 40, price: 450 },
    { name: 'Delhi → Jaipur', start_time: new Date(Date.now() + 7200000).toISOString(), total_seats: 40, price: 550 },
    { name: 'Bangalore → Chennai', start_time: new Date(Date.now() + 86400000).toISOString(), total_seats: 40, price: 650 },
    { name: 'Hyderabad → Vijayawada', start_time: new Date(Date.now() + 172800000).toISOString(), total_seats: 40, price: 400 },
    { name: 'Kolkata → Bhubaneswar', start_time: new Date(Date.now() + 259200000).toISOString(), total_seats: 40, price: 500 },
    { name: 'Ahmedabad → Udaipur', start_time: new Date(Date.now() + 345600000).toISOString(), total_seats: 40, price: 480 }
];

const seed = async () => {
    try {
        console.log('🌱 Starting Database Seed...');

        // 1. Clear existing data
        console.log('🗑️  Clearing existing data...');
        await pool.query('DELETE FROM seats');
        await pool.query('DELETE FROM bookings');
        await pool.query('DELETE FROM trips');

        // 2. Insert Trips
        console.log('🚌 Inserting Trips...');
        for (const trip of TRIPS) {
            const tripResult = await pool.query(
                'INSERT INTO trips (name, start_time, total_seats, price) VALUES ($1, $2, $3, $4) RETURNING id',
                [trip.name, trip.start_time, trip.total_seats, trip.price]
            );
            const tripId = tripResult.rows[0].id;
            console.log(`   > Created trip: ${trip.name} (ID: ${tripId})`);

            // 3. Insert Seats for this trip
            // Concurrency optimization: specific batch insert if needed, but loop is fine for seed
            const seatValues = [];
            for (let i = 1; i <= 40; i++) {
                // ($1, $2, $3)
                // trip_id, seat_number, status
                await pool.query(
                    'INSERT INTO seats (trip_id, seat_number, status) VALUES ($1, $2, $3)',
                    [tripId, i, 'AVAILABLE']
                );
            }
            console.log(`     > Generated 40 seats for trip ${tripId}`);
        }

        console.log('✅ Database Seeded Successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Seeding Failed:', error);
        process.exit(1);
    }
};

seed();
