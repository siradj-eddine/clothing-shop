'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { productsApi } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';

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
  size: string;
  colors: string[];
  is_active: boolean;
  images: ProductImage[];
  main_image_url: string;
  category_name: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const { addToCart } = useCart();

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colorOptions = ['Black', 'White', 'Blue', 'Red', 'Green'];

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        const data = await productsApi.getBySlug(slug);
        setProduct(data);
        // Set the main image or first image as selected
        if (data.main_image_url) {
          setSelectedImage(data.main_image_url);
        } else if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0].image_url);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
  if (!product) return;
  
  if (!selectedSize) {
    toast.error('Please select a size');
    return;
  }
  
  console.log('Adding to cart:', {
    productId: product.id,
    quantity: quantity,
    size: selectedSize,
    color: selectedColor
  });
  
  addToCart(product.id, quantity, selectedSize, selectedColor);
};

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <Link href="/products" className="text-primary hover:underline">
          Back to Products
        </Link>
      </div>
    );
  }

  // Get all images (main image + other images)
  const allImages = product.images || [];
  if (product.main_image_url && !allImages.some(img => img.image_url === product.main_image_url)) {
    allImages.unshift({ id: 0, image: product.main_image_url, image_url: product.main_image_url, is_main: true, sort_order: 0 });
  }

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-on-surface-variant font-label-md text-label-md mb-8">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-on-surface font-medium">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {/* Left: Gallery */}
        <div className="md:col-span-7">
          {/* Main Image */}
          <div className="bg-surface-container-low rounded-xl overflow-hidden shadow-sm h-[400px] md:h-[500px] relative mb-4">
            {selectedImage ? (
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-outline">
                <span className="material-symbols-outlined text-6xl">image_not_supported</span>
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {allImages.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => setSelectedImage(img.image_url)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImage === img.image_url
                      ? 'border-primary'
                      : 'border-transparent hover:border-primary/50'
                  }`}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={img.image_url}
                      alt={`${product.name} - image ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="md:col-span-5">
          <h1 className="font-headline-md text-headline-md text-on-surface mb-2">{product.name}</h1>
          <p className="text-sm text-on-surface-variant mb-2">{product.category_name}</p>
          <p className="font-headline-sm text-headline-sm text-primary mb-4">{product.price}DZD</p>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-6">
            {product.description || 'No description available.'}
          </p>

          <div className="w-full h-px bg-outline-variant/30 my-6"></div>

          {/* Size Selection */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="font-title-lg text-title-lg text-on-surface">Size</span>
              <Link href="/size-guide" className="font-label-md text-label-md text-primary hover:underline">
                Size Guide
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 rounded-lg border font-label-md text-label-md transition-colors ${
                    selectedSize === size
                      ? 'border-primary bg-primary text-on-primary'
                      : 'border-outline-variant text-on-surface hover:border-primary hover:text-primary'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="font-title-lg text-title-lg text-on-surface">Color</span>
              <span className="font-label-md text-label-md text-on-surface-variant">{selectedColor || 'Select color'}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {(product.colors && product.colors.length > 0 ? product.colors : colorOptions).map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    selectedColor === color
                      ? 'border-primary scale-110'
                      : 'border-outline-variant hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex flex-col space-y-4 mb-8">
            <div className="flex space-x-4">
              <div className="flex items-center border border-outline-variant rounded-lg bg-surface h-14">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 text-on-surface-variant hover:text-primary"
                >
                  <span className="material-symbols-outlined">remove</span>
                </button>
                <span className="w-12 text-center font-label-md text-label-md text-on-surface">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 text-on-surface-variant hover:text-primary"
                >
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-grow rounded-lg font-label-md text-label-md font-semibold h-14 flex items-center justify-center space-x-2 transition-all ${
                  product.stock === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-primary text-on-primary hover:bg-primary-container hover:-translate-y-0.5'
                }`}
              >
                <span className="material-symbols-outlined">shopping_bag</span>
                <span>Add to Cart</span>
              </button>
            </div>
            {product.stock === 0 && (
              <p className="text-error text-center font-label-sm">Out of Stock</p>
            )}
            {product.stock > 0 && product.stock < 10 && (
              <p className="text-orange-500 text-center font-label-sm">Only {product.stock} left in stock!</p>
            )}
          </div>

          {/* Product Details Accordion */}
          <div className="border-t border-outline-variant/30">
            <details className="group py-4 cursor-pointer" open>
              <summary className="flex justify-between items-center font-title-lg text-title-lg text-on-surface list-none">
                Product Details
                <span className="material-symbols-outlined transition-transform group-open:rotate-180">
                  expand_more
                </span>
              </summary>
              <div className="pt-4 font-body-md text-body-md text-on-surface-variant">
                <ul className="list-disc pl-5 space-y-2">
                  <li>Premium quality material</li>
                  <li>Comfortable fit</li>
                  <li>Machine washable</li>
                  <li>Free shipping on orders over 10000 DZD</li>
                </ul>
              </div>
            </details>
            <details className="group py-4 border-t border-outline-variant/30 cursor-pointer">
              <summary className="flex justify-between items-center font-title-lg text-title-lg text-on-surface list-none">
                Shipping & Returns
                <span className="material-symbols-outlined transition-transform group-open:rotate-180">
                  expand_more
                </span>
              </summary>
              <div className="pt-4 font-body-md text-body-md text-on-surface-variant">
                <p>Free standard shipping on orders over 10000 DZD. Returns accepted within 30 days of purchase in unworn condition with tags attached.</p>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}