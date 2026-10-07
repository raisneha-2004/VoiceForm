import type { Request } from 'express';

export type Role = 'user' | 'admin';

export type SupportedLanguage = 'en-US' | 'hi-IN' | 'hinglish';

export interface UserPreferences {
  preferredLanguage: SupportedLanguage;
  autoSpeakQuestions: boolean;
  confirmSensitiveFields: boolean;
  speechRate?: number;
  speechPitch?: number;
  theme?: 'light' | 'dark' | 'system';
}

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'phone'
  | 'date'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'file';

export interface SelectOption {
  label: string;
  value: string;
}

export interface ConditionalRule {
  dependsOnKey: string;
  condition: 'equals' | 'notEquals' | 'contains';
  value: string | number | boolean;
}

export interface ValidationRule {
  min?: number;
  max?: number;
  pattern?: string;
  customErrorMessage?: string;
}

export interface IFormField {
  id: string;
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required: boolean;
  helpText?: string;
  isSensitive?: boolean;
  options?: SelectOption[];
  conditional?: ConditionalRule;
  validation?: ValidationRule;
  defaultValue?: any;
  order: number;
}

export type TemplateStatus = 'draft' | 'published' | 'archived';
export type TemplateCategory =
  | 'Education'
  | 'Employment'
  | 'Healthcare'
  | 'Events'
  | 'Finance'
  | 'Government'
  | 'Real Estate'
  | 'Legal'
  | 'Travel'
  | 'General'
  | (string & {});

export type SubmissionStatus = 'draft' | 'in_progress' | 'completed' | 'submitted';

export interface VoiceMetrics {
  commandsUsed: number;
  correctionsCount: number;
  voiceInputCount: number;
}

export type VoiceIntent = 'field_update' | 'command' | 'clarification';

export type VoiceCommandType =
  | 'SET_VALUE'
  | 'NEXT_FIELD'
  | 'PREV_FIELD'
  | 'CLEAR_FIELD'
  | 'SUBMIT'
  | 'REVIEW'
  | 'UNKNOWN';

export interface ExtractedUpdate {
  fieldKey: string;
  value: any;
  confidence: number;
  requiresConfirmation: boolean;
  reasoning?: string;
}

export interface VoiceProcessResult {
  intent: VoiceIntent;
  updates: ExtractedUpdate[];
  commands: Array<{
    type: VoiceCommandType;
    fieldKey?: string;
    value?: any;
  }>;
  validationErrors: Array<{
    fieldKey: string;
    message: string;
  }>;
  assistantMessage: string;
  nextQuestion?: string;
  pendingConfirmation?: {
    fieldKey: string;
    fieldLabel: string;
    value: any;
    rawTranscript: string;
  };
}

export interface AuthUserPayload {
  id: string;
  email: string;
  role: Role;
  name: string;
}

export interface AuthRequest extends Request {
  user?: AuthUserPayload;
  requestId?: string;
}
