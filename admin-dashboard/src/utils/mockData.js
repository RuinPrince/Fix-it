// ============================================
// Fix It Admin — Comprehensive Mock Data
// Standalone data for dashboard demo
// ============================================

// Chennai GPS coordinates for wards
const wardCoords = {
  'T. Nagar': { lat: 13.0406, lng: 80.2337 },
  'Anna Nagar': { lat: 13.0850, lng: 80.2101 },
  'Mylapore': { lat: 13.0339, lng: 80.2676 },
  'Adyar': { lat: 13.0012, lng: 80.2565 },
  'Velachery': { lat: 12.9815, lng: 80.2180 },
  'Tambaram': { lat: 12.9249, lng: 80.1000 },
  'Chrompet': { lat: 12.9516, lng: 80.1399 },
  'Porur': { lat: 13.0383, lng: 80.1585 },
  'Guindy': { lat: 13.0067, lng: 80.2206 },
  'Kodambakkam': { lat: 13.0523, lng: 80.2240 },
};

export const departments = [
  { id: 1, name: 'Roads & Infrastructure', contact_email: 'roads@fixit.gov.in', head: 'Ramesh Babu', is_active: true, total_complaints: 180, resolved: 142 },
  { id: 2, name: 'Water Supply & Sewerage', contact_email: 'water@fixit.gov.in', head: 'Sumathi Lakshmi', is_active: true, total_complaints: 156, resolved: 121 },
  { id: 3, name: 'Sanitation & Waste', contact_email: 'sanitation@fixit.gov.in', head: 'Ganesan Muthu', is_active: true, total_complaints: 201, resolved: 178 },
  { id: 4, name: 'Electricity & Streetlights', contact_email: 'electricity@fixit.gov.in', head: 'Vijay Kumar', is_active: true, total_complaints: 98, resolved: 85 },
  { id: 5, name: 'General Administration', contact_email: 'admin@fixit.gov.in', head: 'Meena Kumari', is_active: true, total_complaints: 67, resolved: 52 },
];

export const wards = [
  { id: 1, name: 'T. Nagar', number: 1, department_id: 1 },
  { id: 2, name: 'Anna Nagar', number: 2, department_id: 1 },
  { id: 3, name: 'Mylapore', number: 3, department_id: 2 },
  { id: 4, name: 'Adyar', number: 4, department_id: 2 },
  { id: 5, name: 'Velachery', number: 5, department_id: 3 },
  { id: 6, name: 'Tambaram', number: 6, department_id: 3 },
  { id: 7, name: 'Chrompet', number: 7, department_id: 4 },
  { id: 8, name: 'Porur', number: 8, department_id: 4 },
  { id: 9, name: 'Guindy', number: 9, department_id: 5 },
  { id: 10, name: 'Kodambakkam', number: 10, department_id: 5 },
];

export const categories = [
  { id: 1, name: 'Pothole', name_ta: 'குழி', icon: '🕳️', department_id: 1, sla_hours: 24, color: '#ef4444' },
  { id: 2, name: 'Road Damage', name_ta: 'சாலை சேதம்', icon: '🚧', department_id: 1, sla_hours: 48, color: '#f97316' },
  { id: 3, name: 'Water Leakage', name_ta: 'நீர் கசிவு', icon: '💧', department_id: 2, sla_hours: 8, color: '#3b82f6' },
  { id: 4, name: 'Water Supply', name_ta: 'நீர் வழங்கல்', icon: '🚰', department_id: 2, sla_hours: 6, color: '#06b6d4' },
  { id: 5, name: 'Sewage Overflow', name_ta: 'கழிவுநீர்', icon: '🚱', department_id: 2, sla_hours: 4, color: '#8b5cf6' },
  { id: 6, name: 'Garbage Dump', name_ta: 'குப்பை', icon: '🗑️', department_id: 3, sla_hours: 12, color: '#22c55e' },
  { id: 7, name: 'Illegal Dumping', name_ta: 'சட்டவிரோத கொட்டுதல்', icon: '⚠️', department_id: 3, sla_hours: 48, color: '#eab308' },
  { id: 8, name: 'Drainage Block', name_ta: 'வடிகால்', icon: '🌊', department_id: 3, sla_hours: 12, color: '#14b8a6' },
  { id: 9, name: 'Streetlight Failure', name_ta: 'விளக்கு பழுது', icon: '💡', department_id: 4, sla_hours: 24, color: '#f59e0b' },
  { id: 10, name: 'Noise Complaint', name_ta: 'ஒலி புகார்', icon: '🔊', department_id: 5, sla_hours: 72, color: '#6366f1' },
  { id: 11, name: 'Encroachment', name_ta: 'ஆக்கிரமிப்பு', icon: '🚫', department_id: 5, sla_hours: 72, color: '#ec4899' },
  { id: 12, name: 'Traffic Signal', name_ta: 'சிக்னல்', icon: '🚦', department_id: 1, sla_hours: 12, color: '#f43f5e' },
];

export const users = [
  { id: 1, email: 'superadmin@fixit.gov.in', role: 'super_admin', full_name: 'Dr. Senthil Kumar', reputation_points: 0 },
  { id: 2, email: 'admin@fixit.gov.in', role: 'admin', full_name: 'Arun Patel', reputation_points: 0 },
  { id: 3, email: 'roads.officer@fixit.gov.in', role: 'official', full_name: 'Ramesh Babu', department: 'Roads & Infrastructure' },
  { id: 4, email: 'water.officer@fixit.gov.in', role: 'official', full_name: 'Sumathi Lakshmi', department: 'Water Supply & Sewerage' },
  { id: 5, email: 'sanitation.officer@fixit.gov.in', role: 'official', full_name: 'Ganesan Muthu', department: 'Sanitation & Waste' },
  { id: 6, email: 'electricity.officer@fixit.gov.in', role: 'official', full_name: 'Vijay Kumar', department: 'Electricity & Streetlights' },
  { id: 7, email: 'general.officer@fixit.gov.in', role: 'official', full_name: 'Meena Kumari', department: 'General Administration' },
  { id: 8, email: 'rajesh.kumar@gmail.com', role: 'citizen', full_name: 'Rajesh Kumar', reputation_points: 85 },
  { id: 9, email: 'priya.devi@gmail.com', role: 'citizen', full_name: 'Priya Devi', reputation_points: 120 },
  { id: 10, email: 'murugan.s@gmail.com', role: 'citizen', full_name: 'Murugan S', reputation_points: 45 },
  { id: 11, email: 'lakshmi.n@gmail.com', role: 'citizen', full_name: 'Lakshmi N', reputation_points: 200 },
  { id: 12, email: 'suresh.v@gmail.com', role: 'citizen', full_name: 'Suresh Venkat', reputation_points: 30 },
  { id: 13, email: 'kavitha.r@gmail.com', role: 'citizen', full_name: 'Kavitha R', reputation_points: 65 },
  { id: 14, email: 'anand.m@gmail.com', role: 'citizen', full_name: 'Anand Moorthy', reputation_points: 15 },
  { id: 15, email: 'divya.s@gmail.com', role: 'citizen', full_name: 'Divya Shankar', reputation_points: 90 },
];

const statuses = ['submitted', 'acknowledged', 'assigned', 'in_progress', 'resolved', 'closed', 'rejected', 'reopened'];
const priorities = ['low', 'medium', 'high', 'critical'];

const complaintTitles = [
  'Large pothole near bus stop', 'Road surface badly damaged after rains', 'Water pipe burst at street corner',
  'No water supply for 3 days', 'Sewage overflow near school', 'Garbage not collected for a week',
  'Illegal waste dumping near park', 'Storm drain completely blocked', 'Streetlight not working for weeks',
  'Loud construction noise at midnight', 'Shop encroaching on footpath', 'Traffic signal malfunctioning',
  'Multiple potholes on 2nd street', 'Water leaking from main pipeline', 'Garbage piling up on corner',
  'Broken streetlight causing safety issue', 'Drain clogged causing waterlog', 'Road damaged by heavy vehicles',
  'Sewage smell unbearable in area', 'Illegal dumping of construction debris', 'Water supply irregular',
  'Street lamp flickering dangerously', 'Open manhole cover missing', 'Noise from wedding hall at night',
  'Footpath occupied by hawkers', 'Traffic light not syncing properly', 'Deep pothole causing accidents',
  'Pipe leakage flooding basement', 'No garbage pickup on Sundays', 'Trees blocking streetlight',
  'Drain overflowing onto main road', 'Road cave-in near junction', 'Water contamination complaint',
  'Abandoned vehicle blocking road', 'Street dogs menace in area', 'Mosquito breeding in drain',
  'Damaged speed breaker', 'Water tanker not arriving', 'Public toilet maintenance needed',
  'Power line dangling dangerously', 'Unauthorized construction noise', 'Parking encroachment',
  'Pothole filled with water dangerous', 'Broken pipeline flooding street', 'Garbage burning by roadside',
  'Streetlight pole tilting', 'Drain grate missing', 'Road marking faded at junction',
  'Sewage treatment plant odor', 'Water meter not working',
];

// Generate 50 complaints
export const complaints = Array.from({ length: 50 }, (_, i) => {
  const wardIdx = i % 10;
  const wardName = wards[wardIdx].name;
  const coords = wardCoords[wardName];
  const catIdx = i % 12;
  const statusIdx = i % 8;
  const priorityIdx = i % 4;
  const citizenIdx = 7 + (i % 8);
  const daysAgo = Math.floor(Math.random() * 30);
  const createdDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

  return {
    id: i + 1,
    complaint_number: `FIX-2025-${String(i + 1).padStart(5, '0')}`,
    title: complaintTitles[i],
    description: `Detailed complaint about ${complaintTitles[i].toLowerCase()} in ${wardName} area. This issue has been affecting residents for several days and needs immediate attention. Multiple residents have reported this problem.`,
    citizen: users[citizenIdx],
    category: categories[catIdx],
    ward: wards[wardIdx],
    department: departments[categories[catIdx].department_id - 1],
    status: statuses[statusIdx],
    priority: priorities[priorityIdx],
    latitude: coords.lat + (Math.random() * 0.008 - 0.004),
    longitude: coords.lng + (Math.random() * 0.008 - 0.004),
    address: `${10 + i}, ${wardName}, Chennai - 600${String(wardIdx + 1).padStart(3, '0')}`,
    is_emergency: priorityIdx === 3 && i % 3 === 0,
    is_anonymous: i % 11 === 0,
    upvotes: Math.floor(Math.random() * 30),
    ai_severity_score: (0.2 + Math.random() * 0.8).toFixed(2),
    assigned_official: statusIdx >= 2 ? users[2 + (catIdx % 5)] : null,
    resolution_eta: new Date(Date.now() + (12 + Math.random() * 60) * 60 * 60 * 1000).toISOString(),
    created_at: createdDate.toISOString(),
    updated_at: new Date(createdDate.getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString(),
    resolved_at: ['resolved', 'closed'].includes(statuses[statusIdx])
      ? new Date(createdDate.getTime() + (1 + Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString()
      : null,
    timeline: [
      { status: 'submitted', date: createdDate.toISOString(), by: users[citizenIdx].full_name, notes: 'Complaint submitted' },
      ...(statusIdx >= 1 ? [{ status: 'acknowledged', date: new Date(createdDate.getTime() + 2 * 60 * 60 * 1000).toISOString(), by: 'Admin', notes: 'Complaint acknowledged' }] : []),
      ...(statusIdx >= 2 ? [{ status: 'assigned', date: new Date(createdDate.getTime() + 6 * 60 * 60 * 1000).toISOString(), by: 'Admin', notes: 'Assigned to department' }] : []),
      ...(statusIdx >= 3 ? [{ status: 'in_progress', date: new Date(createdDate.getTime() + 24 * 60 * 60 * 1000).toISOString(), by: users[2 + (catIdx % 5)].full_name, notes: 'Work started' }] : []),
      ...(statusIdx >= 4 ? [{ status: 'resolved', date: new Date(createdDate.getTime() + 72 * 60 * 60 * 1000).toISOString(), by: users[2 + (catIdx % 5)].full_name, notes: 'Issue resolved' }] : []),
    ],
  };
});

// Analytics data
export const analyticsData = {
  overview: {
    total: 702,
    resolved: 578,
    pending: 89,
    critical: 12,
    today: 8,
    resolution_rate: 82.3,
    avg_rating: 4.2,
    avg_resolution_hours: 36,
  },
  monthlyTrends: [
    { month: 'Jan 2025', filed: 95, resolved: 82 },
    { month: 'Feb 2025', filed: 108, resolved: 95 },
    { month: 'Mar 2025', filed: 122, resolved: 110 },
    { month: 'Apr 2025', filed: 115, resolved: 108 },
    { month: 'May 2025', filed: 130, resolved: 118 },
    { month: 'Jun 2025', filed: 132, resolved: 125 },
  ],
  byCategory: categories.map((c) => ({
    name: c.name,
    icon: c.icon,
    count: 30 + Math.floor(Math.random() * 80),
    color: c.color,
  })),
  byStatus: statuses.map((s) => ({
    name: s.replace('_', ' '),
    count: 20 + Math.floor(Math.random() * 120),
  })),
  byPriority: [
    { name: 'Low', count: 156, color: '#10b981' },
    { name: 'Medium', count: 298, color: '#f59e0b' },
    { name: 'High', count: 186, color: '#f97316' },
    { name: 'Critical', count: 62, color: '#ef4444' },
  ],
  departmentPerformance: departments.map((d) => ({
    name: d.name.split(' ')[0],
    fullName: d.name,
    total: d.total_complaints,
    resolved: d.resolved,
    rate: ((d.resolved / d.total_complaints) * 100).toFixed(1),
    avgHours: 20 + Math.floor(Math.random() * 40),
  })),
  sla: {
    onTrack: 65,
    breached: 12,
    atRisk: 8,
  },
};

export const notifications = [
  { id: 1, title: 'New Critical Complaint', message: 'Sewage overflow reported in Mylapore — immediate attention needed', type: 'escalation', is_read: false, created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
  { id: 2, title: 'Complaint Resolved', message: 'FIX-2025-00012 — Pothole on Main Road resolved by Roads dept', type: 'status_update', is_read: false, created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString() },
  { id: 3, title: 'SLA Breach Warning', message: '3 complaints approaching SLA deadline in next 2 hours', type: 'system', is_read: false, created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
  { id: 4, title: 'New Assignment', message: 'FIX-2025-00045 assigned to you by Admin', type: 'assignment', is_read: true, created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { id: 5, title: 'Citizen Feedback', message: 'Rajesh Kumar rated complaint resolution 5/5 stars', type: 'system', is_read: true, created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() },
  { id: 6, title: 'Bulk Import Complete', message: '15 complaints imported from citizen portal', type: 'system', is_read: true, created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() },
];

export const auditLogs = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  user: users[i % 7],
  action: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'ASSIGN', 'ESCALATE', 'STATUS_CHANGE'][i % 7],
  model_name: ['complaints', 'users', 'departments', 'status_history'][i % 4],
  object_id: Math.floor(Math.random() * 50) + 1,
  ip_address: `192.168.1.${100 + i}`,
  created_at: new Date(Date.now() - i * 2 * 60 * 60 * 1000).toISOString(),
}));

// Heatmap data points
export const heatmapData = complaints.map((c) => [c.latitude, c.longitude, parseFloat(c.ai_severity_score)]);

export const currentUser = {
  id: 2,
  email: 'admin@fixit.gov.in',
  role: 'admin',
  full_name: 'Arun Patel',
  avatar: null,
};
