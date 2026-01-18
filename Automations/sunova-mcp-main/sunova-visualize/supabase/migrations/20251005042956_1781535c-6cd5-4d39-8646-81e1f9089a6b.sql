-- Fix remaining functions without search_path set

-- Update log_api_request function
CREATE OR REPLACE FUNCTION public.log_api_request(
  p_user_id uuid,
  p_user_email text,
  p_project_id uuid,
  p_project_name text,
  p_api_type text,
  p_generation_type text,
  p_endpoint text,
  p_method text,
  p_prompt text,
  p_prompt_tokens integer,
  p_completion_tokens integer,
  p_total_tokens integer,
  p_raw_request jsonb,
  p_raw_response jsonb,
  p_status_code integer,
  p_success boolean,
  p_error_message text,
  p_duration_ms integer,
  p_cost_usd numeric
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO public.api_logs (
        user_id, user_email, project_id, project_name,
        api_type, generation_type, endpoint, method, prompt,
        prompt_tokens, completion_tokens, total_tokens,
        raw_request, raw_response, status_code, success, 
        error_message, duration_ms, cost_usd
    ) VALUES (
        p_user_id, p_user_email, p_project_id, p_project_name,
        p_api_type, p_generation_type, p_endpoint, p_method, p_prompt,
        p_prompt_tokens, p_completion_tokens, p_total_tokens,
        p_raw_request, p_raw_response, p_status_code, p_success,
        p_error_message, p_duration_ms, p_cost_usd
    ) RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$;

-- Update rollback_credit_transaction function
CREATE OR REPLACE FUNCTION public.rollback_credit_transaction(
  p_transaction_id uuid,
  p_reason text DEFAULT NULL,
  p_metadata jsonb DEFAULT NULL
)
RETURNS credit_transactions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_transaction public.credit_transactions;
  v_new_balance numeric(10,2);
BEGIN
  SELECT * INTO v_transaction
  FROM public.credit_transactions
  WHERE id = p_transaction_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Transaction % not found', p_transaction_id;
  END IF;

  UPDATE public.user_profiles
  SET credit_balance = credit_balance - v_transaction.change_amount, updated_at = now()
  WHERE id = v_transaction.user_id
  RETURNING credit_balance INTO v_new_balance;

  INSERT INTO public.credit_transactions (
    user_id, change_amount, type, reason, metadata, balance_after, stripe_payment_intent_id
  ) VALUES (
    v_transaction.user_id,
    -v_transaction.change_amount,
    'refund',
    COALESCE(p_reason, 'rollback'),
    COALESCE(p_metadata, jsonb_build_object('rollback_of', p_transaction_id)),
    v_new_balance,
    v_transaction.stripe_payment_intent_id
  ) RETURNING * INTO v_transaction;

  RETURN v_transaction;
END;
$$;

-- Update record_transaction function
CREATE OR REPLACE FUNCTION public.record_transaction(
  p_user_id uuid,
  p_user_email text,
  p_project_id uuid DEFAULT NULL,
  p_project_name text DEFAULT NULL,
  p_transaction_type text DEFAULT 'payment',
  p_stripe_payment_intent_id text DEFAULT NULL,
  p_amount_usd numeric DEFAULT 0,
  p_pricing_type text DEFAULT 'standard',
  p_total_clip_count integer DEFAULT NULL,
  p_generated_videos integer DEFAULT 0,
  p_generated_images integer DEFAULT 0,
  p_video_duration_seconds numeric DEFAULT NULL,
  p_subscription_tier text DEFAULT 'free',
  p_is_admin_transaction boolean DEFAULT false,
  p_status text DEFAULT 'pending',
  p_billing_info jsonb DEFAULT NULL,
  p_raw_stripe_data jsonb DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    transaction_id UUID;
BEGIN
    INSERT INTO public.transactions (
        user_id, user_email, project_id, project_name,
        transaction_type, stripe_payment_intent_id, amount_usd,
        pricing_type, total_clip_count, generated_videos, generated_images,
        video_duration_seconds, subscription_tier, is_admin_transaction,
        status, billing_info, raw_stripe_data,
        processed_at
    ) VALUES (
        p_user_id, p_user_email, p_project_id, p_project_name,
        p_transaction_type, p_stripe_payment_intent_id, p_amount_usd,
        p_pricing_type, p_total_clip_count, p_generated_videos, p_generated_images,
        p_video_duration_seconds, p_subscription_tier, p_is_admin_transaction,
        p_status, p_billing_info, p_raw_stripe_data,
        CASE WHEN p_status IN ('succeeded', 'failed') THEN NOW() ELSE NULL END
    ) RETURNING id INTO transaction_id;
    
    RETURN transaction_id;
END;
$$;

-- Update update_transaction_status function
CREATE OR REPLACE FUNCTION public.update_transaction_status(
  p_transaction_id uuid,
  p_status text,
  p_stripe_charge_id text DEFAULT NULL,
  p_failure_reason text DEFAULT NULL,
  p_raw_stripe_data jsonb DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;