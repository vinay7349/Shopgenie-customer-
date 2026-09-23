import React, { useState } from 'react';
import { useShopGenie } from '../../context/ShopGenieContext';
import { ShopCard, ProductCard } from '../../components/common/Cards';
import { ALL_CATEGORIES, CATEGORY_METAS } from '../../utils/categoryTheme';
import { ShopCategory } from '../../types';
import { 
  Sparkles, 
  Tag, 
  Heart, 
  QrCode, 
  History, 
  ArrowRight, 
  ChevronRight, 
  MapPin, 
  Award,
  RefreshCw 
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const { 
    shops, 
    products, 
    offers, 
    setSelectedShopId, 
    setSelectedProductId,
    setCustomerTab,
    feedPosts,
    showSnackbar,
    t
  } = useShopGenie();

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<ShopCategory | 'All'>('All');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showSnackbar({ message: 'Nearby shops and live offers refreshed', type: 'info' });
    }, 700);
  };

  const filteredShops = selectedCategoryFilter === 'All'
    ? shops
    : shops.filter((s) => s.category === selectedCategoryFilter);

  // Group featured products by prominent categories
  const electronicsProducts = products.filter((p) => p.category === 'Electronics & Gadgets').slice(0, 4);
  const foodAndCafeProducts = products.filter((p) => p.category === 'Bakery & Cafe' || p.category === 'Food Cart').slice(0, 4);
  const supermarketProducts = products.filter((p) => p.category === 'Supermarket').slice(0, 4);

  return (
    <div className="pb-28 max-w-5xl mx-auto px-4 pt-2">
      {/* Quick Pull / Refresh bar */}
      <div className="flex items-center justify-between py-1 mb-2 text-xs text-[#5B6B67] dark:text-[#9DB0AB]">
        <span className="font-medium tracking-tight">Hyperlocal Discovery</span>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-1 hover:text-[#0F766E] transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* 1. Quick Actions Row (Section 5.5: Recent, Offers, Following, Scan) */}
      <div className="grid grid-cols-4 gap-2.5 mb-5">
        <button
          onClick={() => setCustomerTab('search')}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-[#171D1B] border border-[#CBD5D2]/50 dark:border-[#3A4642]/60 hover:border-[#0F766E] transition-all min-h-[58px] shadow-2xs group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
            <History className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-[#0F1F1C] dark:text-[#E8F0EE]">Recent</span>
        </button>

        <button
          onClick={() => setCustomerTab('feed')}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-[#171D1B] border border-[#CBD5D2]/50 dark:border-[#3A4642]/60 hover:border-[#0F766E] transition-all min-h-[58px] shadow-2xs group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
            <Tag className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-[#0F1F1C] dark:text-[#E8F0EE]">Offers</span>
        </button>

        <button
          onClick={() => setCustomerTab('feed')}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-[#171D1B] border border-[#CBD5D2]/50 dark:border-[#3A4642]/60 hover:border-[#0F766E] transition-all min-h-[58px] shadow-2xs group"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-[#0F1F1C] dark:text-[#E8F0EE]">Following</span>
        </button>

        <button
          onClick={() => setCustomerTab('scan')}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-[#171D1B] border border-[#0F766E]/40 dark:border-[#5EEAD4]/30 hover:border-[#0F766E] transition-all min-h-[58px] shadow-2xs group bg-gradient-to-b from-teal-500/5 to-transparent"
        >
          <div className="w-10 h-10 rounded-xl bg-[#0F766E]/15 text-[#0F766E] dark:text-[#5EEAD4] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
            <QrCode className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-[#0F766E] dark:text-[#5EEAD4]">Scan</span>
        </button>
      </div>

      {/* 2. "Live Near You" Banner Carousel (Section 5.5) */}
      <div className="mb-6">
        <div className="rounded-3xl p-4 bg-gradient-to-br from-white via-white to-teal-500/10 dark:from-[#171D1B] dark:via-[#171D1B] dark:to-teal-950/30 border border-[#CBD5D2]/50 dark:border-[#3A4642]/60 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F766E] dark:text-[#5EEAD4]">
                Live Near You
              </span>
            </div>
            <button
              onClick={() => setCustomerTab('feed')}
              className="text-xs font-semibold text-[#0F766E] dark:text-[#5EEAD4] flex items-center gap-1 hover:underline"
            >
              Open Local Feed <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {feedPosts.length > 0 ? (
            <div className="flex items-start gap-3 mt-1">
              <div className="w-10 h-10 rounded-2xl bg-teal-600/15 text-teal-700 dark:text-teal-300 font-bold flex items-center justify-center shrink-0">
                {feedPosts[0].shopName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-heading font-semibold text-xs text-[#0F1F1C] dark:text-[#E8F0EE] truncate">
                    {feedPosts[0].shopName}
                  </h4>
                  <span className="text-[10px] text-[#5B6B67] dark:text-[#9DB0AB]">{feedPosts[0].timeAgo}</span>
                </div>
                <p className="text-xs text-[#5B6B67] dark:text-[#9DB0AB] line-clamp-2 mt-0.5 leading-relaxed">
                  {feedPosts[0].text}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#5B6B67] dark:text-[#9DB0AB]">
              It's quiet nearby. Follow shops to see updates here.
            </p>
          )}
        </div>
      </div>

      {/* 3. Browse By Category (Horizontally scrollable chips) */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading font-bold text-base text-[#0F1F1C] dark:text-[#E8F0EE]">
            Browse by Category
          </h3>
          <button
            onClick={() => setSelectedCategoryFilter('All')}
            className="text-xs font-semibold text-[#0F766E] dark:text-[#5EEAD4] hover:underline"
          >
            Browse all
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setSelectedCategoryFilter('All')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
              selectedCategoryFilter === 'All'
                ? 'bg-[#0F766E] text-white shadow-xs'
                : 'bg-white dark:bg-[#171D1B] text-[#5B6B67] dark:text-[#9DB0AB] border border-[#CBD5D2]/50 dark:border-[#3A4642]'
            }`}
          >
            <span>All Shops</span>
          </button>

          {ALL_CATEGORIES.map((cat) => {
            const meta = CATEGORY_METAS[cat];
            const isSelected = selectedCategoryFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 shrink-0 ${
                  isSelected
                    ? 'bg-[#0F766E] text-white shadow-xs'
                    : 'bg-white dark:bg-[#171D1B] text-[#5B6B67] dark:text-[#9DB0AB] border border-[#CBD5D2]/50 dark:border-[#3A4642]'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: meta.accentColor }}
                />
                <span>{meta.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Nearby Stores (2-column compact card grid) */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-heading font-bold text-base text-[#0F1F1C] dark:text-[#E8F0EE]">
              Nearby Stores
            </h3>
            <p className="text-xs text-[#5B6B67] dark:text-[#9DB0AB]">
              {filteredShops.length} stores available around your area
            </p>
          </div>
          <button
            onClick={() => setCustomerTab('search')}
            className="text-xs font-semibold text-[#0F766E] dark:text-[#5EEAD4] flex items-center gap-0.5 hover:underline"
          >
            View all <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filteredShops.slice(0, 6).map((shop) => (
            <ShopCard
              key={shop.id}
              shop={shop}
              onClick={() => setSelectedShopId(shop.id)}
            />
          ))}
        </div>
      </div>

      {/* 5. Featured Products by Category (Pastel Container Sections) */}
      <div className="space-y-6">
        {/* Bakery & Cafe Highlights */}
        {foodAndCafeProducts.length > 0 && (
          <div className="rounded-3xl p-4 bg-[#FEF3C7]/40 dark:bg-[#78350F]/15 border border-[#FDE68A]/60 dark:border-[#78350F]/30">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[11px] font-bold text-[#D97706] dark:text-[#FBBF24] uppercase tracking-wider">
                  Bakery & Cafe
                </span>
                <h4 className="font-heading font-bold text-sm text-[#0F1F1C] dark:text-[#E8F0EE]">
                  Fresh picks from nearby roasters
                </h4>
              </div>
              <button
                onClick={() => setSelectedCategoryFilter('Bakery & Cafe')}
                className="text-xs font-semibold text-[#D97706] hover:underline"
              >
                See all
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {foodAndCafeProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => setSelectedProductId(product.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Electronics & Gadgets */}
        {electronicsProducts.length > 0 && (
          <div className="rounded-3xl p-4 bg-[#EFF6FF]/60 dark:bg-[#1E3A8A]/15 border border-[#BFDBFE]/60 dark:border-[#1E3A8A]/30">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[11px] font-bold text-[#3B82F6] dark:text-[#93C5FD] uppercase tracking-wider">
                  Electronics & Gadgets
                </span>
                <h4 className="font-heading font-bold text-sm text-[#0F1F1C] dark:text-[#E8F0EE]">
                  Audio, chargers & tablets near you
                </h4>
              </div>
              <button
                onClick={() => setSelectedCategoryFilter('Electronics & Gadgets')}
                className="text-xs font-semibold text-[#3B82F6] hover:underline"
              >
                See all
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {electronicsProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => setSelectedProductId(product.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Supermarket Essentials */}
        {supermarketProducts.length > 0 && (
          <div className="rounded-3xl p-4 bg-[#ECFDF5]/60 dark:bg-[#064E3B]/15 border border-[#A7F3D0]/60 dark:border-[#064E3B]/30">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[11px] font-bold text-[#10B981] dark:text-[#6EE7B7] uppercase tracking-wider">
                  Supermarket & Produce
                </span>
                <h4 className="font-heading font-bold text-sm text-[#0F1F1C] dark:text-[#E8F0EE]">
                  Pantry staples & organic harvest
                </h4>
              </div>
              <button
                onClick={() => setSelectedCategoryFilter('Supermarket')}
                className="text-xs font-semibold text-[#10B981] hover:underline"
              >
                See all
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {supermarketProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => setSelectedProductId(product.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
