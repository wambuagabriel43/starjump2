/*
  # Fix RLS Policies for Content Management

  1. Security Updates
    - Update RLS policies to allow authenticated users to manage content
    - Add policies for page_sections table
    - Ensure proper authentication flow

  2. Tables Updated
    - page_content: Allow authenticated users to manage pages
    - page_sections: Allow authenticated users to manage sections
    - component_content: Allow authenticated users to manage components
    - ui_labels: Allow authenticated users to manage labels
    - site_content: Allow authenticated users to manage site content
*/

-- Update page_content policies
DROP POLICY IF EXISTS "Page content is publicly readable for published content" ON page_content;
DROP POLICY IF EXISTS "Authenticated users can manage page content" ON page_content;

CREATE POLICY "Page content is publicly readable for published content"
  ON page_content
  FOR SELECT
  TO public
  USING (status = 'published');

CREATE POLICY "Authenticated users can manage page content"
  ON page_content
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Update page_sections policies
DROP POLICY IF EXISTS "Page sections are publicly readable" ON page_sections;
DROP POLICY IF EXISTS "Authenticated users can manage page sections" ON page_sections;

CREATE POLICY "Page sections are publicly readable"
  ON page_sections
  FOR SELECT
  TO public
  USING (active = true);

CREATE POLICY "Authenticated users can manage page sections"
  ON page_sections
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Update component_content policies
DROP POLICY IF EXISTS "Component content is publicly readable" ON component_content;
DROP POLICY IF EXISTS "Authenticated users can manage component content" ON component_content;

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

-- Update ui_labels policies
DROP POLICY IF EXISTS "UI labels are publicly readable" ON ui_labels;
DROP POLICY IF EXISTS "Authenticated users can manage UI labels" ON ui_labels;

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

-- Update site_content policies
DROP POLICY IF EXISTS "Site content is publicly readable" ON site_content;
DROP POLICY IF EXISTS "Authenticated users can manage site content" ON site_content;

CREATE POLICY "Site content is publicly readable"
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

-- Create admin user if it doesn't exist
DO $$
BEGIN
  -- This will only work if you have the right permissions
  -- You may need to run this manually in your Supabase dashboard
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@starjump.co.ke'
  ) THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'admin@starjump.co.ke',
      crypt('starjump2024', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    );
  END IF;
EXCEPTION
  WHEN insufficient_privilege THEN
    -- If we can't create the user automatically, that's okay
    -- The user will need to be created manually in Supabase dashboard
    NULL;
END $$;