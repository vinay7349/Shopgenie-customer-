class CartItem {
  final String id;
  final String storeId;
  final String name;
  final double price;
  final String emoji;
  final String barcode;
  int quantity;

  CartItem({
    required this.id,
    required this.storeId,
    required this.name,
    required this.price,
    required this.emoji,
    required this.barcode,
    this.quantity = 1,
  });

  double get totalPrice => price * quantity;
}
