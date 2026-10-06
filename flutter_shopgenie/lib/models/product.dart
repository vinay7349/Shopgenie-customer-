class Product {
  final String id;
  final String name;
  final String brand;
  final String category;
  final String size;
  final double price;
  final String? image;
  final String emoji;
  final double confidence;
  final String storeId;
  final String storeName;

  const Product({
    required this.id,
    required this.name,
    this.brand = '',
    this.category = '',
    this.size = '',
    required this.price,
    this.image,
    this.emoji = '🛍️',
    this.confidence = 0.95,
    this.storeId = '1',
    this.storeName = 'GreenLeaf Organic Grocers',
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id']?.toString() ?? '',
      name: json['name'] as String? ?? 'Product',
      brand: json['brand'] as String? ?? '',
      category: json['category'] as String? ?? '',
      size: json['size'] as String? ?? '',
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      image: json['image'] as String?,
      emoji: json['emoji'] as String? ?? '🛍️',
      confidence: (json['confidence'] as num?)?.toDouble() ?? 0.95,
      storeId: json['store_id']?.toString() ?? '1',
      storeName: json['store_name'] as String? ?? 'Nearby Store',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'brand': brand,
      'category': category,
      'size': size,
      'price': price,
      'image': image,
      'emoji': emoji,
      'confidence': confidence,
      'store_id': storeId,
      'store_name': storeName,
    };
  }

  Product copyWith({
    String? id,
    String? name,
    String? brand,
    String? category,
    String? size,
    double? price,
    String? image,
    String? emoji,
    double? confidence,
    String? storeId,
    String? storeName,
  }) {
    return Product(
      id: id ?? this.id,
      name: name ?? this.name,
      brand: brand ?? this.brand,
      category: category ?? this.category,
      size: size ?? this.size,
      price: price ?? this.price,
      image: image ?? this.image,
      emoji: emoji ?? this.emoji,
      confidence: confidence ?? this.confidence,
      storeId: storeId ?? this.storeId,
      storeName: storeName ?? this.storeName,
    );
  }
}
