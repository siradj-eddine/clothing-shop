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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed bottom-4 right-4 z-50 md:hidden bg-blue-600 text-white p-3 rounded-full shadow-lg"
        >
          <span className="material-symbols-outlined">
            {isSidebarOpen ? 'close' : 'menu'}
          </span>
        </button>

        {/* Sidebar - Desktop always visible, Mobile slides in */}
        <aside
          className={`
            fixed md:relative z-40
            w-64 bg-white border-r border-gray-200 h-screen transition-transform duration-300
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}
        >
          <div className="p-5 flex items-center gap-3 border-b border-gray-100">
            <span className="material-symbols-outlined text-2xl text-blue-600" style={{ fontVariationSettings: "'FILL' 1" }}>
              storefront
            </span>
            <span className="font-semibold text-lg text-gray-800">Brothers Admin</span>
          </div>

          <nav className="px-3 py-4 space-y-1">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all"
              onClick={() => setIsSidebarOpen(false)}
            >
              <span className="material-symbols-outlined text-[20px]">dashboard</span>
              <span className="text-sm font-medium">Dashboard</span>
            </Link>

            <Link
              href="/admin/products"
              className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all"
              onClick={() => setIsSidebarOpen(false)}
            >
              <span className="material-symbols-outlined text-[20px]">inventory_2</span>
              <span className="text-sm font-medium">Products</span>
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all"
              onClick={() => setIsSidebarOpen(false)}
            >
              <span className="material-symbols-outlined text-[20px]">receipt_long</span>
              <span className="text-sm font-medium">Orders</span>
            </Link>

            <Link
              href="/admin/categories"
              className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all"
              onClick={() => setIsSidebarOpen(false)}
            >
              <span className="material-symbols-outlined text-[20px]">category</span>
              <span className="text-sm font-medium">Categories</span>
            </Link>
          </nav>

          <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
            <button
              onClick={() => {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                router.push('/admin-login');
              }}
              className="flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg w-full transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}