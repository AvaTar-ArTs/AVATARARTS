-- Fix security issue: Recreate admin_user_stats view with security_invoker
-- This ensures the view uses the querying user's permissions, not the view creator's

-- Drop the existing view
DROP VIEW IF EXISTS public.admin_user_stats;

-- Recreate the view with security_invoker enabled
CREATE VIEW public.admin_user_stats
WITH (security_invoker = true)
AS
SELECT 
  up.id,
  up.user_email,
  up.created_at,
  up.credit_balance,
  get_user_last_sign_in(up.id) AS last_sign_in_at,
  COUNT(DISTINCT p.id) AS project_count,
  COUNT(DISTINCT p.audio_file_name) FILTER (WHERE p.audio_file_name IS NOT NULL) AS audio_file_count,
  COALESCE(SUM(ct.change_amount) FILTER (WHERE ct.type = 'purchase'), 0) AS lifetime_spend,
  calculate_user_storage(up.id) AS storage_info
FROM user_profiles up
LEFT JOIN projects p ON up.id = p.user_id
LEFT JOIN credit_transactions ct ON up.id = ct.user_id
GROUP BY up.id, up.user_email, up.created_at, up.credit_balance;