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
    final id = json['id']?.toString();
    final shopId = json['shop']?.toString();
    final title = json['title']?.toString();
    final content = json['content']?.toString();
    final createdAt = json['created_at']?.toString();
    final status = json['status']?.toString();
    if (id == null ||
        shopId == null ||
        title == null ||
        content == null ||
        createdAt == null ||
        status == null) {
      throw const FormatException(
        'Announcement response is missing required fields.',
      );
    }
    final formattedDate =
        createdAt.contains('T') ? createdAt.split('T').first : createdAt;

    return AnnouncementItem(
      id: id,
      storeId: shopId,
      storeName: json['shop_name']?.toString() ?? '',
      title: title,
      content: content,
      status: status,
      date: formattedDate,
    );
  }
}
