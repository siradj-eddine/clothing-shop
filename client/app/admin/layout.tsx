'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/admin-login');
    } else {
      setIsAuthenticated(true);
    }
    
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-close sidebar on mobile when resizing from desktop to mobile
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [router]);

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleOverlayClick = () => {
    setIsSidebarOpen(false);
  };

  const navItems = [
    { href: '/admin/dashboard', icon: 'dashboard', label: t('admin.dashboard') },
    { href: '/admin/products', icon: 'inventory_2', label: t('admin.products') },
    { href: '/admin/orders', icon: 'receipt_long', label: t('admin.orders') },
    { href: '/admin/categories', icon: 'category', label: t('admin.categories') },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Mobile Menu Button - Floating Action Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed bottom-6 right-6 z-50 md:hidden bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary/90 transition-all duration-200 active:scale-95"
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined text-2xl">
            {isSidebarOpen ? 'close' : 'menu'}
          </span>
        </button>

        {/* Sidebar */}
        <aside
          className={`
            fixed md:relative z-40
            bg-white border-r border-gray-200 h-screen transition-all duration-300 ease-in-out
            flex flex-col
            ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
            md:translate-x-0
            ${isMobile && !isSidebarOpen ? 'w-0 overflow-hidden' : 'w-72'}
            md:w-72
          `}
        >
          {/* Logo Area - Hidden on mobile when sidebar is closed */}
          <div className={`p-5 flex items-center gap-3 border-b border-gray-100 ${isMobile && !isSidebarOpen ? 'hidden' : 'flex'}`}>
            <span className="material-symbols-outlined text-3xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              storefront
            </span>
            <span className="font-semibold text-lg text-gray-800 whitespace-nowrap">
              {t('admin.brothersAdmin')}
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-primary rounded-xl transition-all group"
                onClick={() => setIsSidebarOpen(false)}
              >
                <span className="material-symbols-outlined text-[24px] group-hover:scale-110 transition-transform duration-200">
                  {item.icon}
                </span>
                <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={() => {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                router.push('/admin-login');
              }}
              className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl w-full transition-all group"
            >
              <span className="material-symbols-outlined text-[24px] group-hover:scale-110 transition-transform">
                logout
              </span>
              <span className="text-sm font-medium whitespace-nowrap">{t('admin.logout')}</span>
            </button>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden animate-fadeIn"
            onClick={handleOverlayClick}
          />
        )}

        {/* Main Content - Add margin on desktop to account for sidebar */}
        <main className="flex-1 overflow-y-auto min-h-screen transition-all duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}