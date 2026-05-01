import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import logger from './utils/logger';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

import pokemonRoutes from './api/routes/pokemon.routes';

// Routes
app.use('/api/v1/pokemon', pokemonRoutes);

export default app;
