// @ts-nocheck – Supabase v2 strict generics on content_reports read
import { createClient } from '@/lib/supabase/server'
import { Flag, Trash2 } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Reportes' }

export default async function AdminReportesPage() {
    const supabase = await createClient()
    const { data: reports } = await supabase
        .from('content_reports')
        .select('*')
        .order('created_at', { ascending: false })

    const typeLabels: Record<string, string> = { faq: 'Pregunta', news: 'Noticia', calendar: 'Evento', contact: 'Contacto' }

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <Flag size={20} color="var(--color-text-muted)" />
                <h1 style={{ fontSize: '1.375rem', fontWeight: 700 }}>Reportes de contenido</h1>
            </div>

            <div style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
                            {['Tipo', 'Mensaje', 'Fecha'].map((h) => (
                                <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {reports?.map((r) => (
                            <tr key={r.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <td style={{ padding: '0.75rem 1rem' }}>
                                    <span style={{ fontSize: '0.72rem', fontWeight: 600, background: 'var(--color-primary-light)', color: 'var(--color-primary)', padding: '2px 8px', borderRadius: '4px' }}>
                                        {typeLabels[r.page_type]}
                                    </span>
                                </td>
                                <td style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: 'var(--color-text)', maxWidth: '400px' }}>
                                    {r.message}
                                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '0.125rem' }}>ID: {r.page_id}</div>
                                </td>
                                <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                                    {new Date(r.created_at).toLocaleString('es-CR')}
                                </td>
                            </tr>
                        ))}
                        {(!reports || reports.length === 0) && (
                            <tr><td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No hay reportes pendientes. ✅</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
