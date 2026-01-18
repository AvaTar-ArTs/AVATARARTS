export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      admin_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      api_logs: {
        Row: {
          api_type: string
          completion_tokens: number | null
          cost_usd: number | null
          created_at: string
          duration_ms: number | null
          endpoint: string
          error_message: string | null
          generation_type: string | null
          id: string
          method: string | null
          project_id: string | null
          project_name: string | null
          prompt: string | null
          prompt_tokens: number | null
          raw_request: Json | null
          raw_response: Json | null
          request_id: string | null
          status_code: number | null
          success: boolean | null
          task_id: string | null
          total_tokens: number | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          api_type: string
          completion_tokens?: number | null
          cost_usd?: number | null
          created_at?: string
          duration_ms?: number | null
          endpoint: string
          error_message?: string | null
          generation_type?: string | null
          id?: string
          method?: string | null
          project_id?: string | null
          project_name?: string | null
          prompt?: string | null
          prompt_tokens?: number | null
          raw_request?: Json | null
          raw_response?: Json | null
          request_id?: string | null
          status_code?: number | null
          success?: boolean | null
          task_id?: string | null
          total_tokens?: number | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          api_type?: string
          completion_tokens?: number | null
          cost_usd?: number | null
          created_at?: string
          duration_ms?: number | null
          endpoint?: string
          error_message?: string | null
          generation_type?: string | null
          id?: string
          method?: string | null
          project_id?: string | null
          project_name?: string | null
          prompt?: string | null
          prompt_tokens?: number | null
          raw_request?: Json | null
          raw_response?: Json | null
          request_id?: string | null
          status_code?: number | null
          success?: boolean | null
          task_id?: string | null
          total_tokens?: number | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      audio_transcription_cache: {
        Row: {
          created_at: string | null
          duration: number | null
          file_hash: string
          file_name: string
          file_size: number
          id: string
          transcription: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          duration?: number | null
          file_hash: string
          file_name: string
          file_size: number
          id?: string
          transcription: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          duration?: number | null
          file_hash?: string
          file_name?: string
          file_size?: number
          id?: string
          transcription?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      beta_applications: {
        Row: {
          contribution_amount: number
          created_at: string
          email: string
          first_name: string
          id: string
          invite_code: string | null
          last_name: string
          processed_at: string | null
          processed_by: string | null
          status: string
          why_perfect_tester: string
        }
        Insert: {
          contribution_amount: number
          created_at?: string
          email: string
          first_name: string
          id?: string
          invite_code?: string | null
          last_name: string
          processed_at?: string | null
          processed_by?: string | null
          status?: string
          why_perfect_tester: string
        }
        Update: {
          contribution_amount?: number
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          invite_code?: string | null
          last_name?: string
          processed_at?: string | null
          processed_by?: string | null
          status?: string
          why_perfect_tester?: string
        }
        Relationships: []
      }
      credit_transactions: {
        Row: {
          balance_after: number
          change_amount: number
          created_at: string
          id: string
          metadata: Json | null
          reason: string | null
          stripe_payment_intent_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          balance_after: number
          change_amount: number
          created_at?: string
          id?: string
          metadata?: Json | null
          reason?: string | null
          stripe_payment_intent_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          balance_after?: number
          change_amount?: number
          created_at?: string
          id?: string
          metadata?: Json | null
          reason?: string | null
          stripe_payment_intent_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_user_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      email_signups: {
        Row: {
          created_at: string
          email: string
          id: string
          source: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          source?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          source?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      folders: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      generation_tasks: {
        Row: {
          completed_at: string | null
          created_at: string
          error_message: string | null
          generation_type: string
          id: string
          poll_url: string | null
          project_id: string
          request_id: string
          result_url: string | null
          retrieved: boolean | null
          scene_id: string
          shot_id: string
          status: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          generation_type: string
          id?: string
          poll_url?: string | null
          project_id: string
          request_id: string
          result_url?: string | null
          retrieved?: boolean | null
          scene_id: string
          shot_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          generation_type?: string
          id?: string
          poll_url?: string | null
          project_id?: string
          request_id?: string
          result_url?: string | null
          retrieved?: boolean | null
          scene_id?: string
          shot_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "generation_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          audio_analysis: Json | null
          audio_duration: number | null
          audio_file_name: string | null
          billing_info: Json | null
          clips: Json | null
          concept_images: Json | null
          concept_notes: string | null
          created_at: string
          description: string | null
          folder_id: string | null
          id: string
          name: string
          status: string | null
          storyboard: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          audio_analysis?: Json | null
          audio_duration?: number | null
          audio_file_name?: string | null
          billing_info?: Json | null
          clips?: Json | null
          concept_images?: Json | null
          concept_notes?: string | null
          created_at?: string
          description?: string | null
          folder_id?: string | null
          id?: string
          name: string
          status?: string | null
          storyboard?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          audio_analysis?: Json | null
          audio_duration?: number | null
          audio_file_name?: string | null
          billing_info?: Json | null
          clips?: Json | null
          concept_images?: Json | null
          concept_notes?: string | null
          created_at?: string
          description?: string | null
          folder_id?: string | null
          id?: string
          name?: string
          status?: string | null
          storyboard?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          admin_notes: string | null
          amount_usd: number
          billing_info: Json | null
          created_at: string
          currency: string | null
          discount_applied: number | null
          failure_reason: string | null
          generated_images: number | null
          generated_videos: number | null
          id: string
          is_admin_transaction: boolean | null
          pricing_type: string | null
          processed_at: string | null
          project_id: string | null
          project_name: string | null
          promotional_code: string | null
          raw_stripe_data: Json | null
          refunded_at: string | null
          status: string
          stripe_charge_id: string | null
          stripe_payment_intent_id: string | null
          stripe_refund_id: string | null
          subscription_tier: string | null
          total_clip_count: number | null
          transaction_type: string
          updated_at: string
          user_email: string
          user_id: string | null
          video_duration_seconds: number | null
        }
        Insert: {
          admin_notes?: string | null
          amount_usd: number
          billing_info?: Json | null
          created_at?: string
          currency?: string | null
          discount_applied?: number | null
          failure_reason?: string | null
          generated_images?: number | null
          generated_videos?: number | null
          id?: string
          is_admin_transaction?: boolean | null
          pricing_type?: string | null
          processed_at?: string | null
          project_id?: string | null
          project_name?: string | null
          promotional_code?: string | null
          raw_stripe_data?: Json | null
          refunded_at?: string | null
          status?: string
          stripe_charge_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_refund_id?: string | null
          subscription_tier?: string | null
          total_clip_count?: number | null
          transaction_type: string
          updated_at?: string
          user_email: string
          user_id?: string | null
          video_duration_seconds?: number | null
        }
        Update: {
          admin_notes?: string | null
          amount_usd?: number
          billing_info?: Json | null
          created_at?: string
          currency?: string | null
          discount_applied?: number | null
          failure_reason?: string | null
          generated_images?: number | null
          generated_videos?: number | null
          id?: string
          is_admin_transaction?: boolean | null
          pricing_type?: string | null
          processed_at?: string | null
          project_id?: string | null
          project_name?: string | null
          promotional_code?: string | null
          raw_stripe_data?: Json | null
          refunded_at?: string | null
          status?: string
          stripe_charge_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_refund_id?: string | null
          subscription_tier?: string | null
          total_clip_count?: number | null
          transaction_type?: string
          updated_at?: string
          user_email?: string
          user_id?: string | null
          video_duration_seconds?: number | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string
          credit_balance: number
          current_cycle_number: number | null
          cycle_export_count: number | null
          gemini_api_key: string | null
          id: string
          is_admin: boolean | null
          last_usage_reset: string | null
          monthly_exports: number | null
          openai_api_key: string | null
          start_date: string | null
          subscription_tier: string | null
          updated_at: string
          usage_count: number | null
          user_email: string | null
        }
        Insert: {
          created_at?: string
          credit_balance?: number
          current_cycle_number?: number | null
          cycle_export_count?: number | null
          gemini_api_key?: string | null
          id: string
          is_admin?: boolean | null
          last_usage_reset?: string | null
          monthly_exports?: number | null
          openai_api_key?: string | null
          start_date?: string | null
          subscription_tier?: string | null
          updated_at?: string
          usage_count?: number | null
          user_email?: string | null
        }
        Update: {
          created_at?: string
          credit_balance?: number
          current_cycle_number?: number | null
          cycle_export_count?: number | null
          gemini_api_key?: string | null
          id?: string
          is_admin?: boolean | null
          last_usage_reset?: string | null
          monthly_exports?: number | null
          openai_api_key?: string | null
          start_date?: string | null
          subscription_tier?: string | null
          updated_at?: string
          usage_count?: number | null
          user_email?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      admin_api_logs: {
        Row: {
          api_type: string | null
          audio_file_name: string | null
          cost_usd: number | null
          created_at: string | null
          duration_ms: number | null
          endpoint: string | null
          error_message: string | null
          generation_type: string | null
          id: string | null
          method: string | null
          project_id: string | null
          project_name: string | null
          prompt: string | null
          request_id: string | null
          result_url: string | null
          status_code: number | null
          success: boolean | null
          task_id: string | null
          user_email: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_user_stats: {
        Row: {
          audio_file_count: number | null
          created_at: string | null
          credit_balance: number | null
          id: string | null
          last_sign_in_at: string | null
          lifetime_spend: number | null
          project_count: number | null
          storage_info: Json | null
          user_email: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_credits: {
        Args: {
          p_amount: number
          p_metadata?: Json
          p_reason?: string
          p_stripe_payment_intent_id?: string
          p_type?: string
          p_user_id: string
        }
        Returns: {
          balance_after: number
          change_amount: number
          created_at: string
          id: string
          metadata: Json | null
          reason: string | null
          stripe_payment_intent_id: string | null
          type: string
          user_id: string
        }
      }
      calculate_user_storage: {
        Args: { p_user_id: string }
        Returns: Json
      }
      get_api_usage_stats: {
        Args: { end_date: string; start_date: string }
        Returns: {
          api_type: string
          avg_duration_ms: number
          failed_requests: number
          generation_type: string
          successful_requests: number
          total_cost: number
          total_requests: number
        }[]
      }
      get_user_last_sign_in: {
        Args: { p_user_id: string }
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_export_count: {
        Args: { user_id: string }
        Returns: undefined
      }
      is_user_admin: {
        Args: { user_id?: string }
        Returns: boolean
      }
      log_api_request: {
        Args: {
          p_api_type: string
          p_completion_tokens: number
          p_cost_usd: number
          p_duration_ms: number
          p_endpoint: string
          p_error_message: string
          p_generation_type: string
          p_method: string
          p_project_id: string
          p_project_name: string
          p_prompt: string
          p_prompt_tokens: number
          p_raw_request: Json
          p_raw_response: Json
          p_status_code: number
          p_success: boolean
          p_total_tokens: number
          p_user_email: string
          p_user_id: string
        }
        Returns: string
      }
      record_transaction: {
        Args: {
          p_amount_usd?: number
          p_billing_info?: Json
          p_generated_images?: number
          p_generated_videos?: number
          p_is_admin_transaction?: boolean
          p_pricing_type?: string
          p_project_id?: string
          p_project_name?: string
          p_raw_stripe_data?: Json
          p_status?: string
          p_stripe_payment_intent_id?: string
          p_subscription_tier?: string
          p_total_clip_count?: number
          p_transaction_type?: string
          p_user_email: string
          p_user_id: string
          p_video_duration_seconds?: number
        }
        Returns: string
      }
      rollback_credit_transaction: {
        Args: { p_metadata?: Json; p_reason?: string; p_transaction_id: string }
        Returns: {
          balance_after: number
          change_amount: number
          created_at: string
          id: string
          metadata: Json | null
          reason: string | null
          stripe_payment_intent_id: string | null
          type: string
          user_id: string
        }
      }
      set_user_admin: {
        Args: { user_email: string }
        Returns: boolean
      }
      spend_credits: {
        Args: {
          p_amount: number
          p_metadata?: Json
          p_reason?: string
          p_user_id: string
        }
        Returns: {
          balance_after: number
          change_amount: number
          created_at: string
          id: string
          metadata: Json | null
          reason: string | null
          stripe_payment_intent_id: string | null
          type: string
          user_id: string
        }
      }
      update_transaction_status: {
        Args: {
          p_failure_reason?: string
          p_raw_stripe_data?: Json
          p_status: string
          p_stripe_charge_id?: string
          p_transaction_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
