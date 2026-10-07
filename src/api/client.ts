import axios, { type AxiosInstance } from 'axios';
import { mockApi } from './mockAdapter';
import type { FormTemplate, FormSubmission } from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for Auth Bearer Token
apiClient.interceptors.request.use(
  (config) => {
    try {
      const authRaw = localStorage.getItem('voiceform_auth_storage');
      if (authRaw) {
        const parsed = JSON.parse(authRaw);
        if (parsed?.state?.token) {
          config.headers.Authorization = `Bearer ${parsed.state.token}`;
        }
      }
    } catch (e) {
      // ignore
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Helper to safely unwrap backend ApiResponse envelope { success: true, data: ... }
function unwrapData<T>(response: any, fallback: T): T {
  if (!response) return fallback;
  if (response.data && response.data.data !== undefined) {
    return response.data.data;
  }
  if (response.data !== undefined) {
    return response.data;
  }
  return fallback;
}

// High-level API Services with fallback to mockApi if backend is offline/erroring
export const templateService = {
  async getAll(): Promise<FormTemplate[]> {
    try {
      const res = await apiClient.get('/templates');
      const data = unwrapData<FormTemplate[]>(res, []);
      const mockList = await mockApi.getTemplates();
      if (Array.isArray(data) && data.length > 0) {
        const backendList = data.map((t: any) => ({ ...t, id: t.id || t._id }));
        const existingIds = new Set(backendList.map((t: any) => t.id || t.slug || t.title));
        const missingFromBackend = mockList.filter(
          (t: any) => !existingIds.has(t.id) && !existingIds.has(t.title)
        );
        return [...backendList, ...missingFromBackend];
      }
      return mockList;
    } catch (err) {
      // Backend offline or error: use mock fallback
      return mockApi.getTemplates();
    }
  },

  async getById(id: string): Promise<FormTemplate | null> {
    try {
      const res = await apiClient.get(`/templates/${id}`);
      const data = unwrapData<any>(res, null);
      if (data) {
        return { ...data, id: data.id || data._id };
      }
      return mockApi.getTemplateById(id);
    } catch (err) {
      return mockApi.getTemplateById(id);
    }
  },

  async create(template: Omit<FormTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<FormTemplate> {
    try {
      const res = await apiClient.post('/templates', template);
      const data = unwrapData<any>(res, null);
      if (data) return { ...data, id: data.id || data._id };
      return mockApi.createTemplate(template);
    } catch (err) {
      return mockApi.createTemplate(template);
    }
  },

  async update(id: string, updates: Partial<FormTemplate>): Promise<FormTemplate> {
    try {
      const res = await apiClient.put(`/templates/${id}`, updates);
      const data = unwrapData<any>(res, null);
      if (data) return { ...data, id: data.id || data._id };
      return mockApi.updateTemplate(id, updates);
    } catch (err) {
      return mockApi.updateTemplate(id, updates);
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/templates/${id}`);
      return true;
    } catch (err) {
      return mockApi.deleteTemplate(id);
    }
  }
};

export const submissionService = {
  async getAll(userId?: string): Promise<FormSubmission[]> {
    try {
      const res = await apiClient.get('/submissions', { params: { userId } });
      const data = unwrapData<FormSubmission[]>(res, []);
      if (Array.isArray(data)) {
        return data.map((s: any) => ({ ...s, id: s.id || s._id }));
      }
      return mockApi.getSubmissions(userId);
    } catch (err) {
      return mockApi.getSubmissions(userId);
    }
  },

  async getById(id: string): Promise<FormSubmission | null> {
    try {
      const res = await apiClient.get(`/submissions/${id}`);
      const data = unwrapData<any>(res, null);
      if (data) return { ...data, id: data.id || data._id };
      return mockApi.getSubmissionById(id);
    } catch (err) {
      return mockApi.getSubmissionById(id);
    }
  },

  async save(sub: Partial<FormSubmission> & { templateId: string; templateTitle: string; data: Record<string, any> }): Promise<FormSubmission> {
    try {
      const res = await apiClient.post('/submissions', sub);
      const data = unwrapData<any>(res, null);
      if (data) return { ...data, id: data.id || data._id };
      return mockApi.saveSubmission(sub);
    } catch (err) {
      return mockApi.saveSubmission(sub);
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/submissions/${id}`);
      return true;
    } catch (err) {
      return mockApi.deleteSubmission(id);
    }
  },

  async duplicate(id: string): Promise<FormSubmission> {
    try {
      const res = await apiClient.post(`/submissions/${id}/duplicate`);
      const data = unwrapData<any>(res, null);
      if (data) return { ...data, id: data.id || data._id };
      return mockApi.duplicateSubmission(id);
    } catch (err) {
      return mockApi.duplicateSubmission(id);
    }
  }
};
