import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://runebox.eu';

// NOTE: This provides fallback metadata for product pages.
// For optimal SEO, the [slug]/page.tsx should be refactored to:
// 1. Be a server component
// 2. Fetch product data from API
// 3. Use generateMetadata() for dynamic OG tags based on product data
// 4. Extract interactive parts (cart, quantity selector) into client components

export const metadata: Metadata = {
  title: 'Handmade Jewelry | Rune Box',
  description: 'Unique handmade jewelry inspired by Slavic, Viking and Celtic cultures. Natural coral, 925 silver.',

  openGraph: {
    type: 'website',
    title: 'Handmade Jewelry | Rune Box',
    description: 'Unique handmade jewelry inspired by Slavic, Viking and Celtic cultures. Natural coral, 925 silver.',
    url: `${siteUrl}/products`,
    siteName: 'Rune Box',
    locale: 'en_US',
    images: [
      {
        url: `${siteUrl}/images/logo/logo-white-pink-1.png`,
        width: 1200,
        height: 630,
        alt: 'Handmade Jewelry | Rune Box',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Handmade Jewelry | Rune Box',
    description: 'Unique handmade jewelry inspired by Slavic, Viking and Celtic cultures.',
    images: [`${siteUrl}/images/logo/logo-white-pink-1.png`],
    creator: '@runebox',
    site: '@runebox',
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
