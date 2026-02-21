'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Search, BookOpen, Newspaper, Calendar, Phone } from 'lucide-react'
import Link from 'next/link'
import type { SearchResult } from '@/types/database'

type Tab = 'all' | 'faq' | 'news' | 'calendar' | 'contact'
const TABS: { id: Tab; label: string; icon: typeof Search }[] = [
    { id: 'all', label: 'Todo', icon: Search },
    { id: 'faq', label: 'Preguntas', icon: BookOpen },
    { id: 'news', label: 'Noticias', icon: Newspaper },
    { id: 'calendar', label: 'Calendario', icon: Calendar },
    { id: 'contact', label: 'Contactos', icon: Phone },
]

function SearchContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const q = searchParams.get('q') ?? ''
    const [query, setQuery] = useState(q)
    const [tab, setTab] = useState<Tab>('all')
    const [results, setResults] = useState<SearchResult[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!q) return
        const supabase = createClient()
        setLoading(true)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ; (supabase as any)
                .rpc('search_all', { query: q })
                .then(({ data }: { data: unknown }) => {
                    setResults((data as SearchResult[]) ?? [])
                    setLoading(false)
                })
    }, [q])

    function handleSearch(e: React.FormEvent) {
        e.preventDefault()
        if (!query.trim()) return
        router.push(`/buscar?q=${encodeURIComponent(query.trim())}`)
    }

    const filtered = tab === 'all'
        ? results
        : results.filter((r) => r.type === tab)

    function getHref(r: SearchResult) {
        if (r.type === 'faq') return `/preguntas/${r.slug}`
        if (r.type === 'news') return `/noticias/${r.slug}`
        if (r.type === 'calendar') return `/calendario`
        return `/contactos`
    }

    return (
        <div className="section-gap">
            <div className="container-page">
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Buscar</h1>

                {/* Search bar */}
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', maxWidth: '600px' }}>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar en el portal…"
                        className="input-field"
                        style={{ flex: 1 }}
                    />
                    <button type="submit" className="btn btn-primary">
                        <Search size={15} />
                        Buscar
                    </button>
                </form>

                {/* Tabs */}
                <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', marginBottom: '1.5rem', gap: '0', overflowX: 'auto' }}>
                    {TABS.map(({ id, label, icon: Icon }) => {
                        const count = id === 'all' ? results.length : results.filter((r) => r.type === id).length
                        return (
                            <button
                                key={id}
                                onClick={() => setTab(id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.375rem',
                                    padding: '0.625rem 1rem',
                                    background: 'none',
                                    border: 'none',
                                    borderBottom: `2px solid ${tab === id ? 'var(--color-primary)' : 'transparent'}`,
                                    color: tab === id ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                    fontWeight: tab === id ? 600 : 400,
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                    whiteSpace: 'nowrap',
                                    transition: 'color 150ms ease',
                                    marginBottom: '-1px',
                                }}
                            >
                                <Icon size={14} />
                                {label}
                                {q && <span style={{ background: tab === id ? 'var(--color-primary-light)' : 'var(--color-surface)', color: 'var(--color-text-muted)', fontSize: '0.7rem', padding: '0 5px', borderRadius: '9999px' }}>{count}</span>}
                            </button>
                        )
                    })}
                </div>

                {/* Results */}
                {!q && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                        <Search size={36} color="var(--color-border)" style={{ margin: '0 auto 0.75rem' }} />
                        <p>Escribe algo para buscar en el portal.</p>
                    </div>
                )}

                {q && loading && (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        Buscando…
                    </div>
                )}

                {q && !loading && filtered.length === 0 && (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        No se encontraron resultados para <strong>"{q}"</strong> en esta sección.
                    </div>
                )}

                {!loading && filtered.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                        {filtered.map((r) => {
                            const typeLabels: Record<string, string> = { faq: 'Pregunta', news: 'Noticia', calendar: 'Evento', contact: 'Contacto' }
                            return (
                                <Link
                                    key={`${r.type}-${r.id}`}
                                    href={getHref(r)}
                                    style={{ display: 'block', padding: '1rem', background: 'white', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', textDecoration: 'none', transition: 'box-shadow 150ms ease' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-primary)', background: 'var(--color-primary-light)', padding: '1px 6px', borderRadius: '4px' }}>
                                            {typeLabels[r.type]}
                                        </span>
                                        {r.published_at && (
                                            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                                                {new Date(r.published_at).toLocaleDateString('es-CR', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text)', marginBottom: '0.25rem' }}>{r.title}</div>
                                    {r.excerpt && <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{r.excerpt}</p>}
                                </Link>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default function BuscarPage() {
    return <Suspense><SearchContent /></Suspense>
}
