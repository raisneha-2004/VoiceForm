import mongoose, { Schema, type Document, type Model } from 'mongoose';
import type {
  IFormField,
  TemplateStatus,
  TemplateCategory,
  SelectOption,
  ConditionalRule,
  ValidationRule
} from '../types/index.js';

export interface IFormTemplateDocument extends Document {
  title: string;
  slug: string;
  description: string;
  category: TemplateCategory;
  status: TemplateStatus;
  icon: string;
  estimatedMinutes: number;
  fields: IFormField[];
  conditionalRules: any[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SelectOptionSchema = new Schema<SelectOption>(
  {
    label: { type: String, required: true },
    value: { type: String, required: true }
  },
  { _id: false }
);

const ConditionalRuleSchema = new Schema<ConditionalRule>(
  {
    dependsOnKey: { type: String, required: true },
    condition: { type: String, enum: ['equals', 'notEquals', 'contains'], required: true },
    value: { type: Schema.Types.Mixed, required: true }
  },
  { _id: false }
);

const ValidationRuleSchema = new Schema<ValidationRule>(
  {
    min: { type: Number },
    max: { type: Number },
    pattern: { type: String },
    customErrorMessage: { type: String }
  },
  { _id: false }
);

const FormFieldSchema = new Schema<IFormField>(
  {
    id: { type: String, required: true },
    key: { type: String, required: true },
    label: { type: String, required: true },
    type: {
      type: String,
      enum: [
        'text',
        'textarea',
        'number',
        'email',
        'phone',
        'date',
        'select',
        'checkbox',
        'radio',
        'file'
      ],
      required: true
    },
    placeholder: { type: String },
    required: { type: Boolean, default: false },
    helpText: { type: String },
    isSensitive: { type: Boolean, default: false },
    options: [SelectOptionSchema],
    conditional: { type: ConditionalRuleSchema },
    validation: { type: ValidationRuleSchema },
    defaultValue: { type: Schema.Types.Mixed },
    order: { type: Number, default: 0 }
  },
  { _id: false }
);

const FormTemplateSchema = new Schema<IFormTemplateDocument>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: [
        'Education',
        'Employment',
        'Healthcare',
        'Events',
        'Finance',
        'Government',
        'Real Estate',
        'Legal',
        'Travel',
        'General'
      ],
      default: 'General',
      index: true
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
      index: true
    },
    icon: { type: String, default: 'FileText' },
    estimatedMinutes: { type: Number, default: 5 },
    fields: [FormFieldSchema],
    conditionalRules: [Schema.Types.Mixed],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id.toString();
        delete (ret as any).__v;
        return ret;
      }
    }
  }
);

export const FormTemplate: Model<IFormTemplateDocument> = mongoose.model<IFormTemplateDocument>(
  'FormTemplate',
  FormTemplateSchema
);
