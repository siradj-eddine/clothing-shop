'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ordersApi } from '@/lib/api';
import { wilayas, getShippingCost } from '@/lib/wilayas';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [selectedWilaya, setSelectedWilaya] = useState<number>(25);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    wilaya_id: 25,
  });

  if (!cart || cart.items.length === 0) {
    router.push('/cart');
    return null;
  }

  const subtotal = parseFloat(cart.total);
  
  // Get base shipping cost
  let shippingCost = getShippingCost(selectedWilaya);
  
  // Free shipping for orders over 10000 DZD
  const FREE_SHIPPING_THRESHOLD = 10000;
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const finalShippingCost = isFreeShipping ? 0 : shippingCost;
  
  const total = subtotal + finalShippingCost;

  const handleWilayaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const wilayaId = parseInt(e.target.value);
    setSelectedWilaya(wilayaId);
    setFormData(prev => ({ ...prev, wilaya_id: wilayaId }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const selectedWilayaData = wilayas.find(w => w.id === selectedWilaya);
      const fullAddress = `${formData.shipping_address}, ${selectedWilayaData?.name}, Algeria`;
      
      const order = await ordersApi.create({
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        shipping_address: fullAddress,
        subtotal: subtotal,
        shipping_cost: finalShippingCost,
        total: total,
        items: cart.items.map(item => ({
          product_id: item.product,
          product_name: item.product_name,
          product_price: item.product_price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
      });

      await clearCart();
      toast.success('Order placed successfully!');
      router.push(`/order-confirmation/${order.id}`);
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order. Please try again.');
      setLoading(false);
    }
  };

  const formatDA = (amount: number): string => {
    return `${Math.round(amount)} DZD`;
  };

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
      <div className="mb-8">
        <h1 className="font-headline-md text-headline-md text-on-surface">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Checkout Form */}
        <div className="lg:col-span-7 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Information */}
            <div>
              <h2 className="font-title-lg text-title-lg text-on-surface mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.customer_email}
                    onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                    className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <h2 className="font-title-lg text-title-lg text-on-surface mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.customer_name}
                      onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                      className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.customer_phone}
                      onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                      className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                
                {/* Wilaya Selector */}
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                    Wilaya (State)
                  </label>
                  <select
                    required
                    value={selectedWilaya}
                    onChange={handleWilayaChange}
                    className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    {wilayas.map((wilaya) => (
                      <option key={wilaya.id} value={wilaya.id}>
                        {wilaya.name} - {wilaya.shipping_cost} DZD shipping
                      </option>
                    ))}
                  </select>
                  {isFreeShipping && (
                    <p className="text-xs text-green-600 mt-1">
                      Free shipping (Order over {formatDA(FREE_SHIPPING_THRESHOLD)})
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                    Street Address
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={formData.shipping_address}
                    onChange={(e) => setFormData({ ...formData, shipping_address: e.target.value })}
                    className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="Street address, building, apartment"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:bg-primary-container transition-all flex justify-center items-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                  Place Order
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5">
          <div className="sticky top-[100px] bg-surface-container-low rounded-xl p-6 shadow-md">
            <h3 className="font-title-lg text-title-lg text-on-surface mb-4">Order Summary</h3>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto mb-6">
              {cart.items.map((item) => {
                const itemTotal = parseFloat(item.product_price) * item.quantity;
                return (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-20 bg-surface-variant rounded-md overflow-hidden flex-shrink-0 relative">
                      {item.product_image ? (
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-outline">
                          <span className="material-symbols-outlined">image_not_supported</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-label-md text-label-md text-on-surface">{item.product_name}</p>
                      <p className="text-sm text-on-surface-variant">
                        {item.size && `${item.size} / `}{item.color && `${item.color} / `}Qty: {item.quantity}
                      </p>
                      <p className="font-label-md text-label-md text-on-surface mt-1">
                        {formatDA(itemTotal)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-outline-variant pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Subtotal</span>
                <span className="text-on-surface">{formatDA(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Shipping</span>
                <span className="text-on-surface">
                  {isFreeShipping ? 'Free' : formatDA(shippingCost)}
                </span>
              </div>
              <div className="border-t border-outline-variant pt-4 mt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatDA(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}