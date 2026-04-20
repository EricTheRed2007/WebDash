-- Create flood_surveys table for collecting flooding data
CREATE TABLE IF NOT EXISTS flood_surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Location Information
  area_name TEXT NOT NULL,
  address TEXT,
  city TEXT NOT NULL,
  postal_code TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Flood Details
  flood_date DATE NOT NULL,
  water_level_cm INTEGER,
  flood_duration_hours INTEGER,
  flood_frequency TEXT CHECK (flood_frequency IN ('first_time', 'yearly', 'multiple_yearly', 'monthly')),
  
  -- Impact Assessment
  property_damage BOOLEAN DEFAULT FALSE,
  damage_estimate_usd DECIMAL(12, 2),
  people_affected INTEGER,
  evacuation_required BOOLEAN DEFAULT FALSE,
  
  -- Disadvantages Faced
  loss_of_income BOOLEAN DEFAULT FALSE,
  health_issues BOOLEAN DEFAULT FALSE,
  displacement BOOLEAN DEFAULT FALSE,
  infrastructure_damage BOOLEAN DEFAULT FALSE,
  contaminated_water BOOLEAN DEFAULT FALSE,
  power_outage BOOLEAN DEFAULT FALSE,
  road_blockage BOOLEAN DEFAULT FALSE,
  crop_damage BOOLEAN DEFAULT FALSE,
  
  -- Additional Information
  disadvantages_description TEXT,
  support_received TEXT,
  immediate_needs TEXT,
  
  -- Contact Information (optional)
  respondent_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  
  -- Survey Metadata
  severity_level TEXT CHECK (severity_level IN ('minor', 'moderate', 'severe', 'critical')) DEFAULT 'moderate',
  status TEXT CHECK (status IN ('pending', 'reviewed', 'verified', 'resolved')) DEFAULT 'pending'
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_flood_surveys_area ON flood_surveys(area_name);
CREATE INDEX IF NOT EXISTS idx_flood_surveys_city ON flood_surveys(city);
CREATE INDEX IF NOT EXISTS idx_flood_surveys_date ON flood_surveys(flood_date);
CREATE INDEX IF NOT EXISTS idx_flood_surveys_severity ON flood_surveys(severity_level);
CREATE INDEX IF NOT EXISTS idx_flood_surveys_status ON flood_surveys(status);

-- Enable Row Level Security
ALTER TABLE flood_surveys ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert surveys (public submission)
CREATE POLICY "Allow public to submit surveys" ON flood_surveys
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to read surveys (public dashboard)
CREATE POLICY "Allow public to read surveys" ON flood_surveys
  FOR SELECT
  USING (true);
