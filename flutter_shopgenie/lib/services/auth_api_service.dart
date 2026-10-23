import 'dart:convert';
import 'dart:io' show SocketException, HttpException;

import 'package:http/http.dart' as http;

import '../models/auth_models.dart';
import 'api_config.dart';

/// Exception type for authentication API failures.
class AuthApiException implements Exception {
  AuthApiException(this.message, {this.statusCode, this.isNetworkError = false});

  final String message;
  final int? statusCode;
  final bool isNetworkError;

  @override
  String toString() => message;
}

/// Low-level HTTP client for authentication endpoints.
class AuthApiService {
  AuthApiService({http.Client? client}) : _client = client ?? http.Client();

  final http.Client _client;

  static const Duration _timeout = Duration(seconds: 15);

  /// Registers a new customer account.
  ///
  /// POST /auth/register/customer/
  /// Body: {username, email, password}
  /// Returns: AuthResponse with tokens and user (role: CUSTOMER)
  Future<AuthResponse> registerCustomer({
    required String username,
    required String email,
    required String password,
  }) async {
    final uri = Uri.parse(ApiConfig.fullUrl(ApiConfig.authRegisterCustomerEndpoint));

    final response = await _client
        .post(
          uri,
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({
            'username': username,
            'email': email,
            'password': password,
          }),
        )
        .timeout(_timeout);

    return _handleAuthResponse(response, 'customer registration');
  }

  /// Registers a new shop owner account with an associated shop.
  ///
  /// POST /auth/register/owner/
  /// Body: {username, email, password, shop_name}
  /// Returns: AuthResponse with tokens, user (role: SHOP_OWNER), and shop
  Future<AuthResponse> registerOwner({
    required String username,
    required String email,
    required String password,
    required String shopName,
  }) async {
    final uri = Uri.parse(ApiConfig.fullUrl(ApiConfig.authRegisterOwnerEndpoint));

    final response = await _client
        .post(
          uri,
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({
            'username': username,
            'email': email,
            'password': password,
            'shop_name': shopName,
          }),
        )
        .timeout(_timeout);

    return _handleAuthResponse(response, 'owner registration');
  }

  /// Logs in an existing user.
  ///
  /// POST /auth/login/
  /// Body: {username, password} (username can be email or username)
  /// Returns: AuthResponse with tokens and user
  Future<AuthResponse> login({
    required String username,
    required String password,
  }) async {
    final uri = Uri.parse(ApiConfig.fullUrl(ApiConfig.authLoginEndpoint));

    final response = await _client
        .post(
          uri,
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({
            'username': username,
            'password': password,
          }),
        )
        .timeout(_timeout);

    return _handleAuthResponse(response, 'login');
  }

  /// Refreshes an expired access token.
  ///
  /// POST /auth/refresh/
  /// Body: {refresh}
  /// Returns: AuthTokens with new access and refresh
  Future<AuthTokens> refreshToken(String refreshToken) async {
    if (refreshToken.isEmpty) {
      throw AuthApiException('Refresh token must not be empty');
    }

    final uri = Uri.parse(ApiConfig.fullUrl(ApiConfig.authRefreshEndpoint));

    final response = await _client
        .post(
          uri,
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({'refresh': refreshToken}),
        )
        .timeout(_timeout);

    if (response.statusCode < 200 || response.statusCode >= 300) {
      if (response.statusCode == 401) {
        throw AuthApiException(
          'Refresh token expired or invalid. Please log in again.',
          statusCode: 401,
        );
      }
      throw AuthApiException(
        'Failed to refresh token (HTTP ${response.statusCode}).',
        statusCode: response.statusCode,
      );
    }

    dynamic decoded;
    try {
      decoded = jsonDecode(response.body);
    } on FormatException {
      throw AuthApiException('Invalid token refresh response: could not parse JSON.');
    }

    if (decoded is! Map<String, dynamic>) {
      throw AuthApiException('Invalid token refresh response: expected JSON object.');
    }

    return AuthTokens.fromJson(decoded);
  }

  /// Handles successful and error responses from auth endpoints.
  AuthResponse _handleAuthResponse(http.Response response, String operation) {
    if (response.statusCode < 200 || response.statusCode >= 300) {
      String errorMessage;
      try {
        final decoded = jsonDecode(response.body);
        if (decoded is Map<String, dynamic>) {
          // Django REST Framework typically returns {"field": ["error"]}
          final errors = decoded.entries
              .map((e) => '${e.key}: ${e.value is List ? e.value.join(', ') : e.value}')
              .join('; ');
          errorMessage = errors.isNotEmpty ? errors : response.body;
        } else {
          errorMessage = response.body;
        }
      } on FormatException {
        errorMessage = response.body;
      }
      throw AuthApiException(
        'Failed $operation: $errorMessage',
        statusCode: response.statusCode,
      );
    }

    dynamic decoded;
    try {
      decoded = jsonDecode(response.body);
    } on FormatException {
      throw AuthApiException('Invalid $operation response: could not parse JSON.');
    }

    if (decoded is! Map<String, dynamic>) {
      throw AuthApiException('Invalid $operation response: expected JSON object.');
    }

    return AuthResponse.fromJson(decoded);
  }

  void close() => _client.close();
}

/// Top-level helper to classify auth errors.
bool isAuthNetworkFailure(Object error) {
  if (error is AuthApiException) return error.isNetworkError;
  return error is SocketException || error is HttpException;
}