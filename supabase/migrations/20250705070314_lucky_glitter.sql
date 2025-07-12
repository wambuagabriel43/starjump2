/*
  # Add Site Customization Features

  1. New Tables
    - `site_settings` - Store global site settings like background colors
    - Update `site_assets` table with positioning data
    - Create storage buckets for image uploads

  2. Storage Buckets
    - `logos` - For header and footer logos
    - `menu-graphics` - For menu item background graphics
    - `footer-images` - For footer positioned images
    - `general-uploads` - For other site images

  3. Security
    - Public read access for all buckets
    - Authenticated upload access for admin users
*/

-- Site settings table for global customization
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value text NOT NULL,
  setting_type text DEFAULT 'text', -- 'text', 'color', 'number', 'boolean'
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public can read site settings
CREATE POLICY "Site settings are publicly readable"
  ON site_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Authenticated users can manage site settings
CREATE POLICY "Authenticated users can manage site settings"
  ON site_settings
  FOR ALL
  TO authenticated
  USING (true);

-- Update site_assets table to include positioning data
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

-- Insert default site settings
INSERT INTO site_settings (setting_key, setting_value, setting_type, description)
SELECT 'home_background_color', '#4169E1', 'color', 'Background color for the home page'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'home_background_color');

INSERT INTO site_settings (setting_key, setting_value, setting_type, description)
SELECT 'about_background_color', '#4169E1', 'color', 'Background color for the about page'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'about_background_color');

INSERT INTO site_settings (setting_key, setting_value, setting_type, description)
SELECT 'corporate_background_color', '#4169E1', 'color', 'Background color for the corporate page'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'corporate_background_color');

INSERT INTO site_settings (setting_key, setting_value, setting_type, description)
SELECT 'events_background_color', '#4169E1', 'color', 'Background color for the events page'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'events_background_color');

INSERT INTO site_settings (setting_key, setting_value, setting_type, description)
SELECT 'shop_background_color', '#4169E1', 'color', 'Background color for the shop page'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'shop_background_color');

INSERT INTO site_settings (setting_key, setting_value, setting_type, description)
SELECT 'blog_background_color', '#4169E1', 'color', 'Background color for the blog page'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'blog_background_color');

INSERT INTO site_settings (setting_key, setting_value, setting_type, description)
SELECT 'contact_background_color', '#4169E1', 'color', 'Background color for the contact page'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'contact_background_color');

INSERT INTO site_settings (setting_key, setting_value, setting_type, description)
SELECT 'booking_background_color', '#4169E1', 'color', 'Background color for the booking page'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE setting_key = 'booking_background_color');

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('logos', 'logos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']),
  ('menu-graphics', 'menu-graphics', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']),
  ('footer-images', 'footer-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']),
  ('general-uploads', 'general-uploads', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies for public read access
CREATE POLICY "Public can view logos" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'logos');

CREATE POLICY "Public can view menu graphics" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'menu-graphics');

CREATE POLICY "Public can view footer images" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'footer-images');

CREATE POLICY "Public can view general uploads" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'general-uploads');

-- Storage policies for authenticated upload access
CREATE POLICY "Authenticated users can upload logos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'logos');

CREATE POLICY "Authenticated users can upload menu graphics" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'menu-graphics');

CREATE POLICY "Authenticated users can upload footer images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'footer-images');

CREATE POLICY "Authenticated users can upload general images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'general-uploads');

-- Storage policies for authenticated update/delete access
CREATE POLICY "Authenticated users can update logos" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'logos');

CREATE POLICY "Authenticated users can delete logos" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'logos');

CREATE POLICY "Authenticated users can update menu graphics" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'menu-graphics');

CREATE POLICY "Authenticated users can delete menu graphics" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'menu-graphics');

CREATE POLICY "Authenticated users can update footer images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'footer-images');

CREATE POLICY "Authenticated users can delete footer images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'footer-images');

CREATE POLICY "Authenticated users can update general uploads" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'general-uploads');

CREATE POLICY "Authenticated users can delete general uploads" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'general-uploads');