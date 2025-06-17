
describe('expenseService.js', () => {
  it('should load without throwing', () => {
    jest.resetModules();
    const service = require('../../../backend/services/expenseService.js');
    expect(typeof service).toBe('object');
  });
});
