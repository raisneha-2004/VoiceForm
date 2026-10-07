import type { Response, NextFunction } from 'express';
import { SubmissionService } from '../services/submission.service.js';
import { PdfService } from '../services/pdf.service.js';
import { FormSubmission } from '../models/submission.model.js';
import { FormTemplate } from '../models/template.model.js';
import { User } from '../models/user.model.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { NotFoundError } from '../utils/apiError.js';
import type { AuthRequest } from '../types/index.js';

export class SubmissionController {
  static async listSubmissions(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const isAdmin = req.user?.role === 'admin';
      const result = await SubmissionService.listUserSubmissions({
        userId: req.user!.id,
        isAdmin,
        templateId: req.query.templateId as string,
        status: req.query.status as any,
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined
      });

      ApiResponse.success({
        res,
        data: result.submissions,
        meta: result.meta
      });
    } catch (error) {
      next(error);
    }
  }

  static async getSubmission(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const isAdmin = req.user?.role === 'admin';
      const submission = await SubmissionService.getSubmission(
        id,
        req.user!.id,
        isAdmin
      );

      ApiResponse.success({
        res,
        data: submission
      });
    } catch (error) {
      next(error);
    }
  }

  static async createSubmission(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const submission = await SubmissionService.createSubmission({
        userId: req.user!.id,
        templateId: req.body.templateId,
        title: req.body.title,
        initialValues: req.body.initialValues,
        ip: req.ip,
        userAgent: req.headers['user-agent']
      });

      ApiResponse.created({
        res,
        message: 'Submission draft created successfully',
        data: submission
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateSubmission(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const isAdmin = req.user?.role === 'admin';
      const submission = await SubmissionService.updateSubmission({
        id,
        userId: req.user!.id,
        isAdmin,
        values: req.body.values,
        title: req.body.title,
        status: req.body.status,
        source: 'text',
        ip: req.ip,
        userAgent: req.headers['user-agent']
      });

      ApiResponse.success({
        res,
        message: 'Submission updated successfully',
        data: submission
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteSubmission(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const isAdmin = req.user?.role === 'admin';
      const result = await SubmissionService.softDeleteSubmission(
        id,
        req.user!.id,
        isAdmin
      );

      ApiResponse.success({
        res,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }

  static async duplicateSubmission(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const clone = await SubmissionService.duplicateSubmission(id, req.user!.id);
      ApiResponse.created({
        res,
        message: 'Submission duplicated as new draft',
        data: clone
      });
    } catch (error) {
      next(error);
    }
  }

  static async submitSubmission(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const isAdmin = req.user?.role === 'admin';
      const submitted = await SubmissionService.submitSubmission(
        id,
        req.user!.id,
        isAdmin,
        req.ip,
        req.headers['user-agent']
      );

      ApiResponse.success({
        res,
        message: 'Form successfully submitted!',
        data: submitted
      });
    } catch (error) {
      next(error);
    }
  }

  static async downloadPdf(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const submission = await FormSubmission.findOne({
        _id: id,
        isDeleted: false
      });
      if (!submission) {
        throw new NotFoundError('Submission not found.');
      }

      const template = await FormTemplate.findById(submission.templateId);
      if (!template) {
        throw new NotFoundError('Associated form template not found.');
      }

      const user = await User.findById(submission.userId);

      const doc = PdfService.generateSubmissionPdf(
        submission,
        template,
        user ? { name: user.name, email: user.email } : undefined
      );

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="submission-${submission._id}.pdf"`
      );

      doc.pipe(res);
      doc.end();
    } catch (error) {
      next(error);
    }
  }
}
