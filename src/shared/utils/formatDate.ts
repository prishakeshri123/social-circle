import { format, formatDistanceToNow, isThisYear, isToday, isYesterday } from 'date-fns';

export function formatDate(date: string | Date, pattern = 'MMM d, yyyy'): string {
  return format(new Date(date), pattern);
}

export function formatTime(date: string | Date): string {
  return format(new Date(date), 'h:mm a');
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'MMM d, yyyy · h:mm a');
}

export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatChatTimestamp(date: string | Date): string {
  const d = new Date(date);
  if (isToday(d)) return formatTime(d);
  if (isYesterday(d)) return `Yesterday · ${formatTime(d)}`;
  return formatDateTime(d);
}

export function formatConversationTimestamp(date: string | Date): string {
  const d = new Date(date);
  if (isToday(d)) return formatTime(d);
  if (isYesterday(d)) return 'Yesterday';
  if (isThisYear(d)) return format(d, 'MMM d');
  return format(d, 'MMM d, yyyy');
}
