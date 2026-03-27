-- CineTrack Cassandra Schema

CREATE KEYSPACE IF NOT EXISTS cinetrack
WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};

USE cinetrack;

-- Titles by genre (Q1 for browsing, Q6 partial)
CREATE TABLE IF NOT EXISTS titles_by_genre (
    genre       TEXT,
    title_id    UUID,
    title       TEXT,
    year        INT,
    type        TEXT,       -- 'movie' or 'series'
    duration_s  INT,
    director    TEXT,
    cast_list   LIST<TEXT>,
    avg_rating  FLOAT,
    description TEXT,
    poster_url  TEXT,
    PRIMARY KEY (genre, title_id)
) WITH CLUSTERING ORDER BY (title_id ASC);

-- Watch history by user (Q1)
CREATE TABLE IF NOT EXISTS watch_history_by_user (
    user_id     UUID,
    watched_at  TIMESTAMP,
    title_id    UUID,
    title       TEXT,
    genre       TEXT,
    progress_s  INT,
    completed   BOOLEAN,
    PRIMARY KEY (user_id, watched_at, title_id)
) WITH CLUSTERING ORDER BY (watched_at DESC, title_id ASC);

-- Watch progress per user per title (Q2)
CREATE TABLE IF NOT EXISTS watch_progress (
    user_id     UUID,
    title_id    UUID,
    progress_s  INT,
    updated_at  TIMESTAMP,
    completed   BOOLEAN,
    PRIMARY KEY (user_id, title_id)
);

-- Ratings by user (Q3)
CREATE TABLE IF NOT EXISTS ratings_by_user (
    user_id     UUID,
    title_id    UUID,
    rating      INT,
    rated_at    TIMESTAMP,
    PRIMARY KEY (user_id, title_id)
);

-- Ratings by title (Q4 - for computing average)
CREATE TABLE IF NOT EXISTS ratings_by_title (
    title_id    UUID,
    user_id     UUID,
    rating      INT,
    rated_at    TIMESTAMP,
    PRIMARY KEY (title_id, user_id)
);

-- Watchlist by user (Q5)
CREATE TABLE IF NOT EXISTS watchlist_by_user (
    user_id     UUID,
    added_at    TIMESTAMP,
    title_id    UUID,
    title       TEXT,
    genre       TEXT,
    PRIMARY KEY (user_id, added_at, title_id)
) WITH CLUSTERING ORDER BY (added_at DESC, title_id ASC);

-- Title popularity - COUNTER table (Q6)
-- Note: counter columns cannot be part of clustering key,
-- so sorting by watch_count is done on the backend
CREATE TABLE IF NOT EXISTS title_popularity (
    genre       TEXT,
    month       TEXT,       -- format: 'YYYY-MM'
    title_id    UUID,
    watch_count COUNTER,
    PRIMARY KEY ((genre, month), title_id)
);

-- Reviews by title (Q8)
CREATE TABLE IF NOT EXISTS reviews_by_title (
    title_id    UUID,
    created_at  TIMESTAMP,
    user_id     UUID,
    username    TEXT,
    review_text TEXT,
    rating      INT,
    PRIMARY KEY (title_id, created_at, user_id)
) WITH CLUSTERING ORDER BY (created_at DESC, user_id ASC);

-- Users table for registration/auth
CREATE TABLE IF NOT EXISTS users (
    user_id     UUID,
    username    TEXT,
    email       TEXT,
    created_at  TIMESTAMP,
    PRIMARY KEY (user_id)
);

CREATE INDEX IF NOT EXISTS ON users (username);
CREATE INDEX IF NOT EXISTS ON users (email);
