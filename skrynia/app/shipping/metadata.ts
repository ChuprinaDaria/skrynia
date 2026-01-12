import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://runebox.eu';

export const metadata: Metadata = {
  title: 'Доставка та Оплата | Rune box',
  description: 'Інформація про способи доставки, оплати та умови повернення. Безкоштовна доставка по ЄС від 150€.',
  keywords: [
    'доставка',
    'оплата',
    'повернення',
    'безкоштовна доставка',
    'InPost',
    'DHL',
    'Нова Пошта',
    'умови доставки',
  ],
  openGraph: {
    title: 'Shipping & Payment | Rune Box',
    description: 'Information about delivery methods, payment options and return conditions',
    url: `${siteUrl}/shipping`,
    type: 'website',
    siteName: 'Rune Box',
    locale: 'en_US',
    images: [
      {
        url: `${siteUrl}/images/logo/logo-white-pink-1.png`,
        width: 1200,
        height: 630,
        alt: 'Shipping & Payment | Rune Box',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shipping & Payment | Rune Box',
    description: 'Information about delivery methods, payment options and return conditions',
    images: [`${siteUrl}/images/logo/logo-white-pink-1.png`],
    creator: '@runebox',
    site: '@runebox',
  },
  alternates: {
    canonical: `${siteUrl}/shipping`,
    languages: {
      'uk': `${siteUrl}/shipping`,
      'en': `${siteUrl}/shipping/en`,
      'de': `${siteUrl}/shipping/de`,
      'pl': `${siteUrl}/shipping/pl`,
    },
  },
};

