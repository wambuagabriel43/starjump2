/*
  # Complete Content Migration - All Static Content to Database
  
  1. New Tables
    - Enhanced page_content_blocks with all static content
    - All pages now fully editable through Content Manager
    
  2. Content Coverage
    - Home Page: Hero, Info Section, CTA, Statistics
    - About Us: Story, Mission, Vision, Values, Team
    - Events: All section headers and descriptions  
    - Shop: Hero, Features, Categories, CTA
    - Blog: Hero, Categories, Newsletter
    - Contact: Hero, Info Cards, Locations, Hours
    - Corporate: Services, Client Types, Forms
    - Booking: Form content, Help text, Success
    
  3. Security
    - RLS enabled with public read access
    - Admin write access for content management
*/

-- Insert Home Page Content
INSERT INTO page_content_blocks (page_slug, section_key, content_type, title, subtitle, content_text, image_url, button_text, button_link, order_position, metadata, active) VALUES

-- Home Hero Section
('home', 'hero_main', 'hero', 'Bouncy Castle Adventures', 'Safe, fun, and unforgettable experiences for your little ones!', '', 'https://images.pexels.com/photos/1104014/pexels-photo-1104014.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', '', '', 1, '{}', true),

-- Home Info Section
('home', 'info_section', 'section_header', 'Why Choose Star Jump?', '', 'At Star Jump, we understand that every celebration deserves to be extraordinary. With over 10 years of experience in children''s entertainment, we bring joy, safety, and unforgettable memories to your doorstep.', 'https://images.pexels.com/photos/1104014/pexels-photo-1104014.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1', '', '', 2, '{"benefits": ["Safety certified equipment with regular inspections", "Creating magical memories for children and families", "Premium quality inflatables and entertainment", "Professional setup and supervision included"], "stats": {"events": "500+", "experience": "10+", "support": "24/7"}}', true),

-- Home Booking CTA
('home', 'booking_cta', 'cta', 'Book a Fun Space Today!', '', 'Bring the fun to your doorstep! Whether it''s a birthday, corporate event, or school function, our mobile fun stations are a hit.', '', 'Book Now', '/booking', 3, '{"features": [{"title": "Flexible Booking", "description": "Same-day or advance bookings available"}, {"title": "Full Setup Service", "description": "Professional delivery, setup, and collection"}, {"title": "24/7 Support", "description": "Round-the-clock assistance for your event"}]}', true),

-- Home Shop Preview
('home', 'shop_preview', 'section_header', 'Our Fun Shop', '', 'Discover our premium collection of bouncy castles, slides, and fun accessories!', '', 'View All Products', '/shop', 4, '{}', true),

-- About Us Page Content
('about', 'hero', 'hero', 'About Star Jump', '', 'Kenya''s premier provider of fun stations and children''s play areas, bringing joy and excitement to every celebration since 2018.', '', '', '', 1, '{}', true),

('about', 'story', 'text', 'Our Story', '', 'Star Jump was born from a simple belief: every child deserves to experience pure joy and wonder. Founded in Nairobi in 2018, we started with a single bouncy castle and a dream to make celebrations unforgettable.\n\nToday, we''re proud to serve families, schools, malls, and corporations across Kenya with our premium collection of play equipment and professional event services. From intimate birthday parties to large corporate events, we bring the magic of play to every occasion.\n\nOur commitment to safety, quality, and exceptional service has made us Kenya''s trusted partner for creating memories that last a lifetime.', 'https://images.pexels.com/photos/1104014/pexels-photo-1104014.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1', '', '', 2, '{}', true),

('about', 'mission', 'text', 'Our Mission', '', 'To create magical play experiences that bring families and communities together, while providing safe, high-quality entertainment solutions that spark joy and imagination in children across Kenya.', '', '', '', 3, '{"icon": "Target"}', true),

('about', 'vision', 'text', 'Our Vision', '', 'To be East Africa''s leading provider of children''s entertainment solutions, setting the standard for safety, innovation, and service excellence in the play equipment industry.', '', '', '', 4, '{"icon": "Eye"}', true),

('about', 'values', 'section_header', 'Our Values', 'The principles that guide everything we do at Star Jump', '', '', '', '', 5, '{"values": [{"title": "Child Safety First", "description": "Every piece of equipment is regularly inspected and meets international safety standards.", "icon": "Heart", "color": "bg-red-500"}, {"title": "Quality Excellence", "description": "We use only premium, durable equipment that provides the best play experience.", "icon": "Star", "color": "bg-star-yellow"}, {"title": "Community Focus", "description": "Supporting Kenyan families and businesses with memorable celebration solutions.", "icon": "Users", "color": "bg-grass-green"}, {"title": "Professional Service", "description": "Our trained team ensures seamless setup, supervision, and cleanup for every event.", "icon": "Award", "color": "bg-bright-orange"}]}', true),

('about', 'team', 'section_header', 'Meet Our Team', 'The passionate people behind Kenya''s favorite play experience provider', '', '', '', '', 6, '{"team": [{"name": "Sarah Wanjiku", "role": "Founder & CEO", "image": "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1", "description": "Passionate about creating magical experiences for children across Kenya."}, {"name": "David Kimani", "role": "Operations Manager", "image": "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1", "description": "Ensures every event runs smoothly with our premium equipment and service."}, {"name": "Grace Achieng", "role": "Creative Director", "image": "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1", "description": "Designs unique play experiences that spark imagination and joy."}]}', true),

('about', 'cta', 'cta', 'Ready to Create Magic?', '', 'Let''s work together to make your next event unforgettable. Contact us today for a personalized quote!', '', 'Book Now', '/booking', 7, '{"secondary_button": {"text": "Contact Us", "link": "/contact"}}', true),

-- Events Page Content
('events', 'hero', 'hero', 'Upcoming Events', '', 'Join us at exciting events across Kenya! From festivals to corporate gatherings, experience the magic of Star Jump.', '', '', '', 1, '{}', true),

('events', 'featured_section', 'section_header', 'Featured Events', '', 'Don''t miss these amazing upcoming events and celebrations', '', '', '', 2, '{}', true),

('events', 'all_events_section', 'section_header', 'All Events', '', '', '', '', '', 3, '{}', true),

('events', 'cta_section', 'cta', 'Want Star Jump at Your Event?', '', 'Planning an event? Let us bring the fun to you! Contact us for custom event solutions and equipment rentals.', '', 'Book Equipment', '/booking', 4, '{"secondary_button": {"text": "Corporate Events", "link": "/corporate"}}', true),

-- Shop Page Content
('shop', 'hero', 'hero', 'Fun Shop', '', 'Discover our premium collection of play equipment and accessories. Quality guaranteed, fun delivered across Kenya!', '', '', '', 1, '{}', true),

('shop', 'search_filter', 'section_header', 'Find Your Perfect Equipment', '', 'Search and filter through our amazing collection', '', '', '', 2, '{}', true),

('shop', 'features', 'section_header', 'Why Shop With Us', '', '', '', '', '', 3, '{"features": [{"title": "Free Delivery", "description": "Free delivery within Nairobi for orders over KES 5,000", "icon": "🚚", "color": "bg-grass-green"}, {"title": "Safety Guaranteed", "description": "All equipment is safety certified and regularly inspected", "icon": "🛡️", "color": "bg-star-yellow"}, {"title": "Premium Quality", "description": "High-quality equipment from trusted international brands", "icon": "⭐", "color": "bg-bright-orange"}]}', true),

('shop', 'help_cta', 'cta', 'Need Help Choosing?', '', 'Our team is here to help you select the perfect equipment for your event. Get personalized recommendations!', '', 'Contact Expert', '/contact', 4, '{"secondary_button": {"text": "Book Now", "link": "/booking"}}', true),

-- Blog Page Content
('blog', 'hero', 'hero', 'Star Jump Blog', '', 'Insights, tips, and stories from Kenya''s leading children''s entertainment experts', '', '', '', 1, '{}', true),

('blog', 'featured_section', 'section_header', 'Featured Articles', '', 'Our most popular and insightful posts', '', '', '', 2, '{}', true),

('blog', 'newsletter', 'cta', 'Stay Updated!', '', 'Subscribe to our newsletter for the latest tips, event updates, and exclusive offers from Star Jump Kenya.', '', 'Subscribe', '#', 3, '{}', true),

-- Contact Page Content
('contact', 'hero', 'hero', 'Contact Us', '', 'Get in touch with Kenya''s premier children''s entertainment experts. We''re here to make your event magical!', '', '', '', 1, '{}', true),

('contact', 'contact_info', 'section_header', 'Get In Touch', '', '', '', '', '', 2, '{"contact_cards": [{"title": "Call Us", "content": "+254 700 000 000", "subtitle": "Mon-Fri: 8AM-6PM", "icon": "Phone"}, {"title": "Email Us", "content": "info@starjump.co.ke", "subtitle": "24/7 Response", "icon": "Mail"}, {"title": "WhatsApp", "content": "+254 700 000 000", "subtitle": "Instant Response", "icon": "MessageCircle"}, {"title": "Visit Us", "content": "3 Locations", "subtitle": "Across Nairobi", "icon": "MapPin"}]}', true),

('contact', 'business_hours', 'text', 'Business Hours', '', '', '', '', '', 3, '{"hours": [{"day": "Monday - Friday", "time": "8:00 AM - 6:00 PM"}, {"day": "Saturday", "time": "9:00 AM - 5:00 PM"}, {"day": "Sunday", "time": "9:00 AM - 5:00 PM"}, {"day": "Emergency Support", "time": "24/7 Available"}]}', true),

('contact', 'locations', 'section_header', 'Our Locations', '', 'Visit us at any of our convenient locations across Nairobi', '', '', '', 4, '{"locations": [{"name": "Greenspan Mall", "address": "Greenspan Mall, Donholm Road, Nairobi", "phone": "+254 700 000 001", "hours": "Mon-Sun: 10:00 AM - 8:00 PM", "image": "https://images.pexels.com/photos/1104014/pexels-photo-1104014.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1"}, {"name": "Garden City Mall", "address": "Garden City Mall, Thika Road, Nairobi", "phone": "+254 700 000 002", "hours": "Mon-Sun: 10:00 AM - 9:00 PM", "image": "https://images.pexels.com/photos/1619654/pexels-photo-1619654.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1"}, {"name": "Galleria Mall", "address": "Galleria Shopping Mall, Langata Road, Nairobi", "phone": "+254 700 000 003", "hours": "Mon-Sun: 10:00 AM - 8:00 PM", "image": "https://images.pexels.com/photos/1292294/pexels-photo-1292294.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1"}]}', true),

-- Corporate Page Content
('corporate', 'hero', 'hero', 'Corporate Solutions', '', 'Transform your institution with premium play solutions. From permanent installations to event rentals, we create engaging experiences for your community.', '', 'Get Custom Quote', '#contact-form', 1, '{"secondary_button": {"text": "View Services", "link": "#services"}}', true),

('corporate', 'services', 'section_header', 'Our Services', '', 'Comprehensive play solutions tailored for institutions and corporate clients', '', '', '', 2, '{"services": [{"title": "Permanent Installations", "description": "Custom-designed play areas for malls, hospitals, schools, and residential complexes.", "features": ["Custom design consultation", "Professional installation", "Ongoing maintenance", "Safety compliance"], "icon": "Building2", "color": "bg-royal-blue"}, {"title": "Event Rentals", "description": "Premium equipment rentals for corporate events, school functions, and institutional celebrations.", "features": ["Full setup & breakdown", "Professional supervision", "Insurance coverage", "Flexible packages"], "icon": "Calendar", "color": "bg-grass-green"}, {"title": "Team Building", "description": "Engaging team-building activities and corporate family day solutions.", "features": ["Interactive games", "Team challenges", "Family-friendly activities", "Professional facilitation"], "icon": "Users", "color": "bg-bright-orange"}]}', true),

('corporate', 'client_types', 'section_header', 'Who We Serve', '', 'Trusted by leading institutions across Kenya', '', '', '', 3, '{"clients": [{"name": "Shopping Malls", "icon": "🏬", "description": "Permanent play areas and seasonal events"}, {"name": "Schools & Universities", "icon": "🏫", "description": "Sports days, graduation events, open days"}, {"name": "Hospitals & Clinics", "icon": "🏥", "description": "Children''s waiting areas and wellness events"}, {"name": "Corporate Offices", "icon": "🏢", "description": "Family days, team building, celebrations"}, {"name": "Residential Complexes", "icon": "🏘️", "description": "Community events and permanent installations"}, {"name": "Hotels & Resorts", "icon": "🏨", "description": "Guest entertainment and special events"}]}', true),

('corporate', 'contact_form', 'cta', 'Let''s Build a Play Space Together!', '', 'Tell us about your institution and requirements', '', 'Get Custom Proposal', '#', 4, '{}', true),

-- Booking Page Content
('booking', 'hero', 'hero', 'Book Your Fun Space', '', 'Fill out the form below and we''ll get back to you with availability and pricing in KES!', '', '', '', 1, '{}', true),

('booking', 'form_header', 'section_header', 'Let''s Make Your Event Amazing!', '', 'Tell us about your event and we''ll handle the rest', '', '', '', 2, '{}', true),

('booking', 'help_text', 'text', 'What happens next?', '', '', '', '', '', 3, '{"steps": ["We''ll review your request within 2 hours during business hours", "Our team will contact you to confirm availability and discuss details", "We''ll provide a detailed quote in Kenyan Shillings (KES) with all costs", "Once confirmed, we''ll handle all the setup, delivery, and collection", "Professional supervision included for safe, worry-free fun!"]}', true),

('booking', 'success_message', 'text', 'Booking Request Received!', '', 'Thank you for choosing Star Jump Kenya! We''ve received your booking request and will contact you within 2 hours with availability confirmation and pricing details in Kenyan Shillings (KES).', '', 'Return Home', '/', 4, '{}', true);