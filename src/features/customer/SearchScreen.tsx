import React, { useState, useEffect, useMemo } from 'react';
import { useShopGenie } from '../../context/ShopGenieContext';
import { ShopCard, ProductCard } from '../../components/common/Cards';
import { ALL_CATEGORIES } from '../../utils/categoryTheme';
import { ShopCategory } from '../../types';
import { Search, X, Clock, Trash2, Store, Sparkles, Package } from 'lucide-react';

export const SearchScreen: React.FC = () => {
  const {
    shops,
    products,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    setSelectedShopId,
    setSelectedProductId,
    currentArea
  } = useShopGenie();

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ShopCategory | 'All'>('All');

  // 300ms debouncing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
      if (query.trim().length > 1) {
        addRecentSearch(query.trim());
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  // Filtered results
  const results = useMemo(() => {
    const q = debouncedQuery.toLowerCase().trim();

    let matchedShops = shops;
    let matchedProducts = products;

    if (selectedCategory !== 'All') {
      matchedShops = matchedShops.filter((s) => s.category === selectedCategory);
      matchedProducts = matchedProducts.filter((p) => p.category === selectedCategory);
    }

    if (q) {
      matchedShops = matchedShops.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.area.toLowerCase().includes(q)
      );

      matchedProducts = matchedProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.barcode.includes(q)
      );
    }

    return {
      shops: matchedShops,
      products: matchedProducts
    };
  }, [debouncedQuery, selectedCategory, shops, products]);

  const hasSearchInput = debouncedQuery.trim().length > 0 || selectedCategory !== 'All';

  return (
    <div className="pb-28 max-w-5xl mx-auto px-4 pt-2">
      {/* 1. Search Bar */}
      <div className="relative mb-3">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5B6B67] dark:text-[#9DB0AB]">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products, stores, barcodes..."
          className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white dark:bg-[#171D1B] border border-[#CBD5D2]/60 dark:border-[#3A4642] text-sm text-[#0F1F1C] dark:text-[#E8F0EE] placeholder-[#5B6B67] dark:placeholder-[#9DB0AB] focus:outline-hidden focus:border-[#0F766E] shadow-2xs transition-colors"
          autoFocus
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#5B6B67] hover:text-[#0F1F1C] dark:hover:text-white"
            aria-label="Clear query"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 2. Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-3 mb-2">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCategory === 'All'
              ? 'bg-[#0F766E] text-white'
              : 'bg-white dark:bg-[#171D1B] text-[#5B6B67] dark:text-[#9DB0AB] border border-[#CBD5D2]/50 dark:border-[#3A4642]'
          }`}
        >
          All
        </button>
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(selectedCategory === cat ? 'All' : cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-[#0F766E] text-white'
                : 'bg-white dark:bg-[#171D1B] text-[#5B6B67] dark:text-[#9DB0AB] border border-[#CBD5D2]/50 dark:border-[#3A4642]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 3. Recent Searches (shown when no active typed query) */}
      {!query && recentSearches.length > 0 && (
        <div className="mb-6 bg-white dark:bg-[#171D1B] rounded-2xl p-4 border border-[#CBD5D2]/50 dark:border-[#3A4642]/60 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#5B6B67] dark:text-[#9DB0AB] uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Recent Searches
            </span>
            <button
              onClick={clearRecentSearches}
              className="text-[11px] font-semibold text-rose-500 hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" /> Clear
            </button>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {recentSearches.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setQuery(item)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. Results Group: Stores */}
      {results.shops.length > 0 && (
        <div className="mb-6">
          <h3 className="font-heading font-bold text-sm text-[#0F1F1C] dark:text-[#E8F0EE] mb-2.5 flex items-center gap-1.5">
            <Store className="w-4 h-4 text-[#0F766E]" />
            Matching Stores ({results.shops.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {results.shops.map((shop) => (
              <ShopCard
                key={shop.id}
                shop={shop}
                onClick={() => setSelectedShopId(shop.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* 5. Results Group: Discovery Items */}
      {results.products.length > 0 && (
        <div className="mb-6">
          <h3 className="font-heading font-bold text-sm text-[#0F1F1C] dark:text-[#E8F0EE] mb-2.5 flex items-center gap-1.5">
            <Package className="w-4 h-4 text-[#0F766E]" />
            Items & Products ({results.products.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {results.products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => setSelectedProductId(product.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* 6. Empty State */}
      {results.shops.length === 0 && results.products.length === 0 && (
        <div className="py-16 text-center max-w-sm mx-auto">
          <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h4 className="font-heading font-bold text-base text-[#0F1F1C] dark:text-[#E8F0EE]">
            No items or shops found
          </h4>
          <p className="text-xs text-[#5B6B67] dark:text-[#9DB0AB] mt-1 leading-relaxed">
            We couldn't find any results for "{query}" around {currentArea.split(',')[0]}. Try another keyword or browse popular categories.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {['Coffee', 'Avocado', 'Helmet', 'Idli'].map((sample) => (
              <button
                key={sample}
                onClick={() => setQuery(sample)}
                className="px-3 py-1 rounded-full text-xs bg-[#0F766E]/10 text-[#0F766E] dark:text-[#5EEAD4] font-medium hover:bg-[#0F766E]/20"
              >
                Try "{sample}"
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
