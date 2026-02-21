// @ts-nocheck – Supabase v2 generic narrowing on news_articles query
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, FileText, ExternalLink, Clock } from 'lucide-react'
import type { Metadata } from 'next'
import ReportButton from '@/components/shared/ReportButton'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const supabase = await createClient()
    const { data } = await supabase
        .from('news_articles').select('title, content_md').eq('slug', slug).eq('status', 'published').single()
    if (!data) return {}
    return { title: data.title, description: data.content_md.slice(0, 160) }
}

export default async function NewsDetailPage({ params }: Props) {
    const { slug } = await params
    const supabase = await createClient()
    const { data: article } = await supabase
        .from('news_articles').select('*').eq('slug', slug).eq('status', 'published').single()

    if (!article) notFound()

    return (
        <div className="section-gap">
            <div className="container-page" style={{ maxWidth: '800px' }}>
                <Link href="/noticias" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', textDecoration: 'none', marginBottom: '1.5rem' }}>
                    <ArrowLeft size={13} /> Volver a noticias
                </Link>

                {article.cover_image_url && (
                    <img src={article.cover_image_url} alt={article.title}
                        style={{ width: '100%', maxHeight: '360px', objectFit: 'cover', borderRadius: 'var(--radius)', marginBottom: '2rem', border: '1px solid var(--color-border)' }} />
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    {article.pinned && <span style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)', fontSize: '0.72rem', fontWeight: 600, padding: '2px 8px', borderRadius: '9999px' }}>📌 Destacado</span>}
                    {article.published_at && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                            <Clock size={12} />
                            {new Date(article.published_at).toLocaleDateString('es-CR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                    )}
                </div>

                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '2rem' }}>{article.title}</h1>

                <div className="prose" style={{ marginBottom: '2rem' }}>
                    {article.content_md.split('\n').map((line: string, i: number) => (
                        <p key={i}>{line}</p>
                    ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
                    {article.attachment_pdf_url && (
                        <a href={article.attachment_pdf_url} target="_blank" rel="noopener noreferrer"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1rem', background: 'var(--color-primary-light)', color: 'var(--color-primary)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none', width: 'fit-content' }}>
                            <FileText size={15} /> Descargar documento adjunto
                        </a>
                    )}
                    {article.source_url && (
                        <a href={article.source_url} target="_blank" rel="noopener noreferrer"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-primary)', textDecoration: 'none' }}>
                            <ExternalLink size={14} /> Ver fuente oficial
                        </a>
                    )}
                    <div style={{ marginTop: '0.5rem' }}>
                        <ReportButton pageType="news" pageId={article.id} />
                    </div>
                </div>
            </div>
        </div>
    )
}
