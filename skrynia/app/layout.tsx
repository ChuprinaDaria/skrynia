import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/contexts/CartContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import CartDrawerWrapper from "@/components/cart/CartDrawerWrapper";
import Script from 'next/script';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://runebox.eu';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#660000' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  
  // Базові мета-теги
  title: {
    default: "Rune box | Автентичні Прикраси Ручної Роботи",
    template: "%s | Rune box",
  },
  description: "Унікальні прикраси ручної роботи за мотивами слов'янської, вікінгської та кельтської культури. Натуральний корал, срібло 925 проби. Доставка по Європі.",
  
  // Ключові слова
  keywords: [
    "прикраси ручної роботи",
    "слов'янські прикраси",
    "кельтські прикраси",
    "вікінгські прикраси",
    "намисто з коралу",
    "срібні прикраси",
    "етнічні прикраси",
    "українські прикраси",
    "handmade jewelry",
    "slavic jewelry",
    "celtic jewelry",
    "viking jewelry",
    "coral necklace",
    "silver jewelry",
    "ethnic jewelry",
    "Schmuck handgefertigt",
    "biżuteria ręcznie robiona",
    "натуральний корал",
    "срібло 925",
    "аутентичні прикраси",
    "подарунок для жінки",
    "ексклюзивні прикраси",
  ],
  
  authors: [{ name: "Rune box", url: siteUrl }],
  creator: "Rune box",
  publisher: "Rune box",
  
  // Форматування
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  
  // Open Graph
  openGraph: {
    type: "website",
    siteName: "Rune box",
    title: "Rune box | Автентичні Прикраси Ручної Роботи",
    description: "Унікальні прикраси ручної роботи за мотивами слов'янської, вікінгської та кельтської культури. Натуральний корал, срібло 925 проби.",
    url: siteUrl,
    locale: "uk_UA",
    alternateLocale: ["en_US", "de_DE", "pl_PL"],
    images: [
      {
        url: `${siteUrl}/images/og/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Rune box - Автентичні Прикраси Ручної Роботи",
        type: "image/jpeg",
      },
      {
        url: `${siteUrl}/images/og/og-image-square.jpg`,
        width: 1200,
        height: 1200,
        alt: "Rune box - Автентичні Прикраси Ручної Роботи",
        type: "image/jpeg",
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Rune box | Автентичні Прикраси Ручної Роботи",
    description: "Унікальні прикраси ручної роботи за мотивами слов'янської, вікінгської та кельтської культури.",
    images: [`${siteUrl}/images/og/og-image.jpg`],
    creator: "@runebox",
    site: "@runebox",
  },
  
  // Роботи
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  // Іконки
  icons: {
    icon: [
      { url: "/icons/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/icons/icon-32x32.png",
  },
  
  // Маніфест
  manifest: "/manifest.json",
  
  // Альтернативні мови
  alternates: {
    canonical: siteUrl,
    languages: {
      'uk': `${siteUrl}`,
      'en': `${siteUrl}/en`,
      'de': `${siteUrl}/de`,
      'pl': `${siteUrl}/pl`,
    },
  },
  
  // Верифікація (додайте свої коди)
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    // other: {
    //   "facebook-domain-verification": "your-fb-code",
    //   "p:domain_verify": "your-pinterest-code",
    // },
  },
  
  // Категорія
  category: "shopping",
  
  // Класифікація
  classification: "Jewelry, Handmade, E-commerce",
  
  // Додаткові мета
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Rune box",
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#660000",
    "msapplication-config": "/browserconfig.xml",
  },
};

// JSON-LD структуровані дані
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      "url": siteUrl,
      "name": "Rune box",
      "description": "Унікальні прикраси ручної роботи за мотивами слов'янської, вікінгської та кельтської культури",
      "publisher": {
        "@id": `${siteUrl}/#organization`
      },
      "potentialAction": [
        {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${siteUrl}/collections?search={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      ],
      "inLanguage": ["uk-UA", "en-US", "de-DE", "pl-PL"]
    },
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      "name": "Rune box",
      "alternateName": ["Rune box", "Rune box Jewelry"],
      "url": siteUrl,
      "logo": {
        "@type": "ImageObject",
        "@id": `${siteUrl}/#logo`,
        "url": `${siteUrl}/images/logo/logo-white-pink-1.png`,
        "contentUrl": `${siteUrl}/images/logo/logo-white-pink-1.png`,
        "width": 512,
        "height": 512,
        "caption": "Rune box"
      },
      "image": { "@id": `${siteUrl}/#logo` },
      "sameAs": [
        "https://www.instagram.com/runebox",
        "https://www.facebook.com/runebox",
        "https://www.pinterest.com/runebox"
      ],
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "+48-xxx-xxx-xxx",
          "contactType": "customer service",
          "availableLanguage": ["Ukrainian", "Polish", "English", "German"],
          "areaServed": ["UA", "PL", "DE", "EU"]
        }
      ]
    },
    {
      "@type": "Store",
      "@id": `${siteUrl}/#store`,
      "name": "Rune box",
      "description": "Інтернет-магазин автентичних прикрас ручної роботи",
      "url": siteUrl,
      "priceRange": "$$",
      "currenciesAccepted": "PLN, EUR, UAH",
      "paymentAccepted": "Credit Card, PayPal, Bank Transfer",
      "areaServed": {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": "52.2297",
          "longitude": "21.0122"
        },
        "geoRadius": "5000"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Колекції прикрас",
        "itemListElement": [
          {
            "@type": "OfferCatalog",
            "name": "Українські прикраси",
            "itemListElement": []
          },
          {
            "@type": "OfferCatalog",
            "name": "Вікінгські прикраси",
            "itemListElement": []
          },
          {
            "@type": "OfferCatalog",
            "name": "Кельтські прикраси",
            "itemListElement": []
          }
        ]
      }
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${siteUrl}/#breadcrumb`,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Головна",
          "item": siteUrl
        }
      ]
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" dir="ltr">
      <head>
        {/* Google Tag Manager */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-N5PHQC7W');`,
          }}
        />
        
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-MFMPW8R7KK"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-MFMPW8R7KK');
            `,
          }}
        />
        
        {/* JSON-LD структуровані дані */}
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          strategy="afterInteractive"
        />
        
        {/* Preconnect для швидшого завантаження */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        
        {/* Preload Hero Background Image for better performance */}
        <link
          rel="preload"
          href="/images/hero/hero-gemini.png"
          as="image"
          type="image/png"
        />

        {/* RSS Feed */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Rune box Blog RSS Feed"
          href={`${siteUrl}/api/v1/blog/rss.xml`}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-N5PHQC7W"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <LanguageProvider>
          <CartProvider>
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            <CartDrawerWrapper />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
