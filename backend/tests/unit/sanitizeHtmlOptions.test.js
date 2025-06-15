const options = require('../../../backend/config/sanitizeHtmlOptions');

describe('sanitizeHtmlOptions.js', () => {
  test('doit contenir les balises autorisées', () => {
    expect(options.allowedTags).toContain('a');
    expect(options.allowedTags).toContain('ul');
  });

  test('doit définir les attributs autorisés pour les balises', () => {
    expect(options.allowedAttributes).toHaveProperty('a');
    expect(options.allowedAttributes.a).toContain('href');
  });

  test('doit autoriser certains schémas', () => {
    expect(options.allowedSchemes).toContain('https');
    expect(options.allowedSchemes).toContain('mailto');
  });
});
