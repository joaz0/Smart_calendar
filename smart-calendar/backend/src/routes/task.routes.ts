import { Router } from 'express';
import taskController from '../controllers/task.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', (req, res) => taskController.getAll(req, res));
router.get('/search', (req, res) => taskController.search(req, res));
router.get('/:id', (req, res) => taskController.getById(req, res));
router.post('/', (req, res) => taskController.create(req, res));
router.put('/:id', (req, res) => taskController.update(req, res));
router.delete('/:id', (req, res) => taskController.delete(req, res));

export default router;
