import { Router } from 'express';
import * as generationController from '../controllers/generation.controller';

const router = Router();

router.get('/', generationController.getAllGenerations);
router.get('/:number', generationController.getGenerationByNumber);

export default router;
