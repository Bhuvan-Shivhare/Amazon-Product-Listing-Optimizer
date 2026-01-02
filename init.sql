-- Amazon Listing Optimizer Database Initialization Script
-- This script runs automatically when MySQL container starts for the first time

-- Create database (already done via MYSQL_DATABASE env var, but keeping for reference)
CREATE DATABASE IF NOT EXISTS amazon_optimizer;

-- Use the database
USE amazon_optimizer;

-- Create listings table (will be used later for storing Amazon product data)
CREATE TABLE IF NOT EXISTS listings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asin VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_asin (asin)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create optimization_history table (will store all optimization attempts)
CREATE TABLE IF NOT EXISTS optimization_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asin VARCHAR(20) NOT NULL,
    
    -- Original content from Amazon
    original_title TEXT,
    original_bullets TEXT,
    original_description TEXT,
    
    -- AI-optimized content
    optimized_title TEXT,
    optimized_bullets TEXT,
    optimized_description TEXT,
    optimized_keywords TEXT,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_asin (asin),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Show tables
SHOW TABLES;
