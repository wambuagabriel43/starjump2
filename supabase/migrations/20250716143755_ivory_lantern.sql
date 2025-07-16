/*
  # Complete Content Migration System
  
  1. New Tables
    - Enhanced page_content_blocks for all page sections
    - Comprehensive content types for all page elements
    
  2. Content Migration
    - All static content from every page migrated to database
    - Structured data for complex content (team members, values, services)
    - Preserved exact content and formatting
    
  3. Security
    - RLS enabled on all tables
    - Public read access, authenticated write access
*/

-- Drop existing table if it exists to recreate with enhanced structure
DROP TABLE IF EXISTS page_content_blocks CASCADE;

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
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE page_content_blocks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
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

-- Create indexes
CREATE INDEX idx_page_content_page_section ON page_content_blocks(page_slug, section_key);
CREATE INDEX idx_page_content_active ON page_content_blocks(active, order_position);

-- Insert ALL static content from every page

-- HOME PAGE CONTENT
INSERT INTO page_content_blocks (page_slug, section_key, content_type, title, subtitle, content_text, metadata, order_position) VALUES
('home', 'hero', 'hero_section', 'Welcome to Star Jump Kenya', 'Premium Children''s Entertainment', 'Kenya''s leading provider of fun stations and children''s play areas for private and corporate events.', '{"buttons": [{"text": "Book Now", "link": "/booking"}, {"text": "View Events", "link": "/events"}]}', 1),
('home', 'info_section', 'info_section', 'Why Choose Star Jump?', '', 'At Star Jump, we understand that every celebration deserves to be extraordinary. With over 10 years of experience in children''s entertainment, we bring joy, safety, and unforgettable memories to your doorstep.', '{"benefits": ["Safety certified equipment with regular inspections", "Creating magical memories for children and families", "Premium quality inflatables and entertainment", "Professional setup and supervision included"], "stats": {"events": "500+", "experience": "10+", "support": "24/7"}}', 2),
('home', 'shop_preview', 'section_header', 'Our Fun Shop', '', 'Discover our premium collection of bouncy castles, slides, and fun accessories!', '{}', 3);

-- ABOUT US PAGE CONTENT
INSERT INTO page_content_blocks (page_slug, section_key, content_type, title, subtitle, content_text, metadata, order_position) VALUES
('about', 'hero', 'hero_section', 'About Star Jump', '', 'Kenya''s premier provider of fun stations and children''s play areas, bringing joy and excitement to every celebration since 2018.', '{}', 1),
('about', 'story', 'text_with_image', 'Our Story', '', 'Star Jump was born from a simple belief: every child deserves to experience pure joy and wonder. Founded in Nairobi in 2018, we started with a single bouncy castle and a dream to make celebrations unforgettable.

Today, we''re proud to serve families, schools, malls, and corporations across Kenya with our premium collection of play equipment and professional event services. From intimate birthday parties to large corporate events, we bring the magic of play to every occasion.

Our commitment to safety, quality, and exceptional service has made us Kenya''s trusted partner for creating memories that last a lifetime.', '{"image_url": "https://images.pexels.com/photos/1104014/pexels-photo-1104014.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1", "layout": "right-image"}', 2),
('about', 'mission', 'mission_vision', 'Our Mission', '', 'To create magical play experiences that bring families and communities together, while providing safe, high-quality entertainment solutions that spark joy and imagination in children across Kenya.', '{"type": "mission", "icon": "Target"}', 3),
('about', 'vision', 'mission_vision', 'Our Vision', '', 'To be East Africa''s leading provider of children''s entertainment solutions, setting the standard for safety, innovation, and service excellence in the play equipment industry.', '{"type": "vision", "icon": "Eye"}', 4),
('about', 'values', 'values_grid', 'Our Values', 'The principles that guide everything we do at Star Jump', '', '{"values": [{"title": "Child Safety First", "description": "Every piece of equipment is regularly inspected and meets international safety standards.", "icon": "Heart", "color": "bg-red-500"}, {"title": "Quality Excellence", "description": "We use only premium, durable equipment that provides the best play experience.", "icon": "Star", "color": "bg-star-yellow"}, {"title": "Community Focus", "description": "Supporting Kenyan families and businesses with memorable celebration solutions.", "icon": "Users", "color": "bg-grass-green"}, {"title": "Professional Service", "description": "Our trained team ensures seamless setup, supervision, and cleanup for every event.", "icon": "Award", "color": "bg-bright-orange"}]}', 5),
('about', 'team', 'team_grid', 'Meet Our Team', 'The passionate people behind Kenya''s favorite play experience provider', '', '{"members": [{"name": "Sarah Wanjiku", "role": "Founder & CEO", "image": "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1", "description": "Passionate about creating magical experiences for children across Kenya."}, {"name": "David Kimani", "role": "Operations Manager", "image": "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1", "description": "Ensures every event runs smoothly with our premium equipment and service."}, {"name": "Grace Achieng", "role": "Creative Director", "image": "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1", "description": "Designs unique play experiences that spark imagination and joy."}]}', 6),
('about', 'cta', 'cta_section', 'Ready to Create Magic?', '', 'Let''s work together to make your next event unforgettable. Contact us today for a personalized quote!', '{"buttons": [{"text": "Book Now", "link": "/booking"}, {"text": "Contact Us", "link": "/contact"}]}', 7);

-- CORPORATE PAGE CONTENT
INSERT INTO page_content_blocks (page_slug, section_key, content_type, title, subtitle, content_text, metadata, order_position) VALUES
('corporate', 'hero', 'hero_section', 'Corporate Solutions', '', 'Transform your institution with premium play solutions. From permanent installations to event rentals, we create engaging experiences for your community.', '{"buttons": [{"text": "Get Custom Quote", "link": "#contact-form"}, {"text": "View Services", "link": "#services"}]}', 1),
('corporate', 'services', 'services_grid', 'Our Services', 'Comprehensive play solutions tailored for institutions and corporate clients', '', '{"services": [{"title": "Permanent Installations", "description": "Custom-designed play areas for malls, hospitals, schools, and residential complexes.", "features": ["Custom design consultation", "Professional installation", "Ongoing maintenance", "Safety compliance"], "icon": "Building2", "color": "bg-royal-blue"}, {"title": "Event Rentals", "description": "Premium equipment rentals for corporate events, school functions, and institutional celebrations.", "features": ["Full setup & breakdown", "Professional supervision", "Insurance coverage", "Flexible packages"], "icon": "Calendar", "color": "bg-grass-green"}, {"title": "Team Building", "description": "Engaging team-building activities and corporate family day solutions.", "features": ["Interactive games", "Team challenges", "Family-friendly activities", "Professional facilitation"], "icon": "Users", "color": "bg-bright-orange"}]}', 2),
('corporate', 'clients', 'client_types', 'Who We Serve', 'Trusted by leading institutions across Kenya', '', '{"types": [{"name": "Shopping Malls", "icon": "🏬", "description": "Permanent play areas and seasonal events"}, {"name": "Schools & Universities", "icon": "🏫", "description": "Sports days, graduation events, open days"}, {"name": "Hospitals & Clinics", "icon": "🏥", "description": "Children''s waiting areas and wellness events"}, {"name": "Corporate Offices", "icon": "🏢", "description": "Family days, team building, celebrations"}, {"name": "Residential Complexes", "icon": "🏘️", "description": "Community events and permanent installations"}, {"name": "Hotels & Resorts", "icon": "🏨", "description": "Guest entertainment and special events"}]}', 3),
('corporate', 'contact_form', 'contact_form', 'Let''s Build a Play Space Together!', 'Tell us about your institution and requirements', '', '{"form_fields": ["Contact Name", "Institution Name", "Email Address", "Phone Number", "Type of Event/Installation", "Preferred Dates", "Custom Requirements"]}', 4);

-- BOOKING PAGE CONTENT
INSERT INTO page_content_blocks (page_slug, section_key, content_type, title, subtitle, content_text, metadata, order_position) VALUES
('booking', 'hero', 'hero_section', 'Book Your Fun Space', '', 'Fill out the form below and we''ll get back to you with availability and pricing in KES!', '{}', 1),
('booking', 'form_header', 'form_section', 'Let''s Make Your Event Amazing!', 'Tell us about your event and we''ll handle the rest', '', '{}', 2),
('booking', 'form_help', 'help_section', 'What happens next?', '', '', '{"steps": ["We''ll review your request within 2 hours during business hours", "Our team will contact you to confirm availability and discuss details", "We''ll provide a detailed quote in Kenyan Shillings (KES) with all costs", "Once confirmed, we''ll handle all the setup, delivery, and collection", "Professional supervision included for safe, worry-free fun!"]}', 3),
('booking', 'success_message', 'success_section', 'Booking Request Received!', '', 'Thank you for choosing Star Jump Kenya! We''ve received your booking request and will contact you within 2 hours with availability confirmation and pricing details in Kenyan Shillings (KES).', '{}', 4);

-- CONTACT PAGE CONTENT
INSERT INTO page_content_blocks (page_slug, section_key, content_type, title, subtitle, content_text, metadata, order_position) VALUES
('contact', 'hero', 'hero_section', 'Contact Us', '', 'Get in touch with Kenya''s premier children''s entertainment experts. We''re here to make your event magical!', '{}', 1),
('contact', 'contact_cards', 'contact_info', 'Contact Information', '', '', '{"cards": [{"title": "Call Us", "content": "+254 700 000 000", "subtitle": "Mon-Fri: 8AM-6PM", "icon": "Phone"}, {"title": "Email Us", "content": "info@starjump.co.ke", "subtitle": "24/7 Response", "icon": "Mail"}, {"title": "WhatsApp", "content": "+254 700 000 000", "subtitle": "Instant Response", "icon": "MessageCircle"}, {"title": "Visit Us", "content": "3 Locations", "subtitle": "Across Nairobi", "icon": "MapPin"}]}', 2),
('contact', 'form_section', 'contact_form', 'Send us a Message', 'We''d love to hear from you!', '', '{"form_fields": ["Full Name", "Email Address", "Subject", "Message"]}', 3),
('contact', 'business_hours', 'business_hours', 'Business Hours', '', '', '{"hours": [{"day": "Monday - Friday", "time": "8:00 AM - 6:00 PM"}, {"day": "Saturday", "time": "9:00 AM - 5:00 PM"}, {"day": "Sunday", "time": "9:00 AM - 5:00 PM"}, {"day": "Emergency Support", "time": "24/7 Available"}]}', 4),
('contact', 'locations', 'locations_grid', 'Our Locations', 'Visit us at any of our convenient locations across Nairobi', '', '{"locations": [{"name": "Greenspan Mall", "address": "Greenspan Mall, Donholm Road, Nairobi", "phone": "+254 700 000 001", "hours": "Mon-Sun: 10:00 AM - 8:00 PM", "image": "https://images.pexels.com/photos/1104014/pexels-photo-1104014.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1"}, {"name": "Garden City Mall", "address": "Garden City Mall, Thika Road, Nairobi", "phone": "+254 700 000 002", "hours": "Mon-Sun: 10:00 AM - 9:00 PM", "image": "https://images.pexels.com/photos/1619654/pexels-photo-1619654.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1"}, {"name": "Galleria Mall", "address": "Galleria Shopping Mall, Langata Road, Nairobi", "phone": "+254 700 000 003", "hours": "Mon-Sun: 10:00 AM - 8:00 PM", "image": "https://images.pexels.com/photos/1292294/pexels-photo-1292294.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1"}]}', 5);

-- SHOP PAGE CONTENT
INSERT INTO page_content_blocks (page_slug, section_key, content_type, title, subtitle, content_text, metadata, order_position) VALUES
('shop', 'hero', 'hero_section', 'Fun Shop', '', 'Discover our premium collection of play equipment and accessories. Quality guaranteed, fun delivered across Kenya!', '{}', 1),
('shop', 'features', 'features_section', 'Why Shop With Us', '', '', '{"features": [{"title": "Free Delivery", "description": "Free delivery within Nairobi for orders over KES 5,000", "icon": "🚚", "color": "bg-grass-green"}, {"title": "Safety Guaranteed", "description": "All equipment is safety certified and regularly inspected", "icon": "🛡️", "color": "bg-star-yellow"}, {"title": "Premium Quality", "description": "High-quality equipment from trusted international brands", "icon": "⭐", "color": "bg-bright-orange"}]}', 2),
('shop', 'cta', 'cta_section', 'Need Help Choosing?', '', 'Our team is here to help you select the perfect equipment for your event. Get personalized recommendations!', '{"buttons": [{"text": "Contact Expert", "link": "/contact"}, {"text": "Book Now", "link": "/booking"}]}', 3);

-- BLOG PAGE CONTENT
INSERT INTO page_content_blocks (page_slug, section_key, content_type, title, subtitle, content_text, metadata, order_position) VALUES
('blog', 'hero', 'hero_section', 'Star Jump Blog', '', 'Insights, tips, and stories from Kenya''s leading children''s entertainment experts', '{}', 1),
('blog', 'featured_section', 'section_header', 'Featured Articles', 'Our most popular and insightful posts', '', '{}', 2),
('blog', 'newsletter', 'newsletter_section', 'Stay Updated!', '', 'Subscribe to our newsletter for the latest tips, event updates, and exclusive offers from Star Jump Kenya.', '{"form_placeholder": "Enter your email", "button_text": "Subscribe"}', 3);

-- EVENTS PAGE CONTENT
INSERT INTO page_content_blocks (page_slug, section_key, content_type, title, subtitle, content_text, metadata, order_position) VALUES
('events', 'hero', 'hero_section', 'Upcoming Events', '', 'Join us at exciting events across Kenya! From festivals to corporate gatherings, experience the magic of Star Jump.', '{}', 1),
('events', 'featured_section', 'section_header', 'Featured Events', 'Don''t miss these amazing upcoming events and celebrations', '', '{}', 2),
('events', 'all_events_section', 'section_header', 'All Events', '', '', '{}', 3),
('events', 'cta_section', 'cta_section', 'Want Star Jump at Your Event?', '', 'Planning an event? Let us bring the fun to you! Contact us for custom event solutions and equipment rentals.', '{"buttons": [{"text": "Book Equipment", "link": "/booking"}, {"text": "Corporate Events", "link": "/corporate"}]}', 4);

-- PRIVACY POLICY PAGE CONTENT
INSERT INTO page_content_blocks (page_slug, section_key, content_type, title, subtitle, content_text, metadata, order_position) VALUES
('privacy-policy', 'hero', 'hero_section', 'Privacy Policy', 'How Star Jump Kenya protects and handles your personal information', 'Last updated: November 2024', '{}', 1),
('privacy-policy', 'information_collection', 'legal_section', 'Information We Collect', '', 'Star Jump Kenya ("we," "our," or "us") collects information you provide directly to us, such as when you fill out booking forms, subscribe to newsletters, participate in events, or contact us via phone, email, or WhatsApp.', '{"subsections": [{"title": "Types of Information", "content": "Personal Information: Name, email address, phone number, physical address\nEvent Information: Event dates, locations, number of attendees, special requirements\nPayment Information: Billing details (processed securely through third-party providers)\nCommunication Records: Records of our interactions with you"}]}', 2),
('privacy-policy', 'information_use', 'legal_section', 'How We Use Your Information', '', 'We use the information we collect to process and fulfill your booking requests, communicate with you about your events and our services, send you marketing communications (with your consent), improve our services and customer experience, comply with legal obligations and resolve disputes, and ensure the safety and security of our events and equipment.', '{}', 3),
('privacy-policy', 'contact_info', 'contact_section', 'Contact Us', '', 'If you have any questions about this privacy policy or our data practices, please contact us at privacy@starjump.co.ke, +254 700 000 000, or visit us at Star Jump Kenya, Garden City Mall, Thika Road, Nairobi.', '{}', 4);

-- TERMS & CONDITIONS PAGE CONTENT
INSERT INTO page_content_blocks (page_slug, section_key, content_type, title, subtitle, content_text, metadata, order_position) VALUES
('terms-conditions', 'hero', 'hero_section', 'Terms & Conditions', 'Terms of service for Star Jump Kenya equipment rental and event services', 'Last updated: November 2024', '{}', 1),
('terms-conditions', 'agreement', 'legal_section', 'Agreement to Terms', '', 'By accessing and using Star Jump Kenya''s services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.', '{}', 2),
('terms-conditions', 'services', 'legal_section', 'Service Description', '', 'Star Jump Kenya provides rental of inflatable play equipment (bouncy castles, slides, trampolines), event setup and breakdown services, equipment supervision and safety monitoring, corporate and institutional play area installations, and event planning and consultation services.', '{}', 3),
('terms-conditions', 'payment_terms', 'legal_section', 'Booking and Payment Terms', '', 'All bookings must be confirmed in writing. A 50% deposit is required to secure your booking. Full payment is due 24 hours before the event date. Prices are quoted in Kenyan Shillings (KES) and include VAT where applicable.', '{"subsections": [{"title": "Payment Methods", "content": "M-Pesa mobile money transfers, Bank transfers, Cash payments (for deposits only), Corporate invoicing (for approved business clients)"}, {"title": "Cancellation Policy", "content": "More than 7 days: Full refund minus 10% processing fee\n3-7 days: 50% refund\nLess than 3 days: No refund\nWeather cancellations: Full refund or rescheduling at no extra cost"}]}', 4),
('terms-conditions', 'contact_info', 'contact_section', 'Contact Information', '', 'For questions about these terms and conditions, please contact us at legal@starjump.co.ke, +254 700 000 000, or visit us at Star Jump Kenya, Garden City Mall, Thika Road, Nairobi.', '{}', 5);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_page_content_blocks_updated_at
    BEFORE UPDATE ON page_content_blocks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();