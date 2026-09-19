-- ==============================================================================
-- KisanSetu B2B - PostgreSQL + PostGIS Database Schema
-- SIH 2026 Problem Statement 26033
-- ==============================================================================

-- Enable PostGIS geospatial extension for farm-gate and mandi location tracking
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Farmers & FPOs Table
CREATE TABLE IF NOT EXISTS farmers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    village VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    fpo_name VARCHAR(200),
    preferred_language VARCHAR(10) DEFAULT 'hi', -- hi, mr, pa, kn, ta, te
    farm_location GEOMETRY(Point, 4326), -- PostGIS WGS84 coordinates
    aadhaar_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Direct Harvest Listings (Created via WhatsApp Chatbot)
CREATE TABLE IF NOT EXISTS harvest_listings (
    id VARCHAR(50) PRIMARY KEY,
    farmer_id VARCHAR(50) REFERENCES farmers(id) ON DELETE CASCADE,
    crop_name VARCHAR(150) NOT NULL,
    hindi_name VARCHAR(150),
    category VARCHAR(50) NOT NULL, -- vegetables, grains, pulses, fruits
    variety VARCHAR(100),
    quantity_quintals NUMERIC(10, 2) NOT NULL,
    available_quintals NUMERIC(10, 2) NOT NULL,
    asking_price_per_kg NUMERIC(10, 2) NOT NULL,
    tier_20q_price_per_kg NUMERIC(10, 2), -- 8% discount tier
    tier_50q_price_per_kg NUMERIC(10, 2), -- 14% discount tier
    harvest_date DATE NOT NULL,
    harvest_time_stamp VARCHAR(50),
    grade VARCHAR(50) DEFAULT 'Grade A',
    is_organic BOOLEAN DEFAULT FALSE,
    fssai_residue_tested BOOLEAN DEFAULT TRUE,
    whatsapp_listed BOOLEAN DEFAULT TRUE,
    raw_transcription TEXT,
    confidence_score NUMERIC(5, 2) DEFAULT 95.0,
    status VARCHAR(30) DEFAULT 'ACTIVE', -- ACTIVE, COMMITTED, SOLD_OUT
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Institutional Buyers Table
CREATE TABLE IF NOT EXISTS institutions (
    id VARCHAR(50) PRIMARY KEY,
    organization_name VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL, -- hospital, college_hostel, restaurant_chain
    contact_person VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_location GEOMETRY(Point, 4326),
    gstin VARCHAR(20),
    fssai_license VARCHAR(30),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Bulk Purchase Orders (B2B Wholesale)
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY,
    institution_id VARCHAR(50) REFERENCES institutions(id),
    total_weight_quintals NUMERIC(10, 2) NOT NULL,
    produce_subtotal NUMERIC(12, 2) NOT NULL,
    logistics_freight NUMERIC(10, 2) NOT NULL,
    intermediary_commission NUMERIC(10, 2) DEFAULT 0.00, -- 0% Mandi Commission!
    total_amount NUMERIC(12, 2) NOT NULL,
    payment_escrow_status VARCHAR(30) DEFAULT 'HELD_IN_ESCROW', -- HELD_IN_ESCROW, RELEASED_TO_FARMER
    delivery_schedule VARCHAR(50) DEFAULT 'IMMEDIATE_DISPATCH',
    delivery_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Order Line Items
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE,
    listing_id VARCHAR(50) REFERENCES harvest_listings(id),
    farmer_id VARCHAR(50) REFERENCES farmers(id),
    crop_name VARCHAR(150) NOT NULL,
    quantity_quintals NUMERIC(10, 2) NOT NULL,
    applied_price_per_kg NUMERIC(10, 2) NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL
);

-- 6. Spatial Indexes for PostGIS Proximity Queries
CREATE INDEX IF NOT EXISTS idx_farmers_location ON farmers USING GIST(farm_location);
CREATE INDEX IF NOT EXISTS idx_institutions_location ON institutions USING GIST(delivery_location);
