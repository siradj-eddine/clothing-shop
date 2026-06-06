import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Brother's Clothing Shop",
  description: 'Quality clothing for everyone',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <CartProvider>
          <Header />
          <main className="min-h-screen pt-20">{children}</main>
          <Footer />
          <Toaster position="top-right" />
        </CartProvider>
      </body>
    </html>
  );
}