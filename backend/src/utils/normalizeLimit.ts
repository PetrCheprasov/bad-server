const DEFAULT_LIMIT = 10
const MAX_LIMIT = 10

export default function normalizeLimit(
    limit: unknown,
    defaultLimit = DEFAULT_LIMIT,
    maxLimit = MAX_LIMIT
): number {
    const parsed = Number(limit)

    if (Number.isNaN(parsed) || parsed < 1) {
        return defaultLimit
    }

    return Math.min(parsed, maxLimit)
}
