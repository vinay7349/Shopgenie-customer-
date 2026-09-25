import '../models/store_item.dart';

class ShopService {
  static const List<String> categories = [
    'All',
    'Supermarkets',
    'Bakery & Cafe',
    'Pharmacy',
    'Electronics',
    'Fashion',
  ];

  static const List<StoreItem> sampleStores = [
    StoreItem(
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
    ),
    StoreItem(
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
    ),
    StoreItem(
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
    ),
    StoreItem(
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
    ),
    StoreItem(
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
    ),
  ];

  static List<StoreItem> filterStores({
    String query = '',
    String category = 'All',
  }) {
    return sampleStores.filter((store) {
      final matchesCat = category == 'All' ||
          store.category.toLowerCase().contains(category.toLowerCase());
      final matchesQuery = query.trim().isEmpty ||
          store.name.toLowerCase().contains(query.toLowerCase()) ||
          store.category.toLowerCase().contains(query.toLowerCase()) ||
          store.address.toLowerCase().contains(query.toLowerCase());
      return matchesCat && matchesQuery;
    }).toList();
  }
}

extension _IterableExt<T> on Iterable<T> {
  Iterable<T> filter(bool Function(T element) test) sync* {
    for (final element in this) {
      if (test(element)) yield element;
    }
  }
}
