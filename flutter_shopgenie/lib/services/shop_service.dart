import '../models/store_item.dart';
import '../models/product_item.dart';
import '../models/offer_item.dart';

class ShopService {
  static const List<String> categories = [
    'All',
    'Supermarket',
    'Bakery & Cafe',
    'Pharmacy',
    'Electronics',
    'Fashion',
  ];

  static const List<String> availableLocations = [
    'Indiranagar 100ft Rd, Bengaluru',
    'Koramangala 4th Block, Bengaluru',
    'HSR Layout Sector 1, Bengaluru',
    'MG Road Central, Bengaluru',
    'Rajarajeshwari Nagar, Bengaluru',
    'Neermarga Proper, Mangaluru',
  ];

  static List<StoreItem> sampleStores = [
    const StoreItem(
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
      lat: 12.9340,
      lng: 77.6250,
      hours: '7:00 AM - 10:00 PM',
      phone: '+91 98450 12091',
      followers: 840,
      isFollowing: true,
    ),
    const StoreItem(
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
      lat: 12.9355,
      lng: 77.6210,
      hours: '8:00 AM - 10:30 PM',
      phone: '+91 80 2860 1199',
      followers: 460,
      isFollowing: true,
    ),
    const StoreItem(
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
      lat: 12.9332,
      lng: 77.6275,
      hours: '24 Hours Open',
      phone: '+91 80 4120 7700',
      followers: 290,
      isFollowing: false,
    ),
    const StoreItem(
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
      lat: 12.9380,
      lng: 77.6310,
      hours: '10:00 AM - 9:30 PM',
      phone: '+91 98800 54321',
      followers: 512,
      isFollowing: false,
    ),
    const StoreItem(
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
      lat: 12.9395,
      lng: 77.6190,
      hours: '10:30 AM - 9:00 PM',
      phone: '+91 99000 88776',
      followers: 320,
      isFollowing: false,
    ),
  ];

  static List<ProductItem> sampleProducts = [
    const ProductItem(
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
      description: 'Fresh Hass avocados grown sustainably without pesticides. High in healthy fats.',
      inStock: true,
    ),
    const ProductItem(
      id: 'p2',
      storeId: '1',
      storeName: 'GreenLeaf Organic Grocers',
      name: 'Farm Fresh Almond Milk 1L',
      category: 'Dairy & Alternatives',
      price: 2.89,
      mrp: 3.50,
      emoji: '🥛',
      barcode: '8901234567891',
      stock: 28,
      description: 'Unsweetened cold-pressed California almonds, fortified with calcium and Vitamin D.',
      inStock: true,
    ),
    const ProductItem(
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
      description: 'Rolled wholegrain oats, wild forest honey, golden raisins, and roasted pumpkin seeds.',
      inStock: true,
    ),
    const ProductItem(
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
      description: '36-hour slow fermented sourdough loaf with an open crumb and crispy golden crust.',
      inStock: true,
    ),
    const ProductItem(
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
      description: 'Classic flaky croissant baked fresh every morning with Normandy cultured butter.',
      inStock: true,
    ),
    const ProductItem(
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
      description: 'Active Noise Cancellation, 40-hour playback, low-latency gaming mode and USB-C quick charge.',
      inStock: true,
    ),
  ];

  static List<OfferItem> sampleOffers = [
    const OfferItem(
      id: 'off-1',
      storeId: '1',
      storeName: 'GreenLeaf Organic Grocers',
      title: 'Flat 20% Off Organic Greens',
      discount: '20% OFF',
      code: 'GREEN20',
      description: 'Applicable on all locally harvested organic vegetables and fruits above \$15.',
      validTill: 'Ends Sunday midnight',
      category: 'Supermarket',
    ),
    const OfferItem(
      id: 'off-2',
      storeId: '2',
      storeName: 'The Daily Crust Bakery',
      title: 'Buy 1 Get 1 on Croissants',
      discount: 'BOGO FREE',
      code: 'CRUSTBOGO',
      description: 'Order any artisan coffee and get your second butter croissant on the house.',
      validTill: 'Valid 8:00 AM - 12:00 PM',
      category: 'Bakery & Cafe',
    ),
    const OfferItem(
      id: 'off-3',
      storeId: '3',
      storeName: 'CarePlus 24/7 Chemist',
      title: '15% Off Wellness & Supplements',
      discount: '15% OFF',
      code: 'CARE15',
      description: 'Save on immunity boosters, vitamins, protein isolates, and first-aid kits.',
      validTill: 'Valid till month end',
      category: 'Pharmacy',
    ),
    const OfferItem(
      id: 'off-4',
      storeId: '4',
      storeName: 'Apex Digital Hub',
      title: '\$20 Instant Cashback On Gear',
      discount: '\$20 FLAT',
      code: 'APEX20',
      description: 'Instant discount on Bluetooth accessories, smartbands and rapid chargers over \$40.',
      validTill: 'Limited to first 50 shoppers',
      category: 'Electronics',
    ),
  ];

  static List<StoreItem> filterStores({
    String query = '',
    String category = 'All',
  }) {
    return sampleStores.where((store) {
      final matchesCat = category == 'All' ||
          store.category.toLowerCase().contains(category.toLowerCase());
      final matchesQuery = query.trim().isEmpty ||
          store.name.toLowerCase().contains(query.toLowerCase()) ||
          store.category.toLowerCase().contains(query.toLowerCase()) ||
          store.address.toLowerCase().contains(query.toLowerCase());
      return matchesCat && matchesQuery;
    }).toList();
  }

  static List<ProductItem> getProductsForStore(String storeId) {
    return sampleProducts.where((p) => p.storeId == storeId).toList();
  }

  static ProductItem? findProductByBarcode(String barcode) {
    try {
      return sampleProducts.firstWhere((p) => p.barcode == barcode);
    } catch (_) {
      return null;
    }
  }
}
