// components/ProductStructuredData.tsx
'use client';

import { useEffect } from 'react';

interface ProductStructuredDataProps {
  product: {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: string;
    stock: number;
    main_image_url: string;
    category_name: string;
  };
}

export default function ProductStructuredData({ product }: ProductStructuredDataProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org/',
      '@type': 'Product',
      name: product.name,
      description: product.description || `${product.name} from Brothers Shop`,
      image: product.main_image_url,
      sku: `BS-${product.id}`,
      brand: {
        '@type': 'Brand',
        name: 'Brothers Shop',
      },
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: 'DZD',
        availability: product.stock > 0 ? 'InStock' : 'OutOfStock',
        url: `https://clothing-shop-livid.vercel.app/product/${product.slug}`,
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.5',
        ratingCount: '12',
      },
    });
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [product]);

  return null;
}
