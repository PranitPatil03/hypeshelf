/**
 * Shared admin utilities.
 *
 * Admin emails are read from the ADMIN_EMAILS Convex environment variable.
 * Set it in the Convex dashboard (Settings → Environment Variables) as a
 * comma-separated list, e.g.:
 *   ADMIN_EMAILS = alice@example.com, bob@example.com
 *
 * If the variable is not set, no one will be treated as an admin.
 */

export function getAdminEmails(): string[] {
    const envEmails = process.env.ADMIN_EMAILS;
    if (envEmails) {
        return envEmails.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
    }
    return [];
}

export function isAdminEmail(email: string | undefined): boolean {
    if (!email) return false;
    return getAdminEmails().includes(email.toLowerCase());
}
