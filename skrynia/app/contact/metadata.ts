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
    title: 'Contact Us | Rune Box',
    description: 'Get in touch with us to order jewelry or get a consultation',
    url: `${siteUrl}/contact`,
    type: 'website',
    siteName: 'Rune Box',
    images: [
      {
        url: `${siteUrl}/images/logo/logo-white-pink-1.png`,
        width: 1200,
        height: 630,
        alt: 'Contact Us | Rune Box',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | Rune Box',
    description: 'Get in touch with us to order jewelry or get a consultation',
    images: [`${siteUrl}/images/logo/logo-white-pink-1.png`],
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

