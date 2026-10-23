import 'dart:io' show Platform;

/// Central API configuration for ShopGenie Customer app.
///
/// Provides a single source of truth for backend base URLs and endpoint paths.
/// Development uses HTTP for Android emulator (10.0.2.2:8000).
/// Production should use HTTPS with a real host.
class ApiConfig {
  // ---------------------------------------------------------------------------
  // Environment selection
  // ---------------------------------------------------------------------------
  // Set `useProduction` to true when building for a real device or release.
  // Development defaults to the Android emulator loopback address.
  static const bool useProduction = false;

  // ---------------------------------------------------------------------------
  // Base URLs
  // ---------------------------------------------------------------------------
  // Android emulator development host (maps to host machine's localhost).
  static const String devBaseUrl = 'http://10.0.2.2:8000/api';

  // Production HTTPS endpoint (replace with real host before release).
  static const String prodBaseUrl = 'https://api.shopgenie.example.com/api';

  /// Active base URL for the current build.
  ///
  /// On a physical Android device, 10.0.2.2 does not route to the host, so we
  /// fall back to the host's LAN address (127.0.0.1 is also unreachable from a
  /// physical device). Override [overrideBaseUrl] at app startup when testing
  /// on real hardware, then flip [useProduction] on for release.
  static String get baseUrl {
    if (overrideBaseUrl != null) return overrideBaseUrl!;
    if (useProduction) return prodBaseUrl;
    if (Platform.isAndroid) return devBaseUrl;
    return devBaseUrl;
  }

  /// Optional runtime override, e.g. when testing on a physical device.
  static String? overrideBaseUrl;

  // ---------------------------------------------------------------------------
  // Shop endpoints
  // ---------------------------------------------------------------------------
  static const String shopsEndpoint = '/shops/';
  static String shopDetailEndpoint(String id) => '/shops/$id/';

  // ---------------------------------------------------------------------------
  // Product endpoints (reserved for future increments)
  // ---------------------------------------------------------------------------
  static const String productsEndpoint = '/products/';
  static const String productsRecognizeEndpoint = '/products/recognize/';

  // ---------------------------------------------------------------------------
  // Offers and Announcements endpoints
  // ---------------------------------------------------------------------------
  static const String offersEndpoint = '/offers/';
  static const String announcementsEndpoint = '/announcements/';

  // ---------------------------------------------------------------------------
  // Auth endpoints
  // ---------------------------------------------------------------------------
  static const String authLoginEndpoint = '/auth/login/';
  static const String authRegisterCustomerEndpoint = '/auth/register/customer/';
  static const String authRegisterOwnerEndpoint = '/auth/register/owner/';
  static const String authRefreshEndpoint = '/auth/refresh/';

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------
  /// Build a full URL from a relative endpoint path.
  static String fullUrl(String endpoint) => '$baseUrl$endpoint';

  /// Build a URL with query parameters.
  static String urlWithQuery(
    String endpoint, {
    Map<String, String>? queryParameters,
  }) {
    if (queryParameters == null || queryParameters.isEmpty) {
      return fullUrl(endpoint);
    }
    final params = queryParameters.entries
        .map((e) => '${Uri.encodeComponent(e.key)}=${Uri.encodeComponent(e.value)}')
        .join('&');
    return '${fullUrl(endpoint)}?$params';
  }
}
