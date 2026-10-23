import 'dart:async';

import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';

import 'package:shopgenie/models/auth_models.dart';
import 'package:shopgenie/providers/auth_provider.dart';
import 'package:shopgenie/services/auth_api_service.dart';
import 'package:shopgenie/services/token_storage.dart';

// Generate mocks
@GenerateMocks([AuthApiService, TokenStorage])
import 'auth_provider_test.mocks.dart';

void main() {
  group('AuthProvider', () {
    late MockAuthApiService mockApiService;
    late MockTokenStorage mockTokenStorage;
    late AuthProvider authProvider;

    setUp(() {
      mockApiService = MockAuthApiService();
      mockTokenStorage = MockTokenStorage();
      authProvider = AuthProvider(
        apiService: mockApiService,
        tokenStorage: mockTokenStorage,
      );
    });

    tearDown(() {
      authProvider.dispose();
    });

    // Helper to create a successful AuthResponse
    AuthResponse createAuthResponse({
      String userId = '1',
      String username = 'testuser',
      String email = 'test@example.com',
      String role = 'CUSTOMER',
      String access = 'access_token',
      String refresh = 'refresh_token',
    }) {
      return AuthResponse(
        tokens: AuthTokens(access: access, refresh: refresh),
        user: AuthUser(
          id: userId,
          username: username,
          email: email,
          role: role,
        ),
      );
    }

    group('Initial state', () {
      test('starts in initial state', () {
        expect(authProvider.state, AuthState.initial);
        expect(authProvider.user, isNull);
        expect(authProvider.errorMessage, isNull);
        expect(authProvider.isLoading, isFalse);
        expect(authProvider.isAuthenticated, isFalse);
        expect(authProvider.isOperationInProgress, isFalse);
      });
    });

    group('initialize()', () {
      test('sets unauthenticated when no tokens stored', () async {
        when(mockTokenStorage.hasTokens()).thenAnswer((_) async => false);

        await authProvider.initialize();

        expect(authProvider.state, AuthState.unauthenticated);
        verify(mockTokenStorage.hasTokens()).called(1);
      });

      test('sets authenticated when tokens exist', () async {
        when(mockTokenStorage.hasTokens()).thenAnswer((_) async => true);

        await authProvider.initialize();

        expect(authProvider.state, AuthState.authenticated);
        verify(mockTokenStorage.hasTokens()).called(1);
      });

      test('sets unauthenticated when hasTokens throws', () async {
        when(mockTokenStorage.hasTokens()).thenThrow(Exception('Storage unavailable'));

        await authProvider.initialize();

        expect(authProvider.state, AuthState.unauthenticated);
      });

      test('shows loading during initialization', () async {
        final completer = Completer<bool>();
        when(mockTokenStorage.hasTokens()).thenAnswer((_) => completer.future);

        final initFuture = authProvider.initialize();

        expect(authProvider.state, AuthState.loading);
        expect(authProvider.isLoading, isTrue);

        completer.complete(false);
        await initFuture;

        expect(authProvider.state, AuthState.unauthenticated);
      });
    });

    group('login()', () {
      const username = 'testuser';
      const password = 'SecurePass123';
      const email = 'test@example.com';

      test('returns true and sets authenticated on success', () async {
        final response = createAuthResponse(
          username: username,
          email: email,
        );
        when(mockApiService.login(username: username, password: password))
            .thenAnswer((_) async => response);
        when(mockTokenStorage.saveTokens(accessToken: anyNamed('accessToken'), refreshToken: anyNamed('refreshToken')))
            .thenAnswer((_) async => Future.value());

        final result = await authProvider.login(usernameOrEmail: username, password: password);

        expect(result, isTrue);
        expect(authProvider.state, AuthState.authenticated);
        expect(authProvider.user, isNotNull);
        expect(authProvider.user!.username, username);
        expect(authProvider.user!.email, email);
        verify(mockTokenStorage.saveTokens(
          accessToken: 'access_token',
          refreshToken: 'refresh_token',
        )).called(1);
      });

      test('returns false and sets error on AuthApiException', () async {
        when(mockApiService.login(username: username, password: password))
            .thenThrow(AuthApiException('Invalid credentials', statusCode: 400));

        final result = await authProvider.login(usernameOrEmail: username, password: password);

        expect(result, isFalse);
        expect(authProvider.state, AuthState.error);
        expect(authProvider.errorMessage, 'Invalid credentials');
        expect(authProvider.user, isNull);
        verifyNever(mockTokenStorage.saveTokens(
          accessToken: anyNamed('accessToken'),
          refreshToken: anyNamed('refreshToken'),
        ));
      });

      test('returns false and sets error on generic exception', () async {
        when(mockApiService.login(username: username, password: password))
            .thenThrow(Exception('Network error'));

        final result = await authProvider.login(usernameOrEmail: username, password: password);

        expect(result, isFalse);
        expect(authProvider.state, AuthState.error);
        expect(authProvider.errorMessage, contains('Login failed'));
      });

test('shows operation in progress during login', () async {
      final completer = Completer<AuthResponse>();
      when(mockApiService.login(username: username, password: password))
          .thenAnswer((_) => completer.future);

      final loginFuture = authProvider.login(usernameOrEmail: username, password: password);

      // Give time for the state to update
      await Future.delayed(Duration.zero);

      expect(authProvider.isOperationInProgress, isTrue);

      completer.complete(createAuthResponse());
      await loginFuture;

      expect(authProvider.isOperationInProgress, isFalse);
    });

    test('prevents duplicate submission', () async {
      final completer = Completer<AuthResponse>();
      when(mockApiService.login(username: username, password: password))
          .thenAnswer((_) => completer.future);

      // Start first call, don't await it yet
      final firstCall = authProvider.login(usernameOrEmail: username, password: password);
      
      // Immediately try second call while first is in progress
      final secondCall = authProvider.login(usernameOrEmail: username, password: password);

      // Second call should be rejected immediately (returns false)
      final secondResult = await secondCall;
      expect(secondResult, isFalse);

      // Now complete the first call
      completer.complete(createAuthResponse());
      await firstCall;
    });

      test('resets loading state after success', () async {
        when(mockApiService.login(username: username, password: password))
            .thenAnswer((_) async => createAuthResponse());
        when(mockTokenStorage.saveTokens(accessToken: anyNamed('accessToken'), refreshToken: anyNamed('refreshToken')))
            .thenAnswer((_) async => Future.value());

        await authProvider.login(usernameOrEmail: username, password: password);

        expect(authProvider.isLoading, isFalse);
        expect(authProvider.isOperationInProgress, isFalse);
      });

      test('resets loading state after failure', () async {
        when(mockApiService.login(username: username, password: password))
            .thenThrow(AuthApiException('Invalid credentials'));

        await authProvider.login(usernameOrEmail: username, password: password);

        expect(authProvider.isLoading, isFalse);
        expect(authProvider.isOperationInProgress, isFalse);
      });
    });

    group('registerCustomer()', () {
      const username = 'newcustomer';
      const email = 'new@example.com';
      const password = 'SecurePass123';

      test('returns true and sets authenticated on success', () async {
        final response = createAuthResponse(
          username: username,
          email: email,
          role: 'CUSTOMER',
        );
        when(mockApiService.registerCustomer(username: username, email: email, password: password))
            .thenAnswer((_) async => response);
        when(mockTokenStorage.saveTokens(accessToken: anyNamed('accessToken'), refreshToken: anyNamed('refreshToken')))
            .thenAnswer((_) async => Future.value());

        final result = await authProvider.registerCustomer(
          username: username,
          email: email,
          password: password,
        );

        expect(result, isTrue);
        expect(authProvider.state, AuthState.authenticated);
        expect(authProvider.user!.role, 'CUSTOMER');
      });

      test('returns false and does not save tokens on failure', () async {
        when(mockApiService.registerCustomer(username: username, email: email, password: password))
            .thenThrow(AuthApiException('Email already registered', statusCode: 400));

        final result = await authProvider.registerCustomer(
          username: username,
          email: email,
          password: password,
        );

        expect(result, isFalse);
        expect(authProvider.state, AuthState.error);
        expect(authProvider.user, isNull);
        verifyNever(mockTokenStorage.saveTokens(
          accessToken: anyNamed('accessToken'),
          refreshToken: anyNamed('refreshToken'),
        ));
      });

test('prevents duplicate submission', () async {
      final completer = Completer<AuthResponse>();
      when(mockApiService.registerCustomer(username: username, email: email, password: password))
          .thenAnswer((_) => completer.future);

      final firstCall = authProvider.registerCustomer(username: username, email: email, password: password);
      final secondCall = authProvider.registerCustomer(username: username, email: email, password: password);

      final secondResult = await secondCall;
      expect(secondResult, isFalse);

      completer.complete(createAuthResponse(role: 'CUSTOMER'));
      await firstCall;
    });
    });

    group('registerOwner()', () {
      const username = 'newowner';
      const email = 'owner@example.com';
      const password = 'SecurePass123';
      const shopName = 'My New Shop';

      test('returns true and sets authenticated on success', () async {
        final response = createAuthResponse(
          username: username,
          email: email,
          role: 'SHOP_OWNER',
        );
        when(mockApiService.registerOwner(
          username: username,
          email: email,
          password: password,
          shopName: shopName,
        )).thenAnswer((_) async => response);
        when(mockTokenStorage.saveTokens(accessToken: anyNamed('accessToken'), refreshToken: anyNamed('refreshToken')))
            .thenAnswer((_) async => Future.value());

        final result = await authProvider.registerOwner(
          username: username,
          email: email,
          password: password,
          shopName: shopName,
        );

        expect(result, isTrue);
        expect(authProvider.state, AuthState.authenticated);
        expect(authProvider.user!.role, 'SHOP_OWNER');
      });

      test('returns false and does not save tokens on failure', () async {
        when(mockApiService.registerOwner(
          username: username,
          email: email,
          password: password,
          shopName: shopName,
        )).thenThrow(AuthApiException('Username already taken', statusCode: 400));

        final result = await authProvider.registerOwner(
          username: username,
          email: email,
          password: password,
          shopName: shopName,
        );

        expect(result, isFalse);
        expect(authProvider.state, AuthState.error);
        verifyNever(mockTokenStorage.saveTokens(
          accessToken: anyNamed('accessToken'),
          refreshToken: anyNamed('refreshToken'),
        ));
      });
    });

    group('logout()', () {
      test('clears tokens and sets unauthenticated', () async {
        // First set up authenticated state
        when(mockTokenStorage.hasTokens()).thenAnswer((_) async => true);
        await authProvider.initialize();

        expect(authProvider.state, AuthState.authenticated);

        when(mockTokenStorage.clearTokens()).thenAnswer((_) async => Future.value());

        await authProvider.logout();

        expect(authProvider.state, AuthState.unauthenticated);
        expect(authProvider.user, isNull);
        verify(mockTokenStorage.clearTokens()).called(1);
      });

      test('works even when already unauthenticated', () async {
        when(mockTokenStorage.clearTokens()).thenAnswer((_) async => Future.value());

        await authProvider.logout();

        expect(authProvider.state, AuthState.unauthenticated);
        verify(mockTokenStorage.clearTokens()).called(1);
      });

      test('shows loading during logout', () async {
        final completer = Completer<void>();
        when(mockTokenStorage.clearTokens()).thenAnswer((_) => completer.future);

        final logoutFuture = authProvider.logout();

        expect(authProvider.isOperationInProgress, isTrue);

        completer.complete();
        await logoutFuture;

        expect(authProvider.isOperationInProgress, isFalse);
      });
    });

    group('clearError()', () {
      test('clears error message and resets state', () async {
        when(mockApiService.login(username: 'u', password: 'p'))
            .thenThrow(AuthApiException('Invalid credentials'));

        await authProvider.login(usernameOrEmail: 'u', password: 'p');

        expect(authProvider.state, AuthState.error);
        expect(authProvider.errorMessage, isNotNull);

        authProvider.clearError();

        expect(authProvider.errorMessage, isNull);
        expect(authProvider.state, AuthState.unauthenticated);
      });
    });

    group('State transitions', () {
      test('initialize -> unauthenticated -> login -> authenticated', () async {
        when(mockTokenStorage.hasTokens()).thenAnswer((_) async => false);
        await authProvider.initialize();
        expect(authProvider.state, AuthState.unauthenticated);

        when(mockApiService.login(username: 'u', password: 'p'))
            .thenAnswer((_) async => createAuthResponse());
        when(mockTokenStorage.saveTokens(accessToken: anyNamed('accessToken'), refreshToken: anyNamed('refreshToken')))
            .thenAnswer((_) async => Future.value());

        await authProvider.login(usernameOrEmail: 'u', password: 'p');
        expect(authProvider.state, AuthState.authenticated);
        expect(authProvider.user, isNotNull);
      });

      test('authenticated -> logout -> unauthenticated', () async {
        when(mockTokenStorage.hasTokens()).thenAnswer((_) async => true);
        await authProvider.initialize();
        expect(authProvider.state, AuthState.authenticated);

        when(mockTokenStorage.clearTokens()).thenAnswer((_) async => Future.value());
        await authProvider.logout();

        expect(authProvider.state, AuthState.unauthenticated);
      });
    });
  });
}