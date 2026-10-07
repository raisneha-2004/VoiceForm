import React, { useState, useEffect, useRef } from 'react';
import { useFormStore } from '../../store/useFormStore';
import { useVoiceStore } from '../../store/useVoiceStore';
import { useThemeStore } from '../../store/useThemeStore';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { Modal } from '../common/Modal';
import {
  ShieldAlert,
  Check,
  RotateCcw,
  Edit3,
  Volume2,
  VolumeX,
  Radio
} from 'lucide-react';

export const SensitiveConfirmDialog: React.FC = () => {
  const {
    pendingVoiceConfirmation,
    confirmPendingVoiceChange,
    rejectPendingVoiceChange,
    setPendingVoiceConfirmation,
    setActiveFieldKey
  } = useFormStore();

  const { finalTranscript, resetTranscripts, language, isRecording } = useVoiceStore();
  const { addToast } = useThemeStore();
  const { speak, cancel, isSpeaking } = useSpeechSynthesis();
  const { startListening } = useSpeechRecognition();

  const [editedValue, setEditedValue] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const spokenKeyRef = useRef<string | null>(null);
  const lastHandledTranscriptRef = useRef<string>('');

  // 1. When dialog opens for a new sensitive value, auto-speak the confirmation prompt via TTS
  useEffect(() => {
    if (pendingVoiceConfirmation) {
      setEditedValue(String(pendingVoiceConfirmation.value || ''));
      setIsEditing(false);

      const confirmationKey = `${pendingVoiceConfirmation.fieldKey}-${pendingVoiceConfirmation.value}`;
      if (spokenKeyRef.current !== confirmationKey) {
        spokenKeyRef.current = confirmationKey;

        const isHindi = language === 'hi-IN';
        const ttsMessage = isHindi
          ? `मैंने आपका ${pendingVoiceConfirmation.fieldLabel} ${pendingVoiceConfirmation.value} सुना है, क्या यह सही है?`
          : `Maine aapka ${pendingVoiceConfirmation.fieldLabel} ${pendingVoiceConfirmation.value} suna hai, sahi hai kya?`;

        // Slight timeout so UI renders before TTS kicks in
        const timer = setTimeout(() => {
          speak(ttsMessage, { language: isHindi ? 'hi-IN' : 'hinglish' });
        }, 180);

        return () => clearTimeout(timer);
      }
    } else {
      spokenKeyRef.current = null;
      cancel();
    }
  }, [pendingVoiceConfirmation, language, speak, cancel]);

  // 2. Voice Response Handling: Listen for "haan" / "sahi hai" vs "nahi" / "dobara"
  useEffect(() => {
    if (!pendingVoiceConfirmation || !finalTranscript) return;
    if (finalTranscript === lastHandledTranscriptRef.current) return;

    lastHandledTranscriptRef.current = finalTranscript;
    const lower = finalTranscript.toLowerCase().trim();

    const isPositive =
      /(^|\b)(haan|ha|sahi|sahi hai|confirm|yes|theek hai|bilkul|correct|yep|yeah|kar do|save|save karo)(\b|$)/i.test(lower);
    const isNegative =
      /(^|\b)(nahi|na|galat|galat hai|dobara|no|nope|cancel|retry|wrong|phir se|dobara bolo)(\b|$)/i.test(lower);

    if (isPositive) {
      handleConfirm();
      resetTranscripts();
    } else if (isNegative) {
      handleReject();
      resetTranscripts();
    }
  }, [finalTranscript, pendingVoiceConfirmation]);

  if (!pendingVoiceConfirmation) return null;

  const handleConfirm = () => {
    cancel();
    const targetLabel = pendingVoiceConfirmation.fieldLabel;
    const finalVal = isEditing ? editedValue : pendingVoiceConfirmation.value;

    if (isEditing) {
      setPendingVoiceConfirmation({
        ...pendingVoiceConfirmation,
        value: editedValue
      });
      setTimeout(() => {
        confirmPendingVoiceChange();
      }, 50);
    } else {
      confirmPendingVoiceChange();
    }

    addToast({
      type: 'success',
      title: `${targetLabel} Confirmed`,
      message: `"${finalVal}" successfully saved to form.`
    });
  };

  const handleReject = () => {
    const targetKey = pendingVoiceConfirmation.fieldKey;
    const targetLabel = pendingVoiceConfirmation.fieldLabel;
    cancel();
    rejectPendingVoiceChange();

    if (targetKey) {
      setActiveFieldKey(targetKey);
      addToast({
        type: 'info',
        title: 'Dobara Boliye',
        message: `${targetLabel} ke liye mic active hai. Please dobara boliye.`
      });

      // Automatically re-activate microphone for that same field
      setTimeout(() => {
        startListening();
      }, 200);
    }
  };

  const repeatTtsPrompt = () => {
    const isHindi = language === 'hi-IN';
    const ttsMessage = isHindi
      ? `मैंने आपका ${pendingVoiceConfirmation.fieldLabel} ${pendingVoiceConfirmation.value} सुना है, क्या यह सही है?`
      : `Maine aapka ${pendingVoiceConfirmation.fieldLabel} ${pendingVoiceConfirmation.value} suna hai, sahi hai kya?`;
    speak(ttsMessage, { language: isHindi ? 'hi-IN' : 'hinglish' });
  };

  return (
    <Modal
      isOpen={!!pendingVoiceConfirmation}
      onClose={handleReject}
      title="Voice Confirmation (Sensitive Field)"
    >
      <div className="space-y-4">
        {/* Sensitive Field Warning Banner */}
        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-sm">
          <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-amber-950 dark:text-amber-100">
              Maine suna: {pendingVoiceConfirmation.value} — sahi hai?
            </p>
            <p className="text-xs text-amber-800 dark:text-amber-300/90 mt-0.5">
              Yeh sensitive field (<strong>{pendingVoiceConfirmation.fieldLabel}</strong>) hai. Confirm karne ke baad hi value save hogi.
            </p>
          </div>
        </div>

        {/* Live Audio & Voice Interaction Banner */}
        <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-medium">
            <div className="relative flex items-center justify-center">
              <Radio className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-pulse" />
              {isRecording && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
              )}
            </div>
            <span>
              Mic sun raha hai — bolkar <strong>"haan"</strong> ya <strong>"nahi"</strong> kahein
            </span>
          </div>

          <button
            type="button"
            onClick={repeatTtsPrompt}
            className="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors flex items-center gap-1 text-[11px] font-semibold shrink-0"
            title="Repeat voice question"
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>Repeat Question</span>
          </button>
        </div>

        {/* Captured Value Display / Edit Box */}
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/60 space-y-3">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Target Field
            </span>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {pendingVoiceConfirmation.fieldLabel}
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Recognized Value
              </span>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <Edit3 className="w-3 h-3" />
                {isEditing ? 'Cancel Edit' : 'Edit Manually'}
              </button>
            </div>

            {isEditing ? (
              <input
                type="text"
                value={editedValue}
                onChange={(e) => setEditedValue(e.target.value)}
                className="mt-1.5 w-full px-3.5 py-2.5 text-sm font-medium rounded-xl border border-indigo-400 dark:border-indigo-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                autoFocus
              />
            ) : (
              <div className="mt-1 flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/60">
                <p className="text-base font-mono font-bold text-indigo-700 dark:text-indigo-300">
                  {pendingVoiceConfirmation.value}
                </p>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-200/60 dark:bg-indigo-800/60 text-indigo-800 dark:text-indigo-200 font-bold">
                  Extracted
                </span>
              </div>
            )}
          </div>

          <div>
            <span className="text-[11px] font-medium text-slate-400">
              Aapki aawaz se suna gaya raw transcript:
            </span>
            <p className="text-xs italic text-slate-600 dark:text-slate-400 mt-0.5">
              "{pendingVoiceConfirmation.rawTranscript}"
            </p>
          </div>
        </div>

        {/* Action Buttons: Haan, Confirm karo & Nahi, Dobara boliye */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={handleReject}
            className="px-4 py-2.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Nahi, Dobara boliye</span>
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Haan, Confirm karo</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
