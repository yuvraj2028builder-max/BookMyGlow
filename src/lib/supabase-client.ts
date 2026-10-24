import { createClient } from '@supabase/supabase-js'

// Single shared Supabase client for browser-side usage
// Avoids "multiple GoTrueClient instances" warning

let _client: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (!_client) {
    _client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return _client
}
