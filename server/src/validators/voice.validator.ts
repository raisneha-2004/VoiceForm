import { z } from 'zod';

export const voiceProcessSchema = z.object({
  body: z.object({
    submissionId: z.string().min(1, 'submissionId is required'),
    templateId: z.string().min(1, 'templateId is required'),
    transcript: z.string().min(1, 'transcript cannot be empty'),
    language: z.enum(['en-US', 'hi-IN', 'hinglish', 'en-IN']).default('en-IN'),
    activeFieldKey: z.string().optional()
  })
});

export const voiceConfirmSensitiveSchema = z.object({
  body: z.object({
    submissionId: z.string().min(1, 'submissionId is required'),
    fieldKey: z.string().min(1, 'fieldKey is required'),
    value: z.any(),
    confirmed: z.boolean()
  })
});

export const voiceReviewSchema = z.object({
  body: z.object({
    submissionId: z.string().min(1, 'submissionId is required')
  })
});

export const voiceCommandSchema = z.object({
  body: z.object({
    submissionId: z.string().min(1, 'submissionId is required'),
    command: z.string().min(1, 'command is required'),
    activeFieldKey: z.string().optional()
  })
});
