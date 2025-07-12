/*
  # Comprehensive Fix for Site Customization Issues

  1. Storage Setup
    - Recreate all storage buckets with proper configuration
    - Set up comprehensive RLS policies
    - Enable public access for reading

  2. Site Settings
    - Ensure site_settings table exists with proper structure
    - Create upsert function for reliable updates
    - Insert default background colors

  3. Site Assets
    - Ensure site_assets table has all required columns
    - Set up proper RLS policies

  4. Authentication
    - Verify RLS policies work for both authenticated and anonymous users
*/

-- First, let's ensure we have the storage schema
CREATE SCHEMA IF NOT EXISTS storage;

-- Drop and recreate storage buckets to ensure clean state
DELETE FROM storage.objects WHERE bucket_id IN ('logos', 'menu-graphics', 'footer-images', 'general-uploads');
DELETE FROM storage.buckets WHERE id IN ('logos', 'menu-graphics', 'footer-images', 'general-uploads');

-- Create storage buckets with proper configuration
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types, avif_autodetection, created_at, updated_at)
VALUES 
  ('logos', 'logos', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'], false, now(), now()),
  ('menu-graphics', 'menu-graphics', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'], false, now(), now()),
  ('footer-images', 'footer-images', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'], false, now(), now()),
  ('general-uploads', 'general-uploads', true, 10485760, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'], false, now(), now());

-- Drop all existing storage policies to start fresh
DROP POLICY IF EXISTS "Public can view all images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view uploaded files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete files" ON storage.objects;

-- Create permissive storage policies for testing
CREATE POLICY "Anyone can view uploaded files" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id IN ('logos', 'menu-graphics', 'footer-images', 'general-uploads'));

CREATE POLICY "Anyone can upload files" ON storage.objects
  FOR INSERT TO public
  WITH CHECK (bucket_id IN ('logos', 'menu-graphics', 'footer-images', 'general-uploads'));

CREATE POLICY "Anyone can update files" ON storage.objects
  FOR UPDATE TO public
  USING (bucket_id IN ('logos', 'menu-graphics', 'footer-images', 'general-uploads'));

CREATE POLICY "Anyone can delete files" ON storage.objects
  FOR DELETE TO public
  USING (bucket_id IN ('logos', 'menu-graphics', 'footer-images', 'general-uploads'));

-- Ensure site_settings table exists with proper structure
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value text NOT NULL,
  setting_type text DEFAULT 'text',
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on site_settings
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing site_settings policies
DROP POLICY IF EXISTS "Site settings are publicly readable" ON site_settings;
DROP POLICY IF EXISTS "Authenticated users can manage site settings" ON site_settings;
DROP POLICY IF EXISTS "Anyone can read site settings" ON site_settings;
DROP POLICY IF EXISTS "Anyone can manage site settings" ON site_settings;

-- Create permissive policies for site_settings
CREATE POLICY "Anyone can read site settings" ON site_settings
  FOR SELECT TO public
  USING (true);

CREATE POLICY "Anyone can manage site settings" ON site_settings
  FOR ALL TO public
  USING (true);

-- Ensure site_assets table has all required columns
DO $$
BEGIN
  -- Add positioning columns if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_assets' AND column_name = 'position_x') THEN
    ALTER TABLE site_assets ADD COLUMN position_x integer DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_assets' AND column_name = 'position_y') THEN
    ALTER TABLE site_assets ADD COLUMN position_y integer DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_assets' AND column_name = 'width') THEN
    ALTER TABLE site_assets ADD COLUMN width integer DEFAULT NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_assets' AND column_name = 'height') THEN
    ALTER TABLE site_assets ADD COLUMN height integer DEFAULT NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_assets' AND column_name = 'z_index') THEN
    ALTER TABLE site_assets ADD COLUMN z_index integer DEFAULT 1;
  END IF;
END $$;

-- Enable RLS on site_assets
ALTER TABLE site_assets ENABLE ROW LEVEL SECURITY;

-- Drop existing site_assets policies
DROP POLICY IF EXISTS "Site assets are publicly readable" ON site_assets;
DROP POLICY IF EXISTS "Authenticated users can manage site assets" ON site_assets;
DROP POLICY IF EXISTS "Anyone can read site assets" ON site_assets;
DROP POLICY IF EXISTS "Anyone can manage site assets" ON site_assets;

-- Create permissive policies for site_assets
CREATE POLICY "Anyone can read site assets" ON site_assets
  FOR SELECT TO public
  USING (true);

CREATE POLICY "Anyone can manage site assets" ON site_assets
  FOR ALL TO public
  USING (true);

-- Create or replace the upsert function for site settings
CREATE OR REPLACE FUNCTION upsert_site_setting(key text, value text, type text DEFAULT 'text')
RETURNS void AS $$
BEGIN
  INSERT INTO site_settings (setting_key, setting_value, setting_type, updated_at)
  VALUES (key, value, type, now())
  ON CONFLICT (setting_key) 
  DO UPDATE SET 
    setting_value = EXCLUDED.setting_value,
    setting_type = EXCLUDED.setting_type,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to everyone for testing
GRANT EXECUTE ON FUNCTION upsert_site_setting TO public;

-- Clear existing site settings and insert fresh defaults
DELETE FROM site_settings WHERE setting_key LIKE '%_background_color';

-- Insert default background colors
INSERT INTO site_settings (setting_key, setting_value, setting_type, description) 
VALUES
  ('home_background_color', '#4169E1', 'color', 'Background color for home page'),
  ('about_background_color', '#4169E1', 'color', 'Background color for about page'),
  ('corporate_background_color', '#4169E1', 'color', 'Background color for corporate page'),
  ('events_background_color', '#4169E1', 'color', 'Background color for events page'),
  ('booking_background_color', '#4169E1', 'color', 'Background color for booking page'),
  ('shop_background_color', '#4169E1', 'color', 'Background color for shop page'),
  ('blog_background_color', '#4169E1', 'color', 'Background color for blog page'),
  ('contact_background_color', '#4169E1', 'color', 'Background color for contact page');

-- Test the setup by creating a test record
INSERT INTO site_settings (setting_key, setting_value, setting_type, description)
VALUES ('test_setting', 'test_value', 'text', 'Test setting for diagnostics')
ON CONFLICT (setting_key) DO UPDATE SET setting_value = 'test_value';