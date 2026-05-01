import cron from 'node-cron';
import { addPokemonToQueue } from './scraper/scraper.manager';
import logger from './utils/logger';

// Full re-scrape: every 30 days
cron.schedule('0 0 1 * *', async () => {
  logger.info('Starting scheduled full re-scrape...');
  // Logic to get all pokemon names and add to queue
});

logger.info('Scraper scheduler initialized');
