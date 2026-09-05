'use client';

import React, { useState } from 'react';
import { X, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { bannersApi } from '@/lib/api';
import { useLanguage } from '@/components/providers/LanguageProvider';

export default function BannerModal({ banner, onClose, onSaved }) {
  const { lang } = useLanguage();
  const isEditing = !!banner;
  
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(banner?.isActive !== undefined ? banner.isActive : true);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(banner?.image || null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing && !imageFile) {
      alert(lang === 'ar' ? 'الرجاء اختيار صورة للبنر' : 'Please select an image for the banner');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('title', 'بنر إعلاني');
      data.append('isActive', isActive);

      if (imageFile) {
        data.append('image', imageFile);
      }

      if (isEditing) {
        await bannersApi.update(banner._id, data);
      } else {
        await bannersApi.create(data);
      }
      onSaved();
    } catch (error) {
      console.error('Error saving banner:', error);
      alert(lang === 'ar' ? 'حدث خطأ أثناء حفظ البنر' : 'Error saving banner');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-dark-100 rounded-2xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center text-primary-500">
              <ImageIcon size={20} />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {isEditing ? (lang === 'ar' ? 'تعديل صورة البنر' : 'Edit Banner Image') : (lang === 'ar' ? 'رفع بنر جديد' : 'Upload New Banner')}
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <form id="banner-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Image Upload Area */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                {lang === 'ar' ? 'صورة البنر' : 'Banner Image'}
              </label>
              <div
                className="border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl p-4 text-center hover:border-primary-500 dark:hover:border-primary-400 transition-all cursor-pointer relative overflow-hidden bg-gray-50 dark:bg-white/5"
                onClick={() => document.getElementById('banner-image').click()}
              >
                {imagePreview ? (
                  <div className="relative h-48 w-full rounded-xl overflow-hidden shadow-sm">
                    <img src={imagePreview} alt="Banner Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-white font-medium flex items-center gap-2 bg-black/50 px-4 py-2 rounded-xl backdrop-blur-sm">
                        <Upload size={18} />
                        {lang === 'ar' ? 'تغيير الصورة' : 'Change Image'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center gap-3 text-gray-500">
                    <div className="w-14 h-14 rounded-2xl bg-white dark:bg-dark-50 shadow-sm flex items-center justify-center text-primary-500">
                      <Upload size={28} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white">
                        {lang === 'ar' ? 'اضغط هنا لرفع صورة البنر' : 'Click here to upload banner image'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP (وصى بالأبعاد العريضة)</p>
                    </div>
                  </div>
                )}
                <input id="banner-image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </div>
            </div>

            {/* Active Toggle */}
            <label className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-white/5 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
              <input
                type="checkbox"
                checked={isActive}
                onChange={e => setIsActive(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <div>
                <span className="font-medium text-gray-900 dark:text-white block">
                  {lang === 'ar' ? 'البنر نشط' : 'Active Banner'}
                </span>
                <span className="text-xs text-gray-400">
                  {lang === 'ar' ? 'يظهر البنر فوراً في الصفحة الرئيسية للتطبيق' : 'Banner appears immediately on mobile app home screen'}
                </span>
              </div>
            </label>

          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 dark:border-white/10 flex justify-end gap-3 bg-gray-50 dark:bg-white/5">
          <button type="button" onClick={onClose} className="btn-secondary" disabled={loading}>
            {lang === 'ar' ? 'إلغاء' : 'Cancel'}
          </button>
          <button type="submit" form="banner-form" className="btn-primary min-w-[120px]" disabled={loading}>
            {loading ? <Loader2 size={18} className="animate-spin mx-auto" /> : (lang === 'ar' ? 'حفظ البنر' : 'Save Banner')}
          </button>
        </div>
      </div>
    </div>
  );
}
