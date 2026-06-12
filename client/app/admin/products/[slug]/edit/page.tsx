'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { productsApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

interface ProductImage {
  id: number;
  image: string;
  image_url: string;
  is_main: boolean;
  sort_order: number;
}

export default function EditProductPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [productId, setProductId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    sizes: [] as string[],
    colors: [] as string[],
    is_active: true,
  });

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colorOptions = ['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Gray', 'Navy'];

  const fetchProductData = async () => {
    try {
      const product = await productsApi.getBySlug(slug as string);
      setProductId(product.id);
      setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        category: product.category?.toString() || '',
        stock: product.stock.toString(),
        sizes: product.sizes || [], 
        colors: product.colors || [],
        is_active: product.is_active,
      });
      setImages(product.images || []);
    } catch (error) {
      console.error('Failed to load product:', error);
      toast.error(t('admin.productNotFound'));
      router.push('/admin/products');
    }
  };

  useEffect(() => {
    Promise.all([
      productsApi.getCategories(),
      fetchProductData()
    ])
      .then(([cats]) => {
        setCategories(cats);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

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
    if (!files || files.length === 0 || !productId) {
      toast.error(t('admin.productIdMissing'));
      return;
    }

    setUploadingImages(true);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isMain = images.length === 0 && i === 0;
      
      try {
        const uploadedImage = await productsApi.uploadImage(productId, file, isMain, images.length + i);
        setImages(prev => [...prev, uploadedImage]);
        toast.success(`${t('admin.uploaded')} ${file.name}`);
      } catch (error: any) {
        console.error('Upload error:', error);
        toast.error(error.response?.data?.message || `${t('admin.failedToUpload')} ${file.name}`);
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
      toast.success(t('admin.mainImageUpdated'));
    } catch (error) {
      toast.error(t('admin.failedToSetMainImage'));
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!confirm(t('admin.confirmDeleteImage'))) return;
    
    try {
      await productsApi.deleteImage(imageId);
      setImages(prev => prev.filter(img => img.id !== imageId));
      toast.success(t('admin.imageDeleted'));
    } catch (error) {
      toast.error(t('admin.failedToDeleteImage'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await productsApi.update(slug as string, {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category ? parseInt(formData.category) : undefined,
        stock: parseInt(formData.stock),
        sizes: formData.sizes,
        colors: formData.colors,
        is_active: formData.is_active,
      });
      
      toast.success(t('admin.productUpdated'));
      fetchProductData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('admin.failedToUpdateProduct'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="text-primary hover:underline">
          ← {t('admin.backToProducts')}
        </Link>
        <h1 className="text-2xl font-bold">{t('admin.editProduct')}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">{t('admin.basicInformation')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t('admin.productName')} *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">{t('admin.slug')}</label>
              <input
                type="text"
                value={formData.slug}
                disabled
                className="w-full px-3 py-2 border rounded-lg bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">{t('admin.slugCannotChange')}</p>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">{t('admin.description')}</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">{t('admin.pricingAndInventory')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t('admin.priceDZD')} *</label>
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
              <label className="block text-sm font-medium mb-1">{t('admin.stock')} *</label>
              <input
                type="number"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">{t('admin.category')}</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">{t('admin.selectCategory')}</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">{t('admin.productImages')}</h2>
          
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
              {t('admin.uploadImagesHint')}
            </p>
            {productId && (
              <p className="text-xs text-green-600 mt-1">
                {t('admin.productIdReady', { id: productId })}
              </p>
            )}
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
                      {t('admin.main')}
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {!image.is_main && (
                      <button
                        type="button"
                        onClick={() => handleSetMainImage(image.id)}
                        className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                        title={t('admin.setAsMainImage')}
                      >
                        <span className="material-symbols-outlined text-[18px]">star</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(image.id)}
                      className="p-2 bg-white rounded-lg hover:bg-red-100 transition-colors text-red-500"
                      title={t('admin.deleteImage')}
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
              <p className="text-sm text-gray-500 mt-2">{t('admin.uploading')}</p>
            </div>
          )}

          {images.length === 0 && !uploadingImages && (
            <div className="text-center py-8 text-gray-500">
              <span className="material-symbols-outlined text-4xl">cloud_upload</span>
              <p className="mt-2">{t('admin.noImagesYet')}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">{t('admin.sizesMultiple')}</h2>
          
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
                {t('admin.selected')}: {formData.sizes.join(', ')}
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">{t('admin.colorsMultiple')}</h2>
          
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
                {t('admin.selected')}: {formData.colors.join(', ')}
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 text-primary rounded"
            />
            <span className="text-sm font-medium">{t('admin.activeVisible')}</span>
          </label>
        </div>

        <div className="flex justify-end gap-3">
          <Link
            href="/admin/products"
            className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            {t('admin.cancel')}
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
          >
            {submitting ? t('admin.saving') : t('admin.saveChanges')}
          </button>
        </div>
      </form>
    </div>
  );
}