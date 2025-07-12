/*
  # Fix Site Customization Issues

  1. Storage Buckets
    - Create missing storage buckets with proper configuration
    - Set up correct RLS policies for uploads and management

  2. Storage Policies
    - Fix authentication issues for file uploads
    - Enable proper CRUD operations for authenticated users

  3. Site Settings
    - Ensure proper upsert functionality
    - Fix background color update mechanism
*/

-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('logos', 'logos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']),
  ('menu-graphics', 'menu-graphics', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']),
  ('footer-images', 'footer-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']),
  ('general-uploads', 'general-uploads', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Drop all existing storage policies to avoid conflicts
DROP POLICY IF EXISTS "Public can view logos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view menu graphics" ON storage.objects;
DROP POLICY IF EXISTS "Public can view footer images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view general uploads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload menu graphics" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload footer images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload general images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update menu graphics" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete menu graphics" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update footer images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete footer images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update general uploads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete general uploads" ON storage.objects;

-- Create comprehensive storage policies
-- Public read access
CREATE POLICY "Public can view all images" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id IN ('logos', 'menu-graphics', 'footer-images', 'general-uploads'));

-- Authenticated users can upload to all buckets
CREATE POLICY "Authenticated users can upload images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN ('logos', 'menu-graphics', 'footer-images', 'general-uploads'));

-- Authenticated users can update their uploads
CREATE POLICY "Authenticated users can update images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id IN ('logos', 'menu-graphics', 'footer-images', 'general-uploads'));

-- Authenticated users can delete their uploads
CREATE POLICY "Authenticated users can delete images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id IN ('logos', 'menu-graphics', 'footer-images', 'general-uploads'));

-- Ensure site_settings table has proper upsert capability
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

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION upsert_site_setting TO authenticated;

-- Ensure all background color settings exist with correct keys
INSERT INTO site_settings (setting_key, setting_value, setting_type, description) 
VALUES
  ('home_background_color', '#4169E1', 'color', 'Background color for home page'),
  ('about_background_color', '#4169E1', 'color', 'Background color for about page'),
  ('corporate_background_color', '#4169E1', 'color', 'Background color for corporate page'),
  ('events_background_color', '#4169E1', 'color', 'Background color for events page'),
  ('booking_background_color', '#4169E1', 'color', 'Background color for booking page'),
  ('shop_background_color', '#4169E1', 'color', 'Background color for shop page'),
  ('blog_background_color', '#4169E1', 'color', 'Background color for blog page'),
  ('contact_background_color', '#4169E1', 'color', 'Background color for contact page')
ON CONFLICT (setting_key) DO NOTHING;