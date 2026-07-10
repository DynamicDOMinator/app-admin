'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

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
        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
