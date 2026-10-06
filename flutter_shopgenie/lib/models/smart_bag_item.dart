import 'product.dart';

class SmartBagItem {
  final String id;
  final String storeId;
  final String name;
  final String brand;
  final String category;
  final String size;
  final double price;
  final String emoji;
  final String? image;
  final double confidence;
  int quantity;

  SmartBagItem({
    required this.id,
    this.storeId = '1',
    required this.name,
    this.brand = '',
    this.category = '',
    this.size = '',
    required this.price,
    this.emoji = '🛍️',
    this.image,
    this.confidence = 0.95,
    this.quantity = 1,
  });

  factory SmartBagItem.fromProduct(Product product, {int quantity = 1}) {
    return SmartBagItem(
      id: product.id,
      storeId: product.storeId,
      name: product.name,
      brand: product.brand,
      category: product.category,
      size: product.size,
      price: product.price,
      emoji: product.emoji,
      image: product.image,
      confidence: product.confidence,
      quantity: quantity,
    );
  }

  double get totalPrice => price * quantity;
}
