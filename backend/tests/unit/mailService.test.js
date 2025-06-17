
describe('mailService.js', () => {
  it('should load without throwing', () => {
    jest.resetModules();
    const service = require('../../../backend/services/mailService.js');
    expect(typeof service).toBe('object');
  });
});
