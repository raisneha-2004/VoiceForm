import mongoose, { Schema, type Document, type Model } from 'mongoose';
import type { SubmissionStatus, VoiceMetrics } from '../types/index.js';

export interface IFieldStatus {
  status: 'valid' | 'invalid' | 'pending_confirmation';
  error?: string;
  confirmedAt?: Date;
}

export interface IFormSubmissionDocument extends Document {
  userId: mongoose.Types.ObjectId;
  templateId: mongoose.Types.ObjectId;
  title: string;
  values: Record<string, any>;
  fieldStatus: Record<string, IFieldStatus>;
  status: SubmissionStatus;
  completionPercentage: number;
  voiceMetrics: VoiceMetrics;
  isDeleted: boolean;
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const FieldStatusItemSchema = new Schema<IFieldStatus>(
  {
    status: {
      type: String,
      enum: ['valid', 'invalid', 'pending_confirmation'],
      default: 'valid'
    },
    error: { type: String },
    confirmedAt: { type: Date }
  },
  { _id: false }
);

const VoiceMetricsSchema = new Schema<VoiceMetrics>(
  {
    commandsUsed: { type: Number, default: 0 },
    correctionsCount: { type: Number, default: 0 },
    voiceInputCount: { type: Number, default: 0 }
  },
  { _id: false }
);

const FormSubmissionSchema = new Schema<IFormSubmissionDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    templateId: { type: Schema.Types.ObjectId, ref: 'FormTemplate', required: true, index: true },
    title: { type: String, required: true, trim: true },
    values: { type: Schema.Types.Mixed, default: () => ({}) },
    fieldStatus: { type: Map, of: FieldStatusItemSchema, default: () => ({}) },
    status: {
      type: String,
      enum: ['draft', 'in_progress', 'completed', 'submitted'],
      default: 'draft',
      index: true
    },
    completionPercentage: { type: Number, default: 0, min: 0, max: 100 },
    voiceMetrics: {
      type: VoiceMetricsSchema,
      default: () => ({ commandsUsed: 0, correctionsCount: 0, voiceInputCount: 0 })
    },
    isDeleted: { type: Boolean, default: false, index: true },
    submittedAt: { type: Date }
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id.toString();
        ret.values = ret.values || {};
        delete (ret as any).__v;
        return ret;
      }
    }
  }
);

export const FormSubmission: Model<IFormSubmissionDocument> = mongoose.model<IFormSubmissionDocument>(
  'FormSubmission',
  FormSubmissionSchema
);
