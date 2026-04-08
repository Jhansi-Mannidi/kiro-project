-- 001_init.sql

CREATE TABLE IF NOT EXISTS airlines (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS airports (
    id SERIAL PRIMARY KEY,
    code VARCHAR(3) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS flights (
    id SERIAL PRIMARY KEY,
    airline_id INTEGER NOT NULL REFERENCES airlines(id),
    departure_airport_id INTEGER NOT NULL REFERENCES airports(id),
    arrival_airport_id INTEGER NOT NULL REFERENCES airports(id),
    departure_time TIMESTAMP NOT NULL,
    arrival_time TIMESTAMP NOT NULL,
    duration INTERVAL NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS passengers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    passenger_id INTEGER NOT NULL REFERENCES passengers(id),
    flight_id INTEGER NOT NULL REFERENCES flights(id),
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    seat VARCHAR(10),
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_methods (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL REFERENCES bookings(id),
    payment_method_id INTEGER NOT NULL REFERENCES payment_methods(id),
    amount DECIMAL(10, 2) NOT NULL,
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_flights_airline_id ON flights (airline_id);
CREATE INDEX idx_flights_departure_airport_id ON flights (departure_airport_id);
CREATE INDEX idx_flights_arrival_airport_id ON flights (arrival_airport_id);
CREATE INDEX idx_bookings_passenger_id ON bookings (passenger_id);
CREATE INDEX idx_bookings_flight_id ON bookings (flight_id);
CREATE INDEX idx_payments_booking_id ON payments (booking_id);
CREATE INDEX idx_payments_payment_method_id ON payments (payment_method_id);