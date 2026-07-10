'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Search, Star, MapPin, CheckCircle, XCircle, Phone, Plus } from 'lucide-react';

import { useLanguage } from '@/components/providers/LanguageProvider';

const EMPLOYEES = Array.from({ length: 10 }, (_, i) => ({
  _id: String(i + 1),
  user: {
    name: ['محمد أحمد', 'خالد العمري', 'سلطان المطيري', 'يوسف القحطاني', 'عمر الشهري'][i % 5],
    phone: `+9665${String(i).padStart(8, '0')}`,
    avatar: null,
  },
  employeeId: `EMP-${String(i + 1).padStart(5, '0')}`,
  specializations: [['home_cleaning', 'furniture_cleaning'], ['car_cleaning'], ['carpet_cleaning', 'curtain_cleaning']][i % 3],
  averageRating: (4 + Math.random()).toFixed(1),
  totalJobsCompleted: 15 + i * 7,
  performanceScore: 80 + i * 2,
  isAvailable: i % 3 !== 0,
  isOnJob: i % 3 === 1,
  contractType: ['full_time', 'part_time'][i % 2],
}));

const specialLabelsAr = {
  home_cleaning: 'تنظيف منزل',
  furniture_cleaning: 'أثاث',
  car_cleaning: 'سيارات',
  carpet_cleaning: 'سجاد',
  curtain_cleaning: 'ستائر',
};
const specialLabelsEn = {
  home_cleaning: 'Home Cleaning',
  furniture_cleaning: 'Furniture',
  car_cleaning: 'Car',
  carpet_cleaning: 'Carpet',
  curtain_cleaning: 'Curtain',
};

export default function EmployeesPage() {
  const { lang } = useLanguage();
  const [search, setSearch] = useState('');
  const filtered = EMPLOYEES.filter(e => e.user.name.includes(search) || e.employeeId.includes(search));
  const specialLabels = lang === 'ar' ? specialLabelsAr : specialLabelsEn;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{lang === 'ar' ? 'الموظفون' : 'Employees'}</h1>
          <p className="text-sm text-gray-500 mt-1">{filtered.length} {lang === 'ar' ? 'موظف' : 'Employee'}</p>
        </div>
        <button className="btn-primary"><Plus size={15} /> {lang === 'ar' ? 'إضافة موظف' : 'Add Employee'}</button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: lang === 'ar' ? 'إجمالي الموظفين' : 'Total Employees', value: EMPLOYEES.length },
          { label: lang === 'ar' ? 'متاح الآن' : 'Available', value: EMPLOYEES.filter(e => e.isAvailable).length, color: 'text-success-500' },
          { label: lang === 'ar' ? 'في عمل' : 'On Job', value: EMPLOYEES.filter(e => e.isOnJob).length, color: 'text-yellow-500' },
        ].map(s => (
          <div key={s.label} className="card p-4 text-center">
            <p className={`text-2xl font-bold ${s.color || 'text-gray-900 dark:text-white'}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="relative max-w-sm">
          <Search size={15} className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={lang === 'ar' ? 'ابحث بالاسم أو الرقم...' : 'Search by name or ID...'} className="input pr-9" />
        </div>
      </div>

      {/* Employee Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((emp, i) => (
          <motion.div
            key={emp._id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="card p-5"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center text-white font-bold">
                  {emp.user.name[0]}
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-dark-50 ${emp.isOnJob ? 'bg-yellow-400' : emp.isAvailable ? 'bg-success-500' : 'bg-gray-300'}`} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white">{emp.user.name}</p>
                <p className="text-xs text-gray-400 font-mono">{emp.employeeId}</p>
              </div>
              <span className={emp.isOnJob ? 'badge-warning' : emp.isAvailable ? 'badge-success' : 'badge-gray'}>
                {emp.isOnJob ? (lang === 'ar' ? 'في عمل' : 'On Job') : emp.isAvailable ? (lang === 'ar' ? 'متاح' : 'Available') : (lang === 'ar' ? 'غير متاح' : 'Unavailable')}
              </span>
            </div>

            {/* Specs */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {emp.specializations.map(s => (
                <span key={s} className="badge-primary text-xs">{specialLabels[s] || s}</span>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center p-2.5 bg-gray-50 dark:bg-white/5 rounded-xl">
                <div className="flex justify-center items-center gap-0.5">
                  <Star size={11} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{emp.averageRating}</span>
                </div>
                <p className="text-xs text-gray-400">{lang === 'ar' ? 'تقييم' : 'Rating'}</p>
              </div>
              <div className="text-center p-2.5 bg-gray-50 dark:bg-white/5 rounded-xl">
                <p className="text-sm font-bold text-gray-900 dark:text-white">{emp.totalJobsCompleted}</p>
                <p className="text-xs text-gray-400">{lang === 'ar' ? 'وظيفة' : 'Jobs'}</p>
              </div>
              <div className="text-center p-2.5 bg-gray-50 dark:bg-white/5 rounded-xl">
                <p className="text-sm font-bold text-gray-900 dark:text-white">{emp.performanceScore}%</p>
                <p className="text-xs text-gray-400">{lang === 'ar' ? 'أداء' : 'Perf'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Phone size={12} />
              <span>{emp.user.phone}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
