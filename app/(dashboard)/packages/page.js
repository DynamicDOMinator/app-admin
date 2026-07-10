'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Trash2, RefreshCw } from 'lucide-react';
import * as Icons from 'lucide-react';
import { toast } from 'react-hot-toast';
import { packagesApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { useLanguage } from '@/components/providers/LanguageProvider';

export default function PackagesPage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPackages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await packagesApi.getAll();
      setPackages(res.data?.docs || res.data || []);
    } catch (err) {
      toast.error(lang === 'ar' ? 'فشل تحميل الباقات' : 'Failed to load packages');
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  const handleToggle = async (pkg) => {
    try {
      await packagesApi.update(pkg._id, { isActive: !pkg.isActive });
      setPackages(prev => prev.map(p =>
        p._id === pkg._id ? { ...p, isActive: !p.isActive } : p
      ));
      toast.success(lang === 'ar' ? 'تم تحديث حالة الباقة' : 'Package status updated');
    } catch (err) {
      toast.error(lang === 'ar' ? 'فشل تحديث حالة الباقة' : 'Failed to update package status');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذه الباقة؟' : 'Are you sure you want to delete this package?')) return;
    try {
      await packagesApi.delete(id);
      setPackages(prev => prev.filter(p => p._id !== id));
      toast.success(lang === 'ar' ? 'تم حذف الباقة بنجاح' : 'Package deleted successfully');
    } catch (err) {
      toast.error(lang === 'ar' ? 'فشل حذف الباقة' : 'Failed to delete package');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {lang === 'ar' ? 'الباقات' : 'Packages'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading 
              ? (lang === 'ar' ? 'جاري التحميل...' : 'Loading...') 
              : `${packages.length} ${lang === 'ar' ? 'باقة متاحة' : 'Available Packages'}`}
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchPackages} className="btn-secondary" disabled={loading}>
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            {lang === 'ar' ? 'تحديث' : 'Refresh'}
          </button>
          <button className="btn-primary" onClick={() => router.push('/packages/new')}>
            <Plus size={15} /> {lang === 'ar' ? 'إضافة باقة' : 'Add Package'}
          </button>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12"><RefreshCw className="animate-spin text-primary-500" size={32} /></div>
      ) : packages.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white dark:bg-dark-100 rounded-2xl border border-gray-100 dark:border-white/5">
          <Icons.Package className="mx-auto h-12 w-12 mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{lang === 'ar' ? 'لا توجد باقات' : 'No Packages Found'}</h3>
          <p className="mt-1">{lang === 'ar' ? 'أضف أول باقة لتبدأ' : 'Add your first package to get started'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => {
            const IconComponent = pkg.icon && Icons[pkg.icon] ? Icons[pkg.icon] : Icons.Package;
            return (
            <div key={pkg._id} className="card p-5 group flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center text-primary-600 dark:text-primary-400">
                    <IconComponent size={24} />
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={pkg.isActive} onChange={() => handleToggle(pkg)} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] rtl:after:right-[2px] rtl:after:left-auto after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-500"></div>
                  </label>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{lang === 'ar' ? pkg.nameAr : pkg.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{lang === 'ar' ? pkg.descriptionAr : pkg.description}</p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{lang === 'ar' ? 'الخدمات' : 'Services'}</span>
                    <span className="font-medium max-w-[60%] text-left line-clamp-1" title={pkg.services?.map(s => lang === 'ar' ? s.nameAr : s.name).join(', ')}>
                      {pkg.services?.length > 0 ? (pkg.services.length === 1 ? (lang === 'ar' ? pkg.services[0].nameAr : pkg.services[0].name) : `${pkg.services.length} ${lang === 'ar' ? 'خدمات' : 'Services'}`) : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{lang === 'ar' ? 'عدد الزيارات' : 'Visits'}</span>
                    <span className="font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md">{pkg.visits} {lang === 'ar' ? 'زيارات' : 'visits'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{lang === 'ar' ? 'السعر' : 'Price'}</span>
                    <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(pkg.price)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-white/5 mt-auto">
                <button onClick={() => router.push(`/packages/${pkg._id}/edit`)} className="flex-1 btn-secondary text-sm py-2">
                  <Edit2 size={16} /> {lang === 'ar' ? 'تعديل' : 'Edit'}
                </button>
                <button onClick={() => handleDelete(pkg._id)} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )})}
        </div>
      )}
    </div>
  );
}
