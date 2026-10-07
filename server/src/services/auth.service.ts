import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { User, type IUserDocument } from '../models/user.model.js';
import { AuditLog } from '../models/auditLog.model.js';
import { env } from '../config/env.js';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError
} from '../utils/apiError.js';
import type { AuthUserPayload, UserPreferences } from '../types/index.js';

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export class AuthService {
  private static generateTokens(user: IUserDocument) {
    const payload: AuthUserPayload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name
    };

    const accessExpiresIn = (env.JWT_ACCESS_EXPIRES_IN || '15m') as SignOptions['expiresIn'];

    const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: accessExpiresIn
    });

    const rawRefreshToken = crypto.randomBytes(40).toString('hex');
    const refreshExpiresDays = 7;
    const refreshExpiry = new Date();
    refreshExpiry.setDate(refreshExpiry.getDate() + refreshExpiresDays);

    return {
      accessToken,
      rawRefreshToken,
      refreshExpiry
    };
  }

  static async register(params: {
    name: string;
    email: string;
    password: string;
    role?: 'user' | 'admin';
    preferences?: Partial<UserPreferences>;
    ip?: string;
    userAgent?: string;
  }) {
    const existing = await User.findOne({ email: params.email.toLowerCase() });
    if (existing) {
      throw new ConflictError('A user with this email already exists.');
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(params.password, salt);

    const user = new User({
      name: params.name,
      email: params.email.toLowerCase(),
      passwordHash,
      role: params.role || 'user',
      preferences: {
        preferredLanguage: params.preferences?.preferredLanguage || 'en-US',
        autoSpeakQuestions: params.preferences?.autoSpeakQuestions ?? true,
        confirmSensitiveFields: params.preferences?.confirmSensitiveFields ?? true,
        speechRate: params.preferences?.speechRate ?? 1.0,
        speechPitch: params.preferences?.speechPitch ?? 1.0,
        theme: params.preferences?.theme || 'system'
      }
    });

    const { accessToken, rawRefreshToken, refreshExpiry } = this.generateTokens(user);

    user.refreshTokens.push({
      tokenHash: hashToken(rawRefreshToken),
      expiresAt: refreshExpiry,
      userAgent: params.userAgent,
      ip: params.ip,
      createdAt: new Date()
    });

    await user.save();

    await AuditLog.create({
      userId: user._id,
      action: 'CREATE',
      changedFields: [{ fieldKey: 'user', oldValue: null, newValue: { email: user.email, name: user.name } }],
      source: 'system',
      ip: params.ip,
      userAgent: params.userAgent
    });

    return {
      user: user.toJSON(),
      tokens: {
        accessToken,
        refreshToken: rawRefreshToken,
        expiresIn: env.JWT_ACCESS_EXPIRES_IN
      }
    };
  }

  static async login(params: {
    email: string;
    password: string;
    ip?: string;
    userAgent?: string;
  }) {
    const user = await User.findOne({ email: params.email.toLowerCase() }).select('+passwordHash');
    if (!user) {
      throw new UnauthorizedError('Invalid email or password.');
    }

    const isMatch = await user.comparePassword(params.password);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password.');
    }

    const { accessToken, rawRefreshToken, refreshExpiry } = this.generateTokens(user);

    // Filter out expired refresh tokens
    const now = new Date();
    user.refreshTokens = user.refreshTokens.filter((rt) => rt.expiresAt > now);

    // Limit active sessions to 10
    if (user.refreshTokens.length >= 10) {
      user.refreshTokens.shift();
    }

    user.refreshTokens.push({
      tokenHash: hashToken(rawRefreshToken),
      expiresAt: refreshExpiry,
      userAgent: params.userAgent,
      ip: params.ip,
      createdAt: new Date()
    });

    await user.save();

    return {
      user: user.toJSON(),
      tokens: {
        accessToken,
        refreshToken: rawRefreshToken,
        expiresIn: env.JWT_ACCESS_EXPIRES_IN
      }
    };
  }

  static async refreshTokens(params: {
    refreshToken: string;
    ip?: string;
    userAgent?: string;
  }) {
    const hashed = hashToken(params.refreshToken);
    const user = await User.findOne({ 'refreshTokens.tokenHash': hashed });

    if (!user) {
      throw new UnauthorizedError('Invalid or revoked refresh token.');
    }

    const matchingToken = user.refreshTokens.find((rt) => rt.tokenHash === hashed);
    if (!matchingToken || matchingToken.expiresAt < new Date()) {
      user.refreshTokens = user.refreshTokens.filter((rt) => rt.tokenHash !== hashed);
      await user.save();
      throw new UnauthorizedError('Refresh token has expired. Please log in again.');
    }

    // Token rotation: remove old token, issue new token pair
    user.refreshTokens = user.refreshTokens.filter((rt) => rt.tokenHash !== hashed);

    const { accessToken, rawRefreshToken, refreshExpiry } = this.generateTokens(user);

    user.refreshTokens.push({
      tokenHash: hashToken(rawRefreshToken),
      expiresAt: refreshExpiry,
      userAgent: params.userAgent,
      ip: params.ip,
      createdAt: new Date()
    });

    await user.save();

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      expiresIn: env.JWT_ACCESS_EXPIRES_IN
    };
  }

  static async logout(refreshToken: string) {
    if (!refreshToken) return;
    const hashed = hashToken(refreshToken);
    await User.updateOne(
      { 'refreshTokens.tokenHash': hashed },
      { $pull: { refreshTokens: { tokenHash: hashed } } }
    );
  }

  static async forgotPassword(email: string, ip?: string, userAgent?: string) {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Return success to prevent user enumeration attacks
      return { message: 'If an account exists with this email, password reset instructions have been generated.' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = hashToken(resetToken);
    const expires = new Date();
    expires.setHours(expires.getHours() + 1);
    user.resetPasswordExpires = expires;

    await user.save();

    await AuditLog.create({
      userId: user._id,
      action: 'UPDATE_VALUE',
      changedFields: [{ fieldKey: 'passwordResetRequested', oldValue: null, newValue: true }],
      source: 'system',
      ip,
      userAgent
    });

    return {
      message: 'Password reset token generated.',
      resetToken: env.NODE_ENV === 'development' || env.NODE_ENV === 'test' ? resetToken : undefined
    };
  }

  static async resetPassword(token: string, newPass: string, ip?: string, userAgent?: string) {
    const hashed = hashToken(token);
    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      throw new BadRequestError('Password reset token is invalid or has expired.');
    }

    const salt = await bcrypt.genSalt(12);
    user.passwordHash = await bcrypt.hash(newPass, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    // Invalidate all existing sessions on password change
    user.refreshTokens = [];

    await user.save();

    await AuditLog.create({
      userId: user._id,
      action: 'UPDATE_VALUE',
      changedFields: [{ fieldKey: 'password', oldValue: null, newValue: '***MASKED***', isSensitive: true }],
      source: 'system',
      ip,
      userAgent
    });

    return { message: 'Password has been successfully updated. Please log in with your new password.' };
  }

  static async getCurrentUser(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User profile not found.');
    }
    return user.toJSON();
  }

  static async updateProfile(userId: string, updates: { name?: string; avatar?: string; preferences?: Partial<UserPreferences> }) {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found.');
    }

    if (updates.name) user.name = updates.name.trim();
    if (updates.avatar !== undefined) user.avatar = updates.avatar;
    if (updates.preferences) {
      user.preferences = {
        ...user.preferences,
        ...updates.preferences
      };
    }

    await user.save();
    return user.toJSON();
  }
}
