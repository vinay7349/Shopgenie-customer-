import 'package:http/http.dart' as http;

import '../models/product_item.dart';
import '../models/store_item.dart';
import 'shop_api_service.dart';

class ShopService {
  static http.Client? _httpClientOverride;

  static void setHttpClientForTesting(http.Client? client) {
    _httpClientOverride = client;
  }

  static List<String> categoriesFor(List<StoreItem> stores) {
    final categories = stores
        .map((store) => store.category.trim())
        .where((category) => category.isNotEmpty)
        .toSet()
        .toList()
      ..sort((a, b) => a.toLowerCase().compareTo(b.toLowerCase()));
    return ['All', ...categories];
  }

  static List<StoreItem> filterStores({
    required List<StoreItem> stores,
    String query = '',
    String category = 'All',
  }) {
    final normalizedQuery = query.trim().toLowerCase();
    return stores.where((store) {
      final matchesCategory =
          category == 'All' || store.category.toLowerCase() == category.toLowerCase();
      final matchesQuery = normalizedQuery.isEmpty ||
          store.name.toLowerCase().contains(normalizedQuery) ||
          store.category.toLowerCase().contains(normalizedQuery) ||
          store.address.toLowerCase().contains(normalizedQuery);
      return matchesCategory && matchesQuery;
    }).toList();
  }

  static Future<List<StoreItem>> fetchShops({
    int page = 1,
    int pageSize = 20,
    String? category,
    String? search,
    http.Client? client,
  }) async {
    final api = ShopApiService(client: client ?? _httpClientOverride);
    try {
      return await api.fetchShops(
        page: page,
        pageSize: pageSize,
        category: category,
        search: search,
      );
    } finally {
      api.close();
    }
  }

  static Future<StoreItem> fetchShopById(
    String id, {
    http.Client? client,
  }) async {
    final api = ShopApiService(client: client ?? _httpClientOverride);
    try {
      return await api.fetchShopById(id);
    } finally {
      api.close();
    }
  }

  static Future<List<ProductItem>> fetchProductsForShop(
    String shopId, {
    http.Client? client,
  }) async {
    final api = ShopApiService(client: client ?? _httpClientOverride);
    try {
      return await api.fetchProductsForShop(shopId);
    } finally {
      api.close();
    }
  }
}
