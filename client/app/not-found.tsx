'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-32 h-32 bg-surface-variant rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-5xl text-outline">sentiment_dissatisfied</span>
        </div>
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-on-surface mb-4">Page Not Found</h2>
        <p className="text-on-surface-variant mb-8 max-w-md">
          Oops! The page youre looking for doesnt exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-lg hover:bg-primary-container transition-all"
        >
          <span className="material-symbols-outlined">home</span>
          Back to Home
        </Link>
      </div>
    </div>
  );
}