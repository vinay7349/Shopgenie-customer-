import 'package:flutter/material.dart';
import '../models/product.dart';
import '../services/product_recognition_service.dart';
import '../theme/app_colors.dart';

class AiDetectionOverlay extends StatelessWidget {
  final AnimationController scanController;
  final RecognitionStatus status;
  final Product? detectedProduct;
  final double confidence;
  final String? errorMessage;
  final VoidCallback? onRetry;
  final VoidCallback? onManualSearch;

  const AiDetectionOverlay({
    super.key,
    required this.scanController,
    required this.status,
    this.detectedProduct,
    this.confidence = 0.0,
    this.errorMessage,
    this.onRetry,
    this.onManualSearch,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Container(
        width: 300,
        height: 320,
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.04),
          borderRadius: BorderRadius.circular(28),
          border: Border.all(
            color: _getFrameBorderColor(),
            width: 1.5,
          ),
          boxShadow: [
            BoxShadow(
              color: _getGlowColor().withValues(alpha: 0.15),
              blurRadius: 20,
              spreadRadius: 2,
            ),
          ],
        ),
        child: Stack(
          children: [
            // AI Bounding Box Corner Brackets
            ..._buildAiCornerMarkers(),

            // AI Neural Pulse / Scanning Wave (No barcode line!)
            if (status == RecognitionStatus.analyzing || status == RecognitionStatus.idle)
              AnimatedBuilder(
                animation: scanController,
                builder: (context, child) {
                  return Positioned(
                    top: 24 + (scanController.value * 260),
                    left: 20,
                    right: 20,
                    child: Container(
                      height: 3,
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [
                            Colors.transparent,
                            AppColors.aiViolet,
                            AppColors.genieTealDark,
                            AppColors.aiViolet,
                            Colors.transparent,
                          ],
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.aiViolet.withValues(alpha: 0.8),
                            blurRadius: 10,
                            spreadRadius: 1.5,
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),

            // Center Content: Status messaging, detected product preview or error state
            Center(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: _buildCenterStatus(),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCenterStatus() {
    switch (status) {
      case RecognitionStatus.analyzing:
        return Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.aiViolet.withValues(alpha: 0.18),
                shape: BoxShape.circle,
              ),
              child: const SizedBox(
                width: 28,
                height: 28,
                child: CircularProgressIndicator(
                  strokeWidth: 2.5,
                  valueColor: AlwaysStoppedAnimation<Color>(AppColors.genieTealDark),
                ),
              ),
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
              decoration: BoxDecoration(
                color: Colors.black.withValues(alpha: 0.7),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.aiViolet.withValues(alpha: 0.4)),
              ),
              child: const Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.auto_awesome, color: AppColors.sparkAmber, size: 14),
                  SizedBox(width: 6),
                  Text(
                    'Analyzing product...',
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
          ],
        );

      case RecognitionStatus.success:
        if (detectedProduct == null) return const SizedBox.shrink();
        final confPercent = (detectedProduct!.confidence * 100).round();
        return Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: const Color(0xFF059669).withValues(alpha: 0.25),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFF10B981)),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.check_circle_rounded, color: Color(0xFF34D399), size: 14),
                  const SizedBox(width: 5),
                  Text(
                    'Product detected · $confPercent% confidence',
                    style: const TextStyle(
                      color: Color(0xFF34D399),
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 10),
            Text(
              detectedProduct!.emoji,
              style: const TextStyle(fontSize: 48),
            ),
            const SizedBox(height: 6),
            Text(
              detectedProduct!.name,
              textAlign: TextAlign.center,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 15,
                fontWeight: FontWeight.bold,
              ),
            ),
            Text(
              '${detectedProduct!.brand} · ₹${detectedProduct!.price.toStringAsFixed(0)}',
              style: const TextStyle(
                color: AppColors.sparkAmber,
                fontSize: 12,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        );

      case RecognitionStatus.lowConfidence:
        return Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.warning_amber_rounded, color: AppColors.sparkAmber, size: 36),
            const SizedBox(height: 8),
            const Text(
              'Product recognition confidence is low.',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 4),
            const Text(
              'Please move closer or improve lighting.',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.white70, fontSize: 11),
            ),
            const SizedBox(height: 10),
            if (onRetry != null)
              ElevatedButton.icon(
                onPressed: onRetry,
                icon: const Icon(Icons.refresh_rounded, size: 14),
                label: const Text('Try Again', style: TextStyle(fontSize: 11)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.sparkAmber,
                  foregroundColor: Colors.black,
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                  minimumSize: const Size(0, 32),
                ),
              ),
          ],
        );

      case RecognitionStatus.multipleProducts:
        return Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.layers_outlined, color: AppColors.aiVioletDark, size: 36),
            const SizedBox(height: 8),
            const Text(
              'Multiple products detected',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 4),
            const Text(
              'Please focus on one product in the frame.',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.white70, fontSize: 11),
            ),
            const SizedBox(height: 10),
            if (onRetry != null)
              ElevatedButton.icon(
                onPressed: onRetry,
                icon: const Icon(Icons.center_focus_strong, size: 14),
                label: const Text('Re-focus', style: TextStyle(fontSize: 11)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.genieTeal,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                  minimumSize: const Size(0, 32),
                ),
              ),
          ],
        );

      case RecognitionStatus.notRecognized:
        return Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.help_outline_rounded, color: Colors.redAccent, size: 36),
            const SizedBox(height: 8),
            const Text(
              'Product not clearly recognized',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                if (onRetry != null)
                  ElevatedButton(
                    onPressed: onRetry,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.genieTeal,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      minimumSize: const Size(0, 32),
                    ),
                    child: const Text('Try Again', style: TextStyle(fontSize: 11)),
                  ),
                if (onManualSearch != null) ...[
                  const SizedBox(width: 8),
                  OutlinedButton(
                    onPressed: onManualSearch,
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.white,
                      side: const BorderSide(color: Colors.white38),
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      minimumSize: const Size(0, 32),
                    ),
                    child: const Text('Search Product Manually', style: TextStyle(fontSize: 11)),
                  ),
                ],
              ],
            ),
          ],
        );

      case RecognitionStatus.networkError:
        return Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.wifi_off_rounded, color: Colors.orangeAccent, size: 36),
            const SizedBox(height: 8),
            const Text(
              'Unable to connect to ShopGenie AI.',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            if (onRetry != null)
              ElevatedButton.icon(
                onPressed: onRetry,
                icon: const Icon(Icons.refresh_rounded, size: 14),
                label: const Text('Try Again', style: TextStyle(fontSize: 11)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.genieTeal,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                  minimumSize: const Size(0, 32),
                ),
              ),
          ],
        );

      case RecognitionStatus.permissionDenied:
        return const Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.no_photography_rounded, color: Colors.redAccent, size: 36),
            SizedBox(height: 8),
            Text(
              'Camera permission denied',
              style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 4),
            Text(
              'Please grant camera permission in system settings to use AI product scanning.',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.white70, fontSize: 11),
            ),
          ],
        );

      case RecognitionStatus.idle:
      default:
        return Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
            color: Colors.black.withValues(alpha: 0.65),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.white24),
          ),
          child: const Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.center_focus_strong, color: AppColors.genieTealDark, size: 16),
              SizedBox(width: 6),
              Text(
                'Hold camera steady over product',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        );
    }
  }

  Color _getFrameBorderColor() {
    switch (status) {
      case RecognitionStatus.analyzing:
        return AppColors.aiViolet;
      case RecognitionStatus.success:
        return const Color(0xFF10B981);
      case RecognitionStatus.lowConfidence:
        return AppColors.sparkAmber;
      case RecognitionStatus.notRecognized:
      case RecognitionStatus.permissionDenied:
        return Colors.redAccent;
      case RecognitionStatus.multipleProducts:
        return AppColors.aiVioletDark;
      case RecognitionStatus.networkError:
        return Colors.orangeAccent;
      case RecognitionStatus.idle:
      default:
        return Colors.white24;
    }
  }

  Color _getGlowColor() {
    switch (status) {
      case RecognitionStatus.analyzing:
        return AppColors.aiViolet;
      case RecognitionStatus.success:
        return const Color(0xFF10B981);
      case RecognitionStatus.lowConfidence:
        return AppColors.sparkAmber;
      default:
        return AppColors.genieTeal;
    }
  }

  List<Widget> _buildAiCornerMarkers() {
    const size = 26.0;
    const thickness = 3.5;
    final color = _getFrameBorderColor();

    return [
      // Top Left
      Positioned(
        top: 0,
        left: 0,
        child: Container(
          width: size,
          height: thickness,
          decoration: BoxDecoration(
            color: color,
            borderRadius: const BorderRadius.only(topLeft: Radius.circular(12)),
          ),
        ),
      ),
      Positioned(
        top: 0,
        left: 0,
        child: Container(
          width: thickness,
          height: size,
          decoration: BoxDecoration(
            color: color,
            borderRadius: const BorderRadius.only(topLeft: Radius.circular(12)),
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
          decoration: BoxDecoration(
            color: color,
            borderRadius: const BorderRadius.only(topRight: Radius.circular(12)),
          ),
        ),
      ),
      Positioned(
        top: 0,
        right: 0,
        child: Container(
          width: thickness,
          height: size,
          decoration: BoxDecoration(
            color: color,
            borderRadius: const BorderRadius.only(topRight: Radius.circular(12)),
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
          decoration: BoxDecoration(
            color: color,
            borderRadius: const BorderRadius.only(bottomLeft: Radius.circular(12)),
          ),
        ),
      ),
      Positioned(
        bottom: 0,
        left: 0,
        child: Container(
          width: thickness,
          height: size,
          decoration: BoxDecoration(
            color: color,
            borderRadius: const BorderRadius.only(bottomLeft: Radius.circular(12)),
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
          decoration: BoxDecoration(
            color: color,
            borderRadius: const BorderRadius.only(bottomRight: Radius.circular(12)),
          ),
        ),
      ),
      Positioned(
        bottom: 0,
        right: 0,
        child: Container(
          width: thickness,
          height: size,
          decoration: BoxDecoration(
            color: color,
            borderRadius: const BorderRadius.only(bottomRight: Radius.circular(12)),
          ),
        ),
      ),
    ];
  }
}
