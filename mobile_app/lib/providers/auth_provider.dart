import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:dio/dio.dart';
import '../../core/network/dio_client.dart';
import '../../core/utils/constants.dart';
import '../../data/models/user_model.dart';

class AuthProvider with ChangeNotifier {
  final DioClient _dioClient = DioClient();
  User? _user;
  bool _isLoading = false;

  User? get user => _user;
  bool get isAuthenticated => _user != null;
  bool get isLoading => _isLoading;

  Future<void> checkAuthStatus() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString(Constants.tokenKey);
    final userData = prefs.getString(Constants.userKey);

    if (token != null && userData != null) {
      _user = User.fromJson(json.decode(userData));
      notifyListeners();
    }
  }

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _dioClient.post('/auth/login', data: {
        'email': email,
        'password': password,
      });

      if (response.statusCode == 200) {
        final token = response.data['token'];
        _user = User.fromJson(response.data['user']);

        final prefs = await SharedPreferences.getInstance();
        await prefs.setString(Constants.tokenKey, token);
        await prefs.setString(Constants.userKey, json.encode(_user!.toJson()));

        _isLoading = false;
        notifyListeners();
        return true;
      }
    } on DioException catch (e) {
      debugPrint('Login Error: ${e.response?.data}');
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(Constants.tokenKey);
    await prefs.remove(Constants.userKey);
    _user = null;
    notifyListeners();
  }
}
