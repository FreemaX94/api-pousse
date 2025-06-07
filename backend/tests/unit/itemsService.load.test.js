const service = require('../../services/itemsService');

describe('itemsService module', () => {
  test('loads without errors', () => {
    expect(service).toBeTruthy();
  });
});
