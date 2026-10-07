import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { ToastContainer } from '../common/Toast';
import { SensitiveConfirmDialog } from '../voice/SensitiveConfirmDialog';
import { PdfPreviewModal } from '../common/PdfPreviewModal';
import { VoiceNavigationListener } from '../voice/VoiceNavigationListener';
import { useAuthStore } from '../../store/useAuthStore';

export const AppLayout: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  // Landing page and auth pages don't show the dashboard sidebar
  const isPublicPage =
    location.pathname === '/' ||
    location.pathname === '/login' ||
    location.pathname === '/signup' ||
    location.pathname === '/forgot-password' ||
    location.pathname.startsWith('/reset-password');

  const showSidebar = isAuthenticated && !isPublicPage;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <div className="flex-1 flex w-full">
        {showSidebar && <Sidebar />}

        <main className="flex-1 min-w-0 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Modals, Voice Navigation HUD & Notifications */}
      <ToastContainer />
      <SensitiveConfirmDialog />
      <PdfPreviewModal />
      <VoiceNavigationListener />
    </div>
  );
};
