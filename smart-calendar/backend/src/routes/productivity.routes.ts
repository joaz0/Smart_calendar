import { Router } from 'express';
import ProductivityController from '../controllers/productivity.controller';

const router = Router();

router.get('/', (req, res) => ProductivityController.list(req, res));
router.post('/upsert', (req, res) => ProductivityController.upsert(req, res));

export default router;
