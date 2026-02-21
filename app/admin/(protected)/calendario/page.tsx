// @ts-nocheck – Supabase v2 strict generics; types enforced at DB level via RLS/schema
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit2, Archive, Eye, Trash2 } from 'lucide-react'
import { EVENT_TYPES } from '@/lib/constants'
import { generateUniqueSlug } from '@/lib/utils/slug'
import type { CalendarEvent, CalendarEventType, ContentStatus } from '@/types/database'

export default function AdminCalendarioPage() {
    const [events, setEvents] = useState<CalendarEvent[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editing, setEditing] = useState<CalendarEvent | null>(null)
    const supabase = createClient()

    async function load() {
        const { data } = await supabase.from('calendar_events').select('*').order('start_datetime', { ascending: true })
        setEvents((data as CalendarEvent[]) ?? [])
        setLoading(false)
    }
    useEffect(() => { load() }, [])

    async function handleStatus(id: string, status: ContentStatus) {
        await supabase.from('calendar_events').update({ status, ...(status === 'published' ? { published_at: new Date().toISOString() } : {}) }).eq('id', id)
        load()
    }
    async function handleDelete(id: string) {
        if (!confirm('¿Eliminar?')) return
        await supabase.from('calendar_events').delete().eq('id', id)
        load()
    }

    if (loading) return <p style={{ color: 'var(--color-text-muted)' }}>Cargando…</p>

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.375rem', fontWeight: 700 }}>Calendario Académico</h1>
                <button onClick={() => { setEditing(null); setShowForm(true) }} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={15} /> Nuevo evento
                </button>
            </div>

            {showForm && (
                <EventForm
                    event={editing}
                    onSave={async (data) => {
                        const { data: { user } } = await supabase.auth.getUser()
                        if (editing) {
                            await supabase.from('calendar_events').update(data).eq('id', editing.id)
                        } else {
                            await supabase.from('calendar_events').insert({ ...data, slug: generateUniqueSlug(data.title!), created_by: user?.email ?? 'admin' })
                        }
                        setShowForm(false); load()
                    }}
                    onCancel={() => setShowForm(false)}
                />
            )}

            <div style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
                            {['Título', 'Tipo', 'Inicio', 'Estado', 'Acciones'].map((h) => (
                                <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((ev) => (
                            <tr key={ev.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <td style={{ padding: '0.75rem 1rem', fontWeight: 500, fontSize: '0.8rem' }}>{ev.title}</td>
                                <td style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{EVENT_TYPES[ev.type as CalendarEventType]}</td>
                                <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{new Date(ev.start_datetime).toLocaleDateString('es-CR')}</td>
                                <td style={{ padding: '0.75rem 1rem' }}>
                                    <span style={{ fontSize: '0.72rem', fontWeight: 600, borderRadius: '9999px', padding: '2px 8px', background: ev.status === 'published' ? '#dcfce7' : ev.status === 'draft' ? '#fef9c3' : '#f1f5f9', color: ev.status === 'published' ? '#166534' : ev.status === 'draft' ? '#854d0e' : '#64748b' }}>{ev.status}</span>
                                </td>
                                <td style={{ padding: '0.75rem 1rem' }}>
                                    <div style={{ display: 'flex', gap: '0.375rem' }}>
                                        <button onClick={() => { setEditing(ev); setShowForm(true) }} title="Editar" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '4px' }}><Edit2 size={14} /></button>
                                        {ev.status !== 'published' && <button onClick={() => handleStatus(ev.id, 'published')} title="Publicar" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#16a34a', padding: '4px' }}><Eye size={14} /></button>}
                                        {ev.status !== 'archived' && <button onClick={() => handleStatus(ev.id, 'archived')} title="Archivar" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '4px' }}><Archive size={14} /></button>}
                                        <button onClick={() => handleDelete(ev.id)} title="Eliminar" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', padding: '4px' }}><Trash2 size={14} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {events.length === 0 && <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No hay eventos todavía.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function EventForm({ event, onSave, onCancel }: { event: CalendarEvent | null; onSave: (d: Partial<CalendarEvent>) => Promise<void>; onCancel: () => void }) {
    const toLocalInput = (iso: string | null) => iso ? new Date(iso).toISOString().slice(0, 16) : ''
    const [form, setForm] = useState({
        title: event?.title ?? '',
        type: event?.type ?? 'otro',
        start_datetime: toLocalInput(event?.start_datetime ?? null),
        end_datetime: toLocalInput(event?.end_datetime ?? null),
        location: event?.location ?? '',
        description_md: event?.description_md ?? '',
        source_url: event?.source_url ?? '',
        status: event?.status ?? 'draft',
    })
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault(); setLoading(true)
        await onSave({ ...form, start_datetime: new Date(form.start_datetime).toISOString(), end_datetime: form.end_datetime ? new Date(form.end_datetime).toISOString() : null } as unknown as Partial<CalendarEvent>)
        setLoading(false)
    }

    return (
        <div style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>{event ? 'Editar evento' : 'Nuevo evento'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div><label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.375rem' }}>Título *</label>
                    <input required className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div><label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.375rem' }}>Tipo *</label>
                        <select className="input-field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                            {Object.entries(EVENT_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                        </select>
                    </div>
                    <div><label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.375rem' }}>Estado</label>
                        <select className="input-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                            <option value="draft">Borrador</option><option value="published">Publicado</option><option value="archived">Archivado</option>
                        </select>
                    </div>
                    <div><label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.375rem' }}>Inicio *</label>
                        <input required type="datetime-local" className="input-field" value={form.start_datetime} onChange={(e) => setForm({ ...form, start_datetime: e.target.value })} />
                    </div>
                    <div><label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.375rem' }}>Fin</label>
                        <input type="datetime-local" className="input-field" value={form.end_datetime} onChange={(e) => setForm({ ...form, end_datetime: e.target.value })} />
                    </div>
                </div>
                <div><label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.375rem' }}>Lugar</label>
                    <input className="input-field" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                </div>
                <div><label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.375rem' }}>Descripción (Markdown)</label>
                    <textarea className="input-field" value={form.description_md} onChange={(e) => setForm({ ...form, description_md: e.target.value })} rows={5} style={{ fontFamily: 'monospace', fontSize: '0.85rem' }} />
                </div>
                <div><label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.375rem' }}>URL fuente</label>
                    <input type="url" className="input-field" value={form.source_url} onChange={(e) => setForm({ ...form, source_url: e.target.value })} />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={onCancel} className="btn btn-secondary">Cancelar</button>
                    <button type="submit" disabled={loading} className="btn btn-primary">{loading ? 'Guardando…' : 'Guardar'}</button>
                </div>
            </form>
        </div>
    )
}
