import type { AIProvider, AIExtractionParams, AIExtractionResult } from './aiProvider.interface.js';
import { RuleExtractorService } from '../ruleExtractor.service.js';

export class MockAIProvider implements AIProvider {
  readonly name = 'mock';

  async extractFormUpdates(params: AIExtractionParams): Promise<AIExtractionResult> {
    const { transcript, fields, activeFieldKey } = params;

    // Check commands first
    const commands = RuleExtractorService.extractCommands(transcript, fields);
    if (commands.length > 0) {
      const firstCmd = commands[0];
      let assistantMsg = 'Command recognized.';
      if (firstCmd.type === 'NEXT_FIELD') assistantMsg = 'Moving to the next field.';
      if (firstCmd.type === 'PREV_FIELD') assistantMsg = 'Going back to the previous field.';
      if (firstCmd.type === 'CLEAR_FIELD') assistantMsg = `Cleared ${firstCmd.fieldKey}.`;
      if (firstCmd.type === 'REVIEW') assistantMsg = 'Opening form review summary.';
      if (firstCmd.type === 'SUBMIT') assistantMsg = 'Submitting form...';

      return {
        intent: 'command',
        updates: [],
        commands,
        assistantMessage: assistantMsg
      };
    }

    // Extract updates
    const updates = RuleExtractorService.extractDeterministicUpdates(
      transcript,
      fields,
      activeFieldKey
    );

    if (updates.length === 0) {
      return {
        intent: 'clarification',
        updates: [],
        commands: [],
        assistantMessage: `I didn't quite catch that. Could you repeat or specify which field you would like to fill?`,
        clarificationPrompt: 'Please state your answer or say "next" / "help".'
      };
    }

    const updatedLabels = updates
      .map((u) => fields.find((f) => f.key === u.fieldKey)?.label || u.fieldKey)
      .join(', ');

    return {
      intent: 'field_update',
      updates,
      commands: [],
      assistantMessage: `I updated your ${updatedLabels}.`
    };
  }
}
