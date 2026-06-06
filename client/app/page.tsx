'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { productsApi } from '@/lib/api';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    productsApi.getAll({ page_size: 8 })
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
      <section className="relative w-full h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-surface-container-high">
          <div className="w-full h-full bg-gradient-to-r from-primary/20 to-transparent"></div>
        </div>
        <div className="relative z-10 text-center px-4 md:px-8 max-w-3xl">
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-6">
            Elevate Your Everyday Style
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-xl mx-auto">
            Discover the latest collection of premium menswear designed for the modern gentleman.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-8 py-4 bg-primary text-on-primary font-label-md text-label-md rounded hover:bg-primary-container transition-all duration-200"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 md:px-8 max-w-container-max mx-auto">
        <div className="flex justify-between items-end mb-10">
          <h2 className="font-headline-md text-headline-md text-on-surface">Curated Picks</h2>
          <Link href="/products" className="font-label-md text-label-md text-primary hover:underline hidden md:block">
            View all collections
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div key={product.id} className="group relative flex flex-col bg-surface rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface-variant">
                {product.main_image_url ? (
                  <Image
                    src={product.main_image_url}
                    alt={product.name}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-outline">
                    <span className="material-symbols-outlined text-4xl">image_not_supported</span>
                  </div>
                )}
                {product.stock < 10 && product.stock > 0 && (
                  <div className="absolute top-3 left-3 bg-primary text-on-primary px-3 py-1 rounded-full font-label-sm text-label-sm">
                    Low Stock
                  </div>
                )}
                {product.stock === 0 && (
                  <div className="absolute top-3 left-3 bg-error text-on-error px-3 py-1 rounded-full font-label-sm text-label-sm">
                    Sold Out
                  </div>
                )}
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-title-lg text-title-lg text-on-surface mb-1">{product.name}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-4 flex-grow">{product.category_name}</p>
                <p className="font-title-lg text-title-lg text-on-surface">{product.price}DZD</p>
                <button
                  onClick={() => addToCart(product.id, 1)}
                  disabled={product.stock === 0}
                  className={`mt-4 w-full py-3 rounded-lg font-label-md text-label-md transition-all flex justify-center items-center gap-2 ${
                    product.stock === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-primary text-on-primary hover:bg-primary-container hover:-translate-y-0.5'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <Link href="/products" className="inline-flex items-center justify-center px-6 py-3 border border-outline text-on-surface rounded hover:bg-surface-container transition-colors">
            View all
          </Link>
        </div>
      </section>

  
    </>
  );
}