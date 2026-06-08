import { notFound } from 'next/navigation';
import Link from 'next/link';
import ProductGallery from '@/components/product/ProductGallery';
import ProductActions from '@/components/product/ProductActions';

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

// Generate static params for all products at build time
export async function generateStaticParams() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    const response = await fetch(`${apiUrl}/products/?page_size=100`, {
      cache: 'no-store'
    });
    const data = await response.json();
    
    return data.results.map((product: Product) => ({
      slug: product.slug,
    }));
  } catch (error) {
    console.error('Failed to generate static params:', error);
    return [];
  }
}

// Fetch product data at build time
async function getProduct(slug: string): Promise<Product | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    const res = await fetch(`${apiUrl}/products/${slug}/`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return null;
  }
}

// Translation component wrapper
function TransText({ textKey, children }: { textKey?: string; children?: React.ReactNode }) {
  // This will be replaced with client-side translation
  if (textKey === 'home') return <>Home</>;
  if (textKey === 'products') return <>Products</>;
  if (textKey === 'productDetails') return <>Product Details</>;
  if (textKey === 'shippingReturns') return <>Shipping & Returns</>;
  if (textKey === 'freeShipping') return <>Free shipping on orders over 10,000 DZD</>;
  if (textKey === 'returnsPolicy') return <>Returns accepted within 30 days of purchase in unworn condition with tags attached.</>;
  if (textKey === 'premiumQuality') return <>Premium quality material</>;
  if (textKey === 'comfortableFit') return <>Comfortable fit</>;
  if (textKey === 'machineWashable') return <>Machine washable</>;
  return <>{children}</>;
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  
  if (!product) {
    notFound();
  }

  const sizes = product.sizes?.length ? product.sizes : ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = product.colors?.length ? product.colors : ['Black', 'White', 'Blue', 'Red', 'Green'];
  const allImages = product.images || [];
  
  if (product.main_image_url && !allImages.some(img => img.image_url === product.main_image_url)) {
    allImages.unshift({ 
      id: 0, 
      image: product.main_image_url, 
      image_url: product.main_image_url, 
      is_main: true, 
      sort_order: 0 
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
        
        {/* Breadcrumbs */}
        <div className="flex items-center text-xs md:text-sm text-gray-500 mb-6 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-blue-600"><TransText textKey="home" /></Link>
          <span className="mx-2">›</span>
          <Link href="/product" className="hover:text-blue-600"><TransText textKey="products" /></Link>
          <span className="mx-2">›</span>
          <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:gap-8">
          
          {/* Left: Image Gallery */}
          <div className="lg:w-1/2 mb-6 lg:mb-0">
            <ProductGallery images={allImages} productName={product.name} />
          </div>

          {/* Right: Product Details */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-2xl p-5 md:p-8 shadow-md">
              <div className="mb-4">
                <p className="text-sm text-blue-600 font-medium mb-1">{product.category_name}</p>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.name}</h1>
              </div>

              <div className="mb-6">
                <span className="text-2xl md:text-3xl font-bold text-blue-600">
                  {Math.round(parseFloat(product.price))} DZD
                </span>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                  {product.description || 'No description available.'}
                </p>
              </div>

              <div className="border-t border-gray-100 my-6"></div>

              {/* Client-side interactive components */}
              <ProductActions 
                productId={product.id}
                productName={product.name}
                stock={product.stock}
                sizes={sizes}
                colors={colors}
              />

              {/* Accordion Details */}
              <div className="border-t border-gray-100 mt-6">
                <details className="group py-3">
                  <summary className="flex justify-between items-center font-semibold text-gray-900 cursor-pointer list-none">
                    <TransText textKey="productDetails" />
                    <span className="material-symbols-outlined text-[20px] transition-transform group-open:rotate-180">
                      expand_more
                    </span>
                  </summary>
                  <div className="pt-3 text-gray-600 text-sm">
                    <ul className="list-disc pl-5 space-y-1">
                      <li><TransText textKey="premiumQuality" /></li>
                      <li><TransText textKey="comfortableFit" /></li>
                      <li><TransText textKey="machineWashable" /></li>
                      <li><TransText textKey="freeShipping" /></li>
                    </ul>
                  </div>
                </details>
                <details className="group py-3 border-t border-gray-100">
                  <summary className="flex justify-between items-center font-semibold text-gray-900 cursor-pointer list-none">
                    <TransText textKey="shippingReturns" />
                    <span className="material-symbols-outlined text-[20px] transition-transform group-open:rotate-180">
                      expand_more
                    </span>
                  </summary>
                  <div className="pt-3 text-gray-600 text-sm">
                    <p><TransText textKey="returnsPolicy" /></p>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}