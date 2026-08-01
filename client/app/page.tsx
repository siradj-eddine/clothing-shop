'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { productsApi } from '@/lib/api';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    productsApi
      .getAll({ page_size: 8 })
      .then((response) => {
        setFeaturedProducts(response.results);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full min-h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden bg-gradient-to-r from-blue-900 to-blue-700">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fadeIn">
            {t('hero.title')}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>
          <Link
            href="/product"
            className="inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {t('hero.button')}
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 md:py-20 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
            {t('homepage.featuredProducts')}
          </h2>
          <Link
            href="/product"
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 group"
          >
            {t('homepage.viewAll')}
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {featuredProducts.map((product, index) => (
            <div
              key={product.id}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fadeIn"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Link
                href={`/product/${product.slug}`}
                className="block relative aspect-[3/4] overflow-hidden bg-gray-100"
              >
                {product.main_image_url ? (
                  <img
                    src={product.main_image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="material-symbols-outlined text-5xl">image_not_supported</span>
                  </div>
                )}
                {product.stock < 10 && product.stock > 0 && (
                  <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                    {t('products.lowStock')}
                  </div>
                )}
                {product.stock === 0 && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {t('products.soldOut')}
                  </div>
                )}
              </Link>
              <div className="p-4">
                <Link href={`/product/${product.slug}`}>
                  <h3 className="font-semibold text-gray-900 mb-1 hover:text-blue-600 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-sm text-gray-500 mb-2">{product.category_name}</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-lg font-bold text-blue-600">
                    {Math.round(parseFloat(product.price))} DZD
                  </span>
                  <button
                    onClick={() => addToCart(product.id, 1)}
                    disabled={product.stock === 0}
                    className={`p-2 rounded-full transition-all duration-300 ${
                      product.stock === 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-110 active:scale-95'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link
            href="/product"
            className="inline-flex items-center justify-center px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {t('homepage.viewAll')} →
          </Link>
        </div>
      </section>
    </>
  );
}
