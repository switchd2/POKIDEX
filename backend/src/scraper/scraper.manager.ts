import Queue from 'bull';
import { scrapePokemon } from './sources/bulbapedia.scraper';
import logger from '../utils/logger';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const scrapeQueue = new Queue('scrape-pokemon', process.env.REDIS_URL || 'redis://localhost:6379');

export async function addPokemonToQueue(name: string) {
  await scrapeQueue.add({ name }, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000
    }
  });
}

scrapeQueue.process(process.env.SCRAPE_CONCURRENCY ? parseInt(process.env.SCRAPE_CONCURRENCY) : 1, async (job) => {
  const { name } = job.data;
  logger.info(`Starting scrape job for ${name}`);
  
  try {
    const data = await scrapePokemon(name);
    if (!data) throw new Error(`Failed to scrape ${name}`);

    // Transform and Upsert into DB
    // await prisma.pokemon.upsert({ ... });

    logger.info(`Successfully scraped and saved ${name}`);
  } catch (error) {
    logger.error(`Failed job for ${name}:`, error);
    throw error;
  }
});

export default scrapeQueue;
