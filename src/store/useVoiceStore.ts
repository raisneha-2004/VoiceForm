import { create } from 'zustand';
import type { SupportedLanguage } from '../types';

interface VoiceState {
  isRecording: boolean;
  isProcessing: boolean;
  isSupported: boolean;
  language: SupportedLanguage;
  interimTranscript: string;
  finalTranscript: string;
  commandHistory: string[];
  errorMessage: string | null;
  volumeLevel: number; // 0 to 100 for visualizer
  activeTargetFieldKey: string | null; // which field is currently targeted

  setRecording: (isRecording: boolean) => void;
  setProcessing: (isProcessing: boolean) => void;
  setSupported: (supported: boolean) => void;
  setLanguage: (lang: SupportedLanguage) => void;
  setInterimTranscript: (text: string) => void;
  setFinalTranscript: (text: string) => void;
  appendCommandHistory: (cmd: string) => void;
  setErrorMessage: (msg: string | null) => void;
  setVolumeLevel: (level: number) => void;
  setActiveTargetFieldKey: (key: string | null) => void;
  resetTranscripts: () => void;
}

export const useVoiceStore = create<VoiceState>((set) => ({
  isRecording: false,
  isProcessing: false,
  isSupported: true,
  language: 'en-US',
  interimTranscript: '',
  finalTranscript: '',
  commandHistory: [],
  errorMessage: null,
  volumeLevel: 0,
  activeTargetFieldKey: null,

  setRecording: (isRecording) => set({ isRecording }),
  setProcessing: (isProcessing) => set({ isProcessing }),
  setSupported: (isSupported) => set({ isSupported }),
  setLanguage: (language) => set({ language }),
  setInterimTranscript: (interimTranscript) => set({ interimTranscript }),
  setFinalTranscript: (finalTranscript) => set({ finalTranscript }),
  appendCommandHistory: (cmd) => 
    set((state) => ({ commandHistory: [cmd, ...state.commandHistory].slice(0, 15) })),
  setErrorMessage: (errorMessage) => set({ errorMessage }),
  setVolumeLevel: (volumeLevel) => set({ volumeLevel }),
  setActiveTargetFieldKey: (activeTargetFieldKey) => set({ activeTargetFieldKey }),
  resetTranscripts: () => set({ interimTranscript: '', finalTranscript: '' })
}));
