import type { AIProvider, AIExtractionParams, AIExtractionResult } from './aiProvider.interface.js';
import { env } from '../../config/env.js';
import { logger } from '../../config/logger.js';
import { MockAIProvider } from './mockAiProvider.js';

export class GeminiAIProvider implements AIProvider {
  readonly name = 'gemini';
  private mockFallback = new MockAIProvider();

  async extractFormUpdates(params: AIExtractionParams): Promise<AIExtractionResult> {
    if (!env.GEMINI_API_KEY) {
      logger.warn('GEMINI_API_KEY not configured. Falling back to MockAIProvider.');
      return this.mockFallback.extractFormUpdates(params);
    }

    try {
      const { transcript, language, fields, currentValues, activeFieldKey } = params;

      const prompt = `
You are an expert NLP voice-form filling assistant.
Available Form Fields:
${JSON.stringify(
  fields.map((f) => ({
    key: f.key,
    label: f.label,
    type: f.type,
    required: f.required,
    options: f.options?.map((o) => o.value)
  })),
  null,
  2
)}

Current Form Values:
${JSON.stringify(currentValues, null, 2)}

Active Field Key: ${activeFieldKey || 'none'}
User Spoken Language: ${language}
User Transcript: "${transcript}"

Task:
1. Identify if the user wants to update one or more form fields, or issue a command (NEXT_FIELD, PREV_FIELD, CLEAR_FIELD, REVIEW, SUBMIT).
2. For any field updates, extract the appropriate value coerced to the field type.
3. If it is a correction (e.g. "change city to Delhi" or "age is 22 not 21"), overwrite only that field.
4. Respond with STRICT JSON matching this schema:
{
  "intent": "field_update" | "command" | "clarification",
  "updates": [
    {
      "fieldKey": string,
      "value": any,
      "confidence": number,
      "requiresConfirmation": boolean,
      "reasoning": string
    }
  ],
  "commands": [
    {
      "type": "SET_VALUE" | "NEXT_FIELD" | "PREV_FIELD" | "CLEAR_FIELD" | "SUBMIT" | "REVIEW",
      "fieldKey": string (optional),
      "value": any (optional)
    }
  ],
  "assistantMessage": string,
  "clarificationPrompt": string (optional)
}
`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.1
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API returned status ${response.status}: ${await response.text()}`);
      }

      const data = (await response.json()) as any;
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error('Empty response from Gemini API');

      const parsed: AIExtractionResult = JSON.parse(rawText);
      return parsed;
    } catch (error) {
      logger.error('Gemini Provider execution failed, falling back to rule engine:', error);
      return this.mockFallback.extractFormUpdates(params);
    }
  }
}
