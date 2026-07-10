'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Search, Star, Phone, Eye, Shield, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { usersApi } from '@/lib/api';

export default function CustomersPage() {
  const { lang } = useLanguage();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [blockingId, setBlockingId] = useState(null);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await usersApi.getAll({ role: 'customer', limit: 50, sort: '-createdAt' });
      setCustomers(res?.data?.docs || res?.data || []);
    } catch (err) {
      setError(err?.message || (lang === 'ar' ? 'فشل تحميل العملاء' : 'Failed to load customers'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, [lang]);

  const handleBlock = async (customer) => {
    const msg = lang === 'ar' 
      ? `هل تريد ${customer.isBlocked ? 'رفع الحظر عن' : 'حظر'} ${customer.nameAr || customer.name}؟`
      : `Do you want to ${customer.isBlocked ? 'unblock' : 'block'} ${customer.name}?`;
    if (!confirm(msg)) return;
    
    setBlockingId(customer._id);
    try {
      await usersApi.block(customer._id);
      setCustomers(prev => prev.map(c =>
        c._id === customer._id ? { ...c, isBlocked: !c.isBlocked } : c
      ));
    } catch (err) {
      alert(lang === 'ar' ? 'فشل تنفيذ العملية' : 'Operation failed');
    } finally {
      setBlockingId(null);
    }
  };

  const filtered = customers.filter(c =>
    (c.nameAr || c.name || '').includes(search) ||
    (c.phone || '').includes(search) ||
    (c.email || '').includes(search)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {lang === 'ar' ? 'العملاء' : 'Customers'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? (lang === 'ar' ? 'جاري التحميل...' : 'Loading...') : `${filtered.length} ${lang === 'ar' ? 'عميل مسجل' : 'Registered Customers'}`}
          </p>
        </div>
        <button className="btn-secondary" onClick={fetchCustomers} disabled={loading}>
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> {lang === 'ar' ? 'تحديث' : 'Refresh'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="card p-4 border border-red-200 bg-red-50 dark:bg-red-500/10 flex items-center gap-3">
          <AlertCircle className="text-red-500" size={18} />
          <p className="text-red-600 text-sm flex-1">{error}</p>
          <button onClick={fetchCustomers} className="btn-secondary text-sm">{lang === 'ar' ? 'إعادة المحاولة' : 'Retry'}</button>
        </div>
      )}

      {/* Search */}
      <div className="card p-4">
        <div className="relative max-w-sm">
          <Search size={15} className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={lang === 'ar' ? 'ابحث بالاسم أو الهاتف أو البريد...' : 'Search by name, phone or email...'}
            className="input pr-9"
          />
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-2xl bg-gray-200 dark:bg-white/10" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-100 dark:bg-white/5 rounded w-1/2" />
                </div>
              </div>
              <div className="h-16 bg-gray-100 dark:bg-white/5 rounded-xl mb-3" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && !error && (
        <div className="card p-12 text-center text-gray-400">
          <p className="text-lg">{lang === 'ar' ? 'لا يوجد عملاء مطابقون' : 'No customers found'}</p>
        </div>
      )}

      {/* Customer Cards */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((customer, i) => (
            <motion.div
              key={customer._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card p-5 hover:shadow-card-hover transition-all duration-200"
            >
              {/* Avatar + Name */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #5A8F76, #3d6b57)' }}>
                  {(customer.nameAr || customer.name || '؟')[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white truncate">
                    {customer.nameAr || customer.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{customer.email}</p>
                </div>
                <span className={customer.isBlocked ? 'badge-danger' : 'badge-success'}>
                  {customer.isBlocked ? 'موقوف' : 'نشط'}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="text-center p-2.5 bg-gray-50 dark:bg-white/5 rounded-xl">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {customer.totalOrders || 0}
                  </p>
                  <p className="text-xs text-gray-400">طلبات</p>
                </div>
                <div className="text-center p-2.5 bg-gray-50 dark:bg-white/5 rounded-xl">
                  <div className="flex items-center justify-center gap-0.5">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    <p className="text-base font-bold text-gray-900 dark:text-white">
                      {customer.avgRating?.toFixed(1) || 'N/A'}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400">تقييم</p>
                </div>
              </div>

              {/* Phone & Date */}
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                <Phone size={12} />
                <span>{customer.phone || 'غير محدد'}</span>
                <span className="mx-1">·</span>
                <span>منذ {formatDate(customer.createdAt)}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="btn-secondary flex-1 text-xs py-1.5">
                  <Eye size={13} /> عرض الملف
                </button>
                <button
                  onClick={() => handleBlock(customer)}
                  disabled={blockingId === customer._id}
                  className={`btn-ghost p-1.5 rounded-xl border border-gray-200 dark:border-white/10 ${customer.isBlocked ? 'text-green-500' : 'text-red-500'}`}
                  title={customer.isBlocked ? 'رفع الحظر' : 'حظر'}
                >
                  {blockingId === customer._id
                    ? <Loader2 size={15} className="animate-spin" />
                    : <Shield size={15} />
                  }
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
