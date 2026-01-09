'use client';

import React from 'react';
import Link from 'next/link';
import AlatyrIcon from '@/components/ui/icons/AlatyrIcon';
import ValknutIcon from '@/components/ui/icons/ValknutIcon';
import TriquetraIcon from '@/components/ui/icons/TriquetraIcon';

interface Collection {
  id: string;
  name: string;
  nameEn: string;
  tagline: string;
  taglineEn: string;
  icon: React.ReactNode;
  slug: string;
}

const CollectionsPreview: React.FC = () => {
  const collections: Collection[] = [
    {
      id: 'ukrainian',
      name: 'Українські',
      nameEn: 'Ukrainian',
      tagline: 'Символи сили та захисту',
      taglineEn: 'Symbols of strength and protection',
      icon: <AlatyrIcon size={150} variant="oxblood" />,
      slug: 'ukrainian',
    },
    {
      id: 'viking',
      name: 'Вікінгські',
      nameEn: 'Viking',
      tagline: 'Відвага і доля воїнів',
      taglineEn: 'Courage and fate of warriors',
      icon: <ValknutIcon size={150} variant="oxblood" />,
      slug: 'viking',
    },
    {
      id: 'celtic',
      name: 'Кельтські',
      nameEn: 'Celtic',
      tagline: 'Триєдність і вічність',
      taglineEn: 'Trinity and eternity',
      icon: <TriquetraIcon size={150} variant="oxblood" />,
      slug: 'celtic',
    },
  ];

  return (
    <section className="py-20 md:py-32 px-4 bg-deep-black">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="font-cinzel text-3xl md:text-5xl text-ivory mb-6">
            Колекції Спадщини
          </h2>
          <p className="font-inter text-sage text-lg">
            Три культури. Одна спадщина. Безліч історій.
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {collections.map((collection, index) => (
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
                <h3 className="font-cinzel text-2xl md:text-3xl text-ivory mb-3 group-hover:text-oxblood transition-colors duration-300">
                  {collection.name}
                </h3>

                {/* Tagline */}
                <p className="font-inter text-sage text-sm md:text-base">
                  {collection.tagline}
                </p>

                {/* Decorative line */}
                <div className="mt-6 h-0.5 w-0 bg-oxblood mx-auto group-hover:w-24 transition-all duration-500" />

                {/* Hover overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-oxblood/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-sm pointer-events-none" />
              </article>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 text-ivory hover:text-oxblood font-inter text-lg transition-colors duration-300 group"
          >
            <span>Переглянути всі колекції</span>
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
