import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:provider/provider.dart';
import '../../../providers/complaint_provider.dart';

class MapScreen extends StatefulWidget {
  const MapScreen({super.key});

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  final MapController _mapController = MapController();
  // Default to a central location (e.g., center of a city), update this with actual user location if desired.
  final LatLng _center = const LatLng(28.6139, 77.2090); // New Delhi as default

  @override
  Widget build(BuildContext context) {
    final complaints = context.watch<ComplaintProvider>().myComplaints;

    final markers = complaints.map((c) {
      return Marker(
        point: LatLng(c.latitude, c.longitude),
        width: 40,
        height: 40,
        child: GestureDetector(
          onTap: () {
            showModalBottomSheet(
              context: context,
              backgroundColor: Theme.of(context).cardTheme.color,
              builder: (ctx) => Container(
                padding: const EdgeInsets.all(16),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(c.title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 8),
                    Text(c.categoryName, style: const TextStyle(color: Colors.blueAccent)),
                    const SizedBox(height: 8),
                    Text(c.description),
                    const SizedBox(height: 16),
                    Text('Status: ${c.status.toUpperCase()}', style: const TextStyle(fontWeight: FontWeight.bold)),
                  ],
                ),
              ),
            );
          },
          child: const Icon(Icons.location_on, color: Colors.red, size: 40),
        ),
      );
    }).toList();

    return FlutterMap(
      mapController: _mapController,
      options: MapOptions(
        initialCenter: _center,
        initialZoom: 12.0,
      ),
      children: [
        TileLayer(
          urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          userAgentPackageName: 'com.fixit.app',
        ),
        MarkerLayer(markers: markers),
      ],
    );
  }
}
