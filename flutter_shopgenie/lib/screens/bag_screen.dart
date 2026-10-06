import 'package:flutter/material.dart';
import '../models/smart_bag_item.dart';
import '../theme/app_colors.dart';
import '../widgets/smart_bag_card.dart';

class BagScreen extends StatelessWidget {
  final List<SmartBagItem> cartItems;
  final ValueChanged<SmartBagItem> onIncrement;
  final ValueChanged<SmartBagItem> onDecrement;
  final VoidCallback onClearCart;
  final VoidCallback onGoToScan;

  const BagScreen({
    super.key,
    required this.cartItems,
    required this.onIncrement,
    required this.onDecrement,
    required this.onClearCart,
    required this.onGoToScan,
  });

  double get _estimatedTotal =>
      cartItems.fold(0.0, (sum, item) => sum + item.totalPrice);

  int get _itemCount =>
      cartItems.fold(0, (sum, item) => sum + item.quantity);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBackground : const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: Row(
          children: [
            const Icon(Icons.shopping_bag_outlined, color: AppColors.genieTeal, size: 22),
            const SizedBox(width: 8),
            Text(
              'Smart Bag ($_itemCount)',
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
          ],
        ),
        elevation: 0,
        backgroundColor: isDark ? AppColors.darkSurface : Colors.white,
        actions: [
          if (cartItems.isNotEmpty)
            TextButton.icon(
              onPressed: onClearCart,
              icon: const Icon(Icons.delete_outline_rounded, color: Colors.redAccent, size: 16),
              label: const Text('Clear Bag', style: TextStyle(color: Colors.redAccent, fontSize: 12)),
            ),
        ],
      ),
      body: cartItems.isEmpty
          ? _buildEmptyState(context)
          : Column(
              children: [
                // Smart Bag Purpose Ribbon
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                  color: AppColors.aiViolet.withValues(alpha: 0.08),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(4),
                        decoration: BoxDecoration(
                          color: AppColors.aiViolet.withValues(alpha: 0.15),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.info_outline_rounded, size: 16, color: AppColors.aiViolet),
                      ),
                      const SizedBox(width: 10),
                      const Expanded(
                        child: Text(
                          'A temporary shopping list that helps customers keep track of products they have discovered while shopping.',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w500,
                            color: AppColors.aiVioletDark,
                            height: 1.3,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                // Smart Bag Items List
                Expanded(
                  child: ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: cartItems.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 10),
                    itemBuilder: (context, idx) {
                      final item = cartItems[idx];
                      return SmartBagCard(
                        item: item,
                        onIncrement: () => onIncrement(item),
                        onDecrement: () => onDecrement(item),
                      );
                    },
                  ),
                ),

                // Estimated Total & Actions Container (NO CHECKOUT / NO PAYMENT)
                Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: isDark ? AppColors.darkSurface : Colors.white,
                    borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
                    border: Border(
                      top: BorderSide(
                        color: isDark ? AppColors.darkBorder : const Color(0xFFE2E8F0),
                        width: 1,
                      ),
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.06),
                        blurRadius: 12,
                        offset: const Offset(0, -4),
                      ),
                    ],
                  ),
                  child: SafeArea(
                    top: false,
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        // Estimated Total Row
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Estimated Total',
                                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                                ),
                                Text(
                                  '$_itemCount items selected',
                                  style: TextStyle(
                                    fontSize: 11,
                                    color: theme.colorScheme.onSurface.withValues(alpha: 0.5),
                                  ),
                                ),
                              ],
                            ),
                            Text(
                              '₹${_estimatedTotal.toStringAsFixed(0)}',
                              style: const TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                                color: AppColors.genieTeal,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),

                        // Action Buttons: Continue Scanning & Clear Bag
                        Row(
                          children: [
                            Expanded(
                              flex: 2,
                              child: SizedBox(
                                height: 48,
                                child: ElevatedButton.icon(
                                  onPressed: onGoToScan,
                                  icon: const Icon(Icons.auto_awesome, color: Colors.white, size: 18),
                                  label: const Text(
                                    'Continue Scanning',
                                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                                  ),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: AppColors.genieTeal,
                                    foregroundColor: Colors.white,
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                                    elevation: 2,
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(width: 10),
                            SizedBox(
                              height: 48,
                              child: OutlinedButton.icon(
                                onPressed: onClearCart,
                                icon: const Icon(Icons.clear_all_rounded, size: 18),
                                label: const Text('Clear Bag', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                                style: OutlinedButton.styleFrom(
                                  foregroundColor: Colors.redAccent,
                                  side: const BorderSide(color: Colors.redAccent),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AppColors.genieTeal.withValues(alpha: 0.1),
              ),
              child: const Icon(
                Icons.shopping_bag_outlined,
                size: 40,
                color: AppColors.genieTeal,
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              'Your Smart Bag is empty',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            const Text(
              'A temporary shopping list that helps customers keep track of products they have discovered while shopping.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 12, color: Colors.grey),
            ),
            const SizedBox(height: 20),
            ElevatedButton.icon(
              onPressed: onGoToScan,
              icon: const Icon(Icons.auto_awesome, size: 18),
              label: const Text('Scan Products with AI'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.genieTeal,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
