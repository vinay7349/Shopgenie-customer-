import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  UserRole, 
  Shop, 
  Product, 
  Offer, 
  CartItem, 
  Order, 
  LoyaltyCard, 
  FeedPost, 
  NotificationItem,
  PaymentMethod
} from '../types';
import { 
  INITIAL_SHOPS, 
  INITIAL_PRODUCTS, 
  INITIAL_OFFERS, 
  INITIAL_LOYALTY_CARDS, 
  INITIAL_FEED_POSTS, 
  INITIAL_NOTIFICATIONS 
} from '../data/mockData';
import { AppLanguage, TRANSLATIONS } from '../translations';

export interface SnackbarInfo {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  type?: 'info' | 'success' | 'warning' | 'error';
}

interface ShopGenieContextType {
  // User & Role
  currentUser: User;
  setRole: (role: UserRole) => void;
  isLoggedIn: boolean;
  login: (emailOrPhone: string, role: UserRole) => void;
  logout: () => void;
  
  // Location
  currentArea: string;
  setCurrentArea: (area: string) => void;
  availableAreas: string[];

  // App Settings
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  t: typeof TRANSLATIONS.en;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  deviceViewMode: 'phone' | 'full';
  toggleDeviceViewMode: () => void;

  // Navigation
  customerTab: 'home' | 'map' | 'search' | 'scan' | 'cart' | 'feed';
  setCustomerTab: (tab: 'home' | 'map' | 'search' | 'scan' | 'cart' | 'feed') => void;
  ownerTab: 'dashboard' | 'inventory' | 'offers' | 'orders' | 'store';
  setOwnerTab: (tab: 'dashboard' | 'inventory' | 'offers' | 'orders' | 'store') => void;
  selectedShopId: string | null;
  setSelectedShopId: (id: string | null) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  isCodeModalOpen: boolean;
  setIsCodeModalOpen: (open: boolean) => void;
  isAreaPickerOpen: boolean;
  setIsAreaPickerOpen: (open: boolean) => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;

  // Data Collections
  shops: Shop[];
  products: Product[];
  offers: Offer[];
  loyaltyCards: LoyaltyCard[];
  feedPosts: FeedPost[];
  notifications: NotificationItem[];
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;

  // Follow
  followedShopIds: string[];
  toggleFollowShop: (shopId: string) => void;

  // Cart & Checkout
  cart: CartItem[];
  addToCart: (product: Product, shop?: Shop, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  createOrder: (paymentMethod: PaymentMethod, loyaltyPointsApplied?: boolean) => Order;

  // Orders
  orders: Order[];
  verifyOrderExitPass: (orderIdOrPass: string) => boolean;

  // Loyalty
  redeemLoyaltyReward: (shopId: string, rewardId: string) => boolean;

  // Feed
  toggleLikePost: (postId: string) => void;
  createFeedPost: (text: string, offerTag?: string) => void;

  // Owner Management
  updateProductStock: (productId: string, newStock: number) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  toggleOfferStatus: (offerId: string) => void;
  createOffer: (offer: Omit<Offer, 'id'>) => void;
  ownerShop: Shop;
  updateOwnerShop: (partial: Partial<Shop>) => void;

  // Admin Management
  pendingShops: Shop[];
  approveShop: (shopId: string) => void;
  rejectShop: (shopId: string, reason: string) => void;

  // Notifications
  markAllNotificationsRead: () => void;
  unreadNotificationsCount: number;

  // Snackbar
  snackbar: SnackbarInfo | null;
  showSnackbar: (info: SnackbarInfo) => void;
  hideSnackbar: () => void;

  // Active Store Session (for self-checkout)
  activeSelfCheckoutShop: Shop | null;
  setActiveSelfCheckoutShop: (shop: Shop | null) => void;
}

const ShopGenieContext = createContext<ShopGenieContextType | undefined>(undefined);

export const AVAILABLE_AREAS = [
  'Rajarajeshwari Nagar, Bengaluru',
  'Indiranagar 100ft Rd, Bengaluru',
  'Koramangala 4th Block, Bengaluru',
  'Jayanagar 4th Block, Bengaluru',
  'Malleshwaram 8th Cross, Bengaluru',
  'Whitefield ITPL Main Rd, Bengaluru'
];

export const ShopGenieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme & Mode
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [deviceViewMode, setDeviceViewMode] = useState<'phone' | 'full'>('phone');
  const [language, setLanguage] = useState<AppLanguage>('en');

  // User
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'user-guest-1',
    name: 'Ananya Sharma',
    phone: '+91 98451 90812',
    email: 'ananya.s@shopgenie.app',
    role: 'customer',
    savedArea: 'Rajarajeshwari Nagar, Bengaluru'
  });
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Navigation
  const [customerTab, setCustomerTab] = useState<'home' | 'map' | 'search' | 'scan' | 'cart' | 'feed'>('home');
  const [ownerTab, setOwnerTab] = useState<'dashboard' | 'inventory' | 'offers' | 'orders' | 'store'>('dashboard');
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isAreaPickerOpen, setIsAreaPickerOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Location
  const [currentArea, setCurrentArea] = useState<string>('Rajarajeshwari Nagar, Bengaluru');

  // Domain Collections
  const [shops, setShops] = useState<Shop[]>(INITIAL_SHOPS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [offers, setOffers] = useState<Offer[]>(INITIAL_OFFERS);
  const [loyaltyCards, setLoyaltyCards] = useState<LoyaltyCard[]>(INITIAL_LOYALTY_CARDS);
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>(INITIAL_FEED_POSTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Arabica coffee',
    'Avocados',
    'Riding helmet',
    'Thatte idli'
  ]);

  // Followed Shops
  const [followedShopIds, setFollowedShopIds] = useState<string[]>(['shop-1', 'shop-2', 'shop-6']);

  // Cart & Orders
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-8921',
      shopId: 'shop-1',
      shopName: 'The Old Coffee Roasters',
      items: [
        {
          productId: 'prod-101',
          productName: 'Estate Arabica Whole Beans (250g)',
          price: 460,
          quantity: 1,
          imageUrl: ''
        },
        {
          productId: 'prod-102',
          productName: 'Flaky Almond Butter Croissant',
          price: 180,
          quantity: 1,
          imageUrl: ''
        }
      ],
      subtotal: 640,
      discount: 128,
      loyaltyPointsUsed: 0,
      tax: 25,
      total: 537,
      status: 'paid',
      paymentMethod: 'upi',
      paymentId: 'UPI-RR-904291',
      exitPassQr: 'PASS-ORD-8921-VERIFIED',
      exitPassVerified: true,
      createdAt: '2026-09-22T09:30:00Z'
    }
  ]);

  // Active Store Session
  const [activeSelfCheckoutShop, setActiveSelfCheckoutShop] = useState<Shop | null>(null);

  // Snackbar
  const [snackbar, setSnackbar] = useState<SnackbarInfo | null>(null);

  // Admin pending shops
  const [pendingShops, setPendingShops] = useState<Shop[]>([
    {
      id: 'shop-p1',
      name: 'Mysore Silk Weavers Guild',
      category: 'Fashion & Apparel',
      logoUrl: '',
      coverUrl: '',
      lat: 12.9275,
      lng: 77.5255,
      distanceM: 780,
      rating: 4.6,
      reviewCount: 14,
      followerCount: 22,
      productCount: 18,
      isOpen: true,
      hours: '10:00 AM - 8:30 PM',
      address: '77, Outer Ring Rd, RR Nagar',
      area: 'Rajarajeshwari Nagar',
      phone: '+91 99450 77110',
      supportsSelfCheckout: false,
      verified: false,
      paymentMethods: ['UPI', 'Card'],
      description: 'Artisanal handloom sarees directly from master silk weavers.'
    }
  ]);

  // Dark Mode class syncing
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Helpers
  const showSnackbar = (info: SnackbarInfo) => {
    setSnackbar(info);
    setTimeout(() => {
      setSnackbar((current) => (current?.message === info.message ? null : current));
    }, 4500);
  };

  const hideSnackbar = () => setSnackbar(null);

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  const toggleDeviceViewMode = () => setDeviceViewMode((prev) => (prev === 'phone' ? 'full' : 'phone'));

  const setRole = (role: UserRole) => {
    setCurrentUser((prev) => ({ ...prev, role }));
    showSnackbar({
      message: `Switched to ${role === 'customer' ? 'Customer / Shopper' : 'Admin'} Mode`,
      type: 'info'
    });
  };

  const login = (emailOrPhone: string, role: UserRole) => {
    setIsLoggedIn(true);
    setCurrentUser({
      id: 'user-1',
      name: role === 'admin' ? 'Genie Admin' : 'Ananya Sharma',
      phone: emailOrPhone.includes('@') ? '+91 98451 90812' : emailOrPhone,
      email: emailOrPhone.includes('@') ? emailOrPhone : 'ananya.s@shopgenie.app',
      role,
      savedArea: currentArea
    });
    showSnackbar({
      message: `Welcome back, ${role === 'admin' ? 'Genie Admin' : 'Ananya'}!`,
      type: 'success'
    });
  };

  const logout = () => {
    setIsLoggedIn(false);
    showSnackbar({ message: 'Signed out successfully' });
  };

  const addRecentSearch = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => [trimmed, ...prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase())].slice(0, 8));
  };

  const clearRecentSearches = () => setRecentSearches([]);

  // Follow / Unfollow
  const toggleFollowShop = (shopId: string) => {
    const isCurrentlyFollowed = followedShopIds.includes(shopId);
    const targetShop = shops.find((s) => s.id === shopId);
    const shopName = targetShop?.name || 'Shop';

    if (isCurrentlyFollowed) {
      setFollowedShopIds((prev) => prev.filter((id) => id !== shopId));
      setShops((prev) => prev.map((s) => (s.id === shopId ? { ...s, followerCount: Math.max(0, s.followerCount - 1) } : s)));
      showSnackbar({
        message: `Unfollowed ${shopName}`,
        actionLabel: 'Undo',
        onAction: () => toggleFollowShop(shopId)
      });
    } else {
      setFollowedShopIds((prev) => [...prev, shopId]);
      setShops((prev) => prev.map((s) => (s.id === shopId ? { ...s, followerCount: s.followerCount + 1 } : s)));
      showSnackbar({
        message: `Now following ${shopName}`,
        type: 'success'
      });
    }
  };

  // Cart actions
  const addToCart = (product: Product, shop?: Shop, quantity: number = 1) => {
    const parentShop = shop || shops.find((s) => s.id === product.shopId) || shops[0];
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(product.stock, item.quantity + quantity) }
            : item
        );
      }
      return [...prev, { product, shop: parentShop, quantity }];
    });

    showSnackbar({
      message: `Added ${product.name} to cart`,
      type: 'success'
    });
  };

  const removeFromCart = (productId: string) => {
    const removedItem = cart.find((i) => i.product.id === productId);
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
    if (removedItem) {
      showSnackbar({
        message: `Removed ${removedItem.product.name}`,
        actionLabel: 'Undo',
        onAction: () => setCart((prev) => [...prev, removedItem])
      });
    }
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + delta;
            if (nextQty <= 0) return null;
            return { ...item, quantity: Math.min(item.product.stock, nextQty) };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => setCart([]);

  // Create Order
  const createOrder = (paymentMethod: PaymentMethod, loyaltyPointsApplied: boolean = false): Order => {
    const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const discount = loyaltyPointsApplied ? Math.min(100, Math.floor(subtotal * 0.15)) : 0;
    const tax = Math.round(subtotal * 0.05);
    const total = Math.max(0, subtotal - discount + tax);
    const shop = cart[0]?.shop || shops[0];

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      shopId: shop.id,
      shopName: shop.name,
      items: cart.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        imageUrl: i.product.imageUrls[0] || ''
      })),
      subtotal,
      discount,
      loyaltyPointsUsed: loyaltyPointsApplied ? 100 : 0,
      tax,
      total,
      status: 'paid',
      paymentMethod,
      paymentId: `${paymentMethod.toUpperCase()}-${Date.now().toString().slice(-6)}`,
      exitPassQr: `GENIE-PASS-${Math.floor(100000 + Math.random() * 900000)}`,
      exitPassVerified: false,
      createdAt: new Date().toISOString()
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    // Reward loyalty points
    const earnedPoints = Math.round(total * 0.08);
    setLoyaltyCards((prev) => {
      const card = prev.find((c) => c.shopId === shop.id);
      if (card) {
        return prev.map((c) =>
          c.shopId === shop.id
            ? {
                ...c,
                points: c.points + earnedPoints - (loyaltyPointsApplied ? 100 : 0),
                history: [
                  {
                    id: `h-${Date.now()}`,
                    date: 'Today',
                    points: earnedPoints,
                    type: 'earned',
                    description: `Order #${newOrder.id} checkout`
                  },
                  ...c.history
                ]
              }
            : c
        );
      } else {
        const newCard: LoyaltyCard = {
          shopId: shop.id,
          shopName: shop.name,
          points: earnedPoints,
          nextRewardAt: 200,
          tier: 'Bronze',
          barcode: `LOYAL-${shop.name.slice(0, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
          availableRewards: [
            {
              id: `rew-${Date.now()}`,
              title: '₹50 Off next purchase',
              pointsRequired: 150,
              discountValue: 50,
              description: 'Valid on in-store self-checkout'
            }
          ],
          history: [
            {
              id: `h-${Date.now()}`,
              date: 'Today',
              points: earnedPoints,
              type: 'earned',
              description: 'Welcome loyalty reward bonus'
            }
          ]
        };
        return [...prev, newCard];
      }
    });

    return newOrder;
  };

  const verifyOrderExitPass = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    const found = orders.find((o) => o.exitPassQr.toUpperCase() === clean || o.id.toUpperCase() === clean);
    if (found) {
      setOrders((prev) =>
        prev.map((o) => (o.id === found.id ? { ...o, exitPassVerified: true } : o))
      );
      showSnackbar({
        message: `Exit Pass Verified for Order #${found.id} (₹${found.total})`,
        type: 'success'
      });
      return true;
    }
    showSnackbar({
      message: 'Invalid Exit Pass or Code Not Found',
      type: 'error'
    });
    return false;
  };

  const redeemLoyaltyReward = (shopId: string, rewardId: string): boolean => {
    const card = loyaltyCards.find((c) => c.shopId === shopId);
    if (!card) return false;
    const reward = card.availableRewards.find((r) => r.id === rewardId);
    if (!reward || card.points < reward.pointsRequired) {
      showSnackbar({ message: 'Insufficient points for this reward', type: 'error' });
      return false;
    }

    setLoyaltyCards((prev) =>
      prev.map((c) =>
        c.shopId === shopId
          ? {
              ...c,
              points: c.points - reward.pointsRequired,
              history: [
                {
                  id: `h-${Date.now()}`,
                  date: 'Today',
                  points: -reward.pointsRequired,
                  type: 'redeemed',
                  description: `Redeemed ${reward.title}`
                },
                ...c.history
              ]
            }
          : c
      )
    );

    showSnackbar({
      message: `Reward unlocked! Voucher code: GENIE-${reward.discountValue}`,
      type: 'success'
    });
    return true;
  };

  const toggleLikePost = (postId: string) => {
    setFeedPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likes: isLiked ? p.likes + 1 : p.likes - 1
          };
        }
        return p;
      })
    );
  };

  const createFeedPost = (text: string, offerTag?: string) => {
    const newPost: FeedPost = {
      id: `post-${Date.now()}`,
      shopId: 'shop-1',
      shopName: 'The Old Coffee Roasters',
      shopLogo: '',
      area: currentArea.split(',')[0],
      timeAgo: 'Just now',
      text,
      offerTag,
      likes: 1,
      isLiked: true
    };
    setFeedPosts((prev) => [newPost, ...prev]);
    showSnackbar({ message: 'Live post published to Local Feed!', type: 'success' });
  };

  // Owner management actions
  const updateProductStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: Math.max(0, newStock) } : p))
    );
    showSnackbar({ message: 'Stock updated', type: 'info' });
  };

  const addProduct = (p: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...p,
      id: `prod-${Date.now()}`,
      shopId: 'shop-1',
      shopName: 'The Old Coffee Roasters'
    };
    setProducts((prev) => [newProduct, ...prev]);
    showSnackbar({ message: `Added "${p.name}" to inventory`, type: 'success' });
  };

  const toggleOfferStatus = (offerId: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, isEndingSoon: !o.isEndingSoon } : o))
    );
    showSnackbar({ message: 'Offer status updated', type: 'info' });
  };

  const createOffer = (o: Omit<Offer, 'id'>) => {
    const newOffer: Offer = {
      ...o,
      id: `off-${Date.now()}`,
      shopId: 'shop-1',
      shopName: 'The Old Coffee Roasters'
    };
    setOffers((prev) => [newOffer, ...prev]);
    showSnackbar({ message: `New offer "${o.title}" is now live!`, type: 'success' });
  };

  const [ownerShop, setOwnerShop] = useState<Shop>(INITIAL_SHOPS[0]);

  const updateOwnerShop = (partial: Partial<Shop>) => {
    setOwnerShop((prev) => {
      const updated = { ...prev, ...partial };
      setShops((list) => list.map((s) => (s.id === prev.id ? updated : s)));
      return updated;
    });
    showSnackbar({ message: 'Store profile saved successfully', type: 'success' });
  };

  // Admin approvals
  const approveShop = (shopId: string) => {
    const target = pendingShops.find((s) => s.id === shopId);
    if (!target) return;
    setPendingShops((prev) => prev.filter((s) => s.id !== shopId));
    setShops((prev) => [...prev, { ...target, verified: true }]);
    showSnackbar({ message: `Approved "${target.name}" for public discovery`, type: 'success' });
  };

  const rejectShop = (shopId: string, reason: string) => {
    const target = pendingShops.find((s) => s.id === shopId);
    setPendingShops((prev) => prev.filter((s) => s.id !== shopId));
    showSnackbar({ message: `Rejected "${target?.name}": ${reason}`, type: 'warning' });
  };

  // Notifications
  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showSnackbar({ message: 'All notifications marked as read' });
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <ShopGenieContext.Provider
      value={{
        currentUser,
        setRole,
        isLoggedIn,
        login,
        logout,
        currentArea,
        setCurrentArea,
        availableAreas: AVAILABLE_AREAS,
        language,
        setLanguage,
        t,
        theme,
        toggleTheme,
        deviceViewMode,
        toggleDeviceViewMode,
        customerTab,
        setCustomerTab,
        ownerTab,
        setOwnerTab,
        selectedShopId,
        setSelectedShopId,
        selectedProductId,
        setSelectedProductId,
        isCodeModalOpen,
        setIsCodeModalOpen,
        isAreaPickerOpen,
        setIsAreaPickerOpen,
        isProfileOpen,
        setIsProfileOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        shops,
        products,
        offers,
        loyaltyCards,
        feedPosts,
        notifications,
        recentSearches,
        addRecentSearch,
        clearRecentSearches,
        followedShopIds,
        toggleFollowShop,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        createOrder,
        orders,
        verifyOrderExitPass,
        redeemLoyaltyReward,
        toggleLikePost,
        createFeedPost,
        updateProductStock,
        addProduct,
        toggleOfferStatus,
        createOffer,
        ownerShop,
        updateOwnerShop,
        pendingShops,
        approveShop,
        rejectShop,
        markAllNotificationsRead,
        unreadNotificationsCount,
        snackbar,
        showSnackbar,
        hideSnackbar,
        activeSelfCheckoutShop,
        setActiveSelfCheckoutShop
      }}
    >
      {children}
    </ShopGenieContext.Provider>
  );
};

export const useShopGenie = () => {
  const context = useContext(ShopGenieContext);
  if (!context) {
    throw new Error('useShopGenie must be used within a ShopGenieProvider');
  }
  return context;
};
