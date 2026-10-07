import { useState, useCallback, useEffect, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useVoiceStore } from '../store/useVoiceStore';
import type { SupportedLanguage } from '../types';

export interface SpeakOptions {
  language?: SupportedLanguage;
  rate?: number;
  pitch?: number;
  onEnd?: () => void;
}

export function useSpeechSynthesis() {
  const { user } = useAuthStore();
  const { language: activeLanguage } = useVoiceStore();
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const rate = user?.preferences?.speechRate ?? 1.0;
  const pitch = user?.preferences?.speechPitch ?? 1.0;
  const autoRead = user?.preferences?.autoReadQuestions ?? true;

  // Load available browser voices
  useEffect(() => {
    const updateVoices = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const available = window.speechSynthesis.getVoices();
        setVoices(available);
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  const cancel = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const speak = useCallback(
    (text: string, optionsOrOnEnd?: SpeakOptions | (() => void)) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        console.warn('SpeechSynthesis is not supported in this environment');
        return;
      }

      window.speechSynthesis.cancel();

      if (!text || !text.trim()) return;

      const options: SpeakOptions = typeof optionsOrOnEnd === 'function'
        ? { onEnd: optionsOrOnEnd }
        : (optionsOrOnEnd || {});

      const targetLang = options.language || activeLanguage || user?.preferences?.defaultLanguage || 'en-US';
      const utterance = new SpeechSynthesisUtterance(text.trim());
      utterance.rate = options.rate ?? rate;
      utterance.pitch = options.pitch ?? pitch;

      // 1. Explicitly set utterance.lang for BCP-47 matching
      if (targetLang === 'hi-IN') {
        utterance.lang = 'hi-IN';
        // Look for Hindi voices in browser (e.g. Google हिन्दी, Microsoft Kalpana/Hemant, etc.)
        const hiVoice = voices.find((v) =>
          v.lang === 'hi-IN' || v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi') || v.name.includes('हिन्दी')
        );
        if (hiVoice) {
          utterance.voice = hiVoice;
        } else {
          // Fallback to Indian English voice if dedicated Hindi voice isn't installed
          const inVoice = voices.find((v) => v.lang === 'en-IN' || v.lang.includes('IN'));
          if (inVoice) utterance.voice = inVoice;
        }
      } else if (targetLang === 'hinglish') {
        utterance.lang = 'en-IN';
        const inVoice = voices.find((v) =>
          v.lang === 'en-IN' || v.lang.includes('IN') || v.name.toLowerCase().includes('india') || v.name.toLowerCase().includes('hindi')
        );
        if (inVoice) utterance.voice = inVoice;
      } else {
        utterance.lang = 'en-US';
        const enVoice = voices.find((v) =>
          (v.lang === 'en-US' || v.lang.startsWith('en')) &&
          (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Online'))
        ) || voices.find((v) => v.lang.startsWith('en'));
        if (enVoice) utterance.voice = enVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        if (options.onEnd) options.onEnd();
      };

      utterance.onerror = (e) => {
        console.warn('SpeechSynthesis error:', e);
        setIsSpeaking(false);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [rate, pitch, activeLanguage, user?.preferences?.defaultLanguage, voices]
  );

  return {
    isSpeaking,
    autoRead,
    voices,
    speak,
    cancel
  };
}

