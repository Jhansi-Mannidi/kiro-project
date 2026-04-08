-- 001_init.sql
CREATE TABLE IF NOT EXISTS public.movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    release_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cinemas (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(50),
    country VARCHAR(50),
    zip_code VARCHAR(10),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.screenings (
    id SERIAL PRIMARY KEY,
    movie_id INTEGER NOT NULL REFERENCES public.movies(id),
    cinema_id INTEGER NOT NULL REFERENCES public.cinemas(id),
    showtime TIME NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (movie_id, cinema_id, showtime)
);

CREATE TABLE IF NOT EXISTS public.tickets (
    id SERIAL PRIMARY KEY,
    screening_id INTEGER NOT NULL REFERENCES public.screenings(id),
    seat_number VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    phone_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES public.users(id),
    ticket_id INTEGER NOT NULL REFERENCES public.tickets(id),
    total DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_movies_title ON public.movies (title);
CREATE INDEX IF NOT EXISTS idx_cinemas_name ON public.cinemas (name);
CREATE INDEX IF NOT EXISTS idx_screenings_movie_id ON public.screenings (movie_id);
CREATE INDEX IF NOT EXISTS idx_tickets_screening_id ON public.tickets (screening_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders (user_id);