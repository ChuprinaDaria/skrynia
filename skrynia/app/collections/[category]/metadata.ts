import type { Metadata } from 'next';
import { getApiEndpoint } from '@/lib/api';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://runebox.eu';

const categoryNames: Record<string, { uk: string; en: string; de: string; pl: string }> = {
  slavic: {
    uk: 'Слов\'янські Прикраси',
    en: 'Slavic Jewelry',
    de: 'Slawischer Schmuck',
    pl: 'Biżuteria Słowiańska',
  },
  viking: {
    uk: 'Вікінгські Прикраси',
    en: 'Viking Jewelry',
    de: 'Wikinger-Schmuck',
    pl: 'Biżuteria Wikingów',
  },
  celtic: {
    uk: 'Кельтські Прикраси',
    en: 'Celtic Jewelry',
    de: 'Keltischer Schmuck',
    pl: 'Biżuteria Celtycka',
  },
};

const categoryDescriptions: Record<string, { uk: string; en: string; de: string; pl: string }> = {
  slavic: {
    uk: 'Унікальні слов\'янські прикраси ручної роботи. Намиста, браслети та підвіски з символікою давніх слов\'ян.',
    en: 'Unique handmade Slavic jewelry. Necklaces, bracelets and pendants with ancient Slavic symbolism.',
    de: 'Einzigartiger handgefertigter slawischer Schmuck. Halsketten, Armbänder und Anhänger mit alter slawischer Symbolik.',
    pl: 'Unikalna ręcznie robiona biżuteria słowiańska. Naszyjniki, bransoletki i zawieszki z symboliką starożytnych Słowian.',
  },
  viking: {
    uk: 'Автентичні вікінгські прикраси ручної роботи. Намиста та браслети з традиційними вікінгськими мотивами.',
    en: 'Authentic handmade Viking jewelry. Necklaces and bracelets with traditional Viking motifs.',
    de: 'Authentischer handgefertigter Wikinger-Schmuck. Halsketten und Armbänder mit traditionellen Wikinger-Motiven.',
    pl: 'Autentyczna ręcznie robiona biżuteria wikingów. Naszyjniki i bransoletki z tradycyjnymi motywami wikingów.',
  },
  celtic: {
    uk: 'Кельтські прикраси ручної роботи з унікальними орнаментами. Намиста, браслети та підвіски з кельтською символікою.',
    en: 'Handmade Celtic jewelry with unique ornaments. Necklaces, bracelets and pendants with Celtic symbolism.',
    de: 'Handgefertigter keltischer Schmuck mit einzigartigen Ornamenten. Halsketten, Armbänder und Anhänger mit keltischer Symbolik.',
    pl: 'Ręcznie robiona biżuteria celtycka z unikalnymi ornamentami. Naszyjniki, bransoletki i zawieszki z symboliką celtycką.',
  },
};

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  
  const validCategories = ['slavic', 'viking', 'celtic'];
  if (!category || !validCategories.includes(category)) {
    return {
      title: 'Category Not Found | Rune Box',
      description: 'Category page not found',
    };
  }

  const categoryInfo = categoryNames[category];
  const categoryDesc = categoryDescriptions[category];
  
  const title = `${categoryInfo.en} | Rune Box`;
  const description = categoryDesc.en;

  // ВАЖЛИВО: Отримуємо зображення з продуктів категорії, НЕ fallback з layout
  let ogImage: string | null = null;
  try {
    // Спробуємо отримати продукт з конкретної категорії
    const categoryMap: Record<string, number> = {
      slavic: 1,
      viking: 2,
      celtic: 3,
    };
    const categoryId = categoryMap[category];
    const apiEndpoint = getApiEndpoint(`/api/v1/products?is_active=true&category_id=${categoryId}&limit=1`);
    const res = await fetch(apiEndpoint, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const products = await res.json();
      if (products.length > 0) {
        // Перевіряємо images array спочатку
        const product = products[0];
        const firstImage = product.images?.find((img: any) => img.is_primary) || product.images?.[0];
        const imageUrl = firstImage?.image_url || product.primary_image;
        
        if (imageUrl) {
          if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
            ogImage = imageUrl;
          } else if (imageUrl.startsWith('/static/') || imageUrl.startsWith('/uploads/')) {
            const backendBase = getApiEndpoint('').replace(/\/api\/v1$/, '').replace(/\/$/, '');
            ogImage = `${backendBase}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
          } else {
            ogImage = `${siteUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
          }
        }
      }
    }
  } catch (error) {
    console.error('Failed to fetch category image:', error);
  }
  
  // Якщо не знайдено зображення з категорії, використовуємо fallback
  // Але це має бути рідкісний випадок
  if (!ogImage) {
    ogImage = `${siteUrl}/images/logo/logo-white-pink-1.png`;
  }

  return {
    title,
    description: description.substring(0, 160),
    keywords: [
      categoryInfo.en.toLowerCase(),
      'handmade jewelry',
      'jewelry collection',
      'silver jewelry',
      'coral necklace',
      category === 'slavic' ? 'slavic symbols' : '',
      category === 'viking' ? 'viking motifs' : '',
      category === 'celtic' ? 'celtic ornaments' : '',
    ].filter(Boolean),
    openGraph: {
      title,
      description: description.substring(0, 200),
      url: `${siteUrl}/collections/${category}`,
      type: 'website',
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
      title,
      description: description.substring(0, 200),
      images: [ogImage],
      creator: '@runebox',
      site: '@runebox',
    },
    alternates: {
      canonical: `${siteUrl}/collections/${category}`,
      languages: {
        'uk': `${siteUrl}/collections/${category}`,
        'en': `${siteUrl}/collections/${category}`,
        'de': `${siteUrl}/collections/${category}`,
        'pl': `${siteUrl}/collections/${category}`,
        'sv': `${siteUrl}/collections/${category}`,
        'no': `${siteUrl}/collections/${category}`,
        'da': `${siteUrl}/collections/${category}`,
        'fr': `${siteUrl}/collections/${category}`,
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
    other: {
      'og:see_also': siteUrl, // Threads support
      'og:type': 'website', // Explicit OG type
      'article:publisher': 'https://www.facebook.com/runebox', // Facebook page
      'article:author': 'Rune Box', // LinkedIn support
    },
  };
}

