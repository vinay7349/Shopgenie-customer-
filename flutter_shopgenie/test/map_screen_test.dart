import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shopgenie/features/nearby_shops/services/location_service.dart';
import 'package:shopgenie/models/store_item.dart';
import 'package:shopgenie/screens/map_screen.dart';

class _FakeLocationService implements LocationService {
  int requests = 0;

  @override
  Future<LocationResult> getCurrentLocation() async {
    requests++;
    return const LocationResult(status: LocationAccessStatus.denied);
  }

  @override
  Future<bool> openAppSettings() async => true;
}

StoreItem _shop(String id, String name) => StoreItem(
      id: id,
      name: name,
      category: 'Grocery',
      distance: '',
      rating: 'N/A',
      address: 'Address for $name',
      emoji: '🛒',
      selfCheckout: false,
    );

Widget _buildMapScreen({
  required Future<List<StoreItem>> Function() loadShops,
  required _FakeLocationService locationService,
  required ValueChanged<StoreItem> onSelectShop,
}) {
  return MaterialApp(
    home: MapScreen(
      currentLocation: 'Unknown',
      onSelectStore: onSelectShop,
      onOpenScanner: () {},
      locationService: locationService,
      loadShops: loadShops,
    ),
  );
}

void main() {
  testWidgets('lists real shops and opens the selected shop', (tester) async {
    final locationService = _FakeLocationService();
    StoreItem? selectedShop;
    final shop = _shop('shop-42', 'Backend Grocery');

    await tester.pumpWidget(
      _buildMapScreen(
        loadShops: () async => [shop],
        locationService: locationService,
        onSelectShop: (selected) => selectedShop = selected,
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text('Find shops near you'), findsOneWidget);
    expect(locationService.requests, 0);
    await tester.tap(find.text('Not now'));
    await tester.pumpAndSettle();
    expect(locationService.requests, 0);

    await tester.tap(find.byTooltip('Show list'));
    await tester.pumpAndSettle();
    expect(find.text('Backend Grocery'), findsOneWidget);

    await tester.tap(find.text('Backend Grocery'));
    expect(selectedShop, same(shop));
  });

  testWidgets('shows an explicit empty state for no registered shops',
      (tester) async {
    await tester.pumpWidget(
      _buildMapScreen(
        loadShops: () async => [],
        locationService: _FakeLocationService(),
        onSelectShop: (_) {},
      ),
    );
    await tester.pumpAndSettle();
    await tester.tap(find.text('Not now'));
    await tester.pumpAndSettle();
    await tester.tap(find.byTooltip('Show list'));
    await tester.pumpAndSettle();

    expect(find.text('There are no registered shops to show yet.'),
        findsOneWidget);
  });

  testWidgets('keeps the shop list usable after backend failure',
      (tester) async {
    await tester.pumpWidget(
      _buildMapScreen(
        loadShops: () async => throw Exception('Backend unavailable'),
        locationService: _FakeLocationService(),
        onSelectShop: (_) {},
      ),
    );
    await tester.pumpAndSettle();
    await tester.tap(find.text('Not now'));
    await tester.pumpAndSettle();
    await tester.tap(find.byTooltip('Show list'));
    await tester.pumpAndSettle();

    expect(
        find.text('Could not load shops. Check your connection and try again.'),
        findsOneWidget);
    expect(find.text('Nearby Shops'), findsOneWidget);
  });
}
