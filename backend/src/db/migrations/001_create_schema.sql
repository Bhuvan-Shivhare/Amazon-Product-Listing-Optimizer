-- Amazon Listing Optimizer Database Schema
-- Migration 001: Create products and listing_versions tables

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asin VARCHAR(20) NOT NULL UNIQUE,
    amazon_domain VARCHAR(10) DEFAULT 'com',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_asin (asin)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create listing_versions table
CREATE TABLE IF NOT EXISTS listing_versions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    version_number INT NOT NULL,
    
    -- Original content from Amazon
    original_title TEXT,
    original_bullets JSON,
    original_description TEXT,
    
    -- AI-optimized content
    optimized_title TEXT,
    optimized_bullets JSON,
    optimized_description TEXT,
    keywords JSON,
    
    -- Metadata
    ai_model_used VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraint
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    
    -- Ensure unique version numbers per product
    UNIQUE KEY unique_product_version (product_id, version_number),
    
    -- Indexes for performance
    INDEX idx_product_id (product_id),
    INDEX idx_version_number (product_id, version_number),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
