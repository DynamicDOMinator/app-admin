'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Image as ImageIcon, Trash2, Edit2, Loader2, RefreshCw } from 'lucide-react';
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
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {lang === 'ar' ? 'البنرات' : 'Banners'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {lang === 'ar' ? 'إدارة البنرات الإعلانية في التطبيق' : 'Manage app promotional banners'}
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchBanners} className="btn-secondary" disabled={loading}>
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            {lang === 'ar' ? 'تحديث' : 'Refresh'}
          </button>
          <button className="btn-primary" onClick={handleAdd}>
            <Plus size={18} />
            {lang === 'ar' ? 'إضافة بنر جديد' : 'Add New Banner'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-primary-500" size={32} />
        </div>
      ) : banners.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          {lang === 'ar' ? 'لا توجد بنرات حالياً' : 'No banners available'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div key={banner._id} className="card overflow-hidden group">
              <div className="relative h-48 w-full bg-gray-100 dark:bg-dark-100">
                <img src={banner.image} alt={banner.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute top-3 right-3">
                  <span className={banner.isActive ? 'badge badge-success shadow-sm' : 'badge badge-gray shadow-sm'}>
                    {banner.isActive ? (lang === 'ar' ? 'نشط' : 'Active') : (lang === 'ar' ? 'غير نشط' : 'Inactive')}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{banner.title || banner.titleAr}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                      <ImageIcon size={14} /> {lang === 'ar' ? 'التوجيه:' : 'Target:'} {banner.linkType}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-white/5">
                  <button onClick={() => handleEdit(banner)} className="flex-1 btn-secondary text-sm py-2">
                    <Edit2 size={16} /> {lang === 'ar' ? 'تعديل' : 'Edit'}
                  </button>
                  <button onClick={() => handleDelete(banner._id)} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100">
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
