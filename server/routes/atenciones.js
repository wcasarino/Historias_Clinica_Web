import express from 'express';

import { getAtenciones, getAtencionesBySearch } from '../controllers/atenciones.js';

const router = express.Router();
router.get('/search', getAtencionesBySearch);
router.get('/', getAtenciones);

export default router;