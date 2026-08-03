import { Metadata } from 'next';
import SizeGuideClient from '@/components/size-guide/SizeGuideClient';

export const metadata: Metadata = {
  title: 'Size Guide | Brothers Shop',
  description:
    'Find your perfect fit with Brothers Shop size guide. Measurements for chest, waist, and hip sizes.',
  alternates: {
    canonical: 'https://clothing-shop-livid.vercel.app/size-guide',
  },
};

export default function SizeGuidePage() {
  return <SizeGuideClient />;
}
