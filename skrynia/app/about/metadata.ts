import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://runebox.eu';

export const metadata: Metadata = {
  title: 'Про Нас | Rune box',
  description: 'Історія створення бренду автентичних прикрас ручної роботи. Дізнайтесь про нашу місію, матеріали та техніки виготовлення унікальних прикрас.',
  keywords: [
    'про нас',
    'історія бренду',
    'майстер прикрас',
    'ручна робота',
    'автентичні прикраси',
    'слов\'янські символи',
  ],
  openGraph: {
    title: 'Про Нас | Rune box',
    description: 'Історія створення бренду автентичних прикрас ручної роботи',
    url: `${siteUrl}/about`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Про Нас | Rune box',
    description: 'Історія створення бренду автентичних прикрас ручної роботи',
  },
  alternates: {
    canonical: `${siteUrl}/about`,
    languages: {
      'uk': `${siteUrl}/about`,
      'en': `${siteUrl}/about/en`,
      'de': `${siteUrl}/about/de`,
      'pl': `${siteUrl}/about/pl`,
    },
  },
};

