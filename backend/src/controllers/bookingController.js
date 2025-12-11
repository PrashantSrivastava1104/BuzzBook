
import pool from '../config/db.js';

export const createBooking = async (req, res) => {
    // Expect: { tripId: 1, seatIds: [1, 2] }
    // User is attached by protect middleware: req.user.id
    const { tripId, seatIds } = req.body;
    const userId = req.user ? req.user.id : req.body.userId; // Fallback for testing w/o auth

    if (!seatIds || seatIds.length === 0) {
        return res.status(400).json({ message: 'No seats selected' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // ---------------------------------------------------------
        // CRITICAL: CONCURRENCY CONTROL
        // ---------------------------------------------------------
        // Lock the selected seats rows.
        // FOR UPDATE ensures that if another transaction tries to select these rows
        // for update, it will wait until this transaction completes.
        // We select the status to check if they are already booked.

        // Construct parametrized query for IN clause
        const placeholders = seatIds.map((_, i) => `$${i + 1}`).join(',');
        const q = `SELECT id, seat_number, status FROM seats WHERE id IN (${placeholders}) FOR UPDATE`;

        const lockedSeats = await client.query(q, seatIds);

        // 1. Validation: Check if we found all seats
        if (lockedSeats.rows.length !== seatIds.length) {
            throw new Error('One or more invalid seat IDs');
        }

        // 2. Validation: Check if any is already BOOKED
        const alreadyBooked = lockedSeats.rows.filter(seat => seat.status === 'BOOKED');
        if (alreadyBooked.length > 0) {
            const bookedSeatNumbers = alreadyBooked.map(s => s.seat_number).join(', ');
            // We must ROLLBACK before returning
            await client.query('ROLLBACK');
            return res.status(409).json({
                message: `Concurrency Error: Seats ${bookedSeatNumbers} are already booked. Please choose others.`
            });
        }

        // 3. Create Booking Record
        // (Optional: Calculate price from trip)
        const bookingRes = await client.query(
            'INSERT INTO bookings (user_id, trip_id, seat_ids, status) VALUES ($1, $2, $3, $4) RETURNING id',
            [userId, tripId, seatIds, 'CONFIRMED'] // Default confirmed for now
        );
        const bookingId = bookingRes.rows[0].id;

        // 4. Update Seats Status
        const updateQuery = `UPDATE seats SET status = 'BOOKED', booking_id = $1 WHERE id IN (${placeholders})`;
        await client.query(updateQuery, [bookingId, ...seatIds]);

        await client.query('COMMIT');

        res.status(201).json({
            message: 'Booking successful',
            bookingId,
            seats: lockedSeats.rows.map(s => s.seat_number)
        });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Booking Error:', err);
        res.status(500).json({ message: 'Booking failed', error: err.message });
    } finally {
        client.release();
    }
};

export const getUserBookings = async (req, res) => {
    // TODO: Implement get user bookings
    const userId = req.user ? req.user.id : req.query.userId;
    try {
        const result = await pool.query('SELECT * FROM bookings WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
