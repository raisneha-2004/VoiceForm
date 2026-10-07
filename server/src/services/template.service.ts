import { FormTemplate } from '../models/template.model.js';
import { ConflictError, NotFoundError } from '../utils/apiError.js';
import type { IFormField, TemplateCategory, TemplateStatus } from '../types/index.js';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

export class TemplateService {
  static async listTemplates(params: {
    category?: TemplateCategory;
    status?: TemplateStatus;
    search?: string;
    page?: number;
    limit?: number;
    includeDrafts?: boolean;
  }) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 20));
    const skip = (page - 1) * limit;

    const query: Record<string, any> = {};

    if (!params.includeDrafts) {
      query.status = 'published';
    } else if (params.status) {
      query.status = params.status;
    }

    if (params.category) {
      query.category = params.category;
    }

    if (params.search) {
      query.$or = [
        { title: { $regex: params.search, $options: 'i' } },
        { description: { $regex: params.search, $options: 'i' } }
      ];
    }

    const [templates, total] = await Promise.all([
      FormTemplate.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      FormTemplate.countDocuments(query)
    ]);

    return {
      templates: templates.map((t) => t.toJSON()),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  static async getTemplateById(idOrSlug: string) {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
    const query = isObjectId ? { $or: [{ _id: idOrSlug }, { slug: idOrSlug }] } : { slug: idOrSlug };

    const template = await FormTemplate.findOne(query);
    if (!template) {
      throw new NotFoundError(`Form template '${idOrSlug}' not found.`);
    }

    return template.toJSON();
  }

  static async createTemplate(params: {
    title: string;
    slug?: string;
    description: string;
    category?: TemplateCategory;
    status?: TemplateStatus;
    icon?: string;
    estimatedMinutes?: number;
    fields: IFormField[];
    conditionalRules?: any[];
    createdBy?: string;
  }) {
    const slug = params.slug ? slugify(params.slug) : slugify(params.title);

    const existing = await FormTemplate.findOne({ slug });
    if (existing) {
      throw new ConflictError(`A template with slug '${slug}' already exists.`);
    }

    // Assign order to fields if missing
    const formattedFields = params.fields.map((f, idx) => ({
      ...f,
      order: f.order ?? idx
    }));

    const template = new FormTemplate({
      title: params.title,
      slug,
      description: params.description,
      category: params.category || 'General',
      status: params.status || 'draft',
      icon: params.icon || 'FileText',
      estimatedMinutes: params.estimatedMinutes || 5,
      fields: formattedFields,
      conditionalRules: params.conditionalRules || [],
      createdBy: params.createdBy
    });

    await template.save();
    return template.toJSON();
  }

  static async updateTemplate(
    id: string,
    updates: Partial<{
      title: string;
      description: string;
      category: TemplateCategory;
      status: TemplateStatus;
      icon: string;
      estimatedMinutes: number;
      fields: IFormField[];
      conditionalRules: any[];
    }>
  ) {
    const template = await FormTemplate.findById(id);
    if (!template) {
      throw new NotFoundError(`Template '${id}' not found.`);
    }

    if (updates.title) template.title = updates.title;
    if (updates.description) template.description = updates.description;
    if (updates.category) template.category = updates.category;
    if (updates.status) template.status = updates.status;
    if (updates.icon) template.icon = updates.icon;
    if (updates.estimatedMinutes) template.estimatedMinutes = updates.estimatedMinutes;
    if (updates.fields) {
      template.fields = updates.fields.map((f, idx) => ({
        ...f,
        order: f.order ?? idx
      }));
    }
    if (updates.conditionalRules) template.conditionalRules = updates.conditionalRules;

    await template.save();
    return template.toJSON();
  }

  static async deleteTemplate(id: string) {
    const template = await FormTemplate.findById(id);
    if (!template) {
      throw new NotFoundError(`Template '${id}' not found.`);
    }

    // Soft archive or hard delete
    await FormTemplate.findByIdAndDelete(id);
    return { message: 'Template successfully deleted.' };
  }

  static async togglePublish(id: string) {
    const template = await FormTemplate.findById(id);
    if (!template) {
      throw new NotFoundError(`Template '${id}' not found.`);
    }

    template.status = template.status === 'published' ? 'draft' : 'published';
    await template.save();

    return template.toJSON();
  }
}
