-- 001_init.sql
CREATE TABLE IF NOT EXISTS public.cities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.buses (
    id SERIAL PRIMARY KEY,
    city_id INTEGER NOT NULL REFERENCES public.cities(id),
    name VARCHAR(255) NOT NULL,
    capacity INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (city_id, name)
);

CREATE TABLE IF NOT EXISTS public.routes (
    id SERIAL PRIMARY KEY,
    bus_id INTEGER NOT NULL REFERENCES public.buses(id),
    from_city_id INTEGER NOT NULL REFERENCES public.cities(id),
    to_city_id INTEGER NOT NULL REFERENCES public.cities(id),
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (bus_id, from_city_id, to_city_id)
);

CREATE TABLE IF NOT EXISTS public.tickets (
    id SERIAL PRIMARY KEY,
    route_id INTEGER NOT NULL REFERENCES public.routes(id),
    passenger_name VARCHAR(255) NOT NULL,
    seat_number INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (route_id, passenger_name, seat_number)
);

CREATE TABLE IF NOT EXISTS public.passengers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ticket_transactions (
    id SERIAL PRIMARY KEY,
    ticket_id INTEGER NOT NULL REFERENCES public.tickets(id),
    transaction_date DATE NOT NULL,
    fare DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cities_name ON public.cities (name);
CREATE INDEX IF NOT EXISTS idx_buses_city_id ON public.buses (city_id);
CREATE INDEX IF NOT EXISTS idx_routes_bus_id ON public.routes (bus_id);
CREATE INDEX IF NOT EXISTS idx_tickets_route_id ON public.tickets (route_id);