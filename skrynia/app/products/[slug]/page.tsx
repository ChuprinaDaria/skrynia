import { notFound } from 'next/navigation';
import Script from 'next/script';
import ProductDetailClient from './ProductDetailClient';
import { getApiEndpoint } from '@/lib/api';
import { normalizeImageUrl } from '@/lib/api';

// Export metadata generation
export { generateMetadata } from './metadata';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://runebox.eu';

// This is now a server component that wraps the client component
export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Fetch product data on server for JSON-LD (Facebook Pixel needs it in initial HTML)
  let productJsonLd = null;
  let breadcrumbJsonLd = null;
  
  try {
    // Try to fetch product for JSON-LD (same logic as metadata.ts)
    const candidateEndpoints: string[] = [];
    if (process.env.BACKEND_URL) {
      candidateEndpoints.push(`${process.env.BACKEND_URL.replace(/\/+$/, '')}/api/v1/products/${slug}`);
    }
    candidateEndpoints.push(getApiEndpoint(`/api/v1/products/${slug}`));
    candidateEndpoints.push(`${siteUrl}/api/v1/products/${slug}`);
    
    let product = null;
    for (const endpoint of candidateEndpoints) {
      try {
        const res = await fetch(endpoint, {
          next: { revalidate: 3600 },
          headers: {
            'Accept': 'application/json',
          },
        });
        if (res.ok) {
          product = await res.json();
          break;
        }
      } catch (e) {
        // Try next endpoint
        continue;
      }
    }
    
    if (product) {
      // Generate product JSON-LD
      const productImages = product.images?.map((img: any) => {
        const url = normalizeImageUrl(img.image_url);
        return url.startsWith('http') ? url : `${siteUrl}${url.startsWith('/') ? '' : '/'}${url}`;
      }) || [];
      
      const title = product.title_en || product.title_uk || 'Product';
      const description = (product.description_en || product.description_uk || '').substring(0, 200);
      
      productJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: title,
        description: description,
        image: productImages.length > 0 ? productImages : [`${siteUrl}/images/logo/logo-white-pink-1.png`],
        sku: product.slug,
        mpn: product.id.toString(),
        brand: {
          '@type': 'Brand',
          name: 'Rune Box',
        },
        category: 'Jewelry',
        material: product.materials?.join(', ') || '',
        isHandmade: product.is_handmade ?? true,
        offers: {
          '@type': 'Offer',
          url: `${siteUrl}/products/${product.slug}`,
          priceCurrency: product.currency === 'zł' ? 'PLN' : product.currency,
          price: product.price.toFixed(2),
          priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          availability: product.stock_quantity ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
          itemCondition: 'https://schema.org/NewCondition',
          seller: {
            '@type': 'Organization',
            name: 'Rune Box',
          },
        },
      };
      
      // Generate breadcrumb JSON-LD
      breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Головна',
            item: siteUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Колекції',
            item: `${siteUrl}/collections`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: title,
            item: `${siteUrl}/products/${product.slug}`,
          },
        ],
      };
    }
  } catch (error) {
    // If fetch fails, continue without JSON-LD (client component will add it)
    console.error('[ProductPage] Failed to fetch product for JSON-LD:', error);
  }
  
  return (
    <>
      {/* Server-side JSON-LD for Facebook Pixel (must be in initial HTML) */}
      {productJsonLd && (
        <Script
          id="product-jsonld-server"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
          strategy="beforeInteractive"
        />
      )}
      {breadcrumbJsonLd && (
        <Script
          id="breadcrumb-jsonld-server"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
          strategy="beforeInteractive"
        />
      )}
      <ProductDetailClient slug={slug} />
    </>
  );
}
