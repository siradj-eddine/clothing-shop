import { Metadata } from 'next';
import FaqsClient from '@/components/faqs/FaqsClient';

export const metadata: Metadata = {
  title: 'FAQs | Brothers Shop',
  description:
    'Frequently asked questions about Brothers Shop. Find answers about shipping, returns, sizing, and more.',
  alternates: {
    canonical: 'https://clothing-shop-livid.vercel.app/faqs',
  },
};

export default function FaqsPage() {
  return <FaqsClient />;
}
