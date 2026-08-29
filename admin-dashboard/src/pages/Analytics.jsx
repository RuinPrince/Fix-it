// ============================================
// Fix It Admin — Analytics Page
// ============================================
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useEffect } from 'react';
import useStore from '../store/store';
import toast from 'react-hot-toast';
import { analyticsData as mockAnalytics } from '../utils/mockData';
import './pages.css';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#ec4899'];

export default function Analytics() {
  const { analyticsData, fetchDashboardData } = useStore();

  useEffect(() => {
    if (!analyticsData) fetchDashboardData();
  }, []);

  const handleExportPDF = () => {
    window.print();
  };

  const handleExportExcel = () => {
    if (!analyticsData) return;
    
    // Create CSV content for department performance
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Department Performance\n";
    csvContent += "Department Name,Total Complaints,Resolved,Resolution Rate\n";
    
    const deptData = analyticsData.by_department?.length > 0 
      ? analyticsData.by_department 
      : mockAnalytics.departmentPerformance;
      
    deptData.forEach(d => {
      const name = d.assigned_department?.name || d.name || 'Unknown';
      const total = d.count || d.total;
      const resolved = d.resolved || Math.floor(total * 0.7);
      const rate = d.rate || '75';
      csvContent += `"${name}",${total},${resolved},${rate}%\n`;
    });

    // Create a download link and trigger it
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `fixit_analytics_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Excel report downloaded successfully!');
  };

  if (!analyticsData) return <div className="p-8 text-center text-gray-400">Loading analytics...</div>;
  
  const overview = analyticsData.overview;
  const monthlyTrends = analyticsData.monthlyTrends || mockAnalytics.monthlyTrends;
  const byPriority = analyticsData.byPriority || mockAnalytics.byPriority;
  const sla = analyticsData.sla || mockAnalytics.sla;

  const departmentPerformance = analyticsData.by_department?.length > 0
    ? analyticsData.by_department.map(d => ({ name: d.assigned_department?.name || 'Unknown', total: d.count, resolved: Math.floor(d.count * 0.7), rate: '75' }))
    : mockAnalytics.departmentPerformance;

  const byCategory = analyticsData.by_category?.length > 0
    ? analyticsData.by_category.map((c, i) => ({ 
        name: c.category?.name || 'Unknown', 
        count: c.count, 
        icon: c.category?.icon || '📝', 
        color: COLORS[i % 8]
      }))
    : mockAnalytics.byCategory;

  return (
    <div className="dashboard-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics & Reports</h1>
          <p className="page-subtitle">Comprehensive performance insights</p>
        </div>
        <div className="flex gap-3">
          <button className="btn btn-outline btn-sm bg-white text-gray-800 border-gray-200 hide-on-print" onClick={handleExportPDF}>📄 Export PDF</button>
          <button className="btn btn-outline btn-sm bg-white text-gray-800 border-gray-200 hide-on-print" onClick={handleExportExcel}>📊 Export Excel</button>
        </div>
      </div>

      {/* SLA Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>{sla.onTrack}</div>
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>SLA On Track</div>
        </div>
        <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b' }}>{sla.atRisk}</div>
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>At Risk</div>
        </div>
        <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ef4444' }}>{sla.breached}</div>
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>SLA Breached</div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-row">
        <div className="chart-card glass-card">
          <h3 className="chart-title">Monthly Complaint Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} />
              <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 8, color: 'var(--text-primary)' }} />
              <Line type="monotone" dataKey="filed" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4 }} name="Filed" />
              <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} name="Resolved" />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card glass-card">
          <h3 className="chart-title">By Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={byCategory.slice(0, 8)} cx="50%" cy="50%" outerRadius={100} dataKey="count" nameKey="name" label={({ name }) => name.split(' ')[0]}>
                {byCategory.slice(0, 8).map((entry, i) => (
                  <Cell key={i} fill={entry.color || COLORS[i]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 8, color: 'var(--text-primary)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="charts-row" style={{ marginTop: '0' }}>
        <div className="chart-card glass-card">
          <h3 className="chart-title">Department Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} />
              <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 8, color: 'var(--text-primary)' }} />
              <Bar dataKey="total" fill="#3b82f6" name="Total" radius={[4, 4, 0, 0]} />
              <Bar dataKey="resolved" fill="#10b981" name="Resolved" radius={[4, 4, 0, 0]} />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card glass-card">
          <h3 className="chart-title">Resolution Rate by Dept</h3>
          <div style={{ padding: '0.5rem' }}>
            {departmentPerformance.map((d, i) => (
              <div key={i} style={{ marginBottom: '1rem' }}>
                <div className="flex justify-between items-center" style={{ marginBottom: '4px' }}>
                  <span className="text-sm font-medium">{d.name}</span>
                  <span className="text-sm font-semibold" style={{ color: parseFloat(d.rate) > 80 ? '#10b981' : '#f59e0b' }}>{d.rate}%</span>
                </div>
                <div style={{ height: 6, background: 'var(--bg-tertiary)', borderRadius: 6, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${d.rate}%`, background: parseFloat(d.rate) > 80 ? '#10b981' : parseFloat(d.rate) > 60 ? '#f59e0b' : '#ef4444', borderRadius: 6, transition: 'width 1s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
