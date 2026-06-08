'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-32 h-32 bg-surface-variant rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-5xl text-outline">sentiment_dissatisfied</span>
        </div>
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-on-surface mb-4">{t('errors.404')}</h2>
        <p className="text-on-surface-variant mb-8 max-w-md">
          {t('errors.404Message')}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-lg hover:bg-primary-container transition-all"
        >
          <span className="material-symbols-outlined">home</span>
          {t('errors.backToHome')}
        </Link>
      </div>
    </div>
  );
}