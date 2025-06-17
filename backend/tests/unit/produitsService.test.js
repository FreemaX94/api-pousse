
describe('produitsService.js', () => {
  it('should load without throwing', () => {
    jest.resetModules();
    const service = require('../../../backend/services/produitsService.js');
    expect(typeof service).toBe('object');
  });
});
