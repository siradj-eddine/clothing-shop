'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { productsApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface ProductImage {
  id: number;
  image: string;
  image_url: string;
  is_main: boolean;
  sort_order: number;
}

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    sizes: [] as string[],  // Changed from single size to array
    colors: [] as string[],
    is_active: true,
  });

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colorOptions = ['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Gray', 'Navy'];
  const [createdProductId, setCreatedProductId] = useState<number | null>(null);

  useEffect(() => {
    // Fetch categories
    productsApi.getCategories()
      .then(setCategories)
      .catch(console.error);
  }, []);

  // Auto-generate slug from name
  useEffect(() => {
    if (formData.name) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.name]);

  const handleSizeToggle = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleColorToggle = (color: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !createdProductId) return;

    setUploadingImages(true);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isMain = images.length === 0 && i === 0;
      
      try {
        const uploadedImage = await productsApi.uploadImage(createdProductId, file, isMain, images.length + i);
        setImages(prev => [...prev, uploadedImage]);
        toast.success(`Uploaded ${file.name}`);
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
      }
    }
    
    setUploadingImages(false);
    e.target.value = '';
  };

  const handleSetMainImage = async (imageId: number) => {
    try {
      await productsApi.setMainImage(imageId);
      setImages(prev => prev.map(img => ({
        ...img,
        is_main: img.id === imageId
      })));
      toast.success('Main image updated');
    } catch (error) {
      toast.error('Failed to set main image');
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    
    try {
      await productsApi.deleteImage(imageId);
      setImages(prev => prev.filter(img => img.id !== imageId));
      toast.success('Image deleted');
    } catch (error) {
      toast.error('Failed to delete image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newProduct = await productsApi.create({
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category ? parseInt(formData.category) : null,
        stock: parseInt(formData.stock),
        sizes: formData.sizes,  // Send array of sizes
        colors: formData.colors,
        is_active: formData.is_active,
      });
      
      setCreatedProductId(newProduct.id);
      toast.success('Product created! You can now upload images.');
      
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create product');
      setLoading(false);
    }
  };

  const handleFinish = () => {
    toast.success('Product created successfully!');
    router.push('/admin/products');
  };

  // If product is created, show image upload section
  if (createdProductId) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/products" className="text-primary hover:underline">
            ← Back to Products
          </Link>
          <h1 className="text-2xl font-bold">Add Product Images</h1>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-700">
            ✅ Product "{formData.name}" has been created successfully!
            Now upload images for this product.
          </p>
        </div>

        {/* Image Upload Section */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Product Images</h2>
          
          <div className="mb-4">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              disabled={uploadingImages}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-gray-500 mt-1">
              Upload multiple images (JPG, PNG, WEBP). First image becomes main.
            </p>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
              {images.map((image) => (
                <div key={image.id} className="relative group border rounded-lg overflow-hidden bg-gray-50">
                  <div className="aspect-square relative">
                    <Image
                      src={image.image_url}
                      alt="Product"
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  {image.is_main && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Main
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {!image.is_main && (
                      <button
                        onClick={() => handleSetMainImage(image.id)}
                        className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                        title="Set as main image"
                      >
                        <span className="material-symbols-outlined text-[18px]">star</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteImage(image.id)}
                      className="p-2 bg-white rounded-lg hover:bg-red-100 transition-colors text-red-500"
                      title="Delete image"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {uploadingImages && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Uploading...</p>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={handleFinish}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
            >
              Done - Go to Products
            </button>
          </div>
        </div>

        {/* Product Info Summary */}
        <div className="bg-gray-50 rounded-lg border p-6">
          <h3 className="font-semibold mb-2">Product Information</h3>
          <p><strong>Name:</strong> {formData.name}</p>
          <p><strong>Price:</strong> {formData.price} DZD</p>
          <p><strong>Stock:</strong> {formData.stock}</p>
          <p><strong>Sizes:</strong> {formData.sizes.join(', ') || 'None'}</p>
          <p><strong>Colors:</strong> {formData.colors.join(', ') || 'None'}</p>
        </div>
      </div>
    );
  }

  // Product creation form
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="text-primary hover:underline">
          ← Back to Products
        </Link>
        <h1 className="text-2xl font-bold">Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Product Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Slug (URL)</label>
              <input
                type="text"
                value={formData.slug}
                readOnly
                className="w-full px-3 py-2 border rounded-lg bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">Auto-generated from name</p>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Pricing & Inventory</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price (DZD) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Stock *</label>
              <input
                type="number"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Sizes - Multiple Selection */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Sizes (Select multiple)</h2>
          
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeToggle(size)}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    formData.sizes.includes(size)
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            {formData.sizes.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                Selected: {formData.sizes.join(', ')}
              </p>
            )}
          </div>
        </div>

        {/* Colors */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Colors (Select multiple)</h2>
          
          <div>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorToggle(color)}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    formData.colors.includes(color)
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
            {formData.colors.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                Selected: {formData.colors.join(', ')}
              </p>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="bg-white rounded-lg border p-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 text-primary rounded"
            />
            <span className="text-sm font-medium">Active (visible to customers)</span>
          </label>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Link
            href="/admin/products"
            className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}