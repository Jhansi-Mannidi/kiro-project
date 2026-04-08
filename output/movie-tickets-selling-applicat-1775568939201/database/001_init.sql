-- 001_init.sql

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cinemas (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(200) NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    country VARCHAR(50) NOT NULL,
    pincode INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS screens (
    id SERIAL PRIMARY KEY,
    cinema_id INTEGER NOT NULL REFERENCES cinemas(id),
    screen_number SMALLINT NOT NULL,
    row_count SMALLINT,
    seat_count SMALLINT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (cinema_id, screen_number)
);

CREATE TABLE IF NOT EXISTS movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    release_date DATE NOT NULL,
    duration TIME NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS showtimes (
    id SERIAL PRIMARY KEY,
    movie_id INTEGER NOT NULL REFERENCES movies(id),
    screen_id INTEGER NOT NULL REFERENCES screens(id),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (movie_id, screen_id, start_time)
);

CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    showtime_id INTEGER NOT NULL REFERENCES showtimes(id),
    seat_numbers VARCHAR(50) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_methods (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    method VARCHAR(20) NOT NULL,
    card_number VARCHAR(16) NOT NULL,
    expiration_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_transactions (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL REFERENCES bookings(id),
    transaction_id UUID NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_cinemas_name ON cinemas (name);
CREATE INDEX IF NOT EXISTS idx_screens_cinema_id ON screens (cinema_id);
CREATE INDEX IF NOT EXISTS idx_movies_title ON movies (title);
CREATE INDEX IF NOT EXISTS idx_showtimes_movie_id ON showtimes (movie_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings (user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods (user_id);