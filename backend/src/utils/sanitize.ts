import sanitizeHtml from 'sanitize-html';

const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

// sanitize-html escapes entities in its output, so decode them back.
// Stored text stays plain; it is escaped again when rendered (React, email templates).
function decodeEntities(value: string): string {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

/** Removes every HTML tag and control character from user text, then trims it. */
export function stripHtml(value: string): string {
  const cleaned = sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} });
  return decodeEntities(cleaned).replace(CONTROL_CHARS, '').trim();
}

/** Collapses whitespace so a value is safe in an email subject line. */
export function oneLine(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}