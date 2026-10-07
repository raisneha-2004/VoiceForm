import React, { useRef } from 'react';
import type { FormField } from '../../types';
import { useFormStore } from '../../store/useFormStore';
import { useVoiceStore } from '../../store/useVoiceStore';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import {
  Mic,
  MicOff,
  ShieldCheck,
  HelpCircle,
  AlertCircle,
  UploadCloud,
  FileCheck,
  Target
} from 'lucide-react';

interface DynamicFieldRendererProps {
  field: FormField;
  error?: string;
  onFieldChange: (key: string, value: any) => void;
}

export const DynamicFieldRenderer: React.FC<DynamicFieldRendererProps> = ({
  field,
  error,
  onFieldChange
}) => {
  const { formValues, activeFieldKey, setActiveFieldKey } = useFormStore();
  const { isRecording } = useVoiceStore();
  const { startListening, stopListening } = useSpeechRecognition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const value = formValues[field.key] ?? '';
  const isActive = activeFieldKey === field.key;

  // Check conditional visibility
  if (field.conditional) {
    const dependentVal = formValues[field.conditional.dependsOnKey];
    if (field.conditional.condition === 'equals' && dependentVal !== field.conditional.value) {
      return null;
    }
    if (field.conditional.condition === 'notEquals' && dependentVal === field.conditional.value) {
      return null;
    }
  }

  const handleInlineSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Ensure this field is explicitly set as the active voice target
    setActiveFieldKey(field.key);

    if (isActive && isRecording) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleActivate = () => {
    setActiveFieldKey(field.key);
  };

  const baseInputStyles = `w-full px-3.5 py-2.5 rounded-xl text-sm transition-all duration-200 bg-white dark:bg-slate-900 border ${
    error
      ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/30'
      : isActive
      ? 'border-indigo-500 ring-2 ring-indigo-500/25 dark:ring-indigo-500/30'
      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
  } text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none`;

  const renderFieldInput = () => {
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            id={`field-${field.key}`}
            rows={3}
            value={value}
            onChange={(e) => onFieldChange(field.key, e.target.value)}
            onFocus={handleActivate}
            onClick={handleActivate}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
            className={baseInputStyles}
          />
        );

      case 'number':
        return (
          <input
            id={`field-${field.key}`}
            type="number"
            value={value}
            min={field.validation?.min}
            max={field.validation?.max}
            onChange={(e) => onFieldChange(field.key, e.target.value === '' ? '' : Number(e.target.value))}
            onFocus={handleActivate}
            onClick={handleActivate}
            placeholder={field.placeholder || '0'}
            className={baseInputStyles}
          />
        );

      case 'select':
        return (
          <select
            id={`field-${field.key}`}
            value={value}
            onChange={(e) => onFieldChange(field.key, e.target.value)}
            onFocus={handleActivate}
            onClick={handleActivate}
            className={`${baseInputStyles} cursor-pointer`}
          >
            <option value="">
              {field.placeholder || `-- Select ${field.label} --`}
            </option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-2 pt-1">
            {field.options?.map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  value === opt.value
                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-950 dark:text-indigo-200'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                }`}
                onClick={handleActivate}
              >
                <input
                  type="radio"
                  name={field.key}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={(e) => onFieldChange(field.key, e.target.value)}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <span className="text-sm font-medium">{opt.label}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <label
            className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
              value
                ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
            onClick={handleActivate}
          >
            <input
              type="checkbox"
              id={`field-${field.key}`}
              checked={Boolean(value)}
              onChange={(e) => onFieldChange(field.key, e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer mt-0.5"
            />
            <div className="text-sm">
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {field.label}
              </span>
              {field.helpText && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {field.helpText}
                </p>
              )}
            </div>
          </label>
        );

      case 'file':
        return (
          <div
            onClick={() => {
              handleActivate();
              fileInputRef.current?.click();
            }}
            className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
              value
                ? 'border-emerald-500/50 bg-emerald-50/30 dark:bg-emerald-950/20'
                : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 bg-slate-50/50 dark:bg-slate-900/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onFieldChange(field.key, file.name);
                }
              }}
            />
            {value ? (
              <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
                <FileCheck className="w-5 h-5" />
                <span className="text-sm font-semibold">{value}</span>
                <span className="text-xs text-slate-400 underline ml-2">Replace</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5">
                <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-indigo-500" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Click to upload document or resume
                </span>
                <span className="text-[11px] text-slate-400">PDF, DOC, PNG up to 10MB</span>
              </div>
            )}
          </div>
        );

      case 'date':
        return (
          <input
            id={`field-${field.key}`}
            type="date"
            value={value}
            onChange={(e) => onFieldChange(field.key, e.target.value)}
            onFocus={handleActivate}
            onClick={handleActivate}
            className={baseInputStyles}
          />
        );

      case 'email':
        return (
          <input
            id={`field-${field.key}`}
            type="email"
            value={value}
            onChange={(e) => onFieldChange(field.key, e.target.value)}
            onFocus={handleActivate}
            onClick={handleActivate}
            placeholder={field.placeholder || 'e.g. name@domain.com'}
            className={baseInputStyles}
          />
        );

      case 'phone':
        return (
          <input
            id={`field-${field.key}`}
            type="tel"
            value={value}
            onChange={(e) => onFieldChange(field.key, e.target.value)}
            onFocus={handleActivate}
            onClick={handleActivate}
            placeholder={field.placeholder || '+91 98765 43210'}
            className={baseInputStyles}
          />
        );

      case 'text':
      default:
        return (
          <input
            id={`field-${field.key}`}
            type="text"
            value={value}
            onChange={(e) => onFieldChange(field.key, e.target.value)}
            onFocus={handleActivate}
            onClick={handleActivate}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
            className={baseInputStyles}
          />
        );
    }
  };

  return (
    <div
      onClick={handleActivate}
      className={`relative p-4 rounded-2xl transition-all duration-200 cursor-pointer ${
        isActive
          ? 'bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-500/50 shadow-sm'
          : 'bg-transparent hover:bg-slate-50/60 dark:hover:bg-slate-900/30 border border-transparent'
      }`}
    >
      {/* Label and Actions */}
      {field.type !== 'checkbox' && (
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <label
            htmlFor={`field-${field.key}`}
            onClick={handleActivate}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            <span>{field.label}</span>
            {field.required && <span className="text-rose-500 font-bold">*</span>}
            {field.isSensitive && (
              <span
                className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded"
                title="Sensitive field - requires voice confirmation"
              >
                <ShieldCheck className="w-3 h-3" /> Sensitive
              </span>
            )}
            {isActive && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/50 px-1.5 py-0.2 rounded-full">
                <Target className="w-2.5 h-2.5" /> Active
              </span>
            )}
          </label>

          {/* Inline Speak Button */}
          <button
            type="button"
            onClick={handleInlineSpeak}
            className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
              isActive && isRecording
                ? 'bg-rose-500 text-white shadow-xs animate-pulse'
                : isActive
                ? 'text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs'
                : 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60'
            }`}
            title={`Speak to fill ${field.label}`}
          >
            {isActive && isRecording ? (
              <>
                <MicOff className="w-3 h-3" />
                <span>Listening</span>
              </>
            ) : (
              <>
                <Mic className="w-3 h-3" />
                <span>Speak</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Input Element */}
      {renderFieldInput()}

      {/* Help text */}
      {field.helpText && field.type !== 'checkbox' && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
          <HelpCircle className="w-3 h-3 shrink-0" />
          <span>{field.helpText}</span>
        </p>
      )}

      {/* Validation Error */}
      {error && (
        <p className="text-xs font-semibold text-rose-500 mt-1.5 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};
