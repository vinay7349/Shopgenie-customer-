import 'dart:async' show TimeoutException;
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
  /// Body: {username, email, password, password_confirm, captcha_token}
  /// Creates an account and queues email verification without returning tokens.
  Future<void> registerCustomer({
    required String username,
    required String email,
    required String password,
    required String passwordConfirm,
    required String captchaToken,
  }) async {
    final response = await _client.post(
      Uri.parse(ApiConfig.fullUrl(ApiConfig.authRegisterCustomerEndpoint)),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'username': username,
        'email': email,
        'password': password,
        'password_confirm': passwordConfirm,
        'captcha_token': captchaToken,
      }),
    ).timeout(_timeout);
    _handleRegistrationResponse(response, 'customer registration');
  }

  /// Registers a new shop owner account with an associated shop.
  ///
  /// POST /auth/register/owner/
  /// Body: {username, email, password, password_confirm, shop_name, captcha_token}
  /// Creates an account and queues email verification without returning tokens.
  Future<void> registerOwner({
    required String username,
    required String email,
    required String password,
    required String passwordConfirm,
    required String shopName,
    required String captchaToken,
  }) async {
    final response = await _client.post(
      Uri.parse(ApiConfig.fullUrl(ApiConfig.authRegisterOwnerEndpoint)),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'username': username,
        'email': email,
        'password': password,
        'password_confirm': passwordConfirm,
        'shop_name': shopName,
        'captcha_token': captchaToken,
      }),
    ).timeout(_timeout);
    _handleRegistrationResponse(response, 'owner registration');
  }

  /// Logs in an existing user.
  ///
  /// POST /auth/login/
  /// Body: {username, password} (username can be email or username)
  /// Returns: AuthResponse with tokens and user
  Future<AuthResponse> login({
    required String username,
    required String password,
    required String role,
  }) async {
    final uri = Uri.parse(ApiConfig.fullUrl(ApiConfig.authLoginEndpoint));

    final response = await _client
        .post(
          uri,
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({
            'username': username,
            'password': password,
            'role': role,
          }),
        )
        .timeout(_timeout);

    return _handleAuthResponse(response, 'login');
  }

  Future<void> verifyEmail({
    required String email,
    required String code,
  }) async {
    final response = await _client.post(
      Uri.parse(ApiConfig.fullUrl('/auth/email-verification/confirm/')),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'code': code}),
    ).timeout(_timeout);
    _handlePublicActionResponse(response, 'email verification');
  }

  Future<void> resendVerification({
    required String email,
    required String captchaToken,
  }) async {
    final response = await _client.post(
      Uri.parse(ApiConfig.fullUrl('/auth/email-verification/resend/')),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'captcha_token': captchaToken}),
    ).timeout(_timeout);
    _handlePublicActionResponse(response, 'verification resend');
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

    late final http.Response response;
    try {
      response = await _client
          .post(
            uri,
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({'refresh': refreshToken}),
          )
          .timeout(_timeout);
    } on SocketException {
      throw AuthApiException(
        'The ShopGenie backend is unreachable.',
        isNetworkError: true,
      );
    } on HttpException catch (error) {
      throw AuthApiException(
        'HTTP communication failed: ${error.message}',
        isNetworkError: true,
      );
    } on TimeoutException {
      throw AuthApiException(
        'The ShopGenie backend did not respond within 15 seconds.',
        isNetworkError: true,
      );
    }

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

  Future<AuthUser> fetchCurrentUser(String accessToken) async {
    late final http.Response response;
    try {
      response = await _client
          .get(
            Uri.parse(ApiConfig.fullUrl('/auth/me/')),
            headers: {
              'Accept': 'application/json',
              'Authorization': 'Bearer $accessToken',
            },
          )
          .timeout(_timeout);
    } on SocketException {
      throw AuthApiException(
        'The ShopGenie backend is unreachable.',
        isNetworkError: true,
      );
    } on HttpException catch (error) {
      throw AuthApiException(
        'HTTP communication failed: ${error.message}',
        isNetworkError: true,
      );
    } on TimeoutException {
      throw AuthApiException(
        'The ShopGenie backend did not respond within 15 seconds.',
        isNetworkError: true,
      );
    }
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw AuthApiException(
        'Failed to validate the saved session (HTTP ${response.statusCode}).',
        statusCode: response.statusCode,
      );
    }

    dynamic decoded;
    try {
      decoded = jsonDecode(response.body);
    } on FormatException {
      throw AuthApiException(
        'Invalid current-user response: could not parse JSON.',
      );
    }
    if (decoded is! Map<String, dynamic>) {
      throw AuthApiException(
        'Invalid current-user response: expected JSON object.',
      );
    }
    return AuthUser.fromJson(decoded);
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

  void _handleRegistrationResponse(http.Response response, String operation) {
    if (response.statusCode == 202) return;
    _handlePublicActionResponse(response, operation);
  }

  void _handlePublicActionResponse(http.Response response, String operation) {
    if (response.statusCode >= 200 && response.statusCode < 300) return;
    String message = 'Request could not be completed.';
    try {
      final decoded = jsonDecode(response.body);
      if (decoded is Map<String, dynamic>) {
        final detail = decoded['detail'];
        if (detail is String && detail.isNotEmpty) {
          message = detail;
        } else {
          message = decoded.entries
              .map((entry) => '${entry.key}: ${entry.value is List ? (entry.value as List).join(', ') : entry.value}')
              .join('; ');
        }
      }
    } on FormatException {
      message = 'Request could not be completed.';
    }
    throw AuthApiException(
      'Failed $operation: $message',
      statusCode: response.statusCode,
    );
  }

  void close() => _client.close();
}

/// Top-level helper to classify auth errors.
bool isAuthNetworkFailure(Object error) {
  if (error is AuthApiException) return error.isNetworkError;
  return error is SocketException || error is HttpException;
}