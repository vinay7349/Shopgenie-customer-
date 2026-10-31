import 'package:flutter_test/flutter_test.dart';
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
      expect(marker.markerId.value, 'backend-42');
      expect(marker.position.latitude, 12.5);
      expect(marker.position.longitude, 77.25);
      expect(marker.infoWindow.title, 'Shop backend-42');
      marker.onTap!();
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
