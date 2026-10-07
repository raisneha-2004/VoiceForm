import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useThemeStore, applyThemeToDOM } from './store/useThemeStore';
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignUpPage } from './pages/auth/SignUpPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { TemplatesPage } from './pages/templates/TemplatesPage';
import { FormWorkspacePage } from './pages/workspace/FormWorkspacePage';
import { ConversationalPage } from './pages/conversational/ConversationalPage';
import { MyFormsPage } from './pages/my-forms/MyFormsPage';
import { FormBuilderPage } from './pages/admin/FormBuilderPage';
import { ProfileSettingsPage } from './pages/settings/ProfileSettingsPage';
import { VoiceCommandsGuidePage } from './pages/guide/VoiceCommandsGuidePage';
import { AccessibilityPage } from './pages/accessibility/AccessibilityPage';
import { useAccessibilityStore, applyAccessibilityToDOM } from './store/useAccessibilityStore';

export const App: React.FC = () => {
  const { theme, colorTheme } = useThemeStore();
  const { fontSize, reducedMotion } = useAccessibilityStore();

  // Sync theme class and color-theme attribute on HTML root
  useEffect(() => {
    applyThemeToDOM(theme, colorTheme);
  }, [theme, colorTheme]);

  // Sync font size and accessibility attributes on HTML root
  useEffect(() => {
    applyAccessibilityToDOM(fontSize, reducedMotion);
  }, [fontSize, reducedMotion]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          {/* Public / Marketing */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token?" element={<ResetPasswordPage />} />

          {/* Core App */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/workspace/:templateId" element={<FormWorkspacePage />} />
          <Route path="/conversational" element={<ConversationalPage />} />
          <Route path="/my-forms" element={<MyFormsPage />} />
          <Route path="/builder" element={<FormBuilderPage />} />
          <Route path="/admin/builder" element={<FormBuilderPage />} />
          <Route path="/settings" element={<ProfileSettingsPage />} />
          <Route path="/voice-guide" element={<VoiceCommandsGuidePage />} />
          <Route path="/accessibility" element={<AccessibilityPage />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
