import type { Metadata } from 'next';
import { getApiEndpoint } from '@/lib/api';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://runebox.eu';

export const runtime = 'nodejs';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    // Fetch product data from API.
    // IMPORTANT: crawlers hit the public site; they cannot resolve Docker-internal names.
    // Priority order:
    // 1) BACKEND_URL (explicit; can be Docker internal like http://backend:8000)
    // 2) NEXT_PUBLIC_API_URL (normalized via getApiEndpoint)
    // 3) siteUrl (nginx proxy on the public domain)
    const candidateEndpoints: string[] = [];
    if (process.env.BACKEND_URL) {
      candidateEndpoints.push(`${process.env.BACKEND_URL.replace(/\/+$/, '')}/api/v1/products/${slug}`);
    }
    // Use normalized API base if configured (works for SSR and local)
    candidateEndpoints.push(getApiEndpoint(`/api/v1/products/${slug}`));
    // Always include public-domain fallback (works for bots even if internal networking doesn't)
    candidateEndpoints.push(`${siteUrl}/api/v1/products/${slug}`);
    
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    let res;
    try {
      // Try endpoints sequentially until one succeeds.
      res = null as any;
      let lastError: any = null;
      for (const apiEndpoint of candidateEndpoints) {
        try {
          const attempt = await fetch(apiEndpoint, {
            next: { revalidate: 3600 }, // Revalidate every hour
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; FacebookBot/1.0; +https://www.facebook.com/help/crawler)',
              'Accept': 'application/json',
            },
            signal: controller.signal,
          });
          if (attempt.ok) {
            res = attempt;
            break;
          }
          // Keep last non-OK attempt to log status if all fail
          res = attempt;
        } catch (e: any) {
          lastError = e;
        }
      }
      clearTimeout(timeoutId);
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        console.error(`[Metadata] Product ${slug} fetch timeout`);
      } else {
        console.error(`[Metadata] Product ${slug} fetch error:`, fetchError.message);
      }
      // Continue to fallback metadata below
      res = null;
    }

    // Log response status
    if (res) {
      if (!res.ok) {
        console.error(`[Metadata] ❌ API returned error ${res.status} for ${slug}`);
        const errorText = await res.text().catch(() => 'Could not read error body');
        console.error(`[Metadata] Error body:`, errorText.substring(0, 200));
      }
    } else {
      console.error(`[Metadata] ❌ No response from API for ${slug}`);
    }
    
    if (res && res.ok) {
      const product = await res.json();
      
      // Log success
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Metadata] ✅ Successfully fetched product ${slug}:`, product.title_uk || product.title_en);
        console.log(`[Metadata] Product has ${product.images?.length || 0} images`);
      }
      
      // Get first image (primary or first in array)
      const firstImage = product.images?.find((img: any) => img.is_primary) || product.images?.[0];
      let ogImage = `${siteUrl}/images/logo/logo-white-pink-1.png`; // Fallback to logo
      
      if (firstImage?.image_url) {
        const imageUrl = firstImage.image_url;
        // Handle both absolute URLs and relative paths
        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
          ogImage = imageUrl;
        } else {
          // Backend static files OR frontend public images.
          // Prefer normalized API base to ensure absolute URL for crawlers.
          const apiBase = getApiEndpoint('/api/v1/health').replace(/\/api\/v1\/health$/, '');
          ogImage = `${apiBase}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
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

      // Facebook/Meta warning: keep description >= 100 chars
      if (description.length < 100) {
        description = `${description} Discover authentic handmade jewelry by Rune Box: premium materials, unique symbolism, and fast EU delivery.`;
      }
      
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

      const ogImageUrl = `${siteUrl}/products/${slug}/opengraph-image`;
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
          type: 'product',
          siteName: 'Rune Box',
          locale: 'en_US',
          images: [
            {
              // Use dynamic OG image (>=1600px wide) based on primary product photo
              url: ogImageUrl,
              width: 1600,
              height: 840,
              alt: title,
            },
          ],
        },
        twitter: {
          card: 'summary_large_image',
          title: `${title} | Rune Box`,
          description: description.substring(0, 200),
          images: [ogImageUrl],
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
          // Prefer a large OG image for Meta/Threads
          'og:image': ogImageUrl,
          'og:image:width': '1600',
          'og:image:height': '840',
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
    // Log error but don't throw - always return fallback metadata
    console.error(`[Metadata] Failed to fetch product ${slug} metadata:`, error);
    console.error(`[Metadata] Using fallback metadata for ${slug}`);
    // Continue to fallback metadata below
  }

  // Fallback metadata if product not found
  console.error(`[Metadata] ⚠️ Using FALLBACK metadata for ${slug} - API request failed or product not found`);
  const fallbackDescription =
    'Unique handmade jewelry from Rune Box. Explore authentic designs inspired by Slavic, Viking and Celtic cultures with premium natural materials.';
  return {
    title: 'Product | Rune Box',
    description: fallbackDescription,
    openGraph: {
      title: 'Product | Rune Box',
      description: fallbackDescription,
      url: `${siteUrl}/products/${slug}`,
      type: 'product',
      siteName: 'Rune Box',
      locale: 'en_US',
      images: [
        {
          url: `${siteUrl}/images/logo/logo-white-pink-1.png`,
          width: 1600,
          height: 840,
          alt: 'Rune Box',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Product | Rune Box',
      description: fallbackDescription,
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
      'og:see_also': siteUrl,
    },
  };
}

