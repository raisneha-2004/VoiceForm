import { Router } from 'express';
import { VoiceController } from '../controllers/voice.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { voiceLimiter } from '../middleware/rateLimiter.middleware.js';
import {
  voiceProcessSchema,
  voiceConfirmSensitiveSchema,
  voiceReviewSchema,
  voiceCommandSchema
} from '../validators/voice.validator.js';

const router = Router();

router.use(authenticate);

router.post('/process', voiceLimiter, validate(voiceProcessSchema), VoiceController.processVoice);
router.post('/confirm-sensitive', validate(voiceConfirmSensitiveSchema), VoiceController.confirmSensitive);
router.post('/review', validate(voiceReviewSchema), VoiceController.reviewVoiceForm);
router.post('/command', voiceLimiter, validate(voiceCommandSchema), VoiceController.commandVoice);

export default router;
