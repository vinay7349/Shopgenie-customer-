import React from 'react';
import { Star, Navigation, Plus, Minus, Check, AlertCircle, Info, Sparkles } from 'lucide-react';
import { ShopCategory } from '../../types';
import { CATEGORY_METAS } from '../../utils/categoryTheme';

// 1. Status Pill
interface StatusPillProps {
  type: 'open' | 'closed' | 'self_checkout' | 'discovery' | 'in_stock' | 'low_stock' | 'out_of_stock';
  className?: string;
}

export const StatusPill: React.FC<StatusPillProps> = ({ type, className = '' }) => {
  switch (type) {
    case 'open':
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Open
        </span>
      );
    case 'closed':
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 ${className}`}>
          Closed
        </span>
      );
    case 'self_checkout':
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#0F766E]/15 text-[#0F766E] dark:text-[#5EEAD4] border border-[#0F766E]/25 ${className}`}>
          <Sparkles className="w-3 h-3 text-[#F59E0B]" />
          Self-checkout
        </span>
      );
    case 'discovery':
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-500/10 text-slate-600 dark:text-slate-300 border border-slate-500/20 ${className}`}>
          Browse only
        </span>
      );
    case 'in_stock':
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 ${className}`}>
          In stock
        </span>
      );
    case 'low_stock':
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/20 ${className}`}>
          Low stock
        </span>
      );
    case 'out_of_stock':
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-500/10 text-slate-500 dark:text-slate-400 border border-slate-500/20 ${className}`}>
          Out of stock
        </span>
      );
    default:
      return null;
  }
};

// 2. Distance Label
export const DistanceLabel: React.FC<{ distanceM: number; className?: string }> = ({
  distanceM,
  className = ''
}) => {
  const formatted = distanceM >= 1000 ? `${(distanceM / 1000).toFixed(1)} km` : `${distanceM} m`;
  return (
    <span className={`inline-flex items-center gap-1 text-[12px] font-medium text-[#5B6B67] dark:text-[#9DB0AB] ${className}`}>
      <Navigation className="w-3 h-3 text-[#0F766E] dark:text-[#5EEAD4] rotate-45" />
      <span>{formatted}</span>
    </span>
  );
};

// 3. Rating Badge
export const RatingBadge: React.FC<{ rating: number; reviewCount?: number; className?: string }> = ({
  rating,
  reviewCount,
  className = ''
}) => {
  return (
    <div className={`inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-400 ${className}`}>
      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
      <span>{rating.toFixed(1)}</span>
      {reviewCount !== undefined && (
        <span className="text-[11px] font-normal text-[#5B6B67] dark:text-[#9DB0AB]">({reviewCount})</span>
      )}
    </div>
  );
};

// 4. Price Text
export const PriceText: React.FC<{
  price: number;
  mrp?: number;
  discountPct?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}> = ({ price, mrp, discountPct, className = '', size = 'md' }) => {
  const textSize = size === 'lg' ? 'text-lg font-bold' : size === 'sm' ? 'text-xs font-semibold' : 'text-sm font-bold';

  return (
    <div className={`inline-flex items-baseline gap-1.5 ${className}`}>
      <span className={`${textSize} text-[#0F1F1C] dark:text-[#E8F0EE] tracking-tight`}>
        ₹{price.toLocaleString('en-IN')}
      </span>
      {mrp && mrp > price && (
        <span className="text-xs text-[#5B6B67] dark:text-[#9DB0AB] line-through font-normal">
          ₹{mrp.toLocaleString('en-IN')}
        </span>
      )}
      {discountPct && discountPct > 0 && (
        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-sm">
          {discountPct}% OFF
        </span>
      )}
    </div>
  );
};

// 5. Quantity Stepper
export const QuantityStepper: React.FC<{
  quantity: number;
  max: number;
  onIncrease: () => void;
  onDecrease: () => void;
  className?: string;
}> = ({ quantity, max, onIncrease, onDecrease, className = '' }) => {
  return (
    <div className={`inline-flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700 ${className}`}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDecrease();
        }}
        className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 active:scale-95 transition-all"
        aria-label="Decrease quantity"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span className="w-8 text-center text-xs font-bold text-slate-900 dark:text-slate-100 font-mono">
        {quantity}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (quantity < max) onIncrease();
        }}
        disabled={quantity >= max}
        className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 active:scale-95 disabled:opacity-40 transition-all"
        aria-label="Increase quantity"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

// 6. Category Chip
export const CategoryChip: React.FC<{
  category: ShopCategory | 'All';
  isSelected: boolean;
  onClick: () => void;
}> = ({ category, isSelected, onClick }) => {
  const meta = category === 'All' ? null : CATEGORY_METAS[category];

  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 select-none ${
        isSelected
          ? 'bg-[#0F766E] text-white shadow-xs'
          : 'bg-white dark:bg-[#171D1B] text-[#5B6B67] dark:text-[#9DB0AB] hover:text-[#0F1F1C] dark:hover:text-white border border-[#CBD5D2]/40 dark:border-[#3A4642]'
      }`}
    >
      {meta && (
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: meta.accentColor }}
        />
      )}
      <span>{category === 'All' ? 'All Shops' : category}</span>
    </button>
  );
};

// 7. Global Snackbar Component
export const GlobalSnackbar: React.FC<{
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  type?: 'info' | 'success' | 'warning' | 'error';
  onDismiss: () => void;
}> = ({ message, actionLabel, onAction, type = 'info', onDismiss }) => {
  return (
    <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="bg-[#171D1B] dark:bg-black/90 text-white px-4 py-3 rounded-2xl shadow-xl border border-white/10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {type === 'success' && <Check className="w-4 h-4 text-[#5EEAD4] shrink-0" />}
          {type === 'warning' && <AlertCircle className="w-4 h-4 text-[#FBBF24] shrink-0" />}
          {type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
          {type === 'info' && <Info className="w-4 h-4 text-[#5EEAD4] shrink-0" />}
          <span className="text-xs font-medium leading-relaxed">{message}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {actionLabel && onAction && (
            <button
              onClick={() => {
                onAction();
                onDismiss();
              }}
              className="text-xs font-bold text-[#F59E0B] hover:text-[#FBBF24] active:scale-95 px-2 py-1 rounded-lg hover:bg-white/10 transition-colors uppercase tracking-wider"
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
