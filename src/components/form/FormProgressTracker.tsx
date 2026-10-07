import React from 'react';
import { useFormStore } from '../../store/useFormStore';
import type { FormTemplate } from '../../types';
import { Check, Cloud, CloudOff, Loader2, Layers, ShieldCheck } from 'lucide-react';

interface FormProgressTrackerProps {
  template: FormTemplate;
  completionPercentage: number;
  sections?: string[];
  activeSectionIndex?: number;
  onSelectSection?: (index: number) => void;
  sectionStats?: Array<{ name: string; filled: number; total: number; percentage: number }>;
}

export const FormProgressTracker: React.FC<FormProgressTrackerProps> = ({
  template,
  completionPercentage,
  sections = [],
  activeSectionIndex = 0,
  onSelectSection,
  sectionStats = []
}) => {
  const { autoSaveStatus, lastAutoSavedAt, activeSubmission } = useFormStore();

  const getStatusBadge = () => {
    const status = activeSubmission?.status || 'draft';
    switch (status) {
      case 'completed':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
            <Check className="w-3 h-3" /> Completed
          </span>
        );
      case 'in_review':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
            In Review
          </span>
        );
      case 'draft':
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            Draft
          </span>
        );
    }
  };

  const sensitiveFieldsCount = template.fields.filter((f) => f.isSensitive).length;
  const currentSectionStat = sectionStats[activeSectionIndex];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              {template.category}
            </span>
            {getStatusBadge()}
            {sensitiveFieldsCount > 0 && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 flex items-center gap-1 border border-amber-200/50 dark:border-amber-900/30">
                <ShieldCheck className="w-3 h-3" /> {sensitiveFieldsCount} Sensitive Fields Encrypted
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 mt-1.5 tracking-tight">
            {template.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-2xl line-clamp-2 leading-relaxed">
            {template.description}
          </p>
        </div>

        {/* Auto Save Status Indicator */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 px-3.5 py-2 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
          {autoSaveStatus === 'saving' ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
              <span>Saving draft changes...</span>
            </>
          ) : autoSaveStatus === 'saved' ? (
            <>
              <Cloud className="w-3.5 h-3.5 text-emerald-500" />
              <span>Draft auto-saved {lastAutoSavedAt ? `at ${lastAutoSavedAt}` : 'to secure storage'}</span>
            </>
          ) : (
            <>
              <CloudOff className="w-3.5 h-3.5 text-amber-500" />
              <span>Unsaved draft edits</span>
            </>
          )}
        </div>
      </div>

      {/* Global Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="text-slate-600 dark:text-slate-300 font-bold">Overall Progress</span>
            <span className="text-slate-400 font-normal">({template.fields.length} Total Fields)</span>
          </div>
          <span className="text-indigo-600 dark:text-indigo-400 font-mono font-bold">
            {completionPercentage}% Complete
          </span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 transition-all duration-500 ease-out"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Section Progress Stepper Breakdown (For forms with multiple logical sections) */}
      {sections.length > 1 && (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              <span>
                Section {activeSectionIndex + 1} of {sections.length}:{' '}
                <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">
                  {sections[activeSectionIndex]}
                </span>
              </span>
            </div>
            {currentSectionStat && (
              <span className="text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                {currentSectionStat.filled} of {currentSectionStat.total} fields ({currentSectionStat.percentage}%)
              </span>
            )}
          </div>

          {/* Section Step Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {sections.map((sectionName, idx) => {
              const stat = sectionStats[idx];
              const isCurrent = idx === activeSectionIndex;
              const isComplete = stat ? stat.percentage === 100 : false;
              const hasStarted = stat ? stat.filled > 0 : false;

              return (
                <button
                  key={sectionName}
                  type="button"
                  onClick={() => onSelectSection?.(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isCurrent
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20 font-bold'
                      : isComplete
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40'
                      : hasStarted
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/40'
                      : 'bg-slate-100 dark:bg-slate-800/70 text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                    isCurrent ? 'bg-white/20 text-white' : isComplete ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    {isComplete ? <Check className="w-2.5 h-2.5" /> : idx + 1}
                  </span>
                  <span>{sectionName}</span>
                  {stat && (
                    <span className="text-[10px] opacity-75 font-mono">
                      ({stat.filled}/{stat.total})
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
