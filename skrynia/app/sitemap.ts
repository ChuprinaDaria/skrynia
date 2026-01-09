import { MetadataRoute } from 'next';
import { getApiEndpoint } from '@/lib/api';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://runebox.eu';

const languages = ['', '/en', '/de', '/pl'];

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
      lastModified: product.updated_at || new Date().toISOString(),
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
      lastModified: category.updated_at || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date().toISOString();
  
  // Fetch dynamic data
  const [products, collections] = await Promise.all([
    getProducts(),
    getCollections(),
  ]);
  
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

  // Генеруємо версії для всіх мов
  const allPages: MetadataRoute.Sitemap = [];
  
  [...staticPages, ...collectionPages, ...productPages].forEach((page) => {
    languages.forEach((lang) => {
      allPages.push({
        ...page,
        url: lang ? `${page.url}${lang}` : page.url,
        alternates: {
          languages: {
            uk: page.url,
            en: `${page.url}/en`,
            de: `${page.url}/de`,
            pl: `${page.url}/pl`,
          },
        },
      });
    });
  });

  return allPages;
}

