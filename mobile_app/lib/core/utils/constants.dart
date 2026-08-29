class Constants {
  // Configured to use your Mac's exact local network IP to support BOTH emulators and physical devices
  static const String apiBaseUrl = 'http://10.235.12.100:5000/api/v1'; // TODO: Update to production backend URL upon deployment
  static const String socketUrl = 'http://10.235.12.100:5000';      // TODO: Update to production socket URL upon deployment
  
  static const String tokenKey = 'jwt_token';
  static const String userKey = 'user_data';
}
