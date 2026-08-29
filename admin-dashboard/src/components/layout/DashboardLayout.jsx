// ============================================
// Fix It Admin — Dashboard Layout
// ============================================
import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import useStore from '../../store/store';

export default function DashboardLayout() {
  const { sidebarCollapsed, fetchNotifications } = useStore();

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div
        className="main-content"
        style={{
          marginLeft: sidebarCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
          transition: 'margin-left var(--transition-slow)',
        }}
      >
        <Header />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
