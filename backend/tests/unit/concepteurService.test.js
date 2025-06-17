
describe('concepteurService.js', () => {
  it('should load without throwing', () => {
    jest.resetModules();
    const service = require('../../../backend/services/concepteurService.js');
    expect(typeof service).toBe('object');
  });
});
