'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Save, ArrowRight, Plus, Trash2, Box, Calendar, Layers, Check,
  Home, Sparkles, Droplets, Shirt, Bed, Car, Briefcase, Star, Zap,
  Trees, Flower, PaintBucket, Wrench, Hammer, Bath, Fan, Monitor,
  Smartphone, Scissors, Trash, Shield, Grid
} from 'lucide-react';

const ICONS_LIST = [
  { id: 'sparkles-outline', label: 'تنظيف', icon: Sparkles },
  { id: 'home-outline', label: 'منزل', icon: Home },
  { id: 'water-outline', label: 'ماء/غسيل', icon: Droplets },
  { id: 'shirt-outline', label: 'ملابس', icon: Shirt },
  { id: 'bed-outline', label: 'سرير', icon: Bed },
  { id: 'car-sport-outline', label: 'سيارة', icon: Car },
  { id: 'layers-outline', label: 'سجاد', icon: Layers },
  { id: 'briefcase-outline', label: 'مكتب', icon: Briefcase },
  { id: 'star-outline', label: 'مميز', icon: Star },
  { id: 'flash-outline', label: 'طاقة', icon: Zap },
  { id: 'leaf-outline', label: 'حديقة', icon: Trees },
  { id: 'flower-outline', label: 'عطور', icon: Flower },
  { id: 'color-palette-outline', label: 'دهان', icon: PaintBucket },
  { id: 'construct-outline', label: 'صيانة', icon: Wrench },
  { id: 'hammer-outline', label: 'نجارة', icon: Hammer },
  { id: 'hardware-outline', label: 'سباكة', icon: Bath },
  { id: 'snow-outline', label: 'تكييف', icon: Fan },
  { id: 'desktop-outline', label: 'أجهزة', icon: Monitor },
  { id: 'phone-portrait-outline', label: 'هاتف', icon: Smartphone },
  { id: 'cut-outline', label: 'قص', icon: Scissors },
  { id: 'trash-outline', label: 'نفايات', icon: Trash },
  { id: 'shield-checkmark-outline', label: 'تعقيم', icon: Shield },
];
import { servicesApi } from '@/lib/api';

export default function NewServicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    icon: 'sparkles-outline',
    serviceType: 'home_cleaning',
    basePrice: 0,
    priceUnit: 'flat',
    isActive: true,
    cleaningTypes: [],
    pricingOptions: [],
    subscriptionTypes: []
  });

  const handleArrayAdd = (field, defaultObj) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], { ...defaultObj, key: Date.now().toString() }]
    }));
  };

  const handleArrayRemove = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleArrayChange = (field, index, key, value) => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      newArray[index][key] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await servicesApi.create(formData);
      router.push('/services');
    } catch (err) {
      alert(err?.message || 'فشل حفظ الخدمة. تحقق من أن جميع الحقول مكتملة.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowRight size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">إضافة خدمة جديدة</h1>
            <p className="text-sm text-gray-500 mt-1">تخصيص الخدمة، أنواع التنظيف، والباقات</p>
          </div>
        </div>
        <button onClick={handleSubmit} disabled={loading} className="btn-primary">
          {loading ? 'جاري الحفظ...' : <><Save size={16} /> حفظ الخدمة</>}
        </button>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Basic Info */}
        <div className="card p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Box size={20} className="text-primary-500"/> المعلومات الأساسية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">اسم الخدمة (عربي)</label>
              <input type="text" className="input" value={formData.nameAr} onChange={e => setFormData({...formData, nameAr: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">اسم الخدمة (إنجليزي)</label>
              <input type="text" className="input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">نوع الخدمة</label>
              <select className="input" value={formData.serviceType} onChange={e => setFormData({...formData, serviceType: e.target.value})}>
                <option value="home_cleaning">تنظيف منزلي</option>
                <option value="furniture_cleaning">تنظيف أثاث</option>
                <option value="carpet_cleaning">تنظيف سجاد</option>
                <option value="curtain_cleaning">تنظيف ستائر</option>
                <option value="car_cleaning">تنظيف سيارات</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">وحدة التسعير الافتراضية</label>
              <select className="input" value={formData.priceUnit} onChange={e => setFormData({...formData, priceUnit: e.target.value})}>
                <option value="flat">سعر ثابت</option>
                <option value="per_sqm">بالمتر المربع</option>
                <option value="per_piece">بالقطعة</option>
              </select>
            </div>
          </div>

          <div className="mt-6 border-t pt-6">
            <label className="block text-sm font-medium mb-4 flex items-center gap-2"><Grid size={18} className="text-primary-500"/> أيقونة الخدمة في التطبيق</label>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
              {ICONS_LIST.map((ic) => {
                const IconComp = ic.icon;
                const isSelected = formData.icon === ic.id;
                return (
                  <button
                    key={ic.id}
                    type="button"
                    onClick={() => setFormData({...formData, icon: ic.id})}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                      isSelected 
                      ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400' 
                      : 'border-transparent bg-gray-50 text-gray-500 hover:bg-gray-100 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10'
                    }`}
                  >
                    <IconComp size={24} strokeWidth={isSelected ? 2.5 : 2} className="mb-2" />
                    <span className="text-[10px] text-center font-medium line-clamp-1">{ic.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Cleaning Types */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2"><Layers size={20} className="text-primary-500"/> أنواع التنظيف (عميق، متوسط...)</h2>
            <button type="button" onClick={() => handleArrayAdd('cleaningTypes', { labelAr: '', label: '', price: 0 })} className="btn-secondary text-xs">
              <Plus size={14} /> إضافة نوع
            </button>
          </div>
          <div className="space-y-4">
            {formData.cleaningTypes.map((item, index) => (
              <div key={item.key} className="flex flex-col sm:flex-row gap-4 items-end bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/10 relative group">
                <div className="flex-1 w-full">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">الاسم (عربي)</label>
                  <input type="text" className="input" value={item.labelAr} onChange={e => handleArrayChange('cleaningTypes', index, 'labelAr', e.target.value)} placeholder="تنظيف عميق" />
                </div>
                <div className="flex-1 w-full">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">الاسم (إنجليزي)</label>
                  <input type="text" className="input" value={item.label} onChange={e => handleArrayChange('cleaningTypes', index, 'label', e.target.value)} placeholder="Deep Cleaning" />
                </div>
                <div className="w-full sm:w-32">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">السعر</label>
                  <div className="relative">
                    <input type="number" className="input pl-10" value={item.price} onChange={e => handleArrayChange('cleaningTypes', index, 'price', e.target.value)} />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">ج.م</span>
                  </div>
                </div>
                <button type="button" onClick={() => handleArrayRemove('cleaningTypes', index)} className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 border border-transparent hover:border-red-100 dark:hover:border-red-500/20 rounded-xl transition-colors shrink-0">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {formData.cleaningTypes.length === 0 && (
              <div className="text-center py-8 bg-gray-50 dark:bg-white/5 rounded-xl border border-dashed border-gray-200 dark:border-white/10">
                <p className="text-sm text-gray-400">لا توجد أنواع مضافة</p>
              </div>
            )}
          </div>
        </div>

        {/* Subscriptions */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2"><Calendar size={20} className="text-primary-500"/> الباقات والاشتراكات (يومي، أسبوعي...)</h2>
            <button type="button" onClick={() => handleArrayAdd('subscriptionTypes', { labelAr: '', visitsPerMonth: 1, discountPercent: 0 })} className="btn-secondary text-xs">
              <Plus size={14} /> إضافة باقة
            </button>
          </div>
          <div className="space-y-4">
            {formData.subscriptionTypes.map((item, index) => (
              <div key={item.key} className="flex flex-col sm:flex-row gap-4 items-end bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/10 relative group">
                <div className="flex-1 w-full">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">اسم الباقة (عربي)</label>
                  <input type="text" className="input" value={item.labelAr} onChange={e => handleArrayChange('subscriptionTypes', index, 'labelAr', e.target.value)} placeholder="باقة يومية" />
                </div>
                <div className="flex-1 w-full">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">اسم الباقة (إنجليزي)</label>
                  <input type="text" className="input" value={item.label} onChange={e => handleArrayChange('subscriptionTypes', index, 'label', e.target.value)} placeholder="Daily Package" />
                </div>
                <div className="w-full sm:w-28">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">عدد الزيارات</label>
                  <input type="number" className="input" value={item.visitsPerMonth} onChange={e => handleArrayChange('subscriptionTypes', index, 'visitsPerMonth', e.target.value)} />
                </div>
                <div className="w-full sm:w-28">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">الخصم %</label>
                  <div className="relative">
                    <input type="number" className="input pl-8" value={item.discountPercent} onChange={e => handleArrayChange('subscriptionTypes', index, 'discountPercent', e.target.value)} />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">%</span>
                  </div>
                </div>
                <button type="button" onClick={() => handleArrayRemove('subscriptionTypes', index)} className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 border border-transparent hover:border-red-100 dark:hover:border-red-500/20 rounded-xl transition-colors shrink-0">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {formData.subscriptionTypes.length === 0 && (
              <div className="text-center py-8 bg-gray-50 dark:bg-white/5 rounded-xl border border-dashed border-gray-200 dark:border-white/10">
                <p className="text-sm text-gray-400">لا توجد باقات مضافة</p>
              </div>
            )}
          </div>
        </div>

        {/* Pricing Options (For Furniture etc) */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2"><Box size={20} className="text-primary-500"/> القطع الإضافية (كنب، سجاد...)</h2>
            <button type="button" onClick={() => handleArrayAdd('pricingOptions', { labelAr: '', price: 0, unit: 'per_piece' })} className="btn-secondary text-xs">
              <Plus size={14} /> إضافة قطعة
            </button>
          </div>
          <div className="space-y-4">
            {formData.pricingOptions.map((item, index) => (
              <div key={item.key} className="flex flex-col sm:flex-row gap-4 items-end bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/10 relative group">
                <div className="flex-1 w-full">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">اسم القطعة (عربي)</label>
                  <input type="text" className="input" value={item.labelAr} onChange={e => handleArrayChange('pricingOptions', index, 'labelAr', e.target.value)} placeholder="طقم أنتريه" />
                </div>
                <div className="flex-1 w-full">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">اسم القطعة (إنجليزي)</label>
                  <input type="text" className="input" value={item.label} onChange={e => handleArrayChange('pricingOptions', index, 'label', e.target.value)} placeholder="Sofa Set" />
                </div>
                <div className="w-full sm:w-32">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">السعر</label>
                  <div className="relative">
                    <input type="number" className="input pl-10" value={item.price} onChange={e => handleArrayChange('pricingOptions', index, 'price', e.target.value)} />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">ج.م</span>
                  </div>
                </div>
                <button type="button" onClick={() => handleArrayRemove('pricingOptions', index)} className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 border border-transparent hover:border-red-100 dark:hover:border-red-500/20 rounded-xl transition-colors shrink-0">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {formData.pricingOptions.length === 0 && (
              <div className="text-center py-8 bg-gray-50 dark:bg-white/5 rounded-xl border border-dashed border-gray-200 dark:border-white/10">
                <p className="text-sm text-gray-400">لا توجد قطع إضافية</p>
              </div>
            )}
          </div>
        </div>

      </form>
    </div>
  );
}
