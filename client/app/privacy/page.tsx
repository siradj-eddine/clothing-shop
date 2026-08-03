import { Metadata } from 'next';
import PrivacyClient from '@/components/privacy/PrivacyClient';

export const metadata: Metadata = {
  title: 'Privacy Policy | Brothers Shop',
  description:
    'Read Brothers Shop privacy policy. Learn how we protect your data and handle your information.',
  alternates: {
    canonical: 'https://clothing-shop-livid.vercel.app/privacy',
  },
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}
