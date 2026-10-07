import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useFormStore } from '../../store/useFormStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import { templateService, submissionService } from '../../api/client';
import type { FormSubmission, FormField } from '../../types';
import { validateFormValues } from '../../components/form/ZodSchemaBuilder';
import { DynamicFieldRenderer } from '../../components/form/DynamicFieldRenderer';
import { FormProgressTracker } from '../../components/form/FormProgressTracker';
import { VoiceMicPanel } from '../../components/voice/VoiceMicPanel';
import { AiDetectionFeed } from '../../components/voice/AiDetectionFeed';
import { ReviewDrawer } from '../../components/form/ReviewDrawer';
import confetti from 'canvas-confetti';
import {
  Save,
  CheckCircle2,
  RotateCcw,
  Download,
  Eye,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  Layers,
  ListFilter,
  BookmarkCheck
} from 'lucide-react';

export const FormWorkspacePage: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const [searchParams] = useSearchParams();
  const subId = searchParams.get('subId');
  const navigate = useNavigate();

  const { user } = useAuthStore();
  const { addToast } = useThemeStore();
  const {
    activeTemplate,
    activeSubmission,
    formValues,
    setActiveTemplate,
    setActiveSubmission,
    setFieldValue,
    setAutoSaveStatus,
    setIsReviewOpen,
    openPdfPreview
  } = useFormStore();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [activeSectionIndex, setActiveSectionIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'section' | 'all'>('section');
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load Template and existing submission if provided
  useEffect(() => {
    async function loadWorkspace() {
      if (!templateId) return;
      try {
        setIsLoading(true);
        const template = await templateService.getById(templateId);
        if (!template) {
          addToast({ type: 'error', title: 'Error', message: 'Template not found' });
          navigate('/templates');
          return;
        }

        let initialValues: Record<string, any> = {};
        let submission: FormSubmission | null = null;

        if (subId) {
          submission = await submissionService.getById(subId);
          if (submission) {
            initialValues = submission.data;
            addToast({
              type: 'info',
              title: 'Draft Resumed',
              message: `Loaded previously saved draft (${submission.completionPercentage || 0}% completed)`
            });
          }
        }

        setActiveTemplate(template, initialValues);
        if (submission) {
          setActiveSubmission(submission);
        }
      } catch (err) {
        console.error('Error loading workspace', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadWorkspace();
  }, [templateId, subId]);

  // Real-time Zod validation check whenever form values change
  useEffect(() => {
    if (!activeTemplate) return;
    const { errors } = validateFormValues(activeTemplate, formValues);
    setValidationErrors(errors);
  }, [activeTemplate, formValues]);

  // Debounced auto-save
  useEffect(() => {
    if (!activeTemplate || Object.keys(formValues).length === 0) return;

    setAutoSaveStatus('saving');

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(async () => {
      try {
        const savedSub = await submissionService.save({
          id: activeSubmission?.id,
          templateId: activeTemplate.id,
          templateTitle: activeTemplate.title,
          userId: user?.id || 'user-sneha-1',
          data: formValues,
          status: activeSubmission?.status === 'completed' ? 'completed' : 'draft',
          completionPercentage: calculateCompletionPercentage()
        });
        setActiveSubmission(savedSub);
        setAutoSaveStatus('saved');
      } catch (e) {
        console.error('Auto-save error', e);
        setAutoSaveStatus('unsaved');
      }
    }, 1800);

    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [formValues]);

  // Extract unique logical sections
  const sections: string[] = useMemo(() => {
    if (!activeTemplate) return [];
    const set = new Set<string>();
    activeTemplate.fields.forEach((f) => {
      set.add(f.section || 'General Details');
    });
    return Array.from(set);
  }, [activeTemplate]);

  // Per-section statistics
  const sectionStats = useMemo(() => {
    if (!activeTemplate || sections.length === 0) return [];
    return sections.map((sec) => {
      const secFields = activeTemplate.fields.filter(
        (f) => (f.section || 'General Details') === sec
      );
      const total = secFields.length;
      let filled = 0;
      secFields.forEach((f) => {
        const val = formValues[f.key];
        if (val !== '' && val !== null && val !== undefined && val !== false) {
          filled++;
        }
      });
      const percentage = total > 0 ? Math.round((filled / total) * 100) : 0;
      return { name: sec, filled, total, percentage };
    });
  }, [activeTemplate, sections, formValues]);

  const handleFieldChange = (key: string, value: any) => {
    setFieldValue(key, value);
  };

  const calculateCompletionPercentage = (): number => {
    if (!activeTemplate) return 0;
    const totalFields = activeTemplate.fields.length;
    if (totalFields === 0) return 0;

    let filled = 0;
    activeTemplate.fields.forEach((f) => {
      const val = formValues[f.key];
      if (val !== '' && val !== null && val !== undefined && val !== false) {
        filled++;
      }
    });

    return Math.min(100, Math.round((filled / totalFields) * 100));
  };

  const handleManualSaveDraft = async () => {
    if (!activeTemplate) return;
    try {
      setAutoSaveStatus('saving');
      const savedSub = await submissionService.save({
        id: activeSubmission?.id,
        templateId: activeTemplate.id,
        templateTitle: activeTemplate.title,
        userId: user?.id || 'user-sneha-1',
        data: formValues,
        status: 'draft',
        completionPercentage: calculateCompletionPercentage()
      });
      setActiveSubmission(savedSub);
      setAutoSaveStatus('saved');
      addToast({
        type: 'success',
        title: 'Draft Saved Securely',
        message: `Saved at ${new Date().toLocaleTimeString()}. You can safely close or resume anytime.`
      });
    } catch (e) {
      addToast({ type: 'error', title: 'Save Failed', message: 'Could not save draft.' });
    }
  };

  const handleSubmitForm = async () => {
    if (!activeTemplate) return;

    // Validate using dynamic Zod schema
    const { isValid, errors } = validateFormValues(activeTemplate, formValues);
    if (!isValid) {
      setValidationErrors(errors);
      addToast({
        type: 'error',
        title: 'Validation Failed',
        message: `Please complete all required fields (${Object.keys(errors).length} errors found)`
      });
      return;
    }

    try {
      const savedSub = await submissionService.save({
        id: activeSubmission?.id,
        templateId: activeTemplate.id,
        templateTitle: activeTemplate.title,
        userId: user?.id,
        data: formValues,
        status: 'completed',
        completionPercentage: 100
      });
      setActiveSubmission(savedSub);
      setIsReviewOpen(false);

      // Trigger celebratory confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      addToast({
        type: 'success',
        title: 'Form Submitted Successfully!',
        message: 'All validations passed. You can now download your official PDF.'
      });
    } catch (e) {
      addToast({ type: 'error', title: 'Submission Error', message: 'Failed to submit form.' });
    }
  };

  const handleResetForm = () => {
    if (!activeTemplate) return;
    if (confirm('Are you sure you want to reset all field values?')) {
      const cleared: Record<string, any> = {};
      activeTemplate.fields.forEach((f) => {
        cleared[f.key] = f.type === 'checkbox' ? false : '';
      });
      setActiveTemplate(activeTemplate, cleared);
      addToast({ type: 'info', title: 'Form Reset', message: 'All inputs have been cleared.' });
    }
  };

  const handleExportPdf = () => {
    if (!activeTemplate) return;
    openPdfPreview(activeTemplate, formValues, activeSubmission || undefined);
  };

  if (isLoading || !activeTemplate) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-12 text-center text-slate-500 dark:text-slate-400 space-y-3">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold">Loading Form Workspace...</p>
      </div>
    );
  }

  const completionPct = calculateCompletionPercentage();
  const isFormValid = Object.keys(validationErrors).length === 0;

  // Fields to render based on viewMode
  const activeSectionName = sections[activeSectionIndex] || 'General Details';
  const displayedFields: FormField[] =
    viewMode === 'section' && sections.length > 1
      ? activeTemplate.fields.filter((f) => (f.section || 'General Details') === activeSectionName)
      : activeTemplate.fields;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate('/templates')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Templates</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Toggle (Section View vs All Fields) */}
          {sections.length > 1 && (
            <div className="bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl flex items-center text-xs font-semibold">
              <button
                type="button"
                onClick={() => setViewMode('section')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  viewMode === 'section'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Section Stepper</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('all')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  viewMode === 'all'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <ListFilter className="w-3.5 h-3.5" />
                <span>All {activeTemplate.fields.length} Fields</span>
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={handleResetForm}
            className="px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleManualSaveDraft}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            title="Save draft progress to resume anytime"
          >
            <Save className="w-3.5 h-3.5 text-indigo-500" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={handleExportPdf}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-indigo-500" />
            <span>Export PDF</span>
          </button>

          <button
            type="button"
            onClick={() => setIsReviewOpen(true)}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/25 transition-all flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Review & Listen</span>
          </button>

          <button
            type="button"
            onClick={handleSubmitForm}
            disabled={!isFormValid}
            className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Submit Form</span>
          </button>
        </div>
      </div>

      {/* Progress & Header Tracker with Section Pills */}
      <FormProgressTracker
        template={activeTemplate}
        completionPercentage={completionPct}
        sections={sections}
        activeSectionIndex={activeSectionIndex}
        onSelectSection={(idx) => setActiveSectionIndex(idx)}
        sectionStats={sectionStats}
      />

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Dynamic Schema Form Fields (8 Cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-5">
          {/* Section Banner Header */}
          <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center">
                  {sections.length > 1 && viewMode === 'section' ? activeSectionIndex + 1 : '✓'}
                </span>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {viewMode === 'section' && sections.length > 1
                    ? activeSectionName
                    : 'All Form Inputs'}
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {viewMode === 'section' && sections.length > 1
                  ? `Showing ${displayedFields.length} fields in this section • Section ${activeSectionIndex + 1} of ${sections.length}`
                  : `Showing all ${displayedFields.length} fields in single view`}
              </p>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> Required
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> Sensitive
              </span>
            </div>
          </div>

          {/* Form Fields Renderer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmitForm();
            }}
            className="space-y-4"
          >
            {displayedFields.map((field) => (
              <DynamicFieldRenderer
                key={field.id || field.key}
                field={field}
                error={validationErrors[field.key]}
                onFieldChange={handleFieldChange}
              />
            ))}
          </form>

          {/* Section-to-Section Stepper Controls (When in Section Mode) */}
          {sections.length > 1 && viewMode === 'section' && (
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  if (activeSectionIndex > 0) {
                    setActiveSectionIndex((prev) => prev - 1);
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                  }
                }}
                disabled={activeSectionIndex === 0}
                className="px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Section</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleManualSaveDraft}
                  className="px-3.5 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <BookmarkCheck className="w-4 h-4 text-indigo-500" />
                  <span>Save Draft</span>
                </button>

                {activeSectionIndex < sections.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSectionIndex((prev) => prev + 1);
                      window.scrollTo({ top: 120, behavior: 'smooth' });
                    }}
                    className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-500/25 transition-all flex items-center gap-2"
                  >
                    <span>Next: {sections[activeSectionIndex + 1]}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitForm}
                    disabled={!isFormValid}
                    className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-500/25 disabled:opacity-50 transition-all flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Final Submit Form</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Form Bottom Action (All Fields Mode) */}
          {(sections.length <= 1 || viewMode === 'all') && (
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                {!isFormValid ? (
                  <span className="text-rose-500 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Please resolve {Object.keys(validationErrors).length} required field error(s)
                  </span>
                ) : (
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    All fields valid and ready for submission
                  </span>
                )}
              </span>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsReviewOpen(true)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200"
                >
                  Review Form
                </button>
                <button
                  type="button"
                  onClick={handleSubmitForm}
                  disabled={!isFormValid}
                  className="px-6 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/25 disabled:opacity-50"
                >
                  Submit Now
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Voice Engine Panel & AI Detected Changes (4 Cols) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
          {/* Persistent Large Microphone Panel */}
          <VoiceMicPanel onSubmitForm={handleSubmitForm} />

          {/* AI Detected Changes Log */}
          <AiDetectionFeed />
        </div>
      </div>

      {/* Review Drawer Modal with Text-to-Speech */}
      <ReviewDrawer
        onSubmit={handleSubmitForm}
        isValid={isFormValid}
        errors={validationErrors}
      />
    </div>
  );
};
