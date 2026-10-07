import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useVoiceStore } from '../store/useVoiceStore';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { Modal } from '../components/common/Modal';
import {
  Mic,
  MicOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Globe2,
  FileDown,
  CheckCircle2,
  Volume2,
  VolumeX,
  Command,
  Zap,
  Play,
  Pause,
  Check,
  ShieldAlert,
  Edit3,
  RotateCcw,
  User,
  Mail,
  MapPin,
  FileText,
  BadgeCheck
} from 'lucide-react';
import type { SupportedLanguage } from '../types';

export const LandingPage: React.FC = () => {
  const { switchDemoRole } = useAuthStore();
  const navigate = useNavigate();

  // Voice synthesis & recognition hooks for interactive demo modals
  const { speak, isSpeaking, cancel } = useSpeechSynthesis();
  const { isRecording, interimTranscript, finalTranscript } = useVoiceStore();
  const { toggleListening } = useSpeechRecognition();

  // --- DYNAMIC HERO STATE: MULTILINGUAL WORD CYCLE ---
  const dynamicWords = [
    { text: 'Speak.', lang: 'English', color: 'from-indigo-600 via-indigo-500 to-purple-600' },
    { text: 'बोलो.', lang: 'हिन्दी', color: 'from-emerald-600 via-teal-500 to-indigo-600' },
    { text: 'Bolo.', lang: 'Hinglish', color: 'from-purple-600 via-pink-500 to-indigo-600' }
  ];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % dynamicWords.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  // --- DYNAMIC HERO STATE: ASYMMETRIC LIVE TYPEWRITER & FORM SIMULATOR ---
  const heroDemoScenarios = [
    {
      id: 'en',
      label: 'EN',
      flag: '🇺🇸',
      badge: '🇺🇸 English AI Voice',
      spokenUtterance: '"My name is John Doe, email is john.doe@ai.dev, and set city to Delhi."',
      fields: [
        { label: 'Full Name', value: 'John Doe', phrase: 'John Doe', icon: User, key: 'name' },
        { label: 'Email Address', value: 'john.doe@ai.dev', phrase: 'john.doe@ai.dev', icon: Mail, key: 'email' },
        { label: 'Current City', value: 'Delhi', phrase: 'Delhi', icon: MapPin, key: 'city' }
      ]
    },
    {
      id: 'hi',
      label: 'हिन्दी',
      flag: '🇮🇳',
      badge: '🇮🇳 हिन्दी Voice (Devanagari)',
      spokenUtterance: '"मेरा नाम राहुल शर्मा है, मोबाइल नंबर 9876543210 और शहर मुंबई दर्ज करो।"',
      fields: [
        { label: 'उम्मीदवार का नाम', value: 'राहुल शर्मा', phrase: 'राहुल शर्मा', icon: User, key: 'name' },
        { label: 'मोबाइल नंबर (सुरक्षित)', value: '+91 98765 43210', phrase: '9876543210', icon: ShieldCheck, key: 'phone', sensitive: true },
        { label: 'स्थान / शहर', value: 'मुंबई', phrase: 'मुंबई', icon: MapPin, key: 'city' }
      ]
    },
    {
      id: 'hinglish',
      label: 'Hinglish',
      flag: '🇮🇳',
      badge: '🇮🇳 Hinglish Natural Voice',
      spokenUtterance: '"Mera name Priya Verma hai, annual income 18 Lakhs aur category Home Loan select karo."',
      fields: [
        { label: 'Applicant Name', value: 'Priya Verma', phrase: 'Priya Verma', icon: User, key: 'name' },
        { label: 'Annual Income', value: '₹ 18,00,000', phrase: '18 Lakhs', icon: FileText, key: 'income' },
        { label: 'Loan Category', value: 'Home Loan (Verified)', phrase: 'Home Loan', icon: BadgeCheck, key: 'category' }
      ]
    }
  ];

  const [activeScenarioIndex, setActiveScenarioIndex] = useState(1); // Default to Hindi as shown in screenshot
  const [typedText, setTypedText] = useState('');
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [isSimulationPaused, setIsSimulationPaused] = useState(false);
  const [isWidgetHovered, setIsWidgetHovered] = useState(false);
  const [hoveredFieldKey, setHoveredFieldKey] = useState<string | null>(null);
  const [replayCount, setReplayCount] = useState(0);
  const [isReplaying, setIsReplaying] = useState(false);

  // Typewriter effect controller (runs on scenario change or replay)
  useEffect(() => {
    if (isSimulationPaused) return;

    const currentScenario = heroDemoScenarios[activeScenarioIndex];
    const fullText = currentScenario.spokenUtterance;
    let charIdx = 0;
    setTypedText('');
    setIsTypingDone(false);
    setHoveredFieldKey(null);

    const typingInterval = setInterval(() => {
      if (charIdx < fullText.length) {
        setTypedText(fullText.slice(0, charIdx + 1));
        charIdx++;
      } else {
        clearInterval(typingInterval);
        setIsTypingDone(true);
      }
    }, 32);

    return () => clearInterval(typingInterval);
  }, [activeScenarioIndex, replayCount, isSimulationPaused]);

  // Smooth auto-cycling every 8-10 seconds when user is not actively interacting/hovering
  useEffect(() => {
    if (!isTypingDone || isSimulationPaused || isWidgetHovered) return;

    const cycleTimeout = setTimeout(() => {
      setActiveScenarioIndex((prev) => (prev + 1) % heroDemoScenarios.length);
    }, 8500);

    return () => clearTimeout(cycleTimeout);
  }, [isTypingDone, isSimulationPaused, isWidgetHovered, activeScenarioIndex]);

  const handleSelectScenario = (idx: number) => {
    setActiveScenarioIndex(idx);
    setReplayCount((c) => c + 1);
  };

  const handleReplayScenario = () => {
    setIsReplaying(true);
    setReplayCount((c) => c + 1);
    setTimeout(() => setIsReplaying(false), 500);
  };

  // Modal states for feature cards
  const [activeModal, setActiveModal] = useState<
    'multilingual' | 'entity' | 'commands' | 'sensitive' | null
  >(null);

  // Multilingual modal state
  const [selectedDemoLang, setSelectedDemoLang] = useState<SupportedLanguage>('hi-IN');
  const [customDemoText, setCustomDemoText] = useState(
    'नमस्ते, मेरा नाम स्नेहा राय है और मैं दिल्ली से हूँ।'
  );

  // Entity modal state
  const [entityInputText, setEntityInputText] = useState('Change my city to Mumbai and set role to Senior Engineer');
  const [entitySimResult, setEntitySimResult] = useState<{
    intent: string;
    field: string;
    extractedVal: string;
    confidence: number;
  }>({
    intent: 'SET_FIELD_MULTIPLE',
    field: 'city, role',
    extractedVal: 'Mumbai, Senior Engineer',
    confidence: 0.98
  });

  // Voice commands simulator state
  const [commandFeedback, setCommandFeedback] = useState<string | null>(null);
  const [simActiveFieldIndex, setSimActiveFieldIndex] = useState<number>(0);
  const simFields = ['Full Name', 'Email Address', 'Phone Number', 'City', 'Annual Income'];

  // Sensitive data demo state
  const [sensitiveFieldDemo, setSensitiveFieldDemo] = useState({
    fieldLabel: 'Aadhaar Card Number',
    maskedValue: 'XXXX-XXXX-8912',
    isEditing: false,
    editValue: 'XXXX-XXXX-8912',
    status: 'pending' as 'pending' | 'confirmed' | 'rejected'
  });

  const handleTryDemo = (role: 'user' | 'admin' = 'user') => {
    switchDemoRole(role);
    navigate('/dashboard');
  };

  const handleLangChange = (lang: SupportedLanguage) => {
    setSelectedDemoLang(lang);
    if (lang === 'hi-IN') {
      setCustomDemoText('नमस्ते, मेरा नाम स्नेहा राय है और मैं दिल्ली से हूँ।');
    } else if (lang === 'hinglish') {
      setCustomDemoText('Mera naam Sneha Rai hai and I live in Delhi.');
    } else {
      setCustomDemoText('Hello, my name is Sneha Rai and I am based in Delhi.');
    }
  };

  const handleSpeakDemo = (text: string, lang: SupportedLanguage) => {
    if (isSpeaking) {
      cancel();
    } else {
      speak(text, { language: lang });
    }
  };

  const handleSimulateEntity = (phrase: string) => {
    setEntityInputText(phrase);
    const clean = phrase.toLowerCase();
    if (clean.includes('city') || clean.includes('delhi') || clean.includes('mumbai') || clean.includes('शहर')) {
      const city = clean.includes('mumbai') ? 'Mumbai' : clean.includes('delhi') ? 'Delhi' : 'Bengaluru';
      setEntitySimResult({
        intent: 'SET_FIELD (City)',
        field: 'city',
        extractedVal: city,
        confidence: 0.99
      });
    } else if (clean.includes('email') || clean.includes('@') || clean.includes('ईमेल')) {
      setEntitySimResult({
        intent: 'SET_FIELD (Email)',
        field: 'email',
        extractedVal: 'sneha.rai@example.com',
        confidence: 0.97
      });
    } else if (clean.includes('phone') || clean.includes('mobile') || clean.includes('फोन') || /\d{10}/.test(clean)) {
      setEntitySimResult({
        intent: 'SET_FIELD_SENSITIVE (Phone)',
        field: 'phone',
        extractedVal: '+91 98765 43210',
        confidence: 0.99
      });
    } else if (clean.includes('name') || clean.includes('naam') || clean.includes('नाम')) {
      setEntitySimResult({
        intent: 'SET_FIELD (Full Name)',
        field: 'fullName',
        extractedVal: 'Sneha Rai',
        confidence: 0.98
      });
    } else if (clean.includes('clear') || clean.includes('hatao') || clean.includes('हटाओ')) {
      setEntitySimResult({
        intent: 'CLEAR_FIELD',
        field: 'targeted_field',
        extractedVal: '[CLEARED / RESET]',
        confidence: 0.99
      });
    } else {
      setEntitySimResult({
        intent: 'NATURAL_UPDATE',
        field: 'general_field',
        extractedVal: phrase,
        confidence: 0.94
      });
    }
  };

  const handleSimulateCommand = (actionType: string) => {
    if (actionType === 'next') {
      setSimActiveFieldIndex((prev) => (prev + 1) % simFields.length);
      setCommandFeedback(`Navigated forward to: "${simFields[(simActiveFieldIndex + 1) % simFields.length]}"`);
    } else if (actionType === 'prev') {
      setSimActiveFieldIndex((prev) => (prev === 0 ? simFields.length - 1 : prev - 1));
      setCommandFeedback(`Navigated backward to: "${simFields[simActiveFieldIndex === 0 ? simFields.length - 1 : simActiveFieldIndex - 1]}"`);
    } else if (actionType === 'review') {
      setCommandFeedback('Opened Instant Form Review modal with all field summaries.');
    } else if (actionType === 'submit') {
      setCommandFeedback('Triggered Form Submission & PDF generation pipeline.');
    } else if (actionType === 'clear') {
      setCommandFeedback(`Cleared value for current field: "${simFields[simActiveFieldIndex]}"`);
    }
  };

  // Render spoken audio text with live bidirectional entity highlighting
  const renderSpokenText = () => {
    const currentScenario = heroDemoScenarios[activeScenarioIndex];
    const fullText = typedText;

    if (!isTypingDone || !hoveredFieldKey) {
      return (
        <span className="transition-all">
          {fullText}
          {!isTypingDone && (
            <span className="inline-block w-1.5 h-3.5 bg-indigo-600 dark:bg-indigo-400 ml-0.5 align-middle animate-pulse" />
          )}
        </span>
      );
    }

    const targetField = currentScenario.fields.find((f) => f.key === hoveredFieldKey);
    if (!targetField || !targetField.phrase) {
      return <span>{fullText}</span>;
    }

    const phrase = targetField.phrase;
    const matchIndex = fullText.indexOf(phrase);
    if (matchIndex === -1) {
      return <span>{fullText}</span>;
    }

    const before = fullText.slice(0, matchIndex);
    const matched = fullText.slice(matchIndex, matchIndex + phrase.length);
    const after = fullText.slice(matchIndex + phrase.length);

    return (
      <span className="leading-relaxed">
        <span className="opacity-60 transition-opacity duration-200">{before}</span>
        <mark className="bg-amber-300 dark:bg-amber-400/35 text-amber-950 dark:text-amber-100 px-1.5 py-0.5 rounded-md font-bold ring-2 ring-amber-400/90 shadow-sm transition-all inline-block scale-105 mx-0.5 animate-pulse">
          {matched}
        </mark>
        <span className="opacity-60 transition-opacity duration-200">{after}</span>
      </span>
    );
  };

  return (
    <div className="relative overflow-hidden">
      {/* Ambient Animated Mesh & Soundwave Background */}
      <div className="absolute top-0 left-0 right-0 h-[600px] overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-indigo-500/15 via-purple-500/15 to-emerald-500/10 blur-[120px] rounded-full animate-mesh-gradient" />
        {/* Subtle Soundwave Vector Contours */}
        <svg
          className="absolute top-20 left-0 w-full opacity-15 dark:opacity-20 stroke-indigo-500"
          height="120"
          viewBox="0 0 1200 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 60 C 150 10, 250 110, 400 60 C 550 10, 650 110, 800 60 C 950 10, 1050 110, 1200 60"
            strokeWidth="2"
            strokeDasharray="6 6"
          />
          <path
            d="M0 60 C 180 90, 280 30, 450 60 C 620 90, 720 30, 900 60 C 1080 90, 1150 30, 1200 60"
            strokeWidth="1.5"
            strokeOpacity="0.6"
          />
        </svg>
      </div>

      {/* Asymmetric Hero Section */}
      <section className="relative pt-10 pb-16 md:pt-16 md:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Headline, Multilingual Cycler, Value Prop, CTA */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Live Audio Pulse Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
              </span>
              <div className="flex items-center gap-0.5 h-3">
                <span className="w-0.5 bg-indigo-500 rounded-full animate-wave-bar" style={{ animationDelay: '0ms' }} />
                <span className="w-0.5 bg-indigo-500 rounded-full animate-wave-bar" style={{ animationDelay: '150ms' }} />
                <span className="w-0.5 bg-indigo-500 rounded-full animate-wave-bar" style={{ animationDelay: '300ms' }} />
                <span className="w-0.5 bg-indigo-500 rounded-full animate-wave-bar" style={{ animationDelay: '450ms' }} />
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                VoiceForm 2.0 • Live Conversational Engine
              </span>
            </div>

            {/* Dynamic Headline with Multilingual Word Switcher */}
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 leading-[1.12]">
              Forms Fill Themselves. <br />
              <span className="text-slate-800 dark:text-slate-200">When You Just </span>
              <span className="inline-block relative">
                <span
                  key={dynamicWords[currentWordIndex].text}
                  className={`bg-gradient-to-r ${dynamicWords[currentWordIndex].color} bg-clip-text text-transparent transition-all duration-300 inline-block`}
                >
                  {dynamicWords[currentWordIndex].text}
                </span>
                <span className="align-middle ml-2 px-2 py-0.5 text-[11px] font-bold rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 shadow-xs">
                  {dynamicWords[currentWordIndex].lang}
                </span>
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-xl">
              Stop typing repetitive inputs. Speak naturally in <strong>English</strong>, <strong>Hindi</strong>, or <strong>Hinglish</strong>. VoiceForm extracts entities, maps complex form schemas, confirms sensitive details, and downloads clean PDFs in seconds.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={() => handleTryDemo('user')}
                className="px-6 py-3.5 text-sm font-bold rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleTryDemo('user')}
                className="px-5 py-3.5 text-sm font-semibold rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 text-indigo-500 fill-indigo-500" />
                <span>Launch Interactive Demo</span>
              </button>
            </div>

            {/* Quick Proof Pills */}
            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Zero Manual Typing</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Multilingual Hindi & English</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Instant PDF Generation</span>
              </div>
            </div>
          </div>

          {/* Right Column: Floating 3D Live Typewriter Form Simulator */}
          <div className="lg:col-span-6 relative">
            {/* Ambient Backlight Behind Card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/20 rounded-3xl blur-xl opacity-70 -z-10" />

            <div
              onMouseEnter={() => setIsWidgetHovered(true)}
              onMouseLeave={() => setIsWidgetHovered(false)}
              className="relative rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 sm:p-6 transition-all animate-float-card"
            >
              {/* Card Header with Scenario Tabs, Replay Button & Live Waveform */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/25">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block leading-tight">
                        Live Voice Extraction
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      Simulated Voice Stream
                    </span>
                  </div>
                </div>

                {/* Scenario Selector Tabs & Controls */}
                <div className="flex items-center gap-1.5">
                  {/* Language Tabs (EN / हिन्दी / Hinglish) */}
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                    {heroDemoScenarios.map((sc, idx) => (
                      <button
                        key={sc.id}
                        type="button"
                        onClick={() => handleSelectScenario(idx)}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1 ${
                          activeScenarioIndex === idx
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-500/20'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                        }`}
                      >
                        <span className="text-xs">{sc.flag}</span>
                        <span>{sc.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Replay Button */}
                  <button
                    type="button"
                    onClick={handleReplayScenario}
                    title="Replay Voice Simulation"
                    className="p-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-1 text-xs font-semibold cursor-pointer active:scale-95 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                  >
                    <RotateCcw className={`w-3.5 h-3.5 transition-transform duration-500 ${isReplaying ? '-rotate-180 text-indigo-600' : ''}`} />
                    <span className="hidden sm:inline text-[11px]">Replay</span>
                  </button>

                  {/* Pause / Resume Auto-Loop */}
                  <button
                    type="button"
                    onClick={() => setIsSimulationPaused((p) => !p)}
                    title={isSimulationPaused ? 'Resume Auto Cycle' : 'Pause Auto Cycle'}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    {isSimulationPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Dynamic Spoken Voice Bubble with Typewriter Effect & Live Entity Highlighting */}
              <div className="my-4 p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                    <span className="text-[10px] uppercase font-bold text-indigo-700 dark:text-indigo-300 tracking-wider">
                      User Spoken Audio
                    </span>
                    {hoveredFieldKey && isTypingDone && (
                      <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-800/80 animate-in fade-in duration-200">
                        Mapped Entity Highlighted
                      </span>
                    )}
                  </div>
                  {/* Waveform visualizer */}
                  <div className="flex items-center gap-0.5 h-3.5">
                    <span className={`w-0.5 bg-indigo-600 rounded-full ${!isTypingDone ? 'animate-wave-bar' : 'h-1.5 opacity-40'}`} style={{ animationDelay: '0ms' }} />
                    <span className={`w-0.5 bg-indigo-600 rounded-full ${!isTypingDone ? 'animate-wave-bar' : 'h-2.5 opacity-60'}`} style={{ animationDelay: '100ms' }} />
                    <span className={`w-0.5 bg-indigo-600 rounded-full ${!isTypingDone ? 'animate-wave-bar' : 'h-3.5 opacity-80'}`} style={{ animationDelay: '200ms' }} />
                    <span className={`w-0.5 bg-indigo-600 rounded-full ${!isTypingDone ? 'animate-wave-bar' : 'h-2 opacity-50'}`} style={{ animationDelay: '300ms' }} />
                    <span className={`w-0.5 bg-indigo-600 rounded-full ${!isTypingDone ? 'animate-wave-bar' : 'h-1 opacity-30'}`} style={{ animationDelay: '400ms' }} />
                  </div>
                </div>

                <div className="text-xs font-medium text-slate-800 dark:text-slate-200 min-h-[38px] leading-relaxed select-none">
                  {renderSpokenText()}
                </div>
              </div>

              {/* AI Processing Status Indicator */}
              <div className="flex items-center justify-between px-1 mb-3 text-[11px]">
                <span className="flex items-center gap-1.5 font-semibold text-purple-600 dark:text-purple-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {isTypingDone
                      ? 'AI Mapping Complete • Hover row to highlight speech'
                      : 'Listening & Extracting Entities...'}
                  </span>
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  {heroDemoScenarios[activeScenarioIndex].badge}
                </span>
              </div>

              {/* Dynamic Live Form Fields (Interactive on Hover & Click) */}
              <div className="space-y-2.5">
                {heroDemoScenarios[activeScenarioIndex].fields.map((field) => {
                  const Icon = field.icon;
                  const isHovered = hoveredFieldKey === field.key;
                  return (
                    <div
                      key={field.key}
                      onMouseEnter={() => setHoveredFieldKey(field.key)}
                      onMouseLeave={() => setHoveredFieldKey(null)}
                      onClick={() => setHoveredFieldKey((prev) => (prev === field.key ? null : field.key))}
                      className={`p-3 rounded-2xl border transition-all duration-200 flex items-center justify-between cursor-pointer ${
                        isHovered && isTypingDone
                          ? 'bg-indigo-50/80 dark:bg-indigo-950/70 border-indigo-400 dark:border-indigo-500 shadow-md ring-2 ring-indigo-500/25 scale-[1.01]'
                          : isTypingDone
                          ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700/80 shadow-xs'
                          : 'bg-slate-50/60 dark:bg-slate-950/40 border-slate-200/70 dark:border-slate-800/70'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                            isHovered && isTypingDone
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block leading-none">
                            {field.label}
                          </label>
                          <span
                            className={`text-xs font-semibold block mt-0.5 transition-all ${
                              isTypingDone
                                ? 'text-slate-900 dark:text-slate-100 font-mono'
                                : 'text-slate-400 dark:text-slate-600'
                            }`}
                          >
                            {isTypingDone ? field.value : 'Listening for value...'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isHovered && isTypingDone && (
                          <span className="hidden sm:inline-block text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 px-2 py-0.5 rounded-md animate-in fade-in duration-150">
                            From: "{field.phrase}"
                          </span>
                        )}
                        {isTypingDone && (
                          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800 shrink-0">
                            <Check className="w-3 h-3 stroke-[2.5]" />
                            <span>Extracted</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Card Footer / Tactile Button Pill CTA */}
              <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Ready to test with real microphone?
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/templates')}
                  className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-xs font-bold shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
                >
                  <span>Open Form Templates</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Feature Cards Grid (Interactive & Clickable) */}
      <section className="py-16 bg-slate-100/50 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
              Built for Fast, Conversational Automation
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Click any feature card below to test live demos, cheat sheets, or launch voice wizards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1: Multilingual Speech Recognition */}
            <div
              onClick={() => setActiveModal('multilingual')}
              className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-400 dark:hover:border-indigo-600 hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <Globe2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Multilingual Speech Recognition
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Native support for English, Hindi, and Hinglish. Seamlessly switch accents and dialects on the fly.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span className="inline-flex items-center gap-1 group-hover:underline">
                  Test Accents & Voice Input
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 2: Smart Entity Extraction */}
            <div
              onClick={() => setActiveModal('entity')}
              className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-400 dark:hover:border-purple-600 hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  Smart Entity Extraction
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Understands natural language edits such as "change my city to Delhi" and assigns values to the exact schema field.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-purple-600 dark:text-purple-400">
                <span className="inline-flex items-center gap-1 group-hover:underline">
                  Open Interactive Sandbox
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 3: Voice Navigation Commands */}
            <div
              onClick={() => setActiveModal('commands')}
              className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-400 dark:hover:border-emerald-600 hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <Command className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Voice Navigation Commands
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Control the flow hands-free: "Next field", "Previous field", "Clear email", "Review my form", and "Submit form".
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="inline-flex items-center gap-1 group-hover:underline">
                  View Commands & Test Flow
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 4: Sensitive Data Confirmations */}
            <div
              onClick={() => {
                setSensitiveFieldDemo({
                  fieldLabel: 'Aadhaar Card Number',
                  maskedValue: 'XXXX-XXXX-8912',
                  isEditing: false,
                  editValue: 'XXXX-XXXX-8912',
                  status: 'pending'
                });
                setActiveModal('sensitive');
              }}
              className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-xl hover:shadow-amber-500/10 hover:border-amber-400 dark:hover:border-amber-600 hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  Sensitive Data Confirmations
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Protects confidential fields like phone numbers, emails, and DOB with a dedicated confirmation popup before saving.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400">
                <span className="inline-flex items-center gap-1 group-hover:underline">
                  Preview Security Confirmation
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 5: Conversational Audio Wizard */}
            <div
              onClick={() => navigate('/conversational')}
              className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-xl hover:shadow-rose-500/10 hover:border-rose-400 dark:hover:border-rose-600 hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-rose-600 group-hover:text-white transition-all">
                  <Volume2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                  Conversational Audio Wizard
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Mobile-first step-by-step interview. VoiceForm speaks each question aloud and accepts answers with dynamic branching.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-rose-600 dark:text-rose-400">
                <span className="inline-flex items-center gap-1 group-hover:underline">
                  Launch Audio Wizard →
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 6: Instant PDF Export & History */}
            <div
              onClick={() => navigate('/my-forms')}
              className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-400 dark:hover:border-blue-600 hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <FileDown className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Instant PDF Export & History
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Download beautifully formatted PDF reports for any submission. Manage, duplicate, and filter drafts with ease.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                <span className="inline-flex items-center gap-1 group-hover:underline">
                  Open Submission History →
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Distinctive Voice-Themed CTA Banner Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        {/* Outer Asymmetric Shimmer Border Container */}
        <div className="rounded-[36px] p-1 bg-gradient-to-r from-indigo-500/40 via-purple-500/50 to-pink-500/40 shadow-2xl relative overflow-hidden">
          {/* Inner Dark Glassmorphic Card */}
          <div className="rounded-[32px] bg-gradient-to-br from-slate-900 via-indigo-950/90 to-slate-900 text-white p-8 sm:p-14 relative overflow-hidden border border-white/10 backdrop-blur-xl">
            {/* Background Floating Blurred Glowing Orbs */}
            <div className="w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl absolute -top-20 -left-20 animate-pulse-soft pointer-events-none" />
            <div className="w-96 h-96 bg-purple-500/20 rounded-full blur-3xl absolute -bottom-28 -right-28 animate-pulse-soft pointer-events-none" style={{ animationDelay: '2s' }} />

            {/* Background Dot Matrix Pattern Overlay */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}
            />

            {/* Background Soundwave Vector SVG */}
            <svg
              className="absolute bottom-0 left-0 right-0 w-full h-32 opacity-15 stroke-indigo-400 pointer-events-none"
              viewBox="0 0 1200 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 60 Q 150 10 300 60 T 600 60 T 900 60 T 1200 60"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <path
                d="M0 60 Q 200 110 400 60 T 800 60 T 1200 60"
                strokeWidth="1.5"
                strokeOpacity="0.7"
              />
            </svg>

            {/* Card Content */}
            <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
              {/* Visual Anchor Voice Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-indigo-200 text-xs font-semibold mb-6 shadow-inner animate-pulse-soft">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <Mic className="w-3.5 h-3.5 text-indigo-300" />
                <span>VoiceForm 2.0 • Real-time Multilingual Engine</span>
              </div>

              {/* Headline */}
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.15] text-white">
                Ready to experience the future of <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                  hands-free form filling?
                </span>
              </h2>

              {/* Subtext */}
              <p className="mt-4 text-sm sm:text-lg text-indigo-100/90 max-w-2xl font-normal leading-relaxed">
                Transform tedious paperwork into effortless conversations in English, Hindi, and Hinglish. Zero typing required.
              </p>

              {/* Social Proof & Trust Badges */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-indigo-200/90 font-medium">
                <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                  <span className="text-amber-400">★</span>
                  <span>4.9/5 User Rating</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                  <Zap className="w-3.5 h-3.5 text-indigo-400" />
                  <span>10x Faster Completion</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Zero Data Leaks</span>
                </div>
              </div>

              {/* Action Buttons with Distinct Hierarchy */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                {/* Primary CTA */}
                <button
                  type="button"
                  onClick={() => handleTryDemo('user')}
                  className="px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-indigo-600 font-extrabold text-sm shadow-xl shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 text-indigo-600 fill-indigo-600" />
                  <span>Try Live Interactive Demo</span>
                </button>

                {/* Secondary CTA */}
                <Link
                  to="/templates"
                  className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 backdrop-blur-md shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <span>Explore 45+ Templates</span>
                  <ArrowRight className="w-4 h-4 text-indigo-300" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* MODAL 1: MULTILINGUAL SPEECH RECOGNITION STUDIO */}
      {/* ========================================================================= */}
      <Modal
        isOpen={activeModal === 'multilingual'}
        onClose={() => setActiveModal(null)}
        title="Multilingual Speech & Synthesis Studio"
        maxWidth="lg"
      >
        <div className="space-y-5">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            VoiceForm features full bi-directional recognition and synthesis for English, Hindi, and Hinglish. Test switching accents and listening to natural voice outputs below.
          </p>

          {/* Language Selector Pills */}
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
            <button
              type="button"
              onClick={() => handleLangChange('en-US')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                selectedDemoLang === 'en-US'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              🇺🇸 English (en-US)
            </button>
            <button
              type="button"
              onClick={() => handleLangChange('hi-IN')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                selectedDemoLang === 'hi-IN'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              🇮🇳 हिन्दी (hi-IN)
            </button>
            <button
              type="button"
              onClick={() => handleLangChange('hinglish')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                selectedDemoLang === 'hinglish'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              🇮🇳 Hinglish (en-IN)
            </button>
          </div>

          {/* Test Sample Phrases */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Sample Voice Phrases
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              {selectedDemoLang === 'hi-IN' && (
                <>
                  <button
                    type="button"
                    onClick={() => setCustomDemoText('मेरा नाम राहुल शर्मा है और मोबाइल नंबर 9876543210 है।')}
                    className="text-left p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:border-indigo-500 text-xs text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    "मेरा नाम राहुल शर्मा है और मोबाइल नंबर 9876543210 है।"
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomDemoText('कृपया अगला फ़ील्ड खोलें और शहर दिल्ली सेट करें।')}
                    className="text-left p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:border-indigo-500 text-xs text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    "कृपया अगला फ़ील्ड खोलें और शहर दिल्ली सेट करें।"
                  </button>
                </>
              )}
              {selectedDemoLang === 'hinglish' && (
                <>
                  <button
                    type="button"
                    onClick={() => setCustomDemoText('Mera annual income 12 lakhs hai and city Bengaluru set kardo.')}
                    className="text-left p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:border-indigo-500 text-xs text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    "Mera annual income 12 lakhs hai and city Bengaluru set kardo."
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomDemoText('Email address sneha.rai@company.com fill karo aur agla field dikhao.')}
                    className="text-left p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:border-indigo-500 text-xs text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    "Email address sneha.rai@company.com fill karo aur agla field dikhao."
                  </button>
                </>
              )}
              {selectedDemoLang === 'en-US' && (
                <>
                  <button
                    type="button"
                    onClick={() => setCustomDemoText('Set my primary occupation to Software Architect and city to New York.')}
                    className="text-left p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:border-indigo-500 text-xs text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    "Set my primary occupation to Software Architect and city to New York."
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomDemoText('Next field please, and clear the existing phone number.')}
                    className="text-left p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:border-indigo-500 text-xs text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    "Next field please, and clear the existing phone number."
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Text Area to Speak / Listen */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Speech Synthesis & Recognition Input
            </label>
            <textarea
              rows={3}
              value={customDemoText}
              onChange={(e) => setCustomDemoText(e.target.value)}
              className="mt-1 w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              placeholder="Type or click a phrase above to test voice..."
            />
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSpeakDemo(customDemoText, selectedDemoLang)}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>Stop Voice (TTS)</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Play Audio (TTS)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={toggleListening}
                className={`px-4 py-2 text-xs font-bold rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                  isRecording
                    ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 text-rose-600 animate-pulse'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                }`}
              >
                {isRecording ? <Mic className="w-3.5 h-3.5 text-rose-600" /> : <MicOff className="w-3.5 h-3.5" />}
                <span>{isRecording ? 'Listening (Speak now)...' : 'Test Microphone'}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveModal(null);
                navigate('/templates');
              }}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:opacity-90 transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Try with Live Form</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {(interimTranscript || finalTranscript) && (
            <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 text-xs">
              <span className="font-bold text-indigo-700 dark:text-indigo-300">Live Voice Recognized: </span>
              <span className="text-slate-800 dark:text-slate-200">{finalTranscript || interimTranscript}</span>
            </div>
          )}
        </div>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 2: SMART ENTITY EXTRACTION SANDBOX */}
      {/* ========================================================================= */}
      <Modal
        isOpen={activeModal === 'entity'}
        onClose={() => setActiveModal(null)}
        title="Smart Entity Extraction Playground"
        maxWidth="lg"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            VoiceForm's NLP parser understands conversational intents, natural language updates, and multi-field sentences in real-time.
          </p>

          {/* Quick Phrases */}
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => handleSimulateEntity('Change my city to Mumbai')}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-950/60 text-slate-700 dark:text-slate-300 hover:text-purple-600 transition-colors cursor-pointer"
            >
              "Change my city to Mumbai"
            </button>
            <button
              type="button"
              onClick={() => handleSimulateEntity('My email is sneha.rai@example.com')}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-950/60 text-slate-700 dark:text-slate-300 hover:text-purple-600 transition-colors cursor-pointer"
            >
              "My email is sneha.rai@example.com"
            </button>
            <button
              type="button"
              onClick={() => handleSimulateEntity('मेरा नाम राहुल शर्मा है')}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-950/60 text-slate-700 dark:text-slate-300 hover:text-purple-600 transition-colors cursor-pointer"
            >
              "मेरा नाम राहुल शर्मा है"
            </button>
            <button
              type="button"
              onClick={() => handleSimulateEntity('Phone number 9876543210 fill kardo')}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-950/60 text-slate-700 dark:text-slate-300 hover:text-purple-600 transition-colors cursor-pointer"
            >
              "Phone number 9876543210 fill kardo"
            </button>
            <button
              type="button"
              onClick={() => handleSimulateEntity('Clear email field')}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-950/60 text-slate-700 dark:text-slate-300 hover:text-purple-600 transition-colors cursor-pointer"
            >
              "Clear email field"
            </button>
          </div>

          {/* Live Input Field */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Natural Language Sentence
            </label>
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                value={entityInputText}
                onChange={(e) => handleSimulateEntity(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                placeholder="Type or click any spoken phrase..."
              />
            </div>
          </div>

          {/* Extraction Pipeline Breakdown Card */}
          <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-800/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                Parsed Schema Mapping
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-200/80 dark:bg-purple-900/80 text-purple-800 dark:text-purple-200 font-bold">
                Confidence: {(entitySimResult.confidence * 100).toFixed(0)}%
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs bg-white dark:bg-slate-900 p-3 rounded-xl border border-purple-100 dark:border-purple-900/40">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Classified Intent</span>
                <p className="font-semibold text-purple-700 dark:text-purple-300 mt-0.5 truncate">
                  {entitySimResult.intent}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Target Field</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 truncate">
                  {entitySimResult.field}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Extracted Value</span>
                <p className="font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 truncate">
                  {entitySimResult.extractedVal}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setActiveModal(null);
                navigate('/templates');
              }}
              className="w-full py-2.5 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Try in Real Form Templates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 3: VOICE NAVIGATION COMMANDS CHEAT SHEET */}
      {/* ========================================================================= */}
      <Modal
        isOpen={activeModal === 'commands'}
        onClose={() => setActiveModal(null)}
        title="Voice Navigation Commands & Cheat Sheet"
        maxWidth="lg"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Control the entire form filling experience completely hands-free. Click any command below to test how VoiceForm navigates between inputs.
          </p>

          {/* Interactive Form Field Visualizer */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
              Active Form Cursor Simulator (Currently on field {simActiveFieldIndex + 1} of {simFields.length})
            </span>
            <div className="flex flex-wrap gap-2">
              {simFields.map((field, idx) => (
                <div
                  key={field}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    idx === simActiveFieldIndex
                      ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-300 dark:ring-emerald-800'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {field}
                </div>
              ))}
            </div>
            {commandFeedback && (
              <div className="mt-3 text-xs text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>{commandFeedback}</span>
              </div>
            )}
          </div>

          {/* Command Categories Table */}
          <div className="space-y-2.5">
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                  Navigation Commands
                </span>
                <span className="text-[10px] text-slate-400">Click to execute</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSimulateCommand('next')}
                  className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 font-medium cursor-pointer"
                >
                  "Next field" / "अगला फ़ील्ड" / "Aage chalo"
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulateCommand('prev')}
                  className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 font-medium cursor-pointer"
                >
                  "Previous field" / "पिछला" / "Pichla field"
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />
                  Edit & Reset Commands
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSimulateCommand('clear')}
                  className="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 font-medium cursor-pointer"
                >
                  "Clear [field]" / "हटाओ" / "Saaf karo"
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  Review & Submission Commands
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSimulateCommand('review')}
                  className="text-xs px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 font-medium cursor-pointer"
                >
                  "Review my form" / "फॉर्म चेक करो"
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulateCommand('submit')}
                  className="text-xs px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 font-medium cursor-pointer"
                >
                  "Submit form" / "फॉर्म जमा करो"
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setActiveModal(null);
                navigate('/conversational');
              }}
              className="w-full py-2.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Launch Conversational Form</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 4: SENSITIVE DATA CONFIRMATION DEMO */}
      {/* ========================================================================= */}
      <Modal
        isOpen={activeModal === 'sensitive'}
        onClose={() => setActiveModal(null)}
        title="Sensitive Data Interceptor Demo"
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs">
            <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Security Protection Active</p>
              <p className="text-amber-700 dark:text-amber-300/90 mt-0.5">
                Whenever spoken audio contains sensitive data (e.g., Aadhaar, PAN, Phone, DOB, Salary), VoiceForm intercepts the value and requires explicit user confirmation before populating the form.
              </p>
            </div>
          </div>

          {/* Interactive Simulation Dialog Card */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200 dark:border-slate-700/60 space-y-3">
            <div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Intercepted Field
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {sensitiveFieldDemo.fieldLabel}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Extracted Voice Value
                </span>
                {!sensitiveFieldDemo.isEditing && sensitiveFieldDemo.status === 'pending' && (
                  <button
                    type="button"
                    onClick={() => setSensitiveFieldDemo((prev) => ({ ...prev, isEditing: true }))}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit before saving</span>
                  </button>
                )}
              </div>

              {sensitiveFieldDemo.isEditing ? (
                <div className="mt-1 flex gap-2">
                  <input
                    type="text"
                    value={sensitiveFieldDemo.editValue}
                    onChange={(e) =>
                      setSensitiveFieldDemo((prev) => ({ ...prev, editValue: e.target.value }))
                    }
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setSensitiveFieldDemo((prev) => ({
                        ...prev,
                        maskedValue: prev.editValue,
                        isEditing: false
                      }))
                    }
                    className="px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-600 text-white cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="mt-1 p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                  {sensitiveFieldDemo.maskedValue}
                </div>
              )}
            </div>

            {sensitiveFieldDemo.status === 'confirmed' && (
              <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Value confirmed & safely written to form!</span>
              </div>
            )}

            {sensitiveFieldDemo.status === 'rejected' && (
              <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                <span>Value rejected. Form field remains untouched.</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                setSensitiveFieldDemo((prev) => ({ ...prev, status: 'rejected' }))
              }
              className="flex-1 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              Reject / Discard
            </button>
            <button
              type="button"
              onClick={() =>
                setSensitiveFieldDemo((prev) => ({ ...prev, status: 'confirmed' }))
              }
              className="flex-1 py-2 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-all cursor-pointer"
            >
              Confirm & Apply
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
