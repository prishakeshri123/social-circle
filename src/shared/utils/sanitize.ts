import DOMPurify from 'dompurify';

const ALLOWED_TAGS = [
  'p',
  'br',
  'strong',
  'em',
  'u',
  's',
  'a',
  'ul',
  'ol',
  'li',
  'h1',
  'h2',
  'h3',
  'blockquote',
  'code',
  'pre',
];

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });
}
