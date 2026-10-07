import type { AIProvider, AIExtractionParams, AIExtractionResult } from './aiProvider.interface.js';
import { env } from '../../config/env.js';
import { logger } from '../../config/logger.js';
import { MockAIProvider } from './mockAiProvider.js';

export class OpenAIProvider implements AIProvider {
  readonly name = 'openai';
  private mockFallback = new MockAIProvider();

  async extractFormUpdates(params: AIExtractionParams): Promise<AIExtractionResult> {
    if (!env.OPENAI_API_KEY) {
      logger.warn('OPENAI_API_KEY not configured. Falling back to MockAIProvider.');
      return this.mockFallback.extractFormUpdates(params);
    }

    try {
      const { transcript, language, fields, currentValues, activeFieldKey } = params;

      const systemPrompt = `
You are an expert NLP voice-form filling backend parser.
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

Task:
Parse natural speech (English, Hindi, or Hinglish) to extract form updates or commands.
Always respond in valid JSON with:
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

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          response_format: { type: 'json_object' },
          temperature: 0.1,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: transcript }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API returned status ${response.status}: ${await response.text()}`);
      }

      const data = (await response.json()) as any;
      const content = data?.choices?.[0]?.message?.content;
      if (!content) throw new Error('Empty response from OpenAI');

      return JSON.parse(content) as AIExtractionResult;
    } catch (error) {
      logger.error('OpenAI Provider execution failed, falling back to rule engine:', error);
      return this.mockFallback.extractFormUpdates(params);
    }
  }
}
