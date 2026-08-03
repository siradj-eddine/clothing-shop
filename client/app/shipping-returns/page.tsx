import { Metadata } from 'next';
import ShippingReturnsClient from '@/components/shipping-returns/ShippingReturnsClient';

export const metadata: Metadata = {
  title: 'Shipping & Returns | Brothers Shop',
  description:
    'Learn about Brothers Shop shipping policy and returns. Free shipping on orders over 10,000 DZD in Algeria.',
  alternates: {
    canonical: 'https://clothing-shop-livid.vercel.app/shipping-returns',
  },
};

export default function ShippingReturnsPage() {
  return <ShippingReturnsClient />;
}
