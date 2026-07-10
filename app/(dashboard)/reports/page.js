'use client';

import React from 'react';
import { Download, TrendingUp, Users, ShoppingBag, DollarSign } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const data = [
  { name: 'يناير', revenue: 4000, orders: 240 },
  { name: 'فبراير', revenue: 3000, orders: 139 },
  { name: 'مارس', revenue: 2000, orders: 980 },
  { name: 'أبريل', revenue: 2780, orders: 390 },
  { name: 'مايو', revenue: 1890, orders: 480 },
  { name: 'يونيو', revenue: 2390, orders: 380 },
  { name: 'يوليو', revenue: 3490, orders: 430 },
];

export default function ReportsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">التقارير والتحليلات</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">مؤشرات الأداء والنمو للمنصة</p>
        </div>
        <button className="btn-primary">
          <Download size={18} />
          تصدير التقرير (PDF)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">نمو الإيرادات</h3>
          <div className="h-80 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1677FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1677FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value} ج.م`} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#1677FF" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">معدل الطلبات</h3>
          <div className="h-80 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="orders" fill="#2DC653" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
