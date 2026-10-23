import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import 'package:shopgenie/models/auth_models.dart';
import 'package:shopgenie/services/token_storage.dart';

/// Mock storage that implements the same interface as FlutterSecureStorage
/// for testing purposes.
class MockSecureStorage {
  final Map<String, String> _data = {};

  Future<String?> read({required String key}) async {
    return _data[key];
  }

  Future<void> write({required String key, required String value}) async {
    _data[key] = value;
  }

  Future<void> delete({required String key}) async {
    _data.remove(key);
  }
}

/// A testable TokenStorage that accepts a mock storage backend.
class TestableTokenStorage {
  static const String _accessTokenKey = 'auth_access_token';
  static const String _refreshTokenKey = 'auth_refresh_token';

  final MockSecureStorage _storage;

  TestableTokenStorage({MockSecureStorage? storage})
      : _storage = storage ?? MockSecureStorage();

  Future<void> saveTokens({
    required String accessToken,
    required String refreshToken,
  }) async {
    if (accessToken.isEmpty || refreshToken.isEmpty) {
      throw ArgumentError('Access and refresh tokens must not be empty');
    }
    await Future.wait([
      _storage.write(key: _accessTokenKey, value: accessToken),
      _storage.write(key: _refreshTokenKey, value: refreshToken),
    ]);
  }

  Future<String?> getAccessToken() async {
    return _storage.read(key: _accessTokenKey);
  }

  Future<String?> getRefreshToken() async {
    return _storage.read(key: _refreshTokenKey);
  }

  Future<bool> hasTokens() async {
    final access = await getAccessToken();
    final refresh = await getRefreshToken();
    return access != null && access.isNotEmpty &&
        refresh != null && refresh.isNotEmpty;
  }

  Future<void> clearTokens() async {
    await Future.wait([
      _storage.delete(key: _accessTokenKey),
      _storage.delete(key: _refreshTokenKey),
    ]);
  }

  Future<bool> isLoggedIn() async {
    final access = await getAccessToken();
    return access != null && access.isNotEmpty;
  }
}

void main() {
  group('AuthUser', () {
    test('parses valid AuthUser from JSON', () {
      final json = {
        'id': 1,
        'username': 'testuser',
        'email': 'test@example.com',
        'role': 'CUSTOMER',
      };

      final user = AuthUser.fromJson(json);

      expect(user.id, '1');
      expect(user.username, 'testuser');
      expect(user.email, 'test@example.com');
      expect(user.role, 'CUSTOMER');
    });

    test('parses AuthUser with string ID', () {
      final json = {
        'id': 'abc-123',
        'username': 'testuser',
        'email': 'test@example.com',
        'role': 'SHOP_OWNER',
      };

      final user = AuthUser.fromJson(json);

      expect(user.id, 'abc-123');
      expect(user.role, 'SHOP_OWNER');
    });

    test('throws on missing id', () {
      final json = {
        'username': 'testuser',
        'email': 'test@example.com',
        'role': 'CUSTOMER',
      };

      expect(() => AuthUser.fromJson(json), throwsFormatException);
    });

    test('throws on empty id', () {
      final json = {
        'id': '',
        'username': 'testuser',
        'email': 'test@example.com',
        'role': 'CUSTOMER',
      };

      expect(() => AuthUser.fromJson(json), throwsFormatException);
    });

    test('throws on missing username', () {
      final json = {
        'id': 1,
        'email': 'test@example.com',
        'role': 'CUSTOMER',
      };

      expect(() => AuthUser.fromJson(json), throwsFormatException);
    });

    test('throws on missing email', () {
      final json = {
        'id': 1,
        'username': 'testuser',
        'role': 'CUSTOMER',
      };

      expect(() => AuthUser.fromJson(json), throwsFormatException);
    });

    test('throws on missing role', () {
      final json = {
        'id': 1,
        'username': 'testuser',
        'email': 'test@example.com',
      };

      expect(() => AuthUser.fromJson(json), throwsFormatException);
    });

    test('throws on null JSON', () {
      expect(() => AuthUser.fromJson(null as dynamic), throwsA(isA<TypeError>()));
    });

    test('toJson returns correct map', () {
      final user = AuthUser(
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        role: 'CUSTOMER',
      );

      final json = user.toJson();

      expect(json['id'], '1');
      expect(json['username'], 'testuser');
      expect(json['email'], 'test@example.com');
      expect(json['role'], 'CUSTOMER');
    });

    test('equality works correctly', () {
      final user1 = AuthUser(
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        role: 'CUSTOMER',
      );
      final user2 = AuthUser(
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        role: 'CUSTOMER',
      );
      final user3 = AuthUser(
        id: '2',
        username: 'other',
        email: 'other@example.com',
        role: 'SHOP_OWNER',
      );

      expect(user1, equals(user2));
      expect(user1, isNot(equals(user3)));
    });
  });

  group('AuthTokens', () {
    test('parses valid AuthTokens from JSON', () {
      final json = {
        'access': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        'refresh': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      };

      final tokens = AuthTokens.fromJson(json);

      expect(tokens.access, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
      expect(tokens.refresh, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
    });

    test('throws on missing access token', () {
      final json = {
        'refresh': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      };

      expect(() => AuthTokens.fromJson(json), throwsFormatException);
    });

    test('throws on empty access token', () {
      final json = {
        'access': '',
        'refresh': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      };

      expect(() => AuthTokens.fromJson(json), throwsFormatException);
    });

    test('throws on missing refresh token', () {
      final json = {
        'access': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      };

      expect(() => AuthTokens.fromJson(json), throwsFormatException);
    });

    test('throws on null JSON', () {
      expect(() => AuthTokens.fromJson(null as dynamic), throwsA(isA<TypeError>()));
    });

    test('toJson returns correct map', () {
      final tokens = AuthTokens(
        access: 'access_token_here',
        refresh: 'refresh_token_here',
      );

      final json = tokens.toJson();

      expect(json['access'], 'access_token_here');
      expect(json['refresh'], 'refresh_token_here');
    });

    test('equality works correctly', () {
      final t1 = AuthTokens(access: 'a', refresh: 'r');
      final t2 = AuthTokens(access: 'a', refresh: 'r');
      final t3 = AuthTokens(access: 'b', refresh: 'r');

      expect(t1, equals(t2));
      expect(t1, isNot(equals(t3)));
    });
  });

  group('AuthResponse', () {
    test('parses customer registration response', () {
      final json = {
        'access': 'access_token',
        'refresh': 'refresh_token',
        'user': {
          'id': 1,
          'username': 'customer1',
          'email': 'customer1@example.com',
          'role': 'CUSTOMER',
        },
      };

      final response = AuthResponse.fromJson(json);

      expect(response.tokens.access, 'access_token');
      expect(response.tokens.refresh, 'refresh_token');
      expect(response.user.id, '1');
      expect(response.user.username, 'customer1');
      expect(response.user.role, 'CUSTOMER');
      expect(response.shopOwner, isNull);
      expect(response.shop, isNull);
    });

    test('parses owner registration response with shop', () {
      final json = {
        'access': 'access_token',
        'refresh': 'refresh_token',
        'user': {
          'id': 2,
          'username': 'owner1',
          'email': 'owner1@example.com',
          'role': 'SHOP_OWNER',
        },
        'shop': {
          'id': 5,
          'name': 'My Shop',
          'status': 'DRAFT',
        },
      };

      final response = AuthResponse.fromJson(json);

      expect(response.tokens.access, 'access_token');
      expect(response.user.role, 'SHOP_OWNER');
      expect(response.shop, isNotNull);
      expect(response.shop!['id'], 5);
      expect(response.shop!['name'], 'My Shop');
      expect(response.shop!['status'], 'DRAFT');
    });

    test('toJson includes all fields', () {
      final response = AuthResponse(
        tokens: AuthTokens(access: 'a', refresh: 'r'),
        user: AuthUser(id: '1', username: 'u', email: 'e@e.com', role: 'CUSTOMER'),
        shopOwner: AuthUser(id: '2', username: 'o', email: 'o@e.com', role: 'SHOP_OWNER'),
        shop: {'id': 5, 'name': 'Shop', 'status': 'DRAFT'},
      );

      final json = response.toJson();

      expect(json['access'], 'a');
      expect(json['refresh'], 'r');
      expect(json['user']['username'], 'u');
      expect(json['shop_owner']['username'], 'o');
      expect(json['shop']['name'], 'Shop');
    });
  });

  group('TestableTokenStorage', () {
    late TestableTokenStorage storage;
    late MockSecureStorage mockStorage;

    setUp(() {
      mockStorage = MockSecureStorage();
      storage = TestableTokenStorage(storage: mockStorage);
    });

    test('saveTokens and getAccessToken/getRefreshToken work', () async {
      await storage.saveTokens(
        accessToken: 'test_access_token',
        refreshToken: 'test_refresh_token',
      );

      final access = await storage.getAccessToken();
      final refresh = await storage.getRefreshToken();

      expect(access, 'test_access_token');
      expect(refresh, 'test_refresh_token');
    });

    test('hasTokens returns true after saving', () async {
      expect(await storage.hasTokens(), isFalse);

      await storage.saveTokens(
        accessToken: 'access',
        refreshToken: 'refresh',
      );

      expect(await storage.hasTokens(), isTrue);
    });

    test('isLoggedIn returns true after saving access token', () async {
      expect(await storage.isLoggedIn(), isFalse);

      await storage.saveTokens(
        accessToken: 'access',
        refreshToken: 'refresh',
      );

      expect(await storage.isLoggedIn(), isTrue);
    });

    test('clearTokens removes both tokens', () async {
      await storage.saveTokens(
        accessToken: 'access',
        refreshToken: 'refresh',
      );

      expect(await storage.hasTokens(), isTrue);

      await storage.clearTokens();

      expect(await storage.hasTokens(), isFalse);
      expect(await storage.getAccessToken(), isNull);
      expect(await storage.getRefreshToken(), isNull);
    });

    test('saveTokens throws on empty access token', () async {
      expect(
        () => storage.saveTokens(accessToken: '', refreshToken: 'refresh'),
        throwsArgumentError,
      );
    });

    test('saveTokens throws on empty refresh token', () async {
      expect(
        () => storage.saveTokens(accessToken: 'access', refreshToken: ''),
        throwsArgumentError,
      );
    });

    test('getAccessToken returns null when not set', () async {
      final token = await storage.getAccessToken();
      expect(token, isNull);
    });

    test('getRefreshToken returns null when not set', () async {
      final token = await storage.getRefreshToken();
      expect(token, isNull);
    });
  });
}