import React, { useState } from 'react';
import { useShopGenie } from '../../context/ShopGenieContext';
import { Shop, Product } from '../../types';
import { 
  Search, 
  FileText, 
  Tag, 
  Heart, 
  QrCode, 
  MapPin, 
  ChevronRight, 
  Star, 
  Clock, 
  Store, 
  Sparkles, 
  Navigation, 
  ShoppingBag,
  ArrowRight,
  Compass,
  CheckCircle2
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const { 
    shops, 
    products, 
    currentArea, 
    setCurrentArea, 
    setSelectedShopId, 
    setCustomerTab,
    setSelectedProductId
  } = useShopGenie();

  const [searchInputValue, setSearchInputValue] = useState('');
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  // Check if current area has shops or is an expansion area (like Neermarga Proper)
  const isNeermarga = currentArea.toLowerCase().includes('neermarga');
  const availableShopsInArea = isNeermarga 
    ? [] 
    : shops;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInputValue.trim()) {
      setCustomerTab('map');
    }
  };

  return (
    <div className="min-h-full bg-[#F8FAFC] text-slate-800 pb-28">
      {/* 1. Sky-Themed Header Area with Search Bar */}
      <div className="bg-gradient-to-b from-[#BAE6FD]/40 via-[#E0F2FE]/25 to-[#F8FAFC] px-4 pt-3 pb-2">
        {/* Search Bar matching screenshot */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto mb-4">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchInputValue}
              onChange={(e) => setSearchInputValue(e.target.value)}
              placeholder="Find shops near you"
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white border border-slate-200/80 text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {searchInputValue ? (
              <button
                type="button"
                onClick={() => setSearchInputValue('')}
                className="absolute right-3.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            ) : (
              <div 
                onClick={() => setCustomerTab('map')} 
                className="absolute right-3.5 text-blue-600 hover:text-blue-700 cursor-pointer p-1"
                title="Search on Google Maps"
              >
                <Compass className="w-4 h-4" />
              </div>
            )}
          </div>
        </form>

        {/* 2. Four Quick Action Cards matching screenshot */}
        <div className="grid grid-cols-4 gap-2.5 max-w-2xl mx-auto mb-5">
          {/* Card 1: Feed */}
          <button
            onClick={() => setCustomerTab('feed')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-200/70 shadow-xs hover:border-blue-300 hover:shadow-sm transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5 stroke-[2]" />
            </div>
            <span className="text-xs font-semibold text-slate-700">Feed</span>
          </button>

          {/* Card 2: Offers */}
          <button
            onClick={() => setCustomerTab('feed')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-200/70 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <Tag className="w-5 h-5 stroke-[2]" />
            </div>
            <span className="text-xs font-semibold text-slate-700">Offers</span>
          </button>

          {/* Card 3: Following */}
          <button
            onClick={() => setCustomerTab('feed')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-200/70 shadow-xs hover:border-rose-300 hover:shadow-sm transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 stroke-[2]" />
            </div>
            <span className="text-xs font-semibold text-slate-700">Following</span>
          </button>

          {/* Card 4: Scan */}
          <button
            onClick={() => setCustomerTab('scan')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-200/70 shadow-xs hover:border-indigo-300 hover:shadow-sm transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <QrCode className="w-5 h-5 stroke-[2]" />
            </div>
            <span className="text-xs font-semibold text-slate-700">Scan</span>
          </button>
        </div>

        {/* 3. Hero Banner Carousel: "ShopGenie is growing!" with 3D Diorama */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="relative rounded-3xl bg-gradient-to-r from-[#DBEAFE] via-[#EFF6FF] to-[#E0F2FE] border border-blue-200/60 shadow-sm overflow-hidden p-4 sm:p-5">
            {/* Background city & clouds illustration */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex-1 z-10">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-600/10 text-blue-700 font-bold text-[11px] mb-2">
                  <Sparkles className="w-3 h-3 text-blue-600" />
                  <span>Your Local Shopping Partner</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B2545] tracking-tight leading-tight">
                  ShopGenie is growing!
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                  Keep Supporting, your support matters!
                </p>

                {/* Direct CTA button to Google Maps */}
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => setCustomerTab('map')}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Explore on Live Map</span>
                  </button>
                </div>
              </div>

              {/* 3D Local Store Diorama Image from uploaded asset */}
              <div className="w-36 sm:w-44 h-28 sm:h-32 shrink-0 rounded-2xl overflow-hidden shadow-xs border border-white/60 relative bg-white">
                <img
                  src="/shop_hero_banner.jpg"
                  alt="ShopGenie 3D Storefront"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Dot Indicator Carousel */}
            <div className="flex items-center justify-center gap-1.5 mt-3">
              <span className="w-5 h-1.5 rounded-full bg-blue-600" />
              <span className="w-1.5 h-1.5 rounded-full bg-blue-300" />
              <span className="w-1.5 h-1.5 rounded-full bg-blue-300" />
              <span className="w-1.5 h-1.5 rounded-full bg-blue-300" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. "Nearby Stores" Section */}
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900">
            Nearby Stores
          </h3>
          <button
            onClick={() => setCustomerTab('map')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>See all</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Conditional View: Expansion Area (empty state like screenshot) vs Active Store Hub */}
        {isNeermarga ? (
          /* Exact Empty State from Screenshot */
          <div className="flex flex-col items-center justify-center text-center py-6 px-4">
            {/* Glowing cyan icon circle */}
            <div className="w-20 h-20 rounded-full bg-cyan-50 border border-cyan-200/60 shadow-inner flex items-center justify-center mb-3 relative">
              <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center">
                <Store className="w-6 h-6 text-cyan-600" />
              </div>
            </div>

            {/* Pagination dots */}
            <div className="flex items-center justify-center gap-1.5 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              <span className="w-5 h-1.5 rounded-full bg-cyan-500" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            </div>

            {/* Headline matching screenshot */}
            <h4 className="text-lg font-bold text-slate-900 leading-snug">
              ShopGenie isn't in<br />Neermarga Proper yet
            </h4>
            <p className="text-xs font-semibold text-cyan-600 mt-1 mb-5">
              But you can help change that.
            </p>

            {/* Local Business Owner Card matching screenshot */}
            <div className="w-full text-left rounded-2xl bg-cyan-50/50 border border-cyan-200/70 p-4 shadow-2xs mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500 text-white flex items-center justify-center">
                  <Store className="w-4 h-4" />
                </div>
                <h5 className="font-bold text-xs text-slate-900">
                  Are you a local business owner?
                </h5>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                ShopGenie helps shops in your city get discovered by nearby customers — for free. Showcase your products, run offers, and accept digital payments without any platform fees.
              </p>
            </div>

            {/* Quick Switch Button to Bengaluru active hub */}
            <button
              onClick={() => setCurrentArea('Rajarajeshwari Nagar, Bengaluru')}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-sm hover:bg-blue-700 transition-all flex items-center gap-1.5"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Switch to Rajarajeshwari Nagar Hub (Active Stores)</span>
            </button>
          </div>
        ) : (
          /* Active Store List with Live Google Maps Quick Preview */
          <div className="flex flex-col gap-4">
            {/* Interactive Map Banner */}
            <div 
              onClick={() => setCustomerTab('map')}
              className="rounded-2xl bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200/80 p-3.5 flex items-center justify-between cursor-pointer hover:border-blue-400 transition-all shadow-2xs group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                    <span>Interactive Map & Store Locator</span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                      Live
                    </span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Search products directly and view nearest shops on Google Maps
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>

            {/* Nearby Stores Cards */}
            <div className="flex flex-col gap-3">
              {availableShopsInArea.slice(0, 5).map((shop, index) => {
                // Get sample products for this shop
                const shopProducts = products.filter((p) => p.shopId === shop.id).slice(0, 3);

                return (
                  <div
                    key={shop.id}
                    className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-200 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold">
                            {shop.category}
                          </span>
                          {index === 0 && (
                            <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-extrabold">
                              ★ Nearest Store
                            </span>
                          )}
                          {shop.isOpen ? (
                            <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-semibold">
                              Open
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px]">
                              Closed
                            </span>
                          )}
                        </div>

                        <h4 
                          onClick={() => setSelectedShopId(shop.id)}
                          className="font-bold text-base text-slate-900 hover:text-blue-600 cursor-pointer truncate"
                        >
                          {shop.name}
                        </h4>

                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
                          <span className="truncate">{shop.address}</span>
                        </p>
                      </div>

                      {/* Distance & Rating */}
                      <div className="flex flex-col items-end shrink-0">
                        <span className="px-2 py-1 rounded-xl bg-blue-50 text-blue-700 font-extrabold text-xs">
                          {shop.distanceM} m away
                        </span>
                        <div className="flex items-center gap-1 mt-1 text-xs font-bold text-amber-500">
                          <Star className="w-3 h-3 fill-amber-500" />
                          <span>{shop.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Products inside that shop (Direct preview) */}
                    {shopProducts.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                          Products inside this store:
                        </span>
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                          {shopProducts.map((prod) => (
                            <button
                              key={prod.id}
                              onClick={() => setSelectedProductId(prod.id)}
                              className="px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/70 text-left transition-all shrink-0 flex items-center gap-1.5 text-xs"
                            >
                              <span className="font-medium text-slate-700 max-w-[110px] truncate">
                                {prod.name}
                              </span>
                              <span className="font-bold text-blue-600">
                                ₹{prod.price}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions row */}
                    <div className="mt-3 pt-2.5 flex items-center justify-between text-xs">
                      <button
                        onClick={() => setSelectedShopId(shop.id)}
                        className="font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <span>Visit Store</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => setCustomerTab('map')}
                        className="text-slate-600 hover:text-blue-600 flex items-center gap-1 font-medium"
                      >
                        <Compass className="w-3.5 h-3.5 text-blue-600" />
                        <span>Locate on Map</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
