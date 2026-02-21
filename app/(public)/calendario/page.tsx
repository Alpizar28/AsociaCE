import { createClient } from '@/lib/supabase/server'
import { Calendar as CalIcon, MapPin, FileText } from 'lucide-react'
import { EVENT_TYPE_COLORS, EVENT_TYPES } from '@/lib/constants'
import { formatDate, formatTime } from '@/lib/utils/date'
import type { CalendarEventType, CalendarEvent } from '@/types/database'
import type { Metadata } from 'next'
import ReportButton from '@/components/shared/ReportButton'

export const metadata: Metadata = {
    title: 'Calendario Académico',
    description: 'Fechas importantes de matrícula, evaluaciones y trámites de Ingeniería en Computadores.',
}

interface Props {
    searchParams: Promise<{ type?: string }>
}

export default async function CalendarioPage({ searchParams }: Props) {
    const { type } = await searchParams
    const eventType = type as CalendarEventType | undefined
    const supabase = await createClient()

    const query = supabase
        .from('calendar_events')
        .select('*')
        .eq('status', 'published')
        .order('start_datetime', { ascending: true })

    if (eventType && Object.keys(EVENT_TYPES).includes(eventType)) {
        query.eq('type', eventType)
    }

    const { data: events } = await query
    const typedEvents = (events as CalendarEvent[]) || []

    const now = new Date().toISOString()
    const upcoming = typedEvents.filter((e) => e.start_datetime >= now)
    const past = typedEvents.filter((e) => e.start_datetime < now)

    return (
        <div className="section-gap">
            <div className="container-page">
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Calendario Académico</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Fechas clave del semestre académico.</p>
                </div>

                {/* Type filter */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
                    <a href="/calendario"
                        style={{ padding: '0.375rem 0.875rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: !eventType ? 600 : 400, background: !eventType ? 'var(--color-primary)' : 'white', color: !eventType ? 'white' : 'var(--color-text-muted)', border: `1px solid ${!eventType ? 'var(--color-primary)' : 'var(--color-border)'}`, textDecoration: 'none' }}>
                        Todos
                    </a>
                    {Object.entries(EVENT_TYPES).map(([key, label]) => (
                        <a key={key} href={`/calendario?type=${key}`}
                            style={{ padding: '0.375rem 0.875rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: eventType === key ? 600 : 400, background: eventType === key ? 'var(--color-primary)' : 'white', color: eventType === key ? 'white' : 'var(--color-text-muted)', border: `1px solid ${eventType === key ? 'var(--color-primary)' : 'var(--color-border)'}`, textDecoration: 'none' }}>
                            {label}
                        </a>
                    ))}
                </div>

                {/* Upcoming */}
                {upcoming.length > 0 && (
                    <section style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                            Próximos eventos
                        </h2>
                        <EventList events={upcoming} />
                    </section>
                )}

                {/* Past */}
                {past.length > 0 && (
                    <section>
                        <h2 style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                            Eventos pasados
                        </h2>
                        <EventList events={past} muted />
                    </section>
                )}

                {(!events || events.length === 0) && (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
                        <CalIcon size={40} color="var(--color-border)" style={{ margin: '0 auto 1rem' }} />
                        <p>No hay eventos para este filtro.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

function EventList({ events, muted }: { events: any[]; muted?: boolean }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {events.map((ev) => (
                <div
                    key={ev.id}
                    style={{
                        display: 'flex',
                        gap: '1.25rem',
                        padding: '1.25rem',
                        background: 'white',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius)',
                        opacity: muted ? 0.65 : 1,
                    }}
                >
                    {/* Date block */}
                    <div style={{ flexShrink: 0, textAlign: 'center', width: '56px' }}>
                        <div style={{ background: 'var(--color-primary)', color: 'white', borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0', padding: '2px 0', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase' }}>
                            {new Date(ev.start_datetime).toLocaleDateString('es-CR', { month: 'short' })}
                        </div>
                        <div style={{ background: 'var(--color-primary-light)', borderRadius: '0 0 var(--radius-sm) var(--radius-sm)', padding: '4px 0', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                            {new Date(ev.start_datetime).getDate()}
                        </div>
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                            <h3 style={{ fontSize: '0.9rem', fontWeight: 600 }}>{ev.title}</h3>
                            <span
                                className="badge"
                                style={{ fontSize: '0.7rem', padding: '1px 8px' }}
                            >
                                <span className={EVENT_TYPE_COLORS[ev.type as CalendarEventType] + ' badge'}>
                                    {EVENT_TYPES[ev.type as CalendarEventType]}
                                </span>
                            </span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <CalIcon size={12} />
                                {formatDate(ev.start_datetime)}{ev.end_datetime && ` – ${formatDate(ev.end_datetime)}`}
                            </span>
                            {ev.location && (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <MapPin size={12} /> {ev.location}
                                </span>
                            )}
                        </div>
                        {ev.description_md && (
                            <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                                {ev.description_md.slice(0, 180)}
                            </p>
                        )}
                        {ev.attachment_pdf_url && (
                            <a href={ev.attachment_pdf_url} target="_blank" rel="noopener noreferrer"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.625rem', fontSize: '0.78rem', color: 'var(--color-primary)', textDecoration: 'none' }}>
                                <FileText size={13} /> Ver documento
                            </a>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}
