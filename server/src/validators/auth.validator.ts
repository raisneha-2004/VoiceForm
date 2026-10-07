import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Invalid email address').toLowerCase(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role: z.enum(['user', 'admin']).optional().default('user'),
    preferences: z
      .object({
        preferredLanguage: z.enum(['en-US', 'hi-IN', 'hinglish']).optional().default('en-US'),
        autoSpeakQuestions: z.boolean().optional().default(true),
        confirmSensitiveFields: z.boolean().optional().default(true),
        speechRate: z.number().min(0.5).max(2.0).optional().default(1.0),
        speechPitch: z.number().min(0.5).max(1.5).optional().default(1.0),
        theme: z.enum(['light', 'dark', 'system']).optional().default('system')
      })
      .optional()
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address').toLowerCase(),
    password: z.string().min(1, 'Password is required')
  })
});

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required')
  })
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address').toLowerCase()
  })
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Reset token is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters')
  })
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    avatar: z.string().url().optional(),
    preferences: z
      .object({
        preferredLanguage: z.enum(['en-US', 'hi-IN', 'hinglish']).optional(),
        autoSpeakQuestions: z.boolean().optional(),
        confirmSensitiveFields: z.boolean().optional(),
        speechRate: z.number().min(0.5).max(2.0).optional(),
        speechPitch: z.number().min(0.5).max(1.5).optional(),
        theme: z.enum(['light', 'dark', 'system']).optional()
      })
      .optional()
  })
});
