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
    title: 'Колекції Прикрас | Rune box',
    description: 'Унікальні колекції прикрас ручної роботи: українські, вікінгські та кельтські',
    url: `${siteUrl}/collections`,
    type: 'website',
    images: [
      {
        url: `${siteUrl}/images/og/collections-og.jpg`,
        width: 1200,
        height: 630,
        alt: 'Колекції прикрас Rune box',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Колекції Прикрас | Rune box',
    description: 'Унікальні колекції прикрас ручної роботи',
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

