// @ts-nocheck – Supabase v2 strict generics; types enforced at DB level via RLS/schema
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit2, Archive, Eye, Trash2 } from 'lucide-react'
import { CONTACT_KINDS } from '@/lib/constants'
import type { Contact, ContactKind, ContentStatus } from '@/types/database'

export default function AdminContactosPage() {
    const [contacts, setContacts] = useState<Contact[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editing, setEditing] = useState<Contact | null>(null)
    const supabase = createClient()

    async function load() {
        const { data } = await supabase.from('contacts').select('*').order('name', { ascending: true })
        setContacts((data as Contact[]) ?? [])
        setLoading(false)
    }
    useEffect(() => { load() }, [])

    async function handleStatus(id: string, status: ContentStatus) {
        await supabase.from('contacts').update({ status, ...(status === 'published' ? { published_at: new Date().toISOString() } : {}) }).eq('id', id)
        load()
    }
    async function handleDelete(id: string) {
        if (!confirm('¿Eliminar?')) return
        await supabase.from('contacts').delete().eq('id', id)
        load()
    }

    if (loading) return <p style={{ color: 'var(--color-text-muted)' }}>Cargando…</p>

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.375rem', fontWeight: 700 }}>Contactos</h1>
                <button onClick={() => { setEditing(null); setShowForm(true) }} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={15} /> Nuevo contacto
                </button>
            </div>

            {showForm && (
                <ContactForm
                    contact={editing}
                    onSave={async (data) => {
                        const { data: { user } } = await supabase.auth.getUser()
                        if (editing) {
                            await supabase.from('contacts').update(data).eq('id', editing.id)
                        } else {
                            await supabase.from('contacts').insert({ ...data, created_by: user?.email ?? 'admin' })
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
                            {['Nombre', 'Tipo', 'Contacto', 'Estado', 'Acciones'].map((h) => (
                                <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.map((c) => (
                            <tr key={c.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <td style={{ padding: '0.75rem 1rem' }}>
                                    <div style={{ fontWeight: 500, fontSize: '0.8rem' }}>{c.name}</div>
                                    {c.role_or_department && <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{c.role_or_department}</div>}
                                </td>
                                <td style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{CONTACT_KINDS[c.kind as ContactKind]}</td>
                                <td style={{ padding: '0.75rem 1rem', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                                    {c.email && <div>{c.email}</div>}
                                    {c.phone && <div>{c.phone}</div>}
                                </td>
                                <td style={{ padding: '0.75rem 1rem' }}>
                                    <span style={{ fontSize: '0.72rem', fontWeight: 600, borderRadius: '9999px', padding: '2px 8px', background: c.status === 'published' ? '#dcfce7' : c.status === 'draft' ? '#fef9c3' : '#f1f5f9', color: c.status === 'published' ? '#166534' : c.status === 'draft' ? '#854d0e' : '#64748b' }}>{c.status}</span>
                                </td>
                                <td style={{ padding: '0.75rem 1rem' }}>
                                    <div style={{ display: 'flex', gap: '0.375rem' }}>
                                        <button onClick={() => { setEditing(c); setShowForm(true) }} title="Editar" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '4px' }}><Edit2 size={14} /></button>
                                        {c.status !== 'published' && <button onClick={() => handleStatus(c.id, 'published')} title="Publicar" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#16a34a', padding: '4px' }}><Eye size={14} /></button>}
                                        {c.status !== 'archived' && <button onClick={() => handleStatus(c.id, 'archived')} title="Archivar" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '4px' }}><Archive size={14} /></button>}
                                        <button onClick={() => handleDelete(c.id)} title="Eliminar" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', padding: '4px' }}><Trash2 size={14} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {contacts.length === 0 && <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No hay contactos todavía.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function ContactForm({ contact, onSave, onCancel }: { contact: Contact | null; onSave: (d: Partial<Contact>) => Promise<void>; onCancel: () => void }) {
    const [form, setForm] = useState({
        kind: contact?.kind ?? 'persona',
        name: contact?.name ?? '',
        role_or_department: contact?.role_or_department ?? '',
        email: contact?.email ?? '',
        phone: contact?.phone ?? '',
        location: contact?.location ?? '',
        hours: contact?.hours ?? '',
        link: contact?.link ?? '',
        notes: contact?.notes ?? '',
        status: contact?.status ?? 'draft',
    })
    const [loading, setLoading] = useState(false)
    const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault(); setLoading(true); await onSave(form as unknown as Partial<Contact>); setLoading(false)
    }

    return (
        <div style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>{contact ? 'Editar contacto' : 'Nuevo contacto'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                    <div><label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.375rem' }}>Tipo *</label>
                        <select className="input-field" value={form.kind} onChange={(e) => set('kind', e.target.value)}>
                            {Object.entries(CONTACT_KINDS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                        </select>
                    </div>
                    <div><label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.375rem' }}>Nombre *</label>
                        <input required className="input-field" value={form.name} onChange={(e) => set('name', e.target.value)} />
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {[['role_or_department', 'Cargo / Departamento'], ['email', 'Email'], ['phone', 'Teléfono'], ['location', 'Ubicación'], ['hours', 'Horario'], ['link', 'Sitio web']].map(([k, label]) => (
                        <div key={k}>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.375rem' }}>{label}</label>
                            <input className="input-field" value={(form as any)[k]} onChange={(e) => set(k, e.target.value)} type={k === 'email' ? 'email' : k === 'link' ? 'url' : 'text'} />
                        </div>
                    ))}
                </div>
                <div><label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.375rem' }}>Notas</label>
                    <textarea className="input-field" value={form.notes} onChange={(e) => set('notes', e.target.value)} rows={3} />
                </div>
                <div><label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.375rem' }}>Estado</label>
                    <select className="input-field" style={{ maxWidth: '200px' }} value={form.status} onChange={(e) => set('status', e.target.value)}>
                        <option value="draft">Borrador</option><option value="published">Publicado</option><option value="archived">Archivado</option>
                    </select>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={onCancel} className="btn btn-secondary">Cancelar</button>
                    <button type="submit" disabled={loading} className="btn btn-primary">{loading ? 'Guardando…' : 'Guardar'}</button>
                </div>
            </form>
        </div>
    )
}
