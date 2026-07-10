'use client';

import { useState, useEffect, useCallback } from 'react';
import { Trash2, MessageSquare, RefreshCw, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { reviewsApi } from '@/lib/api';
import { useLanguage } from '@/components/providers/LanguageProvider';

export default function ReviewsPage() {
  const { lang } = useLanguage();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await reviewsApi.getAll({ limit: 100 });
      setReviews(res.data?.docs || res.data || []);
    } catch (err) {
      toast.error(lang === 'ar' ? 'فشل تحميل التقييمات' : 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleToggleVisibility = async (review) => {
    try {
      await reviewsApi.update(review._id, { isHidden: !review.isHidden });
      setReviews(prev => prev.map(r =>
        r._id === review._id ? { ...r, isHidden: !r.isHidden } : r
      ));
      toast.success(lang === 'ar' ? 'تم تحديث حالة التقييم' : 'Review status updated');
    } catch (err) {
      toast.error(lang === 'ar' ? 'فشل تحديث حالة التقييم' : 'Failed to update review status');
    }
  };

  const handleToggleApproval = async (review) => {
    try {
      await reviewsApi.update(review._id, { isApproved: !review.isApproved });
      setReviews(prev => prev.map(r =>
        r._id === review._id ? { ...r, isApproved: !r.isApproved } : r
      ));
      toast.success(lang === 'ar' ? 'تم تحديث حالة التقييم' : 'Review status updated');
    } catch (err) {
      toast.error(lang === 'ar' ? 'فشل تحديث حالة التقييم' : 'Failed to update review status');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذا التقييم؟' : 'Are you sure you want to delete this review?')) return;
    try {
      await reviewsApi.delete(id);
      setReviews(prev => prev.filter(r => r._id !== id));
      toast.success(lang === 'ar' ? 'تم حذف التقييم بنجاح' : 'Review deleted successfully');
    } catch (err) {
      toast.error(lang === 'ar' ? 'فشل حذف التقييم' : 'Failed to delete review');
    }
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} className={`text-lg ${i < rating ? 'text-[#FCD34D]' : 'text-gray-300 dark:text-gray-600'}`}>★</span>
    ));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {lang === 'ar' ? 'تقييمات العملاء' : 'Customer Reviews'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading 
              ? (lang === 'ar' ? 'جاري التحميل...' : 'Loading...') 
              : `${reviews.length} ${lang === 'ar' ? 'تقييم' : 'Reviews'}`}
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchReviews} className="btn-secondary" disabled={loading}>
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            {lang === 'ar' ? 'تحديث' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12"><RefreshCw className="animate-spin text-primary-500" size={32} /></div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white dark:bg-dark-100 rounded-2xl border border-gray-100 dark:border-white/5">
          <MessageSquare className="mx-auto h-12 w-12 mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{lang === 'ar' ? 'لا توجد تقييمات' : 'No Reviews Found'}</h3>
          <p className="mt-1">{lang === 'ar' ? 'لم يقم أي عميل بإضافة تقييم بعد' : 'No customers have submitted reviews yet'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div key={review._id} className={`card p-5 flex flex-col justify-between ${review.isHidden ? 'opacity-60 grayscale' : ''}`}>
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <img src={review.customer?.avatar || 'https://ui-avatars.com/api/?name=User'} alt="Customer" className="w-10 h-10 rounded-full" />
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{review.customer?.name || 'مستخدم'}</h4>
                      <div className="flex">{renderStars(review.rating)}</div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleToggleApproval(review)} className={`p-1.5 rounded-lg ${review.isApproved ? 'text-green-600 bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`} title={lang === 'ar' ? 'موافقة' : 'Approve'}>
                      {review.isApproved ? <CheckCircle size={18} /> : <XCircle size={18} />}
                    </button>
                    <button onClick={() => handleToggleVisibility(review)} className={`p-1.5 rounded-lg ${!review.isHidden ? 'text-primary-600 bg-primary-50' : 'text-gray-400 hover:bg-gray-100'}`} title={lang === 'ar' ? 'إظهار / إخفاء' : 'Show / Hide'}>
                      {!review.isHidden ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">"{review.comment || (lang === 'ar' ? 'بدون تعليق' : 'No comment')}"</p>
                </div>
                
                {review.service && (
                  <div className="text-xs text-primary-600 font-medium bg-primary-50 dark:bg-primary-500/10 inline-block px-2 py-1 rounded">
                    {lang === 'ar' ? 'تقييم لخدمة' : 'Service Review'}
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-end gap-2 pt-4 mt-2">
                <button onClick={() => handleDelete(review._id)} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 text-sm">
                  <Trash2 size={16} /> {lang === 'ar' ? 'حذف التقييم' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
