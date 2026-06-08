'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 z-10"></div>
          <div className="w-full h-full bg-cover bg-center" style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070')"
          }}></div>
        </div>
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fadeIn">
            {t('common.siteName')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto">
            {t('common.siteDescription')}
          </p>
          <div className="w-24 h-1 bg-primary mx-auto mt-8 rounded-full"></div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-primary font-semibold uppercase tracking-wider text-sm">{t('about.storyTitle')}</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6">
              {t('about.storyTitle')}
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>{t('about.storyText1')}</p>
              <p>{t('about.storyText2')}</p>
              <p>{t('about.storyText3')}</p>
            </div>
          </div>
          <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
            <Image
              src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=2070"
              alt="Brothers Shop Storefront"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[350px] rounded-2xl overflow-hidden shadow-xl order-2 lg:order-1">
              <div className="w-full h-full bg-gray-200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d163.03791708732024!2d6.611768559198421!3d36.36600547117395!2m3!1f135.84375000000023!2f0!3f0!3m2!1i1024!2i768!4f35!5e1!3m2!1sen!2sdz!4v1780865066784!5m2!1sen!2sdz"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  className="grayscale hover:grayscale-0 transition-all duration-500"
                ></iframe>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <span className="text-primary font-semibold uppercase tracking-wider text-sm">{t('about.visitUs')}</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6">
                {t('about.location')}
              </h2>
              <div className="space-y-4 text-gray-600">
                <p className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary">location_on</span>
                  <span>{t('common.location')}</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary">storefront</span>
                  <span>{t('about.physicalStore')}</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary">shopping_bag</span>
                  <span>{t('about.onlineAvailable')}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold uppercase tracking-wider text-sm">{t('about.valuesTitle')}</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            {t('about.valuesTitle')}
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Quality, affordability, and style - all under one roof.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
              <span className="material-symbols-outlined text-3xl text-primary group-hover:text-white">star</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t('about.valueQuality')}</h3>
            <p className="text-gray-500">{t('about.valueQualityText')}</p>
          </div>

          <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
              <span className="material-symbols-outlined text-3xl text-primary group-hover:text-white">payments</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t('about.valuePrice')}</h3>
            <p className="text-gray-500">{t('about.valuePriceText')}</p>
          </div>

          <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
              <span className="material-symbols-outlined text-3xl text-primary group-hover:text-white">support_agent</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t('about.valueService')}</h3>
            <p className="text-gray-500">{t('about.valueServiceText')}</p>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">2015</div>
              <div className="text-white/80">{t('about.statsYear')}</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">1000+</div>
              <div className="text-white/80">{t('about.statsCustomers')}</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">10+</div>
              <div className="text-white/80">{t('about.statsExperience')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('hero.title')}
          </h2>
          <p className="text-gray-500 mb-8 text-lg">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/product"
              className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-dark transition-all hover:scale-105 shadow-lg"
            >
              {t('hero.button')}
            </Link>
            <Link
              href="/contact"
              className="border-2 border-primary text-primary px-8 py-3 rounded-full font-semibold hover:bg-primary hover:text-white transition-all"
            >
              {t('footer.contact')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}