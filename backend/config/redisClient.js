// config/redisClient.js
const Redis = require('ioredis');

// Par défaut : localhost:6379 — personnalise si besoin via .env
const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379
});

redis.on('connect', () => console.log('✅ Redis connecté'));
redis.on('error', (err) => console.error('❌ Erreur Redis :', err));

module.exports = redis;
