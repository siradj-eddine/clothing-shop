import { Metadata } from 'next';
import AboutClient from '@/components/about/AboutClient';

export const metadata: Metadata = {
  title: "About Us | Brothers Shop - Premium Men's Clothing in Algeria",
  description:
    "Learn about Brothers Shop - your premium men's clothing store in Algeria. Quality clothing, exceptional service since 2015.",
  alternates: {
    canonical: 'https://clothing-shop-livid.vercel.app/about',
  },
  openGraph: {
    title: "About Brothers Shop | Premium Men's Clothing Algeria",
    description: "Learn about Brothers Shop - quality men's clothing in Algeria since 2015.",
    url: 'https://clothing-shop-livid.vercel.app/about',
    type: 'website',
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
