import { useEffect, useState } from 'react';
import { NavLink, Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MenuIcon } from './icons';
import './admin.css';

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { to: '/admin',         label: 'Dashboard',   icon: '📊', end: true },
    ],
  },
  {
    label: 'People',
    items: [
      { to: '/admin/users',   label: 'Users',       icon: '👥' },
      { to: '/admin/community', label: 'Community', icon: '💬' },
    ],
  },
  {
    label: 'Content',
    items: [
      { to: '/admin/vocab',     label: 'Vocabulary',  icon: '📚' },
      { to: '/admin/grammar',   label: 'Grammar',     icon: '🎯' },
      { to: '/admin/curriculum', label: 'Curriculum', icon: '📖' },
      { to: '/admin/exams',     label: 'Exams',       icon: '🚩' },
      { to: '/admin/speaking',  label: 'Speaking',    icon: '🎤' },
    ],
  },
  {
    label: 'Live',
    items: [
      { to: '/admin/live-rooms', label: 'Live Rooms', icon: '📹' },
    ],
  },
  {
    label: 'Money',
    items: [
      { to: '/admin/products',  label: 'Products',  icon: '📦', sa: true },
      { to: '/admin/coupons',   label: 'Coupons',   icon: '🎟️', sa: true },
      { to: '/admin/purchases', label: 'Purchases', icon: '💳', sa: true },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/admin/announcements', label: 'Announcements', icon: '📢', sa: true },
      { to: '/admin/feature-flags', label: 'Feature Flags', icon: '⚙️', sa: true },
      { to: '/admin/audit-log',     label: 'Audit Log',     icon: '📋', sa: true },
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

  const handleLogout = async () => {
    try { await logout(); } catch { /* */ }
    navigate('/login');
  };

  return (
    <div className="ec-admin">
      <button
        className="ec-admin-menu-btn"
        aria-label="Menu"
        onClick={() => setOpen((v) => !v)}
      >
        <MenuIcon />
      </button>

      <div
        className={`ec-admin-backdrop${open ? ' ec-admin-backdrop--open' : ''}`}
        onClick={() => setOpen(false)}
      />

      <aside className={`ec-admin-side${open ? ' ec-admin-side--open' : ''}`}>
        <div className="ec-admin-brand">
          <span className="ec-admin-brand-mark">E</span>
          <span>Admin Panel</span>
        </div>

        <nav className="ec-admin-nav">
          {NAV_GROUPS.map((group) => {
            const visible = group.items.filter((it) => !it.sa || isSuper);
            if (visible.length === 0) return null;
            return (
              <div key={group.label} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 9.5, fontWeight: 900, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', padding: '6px 12px 6px' }}>
                  {group.label}
                </div>
                {visible.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `ec-admin-link${isActive ? ' ec-admin-link--active' : ''}`
                    }
                  >
                    <span className="ec-admin-link-icon">{item.icon}</span>
                    <span>{item.label}</span>
                    {item.sa && <span className="ec-admin-link-badge ec-admin-link-badge--sa">SA</span>}
                  </NavLink>
                ))}
              </div>
            );
          })}
        </nav>

        <div className="ec-admin-side-foot">
          <div className="ec-admin-user-row">
            <span className="ec-admin-user-avatar">{initial}</span>
            <div className="ec-admin-user-info">
              <div className="ec-admin-user-name">{user?.name || 'Admin'}</div>
              <div className="ec-admin-user-role">{user?.role || 'user'}</div>
            </div>
          </div>
          <Link to="/" style={{ display: 'block', textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.55)', marginBottom: 8, textDecoration: 'none', fontWeight: 700 }}>
            ← Back to app
          </Link>
          <button className="ec-admin-logout" onClick={handleLogout}>Log out</button>
        </div>
      </aside>

      <main className="ec-admin-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
