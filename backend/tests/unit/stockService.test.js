
describe('stockService.js', () => {
  it('should load without throwing', () => {
    jest.resetModules();
    const service = require('../../../backend/services/stockService.js');
    expect(typeof service).toBe('object');
  });
});
