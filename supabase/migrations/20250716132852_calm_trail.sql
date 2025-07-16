/*
  # Add Logo Sizing and Menu Design Settings

  1. New Settings
    - `header_logo_size` - Controls header logo size (default: 64px)
    - `footer_logo_size` - Controls footer logo size (default: 48px)  
    - `menu_design_mode` - Controls menu style: 'text' or 'graphics' (default: 'text')
    - `menu_graphics_size` - Controls menu graphics size (default: 48px)

  2. Security
    - Settings are publicly readable for frontend use
    - Only authenticated users can modify settings
*/

-- Insert default logo and menu design settings
INSERT INTO site_settings (setting_key, setting_value, setting_type, description) VALUES
  ('header_logo_size', '64', 'number', 'Header logo size in pixels'),
  ('footer_logo_size', '48', 'number', 'Footer logo size in pixels'),
  ('menu_design_mode', 'text', 'select', 'Menu design mode: text or graphics'),
  ('menu_graphics_size', '48', 'number', 'Menu graphics size in pixels')
ON CONFLICT (setting_key) DO NOTHING;