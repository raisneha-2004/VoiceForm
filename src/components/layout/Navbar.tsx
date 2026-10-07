import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import { useTranslation } from '../../utils/translations';
import type { SupportedLanguage } from '../../types';
import {
  Mic,
  Sun,
  Moon,
  Monitor,
  Eye,
  Zap,
  Sparkles,
  Shield,
  LogOut,
  Menu,
  X,
  Globe,
  ChevronDown,
  Settings,
  FileText
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, switchDemoRole } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { t, language, setLanguage } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;

  // Close profile dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left Side: Brand Logo + Navigation Links */}
        <div className="flex items-center gap-6 lg:gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-theme-gradient flex items-center justify-center text-white shadow-md shadow-theme-glow-sm group-hover:scale-105 transition-all">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-theme-gradient">
                VoiceForm
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 border border-brand-200/60 dark:border-brand-800/60">
                AI Speech v2.0
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
              {/* Dashboard */}
              <Link
                to="/dashboard"
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive('/dashboard')
                    ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-xs border border-slate-200/60 dark:border-slate-700/60'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-800/40'
                }`}
              >
                {t('navDashboard')}
              </Link>

              {/* Templates */}
              <Link
                to="/templates"
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive('/templates')
                    ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-xs border border-slate-200/60 dark:border-slate-700/60'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-800/40'
                }`}
              >
                {t('navTemplates')}
              </Link>

              {/* Conversational Mode (Featured Accent Treatment) */}
              <Link
                to="/conversational"
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  isActive('/conversational')
                    ? 'bg-theme-gradient text-white shadow-md shadow-brand-500/25'
                    : 'bg-brand-50/80 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/60 hover:bg-brand-100 dark:hover:bg-brand-900/60 hover:shadow-xs'
                }`}
              >
                <Sparkles className={`w-3.5 h-3.5 ${isActive('/conversational') ? 'text-white' : 'text-brand-500 animate-pulse'}`} />
                <span>{t('navConversational')}</span>
                <span className={`text-[9px] uppercase px-1.5 py-0.2 rounded-full font-extrabold ${isActive('/conversational') ? 'bg-black/20 text-white' : 'bg-brand-200/80 dark:bg-brand-900/80 text-brand-800 dark:text-brand-200'}`}>
                  AI
                </span>
              </Link>

              {/* My Forms */}
              <Link
                to="/my-forms"
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive('/my-forms')
                    ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-xs border border-slate-200/60 dark:border-slate-700/60'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-800/40'
                }`}
              >
                {t('navMyForms')}
              </Link>

              {/* Admin Builder (if Admin) */}
              {user?.role === 'admin' && (
                <Link
                  to="/admin/builder"
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                    isActive('/admin/builder')
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/60'
                  }`}
                >
                  <Shield className="w-3 h-3 text-amber-500" />
                  <span>{t('navAdmin')}</span>
                </Link>
              )}
            </nav>
          )}
        </div>

        {/* Right Side: Grouped & Spaced Controls with Thin Dividers */}
        <div className="flex items-center gap-3 sm:gap-3.5">
          {/* Group 1: Language Dropdown Pill */}
          <div className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 shadow-2xs transition-all">
            <Globe className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              aria-label="Select app and speech language"
              className="bg-transparent font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden cursor-pointer text-xs pr-1"
            >
              <option value="en-US" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                English (US)
              </option>
              <option value="hi-IN" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                हिन्दी (Hindi)
              </option>
              <option value="hinglish" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                Hinglish
              </option>
            </select>
          </div>

          {/* Divider Line */}
          {isAuthenticated && (
            <div className="hidden sm:block h-5 w-px bg-slate-200/80 dark:bg-slate-800 shrink-0" />
          )}

          {/* Group 2: iOS-Style Segmented Role Switcher */}
          {isAuthenticated && (
            <div className="hidden sm:flex items-center p-1 bg-slate-100/90 dark:bg-slate-900/90 rounded-full border border-slate-200/90 dark:border-slate-800 shadow-inner text-[11px]">
              <button
                type="button"
                onClick={() => switchDemoRole('user')}
                className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                  user?.role === 'user'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {t('navUserView')}
              </button>
              <button
                type="button"
                onClick={() => switchDemoRole('admin')}
                className={`px-3 py-1 rounded-full font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  user?.role === 'admin'
                    ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Shield className="w-3 h-3 text-amber-500" />
                {t('navAdminView')}
              </button>
            </div>
          )}

          {/* Divider Line */}
          <div className="hidden sm:block h-5 w-px bg-slate-200/80 dark:bg-slate-800 shrink-0" />

          {/* Group 3: Circular Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-xs hover:scale-105 transition-all cursor-pointer"
            aria-label="Cycle display theme mode"
            title={`Active: ${theme.replace('-', ' ').toUpperCase()} (Click to Cycle Mode)`}
          >
            {theme === 'light' && <Sun className="w-4 h-4 text-amber-500" />}
            {theme === 'dark' && <Moon className="w-4 h-4 text-indigo-400" />}
            {theme === 'system' && <Monitor className="w-4 h-4 text-sky-400" />}
            {theme === 'high-contrast' && <Eye className="w-4 h-4 text-emerald-400" />}
            {theme === 'amoled' && <Zap className="w-4 h-4 text-purple-400" />}
          </button>

          {/* Divider Line */}
          {isAuthenticated && (
            <div className="hidden sm:block h-5 w-px bg-slate-200/80 dark:bg-slate-800 shrink-0" />
          )}

          {/* Group 4: Avatar + Name with Rich Dropdown Menu */}
          {isAuthenticated && user ? (
            <div className="relative" ref={profileDropdownRef}>
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                className="flex items-center gap-2.5 p-1 rounded-full hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-all group cursor-pointer"
                title="Account Menu"
              >
                {/* Avatar with Online Status Indicator */}
                <div className="relative">
                  <img
                    src={
                      user.avatar ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`
                    }
                    alt={user.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`;
                    }}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20 group-hover:ring-indigo-500 transition-all shadow-xs"
                  />
                  {/* Active Online Indicator */}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-950" />
                </div>

                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-slate-400 capitalize leading-none">
                    {user.role}
                  </span>
                </div>

                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Rich Glassmorphism Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl z-50 p-2 transform transition-all animate-in fade-in zoom-in-95 duration-150">
                  {/* User Header */}
                  <div className="p-3 border-b border-slate-100 dark:border-slate-800/80 flex items-center gap-3">
                    <img
                      src={
                        user.avatar ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`
                      }
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30"
                    />
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {user.email}
                      </p>
                      <span className="inline-block mt-1 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
                        {user.role === 'admin' ? 'Administrator' : 'Standard User'}
                      </span>
                    </div>
                  </div>

                  {/* Menu Options */}
                  <div className="py-1.5 space-y-0.5">
                    <Link
                      to="/settings"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>Profile & Settings</span>
                    </Link>

                    <Link
                      to="/my-forms"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span>My Form Submissions</span>
                    </Link>

                    {user.role === 'admin' && (
                      <Link
                        to="/admin/builder"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/50 transition-colors"
                      >
                        <Shield className="w-4 h-4 text-amber-500" />
                        <span>Admin Form Studio</span>
                      </Link>
                    )}
                  </div>

                  {/* Logout Row */}
                  <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/25 transition-all"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile menu toggle button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl px-4 py-3 space-y-2 animate-in slide-in-from-top-2 duration-150">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  isActive('/dashboard')
                    ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/templates"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  isActive('/templates')
                    ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Templates
              </Link>
              <Link
                to="/conversational"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-xl text-sm font-bold transition-colors ${
                  isActive('/conversational')
                    ? 'bg-purple-600 text-white'
                    : 'text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/50'
                }`}
              >
                Conversational Mode ✨
              </Link>
              <Link
                to="/my-forms"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  isActive('/my-forms')
                    ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                My Forms
              </Link>
              <Link
                to="/settings"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Profile & Settings
              </Link>
              {user?.role === 'admin' && (
                <Link
                  to="/admin/builder"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                >
                  Admin Form Builder
                </Link>
              )}
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-semibold rounded-xl bg-indigo-600 text-white"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
