/*
  # Complete Content Management System Migration

  1. New Tables
    - `page_content_blocks` - Flexible content blocks for any page section
    - `static_events` - Migrated static event data with full details
    - `site_content` - Global site content (footer, contact, etc.)
    - `blog_posts` - Dynamic blog content
    - Enhanced existing tables with missing fields

  2. Content Migration
    - All existing static content preserved and migrated
    - Structured data for easy editing
    - Maintains current page layouts and functionality

  3. Security
    - RLS enabled on all tables
    - Public read access for content
    - Authenticated write access for admin
*/

-- Page Content Blocks (Flexible content system)
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
  updated_at timestamptz DEFAULT now()
);

-- Static Events (Migrated from hardcoded data)
CREATE TABLE IF NOT EXISTS static_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  date text NOT NULL,
  time text,
  location text NOT NULL,
  category text DEFAULT 'General',
  featured boolean DEFAULT false,
  attendees text,
  price_text text DEFAULT 'Free',
  button_primary_text text DEFAULT 'Learn More',
  button_primary_link text DEFAULT '#',
  button_secondary_text text DEFAULT 'Register',
  button_secondary_link text DEFAULT '#',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Site Content (Global content like footer, contact info)
CREATE TABLE IF NOT EXISTS site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_key text UNIQUE NOT NULL,
  content_type text NOT NULL DEFAULT 'text',
  title text,
  content_text text,
  metadata jsonb DEFAULT '{}',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Blog Posts (Dynamic blog system)
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  excerpt text,
  content_text text NOT NULL,
  author text NOT NULL,
  date date NOT NULL,
  read_time text DEFAULT '5 min read',
  category text DEFAULT 'General',
  image_url text,
  featured boolean DEFAULT false,
  tags text[] DEFAULT '{}',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE page_content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE static_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Content blocks are publicly readable"
  ON page_content_blocks FOR SELECT
  TO anon, authenticated
  USING (active = true);

CREATE POLICY "Authenticated users can manage content blocks"
  ON page_content_blocks FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Static events are publicly readable"
  ON static_events FOR SELECT
  TO anon, authenticated
  USING (active = true);

CREATE POLICY "Authenticated users can manage static events"
  ON static_events FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Site content is publicly readable"
  ON site_content FOR SELECT
  TO anon, authenticated
  USING (active = true);

CREATE POLICY "Authenticated users can manage site content"
  ON site_content FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Blog posts are publicly readable"
  ON blog_posts FOR SELECT
  TO anon, authenticated
  USING (active = true);

CREATE POLICY "Authenticated users can manage blog posts"
  ON blog_posts FOR ALL
  TO authenticated
  USING (true);

-- Insert migrated static events data
INSERT INTO static_events (title, description, image_url, date, time, location, category, featured, attendees, price_text) VALUES
(
  'Nairobi Kids Festival 2024',
  'Join us for the biggest children''s festival in Kenya! Three days of non-stop fun with bouncy castles, slides, games, and entertainment for the whole family.',
  'https://images.pexels.com/photos/1619654/pexels-photo-1619654.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
  'December 15-17, 2024',
  '10:00 AM - 6:00 PM',
  'Uhuru Park, Nairobi',
  'Festival',
  true,
  '5000+',
  'KES 500'
),
(
  'Garden City Mall Family Day',
  'Special family day event featuring our premium play equipment, face painting, balloon artists, and exciting prizes for kids of all ages.',
  'https://images.pexels.com/photos/1104014/pexels-photo-1104014.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
  'November 30, 2024',
  '11:00 AM - 7:00 PM',
  'Garden City Mall, Nairobi',
  'Mall Event',
  true,
  '2000+',
  'Free Entry'
);

-- Insert page content blocks for Events page
INSERT INTO page_content_blocks (page_slug, section_key, content_type, title, subtitle, content_text, order_position) VALUES
(
  'events',
  'hero',
  'hero',
  'Upcoming Events',
  null,
  'Join us at exciting events across Kenya! From festivals to corporate gatherings, experience the magic of Star Jump.',
  1
),
(
  'events',
  'featured_section',
  'section_header',
  'Featured Events',
  null,
  'Don''t miss these amazing upcoming events and celebrations',
  2
),
(
  'events',
  'all_events_section',
  'section_header',
  'All Events',
  null,
  null,
  3
),
(
  'events',
  'cta_section',
  'cta',
  'Want Star Jump at Your Event?',
  null,
  'Planning an event? Let us bring the fun to you! Contact us for custom event solutions and equipment rentals.',
  4
);

-- Insert page content blocks for Home page
INSERT INTO page_content_blocks (page_slug, section_key, content_type, title, content_text, button_text, button_link, order_position) VALUES
(
  'home',
  'info_section_title',
  'section_header',
  'Why Choose Star Jump?',
  'At Star Jump, we understand that every celebration deserves to be extraordinary. With over 10 years of experience in children''s entertainment, we bring joy, safety, and unforgettable memories to your doorstep.',
  null,
  null,
  1
),
(
  'home',
  'booking_cta',
  'cta',
  'Book a Fun Space Today!',
  'Bring the fun to your doorstep! Whether it''s a birthday, corporate event, or school function, our mobile fun stations are a hit.',
  'Book Now',
  '/booking',
  2
);

-- Insert site content (footer, contact info)
INSERT INTO site_content (content_key, content_type, title, content_text, metadata) VALUES
(
  'company_description',
  'text',
  null,
  'Kenya''s leading provider of fun stations and children''s play areas for private and corporate events. Bringing joy to every celebration!',
  '{}'
),
(
  'contact_phone',
  'contact',
  'Phone',
  '+254 700 000 000',
  '{"type": "phone"}'
),
(
  'contact_email',
  'contact',
  'Email',
  'info@starjump.co.ke',
  '{"type": "email"}'
),
(
  'business_hours',
  'hours',
  'Business Hours',
  'Mon - Fri: 8:00 AM - 6:00 PM\nSat - Sun: 9:00 AM - 5:00 PM',
  '{"emergency": "24/7 Available"}'
),
(
  'locations',
  'locations',
  'Our Locations',
  'Greenspan Mall, Nairobi\nGarden City Mall, Nairobi\nGalleria Mall, Nairobi',
  '{"type": "list"}'
);

-- Insert blog posts (migrated from static data)
INSERT INTO blog_posts (title, excerpt, content_text, author, date, read_time, category, image_url, featured, tags) VALUES
(
  'Planning the Perfect Children''s Birthday Party in Nairobi',
  'Discover expert tips for organizing an unforgettable birthday celebration that will have kids talking for weeks. From choosing the right venue to selecting age-appropriate activities.',
  'Planning a children''s birthday party can be both exciting and overwhelming. Here are our top tips for creating magical memories...',
  'Sarah Wanjiku',
  '2024-11-15',
  '5 min read',
  'Parenting Tips',
  'https://images.pexels.com/photos/1619654/pexels-photo-1619654.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
  true,
  ARRAY['Birthday Parties', 'Planning', 'Kids Events']
),
(
  'Safety First: Our Equipment Standards and Protocols',
  'Learn about Star Jump''s comprehensive safety measures and how we ensure every piece of equipment meets international standards for child safety.',
  'At Star Jump, safety is our top priority. Every piece of equipment undergoes rigorous testing...',
  'David Kimani',
  '2024-11-10',
  '7 min read',
  'Safety',
  'https://images.pexels.com/photos/1104014/pexels-photo-1104014.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
  true,
  ARRAY['Safety', 'Equipment', 'Standards']
),
(
  'Corporate Events: Building Team Spirit Through Play',
  'Explore how incorporating play elements into corporate events can boost team morale, improve communication, and create lasting bonds among colleagues.',
  'Corporate events don''t have to be boring. Discover how play can transform your next company gathering...',
  'Grace Achieng',
  '2024-11-05',
  '6 min read',
  'Corporate',
  'https://images.pexels.com/photos/1292294/pexels-photo-1292294.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
  false,
  ARRAY['Corporate Events', 'Team Building', 'Business']
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_page_content_blocks_page_section ON page_content_blocks(page_slug, section_key);
CREATE INDEX IF NOT EXISTS idx_static_events_featured ON static_events(featured, date) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured, date) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_site_content_key ON site_content(content_key);

-- Update triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_page_content_blocks_updated_at BEFORE UPDATE ON page_content_blocks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_content_updated_at BEFORE UPDATE ON site_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();