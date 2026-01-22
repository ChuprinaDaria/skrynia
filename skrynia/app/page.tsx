import type { Metadata } from 'next';
import HomePageClient from '@/components/home/HomePageClient';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://runebox.eu';

// OG Image - використовуємо hero зображення для соцмереж
const ogImage = `${siteUrl}/images/hero/hero-gemini.png`;

export const metadata: Metadata = {
  title: 'Rune Box - Unique Handmade Jewelry | Slavic, Viking & Celtic',
  description: 'Discover authentic handmade jewelry inspired by Slavic, Viking and Celtic cultures. Natural coral, 925 silver, unique necklaces crafted with love. Free EU delivery on orders over 200€.',
  keywords: [
    'handmade jewelry',
    'slavic jewelry',
    'viking jewelry',
    'celtic jewelry',
    'coral necklace',
    'silver jewelry 925',
    'ethnic jewelry',
    'unique necklace',
    'handcrafted jewelry',
    'artisan jewelry',
    'EU jewelry shop',
    'natural coral jewelry',
    'authentic ethnic jewelry',
    'handmade necklaces',
    'gift for her',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Rune Box',
    title: 'Rune Box - Unique Handmade Jewelry',
    description: 'Discover authentic handmade jewelry inspired by Slavic, Viking and Celtic cultures. Natural coral, 925 silver, unique necklaces crafted with love. Free EU delivery.',
    images: [
      {
        url: ogImage,
        width: 1232,
        height: 864,
        alt: 'Rune Box - Handmade Slavic, Viking & Celtic Jewelry Collection',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rune Box - Unique Handmade Jewelry',
    description: 'Discover authentic handmade jewelry inspired by Slavic, Viking and Celtic cultures. Natural coral & 925 silver.',
    images: [ogImage],
    creator: '@runebox',
    site: '@runebox',
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      'en': siteUrl,
      'uk': siteUrl,
      'de': siteUrl,
      'pl': siteUrl,
      'sv': siteUrl,
      'no': siteUrl,
      'da': siteUrl,
      'fr': siteUrl,
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
    'fb:app_id': '1552229889398632',
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
