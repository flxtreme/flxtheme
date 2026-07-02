export function formatNumber(
    value: number,
    options?: Intl.NumberFormatOptions
): string {
    return new Intl.NumberFormat(undefined, options).format(value);
}

export function formatCurrency(
    value: number,
    currency = "USD",
    locale?: string
): string {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
    }).format(value);
}

export function formatPercent(
    value: number,
    locale?: string,
    fractionDigits = 0
): string {
    return new Intl.NumberFormat(locale, {
        style: "percent",
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
    }).format(value);
}

export function formatCompact(
    value: number,
    locale?: string
): string {
    return new Intl.NumberFormat(locale, {
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(value);
}

export function numclamp(
    value: number,
    min: number,
    max: number
): number {
    return Math.min(Math.max(value, min), max);
}

export function round(
    value: number,
    decimals = 2
): number {
    const factor = 10 ** decimals;
    return Math.round(value * factor) / factor;
}

export function random(
    min = 0,
    max = 1
): number {
    return Math.random() * (max - min) + min;
}

export function randomInt(
    min: number,
    max: number
): number {
    return Math.floor(random(min, max + 1));
}