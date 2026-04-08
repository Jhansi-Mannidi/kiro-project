-- 001_init.sql
CREATE TABLE IF NOT EXISTS movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cinemas (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    city VARCHAR(50),
    state VARCHAR(20),
    country VARCHAR(30),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS screens (
    id SERIAL PRIMARY KEY,
    cinema_id INTEGER NOT NULL REFERENCES cinemas(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    row_count INTEGER NOT NULL,
    seat_count INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS showtimes (
    id SERIAL PRIMARY KEY,
    movie_id INTEGER NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    screen_id INTEGER NOT NULL REFERENCES screens(id) ON DELETE CASCADE,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,
    showtime_id INTEGER NOT NULL REFERENCES showtimes(id) ON DELETE CASCADE,
    seat_number VARCHAR(10) NOT NULL,
    price DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(50),
    phone_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ticket_purchases (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ticket_id INTEGER NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    purchase_date DATE NOT NULL,
    total_price DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_movies_title ON movies (title);
CREATE INDEX IF NOT EXISTS idx_cinemas_name ON cinemas (name);
CREATE INDEX IF NOT EXISTS idx_screens_cinema_id ON screens (cinema_id);
CREATE INDEX IF NOT EXISTS idx_showtimes_movie_id ON showtimes (movie_id);
CREATE INDEX IF NOT EXISTS idx_tickets_showtime_id ON tickets (showtime_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);