'use client';

import React from 'react';
import { Send, Bell, Filter } from 'lucide-react';

const notifications = [
  { id: 1, title: 'خصم 20% على النظافة العميقة', body: 'استخدم كود SUMMER24 واستمتع بخصم 20% الآن!', audience: 'جميع العملاء', date: '2026-07-01 10:00 ص', status: 'مُرسل' },
  { id: 2, title: 'تذكير بموعد الزيارة', body: 'عزيزي العميل، لديك موعد غداً الساعة 9 صباحاً.', audience: 'مخصص', date: '2026-06-30 08:00 م', status: 'مُرسل' },
  { id: 3, title: 'تحديث التطبيق', body: 'يرجى تحديث التطبيق للحصول على أحدث الميزات.', audience: 'الجميع', date: '2026-06-25 12:00 م', status: 'مُرسل' },
];

export default function NotificationsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">الإشعارات</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">مركز إرسال الإشعارات وتنبيهات التطبيق (Push Notifications)</p>
        </div>
        <button className="btn-primary">
          <Send size={18} />
          إرسال إشعار جديد
        </button>
      </div>

      <div className="card p-5">
        <div className="flex items-center gap-3 mb-6">
          <button className="btn-secondary">
            <Filter size={18} />
            تصفية
          </button>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>عنوان الإشعار</th>
                <th>الجمهور المستهدف</th>
                <th>تاريخ الإرسال</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((note) => (
                <tr key={note.id}>
                  <td>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-white/5 flex items-center justify-center text-primary-500 mt-1 flex-shrink-0">
                        <Bell size={18} />
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 dark:text-white block">{note.title}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{note.body}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-gray">{note.audience}</span>
                  </td>
                  <td className="text-gray-600 dark:text-gray-400">{note.date}</td>
                  <td>
                    <span className="badge badge-success">{note.status}</span>
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
