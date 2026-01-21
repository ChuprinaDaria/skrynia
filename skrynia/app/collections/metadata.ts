import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://runebox.eu';

export const metadata: Metadata = {
  title: 'Jewelry Collections | Rune Box',
  description: 'Explore unique handmade jewelry collections: Slavic, Viking and Celtic designs. Necklaces, bracelets, earrings and pendants crafted with 925 silver and natural coral.',
  keywords: [
    'jewelry collections',
    'slavic jewelry',
    'viking jewelry',
    'celtic jewelry',
    'necklaces',
    'bracelets',
    'earrings',
    'pendants',
    'silver 925',
    'coral jewelry',
    'handmade jewelry',
    'ethnic jewelry',
  ],
  openGraph: {
    title: 'Jewelry Collections | Rune Box',
    description: 'Explore unique handmade jewelry collections: Slavic, Viking and Celtic designs. Necklaces, bracelets, earrings and pendants.',
    url: `${siteUrl}/collections`,
    type: 'website',
    siteName: 'Rune Box',
    locale: 'en_US',
    images: [
      {
        url: `${siteUrl}/images/logo/logo-white-pink-1.png`,
        width: 1200,
        height: 630,
        alt: 'Rune Box Jewelry Collections',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jewelry Collections | Rune Box',
    description: 'Explore unique handmade jewelry collections: Slavic, Viking and Celtic designs.',
    images: [`${siteUrl}/images/logo/logo-white-pink-1.png`],
    creator: '@runebox',
    site: '@runebox',
  },
  alternates: {
    canonical: `${siteUrl}/collections`,
    languages: {
      'en': `${siteUrl}/collections`,
      'uk': `${siteUrl}/collections`,
      'de': `${siteUrl}/collections`,
      'pl': `${siteUrl}/collections`,
      'sv': `${siteUrl}/collections`,
      'no': `${siteUrl}/collections`,
      'da': `${siteUrl}/collections`,
      'fr': `${siteUrl}/collections`,
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
