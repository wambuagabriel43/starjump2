/*
  # Create site_settings table

  1. New Tables
    - `site_settings`
      - `id` (uuid, primary key)
      - `setting_key` (text, unique)
      - `setting_value` (text)
      - `setting_type` (text, default 'text')
      - `description` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `site_settings` table
    - Add policy for public read access
    - Add policy for authenticated write access

  3. Default Data
    - Background colors for all pages
*/

-- Create site_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value text NOT NULL,
  setting_type text DEFAULT 'text',
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Site settings are publicly readable" ON site_settings;
DROP POLICY IF EXISTS "Authenticated users can manage site settings" ON site_settings;

-- Create policies
CREATE POLICY "Site settings are publicly readable"
  ON site_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage site settings"
  ON site_settings
  FOR ALL
  TO authenticated
  USING (true);

-- Insert default background colors for all pages (only if they don't exist)
INSERT INTO site_settings (setting_key, setting_value, setting_type, description) 
SELECT * FROM (VALUES
  ('background_color_home', '#4169E1', 'color', 'Background color for home page'),
  ('background_color_about', '#4169E1', 'color', 'Background color for about page'),
  ('background_color_corporate', '#4169E1', 'color', 'Background color for corporate page'),
  ('background_color_events', '#4169E1', 'color', 'Background color for events page'),
  ('background_color_booking', '#4169E1', 'color', 'Background color for booking page'),
  ('background_color_shop', '#4169E1', 'color', 'Background color for shop page'),
  ('background_color_blog', '#4169E1', 'color', 'Background color for blog page'),
  ('background_color_contact', '#4169E1', 'color', 'Background color for contact page'),
  ('background_color_privacy', '#4169E1', 'color', 'Background color for privacy policy page'),
  ('background_color_terms', '#4169E1', 'color', 'Background color for terms page')
) AS v(setting_key, setting_value, setting_type, description)
WHERE NOT EXISTS (
  SELECT 1 FROM site_settings WHERE site_settings.setting_key = v.setting_key
);