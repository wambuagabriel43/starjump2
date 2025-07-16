/*
  # Create Page-Specific Content Tables

  This migration creates dedicated tables for each page's content, replacing the fragmented system.
  Each page gets its own table with a consistent structure for content blocks.

  ## New Tables Created:
  1. `home_content` - Home page content blocks
  2. `about_content` - About page content blocks  
  3. `corporate_content` - Corporate page content blocks
  4. `events_content` - Events page content blocks
  5. `shop_content` - Shop page content blocks
  6. `blog_content` - Blog page content blocks
  7. `contact_content` - Contact page content blocks
  8. `booking_content` - Booking page content blocks

  ## Security:
  - RLS enabled on all tables
  - Public read access for active content
  - Authenticated write access for admin users
*/

-- Drop conflicting tables that cause confusion
DROP TABLE IF EXISTS page_sections CASCADE;
DROP TABLE IF EXISTS page_content_blocks CASCADE;
DROP TABLE IF EXISTS component_content CASCADE;

-- Create a reusable function for content block structure
CREATE OR REPLACE FUNCTION create_content_table(table_name TEXT) 
RETURNS VOID AS $$
BEGIN
  EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      section_key text NOT NULL,
      content_type text NOT NULL DEFAULT ''text'',
      title text,
      subtitle text,
      content_text text,
      image_url text,
      video_url text,
      button_text text,
      button_link text,
      order_position integer NOT NULL DEFAULT 0,
      metadata jsonb DEFAULT ''{}''::jsonb,
      active boolean NOT NULL DEFAULT true,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now(),
      UNIQUE(section_key)
    );
    
    -- Enable RLS
    ALTER TABLE %I ENABLE ROW LEVEL SECURITY;
    
    -- Public read policy for active content
    CREATE POLICY "Public read access for active content" ON %I
      FOR SELECT TO public
      USING (active = true);
    
    -- Admin write policy
    CREATE POLICY "Authenticated users can manage content" ON %I
      FOR ALL TO authenticated
      USING (true)
      WITH CHECK (true);
    
    -- Updated at trigger
    CREATE TRIGGER update_%I_updated_at
      BEFORE UPDATE ON %I
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  ', table_name, table_name, table_name, table_name, table_name, table_name);
END;
$$ LANGUAGE plpgsql;

-- Create all page-specific content tables
SELECT create_content_table('home_content');
SELECT create_content_table('about_content');
SELECT create_content_table('corporate_content');
SELECT create_content_table('events_content');
SELECT create_content_table('shop_content');
SELECT create_content_table('blog_content');
SELECT create_content_table('contact_content');
SELECT create_content_table('booking_content');

-- Drop the helper function
DROP FUNCTION create_content_table(TEXT);

-- Insert default content for each page
INSERT INTO home_content (section_key, content_type, title, content_text, order_position) VALUES
('hero', 'hero', 'Welcome to Star Jump Kenya', 'Kenya''s premier provider of children''s entertainment and play equipment. Bringing joy to every celebration!', 1),
('features', 'features', 'Why Choose Star Jump?', 'Safety certified equipment, professional setup, and unforgettable experiences for children across Kenya.', 2),
('cta', 'cta', 'Ready to Book?', 'Let''s make your next event magical! Contact us for premium play equipment and professional service.', 3);

INSERT INTO about_content (section_key, content_type, title, content_text, order_position, image_url) VALUES
('hero', 'hero', 'About Star Jump', 'Kenya''s premier provider of fun stations and children''s play areas, bringing joy and excitement to every celebration since 2018.', 1),
('story', 'text_with_image', 'Our Story', 'Star Jump was born from a simple belief: every child deserves to experience pure joy and wonder. Founded in Nairobi in 2018, we started with a single bouncy castle and a dream to make celebrations unforgettable.', 2, 'https://images.pexels.com/photos/1104014/pexels-photo-1104014.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1'),
('mission', 'text', 'Our Mission', 'To create magical play experiences that bring families and communities together, while providing safe, high-quality entertainment solutions that spark joy and imagination in children across Kenya.', 3),
('values', 'features', 'Our Values', 'The principles that guide everything we do at Star Jump', 4);

INSERT INTO corporate_content (section_key, content_type, title, content_text, order_position) VALUES
('hero', 'hero', 'Corporate Solutions', 'Transform your institution with premium play solutions. From permanent installations to event rentals, we create engaging experiences for your community.', 1),
('services', 'features', 'Our Services', 'Comprehensive play solutions tailored for institutions and corporate clients', 2),
('clients', 'features', 'Who We Serve', 'Trusted by leading institutions across Kenya', 3),
('cta', 'cta', 'Let''s Build a Play Space Together!', 'Tell us about your institution and requirements', 4);

INSERT INTO events_content (section_key, content_type, title, content_text, order_position) VALUES
('hero', 'hero', 'Upcoming Events', 'Join us at exciting events across Kenya! From festivals to corporate gatherings, experience the magic of Star Jump.', 1),
('featured_section', 'text', 'Featured Events', 'Don''t miss these amazing upcoming events and celebrations', 2),
('all_events_section', 'text', 'All Events', 'Browse all our upcoming events and activities', 3),
('cta_section', 'cta', 'Want Star Jump at Your Event?', 'Planning an event? Let us bring the fun to you! Contact us for custom event solutions and equipment rentals.', 4);

INSERT INTO shop_content (section_key, content_type, title, content_text, order_position) VALUES
('hero', 'hero', 'Fun Shop', 'Discover our premium collection of play equipment and accessories. Quality guaranteed, fun delivered across Kenya!', 1),
('features', 'features', 'Why Shop With Us', 'Premium quality, safety certified, and delivered across Kenya', 2),
('cta', 'cta', 'Need Help Choosing?', 'Our team is here to help you select the perfect equipment for your event. Get personalized recommendations!', 3);

INSERT INTO blog_content (section_key, content_type, title, content_text, order_position) VALUES
('hero', 'hero', 'Star Jump Blog', 'Insights, tips, and stories from Kenya''s leading children''s entertainment experts', 1),
('featured', 'text', 'Featured Articles', 'Our most popular and insightful posts', 2),
('newsletter', 'cta', 'Stay Updated!', 'Subscribe to our newsletter for the latest tips, event updates, and exclusive offers from Star Jump Kenya.', 3);

INSERT INTO contact_content (section_key, content_type, title, content_text, order_position) VALUES
('hero', 'hero', 'Contact Us', 'Get in touch with Kenya''s premier children''s entertainment experts. We''re here to make your event magical!', 1),
('contact_info', 'features', 'Get In Touch', 'Multiple ways to reach our team', 2),
('locations', 'features', 'Our Locations', 'Visit us at any of our convenient locations across Nairobi', 3);

INSERT INTO booking_content (section_key, content_type, title, content_text, order_position) VALUES
('hero', 'hero', 'Book Your Fun Space', 'Fill out the form below and we''ll get back to you with availability and pricing in KES!', 1),
('process', 'text', 'What Happens Next?', 'Our simple booking process ensures a smooth experience from inquiry to event day.', 2),
('cta', 'cta', 'Ready to Book?', 'Let''s make your event amazing! Fill out our booking form and we''ll handle the rest.', 3);