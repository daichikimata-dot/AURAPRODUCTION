-- Migration: Add type column to links table
ALTER TABLE links ADD COLUMN IF NOT EXISTS type text DEFAULT 'affiliate';
-- CHECK constraint (optional but good)
-- ALTER TABLE links ADD CONSTRAINT links_type_check CHECK (type IN ('affiliate', 'line', 'clinic'));
