import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:geolocator/geolocator.dart';
import 'package:geocoding/geocoding.dart';
import 'package:provider/provider.dart';
import 'package:dio/dio.dart';
import '../../../providers/complaint_provider.dart';

class ReportIssueScreen extends StatefulWidget {
  const ReportIssueScreen({super.key});

  @override
  State<ReportIssueScreen> createState() => _ReportIssueScreenState();
}

class _ReportIssueScreenState extends State<ReportIssueScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  
  String? _selectedCategory;
  final List<Map<String, dynamic>> _categories = [
    {'id': 1, 'name': 'Pothole'},
    {'id': 2, 'name': 'Garbage'},
    {'id': 3, 'name': 'Water Leakage'},
    {'id': 4, 'name': 'Streetlight'},
  ];

  File? _image;
  final ImagePicker _picker = ImagePicker();
  
  Position? _currentPosition;
  String _currentAddress = 'Fetching location...';

  @override
  void initState() {
    super.initState();
    _getCurrentLocation();
  }

  Future<void> _getCurrentLocation() async {
    bool serviceEnabled;
    LocationPermission permission;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      setState(() => _currentAddress = 'Location services are disabled.');
      return;
    }

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        setState(() => _currentAddress = 'Location permissions are denied');
        return;
      }
    }
    
    if (permission == LocationPermission.deniedForever) {
      setState(() => _currentAddress = 'Location permissions are permanently denied.');
      return;
    } 

    try {
      Position position = await Geolocator.getCurrentPosition(desiredAccuracy: LocationAccuracy.high);
      setState(() => _currentPosition = position);
      
      List<Placemark> placemarks = await Geocoding().placemarkFromCoordinates(position.latitude, position.longitude);
      if (placemarks.isNotEmpty) {
        Placemark place = placemarks[0];
        setState(() {
          _currentAddress = '${place.street}, ${place.subLocality}, ${place.locality}, ${place.postalCode}';
        });
      }
    } catch (e) {
      setState(() => _currentAddress = 'Error fetching location');
    }
  }

  Future<void> _pickImage() async {
    final XFile? photo = await _picker.pickImage(source: ImageSource.camera);
    if (photo != null) {
      setState(() {
        _image = File(photo.path);
      });
    }
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    if (_image == null) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please capture an image')));
      return;
    }
    if (_selectedCategory == null) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please select a category')));
      return;
    }
    if (_currentPosition == null) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Wait for location to be captured')));
      return;
    }

    final formData = FormData.fromMap({
      'title': _titleController.text,
      'description': _descriptionController.text,
      'category_id': _selectedCategory,
      'latitude': _currentPosition!.latitude,
      'longitude': _currentPosition!.longitude,
      'address': _currentAddress,
      'images': [await MultipartFile.fromFile(_image!.path, filename: 'issue.jpg')],
    });

    final messenger = ScaffoldMessenger.of(context);
    final nav = Navigator.of(context);

    final success = await context.read<ComplaintProvider>().submitComplaint(formData);
    
    if (success && mounted) {
      nav.pop();
      messenger.showSnackBar(const SnackBar(content: Text('Complaint submitted successfully!'), backgroundColor: Colors.green));
    } else if (mounted) {
      messenger.showSnackBar(const SnackBar(content: Text('Failed to submit complaint'), backgroundColor: Colors.red));
    }
  }

  @override
  Widget build(BuildContext context) {
    final isLoading = context.watch<ComplaintProvider>().isLoading;

    return Scaffold(
      appBar: AppBar(title: const Text('Report Issue')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              GestureDetector(
                onTap: _pickImage,
                child: Container(
                  height: 200,
                  decoration: BoxDecoration(
                    color: Theme.of(context).cardTheme.color,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.white24),
                  ),
                  child: _image != null 
                    ? ClipRRect(borderRadius: BorderRadius.circular(12), child: Image.file(_image!, fit: BoxFit.cover))
                    : const Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.camera_alt, size: 48, color: Colors.blue),
                          SizedBox(height: 8),
                          Text('Tap to capture photo'),
                        ],
                      ),
                ),
              ),
              const SizedBox(height: 24),
              DropdownButtonFormField<String>(
                decoration: const InputDecoration(labelText: 'Category'),
                initialValue: _selectedCategory,
                items: _categories.map((c) => DropdownMenuItem(
                  value: c['id'].toString(),
                  child: Text(c['name']),
                )).toList(),
                onChanged: (val) => setState(() => _selectedCategory = val),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _titleController,
                decoration: const InputDecoration(labelText: 'Title'),
                validator: (val) => val == null || val.isEmpty ? 'Required' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _descriptionController,
                decoration: const InputDecoration(labelText: 'Description (Optional Voice to text can be added here)', suffixIcon: Icon(Icons.mic)),
                maxLines: 4,
              ),
              const SizedBox(height: 24),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(color: Colors.white10, borderRadius: BorderRadius.circular(8)),
                child: Row(
                  children: [
                    const Icon(Icons.location_on, color: Colors.redAccent),
                    const SizedBox(width: 8),
                    Expanded(child: Text(_currentAddress, style: const TextStyle(color: Colors.white70))),
                  ],
                ),
              ),
              const SizedBox(height: 32),
              ElevatedButton(
                onPressed: isLoading ? null : _submit,
                child: isLoading ? const CircularProgressIndicator() : const Text('Submit Report'),
              )
            ],
          ),
        ),
      ),
    );
  }
}
