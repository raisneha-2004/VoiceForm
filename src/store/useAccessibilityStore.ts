import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useThemeStore } from './useThemeStore';

export type FontSize = 'small' | 'medium' | 'large' | 'extra-large';

export interface FontSizeOption {
  id: FontSize;
  name: string;
  sizePx: string;
  scaleLabel: string;
  description: string;
}

export const FONT_SIZE_OPTIONS: FontSizeOption[] = [
  {
    id: 'small',
    name: 'Compact',
    sizePx: '14px',
    scaleLabel: '87.5%',
    description: 'Higher information density for power users'
  },
  {
    id: 'medium',
    name: 'Default',
    sizePx: '16px',
    scaleLabel: '100%',
    description: 'Standard balanced typography scale'
  },
  {
    id: 'large',
    name: 'Large',
    sizePx: '18px',
    scaleLabel: '112.5%',
    description: 'Enhanced readability with generous line height'
  },
  {
    id: 'extra-large',
    name: 'Extra Large',
    sizePx: '20px',
    scaleLabel: '125%',
    description: 'Maximum legibility for low-vision assistance'
  }
];

export const applyAccessibilityToDOM = (fontSize: FontSize, reducedMotion: boolean) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  // Set font size data attribute and root style
  root.setAttribute('data-font-size', fontSize);
  switch (fontSize) {
    case 'small':
      root.style.fontSize = '14px';
      break;
    case 'large':
      root.style.fontSize = '18px';
      break;
    case 'extra-large':
      root.style.fontSize = '20px';
      break;
    case 'medium':
    default:
      root.style.fontSize = '16px';
      break;
  }

  // Set reduced motion attribute
  if (reducedMotion) {
    root.setAttribute('data-reduced-motion', 'true');
    root.classList.add('reduced-motion');
  } else {
    root.removeAttribute('data-reduced-motion');
    root.classList.remove('reduced-motion');
  }
};

interface AccessibilityState {
  fontSize: FontSize;
  voiceNavigationEnabled: boolean;
  screenReaderAnnouncements: boolean;
  reducedMotion: boolean;
  lastSpokenNavigationPrompt: string | null;

  setFontSize: (size: FontSize) => void;
  setVoiceNavigationEnabled: (enabled: boolean) => void;
  setScreenReaderAnnouncements: (enabled: boolean) => void;
  setReducedMotion: (enabled: boolean) => void;
  toggleHighContrast: () => void;
  setLastSpokenNavigationPrompt: (prompt: string | null) => void;
}

export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set, get) => ({
      fontSize: 'medium',
      voiceNavigationEnabled: false,
      screenReaderAnnouncements: true,
      reducedMotion: false,
      lastSpokenNavigationPrompt: null,

      setFontSize: (fontSize) => {
        applyAccessibilityToDOM(fontSize, get().reducedMotion);
        set({ fontSize });
      },

      setVoiceNavigationEnabled: (voiceNavigationEnabled) => {
        set({ voiceNavigationEnabled });
      },

      setScreenReaderAnnouncements: (screenReaderAnnouncements) => {
        set({ screenReaderAnnouncements });
      },

      setReducedMotion: (reducedMotion) => {
        applyAccessibilityToDOM(get().fontSize, reducedMotion);
        set({ reducedMotion });
      },

      toggleHighContrast: () => {
        const themeStore = useThemeStore.getState();
        if (themeStore.theme === 'high-contrast') {
          themeStore.setTheme('dark');
        } else {
          themeStore.setTheme('high-contrast');
        }
      },

      setLastSpokenNavigationPrompt: (lastSpokenNavigationPrompt) => {
        set({ lastSpokenNavigationPrompt });
      }
    }),
    {
      name: 'voiceform_accessibility_config',
      partialize: (state) => ({
        fontSize: state.fontSize,
        voiceNavigationEnabled: state.voiceNavigationEnabled,
        screenReaderAnnouncements: state.screenReaderAnnouncements,
        reducedMotion: state.reducedMotion
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyAccessibilityToDOM(state.fontSize || 'medium', !!state.reducedMotion);
        }
      }
    }
  )
);
