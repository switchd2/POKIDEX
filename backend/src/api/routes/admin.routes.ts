import { Router } from 'express';
import { addPokemonToQueue } from '../../scraper/scraper.manager';
import logger from '../../utils/logger';

const router = Router();

router.post('/scrape/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    // For simplicity, using slug as name for now, 
    // though scraper might need the actual name (e.g. "Bulbasaur")
    await addPokemonToQueue(slug);
    res.json({ success: true, message: `Scrape job added for ${slug}` });
  } catch (error) {
    logger.error('Error adding scrape job:', error);
    res.status(500).json({ success: false, error: { message: 'Failed to add scrape job' } });
  }
});

export default router;
