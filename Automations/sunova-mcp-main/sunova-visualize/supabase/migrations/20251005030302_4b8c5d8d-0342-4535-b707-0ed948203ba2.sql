-- Add status and invite_code columns to beta_applications
ALTER TABLE public.beta_applications
ADD COLUMN IF NOT EXISTS invite_code TEXT,
ADD COLUMN IF NOT EXISTS processed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS processed_by UUID REFERENCES auth.users(id);

-- Update status column to be more specific
ALTER TABLE public.beta_applications
ALTER COLUMN status TYPE TEXT;

-- Add check constraint for status values
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'beta_applications_status_check'
  ) THEN
    ALTER TABLE public.beta_applications
    ADD CONSTRAINT beta_applications_status_check 
    CHECK (status IN ('pending', 'approved', 'denied'));
  END IF;
END $$;

-- Insert default email templates if they don't exist
INSERT INTO public.admin_settings (setting_key, setting_value, description)
VALUES 
  ('beta_approved_email_template', 
   '{"subject": "Welcome to SuNovà Beta!", "html": "<h1>Congratulations {{name}}!</h1><p>Your beta tester application has been approved. We''re excited to have you join our founding creator community.</p><p>Your invite code: <strong>{{invite_code}}</strong></p><p>Click here to sign up: <a href=\"{{signup_url}}\">Get Started</a></p><p>Best regards,<br>The SuNovà Team</p>"}',
   'Email template for approved beta applications')
ON CONFLICT (setting_key) DO NOTHING;

INSERT INTO public.admin_settings (setting_key, setting_value, description)
VALUES 
  ('beta_denied_email_template',
   '{"subject": "Thank you for your interest in SuNovà Beta", "html": "<h1>Hello {{name}},</h1><p>Thank you for your interest in joining the SuNovà beta program.</p><p>Unfortunately, we are unable to accept your application at this time. The response has been overwhelming, and we had to make difficult decisions.</p><p>We encourage you to stay connected and watch for our public launch announcement.</p><p>Best regards,<br>The SuNovà Team</p>"}',
   'Email template for denied beta applications')
ON CONFLICT (setting_key) DO NOTHING;

-- Add index on invite_code for lookups
CREATE INDEX IF NOT EXISTS idx_beta_applications_invite_code ON public.beta_applications(invite_code);

-- Policy: Admins can update beta applications
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'beta_applications' 
    AND policyname = 'Admins can update beta applications'
  ) THEN
    CREATE POLICY "Admins can update beta applications"
    ON public.beta_applications
    FOR UPDATE
    USING (has_role(auth.uid(), 'admin'::app_role));
  END IF;
END $$;