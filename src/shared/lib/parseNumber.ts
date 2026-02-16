export function parseNumber(value: string): number | null {
    const normalized = value.replace(/\s/g, '').replace(',', '.');
    if (!normalized) return null;

    const num = Number(normalized);
    return Number.isFinite(num) ? num : null;
}
