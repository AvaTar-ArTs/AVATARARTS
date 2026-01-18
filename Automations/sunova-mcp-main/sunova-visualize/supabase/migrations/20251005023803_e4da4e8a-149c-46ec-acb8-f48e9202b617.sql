-- ============================================
-- PHASE 1: Role-Based Security System
-- ============================================

-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table (proper security pattern)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role public.app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policy for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Migrate existing admin users to new role system
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM public.user_profiles
WHERE is_admin = true OR subscription_tier = 'admin'
ON CONFLICT (user_id, role) DO NOTHING;

-- Add default 'user' role for all existing users who don't have admin
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'user'::public.app_role
FROM public.user_profiles
WHERE id NOT IN (SELECT user_id FROM public.user_roles WHERE role = 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- ============================================
-- PHASE 2: Admin Views and Functions
-- ============================================

-- Add retrieved column to generation_tasks
ALTER TABLE public.generation_tasks
ADD COLUMN IF NOT EXISTS retrieved BOOLEAN DEFAULT false;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_generation_tasks_status ON public.generation_tasks(status);
CREATE INDEX IF NOT EXISTS idx_generation_tasks_project_id ON public.generation_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_api_logs_created_at ON public.api_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_api_logs_user_id ON public.api_logs(user_id);

-- Add task_id and request_id columns to api_logs
ALTER TABLE public.api_logs
ADD COLUMN IF NOT EXISTS task_id UUID,
ADD COLUMN IF NOT EXISTS request_id TEXT;

-- Create admin-filtered API logs view
CREATE OR REPLACE VIEW public.admin_api_logs AS
SELECT 
    al.id,
    al.created_at,
    al.user_id,
    al.user_email,
    al.project_id,
    al.project_name,
    al.api_type,
    al.generation_type,
    al.endpoint,
    al.method,
    al.status_code,
    al.success,
    al.duration_ms,
    al.cost_usd,
    al.task_id,
    al.request_id,
    al.prompt,
    al.error_message,
    gt.result_url,
    p.audio_file_name
FROM public.api_logs al
LEFT JOIN public.generation_tasks gt ON al.task_id = gt.id
LEFT JOIN public.projects p ON al.project_id = p.id
WHERE 
    -- Exclude polling requests
    (al.endpoint NOT LIKE '%/poll%' AND al.endpoint NOT LIKE '%/status%')
    AND
    -- Include: Whisper transcriptions OR Segmind generation submissions (not status checks)
    (
        (al.api_type = 'openai' AND al.endpoint LIKE '%transcriptions%')
        OR
        (al.api_type = 'segmind' AND al.method = 'POST')
    )
ORDER BY al.created_at DESC;

-- Create user statistics function
CREATE OR REPLACE FUNCTION public.calculate_user_storage(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_result JSONB;
    v_total_bytes BIGINT := 0;
    v_audio_original BIGINT;
    v_audio_processed BIGINT;
    v_shot_media BIGINT;
BEGIN
    -- Calculate storage per bucket
    SELECT COALESCE(SUM((metadata->>'size')::bigint), 0)
    INTO v_audio_original
    FROM storage.objects
    WHERE bucket_id = 'audio-original'
    AND owner = p_user_id;

    SELECT COALESCE(SUM((metadata->>'size')::bigint), 0)
    INTO v_audio_processed
    FROM storage.objects
    WHERE bucket_id = 'audio-processed'
    AND owner = p_user_id;

    SELECT COALESCE(SUM((metadata->>'size')::bigint), 0)
    INTO v_shot_media
    FROM storage.objects
    WHERE bucket_id = 'shot-media'
    AND owner = p_user_id;

    v_total_bytes := v_audio_original + v_audio_processed + v_shot_media;

    v_result := jsonb_build_object(
        'total_bytes', v_total_bytes,
        'total_mb', ROUND(v_total_bytes / 1024.0 / 1024.0, 2),
        'by_bucket', jsonb_build_object(
            'audio_original_mb', ROUND(v_audio_original / 1024.0 / 1024.0, 2),
            'audio_processed_mb', ROUND(v_audio_processed / 1024.0 / 1024.0, 2),
            'shot_media_mb', ROUND(v_shot_media / 1024.0 / 1024.0, 2)
        )
    );

    RETURN v_result;
END;
$$;

-- Create admin user statistics view (without IP fields for now)
CREATE OR REPLACE VIEW public.admin_user_stats AS
SELECT 
    up.id,
    up.user_email,
    up.created_at,
    up.credit_balance,
    au.last_sign_in_at,
    COUNT(DISTINCT p.id) as project_count,
    COUNT(DISTINCT p.audio_file_name) FILTER (WHERE p.audio_file_name IS NOT NULL) as audio_file_count,
    COALESCE(SUM(ct.change_amount) FILTER (WHERE ct.type = 'purchase'), 0) as lifetime_spend,
    (SELECT public.calculate_user_storage(up.id)) as storage_info
FROM public.user_profiles up
LEFT JOIN auth.users au ON up.id = au.id
LEFT JOIN public.projects p ON up.id = p.user_id
LEFT JOIN public.credit_transactions ct ON up.id = ct.user_id
GROUP BY up.id, up.user_email, up.created_at, up.credit_balance, au.last_sign_in_at;

-- ============================================
-- PHASE 3: Update RLS Policies to Use New Role System
-- ============================================

-- Update admin-only policies on existing tables to use has_role function
DROP POLICY IF EXISTS "Admins can view all API logs" ON public.api_logs;
CREATE POLICY "Admins can view all API logs"
ON public.api_logs
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can view all transactions" ON public.transactions;
CREATE POLICY "Admins can view all transactions"
ON public.transactions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can manage transactions" ON public.transactions;
CREATE POLICY "Admins can manage transactions"
ON public.transactions
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Only admins can read admin settings" ON public.admin_settings;
CREATE POLICY "Only admins can read admin settings"
ON public.admin_settings
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Only admins can insert admin settings" ON public.admin_settings;
CREATE POLICY "Only admins can insert admin settings"
ON public.admin_settings
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Only admins can update admin settings" ON public.admin_settings;
CREATE POLICY "Only admins can update admin settings"
ON public.admin_settings
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Only admins can delete admin settings" ON public.admin_settings;
CREATE POLICY "Only admins can delete admin settings"
ON public.admin_settings
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Grant permissions for admin views
GRANT SELECT ON public.admin_api_logs TO authenticated;
GRANT SELECT ON public.admin_user_stats TO authenticated;