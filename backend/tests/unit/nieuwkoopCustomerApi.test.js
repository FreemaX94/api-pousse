
describe('nieuwkoopCustomerApi.js', () => {
  it('should load without throwing', () => {
    jest.resetModules();
    const service = require('../../../backend/services/nieuwkoopCustomerApi.js');
    expect(typeof service).toBe('object');
  });
});
