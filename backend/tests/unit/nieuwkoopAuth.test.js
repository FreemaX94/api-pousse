
describe('nieuwkoopAuth.js', () => {
  it('should load without throwing', () => {
    jest.resetModules();
    const service = require('../../../backend/services/nieuwkoopAuth.js');
    expect(typeof service).toBe('object');
  });
});
