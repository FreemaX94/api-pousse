// frontend/src/utils/sanitizeHtml.js
import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks.
 * @param {string} html - The raw HTML string to sanitize.
 * @returns {{ __html: string }} - Object for React's dangerouslySetInnerHTML.
 */
export function sanitizeHtml(html) {
  return { __html: DOMPurify.sanitize(html) };
}
