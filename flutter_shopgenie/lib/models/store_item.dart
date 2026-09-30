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
  final double lat;
  final double lng;
  final String hours;
  final String phone;
  final int followers;
  final bool isFollowing;

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
    this.lat = 12.9250,
    this.lng = 77.5220,
    this.hours = '8:00 AM - 10:00 PM',
    this.phone = '+91 98450 12091',
    this.followers = 384,
    this.isFollowing = false,
  });

  StoreItem copyWith({
    String? id,
    String? name,
    String? category,
    String? distance,
    String? rating,
    String? address,
    String? emoji,
    bool? selfCheckout,
    String? offer,
    String? description,
    double? lat,
    double? lng,
    String? hours,
    String? phone,
    int? followers,
    bool? isFollowing,
  }) {
    return StoreItem(
      id: id ?? this.id,
      name: name ?? this.name,
      category: category ?? this.category,
      distance: distance ?? this.distance,
      rating: rating ?? this.rating,
      address: address ?? this.address,
      emoji: emoji ?? this.emoji,
      selfCheckout: selfCheckout ?? this.selfCheckout,
      offer: offer ?? this.offer,
      description: description ?? this.description,
      lat: lat ?? this.lat,
      lng: lng ?? this.lng,
      hours: hours ?? this.hours,
      phone: phone ?? this.phone,
      followers: followers ?? this.followers,
      isFollowing: isFollowing ?? this.isFollowing,
    );
  }

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
      lat: (json['lat'] as num?)?.toDouble() ?? 12.9250,
      lng: (json['lng'] as num?)?.toDouble() ?? 77.5220,
      hours: json['hours'] as String? ?? '8:00 AM - 10:00 PM',
      phone: json['phone'] as String? ?? '+91 98450 12091',
      followers: json['followers'] as int? ?? 384,
      isFollowing: json['isFollowing'] as bool? ?? false,
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
      'lat': lat,
      'lng': lng,
      'hours': hours,
      'phone': phone,
      'followers': followers,
      'isFollowing': isFollowing,
    };
  }
}
