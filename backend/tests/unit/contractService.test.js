
describe('contractService.js', () => {
  it('should load without throwing', () => {
    jest.resetModules();
    const service = require('../../../backend/services/contractService.js');
    expect(typeof service).toBe('object');
  });
});
