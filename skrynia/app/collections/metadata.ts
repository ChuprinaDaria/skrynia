import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://runebox.eu';

export const metadata: Metadata = {
  title: 'Колекції Прикрас | Rune box',
  description: 'Перегляньте унікальні колекції прикрас: українські, вікінгські та кельтські. Намиста, браслети, сережки та підвіски ручної роботи.',
  keywords: [
    'колекції прикрас',
    'українські прикраси',
    'вікінгські прикраси',
    'кельтські прикраси',
    'намиста',
    'браслети',
    'сережки',
    'підвіски',
    'срібло 925',
    'корал',
  ],
  openGraph: {
    title: 'Collections | Rune Box',
    description: 'Unique handmade jewelry collections: Ukrainian, Viking and Celtic designs',
    url: `${siteUrl}/collections`,
    type: 'website',
    siteName: 'Rune Box',
    images: [
      {
        url: `${siteUrl}/images/logo/logo-white-pink-1.png`,
        width: 1200,
        height: 630,
        alt: 'Collections | Rune Box',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Collections | Rune Box',
    description: 'Unique handmade jewelry collections: Ukrainian, Viking and Celtic designs',
    images: [`${siteUrl}/images/logo/logo-white-pink-1.png`],
  },
  alternates: {
    canonical: `${siteUrl}/collections`,
    languages: {
      'uk': `${siteUrl}/collections`,
      'en': `${siteUrl}/collections/en`,
      'de': `${siteUrl}/collections/de`,
      'pl': `${siteUrl}/collections/pl`,
    },
  },
};

