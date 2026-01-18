-- Create email_signups table for landing page newsletter
CREATE TABLE public.email_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  source TEXT DEFAULT 'landing_page',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add unique constraint on email
CREATE UNIQUE INDEX email_signups_email_key ON public.email_signups(email);

-- Enable RLS
ALTER TABLE public.email_signups ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can submit their email
CREATE POLICY "Anyone can submit email signup"
ON public.email_signups
FOR INSERT
WITH CHECK (true);

-- Policy: Only admins can view signups
CREATE POLICY "Only admins can view email signups"
ON public.email_signups
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Policy: Only admins can update signups
CREATE POLICY "Only admins can update email signups"
ON public.email_signups
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Policy: Only admins can delete signups
CREATE POLICY "Only admins can delete email signups"
ON public.email_signups
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_email_signups_updated_at
BEFORE UPDATE ON public.email_signups
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();