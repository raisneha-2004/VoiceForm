import type { IFormField } from '../types/index.js';

export interface FieldValidationResult {
  isValid: boolean;
  error?: string;
  coercedValue?: any;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Supports Indian 10-digit formats (with optional +91 or 0) and international numbers
const PHONE_REGEX = /^(?:(?:\+|0{0,2})91(\s*[-]\s*)?|[0]?)?[6789]\d{9}$|^(\+\d{1,3}[- ]?)?\d{10}$/;

export function validateFieldValue(field: IFormField, rawValue: any): FieldValidationResult {
  // Check empty
  const isEmpty = rawValue === undefined || rawValue === null || rawValue === '';

  if (field.required && isEmpty) {
    return {
      isValid: false,
      error: `${field.label} is required.`
    };
  }

  if (isEmpty) {
    return { isValid: true, coercedValue: field.type === 'checkbox' ? false : '' };
  }

  let value = rawValue;

  switch (field.type) {
    case 'number': {
      const num = typeof value === 'number' ? value : Number(value);
      if (isNaN(num)) {
        return { isValid: false, error: `${field.label} must be a valid number.` };
      }
      if (field.validation?.min !== undefined && num < field.validation.min) {
        return { isValid: false, error: `${field.label} must be at least ${field.validation.min}.` };
      }
      if (field.validation?.max !== undefined && num > field.validation.max) {
        return { isValid: false, error: `${field.label} must be at most ${field.validation.max}.` };
      }
      return { isValid: true, coercedValue: num };
    }

    case 'email': {
      const str = String(value).trim().toLowerCase();
      if (!EMAIL_REGEX.test(str)) {
        return { isValid: false, error: `Please enter a valid email address.` };
      }
      return { isValid: true, coercedValue: str };
    }

    case 'phone': {
      const cleaned = String(value).replace(/[^\d+]/g, '');
      if (!PHONE_REGEX.test(cleaned)) {
        return { isValid: false, error: `Please enter a valid phone number (e.g. +91 9876543210).` };
      }
      return { isValid: true, coercedValue: cleaned };
    }

    case 'date': {
      const d = new Date(value);
      if (isNaN(d.getTime())) {
        return { isValid: false, error: `Please enter a valid date (YYYY-MM-DD).` };
      }
      const isoDate = d.toISOString().split('T')[0];
      return { isValid: true, coercedValue: isoDate };
    }

    case 'select':
    case 'radio': {
      const strVal = String(value).trim();
      const validOption = field.options?.find(
        (opt) => opt.value.toLowerCase() === strVal.toLowerCase() || opt.label.toLowerCase() === strVal.toLowerCase()
      );
      if (!validOption && field.options && field.options.length > 0) {
        return {
          isValid: false,
          error: `Selected option is not valid for ${field.label}. Available: ${field.options.map((o) => o.label).join(', ')}`
        };
      }
      return { isValid: true, coercedValue: validOption ? validOption.value : strVal };
    }

    case 'checkbox': {
      let boolVal = false;
      if (typeof value === 'boolean') boolVal = value;
      else if (typeof value === 'string') {
        boolVal = /^(true|yes|haan|1|agree)$/i.test(value.trim());
      } else if (typeof value === 'number') {
        boolVal = value === 1;
      }
      return { isValid: true, coercedValue: boolVal };
    }

    case 'text':
    case 'textarea':
    default: {
      const str = String(value).trim();
      if (field.validation?.min !== undefined && str.length < field.validation.min) {
        return {
          isValid: false,
          error: `${field.label} must be at least ${field.validation.min} characters.`
        };
      }
      if (field.validation?.max !== undefined && str.length > field.validation.max) {
        return {
          isValid: false,
          error: `${field.label} must not exceed ${field.validation.max} characters.`
        };
      }
      if (field.validation?.pattern) {
        try {
          const reg = new RegExp(field.validation.pattern);
          if (!reg.test(str)) {
            return {
              isValid: false,
              error: field.validation.customErrorMessage || `${field.label} format is invalid.`
            };
          }
        } catch {
          // ignore invalid pattern regex
        }
      }
      return { isValid: true, coercedValue: str };
    }
  }
}
