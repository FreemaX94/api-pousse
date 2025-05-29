module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },
  roots: [
    '<rootDir>/tests/unit',
    '<rootDir>/tests/integration'
  ],
  testMatch: ['**/*.test.js'],

  // ✅ Charge automatiquement .env dans les tests
  setupFiles: ['dotenv/config'],

  setupFilesAfterEnv: ['<rootDir>/tests/integration/setup.js'],
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
};
