
describe('nieuwkoopApi.js', () => {
  it('should load without throwing', () => {
    jest.resetModules();
    const service = require('../../../backend/services/nieuwkoopApi.js');
    expect(typeof service).toBe('object');
  });
});
