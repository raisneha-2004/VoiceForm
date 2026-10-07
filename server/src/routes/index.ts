import { Router } from 'express';
import authRoutes from './auth.routes.js';
import templateRoutes from './template.routes.js';
import submissionRoutes from './submission.routes.js';
import voiceRoutes from './voice.routes.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

router.use('/auth', authRoutes);
router.use('/templates', templateRoutes);
router.use('/submissions', submissionRoutes);
router.use('/voice', voiceRoutes);

export default router;
