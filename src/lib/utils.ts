import { clsx } from 'clsx';

export function cn(...inputs: Array<string | false | null | undefined>) {
  return clsx(inputs);
}

export function formatDate(date?: string | null) {
  if (!date) return '—';
  try {
    return new Intl.DateTimeFormat('pt-PT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(new Date(date));
  } catch (error) {
    return date;
  }
}

export function truncate(text: string, length = 160) {
  if (text.length <= length) return text;
  return `${text.slice(0, length)}…`;
}
