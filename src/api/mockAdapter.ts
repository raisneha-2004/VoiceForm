import type { FormTemplate, FormSubmission } from '../types';
import { INITIAL_TEMPLATES, INITIAL_SUBMISSIONS } from '../data/mockTemplates';

const TEMPLATES_KEY = 'voiceform_mock_templates';
const SUBMISSIONS_KEY = 'voiceform_mock_submissions';

// Helper to get stored or initialize
function getStoredTemplates(): FormTemplate[] {
  try {
    const raw = localStorage.getItem(TEMPLATES_KEY);
    if (raw) {
      const parsed: FormTemplate[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Map stored templates by ID
        const storedMap = new Map(parsed.map((t) => [t.id, t]));
        // Merge INITIAL_TEMPLATES (prioritizing updated definitions or keeping custom edits)
        const merged = INITIAL_TEMPLATES.map((t) => storedMap.get(t.id) || t);
        // Also keep any user-created custom templates created from FormBuilder
        const initialIds = new Set(INITIAL_TEMPLATES.map((t) => t.id));
        const customTemplates = parsed.filter((t) => !initialIds.has(t.id));
        const all = [...merged, ...customTemplates];
        if (all.length !== parsed.length || parsed.length < INITIAL_TEMPLATES.length) {
          saveStoredTemplates(all);
        }
        return all;
      }
    }
  } catch (e) {
    console.error('Error reading stored templates', e);
  }
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(INITIAL_TEMPLATES));
  return INITIAL_TEMPLATES;
}

function saveStoredTemplates(templates: FormTemplate[]) {
  try {
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
  } catch (e) {
    console.error('Error saving templates', e);
  }
}

function getStoredSubmissions(): FormSubmission[] {
  try {
    const raw = localStorage.getItem(SUBMISSIONS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading stored submissions', e);
  }
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(INITIAL_SUBMISSIONS));
  return INITIAL_SUBMISSIONS;
}

function saveStoredSubmissions(submissions: FormSubmission[]) {
  try {
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
  } catch (e) {
    console.error('Error saving submissions', e);
  }
}

// Mock API functions simulating async network calls with realistic delay
export const mockApi = {
  // Templates
  async getTemplates(): Promise<FormTemplate[]> {
    await new Promise((r) => setTimeout(r, 250));
    return getStoredTemplates();
  },

  async getTemplateById(id: string): Promise<FormTemplate | null> {
    await new Promise((r) => setTimeout(r, 200));
    const list = getStoredTemplates();
    return list.find((t) => t.id === id) || null;
  },

  async createTemplate(template: Omit<FormTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<FormTemplate> {
    await new Promise((r) => setTimeout(r, 400));
    const now = new Date().toISOString();
    const newTemplate: FormTemplate = {
      ...template,
      id: 'template-' + Math.random().toString(36).substring(2, 9),
      createdAt: now,
      updatedAt: now
    };
    const list = getStoredTemplates();
    const updated = [newTemplate, ...list];
    saveStoredTemplates(updated);
    return newTemplate;
  },

  async updateTemplate(id: string, updates: Partial<FormTemplate>): Promise<FormTemplate> {
    await new Promise((r) => setTimeout(r, 350));
    const list = getStoredTemplates();
    const index = list.findIndex((t) => t.id === id);
    if (index === -1) throw new Error('Template not found');
    const updatedTemplate: FormTemplate = {
      ...list[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    list[index] = updatedTemplate;
    saveStoredTemplates(list);
    return updatedTemplate;
  },

  async deleteTemplate(id: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 300));
    const list = getStoredTemplates();
    const filtered = list.filter((t) => t.id !== id);
    saveStoredTemplates(filtered);
    return true;
  },

  // Submissions
  async getSubmissions(userId?: string): Promise<FormSubmission[]> {
    await new Promise((r) => setTimeout(r, 300));
    const list = getStoredSubmissions();
    if (userId) {
      return list.filter((s) => s.userId === userId);
    }
    return list;
  },

  async getSubmissionById(id: string): Promise<FormSubmission | null> {
    await new Promise((r) => setTimeout(r, 200));
    const list = getStoredSubmissions();
    return list.find((s) => s.id === id) || null;
  },

  async saveSubmission(submission: Partial<FormSubmission> & { templateId: string; templateTitle: string; data: Record<string, any> }): Promise<FormSubmission> {
    await new Promise((r) => setTimeout(r, 350));
    const list = getStoredSubmissions();
    const now = new Date().toISOString();

    // calculate completion
    const keys = Object.keys(submission.data);
    const filledCount = keys.filter((k) => {
      const val = submission.data[k];
      return val !== '' && val !== null && val !== undefined && val !== false;
    }).length;
    const percentage = keys.length > 0 ? Math.min(100, Math.round((filledCount / keys.length) * 100)) : 0;

    if (submission.id) {
      const idx = list.findIndex((s) => s.id === submission.id);
      if (idx !== -1) {
        const updated: FormSubmission = {
          ...list[idx],
          ...submission,
          completionPercentage: submission.completionPercentage ?? percentage,
          lastUpdated: now
        } as FormSubmission;
        list[idx] = updated;
        saveStoredSubmissions(list);
        return updated;
      }
    }

    // New submission
    const newSub: FormSubmission = {
      id: 'sub-' + Math.random().toString(36).substring(2, 9),
      templateId: submission.templateId,
      templateTitle: submission.templateTitle,
      userId: submission.userId || 'user-sneha-1',
      status: submission.status || 'draft',
      data: submission.data,
      completionPercentage: submission.completionPercentage ?? percentage,
      lastUpdated: now,
      createdAt: now
    };
    saveStoredSubmissions([newSub, ...list]);
    return newSub;
  },

  async deleteSubmission(id: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 300));
    const list = getStoredSubmissions();
    const filtered = list.filter((s) => s.id !== id);
    saveStoredSubmissions(filtered);
    return true;
  },

  async duplicateSubmission(id: string): Promise<FormSubmission> {
    await new Promise((r) => setTimeout(r, 300));
    const list = getStoredSubmissions();
    const target = list.find((s) => s.id === id);
    if (!target) throw new Error('Submission not found');
    const now = new Date().toISOString();
    const duplicated: FormSubmission = {
      ...target,
      id: 'sub-' + Math.random().toString(36).substring(2, 9),
      templateTitle: `${target.templateTitle} (Copy)`,
      status: 'draft',
      createdAt: now,
      lastUpdated: now
    };
    saveStoredSubmissions([duplicated, ...list]);
    return duplicated;
  }
};
