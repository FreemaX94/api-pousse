
describe('sheetSyncService.js', () => {
  it('should load without throwing', () => {
    jest.resetModules();
    const service = require('../../../backend/services/sheetSyncService.js');
    expect(typeof service).toBe('object');
  });
});
