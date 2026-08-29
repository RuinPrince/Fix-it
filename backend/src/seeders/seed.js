// ============================================
// Fix It — Database Seeder
// Populates database with realistic demo data
// ============================================
import dotenv from 'dotenv';
dotenv.config();

import sequelize from '../config/database.js';
import {
  User, UserProfile, Department, Ward, Category,
  Complaint, ComplaintImage, StatusHistory, Notification,
  ChatRoom, ChatMessage, Feedback, AuditLog,
  ReputationBadge, UserBadge, Escalation,
} from '../models/index.js';
import bcrypt from 'bcryptjs';
import logger from '../utils/logger.js';

const seed = async () => {
  try {
    logger.info('🌱 Starting database seed...');
    await sequelize.authenticate();

    // Force sync (drop and recreate tables)
    await sequelize.sync({ force: true });
    logger.info('✅ Tables recreated');

    // ========== DEPARTMENTS ==========
    const departments = await Department.bulkCreate([
      { name: 'Roads & Infrastructure', description: 'Handles road repairs, construction, potholes', contact_email: 'roads@fixit.gov.in', contact_phone: '+91-44-2500-1001' },
      { name: 'Water Supply & Sewerage', description: 'Water supply, pipe repairs, sewage management', contact_email: 'water@fixit.gov.in', contact_phone: '+91-44-2500-1002' },
      { name: 'Sanitation & Waste Management', description: 'Garbage collection, waste disposal, cleaning', contact_email: 'sanitation@fixit.gov.in', contact_phone: '+91-44-2500-1003' },
      { name: 'Electricity & Streetlights', description: 'Streetlight repairs, electrical issues', contact_email: 'electricity@fixit.gov.in', contact_phone: '+91-44-2500-1004' },
      { name: 'General Administration', description: 'General civic issues, encroachments, noise', contact_email: 'admin@fixit.gov.in', contact_phone: '+91-44-2500-1005' },
    ]);
    logger.info(`✅ ${departments.length} departments created`);

    // ========== WARDS ==========
    const wardData = [
      { name: 'T. Nagar', number: 1, department_id: departments[0].id },
      { name: 'Anna Nagar', number: 2, department_id: departments[0].id },
      { name: 'Mylapore', number: 3, department_id: departments[1].id },
      { name: 'Adyar', number: 4, department_id: departments[1].id },
      { name: 'Velachery', number: 5, department_id: departments[2].id },
      { name: 'Tambaram', number: 6, department_id: departments[2].id },
      { name: 'Chrompet', number: 7, department_id: departments[3].id },
      { name: 'Porur', number: 8, department_id: departments[3].id },
      { name: 'Guindy', number: 9, department_id: departments[4].id },
      { name: 'Kodambakkam', number: 10, department_id: departments[4].id },
    ];
    const wards = await Ward.bulkCreate(wardData);
    logger.info(`✅ ${wards.length} wards created`);

    // ========== CATEGORIES ==========
    const categoryData = [
      { name: 'Pothole', name_ta: 'குழி', icon: 'road', department_id: departments[0].id, sla_hours: 24, priority_weight: 4 },
      { name: 'Road Damage', name_ta: 'சாலை சேதம்', icon: 'construction', department_id: departments[0].id, sla_hours: 48, priority_weight: 3 },
      { name: 'Water Leakage', name_ta: 'நீர் கசிவு', icon: 'water', department_id: departments[1].id, sla_hours: 8, priority_weight: 4 },
      { name: 'Water Supply', name_ta: 'நீர் வழங்கல்', icon: 'faucet', department_id: departments[1].id, sla_hours: 6, priority_weight: 5 },
      { name: 'Sewage Overflow', name_ta: 'கழிவுநீர் வழிதல்', icon: 'sewage', department_id: departments[1].id, sla_hours: 4, priority_weight: 5 },
      { name: 'Garbage Dump', name_ta: 'குப்பைக் கிடங்கு', icon: 'trash', department_id: departments[2].id, sla_hours: 12, priority_weight: 3 },
      { name: 'Illegal Dumping', name_ta: 'சட்டவிரோத கொட்டுதல்', icon: 'warning', department_id: departments[2].id, sla_hours: 48, priority_weight: 2 },
      { name: 'Drainage Block', name_ta: 'வடிகால் அடைப்பு', icon: 'drain', department_id: departments[2].id, sla_hours: 12, priority_weight: 4 },
      { name: 'Streetlight Failure', name_ta: 'தெரு விளக்கு பழுது', icon: 'lightbulb', department_id: departments[3].id, sla_hours: 24, priority_weight: 3 },
      { name: 'Noise Complaint', name_ta: 'ஒலி புகார்', icon: 'volume', department_id: departments[4].id, sla_hours: 72, priority_weight: 1 },
      { name: 'Encroachment', name_ta: 'ஆக்கிரமிப்பு', icon: 'barrier', department_id: departments[4].id, sla_hours: 72, priority_weight: 2 },
      { name: 'Traffic Signal', name_ta: 'போக்குவரத்து சிக்னல்', icon: 'traffic', department_id: departments[0].id, sla_hours: 12, priority_weight: 4 },
    ];
    const categories = await Category.bulkCreate(categoryData);
    logger.info(`✅ ${categories.length} categories created`);

    // ========== USERS ==========
    const passwordHash = await bcrypt.hash('password123', 12);

    const usersData = [
      // Super Admin
      { email: 'superadmin@fixit.gov.in', password_hash: passwordHash, role: 'super_admin', phone: '+91-9000000001' },
      // Admins
      { email: 'admin@fixit.gov.in', password_hash: passwordHash, role: 'admin', phone: '+91-9000000002' },
      // Officials (one per department)
      { email: 'roads.officer@fixit.gov.in', password_hash: passwordHash, role: 'official', phone: '+91-9000000003' },
      { email: 'water.officer@fixit.gov.in', password_hash: passwordHash, role: 'official', phone: '+91-9000000004' },
      { email: 'sanitation.officer@fixit.gov.in', password_hash: passwordHash, role: 'official', phone: '+91-9000000005' },
      { email: 'electricity.officer@fixit.gov.in', password_hash: passwordHash, role: 'official', phone: '+91-9000000006' },
      { email: 'general.officer@fixit.gov.in', password_hash: passwordHash, role: 'official', phone: '+91-9000000007' },
      // Citizens
      { email: 'rajesh.kumar@gmail.com', password_hash: passwordHash, role: 'citizen', phone: '+91-9100000001', reputation_points: 85 },
      { email: 'priya.devi@gmail.com', password_hash: passwordHash, role: 'citizen', phone: '+91-9100000002', reputation_points: 120 },
      { email: 'murugan.s@gmail.com', password_hash: passwordHash, role: 'citizen', phone: '+91-9100000003', reputation_points: 45, language_pref: 'ta' },
      { email: 'lakshmi.n@gmail.com', password_hash: passwordHash, role: 'citizen', phone: '+91-9100000004', reputation_points: 200 },
      { email: 'suresh.v@gmail.com', password_hash: passwordHash, role: 'citizen', phone: '+91-9100000005', reputation_points: 30 },
      { email: 'kavitha.r@gmail.com', password_hash: passwordHash, role: 'citizen', phone: '+91-9100000006', reputation_points: 65 },
      { email: 'anand.m@gmail.com', password_hash: passwordHash, role: 'citizen', phone: '+91-9100000007', reputation_points: 15 },
      { email: 'divya.s@gmail.com', password_hash: passwordHash, role: 'citizen', phone: '+91-9100000008', reputation_points: 90 },
    ];

    const users = await User.bulkCreate(usersData, { individualHooks: false });
    logger.info(`✅ ${users.length} users created`);

    // ========== USER PROFILES ==========
    const profileNames = [
      'Dr. Senthil Kumar (Super Admin)', 'Arun Patel (Admin)',
      'Ramesh Babu', 'Sumathi Lakshmi', 'Ganesan Muthu', 'Vijay Kumar', 'Meena Kumari',
      'Rajesh Kumar', 'Priya Devi', 'Murugan S', 'Lakshmi Narayanan',
      'Suresh Venkat', 'Kavitha Ramasamy', 'Anand Moorthy', 'Divya Shankar',
    ];

    const profiles = users.map((user, i) => ({
      user_id: user.id,
      full_name: profileNames[i],
      ward_id: wards[i % wards.length].id,
      address: `${10 + i}, ${wards[i % wards.length].name}, Chennai - 600${String(i + 1).padStart(3, '0')}`,
    }));

    await UserProfile.bulkCreate(profiles);
    logger.info('✅ User profiles created');

    // Assign department heads
    await departments[0].update({ head_user_id: users[2].id });
    await departments[1].update({ head_user_id: users[3].id });
    await departments[2].update({ head_user_id: users[4].id });
    await departments[3].update({ head_user_id: users[5].id });
    await departments[4].update({ head_user_id: users[6].id });

    // ========== COMPLAINTS (50) ==========
    const chennaiCoords = [
      { lat: 13.0406, lng: 80.2337 }, // T. Nagar
      { lat: 13.0850, lng: 80.2101 }, // Anna Nagar
      { lat: 13.0339, lng: 80.2676 }, // Mylapore
      { lat: 13.0012, lng: 80.2565 }, // Adyar
      { lat: 12.9815, lng: 80.2180 }, // Velachery
      { lat: 12.9249, lng: 80.1000 }, // Tambaram
      { lat: 12.9516, lng: 80.1399 }, // Chrompet
      { lat: 13.0383, lng: 80.1585 }, // Porur
      { lat: 13.0067, lng: 80.2206 }, // Guindy
      { lat: 13.0523, lng: 80.2240 }, // Kodambakkam
    ];

    const statuses = ['submitted', 'acknowledged', 'assigned', 'in_progress', 'resolved', 'closed', 'rejected', 'reopened'];
    const priorities = ['low', 'medium', 'high', 'critical'];

    const complaintTemplates = [
      { cat: 0, title: 'Large pothole on main road', desc: 'There is a dangerous pothole approximately 2 feet wide on the main road near the bus stop. Several vehicles have been damaged. Urgent repair needed.' },
      { cat: 1, title: 'Road surface completely damaged', desc: 'The road surface has deteriorated badly after recent rains. Multiple cracks and broken sections making it unsafe for two-wheelers.' },
      { cat: 2, title: 'Water pipe burst on street corner', desc: 'Water is gushing from a burst pipe near the junction. Water is being wasted and the road is flooding. Please fix immediately.' },
      { cat: 3, title: 'No water supply for 3 days', desc: 'Our area has not received water supply for the past 3 days. Multiple families are affected. Please restore water supply urgently.' },
      { cat: 4, title: 'Sewage overflowing onto road', desc: 'Raw sewage is overflowing from the manhole near the school. It is causing health hazards and unbearable smell. Children are at risk.' },
      { cat: 5, title: 'Garbage not collected for a week', desc: 'The garbage collection vehicle has not visited our street for over a week. Waste is piling up and attracting stray animals and insects.' },
      { cat: 6, title: 'Illegal waste dumping near park', desc: 'Construction waste and garbage are being illegally dumped near the children\'s park. This is creating health hazards for the community.' },
      { cat: 7, title: 'Drainage blocked causing flooding', desc: 'The storm water drain is completely blocked with debris. Even light rain causes water logging in the entire area.' },
      { cat: 8, title: 'Streetlight not working for weeks', desc: 'The streetlight near house no. 45 has been non-functional for the past 3 weeks. The area becomes very dark and unsafe at night.' },
      { cat: 9, title: 'Loud construction noise at night', desc: 'A construction site nearby is operating heavy machinery past 10 PM, violating noise pollution norms. Residents cannot sleep.' },
      { cat: 10, title: 'Shop encroaching on footpath', desc: 'A commercial establishment has extended its display area onto the public footpath, blocking pedestrian movement.' },
      { cat: 11, title: 'Traffic signal not functioning', desc: 'The traffic signal at the main junction has been blinking for 2 days. This is causing major traffic jams and near-miss accidents.' },
    ];

    const complaintsData = [];
    for (let i = 0; i < 50; i++) {
      const template = complaintTemplates[i % complaintTemplates.length];
      const coordIdx = i % chennaiCoords.length;
      const coord = chennaiCoords[coordIdx];
      const citizenIdx = 7 + (i % 8); // Citizens are users[7] to users[14]
      const statusIdx = i % statuses.length;
      const priorityIdx = i % priorities.length;

      complaintsData.push({
        complaint_number: `FIX-2025-${String(i + 1).padStart(5, '0')}`,
        citizen_id: users[citizenIdx].id,
        category_id: categories[template.cat].id,
        title: `${template.title} (#${i + 1})`,
        description: template.desc,
        latitude: coord.lat + (Math.random() * 0.01 - 0.005),
        longitude: coord.lng + (Math.random() * 0.01 - 0.005),
        address: `${10 + i}, ${wards[coordIdx].name}, Chennai`,
        ward_id: wards[coordIdx].id,
        status: statuses[statusIdx],
        priority: priorities[priorityIdx],
        assigned_dept_id: categories[template.cat].department_id,
        assigned_official_id: statusIdx >= 2 ? users[2 + (template.cat % 5)].id : null,
        is_emergency: priorityIdx === 3 && i % 5 === 0,
        ai_severity_score: (0.2 + Math.random() * 0.8).toFixed(2),
        ai_category_prediction: categories[template.cat].name,
        resolution_eta: new Date(Date.now() + (24 + Math.random() * 72) * 60 * 60 * 1000),
        upvotes: Math.floor(Math.random() * 25),
        resolved_at: ['resolved', 'closed'].includes(statuses[statusIdx]) ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : null,
        created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      });
    }

    const complaints = await Complaint.bulkCreate(complaintsData);
    logger.info(`✅ ${complaints.length} complaints created`);

    // ========== STATUS HISTORY ==========
    const historyData = [];
    complaints.forEach((c) => {
      historyData.push({
        complaint_id: c.id,
        old_status: null,
        new_status: 'submitted',
        changed_by_id: c.citizen_id,
        notes: 'Complaint submitted by citizen',
        created_at: c.created_at,
      });

      if (['acknowledged', 'assigned', 'in_progress', 'resolved', 'closed'].includes(c.status)) {
        historyData.push({
          complaint_id: c.id,
          old_status: 'submitted',
          new_status: 'acknowledged',
          changed_by_id: users[1].id,
          notes: 'Complaint acknowledged by admin',
        });
      }
      if (['assigned', 'in_progress', 'resolved', 'closed'].includes(c.status)) {
        historyData.push({
          complaint_id: c.id,
          old_status: 'acknowledged',
          new_status: 'assigned',
          changed_by_id: users[1].id,
          notes: 'Assigned to department',
        });
      }
      if (['resolved', 'closed'].includes(c.status)) {
        historyData.push({
          complaint_id: c.id,
          old_status: 'in_progress',
          new_status: 'resolved',
          changed_by_id: c.assigned_official_id || users[2].id,
          notes: 'Issue has been fixed',
        });
      }
    });
    await StatusHistory.bulkCreate(historyData);
    logger.info(`✅ ${historyData.length} status history entries created`);

    // ========== NOTIFICATIONS ==========
    const notifData = complaints.slice(0, 20).map((c, i) => ({
      user_id: c.citizen_id,
      complaint_id: c.id,
      title: 'Status Update',
      message: `Your complaint "${c.title}" has been updated.`,
      type: 'status_update',
      is_read: i < 10,
    }));
    await Notification.bulkCreate(notifData);
    logger.info('✅ Notifications created');

    // ========== FEEDBACK ==========
    const feedbackData = complaints
      .filter((c) => ['resolved', 'closed'].includes(c.status))
      .slice(0, 10)
      .map((c) => ({
        complaint_id: c.id,
        citizen_id: c.citizen_id,
        rating: 3 + Math.floor(Math.random() * 3),
        comment: ['Great service!', 'Took too long but resolved', 'Excellent work', 'Satisfactory', 'Could be faster'][Math.floor(Math.random() * 5)],
      }));
    await Feedback.bulkCreate(feedbackData);
    logger.info('✅ Feedback entries created');

    // ========== REPUTATION BADGES ==========
    await ReputationBadge.bulkCreate([
      { name: 'First Reporter', description: 'Filed your first complaint', icon: 'star', points_required: 10, badge_type: 'bronze' },
      { name: 'Active Citizen', description: 'Filed 10 complaints', icon: 'shield', points_required: 50, badge_type: 'silver' },
      { name: 'Community Hero', description: 'Filed 25 complaints', icon: 'trophy', points_required: 100, badge_type: 'gold' },
      { name: 'City Guardian', description: 'Top contributor with 50+ complaints', icon: 'crown', points_required: 250, badge_type: 'platinum' },
      { name: 'Feedback Champion', description: 'Provided feedback on 10 resolved issues', icon: 'message', points_required: 30, badge_type: 'bronze' },
    ]);
    logger.info('✅ Reputation badges created');

    logger.info('');
    logger.info('🎉 ========================================');
    logger.info('🎉 Database seeded successfully!');
    logger.info('🎉 ========================================');
    logger.info('');
    logger.info('📧 Login credentials (all passwords: password123):');
    logger.info('   Super Admin: superadmin@fixit.gov.in');
    logger.info('   Admin:       admin@fixit.gov.in');
    logger.info('   Official:    roads.officer@fixit.gov.in');
    logger.info('   Citizen:     rajesh.kumar@gmail.com');
    logger.info('');

    process.exit(0);
  } catch (error) {
    logger.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seed();
