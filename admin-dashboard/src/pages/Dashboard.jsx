// ============================================
// Fix It Admin — Dashboard Page (Main)
// ============================================
import { MdTrendingUp, MdReportProblem, MdCheckCircle, MdWarning, MdToday, MdStar, MdAccessTime } from 'react-icons/md';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useEffect } from 'react';
import useStore from '../store/store';
import { analyticsData as mockAnalytics } from '../utils/mockData';
import './pages.css';

const statusColors = {
  submitted: '#3b82f6', acknowledged: '#8b5cf6', assigned: '#06b6d4',
  'in progress': '#f59e0b', resolved: '#10b981', closed: '#64748b', rejected: '#f43f5e', reopened: '#f97316',
};
const priorityColors = ['#10b981', '#f59e0b', '#f97316', '#ef4444'];

export default function Dashboard() {
  const { theme, analyticsData, categories, complaints, fetchDashboardData, fetchComplaints } = useStore();

  useEffect(() => {
    fetchDashboardData();
    fetchComplaints();
  }, []);

  if (!analyticsData) {
    return <div className="p-8 text-center text-gray-400">Loading dashboard...</div>;
  }

  // Fallbacks for charts that might not be fully returned by the API
  const monthlyTrends = analyticsData.monthlyTrends || mockAnalytics.monthlyTrends;
  const byPriority = analyticsData.byPriority || mockAnalytics.byPriority;
  
  const departmentPerformance = analyticsData.by_department?.length > 0
    ? analyticsData.by_department.map(d => ({ name: d.assigned_department?.name || 'Unknown', total: d.count, resolved: Math.floor(d.count * 0.7) }))
    : mockAnalytics.departmentPerformance;

  const byCategory = analyticsData.by_category?.length > 0
    ? analyticsData.by_category.map((c, i) => ({ 
        name: c.category?.name || 'Unknown', 
        count: c.count, 
        icon: c.category?.icon || '📝', 
        color: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'][i % 5]
      }))
    : mockAnalytics.byCategory;

  const stats = analyticsData.overview;
  const recentComplaints = complaints.slice(0, 8);

  const statCards = [
    { label: 'Total Complaints', value: stats.total, icon: MdReportProblem, color: '#3b82f6', change: '+12%' },
    { label: 'Resolved', value: stats.resolved, icon: MdCheckCircle, color: '#10b981', change: '+8%' },
    { label: 'Pending', value: stats.pending, icon: MdAccessTime, color: '#f59e0b', change: '-5%' },
    { label: 'Critical', value: stats.critical, icon: MdWarning, color: '#ef4444', change: '+2' },
    { label: 'Today', value: stats.today, icon: MdToday, color: '#8b5cf6', change: 'new' },
    { label: 'Avg Rating', value: stats.avg_rating, icon: MdStar, color: '#f59e0b', change: '↑0.3' },
  ];

  return (
    <div className="dashboard-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="page-subtitle">Real-time civic complaint management insights</p>
        </div>
        <div className="flex gap-2">
          <span className="badge badge-resolved">{stats.resolution_rate}% Resolution Rate</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="stat-card glass-card" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="stat-header">
                <div className="stat-icon" style={{ background: `${s.color}20`, color: s.color }}>
                  <Icon size={22} />
                </div>
                <span className="stat-change" style={{ color: s.change.includes('-') ? '#ef4444' : '#10b981' }}>{s.change}</span>
              </div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-bar">
                <div className="stat-bar-fill" style={{ width: `${Math.min((s.value / stats.total) * 100, 100)}%`, background: s.color }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        {/* Monthly Trends */}
        <div className="chart-card glass-card">
          <h3 className="chart-title">Monthly Trends</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyTrends}>
              <defs>
                <linearGradient id="filledGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="resolvedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} />
              <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} />
              <Area type="monotone" dataKey="filed" stroke="#3b82f6" fill="url(#filledGrad)" name="Filed" />
              <Area type="monotone" dataKey="resolved" stroke="#10b981" fill="url(#resolvedGrad)" name="Resolved" />
              <Legend />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* By Priority */}
        <div className="chart-card glass-card">
          <h3 className="chart-title">By Priority</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={byPriority} cx="50%" cy="50%" innerRadius={65} outerRadius={100} dataKey="count" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {byPriority.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department Performance & Recent Complaints */}
      <div className="charts-row">
        {/* Department Performance */}
        <div className="chart-card glass-card">
          <h3 className="chart-title">Department Performance</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={departmentPerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis type="number" stroke="var(--text-muted)" fontSize={12} />
              <YAxis dataKey="name" type="category" stroke="var(--text-muted)" fontSize={12} width={80} />
              <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} />
              <Bar dataKey="total" fill="#3b82f6" name="Total" radius={[0, 4, 4, 0]} />
              <Bar dataKey="resolved" fill="#10b981" name="Resolved" radius={[0, 4, 4, 0]} />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Complaints Table */}
        <div className="chart-card glass-card">
          <h3 className="chart-title">Recent Complaints</h3>
          <div className="mini-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                {recentComplaints.map((c) => (
                  <tr key={c.id}>
                    <td className="text-xs font-medium" style={{ color: 'var(--primary-400)' }}>{c.complaint_number}</td>
                    <td className="truncate" style={{ maxWidth: '180px' }}>{c.title}</td>
                    <td><span className={`badge badge-${c.status}`}>{c.status.replace('_', ' ')}</span></td>
                    <td><span className={`badge badge-${c.priority}`}>{c.priority}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="chart-card glass-card" style={{ marginTop: '1.5rem' }}>
        <h3 className="chart-title">Complaints by Category</h3>
        <div className="category-grid">
          {byCategory.map((cat, i) => (
            <div key={i} className="category-item">
              <span className="category-icon">{cat.icon}</span>
              <div className="category-info">
                <span className="category-name">{cat.name}</span>
                <span className="category-count">{cat.count} complaints</span>
              </div>
              <div className="category-bar-wrap">
                <div className="category-bar" style={{ width: `${(cat.count / 110) * 100}%`, background: cat.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
