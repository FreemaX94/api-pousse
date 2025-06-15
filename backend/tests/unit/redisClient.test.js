// tests/unit/redisClient.test.js
const Redis = require('ioredis-mock'); // Utilise ioredis-mock pour des tests isolés
jest.mock('ioredis', () => require('ioredis-mock')); // Redirige vers ioredis-mock

const logger = require('../../../backend/utils/logger');
jest.mock('../../../backend/utils/logger', () => ({
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
}));

const redis = require('../../../backend/config/redisClient');

describe('redisClient.js', () => {
  afterAll(async () => {
    await redis.quit(); // Ferme proprement Redis mock
  });

  test('devrait se connecter avec succès et stocker une valeur', async () => {
    await redis.set('clé_test', 'valeur_test');
    const val = await redis.get('clé_test');
    expect(val).toBe('valeur_test');
  });

  test('ne devrait PAS logger la connexion en environnement test', () => {
    expect(logger.log).not.toHaveBeenCalledWith(expect.stringContaining('Redis connecté'));
  });

  test('devrait logger une erreur simulée avec logger.error', () => {
    const error = new Error('Erreur simulée');
    redis.emit('error', error);
    expect(logger.error).toHaveBeenCalledWith('❌ Erreur Redis :', 'Erreur simulée');
  });

  test('ne devrait PAS logger "end" en environnement test', () => {
    redis.emit('end');
    expect(logger.warn).not.toHaveBeenCalledWith(expect.stringContaining('Connexion Redis terminée'));
  });

  test('devrait utiliser retryStrategy et logger le warning', () => {
    const retryDelay = redis.options.retryStrategy(3);
    expect(retryDelay).toBe(300);
    expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Tentative #3 de reconnexion Redis'));
  });
});
