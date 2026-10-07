import { z, type ZodObject, type ZodTypeAny } from 'zod';
import type { FormTemplate } from '../../types';

export function buildZodSchema(template: FormTemplate): ZodObject<Record<string, ZodTypeAny>> {
  const shape: Record<string, ZodTypeAny> = {};

  template.fields.forEach((field) => {
    let schema: ZodTypeAny;

    switch (field.type) {
      case 'number':
        let numSchema = z.coerce.number();
        if (field.validation?.min !== undefined) {
          numSchema = numSchema.min(
            field.validation.min,
            field.validation.customErrorMessage || `${field.label} must be at least ${field.validation.min}`
          );
        }
        if (field.validation?.max !== undefined) {
          numSchema = numSchema.max(
            field.validation.max,
            field.validation.customErrorMessage || `${field.label} cannot exceed ${field.validation.max}`
          );
        }
        schema = field.required
          ? numSchema
          : numSchema.optional().nullable().or(z.literal(''));
        break;

      case 'email':
        let emailSchema = z.string();
        if (field.required) {
          emailSchema = emailSchema.min(1, `${field.label} is required`);
        }
        emailSchema = emailSchema.email(
          field.validation?.customErrorMessage || 'Please enter a valid email address'
        );
        schema = field.required ? emailSchema : emailSchema.optional().or(z.literal(''));
        break;

      case 'phone':
        let phoneSchema = z.string();
        if (field.required) {
          phoneSchema = phoneSchema.min(1, `${field.label} is required`);
        }
        // Basic phone regex (at least 7 digits)
        phoneSchema = phoneSchema.refine(
          (val) => !val || (val.replace(/\D/g, '').length >= 7 && val.replace(/\D/g, '').length <= 15),
          { message: field.validation?.customErrorMessage || 'Please enter a valid phone number (7-15 digits)' }
        );
        schema = field.required ? phoneSchema : phoneSchema.optional().or(z.literal(''));
        break;

      case 'date':
        let dateSchema = z.string();
        if (field.required) {
          dateSchema = dateSchema.min(1, `${field.label} is required`);
        }
        schema = field.required ? dateSchema : dateSchema.optional().or(z.literal(''));
        break;

      case 'checkbox':
        let boolSchema = z.boolean();
        if (field.required) {
          boolSchema = boolSchema.refine((val) => val === true, {
            message: `${field.label} must be accepted`
          });
        }
        schema = boolSchema;
        break;

      case 'select':
      case 'radio':
        let optionSchema = z.string();
        if (field.required) {
          optionSchema = optionSchema.min(1, `Please select an option for ${field.label}`);
        }
        schema = field.required ? optionSchema : optionSchema.optional().or(z.literal(''));
        break;

      case 'textarea':
      case 'text':
      default:
        let strSchema = z.string();
        if (field.required) {
          strSchema = strSchema.min(
            field.validation?.min || 1,
            field.validation?.customErrorMessage || `${field.label} is required`
          );
        }
        if (field.validation?.max) {
          strSchema = strSchema.max(
            field.validation.max,
            `${field.label} cannot exceed ${field.validation.max} characters`
          );
        }
        schema = field.required ? strSchema : strSchema.optional().or(z.literal(''));
        break;
    }

    shape[field.key] = schema;
  });

  return z.object(shape);
}

export function validateFormValues(
  template: FormTemplate,
  values: Record<string, any>
): { isValid: boolean; errors: Record<string, string> } {
  const schema = buildZodSchema(template);
  const result = schema.safeParse(values);

  if (result.success) {
    return { isValid: true, errors: {} };
  }

  const errors: Record<string, string> = {};
  result.error.issues.forEach((issue) => {
    const key = issue.path[0] as string;
    if (key && !errors[key]) {
      errors[key] = issue.message;
    }
  });

  return { isValid: false, errors };
}
