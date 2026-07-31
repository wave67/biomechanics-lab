-- biomechanics_lab Database Schema
-- This is a reference DDL; ORM manages migrations via Alembic

-- Users
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(64) NOT NULL UNIQUE,
    display_name VARCHAR(64) NOT NULL,
    hashed_password VARCHAR(256) NOT NULL,
    role VARCHAR(32) DEFAULT 'engineer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- (Full DDL is managed by SQLAlchemy ORM)
