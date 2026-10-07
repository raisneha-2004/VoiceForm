import mongoose from 'mongoose';
import { FormSubmission } from '../models/submission.model.js';
import { FormTemplate } from '../models/template.model.js';
import { User } from '../models/user.model.js';
import { AuditLog } from '../models/auditLog.model.js';
import { AIFactory } from './ai/aiFactory.js';
import { RuleExtractorService } from './ruleExtractor.service.js';
import { validateFieldValue } from '../utils/fieldValidator.js';
import { SubmissionService } from './submission.service.js';
import { BadRequestError, NotFoundError } from '../utils/apiError.js';
import type {
  IFormField,
  VoiceProcessResult,
  ExtractedUpdate
} from '../types/index.js';

export class VoiceService {
  /**
   * Generates a conversational question for a field
   */
  private static getQuestionPrompt(field: IFormField): string {
    switch (field.type) {
      case 'email':
        return `What is your email address?`;
      case 'phone':
        return `Please share your mobile or contact number.`;
      case 'date':
        return `What is your ${field.label.toLowerCase()}? (You can say your birth date or year)`;
      case 'number':
        return `What is your ${field.label.toLowerCase()}?`;
      case 'select':
      case 'radio':
        if (field.options && field.options.length <= 4) {
          const opts = field.options.map((o) => o.label).join(', ');
          return `Please choose your ${field.label.toLowerCase()}: ${opts}.`;
        }
        return `Please select your preferred ${field.label.toLowerCase()}.`;
      case 'checkbox':
        return `Do you agree or confirm ${field.label.toLowerCase()}?`;
      default:
        return `What is your ${field.label.toLowerCase()}?`;
    }
  }

  /**
   * Finds the next applicable required field that is still empty
   */
  private static getNextEmptyField(
    fields: IFormField[],
    values: Record<string, any>,
    currentFieldKey?: string
  ): IFormField | undefined {
    const applicable = fields.filter((f) => SubmissionService.isFieldVisible(f, values));
    const sorted = [...applicable].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    let currentIndex = -1;
    if (currentFieldKey) {
      currentIndex = sorted.findIndex((f) => f.key === currentFieldKey);
    }

    // Look from next index onward
    for (let i = currentIndex + 1; i < sorted.length; i++) {
      const f = sorted[i];
      const val = values[f.key];
      if (val === undefined || val === null || val === '') {
        return f;
      }
    }

    // Look from beginning if not found
    for (let i = 0; i <= currentIndex; i++) {
      const f = sorted[i];
      const val = values[f.key];
      if (val === undefined || val === null || val === '') {
        return f;
      }
    }

    return undefined;
  }

  static async processVoiceInput(params: {
    submissionId: string;
    templateId: string;
    transcript: string;
    language: string;
    activeFieldKey?: string;
    userId: string;
    ip?: string;
    userAgent?: string;
  }): Promise<VoiceProcessResult> {
    const submission = await FormSubmission.findOne({
      _id: params.submissionId,
      isDeleted: false
    });
    if (!submission) {
      throw new NotFoundError(`Submission '${params.submissionId}' not found.`);
    }

    if (submission.status === 'submitted') {
      throw new BadRequestError('Cannot process voice inputs on an already submitted form.');
    }

    const template = await FormTemplate.findById(params.templateId);
    if (!template) {
      throw new NotFoundError(`Template '${params.templateId}' not found.`);
    }

    const user = await User.findById(params.userId);
    const confirmSensitive = user?.preferences?.confirmSensitiveFields ?? true;

    // Increment voice input count metric
    submission.voiceMetrics.voiceInputCount = (submission.voiceMetrics.voiceInputCount || 0) + 1;

    // 1. Check for command fast path
    const directCommands = RuleExtractorService.extractCommands(params.transcript, template.fields);
    if (directCommands.length > 0) {
      submission.voiceMetrics.commandsUsed = (submission.voiceMetrics.commandsUsed || 0) + 1;
      const cmd = directCommands[0];

      if (cmd.type === 'CLEAR_FIELD' && cmd.fieldKey) {
        const currentVals = { ...submission.values };
        delete currentVals[cmd.fieldKey];
        submission.values = currentVals;
        submission.completionPercentage = SubmissionService.calculateCompletion(template.fields, currentVals);
        await submission.save();

        return {
          intent: 'command',
          updates: [],
          commands: directCommands,
          validationErrors: [],
          assistantMessage: `Cleared ${cmd.fieldKey}.`,
          nextQuestion: this.getQuestionPrompt(template.fields.find((f) => f.key === cmd.fieldKey) || template.fields[0])
        };
      }

      await submission.save();

      let assistantMessage = 'Command executed.';
      let nextQ: string | undefined;

      if (cmd.type === 'NEXT_FIELD') {
        const nextField = this.getNextEmptyField(template.fields, submission.values, params.activeFieldKey);
        if (nextField) {
          nextQ = this.getQuestionPrompt(nextField);
          assistantMessage = `Moving to ${nextField.label}.`;
        }
      } else if (cmd.type === 'PREV_FIELD') {
        assistantMessage = 'Returning to previous question.';
      } else if (cmd.type === 'REVIEW') {
        assistantMessage = 'Here is the review of your answers so far.';
      } else if (cmd.type === 'SUBMIT') {
        assistantMessage = 'Ready to submit. Checking all required fields.';
      }

      return {
        intent: 'command',
        updates: [],
        commands: directCommands,
        validationErrors: [],
        assistantMessage,
        nextQuestion: nextQ
      };
    }

    // 2. Extract updates (deterministic first, fallback to AI provider)
    let extractedUpdates = RuleExtractorService.extractDeterministicUpdates(
      params.transcript,
      template.fields,
      params.activeFieldKey
    );

    let rawAiResult: any = null;

    if (extractedUpdates.length === 0) {
      const provider = AIFactory.getProvider();
      rawAiResult = await provider.extractFormUpdates({
        transcript: params.transcript,
        language: params.language,
        fields: template.fields,
        currentValues: submission.values || {},
        activeFieldKey: params.activeFieldKey
      });

      if (rawAiResult.intent === 'command' && rawAiResult.commands.length > 0) {
        submission.voiceMetrics.commandsUsed = (submission.voiceMetrics.commandsUsed || 0) + 1;
        await submission.save();
        return {
          intent: 'command',
          updates: [],
          commands: rawAiResult.commands,
          validationErrors: [],
          assistantMessage: rawAiResult.assistantMessage
        };
      }

      extractedUpdates = rawAiResult.updates || [];
    }

    if (extractedUpdates.length === 0) {
      await submission.save();
      return {
        intent: 'clarification',
        updates: [],
        commands: [],
        validationErrors: [],
        assistantMessage:
          rawAiResult?.assistantMessage ||
          `I heard you, but couldn't determine which form field to update. Please state the value again or say the field name.`,
        nextQuestion: params.activeFieldKey
          ? this.getQuestionPrompt(template.fields.find((f) => f.key === params.activeFieldKey) || template.fields[0])
          : undefined
      };
    }

    // 3. Strictly validate every extracted field before saving
    const validationErrors: Array<{ fieldKey: string; message: string }> = [];
    const validUpdates: ExtractedUpdate[] = [];
    let pendingConfirmationData: any = null;

    const updatedValues = { ...submission.values };
    const changedFieldsAudit: any[] = [];

    for (const update of extractedUpdates) {
      const field = template.fields.find((f) => f.key === update.fieldKey);
      if (!field) continue;

      const validation = validateFieldValue(field, update.value);
      if (!validation.isValid) {
        validationErrors.push({
          fieldKey: field.key,
          message: validation.error || `Invalid value for ${field.label}`
        });
        continue;
      }

      const cleanVal = validation.coercedValue;

      // Check if this was a correction
      if (
        submission.values[field.key] !== undefined &&
        submission.values[field.key] !== cleanVal
      ) {
        submission.voiceMetrics.correctionsCount =
          (submission.voiceMetrics.correctionsCount || 0) + 1;
      }

      // Check sensitive confirmation requirement
      if (field.isSensitive && confirmSensitive && !pendingConfirmationData) {
        pendingConfirmationData = {
          fieldKey: field.key,
          fieldLabel: field.label,
          value: cleanVal,
          rawTranscript: params.transcript
        };
        validUpdates.push({
          fieldKey: field.key,
          value: cleanVal,
          confidence: update.confidence,
          requiresConfirmation: true,
          reasoning: update.reasoning
        });
        continue;
      }

      updatedValues[field.key] = cleanVal;
      validUpdates.push({
        fieldKey: field.key,
        value: cleanVal,
        confidence: update.confidence,
        requiresConfirmation: false,
        reasoning: update.reasoning
      });

      changedFieldsAudit.push({
        fieldKey: field.key,
        oldValue: submission.values[field.key] ?? null,
        newValue: field.isSensitive ? '***MASKED***' : cleanVal,
        isSensitive: field.isSensitive
      });
    }

    submission.values = updatedValues;
    submission.completionPercentage = SubmissionService.calculateCompletion(
      template.fields,
      updatedValues
    );
    if ((submission.status as string) !== 'submitted') {
      submission.status = submission.completionPercentage === 100 ? 'completed' : 'in_progress';
    }

    await submission.save();

    if (changedFieldsAudit.length > 0) {
      await AuditLog.create({
        userId: new mongoose.Types.ObjectId(params.userId),
        submissionId: submission._id,
        templateId: template._id,
        action: 'VOICE_PROCESS',
        changedFields: changedFieldsAudit,
        source: 'voice',
        ip: params.ip,
        userAgent: params.userAgent
      });
    }

    // Determine next question prompt
    const nextField = this.getNextEmptyField(
      template.fields,
      updatedValues,
      validUpdates[validUpdates.length - 1]?.fieldKey || params.activeFieldKey
    );
    const nextQuestionText = nextField ? this.getQuestionPrompt(nextField) : undefined;

    // Construct friendly assistant message
    let assistantMsg = 'Got it.';
    if (validUpdates.length > 0) {
      const fieldNames = validUpdates
        .map((u) => template.fields.find((f) => f.key === u.fieldKey)?.label || u.fieldKey)
        .join(' and ');
      assistantMsg = pendingConfirmationData
        ? `I noted your ${fieldNames}. Because this is sensitive information, please confirm to save.`
        : `I updated your ${fieldNames}.`;
    }

    return {
      intent: 'field_update',
      updates: validUpdates,
      commands: [],
      validationErrors,
      assistantMessage: assistantMsg,
      nextQuestion: nextQuestionText,
      pendingConfirmation: pendingConfirmationData || undefined
    };
  }

  static async confirmSensitiveField(params: {
    submissionId: string;
    fieldKey: string;
    value: any;
    confirmed: boolean;
    userId: string;
    ip?: string;
    userAgent?: string;
  }) {
    const submission = await FormSubmission.findOne({
      _id: params.submissionId,
      isDeleted: false
    });
    if (!submission) {
      throw new NotFoundError(`Submission '${params.submissionId}' not found.`);
    }

    if (!params.confirmed) {
      return { message: 'Confirmation cancelled. Field was not saved.' };
    }

    const template = await FormTemplate.findById(submission.templateId);
    if (!template) {
      throw new NotFoundError('Associated form template not found.');
    }

    const field = template.fields.find((f) => f.key === params.fieldKey);
    if (!field) {
      throw new NotFoundError(`Field '${params.fieldKey}' not found in template.`);
    }

    const validation = validateFieldValue(field, params.value);
    if (!validation.isValid) {
      throw new BadRequestError(validation.error || 'Invalid value for sensitive field.');
    }

    const currentValues = { ...submission.values, [field.key]: validation.coercedValue };
    submission.values = currentValues;
    submission.completionPercentage = SubmissionService.calculateCompletion(
      template.fields,
      currentValues
    );
    await submission.save();

    await AuditLog.create({
      userId: new mongoose.Types.ObjectId(params.userId),
      submissionId: submission._id,
      templateId: template._id,
      action: 'CONFIRM_SENSITIVE',
      changedFields: [
        {
          fieldKey: field.key,
          oldValue: null,
          newValue: '***MASKED***',
          isSensitive: true
        }
      ],
      source: 'voice',
      ip: params.ip,
      userAgent: params.userAgent
    });

    const nextField = this.getNextEmptyField(template.fields, currentValues, field.key);

    return {
      success: true,
      message: `${field.label} successfully confirmed and saved.`,
      nextQuestion: nextField ? this.getQuestionPrompt(nextField) : undefined,
      completionPercentage: submission.completionPercentage
    };
  }

  static async reviewFormSummary(submissionId: string) {
    const submission = await FormSubmission.findOne({ _id: submissionId, isDeleted: false });
    if (!submission) {
      throw new NotFoundError(`Submission '${submissionId}' not found.`);
    }

    const template = await FormTemplate.findById(submission.templateId);
    if (!template) {
      throw new NotFoundError('Associated template not found.');
    }

    const values = submission.values || {};
    const filledFields: Array<{ key: string; label: string; value: any }> = [];
    const missingRequiredFields: Array<{ key: string; label: string }> = [];

    for (const field of template.fields) {
      if (!SubmissionService.isFieldVisible(field, values)) continue;

      const val = values[field.key];
      if (val !== undefined && val !== null && val !== '') {
        filledFields.push({ key: field.key, label: field.label, value: val });
      } else if (field.required) {
        missingRequiredFields.push({ key: field.key, label: field.label });
      }
    }

    const summaryText =
      missingRequiredFields.length === 0
        ? `Great job! All required fields are filled (${submission.completionPercentage}% complete). You can say "submit form" whenever you're ready.`
        : `You have completed ${filledFields.length} fields (${submission.completionPercentage}% complete). You still need to answer: ${missingRequiredFields.map((f) => f.label).join(', ')}.`;

    return {
      completionPercentage: submission.completionPercentage,
      status: submission.status,
      filledCount: filledFields.length,
      missingRequiredCount: missingRequiredFields.length,
      missingRequiredFields,
      summaryText
    };
  }
}
