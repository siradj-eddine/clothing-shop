'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

export default function ProductActions({
  productId,
  productName,
  stock,
  sizes,
  colors,
}: {
  productId: number;
  productName: string;
  stock: number;
  sizes: string[];
  colors: string[];
}) {
  const { t } = useTranslation();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error(t('productDetail.selectSizeError') || 'Please select a size');
      return;
    }
    addToCart(productId, quantity, selectedSize, selectedColor);
  };

  return (
    <>
      {/* Size Selection */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="font-semibold text-gray-900">{t('productDetail.selectSize')}</span>
          <span className="text-xs text-gray-400">
            {selectedSize
              ? `${t('productDetail.selected')}: ${selectedSize}`
              : t('productDetail.required')}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`w-12 h-12 rounded-lg border transition-all text-sm font-medium ${
                selectedSize === size
                  ? 'border-blue-600 bg-blue-600 text-white shadow-md'
                  : 'border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-600'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color Selection */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="font-semibold text-gray-900">{t('productDetail.selectColor')}</span>
          <span className="text-xs text-gray-400">
            {selectedColor || t('productDetail.optional')}
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-10 h-10 rounded-full border-2 transition-all ${
                selectedColor === color
                  ? 'border-blue-600 scale-110 shadow-md'
                  : 'border-gray-300 hover:scale-105'
              }`}
              style={{ backgroundColor: color.toLowerCase() }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Quantity & Add to Cart */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50 w-32">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-blue-600"
          >
            <span className="material-symbols-outlined text-[20px]">remove</span>
          </button>
          <span className="flex-1 text-center font-medium text-gray-900">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-blue-600"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
          </button>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={stock === 0}
          className={`flex-1 py-3 rounded-lg font-semibold transition-all flex justify-center gap-2 ${
            stock === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-98'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
          {t('productDetail.addToCart')}
        </button>
      </div>

      {/* Stock Status */}
      {stock === 0 && (
        <div className="mb-4 p-3 bg-red-50 rounded-lg">
          <p className="text-red-600 text-sm text-center">{t('productDetail.outOfStock')}</p>
        </div>
      )}
      {stock > 0 && stock < 10 && (
        <div className="mb-4 p-3 bg-orange-50 rounded-lg">
          <p className="text-orange-600 text-sm text-center">
            {t('productDetail.onlyLeft', { stock })}
          </p>
        </div>
      )}
      {stock >= 10 && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg">
          <p className="text-green-600 text-sm text-center">
            ✓ {t('productDetail.inStock')} ({stock} {t('productDetail.units')})
          </p>
        </div>
      )}
    </>
  );
}
