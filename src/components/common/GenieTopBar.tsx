import React from 'react';
import { useShopGenie } from '../../context/ShopGenieContext';
import { MapPin, Bell, ChevronDown, User, Code2, ShieldAlert } from 'lucide-react';
import { ShopGenieLogo } from './ShopGenieLogo';

export const GenieTopBar: React.FC = () => {
  const {
    currentArea,
    setIsAreaPickerOpen,
    setIsNotificationsOpen,
    unreadNotificationsCount,
    currentUser,
    setIsProfileOpen,
    setIsCodeModalOpen,
    currentUser: { role }
  } = useShopGenie();

  // Shorten area string for compact mobile display
  const shortArea = currentArea.split(',')[0] || currentArea;

  return (
    <header className="sticky top-0 z-30 bg-[#F7F8FA]/90 dark:bg-[#0F1412]/90 backdrop-blur-md px-4 py-3 border-b border-[#CBD5D2]/40 dark:border-[#3A4642]/50 transition-colors">
      <div className="flex items-center justify-between gap-2 max-w-5xl mx-auto">
        {/* Left: Location Chip Trigger */}
        <button
          onClick={() => setIsAreaPickerOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#171D1B] border border-[#CBD5D2]/60 dark:border-[#3A4642] text-left hover:border-[#0F766E] transition-colors max-w-[200px] shadow-2xs group"
          aria-label="Change neighbourhood"
        >
          <MapPin className="w-3.5 h-3.5 text-[#0F766E] dark:text-[#5EEAD4] shrink-0 group-hover:animate-bounce" />
          <span className="text-xs font-semibold text-[#0F1F1C] dark:text-[#E8F0EE] truncate">
            {shortArea}
          </span>
          <ChevronDown className="w-3 h-3 text-[#5B6B67] dark:text-[#9DB0AB] shrink-0" />
        </button>

        {/* Center / Brand Logo */}
        <div className="hidden sm:flex items-center">
          <ShopGenieLogo size={28} />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Kotlin Code & Architecture Inspector button */}
          <button
            onClick={() => setIsCodeModalOpen(true)}
            className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-[#171D1B] transition-colors relative"
            title="Inspect Android Kotlin Jetpack Compose Codebase"
            aria-label="Android Studio Codebase"
          >
            <Code2 className="w-5 h-5 text-[#0F766E] dark:text-[#5EEAD4]" />
            <span className="sr-only">Inspect Code</span>
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-[#171D1B] transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F59E0B] ring-2 ring-white dark:ring-[#0F1412] animate-pulse" />
            )}
          </button>

          {/* User Profile Avatar with Role Pill */}
          <button
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full bg-white dark:bg-[#171D1B] border border-[#CBD5D2]/60 dark:border-[#3A4642] hover:border-[#0F766E] transition-colors"
            aria-label="User Profile"
          >
            <div className="w-7 h-7 rounded-full bg-[#0F766E]/15 dark:bg-[#5EEAD4]/20 flex items-center justify-center text-[#0F766E] dark:text-[#5EEAD4] font-bold text-xs">
              {currentUser.name ? currentUser.name.charAt(0) : <User className="w-4 h-4" />}
            </div>
            <span className="text-[11px] font-semibold capitalize text-[#5B6B67] dark:text-[#9DB0AB] hidden xs:inline">
              {role === 'admin' ? 'Admin' : 'You'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
