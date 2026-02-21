import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// This route handles the redirect from Supabase after Google OAuth
export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const origin = requestUrl.origin

    if (code) {
        const supabase = await createClient()
        await supabase.auth.exchangeCodeForSession(code)
    }

    // Middleware will verify allowlist and redirect to /admin/login?error=unauthorized if needed
    return NextResponse.redirect(`${origin}/admin`)
}
