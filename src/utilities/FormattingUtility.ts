Number.prototype.formatAsCompact = function (
    this: number,
    thresholds: { value: number; symbol: string }[] = [
        { value: 1_000, symbol: 'K' },
        { value: 1_000_000, symbol: 'M' },
        { value: 1_000_000_000, symbol: 'B' }
    ]
): string {
    thresholds.sort((a, b) => b.value - a.value);

    const absNumber = Math.abs(this);

    // Format the number based on the thresholds
    for (const { value, symbol } of thresholds) {
        if (absNumber >= value) {
            const compactNumber = this / value;
            const roundedCompactNumber = Math.round(compactNumber * 10) / 10;
            const isWholeNumber = roundedCompactNumber % 1 === 0;

            // Use up to one decimal place if not a whole compact number and less than 10
            if (isWholeNumber) {
                return `${Math.round(compactNumber)}${symbol}`;
            }
            if (roundedCompactNumber < 10) {
                return `${roundedCompactNumber.toFixed(1)}${symbol}`;
            }
            return `${Math.round(roundedCompactNumber)}${symbol}`;
        }
    }

    // Return the original number if it doesn't meet any thresholds
    return this.toString();
};

Number.prototype.formatWithSeparator = function (this: number, separator = ' '): string {
    if (typeof this !== 'number') {
        throw new Error('Required parameter "number" is not a number.');
    }

    const integerString = Math.round(this).toString();

    // Add the separator every three digits using a regular expression
    return integerString.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
};
