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
    title: 'Collections | Rune Box - Slavic, Viking, Celtic',
    description: 'Unique handmade jewelry collections: Slavic amulets, Viking runes, Celtic symbols. Natural coral, 925 silver.',
    url: `${siteUrl}/collections`,
    siteName: 'Rune Box',
    locale: 'en_US',
    images: [
      {
        url: `${siteUrl}/images/logo/logo-white-pink-1.png`,
        width: 1200,
        height: 630,
        alt: 'Collections | Rune Box - Slavic, Viking, Celtic',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Collections | Rune Box',
    description: 'Unique handmade jewelry collections: Slavic amulets, Viking runes, Celtic symbols.',
    images: [`${siteUrl}/images/logo/logo-white-pink-1.png`],
    creator: '@runebox',
    site: '@runebox',
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
