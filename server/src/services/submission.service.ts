import mongoose from 'mongoose';
import { FormSubmission } from '../models/submission.model.js';
import { FormTemplate } from '../models/template.model.js';
import { AuditLog } from '../models/auditLog.model.js';
import { validateFieldValue } from '../utils/fieldValidator.js';
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  ValidationError
} from '../utils/apiError.js';
import type { IFormField, SubmissionStatus } from '../types/index.js';

export class SubmissionService {
  /**
   * Evaluates whether a field is conditionally visible given current form values
   */
  static isFieldVisible(field: IFormField, values: Record<string, any>): boolean {
    if (!field.conditional) return true;

    const { dependsOnKey, condition, value } = field.conditional;
    const dependentVal = values[dependsOnKey];

    switch (condition) {
      case 'equals':
        return dependentVal === value;
      case 'notEquals':
        return dependentVal !== value;
      case 'contains':
        if (Array.isArray(dependentVal)) {
          return dependentVal.includes(value);
        }
        return String(dependentVal || '').toLowerCase().includes(String(value).toLowerCase());
      default:
        return true;
    }
  }

  /**
   * Calculates completion percentage considering conditional field visibility
   */
  static calculateCompletion(fields: IFormField[], values: Record<string, any>): number {
    const applicableFields = fields.filter((f) => this.isFieldVisible(f, values));
    const requiredFields = applicableFields.filter((f) => f.required);

    // If there are no required fields, count any applicable field with values
    const targetFields = requiredFields.length > 0 ? requiredFields : applicableFields;
    if (targetFields.length === 0) return 100;

    let filledCount = 0;
    for (const f of targetFields) {
      const val = values[f.key];
      if (val !== undefined && val !== null && val !== '') {
        // for checkboxes, boolean true is filled
        if (f.type === 'checkbox') {
          if (val === true) filledCount++;
        } else {
          filledCount++;
        }
      }
    }

    return Math.min(100, Math.round((filledCount / targetFields.length) * 100));
  }

  static async listUserSubmissions(params: {
    userId: string;
    isAdmin?: boolean;
    templateId?: string;
    status?: SubmissionStatus;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 20));
    const skip = (page - 1) * limit;

    const query: Record<string, any> = { isDeleted: false };
    if (!params.isAdmin) {
      query.userId = params.userId;
    }
    if (params.templateId) {
      query.templateId = params.templateId;
    }
    if (params.status) {
      query.status = params.status;
    }

    const [submissions, total] = await Promise.all([
      FormSubmission.find(query)
        .populate('templateId', 'title category icon estimatedMinutes')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit),
      FormSubmission.countDocuments(query)
    ]);

    return {
      submissions: submissions.map((s) => s.toJSON()),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  static async getSubmission(id: string, userId: string, isAdmin = false) {
    const submission = await FormSubmission.findOne({ _id: id, isDeleted: false }).populate(
      'templateId'
    );
    if (!submission) {
      throw new NotFoundError(`Submission '${id}' not found.`);
    }

    if (!isAdmin && submission.userId.toString() !== userId) {
      throw new ForbiddenError('You are not authorized to view this submission.');
    }

    return submission.toJSON();
  }

  static async createSubmission(params: {
    userId: string;
    templateId: string;
    title?: string;
    initialValues?: Record<string, any>;
    ip?: string;
    userAgent?: string;
  }) {
    const template = await FormTemplate.findById(params.templateId);
    if (!template) {
      throw new NotFoundError(`Template '${params.templateId}' not found.`);
    }

    const values = params.initialValues || {};
    const completion = this.calculateCompletion(template.fields, values);

    const submission = new FormSubmission({
      userId: params.userId,
      templateId: template._id,
      title: params.title || `${template.title} Draft`,
      values,
      status: completion === 100 ? 'completed' : 'draft',
      completionPercentage: completion
    });

    await submission.save();

    await AuditLog.create({
      userId: new mongoose.Types.ObjectId(params.userId),
      submissionId: submission._id,
      templateId: template._id,
      action: 'CREATE',
      changedFields: [{ fieldKey: 'submission', oldValue: null, newValue: { title: submission.title } }],
      source: 'text',
      ip: params.ip,
      userAgent: params.userAgent
    });

    return submission.toJSON();
  }

  static async updateSubmission(params: {
    id: string;
    userId: string;
    isAdmin?: boolean;
    values?: Record<string, any>;
    title?: string;
    status?: SubmissionStatus;
    source?: 'voice' | 'text' | 'system';
    ip?: string;
    userAgent?: string;
  }) {
    const submission = await FormSubmission.findOne({ _id: params.id, isDeleted: false });
    if (!submission) {
      throw new NotFoundError(`Submission '${params.id}' not found.`);
    }

    if (!params.isAdmin && submission.userId.toString() !== params.userId) {
      throw new ForbiddenError('You are not authorized to update this submission.');
    }

    if (submission.status === 'submitted') {
      throw new BadRequestError('Submitted forms cannot be modified. Reopen the form as a draft first.');
    }

    const template = await FormTemplate.findById(submission.templateId);
    if (!template) {
      throw new NotFoundError('Associated form template not found.');
    }

    const changedFields: any[] = [];

    if (params.title) {
      submission.title = params.title.trim();
    }

    if (params.values) {
      const mergedValues = { ...submission.values, ...params.values };
      const currentStatusObj = submission.fieldStatus instanceof Map
        ? Object.fromEntries(submission.fieldStatus)
        : (submission.fieldStatus || {});
      const fieldStatusMap = new Map(Object.entries(currentStatusObj));

      for (const [key, val] of Object.entries(params.values)) {
        const fieldDef = template.fields.find((f) => f.key === key);
        if (fieldDef) {
          const validation = validateFieldValue(fieldDef, val);
          if (!validation.isValid) {
            fieldStatusMap.set(key, { status: 'invalid', error: validation.error });
          } else {
            mergedValues[key] = validation.coercedValue;
            fieldStatusMap.set(key, { status: 'valid' });
          }

          changedFields.push({
            fieldKey: key,
            oldValue: submission.values[key] ?? null,
            newValue: fieldDef.isSensitive ? '***MASKED***' : validation.coercedValue,
            isSensitive: fieldDef.isSensitive
          });
        } else {
          mergedValues[key] = val;
        }
      }

      submission.values = mergedValues;
      submission.fieldStatus = fieldStatusMap as any;
      submission.completionPercentage = this.calculateCompletion(template.fields, mergedValues);

      if ((submission.status as string) !== 'submitted') {
        submission.status = submission.completionPercentage === 100 ? 'completed' : 'in_progress';
      }
    }

    if (params.status && params.status !== 'submitted') {
      submission.status = params.status;
    }

    await submission.save();

    if (changedFields.length > 0) {
      await AuditLog.create({
        userId: new mongoose.Types.ObjectId(params.userId),
        submissionId: submission._id,
        templateId: template._id,
        action: 'UPDATE_VALUE',
        changedFields,
        source: params.source || 'text',
        ip: params.ip,
        userAgent: params.userAgent
      });
    }

    return submission.toJSON();
  }

  static async submitSubmission(id: string, userId: string, isAdmin = false, ip?: string, userAgent?: string) {
    const submission = await FormSubmission.findOne({ _id: id, isDeleted: false });
    if (!submission) {
      throw new NotFoundError(`Submission '${id}' not found.`);
    }

    if (!isAdmin && submission.userId.toString() !== userId) {
      throw new ForbiddenError('You are not authorized to submit this form.');
    }

    if (submission.status === 'submitted') {
      throw new BadRequestError('This form is already submitted.');
    }

    const template = await FormTemplate.findById(submission.templateId);
    if (!template) {
      throw new NotFoundError('Associated form template not found.');
    }

    // Validate all applicable required fields
    const missingErrors: Array<{ fieldKey: string; message: string }> = [];
    const values = submission.values || {};

    for (const field of template.fields) {
      if (!this.isFieldVisible(field, values)) continue;

      const val = values[field.key];
      const validation = validateFieldValue(field, val);
      if (!validation.isValid) {
        missingErrors.push({
          fieldKey: field.key,
          message: validation.error || `${field.label} is invalid.`
        });
      }
    }

    if (missingErrors.length > 0) {
      throw new ValidationError('Form has missing or invalid required fields.', missingErrors);
    }

    submission.status = 'submitted';
    submission.completionPercentage = 100;
    submission.submittedAt = new Date();
    await submission.save();

    await AuditLog.create({
      userId: new mongoose.Types.ObjectId(userId),
      submissionId: submission._id,
      templateId: template._id,
      action: 'SUBMIT',
      changedFields: [{ fieldKey: 'status', oldValue: 'in_progress', newValue: 'submitted' }],
      source: 'text',
      ip,
      userAgent
    });

    return submission.toJSON();
  }

  static async duplicateSubmission(id: string, userId: string) {
    const original = await FormSubmission.findOne({ _id: id, isDeleted: false });
    if (!original) {
      throw new NotFoundError(`Submission '${id}' not found.`);
    }

    const clone = new FormSubmission({
      userId,
      templateId: original.templateId,
      title: `${original.title} (Copy)`,
      values: { ...original.values },
      status: 'draft',
      completionPercentage: original.completionPercentage,
      voiceMetrics: { commandsUsed: 0, correctionsCount: 0, voiceInputCount: 0 }
    });

    await clone.save();

    await AuditLog.create({
      userId: new mongoose.Types.ObjectId(userId),
      submissionId: clone._id,
      templateId: original.templateId,
      action: 'DUPLICATE',
      changedFields: [{ fieldKey: 'clonedFrom', oldValue: original._id, newValue: clone._id }],
      source: 'system'
    });

    return clone.toJSON();
  }

  static async softDeleteSubmission(id: string, userId: string, isAdmin = false) {
    const submission = await FormSubmission.findOne({ _id: id, isDeleted: false });
    if (!submission) {
      throw new NotFoundError(`Submission '${id}' not found.`);
    }

    if (!isAdmin && submission.userId.toString() !== userId) {
      throw new ForbiddenError('You are not authorized to delete this submission.');
    }

    submission.isDeleted = true;
    await submission.save();

    await AuditLog.create({
      userId: new mongoose.Types.ObjectId(userId),
      submissionId: submission._id,
      templateId: submission.templateId,
      action: 'DELETE',
      changedFields: [{ fieldKey: 'isDeleted', oldValue: false, newValue: true }],
      source: 'system'
    });

    return { message: 'Submission successfully deleted.' };
  }
}
