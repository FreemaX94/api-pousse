
describe('itemsService.js', () => {
  it('should load without throwing', () => {
    jest.resetModules();
    const service = require('../../../backend/services/itemsService.js');
    expect(typeof service).toBe('object');
  });
});
