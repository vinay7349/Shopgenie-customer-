export type DeckRole = 'shopper' | 'verifier';

export interface StoreItem {
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

export interface ProductItem {
  id: string;
  storeId: string;
  storeName: string;
  name: string;
  category: string;
  price: number;
  mrp: number;
  emoji: string;
  barcode: string;
  stock: number;
  inStock: boolean;
}

export interface CartItem {
  id: string;
  storeId: string;
  name: string;
  price: number;
  emoji: string;
  barcode: string;
  quantity: number;
}

export interface DeckOrder {
  id: string; // e.g. '#SG-PASS-8942'
  passCode: string;
  storeId: string;
  storeName: string;
  customerName: string;
  customerPhone: string;
  items: CartItem[];
  total: number;
  timestamp: string;
  status: 'pending_gate' | 'verified_exit' | 'flagged';
  paymentMethod: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface AuditLogEntry {
  id: string;
  orderId: string;
  customerName: string;
  storeName: string;
  itemCount: number;
  totalAmount: number;
  verifiedTime: string;
  officerName: string;
  gateNumber: string;
}

export interface PendingStoreItem {
  id: string;
  name: string;
  category: string;
  address: string;
  description: string;
  phone: string;
  supportsSelfCheckout: boolean;
  proposedHours: string;
  submittedAt: string;
}
