'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useLanguage } from '@/components/providers/LanguageProvider';
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  UserCheck,
  Package,
  Tag,
  CreditCard,
  BarChart3,
  Settings,
  Bell,
  Image,
  Calendar,
  ChevronLeft,
  Waves,
  Star,
  Layers,
  MessageSquare,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', labelAr: 'الرئيسية' },
  { href: '/orders', icon: ShoppingBag, label: 'Orders', labelAr: 'الطلبات' },
  { href: '/customers', icon: Users, label: 'Customers', labelAr: 'العملاء' },
  { href: '/employees', icon: UserCheck, label: 'Employees', labelAr: 'الموظفين' },
  { href: '/services', icon: Package, label: 'Services', labelAr: 'الخدمات' },
  { href: '/packages', icon: Layers, label: 'Packages', labelAr: 'الباقات' },
  { href: '/reviews', icon: Star, label: 'Reviews', labelAr: 'التقييمات' },
  { href: '/coupons', icon: Tag, label: 'Coupons', labelAr: 'الكوبونات' },
  { href: '/payments', icon: CreditCard, label: 'Payments', labelAr: 'المدفوعات' },
  { href: '/notifications', icon: Bell, label: 'Notifications', labelAr: 'الإشعارات' },
  { href: '/chats', icon: MessageSquare, label: 'Chats', labelAr: 'المحادثات' },
  { href: '/banners', icon: Image, label: 'Banners', labelAr: 'البنرات' },
  { href: '/settings', icon: Settings, label: 'Settings', labelAr: 'الإعدادات' },
];

export default function Sidebar({ collapsed, mobileOpen, onMobileClose }) {
  const pathname = usePathname();
  const { lang } = useLanguage();

  const mobileX = lang === 'ar' ? 260 : -260;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={clsx(
          'sidebar hidden lg:flex flex-col shadow-lg',
          collapsed && 'collapsed'
        )}
      >
        <SidebarContent collapsed={collapsed} pathname={pathname} lang={lang} />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: mobileX }}
            animate={{ x: 0 }}
            exit={{ x: mobileX }}
            transition={{ type: 'tween', duration: 0.2, ease: 'easeInOut' }}
            className="sidebar flex flex-col lg:hidden shadow-2xl z-50"
          >
            <SidebarContent collapsed={false} pathname={pathname} lang={lang} onClose={onMobileClose} />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

function SidebarContent({ collapsed, pathname, lang, onClose }) {
  return (
    <div className="flex flex-col h-full">
      <div className={clsx('flex items-center gap-3 py-5 border-b border-gray-100 dark:border-white/5', collapsed ? 'justify-center px-0' : 'px-4')}>
        <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
          <Waves size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap">
              {lang === 'ar' ? 'المتحدة للنظافة' : 'United Cleaning'}
            </p>
            <p className="text-xs text-gray-400 whitespace-nowrap">Admin Dashboard</p>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={clsx('nav-item', isActive && 'active', collapsed && 'justify-center !px-0')}
              title={collapsed ? (lang === 'ar' ? item.labelAr : item.label) : undefined}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && (
                <span className="text-sm whitespace-nowrap">
                  {lang === 'ar' ? item.labelAr : item.label}
                </span>
              )}
              {isActive && !collapsed && (
                <div className="ms-auto w-1.5 h-1.5 rounded-full bg-primary-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User info at bottom */}
      <div className="p-3 border-t border-gray-100 dark:border-white/5">
        <div className={clsx('flex items-center gap-3 px-2 py-2', collapsed && 'justify-center')}>
          <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            SA
          </div>
          {!collapsed && (
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-white">Super Admin</p>
              <p className="text-xs text-gray-400">superadmin@unitedcleaning.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
