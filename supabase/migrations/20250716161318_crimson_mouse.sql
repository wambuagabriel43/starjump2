/*
  # Create Page-Specific Content Tables

  1. New Tables
    - `home_content` - Home page content blocks
    - `about_content` - About page content blocks  
    - `corporate_content` - Corporate page content blocks
    - `events_content` - Events page content blocks
    - `shop_content` - Shop page content blocks
    - `blog_content` - Blog page content blocks
    - `contact_content` - Contact page content blocks
    - `booking_content` - Booking page content blocks

  2. Security
    - Enable RLS on all page content tables
    - Add policies for public read access and authenticated write access

  3. Features
    - UUID primary keys with auto-generation
    - JSONB metadata for flexible content storage
    - Order positioning for content block arrangement
    - Active/inactive status for content visibility
    - Automatic timestamp management
*/

-- Create home_content table
CREATE TABLE IF NOT EXISTS home_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text NOT NULL,
  content_type text NOT NULL DEFAULT 'text',
  title text,
  subtitle text,
  content_text text,
  image_url text,
  button_text text,
  button_link text,
  order_position integer NOT NULL DEFAULT 0,
  metadata jsonb DEFAULT '{}',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create about_content table
CREATE TABLE IF NOT EXISTS about_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text NOT NULL,
  content_type text NOT NULL DEFAULT 'text',
  title text,
  subtitle text,
  content_text text,
  image_url text,
  button_text text,
  button_link text,
  order_position integer NOT NULL DEFAULT 0,
  metadata jsonb DEFAULT '{}',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create corporate_content table
CREATE TABLE IF NOT EXISTS corporate_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text NOT NULL,
  content_type text NOT NULL DEFAULT 'text',
  title text,
  subtitle text,
  content_text text,
  image_url text,
  button_text text,
  button_link text,
  order_position integer NOT NULL DEFAULT 0,
  metadata jsonb DEFAULT '{}',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create events_content table
CREATE TABLE IF NOT EXISTS events_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text NOT NULL,
  content_type text NOT NULL DEFAULT 'text',
  title text,
  subtitle text,
  content_text text,
  image_url text,
  button_text text,
  button_link text,
  order_position integer NOT NULL DEFAULT 0,
  metadata jsonb DEFAULT '{}',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create shop_content table
CREATE TABLE IF NOT EXISTS shop_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text NOT NULL,
  content_type text NOT NULL DEFAULT 'text',
  title text,
  subtitle text,
  content_text text,
  image_url text,
  button_text text,
  button_link text,
  order_position integer NOT NULL DEFAULT 0,
  metadata jsonb DEFAULT '{}',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blog_content table
CREATE TABLE IF NOT EXISTS blog_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text NOT NULL,
  content_type text NOT NULL DEFAULT 'text',
  title text,
  subtitle text,
  content_text text,
  image_url text,
  button_text text,
  button_link text,
  order_position integer NOT NULL DEFAULT 0,
  metadata jsonb DEFAULT '{}',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create contact_content table
CREATE TABLE IF NOT EXISTS contact_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text NOT NULL,
  content_type text NOT NULL DEFAULT 'text',
  title text,
  subtitle text,
  content_text text,
  image_url text,
  button_text text,
  button_link text,
  order_position integer NOT NULL DEFAULT 0,
  metadata jsonb DEFAULT '{}',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create booking_content table
CREATE TABLE IF NOT EXISTS booking_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text NOT NULL,
  content_type text NOT NULL DEFAULT 'text',
  title text,
  subtitle text,
  content_text text,
  image_url text,
  button_text text,
  button_link text,
  order_position integer NOT NULL DEFAULT 0,
  metadata jsonb DEFAULT '{}',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at on all tables
CREATE TRIGGER update_home_content_updated_at BEFORE UPDATE ON home_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_about_content_updated_at BEFORE UPDATE ON about_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_corporate_content_updated_at BEFORE UPDATE ON corporate_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_content_updated_at BEFORE UPDATE ON events_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shop_content_updated_at BEFORE UPDATE ON shop_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_content_updated_at BEFORE UPDATE ON blog_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_content_updated_at BEFORE UPDATE ON contact_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_booking_content_updated_at BEFORE UPDATE ON booking_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security on all tables
ALTER TABLE home_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE corporate_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE events_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_content ENABLE ROW LEVEL SECURITY;

-- Create policies for home_content
CREATE POLICY "Home content is publicly readable"
  ON home_content
  FOR SELECT
  TO public
  USING (active = true);

CREATE POLICY "Authenticated users can manage home content"
  ON home_content
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for about_content
CREATE POLICY "About content is publicly readable"
  ON about_content
  FOR SELECT
  TO public
  USING (active = true);

CREATE POLICY "Authenticated users can manage about content"
  ON about_content
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for corporate_content
CREATE POLICY "Corporate content is publicly readable"
  ON corporate_content
  FOR SELECT
  TO public
  USING (active = true);

CREATE POLICY "Authenticated users can manage corporate content"
  ON corporate_content
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for events_content
CREATE POLICY "Events content is publicly readable"
  ON events_content
  FOR SELECT
  TO public
  USING (active = true);

CREATE POLICY "Authenticated users can manage events content"
  ON events_content
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for shop_content
CREATE POLICY "Shop content is publicly readable"
  ON shop_content
  FOR SELECT
  TO public
  USING (active = true);

CREATE POLICY "Authenticated users can manage shop content"
  ON shop_content
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for blog_content
CREATE POLICY "Blog content is publicly readable"
  ON blog_content
  FOR SELECT
  TO public
  USING (active = true);

CREATE POLICY "Authenticated users can manage blog content"
  ON blog_content
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for contact_content
CREATE POLICY "Contact content is publicly readable"
  ON contact_content
  FOR SELECT
  TO public
  USING (active = true);

CREATE POLICY "Authenticated users can manage contact content"
  ON contact_content
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for booking_content
CREATE POLICY "Booking content is publicly readable"
  ON booking_content
  FOR SELECT
  TO public
  USING (active = true);

CREATE POLICY "Authenticated users can manage booking content"
  ON booking_content
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add unique constraints for section_key per table to prevent duplicates
ALTER TABLE home_content ADD CONSTRAINT home_content_section_key_unique UNIQUE (section_key);
ALTER TABLE about_content ADD CONSTRAINT about_content_section_key_unique UNIQUE (section_key);
ALTER TABLE corporate_content ADD CONSTRAINT corporate_content_section_key_unique UNIQUE (section_key);
ALTER TABLE events_content ADD CONSTRAINT events_content_section_key_unique UNIQUE (section_key);
ALTER TABLE shop_content ADD CONSTRAINT shop_content_section_key_unique UNIQUE (section_key);
ALTER TABLE blog_content ADD CONSTRAINT blog_content_section_key_unique UNIQUE (section_key);
ALTER TABLE contact_content ADD CONSTRAINT contact_content_section_key_unique UNIQUE (section_key);
ALTER TABLE booking_content ADD CONSTRAINT booking_content_section_key_unique UNIQUE (section_key);

-- Insert sample content for home page
INSERT INTO home_content (section_key, content_type, title, subtitle, content_text, order_position, active) VALUES
('hero', 'hero', 'Welcome to Star Jump Kenya', 'Kenya''s Premier Children''s Entertainment', 'Bringing joy and excitement to children across Kenya with premium play equipment and professional event services.', 1, true),
('about_preview', 'text_with_image', 'Why Choose Star Jump?', 'Quality, Safety, and Fun Combined', 'With over 10 years of experience, we provide safe, high-quality play equipment for birthdays, corporate events, and celebrations across Kenya.', 2, true),
('services_overview', 'features', 'Our Services', 'Everything You Need for Amazing Events', 'From bouncy castles to complete event management, we handle every detail to make your celebration perfect.', 3, true);

-- Insert sample content for about page
INSERT INTO about_content (section_key, content_type, title, subtitle, content_text, order_position, active) VALUES
('hero', 'hero', 'About Star Jump Kenya', 'Kenya''s Leading Children''s Entertainment Provider', 'Founded in 2018, we''ve been creating magical moments for families and businesses across Kenya.', 1, true),
('story', 'text_with_image', 'Our Story', 'From Dream to Reality', 'What started as a single bouncy castle has grown into Kenya''s most trusted children''s entertainment company.', 2, true),
('mission', 'text', 'Our Mission', '', 'To create safe, joyful experiences that bring families and communities together through the power of play.', 3, true);