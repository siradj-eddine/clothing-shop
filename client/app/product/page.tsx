import { Metadata } from 'next';
import ProductsClient from '@/components/product/ProductsClient';

export const metadata: Metadata = {
  title: "Shop Men's Clothing | T-Shirts, Jeans, Jackets | Brothers Shop",
  description:
    "Browse our collection of premium men's clothing. Find t-shirts, jeans, jackets, and more at Brothers Shop. Free shipping across Algeria.",
  alternates: {
    canonical: 'https://clothing-shop-livid.vercel.app/product',
  },
  openGraph: {
    title: "Shop Men's Clothing Collection | Brothers Shop",
    description:
      "Browse our premium men's clothing collection. Quality t-shirts, jeans, jackets, and more.",
    url: 'https://clothing-shop-livid.vercel.app/product',
    type: 'website',
  },
};

export default function ProductsPage() {
  return <ProductsClient />;
}
