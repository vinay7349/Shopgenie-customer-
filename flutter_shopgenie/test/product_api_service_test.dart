import 'dart:convert';
import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;

import 'package:shopgenie/models/product_item.dart';
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

/// A minimal valid product JSON object matching the public serializer.
Map<String, dynamic> _productJson({
  dynamic id = 1,
  dynamic shop = 1,
  String name = 'Test Product',
  String category = 'Beverages',
  String brand = 'Test Brand',
  String size = '500 ml',
  dynamic price = '8.00',
  dynamic mrp = '10.00',
  dynamic stock = '5.000',
  String description = 'A test product',
}) {
  return {
    'id': id,
    'shop': shop,
    'store_id': shop.toString(),
    'store_name': 'Test Shop',
    'name': name,
    'category': category,
    'brand': brand,
    'size': size,
    'description': description,
    'mrp': mrp,
    'selling_price': price,
    'price': price,
    'stock_quantity': stock,
    'unit': 'PIECE',
    'image_url': 'https://example.com/image.jpg',
    'status': 'PUBLISHED',
  };
}

void main() {
  group('ProductItem.fromJson', () {
    test('parses valid product with numeric fields', () {
    final p = ProductItem.fromJson(_productJson(
      id: 42,
      shop: 42,
      price: '8.50',
      mrp: '10.00',
      stock: '5.000',
    ));

    expect(p.id, '42');
    expect(p.storeId, '42');
      expect(p.storeName, 'Test Shop');
      expect(p.name, 'Test Product');
      expect(p.category, 'Beverages');
      expect(p.brand, 'Test Brand');
      expect(p.size, '500 ml');
      expect(p.price, 8.5);
      expect(p.mrp, 10.0);
      expect(p.stock, 5.0);
      expect(p.description, 'A test product');
      expect(p.inStock, isTrue);
      expect(p.emoji, '🛍️');
      expect(p.confidence, 0.0);
    });

    test('parses string IDs correctly', () {
      final p = ProductItem.fromJson(_productJson(
        id: 'abc-123',
        shop: 'shop-7',
      ));

      expect(p.id, 'abc-123');
      expect(p.storeId, 'shop-7');
    });

    test('parses numeric price and MRP', () {
      final p = ProductItem.fromJson(_productJson(
        price: 8.5,
        mrp: 10.0,
      ));

      expect(p.price, 8.5);
      expect(p.mrp, 10.0);
    });

    test('parses string price and MRP', () {
      final p = ProductItem.fromJson(_productJson(
        price: '8.50',
        mrp: '10.00',
      ));

      expect(p.price, 8.5);
      expect(p.mrp, 10.0);
    });

    test('uses selling_price as fallback for price', () {
      final json = _productJson(price: '8.50');
      json.remove('price');
      json['selling_price'] = '9.99';

      final p = ProductItem.fromJson(json);
      expect(p.price, 9.99);
    });

    test('parses fractional stock quantity', () {
      final p = ProductItem.fromJson(_productJson(stock: '2.500'));

      expect(p.stock, 2.5);
      expect(p.inStock, isTrue);
    });

    test('derives inStock false when stock is zero', () {
      final p = ProductItem.fromJson(_productJson(stock: '0'));

      expect(p.stock, 0.0);
      expect(p.inStock, isFalse);
    });

    test('derives inStock true when stock is positive', () {
      final p = ProductItem.fromJson(_productJson(stock: '1'));

      expect(p.stock, 1.0);
      expect(p.inStock, isTrue);
    });

    test('handles missing optional fields gracefully', () {
      final p = ProductItem.fromJson({
        'id': 9,
        'name': 'Minimal Product',
      });

      expect(p.id, '9');
      expect(p.name, 'Minimal Product');
      expect(p.storeId, '');
      expect(p.storeName, '');
      expect(p.brand, '');
      expect(p.category, '');
      expect(p.size, '');
      expect(p.price, 0.0);
      expect(p.mrp, 0.0);
      expect(p.stock, 0.0);
      expect(p.description, '');
      expect(p.inStock, isFalse);
      expect(p.emoji, '🛍️');
      expect(p.confidence, 0.0);
    });

    test('handles null optional string fields', () {
      final p = ProductItem.fromJson({
        'id': 1,
        'name': 'Product',
        'brand': null,
        'category': null,
        'size': null,
        'description': null,
      });

      expect(p.brand, '');
      expect(p.category, '');
      expect(p.size, '');
      expect(p.description, '');
    });

    test('uses shop field as storeId fallback', () {
      final p = ProductItem.fromJson({
        'id': 1,
        'name': 'Product',
        'shop': 7,
      });

      expect(p.storeId, '7');
    });
  });

  group('ShopApiService.fetchProductsForShop', () {
    test('parses valid paginated product response', () async {
      final client = MockHttpClient(
        handler: (request) async {
          expect(request.url.queryParameters['shop'], '1');
          return _jsonStreamedResponse({
            'count': 2,
            'next': null,
            'previous': null,
            'results': [
              _productJson(id: 1, name: 'Product A', price: '8.50'),
              _productJson(id: 2, name: 'Product B', price: '12.00'),
            ],
          }, 200);
        },
      );

      final service = ShopApiService(client: client);
      final products = await service.fetchProductsForShop('1');

      expect(products, hasLength(2));
      expect(products[0].id, '1');
      expect(products[0].name, 'Product A');
      expect(products[0].price, 8.5);
      expect(products[1].id, '2');
      expect(products[1].name, 'Product B');
      expect(products[1].price, 12.0);
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
      final products = await service.fetchProductsForShop('1');

      expect(products, isEmpty);
    });

    test('forwards shop ID query parameter', () async {
      String? capturedShop;
      final client = MockHttpClient(
        handler: (request) async {
          capturedShop = request.url.queryParameters['shop'];
          return _jsonStreamedResponse({'count': 0, 'results': []}, 200);
        },
      );

      final service = ShopApiService(client: client);
      await service.fetchProductsForShop('42');

      expect(capturedShop, '42');
    });

    test('normalizes integer shop ID in query parameter', () async {
      String? capturedShop;
      final client = MockHttpClient(
        handler: (request) async {
          capturedShop = request.url.queryParameters['shop'];
          return _jsonStreamedResponse({'count': 0, 'results': []}, 200);
        },
      );

      final service = ShopApiService(client: client);
      await service.fetchProductsForShop('007');

      expect(capturedShop, '7');
    });

    test('does not send page_size query parameter', () async {
      String? capturedPageSize;
      final client = MockHttpClient(
        handler: (request) async {
          capturedPageSize = request.url.queryParameters['page_size'];
          return _jsonStreamedResponse({'count': 0, 'results': []}, 200);
        },
      );

      final service = ShopApiService(client: client);
      await service.fetchProductsForShop('1');

      expect(capturedPageSize, isNull);
    });

    test('throws ShopApiException with statusCode on HTTP 404', () async {
      final client = MockHttpClient(
        handler: (request) async =>
            _jsonStreamedResponse({'detail': 'Not found'}, 404),
      );

      final service = ShopApiService(client: client);
      expect(
        () => service.fetchProductsForShop('1'),
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
        () => service.fetchProductsForShop('1'),
        throwsA(predicate<ShopApiException>((e) => e.statusCode == 500)),
      );
    });

    test('throws ShopApiException on malformed JSON', () async {
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
        () => service.fetchProductsForShop('1'),
        throwsA(isA<ShopApiException>()),
      );
    });

    test('throws ShopApiException when response is not a map', () async {
      final client = MockHttpClient(
        handler: (request) async =>
            _jsonStreamedResponse(['not', 'a', 'map'], 200),
      );

      final service = ShopApiService(client: client);
      expect(
        () => service.fetchProductsForShop('1'),
        throwsA(isA<ShopApiException>()),
      );
    });

    test('throws ShopApiException when results key is missing', () async {
      final client = MockHttpClient(
        handler: (request) async => _jsonStreamedResponse({'count': 0}, 200),
      );

      final service = ShopApiService(client: client);
      expect(
        () => service.fetchProductsForShop('1'),
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
        () => service.fetchProductsForShop('1'),
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
            _productJson(id: 9, name: 'Valid Product'),
          ],
        }, 200),
      );

      final service = ShopApiService(client: client);
      final products = await service.fetchProductsForShop('1');

      expect(products, hasLength(1));
      expect(products[0].id, '9');
      expect(products[0].name, 'Valid Product');
    });

    test('propagates SocketException on network failure', () async {
      final client = MockHttpClient(
        handler: (request) async {
          throw SocketException('Connection refused');
        },
      );

      final service = ShopApiService(client: client);
      expect(
        () => service.fetchProductsForShop('1'),
        throwsA(isA<SocketException>()),
      );
    });
  });

  group('ShopService.fetchProductsForShop (wrapper)', () {
    test('delegates to ShopApiService and returns parsed list', () async {
      final client = MockHttpClient(
        handler: (request) async => _jsonStreamedResponse({
          'count': 1,
          'results': [
            _productJson(id: '7', name: 'Wrapper Product'),
          ],
        }, 200),
      );

      final products =
          await ShopService.fetchProductsForShop('1', client: client);

      expect(products, hasLength(1));
      expect(products[0].id, '7');
      expect(products[0].name, 'Wrapper Product');
    });

    test('never falls back to mock data on API error', () async {
      final client = MockHttpClient(
        handler: (request) async =>
            _jsonStreamedResponse({'error': 'bad'}, 500),
      );

      expect(
        () => ShopService.fetchProductsForShop('1', client: client),
        throwsA(isA<ShopApiException>()),
      );
    });
  });
}
