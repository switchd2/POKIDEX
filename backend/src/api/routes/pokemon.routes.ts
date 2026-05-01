import { Router } from 'express';
import * as pokemonController from '../controllers/pokemon.controller';
import { cacheMiddleware } from '../middleware/cache.middleware';

const router = Router();

router.get('/', cacheMiddleware(3600), pokemonController.getAllPokemon);
router.get('/:slug', cacheMiddleware(86400), pokemonController.getPokemonBySlug);
router.get('/:id/navigation', cacheMiddleware(86400), pokemonController.getNextPrevPokemon);

export default router;
