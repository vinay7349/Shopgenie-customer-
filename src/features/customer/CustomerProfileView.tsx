import React, { useState, useEffect } from 'react';
import { useShopGenie } from '../../context/ShopGenieContext';
import { 
  X, 
  User, 
  Edit3, 
  Receipt, 
  Heart, 
  Store, 
  MapPin, 
  CreditCard, 
  Bell, 
  ShieldCheck, 
  HelpCircle, 
  Info, 
  Lock, 
  FileText, 
  Trash2, 
  LogOut, 
  ChevronRight, 
  Check, 
  Plus, 
  ShoppingBag, 
  ArrowLeft, 
  Phone, 
  Mail, 
  Sparkles, 
  Key,
  Eye,
  EyeOff,
  AlertTriangle,
  QrCode,
  CheckCircle2,
  ExternalLink,
  RotateCw,
  LogIn
} from 'lucide-react';
import { UserRole, Product, Shop } from '../../types';
import { djangoApi } from '../../services/djangoApi';

interface CustomerProfileViewProps {
  onClose?: () => void;
  isInsideSimulator?: boolean;
}

type SubModal = 
  | null 
  | 'edit_profile' 
  | 'change_password'
  | 'orders' 
  | 'saved_products' 
  | 'followed_shops' 
  | 'addresses' 
  | 'payments' 
  | 'notifications' 
  | 'help' 
  | 'about' 
  | 'privacy' 
  | 'terms' 
  | 'delete_account'
  | 'logout_confirm';

export const CustomerProfileView: React.FC<CustomerProfileViewProps> = ({ 
  onClose,
  isInsideSimulator = false
}) => {
  const {
    currentUser,
    updateProfile,
    changePassword,
    deleteAccount,
    logout,
    login,
    isLoggedIn,
    orders,
    savedProducts,
    toggleSavedProduct,
    shops,
    followedShopIds,
    toggleFollowShop,
    addToCart,
    addAddress,
    deleteAddress,
    updateNotificationsConfig
  } = useShopGenie();

  // State Management
  const [activeSubModal, setActiveSubModal] = useState<SubModal>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  // Edit Profile Form State
  const [editName, setEditName] = useState(currentUser.name);
  const [editEmail, setEditEmail] = useState(currentUser.email);
  const [editPhone, setEditPhone] = useState(currentUser.phone);
  const [editArea, setEditArea] = useState(currentUser.savedArea);
  const [editError, setEditError] = useState<string | null>(null);

  // Change Password Form State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  // New Address Form State
  const [newAddrLabel, setNewAddrLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [newAddrText, setNewAddrText] = useState('');
  const [newAddrLandmark, setNewAddrLandmark] = useState('');

  // QR Pass Viewer
  const [viewingPassOrder, setViewingPassOrder] = useState<string | null>(null);

  // Login Form State (for Logged Out State)
  const [loginInput, setLoginInput] = useState('vinaykharvik09@gmail.com');

  // Sync edit form state whenever currentUser changes
  useEffect(() => {
    setEditName(currentUser.name);
    setEditEmail(currentUser.email);
    setEditPhone(currentUser.phone);
    setEditArea(currentUser.savedArea);
  }, [currentUser]);

  // Load latest profile from backend API on mount
  useEffect(() => {
    let isMounted = true;
    const fetchBackendProfile = async () => {
      try {
        setIsLoading(true);
        setErrorBanner(null);
        const data = await djangoApi.getUserProfile();
        if (data && isMounted) {
          updateProfile(data);
        }
      } catch (err) {
        if (isMounted) {
          setErrorBanner('Could not sync with backend. Working in cached local mode.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchBackendProfile();
    return () => { isMounted = false; };
  }, []);

  // Followed shops collection
  const followedShops = shops.filter(s => followedShopIds.includes(s.id));

  // Handle Edit Profile Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      setEditError('Please enter your full name');
      return;
    }
    if (!editEmail.trim() || !editEmail.includes('@')) {
      setEditError('Please enter a valid email address');
      return;
    }
    if (!editPhone.trim() || editPhone.length < 8) {
      setEditError('Please enter a valid phone number');
      return;
    }

    try {
      await updateProfile({
        name: editName.trim(),
        email: editEmail.trim(),
        phone: editPhone.trim(),
        savedArea: editArea.trim()
      });
      setActiveSubModal(null);
      setEditError(null);
    } catch {
      setEditError('Failed to save profile. Please try again.');
    }
  };

  // Handle Change Password Submit
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!oldPassword.trim()) {
      setPasswordError('Please enter your current password');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    const res = changePassword(oldPassword, newPassword);
    if (res.success) {
      setPasswordSuccess('Password successfully updated!');
      setTimeout(() => {
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setActiveSubModal(null);
        setPasswordSuccess(null);
      }, 1200);
    } else {
      setPasswordError(res.message);
    }
  };

  // Handle Add Address
  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrText.trim()) return;
    addAddress({
      label: newAddrLabel,
      address: newAddrText.trim(),
      landmark: newAddrLandmark.trim(),
      isDefault: (currentUser.addresses?.length || 0) === 0
    });
    setNewAddrText('');
    setNewAddrLandmark('');
  };

  // =========================================================
  // LOGGED-OUT STATE
  // =========================================================
  if (!isLoggedIn) {
    return (
      <div className={`w-full h-full flex flex-col bg-[#F8FAFC] dark:bg-[#0B100F] text-[#0F172A] dark:text-[#F1F5F9] ${isInsideSimulator ? 'overflow-y-auto no-scrollbar' : 'overflow-y-auto'}`}>
        <div className="p-6 max-w-md mx-auto w-full my-auto flex flex-col items-center text-center space-y-5 animate-in fade-in duration-200">
          {/* Logo / Badge */}
          <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs border border-blue-100 dark:border-blue-900/60">
            <ShoppingBag className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h2 className="font-heading font-extrabold text-xl text-slate-900 dark:text-slate-100">
              Welcome to ShopGenie
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
              Sign in to manage your local shopping profile, view order receipts, and access role controls.
            </p>
          </div>

          {/* Quick Sign In Card */}
          <div className="w-full bg-white dark:bg-[#141C1A] rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email or Mobile Number
              </label>
              <input
                type="text"
                value={loginInput}
                onChange={e => setLoginInput(e.target.value)}
                placeholder="e.g. vinaykharvik09@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <button
              onClick={() => login(loginInput || 'vinaykharvik09@gmail.com', 'customer')}
              className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-heading font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In as Customer</span>
            </button>

            <div className="relative flex py-1 items-center">
              <div className="grow border-t border-slate-200 dark:border-slate-800"></div>
              <span className="shrink mx-3 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Demo Quick Access</span>
              <div className="grow border-t border-slate-200 dark:border-slate-800"></div>
            </div>

            <button
              onClick={() => login('vinaykharvik09@gmail.com', 'customer')}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Continue as Vinay Kharvik</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
            Discover. Shop. Support Local 💙
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full flex flex-col bg-[#F8FAFC] dark:bg-[#0B100F] text-[#0F172A] dark:text-[#F1F5F9] ${isInsideSimulator ? 'overflow-y-auto no-scrollbar' : 'overflow-y-auto'}`}>
      {/* ========================================================= */}
      {/* 1. TOP BAR NAVIGATION                                     */}
      {/* ========================================================= */}
      <div className="sticky top-0 z-20 bg-white/95 dark:bg-[#141C1A]/95 backdrop-blur-md px-4 py-3 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 -ml-1 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h2 className="font-heading font-bold text-base text-[#0F172A] dark:text-[#F1F5F9]">
            Account & Profile
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {isLoading ? (
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
              <RotateCw className="w-3.5 h-3.5 animate-spin" />
              <span>Syncing...</span>
            </div>
          ) : (
            <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
              ShopGenie Customer
            </div>
          )}
        </div>
      </div>

      {/* Error banner if network/backend failed */}
      {errorBanner && (
        <div className="mx-4 mt-3 p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 text-xs flex items-center justify-between">
          <span>{errorBanner}</span>
          <button 
            onClick={() => setErrorBanner(null)}
            className="p-1 text-amber-600 hover:text-amber-800"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="p-4 space-y-4 max-w-xl mx-auto w-full pb-20">
        {/* ========================================================= */}
        {/* 2. PROFILE HEADER CARD WITH CLEAN LOCAL SHOPPING BANNER   */}
        {/* ========================================================= */}
        <div className="bg-white dark:bg-[#141C1A] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden relative">
          {/* Clean Local Shopping & Nearby Stores Banner */}
          <div className="h-28 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 relative overflow-hidden flex flex-col justify-between p-3.5">
            {/* Elegant SVG Local Storefront Silhouette Pattern */}
            <svg 
              className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 500 120" 
              preserveAspectRatio="xMidYMid slice"
            >
              {/* Storefront Silhouettes */}
              <rect x="20" y="45" width="60" height="75" fill="#fff" rx="4" />
              <polygon points="10,45 50,20 90,45" fill="#fff" />
              <rect x="35" y="70" width="30" height="50" fill="none" stroke="#fff" strokeWidth="3" />
              <circle cx="50" cy="52" r="6" fill="#fff" />

              <rect x="110" y="30" width="70" height="90" fill="#fff" rx="4" />
              <rect x="105" y="24" width="80" height="10" fill="#fff" rx="2" />
              <rect x="125" y="65" width="40" height="55" fill="none" stroke="#fff" strokeWidth="3" />

              <rect x="210" y="50" width="80" height="70" fill="#fff" rx="4" />
              <path d="M 210,50 Q 250,30 290,50" fill="#fff" />
              <rect x="235" y="75" width="30" height="45" fill="none" stroke="#fff" strokeWidth="3" />

              <rect x="320" y="35" width="65" height="85" fill="#fff" rx="4" />
              <polygon points="310,35 352,15 395,35" fill="#fff" />
              <rect x="340" y="65" width="25" height="55" fill="none" stroke="#fff" strokeWidth="3" />

              <rect x="415" y="40" width="75" height="80" fill="#fff" rx="4" />
              <circle cx="452" cy="60" r="10" fill="#fff" />
            </svg>

            {/* Top Tagline Pill */}
            <div className="relative z-10 self-start">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/25 backdrop-blur-md text-[11px] font-bold text-white tracking-wide border border-white/15 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Discover. Shop. Support Local.</span>
              </span>
            </div>

            {/* Subtle Nearby Stores Counter */}
            <div className="relative z-10 text-[11px] font-medium text-white/80 self-end flex items-center gap-1">
              <Store className="w-3.5 h-3.5 text-blue-200" />
              <span>{shops.length} verified stores nearby</span>
            </div>
          </div>

          {/* User Details Body */}
          <div className="px-4 pb-4 pt-0 relative">
            <div className="flex items-end justify-between -mt-10 mb-3">
              {/* Circular User Avatar */}
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-white dark:bg-[#141C1A] p-1 shadow-md">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-heading font-extrabold text-2xl flex items-center justify-center shadow-inner select-none">
                    {currentUser.name
                      ? currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                      : 'VK'}
                  </div>
                </div>
                <button
                  onClick={() => setActiveSubModal('edit_profile')}
                  className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm hover:bg-blue-700 transition-colors border-2 border-white dark:border-[#141C1A]"
                  title="Edit Avatar & Profile"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
              </div>

              {/* Prominent Edit Profile Button */}
              <button
                onClick={() => setActiveSubModal('edit_profile')}
                className="px-4 py-2 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-xs font-bold transition-all flex items-center gap-1.5 border border-blue-200/80 dark:border-blue-800/80 shadow-2xs active:scale-[0.98]"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            </div>

            {/* Name, Email, Phone */}
            <div>
              <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-slate-100">
                {currentUser.name || 'Vinay Kharvik'}
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{currentUser.email || 'vinaykharvik09@gmail.com'}</span>
                </div>
                <span className="hidden sm:inline text-slate-300 dark:text-slate-700">·</span>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{currentUser.phone || '+91 98450 12345'}</span>
                </div>
              </div>

              {/* Saved Area Kicker */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[220px]">
                    {currentUser.savedArea || 'Koramangala, Bengaluru'}
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                  Verified Local Shopper
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. ACCOUNT SECTION                                        */}
        {/* ========================================================= */}
        <div className="space-y-2">
          <div className="px-1 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Account & Activity
          </div>

          <div className="bg-white dark:bg-[#141C1A] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs divide-y divide-slate-100 dark:divide-slate-800/70 overflow-hidden">
            {/* 1. My Orders */}
            <button
              onClick={() => setActiveSubModal('orders')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-heading font-bold text-xs text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
                    My Orders
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    View your purchases and order history
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {orders.length > 0 && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                    {orders.length}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>

            {/* 2. Saved Products */}
            <button
              onClick={() => setActiveSubModal('saved_products')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 dark:text-rose-400 flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-heading font-bold text-xs text-slate-900 dark:text-slate-100 group-hover:text-rose-500 transition-colors">
                    Saved Products
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Products you saved from local shops
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {savedProducts.length > 0 && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 dark:text-rose-400">
                    {savedProducts.length}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>

            {/* 3. My Shops / Followed Shops */}
            <button
              onClick={() => setActiveSubModal('followed_shops')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-heading font-bold text-xs text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 transition-colors">
                    My Shops / Followed Shops
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Manage shops you follow
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {followedShops.length > 0 && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                    {followedShops.length}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>

            {/* 4. Addresses */}
            <button
              onClick={() => setActiveSubModal('addresses')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-heading font-bold text-xs text-slate-900 dark:text-slate-100 group-hover:text-amber-600 transition-colors">
                    Addresses
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Manage your delivery and saved addresses
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>

            {/* 5. Payments */}
            <button
              onClick={() => setActiveSubModal('payments')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-heading font-bold text-xs text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">
                    Payments
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Manage your payment methods
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>

            {/* 6. Notifications */}
            <button
              onClick={() => setActiveSubModal('notifications')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-heading font-bold text-xs text-slate-900 dark:text-slate-100 group-hover:text-purple-600 transition-colors">
                    Notifications
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Manage your notification preferences
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>

            {/* 7. Security & Password */}
            <button
              onClick={() => setActiveSubModal('change_password')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-heading font-bold text-xs text-slate-900 dark:text-slate-100 group-hover:text-sky-600 transition-colors">
                    Change Password
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Update security password and account credentials
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 4. ROLE SECTION (READ-ONLY CUSTOMER ROLE)                 */}
        {/* ========================================================= */}
        <div className="space-y-2">
          <div className="px-1 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Account & Role
          </div>

          <div className="bg-white dark:bg-[#141C1A] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
            {/* Current Role Card: Read-only Customer Role */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-heading font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <span>Current Role:</span>
                    <span className="text-blue-600 dark:text-blue-400 font-extrabold uppercase tracking-wide">
                      CUSTOMER
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Local shopping, scan & pay, and exit pass generation
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                ACTIVE
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 5. SUPPORT & INFORMATION                                  */}
        {/* ========================================================= */}
        <div className="space-y-2">
          <div className="px-1 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Support & Information
          </div>

          <div className="bg-white dark:bg-[#141C1A] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs divide-y divide-slate-100 dark:divide-slate-800/70 overflow-hidden">
            {/* Help & Support */}
            <button
              onClick={() => setActiveSubModal('help')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-heading font-bold text-xs text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 transition-colors">
                    Help & Support
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    FAQ, self-checkout guides, and customer care
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* About ShopGenie */}
            <button
              onClick={() => setActiveSubModal('about')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-heading font-bold text-xs text-slate-900 dark:text-slate-100">
                    About ShopGenie
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Hyperlocal retail engine · v1.0.0
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Privacy Policy */}
            <button
              onClick={() => setActiveSubModal('privacy')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-heading font-bold text-xs text-slate-900 dark:text-slate-100">
                    Privacy Policy
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    How we protect and manage your data
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Terms of Service */}
            <button
              onClick={() => setActiveSubModal('terms')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-heading font-bold text-xs text-slate-900 dark:text-slate-100">
                    Terms of Service
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Rules and conditions for shoppers & stores
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Delete Account */}
            <button
              onClick={() => setActiveSubModal('delete_account')}
              className="w-full p-4 flex items-center justify-between hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-colors text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-heading font-bold text-xs text-rose-600 dark:text-rose-400">
                    Delete Account
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Permanently remove your account and data
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-rose-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 6. BOTTOM ACTIONS & MESSAGE                               */}
        {/* ========================================================= */}
        <div className="pt-2 space-y-3">
          {/* Large Outlined Sign Out Button */}
          <button
            onClick={() => setActiveSubModal('logout_confirm')}
            className="w-full py-3.5 px-4 rounded-2xl border-2 border-slate-300 dark:border-slate-700 hover:border-rose-400 dark:hover:border-rose-600 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 font-heading font-bold text-xs flex items-center justify-center gap-2 transition-all bg-white dark:bg-[#141C1A] shadow-xs active:scale-[0.99]"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>

          {/* Member Tenure */}
          <div className="text-center text-xs text-slate-500 dark:text-slate-400">
            Member since {currentUser.memberSince || 'October 2024'}
          </div>

          {/* Subtle ShopGenie Footer Message */}
          <div className="text-center text-[11px] text-slate-400 dark:text-slate-500 font-medium">
            Thank you for supporting local businesses 💙
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SUB-MODAL OVERLAYS (FULL WORKING INTERACTIVITY)           */}
      {/* ========================================================= */}

      {/* 1. EDIT PROFILE MODAL */}
      {activeSubModal === 'edit_profile' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141C1A] rounded-3xl p-5 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-slate-100">
                Edit Profile Details
              </h4>
              <button onClick={() => setActiveSubModal(null)} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {editError && (
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 text-xs font-medium">
                {editError}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={e => setEditEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={e => setEditPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Primary Neighborhood Area</label>
                <input
                  type="text"
                  value={editArea}
                  onChange={e => setEditArea(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setActiveSubModal('change_password');
                  }}
                  className="text-blue-600 font-bold hover:underline flex items-center gap-1"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Change Password</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveSubModal(null)}
                    className="px-3.5 py-2 text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-xs"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. CHANGE PASSWORD MODAL */}
      {activeSubModal === 'change_password' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141C1A] rounded-3xl p-5 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-sky-600" />
                <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-slate-100">
                  Change Account Password
                </h4>
              </div>
              <button onClick={() => setActiveSubModal(null)} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {passwordError && (
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 text-xs font-medium">
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 text-xs font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                    placeholder="Enter existing password"
                    className="w-full p-2.5 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">New Password (min 8 chars)</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Enter strong password"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Confirm New Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveSubModal(null)}
                  className="px-3.5 py-2 text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-xs"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. MY ORDERS MODAL */}
      {activeSubModal === 'orders' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141C1A] rounded-3xl p-5 max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-blue-600" />
                <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-slate-100">
                  My Orders & Receipts ({orders.length})
                </h4>
              </div>
              <button onClick={() => setActiveSubModal(null)} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-1 space-y-3 flex-1 mt-3">
              {orders.length === 0 ? (
                <div className="text-center py-12 px-4 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                    <Receipt className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">No purchases yet</div>
                    <p className="text-xs text-slate-400 mt-1">Scan product barcodes in nearby partner shops to generate self-checkout receipts!</p>
                  </div>
                </div>
              ) : (
                orders.map(order => (
                  <div key={order.id} className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-slate-100">{order.shopName}</div>
                        <div className="text-[10px] text-slate-400">Order ID: {order.id}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-bold text-[10px]">
                        PAID · ₹{order.total}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 dark:text-slate-300">
                      {order.items.map(i => `${i.productName} (x${i.quantity})`).join(', ')}
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-800 text-[11px]">
                      <span className="text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => setViewingPassOrder(order.exitPassQr)}
                        className="text-blue-600 font-bold flex items-center gap-1 hover:underline"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>View Exit Pass QR</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. SAVED PRODUCTS MODAL */}
      {activeSubModal === 'saved_products' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141C1A] rounded-3xl p-5 max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500" />
                <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-slate-100">
                  Saved Products ({savedProducts.length})
                </h4>
              </div>
              <button onClick={() => setActiveSubModal(null)} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-1 space-y-2.5 flex-1 mt-3">
              {savedProducts.length === 0 ? (
                <div className="text-center py-12 px-4 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">No saved products yet</div>
                    <p className="text-xs text-slate-400 mt-1">Tap the heart icon on any local item to save it for quick reordering!</p>
                  </div>
                </div>
              ) : (
                savedProducts.map(prod => (
                  <div key={prod.id} className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl shrink-0">
                        🛍️
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{prod.name}</div>
                        <div className="text-[11px] text-slate-400">{prod.shopName} · ₹{prod.price}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => addToCart(prod)}
                        className="px-3 py-1 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-2xs"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => toggleSavedProduct(prod.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. FOLLOWED SHOPS MODAL */}
      {activeSubModal === 'followed_shops' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141C1A] rounded-3xl p-5 max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-emerald-600" />
                <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-slate-100">
                  Followed Shops ({followedShops.length})
                </h4>
              </div>
              <button onClick={() => setActiveSubModal(null)} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-1 space-y-2.5 flex-1 mt-3">
              {followedShops.length === 0 ? (
                <div className="text-center py-12 px-4 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    <Store className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">No followed stores</div>
                    <p className="text-xs text-slate-400 mt-1">Follow your favourite neighbourhood grocers & bakeries to get flash offers!</p>
                  </div>
                </div>
              ) : (
                followedShops.map(s => (
                  <div key={s.id} className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0">
                        🏪
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{s.name}</div>
                        <div className="text-[11px] text-slate-400">{s.category} · {s.area} · {s.rating} ★</div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFollowShop(s.id)}
                      className="px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                    >
                      Following
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. ADDRESSES MODAL */}
      {activeSubModal === 'addresses' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141C1A] rounded-3xl p-5 max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-600" />
                <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-slate-100">
                  Manage Delivery & Saved Addresses
                </h4>
              </div>
              <button onClick={() => setActiveSubModal(null)} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-1 space-y-3 flex-1 mt-3 text-xs">
              <div className="space-y-2">
                {(currentUser.addresses || []).map(addr => (
                  <div key={addr.id} className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start justify-between bg-white dark:bg-slate-900">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100">
                        <span>{addr.label}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-amber-50 text-amber-700 font-bold">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{addr.address}</div>
                      {addr.landmark && (
                        <div className="text-[10px] text-slate-400">Landmark: {addr.landmark}</div>
                      )}
                    </div>
                    <button
                      onClick={() => deleteAddress(addr.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Address Form */}
              <form onSubmit={handleAddAddress} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="font-bold text-slate-700 dark:text-slate-300">Add New Address</div>
                <div className="flex gap-2">
                  {(['Home', 'Work', 'Other'] as const).map(lbl => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => setNewAddrLabel(lbl)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                        newAddrLabel === lbl ? 'bg-amber-600 text-white' : 'bg-white dark:bg-slate-800 border'
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Street Address, Building, Flat No"
                  value={newAddrText}
                  onChange={e => setNewAddrText(e.target.value)}
                  className="w-full p-2 rounded-xl border bg-white dark:bg-slate-800 text-xs"
                />
                <input
                  type="text"
                  placeholder="Landmark (Optional)"
                  value={newAddrLandmark}
                  onChange={e => setNewAddrLandmark(e.target.value)}
                  className="w-full p-2 rounded-xl border bg-white dark:bg-slate-800 text-xs"
                />
                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 shadow-2xs"
                >
                  Save Address
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 7. PAYMENTS MODAL */}
      {activeSubModal === 'payments' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141C1A] rounded-3xl p-5 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-slate-100">
                  Payment Methods
                </h4>
              </div>
              <button onClick={() => setActiveSubModal(null)} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              {(currentUser.paymentMethods || []).map(pay => (
                <div key={pay.id} className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 font-bold">
                      {pay.type === 'upi' ? 'UPI' : pay.type === 'card' ? '💳' : '₹'}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <span>{pay.title}</span>
                        {pay.isDefault && (
                          <span className="text-[10px] px-1.5 rounded-md bg-indigo-50 text-indigo-600 font-bold">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">{pay.subtitle}</div>
                    </div>
                  </div>
                  <span className="text-[11px] text-emerald-600 font-bold">Linked</span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200 text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Payments are secured with 256-bit bank grade encryption.</span>
            </div>
          </div>
        </div>
      )}

      {/* 8. NOTIFICATIONS MODAL */}
      {activeSubModal === 'notifications' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141C1A] rounded-3xl p-5 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-purple-600" />
                <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-slate-100">
                  Notification Preferences
                </h4>
              </div>
              <button onClick={() => setActiveSubModal(null)} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900">
                <div>
                  <div className="font-bold">Push Notifications</div>
                  <div className="text-[11px] text-slate-400">Receive alerts on lockscreen</div>
                </div>
                <input
                  type="checkbox"
                  checked={currentUser.notificationsConfig?.pushEnabled ?? true}
                  onChange={e => updateNotificationsConfig({ pushEnabled: e.target.checked })}
                  className="w-4 h-4 accent-purple-600"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900">
                <div>
                  <div className="font-bold">Self-Checkout & Order Updates</div>
                  <div className="text-[11px] text-slate-400">Exit pass ready & payment receipts</div>
                </div>
                <input
                  type="checkbox"
                  checked={currentUser.notificationsConfig?.orderUpdates ?? true}
                  onChange={e => updateNotificationsConfig({ orderUpdates: e.target.checked })}
                  className="w-4 h-4 accent-purple-600"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900">
                <div>
                  <div className="font-bold">Neighborhood Store Deals</div>
                  <div className="text-[11px] text-slate-400">Special offers from followed shops</div>
                </div>
                <input
                  type="checkbox"
                  checked={currentUser.notificationsConfig?.storeOffers ?? true}
                  onChange={e => updateNotificationsConfig({ storeOffers: e.target.checked })}
                  className="w-4 h-4 accent-purple-600"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. HELP & SUPPORT MODAL */}
      {activeSubModal === 'help' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141C1A] rounded-3xl p-5 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-cyan-600" />
                <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-slate-100">
                  ShopGenie Help & Support
                </h4>
              </div>
              <button onClick={() => setActiveSubModal(null)} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-cyan-50/60 dark:bg-cyan-950/30 border border-cyan-200/60 dark:border-cyan-900/60 text-cyan-900 dark:text-cyan-200 space-y-1">
                <div className="font-bold">How does self-checkout work?</div>
                <div className="text-[11px] text-cyan-800 dark:text-cyan-300">Scan product barcodes with your phone camera, pay with UPI, and present your digital QR pass at the store exit.</div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="font-bold">Support Hotline & WhatsApp</div>
                <div className="text-[11px] text-slate-500">Toll-free: +91 800 123 4567 (9 AM - 9 PM)</div>
                <div className="text-[11px] text-slate-500">Email: support@shopgenie.local</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 12. ABOUT SHOPGENIE MODAL */}
      {activeSubModal === 'about' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141C1A] rounded-3xl p-5 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-slate-600" />
                <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-slate-100">
                  About ShopGenie
                </h4>
              </div>
              <button onClick={() => setActiveSubModal(null)} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <p><strong>ShopGenie</strong> connects customers directly with neighborhood stores, providing high-speed optical barcode self-checkout, digital receipts, and local loyalty benefits.</p>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 text-[11px] space-y-1">
                <div>Version: <strong>1.0.0 (Production Build)</strong></div>
                <div>Runtime: <strong>Flutter 3.24 · Material 3 Engine</strong></div>
                <div>Backend: <strong>Django REST Framework API</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 13. PRIVACY & TERMS MODAL */}
      {(activeSubModal === 'privacy' || activeSubModal === 'terms') && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141C1A] rounded-3xl p-5 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-slate-100">
                {activeSubModal === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
              </h4>
              <button onClick={() => setActiveSubModal(null)} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
              <p>We believe in total respect for customer privacy and support for independent businesses. Your payment details are encrypted end-to-end, and location permissions are used solely to locate nearby shops.</p>
              <p>Exit passes are cryptographically signed to protect you and shopkeepers from theft or checkout disputes.</p>
            </div>
          </div>
        </div>
      )}

      {/* 14. DELETE ACCOUNT CONFIRMATION */}
      {activeSubModal === 'delete_account' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141C1A] rounded-3xl p-5 max-w-md w-full shadow-2xl border border-rose-200 dark:border-rose-900 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>Delete Your ShopGenie Account?</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              This action is permanent and cannot be undone. All your purchase records, saved addresses, and store loyalty passes will be wiped from the backend database.
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setActiveSubModal(null)}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await deleteAccount();
                  setActiveSubModal(null);
                  if (onClose) onClose();
                }}
                className="px-4 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 shadow-xs"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 15. LOGOUT CONFIRMATION */}
      {activeSubModal === 'logout_confirm' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141C1A] rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="font-heading font-bold text-sm text-slate-900 dark:text-slate-100">
              Sign out of ShopGenie?
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              You will be signed out on this device. You can sign back in anytime.
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setActiveSubModal(null)}
                className="px-3.5 py-1.5 text-xs text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  logout();
                  setActiveSubModal(null);
                  if (onClose) onClose();
                }}
                className="px-4 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-xs"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 16. QR EXIT PASS VIEWER */}
      {viewingPassOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141C1A] rounded-3xl p-5 max-w-xs w-full text-center space-y-3 shadow-2xl">
            <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-slate-100">
              Store Exit Pass
            </h4>
            <div className="p-4 bg-white rounded-2xl inline-block border-2 border-slate-200">
              <QrCode className="w-32 h-32 mx-auto text-slate-900" />
            </div>
            <div className="font-mono text-xs font-bold text-blue-600">{viewingPassOrder}</div>
            <p className="text-[11px] text-slate-500">Show this QR code to the store exit gate scanner.</p>
            <button
              onClick={() => setViewingPassOrder(null)}
              className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
