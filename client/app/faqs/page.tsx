'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function FAQsPage() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { question: t('faq.q1'), answer: t('faq.a1') },
    { question: t('faq.q2'), answer: t('faq.a2') },
    { question: t('faq.q3'), answer: t('faq.a3') },
    { question: t('faq.q4'), answer: t('faq.a4') },
    { question: t('faq.q5'), answer: t('faq.a5') },
    { question: t('faq.q6'), answer: t('faq.a6') },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">{t('faq.title')}</h1>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border rounded-lg overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full text-left p-4 bg-white hover:bg-gray-50 transition-colors flex justify-between items-center"
            >
              <span className="font-semibold">{faq.question}</span>
              <span className="text-xl">{openIndex === index ? '−' : '+'}</span>
            </button>
            {openIndex === index && (
              <div className="p-4 bg-gray-50 border-t">
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
