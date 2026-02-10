-- Enable RLS
ALTER TABLE links ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for homepage)
CREATE POLICY "Allow public read access" ON links FOR SELECT USING (true);

-- Allow authenticated (admin) users to insert/update/delete
-- Assuming authenticated users are admins for this project scope, or simple check
CREATE POLICY "Allow auth users to modify" ON links FOR ALL USING (auth.role() = 'authenticated');
