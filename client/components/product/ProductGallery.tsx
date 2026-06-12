'use client';

import { useState } from 'react';

interface ProductImage {
  id: number;
  image: string;
  image_url: string;
  is_main: boolean;
  sort_order: number;
}

export default function ProductGallery({ images, productName }: { images: ProductImage[], productName: string }) {
  const [selectedImage, setSelectedImage] = useState(images[0]?.image_url || '');

  return (
    <>
      <div className="bg-white rounded-2xl overflow-hidden shadow-md h-[350px] sm:h-[450px] lg:h-[500px] relative mb-3">
        {selectedImage ? (
          // Use img tag instead of Next.js Image to avoid domain issues
          <img
            src={selectedImage}
            alt={productName}
            className="w-full h-full object-contain p-4"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="material-symbols-outlined text-6xl">image_not_supported</span>
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => setSelectedImage(img.image_url)}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                selectedImage === img.image_url
                  ? 'border-blue-600 shadow-md'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="relative w-full h-full">
                <img
                  src={img.image_url}
                  alt={`${productName} - image ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </>
  );
}