import 'package:flutter/foundation.dart';

import '../models/auth_models.dart';
import '../services/auth_api_service.dart';
import '../services/token_storage.dart';

/// Authentication state enumeration.
enum AuthState {
  /// Initial state before any authentication check.
  initial,
  /// Currently performing an authentication operation (login, register, etc.).
  loading,
  /// User is authenticated and tokens are valid.
  authenticated,
  /// User is not authenticated.
  unauthenticated,
  /// An error occurred during authentication.
  error,
}

/// Authentication provider using [ChangeNotifier] for state management.
///
/// Manages the complete authentication lifecycle including:
/// - Initialization (checking stored tokens)
/// - Login, customer registration, owner registration
/// - Logout
/// - Loading states and error handling
class AuthProvider extends ChangeNotifier {
  final AuthApiService _apiService;
  final TokenStorage _tokenStorage;

  AuthState _state = AuthState.initial;
  AuthUser? _user;
  String? _errorMessage;
  bool _isOperationInProgress = false;

  AuthProvider({
    required AuthApiService apiService,
    required TokenStorage tokenStorage,
  })  : _apiService = apiService,
        _tokenStorage = tokenStorage;

  // Getters
  AuthState get state => _state;
  AuthUser? get user => _user;
  String? get errorMessage => _errorMessage;
  bool get isLoading => _state == AuthState.loading;
  bool get isAuthenticated => _state == AuthState.authenticated;
  bool get isOperationInProgress => _isOperationInProgress;
  bool get hasError => _state == AuthState.error;

  /// Initializes the authentication state by checking for stored tokens.
  ///
  /// Since there is no current-user endpoint on the backend to validate
  /// existing tokens, this method only checks if tokens exist locally.
  /// Actual token validity will be determined when making authenticated
  /// requests (which may return 401 and require re-login).
  Future<void> initialize() async {
    _setState(AuthState.loading);
    try {
      final hasTokens = await _tokenStorage.hasTokens();
      if (hasTokens) {
        // Tokens exist but we cannot validate them without a current-user endpoint.
        // Mark as authenticated; actual validity will be checked on first API call.
        _setState(AuthState.authenticated);
      } else {
        _setState(AuthState.unauthenticated);
      }
    } catch (e) {
      // If token storage is unavailable, treat as unauthenticated.
      _setState(AuthState.unauthenticated);
    }
  }

  /// Logs in with username/email and password.
  Future<bool> login({
    required String usernameOrEmail,
    required String password,
  }) async {
    if (_isOperationInProgress) return false;

    _setOperationInProgress(true);
    _clearError();

    try {
      final response = await _apiService.login(
        username: usernameOrEmail,
        password: password,
      );

      await _tokenStorage.saveTokens(
        accessToken: response.tokens.access,
        refreshToken: response.tokens.refresh,
      );
      _user = response.user;
      _setState(AuthState.authenticated);
      return true;
    } on AuthApiException catch (e) {
      _setError(e.message);
      _setState(AuthState.error);
      return false;
    } catch (e) {
      _setError('Login failed: ${e.toString()}');
      _setState(AuthState.error);
      return false;
    } finally {
      _setOperationInProgress(false);
    }
  }

  /// Registers a new customer account.
  Future<bool> registerCustomer({
    required String username,
    required String email,
    required String password,
  }) async {
    if (_isOperationInProgress) return false;

    _setOperationInProgress(true);
    _clearError();

    try {
      final response = await _apiService.registerCustomer(
        username: username,
        email: email,
        password: password,
      );

      await _tokenStorage.saveTokens(
        accessToken: response.tokens.access,
        refreshToken: response.tokens.refresh,
      );
      _user = response.user;
      _setState(AuthState.authenticated);
      return true;
    } on AuthApiException catch (e) {
      _setError(e.message);
      _setState(AuthState.error);
      return false;
    } catch (e) {
      _setError('Registration failed: ${e.toString()}');
      _setState(AuthState.error);
      return false;
    } finally {
      _setOperationInProgress(false);
    }
  }

  /// Registers a new shop owner account with an associated shop.
  Future<bool> registerOwner({
    required String username,
    required String email,
    required String password,
    required String shopName,
  }) async {
    if (_isOperationInProgress) return false;

    _setOperationInProgress(true);
    _clearError();

    try {
      final response = await _apiService.registerOwner(
        username: username,
        email: email,
        password: password,
        shopName: shopName,
      );

      await _tokenStorage.saveTokens(
        accessToken: response.tokens.access,
        refreshToken: response.tokens.refresh,
      );
      _user = response.user;
      _setState(AuthState.authenticated);
      return true;
    } on AuthApiException catch (e) {
      _setError(e.message);
      _setState(AuthState.error);
      return false;
    } catch (e) {
      _setError('Owner registration failed: ${e.toString()}');
      _setState(AuthState.error);
      return false;
    } finally {
      _setOperationInProgress(false);
    }
  }

  /// Logs out the current user by clearing tokens and user state.
  Future<void> logout() async {
    _setOperationInProgress(true);
    try {
      await _tokenStorage.clearTokens();
      _user = null;
      _setState(AuthState.unauthenticated);
    } finally {
      _setOperationInProgress(false);
    }
  }

  /// Clears the current error state without changing authentication state.
  void clearError() {
    _clearError();
  }

  // Private helpers
  void _setState(AuthState newState) {
    _state = newState;
    notifyListeners();
  }

  void _clearError() {
    _errorMessage = null;
    if (_state == AuthState.error) {
      _state = _user != null ? AuthState.authenticated : AuthState.unauthenticated;
    }
  }

  void _setError(String message) {
    _errorMessage = message;
  }

  void _setOperationInProgress(bool inProgress) {
    _isOperationInProgress = inProgress;
    if (!inProgress && _state == AuthState.loading) {
      _state = _user != null ? AuthState.authenticated : AuthState.unauthenticated;
    }
    notifyListeners();
  }
}