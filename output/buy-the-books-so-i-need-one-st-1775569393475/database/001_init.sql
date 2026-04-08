-- 001_init.sql
CREATE TABLE IF NOT EXISTS public.books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(100),
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.stores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    city VARCHAR(50),
    state VARCHAR(2),
    zip VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS public.store_books (
    store_id INTEGER NOT NULL REFERENCES public.stores(id),
    book_id INTEGER NOT NULL REFERENCES public.books(id),
    PRIMARY KEY (store_id, book_id)
);

CREATE TABLE IF NOT EXISTS public.orders (
    id SERIAL PRIMARY KEY,
    store_id INTEGER NOT NULL REFERENCES public.stores(id),
    customer_name VARCHAR(100) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES public.orders(id),
    book_id INTEGER NOT NULL REFERENCES public.books(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_books_title ON public.books USING btree (title);
CREATE INDEX IF NOT EXISTS idx_stores_name ON public.stores USING btree (name);
CREATE INDEX IF NOT EXISTS idx_orders_store_id ON public.orders USING btree (store_id);