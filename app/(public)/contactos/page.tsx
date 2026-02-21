// @ts-nocheck – Supabase v2 query chain type narrowing; read-only page
import { createClient } from '@/lib/supabase/server'
import { Mail, Phone, MapPin, Clock, Link2, Users, Building2, Globe } from 'lucide-react'
import { CONTACT_KINDS } from '@/lib/constants'
import type { ContactKind } from '@/types/database'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Directorio de Contactos',
    description: 'Personas, departamentos y entidades relevantes de Ingeniería en Computadores.',
}

interface Props { searchParams: Promise<{ kind?: string }> }

export default async function ContactosPage({ searchParams }: Props) {
    const { kind } = await searchParams
    const contactKind = kind as ContactKind | undefined
    const supabase = await createClient()

    let query = supabase.from('contacts').select('*').eq('status', 'published').order('name', { ascending: true })
    if (contactKind && Object.keys(CONTACT_KINDS).includes(contactKind)) {
        query = query.eq('kind', contactKind)
    }
    const { data: contacts } = await query

    const personas = contacts?.filter((c) => c.kind === 'persona') ?? []
    const deptos = contacts?.filter((c) => c.kind === 'departamento') ?? []
    const entidades = contacts?.filter((c) => c.kind === 'entidad') ?? []

    return (
        <div className="section-gap">
            <div className="container-page">
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Directorio de Contactos</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Personas, departamentos y entidades relevantes para estudiantes de IC.</p>
                </div>

                {/* Filter */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                    {[{ label: 'Todos', href: '/contactos' }, ...Object.entries(CONTACT_KINDS).map(([k, l]) => ({ label: l, href: `/contactos?kind=${k}` }))].map((item) => (
                        <a key={item.href} href={item.href}
                            style={{ padding: '0.375rem 0.875rem', borderRadius: '9999px', fontSize: '0.8rem', background: item.href === `/contactos${contactKind ? `?kind=${contactKind}` : ''}` ? 'var(--color-primary)' : 'white', color: item.href === `/contactos${contactKind ? `?kind=${contactKind}` : ''}` ? 'white' : 'var(--color-text-muted)', border: `1px solid ${item.href === `/contactos${contactKind ? `?kind=${contactKind}` : ''}` ? 'var(--color-primary)' : 'var(--color-border)'}`, textDecoration: 'none', fontWeight: 500 }}>
                            {item.label}
                        </a>
                    ))}
                </div>

                {/* Groups */}
                {(!contactKind || contactKind === 'persona') && personas.length > 0 && (
                    <section style={{ marginBottom: '2.5rem' }}>
                        <GroupHeader icon={<Users size={15} />} label="Personas" />
                        <ContactGrid contacts={personas} />
                    </section>
                )}
                {(!contactKind || contactKind === 'departamento') && deptos.length > 0 && (
                    <section style={{ marginBottom: '2.5rem' }}>
                        <GroupHeader icon={<Building2 size={15} />} label="Departamentos" />
                        <ContactGrid contacts={deptos} />
                    </section>
                )}
                {(!contactKind || contactKind === 'entidad') && entidades.length > 0 && (
                    <section>
                        <GroupHeader icon={<Globe size={15} />} label="Entidades" />
                        <ContactGrid contacts={entidades} />
                    </section>
                )}

                {(!contacts || contacts.length === 0) && (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
                        <Users size={40} color="var(--color-border)" style={{ margin: '0 auto 1rem' }} />
                        <p>No hay contactos en esta categoría.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

function GroupHeader({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>
            {icon}<h2 style={{ fontSize: '1rem', fontWeight: 700 }}>{label}</h2>
        </div>
    )
}

function ContactGrid({ contacts }: { contacts: any[] }) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {contacts.map((c) => (
                <div key={c.id} style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {c.cover_image_url && <img src={c.cover_image_url} alt={c.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', marginBottom: '0.25rem' }} />}
                    <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.name}</div>
                        {c.role_or_department && <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{c.role_or_department}</div>}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        {c.email && <a href={`mailto:${c.email}`} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--color-primary)', textDecoration: 'none' }}><Mail size={13} />{c.email}</a>}
                        {c.phone && <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><Phone size={13} />{c.phone}</span>}
                        {c.location && <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><MapPin size={13} />{c.location}</span>}
                        {c.hours && <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><Clock size={13} />{c.hours}</span>}
                        {c.link && <a href={c.link} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--color-primary)', textDecoration: 'none' }}><Link2 size={13} />Sitio web</a>}
                    </div>
                    {c.notes && <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)', paddingTop: '0.5rem', marginTop: '0.125rem', lineHeight: 1.5 }}>{c.notes}</p>}
                </div>
            ))}
        </div>
    )
}
