import 'package:flutter/material.dart';
import '../models/cart_item.dart';
import '../theme/app_colors.dart';

class BagScreen extends StatelessWidget {
  final List<CartItem> cartItems;
  final Function(CartItem) onIncrement;
  final Function(CartItem) onDecrement;
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

  double get subtotal =>
      cartItems.fold(0.0, (sum, item) => sum + item.totalPrice);
  double get tax => subtotal * 0.05;
  double get discount => subtotal > 10 ? 1.50 : 0.0;
  double get grandTotal => (subtotal + tax - discount).clamp(0.0, 99999.0);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    if (cartItems.isEmpty) {
      return Scaffold(
        backgroundColor: theme.scaffoldBackgroundColor,
        appBar: AppBar(
          title: const Text(
            'Self-Scan Bag',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
          ),
        ),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(32),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text('🛍️', style: TextStyle(fontSize: 64)),
                const SizedBox(height: 16),
                const Text(
                  'Your Bag is Empty',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                Text(
                  'Walk into any Genie-enabled store and scan product barcodes directly from the shelves.',
                  textAlign: TextAlign.Center,
                  style: TextStyle(
                    color: theme.colorScheme.onSurface.withOpacity(0.6),
                    fontSize: 14,
                  ),
                ),
                const SizedBox(height: 24),
                ElevatedButton.icon(
                  onPressed: onGoToScan,
                  icon: const Icon(Icons.qr_code_scanner),
                  label: const Text('Start Scanning'),
                ),
              ],
            ),
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        title: const Text(
          'Express Checkout Bag',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
        ),
        actions: [
          TextButton(
            onPressed: onClearCart,
            child: const Text('Clear', style: TextStyle(color: Colors.redAccent)),
          ),
        ],
      ),
      body: Column(
        children: [
          // Store banner
          Container(
            color: AppColors.genieTeal.withOpacity(0.1),
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            child: const Row(
              children: [
                Icon(Icons.verified, color: AppColors.genieTeal, size: 18),
                SizedBox(width: 8),
                Text(
                  'GreenLeaf Organic Grocers · In-Store Session',
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 12,
                    color: AppColors.genieTeal,
                  ),
                ),
              ],
            ),
          ),

          // Items list
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: cartItems.length,
              separatorBuilder: (_, __) => const SizedBox(height: 10),
              itemBuilder: (context, index) {
                final item = cartItems[index];
                return Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: theme.colorScheme.surface,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: theme.colorScheme.outline.withOpacity(0.3),
                    ),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 48,
                        height: 48,
                        decoration: BoxDecoration(
                          color: AppColors.genieTeal.withOpacity(0.08),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        alignment: Alignment.center,
                        child: Text(item.emoji, style: const TextStyle(fontSize: 24)),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              item.name,
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 13,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 2),
                            Text(
                              '\$${item.price.toStringAsFixed(2)} each',
                              style: TextStyle(
                                color: theme.colorScheme.onSurface.withOpacity(0.55),
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                      ),
                      // Quantity controls
                      Row(
                        children: [
                          IconButton(
                            icon: const Icon(Icons.remove_circle_outline, size: 20),
                            onPressed: () => onDecrement(item),
                            color: theme.colorScheme.onSurface.withOpacity(0.7),
                          ),
                          Text(
                            '${item.quantity}',
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                          ),
                          IconButton(
                            icon: const Icon(Icons.add_circle_outline, size: 20),
                            onPressed: () => onIncrement(item),
                            color: AppColors.genieTeal,
                          ),
                        ],
                      ),
                      const SizedBox(width: 6),
                      Text(
                        '\$${item.totalPrice.toStringAsFixed(2)}',
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),

          // Bill Summary & Checkout Button
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: theme.colorScheme.surface,
              borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 10,
                  offset: const Offset(0, -4),
                ),
              ],
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Subtotal',
                      style: TextStyle(color: theme.colorScheme.onSurface.withOpacity(0.7)),
                    ),
                    Text('\$${subtotal.toStringAsFixed(2)}'),
                  ],
                ),
                const SizedBox(height: 6),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Neighbourhood Discount',
                      style: TextStyle(color: AppColors.genieTeal),
                    ),
                    Text('-\$${discount.toStringAsFixed(2)}', style: const TextStyle(color: AppColors.genieTeal, fontWeight: FontWeight.bold)),
                  ],
                ),
                const SizedBox(height: 6),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Estimated Tax (5%)',
                      style: TextStyle(color: theme.colorScheme.onSurface.withOpacity(0.7)),
                    ),
                    Text('\$${tax.toStringAsFixed(2)}'),
                  ],
                ),
                const Divider(height: 20),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Total to Pay',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                    Text(
                      '\$${grandTotal.toStringAsFixed(2)}',
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w800,
                        color: AppColors.genieTeal,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  height: 52,
                  child: ElevatedButton(
                    onPressed: () {
                      _showExitPass(context);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.genieTeal,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    ),
                    child: const Text(
                      'Pay & Generate Gate Exit Pass',
                      style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _showExitPass(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: const Row(
          children: [
            Text('✨', style: TextStyle(fontSize: 24)),
            SizedBox(width: 8),
            Text('Payment Complete!'),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.black12),
              ),
              child: const Column(
                children: [
                  Icon(Icons.qr_code, size: 140, color: Colors.black87),
                  SizedBox(height: 8),
                  Text(
                    'GENIE-PASS-892401',
                    style: TextStyle(
                      fontFamily: 'monospace',
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                      color: Colors.black87,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 14),
            const Text(
              'Show this digital exit pass at the security sensor as you walk out.',
              textAlign: TextAlign.Center,
              style: TextStyle(fontSize: 12),
            ),
          ],
        ),
        actions: [
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              onClearCart();
            },
            child: const Text('Done'),
          ),
        ],
      ),
    );
  }
}
