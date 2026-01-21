import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://runebox.eu';

export const metadata: Metadata = {
  title: 'Contact Us | Rune Box',
  description: 'Get in touch with us to order jewelry, ask questions or collaborate. Email, phone, social media.',
  keywords: [
    'contact',
    'get in touch',
    'order jewelry',
    'consultation',
    'email',
    'phone',
    'customer service',
  ],
  openGraph: {
    title: 'Contact Us | Rune Box',
    description: 'Get in touch with us to order jewelry or get a consultation. We are happy to help!',
    url: `${siteUrl}/contact`,
    type: 'website',
    siteName: 'Rune Box',
    locale: 'en_US',
    images: [
      {
        url: `${siteUrl}/images/logo/logo-white-pink-1.png`,
        width: 1200,
        height: 630,
        alt: 'Contact Rune Box',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | Rune Box',
    description: 'Get in touch with us to order jewelry or get a consultation.',
    images: [`${siteUrl}/images/logo/logo-white-pink-1.png`],
    creator: '@runebox',
    site: '@runebox',
  },
  alternates: {
    canonical: `${siteUrl}/contact`,
    languages: {
      'en': `${siteUrl}/contact`,
      'uk': `${siteUrl}/contact`,
      'de': `${siteUrl}/contact`,
      'pl': `${siteUrl}/contact`,
      'sv': `${siteUrl}/contact`,
      'no': `${siteUrl}/contact`,
      'da': `${siteUrl}/contact`,
      'fr': `${siteUrl}/contact`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  other: {
    'og:see_also': siteUrl,
    'article:publisher': 'https://www.facebook.com/runebox',
  },
};
