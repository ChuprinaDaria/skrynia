import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getApiEndpoint, normalizeImageUrl } from '@/lib/api';

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
      
      // Get first image (primary or first in array) - ВАЖЛИВО: використовуємо зображення продукту, НЕ fallback
      const firstImage = product.images?.find((img: any) => img.is_primary) || product.images?.[0];
      let ogImage: string | null = null;
      
      // Get the raw image URL from product
      const rawImageUrl = firstImage?.image_url || product.primary_image;
      
      if (rawImageUrl) {
        // For OG images, always use public site URL to ensure crawlers can access them
        // nginx proxies /static/ to backend, so we can use siteUrl for static files
        if (rawImageUrl.startsWith('http://') || rawImageUrl.startsWith('https://')) {
          // Already absolute URL - use as is (but ensure HTTPS in production)
          ogImage = rawImageUrl;
          if (process.env.NODE_ENV === 'production' && ogImage && ogImage.startsWith('http://') && ogImage.includes('runebox.eu')) {
            ogImage = ogImage.replace('http://', 'https://');
          }
        } else if (rawImageUrl.startsWith('/static/') || rawImageUrl.startsWith('/uploads/')) {
          // Static files: use public site URL (nginx proxies /static/ to backend)
          ogImage = `${siteUrl}${rawImageUrl}`;
        } else if (rawImageUrl.startsWith('/')) {
          // Frontend public assets
          ogImage = `${siteUrl}${rawImageUrl}`;
        } else {
          // Relative path
          ogImage = `${siteUrl}/${rawImageUrl}`;
        }
      }
      
      // Fallback to logo if no product image or placeholder
      if (!ogImage || ogImage.includes('/images/products/placeholder.jpg')) {
        ogImage = `${siteUrl}/images/logo/logo-white-pink-1.png`;
      }
      
      // Log OG image URL for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Metadata] OG Image URL for ${slug}:`, ogImage);
        console.log(`[Metadata] Raw image URL:`, rawImageUrl);
      }
      
      // ВАЖЛИВО: Всі дані беруться БЕЗПОСЕРЕДНЬО з продукту, БЕЗ fallback на layout
      
      // Title - з продукту
      const title = product.title_en || product.title_uk || `Product ${slug}`;
      if (!product.title_en && !product.title_uk) {
        console.error(`[Metadata] Product ${slug} has no title, using fallback`);
      }
      
      // Description - з продукту, очищаємо markdown
      let description = product.description_en || product.description_uk;
      if (!description) {
        // Якщо немає опису, створюємо базовий на основі назви та матеріалів
        const materials = product.materials?.join(', ') || 'premium materials';
        description = `${title}. Handmade jewelry with ${materials}. Unique design inspired by ancient cultures.`;
      } else {
        // Очищаємо markdown та HTML
        description = description
          .replace(/\*\*/g, '') // Bold markdown
          .replace(/\*/g, '') // Italic markdown
          .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Links [text](url) -> text
          .replace(/#+\s*/g, '') // Headers
          .replace(/<[^>]+>/g, '') // HTML tags
          .replace(/\n+/g, ' ') // Newlines to spaces
          .replace(/\s+/g, ' ') // Multiple spaces to single space
          .trim();
      }

      // Facebook/Meta warning: keep description >= 100 chars
      if (description.length < 100) {
        const materials = product.materials?.join(', ') || 'premium materials';
        description = `${description} Handmade jewelry with ${materials}. Authentic design by Rune Box.`;
      }
      
      // Helper function to truncate at word boundary
      const truncateAtWord = (text: string, maxLength: number): string => {
        if (text.length <= maxLength) return text;
        const truncated = text.substring(0, maxLength);
        const lastSpace = truncated.lastIndexOf(' ');
        return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
      };
      
      // Price та currency - з продукту
      const price = product.price ?? 0;
      const currency = product.currency || 'EUR';
      const priceCurrency = currency === 'zł' ? 'PLN' : currency;
      
      // Keywords - з продукту (meta_keywords або tags)
      const productKeywords = product.meta_keywords || 
        (product.tags_en && Array.isArray(product.tags_en) ? product.tags_en : []) ||
        (product.tags_uk && Array.isArray(product.tags_uk) ? product.tags_uk : []) ||
        [];
      
      // Materials - з продукту
      const materials = product.materials || [];
      
      // Category - з продукту
      const categoryName = product.category_id === 1 ? 'slavic' : 
                          product.category_id === 2 ? 'viking' : 
                          product.category_id === 3 ? 'celtic' : 'jewelry';
      
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

      // ВАЖЛИВО: Використовуємо ПРЯМУ URL зображення продукту як основне OG зображення
      // Це краще працює з LinkedIn, Meta, Facebook, Threads
      // Динамічний opengraph-image маршрут залишається як fallback
      const ogImageUrl = ogImage; // Use direct product image URL
      const ogImageFallback = `${siteUrl}/products/${slug}/opengraph-image`; // Fallback to generated image
      
      // ВАЖЛИВО: Всі метадані беруться з продукту, БЕЗ fallback на layout
      return {
        title: `${title} | Rune Box`,
        description: truncateAtWord(description, 160), // Limit to 160 chars for SEO, truncate at word boundary
        keywords: [
          ...productKeywords,
          'handmade jewelry',
          categoryName === 'slavic' ? 'slavic jewelry' : '',
          categoryName === 'viking' ? 'viking jewelry' : '',
          categoryName === 'celtic' ? 'celtic jewelry' : '',
          ...(materials.includes('silver') || materials.includes('срібло') ? ['silver jewelry'] : []),
          ...(materials.includes('coral') || materials.includes('корал') ? ['coral necklace'] : []),
          title,
        ].filter(Boolean),
        openGraph: {
          title: `${title} | Rune Box`,
          description: truncateAtWord(description, 200), // Limit to 200 chars for OG, truncate at word boundary
          url: `${siteUrl}/products/${slug}`,
          type: 'website', // Next.js Metadata doesn't support 'product' type, but we set 'og:type': 'product' in 'other' field
          siteName: 'Rune Box',
          locale: 'en_US',
          images: [
            {
              // Use direct product image URL (primary) - better for LinkedIn, Meta, Facebook, Threads
              // LinkedIn recommends 1200x630 minimum, but 1600x840 is optimal
              url: ogImageUrl,
              width: 1600,
              height: 840,
              alt: title,
            },
            {
              // Fallback to generated opengraph-image
              url: ogImageFallback,
              width: 1600,
              height: 840,
              alt: title,
            },
          ],
        },
        twitter: {
          card: 'summary_large_image',
          title: `${title} | Rune Box`,
          description: truncateAtWord(description, 200), // Limit to 200 chars for Twitter, truncate at word boundary
          images: [ogImageUrl], // Use direct product image
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
        // ВАЖЛИВО: НЕ додаємо og:image* в other - Next.js вже додає їх через openGraph.images з property="og:image"
        // Додаємо тільки специфічні теги, які Next.js не підтримує напряму
        other: {
          // Product price and currency for OG (не підтримується Next.js напряму)
          ...(price > 0 && {
            'product:price:amount': price.toFixed(2),
            'product:price:currency': priceCurrency,
            'product:availability': product.stock_quantity ? 'in stock' : 'preorder',
            'product:condition': 'new',
          }),
          // Threads-specific (uses OG but can add see_also)
          'og:see_also': siteUrl,
          // Facebook & LinkedIn support
          'article:publisher': 'https://www.facebook.com/runebox',
          // Next.js підтримує тільки 'website' і 'article', тому 'product' має бути в other
          'og:type': 'product', // Explicit OG type
        },
      };
    }
    
    // ВАЖЛИВО: Якщо продукт не знайдено, використовуємо notFound() - БЕЗ fallback метаданих
    // Всі дані мають братися динамічно з продукту, без fallback
    console.error(`[Metadata] ❌ Product ${slug} not found - calling notFound()`);
    notFound();
  } catch (error) {
    // ВАЖЛИВО: Якщо помилка при отриманні продукту, використовуємо notFound() - БЕЗ fallback метаданих
    // Всі дані мають братися динамічно з продукту, без fallback
    console.error(`[Metadata] ❌ Failed to fetch product ${slug} metadata:`, error);
    console.error(`[Metadata] ❌ Product ${slug} error - calling notFound()`);
    notFound();
  }
}

