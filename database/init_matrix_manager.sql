-- =============================
-- Evonik Gatekeeper SQL Schema
-- =============================

-- 1. Create the database
CREATE DATABASE IF NOT EXISTS matrix_manager;
USE matrix_manager;

-- 2. Users table for authentication
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('matrix_admin', 'data_admin', 'role_admin') NOT NULL
);

-- 3. Chemicals master data
CREATE TABLE chemicals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  formula VARCHAR(50)
);

-- 4. Materials master data
CREATE TABLE materials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  symbol VARCHAR(10)
);

-- 5. Matrices created by users
CREATE TABLE matrices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. Matrix Items for Chemical-Material relations
CREATE TABLE matrix_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  matrix_id INT,
  chemical_id INT,
  material_id INT,
  compatibility_score INT,
  FOREIGN KEY (matrix_id) REFERENCES matrices(id) ON DELETE CASCADE,
  FOREIGN KEY (chemical_id) REFERENCES chemicals(id),
  FOREIGN KEY (material_id) REFERENCES materials(id)
);

-- =============================
-- 🔐 Seed Data
-- =============================

-- 7. Users with roles
-- Note: Passwords are bcrypt-hashed versions of "password123"
INSERT INTO users (name, email, password, role) VALUES
('Admin Matrix', 'matrix.admin@evonik.com', '$2a$10$WzYBQJ0VVDZm8XYLjUkhneEuAXo2.HxBpZpJXqXD3S1OEtfU3eV7K', 'matrix_admin'),
('Data Operator', 'data.admin@evonik.com', '$2a$10$qphq5Kg6xGVynj5ZfO3quuZdLxC8XeKHl3ApZPy0iGVEHuLjfKcoy', 'data_admin'),
('User Role Admin', 'role.admin@evonik.com', '$2a$10$Uz4OiNQk9jKk5s8vRVEfruA4kdGxq8q3q6pU1HqQut0dD8U.1wqkW', 'role_admin');

-- 8. Sample chemicals
INSERT INTO chemicals (name, formula) VALUES
('Sulfuric Acid', 'H2SO4'),
('Sodium Hydroxide', 'NaOH'),
('Hydrochloric Acid', 'HCl');

-- 9. Sample materials
INSERT INTO materials (name, symbol) VALUES
('Stainless Steel', 'SS'),
('Polyethylene', 'PE'),
('Teflon', 'PTFE');

-- 10. Example matrix created by Admin
INSERT INTO matrices (name, user_id) VALUES
('Test Matrix 1', 1);

-- 11. Matrix item entries
INSERT INTO matrix_items (matrix_id, chemical_id, material_id, compatibility_score) VALUES
(1, 1, 1, 3),
(1, 2, 2, 5),
(1, 3, 3, 4);
