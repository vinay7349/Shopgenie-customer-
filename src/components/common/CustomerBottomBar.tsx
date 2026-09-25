import React from 'react';
import { useShopGenie } from '../../context/ShopGenieContext';
import { Home, MapPin, Search, QrCode, ShoppingBag } from 'lucide-react';

export const CustomerBottomBar: React.FC = () => {
  const { customerTab, setCustomerTab, cart, setSelectedShopId } = useShopGenie();

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleTabClick = (tab: 'home' | 'map' | 'search' | 'scan' | 'cart' | 'feed') => {
    setSelectedShopId(null);
    setCustomerTab(tab);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#171D1B]/95 backdrop-blur-md border-t border-[#CBD5D2]/50 dark:border-[#3A4642]/60 px-2 py-1.5 transition-colors">
      <div className="max-w-md mx-auto grid grid-cols-5 items-center relative">
        {/* 1. Home Tab */}
        <button
          onClick={() => handleTabClick('home')}
          className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[48px] ${
            customerTab === 'home'
              ? 'text-[#0F766E] dark:text-[#5EEAD4] font-semibold'
              : 'text-[#5B6B67] dark:text-[#9DB0AB] hover:text-[#0F1F1C] dark:hover:text-white'
          }`}
          aria-label="Home tab"
        >
          <Home className={`w-5 h-5 transition-transform duration-150 ${customerTab === 'home' ? 'scale-110' : ''}`} />
          <span className="text-[10px] mt-1 tracking-tight">Home</span>
        </button>

        {/* 2. Interactive Map Tab */}
        <button
          onClick={() => handleTabClick('map')}
          className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[48px] relative ${
            customerTab === 'map'
              ? 'text-[#0F766E] dark:text-[#5EEAD4] font-semibold'
              : 'text-[#5B6B67] dark:text-[#9DB0AB] hover:text-[#0F1F1C] dark:hover:text-white'
          }`}
          aria-label="Nearby Map tab"
        >
          <div className="relative">
            <MapPin className={`w-5 h-5 transition-transform duration-150 ${customerTab === 'map' ? 'scale-110' : ''}`} />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Map</span>
        </button>

        {/* 3. Center Floating Scan & Pay Button */}
        <div className="flex flex-col items-center -mt-6">
          <button
            onClick={() => handleTabClick('scan')}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 active:scale-95 ${
              customerTab === 'scan'
                ? 'bg-[#F59E0B] text-slate-950 ring-4 ring-[#F59E0B]/30'
                : 'bg-gradient-to-tr from-[#0F766E] to-[#14B8A6] text-white hover:brightness-110 ring-4 ring-white dark:ring-[#171D1B]'
            }`}
            aria-label="Scan & Pay Self Checkout"
          >
            <QrCode className="w-6 h-6 stroke-[2.2]" />
          </button>
          <span className="text-[10px] font-bold text-[#0F766E] dark:text-[#5EEAD4] mt-1 tracking-tight">
            Scan & Pay
          </span>
        </div>

        {/* 4. Search Tab */}
        <button
          onClick={() => handleTabClick('search')}
          className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[48px] ${
            customerTab === 'search'
              ? 'text-[#0F766E] dark:text-[#5EEAD4] font-semibold'
              : 'text-[#5B6B67] dark:text-[#9DB0AB] hover:text-[#0F1F1C] dark:hover:text-white'
          }`}
          aria-label="Search tab"
        >
          <Search className={`w-5 h-5 transition-transform duration-150 ${customerTab === 'search' ? 'scale-110' : ''}`} />
          <span className="text-[10px] mt-1 tracking-tight">Search</span>
        </button>

        {/* 5. Cart Tab with Badge */}
        <button
          onClick={() => handleTabClick('cart')}
          className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[48px] relative ${
            customerTab === 'cart'
              ? 'text-[#0F766E] dark:text-[#5EEAD4] font-semibold'
              : 'text-[#5B6B67] dark:text-[#9DB0AB] hover:text-[#0F1F1C] dark:hover:text-white'
          }`}
          aria-label="Cart tab"
        >
          <div className="relative">
            <ShoppingBag className={`w-5 h-5 transition-transform duration-150 ${customerTab === 'cart' ? 'scale-110' : ''}`} />
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#F59E0B] text-slate-950 text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-[#171D1B] animate-bounce">
                {totalCartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Cart</span>
        </button>
      </div>
    </nav>
  );
};
