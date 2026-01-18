-- Fix security issues from linter

-- 1. Fix the admin_user_stats view to not expose auth.users directly
CREATE OR REPLACE FUNCTION public.get_user_last_sign_in(p_user_id UUID)
RETURNS TIMESTAMP WITH TIME ZONE
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_last_sign_in TIMESTAMP WITH TIME ZONE;
BEGIN
    SELECT last_sign_in_at INTO v_last_sign_in
    FROM auth.users
    WHERE id = p_user_id;
    
    RETURN v_last_sign_in;
END;
$$;

-- Recreate admin_user_stats view without directly exposing auth.users
DROP VIEW IF EXISTS public.admin_user_stats;
CREATE VIEW public.admin_user_stats AS
SELECT 
    up.id,
    up.user_email,
    up.created_at,
    up.credit_balance,
    public.get_user_last_sign_in(up.id) as last_sign_in_at,
    COUNT(DISTINCT p.id) as project_count,
    COUNT(DISTINCT p.audio_file_name) FILTER (WHERE p.audio_file_name IS NOT NULL) as audio_file_count,
    COALESCE(SUM(ct.change_amount) FILTER (WHERE ct.type = 'purchase'), 0) as lifetime_spend,
    (SELECT public.calculate_user_storage(up.id)) as storage_info
FROM public.user_profiles up
LEFT JOIN public.projects p ON up.id = p.user_id
LEFT JOIN public.credit_transactions ct ON up.id = ct.user_id
GROUP BY up.id, up.user_email, up.created_at, up.credit_balance;

-- 2. Add search_path to existing functions
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_audio_transcription_cache_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

-- Drop and recreate increment_export_count with search_path
DROP FUNCTION IF EXISTS public.increment_export_count(uuid);
CREATE FUNCTION public.increment_export_count(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  current_profile RECORD;
  months_passed INTEGER;
BEGIN
  SELECT * INTO current_profile 
  FROM user_profiles 
  WHERE id = user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile not found';
  END IF;
  
  months_passed := EXTRACT(MONTH FROM AGE(NOW(), current_profile.start_date::timestamp));
  
  IF months_passed >= 1 THEN
    UPDATE user_profiles 
    SET 
      cycle_export_count = 1,
      start_date = NOW(),
      current_cycle_number = current_profile.current_cycle_number + 1
    WHERE id = user_id;
  ELSE
    UPDATE user_profiles 
    SET cycle_export_count = current_profile.cycle_export_count + 1
    WHERE id = user_id;
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    INSERT INTO public.user_profiles (id, user_email, created_at, updated_at)
    VALUES (NEW.id, NEW.email, NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        user_email = NEW.email,
        updated_at = NOW();
    
    -- Add default user role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user'::public.app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.set_user_admin(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  target_user_id UUID;
BEGIN
  SELECT id INTO target_user_id 
  FROM auth.users 
  WHERE email = user_email;
  
  IF target_user_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  UPDATE public.user_profiles 
  SET 
    subscription_tier = 'admin',
    is_admin = TRUE,
    updated_at = NOW()
  WHERE id = target_user_id;
  
  INSERT INTO public.user_profiles (
    id, 
    user_email,
    subscription_tier, 
    is_admin,
    created_at, 
    updated_at
  ) 
  VALUES (
    target_user_id, 
    user_email,
    'admin', 
    TRUE,
    NOW(), 
    NOW()
  ) 
  ON CONFLICT (id) DO UPDATE SET
    subscription_tier = 'admin',
    is_admin = TRUE,
    updated_at = NOW();
    
  -- Add admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin'::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN TRUE;
END;
$function$;

CREATE OR REPLACE FUNCTION public.is_user_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  RETURN public.has_role(user_id, 'admin');
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_transaction_status(
    p_transaction_id uuid, 
    p_status text, 
    p_stripe_charge_id text DEFAULT NULL::text, 
    p_failure_reason text DEFAULT NULL::text, 
    p_raw_stripe_data jsonb DEFAULT NULL::jsonb
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    UPDATE public.transactions 
    SET 
        status = p_status,
        stripe_charge_id = COALESCE(p_stripe_charge_id, stripe_charge_id),
        failure_reason = p_failure_reason,
        raw_stripe_data = COALESCE(p_raw_stripe_data, raw_stripe_data),
        processed_at = CASE WHEN p_status IN ('succeeded', 'failed') THEN NOW() ELSE processed_at END,
        updated_at = NOW()
    WHERE id = p_transaction_id;
    
    RETURN FOUND;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_api_usage_stats(
    start_date timestamp with time zone, 
    end_date timestamp with time zone
)
RETURNS TABLE(
    api_type text, 
    generation_type text, 
    total_requests bigint, 
    successful_requests bigint, 
    failed_requests bigint, 
    total_cost numeric, 
    avg_duration_ms numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        al.api_type,
        COALESCE(al.generation_type, 'unknown') as generation_type,
        COUNT(*) as total_requests,
        COUNT(*) FILTER (WHERE al.success = true) as successful_requests,
        COUNT(*) FILTER (WHERE al.success = false) as failed_requests,
        COALESCE(SUM(al.cost_usd), 0) as total_cost,
        COALESCE(AVG(al.duration_ms), 0) as avg_duration_ms
    FROM public.api_logs al
    WHERE al.created_at >= start_date AND al.created_at <= end_date
    GROUP BY al.api_type, al.generation_type
    ORDER BY total_requests DESC;
END;
$function$;