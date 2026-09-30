import React, { useState } from 'react';
import { ShopGenieProvider, useShopGenie } from './context/ShopGenieContext';
import { ProductDetailModal } from './features/customer/ProductDetailModal';
import { AreaPickerModal, NotificationsDrawer } from './features/customer/AreaAndNotificationModals';
import { ProfileSettingsModal } from './features/customer/ProfileSettingsModal';
import { LoyaltyWalletModal } from './features/customer/LoyaltyWalletModal';
import { AndroidCodeExplorerModal } from './features/code/AndroidCodeExplorerModal';
import { ApkBuildModal } from './features/apk/ApkBuildModal';
import { DjangoBackendModal } from './features/backend/DjangoBackendModal';
import { GlobalSnackbar } from './components/common/Components';
import { FlutterAppSimulator } from './features/flutter/FlutterAppSimulator';
import { DeckRole } from './features/flutter/flutterDeckTypes';
import { ShopGenieLogo } from './components/common/ShopGenieLogo';
import { 
  Smartphone, 
  Monitor, 
  Code2, 
  Server, 
  Wifi, 
  BatteryMedium, 
  Award
} from 'lucide-react';

const ShopGenieMainContent: React.FC = () => {
  const {
    deviceViewMode,
    toggleDeviceViewMode,
    setIsCodeModalOpen,
    snackbar,
    hideSnackbar
  } = useShopGenie();

  const [activeRole, setActiveRole] = useState<DeckRole>('shopper');
  const [isLoyaltyWalletOpen, setIsLoyaltyWalletOpen] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);
  const [isDjangoModalOpen, setIsDjangoModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#080B0A] text-[#0F1F1C] dark:text-[#E8F0EE] flex flex-col justify-between">
      {/* Top Banner & Multi-Role Deck Control Bar */}
      <div className="bg-white/90 dark:bg-[#121715]/90 backdrop-blur-md border-b border-[#CBD5D2]/50 dark:border-[#3A4642]/60 px-4 py-2 text-xs">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ShopGenieLogo size={28} showTagline={true} />
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-teal-500/10 text-[#0F766E] dark:text-[#5EEAD4] font-semibold text-[11px]">
              Flutter 3.24 · Multi-Role Deck
            </span>
          </div>

          {/* Quick Switchers & Tools */}
          <div className="flex items-center gap-2">
            {/* Multi-Role Deck Switcher */}
            <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 text-xs font-semibold shadow-2xs">
              <button
                onClick={() => setActiveRole('shopper')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  activeRole === 'shopper'
                    ? 'bg-[#0F766E] text-white shadow-2xs font-bold'
                    : 'text-[#5B6B67] dark:text-[#9DB0AB] hover:text-[#0F1F1C]'
                }`}
              >
                <span>🛍️</span>
                <span>Shopper</span>
              </button>
              <button
                onClick={() => setActiveRole('merchant')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  activeRole === 'merchant'
                    ? 'bg-amber-500 text-slate-950 shadow-2xs font-bold'
                    : 'text-[#5B6B67] dark:text-[#9DB0AB] hover:text-[#0F1F1C]'
                }`}
              >
                <span>🏪</span>
                <span>Merchant</span>
              </button>
              <button
                onClick={() => setActiveRole('verifier')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  activeRole === 'verifier'
                    ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                    : 'text-[#5B6B67] dark:text-[#9DB0AB] hover:text-[#0F1F1C]'
                }`}
              >
                <span>🛡️</span>
                <span>Verifier</span>
              </button>
              <button
                onClick={() => setActiveRole('admin')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  activeRole === 'admin'
                    ? 'bg-purple-600 text-white shadow-2xs font-bold'
                    : 'text-[#5B6B67] dark:text-[#9DB0AB] hover:text-[#0F1F1C]'
                }`}
              >
                <span>⚙️</span>
                <span>Admin</span>
              </button>
            </div>

            {/* Loyalty Wallet Quick Trigger */}
            <button
              onClick={() => setIsLoyaltyWalletOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 font-semibold text-xs flex items-center gap-1.5 hover:bg-amber-500/20 transition-colors"
            >
              <Award className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Loyalty Pass</span>
            </button>

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
              <span className="hidden md:inline">Studio</span>
            </button>

            {/* Django REST Backend Trigger */}
            <button
              onClick={() => setIsDjangoModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-600/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600/25 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all"
              title="Django REST Backend Architecture & Endpoints"
            >
              <Server className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden md:inline">Django API</span>
            </button>

            {/* Build APK Trigger */}
            <button
              onClick={() => setIsApkModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs hover:bg-blue-700 transition-all"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Build APK</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas: Phone Frame or Responsive Viewport */}
      <main className="flex-1 flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden bg-[#F1F5F9]">
        {deviceViewMode === 'phone' ? (
          /* Pixel 8 Simulated Device Frame */
          <div className="relative w-full max-w-[420px] h-[92vh] max-h-[880px] bg-[#F8FAFC] rounded-[44px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.16)] border-[8px] border-slate-900 flex flex-col overflow-hidden">
            {/* Android Status Bar */}
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

            {/* Scrollable Screen Content */}
            <div className="flex-1 overflow-y-auto relative no-scrollbar flex flex-col bg-[#F8FAFC]">
              <FlutterAppSimulator
                onOpenCodeExplorer={() => setIsCodeModalOpen(true)}
                activeRole={activeRole}
                onRoleChange={setActiveRole}
              />
            </div>

            {/* Android Navigation Gesture Bar */}
            <div className="h-4 bg-[#F8FAFC] flex items-center justify-center shrink-0 z-50">
              <div className="w-32 h-1 bg-slate-300 rounded-full" />
            </div>
          </div>
        ) : (
          /* Full Viewport Adaptive View */
          <div className="w-full max-w-5xl h-[88vh] bg-[#F8FAFC] rounded-3xl border border-slate-200 shadow-xl flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto relative no-scrollbar flex flex-col bg-[#F8FAFC]">
              <FlutterAppSimulator
                onOpenCodeExplorer={() => setIsCodeModalOpen(true)}
                activeRole={activeRole}
                onRoleChange={setActiveRole}
              />
            </div>
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
      <DjangoBackendModal
        isOpen={isDjangoModalOpen}
        onClose={() => setIsDjangoModalOpen(false)}
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
