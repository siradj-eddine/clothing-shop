import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetailClient from '@/components/product/ProductDetailClient';
import ProductStructuredData from '@/components/ProductStructuredData';

interface ProductImage {
  id: number;
  image: string;
  image_url: string;
  is_main: boolean;
  sort_order: number;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  stock: number;
  sizes: string[];
  colors: string[];
  is_active: boolean;
  images: ProductImage[];
  main_image_url: string;
  category_name: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_URL}/api/products/${slug}/`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProduct(params.slug);

  if (!product) {
    return {
      title: 'Product Not Found | Brothers Shop',
    };
  }

  const title = `${product.name} - Brothers Shop`;
  const description =
    product.description ||
    `Shop ${product.name} at Brothers Shop. Premium men's clothing in Algeria.`;
  const imageUrl = product.main_image_url || '/logo.png';

  return {
    title,
    description,
    alternates: {
      canonical: `https://clothing-shop-livid.vercel.app/product/${product.slug}`,
    },
    openGraph: {
      title,
      description,
      images: [{ url: imageUrl }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  // Build images array properly
  const allImages: ProductImage[] = [];

  if (product.main_image_url) {
    allImages.push({
      id: 0,
      image: product.main_image_url,
      image_url: product.main_image_url,
      is_main: true,
      sort_order: 0,
    });
  }

  if (product.images && product.images.length > 0) {
    product.images.forEach((img) => {
      if (!allImages.some((existing) => existing.image_url === img.image_url)) {
        allImages.push(img);
      }
    });
  }

  const availableSizes = product.sizes?.length ? product.sizes : ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const availableColors = product.colors?.length
    ? product.colors
    : ['Black', 'White', 'Blue', 'Red', 'Green'];

  return (
    <>
      <ProductStructuredData product={product} />
      <ProductDetailClient
        product={product}
        allImages={allImages}
        availableSizes={availableSizes}
        availableColors={availableColors}
      />
    </>
  );
}
