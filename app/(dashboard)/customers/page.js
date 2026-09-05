'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Search, Star, Phone, Eye, Shield, Loader2, RefreshCw, AlertCircle, Users, CheckCircle2, UserX, X, Mail, Calendar, ShoppingBag } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { usersApi } from '@/lib/api';

export default function CustomersPage() {
  const { lang } = useLanguage();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [blockingId, setBlockingId] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await usersApi.getAll({ role: 'customer', limit: 100, sort: '-createdAt' });
      setCustomers(res?.data?.docs || res?.data || []);
    } catch (err) {
      setError(err?.message || (lang === 'ar' ? 'فشل تحميل العملاء' : 'Failed to load customers'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [lang]);

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

  const filtered = customers.filter(c => {
    const name = (c.nameAr || c.name || '').toLowerCase();
    const phone = (c.phone || '').toLowerCase();
    const email = (c.email || '').toLowerCase();
    const query = search.toLowerCase();
    const matchesSearch = name.includes(query) || phone.includes(query) || email.includes(query);

    if (!matchesSearch) return false;
    if (statusFilter === 'active') return !c.isBlocked;
    if (statusFilter === 'blocked') return c.isBlocked;
    return true;
  });

  const activeCount = customers.filter(c => !c.isBlocked).length;
  const blockedCount = customers.filter(c => c.isBlocked).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {lang === 'ar' ? 'إدارة العملاء' : 'Customers Management'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? (lang === 'ar' ? 'جاري التحميل...' : 'Loading...') : `${filtered.length} ${lang === 'ar' ? 'عميل' : 'Customers'}`}
          </p>
        </div>
        <button className="btn-secondary self-start sm:self-auto" onClick={fetchCustomers} disabled={loading}>
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> {lang === 'ar' ? 'تحديث' : 'Refresh'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center text-teal-600">
            <Users size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{customers.length}</p>
            <p className="text-xs text-gray-500">{lang === 'ar' ? 'إجمالي العملاء' : 'Total Customers'}</p>
          </div>
        </div>

        <div className="card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-600">{activeCount}</p>
            <p className="text-xs text-gray-500">{lang === 'ar' ? 'حسابات نشطة' : 'Active Accounts'}</p>
          </div>
        </div>

        <div className="card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-600">
            <UserX size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-rose-600">{blockedCount}</p>
            <p className="text-xs text-gray-500">{lang === 'ar' ? 'حسابات موقوفة' : 'Blocked Accounts'}</p>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="card p-4 border border-red-200 bg-red-50 dark:bg-red-500/10 flex items-center gap-3">
          <AlertCircle className="text-red-500" size={18} />
          <p className="text-red-600 text-sm flex-1">{error}</p>
          <button onClick={fetchCustomers} className="btn-secondary text-sm">{lang === 'ar' ? 'إعادة المحاولة' : 'Retry'}</button>
        </div>
      )}

      {/* Search & Status Filter */}
      <div className="card p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search size={15} className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={lang === 'ar' ? 'ابحث بالاسم، البريد الإلكتروني، أو الهاتف...' : 'Search by name, email or phone...'}
            className="input pr-9"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {[
            { id: 'all', label: lang === 'ar' ? 'الكل' : 'All' },
            { id: 'active', label: lang === 'ar' ? 'نشط' : 'Active' },
            { id: 'blocked', label: lang === 'ar' ? 'موقوف' : 'Blocked' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                statusFilter === tab.id
                  ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                  : 'bg-white dark:bg-dark-50 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:border-teal-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table Section */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 dark:bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            {lang === 'ar' ? 'لا يوجد عملاء مطابقون لبحثك' : 'No matching customers found'}
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>{lang === 'ar' ? 'العميل' : 'Customer'}</th>
                  <th>{lang === 'ar' ? 'الهاتف' : 'Phone'}</th>
                  <th>{lang === 'ar' ? 'الطلبات' : 'Orders'}</th>
                  <th>{lang === 'ar' ? 'التقييم' : 'Rating'}</th>
                  <th>{lang === 'ar' ? 'تاريخ التسجيل' : 'Joined Date'}</th>
                  <th>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                  <th className="text-center">{lang === 'ar' ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((customer) => {
                  const customerName = customer.nameAr || customer.name || 'عميل';
                  const customerEmail = customer.email || '—';
                  const customerPhone = customer.phone || '—';

                  return (
                    <tr key={customer._id}>
                      {/* Customer Info */}
                      <td>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, #5A8F76, #3d6b57)' }}
                          >
                            {customerName[0]}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-white truncate">{customerName}</p>
                            <p className="text-xs text-gray-400 truncate">{customerEmail}</p>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="text-sm font-mono text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-1.5">
                          <Phone size={13} className="text-gray-400" />
                          <span dir="ltr">{customerPhone}</span>
                        </div>
                      </td>

                      {/* Total Orders */}
                      <td>
                        <span className="font-bold text-gray-900 dark:text-white">{customer.totalOrders || 0}</span>
                        <span className="text-xs text-gray-400 ml-1">{lang === 'ar' ? 'طلب' : 'orders'}</span>
                      </td>

                      {/* Rating */}
                      <td>
                        <div className="flex items-center gap-1">
                          <Star size={13} className="text-amber-400 fill-amber-400" />
                          <span className="font-bold text-gray-900 dark:text-white text-sm">
                            {customer.avgRating ? customer.avgRating.toFixed(1) : '—'}
                          </span>
                        </div>
                      </td>

                      {/* Joined Date */}
                      <td className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(customer.createdAt)}
                      </td>

                      {/* Status */}
                      <td>
                        <span className={customer.isBlocked ? 'badge-danger' : 'badge-success'}>
                          {customer.isBlocked ? (lang === 'ar' ? 'موقوف' : 'Blocked') : (lang === 'ar' ? 'نشط' : 'Active')}
                        </span>
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setSelectedCustomer(customer)}
                            className="btn-ghost p-1.5 text-teal-600 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-500/10"
                            title={lang === 'ar' ? 'عرض الملف' : 'View Profile'}
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleBlock(customer)}
                            disabled={blockingId === customer._id}
                            className={`btn-ghost p-1.5 rounded-lg border border-transparent ${
                              customer.isBlocked
                                ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'
                                : 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10'
                            }`}
                            title={customer.isBlocked ? (lang === 'ar' ? 'رفع الحظر' : 'Unblock') : (lang === 'ar' ? 'حظر الحساب' : 'Block')}
                          >
                            {blockingId === customer._id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Shield size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Customer Profile Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-dark-50 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col"
          >
            <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                  style={{ background: 'linear-gradient(135deg, #5A8F76, #3d6b57)' }}
                >
                  {(selectedCustomer.nameAr || selectedCustomer.name || '؟')[0]}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {selectedCustomer.nameAr || selectedCustomer.name}
                  </h2>
                  <p className="text-xs text-gray-400">{selectedCustomer.email || '—'}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                    <Phone size={13} />
                    <span>{lang === 'ar' ? 'رقم الهاتف' : 'Phone'}</span>
                  </div>
                  <p className="text-sm font-semibold font-mono text-gray-900 dark:text-white" dir="ltr">
                    {selectedCustomer.phone || '—'}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                    <Calendar size={13} />
                    <span>{lang === 'ar' ? 'تاريخ الانضمام' : 'Joined Date'}</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatDate(selectedCustomer.createdAt)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-1 text-teal-600">
                    <ShoppingBag size={16} />
                    <span className="text-lg font-bold">{selectedCustomer.totalOrders || 0}</span>
                  </div>
                  <p className="text-xs text-gray-400">{lang === 'ar' ? 'إجمالي الطلبات' : 'Total Orders'}</p>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl text-center">
                  <div className="flex items-center justify-center gap-1 mb-1 text-amber-500">
                    <Star size={16} className="fill-amber-400" />
                    <span className="text-lg font-bold">
                      {selectedCustomer.avgRating ? selectedCustomer.avgRating.toFixed(1) : 'N/A'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{lang === 'ar' ? 'متوسط التقييم' : 'Average Rating'}</p>
                </div>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl flex items-center justify-between">
                <span className="text-xs text-gray-400">{lang === 'ar' ? 'حالة الحساب' : 'Account Status'}</span>
                <span className={selectedCustomer.isBlocked ? 'badge-danger' : 'badge-success'}>
                  {selectedCustomer.isBlocked ? (lang === 'ar' ? 'موقوف' : 'Blocked') : (lang === 'ar' ? 'نشط' : 'Active')}
                </span>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-white/10 flex justify-between items-center">
              <button
                onClick={() => handleBlock(selectedCustomer)}
                className={`btn text-xs py-2 ${selectedCustomer.isBlocked ? 'btn-secondary text-emerald-600' : 'btn-danger'}`}
              >
                <Shield size={14} />
                {selectedCustomer.isBlocked ? (lang === 'ar' ? 'رفع الحظر' : 'Unblock') : (lang === 'ar' ? 'حظر الحساب' : 'Block Account')}
              </button>

              <button onClick={() => setSelectedCustomer(null)} className="btn-secondary text-xs py-2">
                {lang === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
