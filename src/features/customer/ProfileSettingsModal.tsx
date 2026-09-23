import React from 'react';
import { useShopGenie } from '../../context/ShopGenieContext';
import { 
  X, 
  User, 
  Moon, 
  Sun, 
  Languages, 
  Store, 
  ShieldCheck, 
  Smartphone, 
  Monitor, 
  LogOut, 
  Info,
  Award,
  ShoppingBag
} from 'lucide-react';
import { AppLanguage } from '../../translations';
import { UserRole } from '../../types';

export const ProfileSettingsModal: React.FC = () => {
  const {
    isProfileOpen,
    setIsProfileOpen,
    currentUser,
    setRole,
    theme,
    toggleTheme,
    language,
    setLanguage,
    deviceViewMode,
    toggleDeviceViewMode,
    logout,
    currentArea,
    orders,
    loyaltyCards
  } = useShopGenie();

  if (!isProfileOpen) return null;

  const languages: { code: AppLanguage; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
    { code: 'hi', label: 'हिन्दी (Hindi)' }
  ];

  const roles: { role: UserRole; title: string; desc: string }[] = [
    { role: 'customer', title: 'Customer', desc: 'Discover shops, scan & pay, collect points' },
    { role: 'owner', title: 'Shop Owner', desc: 'Manage catalogue, verify exit passes, publish offers' },
    { role: 'admin', title: 'Admin Console', desc: 'Shop verification queue, user management' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white dark:bg-[#171D1B] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-heading font-bold text-base text-[#0F1F1C] dark:text-[#E8F0EE]">
            Settings & Profile
          </h3>
          <button
            onClick={() => setIsProfileOpen(false)}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* User Info Card */}
          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/40">
            <div className="w-12 h-12 rounded-2xl bg-[#0F766E] text-white font-extrabold text-lg flex items-center justify-center shadow-xs">
              {currentUser.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-heading font-bold text-sm text-[#0F1F1C] dark:text-[#E8F0EE] truncate">
                {currentUser.name}
              </h4>
              <p className="text-xs text-[#5B6B67] dark:text-[#9DB0AB] truncate">{currentUser.phone}</p>
              <span className="text-[10px] font-semibold text-[#0F766E] dark:text-[#5EEAD4] uppercase tracking-wide">
                Role: {currentUser.role}
              </span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[11px] text-[#5B6B67] dark:text-[#9DB0AB]">Completed Orders</span>
              <div className="font-heading font-bold text-base text-slate-800 dark:text-slate-100 mt-0.5">
                {orders.length}
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[11px] text-[#5B6B67] dark:text-[#9DB0AB]">Loyalty Passes</span>
              <div className="font-heading font-bold text-base text-slate-800 dark:text-slate-100 mt-0.5">
                {loyaltyCards.length}
              </div>
            </div>
          </div>

          {/* 1. Switch Role (Section 1: Customer, Shop Owner, Admin) */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#5B6B67] dark:text-[#9DB0AB] block">
              Active Mode / Role
            </label>
            <div className="space-y-2">
              {roles.map((r) => {
                const isActive = currentUser.role === r.role;
                return (
                  <button
                    key={r.role}
                    onClick={() => {
                      setRole(r.role);
                      setIsProfileOpen(false);
                    }}
                    className={`w-full p-3 rounded-2xl text-left border transition-all flex items-start gap-3 ${
                      isActive
                        ? 'border-[#0F766E] bg-teal-500/10 text-[#0F766E] font-semibold'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="mt-0.5">
                      {r.role === 'customer' && <ShoppingBag className="w-4 h-4 text-[#0F766E]" />}
                      {r.role === 'owner' && <Store className="w-4 h-4 text-[#F59E0B]" />}
                      {r.role === 'admin' && <ShieldCheck className="w-4 h-4 text-[#6D5EF5]" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {r.title}
                      </div>
                      <div className="text-[11px] text-[#5B6B67] dark:text-[#9DB0AB] font-normal">
                        {r.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Device View Simulator Frame */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#5B6B67] dark:text-[#9DB0AB] block">
              Preview Display Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  if (deviceViewMode !== 'phone') toggleDeviceViewMode();
                }}
                className={`p-2.5 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  deviceViewMode === 'phone'
                    ? 'border-[#0F766E] bg-teal-500/10 text-[#0F766E]'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Pixel 8 Frame</span>
              </button>
              <button
                onClick={() => {
                  if (deviceViewMode !== 'full') toggleDeviceViewMode();
                }}
                className={`p-2.5 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  deviceViewMode === 'full'
                    ? 'border-[#0F766E] bg-teal-500/10 text-[#0F766E]'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span>Full Responsive</span>
              </button>
            </div>
          </div>

          {/* 3. Language Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#5B6B67] dark:text-[#9DB0AB] flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5" /> Language
            </label>
            <div className="grid grid-cols-3 gap-2">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                    language === l.code
                      ? 'border-[#0F766E] bg-teal-500/10 text-[#0F766E]'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Theme Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#5B6B67] dark:text-[#9DB0AB] block">
              Color Theme
            </label>
            <button
              onClick={toggleTheme}
              className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/40"
            >
              <div className="flex items-center gap-2">
                {theme === 'dark' ? <Moon className="w-4 h-4 text-[#5EEAD4]" /> : <Sun className="w-4 h-4 text-amber-500" />}
                <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
              </div>
              <span className="text-[11px] text-[#0F766E] dark:text-[#5EEAD4]">Tap to toggle</span>
            </button>
          </div>

          {/* 5. About & Architecture Info */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
            <div className="font-heading font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#0F766E]" /> ShopGenie Android Architecture
            </div>
            <p className="text-[11px] text-[#5B6B67] dark:text-[#9DB0AB] leading-relaxed">
              Kotlin · Jetpack Compose · Material 3 · Clean Architecture MVVM · Hilt DI · Room Cache · Retrofit DRF API contract.
            </p>
          </div>

          {/* 6. Sign Out */}
          <button
            onClick={() => {
              logout();
              setIsProfileOpen(false);
            }}
            className="w-full py-3 rounded-2xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
