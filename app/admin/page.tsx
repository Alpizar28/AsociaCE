// @ts-nocheck – Supabase v2 strict generics on multi-table Promise.all reads
import { createClient } from '@/lib/supabase/server'
import { BookOpen, Newspaper, CalendarDays, Users, Flag } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
    const supabase = await createClient()

    const [
        { count: faqCount },
        { count: newsCount },
        { count: eventsCount },
        { count: contactsCount },
        { data: reports },
    ] = await Promise.all([
        supabase.from('faq_articles').select('*', { count: 'exact', head: true }),
        supabase.from('news_articles').select('*', { count: 'exact', head: true }),
        supabase.from('calendar_events').select('*', { count: 'exact', head: true }),
        supabase.from('contacts').select('*', { count: 'exact', head: true }),
        supabase.from('content_reports').select('*').order('created_at', { ascending: false }).limit(5),
    ])

    const stats = [
        { label: 'Preguntas', count: faqCount ?? 0, icon: BookOpen, href: '/admin/preguntas', color: '#dbeafe' },
        { label: 'Noticias', count: newsCount ?? 0, icon: Newspaper, href: '/admin/noticias', color: '#dcfce7' },
        { label: 'Eventos', count: eventsCount ?? 0, icon: CalendarDays, href: '/admin/calendario', color: '#fef9c3' },
        { label: 'Contactos', count: contactsCount ?? 0, icon: Users, href: '/admin/contactos', color: '#f3e8ff' },
    ]

    return (
        <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem' }}>Dashboard</h1>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
                {stats.map(({ label, count, icon: Icon, href, color }) => (
                    <Link key={href} href={href} style={{ display: 'block', background: 'white', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', padding: '1.25rem', textDecoration: 'none', transition: 'box-shadow 150ms ease' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div>
                                <div style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--color-text)' }}>{count}</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.125rem' }}>{label}</div>
                            </div>
                            <div style={{ background: color, borderRadius: 'var(--radius-sm)', padding: '8px' }}>
                                <Icon size={20} color="var(--color-primary)" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Recent reports */}
            <div style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 style={{ fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Flag size={15} color="var(--color-text-muted)" />
                        Reportes recientes
                    </h2>
                    <Link href="/admin/reportes" style={{ fontSize: '0.8rem', color: 'var(--color-primary)', textDecoration: 'none' }}>Ver todos</Link>
                </div>
                {reports && reports.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                        {reports.map((r) => (
                            <div key={r.id} style={{ padding: '0.75rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                                <div style={{ fontWeight: 500, marginBottom: '0.125rem' }}>[{r.page_type}] {r.message.slice(0, 80)}{r.message.length > 80 ? '…' : ''}</div>
                                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.72rem' }}>{new Date(r.created_at).toLocaleString('es-CR')}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>No hay reportes pendientes.</p>
                )}
            </div>
        </div>
    )
}
