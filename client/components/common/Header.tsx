'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { productsApi } from '@/lib/api';

export default function Header() {
  const { totalItems } = useCart();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  
  const shopDropdownRef = useRef<HTMLDivElement>(null);
  const accountDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
    
    // Fetch categories for dropdown
    productsApi.getCategories()
      .then(setCategories)
      .catch(console.error);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shopDropdownRef.current && !shopDropdownRef.current.contains(event.target as Node)) {
        setIsShopDropdownOpen(false);
      }
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target as Node)) {
        setIsAccountOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsLoggedIn(false);
    router.push('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100">
        {/* Top Bar - Announcement */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-2.5 text-sm font-medium">
          <span className="inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Free shipping on orders over 10000 DZD 
          </span>
        </div>

        {/* Main Header */}
        <div className="flex justify-between items-center h-16 px-4 md:px-8 max-w-7xl mx-auto">
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Logo */}
          <Link 
            href="/" 
            className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent hover:from-blue-700 hover:to-blue-900 transition-all"
          >
            Brother's Clothing
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* Shop All with Click Dropdown */}
            <div className="relative" ref={shopDropdownRef}>
              <button 
                onClick={() => setIsShopDropdownOpen(!isShopDropdownOpen)}
                className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                Shop All
                <svg className={`w-4 h-4 transition-transform duration-200 ${isShopDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {isShopDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-fadeIn z-50">
                  <div className="py-2">
                    <Link 
                      href="/product" 
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      onClick={() => setIsShopDropdownOpen(false)}
                    >
                      All Products
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    {categories.map((category) => (
                      <Link 
                        key={category.id}
                        href={`/product?category=${category.slug}`} 
                        className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        onClick={() => setIsShopDropdownOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link 
              href="/about" 
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              About Us
            </Link>
            <Link 
              href="/contact" 
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              Contact Us
            </Link>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-3">
            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-all duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6M12 18v3" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-sm">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden fixed inset-0 top-[72px] bg-white z-40 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-4 flex flex-col h-full overflow-y-auto">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
              />
              <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </form>

            {/* Navigation Links */}
            <nav className="flex flex-col space-y-1">
              <button
                onClick={() => setIsShopDropdownOpen(!isShopDropdownOpen)}
                className="flex items-center justify-between px-4 py-3 text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all w-full"
              >
                Shop All
                <svg className={`w-4 h-4 transition-transform duration-200 ${isShopDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isShopDropdownOpen && (
                <div className="ml-4 space-y-1">
                  <Link
                    href="/product"
                    className="block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsShopDropdownOpen(false);
                    }}
                  >
                    All Products
                  </Link>
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/product?category=${category.slug}`}
                      className="block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsShopDropdownOpen(false);
                      }}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
              
              <div className="border-t border-gray-100 my-2"></div>
              <Link
                href="/about"
                className="px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Us
              </Link>
            </nav>

            <div className="border-t border-gray-100 my-4"></div>

            {/* Mobile Account Links */}
            <div className="flex flex-col space-y-1">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/account/profile"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    My Account
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/admin-login"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Admin Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Spacer */}
      <div className="h-[72px]"></div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
}