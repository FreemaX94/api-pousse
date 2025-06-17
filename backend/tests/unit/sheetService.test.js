
describe('sheetService.js', () => {
  it('should load without throwing', () => {
    jest.resetModules();
    const service = require('../../../backend/services/sheetService.js');
    expect(typeof service).toBe('object');
  });
});
