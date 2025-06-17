
describe('catalogueService.js', () => {
  it('should load without throwing', () => {
    jest.resetModules();
    const service = require('../../../backend/services/catalogueService.js');
    expect(typeof service).toBe('object');
  });
});
