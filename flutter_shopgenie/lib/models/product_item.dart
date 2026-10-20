class ProductItem {
  final String id;
  final String storeId;
  final String storeName;
  final String name;
  final String brand;
  final String category;
  final String size;
  final double price;
  final double mrp;
  final String emoji;
  final double stock;
  final String description;
  final bool inStock;
  final double confidence;

  const ProductItem({
    required this.id,
    required this.storeId,
    required this.storeName,
    required this.name,
    this.brand = '',
    required this.category,
    this.size = '',
    required this.price,
    required this.mrp,
    required this.emoji,
    this.stock = 10.0,
    required this.description,
    this.inStock = true,
    this.confidence = 0.95,
  });

  int get discountPercent => mrp > price ? (((mrp - price) / mrp) * 100).round() : 0;
}
