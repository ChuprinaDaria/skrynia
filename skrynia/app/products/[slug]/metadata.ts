import type { Metadata } from 'next';
import { getApiEndpoint, getApiUrl } from '@/lib/api';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://runebox.eu';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    // Fetch product data from API
    const apiEndpoint = getApiEndpoint(`/api/v1/products/${slug}`);
    const res = await fetch(apiEndpoint, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (res.ok) {
      const product = await res.json();
      
      // Get first image (primary or first in array)
      const firstImage = product.images?.find((img: any) => img.is_primary) || product.images?.[0];
      let ogImage = `${siteUrl}/images/logo/logo-white-pink-1.png`; // Fallback to logo
      
      if (firstImage?.image_url) {
        const imageUrl = firstImage.image_url;
        // Handle both absolute URLs and relative paths
        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
          ogImage = imageUrl;
        } else if (imageUrl.startsWith('/static/') || imageUrl.startsWith('/uploads/')) {
          // Backend static files
          const backendBase = getApiUrl().replace(/\/api$/, '').replace(/\/$/, '');
          ogImage = `${backendBase}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
        } else {
          // Frontend public images
          ogImage = `${siteUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
        }
      }

      // Use English description if available, otherwise Ukrainian
      // Remove markdown formatting for cleaner description
      let description = product.description_en || product.description_uk || 'Unique handmade jewelry from Rune Box';
      description = description
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
        .replace(/#+\s*/g, '')
        .trim();
      
      const title = product.title_en || product.title_uk || 'Product';
      const price = product.price || 0;
      const currency = product.currency || 'EUR';
      const priceCurrency = currency === 'zł' ? 'PLN' : currency;
      
      // Generate multilingual titles and descriptions
      const titleUk = product.title_uk || title;
      const titleEn = product.title_en || titleUk;
      const titleDe = product.title_de || titleEn;
      const titlePl = product.title_pl || titleEn;
      const titleSe = product.title_se || titleEn;
      const titleNo = product.title_no || titleEn;
      const titleDk = product.title_dk || titleEn;
      const titleFr = product.title_fr || titleEn;

      const descUk = product.description_uk || description;
      const descEn = product.description_en || descUk;
      const descDe = product.description_de || descEn;
      const descPl = product.description_pl || descEn;
      const descSe = product.description_se || descEn;
      const descNo = product.description_no || descEn;
      const descDk = product.description_dk || descEn;
      const descFr = product.description_fr || descEn;

      return {
        title: `${title} | Rune Box`,
        description: description.substring(0, 160), // Limit to 160 chars for SEO
        keywords: [
          'handmade jewelry',
          'slavic jewelry',
          'viking jewelry',
          'celtic jewelry',
          'silver jewelry',
          'coral necklace',
          product.title_en || product.title_uk,
        ],
        openGraph: {
          title: `${title} | Rune Box`,
          description: description.substring(0, 200),
          url: `${siteUrl}/products/${slug}`,
          type: 'website', // Next.js doesn't support 'product' type, using 'website' with product tags in 'other'
          siteName: 'Rune Box',
          locale: 'en_US',
          images: [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: title,
            },
          ],
        },
        twitter: {
          card: 'summary_large_image',
          title: `${title} | Rune Box`,
          description: description.substring(0, 200),
          images: [ogImage],
          creator: '@runebox',
          site: '@runebox',
        },
        // Threads support (uses same OG tags as Facebook, but we add explicit see_also)
        alternates: {
          canonical: `${siteUrl}/products/${slug}`,
          languages: {
            'uk': `${siteUrl}/products/${slug}`,
            'en': `${siteUrl}/products/${slug}`,
            'de': `${siteUrl}/products/${slug}`,
            'pl': `${siteUrl}/products/${slug}`,
            'sv': `${siteUrl}/products/${slug}`, // Swedish
            'no': `${siteUrl}/products/${slug}`, // Norwegian
            'da': `${siteUrl}/products/${slug}`, // Danish
            'fr': `${siteUrl}/products/${slug}`, // French
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
        // Additional meta tags for product-specific OG properties
        other: {
          // Override og:type to product (Next.js doesn't support it directly)
          'og:type': 'product',
          // Product price and currency for OG
          ...(price > 0 && {
            'product:price:amount': price.toFixed(2),
            'product:price:currency': priceCurrency,
            'product:availability': product.stock_quantity ? 'in stock' : 'preorder',
            'product:condition': 'new',
          }),
          // Threads-specific (uses OG but can add see_also)
          'og:see_also': siteUrl,
        },
      };
    }
  } catch (error) {
    console.error('Failed to fetch product metadata:', error);
  }

  // Fallback metadata if product not found
  return {
    title: 'Product | Rune Box',
    description: 'Unique handmade jewelry from Rune Box',
    openGraph: {
      title: 'Product | Rune Box',
      description: 'Unique handmade jewelry from Rune Box',
      url: `${siteUrl}/products/${slug}`,
      type: 'website',
      siteName: 'Rune Box',
      locale: 'en_US',
      images: [
        {
          url: `${siteUrl}/images/logo/logo-white-pink-1.png`,
          width: 1200,
          height: 630,
          alt: 'Rune Box',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Product | Rune Box',
      description: 'Unique handmade jewelry from Rune Box',
      images: [`${siteUrl}/images/logo/logo-white-pink-1.png`],
      creator: '@runebox',
      site: '@runebox',
    },
    alternates: {
      canonical: `${siteUrl}/products/${slug}`,
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
      'og:type': 'product',
      'og:see_also': siteUrl,
    },
  };
}

