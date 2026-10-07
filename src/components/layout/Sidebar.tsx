import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useVoiceStore } from '../../store/useVoiceStore';
import { useFormStore } from '../../store/useFormStore';
import { templateService, submissionService } from '../../api/client';
import type { FormTemplate, FormSubmission } from '../../types';
import {
  LayoutDashboard,
  FileText,
  CopyCheck,
  Settings,
  Shield,
  LogOut,
  MessageSquareCode,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Zap,
  CheckCircle2,
  Mic,
  Search,
  X,
  Terminal,
  FilePlus2,
  Accessibility,
  ArrowRight
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { isRecording } = useVoiceStore();
  const { setActiveTemplate, setActiveSubmission } = useFormStore();
  const navigate = useNavigate();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [templates, setTemplates] = useState<FormTemplate[]>([]);
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Debounce search query by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Lazy load templates & forms when search is focused
  useEffect(() => {
    if (isSearchFocused && !isDataLoaded) {
      loadSearchData();
    }
  }, [isSearchFocused, isDataLoaded]);

  const loadSearchData = async () => {
    try {
      const [tpls, subs] = await Promise.all([
        templateService.getAll(),
        submissionService.getAll(user?.id)
      ]);
      setTemplates(tpls);
      setSubmissions(subs);
      setIsDataLoaded(true);
    } catch (e) {
      console.error('Failed to load search data', e);
    }
  };

  // Close search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter templates and submissions based on debounced search query
  const filteredTemplates = debouncedQuery
    ? templates.filter(
        (t) =>
          t.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          t.category.toLowerCase().includes(debouncedQuery.toLowerCase())
      )
    : [];

  const filteredSubmissions = debouncedQuery
    ? submissions.filter((s) => {
        const tpl = templates.find((t) => t.id === s.templateId);
        const nameInVal = String(s.data?.name || s.data?.fullname || s.data?.applicantName || '');
        return (
          (tpl && tpl.title.toLowerCase().includes(debouncedQuery.toLowerCase())) ||
          s.id.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          nameInVal.toLowerCase().includes(debouncedQuery.toLowerCase())
        );
      })
    : [];

  const hasSearchResults = filteredTemplates.length > 0 || filteredSubmissions.length > 0;

  const handleSelectTemplate = (tpl: FormTemplate) => {
    setActiveTemplate(tpl);
    setIsSearchFocused(false);
    setSearchQuery('');
    navigate(`/workspace/${tpl.id}`);
  };

  const handleSelectSubmission = (sub: FormSubmission) => {
    const tpl = templates.find((t) => t.id === sub.templateId) || templates[0];
    if (tpl) {
      setActiveTemplate(tpl, sub.data);
      setActiveSubmission(sub);
      setIsSearchFocused(false);
      setSearchQuery('');
      navigate(`/workspace/${tpl.id}?subId=${sub.id}`);
    }
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/my-forms', label: 'My Forms', icon: FileText },
    { to: '/templates', label: 'Templates', icon: CopyCheck },
    {
      to: '/builder',
      label: 'Form Builder',
      icon: FilePlus2,
      badge: 'Create'
    },
    {
      to: '/conversational',
      label: 'Conversational',
      icon: MessageSquareCode,
      badge: 'Voice AI',
      isAiFeatured: true
    },
    {
      to: '/voice-guide',
      label: 'Voice Commands',
      icon: Terminal,
      badge: 'Guide'
    },
    {
      to: '/accessibility',
      label: 'Accessibility',
      icon: Accessibility,
      badge: 'A11y'
    },
    ...(user?.role === 'admin'
      ? [{ to: '/admin/builder', label: 'Admin Builder', icon: Shield, badge: 'Admin' }]
      : []),
    { to: '/settings', label: 'Profile & Settings', icon: Settings },
  ];

  return (
    <aside
      className={`hidden lg:flex flex-col shrink-0 border-r border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-white via-slate-50/80 to-slate-100/60 dark:from-slate-950 dark:via-slate-900/90 dark:to-slate-950 backdrop-blur-xl min-h-[calc(100vh-4rem)] p-3.5 justify-between transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Section: Search Bar & Navigation List */}
      <div className="space-y-3.5">
        {/* Top Debounced Search Bar */}
        {!isCollapsed ? (
          <div className="relative" ref={searchContainerRef}>
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search forms & templates..."
                className="w-full pl-8 pr-7 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Dropdown Suggestions Popover */}
            {isSearchFocused && debouncedQuery && (
              <div className="absolute left-0 top-full mt-1.5 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 p-2 space-y-2 max-h-80 overflow-y-auto backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150">
                {/* Templates Section */}
                {filteredTemplates.length > 0 && (
                  <div>
                    <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <CopyCheck className="w-3 h-3 text-brand-500" />
                      <span>Matching Templates ({filteredTemplates.length})</span>
                    </div>
                    <div className="space-y-1 mt-1">
                      {filteredTemplates.map((tpl) => (
                        <button
                          key={tpl.id}
                          type="button"
                          onClick={() => handleSelectTemplate(tpl)}
                          className="w-full p-2 rounded-xl text-left hover:bg-brand-50 dark:hover:bg-brand-950/60 transition-colors flex items-center justify-between group cursor-pointer"
                        >
                          <div className="min-w-0 pr-2">
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-brand-600 dark:group-hover:text-brand-400">
                              {tpl.title}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">
                              {tpl.category} • {tpl.fields.length} fields
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-brand-500 shrink-0 group-hover:translate-x-0.5 transition-all" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submissions / Forms Section */}
                {filteredSubmissions.length > 0 && (
                  <div className={filteredTemplates.length > 0 ? 'pt-2 border-t border-slate-100 dark:border-slate-800' : ''}>
                    <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <FileText className="w-3 h-3 text-emerald-500" />
                      <span>My Forms / Submissions ({filteredSubmissions.length})</span>
                    </div>
                    <div className="space-y-1 mt-1">
                      {filteredSubmissions.map((sub) => {
                        const tpl = templates.find((t) => t.id === sub.templateId);
                        return (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => handleSelectSubmission(sub)}
                            className="w-full p-2 rounded-xl text-left hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition-colors flex items-center justify-between group cursor-pointer"
                          >
                            <div className="min-w-0 pr-2">
                              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                                {tpl?.title || 'Saved Form'}
                              </div>
                              <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                                <span className={`px-1.5 py-0.2 rounded-md font-bold uppercase text-[9px] ${
                                  sub.status === 'completed'
                                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                                    : 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
                                }`}>
                                  {sub.status}
                                </span>
                                <span>{sub.data?.name || sub.data?.fullname || sub.id.substring(0, 8)}</span>
                              </div>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-500 shrink-0 group-hover:translate-x-0.5 transition-all" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Empty Search Result */}
                {!hasSearchResults && (
                  <div className="p-4 text-center text-xs text-slate-400">
                    <p className="font-semibold text-slate-600 dark:text-slate-300">No matches found</p>
                    <p className="text-[10px] mt-0.5">No template or form matching "{debouncedQuery}"</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Collapsed Search Icon Trigger */
          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            title="Search templates & forms"
            className="w-10 h-10 mx-auto rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-brand-600 hover:border-brand-400 flex items-center justify-center transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>
        )}

        {/* Section Header */}
        <div className="px-2 pt-1">
          {!isCollapsed ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Main Navigation
                </span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
                </span>
              </div>
              <div className="h-px bg-gradient-to-r from-slate-200 via-indigo-300 to-transparent dark:from-slate-800 dark:via-indigo-900 dark:to-transparent mt-2 mb-1" />
            </>
          ) : (
            <div className="h-px bg-slate-200 dark:bg-slate-800 my-1" />
          )}
        </div>

        {/* Nav Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              title={isCollapsed ? item.label : undefined}
              className={({ isActive }) =>
                `group relative flex items-center ${
                  isCollapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-2.5'
                } rounded-2xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-theme-gradient-subtle text-brand-600 dark:text-brand-400 font-bold border border-brand-200/50 dark:border-brand-800/50 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-900/60 border border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Left Accent Bar on Active Item */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-theme-gradient rounded-r-full shadow-theme-glow-sm" />
                  )}

                  <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} min-w-0`}>
                    <item.icon
                      className={`w-4 h-4 shrink-0 transition-all duration-200 ${
                        isActive
                          ? 'text-brand-600 dark:text-brand-400 drop-shadow-xs scale-110'
                          : 'text-slate-400 dark:text-slate-500 group-hover:text-brand-500 group-hover:scale-110 group-hover:translate-x-0.5'
                      }`}
                    />
                    {!isCollapsed && (
                      <span className="truncate group-hover:translate-x-0.5 transition-transform duration-200">
                        {item.label}
                      </span>
                    )}
                  </div>

                  {/* Badges */}
                  {!isCollapsed && item.badge && (
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 transition-all ${
                        item.isAiFeatured
                          ? 'bg-brand-50 dark:bg-brand-950/60 border border-brand-300/60 dark:border-brand-700/60 text-brand-700 dark:text-brand-300 shadow-2xs'
                          : item.badge === 'Admin'
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          : item.badge === 'Guide'
                          ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200/80 dark:border-sky-800/80'
                          : 'bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300'
                      }`}
                    >
                      {item.isAiFeatured && <Sparkles className="w-2.5 h-2.5 text-brand-500 animate-pulse" />}
                      <span>{item.badge}</span>
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Area: Voice Engine Status Mini-Card & Footer Actions */}
      <div className="space-y-3 pt-3 border-t border-slate-200/80 dark:border-slate-800/80">
        {!isCollapsed ? (
          /* Rich Voice Engine Mini-Widget with Alive Pulse & Dynamic Micro-Waveform */
          <Link
            to="/conversational"
            title="Open Conversational Voice Wizard"
            className="group relative block p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-slate-50 to-teal-500/10 dark:from-emerald-950/40 dark:via-slate-900/90 dark:to-teal-950/30 border border-emerald-500/25 dark:border-emerald-500/35 hover:border-emerald-500/50 shadow-xs hover:shadow-lg hover:shadow-emerald-500/15 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden cursor-pointer"
          >
            {/* Ambient Background Waveform Animation (Subtle Real-time Audio Waves) */}
            <div className="absolute right-2 bottom-2 flex items-end gap-0.5 opacity-20 dark:opacity-25 group-hover:opacity-45 transition-opacity pointer-events-none">
              <span className="w-0.5 h-2.5 bg-emerald-500 rounded-full animate-wave-bar" style={{ animationDuration: '0.8s', animationDelay: '0.1s' }} />
              <span className="w-0.5 h-4 bg-emerald-500 rounded-full animate-wave-bar" style={{ animationDuration: '1.1s', animationDelay: '0.3s' }} />
              <span className="w-0.5 h-2 bg-emerald-500 rounded-full animate-wave-bar" style={{ animationDuration: '0.7s', animationDelay: '0.2s' }} />
              <span className="w-0.5 h-5.5 bg-emerald-500 rounded-full animate-wave-bar" style={{ animationDuration: '1.3s', animationDelay: '0.5s' }} />
              <span className="w-0.5 h-3.5 bg-emerald-500 rounded-full animate-wave-bar" style={{ animationDuration: '0.9s', animationDelay: '0.4s' }} />
              <span className="w-0.5 h-2 bg-emerald-500 rounded-full animate-wave-bar" style={{ animationDuration: '0.75s', animationDelay: '0.15s' }} />
            </div>

            {/* Header: Concentric Expanding Live Indicator + Status Label + Shimmering AI Sparkle */}
            <div className="flex items-center justify-between mb-2 relative z-10">
              <div className="flex items-center gap-2.5">
                {/* Multi-layered Concentric Live Pulse Radar */}
                <div className="relative flex h-3 w-3 items-center justify-center">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                      isRecording ? 'bg-rose-400' : 'bg-emerald-400'
                    } opacity-75`}
                  />
                  <span
                    className={`absolute inline-flex h-4 w-4 rounded-full ${
                      isRecording ? 'bg-rose-400/30' : 'bg-emerald-400/30'
                    } animate-pulse`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      isRecording ? 'bg-rose-500' : 'bg-emerald-500'
                    } shadow-[0_0_8px_rgba(16,185,129,0.8)]`}
                  />
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                    {isRecording ? 'Speech Listening' : 'Voice Engine Live'}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
                </div>
              </div>

              {/* Shimmering Rotating AI Sparkle Badge */}
              <div className="w-5 h-5 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all">
                <Sparkles className="w-3 h-3 animate-[spin_8s_linear_infinite]" />
              </div>
            </div>

            {/* Subtitle Description */}
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mb-2.5 relative z-10 font-normal">
              Continuous recognition in English, हिन्दी & Hinglish.
            </p>

            {/* Upgraded Stats Strip with Icons & Visual Ring */}
            <div className="flex items-center justify-between pt-2 border-t border-emerald-500/15 dark:border-emerald-500/20 text-[10px] relative z-10">
              {/* Stat 1: Voice Cues with Zap */}
              <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                <div className="w-3.5 h-3.5 rounded-full bg-amber-500/15 flex items-center justify-center text-amber-500">
                  <Zap className="w-2.5 h-2.5" />
                </div>
                <span>42 Voice Cues</span>
              </div>

              {/* Separator */}
              <span className="text-slate-300 dark:text-slate-700 text-xs">•</span>

              {/* Stat 2: 100% Ready with Circular Progress Ring & Check */}
              <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                <div className="relative w-3.5 h-3.5 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 -rotate-90" viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      className="opacity-25"
                      fill="none"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeDasharray="56.5"
                      strokeDashoffset="0"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                  <CheckCircle2 className="w-2 h-2 absolute inset-0 m-auto text-emerald-500" />
                </div>
                <span>100% Ready</span>
              </div>
            </div>
          </Link>
        ) : (
          /* Collapsed Voice Icon Pill */
          <Link
            to="/conversational"
            title="Voice Engine Ready — Click for Conversational Mode"
            className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-br from-emerald-500/15 to-teal-500/10 dark:from-emerald-950/60 dark:to-slate-900 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center relative group hover:scale-105 transition-all shadow-xs"
          >
            <Mic className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.9)] animate-ping" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500" />
          </Link>
        )}

        {/* Footer Actions: Collapse / Expand Toggle & Logout */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 rounded-xl transition-all cursor-pointer"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-indigo-500" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span className="text-[11px]">Collapse Menu</span>
              </>
            )}
          </button>

          {!isCollapsed && (
            <button
              type="button"
              onClick={logout}
              title="Sign Out"
              className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
