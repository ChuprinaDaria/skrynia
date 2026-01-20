import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://runebox.eu';

export const metadata: Metadata = {
  title: 'Блог Skrynia | Історії, Традиції та Майстерність Етнічних Прикрас',
  description: 'Дізнайтеся більше про слов\'янські, вікінгські та кельтські символи, традиції створення прикрас ручної роботи, історії та легенди, що надихають наші творіння.',

  keywords: [
    'блог про прикраси',
    'слов\'янські символи',
    'вікінгські руни',
    'кельтські вузли',
    'історія прикрас',
    'традиції прикрас',
    'майстерність',
    'ручна робота',
    'handmade jewelry blog',
    'ethnic jewelry history',
    'символіка прикрас',
  ],

  openGraph: {
    type: 'website',
    title: 'Blog | Rune Box - Stories and Traditions of Ethnic Jewelry',
    description: 'Learn more about Slavic, Viking and Celtic symbols, traditions of handmade jewelry creation, stories and legends.',
    url: `${siteUrl}/blog`,
    siteName: 'Rune Box',
    locale: 'en_US',
    images: [
      {
        url: `${siteUrl}/images/logo/logo-white-pink-1.png`,
        width: 1200,
        height: 630,
        alt: 'Blog | Rune Box - Stories and Traditions of Ethnic Jewelry',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Rune Box - Stories and Traditions of Ethnic Jewelry',
    description: 'Learn more about Slavic, Viking and Celtic symbols, traditions of handmade jewelry creation.',
    images: [`${siteUrl}/images/logo/logo-white-pink-1.png`],
    creator: '@runebox',
    site: '@runebox',
  },

  alternates: {
    canonical: `${siteUrl}/blog`,
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

  other: {
    'og:see_also': siteUrl, // Threads support
    'article:publisher': 'https://www.facebook.com/runebox', // Facebook & LinkedIn
    'og:type': 'website', // Explicit OG type
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
