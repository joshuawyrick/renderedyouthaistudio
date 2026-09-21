export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: 'parent' | 'admin'
          display_name: string
          onboarding_step: 'account' | 'consent' | 'artists' | 'complete'
          consent_accepted: boolean
          payout_ready: boolean
          created_at: string
          updated_at: string
          // Legacy columns referenced by existing services
          first_name: string | null
          last_name: string | null
          username: string | null
          account_type: string
          bio: string | null
          state: string | null
          age_bracket: string | null
          is_minor: boolean | null
          requires_parent_consent: boolean | null
          parent_email: string | null
          profile_image_url: string | null
          stripe_connect_account_id: string | null
          stripe_onboarding_completed: boolean | null
          stripe_charges_enabled: boolean | null
          stripe_payouts_enabled: boolean | null
          instagram_handle: string | null
          facebook_handle: string | null
          tiktok_handle: string | null
        }
        Insert: {
          id: string
          role?: 'parent' | 'admin'
          display_name?: string
          onboarding_step?: 'account' | 'consent' | 'artists' | 'complete'
          consent_accepted?: boolean
          payout_ready?: boolean
          // Legacy insert columns
          first_name?: string | null
          last_name?: string | null
          username?: string | null
          account_type?: string
          bio?: string | null
          state?: string | null
          age_bracket?: string | null
          is_minor?: boolean | null
          requires_parent_consent?: boolean | null
          parent_email?: string | null
          profile_image_url?: string | null
          stripe_connect_account_id?: string | null
          stripe_onboarding_completed?: boolean | null
          stripe_charges_enabled?: boolean | null
          stripe_payouts_enabled?: boolean | null
          instagram_handle?: string | null
          facebook_handle?: string | null
          tiktok_handle?: string | null
        }
        Update: {
          display_name?: string
          onboarding_step?: 'account' | 'consent' | 'artists' | 'complete'
          consent_accepted?: boolean
          // Legacy update columns
          first_name?: string | null
          last_name?: string | null
          username?: string | null
          account_type?: string
          bio?: string | null
          state?: string | null
          age_bracket?: string | null
          is_minor?: boolean | null
          requires_parent_consent?: boolean | null
          parent_email?: string | null
          profile_image_url?: string | null
          stripe_connect_account_id?: string | null
          stripe_onboarding_completed?: boolean | null
          stripe_charges_enabled?: boolean | null
          stripe_payouts_enabled?: boolean | null
          instagram_handle?: string | null
          facebook_handle?: string | null
          tiktok_handle?: string | null
        }
        Relationships: []
      }
      artists: {
        Row: {
          id: string
          parent_id: string
          display_name: string
          avatar_type: 'star' | 'sun' | 'flower'
          age: number | null
          state: string | null
          show_age: boolean
          show_state: boolean
          bio: string
          goal: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          parent_id: string
          display_name: string
          avatar_type?: 'star' | 'sun' | 'flower'
          age?: number | null
          state?: string | null
          show_age?: boolean
          show_state?: boolean
          bio?: string
          goal?: string
        }
        Update: {
          display_name?: string
          avatar_type?: 'star' | 'sun' | 'flower'
          age?: number | null
          state?: string | null
          show_age?: boolean
          show_state?: boolean
          bio?: string
          goal?: string
        }
        Relationships: []
      }
      designs: {
        Row: {
          id: string
          artist_id: string
          parent_id: string
          title: string
          story: string
          stage: 'draft' | 'generating' | 'choose' | 'review' | 'changes' | 'mockup' | 'parent_approval' | 'ready' | 'published'
          selected_option: number
          completed_batches: number
          admin_credits: number
          request_note: string | null
          admin_note: string | null
          variants_ready: boolean
          history: Json
          created_at: string
          updated_at: string
          // Legacy columns referenced by existing services
          status: string | null
          user_id: string
          file_url: string
          file_name: string
          file_size: number
          art_subject: string | null
          art_description: string | null
          art_colors: string | null
          art_mood: string | null
          inspiration: string | null
          ai_status: string | null
          ai_error: string | null
          ai_generated_at: string | null
          ai_generation_count: number | null
          collection_id: string | null
          subcollection_id: string | null
        }
        Insert: {
          id?: string
          artist_id: string
          parent_id: string
          title: string
          story: string
          stage?: string
          selected_option?: number
          completed_batches?: number
          admin_credits?: number
          request_note?: string | null
          admin_note?: string | null
          variants_ready?: boolean
          history?: Json
          // Legacy insert columns
          status?: string | null
          user_id?: string
          file_url?: string
          file_name?: string
          file_size?: number
          art_subject?: string | null
          art_description?: string | null
          art_colors?: string | null
          art_mood?: string | null
          inspiration?: string | null
          ai_status?: string | null
          ai_error?: string | null
          ai_generated_at?: string | null
          ai_generation_count?: number | null
          collection_id?: string | null
          subcollection_id?: string | null
        }
        Update: {
          title?: string
          story?: string
          stage?: string
          selected_option?: number
          completed_batches?: number
          admin_credits?: number
          request_note?: string | null
          admin_note?: string | null
          variants_ready?: boolean
          // Legacy update columns
          status?: string | null
          file_url?: string
          file_name?: string
          file_size?: number
          art_subject?: string | null
          art_description?: string | null
          art_colors?: string | null
          art_mood?: string | null
          inspiration?: string | null
          ai_status?: string | null
          ai_error?: string | null
          ai_generated_at?: string | null
          ai_generation_count?: number | null
          collection_id?: string | null
          subcollection_id?: string | null
        }
        Relationships: []
      }
      design_events: {
        Row: {
          id: string
          design_id: string
          actor_id: string
          actor_role: 'parent' | 'admin' | 'worker'
          action: string
          from_stage: string | null
          to_stage: string
          reason: string | null
          created_at: string
        }
        Insert: {
          id?: string
          design_id: string
          actor_id: string
          actor_role: 'parent' | 'admin' | 'worker'
          action: string
          from_stage?: string | null
          to_stage: string
          reason?: string | null
        }
        Update: {}
        Relationships: []
      }
      app_settings: {
        Row: {
          id: string
          key: string
          value: Json
          description: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: Json
          description?: string | null
        }
        Update: {
          value?: Json
          description?: string | null
        }
        Relationships: []
      }
      // Legacy table types — kept for backward compatibility with existing services.
      // These tables don't exist in the new database yet; they'll be created in later milestones.
      collections: { Row: { id: string; name: string; slug: string; description: string | null; page_header: string | null; page_description: string | null; is_active: boolean; sort_order: number; created_at: string; updated_at: string }; Insert: { name: string; slug: string; description?: string | null; page_header?: string | null; page_description?: string | null; is_active?: boolean; sort_order?: number }; Update: Record<string, any>; Relationships: [] }
      subcollections: { Row: { id: string; collection_id: string; name: string; slug: string; description: string | null; is_active: boolean; sort_order: number; created_at: string; updated_at: string }; Insert: { collection_id: string; name: string; slug: string; description?: string | null; is_active?: boolean; sort_order?: number }; Update: Record<string, any>; Relationships: [] }
      products: { Row: { id: string; design_id: string; title: string; description: string | null; price: number; base_price: number | null; creator_commission_rate: number; status: string; collection_id: string | null; assigned_user_id: string | null; additional_images: Json | null; created_at: string; updated_at: string }; Insert: { design_id: string; title: string; price?: number; creator_commission_rate?: number; status?: string }; Update: Record<string, any>; Relationships: [] }
      product_variants: { Row: { id: string; product_id: string; size: string; color: string; variant_type: string; is_available: boolean; price_adjustment: number | null; printful_variant_id: string | null; created_at: string }; Insert: { product_id: string; size: string; color: string; variant_type: string }; Update: Record<string, any>; Relationships: [] }
      design_mockups: { Row: { id: string; design_id: string; mockup_url: string; mockup_order: number; style_key: string | null; style_label: string | null; is_ai_generated: boolean | null; generation_batch: number | null; prompt_used: string | null; created_at: string }; Insert: { design_id: string; mockup_url: string; mockup_order?: number }; Update: Record<string, any>; Relationships: [] }
      design_selections: { Row: { id: string; design_id: string; selected_mockup_id: string; selected_at: string }; Insert: { design_id: string; selected_mockup_id: string }; Update: Record<string, any>; Relationships: [] }
      orders: { Row: { id: string; user_id: string | null; customer_email: string; customer_name: string | null; subtotal: number; shipping_amount: number; tax_amount: number; discount_amount: number; total_amount: number; currency: string; status: string; payment_status: string; stripe_session_id: string | null; stripe_payment_intent_id: string | null; shipping_address: Json; tracking_number: string | null; discount_code: string | null; created_at: string; updated_at: string }; Insert: { customer_email: string }; Update: Record<string, any>; Relationships: [] }
      order_items: { Row: { id: string; order_id: string; product_id: string | null; product_title: string; quantity: number; unit_price: number; line_total: number; size: string | null; color: string | null; variant_id: string | null; creator_user_id: string | null; creator_commission_rate: number; creator_commission_amount: number; created_at: string }; Insert: { order_id: string; product_title: string }; Update: Record<string, any>; Relationships: [] }
      sales: { Row: { id: string; product_id: string; unit_price: number; quantity: number; total_amount: number; creator_commission: number; admin_revenue: number; customer_name: string | null; customer_email: string | null; sale_date: string; order_status: string }; Insert: { product_id: string; total_amount: number; unit_price: number; creator_commission: number; admin_revenue: number }; Update: Record<string, any>; Relationships: [] }
      creator_earnings: { Row: { id: string; sale_id: string; product_id: string; creator_user_id: string; gross_amount: number; creator_share: number; platform_fee: number; commission_rate: number; payout_status: string; payout_date: string | null; stripe_transfer_id: string | null; created_at: string }; Insert: { sale_id: string; product_id: string; creator_user_id: string; gross_amount: number; creator_share: number; platform_fee: number; commission_rate: number }; Update: Record<string, any>; Relationships: [] }
      revenue_distributions: { Row: { id: string; creator_user_id: string; total_sales_amount: number; commission_amount: number; period_start: string; period_end: string; payout_status: string; payout_date: string | null; created_at: string }; Insert: { creator_user_id: string; total_sales_amount: number; commission_amount: number; period_start: string; period_end: string }; Update: Record<string, any>; Relationships: [] }
      payout_batches: { Row: { id: string; batch_name: string; total_amount: number; creator_count: number; status: string; created_by: string; created_at: string; processed_at: string | null }; Insert: { batch_name: string; total_amount: number; created_by: string }; Update: Record<string, any>; Relationships: [] }
      discount_codes: { Row: { id: string; name: string; code: string; discount_type: string; discount_amount: number; is_active: boolean; usage_count: number; usage_limit: number | null; valid_from: string | null; valid_until: string | null; created_by: string | null; description: string | null; created_at: string; updated_at: string }; Insert: { name: string; code: string; discount_type: string; discount_amount: number }; Update: Record<string, any>; Relationships: [] }
      notification_settings: { Row: { id: string; user_id: string; email_on_review_ready: boolean | null; email_on_selection_complete: boolean | null; created_at: string; updated_at: string }; Insert: { user_id: string }; Update: Record<string, any>; Relationships: [] }
      printful_products: { Row: { id: string; product_id: string; printful_product_id: string; sync_status: string; sync_error_message: string | null; last_sync_at: string | null; created_at: string; updated_at: string }; Insert: { product_id: string; printful_product_id: string }; Update: Record<string, any>; Relationships: [] }
      admin_users: { Row: { id: string; user_id: string; created_at: string }; Insert: { user_id: string }; Update: Record<string, any>; Relationships: [] }
      age_verification: { Row: { id: string; session_token: string; date_of_birth: string; is_minor: boolean; requires_parent_consent: boolean; parent_email: string | null; verified_at: string | null; created_at: string }; Insert: { date_of_birth: string; is_minor: boolean; requires_parent_consent: boolean }; Update: Record<string, any>; Relationships: [] }
      parent_verification_tokens: { Row: { id: string; age_verification_id: string; parent_email: string; token_hash: string; expires_at: string; verified_at: string | null; verification_ip_address: unknown; created_at: string }; Insert: { age_verification_id: string; parent_email: string; token_hash: string; expires_at: string }; Update: Record<string, any>; Relationships: [] }
      user_consents: { Row: { id: string; parent_email: string; child_user_id: string | null; consent_method: string; notice_version: string; consent_given_at: string; consent_ip_address: unknown; is_active: boolean; created_at: string }; Insert: { parent_email: string }; Update: Record<string, any>; Relationships: [] }
      security_logs: { Row: { id: string; user_id: string | null; action: string; resource_type: string | null; resource_id: string | null; ip_address: unknown; user_agent: string | null; metadata: Json | null; created_at: string }; Insert: { action: string }; Update: Record<string, any>; Relationships: [] }
      platform_settings: { Row: { id: string; setting_key: string; setting_value: string; description: string | null; created_at: string; updated_at: string }; Insert: { setting_key: string; setting_value: string }; Update: Record<string, any>; Relationships: [] }
    }
    Views: {
      admin_dashboard_stats: { Row: { pending_review_count: number | null; selected_count: number | null; mockups_ready_count: number | null; published_count: number | null; active_products_count: number | null; revenue_last_30_days: number | null; admin_revenue_last_30_days: number | null; creator_commissions_last_30_days: number | null; units_sold_last_30_days: number | null }; Relationships: [] }
      creator_earnings_summary: { Row: { creator_user_id: string | null; first_name: string | null; last_name: string | null; total_gross: number | null; total_earnings: number | null; pending_earnings: number | null; paid_earnings: number | null; total_sales: number | null; stripe_connect_account_id: string | null; stripe_onboarding_completed: boolean | null }; Relationships: [] }
    }
    Functions: {
      get_public_profile_fields: { Args: { profile_row: Database['public']['Tables']['profiles']['Row'] }; Returns: boolean }
    }
    Enums: {}
    CompositeTypes: {}
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  T extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"]) = keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
> = (DefaultSchema["Tables"] & DefaultSchema["Views"])[T] extends { Row: infer R } ? R : never

export type TablesInsert<
  T extends keyof DefaultSchema["Tables"] = keyof DefaultSchema["Tables"]
> = DefaultSchema["Tables"][T] extends { Insert: infer I } ? I : never

export type TablesUpdate<
  T extends keyof DefaultSchema["Tables"] = keyof DefaultSchema["Tables"]
> = DefaultSchema["Tables"][T] extends { Update: infer U } ? U : never
