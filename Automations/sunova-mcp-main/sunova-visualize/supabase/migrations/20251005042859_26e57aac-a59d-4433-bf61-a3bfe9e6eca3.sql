-- Critical Security Fixes: Phase 1
-- 1. Remove unrestricted INSERT policy from api_logs
-- 2. Add RLS policies to admin_api_logs view
-- 3. Fix function search paths

-- Fix 1: Remove unrestricted INSERT policy on api_logs
-- Only the log_api_request() function should be able to insert
DROP POLICY IF EXISTS "Allow API log insertion" ON public.api_logs;

-- Fix 2: Ensure admin_api_logs view has proper security
-- Recreate with security_invoker to use querying user's permissions
DROP VIEW IF EXISTS public.admin_api_logs;

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
  p.audio_file_name,
  al.api_type,
  al.generation_type,
  al.endpoint,
  al.method,
  al.prompt,
  al.request_id,
  al.status_code,
  al.success,
  al.error_message,
  al.duration_ms,
  al.cost_usd,
  al.task_id,
  gt.result_url
FROM api_logs al
LEFT JOIN projects p ON al.project_id = p.id
LEFT JOIN generation_tasks gt ON al.task_id = gt.id
ORDER BY al.created_at DESC;

-- Add SELECT policy for admins only
CREATE POLICY "Only admins can view admin API logs"
ON public.api_logs
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Fix 3: Update security definer functions to set search_path
-- This prevents schema injection attacks

-- Update add_credits function
CREATE OR REPLACE FUNCTION public.add_credits(
  p_user_id uuid,
  p_amount numeric,
  p_type text DEFAULT 'purchase',
  p_reason text DEFAULT NULL,
  p_metadata jsonb DEFAULT NULL,
  p_stripe_payment_intent_id text DEFAULT NULL
)
RETURNS credit_transactions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_new_balance numeric(10,2);
  v_transaction public.credit_transactions;
  v_effective_type text := COALESCE(p_type, 'purchase');
BEGIN
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be greater than zero';
  END IF;

  IF v_effective_type NOT IN ('purchase', 'refund') THEN
    RAISE EXCEPTION 'Invalid credit transaction type: %', v_effective_type;
  END IF;

  IF p_stripe_payment_intent_id IS NOT NULL THEN
    SELECT * INTO v_transaction
    FROM public.credit_transactions
    WHERE stripe_payment_intent_id = p_stripe_payment_intent_id;

    IF FOUND THEN
      RETURN v_transaction;
    END IF;
  END IF;

  UPDATE public.user_profiles
  SET credit_balance = COALESCE(credit_balance, 0) + p_amount,
      updated_at = now()
  WHERE id = p_user_id
  RETURNING credit_balance INTO v_new_balance;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile % not found', p_user_id;
  END IF;

  INSERT INTO public.credit_transactions (
    user_id, change_amount, type, reason, metadata, balance_after, stripe_payment_intent_id
  ) VALUES (
    p_user_id, p_amount, v_effective_type, p_reason, p_metadata, v_new_balance, p_stripe_payment_intent_id
  ) RETURNING * INTO v_transaction;

  RETURN v_transaction;
END;
$$;

-- Update spend_credits function
CREATE OR REPLACE FUNCTION public.spend_credits(
  p_user_id uuid,
  p_amount numeric,
  p_reason text DEFAULT NULL,
  p_metadata jsonb DEFAULT NULL
)
RETURNS credit_transactions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_new_balance numeric(10,2);
  v_transaction public.credit_transactions;
BEGIN
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be greater than zero';
  END IF;

  UPDATE public.user_profiles
  SET credit_balance = credit_balance - p_amount, updated_at = now()
  WHERE id = p_user_id AND credit_balance >= p_amount
  RETURNING credit_balance INTO v_new_balance;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'INSUFFICIENT_CREDITS' USING ERRCODE = 'P0001';
  END IF;

  INSERT INTO public.credit_transactions (
    user_id, change_amount, type, reason, metadata, balance_after
  ) VALUES (
    p_user_id, -p_amount, 'debit', p_reason, p_metadata, v_new_balance
  ) RETURNING * INTO v_transaction;

  RETURN v_transaction;
END;
$$;

-- Update is_user_admin function
CREATE OR REPLACE FUNCTION public.is_user_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN public.has_role(user_id, 'admin');
END;
$$;

-- Update set_user_admin function
CREATE OR REPLACE FUNCTION public.set_user_admin(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  target_user_id UUID;
BEGIN
  SELECT id INTO target_user_id FROM auth.users WHERE email = user_email;
  
  IF target_user_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  UPDATE public.user_profiles 
  SET subscription_tier = 'admin', is_admin = TRUE, updated_at = NOW()
  WHERE id = target_user_id;
  
  INSERT INTO public.user_profiles (
    id, user_email, subscription_tier, is_admin, created_at, updated_at
  ) VALUES (
    target_user_id, user_email, 'admin', TRUE, NOW(), NOW()
  ) ON CONFLICT (id) DO UPDATE SET
    subscription_tier = 'admin', is_admin = TRUE, updated_at = NOW();
    
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin'::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN TRUE;
END;
$$;