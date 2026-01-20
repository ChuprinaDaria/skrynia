import { MetadataRoute } from 'next';
import { getApiEndpoint } from '@/lib/api';

export const dynamic = 'force-dynamic';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://runebox.eu';

// Багатомовність реалізована через клієнтський контекст, не через окремі маршрути
// Тому не створюємо окремі URL для кожної мови, а використовуємо alternates для hreflang

// Fetch products from API
async function getProducts() {
  try {
    const response = await fetch(getApiEndpoint('/api/v1/products?is_active=true&limit=1000'), {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!response.ok) {
      console.error('Failed to fetch products for sitemap');
      return [];
    }
    
    const products = await response.json();
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
    const response = await fetch(getApiEndpoint('/api/v1/categories'), {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!response.ok) {
      console.error('Failed to fetch categories for sitemap');
      return [];
    }
    
    const categories = await response.json();
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

  // Додаємо alternates для hreflang (для пошукових систем, але не створюємо окремі URL)
  return allPages.map((page) => ({
    ...page,
    alternates: {
      languages: {
        uk: page.url,
        en: page.url, // Той самий URL, мова визначається клієнтським контекстом
        de: page.url,
        pl: page.url,
        sv: page.url, // Swedish
        no: page.url, // Norwegian
        da: page.url, // Danish
        fr: page.url, // French
      },
    },
  }));
}

