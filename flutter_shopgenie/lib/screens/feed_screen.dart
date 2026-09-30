import 'package:flutter/material.dart';
import '../models/store_item.dart';
import '../services/shop_service.dart';
import '../theme/app_colors.dart';
import '../widgets/store_card.dart';

class FeedScreen extends StatefulWidget {
  final int initialTabIndex; // 0: Feed, 1: Offers, 2: Following
  final Function(StoreItem) onSelectStore;

  const FeedScreen({
    super.key,
    this.initialTabIndex = 0,
    required this.onSelectStore,
  });

  @override
  State<FeedScreen> createState() => _FeedScreenState();
}

class _FeedScreenState extends State<FeedScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(
      length: 3,
      vsync: this,
      initialIndex: widget.initialTabIndex.clamp(0, 2),
    );
  }

  @override
  void dispose() {
    _tabController.dispose();
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
            Tab(text: '📰 Local Feed'),
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

    final feedPosts = [
      {
        'store': 'The Daily Crust Bakery',
        'emoji': '🥐',
        'time': '15 mins ago',
        'title': 'Fresh batch of Almond Croissants just out of oven! 🔥',
        'content': 'Baked with 100% French butter. Pair with a flat white espresso today. Grab yours before 1 PM.',
        'badge': 'Fresh Batch Alert',
        'likes': 42,
      },
      {
        'store': 'GreenLeaf Organic Grocers',
        'emoji': '🥦',
        'time': '1 hour ago',
        'title': 'New season Alphonso Mangoes & avocados arrived',
        'content': 'Sourced directly from Ratnagiri organic orchards. Zero chemical ripening, sweet aroma guaranteed.',
        'badge': 'Farm Direct',
        'likes': 88,
      },
      {
        'store': 'Apex Digital Hub',
        'emoji': '🎧',
        'time': '3 hours ago',
        'title': 'Demo units available for ANC wireless headphones',
        'content': 'Walk in and experience 40dB active noise cancellation before buying. Extra 10% off for Genie users.',
        'badge': 'In-Store Demo',
        'likes': 29,
      },
    ];

    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: feedPosts.length,
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemBuilder: (context, idx) {
        final post = feedPosts[idx];
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
                      color: AppColors.genieTeal.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    alignment: Alignment.center,
                    child: Text(post['emoji'] as String, style: const TextStyle(fontSize: 18)),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          post['store'] as String,
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                        ),
                        Text(
                          post['time'] as String,
                          style: TextStyle(fontSize: 11, color: Colors.grey[500]),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: AppColors.feedBlue.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Text(
                      post['badge'] as String,
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
                post['title'] as String,
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
              ),
              const SizedBox(height: 6),
              Text(
                post['content'] as String,
                style: TextStyle(fontSize: 13, color: theme.colorScheme.onSurface.withOpacity(0.75)),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Icon(Icons.favorite_rounded, size: 16, color: Colors.rose[400] ?? Colors.red),
                  const SizedBox(width: 4),
                  Text('${post['likes']} Neighbours liked this', style: const TextStyle(fontSize: 11, color: Colors.grey)),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildOffersTab(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: ShopService.sampleOffers.length,
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemBuilder: (context, idx) {
        final offer = ShopService.sampleOffers[idx];
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
                      color: AppColors.offerEmerald.withOpacity(0.12),
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
                style: TextStyle(fontSize: 12, color: theme.colorScheme.onSurface.withOpacity(0.7)),
              ),
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    '📍 ${offer.storeName}',
                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.genieTeal),
                  ),
                  InkWell(
                    onTap: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('Promo code ${offer.code} copied!'),
                          backgroundColor: AppColors.genieTeal,
                          duration: const Duration(seconds: 1),
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
                          const Icon(Icons.copy_rounded, size: 12, color: AppColors.genieTeal),
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
    );
  }

  Widget _buildFollowingTab(BuildContext context) {
    final followingStores = ShopService.sampleStores.where((s) => s.isFollowing).toList();

    if (followingStores.isEmpty) {
      return const Center(
        child: Text('No shops followed yet. Tap the heart icon on any store to follow!'),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: followingStores.length,
      itemBuilder: (context, idx) {
        final store = followingStores[idx];
        return StoreCard(
          store: store,
          onTap: () => widget.onSelectStore(store),
        );
      },
    );
  }
}
