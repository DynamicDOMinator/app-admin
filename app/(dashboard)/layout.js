'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://app.prosental.online' || 'http://localhost:5001';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Background token refresh every 15 minutes to keep admin session active indefinitely
  useEffect(() => {
    const refreshTokenPeriodically = async () => {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return;
      try {
        const { data } = await axios.post(
          `${baseURL}/api/v1/auth/refresh`,
          { refreshToken },
          { withCredentials: true }
        );
        if (data?.data?.accessToken) {
          localStorage.setItem('accessToken', data.data.accessToken);
        }
        if (data?.data?.refreshToken) {
          localStorage.setItem('refreshToken', data.data.refreshToken);
        }
      } catch (err) {
        console.warn('Background token refresh notice:', err?.message);
      }
    };

    // Run every 15 minutes
    const interval = setInterval(refreshTokenPeriodically, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-surface dark:bg-dark-200">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        collapsed={!sidebarOpen}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main area */}
      <div
        className={`transition-all duration-300 min-h-screen ${
          sidebarOpen ? 'sidebar-offset' : 'sidebar-offset-collapsed'
        }`}
      >
        <Header
          onToggleSidebar={() => setSidebarOpen(o => !o)}
          onMobileMenu={() => setMobileOpen(o => !o)}
        />
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
