import { create } from 'zustand';
import apiClient from '../api/client';

const useStore = create((set, get) => ({
  // Auth state
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => {
    localStorage.removeItem('fixit-token');
    set({ user: null, isAuthenticated: false });
  },
  login: async (email, password) => {
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      
      // Prevent citizens from accessing the admin dashboard
      if (res.data.data.user.role === 'citizen') {
        throw new Error('Access denied. Citizens must use the mobile application.');
      }

      localStorage.setItem('fixit-token', res.data.data.accessToken);
      set({ user: res.data.data.user, isAuthenticated: true });
      return true;
    } catch (error) {
      console.error("Login failed", error);
      const msg = error.response?.data?.message || error.message || 'Login failed';
      throw new Error(msg);
    }
  },

  // Theme
  theme: (typeof window !== 'undefined' && localStorage.getItem('fixit-theme')) || 'dark',
  toggleTheme: () => {
    const newTheme = get().theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('fixit-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    set({ theme: newTheme });
  },

  // Sidebar
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  // Complaints
  complaints: [],
  selectedComplaints: [],
  isLoadingComplaints: false,
  fetchComplaints: async () => {
    set({ isLoadingComplaints: true });
    try {
      const res = await apiClient.get('/complaints');
      set({ complaints: res.data.data });
    } catch (error) {
      console.error("Failed to fetch complaints", error);
    } finally {
      set({ isLoadingComplaints: false });
    }
  },
  setSelectedComplaints: (ids) => set({ selectedComplaints: ids }),
  toggleComplaintSelection: (id) => {
    const current = get().selectedComplaints;
    set({
      selectedComplaints: current.includes(id)
        ? current.filter((i) => i !== id)
        : [...current, id],
    });
  },
  selectAllComplaints: () => set((s) => ({
    selectedComplaints: s.selectedComplaints.length === s.complaints.length
      ? []
      : s.complaints.map((c) => c.id),
  })),

  // Analytics & Dashboard Data
  analyticsData: null,
  categories: [],
  fetchDashboardData: async () => {
    try {
      const [statsRes, catRes, slaRes, trendsRes] = await Promise.all([
        apiClient.get('/analytics/dashboard'),
        apiClient.get('/categories'),
        apiClient.get('/analytics/sla'),
        apiClient.get('/analytics/trends')
      ]);
      
      const stats = statsRes.data.data;
      const sla = slaRes.data.data.summary;
      const trends = trendsRes.data.data;
      
      set({ 
        analyticsData: { 
          ...stats, 
          sla: { onTrack: sla.on_track, atRisk: 0, breached: sla.breached },
          monthlyTrends: trends
        },
        categories: catRes.data.data
      });
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    }
  },

  // Notifications
  notifications: [],
  showNotificationPanel: false,
  toggleNotificationPanel: () => set((s) => ({ showNotificationPanel: !s.showNotificationPanel })),
  fetchNotifications: async () => {
    try {
      const res = await apiClient.get('/notifications');
      set({ notifications: res.data.data });
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  },
  markNotificationRead: (id) => set((s) => ({
    notifications: s.notifications.map((n) => n.id === id ? { ...n, is_read: true } : n),
  })),
  unreadCount: () => get().notifications.filter((n) => !n.is_read).length,

  // Filters
  filters: {
    status: '', priority: '', category: '', ward: '', department: '', search: '', dateRange: null,
  },
  setFilter: (key, value) => set((s) => ({
    filters: { ...s.filters, [key]: value },
  })),
  clearFilters: () => set({
    filters: { status: '', priority: '', category: '', ward: '', department: '', search: '', dateRange: null },
  }),

  // Management Data
  users: [],
  departments: [],
  wards: [],
  auditLogs: [],
  fetchUsers: async () => {
    try { const res = await apiClient.get('/admin/users'); set({ users: res.data.data }); } catch(e) {}
  },
  fetchDepartments: async () => {
    try { const res = await apiClient.get('/departments'); set({ departments: res.data.data }); } catch(e) {}
  },
  fetchWards: async () => {
    try { const res = await apiClient.get('/wards'); set({ wards: res.data.data }); } catch(e) {}
  },
  fetchAuditLogs: async () => {
    try { const res = await apiClient.get('/admin/audit'); set({ auditLogs: res.data.data }); } catch(e) {}
  },

  // Modal state
  activeModal: null,
  modalData: null,
  openModal: (modal, data = null) => set({ activeModal: modal, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),
}));

export default useStore;
