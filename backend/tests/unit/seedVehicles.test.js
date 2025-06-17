jest.mock('mongoose', () => ({
  Schema: class {},
  model: () => ({}),
  connect: jest.fn(() => Promise.resolve()),
  disconnect: jest.fn(() => Promise.resolve()),
  Types: { ObjectId: jest.fn() }
}));

process.env.MONGO_URI = 'mongodb://localhost/fake';

describe('seedVehicles', () => {
  it('should load the module and export a function', () => {
    const { seedVehicles } = require('../../seed/seedVehicles');
    expect(typeof seedVehicles).toBe('function');
  });
});
