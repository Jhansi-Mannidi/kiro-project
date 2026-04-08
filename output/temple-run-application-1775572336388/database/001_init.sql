-- 001_init.sql

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash BYTEA NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    score INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS levels (
    id SERIAL PRIMARY KEY,
    game_id INTEGER NOT NULL REFERENCES games(id),
    level_number SMALLINT NOT NULL,
    coins INTEGER,
    gems INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS powerups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS game_events (
    id SERIAL PRIMARY KEY,
    game_id INTEGER NOT NULL REFERENCES games(id),
    event_type VARCHAR(20) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    data JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_games_user_id ON games (user_id);
CREATE INDEX IF NOT EXISTS idx_levels_game_id ON levels (game_id);
CREATE INDEX IF NOT EXISTS idx_powerups_name ON powerups (name);
CREATE INDEX IF NOT EXISTS idx_game_events_game_id ON game_events (game_id);