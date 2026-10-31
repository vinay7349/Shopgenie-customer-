import 'package:flutter/material.dart';

import '../models/smart_bag_item.dart';
import '../services/product_recognition_service.dart';
import '../theme/app_colors.dart';
import '../widgets/ai_detection_overlay.dart';

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
  late final AnimationController _scanController;
  RecognitionStatus _status = RecognitionStatus.unavailable;
  String _message =
      'Product recognition is not available from the connected backend.';

  @override
  void initState() {
    super.initState();
    _scanController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2000),
    )..repeat(reverse: true);
    _loadRecognitionStatus();
  }

  Future<void> _loadRecognitionStatus() async {
    final result = await ProductRecognitionService.recognizeProduct();
    if (!mounted) return;
    setState(() {
      _status = result.status;
      _message = result.errorMessage ?? _message;
    });
  }

  @override
  void dispose() {
    _scanController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              child: Align(
                alignment: Alignment.centerLeft,
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: AppColors.aiViolet.withValues(alpha: 0.25),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: AppColors.aiViolet.withValues(alpha: 0.5),
                    ),
                  ),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        Icons.auto_awesome,
                        color: AppColors.sparkAmber,
                        size: 16,
                      ),
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
              ),
            ),
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 20),
              child: Text(
                'Product scanning will be available when the backend provides recognition support.',
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Colors.white70,
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
            const SizedBox(height: 10),
            Expanded(
              flex: 4,
              child: AiDetectionOverlay(
                scanController: _scanController,
                status: _status,
                errorMessage: _message,
              ),
            ),
            Expanded(
              flex: 3,
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: const BoxDecoration(
                  color: Color(0xFF141C1A),
                  borderRadius: BorderRadius.vertical(
                    top: Radius.circular(24),
                  ),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(
                      Icons.cloud_off_rounded,
                      color: Colors.white54,
                      size: 32,
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      'Recognition service unavailable',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'No products were recognized or added to your bag.',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: Colors.white70, fontSize: 12),
                    ),
                    if (widget.onGoToBag != null) ...[
                      const SizedBox(height: 16),
                      OutlinedButton.icon(
                        onPressed: widget.onGoToBag,
                        icon: const Icon(Icons.shopping_bag_outlined),
                        label: const Text('Open Smart Bag'),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: AppColors.genieTealDark,
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
