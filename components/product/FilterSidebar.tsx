'use client';

import React, { useState } from 'react';

export interface Filters {
  symbols: string[];
  materials: string[];
  culture: string;
  priceRange: [number, number];
}

interface FilterSidebarProps {
  onFilterChange: (filters: Filters) => void;
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  onFilterChange,
  isMobile = false,
  isOpen = true,
  onClose,
}) => {
  const [filters, setFilters] = useState<Filters>({
    symbols: [],
    materials: [],
    culture: 'all',
    priceRange: [0, 5000],
  });

  const symbolOptions = [
    { id: 'love', label: 'Любов', icon: '❤️' },
    { id: 'protection', label: 'Захист', icon: '🛡️' },
    { id: 'wealth', label: 'Багатство', icon: '💰' },
    { id: 'wisdom', label: 'Мудрість', icon: '📖' },
  ];

  const materialOptions = [
    { id: 'coral', label: 'Корал' },
    { id: 'silver', label: 'Срібло' },
    { id: 'amber', label: 'Бурштин' },
    { id: 'gemstone', label: 'Дорогоцінне каміння' },
  ];

  const cultureOptions = [
    { id: 'all', label: 'Всі' },
    { id: 'ukrainian', label: 'Українські' },
    { id: 'viking', label: 'Вікінгські' },
    { id: 'celtic', label: 'Кельтські' },
  ];

  const handleSymbolToggle = (symbolId: string) => {
    const newSymbols = filters.symbols.includes(symbolId)
      ? filters.symbols.filter((s) => s !== symbolId)
      : [...filters.symbols, symbolId];

    const newFilters = { ...filters, symbols: newSymbols };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleMaterialToggle = (materialId: string) => {
    const newMaterials = filters.materials.includes(materialId)
      ? filters.materials.filter((m) => m !== materialId)
      : [...filters.materials, materialId];

    const newFilters = { ...filters, materials: newMaterials };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCultureChange = (culture: string) => {
    const newFilters = { ...filters, culture };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const defaultFilters: Filters = {
      symbols: [],
      materials: [],
      culture: 'all',
      priceRange: [0, 5000],
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const sidebarContent = (
    <div className={`${isMobile ? 'p-6' : 'space-y-8'}`}>
      {/* Header (Mobile only) */}
      {isMobile && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-cinzel text-2xl text-ivory">Фільтри</h2>
          <button
            onClick={onClose}
            className="text-ivory hover:text-oxblood transition-colors"
            aria-label="Close filters"
          >
            <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* By Symbol */}
      <div>
        <h3 className="font-cinzel text-ivory text-lg mb-4">За символом</h3>
        <div className="space-y-3">
          {symbolOptions.map((symbol) => (
            <label
              key={symbol.id}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative">
                <input
                  type="checkbox"
                  checked={filters.symbols.includes(symbol.id)}
                  onChange={() => handleSymbolToggle(symbol.id)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 border-2 rounded transition-all duration-200 ${
                    filters.symbols.includes(symbol.id)
                      ? 'bg-oxblood border-oxblood'
                      : 'border-sage/50 group-hover:border-sage'
                  }`}
                >
                  {filters.symbols.includes(symbol.id) && (
                    <svg
                      className="w-full h-full text-ivory"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sage group-hover:text-ivory transition-colors flex items-center gap-2">
                <span>{symbol.icon}</span>
                <span>{symbol.label}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-sage/20" />

      {/* By Material */}
      <div>
        <h3 className="font-cinzel text-ivory text-lg mb-4">За матеріалом</h3>
        <div className="space-y-3">
          {materialOptions.map((material) => (
            <label
              key={material.id}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative">
                <input
                  type="checkbox"
                  checked={filters.materials.includes(material.id)}
                  onChange={() => handleMaterialToggle(material.id)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 border-2 rounded transition-all duration-200 ${
                    filters.materials.includes(material.id)
                      ? 'bg-oxblood border-oxblood'
                      : 'border-sage/50 group-hover:border-sage'
                  }`}
                >
                  {filters.materials.includes(material.id) && (
                    <svg
                      className="w-full h-full text-ivory"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sage group-hover:text-ivory transition-colors">
                {material.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-sage/20" />

      {/* By Culture */}
      <div>
        <h3 className="font-cinzel text-ivory text-lg mb-4">За культурою</h3>
        <div className="space-y-2">
          {cultureOptions.map((culture) => (
            <label
              key={culture.id}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="radio"
                name="culture"
                value={culture.id}
                checked={filters.culture === culture.id}
                onChange={() => handleCultureChange(culture.id)}
                className="w-5 h-5 text-oxblood border-sage/50 focus:ring-oxblood focus:ring-2"
              />
              <span className="text-sage group-hover:text-ivory transition-colors">
                {culture.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-sage/20" />

      {/* Price Range */}
      <div>
        <h3 className="font-cinzel text-ivory text-lg mb-4">Ціна (zł)</h3>
        <div className="space-y-4">
          <input
            type="range"
            min="0"
            max="5000"
            step="100"
            value={filters.priceRange[1]}
            onChange={(e) => {
              const newFilters = {
                ...filters,
                priceRange: [0, parseInt(e.target.value)] as [number, number],
              };
              setFilters(newFilters);
              onFilterChange(newFilters);
            }}
            className="w-full h-2 bg-sage/20 rounded-lg appearance-none cursor-pointer accent-oxblood"
          />
          <div className="flex justify-between text-sage text-sm">
            <span>{filters.priceRange[0]} zł</span>
            <span>{filters.priceRange[1]} zł</span>
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      <button
        onClick={handleClearFilters}
        className="w-full text-oxblood hover:text-ivory border border-oxblood hover:bg-oxblood transition-all duration-300 py-2 rounded-sm font-inter text-sm"
      >
        Очистити фільтри
      </button>
    </div>
  );

  if (isMobile) {
    return isOpen ? (
      <div className="fixed inset-0 z-50 bg-deep-black/95 backdrop-blur-sm overflow-y-auto animate-fade-in">
        {sidebarContent}
      </div>
    ) : null;
  }

  return (
    <aside className="w-64 flex-shrink-0 bg-footer-black border border-sage/20 rounded-sm p-6 h-fit sticky top-24">
      {sidebarContent}
    </aside>
  );
};

export default FilterSidebar;
