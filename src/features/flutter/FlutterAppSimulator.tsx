import React, { useState, useEffect } from 'react';
import { 
  Home, 
  MapPin, 
  Search, 
  QrCode, 
  ShoppingBag, 
  FileText, 
  Tag, 
  Heart, 
  Sparkles, 
  ChevronRight, 
  RotateCcw, 
  Check, 
  Plus, 
  Minus, 
  Trash2, 
  ChevronDown, 
  Star, 
  Clock, 
  Phone, 
  Verified, 
  ArrowLeft, 
  Store, 
  Compass, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Layers, 
  Printer, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Copy,
  User,
  Flashlight,
  Camera,
  Bell,
  Map as MapIcon,
  ArrowRight,
  AlertCircle,
  X
} from 'lucide-react';
import { DeckRole, DeckOrder, AuditLogEntry } from './flutterDeckTypes';
import { GateVerifierDeckView } from './roles/GateVerifierDeckView';
import { INITIAL_DECK_ORDERS, INITIAL_AUDIT_LOGS } from './flutterDeckData';
import { useShopGenie } from '../../context/ShopGenieContext';
import { CustomerProfileView } from '../customer/CustomerProfileView';

interface FlutterAppSimulatorProps {
  onOpenCodeExplorer?: () => void;
  activeRole?: DeckRole;
  onRoleChange?: (role: DeckRole) => void;
}

interface StoreItem {
  id: string;
  name: string;
  category: string;
  distance: string;
  rating: string;
  address: string;
  emoji: string;
  selfCheckout: boolean;
  offer?: string;
  description?: string;
  followers: number;
  isFollowing: boolean;
  hours: string;
  phone: string;
}

interface ProductItem {
  id: string;
  storeId: string;
  storeName: string;
  name: string;
  brand?: string;
  category: string;
  size?: string;
  price: number;
  mrp: number;
  emoji: string;
  barcode?: string;
  stock: number;
  inStock: boolean;
  confidence?: number;
}

interface CartItem {
  id: string;
  storeId: string;
  name: string;
  brand?: string;
  category?: string;
  size?: string;
  price: number;
  emoji: string;
  barcode?: string;
  confidence?: number;
  quantity: number;
}

const SAMPLE_STORES: StoreItem[] = [
  {
    id: '1',
    name: 'GreenLeaf Organic Grocers',
    category: 'Supermarket',
    distance: '350 m away',
    rating: '4.8 ★',
    address: '14th Main Rd, 4th Block',
    emoji: '🥦',
    selfCheckout: true,
    offer: '20% off fresh greens',
    description: 'Handpicked organic produce, farm fresh milk, pantry staples and cold-pressed oils.',
    followers: 840,
    isFollowing: true,
    hours: '7:00 AM - 10:00 PM',
    phone: '+91 98450 12091'
  },
  {
    id: '2',
    name: 'The Daily Crust Bakery',
    category: 'Bakery & Cafe',
    distance: '500 m away',
    rating: '4.9 ★',
    address: '7th Cross, Koramangala',
    emoji: '🥐',
    selfCheckout: true,
    offer: 'Buy 1 Get 1 on Croissants',
    description: 'Artisan sourdough loaves, hand-laminated butter croissants, and specialty espresso.',
    followers: 460,
    isFollowing: true,
    hours: '8:00 AM - 10:30 PM',
    phone: '+91 80 2860 1199'
  },
  {
    id: '3',
    name: 'CarePlus 24/7 Chemist',
    category: 'Pharmacy',
    distance: '220 m away',
    rating: '4.7 ★',
    address: '80ft Road, Near Park',
    emoji: '💊',
    selfCheckout: false,
    offer: 'Flat 15% on wellness',
    description: 'Essential prescription medicines, baby care, personal hygiene and 24/7 emergency supplies.',
    followers: 290,
    isFollowing: false,
    hours: '24 Hours Open',
    phone: '+91 80 4120 7700'
  },
  {
    id: '4',
    name: 'Apex Digital Hub',
    category: 'Electronics',
    distance: '850 m away',
    rating: '4.6 ★',
    address: 'Sony World Signal',
    emoji: '🎧',
    selfCheckout: true,
    offer: 'Instant exchange bonus',
    description: 'Certified audio gear, smartphones, charging cables and high-performance computing accessories.',
    followers: 512,
    isFollowing: false,
    hours: '10:00 AM - 9:30 PM',
    phone: '+91 98800 54321'
  },
  {
    id: '5',
    name: 'Urban Threads Boutique',
    category: 'Fashion',
    distance: '1.1 km away',
    rating: '4.5 ★',
    address: '5th Block Commercial St',
    emoji: '👗',
    selfCheckout: false,
    offer: 'Weekend Flash Sale',
    description: 'Contemporary casualwear, handcrafted ethnic fashion, curated linen fabrics and accessories.',
    followers: 320,
    isFollowing: false,
    hours: '10:30 AM - 9:00 PM',
    phone: '+91 99000 88776'
  }
];

const SAMPLE_PRODUCTS: ProductItem[] = [
  {
    id: '101',
    storeId: '1',
    storeName: 'GreenLeaf Organic Grocers',
    name: 'Coca-Cola 500ml',
    brand: 'Coca-Cola',
    category: 'Beverages',
    size: '500 ml',
    price: 40,
    mrp: 45,
    emoji: '🥤',
    stock: 45,
    inStock: true,
    confidence: 0.96
  },
  {
    id: '102',
    storeId: '1',
    storeName: 'GreenLeaf Organic Grocers',
    name: "Lay's Classic",
    brand: "Lay's",
    category: 'Snacks',
    size: '50 g',
    price: 20,
    mrp: 20,
    emoji: '🥔',
    stock: 50,
    inStock: true,
    confidence: 0.98
  },
  {
    id: '103',
    storeId: '1',
    storeName: 'GreenLeaf Organic Grocers',
    name: 'Amul Milk 1L',
    brand: 'Amul',
    category: 'Dairy',
    size: '1 L',
    price: 65,
    mrp: 66,
    emoji: '🥛',
    stock: 30,
    inStock: true,
    confidence: 0.94
  },
  {
    id: '104',
    storeId: '1',
    storeName: 'GreenLeaf Organic Grocers',
    name: 'Nescafe Classic 50g',
    brand: 'Nescafe',
    category: 'Beverages',
    size: '50 g',
    price: 180,
    mrp: 195,
    emoji: '☕',
    stock: 25,
    inStock: true,
    confidence: 0.95
  },
  {
    id: '105',
    storeId: '2',
    storeName: 'The Daily Crust Bakery',
    name: 'Artisan Sourdough Boule',
    brand: 'The Daily Crust',
    category: 'Bakery',
    size: '400 g',
    price: 120,
    mrp: 140,
    emoji: '🍞',
    stock: 12,
    inStock: true,
    confidence: 0.93
  },
  {
    id: '106',
    storeId: '2',
    storeName: 'The Daily Crust Bakery',
    name: 'French Butter Croissant',
    brand: 'The Daily Crust',
    category: 'Pastry',
    size: '80 g',
    price: 85,
    mrp: 95,
    emoji: '🥐',
    stock: 35,
    inStock: true,
    confidence: 0.92
  }
];

const CATEGORIES = ['All', 'Supermarket', 'Bakery & Cafe', 'Pharmacy', 'Electronics', 'Fashion'];

const AVAILABLE_LOCATIONS = [
  'Indiranagar 100ft Rd, Bengaluru',
  'Koramangala 4th Block, Bengaluru',
  'HSR Layout Sector 1, Bengaluru',
  'MG Road Central, Bengaluru',
  'Rajarajeshwari Nagar, Bengaluru'
];

export const FlutterAppSimulator: React.FC<FlutterAppSimulatorProps> = ({ 
  onOpenCodeExplorer,
  activeRole = 'shopper',
  onRoleChange
}) => {
  const { setIsProfileOpen, currentUser, setRole } = useShopGenie();
  const [verifierOrders, setVerifierOrders] = useState<DeckOrder[]>(INITIAL_DECK_ORDERS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  const [activeTab, setActiveTab] = useState<'home' | 'map' | 'scan' | 'search' | 'cart' | 'profile'>('home');
  const [currentLocation, setCurrentLocation] = useState('Rajarajeshwari Nagar, Bengaluru');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState<StoreItem | null>(null);
  const [activeFeedView, setActiveFeedView] = useState<'feed' | 'offers' | 'following' | null>(null);
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: '101',
      storeId: '1',
      name: 'Coca-Cola 500ml',
      brand: 'Coca-Cola',
      category: 'Beverages',
      size: '500 ml',
      price: 40,
      emoji: '🥤',
      confidence: 0.96,
      quantity: 1
    },
    {
      id: '102',
      storeId: '1',
      name: "Lay's Classic",
      brand: "Lay's",
      category: 'Snacks',
      size: '50 g',
      price: 20,
      emoji: '🥔',
      confidence: 0.98,
      quantity: 1
    },
    {
      id: '103',
      storeId: '1',
      name: 'Amul Milk 1L',
      brand: 'Amul',
      category: 'Dairy',
      size: '1 L',
      price: 65,
      emoji: '🥛',
      confidence: 0.94,
      quantity: 1
    }
  ]);
  const [aiScanStatus, setAiScanStatus] = useState<'idle' | 'analyzing' | 'detected' | 'lowConfidence' | 'multiple' | 'unrecognized' | 'networkError' | 'permissionDenied'>('idle');
  const [aiDetectedProduct, setAiDetectedProduct] = useState<ProductItem | null>(null);
  const [isManualSearchOpen, setIsManualSearchOpen] = useState(false);
  const [manualSearchQuery, setManualSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  const runAiScan = (productId?: string, scenario?: string) => {
    setAiScanStatus('analyzing');
    setAiDetectedProduct(null);
    setTimeout(() => {
      if (scenario === 'low') {
        setAiScanStatus('lowConfidence');
        return;
      }
      if (scenario === 'multiple') {
        setAiScanStatus('multiple');
        return;
      }
      if (scenario === 'unrecognized') {
        setAiScanStatus('unrecognized');
        return;
      }
      if (scenario === 'network') {
        setAiScanStatus('networkError');
        return;
      }
      if (scenario === 'permission') {
        setAiScanStatus('permissionDenied');
        return;
      }
      const match = SAMPLE_PRODUCTS.find(p => p.id === productId) || SAMPLE_PRODUCTS[0];
      setAiDetectedProduct(match);
      setAiScanStatus('detected');
    }, 450);
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const estimatedTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const filteredStores = SAMPLE_STORES.filter(s => {
    const matchesCat = selectedCategory === 'All' || s.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesQuery = !searchQuery.trim() ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleAddToCart = (product: ProductItem | CartItem) => {
    setCart(prev => {
      const idx = prev.findIndex(item => item.id === product.id);
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
          brand: (product as any).brand || '',
          category: (product as any).category || '',
          size: (product as any).size || '',
          price: product.price,
          emoji: product.emoji,
          confidence: (product as any).confidence || 0.96,
          quantity: 1
        }
      ];
    });
    showToast(`Added ${product.name} to Smart Bag!`);
  };

  const handleIncrement = (id: string) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
  };

  const handleDecrement = (id: string) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: item.quantity - 1 } : item).filter(item => item.quantity > 0));
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#F8FAFC] dark:bg-[#0B100F] text-[#0F172A] dark:text-[#F1F5F9] select-none relative overflow-hidden font-sans">
      {/* Flutter App Engine Watermark Tag */}
      <div className="absolute top-2 left-3 z-50 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#0F766E]/10 dark:bg-[#5EEAD4]/10 text-[#0F766E] dark:text-[#5EEAD4] text-[10px] font-bold tracking-wide backdrop-blur-xs pointer-events-none">
        <span>Flutter 3.24 · Material 3 Engine</span>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-12 left-4 right-4 z-50 bg-[#0F766E] text-white px-3 py-2 rounded-xl text-xs font-semibold shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <Check className="w-4 h-4 text-[#5EEAD4]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Screen Content */}
      {activeRole === 'verifier' ? (
        /* ========================================================= */
        /* SECURITY GATE VERIFIER TERMINAL                          */
        /* ========================================================= */
        <div className="flex-1 flex flex-col pt-7 overflow-y-auto pb-4 relative">
          <GateVerifierDeckView
            orders={verifierOrders}
            setOrders={setVerifierOrders}
            auditLogs={auditLogs}
            setAuditLogs={setAuditLogs}
            showToast={showToast}
          />
        </div>
      ) : selectedStore ? (
        /* ========================================================= */
        /* STORE DETAIL SCREEN                                        */
        /* ========================================================= */
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
              {SAMPLE_PRODUCTS.filter(p => p.storeId === selectedStore.id || selectedStore.id === '1').map(product => (
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
      ) : activeFeedView ? (
        /* ========================================================= */
        /* FEED / OFFERS / FOLLOWING SCREEN                          */
        /* ========================================================= */
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
                {SAMPLE_STORES.filter(s => s.isFollowing).map(store => (
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
      ) : activeTab === 'map' ? (
        /* ========================================================= */
        /* MAP SCREEN                                                */
        /* ========================================================= */
        <div className="flex-1 flex flex-col pt-10 relative overflow-hidden pb-16">
          {/* Radar background grid */}
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
          {SAMPLE_STORES.map((s, idx) => {
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

          {/* Map Top Bar */}
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
      ) : activeTab === 'scan' ? (
        /* ========================================================= */
        /* AI PRODUCT SCAN SCREEN                                    */
        /* ========================================================= */
        <div className="flex-1 flex flex-col pt-10 bg-black text-white relative pb-16">
          <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <Sparkles className="w-4 h-4 text-[#5EEAD4]" />
              <span>AI Product Scan</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => showToast('Torch toggled')} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/15" title="Toggle Flashlight">
                <Flashlight className="w-4 h-4 text-amber-400" />
              </button>
              <button onClick={() => setIsManualSearchOpen(true)} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/15" title="Search product manually">
                <Search className="w-4 h-4 text-white" />
              </button>
              {/* Test scenario picker */}
              <div className="relative">
                <button 
                  onClick={() => {
                    const scenarios = ['low', 'multiple', 'unrecognized', 'network', 'permission'];
                    const currentIdx = Math.floor(Math.random() * scenarios.length);
                    runAiScan(undefined, scenarios[currentIdx]);
                  }}
                  className="px-2 py-1 rounded-lg bg-[#7C3AED]/30 border border-[#7C3AED]/50 text-[#A78BFA] text-[10px] font-bold hover:bg-[#7C3AED]/40"
                  title="Simulate edge scenario"
                >
                  Test AI Edge
                </button>
              </div>
            </div>
          </div>

          {/* Subtitle Instruction */}
          <div className="px-6 py-2 text-center">
            <p className="text-[11px] text-white/70 font-medium">
              Point your camera at a product and let AI identify it instantly.
            </p>
          </div>

          {/* Camera Viewfinder with AI Detection Overlay */}
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <div className="relative w-64 h-64 rounded-3xl border-2 border-white/20 bg-white/5 flex items-center justify-center overflow-hidden shadow-2xl">
              {/* AI Corner marks */}
              <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-[#7C3AED] rounded-tl-xl" />
              <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-[#7C3AED] rounded-tr-xl" />
              <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-[#7C3AED] rounded-bl-xl" />
              <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-[#7C3AED] rounded-br-xl" />

              {/* Animated AI Neural Laser Pulse */}
              {(aiScanStatus === 'idle' || aiScanStatus === 'analyzing') && (
                <div className="absolute inset-x-4 h-0.5 bg-gradient-to-r from-transparent via-[#7C3AED] via-[#5EEAD4] to-transparent animate-pulse shadow-[0_0_12px_#7C3AED]" />
              )}

              {/* Status messaging inside viewfinder */}
              <div className="text-center p-4 z-10">
                {aiScanStatus === 'analyzing' ? (
                  <div className="flex flex-col items-center animate-in fade-in">
                    <div className="w-8 h-8 border-2 border-[#5EEAD4] border-t-transparent rounded-full animate-spin mb-3" />
                    <span className="px-3 py-1 rounded-full bg-black/70 border border-[#7C3AED]/40 text-xs font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Analyzing product...
                    </span>
                  </div>
                ) : aiScanStatus === 'detected' && aiDetectedProduct ? (
                  <div className="flex flex-col items-center animate-in zoom-in-95">
                    <div className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-[10px] font-bold mb-2 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Product detected · {Math.round((aiDetectedProduct.confidence || 0.96) * 100)}% confidence
                    </div>
                    <span className="text-4xl mb-1">{aiDetectedProduct.emoji}</span>
                    <span className="text-sm font-bold text-white leading-tight">{aiDetectedProduct.name}</span>
                    <span className="text-xs text-amber-400 font-bold mt-0.5">₹{aiDetectedProduct.price}</span>
                  </div>
                ) : aiScanStatus === 'lowConfidence' ? (
                  <div className="flex flex-col items-center animate-in fade-in max-w-[200px]">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <p className="text-[11px] font-bold text-white">Product recognition confidence is low.</p>
                    <p className="text-[10px] text-white/70 mt-0.5">Move closer or improve lighting.</p>
                    <button
                      onClick={() => runAiScan('101')}
                      className="mt-2.5 px-3 py-1 bg-amber-500 text-black font-bold text-[10px] rounded-lg"
                    >
                      Try Again
                    </button>
                  </div>
                ) : aiScanStatus === 'multiple' ? (
                  <div className="flex flex-col items-center animate-in fade-in max-w-[200px]">
                    <div className="w-8 h-8 rounded-full bg-[#7C3AED]/20 text-[#A78BFA] flex items-center justify-center mb-2">
                      <Layers className="w-5 h-5" />
                    </div>
                    <p className="text-[11px] font-bold text-white">Multiple products detected</p>
                    <p className="text-[10px] text-white/70 mt-0.5">Please focus on one product.</p>
                    <button
                      onClick={() => runAiScan('101')}
                      className="mt-2.5 px-3 py-1 bg-[#0F766E] text-white font-bold text-[10px] rounded-lg"
                    >
                      Re-focus
                    </button>
                  </div>
                ) : aiScanStatus === 'unrecognized' ? (
                  <div className="flex flex-col items-center animate-in fade-in max-w-[200px]">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mb-2">
                      <X className="w-5 h-5" />
                    </div>
                    <p className="text-[11px] font-bold text-white">Product not clearly recognized</p>
                    <div className="mt-2.5 flex items-center gap-1.5">
                      <button
                        onClick={() => runAiScan('101')}
                        className="px-2.5 py-1 bg-[#0F766E] text-white font-bold text-[10px] rounded-lg"
                      >
                        Try Again
                      </button>
                      <button
                        onClick={() => setIsManualSearchOpen(true)}
                        className="px-2.5 py-1 bg-white/10 text-white font-bold text-[10px] rounded-lg border border-white/20"
                      >
                        Search Manually
                      </button>
                    </div>
                  </div>
                ) : aiScanStatus === 'networkError' ? (
                  <div className="flex flex-col items-center animate-in fade-in max-w-[200px]">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center mb-2">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <p className="text-[11px] font-bold text-white">Unable to connect to ShopGenie AI.</p>
                    <button
                      onClick={() => runAiScan('101')}
                      className="mt-2.5 px-3 py-1 bg-[#0F766E] text-white font-bold text-[10px] rounded-lg"
                    >
                      Try Again
                    </button>
                  </div>
                ) : aiScanStatus === 'permissionDenied' ? (
                  <div className="flex flex-col items-center animate-in fade-in max-w-[200px]">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mb-2">
                      <Camera className="w-5 h-5" />
                    </div>
                    <p className="text-[11px] font-bold text-white">Camera permission denied</p>
                    <p className="text-[10px] text-white/70 mt-0.5">Please grant camera access in settings.</p>
                  </div>
                ) : (
                  <div>
                    <Sparkles className="w-8 h-8 mx-auto text-white/30 mb-2" />
                    <p className="text-[11px] text-white/80 font-medium">Hold steady to identify product</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tap-to-Scan Simulated Target Items */}
          <div className="bg-[#141C1A] p-4 rounded-t-3xl border-t border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-white/70 uppercase tracking-wider">
                Tap Item to Simulate AI Product Scan
              </span>
              <button
                onClick={() => setIsManualSearchOpen(true)}
                className="text-[11px] text-[#5EEAD4] font-semibold hover:underline flex items-center gap-1"
              >
                <Search className="w-3 h-3" />
                <span>Manual Search</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {SAMPLE_PRODUCTS.slice(0, 4).map(product => (
                <button
                  key={product.id}
                  onClick={() => runAiScan(product.id)}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-left hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{product.emoji}</span>
                    <div>
                      <div className="text-[11px] font-bold text-white truncate max-w-[80px]">{product.name}</div>
                      <div className="text-[10px] text-amber-400 font-bold">₹{product.price} · {Math.round((product.confidence || 0.96) * 100)}%</div>
                    </div>
                  </div>
                  <Sparkles className="w-3.5 h-3.5 text-[#5EEAD4]" />
                </button>
              ))}
            </div>
          </div>

          {/* AI Result Bottom Sheet Modal */}
          {aiDetectedProduct && aiScanStatus === 'detected' && (
            <div className="absolute inset-x-0 bottom-0 bg-[#141C1A] rounded-t-3xl p-5 border-t border-white/15 shadow-2xl z-30 animate-in slide-in-from-bottom duration-200">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/40 text-[#A78BFA] text-[10px] font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  AI Confidence: {Math.round((aiDetectedProduct.confidence || 0.96) * 100)}%
                </span>
                <button onClick={() => setAiDetectedProduct(null)} className="text-slate-400 hover:text-white p-1">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-start gap-3 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-[#0F766E]/20 border border-[#0F766E]/40 flex items-center justify-center text-3xl">
                  {aiDetectedProduct.emoji}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-white">{aiDetectedProduct.name}</div>
                  <div className="text-xs text-slate-300 mt-0.5">Brand: {aiDetectedProduct.brand || 'Verified Brand'}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Category: {aiDetectedProduct.category} · Size: {aiDetectedProduct.size || 'Standard'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-extrabold text-amber-400">₹{aiDetectedProduct.price}</div>
                  <div className="text-[10px] text-slate-400">Estimated Price</div>
                </div>
              </div>

              <button
                onClick={() => {
                  handleAddToCart(aiDetectedProduct);
                  setAiDetectedProduct(null);
                  setAiScanStatus('idle');
                }}
                className="w-full py-3 rounded-2xl bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Smart Bag</span>
              </button>
            </div>
          )}

          {/* Manual Search Modal */}
          {isManualSearchOpen && (
            <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-xs flex flex-col justify-end">
              <div className="bg-[#141C1A] rounded-t-3xl p-5 border-t border-white/20 space-y-3 animate-in slide-in-from-bottom duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-[#5EEAD4]" />
                    <span className="text-xs font-bold text-white">Search Product Manually</span>
                  </div>
                  <button onClick={() => setIsManualSearchOpen(false)} className="text-xs text-slate-400 hover:text-white">Cancel</button>
                </div>
                <input
                  type="text"
                  value={manualSearchQuery}
                  onChange={e => setManualSearchQuery(e.target.value)}
                  placeholder="e.g. Coca-Cola, Lay's, Amul Milk..."
                  className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/15 text-xs text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#0F766E]"
                  autoFocus
                />
                <div className="max-h-48 overflow-y-auto space-y-1.5">
                  {SAMPLE_PRODUCTS.filter(p => !manualSearchQuery || p.name.toLowerCase().includes(manualSearchQuery.toLowerCase())).map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setIsManualSearchOpen(false);
                        runAiScan(p.id);
                      }}
                      className="w-full p-2 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{p.emoji}</span>
                        <div>
                          <div className="text-xs font-bold text-white">{p.name}</div>
                          <div className="text-[10px] text-slate-400">{p.brand} · ₹{p.price}</div>
                        </div>
                      </div>
                      <span className="text-[10px] text-[#5EEAD4] font-bold">Select</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : activeTab === 'search' ? (
        /* ========================================================= */
        /* SEARCH SCREEN                                             */
        /* ========================================================= */
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
                  {SAMPLE_PRODUCTS.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map(p => (
                    <div key={p.id} className="p-2.5 bg-white dark:bg-[#141C1A] rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{p.emoji}</span>
                        <div>
                          <div className="text-xs font-bold">{p.name}</div>
                          <div className="text-[10px] text-[#0F766E] font-bold">₹{p.price}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddToCart(p)}
                        className="px-2.5 py-1 bg-[#0F766E] text-white rounded-lg text-xs font-bold"
                      >
                        Add to Bag
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : activeTab === 'cart' ? (
        /* ========================================================= */
        /* SMART BAG SCREEN (Zero Checkout / Zero Payment)            */
        /* ========================================================= */
        <div className="flex-1 flex flex-col pt-10 overflow-y-auto pb-16">
          <div className="bg-white dark:bg-[#141C1A] px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#0F766E]" />
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Smart Bag ({totalCartCount})</h2>
            </div>
            {cart.length > 0 && (
              <button
                onClick={() => setCart([])}
                className="text-xs text-red-500 font-bold hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear Bag</span>
              </button>
            )}
          </div>

          {/* Smart Bag Purpose Description Ribbon */}
          <div className="bg-[#7C3AED]/10 dark:bg-[#7C3AED]/15 px-4 py-2.5 border-b border-[#7C3AED]/20 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#7C3AED] shrink-0" />
            <p className="text-[11px] text-[#6D28D9] dark:text-[#C4B5FD] font-medium leading-snug">
              A temporary shopping list that helps customers keep track of products they have discovered while shopping.
            </p>
          </div>

          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-100">Your Smart Bag is empty</div>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                A temporary shopping list that helps customers keep track of products they have discovered while shopping.
              </p>
              <button
                onClick={() => setActiveTab('scan')}
                className="mt-4 px-4 py-2 bg-[#0F766E] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Scan Products with AI</span>
              </button>
            </div>
          ) : (
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2 mb-4">
                {cart.map(item => (
                  <div key={item.id} className="p-3 bg-white dark:bg-[#141C1A] rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{item.emoji}</span>
                      <div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate max-w-[140px]">{item.name}</div>
                        <div className="text-[11px] text-slate-500">₹{item.price} each {item.brand ? `· ${item.brand}` : ''}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-[#0F766E]">₹{item.price * item.quantity}</span>
                      <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
                        <button onClick={() => handleDecrement(item.id)} className="w-6 h-6 flex items-center justify-center font-bold text-xs">-</button>
                        <span className="text-xs font-bold">{item.quantity}</span>
                        <button onClick={() => handleIncrement(item.id)} className="w-6 h-6 flex items-center justify-center font-bold text-xs">+</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bill Summary - Pure Selection & Estimated Total */}
              <div className="bg-white dark:bg-[#141C1A] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 text-xs shadow-xs">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-sm text-slate-800 dark:text-slate-100">Estimated Total</div>
                    <div className="text-[10px] text-slate-400">{totalCartCount} products selected</div>
                  </div>
                  <span className="text-xl font-extrabold text-[#0F766E]">₹{estimatedTotal}</span>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('scan')}
                    className="flex-1 py-3 bg-[#0F766E] text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-xs hover:bg-[#115E59] active:scale-95 transition-all text-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Continue Scanning</span>
                  </button>
                  <button
                    onClick={() => setCart([])}
                    className="px-4 py-3 border border-red-200 dark:border-red-900/50 text-red-500 rounded-xl font-bold hover:bg-red-50 dark:hover:bg-red-950/20 active:scale-95 transition-all text-xs"
                  >
                    Clear Bag
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : activeTab === 'profile' ? (
        /* ========================================================= */
        /* CUSTOMER ACCOUNT & PROFILE SCREEN                        */
        /* ========================================================= */
        <div className="flex-1 flex flex-col relative pb-16">
          <CustomerProfileView
            isInsideSimulator={true}
            onClose={() => setActiveTab('home')}
          />
        </div>
      ) : (
        /* ========================================================= */
        /* HOME SCREEN (Multi-Role Deck Primary Screen)              */
        /* ========================================================= */
        <div className="flex-1 flex flex-col pt-10 overflow-y-auto pb-16 bg-[#F8FAFC]">
          {/* 1. Sticky Multi-Role Deck Top Bar: Location Selector + Map Icon + Notifications + Profile */}
          <div className="bg-white/95 backdrop-blur-md px-4 py-2.5 border-b border-slate-200/70 flex items-center justify-between sticky top-0 z-30">
            {/* Location Pill Selector with Blue MapPin matching Multi-Role Deck */}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 text-left transition-all max-w-[200px] shadow-2xs group"
              aria-label="Change neighbourhood"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-slate-800 truncate">
                {currentLocation.split(',')[0]}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-500 shrink-0" />
            </button>

            {/* Right Action Icons: Map shortcut, Notifications & Profile */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('map')}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs flex items-center justify-center transition-all"
                title="Toggle Nearest Shops Map"
              >
                <MapIcon className="w-4 h-4 text-slate-700" />
              </button>

              <button
                onClick={() => showToast('Welcome to Rajarajeshwari Nagar! 12 neighbourhood shops enabled.')}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs flex items-center justify-center transition-all relative"
                title="Notifications"
              >
                <Bell className="w-4 h-4 text-slate-700" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
              </button>

              <button
                onClick={() => {
                  setSelectedStore(null);
                  setActiveFeedView(null);
                  setActiveTab('profile');
                }}
                className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-100 shadow-2xs flex items-center justify-center transition-all font-heading font-bold text-xs"
                title="Account & Role Controls"
              >
                {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'VK'}
              </button>
            </div>
          </div>

          {/* 2. Sky-Themed Header Area with Search Bar & Quick Action Cards */}
          <div className="bg-gradient-to-b from-[#BAE6FD]/40 via-[#E0F2FE]/25 to-[#F8FAFC] px-4 pt-3 pb-2">
            {/* Search Bar matching Multi-Role Deck */}
            <div className="relative mb-4">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Find shops near you"
                className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-white border border-slate-200/80 text-xs text-slate-800 placeholder-slate-400 shadow-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              ) : (
                <button
                  onClick={() => setActiveTab('map')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-700 p-0.5"
                  title="Search on Google Maps"
                >
                  <Compass className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* 3. The 4 Multi-Role Deck Quick Action Cards (Feed, Offers, Following, Scan) */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              <button
                onClick={() => setActiveFeedView('feed')}
                className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white border border-slate-200/70 shadow-2xs hover:border-blue-300 hover:shadow-xs transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5 stroke-[2]" />
                </div>
                <span className="text-[11px] font-semibold text-slate-700">Feed</span>
              </button>

              <button
                onClick={() => setActiveFeedView('offers')}
                className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white border border-slate-200/70 shadow-2xs hover:border-emerald-300 hover:shadow-xs transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                  <Tag className="w-5 h-5 stroke-[2]" />
                </div>
                <span className="text-[11px] font-semibold text-slate-700">Offers</span>
              </button>

              <button
                onClick={() => setActiveFeedView('following')}
                className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white border border-slate-200/70 shadow-2xs hover:border-rose-300 hover:shadow-xs transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                  <Heart className="w-5 h-5 stroke-[2]" />
                </div>
                <span className="text-[11px] font-semibold text-slate-700">Following</span>
              </button>

              <button
                onClick={() => setActiveTab('scan')}
                className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white border border-slate-200/70 shadow-2xs hover:border-purple-300 hover:shadow-xs transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-5 h-5 stroke-[2]" />
                </div>
                <span className="text-[11px] font-semibold text-slate-700">AI Scan</span>
              </button>
            </div>

            {/* 4. Hero Banner Carousel: "ShopGenie is growing!" with shop diorama image */}
            <div className="mb-2">
              <div className="relative rounded-3xl bg-gradient-to-r from-[#DBEAFE] via-[#EFF6FF] to-[#E0F2FE] border border-blue-200/60 shadow-xs overflow-hidden p-3.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-600/10 text-blue-700 font-bold text-[10px] mb-1">
                      <Sparkles className="w-3 h-3 text-blue-600" />
                      <span>Your Local Shopping Partner</span>
                    </div>
                    <h3 className="text-sm font-extrabold text-[#0B2545] tracking-tight leading-tight">
                      ShopGenie is growing!
                    </h3>
                    <p className="text-[11px] text-slate-600 mt-0.5 font-medium leading-tight">
                      Keep Supporting, your support matters!
                    </p>
                    <div className="mt-2.5">
                      <button
                        onClick={() => setActiveTab('map')}
                        className="px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] shadow-xs flex items-center gap-1 transition-all"
                      >
                        <Compass className="w-3 h-3" />
                        <span>Explore on Live Map</span>
                      </button>
                    </div>
                  </div>

                  {/* 3D Local Store Diorama Image matching Multi-Role Deck */}
                  <div className="w-24 h-20 shrink-0 rounded-xl overflow-hidden shadow-xs border border-white/60 relative bg-white">
                    <img
                      src="/shop_hero_banner.jpg"
                      alt="ShopGenie 3D Storefront"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Dot Indicator Carousel */}
                <div className="flex items-center justify-center gap-1.5 mt-2.5">
                  <span className="w-4 h-1 rounded-full bg-blue-600" />
                  <span className="w-1.5 h-1 rounded-full bg-blue-300" />
                  <span className="w-1.5 h-1 rounded-full bg-blue-300" />
                  <span className="w-1.5 h-1 rounded-full bg-blue-300" />
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 py-2 space-y-3">
            {/* 5. Section Header: Nearby Stores */}
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Nearby Stores
              </h3>
              <button
                onClick={() => setActiveTab('map')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
              >
                <span>See all</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* 6. Category Chips */}
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs transition-colors whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-[#0F766E] text-white font-bold shadow-2xs'
                      : 'bg-white text-slate-600 border border-slate-200/80 font-medium'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* 7. Verified Stores List */}
            <div className="space-y-3 pt-1">
              {filteredStores.map(store => (
                <div
                  key={store.id}
                  onClick={() => setSelectedStore(store)}
                  className="p-3 bg-white rounded-2xl border border-slate-200/80 hover:border-[#0F766E] transition-all cursor-pointer shadow-2xs"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#0F766E]/10 flex items-center justify-center text-2xl shrink-0">
                      {store.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-800 truncate">{store.name}</h4>
                        <span className="text-xs font-bold text-amber-600">{store.rating}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{store.category} · {store.distance}</div>
                      {store.offer && (
                        <div className="inline-block mt-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 text-[10px] font-bold">
                          🏷️ {store.offer}
                        </div>
                      )}
                      {store.selfCheckout && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-[#0F766E] mt-1">
                          <Sparkles className="w-3 h-3 fill-current" />
                          <span>AI Product Scan Enabled</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5-TAB CUSTOM BOTTOM NAVIGATION BAR                         */}
      {/* ========================================================= */}
      {activeRole === 'shopper' && (
        <div className="absolute bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#141C1A]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5">
          <div className="grid grid-cols-5 items-center max-w-sm mx-auto">
            {/* 1. Home */}
            <button
              onClick={() => {
                setSelectedStore(null);
                setActiveFeedView(null);
                setActiveTab('home');
              }}
              className={`flex flex-col items-center py-1 transition-colors ${
                activeTab === 'home' && !selectedStore && !activeFeedView
                  ? 'text-[#0F766E] dark:text-[#5EEAD4] font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Home</span>
            </button>

            {/* 2. Map */}
            <button
              onClick={() => {
                setSelectedStore(null);
                setActiveFeedView(null);
                setActiveTab('map');
              }}
              className={`flex flex-col items-center py-1 transition-colors ${
                activeTab === 'map'
                  ? 'text-[#0F766E] dark:text-[#5EEAD4] font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <MapPin className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Map</span>
            </button>

            {/* 3. Center Floating AI Scan */}
            <div className="flex flex-col items-center -mt-6">
              <button
                onClick={() => {
                  setSelectedStore(null);
                  setActiveFeedView(null);
                  setActiveTab('scan');
                }}
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
                  activeTab === 'scan'
                    ? 'bg-[#7C3AED] text-white ring-4 ring-[#7C3AED]/30'
                    : 'bg-gradient-to-tr from-[#0F766E] to-[#14B8A6] text-white ring-4 ring-white dark:ring-[#141C1A]'
                }`}
              >
                <Sparkles className="w-5 h-5" />
              </button>
              <span className="text-[10px] font-bold text-[#0F766E] dark:text-[#5EEAD4] mt-0.5">
                AI Scan
              </span>
            </div>

            {/* 4. Search */}
            <button
              onClick={() => {
                setSelectedStore(null);
                setActiveFeedView(null);
                setActiveTab('search');
              }}
              className={`flex flex-col items-center py-1 transition-colors ${
                activeTab === 'search'
                  ? 'text-[#0F766E] dark:text-[#5EEAD4] font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Search className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Search</span>
            </button>

            {/* 5. Smart Bag */}
            <button
              onClick={() => {
                setSelectedStore(null);
                setActiveFeedView(null);
                setActiveTab('cart');
              }}
              className={`flex flex-col items-center py-1 transition-colors relative ${
                activeTab === 'cart'
                  ? 'text-[#0F766E] dark:text-[#5EEAD4] font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-amber-500 text-slate-950 text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-[#141C1A]">
                    {totalCartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5">Smart Bag</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* LOCATION SELECTOR MODAL BOTTOM SHEET                      */}
      {/* ========================================================= */}
      {isLocationModalOpen && (
        <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col justify-end">
          <div className="bg-white dark:bg-[#141C1A] rounded-t-3xl p-5 border-t border-slate-200 dark:border-slate-800 space-y-3 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold">Select Location</h3>
              <button onClick={() => setIsLocationModalOpen(false)} className="text-xs font-bold text-slate-400">Close</button>
            </div>
            <div className="space-y-1.5">
              {AVAILABLE_LOCATIONS.map(loc => (
                <button
                  key={loc}
                  onClick={() => {
                    setCurrentLocation(loc);
                    setIsLocationModalOpen(false);
                    showToast(`Updated location to ${loc.split(',')[0]}`);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left text-xs font-medium flex items-center justify-between ${
                    currentLocation === loc
                      ? 'bg-[#0F766E]/10 text-[#0F766E] font-bold'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#0F766E]" />
                    <span>{loc}</span>
                  </div>
                  {currentLocation === loc && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
