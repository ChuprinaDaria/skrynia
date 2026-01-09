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
    title: 'Доставка та Оплата | Rune box',
    description: 'Інформація про способи доставки, оплати та умови повернення',
    url: `${siteUrl}/shipping`,
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Доставка та Оплата | Rune box',
    description: 'Інформація про способи доставки, оплати та умови повернення',
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

