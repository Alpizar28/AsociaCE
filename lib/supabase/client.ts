/**
 * Browser-side Supabase client (singleton pattern).
 * Only used in Client Components.
 */
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error('Supabase environment variables are missing')
        // Return a dummy client or handle as needed
    }

    return createBrowserClient<Database>(
        supabaseUrl!,
        supabaseAnonKey!
    )
}
