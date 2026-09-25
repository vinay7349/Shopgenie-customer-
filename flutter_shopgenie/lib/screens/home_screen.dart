import 'package:flutter/material.dart';
import '../models/store_item.dart';
import '../services/shop_service.dart';
import '../theme/app_colors.dart';
import '../widgets/promo_banner.dart';
import '../widgets/store_card.dart';

class HomeScreen extends StatefulWidget {
  final Function(StoreItem) onSelectStore;
  final VoidCallback onOpenScanner;

  const HomeScreen({
    super.key,
    required this.onSelectStore,
    required this.onOpenScanner,
  });

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String _searchQuery = '';
  String _selectedCategory = 'All';
  final TextEditingController _searchController = TextEditingController();

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    final filteredStores = ShopService.filterStores(
      query: _searchQuery,
      category: _selectedCategory,
    );

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      body: SafeArea(
        child: Column(
          children: [
            // Sticky Location Header & Search Bar
            Container(
              color: theme.colorScheme.surface,
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Address & Genie Verified Badge
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'DELIVERING TO / SHOPPING AT',
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              color: theme.colorScheme.onSurface.withOpacity(0.5),
                              letterSpacing: 0.8,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Row(
                            children: [
                              Text(
                                '📍 Koramangala 4th Block',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 15,
                                  color: theme.colorScheme.onSurface,
                                ),
                              ),
                              const SizedBox(width: 4),
                              const Text(
                                '▾',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: AppColors.genieTeal,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),

                      // Genie Verified Chip
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        decoration: BoxDecoration(
                          color: AppColors.genieTeal.withOpacity(0.12),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Text(
                          '✨ Genie Verified',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: AppColors.genieTeal,
                          ),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 12),

                  // Search Text Field
                  TextField(
                    controller: _searchController,
                    onChanged: (val) {
                      setState(() {
                        _searchQuery = val;
                      });
                    },
                    decoration: InputDecoration(
                      hintText: 'Search groceries, fresh bakes, medicines...',
                      hintStyle: TextStyle(
                        fontSize: 13,
                        color: theme.colorScheme.onSurface.withOpacity(0.45),
                      ),
                      prefixIcon: Icon(
                        Icons.search,
                        color: theme.colorScheme.onSurface.withOpacity(0.5),
                        size: 20,
                      ),
                      suffixIcon: _searchQuery.isNotEmpty
                          ? IconButton(
                              icon: const Icon(Icons.clear, size: 18),
                              onPressed: () {
                                _searchController.clear();
                                setState(() {
                                  _searchQuery = '';
                                });
                              },
                            )
                          : null,
                    ),
                  ),
                ],
              ),
            ),

            // Horizontal Categories Scroll
            Container(
              height: 52,
              padding: const EdgeInsets.symmetric(vertical: 8),
              child: ListView.separated(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                scrollDirection: Axis.horizontal,
                itemCount: ShopService.categories.length,
                separatorBuilder: (_, __) => const SizedBox(width: 8),
                itemBuilder: (context, index) {
                  final cat = ShopService.categories[index];
                  final isSelected = _selectedCategory == cat;

                  return GestureDetector(
                    onTap: () {
                      setState(() {
                        _selectedCategory = cat;
                      });
                    },
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                      decoration: BoxDecoration(
                        color: isSelected
                            ? AppColors.genieTeal
                            : theme.colorScheme.surface,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.Border.all(
                          color: isSelected
                              ? AppColors.genieTeal
                              : isDark
                                  ? AppColors.darkBorder
                                  : AppColors.lightBorder,
                          width: 1,
                        ),
                      ),
                      alignment: Alignment.center,
                      child: Text(
                        cat,
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                          color: isSelected
                              ? Colors.white
                              : theme.colorScheme.onSurface,
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),

            // Scrollable Content
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                children: [
                  // Promotional Deal Banner
                  PromoBanner(
                    onTap: widget.onOpenScanner,
                  ),

                  const SizedBox(height: 16),

                  // Section Title & Shop Count
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Verified Nearby Stores',
                        style: theme.textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                          color: theme.colorScheme.onSurface,
                        ),
                      ),
                      Text(
                        '${filteredStores.length} shops',
                        style: const TextStyle(
                          fontSize: 12,
                          color: AppColors.genieTeal,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 10),

                  // Store Cards
                  if (filteredStores.isEmpty)
                    Padding(
                      padding: const EdgeInsets.all(32),
                      child: Center(
                        child: Column(
                          children: [
                            const Text('🔍', style: TextStyle(fontSize: 40)),
                            const SizedBox(height: 12),
                            Text(
                              'No stores found for "$_searchQuery"',
                              style: TextStyle(
                                color: theme.colorScheme.onSurface.withOpacity(0.6),
                                fontSize: 14,
                              ),
                            ),
                          ],
                        ),
                      ),
                    )
                  else
                    ...filteredStores.map(
                      (store) => StoreCard(
                        store: store,
                        onTap: () => widget.onSelectStore(store),
                      ),
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
