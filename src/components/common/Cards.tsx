import React from 'react';
import { Shop, Product, Offer } from '../../types';
import { useShopGenie } from '../../context/ShopGenieContext';
import { PlaceholderVisual } from './PlaceholderVisual';
import { DistanceLabel, RatingBadge, StatusPill, PriceText } from './Components';
import { Heart, Plus, Sparkles, Clock, ArrowRight } from 'lucide-react';

// 1. Shop Card
export const ShopCard: React.FC<{
  shop: Shop;
  onClick: () => void;
  layout?: 'grid' | 'row';
}> = ({ shop, onClick, layout = 'grid' }) => {
  const { followedShopIds, toggleFollowShop } = useShopGenie();
  const isFollowed = followedShopIds.includes(shop.id);

  if (layout === 'row') {
    return (
      <div
        onClick={onClick}
        className="group relative bg-white dark:bg-[#171D1B] rounded-2xl p-3 border border-[#CBD5D2]/50 dark:border-[#3A4642]/60 hover:border-[#0F766E]/60 transition-all cursor-pointer shadow-2xs hover:shadow-sm flex items-center gap-3.5"
      >
        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
          <PlaceholderVisual category={shop.category} name={shop.name} className="w-full h-full" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <StatusPill type={shop.isOpen ? 'open' : 'closed'} />
            {shop.supportsSelfCheckout && <StatusPill type="self_checkout" />}
          </div>
          <h4 className="font-heading font-semibold text-sm text-[#0F1F1C] dark:text-[#E8F0EE] truncate group-hover:text-[#0F766E] transition-colors">
            {shop.name}
          </h4>
          <p className="text-xs text-[#5B6B67] dark:text-[#9DB0AB] truncate mt-0.5">{shop.address}</p>
          <div className="flex items-center gap-3 mt-2">
            <RatingBadge rating={shop.rating} reviewCount={shop.reviewCount} />
            <span className="text-[#CBD5D2] dark:text-[#3A4642]">·</span>
            <DistanceLabel distanceM={shop.distanceM} />
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFollowShop(shop.id);
          }}
          className={`p-2.5 rounded-full transition-colors shrink-0 ${
            isFollowed
              ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/30'
              : 'text-[#5B6B67] hover:text-rose-500 bg-slate-100 dark:bg-slate-800'
          }`}
          aria-label={isFollowed ? 'Unfollow store' : 'Follow store'}
        >
          <Heart className={`w-4 h-4 ${isFollowed ? 'fill-current' : ''}`} />
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="group relative bg-white dark:bg-[#171D1B] rounded-2xl overflow-hidden border border-[#CBD5D2]/50 dark:border-[#3A4642]/60 hover:border-[#0F766E]/60 transition-all cursor-pointer shadow-2xs hover:shadow-md flex flex-col"
    >
      {/* Cover Visual */}
      <div className="relative h-28 w-full overflow-hidden">
        <PlaceholderVisual category={shop.category} name={shop.name} className="w-full h-full" />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5">
          <StatusPill type={shop.isOpen ? 'open' : 'closed'} />
        </div>

        {/* Follow Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFollowShop(shop.id);
          }}
          className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-all ${
            isFollowed
              ? 'bg-rose-500 text-white shadow-xs'
              : 'bg-white/80 dark:bg-black/60 text-slate-700 dark:text-slate-200 hover:text-rose-500'
          }`}
          aria-label="Follow"
        >
          <Heart className={`w-3.5 h-3.5 ${isFollowed ? 'fill-current' : ''}`} />
        </button>

        {/* Bottom Mode Pill */}
        <div className="absolute bottom-2 left-2">
          {shop.supportsSelfCheckout ? (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-900/80 text-teal-200 backdrop-blur-md border border-teal-500/30 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-[#F59E0B]" />
              Self-checkout
            </span>
          ) : (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-black/60 text-slate-200 backdrop-blur-md">
              Browse only
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-3 flex-1 flex flex-col">
        <h4 className="font-heading font-semibold text-xs sm:text-sm text-[#0F1F1C] dark:text-[#E8F0EE] line-clamp-1 group-hover:text-[#0F766E] transition-colors">
          {shop.name}
        </h4>
        <p className="text-[11px] text-[#5B6B67] dark:text-[#9DB0AB] mt-0.5 truncate">
          {shop.category}
        </p>

        <div className="mt-auto pt-2 flex items-center justify-between text-xs border-t border-slate-100 dark:border-slate-800/80">
          <DistanceLabel distanceM={shop.distanceM} />
          <RatingBadge rating={shop.rating} />
        </div>
      </div>
    </div>
  );
};

// 2. Product Card
export const ProductCard: React.FC<{
  product: Product;
  shop?: Shop;
  onClick: () => void;
  onAddToCart?: () => void;
}> = ({ product, shop, onClick, onAddToCart }) => {
  const { addToCart, shops } = useShopGenie();
  const parentShop = shop || shops.find((s) => s.id === product.shopId);

  return (
    <div
      onClick={onClick}
      className="group relative bg-white dark:bg-[#171D1B] rounded-2xl overflow-hidden border border-[#CBD5D2]/50 dark:border-[#3A4642]/60 hover:border-[#0F766E]/60 transition-all cursor-pointer shadow-2xs hover:shadow-md flex flex-col"
    >
      {/* Product Image / Visual */}
      <div className="relative h-32 w-full overflow-hidden">
        <PlaceholderVisual
          category={product.category}
          name={product.name}
          type="product"
          className="w-full h-full"
        />

        {product.discountPct > 0 && (
          <div className="absolute top-2 left-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#6D5EF5] text-white shadow-xs">
              {product.discountPct}% OFF
            </span>
          </div>
        )}

        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute bottom-2 left-2">
            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-amber-500 text-white">
              Only {product.stock} left
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-heading font-semibold text-xs sm:text-sm text-[#0F1F1C] dark:text-[#E8F0EE] line-clamp-2 group-hover:text-[#0F766E] transition-colors">
            {product.name}
          </h4>
          {parentShop && (
            <p className="text-[11px] text-[#5B6B67] dark:text-[#9DB0AB] truncate mt-1">
              {parentShop.name} · {parentShop.distanceM}m
            </p>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between gap-1">
          <PriceText price={product.price} mrp={product.mrp} size="sm" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onAddToCart) {
                onAddToCart();
              } else {
                addToCart(product, parentShop);
              }
            }}
            className="w-8 h-8 rounded-xl bg-[#0F766E] text-white flex items-center justify-center hover:bg-[#0d645e] active:scale-95 shadow-xs transition-all shrink-0"
            aria-label="Add to cart"
            title="Add to cart"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. Offer Card
export const OfferCard: React.FC<{
  offer: Offer;
  onClaim?: () => void;
  onClick?: () => void;
}> = ({ offer, onClaim, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="relative rounded-2xl overflow-hidden p-4 text-white shadow-md border border-white/10 transition-transform duration-200 hover:scale-[1.01] cursor-pointer"
      style={{
        background: `linear-gradient(135deg, ${
          offer.type === 'percentage'
            ? '#0F766E 0%, #115E59 100%'
            : offer.type === 'bogo'
            ? '#7C3AED 0%, #4C1D95 100%'
            : '#D97706 0%, #92400E 100%'
        })`
      }}
    >
      {/* Decorative spark pattern */}
      <svg className="absolute -right-4 -bottom-4 w-28 h-28 opacity-15" viewBox="0 0 100 100">
        <polygon points="50,0 60,35 95,35 68,57 78,92 50,70 22,92 32,57 5,35 40,35" fill="white" />
      </svg>

      <div className="relative z-10 flex flex-col justify-between h-full">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-200 bg-white/15 px-2 py-0.5 rounded-full backdrop-blur-xs">
            {offer.shopName}
          </span>
          {offer.isEndingSoon && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F59E0B] text-black flex items-center gap-1 animate-pulse">
              <Clock className="w-2.5 h-2.5" />
              Ending soon
            </span>
          )}
        </div>

        <div className="my-2.5">
          <h4 className="font-heading font-extrabold text-base sm:text-lg leading-snug">
            {offer.title}
          </h4>
          <p className="text-xs text-slate-100/90 line-clamp-2 mt-1 font-light">
            {offer.description}
          </p>
        </div>

        <div className="mt-2 pt-2 border-t border-white/20 flex items-center justify-between text-xs">
          <span className="font-mono bg-black/25 px-2 py-1 rounded text-amber-200 font-semibold tracking-wider">
            {offer.code}
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-white group-hover:translate-x-1 transition-transform">
            View offer <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
