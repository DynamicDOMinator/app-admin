'use client';

import React from 'react';
import { Plus, Edit2, Trash2, Tag, Copy } from 'lucide-react';

const coupons = [
  { id: 1, code: 'SUMMER24', type: 'نسبة مئوية', value: '20%', usage: '145/500', expiry: '2026-08-31', status: 'نشط' },
  { id: 2, code: 'WELCOME50', type: 'مبلغ ثابت', value: '50 ج.م', usage: '890/∞', expiry: 'بدون تاريخ', status: 'نشط' },
  { id: 3, code: 'EID_CLEAN', type: 'نسبة مئوية', value: '30%', usage: '500/500', expiry: '2026-06-20', status: 'منتهي' },
];

export default function CouponsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">الكوبونات</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">إدارة العروض الترويجية ورموز الخصم</p>
        </div>
        <button className="btn-primary">
          <Plus size={18} />
          إصدار كوبون جديد
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>كود الخصم</th>
              <th>النوع</th>
              <th>القيمة</th>
              <th>الاستخدام</th>
              <th>تاريخ الانتهاء</th>
              <th>الحالة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-yellow-50 dark:bg-yellow-500/10 flex items-center justify-center text-yellow-600">
                      <Tag size={20} />
                    </div>
                    <div>
                      <span className="font-bold text-gray-900 dark:text-white block">{coupon.code}</span>
                      <button className="text-xs text-primary-500 hover:underline flex items-center gap-1 mt-0.5">
                        <Copy size={12} /> نسخ الكود
                      </button>
                    </div>
                  </div>
                </td>
                <td>{coupon.type}</td>
                <td className="font-bold text-gray-900 dark:text-white">{coupon.value}</td>
                <td>{coupon.usage}</td>
                <td>{coupon.expiry}</td>
                <td>
                  <span className={coupon.status === 'نشط' ? 'badge badge-success' : 'badge badge-gray'}>
                    {coupon.status}
                  </span>
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
