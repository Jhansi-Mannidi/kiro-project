-- 001_init.sql

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cinemas (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(2) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    release_date DATE NOT NULL,
    runtime INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS screens (
    id SERIAL PRIMARY KEY,
    cinema_id INTEGER NOT NULL REFERENCES cinemas(id),
    name VARCHAR(50) NOT NULL,
    row_count INTEGER NOT NULL,
    seat_count INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS showtimes (
    id SERIAL PRIMARY KEY,
    movie_id INTEGER NOT NULL REFERENCES movies(id),
    screen_id INTEGER NOT NULL REFERENCES screens(id),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,
    showtime_id INTEGER NOT NULL REFERENCES showtimes(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    seat_number VARCHAR(10) NOT NULL,
    price DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cinemas_name ON cinemas (name);
CREATE INDEX IF NOT EXISTS idx_movies_title ON movies (title);
CREATE INDEX IF NOT EXISTS idx_showtimes_start_time ON showtimes (start_time);