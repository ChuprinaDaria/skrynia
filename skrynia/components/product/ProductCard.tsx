'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { useLanguage } from '@/contexts/LanguageContext';

export interface Product {
  id: string;
  title: string;
  titleEn?: string;
  titleUk?: string;
  titleDe?: string;
  titlePl?: string;
  titleSe?: string;
  titleNo?: string;
  titleDk?: string;
  titleFr?: string;
  price: number;
  currency: string;
  image: string;
  images?: string[];
  category: 'slavic' | 'viking' | 'celtic';
  materials: string[];
  isHandmade?: boolean;
  slug: string;
}

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, priority = false }) => {
  const { t, language } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  // Get product title based on current language - use useMemo to ensure it updates when language changes
  const displayTitle = useMemo(() => {
    switch (language) {
      case 'EN':
        return product.titleEn || product.titleUk || product.title;
      case 'DE':
        return product.titleDe || product.titleEn || product.titleUk || product.title;
      case 'PL':
        return product.titlePl || product.titleEn || product.titleUk || product.title;
      case 'SE':
        return product.titleSe || product.titleEn || product.titleUk || product.title;
      case 'NO':
        return product.titleNo || product.titleEn || product.titleUk || product.title;
      case 'DK':
        return product.titleDk || product.titleEn || product.titleUk || product.title;
      case 'FR':
        return product.titleFr || product.titleEn || product.titleUk || product.title;
      default:
        return product.titleUk || product.title;
    }
  }, [language, product.titleEn, product.titleUk, product.titleDe, product.titlePl, product.titleSe, product.titleNo, product.titleDk, product.titleFr, product.title]);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://runebox.eu';
  const productUrl = `${siteUrl}/products/${product.slug}`;
  
  // Generate JSON-LD structured data for SEO
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: displayTitle,
    description: `${displayTitle} - ${product.materials.join(', ')}. ${product.isHandmade ? t.common.handmade : ''}`,
    image: product.image,
    sku: product.slug,
    brand: {
      '@type': 'Brand',
      name: 'Rune Box',
    },
    category: product.category === 'slavic' ? 'Slavic Jewelry' : 
              product.category === 'viking' ? 'Viking Jewelry' : 
              'Celtic Jewelry',
    material: product.materials.join(', '),
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: product.currency === 'zł' ? 'PLN' : product.currency,
      price: product.price.toString(),
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'Rune Box',
      },
    },
  };

  return (
    <>
      {/* JSON-LD structured data for SEO */}
      <Script
        id={`product-jsonld-${product.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        strategy="afterInteractive"
      />
      <Link href={`/products/${product.slug}`}>
        <article
          className="group card-lift cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
        {/* Image Container */}
        <div className="relative aspect-square bg-deep-black overflow-hidden rounded-sm border border-transparent group-hover:border-oxblood transition-all duration-300">
          <Image
            src={product.image}
            alt={`${displayTitle} - ${product.materials.join(', ')}. ${product.isHandmade ? t.common.handmade : ''}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover image-zoom"
            priority={priority}
            loading={priority ? "eager" : "lazy"}
          />

          {/* Handmade Badge */}
          {product.isHandmade && (
            <div className="absolute top-3 right-3 z-10" aria-label={t.common.handmade}>
              <div className="bg-oxblood/90 backdrop-blur-sm text-ivory text-xs font-inter font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                {t.common.handmade}
              </div>
            </div>
          )}

          {/* Category Badge (visible on hover) */}
          <div
            className={`absolute bottom-3 left-3 z-10 transition-all duration-300 ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            <span className="bg-deep-black/80 backdrop-blur-sm text-sage text-xs font-inter px-2 py-1 rounded-sm border border-sage/30">
              {product.category === 'slavic' && t.product.categories.slavic}
              {product.category === 'viking' && t.product.categories.viking}
              {product.category === 'celtic' && t.product.categories.celtic}
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="mt-4 space-y-2">
          {/* Title */}
          <h3 className="font-rutenia text-lg text-ivory group-hover:text-oxblood transition-colors duration-300 line-clamp-2">
            {displayTitle}
          </h3>

          {/* Materials */}
          <p className="text-sage text-sm font-inter line-clamp-1">
            {product.materials.join(' • ')}
          </p>

          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="font-inter font-semibold text-sage text-lg">
              {product.price} {product.currency}
            </span>

            {/* View Details Arrow */}
            <div
              className={`text-oxblood transition-transform duration-300 ${
                isHovered ? 'translate-x-1' : ''
              }`}
              aria-hidden="true"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>

          {/* Progressive Discount Info */}
          <div className="text-xs font-inter text-oxblood/80 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            <span>2 {t.common.items} (-10%), 3+ {t.common.items} (-15%)</span>
          </div>
        </div>
      </article>
    </Link>
    </>
  );
};

export default ProductCard;
