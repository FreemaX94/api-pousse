// config/redisClient.js
const Redis = require('ioredis');
const logger = require('../utils/logger');

// Par défaut : localhost:6379 — personnalise si besoin via .env
const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379
});

redis.on('connect', () => logger.log('✅ Redis connecté'));
redis.on('error', (err) => logger.error('❌ Erreur Redis :', err));

module.exports = redis;
