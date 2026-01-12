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
          type: 'website',
          siteName: 'Rune Box',
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
        },
        alternates: {
          canonical: `${siteUrl}/products/${slug}`,
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
    },
  };
}

