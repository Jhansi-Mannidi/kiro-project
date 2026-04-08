-- 001_init.sql
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash BYTEA NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trains (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS routes (
    id SERIAL PRIMARY KEY,
    train_id INTEGER NOT NULL REFERENCES trains(id),
    origin VARCHAR(50) NOT NULL,
    destination VARCHAR(50) NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (train_id, origin, destination)
);

CREATE TABLE IF NOT EXISTS seats (
    id SERIAL PRIMARY KEY,
    route_id INTEGER NOT NULL REFERENCES routes(id),
    seat_number VARCHAR(10) NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    seat_id INTEGER NOT NULL REFERENCES seats(id),
    booking_time TIME NOT NULL,
    total_cost DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (user_id, seat_id)
);

CREATE TABLE IF NOT EXISTS payment_methods (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    method VARCHAR(50) NOT NULL,
    card_number VARCHAR(20) NOT NULL,
    expiration_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_routes_train_id ON routes (train_id);
CREATE INDEX IF NOT EXISTS idx_seats_route_id ON seats (route_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings (user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods (user_id);