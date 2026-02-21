import AdminSidebar from '@/components/layout/AdminSidebar'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    try {
        const supabase = await createClient()
        const {
            data: { user },
            error: userError
        } = await supabase.auth.getUser()

        if (userError || !user) {
            redirect('/admin/login')
        }

        // Validate against allowlist
        const { data: allowed, error: allowlistError } = await supabase
            .from('admins_allowlist')
            .select('email')
            .eq('email', user.email ?? '')
            .single()

        if (allowlistError || !allowed) {
            redirect('/admin/login?error=unauthorized')
        }

        return (
            <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
                <AdminSidebar />
                <div style={{ flex: 1, overflow: 'auto' }}>
                    <main style={{ padding: '2rem', maxWidth: '1100px' }}>{children}</main>
                </div>
            </div>
        )
    } catch (error: any) {
        // Next.js uses internal errors for redirect() and notFound().
        // We should not catch them as critical errors.
        if (error?.digest?.startsWith('NEXT_REDIRECT')) {
            throw error;
        }
        console.error('Critical AdminLayout error:', error)
        redirect('/admin/login?error=system_error')
    }
}
