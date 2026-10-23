import 'dart:convert';
import 'dart:io' show SocketException, HttpException;

import 'package:http/http.dart' as http;

import '../models/announcement_item.dart';
import '../models/offer_item.dart';
import '../models/product_item.dart';
import '../models/store_item.dart';
import 'api_config.dart';

/// Exception type that distinguishes API failures from valid empty results.
class ShopApiException implements Exception {
  ShopApiException(this.message,
      {this.statusCode, this.isNetworkError = false});

  final String message;
  final int? statusCode;
  final bool isNetworkError;

  @override
  String toString() => message;
}

/// Low-level HTTP client for the shop endpoints.
///
/// Uses the single `http` package already declared in pubspec.yaml. All
/// requests are routed through [ApiConfig] so the base URL lives in one place.
/// Timeouts are enforced client-side; timeouts and connection failures are
/// surfaced as [ShopApiException] with [isNetworkError] = true so the UI can
/// distinguish them from a genuine empty result set.
class ShopApiService {
  ShopApiService({http.Client? client}) : _client = client ?? http.Client();

  final http.Client _client;

  // ---------------------------------------------------------------------------
  // GET /shops/
  // ---------------------------------------------------------------------------
  // The backend uses DRF's default PageNumberPagination, which wraps the
  // page in { "count": int, "next": string|null, "previous": string|null,
  // "results": [...] }. The list endpoint is unauthenticated for GET.
  Future<List<StoreItem>> fetchShops({
    int page = 1,
    int pageSize = 20,
    String? category,
    String? search,
  }) async {
    final query = <String, String>{
      'page': '$page',
      'page_size': '$pageSize',
    };
    if (category != null && category.trim().isNotEmpty && category != 'All') {
      query['category'] = category.trim();
    }
    if (search != null && search.trim().isNotEmpty) {
      query['search'] = search.trim();
    }

    final uri = Uri.parse(ApiConfig.urlWithQuery(
      ApiConfig.shopsEndpoint,
      queryParameters: query,
    ));

    final response =
        await _client.get(uri).timeout(const Duration(seconds: 15));

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw ShopApiException(
        'Failed to load shops (HTTP ${response.statusCode}).',
        statusCode: response.statusCode,
      );
    }

    dynamic decoded;
    try {
      decoded = jsonDecode(response.body);
    } on FormatException {
      throw ShopApiException(
        'Unexpected shop list response structure: could not parse JSON.',
      );
    }

    if (decoded is! Map<String, dynamic>) {
      throw ShopApiException(
        'Unexpected shop list response structure: expected an object with a '
        '"results" array.',
      );
    }

    final results = decoded['results'];
    if (results is! List) {
      throw ShopApiException(
        'Unexpected shop list response structure: "results" was not a list.',
      );
    }

    final shops = <StoreItem>[];
    for (final entry in results) {
      if (entry is! Map<String, dynamic>) continue;
      shops.add(StoreItem.fromJson(entry));
    }
    return shops;
  }

  // ---------------------------------------------------------------------------
  // GET /shops/<id>/
  // ---------------------------------------------------------------------------
  // Supports integer and string IDs; the backend route is <int:pk>/, so a
  // numeric string is also accepted by the router. We normalize here so the
  // caller never has to think about the representation.
  Future<StoreItem> fetchShopById(String id) async {
    final normalizedId = _normalizeId(id);
    final endpoint = ApiConfig.shopDetailEndpoint(normalizedId);
    final uri = Uri.parse(ApiConfig.fullUrl(endpoint));

    final response =
        await _client.get(uri).timeout(const Duration(seconds: 15));

    if (response.statusCode == 404) {
      throw ShopApiException('Shop not found.', statusCode: 404);
    }
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw ShopApiException(
        'Failed to load shop (HTTP ${response.statusCode}).',
        statusCode: response.statusCode,
      );
    }

    dynamic decoded;
    try {
      decoded = jsonDecode(response.body);
    } on FormatException {
      throw ShopApiException(
        'Unexpected shop detail response structure: could not parse JSON.',
      );
    }

    if (decoded is! Map<String, dynamic>) {
      throw ShopApiException(
        'Unexpected shop detail response structure: expected a JSON object.',
      );
    }
    return StoreItem.fromJson(decoded);
  }

  // ---------------------------------------------------------------------------
  // GET /products/?shop=<id>
  // ---------------------------------------------------------------------------
  // The public product list endpoint is unauthenticated for GET. Products can
  // be filtered by shop ID via the ?shop= query parameter. Only page 1 is
  // fetched; page_size is not sent because backend support for it is not
  // verified. If results span multiple pages, only the first page is returned.
  Future<List<ProductItem>> fetchProductsForShop(String shopId) async {
    final normalizedId = _normalizeId(shopId);
    final query = <String, String>{
      'shop': normalizedId,
    };

    final uri = Uri.parse(ApiConfig.urlWithQuery(
      ApiConfig.productsEndpoint,
      queryParameters: query,
    ));

    final response =
        await _client.get(uri).timeout(const Duration(seconds: 15));

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw ShopApiException(
        'Failed to load products (HTTP ${response.statusCode}).',
        statusCode: response.statusCode,
      );
    }

    dynamic decoded;
    try {
      decoded = jsonDecode(response.body);
    } on FormatException {
      throw ShopApiException(
        'Unexpected product list response structure: could not parse JSON.',
      );
    }

    if (decoded is! Map<String, dynamic>) {
      throw ShopApiException(
        'Unexpected product list response structure: expected an object with a '
        '"results" array.',
      );
    }

    final results = decoded['results'];
    if (results is! List) {
      throw ShopApiException(
        'Unexpected product list response structure: "results" was not a list.',
      );
    }

    final products = <ProductItem>[];
    for (final entry in results) {
      if (entry is! Map<String, dynamic>) continue;
      products.add(ProductItem.fromJson(entry));
    }
    return products;
  }

  // ---------------------------------------------------------------------------
  // GET /offers/
  // ---------------------------------------------------------------------------
  Future<List<OfferItem>> fetchOffers({String? shopId}) async {
    final query = <String, String>{};
    if (shopId != null && shopId.trim().isNotEmpty) {
      query['shop'] = _normalizeId(shopId);
    }
    final uri = Uri.parse(ApiConfig.urlWithQuery(
      ApiConfig.offersEndpoint,
      queryParameters: query,
    ));

    final response = await _client.get(uri).timeout(const Duration(seconds: 15));
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw ShopApiException('Failed to load offers (HTTP ${response.statusCode}).', statusCode: response.statusCode);
    }

    dynamic decoded = jsonDecode(response.body);
    List results;
    if (decoded is Map<String, dynamic> && decoded['results'] is List) {
      results = decoded['results'] as List;
    } else if (decoded is List) {
      results = decoded;
    } else {
      results = [];
    }

    return results
        .whereType<Map<String, dynamic>>()
        .map((entry) => OfferItem.fromJson(entry))
        .toList();
  }

  // ---------------------------------------------------------------------------
  // GET /announcements/
  // ---------------------------------------------------------------------------
  Future<List<AnnouncementItem>> fetchAnnouncements({String? shopId}) async {
    final query = <String, String>{};
    if (shopId != null && shopId.trim().isNotEmpty) {
      query['shop'] = _normalizeId(shopId);
    }
    final uri = Uri.parse(ApiConfig.urlWithQuery(
      ApiConfig.announcementsEndpoint,
      queryParameters: query,
    ));

    final response = await _client.get(uri).timeout(const Duration(seconds: 15));
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw ShopApiException('Failed to load announcements (HTTP ${response.statusCode}).', statusCode: response.statusCode);
    }

    dynamic decoded = jsonDecode(response.body);
    List results;
    if (decoded is Map<String, dynamic> && decoded['results'] is List) {
      results = decoded['results'] as List;
    } else if (decoded is List) {
      results = decoded;
    } else {
      results = [];
    }

    return results
        .whereType<Map<String, dynamic>>()
        .map((entry) => AnnouncementItem.fromJson(entry))
        .toList();
  }

  // ---------------------------------------------------------------------------
  // GET /products/?search=<query>
  // ---------------------------------------------------------------------------
  Future<List<ProductItem>> searchProducts(String query, {String? category, String? shopId}) async {
    final params = <String, String>{};
    if (query.trim().isNotEmpty) {
      params['search'] = query.trim();
    }
    if (category != null && category.trim().isNotEmpty && category != 'All') {
      params['category'] = category.trim();
    }
    if (shopId != null && shopId.trim().isNotEmpty) {
      params['shop'] = _normalizeId(shopId);
    }

    final uri = Uri.parse(ApiConfig.urlWithQuery(
      ApiConfig.productsEndpoint,
      queryParameters: params,
    ));

    final response = await _client.get(uri).timeout(const Duration(seconds: 15));
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw ShopApiException('Failed to search products (HTTP ${response.statusCode}).', statusCode: response.statusCode);
    }

    dynamic decoded = jsonDecode(response.body);
    List results;
    if (decoded is Map<String, dynamic> && decoded['results'] is List) {
      results = decoded['results'] as List;
    } else if (decoded is List) {
      results = decoded;
    } else {
      results = [];
    }

    return results
        .whereType<Map<String, dynamic>>()
        .map((entry) => ProductItem.fromJson(entry))
        .toList();
  }

  void close() => _client.close();

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------
  String _normalizeId(String id) {
    final trimmed = id.trim();
    if (trimmed.isEmpty) {
      throw ShopApiException('Shop id must not be empty.');
    }
    final parsed = int.tryParse(trimmed);
    if (parsed != null) return parsed.toString();
    return trimmed;
  }
}

/// Top-level helper used by callers that only need to classify an error.
bool isNetworkFailure(Object error) {
  if (error is ShopApiException) return error.isNetworkError;
  return error is SocketException || error is HttpException;
}
