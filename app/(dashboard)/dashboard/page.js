'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import {
  ShoppingBag, Users, DollarSign, TrendingUp,
  Clock, CheckCircle2, XCircle, Star, Loader2, RefreshCw,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ordersApi, usersApi, servicesApi } from '@/lib/api';
import { useLanguage } from '@/components/providers/LanguageProvider';

const SERVICE_COLORS = ['#5A8F76', '#F9C74F', '#2DC653', '#FF6B6B', '#4ECDC4', '#9B59B6'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="card px-4 py-3 shadow-xl text-sm">
        <p className="font-semibold text-gray-800 dark:text-white mb-2">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-gray-500" style={{ color: p.color }}>
            {p.name}: <span className="font-semibold">{p.name === 'revenue' ? formatCurrency(p.value) : p.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const { lang } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [serviceBreakdown, setServiceBreakdown] = useState([]);
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    setMounted(true);
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      // Fetch orders and users in parallel
      const [ordersRes, usersRes, servicesRes] = await Promise.allSettled([
        ordersApi.getAll({ limit: 5, sort: '-createdAt' }),
        usersApi.getAll({ role: 'customer', limit: 1 }),
        servicesApi.getAll({ limit: 20 }),
      ]);

      // Recent orders
      if (ordersRes.status === 'fulfilled') {
        const ordersData = ordersRes.value?.data?.docs || ordersRes.value?.data || [];
        setRecentOrders(ordersData.slice(0, 5));

        // Build stats from orders
        const allOrders = ordersData;
        const totalRevenue = allOrders.reduce((sum, o) => sum + (o.total || 0), 0);
        const pending = allOrders.filter(o => o.status === 'pending').length;
        const completed = allOrders.filter(o => o.status === 'completed').length;
        const cancelled = allOrders.filter(o => o.status === 'cancelled').length;

        setStats({
          totalRevenue,
          totalOrders: ordersRes.value?.data?.totalDocs || allOrders.length,
          pending,
          completed,
          cancelled,
          todayOrders: allOrders.filter(o => {
            const d = new Date(o.createdAt);
            const today = new Date();
            return d.toDateString() === today.toDateString();
          }).length,
        });

        // Build revenue chart (last 7 months)
        const months = lang === 'ar' 
          ? ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر']
          : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const now = new Date();
        const chartData = Array.from({ length: 6 }, (_, i) => {
          const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
          const monthOrders = allOrders.filter(o => {
            const od = new Date(o.createdAt);
            return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear();
          });
          return {
            date: months[d.getMonth()],
            revenue: monthOrders.reduce((sum, o) => sum + (o.total || 0), 0),
            orders: monthOrders.length,
          };
        });
        setRevenueData(chartData);
      }

      // Service breakdown
      if (servicesRes.status === 'fulfilled') {
        const svcs = servicesRes.value?.data?.docs || servicesRes.value?.data || [];
        const breakdown = svcs.map((s, i) => ({
          name: lang === 'ar' ? s.nameAr || s.name : s.name,
          value: s.price || s.basePrice || 100,
          color: SERVICE_COLORS[i % SERVICE_COLORS.length],
        }));
        setServiceBreakdown(breakdown.length > 0 ? breakdown : [
          { name: lang === 'ar' ? 'تنظيف منزلي' : 'Home Cleaning', value: 45, color: '#5A8F76' },
          { name: lang === 'ar' ? 'غسيل سجاد' : 'Carpet Cleaning', value: 25, color: '#F9C74F' },
          { name: lang === 'ar' ? 'غسيل سيارات' : 'Car Cleaning', value: 30, color: '#4ECDC4' },
        ]);
      }
    } catch (err) {
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  const STAT_CARDS = [
    {
      title: lang === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue',
      value: stats ? formatCurrency(stats.totalRevenue) : '...',
      icon: DollarSign,
      color: 'text-teal-600',
      bg: 'bg-teal-50 dark:bg-teal-500/10',
    },
    {
      title: lang === 'ar' ? 'إجمالي الطلبات' : 'Total Orders',
      value: stats?.totalOrders ?? '...',
      icon: ShoppingBag,
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-500/10',
    },
    {
      title: lang === 'ar' ? 'طلبات مكتملة' : 'Completed Orders',
      value: stats?.completed ?? '...',
      icon: CheckCircle2,
      color: 'text-green-600',
      bg: 'bg-green-50 dark:bg-green-500/10',
    },
    {
      title: lang === 'ar' ? 'طلبات اليوم' : 'Today Orders',
      value: stats?.todayOrders ?? '...',
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-50 dark:bg-purple-500/10',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">لوحة التحكم</h1>
          <p className="text-sm text-gray-500 mt-1">
            {formatDate(new Date())} — البيانات مباشرة من قاعدة البيانات
          </p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary" onClick={fetchDashboard} disabled={loading}>
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> تحديث
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {STAT_CARDS.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="card p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-xl ${card.bg}`}>
                <card.icon size={20} className={card.color} />
              </div>
              {loading && <Loader2 size={16} className="animate-spin text-gray-300" />}
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {loading ? <span className="inline-block w-20 h-7 bg-gray-200 dark:bg-white/10 rounded animate-pulse" /> : card.value}
            </p>
            <p className="text-sm text-gray-500 mt-1">{card.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="xl:col-span-2 card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">الإيرادات الشهرية</h2>
              <p className="text-sm text-gray-400 mt-0.5">آخر 6 أشهر</p>
            </div>
          </div>
          {loading ? (
            <div className="h-64 bg-gray-100 dark:bg-white/5 rounded-xl animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={revenueData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5A8F76" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#5A8F76" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:opacity-10" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" name="revenue" stroke="#5A8F76" strokeWidth={2.5} fill="url(#revenueGrad)" dot={{ r: 4, fill: '#5A8F76' }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Service Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="card p-6"
        >
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">توزيع الخدمات</h2>
          <p className="text-sm text-gray-400 mb-5">الخدمات المسجلة</p>
          {loading ? (
            <div className="h-48 bg-gray-100 dark:bg-white/5 rounded-xl animate-pulse" />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={serviceBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                    {serviceBreakdown.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-3 space-y-2">
                {serviceBreakdown.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                      <span className="text-gray-600 dark:text-gray-400 truncate max-w-[100px]">{item.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'طلبات اليوم', value: stats?.todayOrders ?? '...', icon: ShoppingBag, color: 'text-teal-500' },
          { label: 'قيد الانتظار', value: stats?.pending ?? '...', icon: Clock, color: 'text-yellow-500' },
          { label: 'مكتملة', value: stats?.completed ?? '...', icon: CheckCircle2, color: 'text-green-500' },
          { label: 'ملغاة', value: stats?.cancelled ?? '...', icon: XCircle, color: 'text-red-500' },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.55 + i * 0.08 }}
            className="card p-4 flex items-center gap-4"
          >
            <div className={`p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 ${item.color}`}>
              <item.icon size={18} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {loading ? <span className="inline-block w-8 h-5 bg-gray-200 dark:bg-white/10 rounded animate-pulse" /> : item.value}
              </p>
              <p className="text-xs text-gray-400">{item.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="card"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-50 dark:border-white/5">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">أحدث الطلبات</h2>
          <a href="/dashboard/orders" className="text-sm text-teal-600 font-medium hover:underline">عرض الكل ←</a>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 dark:bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="p-12 text-center text-gray-400">لا توجد طلبات بعد</div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>رقم الطلب</th>
                  <th>العميل</th>
                  <th>الحالة</th>
                  <th>المبلغ</th>
                  <th>التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order._id}>
                    <td><span className="font-mono text-xs text-teal-600 font-semibold">{order.orderNumber}</span></td>
                    <td className="font-medium">{order.customer?.name || order.customer?.nameAr || '—'}</td>
                    <td>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'completed' ? 'bg-green-100 text-green-700'
                        : order.status === 'cancelled' ? 'bg-red-100 text-red-700'
                        : order.status === 'pending' ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-blue-100 text-blue-700'
                      }`}>
                        {order.status === 'pending' ? 'قيد الانتظار'
                         : order.status === 'completed' ? 'مكتمل'
                         : order.status === 'cancelled' ? 'ملغى'
                         : order.status === 'in_progress' ? 'قيد التنفيذ'
                         : order.status}
                      </span>
                    </td>
                    <td className="font-semibold">{formatCurrency(order.total)}</td>
                    <td className="text-gray-400 text-xs">{formatDate(order.scheduledDate || order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
