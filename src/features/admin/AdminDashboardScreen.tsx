import React, { useState } from 'react';
import { useShopGenie } from '../../context/ShopGenieContext';
import { ShieldAlert, Check, X, Store, Users, ShoppingBag, AlertCircle } from 'lucide-react';

export const AdminDashboardScreen: React.FC = () => {
  const { pendingShops, approveShop, rejectShop, shops, showSnackbar } = useShopGenie();
  const [rejectReason, setRejectReason] = useState('');
  const [activeRejectShopId, setActiveRejectShopId] = useState<string | null>(null);

  const sampleUsers = [
    { id: 'u-1', name: 'Ananya Sharma', phone: '+91 98451 90812', role: 'Customer', active: true },
    { id: 'u-2', name: 'Vikram Rao', phone: '+91 98450 12091', role: 'Shop Owner', active: true },
    { id: 'u-3', name: 'Karthik Gowda', phone: '+91 98860 33120', role: 'Shop Owner', active: true },
    { id: 'u-4', name: 'Pooja Hegde', phone: '+91 97422 66012', role: 'Customer', active: true }
  ];

  const handleConfirmReject = (shopId: string) => {
    rejectShop(shopId, rejectReason || 'Incomplete registration documents');
    setActiveRejectShopId(null);
    setRejectReason('');
  };

  return (
    <div className="pb-28 max-w-4xl mx-auto px-4 pt-2 space-y-6">
      <div>
        <h2 className="font-heading font-extrabold text-xl text-[#0F1F1C] dark:text-[#E8F0EE] flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-[#6D5EF5]" />
          ShopGenie Admin Console
        </h2>
        <p className="text-xs text-[#5B6B67] dark:text-[#9DB0AB]">
          Hyperlocal network management & verification queue
        </p>
      </div>

      {/* 1. Global Network Metrics */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-3xl bg-white dark:bg-[#171D1B] border border-[#CBD5D2]/50 dark:border-[#3A4642]/60 shadow-2xs">
          <span className="text-[11px] text-[#5B6B67] dark:text-[#9DB0AB]">Verified Stores</span>
          <div className="font-heading font-bold text-lg text-emerald-600 mt-0.5">
            {shops.length}
          </div>
        </div>
        <div className="p-4 rounded-3xl bg-white dark:bg-[#171D1B] border border-[#CBD5D2]/50 dark:border-[#3A4642]/60 shadow-2xs">
          <span className="text-[11px] text-[#5B6B67] dark:text-[#9DB0AB]">Pending Approvals</span>
          <div className="font-heading font-bold text-lg text-amber-500 mt-0.5">
            {pendingShops.length}
          </div>
        </div>
        <div className="p-4 rounded-3xl bg-white dark:bg-[#171D1B] border border-[#CBD5D2]/50 dark:border-[#3A4642]/60 shadow-2xs">
          <span className="text-[11px] text-[#5B6B67] dark:text-[#9DB0AB]">Registered Shoppers</span>
          <div className="font-heading font-bold text-lg text-violet-600 mt-0.5">
            2,480
          </div>
        </div>
      </div>

      {/* 2. Shop Approvals Queue */}
      <div className="bg-white dark:bg-[#171D1B] rounded-3xl p-5 border border-[#CBD5D2]/50 dark:border-[#3A4642]/60 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-sm text-[#0F1F1C] dark:text-[#E8F0EE]">
            Store Approvals Queue ({pendingShops.length})
          </h3>
          <span className="text-[11px] text-amber-600 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-full">
            Review Needed
          </span>
        </div>

        {pendingShops.map((shop) => (
          <div
            key={shop.id}
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2.5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {shop.category}
                </span>
                <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-slate-100">
                  {shop.name}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">{shop.address}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 italic">
                  "{shop.description}"
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => approveShop(shop.id)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 hover:bg-emerald-700 shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" /> Approve
                </button>
                <button
                  onClick={() => setActiveRejectShopId(shop.id)}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-600 font-bold text-xs flex items-center gap-1 hover:bg-rose-500/20"
                >
                  <X className="w-3.5 h-3.5" /> Reject
                </button>
              </div>
            </div>

            {/* Rejection input dialog */}
            {activeRejectShopId === shop.id && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex gap-2">
                <input
                  type="text"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Specify rejection reason (e.g. Invalid GST document)..."
                  className="flex-1 px-3 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-hidden"
                />
                <button
                  onClick={() => handleConfirmReject(shop.id)}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold"
                >
                  Confirm Reject
                </button>
              </div>
            )}
          </div>
        ))}

        {pendingShops.length === 0 && (
          <div className="text-center py-6 text-xs text-slate-500">
            No stores pending verification. All applications processed!
          </div>
        )}
      </div>

      {/* 3. User Directory Stub */}
      <div className="bg-white dark:bg-[#171D1B] rounded-3xl p-5 border border-[#CBD5D2]/50 dark:border-[#3A4642]/60 shadow-2xs space-y-3">
        <h3 className="font-heading font-bold text-sm text-[#0F1F1C] dark:text-[#E8F0EE]">
          User Directory & Roles
        </h3>

        <div className="space-y-2">
          {sampleUsers.map((u) => (
            <div
              key={u.id}
              className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">{u.name}</span>
                <span className="text-[11px] text-slate-400">{u.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {u.role}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
