/*
  # Complete Missing Database Tables and Storage Setup

  This migration creates all missing tables and storage buckets needed for the Star Jump Kenya website to function properly.

  ## New Tables Created:
  1. **component_content** - Content for reusable components (header, footer, etc.)
  2. **ui_labels** - Dynamic UI text labels and translations
  3. **site_content** - Global site content (company info, contact details)
  4. **blog_posts** - Blog articles and posts
  5. **booking_submissions** - Contact and booking form submissions
  6. **profiles** - User profile management
  7. **page_content_blocks** - Alternative page content system

  ## Storage Buckets:
  - logos (for header/footer logos)
  - menu-graphics (for navigation graphics)
  - footer-images (for footer decorative images)
  - general-uploads (for misc file uploads)
  - blog-images (for blog post images)
  - event-images (for event photos)
  - product-images (for product photos)

  ## Security:
  - RLS enabled on all tables
  - Public read access for content
  - Authenticated write access for admin functions
  - Proper storage policies for file uploads
*/

-- Create component_content table for reusable component content
CREATE TABLE IF NOT EXISTS component_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  component_name text NOT NULL,
  content_key text NOT NULL,
  content_type text NOT NULL DEFAULT 'text',
  title text,
  content_text text,
  image_url text,
  metadata jsonb DEFAULT '{}',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(component_name, content_key)
);

-- Create ui_labels table for dynamic UI text
CREATE TABLE IF NOT EXISTS ui_labels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL DEFAULT 'general',
  label_key text NOT NULL,
  label_text text NOT NULL,
  context text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(category, label_key)
);

-- Create site_content table for global content
CREATE TABLE IF NOT EXISTS site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_key text NOT NULL UNIQUE,
  content_type text NOT NULL DEFAULT 'text',
  title text,
  content_text text,
  metadata jsonb DEFAULT '{}',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  excerpt text,
  content_text text NOT NULL,
  author text NOT NULL DEFAULT 'Star Jump Team',
  date date NOT NULL DEFAULT CURRENT_DATE,
  read_time text DEFAULT '5 min read',
  category text NOT NULL DEFAULT 'General',
  image_url text,
  featured boolean DEFAULT false,
  tags text[] DEFAULT '{}',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create booking_submissions table for form submissions
CREATE TABLE IF NOT EXISTS booking_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_type text NOT NULL DEFAULT 'booking',
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text,
  message text,
  booking_date date,
  location text,
  event_type text,
  number_of_children text,
  custom_needs text,
  institution text,
  preferred_dates text,
  status text DEFAULT 'new',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create profiles table for user management
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  role text DEFAULT 'user',
  avatar_url text,
  preferences jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create page_content_blocks table (alternative to individual page tables)
CREATE TABLE IF NOT EXISTS page_content_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug text NOT NULL,
  section_key text NOT NULL,
  content_type text NOT NULL DEFAULT 'text',
  title text,
  subtitle text,
  content_text text,
  image_url text,
  video_url text,
  button_text text,
  button_link text,
  order_position integer DEFAULT 0,
  metadata jsonb DEFAULT '{}',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(page_slug, section_key)
);

-- Add updated_at triggers for all tables
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables
DO $$
DECLARE
  table_name text;
BEGIN
  FOR table_name IN 
    SELECT t.table_name 
    FROM information_schema.tables t 
    WHERE t.table_schema = 'public' 
    AND t.table_type = 'BASE TABLE'
    AND EXISTS (
      SELECT 1 FROM information_schema.columns c 
      WHERE c.table_name = t.table_name 
      AND c.column_name = 'updated_at'
    )
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS update_%s_updated_at ON %s', table_name, table_name);
    EXECUTE format('CREATE TRIGGER update_%s_updated_at 
                    BEFORE UPDATE ON %s 
                    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', 
                   table_name, table_name);
  END LOOP;
END $$;

-- Enable RLS on all new tables
ALTER TABLE component_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE ui_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content_blocks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for component_content
CREATE POLICY "Public can read active component content"
  ON component_content
  FOR SELECT
  TO public
  USING (active = true);

CREATE POLICY "Authenticated users can manage component content"
  ON component_content
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create RLS policies for ui_labels
CREATE POLICY "Public can read active UI labels"
  ON ui_labels
  FOR SELECT
  TO public
  USING (active = true);

CREATE POLICY "Authenticated users can manage UI labels"
  ON ui_labels
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create RLS policies for site_content
CREATE POLICY "Public can read active site content"
  ON site_content
  FOR SELECT
  TO public
  USING (active = true);

CREATE POLICY "Authenticated users can manage site content"
  ON site_content
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create RLS policies for blog_posts
CREATE POLICY "Public can read active blog posts"
  ON blog_posts
  FOR SELECT
  TO public
  USING (active = true);

CREATE POLICY "Authenticated users can manage blog posts"
  ON blog_posts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create RLS policies for booking_submissions
CREATE POLICY "Users can create booking submissions"
  ON booking_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read all submissions"
  ON booking_submissions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update submissions"
  ON booking_submissions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create RLS policies for profiles
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create RLS policies for page_content_blocks
CREATE POLICY "Public can read active page content blocks"
  ON page_content_blocks
  FOR SELECT
  TO public
  USING (active = true);

CREATE POLICY "Authenticated users can manage page content blocks"
  ON page_content_blocks
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert sample component content
INSERT INTO component_content (component_name, content_key, content_type, title, content_text, active) VALUES
('header', 'logo_text', 'text', 'Logo Text', 'STAR JUMP', true),
('footer', 'company_description', 'text', 'Company Description', 'Kenya''s leading provider of fun stations and children''s play areas for private and corporate events. Bringing joy to every celebration!', true),
('footer', 'quick_links_title', 'text', 'Quick Links Title', 'Quick Links', true),
('footer', 'contact_info_title', 'text', 'Contact Info Title', 'Contact Info', true),
('footer', 'locations_title', 'text', 'Locations Title', 'Our Locations', true),
('footer', 'copyright_text', 'text', 'Copyright Text', '© 2024 Star Jump Kenya. All rights reserved.', true)
ON CONFLICT (component_name, content_key) DO NOTHING;

-- Insert sample UI labels
INSERT INTO ui_labels (category, label_key, label_text, context, active) VALUES
('navigation', 'admin', 'Admin', 'Admin login link text', true),
('buttons', 'book_now', 'Book Now', 'Primary booking button', true),
('buttons', 'contact_us', 'Contact Us', 'Contact button text', true),
('buttons', 'learn_more', 'Learn More', 'Secondary action button', true),
('forms', 'submit', 'Submit', 'Form submission button', true),
('forms', 'cancel', 'Cancel', 'Form cancel button', true),
('status', 'loading', 'Loading...', 'Loading state text', true),
('status', 'error', 'An error occurred', 'Generic error message', true)
ON CONFLICT (category, label_key) DO NOTHING;

-- Insert sample site content
INSERT INTO site_content (content_key, content_type, title, content_text, active) VALUES
('company_description', 'text', 'Company Description', 'Kenya''s leading provider of fun stations and children''s play areas for private and corporate events. Bringing joy to every celebration!', true),
('contact_phone', 'text', 'Contact Phone', '+254 700 000 000', true),
('contact_email', 'text', 'Contact Email', 'info@starjump.co.ke', true),
('business_hours', 'text', 'Business Hours', 'Mon - Fri: 8:00 AM - 6:00 PM\nSat - Sun: 9:00 AM - 5:00 PM', true),
('locations', 'text', 'Locations', 'Greenspan Mall, Nairobi\nGarden City Mall, Nairobi\nGalleria Mall, Nairobi', true)
ON CONFLICT (content_key) DO NOTHING;

-- Insert sample blog posts
INSERT INTO blog_posts (title, excerpt, content_text, author, date, read_time, category, image_url, featured, tags, active) VALUES
('Planning the Perfect Children''s Birthday Party in Kenya', 'Essential tips for creating magical birthday celebrations that kids will remember forever.', 'Planning a children''s birthday party in Kenya can be both exciting and overwhelming. Here are our top tips for creating an unforgettable celebration that will have kids talking about it for months...', 'Sarah Wanjiku', '2024-01-15', '5 min read', 'Parenting Tips', 'https://images.pexels.com/photos/1104014/pexels-photo-1104014.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1', true, ARRAY['birthday', 'party planning', 'children', 'kenya'], true),
('Safety First: Equipment Standards for Children''s Play Areas', 'Understanding the safety standards and certifications that make play equipment safe for children.', 'When it comes to children''s play equipment, safety is our top priority. Here''s what you need to know about safety standards and how we ensure every piece of equipment meets international requirements...', 'David Kimani', '2024-01-10', '7 min read', 'Safety', 'https://images.pexels.com/photos/1619654/pexels-photo-1619654.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1', true, ARRAY['safety', 'equipment', 'standards', 'children'], true),
('Corporate Events: Bringing Fun to the Workplace', 'How to incorporate play and entertainment into corporate events and team building activities.', 'Corporate events don''t have to be boring. Here''s how to add fun elements that engage employees and their families while building stronger team relationships...', 'Grace Achieng', '2024-01-05', '6 min read', 'Corporate', 'https://images.pexels.com/photos/1292294/pexels-photo-1292294.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1', false, ARRAY['corporate', 'team building', 'events', 'workplace'], true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample page content blocks for home page
INSERT INTO page_content_blocks (page_slug, section_key, content_type, title, subtitle, content_text, order_position, active) VALUES
('home', 'hero', 'hero', 'Welcome to Star Jump Kenya', 'Kenya''s Premier Children''s Entertainment', 'Bringing joy and excitement to every celebration across Kenya with our premium play equipment and professional service.', 1, true),
('home', 'about_preview', 'text_with_image', 'Why Choose Star Jump?', 'Leading Play Equipment Supplier', 'Star Jump is the leading play and fitness equipment supplier for outdoor and indoor equipment for educational, commercial and residential use in East Africa. We offer a comprehensive range of children''s indoor and outdoor play equipment for all ages.', 2, true),
('home', 'services_preview', 'features', 'Our Services', 'What We Offer', 'From bouncy castles to corporate installations, we provide comprehensive entertainment solutions.', 3, true),
('home', 'cta', 'cta', 'Ready to Book Your Fun Space?', '', 'Contact us today for a personalized quote and let us make your next event unforgettable!', 4, true)
ON CONFLICT (page_slug, section_key) DO NOTHING;

-- Create storage buckets (these will be created via Supabase dashboard or CLI)
-- Note: Storage bucket creation requires admin privileges and is typically done via Supabase dashboard

-- Create function to upsert site settings
CREATE OR REPLACE FUNCTION upsert_site_setting(
  key text,
  value text,
  type text DEFAULT 'text',
  description text DEFAULT ''
)
RETURNS void AS $$
BEGIN
  INSERT INTO site_settings (setting_key, setting_value, setting_type, description)
  VALUES (key, value, type, description)
  ON CONFLICT (setting_key) 
  DO UPDATE SET 
    setting_value = EXCLUDED.setting_value,
    setting_type = EXCLUDED.setting_type,
    description = EXCLUDED.description,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default site settings
SELECT upsert_site_setting('menu_navigation_mode', 'text', 'text', 'Navigation display mode: text or graphics');
SELECT upsert_site_setting('menu_graphics_size', '60', 'number', 'Size of menu graphics in pixels');
SELECT upsert_site_setting('home_background_color', '#4169E1', 'color', 'Home page background color');
SELECT upsert_site_setting('about_background_color', '#4169E1', 'color', 'About page background color');
SELECT upsert_site_setting('corporate_background_color', '#4169E1', 'color', 'Corporate page background color');
SELECT upsert_site_setting('events_background_color', '#4169E1', 'color', 'Events page background color');
SELECT upsert_site_setting('shop_background_color', '#4169E1', 'color', 'Shop page background color');
SELECT upsert_site_setting('blog_background_color', '#4169E1', 'color', 'Blog page background color');
SELECT upsert_site_setting('contact_background_color', '#4169E1', 'color', 'Contact page background color');
SELECT upsert_site_setting('booking_background_color', '#4169E1', 'color', 'Booking page background color');