'use client'

import Link from 'next/link'
import { APP_NAME, NAV_LINKS } from '@/lib/constants'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer
            style={{
                background: '#1e293b',
                color: '#94a3b8',
                marginTop: 'auto',
                padding: '3rem 0 1.5rem',
            }}
        >
            <div className="container-page">
                {/* Top section */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '2rem',
                        paddingBottom: '2rem',
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                    }}
                >
                    {/* Brand */}
                    <div>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                marginBottom: '0.75rem',
                            }}
                        >
                            <span
                                style={{
                                    background: 'var(--color-primary)',
                                    color: 'white',
                                    borderRadius: '6px',
                                    padding: '2px 8px',
                                    fontSize: '0.85rem',
                                    fontWeight: 700,
                                    letterSpacing: '0.05em',
                                }}
                            >
                                IC
                            </span>
                            <span style={{ color: 'white', fontWeight: 600 }}>{APP_NAME}</span>
                        </div>
                        <p style={{ fontSize: '0.875rem', lineHeight: '1.6', maxWidth: '24ch' }}>
                            Portal institucional de la Escuela de Ingeniería en Computadores, TEC.
                        </p>
                    </div>

                    {/* Nav */}
                    <div>
                        <h4
                            style={{
                                color: 'white',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                marginBottom: '0.75rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                            }}
                        >
                            Secciones
                        </h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {NAV_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        style={{
                                            fontSize: '0.875rem',
                                            color: '#94a3b8',
                                            textDecoration: 'none',
                                            transition: 'color 150ms ease',
                                        }}
                                        onMouseEnter={(e) =>
                                            ((e.target as HTMLElement).style.color = 'white')
                                        }
                                        onMouseLeave={(e) =>
                                            ((e.target as HTMLElement).style.color = '#94a3b8')
                                        }
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick access */}
                    <div>
                        <h4
                            style={{
                                color: 'white',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                marginBottom: '0.75rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                            }}
                        >
                            Accesos rápidos
                        </h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {[
                                { label: 'Matrícula', href: '/preguntas?cat=matricula' },
                                { label: 'Calendario académico', href: '/calendario' },
                                { label: 'Directorio', href: '/contactos' },
                                { label: 'Buscar información', href: '/buscar' },
                            ].map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        style={{
                                            fontSize: '0.875rem',
                                            color: '#94a3b8',
                                            textDecoration: 'none',
                                            transition: 'color 150ms ease',
                                        }}
                                        onMouseEnter={(e) =>
                                            ((e.target as HTMLElement).style.color = 'white')
                                        }
                                        onMouseLeave={(e) =>
                                            ((e.target as HTMLElement).style.color = '#94a3b8')
                                        }
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '0.5rem',
                        paddingTop: '1.5rem',
                        fontSize: '0.8rem',
                    }}
                >
                    <span>
                        © {currentYear} Escuela de Ingeniería en Computadores – Instituto Tecnológico de Costa Rica
                    </span>
                    <Link
                        href="/admin/login"
                        style={{ color: '#475569', textDecoration: 'none', fontSize: '0.75rem' }}
                    >
                        Acceso administrativo
                    </Link>
                </div>
            </div>
        </footer>
    )
}
