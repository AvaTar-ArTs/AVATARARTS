ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS credit_balance numeric(10,2) NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  change_amount numeric(10,2) NOT NULL,
  type text NOT NULL CHECK (type IN ('purchase', 'debit', 'refund')),
  reason text,
  metadata jsonb,
  balance_after numeric(10,2) NOT NULL,
  stripe_payment_intent_id text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS credit_transactions_user_id_created_at_idx
ON public.credit_transactions (user_id, created_at DESC);

ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view their credit transactions"
ON public.credit_transactions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.add_credits(
  p_user_id uuid,
  p_amount numeric,
  p_type text DEFAULT 'purchase',
  p_reason text DEFAULT NULL,
  p_metadata jsonb DEFAULT NULL,
  p_stripe_payment_intent_id text DEFAULT NULL
) RETURNS public.credit_transactions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public AS
$$
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
    SELECT *
    INTO v_transaction
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
    user_id,
    change_amount,
    type,
    reason,
    metadata,
    balance_after,
    stripe_payment_intent_id
  )
  VALUES (
    p_user_id,
    p_amount,
    v_effective_type,
    p_reason,
    p_metadata,
    v_new_balance,
    p_stripe_payment_intent_id
  )
  RETURNING * INTO v_transaction;

  RETURN v_transaction;
END;
$$;

GRANT EXECUTE ON FUNCTION public.add_credits(uuid, numeric, text, text, jsonb, text) TO service_role;

CREATE OR REPLACE FUNCTION public.spend_credits(
  p_user_id uuid,
  p_amount numeric,
  p_reason text DEFAULT NULL,
  p_metadata jsonb DEFAULT NULL
) RETURNS public.credit_transactions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public AS
$$
DECLARE
  v_new_balance numeric(10,2);
  v_transaction public.credit_transactions;
BEGIN
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be greater than zero';
  END IF;

  UPDATE public.user_profiles
  SET credit_balance = credit_balance - p_amount,
      updated_at = now()
  WHERE id = p_user_id
    AND credit_balance >= p_amount
  RETURNING credit_balance INTO v_new_balance;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'INSUFFICIENT_CREDITS' USING ERRCODE = 'P0001';
  END IF;

  INSERT INTO public.credit_transactions (
    user_id,
    change_amount,
    type,
    reason,
    metadata,
    balance_after
  )
  VALUES (
    p_user_id,
    -p_amount,
    'debit',
    p_reason,
    p_metadata,
    v_new_balance
  )
  RETURNING * INTO v_transaction;

  RETURN v_transaction;
END;
$$;

GRANT EXECUTE ON FUNCTION public.spend_credits(uuid, numeric, text, jsonb) TO service_role;
