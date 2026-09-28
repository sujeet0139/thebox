-- ============================================================
-- TheBoxMakers — MySQL Schema for GoDaddy Shared Hosting
-- Host: 68.178.153.237
-- Database: thebox
-- ============================================================
-- NOTE: This project's Next.js code uses Supabase (Postgres).
-- This file is a reference schema if you want to use
-- GoDaddy MySQL for a separate backend / reporting tool.
-- ============================================================

CREATE DATABASE IF NOT EXISTS thebox CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE thebox;

-- Products
CREATE TABLE IF NOT EXISTS products (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  price_label VARCHAR(100),
  category VARCHAR(100),
  features JSON,
  gallery JSON,
  use_cases JSON,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Users (for OTP-based mobile login)
CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255),
  mobile VARCHAR(20) NOT NULL UNIQUE,
  address TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36),
  product_id CHAR(36),
  quantity INT NOT NULL DEFAULT 1,
  status ENUM('pending','confirmed','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- Contact inquiries (from /contact page)
CREATE TABLE IF NOT EXISTS inquiries (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Custom box enquiries (from /enquiry page)
CREATE TABLE IF NOT EXISTS enquiries (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  box_type VARCHAR(100),
  box_size VARCHAR(100),
  message TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- OTP sessions (for mobile login)
CREATE TABLE IF NOT EXISTS otp_sessions (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  mobile VARCHAR(20) NOT NULL,
  otp CHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_mobile_otp (mobile, otp)
);

-- ============================================================
-- To connect this MySQL DB from Next.js, install:
--   npm install mysql2
-- and use the following connection config in .env:
--
-- MYSQL_HOST=68.178.153.237
-- MYSQL_PORT=3306
-- MYSQL_USER=thebox
-- MYSQL_PASSWORD=<your-password>
-- MYSQL_DATABASE=thebox
-- ============================================================
