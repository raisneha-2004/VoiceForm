import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useFormStore } from '../../store/useFormStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useVoiceStore } from '../../store/useVoiceStore';
import { useThemeStore } from '../../store/useThemeStore';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import { cleanSpokenValue } from '../../hooks/useVoiceCommandParser';
import { templateService, submissionService } from '../../api/client';
import type { FormField } from '../../types';
import { AudioWaveform } from '../../components/common/AudioWaveform';
import confetti from 'canvas-confetti';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  ArrowRight,
  ArrowLeft,
  SkipForward,
  CheckCircle2,
  Download,
  Home,
  ShieldCheck,
  Send
} from 'lucide-react';

export const ConversationalPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const templateParamId = searchParams.get('templateId') || 'template-student-reg';
  const navigate = useNavigate();

  const { user } = useAuthStore();
  const { addToast } = useThemeStore();
  const {
    activeTemplate,
    setActiveTemplate,
    formValues,
    setFieldValue,
    setActiveFieldKey,
    setPendingVoiceConfirmation,
    openPdfPreview
  } = useFormStore();

  const {
    isRecording,
    language,
    volumeLevel,
    finalTranscript,
    interimTranscript,
    setLanguage,
    resetTranscripts
  } = useVoiceStore();

  const { toggleListening } = useSpeechRecognition();
  const { speak, cancel } = useSpeechSynthesis();

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [typedInput, setTypedInput] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [autoReadAudio, setAutoReadAudio] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const lastProcessedTranscriptRef = useRef<string>('');

  // Load template
  useEffect(() => {
    async function loadTemplate() {
      try {
        setIsLoading(true);
        const tpl = await templateService.getById(templateParamId);
        if (tpl) {
          setActiveTemplate(tpl);
        } else {
          const all = await templateService.getAll();
          if (all.length > 0) setActiveTemplate(all[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadTemplate();
  }, [templateParamId]);

  const activeFields: FormField[] = activeTemplate
    ? activeTemplate.fields.filter((f) => {
        if (!f.conditional) return true;
        const depVal = formValues[f.conditional.dependsOnKey];
        if (f.conditional.condition === 'equals') return depVal === f.conditional.value;
        if (f.conditional.condition === 'notEquals') return depVal !== f.conditional.value;
        return true;
      })
    : [];

  const currentField: FormField | undefined = activeFields[currentStepIndex];

  // Auto-read question using TTS whenever question changes
  useEffect(() => {
    if (!currentField || isCompleted) return;

    setActiveFieldKey(currentField.key);

    // Reset input box for next question
    setTypedInput(String(formValues[currentField.key] || ''));
    resetTranscripts();

    if (autoReadAudio) {
      const questionText = getQuestionPrompt(currentField);
      speak(questionText);
    }

    return () => {
      cancel();
    };
  }, [currentStepIndex, currentField?.key, autoReadAudio, isCompleted]);

  const handleCompleteForm = async () => {
    if (!activeTemplate) return;
    try {
      await submissionService.save({
        templateId: activeTemplate.id,
        templateTitle: activeTemplate.title,
        userId: user?.id,
        data: formValues,
        status: 'completed',
        completionPercentage: 100
      });

      setIsCompleted(true);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
      addToast({
        type: 'success',
        title: 'Form Completed!',
        message: 'All questions answered. Your submission report is ready.'
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleNextQuestion = () => {
    cancel();
    if (currentStepIndex < activeFields.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleCompleteForm();
    }
  };

  const handlePreviousQuestion = () => {
    cancel();
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleSkipQuestion = () => {
    cancel();
    handleNextQuestion();
  };

  // When speech transcript arrives, assign directly to the current question field
  useEffect(() => {
    if (!finalTranscript || !currentField || isCompleted) return;
    if (finalTranscript === lastProcessedTranscriptRef.current) return;

    lastProcessedTranscriptRef.current = finalTranscript;
    const spokenText = finalTranscript.trim();
    const cleanedValue = cleanSpokenValue(spokenText, currentField.type);

    // Sensitive field confirmation check
    if (currentField.isSensitive) {
      setPendingVoiceConfirmation({
        fieldKey: currentField.key,
        fieldLabel: currentField.label,
        value: cleanedValue,
        rawTranscript: spokenText
      });
      return;
    }

    setFieldValue(currentField.key, cleanedValue, {
      label: currentField.label,
      description: `Conversational answer set for ${currentField.label}: "${cleanedValue}"`,
      logAi: true
    });
    setTypedInput(String(cleanedValue));

    // Progress to next question after short pause
    const timer = setTimeout(() => {
      handleNextQuestion();
      lastProcessedTranscriptRef.current = '';
    }, 1200);

    return () => clearTimeout(timer);
  }, [finalTranscript, currentField, isCompleted]);

  const getQuestionPrompt = (field: FormField): string => {
    const cleanKey = field.key.toLowerCase();
    const hindiLabels: Record<string, string> = {
      fullname: 'पूरा नाम',
      name: 'नाम',
      email: 'ईमेल पता',
      phone: 'फोन नंबर',
      city: 'शहर',
      address: 'पता',
      age: 'उम्र',
      college: 'कॉलेज या संस्थान',
      company: 'कंपनी या संगठन',
      role: 'पद',
      experience: 'कार्य अनुभव',
      gender: 'लिंग',
      notes: 'टिप्पणी'
    };
    const hindiLabel = hindiLabels[cleanKey] || field.label;

    if (language === 'hi-IN') {
      switch (field.type) {
        case 'email':
          return `कृपया अपना ${hindiLabel} बताइए।`;
        case 'phone':
          return `कृपया अपना संपर्क ${hindiLabel} बताइए।`;
        case 'date':
          return `कृपया ${hindiLabel} की तारीख बताइए।`;
        case 'select':
        case 'radio':
          const optNames = field.options?.map((o) => o.label).slice(0, 3).join(', ');
          return `${hindiLabel} के लिए आप क्या चुनना चाहेंगे? जैसे कि: ${optNames}।`;
        case 'checkbox':
          return `क्या आपको ${hindiLabel} की आवश्यकता है? आप हाँ या ना बोल सकते हैं।`;
        default:
          if (cleanKey.includes('name')) return `कृपया अपना पूरा नाम बताइए।`;
          if (cleanKey.includes('city')) return `आप किस शहर में रहते हैं?`;
          return `कृपया बताइए: आपका ${hindiLabel} क्या है?`;
      }
    }

    if (language === 'hinglish') {
      switch (field.type) {
        case 'email':
          return `Aapka ${field.label} kya hai?`;
        case 'phone':
          return `Apna contact phone number batayein.`;
        case 'date':
          return `Apna ${field.label} batayein.`;
        case 'select':
        case 'radio':
          const optNames = field.options?.map((o) => o.label).slice(0, 3).join(', ');
          return `${field.label} ke liye kaunsa option select karna chahenge? Jaise: ${optNames}.`;
        case 'checkbox':
          return `${field.label} select karna hai? Aap yes ya no bol sakte hain.`;
        default:
          return `Please batayein: Aapka ${field.label} kya hai?`;
      }
    }

    // Default English
    switch (field.type) {
      case 'email':
        return `What is your email address for ${field.label}?`;
      case 'phone':
        return `Please tell us your contact phone number.`;
      case 'date':
        return `What is your ${field.label}?`;
      case 'select':
      case 'radio':
        const optNames = field.options?.map((o) => o.label).slice(0, 3).join(', ');
        return `Which option do you prefer for ${field.label}? For example: ${optNames}.`;
      case 'checkbox':
        return `Do you require ${field.label}? You can say yes or no.`;
      default:
        return `Please tell me: What is your ${field.label}?`;
    }
  };

  const handleTypedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentField) return;
    setFieldValue(currentField.key, typedInput, {
      label: currentField.label,
      logAi: true
    });
    handleNextQuestion();
  };

  const handleDownloadPdf = () => {
    if (!activeTemplate) return;
    openPdfPreview(activeTemplate, formValues);
  };

  if (isLoading || !activeTemplate) {
    return (
      <div className="p-12 text-center text-xs text-slate-400">
        Loading conversational session...
      </div>
    );
  }

  // Celebration Final Screen
  if (isCompleted) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 max-w-xl mx-auto">
        <div className="w-full p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Form Completed Successfully
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
              All Answers Recorded!
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Your responses for <strong>{activeTemplate.title}</strong> have been validated and saved.
            </p>
          </div>

          {/* Quick Summary Preview */}
          <div className="text-left rounded-2xl bg-slate-50 dark:bg-slate-950/60 p-4 border border-slate-200/60 dark:border-slate-800/60 space-y-2 max-h-56 overflow-y-auto">
            {activeTemplate.fields.map((f) => {
              const val = formValues[f.key];
              if (!val && val !== false) return null;
              return (
                <div key={f.key} className="text-xs flex justify-between border-b border-slate-100 dark:border-slate-800/80 py-1">
                  <span className="font-semibold text-slate-500">{f.label}:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{String(val)}</span>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Summary</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const previousField = currentStepIndex > 0 ? activeFields[currentStepIndex - 1] : null;
  const previousAnswer = previousField ? formValues[previousField.key] : null;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
      {/* Top Header: Progress & Audio Toggles */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/templates')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit Wizard</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Auto Read TTS toggle */}
            <button
              type="button"
              onClick={() => setAutoReadAudio(!autoReadAudio)}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                autoReadAudio
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}
              title={autoReadAudio ? 'Auto-read enabled' : 'Auto-read disabled'}
            >
              {autoReadAudio ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">Voice TTS</span>
            </button>

            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="text-xs font-bold py-1.5 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-none outline-none cursor-pointer"
            >
              <option value="en-US">English</option>
              <option value="hi-IN">Hindi (हिन्दी)</option>
              <option value="hinglish">Hinglish</option>
            </select>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              {currentField?.section && (
                <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">
                  {currentField.section} •
                </span>
              )}
              <span>
                Question {currentStepIndex + 1} of {activeFields.length}
              </span>
            </span>
            <span className="font-mono text-indigo-600 dark:text-indigo-400">
              {Math.round(((currentStepIndex + 1) / activeFields.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-300"
              style={{ width: `${((currentStepIndex + 1) / activeFields.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Center Question Card */}
      <div className="my-auto py-8 text-center space-y-6">
        {/* Previous Answer Badge */}
        {previousField && previousAnswer !== null && previousAnswer !== undefined && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 text-xs animate-in fade-in duration-200">
            <span className="font-semibold">{previousField.label}:</span>
            <span className="text-slate-900 dark:text-slate-200 font-bold">
              {String(previousAnswer)}
            </span>
          </div>
        )}

        {/* Current Question */}
        <div className="space-y-2.5 max-w-lg mx-auto">
          <div className="flex items-center justify-center gap-2">
            {currentField?.section && (
              <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-200/50 dark:border-indigo-900/30">
                {currentField.section}
              </span>
            )}
            {currentField?.isSensitive && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200/50 dark:border-amber-900/30">
                <ShieldCheck className="w-3.5 h-3.5" /> Confidential Field
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight leading-snug">
            {currentField ? getQuestionPrompt(currentField) : 'Preparing next question...'}
          </h1>

          {currentField?.helpText && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {currentField.helpText}
            </p>
          )}
        </div>

        {/* Large Central Microphone Button */}
        <div className="flex flex-col items-center justify-center py-4">
          <div className="relative">
            {isRecording && (
              <div className="absolute inset-0 rounded-full bg-indigo-500/20 audio-pulse-ring scale-150" />
            )}

            <button
              type="button"
              onClick={toggleListening}
              className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform active:scale-95 ${
                isRecording
                  ? 'bg-rose-500 text-white shadow-rose-500/40 scale-105 animate-pulse'
                  : 'bg-gradient-to-tr from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-500/35 hover:scale-105'
              }`}
            >
              {isRecording ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
            </button>
          </div>

          <p className="mt-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
            {isRecording ? 'Listening... Speak your answer now' : 'Tap microphone and answer aloud'}
          </p>

          <div className="mt-2">
            <AudioWaveform isRecording={isRecording} volumeLevel={volumeLevel} barCount={14} />
          </div>

          {/* Transcript / Spoken Result */}
          {(interimTranscript || finalTranscript) && (
            <div className="mt-3 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 text-xs font-medium text-indigo-700 dark:text-indigo-300 max-w-sm">
              "{finalTranscript || interimTranscript}"
            </div>
          )}
        </div>

        {/* Fallback Typed Input */}
        <form onSubmit={handleTypedSubmit} className="max-w-md mx-auto flex items-center gap-2">
          <input
            type="text"
            value={typedInput}
            onChange={(e) => setTypedInput(e.target.value)}
            placeholder={`Or type answer for ${currentField?.label}...`}
            className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
          <button
            type="submit"
            disabled={!typedInput.trim()}
            className="p-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:opacity-90 disabled:opacity-40 transition-opacity"
            title="Submit Typed Answer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Bottom Navigation Controls */}
      <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handlePreviousQuestion}
          disabled={currentStepIndex === 0}
          className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSkipQuestion}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span>Skip</span>
          </button>

          <button
            type="button"
            onClick={handleNextQuestion}
            className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/25 transition-all flex items-center gap-1.5"
          >
            <span>{currentStepIndex === activeFields.length - 1 ? 'Finish' : 'Next'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
