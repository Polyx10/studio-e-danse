import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Debug: afficher les clés dans la console
console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key (first 20 chars):', supabaseAnonKey.substring(0, 20))

// Le client Supabase sera créé uniquement si les vraies clés sont configurées
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  },
  global: {
    headers: {
      'Content-Type': 'application/json'
    }
  }
})
