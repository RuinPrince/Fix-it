import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import '../../core/network/dio_client.dart';
import '../../data/models/complaint_model.dart';

class ComplaintProvider with ChangeNotifier {
  final DioClient _dioClient = DioClient();
  
  List<Complaint> _myComplaints = [];
  bool _isLoading = false;

  List<Complaint> get myComplaints => _myComplaints;
  bool get isLoading => _isLoading;

  Future<void> fetchMyComplaints() async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _dioClient.get('/complaints/my-complaints');
      
      if (response.statusCode == 200) {
        final List<dynamic> data = response.data['data'];
        _myComplaints = data.map((json) => Complaint.fromJson(json)).toList();
      }
    } on DioException catch (e) {
      debugPrint('Fetch Complaints Error: ${e.message}');
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<bool> submitComplaint(FormData formData) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _dioClient.post('/complaints', data: formData);
      if (response.statusCode == 201) {
        await fetchMyComplaints(); // Refresh list
        return true;
      }
    } on DioException catch (e) {
      debugPrint('Submit Complaint Error: ${e.response?.data}');
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }
}
