import {
    format,
    formatDistanceToNow,
    isToday,
    isTomorrow,
    parseISO,
} from 'date-fns'
import { es } from 'date-fns/locale'

const LOCALE = es

/** Full date: "20 de febrero de 2026" */
export function formatDate(dateString: string): string {
    return format(parseISO(dateString), "d 'de' MMMM 'de' yyyy", {
        locale: LOCALE,
    })
}

/** Short date: "20 feb 2026" */
export function formatDateShort(dateString: string): string {
    return format(parseISO(dateString), 'd MMM yyyy', { locale: LOCALE })
}

/** Time: "14:30" */
export function formatTime(dateString: string): string {
    return format(parseISO(dateString), 'HH:mm', { locale: LOCALE })
}

/** Date + time: "20 feb 2026, 14:30" */
export function formatDateTime(dateString: string): string {
    return format(parseISO(dateString), "d MMM yyyy, HH:mm", { locale: LOCALE })
}

/** Relative: "hace 3 días" */
export function formatRelative(dateString: string): string {
    return formatDistanceToNow(parseISO(dateString), {
        addSuffix: true,
        locale: LOCALE,
    })
}

/** Day label for calendar: "Hoy", "Mañana", or formatted date */
export function formatDayLabel(dateString: string): string {
    const date = parseISO(dateString)
    if (isToday(date)) return 'Hoy'
    if (isTomorrow(date)) return 'Mañana'
    return formatDateShort(dateString)
}

/** ISO date only: "2026-02-20" */
export function toISODate(dateString: string): string {
    return parseISO(dateString).toISOString().split('T')[0]
}
