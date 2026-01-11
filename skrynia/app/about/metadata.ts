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
    title: 'About Us | Rune Box',
    description: 'The story of creating an authentic handmade jewelry brand',
    url: `${siteUrl}/about`,
    type: 'website',
    siteName: 'Rune Box',
    images: [
      {
        url: `${siteUrl}/images/logo/logo-white-pink-1.png`,
        width: 1200,
        height: 630,
        alt: 'About Us | Rune Box',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | Rune Box',
    description: 'The story of creating an authentic handmade jewelry brand',
    images: [`${siteUrl}/images/logo/logo-white-pink-1.png`],
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

