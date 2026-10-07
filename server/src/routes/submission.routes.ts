import { Router } from 'express';
import { SubmissionController } from '../controllers/submission.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  createSubmissionSchema,
  updateSubmissionSchema,
  submissionIdParamSchema
} from '../validators/submission.validator.js';

const router = Router();

router.use(authenticate);

router.get('/', SubmissionController.listSubmissions);
router.post('/', validate(createSubmissionSchema), SubmissionController.createSubmission);
router.get('/:id', validate(submissionIdParamSchema), SubmissionController.getSubmission);
router.patch('/:id', validate(updateSubmissionSchema), SubmissionController.updateSubmission);
router.delete('/:id', validate(submissionIdParamSchema), SubmissionController.deleteSubmission);
router.post('/:id/duplicate', validate(submissionIdParamSchema), SubmissionController.duplicateSubmission);
router.post('/:id/submit', validate(submissionIdParamSchema), SubmissionController.submitSubmission);
router.get('/:id/pdf', validate(submissionIdParamSchema), SubmissionController.downloadPdf);

export default router;
