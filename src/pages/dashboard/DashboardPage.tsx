import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useFormStore } from '../../store/useFormStore';
import { useThemeStore } from '../../store/useThemeStore';
import { useTranslation } from '../../utils/translations';
import { templateService, submissionService } from '../../api/client';
import type { FormSubmission, FormTemplate } from '../../types';
import {
  FileText,
  CheckCircle2,
  Clock,
  Mic,
  Plus,
  ArrowRight,
  Sparkles,
  Download,
  Trash2,
  ChevronRight,
  TrendingUp,
  FolderOpen,
  Shield
} from 'lucide-react';

// Lightweight count-up number hook for smooth animated stats
function useCountUp(target: number, duration: number = 800) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const stepTime = 20;
    const totalSteps = duration / stepTime;
    const stepIncrement = target / totalSteps;

    if (target === 0) {
      setCount(0);
      return;
    }

    const timer = setInterval(() => {
      start += stepIncrement;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [target, duration]);

  return count;
}

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { setActiveTemplate, setActiveSubmission, openPdfPreview } = useFormStore();
  const { addToast } = useThemeStore();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [templates, setTemplates] = useState<FormTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [subs, tpls] = await Promise.all([
        submissionService.getAll(user?.id),
        templateService.getAll()
      ]);
      setSubmissions(subs);
      setTemplates(tpls);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenForm = async (sub: FormSubmission) => {
    const tpl = templates.find((t) => t.id === sub.templateId) || templates[0];
    if (tpl) {
      setActiveTemplate(tpl, sub.data);
      setActiveSubmission(sub);
      navigate(`/workspace/${tpl.id}?subId=${sub.id}`);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this form submission?')) {
      await submissionService.delete(id);
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      addToast({
        type: 'info',
        title: 'Form Deleted',
        message: 'The form submission has been removed.'
      });
    }
  };

  const handleExportPdf = (sub: FormSubmission, e: React.MouseEvent) => {
    e.stopPropagation();
    const tpl = templates.find((t) => t.id === sub.templateId);
    if (tpl) {
      openPdfPreview(tpl, sub.data, sub);
    }
  };

  const safeSubmissions = Array.isArray(submissions) ? submissions : [];
  const safeTemplates = Array.isArray(templates) ? templates : [];

  const totalForms = safeSubmissions.length;
  const completedForms = safeSubmissions.filter((s) => s.status === 'completed').length;
  const draftForms = safeSubmissions.filter((s) => s.status === 'draft').length;
  const voiceCommandsCount = 42; // Estimated metrics

  // Animated Count-up values
  const animatedTotal = useCountUp(totalForms);
  const animatedCompleted = useCountUp(completedForms);
  const animatedDrafts = useCountUp(draftForms);
  const animatedVoice = useCountUp(voiceCommandsCount);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Upgraded Dynamic Welcome Banner */}
      <div className="rounded-[32px] p-1 bg-gradient-to-r from-indigo-500/30 via-purple-500/40 to-pink-500/30 shadow-2xl relative overflow-hidden">
        <div className="rounded-[28px] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 relative overflow-hidden border border-white/10 backdrop-blur-xl flex flex-wrap items-center justify-between gap-6">
          {/* Background Ambient Glowing Orbs */}
          <div className="w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl absolute -top-16 -left-16 animate-pulse-soft pointer-events-none" />
          <div className="w-80 h-80 bg-purple-500/20 rounded-full blur-3xl absolute -bottom-20 -right-20 animate-pulse-soft pointer-events-none" style={{ animationDelay: '2s' }} />

          {/* Background Dot Texture Overlay */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          />

          {/* Background Soundwave Vector Graphic */}
          <svg
            className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-36 opacity-20 stroke-indigo-400 pointer-events-none hidden md:block"
            viewBox="0 0 600 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 60 Q 75 10 150 60 T 300 60 T 450 60 T 600 60"
              strokeWidth="2.5"
              strokeDasharray="6 6"
            />
            <path
              d="M0 60 Q 100 110 200 60 T 400 60 T 600 60"
              strokeWidth="1.5"
              strokeOpacity="0.8"
            />
          </svg>

          {/* Left Side: Avatar with Concentric Pulse Rings & Dynamic Greeting */}
          <div className="relative z-10 flex items-center gap-5">
            {/* Avatar Container with Animated Voice Pulse Rings */}
            <Link to="/settings" title="Profile & Avatar Settings" className="relative group shrink-0">
              {/* Concentric Pulse Rings */}
              <span className="absolute -inset-2 rounded-2xl bg-indigo-500/20 animate-ping opacity-60 pointer-events-none" />
              <span className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 opacity-40 blur-xs group-hover:opacity-100 transition-opacity" />

              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || 'User')}`}
                alt={user?.name}
                className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-white/30 group-hover:ring-indigo-400 transition-all shadow-xl"
              />

              {/* Edit Micro-Badge */}
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-indigo-600 group-hover:bg-indigo-500 text-white flex items-center justify-center text-[11px] shadow-lg ring-2 ring-slate-900 transition-all">
                ✎
              </span>
            </Link>

            {/* Greeting & Details */}
            <div className="space-y-2 max-w-xl">
              {/* Active Voice Radar Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-indigo-200 text-xs font-semibold shadow-inner">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>{t('dashVoiceActive')}</span>
              </div>

              {/* Dynamic Greeting */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                {getGreeting()},{' '}
                <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                  {user?.name || 'Sneha'}!
                </span>
              </h1>

              {/* Subtext */}
              <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed font-normal">
                {t('dashSubtitle')}
              </p>

              {/* Mini Stats Info Strip */}
              <div className="pt-1 flex flex-wrap items-center gap-3 text-[11px] text-indigo-200/80 font-medium">
                <span className="flex items-center gap-1 bg-white/5 px-2.5 py-0.5 rounded-lg border border-white/10">
                  <Clock className="w-3 h-3 text-amber-300" />
                  <span>{draftForms} Draft{draftForms !== 1 ? 's' : ''} in Progress</span>
                </span>
                <span className="flex items-center gap-1 bg-white/5 px-2.5 py-0.5 rounded-lg border border-white/10">
                  <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                  <span>{completedForms} Completed Form{completedForms !== 1 ? 's' : ''}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right Side Action Buttons */}
          <div className="relative z-10 flex flex-wrap items-center gap-3">
            {/* Start New Form Button with Rotating Plus Icon */}
            <Link
              to="/templates"
              className="group px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xl shadow-indigo-600/35 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4 group-hover:rotate-90 group-hover:scale-110 transition-transform duration-300" />
              <span>{t('dashStartNew')}</span>
            </Link>

            {/* Voice Wizard Button with Pulsing Mic Icon */}
            <Link
              to="/conversational"
              className="group px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 backdrop-blur-md shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <div className="relative">
                <Mic className="w-4 h-4 text-purple-300 group-hover:text-purple-200 group-hover:scale-110 transition-transform" />
                <span className="absolute -inset-1 bg-purple-400/30 rounded-full animate-ping opacity-75 group-hover:opacity-100" />
              </div>
              <span>{t('dashVoiceWizard')}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* UPGRADED PREMIUM METRIC KPI STATS CARDS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Forms (Indigo Accent) */}
        <div className="group relative p-5 rounded-3xl bg-gradient-to-b from-indigo-500/10 via-indigo-500/5 to-white dark:to-slate-900 border border-indigo-200/80 dark:border-indigo-900/60 shadow-xs hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between">
          {/* Subtle Dot Grid Background */}
          <div
            className="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.5) 1px, transparent 1px)',
              backgroundSize: '16px 16px'
            }}
          />

          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                {t('dashTotalForms')}
              </span>
              <div className="w-10 h-10 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <FileText className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-2.5">
              <span className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
                {animatedTotal}
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +2 this week
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Active across all form categories
            </p>
          </div>

          {/* Bottom Accent Trend Line */}
          <div className="mt-4 pt-2">
            <div className="w-full h-1 rounded-full bg-indigo-100 dark:bg-indigo-950 overflow-hidden">
              <div className="w-3/4 h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full" />
            </div>
          </div>
        </div>

        {/* Card 2: Completed Forms (Emerald Accent) */}
        <div className="group relative p-5 rounded-3xl bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-white dark:to-slate-900 border border-emerald-200/80 dark:border-emerald-900/60 shadow-xs hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between">
          <div
            className="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(16,185,129,0.5) 1px, transparent 1px)',
              backgroundSize: '16px 16px'
            }}
          />

          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                {t('dashCompleted')}
              </span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-2.5">
              <span className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
                {animatedCompleted}
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                {totalForms > 0 ? `${Math.round((completedForms / totalForms) * 100)}% Rate` : '0%'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Validated, approved & exported
            </p>
          </div>

          <div className="mt-4 pt-2">
            <div className="w-full h-1 rounded-full bg-emerald-100 dark:bg-emerald-950 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                style={{ width: `${totalForms > 0 ? Math.round((completedForms / totalForms) * 100) : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Active Drafts (Amber Accent) */}
        <div className="group relative p-5 rounded-3xl bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-white dark:to-slate-900 border border-amber-200/80 dark:border-amber-900/60 shadow-xs hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between">
          <div
            className="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(245,158,11,0.5) 1px, transparent 1px)',
              backgroundSize: '16px 16px'
            }}
          />

          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
                {t('dashActiveDrafts')}
              </span>
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-2.5">
              <span className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
                {animatedDrafts}
              </span>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Auto-saved
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Ready for one-click voice resume
            </p>
          </div>

          <div className="mt-4 pt-2">
            <div className="w-full h-1 rounded-full bg-amber-100 dark:bg-amber-950 overflow-hidden">
              <div className="w-1/2 h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" />
            </div>
          </div>
        </div>

        {/* Card 4: Voice Inputs (Purple Accent) */}
        <div className="group relative p-5 rounded-3xl bg-gradient-to-b from-purple-500/10 via-purple-500/5 to-white dark:to-slate-900 border border-purple-200/80 dark:border-purple-900/60 shadow-xs hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between">
          <div
            className="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(168,85,247,0.5) 1px, transparent 1px)',
              backgroundSize: '16px 16px'
            }}
          />

          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                {t('dashVoiceInputs')}
              </span>
              <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Mic className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-2.5">
              <span className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
                {animatedVoice}
              </span>
              <span className="text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                3 Languages
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              English, हिन्दी & Hinglish parsed
            </p>
          </div>

          <div className="mt-4 pt-2">
            <div className="w-full h-1 rounded-full bg-purple-100 dark:bg-purple-950 overflow-hidden">
              <div className="w-4/5 h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* UPGRADED RECENT FORMS CARDS */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              {t('dashRecentForms')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('dashRecentSubtitle')}
            </p>
          </div>
          <Link
            to="/my-forms"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline flex items-center gap-1.5 transition-colors"
          >
            <span>{t('dashViewAll')} ({safeSubmissions.length})</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading submissions...</div>
        ) : safeSubmissions.length === 0 ? (
          /* Empty State */
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-md shadow-indigo-500/10">
              <FolderOpen className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              No forms created yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Choose a starter template from our library to start filling your first voice-powered form.
            </p>
            <div className="pt-2">
              <Link
                to="/templates"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/25 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Explore Templates</span>
              </Link>
            </div>
          </div>
        ) : (
          /* High-Polish Submissions Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {safeSubmissions.map((sub) => {
              const isCompleted = sub.status === 'completed';
              const isInReview = sub.status === 'in_review';
              const isDraft = !isCompleted && !isInReview;

              return (
                <div
                  key={sub.id}
                  onClick={() => handleOpenForm(sub)}
                  className={`group relative p-5 rounded-3xl bg-white dark:bg-slate-900 border transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 ${
                    isCompleted
                      ? 'border-slate-200 dark:border-slate-800 hover:border-emerald-500/80 hover:shadow-emerald-500/10'
                      : isInReview
                      ? 'border-slate-200 dark:border-slate-800 hover:border-purple-500/80 hover:shadow-purple-500/10'
                      : 'border-slate-200 dark:border-slate-800 hover:border-amber-500/80 hover:shadow-amber-500/10'
                  }`}
                >
                  {/* Left Status Colored Accent Bar */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1.5 transition-colors ${
                      isCompleted
                        ? 'bg-emerald-500'
                        : isInReview
                        ? 'bg-purple-500'
                        : 'bg-amber-500'
                    }`}
                  />

                  <div>
                    {/* Header Row: Status Badge with Icon + Date */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1.5 border shadow-2xs ${
                          isCompleted
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80'
                            : isInReview
                            ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/80'
                            : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/80'
                        }`}
                      >
                        {isCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                        {isInReview && <Shield className="w-3 h-3 text-purple-500" />}
                        {isDraft && <Clock className="w-3 h-3 text-amber-500" />}
                        <span>{sub.status.toUpperCase()}</span>
                      </span>

                      <span className="text-[11px] text-slate-400 font-mono font-medium">
                        {new Date(sub.lastUpdated).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    {/* Template Title */}
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {sub.templateTitle}
                    </h3>

                    {/* Refined Glowing Progress Bar */}
                    <div className="mt-4 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        <span>Form Completion</span>
                        <span
                          className={`font-mono font-bold ${
                            isCompleted
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-indigo-600 dark:text-indigo-400'
                          }`}
                        >
                          {sub.completionPercentage}%
                        </span>
                      </div>

                      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                        <div
                          className={`h-full rounded-full transition-all duration-500 relative ${
                            isCompleted
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_8px_rgba(16,185,129,0.7)]'
                              : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 shadow-[0_0_8px_rgba(99,102,241,0.7)]'
                          }`}
                          style={{ width: `${Math.max(sub.completionPercentage, 5)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:text-indigo-700 dark:group-hover:text-indigo-300">
                      <span>{isCompleted ? 'View & Review' : 'Resume Form'}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-200" />
                    </span>

                    {/* Action Icon Buttons with Hover Halo */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => handleExportPdf(sub, e)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800 transition-all cursor-pointer"
                        title="Export Clean PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleDelete(sub.id, e)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 border border-transparent hover:border-rose-200 dark:hover:border-rose-800 transition-all cursor-pointer"
                        title="Delete Submission"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* AVAILABLE POPULAR TEMPLATES PREVIEW */}
      {/* ========================================================================= */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Popular Starter Templates
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Choose a starter schema to launch voice filling immediately
            </p>
          </div>
          <Link
            to="/templates"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline flex items-center gap-1"
          >
            <span>Explore All 45+ Templates</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {safeTemplates.slice(0, 4).map((tpl) => (
            <div
              key={tpl.id}
              className="group p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              <div>
                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
                  {tpl.category}
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-2.5 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {tpl.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {tpl.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>~{tpl.estimatedMinutes} min</span>
                </span>
                <Link
                  to={`/workspace/${tpl.id}`}
                  onClick={() => setActiveTemplate(tpl)}
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Use Form</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
