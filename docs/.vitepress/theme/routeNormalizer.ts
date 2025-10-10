/**
 * Route normalizer for handling case-insensitive paths
 * This helps prevent 404 errors when users type URLs with different case
 */

export interface RouteMapping {
    pattern: RegExp;
    replacement: string;
}

/**
 * Define all route mappings for case-insensitive paths
 */
export const routeMappings: RouteMapping[] = [
    // Major Arcana paths
    { pattern: /\/majorarcana\//i, replacement: "/MajorArcana/" },

    // Minor Arcana paths
    { pattern: /\/minorarcana\//i, replacement: "/MinorArcana/" },

    // Tarot Spread paths
    { pattern: /\/tarotspread\//i, replacement: "/TarotSpread/" },
];

/**
 * Normalize a path to match the correct case
 * @param path - The input path
 * @returns Normalized path or original if no match found
 */
export function normalizePath(path: string): string {
    let normalizedPath = path;

    for (const mapping of routeMappings) {
        if (mapping.pattern.test(normalizedPath)) {
            normalizedPath = normalizedPath.replace(
                mapping.pattern,
                mapping.replacement
            );
        }
    }

    return normalizedPath;
}

/**
 * Check if a path needs normalization
 * @param path - The input path
 * @returns true if path needs normalization
 */
export function needsNormalization(path: string): boolean {
    const normalized = normalizePath(path);
    return normalized !== path;
}
