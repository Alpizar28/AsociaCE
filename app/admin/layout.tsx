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

    // Middleware handles redirect, but double-check for safety
    if (!user) redirect('/admin/login')

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
            <AdminSidebar />
            <div style={{ flex: 1, overflow: 'auto' }}>
                <main style={{ padding: '2rem', maxWidth: '1100px' }}>{children}</main>
            </div>
        </div>
    )
}
