enum RecognitionStatus {
  idle,
  analyzing,
  success,
  notRecognized,
  lowConfidence,
  multipleProducts,
  networkError,
  permissionDenied,
  unavailable,
}

class RecognitionResult {
  final RecognitionStatus status;
  final String? errorMessage;

  const RecognitionResult({
    required this.status,
    this.errorMessage,
  });
}

class ProductRecognitionService {
  static Future<RecognitionResult> recognizeProduct() async {
    return const RecognitionResult(
      status: RecognitionStatus.unavailable,
      errorMessage:
          'Product recognition is not available from the connected backend.',
    );
  }
}
