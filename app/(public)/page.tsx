// @ts-nocheck – Supabase v2 generic narrowing on multi-table reads
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Search, ArrowRight, Calendar, BookOpen, Newspaper, Phone } from 'lucide-react'
import { formatDayLabel, formatTime } from '@/lib/utils/date'
import { EVENT_TYPE_COLORS, FAQ_CATEGORIES } from '@/lib/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Inicio – Portal CE | TEC',
    description:
        'Portal institucional para estudiantes de Computadores del TEC. Encuentra respuestas, noticias, calendario académico y contactos.',
}

export default async function HomePage() {
    try {
        const supabase = await createClient()

        // Fetch upcoming events (next 5)
        const { data: events, error: eventsError } = await supabase
            .from('calendar_events')
            .select('id, title, slug, start_datetime, type')
            .eq('status', 'published')
            .gte('start_datetime', new Date().toISOString())
            .order('start_datetime', { ascending: true })
            .limit(5)

        // Fetch latest news (3 items, pinned first)
        const { data: news, error: newsError } = await supabase
            .from('news_articles')
            .select('id, title, slug, published_at, cover_image_url, pinned')
            .eq('status', 'published')
            .order('pinned', { ascending: false })
            .order('published_at', { ascending: false })
            .limit(3)

        // Fetch top FAQ articles (most recently published, 6 items)
        const { data: faqs, error: faqsError } = await supabase
            .from('faq_articles')
            .select('id, title, slug, category')
            .eq('status', 'published')
            .order('published_at', { ascending: false })
            .limit(6)

        if (eventsError || newsError || faqsError) {
            console.error('Supabase fetch error on HomePage:', { eventsError, newsError, faqsError })
        }

        return (
            <div>
                {/* ── Hero ───────────────────────────────────────────── */}
                <section
                    style={{
                        background: 'linear-gradient(135deg, #1e3a5f 0%, #1D4ED8 100%)',
                        padding: '5rem 0 4rem',
                    }}
                >
                    <div className="container-page" style={{ textAlign: 'center' }}>
                        <div
                            style={{
                                display: 'inline-block',
                                background: 'rgba(255,255,255,0.15)',
                                borderRadius: '20px',
                                padding: '0.25rem 0.875rem',
                                fontSize: '0.8rem',
                                color: 'rgba(255,255,255,0.9)',
                                fontWeight: 500,
                                marginBottom: '1.25rem',
                                letterSpacing: '0.05em',
                                textTransform: 'uppercase',
                            }}
                        >
                            Escuela de Ingeniería en Computadores (CE) · TEC
                        </div>
                        <h1
                            style={{
                                fontSize: 'clamp(1.75rem, 5vw, 3rem)',
                                fontWeight: 700,
                                color: 'white',
                                marginBottom: '0.75rem',
                                lineHeight: 1.2,
                            }}
                        >
                            Portal CE
                        </h1>
                        <p
                            style={{
                                color: 'rgba(255,255,255,0.8)',
                                fontSize: '1.0625rem',
                                marginBottom: '2.5rem',
                                maxWidth: '45ch',
                                margin: '0 auto 2.5rem',
                            }}
                        >
                            Información centralizada para estudiantes de Computadores.
                        </p>

                        {/* Search bar */}
                        <form
                            action="/buscar"
                            method="get"
                            style={{
                                display: 'flex',
                                maxWidth: '560px',
                                margin: '0 auto',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                                borderRadius: 'var(--radius)',
                                overflow: 'hidden',
                            }}
                        >
                            <input
                                type="text"
                                name="q"
                                placeholder="Buscar preguntas, noticias, eventos…"
                                style={{
                                    flex: 1,
                                    padding: '0.875rem 1.25rem',
                                    border: 'none',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    background: 'white',
                                    color: 'var(--color-text)',
                                }}
                            />
                            <button
                                type="submit"
                                style={{
                                    padding: '0.875rem 1.5rem',
                                    background: '#1e40af',
                                    color: 'white',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                    transition: 'background 150ms ease',
                                }}
                            >
                                <Search size={16} />
                                Buscar
                            </button>
                        </form>
                    </div>
                </section>

                {/* ── Quick access ───────────────────────────────────── */}
                <section style={{ padding: '2rem 0', background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
                    <div className="container-page">
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
                            {[
                                { icon: BookOpen, label: 'Preguntas frecuentes', href: '/preguntas', color: '#dbeafe' },
                                { icon: Newspaper, label: 'Noticias', href: '/noticias', color: '#dcfce7' },
                                { icon: Calendar, label: 'Calendario', href: '/calendario', color: '#fef9c3' },
                                { icon: Phone, label: 'Contactos', href: '/contactos', color: '#f3e8ff' },
                            ].map((item) => {
                                const Icon = item.icon
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.625rem',
                                            padding: '0.625rem 1.125rem',
                                            background: 'white',
                                            border: '1px solid var(--color-border)',
                                            borderRadius: 'var(--radius)',
                                            fontSize: '0.875rem',
                                            fontWeight: 500,
                                            color: 'var(--color-text)',
                                            textDecoration: 'none',
                                            transition: 'box-shadow 150ms ease',
                                        }}
                                    >
                                        <span
                                            style={{
                                                background: item.color,
                                                borderRadius: '6px',
                                                padding: '4px',
                                                display: 'flex',
                                            }}
                                        >
                                            <Icon size={14} color="var(--color-primary)" />
                                        </span>
                                        {item.label}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* ── Main content grid ───────────────────────────────── */}
                <section className="section-gap">
                    <div
                        className="container-page"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '2rem',
                        }}
                    >
                        {/* Upcoming events */}
                        <div>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '1rem',
                                }}
                            >
                                <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>
                                    Próximos eventos
                                </h2>
                                <Link
                                    href="/calendario"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                        fontSize: '0.8rem',
                                        color: 'var(--color-primary)',
                                        textDecoration: 'none',
                                    }}
                                >
                                    Ver todos <ArrowRight size={13} />
                                </Link>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                                {events && events.length > 0 ? (
                                    events.map((event) => (
                                        <Link
                                            key={event.id}
                                            href={`/calendario`}
                                            style={{
                                                display: 'flex',
                                                gap: '0.875rem',
                                                padding: '0.875rem',
                                                background: 'white',
                                                border: '1px solid var(--color-border)',
                                                borderRadius: 'var(--radius)',
                                                textDecoration: 'none',
                                                transition: 'box-shadow 150ms ease',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    flexShrink: 0,
                                                    textAlign: 'center',
                                                    minWidth: '48px',
                                                }}
                                            >
                                                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                                                    {formatDayLabel(event.start_datetime)}
                                                </div>
                                                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                                                    {formatTime(event.start_datetime)}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text)', lineHeight: 1.4 }}>
                                                    {event.title}
                                                </div>
                                                <span
                                                    className="badge"
                                                    style={{ marginTop: '0.25rem' }}
                                                    // @ts-expect-error dynamic class
                                                    data-type={event.type}
                                                >
                                                    <span className={EVENT_TYPE_COLORS[event.type as keyof typeof EVENT_TYPE_COLORS]}>
                                                        {event.type}
                                                    </span>
                                                </span>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                                        No hay eventos próximos.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Latest news */}
                        <div>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '1rem',
                                }}
                            >
                                <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>
                                    Últimas noticias
                                </h2>
                                <Link
                                    href="/noticias"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                        fontSize: '0.8rem',
                                        color: 'var(--color-primary)',
                                        textDecoration: 'none',
                                    }}
                                >
                                    Ver todas <ArrowRight size={13} />
                                </Link>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                                {news && news.length > 0 ? (
                                    news.map((item) => (
                                        <Link
                                            key={item.id}
                                            href={`/noticias/${item.slug}`}
                                            style={{
                                                display: 'block',
                                                padding: '0.875rem',
                                                background: 'white',
                                                border: `1px solid ${item.pinned ? 'var(--color-primary)' : 'var(--color-border)'}`,
                                                borderRadius: 'var(--radius)',
                                                textDecoration: 'none',
                                                transition: 'box-shadow 150ms ease',
                                            }}
                                        >
                                            {item.pinned && (
                                                <span
                                                    style={{
                                                        fontSize: '0.7rem',
                                                        fontWeight: 600,
                                                        color: 'var(--color-primary)',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.05em',
                                                    }}
                                                >
                                                    📌 Destacado
                                                </span>
                                            )}
                                            <p
                                                style={{
                                                    fontSize: '0.875rem',
                                                    fontWeight: 500,
                                                    color: 'var(--color-text)',
                                                    lineHeight: 1.4,
                                                    marginTop: item.pinned ? '0.25rem' : 0,
                                                }}
                                            >
                                                {item.title}
                                            </p>
                                            {item.published_at && (
                                                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                                                    {new Date(item.published_at).toLocaleDateString('es-CR', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </p>
                                            )}
                                        </Link>
                                    ))
                                ) : (
                                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                                        No hay noticias recientes.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Top FAQ */}
                        <div>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '1rem',
                                }}
                            >
                                <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>
                                    Base de conocimiento
                                </h2>
                                <Link
                                    href="/preguntas"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                        fontSize: '0.8rem',
                                        color: 'var(--color-primary)',
                                        textDecoration: 'none',
                                    }}
                                >
                                    Ver todo <ArrowRight size={13} />
                                </Link>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {faqs && faqs.length > 0 ? (
                                    faqs.map((faq) => (
                                        <Link
                                            key={faq.id}
                                            href={`/preguntas/${faq.slug}`}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.625rem',
                                                padding: '0.75rem',
                                                background: 'white',
                                                border: '1px solid var(--color-border)',
                                                borderRadius: 'var(--radius)',
                                                textDecoration: 'none',
                                                transition: 'box-shadow 150ms ease',
                                            }}
                                        >
                                            <BookOpen size={15} color="var(--color-text-muted)" style={{ flexShrink: 0 }} />
                                            <div>
                                                <div style={{ fontSize: '0.875rem', color: 'var(--color-text)', fontWeight: 500, lineHeight: 1.3 }}>
                                                    {faq.title}
                                                </div>
                                                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '0.125rem' }}>
                                                    {FAQ_CATEGORIES[faq.category as keyof typeof FAQ_CATEGORIES]}
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                                        No hay artículos publicados.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    } catch (error) {
        console.error('HomePage critical error:', error)
        return (
            <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Servicio temporalmente no disponible</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>Estamos experimentando problemas para conectar con la base de datos. Por favor, inténtalo de nuevo más tarde.</p>
            </div>
        )
    }
}
