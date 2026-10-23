class AnnouncementItem {
  final String id;
  final String storeId;
  final String storeName;
  final String title;
  final String content;
  final String status;
  final String date;

  const AnnouncementItem({
    required this.id,
    required this.storeId,
    required this.storeName,
    required this.title,
    required this.content,
    required this.status,
    required this.date,
  });

  factory AnnouncementItem.fromJson(Map<String, dynamic> json) {
    String formattedDate = 'Recently';
    if (json['created_at'] != null) {
      final raw = json['created_at'].toString();
      formattedDate = raw.contains('T') ? raw.split('T').first : raw;
    }

    return AnnouncementItem(
      id: json['id']?.toString() ?? '',
      storeId: json['shop']?.toString() ?? '',
      storeName: json['shop_name']?.toString() ?? 'Community Shop',
      title: json['title']?.toString() ?? '',
      content: json['content']?.toString() ?? '',
      status: json['status']?.toString() ?? 'PUBLISHED',
      date: formattedDate,
    );
  }
}
