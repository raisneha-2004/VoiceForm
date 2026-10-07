export type Role = 'user' | 'admin';

export type SupportedLanguage = 'en-US' | 'hi-IN' | 'hinglish';

export interface UserPreferences {
  defaultLanguage: SupportedLanguage;
  autoReadQuestions: boolean;
  confirmSensitiveData: boolean;
  speechRate: number; // 0.5 to 2.0 (default 1.0)
  speechPitch: number; // 0.5 to 1.5 (default 1.0)
  theme: 'light' | 'dark' | 'system';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  preferences: UserPreferences;
  createdAt: string;
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

export interface FormField {
  id: string;
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required: boolean;
  helpText?: string;
  section?: string; // Logical grouping/step for large forms
  isSensitive?: boolean; // triggers confirmation modal when populated via speech
  options?: SelectOption[]; // for select, radio
  conditional?: ConditionalRule;
  validation?: ValidationRule;
  defaultValue?: any;
}

export interface FormTemplate {
  id: string;
  title: string;
  description: string;
  category:
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
  icon: string; // Lucide icon name
  estimatedMinutes: number;
  fields: FormField[];
  isPublished: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export type SubmissionStatus = 'draft' | 'in_review' | 'completed';

export interface FormSubmission {
  id: string;
  templateId: string;
  templateTitle: string;
  userId: string;
  status: SubmissionStatus;
  data: Record<string, any>;
  completionPercentage: number;
  lastUpdated: string;
  createdAt: string;
}

export type VoiceCommandType = 
  | 'SET_VALUE'
  | 'NEXT_FIELD'
  | 'PREV_FIELD'
  | 'CLEAR_FIELD'
  | 'REPEAT_QUESTION'
  | 'SKIP_FIELD'
  | 'REVIEW'
  | 'SUBMIT'
  | 'NAVIGATE'
  | 'STOP_LISTENING'
  | 'RESET'
  | 'UNKNOWN';

export interface VoiceCommandResult {
  type: VoiceCommandType;
  targetKey?: string;
  fieldLabel?: string;
  value?: any;
  confidence?: number;
  rawTranscript: string;
  feedback?: string;
  isSensitive?: boolean;
}

export interface AiDetectedChange {
  id: string;
  timestamp: string;
  fieldKey?: string;
  fieldLabel?: string;
  oldValue?: any;
  newValue?: any;
  description: string;
  type: 'update' | 'command' | 'warning' | 'confirmation';
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}
