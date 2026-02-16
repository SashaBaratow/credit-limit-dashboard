export function maskAccount(account: string): string {
    const trimmed = account.trim();
    if (trimmed.length <= 9) return trimmed;

    const prefix = trimmed.slice(0, 5);
    const suffix = trimmed.slice(-4);

    return `${prefix} **** ${suffix}`;
}
