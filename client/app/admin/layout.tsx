'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/admin-login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-surface-container-lowest border-r border-outline-variant h-screen sticky top-0">
          <div className="p-6 flex items-center gap-3 border-b border-outline-variant/30">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              storefront
            </span>
            <span className="font-headline-sm text-headline-sm text-on-surface">Brothers Admin</span>
          </div>
          <nav className="px-4 py-6 space-y-2">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 px-4 py-3 text-on-secondary-container hover:bg-surface-container rounded-lg transition-all"
            >
              <span className="material-symbols-outlined">dashboard</span>
              Dashboard
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center gap-3 px-4 py-3 text-on-secondary-container hover:bg-surface-container rounded-lg transition-all"
            >
              <span className="material-symbols-outlined">inventory_2</span>
              Products
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center gap-3 px-4 py-3 text-on-secondary-container hover:bg-surface-container rounded-lg transition-all"
            >
              <span className="material-symbols-outlined">receipt_long</span>
              Orders
            </Link>
            <Link
              href="/admin/categories"
              className="flex items-center gap-3 px-4 py-3 text-on-secondary-container hover:bg-surface-container rounded-lg transition-all"
            >
              <span className="material-symbols-outlined">category</span>
              Categories
            </Link>
          </nav>
          <div className="absolute bottom-0 w-64 p-4 border-t border-outline-variant/30">
            <button
              onClick={() => {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                router.push('/admin-login');
              }}
              className="flex items-center gap-3 px-4 py-3 text-error hover:bg-error-container rounded-lg w-full transition-all"
            >
              <span className="material-symbols-outlined">logout</span>
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}