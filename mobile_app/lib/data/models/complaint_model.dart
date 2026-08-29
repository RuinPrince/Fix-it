class Complaint {
  final int id;
  final String complaintNumber;
  final String title;
  final String description;
  final String status;
  final String priority;
  final double latitude;
  final double longitude;
  final String address;
  final String categoryName;
  final String createdAt;

  Complaint({
    required this.id,
    required this.complaintNumber,
    required this.title,
    required this.description,
    required this.status,
    required this.priority,
    required this.latitude,
    required this.longitude,
    required this.address,
    required this.categoryName,
    required this.createdAt,
  });

  factory Complaint.fromJson(Map<String, dynamic> json) {
    return Complaint(
      id: json['id'],
      complaintNumber: json['complaint_number'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      status: json['status'] ?? 'submitted',
      priority: json['priority'] ?? 'medium',
      latitude: json['latitude'] is double ? json['latitude'] : double.tryParse(json['latitude']?.toString() ?? '0') ?? 0.0,
      longitude: json['longitude'] is double ? json['longitude'] : double.tryParse(json['longitude']?.toString() ?? '0') ?? 0.0,
      address: json['address'] ?? '',
      categoryName: json['Category'] != null ? json['Category']['name'] : (json['category_name'] ?? 'Unknown'),
      createdAt: json['created_at'] ?? DateTime.now().toIso8601String(),
    );
  }
}
