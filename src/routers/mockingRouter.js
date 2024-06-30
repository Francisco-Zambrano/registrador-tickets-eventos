import { Router } from 'express';
import { generateMockProducts } from '../controllers/mockingController.js';

export const router = Router();

router.get('/', generateMockProducts);