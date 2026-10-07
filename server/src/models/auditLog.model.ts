import mongoose, { Schema, type Document, type Model } from 'mongoose';

export type AuditAction =
  | 'CREATE'
  | 'UPDATE_VALUE'
  | 'VOICE_PROCESS'
  | 'CONFIRM_SENSITIVE'
  | 'SUBMIT'
  | 'REOPEN'
  | 'DUPLICATE'
  | 'DELETE';

export interface IChangedField {
  fieldKey: string;
  oldValue: any;
  newValue: any;
  isSensitive?: boolean;
}

export interface IAuditLogDocument extends Document {
  userId?: mongoose.Types.ObjectId;
  submissionId?: mongoose.Types.ObjectId;
  templateId?: mongoose.Types.ObjectId;
  action: AuditAction;
  changedFields: IChangedField[];
  source: 'voice' | 'text' | 'system';
  ip?: string;
  userAgent?: string;
  timestamp: Date;
}

const ChangedFieldSchema = new Schema<IChangedField>(
  {
    fieldKey: { type: String, required: true },
    oldValue: { type: Schema.Types.Mixed },
    newValue: { type: Schema.Types.Mixed },
    isSensitive: { type: Boolean, default: false }
  },
  { _id: false }
);

const AuditLogSchema = new Schema<IAuditLogDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    submissionId: { type: Schema.Types.ObjectId, ref: 'FormSubmission', index: true },
    templateId: { type: Schema.Types.ObjectId, ref: 'FormTemplate' },
    action: {
      type: String,
      enum: [
        'CREATE',
        'UPDATE_VALUE',
        'VOICE_PROCESS',
        'CONFIRM_SENSITIVE',
        'SUBMIT',
        'REOPEN',
        'DUPLICATE',
        'DELETE'
      ],
      required: true,
      index: true
    },
    changedFields: [ChangedFieldSchema],
    source: { type: String, enum: ['voice', 'text', 'system'], default: 'text' },
    ip: { type: String },
    userAgent: { type: String },
    timestamp: { type: Date, default: Date.now, index: true }
  },
  {
    timestamps: false
  }
);

export const AuditLog: Model<IAuditLogDocument> = mongoose.model<IAuditLogDocument>(
  'AuditLog',
  AuditLogSchema
);
