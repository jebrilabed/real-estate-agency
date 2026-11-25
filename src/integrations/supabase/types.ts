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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      commission_agreements: {
        Row: {
          created_at: string
          id: string
          kind: string
          property_id: string
          rate: number
          status: string
          terms: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind: string
          property_id: string
          rate: number
          status?: string
          terms?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          property_id?: string
          rate?: number
          status?: string
          terms?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "commission_agreements_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: true
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_payments: {
        Row: {
          agreement_id: string
          amount: number
          created_at: string
          id: string
          notes: string
          paid_at: string
        }
        Insert: {
          agreement_id: string
          amount: number
          created_at?: string
          id?: string
          notes?: string
          paid_at: string
        }
        Update: {
          agreement_id?: string
          amount?: number
          created_at?: string
          id?: string
          notes?: string
          paid_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "commission_payments_agreement_id_fkey"
            columns: ["agreement_id"]
            isOneToOne: false
            referencedRelation: "commission_agreements"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string
          property_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          property_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          property_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      inquiries: {
        Row: {
          created_at: string
          id: string
          message: string
          name: string
          phone: string
          property_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          name: string
          phone: string
          property_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          name?: string
          phone?: string
          property_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inquiries_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inquiries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_notes: {
        Row: {
          created_at: string
          id: string
          inquiry_id: string
          note: string
        }
        Insert: {
          created_at?: string
          id?: string
          inquiry_id: string
          note: string
        }
        Update: {
          created_at?: string
          id?: string
          inquiry_id?: string
          note?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_notes_inquiry_id_fkey"
            columns: ["inquiry_id"]
            isOneToOne: false
            referencedRelation: "inquiries"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string
          id: string
          phone: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          id: string
          phone?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          id?: string
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string
          amenities: string[]
          approval: string
          area: number
          bathrooms: number
          bedrooms: number
          category: string
          city: string
          created_at: string
          currency: string
          description: string
          featured: boolean
          floor: number
          id: string
          latitude: number | null
          longitude: number | null
          neighborhood: string
          owner_id: string
          price: number
          publisher_id: string
          purpose: string
          rejection_reason: string | null
          source: string
          status: string
          title: string
          updated_at: string
          views: number
        }
        Insert: {
          address?: string
          amenities?: string[]
          approval?: string
          area: number
          bathrooms?: number
          bedrooms?: number
          category: string
          city: string
          created_at?: string
          currency?: string
          description?: string
          featured?: boolean
          floor?: number
          id?: string
          latitude?: number | null
          longitude?: number | null
          neighborhood?: string
          owner_id: string
          price: number
          publisher_id: string
          purpose: string
          rejection_reason?: string | null
          source?: string
          status?: string
          title: string
          updated_at?: string
          views?: number
        }
        Update: {
          address?: string
          amenities?: string[]
          approval?: string
          area?: number
          bathrooms?: number
          bedrooms?: number
          category?: string
          city?: string
          created_at?: string
          currency?: string
          description?: string
          featured?: boolean
          floor?: number
          id?: string
          latitude?: number | null
          longitude?: number | null
          neighborhood?: string
          owner_id?: string
          price?: number
          publisher_id?: string
          purpose?: string
          rejection_reason?: string | null
          source?: string
          status?: string
          title?: string
          updated_at?: string
          views?: number
        }
        Relationships: [
          {
            foreignKeyName: "properties_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_publisher_id_fkey"
            columns: ["publisher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      property_categories: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      property_images: {
        Row: {
          id: string
          position: number
          property_id: string
          storage_path: string
        }
        Insert: {
          id?: string
          position?: number
          property_id: string
          storage_path: string
        }
        Update: {
          id?: string
          position?: number
          property_id?: string
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_images_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          agreement_id: string
          amount: number
          commission: number
          completed_at: string
          confirmed_by: string
          id: string
          property_id: string
        }
        Insert: {
          agreement_id: string
          amount: number
          commission: number
          completed_at?: string
          confirmed_by: string
          id?: string
          property_id: string
        }
        Update: {
          agreement_id?: string
          amount?: number
          commission?: number
          completed_at?: string
          confirmed_by?: string
          id?: string
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_agreement_id_fkey"
            columns: ["agreement_id"]
            isOneToOne: false
            referencedRelation: "commission_agreements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_confirmed_by_fkey"
            columns: ["confirmed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: true
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      viewing_appointments: {
        Row: {
          created_at: string
          id: string
          property_id: string
          scheduled_at: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          property_id: string
          scheduled_at: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          property_id?: string
          scheduled_at?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "viewing_appointments_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "viewing_appointments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      website_settings: {
        Row: {
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      confirm_transaction: {
        Args: { p_amount: number; p_property: string }
        Returns: string
      }
      is_admin: { Args: never; Returns: boolean }
      is_owner: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "owner" | "buyer" | "admin"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["owner", "buyer", "admin"],
    },
  },
} as const
