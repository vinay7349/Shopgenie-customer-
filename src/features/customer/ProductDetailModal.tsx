import React, { useState } from 'react';
import { useShopGenie } from '../../context/ShopGenieContext';
import { PlaceholderVisual } from '../../components/common/PlaceholderVisual';
import { StatusPill, PriceText, QuantityStepper } from '../../components/common/Components';
import { X, Plus, ShoppingBag, Barcode, ShieldCheck, Share2 } from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { 
    selectedProductId, 
    setSelectedProductId, 
    products, 
    shops, 
    addToCart,
    showSnackbar 
  } = useShopGenie();

  const [quantity, setQuantity] = useState(1);

  if (!selectedProductId) return null;

  const product = products.find((p) => p.id === selectedProductId);
  if (!product) return null;

  const shop = shops.find((s) => s.id === product.shopId);

  const handleAdd = () => {
    addToCart(product, shop, quantity);
    setSelectedProductId(null);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText?.(`${product.name} at ${shop?.name || 'ShopGenie'}`);
    showSnackbar({ message: 'Product link copied', type: 'info' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-[#171D1B] rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-8 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative h-64 w-full shrink-0">
          <PlaceholderVisual
            category={product.category}
            name={product.name}
            type="cover"
            className="w-full h-full"
          />
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-black/60 text-white backdrop-blur-md">
              {product.category}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-md hover:bg-black/60 transition-colors"
                aria-label="Share product"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSelectedProductId(null)}
                className="w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-md hover:bg-black/60 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs text-[#0F766E] dark:text-[#5EEAD4] font-semibold">
                {shop?.name || 'Local Store'}
              </span>
              <StatusPill
                type={
                  product.stock > 10
                    ? 'in_stock'
                    : product.stock > 0
                    ? 'low_stock'
                    : 'out_of_stock'
                }
              />
            </div>
            <h2 className="font-heading font-bold text-lg sm:text-xl text-[#0F1F1C] dark:text-[#E8F0EE]">
              {product.name}
            </h2>
            <div className="mt-2">
              <PriceText
                price={product.price}
                mrp={product.mrp}
                discountPct={product.discountPct}
                size="lg"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#5B6B67] dark:text-[#9DB0AB]">
              Product Overview
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Barcode & Shelf details */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs text-[#5B6B67] dark:text-[#9DB0AB]">
            <div className="flex items-center gap-2">
              <Barcode className="w-4 h-4 text-[#0F766E]" />
              <span>Barcode EAN-13:</span>
            </div>
            <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
              {product.barcode}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[#5B6B67] dark:text-[#9DB0AB]">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Verified shelf price · 100% authentic local inventory</span>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-slate-50 dark:bg-[#131917] border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <QuantityStepper
            quantity={quantity}
            max={product.stock}
            onIncrease={() => setQuantity((q) => Math.min(product.stock, q + 1))}
            onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
            className="h-12 px-2"
          />

          <button
            onClick={handleAdd}
            disabled={product.stock <= 0}
            className="flex-1 h-12 rounded-2xl bg-[#0F766E] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#0c615b] active:scale-95 disabled:opacity-40 transition-all shadow-md"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add to Cart (₹{(product.price * quantity).toLocaleString('en-IN')})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
