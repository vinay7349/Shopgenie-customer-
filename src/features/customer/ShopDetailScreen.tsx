import React, { useState } from 'react';
import { useShopGenie } from '../../context/ShopGenieContext';
import { PlaceholderVisual } from '../../components/common/PlaceholderVisual';
import { StatusPill, DistanceLabel, RatingBadge, PriceText } from '../../components/common/Components';
import { ProductCard, OfferCard } from '../../components/common/Cards';
import { 
  ArrowLeft, 
  Share2, 
  Heart, 
  Navigation, 
  Phone, 
  Clock, 
  MapPin, 
  CreditCard, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  QrCode, 
  ShoppingBag,
  ExternalLink
} from 'lucide-react';

export const ShopDetailScreen: React.FC = () => {
  const { 
    selectedShopId, 
    setSelectedShopId, 
    shops, 
    products, 
    offers, 
    followedShopIds, 
    toggleFollowShop,
    setSelectedProductId,
    setCustomerTab,
    setActiveSelfCheckoutShop,
    showSnackbar 
  } = useShopGenie();

  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('All');

  const shop = shops.find((s) => s.id === selectedShopId) || shops[0];
  const isFollowed = followedShopIds.includes(shop.id);
  const shopProducts = products.filter((p) => p.shopId === shop.id);
  const shopOffers = offers.filter((o) => o.shopId === shop.id);

  // Categories present inside this shop
  const shopCategories = ['All', ...Array.from(new Set(shopProducts.map((p) => p.category)))];

  const displayedProducts = selectedCategoryTab === 'All'
    ? shopProducts
    : shopProducts.filter((p) => p.category === selectedCategoryTab);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: shop.name,
        text: `Check out ${shop.name} on ShopGenie!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${shop.name} - ${shop.address}`);
      showSnackbar({ message: 'Store details copied to clipboard!', type: 'success' });
    }
  };

  const handleDirections = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${shop.name}, ${shop.address}`
    )}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleStartSelfCheckout = () => {
    setActiveSelfCheckoutShop(shop);
    setCustomerTab('scan');
    showSnackbar({
      message: `Self-checkout mode activated for ${shop.name}`,
      type: 'info'
    });
  };

  return (
    <div className="pb-32 bg-[#F7F8FA] dark:bg-[#0F1412] min-h-screen">
      {/* 1. Hero Header */}
      <div className="relative h-56 sm:h-64 w-full">
        <PlaceholderVisual
          category={shop.category}
          name={shop.name}
          className="w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Top Controls */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <button
            onClick={() => setSelectedShopId(null)}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors shadow-sm"
            aria-label="Back to discovery"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors shadow-sm"
              aria-label="Share store"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleFollowShop(shop.id)}
              className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-colors shadow-sm ${
                isFollowed ? 'bg-rose-500 text-white' : 'bg-black/40 text-white hover:text-rose-400'
              }`}
              aria-label={isFollowed ? 'Unfollow' : 'Follow'}
            >
              <Heart className={`w-5 h-5 ${isFollowed ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Hero Title & Area on scrim */}
        <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md">
              {shop.category}
            </span>
            <StatusPill type={shop.isOpen ? 'open' : 'closed'} />
          </div>
          <h1 className="font-heading font-extrabold text-xl sm:text-2xl drop-shadow-md">
            {shop.name}
          </h1>
          <p className="text-xs text-white/80 flex items-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{shop.address}</span>
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-3 relative z-20 space-y-4">
        {/* 2. Self-Checkout Banner (if supported) */}
        {shop.supportsSelfCheckout && (
          <div className="rounded-2xl p-3.5 bg-gradient-to-r from-teal-900 to-[#0F766E] text-white shadow-md flex items-center justify-between gap-3 border border-teal-400/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                <QrCode className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-xs sm:text-sm text-teal-50">
                  Scan & Pay Self-Checkout Available
                </h4>
                <p className="text-[11px] text-teal-200/90">
                  Skip the counter queue inside this store
                </p>
              </div>
            </div>
            <button
              onClick={handleStartSelfCheckout}
              className="px-3.5 py-2 rounded-xl bg-[#F59E0B] text-slate-950 font-bold text-xs hover:bg-[#FBBF24] active:scale-95 transition-all shadow-xs shrink-0 whitespace-nowrap"
            >
              Start Scanning
            </button>
          </div>
        )}

        {/* 3. Info Card */}
        <div className="bg-white dark:bg-[#171D1B] rounded-3xl p-4 border border-[#CBD5D2]/50 dark:border-[#3A4642]/60 shadow-xs space-y-4">
          {/* Operating hours & open status */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs text-[#5B6B67] dark:text-[#9DB0AB]">
              <Clock className="w-4 h-4 text-[#0F766E] dark:text-[#5EEAD4]" />
              <span className="font-medium">{shop.hours}</span>
            </div>
            <StatusPill type={shop.isOpen ? 'open' : 'closed'} />
          </div>

          {/* Stats Row (Rating, Products, Followers) */}
          <div className="grid grid-cols-3 divide-x divide-slate-100 dark:divide-slate-800 py-1 text-center">
            <div>
              <div className="flex items-center justify-center gap-1 text-amber-600 dark:text-amber-400 font-bold text-sm">
                <span>★</span> {shop.rating}
              </div>
              <span className="text-[11px] text-[#5B6B67] dark:text-[#9DB0AB]">
                {shop.reviewCount} reviews
              </span>
            </div>
            <div>
              <div className="font-bold text-sm text-[#0F1F1C] dark:text-[#E8F0EE]">
                {shopProducts.length}
              </div>
              <span className="text-[11px] text-[#5B6B67] dark:text-[#9DB0AB]">Products</span>
            </div>
            <div>
              <div className="font-bold text-sm text-[#0F1F1C] dark:text-[#E8F0EE]">
                {shop.followerCount}
              </div>
              <span className="text-[11px] text-[#5B6B67] dark:text-[#9DB0AB]">Followers</span>
            </div>
          </div>

          {/* Expandable "More Details" */}
          <div>
            <button
              onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
              className="w-full flex items-center justify-between text-xs font-semibold text-[#0F766E] dark:text-[#5EEAD4] pt-2"
            >
              <span>{isDetailsExpanded ? 'Hide details' : 'More store details'}</span>
              {isDetailsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {isDetailsExpanded && (
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-[#5B6B67] dark:text-[#9DB0AB] leading-relaxed">
                <p className="text-slate-700 dark:text-slate-300">{shop.description}</p>
                <div className="flex items-center gap-2 pt-1">
                  <Phone className="w-3.5 h-3.5 text-[#0F766E]" />
                  <span>{shop.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-3.5 h-3.5 text-[#0F766E]" />
                  <span>Accepted: {shop.paymentMethods.join(', ')}</span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons: Directions & Share */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={handleDirections}
              className="h-11 rounded-2xl bg-teal-500/10 dark:bg-teal-900/30 text-[#0F766E] dark:text-[#5EEAD4] font-semibold text-xs flex items-center justify-center gap-2 hover:bg-teal-500/20 transition-colors"
            >
              <Navigation className="w-4 h-4 rotate-45" />
              <span>Directions</span>
            </button>
            <button
              onClick={handleShare}
              className="h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Store</span>
            </button>
          </div>
        </div>

        {/* 4. Offers & Specials Carousel (if any) */}
        {shopOffers.length > 0 && (
          <div>
            <h3 className="font-heading font-bold text-sm text-[#0F1F1C] dark:text-[#E8F0EE] mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#F59E0B]" />
              Offers & Specials
            </h3>
            <div className="space-y-2.5">
              {shopOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          </div>
        )}

        {/* 5. In-Store Catalogue */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-heading font-bold text-base text-[#0F1F1C] dark:text-[#E8F0EE]">
              Store Catalogue ({shopProducts.length})
            </h3>
            <span className="text-xs text-[#5B6B67] dark:text-[#9DB0AB]">In-stock inventory</span>
          </div>

          {/* Category Tabs */}
          {shopCategories.length > 2 && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-3">
              {shopCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryTab(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                    selectedCategoryTab === cat
                      ? 'bg-[#0F766E] text-white'
                      : 'bg-white dark:bg-[#171D1B] text-[#5B6B67] dark:text-[#9DB0AB] border border-[#CBD5D2]/50 dark:border-[#3A4642]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                shop={shop}
                onClick={() => setSelectedProductId(product.id)}
              />
            ))}
          </div>

          {displayedProducts.length === 0 && (
            <div className="text-center py-12 text-[#5B6B67] dark:text-[#9DB0AB] text-xs">
              No products found in this category.
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#171D1B]/95 backdrop-blur-md border-t border-[#CBD5D2]/50 dark:border-[#3A4642]/60 p-3 shadow-lg">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button
            onClick={() => toggleFollowShop(shop.id)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shrink-0 ${
              isFollowed
                ? 'bg-rose-50 text-rose-500 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-900/60'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
            aria-label="Follow store"
          >
            <Heart className={`w-5 h-5 ${isFollowed ? 'fill-current' : ''}`} />
          </button>

          {shop.supportsSelfCheckout ? (
            <button
              onClick={handleStartSelfCheckout}
              className="flex-1 h-12 rounded-2xl bg-[#0F766E] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#0c615b] active:scale-95 transition-all shadow-md"
            >
              <QrCode className="w-5 h-5" />
              <span>Scan & Pay In Store</span>
            </button>
          ) : (
            <button
              onClick={() => {
                showSnackbar({ message: 'Select products from catalogue above to browse', type: 'info' });
              }}
              className="flex-1 h-12 rounded-2xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Browse Full Catalogue</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
