export type UserRole = 'customer' | 'owner' | 'admin';

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  savedArea: string;
}

export type ShopCategory = 
  | 'Supermarket'
  | 'Food Cart'
  | 'Pop-up Store'
  | 'Fashion & Apparel'
  | 'Bakery & Cafe'
  | 'Electronics & Gadgets'
  | 'Moto & Auto Gear'
  | 'Boutique'
  | 'Pharmacy'
  | 'Home & Decor';

export interface Shop {
  id: string;
  name: string;
  category: ShopCategory;
  logoUrl: string;
  coverUrl: string;
  lat: number;
  lng: number;
  distanceM: number;
  rating: number;
  reviewCount: number;
  followerCount: number;
  productCount: number;
  isOpen: boolean;
  hours: string;
  address: string;
  area: string;
  phone: string;
  supportsSelfCheckout: boolean; // Self-checkout vs Discovery only
  verified: boolean;
  paymentMethods: string[];
  description: string;
}

export interface Product {
  id: string;
  shopId: string;
  shopName?: string;
  name: string;
  category: ShopCategory;
  price: number;
  mrp: number;
  discountPct: number;
  stock: number;
  imageUrls: string[];
  barcode: string;
  description: string;
  featured?: boolean;
}

export type OfferType = 'percentage' | 'flat' | 'bogo';

export interface Offer {
  id: string;
  shopId: string;
  shopName: string;
  title: string;
  description: string;
  type: OfferType;
  value: number; // e.g. 20 for 20% or 100 for ₹100
  code: string;
  validFrom: string;
  validTo: string;
  bannerGradient: string;
  applicableCategories?: string[];
  minOrderValue?: number;
  isEndingSoon?: boolean;
}

export interface CartItem {
  product: Product;
  shop: Shop;
  quantity: number;
}

export type OrderStatus = 'paid' | 'collected' | 'refunded' | 'cancelled';
export type PaymentMethod = 'upi' | 'card' | 'counter_cash';

export interface Order {
  id: string;
  shopId: string;
  shopName: string;
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    imageUrl: string;
  }[];
  subtotal: number;
  discount: number;
  loyaltyPointsUsed: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentId: string;
  exitPassQr: string;
  exitPassVerified: boolean;
  createdAt: string;
}

export interface LoyaltyReward {
  id: string;
  title: string;
  pointsRequired: number;
  discountValue: number;
  description: string;
}

export interface LoyaltyCard {
  shopId: string;
  shopName: string;
  points: number;
  nextRewardAt: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Diamond';
  barcode: string;
  availableRewards: LoyaltyReward[];
  history: {
    id: string;
    date: string;
    points: number;
    type: 'earned' | 'redeemed';
    description: string;
  }[];
}

export interface FeedPost {
  id: string;
  shopId: string;
  shopName: string;
  shopLogo: string;
  area: string;
  timeAgo: string;
  text: string;
  imageUrl?: string;
  offerTag?: string;
  likes: number;
  isLiked?: boolean;
}

export type NotificationType = 'offer' | 'reward' | 'order' | 'update';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}
