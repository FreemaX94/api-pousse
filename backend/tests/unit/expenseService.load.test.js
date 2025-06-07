const service = require('../../services/expenseService');

describe('expenseService module', () => {
  test('loads without errors', () => {
    expect(service).toBeTruthy();
  });
});
