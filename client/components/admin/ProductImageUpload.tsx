'use client';

import { useState } from 'react';
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

interface ProductImageUploadProps {
  productId: number;
  images: ProductImage[];
  onImageChange: () => void;
}

export default function ProductImageUpload({ productId, images, onImageChange }: ProductImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isMain = images.length === 0 && i === 0; // First image becomes main if no images exist
      
      try {
        await productsApi.uploadImage(productId, file, isMain, images.length + i);
        toast.success(`Uploaded ${file.name}`);
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
      }
    }
    
    setUploading(false);
    onImageChange(); // Refresh the product data
    e.target.value = ''; // Clear input
  };

  const handleSetMain = async (imageId: number) => {
    try {
      await productsApi.setMainImage(imageId);
      toast.success('Main image updated');
      onImageChange();
    } catch (error) {
      toast.error('Failed to set main image');
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    
    try {
      await productsApi.deleteImage(imageId);
      toast.success('Image deleted');
      onImageChange();
    } catch (error) {
      toast.error('Failed to delete image');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Product Images</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          disabled={uploading}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <p className="text-xs text-gray-500 mt-1">
          Upload multiple images (JPG, PNG, WEBP). First image becomes main by default.
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
              
              {/* Main badge */}
              {image.is_main && (
                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Main
                </div>
              )}
              
              {/* Action buttons */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!image.is_main && (
                  <button
                    onClick={() => handleSetMain(image.id)}
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

      {uploading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Uploading...</p>
        </div>
      )}
    </div>
  );
}