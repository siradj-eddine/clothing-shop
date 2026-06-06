'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ordersApi } from '@/lib/api';
import { Order } from '@/lib/types';

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      ordersApi.getById(parseInt(id as string))
        .then(setOrder)
        .catch(() => router.push('/'))
        .finally(() => setLoading(false));
    }
  }, [id, router]);

  const formatDA = (amount: number): string => {
    return `${Math.round(amount)} DZD`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-20 px-4">
      <div className="max-w-3xl w-full mx-auto flex flex-col items-center">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8">
          <span className="material-symbols-outlined text-5xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
        </div>

        {/* Success Message */}
        <div className="text-center">
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-4">
            Thank you for your order
          </h1>
          <p className="font-body-lg text-body-lg text-secondary mb-2">
            Order #{order.id}
          </p>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
            We've received your order and are getting it ready. A confirmation email has been sent to <strong>{order.customer_email}</strong>.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="w-full bg-surface-container-lowest rounded-xl shadow-sm mt-12 overflow-hidden border border-outline-variant/30">
          <div className="p-8 md:p-10">
            <h2 className="font-title-lg text-title-lg text-on-surface mb-8">Order Summary</h2>

            {/* Items List */}
            <div className="space-y-6">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-20 h-24 rounded bg-surface-variant flex-shrink-0" />
                  <div className="flex-grow">
                    <h3 className="font-label-md text-label-md text-on-surface">{item.product_name}</h3>
                    <p className="font-body-md text-body-md text-secondary mt-1">
                      {item.size && `${item.size} / `}{item.color && `${item.color} / `}Qty {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-label-md text-label-md text-on-surface">
                      {formatDA(parseFloat(item.product_price) * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full h-px bg-outline-variant/30 my-8"></div>

            {/* Shipping & Totals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-label-sm text-label-sm text-secondary uppercase tracking-wider mb-3">
                  Shipping Address
                </h4>
                <p className="font-body-md text-body-md text-on-surface whitespace-pre-line">
                  {order.shipping_address}
                </p>
              </div>
              <div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Total</span>
                    <span className="font-bold">{formatDA(parseFloat(order.total))}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="bg-surface-container-low px-8 py-6 flex justify-between items-center border-t border-outline-variant/20">
            <div className="flex items-center gap-3 text-secondary">
              <span className="material-symbols-outlined text-[20px]">local_shipping</span>
              <span className="font-body-md text-body-md">You can track your order in your account.</span>
            </div>
            <Link href="/products">
              <button className="bg-primary text-on-primary font-label-md text-label-md px-6 py-2 rounded-full hover:bg-primary-container transition-all">
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}