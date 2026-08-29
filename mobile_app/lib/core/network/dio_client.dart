import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../utils/constants.dart';

class DioClient {
  final Dio _dio;

  DioClient() : _dio = Dio(BaseOptions(
    baseUrl: Constants.apiBaseUrl,
    connectTimeout: const Duration(seconds: 15),
    receiveTimeout: const Duration(seconds: 15),
    responseType: ResponseType.json,
  )) {
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final prefs = await SharedPreferences.getInstance();
        final token = prefs.getString(Constants.tokenKey);
        
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        
        // Add default headers
        options.headers['Content-Type'] = 'application/json';
        options.headers['Accept'] = 'application/json';
        
        return handler.next(options);
      },
      onError: (DioException e, handler) {
        // Handle global errors here
        return handler.next(e);
      },
    ));
  }

  Dio get dio => _dio;

  // Generic GET request
  Future<Response> get(String url, {Map<String, dynamic>? queryParameters}) async {
    try {
      return await _dio.get(url, queryParameters: queryParameters);
    } catch (e) {
      rethrow;
    }
  }

  // Generic POST request
  Future<Response> post(String url, {dynamic data}) async {
    try {
      return await _dio.post(url, data: data);
    } catch (e) {
      rethrow;
    }
  }
}
