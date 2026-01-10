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
    title: 'Блог Skrynia | Історії та Традиції Етнічних Прикрас',
    description: 'Дізнайтеся більше про слов\'янські, вікінгські та кельтські символи, традиції створення прикрас ручної роботи, історії та легенди.',
    url: `${siteUrl}/blog`,
    siteName: 'Skrynia',
    locale: 'uk_UA',
    images: [
      {
        url: `${siteUrl}/images/og/og-blog.jpg`,
        width: 1200,
        height: 630,
        alt: 'Блог Skrynia - Історії та Традиції Етнічних Прикрас',
        type: 'image/jpeg',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Блог Skrynia | Історії та Традиції Етнічних Прикрас',
    description: 'Дізнайтеся більше про слов\'янські, вікінгські та кельтські символи, традиції створення прикрас ручної роботи.',
    images: [`${siteUrl}/images/og/og-blog.jpg`],
    creator: '@skrynia',
    site: '@skrynia',
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
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
