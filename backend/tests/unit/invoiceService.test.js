
describe('invoiceService.js', () => {
  it('should load without throwing', () => {
    jest.resetModules();
    const service = require('../../../backend/services/invoiceService.js');
    expect(typeof service).toBe('object');
  });
});
