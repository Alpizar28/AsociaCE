/**
 * Middleware Supabase client – refreshes session tokens.
 * Only used inside middleware.ts.
 */
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/database'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({ request })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Refresh session
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Protect /admin/** routes (except /admin/login)
    const { pathname } = request.nextUrl

    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
        if (!user) {
            const loginUrl = request.nextUrl.clone()
            loginUrl.pathname = '/admin/login'
            return NextResponse.redirect(loginUrl)
        }

        // Validate against allowlist
        const { data: allowed } = await supabase
            .from('admins_allowlist')
            .select('email')
            .eq('email', user.email ?? '')
            .single()

        if (!allowed) {
            const loginUrl = request.nextUrl.clone()
            loginUrl.pathname = '/admin/login'
            loginUrl.searchParams.set('error', 'unauthorized')
            return NextResponse.redirect(loginUrl)
        }
    }

    // Redirect authenticated+allowed user away from login page
    if (pathname === '/admin/login' && user) {
        const { data: allowed } = await supabase
            .from('admins_allowlist')
            .select('email')
            .eq('email', user.email ?? '')
            .single()

        if (allowed) {
            const dashboardUrl = request.nextUrl.clone()
            dashboardUrl.pathname = '/admin'
            return NextResponse.redirect(dashboardUrl)
        }
    }

    return supabaseResponse
}
