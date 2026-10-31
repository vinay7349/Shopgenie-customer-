import 'package:flutter_test/flutter_test.dart';
import 'package:shopgenie/models/store_item.dart';

void main() {
  test('parses registered shop coordinates from numeric and string fields', () {
    final shop = StoreItem.fromJson({
      'id': 42,
      'name': 'Registered shop',
      'lat': 12.5,
      'longitude': '77.25',
    });

    expect(shop.id, '42');
    expect(shop.lat, 12.5);
    expect(shop.lng, 77.25);
  });

  test('leaves missing and malformed shop coordinates unset', () {
    final shop = StoreItem.fromJson({
      'id': 43,
      'name': 'Shop without saved coordinates',
      'latitude': 'not-a-coordinate',
      'lng': null,
    });

    expect(shop.lat, isNull);
    expect(shop.lng, isNull);
  });
}
