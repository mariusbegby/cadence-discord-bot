export function formatDuration(durationMs: number): string {
    const durationDate: Date = new Date(0);
    durationDate.setMilliseconds(durationMs);

    const durationDays: number = durationDate.getUTCDate() - 1;
    const durationHours: number = durationDate.getUTCHours();
    const durationMinutes: number = durationDate.getUTCMinutes();
    const durationSeconds: number = durationDate.getUTCSeconds();

    if (durationDays >= 1) {
        return `${durationDays}d ${durationHours}h`;
    } else if (durationHours >= 1) {
        return `${durationHours}h ${durationMinutes}m`;
    } else if (durationMinutes >= 1) {
        return `${durationMinutes}m ${durationSeconds}s`;
    } else {
        return `${durationSeconds}s`;
    }
}
