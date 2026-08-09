'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Loader2, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { bannersApi } from '@/lib/api';
import BannerModal from '@/components/BannerModal';
import { useLanguage } from '@/components/providers/LanguageProvider';

export default function BannersPage() {
  const { lang } = useLanguage();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await bannersApi.getAll();
      setBanners(res.data?.docs || res.data || []);
    } catch (error) {
      console.error('Error fetching banners:', error);
      alert(lang === 'ar' ? 'فشل تحميل البنرات' : 'Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleEdit = (banner) => {
    setSelectedBanner(banner);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedBanner(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذا البنر؟' : 'Are you sure you want to delete this banner?')) return;
    try {
      await bannersApi.delete(id);
      fetchBanners();
    } catch (error) {
      console.error('Error deleting banner:', error);
      alert(lang === 'ar' ? 'فشل حذف البنر' : 'Failed to delete banner');
    }
  };

  const handleSaved = () => {
    setIsModalOpen(false);
    fetchBanners();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {lang === 'ar' ? 'إدارة بنرات التطبيق' : 'App Banners'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {lang === 'ar' ? 'رفع صور البنرات الإعلانية التي تظهر في الصفحة الرئيسية للتطبيق' : 'Upload promotional banner images shown on mobile home screen'}
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchBanners} className="btn-secondary" disabled={loading}>
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            {lang === 'ar' ? 'تحديث' : 'Refresh'}
          </button>
          <button className="btn-primary" onClick={handleAdd}>
            <Plus size={18} />
            {lang === 'ar' ? 'رفع بنر جديد' : 'Upload New Banner'}
          </button>
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-primary-500" size={32} />
        </div>
      ) : banners.length === 0 ? (
        <div className="card p-12 text-center text-gray-400">
          <ImageIcon size={48} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            {lang === 'ar' ? 'لا توجد بنرات حالياً' : 'No banners available'}
          </p>
          <p className="text-xs text-gray-400 mt-1 mb-4">
            {lang === 'ar' ? 'قم برفع صورة بنر جديدة لتظهر في تطبيق الهاتف' : 'Upload a banner image to display on the mobile app'}
          </p>
          <button className="btn-primary mx-auto" onClick={handleAdd}>
            <Plus size={16} />
            {lang === 'ar' ? 'رفع بنر جديد' : 'Upload Banner'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner, index) => (
            <div key={banner._id || index} className="card overflow-hidden group flex flex-col">
              <div className="relative h-52 w-full bg-gray-100 dark:bg-dark-100 overflow-hidden">
                <img
                  src={banner.image}
                  alt={`Banner ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3">
                  <span className={banner.isActive ? 'badge badge-success shadow-md backdrop-blur-md' : 'badge badge-gray shadow-md backdrop-blur-md'}>
                    {banner.isActive ? (lang === 'ar' ? 'نشط' : 'Active') : (lang === 'ar' ? 'غير نشط' : 'Inactive')}
                  </span>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between gap-3 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                  {lang === 'ar' ? `بنر #${index + 1}` : `Banner #${index + 1}`}
                </span>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEdit(banner)} className="btn-secondary text-xs py-1.5 px-3">
                    <Edit2 size={14} /> {lang === 'ar' ? 'تعديل' : 'Edit'}
                  </button>
                  <button
                    onClick={() => handleDelete(banner._id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                    title={lang === 'ar' ? 'حذف' : 'Delete'}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <BannerModal
          banner={selectedBanner}
          onClose={() => setIsModalOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
