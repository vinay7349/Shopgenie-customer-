class OfferItem {
  final String id;
  final String storeId;
  final String storeName;
  final String title;
  final String discount;
  final String code;
  final String description;
  final String validTill;
  final String category;

  const OfferItem({
    required this.id,
    required this.storeId,
    required this.storeName,
    required this.title,
    required this.discount,
    required this.code,
    required this.description,
    required this.validTill,
    required this.category,
  });
}
