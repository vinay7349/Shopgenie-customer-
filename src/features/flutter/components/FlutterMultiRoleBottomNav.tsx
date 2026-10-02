import React from 'react';
import { 
  Home, 
  MapPin, 
  Search, 
  QrCode, 
  ShoppingBag, 
  Store, 
  Package, 
  Receipt, 
  Send, 
  ShieldCheck, 
  History, 
  Radio, 
  CheckSquare, 
  TrendingUp, 
  Server
} from 'lucide-react';
import { DeckRole } from '../flutterDeckTypes';

interface FlutterMultiRoleBottomNavProps {
  role: DeckRole;
  shopperTab: 'home' | 'map' | 'scan' | 'search' | 'cart';
  setShopperTab: (tab: 'home' | 'map' | 'scan' | 'search' | 'cart') => void;
  cartCount: number;
}

export const FlutterMultiRoleBottomNav: React.FC<FlutterMultiRoleBottomNavProps> = ({
  role,
  shopperTab,
  setShopperTab,
  cartCount
}) => {
  if (role !== 'shopper') {
    // For verifier, subtabs are displayed in their top header for fast thumb access
    return null;
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#141C1A]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5">
      <div className="grid grid-cols-5 items-center max-w-sm mx-auto">
        {/* 1. Home */}
        <button
          onClick={() => setShopperTab('home')}
          className={`flex flex-col items-center py-1 transition-colors ${
            shopperTab === 'home'
              ? 'text-[#0F766E] dark:text-[#5EEAD4] font-bold'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </button>

        {/* 2. Map */}
        <button
          onClick={() => setShopperTab('map')}
          className={`flex flex-col items-center py-1 transition-colors ${
            shopperTab === 'map'
              ? 'text-[#0F766E] dark:text-[#5EEAD4] font-bold'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Map</span>
        </button>

        {/* 3. Center Elevated Floating Scan & Pay */}
        <div className="flex flex-col items-center -mt-6">
          <button
            onClick={() => setShopperTab('scan')}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
              shopperTab === 'scan'
                ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/30'
                : 'bg-gradient-to-tr from-[#0F766E] to-[#14B8A6] text-white ring-4 ring-white dark:ring-[#141C1A]'
            }`}
          >
            <QrCode className="w-5 h-5" />
          </button>
          <span className="text-[10px] font-bold text-[#0F766E] dark:text-[#5EEAD4] mt-0.5">
            Scan & Pay
          </span>
        </div>

        {/* 4. Search */}
        <button
          onClick={() => setShopperTab('search')}
          className={`flex flex-col items-center py-1 transition-colors ${
            shopperTab === 'search'
              ? 'text-[#0F766E] dark:text-[#5EEAD4] font-bold'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Search</span>
        </button>

        {/* 5. Cart */}
        <button
          onClick={() => setShopperTab('cart')}
          className={`flex flex-col items-center py-1 transition-colors relative ${
            shopperTab === 'cart'
              ? 'text-[#0F766E] dark:text-[#5EEAD4] font-bold'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-amber-500 text-slate-950 text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-[#141C1A]">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">Cart</span>
        </button>
      </div>
    </div>
  );
};
