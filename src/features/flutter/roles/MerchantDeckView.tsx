import React, { useState } from 'react';
import { 
  Store, 
  DollarSign, 
  Users, 
  CheckCircle2, 
  Zap, 
  Send, 
  Printer, 
  Plus, 
  Search, 
  QrCode, 
  Clock, 
  Tag, 
  ShieldCheck, 
  X,
  Package,
  Layers
} from 'lucide-react';
import { ProductItem, DeckOrder } from '../flutterDeckTypes';

interface MerchantDeckViewProps {
  isStoreOpen: boolean;
  setIsStoreOpen: (open: boolean) => void;
  inventory: ProductItem[];
  setInventory: React.Dispatch<React.SetStateAction<ProductItem[]>>;
  orders: DeckOrder[];
  showToast: (msg: string) => void;
}

export const MerchantDeckView: React.FC<MerchantDeckViewProps> = ({
  isStoreOpen,
  setIsStoreOpen,
  inventory,
  setInventory,
  orders,
  showToast
}) => {
  const [merchantSubTab, setMerchantSubTab] = useState<'overview' | 'inventory' | 'orders' | 'broadcast'>('overview');
  const [inventorySearch, setInventorySearch] = useState('');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);

  // New product form
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Produce');
  const [newProdPrice, setNewProdPrice] = useState('3.99');
  const [newProdStock, setNewProdStock] = useState('20');
  const [newProdEmoji, setNewProdEmoji] = useState('🍎');

  // Broadcast deal form
  const [dealTitle, setDealTitle] = useState('Flash 25% Off Fresh Harvest');
  const [dealCode, setDealCode] = useState('FLASH25');
  const [dealExpiry, setDealExpiry] = useState('Ends in 3 hours');

  const merchantOrders = orders.filter(o => o.storeId === '1');
  const todayTotalSales = 4280.50 + merchantOrders.reduce((sum, o) => sum + o.total, 0);

  const handleStockToggle = (id: string) => {
    setInventory(prev => prev.map(p => {
      if (p.id === id) {
        const nextState = !p.inStock;
        showToast(`${p.name} is now ${nextState ? 'In Stock' : 'Out of Stock'}`);
        return { ...p, inStock: nextState };
      }
      return p;
    }));
  };

  const handleStockDelta = (id: string, delta: number) => {
    setInventory(prev => prev.map(p => {
      if (p.id === id) {
        const newStock = Math.max(0, p.stock + delta);
        return { ...p, stock: newStock, inStock: newStock > 0 };
      }
      return p;
    }));
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;
    const priceNum = parseFloat(newProdPrice) || 1.99;
    const stockNum = parseInt(newProdStock) || 10;
    const newProduct: ProductItem = {
      id: `p-${Date.now()}`,
      storeId: '1',
      storeName: 'GreenLeaf Organic Grocers',
      name: newProdName.trim(),
      category: newProdCategory,
      price: priceNum,
      mrp: priceNum * 1.25,
      emoji: newProdEmoji || '📦',
      barcode: `890${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      stock: stockNum,
      inStock: stockNum > 0
    };
    setInventory(prev => [newProduct, ...prev]);
    setIsAddProductOpen(false);
    setNewProdName('');
    showToast(`Added ${newProduct.name} to live aisle inventory!`);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBroadcastModalOpen(false);
    showToast(`Broadcasted deal "${dealTitle}" to 840 followers!`);
  };

  const filteredInventory = inventory.filter(p => 
    p.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
    p.category.toLowerCase().includes(inventorySearch.toLowerCase()) ||
    p.barcode.includes(inventorySearch)
  );

  return (
    <div className="flex-1 flex flex-col pt-10 overflow-y-auto pb-16">
      {/* Merchant Header */}
      <div className="bg-white dark:bg-[#141C1A] px-4 py-3 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">Merchant Console</h2>
                <span className="px-1.5 py-0.2 rounded-md bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">Live</span>
              </div>
              <p className="text-[11px] text-slate-500">GreenLeaf Organic Grocers · Koramangala 4th Block</p>
            </div>
          </div>

          {/* Store status pill */}
          <button
            onClick={() => {
              setIsStoreOpen(!isStoreOpen);
              showToast(`Store is now ${!isStoreOpen ? 'Online & Accepting Self-Checkouts' : 'Offline'}`);
            }}
            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1.5 transition-all ${
              isStoreOpen ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isStoreOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            <span>{isStoreOpen ? 'ONLINE' : 'OFFLINE'}</span>
          </button>
        </div>

        {/* Merchant Subtabs */}
        <div className="flex gap-1 mt-3 bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-xl text-xs font-bold">
          <button
            onClick={() => setMerchantSubTab('overview')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              merchantSubTab === 'overview'
                ? 'bg-white dark:bg-[#141C1A] text-[#0F766E] dark:text-[#5EEAD4] shadow-2xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setMerchantSubTab('inventory')}
            className={`flex-1 py-1.5 rounded-lg transition-all relative ${
              merchantSubTab === 'inventory'
                ? 'bg-white dark:bg-[#141C1A] text-[#0F766E] dark:text-[#5EEAD4] shadow-2xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Inventory ({inventory.length})
          </button>
          <button
            onClick={() => setMerchantSubTab('orders')}
            className={`flex-1 py-1.5 rounded-lg transition-all relative ${
              merchantSubTab === 'orders'
                ? 'bg-white dark:bg-[#141C1A] text-[#0F766E] dark:text-[#5EEAD4] shadow-2xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Orders
            {merchantOrders.some(o => o.status === 'pending_gate') && (
              <span className="w-2 h-2 bg-amber-500 rounded-full inline-block ml-1 animate-ping" />
            )}
          </button>
          <button
            onClick={() => setMerchantSubTab('broadcast')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              merchantSubTab === 'broadcast'
                ? 'bg-white dark:bg-[#141C1A] text-[#0F766E] dark:text-[#5EEAD4] shadow-2xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Broadcast
          </button>
        </div>
      </div>

      {/* Merchant SubTab Content */}
      <div className="p-4 space-y-4">
        {merchantSubTab === 'overview' && (
          <>
            {/* KPI Metrics */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-white dark:bg-[#141C1A] p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-[11px] font-semibold">Today's Sales</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-lg font-bold text-slate-800 dark:text-white">
                  ${todayTotalSales.toFixed(2)}
                </div>
                <div className="text-[10px] text-emerald-600 font-medium">+18.4% vs last week</div>
              </div>

              <div className="bg-white dark:bg-[#141C1A] p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-[11px] font-semibold">Live Shoppers</span>
                  <Users className="w-4 h-4 text-[#0F766E]" />
                </div>
                <div className="text-lg font-bold text-slate-800 dark:text-white">18 Active</div>
                <div className="text-[10px] text-slate-500">Scanning in aisles right now</div>
              </div>

              <div className="bg-white dark:bg-[#141C1A] p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-[11px] font-semibold">Orders Today</span>
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-lg font-bold text-slate-800 dark:text-white">
                  {142 + merchantOrders.length} Orders
                </div>
                <div className="text-[10px] text-blue-600 font-medium">Avg checkout 38s</div>
              </div>

              <div className="bg-white dark:bg-[#141C1A] p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-[11px] font-semibold">Self-Checkout</span>
                  <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                </div>
                <div className="text-lg font-bold text-slate-800 dark:text-white">96.4%</div>
                <div className="text-[10px] text-amber-600 font-medium">Zero counter lines</div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setIsBroadcastModalOpen(true)}
                className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-[#0F766E] text-white text-xs font-bold shadow-xs hover:bg-[#115E59] transition-colors"
              >
                <Send className="w-4 h-4 mb-1" />
                <span>Broadcast</span>
              </button>

              <button
                onClick={() => setIsPrintModalOpen(true)}
                className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white dark:bg-[#141C1A] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-xs hover:bg-slate-50 transition-colors"
              >
                <Printer className="w-4 h-4 mb-1 text-[#0F766E]" />
                <span>Print QR</span>
              </button>

              <button
                onClick={() => setIsAddProductOpen(true)}
                className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-amber-500 text-slate-950 text-xs font-bold shadow-xs hover:bg-amber-400 transition-colors"
              >
                <Plus className="w-4 h-4 mb-1" />
                <span>Add Item</span>
              </button>
            </div>

            {/* Recent Orders Alert */}
            <div className="bg-white dark:bg-[#141C1A] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                  Live Self-Checkout Queue ({merchantOrders.length})
                </h3>
                <button
                  onClick={() => setMerchantSubTab('orders')}
                  className="text-xs font-bold text-[#0F766E] dark:text-[#5EEAD4]"
                >
                  View All →
                </button>
              </div>

              <div className="space-y-2">
                {merchantOrders.slice(0, 3).map(order => (
                  <div key={order.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{order.customerName}</span>
                        <span className="font-mono text-[10px] text-slate-400">{order.passCode}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {order.items.length} items · ${order.total.toFixed(2)} · {order.timestamp}
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      order.status === 'verified_exit'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800 animate-pulse'
                    }`}>
                      {order.status === 'verified_exit' ? 'Cleared Gate' : 'Pending Exit'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {merchantSubTab === 'inventory' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={inventorySearch}
                  onChange={e => setInventorySearch(e.target.value)}
                  placeholder="Filter aisle products..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-[#141C1A] border border-slate-200 dark:border-slate-800 text-xs focus:ring-2 focus:ring-[#0F766E]"
                />
              </div>
              <button
                onClick={() => setIsAddProductOpen(true)}
                className="px-3 py-2 bg-[#0F766E] text-white rounded-xl text-xs font-bold flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2">
              {filteredInventory.map(item => (
                <div
                  key={item.id}
                  className="p-3 bg-white dark:bg-[#141C1A] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{item.emoji}</span>
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-100">{item.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        ${item.price.toFixed(2)} · Barcode: {item.barcode.slice(-5)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Stock counter */}
                    <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg text-xs font-bold">
                      <button onClick={() => handleStockDelta(item.id, -1)} className="hover:text-red-500">-</button>
                      <span className="min-w-[18px] text-center">{item.stock}</span>
                      <button onClick={() => handleStockDelta(item.id, 1)} className="hover:text-emerald-500">+</button>
                    </div>

                    {/* Stock status toggle */}
                    <button
                      onClick={() => handleStockToggle(item.id)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                        item.inStock
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                      }`}
                    >
                      {item.inStock ? 'In Stock' : 'Out'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {merchantSubTab === 'orders' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                Live Self-Checkout Feed ({merchantOrders.length})
              </h3>
              <span className="text-[11px] text-[#0F766E] font-semibold">Auto-Syncing</span>
            </div>

            <div className="space-y-2.5">
              {merchantOrders.map(order => (
                <div
                  key={order.id}
                  className="p-3.5 bg-white dark:bg-[#141C1A] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{order.customerName}</span>
                        <span className="text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[#0F766E]">
                          {order.passCode}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{order.timestamp} · {order.paymentMethod}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      order.status === 'verified_exit'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {order.status === 'verified_exit' ? 'Verified Exit' : 'At Gate'}
                    </span>
                  </div>

                  <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[11px]">
                        <span>{item.emoji} {item.name} × {item.quantity}</span>
                        <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t border-slate-200 dark:border-slate-800 pt-1 flex justify-between font-bold text-xs">
                      <span>Total Paid</span>
                      <span className="text-[#0F766E]">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {merchantSubTab === 'broadcast' && (
          <div className="bg-white dark:bg-[#141C1A] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                Store Deals & Flash Broadcast
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Push instant promo notifications to 840 nearby followers</p>
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold text-[10px]">CURRENT DEAL</span>
                <span className="text-[10px] text-slate-500">Active</span>
              </div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-white mt-1">20% off fresh greens</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">Promo: GREEN20 · Valid today</p>
            </div>

            <button
              onClick={() => setIsBroadcastModalOpen(true)}
              className="w-full py-2.5 bg-[#0F766E] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span>Compose New Flash Deal</span>
            </button>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {isAddProductOpen && (
        <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col justify-end">
          <div className="bg-white dark:bg-[#141C1A] rounded-t-3xl p-5 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold">Add Aisle Item to Inventory</h3>
              <button onClick={() => setIsAddProductOpen(false)} className="p-1 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="space-y-2.5 text-xs">
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={e => setNewProdName(e.target.value)}
                  placeholder="e.g. Crisp Fuji Apples (4 pack)"
                  className="w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProdPrice}
                    onChange={e => setNewProdPrice(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Stock</label>
                  <input
                    type="number"
                    value={newProdStock}
                    onChange={e => setNewProdStock(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Emoji</label>
                  <input
                    type="text"
                    value={newProdEmoji}
                    onChange={e => setNewProdEmoji(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-center"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#0F766E] text-white rounded-xl font-bold shadow-xs hover:bg-[#115E59]"
              >
                Publish to Live Aisles
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Print QR Modal */}
      {isPrintModalOpen && (
        <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col justify-end">
          <div className="bg-white dark:bg-[#141C1A] rounded-t-3xl p-5 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold">Print Store Aisle QR Posters</h3>
              <button onClick={() => setIsPrintModalOpen(false)} className="p-1 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center">
              <QrCode className="w-24 h-24 mx-auto text-[#0F766E]" />
              <div className="text-xs font-bold mt-2">GreenLeaf Organic Grocers</div>
              <div className="text-[10px] text-slate-500">"Scan in Aisle with ShopGenie & Skip Queues"</div>
            </div>
            <button
              onClick={() => {
                setIsPrintModalOpen(false);
                showToast('Thermal Aisle Poster sent to network printer!');
              }}
              className="w-full py-2.5 bg-[#0F766E] text-white rounded-xl text-xs font-bold"
            >
              Print 5 Aisle Placards
            </button>
          </div>
        </div>
      )}

      {/* Compose Deal Modal */}
      {isBroadcastModalOpen && (
        <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col justify-end">
          <div className="bg-white dark:bg-[#141C1A] rounded-t-3xl p-5 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold">Broadcast Flash Deal to 840 Followers</h3>
              <button onClick={() => setIsBroadcastModalOpen(false)} className="p-1 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSendBroadcast} className="space-y-2.5 text-xs">
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Deal Title</label>
                <input
                  type="text"
                  required
                  value={dealTitle}
                  onChange={e => setDealTitle(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Promo Code</label>
                  <input
                    type="text"
                    value={dealCode}
                    onChange={e => setDealCode(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none uppercase font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Validity</label>
                  <input
                    type="text"
                    value={dealExpiry}
                    onChange={e => setDealExpiry(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-[#0F766E] text-white rounded-xl font-bold shadow-xs hover:bg-[#115E59]"
              >
                Send Flash Notification Now
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
