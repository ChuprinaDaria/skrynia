import type { Metadata } from 'next';
import HomePageClient from '@/components/home/HomePageClient';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://runebox.eu';

// OG Image - використовуємо логотип як базове зображення для головної
const ogImage = `${siteUrl}/images/logo/logo-white-pink-1.png`;

export const metadata: Metadata = {
  title: 'Rune Box - Unique Handmade Jewelry',
  description: 'Create your unique necklace! Handmade jewelry inspired by Slavic, Viking and Celtic cultures. Natural coral and 925 silver. EU delivery.',
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
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Rune Box',
    title: 'Rune Box - Unique Handmade Jewelry',
    description: 'Create your unique necklace! Handmade jewelry inspired by Slavic, Viking and Celtic cultures. Natural coral and 925 silver.',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'Rune Box - Unique Handmade Jewelry Collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rune Box - Unique Handmade Jewelry',
    description: 'Create your unique necklace! Handmade jewelry inspired by Slavic, Viking and Celtic cultures.',
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
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
