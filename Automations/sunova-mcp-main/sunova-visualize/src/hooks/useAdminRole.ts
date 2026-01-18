import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export const useAdminRole = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["admin-role", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      if (!user?.id) return { isAdmin: false };

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (error) {
        console.error("Error checking admin role:", error);
        return { isAdmin: false };
      }

      return { isAdmin: Boolean(data) };
    },
  });
};
