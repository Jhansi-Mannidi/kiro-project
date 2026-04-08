-- 001_init.sql

CREATE TABLE IF NOT EXISTS public.cities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.states (
    id SERIAL PRIMARY KEY,
    city_id INTEGER NOT NULL REFERENCES public.cities(id),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (city_id, name)
);

CREATE TABLE IF NOT EXISTS public.restaurants (
    id SERIAL PRIMARY KEY,
    city_id INTEGER NOT NULL REFERENCES public.cities(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    rating DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.menu_items (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER NOT NULL REFERENCES public.restaurants(id),
    category_id INTEGER NOT NULL REFERENCES public.categories(id),
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2),
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.reviews (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER NOT NULL REFERENCES public.restaurants(id),
    user_name VARCHAR(255) NOT NULL,
    rating DECIMAL(3,2),
    review TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES public.users(id),
    restaurant_id INTEGER NOT NULL REFERENCES public.restaurants(id),
    total DECIMAL(10,2),
    status VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES public.orders(id),
    menu_item_id INTEGER NOT NULL REFERENCES public.menu_items(id),
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);