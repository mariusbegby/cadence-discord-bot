interface Number {
    formatAsCompact: (thresholds?: { value: number; symbol: string }[]) => string;
    formatWithSeparator: (separator?: string) => string;
}
