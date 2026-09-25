import React from 'react';
import { useShopGenie } from '../../context/ShopGenieContext';
import { MapPin, Bell, ChevronDown, User, Map as MapIcon } from 'lucide-react';

export const GenieTopBar: React.FC = () => {
  const {
    currentArea,
    setIsAreaPickerOpen,
    setIsNotificationsOpen,
    unreadNotificationsCount,
    setIsProfileOpen,
    customerTab,
    setCustomerTab
  } = useShopGenie();

  // Shorten area string for compact mobile display
  const shortArea = currentArea.split(',')[0] || currentArea;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 py-2.5 border-b border-slate-200/70 transition-colors">
      <div className="flex items-center justify-between gap-2 max-w-5xl mx-auto">
        {/* Left: Location Pill Selector */}
        <button
          onClick={() => setIsAreaPickerOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 text-left transition-all max-w-[240px] shadow-2xs group"
          aria-label="Change neighbourhood"
        >
          <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold text-slate-800 truncate">
            {shortArea}
          </span>
          <ChevronDown className="w-3 h-3 text-slate-500 shrink-0" />
        </button>

        {/* Right Action Icons: Map shortcut, Notifications & Profile */}
        <div className="flex items-center gap-2">
          {/* Map Shortcut Toggle */}
          <button
            onClick={() => setCustomerTab(customerTab === 'map' ? 'home' : 'map')}
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
              customerTab === 'map'
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs'
            }`}
            title="Toggle Nearest Shops Map"
            aria-label="Toggle Map"
          >
            <MapIcon className="w-4 h-4" />
          </button>

          {/* Notifications Bell Button */}
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs flex items-center justify-center transition-all relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* User Profile Button */}
          <button
            onClick={() => setIsProfileOpen(true)}
            className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs flex items-center justify-center transition-all"
            aria-label="User Profile"
          >
            <User className="w-4 h-4 text-slate-700" />
          </button>
        </div>
      </div>
    </header>
  );
};
