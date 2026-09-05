'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, ChevronLeft, ChevronRight, Loader2, RefreshCw, AlertCircle, X } from 'lucide-react';
import { ordersApi } from '@/lib/api';
import { ORDER_STATUS_LABELS, formatCurrency, formatDate } from '@/lib/utils';

import { useLanguage } from '@/components/providers/LanguageProvider';

const STATUSES = ['all', 'pending', 'confirmed', 'assigned', 'on_the_way', 'in_progress', 'completed', 'cancelled'];

export default function OrdersPage() {
  const { lang } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const pageSize = 10;

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit: pageSize, sort: '-createdAt' };
      if (status !== 'all') params.status = status;
      if (search) params.search = search;

      const res = await ordersApi.getAll(params);
      const data = res?.data;
      setOrders(data?.docs || data || []);
      setTotalPages(data?.totalPages || 1);
      setTotal(data?.totalDocs || (data?.docs?.length ?? 0));
    } catch (err) {
      setError(err?.message || (lang === 'ar' ? 'فشل تحميل الطلبات' : 'Failed to load orders'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [status, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchOrders();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {lang === 'ar' ? 'إدارة الطلبات' : 'Orders Management'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? (lang === 'ar' ? 'جاري التحميل...' : 'Loading...') : `${total} ${lang === 'ar' ? 'طلب إجمالي' : 'Total Orders'}`}
          </p>
        </div>
        <button className="btn-secondary" onClick={() => { setPage(1); fetchOrders(); }} disabled={loading}>
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> {lang === 'ar' ? 'تحديث' : 'Refresh'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="card p-4 border border-red-200 bg-red-50 dark:bg-red-500/10 flex items-center gap-3">
          <AlertCircle className="text-red-500" size={18} />
          <p className="text-red-600 text-sm flex-1">{error}</p>
          <button onClick={fetchOrders} className="btn-secondary text-sm">{lang === 'ar' ? 'إعادة المحاولة' : 'Retry'}</button>
        </div>
      )}

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="relative flex-1 flex gap-2">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={lang === 'ar' ? 'ابحث برقم الطلب أو اسم العميل...' : 'Search by order number or customer...'}
            className="input flex-1"
          />
          <button type="submit" className="btn-primary px-4">{lang === 'ar' ? 'بحث' : 'Search'}</button>
        </form>
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map(s => {
            const conf = ORDER_STATUS_LABELS?.[s];
            return (
              <button
                key={s}
                onClick={() => { setStatus(s); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  status === s
                    ? 'bg-teal-600 text-white border-teal-600'
                    : 'bg-white dark:bg-dark-50 text-gray-500 border-gray-200 dark:border-white/10 hover:border-teal-300'
                }`}
              >
                {s === 'all' ? (lang === 'ar' ? 'الكل' : 'All') : (lang === 'ar' ? conf?.ar || s : conf?.en || s)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 dark:bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-gray-400">{lang === 'ar' ? 'لا توجد طلبات' : 'No orders found'}</div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>{lang === 'ar' ? 'رقم الطلب' : 'Order No'}</th>
                  <th>{lang === 'ar' ? 'العميل' : 'Customer'}</th>
                  <th>{lang === 'ar' ? 'الخدمة' : 'Service'}</th>
                  <th>{lang === 'ar' ? 'الموظف' : 'Employee'}</th>
                  <th>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                  <th>{lang === 'ar' ? 'الدفع' : 'Payment'}</th>
                  <th>{lang === 'ar' ? 'المبلغ' : 'Amount'}</th>
                  <th>{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                  <th>{lang === 'ar' ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => {
                  const statusConf = ORDER_STATUS_LABELS?.[order.status];
                  return (
                    <tr key={order._id}>
                      <td>
                        <span className="font-mono text-xs text-teal-600 font-semibold">{order.orderNumber}</span>
                      </td>
                      <td className="font-medium">{order.customer?.nameAr || order.customer?.name || '—'}</td>
                      <td className="text-gray-500 text-sm">
                        {order.items?.[0]?.serviceType || order.items?.[0]?.serviceName || '—'}
                      </td>
                      <td className="text-gray-500 text-sm">
                        {order.employee?.name || order.employee?.nameAr || <span className="text-yellow-500 text-xs">غير مخصص</span>}
                      </td>
                      <td>
                        <span className={statusConf?.class || 'badge-gray'}>{statusConf?.ar || order.status}</span>
                      </td>
                      <td className="text-gray-500 text-sm capitalize">
                        {order.paymentMethod === 'cash' ? 'كاش'
                         : order.paymentMethod === 'wallet' ? 'محفظة'
                         : order.paymentMethod === 'card' ? 'بطاقة'
                         : order.paymentMethod || '—'}
                      </td>
                      <td className="font-semibold">{formatCurrency(order.total || 0)}</td>
                      <td className="text-gray-400 text-xs">{formatDate(order.scheduledDate || order.createdAt)}</td>
                      <td>
                        <button className="btn-ghost p-1.5 text-teal-600" title="عرض" onClick={() => setSelectedOrder(order)}>
                          <Eye size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-50 dark:border-white/5">
            <p className="text-sm text-gray-500">
              الصفحة {page} من {totalPages}
            </p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-ghost p-1.5 disabled:opacity-40">
                <ChevronRight size={16} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium ${page === i + 1 ? 'bg-teal-600 text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'}`}
                >
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-ghost p-1.5 disabled:opacity-40">
                <ChevronLeft size={16} />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {lang === 'ar' ? 'تفاصيل الطلب' : 'Order Details'} - {selectedOrder.orderNumber}
              </h2>
              <button onClick={() => setSelectedOrder(null)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{lang === 'ar' ? 'العميل' : 'Customer'}</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedOrder.customer?.nameAr || selectedOrder.customer?.name}</p>
                  <p className="text-sm text-gray-500">{selectedOrder.customer?.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">{lang === 'ar' ? 'المبلغ الإجمالي' : 'Total Amount'}</p>
                  <p className="font-bold text-teal-600 text-lg">{formatCurrency(selectedOrder.total)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">{lang === 'ar' ? 'تاريخ التنفيذ' : 'Scheduled Date'}</p>
                  <p className="font-medium text-gray-900 dark:text-white">{formatDate(selectedOrder.scheduledDate)} - {selectedOrder.scheduledTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">{lang === 'ar' ? 'طريقة الدفع' : 'Payment Method'}</p>
                  <p className="font-medium text-gray-900 dark:text-white uppercase">{selectedOrder.paymentMethod}</p>
                </div>
              </div>

              {/* Order Items & Services Breakdown */}
              <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mb-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
                  {lang === 'ar' ? 'الخدمات وتفاصيل الغرف والمساحات' : 'Services & Room/Area Details'}
                </h3>
                <div className="space-y-3">
                  {(selectedOrder.items || []).map((item, idx) => (
                    <div key={idx} className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-200/70 dark:border-white/10 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-900 dark:text-white">
                          {item.serviceNameAr || item.serviceName || item.service?.nameAr || item.service?.name} (×{item.quantity || 1})
                        </span>
                        <span className="font-bold text-teal-600">
                          {formatCurrency(item.totalPrice || item.unitPrice || 0)}
                        </span>
                      </div>

                      {/* Package subscription details */}
                      {(item.options?.isPackage || item.options?.packageNameAr || item.options?.visits) && (
                        <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800/50 space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                              📦 {lang === 'ar' ? 'باقة اشتراك:' : 'Package Subscription:'} {item.options?.packageNameAr || item.serviceNameAr}
                            </span>
                            <span className="text-[11px] font-extrabold bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 px-2 py-0.5 rounded">
                              {item.options?.visits || 1} {lang === 'ar' ? 'زيارات' : 'visits'}
                            </span>
                          </div>
                          {item.options?.visitsDetailsAr && (
                            <p className="text-xs text-emerald-800 dark:text-emerald-400">
                              {item.options.visitsDetailsAr}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Rooms breakdown */}
                      {((item.rooms && item.rooms.length > 0) || (item.options?.rooms && item.options.rooms.length > 0)) && (
                        <div className="bg-white dark:bg-gray-800 p-2.5 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                          <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400 mb-1.5 flex items-center gap-1">
                            🏠 {lang === 'ar' ? 'الغرف المحددة:' : 'Selected Rooms:'}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {(item.rooms || item.options?.rooms || []).map((rm, rIdx) => (
                              <span key={rIdx} className="bg-emerald-50 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 text-xs px-2.5 py-0.5 rounded-md font-medium border border-emerald-200/60">
                                {rm.labelAr || rm.label || rm.nameAr || rm.name}: <b>{rm.count || 1}</b> {Number(rm.price) > 0 ? `(${rm.price * (rm.count || 1)} ج.م)` : ''}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Area details */}
                      {(item.areaDetails || item.options?.areaDetails || item.totalMeters || (item.width && item.length)) && (
                        <div className="bg-white dark:bg-gray-800 p-2.5 rounded-lg border border-blue-100 dark:border-blue-900/30">
                          <p className="text-xs font-bold text-blue-800 dark:text-blue-400 mb-1 flex items-center gap-1">
                            📐 {lang === 'ar' ? 'المساحة / المقاسات:' : 'Area / Dimensions:'}
                          </p>
                          <span className="text-xs text-blue-900 dark:text-blue-200 font-semibold">
                            {item.areaDetails?.labelAr || item.areaDetails?.label || item.options?.areaDetails?.labelAr || item.options?.areaDetails?.label || (item.totalMeters ? `${item.totalMeters} م²` : `${item.width} × ${item.length} م`)}
                            {(item.areaDetails?.price || item.options?.areaDetails?.price) ? ` (${item.areaDetails?.price || item.options?.areaDetails?.price} ج.م)` : ''}
                          </span>
                        </div>
                      )}

                      {/* Extra Pricing Options */}
                      {item.options?.pricingOptions && item.options.pricingOptions.length > 0 && (
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          <span className="font-semibold">{lang === 'ar' ? 'ملحقات إضافية:' : 'Extra options:'} </span>
                          {item.options.pricingOptions.map(o => `${o.labelAr || o.label} (×${o.count || 1})`).join('، ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrder.paymentMethod === 'instapay' && selectedOrder.instapayReceipt && (
                <div className="mt-6 border-t border-gray-100 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    {lang === 'ar' ? 'صورة إيصال التحويل (InstaPay)' : 'InstaPay Receipt'}
                  </h3>
                  <div className="flex justify-center bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <img 
                      src={selectedOrder.instapayReceipt} 
                      alt="Instapay Receipt" 
                      className="max-w-full h-auto max-h-[400px] rounded-lg shadow-sm"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="p-5 border-t border-gray-100 dark:border-gray-700 flex justify-end">
              <button onClick={() => setSelectedOrder(null)} className="btn-secondary">
                {lang === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
