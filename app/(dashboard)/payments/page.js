'use client';

import React from 'react';
import { Download, CreditCard, ArrowUpRight, ArrowDownRight, Search } from 'lucide-react';

import { useLanguage } from '@/components/providers/LanguageProvider';

const payments = [
  { id: 'TRX-9823', user: 'محمد خالد', userEn: 'Mohammed Khaled', amount: '350', method: 'بطاقة ائتمان', methodEn: 'Credit Card', date: '2026-07-01', status: 'مكتمل', statusEn: 'Completed' },
  { id: 'TRX-9824', user: 'سارة أحمد', userEn: 'Sarah Ahmed', amount: '150', method: 'Apple Pay', methodEn: 'Apple Pay', date: '2026-07-01', status: 'مكتمل', statusEn: 'Completed' },
  { id: 'TRX-9825', user: 'عبدالله فهد', userEn: 'Abdullah Fahad', amount: '500', method: 'تحويل بنكي', methodEn: 'Bank Transfer', date: '2026-06-30', status: 'قيد المعالجة', statusEn: 'Processing' },
  { id: 'TRX-9826', user: 'نورة سعد', userEn: 'Noura Saad', amount: '200', method: 'بطاقة مدى', methodEn: 'Mada Card', date: '2026-06-30', status: 'مسترد', statusEn: 'Refunded' },
];

export default function PaymentsPage() {
  const { lang } = useLanguage();
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{lang === 'ar' ? 'المدفوعات' : 'Payments'}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{lang === 'ar' ? 'سجل المعاملات المالية والمحافظ' : 'Financial transactions and wallets'}</p>
        </div>
        <button className="btn-secondary">
          <Download size={18} />
          {lang === 'ar' ? 'تصدير كشف حساب' : 'Export Statement'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{lang === 'ar' ? 'إجمالي الإيرادات (الشهر)' : 'Total Revenue (Month)'}</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">45,230 {lang === 'ar' ? 'ج.م' : 'EGP'}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-success-500/10 flex items-center justify-center text-success-600">
              <ArrowUpRight size={20} />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{lang === 'ar' ? 'المدفوعات المعلقة' : 'Pending Payments'}</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">1,450 {lang === 'ar' ? 'ج.م' : 'EGP'}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-yellow-400/10 flex items-center justify-center text-yellow-600">
              <CreditCard size={20} />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{lang === 'ar' ? 'المبالغ المستردة' : 'Refunds'}</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">850 {lang === 'ar' ? 'ج.م' : 'EGP'}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-600">
              <ArrowDownRight size={20} />
            </div>
          </div>
        </div>
      </div>

      <div className="card p-5">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder={lang === 'ar' ? 'ابحث برقم العملية أو اسم العميل...' : 'Search by transaction ID or customer...'} className="input pr-10" />
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>{lang === 'ar' ? 'رقم العملية' : 'Transaction ID'}</th>
                <th>{lang === 'ar' ? 'العميل' : 'Customer'}</th>
                <th>{lang === 'ar' ? 'المبلغ' : 'Amount'}</th>
                <th>{lang === 'ar' ? 'طريقة الدفع' : 'Payment Method'}</th>
                <th>{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                <th>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td className="font-medium text-gray-900 dark:text-white">{payment.id}</td>
                  <td>{lang === 'ar' ? payment.user : payment.userEn}</td>
                  <td className="font-bold text-primary-600">{payment.amount} {lang === 'ar' ? 'ج.م' : 'EGP'}</td>
                  <td>{lang === 'ar' ? payment.method : payment.methodEn}</td>
                  <td>{payment.date}</td>
                  <td>
                    <span className={
                      payment.status === 'مكتمل' ? 'badge badge-success' :
                      payment.status === 'قيد المعالجة' ? 'badge badge-warning' : 'badge badge-danger'
                    }>
                      {lang === 'ar' ? payment.status : payment.statusEn}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
