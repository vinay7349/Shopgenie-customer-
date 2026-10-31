class ProductItem {
  final String id;
  final String storeId;
  final String storeName;
  final String name;
  final String brand;
  final String category;
  final String size;
  final String unit;
  final String? imageUrl;
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
    this.unit = 'PIECE',
    this.imageUrl,
    required this.price,
    required this.mrp,
    required this.emoji,
    this.stock = 0.0,
    required this.description,
    this.inStock = true,
    this.confidence = 0.0,
  });

  int get discountPercent =>
      mrp > price ? (((mrp - price) / mrp) * 100).round() : 0;

  factory ProductItem.fromJson(Map<String, dynamic> json) {
    final id = json['id']?.toString();
    final name = json['name']?.toString();
    final storeId = (json['store_id'] ?? json['shop'])?.toString() ?? '';
    final storeName = json['store_name']?.toString() ?? '';
    final brand = json['brand']?.toString() ?? '';
    final category = json['category']?.toString() ?? '';
    final size = json['size']?.toString() ?? '';
    final unit = json['unit']?.toString() ?? 'PIECE';
    final rawImageUrl = json['image_url']?.toString().trim();
    final description = json['description']?.toString() ?? '';

    if (id == null || id.isEmpty || name == null || name.isEmpty) {
      throw const FormatException('Product response must include id and name.');
    }
    if (storeId.isEmpty) {
      throw const FormatException('Product response must include a shop id.');
    }
    final priceValue = json['price'] ?? json['selling_price'];
    final price = _parseMoney(priceValue);
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
      unit: unit,
      imageUrl: rawImageUrl == null || rawImageUrl.isEmpty ? null : rawImageUrl,
      price: price,
      mrp: mrp,
      emoji: '🛍️',
      stock: stock,
      description: description,
      inStock: json['is_available'] != null
          ? json['is_available'] == true
          : stock > 0,
      confidence: 0.0,
    );
  }

  static double _parseMoney(dynamic value) {
    if (value == null) {
      throw const FormatException('Product response must include a price.');
    }
    if (value is num) return value.toDouble();
    if (value is String) {
      final trimmed = value.trim();
      if (trimmed.isEmpty) {
        throw const FormatException('Product price must not be empty.');
      }
      final parsed = double.tryParse(trimmed);
      if (parsed != null) return parsed;
    }
    throw const FormatException('Product price must be numeric.');
  }

  static double _parseStock(dynamic value) {
    if (value == null) {
      throw const FormatException(
        'Product response must include stock_quantity.',
      );
    }
    if (value is num) return value.toDouble();
    if (value is String) {
      final trimmed = value.trim();
      if (trimmed.isEmpty) {
        throw const FormatException(
            'Product stock quantity must not be empty.');
      }
      final parsed = double.tryParse(trimmed);
      if (parsed != null) return parsed;
    }
    throw const FormatException('Product stock quantity must be numeric.');
  }
}
