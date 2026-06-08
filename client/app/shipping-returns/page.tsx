'use client';

import { useTranslation } from 'react-i18next';

export default function ShippingReturnsPage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">{t('shipping.title')}</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">{t('shipping.shippingPolicy')}</h2>
          <div className="space-y-3 text-gray-600">
            <p>{t('shipping.freeShipping')}</p>
            <p>{t('shipping.standardShipping')}</p>
            <p>{t('shipping.expressShipping')}</p>
            <p>{t('shipping.overnightShipping')}</p>
            <p className="mt-4">{t('shipping.processTime')}</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">{t('shipping.returnPolicy')}</h2>
          <div className="space-y-3 text-gray-600">
            <p>{t('shipping.returnText')}</p>
            <p>{t('shipping.eligible')}</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>{t('shipping.eligible1')}</li>
              <li>{t('shipping.eligible2')}</li>
              <li>{t('shipping.eligible3')}</li>
            </ul>
            <p className="mt-4">{t('shipping.initiateReturn')}</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">{t('shipping.refunds')}</h2>
          <p className="text-gray-600">{t('shipping.refundsText')}</p>
        </section>
      </div>
    </div>
  );
}