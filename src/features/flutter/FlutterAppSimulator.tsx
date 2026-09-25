import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  QrCode, 
  ShoppingBag, 
  User, 
  ChevronRight, 
  ArrowLeft, 
  RotateCcw, 
  Check, 
  Plus, 
  Minus, 
  Trash2,
  Zap,
  Tag
} from 'lucide-react';

interface FlutterAppSimulatorProps {
  onOpenCodeExplorer?: () => void;
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
    description: 'Handpicked organic produce, farm fresh milk, pantry staples and cold-pressed oils.'
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
    description: 'Artisan sourdough loaves, hand-laminated butter croissants, and specialty espresso.'
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
    description: 'Essential prescription medicines, baby care, personal hygiene and 24/7 emergency supplies.'
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
    description: 'Certified audio gear, smartphones, charging cables and high-performance computing accessories.'
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
    description: 'Contemporary casualwear, handcrafted ethnic fashion, curated linen fabrics and accessories.'
  }
];

const CATEGORIES = ['All', 'Supermarkets', 'Bakery & Cafe', 'Pharmacy', 'Electronics', 'Fashion'];

const ONBOARDING_STEPS = [
  {
    title: 'Discover Local Stores',
    subtitle: 'Connect directly with trusted neighbourhood grocers, bakeries, pharmacies, and specialty shops near you.',
    highlightBadge: 'Hyperlocal Network',
    iconEmoji: '🏪'
  },
  {
    title: 'Self Scan & Express Pay',
    subtitle: 'Scan barcodes as you pick items from aisles. Skip the checkout queue with frictionless in-app payment.',
    highlightBadge: 'Zero-Wait Checkout',
    iconEmoji: '📱'
  },
  {
    title: 'Genie Community Perks',
    subtitle: 'Unlock neighborhood flash deals, exclusive local promotions, and earn loyalty coins on every purchase.',
    highlightBadge: 'Rewarding Neighbours',
    iconEmoji: '✨'
  }
];

interface CartItem {
  id: string;
  name: string;
  price: number;
  emoji: string;
  barcode: string;
  quantity: number;
}

export const FlutterAppSimulator: React.FC<FlutterAppSimulatorProps> = ({ onOpenCodeExplorer }) => {
  const [appState, setAppState] = useState<'splash' | 'onboarding' | 'main'>('splash');
  const [splashStatus, setSplashStatus] = useState('Initializing ShopGenie...');
  const [onboardingIndex, setOnboardingIndex] = useState(0);
  const [navTab, setNavTab] = useState<'explore' | 'scan' | 'bag' | 'profile'>('explore');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState<StoreItem | null>(null);
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 'p1',
      name: 'Organic Hass Avocado (2 pack)',
      price: 3.49,
      emoji: '🥑',
      barcode: '8901234567890',
      quantity: 1
    },
    {
      id: 'p2',
      name: 'Farm Fresh Almond Milk 1L',
      price: 2.89,
      emoji: '🥛',
      barcode: '8901234567891',
      quantity: 1
    }
  ]);
  const [showExitPass, setShowExitPass] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Splash auto-transition sequence matching Flutter & Android specs
  useEffect(() => {
    if (appState !== 'splash') return;

    setSplashStatus('Initializing ShopGenie...');

    const t1 = setTimeout(() => {
      setSplashStatus('Locating nearby stores & deals...');
    }, 400);

    const t2 = setTimeout(() => {
      setSplashStatus('Warming up neighbourhood catalog...');
    }, 900);

    const t3 = setTimeout(() => {
      setSplashStatus('Neighbourhood, granted!');
    }, 1300);

    const t4 = setTimeout(() => {
      setAppState('onboarding');
    }, 1700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [appState]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  const handleRestart = () => {
    setSelectedStore(null);
    setOnboardingIndex(0);
    setNavTab('explore');
    setAppState('splash');
  };

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discount = subtotal > 10 ? 1.50 : 0.0;
  const tax = subtotal * 0.05;
  const grandTotal = Math.max(0, subtotal + tax - discount);

  const filteredStores = SAMPLE_STORES.filter(s => {
    const matchesCat = selectedCategory === 'All' || s.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = !searchQuery.trim() || 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleScanItem = (item: { name: string; price: number; emoji: string; barcode: string }) => {
    setCart(prev => {
      const idx = prev.findIndex(p => p.barcode === item.barcode);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx].quantity += 1;
        return copy;
      }
      return [...prev, { ...item, id: `p-${Date.now()}`, quantity: 1 }];
    });
    showToast(`Added ${item.name} ($${item.price.toFixed(2)})`);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#F8FAFC] dark:bg-[#0B100F] text-[#0F172A] dark:text-[#F1F5F9] select-none relative overflow-hidden font-sans">
      {/* Flutter App Engine Watermark Tag */}
      <div className="absolute top-2 left-3 z-50 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#0F766E]/10 dark:bg-[#5EEAD4]/10 text-[#0F766E] dark:text-[#5EEAD4] text-[10px] font-bold tracking-wide backdrop-blur-xs">
        <span>Flutter 3.24 · Material 3</span>
      </div>

      {/* Restart Sequence Button */}
      <button 
        onClick={handleRestart}
        title="Restart Flutter Startup Sequence (Splash -> Onboarding -> Home)"
        className="absolute top-2 right-3 z-50 flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-800/80 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-semibold transition-colors"
      >
        <RotateCcw className="w-2.5 h-2.5" />
        <span>Restart Flow</span>
      </button>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-12 left-4 right-4 z-50 bg-[#0F766E] text-white px-3 py-2 rounded-xl text-xs font-semibold shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <Check className="w-4 h-4 text-[#5EEAD4]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. FLUTTER SPLASH SCREEN                                   */}
      {/* ========================================================= */}
      {appState === 'splash' && (
        <div 
          onClick={() => setAppState('onboarding')}
          className="flex-1 flex flex-col justify-between p-6 cursor-pointer relative"
        >
          {/* Skip button */}
          <div className="flex justify-end pt-4">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setAppState('onboarding');
              }}
              className="text-xs font-bold text-[#0F766E] dark:text-[#5EEAD4] px-3 py-1 rounded-lg hover:bg-teal-500/10"
            >
              Skip
            </button>
          </div>

          {/* Central Logo & Pulse Motif */}
          <div className="flex flex-col items-center justify-center text-center my-auto">
            {/* Animated Glow & Lamp Logo */}
            <div className="relative mb-6">
              <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#0F766E]/20 via-[#F59E0B]/20 to-[#6D5EF5]/20 animate-pulse flex items-center justify-center">
                <div className="w-22 h-22 rounded-full bg-gradient-to-br from-[#0F766E] via-[#0D9488] to-[#6D5EF5] flex items-center justify-center shadow-lg shadow-teal-700/30">
                  <svg className="w-12 h-12 text-white" viewBox="0 0 100 100" fill="none">
                    {/* Lamp Base */}
                    <path d="M35 78 L65 78 L60 70 L40 70 Z" fill="white" />
                    {/* Lamp Body */}
                    <path d="M25 55 Q15 68 40 70 L60 70 Q82 65 85 48 Q85 40 78 42 Q68 50 52 50 L38 46 Q25 45 25 55 Z" fill="white" />
                    {/* Lamp Handle */}
                    <path d="M25 50 Q10 48 12 60 Q14 68 28 65" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" />
                    {/* Sparkles */}
                    <path d="M82 18 Q82 28 92 28 Q82 28 82 38 Q82 28 72 28 Q82 28 82 18 Z" fill="#F59E0B" />
                    <path d="M62 16 Q62 22 68 22 Q62 22 62 28 Q62 22 56 22 Q62 22 62 16 Z" fill="#FBBF24" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Brand Title */}
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              ShopGenie
            </h1>

            {/* Brand Tagline */}
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-2 max-w-xs">
              ShopGenie - Your neighbourhood, granted.
            </p>

            {/* Circular Progress & Diagnostic Status */}
            <div className="mt-10 flex flex-col items-center">
              <div className="w-6 h-6 border-2 border-[#0F766E] border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono tracking-tight animate-fade-in">
                {splashStatus}
              </p>
            </div>
          </div>

          {/* Footnote */}
          <div className="text-center pb-2 text-[11px] font-semibold text-slate-400">
            Hyperlocal Commerce & Express Checkout
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. FLUTTER ONBOARDING SCREEN                              */}
      {/* ========================================================= */}
      {appState === 'onboarding' && (
        <div className="flex-1 flex flex-col justify-between p-6">
          {/* Header */}
          <div className="flex items-center justify-between pt-4">
            <span className="font-extrabold text-[#0F766E] dark:text-[#5EEAD4] text-base">
              ShopGenie
            </span>
            <button 
              onClick={() => setAppState('main')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              Skip
            </button>
          </div>

          {/* Card & Illustration */}
          <div className="flex flex-col items-center text-center my-auto px-2">
            <div className="w-48 h-48 rounded-3xl bg-slate-100 dark:bg-[#141C1A] border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-md mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-radial from-teal-500/10 via-amber-500/5 to-transparent" />
              <span className="text-7xl select-none relative z-10">
                {ONBOARDING_STEPS[onboardingIndex].iconEmoji}
              </span>
            </div>

            <span className="px-3 py-1 rounded-full bg-[#0F766E]/10 dark:bg-[#5EEAD4]/10 text-[#0F766E] dark:text-[#5EEAD4] text-xs font-bold mb-3">
              {ONBOARDING_STEPS[onboardingIndex].highlightBadge}
            </span>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {ONBOARDING_STEPS[onboardingIndex].title}
            </h2>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xs">
              {ONBOARDING_STEPS[onboardingIndex].subtitle}
            </p>
          </div>

          {/* Indicators & Continue Button */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-center gap-1.5">
              {ONBOARDING_STEPS.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === onboardingIndex 
                      ? 'w-6 bg-[#0F766E] dark:bg-[#5EEAD4]' 
                      : 'w-2 bg-slate-300 dark:bg-slate-700'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => {
                if (onboardingIndex < ONBOARDING_STEPS.length - 1) {
                  setOnboardingIndex(prev => prev + 1);
                } else {
                  setAppState('main');
                }
              }}
              className="w-full py-3.5 rounded-2xl bg-[#0F766E] hover:bg-[#0D655E] text-white font-bold text-sm shadow-md transition-all active:scale-[0.98]"
            >
              {onboardingIndex === ONBOARDING_STEPS.length - 1 ? 'Get Started' : 'Continue'}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. FLUTTER MAIN NAVIGATION & SCREEN CONTROLLER             */}
      {/* ========================================================= */}
      {appState === 'main' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar for Explore tab */}
          {navTab === 'explore' && !selectedStore && (
            <div className="bg-white dark:bg-[#141C1A] px-4 pt-8 pb-3 border-b border-slate-200 dark:border-slate-800 shrink-0">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Delivering to / Shopping at
                  </div>
                  <div className="flex items-center gap-1 text-sm font-bold text-slate-900 dark:text-white">
                    <span>📍 Koramangala 4th Block</span>
                    <span className="text-xs text-[#0F766E] dark:text-[#5EEAD4]">▾</span>
                  </div>
                </div>

                <div className="px-2.5 py-1 rounded-xl bg-teal-500/10 text-[#0F766E] dark:text-[#5EEAD4] text-xs font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Genie Verified</span>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative mt-2">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search groceries, fresh bakes, medicines..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1.5 focus:ring-[#0F766E]"
                />
              </div>

              {/* Category Filter Chips */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar mt-3 pt-0.5">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? 'bg-[#0F766E] text-white font-bold shadow-2xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Screen Body */}
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {/* TAB 1: EXPLORE */}
            {navTab === 'explore' && !selectedStore && (
              <div className="p-4 space-y-4">
                {/* Flash Deal Banner */}
                <div 
                  onClick={() => setNavTab('scan')}
                  className="p-4 rounded-2xl bg-gradient-to-r from-[#0F766E] via-[#0D9488] to-[#6D5EF5] text-white cursor-pointer shadow-md hover:brightness-105 transition-all"
                >
                  <div className="inline-block px-2 py-0.5 rounded-md bg-white/20 text-[#F59E0B] font-extrabold text-[10px] tracking-wider mb-2">
                    ⚡ NEIGHBOURHOOD DEALS
                  </div>
                  <h3 className="text-sm font-bold">Scan & Skip Queues in 12+ Stores</h3>
                  <p className="text-xs text-white/85 mt-0.5">
                    Grab items, scan barcodes on phone, pay & walk out!
                  </p>
                </div>

                {/* Section Title */}
                <div className="flex items-center justify-between pt-1">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Verified Nearby Stores
                  </h4>
                  <span className="text-xs font-semibold text-[#0F766E] dark:text-[#5EEAD4]">
                    {filteredStores.length} shops
                  </span>
                </div>

                {/* Store Cards */}
                <div className="space-y-3">
                  {filteredStores.map(store => (
                    <div
                      key={store.id}
                      onClick={() => setSelectedStore(store)}
                      className="p-3.5 rounded-2xl bg-white dark:bg-[#141C1A] border border-slate-200/80 dark:border-slate-800 hover:border-teal-500/50 cursor-pointer shadow-xs transition-all flex items-start gap-3"
                    >
                      <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center text-2xl shrink-0">
                        {store.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {store.name}
                          </h5>
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[10px] font-bold shrink-0">
                            {store.rating}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {store.category} · {store.distance}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {store.address}
                        </p>
                        {store.offer && (
                          <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/15 text-amber-800 dark:text-amber-300 text-[10px] font-semibold">
                            <Tag className="w-2.5 h-2.5" />
                            <span>{store.offer}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STORE DETAIL SHEET */}
            {navTab === 'explore' && selectedStore && (
              <div className="p-4 space-y-4">
                <button
                  onClick={() => setSelectedStore(null)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#0F766E]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Nearby Stores</span>
                </button>

                <div className="p-4 rounded-2xl bg-white dark:bg-[#141C1A] border border-slate-200 dark:border-slate-800 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-teal-500/10 mx-auto flex items-center justify-center text-3xl mb-3">
                    {selectedStore.emoji}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedStore.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {selectedStore.category} · {selectedStore.distance}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {selectedStore.address}
                  </p>
                </div>

                {selectedStore.selfCheckout && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0F766E] to-[#0D9488] text-white flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold">Self Scan & Go Enabled</div>
                      <div className="text-[11px] text-white/80">
                        Scan items off aisles directly from phone
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedStore(null);
                        setNavTab('scan');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white text-[#0F766E] text-xs font-bold shadow-xs hover:bg-slate-50"
                    >
                      Start Scan
                    </button>
                  </div>
                )}

                {selectedStore.description && (
                  <div className="p-4 rounded-2xl bg-white dark:bg-[#141C1A] border border-slate-200 dark:border-slate-800">
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white mb-1.5">
                      About Store
                    </h5>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {selectedStore.description}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: SCAN & GO */}
            {navTab === 'scan' && (
              <div className="h-full flex flex-col bg-slate-950 text-white">
                {/* Viewfinder Header */}
                <div className="p-4 pt-6 flex items-center justify-between border-b border-slate-800">
                  <div>
                    <h4 className="text-xs font-bold text-white">Self Scan & Express Checkout</h4>
                    <p className="text-[10px] text-slate-400">GreenLeaf Organic Grocers</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-[#5EEAD4] text-[10px] font-bold">
                    Camera Live
                  </span>
                </div>

                {/* Viewfinder Reticle */}
                <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
                  <div className="w-56 h-44 rounded-2xl border-2 border-[#5EEAD4] relative flex items-center justify-center overflow-hidden bg-slate-900/60 shadow-[0_0_20px_rgba(94,234,212,0.2)]">
                    <QrCode className="w-20 h-20 text-slate-700" />
                    {/* Animated Laser Beam */}
                    <div className="absolute left-2 right-2 h-0.5 bg-[#F59E0B] shadow-[0_0_8px_#F59E0B] animate-bounce" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-4 text-center">
                    Align product barcode inside the green viewfinder
                  </p>
                </div>

                {/* Tap to Scan Aisle Test Barcodes */}
                <div className="p-4 bg-slate-900 rounded-t-3xl border-t border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#5EEAD4] flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5" />
                      <span>Test Shelf Barcodes</span>
                    </span>
                    <span className="text-[10px] text-slate-400">Tap to add</span>
                  </div>

                  <div className="space-y-1.5 max-h-40 overflow-y-auto no-scrollbar">
                    {[
                      { name: 'Organic Hass Avocado (2 pack)', price: 3.49, emoji: '🥑', barcode: '8901234567890' },
                      { name: 'Farm Fresh Almond Milk 1L', price: 2.89, emoji: '🥛', barcode: '8901234567891' },
                      { name: 'Butter Croissant (Artisan)', price: 2.50, emoji: '🥐', barcode: '8901234567892' },
                      { name: 'Vitamin C 1000mg Effervescent', price: 5.99, emoji: '💊', barcode: '8901234567893' },
                    ].map(item => (
                      <button
                        key={item.barcode}
                        onClick={() => handleScanItem(item)}
                        className="w-full p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-left flex items-center justify-between text-xs transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{item.emoji}</span>
                          <div>
                            <div className="font-semibold text-slate-200">{item.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">UPC: {item.barcode}</div>
                          </div>
                        </div>
                        <span className="font-bold text-[#5EEAD4]">${item.price.toFixed(2)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: BAG */}
            {navTab === 'bag' && (
              <div className="p-4 flex flex-col h-full">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Express Self-Checkout Bag
                  </h4>
                  {cart.length > 0 && (
                    <button
                      onClick={() => setCart([])}
                      className="text-xs text-red-500 font-semibold hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {cart.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 my-auto">
                    <ShoppingBag className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-3" />
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                      Your Bag is Empty
                    </h5>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs">
                      Walk into any Genie-enabled store and scan product barcodes directly from the shelves.
                    </p>
                    <button
                      onClick={() => setNavTab('scan')}
                      className="mt-4 px-4 py-2 rounded-xl bg-[#0F766E] text-white text-xs font-bold shadow-xs"
                    >
                      Start Scanning
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col justify-between pt-3">
                    <div className="space-y-2.5 overflow-y-auto">
                      {cart.map(item => (
                        <div
                          key={item.id}
                          className="p-3 rounded-2xl bg-white dark:bg-[#141C1A] border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-2xl">{item.emoji}</span>
                            <div>
                              <div className="text-xs font-bold text-slate-900 dark:text-white">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-slate-400">
                                ${item.price.toFixed(2)} each
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                              <button
                                onClick={() => {
                                  if (item.quantity > 1) {
                                    setCart(prev => prev.map(p => p.id === item.id ? { ...p, quantity: p.quantity - 1 } : p));
                                  } else {
                                    setCart(prev => prev.filter(p => p.id !== item.id));
                                  }
                                }}
                                className="w-5 h-5 rounded flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold w-4 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => {
                                  setCart(prev => prev.map(p => p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p));
                                }}
                                className="w-5 h-5 rounded flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 text-[#0F766E]"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <span className="text-xs font-bold text-slate-900 dark:text-white min-w-12 text-right">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Bill Breakdown & Pay */}
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-[#0F766E] font-semibold">
                        <span>Neighbourhood Discount</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Estimated Tax (5%)</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-extrabold text-slate-900 dark:text-white pt-1">
                        <span>Total to Pay</span>
                        <span className="text-[#0F766E] dark:text-[#5EEAD4]">
                          ${grandTotal.toFixed(2)}
                        </span>
                      </div>

                      <button
                        onClick={() => setShowExitPass(true)}
                        className="w-full mt-3 py-3 rounded-2xl bg-[#0F766E] hover:bg-[#0c5f59] text-white font-bold text-xs shadow-md transition-all active:scale-[0.98]"
                      >
                        Pay & Generate Gate Exit Pass
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: PROFILE */}
            {navTab === 'profile' && (
              <div className="p-4 space-y-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-[#141C1A] border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-teal-500/10 flex items-center justify-center text-2xl">
                    🧞
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Priya Sharma</h4>
                    <p className="text-xs text-slate-500">Koramangala 4th Block · Resident</p>
                    <span className="inline-block px-2 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 text-[10px] font-bold mt-1">
                      ⭐ Gold Shopper tier
                    </span>
                  </div>
                </div>

                {/* Loyalty Pass Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0F766E] via-[#0D9488] to-[#6D5EF5] text-white shadow-md">
                  <div className="flex items-center justify-between text-[10px] font-extrabold tracking-wider uppercase text-white/70">
                    <span>Genie Loyalty Coins</span>
                    <span className="bg-white/20 px-2 py-0.5 rounded">Active Pass</span>
                  </div>
                  <div className="mt-2 text-2xl font-black">
                    1,450 <span className="text-xs font-semibold text-[#FBBF24]">Coins ($14.50 value)</span>
                  </div>
                  <p className="text-[11px] text-white/80 mt-1">
                    Earn 5% coin cashback on all self-scan neighbourhood checkouts.
                  </p>
                </div>

                {/* Settings list */}
                <div className="p-2 rounded-2xl bg-white dark:bg-[#141C1A] border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  <div className="p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl cursor-pointer">
                    <span className="font-semibold">Digital Store Receipts</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl cursor-pointer">
                    <span className="font-semibold">Followed Local Shops</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl cursor-pointer">
                    <span className="font-semibold">Saved Neighborhood Addresses</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl cursor-pointer">
                    <span className="font-semibold">Flash Offer Push Alerts</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* FLUTTER MATERIAL 3 BOTTOM NAVIGATION BAR */}
          <div className="bg-white dark:bg-[#141C1A] border-t border-slate-200 dark:border-slate-800 px-4 py-2 flex items-center justify-around shrink-0 z-40">
            <button
              onClick={() => {
                setSelectedStore(null);
                setNavTab('explore');
              }}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
                navTab === 'explore'
                  ? 'bg-teal-500/15 text-[#0F766E] dark:text-[#5EEAD4] font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="text-base leading-none">🏠</span>
              <span className="text-[10px]">Explore</span>
            </button>

            <button
              onClick={() => setNavTab('scan')}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
                navTab === 'scan'
                  ? 'bg-teal-500/15 text-[#0F766E] dark:text-[#5EEAD4] font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="text-base leading-none">📱</span>
              <span className="text-[10px]">Scan & Go</span>
            </button>

            <button
              onClick={() => setNavTab('bag')}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all relative ${
                navTab === 'bag'
                  ? 'bg-teal-500/15 text-[#0F766E] dark:text-[#5EEAD4] font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {totalItems > 0 && (
                <span className="absolute top-0 right-2 w-4 h-4 rounded-full bg-[#0F766E] text-white text-[9px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
              <span className="text-base leading-none">🛍️</span>
              <span className="text-[10px]">Bag</span>
            </button>

            <button
              onClick={() => setNavTab('profile')}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
                navTab === 'profile'
                  ? 'bg-teal-500/15 text-[#0F766E] dark:text-[#5EEAD4] font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="text-base leading-none">👤</span>
              <span className="text-[10px]">Profile</span>
            </button>
          </div>
        </div>
      )}

      {/* EXIT PASS DIALOG */}
      {showExitPass && (
        <div className="absolute inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-white dark:bg-[#171D1B] rounded-3xl p-5 text-center shadow-2xl animate-in zoom-in-95 duration-150">
            <span className="text-3xl">✨</span>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mt-2">
              Payment Complete!
            </h4>
            <div className="mt-4 p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center">
              <QrCode className="w-32 h-32 text-slate-800 dark:text-slate-200" />
              <span className="font-mono text-xs font-bold mt-2 text-slate-700 dark:text-slate-300">
                GENIE-PASS-892401
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
              Show this QR gate pass at the exit sensor or to the store greeter as you leave.
            </p>
            <button
              onClick={() => {
                setShowExitPass(false);
                setCart([]);
                setNavTab('explore');
              }}
              className="w-full mt-4 py-2.5 rounded-xl bg-[#0F766E] text-white text-xs font-bold"
            >
              Done & Save Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
