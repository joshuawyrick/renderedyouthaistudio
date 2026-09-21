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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      age_verification: {
        Row: {
          created_at: string
          date_of_birth: string
          id: string
          is_minor: boolean
          parent_email: string | null
          requires_parent_consent: boolean
          session_token: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          date_of_birth: string
          id?: string
          is_minor: boolean
          parent_email?: string | null
          requires_parent_consent: boolean
          session_token?: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          date_of_birth?: string
          id?: string
          is_minor?: boolean
          parent_email?: string | null
          requires_parent_consent?: boolean
          session_token?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      collections: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          page_description: string | null
          page_header: string | null
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          page_description?: string | null
          page_header?: string | null
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          page_description?: string | null
          page_header?: string | null
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      creator_earnings: {
        Row: {
          commission_rate: number
          created_at: string
          creator_share: number
          creator_user_id: string
          gross_amount: number
          id: string
          payout_date: string | null
          payout_status: string
          platform_fee: number
          product_id: string
          sale_id: string
          stripe_transfer_id: string | null
        }
        Insert: {
          commission_rate: number
          created_at?: string
          creator_share: number
          creator_user_id: string
          gross_amount: number
          id?: string
          payout_date?: string | null
          payout_status?: string
          platform_fee: number
          product_id: string
          sale_id: string
          stripe_transfer_id?: string | null
        }
        Update: {
          commission_rate?: number
          created_at?: string
          creator_share?: number
          creator_user_id?: string
          gross_amount?: number
          id?: string
          payout_date?: string | null
          payout_status?: string
          platform_fee?: number
          product_id?: string
          sale_id?: string
          stripe_transfer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_earnings_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creator_earnings_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      design_mockups: {
        Row: {
          created_at: string
          design_id: string
          generation_batch: number | null
          id: string
          is_ai_generated: boolean | null
          mockup_order: number
          mockup_url: string
          prompt_used: string | null
          style_key: string | null
          style_label: string | null
        }
        Insert: {
          created_at?: string
          design_id: string
          generation_batch?: number | null
          id?: string
          is_ai_generated?: boolean | null
          mockup_order?: number
          mockup_url: string
          prompt_used?: string | null
          style_key?: string | null
          style_label?: string | null
        }
        Update: {
          created_at?: string
          design_id?: string
          generation_batch?: number | null
          id?: string
          is_ai_generated?: boolean | null
          mockup_order?: number
          mockup_url?: string
          prompt_used?: string | null
          style_key?: string | null
          style_label?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "design_mockups_design_id_fkey"
            columns: ["design_id"]
            isOneToOne: false
            referencedRelation: "designs"
            referencedColumns: ["id"]
          },
        ]
      }
      design_selections: {
        Row: {
          design_id: string
          id: string
          selected_at: string
          selected_mockup_id: string
        }
        Insert: {
          design_id: string
          id?: string
          selected_at?: string
          selected_mockup_id: string
        }
        Update: {
          design_id?: string
          id?: string
          selected_at?: string
          selected_mockup_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "design_selections_design_id_fkey"
            columns: ["design_id"]
            isOneToOne: false
            referencedRelation: "designs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "design_selections_selected_mockup_id_fkey"
            columns: ["selected_mockup_id"]
            isOneToOne: false
            referencedRelation: "design_mockups"
            referencedColumns: ["id"]
          },
        ]
      }
      designs: {
        Row: {
          ai_error: string | null
          ai_generated_at: string | null
          ai_generation_count: number | null
          ai_status: string | null
          art_colors: string | null
          art_description: string | null
          art_mood: string | null
          art_subject: string | null
          collection_id: string | null
          created_at: string
          file_name: string
          file_size: number
          file_url: string
          id: string
          inspiration: string | null
          status: string | null
          subcollection_id: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_error?: string | null
          ai_generated_at?: string | null
          ai_generation_count?: number | null
          ai_status?: string | null
          art_colors?: string | null
          art_description?: string | null
          art_mood?: string | null
          art_subject?: string | null
          collection_id?: string | null
          created_at?: string
          file_name: string
          file_size: number
          file_url: string
          id?: string
          inspiration?: string | null
          status?: string | null
          subcollection_id?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_error?: string | null
          ai_generated_at?: string | null
          ai_generation_count?: number | null
          ai_status?: string | null
          art_colors?: string | null
          art_description?: string | null
          art_mood?: string | null
          art_subject?: string | null
          collection_id?: string | null
          created_at?: string
          file_name?: string
          file_size?: number
          file_url?: string
          id?: string
          inspiration?: string | null
          status?: string | null
          subcollection_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "designs_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "designs_subcollection_id_fkey"
            columns: ["subcollection_id"]
            isOneToOne: false
            referencedRelation: "subcollections"
            referencedColumns: ["id"]
          },
        ]
      }
      discount_codes: {
        Row: {
          code: string
          created_at: string
          created_by: string | null
          description: string | null
          discount_amount: number
          discount_type: string
          id: string
          is_active: boolean
          name: string
          updated_at: string
          usage_count: number
          usage_limit: number | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          code: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          discount_amount: number
          discount_type: string
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
          usage_count?: number
          usage_limit?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          discount_amount?: number
          discount_type?: string
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
          usage_count?: number
          usage_limit?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      notification_settings: {
        Row: {
          created_at: string
          email_on_review_ready: boolean | null
          email_on_selection_complete: boolean | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_on_review_ready?: boolean | null
          email_on_selection_complete?: boolean | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_on_review_ready?: boolean | null
          email_on_selection_complete?: boolean | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          color: string | null
          created_at: string
          creator_commission_amount: number
          creator_commission_rate: number
          creator_user_id: string | null
          id: string
          line_total: number
          order_id: string
          product_id: string | null
          product_title: string
          quantity: number
          size: string | null
          unit_price: number
          variant_id: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          creator_commission_amount?: number
          creator_commission_rate?: number
          creator_user_id?: string | null
          id?: string
          line_total?: number
          order_id: string
          product_id?: string | null
          product_title: string
          quantity?: number
          size?: string | null
          unit_price?: number
          variant_id?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string
          creator_commission_amount?: number
          creator_commission_rate?: number
          creator_user_id?: string | null
          id?: string
          line_total?: number
          order_id?: string
          product_id?: string | null
          product_title?: string
          quantity?: number
          size?: string | null
          unit_price?: number
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          currency: string
          customer_email: string
          customer_name: string | null
          discount_amount: number
          discount_code: string | null
          id: string
          payment_status: string
          shipping_address: Json
          shipping_amount: number
          status: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          subtotal: number
          tax_amount: number
          total_amount: number
          tracking_number: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          currency?: string
          customer_email: string
          customer_name?: string | null
          discount_amount?: number
          discount_code?: string | null
          id?: string
          payment_status?: string
          shipping_address?: Json
          shipping_amount?: number
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          currency?: string
          customer_email?: string
          customer_name?: string | null
          discount_amount?: number
          discount_code?: string | null
          id?: string
          payment_status?: string
          shipping_address?: Json
          shipping_amount?: number
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      parent_verification_tokens: {
        Row: {
          age_verification_id: string
          created_at: string
          expires_at: string
          id: string
          parent_email: string
          token_hash: string
          verification_ip_address: unknown
          verified_at: string | null
        }
        Insert: {
          age_verification_id: string
          created_at?: string
          expires_at: string
          id?: string
          parent_email: string
          token_hash: string
          verification_ip_address?: unknown
          verified_at?: string | null
        }
        Update: {
          age_verification_id?: string
          created_at?: string
          expires_at?: string
          id?: string
          parent_email?: string
          token_hash?: string
          verification_ip_address?: unknown
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parent_verification_tokens_age_verification_id_fkey"
            columns: ["age_verification_id"]
            isOneToOne: false
            referencedRelation: "age_verification"
            referencedColumns: ["id"]
          },
        ]
      }
      payout_batches: {
        Row: {
          batch_name: string
          created_at: string
          created_by: string
          creator_count: number
          id: string
          processed_at: string | null
          status: string
          total_amount: number
        }
        Insert: {
          batch_name: string
          created_at?: string
          created_by: string
          creator_count?: number
          id?: string
          processed_at?: string | null
          status?: string
          total_amount: number
        }
        Update: {
          batch_name?: string
          created_at?: string
          created_by?: string
          creator_count?: number
          id?: string
          processed_at?: string | null
          status?: string
          total_amount?: number
        }
        Relationships: []
      }
      platform_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          setting_key: string
          setting_value: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key: string
          setting_value: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: string
          updated_at?: string
        }
        Relationships: []
      }
      printful_products: {
        Row: {
          created_at: string
          id: string
          last_sync_at: string | null
          printful_product_id: string
          product_id: string
          sync_error_message: string | null
          sync_status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_sync_at?: string | null
          printful_product_id: string
          product_id: string
          sync_error_message?: string | null
          sync_status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          last_sync_at?: string | null
          printful_product_id?: string
          product_id?: string
          sync_error_message?: string | null
          sync_status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "printful_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          color: string
          created_at: string
          id: string
          is_available: boolean
          price_adjustment: number | null
          printful_variant_id: string | null
          product_id: string
          size: string
          variant_type: string
        }
        Insert: {
          color: string
          created_at?: string
          id?: string
          is_available?: boolean
          price_adjustment?: number | null
          printful_variant_id?: string | null
          product_id: string
          size: string
          variant_type: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          is_available?: boolean
          price_adjustment?: number | null
          printful_variant_id?: string | null
          product_id?: string
          size?: string
          variant_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          additional_images: Json | null
          assigned_user_id: string | null
          base_price: number | null
          collection_id: string | null
          created_at: string
          creator_commission_rate: number
          description: string | null
          design_id: string
          id: string
          price: number
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          additional_images?: Json | null
          assigned_user_id?: string | null
          base_price?: number | null
          collection_id?: string | null
          created_at?: string
          creator_commission_rate?: number
          description?: string | null
          design_id: string
          id?: string
          price?: number
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          additional_images?: Json | null
          assigned_user_id?: string | null
          base_price?: number | null
          collection_id?: string | null
          created_at?: string
          creator_commission_rate?: number
          description?: string | null
          design_id?: string
          id?: string
          price?: number
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_design_id_fkey"
            columns: ["design_id"]
            isOneToOne: false
            referencedRelation: "designs"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_type: string
          age_bracket: string | null
          bio: string | null
          created_at: string
          facebook_handle: string | null
          first_name: string | null
          id: string
          instagram_handle: string | null
          is_minor: boolean | null
          last_name: string | null
          parent_email: string | null
          profile_image_url: string | null
          requires_parent_consent: boolean | null
          state: string | null
          stripe_charges_enabled: boolean | null
          stripe_connect_account_id: string | null
          stripe_onboarding_completed: boolean | null
          stripe_payouts_enabled: boolean | null
          tiktok_handle: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          account_type?: string
          age_bracket?: string | null
          bio?: string | null
          created_at?: string
          facebook_handle?: string | null
          first_name?: string | null
          id: string
          instagram_handle?: string | null
          is_minor?: boolean | null
          last_name?: string | null
          parent_email?: string | null
          profile_image_url?: string | null
          requires_parent_consent?: boolean | null
          state?: string | null
          stripe_charges_enabled?: boolean | null
          stripe_connect_account_id?: string | null
          stripe_onboarding_completed?: boolean | null
          stripe_payouts_enabled?: boolean | null
          tiktok_handle?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          account_type?: string
          age_bracket?: string | null
          bio?: string | null
          created_at?: string
          facebook_handle?: string | null
          first_name?: string | null
          id?: string
          instagram_handle?: string | null
          is_minor?: boolean | null
          last_name?: string | null
          parent_email?: string | null
          profile_image_url?: string | null
          requires_parent_consent?: boolean | null
          state?: string | null
          stripe_charges_enabled?: boolean | null
          stripe_connect_account_id?: string | null
          stripe_onboarding_completed?: boolean | null
          stripe_payouts_enabled?: boolean | null
          tiktok_handle?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      revenue_distributions: {
        Row: {
          commission_amount: number
          created_at: string
          creator_user_id: string
          id: string
          payout_date: string | null
          payout_status: string
          period_end: string
          period_start: string
          total_sales_amount: number
        }
        Insert: {
          commission_amount: number
          created_at?: string
          creator_user_id: string
          id?: string
          payout_date?: string | null
          payout_status?: string
          period_end: string
          period_start: string
          total_sales_amount: number
        }
        Update: {
          commission_amount?: number
          created_at?: string
          creator_user_id?: string
          id?: string
          payout_date?: string | null
          payout_status?: string
          period_end?: string
          period_start?: string
          total_sales_amount?: number
        }
        Relationships: []
      }
      sales: {
        Row: {
          admin_revenue: number
          creator_commission: number
          customer_email: string | null
          customer_name: string | null
          id: string
          order_status: string
          product_id: string
          quantity: number
          sale_date: string
          total_amount: number
          unit_price: number
        }
        Insert: {
          admin_revenue: number
          creator_commission: number
          customer_email?: string | null
          customer_name?: string | null
          id?: string
          order_status?: string
          product_id: string
          quantity?: number
          sale_date?: string
          total_amount: number
          unit_price: number
        }
        Update: {
          admin_revenue?: number
          creator_commission?: number
          customer_email?: string | null
          customer_name?: string | null
          id?: string
          order_status?: string
          product_id?: string
          quantity?: number
          sale_date?: string
          total_amount?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "sales_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      security_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown
          metadata: Json | null
          resource_id: string | null
          resource_type: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      subcollections: {
        Row: {
          collection_id: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          collection_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          collection_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subcollections_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      user_consents: {
        Row: {
          child_user_id: string | null
          consent_given_at: string
          consent_ip_address: unknown
          consent_method: string
          created_at: string
          id: string
          is_active: boolean
          notice_version: string
          parent_email: string
        }
        Insert: {
          child_user_id?: string | null
          consent_given_at?: string
          consent_ip_address?: unknown
          consent_method?: string
          created_at?: string
          id?: string
          is_active?: boolean
          notice_version?: string
          parent_email: string
        }
        Update: {
          child_user_id?: string | null
          consent_given_at?: string
          consent_ip_address?: unknown
          consent_method?: string
          created_at?: string
          id?: string
          is_active?: boolean
          notice_version?: string
          parent_email?: string
        }
        Relationships: []
      }
    }
    Views: {
      admin_dashboard_stats: {
        Row: {
          active_products_count: number | null
          admin_revenue_last_30_days: number | null
          creator_commissions_last_30_days: number | null
          mockups_ready_count: number | null
          pending_review_count: number | null
          published_count: number | null
          revenue_last_30_days: number | null
          selected_count: number | null
          units_sold_last_30_days: number | null
        }
        Relationships: []
      }
      creator_earnings_summary: {
        Row: {
          creator_user_id: string | null
          first_name: string | null
          last_name: string | null
          paid_earnings: number | null
          pending_earnings: number | null
          stripe_connect_account_id: string | null
          stripe_onboarding_completed: boolean | null
          total_earnings: number | null
          total_gross: number | null
          total_sales: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_public_profile_fields: {
        Args: { profile_row: Database["public"]["Tables"]["profiles"]["Row"] }
        Returns: boolean
      }
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
    Enums: {},
  },
} as const
