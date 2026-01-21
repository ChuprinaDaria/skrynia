import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://runebox.eu';

export const metadata: Metadata = {
  title: 'Shipping & Payment | Rune Box',
  description: 'Information about delivery methods, payment options and return conditions. EU-wide delivery with InPost and courier services.',
  keywords: [
    'shipping',
    'delivery',
    'payment',
    'returns',
    'free shipping',
    'InPost',
    'courier delivery',
    'EU shipping',
  ],
  openGraph: {
    title: 'Shipping & Payment | Rune Box',
    description: 'Information about delivery methods, payment options and return conditions. EU-wide delivery.',
    url: `${siteUrl}/shipping`,
    type: 'website',
    siteName: 'Rune Box',
    locale: 'en_US',
    images: [
      {
        url: `${siteUrl}/images/logo/logo-white-pink-1.png`,
        width: 1200,
        height: 630,
        alt: 'Rune Box Shipping & Payment',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shipping & Payment | Rune Box',
    description: 'Information about delivery methods, payment options and return conditions.',
    images: [`${siteUrl}/images/logo/logo-white-pink-1.png`],
    creator: '@runebox',
    site: '@runebox',
  },
  alternates: {
    canonical: `${siteUrl}/shipping`,
    languages: {
      'en': `${siteUrl}/shipping`,
      'uk': `${siteUrl}/shipping`,
      'de': `${siteUrl}/shipping`,
      'pl': `${siteUrl}/shipping`,
      'sv': `${siteUrl}/shipping`,
      'no': `${siteUrl}/shipping`,
      'da': `${siteUrl}/shipping`,
      'fr': `${siteUrl}/shipping`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  other: {
    'og:see_also': siteUrl,
    'article:publisher': 'https://www.facebook.com/runebox',
  },
};
