/*
  # Comprehensive Content Extraction & Migration

  1. New Tables
    - Enhanced `page_content_blocks` with better structure
    - `component_content` for reusable component content
    - `ui_labels` for form labels, buttons, etc.
    
  2. Content Categories
    - Page-specific content (heroes, sections, CTAs)
    - Component content (headers, footers, forms)
    - UI labels (buttons, form fields, messages)
    - Dynamic content (events, products handled separately)
    
  3. Security
    - Enable RLS on all tables
    - Public read access for content
    - Authenticated write access for admin
*/

-- Drop existing tables if they exist to start fresh
DROP TABLE IF EXISTS page_content_blocks CASCADE;
DROP TABLE IF EXISTS component_content CASCADE;
DROP TABLE IF EXISTS ui_labels CASCADE;

-- Enhanced page content blocks table
CREATE TABLE page_content_blocks (
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

-- Component content for reusable components (header, footer, etc.)
CREATE TABLE component_content (
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

-- UI labels for buttons, form fields, messages, etc.
CREATE TABLE ui_labels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL, -- 'buttons', 'forms', 'messages', 'navigation'
  label_key text NOT NULL,
  label_text text NOT NULL,
  context text, -- Additional context for where it's used
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(category, label_key)
);

-- Enable RLS
ALTER TABLE page_content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE component_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE ui_labels ENABLE ROW LEVEL SECURITY;

-- RLS Policies for page_content_blocks
CREATE POLICY "Page content is publicly readable"
  ON page_content_blocks
  FOR SELECT
  TO public
  USING (active = true);

CREATE POLICY "Authenticated users can manage page content"
  ON page_content_blocks
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for component_content
CREATE POLICY "Component content is publicly readable"
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

-- RLS Policies for ui_labels
CREATE POLICY "UI labels are publicly readable"
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

-- Insert comprehensive content for HOME page
INSERT INTO page_content_blocks (page_slug, section_key, content_type, title, subtitle, content_text, metadata, order_position) VALUES
('home', 'hero_slider', 'slider_section', 'Hero Slider', null, 'Main homepage slider content', '{"note": "Slider content managed separately in sliders table"}', 1),
('home', 'upcoming_events', 'section_header', 'Upcoming Events', null, 'Don''t miss out on our exciting events and activities!', '{}', 2),
('home', 'info_section', 'info_section', 'Why Choose Star Jump?', null, 'At Star Jump, we understand that every celebration deserves to be extraordinary. With over 10 years of experience in children''s entertainment, we bring joy, safety, and unforgettable memories to your doorstep.', '{"benefits": ["Safety certified equipment with regular inspections", "Creating magical memories for children and families", "Premium quality inflatables and entertainment", "Professional setup and supervision included"], "stats": {"events": "500+", "experience": "10+", "support": "24/7"}}', 3),
('home', 'booking_cta', 'cta_section', 'Book a Fun Space Today!', null, 'Bring the fun to your doorstep! Whether it''s a birthday, corporate event, or school function, our mobile fun stations are a hit.', '{"features": [{"title": "Flexible Booking", "description": "Same-day or advance bookings available"}, {"title": "Full Setup Service", "description": "Professional delivery, setup, and collection"}, {"title": "24/7 Support", "description": "Round-the-clock assistance for your event"}]}', 4),
('home', 'shop_preview', 'section_header', 'Our Fun Shop', null, 'Discover our premium collection of bouncy castles, slides, and fun accessories!', '{}', 5);

-- Insert comprehensive content for ABOUT US page
INSERT INTO page_content_blocks (page_slug, section_key, content_type, title, subtitle, content_text, metadata, order_position) VALUES
('about', 'hero', 'hero_section', 'About Star Jump', null, 'Kenya''s premier provider of fun stations and children''s play areas, bringing joy and excitement to every celebration since 2018.', '{}', 1),
('about', 'story', 'text_with_image', 'Our Story', null, 'Star Jump was born from a simple belief: every child deserves to experience pure joy and wonder. Founded in Nairobi in 2018, we started with a single bouncy castle and a dream to make celebrations unforgettable.\n\nToday, we''re proud to serve families, schools, malls, and corporations across Kenya with our premium collection of play equipment and professional event services. From intimate birthday parties to large corporate events, we bring the magic of play to every occasion.\n\nOur commitment to safety, quality, and exceptional service has made us Kenya''s trusted partner for creating memories that last a lifetime.', '{"image_url": "https://images.pexels.com/photos/1104014/pexels-photo-1104014.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1", "layout": "right-image"}', 2),
('about', 'mission', 'mission_vision', 'Our Mission', null, 'To create magical play experiences that bring families and communities together, while providing safe, high-quality entertainment solutions that spark joy and imagination in children across Kenya.', '{"type": "mission", "icon": "Target"}', 3),
('about', 'vision', 'mission_vision', 'Our Vision', null, 'To be East Africa''s leading provider of children''s entertainment solutions, setting the standard for safety, innovation, and service excellence in the play equipment industry.', '{"type": "vision", "icon": "Eye"}', 4),
('about', 'values', 'values_grid', 'Our Values', 'The principles that guide everything we do at Star Jump', null, '{"values": [{"title": "Child Safety First", "description": "Every piece of equipment is regularly inspected and meets international safety standards.", "icon": "Heart", "color": "bg-red-500"}, {"title": "Quality Excellence", "description": "We use only premium, durable equipment that provides the best play experience.", "icon": "Star", "color": "bg-star-yellow"}, {"title": "Community Focus", "description": "Supporting Kenyan families and businesses with memorable celebration solutions.", "icon": "Users", "color": "bg-grass-green"}, {"title": "Professional Service", "description": "Our trained team ensures seamless setup, supervision, and cleanup for every event.", "icon": "Award", "color": "bg-bright-orange"}]}', 5),
('about', 'team', 'team_grid', 'Meet Our Team', 'The passionate people behind Kenya''s favorite play experience provider', null, '{"members": [{"name": "Sarah Wanjiku", "role": "Founder & CEO", "image": "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1", "description": "Passionate about creating magical experiences for children across Kenya."}, {"name": "David Kimani", "role": "Operations Manager", "image": "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1", "description": "Ensures every event runs smoothly with our premium equipment and service."}, {"name": "Grace Achieng", "role": "Creative Director", "image": "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1", "description": "Designs unique play experiences that spark imagination and joy."}]}', 6),
('about', 'cta', 'cta_section', 'Ready to Create Magic?', null, 'Let''s work together to make your next event unforgettable. Contact us today for a personalized quote!', '{"buttons": [{"text": "Book Now", "link": "/booking"}, {"text": "Contact Us", "link": "/contact"}]}', 7);

-- Insert comprehensive content for CORPORATE page
INSERT INTO page_content_blocks (page_slug, section_key, content_type, title, subtitle, content_text, metadata, order_position) VALUES
('corporate', 'hero', 'hero_section', 'Corporate Solutions', null, 'Transform your institution with premium play solutions. From permanent installations to event rentals, we create engaging experiences for your community.', '{"buttons": [{"text": "Get Custom Quote", "link": "#contact-form"}, {"text": "View Services", "link": "#services"}]}', 1),
('corporate', 'services', 'services_grid', 'Our Services', 'Comprehensive play solutions tailored for institutions and corporate clients', null, '{"services": [{"icon": "Building2", "title": "Permanent Installations", "description": "Custom-designed play areas for malls, hospitals, schools, and residential complexes.", "features": ["Custom design consultation", "Professional installation", "Ongoing maintenance", "Safety compliance"], "color": "bg-royal-blue"}, {"icon": "Calendar", "title": "Event Rentals", "description": "Premium equipment rentals for corporate events, school functions, and institutional celebrations.", "features": ["Full setup & breakdown", "Professional supervision", "Insurance coverage", "Flexible packages"], "color": "bg-grass-green"}, {"icon": "Users", "title": "Team Building", "description": "Engaging team-building activities and corporate family day solutions.", "features": ["Interactive games", "Team challenges", "Family-friendly activities", "Professional facilitation"], "color": "bg-bright-orange"}]}', 2),
('corporate', 'client_types', 'client_types_grid', 'Who We Serve', 'Trusted by leading institutions across Kenya', null, '{"client_types": [{"name": "Shopping Malls", "icon": "🏬", "description": "Permanent play areas and seasonal events"}, {"name": "Schools & Universities", "icon": "🏫", "description": "Sports days, graduation events, open days"}, {"name": "Hospitals & Clinics", "icon": "🏥", "description": "Children''s waiting areas and wellness events"}, {"name": "Corporate Offices", "icon": "🏢", "description": "Family days, team building, celebrations"}, {"name": "Residential Complexes", "icon": "🏘️", "description": "Community events and permanent installations"}, {"name": "Hotels & Resorts", "icon": "🏨", "description": "Guest entertainment and special events"}]}', 3),
('corporate', 'cta', 'cta_section', 'Let''s Build a Play Space Together!', null, 'Tell us about your institution and requirements', '{"form_note": "Contact form handled separately"}', 4);

-- Insert comprehensive content for EVENTS page
INSERT INTO page_content_blocks (page_slug, section_key, content_type, title, subtitle, content_text, metadata, order_position) VALUES
('events', 'hero', 'hero_section', 'Upcoming Events', null, 'Join us at exciting events across Kenya! From festivals to corporate gatherings, experience the magic of Star Jump.', '{}', 1),
('events', 'featured_section', 'section_header', 'Featured Events', null, 'Don''t miss these amazing upcoming events and celebrations', '{}', 2),
('events', 'all_events_section', 'section_header', 'All Events', null, 'Browse all our upcoming events and activities', '{}', 3),
('events', 'cta_section', 'cta_section', 'Want Star Jump at Your Event?', null, 'Planning an event? Let us bring the fun to you! Contact us for custom event solutions and equipment rentals.', '{"buttons": [{"text": "Book Equipment", "link": "/booking"}, {"text": "Corporate Events", "link": "/corporate"}]}', 4);

-- Insert comprehensive content for BOOKING page
INSERT INTO page_content_blocks (page_slug, section_key, content_type, title, subtitle, content_text, metadata, order_position) VALUES
('booking', 'hero', 'hero_section', 'Book Your Fun Space', null, 'Fill out the form below and we''ll get back to you with availability and pricing in KES!', '{}', 1),
('booking', 'form_header', 'form_section', 'Let''s Make Your Event Amazing!', 'Tell us about your event and we''ll handle the rest', null, '{}', 2),
('booking', 'help_section', 'help_section', 'What happens next?', null, null, '{"steps": ["We''ll review your request within 2 hours during business hours", "Our team will contact you to confirm availability and discuss details", "We''ll provide a detailed quote in Kenyan Shillings (KES) with all costs", "Once confirmed, we''ll handle all the setup, delivery, and collection", "Professional supervision included for safe, worry-free fun!"]}', 3),
('booking', 'success_section', 'success_section', 'Booking Request Received!', null, 'Thank you for choosing Star Jump Kenya! We''ve received your booking request and will contact you within 2 hours with availability confirmation and pricing details in Kenyan Shillings (KES).', '{}', 4);

-- Insert comprehensive content for SHOP page
INSERT INTO page_content_blocks (page_slug, section_key, content_type, title, subtitle, content_text, metadata, order_position) VALUES
('shop', 'hero', 'hero_section', 'Fun Shop', null, 'Discover our premium collection of play equipment and accessories. Quality guaranteed, fun delivered across Kenya!', '{}', 1),
('shop', 'features_section', 'features_section', 'Why Shop With Us', null, null, '{"features": [{"icon": "🚚", "title": "Free Delivery", "description": "Free delivery within Nairobi for orders over KES 5,000", "color": "bg-grass-green"}, {"icon": "🛡️", "title": "Safety Guaranteed", "description": "All equipment is safety certified and regularly inspected", "color": "bg-star-yellow"}, {"icon": "⭐", "title": "Premium Quality", "description": "High-quality equipment from trusted international brands", "color": "bg-bright-orange"}]}', 2),
('shop', 'cta_section', 'cta_section', 'Need Help Choosing?', null, 'Our team is here to help you select the perfect equipment for your event. Get personalized recommendations!', '{"buttons": [{"text": "Contact Expert", "link": "/contact"}, {"text": "Book Now", "link": "/booking"}]}', 3);

-- Insert comprehensive content for BLOG page
INSERT INTO page_content_blocks (page_slug, section_key, content_type, title, subtitle, content_text, metadata, order_position) VALUES
('blog', 'hero', 'hero_section', 'Star Jump Blog', null, 'Insights, tips, and stories from Kenya''s leading children''s entertainment experts', '{}', 1),
('blog', 'featured_section', 'section_header', 'Featured Articles', null, 'Our most popular and insightful posts', '{}', 2),
('blog', 'newsletter_section', 'newsletter_section', 'Stay Updated!', null, 'Subscribe to our newsletter for the latest tips, event updates, and exclusive offers from Star Jump Kenya.', '{}', 3);

-- Insert comprehensive content for CONTACT page
INSERT INTO page_content_blocks (page_slug, section_key, content_type, title, subtitle, content_text, metadata, order_position) VALUES
('contact', 'hero', 'hero_section', 'Contact Us', null, 'Get in touch with Kenya''s premier children''s entertainment experts. We''re here to make your event magical!', '{}', 1),
('contact', 'contact_info', 'contact_info_cards', 'Contact Information', null, null, '{"cards": [{"icon": "Phone", "title": "Call Us", "content": "+254 700 000 000", "subtitle": "Mon-Fri: 8AM-6PM"}, {"icon": "Mail", "title": "Email Us", "content": "info@starjump.co.ke", "subtitle": "24/7 Response"}, {"icon": "MessageCircle", "title": "WhatsApp", "content": "+254 700 000 000", "subtitle": "Instant Response"}, {"icon": "MapPin", "title": "Visit Us", "content": "3 Locations", "subtitle": "Across Nairobi"}]}', 2),
('contact', 'contact_form', 'contact_form_section', 'Send us a Message', 'We''d love to hear from you!', null, '{}', 3),
('contact', 'business_hours', 'business_hours_section', 'Business Hours', null, null, '{"hours": [{"day": "Monday - Friday", "time": "8:00 AM - 6:00 PM"}, {"day": "Saturday", "time": "9:00 AM - 5:00 PM"}, {"day": "Sunday", "time": "9:00 AM - 5:00 PM"}, {"day": "Emergency Support", "time": "24/7 Available", "special": true}]}', 4),
('contact', 'locations', 'locations_grid', 'Our Locations', 'Visit us at any of our convenient locations across Nairobi', null, '{"locations": [{"name": "Greenspan Mall", "address": "Greenspan Mall, Donholm Road, Nairobi", "phone": "+254 700 000 001", "hours": "Mon-Sun: 10:00 AM - 8:00 PM", "image": "https://images.pexels.com/photos/1104014/pexels-photo-1104014.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1"}, {"name": "Garden City Mall", "address": "Garden City Mall, Thika Road, Nairobi", "phone": "+254 700 000 002", "hours": "Mon-Sun: 10:00 AM - 9:00 PM", "image": "https://images.pexels.com/photos/1619654/pexels-photo-1619654.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1"}, {"name": "Galleria Mall", "address": "Galleria Shopping Mall, Langata Road, Nairobi", "phone": "+254 700 000 003", "hours": "Mon-Sun: 10:00 AM - 8:00 PM", "image": "https://images.pexels.com/photos/1292294/pexels-photo-1292294.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1"}]}', 5);

-- Insert comprehensive content for PRIVACY POLICY page
INSERT INTO page_content_blocks (page_slug, section_key, content_type, title, subtitle, content_text, metadata, order_position) VALUES
('privacy-policy', 'hero', 'hero_section', 'Privacy Policy', null, 'How Star Jump Kenya protects and handles your personal information', '{"last_updated": "November 2024"}', 1),
('privacy-policy', 'information_collection', 'legal_section', 'Information We Collect', null, 'Star Jump Kenya ("we," "our," or "us") collects information you provide directly to us, such as when you fill out booking forms, subscribe to newsletters, participate in events, or contact us.', '{"types": ["Personal Information: Name, email address, phone number, physical address", "Event Information: Event dates, locations, number of attendees, special requirements", "Payment Information: Billing details (processed securely through third-party providers)", "Communication Records: Records of our interactions with you"]}', 2),
('privacy-policy', 'information_usage', 'legal_section', 'How We Use Your Information', null, 'We use the information we collect to process bookings, communicate about services, send marketing communications (with consent), improve our services, comply with legal obligations, and ensure event safety and security.', '{}', 3),
('privacy-policy', 'contact_info', 'contact_section', 'Contact Us', null, 'If you have any questions about this privacy policy or our data practices, please contact us at privacy@starjump.co.ke or +254 700 000 000.', '{}', 4);

-- Insert comprehensive content for TERMS & CONDITIONS page
INSERT INTO page_content_blocks (page_slug, section_key, content_type, title, subtitle, content_text, metadata, order_position) VALUES
('terms-conditions', 'hero', 'hero_section', 'Terms & Conditions', null, 'Terms of service for Star Jump Kenya equipment rental and event services', '{"last_updated": "November 2024"}', 1),
('terms-conditions', 'agreement', 'legal_section', 'Agreement to Terms', null, 'By accessing and using Star Jump Kenya''s services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.', '{}', 2),
('terms-conditions', 'services', 'legal_section', 'Service Description', null, 'Star Jump Kenya provides rental of inflatable play equipment, event setup and breakdown services, equipment supervision and safety monitoring, corporate and institutional play area installations, and event planning consultation services.', '{}', 3),
('terms-conditions', 'payment_terms', 'legal_section', 'Booking and Payment Terms', null, 'All bookings must be confirmed in writing. A 50% deposit is required to secure your booking. Full payment is due 24 hours before the event date. Prices are quoted in Kenyan Shillings (KES) and include VAT where applicable.', '{"cancellation_policy": ["More than 7 days: Full refund minus 10% processing fee", "3-7 days: 50% refund", "Less than 3 days: No refund", "Weather cancellations: Full refund or rescheduling at no extra cost"]}', 4),
('terms-conditions', 'contact_info', 'contact_section', 'Contact Information', null, 'For questions about these terms and conditions, please contact us at legal@starjump.co.ke or +254 700 000 000.', '{}', 5);

-- Insert component content for HEADER
INSERT INTO component_content (component_name, content_key, content_type, title, content_text, metadata) VALUES
('header', 'logo_text', 'text', 'Star Jump Logo', 'STAR JUMP', '{}'),
('header', 'admin_link_text', 'text', 'Admin Link', 'Admin', '{}');

-- Insert component content for FOOTER
INSERT INTO component_content (component_name, content_key, content_type, title, content_text, metadata) VALUES
('footer', 'company_description', 'text', 'Company Description', 'Kenya''s leading provider of fun stations and children''s play areas for private and corporate events. Bringing joy to every celebration!', '{}'),
('footer', 'quick_links_title', 'text', 'Quick Links Title', 'Quick Links', '{}'),
('footer', 'contact_info_title', 'text', 'Contact Info Title', 'Contact Info', '{}'),
('footer', 'locations_title', 'text', 'Locations Title', 'Our Locations', '{}'),
('footer', 'copyright_text', 'text', 'Copyright Text', '© 2024 Star Jump Kenya. All rights reserved.', '{}');

-- Insert UI labels for buttons, forms, and messages
INSERT INTO ui_labels (category, label_key, label_text, context) VALUES
-- Navigation buttons
('buttons', 'home', 'Home', 'Main navigation'),
('buttons', 'about', 'About Us', 'Main navigation'),
('buttons', 'corporate', 'Corporate', 'Main navigation'),
('buttons', 'events', 'Events', 'Main navigation'),
('buttons', 'booking', 'Book Fun Space', 'Main navigation'),
('buttons', 'shop', 'Shop', 'Main navigation'),
('buttons', 'blog', 'Blog', 'Main navigation'),
('buttons', 'contact', 'Contact Us', 'Main navigation'),

-- Common action buttons
('buttons', 'book_now', 'Book Now', 'CTA buttons'),
('buttons', 'contact_expert', 'Contact Expert', 'CTA buttons'),
('buttons', 'learn_more', 'Learn More', 'CTA buttons'),
('buttons', 'view_all', 'View All', 'Section buttons'),
('buttons', 'get_directions', 'Get Directions', 'Location buttons'),
('buttons', 'send_message', 'Send Message', 'Form buttons'),
('buttons', 'subscribe', 'Subscribe', 'Newsletter buttons'),

-- Form labels
('forms', 'full_name', 'Full Name', 'Contact/booking forms'),
('forms', 'email_address', 'Email Address', 'Contact/booking forms'),
('forms', 'phone_number', 'Phone Number', 'Contact/booking forms'),
('forms', 'message', 'Message', 'Contact forms'),
('forms', 'subject', 'Subject', 'Contact forms'),
('forms', 'event_date', 'Event Date', 'Booking forms'),
('forms', 'location', 'Location', 'Booking forms'),
('forms', 'event_type', 'Event Type', 'Booking forms'),

-- Messages
('messages', 'loading', 'Loading...', 'Loading states'),
('messages', 'error_generic', 'An error occurred. Please try again.', 'Error messages'),
('messages', 'success_contact', 'Message sent successfully!', 'Success messages'),
('messages', 'success_booking', 'Booking request received!', 'Success messages'),
('messages', 'required_field', 'This field is required', 'Validation messages');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_page_content_blocks_updated_at
    BEFORE UPDATE ON page_content_blocks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_component_content_updated_at
    BEFORE UPDATE ON component_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ui_labels_updated_at
    BEFORE UPDATE ON ui_labels
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();