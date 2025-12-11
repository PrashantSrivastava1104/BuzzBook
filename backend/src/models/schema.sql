
-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trips/Shows Table
CREATE TABLE IF NOT EXISTS trips (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL, -- "Bus 101" or "Movie X"
    start_time TIMESTAMP NOT NULL,
    total_seats INTEGER NOT NULL,
    price DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings Table (Stores the comprehensive booking info)
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    trip_id INTEGER REFERENCES trips(id),
    seat_ids INTEGER[] NOT NULL, -- Array of seat IDs for easier visual
    total_amount DECIMAL(10, 2),
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'FAILED', 'CANCELLED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP -- For implementing expiry bonus
);

-- Seats Table (The critical resource)
-- We pre-create rows for every seat to enable Row-Level Locking (FOR UPDATE)
CREATE TABLE IF NOT EXISTS seats (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
    seat_number INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'BOOKED')),
    booking_id INTEGER REFERENCES bookings(id) -- Nullable, links to confirmed booking
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_seats_trip ON seats(trip_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
