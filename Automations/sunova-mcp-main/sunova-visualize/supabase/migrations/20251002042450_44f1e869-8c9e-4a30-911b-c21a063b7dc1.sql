-- Drop the public read policy on admin_settings
DROP POLICY IF EXISTS "Everyone can read admin settings" ON public.admin_settings;

-- Create a new policy that only allows authenticated admins to read admin settings
CREATE POLICY "Only admins can read admin settings" 
ON public.admin_settings 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.user_profiles
    WHERE user_profiles.id = auth.uid() 
    AND (user_profiles.is_admin = true OR user_profiles.subscription_tier = 'admin')
  )
);