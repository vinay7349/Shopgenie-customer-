// Source: Google Maps Platform Code Assist
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin, 
  InfoWindow, 
  useMap 
} from '@vis.gl/react-google-maps';
import { useShopGenie } from '../../context/ShopGenieContext';
import { Shop, Product, ShopCategory } from '../../types';
import { ALL_CATEGORIES } from '../../utils/categoryTheme';
import { 
  Search, 
  MapPin, 
  Navigation, 
  ShoppingBag, 
  Star, 
  Clock, 
  Check, 
  Plus, 
  Minus, 
  ExternalLink, 
  ArrowRight, 
  X, 
  Sparkles, 
  Store, 
  Layers, 
  Compass, 
  ChevronRight,
  SlidersHorizontal,
  Flame,
  CheckCircle2,
  Tag
} from 'lucide-react';

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDKErhjlkZ_Cj_2NJxpLkg1N5u4Z6OMIQc';

// Helper to compute distance in meters between two lat/lng pairs using Haversine formula
function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${meters} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

// Controller component to handle map pan & zoom smoothly
const MapController: React.FC<{
  targetCoords: { lat: number; lng: number } | null;
  targetZoom?: number;
}> = ({ targetCoords, targetZoom = 16 }) => {
  const map = useMap();

  useEffect(() => {
    if (map && targetCoords) {
      map.panTo(targetCoords);
      if (targetZoom) {
        map.setZoom(targetZoom);
      }
    }
  }, [map, targetCoords, targetZoom]);

  return null;
};

export const ShopMapScreen: React.FC = () => {
  const { 
    shops, 
    products, 
    setSelectedShopId, 
    setSelectedProductId, 
    addToCart, 
    cart, 
    updateCartQuantity,
    showSnackbar,
    setCustomerTab
  } = useShopGenie();

  // User location (default: Rajarajeshwari Nagar central point)
  const defaultUserLocation = useMemo(() => ({ lat: 12.9248, lng: 77.5218 }), []);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>(defaultUserLocation);
  const [isLocating, setIsLocating] = useState(false);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ShopCategory | 'All'>('All');
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [activePanLocation, setActivePanLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [viewMode, setViewMode] = useState<'split' | 'map-only' | 'list-only'>('split');

  // Request actual user location on mount or when requested
  const handleLocateMe = useCallback(() => {
    if (!navigator.geolocation) {
      showSnackbar({ message: 'Geolocation is not supported by your browser', type: 'warning' });
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(coords);
        setActivePanLocation(coords);
        setHasLocationPermission(true);
        setIsLocating(false);
        showSnackbar({ message: 'Centered on your current location', type: 'success' });
      },
      (err) => {
        setIsLocating(false);
        // Fall back gracefully to default store cluster
        setActivePanLocation(defaultUserLocation);
        showSnackbar({ 
          message: 'Using default area location (Rajarajeshwari Nagar)', 
          type: 'info' 
        });
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  }, [defaultUserLocation, showSnackbar]);

  // Compute live distances for all shops from user location and sort nearest first
  const shopsWithDistances = useMemo(() => {
    return shops.map((shop) => {
      const distanceM = calculateDistanceMeters(
        userLocation.lat,
        userLocation.lng,
        shop.lat,
        shop.lng
      );
      return {
        ...shop,
        distanceM
      };
    }).sort((a, b) => a.distanceM - b.distanceM);
  }, [shops, userLocation]);

  // Direct product search logic:
  // When user searches for a product or category:
  // Find which products match, and find which shops offer them
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    // 1. Matched products
    let matchingProducts: Product[] = [];
    if (q) {
      matchingProducts = products.filter((p) => 
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.barcode.includes(q)
      );
    }

    // Map shop IDs that carry matching products
    const shopsWithMatchingProductIds = new Set(matchingProducts.map((p) => p.shopId));

    // 2. Filtered shops:
    // If there is a product query: shops that match the shop name OR carry the matching product
    // If category filter is active: must also match category
    const filteredShops = shopsWithDistances.filter((shop) => {
      const matchesCategory = selectedCategory === 'All' || shop.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!q) return true;

      const shopNameMatches = shop.name.toLowerCase().includes(q) || 
                              shop.address.toLowerCase().includes(q) ||
                              shop.category.toLowerCase().includes(q);
      const carriesProduct = shopsWithMatchingProductIds.has(shop.id);

      return shopNameMatches || carriesProduct;
    });

    return {
      shops: filteredShops,
      matchingProducts,
      hasProductMatches: matchingProducts.length > 0 && q.length > 0
    };
  }, [searchQuery, selectedCategory, shopsWithDistances, products]);

  // Select first shop by default if none selected or if filtered
  useEffect(() => {
    if (!selectedShop && searchResults.shops.length > 0) {
      setSelectedShop(searchResults.shops[0]);
    } else if (selectedShop && !searchResults.shops.find((s) => s.id === selectedShop.id)) {
      setSelectedShop(searchResults.shops[0] || null);
    }
  }, [searchResults.shops, selectedShop]);

  // Products belonging to the currently selected shop
  const selectedShopProducts = useMemo(() => {
    if (!selectedShop) return [];
    const q = searchQuery.trim().toLowerCase();

    const shopProds = products.filter((p) => p.shopId === selectedShop.id);
    
    // If there is a search query, sort products that match the query to the front
    if (q) {
      return [...shopProds].sort((a, b) => {
        const aMatches = a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q);
        const bMatches = b.name.toLowerCase().includes(q) || b.description.toLowerCase().includes(q);
        if (aMatches && !bMatches) return -1;
        if (!aMatches && bMatches) return 1;
        return 0;
      });
    }

    return shopProds;
  }, [selectedShop, products, searchQuery]);

  const handleSelectShop = (shop: Shop) => {
    setSelectedShop(shop);
    setActivePanLocation({ lat: shop.lat, lng: shop.lng });
  };

  const handleAddToCart = (product: Product, shop: Shop) => {
    addToCart(product, shop, 1);
    showSnackbar({
      message: `Added ${product.name} to bag`,
      type: 'success'
    });
  };

  const getProductQuantityInCart = (productId: string) => {
    const item = cart.find((c) => c.product.id === productId);
    return item ? item.quantity : 0;
  };

  // Quick product search suggestions
  const POPULAR_SEARCH_CHIPS = [
    { label: '☕ Arabica Coffee', query: 'coffee' },
    { label: '🥐 Sourdough Croissant', query: 'croissant' },
    { label: '🥭 Alphonso Mangoes', query: 'mango' },
    { label: '🎧 Noise Cancelling', query: 'headphone' },
    { label: '👕 Handloom Shirt', query: 'shirt' },
    { label: '🥦 Organic Veggies', query: 'organic' },
    { label: '🏍️ Helmets & Gear', query: 'helmet' }
  ];

  return (
    <div className="flex flex-col h-full min-h-[85vh] bg-[#F8FAFC] text-slate-800 pb-24">
      {/* 1. Header Bar: Search & Quick Product Filters */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3 sm:px-4 py-2.5 shadow-2xs">
        <div className="flex items-center gap-2">
          {/* Search Box: Searches Products & Shops */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product (coffee, headphones, bread) or shop..."
              className="w-full pl-9 pr-9 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Locate Me Button */}
          <button
            onClick={handleLocateMe}
            className={`p-2 rounded-xl border transition-all flex items-center justify-center shrink-0 ${
              isLocating
                ? 'bg-blue-600 text-white border-blue-600 animate-pulse'
                : 'bg-white border-slate-200 text-slate-700 hover:border-blue-500'
            }`}
            title="Locate me & calculate nearest shops"
          >
            <Compass className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
          </button>

          {/* View Mode Toggle (on larger screens) */}
          <div className="hidden sm:flex rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setViewMode('split')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                viewMode === 'split'
                  ? 'bg-white dark:bg-slate-700 text-[#0F766E] dark:text-[#5EEAD4] shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              Split
            </button>
            <button
              onClick={() => setViewMode('map-only')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                viewMode === 'map-only'
                  ? 'bg-white dark:bg-slate-700 text-[#0F766E] dark:text-[#5EEAD4] shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              Map
            </button>
            <button
              onClick={() => setViewMode('list-only')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                viewMode === 'list-only'
                  ? 'bg-white dark:bg-slate-700 text-[#0F766E] dark:text-[#5EEAD4] shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              List
            </button>
          </div>
        </div>

        {/* Popular Direct Product Query Chips */}
        <div className="flex items-center gap-1.5 mt-2 overflow-x-auto no-scrollbar pb-0.5 text-[11px]">
          <span className="text-[#5B6B67] dark:text-[#9DB0AB] font-semibold shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#F59E0B]" />
            <span>Find:</span>
          </span>
          {POPULAR_SEARCH_CHIPS.map((chip) => (
            <button
              key={chip.query}
              onClick={() => setSearchQuery(chip.query)}
              className={`px-2.5 py-1 rounded-full shrink-0 font-medium transition-all border ${
                searchQuery.toLowerCase() === chip.query
                  ? 'bg-[#0F766E] text-white border-[#0F766E] shadow-2xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#0F766E]'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Main Content: Map + Nearest Shop / Product Viewer */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Left / Top: Interactive Google Map */}
        {viewMode !== 'list-only' && (
          <div className={`relative ${
            viewMode === 'split' ? 'h-[44vh] md:h-auto md:w-3/5 lg:w-2/3' : 'h-full w-full'
          } border-b md:border-b-0 md:border-r border-[#CBD5D2]/50 dark:border-[#3A4642]/60 overflow-hidden`}>
            <APIProvider apiKey={MAPS_API_KEY}>
              <Map
                mapId="DEMO_MAP_ID"
                defaultCenter={defaultUserLocation}
                defaultZoom={15}
                gestureHandling="greedy"
                disableDefaultUI={false}
                zoomControl={true}
                streetViewControl={false}
                mapTypeControl={false}
                className="w-full h-full min-h-[280px]"
                style={{ width: '100%', height: '100%' }}
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              >
                {/* Pan/Zoom Controller */}
                <MapController targetCoords={activePanLocation} />

                {/* User Current Location Marker */}
                <AdvancedMarker position={userLocation} title="Your Location">
                  <div className="relative flex items-center justify-center">
                    <span className="absolute w-8 h-8 rounded-full bg-blue-500/30 animate-ping" />
                    <div className="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-md flex items-center justify-center text-white text-[10px]">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  </div>
                </AdvancedMarker>

                {/* Shop Markers */}
                {searchResults.shops.map((shop, index) => {
                  const isSelected = selectedShop?.id === shop.id;
                  const isNearest = index === 0;

                  // Find if shop has product matching search
                  const matchedProd = searchResults.hasProductMatches
                    ? products.find((p) => p.shopId === shop.id && p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    : null;

                  return (
                    <AdvancedMarker
                      key={shop.id}
                      position={{ lat: shop.lat, lng: shop.lng }}
                      onClick={() => handleSelectShop(shop)}
                      title={`${shop.name} (${shop.category})`}
                    >
                      <div className="relative cursor-pointer transition-transform hover:scale-110 active:scale-95 group">
                        {/* Matched product badge floating above pin */}
                        {matchedProd && (
                          <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-full bg-[#0F766E] text-white text-[10px] font-bold shadow-md border border-white/50 flex items-center gap-1 animate-bounce">
                            <span>{matchedProd.name.slice(0, 16)}</span>
                            <span className="text-[#5EEAD4]">₹{matchedProd.price}</span>
                          </div>
                        )}

                        {/* Nearest Badge */}
                        {!matchedProd && isNearest && (
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 rounded-full bg-[#F59E0B] text-slate-950 text-[9px] font-extrabold shadow-sm ring-1 ring-white">
                            ★ Nearest
                          </div>
                        )}

                        {/* Custom Pin Element */}
                        <div className={`px-2.5 py-1.5 rounded-2xl shadow-lg border-2 flex items-center gap-1.5 transition-all ${
                          isSelected
                            ? 'bg-[#0F766E] text-white border-white ring-4 ring-[#0F766E]/30 scale-110 z-20'
                            : 'bg-white dark:bg-[#171D1B] text-[#0F1F1C] dark:text-[#E8F0EE] border-[#0F766E]/50 hover:border-[#0F766E]'
                        }`}>
                          <Store className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#0F766E]'}`} />
                          <div className="flex flex-col text-left">
                            <span className="text-[11px] font-bold leading-none max-w-[90px] truncate">
                              {shop.name}
                            </span>
                            <span className={`text-[9px] font-semibold leading-tight ${
                              isSelected ? 'text-teal-200' : 'text-[#0F766E]'
                            }`}>
                              {formatDistance(shop.distanceM)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </AdvancedMarker>
                  );
                })}
              </Map>
            </APIProvider>

            {/* Map Overlay Badge: Nearest Store Summary */}
            <div className="absolute top-3 left-3 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {searchResults.shops.length} {searchResults.shops.length === 1 ? 'Shop' : 'Shops'} nearby
              </span>
              {searchResults.hasProductMatches && (
                <span className="px-1.5 py-0.5 rounded-md bg-teal-500/10 text-[#0F766E] dark:text-[#5EEAD4] font-bold text-[10px]">
                  Found "{searchQuery}"
                </span>
              )}
            </div>
          </div>
        )}

        {/* Right / Bottom: Selected Shop Details + Products inside Shop */}
        {viewMode !== 'map-only' && (
          <div className={`flex-1 overflow-y-auto no-scrollbar p-3 sm:p-4 flex flex-col gap-3 bg-[#F7F8FA] dark:bg-[#0F1412] ${
            viewMode === 'split' ? 'h-[50vh] md:h-auto md:w-2/5 lg:w-1/3' : 'w-full'
          }`}>
            {selectedShop ? (
              <div className="flex flex-col gap-3">
                {/* 1. Selected Shop Header Card */}
                <div className="bg-white dark:bg-[#171D1B] rounded-2xl p-4 border border-[#CBD5D2]/60 dark:border-[#3A4642] shadow-xs relative">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="px-2 py-0.5 rounded-md bg-[#0F766E]/10 text-[#0F766E] dark:text-[#5EEAD4] text-[10px] font-bold">
                          {selectedShop.category}
                        </span>
                        {selectedShop.verified && (
                          <span className="px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-semibold flex items-center gap-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            Verified
                          </span>
                        )}
                        {selectedShop.id === searchResults.shops[0]?.id && (
                          <span className="px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-400 text-[10px] font-extrabold">
                            Nearest
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-base text-[#0F1F1C] dark:text-[#E8F0EE]">
                        {selectedShop.name}
                      </h3>
                      
                      <p className="text-xs text-[#5B6B67] dark:text-[#9DB0AB] mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#0F766E] shrink-0" />
                        <span className="truncate">{selectedShop.address}</span>
                      </p>
                    </div>

                    {/* Proximity & Rating Pill */}
                    <div className="flex flex-col items-end shrink-0">
                      <span className="px-2 py-1 rounded-xl bg-teal-500/10 text-[#0F766E] dark:text-[#5EEAD4] font-extrabold text-xs">
                        {formatDistance(selectedShop.distanceM)}
                      </span>
                      <div className="flex items-center gap-1 mt-1 text-xs font-bold text-amber-500">
                        <Star className="w-3 h-3 fill-amber-500" />
                        <span>{selectedShop.rating}</span>
                        <span className="text-[10px] text-slate-400 font-normal">({selectedShop.reviewCount})</span>
                      </div>
                    </div>
                  </div>

                  {/* Hours & Self-Checkout tag */}
                  <div className="flex items-center gap-3 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedShop.hours}</span>
                    </div>
                    {selectedShop.supportsSelfCheckout && (
                      <span className="text-[11px] font-semibold text-[#0F766E] dark:text-[#5EEAD4] ml-auto">
                        ⚡ Scan & Pay Supported
                      </span>
                    )}
                  </div>

                  {/* Actions Row */}
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <button
                      onClick={() => {
                        setSelectedShopId(selectedShop.id);
                      }}
                      className="px-3 py-2 rounded-xl bg-[#0F766E] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs hover:bg-[#0c615b] transition-all"
                    >
                      <Store className="w-3.5 h-3.5" />
                      <span>Visit Store Profile</span>
                    </button>

                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${selectedShop.lat},${selectedShop.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
                    >
                      <Navigation className="w-3.5 h-3.5 text-[#0F766E]" />
                      <span>Directions</span>
                    </a>
                  </div>
                </div>

                {/* 2. Products Inside This Shop (User prompt: "inside that show product") */}
                <div className="bg-white dark:bg-[#171D1B] rounded-2xl p-4 border border-[#CBD5D2]/60 dark:border-[#3A4642] shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <ShoppingBag className="w-4 h-4 text-[#0F766E] dark:text-[#5EEAD4]" />
                      <h4 className="font-bold text-sm text-[#0F1F1C] dark:text-[#E8F0EE]">
                        Products at {selectedShop.name}
                      </h4>
                    </div>
                    <span className="text-xs text-[#5B6B67] dark:text-[#9DB0AB]">
                      {selectedShopProducts.length} items
                    </span>
                  </div>

                  {/* Product Cards Grid / List */}
                  {selectedShopProducts.length > 0 ? (
                    <div className="flex flex-col gap-2.5">
                      {selectedShopProducts.map((product) => {
                        const qtyInCart = getProductQuantityInCart(product.id);
                        const isMatch = searchQuery && product.name.toLowerCase().includes(searchQuery.toLowerCase());

                        return (
                          <div
                            key={product.id}
                            className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                              isMatch
                                ? 'bg-teal-500/5 border-[#0F766E]/40 shadow-xs'
                                : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                            }`}
                          >
                            <div 
                              className="flex items-center gap-3 flex-1 cursor-pointer"
                              onClick={() => setSelectedProductId(product.id)}
                            >
                              <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0 overflow-hidden text-lg">
                                {product.imageUrls?.[0] ? (
                                  <img 
                                    src={product.imageUrls[0]} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover" 
                                  />
                                ) : (
                                  <span>🛍️</span>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <h5 className="font-bold text-xs sm:text-sm text-[#0F1F1C] dark:text-[#E8F0EE] truncate">
                                    {product.name}
                                  </h5>
                                  {isMatch && (
                                    <span className="px-1.5 py-0.2 rounded bg-[#0F766E] text-white text-[9px] font-bold">
                                      Search Hit
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="font-extrabold text-xs text-[#0F766E] dark:text-[#5EEAD4]">
                                    ₹{product.price}
                                  </span>
                                  {product.mrp > product.price && (
                                    <span className="text-[10px] text-slate-400 line-through">
                                      ₹{product.mrp}
                                    </span>
                                  )}
                                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                                    · In stock: {product.stock}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Cart Action */}
                            <div className="shrink-0">
                              {qtyInCart > 0 ? (
                                <div className="flex items-center gap-1 bg-[#0F766E] text-white rounded-lg p-0.5 text-xs">
                                  <button
                                    onClick={() => updateCartQuantity(product.id, -1)}
                                    className="p-1 hover:bg-black/10 rounded"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="font-bold px-1.5">{qtyInCart}</span>
                                  <button
                                    onClick={() => updateCartQuantity(product.id, 1)}
                                    className="p-1 hover:bg-black/10 rounded"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleAddToCart(product, selectedShop)}
                                  className="px-2.5 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-[#0F766E] hover:text-white text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>Add</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-xs text-slate-400">
                      No products listed yet for this shop.
                    </div>
                  )}
                </div>

                {/* 3. Other Nearest Shops List */}
                <div className="bg-white dark:bg-[#171D1B] rounded-2xl p-4 border border-[#CBD5D2]/60 dark:border-[#3A4642] shadow-xs">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#5B6B67] dark:text-[#9DB0AB] mb-2.5">
                    Other Nearby Stores
                  </h4>
                  <div className="flex flex-col gap-2">
                    {searchResults.shops
                      .filter((s) => s.id !== selectedShop.id)
                      .slice(0, 4)
                      .map((other) => (
                        <div
                          key={other.id}
                          onClick={() => handleSelectShop(other)}
                          className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-[#0F766E]/40 hover:bg-teal-500/5 transition-all flex items-center justify-between cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <Store className="w-4 h-4 text-[#0F766E]" />
                            <div>
                              <div className="font-bold text-xs text-[#0F1F1C] dark:text-[#E8F0EE]">
                                {other.name}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {other.category}
                              </div>
                            </div>
                          </div>
                          <span className="text-[11px] font-bold text-[#0F766E] dark:text-[#5EEAD4]">
                            {formatDistance(other.distanceM)}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-white dark:bg-[#171D1B] rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                <Store className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <h4 className="font-bold text-sm">No shops found matching "{searchQuery}"</h4>
                <p className="text-xs text-slate-400 mt-1">Try another product keyword or clear the search.</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-3 px-3 py-1.5 rounded-xl bg-[#0F766E] text-white text-xs font-bold"
                >
                  Show All Nearest Stores
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
