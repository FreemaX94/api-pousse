const { sanitizeHtml } = require('../../utils/sanitizeHtml');

describe('sanitizeHtml', () => {
  test('supprime les balises <script>', () => {
    const dirty = '<div>Hello<script>alert("hack")</script></div>';
    const clean = sanitizeHtml(dirty);
    expect(clean).toBe('<div>Hello</div>');
  });

  test('garde les balises sûres comme <b>', () => {
    const dirty = '<b>Important</b>';
    const clean = sanitizeHtml(dirty);
    expect(clean).toBe('<b>Important</b>');
  });
});