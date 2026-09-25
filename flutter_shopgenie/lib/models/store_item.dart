class StoreItem {
  final String id;
  final String name;
  final String category;
  final String distance;
  final String rating;
  final String address;
  final String emoji;
  final bool selfCheckout;
  final String? offer;
  final String? description;

  const StoreItem({
    required this.id,
    required this.name,
    required this.category,
    required this.distance,
    required this.rating,
    required this.address,
    required this.emoji,
    required this.selfCheckout,
    this.offer,
    this.description,
  });

  factory StoreItem.fromJson(Map<String, dynamic> json) {
    return StoreItem(
      id: json['id'] as String,
      name: json['name'] as String,
      category: json['category'] as String,
      distance: json['distance'] as String,
      rating: json['rating'] as String,
      address: json['address'] as String,
      emoji: json['emoji'] as String,
      selfCheckout: json['selfCheckout'] as bool? ?? false,
      offer: json['offer'] as String?,
      description: json['description'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'category': category,
      'distance': distance,
      'rating': rating,
      'address': address,
      'emoji': emoji,
      'selfCheckout': selfCheckout,
      'offer': offer,
      'description': description,
    };
  }
}
