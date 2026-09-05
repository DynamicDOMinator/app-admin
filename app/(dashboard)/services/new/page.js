'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Save, ArrowRight, Plus, Trash2, Box, Calendar, Layers, Check, CheckCircle2,
  Home, Sparkles, Droplets, Shirt, Bed, Car, Briefcase, Star, Zap,
  Trees, Flower, PaintBucket, Wrench, Hammer, Bath, Fan, Monitor,
  Smartphone, Scissors, Trash, Shield, Grid, Upload, Search, Tag, Filter,
  ChevronDown, ChevronUp, FolderPlus, Info, LayoutGrid, List
} from 'lucide-react';

const PRESET_LAUNDRY_CATEGORIES = [
  { id: 'kids', nameAr: 'الأطفال', nameEn: 'kids', icon: '👶', typeHint: 'يظهر في باقات: غسيل وكوي + كوي فقط' },
  { id: 'bottom_wear', nameAr: 'الجزء السفلي', nameEn: 'bottom_wear', icon: '👖', typeHint: 'يظهر في باقات: غسيل وكوي + كوي فقط' },
  { id: 'formal_wear', nameAr: 'ملابس رسمية', nameEn: 'formal_wear', icon: '👔', typeHint: 'يظهر في باقات: غسيل وكوي + كوي فقط' },
  { id: 'treatment', nameAr: 'معالجة للملابس', nameEn: 'treatment', icon: '🧪', typeHint: 'يظهر مباشرة عند اختيار باقة (معالجة الملابس)' },
  { id: 'shoes', nameAr: 'أحذية', nameEn: 'shoes', icon: '👟', typeHint: 'يظهر في باقات: غسيل وكوي + كوي فقط' },
  { id: 'bags', nameAr: 'شنط', nameEn: 'bags', icon: '👜', typeHint: 'يظهر في باقات: غسيل وكوي + كوي فقط' },
  { id: 'accessories', nameAr: 'اكسسوارات', nameEn: 'accessories', icon: '🕶️', typeHint: 'يظهر في باقات: غسيل وكوي + كوي فقط' },
  { id: 'home_textiles', nameAr: 'المنزل', nameEn: 'home_textiles', icon: '🏠', typeHint: 'يظهر في باقات: غسيل وكوي + كوي فقط' },
];

const getCategoryMeta = (catAr) => {
  const found = PRESET_LAUNDRY_CATEGORIES.find(c => c.nameAr === catAr?.trim());
  if (found) return found;
  return { id: 'custom', nameAr: catAr || 'غير مصنف', nameEn: 'custom', icon: '📦', typeHint: 'قسم مخصص / عام' };
};

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
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchPiece, setSearchPiece] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState({});
  const [newCatInput, setNewCatInput] = useState('');
  const [showAddCatBar, setShowAddCatBar] = useState(false);
  const [viewMode, setViewMode] = useState('grouped');

  const toggleCategoryCollapse = (cat) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [cat]: !prev[cat]
    }));
  };

  const collapseAllCategories = () => {
    const all = {};
    const existingCats = Array.from(new Set(formData.pricingOptions.map(p => p.categoryAr?.trim() || 'غير مصنف')));
    existingCats.forEach(c => { all[c] = true; });
    setCollapsedCategories(all);
  };

  const expandAllCategories = () => {
    setCollapsedCategories({});
  };

  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    description: '',
    descriptionAr: '',
    notice: '',
    noticeAr: '',
    includedTasksAr: [],
    equipmentNoticeAr: '',
    icon: 'sparkles-outline',
    serviceType: 'home_cleaning',
    basePrice: 0,
    priceUnit: 'flat',
    sameDayFeePercent: 15,
    sameDayCutoffHour: 13,
    isActive: true,
    cleaningTypes: [],
    pricingOptions: [],
    roomOptions: [],
    areaOptions: [],
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

        {/* Included Tasks & Equipment Notice (المهام المشمولة وتنويه المعدات) */}
        <div className="card p-6 border-2 border-emerald-500/20 bg-emerald-50/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2 text-emerald-800 dark:text-emerald-400">
                <CheckCircle2 size={20} className="text-emerald-600" /> المهام المشمولة في الزيارة وتنويه المعدات (نافذة مساعدة؟)
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">تحديد قائمة المهام المعتمدة للزيارة وتنبيه المواد والمعدات التي يوفرها العميل</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  includedTasksAr: [...(prev.includedTasksAr || []), '']
                }));
              }}
              className="btn-secondary text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            >
              <Plus size={14} /> إضافة مهمة مشمولة
            </button>
          </div>

          {/* Tasks List */}
          <div className="space-y-3 mb-6">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block">قائمة المهام المشمولة (Checklist):</label>
            {(formData.includedTasksAr || []).map((task, index) => (
              <div key={index} className="flex gap-2 items-center">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                </div>
                <input
                  type="text"
                  className="input flex-1 text-xs"
                  value={typeof task === 'string' ? task : (task?.textAr || task?.labelAr || '')}
                  onChange={(e) => {
                    const newTasks = [...(formData.includedTasksAr || [])];
                    newTasks[index] = e.target.value;
                    setFormData(prev => ({ ...prev, includedTasksAr: newTasks }));
                  }}
                  placeholder="مثال: ترتيب غرف النوم ومسح الأتربة والغبار عن الأسطح..."
                />
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      includedTasksAr: prev.includedTasksAr.filter((_, i) => i !== index)
                    }));
                  }}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {(!formData.includedTasksAr || formData.includedTasksAr.length === 0) && (
              <div className="text-center py-4 bg-white/60 dark:bg-white/5 rounded-xl border border-dashed border-emerald-200 text-xs text-gray-400">
                لا توجد مهام مشمولة مضافة حالياً. اضغط "إضافة مهمة مشمولة" لإضافة بنود الزيارة.
              </div>
            )}
          </div>

          {/* Equipment Notice */}
          <div className="pt-4 border-t border-emerald-100 dark:border-white/5">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">
              تنويه هام بشأن المواد والمعدات (يظهر في الصندوق الأخضر بنافذة المساعدة):
            </label>
            <textarea
              rows={2}
              className="input text-xs"
              value={formData.equipmentNoticeAr || ''}
              onChange={(e) => setFormData({ ...formData, equipmentNoticeAr: e.target.value })}
              placeholder="مثال: أدوات ومواد التنظيف (المكانس، المنظفات، الفوط، المماسح) يوفرها العميل، والعمالة مدربة ومحترفة من شركة المتحدة لإتمام باقي الشغل بأعلى مستوى وجودة!"
            />
          </div>
        </div>

        {/* Cleaning Types */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2"><Layers size={20} className="text-primary-500"/> أنواع وباقات التنظيف (عادي، عميق، بعد التشطيب...)</h2>
              <p className="text-xs text-gray-500 mt-0.5">تحديد مستوى ونوع التنظيف مع الوصف الكامل والتكلفة الإضافية</p>
            </div>
            <button type="button" onClick={() => handleArrayAdd('cleaningTypes', { labelAr: '', label: '', price: 0, descriptionAr: '', description: '' })} className="btn-secondary text-xs">
              <Plus size={14} /> إضافة نوع تنظيف
            </button>
          </div>
          <div className="space-y-4">
            {formData.cleaningTypes.map((item, index) => (
              <div key={item.key} className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/10 relative group space-y-3">
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                  <div className="flex-1 w-full">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">الاسم (عربي)</label>
                    <input type="text" className="input" value={item.labelAr} onChange={e => handleArrayChange('cleaningTypes', index, 'labelAr', e.target.value)} placeholder="مثال: تنظيف عميق وشامل" />
                  </div>
                  <div className="flex-1 w-full">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">الاسم (إنجليزي)</label>
                    <input type="text" className="input" value={item.label} onChange={e => handleArrayChange('cleaningTypes', index, 'label', e.target.value)} placeholder="Deep Cleaning" />
                  </div>
                  <div className="w-full sm:w-36">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">السعر الإضافي</label>
                    <div className="relative">
                      <input type="number" className="input pl-10" value={item.price} onChange={e => handleArrayChange('cleaningTypes', index, 'price', e.target.value)} />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">ج.م</span>
                    </div>
                  </div>
                  <button type="button" onClick={() => handleArrayRemove('cleaningTypes', index)} className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 border border-transparent hover:border-red-100 dark:hover:border-red-500/20 rounded-xl transition-colors shrink-0">
                    <Trash2 size={18} />
                  </button>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">تفاصيل ووصف نوع التنظيف (يظهر داخل بطاقة الاختيار في التطبيق)</label>
                  <textarea rows={2} className="input text-xs" value={item.descriptionAr || ''} onChange={e => handleArrayChange('cleaningTypes', index, 'descriptionAr', e.target.value)} placeholder="مثال: تنظيف عميق ومكثف وشامل لجميع أركان المنزل، إزالة الدهون والترسبات المستعصية، تلميع كامل..." />
                </div>
              </div>
            ))}
            {formData.cleaningTypes.length === 0 && (
              <div className="text-center py-8 bg-gray-50 dark:bg-white/5 rounded-xl border border-dashed border-gray-200 dark:border-white/10">
                <p className="text-sm text-gray-400">لا توجد أنواع مضافة حالياً. اضغط "إضافة نوع تنظيف" للبدء.</p>
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

        {/* Room Options (For Home Cleaning & similar) */}
        <div className="card p-6 border-2 border-emerald-500/20 bg-emerald-50/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2 text-emerald-800 dark:text-emerald-400">
                <Home size={20} className="text-emerald-600"/> غرف ومكونات المنزل (غرف نوم، صالون، حمام، مطبخ...)
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">تحديد تسعير كل نوع غرفة ليقوم العميل باختيار عدد الغرف في التطبيق عبر عداد (+ / -)</p>
            </div>
            <button type="button" onClick={() => handleArrayAdd('roomOptions', { labelAr: '', label: '', price: 0, unit: 'flat' })} className="btn-secondary text-xs">
              <Plus size={14} /> إضافة غرفة
            </button>
          </div>
          <div className="space-y-4">
            {(formData.roomOptions || []).map((item, index) => (
              <div key={item.key} className="flex flex-col sm:flex-row gap-4 items-end bg-white dark:bg-white/5 p-4 rounded-xl border border-emerald-100 dark:border-white/10 shadow-xs relative group">
                <div className="flex-1 w-full">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">اسم الغرفة (عربي)</label>
                  <input type="text" className="input" value={item.labelAr} onChange={e => handleArrayChange('roomOptions', index, 'labelAr', e.target.value)} placeholder="مثال: غرفة نوم / مجلس / مطبخ / حمام" />
                </div>
                <div className="flex-1 w-full">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">اسم الغرفة (إنجليزي)</label>
                  <input type="text" className="input" value={item.label} onChange={e => handleArrayChange('roomOptions', index, 'label', e.target.value)} placeholder="Bedroom / Living Room / Kitchen" />
                </div>
                <div className="w-full sm:w-36">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">سعر تنظيف الغرفة</label>
                  <div className="relative">
                    <input type="number" className="input pl-10" value={item.price} onChange={e => handleArrayChange('roomOptions', index, 'price', e.target.value)} />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">ج.م</span>
                  </div>
                </div>
                <button type="button" onClick={() => handleArrayRemove('roomOptions', index)} className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 border border-transparent hover:border-red-100 dark:hover:border-red-500/20 rounded-xl transition-colors shrink-0">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {(!formData.roomOptions || formData.roomOptions.length === 0) && (
              <div className="text-center py-6 bg-white dark:bg-white/5 rounded-xl border border-dashed border-emerald-200 dark:border-white/10">
                <p className="text-sm text-gray-400">لا توجد خيارات غرف مضافة حالياً. اضغط "إضافة غرفة" لإتاحة خيارات الغرف للعميل.</p>
              </div>
            )}
          </div>
        </div>

        {/* Area Options (Home & Apartment Spaces) */}
        <div className="card p-6 border-2 border-blue-500/20 bg-blue-50/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2 text-blue-800 dark:text-blue-400">
                <Grid size={20} className="text-blue-600"/> مساحات الشقق والمنازل (خيارات المساحة م² / الباقات)
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">تحديد باقات المساحات أو سعر المساحة بالمتر المربع للشقق والفلل</p>
            </div>
            <button type="button" onClick={() => handleArrayAdd('areaOptions', { labelAr: '', label: '', subtitleAr: '', subtitle: '', price: 0, areaSqm: '', unit: 'flat' })} className="btn-secondary text-xs">
              <Plus size={14} /> إضافة مساحة
            </button>
          </div>
          <div className="space-y-4">
            {(formData.areaOptions || []).map((item, index) => (
              <div key={item.key} className="bg-white dark:bg-white/5 p-4 rounded-xl border border-blue-100 dark:border-white/10 shadow-xs relative group space-y-3">
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                  <div className="flex-1 w-full">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">اسم المساحة (عربي)</label>
                    <input type="text" className="input" value={item.labelAr} onChange={e => handleArrayChange('areaOptions', index, 'labelAr', e.target.value)} placeholder="مثال: شقة متوسطة" />
                  </div>
                  <div className="flex-1 w-full">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">اسم المساحة (إنجليزي)</label>
                    <input type="text" className="input" value={item.label} onChange={e => handleArrayChange('areaOptions', index, 'label', e.target.value)} placeholder="Medium Apartment" />
                  </div>
                  <div className="w-full sm:w-28">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">المساحة (م²)</label>
                    <input type="number" className="input" value={item.areaSqm || ''} onChange={e => handleArrayChange('areaOptions', index, 'areaSqm', e.target.value)} placeholder="100" />
                  </div>
                  <div className="w-full sm:w-32">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">السعر</label>
                    <div className="relative">
                      <input type="number" className="input pl-10" value={item.price} onChange={e => handleArrayChange('areaOptions', index, 'price', e.target.value)} />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">ج.م</span>
                    </div>
                  </div>
                  <button type="button" onClick={() => handleArrayRemove('areaOptions', index)} className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 border border-transparent hover:border-red-100 dark:hover:border-red-500/20 rounded-xl transition-colors shrink-0">
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-100 dark:border-white/5">
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">الوصف الفرعي / تفاصيل الغرف (عربي - يظهر أسفل الاسم بالتطبيق)</label>
                    <input type="text" className="input text-xs" value={item.subtitleAr || ''} onChange={e => handleArrayChange('areaOptions', index, 'subtitleAr', e.target.value)} placeholder="مثال: 81 - 120 م² - 2 غرف نوم وصالة" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">الوصف الفرعي (إنجليزي)</label>
                    <input type="text" className="input text-xs" value={item.subtitle || ''} onChange={e => handleArrayChange('areaOptions', index, 'subtitle', e.target.value)} placeholder="81 - 120 sqm - 2 Bedrooms & Living" />
                  </div>
                </div>
              </div>
            ))}
            {(!formData.areaOptions || formData.areaOptions.length === 0) && (
              <div className="text-center py-6 bg-white dark:bg-white/5 rounded-xl border border-dashed border-blue-200 dark:border-white/10">
                <p className="text-sm text-gray-400">لا توجد خيارات مساحات مضافة حالياً. اضغط "إضافة مساحة" لتحديد خيارات المساحات.</p>
              </div>
            )}
          </div>
        </div>

        {/* Pricing Options & Areas */}
        <div className="card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Box size={20} className="text-primary-500"/> القطع وقائمة قطع الغسيل / الملحقات ({formData.pricingOptions.length})
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                تنظيم القطع حسب أقسامها المعتمدة لسهولة الإدارة وترتيب ظهورها في تطبيق العملاء
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setShowAddCatBar(!showAddCatBar)}
                className="btn-secondary text-xs flex items-center gap-1.5"
              >
                <FolderPlus size={14} className="text-primary-600" />
                <span>إضافة قسم جديد</span>
              </button>
              <button 
                type="button" 
                onClick={() => handleArrayAdd('pricingOptions', { 
                  labelAr: '', 
                  label: '', 
                  categoryAr: categoryFilter !== 'ALL' && categoryFilter !== 'غير مصنف' ? categoryFilter : 'الأطفال', 
                  category: getCategoryMeta(categoryFilter !== 'ALL' ? categoryFilter : 'الأطفال').nameEn,
                  price: 0, 
                  unit: 'per_piece', 
                  subtitleAr: '' 
                })} 
                className="btn-primary text-xs flex items-center gap-1.5"
              >
                <Plus size={14} /> إضافة قطعة سريعة
              </button>
            </div>
          </div>

          {/* Explanatory Guide for Laundry / Service Organization */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/25 dark:to-indigo-950/25 border border-blue-200/80 dark:border-blue-900/40 p-4 rounded-2xl mb-5">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-blue-500 text-white shrink-0 mt-0.5 shadow-xs">
                <Info size={18} />
              </div>
              <div className="flex-1 text-xs space-y-2">
                <h3 className="font-bold text-sm text-blue-900 dark:text-blue-200">
                  دليل هيكلية خدمات وأقسام الغسيل في التطبيق:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                  <div className="bg-white/80 dark:bg-black/20 p-2.5 rounded-xl border border-blue-100 dark:border-white/5">
                    <span className="font-bold text-blue-800 dark:text-blue-300 block mb-1">1️⃣ أنواع الخدمة الرئيسية</span>
                    <p className="text-gray-600 dark:text-gray-300 text-[11px] leading-relaxed">
                      الخيارات الرئيسية التي يراها العميل أولاً (غسيل وكوي، كوي فقط، معالجة الملابس) وتدار من قسم "أنواع وباقات التنظيف" بالأعلى.
                    </p>
                  </div>
                  <div className="bg-white/80 dark:bg-black/20 p-2.5 rounded-xl border border-blue-100 dark:border-white/5">
                    <span className="font-bold text-blue-800 dark:text-blue-300 block mb-1">2️⃣ الأقسام المصنفة</span>
                    <p className="text-gray-600 dark:text-gray-300 text-[11px] leading-relaxed">
                      أقسام الملابس (الأطفال، الجزء السفلي، ملابس رسمية، أحذية...) تظهر كأيقونات يختار العميل منها نوع القطع التي يريد غسيلها أو كويها.
                    </p>
                  </div>
                  <div className="bg-white/80 dark:bg-black/20 p-2.5 rounded-xl border border-blue-100 dark:border-white/5">
                    <span className="font-bold text-blue-800 dark:text-blue-300 block mb-1">3️⃣ القطع والتسعير</span>
                    <p className="text-gray-600 dark:text-gray-300 text-[11px] leading-relaxed">
                      كل قطعة مصنفة تحت قسمها مع سعرها المحدد، ويقوم العميل بزيادة أو إنقاص عدد القطع المطلوبة عبر العداد (+/-).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Add New Category Form (Collapsible) */}
          {showAddCatBar && (
            <div className="p-4 bg-primary-50/80 dark:bg-primary-950/40 rounded-xl border border-primary-200 dark:border-primary-900/50 mb-5 flex flex-col sm:flex-row items-center gap-3 animate-fade-in shadow-xs">
              <div className="flex-1 w-full">
                <label className="text-xs font-bold text-primary-900 dark:text-primary-300 block mb-1">
                  اسم القسم الجديد (عربي):
                </label>
                <input
                  type="text"
                  className="input text-xs py-1.5 h-9"
                  value={newCatInput}
                  onChange={e => setNewCatInput(e.target.value)}
                  placeholder="مثال: ستائر ومفروشات خاصة / سجاد يدوي"
                />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto pt-2 sm:pt-4">
                <button
                  type="button"
                  disabled={!newCatInput.trim()}
                  onClick={() => {
                    if (!newCatInput.trim()) return;
                    handleArrayAdd('pricingOptions', {
                      labelAr: '',
                      label: '',
                      categoryAr: newCatInput.trim(),
                      category: 'custom',
                      price: 0,
                      unit: 'per_piece',
                      subtitleAr: ''
                    });
                    setCategoryFilter(newCatInput.trim());
                    setNewCatInput('');
                    setShowAddCatBar(false);
                    alert(`تم إنشاء قسم (${newCatInput.trim()}) بنجاح`);
                  }}
                  className="btn-primary text-xs py-2 px-4 whitespace-nowrap disabled:opacity-50"
                >
                  <Plus size={14} /> إنشاء القسم وإضافة أول قطعة
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCatBar(false)}
                  className="btn-secondary text-xs py-2 px-3"
                >
                  إلغاء
                </button>
              </div>
            </div>
          )}

          {/* Preset Categories Quick Buttons */}
          <div className="bg-gray-50/80 dark:bg-white/[0.03] border border-gray-200/80 dark:border-white/10 p-3.5 rounded-xl mb-5">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                <Tag size={13} className="text-primary-600" />
                أقسام الغسيل المعتمدة (اضغط لإضافة قطعة سريعة للقسم مباشرة):
              </span>
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={collapseAllCategories}
                  className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 text-[11px]"
                >
                  طي الكل
                </button>
                <span className="text-gray-300">|</span>
                <button
                  type="button"
                  onClick={expandAllCategories}
                  className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 text-[11px]"
                >
                  توسيع الكل
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {PRESET_LAUNDRY_CATEGORIES.map(cat => {
                const count = formData.pricingOptions.filter(p => (p.categoryAr?.trim() || '') === cat.nameAr).length;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleArrayAdd('pricingOptions', {
                      labelAr: '',
                      label: '',
                      categoryAr: cat.nameAr,
                      category: cat.nameEn,
                      price: 0,
                      unit: 'per_piece',
                      subtitleAr: ''
                    })}
                    className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-white/10 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-white/10 text-xs font-medium hover:border-primary-500 hover:text-primary-600 transition-all flex items-center gap-1.5 shadow-xs"
                    title={`إضافة قطعة جديدة إلى قسم ${cat.nameAr}`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.nameAr}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-gray-100 dark:bg-white/10 font-bold text-gray-500 dark:text-gray-400">
                      {count}
                    </span>
                    <Plus size={11} className="text-primary-600 ml-0.5" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filter, Search & View Controls */}
          <div className="space-y-3 mb-5 pb-4 border-b border-gray-100 dark:border-white/10">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search */}
              <div className="relative flex-1 sm:max-w-xs">
                <input
                  type="text"
                  value={searchPiece}
                  onChange={e => setSearchPiece(e.target.value)}
                  placeholder="بحث عن قطعة بالاسم أو القسم..."
                  className="input pr-8 text-xs py-1.5 h-9"
                />
                <Search size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                {searchPiece && (
                  <button
                    type="button"
                    onClick={() => setSearchPiece('')}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <div className="flex items-center bg-gray-100 dark:bg-white/10 p-0.5 rounded-lg border border-gray-200 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setViewMode('grouped')}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                      viewMode === 'grouped' ? 'bg-white dark:bg-black/40 text-primary-600 shadow-xs' : 'text-gray-500'
                    }`}
                  >
                    <LayoutGrid size={13} />
                    عرض مقسم حسب الأقسام
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('flat')}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                      viewMode === 'flat' ? 'bg-white dark:bg-black/40 text-primary-600 shadow-xs' : 'text-gray-500'
                    }`}
                  >
                    <List size={13} />
                    عرض كقائمة
                  </button>
                </div>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              <button
                type="button"
                onClick={() => setCategoryFilter('ALL')}
                className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 transition-all ${
                  categoryFilter === 'ALL'
                    ? 'bg-primary-600 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/10 dark:text-gray-300'
                }`}
              >
                📋 جميع الأقسام ({formData.pricingOptions.length})
              </button>
              {(() => {
                const uniqueCats = Array.from(new Set(formData.pricingOptions.map(p => p.categoryAr?.trim() || 'غير مصنف')));
                const orderedCats = [
                  ...PRESET_LAUNDRY_CATEGORIES.map(c => c.nameAr).filter(name => uniqueCats.includes(name)),
                  ...uniqueCats.filter(name => !PRESET_LAUNDRY_CATEGORIES.some(c => c.nameAr === name))
                ];
                return orderedCats.map(catName => {
                  const count = formData.pricingOptions.filter(p => (p.categoryAr?.trim() || 'غير مصنف') === catName).length;
                  const meta = getCategoryMeta(catName);
                  const isAct = categoryFilter === catName;
                  return (
                    <button
                      key={catName}
                      type="button"
                      onClick={() => setCategoryFilter(catName)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 flex items-center gap-1 transition-all ${
                        isAct
                          ? 'bg-primary-600 text-white shadow-xs'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/10 dark:text-gray-300'
                      }`}
                    >
                      <span>{meta.icon}</span>
                      <span>{catName}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isAct ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-400'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                });
              })()}
            </div>
          </div>

          {/* Grouped Category Cards View */}
          {viewMode === 'grouped' ? (
            <div className="space-y-6">
              {(() => {
                // Group items by category with their original indices
                const groups = {};
                formData.pricingOptions.forEach((item, originalIndex) => {
                  const cat = item.categoryAr?.trim() || 'غير مصنف';
                  if (!groups[cat]) groups[cat] = [];
                  groups[cat].push({ item, originalIndex });
                });

                const groupKeys = Object.keys(groups);
                // Ordered: presets first, then others
                const orderedKeys = [
                  ...PRESET_LAUNDRY_CATEGORIES.map(c => c.nameAr).filter(k => groupKeys.includes(k)),
                  ...groupKeys.filter(k => !PRESET_LAUNDRY_CATEGORIES.some(c => c.nameAr === k))
                ];

                if (orderedKeys.length === 0) {
                  return (
                    <div className="text-center py-12 bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
                      <Box size={36} className="mx-auto text-gray-300 mb-2" />
                      <p className="text-sm font-bold text-gray-600 dark:text-gray-300">لا توجد قطع مضافة حالياً</p>
                      <p className="text-xs text-gray-400 mt-1">اضغط على أحد الأقسام المعتمدة بالأعلى للبدء في إضافة القطع فوراً</p>
                    </div>
                  );
                }

                return orderedKeys.map(catName => {
                  if (categoryFilter !== 'ALL' && categoryFilter !== catName) return null;

                  const rawItems = groups[catName] || [];
                  // Search filtering
                  const filteredItems = rawItems.filter(({ item }) => {
                    if (!searchPiece) return true;
                    const q = searchPiece.toLowerCase();
                    return (
                      (item.labelAr || '').toLowerCase().includes(q) ||
                      (item.label || '').toLowerCase().includes(q) ||
                      (item.categoryAr || '').toLowerCase().includes(q) ||
                      (item.subtitleAr || '').toLowerCase().includes(q)
                    );
                  });

                  if (searchPiece && filteredItems.length === 0) return null;

                  const meta = getCategoryMeta(catName);
                  const isCollapsed = !!collapsedCategories[catName];

                  return (
                    <div 
                      key={catName} 
                      className="rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden bg-white dark:bg-white/[0.02] shadow-xs transition-all"
                    >
                      {/* Category Header */}
                      <div className="p-4 bg-gradient-to-r from-slate-50 via-gray-50 to-white dark:from-white/[0.05] dark:via-white/[0.02] dark:to-transparent border-b border-gray-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 flex items-center justify-center text-xl shadow-xs shrink-0">
                            {meta.icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-bold text-base text-gray-900 dark:text-white">
                                قسم: {catName}
                              </h3>
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
                                {rawItems.length} قطع
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1">
                              <Info size={12} className="text-primary-500" />
                              <span>{meta.typeHint}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => handleArrayAdd('pricingOptions', {
                              labelAr: '',
                              label: '',
                              categoryAr: catName,
                              category: meta.nameEn,
                              price: 0,
                              unit: 'per_piece',
                              subtitleAr: ''
                            })}
                            className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
                          >
                            <Plus size={14} /> إضافة قطعة بهذا القسم
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleCategoryCollapse(catName)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                            title={isCollapsed ? 'توسيع القسم' : 'طي القسم'}
                          >
                            {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                          </button>
                        </div>
                      </div>

                      {/* Category Items */}
                      {!isCollapsed && (
                        <div className="p-4 space-y-3">
                          {filteredItems.map(({ item, originalIndex }, idx) => (
                            <div 
                              key={item.key || originalIndex} 
                              className="bg-gray-50/70 dark:bg-white/[0.03] p-3.5 rounded-xl border border-gray-200/80 dark:border-white/10 hover:border-primary-400 dark:hover:border-primary-600 transition-all space-y-3"
                            >
                              <div className="flex items-center justify-between pb-2 border-b border-gray-200/50 dark:border-white/5 text-xs">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-gray-700 dark:text-gray-300">
                                    قطعة #{idx + 1}
                                  </span>
                                  {item.labelAr && (
                                    <span className="text-gray-400">({item.labelAr})</span>
                                  )}
                                </div>

                                <div className="flex items-center gap-3">
                                  {/* Change category */}
                                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                                    <span>نقل للقسم:</span>
                                    <select
                                      className="input text-xs py-0.5 px-2 h-7 bg-white dark:bg-black/30"
                                      value={item.categoryAr || ''}
                                      onChange={e => handleArrayChange('pricingOptions', originalIndex, 'categoryAr', e.target.value)}
                                    >
                                      {PRESET_LAUNDRY_CATEGORIES.map(c => (
                                        <option key={c.nameAr} value={c.nameAr}>{c.icon} {c.nameAr}</option>
                                      ))}
                                      {groupKeys.filter(c => !PRESET_LAUNDRY_CATEGORIES.some(p => p.nameAr === c)).map(c => (
                                        <option key={c} value={c}>📦 {c}</option>
                                      ))}
                                    </select>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => handleArrayRemove('pricingOptions', originalIndex)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 p-1.5 rounded-lg flex items-center gap-1 transition-colors text-xs"
                                    title="حذف القطعة"
                                  >
                                    <Trash2 size={14} />
                                    <span className="hidden sm:inline">حذف</span>
                                  </button>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                                {/* Arabic Name */}
                                <div className="sm:col-span-4">
                                  <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-300 mb-1 block">
                                    اسم القطعة (عربي) *
                                  </label>
                                  <input
                                    type="text"
                                    className="input text-xs py-1.5 h-9 font-medium"
                                    value={item.labelAr || ''}
                                    onChange={e => handleArrayChange('pricingOptions', originalIndex, 'labelAr', e.target.value)}
                                    placeholder="مثال: بلوزة أطفال / بنطلون جينز"
                                  />
                                </div>

                                {/* English Name */}
                                <div className="sm:col-span-3">
                                  <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-300 mb-1 block">
                                    الاسم (إنجليزي)
                                  </label>
                                  <input
                                    type="text"
                                    className="input text-xs py-1.5 h-9"
                                    value={item.label || ''}
                                    onChange={e => handleArrayChange('pricingOptions', originalIndex, 'label', e.target.value)}
                                    placeholder="Kid's Blouse"
                                  />
                                </div>

                                {/* Price */}
                                <div className="sm:col-span-2">
                                  <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-300 mb-1 block">
                                    السعر (ج.م) *
                                  </label>
                                  <div className="relative">
                                    <input
                                      type="number"
                                      className="input text-xs py-1.5 h-9 pl-7 font-bold text-emerald-600 dark:text-emerald-400"
                                      value={item.price}
                                      onChange={e => handleArrayChange('pricingOptions', originalIndex, 'price', e.target.value)}
                                    />
                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[11px] text-gray-400 font-bold">ج.م</span>
                                  </div>
                                </div>

                                {/* Unit */}
                                <div className="sm:col-span-3">
                                  <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-300 mb-1 block">
                                    نوع الحساب
                                  </label>
                                  <select
                                    className="input text-xs py-1.5 h-9"
                                    value={item.unit || 'per_piece'}
                                    onChange={e => handleArrayChange('pricingOptions', originalIndex, 'unit', e.target.value)}
                                  >
                                    <option value="per_piece">بالقطعة / بالعدد</option>
                                    <option value="per_sqm">بالمتر المربع</option>
                                    <option value="per_meter">بالمتر الطولي</option>
                                    <option value="flat">سعر ثابت</option>
                                  </select>
                                </div>
                              </div>

                              {/* Subtitle / Note */}
                              <div className="pt-1">
                                <input
                                  type="text"
                                  className="input text-xs py-1.5 h-8 text-gray-500 bg-white dark:bg-black/20"
                                  value={item.subtitleAr || ''}
                                  onChange={e => handleArrayChange('pricingOptions', originalIndex, 'subtitleAr', e.target.value)}
                                  placeholder="ملاحظة أو وصف فرعي (اختياري - مثلاً: قطن 100% / يحتاج عناية خاصة)"
                                />
                              </div>
                            </div>
                          ))}

                          {filteredItems.length === 0 && (
                            <p className="text-center py-4 text-xs text-gray-400">لا توجد قطع مطابقة للبحث داخل هذا القسم</p>
                          )}

                          {/* Dotted Quick Add inside this category */}
                          <button
                            type="button"
                            onClick={() => handleArrayAdd('pricingOptions', {
                              labelAr: '',
                              label: '',
                              categoryAr: catName,
                              category: meta.nameEn,
                              price: 0,
                              unit: 'per_piece',
                              subtitleAr: ''
                            })}
                            className="w-full py-2.5 rounded-xl border-2 border-dashed border-primary-200 dark:border-primary-900/60 text-primary-600 dark:text-primary-400 hover:bg-primary-50/70 dark:hover:bg-primary-950/30 text-xs font-bold flex items-center justify-center gap-2 transition-all mt-2"
                          >
                            <Plus size={15} /> إضافة قطعة جديدة في قسم ({catName})
                          </button>
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          ) : (
            /* Flat List View Fallback */
            <div className="space-y-4">
              {formData.pricingOptions.map((item, index) => {
                const itemCat = item.categoryAr?.trim() || 'غير مصنف';
                if (categoryFilter !== 'ALL' && itemCat !== categoryFilter) return null;
                if (searchPiece) {
                  const q = searchPiece.toLowerCase();
                  const matchNameAr = (item.labelAr || '').toLowerCase().includes(q);
                  const matchNameEn = (item.label || '').toLowerCase().includes(q);
                  const matchCat = itemCat.toLowerCase().includes(q);
                  if (!matchNameAr && !matchNameEn && !matchCat) return null;
                }

                return (
                  <div key={item.key || index} className="bg-gray-50/80 dark:bg-white/5 p-4 rounded-xl border border-gray-200/70 dark:border-white/10 relative group space-y-3 hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-200/50 dark:border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-primary-100 dark:bg-primary-900/40 text-primary-800 dark:text-primary-300 border border-primary-200/50">
                          {item.categoryAr ? `قسم: ${item.categoryAr}` : 'غير مصنف'}
                        </span>
                        <span className="text-[11px] text-gray-400">قطعة #{index + 1}</span>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => handleArrayRemove('pricingOptions', index)} 
                        className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 px-2 py-1 rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <Trash2 size={14} /> حذف القطعة
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                      <div className="sm:col-span-4">
                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1 block">اسم القطعة (عربي) *</label>
                        <input 
                          type="text" 
                          className="input" 
                          value={item.labelAr} 
                          onChange={e => handleArrayChange('pricingOptions', index, 'labelAr', e.target.value)} 
                          placeholder="مثال: بلوزة أطفال / بنطلون جينز" 
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1 block">الاسم (إنجليزي)</label>
                        <input 
                          type="text" 
                          className="input" 
                          value={item.label} 
                          onChange={e => handleArrayChange('pricingOptions', index, 'label', e.target.value)} 
                          placeholder="Kid's Blouse" 
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1 block">القسم / التصنيف *</label>
                        <select
                          className="input text-xs"
                          value={item.categoryAr || ''}
                          onChange={e => handleArrayChange('pricingOptions', index, 'categoryAr', e.target.value)}
                        >
                          <option value="">-- اختر القسم --</option>
                          {PRESET_LAUNDRY_CATEGORIES.map(c => (
                            <option key={c.nameAr} value={c.nameAr}>{c.icon} {c.nameAr}</option>
                          ))}
                          {item.categoryAr && !PRESET_LAUNDRY_CATEGORIES.some(c => c.nameAr === item.categoryAr) && (
                            <option value={item.categoryAr}>📦 {item.categoryAr}</option>
                          )}
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1 block">السعر (ج.م) *</label>
                        <div className="relative">
                          <input 
                            type="number" 
                            className="input pl-8 font-bold" 
                            value={item.price} 
                            onChange={e => handleArrayChange('pricingOptions', index, 'price', e.target.value)} 
                          />
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">ج.م</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </form>
    </div>
  );
}
