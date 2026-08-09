'use client';

import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, Sun, Moon, Bell, Search, Globe, ChevronDown, MessageSquare } from 'lucide-react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import { useLanguage } from '@/components/providers/LanguageProvider';

export default function Header({ onToggleSidebar, onMobileMenu }) {
  const { theme, setTheme } = useTheme();
  const { lang, toggleLanguage } = useLanguage();
  const [searchFocused, setSearchFocused] = useState(false);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getCookie = (name) => {
      if (typeof document === 'undefined') return null;
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    };
    
    const token = getCookie('accessToken');
    if (!token) return;

    const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
      auth: { token },
    });

    socket.on('connect', () => {
      console.log('Admin header socket connected:', socket.id);
    });

    socket.on('notification', (payload) => {
      if (payload.type === 'chat') {
        setHasNewMessages(true);
        toast.custom((t) => (
          <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-xl pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">{payload.title}</p>
                  <p className="mt-1 text-sm text-gray-500">{payload.body}</p>
                </div>
              </div>
            </div>
            <div className="flex border-r border-gray-200">
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  router.push('/chats');
                }}
                className="w-full border border-transparent rounded-none rounded-l-xl p-4 flex items-center justify-center text-sm font-medium text-primary hover:text-primary-focus focus:outline-none"
              >
                {lang === 'ar' ? 'عرض' : 'View'}
              </button>
            </div>
          </div>
        ));
      } else {
        toast.success(`${payload.title}: ${payload.body}`);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [router, lang]);

  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-2 sm:gap-4 px-3 sm:px-6 bg-white/80 dark:bg-dark-50/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5"
      style={{ height: 'var(--header-height)' }}
    >
      {/* Sidebar toggle (desktop) */}
      <button
        onClick={onToggleSidebar}
        className="btn-ghost p-2 hidden lg:flex"
        aria-label="Toggle sidebar"
      >
        <Menu size={18} />
      </button>

      {/* Mobile menu */}
      <button
        onClick={onMobileMenu}
        className="btn-ghost p-2 lg:hidden"
        aria-label="Open mobile menu"
      >
        <Menu size={18} />
      </button>

      {/* Search */}
      <motion.div
        className={`relative flex-1 max-w-[150px] sm:max-w-md transition-all duration-200 ${searchFocused ? 'max-w-[200px] sm:max-w-xl' : ''}`}
      >
        <Search
          size={16}
          className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 pointer-events-none"
        />
        <input
          type="search"
          placeholder={lang === 'ar' ? 'ابحث...' : 'Search...'}
          className="input pr-8 sm:pr-9 text-xs sm:text-sm h-9"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </motion.div>

      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-1">
        {/* Language toggle */}
        <button className="btn-ghost p-2 gap-1.5" title="Switch Language" onClick={toggleLanguage}>
          <Globe size={16} />
          <span className="text-xs font-medium hidden sm:block">
            {lang === 'ar' ? 'English' : 'العربية'}
          </span>
        </button>

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="btn-ghost p-2"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Messages Notification */}
        <button 
          onClick={() => {
            setHasNewMessages(false);
            router.push('/chats');
          }}
          className="btn-ghost p-2 relative"
        >
          <MessageSquare size={16} />
          {hasNewMessages && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary animate-pulse rounded-full" />
          )}
        </button>

        {/* General Notifications */}
        <button className="btn-ghost p-2 relative">
          <Bell size={16} />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200 dark:bg-white/10 mx-1" />

        {/* User menu */}
        <button className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
          <div className="w-7 h-7 gradient-primary rounded-lg flex items-center justify-center text-white text-xs font-bold">
            SA
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-xs font-semibold text-gray-800 dark:text-white">Super Admin</p>
            <p className="text-xs text-gray-400">المدير العام</p>
          </div>
          <ChevronDown size={14} className="text-gray-400" />
        </button>
      </div>
    </header>
  );
}
