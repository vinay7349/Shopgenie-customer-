import 'package:flutter/material.dart';
import '../models/offer_item.dart';
import '../models/store_item.dart';
import '../models/user_role.dart';
import '../services/shop_api_service.dart';
import '../services/shop_service.dart';
import '../theme/app_colors.dart';
import '../widgets/location_selector_sheet.dart';
import '../widgets/live_offer_banner.dart';
import '../widgets/quick_action_cards.dart';
import '../widgets/store_card.dart';

class HomeScreen extends StatefulWidget {
  final String currentLocation;
  final UserRole userRole;
  final ValueChanged<String> onLocationChanged;
  final ValueChanged<UserRole> onRoleChanged;
  final Function(StoreItem) onSelectStore;
  final VoidCallback onOpenScanner;
  final VoidCallback onOpenMap;
  final VoidCallback onOpenSearch;
  final VoidCallback onOpenFeed;
  final VoidCallback onOpenOffers;
  final VoidCallback onOpenProfile;
  final VoidCallback? onOpenNotifications;

  const HomeScreen({
    super.key,
    required this.currentLocation,
    required this.userRole,
    required this.onLocationChanged,
    required this.onRoleChanged,
    required this.onSelectStore,
    required this.onOpenScanner,
    required this.onOpenMap,
    required this.onOpenSearch,
    required this.onOpenFeed,
    required this.onOpenOffers,
    required this.onOpenProfile,
    this.onOpenNotifications,
  });

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List<String> _categories = const ['All'];
  String _selectedCategory = 'All';
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';

  // Live shop discovery state.
  Future<List<StoreItem>>? _shopsFuture;
  Future<List<OfferItem>>? _offersFuture;
  late final ShopApiService _apiService;

  @override
  void initState() {
    super.initState();
    _apiService = ShopApiService();
    _loadShops();
  }

  @override
  void dispose() {
    _searchController.dispose();
    _apiService.close();
    super.dispose();
  }

  void _loadShops() {
    setState(() {
      _offersFuture = _apiService.fetchOffers();
      _shopsFuture = _apiService
          .fetchShops(
        search: _searchQuery.isNotEmpty ? _searchQuery : null,
      )
          .then((stores) {
        final categories = ShopService.categoriesFor(stores);
        if (mounted) {
          setState(() {
            _categories = categories;
            if (!_categories.contains(_selectedCategory)) {
              _selectedCategory = 'All';
            }
          });
        }
        if (widget.currentLocation == 'Location unavailable') {
          return stores;
        }
        return stores
            .where((store) => store.address == widget.currentLocation)
            .toList();
      });
    });
  }

  void _retryShops() {
    _loadShops();
  }

  void _showNotificationsSheet(BuildContext context) {
    if (widget.onOpenNotifications != null) {
      widget.onOpenNotifications!();
      return;
    }

    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Container(
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Row(
                  children: [
                    Icon(Icons.notifications_active_rounded,
                        color: Color(0xFF2563EB), size: 22),
                    SizedBox(width: 8),
                    Text(
                      'Notifications',
                      style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF0F172A)),
                    ),
                  ],
                ),
                IconButton(
                  icon: const Icon(Icons.close_rounded, size: 20),
                  onPressed: () => Navigator.pop(ctx),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: const Text(
                'No notifications available.',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                  color: Color(0xFF334155),
                ),
              ),
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final shortLocation = widget.currentLocation.split(',')[0];

    return Scaffold(
      backgroundColor:
          isDark ? AppColors.darkBackground : const Color(0xFFF8FAFC),
      body: SafeArea(
        child: Column(
          children: [
            // 1. Sticky Multi-Role Deck Top Bar: Location Selector + Map Icon + Notifications + Profile
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              decoration: BoxDecoration(
                color: isDark ? AppColors.darkSurface : Colors.white,
                border: Border(
                  bottom: BorderSide(
                    color: isDark
                        ? AppColors.darkBorder
                        : const Color(0xFFE2E8F0).withValues(alpha: 0.7),
                    width: 1,
                  ),
                ),
              ),
              child: Row(
                children: [
                  // Left: Location Pill Selector with Blue MapPin matching Multi-Role Deck
                  Expanded(
                    child: InkWell(
                      onTap: () {
                        LocationSelectorSheet.show(
                          context,
                          currentLocation: widget.currentLocation,
                          onLocationSelected: widget.onLocationChanged,
                        );
                      },
                      borderRadius: BorderRadius.circular(24),
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 12, vertical: 8),
                        decoration: BoxDecoration(
                          color: isDark
                              ? AppColors.darkSurfaceVariant
                              : const Color(0xFFF1F5F9),
                          borderRadius: BorderRadius.circular(24),
                          border: Border.all(
                            color: isDark
                                ? AppColors.darkBorder
                                : const Color(0xFFE2E8F0),
                            width: 1,
                          ),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(
                              Icons.location_on_rounded,
                              size: 15,
                              color: Color(0xFF2563EB),
                            ),
                            const SizedBox(width: 6),
                            Flexible(
                              child: Text(
                                shortLocation,
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w700,
                                  color: isDark
                                      ? Colors.white
                                      : const Color(0xFF1E293B),
                                ),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            const SizedBox(width: 4),
                            Icon(
                              Icons.keyboard_arrow_down_rounded,
                              size: 16,
                              color: isDark
                                  ? Colors.grey[400]
                                  : const Color(0xFF64748B),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),

                  // Right Action 1: Map Shortcut Icon
                  InkWell(
                    onTap: widget.onOpenMap,
                    borderRadius: BorderRadius.circular(20),
                    child: Container(
                      width: 38,
                      height: 38,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: isDark
                            ? AppColors.darkSurfaceVariant
                            : Colors.white,
                        border: Border.all(
                          color: isDark
                              ? AppColors.darkBorder
                              : const Color(0xFFE2E8F0),
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.03),
                            blurRadius: 4,
                            offset: const Offset(0, 1),
                          ),
                        ],
                      ),
                      child: const Center(
                        child: Icon(
                          Icons.map_outlined,
                          size: 18,
                          color: Color(0xFF334155),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),

                  // Right Action 2: Notifications Bell with Red Unread Dot
                  InkWell(
                    onTap: () => _showNotificationsSheet(context),
                    borderRadius: BorderRadius.circular(20),
                    child: Container(
                      width: 38,
                      height: 38,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: isDark
                            ? AppColors.darkSurfaceVariant
                            : Colors.white,
                        border: Border.all(
                          color: isDark
                              ? AppColors.darkBorder
                              : const Color(0xFFE2E8F0),
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.03),
                            blurRadius: 4,
                            offset: const Offset(0, 1),
                          ),
                        ],
                      ),
                      child: Stack(
                        children: [
                          const Center(
                            child: Icon(
                              Icons.notifications_none_rounded,
                              size: 18,
                              color: Color(0xFF334155),
                            ),
                          ),
                          Positioned(
                            top: 8,
                            right: 9,
                            child: Container(
                              width: 7,
                              height: 7,
                              decoration: BoxDecoration(
                                color: const Color(0xFFEF4444),
                                shape: BoxShape.circle,
                                border:
                                    Border.all(color: Colors.white, width: 1.5),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),

                  // Right Action 3: Profile Button
                  InkWell(
                    onTap: widget.onOpenProfile,
                    borderRadius: BorderRadius.circular(20),
                    child: Container(
                      width: 38,
                      height: 38,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: isDark
                            ? AppColors.darkSurfaceVariant
                            : Colors.white,
                        border: Border.all(
                          color: isDark
                              ? AppColors.darkBorder
                              : const Color(0xFFE2E8F0),
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.03),
                            blurRadius: 4,
                            offset: const Offset(0, 1),
                          ),
                        ],
                      ),
                      child: const Center(
                        child: Icon(
                          Icons.person_outline_rounded,
                          size: 18,
                          color: Color(0xFF334155),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Scrollable Content
            Expanded(
              child: ListView(
                padding: const EdgeInsets.only(bottom: 28),
                children: [
                  // Sky-Themed Header Area with Search Bar & Quick Action Cards
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: isDark
                            ? [
                                const Color(0xFF0F172A),
                                AppColors.darkBackground,
                              ]
                            : [
                                const Color(0xFFBAE6FD).withValues(alpha: 0.40),
                                const Color(0xFFE0F2FE).withValues(alpha: 0.25),
                                const Color(0xFFF8FAFC),
                              ],
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                      ),
                    ),
                    padding: const EdgeInsets.only(top: 12, bottom: 6),
                    child: Column(
                      children: [
                        // 2. White Rounded Search Bar matching Multi-Role Deck
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16.0),
                          child: Container(
                            decoration: BoxDecoration(
                              color: isDark
                                  ? const Color(0xFF1E293B)
                                  : Colors.white,
                              borderRadius: BorderRadius.circular(18),
                              border: Border.all(
                                color: isDark
                                    ? const Color(0xFF334155)
                                    : const Color(0xFFE2E8F0),
                                width: 1,
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withValues(alpha: 0.04),
                                  blurRadius: 8,
                                  offset: const Offset(0, 2),
                                ),
                              ],
                            ),
                            child: TextField(
                              controller: _searchController,
                              onChanged: (val) {
                                setState(() {
                                  _searchQuery = val;
                                });
                              },
                              style: TextStyle(
                                fontSize: 13,
                                color: isDark
                                    ? Colors.white
                                    : const Color(0xFF1E293B),
                              ),
                              decoration: InputDecoration(
                                hintText: 'Find shops near you',
                                hintStyle: TextStyle(
                                  color: isDark
                                      ? Colors.grey[500]
                                      : const Color(0xFF94A3B8),
                                  fontSize: 13,
                                  fontWeight: FontWeight.w400,
                                ),
                                prefixIcon: const Icon(
                                  Icons.search_rounded,
                                  color: Color(0xFF94A3B8),
                                  size: 19,
                                ),
                                suffixIcon: _searchQuery.isNotEmpty
                                    ? IconButton(
                                        icon: const Icon(Icons.clear_rounded,
                                            size: 18),
                                        onPressed: () {
                                          _searchController.clear();
                                          setState(() {
                                            _searchQuery = '';
                                          });
                                        },
                                      )
                                    : IconButton(
                                        icon: const Icon(
                                          Icons.explore_outlined,
                                          color: Color(0xFF2563EB),
                                          size: 19,
                                        ),
                                        onPressed: widget.onOpenMap,
                                        tooltip: 'Search on Map',
                                      ),
                                border: InputBorder.none,
                                contentPadding:
                                    const EdgeInsets.symmetric(vertical: 14),
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(height: 12),

                        // Quick access to live feed, offers, and scanning.
                        QuickActionCards(
                          onFeedTap: widget.onOpenFeed,
                          onOffersTap: widget.onOpenOffers,
                          onScanTap: widget.onOpenScanner,
                        ),
                        const SizedBox(height: 6),

                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16.0),
                          child: FutureBuilder<List<OfferItem>>(
                            future: _offersFuture,
                            builder: (context, snapshot) {
                              final offers = snapshot.data;
                              return LiveOfferBanner(
                                offer: offers == null || offers.isEmpty
                                    ? null
                                    : offers.first,
                                isLoading: snapshot.connectionState ==
                                    ConnectionState.waiting,
                                hasError: snapshot.hasError,
                                onRetry: _loadShops,
                                onTap: widget.onOpenOffers,
                              );
                            },
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 10),

                  // Published stores returned by the backend.
                  Padding(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 16.0, vertical: 6.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Published Stores',
                          style: TextStyle(
                            fontSize: 17,
                            fontWeight: FontWeight.w800,
                            letterSpacing: -0.3,
                            color:
                                isDark ? Colors.white : const Color(0xFF0F172A),
                          ),
                        ),
                        InkWell(
                          onTap: widget.onOpenMap,
                          child: const Row(
                            children: [
                              Text(
                                'See all',
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                  color: Color(0xFF2563EB),
                                ),
                              ),
                              SizedBox(width: 3),
                              Icon(
                                Icons.arrow_forward_rounded,
                                size: 14,
                                color: Color(0xFF2563EB),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),

                  // Category Filter Chips
                  SizedBox(
                    height: 44,
                    child: ListView.separated(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      scrollDirection: Axis.horizontal,
                      itemCount: _categories.length,
                      separatorBuilder: (_, __) => const SizedBox(width: 8),
                      itemBuilder: (context, idx) {
                        final cat = _categories[idx];
                        final isSelected = cat == _selectedCategory;
                        return ChoiceChip(
                          label: Text(cat),
                          selected: isSelected,
                          onSelected: (selected) {
                            if (selected) {
                              setState(() {
                                _selectedCategory = cat;
                              });
                            }
                          },
                          labelStyle: TextStyle(
                            fontSize: 12,
                            fontWeight:
                                isSelected ? FontWeight.w700 : FontWeight.w500,
                            color: isSelected
                                ? Colors.white
                                : (isDark
                                    ? const Color(0xFFCBD5E1)
                                    : const Color(0xFF475569)),
                          ),
                          selectedColor: AppColors.primaryGreen,
                          backgroundColor: isDark
                              ? AppColors.darkSurfaceVariant
                              : Colors.white,
                          side: BorderSide(
                            color: isSelected
                                ? AppColors.primaryGreen
                                : (isDark
                                    ? AppColors.darkBorder
                                    : const Color(0xFFE2E8F0)),
                            width: 1,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                        );
                      },
                    ),
                  ),
                  const SizedBox(height: 12),

                  // 7. Store Cards Grid / List
                  FutureBuilder<List<StoreItem>>(
                    future: _shopsFuture,
                    builder: (context, snapshot) {
                      if (snapshot.connectionState == ConnectionState.waiting) {
                        return const Padding(
                          padding: EdgeInsets.symmetric(vertical: 48.0),
                          child: Center(
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                SizedBox(
                                  width: 32,
                                  height: 32,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 3,
                                    color: AppColors.genieTeal,
                                  ),
                                ),
                                SizedBox(height: 12),
                                Text(
                                  'Discovering nearby shops...',
                                  style: TextStyle(
                                    fontSize: 13,
                                    color: Colors.grey,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      }

                      if (snapshot.hasError) {
                        final isNetwork = isNetworkFailure(snapshot.error!);
                        return Padding(
                          padding: const EdgeInsets.symmetric(
                              vertical: 24.0, horizontal: 16.0),
                          child: Container(
                            padding: const EdgeInsets.all(20),
                            decoration: BoxDecoration(
                              color:
                                  isDark ? AppColors.darkSurface : Colors.white,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(
                                color: isDark
                                    ? AppColors.darkBorder
                                    : const Color(0xFFFCA5A5),
                              ),
                            ),
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(
                                  isNetwork
                                      ? Icons.wifi_off_rounded
                                      : Icons.cloud_off_rounded,
                                  size: 40,
                                  color: const Color(0xFFDC2626),
                                ),
                                const SizedBox(height: 12),
                                const Text(
                                  'Could not load shops',
                                  style: TextStyle(
                                    fontSize: 15,
                                    fontWeight: FontWeight.bold,
                                    color: Color(0xFF1E293B),
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  isNetwork
                                      ? 'Check your connection and try again.'
                                      : snapshot.error.toString(),
                                  style: const TextStyle(
                                    fontSize: 12,
                                    color: Color(0xFF64748B),
                                  ),
                                  textAlign: TextAlign.center,
                                ),
                                const SizedBox(height: 16),
                                ElevatedButton.icon(
                                  onPressed: _retryShops,
                                  icon: const Icon(Icons.refresh_rounded,
                                      size: 16),
                                  label: const Text('Retry'),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: AppColors.genieTeal,
                                    foregroundColor: Colors.white,
                                    padding: const EdgeInsets.symmetric(
                                        horizontal: 20, vertical: 10),
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      }

                      final stores = ShopService.filterStores(
                        stores: snapshot.data ?? const <StoreItem>[],
                        query: _searchQuery,
                        category: _selectedCategory,
                      );

                      if (stores.isEmpty) {
                        return Padding(
                          padding: const EdgeInsets.all(32.0),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.store_mall_directory_outlined,
                                size: 48,
                                color: Colors.grey[400],
                              ),
                              const SizedBox(height: 12),
                              Text(
                                _searchQuery.isNotEmpty
                                    ? 'No stores found for "$_searchQuery"'
                                    : 'No stores found',
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.grey[600],
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                'Try a different name or category filter.',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: Colors.grey[500],
                                ),
                                textAlign: TextAlign.center,
                              ),
                            ],
                          ),
                        );
                      }

                      return Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16.0),
                        child: ListView.separated(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          itemCount: stores.length,
                          separatorBuilder: (_, __) =>
                              const SizedBox(height: 12),
                          itemBuilder: (context, idx) {
                            final store = stores[idx];
                            return StoreCard(
                              store: store,
                              onTap: () => widget.onSelectStore(store),
                            );
                          },
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
