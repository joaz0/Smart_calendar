import { Router } from 'express';
import AiTrainingController from '../controllers/ai-training.controller';

const router = Router();

router.get('/', (req, res) => AiTrainingController.listDatasets(req, res));
router.post('/', (req, res) => AiTrainingController.createDataset(req, res));
router.get('/:id', (req, res) => AiTrainingController.getDataset(req, res));
router.get('/:datasetId/examples', (req, res) => AiTrainingController.listExamples(req, res));
router.post('/:datasetId/examples', (req, res) => AiTrainingController.addExample(req, res));

export default router;
