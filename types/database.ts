// ============================================================
// Database types – mirrors Supabase schema exactly
// ============================================================

export type AdminRole = 'secretaria' | 'aseic'
export type ContentStatus = 'draft' | 'published' | 'archived'
export type FaqCategory =
  | 'matricula'
  | 'tramites'
  | 'laboratorios'
  | 'becas'
  | 'reglamentos'
  | 'graduacion'
  | 'vida_estudiantil'
export type CalendarEventType = 'matricula' | 'evaluacion' | 'tramite' | 'otro'
export type ContactKind = 'persona' | 'departamento' | 'entidad'
export type ReportPageType = 'faq' | 'news' | 'calendar' | 'contact'

// ── admins_allowlist ────────────────────────────────────────
export interface AdminAllowlistEntry {
  email: string
  role: AdminRole
  created_at: string
}

// ── faq_articles ────────────────────────────────────────────
export interface FaqArticle {
  id: string
  title: string
  slug: string
  category: FaqCategory
  content: string // Markdown
  cover_image_url: string | null
  attachment_pdf_url: string | null
  source_url: string | null
  status: ContentStatus
  published_at: string | null
  updated_at: string
  created_by: string
}

// ── news_articles ───────────────────────────────────────────
export interface NewsArticle {
  id: string
  title: string
  slug: string
  content_md: string // Markdown
  cover_image_url: string | null
  attachment_pdf_url: string | null
  pinned: boolean
  source_url: string | null
  status: ContentStatus
  published_at: string | null
  updated_at: string
  created_by: string
}

// ── calendar_events ─────────────────────────────────────────
export interface CalendarEvent {
  id: string
  title: string
  slug: string
  start_datetime: string // ISO timestamp
  end_datetime: string | null
  type: CalendarEventType
  location: string | null
  description_md: string | null
  attachment_pdf_url: string | null
  source_url: string | null
  status: ContentStatus
  published_at: string | null
  updated_at: string
  created_by: string
}

// ── contacts ────────────────────────────────────────────────
export interface Contact {
  id: string
  kind: ContactKind
  name: string
  role_or_department: string | null
  email: string | null
  phone: string | null
  location: string | null
  hours: string | null
  link: string | null
  notes: string | null
  cover_image_url: string | null
  status: ContentStatus
  published_at: string | null
  updated_at: string
  created_by: string
}

// ── content_reports ─────────────────────────────────────────
export interface ContentReport {
  id: string
  page_type: ReportPageType
  page_id: string
  message: string
  created_at: string
}

// ── Search ──────────────────────────────────────────────────
export interface SearchResult {
  type: ReportPageType
  id: string
  title: string
  slug: string
  excerpt: string | null
  published_at: string | null
  rank: number
}

// ── Supabase Database shape (for typed client) ──────────────
export interface Database {
  public: {
    Tables: {
      admins_allowlist: {
        Row: AdminAllowlistEntry
        Insert: Omit<AdminAllowlistEntry, 'created_at'>
        Update: Partial<Omit<AdminAllowlistEntry, 'created_at'>>
        Relationships: []
      }
      faq_articles: {
        Row: FaqArticle
        Insert: Omit<FaqArticle, 'id' | 'updated_at'>
        Update: Partial<Omit<FaqArticle, 'id'>>
        Relationships: []
      }
      news_articles: {
        Row: NewsArticle
        Insert: Omit<NewsArticle, 'id' | 'updated_at'>
        Update: Partial<Omit<NewsArticle, 'id'>>
        Relationships: []
      }
      calendar_events: {
        Row: CalendarEvent
        Insert: Omit<CalendarEvent, 'id' | 'updated_at'>
        Update: Partial<Omit<CalendarEvent, 'id'>>
        Relationships: []
      }
      contacts: {
        Row: Contact
        Insert: Omit<Contact, 'id' | 'updated_at'>
        Update: Partial<Omit<Contact, 'id'>>
        Relationships: []
      }
      content_reports: {
        Row: ContentReport
        Insert: Omit<ContentReport, 'id' | 'created_at'>
        Update: never
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      search_all: {
        Args: { query: string }
        Returns: SearchResult[]
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

