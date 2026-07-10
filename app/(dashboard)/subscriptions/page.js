'use client';

import React from 'react';
import { Plus, Edit2, Trash2, Calendar } from 'lucide-react';

import { useLanguage } from '@/components/providers/LanguageProvider';

const plans = [
  { id: 1, name: 'باقة التوفير الشهري', nameEn: 'Monthly Saver', price: 500, cycle: 'شهري', cycleEn: 'Monthly', subscribers: 142, status: 'نشط', statusEn: 'Active' },
  { id: 2, name: 'باقة النظافة العميقة', nameEn: 'Deep Clean', price: 1200, cycle: 'نصف سنوي', cycleEn: 'Bi-Annual', subscribers: 85, status: 'نشط', statusEn: 'Active' },
  { id: 3, name: 'الباقة الذهبية للأعمال', nameEn: 'Golden Business', price: 3000, cycle: 'سنوي', cycleEn: 'Annual', subscribers: 24, status: 'نشط', statusEn: 'Active' },
];

export default function SubscriptionsPage() {
  const { lang } = useLanguage();

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{lang === 'ar' ? 'الاشتراكات' : 'Subscriptions'}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{lang === 'ar' ? 'إدارة باقات النظافة الدورية' : 'Manage cleaning packages'}</p>
        </div>
        <button className="btn-primary">
          <Plus size={18} />
          {lang === 'ar' ? 'إضافة باقة جديدة' : 'Add Package'}
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>{lang === 'ar' ? 'الباقة' : 'Package'}</th>
              <th>{lang === 'ar' ? 'السعر (ج.م)' : 'Price (EGP)'}</th>
              <th>{lang === 'ar' ? 'دورة الفوترة' : 'Billing Cycle'}</th>
              <th>{lang === 'ar' ? 'المشتركين' : 'Subscribers'}</th>
              <th>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
              <th>{lang === 'ar' ? 'الإجراءات' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-white/5 flex items-center justify-center text-primary-500">
                      <Calendar size={20} />
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">{lang === 'ar' ? plan.name : plan.nameEn}</span>
                  </div>
                </td>
                <td className="font-medium text-gray-900 dark:text-white">{plan.price} {lang === 'ar' ? 'ج.م' : 'EGP'}</td>
                <td>{lang === 'ar' ? plan.cycle : plan.cycleEn}</td>
                <td>
                  <span className="badge badge-gray">{plan.subscribers} {lang === 'ar' ? 'عميل' : 'Customer'}</span>
                </td>
                <td>
                  <span className="badge badge-success">{lang === 'ar' ? plan.status : plan.statusEn}</span>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-500 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
