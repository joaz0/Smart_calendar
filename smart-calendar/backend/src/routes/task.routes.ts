import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';

const router = Router();
const taskController = new TaskController();

router.get('/', (req, res) => taskController.getAll(req, res));
router.get('/search', (req, res) => taskController.search(req, res));
router.get('/:id', (req, res) => taskController.getById(req, res));
router.post('/', (req, res) => taskController.create(req, res));
router.put('/:id', (req, res) => taskController.update(req, res));
router.delete('/:id', (req, res) => taskController.delete(req, res));

export default router;
