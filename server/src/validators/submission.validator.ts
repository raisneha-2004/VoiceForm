import { z } from 'zod';

export const createSubmissionSchema = z.object({
  body: z.object({
    templateId: z.string().min(1, 'templateId is required'),
    title: z.string().optional(),
    initialValues: z.record(z.any()).optional()
  })
});

export const updateSubmissionSchema = z.object({
  params: z.object({
    id: z.string().min(1)
  }),
  body: z.object({
    values: z.record(z.any()).optional(),
    title: z.string().optional(),
    status: z.enum(['draft', 'in_progress', 'completed']).optional()
  })
});

export const submissionIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1)
  })
});
