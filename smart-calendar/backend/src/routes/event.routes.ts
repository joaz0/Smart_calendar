import { Router } from 'express';
import eventController from '../controllers/event.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', (req, res) => eventController.getAll(req, res));
router.get('/search', (req, res) => eventController.search(req, res));
router.get('/:id', (req, res) => eventController.getById(req, res));
router.post('/', (req, res) => eventController.create(req, res));
router.put('/:id', (req, res) => eventController.update(req, res));
router.delete('/:id', (req, res) => eventController.delete(req, res));

export default router;
