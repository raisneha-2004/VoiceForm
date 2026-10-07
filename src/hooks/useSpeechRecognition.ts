import { useState, useEffect, useRef, useCallback } from 'react';
import { useVoiceStore } from '../store/useVoiceStore';
import type { SupportedLanguage } from '../types';

// Extend window for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// Module-level singletons to ensure only ONE SpeechRecognition and ONE AudioContext instance
let globalRecognition: any = null;
let globalAudioContext: AudioContext | null = null;
let globalMediaStream: MediaStream | null = null;
let globalAnimationFrame: number | null = null;
let shouldKeepListening = false;
let syntheticInterval: ReturnType<typeof setInterval> | null = null;

// Map app language code to BCP-47 tag
export const getBcp47Language = (lang: SupportedLanguage): string => {
  switch (lang) {
    case 'hi-IN':
      return 'hi-IN';
    case 'hinglish':
      return 'en-IN'; // Indian English captures Hinglish phonetic flow best
    case 'en-US':
    default:
      return 'en-US';
  }
};

export function useSpeechRecognition() {
  const {
    isRecording,
    language,
    setRecording,
    setErrorMessage,
    setSupported
  } = useVoiceStore();

  const [hasSpeechSupport, setHasSpeechSupport] = useState<boolean>(true);
  const languageRef = useRef<SupportedLanguage>(language);
  languageRef.current = language;

  // Initialize Speech Recognition once
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setHasSpeechSupport(false);
      setSupported(false);
      setErrorMessage('Web Speech API is not supported in this browser.');
      return;
    }

    if (!globalRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;
        recognition.lang = getBcp47Language(languageRef.current);

        recognition.onstart = () => {
          useVoiceStore.getState().setErrorMessage(null);
          useVoiceStore.getState().setRecording(true);
        };

        recognition.onresult = (event: any) => {
          let interim = '';
          let final = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              final += transcript;
            } else {
              interim += transcript;
            }
          }

          if (interim) {
            useVoiceStore.getState().setInterimTranscript(interim);
          }
          if (final) {
            useVoiceStore.getState().setFinalTranscript(final.trim());
            useVoiceStore.getState().setInterimTranscript('');
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error event:', event.error);
          if (event.error === 'not-allowed') {
            useVoiceStore.getState().setErrorMessage('Microphone access was denied. Please allow microphone permissions in your browser.');
            stopListening();
          } else if (event.error === 'network') {
            useVoiceStore.getState().setErrorMessage('Network error occurred during speech recognition. Re-trying...');
          } else if (event.error === 'aborted' || event.error === 'no-speech') {
            // Normal browser lifecycle events
            return;
          } else {
            useVoiceStore.getState().setErrorMessage(`Speech recognition error: ${event.error}`);
          }
        };

        recognition.onend = () => {
          if (shouldKeepListening) {
            try {
              if (globalRecognition) {
                globalRecognition.lang = getBcp47Language(languageRef.current);
                globalRecognition.start();
              }
            } catch (e) {
              // will resume on next event
            }
          } else {
            useVoiceStore.getState().setRecording(false);
            useVoiceStore.getState().setVolumeLevel(0);
          }
        };

        globalRecognition = recognition;
      } catch (err: any) {
        console.error('Failed to initialize SpeechRecognition', err);
        setHasSpeechSupport(false);
        setSupported(false);
      }
    }
  }, []);

  // Update language model on change
  useEffect(() => {
    const bcp47 = getBcp47Language(language);
    if (globalRecognition) {
      globalRecognition.lang = bcp47;
      if (shouldKeepListening) {
        try {
          globalRecognition.stop();
        } catch (e) {
          // ignore
        }
      }
    }
  }, [language]);

  // Audio Analyzer for live volume visualizer
  const setupAudioVisualizer = async () => {
    if (globalMediaStream && globalAudioContext) {
      return; // Already initialized
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      globalMediaStream = stream;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      globalAudioContext = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateVolume = () => {
        if (!shouldKeepListening) return;
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        const normalized = Math.min(100, Math.round((average / 128) * 100));
        useVoiceStore.getState().setVolumeLevel(normalized);
        globalAnimationFrame = requestAnimationFrame(updateVolume);
      };

      updateVolume();
    } catch (err) {
      console.warn('Microphone audio stream for visualizer unavailable:', err);
      // Fallback synthetic volume pulse during recording
      let syntheticPhase = 0;
      if (syntheticInterval) clearInterval(syntheticInterval);
      syntheticInterval = setInterval(() => {
        if (!shouldKeepListening) {
          if (syntheticInterval) clearInterval(syntheticInterval);
          useVoiceStore.getState().setVolumeLevel(0);
          return;
        }
        syntheticPhase += 0.2;
        const synthVal = Math.round(25 + Math.sin(syntheticPhase) * 20 + Math.random() * 15);
        useVoiceStore.getState().setVolumeLevel(synthVal);
      }, 100);
    }
  };

  const startListening = useCallback(async () => {
    setErrorMessage(null);
    shouldKeepListening = true;

    // Start Audio visualizer
    await setupAudioVisualizer();

    if (globalRecognition) {
      try {
        globalRecognition.lang = getBcp47Language(language);
        globalRecognition.start();
        setRecording(true);
      } catch (err: any) {
        if (err.name === 'InvalidStateError') {
          // Already running
          setRecording(true);
        } else {
          setErrorMessage('Could not activate speech recognition. Please check permissions.');
        }
      }
    } else {
      setRecording(true);
    }
  }, [language, setErrorMessage, setRecording]);

  const stopListening = useCallback(() => {
    shouldKeepListening = false;
    useVoiceStore.getState().setRecording(false);
    useVoiceStore.getState().setVolumeLevel(0);

    if (globalRecognition) {
      try {
        globalRecognition.stop();
      } catch (err) {
        // ignore
      }
    }

    if (globalAnimationFrame) {
      cancelAnimationFrame(globalAnimationFrame);
      globalAnimationFrame = null;
    }

    if (syntheticInterval) {
      clearInterval(syntheticInterval);
      syntheticInterval = null;
    }

    if (globalMediaStream) {
      globalMediaStream.getTracks().forEach((track) => track.stop());
      globalMediaStream = null;
    }

    if (globalAudioContext && globalAudioContext.state !== 'closed') {
      globalAudioContext.close().catch(() => {});
      globalAudioContext = null;
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (isRecording) {
      stopListening();
    } else {
      startListening();
    }
  }, [isRecording, startListening, stopListening]);

  return {
    isRecording,
    hasSpeechSupport,
    startListening,
    stopListening,
    toggleListening
  };
}
