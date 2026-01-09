'use client';

import React, { useState } from 'react';
import ProductCard, { Product } from '@/components/product/ProductCard';
import FilterSidebar, { Filters } from '@/components/product/FilterSidebar';
import { useLanguage } from '@/contexts/LanguageContext';

// Sample products data
const allProducts: Product[] = [
  {
    id: '1',
    title: 'Намисто з натурального коралу "Алатир"',
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
    price: 950,
    currency: 'zł',
    image: '/images/products/celtic-bracelet-1.jpg',
    category: 'celtic',
    materials: ['Бурштин', 'Срібло 925', 'Шкіра'],
    isHandmade: true,
    slug: 'triquetra-bracelet-amber',
  },
  {
    id: '4',
    title: 'Сережки "Сонячний Знак"',
    price: 680,
    currency: 'zł',
    image: '/images/products/ukrainian-earrings-1.jpg',
    category: 'ukrainian',
    materials: ['Срібло 925', 'Позолота'],
    isHandmade: true,
    slug: 'solar-sign-earrings',
  },
  {
    id: '5',
    title: 'Вікінгський браслет "Йормунганд"',
    price: 1450,
    currency: 'zł',
    image: '/images/products/viking-bracelet-1.jpg',
    category: 'viking',
    materials: ['Срібло 925', 'Шкіра'],
    isHandmade: true,
    slug: 'jormungandr-bracelet',
  },
  {
    id: '6',
    title: 'Кельтський амулет "Древо Життя"',
    price: 790,
    currency: 'zł',
    image: '/images/products/celtic-amulet-1.jpg',
    category: 'celtic',
    materials: ['Срібло 925', 'Емаль'],
    isHandmade: true,
    slug: 'tree-of-life-amulet',
  },
];

const CollectionsPage: React.FC = () => {
  const { t } = useLanguage();
  const [filters, setFilters] = useState<Filters>({
    symbols: [],
    materials: [],
    culture: 'all',
    priceRange: [0, 5000],
  });
  const [sortBy, setSortBy] = useState<string>('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const activeFilterCount =
    filters.symbols.length +
    filters.materials.length +
    (filters.culture !== 'all' ? 1 : 0) +
    (filters.priceRange[1] !== 5000 ? 1 : 0);

  // Filter products based on active filters
  const filteredProducts = allProducts.filter((product) => {
    // Culture filter
    if (filters.culture !== 'all' && product.category !== filters.culture) {
      return false;
    }

    // Price filter
    if (product.price > filters.priceRange[1]) {
      return false;
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-deep-black pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="font-rutenia text-4xl md:text-5xl text-ivory mb-4">
            {t.collectionsPage.title}
          </h1>
          <p className="font-inter text-sage text-lg max-w-2xl mx-auto">
            {t.collectionsPage.subtitle}
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          {/* Results count */}
          <p className="text-sage font-inter">
            {t.collectionsPage.found} <span className="text-ivory font-semibold">{sortedProducts.length}</span> {t.collectionsPage.items}
          </p>

          {/* Sort and Filter */}
          <div className="flex items-center gap-4">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-footer-black/60 backdrop-blur-xl border border-sage/25 text-ivory hover:border-oxblood/60 rounded-xl transition-colors duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
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
                <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              {t.collectionsPage.filters}
              {activeFilterCount > 0 ? (
                <span className="ml-1 text-[11px] font-inter px-2 py-0.5 rounded-full bg-oxblood/90 text-ivory">
                  {activeFilterCount}
                </span>
              ) : null}
            </button>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-footer-black border border-sage/30 text-ivory hover:border-oxblood rounded-sm transition-colors duration-300 font-inter focus:outline-none focus:ring-2 focus:ring-oxblood cursor-pointer"
            >
              <option value="newest">{t.collectionsPage.sort.newest}</option>
              <option value="price-low">{t.collectionsPage.sort.priceLow}</option>
              <option value="price-high">{t.collectionsPage.sort.priceHigh}</option>
              <option value="name">{t.collectionsPage.sort.name}</option>
            </select>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block">
            <FilterSidebar onFilterChange={setFilters} />
          </div>

          {/* Sidebar - Mobile */}
          {isFilterOpen && (
            <FilterSidebar
              onFilterChange={setFilters}
              isMobile
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
            />
          )}

          {/* Products Grid */}
          <div className="flex-grow">
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {sortedProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-fade-up"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      animationFillMode: 'both',
                    }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="mb-6">
                  <svg
                    className="w-24 h-24 mx-auto text-sage/30"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="font-rutenia text-2xl text-ivory mb-2">
                  {t.collectionsPage.noResults.title}
                </h3>
                <p className="text-sage font-inter">
                  {t.collectionsPage.noResults.message}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionsPage;
