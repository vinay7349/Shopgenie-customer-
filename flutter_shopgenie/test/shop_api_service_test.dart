import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;

import 'package:shopgenie/services/shop_api_service.dart';
import 'package:shopgenie/services/shop_service.dart';

/// A mock [http.Client] that returns canned [http.StreamedResponse]s based on
/// the request. Extends [http.BaseClient] so its [send] method can be
/// overridden; [http.Client].get() and other convenience methods delegate to
/// [send].
class MockHttpClient extends http.BaseClient {
  final Future<http.StreamedResponse> Function(http.BaseRequest request)
      handler;

  MockHttpClient({required this.handler});

  @override
  Future<http.StreamedResponse> send(http.BaseRequest request) async {
    return handler(request);
  }
}

/// Builds an [http.StreamedResponse] with a JSON-encoded body.
http.StreamedResponse _jsonStreamedResponse(Object body, int statusCode) {
  final bodyString = jsonEncode(body);
  final bytes = utf8.encode(bodyString);
  return http.StreamedResponse(
    Stream.fromIterable([bytes]),
    statusCode,
    headers: {'content-type': 'application/json'},
    contentLength: bytes.length,
  );
}

void main() {
  group('ShopApiService.fetchShops', () {
    test('parses valid paginated shop response', () async {
      final client = MockHttpClient(
        handler: (request) async {
          expect(request.url.queryParameters['page'], '1');
          expect(request.url.queryParameters['page_size'], '20');
          return _jsonStreamedResponse({
            'count': 2,
            'next': null,
            'previous': null,
            'results': [
              {
                'id': 1,
                'name': 'Shop A',
                'category': 'Grocery',
                'address': '123 Main St',
                'phone': '555-1234',
                'business_hours': '9 AM - 5 PM',
                'rating': '4.50',
                'status': 'PUBLISHED',
              },
              {
                'id': '2',
                'name': 'Shop B',
                'category': 'Bakery',
                'address': '456 Oak Ave',
                'phone': '555-5678',
                'hours': '10 AM - 6 PM',
                'rating': 4.0,
                'status': 'PUBLISHED',
              },
            ],
          }, 200);
        },
      );

      final service = ShopApiService(client: client);
      final shops = await service.fetchShops();

      expect(shops, hasLength(2));
      expect(shops[0].id, '1');
      expect(shops[0].name, 'Shop A');
      expect(shops[0].hours, '9 AM - 5 PM');
      expect(shops[0].rating, '4.5 ★');
      expect(shops[1].id, '2');
      expect(shops[1].name, 'Shop B');
      expect(shops[1].hours, '10 AM - 6 PM');
      expect(shops[1].rating, '4.0 ★');
    });

    test('returns empty list for empty results', () async {
      final client = MockHttpClient(
        handler: (request) async => _jsonStreamedResponse({
          'count': 0,
          'next': null,
          'previous': null,
          'results': [],
        }, 200),
      );

      final service = ShopApiService(client: client);
      final shops = await service.fetchShops();

      expect(shops, isEmpty);
    });

    test('forwards category query parameter when not All', () async {
      String? capturedCategory;
      final client = MockHttpClient(
        handler: (request) async {
          capturedCategory = request.url.queryParameters['category'];
          return _jsonStreamedResponse({'count': 0, 'results': []}, 200);
        },
      );

      final service = ShopApiService(client: client);
      await service.fetchShops(category: 'Supermarket');

      expect(capturedCategory, 'Supermarket');
    });

    test('does not forward category when All', () async {
      String? capturedCategory;
      final client = MockHttpClient(
        handler: (request) async {
          capturedCategory = request.url.queryParameters['category'];
          return _jsonStreamedResponse({'count': 0, 'results': []}, 200);
        },
      );

      final service = ShopApiService(client: client);
      await service.fetchShops(category: 'All');

      expect(capturedCategory, isNull);
    });

    test('forwards search query parameter', () async {
      String? capturedSearch;
      final client = MockHttpClient(
        handler: (request) async {
          capturedSearch = request.url.queryParameters['search'];
          return _jsonStreamedResponse({'count': 0, 'results': []}, 200);
        },
      );

      final service = ShopApiService(client: client);
      await service.fetchShops(search: 'bakery');

      expect(capturedSearch, 'bakery');
    });

    test('forwards page and page_size query parameters', () async {
      String? capturedPage;
      String? capturedPageSize;
      final client = MockHttpClient(
        handler: (request) async {
          capturedPage = request.url.queryParameters['page'];
          capturedPageSize = request.url.queryParameters['page_size'];
          return _jsonStreamedResponse({'count': 0, 'results': []}, 200);
        },
      );

      final service = ShopApiService(client: client);
      await service.fetchShops(page: 3, pageSize: 10);

      expect(capturedPage, '3');
      expect(capturedPageSize, '10');
    });

    test('throws ShopApiException with statusCode on HTTP 404', () async {
      final client = MockHttpClient(
        handler: (request) async =>
            _jsonStreamedResponse({'detail': 'Not found'}, 404),
      );

      final service = ShopApiService(client: client);
      expect(
        () => service.fetchShops(),
        throwsA(predicate<ShopApiException>((e) => e.statusCode == 404)),
      );
    });

    test('throws ShopApiException with statusCode on HTTP 500', () async {
      final client = MockHttpClient(
        handler: (request) async =>
            _jsonStreamedResponse({'detail': 'Server error'}, 500),
      );

      final service = ShopApiService(client: client);
      expect(
        () => service.fetchShops(),
        throwsA(predicate<ShopApiException>((e) => e.statusCode == 500)),
      );
    });

    test('throws FormatException on malformed JSON', () async {
      final client = MockHttpClient(
        handler: (request) async {
          final bytes = utf8.encode('not json');
          return http.StreamedResponse(
            Stream.fromIterable([bytes]),
            200,
            headers: {'content-type': 'application/json'},
            contentLength: bytes.length,
          );
        },
      );

      final service = ShopApiService(client: client);
      expect(
        () => service.fetchShops(),
        throwsA(isA<FormatException>()),
      );
    });

    test('throws ShopApiException when results key is missing', () async {
      final client = MockHttpClient(
        handler: (request) async =>
            _jsonStreamedResponse({'count': 0}, 200),
      );

      final service = ShopApiService(client: client);
      expect(
        () => service.fetchShops(),
        throwsA(isA<ShopApiException>()),
      );
    });

    test('throws ShopApiException when results is not a list', () async {
      final client = MockHttpClient(
        handler: (request) async =>
            _jsonStreamedResponse({'count': 0, 'results': 'not a list'}, 200),
      );

      final service = ShopApiService(client: client);
      expect(
        () => service.fetchShops(),
        throwsA(isA<ShopApiException>()),
      );
    });

    test('skips non-map entries in results without crashing', () async {
      final client = MockHttpClient(
        handler: (request) async => _jsonStreamedResponse({
          'count': 3,
          'results': [
            'not a map',
            42,
            {'id': 9, 'name': 'Valid Shop', 'category': 'Grocery'},
          ],
        }, 200),
      );

      final service = ShopApiService(client: client);
      final shops = await service.fetchShops();

      expect(shops, hasLength(1));
      expect(shops[0].id, '9');
      expect(shops[0].name, 'Valid Shop');
    });

    test('propagates SocketException on network failure', () async {
      final client = MockHttpClient(
        handler: (request) async {
          throw SocketException('Connection refused');
        },
      );

      final service = ShopApiService(client: client);
      expect(
        () => service.fetchShops(),
        throwsA(isA<SocketException>()),
      );
    });

    test('handles missing optional fields gracefully', () async {
      final client = MockHttpClient(
        handler: (request) async => _jsonStreamedResponse({
          'count': 1,
          'results': [
            {'id': 5, 'name': 'Minimal Shop'},
          ],
        }, 200),
      );

      final service = ShopApiService(client: client);
      final shops = await service.fetchShops();

      expect(shops, hasLength(1));
      expect(shops[0].id, '5');
      expect(shops[0].name, 'Minimal Shop');
      expect(shops[0].category, 'Grocery');
      expect(shops[0].rating, '4.8 ★');
      expect(shops[0].hours, '8:00 AM - 10:00 PM');
      expect(shops[0].phone, '+91 98450 12091');
      expect(shops[0].description, isNull);
      expect(shops[0].offer, isNull);
    });
  });

  group('ShopApiService.fetchShopById', () {
    test('parses valid shop detail response', () async {
      final client = MockHttpClient(
        handler: (request) async {
          expect(request.url.path, contains('/shops/42/'));
          return _jsonStreamedResponse({
            'id': 42,
            'name': 'Detail Shop',
            'category': 'Grocery',
            'address': '789 Detail Rd',
            'phone': '555-9999',
            'business_hours': '9 AM - 5 PM',
            'rating': '4.75',
            'status': 'PUBLISHED',
          }, 200);
        },
      );

      final service = ShopApiService(client: client);
      final shop = await service.fetchShopById('42');

      expect(shop.id, '42');
      expect(shop.name, 'Detail Shop');
      expect(shop.category, 'Grocery');
      expect(shop.address, '789 Detail Rd');
      expect(shop.phone, '555-9999');
      expect(shop.hours, '9 AM - 5 PM');
      expect(shop.rating, '4.8 ★');
    });

    test('throws ShopApiException with statusCode 404 on not found', () async {
      final client = MockHttpClient(
        handler: (request) async =>
            _jsonStreamedResponse({'detail': 'Not found'}, 404),
      );

      final service = ShopApiService(client: client);
      expect(
        () => service.fetchShopById('999'),
        throwsA(predicate<ShopApiException>((e) => e.statusCode == 404)),
      );
    });

    test('throws ShopApiException with statusCode on HTTP 500 for detail', () async {
      final client = MockHttpClient(
        handler: (request) async =>
            _jsonStreamedResponse({'detail': 'Error'}, 500),
      );

      final service = ShopApiService(client: client);
      expect(
        () => service.fetchShopById('1'),
        throwsA(predicate<ShopApiException>((e) => e.statusCode == 500)),
      );
    });

    test('supports non-integer string shop IDs', () async {
      final client = MockHttpClient(
        handler: (request) async {
          expect(request.url.path, contains('/shops/abc-123/'));
          return _jsonStreamedResponse({
            'id': 'abc-123',
            'name': 'String ID Shop',
            'category': 'Cafe',
          }, 200);
        },
      );

      final service = ShopApiService(client: client);
      final shop = await service.fetchShopById('abc-123');

      expect(shop.id, 'abc-123');
      expect(shop.name, 'String ID Shop');
      expect(shop.category, 'Cafe');
    });

    test('throws ShopApiException on empty shop ID', () async {
      final client = MockHttpClient(
        handler: (request) async => _jsonStreamedResponse({}, 200),
      );

      final service = ShopApiService(client: client);
      expect(
        () => service.fetchShopById(''),
        throwsA(predicate<ShopApiException>((e) => e.message.isNotEmpty)),
      );
    });
  });

  group('ShopService.fetchShops (wrapper)', () {
    test('delegates to ShopApiService and returns parsed list', () async {
      final client = MockHttpClient(
        handler: (request) async => _jsonStreamedResponse({
          'count': 1,
          'results': [
            {'id': '7', 'name': 'Wrapper Shop', 'category': 'Pharmacy'},
          ],
        }, 200),
      );

      final shops = await ShopService.fetchShops(client: client);

      expect(shops, hasLength(1));
      expect(shops[0].id, '7');
      expect(shops[0].name, 'Wrapper Shop');
    });

    test('never falls back to mock data on API error', () async {
      final client = MockHttpClient(
        handler: (request) async =>
            _jsonStreamedResponse({'error': 'bad'}, 500),
      );

      expect(
        () => ShopService.fetchShops(client: client),
        throwsA(isA<ShopApiException>()),
      );
    });
  });

  group('ShopService.fetchShopById (wrapper)', () {
    test('delegates to ShopApiService and returns parsed shop', () async {
      final client = MockHttpClient(
        handler: (request) async => _jsonStreamedResponse({
          'id': '3',
          'name': 'Wrapper Detail',
          'category': 'Electronics',
        }, 200),
      );

      final shop = await ShopService.fetchShopById('3', client: client);

      expect(shop.id, '3');
      expect(shop.name, 'Wrapper Detail');
      expect(shop.category, 'Electronics');
    });
  });

  group('isNetworkFailure', () {
    test('returns true for ShopApiException with isNetworkError=true', () {
      final e = ShopApiException('Network down', isNetworkError: true);
      expect(isNetworkFailure(e), isTrue);
    });

    test('returns false for ShopApiException without isNetworkError', () {
      final e = ShopApiException('HTTP error', statusCode: 500);
      expect(isNetworkFailure(e), isFalse);
    });

    test('returns true for SocketException', () {
      final e = SocketException('Connection refused');
      expect(isNetworkFailure(e), isTrue);
    });

    test('returns true for HttpException', () {
      final e = HttpException('Bad URI');
      expect(isNetworkFailure(e), isTrue);
    });

    test('returns false for other exceptions', () {
      expect(isNetworkFailure(StateError('boom')), isFalse);
    });
  });
}
