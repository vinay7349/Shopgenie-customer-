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

  int get discountPercent =>
      mrp > price ? (((mrp - price) / mrp) * 100).round() : 0;

  factory ProductItem.fromJson(Map<String, dynamic> json) {
    final id = json['id']?.toString() ?? '';
    final name = json['name']?.toString() ?? 'Unknown Product';
    final storeId = (json['store_id'] ?? json['shop'])?.toString() ?? '';
    final storeName = json['store_name']?.toString() ?? '';
    final brand = json['brand']?.toString() ?? '';
    final category = json['category']?.toString() ?? '';
    final size = json['size']?.toString() ?? '';
    final description = json['description']?.toString() ?? '';

    final price = _parseMoney(json['price'] ?? json['selling_price']);
    final mrp = _parseMoney(json['mrp']);
    final stock = _parseStock(json['stock_quantity']);

    return ProductItem(
      id: id,
      storeId: storeId,
      storeName: storeName,
      name: name,
      brand: brand,
      category: category,
      size: size,
      price: price,
      mrp: mrp,
      emoji: '🛍️',
      stock: stock,
      description: description,
      inStock: json['is_available'] != null ? json['is_available'] == true : stock > 0,
      confidence: 0.0,
    );
  }

  static double _parseMoney(dynamic value) {
    if (value == null) return 0.0;
    if (value is num) return value.toDouble();
    if (value is String) {
      final trimmed = value.trim();
      if (trimmed.isEmpty) return 0.0;
      final parsed = double.tryParse(trimmed);
      if (parsed != null) return parsed;
    }
    return 0.0;
  }

  static double _parseStock(dynamic value) {
    if (value == null) return 0.0;
    if (value is num) return value.toDouble();
    if (value is String) {
      final trimmed = value.trim();
      if (trimmed.isEmpty) return 0.0;
      final parsed = double.tryParse(trimmed);
      if (parsed != null) return parsed;
    }
    return 0.0;
  }
}
