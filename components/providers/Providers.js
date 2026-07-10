'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';

import { LanguageProvider } from './LanguageProvider';

export default function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <LanguageProvider>
        {children}
        <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1677FF',
            color: '#fff',
            borderRadius: '12px',
            fontFamily: 'inherit',
            fontSize: '14px',
          },
          success: { style: { background: '#2DC653' } },
          error: { style: { background: '#ef4444' } },
        }}
        />
      </LanguageProvider>
    </ThemeProvider>
  );
}
