import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import logger from './utils/logger';

import { apiRateLimiter } from './api/middleware/rateLimit.middleware';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
app.use('/api/v1', apiRateLimiter);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

import pokemonRoutes from './api/routes/pokemon.routes';
import adminRoutes from './api/routes/admin.routes';
import searchRoutes from './api/routes/search.routes';
import generationRoutes from './api/routes/generation.routes';
import typeRoutes from './api/routes/type.routes';

// Routes
app.use('/api/v1/pokemon', pokemonRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/generations', generationRoutes);
app.use('/api/v1/types', typeRoutes);

export default app;
