import 'package:flutter/material.dart';
import '../models/cart_item.dart';
import '../models/product_item.dart';
import '../services/shop_service.dart';
import '../theme/app_colors.dart';

class ScanScreen extends StatefulWidget {
  final Function(CartItem) onProductScanned;
  final VoidCallback? onGoToCart;

  const ScanScreen({
    super.key,
    required this.onProductScanned,
    this.onGoToCart,
  });

  @override
  State<ScanScreen> createState() => _ScanScreenState();
}

class _ScanScreenState extends State<ScanScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _laserController;
  bool _torchOn = false;
  final TextEditingController _manualCodeController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _laserController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1800),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _laserController.dispose();
    _manualCodeController.dispose();
    super.dispose();
  }

  void _handleSimulateScan(ProductItem product) {
    final cartItem = CartItem(
      id: product.id,
      storeId: product.storeId,
      name: product.name,
      price: product.price,
      emoji: product.emoji,
      barcode: product.barcode,
      quantity: 1,
    );

    widget.onProductScanned(cartItem);

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Text(product.emoji, style: const TextStyle(fontSize: 20)),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                'Added ${product.name} to Cart (\$${product.price.toStringAsFixed(2)})',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
        backgroundColor: AppColors.genieTeal,
        duration: const Duration(seconds: 2),
        action: widget.onGoToCart != null
            ? SnackBarAction(
                label: 'VIEW CART',
                textColor: AppColors.sparkAmber,
                onPressed: widget.onGoToCart!,
              )
            : null,
      ),
    );
  }

  void _showManualBarcodeDialog() {
    showDialog(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          title: const Row(
            children: [
              Icon(Icons.keyboard_alt_rounded, color: AppColors.genieTeal),
              SizedBox(width: 8),
              Text('Enter Barcode Manually', style: TextStyle(fontSize: 16)),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                'Type the 13-digit EAN/UPC barcode number printed beneath the product packaging.',
                style: TextStyle(fontSize: 12, color: Colors.grey),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _manualCodeController,
                keyboardType: TextInputType.number,
                autofocus: true,
                decoration: const InputDecoration(
                  hintText: 'e.g. 8901234567890',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.qr_code_2_rounded),
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: AppColors.genieTeal),
              onPressed: () {
                final code = _manualCodeController.text.trim();
                final product = ShopService.findProductByBarcode(code) ??
                    ShopService.sampleProducts.first;
                Navigator.pop(ctx);
                _handleSimulateScan(product);
                _manualCodeController.clear();
              },
              child: const Text('Lookup Product', style: TextStyle(color: Colors.white)),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: SafeArea(
        child: Column(
          children: [
            // Top Camera Controls Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Row(
                      children: [
                        Icon(Icons.camera_alt_rounded, color: Colors.white, size: 16),
                        SizedBox(width: 6),
                        Text(
                          'Self-Checkout Scanner',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Row(
                    children: [
                      IconButton(
                        onPressed: () {
                          setState(() {
                            _torchOn = !_torchOn;
                          });
                        },
                        icon: Icon(
                          _torchOn ? Icons.flash_on_rounded : Icons.flash_off_rounded,
                          color: _torchOn ? AppColors.sparkAmber : Colors.white,
                        ),
                        tooltip: 'Toggle Flashlight',
                      ),
                      IconButton(
                        onPressed: _showManualBarcodeDialog,
                        icon: const Icon(Icons.keyboard_alt_outlined, color: Colors.white),
                        tooltip: 'Enter code manually',
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Camera Viewfinder Box with Laser Animation
            Expanded(
              flex: 4,
              child: Center(
                child: Container(
                  width: 280,
                  height: 280,
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.04),
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(
                      color: _torchOn ? Colors.white70 : Colors.white24,
                      width: 1.5,
                    ),
                  ),
                  child: Stack(
                    children: [
                      // Viewfinder corner marks
                      ..._buildCornerMarkers(),

                      // Animated Laser Sweeping Line
                      AnimatedBuilder(
                        animation: _laserController,
                        builder: (context, child) {
                          return Positioned(
                            top: 24 + (_laserController.value * 230),
                            left: 16,
                            right: 16,
                            child: Container(
                              height: 3,
                              decoration: BoxDecoration(
                                gradient: const LinearGradient(
                                  colors: [
                                    Colors.transparent,
                                    AppColors.sparkAmber,
                                    Colors.redAccent,
                                    AppColors.sparkAmber,
                                    Colors.transparent,
                                  ],
                                ),
                                boxShadow: [
                                  BoxShadow(
                                    color: AppColors.sparkAmber.withValues(alpha: 0.8),
                                    blurRadius: 8,
                                    spreadRadius: 1,
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),

                      // Instruction Overlay
                      Center(
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              Icons.qr_code_scanner_rounded,
                              size: 40,
                              color: Colors.white.withValues(alpha: 0.4),
                            ),
                            const SizedBox(height: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: Colors.black.withValues(alpha: 0.6),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: const Text(
                                'Align Barcode Inside Frame',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),

            // Bottom Simulator Trigger Targets
            Expanded(
              flex: 3,
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: const BoxDecoration(
                  color: Color(0xFF141C1A),
                  borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'TAP AN ITEM TO SIMULATE SCAN',
                          style: TextStyle(
                            color: Colors.white70,
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 0.8,
                          ),
                        ),
                        TextButton.icon(
                          onPressed: _showManualBarcodeDialog,
                          icon: const Icon(Icons.pin_rounded, size: 14, color: AppColors.genieTealDark),
                          label: const Text(
                            'Manual Code',
                            style: TextStyle(fontSize: 11, color: AppColors.genieTealDark),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),

                    // Quick barcode scan grid
                    Expanded(
                      child: GridView.builder(
                        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          childAspectRatio: 2.6,
                          crossAxisSpacing: 8,
                          mainAxisSpacing: 8,
                        ),
                        itemCount: ShopService.sampleProducts.take(4).length,
                        itemBuilder: (context, idx) {
                          final product = ShopService.sampleProducts[idx];
                          return InkWell(
                            onTap: () => _handleSimulateScan(product),
                            borderRadius: BorderRadius.circular(12),
                            child: Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: const Color(0xFF1E2825),
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(
                                  color: Colors.white.withValues(alpha: 0.08),
                                ),
                              ),
                              child: Row(
                                children: [
                                  Text(product.emoji, style: const TextStyle(fontSize: 22)),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      mainAxisAlignment: MainAxisAlignment.center,
                                      children: [
                                        Text(
                                          product.name,
                                          style: const TextStyle(
                                            color: Colors.white,
                                            fontSize: 11,
                                            fontWeight: FontWeight.bold,
                                          ),
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                        Text(
                                          '\$${product.price.toStringAsFixed(2)}',
                                          style: const TextStyle(
                                            color: AppColors.sparkAmber,
                                            fontSize: 11,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  const Icon(
                                    Icons.add_circle_outline_rounded,
                                    color: AppColors.genieTealDark,
                                    size: 18,
                                  ),
                                ],
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
      ),
    );
  }

  List<Widget> _buildCornerMarkers() {
    const size = 24.0;
    const thickness = 4.0;
    const color = AppColors.sparkAmber;

    return [
      // Top Left
      Positioned(
        top: 0,
        left: 0,
        child: Container(
          width: size,
          height: thickness,
          decoration: const BoxDecoration(
            color: color,
            borderRadius: BorderRadius.only(topLeft: Radius.circular(8)),
          ),
        ),
      ),
      Positioned(
        top: 0,
        left: 0,
        child: Container(
          width: thickness,
          height: size,
          decoration: const BoxDecoration(
            color: color,
            borderRadius: BorderRadius.only(topLeft: Radius.circular(8)),
          ),
        ),
      ),
      // Top Right
      Positioned(
        top: 0,
        right: 0,
        child: Container(
          width: size,
          height: thickness,
          decoration: const BoxDecoration(
            color: color,
            borderRadius: BorderRadius.only(topRight: Radius.circular(8)),
          ),
        ),
      ),
      Positioned(
        top: 0,
        right: 0,
        child: Container(
          width: thickness,
          height: size,
          decoration: const BoxDecoration(
            color: color,
            borderRadius: BorderRadius.only(topRight: Radius.circular(8)),
          ),
        ),
      ),
      // Bottom Left
      Positioned(
        bottom: 0,
        left: 0,
        child: Container(
          width: size,
          height: thickness,
          decoration: const BoxDecoration(
            color: color,
            borderRadius: BorderRadius.only(bottomLeft: Radius.circular(8)),
          ),
        ),
      ),
      Positioned(
        bottom: 0,
        left: 0,
        child: Container(
          width: thickness,
          height: size,
          decoration: const BoxDecoration(
            color: color,
            borderRadius: BorderRadius.only(bottomLeft: Radius.circular(8)),
          ),
        ),
      ),
      // Bottom Right
      Positioned(
        bottom: 0,
        right: 0,
        child: Container(
          width: size,
          height: thickness,
          decoration: const BoxDecoration(
            color: color,
            borderRadius: BorderRadius.only(bottomRight: Radius.circular(8)),
          ),
        ),
      ),
      Positioned(
        bottom: 0,
        right: 0,
        child: Container(
          width: thickness,
          height: size,
          decoration: const BoxDecoration(
            color: color,
            borderRadius: BorderRadius.only(bottomRight: Radius.circular(8)),
          ),
        ),
      ),
    ];
  }
}
