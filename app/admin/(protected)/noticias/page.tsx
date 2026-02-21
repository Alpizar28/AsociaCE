// @ts-nocheck – Supabase v2 strict generics; types enforced at DB level via RLS/schema
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit2, Archive, Eye, Trash2, Pin } from 'lucide-react'
import Link from 'next/link'
import { generateUniqueSlug } from '@/lib/utils/slug'
import type { NewsArticle, ContentStatus } from '@/types/database'

export default function AdminNoticiasPage() {
    const [articles, setArticles] = useState<NewsArticle[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editing, setEditing] = useState<NewsArticle | null>(null)
    const supabase = createClient()

    async function load() {
        const { data } = await supabase.from('news_articles').select('*').order('updated_at', { ascending: false })
        setArticles((data as NewsArticle[]) ?? [])
        setLoading(false)
    }

    useEffect(() => { load() }, [])

    async function handleStatus(id: string, status: ContentStatus) {
        await supabase.from('news_articles').update({ status, ...(status === 'published' ? { published_at: new Date().toISOString() } : {}) }).eq('id', id)
        load()
    }
    async function handlePin(id: string, pinned: boolean) {
        await supabase.from('news_articles').update({ pinned }).eq('id', id)
        load()
    }
    async function handleDelete(id: string) {
        if (!confirm('¿Eliminar?')) return
        await supabase.from('news_articles').delete().eq('id', id)
        load()
    }

    if (loading) return <p style={{ color: 'var(--color-text-muted)' }}>Cargando…</p>

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.375rem', fontWeight: 700 }}>Noticias</h1>
                <button onClick={() => { setEditing(null); setShowForm(true) }} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={15} /> Nueva noticia
                </button>
            </div>

            {showForm && (
                <NewsForm
                    article={editing}
                    onSave={async (data) => {
                        const { data: { user } } = await supabase.auth.getUser()
                        if (editing) {
                            await supabase.from('news_articles').update(data).eq('id', editing.id)
                        } else {
                            await supabase.from('news_articles').insert({ ...data, slug: generateUniqueSlug(data.title!), created_by: user?.email ?? 'admin' })
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
                            {['Título', 'Estado', 'Destacado', 'Publicado', 'Acciones'].map((h) => (
                                <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {articles.map((a) => (
                            <tr key={a.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>
                                    <Link href={`/noticias/${a.slug}`} target="_blank" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontSize: '0.8rem' }}>{a.title}</Link>
                                </td>
                                <td style={{ padding: '0.75rem 1rem' }}>
                                    <span style={{ fontSize: '0.72rem', fontWeight: 600, borderRadius: '9999px', padding: '2px 8px', background: a.status === 'published' ? '#dcfce7' : a.status === 'draft' ? '#fef9c3' : '#f1f5f9', color: a.status === 'published' ? '#166534' : a.status === 'draft' ? '#854d0e' : '#64748b' }}>
                                        {a.status}
                                    </span>
                                </td>
                                <td style={{ padding: '0.75rem 1rem' }}>
                                    <button onClick={() => handlePin(a.id, !a.pinned)} title={a.pinned ? 'Quitar destacado' : 'Destacar'} style={{ background: 'none', border: 'none', cursor: 'pointer', color: a.pinned ? 'var(--color-primary)' : 'var(--color-border)', padding: '4px' }}>
                                        <Pin size={14} />
                                    </button>
                                </td>
                                <td style={{ padding: '0.75rem 1rem', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                                    {a.published_at ? new Date(a.published_at).toLocaleDateString('es-CR') : '—'}
                                </td>
                                <td style={{ padding: '0.75rem 1rem' }}>
                                    <div style={{ display: 'flex', gap: '0.375rem' }}>
                                        <button onClick={() => { setEditing(a); setShowForm(true) }} title="Editar" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '4px' }}><Edit2 size={14} /></button>
                                        {a.status !== 'published' && <button onClick={() => handleStatus(a.id, 'published')} title="Publicar" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#16a34a', padding: '4px' }}><Eye size={14} /></button>}
                                        {a.status !== 'archived' && <button onClick={() => handleStatus(a.id, 'archived')} title="Archivar" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '4px' }}><Archive size={14} /></button>}
                                        <button onClick={() => handleDelete(a.id)} title="Eliminar" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', padding: '4px' }}><Trash2 size={14} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {articles.length === 0 && <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No hay noticias todavía.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function NewsForm({ article, onSave, onCancel }: { article: NewsArticle | null; onSave: (d: Partial<NewsArticle>) => Promise<void>; onCancel: () => void }) {
    const [form, setForm] = useState({ title: article?.title ?? '', content_md: article?.content_md ?? '', source_url: article?.source_url ?? '', pinned: article?.pinned ?? false, status: article?.status ?? 'draft' })
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault(); setLoading(true); await onSave(form); setLoading(false)
    }

    return (
        <div style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>{article ? 'Editar noticia' : 'Nueva noticia'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div><label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.375rem' }}>Título *</label>
                    <input required className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </div>
                <div><label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.375rem' }}>Contenido (Markdown) *</label>
                    <textarea required className="input-field" value={form.content_md} onChange={(e) => setForm({ ...form, content_md: e.target.value })} rows={8} style={{ fontFamily: 'monospace', fontSize: '0.85rem' }} />
                </div>
                <div><label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.375rem' }}>URL fuente</label>
                    <input className="input-field" value={form.source_url} onChange={(e) => setForm({ ...form, source_url: e.target.value })} type="url" />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1 }}><label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.375rem' }}>Estado</label>
                        <select className="input-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                            <option value="draft">Borrador</option><option value="published">Publicado</option><option value="archived">Archivado</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '0.125rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                            <input type="checkbox" checked={form.pinned} onChange={(e) => setForm({ ...form, pinned: e.target.checked })} /> Destacar
                        </label>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={onCancel} className="btn btn-secondary">Cancelar</button>
                    <button type="submit" disabled={loading} className="btn btn-primary">{loading ? 'Guardando…' : 'Guardar'}</button>
                </div>
            </form>
        </div>
    )
}
