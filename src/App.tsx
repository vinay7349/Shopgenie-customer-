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
import { ShopMapScreen } from './features/customer/ShopMapScreen';
import { ProductDetailModal } from './features/customer/ProductDetailModal';
import { AreaPickerModal, NotificationsDrawer } from './features/customer/AreaAndNotificationModals';
import { ProfileSettingsModal } from './features/customer/ProfileSettingsModal';
import { LoyaltyWalletModal } from './features/customer/LoyaltyWalletModal';
import { AndroidCodeExplorerModal } from './features/code/AndroidCodeExplorerModal';
import { ApkBuildModal } from './features/apk/ApkBuildModal';
import { GlobalSnackbar } from './components/common/Components';
import { AdminDashboardScreen } from './features/admin/AdminDashboardScreen';
import { FlutterAppSimulator } from './features/flutter/FlutterAppSimulator';
import { ShopGenieLogo } from './components/common/ShopGenieLogo';
import { 
  Smartphone, 
  Monitor, 
  Code2, 
  Users, 
  ShieldCheck, 
  Wifi, 
  BatteryMedium, 
  Award,
  Sparkles,
  Layers,
  ShoppingBag
} from 'lucide-react';

const ShopGenieMainContent: React.FC = () => {
  const {
    currentUser: { role },
    customerTab,
    selectedShopId,
    deviceViewMode,
    toggleDeviceViewMode,
    setRole,
    setIsCodeModalOpen,
    snackbar,
    hideSnackbar
  } = useShopGenie();

  const [isLoyaltyWalletOpen, setIsLoyaltyWalletOpen] = useState(false);
  const [isFlutterAppMode, setIsFlutterAppMode] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);

  // Render role-specific views
  const renderActiveView = () => {
    if (isFlutterAppMode) {
      return <FlutterAppSimulator onOpenCodeExplorer={() => setIsCodeModalOpen(true)} />;
    }

    if (role === 'admin') {
      return <AdminDashboardScreen />;
    }

    // Customer / Shopper mode
    if (selectedShopId) {
      return <ShopDetailScreen />;
    }

    switch (customerTab) {
      case 'home':
        return <HomeScreen />;
      case 'map':
        return <ShopMapScreen />;
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
              Flutter 3.24 · Material 3 & Dart Conversion
            </span>
          </div>

          {/* Quick Switchers */}
          <div className="flex items-center gap-2">
            {/* Mode Switcher: Flutter Mobile vs Web Native Spec */}
            <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 text-xs font-semibold">
              <button
                onClick={() => setIsFlutterAppMode(true)}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                  isFlutterAppMode
                    ? 'bg-[#0F766E] text-white shadow-2xs font-bold'
                    : 'text-[#5B6B67] dark:text-[#9DB0AB] hover:text-[#0F1F1C]'
                }`}
              >
                <span>Flutter App</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#5EEAD4]" />
              </button>
              <button
                onClick={() => setIsFlutterAppMode(false)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  !isFlutterAppMode
                    ? 'bg-[#0F766E] text-white shadow-2xs font-bold'
                    : 'text-[#5B6B67] dark:text-[#9DB0AB] hover:text-[#0F1F1C]'
                }`}
              >
                Multi-Role Deck
              </button>
            </div>

            {/* Loyalty Wallet Quick Trigger */}
            <button
              onClick={() => setIsLoyaltyWalletOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 font-semibold text-xs flex items-center gap-1.5 hover:bg-amber-500/20 transition-colors"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Loyalty Pass</span>
            </button>

            {/* Role Switcher (Shopper vs Admin Console) */}
            {!isFlutterAppMode && (
              <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 text-xs font-semibold">
                <button
                  onClick={() => setRole('customer')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    role === 'customer'
                      ? 'bg-[#0F766E] text-white shadow-2xs font-bold'
                      : 'text-[#5B6B67] dark:text-[#9DB0AB] hover:text-[#0F1F1C]'
                  }`}
                >
                  Shopper
                </button>
                <button
                  onClick={() => setRole('admin')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    role === 'admin'
                      ? 'bg-[#0F766E] text-white shadow-2xs font-bold'
                      : 'text-[#5B6B67] dark:text-[#9DB0AB] hover:text-[#0F1F1C]'
                  }`}
                >
                  Admin
                </button>
              </div>
            )}

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

            {/* Flutter & Dart Code Studio */}
            <button
              onClick={() => setIsCodeModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs hover:bg-slate-700 transition-all"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Studio</span>
            </button>

            {/* Build APK Trigger */}
            <button
              onClick={() => setIsApkModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs hover:bg-blue-700 transition-all"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Build APK</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas: Phone Frame or Responsive Viewport */}
      <main className="flex-1 flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden bg-[#F1F5F9]">
        {deviceViewMode === 'phone' ? (
          /* Pixel 8 Simulated Device Frame */
          <div className="relative w-full max-w-[420px] h-[92vh] max-h-[880px] bg-[#F8FAFC] rounded-[44px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.16)] border-[8px] border-slate-900 flex flex-col overflow-hidden">
            {/* Android Status Bar matching screenshot */}
            <div className="h-7 bg-white px-6 flex items-center justify-between text-[11px] font-bold text-slate-800 shrink-0 select-none z-40 border-b border-slate-100">
              <span className="font-semibold">2:39</span>
              {/* Camera Cutout Pill */}
              <div className="w-3.5 h-3.5 rounded-full bg-black mx-auto ring-1 ring-black/10" />
              <div className="flex items-center gap-1.5 text-slate-600">
                <Wifi className="w-3 h-3" />
                <span className="text-[10px] font-mono font-bold">5G</span>
                <BatteryMedium className="w-3.5 h-3.5" />
                <span className="text-[10px] font-medium">85</span>
              </div>
            </div>

            {/* App Header (Shopper mode top bar) */}
            {!isFlutterAppMode && role === 'customer' && <GenieTopBar />}

            {/* Scrollable Screen Content */}
            <div className="flex-1 overflow-y-auto relative no-scrollbar flex flex-col bg-[#F8FAFC]">
              {renderActiveView()}
            </div>

            {/* Bottom Nav Bar (Customer Mode only in web mode) */}
            {!isFlutterAppMode && role === 'customer' && !selectedShopId && <CustomerBottomBar />}

            {/* Android Navigation Gesture Bar */}
            <div className="h-4 bg-[#F8FAFC] flex items-center justify-center shrink-0 z-50">
              <div className="w-32 h-1 bg-slate-300 rounded-full" />
            </div>
          </div>
        ) : (
          /* Full Viewport Adaptive View */
          <div className="w-full max-w-5xl h-[88vh] bg-[#F8FAFC] rounded-3xl border border-slate-200 shadow-xl flex flex-col overflow-hidden">
            {!isFlutterAppMode && role === 'customer' && <GenieTopBar />}

            <div className="flex-1 overflow-y-auto relative no-scrollbar flex flex-col bg-[#F8FAFC]">
              {renderActiveView()}
            </div>

            {!isFlutterAppMode && role === 'customer' && !selectedShopId && <CustomerBottomBar />}
          </div>
        )}
      </main>

      {/* Global Modals and Drawers */}
      <ProductDetailModal />
      <AreaPickerModal />
      <NotificationsDrawer />
      <ProfileSettingsModal />
      <AndroidCodeExplorerModal />
      <ApkBuildModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
      />
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
