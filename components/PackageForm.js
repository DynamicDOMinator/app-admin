'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, X, Loader2, Package, Star, Shield, Zap, Sparkles, Heart, Crown, Gem, CheckCircle, Home, Layers, Calendar, Clock, Briefcase, Award, TrendingUp, Sun, Moon } from 'lucide-react';
import { toast } from 'react-hot-toast';

const PACKAGE_ICONS = [
  { name: 'Package', component: Package },
  { name: 'Star', component: Star },
  { name: 'Shield', component: Shield },
  { name: 'Zap', component: Zap },
  { name: 'Sparkles', component: Sparkles },
  { name: 'Heart', component: Heart },
  { name: 'Crown', component: Crown },
  { name: 'Gem', component: Gem },
  { name: 'CheckCircle', component: CheckCircle },
  { name: 'Home', component: Home },
  { name: 'Layers', component: Layers },
  { name: 'Calendar', component: Calendar },
  { name: 'Clock', component: Clock },
  { name: 'Briefcase', component: Briefcase },
  { name: 'Award', component: Award },
  { name: 'TrendingUp', component: TrendingUp },
  { name: 'Sun', component: Sun },
  { name: 'Moon', component: Moon },
];
import { packagesApi, servicesApi } from '@/lib/api';
import { useLanguage } from '@/components/providers/LanguageProvider';

export default function PackageForm({ initialData = null, packageId = null }) {
  const router = useRouter();
  const { lang } = useLanguage();
  const isEditing = !!packageId;
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    description: '',
    descriptionAr: '',
    icon: 'Package',
    services: [],
    visits: 1,
    price: 0,
    discountPercent: 0,
    isActive: true,
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await servicesApi.getAll({ limit: 100 });
        setServices(res.data?.docs || res.data || []);
      } catch (err) {
        console.error('Error fetching services:', err);
      }
    };
    fetchServices();

    if (initialData) {
      setFormData({
        name: initialData.name || '',
        nameAr: initialData.nameAr || '',
        description: initialData.description || '',
        descriptionAr: initialData.descriptionAr || '',
        icon: initialData.icon || 'Package',
        services: initialData.services?.map(s => s._id || s) || [],
        visits: initialData.visits || 1,
        price: initialData.price || 0,
        discountPercent: initialData.discountPercent || 0,
        isActive: initialData.isActive !== undefined ? initialData.isActive : true,
      });
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.services || formData.services.length === 0) {
      toast.error(lang === 'ar' ? 'يرجى اختيار خدمة واحدة على الأقل' : 'Please select at least one service');
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        await packagesApi.update(packageId, formData);
        toast.success(lang === 'ar' ? 'تم تحديث الباقة بنجاح' : 'Package updated successfully');
      } else {
        await packagesApi.create(formData);
        toast.success(lang === 'ar' ? 'تم إنشاء الباقة بنجاح' : 'Package created successfully');
      }
      router.push('/packages');
    } catch (err) {
      console.error(err);
      toast.error(lang === 'ar' ? 'فشل حفظ الباقة: ' + (err.response?.data?.message || err.message || err) : 'Failed to save package: ' + (err.response?.data?.message || err.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEditing ? (lang === 'ar' ? 'تعديل باقة' : 'Edit Package') : (lang === 'ar' ? 'إضافة باقة جديدة' : 'Add New Package')}
          </h1>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => router.back()} className="btn-secondary" disabled={loading}>
            <X size={18} /> {lang === 'ar' ? 'إلغاء' : 'Cancel'}
          </button>
          <button type="submit" className="btn-primary min-w-[120px]" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {lang === 'ar' ? 'حفظ' : 'Save'}
          </button>
        </div>
      </div>

      <div className="card p-6 space-y-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-white/10 pb-2">
          {lang === 'ar' ? 'المعلومات الأساسية' : 'Basic Information'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">{lang === 'ar' ? 'اسم الباقة (إنجليزي)' : 'Package Name (English)'}</label>
            <input type="text" className="input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{lang === 'ar' ? 'اسم الباقة (عربي)' : 'Package Name (Arabic)'}</label>
            <input type="text" className="input" value={formData.nameAr} onChange={e => setFormData({...formData, nameAr: e.target.value})} required />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">{lang === 'ar' ? 'وصف الباقة (إنجليزي)' : 'Description (English)'}</label>
            <textarea className="input min-h-[80px]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">{lang === 'ar' ? 'وصف الباقة (عربي)' : 'Description (Arabic)'}</label>
            <textarea className="input min-h-[80px]" value={formData.descriptionAr} onChange={e => setFormData({...formData, descriptionAr: e.target.value})} />
          </div>

          <div className="md:col-span-2 mt-4">
            <label className="block text-sm font-medium mb-3">{lang === 'ar' ? 'أيقونة الباقة' : 'Package Icon'}</label>
            <div className="flex flex-wrap gap-3">
              {PACKAGE_ICONS.map((IconOption) => {
                const IconComponent = IconOption.component;
                const isSelected = formData.icon === IconOption.name;
                return (
                  <button
                    key={IconOption.name}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: IconOption.name })}
                    className={`p-3 rounded-xl border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-primary-50 border-primary-500 text-primary-600 dark:bg-primary-500/20 dark:border-primary-500'
                        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700'
                    }`}
                  >
                    <IconComponent size={24} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 mt-8 border-b border-gray-100 dark:border-white/10 pb-2">
          {lang === 'ar' ? 'تفاصيل الخدمة والتسعير' : 'Service & Pricing Details'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-3">
            <label className="block text-sm font-medium mb-3">{lang === 'ar' ? 'الخدمات المرتبطة' : 'Linked Services'}</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {services.map(s => (
                <label key={s._id} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-colors ${formData.services.includes(s._id) ? 'bg-primary-50 border-primary-200 dark:bg-primary-500/10 dark:border-primary-500/20' : 'bg-gray-50 border-gray-100 dark:bg-white/5 dark:border-white/10 hover:bg-gray-100'}`}>
                  <input 
                    type="checkbox" 
                    checked={formData.services.includes(s._id)} 
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, services: [...formData.services, s._id] });
                      } else {
                        setFormData({ ...formData, services: formData.services.filter(id => id !== s._id) });
                      }
                    }}
                    className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500" 
                  />
                  <span className="font-medium text-sm text-gray-900 dark:text-white">{lang === 'ar' ? s.nameAr : s.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{lang === 'ar' ? 'عدد الزيارات' : 'Number of Visits'}</label>
            <input type="number" min="1" className="input" value={formData.visits} onChange={e => setFormData({...formData, visits: e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{lang === 'ar' ? 'السعر الإجمالي' : 'Total Price'}</label>
            <div className="relative">
              <input type="number" min="0" className="input pl-10" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">ج.م</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{lang === 'ar' ? 'نسبة الخصم % (اختياري)' : 'Discount % (Optional)'}</label>
            <input type="number" min="0" max="100" className="input" value={formData.discountPercent} onChange={e => setFormData({...formData, discountPercent: e.target.value})} />
          </div>
        </div>

        <div className="mt-8">
          <label className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-white/5 rounded-xl cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={e => setFormData({...formData, isActive: e.target.checked})}
              className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="font-medium text-gray-900 dark:text-white">{lang === 'ar' ? 'تفعيل هذه الباقة للعملاء' : 'Activate this package for customers'}</span>
          </label>
        </div>
      </div>
    </form>
  );
}
