interface Wilaya {
  id: number;
  name: string;
  arabic_name: string;
  shipping_cost: number;
  code: string;
}

export const wilayas: Wilaya[] = [
  { id: 1, name: 'Adrar', arabic_name: 'أدرار', shipping_cost: 800, code: '01' },
  { id: 2, name: 'Chlef', arabic_name: 'الشلف', shipping_cost: 500, code: '02' },
  { id: 3, name: 'Laghouat', arabic_name: 'الأغواط', shipping_cost: 700, code: '03' },
  { id: 4, name: 'Oum El Bouaghi', arabic_name: 'أم البواقي', shipping_cost: 600, code: '04' },
  { id: 5, name: 'Batna', arabic_name: 'باتنة', shipping_cost: 600, code: '05' },
  { id: 6, name: 'Béjaïa', arabic_name: 'بجاية', shipping_cost: 500, code: '06' },
  { id: 7, name: 'Biskra', arabic_name: 'بسكرة', shipping_cost: 700, code: '07' },
  { id: 8, name: 'Béchar', arabic_name: 'بشار', shipping_cost: 900, code: '08' },
  { id: 9, name: 'Blida', arabic_name: 'البليدة', shipping_cost: 400, code: '09' },
  { id: 10, name: 'Bouira', arabic_name: 'البويرة', shipping_cost: 500, code: '10' },
  { id: 11, name: 'Tamanrasset', arabic_name: 'تمنراست', shipping_cost: 1500, code: '11' },
  { id: 12, name: 'Tébessa', arabic_name: 'تبسة', shipping_cost: 700, code: '12' },
  { id: 13, name: 'Tlemcen', arabic_name: 'تلمسان', shipping_cost: 600, code: '13' },
  { id: 14, name: 'Tiaret', arabic_name: 'تيارت', shipping_cost: 600, code: '14' },
  { id: 15, name: 'Tizi Ouzou', arabic_name: 'تيزي وزو', shipping_cost: 500, code: '15' },
  { id: 16, name: 'Algiers', arabic_name: 'الجزائر', shipping_cost: 400, code: '16' },
  { id: 17, name: 'Djelfa', arabic_name: 'الجلفة', shipping_cost: 700, code: '17' },
  { id: 18, name: 'Jijel', arabic_name: 'جيجل', shipping_cost: 500, code: '18' },
  { id: 19, name: 'Sétif', arabic_name: 'سطيف', shipping_cost: 500, code: '19' },
  { id: 20, name: 'Saïda', arabic_name: 'سعيدة', shipping_cost: 600, code: '20' },
  { id: 21, name: 'Skikda', arabic_name: 'سكيكدة', shipping_cost: 600, code: '21' },
  { id: 22, name: 'Sidi Bel Abbès', arabic_name: 'سيدي بلعباس', shipping_cost: 600, code: '22' },
  { id: 23, name: 'Annaba', arabic_name: 'عنابة', shipping_cost: 600, code: '23' },
  { id: 24, name: 'Guelma', arabic_name: 'قالمة', shipping_cost: 600, code: '24' },
  { id: 25, name: 'Constantine', arabic_name: 'قسنطينة', shipping_cost: 400, code: '25' },
  { id: 26, name: 'Médéa', arabic_name: 'المدية', shipping_cost: 500, code: '26' },
  { id: 27, name: 'Mostaganem', arabic_name: 'مستغانم', shipping_cost: 600, code: '27' },
  { id: 28, name: "M'Sila", arabic_name: 'المسيلة', shipping_cost: 600, code: '28' },
  { id: 29, name: 'Mascara', arabic_name: 'معسكر', shipping_cost: 600, code: '29' },
  { id: 30, name: 'Ouargla', arabic_name: 'ورقلة', shipping_cost: 800, code: '30' },
  { id: 31, name: 'Oran', arabic_name: 'وهران', shipping_cost: 500, code: '31' },
  { id: 32, name: 'El Bayadh', arabic_name: 'البيض', shipping_cost: 800, code: '32' },
  { id: 33, name: 'Illizi', arabic_name: 'إليزي', shipping_cost: 1200, code: '33' },
  {
    id: 34,
    name: 'Bordj Bou Arréridj',
    arabic_name: 'برج بوعريريج',
    shipping_cost: 500,
    code: '34',
  },
  { id: 35, name: 'Boumerdès', arabic_name: 'بومرداس', shipping_cost: 400, code: '35' },
  { id: 36, name: 'El Tarf', arabic_name: 'الطارف', shipping_cost: 600, code: '36' },
  { id: 37, name: 'Tindouf', arabic_name: 'تندوف', shipping_cost: 1200, code: '37' },
  { id: 38, name: 'Tissemsilt', arabic_name: 'تيسمسيلت', shipping_cost: 600, code: '38' },
  { id: 39, name: 'El Oued', arabic_name: 'الوادي', shipping_cost: 800, code: '39' },
  { id: 40, name: 'Khenchela', arabic_name: 'خنشلة', shipping_cost: 700, code: '40' },
  { id: 41, name: 'Souk Ahras', arabic_name: 'سوق أهراس', shipping_cost: 600, code: '41' },
  { id: 42, name: 'Tipaza', arabic_name: 'تيبازة', shipping_cost: 400, code: '42' },
  { id: 43, name: 'Mila', arabic_name: 'ميلة', shipping_cost: 600, code: '43' },
  { id: 44, name: 'Aïn Defla', arabic_name: 'عين الدفلى', shipping_cost: 500, code: '44' },
  { id: 45, name: 'Naâma', arabic_name: 'النعامة', shipping_cost: 800, code: '45' },
  { id: 46, name: 'Aïn Témouchent', arabic_name: 'عين تموشنت', shipping_cost: 600, code: '46' },
  { id: 47, name: 'Ghardaïa', arabic_name: 'غرداية', shipping_cost: 700, code: '47' },
  { id: 48, name: 'Relizane', arabic_name: 'غليزان', shipping_cost: 600, code: '48' },
  { id: 49, name: 'Timimoun', arabic_name: 'تيميمون', shipping_cost: 1000, code: '49' },
  {
    id: 50,
    name: 'Bordj Badji Mokhtar',
    arabic_name: 'برج باجي مختار',
    shipping_cost: 1500,
    code: '50',
  },
  { id: 51, name: 'Ouled Djellal', arabic_name: 'أولاد جلال', shipping_cost: 800, code: '51' },
  { id: 52, name: 'Béni Abbès', arabic_name: 'بني عباس', shipping_cost: 1000, code: '52' },
  { id: 53, name: 'In Salah', arabic_name: 'عين صالح', shipping_cost: 1400, code: '53' },
  { id: 54, name: 'In Guezzam', arabic_name: 'عين قزام', shipping_cost: 1600, code: '54' },
  { id: 55, name: 'Touggourt', arabic_name: 'تقرت', shipping_cost: 800, code: '55' },
  { id: 56, name: 'Djanet', arabic_name: 'جانت', shipping_cost: 1500, code: '56' },
  { id: 57, name: "El M'Ghair", arabic_name: 'المغير', shipping_cost: 800, code: '57' },
  { id: 58, name: 'El Menia', arabic_name: 'المنيعة', shipping_cost: 900, code: '58' },
];

export const getWilayaById = (id: number): Wilaya | undefined => {
  return wilayas.find((w) => w.id === id);
};

export const getWilayaByName = (name: string): Wilaya | undefined => {
  return wilayas.find((w) => w.name.toLowerCase() === name.toLowerCase());
};

export const getShippingCost = (wilayaId: number): number => {
  const wilaya = wilayas.find((w) => w.id === wilayaId);
  return wilaya?.shipping_cost || 600;
};
