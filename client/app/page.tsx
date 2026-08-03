import { Metadata } from 'next';
import HomeClient from './HomeClient';
import { Product } from '@/lib/types';

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

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/api/products/?page_size=8`, {
      // Revalidate periodically instead of no-store, since the homepage
      // benefits from being statically cached rather than fetched fresh
      // on every single request.
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error('Failed to fetch featured products:', error);
    return [];
  }
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return <HomeClient initialProducts={featuredProducts} />;
}
