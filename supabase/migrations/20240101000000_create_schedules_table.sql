-- Create schedules table
CREATE TABLE schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    band_id UUID REFERENCES bands(id) NOT NULL,
    show_time TIME NOT NULL,
    tech_id UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add updated_at trigger
CREATE TRIGGER update_schedules_updated_at
    BEFORE UPDATE ON schedules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view all schedules"
    ON schedules FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Tech users can insert their own schedules"
    ON schedules FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = tech_id
        AND EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'tech')
        )
    );

CREATE POLICY "Tech users can update their own schedules"
    ON schedules FOR UPDATE
    TO authenticated
    USING (
        tech_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'tech')
        )
    )
    WITH CHECK (
        tech_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'tech')
        )
    );

CREATE POLICY "Tech users can delete their own schedules"
    ON schedules FOR DELETE
    TO authenticated
    USING (
        tech_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'tech')
        )
    );

-- Create index for common queries
CREATE INDEX idx_schedules_date ON schedules(date);

-- Add comment
COMMENT ON TABLE schedules IS 'Stores scheduled events and their details'; 