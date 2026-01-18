const Redis = require('ioredis');
require('dotenv').config();

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3
});

redis.on('connect', () => {
  console.log('✅ Connected to Redis');
});

redis.on('error', (err) => {
  console.error('❌ Redis error:', err);
});

// Helper functions
const cache = {
  get: async (key) => {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  },

  set: async (key, value, ttl = 3600) => {
    await redis.set(key, JSON.stringify(value), 'EX', ttl);
  },

  del: async (key) => {
    await redis.del(key);
  },

  exists: async (key) => {
    return await redis.exists(key) === 1;
  }
};

module.exports = { redis, cache };
