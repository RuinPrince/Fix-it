class User {
  final int id;
  final String email;
  final String fullName;
  final String role;
  final int? reputationPoints;

  User({
    required this.id,
    required this.email,
    required this.fullName,
    required this.role,
    this.reputationPoints,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      email: json['email'],
      fullName: json['full_name'] ?? json['fullName'],
      role: json['role'],
      reputationPoints: json['reputation_points'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'full_name': fullName,
      'role': role,
      'reputation_points': reputationPoints,
    };
  }
}
