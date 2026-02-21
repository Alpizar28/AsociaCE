'use client'

import { createClient } from '@/lib/supabase/client'
import { useSearchParams } from 'next/navigation'
import { LogIn, AlertCircle } from 'lucide-react'
import { Suspense } from 'react'

function LoginContent() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')
    const supabase = createClient()

    async function handleGoogleLogin() {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
                queryParams: {
                    hd: 'tec.ac.cr', // Restrict to TEC domain hint (not enforced – allowlist handles it)
                },
            },
        })
    }

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f8fafc',
                padding: '1rem',
            }}
        >
            <div
                style={{
                    background: 'white',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-border)',
                    boxShadow: 'var(--shadow-lg)',
                    padding: '2.5rem',
                    width: '100%',
                    maxWidth: '400px',
                    textAlign: 'center',
                }}
            >
                {/* Logo */}
                <div style={{ marginBottom: '2rem' }}>
                    <div
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'var(--color-primary)',
                            color: 'white',
                            borderRadius: '12px',
                            width: '56px',
                            height: '56px',
                            fontSize: '1.25rem',
                            fontWeight: 700,
                            marginBottom: '1rem',
                        }}
                    >
                        IC
                    </div>
                    <h1
                        style={{
                            fontSize: '1.375rem',
                            fontWeight: 700,
                            color: 'var(--color-text)',
                            marginBottom: '0.375rem',
                        }}
                    >
                        Portal IC
                    </h1>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                        Panel Administrativo
                    </p>
                </div>

                {/* Error message */}
                {error === 'unauthorized' && (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.5rem',
                            background: '#fef2f2',
                            border: '1px solid #fecaca',
                            borderRadius: 'var(--radius)',
                            padding: '0.75rem',
                            marginBottom: '1.25rem',
                            textAlign: 'left',
                        }}
                    >
                        <AlertCircle size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <p style={{ fontSize: '0.8rem', color: '#dc2626' }}>
                            Tu correo no está autorizado para acceder al panel administrativo.
                            Contacta a la secretaría de la escuela.
                        </p>
                    </div>
                )}

                <p
                    style={{
                        fontSize: '0.875rem',
                        color: 'var(--color-text-muted)',
                        marginBottom: '1.5rem',
                        lineHeight: 1.5,
                    }}
                >
                    El acceso está restringido a personal autorizado de la Escuela de IC.
                </p>

                <button
                    onClick={handleGoogleLogin}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.75rem',
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius)',
                        border: '1px solid var(--color-border)',
                        background: 'white',
                        color: 'var(--color-text)',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'background 150ms ease, box-shadow 150ms ease',
                        boxShadow: 'var(--shadow-sm)',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f8fafc'
                        e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'white'
                        e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                    }}
                >
                    {/* Google icon */}
                    <svg width="18" height="18" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    Ingresar con Google
                </button>

                <p
                    style={{
                        marginTop: '1.5rem',
                        fontSize: '0.75rem',
                        color: '#9ca3af',
                    }}
                >
                    Solo correos institucionales autorizados
                </p>
            </div>
        </div>
    )
}

export default function AdminLoginPage() {
    return (
        <Suspense>
            <LoginContent />
        </Suspense>
    )
}
