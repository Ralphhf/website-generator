import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (supabaseInstance) {
    return supabaseInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
  return supabaseInstance
}

// Types for business profiles
export interface SavedProfile {
  id: string
  name: string
  business_type: string
  tagline: string | null
  description: string | null
  email: string | null
  phone: string | null
  city: string | null
  state: string | null
  data: Record<string, unknown> // Full BusinessInfo object
  created_at: string
  updated_at: string
}
