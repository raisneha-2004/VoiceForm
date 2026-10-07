import React from 'react';
import { useAccessibilityStore, FONT_SIZE_OPTIONS } from '../../store/useAccessibilityStore';
import { useThemeStore } from '../../store/useThemeStore';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import {
  Accessibility,
  Eye,
  Mic,
  Volume2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Type,
  SunMoon
} from 'lucide-react';

export const AccessibilityPage: React.FC = () => {
  const {
    fontSize,
    setFontSize,
    voiceNavigationEnabled,
    setVoiceNavigationEnabled,
    screenReaderAnnouncements,
    setScreenReaderAnnouncements,
    reducedMotion,
    setReducedMotion,
    toggleHighContrast
  } = useAccessibilityStore();

  const { theme } = useThemeStore();
  const { speak } = useSpeechSynthesis();

  const isHighContrast = theme === 'high-contrast';

  const NAVIGATION_COMMANDS = [
    { target: 'Dashboard', en: 'Go to dashboard / Open dashboard', hi: 'डैशबोर्ड खोलो' },
    { target: 'Templates', en: 'Go to templates / Browse forms', hi: 'टेम्पलेट्स खोलो' },
    { target: 'Form Builder', en: 'Go to form builder / Create form', hi: 'फॉर्म बिल्डर खोलो' },
    { target: 'My Forms', en: 'Go to my forms / Saved forms', hi: 'मेरे फॉर्म्स खोलो' },
    { target: 'Conversational Mode', en: 'Go to conversational / Voice mode', hi: 'बातचीत शुरू करो' },
    { target: 'Voice Guide', en: 'Go to voice guide / Help commands', hi: 'वॉइस गाइड खोलो' },
    { target: 'Settings', en: 'Go to settings / Profile', hi: 'सेटिंग्स खोलो' },
    { target: 'Scrolling', en: 'Scroll down / Scroll up / Top of page', hi: 'नीचे करो / ऊपर करो' },
    { target: 'Go Back', en: 'Go back / Previous page', hi: 'पीछे जाओ / वापस' }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="rounded-[32px] p-1 bg-gradient-to-r from-blue-600/30 via-indigo-600/40 to-teal-500/30 shadow-2xl relative overflow-hidden">
        <div className="rounded-[28px] bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 text-white p-6 sm:p-8 relative overflow-hidden border border-white/10 backdrop-blur-xl flex flex-wrap items-center justify-between gap-6">
          <div className="relative z-10 space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs font-bold tracking-wide">
              <Accessibility className="w-3.5 h-3.5 animate-pulse" />
              <span>UNIVERSAL ACCESS & ASSISTIVE TECHNOLOGY</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              Accessibility & Voice Navigation Hub
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Personalize your visual experience, toggle WCAG-compliant contrast, and enable
              hands-free <strong className="text-white">Voice-Only Navigation</strong> to operate the entire VoiceForm application using speech.
            </p>

            {/* Quick Status Chips */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <div className="px-3 py-1 rounded-xl bg-white/10 border border-white/15 text-xs font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Font Scale: {FONT_SIZE_OPTIONS.find((f) => f.id === fontSize)?.scaleLabel}</span>
              </div>

              <div className="px-3 py-1 rounded-xl bg-white/10 border border-white/15 text-xs font-semibold flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${voiceNavigationEnabled ? 'bg-indigo-400 animate-ping' : 'bg-slate-400'}`} />
                <span>Voice Nav: {voiceNavigationEnabled ? 'Active' : 'Disabled'}</span>
              </div>

              <div className="px-3 py-1 rounded-xl bg-white/10 border border-white/15 text-xs font-semibold flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isHighContrast ? 'bg-amber-400' : 'bg-slate-400'}`} />
                <span>Contrast: {isHighContrast ? 'High Contrast' : 'Standard'}</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md text-center max-w-xs shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-3">
              <Accessibility className="w-8 h-8 text-white" />
            </div>
            <span className="text-xs font-bold text-white uppercase tracking-wider">WCAG 2.1 AAA Ready</span>
            <span className="text-[11px] text-slate-300 mt-1">Screen-reader tested with full keyboard & voice navigable flow</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Settings & Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Visual Sizing & High Contrast Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Font Size Adjuster */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Type className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Font Size & Text Scaling
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Adjust text scaling globally across all inputs, forms, and navigation menus
                  </p>
                </div>
              </div>
              <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                {FONT_SIZE_OPTIONS.find((f) => f.id === fontSize)?.scaleLabel}
              </span>
            </div>

            {/* 4-Step Font Size Options */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {FONT_SIZE_OPTIONS.map((opt) => {
                const isSelected = fontSize === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFontSize(opt.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {opt.name}
                        </span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />}
                      </div>
                      <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 block font-semibold">
                        {opt.sizePx} ({opt.scaleLabel})
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-tight">
                      {opt.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Live Typography Preview Box */}
            <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800/80 space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-indigo-500" />
                <span>Live Scaled Text Preview</span>
              </div>
              <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                "VoiceForm provides effortless voice-first form completion in multiple Indian languages with real-time feedback."
              </p>
              <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
                <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono">
                  Current Base: {FONT_SIZE_OPTIONS.find((f) => f.id === fontSize)?.sizePx}
                </span>
                <span>• Changes apply immediately across all screens.</span>
              </div>
            </div>
          </div>

          {/* Section 2: High Contrast & Visual Comfort */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <SunMoon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Visual Contrast & Motion Preferences
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Maximum contrast and simplified motion for low-vision or sensitivity assistance
                </p>
              </div>
            </div>

            <div className="space-y-3.5">
              {/* High Contrast Toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <div className="space-y-0.5 max-w-md">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      High Contrast Mode (WCAG AAA)
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                      Accessible
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Thick high-contrast borders, deep black canvas, and bold outlines on active elements.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={toggleHighContrast}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    isHighContrast ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                  aria-pressed={isHighContrast}
                  aria-label="Toggle High Contrast Mode"
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 left-0.5 transition-transform ${
                      isHighContrast ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Reduced Motion Toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <div className="space-y-0.5 max-w-md">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Reduce Motion & Continuous Animations
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Silences continuous wave pulses, spinning sparkles, and slide-in transitions.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setReducedMotion(!reducedMotion)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    reducedMotion ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                  aria-pressed={reducedMotion}
                  aria-label="Toggle Reduced Motion"
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 left-0.5 transition-transform ${
                      reducedMotion ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Screen Reader Voice Announcements */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <div className="space-y-0.5 max-w-md">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Screen-Reader Spoken Announcements
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Speaks page transitions and form completions aloud via assistive TTS speech.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setScreenReaderAnnouncements(!screenReaderAnnouncements)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    screenReaderAnnouncements ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                  aria-pressed={screenReaderAnnouncements}
                  aria-label="Toggle Screen Reader Announcements"
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 left-0.5 transition-transform ${
                      screenReaderAnnouncements ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Voice-Only Navigation Suite (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-white to-purple-500/10 dark:from-indigo-950/40 dark:via-slate-900 dark:to-purple-950/30 border border-indigo-200/80 dark:border-indigo-800/80 shadow-md space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/30">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Voice-Only Navigation
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Navigate the entire application hands-free using voice
                  </p>
                </div>
              </div>
            </div>

            {/* Master Toggle Card */}
            <div className={`p-4 rounded-2xl border transition-all ${
              voiceNavigationEnabled
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/20'
                : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="relative flex h-3 w-3">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                      voiceNavigationEnabled ? 'bg-white opacity-75' : 'bg-slate-400 opacity-30'
                    }`} />
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${
                      voiceNavigationEnabled ? 'bg-white' : 'bg-slate-400'
                    }`} />
                  </div>
                  <span className="text-xs font-bold">
                    {voiceNavigationEnabled ? 'Voice-Only Navigation is ACTIVE' : 'Voice-Only Navigation is OFF'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setVoiceNavigationEnabled(!voiceNavigationEnabled)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    voiceNavigationEnabled
                      ? 'bg-white text-indigo-700 hover:bg-slate-100'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {voiceNavigationEnabled ? 'Turn Off' : 'Enable Now'}
                </button>
              </div>

              <p className={`text-[11px] leading-relaxed ${
                voiceNavigationEnabled ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'
              }`}>
                {voiceNavigationEnabled
                  ? 'Microphone is actively listening for app-wide navigation cues (e.g. "go to templates", "open dashboard").'
                  : 'Turn on to control pages, scroll, and switch sections without touching your keyboard or mouse.'}
              </p>
            </div>

            {/* Navigation Voice Commands List */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
                Supported Voice Navigation Commands
              </div>

              <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
                {NAVIGATION_COMMANDS.map((cmd, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs hover:border-indigo-400/50 transition-colors"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <ArrowRight className="w-3 h-3 text-indigo-500 shrink-0" />
                        <span>{cmd.target}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5 truncate">
                        "{cmd.en}"
                      </div>
                      <div className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-0.5">
                        हिन्दी: "{cmd.hi}"
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => speak(cmd.en, { language: 'en-US' })}
                      title="Listen audio demonstration"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors cursor-pointer shrink-0"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ARIA & Screen Reader Status Checklist */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>ARIA Accessibility Checklist</span>
            </div>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Semantic HTML5 (`main`, `nav`, `aside`, `role="status"`)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Distinct visible focus rings for keyboard tab traversal</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>`aria-live="polite"` real-time speech synthesis status updates</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Devanagari numeric auto-normalization & screen reader support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
