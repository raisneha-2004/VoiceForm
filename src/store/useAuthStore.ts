import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserPreferences, Role } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, role?: Role) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<Pick<User, 'name' | 'email' | 'avatar'>>) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  switchDemoRole: (role: Role) => void;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  defaultLanguage: 'en-US',
  autoReadQuestions: true,
  confirmSensitiveData: true,
  speechRate: 1.0,
  speechPitch: 1.0,
  theme: 'dark'
};

const DEMO_USER: User = {
  id: 'user-sneha-1',
  name: 'Sneha Rai',
  email: 'sneha.rai@indicdata.ai',
  role: 'user',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  preferences: DEFAULT_PREFERENCES,
  createdAt: '2026-01-15T08:00:00.000Z'
};

const DEMO_ADMIN: User = {
  id: 'admin-alex-9',
  name: 'Alex Patel (Admin)',
  email: 'admin@voiceform.ai',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  preferences: {
    ...DEFAULT_PREFERENCES,
    defaultLanguage: 'hinglish'
  },
  createdAt: '2025-11-20T10:00:00.000Z'
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: DEMO_USER,
      token: 'demo-jwt-token-voiceform-2026',
      isAuthenticated: true,
      isLoading: false,

      login: async (email: string, role: Role = 'user') => {
        set({ isLoading: true });
        // Simulate network latency
        await new Promise((resolve) => setTimeout(resolve, 600));
        const chosen = role === 'admin' ? DEMO_ADMIN : { ...DEMO_USER, email: email || DEMO_USER.email };
        set({
          user: chosen,
          token: 'jwt-auth-' + Math.random().toString(36).substring(2),
          isAuthenticated: true,
          isLoading: false
        });
        return true;
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false
        });
      },

      updateProfile: (data) => {
        set((state) => {
          if (!state.user) return state;
          return {
            user: { ...state.user, ...data }
          };
        });
      },

      updatePreferences: (prefs) => {
        set((state) => {
          if (!state.user) return state;
          return {
            user: {
              ...state.user,
              preferences: { ...state.user.preferences, ...prefs }
            }
          };
        });
      },

      switchDemoRole: (role: Role) => {
        set({
          user: role === 'admin' ? DEMO_ADMIN : DEMO_USER,
          isAuthenticated: true,
          token: 'role-switch-token-' + role
        });
      }
    }),
    {
      name: 'voiceform_auth_storage'
    }
  )
);
