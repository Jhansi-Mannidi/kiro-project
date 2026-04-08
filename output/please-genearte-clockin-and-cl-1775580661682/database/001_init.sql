-- 001_init.sql

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash BYTEA NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS shifts (
    id SERIAL PRIMARY KEY,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clockins (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    shift_id INTEGER NOT NULL REFERENCES shifts(id),
    clock_in_time TIME NOT NULL,
    clock_out_time TIME,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (user_id, shift_id)
);

CREATE TABLE IF NOT EXISTS attendance (
    id SERIAL PRIMARY KEY,
    clockin_id INTEGER NOT NULL REFERENCES clockins(id),
    is_clocked_in BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_shifts_date ON shifts(date);
CREATE INDEX IF NOT EXISTS idx_clockins_user_id ON clockins(user_id);
CREATE INDEX IF NOT EXISTS idx_clockins_shift_id ON clockins(shift_id);