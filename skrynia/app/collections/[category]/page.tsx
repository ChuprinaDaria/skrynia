'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ProductCard, { Product } from '@/components/product/ProductCard';
import FilterSidebar, { Filters } from '@/components/product/FilterSidebar';
import { useLanguage } from '@/contexts/LanguageContext';
import { getApiEndpoint } from '@/lib/api';

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

const validCategories = ['ukrainian', 'viking', 'celtic'];

const CategoryCollectionsPage: React.FC = () => {
  const params = useParams();
  const category = params?.category as string;
  const { t, language } = useLanguage();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    symbols: [],
    materials: [],
    culture: category || 'all',
    priceRange: [0, 5000],
  });
  const [sortBy, setSortBy] = useState<string>('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  useEffect(() => {
    fetchProducts();
  }, [category, language]);

  useEffect(() => {
    if (category && validCategories.includes(category)) {
      setFilters((prev) => ({
        ...prev,
        culture: category,
      }));
    }
  }, [category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(getApiEndpoint('/api/v1/products?is_active=true&limit=100'));

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
          category: 'ukrainian' as const, // TODO: Map from category_id
          materials: product.materials || [],
          isHandmade: product.is_handmade ?? true,
          slug: product.slug,
        }));
        setProducts(transformedProducts);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeFilterCount =
    filters.symbols.length +
    filters.materials.length +
    (filters.culture !== 'all' ? 1 : 0) +
    (filters.priceRange[1] !== 5000 ? 1 : 0);

  // Validate category
  if (!category || !validCategories.includes(category)) {
    return (
      <div className="min-h-screen bg-deep-black pt-24 pb-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-rutenia text-4xl text-ivory mb-4">404</h1>
          <p className="text-sage font-inter mb-6">Категорія не знайдена</p>
          <a
            href="/collections"
            className="text-oxblood hover:text-ivory transition-colors font-inter"
          >
            Повернутися до колекцій
          </a>
        </div>
      </div>
    );
  }

  // Filter products based on active filters
  const filteredProducts = products.filter((product) => {
    // Culture filter (must match category from URL)
    if (product.category !== category) {
      return false;
    }

    // Additional filters
    if (filters.symbols.length > 0) {
      // This would need to be implemented based on product data structure
    }

    if (filters.materials.length > 0) {
      // This would need to be implemented based on product data structure
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

  // Get category name
  const categoryName =
    category === 'ukrainian'
      ? t.collections.ukrainian
      : category === 'viking'
      ? t.collections.viking
      : t.collections.celtic;

  return (
    <div className="min-h-screen bg-deep-black pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="font-rutenia text-4xl md:text-5xl text-ivory mb-4">
            {categoryName}
          </h1>
          <p className="font-inter text-sage text-lg max-w-2xl mx-auto">
            {category === 'ukrainian'
              ? t.collections.ukrainianTagline
              : category === 'viking'
              ? t.collections.vikingTagline
              : t.collections.celticTagline}
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          {/* Results count */}
          <p className="text-sage font-inter">
            {t.collectionsPage.found}{' '}
            <span className="text-ivory font-semibold">{sortedProducts.length}</span>{' '}
            {t.collectionsPage.items}
          </p>

          {/* Sort and Filter */}
          <div className="flex items-center gap-4">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-footer-black border border-sage/30 text-ivory hover:border-oxblood rounded-sm transition-colors duration-300 relative"
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
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-oxblood text-ivory text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
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
            ) : sortedProducts.length > 0 ? (
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

export default CategoryCollectionsPage;

