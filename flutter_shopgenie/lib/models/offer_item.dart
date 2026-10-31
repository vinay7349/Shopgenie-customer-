class OfferItem {
  final String id;
  final String storeId;
  final String storeName;
  final String title;
  final String discount;
  final String? code;
  final String description;
  final String validTill;
  final String category;

  const OfferItem({
    required this.id,
    required this.storeId,
    required this.storeName,
    required this.title,
    required this.discount,
    this.code,
    required this.description,
    required this.validTill,
    required this.category,
  });

  factory OfferItem.fromJson(Map<String, dynamic> json) {
    final id = json['id']?.toString();
    final shopId = json['shop']?.toString();
    final title = json['title']?.toString();
    final discountValue = json['discount_value']?.toString();
    final discountType = json['discount_type']?.toString();
    final endDate = json['end_date']?.toString();
    if (id == null ||
        shopId == null ||
        title == null ||
        discountValue == null ||
        discountType == null ||
        endDate == null) {
      throw const FormatException(
        'Offer response is missing required fields.',
      );
    }
    final parsedDiscount = double.tryParse(discountValue);
    if (parsedDiscount == null) {
      throw const FormatException('Offer discount_value must be numeric.');
    }
    final discountStr = discountType == 'PERCENTAGE'
        ? '${parsedDiscount.toStringAsFixed(0)}% OFF'
        : '₹${parsedDiscount.toStringAsFixed(2)} OFF';
    final validDate = endDate.contains('T') ? endDate.split('T').first : endDate;

    return OfferItem(
      id: id,
      storeId: shopId,
      storeName: json['shop_name']?.toString() ?? '',
      title: title,
      discount: discountStr,
      code: json['code']?.toString(),
      description: json['description']?.toString() ?? '',
      validTill: 'Valid till $validDate',
      category: json['scope']?.toString() ?? '',
    );
  }
}
