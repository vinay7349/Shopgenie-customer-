import 'package:flutter/material.dart';
import '../models/product.dart';
import '../models/smart_bag_item.dart';
import '../services/product_recognition_service.dart';
import '../services/shop_service.dart';
import '../theme/app_colors.dart';
import '../widgets/ai_detection_overlay.dart';
import '../widgets/product_result_card.dart';

class ScanScreen extends StatefulWidget {
  final Function(SmartBagItem) onProductScanned;
  final VoidCallback? onGoToBag;

  const ScanScreen({
    super.key,
    required this.onProductScanned,
    this.onGoToBag,
  });

  @override
  State<ScanScreen> createState() => _ScanScreenState();
}

class _ScanScreenState extends State<ScanScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _scanController;
  bool _torchOn = false;
  RecognitionStatus _currentStatus = RecognitionStatus.idle;
  Product? _detectedProduct;
  String? _errorMessage;
  final TextEditingController _manualSearchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _scanController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2000),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _scanController.dispose();
    _manualSearchController.dispose();
    super.dispose();
  }

  Future<void> _analyzeProduct({
    String? productId,
    bool forceLowConfidence = false,
    bool forceMultiple = false,
    bool forceNotRecognized = false,
    bool forceNetworkError = false,
    bool forcePermission = false,
  }) async {
    setState(() {
      _currentStatus = RecognitionStatus.analyzing;
      _detectedProduct = null;
      _errorMessage = null;
    });

    final result = await ProductRecognitionService.recognizeProduct(
      simulatedProductId: productId,
      forceLowConfidence: forceLowConfidence,
      forceMultiple: forceMultiple,
      forceError: forceNotRecognized,
      forceNetworkError: forceNetworkError,
      forcePermissionDenied: forcePermission,
    );

    if (!mounted) return;

    setState(() {
      _currentStatus = result.status;
      _detectedProduct = result.product;
      _errorMessage = result.errorMessage;
    });
  }

  void _handleAddToSmartBag(Product product) {
    final bagItem = SmartBagItem.fromProduct(product, quantity: 1);
    widget.onProductScanned(bagItem);

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Text(product.emoji, style: const TextStyle(fontSize: 20)),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                'Added ${product.name} to Smart Bag (₹${product.price.toStringAsFixed(0)})',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
        backgroundColor: AppColors.genieTeal,
        duration: const Duration(seconds: 2),
        action: widget.onGoToBag != null
            ? SnackBarAction(
                label: 'VIEW BAG',
                textColor: AppColors.sparkAmber,
                onPressed: widget.onGoToBag!,
              )
            : null,
      ),
    );

    setState(() {
      _detectedProduct = null;
      _currentStatus = RecognitionStatus.idle;
    });
  }

  void _showManualSearchDialog() {
    showDialog(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          backgroundColor: const Color(0xFF141C1A),
          title: const Row(
            children: [
              Icon(Icons.search_rounded, color: AppColors.genieTealDark),
              SizedBox(width: 8),
              Text('Search Product Manually', style: TextStyle(fontSize: 16, color: Colors.white)),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                'Enter product brand or keyword to identify from your local store catalog.',
                style: TextStyle(fontSize: 12, color: Colors.white70),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _manualSearchController,
                autofocus: true,
                style: const TextStyle(color: Colors.white),
                decoration: InputDecoration(
                  hintText: 'e.g. Coca-Cola, Lay\'s, Amul',
                  hintStyle: const TextStyle(color: Colors.white38),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  prefixIcon: const Icon(Icons.search, color: Colors.white60),
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Cancel', style: TextStyle(color: Colors.white60)),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: AppColors.genieTeal),
              onPressed: () {
                final query = _manualSearchController.text.trim().toLowerCase();
                Navigator.pop(ctx);
                final match = ShopService.sampleRecognizedProducts.firstWhere(
                  (p) => p.name.toLowerCase().contains(query) || p.brand.toLowerCase().contains(query),
                  orElse: () => ShopService.sampleRecognizedProducts.first,
                );
                _analyzeProduct(productId: match.id);
                _manualSearchController.clear();
              },
              child: const Text('Find Product', style: TextStyle(color: Colors.white)),
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
        child: Stack(
          children: [
            Column(
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
                          color: AppColors.aiViolet.withValues(alpha: 0.25),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: AppColors.aiViolet.withValues(alpha: 0.5)),
                        ),
                        child: const Row(
                          children: [
                            Icon(Icons.auto_awesome, color: AppColors.sparkAmber, size: 16),
                            SizedBox(width: 6),
                            Text(
                              'AI Product Scan',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 0.3,
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
                            onPressed: _showManualSearchDialog,
                            icon: const Icon(Icons.search_rounded, color: Colors.white),
                            tooltip: 'Search product manually',
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                // Subtitle Instruction
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 20),
                  child: Text(
                    'Point your camera at a product and let AI identify it instantly.',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: Colors.white70,
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
                const SizedBox(height: 10),

                // Camera Viewfinder Box with AI Product Detection Overlay
                Expanded(
                  flex: 4,
                  child: AiDetectionOverlay(
                    scanController: _scanController,
                    status: _currentStatus,
                    detectedProduct: _detectedProduct,
                    confidence: _detectedProduct?.confidence ?? 0.0,
                    errorMessage: _errorMessage,
                    onRetry: () => _analyzeProduct(productId: '101'),
                    onManualSearch: _showManualSearchDialog,
                  ),
                ),

                // Bottom Simulation Controls & Sample Product Triggers
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
                              'TAP TO SIMULATE AI PRODUCT SCAN',
                              style: TextStyle(
                                color: Colors.white70,
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 0.8,
                              ),
                            ),
                            PopupMenuButton<String>(
                              icon: const Icon(Icons.tune_rounded, size: 16, color: AppColors.genieTealDark),
                              tooltip: 'Test AI Scenarios',
                              color: const Color(0xFF1E2825),
                              onSelected: (val) {
                                switch (val) {
                                  case 'low':
                                    _analyzeProduct(forceLowConfidence: true);
                                    break;
                                  case 'multiple':
                                    _analyzeProduct(forceMultiple: true);
                                    break;
                                  case 'unrecognized':
                                    _analyzeProduct(forceNotRecognized: true);
                                    break;
                                  case 'network':
                                    _analyzeProduct(forceNetworkError: true);
                                    break;
                                  case 'permission':
                                    _analyzeProduct(forcePermission: true);
                                    break;
                                }
                              },
                              itemBuilder: (ctx) => [
                                const PopupMenuItem(
                                  value: 'low',
                                  child: Text('Test Low Confidence', style: TextStyle(color: Colors.white, fontSize: 12)),
                                ),
                                const PopupMenuItem(
                                  value: 'multiple',
                                  child: Text('Test Multiple Products', style: TextStyle(color: Colors.white, fontSize: 12)),
                                ),
                                const PopupMenuItem(
                                  value: 'unrecognized',
                                  child: Text('Test Not Recognized', style: TextStyle(color: Colors.white, fontSize: 12)),
                                ),
                                const PopupMenuItem(
                                  value: 'network',
                                  child: Text('Test Network Error', style: TextStyle(color: Colors.white, fontSize: 12)),
                                ),
                                const PopupMenuItem(
                                  value: 'permission',
                                  child: Text('Test Permission Denied', style: TextStyle(color: Colors.white, fontSize: 12)),
                                ),
                              ],
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),

                        // Quick AI sample recognition targets
                        Expanded(
                          child: GridView.builder(
                            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                              crossAxisCount: 2,
                              childAspectRatio: 2.5,
                              crossAxisSpacing: 8,
                              mainAxisSpacing: 8,
                            ),
                            itemCount: ShopService.sampleRecognizedProducts.take(4).length,
                            itemBuilder: (context, idx) {
                              final product = ShopService.sampleRecognizedProducts[idx];
                              return InkWell(
                                onTap: () => _analyzeProduct(productId: product.id),
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
                                              '₹${product.price.toStringAsFixed(0)} · ${(product.confidence * 100).round()}%',
                                              style: const TextStyle(
                                                color: AppColors.sparkAmber,
                                                fontSize: 10,
                                                fontWeight: FontWeight.w600,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                      const Icon(
                                        Icons.auto_awesome,
                                        color: AppColors.genieTealDark,
                                        size: 16,
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

            // Bottom Result Card Overlay when AI identifies a product
            if (_detectedProduct != null && _currentStatus == RecognitionStatus.success)
              Positioned(
                bottom: 0,
                left: 0,
                right: 0,
                child: ProductResultCard(
                  product: _detectedProduct!,
                  onAddToSmartBag: () => _handleAddToSmartBag(_detectedProduct!),
                  onDismiss: () {
                    setState(() {
                      _detectedProduct = null;
                      _currentStatus = RecognitionStatus.idle;
                    });
                  },
                ),
              ),
          ],
        ),
      ),
    );
  }
}
