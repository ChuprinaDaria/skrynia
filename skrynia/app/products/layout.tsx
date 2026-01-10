import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://runebox.eu';

// NOTE: This provides fallback metadata for product pages.
// For optimal SEO, the [slug]/page.tsx should be refactored to:
// 1. Be a server component
// 2. Fetch product data from API
// 3. Use generateMetadata() for dynamic OG tags based on product data
// 4. Extract interactive parts (cart, quantity selector) into client components

export const metadata: Metadata = {
  title: 'Прикраси Ручної Роботи | Skrynia',
  description: 'Унікальні прикраси ручної роботи за мотивами слов\'янської, вікінгської та кельтської культури. Натуральний корал, срібло 925 проби.',

  openGraph: {
    type: 'product',
    siteName: 'Skrynia',
    locale: 'uk_UA',
  },

  twitter: {
    card: 'summary_large_image',
    creator: '@skrynia',
    site: '@skrynia',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
