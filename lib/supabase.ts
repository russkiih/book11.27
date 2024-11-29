import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// This client should only be used in edge functions or server components
// For client components, use createClientComponentClient from @supabase/auth-helpers-nextjs
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Type for the services table
export type Service = Database['public']['Tables']['services']['Row'] 