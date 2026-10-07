import type { Response, NextFunction } from 'express';
import { TemplateService } from '../services/template.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import type { AuthRequest } from '../types/index.js';

export class TemplateController {
  static async listTemplates(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const isAdmin = req.user?.role === 'admin';
      const result = await TemplateService.listTemplates({
        category: req.query.category as any,
        status: req.query.status as any,
        search: req.query.search as string,
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        includeDrafts: isAdmin
      });

      ApiResponse.success({
        res,
        data: result.templates,
        meta: result.meta
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTemplate(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const template = await TemplateService.getTemplateById(id);
      ApiResponse.success({
        res,
        data: template
      });
    } catch (error) {
      next(error);
    }
  }

  static async createTemplate(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const template = await TemplateService.createTemplate({
        ...req.body,
        createdBy: req.user?.id
      });

      ApiResponse.created({
        res,
        message: 'Template created successfully',
        data: template
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateTemplate(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const updated = await TemplateService.updateTemplate(id, req.body);
      ApiResponse.success({
        res,
        message: 'Template updated successfully',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteTemplate(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const result = await TemplateService.deleteTemplate(id);
      ApiResponse.success({
        res,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }

  static async publishTemplate(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const updated = await TemplateService.togglePublish(id);
      ApiResponse.success({
        res,
        message: `Template status changed to '${updated.status}'`,
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }
}
