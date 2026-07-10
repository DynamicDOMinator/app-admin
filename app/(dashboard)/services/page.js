'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DollarSign, Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Package, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { servicesApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

const SERVICE_COLORS = {
  home_cleaning: '#5A8F76',
  furniture_cleaning: '#F9C74F',
  carpet_cleaning: '#2DC653',
  curtain_cleaning: '#FF6B6B',
  car_cleaning: '#4ECDC4',
  laundry: '#9B59B6',
};

import { useLanguage } from '@/components/providers/LanguageProvider';

export default function ServicesPage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await servicesApi.getAll({ limit: 50 });
      setServices(res.data?.docs || res.data || []);
    } catch (err) {
      setError(err?.message || (lang === 'ar' ? 'فشل تحميل الخدمات' : 'Failed to load services'));
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const handleToggle = async (service) => {
    setTogglingId(service._id);
    try {
      await servicesApi.update(service._id, { isActive: !service.isActive });
      setServices(prev => prev.map(s =>
        s._id === service._id ? { ...s, isActive: !s.isActive } : s
      ));
    } catch (err) {
      alert(lang === 'ar' ? 'فشل تحديث حالة الخدمة: ' + (err?.response?.data?.message || err?.message) : 'Failed to update service status: ' + (err?.response?.data?.message || err?.message));
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذه الخدمة؟' : 'Are you sure you want to delete this service?')) return;
    setDeletingId(id);
    try {
      await servicesApi.delete(id);
      setServices(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      alert(lang === 'ar' ? 'فشل حذف الخدمة' : 'Failed to delete service');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {lang === 'ar' ? 'الخدمات والأسعار' : 'Services & Pricing'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading 
              ? (lang === 'ar' ? 'جاري التحميل...' : 'Loading...') 
              : `${services.length} ${lang === 'ar' ? 'خدمة متاحة' : 'Available Services'}`}
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchServices} className="btn-secondary" disabled={loading}>
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            {lang === 'ar' ? 'تحديث' : 'Refresh'}
          </button>
          <button className="btn-primary" onClick={() => router.push('/services/new')}>
            <Plus size={15} /> {lang === 'ar' ? 'إضافة خدمة' : 'Add Service'}
          </button>
        </div>
      </div>



      {/* Error state */}
      {error && (
        <div className="card p-5 border border-red-200 bg-red-50 dark:bg-red-500/10 flex items-center gap-3">
          <AlertCircle className="text-red-500" size={20} />
          <div className="flex-1">
            <p className="font-semibold text-red-700 dark:text-red-400">{error}</p>
            <p className="text-sm text-red-500">تحقق من تشغيل السيرفر على localhost:5000</p>
          </div>
          <button onClick={fetchServices} className="btn-secondary text-sm">إعادة المحاولة</button>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-white/10" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-100 dark:bg-white/5 rounded w-1/2" />
                </div>
              </div>
              <div className="h-8 bg-gray-200 dark:bg-white/10 rounded mb-3" />
              <div className="h-9 bg-gray-100 dark:bg-white/5 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Service Cards */}
      {!loading && services.length === 0 && !error && (
        <div className="card p-12 text-center">
          <Package size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 text-lg font-medium">لا توجد خدمات بعد</p>
          <p className="text-gray-400 text-sm mt-1">ابدأ بإضافة خدمة جديدة</p>
          <button className="btn-primary mt-4" onClick={() => router.push('/services/new')}>
            <Plus size={15} /> إضافة خدمة
          </button>
        </div>
      )}

      {!loading && services.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {services.map((service, i) => (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="card p-5 hover:shadow-card-hover transition-all duration-200"
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${SERVICE_COLORS[service.serviceType] || '#5A8F76'}20` }}
                  >
                    <Package size={18} style={{ color: SERVICE_COLORS[service.serviceType] || '#5A8F76' }} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{service.nameAr}</p>
                    <p className="text-xs text-gray-400">{service.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(service)}
                  disabled={togglingId === service._id}
                  className="transition-opacity hover:opacity-70"
                >
                  {togglingId === service._id
                    ? <Loader2 size={22} className="animate-spin text-gray-400" />
                    : service.isActive
                      ? <ToggleRight size={26} className="text-teal-500" />
                      : <ToggleLeft size={26} className="text-gray-300" />
                  }
                </button>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {service.basePrice}
                    <span className="text-sm font-normal text-gray-400 mr-1">
                      {lang === 'ar' ? 'ج.م' : 'EGP'}/{service.priceUnit === 'per_sqm' ? (lang === 'ar' ? 'م²' : 'sqm') : (lang === 'ar' ? 'طلب' : 'order')}
                    </span>
                  </p>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {service.pricingOptions?.length + (service.cleaningTypes?.length || 0)} خيار
                  </p>
                  <p className="text-xs text-gray-400">خيارات تسعير</p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {service.isActive
                  ? <span className="badge-success">نشط</span>
                  : <span className="badge-gray">غير نشط</span>
                }
                {service.isFeatured && <span className="badge-primary">مميز</span>}
                <span className="badge-gray text-xs">{service.category?.nameAr || 'غير مصنف'}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/services/${service._id}/edit`)}
                  className="btn-secondary flex-1 text-xs py-2"
                >
                  <Edit2 size={13} /> تعديل
                </button>
                <button
                  onClick={() => handleDelete(service._id)}
                  disabled={deletingId === service._id}
                  className="btn-ghost p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl border border-gray-200 dark:border-white/10"
                >
                  {deletingId === service._id
                    ? <Loader2 size={15} className="animate-spin" />
                    : <Trash2 size={15} />
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
