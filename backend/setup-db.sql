
-- Create database (run this command separately first)
-- CREATE DATABASE dubai_crm;

-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Referrals Table
CREATE TABLE referrals (
  id SERIAL PRIMARY KEY,
  referring_company VARCHAR(255) NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(50) NOT NULL,
  service VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id INTEGER REFERENCES users(id)
);

-- Deals Table
CREATE TABLE deals (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  referral_id INTEGER REFERENCES referrals(id),
  value VARCHAR(50) NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  stage VARCHAR(50) NOT NULL,
  expected_close_date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id INTEGER REFERENCES users(id)
);

-- Add initial demo user (password: password123)
INSERT INTO users (name, email, password)
VALUES ('Demo User', 'demo@example.com', '$2a$10$vmVuGQZ8xkEODRW5n9JQh.xUoSUWVvCRjwLmHYVdZGvzHRyagF8j2');

-- Add second user (password: manager2023)
INSERT INTO users (name, email, password)
VALUES ('John Manager', 'john@example.com', '$2a$10$fRLDpFdH1wYa9tUv5Qtm/OlgbJUZ1YG1aDLnMnjT/xKMjRfKVh4oq');
