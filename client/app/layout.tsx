import { Inter } from 'next/font/google';

import { Toaster } from 'react-hot-toast';
import { CartProvider } from '@/context/CartContext';
import QueryProvider from '@/providers/QueryProvider';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import I18nProvider from '@/providers/I18nProvider';
import RTLProvider from '@/components/RTLProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Brothers Shop - Premium Clothing',
  description: 'Premium men\'s clothing shop in Algeria',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
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