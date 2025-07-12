/*
  # Star Jump Kenya Database Schema

  1. New Tables
    - `events` - Event management with Kenya locations
    - `products` - Product catalog with KES pricing  
    - `sliders` - Homepage image slider management
    - `info_sections` - Editable content sections
    - `site_assets` - Logo and navigation graphics

  2. Security
    - Enable RLS on all tables
    - Public read access for content
    - Authenticated write access for admin functions

  3. Kenya-Specific Features
    - KES pricing for products
    - Kenya locations for events
    - Local context throughout
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

-- Enable RLS if not already enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = 'events' AND n.nspname = 'public' AND c.relrowsecurity = true
  ) THEN
    ALTER TABLE events ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create policies if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'Events are publicly readable'
  ) THEN
    CREATE POLICY "Events are publicly readable"
      ON events
      FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'Authenticated users can manage events'
  ) THEN
    CREATE POLICY "Authenticated users can manage events"
      ON events
      FOR ALL
      TO authenticated
      USING (true);
  END IF;
END $$;

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

-- Enable RLS if not already enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = 'products' AND n.nspname = 'public' AND c.relrowsecurity = true
  ) THEN
    ALTER TABLE products ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create policies if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Products are publicly readable'
  ) THEN
    CREATE POLICY "Products are publicly readable"
      ON products
      FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Authenticated users can manage products'
  ) THEN
    CREATE POLICY "Authenticated users can manage products"
      ON products
      FOR ALL
      TO authenticated
      USING (true);
  END IF;
END $$;

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

-- Enable RLS if not already enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = 'sliders' AND n.nspname = 'public' AND c.relrowsecurity = true
  ) THEN
    ALTER TABLE sliders ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create policies if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'sliders' AND policyname = 'Sliders are publicly readable'
  ) THEN
    CREATE POLICY "Sliders are publicly readable"
      ON sliders
      FOR SELECT
      TO anon, authenticated
      USING (active = true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'sliders' AND policyname = 'Authenticated users can manage sliders'
  ) THEN
    CREATE POLICY "Authenticated users can manage sliders"
      ON sliders
      FOR ALL
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Info sections table
CREATE TABLE IF NOT EXISTS info_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text DEFAULT '',
  content_text text NOT NULL,
  image_url text NOT NULL,
  layout text DEFAULT 'left-image' CHECK (layout IN ('left-image', 'right-image')),
  section_key text UNIQUE NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS if not already enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = 'info_sections' AND n.nspname = 'public' AND c.relrowsecurity = true
  ) THEN
    ALTER TABLE info_sections ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create policies if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'info_sections' AND policyname = 'Info sections are publicly readable'
  ) THEN
    CREATE POLICY "Info sections are publicly readable"
      ON info_sections
      FOR SELECT
      TO anon, authenticated
      USING (active = true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'info_sections' AND policyname = 'Authenticated users can manage info sections'
  ) THEN
    CREATE POLICY "Authenticated users can manage info sections"
      ON info_sections
      FOR ALL
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Site assets table
CREATE TABLE IF NOT EXISTS site_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_type text NOT NULL,
  image_url text NOT NULL,
  placement_hint text DEFAULT '',
  menu_item text DEFAULT '',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS if not already enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = 'site_assets' AND n.nspname = 'public' AND c.relrowsecurity = true
  ) THEN
    ALTER TABLE site_assets ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create policies if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'site_assets' AND policyname = 'Site assets are publicly readable'
  ) THEN
    CREATE POLICY "Site assets are publicly readable"
      ON site_assets
      FOR SELECT
      TO anon, authenticated
      USING (active = true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'site_assets' AND policyname = 'Authenticated users can manage site assets'
  ) THEN
    CREATE POLICY "Authenticated users can manage site assets"
      ON site_assets
      FOR ALL
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Insert sample data for Kenya (only if tables are empty)
INSERT INTO events (title, description, image_url, date, time, location, category, featured)
SELECT 'Summer Fun Festival', 'Join us for a day of bouncing, sliding, and endless fun! Perfect for families and kids of all ages across Nairobi.', 'https://images.pexels.com/photos/1619654/pexels-photo-1619654.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1', '2024-12-15', '10:00 AM - 4:00 PM', 'Greenspan Mall, Nairobi', 'Festival', true
WHERE NOT EXISTS (SELECT 1 FROM events WHERE title = 'Summer Fun Festival');

INSERT INTO events (title, description, image_url, date, time, location, category, featured)
SELECT 'School Holiday Extravaganza', 'Special school holiday event with multiple bouncy castles, slides, and interactive games for students.', 'https://images.pexels.com/photos/1104014/pexels-photo-1104014.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1', '2024-12-22', '9:00 AM - 3:00 PM', 'Garden City Mall, Nairobi', 'School Event', true
WHERE NOT EXISTS (SELECT 1 FROM events WHERE title = 'School Holiday Extravaganza');

INSERT INTO events (title, description, image_url, date, time, location, category, featured)
SELECT 'Community Sports Day', 'Supporting our local Kenyan community with fun inflatables and entertainment for the whole family.', 'https://images.pexels.com/photos/1292294/pexels-photo-1292294.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1', '2025-01-05', '8:00 AM - 6:00 PM', 'Galleria Mall, Nairobi', 'Community', false
WHERE NOT EXISTS (SELECT 1 FROM events WHERE title = 'Community Sports Day');

INSERT INTO products (name, description, image_url, price_kes, category, rating, featured)
SELECT 'Castle Bouncer Deluxe', 'Premium bouncy castle perfect for birthday parties and events. Safe, colorful, and guaranteed fun for Kenyan families!', 'https://images.pexels.com/photos/1104014/pexels-photo-1104014.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1', 15000, 'Bouncy Castle', 5, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Castle Bouncer Deluxe');

INSERT INTO products (name, description, image_url, price_kes, category, rating, featured)
SELECT 'Rainbow Mega Slide', 'Exciting inflatable slide that brings joy to any event. Multiple lanes for maximum fun across Kenya!', 'https://images.pexels.com/photos/1619654/pexels-photo-1619654.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1', 12000, 'Slide', 5, true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Rainbow Mega Slide');

INSERT INTO products (name, description, image_url, price_kes, category, rating, featured)
SELECT 'Super Trampoline Set', 'Professional-grade trampolines for safe bouncing fun. Perfect for active Kenyan kids!', 'https://images.pexels.com/photos/1292294/pexels-photo-1292294.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1', 8000, 'Trampoline', 4, false
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Super Trampoline Set');

INSERT INTO products (name, description, image_url, price_kes, category, rating, featured)
SELECT 'Star Jump T-Shirt', 'Official Star Jump Kenya merchandise. Comfortable cotton t-shirt for kids and adults.', 'https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1', 2500, 'Apparel', 5, false
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Star Jump T-Shirt');

INSERT INTO sliders (title, subtitle, image_url, order_position)
SELECT 'Bouncy Castle Adventures in Kenya', 'Safe, fun, and unforgettable experiences for your little ones across Nairobi!', 'https://images.pexels.com/photos/1104014/pexels-photo-1104014.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 1
WHERE NOT EXISTS (SELECT 1 FROM sliders WHERE title = 'Bouncy Castle Adventures in Kenya');

INSERT INTO sliders (title, subtitle, image_url, order_position)
SELECT 'Birthday Party Magic', 'Make every celebration extraordinary with our premium equipment across Kenya!', 'https://images.pexels.com/photos/1619654/pexels-photo-1619654.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 2
WHERE NOT EXISTS (SELECT 1 FROM sliders WHERE title = 'Birthday Party Magic');

INSERT INTO sliders (title, subtitle, image_url, order_position)
SELECT 'School Events & Corporate Functions', 'Professional equipment rental for schools and corporate events in Nairobi!', 'https://images.pexels.com/photos/1292294/pexels-photo-1292294.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 3
WHERE NOT EXISTS (SELECT 1 FROM sliders WHERE title = 'School Events & Corporate Functions');

INSERT INTO info_sections (title, subtitle, content_text, image_url, layout, section_key)
SELECT 'Why Choose Star Jump Kenya?', '', 'At Star Jump, we understand that every celebration deserves to be extraordinary. With over 10 years of experience in children''s entertainment across Kenya, we bring joy, safety, and unforgettable memories to your doorstep in Nairobi and beyond.', 'https://images.pexels.com/photos/1104014/pexels-photo-1104014.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1', 'right-image', 'homepage-about'
WHERE NOT EXISTS (SELECT 1 FROM info_sections WHERE section_key = 'homepage-about');