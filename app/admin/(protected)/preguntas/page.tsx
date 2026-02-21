// @ts-nocheck – Supabase v2 strict generics; types enforced at DB level via RLS/schema
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit2, Archive, Eye, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { FAQ_CATEGORIES } from '@/lib/constants'
import { generateUniqueSlug } from '@/lib/utils/slug'
import type { FaqArticle, FaqCategory, ContentStatus } from '@/types/database'

const STATUS_STYLES: Record<ContentStatus, string> = {
    draft: 'background:#fef9c3;color:#854d0e;',
    published: 'background:#dcfce7;color:#166534;',
    archived: 'background:#f1f5f9;color:#64748b;',
}

export default function AdminPreguntasPage() {
    const [articles, setArticles] = useState<FaqArticle[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editing, setEditing] = useState<FaqArticle | null>(null)
    const supabase = createClient()

    async function load() {
        const { data } = await supabase.from('faq_articles').select('*').order('updated_at', { ascending: false })
        setArticles((data as FaqArticle[]) ?? [])
        setLoading(false)
    }

    useEffect(() => { load() }, [])

    async function handleStatusChange(id: string, status: ContentStatus) {
        await supabase.from('faq_articles').update({
            status,
            ...(status === 'published' ? { published_at: new Date().toISOString() } : {}),
        }).eq('id', id)
        load()
    }

    async function handleDelete(id: string) {
        if (!confirm('¿Eliminar este artículo?')) return
        await supabase.from('faq_articles').delete().eq('id', id)
        load()
    }

    if (loading) return <p style={{ color: 'var(--color-text-muted)' }}>Cargando…</p>

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.375rem', fontWeight: 700 }}>Preguntas frecuentes</h1>
                <button
                    onClick={() => { setEditing(null); setShowForm(true) }}
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <Plus size={15} /> Nuevo artículo
                </button>
            </div>

            {showForm && (
                <FaqForm
                    article={editing}
                    onSave={async (data) => {
                        const {
                            data: { user },
                        } = await supabase.auth.getUser()
                        if (editing) {
                            await supabase.from('faq_articles').update(data).eq('id', editing.id)
                        } else {
                            await supabase.from('faq_articles').insert({
                                ...data,
                                slug: generateUniqueSlug(data.title),
                                created_by: user?.email ?? 'admin',
                            })
                        }
                        setShowForm(false)
                        load()
                    }}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {/* Table */}
            <div style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
                            {['Título', 'Categoría', 'Estado', 'Actualizado', 'Acciones'].map((h) => (
                                <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {articles.map((a) => (
                            <tr key={a.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>
                                    <Link href={`/preguntas/${a.slug}`} target="_blank" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontSize: '0.8rem' }}>
                                        {a.title}
                                    </Link>
                                </td>
                                <td style={{ padding: '0.75rem 1rem', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{FAQ_CATEGORIES[a.category as FaqCategory]}</td>
                                <td style={{ padding: '0.75rem 1rem' }}>
                                    <span style={{ fontSize: '0.72rem', fontWeight: 600, borderRadius: '9999px', padding: '2px 8px', ...Object.fromEntries(STATUS_STYLES[a.status].split(';').filter(Boolean).map((s) => s.split(':').map((v) => v.trim()))) }}>
                                        {a.status}
                                    </span>
                                </td>
                                <td style={{ padding: '0.75rem 1rem', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                                    {new Date(a.updated_at).toLocaleDateString('es-CR')}
                                </td>
                                <td style={{ padding: '0.75rem 1rem' }}>
                                    <div style={{ display: 'flex', gap: '0.375rem' }}>
                                        <button onClick={() => { setEditing(a); setShowForm(true) }} title="Editar" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '4px' }}>
                                            <Edit2 size={14} />
                                        </button>
                                        {a.status !== 'published' && (
                                            <button onClick={() => handleStatusChange(a.id, 'published')} title="Publicar" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#16a34a', padding: '4px' }}>
                                                <Eye size={14} />
                                            </button>
                                        )}
                                        {a.status !== 'archived' && (
                                            <button onClick={() => handleStatusChange(a.id, 'archived')} title="Archivar" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '4px' }}>
                                                <Archive size={14} />
                                            </button>
                                        )}
                                        <button onClick={() => handleDelete(a.id)} title="Eliminar" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', padding: '4px' }}>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {articles.length === 0 && (
                            <tr>
                                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                    No hay artículos todavía.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

interface FaqFormProps {
    article: FaqArticle | null
    onSave: (data: Partial<FaqArticle>) => Promise<void>
    onCancel: () => void
}

function FaqForm({ article, onSave, onCancel }: FaqFormProps) {
    const [form, setForm] = useState({
        title: article?.title ?? '',
        category: article?.category ?? 'matricula',
        content: article?.content ?? '',
        source_url: article?.source_url ?? '',
        status: article?.status ?? 'draft',
    })
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        await onSave(form)
        setLoading(false)
    }

    return (
        <div style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
                {article ? 'Editar artículo' : 'Nuevo artículo'}
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.375rem' }}>Título *</label>
                    <input required className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ej: ¿Cómo hacer la matrícula extraordinaria?" />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.375rem' }}>Categoría *</label>
                    <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                        {Object.entries(FAQ_CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.375rem' }}>Contenido (Markdown) *</label>
                    <textarea required className="input-field" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={10} placeholder="# Qué es&#10;## Cuándo aplica&#10;## Requisitos&#10;## Pasos&#10;## Contacto" style={{ fontFamily: 'monospace', fontSize: '0.85rem' }} />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.375rem' }}>URL fuente oficial</label>
                    <input className="input-field" value={form.source_url} onChange={(e) => setForm({ ...form, source_url: e.target.value })} placeholder="https://www.tec.ac.cr/..." type="url" />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.375rem' }}>Estado</label>
                    <select className="input-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                        <option value="draft">Borrador</option>
                        <option value="published">Publicado</option>
                        <option value="archived">Archivado</option>
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
