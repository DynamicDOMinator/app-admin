'use client';

import React, { useState } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { bannersApi } from '@/lib/api';
import { useLanguage } from '@/components/providers/LanguageProvider';

export default function BannerModal({ banner, onClose, onSaved }) {
  const { lang } = useLanguage();
  const isEditing = !!banner;
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: banner?.title || '',
    titleAr: banner?.titleAr || '',
    subtitle: banner?.subtitle || '',
    subtitleAr: banner?.subtitleAr || '',
    linkType: banner?.linkType || 'none',
    linkValue: banner?.linkValue || '',
    buttonText: banner?.buttonText || '',
    buttonTextAr: banner?.buttonTextAr || '',
    isActive: banner?.isActive !== undefined ? banner.isActive : true,
  });
  
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
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
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
      alert(lang === 'ar' ? 'حدث خطأ أثناء الحفظ' : 'Error saving banner');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-dark-100 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-white/10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {isEditing ? (lang === 'ar' ? 'تعديل بنر' : 'Edit Banner') : (lang === 'ar' ? 'إضافة بنر جديد' : 'Add New Banner')}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="banner-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">{lang === 'ar' ? 'صورة البنر' : 'Banner Image'}</label>
              <div className="border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl p-4 text-center hover:border-primary-500 transition-colors cursor-pointer relative overflow-hidden"
                   onClick={() => document.getElementById('banner-image').click()}>
                {imagePreview ? (
                  <div className="relative h-40 w-full rounded-lg overflow-hidden">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-white font-medium flex items-center gap-2"><Upload size={18}/> {lang === 'ar' ? 'تغيير الصورة' : 'Change Image'}</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 flex flex-col items-center justify-center gap-2 text-gray-500">
                    <Upload size={32} className="text-gray-400" />
                    <span>{lang === 'ar' ? 'اضغط لاختيار صورة' : 'Click to select image'}</span>
                  </div>
                )}
                <input id="banner-image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">{lang === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'}</label>
                <input type="text" className="input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{lang === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}</label>
                <input type="text" className="input" value={formData.titleAr} onChange={e => setFormData({...formData, titleAr: e.target.value})} required />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">{lang === 'ar' ? 'العنوان الفرعي (إنجليزي)' : 'Subtitle (English)'}</label>
                <input type="text" className="input" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{lang === 'ar' ? 'العنوان الفرعي (عربي)' : 'Subtitle (Arabic)'}</label>
                <input type="text" className="input" value={formData.subtitleAr} onChange={e => setFormData({...formData, subtitleAr: e.target.value})} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{lang === 'ar' ? 'نوع الرابط' : 'Link Type'}</label>
                <select className="input" value={formData.linkType} onChange={e => setFormData({...formData, linkType: e.target.value})}>
                  <option value="none">{lang === 'ar' ? 'بدون رابط' : 'None'}</option>
                  <option value="service">{lang === 'ar' ? 'خدمة معينة' : 'Specific Service'}</option>
                  <option value="url">{lang === 'ar' ? 'رابط خارجي' : 'External URL'}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{lang === 'ar' ? 'قيمة الرابط' : 'Link Value'}</label>
                <input type="text" className="input" placeholder={formData.linkType === 'service' ? 'ID الخدمة' : 'https://...'} value={formData.linkValue} onChange={e => setFormData({...formData, linkValue: e.target.value})} />
              </div>
            </div>

            <label className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-white/5 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={e => setFormData({...formData, isActive: e.target.checked})}
                className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="font-medium text-gray-900 dark:text-white">{lang === 'ar' ? 'البنر نشط (يظهر في التطبيق)' : 'Active (Shows in App)'}</span>
            </label>

          </form>
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-white/10 flex justify-end gap-3 bg-gray-50 dark:bg-white/5">
          <button type="button" onClick={onClose} className="btn-secondary" disabled={loading}>
            {lang === 'ar' ? 'إلغاء' : 'Cancel'}
          </button>
          <button type="submit" form="banner-form" className="btn-primary min-w-[120px]" disabled={loading}>
            {loading ? <Loader2 size={18} className="animate-spin mx-auto" /> : (lang === 'ar' ? 'حفظ التغييرات' : 'Save Changes')}
          </button>
        </div>
      </div>
    </div>
  );
}
