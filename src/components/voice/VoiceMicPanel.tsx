import React, { useState, useEffect, useRef } from 'react';
import { useVoiceStore } from '../../store/useVoiceStore';
import { useFormStore } from '../../store/useFormStore';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useVoiceCommandParser } from '../../hooks/useVoiceCommandParser';
import { useTranslation } from '../../utils/translations';
import { AudioWaveform } from '../common/AudioWaveform';
import type { SupportedLanguage } from '../../types';
import {
  Mic,
  MicOff,
  Globe,
  HelpCircle,
  AlertCircle,
  ChevronDown,
  Target
} from 'lucide-react';

interface VoiceMicPanelProps {
  onSubmitForm?: () => void;
}

export const VoiceMicPanel: React.FC<VoiceMicPanelProps> = () => {
  const {
    isRecording,
    language,
    interimTranscript,
    finalTranscript,
    errorMessage,
    volumeLevel,
    setLanguage,
    resetTranscripts,
    setErrorMessage
  } = useVoiceStore();

  const { activeFieldKey, activeTemplate } = useFormStore();
  const { t } = useTranslation();
  const { toggleListening, startListening } = useSpeechRecognition();
  const { parseCommand, activeFieldKeyRef } = useVoiceCommandParser();

  const [showCommandsHelp, setShowCommandsHelp] = useState(false);
  const lastProcessedTranscriptRef = useRef<string>('');

  // Keep activeFieldKeyRef perpetually fresh and clear deduplication when user switches field
  useEffect(() => {
    activeFieldKeyRef.current = activeFieldKey;
    lastProcessedTranscriptRef.current = '';
  }, [activeFieldKey, activeFieldKeyRef]);

  // When a final transcript is captured by Web Speech API, immediately auto-fill active field!
  useEffect(() => {
    if (finalTranscript && finalTranscript !== lastProcessedTranscriptRef.current) {
      lastProcessedTranscriptRef.current = finalTranscript;
      // Pass the latest activeFieldKey explicitly to guarantee zero stale closure
      parseCommand(finalTranscript, activeFieldKeyRef.current || activeFieldKey || undefined);

      // Keep transcript displayed briefly so user sees what was recognized, then reset
      const timeout = setTimeout(() => {
        resetTranscripts();
        lastProcessedTranscriptRef.current = '';
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [finalTranscript, parseCommand, resetTranscripts, activeFieldKey, activeFieldKeyRef]);

  // Find active field label for visual feedback
  const activeField = activeTemplate?.fields.find((f) => f.key === activeFieldKey);
  const activeFieldLabel = activeField?.label || (activeTemplate?.fields[0]?.label ?? 'Active Field');

  const sampleVoiceValues = language === 'hi-IN'
    ? ['राहुल शर्मा', 'rahul@example.com', '9876543210', '10 फरवरी 2005', 'नई दिल्ली']
    : language === 'hinglish'
    ? ['Rahul Sharma', 'rahul@example.com', '9876543210', '10th Feb 2005', 'Delhi']
    : ['John Doe', 'john@example.com', '+1 555-0199', '10th Feb 2005', 'New York'];

  return (
    <div className="relative rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-xl p-5 transition-all">
      {/* Top Bar: Language Selector & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Globe className="w-3.5 h-3.5 text-indigo-500" />
            <span>{t('voiceSpeechLanguage')}</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              aria-label="Speech Language"
              className="bg-transparent font-bold text-indigo-600 dark:text-indigo-400 focus:outline-none cursor-pointer"
            >
              <option value="en-US" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                English (US / Global)
              </option>
              <option value="hi-IN" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                Hindi (हिन्दी)
              </option>
              <option value="hinglish" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                Hinglish (Mix)
              </option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setShowCommandsHelp(!showCommandsHelp)}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Voice Tips</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${showCommandsHelp ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Live Audio Status Indicator */}
        <div className="flex items-center gap-2">
          {isRecording ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              {t('voiceLiveListening')}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              {t('voiceMicStandby')}
            </span>
          )}
        </div>
      </div>

      {/* Target Field Visual Indicator */}
      <div className="mt-3 py-1.5 px-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300 font-semibold truncate">
          <Target className="w-3.5 h-3.5 shrink-0 text-indigo-500" />
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">Target Field:</span>
          <span className="truncate font-bold text-indigo-900 dark:text-indigo-100">{activeFieldLabel}</span>
        </div>
        <span className="text-[10px] text-indigo-600 dark:text-indigo-400 shrink-0 font-medium">
          (Click any field to switch)
        </span>
      </div>

      {/* Voice Value Helper Drawer */}
      {showCommandsHelp && (
        <div className="my-3 p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
              Sample Voice Inputs (Click to test auto-fill):
            </span>
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400">
              Fills "{activeFieldLabel}"
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {sampleVoiceValues.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => parseCommand(val, activeFieldKeyRef.current || activeFieldKey || undefined)}
                className="text-left text-xs p-2 rounded-lg bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/50 hover:border-indigo-500 text-slate-700 dark:text-slate-300 transition-colors shadow-xs"
              >
                "{val}"
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Mic Section */}
      <div className="my-4 flex flex-col items-center justify-center text-center">
        <div className="relative flex items-center justify-center">
          {/* Pulsing ring when recording */}
          {isRecording && (
            <div className="absolute inset-0 rounded-full bg-indigo-500/20 audio-pulse-ring scale-125" />
          )}

          <button
            type="button"
            onClick={toggleListening}
            className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 transform active:scale-95 ${
              isRecording
                ? 'bg-gradient-to-tr from-rose-600 to-red-500 text-white shadow-rose-500/40 scale-105'
                : 'bg-gradient-to-tr from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-500/35 hover:scale-105'
            }`}
            aria-label={isRecording ? 'Stop voice recording' : 'Start voice recording'}
          >
            {isRecording ? (
              <MicOff className="w-8 h-8 animate-pulse" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </button>
        </div>

        <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
          {isRecording ? t('voiceListeningSpeak') : t('voiceTapToStart')}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-0.5">
          {isRecording ? `Speaking will fill: "${activeFieldLabel}"` : t('voiceSubtextStandby')}
        </p>

        {/* Live Audio Visualizer */}
        <div className="mt-2">
          <AudioWaveform isRecording={isRecording} volumeLevel={volumeLevel} barCount={16} />
        </div>
      </div>

      {/* Live Transcript Display Box */}
      <div className="rounded-xl p-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-left min-h-[56px] flex flex-col justify-center">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
            {t('voiceLiveTranscript')}
          </span>
          {interimTranscript && (
            <span className="text-[10px] text-indigo-500 font-medium animate-pulse">
              {t('voiceRecognizing')}
            </span>
          )}
        </div>

        <div className="text-sm">
          {finalTranscript ? (
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              "{finalTranscript}"
            </span>
          ) : interimTranscript ? (
            <span className="italic text-slate-600 dark:text-slate-300">
              "{interimTranscript}..."
            </span>
          ) : (
            <span className="text-xs text-slate-400 italic">
              {t('voiceAwaiting')}
            </span>
          )}
        </div>
      </div>

      {/* Microphone Error Message / Permission Denied */}
      {errorMessage && (
        <div className="mt-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">{errorMessage}</p>
            <button
              type="button"
              onClick={() => {
                setErrorMessage(null);
                startListening();
              }}
              className="mt-1 text-xs font-semibold text-rose-800 dark:text-rose-200 underline hover:no-underline"
            >
              Retry Microphone Access
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
