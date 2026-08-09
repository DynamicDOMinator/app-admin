'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Search, Star, Phone, Plus, RefreshCw, Eye, X, UserCheck, Briefcase, Award } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { employeesApi } from '@/lib/api';

const MOCK_EMPLOYEES = Array.from({ length: 10 }, (_, i) => ({
  _id: String(i + 1),
  user: {
    name: ['محمد أحمد', 'خالد العمري', 'سلطان المطيري', 'يوسف القحطاني', 'عمر الشهري'][i % 5],
    phone: `+9665${String(i + 1).padStart(8, '0')}`,
    email: `employee${i + 1}@cleaning.com`,
  },
  employeeId: `EMP-${String(i + 1).padStart(5, '0')}`,
  specializations: [['home_cleaning', 'furniture_cleaning'], ['car_cleaning'], ['carpet_cleaning', 'curtain_cleaning']][i % 3],
  averageRating: (4 + (i % 5) * 0.2).toFixed(1),
  totalJobsCompleted: 15 + i * 7,
  performanceScore: 80 + i * 2,
  isAvailable: i % 3 !== 0,
  isOnJob: i % 3 === 1,
  contractType: i % 2 === 0 ? 'full_time' : 'part_time',
}));

const specialLabelsAr = {
  home_cleaning: 'تنظيف منزل',
  furniture_cleaning: 'أثاث',
  car_cleaning: 'سيارات',
  carpet_cleaning: 'سجاد',
  curtain_cleaning: 'ستائر',
};
const specialLabelsEn = {
  home_cleaning: 'Home Cleaning',
  furniture_cleaning: 'Furniture',
  car_cleaning: 'Car',
  carpet_cleaning: 'Carpet',
  curtain_cleaning: 'Curtain',
};

export default function EmployeesPage() {
  const { lang } = useLanguage();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await employeesApi.getAll();
      const docs = res?.data?.docs || res?.data || [];
      if (docs.length > 0) {
        setEmployees(docs);
      } else {
        setEmployees(MOCK_EMPLOYEES);
      }
    } catch (err) {
      console.warn('API error fetching employees, using fallback data:', err);
      setEmployees(MOCK_EMPLOYEES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const specialLabels = lang === 'ar' ? specialLabelsAr : specialLabelsEn;

  const filtered = employees.filter(e => {
    const name = e.user?.name || e.name || '';
    const empId = e.employeeId || e.code || '';
    const phone = e.user?.phone || e.phone || '';
    const matchesSearch = name.includes(search) || empId.includes(search) || phone.includes(search);
    
    if (!matchesSearch) return false;
    if (statusFilter === 'available') return e.isAvailable && !e.isOnJob;
    if (statusFilter === 'onJob') return e.isOnJob;
    if (statusFilter === 'unavailable') return !e.isAvailable && !e.isOnJob;
    return true;
  });

  const availableCount = employees.filter(e => e.isAvailable && !e.isOnJob).length;
  const onJobCount = employees.filter(e => e.isOnJob).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {lang === 'ar' ? 'إدارة الموظفين' : 'Employees Management'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading
              ? (lang === 'ar' ? 'جاري التحميل...' : 'Loading...')
              : `${filtered.length} ${lang === 'ar' ? 'موظف' : 'Employees'}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary" onClick={fetchEmployees} disabled={loading}>
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> {lang === 'ar' ? 'تحديث' : 'Refresh'}
          </button>
          <button className="btn-primary">
            <Plus size={15} /> {lang === 'ar' ? 'إضافة موظف' : 'Add Employee'}
          </button>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600">
            <UserCheck size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{employees.length}</p>
            <p className="text-xs text-gray-500">{lang === 'ar' ? 'إجمالي الموظفين' : 'Total Employees'}</p>
          </div>
        </div>

        <div className="card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <Award size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-600">{availableCount}</p>
            <p className="text-xs text-gray-500">{lang === 'ar' ? 'متاح للعمل' : 'Available Now'}</p>
          </div>
        </div>

        <div className="card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600">
            <Briefcase size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-amber-600">{onJobCount}</p>
            <p className="text-xs text-gray-500">{lang === 'ar' ? 'في مهمة حالياً' : 'On Job'}</p>
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="card p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search size={15} className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={lang === 'ar' ? 'ابحث بالاسم، الرقم الوظيفي، أو الهاتف...' : 'Search by name, ID or phone...'}
            className="input pr-9"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: lang === 'ar' ? 'الكل' : 'All' },
            { id: 'available', label: lang === 'ar' ? 'متاح' : 'Available' },
            { id: 'onJob', label: lang === 'ar' ? 'في عمل' : 'On Job' },
            { id: 'unavailable', label: lang === 'ar' ? 'غير متاح' : 'Unavailable' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'bg-primary-500 text-white border-primary-500 shadow-sm'
                  : 'bg-white dark:bg-dark-50 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:border-primary-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Employees Table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 dark:bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            {lang === 'ar' ? 'لا يوجد موظفون مطابقون لبحثك' : 'No matching employees found'}
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>{lang === 'ar' ? 'الموظف' : 'Employee'}</th>
                  <th>{lang === 'ar' ? 'الهاتف' : 'Phone'}</th>
                  <th>{lang === 'ar' ? 'التخصصات' : 'Specializations'}</th>
                  <th>{lang === 'ar' ? 'التقييم' : 'Rating'}</th>
                  <th>{lang === 'ar' ? 'المهام المكتملة' : 'Completed Jobs'}</th>
                  <th>{lang === 'ar' ? 'مستوى الأداء' : 'Performance'}</th>
                  <th>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                  <th className="text-center">{lang === 'ar' ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp) => {
                  const empName = emp.user?.name || emp.name || '—';
                  const empCode = emp.employeeId || emp.code || 'EMP-000';
                  const empPhone = emp.user?.phone || emp.phone || '—';
                  const specs = emp.specializations || [];
                  const rating = emp.averageRating || emp.rating || '5.0';
                  const jobs = emp.totalJobsCompleted || emp.completedJobs || 0;
                  const perf = emp.performanceScore || 85;

                  return (
                    <tr key={emp._id}>
                      {/* Name & ID */}
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm">
                            {empName[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{empName}</p>
                            <span className="font-mono text-xs text-primary-500">{empCode}</span>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="text-sm font-mono text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-1.5">
                          <Phone size={13} className="text-gray-400" />
                          <span dir="ltr">{empPhone}</span>
                        </div>
                      </td>

                      {/* Specializations */}
                      <td>
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {specs.length > 0 ? (
                            specs.slice(0, 2).map((s, idx) => (
                              <span key={idx} className="badge-primary text-[11px] px-2 py-0.5">
                                {specialLabels[s] || s}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                          {specs.length > 2 && (
                            <span className="badge-gray text-[10px] px-1.5">+{specs.length - 2}</span>
                          )}
                        </div>
                      </td>

                      {/* Rating */}
                      <td>
                        <div className="flex items-center gap-1">
                          <Star size={13} className="text-amber-400 fill-amber-400" />
                          <span className="font-bold text-gray-900 dark:text-white text-sm">{rating}</span>
                        </div>
                      </td>

                      {/* Completed Jobs */}
                      <td>
                        <span className="font-semibold text-gray-900 dark:text-white">{jobs}</span>
                        <span className="text-xs text-gray-400 ml-1">{lang === 'ar' ? 'مهمة' : 'jobs'}</span>
                      </td>

                      {/* Performance */}
                      <td>
                        <div className="w-24">
                          <div className="flex justify-between text-xs mb-1 font-semibold text-gray-700 dark:text-gray-300">
                            <span>{perf}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full gradient-primary rounded-full"
                              style={{ width: `${Math.min(100, Math.max(0, perf))}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td>
                        {emp.isOnJob ? (
                          <span className="badge-warning">{lang === 'ar' ? 'في عمل' : 'On Job'}</span>
                        ) : emp.isAvailable ? (
                          <span className="badge-success">{lang === 'ar' ? 'متاح' : 'Available'}</span>
                        ) : (
                          <span className="badge-gray">{lang === 'ar' ? 'غير متاح' : 'Unavailable'}</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="text-center">
                        <button
                          onClick={() => setSelectedEmployee(emp)}
                          className="btn-ghost p-1.5 text-primary-600 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-500/10"
                          title={lang === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Employee Details Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-dark-50 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col"
          >
            <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  {(selectedEmployee.user?.name || selectedEmployee.name || '؟')[0]}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {selectedEmployee.user?.name || selectedEmployee.name}
                  </h2>
                  <p className="text-xs text-primary-500 font-mono">
                    {selectedEmployee.employeeId || selectedEmployee.code}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEmployee(null)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                  <p className="text-xs text-gray-400 mb-1">{lang === 'ar' ? 'الهاتف' : 'Phone'}</p>
                  <p className="text-sm font-semibold font-mono text-gray-900 dark:text-white" dir="ltr">
                    {selectedEmployee.user?.phone || selectedEmployee.phone || '—'}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                  <p className="text-xs text-gray-400 mb-1">{lang === 'ar' ? 'الحالة الحالية' : 'Current Status'}</p>
                  <div className="mt-0.5">
                    {selectedEmployee.isOnJob ? (
                      <span className="badge-warning">{lang === 'ar' ? 'في عمل' : 'On Job'}</span>
                    ) : selectedEmployee.isAvailable ? (
                      <span className="badge-success">{lang === 'ar' ? 'متاح' : 'Available'}</span>
                    ) : (
                      <span className="badge-gray">{lang === 'ar' ? 'غير متاح' : 'Unavailable'}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl text-center">
                  <div className="flex justify-center items-center gap-1 mb-1">
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                    <span className="font-bold text-gray-900 dark:text-white">{selectedEmployee.averageRating || '5.0'}</span>
                  </div>
                  <p className="text-xs text-gray-400">{lang === 'ar' ? 'التقييم' : 'Rating'}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl text-center">
                  <p className="text-base font-bold text-gray-900 dark:text-white">{selectedEmployee.totalJobsCompleted || 0}</p>
                  <p className="text-xs text-gray-400">{lang === 'ar' ? 'المهام' : 'Jobs'}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl text-center">
                  <p className="text-base font-bold text-primary-500">{selectedEmployee.performanceScore || 85}%</p>
                  <p className="text-xs text-gray-400">{lang === 'ar' ? 'الأداء' : 'Performance'}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-2">{lang === 'ar' ? 'التخصصات' : 'Specializations'}</p>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedEmployee.specializations || []).map((s, idx) => (
                    <span key={idx} className="badge-primary px-3 py-1 text-xs">
                      {specialLabels[s] || s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-white/10 flex justify-end">
              <button onClick={() => setSelectedEmployee(null)} className="btn-secondary">
                {lang === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
