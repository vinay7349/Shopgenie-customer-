import React, { useState } from 'react';
import { ShopGenieProvider, useShopGenie } from './context/ShopGenieContext';
import { GenieTopBar } from './components/common/GenieTopBar';
import { CustomerBottomBar } from './components/common/CustomerBottomBar';
import { HomeScreen } from './features/customer/HomeScreen';
import { SearchScreen } from './features/customer/SearchScreen';
import { ScanScreen } from './features/customer/ScanScreen';
import { CartScreen } from './features/customer/CartScreen';
import { LocalFeedScreen } from './features/customer/LocalFeedScreen';
import { ShopDetailScreen } from './features/customer/ShopDetailScreen';
import { ProductDetailModal } from './features/customer/ProductDetailModal';
import { AreaPickerModal, NotificationsDrawer } from './features/customer/AreaAndNotificationModals';
import { ProfileSettingsModal } from './features/customer/ProfileSettingsModal';
import { LoyaltyWalletModal } from './features/customer/LoyaltyWalletModal';
import { AndroidCodeExplorerModal } from './features/code/AndroidCodeExplorerModal';
import { GlobalSnackbar } from './components/common/Components';
import { 
  OwnerDashboardScreen, 
  OwnerInventoryScreen, 
  OwnerOffersScreen, 
  OwnerStoreProfileScreen 
} from './features/owner/OwnerViews';
import { AdminDashboardScreen } from './features/admin/AdminDashboardScreen';
import { ShopGenieLogo } from './components/common/ShopGenieLogo';
import { 
  Smartphone, 
  Monitor, 
  Code2, 
  Store, 
  Users, 
  ShieldCheck, 
  Wifi, 
  BatteryMedium, 
  Award,
  Sparkles
} from 'lucide-react';

const ShopGenieMainContent: React.FC = () => {
  const {
    currentUser: { role },
    customerTab,
    ownerTab,
    setOwnerTab,
    selectedShopId,
    deviceViewMode,
    toggleDeviceViewMode,
    setRole,
    setIsCodeModalOpen,
    snackbar,
    hideSnackbar
  } = useShopGenie();

  const [isLoyaltyWalletOpen, setIsLoyaltyWalletOpen] = useState(false);

  // Render role-specific views
  const renderActiveView = () => {
    if (role === 'admin') {
      return <AdminDashboardScreen />;
    }

    if (role === 'owner') {
      switch (ownerTab) {
        case 'dashboard':
          return <OwnerDashboardScreen />;
        case 'inventory':
          return <OwnerInventoryScreen />;
        case 'offers':
          return <OwnerOffersScreen />;
        case 'store':
          return <OwnerStoreProfileScreen />;
        default:
          return <OwnerDashboardScreen />;
      }
    }

    // Customer mode
    if (selectedShopId) {
      return <ShopDetailScreen />;
    }

    switch (customerTab) {
      case 'home':
        return <HomeScreen />;
      case 'search':
        return <SearchScreen />;
      case 'scan':
        return <ScanScreen />;
      case 'cart':
        return <CartScreen />;
      case 'feed':
        return <LocalFeedScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#080B0A] text-[#0F1F1C] dark:text-[#E8F0EE] flex flex-col justify-between">
      {/* Top Banner & Control Deck (visible on wide screens for role & simulator switching) */}
      <div className="bg-white/80 dark:bg-[#121715]/80 backdrop-blur-md border-b border-[#CBD5D2]/50 dark:border-[#3A4642]/60 px-4 py-2 text-xs">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ShopGenieLogo size={28} showTagline={true} />
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-teal-500/10 text-[#0F766E] dark:text-[#5EEAD4] font-semibold text-[11px]">
              Android Native Spec · Compose & Room
            </span>
          </div>

          {/* Quick Switchers */}
          <div className="flex items-center gap-2">
            {/* Loyalty Wallet Quick Trigger */}
            <button
              onClick={() => setIsLoyaltyWalletOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 font-semibold text-xs flex items-center gap-1.5 hover:bg-amber-500/20 transition-colors"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Loyalty Pass</span>
            </button>

            {/* Role Switcher */}
            <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 text-xs font-semibold">
              <button
                onClick={() => setRole('customer')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  role === 'customer'
                    ? 'bg-[#0F766E] text-white shadow-2xs'
                    : 'text-[#5B6B67] dark:text-[#9DB0AB] hover:text-[#0F1F1C]'
                }`}
              >
                Shopper
              </button>
              <button
                onClick={() => setRole('owner')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  role === 'owner'
                    ? 'bg-[#0F766E] text-white shadow-2xs'
                    : 'text-[#5B6B67] dark:text-[#9DB0AB] hover:text-[#0F1F1C]'
                }`}
              >
                Owner
              </button>
              <button
                onClick={() => setRole('admin')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  role === 'admin'
                    ? 'bg-[#0F766E] text-white shadow-2xs'
                    : 'text-[#5B6B67] dark:text-[#9DB0AB] hover:text-[#0F1F1C]'
                }`}
              >
                Admin
              </button>
            </div>

            {/* Frame Mode */}
            <button
              onClick={toggleDeviceViewMode}
              className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
              title="Toggle Phone Frame vs Full Viewport"
            >
              {deviceViewMode === 'phone' ? (
                <Monitor className="w-4 h-4" />
              ) : (
                <Smartphone className="w-4 h-4" />
              )}
            </button>

            {/* Android Code Explorer */}
            <button
              onClick={() => setIsCodeModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[#0F766E] text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs hover:bg-[#0c615b] transition-all"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Kotlin Studio</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas: Phone Frame or Responsive Viewport */}
      <main className="flex-1 flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden">
        {deviceViewMode === 'phone' ? (
          /* Pixel 8 Simulated Device Frame */
          <div className="relative w-full max-w-[420px] h-[92vh] max-h-[880px] bg-[#F7F8FA] dark:bg-[#0F1412] rounded-[44px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border-[8px] border-[#1E2522] dark:border-[#2A3430] flex flex-col overflow-hidden">
            {/* Android Status Bar */}
            <div className="h-7 bg-[#F7F8FA] dark:bg-[#0F1412] px-6 flex items-center justify-between text-[11px] font-bold text-slate-800 dark:text-slate-200 shrink-0 select-none z-40 border-b border-black/5 dark:border-white/5">
              <span>9:41</span>
              {/* Camera Cutout Pill */}
              <div className="w-3.5 h-3.5 rounded-full bg-black mx-auto ring-1 ring-white/20" />
              <div className="flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono">5G</span>
                <BatteryMedium className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* App Header */}
            {role === 'customer' ? (
              <GenieTopBar />
            ) : role === 'owner' ? (
              /* Owner Mode Top Tabs */
              <div className="sticky top-0 z-30 bg-[#F7F8FA]/90 dark:bg-[#0F1412]/90 backdrop-blur-md px-4 py-2.5 border-b border-[#CBD5D2]/40 dark:border-[#3A4642]/50 flex items-center justify-between">
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar text-xs font-semibold">
                  <button
                    onClick={() => setOwnerTab('dashboard')}
                    className={`px-3 py-1.5 rounded-full transition-all ${
                      ownerTab === 'dashboard'
                        ? 'bg-[#0F766E] text-white shadow-2xs'
                        : 'text-[#5B6B67] dark:text-[#9DB0AB]'
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => setOwnerTab('inventory')}
                    className={`px-3 py-1.5 rounded-full transition-all ${
                      ownerTab === 'inventory'
                        ? 'bg-[#0F766E] text-white shadow-2xs'
                        : 'text-[#5B6B67] dark:text-[#9DB0AB]'
                    }`}
                  >
                    Inventory
                  </button>
                  <button
                    onClick={() => setOwnerTab('offers')}
                    className={`px-3 py-1.5 rounded-full transition-all ${
                      ownerTab === 'offers'
                        ? 'bg-[#0F766E] text-white shadow-2xs'
                        : 'text-[#5B6B67] dark:text-[#9DB0AB]'
                    }`}
                  >
                    Offers
                  </button>
                  <button
                    onClick={() => setOwnerTab('store')}
                    className={`px-3 py-1.5 rounded-full transition-all ${
                      ownerTab === 'store'
                        ? 'bg-[#0F766E] text-white shadow-2xs'
                        : 'text-[#5B6B67] dark:text-[#9DB0AB]'
                    }`}
                  >
                    Settings
                  </button>
                </div>
              </div>
            ) : null}

            {/* Scrollable Screen Content */}
            <div className="flex-1 overflow-y-auto relative no-scrollbar">
              {renderActiveView()}
            </div>

            {/* Bottom Nav Bar (Customer Mode) */}
            {role === 'customer' && !selectedShopId && <CustomerBottomBar />}

            {/* Android Navigation Gesture Bar */}
            <div className="h-4 bg-[#F7F8FA] dark:bg-[#0F1412] flex items-center justify-center shrink-0 z-50">
              <div className="w-32 h-1 bg-slate-400/60 dark:bg-slate-600 rounded-full" />
            </div>
          </div>
        ) : (
          /* Full Viewport Adaptive View */
          <div className="w-full max-w-5xl h-[88vh] bg-[#F7F8FA] dark:bg-[#0F1412] rounded-3xl border border-[#CBD5D2]/60 dark:border-[#3A4642] shadow-xl flex flex-col overflow-hidden">
            {role === 'customer' ? (
              <GenieTopBar />
            ) : role === 'owner' ? (
              <div className="bg-white dark:bg-[#171D1B] px-6 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <ShopGenieLogo size={30} showTagline={true} />
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <button
                    onClick={() => setOwnerTab('dashboard')}
                    className={`px-3.5 py-1.5 rounded-xl ${
                      ownerTab === 'dashboard' ? 'bg-[#0F766E] text-white' : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => setOwnerTab('inventory')}
                    className={`px-3.5 py-1.5 rounded-xl ${
                      ownerTab === 'inventory' ? 'bg-[#0F766E] text-white' : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Inventory
                  </button>
                  <button
                    onClick={() => setOwnerTab('offers')}
                    className={`px-3.5 py-1.5 rounded-xl ${
                      ownerTab === 'offers' ? 'bg-[#0F766E] text-white' : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Offers
                  </button>
                  <button
                    onClick={() => setOwnerTab('store')}
                    className={`px-3.5 py-1.5 rounded-xl ${
                      ownerTab === 'store' ? 'bg-[#0F766E] text-white' : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Store Settings
                  </button>
                </div>
              </div>
            ) : null}

            <div className="flex-1 overflow-y-auto relative no-scrollbar">
              {renderActiveView()}
            </div>

            {role === 'customer' && !selectedShopId && <CustomerBottomBar />}
          </div>
        )}
      </main>

      {/* Global Modals and Drawers */}
      <ProductDetailModal />
      <AreaPickerModal />
      <NotificationsDrawer />
      <ProfileSettingsModal />
      <AndroidCodeExplorerModal />
      <LoyaltyWalletModal
        isOpen={isLoyaltyWalletOpen}
        onClose={() => setIsLoyaltyWalletOpen(false)}
      />

      {/* Global Snackbar Toast */}
      {snackbar && (
        <GlobalSnackbar
          message={snackbar.message}
          actionLabel={snackbar.actionLabel}
          onAction={snackbar.onAction}
          type={snackbar.type}
          onDismiss={hideSnackbar}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <ShopGenieProvider>
      <ShopGenieMainContent />
    </ShopGenieProvider>
  );
}
