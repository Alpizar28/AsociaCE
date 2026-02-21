import AdminSidebar from '@/components/layout/AdminSidebar'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) redirect('/admin/login')

    // Validate against allowlist (Moved from middleware for performance)
    const { data: allowed } = await supabase
        .from('admins_allowlist')
        .select('email')
        .eq('email', user.email ?? '')
        .single()

    if (!allowed) {
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
}
