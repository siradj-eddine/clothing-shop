import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-low border-t border-outline-variant mt-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter py-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="col-span-1 md:col-span-4 mb-8">
          <span className="font-headline-sm text-headline-sm text-on-surface">
            Brothers Clothing Shop
          </span>
        </div>
        <div className="flex flex-col space-y-3">
          <Link href="/customer-service" legacyBehavior>
            <a className="font-body-md text-body-md text-secondary hover:text-on-surface transition-colors">
              Customer Service
            </a>
          </Link>
          <Link href="/shipping-returns" legacyBehavior>
            <a className="font-body-md text-body-md text-secondary hover:text-on-surface transition-colors">
              Shipping & Returns
            </a>
          </Link>
        </div>
        <div className="flex flex-col space-y-3">
          <Link href="/privacy" legacyBehavior>
            <a className="font-body-md text-body-md text-secondary hover:text-on-surface transition-colors">
              Privacy Policy
            </a>
          </Link>
          <Link href="/size-guide" legacyBehavior>
            <a className="font-body-md text-body-md text-secondary hover:text-on-surface transition-colors">
              Size Guide
            </a>
          </Link>
        </div>
        <div className="flex flex-col space-y-3">
          <Link href="/contact" legacyBehavior>
            <a className="font-body-md text-body-md text-secondary hover:text-on-surface transition-colors">
              Contact Us
            </a>
          </Link>
        </div>
        <div className="col-span-1 md:col-span-4 mt-8 pt-8 border-t border-outline-variant/30">
          <p className="font-body-md text-body-md text-secondary">
            © 2026 Brothers Clothing Shop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}