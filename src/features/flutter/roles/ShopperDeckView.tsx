import React, { useState } from 'react';
import { 
  Search, 
  Compass, 
  FileText, 
  Tag, 
  Heart, 
  QrCode, 
  Sparkles, 
  MapPin, 
  ChevronRight, 
  ArrowLeft, 
  Verified, 
  Zap, 
  Plus, 
  Minus, 
  Flashlight, 
  CheckCircle2, 
  ShoppingBag, 
  User, 
  ChevronDown
} from 'lucide-react';
import { StoreItem, ProductItem, CartItem, DeckOrder } from '../flutterDeckTypes';

interface ShopperDeckViewProps {
  activeTab: 'home' | 'map' | 'scan' | 'search' | 'cart';
  setActiveTab: (tab: 'home' | 'map' | 'scan' | 'search' | 'cart') => void;
  currentLocation: string;
  setIsLocationModalOpen: (open: boolean) => void;
  setIsProfileModalOpen: (open: boolean) => void;
  stores: StoreItem[];
  products: ProductItem[];
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  orders: DeckOrder[];
  setOrders: React.Dispatch<React.SetStateAction<DeckOrder[]>>;
  showToast: (msg: string) => void;
}

const CATEGORIES = ['All', 'Supermarket', 'Bakery & Cafe', 'Pharmacy', 'Electronics', 'Fashion'];

export const ShopperDeckView: React.FC<ShopperDeckViewProps> = ({
  activeTab,
  setActiveTab,
  currentLocation,
  setIsLocationModalOpen,
  setIsProfileModalOpen,
  stores,
  products,
  cart,
  setCart,
  orders,
  setOrders,
  showToast
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState<StoreItem | null>(null);
  const [activeFeedView, setActiveFeedView] = useState<'feed' | 'offers' | 'following' | null>(null);
  const [showExitPass, setShowExitPass] = useState(false);
  const [latestPassCode, setLatestPassCode] = useState('#SG-PASS-8942');

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.05;
  const discount = subtotal > 0 ? 1.50 : 0.0;
  const totalPayable = Math.max(0, subtotal + tax - discount);

  const filteredStores = stores.filter(s => {
    const matchesCat = selectedCategory === 'All' || s.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesQuery = !searchQuery.trim() ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleAddToCart = (product: ProductItem | CartItem) => {
    setCart(prev => {
      const idx = prev.findIndex(item => item.id === product.id || item.barcode === product.barcode);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx].quantity += 1;
        return updated;
      }
      return [
        ...prev,
        {
          id: product.id,
          storeId: product.storeId,
          name: product.name,
          price: product.price,
          emoji: product.emoji,
          barcode: product.barcode,
          quantity: 1
        }
      ];
    });
    showToast(`Added ${product.name} to cart!`);
  };

  const handleIncrement = (id: string) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
  };

  const handleDecrement = (id: string) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: item.quantity - 1 } : item).filter(item => item.quantity > 0));
  };

  const handleExpressPay = () => {
    const passNum = Math.floor(1000 + Math.random() * 9000);
    const passCode = `#SG-PASS-${passNum}`;
    const newOrder: DeckOrder = {
      id: `ord-${passNum}`,
      passCode: passCode,
      storeId: cart[0]?.storeId || '1',
      storeName: stores.find(s => s.id === (cart[0]?.storeId || '1'))?.name || 'GreenLeaf Organic Grocers',
      customerName: 'Vinay Kharvik',
      customerPhone: '+91 98451 90812',
      items: [...cart],
      total: totalPayable,
      timestamp: 'Just now',
      status: 'pending_gate',
      paymentMethod: 'UPI AutoPay (Verified)'
    };

    setOrders(prev => [newOrder, ...prev]);
    setLatestPassCode(passCode);
    setShowExitPass(true);
    showToast(`Payment successful! Exit Pass ${passCode} generated.`);
  };

  // STORE DETAIL SCREEN
  if (selectedStore) {
    return (
      <div className="flex-1 flex flex-col pt-10 overflow-y-auto pb-16">
        <div className="bg-white dark:bg-[#141C1A] p-4 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setSelectedStore(null)}
            className="flex items-center gap-1 text-xs font-bold text-[#0F766E] mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Shops</span>
          </button>
          <div className="flex items-start gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[#0F766E]/10 flex items-center justify-center text-3xl">
              {selectedStore.emoji}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">{selectedStore.name}</h2>
                <Verified className="w-4 h-4 text-[#0F766E]" />
              </div>
              <div className="text-xs text-slate-500 mt-0.5">{selectedStore.category} · {selectedStore.distance}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold text-[11px]">
                  {selectedStore.rating}
                </span>
                <span className="text-[11px] text-slate-500">{selectedStore.followers} followers</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-3">{selectedStore.description}</p>
        </div>

        {selectedStore.selfCheckout && (
          <div className="m-4 p-3 rounded-2xl bg-gradient-to-r from-[#0F766E] to-[#14B8A6] text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-amber-400 fill-amber-400" />
              <div>
                <div className="text-xs font-bold">Self-Checkout Active</div>
                <div className="text-[10px] text-white/80">Scan barcodes in aisle and skip lines</div>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedStore(null);
                setActiveTab('scan');
              }}
              className="px-3 py-1.5 bg-white text-[#0F766E] rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
            >
              Scan Now
            </button>
          </div>
        )}

        <div className="p-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Aisle Products</h3>
          <div className="space-y-2">
            {products.filter(p => p.storeId === selectedStore.id || selectedStore.id === '1').map(product => (
              <div key={product.id} className="p-3 bg-white dark:bg-[#141C1A] rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{product.emoji}</span>
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-100">{product.name}</div>
                    <div className="text-[11px] text-[#0F766E] font-bold">${product.price.toFixed(2)}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="px-3 py-1 bg-[#0F766E] text-white rounded-lg text-xs font-semibold hover:bg-[#115E59]"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // FEED / OFFERS / FOLLOWING SCREEN
  if (activeFeedView) {
    return (
      <div className="flex-1 flex flex-col pt-10 overflow-y-auto pb-16">
        <div className="bg-white dark:bg-[#141C1A] px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => setActiveFeedView(null)}
            className="flex items-center gap-1 text-xs font-bold text-[#0F766E]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
          <div className="flex gap-1 text-xs font-bold">
            <button
              onClick={() => setActiveFeedView('feed')}
              className={`px-2.5 py-1 rounded-lg ${activeFeedView === 'feed' ? 'bg-[#0F766E] text-white' : 'text-slate-600'}`}
            >
              Feed
            </button>
            <button
              onClick={() => setActiveFeedView('offers')}
              className={`px-2.5 py-1 rounded-lg ${activeFeedView === 'offers' ? 'bg-[#0F766E] text-white' : 'text-slate-600'}`}
            >
              Offers
            </button>
            <button
              onClick={() => setActiveFeedView('following')}
              className={`px-2.5 py-1 rounded-lg ${activeFeedView === 'following' ? 'bg-[#0F766E] text-white' : 'text-slate-600'}`}
            >
              Following
            </button>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {activeFeedView === 'feed' && (
            <>
              <div className="p-4 bg-white dark:bg-[#141C1A] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🥐</span>
                  <div>
                    <div className="text-xs font-bold">The Daily Crust Bakery</div>
                    <div className="text-[10px] text-slate-500">15 mins ago · Koramangala</div>
                  </div>
                </div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">Fresh batch of Almond Croissants just out of oven! 🔥</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">Baked with 100% French butter. Pair with a flat white espresso today before 1 PM.</p>
              </div>
              <div className="p-4 bg-white dark:bg-[#141C1A] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🥦</span>
                  <div>
                    <div className="text-xs font-bold">GreenLeaf Organic Grocers</div>
                    <div className="text-[10px] text-slate-500">1 hour ago · Indiranagar</div>
                  </div>
                </div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">New season Alphonso Mangoes & avocados arrived</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">Sourced directly from Ratnagiri organic orchards. Sweet aroma guaranteed.</p>
              </div>
            </>
          )}

          {activeFeedView === 'offers' && (
            <>
              <div className="p-4 bg-white dark:bg-[#141C1A] rounded-2xl border border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/30 shadow-2xs">
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">20% OFF</span>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-2">Flat 20% Off Organic Greens</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">Valid at GreenLeaf Organic Grocers on orders over $15.</p>
                <div className="flex items-center justify-between mt-3 text-xs">
                  <code className="bg-white dark:bg-slate-800 px-2 py-1 rounded border font-mono font-bold text-[#0F766E]">GREEN20</code>
                  <button onClick={() => showToast('Coupon GREEN20 copied!')} className="text-[#0F766E] font-bold">Copy Code</button>
                </div>
              </div>
              <div className="p-4 bg-white dark:bg-[#141C1A] rounded-2xl border border-amber-200 dark:border-amber-800/40 bg-amber-50/30 shadow-2xs">
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[10px]">BUY 1 GET 1</span>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-2">Free Croissant with Artisan Coffee</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">Valid at The Daily Crust Bakery between 8 AM - 12 PM.</p>
                <div className="flex items-center justify-between mt-3 text-xs">
                  <code className="bg-white dark:bg-slate-800 px-2 py-1 rounded border font-mono font-bold text-amber-600">CRUSTBOGO</code>
                  <button onClick={() => showToast('Coupon CRUSTBOGO copied!')} className="text-amber-600 font-bold">Copy Code</button>
                </div>
              </div>
            </>
          )}

          {activeFeedView === 'following' && (
            <div className="space-y-3">
              {stores.filter(s => s.isFollowing).map(store => (
                <div key={store.id} onClick={() => setSelectedStore(store)} className="p-3 bg-white dark:bg-[#141C1A] rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer hover:border-[#0F766E]">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{store.emoji}</span>
                    <div>
                      <div className="text-xs font-bold">{store.name}</div>
                      <div className="text-[10px] text-slate-500">{store.category} · {store.distance}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // MAP SCREEN
  if (activeTab === 'map') {
    return (
      <div className="flex-1 flex flex-col pt-10 relative overflow-hidden pb-16">
        <div className="absolute inset-0 bg-[#E2E8F0] dark:bg-[#0F1715] flex items-center justify-center pointer-events-none opacity-40">
          <div className="w-64 h-64 rounded-full border-2 border-[#0F766E]/20 flex items-center justify-center">
            <div className="w-36 h-36 rounded-full border-2 border-[#0F766E]/40" />
          </div>
        </div>

        {/* User Location Marker */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg ring-4 ring-blue-500/30">
            <MapPin className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded shadow mt-1">You</span>
        </div>

        {/* Store Pins */}
        {stores.map((s, idx) => {
          const positions = [
            { top: '30%', left: '30%' },
            { top: '25%', left: '70%' },
            { top: '45%', left: '20%' },
            { top: '65%', left: '68%' },
            { top: '70%', left: '35%' },
          ];
          const pos = positions[idx % positions.length];
          return (
            <div
              key={s.id}
              style={{ top: pos.top, left: pos.left }}
              onClick={() => setSelectedStore(s)}
              className="absolute z-20 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
            >
              <div className="bg-white dark:bg-slate-900 px-2 py-1 rounded-xl shadow-md border border-[#0F766E] flex items-center gap-1 text-[11px] font-bold">
                <span>{s.emoji}</span>
                <span>{s.name.split(' ')[0]}</span>
                {s.selfCheckout && <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />}
              </div>
            </div>
          );
        })}

        <div className="relative z-30 p-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          <div className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#0F766E]" />
              <span>Nearby Stores ({filteredStores.length} Live)</span>
            </div>
            <span className="text-[10px] text-[#0F766E] font-semibold">2 km radius</span>
          </div>
        </div>
      </div>
    );
  }

  // SCAN SCREEN
  if (activeTab === 'scan') {
    return (
      <div className="flex-1 flex flex-col pt-10 bg-black text-white relative pb-16">
        <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <QrCode className="w-4 h-4 text-[#5EEAD4]" />
            <span>Self-Checkout Scanner</span>
          </div>
          <button onClick={() => showToast('Torch toggled')} className="p-1 rounded bg-white/10">
            <Flashlight className="w-4 h-4 text-amber-400" />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="relative w-64 h-64 rounded-3xl border-2 border-white/20 bg-white/5 flex items-center justify-center overflow-hidden">
            <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-amber-400 rounded-tl-lg" />
            <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-amber-400 rounded-tr-lg" />
            <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-amber-400 rounded-bl-lg" />
            <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-amber-400 rounded-br-lg" />
            <div className="absolute inset-x-4 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-pulse shadow-[0_0_12px_#F59E0B]" />
            <div className="text-center p-4">
              <QrCode className="w-12 h-12 mx-auto text-white/30 mb-2" />
              <p className="text-[11px] text-white/80 font-medium">Align Barcode Inside Frame</p>
            </div>
          </div>
        </div>

        <div className="bg-[#141C1A] p-4 rounded-t-3xl border-t border-white/10">
          <div className="text-[11px] font-bold text-white/70 uppercase tracking-wider mb-2">
            Tap Item to Simulate Barcode Scan
          </div>
          <div className="grid grid-cols-2 gap-2">
            {products.slice(0, 4).map(product => (
              <button
                key={product.id}
                onClick={() => handleAddToCart(product)}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-left hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{product.emoji}</span>
                  <div>
                    <div className="text-[11px] font-bold text-white truncate max-w-[80px]">{product.name}</div>
                    <div className="text-[10px] text-amber-400 font-bold">${product.price.toFixed(2)}</div>
                  </div>
                </div>
                <Plus className="w-4 h-4 text-[#5EEAD4]" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // SEARCH SCREEN
  if (activeTab === 'search') {
    return (
      <div className="flex-1 flex flex-col pt-10 overflow-y-auto pb-16">
        <div className="bg-white dark:bg-[#141C1A] p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search verified shops and aisle items..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#0F766E]"
            />
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Matching Stores ({filteredStores.length})</h3>
            <div className="space-y-2">
              {filteredStores.map(store => (
                <div
                  key={store.id}
                  onClick={() => setSelectedStore(store)}
                  className="p-3 bg-white dark:bg-[#141C1A] rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer hover:border-[#0F766E]"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{store.emoji}</span>
                    <div>
                      <div className="text-xs font-bold">{store.name}</div>
                      <div className="text-[10px] text-slate-500">{store.category} · {store.distance}</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-600">{store.rating}</span>
                </div>
              ))}
            </div>
          </div>

          {searchQuery && (
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Matching Products</h3>
              <div className="space-y-2">
                {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map(p => (
                  <div key={p.id} className="p-2.5 bg-white dark:bg-[#141C1A] rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{p.emoji}</span>
                      <div>
                        <div className="text-xs font-bold">{p.name}</div>
                        <div className="text-[10px] text-[#0F766E] font-bold">${p.price.toFixed(2)}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddToCart(p)}
                      className="px-2.5 py-1 bg-[#0F766E] text-white rounded-lg text-xs font-bold"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // CART SCREEN
  if (activeTab === 'cart') {
    return (
      <div className="flex-1 flex flex-col pt-10 overflow-y-auto pb-16">
        <div className="bg-white dark:bg-[#141C1A] px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Your Shopping Bag ({totalCartCount})</h2>
          {cart.length > 0 && (
            <button
              onClick={() => setCart([])}
              className="text-xs text-red-500 font-bold hover:underline"
            >
              Clear
            </button>
          )}
        </div>

        {showExitPass ? (
          <div className="p-4 flex flex-col items-center text-center">
            <div className="bg-white dark:bg-[#141C1A] p-6 rounded-3xl border-2 border-emerald-500/40 shadow-xl max-w-xs w-full">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-100">Payment Confirmed</div>
              <div className="text-xs text-slate-500 mb-4">Scan at Store Exit Gate</div>
              <div className="w-40 h-40 mx-auto p-2 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center">
                <QrCode className="w-28 h-28 text-slate-800 dark:text-white" />
                <span className="text-[10px] font-mono font-bold text-slate-500 mt-1">{latestPassCode}</span>
              </div>
              <div className="mt-4 text-xs font-bold text-[#0F766E]">${totalPayable.toFixed(2)} Paid · Valid 15 mins</div>
            </div>
            <button
              onClick={() => {
                setShowExitPass(false);
                setCart([]);
                setActiveTab('home');
              }}
              className="mt-4 px-4 py-2 bg-[#0F766E] text-white rounded-xl text-xs font-bold"
            >
              Done & Return Home
            </button>
          </div>
        ) : cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-100">Your bag is empty</div>
            <p className="text-xs text-slate-500 mt-1">Scan aisle barcodes or add items from verified shops</p>
            <button
              onClick={() => setActiveTab('scan')}
              className="mt-4 px-4 py-2 bg-[#0F766E] text-white rounded-xl text-xs font-bold"
            >
              Start Scanning
            </button>
          </div>
        ) : (
          <div className="p-4 flex-1 flex flex-col justify-between">
            <div className="space-y-2 mb-4">
              {cart.map(item => (
                <div key={item.id} className="p-3 bg-white dark:bg-[#141C1A] rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{item.emoji}</span>
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate max-w-[140px]">{item.name}</div>
                      <div className="text-[11px] text-slate-500">${item.price.toFixed(2)} each</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
                    <button onClick={() => handleDecrement(item.id)} className="w-6 h-6 flex items-center justify-center font-bold text-xs">-</button>
                    <span className="text-xs font-bold">{item.quantity}</span>
                    <button onClick={() => handleIncrement(item.id)} className="w-6 h-6 flex items-center justify-center font-bold text-xs">+</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-[#141C1A] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-bold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Estimated Tax (5%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Genie Discount</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-100 dark:border-slate-800 pt-2 flex justify-between font-bold text-sm">
                <span>Total Payable</span>
                <span className="text-[#0F766E]">${totalPayable.toFixed(2)}</span>
              </div>
              <button
                onClick={handleExpressPay}
                className="w-full mt-3 py-3 bg-[#0F766E] text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-md hover:bg-[#115E59]"
              >
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>1-Tap Express Pay</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // DEFAULT HOME SCREEN
  return (
    <div className="flex-1 flex flex-col pt-10 overflow-y-auto pb-16">
      {/* 1. Location Selector Bar */}
      <div className="bg-white dark:bg-[#141C1A] px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <button
          onClick={() => setIsLocationModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 max-w-[200px]"
        >
          <MapPin className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
          <span className="truncate">{currentLocation.split(',')[0]}</span>
          <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
        </button>
        <button
          onClick={() => setIsProfileModalOpen(true)}
          className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300"
        >
          <User className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* 2. Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Find shops near you"
            className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-white dark:bg-[#141C1A] border border-slate-200 dark:border-slate-800 text-xs shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-[#0F766E]"
          />
          <button
            onClick={() => setActiveTab('map')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0F766E]"
            title="View on Map"
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>

        {/* 3. The 4 Multi-Role Deck Quick Action Cards */}
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => setActiveFeedView('feed')}
            className="flex flex-col items-center p-2.5 rounded-2xl bg-white dark:bg-[#141C1A] border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-blue-400 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center mb-1">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">Feed</span>
          </button>

          <button
            onClick={() => setActiveFeedView('offers')}
            className="flex flex-col items-center p-2.5 rounded-2xl bg-white dark:bg-[#141C1A] border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-emerald-400 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center mb-1">
              <Tag className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">Offers</span>
          </button>

          <button
            onClick={() => setActiveFeedView('following')}
            className="flex flex-col items-center p-2.5 rounded-2xl bg-white dark:bg-[#141C1A] border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-rose-400 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-900/30 text-rose-500 flex items-center justify-center mb-1">
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">Following</span>
          </button>

          <button
            onClick={() => setActiveTab('scan')}
            className="flex flex-col items-center p-2.5 rounded-2xl bg-white dark:bg-[#141C1A] border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-indigo-400 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center mb-1">
              <QrCode className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">Scan</span>
          </button>
        </div>

        {/* 4. Hero Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-[#DBEAFE] via-[#EFF6FF] to-[#E0F2FE] dark:from-slate-900 dark:to-slate-800 p-4 border border-blue-200 dark:border-slate-700 shadow-xs">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-600/10 text-blue-700 dark:text-blue-400 font-bold text-[10px] mb-1.5">
            <Sparkles className="w-3 h-3 text-blue-600" />
            <span>Hyperlocal Partner</span>
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">ShopGenie is growing!</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">50+ neighbourhood shops live. Experience lightning-fast self checkout.</p>
        </div>

        {/* 5. Category Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#0F766E] text-white shadow-2xs font-bold'
                  : 'bg-white dark:bg-[#141C1A] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 6. Verified Stores List */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Verified Local Shops ({filteredStores.length})
            </h3>
            <button
              onClick={() => setActiveTab('map')}
              className="text-xs font-bold text-[#0F766E] hover:underline"
            >
              View Map →
            </button>
          </div>

          <div className="space-y-3">
            {filteredStores.map(store => (
              <div
                key={store.id}
                onClick={() => setSelectedStore(store)}
                className="p-3 bg-white dark:bg-[#141C1A] rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-[#0F766E] transition-all cursor-pointer shadow-2xs"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#0F766E]/10 flex items-center justify-center text-2xl shrink-0">
                    {store.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{store.name}</h4>
                      <span className="text-xs font-bold text-amber-600">{store.rating}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{store.category} · {store.distance}</div>
                    {store.offer && (
                      <div className="inline-block mt-1.5 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[10px] font-bold">
                        🏷️ {store.offer}
                      </div>
                    )}
                    {store.selfCheckout && (
                      <div className="flex items-center gap-1 text-[10px] font-bold text-[#0F766E] mt-1">
                        <Zap className="w-3 h-3 fill-current" />
                        <span>Self Scan & Go Enabled</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
