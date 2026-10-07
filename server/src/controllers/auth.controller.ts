import type { Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import type { AuthRequest } from '../types/index.js';

export class AuthController {
  static async register(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.register({
        ...req.body,
        ip: req.ip,
        userAgent: req.headers['user-agent']
      });

      ApiResponse.created({
        res,
        message: 'User registered successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.login({
        ...req.body,
        ip: req.ip,
        userAgent: req.headers['user-agent']
      });

      ApiResponse.success({
        res,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async refresh(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.refreshTokens({
        refreshToken: req.body.refreshToken,
        ip: req.ip,
        userAgent: req.headers['user-agent']
      });

      ApiResponse.success({
        res,
        message: 'Tokens refreshed successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await AuthService.logout(req.body.refreshToken);
      ApiResponse.success({
        res,
        message: 'Logged out successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.forgotPassword(
        req.body.email,
        req.ip,
        req.headers['user-agent']
      );
      ApiResponse.success({
        res,
        message: result.message,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.resetPassword(
        req.body.token,
        req.body.newPassword,
        req.ip,
        req.headers['user-agent']
      );
      ApiResponse.success({
        res,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await AuthService.getCurrentUser(req.user!.id);
      ApiResponse.success({
        res,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await AuthService.updateProfile(req.user!.id, req.body);
      ApiResponse.success({
        res,
        message: 'Profile updated successfully',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }
}
