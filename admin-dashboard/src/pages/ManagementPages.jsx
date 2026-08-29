// Management Pages (Users, Departments, Wards, AuditLogs, Settings)
import { useEffect, useState } from 'react';
import useStore from '../store/store';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import './pages.css';

// ============================================
// Users Page
// ============================================
export function Users() {
  const { users, fetchUsers } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [formData, setFormData] = useState({ name: '', email: '', role: 'citizen', password: '' });
  
  const roleColors = { citizen: '#3b82f6', official: '#f59e0b', admin: '#10b981', super_admin: '#8b5cf6' };

  useEffect(() => {
    if (users.length === 0) fetchUsers();
  }, []);
  return (
    <div className="management-page">
      <div className="page-header">
        <div><h1 className="page-title">User Management</h1><p className="page-subtitle">{users.length} registered users</p></div>
        <button className="btn btn-primary btn-sm" onClick={() => { setModalType('add'); setFormData({ name: '', email: '', role: 'citizen', password: '' }); setIsModalOpen(true); }}>+ Add User</button>
      </div>
      <div className="table-card">
        <div className="table-wrapper">
          <table className="data-table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Points</th><th>Actions</th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="font-medium">{u.profile?.full_name || 'Unknown'}</td>
                  <td className="text-sm" style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                  <td><span className="badge" style={{ background: `${roleColors[u.role]}15`, color: roleColors[u.role] }}>{u.role.replace('_', ' ')}</span></td>
                  <td className="text-sm">{u.reputation_points ?? '—'}</td>
                  <td><button className="btn btn-ghost btn-sm" onClick={() => { setModalType('edit'); setFormData({ name: u.profile?.full_name, email: u.email, role: u.role, password: '' }); setIsModalOpen(true); }}>Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalType === 'add' ? 'Add New User' : 'Edit User'}>
        <form onSubmit={(e) => { e.preventDefault(); toast.success('User saved successfully!'); setIsModalOpen(false); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="form-label">Full Name</label>
            <input type="text" className="form-input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div>
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          </div>
          {modalType === 'add' && (
            <div>
              <label className="form-label">Password</label>
              <input type="password" className="form-input" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
            </div>
          )}
          <div>
            <label className="form-label">Role</label>
            <select className="filter-select" style={{ width: '100%' }} value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
              <option value="citizen">Citizen</option>
              <option value="official">Official</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
            <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save User</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// ============================================
// Departments Page
// ============================================
export function Departments() {
  const { departments, fetchDepartments } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [formData, setFormData] = useState({ name: '', email: '', head: '' });
  
  useEffect(() => {
    if (departments.length === 0) fetchDepartments();
  }, []);
  return (
    <div className="management-page">
      <div className="page-header">
        <div><h1 className="page-title">Department Management</h1><p className="page-subtitle">{departments.length} departments</p></div>
        <button className="btn btn-primary btn-sm" onClick={() => { setModalType('add'); setFormData({ name: '', email: '', head: '' }); setIsModalOpen(true); }}>+ Add Department</button>
      </div>
      <div className="management-grid">
        {departments.map((d) => (
          <div key={d.id} className="management-card">
            <div className="flex justify-between items-center" style={{ marginBottom: '0.75rem' }}>
              <h4 style={{ fontSize: '0.95rem' }}>{d.name}</h4>
              <span className="badge badge-resolved">{d.is_active ? 'Active' : 'Inactive'}</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <span>👤 Head: {d.head?.profile?.full_name || 'N/A'}</span>
              <span>📧 {d.contact_email || 'N/A'}</span>
              <span>📊 {d.total_complaints || 0} complaints | {d.resolved || 0} resolved</span>
            </div>
            <div style={{ height: 4, background: 'var(--bg-tertiary)', borderRadius: 4, marginTop: '0.75rem', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${((d.resolved || 0) / (d.total_complaints || 1) * 100)}%`, background: '#10b981', borderRadius: 4 }} />
            </div>
            <div className="flex justify-between" style={{ marginTop: '0.75rem' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => { setModalType('edit'); setFormData({ name: d.name, email: d.contact_email, head: d.head?.profile?.full_name || '' }); setIsModalOpen(true); }}>Edit</button>
              <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger-400)' }} onClick={() => {
                if (window.confirm(`Are you sure you want to deactivate ${d.name}?`)) toast.success('Department deactivated');
              }}>Deactivate</button>
            </div>
          </div>
        ))}
      </div>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalType === 'add' ? 'Add Department' : 'Edit Department'}>
        <form onSubmit={(e) => { e.preventDefault(); toast.success('Department saved successfully!'); setIsModalOpen(false); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="form-label">Department Name</label>
            <input type="text" className="form-input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div>
            <label className="form-label">Contact Email</label>
            <input type="email" className="form-input" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          </div>
          <div>
            <label className="form-label">Department Head (Name)</label>
            <input type="text" className="form-input" value={formData.head} onChange={(e) => setFormData({...formData, head: e.target.value})} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
            <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Department</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// ============================================
// Wards Page
// ============================================
export function Wards() {
  const { wards, fetchWards, departments, fetchDepartments } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [formData, setFormData] = useState({ number: '', name: '', department_id: '' });
  
  useEffect(() => {
    if (wards.length === 0) fetchWards();
    if (departments.length === 0) fetchDepartments();
  }, []);
  return (
    <div className="management-page">
      <div className="page-header">
        <div><h1 className="page-title">Ward Management</h1><p className="page-subtitle">{wards.length} wards</p></div>
        <button className="btn btn-primary btn-sm" onClick={() => { setModalType('add'); setFormData({ number: '', name: '', department_id: departments[0]?.id || '' }); setIsModalOpen(true); }}>+ Add Ward</button>
      </div>
      <div className="management-grid">
        {wards.map((w) => {
          const dept = departments.find((d) => d.id === w.department_id);
          return (
            <div key={w.id} className="management-card">
              <div className="flex justify-between items-center">
                <h4>Ward #{w.number} — {w.name}</h4>
              </div>
              <p className="text-sm" style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Department: {dept?.name || '—'}</p>
              <div className="flex gap-2" style={{ marginTop: '0.75rem' }}>
                <button className="btn btn-ghost btn-sm" onClick={() => { setModalType('edit'); setFormData({ number: w.number, name: w.name, department_id: w.department_id }); setIsModalOpen(true); }}>Edit</button>
                <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger-400)' }} onClick={() => {
                  if (window.confirm(`Are you sure you want to delete Ward ${w.number}?`)) toast.success('Ward deleted');
                }}>Delete</button>
              </div>
            </div>
          );
        })}
      </div>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalType === 'add' ? 'Add Ward' : 'Edit Ward'}>
        <form onSubmit={(e) => { e.preventDefault(); toast.success('Ward saved successfully!'); setIsModalOpen(false); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="form-label">Ward Number</label>
            <input type="number" className="form-input" value={formData.number} onChange={(e) => setFormData({...formData, number: e.target.value})} required />
          </div>
          <div>
            <label className="form-label">Ward Name</label>
            <input type="text" className="form-input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div>
            <label className="form-label">Assigned Department</label>
            <select className="filter-select" style={{ width: '100%' }} value={formData.department_id} onChange={(e) => setFormData({...formData, department_id: e.target.value})}>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
            <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Ward</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// ============================================
// Audit Logs Page
// ============================================
export function AuditLogs() {
  const { auditLogs, fetchAuditLogs } = useStore();
  const formatDate = (d) => new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  const actionColors = { CREATE: '#10b981', UPDATE: '#3b82f6', DELETE: '#ef4444', LOGIN: '#8b5cf6', ASSIGN: '#f59e0b', ESCALATE: '#f97316', STATUS_CHANGE: '#06b6d4' };

  useEffect(() => {
    if (auditLogs.length === 0) fetchAuditLogs();
  }, []);

  return (
    <div className="management-page">
      <div className="page-header">
        <div><h1 className="page-title">Audit Logs</h1><p className="page-subtitle">System activity trail</p></div>
      </div>
      <div className="table-card">
        <div className="table-wrapper">
          <table className="data-table">
            <thead><tr><th>Time</th><th>User</th><th>Action</th><th>Resource</th><th>Object ID</th><th>IP</th></tr></thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id}>
                  <td className="text-xs" style={{ whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>{formatDate(log.created_at)}</td>
                  <td className="text-sm font-medium">{log.user?.profile?.full_name || log.user?.email || 'System'}</td>
                  <td><span className="badge" style={{ background: `${actionColors[log.action]}15`, color: actionColors[log.action] }}>{log.action}</span></td>
                  <td className="text-sm">{log.model_name}</td>
                  <td className="text-sm" style={{ color: 'var(--primary-400)' }}>#{log.object_id}</td>
                  <td className="text-xs" style={{ color: 'var(--text-muted)' }}>{log.ip_address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Settings Page
// ============================================
export function Settings() {
  const { theme, toggleTheme } = useStore();
  return (
    <div className="management-page">
      <div className="page-header">
        <div><h1 className="page-title">Settings</h1><p className="page-subtitle">System configuration</p></div>
      </div>
      <div className="settings-section">
        <h3>Appearance</h3>
        <div className="setting-row">
          <div><p className="font-medium">Dark Mode</p><p className="text-sm" style={{ color: 'var(--text-muted)' }}>Toggle dark/light theme</p></div>
          <button className={`toggle-switch ${theme === 'dark' ? 'active' : ''}`} onClick={toggleTheme} />
        </div>
        <div className="setting-row">
          <div><p className="font-medium">Language</p><p className="text-sm" style={{ color: 'var(--text-muted)' }}>Interface language</p></div>
          <select className="filter-select"><option>English</option><option>தமிழ் (Tamil)</option></select>
        </div>
      </div>
      <div className="settings-section">
        <h3>Notifications</h3>
        <div className="setting-row">
          <div><p className="font-medium">Push Notifications</p><p className="text-sm" style={{ color: 'var(--text-muted)' }}>Enable browser notifications</p></div>
          <button className="toggle-switch active" />
        </div>
        <div className="setting-row">
          <div><p className="font-medium">Email Notifications</p><p className="text-sm" style={{ color: 'var(--text-muted)' }}>Receive email updates</p></div>
          <button className="toggle-switch active" />
        </div>
        <div className="setting-row">
          <div><p className="font-medium">SLA Breach Alerts</p><p className="text-sm" style={{ color: 'var(--text-muted)' }}>Alert when SLA is about to breach</p></div>
          <button className="toggle-switch active" />
        </div>
      </div>
      <div className="settings-section">
        <h3>System Info</h3>
        <div className="setting-row"><span className="text-sm" style={{ color: 'var(--text-muted)' }}>Version</span><span className="text-sm font-medium">1.0.0</span></div>
        <div className="setting-row"><span className="text-sm" style={{ color: 'var(--text-muted)' }}>API Endpoint</span><span className="text-sm font-medium">http://localhost:5000/api/v1</span></div>
        <div className="setting-row"><span className="text-sm" style={{ color: 'var(--text-muted)' }}>Database</span><span className="text-sm font-medium">MySQL 8.0</span></div>
      </div>
    </div>
  );
}
