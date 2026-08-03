import { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: "Premium Men's Clothing in Algeria | Brothers Shop",
  description:
    "Discover premium men's clothing at Brothers Shop. Quality t-shirts, jeans, jackets, and more. Free shipping across Algeria on orders over 10,000 DZD.",
  alternates: {
    canonical: 'https://clothing-shop-livid.vercel.app',
  },
  openGraph: {
    title: "Brothers Shop - Premium Men's Clothing in Algeria",
    description: "Quality men's clothing in Algeria. Shop t-shirts, jeans, jackets, and more.",
    url: 'https://clothing-shop-livid.vercel.app',
    type: 'website',
  },
};

export default function HomePage() {
  return <HomeClient />;
}
