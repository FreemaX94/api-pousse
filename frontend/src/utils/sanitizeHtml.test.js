// frontend/src/utils/sanitizeHtml.test.js
import { sanitizeHtml } from './sanitizeHtml';

describe('sanitizeHtml', () => {
  it('supprime les attributs et tags dangereux', () => {
    const raw = `
      <div onclick="evil()">Click</div>
      <img src="x" onerror="stealCookie()">
      <script>alert('hack')</script>
      <p>OK</p>
    `;
    const { __html } = sanitizeHtml(raw);

    expect(__html).not.toMatch(/onclick=/i);
    expect(__html).not.toMatch(/onerror=/i);
    expect(__html).not.toMatch(/<script>/i);
    expect(__html).toContain('<div>');
    expect(__html).toContain('<img');
    expect(__html).toContain('<p>OK</p>');
  });
});
