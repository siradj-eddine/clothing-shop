'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authApi.login(form);
      toast.success('Login successful!');
      router.push('/admin/dashboard');
    } catch (error) {
      toast.error('Invalid credentials');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-xl p-8">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              admin_panel_settings
            </span>
          </div>
          <h1 className="font-headline-md text-headline-md text-primary mb-2">Brothers Shop</h1>
          <h2 className="font-title-lg text-title-lg text-on-surface-variant">Admin Login</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-2">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-on-surface-variant">person</span>
              </div>
              <input
                type="text"
                required
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="block w-full pl-10 pr-3 py-2 border border-outline-variant rounded-lg bg-surface text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="admin"
              />
            </div>
          </div>

          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-on-surface-variant">lock</span>
              </div>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="block w-full pl-10 pr-3 py-2 border border-outline-variant rounded-lg bg-surface text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-outline-variant rounded" />
              <span className="ml-2 block font-label-md text-label-md text-on-surface-variant">
                Remember me
              </span>
            </label>
            <a href="#" className="font-label-md text-label-md text-primary hover:text-on-primary-fixed-variant">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 rounded-lg font-label-md text-label-md text-on-primary bg-primary hover:bg-on-primary-fixed-variant focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-outline-variant/30 pt-6">
          <p className="font-label-sm text-label-sm text-on-surface-variant">
            Secure access for authorized personnel only.
          </p>
        </div>
      </div>
    </div>
  );
}