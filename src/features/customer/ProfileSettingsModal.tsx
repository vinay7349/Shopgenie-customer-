import React from 'react';
import { useShopGenie } from '../../context/ShopGenieContext';
import { CustomerProfileView } from './CustomerProfileView';

export const ProfileSettingsModal: React.FC = () => {
  const { isProfileOpen, setIsProfileOpen } = useShopGenie();

  if (!isProfileOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-[#141C1A] sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 h-full sm:h-[92vh] max-h-[880px] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <CustomerProfileView onClose={() => setIsProfileOpen(false)} />
      </div>
    </div>
  );
};
