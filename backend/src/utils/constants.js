// ============================================
// Fix It — Constants & Enums
// ============================================

export const USER_ROLES = {
  CITIZEN: 'citizen',
  OFFICIAL: 'official',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
};

export const COMPLAINT_STATUS = {
  SUBMITTED: 'submitted',
  ACKNOWLEDGED: 'acknowledged',
  ASSIGNED: 'assigned',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
  REJECTED: 'rejected',
  REOPENED: 'reopened',
};

export const COMPLAINT_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

export const NOTIFICATION_TYPES = {
  STATUS_UPDATE: 'status_update',
  ASSIGNMENT: 'assignment',
  ESCALATION: 'escalation',
  CHAT: 'chat',
  SYSTEM: 'system',
  BADGE: 'badge',
};

export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  SYSTEM: 'system',
};

export const LANGUAGES = {
  ENGLISH: 'en',
  TAMIL: 'ta',
};

export const BADGE_TYPES = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum',
};

// Reputation points awarded for actions
export const REPUTATION_POINTS = {
  COMPLAINT_FILED: 10,
  COMPLAINT_RESOLVED: 5,
  FEEDBACK_GIVEN: 3,
  UPVOTE_RECEIVED: 2,
  FIRST_COMPLAINT: 20,
  TEN_COMPLAINTS: 50,
  FIFTY_COMPLAINTS: 100,
};

// Status transition rules
export const VALID_STATUS_TRANSITIONS = {
  [COMPLAINT_STATUS.SUBMITTED]: [
    COMPLAINT_STATUS.ACKNOWLEDGED,
    COMPLAINT_STATUS.REJECTED,
  ],
  [COMPLAINT_STATUS.ACKNOWLEDGED]: [
    COMPLAINT_STATUS.ASSIGNED,
    COMPLAINT_STATUS.REJECTED,
  ],
  [COMPLAINT_STATUS.ASSIGNED]: [
    COMPLAINT_STATUS.IN_PROGRESS,
    COMPLAINT_STATUS.REJECTED,
  ],
  [COMPLAINT_STATUS.IN_PROGRESS]: [
    COMPLAINT_STATUS.RESOLVED,
    COMPLAINT_STATUS.ASSIGNED,
  ],
  [COMPLAINT_STATUS.RESOLVED]: [
    COMPLAINT_STATUS.CLOSED,
    COMPLAINT_STATUS.REOPENED,
  ],
  [COMPLAINT_STATUS.CLOSED]: [],
  [COMPLAINT_STATUS.REJECTED]: [COMPLAINT_STATUS.REOPENED],
  [COMPLAINT_STATUS.REOPENED]: [
    COMPLAINT_STATUS.ACKNOWLEDGED,
    COMPLAINT_STATUS.ASSIGNED,
  ],
};

// Priority weights for AI severity scoring
export const PRIORITY_WEIGHTS = {
  emergency: 10,
  critical_keywords: ['flood', 'collapse', 'fire', 'accident', 'danger', 'emergency', 'urgent', 'broken main', 'sewage overflow'],
  high_keywords: ['pothole', 'water leakage', 'streetlight', 'drainage', 'sewage', 'broken'],
  medium_keywords: ['garbage', 'waste', 'noise', 'encroachment', 'illegal'],
  low_keywords: ['suggestion', 'feedback', 'minor', 'cosmetic'],
};

// SLA defaults (in hours)
export const DEFAULT_SLA = {
  [COMPLAINT_PRIORITY.CRITICAL]: 4,
  [COMPLAINT_PRIORITY.HIGH]: 24,
  [COMPLAINT_PRIORITY.MEDIUM]: 48,
  [COMPLAINT_PRIORITY.LOW]: 72,
};

// Socket events
export const SOCKET_EVENTS = {
  // Client → Server
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',
  SEND_MESSAGE: 'send_message',
  TYPING: 'typing',
  STOP_TYPING: 'stop_typing',

  // Server → Client
  NEW_MESSAGE: 'new_message',
  USER_TYPING: 'user_typing',
  USER_STOP_TYPING: 'user_stop_typing',
  NOTIFICATION: 'notification',
  COMPLAINT_UPDATE: 'complaint_update',
  STATUS_CHANGE: 'status_change',
};

// Category definitions with Tamil names
export const CATEGORIES = [
  { name: 'Pothole', name_ta: 'குழி', icon: 'road', sla_hours: 24 },
  { name: 'Garbage Dump', name_ta: 'குப்பைக் கிடங்கு', icon: 'trash', sla_hours: 12 },
  { name: 'Water Leakage', name_ta: 'நீர் கசிவு', icon: 'water', sla_hours: 8 },
  { name: 'Streetlight Failure', name_ta: 'தெரு விளக்கு பழுது', icon: 'lightbulb', sla_hours: 24 },
  { name: 'Drainage Block', name_ta: 'வடிகால் அடைப்பு', icon: 'drain', sla_hours: 12 },
  { name: 'Illegal Dumping', name_ta: 'சட்டவிரோத கழிவு கொட்டுதல்', icon: 'warning', sla_hours: 48 },
  { name: 'Road Damage', name_ta: 'சாலை சேதம்', icon: 'construction', sla_hours: 48 },
  { name: 'Water Supply', name_ta: 'நீர் வழங்கல்', icon: 'faucet', sla_hours: 6 },
  { name: 'Sewage Overflow', name_ta: 'கழிவுநீர் வழிதல்', icon: 'sewage', sla_hours: 4 },
  { name: 'Noise Complaint', name_ta: 'ஒலி புகார்', icon: 'volume', sla_hours: 72 },
  { name: 'Encroachment', name_ta: 'ஆக்கிரமிப்பு', icon: 'barrier', sla_hours: 72 },
  { name: 'Traffic Signal', name_ta: 'போக்குவரத்து சிக்னல்', icon: 'traffic', sla_hours: 12 },
];

export const DEPARTMENTS = [
  { name: 'Roads & Infrastructure', contact_email: 'roads@fixit.gov.in' },
  { name: 'Water Supply & Sewerage', contact_email: 'water@fixit.gov.in' },
  { name: 'Sanitation & Waste Management', contact_email: 'sanitation@fixit.gov.in' },
  { name: 'Electricity & Streetlights', contact_email: 'electricity@fixit.gov.in' },
  { name: 'General Administration', contact_email: 'admin@fixit.gov.in' },
];

export const WARDS = [
  { name: 'T. Nagar', number: 1 },
  { name: 'Anna Nagar', number: 2 },
  { name: 'Mylapore', number: 3 },
  { name: 'Adyar', number: 4 },
  { name: 'Velachery', number: 5 },
  { name: 'Tambaram', number: 6 },
  { name: 'Chrompet', number: 7 },
  { name: 'Porur', number: 8 },
  { name: 'Guindy', number: 9 },
  { name: 'Kodambakkam', number: 10 },
];
