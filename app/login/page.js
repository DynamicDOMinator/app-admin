'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Waves, Lock, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ identifier: '', password: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.identifier || !form.password) {
      toast.error('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }
    
    setLoading(true);
    try {
      const res = await authApi.login(form);
      console.log('Login response:', res);
      const { accessToken, refreshToken, user } = res.data || {};
      
      console.log('Extracted tokens:', { accessToken: accessToken ? 'yes' : 'no', role: user?.role });

      if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
        toast.error('ليس لديك صلاحية للدخول إلى لوحة التحكم');
        return;
      }
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      toast.success('تم تسجيل الدخول بنجاح');
      router.push('/dashboard');
    } catch (err) {
      toast.error(err?.message || 'بيانات الدخول غير صحيحة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-dark-200 p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-success-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-primary-500/3 to-transparent" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        <div className="glass-card p-8 sm:p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Waves size={26} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              شركة المتحدة
            </h1>
            <p className="text-sm text-gray-500 mt-1">لوحة التحكم الإدارية</p>
          </div>

          {/* Demo hint */}
          <div className="bg-primary-50 dark:bg-primary-500/10 rounded-xl p-3 mb-6 text-center">
            <p className="text-xs text-primary-600 dark:text-primary-400">
              تجريبي: admin@unitedcleaning.com / Admin@123
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                البريد الإلكتروني أو رقم الهاتف
              </label>
              <div className="relative">
                <Mail size={15} className="absolute top-1/2 -translate-y-1/2 right-3.5 text-gray-400" />
                <input
                  type="text"
                  value={form.identifier}
                  onChange={e => setForm(f => ({ ...f, identifier: e.target.value }))}
                  placeholder="admin@unitedcleaning.com"
                  className="input pr-10"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock size={15} className="absolute top-1/2 -translate-y-1/2 right-3.5 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className="input pr-10 pl-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 text-base"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  جاري تسجيل الدخول...
                </span>
              ) : 'تسجيل الدخول'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            © 2024 شركة المتحدة لخدمات النظافة. جميع الحقوق محفوظة.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
