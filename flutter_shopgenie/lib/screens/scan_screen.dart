import 'package:flutter/material.dart';
import '../models/cart_item.dart';
import '../theme/app_colors.dart';

class ScanScreen extends StatefulWidget {
  final Function(CartItem) onProductScanned;

  const ScanScreen({super.key, required this.onProductScanned});

  @override
  State<ScanScreen> createState() => _ScanScreenState();
}

class _ScanScreenState extends State<ScanScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _laserController;
  late Animation<double> _laserAnimation;
  String _selectedStoreName = 'GreenLeaf Organic Grocers';

  final List<CartItem> _demoProducts = [
    CartItem(
      id: 'p1',
      storeId: '1',
      name: 'Organic Hass Avocado (2 pack)',
      price: 3.49,
      emoji: '🥑',
      barcode: '8901234567890',
    ),
    CartItem(
      id: 'p2',
      storeId: '1',
      name: 'Farm Fresh Almond Milk 1L',
      price: 2.89,
      emoji: '🥛',
      barcode: '8901234567891',
    ),
    CartItem(
      id: 'p3',
      storeId: '2',
      name: 'Butter Croissant (Artisan)',
      price: 2.50,
      emoji: '🥐',
      barcode: '8901234567892',
    ),
    CartItem(
      id: 'p4',
      storeId: '3',
      name: 'Vitamin C 1000mg Effervescent',
      price: 5.99,
      emoji: '💊',
      barcode: '8901234567893',
    ),
  ];

  @override
  void initState() {
    super.initState();
    _laserController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1800),
    )..repeat(reverse: true);

    _laserAnimation = Tween<double>(begin: 0.15, end: 0.85).animate(
      CurvedAnimation(parent: _laserController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _laserController.dispose();
    super.dispose();
  }

  void _simulateScan(CartItem item) {
    widget.onProductScanned(item);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Text(item.emoji, style: const TextStyle(fontSize: 20)),
            const SizedBox(width: 8),
            Expanded(
              child: Text(
                'Added ${item.name} (\$${item.price.toStringAsFixed(2)})',
                style: const TextStyle(fontWeight: FontWeight.w600),
              ),
            ),
          ],
        ),
        backgroundColor: AppColors.genieTeal,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        duration: const Duration(seconds: 2),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.black,
        foregroundColor: Colors.white,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Scan & Go Self-Checkout',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            Text(
              'Inside: $_selectedStoreName',
              style: TextStyle(
                fontSize: 11,
                color: Colors.white.withOpacity(0.7),
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.flash_on, color: AppColors.sparkAmber),
            onPressed: () {},
            tooltip: 'Toggle Flash',
          ),
        ],
      ),
      body: Column(
        children: [
          // Viewfinder Area
          Expanded(
            flex: 3,
            child: Stack(
              alignment: Alignment.center,
              children: [
                // Simulated Camera Feed Background
                Container(
                  color: const Color(0xFF151918),
                  child: Center(
                    child: Icon(
                      Icons.barcode_reader,
                      size: 96,
                      color: Colors.white.withOpacity(0.08),
                    ),
                  ),
                ),

                // Reticle Retaining Box
                Container(
                  width: 260,
                  height: 200,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: AppColors.genieTealDark.withOpacity(0.8),
                      width: 2.5,
                    ),
                  ),
                ),

                // Animated Laser Line
                AnimatedBuilder(
                  animation: _laserAnimation,
                  builder: (context, child) {
                    return Positioned(
                      top: 40 + (_laserAnimation.value * 180),
                      left: 70,
                      right: 70,
                      child: Container(
                        height: 2.5,
                        decoration: BoxDecoration(
                          color: AppColors.sparkAmber,
                          boxShadow: [
                            BoxShadow(
                              color: AppColors.sparkAmber.withOpacity(0.8),
                              blurRadius: 10,
                              spreadRadius: 2,
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),

                // Guide Prompt
                Positioned(
                  bottom: 24,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      color: Colors.black.withOpacity(0.65),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: Colors.white.withOpacity(0.15)),
                    ),
                    child: const Text(
                      'Align barcode inside the frame to add',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Tap to Quick-Scan Demo Barcodes
          Expanded(
            flex: 2,
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: theme.colorScheme.surface,
                borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        '⚡ Test Aisle Barcodes',
                        style: theme.textTheme.titleSmall?.copyWith(
                          fontWeight: FontWeight.bold,
                          color: AppColors.genieTeal,
                        ),
                      ),
                      const Text(
                        'Tap any item to scan',
                        style: TextStyle(fontSize: 11, color: Colors.grey),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Expanded(
                    child: ListView.separated(
                      itemCount: _demoProducts.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 8),
                      itemBuilder: (context, idx) {
                        final product = _demoProducts[idx];
                        return ListTile(
                          onTap: () => _simulateScan(product),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                            side: BorderSide(
                              color: theme.colorScheme.outline.withOpacity(0.3),
                            ),
                          ),
                          leading: Text(product.emoji, style: const TextStyle(fontSize: 24)),
                          title: Text(
                            product.name,
                            style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
                          ),
                          subtitle: Text(
                            'UPC: ${product.barcode}',
                            style: const TextStyle(fontSize: 11),
                          ),
                          trailing: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppColors.genieTeal.withOpacity(0.12),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              '\$${product.price.toStringAsFixed(2)}',
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                color: AppColors.genieTeal,
                                fontSize: 13,
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
