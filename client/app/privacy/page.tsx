'use client';

import { useTranslation } from 'react-i18next';

export default function PrivacyPage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">{t('privacy.title')}</h1>
      
      <div className="space-y-6 text-gray-600">
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">{t('privacy.infoCollect')}</h2>
          <p>{t('privacy.infoCollectText')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">{t('privacy.useInfo')}</h2>
          <p>{t('privacy.useInfoText')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">{t('privacy.security')}</h2>
          <p>{t('privacy.securityText')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">{t('privacy.cookies')}</h2>
          <p>{t('privacy.cookiesText')}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">{t('privacy.contact')}</h2>
          <p>{t('privacy.contactText')}</p>
        </section>
      </div>
    </div>
  );
}