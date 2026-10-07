import type { Response, NextFunction } from 'express';
import { VoiceService } from '../services/voice.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import type { AuthRequest } from '../types/index.js';

export class VoiceController {
  static async processVoice(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await VoiceService.processVoiceInput({
        submissionId: req.body.submissionId,
        templateId: req.body.templateId,
        transcript: req.body.transcript,
        language: req.body.language || 'en-IN',
        activeFieldKey: req.body.activeFieldKey,
        userId: req.user!.id,
        ip: req.ip,
        userAgent: req.headers['user-agent']
      });

      ApiResponse.success({
        res,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async confirmSensitive(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await VoiceService.confirmSensitiveField({
        submissionId: req.body.submissionId,
        fieldKey: req.body.fieldKey,
        value: req.body.value,
        confirmed: req.body.confirmed,
        userId: req.user!.id,
        ip: req.ip,
        userAgent: req.headers['user-agent']
      });

      ApiResponse.success({
        res,
        message: result.message,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async reviewVoiceForm(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await VoiceService.reviewFormSummary(req.body.submissionId);
      ApiResponse.success({
        res,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async commandVoice(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await VoiceService.processVoiceInput({
        submissionId: req.body.submissionId,
        templateId: req.body.templateId || '',
        transcript: req.body.command,
        language: 'en-US',
        activeFieldKey: req.body.activeFieldKey,
        userId: req.user!.id,
        ip: req.ip,
        userAgent: req.headers['user-agent']
      });

      ApiResponse.success({
        res,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}
