// @ts-nocheck – Supabase v2 generic narrowing on faq_articles query
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ArrowLeft, ExternalLink, FileText, Tag, Clock } from 'lucide-react'
import Link from 'next/link'
import { FAQ_CATEGORIES } from '@/lib/constants'
import type { FaqCategory } from '@/types/database'
import type { Metadata } from 'next'
import ReportButton from '@/components/shared/ReportButton'

interface Props {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const supabase = await createClient()
    const { data } = await supabase
        .from('faq_articles')
        .select('title, content')
        .eq('slug', slug)
        .eq('status', 'published')
        .single()
    if (!data) return {}
    return {
        title: data.title,
        description: data.content.slice(0, 160),
    }
}

export default async function FaqArticlePage({ params }: Props) {
    const { slug } = await params
    const supabase = await createClient()
    const { data: article } = await supabase
        .from('faq_articles')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single()

    if (!article) notFound()

    return (
        <div className="section-gap">
            <div className="container-page">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '2.5rem', alignItems: 'start' }}>
                    {/* Main content */}
                    <article>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <Link
                                href="/preguntas"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.375rem',
                                    fontSize: '0.8rem',
                                    color: 'var(--color-text-muted)',
                                    textDecoration: 'none',
                                    marginBottom: '1rem',
                                    transition: 'color 150ms ease',
                                }}
                            >
                                <ArrowLeft size={13} />
                                Volver a preguntas
                            </Link>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                <Tag size={13} color="var(--color-text-muted)" />
                                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                    {FAQ_CATEGORIES[article.category as FaqCategory]}
                                </span>
                            </div>
                            <h1 style={{ fontSize: '1.625rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '0.75rem' }}>
                                {article.title}
                            </h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                                <Clock size={13} />
                                Actualizado:{' '}
                                {new Date(article.updated_at).toLocaleDateString('es-CR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </div>
                        </div>

                        {/* Cover image */}
                        {article.cover_image_url && (
                            <img
                                src={article.cover_image_url}
                                alt={article.title}
                                style={{
                                    width: '100%',
                                    maxHeight: '300px',
                                    objectFit: 'cover',
                                    borderRadius: 'var(--radius)',
                                    marginBottom: '2rem',
                                    border: '1px solid var(--color-border)',
                                }}
                            />
                        )}

                        {/* Markdown content rendered as HTML */}
                        <div
                            className="prose"
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(article.content) }}
                        />
                    </article>

                    {/* Sidebar */}
                    <aside style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* PDF download */}
                        {article.attachment_pdf_url && (
                            <div
                                style={{
                                    background: 'white',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius)',
                                    padding: '1rem',
                                }}
                            >
                                <h3 style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                                    Documento adjunto
                                </h3>
                                <a
                                    href={article.attachment_pdf_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.625rem 0.875rem',
                                        background: 'var(--color-primary-light)',
                                        color: 'var(--color-primary)',
                                        borderRadius: 'var(--radius-sm)',
                                        fontSize: '0.875rem',
                                        fontWeight: 500,
                                        textDecoration: 'none',
                                    }}
                                >
                                    <FileText size={15} />
                                    Descargar PDF
                                </a>
                            </div>
                        )}

                        {/* Source URL */}
                        {article.source_url && (
                            <div
                                style={{
                                    background: 'white',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius)',
                                    padding: '1rem',
                                }}
                            >
                                <h3 style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                                    Fuente oficial
                                </h3>
                                <a
                                    href={article.source_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontSize: '0.875rem',
                                        color: 'var(--color-primary)',
                                        textDecoration: 'none',
                                    }}
                                >
                                    <ExternalLink size={14} />
                                    Ver fuente
                                </a>
                            </div>
                        )}

                        {/* Report button */}
                        <ReportButton pageType="faq" pageId={article.id} />
                    </aside>
                </div>
            </div>

            <style>{`
        @media (max-width: 768px) {
          .container-page > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </div>
    )
}

/**
 * Basic Markdown → HTML renderer.
 * Uses only the Web platform – no external deps needed for display.
 * For a richer experience, swap for a proper remark/rehype pipeline.
 */
function renderMarkdown(md: string): string {
    return md
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`(.+?)`/g, '<code>$1</code>')
        .replace(/^\- (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(?!<[hul])/gm, '')
        .replace(/(.+)/g, (line) => (line.startsWith('<') ? line : `<p>${line}</p>`))
}
