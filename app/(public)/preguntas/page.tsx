// @ts-nocheck – Supabase v2 query chain type narrowing on faq_articles
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { BookOpen, Tag } from 'lucide-react'
import { FAQ_CATEGORIES } from '@/lib/constants'
import type { FaqCategory } from '@/types/database'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Preguntas Frecuentes',
    description: 'Base de conocimiento de Ingeniería en Computadores: matrícula, trámites, becas, graduación y más.',
}

interface Props {
    searchParams: Promise<{ cat?: string }>
}

export default async function PreguntasPage({ searchParams }: Props) {
    const { cat } = await searchParams
    const category = cat as FaqCategory | undefined
    const supabase = await createClient()

    let query = supabase
        .from('faq_articles')
        .select('id, title, slug, category, updated_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false })

    if (category && Object.keys(FAQ_CATEGORIES).includes(category)) {
        query = query.eq('category', category)
    }

    const { data: articles } = await query

    return (
        <div className="section-gap">
            <div className="container-page">
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                        Base de conocimiento
                    </h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>
                        Respuestas a las preguntas más comunes de estudiantes de IC.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '2rem' }}>
                    {/* Sidebar – category filter */}
                    <aside>
                        <div
                            style={{
                                background: 'white',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius)',
                                overflow: 'hidden',
                            }}
                        >
                            <div
                                style={{
                                    padding: '0.75rem 1rem',
                                    background: 'var(--color-surface)',
                                    borderBottom: '1px solid var(--color-border)',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    color: 'var(--color-text-muted)',
                                }}
                            >
                                Categorías
                            </div>
                            <nav>
                                <Link
                                    href="/preguntas"
                                    style={{
                                        display: 'block',
                                        padding: '0.625rem 1rem',
                                        fontSize: '0.875rem',
                                        color: !category ? 'var(--color-primary)' : 'var(--color-text)',
                                        background: !category ? 'var(--color-primary-light)' : 'transparent',
                                        textDecoration: 'none',
                                        fontWeight: !category ? 600 : 400,
                                        borderBottom: '1px solid var(--color-border)',
                                    }}
                                >
                                    Todas
                                </Link>
                                {Object.entries(FAQ_CATEGORIES).map(([key, label]) => (
                                    <Link
                                        key={key}
                                        href={`/preguntas?cat=${key}`}
                                        style={{
                                            display: 'block',
                                            padding: '0.625rem 1rem',
                                            fontSize: '0.875rem',
                                            color: category === key ? 'var(--color-primary)' : 'var(--color-text)',
                                            background: category === key ? 'var(--color-primary-light)' : 'transparent',
                                            textDecoration: 'none',
                                            fontWeight: category === key ? 600 : 400,
                                            borderBottom: '1px solid var(--color-border)',
                                        }}
                                    >
                                        {label}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Article list */}
                    <div>
                        {articles && articles.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                                {articles.map((article) => (
                                    <Link
                                        key={article.id}
                                        href={`/preguntas/${article.slug}`}
                                        style={{
                                            display: 'flex',
                                            gap: '1rem',
                                            alignItems: 'flex-start',
                                            padding: '1rem',
                                            background: 'white',
                                            border: '1px solid var(--color-border)',
                                            borderRadius: 'var(--radius)',
                                            textDecoration: 'none',
                                            transition: 'box-shadow 150ms ease',
                                        }}
                                    >
                                        <BookOpen size={18} color="var(--color-primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                                        <div>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text)' }}>
                                                {article.title}
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.375rem',
                                                    marginTop: '0.375rem',
                                                }}
                                            >
                                                <Tag size={11} color="var(--color-text-muted)" />
                                                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                                                    {FAQ_CATEGORIES[article.category as FaqCategory]}
                                                </span>
                                                <span style={{ color: 'var(--color-border)', fontSize: '0.75rem' }}>·</span>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                                                    Actualizado{' '}
                                                    {new Date(article.updated_at).toLocaleDateString('es-CR', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div
                                style={{
                                    textAlign: 'center',
                                    padding: '3rem',
                                    color: 'var(--color-text-muted)',
                                    background: 'white',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius)',
                                }}
                            >
                                <BookOpen size={32} color="var(--color-border)" style={{ margin: '0 auto 0.75rem' }} />
                                <p>No hay artículos en esta categoría aún.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
