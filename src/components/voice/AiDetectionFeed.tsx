import React from 'react';
import { useFormStore } from '../../store/useFormStore';
import { Sparkles, CheckCircle2, AlertTriangle, Terminal, Trash2 } from 'lucide-react';

export const AiDetectionFeed: React.FC = () => {
  const { aiChanges, clearAiChanges } = useFormStore();

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'confirmation':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="w-3 h-3" /> Confirmed
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300">
            <AlertTriangle className="w-3 h-3" /> Notice
          </span>
        );
      case 'command':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300">
            <Terminal className="w-3 h-3" /> Command
          </span>
        );
      case 'update':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300">
            <Sparkles className="w-3 h-3" /> Field Update
          </span>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            AI Detected Changes
          </h3>
        </div>
        {aiChanges.length > 0 && (
          <button
            onClick={clearAiChanges}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 transition-colors"
            title="Clear Feed"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 max-h-80">
        {aiChanges.length === 0 ? (
          <div className="py-8 text-center text-slate-400 dark:text-slate-500 text-xs">
            No changes detected yet. Speak to fill form fields.
          </div>
        ) : (
          aiChanges.map((change) => (
            <div
              key={change.id}
              className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-800/40 hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                {getTypeBadge(change.type)}
                <span className="text-[10px] text-slate-400 font-mono">
                  {change.timestamp}
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                {change.description}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
