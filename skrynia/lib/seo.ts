import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://runebox.eu';
const siteName = 'Rune Box';

// Типи для SEO
export interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  path?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  locale?: string;
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
}

export interface ProductSEOProps {
  name: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  category: string;
  slug: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  sku?: string;
  brand?: string;
  materials?: string[];
}

// Генерація metadata для сторінок
export function generatePageMetadata({
  title,
  description,
  keywords = [],
  path = '',
  image,
  type = 'website',
  locale = 'uk_UA',
  noindex = false,
  publishedTime,
  modifiedTime,
}: SEOProps): Metadata {
  const url = `${siteUrl}${path}`;
  const ogImage = image || `${siteUrl}/images/og/og-image.jpg`;

  return {
    title,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    
    openGraph: {
      title,
      description,
      url,
      siteName,
      locale,
      type: type === 'product' ? 'website' : type,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    
    alternates: {
      canonical: url,
      languages: {
        'uk': url,
        'en': `${url}${path ? '' : '/'}en`,
        'de': `${url}${path ? '' : '/'}de`,
        'pl': `${url}${path ? '' : '/'}pl`,
      },
    },
    
    robots: noindex ? {
      index: false,
      follow: false,
    } : {
      index: true,
      follow: true,
    },
  };
}

// JSON-LD для продукту
export function generateProductJsonLd({
  name,
  description,
  price,
  currency,
  images,
  category,
  slug,
  availability = 'InStock',
  sku,
  brand = 'Rune box',
  materials = [],
}: ProductSEOProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: images.map((img) => `${siteUrl}${img}`),
    sku: sku || slug,
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    category,
    material: materials.join(', '),
    isHandmade: true,
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}/products/${slug}`,
      priceCurrency: currency === 'zł' ? 'PLN' : currency,
      price: price.toFixed(2),
      availability: `https://schema.org/${availability}`,
      seller: {
        '@type': 'Organization',
        name: brand,
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'],
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 2,
            maxValue: 7,
            unitCode: 'DAY',
          },
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 14,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '47',
      bestRating: '5',
      worstRating: '1',
    },
  };
}

// JSON-LD для колекції
export function generateCollectionJsonLd(
  name: string,
  description: string,
  slug: string,
  products: { name: string; price: number; image: string; slug: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url: `${siteUrl}/collections/${slug}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: products.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: product.name,
          url: `${siteUrl}/products/${product.slug}`,
          image: `${siteUrl}${product.image}`,
          offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'PLN',
          },
        },
      })),
    },
  };
}

// JSON-LD для FAQ
export function generateFAQJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// JSON-LD для локального бізнесу
export function generateLocalBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'JewelryStore',
    name: siteName,
    image: `${siteUrl}/images/logo/logo-white-pink-1.png`,
    '@id': `${siteUrl}/#store`,
    url: siteUrl,
    telephone: '+48-xxx-xxx-xxx',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '',
      addressLocality: 'Warszawa',
      postalCode: '',
      addressCountry: 'PL',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 52.2297,
      longitude: 21.0122,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '14:00',
      },
    ],
    sameAs: [
      'https://www.instagram.com/skrynia_pani_darii',
      'https://www.facebook.com/skrynia',
    ],
  };
}

// JSON-LD для хлібних крихт
export function generateBreadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.url}`,
    })),
  };
}

