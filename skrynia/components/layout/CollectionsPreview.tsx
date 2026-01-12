'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AlatyrIcon from '@/components/ui/icons/AlatyrIcon';
import ValknutIcon from '@/components/ui/icons/ValknutIcon';
import TriquetraIcon from '@/components/ui/icons/TriquetraIcon';
import { useLanguage } from '@/contexts/LanguageContext';
import { getApiEndpoint } from '@/lib/api';

interface ApiCategory {
  id: number;
  name_uk: string;
  name_en?: string;
  name_de?: string;
  name_pl?: string;
  slug: string;
  description_uk?: string;
  description_en?: string;
  icon?: string;
  culture_type: string;
  is_featured: boolean;
}

interface Collection {
  id: number;
  name: string;
  tagline: string;
  icon: React.ReactNode;
  slug: string;
}

const CollectionsPreview: React.FC = () => {
  const { t, language } = useLanguage();
  const [featuredCollections, setFeaturedCollections] = useState<Collection[]>([]);
  const [additionalCollections, setAdditionalCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollections();
  }, [language]);

  const getIconBySlug = (slug: string, iconName?: string, cultureType?: string): React.ReactNode => {
    // Map known icons
    if (iconName === 'alatyr' || slug === 'slavic' || cultureType === 'slavic') {
      return <AlatyrIcon size={150} variant="oxblood" />;
    }
    if (iconName === 'valknut' || slug === 'viking' || cultureType === 'viking') {
      return <ValknutIcon size={150} variant="oxblood" />;
    }
    if (iconName === 'triquetra' || slug === 'celtic' || cultureType === 'celtic') {
      return <TriquetraIcon size={150} variant="oxblood" />;
    }
    // Default to AlatyrIcon for unknown categories
    return <AlatyrIcon size={150} variant="oxblood" />;
  };

  const getCategoryName = (category: ApiCategory): string => {
    switch (language) {
      case 'EN':
        return category.name_en || category.name_uk;
      case 'DE':
        return category.name_de || category.name_en || category.name_uk;
      case 'PL':
        return category.name_pl || category.name_en || category.name_uk;
      default:
        return category.name_uk;
    }
  };

  const getCategoryTagline = (category: ApiCategory): string => {
    switch (language) {
      case 'EN':
        return category.description_en || category.description_uk || '';
      default:
        return category.description_uk || '';
    }
  };

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const res = await fetch(getApiEndpoint('/api/v1/categories'));
      
      if (res.ok) {
        const data: ApiCategory[] = await res.json();
        
        // Separate featured and additional collections
        const featured = data
          .filter(cat => cat.is_featured)
          .map(cat => ({
            id: cat.id,
            name: getCategoryName(cat),
            tagline: getCategoryTagline(cat),
            icon: getIconBySlug(cat.slug, cat.icon, cat.culture_type),
            slug: cat.slug,
          }));

        const additional = data
          .filter(cat => !cat.is_featured)
          .slice(0, 4) // Max 4 additional collections
          .map(cat => ({
            id: cat.id,
            name: getCategoryName(cat),
            tagline: getCategoryTagline(cat),
            icon: getIconBySlug(cat.slug, cat.icon, cat.culture_type),
            slug: cat.slug,
          }));

        setFeaturedCollections(featured);
        setAdditionalCollections(additional);
      }
    } catch (error) {
      console.error('Failed to fetch collections:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderCollectionCard = (collection: Collection, index: number) => (
    <Link
      key={collection.id}
      href={`/collections/${collection.slug}`}
      className="group"
    >
      <article
        className="relative bg-footer-black border border-sage/20 hover:border-oxblood rounded-sm p-8 transition-all duration-500 hover:shadow-oxblood-glow card-lift text-center"
        style={{
          animation: `fadeUp 0.6s ease-out ${index * 0.2}s both`,
        }}
      >
        {/* Icon */}
        <div className="flex justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(102,0,0,0.8)]">
          {collection.icon}
        </div>

        {/* Collection Name */}
        <h3 className="font-rutenia text-2xl md:text-3xl text-ivory mb-3 group-hover:text-oxblood transition-colors duration-300">
          {collection.name}
        </h3>

        {/* Tagline */}
        {collection.tagline && (
          <p className="font-inter text-sage text-sm md:text-base">
            {collection.tagline}
          </p>
        )}

        {/* Decorative line */}
        <div className="mt-6 h-0.5 w-0 bg-oxblood mx-auto group-hover:w-24 transition-all duration-500" />

        {/* Hover overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-oxblood/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-sm pointer-events-none" />
      </article>
    </Link>
  );

  if (loading) {
    return (
      <section className="py-20 md:py-32 px-4 bg-deep-black">
        <div className="container mx-auto">
          <div className="text-center">
            <p className="text-sage font-inter">Завантаження колекцій...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 md:py-32 px-4 bg-deep-black">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="font-rutenia text-3xl md:text-5xl text-ivory mb-6">
            {t.collections.title}
          </h2>
          <p className="font-inter text-sage text-lg">
            {t.collections.subtitle}
          </p>
        </div>

        {/* Featured Collections Grid */}
        {featuredCollections.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-16">
            {featuredCollections.map((collection, index) => renderCollectionCard(collection, index))}
          </div>
        )}

        {/* Additional Collections Grid */}
        {additionalCollections.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {additionalCollections.map((collection, index) => renderCollectionCard(collection, index))}
          </div>
        )}

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 text-ivory hover:text-oxblood font-inter text-lg transition-colors duration-300 group"
          >
            <span>{t.collections.viewAll}</span>
            <svg
              className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CollectionsPreview;
