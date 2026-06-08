'use client';

import { useTranslation } from 'react-i18next';

export default function SizeGuidePage() {
  const { t } = useTranslation();

  const sizes = [
    { size: 'XS', chest: '34-36"', waist: '28-30"', hip: '34-36"' },
    { size: 'S', chest: '36-38"', waist: '30-32"', hip: '36-38"' },
    { size: 'M', chest: '38-40"', waist: '32-34"', hip: '38-40"' },
    { size: 'L', chest: '40-42"', waist: '34-36"', hip: '40-42"' },
    { size: 'XL', chest: '42-44"', waist: '36-38"', hip: '42-44"' },
    { size: 'XXL', chest: '44-46"', waist: '38-40"', hip: '44-46"' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">{t('sizeGuide.title')}</h1>
      
      <div className="mb-8">
        <p className="text-gray-600 mb-6">{t('sizeGuide.description')}</p>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left border">{t('sizeGuide.size')}</th>
                <th className="p-3 text-left border">{t('sizeGuide.chest')}</th>
                <th className="p-3 text-left border">{t('sizeGuide.waist')}</th>
                <th className="p-3 text-left border">{t('sizeGuide.hip')}</th>
              </tr>
            </thead>
            <tbody>
              {sizes.map((size) => (
                <tr key={size.size} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-semibold border">{size.size}</td>
                  <td className="p-3 border">{size.chest}</td>
                  <td className="p-3 border">{size.waist}</td>
                  <td className="p-3 border">{size.hip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="font-semibold mb-3">{t('sizeGuide.howToMeasure')}</h3>
        <ul className="space-y-2 text-gray-600 text-sm">
          <li><strong>{t('sizeGuide.chest')}:</strong> {t('sizeGuide.chestGuide')}</li>
          <li><strong>{t('sizeGuide.waist')}:</strong> {t('sizeGuide.waistGuide')}</li>
          <li><strong>{t('sizeGuide.hip')}:</strong> {t('sizeGuide.hipGuide')}</li>
        </ul>
      </div>
    </div>
  );
}