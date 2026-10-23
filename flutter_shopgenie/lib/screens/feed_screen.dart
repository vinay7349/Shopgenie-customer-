import 'package:flutter/material.dart';
import '../models/announcement_item.dart';
import '../models/offer_item.dart';
import '../models/store_item.dart';
import '../services/shop_api_service.dart';
import '../services/shop_service.dart';
import '../theme/app_colors.dart';
import '../widgets/store_card.dart';

class FeedScreen extends StatefulWidget {
  final int initialTabIndex; // 0: Feed, 1: Offers, 2: Following
  final Function(StoreItem) onSelectStore;
  final ShopApiService? apiService;

  const FeedScreen({
    super.key,
    this.initialTabIndex = 0,
    required this.onSelectStore,
    this.apiService,
  });

  @override
  State<FeedScreen> createState() => _FeedScreenState();
}

class _FeedScreenState extends State<FeedScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  late final ShopApiService _api;

  // Announcements state
  List<AnnouncementItem> _announcements = [];
  bool _isLoadingAnnouncements = true;
  String? _announcementsError;

  // Offers state
  List<OfferItem> _offers = [];
  bool _isLoadingOffers = true;
  String? _offersError;

  @override
  void initState() {
    super.initState();
    _api = widget.apiService ?? ShopApiService();
    _tabController = TabController(
      length: 3,
      vsync: this,
      initialIndex: widget.initialTabIndex.clamp(0, 2),
    );
    _loadAnnouncements();
    _loadOffers();
  }

  Future<void> _loadAnnouncements() async {
    setState(() {
      _isLoadingAnnouncements = true;
      _announcementsError = null;
    });
    try {
      final items = await _api.fetchAnnouncements();
      if (mounted) {
        setState(() {
          _announcements = items;
          _isLoadingAnnouncements = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _announcementsError = 'Unable to connect to community feed';
          _isLoadingAnnouncements = false;
        });
      }
    }
  }

  Future<void> _loadOffers() async {
    setState(() {
      _isLoadingOffers = true;
      _offersError = null;
    });
    try {
      final items = await _api.fetchOffers();
      if (mounted) {
        setState(() {
          _offers = items;
          _isLoadingOffers = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _offersError = 'Unable to load active offers';
          _isLoadingOffers = false;
        });
      }
    }
  }

  @override
  void dispose() {
    _tabController.dispose();
    if (widget.apiService == null) {
      _api.close();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBackground : const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Community & Deals', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        elevation: 0,
        backgroundColor: isDark ? AppColors.darkSurface : Colors.white,
        bottom: TabBar(
          controller: _tabController,
          labelColor: AppColors.genieTeal,
          unselectedLabelColor: Colors.grey,
          indicatorColor: AppColors.genieTeal,
          indicatorWeight: 3,
          tabs: const [
            Tab(text: '📢 Local Feed'),
            Tab(text: '🏷️ Flash Offers'),
            Tab(text: '❤️ Following'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          // 1. Local Feed Tab
          _buildLocalFeedTab(context),

          // 2. Flash Offers Tab
          _buildOffersTab(context),

          // 3. Following Tab
          _buildFollowingTab(context),
        ],
      ),
    );
  }

  Widget _buildLocalFeedTab(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    if (_isLoadingAnnouncements) {
      return const Center(child: CircularProgressIndicator(color: AppColors.genieTeal));
    }

    if (_announcementsError != null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.cloud_off_rounded, size: 48, color: Colors.grey),
              const SizedBox(height: 12),
              Text(_announcementsError!, style: const TextStyle(fontWeight: FontWeight.w600)),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                onPressed: _loadAnnouncements,
                icon: const Icon(Icons.refresh, size: 18),
                label: const Text('Retry'),
                style: ElevatedButton.styleFrom(backgroundColor: AppColors.genieTeal, foregroundColor: Colors.white),
              )
            ],
          ),
        ),
      );
    }

    if (_announcements.isEmpty) {
      return RefreshIndicator(
        onRefresh: _loadAnnouncements,
        color: AppColors.genieTeal,
        child: ListView(
          padding: const EdgeInsets.all(32),
          children: [
            const SizedBox(height: 60),
            Icon(Icons.campaign_outlined, size: 64, color: Colors.grey.withValues(alpha: 0.5)),
            const SizedBox(height: 16),
            const Text(
              'No community updates yet',
              textAlign: TextAlign.center,
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            const SizedBox(height: 8),
            Text(
              'Local neighborhood stores post daily updates, fresh stock alerts, and news here.',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.grey[600], fontSize: 13),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: _loadAnnouncements,
      color: AppColors.genieTeal,
      child: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: _announcements.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, idx) {
          final item = _announcements[idx];
          return Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: isDark ? AppColors.darkSurface : Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: isDark ? AppColors.darkBorder : const Color(0xFFE2E8F0),
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      width: 36,
                      height: 36,
                      decoration: BoxDecoration(
                        color: AppColors.genieTeal.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      alignment: Alignment.center,
                      child: const Text('📢', style: TextStyle(fontSize: 18)),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            item.storeName,
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                          ),
                          Text(
                            item.date,
                            style: TextStyle(fontSize: 11, color: Colors.grey[500]),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: AppColors.feedBlue.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text(
                        item.status,
                        style: const TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: AppColors.feedBlue,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Text(
                  item.title,
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                ),
                const SizedBox(height: 6),
                Text(
                  item.content,
                  style: TextStyle(fontSize: 13, color: theme.colorScheme.onSurface.withValues(alpha: 0.75)),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildOffersTab(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    if (_isLoadingOffers) {
      return const Center(child: CircularProgressIndicator(color: AppColors.genieTeal));
    }

    if (_offersError != null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.cloud_off_rounded, size: 48, color: Colors.grey),
              const SizedBox(height: 12),
              Text(_offersError!, style: const TextStyle(fontWeight: FontWeight.w600)),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                onPressed: _loadOffers,
                icon: const Icon(Icons.refresh, size: 18),
                label: const Text('Retry'),
                style: ElevatedButton.styleFrom(backgroundColor: AppColors.genieTeal, foregroundColor: Colors.white),
              )
            ],
          ),
        ),
      );
    }

    if (_offers.isEmpty) {
      return RefreshIndicator(
        onRefresh: _loadOffers,
        color: AppColors.genieTeal,
        child: ListView(
          padding: const EdgeInsets.all(32),
          children: [
            const SizedBox(height: 60),
            Icon(Icons.local_offer_outlined, size: 64, color: Colors.grey.withValues(alpha: 0.5)),
            const SizedBox(height: 16),
            const Text(
              'No active flash deals',
              textAlign: TextAlign.center,
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            const SizedBox(height: 8),
            Text(
              'Check back soon! Neighborhood stores regularly publish discounts and bundle specials.',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.grey[600], fontSize: 13),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: _loadOffers,
      color: AppColors.genieTeal,
      child: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: _offers.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, idx) {
          final offer = _offers[idx];
          return Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: isDark ? AppColors.darkSurface : Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: isDark ? AppColors.darkBorder : const Color(0xFFE2E8F0),
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppColors.offerEmerald.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        offer.discount,
                        style: const TextStyle(
                          color: AppColors.offerEmerald,
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                        ),
                      ),
                    ),
                    Text(
                      offer.validTill,
                      style: TextStyle(fontSize: 11, color: Colors.grey[500]),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Text(
                  offer.title,
                  style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 4),
                Text(
                  offer.description,
                  style: TextStyle(fontSize: 12, color: theme.colorScheme.onSurface.withValues(alpha: 0.7)),
                ),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '🏪 ${offer.storeName}',
                      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.genieTeal),
                    ),
                    InkWell(
                      onTap: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('Offer code ${offer.code} active for ${offer.storeName}!'),
                            backgroundColor: AppColors.genieTeal,
                            duration: const Duration(seconds: 2),
                          ),
                        );
                      },
                      borderRadius: BorderRadius.circular(8),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          border: Border.all(color: AppColors.genieTeal, style: BorderStyle.solid),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.check_circle_outline_rounded, size: 12, color: AppColors.genieTeal),
                            const SizedBox(width: 4),
                            Text(
                              offer.code,
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 11,
                                color: AppColors.genieTeal,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildFollowingTab(BuildContext context) {
    final followingStores = ShopService.sampleStores.where((s) => s.isFollowing).toList();

    if (followingStores.isEmpty) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.all(24),
          child: Text(
            'No shops followed yet. Tap the heart icon on any store to follow and receive notifications!',
            textAlign: TextAlign.center,
            style: TextStyle(color: Colors.grey),
          ),
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: followingStores.length,
      itemBuilder: (context, idx) {
        final store = followingStores[idx];
        return Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: StoreCard(
            store: store,
            onTap: () => widget.onSelectStore(store),
          ),
        );
      },
    );
  }
}
