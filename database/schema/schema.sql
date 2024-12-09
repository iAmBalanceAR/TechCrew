-- TechCrew Database Schema
-- This schema uses Postgres syntax and includes relations for all main components

-- Users table for authentication and basic user info
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'tech', 'user')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bands table for managing band information
CREATE TABLE bands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    home_location TEXT NOT NULL,
    members INTEGER NOT NULL CHECK (members > 0),
    last_played DATE,
    last_tech UUID REFERENCES users(id),
    notes TEXT,
    input_lists TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inventory categories for organizing equipment
CREATE TABLE inventory_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT INTO inventory_categories (name) VALUES
    ('Main PA / Monitors'),
    ('Vocal Mics'),
    ('Instrument Mics'),
    ('Mic Stands'),
    ('Cables');

-- Inventory items table
CREATE TABLE inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES inventory_categories(id) NOT NULL,
    model TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity >= 0),
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Issues table for tracking equipment problems
CREATE TABLE issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('open', 'in_progress', 'closed')),
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
    assigned_to UUID REFERENCES users(id),
    reported_by UUID REFERENCES users(id) NOT NULL,
    related_item_id UUID REFERENCES inventory_items(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP WITH TIME ZONE
);

-- Gig logs for tracking events
CREATE TABLE gig_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    band_id UUID REFERENCES bands(id) NOT NULL,
    venue TEXT NOT NULL,
    notes TEXT,
    tech_id UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Equipment checkouts for tracking borrowed items
CREATE TABLE equipment_checkouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID REFERENCES inventory_items(id) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    checked_out_by UUID REFERENCES users(id) NOT NULL,
    checked_out_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expected_return_date DATE,
    actual_return_date DATE,
    notes TEXT,
    status TEXT NOT NULL CHECK (status IN ('checked_out', 'returned', 'overdue')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Issue comments for tracking communication
CREATE TABLE issue_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id UUID REFERENCES issues(id) NOT NULL,
    user_id UUID REFERENCES users(id) NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Band contacts for managing band member information
CREATE TABLE band_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    band_id UUID REFERENCES bands(id) NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for common queries
CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_priority ON issues(priority);
CREATE INDEX idx_inventory_items_category ON inventory_items(category_id);
CREATE INDEX idx_gig_logs_date ON gig_logs(date);
CREATE INDEX idx_equipment_checkouts_status ON equipment_checkouts(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all relevant tables
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bands_updated_at
    BEFORE UPDATE ON bands
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_items_updated_at
    BEFORE UPDATE ON inventory_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_issues_updated_at
    BEFORE UPDATE ON issues
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gig_logs_updated_at
    BEFORE UPDATE ON gig_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_equipment_checkouts_updated_at
    BEFORE UPDATE ON equipment_checkouts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_band_contacts_updated_at
    BEFORE UPDATE ON band_contacts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS (Row Level Security) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bands ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE gig_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_checkouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE band_contacts ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (to be customized based on your exact needs)
CREATE POLICY "Users can view all users"
    ON users FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can view all bands"
    ON bands FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can view all inventory"
    ON inventory_items FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can view all issues"
    ON issues FOR SELECT
    TO authenticated
    USING (true);

-- Comments explaining the schema design
COMMENT ON TABLE users IS 'Stores user accounts and authentication information';
COMMENT ON TABLE bands IS 'Stores information about bands and their requirements';
COMMENT ON TABLE inventory_categories IS 'Categorizes inventory items for better organization';
COMMENT ON TABLE inventory_items IS 'Tracks all equipment and their quantities';
COMMENT ON TABLE issues IS 'Tracks equipment issues and maintenance requests';
COMMENT ON TABLE gig_logs IS 'Records all gig events and their details';
COMMENT ON TABLE equipment_checkouts IS 'Tracks equipment borrowing and returns';
COMMENT ON TABLE issue_comments IS 'Stores communication thread for issues';
COMMENT ON TABLE band_contacts IS 'Stores contact information for band members'; 