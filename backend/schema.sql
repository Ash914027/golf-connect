-- Create database
CREATE DATABASE IF NOT EXISTS auth_db;

-- Use database
USE auth_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  refresh_token TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  status ENUM('active', 'inactive', 'expired') DEFAULT 'active',
  type VARCHAR(50) DEFAULT 'monthly',
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create charities table
CREATE TABLE IF NOT EXISTS charities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_charities table
CREATE TABLE IF NOT EXISTS user_charities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  charity_id INT NOT NULL,
  selected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (charity_id) REFERENCES charities(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_charity (user_id)
);

-- Create scores table
CREATE TABLE IF NOT EXISTS scores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  score INT NOT NULL,
  course VARCHAR(100),
  date_played DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create draws table
CREATE TABLE IF NOT EXISTS draws (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  draw_date DATE,
  status ENUM('upcoming', 'active', 'completed') DEFAULT 'upcoming',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create draw_participants table
CREATE TABLE IF NOT EXISTS draw_participants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  draw_id INT NOT NULL,
  user_id INT NOT NULL,
  participated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (draw_id) REFERENCES draws(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_draw_participant (draw_id, user_id)
);

-- Create winnings table
CREATE TABLE IF NOT EXISTS winnings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  draw_id INT,
  won_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (draw_id) REFERENCES draws(id) ON DELETE SET NULL
);

-- Insert sample charities
INSERT INTO charities (name, description) VALUES 
('Cancer Research', 'Supporting cancer research and treatment'),
('Environmental Protection', 'Protecting the environment and wildlife'),
('Education Fund', 'Supporting education for underprivileged children');

-- Insert sample draws
INSERT INTO draws (name, draw_date, status) VALUES 
('Monthly Golf Draw', '2026-04-01', 'upcoming'),
('Quarterly Championship', '2026-06-15', 'upcoming');