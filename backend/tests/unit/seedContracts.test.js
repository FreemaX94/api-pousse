jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  return {
    ...actualMongoose,
    connect: jest.fn(() => Promise.resolve()),
    disconnect: jest.fn(() => Promise.resolve())
  };
});

process.env.MONGO_URI = 'mongodb://localhost/fake';

describe('seedContracts', () => {
  it('should load the module and export a function', () => {
    const { seedContracts } = require('../../seed/seedContracts');
    expect(typeof seedContracts).toBe('function');
  });
});
