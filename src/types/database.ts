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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      app_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          key: string
          updated_at: string | null
          updated_by: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "app_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_date: string
          created_at: string
          created_by: string | null
          id: string
          status: string
          time_slot_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          booking_date: string
          created_at?: string
          created_by?: string | null
          id?: string
          status?: string
          time_slot_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          booking_date?: string
          created_at?: string
          created_by?: string | null
          id?: string
          status?: string
          time_slot_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_time_slot_id_fkey"
            columns: ["time_slot_id"]
            isOneToOne: false
            referencedRelation: "time_slots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      branding_settings: {
        Row: {
          about_trainer_quote: string | null
          about_trainer_text: string | null
          about_trainer_title: string | null
          address: string | null
          business_name: string
          city: string
          country: string
          created_at: string
          email: string | null
          empathy_subtitle: string | null
          empathy_title: string | null
          final_cta_subtitle: string | null
          final_cta_title: string | null
          google_maps_url: string | null
          group_image_url: string | null
          hero_cta_text: string
          hero_image_url: string | null
          hero_subtitle: string
          hero_title: string
          id: string
          instagram: string | null
          latitude: number | null
          logo_url: string | null
          longitude: number | null
          phone: string | null
          region: string
          schedule_saturday: string | null
          schedule_sunday: string | null
          schedule_weekdays: string | null
          show_email: boolean
          show_group_image: boolean
          show_hero_image: boolean
          show_instagram: boolean
          show_location: boolean
          show_logo: boolean
          show_phone: boolean
          show_schedule: boolean
          show_trainer_image: boolean
          show_whatsapp: boolean
          testimonials: Json | null
          trainer_image_url: string | null
          updated_at: string
          value_prop_subtitle: string | null
          value_prop_title: string
          whatsapp: string | null
        }
        Insert: {
          about_trainer_quote?: string | null
          about_trainer_text?: string | null
          about_trainer_title?: string | null
          address?: string | null
          business_name?: string
          city?: string
          country?: string
          created_at?: string
          email?: string | null
          empathy_subtitle?: string | null
          empathy_title?: string | null
          final_cta_subtitle?: string | null
          final_cta_title?: string | null
          google_maps_url?: string | null
          group_image_url?: string | null
          hero_cta_text?: string
          hero_image_url?: string | null
          hero_subtitle?: string
          hero_title?: string
          id?: string
          instagram?: string | null
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          phone?: string | null
          region?: string
          schedule_saturday?: string | null
          schedule_sunday?: string | null
          schedule_weekdays?: string | null
          show_email?: boolean
          show_group_image?: boolean
          show_hero_image?: boolean
          show_instagram?: boolean
          show_location?: boolean
          show_logo?: boolean
          show_phone?: boolean
          show_schedule?: boolean
          show_trainer_image?: boolean
          show_whatsapp?: boolean
          testimonials?: Json | null
          trainer_image_url?: string | null
          updated_at?: string
          value_prop_subtitle?: string | null
          value_prop_title?: string
          whatsapp?: string | null
        }
        Update: {
          about_trainer_quote?: string | null
          about_trainer_text?: string | null
          about_trainer_title?: string | null
          address?: string | null
          business_name?: string
          city?: string
          country?: string
          created_at?: string
          email?: string | null
          empathy_subtitle?: string | null
          empathy_title?: string | null
          final_cta_subtitle?: string | null
          final_cta_title?: string | null
          google_maps_url?: string | null
          group_image_url?: string | null
          hero_cta_text?: string
          hero_image_url?: string | null
          hero_subtitle?: string
          hero_title?: string
          id?: string
          instagram?: string | null
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          phone?: string | null
          region?: string
          schedule_saturday?: string | null
          schedule_sunday?: string | null
          schedule_weekdays?: string | null
          show_email?: boolean
          show_group_image?: boolean
          show_hero_image?: boolean
          show_instagram?: boolean
          show_location?: boolean
          show_logo?: boolean
          show_phone?: boolean
          show_schedule?: boolean
          show_trainer_image?: boolean
          show_whatsapp?: boolean
          testimonials?: Json | null
          trainer_image_url?: string | null
          updated_at?: string
          value_prop_subtitle?: string | null
          value_prop_title?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      health_check: {
        Row: {
          created_at: string
          id: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          status?: string
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          bank_account: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          display_order: number
          id: string
          instructions: string | null
          is_active: boolean
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          bank_account?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          display_order?: number
          id?: string
          instructions?: string | null
          is_active?: boolean
          name: string
          type: string
          updated_at?: string
        }
        Update: {
          bank_account?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          display_order?: number
          id?: string
          instructions?: string | null
          is_active?: boolean
          name?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      payment_requests: {
        Row: {
          admin_notes: string | null
          created_at: string
          credits_requested: number
          id: string
          payment_method_id: string | null
          processed_at: string | null
          processed_by: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          credits_requested: number
          id?: string
          payment_method_id?: string | null
          processed_at?: string | null
          processed_by?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          credits_requested?: number
          id?: string
          payment_method_id?: string | null
          processed_at?: string | null
          processed_by?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_requests_payment_method_id_fkey"
            columns: ["payment_method_id"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_requests_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_packages: {
        Row: {
          created_at: string
          credits: number
          display_order: number
          id: string
          is_active: boolean
          name: string
          package_name: string | null
          price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          credits: number
          display_order?: number
          id?: string
          is_active?: boolean
          name: string
          package_name?: string | null
          price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          credits?: number
          display_order?: number
          id?: string
          is_active?: boolean
          name?: string
          package_name?: string | null
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          approval_status: string
          created_at: string
          credits: number
          email: string
          full_name: string | null
          id: string
          payment_status: string
          phone: string | null
          role: string
          updated_at: string
        }
        Insert: {
          approval_status?: string
          created_at?: string
          credits?: number
          email: string
          full_name?: string | null
          id: string
          payment_status?: string
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          approval_status?: string
          created_at?: string
          credits?: number
          email?: string
          full_name?: string | null
          id?: string
          payment_status?: string
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      time_slots: {
        Row: {
          capacity: number
          created_at: string
          created_by: string | null
          day_of_week: number
          end_time: string
          id: string
          is_active: boolean
          slot_type: string
          specific_date: string | null
          start_time: string
          updated_at: string
        }
        Insert: {
          capacity?: number
          created_at?: string
          created_by?: string | null
          day_of_week: number
          end_time: string
          id?: string
          is_active?: boolean
          slot_type?: string
          specific_date?: string | null
          start_time: string
          updated_at?: string
        }
        Update: {
          capacity?: number
          created_at?: string
          created_by?: string | null
          day_of_week?: number
          end_time?: string
          id?: string
          is_active?: boolean
          slot_type?: string
          specific_date?: string | null
          start_time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_slots_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      weight_stats: {
        Row: {
          bmi: number | null
          body_fat_percentage: number | null
          bone_mass: number | null
          created_at: string
          daily_calorie_intake: number | null
          id: string
          metabolic_age: number | null
          muscle_mass: number | null
          notes: string | null
          recorded_at: string
          total_body_water_percentage: number | null
          updated_at: string
          user_id: string
          weight: number
        }
        Insert: {
          bmi?: number | null
          body_fat_percentage?: number | null
          bone_mass?: number | null
          created_at?: string
          daily_calorie_intake?: number | null
          id?: string
          metabolic_age?: number | null
          muscle_mass?: number | null
          notes?: string | null
          recorded_at?: string
          total_body_water_percentage?: number | null
          updated_at?: string
          user_id: string
          weight: number
        }
        Update: {
          bmi?: number | null
          body_fat_percentage?: number | null
          bone_mass?: number | null
          created_at?: string
          daily_calorie_intake?: number | null
          id?: string
          metabolic_age?: number | null
          muscle_mass?: number | null
          notes?: string | null
          recorded_at?: string
          total_body_water_percentage?: number | null
          updated_at?: string
          user_id?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "weight_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_create_user: {
        Args: { p_email: string; p_full_name: string; p_password: string }
        Returns: string
      }
      admin_delete_user: { Args: { p_user_id: string }; Returns: boolean }
      approve_user: { Args: { target_user_id: string }; Returns: undefined }
      calculate_weight_change: {
        Args: { p_end_date: string; p_start_date: string; p_user_id: string }
        Returns: {
          end_weight: number
          percentage_change: number
          start_weight: number
          weight_change: number
        }[]
      }
      get_admin_dashboard_data: { Args: never; Returns: Json }
      get_admin_secondary_data: { Args: never; Returns: Json }
      get_available_spots: {
        Args: { slot_id: string; target_date: string }
        Returns: number
      }
      get_latest_weight_stat: {
        Args: { p_user_id: string }
        Returns: {
          bmi: number
          body_fat_percentage: number
          bone_mass: number
          created_at: string
          daily_calorie_intake: number
          id: string
          metabolic_age: number
          muscle_mass: number
          notes: string
          recorded_at: string
          total_body_water_percentage: number
          updated_at: string
          user_id: string
          weight: number
        }[]
      }
      get_weight_stats_by_date_range: {
        Args: { p_end_date: string; p_start_date: string; p_user_id: string }
        Returns: {
          bmi: number
          body_fat_percentage: number
          bone_mass: number
          created_at: string
          daily_calorie_intake: number
          id: string
          metabolic_age: number
          muscle_mass: number
          notes: string
          recorded_at: string
          total_body_water_percentage: number
          updated_at: string
          user_id: string
          weight: number
        }[]
      }
      is_admin:
        | { Args: never; Returns: boolean }
        | { Args: { user_id: string }; Returns: boolean }
      reject_user: { Args: { target_user_id: string }; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
