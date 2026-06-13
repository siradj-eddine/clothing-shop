import { notFound } from "next/navigation";
import Link from "next/link";
import ProductGallery from "@/components/product/ProductGallery";
import ProductActions from "@/components/product/ProductActions";

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

// FIXED: Use environment variable for API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://clothing-shop-api-7r8z.onrender.com';

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_URL}/api/products/${slug}/`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  
  if (!product) {
    notFound();
  }

  // Build images array properly
  const allImages: ProductImage[] = [];
  
  // Add main image if exists
  if (product.main_image_url) {
    allImages.push({
      id: 0,
      image: product.main_image_url,
      image_url: product.main_image_url,
      is_main: true,
      sort_order: 0
    });
  }
  
  // Add other images
  if (product.images && product.images.length > 0) {
    product.images.forEach(img => {
      if (!allImages.some(existing => existing.image_url === img.image_url)) {
        allImages.push(img);
      }
    });
  }

  const availableSizes = product.sizes?.length ? product.sizes : ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const availableColors = product.colors?.length ? product.colors : ['Black', 'White', 'Blue', 'Red', 'Green'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center text-xs sm:text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span className="mx-2">›</span>
            <Link href="/product" className="hover:text-blue-600 transition-colors">Products</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-10">
        <div className="flex flex-col lg:flex-row lg:gap-8 xl:gap-12">
          
          {/* Left: Image Gallery */}
          <div className="lg:w-1/2 mb-6 lg:mb-0">
            {allImages.length > 0 ? (
              <ProductGallery images={allImages} productName={product.name} />
            ) : (
              <div className="bg-white rounded-2xl overflow-hidden shadow-md h-[350px] sm:h-[450px] lg:h-[500px] flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <span className="material-symbols-outlined text-6xl">image_not_supported</span>
                  <p className="mt-2 text-sm">No image available</p>
                </div>
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-2xl p-5 sm:p-8 shadow-sm">
              <p className="text-xs sm:text-sm text-blue-600 font-medium mb-2">
                {product.category_name || "Uncategorized"}
              </p>
              
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                {product.name}
              </h1>
              
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600">
                  {Math.round(parseFloat(product.price))} DZD
                </span>
                {product.stock > 0 && (
                  <span className="text-xs sm:text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    In Stock
                  </span>
                )}
              </div>
              
              <div className="border-t border-gray-100 pt-6 mb-6">
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  {product.description || "No description available."}
                </p>
              </div>
              
              <ProductActions 
                productId={product.id}
                productName={product.name}
                stock={product.stock}
                sizes={availableSizes}
                colors={availableColors}
              />
              
              <div className="border-t border-gray-100 mt-8 pt-6">
                <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div>
                    <span className="text-gray-500">SKU:</span>
                    <span className="ml-2 text-gray-900">#{product.id}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Category:</span>
                    <span className="ml-2 text-gray-900">{product.category_name || "-"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}