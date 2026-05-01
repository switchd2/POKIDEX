import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';
import logger from '../utils/logger';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export const cacheMiddleware = (duration: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = `cache:${req.originalUrl || req.url}`;
    
    try {
      const cachedResponse = await redis.get(key);
      if (cachedResponse) {
        logger.info(`Cache hit for ${key}`);
        return res.json(JSON.parse(cachedResponse));
      }

      // Override res.json to store in cache
      const originalJson = res.json.bind(res);
      res.json = (body: any) => {
        if (res.statusCode === 200) {
          redis.set(key, JSON.stringify(body), 'EX', duration);
        }
        return originalJson(body);
      };

      next();
    } catch (error) {
      logger.error('Cache error:', error);
      next();
    }
  };
};

export const flushCache = async () => {
  await redis.flushall();
  logger.info('Cache flushed');
};
