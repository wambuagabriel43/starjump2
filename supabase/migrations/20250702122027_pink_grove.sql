/*
  # Star Jump Kenya Database Schema

  1. New Tables
    - `events` - Store event information with Kenya-specific locations
    - `products` - Product catalog with KES pricing
    - `sliders` - Homepage image slider management
    - `info_sections` - Editable content sections
    - `site_assets` - Logo, navigation graphics, and other assets

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage content
    - Public read access for website visitors
*/

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  date date NOT NULL,
  time text DEFAULT '',
  location text NOT NULL,
  category text DEFAULT 'General',
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Public can read events
CREATE POLICY "Events are publicly readable"
  ON events
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Authenticated users can manage events
CREATE POLICY "Authenticated users can manage events"
  ON events
  FOR ALL
  TO authenticated
  USING (true);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  image_url text NOT NULL,
  price_kes numeric NOT NULL DEFAULT 0,
  category text NOT NULL DEFAULT 'General',
  rating integer DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  in_stock boolean DEFAULT true,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public can read products
CREATE POLICY "Products are publicly readable"
  ON products
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Authenticated users can manage products
CREATE POLICY "Authenticated users can manage products"
  ON products
  FOR ALL
  TO authenticated
  USING (true);

-- Sliders table
CREATE TABLE IF NOT EXISTS sliders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  subtitle text DEFAULT '',
  image_url text NOT NULL,
  order_position integer NOT NULL DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sliders ENABLE ROW LEVEL SECURITY;

-- Public can read sliders
CREATE POLICY "Sliders are publicly readable"
  ON sliders
  FOR SELECT
  TO anon, authenticated
  USING (active = true);

-- Authenticated users can manage sliders
CREATE POLICY "Authenticated users can manage sliders"
  ON sliders
  FOR ALL
  TO authenticated
  USING (true);

-- Info sections table
CREATE TABLE IF NOT EXISTS info_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text DEFAULT '',
  content_text text NOT NULL,
  image_url text NOT NULL,
  layout text DEFAULT 'left-image' CHECK (layout IN ('left-image', 'right-image')),
  section_key text UNIQUE NOT NULL, -- e.g., 'homepage-about', 'services-intro'
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE info_sections ENABLE ROW LEVEL SECURITY;

-- Public can read info sections
CREATE POLICY "Info sections are publicly readable"
  ON info_sections
  FOR SELECT
  TO anon, authenticated
  USING (active = true);

-- Authenticated users can manage info sections
CREATE POLICY "Authenticated users can manage info sections"
  ON info_sections
  FOR ALL
  TO authenticated
  USING (true);

-- Site assets table
CREATE TABLE IF NOT EXISTS site_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_type text NOT NULL, -- 'logo', 'footer_image', 'nav_graphic', 'cloud_bg'
  image_url text NOT NULL,
  placement_hint text DEFAULT '', -- 'home-footer', 'about-nav', 'header-logo'
  menu_item text DEFAULT '', -- For nav graphics: 'home', 'about', 'corporate', etc.
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE site_assets ENABLE ROW LEVEL SECURITY;

-- Public can read site assets
CREATE POLICY "Site assets are publicly readable"
  ON site_assets
  FOR SELECT
  TO anon, authenticated
  USING (active = true);

-- Authenticated users can manage site assets
CREATE POLICY "Authenticated users can manage site assets"
  ON site_assets
  FOR ALL
  TO authenticated
  USING (true);

-- Insert default data
INSERT INTO events (title, description, image_url, date, time, location, category, featured) VALUES
  ('Summer Fun Festival', 'Join us for a day of bouncing, sliding, and endless fun! Perfect for families and kids of all ages.', 'https://images.pexels.com/photos/1619654/pexels-photo-1619654.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1', '2024-12-15', '10:00 AM - 4:00 PM', 'Greenspan Mall, Nairobi', 'Festival', true),
  ('School Holiday Extravaganza', 'Special school holiday event with multiple bouncy castles, slides, and interactive games for students.', 'https://images.pexels.com/photos/1104014/pexels-photo-1104014.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1', '2024-12-22', '9:00 AM - 3:00 PM', 'Garden City Mall, Nairobi', 'School Event', true),
  ('Community Sports Day', 'Supporting our local community with fun inflatables and entertainment for the whole family to enjoy.', 'https://images.pexels.com/photos/1292294/pexels-photo-1292294.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1', '2025-01-05', '8:00 AM - 6:00 PM', 'Galleria Mall, Nairobi', 'Community', false);

INSERT INTO products (name, description, image_url, price_kes, category, rating, featured) VALUES
  ('Castle Bouncer Deluxe', 'Premium bouncy castle perfect for birthday parties and events. Safe, colorful, and guaranteed fun!', 'https://images.pexels.com/photos/1104014/pexels-photo-1104014.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1', 15000, 'Bouncy Castle', 5, true),
  ('Rainbow Mega Slide', 'Exciting inflatable slide that brings joy to any event. Multiple lanes for maximum fun!', 'https://images.pexels.com/photos/1619654/pexels-photo-1619654.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1', 12000, 'Slide', 5, true),
  ('Super Trampoline Set', 'Professional-grade trampolines for safe bouncing fun. Perfect for active kids!', 'https://images.pexels.com/photos/1292294/pexels-photo-1292294.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1', 8000, 'Trampoline', 4, false),
  ('Star Jump T-Shirt', 'Official Star Jump Kenya merchandise. Comfortable cotton t-shirt for kids and adults.', 'https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1', 2500, 'Apparel', 5, false);

INSERT INTO sliders (title, subtitle, image_url, order_position) VALUES
  ('Bouncy Castle Adventures', 'Safe, fun, and unforgettable experiences for your little ones!', 'https://images.pexels.com/photos/1104014/pexels-photo-1104014.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 1),
  ('Birthday Party Magic', 'Make every celebration extraordinary with our premium equipment!', 'https://images.pexels.com/photos/1619654/pexels-photo-1619654.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 2),
  ('School Events & More', 'Professional equipment rental for schools and corporate events!', 'https://images.pexels.com/photos/1292294/pexels-photo-1292294.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 3);

INSERT INTO info_sections (title, subtitle, content_text, image_url, layout, section_key) VALUES
  ('Why Choose Star Jump?', '', 'At Star Jump, we understand that every celebration deserves to be extraordinary. With over 10 years of experience in children''s entertainment, we bring joy, safety, and unforgettable memories to your doorstep across Kenya.', 'https://images.pexels.com/photos/1104014/pexels-photo-1104014.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1', 'right-image', 'homepage-about');