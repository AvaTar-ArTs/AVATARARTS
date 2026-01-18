-- Fix security issue: Recreate admin_api_logs view with security_invoker
-- This enforces RLS policies on underlying tables, restricting access to admins only

-- Drop the existing view
DROP VIEW IF EXISTS public.admin_api_logs;

-- Recreate the view with security_invoker enabled
CREATE VIEW public.admin_api_logs
WITH (security_invoker = true)
AS
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
FROM api_logs al
LEFT JOIN generation_tasks gt ON al.task_id = gt.id
LEFT JOIN projects p ON al.project_id = p.id
WHERE 
  al.endpoint NOT LIKE '%/poll%' 
  AND al.endpoint NOT LIKE '%/status%'
  AND (
    (al.api_type = 'openai' AND al.endpoint LIKE '%transcriptions%')
    OR (al.api_type = 'segmind' AND al.method = 'POST')
  )
ORDER BY al.created_at DESC;