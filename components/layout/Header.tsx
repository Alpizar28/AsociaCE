'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { NAV_LINKS, APP_NAME } from '@/lib/constants'
import { cn } from '@/lib/utils'

export default function Header() {
    const pathname = usePathname()
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <header
            style={{
                borderBottom: '1px solid var(--color-border)',
                background: 'white',
                position: 'sticky',
                top: 0,
                zIndex: 50,
                boxShadow: 'var(--shadow-sm)',
            }}
        >
            <div className="container-page" style={{ display: 'flex', alignItems: 'center', height: '4rem', gap: '2rem' }}>
                {/* Logo */}
                <Link
                    href="/"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontWeight: 700,
                        fontSize: '1.125rem',
                        color: 'var(--color-primary)',
                        textDecoration: 'none',
                        flexShrink: 0,
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
                        CE
                    </span>
                    <span style={{ color: 'var(--color-text)' }}>{APP_NAME}</span>
                </Link>

                {/* Desktop Nav */}
                <nav
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        flex: 1,
                    }}
                    className="hidden-mobile"
                >
                    {NAV_LINKS.map((link) => {
                        const isActive =
                            link.href === '/'
                                ? pathname === '/'
                                : pathname.startsWith(link.href)
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                style={{
                                    padding: '0.375rem 0.75rem',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '0.875rem',
                                    fontWeight: isActive ? 600 : 400,
                                    color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                    background: isActive ? 'var(--color-primary-light)' : 'transparent',
                                    textDecoration: 'none',
                                    transition: 'color 150ms ease, background 150ms ease',
                                }}
                            >
                                {link.label}
                            </Link>
                        )
                    })}
                </nav>

                {/* Search icon */}
                <Link
                    href="/buscar"
                    aria-label="Buscar"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '2.25rem',
                        height: '2.25rem',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--color-text-muted)',
                        transition: 'color 150ms ease, background 150ms ease',
                    }}
                    className="hidden-mobile"
                >
                    <Search size={18} />
                </Link>

                {/* Mobile menu toggle */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Menú"
                    style={{
                        display: 'none',
                        marginLeft: 'auto',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        color: 'var(--color-text)',
                    }}
                    className="show-mobile"
                >
                    {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* Mobile Nav */}
            {mobileOpen && (
                <div
                    style={{
                        borderTop: '1px solid var(--color-border)',
                        padding: '0.5rem 1.5rem 1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.25rem',
                    }}
                >
                    {NAV_LINKS.map((link) => {
                        const isActive =
                            link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                style={{
                                    padding: '0.625rem 0.75rem',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '0.9rem',
                                    fontWeight: isActive ? 600 : 400,
                                    color: isActive ? 'var(--color-primary)' : 'var(--color-text)',
                                    background: isActive ? 'var(--color-primary-light)' : 'transparent',
                                    textDecoration: 'none',
                                }}
                            >
                                {link.label}
                            </Link>
                        )
                    })}
                    <Link
                        href="/buscar"
                        onClick={() => setMobileOpen(false)}
                        style={{
                            padding: '0.625rem 0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.9rem',
                            color: 'var(--color-text-muted)',
                            textDecoration: 'none',
                        }}
                    >
                        <Search size={16} />
                        Buscar
                    </Link>
                </div>
            )}

            <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
        </header>
    )
}
