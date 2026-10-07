import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormStore } from '../../store/useFormStore';
import { useTranslation } from '../../utils/translations';
import { templateService } from '../../api/client';
import type { FormTemplate } from '../../types';
import {
  Search,
  Clock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  HeartPulse,
  Landmark,
  BadgeDollarSign,
  Building2,
  Building,
  Scale,
  Plane,
  FileText,
  Award,
  FileSpreadsheet,
  ClipboardList,
  BookOpen,
  Calendar,
  Users,
  UserCheck,
  UserPlus,
  CreditCard,
  FileBadge,
  FileCheck,
  FileSignature,
  Compass,
  Receipt,
  MessageSquare,
  HelpCircle,
  Mail,
  AlertCircle,
  Home
} from 'lucide-react';

export const TemplatesPage: React.FC = () => {
  const { setActiveTemplate } = useFormStore();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [templates, setTemplates] = useState<FormTemplate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setIsLoading(true);
      const data = await templateService.getAll();
      setTemplates(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const safeTemplates = Array.isArray(templates) ? templates : [];

  // Preferred order of categories for clear intuitive navigation
  const PREFERRED_ORDER = [
    'All',
    'My Templates',
    'Travel',
    'Legal',
    'Real Estate',
    'Finance',
    'Government',
    'Events',
    'General',
    'Employment',
    'Education',
    'Healthcare'
  ];

  // Dynamically derive unique categories from loaded templates
  const dynamicCategories = Array.from(
    new Set(safeTemplates.map((t) => t.category).filter(Boolean))
  );

  const categories = [
    'All',
    ...PREFERRED_ORDER.filter((c) => c !== 'All' && dynamicCategories.includes(c)),
    ...dynamicCategories.filter((c) => !PREFERRED_ORDER.includes(c))
  ];

  const getTemplateIcon = (iconName?: string) => {
    switch (iconName) {
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-indigo-500" />;
      case 'Award':
        return <Award className="w-5 h-5 text-amber-500" />;
      case 'FileSpreadsheet':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />;
      case 'ClipboardList':
        return <ClipboardList className="w-5 h-5 text-blue-500" />;
      case 'Building':
        return <Building className="w-5 h-5 text-violet-500" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-teal-500" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5 text-purple-500" />;
      case 'HeartPulse':
        return <HeartPulse className="w-5 h-5 text-rose-500" />;
      case 'Landmark':
        return <Landmark className="w-5 h-5 text-amber-500" />;
      case 'BadgeDollarSign':
      case 'DollarSign':
        return <BadgeDollarSign className="w-5 h-5 text-emerald-500" />;
      case 'Building2':
        return <Building2 className="w-5 h-5 text-cyan-500" />;
      case 'Home':
        return <Home className="w-5 h-5 text-cyan-500" />;
      case 'Scale':
        return <Scale className="w-5 h-5 text-blue-500" />;
      case 'Plane':
        return <Plane className="w-5 h-5 text-sky-500" />;
      case 'FileText':
        return <FileText className="w-5 h-5 text-indigo-500" />;
      case 'FileBadge':
        return <FileBadge className="w-5 h-5 text-sky-500" />;
      case 'FileCheck':
        return <FileCheck className="w-5 h-5 text-teal-500" />;
      case 'FileSignature':
        return <FileSignature className="w-5 h-5 text-blue-500" />;
      case 'CreditCard':
        return <CreditCard className="w-5 h-5 text-emerald-500" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-emerald-500" />;
      case 'Compass':
        return <Compass className="w-5 h-5 text-sky-500" />;
      case 'Receipt':
        return <Receipt className="w-5 h-5 text-orange-500" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-purple-500" />;
      case 'Calendar':
        return <Calendar className="w-5 h-5 text-indigo-500" />;
      case 'Users':
        return <Users className="w-5 h-5 text-pink-500" />;
      case 'UserCheck':
        return <UserCheck className="w-5 h-5 text-teal-500" />;
      case 'UserPlus':
        return <UserPlus className="w-5 h-5 text-violet-500" />;
      case 'MessageSquare':
        return <MessageSquare className="w-5 h-5 text-indigo-500" />;
      case 'HelpCircle':
        return <HelpCircle className="w-5 h-5 text-amber-500" />;
      case 'Mail':
        return <Mail className="w-5 h-5 text-blue-500" />;
      case 'AlertCircle':
        return <AlertCircle className="w-5 h-5 text-rose-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-indigo-500" />;
    }
  };

  const filteredTemplates = safeTemplates.filter((tpl) => {
    if (!tpl) return false;
    const matchesCat = selectedCategory === 'All' || tpl.category === selectedCategory;
    const matchesSearch =
      (tpl.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tpl.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleStartForm = (tpl: FormTemplate, mode: 'workspace' | 'conversational' = 'workspace') => {
    if (!tpl) return;
    setActiveTemplate(tpl);
    const targetId = tpl.id || (tpl as any)._id;
    if (mode === 'conversational') {
      navigate(`/conversational?templateId=${targetId}`);
    } else {
      navigate(`/workspace/${targetId}`);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            {t('tplTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('tplSubtitle')}
          </p>
        </div>

        {/* Actions & Search */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={() => navigate('/builder')}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/20 flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Create Form</span>
          </button>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('tplSearchPlaceholder')}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-slate-400">Loading templates...</div>
      ) : filteredTemplates.length === 0 ? (
        <div className="py-16 text-center text-xs text-slate-400">
          No templates match your search query.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredTemplates.map((tpl) => {
            const fields = Array.isArray(tpl.fields) ? tpl.fields : [];
            const templateKey = tpl.id || (tpl as any)._id || Math.random().toString();

            return (
              <div
                key={templateKey}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center shrink-0">
                        {getTemplateIcon(tpl.icon)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                            {tpl.category || 'General'}
                          </span>
                          {new Set(fields.map((f) => f.section).filter(Boolean)).size > 1 && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200/50 dark:border-purple-800/40">
                              {new Set(fields.map((f) => f.section).filter(Boolean)).size} Sections
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                          {tpl.title || 'Untitled Template'}
                        </h3>
                      </div>
                    </div>

                    <span className="flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl">
                      <Clock className="w-3.5 h-3.5" />
                      <span>~{tpl.estimatedMinutes || 5}m</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {tpl.description || ''}
                  </p>

                  {/* Fields Preview Pills */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Fields Preview ({fields.length} items)
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {fields.slice(0, 6).map((f, idx) => (
                        <span
                          key={f?.id || f?.key || idx}
                          className="text-[11px] font-medium px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1"
                        >
                          <span>{f?.label || f?.key || `Field ${idx + 1}`}</span>
                          {f?.isSensitive && (
                            <span title="Sensitive" className="inline-flex items-center">
                              <ShieldCheck className="w-3 h-3 text-amber-500" />
                            </span>
                          )}
                        </span>
                      ))}
                      {fields.length > 6 && (
                        <span className="text-[11px] font-medium px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
                          +{fields.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleStartForm(tpl, 'conversational')}
                    className="px-3.5 py-2 text-xs font-semibold rounded-xl text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Conversational Mode</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStartForm(tpl, 'workspace')}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/25 transition-all flex items-center gap-1.5"
                  >
                    <span>Use Template</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
