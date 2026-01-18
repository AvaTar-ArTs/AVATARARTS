-- Fix remaining helper functions without proper search_path

-- Update get_api_usage_stats function
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
SET search_path TO 'public'
AS $$
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
$$;

-- Update increment_export_count function
CREATE OR REPLACE FUNCTION public.increment_export_count(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_profile RECORD;
  months_passed INTEGER;
BEGIN
  SELECT * INTO current_profile 
  FROM public.user_profiles 
  WHERE id = user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile not found';
  END IF;
  
  months_passed := EXTRACT(MONTH FROM AGE(NOW(), current_profile.start_date::timestamp));
  
  IF months_passed >= 1 THEN
    UPDATE public.user_profiles 
    SET 
      cycle_export_count = 1,
      start_date = NOW(),
      current_cycle_number = current_profile.current_cycle_number + 1
    WHERE id = user_id;
  ELSE
    UPDATE public.user_profiles 
    SET cycle_export_count = current_profile.cycle_export_count + 1
    WHERE id = user_id;
  END IF;
END;
$$;