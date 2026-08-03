import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from '@/context/CartContext';
import QueryProvider from '@/providers/QueryProvider';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import I18nProvider from '@/providers/I18nProvider';
import RTLProvider from '@/components/RTLProvider';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  metadataBase: new URL('https://clothing-shop-livid.vercel.app'),
  title: {
    default: "Brothers Shop - Premium Men's Clothing in Algeria",
    template: '%s | Brothers Shop',
  },
  description:
    "Discover premium men's clothing at Brothers Shop. Quality t-shirts, jeans, jackets, and more. Free shipping across Algeria on orders over 10,000 DZD.",
  keywords: [
    "men's clothing Algeria",
    'premium clothing Algeria',
    't-shirts Algeria',
    'jeans Algeria',
    'jackets Algeria',
    "men's fashion Constantine",
    'Algerian clothing brand',
    'online clothing store Algeria',
    "men's fashion Algeria",
  ],
  authors: [{ name: 'Brothers Shop' }],
  creator: 'Brothers Shop',
  publisher: 'Brothers Shop',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Brothers Shop - Premium Men's Clothing",
    description:
      'Quality clothing for men in Algeria. Shop our collection of t-shirts, jeans, jackets, and more.',
    url: 'https://clothing-shop-livid.vercel.app',
    siteName: 'Brothers Shop',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: "Brothers Shop - Premium Men's Clothing",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Brothers Shop - Premium Men's Clothing",
    description: 'Quality clothing for men in Algeria. Shop our collection today.',
    images: ['/logo.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
  alternates: {
    canonical: 'https://clothing-shop-livid.vercel.app',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#1a56db" />
      </head>
      <body className={inter.className}>
        <GoogleAnalytics />
        <RTLProvider>
          <I18nProvider>
            <QueryProvider>
              <CartProvider>
                <Header />
                <main className="min-h-screen pt-20">{children}</main>
                <Footer />
                <Toaster position="top-right" />
              </CartProvider>
            </QueryProvider>
          </I18nProvider>
        </RTLProvider>
      </body>
    </html>
  );
}
