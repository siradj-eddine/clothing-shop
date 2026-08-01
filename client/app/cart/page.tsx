'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { t } = useTranslation();
  const { cart, updateQuantity, removeItem, clearCart, isLoading } = useCart();
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    setUpdatingId(itemId);

    try {
      await updateQuantity(itemId, newQuantity);
      toast.success(t('cart.updateSuccess') || 'Quantity updated');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update quantity');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemoveItem = async (itemId: number, itemName: string) => {
    if (confirm(`Remove "${itemName}" from your cart?`)) {
      try {
        await removeItem(itemId);
        toast.success(t('cart.removeSuccess') || 'Item removed');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to remove item');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-20 text-center">
        <div className="w-24 h-24 bg-surface-variant rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant">
            shopping_cart
          </span>
        </div>
        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-4">
          {t('cart.emptyCart')}
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant mb-8">
          {t('cart.emptyCartMessage')}
        </p>
        <Link
          href="/product"
          className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-lg hover:bg-primary-container transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          {t('cart.continueShopping')}
        </Link>
      </div>
    );
  }

  const subtotal = parseFloat(cart.total);

  const formatDA = (amount: number): string => {
    return `${Math.round(amount)} DZD`;
  };

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
      <div className="mb-8">
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-2">
          {t('cart.title')}
        </h1>
        <Link
          href="/product"
          className="inline-flex items-center text-primary font-label-md text-label-md hover:text-primary-container transition-colors"
        >
          <span className="material-symbols-outlined text-[18px] mr-1">arrow_back</span>
          {t('cart.continueShopping')}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-6">
          {cart.items.map((item) => {
            const itemTotal = parseFloat(item.product_price) * item.quantity;
            return (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 hover:shadow-md transition-all"
              >
                {/* Product Image - FIXED: Using img tag instead of Next.js Image */}
                <div className="w-full sm:w-32 h-40 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-surface-variant relative">
                  {item.product_image ? (
                    <img
                      src={item.product_image}
                      alt={item.product_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-outline">
                      <span className="material-symbols-outlined text-4xl">
                        image_not_supported
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-grow w-full">
                  <div className="flex justify-between items-start w-full mb-4">
                    <div>
                      <h3 className="font-title-lg text-title-lg text-on-surface mb-1">
                        {item.product_name}
                      </h3>
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        {item.size && `Size: ${item.size} | `}
                        {item.color && `Color: ${item.color}`}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id, item.product_name)}
                      className="text-outline hover:text-error transition-colors p-2 rounded-full hover:bg-error-container/20"
                      aria-label="Remove item"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-auto w-full">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-outline-variant rounded-full bg-surface-container-lowest px-2 py-1">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={updatingId === item.id}
                        className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-container-low disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-[18px]">remove</span>
                      </button>
                      <span className="font-label-md text-label-md text-on-surface w-8 text-center">
                        {updatingId === item.id ? (
                          <div className="inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          item.quantity
                        )}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={updatingId === item.id}
                        className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-container-low disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                      </button>
                    </div>

                    {/* Price */}
                    <span className="font-title-lg text-title-lg text-on-surface">
                      {formatDA(itemTotal)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Clear Cart Button */}
          <div className="flex justify-end">
            <button
              onClick={clearCart}
              className="text-error hover:underline font-label-md text-label-md flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
              {t('cart.clearCart')}
            </button>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-[100px] bg-surface-container-low rounded-2xl p-8 shadow-md border border-outline-variant/30">
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-6 border-b border-outline-variant pb-4">
              {t('cart.orderSummary')}
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-body-md text-body-md text-on-surface-variant">
                  {t('cart.subtotal')} ({cart.total_items} items)
                </span>
                <span className="font-label-md text-label-md text-on-surface font-semibold">
                  {formatDA(subtotal)}
                </span>
              </div>
            </div>

            <div className="border-t border-outline-variant pt-6 mb-8">
              <div className="flex justify-between items-center">
                <span className="font-title-lg text-title-lg text-on-surface">
                  {t('cart.total')}
                </span>
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  {formatDA(subtotal)}
                </span>
              </div>
            </div>

            <Link href="/checkout">
              <button className="w-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md py-4 rounded-full transition-all duration-300 flex justify-center items-center gap-2">
                {t('cart.proceedToCheckout')}
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </Link>

            <div className="mt-6 flex items-center justify-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[16px]">lock</span>
              {t('cart.secureCheckout')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
