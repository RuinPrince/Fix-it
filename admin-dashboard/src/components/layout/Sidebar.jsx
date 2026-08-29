// ============================================
// Fix It Admin — Sidebar Component
// ============================================
import { NavLink, useLocation } from 'react-router-dom';
import { 
  MdDashboard, MdReportProblem, MdMap, MdAnalytics, MdPeople,
  MdBusiness, MdLocationCity, MdHistory, MdSettings, MdLogout,
  MdKeyboardArrowLeft, MdKeyboardArrowRight
} from 'react-icons/md';
import useStore from '../../store/store';
import './Sidebar.css';

const navItems = [
  { path: '/', icon: MdDashboard, label: 'Dashboard' },
  { path: '/complaints', icon: MdReportProblem, label: 'Complaints' },
  { path: '/map', icon: MdMap, label: 'Map View' },
  { path: '/analytics', icon: MdAnalytics, label: 'Analytics' },
  { divider: true },
  { path: '/users', icon: MdPeople, label: 'Users' },
  { path: '/departments', icon: MdBusiness, label: 'Departments' },
  { path: '/wards', icon: MdLocationCity, label: 'Wards' },
  { path: '/audit-logs', icon: MdHistory, label: 'Audit Logs' },
  { divider: true },
  { path: '/settings', icon: MdSettings, label: 'Settings' },
];

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, user, logout } = useStore();
  const location = useLocation();

  return (
    <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="brand-icon">
          <span>🔧</span>
        </div>
        {!sidebarCollapsed && (
          <div className="brand-text">
            <h1>Fix It</h1>
            <span>Admin Portal</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item, i) => {
          if (item.divider) return <div key={i} className="nav-divider" />;
          const Icon = item.icon;
          const isActive = location.pathname === item.path || 
            (item.path !== '/' && location.pathname.startsWith(item.path));
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
              title={sidebarCollapsed ? item.label : ''}
            >
              <div className="nav-icon"><Icon size={20} /></div>
              {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
              {isActive && <div className="nav-indicator" />}
            </NavLink>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="sidebar-footer">
        {!sidebarCollapsed && (
          <div className="user-info">
            <div className="user-avatar">
              {user?.profile?.full_name?.charAt(0) || 'A'}
            </div>
            <div className="user-details">
              <p className="user-name">{user?.profile?.full_name}</p>
              <p className="user-role">{user?.role?.replace('_', ' ')}</p>
            </div>
          </div>
        )}
        <button className="nav-item logout-btn" onClick={logout} title="Logout">
          <div className="nav-icon"><MdLogout size={20} /></div>
          {!sidebarCollapsed && <span className="nav-label">Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {sidebarCollapsed ? <MdKeyboardArrowRight size={18} /> : <MdKeyboardArrowLeft size={18} />}
      </button>
    </aside>
  );
}
