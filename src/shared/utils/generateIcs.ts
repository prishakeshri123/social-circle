interface IcsEventInput {
  title: string;
  description?: string;
  location?: string;
  startAt: string | Date;
  endAt?: string | Date;
}

function toIcsDate(date: string | Date): string {
  return new Date(date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .replace(/\n/g, '\\n');
}

export function generateIcs(event: IcsEventInput): string {
  const start = toIcsDate(event.startAt);
  const end = event.endAt ? toIcsDate(event.endAt) : start;

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Social Circle//EN',
    'BEGIN:VEVENT',
    `UID:${crypto.randomUUID()}`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
  ];

  if (event.description) lines.push(`DESCRIPTION:${escapeIcsText(event.description)}`);
  if (event.location) lines.push(`LOCATION:${escapeIcsText(event.location)}`);

  lines.push('END:VEVENT', 'END:VCALENDAR');

  return lines.join('\r\n');
}

export function downloadIcs(event: IcsEventInput, filename = 'event.ics'): void {
  const blob = new Blob([generateIcs(event)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
