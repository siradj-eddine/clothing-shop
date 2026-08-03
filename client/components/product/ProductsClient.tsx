'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { productsApi } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useTranslation } from 'react-i18next';

export default function ProductsPage() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [priceRange, setPriceRange] = useState(50000);
  const [sortBy, setSortBy] = useState('-created_at');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { addToCart } = useCart();

  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          productsApi.getAll({
            page_size: 12,
            ordering: sortBy,
            ...(selectedCategory && { category__slug: selectedCategory }),
            ...(selectedSize && { size: selectedSize }),
            ...(priceRange < 50000 && { price__lte: priceRange }),
          }),
          productsApi.getCategories(),
        ]);
        setProducts(productsData.results || []);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, selectedSize, priceRange, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedSize('');
    setPriceRange(50000);
    setSortBy('-created_at');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-outline-variant pb-6">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface mb-2">
            {t('products.title')}
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {t('products.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3 mt-4 md:mt-0 w-full md:w-auto">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700"
          >
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            {t('products.filter')}
          </button>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 md:w-48 px-4 py-2 bg-surface border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="-created_at">{t('products.newest')}</option>
            <option value="price">{t('products.priceLowHigh')}</option>
            <option value="-price">{t('products.priceHighLow')}</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-gutter">
        {/* Sidebar Filters */}
        <aside
          className={`${isFilterOpen ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0 space-y-8 bg-white lg:bg-transparent rounded-xl p-6 lg:p-0 shadow-sm lg:shadow-none`}
        >
          {/* Categories */}
          <div>
            <h3 className="font-title-lg text-title-lg text-on-surface mb-4">
              {t('products.categories')}
            </h3>
            <ul className="space-y-3">
              <li>
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={!selectedCategory}
                    onChange={() => setSelectedCategory('')}
                    className="form-checkbox h-5 w-5 text-primary border-outline-variant rounded focus:ring-primary"
                  />
                  <span
                    className={`font-body-md text-body-md ${!selectedCategory ? 'text-primary font-medium' : 'text-on-surface group-hover:text-primary'} transition-colors`}
                  >
                    {t('products.allProducts')}
                  </span>
                </label>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedCategory === cat.slug}
                      onChange={() =>
                        setSelectedCategory(selectedCategory === cat.slug ? '' : cat.slug)
                      }
                      className="form-checkbox h-5 w-5 text-primary border-outline-variant rounded focus:ring-primary"
                    />
                    <span
                      className={`font-body-md text-body-md ${selectedCategory === cat.slug ? 'text-primary font-medium' : 'text-on-surface group-hover:text-primary'} transition-colors`}
                    >
                      {cat.name}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Sizes */}
          <div>
            <h3 className="font-title-lg text-title-lg text-on-surface mb-4">
              {t('products.size')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                  className={`w-10 h-10 border rounded flex items-center justify-center font-label-md text-label-md transition-colors ${
                    selectedSize === size
                      ? 'border-primary bg-primary text-on-primary'
                      : 'border-outline-variant text-on-surface hover:border-primary hover:text-primary'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-title-lg text-title-lg text-on-surface mb-4">
              {t('products.priceRange')}
            </h3>
            <div className="px-2">
              <input
                type="range"
                min="0"
                max="50000"
                step="1000"
                value={priceRange}
                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                className="w-full h-1 bg-surface-variant rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #0058be 0%, #0058be ${(priceRange / 50000) * 100}%, #d3e4fe ${(priceRange / 50000) * 100}%, #d3e4fe 100%)`,
                }}
              />
              <div className="flex justify-between mt-4 font-label-md text-label-md text-on-surface-variant">
                <span>0 DZD</span>
                <span>{priceRange.toLocaleString()} DZD</span>
                <span>50,000 DZD</span>
              </div>
            </div>
          </div>

          {/* Reset Filters */}
          {(selectedCategory || selectedSize || priceRange < 50000) && (
            <button
              onClick={resetFilters}
              className="w-full mt-4 py-2 text-sm text-primary hover:text-primary-dark font-medium"
            >
              {t('products.resetFilters')}
            </button>
          )}
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-on-surface-variant">{t('products.noProducts')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 max-md:grid-cols-2 max-lg:grid-cols-3 max-xl:grid-cols-4 max-2xl:grid-cols-5 gap-4 md:gap-6">
              {products.map((product) => (
                <div key={product.id} className="group relative flex flex-col">
                  <div className="relative w-full aspect-[3/4] bg-surface-container-lowest overflow-hidden rounded-lg group-hover:shadow-xl transition-all duration-300">
                    <Link href={`/product/${product.slug}`} className="block w-full h-full">
                      {product.main_image_url ? (
                        <img
                          src={product.main_image_url}
                          alt={product.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            console.error('Image failed to load:', product.main_image_url);
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-outline">
                          <span className="material-symbols-outlined text-4xl">
                            image_not_supported
                          </span>
                        </div>
                      )}
                    </Link>
                    {product.stock < 10 && product.stock > 0 && (
                      <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                        {t('products.lowStock')}
                      </div>
                    )}
                    {product.stock === 0 && (
                      <div className="absolute top-2 left-2 bg-error text-white text-xs px-2 py-1 rounded-full">
                        {t('products.soldOut')}
                      </div>
                    )}
                    {/* Hover Add to Cart */}
                    <div className="absolute bottom-0 left-0 w-full p-2 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <button
                        onClick={() => addToCart(product.id, 1)}
                        disabled={product.stock === 0}
                        className={`w-full py-2 rounded-lg text-sm font-medium flex justify-center items-center gap-1 transition-all ${
                          product.stock === 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-primary/90 backdrop-blur text-white hover:bg-primary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">shopping_cart</span>
                        {t('products.addToCart')}
                      </button>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Link href={`/product/${product.slug}`}>
                      <h3 className="font-title-lg text-title-lg text-on-surface group-hover:text-primary transition-colors text-sm md:text-base line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-on-surface-variant mt-1">
                      {Math.round(parseFloat(product.price))} DZD
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && products.length > 0 && (
            <div className="mt-12 flex justify-center items-center space-x-2">
              <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded border border-outline-variant text-on-surface hover:bg-surface-container hover:text-primary transition-colors">
                ←
              </button>
              <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded bg-primary text-white text-sm font-medium">
                1
              </button>
              <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded border border-outline-variant text-on-surface hover:border-primary hover:text-primary text-sm transition-colors">
                2
              </button>
              <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded border border-outline-variant text-on-surface hover:border-primary hover:text-primary text-sm transition-colors">
                3
              </button>
              <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded border border-outline-variant text-on-surface hover:bg-surface-container hover:text-primary transition-colors">
                →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter overlay */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsFilterOpen(false)}
        />
      )}
    </div>
  );
}
