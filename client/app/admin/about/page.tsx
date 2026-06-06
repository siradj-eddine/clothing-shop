'use client';

import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="font-headline-md text-headline-md text-on-surface mb-4">About Us</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Quality clothing for the modern gentleman. Crafted with care, designed for life.
        </p>
      </div>

      {/* Story Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="font-title-lg text-title-lg text-on-surface mb-4">Our Story</h2>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-4">
            Brothers Clothing Shop was founded with a simple mission: to provide high-quality, 
            stylish clothing that doesnt break the bank. What started as a small family business 
            has grown into a trusted destination for mens fashion.
          </p>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            We believe that everyone deserves to look and feel their best. Thats why we carefully 
            curate our collection, focusing on premium materials, timeless designs, and exceptional 
            value. Every piece is chosen with attention to detail and a commitment to quality.
          </p>
        </div>
        <div className="bg-surface-variant rounded-xl h-80 relative overflow-hidden">
          <div className="flex items-center justify-center h-full text-outline">
            <span className="material-symbols-outlined text-6xl">storefront</span>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
        <div className="text-center p-6 bg-surface-container-lowest rounded-xl">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-primary text-3xl">verified</span>
          </div>
          <h3 className="font-title-lg text-title-lg text-on-surface mb-2">Premium Quality</h3>
          <p className="font-body-md text-body-md text-on-surface-variant">
            We source only the finest materials for lasting comfort and durability.
          </p>
        </div>
        <div className="text-center p-6 bg-surface-container-lowest rounded-xl">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-primary text-3xl">local_shipping</span>
          </div>
          <h3 className="font-title-lg text-title-lg text-on-surface mb-2">Fast Shipping</h3>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Free shipping on orders over $100. Quick and reliable delivery worldwide.
          </p>
        </div>
        <div className="text-center p-6 bg-surface-container-lowest rounded-xl">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-primary text-3xl">support_agent</span>
          </div>
          <h3 className="font-title-lg text-title-lg text-on-surface mb-2">24/7 Support</h3>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Our dedicated team is always here to help with any questions or concerns.
          </p>
        </div>
      </div>
    </div>
  );
}