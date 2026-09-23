import React, { useState } from 'react';
import { useShopGenie } from '../../context/ShopGenieContext';
import { ALL_CATEGORIES } from '../../utils/categoryTheme';
import { ShopCategory, Product } from '../../types';
import { identifyProductWithAi, AiIdentificationResult } from '../../services/geminiService';
import { 
  X, 
  Sparkles, 
  Barcode, 
  Check, 
  AlertTriangle, 
  Camera, 
  Loader2, 
  Plus 
} from 'lucide-react';

export const OwnerProductEditorModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}> = ({ isOpen, onClose, productToEdit }) => {
  const { addProduct, updateProductStock, showSnackbar } = useShopGenie();

  const [name, setName] = useState(productToEdit?.name || '');
  const [category, setCategory] = useState<ShopCategory>(productToEdit?.category || 'Bakery & Cafe');
  const [price, setPrice] = useState<string>(productToEdit ? String(productToEdit.price) : '250');
  const [mrp, setMrp] = useState<string>(productToEdit ? String(productToEdit.mrp) : '299');
  const [stock, setStock] = useState<string>(productToEdit ? String(productToEdit.stock) : '20');
  const [barcode, setBarcode] = useState(productToEdit?.barcode || `890100${Math.floor(100000 + Math.random() * 900000)}`);
  const [description, setDescription] = useState(productToEdit?.description || '');

  // AI State
  const [isAiScanning, setIsAiScanning] = useState(false);
  const [aiResult, setAiResult] = useState<AiIdentificationResult | null>(null);

  if (!isOpen) return null;

  const handleIdentifyWithAi = async () => {
    setIsAiScanning(true);
    setAiResult(null);
    try {
      const res = await identifyProductWithAi(name || 'Retail package on shelf');
      setAiResult(res);
      showSnackbar({ message: `AI identified "${res.productName}" with ${Math.round(res.confidence * 100)}% confidence`, type: 'info' });
    } catch (err) {
      showSnackbar({ message: 'AI identification failed, try manual entry', type: 'error' });
    } finally {
      setIsAiScanning(false);
    }
  };

  const applyAiSuggestion = (suggestion: AiIdentificationResult) => {
    setName(suggestion.productName);
    setCategory(suggestion.category);
    setPrice(String(suggestion.suggestedPrice));
    setMrp(String(suggestion.suggestedMrp));
    setDescription(suggestion.description);
    showSnackbar({ message: 'Applied AI suggested details!', type: 'success' });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showSnackbar({ message: 'Please enter a product name', type: 'warning' });
      return;
    }

    const numPrice = Number(price) || 0;
    const numMrp = Number(mrp) || numPrice;
    const discountPct = numMrp > numPrice ? Math.round(((numMrp - numPrice) / numMrp) * 100) : 0;

    addProduct({
      shopId: 'shop-1',
      name: name.trim(),
      category,
      price: numPrice,
      mrp: numMrp,
      discountPct,
      stock: Number(stock) || 0,
      imageUrls: [],
      barcode: barcode.trim(),
      description: description.trim() || 'Locally sourced and stocked.'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-[#171D1B] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-violet-500/15 text-violet-600 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <h3 className="font-heading font-bold text-base text-[#0F1F1C] dark:text-[#E8F0EE]">
              {productToEdit ? 'Edit Product' : 'Add New Product'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* 1. Identify with AI Action Banner (Section 5.20) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-600/10 via-purple-600/10 to-indigo-600/10 border border-violet-500/30">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> ShopGenie AI Vision Assistant
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
                  Point camera at package or shelf to auto-fill title, category & price
                </p>
              </div>

              <button
                type="button"
                onClick={handleIdentifyWithAi}
                disabled={isAiScanning}
                className="px-3.5 py-2 rounded-xl bg-[#6D5EF5] hover:bg-[#5b4be0] active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs shrink-0 transition-all disabled:opacity-50"
              >
                {isAiScanning ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-3.5 h-3.5" />
                    <span>Identify with AI</span>
                  </>
                )}
              </button>
            </div>

            {/* AI Suggestion Card preview */}
            {aiResult && (
              <div className="mt-3 p-3 bg-white dark:bg-[#1a1f28] rounded-xl border border-violet-300 dark:border-violet-800 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-violet-700 dark:text-violet-300">
                    Suggested: {aiResult.productName}
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-violet-100 dark:bg-violet-900/60 text-violet-800 dark:text-violet-200 px-2 py-0.5 rounded-full">
                    {Math.round(aiResult.confidence * 100)}% match
                  </span>
                </div>

                {/* Confidence Bar */}
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-violet-600 rounded-full"
                    style={{ width: `${aiResult.confidence * 100}%` }}
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => applyAiSuggestion(aiResult)}
                    className="px-3 py-1 rounded-lg bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 transition-colors"
                  >
                    Accept Suggestions
                  </button>
                  <span className="text-[10px] text-[#5B6B67] dark:text-[#9DB0AB] italic">
                    Suggestions may be wrong, please review.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Product Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#5B6B67] dark:text-[#9DB0AB]">
              Product Title *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Arabica Whole Coffee Beans (250g)"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#131917] border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-[#0F766E]"
            />
          </div>

          {/* Category Dropdown */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#5B6B67] dark:text-[#9DB0AB]">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ShopCategory)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#131917] border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-[#0F766E]"
            >
              {ALL_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Prices Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#5B6B67] dark:text-[#9DB0AB]">
                Selling Price (₹) *
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#131917] border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-[#0F766E]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#5B6B67] dark:text-[#9DB0AB]">
                MRP (₹)
              </label>
              <input
                type="number"
                value={mrp}
                onChange={(e) => setMrp(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#131917] border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-[#0F766E]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#5B6B67] dark:text-[#9DB0AB]">
                Units in Stock
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#131917] border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-[#0F766E]"
              />
            </div>
          </div>

          {/* Barcode */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#5B6B67] dark:text-[#9DB0AB] flex items-center justify-between">
              <span>Barcode / EAN-13</span>
              <button
                type="button"
                onClick={() => setBarcode(`890100${Math.floor(100000 + Math.random() * 900000)}`)}
                className="text-[11px] text-[#0F766E] hover:underline"
              >
                Generate Barcode
              </button>
            </label>
            <div className="relative">
              <input
                type="text"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#131917] border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-mono text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-[#0F766E]"
              />
              <Barcode className="w-5 h-5 text-slate-400 absolute right-3 top-3" />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#5B6B67] dark:text-[#9DB0AB]">
              Product Notes / Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Origin details, flavour notes, organic certification..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#131917] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-[#0F766E]"
            />
          </div>

          {/* Save Action */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-2xl bg-[#0F766E] text-white font-bold text-xs hover:bg-[#0c615b] active:scale-95 shadow-md transition-all"
            >
              Save Product Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
