import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://runebox.eu';

export const metadata: Metadata = {
  title: 'About Us | Rune Box',
  description: 'The story of creating an authentic handmade jewelry brand. Learn about our mission, materials, and unique jewelry crafting techniques.',
  keywords: [
    'about us',
    'brand story',
    'jewelry artisan',
    'handmade',
    'authentic jewelry',
    'slavic symbols',
    'handcrafted jewelry',
  ],
  openGraph: {
    title: 'About Us | Rune Box',
    description: 'The story of creating an authentic handmade jewelry brand. Learn about our mission and craftsmanship.',
    url: `${siteUrl}/about`,
    type: 'website',
    siteName: 'Rune Box',
    locale: 'en_US',
    images: [
      {
        url: `${siteUrl}/images/logo/logo-white-pink-1.png`,
        width: 1200,
        height: 630,
        alt: 'About Rune Box - Handmade Jewelry Brand',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | Rune Box',
    description: 'The story of creating an authentic handmade jewelry brand.',
    images: [`${siteUrl}/images/logo/logo-white-pink-1.png`],
    creator: '@runebox',
    site: '@runebox',
  },
  alternates: {
    canonical: `${siteUrl}/about`,
    languages: {
      'en': `${siteUrl}/about`,
      'uk': `${siteUrl}/about`,
      'de': `${siteUrl}/about`,
      'pl': `${siteUrl}/about`,
      'sv': `${siteUrl}/about`,
      'no': `${siteUrl}/about`,
      'da': `${siteUrl}/about`,
      'fr': `${siteUrl}/about`,
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
