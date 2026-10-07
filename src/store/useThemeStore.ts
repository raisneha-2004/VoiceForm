import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ToastNotification } from '../types';

export type DisplayMode = 'light' | 'dark' | 'system' | 'high-contrast' | 'amoled';
export type ColorTheme = 'purple' | 'ocean' | 'forest' | 'sunset';

export interface DisplayModeOption {
  id: DisplayMode;
  name: string;
  description: string;
  badge: string;
}

export const DISPLAY_MODE_OPTIONS: DisplayModeOption[] = [
  {
    id: 'light',
    name: 'Light Mode',
    description: 'Clean bright canvas with crisp contrast',
    badge: 'Standard'
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    description: 'Sleek midnight look with deep slate tones',
    badge: 'Popular'
  },
  {
    id: 'system',
    name: 'System Auto',
    description: 'Synchronizes in real-time with your OS preferences',
    badge: 'Dynamic'
  },
  {
    id: 'high-contrast',
    name: 'High Contrast',
    description: 'WCAG AAA maximum contrast with bold borders',
    badge: 'Accessible'
  },
  {
    id: 'amoled',
    name: 'AMOLED Pure Black',
    description: 'Pitch-black #000000 background for OLED screens',
    badge: 'Battery Saver'
  }
];

export interface ThemePreset {
  id: ColorTheme;
  name: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  previewColors: string[];
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'purple',
    name: 'Default Purple',
    description: 'Deep Indigo & Vibrant Purple',
    primaryColor: '#6366f1',
    accentColor: '#a855f7',
    previewColors: ['#6366f1', '#8b5cf6', '#a855f7']
  },
  {
    id: 'ocean',
    name: 'Ocean Blue',
    description: 'Electric Sky & Deep Cyan',
    primaryColor: '#0284c7',
    accentColor: '#06b6d4',
    previewColors: ['#0284c7', '#0ea5e9', '#06b6d4']
  },
  {
    id: 'forest',
    name: 'Forest Green',
    description: 'Emerald Isle & Mint Teal',
    primaryColor: '#059669',
    accentColor: '#10b981',
    previewColors: ['#059669', '#10b981', '#14b8a6']
  },
  {
    id: 'sunset',
    name: 'Sunset Amber',
    description: 'Sunset Coral & Golden Amber',
    primaryColor: '#ea580c',
    accentColor: '#f59e0b',
    previewColors: ['#ea580c', '#f97316', '#f59e0b']
  }
];

let systemThemeListenerAttached = false;

export const applyThemeToDOM = (displayMode: DisplayMode, colorTheme: ColorTheme) => {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  // Clear previous mode classes
  root.classList.remove('dark', 'light', 'amoled', 'high-contrast');

  // Determine dark state
  let isDark = false;

  if (displayMode === 'system') {
    if (typeof window !== 'undefined' && window.matchMedia) {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  } else if (displayMode === 'dark' || displayMode === 'amoled' || displayMode === 'high-contrast') {
    isDark = true;
  } else {
    isDark = false;
  }

  // Apply base dark class
  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.add('light');
  }

  // Apply specific variant classes
  if (displayMode === 'amoled') {
    root.classList.add('amoled');
  } else if (displayMode === 'high-contrast') {
    root.classList.add('high-contrast');
  }

  // Set data attributes
  root.setAttribute('data-display-mode', displayMode);
  root.setAttribute('data-color-theme', colorTheme);

  // Set primary and accent custom properties for direct root CSS access
  const preset = THEME_PRESETS.find((p) => p.id === colorTheme) || THEME_PRESETS[0];
  root.style.setProperty('--color-primary', preset.primaryColor);
  root.style.setProperty('--color-accent', preset.accentColor);

  // Setup / maintain OS listener when in system mode
  if (typeof window !== 'undefined' && window.matchMedia && !systemThemeListenerAttached) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', () => {
      const current = useThemeStore.getState();
      if (current.theme === 'system') {
        applyThemeToDOM('system', current.colorTheme);
      }
    });
    systemThemeListenerAttached = true;
  }

  console.log(`[ThemeStore] Display Mode: "${displayMode}" (isDark: ${isDark}) | Color Theme: "${colorTheme}" (${preset.name})`);
};

interface ThemeState {
  theme: DisplayMode;
  colorTheme: ColorTheme;
  toasts: ToastNotification[];
  toggleTheme: () => void;
  setTheme: (theme: DisplayMode) => void;
  setColorTheme: (colorTheme: ColorTheme) => void;
  addToast: (toast: Omit<ToastNotification, 'id'>) => void;
  removeToast: (id: string) => void;
}

const NEXT_THEME_CYCLE: Record<DisplayMode, DisplayMode> = {
  light: 'dark',
  dark: 'amoled',
  amoled: 'high-contrast',
  'high-contrast': 'system',
  system: 'light'
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      colorTheme: 'purple',
      toasts: [],

      toggleTheme: () => {
        const currentMode = get().theme || 'dark';
        const nextMode = NEXT_THEME_CYCLE[currentMode] || 'light';
        const currentColorTheme = get().colorTheme;
        applyThemeToDOM(nextMode, currentColorTheme);
        set({ theme: nextMode });
      },

      setTheme: (theme) => {
        const currentColorTheme = get().colorTheme;
        applyThemeToDOM(theme, currentColorTheme);
        set({ theme });
      },

      setColorTheme: (colorTheme) => {
        const currentTheme = get().theme;
        applyThemeToDOM(currentTheme, colorTheme);
        set({ colorTheme });
      },

      addToast: (toast) => {
        const id = 'toast-' + Math.random().toString(36).substring(2, 9);
        set((state) => ({
          toasts: [...state.toasts, { ...toast, id }]
        }));
        // Auto dismiss after duration
        const duration = toast.duration || 4500;
        setTimeout(() => {
          set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id)
          }));
        }, duration);
      },

      removeToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id)
        }));
      }
    }),
    {
      name: 'voiceform_theme_config',
      partialize: (state) => ({
        theme: state.theme,
        colorTheme: state.colorTheme
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyThemeToDOM(state.theme || 'dark', state.colorTheme || 'purple');
        }
      }
    }
  )
);
