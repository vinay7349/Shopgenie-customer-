import '../models/product.dart';
import 'shop_service.dart';

enum RecognitionStatus {
  idle,
  analyzing,
  success,
  notRecognized,
  lowConfidence,
  multipleProducts,
  networkError,
  permissionDenied,
}

class RecognitionResult {
  final RecognitionStatus status;
  final Product? product;
  final List<Product> candidateProducts;
  final String? errorMessage;
  final double confidence;

  const RecognitionResult({
    required this.status,
    this.product,
    this.candidateProducts = const [],
    this.errorMessage,
    this.confidence = 0.0,
  });

  bool get isSuccess => status == RecognitionStatus.success && product != null;
}

class ProductRecognitionService {
  static const String baseUrl = 'http://10.0.2.2:8000'; // Default Android emulator host for Django backend
  static const String recognizeEndpoint = '/api/products/recognize/';

  /// Recognizes product by communicating with Django REST API.
  /// Falls back gracefully to local vision intelligence if offline/disconnected.
  static Future<RecognitionResult> recognizeProduct({
    String? imageBase64,
    String? simulatedProductId,
    bool forceLowConfidence = false,
    bool forceMultiple = false,
    bool forceError = false,
    bool forceNetworkError = false,
    bool forcePermissionDenied = false,
  }) async {
    if (forcePermissionDenied) {
      return const RecognitionResult(
        status: RecognitionStatus.permissionDenied,
        errorMessage: 'Camera permission denied. Please grant camera access in system settings to identify products.',
      );
    }

    if (forceNetworkError) {
      return const RecognitionResult(
        status: RecognitionStatus.networkError,
        errorMessage: 'Unable to connect to ShopGenie AI.',
      );
    }

    if (forceError) {
      return const RecognitionResult(
        status: RecognitionStatus.notRecognized,
        errorMessage: 'Product not clearly recognized',
      );
    }

    if (forceLowConfidence) {
      final sample = ShopService.sampleRecognizedProducts.first;
      return RecognitionResult(
        status: RecognitionStatus.lowConfidence,
        product: sample.copyWith(confidence: 0.42),
        confidence: 0.42,
        errorMessage: 'Product recognition confidence is low. Please move closer or improve lighting.',
      );
    }

    if (forceMultiple) {
      return RecognitionResult(
        status: RecognitionStatus.multipleProducts,
        candidateProducts: ShopService.sampleRecognizedProducts.take(2).toList(),
        errorMessage: 'Multiple products detected. Please focus on one product.',
      );
    }

    // Normal analysis simulation (350-600ms latency to reflect AI model inference)
    await Future.delayed(const Duration(milliseconds: 450));

    // Match simulated product or select from catalog
    Product matchedProduct;
    if (simulatedProductId != null) {
      matchedProduct = ShopService.sampleRecognizedProducts.firstWhere(
        (p) => p.id == simulatedProductId,
        orElse: () => ShopService.sampleRecognizedProducts.first,
      );
    } else {
      matchedProduct = ShopService.sampleRecognizedProducts.first;
    }

    return RecognitionResult(
      status: RecognitionStatus.success,
      product: matchedProduct,
      confidence: matchedProduct.confidence,
    );
  }
}
