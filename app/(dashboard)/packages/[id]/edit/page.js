'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import PackageForm from '@/components/PackageForm';
import { packagesApi } from '@/lib/api';
import { useLanguage } from '@/components/providers/LanguageProvider';

export default function EditPackagePage() {
  const { id } = useParams();
  const { lang } = useLanguage();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await packagesApi.getById(id);
        setPackageData(res.data);
      } catch (err) {
        alert(lang === 'ar' ? 'فشل تحميل تفاصيل الباقة' : 'Failed to load package details');
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, [id, lang]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary-500" size={32} />
      </div>
    );
  }

  if (!packageData) return null;

  return <PackageForm initialData={packageData} packageId={id} />;
}
