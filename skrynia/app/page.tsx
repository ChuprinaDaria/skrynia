'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import Hero from '@/components/layout/Hero';
import CollectionsPreview from '@/components/layout/CollectionsPreview';
import Newsletter from '@/components/layout/Newsletter';
import BonusSystem from '@/components/layout/BonusSystem';
import BlogSection from '@/components/home/BlogSection';
import ProductCard, { Product } from '@/components/product/ProductCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { getApiEndpoint } from '@/lib/api';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://runebox.eu';

interface ApiProduct {
  id: number;
  title_uk: string;
  title_en?: string;
  title_de?: string;
  title_pl?: string;
  slug: string;
  price: number;
  currency: string;
  primary_image?: string;
  category_id?: number;
  is_handmade?: boolean;
  materials?: string[];
}

export default function HomePage() {
  const { t, language } = useLanguage();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, [language]); // Re-fetch when language changes

  const getProductTitle = (product: ApiProduct): string => {
    switch (language) {
      case 'EN':
        return product.title_en || product.title_uk;
      case 'DE':
        return product.title_de || product.title_en || product.title_uk;
      case 'PL':
        return product.title_pl || product.title_en || product.title_uk;
      case 'SE':
      case 'NO':
      case 'DK':
        return product.title_en || product.title_uk;
      case 'FR':
        return product.title_en || product.title_uk;
      default:
        return product.title_uk;
    }
  };

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(getApiEndpoint('/api/v1/products?is_active=true&is_featured=true&limit=3'));

      if (res.ok) {
        const data: ApiProduct[] = await res.json();
        // Transform API products to frontend Product format with correct language
        const transformedProducts: Product[] = data.map((product) => ({
          id: product.id.toString(),
          title: getProductTitle(product),
          titleEn: product.title_en,
          price: product.price,
          currency: product.currency,
          image: product.primary_image || '/images/products/placeholder.jpg',
          category: 'slavic' as const, // TODO: Map from category_id
          materials: product.materials || [],
          isHandmade: product.is_handmade ?? true,
          slug: product.slug,
        }));
        setFeaturedProducts(transformedProducts);
      } else {
        console.error('Failed to fetch featured products:', res.status, res.statusText);
      }
    } catch (error) {
      console.error('Failed to fetch featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate JSON-LD with actual products
  const homePageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${siteUrl}/#webpage`,
    url: siteUrl,
    name: 'Rune box - Автентичні Прикраси Ручної Роботи',
    description: "Унікальні прикраси ручної роботи за мотивами слов'янської, вікінгської та кельтської культури",
    isPartOf: {
      '@id': `${siteUrl}/#website`,
    },
    about: {
      '@id': `${siteUrl}/#organization`,
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: `${siteUrl}/images/og/og-image.jpg`,
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: featuredProducts.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: product.title,
          url: `${siteUrl}/products/${product.slug}`,
          image: `${siteUrl}${product.image}`,
          offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'PLN',
            availability: 'https://schema.org/InStock',
          },
        },
      })),
    },
  };
  
  return (
    <>
      {/* JSON-LD структуровані дані */}
      <Script
        id="homepage-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageJsonLd) }}
      />

      {/* Hero Section */}
      <Hero />

      {/* Collections Preview */}
      <CollectionsPreview />

      {/* Featured Products Section */}
      <section className="py-20 md:py-32 px-4 bg-footer-black" aria-labelledby="featured-products-title">
        <div className="container mx-auto">
          {/* Section Header */}
          <header className="text-center mb-16 max-w-3xl mx-auto">
            <h2 id="featured-products-title" className="font-rutenia text-3xl md:text-5xl text-ivory mb-6">
              {t.home.featuredProducts.title}
            </h2>
            <p className="font-inter text-sage text-lg">
              {t.home.featuredProducts.subtitle}
            </p>
          </header>

          {/* Products Grid */}
          {loading ? (
            <div className="text-center py-20">
              <div className="mb-6">
                <svg
                  className="w-24 h-24 mx-auto text-sage/30 animate-spin"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <p className="text-sage font-inter">{t.common.loading}</p>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12" role="list" aria-label="Обрані товари">
              {featuredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-up"
                  role="listitem"
                  style={{
                    animationDelay: `${index * 0.2}s`,
                    animationFillMode: 'both',
                  }}
                >
                  <ProductCard product={product} priority={index < 3} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-sage font-inter">Немає рекомендованих товарів на даний момент</p>
            </div>
          )}

          {/* View All Products Link */}
          <div className="text-center mt-12">
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 text-ivory hover:text-oxblood font-inter text-lg transition-colors duration-300 group"
              aria-label={t.home.featuredProducts.viewAll}
            >
              <span>{t.home.featuredProducts.viewAll}</span>
              <svg
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Bonus System Section */}
      <BonusSystem />

      {/* Blog Section */}
      <BlogSection />

      {/* About Section */}
      <section className="py-20 md:py-32 px-4 bg-deep-black relative overflow-hidden" aria-labelledby="about-section-title">
        {/* Decorative background */}
        <div className="absolute inset-0 parchment-texture opacity-5" aria-hidden="true" />

        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <article>
                <h2 id="about-section-title" className="font-rutenia text-3xl md:text-4xl text-ivory mb-6">
                  {t.home.about.title}
                </h2>
                <div className="space-y-4 font-inter text-sage leading-relaxed">
                  <p>
                    {t.home.about.paragraph1}
                  </p>
                  <p>
                    {t.home.about.paragraph2}
                  </p>
                  <p>
                    {t.home.about.paragraph3}
                  </p>
                </div>
                <div className="mt-8">
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2 text-oxblood hover:text-ivory font-inter transition-colors duration-300 group border-b border-oxblood hover:border-ivory pb-1"
                  >
                    <span>{t.home.about.learnMore}</span>
                    <svg
                      className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </article>

              {/* Trust Signals */}
              <aside aria-label="Переваги покупки у нас">
                <ul className="space-y-6">
                  {[
                    {
                      icon: (
                        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      ),
                      title: t.home.about.quality.title,
                      description: t.home.about.quality.description,
                    },
                    {
                      icon: <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
                      title: t.home.about.handmade.title,
                      description: t.home.about.handmade.description,
                    },
                    {
                      icon: (
                        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      ),
                      title: t.home.about.freeShipping.title,
                      description: t.home.about.freeShipping.description,
                    },
                  ].map((item, index) => {
                    const isShipping = index === 2; // Free Shipping is the third item
                    const content = (
                      <>
                        <div className="flex-shrink-0 w-12 h-12 bg-oxblood/20 rounded-sm flex items-center justify-center" aria-hidden="true">
                          <svg
                            className="w-6 h-6 text-oxblood"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            {item.icon}
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-rutenia text-ivory text-lg mb-1">{item.title}</h3>
                          <p className="text-sage text-sm">{item.description}</p>
                        </div>
                      </>
                    );

                    if (isShipping) {
                      return (
                        <Link
                          key={index}
                          href="/shipping"
                          className="flex gap-4 items-start p-4 bg-footer-black border border-sage/20 rounded-sm hover:border-oxblood/50 transition-all duration-300 cursor-pointer"
                        >
                          {content}
                        </Link>
                      );
                    }

                    return (
                      <li
                        key={index}
                        className="flex gap-4 items-start p-4 bg-footer-black border border-sage/20 rounded-sm hover:border-oxblood/50 transition-all duration-300"
                      >
                        {content}
                      </li>
                    );
                  })}
                </ul>
              </aside>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <Newsletter />
    </>
  );
}
