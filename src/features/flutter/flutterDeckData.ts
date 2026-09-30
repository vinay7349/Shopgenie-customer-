import { StoreItem, ProductItem, DeckOrder, AuditLogEntry, PendingStoreItem } from './flutterDeckTypes';

export const INITIAL_DECK_STORES: StoreItem[] = [
  {
    id: '1',
    name: 'GreenLeaf Organic Grocers',
    category: 'Supermarket',
    distance: '350 m away',
    rating: '4.8 ★',
    address: '14th Main Rd, 4th Block, Koramangala',
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
    address: 'Sony World Signal, Koramangala',
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
    address: '5th Block Commercial St, Koramangala',
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

export const INITIAL_DECK_PRODUCTS: ProductItem[] = [
  {
    id: 'p1',
    storeId: '1',
    storeName: 'GreenLeaf Organic Grocers',
    name: 'Organic Hass Avocado (2 pack)',
    category: 'Produce',
    price: 3.49,
    mrp: 4.49,
    emoji: '🥑',
    barcode: '8901234567890',
    stock: 45,
    inStock: true
  },
  {
    id: 'p2',
    storeId: '1',
    storeName: 'GreenLeaf Organic Grocers',
    name: 'Farm Fresh Almond Milk 1L',
    category: 'Dairy',
    price: 2.89,
    mrp: 3.50,
    emoji: '🥛',
    barcode: '8901234567891',
    stock: 28,
    inStock: true
  },
  {
    id: 'p3',
    storeId: '1',
    storeName: 'GreenLeaf Organic Grocers',
    name: 'Crunchy Honey Granola 400g',
    category: 'Breakfast',
    price: 4.99,
    mrp: 5.99,
    emoji: '🥣',
    barcode: '8901234567892',
    stock: 19,
    inStock: true
  },
  {
    id: 'p4',
    storeId: '2',
    storeName: 'The Daily Crust Bakery',
    name: 'Artisan Sourdough Boule',
    category: 'Bakery',
    price: 4.25,
    mrp: 5.00,
    emoji: '🍞',
    barcode: '8901234567893',
    stock: 12,
    inStock: true
  },
  {
    id: 'p5',
    storeId: '2',
    storeName: 'The Daily Crust Bakery',
    name: 'French Butter Croissant',
    category: 'Pastry',
    price: 2.50,
    mrp: 3.00,
    emoji: '🥐',
    barcode: '8901234567894',
    stock: 35,
    inStock: true
  },
  {
    id: 'p6',
    storeId: '4',
    storeName: 'Apex Digital Hub',
    name: 'ANC Wireless Headphones',
    category: 'Audio',
    price: 49.99,
    mrp: 69.99,
    emoji: '🎧',
    barcode: '8901234567895',
    stock: 8,
    inStock: true
  }
];

export const INITIAL_DECK_ORDERS: DeckOrder[] = [
  {
    id: 'ord-8942',
    passCode: '#SG-PASS-8942',
    storeId: '1',
    storeName: 'GreenLeaf Organic Grocers',
    customerName: 'Vinay Kharvik',
    customerPhone: '+91 98451 90812',
    items: [
      { id: 'p1', storeId: '1', name: 'Organic Hass Avocado (2 pack)', price: 3.49, emoji: '🥑', barcode: '8901234567890', quantity: 1 },
      { id: 'p2', storeId: '1', name: 'Farm Fresh Almond Milk 1L', price: 2.89, emoji: '🥛', barcode: '8901234567891', quantity: 1 }
    ],
    total: 5.15,
    timestamp: '2 mins ago',
    status: 'pending_gate',
    paymentMethod: 'UPI AutoPay (Verified)'
  },
  {
    id: 'ord-7120',
    passCode: '#SG-PASS-7120',
    storeId: '1',
    storeName: 'GreenLeaf Organic Grocers',
    customerName: 'Priya Sundaram',
    customerPhone: '+91 97422 66012',
    items: [
      { id: 'p3', storeId: '1', name: 'Crunchy Honey Granola 400g', price: 4.99, emoji: '🥣', barcode: '8901234567892', quantity: 2 }
    ],
    total: 9.23,
    timestamp: '14 mins ago',
    status: 'verified_exit',
    paymentMethod: 'Credit Card (Apple Pay)',
    verifiedAt: '12 mins ago',
    verifiedBy: 'Officer Ramesh K. (Gate #1)'
  },
  {
    id: 'ord-6501',
    passCode: '#SG-PASS-6501',
    storeId: '2',
    storeName: 'The Daily Crust Bakery',
    customerName: 'Rahul Mehta',
    customerPhone: '+91 98860 33120',
    items: [
      { id: 'p4', storeId: '2', name: 'Artisan Sourdough Boule', price: 4.25, emoji: '🍞', barcode: '8901234567893', quantity: 1 },
      { id: 'p5', storeId: '2', name: 'French Butter Croissant', price: 2.50, emoji: '🥐', barcode: '8901234567894', quantity: 2 }
    ],
    total: 8.78,
    timestamp: '25 mins ago',
    status: 'verified_exit',
    paymentMethod: 'UPI (Google Pay)',
    verifiedAt: '24 mins ago',
    verifiedBy: 'Officer Ramesh K. (Gate #1)'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'audit-1',
    orderId: '#SG-PASS-7120',
    customerName: 'Priya Sundaram',
    storeName: 'GreenLeaf Organic Grocers',
    itemCount: 2,
    totalAmount: 9.23,
    verifiedTime: '2:25 PM',
    officerName: 'Officer Ramesh K.',
    gateNumber: 'Turnstile A-1'
  },
  {
    id: 'audit-2',
    orderId: '#SG-PASS-6501',
    customerName: 'Rahul Mehta',
    storeName: 'The Daily Crust Bakery',
    itemCount: 3,
    totalAmount: 8.78,
    verifiedTime: '2:14 PM',
    officerName: 'Officer Ramesh K.',
    gateNumber: 'Turnstile A-1'
  }
];

export const INITIAL_PENDING_STORES: PendingStoreItem[] = [
  {
    id: 'pending-1',
    name: 'Indiranagar Chai & Bun Point',
    category: 'Bakery & Cafe',
    address: '12th Main, HAL 2nd Stage, Indiranagar',
    description: 'Fresh Irani chai, bun maska, Osmania biscuits and filter coffee for office crowd.',
    phone: '+91 98450 44556',
    supportsSelfCheckout: true,
    proposedHours: '6:30 AM - 11:00 PM',
    submittedAt: 'Today, 10:30 AM'
  },
  {
    id: 'pending-2',
    name: 'Spice Roots Organic Supermarket',
    category: 'Supermarket',
    address: '27th Main Rd, HSR Layout Sector 1',
    description: 'Whole organic spices, cold-pressed mustard & sesame oils, millets and stone-ground flours.',
    phone: '+91 97400 12890',
    supportsSelfCheckout: true,
    proposedHours: '8:00 AM - 9:30 PM',
    submittedAt: 'Yesterday, 4:15 PM'
  },
  {
    id: 'pending-3',
    name: 'Artisan Leather Atelier',
    category: 'Boutique',
    address: '80ft Road, Koramangala 4th Block',
    description: 'Handcrafted full-grain leather wallets, messenger bags, belts and custom accessories.',
    phone: '+91 98860 77112',
    supportsSelfCheckout: false,
    proposedHours: '11:00 AM - 9:00 PM',
    submittedAt: '2 days ago'
  }
];
