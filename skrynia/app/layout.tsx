import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/contexts/CartContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import CartDrawerWrapper from "@/components/cart/CartDrawerWrapper";
import CookieConsent from "@/components/ui/CookieConsent";
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
    default: "Rune Box - Unique Handmade Jewelry",
    template: "%s | Rune Box",
  },
  description: "Create your unique necklace! Handmade jewelry inspired by Slavic, Viking and Celtic cultures. Natural coral and 925 silver.",
  
  // Ключові слова
  keywords: [
    "прикраси ручної роботи",
    "українські прикраси",
    "вікінгські намиста",
    "кельтські прикраси",
    "корал",
    "срібло 925",
    "конструктор намиста",
    "слов'янські прикраси",
    "намисто з коралу",
    "срібні прикраси",
    "етнічні прикраси",
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
    "аутентичні прикраси",
    "подарунок для жінки",
    "ексклюзивні прикраси",
  ],
  
  authors: [{ name: "Rune Box", url: siteUrl }],
  creator: "Rune Box",
  publisher: "Rune Box",
  
  // Форматування
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  
  // Open Graph - для Facebook, Threads, LinkedIn
  // ВАЖЛИВО: Це базові налаштування (fallback) для сторінок без власних метаданих.
  // Сторінки продуктів, категорій, блогу мають власні метадані через generateMetadata().
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Rune Box",
    title: "Rune Box - Unique Handmade Jewelry",
    description: "Discover authentic handmade jewelry inspired by Slavic, Viking and Celtic cultures. Natural coral, 925 silver, unique necklaces crafted with love.",
    images: [
      {
        url: `${siteUrl}/images/hero/hero-gemini.png`,
        width: 1232,
        height: 864,
        alt: "Rune Box - Handmade Slavic, Viking & Celtic Jewelry",
        type: "image/png",
      }
    ],
  },
  
  // Twitter Card - для Twitter/X
  twitter: {
    card: "summary_large_image",
    title: "Rune Box - Unique Handmade Jewelry",
    description: "Discover authentic handmade jewelry inspired by Slavic, Viking and Celtic cultures. Natural coral & 925 silver.",
    images: [`${siteUrl}/images/hero/hero-gemini.png`],
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
    "apple-mobile-web-app-title": "Rune Box",
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
      "name": "Rune Box",
      "description": "Unique handmade jewelry inspired by Slavic, Viking and Celtic cultures",
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
      "inLanguage": ["uk-UA", "en-US", "de-DE", "pl-PL", "sv-SE", "no-NO", "da-DK", "fr-FR"]
    },
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      "name": "Rune Box",
      "alternateName": ["Rune Box", "Rune Box Jewelry"],
      "url": siteUrl,
      "logo": {
        "@type": "ImageObject",
        "@id": `${siteUrl}/#logo`,
        "url": `${siteUrl}/images/logo/logo-white-pink-1.png`,
        "contentUrl": `${siteUrl}/images/logo/logo-white-pink-1.png`,
        "width": 512,
        "height": 512,
        "caption": "Rune Box"
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
          "availableLanguage": ["English", "Polish", "German", "Swedish", "Norwegian", "Danish", "French"],
          "areaServed": "EU"
        }
      ]
    },
    {
      "@type": "Store",
      "@id": `${siteUrl}/#store`,
      "name": "Rune Box",
      "description": "Online store of authentic handmade jewelry",
      "url": siteUrl,
      "priceRange": "$$",
      "currenciesAccepted": "PLN, EUR",
      "paymentAccepted": "Credit Card, PayPal, Bank Transfer",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "ul. Wojciecha Gersona 9/7",
        "addressLocality": "Wrocław",
        "postalCode": "51-664",
        "addressCountry": "PL"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "51.1079",
        "longitude": "17.0385"
      },
      "areaServed": {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": "51.1079",
          "longitude": "17.0385"
        },
        "geoRadius": "5000"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Jewelry Collections",
        "itemListElement": [
          {
            "@type": "OfferCatalog",
            "name": "Slavic Jewelry",
            "itemListElement": []
          },
          {
            "@type": "OfferCatalog",
            "name": "Viking Jewelry",
            "itemListElement": []
          },
          {
            "@type": "OfferCatalog",
            "name": "Celtic Jewelry",
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
          "name": "Home",
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
    <html lang="en" dir="ltr">
      <head>
        {/* Preconnect для швидшого завантаження */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />

        {/* RSS Feed */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Rune Box Blog RSS Feed"
          href={`${siteUrl}/api/v1/blog/rss.xml`}
        />
      </head>
      <body className="min-h-screen flex flex-col">
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
        
        {/* Meta Pixel (Facebook Pixel) */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1552229889398632');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1552229889398632&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        
        {/* JSON-LD структуровані дані */}
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          strategy="afterInteractive"
        />
        
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
            <CookieConsent />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
