CREATE TABLE IF NOT EXISTS public.bus_stops (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location POINT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.buses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    capacity INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.routes (
    id SERIAL PRIMARY KEY,
    bus_id INTEGER NOT NULL REFERENCES public.buses(id),
    start_stop_id INTEGER NOT NULL REFERENCES public.bus_stops(id),
    end_stop_id INTEGER NOT NULL REFERENCES public.bus_stops(id),
    duration INTERVAL NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tickets (
    id SERIAL PRIMARY KEY,
    route_id INTEGER NOT NULL REFERENCES public.routes(id),
    bus_id INTEGER NOT NULL REFERENCES public.buses(id),
    passenger_name VARCHAR(255) NOT NULL,
    seat_number INTEGER NOT NULL,
    fare DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.passengers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS public.ticket_transactions (
    id SERIAL PRIMARY KEY,
    ticket_id INTEGER NOT NULL REFERENCES public.tickets(id),
    transaction_date DATE NOT NULL,
    fare DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_bus_stops_name ON public.bus_stops USING GIST (location);
CREATE INDEX idx_routes_start_stop_id ON public.routes USING BTREE (start_stop_id);
CREATE INDEX idx_tickets_route_id ON public.tickets USING BTREE (route_id);