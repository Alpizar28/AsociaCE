'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Flag, CheckCircle } from 'lucide-react'
import type { ReportPageType } from '@/types/database'

interface Props {
    pageType: ReportPageType
    pageId: string
}

export default function ReportButton({ pageType, pageId }: Props) {
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState('')
    const [sent, setSent] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!message.trim()) return
        setLoading(true)

        try {
            const supabase = createClient()
            // @ts-ignore – Fix for mysterious generic narrowing on 'content_reports' table
            await supabase.from('content_reports').insert({
                page_type: pageType,
                page_id: pageId,
                message: message.trim(),
            })
            setSent(true)
        } catch (error) {
            console.error('Report submission failed:', error)
        } finally {
            setLoading(false)
        }
    }

    if (sent) {
        return (
            <div
                style={{
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: 'var(--radius)',
                    padding: '1rem',
                    display: 'flex',
                    gap: '0.5rem',
                    alignItems: 'center',
                    fontSize: '0.875rem',
                    color: '#166534',
                }}
            >
                <CheckCircle size={16} />
                Reporte enviado. Gracias.
            </div>
        )
    }

    return (
        <div
            style={{
                background: 'white',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                padding: '1rem',
            }}
        >
            {!open ? (
                <button
                    onClick={() => setOpen(true)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        color: 'var(--color-text-muted)',
                        padding: 0,
                        transition: 'color 150ms ease',
                    }}
                >
                    <Flag size={13} />
                    Reportar información desactualizada
                </button>
            ) : (
                <form onSubmit={handleSubmit}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.625rem', color: 'var(--color-text)' }}>
                        ¿Qué información está desactualizada?
                    </p>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Describe brevemente el problema…"
                        maxLength={500}
                        rows={3}
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.8rem',
                            resize: 'vertical',
                            fontFamily: 'inherit',
                            marginBottom: '0.625rem',
                        }}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            type="submit"
                            disabled={loading || !message.trim()}
                            style={{
                                padding: '0.375rem 0.875rem',
                                background: 'var(--color-primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '0.8rem',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading || !message.trim() ? 0.6 : 1,
                            }}
                        >
                            {loading ? 'Enviando…' : 'Enviar'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            style={{
                                padding: '0.375rem 0.875rem',
                                background: 'var(--color-surface)',
                                color: 'var(--color-text-muted)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                            }}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            )}
        </div>
    )
}
