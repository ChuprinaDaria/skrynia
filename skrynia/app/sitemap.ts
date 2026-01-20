import { MetadataRoute } from 'next';
import { getApiEndpoint } from '@/lib/api';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://runebox.eu';

// Багатомовність реалізована через клієнтський контекст, не через окремі маршрути
// Тому не створюємо окремі URL для кожної мови

// Fetch products from API
// IMPORTANT: crawlers hit the public site; they cannot resolve Docker-internal names.
// Use public domain fallback for sitemap generation
async function getProducts() {
  try {
    // Priority order: BACKEND_URL (internal) -> getApiEndpoint -> public domain
    const candidateEndpoints: string[] = [];
    if (process.env.BACKEND_URL) {
      candidateEndpoints.push(`${process.env.BACKEND_URL.replace(/\/+$/, '')}/api/v1/products?is_active=true&limit=1000`);
    }
    candidateEndpoints.push(getApiEndpoint('/api/v1/products?is_active=true&limit=1000'));
    // Always include public-domain fallback (works for bots even if internal networking doesn't)
    candidateEndpoints.push(`${siteUrl}/api/v1/products?is_active=true&limit=1000`);
    
    let products: any[] = [];
    for (const endpoint of candidateEndpoints) {
      try {
        const response = await fetch(endpoint, {
          next: { revalidate: 3600 }, // Revalidate every hour
          signal: AbortSignal.timeout(10000), // 10 second timeout
        });
        
        if (response.ok) {
          products = await response.json();
          break; // Success, exit loop
        }
      } catch (error) {
        // Try next endpoint
        continue;
      }
    }
    
    if (products.length === 0) {
      console.error('Failed to fetch products for sitemap from all endpoints');
      return [];
    }
    
    return products.map((product: any) => ({
      slug: product.slug,
      lastModified: product.updated_at 
        ? new Date(product.updated_at).toISOString()
        : new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
    return [];
  }
}

// Fetch categories/collections from API
async function getCollections() {
  try {
    // Priority order: BACKEND_URL (internal) -> getApiEndpoint -> public domain
    const candidateEndpoints: string[] = [];
    if (process.env.BACKEND_URL) {
      candidateEndpoints.push(`${process.env.BACKEND_URL.replace(/\/+$/, '')}/api/v1/categories`);
    }
    candidateEndpoints.push(getApiEndpoint('/api/v1/categories'));
    // Always include public-domain fallback (works for bots even if internal networking doesn't)
    candidateEndpoints.push(`${siteUrl}/api/v1/categories`);
    
    let categories: any[] = [];
    for (const endpoint of candidateEndpoints) {
      try {
        const response = await fetch(endpoint, {
          next: { revalidate: 3600 }, // Revalidate every hour
          signal: AbortSignal.timeout(10000), // 10 second timeout
        });
        
        if (response.ok) {
          categories = await response.json();
          break; // Success, exit loop
        }
      } catch (error) {
        // Try next endpoint
        continue;
      }
    }
    
    if (categories.length === 0) {
      console.error('Failed to fetch categories for sitemap from all endpoints');
      return [];
    }
    
    return categories.map((category: any) => ({
      slug: category.slug,
      lastModified: category.updated_at 
        ? new Date(category.updated_at).toISOString()
        : new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date().toISOString();
  
  // Fetch dynamic data with error handling
  let products: { slug: string; lastModified: string }[] = [];
  let collections: { slug: string; lastModified: string }[] = [];
  
  try {
    [products, collections] = await Promise.all([
      getProducts(),
      getCollections(),
    ]);
  } catch (error) {
    console.error('Error fetching sitemap data:', error);
    // Continue with empty arrays if fetch fails
  }
  
  // Статичні сторінки
  const staticPages = [
    {
      url: siteUrl,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${siteUrl}/collections`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${siteUrl}/shipping`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ];

  // Сторінки колекцій
  const collectionPages = collections.map((collection: { slug: string; lastModified: string }) => ({
    url: `${siteUrl}/collections/${collection.slug}`,
    lastModified: collection.lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Сторінки продуктів
  const productPages = products.map((product: { slug: string; lastModified: string }) => ({
    url: `${siteUrl}/products/${product.slug}`,
    lastModified: product.lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Об'єднуємо всі сторінки (без дублікатів для мов, оскільки багатомовність через клієнтський контекст)
  const allPages: MetadataRoute.Sitemap = [
    ...staticPages,
    ...collectionPages,
    ...productPages,
  ];

  // Повертаємо sitemap без alternates, оскільки всі мови використовують той самий URL
  // Hreflang буде оброблятися через мета-теги на сторінках
  return allPages;
}

