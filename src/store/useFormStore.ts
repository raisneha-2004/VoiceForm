import { create } from 'zustand';
import type { FormTemplate, FormSubmission, AiDetectedChange } from '../types';

export interface PendingVoiceConfirmation {
  fieldKey: string;
  fieldLabel: string;
  value: any;
  rawTranscript: string;
}

export interface PdfPreviewState {
  isOpen: boolean;
  template: FormTemplate | null;
  formValues: Record<string, any>;
  submissionMeta?: Partial<FormSubmission>;
}

interface FormState {
  activeTemplate: FormTemplate | null;
  activeSubmission: FormSubmission | null;
  formValues: Record<string, any>;
  activeFieldKey: string | null;
  aiChanges: AiDetectedChange[];
  autoSaveStatus: 'saved' | 'saving' | 'unsaved';
  lastAutoSavedAt: string | null;
  pendingVoiceConfirmation: PendingVoiceConfirmation | null;
  isReviewOpen: boolean;
  pdfPreviewState: PdfPreviewState;

  setActiveTemplate: (template: FormTemplate, initialValues?: Record<string, any>) => void;
  setActiveSubmission: (sub: FormSubmission | null) => void;
  setFormValues: (values: Record<string, any>) => void;
  setFieldValue: (key: string, value: any, options?: { logAi?: boolean; label?: string; description?: string }) => void;
  setActiveFieldKey: (key: string | null) => void;
  logAiChange: (change: Omit<AiDetectedChange, 'id' | 'timestamp'>) => void;
  clearAiChanges: () => void;
  setPendingVoiceConfirmation: (pending: PendingVoiceConfirmation | null) => void;
  confirmPendingVoiceChange: () => void;
  rejectPendingVoiceChange: () => void;
  setAutoSaveStatus: (status: 'saved' | 'saving' | 'unsaved') => void;
  setIsReviewOpen: (open: boolean) => void;
  openPdfPreview: (template: FormTemplate, formValues: Record<string, any>, submissionMeta?: Partial<FormSubmission>) => void;
  closePdfPreview: () => void;
  resetFormState: () => void;
}

export const useFormStore = create<FormState>((set, get) => ({
  activeTemplate: null,
  activeSubmission: null,
  formValues: {},
  activeFieldKey: null,
  aiChanges: [
    {
      id: 'init-ai-1',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      description: 'VoiceForm AI listening engine initialized. Speak or type to populate.',
      type: 'command'
    }
  ],
  autoSaveStatus: 'saved',
  lastAutoSavedAt: null,
  pendingVoiceConfirmation: null,
  isReviewOpen: false,
  pdfPreviewState: {
    isOpen: false,
    template: null,
    formValues: {},
    submissionMeta: undefined
  },

  setActiveTemplate: (template, initialValues = {}) => {
    // Generate default values from template
    const defaults: Record<string, any> = {};
    template.fields.forEach((f) => {
      if (f.defaultValue !== undefined) {
        defaults[f.key] = f.defaultValue;
      } else if (f.type === 'checkbox') {
        defaults[f.key] = false;
      } else {
        defaults[f.key] = '';
      }
    });

    set({
      activeTemplate: template,
      formValues: { ...defaults, ...initialValues },
      activeFieldKey: template.fields[0]?.key || null,
      autoSaveStatus: 'saved',
      lastAutoSavedAt: new Date().toLocaleTimeString(),
      aiChanges: [
        {
          id: 'tpl-init-' + Date.now(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          description: `Loaded template "${template.title}". Ready for input.`,
          type: 'command'
        }
      ]
    });
  },

  setActiveSubmission: (activeSubmission) => set({ activeSubmission }),

  setFormValues: (values) => set({ formValues: values, autoSaveStatus: 'unsaved' }),

  setFieldValue: (key, value, options) => {
    const { formValues, activeTemplate, logAiChange } = get();
    const oldValue = formValues[key];
    const newValues = { ...formValues, [key]: value };

    set({ formValues: newValues, autoSaveStatus: 'unsaved' });

    if (options?.logAi) {
      const fieldDef = activeTemplate?.fields.find((f) => f.key === key);
      const label = options.label || fieldDef?.label || key;
      const desc = options.description || `${label} updated to "${String(value)}"`;
      logAiChange({
        fieldKey: key,
        fieldLabel: label,
        oldValue,
        newValue: value,
        description: desc,
        type: 'update'
      });
    }
  },

  setActiveFieldKey: (activeFieldKey) => set({ activeFieldKey }),

  logAiChange: (change) => {
    const newEntry: AiDetectedChange = {
      ...change,
      id: 'ai-log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    set((state) => ({
      aiChanges: [newEntry, ...state.aiChanges].slice(0, 30)
    }));
  },

  clearAiChanges: () => set({ aiChanges: [] }),

  setPendingVoiceConfirmation: (pendingVoiceConfirmation) => set({ pendingVoiceConfirmation }),

  confirmPendingVoiceChange: () => {
    const { pendingVoiceConfirmation, setFieldValue, logAiChange } = get();
    if (pendingVoiceConfirmation) {
      setFieldValue(
        pendingVoiceConfirmation.fieldKey,
        pendingVoiceConfirmation.value,
        {
          label: pendingVoiceConfirmation.fieldLabel,
          description: `Confirmed: ${pendingVoiceConfirmation.fieldLabel} saved as "${pendingVoiceConfirmation.value}"`
        }
      );
      logAiChange({
        fieldKey: pendingVoiceConfirmation.fieldKey,
        fieldLabel: pendingVoiceConfirmation.fieldLabel,
        newValue: pendingVoiceConfirmation.value,
        description: `User verified voice extraction for ${pendingVoiceConfirmation.fieldLabel}`,
        type: 'confirmation'
      });
      set({ pendingVoiceConfirmation: null });
    }
  },

  rejectPendingVoiceChange: () => {
    const { pendingVoiceConfirmation, logAiChange } = get();
    if (pendingVoiceConfirmation) {
      logAiChange({
        fieldKey: pendingVoiceConfirmation.fieldKey,
        fieldLabel: pendingVoiceConfirmation.fieldLabel,
        description: `Rejected voice extraction for ${pendingVoiceConfirmation.fieldLabel} ("${pendingVoiceConfirmation.value}")`,
        type: 'warning'
      });
    }
    set({ pendingVoiceConfirmation: null });
  },

  setAutoSaveStatus: (autoSaveStatus) => {
    set({
      autoSaveStatus,
      lastAutoSavedAt: autoSaveStatus === 'saved' ? new Date().toLocaleTimeString() : get().lastAutoSavedAt
    });
  },

  setIsReviewOpen: (isReviewOpen) => set({ isReviewOpen }),

  openPdfPreview: (template, formValues, submissionMeta) => {
    set({
      pdfPreviewState: {
        isOpen: true,
        template,
        formValues,
        submissionMeta
      }
    });
  },

  closePdfPreview: () => {
    set((state) => ({
      pdfPreviewState: {
        ...state.pdfPreviewState,
        isOpen: false
      }
    }));
  },

  resetFormState: () => {
    set({
      activeTemplate: null,
      activeSubmission: null,
      formValues: {},
      activeFieldKey: null,
      aiChanges: [],
      autoSaveStatus: 'saved',
      pendingVoiceConfirmation: null,
      isReviewOpen: false,
      pdfPreviewState: {
        isOpen: false,
        template: null,
        formValues: {},
        submissionMeta: undefined
      }
    });
  }
}));
