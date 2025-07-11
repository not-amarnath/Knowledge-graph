-- Knowledge Graph Database Schema
-- Creates tables for entities, relationships, and triplets

-- Create database (if using PostgreSQL/MySQL)
-- CREATE DATABASE knowledge_graph;
-- USE knowledge_graph;

-- Entities table
CREATE TABLE IF NOT EXISTS entities (
    id SERIAL PRIMARY KEY,
    text VARCHAR(255) NOT NULL,
    label VARCHAR(100) NOT NULL,
    confidence DECIMAL(3,2) DEFAULT 0.0,
    source_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(text, label)
);

-- Relationships table
CREATE TABLE IF NOT EXISTS relationships (
    id SERIAL PRIMARY KEY,
    subject_id INTEGER REFERENCES entities(id),
    predicate VARCHAR(100) NOT NULL,
    object_id INTEGER REFERENCES entities(id),
    confidence DECIMAL(3,2) DEFAULT 0.0,
    source_text TEXT,
    source_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(subject_id, predicate, object_id)
);

-- Documents table (for source tracking)
CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    url TEXT UNIQUE NOT NULL,
    title TEXT,
    content TEXT,
    metadata JSONB,
    crawl_timestamp TIMESTAMP,
    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Entity mentions table (tracks where entities appear)
CREATE TABLE IF NOT EXISTS entity_mentions (
    id SERIAL PRIMARY KEY,
    entity_id INTEGER REFERENCES entities(id),
    document_id INTEGER REFERENCES documents(id),
    start_position INTEGER,
    end_position INTEGER,
    context TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Triplets view (for easy querying)
CREATE OR REPLACE VIEW knowledge_triplets AS
SELECT 
    r.id as triplet_id,
    e1.text as subject,
    r.predicate,
    e2.text as object,
    r.confidence,
    r.source_text,
    r.source_url,
    CONCAT('(', e1.text, ') —[', r.predicate, ']—> (', e2.text, ')') as triplet_format
FROM relationships r
JOIN entities e1 ON r.subject_id = e1.id
JOIN entities e2 ON r.object_id = e2.id;

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_entities_label ON entities(label);
CREATE INDEX IF NOT EXISTS idx_entities_text ON entities(text);
CREATE INDEX IF NOT EXISTS idx_relationships_predicate ON relationships(predicate);
CREATE INDEX IF NOT EXISTS idx_documents_url ON documents(url);
CREATE INDEX IF NOT EXISTS idx_entity_mentions_entity_id ON entity_mentions(entity_id);

-- Insert sample data
INSERT INTO entities (text, label, confidence, source_url) VALUES
('INSAT-3D', 'SATELLITE', 0.95, 'https://mosdac.gov.in/insat3d'),
('Atmospheric Data', 'DATA_PRODUCT', 0.89, 'https://mosdac.gov.in/data'),
('Temperature Profile', 'MEASUREMENT', 0.92, 'https://mosdac.gov.in/products'),
('MOSDAC', 'ORGANIZATION', 0.98, 'https://mosdac.gov.in'),
('API Services', 'SERVICE', 0.87, 'https://mosdac.gov.in/api'),
('Weather Forecasting', 'APPLICATION', 0.91, 'https://mosdac.gov.in/applications'),
('Real-time Data', 'DATA_TYPE', 0.85, 'https://mosdac.gov.in/realtime'),
('ISRO', 'ORGANIZATION', 0.97, 'https://isro.gov.in'),
('Meteorological Data', 'DATA_PRODUCT', 0.88, 'https://mosdac.gov.in/meteo'),
('Satellite Imagery', 'DATA_PRODUCT', 0.90, 'https://mosdac.gov.in/imagery')
ON CONFLICT (text, label) DO NOTHING;

-- Insert sample relationships
WITH entity_lookup AS (
    SELECT id, text FROM entities
)
INSERT INTO relationships (subject_id, predicate, object_id, confidence, source_text) 
SELECT 
    e1.id, 
    rel.predicate, 
    e2.id, 
    rel.confidence,
    rel.source_text
FROM (VALUES
    ('INSAT-3D', 'provides', 'Atmospheric Data', 0.94, 'INSAT-3D provides atmospheric data'),
    ('MOSDAC', 'offers', 'API Services', 0.92, 'MOSDAC offers API services'),
    ('Temperature Profile', 'part_of', 'Atmospheric Data', 0.88, 'Temperature profile is part of atmospheric data'),
    ('API Services', 'enables_access_to', 'Meteorological Data', 0.85, 'API services enable access to meteorological data'),
    ('INSAT-3D', 'supports', 'Weather Forecasting', 0.89, 'INSAT-3D supports weather forecasting'),
    ('MOSDAC', 'operated_by', 'ISRO', 0.96, 'MOSDAC is operated by ISRO'),
    ('Real-time Data', 'accessed_through', 'API Services', 0.83, 'Real-time data accessed through API services'),
    ('Satellite Imagery', 'provided_by', 'INSAT-3D', 0.87, 'Satellite imagery provided by INSAT-3D')
) AS rel(subject_text, predicate, object_text, confidence, source_text)
JOIN entity_lookup e1 ON e1.text = rel.subject_text
JOIN entity_lookup e2 ON e2.text = rel.object_text
ON CONFLICT (subject_id, predicate, object_id) DO NOTHING;

-- Insert sample documents
INSERT INTO documents (url, title, content, metadata, crawl_timestamp) VALUES
('https://mosdac.gov.in/insat3d', 'INSAT-3D Satellite Data', 'INSAT-3D provides comprehensive atmospheric data including temperature and humidity profiles for meteorological applications.', '{"type": "product_page", "category": "satellite"}', NOW()),
('https://mosdac.gov.in/api', 'MOSDAC API Documentation', 'Access satellite data through our REST API endpoints with proper authentication and rate limiting.', '{"type": "documentation", "category": "api"}', NOW()),
('https://mosdac.gov.in/services', 'Data Services Overview', 'MOSDAC offers various data services including real-time access, bulk downloads, and custom data processing.', '{"type": "service_page", "category": "services"}', NOW())
ON CONFLICT (url) DO NOTHING;

-- Create some useful queries as stored procedures/functions

-- Function to get entity relationships
CREATE OR REPLACE FUNCTION get_entity_relationships(entity_name TEXT)
RETURNS TABLE(
    relationship_type TEXT,
    related_entity TEXT,
    confidence DECIMAL,
    direction TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.predicate as relationship_type,
        e2.text as related_entity,
        r.confidence,
        'outgoing' as direction
    FROM relationships r
    JOIN entities e1 ON r.subject_id = e1.id
    JOIN entities e2 ON r.object_id = e2.id
    WHERE e1.text ILIKE entity_name
    
    UNION ALL
    
    SELECT 
        r.predicate as relationship_type,
        e1.text as related_entity,
        r.confidence,
        'incoming' as direction
    FROM relationships r
    JOIN entities e1 ON r.subject_id = e1.id
    JOIN entities e2 ON r.object_id = e2.id
    WHERE e2.text ILIKE entity_name;
END;
$$ LANGUAGE plpgsql;

-- Function to search entities by type
CREATE OR REPLACE FUNCTION search_entities_by_type(entity_type TEXT)
RETURNS TABLE(
    entity_text TEXT,
    confidence DECIMAL,
    relationship_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.text as entity_text,
        e.confidence,
        COUNT(r.id) as relationship_count
    FROM entities e
    LEFT JOIN relationships r ON (e.id = r.subject_id OR e.id = r.object_id)
    WHERE e.label ILIKE entity_type
    GROUP BY e.id, e.text, e.confidence
    ORDER BY relationship_count DESC, e.confidence DESC;
END;
$$ LANGUAGE plpgsql;

-- Create summary statistics view
CREATE OR REPLACE VIEW knowledge_graph_stats AS
SELECT 
    'entities' as metric,
    COUNT(*) as count
FROM entities
UNION ALL
SELECT 
    'relationships' as metric,
    COUNT(*) as count
FROM relationships
UNION ALL
SELECT 
    'documents' as metric,
    COUNT(*) as count
FROM documents
UNION ALL
SELECT 
    'entity_types' as metric,
    COUNT(DISTINCT label) as count
FROM entities
UNION ALL
SELECT 
    'relationship_types' as metric,
    COUNT(DISTINCT predicate) as count
FROM relationships;

-- Example queries to test the schema

-- Get all triplets
-- SELECT * FROM knowledge_triplets ORDER BY confidence DESC;

-- Get relationships for a specific entity
-- SELECT * FROM get_entity_relationships('INSAT-3D');

-- Get all satellites
-- SELECT * FROM search_entities_by_type('SATELLITE');

-- Get knowledge graph statistics
-- SELECT * FROM knowledge_graph_stats;

COMMIT;
