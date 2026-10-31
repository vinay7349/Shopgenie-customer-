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
  /// Validates stored sessions against the backend, refreshing expired access
  /// tokens when possible. A temporary network failure keeps the stored
  /// session available for retry on the next authenticated request.
  Future<void> initialize() async {
    _setState(AuthState.loading);
    try {
      final accessToken = await _tokenStorage.getAccessToken();
      if (accessToken == null || accessToken.isEmpty) {
        _setState(AuthState.unauthenticated);
        return;
      }
      try {
        _user = await _apiService.fetchCurrentUser(accessToken);
      } on AuthApiException catch (error) {
        if (error.isNetworkError) {
          _setState(AuthState.authenticated);
          return;
        }
        if (error.statusCode != 401) {
          _setState(AuthState.authenticated);
          return;
        }
        final refreshToken = await _tokenStorage.getRefreshToken();
        if (refreshToken == null || refreshToken.isEmpty) {
          await _tokenStorage.clearTokens();
          _setState(AuthState.unauthenticated);
          return;
        }
        try {
          final refreshed = await _apiService.refreshToken(refreshToken);
          await _tokenStorage.saveTokens(
            accessToken: refreshed.access,
            refreshToken: refreshed.refresh,
          );
          _user = await _apiService.fetchCurrentUser(refreshed.access);
        } on AuthApiException catch (refreshError) {
          if (refreshError.isNetworkError) {
            _setState(AuthState.authenticated);
            return;
          }
          if (refreshError.statusCode == 401) {
            await _tokenStorage.clearTokens();
            _setState(AuthState.unauthenticated);
            return;
          }
          _setState(AuthState.authenticated);
          return;
        }
      }
      if (_user?.role.toUpperCase() != 'CUSTOMER') {
        await _tokenStorage.clearTokens();
        _user = null;
        _setState(AuthState.unauthenticated);
        return;
      }
      _setState(AuthState.authenticated);
    } catch (error) {
      _setError('Unable to restore the saved session: $error');
      _setState(AuthState.error);
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
      if (response.user.role.toUpperCase() != 'CUSTOMER') {
        throw AuthApiException(
          'This account is not a customer account. Use the Shop Owner app for shop access.',
        );
      }

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
      if (response.user.role.toUpperCase() != 'CUSTOMER') {
        throw AuthApiException(
          'Customer registration returned an unexpected account role.',
        );
      }

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