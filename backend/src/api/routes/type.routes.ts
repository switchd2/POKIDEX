import { Router } from 'express';
import * as typeController from '../controllers/type.controller';
import { cacheMiddleware } from '../middleware/cache.middleware';

const router = Router();

router.get('/', cacheMiddleware(604800), typeController.getAllTypes);
router.get('/:name', cacheMiddleware(604800), typeController.getTypeByName);

export default router;
