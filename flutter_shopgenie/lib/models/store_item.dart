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
  final double? lat;
  final double? lng;
  final String hours;
  final String phone;
  final int? followers;
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
    this.lat,
    this.lng,
    this.hours = '',
    this.phone = '',
    this.followers,
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
    final id = json['id']?.toString();
    final name = json['name']?.toString();
    if (id == null || id.isEmpty || name == null || name.isEmpty) {
      throw const FormatException('Shop response must include id and name.');
    }
    return StoreItem(
      id: id,
      name: name,
      category: json['category']?.toString() ?? '',
      distance: json['distance']?.toString() ?? '',
      rating: _formatRating(json['rating']),
      address: json['address']?.toString() ?? '',
      emoji: json['emoji']?.toString() ?? '🛒',
      selfCheckout: json['selfCheckout'] as bool? ?? false,
      offer: json['offer'] as String?,
      description: json['description'] as String?,
      lat: _coordinate(json['lat'] ?? json['latitude']),
      lng: _coordinate(json['lng'] ?? json['longitude']),
      hours:
          json['hours']?.toString() ?? json['business_hours']?.toString() ?? '',
      phone: json['phone']?.toString() ?? '',
      followers: (json['followers'] as num?)?.toInt(),
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

  static String _formatRating(dynamic value) {
    if (value == null) return 'N/A';
    if (value is String) {
      final trimmed = value.trim();
      if (trimmed.isEmpty) return 'N/A';
      if (trimmed.contains('\u2605')) return trimmed;
      final parsed = double.tryParse(trimmed);
      if (parsed != null) return '${parsed.toStringAsFixed(1)} \u2605';
      return trimmed;
    }
    if (value is num) {
      return '${value.toDouble().toStringAsFixed(1)} \u2605';
    }
    return 'N/A';
  }

  static double? _coordinate(dynamic value) {
    if (value is num) return value.toDouble();
    if (value is String) return double.tryParse(value.trim());
    return null;
  }
}
