import React, { useState, useRef } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore, THEME_PRESETS, DISPLAY_MODE_OPTIONS } from '../../store/useThemeStore';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import type { SupportedLanguage } from '../../types';
import {
  User,
  Mic,
  Volume2,
  Moon,
  Sun,
  Monitor,
  Eye,
  Zap,
  Server,
  Trash2,
  Save,
  Camera,
  Upload,
  RefreshCw,
  CheckCircle2,
  Image as ImageIcon,
  Palette,
  Check,
  Sparkles
} from 'lucide-react';

const PRESET_AVATARS = [
  {
    id: 'preset-1',
    label: 'Professional Female 1',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'preset-2',
    label: 'Professional Female 2',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'preset-3',
    label: 'Professional Male 1',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'preset-4',
    label: 'Professional Male 2',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'preset-5',
    label: 'Modern Female 3',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'preset-6',
    label: 'Modern Male 3',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80'
  }
];

export const ProfileSettingsPage: React.FC = () => {
  const { user, updateProfile, updatePreferences } = useAuthStore();
  const { theme, setTheme, colorTheme, setColorTheme, addToast } = useThemeStore();
  const { speak, cancel, isSpeaking } = useSpeechSynthesis();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name || 'Sneha Rai');
  const [email, setEmail] = useState(user?.email || 'sneha.rai@indicdata.ai');
  const [avatar, setAvatar] = useState<string>(
    user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
  );

  const [defaultLanguage, setDefaultLanguage] = useState<SupportedLanguage>(
    user?.preferences?.defaultLanguage || 'en-US'
  );
  const [autoReadQuestions, setAutoReadQuestions] = useState<boolean>(
    user?.preferences?.autoReadQuestions ?? true
  );
  const [confirmSensitiveData, setConfirmSensitiveData] = useState<boolean>(
    user?.preferences?.confirmSensitiveData ?? true
  );
  const [speechRate, setSpeechRate] = useState<number>(
    user?.preferences?.speechRate ?? 1.0
  );
  const [speechPitch, setSpeechPitch] = useState<number>(
    user?.preferences?.speechPitch ?? 1.0
  );
  const [apiBaseUrl, setApiBaseUrl] = useState<string>(
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
  );

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      addToast({
        type: 'error',
        title: 'Invalid File Type',
        message: 'Please upload an image file (JPG, PNG, WebP, GIF).'
      });
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      addToast({
        type: 'error',
        title: 'File Too Large',
        message: 'Please select an image smaller than 5MB.'
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      if (base64Url) {
        setAvatar(base64Url);
        // Automatically update profile so navbar and all pages reflect immediately
        updateProfile({ avatar: base64Url });
        addToast({
          type: 'success',
          title: 'Photo Uploaded!',
          message: 'Your profile picture has been updated and saved.'
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (presetUrl: string) => {
    setAvatar(presetUrl);
    updateProfile({ avatar: presetUrl });
    addToast({
      type: 'info',
      title: 'Avatar Selected',
      message: 'Preset avatar applied to your profile.'
    });
  };

  const handleRemovePhoto = () => {
    const defaultAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
      name || 'User'
    )}&backgroundColor=4f46e5&textColor=ffffff`;
    setAvatar(defaultAvatar);
    updateProfile({ avatar: defaultAvatar });
    addToast({
      type: 'info',
      title: 'Photo Reset',
      message: 'Profile photo reset to initials avatar.'
    });
  };

  const handleSaveAll = () => {
    updateProfile({ name, email, avatar });
    updatePreferences({
      defaultLanguage,
      autoReadQuestions,
      confirmSensitiveData,
      speechRate,
      speechPitch
    });
    addToast({
      type: 'success',
      title: 'Profile & Settings Saved',
      message: 'Your profile name, photo, and voice AI preferences are now persisted.'
    });
  };

  const handleTestVoice = () => {
    cancel();
    const testPhrases = {
      'en-US': "Hello! VoiceForm speech synthesis is working smoothly at your selected pitch and speed.",
      'hi-IN': "नमस्ते! वॉयस-फॉर्म स्पीच सिंथेसिस आपकी चयनित गति और आवाज़ में सफलतापूर्वक काम कर रहा है।",
      'hinglish': "Hello! VoiceForm conversational assistant aapke forms smoothly fill karne ke liye ready hai."
    };
    speak(testPhrases[defaultLanguage] || testPhrases['en-US']);
  };

  const handleClearCache = () => {
    if (confirm('Clear local mock forms and reset preferences to defaults?')) {
      localStorage.removeItem('voiceform_mock_templates');
      localStorage.removeItem('voiceform_mock_submissions');
      addToast({
        type: 'info',
        title: 'Cache Cleared',
        message: 'Local storage reset. Please reload the page.'
      });
      setTimeout(() => window.location.reload(), 800);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
          Profile & Account Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal profile photo, identity, multilingual speech recognition, and preferences
        </p>
      </div>

      {/* Profile Details & Photo Upload Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Personal Profile & Avatar Photo
            </h2>
            <p className="text-[11px] text-slate-400">
              Update your display photo, full name, and email credentials
            </p>
          </div>
        </div>

        {/* Avatar Upload Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60">
          {/* Avatar Preview */}
          <div className="relative group shrink-0">
            <img
              src={avatar}
              alt={name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-indigo-500/20 shadow-md transition-all"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1.5 -right-1.5 w-9 h-9 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg flex items-center justify-center transition-transform active:scale-95"
              title="Upload Photo"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Photo Actions */}
          <div className="space-y-3 flex-1">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Profile Photo
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Upload your custom photo (JPG, PNG, WebP max 5MB). Changes update instantly in the top navbar.
              </p>
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
              onChange={handlePhotoUpload}
              className="hidden"
            />

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/25 flex items-center gap-2 transition-all"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Photo</span>
              </button>

              <button
                type="button"
                onClick={handleRemovePhoto}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset to Initials</span>
              </button>
            </div>
          </div>
        </div>

        {/* Preset Avatar Gallery */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
            <span>Or choose from curated preset avatars</span>
          </label>
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
            {PRESET_AVATARS.map((preset) => {
              const isSelected = avatar === preset.url;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset.url)}
                  className={`relative shrink-0 rounded-2xl overflow-hidden p-1 transition-all ${
                    isSelected
                      ? 'ring-2 ring-indigo-600 dark:ring-indigo-400 scale-105 shadow-sm'
                      : 'opacity-70 hover:opacity-100 hover:scale-105'
                  }`}
                  title={preset.label}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  {isSelected && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Name & Email Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Display Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sneha Rai"
              className="mt-1 w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-semibold focus:ring-2 focus:ring-indigo-500/40 outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sneha.rai@indicdata.ai"
              className="mt-1 w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-semibold focus:ring-2 focus:ring-indigo-500/40 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Voice & Speech Preferences Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        {/* Header with Glowing Mic Pulse & Test Voice TTS Action */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3.5">
            {/* Animated Concentric Glow Icon Container */}
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 border border-brand-200/80 dark:border-brand-800/80 shadow-xs group">
              <span className="absolute -inset-1 rounded-2xl bg-brand-500/20 animate-pulse pointer-events-none" />
              <Mic className="w-5 h-5 relative z-10" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>Voice & Multilingual AI Preferences</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 border border-brand-200/60 dark:border-brand-800/60">
                  AI Speech v2.0
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Configure real-time Speech-to-Text (STT) recognition and Text-to-Speech (TTS) synthesis
              </p>
            </div>
          </div>

          {/* Test Voice TTS Action with Subtext */}
          <div className="flex flex-col items-end gap-1">
            <button
              type="button"
              onClick={handleTestVoice}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all duration-200 cursor-pointer shadow-xs ${
                isSpeaking
                  ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse shadow-rose-500/25'
                  : 'bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/80 dark:hover:bg-brand-900/60 text-brand-700 dark:text-brand-300 border border-brand-200/80 dark:border-brand-800/80 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-bounce' : ''}`} />
              <span>{isSpeaking ? 'Speaking Preview...' : 'Test Voice TTS'}</span>
            </button>
            <span className="text-[10px] text-slate-400">
              Preview how your speech settings sound
            </span>
          </div>
        </div>

        {/* Group 1: Speech Recognition Language Radio Cards */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>Speech Recognition Language (3 Options)</span>
            <span className="text-[11px] font-normal text-slate-400">
              Selected: <strong className="text-brand-600 dark:text-brand-400 capitalize">{defaultLanguage === 'en-US' ? 'English (Global / US)' : defaultLanguage === 'hi-IN' ? 'Hindi (हिन्दी)' : 'Hinglish (Mix)'}</strong>
            </span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {[
              { id: 'en-US', label: 'English (Global / US)', code: 'EN', desc: 'Standard English speech entity extraction' },
              { id: 'hi-IN', label: 'Hindi (हिन्दी)', code: 'HI', desc: 'Devanagari script & pure Hindi vocabulary' },
              { id: 'hinglish', label: 'Hinglish (Mix)', code: 'MIX', desc: 'Natural English + Hindi colloquial mixture' }
            ].map((lang) => {
              const isSelected = defaultLanguage === lang.id;
              return (
                <div
                  key={lang.id}
                  onClick={() => setDefaultLanguage(lang.id as any)}
                  className={`group relative p-4 rounded-2xl border text-left cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? 'border-brand-500 dark:border-brand-400 bg-gradient-to-br from-brand-500/15 via-brand-500/5 to-transparent dark:from-brand-950/60 dark:via-brand-900/30 dark:to-transparent ring-2 ring-brand-500/25 shadow-md -translate-y-0.5'
                      : 'border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 opacity-75 hover:opacity-100 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-850 hover:-translate-y-0.5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`w-7 h-7 rounded-xl text-[10px] font-black flex items-center justify-center border shadow-2xs ${
                      isSelected
                        ? 'bg-brand-600 text-white border-brand-500'
                        : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                    }`}>
                      {lang.code}
                    </span>

                    {/* Checkmark Badge on Selected Card */}
                    {isSelected ? (
                      <span className="w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-700 group-hover:border-slate-400 transition-colors" />
                    )}
                  </div>

                  <div>
                    <div className={`text-xs font-bold ${isSelected ? 'text-brand-700 dark:text-brand-300' : 'text-slate-800 dark:text-slate-200'}`}>
                      {lang.label}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                      {lang.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Group 2: iOS-Style Sliding Toggle Switches */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-3">
            Conversational Assistance & Privacy
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Toggle 1: Auto-Read Questions */}
            <div
              onClick={() => setAutoReadQuestions(!autoReadQuestions)}
              className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 flex items-center justify-between gap-4 cursor-pointer transition-all hover:bg-white dark:hover:bg-slate-850"
            >
              <div className="space-y-0.5 select-none">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Auto-Read Questions (TTS)
                </span>
                <p className="text-[11px] text-slate-400">
                  Speaks field questions aloud when navigating with voice
                </p>
              </div>

              {/* iOS Sliding Toggle Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={autoReadQuestions}
                onClick={(e) => {
                  e.stopPropagation();
                  setAutoReadQuestions(!autoReadQuestions);
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  autoReadQuestions
                    ? 'bg-brand-600 shadow-md shadow-brand-500/30 ring-2 ring-brand-500/20'
                    : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    autoReadQuestions ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 2: Confirm Sensitive Data */}
            <div
              onClick={() => setConfirmSensitiveData(!confirmSensitiveData)}
              className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 flex items-center justify-between gap-4 cursor-pointer transition-all hover:bg-white dark:hover:bg-slate-850"
            >
              <div className="space-y-0.5 select-none">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Confirm Sensitive Data
                </span>
                <p className="text-[11px] text-slate-400">
                  Prompts confirmation dialog before storing Aadhaar, PAN or phone
                </p>
              </div>

              {/* iOS Sliding Toggle Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={confirmSensitiveData}
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmSensitiveData(!confirmSensitiveData);
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  confirmSensitiveData
                    ? 'bg-brand-600 shadow-md shadow-brand-500/30 ring-2 ring-brand-500/20'
                    : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    confirmSensitiveData ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Group 3: Speech Synthesis Range Sliders with Dynamic Track Fill */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-3">
            TTS Voice Acoustics Tuning
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Slider 1: Speech Rate */}
            <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800/80 space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span>Speech Rate (Speed)</span>
                  <span className="text-[10px] text-slate-400 font-normal">(0.5x - 2.0x)</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 border border-brand-200/80 dark:border-brand-800/80 font-mono text-xs font-bold shadow-2xs">
                  {speechRate}x
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={speechRate}
                onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                className="custom-range-slider w-full"
                style={{
                  background: `linear-gradient(to right, var(--color-primary-600) 0%, var(--color-primary-500) ${((speechRate - 0.5) / 1.5) * 100}%, rgba(148, 163, 184, 0.25) ${((speechRate - 0.5) / 1.5) * 100}%, rgba(148, 163, 184, 0.25) 100%)`
                }}
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>0.5x (Slow)</span>
                <span>1.0x (Normal)</span>
                <span>2.0x (Fast)</span>
              </div>
            </div>

            {/* Slider 2: Voice Pitch */}
            <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800/80 space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span>Voice Pitch</span>
                  <span className="text-[10px] text-slate-400 font-normal">(0.5x - 1.5x)</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 border border-brand-200/80 dark:border-brand-800/80 font-mono text-xs font-bold shadow-2xs">
                  {speechPitch}x
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={speechPitch}
                onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                className="custom-range-slider w-full"
                style={{
                  background: `linear-gradient(to right, var(--color-primary-600) 0%, var(--color-primary-500) ${((speechPitch - 0.5) / 1.0) * 100}%, rgba(148, 163, 184, 0.25) ${((speechPitch - 0.5) / 1.0) * 100}%, rgba(148, 163, 184, 0.25) 100%)`
                }}
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>0.5x (Deep)</span>
                <span>1.0x (Natural)</span>
                <span>1.5x (High)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Appearance & Color Themes Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Appearance & Color Theme Presets
              </h2>
              <p className="text-[11px] text-slate-400">
                Switch app color palette and dark/light mode in real time
              </p>
            </div>
          </div>

          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 border border-brand-200/60 dark:border-brand-800/60">
            Instant Live Preview
          </span>
        </div>

        {/* Multi-Display Mode Switcher (5 Modes) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Display Canvas Mode (5 Options)
            </label>
            <span className="text-[11px] font-normal text-slate-400">
              Active: <strong className="text-brand-600 dark:text-brand-400 capitalize">{DISPLAY_MODE_OPTIONS.find(m => m.id === theme)?.name || 'Dark Mode'}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {DISPLAY_MODE_OPTIONS.map((mode) => {
              const isSelected = theme === mode.id;
              
              const getModeIcon = () => {
                switch (mode.id) {
                  case 'light':
                    return <Sun className="w-4 h-4 text-amber-500" />;
                  case 'dark':
                    return <Moon className="w-4 h-4 text-indigo-400" />;
                  case 'system':
                    return <Monitor className="w-4 h-4 text-sky-400" />;
                  case 'high-contrast':
                    return <Eye className="w-4 h-4 text-emerald-400" />;
                  case 'amoled':
                    return <Zap className="w-4 h-4 text-purple-400" />;
                  default:
                    return <Sun className="w-4 h-4 text-brand-500" />;
                }
              };

              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => {
                    setTheme(mode.id);
                    addToast({
                      type: 'info',
                      title: `${mode.name} Activated`,
                      message: `Display mode switched to ${mode.name}.`
                    });
                  }}
                  className={`group relative p-3.5 rounded-2xl text-left border transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40 ring-2 ring-brand-500/30 shadow-md -translate-y-0.5'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-7 h-7 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                      {getModeIcon()}
                    </div>
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-brand-500 text-white shadow-2xs'
                        : 'bg-slate-200/70 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}>
                      {mode.badge}
                    </span>
                  </div>

                  <div>
                    <div className={`text-xs font-bold ${isSelected ? 'text-brand-700 dark:text-brand-300' : 'text-slate-800 dark:text-slate-200'}`}>
                      {mode.name}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 leading-tight line-clamp-2">
                      {mode.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Color Accent Presets Grid */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>Color Palette Presets (4 Options)</span>
            <span className="text-[11px] font-normal text-slate-400">Selected: <strong className="text-brand-600 dark:text-brand-400 capitalize">{THEME_PRESETS.find(p => p.id === colorTheme)?.name || 'Default Purple'}</strong></span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {THEME_PRESETS.map((preset) => {
              const isSelected = colorTheme === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setColorTheme(preset.id);
                    addToast({
                      type: 'success',
                      title: `${preset.name} Applied`,
                      message: `Active color theme switched to ${preset.name}.`
                    });
                  }}
                  className={`group relative p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer ${
                    isSelected
                      ? 'border-brand-500 dark:border-brand-400 bg-brand-50/40 dark:bg-brand-950/30 ring-2 ring-brand-500/30 shadow-md'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-850'
                  }`}
                >
                  {/* Top Swatches Row */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    {/* Swatch Circles Trio */}
                    <div className="flex items-center -space-x-1.5">
                      {preset.previewColors.map((color, idx) => (
                        <span
                          key={idx}
                          className="w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 shadow-xs"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>

                    {/* Checkmark Badge */}
                    {isSelected ? (
                      <span className="w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-700 group-hover:border-slate-400" />
                    )}
                  </div>

                  {/* Gradient Pill Bar */}
                  <div
                    className="w-full h-2 rounded-full mb-3 shadow-2xs"
                    style={{
                      background: `linear-gradient(90deg, ${preset.previewColors.join(', ')})`
                    }}
                  />

                  {/* Title & Description */}
                  <div>
                    <h3 className={`text-xs font-extrabold ${isSelected ? 'text-brand-700 dark:text-brand-300' : 'text-slate-900 dark:text-slate-100'}`}>
                      {preset.name}
                    </h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                      {preset.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Theme Preview Panel */}
        <div className="mt-5 p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
          {/* Header Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-slate-100 dark:border-slate-800">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Live Theme Preview
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                See how your selected theme looks across buttons, badges, tags, and voice indicators
              </p>
            </div>

            {/* Clean User-Facing Active Theme Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/80 border border-brand-200/70 dark:border-brand-800/70 text-brand-700 dark:text-brand-300 text-xs font-bold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
              <span>
                Currently Previewing: <strong className="font-extrabold capitalize text-brand-600 dark:text-brand-400">{THEME_PRESETS.find(p => p.id === colorTheme)?.name || 'Default Purple'}</strong>
              </span>
            </div>
          </div>

          {/* Sample Elements Grid with Labels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
            {/* Element 1: Primary Button */}
            <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 flex flex-col items-center justify-between gap-3">
              <button
                type="button"
                className="w-full py-2.5 px-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Primary Action</span>
              </button>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Primary Button
              </span>
            </div>

            {/* Element 2: Gradient Badge */}
            <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 flex flex-col items-center justify-between gap-3">
              <div className="h-9 flex items-center justify-center w-full">
                <span className="px-3.5 py-1.5 rounded-full bg-theme-gradient text-white text-xs font-bold shadow-sm shadow-brand-500/25 flex items-center gap-1.5">
                  <span>AI Speech v2.0</span>
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Gradient Badge
              </span>
            </div>

            {/* Element 3: Accent Tag */}
            <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 flex flex-col items-center justify-between gap-3">
              <div className="h-9 flex items-center justify-center w-full">
                <span className="px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 border border-brand-200/80 dark:border-brand-800/80 text-xs font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                  <span>Subtle Accent Tag</span>
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Accent Tag
              </span>
            </div>

            {/* Element 4: Voice Indicator */}
            <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 flex flex-col items-center justify-between gap-3">
              <div className="h-9 flex items-center justify-center w-full">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-brand-200/60 dark:border-brand-800/60 shadow-2xs">
                  <div className="flex items-end gap-0.5 h-3.5">
                    <span className="w-1 h-2.5 bg-brand-500 rounded-full animate-wave-bar" />
                    <span className="w-1 h-4 bg-brand-500 rounded-full animate-wave-bar" style={{ animationDelay: '0.2s' }} />
                    <span className="w-1 h-2 bg-brand-500 rounded-full animate-wave-bar" style={{ animationDelay: '0.4s' }} />
                  </div>
                  <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400">
                    Voice Active
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Voice Indicator
              </span>
            </div>
          </div>
        </div>

        {/* API Base URL */}
        <div className="pt-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Backend API Endpoint (VITE_API_BASE_URL)
          </label>
          <div className="relative mt-1">
            <input
              type="text"
              value={apiBaseUrl}
              onChange={(e) => setApiBaseUrl(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono"
            />
            <Server className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            VoiceForm automatically falls back to client-side persistence if this backend URL is unreachable.
          </p>
        </div>

        {/* Clear Storage */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400">
              Reset Local Storage
            </h4>
            <p className="text-[11px] text-slate-400">
              Removes saved mock submissions and restores factory templates.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClearCache}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Cache</span>
          </button>
        </div>
      </div>

      {/* Save Button Bar */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={handleSaveAll}
          className="px-8 py-3.5 text-xs font-bold rounded-2xl bg-brand-600 hover:bg-brand-500 text-white shadow-xl shadow-brand-500/25 flex items-center gap-2 transition-all active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>Save All Settings</span>
        </button>
      </div>
    </div>
  );
};
