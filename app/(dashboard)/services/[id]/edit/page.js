'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Save, ArrowRight, Plus, Trash2, Box, Calendar, Layers, Check,
  Home, Sparkles, Droplets, Shirt, Bed, Car, Briefcase, Star, Zap,
  Trees, Flower, PaintBucket, Wrench, Hammer, Bath, Fan, Monitor,
  Smartphone, Scissors, Trash, Shield, Grid, Upload
} from 'lucide-react';
import toast from 'react-hot-toast';
import { servicesApi } from '@/lib/api';

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

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    description: '',
    descriptionAr: '',
    notice: '',
    noticeAr: '',
    icon: 'sparkles-outline',
    serviceType: 'home_cleaning',
    basePrice: 0,
    priceUnit: 'flat',
    sameDayFeePercent: 15,
    sameDayCutoffHour: 13,
    isActive: true,
    cleaningTypes: [],
    pricingOptions: [],
    subscriptionTypes: []
  });

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await servicesApi.getById(params?.id);
        const s = res?.data || res;
        setFormData({
          name: s.name || '',
          nameAr: s.nameAr || '',
          description: s.description || '',
          descriptionAr: s.descriptionAr || '',
          notice: s.notice || '',
          noticeAr: s.noticeAr || '',
          icon: s.icon || 'sparkles-outline',
          serviceType: s.serviceType || 'home_cleaning',
          basePrice: s.basePrice || 0,
          priceUnit: s.priceUnit || 'flat',
          sameDayFeePercent: s.sameDayFeePercent ?? 15,
          sameDayCutoffHour: s.sameDayCutoffHour ?? 13,
          isActive: s.isActive !== false,
          cleaningTypes: (s.cleaningTypes || []).map(item => ({ ...item, key: item.key || item._id || Date.now().toString() + Math.random() })),
          pricingOptions: (s.pricingOptions || []).map(item => ({ ...item, key: item.key || item._id || Date.now().toString() + Math.random() })),
          subscriptionTypes: (s.subscriptionTypes || []).map(item => ({ ...item, key: item.key || item._id || Date.now().toString() + Math.random() })),
        });
      } catch (err) {
        setFetchError('حدث خطأ أثناء تحميل الخدمة');
      }
    };
    if (params?.id) {
      fetchService();
    }
  }, [params?.id]);

  const handleArrayAdd = (field, defaultObj) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], { ...defaultObj, key: Date.now().toString() + Math.random() }]
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
      await servicesApi.update(params?.id, formData);
      toast.success('تم حفظ التعديلات بنجاح');
      setLoading(false);
    } catch (err) {
      toast.error(err?.message || 'فشل حفظ التعديلات');
      setLoading(false);
    }
  };

  if (fetchError) {
    return <div className="p-10 text-center text-red-500">{fetchError}</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowRight size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">تعديل الخدمة</h1>
            <p className="text-sm text-gray-500 mt-1">{formData.nameAr}</p>
          </div>
        </div>
        <button onClick={handleSubmit} disabled={loading} className="btn-primary">
          {loading ? 'جاري الحفظ...' : <><Save size={16} /> حفظ التعديلات</>}
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
                <option value="laundry">غسيل ملابس</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">وحدة التسعير الافتراضية</label>
              <select className="input" value={formData.priceUnit} onChange={e => setFormData({...formData, priceUnit: e.target.value})}>
                <option value="flat">سعر ثابت</option>
                <option value="per_sqm">بالمتر المربع (حساب المساحة)</option>
                <option value="per_meter">بالمتر الطولي (أمتار)</option>
                <option value="per_piece">بالقطعة / بالعدد</option>
                <option value="per_item">بالوحدة / العنصر</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">نسبة إضافية لحجز نفس اليوم (%)</label>
              <div className="relative">
                <input type="number" className="input pl-8" value={formData.sameDayFeePercent} onChange={e => setFormData({...formData, sameDayFeePercent: Number(e.target.value) || 0})} placeholder="15" />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">%</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">توقيت إغلاق حجز نفس اليوم (نظام 24 ساعة)</label>
              <select className="input" value={formData.sameDayCutoffHour} onChange={e => setFormData({...formData, sameDayCutoffHour: Number(e.target.value)})}>
                {Array.from({ length: 24 }, (_, i) => {
                  const hour24 = String(i).padStart(2, '0') + ':00';
                  let label = hour24;
                  if (i === 0) label += ' (00:00 - منتصف الليل)';
                  else if (i === 12) label += ' (12:00 - ظهراً)';
                  else if (i > 12) label += ` (${i - 12}:00 ${i >= 17 ? 'مساءً' : 'عصراً'})`;
                  else label += ` (${i}:00 صباحاً)`;
                  return <option key={i} value={i}>{label}</option>;
                })}
              </select>
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium mb-1">وصف الخدمة (عربي)</label>
              <textarea rows={2} className="input" value={formData.descriptionAr} onChange={e => setFormData({...formData, descriptionAr: e.target.value})} placeholder="أدخل وصفاً تفصيلياً للخدمة يظهر للعميل عند الحجز" />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium mb-1">وصف الخدمة (إنجليزي)</label>
              <textarea rows={2} className="input" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Enter service description in English" />
            </div>
            <div className="col-span-1 md:col-span-2 bg-amber-50/50 dark:bg-amber-500/10 p-4 rounded-xl border border-amber-200/60 dark:border-amber-500/20">
              <label className="block text-sm font-bold text-amber-900 dark:text-amber-300 mb-1 flex items-center gap-1.5">
                <span>⚠️</span> تنبيه وإشعار الخدمة (يظهر بارزاً للعميل في التطبيق)
              </label>
              <p className="text-xs text-amber-700 dark:text-amber-400 mb-2">أدخل أي تنبيه أو شرط هائم يظهر كشريط تحذير للمستخدم عند اختيار هذه الخدمة</p>
              <textarea
                rows={2}
                className="input border-amber-300 focus:border-amber-500 dark:bg-dark-50"
                value={formData.noticeAr}
                onChange={e => setFormData({...formData, noticeAr: e.target.value})}
                placeholder="مثال: زيارة واحدة و إضافة تنبيه ، فى حالة توجب زيارة اخرى بسبب صعوبة البقع، يمكن رفع التكلفة بنسبة ٥٠%"
              />
            </div>
          </div>

          {/* Service Icon Section */}
          <div className="mt-6 border-t pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <label className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Grid size={18} className="text-primary-500"/> أيقونة الخدمة في التطبيق
                </label>
                <p className="text-xs text-gray-500 mt-1">اختر من الأيقونات الجاهزة أو قم برفع أيقونة خاصة بك من جهازك (PNG, SVG, JPG)</p>
              </div>

              <div className="flex items-center gap-2">
                <label className="btn-secondary text-xs cursor-pointer py-2 px-3 flex items-center gap-1.5 shrink-0">
                  <Upload size={14} className="text-primary-600" />
                  <span>رفع أيقونة من جهازك</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData(prev => ({ ...prev, icon: reader.result }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Custom Uploaded Icon Preview */}
            {formData.icon && (formData.icon.startsWith('http') || formData.icon.startsWith('data:')) && (
              <div className="mb-4 p-3 bg-primary-50/50 dark:bg-primary-900/10 rounded-xl border border-primary-200 dark:border-primary-800/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={formData.icon} alt="Custom Icon" className="w-10 h-10 object-contain rounded-lg bg-white p-1 border border-gray-200 shadow-sm" />
                  <div>
                    <span className="text-xs font-bold text-primary-700 dark:text-primary-400 block">تم اختيار أيقونة مخصصة (صورة مرفوعة)</span>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">ستظهر هذه الصورة كأيقونة رسمية للخدمة في تطبيق الموبايل</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, icon: 'sparkles-outline' }))}
                  className="text-xs text-red-500 hover:underline shrink-0"
                >
                  إلغاء واستخدام الأيقونات الجاهزة
                </button>
              </div>
            )}

            {/* Predefined Icon Grid */}
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
                      ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400 shadow-sm scale-105' 
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
            <button type="button" onClick={() => handleArrayAdd('subscriptionTypes', { labelAr: '', label: '', visitsPerMonth: 1, discountPercent: 0 })} className="btn-secondary text-xs">
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

        {/* Pricing Options & Areas */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2"><Box size={20} className="text-primary-500"/> المساحات والقطع الإضافية (سعر المتر / عدد / أمتار)</h2>
            <button type="button" onClick={() => handleArrayAdd('pricingOptions', { labelAr: '', label: '', price: 0, unit: 'per_piece' })} className="btn-secondary text-xs">
              <Plus size={14} /> إضافة مساحة أو قطعة
            </button>
          </div>
          <div className="space-y-4">
            {formData.pricingOptions.map((item, index) => (
              <div key={item.key} className="flex flex-col sm:flex-row gap-4 items-end bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/10 relative group">
                <div className="flex-1 w-full">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">الاسم/المساحة (عربي)</label>
                  <input type="text" className="input" value={item.labelAr} onChange={e => handleArrayChange('pricingOptions', index, 'labelAr', e.target.value)} placeholder="مثال: غسيل سجاد / صالة / كنب" />
                </div>
                <div className="flex-1 w-full">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">الاسم/المساحة (إنجليزي)</label>
                  <input type="text" className="input" value={item.label} onChange={e => handleArrayChange('pricingOptions', index, 'label', e.target.value)} placeholder="Carpet / Hall / Sofa" />
                </div>
                <div className="w-full sm:w-36">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">نوع التسعير</label>
                  <select className="input text-xs" value={item.unit || 'per_piece'} onChange={e => handleArrayChange('pricingOptions', index, 'unit', e.target.value)}>
                    <option value="per_piece">بالقطعة / بالعدد</option>
                    <option value="per_sqm">بالمتر المربع</option>
                    <option value="per_meter">بالمتر الطولي</option>
                    <option value="flat">سعر ثابت</option>
                  </select>
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
                <p className="text-sm text-gray-400">لا توجد مساحات أو قطع إضافية مضافة</p>
              </div>
            )}
          </div>
        </div>

      </form>
    </div>
  );
}
