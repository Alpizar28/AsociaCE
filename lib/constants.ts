import {
    type FaqCategory,
    type CalendarEventType,
    type ContentStatus,
    type ContactKind,
} from '@/types/database'

// ── App metadata ──────────────────────────────────────────
export const APP_NAME = 'Portal IC'
export const APP_DESCRIPTION =
    'Portal institucional para estudiantes de Ingeniería en Computadores – TEC'
export const APP_URL =
    process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

// ── Navigation ────────────────────────────────────────────
export const NAV_LINKS = [
    { label: 'Inicio', href: '/' },
    { label: 'Preguntas', href: '/preguntas' },
    { label: 'Noticias', href: '/noticias' },
    { label: 'Calendario', href: '/calendario' },
    { label: 'Contactos', href: '/contactos' },
    { label: 'Acerca', href: '/acerca' },
] as const

// ── FAQ categories ────────────────────────────────────────
export const FAQ_CATEGORIES: Record<FaqCategory, string> = {
    matricula: 'Matrícula',
    tramites: 'Trámites Académicos',
    laboratorios: 'Laboratorios',
    becas: 'Becas',
    reglamentos: 'Reglamentos',
    graduacion: 'Graduación',
    vida_estudiantil: 'Vida Estudiantil',
}

// ── Calendar event types ──────────────────────────────────
export const EVENT_TYPES: Record<CalendarEventType, string> = {
    matricula: 'Matrícula',
    evaluacion: 'Evaluación',
    tramite: 'Trámite',
    otro: 'Otro',
}

export const EVENT_TYPE_COLORS: Record<CalendarEventType, string> = {
    matricula: 'bg-blue-100 text-blue-800',
    evaluacion: 'bg-amber-100 text-amber-800',
    tramite: 'bg-green-100 text-green-800',
    otro: 'bg-gray-100 text-gray-700',
}

// ── Contact kinds ─────────────────────────────────────────
export const CONTACT_KINDS: Record<ContactKind, string> = {
    persona: 'Persona',
    departamento: 'Departamento',
    entidad: 'Entidad',
}

// ── Content status labels ─────────────────────────────────
export const STATUS_LABELS: Record<ContentStatus, string> = {
    draft: 'Borrador',
    published: 'Publicado',
    archived: 'Archivado',
}

export const STATUS_COLORS: Record<ContentStatus, string> = {
    draft: 'bg-yellow-100 text-yellow-800',
    published: 'bg-green-100 text-green-800',
    archived: 'bg-gray-100 text-gray-600',
}

// ── Storage ───────────────────────────────────────────────
export const STORAGE_BUCKETS = {
    kb: 'kb',
    news: 'news',
    events: 'events',
    contacts: 'contacts',
} as const

export const MAX_IMAGE_SIZE_BYTES = 1 * 1024 * 1024 // 1 MB
export const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const ALLOWED_PDF_TYPES = ['application/pdf']
