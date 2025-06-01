module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },
  roots: [
    '<rootDir>/tests/integration',
    '<rootDir>/tests/unit'
  ],
  testMatch: ['**/*.test.js'],

  // ✅ Charge automatiquement les variables d’environnement
  setupFiles: ['dotenv/config'],

  // 🧪 Setup spécifique à l’intégration (facultatif pour les tests unitaires)
  setupFilesAfterEnv: ['<rootDir>/tests/integration/setup.js'],

  moduleFileExtensions: ['js', 'jsx', 'json', 'node']
};
