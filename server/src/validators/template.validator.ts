import { z } from 'zod';

const selectOptionSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1)
});

const conditionalRuleSchema = z.object({
  dependsOnKey: z.string().min(1),
  condition: z.enum(['equals', 'notEquals', 'contains']),
  value: z.any()
});

const validationRuleSchema = z.object({
  min: z.number().optional(),
  max: z.number().optional(),
  pattern: z.string().optional(),
  customErrorMessage: z.string().optional()
});

export const formFieldSchema = z.object({
  id: z.string().min(1),
  key: z.string().min(1).regex(/^[a-zA-Z0-9_-]+$/, 'Field key must be alphanumeric, hyphen, or underscore'),
  label: z.string().min(1),
  type: z.enum([
    'text',
    'textarea',
    'number',
    'email',
    'phone',
    'date',
    'select',
    'checkbox',
    'radio',
    'file'
  ]),
  placeholder: z.string().optional(),
  required: z.boolean().default(false),
  helpText: z.string().optional(),
  isSensitive: z.boolean().default(false),
  options: z.array(selectOptionSchema).optional(),
  conditional: conditionalRuleSchema.optional(),
  validation: validationRuleSchema.optional(),
  defaultValue: z.any().optional(),
  order: z.number().default(0)
});

export const createTemplateSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(150),
    slug: z.string().min(3).max(150).optional(),
    description: z.string().min(5),
    category: z.enum([
      'Education',
      'Employment',
      'Healthcare',
      'Events',
      'Finance',
      'Government',
      'Real Estate',
      'Legal',
      'Travel',
      'General'
    ]).default('General'),
    status: z.enum(['draft', 'published', 'archived']).default('draft'),
    icon: z.string().default('FileText'),
    estimatedMinutes: z.number().min(1).default(5),
    fields: z.array(formFieldSchema).min(1, 'Template must have at least one field'),
    conditionalRules: z.array(z.any()).optional()
  })
});

export const updateTemplateSchema = z.object({
  params: z.object({
    id: z.string().min(1)
  }),
  body: z.object({
    title: z.string().min(3).max(150).optional(),
    description: z.string().min(5).optional(),
    category: z.enum([
      'Education',
      'Employment',
      'Healthcare',
      'Events',
      'Finance',
      'Government',
      'Real Estate',
      'Legal',
      'Travel',
      'General'
    ]).optional(),
    status: z.enum(['draft', 'published', 'archived']).optional(),
    icon: z.string().optional(),
    estimatedMinutes: z.number().min(1).optional(),
    fields: z.array(formFieldSchema).optional(),
    conditionalRules: z.array(z.any()).optional()
  })
});

export const templateIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1)
  })
});
