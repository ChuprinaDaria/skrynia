import { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://skrynia.com';

// В реальному проекті це буде з бази даних
const products = [
  { slug: 'coral-necklace-alatyr', lastModified: '2024-01-08' },
  { slug: 'solar-sign-earrings', lastModified: '2024-01-08' },
  { slug: 'protection-bracelet', lastModified: '2024-01-08' },
  { slug: 'viking-pendant-mjolnir', lastModified: '2024-01-08' },
  { slug: 'viking-bracelet-runes', lastModified: '2024-01-08' },
  { slug: 'celtic-amulet-triquetra', lastModified: '2024-01-08' },
  { slug: 'celtic-bracelet-knots', lastModified: '2024-01-08' },
];

const collections = [
  { slug: 'ukrainian', lastModified: '2024-01-08' },
  { slug: 'viking', lastModified: '2024-01-08' },
  { slug: 'celtic', lastModified: '2024-01-08' },
];

const languages = ['', '/en', '/de', '/pl'];

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString();
  
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
  const collectionPages = collections.map((collection) => ({
    url: `${siteUrl}/collections/${collection.slug}`,
    lastModified: collection.lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Сторінки продуктів
  const productPages = products.map((product) => ({
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

