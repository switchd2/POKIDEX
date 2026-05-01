import { Router } from 'express';
import * as pokemonController from '../controllers/pokemon.controller';

const router = Router();

router.get('/', pokemonController.getAllPokemon);
router.get('/:slug', pokemonController.getPokemonBySlug);

export default router;
