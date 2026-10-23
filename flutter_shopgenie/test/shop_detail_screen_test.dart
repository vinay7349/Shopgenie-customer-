import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;

import 'package:shopgenie/models/cart_item.dart';
import 'package:shopgenie/models/store_item.dart';
import 'package:shopgenie/screens/shop_detail_screen.dart';
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

/// A valid StoreItem for use in ShopDetailScreen tests.
StoreItem _testStore() {
  return const StoreItem(
    id: '1',
    name: 'Test Shop',
    category: 'Supermarket',
    distance: '350 m away',
    rating: '4.8 \u2605',
    address: '14th Main Rd',
    emoji: '🥦',
    selfCheckout: false,
    offer: null,
    description: 'A test shop',
    lat: 12.9340,
    lng: 77.6250,
    hours: '9 AM - 5 PM',
    phone: '555-1234',
    followers: 100,
    isFollowing: false,
  );
}

Widget _buildTestWidget({
  required StoreItem store,
  required VoidCallback onBack,
  required VoidCallback onStartScan,
  required void Function(CartItem) onAddToCart,
}) {
  return MaterialApp(
    home: ShopDetailScreen(
      store: store,
      onBack: onBack,
      onStartScan: onStartScan,
      onAddToCart: onAddToCart,
    ),
  );
}

void main() {
  group('ShopDetailScreen live products', () {
    late StoreItem testStore;
    late MockHttpClient mockClient;

    setUp(() {
      testStore = _testStore();
      mockClient = MockHttpClient(
        handler: (request) async =>
            _jsonStreamedResponse({
              'count': 1,
              'results': [_productJson(id: 1, name: 'Live Product')],
            }, 200),
      );
      ShopService.setHttpClientForTesting(mockClient);
    });

    tearDown(() {
      ShopService.setHttpClientForTesting(null);
    });

    testWidgets('displays live products instead of mock data', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(
        _buildTestWidget(
          store: testStore,
          onBack: () {},
          onStartScan: () {},
          onAddToCart: (_) {},
        ),
      );
      await tester.pumpAndSettle();

      // Live product from API should be displayed.
      expect(find.text('Live Product'), findsOneWidget);

      // Mock product names should NOT appear.
      expect(find.text("Coca-Cola 500ml"), findsNothing);
      expect(find.text("Lay's Classic Salted"), findsNothing);

      // Item count should reflect live data.
      expect(find.text('1 items'), findsOneWidget);
    });

    testWidgets('shows empty state when API returns no products', (
      WidgetTester tester,
    ) async {
      final emptyClient = MockHttpClient(
        handler: (request) async =>
            _jsonStreamedResponse({'count': 0, 'results': []}, 200),
      );
      ShopService.setHttpClientForTesting(emptyClient);

      await tester.pumpWidget(
        _buildTestWidget(
          store: testStore,
          onBack: () {},
          onStartScan: () {},
          onAddToCart: (_) {},
        ),
      );
      await tester.pumpAndSettle();

      expect(
        find.text('This shop currently has no published products available.'),
        findsOneWidget,
      );
    });

    testWidgets('shows error state with Retry button when API fails', (
      WidgetTester tester,
    ) async {
      final errorClient = MockHttpClient(
        handler: (request) async =>
            _jsonStreamedResponse({'detail': 'Server error'}, 500),
      );
      ShopService.setHttpClientForTesting(errorClient);

      await tester.pumpWidget(
        _buildTestWidget(
          store: testStore,
          onBack: () {},
          onStartScan: () {},
          onAddToCart: (_) {},
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('Could not load products'), findsOneWidget);
      expect(find.text('Retry'), findsOneWidget);
    });

    testWidgets('retry button triggers fresh product request', (
      WidgetTester tester,
    ) async {
      var callCount = 0;
      final retryClient = MockHttpClient(
        handler: (request) async {
          callCount++;
          if (callCount == 1) {
            return _jsonStreamedResponse(
                {'detail': 'Server error'}, 500);
          }
          return _jsonStreamedResponse({
            'count': 1,
            'results': [_productJson(id: 2, name: 'After Retry')],
          }, 200);
        },
      );
      ShopService.setHttpClientForTesting(retryClient);

      await tester.pumpWidget(
        _buildTestWidget(
          store: testStore,
          onBack: () {},
          onStartScan: () {},
          onAddToCart: (_) {},
        ),
      );
      await tester.pumpAndSettle();

      // Error state first.
      expect(find.text('Could not load products'), findsOneWidget);
      expect(find.text('Live Product'), findsNothing);

      // Tap Retry.
      await tester.tap(find.text('Retry'));
      await tester.pumpAndSettle();

      // After retry, new product should be displayed.
      expect(find.text('After Retry'), findsOneWidget);
      expect(find.text('1 items'), findsOneWidget);
    });

    testWidgets('network failure does not crash the screen', (
      WidgetTester tester,
    ) async {
      final networkClient = MockHttpClient(
        handler: (request) async {
          throw SocketException('Connection refused');
        },
      );
      ShopService.setHttpClientForTesting(networkClient);

      await tester.pumpWidget(
        _buildTestWidget(
          store: testStore,
          onBack: () {},
          onStartScan: () {},
          onAddToCart: (_) {},
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('Could not load products'), findsOneWidget);
      expect(find.text('Check your connection and try again.'), findsOneWidget);
      expect(find.text('Retry'), findsOneWidget);
    });

    testWidgets('Add to Bag remains functional with live products', (
      WidgetTester tester,
    ) async {
      CartItem? addedItem;
      await tester.pumpWidget(
        _buildTestWidget(
          store: testStore,
          onBack: () {},
          onStartScan: () {},
          onAddToCart: (item) {
            addedItem = item;
          },
        ),
      );
      await tester.pumpAndSettle();

      // Tap Add to Bag.
      await tester.tap(find.text('Add to Bag').first);
      await tester.pump();

      expect(addedItem, isNotNull);
      expect(addedItem!.name, 'Live Product');
      expect(addedItem!.id, '1');
    });
  });
}
