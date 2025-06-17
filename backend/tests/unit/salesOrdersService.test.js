
describe('salesOrdersService.js', () => {
  it('should load without throwing', () => {
    jest.resetModules();
    const service = require('../../../backend/services/salesOrdersService.js');
    expect(typeof service).toBe('object');
  });
});
