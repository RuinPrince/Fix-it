// ============================================
// Fix It Admin — Header Component
// ============================================
import { useState } from 'react';
import { MdSearch, MdNotifications, MdDarkMode, MdLightMode, MdClose } from 'react-icons/md';
import useStore from '../../store/store';
import './Header.css';

export default function Header() {
  const { theme, toggleTheme, notifications, toggleNotificationPanel, showNotificationPanel, markNotificationRead } = useStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const formatTime = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  return (
    <header className="header">
      <div className="header-left">
        {searchOpen ? (
          <div className="search-expanded animate-scale-in">
            <MdSearch size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search complaints, users, departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button className="search-close" onClick={() => { setSearchOpen(false); setSearchQuery(''); }}>
              <MdClose size={16} />
            </button>
          </div>
        ) : (
          <button className="header-btn" onClick={() => setSearchOpen(true)} title="Search">
            <MdSearch size={20} />
          </button>
        )}
      </div>

      <div className="header-right">
        <button className="header-btn" onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
        </button>

        <div className="notification-wrapper">
          <button className="header-btn" onClick={toggleNotificationPanel} title="Notifications">
            <MdNotifications size={20} />
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>

          {showNotificationPanel && (
            <div className="notification-panel animate-slide-right">
              <div className="panel-header">
                <h3>Notifications</h3>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{unreadCount} new</span>
              </div>
              <div className="panel-body">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`notification-item ${!n.is_read ? 'unread' : ''}`}
                    onClick={() => markNotificationRead(n.id)}
                  >
                    <div className={`notif-dot ${n.type}`} />
                    <div className="notif-content">
                      <p className="notif-title">{n.title}</p>
                      <p className="notif-message">{n.message}</p>
                      <span className="notif-time">{formatTime(n.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
