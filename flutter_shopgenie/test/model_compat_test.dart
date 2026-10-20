import 'package:flutter_test/flutter_test.dart';
import 'package:shopgenie/models/store_item.dart';
import 'package:shopgenie/models/product.dart';

void main() {
  group('StoreItem.fromJson', () {
    test('parses integer shop id', () {
      final item = StoreItem.fromJson({'id': 42, 'name': 'Shop', 'category': 'Grocery'});
      expect(item.id, '42');
    });
    test('parses string shop id', () {
      final item = StoreItem.fromJson({'id': '7', 'name': 'Shop', 'category': 'Grocery'});
      expect(item.id, '7');
    });
    test('parses missing id', () {
      final item = StoreItem.fromJson({'name': 'Shop', 'category': 'Grocery'});
      expect(item.id, '');
    });
    test('parses numeric rating', () {
      final item = StoreItem.fromJson({'id': '1', 'name': 'Shop', 'category': 'Grocery', 'rating': 4.5});
      expect(item.rating, '4.5 \u2605');
    });
    test('parses string numeric rating', () {
      final item = StoreItem.fromJson({'id': '1', 'name': 'Shop', 'category': 'Grocery', 'rating': '4.2'});
      expect(item.rating, '4.2 \u2605');
    });
    test('parses pre-formatted rating', () {
      final item = StoreItem.fromJson({'id': '1', 'name': 'Shop', 'category': 'Grocery', 'rating': '4.8 \u2605'});
      expect(item.rating, '4.8 \u2605');
    });
    test('handles null rating', () {
      final item = StoreItem.fromJson({'id': '1', 'name': 'Shop', 'category': 'Grocery'});
      expect(item.rating, '4.8 \u2605');
    });
  });

  group('Product.fromJson', () {
    test('parses price from selling_price', () {
      final p = Product.fromJson({'id': 1, 'name': 'P', 'selling_price': 8.5, 'store_id': 3});
      expect(p.price, 8.5);
      expect(p.storeId, '3');
    });
    test('parses price from price key', () {
      final p = Product.fromJson({'id': 1, 'name': 'P', 'price': 9.0});
      expect(p.price, 9.0);
    });
    test('parses shop as storeId fallback', () {
      final p = Product.fromJson({'id': 1, 'name': 'P', 'price': 5.0, 'shop': 7});
      expect(p.storeId, '7');
    });
  });
}
