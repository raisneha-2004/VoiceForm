import type { Response } from 'express';

export interface ApiResponseOptions<T> {
  res: Response;
  statusCode?: number;
  message?: string;
  data?: T;
  meta?: Record<string, any>;
}

export class ApiResponse {
  static success<T>({
    res,
    statusCode = 200,
    message,
    data,
    meta
  }: ApiResponseOptions<T>) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      meta,
      timestamp: new Date().toISOString()
    });
  }

  static created<T>({ res, message = 'Resource created successfully', data }: { res: Response; message?: string; data: T }) {
    return this.success({ res, statusCode: 201, message, data });
  }

  static noContent(res: Response) {
    return res.status(204).send();
  }
}
