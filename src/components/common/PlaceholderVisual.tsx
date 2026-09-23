import React from 'react';
import { ShopCategory } from '../../types';
import { 
  Store, 
  UtensilsCrossed, 
  Sparkles, 
  Shirt, 
  Coffee, 
  Smartphone, 
  Compass, 
  Gem, 
  Pill, 
  Home 
} from 'lucide-react';
import { CATEGORY_METAS } from '../../utils/categoryTheme';

interface Props {
  category: ShopCategory;
  name: string;
  className?: string;
  type?: 'cover' | 'logo' | 'product';
  badgeText?: string;
}

export const PlaceholderVisual: React.FC<Props> = ({
  category,
  name,
  className = '',
  type = 'cover',
  badgeText
}) => {
  const meta = CATEGORY_METAS[category] || CATEGORY_METAS['Supermarket'];

  const getIcon = () => {
    switch (category) {
      case 'Supermarket':
        return <Store className={type === 'logo' ? 'w-5 h-5' : 'w-8 h-8'} />;
      case 'Food Cart':
        return <UtensilsCrossed className={type === 'logo' ? 'w-5 h-5' : 'w-8 h-8'} />;
      case 'Pop-up Store':
        return <Sparkles className={type === 'logo' ? 'w-5 h-5' : 'w-8 h-8'} />;
      case 'Fashion & Apparel':
        return <Shirt className={type === 'logo' ? 'w-5 h-5' : 'w-8 h-8'} />;
      case 'Bakery & Cafe':
        return <Coffee className={type === 'logo' ? 'w-5 h-5' : 'w-8 h-8'} />;
      case 'Electronics & Gadgets':
        return <Smartphone className={type === 'logo' ? 'w-5 h-5' : 'w-8 h-8'} />;
      case 'Moto & Auto Gear':
        return <Compass className={type === 'logo' ? 'w-5 h-5' : 'w-8 h-8'} />;
      case 'Boutique':
        return <Gem className={type === 'logo' ? 'w-5 h-5' : 'w-8 h-8'} />;
      case 'Pharmacy':
        return <Pill className={type === 'logo' ? 'w-5 h-5' : 'w-8 h-8'} />;
      case 'Home & Decor':
        return <Home className={type === 'logo' ? 'w-5 h-5' : 'w-8 h-8'} />;
      default:
        return <Store className={type === 'logo' ? 'w-5 h-5' : 'w-8 h-8'} />;
    }
  };

  if (type === 'logo') {
    return (
      <div 
        className={`rounded-2xl flex items-center justify-center font-bold text-sm shadow-sm border border-black/5 dark:border-white/10 ${className}`}
        style={{
          backgroundColor: meta.iconBgLight,
          color: meta.textLight
        }}
      >
        {getIcon()}
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden flex flex-col justify-end p-4 select-none ${className}`}
      style={{
        background: `linear-gradient(145deg, ${meta.bgLight} 0%, ${meta.borderLight} 100%)`
      }}
    >
      {/* Decorative vector geometric wave */}
      <svg
        className="absolute inset-0 w-full h-full opacity-35 pointer-events-none"
        viewBox="0 0 200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,40 C50,90 120,10 200,60 L200,120 L0,120 Z"
          fill={meta.accentColor}
          fillOpacity="0.18"
        />
        <circle cx="170" cy="30" r="35" fill={meta.accentColor} fillOpacity="0.1" />
        <circle cx="30" cy="20" r="18" fill={meta.accentColor} fillOpacity="0.08" />
      </svg>

      {/* Floating Center Icon */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-3.5 rounded-2xl shadow-sm border border-white/60 dark:border-white/15 backdrop-blur-xs transition-transform duration-300 group-hover:scale-110"
        style={{
          backgroundColor: meta.iconBgLight,
          color: meta.textLight
        }}
      >
        {getIcon()}
      </div>

      {badgeText && (
        <div className="absolute top-3 left-3 z-10">
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/95 dark:bg-black/85 text-slate-800 dark:text-slate-200 shadow-xs border border-black/5 backdrop-blur-xs">
            {badgeText}
          </span>
        </div>
      )}

      {/* Title snippet overlay */}
      <div className="relative z-10 mt-auto">
        <span 
          className="text-xs font-semibold tracking-tight line-clamp-1 drop-shadow-xs"
          style={{ color: meta.textLight }}
        >
          {name}
        </span>
      </div>
    </div>
  );
};
