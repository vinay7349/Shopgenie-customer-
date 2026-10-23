import 'dart:async';
import 'package:flutter/material.dart';
import '../models/cart_item.dart';
import '../models/product_item.dart';
import '../models/store_item.dart';
import '../services/shop_api_service.dart';
import '../services/shop_service.dart';
import '../theme/app_colors.dart';
import '../widgets/store_card.dart';

class SearchScreen extends StatefulWidget {
  final Function(StoreItem) onSelectStore;
  final Function(CartItem) onAddToCart;
  final ShopApiService? apiService;

  const SearchScreen({
    super.key,
    required this.onSelectStore,
    required this.onAddToCart,
    this.apiService,
  });

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final TextEditingController _searchController = TextEditingController();
  late final ShopApiService _api;
  Timer? _debounceTimer;

  String _query = '';
  String _selectedCategory = 'All';
  bool _selfCheckoutOnly = false;
  bool _isSearching = false;

  List<StoreItem> _apiStores = [];
  List<ProductItem> _apiProducts = [];

  @override
  void initState() {
    super.initState();
    _api = widget.apiService ?? ShopApiService();
    _triggerSearch();
  }

  @override
  void dispose() {
    _debounceTimer?.cancel();
    _searchController.dispose();
    if (widget.apiService == null) {
      _api.close();
    }
    super.dispose();
  }

  void _onQueryChanged(String val) {
    setState(() {
      _query = val;
    });
    _debounceTimer?.cancel();
    _debounceTimer = Timer(const Duration(milliseconds: 350), () {
      _triggerSearch();
    });
  }

  Future<void> _triggerSearch() async {
    if (!mounted) return;
    setState(() {
      _isSearching = true;
    });

    try {
      final futures = await Future.wait([
        _api.fetchShops(
          search: _query.isNotEmpty ? _query : null,
          category: _selectedCategory != 'All' ? _selectedCategory : null,
        ),
        _query.isNotEmpty
            ? _api.searchProducts(
                _query,
                category: _selectedCategory != 'All' ? _selectedCategory : null,
              )
            : Future.value(<ProductItem>[]),
      ]);

      if (mounted) {
        setState(() {
          _apiStores = futures[0] as List<StoreItem>;
          _apiProducts = futures[1] as List<ProductItem>;
          _isSearching = false;
        });
      }
    } catch (_) {
      // If backend network fails, gracefully fall back to local service
      if (mounted) {
        setState(() {
          _isSearching = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    // Use live API stores when available, or fall back to filtered local stores
    var stores = _apiStores.isNotEmpty || _query.isNotEmpty
        ? _apiStores
        : ShopService.filterStores(
            query: _query,
            category: _selectedCategory,
          );

    if (_selfCheckoutOnly) {
      stores = stores.where((s) => s.selfCheckout).toList();
    }

    final matchingProducts = _apiProducts.isNotEmpty
        ? _apiProducts
        : ShopService.sampleProducts.where((p) {
            if (_query.trim().isEmpty) return false;
            return p.name.toLowerCase().contains(_query.toLowerCase()) ||
                p.category.toLowerCase().contains(_query.toLowerCase());
          }).toList();

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBackground : const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Search Shops & Products', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        elevation: 0,
        backgroundColor: isDark ? AppColors.darkSurface : Colors.white,
      ),
      body: Column(
        children: [
          // Search Input Container
          Container(
            color: isDark ? AppColors.darkSurface : Colors.white,
            padding: const EdgeInsets.fromLTRB(16, 4, 16, 12),
            child: Column(
              children: [
                Container(
                  decoration: BoxDecoration(
                    color: isDark ? AppColors.darkSurfaceVariant : const Color(0xFFF1F5F9),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: isDark ? AppColors.darkBorder : const Color(0xFFE2E8F0),
                    ),
                  ),
                  child: TextField(
                    controller: _searchController,
                    autofocus: false,
                    onChanged: _onQueryChanged,
                    decoration: InputDecoration(
                      hintText: 'Search stores, groceries, bakeries...',
                      hintStyle: TextStyle(fontSize: 13, color: Colors.grey[500]),
                      prefixIcon: const Icon(Icons.search_rounded, color: AppColors.genieTeal),
                      suffixIcon: _query.isNotEmpty
                          ? IconButton(
                              icon: const Icon(Icons.clear_rounded, size: 18),
                              onPressed: () {
                                _searchController.clear();
                                _onQueryChanged('');
                              },
                            )
                          : null,
                      border: InputBorder.none,
                      contentPadding: const EdgeInsets.symmetric(vertical: 14),
                    ),
                  ),
                ),
                const SizedBox(height: 10),

                // Filters row
                Row(
                  children: [
                    FilterChip(
                      label: const Text('⚡ AI Product Scan', style: TextStyle(fontSize: 11)),
                      selected: _selfCheckoutOnly,
                      onSelected: (val) {
                        setState(() {
                          _selfCheckoutOnly = val;
                        });
                      },
                      selectedColor: AppColors.aiViolet.withValues(alpha: 0.18),
                      checkmarkColor: AppColors.aiViolet,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      side: BorderSide(
                        color: _selfCheckoutOnly ? AppColors.aiViolet : Colors.grey.withValues(alpha: 0.3),
                      ),
                    ),
                    const SizedBox(width: 8),

                    // Category dropdown chips
                    Expanded(
                      child: SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: Row(
                          children: ShopService.categories.map((cat) {
                            final isSel = _selectedCategory == cat;
                            return Padding(
                              padding: const EdgeInsets.only(right: 6),
                              child: ChoiceChip(
                                label: Text(cat, style: const TextStyle(fontSize: 11)),
                                selected: isSel,
                                onSelected: (sel) {
                                  if (sel) {
                                    setState(() {
                                      _selectedCategory = cat;
                                    });
                                    _triggerSearch();
                                  }
                                },
                                selectedColor: AppColors.genieTeal,
                                labelStyle: TextStyle(
                                  color: isSel ? Colors.white : theme.colorScheme.onSurface,
                                  fontWeight: isSel ? FontWeight.bold : FontWeight.normal,
                                ),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                              ),
                            );
                          }).toList(),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          if (_isSearching)
            const LinearProgressIndicator(
              color: AppColors.genieTeal,
              backgroundColor: Colors.transparent,
              minHeight: 2,
            ),

          // Search Results List
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                // If matching products exist
                if (matchingProducts.isNotEmpty) ...[
                  Text(
                    'MATCHING PRODUCTS (${matchingProducts.length})',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 0.8,
                      color: theme.colorScheme.onSurface.withValues(alpha: 0.6),
                    ),
                  ),
                  const SizedBox(height: 8),
                  ...matchingProducts.map((p) {
                    return Card(
                      margin: const EdgeInsets.only(bottom: 8),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      child: ListTile(
                        leading: Container(
                          width: 40,
                          height: 40,
                          decoration: BoxDecoration(
                            color: AppColors.genieTeal.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          alignment: Alignment.center,
                          child: const Icon(Icons.shopping_bag_outlined, color: AppColors.genieTeal),
                        ),
                        title: Text(p.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                        subtitle: Text(
                          '${p.storeName.isNotEmpty ? "${p.storeName} • " : ""}₹${p.price.toStringAsFixed(0)}',
                          style: const TextStyle(fontSize: 11, color: AppColors.genieTeal),
                        ),
                        trailing: ElevatedButton(
                          onPressed: () {
                            widget.onAddToCart(
                              CartItem(
                                id: p.id,
                                storeId: p.storeId,
                                name: p.name,
                                price: p.price,
                                emoji: '🛍️',
                              ),
                            );
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text('Added ${p.name} to Smart Bag!'),
                                duration: const Duration(seconds: 1),
                                backgroundColor: AppColors.genieTeal,
                              ),
                            );
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.genieTeal,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                            minimumSize: Size.zero,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          ),
                          child: const Text('Add', style: TextStyle(fontSize: 11)),
                        ),
                      ),
                    );
                  }),
                  const SizedBox(height: 16),
                ],

                // Matching Stores Header
                Text(
                  'MATCHING STORES (${stores.length})',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 0.8,
                    color: theme.colorScheme.onSurface.withValues(alpha: 0.6),
                  ),
                ),
                const SizedBox(height: 8),

                if (stores.isEmpty && !_isSearching)
                  Padding(
                    padding: const EdgeInsets.all(32.0),
                    child: Center(
                      child: Column(
                        children: [
                          const Icon(Icons.search_off_rounded, size: 48, color: Colors.grey),
                          const SizedBox(height: 12),
                          const Text(
                            'No shops found',
                            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Try clearing keywords or switching category filters',
                            style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                          ),
                        ],
                      ),
                    ),
                  )
                else
                  ...stores.map((store) {
                    return StoreCard(
                      store: store,
                      onTap: () => widget.onSelectStore(store),
                    );
                  }),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
