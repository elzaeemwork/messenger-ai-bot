// lib/utils/formatters.ts — Date/number formatting utilities

import { formatDistanceToNow, format } from 'date-fns';

export function timeAgo(date: string | Date): string {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatDate(date: string | Date, fmt: string = 'MMM dd, yyyy HH:mm'): string {
    return format(new Date(date), fmt);
}

export function formatDuration(ms: number): string {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
}

export function formatNumber(num: number): string {
    return num.toLocaleString();
}

export function truncate(text: string, maxLength: number = 50): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}
