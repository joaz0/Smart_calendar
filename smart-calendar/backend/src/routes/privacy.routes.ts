import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { getPrivacySettings, updatePrivacySettings, checkPrivacy } from '../controllers/privacy.controller';

const router = Router();

router.get('/settings', authenticateToken, getPrivacySettings);
router.put('/settings', authenticateToken, updatePrivacySettings);
router.post('/check', authenticateToken, checkPrivacy);

export default router;
