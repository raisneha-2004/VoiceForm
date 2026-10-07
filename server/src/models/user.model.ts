import mongoose, { Schema, type Document, type Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import type { Role, UserPreferences } from '../types/index.js';

export interface IRefreshToken {
  tokenHash: string;
  expiresAt: Date;
  userAgent?: string;
  ip?: string;
  createdAt: Date;
}

export interface IUserDocument extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  avatar?: string;
  preferences: UserPreferences;
  refreshTokens: IRefreshToken[];
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const RefreshTokenSchema = new Schema<IRefreshToken>({
  tokenHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  userAgent: { type: String },
  ip: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const UserPreferencesSchema = new Schema<UserPreferences>(
  {
    preferredLanguage: {
      type: String,
      enum: ['en-US', 'hi-IN', 'hinglish'],
      default: 'en-US'
    },
    autoSpeakQuestions: { type: Boolean, default: true },
    confirmSensitiveFields: { type: Boolean, default: true },
    speechRate: { type: Number, default: 1.0 },
    speechPitch: { type: Number, default: 1.0 },
    theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' }
  },
  { _id: false }
);

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
      index: true
    },
    avatar: { type: String },
    preferences: {
      type: UserPreferencesSchema,
      default: () => ({
        preferredLanguage: 'en-US',
        autoSpeakQuestions: true,
        confirmSensitiveFields: true,
        speechRate: 1.0,
        speechPitch: 1.0,
        theme: 'system'
      })
    },
    refreshTokens: [RefreshTokenSchema],
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete (ret as any).passwordHash;
        delete (ret as any).refreshTokens;
        delete (ret as any).resetPasswordToken;
        delete (ret as any).resetPasswordExpires;
        delete (ret as any).__v;
        ret.id = ret._id.toString();
        return ret;
      }
    }
  }
);

UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.passwordHash);
};

export const User: Model<IUserDocument> = mongoose.model<IUserDocument>('User', UserSchema);
