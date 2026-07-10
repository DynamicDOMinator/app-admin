'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Settings, DollarSign, Percent, Save, Check, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { settingsApi } from '@/lib/api';

import { useLanguage } from '@/components/providers/LanguageProvider';

const GENERAL_SETTINGS = [
  { key: 'support_phone', label: 'رقم الدعم الفني', type: 'text', value: '+966500000000' },
  { key: 'support_email', label: 'بريد الدعم', type: 'email', value: 'support@unitedcleaning.com' },
  { key: 'app_version_android', label: 'إصدار Android', type: 'text', value: '1.0.0' },
  { key: 'app_version_ios', label: 'إصدار iOS', type: 'text', value: '1.0.0' },
  { key: 'instapay_number', label: 'رقم InstaPay', type: 'text', value: '' },
];

export default function SettingsPage() {
  const { lang } = useLanguage();
  const [general, setGeneral] = useState(GENERAL_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await settingsApi.getAll();
      const dbSettings = res?.data || {};


      setGeneral(prev => prev.map(g => ({ ...g, value: dbSettings[g.key] ?? g.value })));
    } catch (err) {
      toast.error('فشل في تحميل الإعدادات');
    } finally {
      setLoading(false);
    }
  };



  const updateGeneral = (key, val) => {
    setGeneral(prev => prev.map(g => g.key === key ? { ...g, value: val } : g));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const allSettings = [...general].reduce((acc, s) => {
        acc[s.key] = s.value;
        return acc;
      }, {});
      await settingsApi.bulkUpdate(allSettings);
      toast.success('تم حفظ الإعدادات بنجاح');
    } catch (error) {
      toast.error('فشل حفظ الإعدادات');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">الإعدادات</h1>
          <p className="text-sm text-gray-500 mt-1">إدارة الأسعار والإعدادات العامة للمنصة</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="btn-primary"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-teal-600" size={32} />
        </div>
      ) : (
        <>
      {/* General Settings */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl">
            <Settings size={16} className="text-white" />
          </div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">الإعدادات العامة</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {general.map((setting) => (
            <div key={setting.key}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                {setting.label}
              </label>
              <input
                type={setting.type || 'text'}
                value={setting.value}
                onChange={e => updateGeneral(setting.key, e.target.value)}
                className="input"
              />
            </div>
          ))}
        </div>
      </motion.div>
        </>
      )}
    </div>
  );
}
