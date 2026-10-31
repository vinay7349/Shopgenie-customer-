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
  static const bool useProduction = bool.fromEnvironment(
    'USE_PRODUCTION_API',
    defaultValue: false,
  );

  // ---------------------------------------------------------------------------
  // Base URLs
  // ---------------------------------------------------------------------------
  // Android emulator development host (maps to host machine's localhost).
  static const String _configuredHost = String.fromEnvironment(
    'BASE_URL',
    defaultValue: 'http://10.0.2.2:8000',
  );
  static final String devBaseUrl = _normalizeApiBase(_configuredHost);

  // Production HTTPS endpoint (replace with real host before release).
  static const String prodBaseUrl = String.fromEnvironment(
    'PROD_BASE_URL',
    defaultValue: 'https://api.shopgenie.example.com/api',
  );

  /// Active base URL for the current build.
  ///
  /// The default host is for Android emulators. For a physical device, pass
  /// the PC's Wi-Fi URL with `--dart-define=BASE_URL=...` or use
  /// `run_wifi_debug.ps1`.
  static String get baseUrl {
    if (overrideBaseUrl != null) return overrideBaseUrl!;
    if (useProduction) return prodBaseUrl;
    if (Platform.isAndroid) return devBaseUrl;
    return devBaseUrl;
  }

  /// Optional runtime override, e.g. when testing on a physical device.
  static String? overrideBaseUrl;

  static String _normalizeApiBase(String host) {
    final trimmed = host.trim().replaceFirst(RegExp(r'/+$'), '');
    return trimmed.endsWith('/api') ? trimmed : '$trimmed/api';
  }

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
