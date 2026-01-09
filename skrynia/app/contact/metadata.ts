import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://runebox.eu';

export const metadata: Metadata = {
  title: 'Контакти | Rune box',
  description: 'Зв\'яжіться з нами для замовлення прикрас, консультацій або співпраці. Email, телефон, соціальні мережі.',
  keywords: [
    'контакти',
    'зв\'язатися',
    'замовити прикраси',
    'консультація',
    'email',
    'телефон',
  ],
  openGraph: {
    title: 'Контакти | Rune box',
    description: 'Зв\'яжіться з нами для замовлення прикрас або консультацій',
    url: `${siteUrl}/contact`,
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Контакти | Rune box',
    description: 'Зв\'яжіться з нами для замовлення прикрас або консультацій',
  },
  alternates: {
    canonical: `${siteUrl}/contact`,
    languages: {
      'uk': `${siteUrl}/contact`,
      'en': `${siteUrl}/contact/en`,
      'de': `${siteUrl}/contact/de`,
      'pl': `${siteUrl}/contact/pl`,
    },
  },
};

