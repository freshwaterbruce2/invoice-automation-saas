import { createClient } from '@supabase/supabase-js'

// These should be in environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types (generate these from Supabase)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          company_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          company_name?: string | null
        }
        Update: {
          email?: string
          full_name?: string | null
          company_name?: string | null
        }
      }
      invoices: {
        Row: {
          id: string
          user_id: string
          invoice_number: string
          client_id: string
          issue_date: string
          due_date: string
          subtotal: number
          tax: number
          total: number
          status: 'draft' | 'sent' | 'paid' | 'overdue'
          notes: string | null
          terms: string | null
          currency: string
          recurring: any | null
          parent_invoice_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['invoices']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['invoices']['Insert']>
      }
      clients: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string
          phone: string | null
          company: string | null
          address: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['clients']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['clients']['Insert']>
      }
      invoice_items: {
        Row: {
          id: string
          invoice_id: string
          description: string
          quantity: number
          price: number
          total: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['invoice_items']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['invoice_items']['Insert']>
      }
    }
  }
}