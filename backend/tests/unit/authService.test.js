
describe('authService.js', () => {
  it('should load without throwing', () => {
    jest.resetModules();
    const service = require('../../../backend/services/authService.js');
    expect(typeof service).toBe('object');
  });
});
