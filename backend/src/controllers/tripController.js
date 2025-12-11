
import pool from '../config/db.js';

export const createTrip = async (req, res) => {
    const { name, start_time, total_seats, price } = req.body;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Create Trip
        const tripResult = await client.query(
            'INSERT INTO trips (name, start_time, total_seats, price) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, start_time, total_seats, price || 0]
        );
        const trip = tripResult.rows[0];

        // 2. Generate Seats (Batch Insert)
        // Construct query: INSERT INTO seats (trip_id, seat_number) VALUES ($1, $2), ($1, $3), ...
        // Note: For large numbers, this approach is fine (e.g. 50 seats).
        const seatValues = [];
        const params = [];
        let paramIndex = 1;

        for (let i = 1; i <= total_seats; i++) {
            seatValues.push(`($${paramIndex}, $${paramIndex + 1})`);
            params.push(trip.id, i);
            paramIndex += 2;
        }

        const seatQuery = `INSERT INTO seats (trip_id, seat_number) VALUES ${seatValues.join(', ')}`;
        await client.query(seatQuery, params);

        await client.query('COMMIT');

        res.status(201).json({ message: 'Trip and seats created successfully', trip });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ message: 'Error creating trip', error: err.message });
    } finally {
        client.release();
    }
};

export const getTrips = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM trips ORDER BY start_time ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const getTripDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const tripResult = await pool.query('SELECT * FROM trips WHERE id = $1', [id]);
        if (tripResult.rows.length === 0) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        // Get seats
        const seatsResult = await pool.query('SELECT * FROM seats WHERE trip_id = $1 ORDER BY seat_number ASC', [id]);

        res.json({ trip: tripResult.rows[0], seats: seatsResult.rows });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
