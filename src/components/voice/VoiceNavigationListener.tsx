import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAccessibilityStore } from '../../store/useAccessibilityStore';
import { useThemeStore } from '../../store/useThemeStore';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import { Radio, X } from 'lucide-react';

export const VoiceNavigationListener: React.FC = () => {
  const { voiceNavigationEnabled, setVoiceNavigationEnabled, setLastSpokenNavigationPrompt } =
    useAccessibilityStore();
  const { addToast } = useThemeStore();
  const { speak } = useSpeechSynthesis();
  const navigate = useNavigate();
  const location = useLocation();

  const [lastRecognizedPhrase, setLastRecognizedPhrase] = useState<string>('');
  const recognitionRef = useRef<any>(null);
  const isEnabledRef = useRef(voiceNavigationEnabled);

  useEffect(() => {
    isEnabledRef.current = voiceNavigationEnabled;
  }, [voiceNavigationEnabled]);

  useEffect(() => {
    if (!voiceNavigationEnabled) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
        recognitionRef.current = null;
      }
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      addToast({
        type: 'warning',
        title: 'Voice Navigation',
        message: 'Web Speech API is not supported in this browser.'
      });
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        // Active
      };

      recognition.onresult = (event: any) => {
        const lastIndex = event.results.length - 1;
        const rawTranscript = event.results[lastIndex][0].transcript.trim();
        const transcript = rawTranscript.toLowerCase();

        setLastRecognizedPhrase(rawTranscript);
        setLastSpokenNavigationPrompt(rawTranscript);

        handleNavigationCommand(transcript);
      };

      recognition.onerror = (event: any) => {
        if (event.error !== 'no-speech') {
          console.warn('[VoiceNavigation] error:', event.error);
        }
      };

      recognition.onend = () => {
        if (isEnabledRef.current) {
          try {
            recognition.start();
          } catch (e) {
            // will restart on user action
          }
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      console.error('[VoiceNavigation] Failed to start speech recognition', err);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
        recognitionRef.current = null;
      }
    };
  }, [voiceNavigationEnabled]);

  const handleNavigationCommand = (clean: string) => {
    // 1. Dashboard
    if (
      clean.includes('dashboard') ||
      clean.includes('डैशबोर्ड') ||
      clean.includes('home page') ||
      clean.includes('main page')
    ) {
      executeNav('/dashboard', 'Navigating to Dashboard', 'डैशबोर्ड खोल रहे हैं');
      return;
    }

    // 2. Templates
    if (
      clean.includes('template') ||
      clean.includes('टेम्पलेट') ||
      clean.includes('browse forms') ||
      clean.includes('all templates')
    ) {
      executeNav('/templates', 'Opening Templates Gallery', 'टेम्पलेट्स खोल रहे हैं');
      return;
    }

    // 3. Form Builder
    if (
      clean.includes('form builder') ||
      clean.includes('builder') ||
      clean.includes('create form') ||
      clean.includes('new template') ||
      clean.includes('बिल्डर') ||
      clean.includes('नया फॉर्म')
    ) {
      executeNav('/builder', 'Opening Form Builder', 'फॉर्म बिल्डर खोल रहे हैं');
      return;
    }

    // 4. My Forms / Submissions
    if (
      clean.includes('my form') ||
      clean.includes('my submission') ||
      clean.includes('saved form') ||
      clean.includes('मेरे फॉर्म') ||
      clean.includes('सबमिशन')
    ) {
      executeNav('/my-forms', 'Opening My Forms', 'आपके फॉर्म्स खोल रहे हैं');
      return;
    }

    // 5. Conversational Mode
    if (
      clean.includes('conversational') ||
      clean.includes('voice wizard') ||
      clean.includes('voice chat') ||
      clean.includes('बातचीत') ||
      clean.includes('वॉइस मोड')
    ) {
      executeNav('/conversational', 'Opening Conversational Voice Wizard', 'कन्वर्सेशनल मोड चालू कर रहे हैं');
      return;
    }

    // 6. Voice Commands Guide
    if (
      clean.includes('guide') ||
      clean.includes('voice commands') ||
      clean.includes('help command') ||
      clean.includes('गाइड') ||
      clean.includes('कमांड')
    ) {
      executeNav('/voice-guide', 'Opening Voice Commands Guide', 'वॉइस कमांड गाइड खोल रहे हैं');
      return;
    }

    // 7. Accessibility
    if (
      clean.includes('accessibility') ||
      clean.includes('a11y') ||
      clean.includes('universal access') ||
      clean.includes('एक्सेसिबिलिटी')
    ) {
      executeNav('/accessibility', 'Opening Accessibility Hub', 'एक्सेसिबिलिटी सेटिंग्स खोल रहे हैं');
      return;
    }

    // 8. Settings / Profile
    if (
      clean.includes('setting') ||
      clean.includes('profile') ||
      clean.includes('preferences') ||
      clean.includes('सेटिंग')
    ) {
      executeNav('/settings', 'Opening Settings & Profile', 'सेटिंग्स खोल रहे हैं');
      return;
    }

    // 9. Scroll Navigation Commands
    if (
      clean.includes('scroll down') ||
      clean.includes('go down') ||
      clean.includes('page down') ||
      clean.includes('नीचे')
    ) {
      window.scrollBy({ top: 450, behavior: 'smooth' });
      speak('Scrolling down', { language: 'en-US' });
      return;
    }

    if (
      clean.includes('scroll up') ||
      clean.includes('go up') ||
      clean.includes('page up') ||
      clean.includes('ऊपर')
    ) {
      window.scrollBy({ top: -450, behavior: 'smooth' });
      speak('Scrolling up', { language: 'en-US' });
      return;
    }

    if (clean.includes('top of page') || clean.includes('scroll top')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      speak('Scrolled to top', { language: 'en-US' });
      return;
    }

    if (clean.includes('go back') || clean.includes('previous page') || clean.includes('पीछे जाओ')) {
      window.history.back();
      speak('Going back', { language: 'en-US' });
      return;
    }
  };

  const executeNav = (path: string, speechAnnouncement: string, _hindiAlt: string) => {
    if (location.pathname === path) {
      speak(`Already on ${path.replace('/', '')}`, { language: 'en-US' });
      return;
    }
    speak(speechAnnouncement, { language: 'en-US' });
    navigate(path);
    addToast({
      type: 'info',
      title: 'Voice Navigation Activated',
      message: speechAnnouncement
    });
  };

  if (!voiceNavigationEnabled) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-3 p-3 rounded-2xl bg-slate-900/95 dark:bg-slate-950/95 text-white border border-brand-500/40 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-3 duration-200"
    >
      {/* Pulse Beacon */}
      <div className="relative flex h-3.5 w-3.5 items-center justify-center">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-500 shadow-[0_0_8px_rgba(99,102,241,0.9)]" />
      </div>

      <div className="text-xs space-y-0.5">
        <div className="flex items-center gap-1.5 font-bold text-slate-100">
          <Radio className="w-3.5 h-3.5 text-brand-400 animate-pulse" />
          <span>Voice-Only Navigation Live</span>
        </div>
        <div className="text-[11px] text-slate-400 max-w-[200px] truncate">
          {lastRecognizedPhrase ? `Heard: "${lastRecognizedPhrase}"` : 'Say "Go to templates", "Open dashboard"'}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setVoiceNavigationEnabled(false)}
        title="Disable Voice Navigation"
        className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1 cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
