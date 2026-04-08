-- 001_init.sql

CREATE TABLE IF NOT EXISTS artists (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS genres (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS albums (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    artist_id INTEGER NOT NULL,
    genre_id INTEGER,
    release_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_artist FOREIGN KEY (artist_id) REFERENCES artists(id),
    CONSTRAINT fk_genre FOREIGN KEY (genre_id) REFERENCES genres(id)
);

CREATE TABLE IF NOT EXISTS tracks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    album_id INTEGER NOT NULL,
    duration INTERVAL,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_album FOREIGN KEY (album_id) REFERENCES albums(id)
);

CREATE TABLE IF NOT EXISTS playlists (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    user_id INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS playlist_tracks (
    id SERIAL PRIMARY KEY,
    playlist_id INTEGER NOT NULL,
    track_id INTEGER NOT NULL,
    added_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_playlist FOREIGN KEY (playlist_id) REFERENCES playlists(id),
    CONSTRAINT fk_track FOREIGN KEY (track_id) REFERENCES tracks(id)
);

CREATE INDEX idx_artist_name ON artists USING btree (name);
CREATE INDEX idx_genre_name ON genres USING btree (name);
CREATE INDEX idx_album_title ON albums USING btree (title);
CREATE INDEX idx_track_title ON tracks USING btree (title);
CREATE INDEX idx_playlist_name ON playlists USING btree (name);