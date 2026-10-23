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

  factory OfferItem.fromJson(Map<String, dynamic> json) {
    final discountVal = json['discount_value']?.toString() ?? '0';
    final discountType = json['discount_type']?.toString() ?? 'PERCENTAGE';
    final discountStr = discountType == 'PERCENTAGE'
        ? '${double.tryParse(discountVal)?.toStringAsFixed(0) ?? discountVal}% OFF'
        : '₹$discountVal OFF';

    String validDate = 'Limited Time';
    if (json['end_date'] != null) {
      final raw = json['end_date'].toString();
      validDate = raw.contains('T') ? raw.split('T').first : raw;
    }

    return OfferItem(
      id: json['id']?.toString() ?? '',
      storeId: json['shop']?.toString() ?? '',
      storeName: json['shop_name']?.toString() ?? 'Partner Store',
      title: json['title']?.toString() ?? '',
      discount: discountStr,
      code: 'OFFER${json['id'] ?? ''}',
      description: json['description']?.toString() ?? '',
      validTill: 'Valid till $validDate',
      category: json['scope']?.toString() ?? 'General',
    );
  }
}
