import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:shopgenie/features/nearby_shops/widgets/shop_map_view.dart';
import 'package:shopgenie/models/store_item.dart';

StoreItem _shop({
  required String id,
  double? lat,
  double? lng,
}) {
  return StoreItem(
    id: id,
    name: 'Shop $id',
    category: 'Grocery',
    distance: '',
    rating: 'N/A',
    address: 'Address $id',
    emoji: '🛒',
    selfCheckout: false,
    lat: lat,
    lng: lng,
  );
}

void main() {
  testWidgets('renders OpenStreetMap tiles and visible attribution',
      (tester) async {
    final controller = MapController();

    await tester.pumpWidget(
      MaterialApp(
        home: SizedBox(
          width: 400,
          height: 600,
          child: ShopMapView(
            controller: controller,
            initialTarget: const LatLng(12.5, 77.25),
            initialZoom: 13,
            markers: const [],
            onMapReady: () {},
          ),
        ),
      ),
    );

    final tileLayer = tester.widget<TileLayer>(find.byType(TileLayer));
    expect(
      tileLayer.urlTemplate,
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    );
    expect(find.text('© OpenStreetMap contributors'), findsOneWidget);

    await tester.pumpWidget(const SizedBox.shrink());
    controller.dispose();
  });

  group('buildShopMarkers', () {
    test('maps valid backend coordinates to markers with shop identity', () {
      StoreItem? selectedShop;
      final shop = _shop(id: 'backend-42', lat: 12.5, lng: 77.25);

      final markers = buildShopMarkers(
        [shop],
        onShopSelected: (selected) => selectedShop = selected,
      );

      expect(markers, hasLength(1));
      final marker = markers.single;
      expect((marker.key! as ValueKey<String>).value, 'shop-marker-backend-42');
      expect(marker.point.latitude, 12.5);
      expect(marker.point.longitude, 77.25);
      final markerTap = marker.child as GestureDetector;
      final tooltip = markerTap.child as Tooltip;
      expect(tooltip.message, 'Shop backend-42');
      markerTap.onTap!();
      expect(selectedShop, same(shop));
    });

    test('does not create markers for missing or invalid coordinates', () {
      final markers = buildShopMarkers(
        [
          _shop(id: 'missing', lat: null, lng: null),
          _shop(id: 'invalid-latitude', lat: 91, lng: 20),
          _shop(id: 'invalid-longitude', lat: 12, lng: 181),
        ],
        onShopSelected: (_) {},
      );

      expect(markers, isEmpty);
    });
  });
}
