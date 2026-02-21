/**
 * Slug generation from arbitrary text.
 * Handles Spanish characters correctly.
 */
export function generateSlug(text: string): string {
    return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // remove accents
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '') // remove non-alphanumeric
        .replace(/[\s_-]+/g, '-') // spaces to hyphens
        .replace(/^-+|-+$/g, '') // trim leading/trailing hyphens
}

/** Ensure slug uniqueness by appending a timestamp suffix. */
export function generateUniqueSlug(text: string): string {
    return `${generateSlug(text)}-${Date.now().toString(36)}`
}
