import React, { useState, useEffect } from 'react';
import { useFormStore } from '../../store/useFormStore';
import { useThemeStore } from '../../store/useThemeStore';
import { generatePdfBlobUrl, exportFormToPdf } from '../../utils/pdfExporter';
import {
  FileText,
  Download,
  X,
  ArrowLeft,
  Eye,
  LayoutTemplate,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Printer,
  Sparkles
} from 'lucide-react';

export const PdfPreviewModal: React.FC = () => {
  const { pdfPreviewState, closePdfPreview } = useFormStore();
  const { addToast } = useThemeStore();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pdf' | 'visual'>('pdf');
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const { isOpen, template, formValues, submissionMeta } = pdfPreviewState;

  useEffect(() => {
    if (!isOpen || !template) {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
        setBlobUrl(null);
      }
      setIsLoading(true);
      return;
    }

    setIsLoading(true);

    // Asynchronously generate PDF so the loading skeleton appears smoothly
    const timer = setTimeout(() => {
      try {
        const url = generatePdfBlobUrl(template, formValues, submissionMeta);
        setBlobUrl(url);
      } catch (err) {
        console.error('Error creating PDF preview blob:', err);
        addToast({
          type: 'error',
          title: 'Preview Generation Issue',
          message: 'Falling back to visual preview mode.'
        });
        setActiveTab('visual');
      } finally {
        setIsLoading(false);
      }
    }, 280);

    return () => {
      clearTimeout(timer);
    };
  }, [isOpen, template, formValues, submissionMeta]);

  if (!isOpen || !template) return null;

  const safeFields = Array.isArray(template.fields) ? template.fields : [];
  const totalFields = safeFields.length;
  let filledCount = 0;
  let sensitiveCount = 0;

  safeFields.forEach((field) => {
    if (field.isSensitive) sensitiveCount++;
    const val = formValues[field.key];
    if (val !== undefined && val !== null && val !== '') {
      if (typeof val === 'boolean' || String(val).trim() !== '') {
        filledCount++;
      }
    }
  });

  const completionPercent = totalFields > 0 ? Math.round((filledCount / totalFields) * 100) : 100;
  const subId = submissionMeta?.id || 'SUB-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  const dateStr = submissionMeta?.lastUpdated
    ? new Date(submissionMeta.lastUpdated).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    : new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });

  const handleDownload = () => {
    setIsDownloading(true);
    try {
      exportFormToPdf(template, formValues, submissionMeta);
      addToast({
        type: 'success',
        title: 'PDF Downloaded',
        message: `Saved "${template.title}" report successfully.`
      });
      setTimeout(() => {
        setIsDownloading(false);
        closePdfPreview();
      }, 600);
    } catch (err) {
      console.error('Download error:', err);
      setIsDownloading(false);
      addToast({
        type: 'error',
        title: 'Download Failed',
        message: 'Could not generate final PDF file.'
      });
    }
  };

  const handlePrint = () => {
    if (blobUrl) {
      const printWindow = window.open(blobUrl, '_blank');
      printWindow?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity"
        onClick={closePdfPreview}
      />

      {/* Modal Dialog Body */}
      <div className="relative z-10 w-full max-w-5xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 bg-gradient-to-r from-slate-50 to-indigo-50/40 dark:from-slate-900 dark:to-indigo-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                  PDF Export Preview
                </h2>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-500" /> Live Preview
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Download karne se pehle poore document ka preview dekhein — values check karein
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center bg-slate-200/70 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('pdf')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'pdf'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>PDF Document</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('visual')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'visual'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <LayoutTemplate className="w-3.5 h-3.5" />
                <span>Visual Sheet</span>
              </button>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={closePdfPreview}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Stats Banner */}
        <div className="px-5 py-2.5 bg-slate-100/60 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {template.title}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500 font-mono text-[11px]">ID: {subId}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" /> {dateStr}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 font-semibold text-[11px] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> {filledCount}/{totalFields} Filled ({completionPercent}%)
            </span>
            {sensitiveCount > 0 && (
              <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/60 font-semibold text-[11px] flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" /> {sensitiveCount} Sensitive
              </span>
            )}
          </div>
        </div>

        {/* Modal Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-950/30">
          {isLoading ? (
            /* Loading Skeleton / Spinner */
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4 text-center">
              <div className="relative">
                <div className="w-14 h-14 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 dark:border-t-indigo-500 rounded-full animate-spin" />
                <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Generating High-Resolution PDF Preview...
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Styling tables, gradient header, and confidentiality badges
                </p>
              </div>

              {/* Skeleton Mockup */}
              <div className="w-full max-w-lg mt-6 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 opacity-60">
                <div className="h-6 w-full rounded-lg bg-indigo-200/60 dark:bg-indigo-900/40 animate-pulse" />
                <div className="grid grid-cols-4 gap-2">
                  <div className="h-10 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
                  <div className="h-10 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
                  <div className="h-10 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
                  <div className="h-10 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
                </div>
                <div className="space-y-2 pt-2">
                  <div className="h-4 w-full rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
                  <div className="h-4 w-5/6 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
                  <div className="h-4 w-4/6 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
                </div>
              </div>
            </div>
          ) : activeTab === 'pdf' && blobUrl ? (
            /* Native Browser PDF Rendering in iframe */
            <div className="w-full h-[64vh] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md bg-white">
              <iframe
                src={`${blobUrl}#toolbar=0&navpanes=0`}
                title="PDF Document Preview"
                className="w-full h-full border-0"
              />
            </div>
          ) : (
            /* Visual Styled Sheet Layout Preview (Exact match of PDF layout) */
            <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100">
              {/* PDF Gradient Header */}
              <div className="bg-gradient-to-r from-indigo-700 via-violet-600 to-purple-600 p-6 text-white relative overflow-hidden">
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-white text-indigo-600 flex items-center justify-center font-black text-xl shadow-lg">
                      VF
                    </div>
                    <div>
                      <h3 className="text-xl font-bold tracking-tight">VoiceForm</h3>
                      <p className="text-xs text-indigo-100">
                        Intelligent Voice & Multilingual Form Data Report
                      </p>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider border border-white/30">
                    Official Submission
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Document Title & Description */}
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {template.title}
                  </h1>
                  {template.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {template.description}
                    </p>
                  )}
                </div>

                {/* Metadata 4-Grid Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Submission ID
                    </span>
                    <p className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5 truncate">
                      {subId}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Export Date
                    </span>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                      {dateStr}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Status
                    </span>
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      COMPLETED
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Classification
                    </span>
                    <p className="text-xs font-bold text-rose-600 dark:text-rose-400 mt-0.5">
                      {sensitiveCount > 0 ? 'RESTRICTED / PII' : 'STANDARD'}
                    </p>
                  </div>
                </div>

                {/* Filled Values Data Table */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-indigo-700 text-white font-bold">
                        <th className="py-2.5 px-3 w-10 text-center">#</th>
                        <th className="py-2.5 px-4">Field Name</th>
                        <th className="py-2.5 px-4">Recorded Value</th>
                        <th className="py-2.5 px-4 w-28 text-center">Type</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {safeFields.map((field, idx) => {
                        const rawVal = formValues[field.key];
                        let displayVal = '— Not Provided —';
                        const isProvided = rawVal !== undefined && rawVal !== null && rawVal !== '';

                        if (isProvided) {
                          if (typeof rawVal === 'boolean') {
                            displayVal = rawVal ? 'Yes (Confirmed)' : 'No';
                          } else if (field.options && field.type === 'select') {
                            const match = field.options.find((o) => o.value === rawVal);
                            displayVal = match ? match.label : String(rawVal);
                          } else if (Array.isArray(rawVal)) {
                            displayVal = rawVal.join(', ');
                          } else {
                            displayVal = String(rawVal);
                          }
                        }

                        return (
                          <tr
                            key={field.key}
                            className={idx % 2 === 1 ? 'bg-slate-50/60 dark:bg-slate-800/30' : ''}
                          >
                            <td className="py-2.5 px-3 text-center text-slate-400 font-mono">
                              {idx + 1}
                            </td>
                            <td className="py-2.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                              {field.label}
                            </td>
                            <td className="py-2.5 px-4">
                              <span
                                className={`font-medium ${
                                  isProvided
                                    ? 'text-indigo-600 dark:text-indigo-400 font-mono'
                                    : 'text-slate-400 italic'
                                }`}
                              >
                                {displayVal}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 text-center">
                              {field.isSensitive ? (
                                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200">
                                  Sensitive
                                </span>
                              ) : (
                                <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                  Standard
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Confidentiality Notice */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p>
                    <strong>Confidentiality Notice:</strong> This document contains verified form data
                    processed by VoiceForm AI. Verified under standard data privacy principles.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions Footer */}
        <div className="px-5 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={closePdfPreview}
            className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Edit karo / Wapas Jao</span>
          </button>

          <div className="flex items-center gap-2.5">
            {blobUrl && (
              <button
                type="button"
                onClick={handlePrint}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleDownload}
              disabled={isLoading || isDownloading}
              className="px-5 py-2.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              {isDownloading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
