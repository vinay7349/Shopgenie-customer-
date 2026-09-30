class ProductItem {
  final String id;
  final String storeId;
  final String storeName;
  final String name;
  final String category;
  final double price;
  final double mrp;
  final String emoji;
  final String barcode;
  final int stock;
  final String description;
  final bool inStock;

  const ProductItem({
    required this.id,
    required this.storeId,
    required this.storeName,
    required this.name,
    required this.category,
    required this.price,
    required this.mrp,
    required this.emoji,
    required this.barcode,
    required this.stock,
    required this.description,
    this.inStock = true,
  });

  int get discountPercent => mrp > price ? (((mrp - price) / mrp) * 100).round() : 0;
}
