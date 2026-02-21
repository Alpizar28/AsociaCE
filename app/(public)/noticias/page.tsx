// @ts-nocheck – Supabase v2 generic narrowing on news_articles query
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Newspaper, Pin, FileText } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Noticias',
    description: 'Comunicados y noticias oficiales de la Escuela de Ingeniería en Computadores.',
}

export default async function NoticiasPage() {
    const supabase = await createClient()
    const { data: news } = await supabase
        .from('news_articles')
        .select('id, title, slug, published_at, cover_image_url, pinned, content_md')
        .eq('status', 'published')
        .order('pinned', { ascending: false })
        .order('published_at', { ascending: false })

    const pinned = news?.filter((n) => n.pinned) ?? []
    const regular = news?.filter((n) => !n.pinned) ?? []

    return (
        <div className="section-gap">
            <div className="container-page">
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Noticias</h1>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                    Comunicados oficiales de la Escuela de IC.
                </p>

                {pinned.length > 0 && (
                    <div style={{ marginBottom: '2.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <Pin size={14} color="var(--color-primary)" />
                            <h2 style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)' }}>
                                Destacados
                            </h2>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                            {pinned.map((item) => (
                                <NewsCard key={item.id} item={item} featured />
                            ))}
                        </div>
                    </div>
                )}

                {regular.length > 0 && (
                    <div>
                        {pinned.length > 0 && (
                            <h2 style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                                Todas las noticias
                            </h2>
                        )}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {regular.map((item) => (
                                <NewsCard key={item.id} item={item} />
                            ))}
                        </div>
                    </div>
                )}

                {(!news || news.length === 0) && (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
                        <Newspaper size={40} color="var(--color-border)" style={{ margin: '0 auto 1rem' }} />
                        <p>No hay noticias publicadas aún.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

function NewsCard({ item, featured }: { item: any; featured?: boolean }) {
    const excerpt = item.content_md?.slice(0, 120) + '…'
    return (
        <Link
            href={`/noticias/${item.slug}`}
            style={{
                display: 'block',
                background: 'white',
                border: `1px solid ${featured ? 'var(--color-primary)' : 'var(--color-border)'}`,
                borderRadius: 'var(--radius)',
                overflow: 'hidden',
                textDecoration: 'none',
                transition: 'box-shadow 150ms ease',
            }}
        >
            {item.cover_image_url && (
                <img
                    src={item.cover_image_url}
                    alt={item.title}
                    style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                />
            )}
            <div style={{ padding: '1rem' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.375rem', lineHeight: 1.4 }}>
                    {item.title}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: '0.5rem' }}>
                    {excerpt}
                </p>
                {item.published_at && (
                    <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                        {new Date(item.published_at).toLocaleDateString('es-CR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                )}
            </div>
        </Link>
    )
}
