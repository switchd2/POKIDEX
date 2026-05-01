import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';
import logger from '../../utils/logger';
import { parseInfobox, parseBiology, parseOrigin } from '../parsers/pokemon.parser';
import { parseBaseStats } from '../parsers/stats.parser';
import { parseLearnset } from '../parsers/moves.parser';
import { parseEvolutionChain } from '../parsers/evolutions.parser';

const BASE_URL = "https://bulbapedia.bulbagarden.net/wiki";
const CACHE_DIR = path.join(__dirname, '../../../scraper-cache');

export interface RawPokemonData {
  infobox: any;
  biology: any;
  origin: any;
  stats: any;
  typeEff: any;
  evolution: any;
  learnset: any;
  locations: any;
  flavor: any;
  sprites: any;
  anime: any;
}

export async function scrapePokemon(name: string): Promise<RawPokemonData | null> {
  const slug = `${encodeURIComponent(name)}_(Pokémon)`;
  const url = `${BASE_URL}/${slug}`;
  const cachePath = path.join(CACHE_DIR, `${name.toLowerCase()}.html`);

  let html: string;

  try {
    // 1. Check local HTML cache
    await fs.mkdir(CACHE_DIR, { recursive: true });
    try {
      html = await fs.readFile(cachePath, 'utf-8');
      logger.info(`Loaded ${name} from cache`);
    } catch (err) {
      // 2. Fetch using Puppeteer
      logger.info(`Fetching ${name} from Bulbapedia...`);
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        html = await page.content();
      } finally {
        await browser.close();
      }

      // Save to cache
      await fs.writeFile(cachePath, html);
      
      // Delay to be respectful
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // 3. Load into Cheerio
    const $ = cheerio.load(html);

    // 4. Parse sections
    return {
      infobox: parseInfobox($),
      biology: parseBiology($),
      origin: parseOrigin($),
      stats: parseBaseStats($),
      typeEff: {}, // TODO
      evolution: parseEvolutionChain($),
      learnset: parseLearnset($),
      locations: {}, // TODO
      flavor: {}, // TODO
      sprites: {}, // TODO
      anime: {} // TODO
    };

  } catch (error) {
    logger.error(`Error scraping ${name}:`, error);
    return null;
  }
}
