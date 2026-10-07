import type {
  IFormField,
  VoiceIntent,
  VoiceCommandType,
  ExtractedUpdate
} from '../../types/index.js';

export interface AIExtractionParams {
  transcript: string;
  language: string;
  fields: IFormField[];
  currentValues: Record<string, any>;
  activeFieldKey?: string;
}

export interface AIExtractionResult {
  intent: VoiceIntent;
  updates: ExtractedUpdate[];
  commands: Array<{
    type: VoiceCommandType;
    fieldKey?: string;
    value?: any;
  }>;
  assistantMessage: string;
  clarificationPrompt?: string;
}

export interface AIProvider {
  readonly name: string;
  extractFormUpdates(params: AIExtractionParams): Promise<AIExtractionResult>;
}
