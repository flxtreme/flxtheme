// src/lib/date.ts

export * from "date-fns";

import { formatDistanceToNow, parseISO } from "date-fns";

export type DateValue = Date | string | number;

export function toDate(value: DateValue): Date {
    if (value instanceof Date) return value;
    if (typeof value === "string") return parseISO(value);
    return new Date(value);
}

export function timeAgo(value: DateValue): string {
    return formatDistanceToNow(toDate(value), {
        addSuffix: true,
    });
}