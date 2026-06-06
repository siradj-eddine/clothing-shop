'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { productsApi } from '@/lib/api';
import { Product, Category } from '@/lib/types';
import { useCart } from '@/context/CartContext';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [priceRange, setPriceRange] = useState(500);
  const [sortBy, setSortBy] = useState('-created_at');
  const { addToCart } = useCart();

  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  useEffect(() => {
    productsApi.getCategories()
      .then(setCategories)
      .catch(console.error);
  }, []);

  useEffect(() => {
    const params: Record<string, string | number> = {
      page_size: 12,
      ordering: sortBy,
    };
    if (selectedCategory) params.category__slug = selectedCategory;
    if (selectedSize) params.size = selectedSize;
    if (priceRange < 500) params.price__lte = priceRange;

    let isActive = true;

    const fetchProducts = async () => {
      if (isActive) setLoading(true);
      try {
        const response = await productsApi.getAll(params);
        if (isActive) {
          setProducts(response.results);
        }
      } catch {
        // Ignore errors for now
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isActive = false;
    };
  }, [selectedCategory, selectedSize, priceRange, sortBy]);

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-outline-variant pb-6">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface mb-2">New Arrivals</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Explore the latest additions to our collection.</p>
        </div>
        <div className="mt-4 md:mt-0 relative w-full md:w-64">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full appearance-none bg-surface border border-outline-variant rounded px-4 py-2 pr-8 font-label-md text-label-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer"
          >
            <option value="-created_at">Sort by: Newest</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-2.5 pointer-events-none text-on-surface-variant">expand_more</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-gutter">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
          {/* Categories */}
          <div>
            <h3 className="font-title-lg text-title-lg text-on-surface mb-4">Categories</h3>
            <ul className="space-y-3">
              <li>
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={!selectedCategory}
                    onChange={() => setSelectedCategory('')}
                    className="form-checkbox h-5 w-5 text-primary border-outline-variant rounded focus:ring-primary"
                  />
                  <span className={`font-body-md text-body-md ${!selectedCategory ? 'text-primary font-medium' : 'text-on-surface group-hover:text-primary'} transition-colors`}>
                    All Products
                  </span>
                </label>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedCategory === cat.slug}
                      onChange={() => setSelectedCategory(selectedCategory === cat.slug ? '' : cat.slug)}
                      className="form-checkbox h-5 w-5 text-primary border-outline-variant rounded focus:ring-primary"
                    />
                    <span className={`font-body-md text-body-md ${selectedCategory === cat.slug ? 'text-primary font-medium' : 'text-on-surface group-hover:text-primary'} transition-colors`}>
                      {cat.name}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Sizes */}
          <div>
            <h3 className="font-title-lg text-title-lg text-on-surface mb-4">Size</h3>
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
            <h3 className="font-title-lg text-title-lg text-on-surface mb-4">Price Range</h3>
            <div className="px-2">
              <input
                type="range"
                min="0"
                max="500"
                value={priceRange}
                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                className="w-full h-1 bg-surface-variant rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #0058be 0%, #0058be ${(priceRange / 500) * 100}%, #d3e4fe ${(priceRange / 500) * 100}%, #d3e4fe 100%)`
                }}
              />
              <div className="flex justify-between mt-4 font-label-md text-label-md text-on-surface-variant">
                <span>0 DZD</span>
                <span>{priceRange}DZD</span>
                <span>500 DZD</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-on-surface-variant">No products found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
              {products.map((product) => (
                <div key={product.id} className="group relative flex flex-col">
                  <div className="relative w-full aspect-[3/4] bg-surface-container-lowest overflow-hidden rounded-t group-hover:shadow-xl transition-all duration-300">
                    <Link href={`/product/${product.slug}`}>
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
                    </Link>
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
                    {/* Hover Add to Cart */}
                    <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <button
                        onClick={() => addToCart(product.id, 1)}
                        disabled={product.stock === 0}
                        className={`w-full py-3 rounded font-label-md text-label-md flex justify-center items-center gap-2 transition-all ${
                          product.stock === 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-primary/90 backdrop-blur text-on-primary hover:bg-primary hover:-translate-y-0.5'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col space-y-1">
                    <Link href={`/product/${product.slug}`}>
                      <h3 className="font-title-lg text-title-lg text-on-surface group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="font-body-md text-body-md text-on-surface-variant">{product.price}DZD</p>
                  </div>
                </div>
              ))}
            </div>
          )}

       {/* Pagination */}
{!loading && products.length > 0 && (
  <div className="mt-16 flex justify-center items-center space-x-2">
    <button className="w-10 h-10 flex items-center justify-center rounded border border-outline-variant text-on-surface hover:bg-surface-container hover:text-primary transition-colors">
      ←
    </button>
    <button className="w-10 h-10 flex items-center justify-center rounded bg-primary text-on-primary font-label-md text-label-md">1</button>
    <button className="w-10 h-10 flex items-center justify-center rounded border border-outline-variant text-on-surface hover:border-primary hover:text-primary font-label-md text-label-md transition-colors">2</button>
    <button className="w-10 h-10 flex items-center justify-center rounded border border-outline-variant text-on-surface hover:border-primary hover:text-primary font-label-md text-label-md transition-colors">3</button>
    <button className="w-10 h-10 flex items-center justify-center rounded border border-outline-variant text-on-surface hover:bg-surface-container hover:text-primary transition-colors">
      →
    </button>
  </div>
)}
        </div>
      </div>
    </div>
  );
}