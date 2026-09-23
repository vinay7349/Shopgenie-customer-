import React, { useState } from 'react';
import { useShopGenie } from '../../context/ShopGenieContext';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  AlertTriangle, 
  Plus, 
  QrCode, 
  Tag, 
  MessageSquarePlus, 
  Check, 
  Search, 
  Edit3, 
  Pause, 
  Play, 
  Sparkles,
  Barcode,
  Calendar,
  Clock,
  ArrowRight
} from 'lucide-react';
import { OwnerProductEditorModal } from './OwnerProductEditorModal';
import { Offer, Product } from '../../types';

// 1. Owner Dashboard Screen
export const OwnerDashboardScreen: React.FC = () => {
  const {
    products,
    offers,
    orders,
    ownerShop,
    setOwnerTab,
    createFeedPost,
    verifyOrderExitPass,
    showSnackbar
  } = useShopGenie();

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [exitPassCodeInput, setExitPassCodeInput] = useState('');
  const [postDraft, setPostDraft] = useState('');
  const [isPostingFeed, setIsPostingFeed] = useState(false);

  // Computed metrics
  const todayRevenue = orders.reduce((sum, o) => sum + o.total, 0) + 12840;
  const todayOrders = orders.length + 18;
  const lowStockItems = products.filter((p) => p.shopId === 'shop-1' && p.stock <= 10);

  // 7-day revenue dummy data for Compose-style bar chart
  const weeklySales = [
    { day: 'Mon', amount: 14200 },
    { day: 'Tue', amount: 18400 },
    { day: 'Wed', amount: 16100 },
    { day: 'Thu', amount: 21500 },
    { day: 'Fri', amount: 24800 },
    { day: 'Sat', amount: 31200 },
    { day: 'Sun', amount: todayRevenue }
  ];
  const maxWeekly = Math.max(...weeklySales.map((s) => s.amount));

  const handleVerifyPass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exitPassCodeInput.trim()) return;
    const ok = verifyOrderExitPass(exitPassCodeInput.trim());
    if (ok) setExitPassCodeInput('');
  };

  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postDraft.trim()) return;
    createFeedPost(postDraft.trim(), 'Store Drop');
    setPostDraft('');
    setIsPostingFeed(false);
  };

  return (
    <div className="pb-28 max-w-4xl mx-auto px-4 pt-2 space-y-5">
      {/* Store Header */}
      <div className="bg-gradient-to-r from-teal-900 to-[#0F766E] text-white p-5 rounded-3xl shadow-md border border-teal-500/30 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300">
            Store Owner Portal
          </span>
          <h2 className="font-heading font-extrabold text-xl sm:text-2xl mt-0.5">
            {ownerShop.name}
          </h2>
          <p className="text-xs text-teal-200/90 mt-1">
            {ownerShop.area} · Self-checkout: Active
          </p>
        </div>
        <button
          onClick={() => setIsEditorOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-[#F59E0B] text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs hover:bg-[#fbbf24] active:scale-95 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* 1. Quick Stats 4-Grid (Section 5.20) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-3xl bg-white dark:bg-[#171D1B] border border-[#CBD5D2]/50 dark:border-[#3A4642]/60 shadow-2xs">
          <div className="flex items-center justify-between text-[#5B6B67] dark:text-[#9DB0AB] mb-1">
            <span className="text-[11px] font-medium">Today's Sales</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="font-heading font-extrabold text-lg sm:text-xl text-[#0F1F1C] dark:text-[#E8F0EE]">
            ₹{todayRevenue.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">+14% vs yesterday</span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-[#171D1B] border border-[#CBD5D2]/50 dark:border-[#3A4642]/60 shadow-2xs">
          <div className="flex items-center justify-between text-[#5B6B67] dark:text-[#9DB0AB] mb-1">
            <span className="text-[11px] font-medium">Orders Today</span>
            <ShoppingBag className="w-4 h-4 text-[#0F766E]" />
          </div>
          <div className="font-heading font-extrabold text-lg sm:text-xl text-[#0F1F1C] dark:text-[#E8F0EE]">
            {todayOrders}
          </div>
          <span className="text-[10px] text-[#0F766E] font-semibold">12 Self-checkout</span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-[#171D1B] border border-[#CBD5D2]/50 dark:border-[#3A4642]/60 shadow-2xs">
          <div className="flex items-center justify-between text-[#5B6B67] dark:text-[#9DB0AB] mb-1">
            <span className="text-[11px] font-medium">New Followers</span>
            <Users className="w-4 h-4 text-[#6D5EF5]" />
          </div>
          <div className="font-heading font-extrabold text-lg sm:text-xl text-[#0F1F1C] dark:text-[#E8F0EE]">
            +28
          </div>
          <span className="text-[10px] text-slate-500 font-medium">384 total fans</span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-[#171D1B] border border-[#CBD5D2]/50 dark:border-[#3A4642]/60 shadow-2xs">
          <div className="flex items-center justify-between text-[#5B6B67] dark:text-[#9DB0AB] mb-1">
            <span className="text-[11px] font-medium">Low Stock Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="font-heading font-extrabold text-lg sm:text-xl text-amber-600 dark:text-amber-400">
            {lowStockItems.length} items
          </div>
          <span className="text-[10px] text-amber-700 font-semibold">Needs restock</span>
        </div>
      </div>

      {/* 2. Customer Exit Pass QR / Code Verification Box */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 border border-teal-500/30 shadow-md">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1">
              <QrCode className="w-3.5 h-3.5" /> Gate Check & Security
            </span>
            <h3 className="font-heading font-bold text-base text-white mt-0.5">
              Verify Customer Exit Pass
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Enter or scan the customer's self-checkout exit pass code before they leave
            </p>
          </div>
        </div>

        <form onSubmit={handleVerifyPass} className="flex gap-2">
          <input
            type="text"
            value={exitPassCodeInput}
            onChange={(e) => setExitPassCodeInput(e.target.value)}
            placeholder="e.g. ORD-8921 or GENIE-PASS-..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm font-mono text-white focus:outline-hidden focus:border-teal-400"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#0c615b] font-bold text-xs text-white shrink-0 active:scale-95 transition-all shadow-xs"
          >
            Verify Pass
          </button>
        </form>
      </div>

      {/* 3. 7-Day Revenue Bar Chart (Jetpack Compose visual style) */}
      <div className="bg-white dark:bg-[#171D1B] rounded-3xl p-5 border border-[#CBD5D2]/50 dark:border-[#3A4642]/60 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading font-bold text-sm text-[#0F1F1C] dark:text-[#E8F0EE]">
              7-Day Revenue Performance
            </h3>
            <p className="text-xs text-[#5B6B67] dark:text-[#9DB0AB]">
              Self-checkout + Counter volume
            </p>
          </div>
          <span className="text-xs font-bold text-[#0F766E] dark:text-[#5EEAD4]">
            Total: ₹1,53,600
          </span>
        </div>

        {/* Bar Chart Container */}
        <div className="h-40 flex items-end justify-between gap-2 pt-4 px-2">
          {weeklySales.map((item, idx) => {
            const heightPct = Math.round((item.amount / maxWeekly) * 100);
            const isToday = idx === weeklySales.length - 1;
            return (
              <div key={item.day} className="flex-1 flex flex-col items-center gap-1 group">
                <span className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  ₹{(item.amount / 1000).toFixed(1)}k
                </span>
                <div className="w-full max-w-[36px] bg-slate-100 dark:bg-slate-800 rounded-t-xl overflow-hidden h-28 flex items-end">
                  <div
                    className={`w-full rounded-t-xl transition-all duration-500 ${
                      isToday
                        ? 'bg-gradient-to-t from-[#0F766E] to-[#5EEAD4]'
                        : 'bg-gradient-to-t from-teal-800 to-teal-600 group-hover:brightness-110'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                <span className={`text-[11px] font-medium mt-1 ${isToday ? 'font-bold text-[#0F766E]' : 'text-slate-500'}`}>
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Quick Actions Row */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => setIsEditorOpen(true)}
          className="p-3.5 rounded-2xl bg-white dark:bg-[#171D1B] border border-[#CBD5D2]/50 dark:border-[#3A4642]/60 hover:border-[#0F766E] flex flex-col items-center text-center shadow-2xs group"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-[#0F766E] flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
            <Plus className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-[#0F1F1C] dark:text-[#E8F0EE]">Add Product</span>
          <span className="text-[10px] text-[#5B6B67] dark:text-[#9DB0AB]">AI scanner</span>
        </button>

        <button
          onClick={() => setOwnerTab('offers')}
          className="p-3.5 rounded-2xl bg-white dark:bg-[#171D1B] border border-[#CBD5D2]/50 dark:border-[#3A4642]/60 hover:border-[#0F766E] flex flex-col items-center text-center shadow-2xs group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
            <Tag className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-[#0F1F1C] dark:text-[#E8F0EE]">Create Offer</span>
          <span className="text-[10px] text-[#5B6B67] dark:text-[#9DB0AB]">Flash discount</span>
        </button>

        <button
          onClick={() => setIsPostingFeed(!isPostingFeed)}
          className="p-3.5 rounded-2xl bg-white dark:bg-[#171D1B] border border-[#CBD5D2]/50 dark:border-[#3A4642]/60 hover:border-[#0F766E] flex flex-col items-center text-center shadow-2xs group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
            <MessageSquarePlus className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-[#0F1F1C] dark:text-[#E8F0EE]">Post Update</span>
          <span className="text-[10px] text-[#5B6B67] dark:text-[#9DB0AB]">To Local Feed</span>
        </button>
      </div>

      {/* Local Feed Poster Form */}
      {isPostingFeed && (
        <form onSubmit={handlePublishPost} className="p-4 rounded-3xl bg-white dark:bg-[#171D1B] border border-[#CBD5D2]/50 dark:border-[#3A4642]/60 shadow-md space-y-3">
          <h4 className="font-heading font-bold text-xs text-[#0F1F1C] dark:text-[#E8F0EE]">
            Publish Update to Neighbourhood Feed
          </h4>
          <textarea
            rows={2}
            value={postDraft}
            onChange={(e) => setPostDraft(e.target.value)}
            placeholder="Tell nearby shoppers about fresh batches, new arrivals, or discounts today..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#131917] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-[#0F766E]"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsPostingFeed(false)}
              className="px-3 py-1.5 rounded-xl text-xs text-slate-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#0F766E] text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
            >
              Broadcast Update
            </button>
          </div>
        </form>
      )}

      {/* Product Editor Modal */}
      <OwnerProductEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
      />
    </div>
  );
};

// 2. Owner Inventory Screen (Inline Stock Edit)
export const OwnerInventoryScreen: React.FC = () => {
  const { products, updateProductStock } = useShopGenie();
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const shopProducts = products.filter((p) => p.shopId === 'shop-1');
  const filtered = searchTerm
    ? shopProducts.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : shopProducts;

  return (
    <div className="pb-28 max-w-4xl mx-auto px-4 pt-2 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-extrabold text-lg text-[#0F1F1C] dark:text-[#E8F0EE]">
            Store Inventory
          </h2>
          <p className="text-xs text-[#5B6B67] dark:text-[#9DB0AB]">
            {shopProducts.length} items listed · Inline stock editing
          </p>
        </div>
        <button
          onClick={() => setIsEditorOpen(true)}
          className="px-3.5 py-2 rounded-2xl bg-[#0F766E] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter inventory by name or barcode..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-[#171D1B] border border-[#CBD5D2]/50 dark:border-[#3A4642] text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden"
        />
      </div>

      {/* Inventory Rows */}
      <div className="space-y-2.5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-2xl bg-white dark:bg-[#171D1B] border border-[#CBD5D2]/50 dark:border-[#3A4642]/60 shadow-2xs flex items-center justify-between gap-3"
          >
            <div className="flex-1 min-w-0">
              <h4 className="font-heading font-bold text-xs sm:text-sm text-[#0F1F1C] dark:text-[#E8F0EE] truncate">
                {item.name}
              </h4>
              <p className="text-[11px] font-mono text-[#5B6B67] dark:text-[#9DB0AB] mt-0.5">
                EAN: {item.barcode} · Selling: ₹{item.price}
              </p>
            </div>

            {/* Inline Stock Stepper */}
            <div className="flex items-center gap-2">
              <div className="text-right mr-1">
                <span className="text-[10px] text-slate-400 block">Stock</span>
                <span
                  className={`text-xs font-mono font-bold ${
                    item.stock <= 5 ? 'text-amber-600' : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {item.stock} pcs
                </span>
              </div>
              <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                <button
                  onClick={() => updateProductStock(item.id, item.stock - 1)}
                  className="px-2.5 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  -
                </button>
                <button
                  onClick={() => updateProductStock(item.id, item.stock + 1)}
                  className="px-2.5 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <OwnerProductEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
      />
    </div>
  );
};

// 3. Owner Offers Screen (Create / Pause / Live Preview Card)
export const OwnerOffersScreen: React.FC = () => {
  const { offers, toggleOfferStatus, createOffer, showSnackbar } = useShopGenie();
  const [isCreatingOffer, setIsCreatingOffer] = useState(false);
  const [offerTitle, setOfferTitle] = useState('');
  const [offerCode, setOfferCode] = useState('FLASH25');
  const [offerVal, setOfferVal] = useState('25');

  const shopOffers = offers.filter((o) => o.shopId === 'shop-1');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerTitle.trim()) return;
    createOffer({
      shopId: 'shop-1',
      shopName: 'The Old Coffee Roasters',
      title: offerTitle.trim(),
      description: 'Limited seasonal discount on freshly brewed items.',
      type: 'percentage',
      value: Number(offerVal) || 20,
      code: offerCode.trim().toUpperCase(),
      validFrom: 'Today',
      validTo: 'In 3 days',
      bannerGradient: 'from-teal-800 to-emerald-950',
      isEndingSoon: false
    });
    setOfferTitle('');
    setIsCreatingOffer(false);
  };

  return (
    <div className="pb-28 max-w-4xl mx-auto px-4 pt-2 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-extrabold text-lg text-[#0F1F1C] dark:text-[#E8F0EE]">
            Active Offers & Specials
          </h2>
          <p className="text-xs text-[#5B6B67] dark:text-[#9DB0AB]">
            Publish discounts to nearby shoppers in your neighbourhood
          </p>
        </div>
        <button
          onClick={() => setIsCreatingOffer(!isCreatingOffer)}
          className="px-3.5 py-2 rounded-2xl bg-[#0F766E] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" /> Create Offer
        </button>
      </div>

      {/* Offer Creator */}
      {isCreatingOffer && (
        <form onSubmit={handleCreate} className="p-4 rounded-3xl bg-white dark:bg-[#171D1B] border border-teal-500/40 shadow-md space-y-3">
          <h4 className="font-heading font-bold text-xs text-[#0F1F1C] dark:text-[#E8F0EE]">
            Launch New Hyperlocal Offer
          </h4>
          <input
            type="text"
            value={offerTitle}
            onChange={(e) => setOfferTitle(e.target.value)}
            placeholder="e.g. Flat 25% OFF on Cold Brews & Beans"
            required
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#131917] border border-slate-200 dark:border-slate-800 text-xs focus:outline-hidden"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={offerCode}
              onChange={(e) => setOfferCode(e.target.value)}
              placeholder="Promo Code"
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#131917] border border-slate-200 dark:border-slate-800 text-xs font-mono"
            />
            <input
              type="number"
              value={offerVal}
              onChange={(e) => setOfferVal(e.target.value)}
              placeholder="Discount %"
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#131917] border border-slate-200 dark:border-slate-800 text-xs"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsCreatingOffer(false)}
              className="px-3 py-1.5 text-xs text-slate-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#0F766E] text-white text-xs font-bold shadow-xs"
            >
              Publish Offer
            </button>
          </div>
        </form>
      )}

      {/* Existing Offers */}
      <div className="space-y-3">
        {shopOffers.map((offer) => (
          <div
            key={offer.id}
            className="p-4 rounded-3xl bg-white dark:bg-[#171D1B] border border-[#CBD5D2]/50 dark:border-[#3A4642]/60 shadow-2xs flex items-center justify-between gap-3"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded">
                  {offer.code}
                </span>
                <span className="text-[11px] text-slate-500">{offer.validTo}</span>
              </div>
              <h4 className="font-heading font-bold text-xs sm:text-sm text-[#0F1F1C] dark:text-[#E8F0EE]">
                {offer.title}
              </h4>
            </div>

            <button
              onClick={() => toggleOfferStatus(offer.id)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {offer.isEndingSoon ? 'Ending Soon' : 'Active'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// 4. Owner Store Profile Screen
export const OwnerStoreProfileScreen: React.FC = () => {
  const { ownerShop, updateOwnerShop, showSnackbar } = useShopGenie();

  const [hours, setHours] = useState(ownerShop.hours);
  const [address, setAddress] = useState(ownerShop.address);
  const [phone, setPhone] = useState(ownerShop.phone);
  const [selfCheckoutEnabled, setSelfCheckoutEnabled] = useState(ownerShop.supportsSelfCheckout);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateOwnerShop({
      hours,
      address,
      phone,
      supportsSelfCheckout: selfCheckoutEnabled
    });
  };

  return (
    <div className="pb-28 max-w-xl mx-auto px-4 pt-2 space-y-4">
      <div>
        <h2 className="font-heading font-extrabold text-lg text-[#0F1F1C] dark:text-[#E8F0EE]">
          Store Settings
        </h2>
        <p className="text-xs text-[#5B6B67] dark:text-[#9DB0AB]">
          Configure operating hours, location & self-checkout
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white dark:bg-[#171D1B] rounded-3xl p-5 border border-[#CBD5D2]/50 dark:border-[#3A4642]/60 shadow-2xs space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#5B6B67] dark:text-[#9DB0AB]">
            Operating Hours
          </label>
          <input
            type="text"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#131917] border border-slate-200 dark:border-slate-800 text-xs focus:outline-hidden"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#5B6B67] dark:text-[#9DB0AB]">
            Store Street Address
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#131917] border border-slate-200 dark:border-slate-800 text-xs focus:outline-hidden"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#5B6B67] dark:text-[#9DB0AB]">
            Owner / Desk Phone
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#131917] border border-slate-200 dark:border-slate-800 text-xs focus:outline-hidden"
          />
        </div>

        {/* Self Checkout Switch */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/40">
          <div>
            <span className="font-heading font-bold text-xs text-[#0F766E] dark:text-[#5EEAD4] block">
              Enable Scan & Pay Self-Checkout
            </span>
            <span className="text-[11px] text-teal-800/80 dark:text-teal-300/80">
              Customers can scan barcodes and pay via app inside your store
            </span>
          </div>
          <input
            type="checkbox"
            checked={selfCheckoutEnabled}
            onChange={(e) => setSelfCheckoutEnabled(e.target.checked)}
            className="w-5 h-5 accent-[#0F766E] rounded cursor-pointer"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-2xl bg-[#0F766E] text-white font-bold text-xs hover:bg-[#0c615b] shadow-md transition-all active:scale-95"
        >
          Save Store Profile
        </button>
      </form>
    </div>
  );
};
