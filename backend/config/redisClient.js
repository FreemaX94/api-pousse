// config/redisClient.js
const Redis = require('ioredis');
const logger = require('../utils/logger');

const isTestEnv = process.env.NODE_ENV === 'test';

// Sécurité minimale : log si variable importante manquante
const host = process.env.REDIS_HOST || '127.0.0.1';
const port = process.env.REDIS_PORT || 6379;

// Configuration avancée avec stratégie de reconnexion
const redis = new Redis({
  host,
  port,
  retryStrategy(times) {
    const delay = Math.min(times * 100, 2000); // max 2s entre les tentatives
    logger.warn(`🔁 Tentative #${times} de reconnexion Redis dans ${delay}ms`);
    return delay;
  },
  connectTimeout: 5000, // timeout de connexion initiale (5s)
});

// Événements de connexion
redis.on('connect', () => {
  if (!isTestEnv) logger.log(`✅ Redis connecté sur ${host}:${port}`);
});

redis.on('ready', () => {
  if (!isTestEnv) logger.log('🚀 Redis prêt à recevoir des commandes');
});

redis.on('error', (err) => {
  logger.error('❌ Erreur Redis :', err.message || err);
});

redis.on('end', () => {
  if (!isTestEnv) logger.warn('⛔ Connexion Redis terminée');
});

module.exports = redis;
