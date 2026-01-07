import React from 'react';
import Hero from '@/components/layout/Hero';
import CollectionsPreview from '@/components/layout/CollectionsPreview';
import Newsletter from '@/components/layout/Newsletter';
import ProductCard, { Product } from '@/components/product/ProductCard';

// Sample featured products data
const featuredProducts: Product[] = [
  {
    id: '1',
    title: 'Намисто з натурального коралу "Алатир"',
    titleEn: 'Natural Coral Necklace "Alatyr"',
    price: 1200,
    currency: 'zł',
    image: '/images/products/coral-necklace-1.jpg',
    category: 'ukrainian',
    materials: ['Натуральний корал', 'Срібло 925'],
    isHandmade: true,
    slug: 'coral-necklace-alatyr',
  },
  {
    id: '2',
    title: 'Срібний кулон "Валькнут"',
    titleEn: 'Silver Pendant "Valknut"',
    price: 850,
    currency: 'zł',
    image: '/images/products/viking-pendant-1.jpg',
    category: 'viking',
    materials: ['Срібло 925', 'Оксидоване срібло'],
    isHandmade: true,
    slug: 'silver-pendant-valknut',
  },
  {
    id: '3',
    title: 'Браслет "Трикветр" з бурштином',
    titleEn: 'Triquetra Bracelet with Amber',
    price: 950,
    currency: 'zł',
    image: '/images/products/celtic-bracelet-1.jpg',
    category: 'celtic',
    materials: ['Бурштин', 'Срібло 925', 'Шкіра'],
    isHandmade: true,
    slug: 'triquetra-bracelet-amber',
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Collections Preview */}
      <CollectionsPreview />

      {/* Featured Products Section */}
      <section className="py-20 md:py-32 px-4 bg-footer-black">
        <div className="container mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="font-cinzel text-3xl md:text-5xl text-ivory mb-6">
              Обрані Скарби
            </h2>
            <p className="font-inter text-sage text-lg">
              Унікальні прикраси, створені з душею та натхненням традиціями
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {featuredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-up"
                style={{
                  animationDelay: `${index * 0.2}s`,
                  animationFillMode: 'both',
                }}
              >
                <ProductCard product={product} priority={index < 3} />
              </div>
            ))}
          </div>

          {/* View All Products Link */}
          <div className="text-center mt-12">
            <a
              href="/collections"
              className="inline-flex items-center gap-2 text-ivory hover:text-oxblood font-inter text-lg transition-colors duration-300 group"
            >
              <span>Переглянути всі прикраси</span>
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
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 md:py-32 px-4 bg-deep-black relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 parchment-texture opacity-5" />

        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <div>
                <h2 className="font-cinzel text-3xl md:text-4xl text-ivory mb-6">
                  Про Скриню
                </h2>
                <div className="space-y-4 font-inter text-sage leading-relaxed">
                  <p>
                    Кожна прикраса — це не лише аксесуар, а портал до історії наших предків.
                  </p>
                  <p>
                    Ми створюємо автентичні вироби за справжніми археологічними зразками,
                    використовуючи давні техніки та натуральні матеріали.
                  </p>
                  <p>
                    Натуральний корал, срібло 925 проби, бурштин — кожен елемент обирається
                    з любов'ю та повагою до традицій слов'янської, вікінгської та кельтської культур.
                  </p>
                </div>
                <div className="mt-8">
                  <a
                    href="/about"
                    className="inline-flex items-center gap-2 text-oxblood hover:text-ivory font-inter transition-colors duration-300 group border-b border-oxblood hover:border-ivory pb-1"
                  >
                    <span>Дізнатися більше</span>
                    <svg
                      className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Trust Signals */}
              <div className="space-y-6">
                {[
                  {
                    icon: (
                      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    ),
                    title: 'Гарантія якості',
                    description: 'Кожна прикраса виготовлена з натуральних матеріалів',
                  },
                  {
                    icon: <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
                    title: 'Ручна робота',
                    description: 'Створюємо за старовинними техніками',
                  },
                  {
                    icon: (
                      <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    ),
                    title: 'Безкоштовна доставка',
                    description: 'По всьому Європейському Союзу',
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 items-start p-4 bg-footer-black border border-sage/20 rounded-sm hover:border-oxblood/50 transition-all duration-300"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-oxblood/20 rounded-sm flex items-center justify-center">
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
                      <h3 className="font-cinzel text-ivory text-lg mb-1">{item.title}</h3>
                      <p className="text-sage text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <Newsletter />
    </>
  );
}
