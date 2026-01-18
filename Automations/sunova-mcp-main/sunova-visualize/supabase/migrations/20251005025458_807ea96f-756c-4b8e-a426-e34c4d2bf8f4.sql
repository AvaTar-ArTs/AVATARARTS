-- Create beta_applications table
CREATE TABLE public.beta_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  contribution_amount NUMERIC(10,2) NOT NULL,
  why_perfect_tester TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending'
);

-- Enable RLS
ALTER TABLE public.beta_applications ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can view all applications
CREATE POLICY "Admins can view all beta applications"
ON public.beta_applications
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Policy: Anyone can insert (public form)
CREATE POLICY "Anyone can submit beta application"
ON public.beta_applications
FOR INSERT
WITH CHECK (true);

-- Add index on email for lookups
CREATE INDEX idx_beta_applications_email ON public.beta_applications(email);

-- Add index on status for filtering
CREATE INDEX idx_beta_applications_status ON public.beta_applications(status);