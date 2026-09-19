import { useEffect, useState } from 'react';
import {
  NavLink,
  Outlet,
  Link,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MenuIcon } from './icons';
import { AdminToasts } from './AdminToasts';
import { AdminErrorBoundary } from './AdminErrorBoundary';
import './admin.css';

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [{ to: '/admin', label: 'Dashboard', icon: '📊', end: true }],
  },
  {
    label: 'People',
    items: [
      { to: '/admin/users', label: 'Users', icon: '👥' },
      { to: '/admin/community', label: 'Community', icon: '💬' },
    ],
  },
  {
    label: 'Content',
    items: [
      { to: '/admin/vocab', label: 'Vocabulary', icon: '📚' },
      { to: '/admin/grammar', label: 'Grammar', icon: '🎯' },
      { to: '/admin/curriculum', label: 'Curriculum', icon: '📖' },
      { to: '/admin/exams', label: 'Exam Tracks', icon: '🚩' },
      { to: '/admin/papers', label: 'Exam Papers', icon: '📝' },
      { to: '/admin/speaking', label: 'Speaking', icon: '🎤' },
    ],
  },
  {
    label: 'Live',
    items: [{ to: '/admin/live-rooms', label: 'Live Rooms', icon: '📹' }],
  },
  {
    label: 'Money',
    items: [
      { to: '/admin/products', label: 'Products', icon: '📦' },
      { to: '/admin/coupons', label: 'Coupons', icon: '🎟️' },
      { to: '/admin/purchases', label: 'Purchases', icon: '💳' },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/admin/announcements', label: 'Announcements', icon: '📢' },
      { to: '/admin/feature-flags', label: 'Feature Flags', icon: '⚙️' },
      { to: '/admin/audit-log', label: 'Audit Log', icon: '📋' },
    ],
  },
];

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const initial = (user?.name || 'A').charAt(0).toUpperCase();
  const isSuper = user?.role === 'superadmin';

  useEffect(() => { setOpen(false); }, [location.pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const handleLogout = async () => {
    try { await logout(); } catch { /* ignore */ }
    navigate('/login');
  };

  return (
    <div className="ec-admin">
      <AdminToasts />

      <button
        className="ec-admin-menu-btn"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <MenuIcon />
      </button>

      <div
        className={`ec-admin-backdrop${open ? ' ec-admin-backdrop--open' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <aside className={`ec-admin-side${open ? ' ec-admin-side--open' : ''}`}>
        <div className="ec-admin-brand">
          <span className="ec-admin-brand-mark">E</span>
          <span>Admin Panel</span>
        </div>

        <nav className="ec-admin-nav">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="ec-admin-nav-group">
              <div className="ec-admin-nav-group-label">{group.label}</div>
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `ec-admin-link${isActive ? ' ec-admin-link--active' : ''}`
                  }
                >
                  <span className="ec-admin-link-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="ec-admin-side-foot">
          <div className="ec-admin-user-row">
            <span className="ec-admin-user-avatar">{initial}</span>
            <div className="ec-admin-user-info">
              <div className="ec-admin-user-name">{user?.name || 'Admin'}</div>
              <div className="ec-admin-user-role">
                {user?.role || 'user'} {isSuper ? '★' : ''}
              </div>
            </div>
          </div>
          <Link to="/" className="ec-admin-back-link">
            ← Back to app
          </Link>
          <button className="ec-admin-logout" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </aside>

      <main className="ec-admin-main">
        <AdminErrorBoundary>
          <Outlet />
        </AdminErrorBoundary>
      </main>
    </div>
  );
}

export default AdminLayout;
