import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Check, 
  X, 
  Store, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Activity, 
  Server, 
  MapPin, 
  CheckCircle2, 
  Building,
  Zap,
  Clock
} from 'lucide-react';
import { PendingStoreItem, StoreItem } from '../flutterDeckTypes';

interface AdminDeckViewProps {
  pendingStores: PendingStoreItem[];
  setPendingStores: React.Dispatch<React.SetStateAction<PendingStoreItem[]>>;
  stores: StoreItem[];
  setStores: React.Dispatch<React.SetStateAction<StoreItem[]>>;
  showToast: (msg: string) => void;
}

export const AdminDeckView: React.FC<AdminDeckViewProps> = ({
  pendingStores,
  setPendingStores,
  stores,
  setStores,
  showToast
}) => {
  const [adminTab, setAdminTab] = useState<'approvals' | 'metrics' | 'system'>('approvals');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = (store: PendingStoreItem) => {
    // Add to active stores list
    const newStore: StoreItem = {
      id: `store-${Date.now()}`,
      name: store.name,
      category: store.category,
      distance: '600 m away',
      rating: '4.7 ★',
      address: store.address,
      emoji: store.category === 'Supermarket' ? '🛒' : store.category.includes('Bakery') ? '☕' : '🛍️',
      selfCheckout: store.supportsSelfCheckout,
      description: store.description,
      followers: 120,
      isFollowing: false,
      hours: store.proposedHours,
      phone: store.phone
    };

    setStores(prev => [newStore, ...prev]);
    setPendingStores(prev => prev.filter(p => p.id !== store.id));
    showToast(`Approved "${store.name}"! Now live on Shopper map.`);
  };

  const handleRejectConfirm = (id: string) => {
    const target = pendingStores.find(p => p.id === id);
    setPendingStores(prev => prev.filter(p => p.id !== id));
    setRejectingId(null);
    setRejectReason('');
    showToast(`Rejected "${target?.name}": ${rejectReason || 'Incomplete KYC'}`);
  };

  return (
    <div className="flex-1 flex flex-col pt-10 overflow-y-auto pb-16">
      {/* Admin Header */}
      <div className="bg-white dark:bg-[#141C1A] px-4 py-3 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">Platform Admin Deck</h2>
                <span className="px-1.5 py-0.2 rounded-md bg-purple-500/10 text-purple-600 text-[10px] font-bold">Super Admin</span>
              </div>
              <p className="text-[11px] text-slate-500">ShopGenie Hyperlocal Network · Bengaluru Central</p>
            </div>
          </div>

          <div className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[10px] font-mono font-bold">
            v1.0.4 PROD
          </div>
        </div>

        {/* Subtabs */}
        <div className="flex gap-1 mt-3 bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-xl text-xs font-bold">
          <button
            onClick={() => setAdminTab('approvals')}
            className={`flex-1 py-1.5 rounded-lg transition-all relative ${
              adminTab === 'approvals'
                ? 'bg-white dark:bg-[#141C1A] text-[#0F766E] dark:text-[#5EEAD4] shadow-2xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Approvals
            {pendingStores.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[9px] font-extrabold">
                {pendingStores.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setAdminTab('metrics')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              adminTab === 'metrics'
                ? 'bg-white dark:bg-[#141C1A] text-[#0F766E] dark:text-[#5EEAD4] shadow-2xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Network KPIs
          </button>
          <button
            onClick={() => setAdminTab('system')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              adminTab === 'system'
                ? 'bg-white dark:bg-[#141C1A] text-[#0F766E] dark:text-[#5EEAD4] shadow-2xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Django & API
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {adminTab === 'approvals' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                Store Onboarding Applications ({pendingStores.length})
              </h3>
              <span className="text-[11px] text-amber-600 font-semibold">Review Pending</span>
            </div>

            {pendingStores.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-[#141C1A] rounded-3xl border border-slate-200 dark:border-slate-800">
                <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500 mb-2" />
                <div className="text-xs font-bold text-slate-800 dark:text-slate-100">Queue is Clear!</div>
                <p className="text-[11px] text-slate-500 mt-1">All merchant onboarding requests have been reviewed.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingStores.map(store => (
                  <div
                    key={store.id}
                    className="p-4 bg-white dark:bg-[#141C1A] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {store.category}
                          </span>
                          <h4 className="text-sm font-bold text-slate-800 dark:text-white mt-0.5">
                            {store.name}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">{store.address}</p>
                        </div>
                        {store.supportsSelfCheckout && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px] flex items-center gap-1">
                            <Zap className="w-3 h-3 fill-current" />
                            <span>Self-Scan</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl italic">
                        "{store.description}"
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400">
                        <span>🕒 {store.proposedHours}</span>
                        <span>📞 {store.phone}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => handleApprove(store)}
                        className="flex-1 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-emerald-700 shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve & Go Live</span>
                      </button>
                      <button
                        onClick={() => setRejectingId(store.id)}
                        className="px-3 py-2 rounded-xl bg-rose-500/10 text-rose-600 font-bold text-xs flex items-center gap-1 hover:bg-rose-500/20"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>

                    {rejectingId === store.id && (
                      <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl space-y-2 border border-rose-200 dark:border-rose-900">
                        <label className="text-[11px] font-bold text-rose-800 dark:text-rose-300 block">
                          Reason for rejection:
                        </label>
                        <input
                          type="text"
                          value={rejectReason}
                          onChange={e => setRejectReason(e.target.value)}
                          placeholder="e.g. Incomplete GST credentials..."
                          className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border text-xs"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setRejectingId(null)}
                            className="px-2.5 py-1 text-xs text-slate-500"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleRejectConfirm(store.id)}
                            className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold"
                          >
                            Confirm Reject
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {adminTab === 'metrics' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-white dark:bg-[#141C1A] p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                <div className="text-[11px] text-slate-500">Verified Stores</div>
                <div className="text-xl font-bold text-emerald-600 mt-1">{stores.length} Live</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Koramangala, Indiranagar, HSR</div>
              </div>

              <div className="bg-white dark:bg-[#141C1A] p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                <div className="text-[11px] text-slate-500">Active Shoppers</div>
                <div className="text-xl font-bold text-[#0F766E] mt-1">2,480 Users</div>
                <div className="text-[10px] text-emerald-600 mt-0.5">+14% this month</div>
              </div>

              <div className="bg-white dark:bg-[#141C1A] p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                <div className="text-[11px] text-slate-500">Platform GMV</div>
                <div className="text-xl font-bold text-slate-800 dark:text-white mt-1">$34,890</div>
                <div className="text-[10px] text-slate-400 mt-0.5">30-day processed</div>
              </div>

              <div className="bg-white dark:bg-[#141C1A] p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                <div className="text-[11px] text-slate-500">Pending Review</div>
                <div className="text-xl font-bold text-amber-500 mt-1">{pendingStores.length} Stores</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Avg turnaround 4h</div>
              </div>
            </div>

            {/* City Hub Breakdown */}
            <div className="bg-white dark:bg-[#141C1A] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2.5">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                Bengaluru Hyperlocal Hubs
              </h4>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900">
                  <span className="font-semibold">Koramangala 4th & 5th Block</span>
                  <span className="font-mono text-[#0F766E] font-bold">18 Stores · 840 DAU</span>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900">
                  <span className="font-semibold">Indiranagar 100ft Rd</span>
                  <span className="font-mono text-[#0F766E] font-bold">14 Stores · 620 DAU</span>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900">
                  <span className="font-semibold">HSR Layout Sector 1</span>
                  <span className="font-mono text-[#0F766E] font-bold">11 Stores · 510 DAU</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {adminTab === 'system' && (
          <div className="bg-white dark:bg-[#141C1A] p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
              System Services & Backend Status
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="font-bold text-emerald-900 dark:text-emerald-200">Django REST Framework API</div>
                    <div className="text-[10px] text-emerald-700 dark:text-emerald-400">Endpoints `/api/v1/` healthy (200 OK)</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">HEALTHY</span>
              </div>

              <div className="p-3 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-bold text-blue-900 dark:text-blue-200">Barcode Sync Latency</div>
                    <div className="text-[10px] text-blue-700 dark:text-blue-400">18ms average response time</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">18ms</span>
              </div>

              <div className="p-3 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-600" />
                  <div>
                    <div className="font-bold text-purple-900 dark:text-purple-200">Flutter 3.24 Engine</div>
                    <div className="text-[10px] text-purple-700 dark:text-purple-400">Material 3 & Dart compilation verified</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold text-[10px]">DART 3.2</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
