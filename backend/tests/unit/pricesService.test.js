
describe('pricesService.js', () => {
  it('should load without throwing', () => {
    jest.resetModules();
    const service = require('../../../backend/services/pricesService.js');
    expect(typeof service).toBe('object');
  });
});
