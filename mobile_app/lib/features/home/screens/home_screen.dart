import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../../providers/auth_provider.dart';
import '../../../providers/complaint_provider.dart';
import '../../complaints/screens/report_issue_screen.dart';
import '../../map/screens/map_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ComplaintProvider>().fetchMyComplaints();
    });
  }

  Widget _buildBody() {
    if (_currentIndex == 1) {
      return const MapScreen();
    }
    
    // Index 0: Dashboard / My Complaints
    return Consumer<ComplaintProvider>(
      builder: (context, provider, child) {
        if (provider.isLoading && provider.myComplaints.isEmpty) {
          return const Center(child: CircularProgressIndicator());
        }
        
        if (provider.myComplaints.isEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.check_circle_outline, size: 80, color: Colors.grey[700]),
                const SizedBox(height: 16),
                const Text('No complaints filed yet.', style: TextStyle(color: Colors.grey, fontSize: 18)),
              ],
            ),
          );
        }

        return RefreshIndicator(
          onRefresh: provider.fetchMyComplaints,
          child: ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: provider.myComplaints.length,
            itemBuilder: (context, index) {
              final c = provider.myComplaints[index];
              return Card(
                margin: const EdgeInsets.only(bottom: 16),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(c.complaintNumber, style: const TextStyle(color: Colors.blueAccent, fontWeight: FontWeight.bold)),
                          _buildStatusBadge(c.status),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(c.title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 4),
                      Text(c.categoryName, style: const TextStyle(color: Colors.grey)),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          const Icon(Icons.location_on, size: 16, color: Colors.grey),
                          const SizedBox(width: 4),
                          Expanded(child: Text(c.address, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(color: Colors.grey))),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          const Icon(Icons.access_time, size: 16, color: Colors.grey),
                          const SizedBox(width: 4),
                          Text(DateFormat('MMM d, yyyy - h:mm a').format(DateTime.parse(c.createdAt)), style: const TextStyle(color: Colors.grey)),
                        ],
                      )
                    ],
                  ),
                ),
              );
            },
          ),
        );
      },
    );
  }

  Widget _buildStatusBadge(String status) {
    Color color;
    switch (status.toLowerCase()) {
      case 'resolved':
      case 'closed':
        color = Colors.green;
        break;
      case 'in_progress':
        color = Colors.orange;
        break;
      default:
        color = Colors.blue;
    }
    
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.2),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.5)),
      ),
      child: Text(
        status.toUpperCase(),
        style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.bold),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_currentIndex == 0 ? 'My Complaints' : 'Nearby Map'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              context.read<AuthProvider>().logout();
            },
          )
        ],
      ),
      body: _buildBody(),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          Navigator.of(context).push(MaterialPageRoute(builder: (_) => const ReportIssueScreen()));
        },
        icon: const Icon(Icons.add_a_photo),
        label: const Text('Report Issue'),
        backgroundColor: Theme.of(context).primaryColor,
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.list_alt), label: 'My Complaints'),
          BottomNavigationBarItem(icon: Icon(Icons.map_outlined), label: 'Map'),
        ],
      ),
    );
  }
}
