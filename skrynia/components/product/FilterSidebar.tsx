'use client';

import React, { useState } from 'react';
import { Heart, Shield, Coins, BookOpen } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Button from '@/components/ui/Button';

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
  const { t } = useLanguage();
  const [filters, setFilters] = useState<Filters>({
    symbols: [],
    materials: [],
    culture: 'all',
    priceRange: [0, 5000],
  });

  const hasActiveFilters =
    filters.symbols.length > 0 ||
    filters.materials.length > 0 ||
    filters.culture !== 'all' ||
    filters.priceRange[1] !== 5000;

  const symbolOptions = [
    { id: 'love', label: t.filters.symbols.love, icon: Heart },
    { id: 'protection', label: t.filters.symbols.protection, icon: Shield },
    { id: 'wealth', label: t.filters.symbols.wealth, icon: Coins },
    { id: 'wisdom', label: t.filters.symbols.wisdom, icon: BookOpen },
  ];

  const materialOptions = [
    { id: 'coral', label: t.filters.materials.coral },
    { id: 'silver', label: t.filters.materials.silver },
    { id: 'amber', label: t.filters.materials.amber },
    { id: 'gemstone', label: t.filters.materials.gemstone },
  ];

  const cultureOptions = [
    { id: 'all', label: t.filters.cultures.all },
    { id: 'ukrainian', label: t.filters.cultures.ukrainian },
    { id: 'viking', label: t.filters.cultures.viking },
    { id: 'celtic', label: t.filters.cultures.celtic },
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

  const Section: React.FC<{ title: string; badge?: string; children: React.ReactNode }> = ({
    title,
    badge,
    children,
  }) => (
    <section className="rounded-xl border border-sage/15 bg-deep-black/35 backdrop-blur-md p-4 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-rutenia text-ivory text-lg">{title}</h3>
        {badge ? (
          <span className="text-[11px] font-inter px-2 py-0.5 rounded-full border border-sage/20 text-sage/90 bg-deep-black/40">
            {badge}
          </span>
        ) : null}
        </div>
      {children}
    </section>
  );

  const ToggleRow: React.FC<{
    checked: boolean;
    onChange: () => void;
    label: React.ReactNode;
    leading?: React.ReactNode;
    type?: 'checkbox' | 'radio';
    name?: string;
    value?: string;
  }> = ({ checked, onChange, label, leading, type = 'checkbox', name, value }) => (
            <label
      className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2 cursor-pointer transition-colors border ${
        checked
          ? 'bg-oxblood/10 border-oxblood/35'
          : 'bg-deep-black/20 border-sage/10 hover:bg-deep-black/35 hover:border-sage/20'
      }`}
    >
      <span className="flex items-center gap-3 min-w-0">
        {leading ? <span className="shrink-0">{leading}</span> : null}
        <span className={`font-inter text-sm truncate ${checked ? 'text-ivory' : 'text-sage'}`}>
          {label}
        </span>
      </span>

      <span className="relative shrink-0">
                <input
          type={type}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
                  className="sr-only"
                />
        {type === 'checkbox' ? (
          <span
            className={`grid place-items-center w-5 h-5 rounded-md border transition-all duration-200 ${
              checked ? 'bg-oxblood border-oxblood' : 'border-sage/45'
            }`}
            aria-hidden="true"
                >
            {checked ? (
                    <svg
                className="w-4 h-4 text-ivory"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
            ) : null}
          </span>
        ) : (
          <span
            className={`grid place-items-center w-5 h-5 rounded-full border transition-all duration-200 ${
              checked ? 'border-oxblood' : 'border-sage/45'
            }`}
            aria-hidden="true"
          >
            <span
              className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                checked ? 'bg-oxblood' : 'bg-transparent'
              }`}
            />
          </span>
        )}
              </span>
            </label>
  );

  const sidebarContent = (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-rutenia text-2xl text-ivory leading-tight">{t.filters.title}</h2>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            disabled={!hasActiveFilters}
            className="border-sage/30 text-sage hover:text-deep-black hover:bg-sage disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-sage"
          >
            {t.filters.clear}
          </Button>

          {isMobile ? (
            <button
              onClick={onClose}
              className="text-ivory/90 hover:text-oxblood transition-colors p-2 rounded-lg hover:bg-deep-black/40"
              aria-label="Close filters"
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
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : null}
        </div>
      </div>

      <Section title={t.filters.bySymbol} badge={filters.symbols.length ? String(filters.symbols.length) : undefined}>
        <div className="grid gap-2">
          {symbolOptions.map((symbol) => {
            const IconComponent = symbol.icon;
            return (
              <ToggleRow
                key={symbol.id}
                type="checkbox"
                checked={filters.symbols.includes(symbol.id)}
                onChange={() => handleSymbolToggle(symbol.id)}
                leading={
                  <IconComponent
                    className={`w-4 h-4 ${filters.symbols.includes(symbol.id) ? 'text-oxblood' : 'text-sage'}`}
                    strokeWidth={2}
                  />
                }
                label={symbol.label}
              />
            );
          })}
        </div>
      </Section>

      <Section title={t.filters.byMaterial} badge={filters.materials.length ? String(filters.materials.length) : undefined}>
        <div className="grid gap-2">
          {materialOptions.map((material) => (
            <ToggleRow
              key={material.id}
                  type="checkbox"
                  checked={filters.materials.includes(material.id)}
                  onChange={() => handleMaterialToggle(material.id)}
              label={material.label}
            />
          ))}
        </div>
      </Section>

      <Section title={t.filters.byCulture}>
        <div className="grid gap-2">
          {cultureOptions.map((culture) => (
            <ToggleRow
              key={culture.id}
                type="radio"
                name="culture"
                value={culture.id}
                checked={filters.culture === culture.id}
                onChange={() => handleCultureChange(culture.id)}
              label={culture.label}
              />
          ))}
        </div>
      </Section>

      <Section title={t.filters.price}>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-inter text-sage/90">
            <span>{filters.priceRange[0]} zł</span>
            <span className="text-ivory">{filters.priceRange[1]} zł</span>
      </div>

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
            className="w-full h-2 bg-sage/15 rounded-lg appearance-none cursor-pointer accent-oxblood"
          />
        </div>
      </Section>
    </div>
  );

  if (isMobile) {
    return isOpen ? (
      <div className="fixed inset-0 z-50 animate-fade-in">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-deep-black/80 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

        {/* Drawer */}
        <div className="absolute inset-y-0 right-0 w-[92vw] max-w-sm bg-footer-black/80 backdrop-blur-xl border-l border-sage/20 p-5 overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
        {sidebarContent}
        </div>
      </div>
    ) : null;
  }

  return (
    <aside className="w-72 flex-shrink-0 h-fit sticky top-24">
      <div className="bg-footer-black/55 backdrop-blur-xl border border-sage/20 rounded-2xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
      {sidebarContent}
      </div>
    </aside>
  );
};

export default FilterSidebar;
