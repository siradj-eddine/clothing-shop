import { Metadata } from 'next';
import ContactClient from '@/components/contact/ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us | Brothers Shop',
  description:
    "Get in touch with Brothers Shop. We're here to help with your orders, questions, and feedback. Contact us today.",
  alternates: {
    canonical: 'https://clothing-shop-livid.vercel.app/contact',
  },
  openGraph: {
    title: 'Contact Brothers Shop | Get Support',
    description: "Contact us for support, questions, or feedback. We're here to help.",
    url: 'https://clothing-shop-livid.vercel.app/contact',
    type: 'website',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
