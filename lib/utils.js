import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const ORDER_STATUS_LABELS = {
  pending: { en: 'Pending', ar: 'معلق', class: 'status-pending' },
  confirmed: { en: 'Confirmed', ar: 'مؤكد', class: 'status-confirmed' },
  assigned: { en: 'Assigned', ar: 'مخصص', class: 'status-assigned' },
  on_the_way: { en: 'On the Way', ar: 'في الطريق', class: 'status-on_the_way' },
  started: { en: 'Started', ar: 'بدأ', class: 'status-started' },
  completed: { en: 'Completed', ar: 'مكتمل', class: 'status-completed' },
  cancelled: { en: 'Cancelled', ar: 'ملغي', class: 'status-cancelled' },
  refunded: { en: 'Refunded', ar: 'مسترد', class: 'status-refunded' },
};

export const SERVICE_TYPE_LABELS = {
  home_cleaning: { en: 'Home Cleaning', ar: 'تنظيف منزل' },
  furniture_cleaning: { en: 'Furniture Cleaning', ar: 'تنظيف أثاث' },
  carpet_cleaning: { en: 'Carpet Cleaning', ar: 'تنظيف سجاد' },
  curtain_cleaning: { en: 'Curtain Cleaning', ar: 'تنظيف ستائر' },
  car_cleaning: { en: 'Car Cleaning', ar: 'تنظيف سيارة' },
  laundry: { en: 'Laundry', ar: 'غسيل وكي' },
};

export const formatCurrency = (amount, currency = 'EGP', locale = 'ar-EG') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount || 0);
};

export const formatDate = (date, locale = 'ar-SA') => {
  if (!date) return '—';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric', month: 'short', day: 'numeric',
  }).format(new Date(date));
};

export const formatDateTime = (date, locale = 'ar-SA') => {
  if (!date) return '—';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(date));
};
