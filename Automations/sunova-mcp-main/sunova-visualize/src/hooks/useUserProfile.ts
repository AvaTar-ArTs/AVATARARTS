import { useQuery } from "@tanstack/react-query";
import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface UserProfile {
  id: string;
  credit_balance: number;
  is_admin: boolean | null;
  subscription_tier: string | null;
  user_email: string | null;
}

const handleDuplicateProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("id, credit_balance, is_admin, subscription_tier, user_email")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("User profile could not be located after creation attempt");
  }

  return data;
};

export const useUserProfile = () => {
  const { user } = useAuth();

  const query = useQuery<UserProfile | null, PostgrestError | Error>({
    queryKey: ["user-profile", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      if (!user?.id) {
        return null;
      }

      const { data, error } = await supabase
        .from("user_profiles")
        .select("id, credit_balance, is_admin, subscription_tier, user_email")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data) {
        return data;
      }

      const { data: createdProfile, error: createError } = await supabase
        .from("user_profiles")
        .insert({
          id: user.id,
          user_email: user.email ?? "",
        })
        .select("id, credit_balance, is_admin, subscription_tier, user_email")
        .single();

      if (createError) {
        if ((createError as PostgrestError).code === "23505") {
          return handleDuplicateProfile(user.id);
        }
        throw createError;
      }

      return createdProfile;
    },
  });

  const profile = query.data;
  const isAdmin = Boolean(profile?.is_admin) || profile?.subscription_tier === "admin";

  return {
    profile,
    isAdmin,
    ...query,
  };
};
