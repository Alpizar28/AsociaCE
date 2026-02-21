'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
    LayoutDashboard,
    BookOpen,
    Newspaper,
    CalendarDays,
    Users,
    Flag,
    LogOut,
    ChevronRight,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { APP_NAME } from '@/lib/constants'

const NAV_ITEMS = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Preguntas', href: '/admin/preguntas', icon: BookOpen },
    { label: 'Noticias', href: '/admin/noticias', icon: Newspaper },
    { label: 'Calendario', href: '/admin/calendario', icon: CalendarDays },
    { label: 'Contactos', href: '/admin/contactos', icon: Users },
    { label: 'Reportes', href: '/admin/reportes', icon: Flag },
]

export default function AdminSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    async function handleSignOut() {
        await supabase.auth.signOut()
        router.push('/admin/login')
        router.refresh()
    }

    return (
        <aside
            style={{
                width: '240px',
                minHeight: '100vh',
                background: '#0f172a',
                color: '#94a3b8',
                display: 'flex',
                flexDirection: 'column',
                flexShrink: 0,
                position: 'sticky',
                top: 0,
                height: '100vh',
                overflowY: 'auto',
            }}
        >
            {/* Brand */}
            <div
                style={{
                    padding: '1.25rem 1rem',
                    borderBottom: '1px solid rgba(255,255,255,0.07)',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                        style={{
                            background: 'var(--color-primary)',
                            color: 'white',
                            borderRadius: '6px',
                            padding: '2px 8px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                        }}
                    >
                        CE
                    </span>
                    <div>
                        <div style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>
                            {APP_NAME}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#475569' }}>Panel Admin</div>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, padding: '0.75rem 0' }}>
                {NAV_ITEMS.map((item) => {
                    const isActive = item.exact
                        ? pathname === item.href
                        : pathname.startsWith(item.href)
                    const Icon = item.icon
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.625rem',
                                padding: '0.625rem 1rem',
                                margin: '0.125rem 0.5rem',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '0.875rem',
                                fontWeight: isActive ? 600 : 400,
                                color: isActive ? 'white' : '#94a3b8',
                                background: isActive ? 'rgba(29,78,216,0.3)' : 'transparent',
                                textDecoration: 'none',
                                transition: 'color 150ms ease, background 150ms ease',
                            }}
                        >
                            <Icon size={16} />
                            {item.label}
                            {isActive && (
                                <ChevronRight size={14} style={{ marginLeft: 'auto' }} />
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Sign out */}
            <div style={{ padding: '0.75rem 0.5rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <button
                    onClick={handleSignOut}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.625rem',
                        width: '100%',
                        padding: '0.625rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.875rem',
                        color: '#94a3b8',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'color 150ms ease',
                    }}
                    onMouseEnter={(e) => {
                        const el = e.currentTarget
                        el.style.color = '#f87171'
                        el.style.background = 'rgba(239,68,68,0.1)'
                    }}
                    onMouseLeave={(e) => {
                        const el = e.currentTarget
                        el.style.color = '#94a3b8'
                        el.style.background = 'none'
                    }}
                >
                    <LogOut size={16} />
                    Cerrar sesión
                </button>
            </div>
        </aside>
    )
}
