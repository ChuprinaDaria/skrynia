import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://runebox.eu';

export const metadata: Metadata = {
  title: 'Колекції Прикрас | Skrynia - Слов\'янські, Вікінгські, Кельтські',
  description: 'Унікальні колекції прикрас ручної роботи: слов\'янські обереги, вікінгські руни, кельтські символи. Натуральний корал, срібло 925 проби, бурштин. Доставка по Європі.',

  keywords: [
    'колекції прикрас',
    'слов\'янські прикраси купити',
    'вікінгські прикраси',
    'кельтські прикраси',
    'етнічні прикраси',
    'прикраси ручної роботи',
    'срібні прикраси',
    'натуральний корал',
    'бурштин прикраси',
    'handmade jewelry collections',
    'slavic jewelry',
    'viking jewelry',
    'celtic jewelry',
  ],

  openGraph: {
    type: 'website',
    title: 'Колекції Прикрас | Skrynia - Слов\'янські, Вікінгські, Кельтські',
    description: 'Унікальні колекції прикрас ручної роботи: слов\'янські обереги, вікінгські руни, кельтські символи. Натуральний корал, срібло 925 проби.',
    url: `${siteUrl}/collections`,
    siteName: 'Skrynia',
    locale: 'uk_UA',
    images: [
      {
        url: `${siteUrl}/images/og/og-collections.jpg`,
        width: 1200,
        height: 630,
        alt: 'Колекції Прикрас Skrynia - Слов\'янські, Вікінгські, Кельтські',
        type: 'image/jpeg',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Колекції Прикрас | Skrynia',
    description: 'Унікальні колекції прикрас ручної роботи: слов\'янські обереги, вікінгські руни, кельтські символи.',
    images: [`${siteUrl}/images/og/og-collections.jpg`],
    creator: '@skrynia',
    site: '@skrynia',
  },

  alternates: {
    canonical: `${siteUrl}/collections`,
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

export default function CollectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
