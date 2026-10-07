import React, { useState } from 'react';
import { useFormStore } from '../../store/useFormStore';
import { useVoiceStore } from '../../store/useVoiceStore';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import {
  X,
  Volume2,
  VolumeX,
  Download,
  CheckCircle2,
  Edit2,
  Save,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface ReviewDrawerProps {
  onSubmit: () => void;
  isValid: boolean;
  errors: Record<string, string>;
}

export const ReviewDrawer: React.FC<ReviewDrawerProps> = ({
  onSubmit,
  isValid,
  errors
}) => {
  const {
    activeTemplate,
    formValues,
    setFieldValue,
    isReviewOpen,
    setIsReviewOpen,
    activeSubmission,
    openPdfPreview
  } = useFormStore();

  const { language } = useVoiceStore();
  const { speak, cancel, isSpeaking } = useSpeechSynthesis();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  if (!isReviewOpen || !activeTemplate) return null;

  const handleReadAloud = () => {
    if (isSpeaking) {
      cancel();
      return;
    }

    const isHindi = language === 'hi-IN';

    // Build speech text from fields
    const sentences = activeTemplate.fields.map((f) => {
      const val = formValues[f.key];
      if (val === undefined || val === null || val === '') {
        return isHindi ? `${f.label} अभी खाली है।` : `${f.label} is currently empty.`;
      }
      if (typeof val === 'boolean') {
        return isHindi
          ? `${f.label} को ${val ? 'हाँ' : 'ना'} चुना गया है।`
          : `${f.label} is marked as ${val ? 'yes' : 'no'}.`;
      }
      return isHindi ? `${f.label} है: ${val}।` : `${f.label} is ${val}.`;
    });

    const fullSummary = isHindi
      ? `${activeTemplate.title} का समीक्षा विवरण: ` + sentences.join(' ')
      : `Here is your form review for ${activeTemplate.title}. ` + sentences.join(' ');

    speak(fullSummary, { language });
  };

  const startEdit = (key: string, currentVal: any) => {
    setEditingKey(key);
    setEditValue(String(currentVal || ''));
  };

  const saveEdit = (key: string) => {
    setFieldValue(key, editValue, { logAi: true, description: `Edited value for ${key} in review` });
    setEditingKey(null);
  };

  const handleDownloadPdf = () => {
    openPdfPreview(activeTemplate, formValues, activeSubmission || undefined);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => {
          cancel();
          setIsReviewOpen(false);
        }}
      />

      {/* Drawer Body */}
      <div className="relative z-10 w-full max-w-xl bg-white dark:bg-slate-900 shadow-2xl h-full flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Review Form Data
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Verify your information before final submission
            </p>
          </div>
          <button
            onClick={() => {
              cancel();
              setIsReviewOpen(false);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Read Aloud & PDF Download */}
        <div className="px-6 py-3 bg-slate-50/80 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReadAloud}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${
              isSpeaking
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60'
            }`}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-3.5 h-3.5" /> Stop Reading
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5" /> Read Form Aloud
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-200/70 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export PDF
          </button>
        </div>

        {/* Quick Summary Cards */}
        {(() => {
          const fields = Array.isArray(activeTemplate.fields) ? activeTemplate.fields : [];
          const total = fields.length;
          const filled = fields.filter((f) => {
            const v = formValues[f.key];
            return v !== undefined && v !== null && v !== '' && (typeof v !== 'string' || v.trim() !== '');
          }).length;
          const sensitive = fields.filter((f) => f.isSensitive).length;
          const pct = total > 0 ? Math.round((filled / total) * 100) : 100;

          return (
            <div className="mx-6 mt-3 grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                  Completed
                </span>
                <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                  {filled} / {total}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                  Progress
                </span>
                <span className={`text-sm font-extrabold ${pct === 100 ? 'text-emerald-600' : 'text-amber-500'}`}>
                  {pct}%
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                  Sensitive
                </span>
                <span className="text-sm font-extrabold text-rose-500">
                  {sensitive} PII
                </span>
              </div>
            </div>
          );
        })()}

        {/* Form Validation Notice */}
        {!isValid && Object.keys(errors).length > 0 && (
          <div className="mx-6 mt-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Required fields need attention</p>
              <p className="text-[11px] mt-0.5">
                {Object.keys(errors).length} field(s) have missing or invalid values. Complete them before submission.
              </p>
            </div>
          </div>
        )}

        {/* Fields List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {activeTemplate.fields.map((field) => {
            const rawVal = formValues[field.key];
            const hasError = errors[field.key];
            const isFieldEditing = editingKey === field.key;

            return (
              <div
                key={field.key}
                className={`p-3.5 rounded-xl border transition-all ${
                  hasError
                    ? 'border-rose-200 dark:border-rose-900/60 bg-rose-50/20'
                    : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-slate-200 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {field.label}
                    </span>
                    {field.isSensitive && (
                      <span title="Sensitive Field" className="inline-flex items-center">
                        <ShieldCheck className="w-3 h-3 text-amber-500" />
                      </span>
                    )}
                  </div>
                  {!isFieldEditing ? (
                    <button
                      type="button"
                      onClick={() => startEdit(field.key, rawVal)}
                      className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-1"
                      title="Edit field"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => saveEdit(field.key)}
                      className="text-emerald-600 hover:text-emerald-700 p-1"
                      title="Save field"
                    >
                      <Save className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {isFieldEditing ? (
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-indigo-400 dark:border-indigo-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => saveEdit(field.key)}
                      className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 break-words">
                    {rawVal !== undefined && rawVal !== null && rawVal !== '' ? (
                      typeof rawVal === 'boolean' ? (
                        rawVal ? 'Yes' : 'No'
                      ) : (
                        String(rawVal)
                      )
                    ) : (
                      <span className="text-xs italic text-slate-400">Not provided</span>
                    )}
                  </p>
                )}

                {hasError && (
                  <p className="text-[11px] font-semibold text-rose-500 mt-1">
                    {hasError}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              cancel();
              setIsReviewOpen(false);
            }}
            className="px-4 py-2.5 text-sm font-medium rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Back to Edit
          </button>
          <button
            type="button"
            onClick={() => {
              cancel();
              onSubmit();
            }}
            disabled={!isValid}
            className="px-6 py-2.5 text-sm font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Submit Form
          </button>
        </div>
      </div>
    </div>
  );
};
