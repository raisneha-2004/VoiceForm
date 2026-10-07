import { Router } from 'express';
import { TemplateController } from '../controllers/template.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { authenticate, optionalAuthenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';
import {
  createTemplateSchema,
  updateTemplateSchema,
  templateIdParamSchema
} from '../validators/template.validator.js';

const router = Router();

router.get('/', optionalAuthenticate, TemplateController.listTemplates);
router.get('/:id', optionalAuthenticate, validate(templateIdParamSchema), TemplateController.getTemplate);

router.post(
  '/',
  authenticate,
  authorize('admin'),
  validate(createTemplateSchema),
  TemplateController.createTemplate
);

router.patch(
  '/:id',
  authenticate,
  authorize('admin'),
  validate(updateTemplateSchema),
  TemplateController.updateTemplate
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  validate(templateIdParamSchema),
  TemplateController.deleteTemplate
);

router.patch(
  '/:id/publish',
  authenticate,
  authorize('admin'),
  validate(templateIdParamSchema),
  TemplateController.publishTemplate
);

export default router;
