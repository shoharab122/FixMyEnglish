import { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Icon } from '../components/Icon';
import { GiMi } from '../components/GiMi/GiMi';
import './Layout.css';

/* ============================================================
   Layout v11 — Polished rail, glass topbar, floating mobile nav, Langut drawer.
   ============================================================ */

const NAV = [
  { to: '/',            icon: 'grid',     label: 'Overview',   end: true, tint: 'purple'  },
  { to: '/vocabulary',  icon: 'book',     label: 'Vocabulary',            tint: 'lime'    },
  { to: '/grammar',     icon: 'target',   label: 'Grammar',               tint: 'pink'    },
  { to: '/curriculum',  icon: 'calendar', label: 'Curriculum',            tint: 'yellow'  },
  { to: '/exams',       icon: 'flag',     label: 'Exams',                 tint: 'purple2' },
  { to: '/speaking',    icon: 'mic',      label: 'Speaking',              tint: 'pink2'   },
  { to: '/progress',    icon: 'trophy',   label: 'Progress',              tint: 'lime'    },
  { to: '/community',   icon: 'chat',     label: 'Community',             tint: 'purple'  },
  { to: '/live-rooms',  icon: 'zap',      label: 'Live Rooms',            tint: 'yellow'  },
  { to: '/pricing',     icon: 'wallet',   label: 'Pricing',               tint: 'pink'    },
];

const MOBILE_NAV = [
  { to: '/',           icon: 'grid',   label: 'Home',     end: true },
  { to: '/vocabulary', icon: 'book',   label: 'Vocab' },
  { to: '/exams',      icon: 'flag',   label: 'Exams' },
  { to: '/progress',   icon: 'trophy', label: 'Progress' },
  { to: '/profile',    icon: 'users',  label: 'Profile' },
];

const RAIL_CSS = `
#root .ec-rail {
  width: 84px !important;
  flex-shrink: 0 !important;
  background-color: #0F1222 !important;
  background-image:
    radial-gradient(120% 60% at 0% 0%, rgba(108,76,241,0.28) 0%, transparent 60%),
    radial-gradient(100% 50% at 100% 100%, rgba(241,76,160,0.18) 0%, transparent 60%) !important;
  border: 1px solid rgba(255,255,255,0.07) !important;
  margin: 16px 0 16px 16px !important;
  border-radius: 28px !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  padding: 22px 0 !important;
  box-shadow: 0 20px 48px rgba(15,18,34,0.28), inset 0 1px 0 rgba(255,255,255,0.06) !important;
  position: sticky !important;
  top: 16px !important;
  height: calc(100vh - 32px) !important;
  z-index: 5 !important;
  overflow: visible !important;
  color: rgba(255,255,255,0.55) !important;
  transition: width 0.32s cubic-bezier(0.22,1,0.36,1), padding 0.32s cubic-bezier(0.22,1,0.36,1) !important;
}
#root .ec-rail--expanded {
  width: 224px !important;
  padding: 22px 12px !important;
  align-items: stretch !important;
}

#root .ec-rail-logo {
  display: flex !important;
  align-items: center !important;
  gap: 12px !important;
  text-decoration: none !important;
  flex-shrink: 0 !important;
  height: 38px !important;
  padding: 0 4px !important;
  min-width: 0 !important;
}
#root .ec-rail-logo-mark {
  width: 38px !important;
  height: 38px !important;
  border-radius: 12px !important;
  background-color: #6C4CF1 !important;
  background-image: linear-gradient(135deg, #F14CA0 0%, #6C4CF1 100%) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  color: #ffffff !important;
  font-size: 17px !important;
  font-weight: 900 !important;
  flex-shrink: 0 !important;
  box-shadow: 0 6px 18px rgba(241,76,160,0.45), inset 0 1px 0 rgba(255,255,255,0.3) !important;
  transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1) !important;
}
#root .ec-rail-logo:hover .ec-rail-logo-mark { transform: rotate(-6deg) scale(1.06) !important; }
#root .ec-rail-logo-text {
  font-size: 15px !important;
  font-weight: 800 !important;
  letter-spacing: -0.01em !important;
  color: #ffffff !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  min-width: 0 !important;
}

#root .ec-rail-nav {
  margin-top: 32px !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  gap: 6px !important;
  flex: 1 !important;
  min-height: 0 !important;
  width: 100% !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  scrollbar-width: none !important;
}
#root .ec-rail-nav::-webkit-scrollbar { display: none !important; }
#root .ec-rail--expanded .ec-rail-nav { align-items: stretch !important; }

#root .ec-rail-btn {
  position: relative !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 12px !important;
  width: 48px !important;
  height: 48px !important;
  min-width: 48px !important;
  min-height: 48px !important;
  max-width: 48px !important;
  max-height: 48px !important;
  padding: 0 !important;
  margin: 0 !important;
  border: none !important;
  border-radius: 16px !important;
  background-color: transparent !important;
  background-image: none !important;
  color: rgba(255,255,255,0.55) !important;
  text-decoration: none !important;
  cursor: pointer !important;
  flex-shrink: 0 !important;
  font-family: inherit !important;
  overflow: hidden !important;
  white-space: nowrap !important;
  -webkit-tap-highlight-color: transparent !important;
  font-size: 0 !important;
  line-height: 0 !important;
  text-indent: -9999px !important;
  transition: background-color 0.2s ease, color 0.2s ease,
              transform 0.2s cubic-bezier(0.34,1.56,0.64,1),
              width 0.32s cubic-bezier(0.22,1,0.36,1),
              padding 0.32s cubic-bezier(0.22,1,0.36,1) !important;
}
#root .ec-rail--expanded .ec-rail-btn {
  width: 100% !important;
  max-width: none !important;
  justify-content: flex-start !important;
  padding: 0 14px !important;
  text-indent: 0 !important;
}

#root .ec-rail-btn > svg {
  display: block !important;
  width: 21px !important;
  height: 21px !important;
  max-width: 21px !important;
  max-height: 21px !important;
  flex-shrink: 0 !important;
  color: currentColor !important;
  pointer-events: none !important;
  text-indent: 0 !important;
  font-size: 21px !important;
  line-height: 21px !important;
}

#root .ec-rail-btn > span {
  display: none !important;
  visibility: hidden !important;
}
#root .ec-rail--expanded .ec-rail-btn > span.ec-rail-label {
  display: inline-block !important;
  visibility: visible !important;
  font-size: 13.5px !important;
  line-height: 1 !important;
  font-weight: 700 !important;
  color: currentColor !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  min-width: 0 !important;
  flex: 1 !important;
  text-align: left !important;
  text-indent: 0 !important;
  letter-spacing: 0 !important;
}

#root .ec-rail-btn:hover {
  background-color: rgba(255,255,255,0.09) !important;
  color: #ffffff !important;
  transform: translateY(-1px) !important;
}
#root .ec-rail-btn:active { transform: translateY(0) scale(0.95) !important; }
#root .ec-rail-btn:focus-visible {
  outline: 2px solid #9b7bff !important;
  outline-offset: 2px !important;
}
#root .ec-rail-btn--active {
  background-color: #6C4CF1 !important;
  background-image: linear-gradient(135deg, #8466ff 0%, #6C4CF1 100%) !important;
  color: #ffffff !important;
  box-shadow: 0 8px 22px rgba(108,76,241,0.5), inset 0 1px 0 rgba(255,255,255,0.22) !important;
}
#root .ec-rail-btn--active:hover { background-color: #7d5eff !important; }

#root .ec-rail-btn--logout {
  color: rgba(255,255,255,0.55) !important;
  margin-top: 8px !important;
  margin-bottom: 8px !important;
  flex-shrink: 0 !important;
}
#root .ec-rail-btn--logout:hover {
  background-color: rgba(241,76,160,0.2) !important;
  color: #f68ac0 !important;
}

#root .ec-rail-toggle {
  position: absolute !important;
  right: -16px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  width: 32px !important;
  height: 32px !important;
  border-radius: 50% !important;
  background-color: #ffffff !important;
  background-image: none !important;
  border: 1px solid rgba(15,18,34,0.08) !important;
  color: #0F1222 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  cursor: pointer !important;
  z-index: 10 !important;
  padding: 0 !important;
  font-family: inherit !important;
  box-shadow: 0 6px 18px rgba(15,18,34,0.24), 0 2px 4px rgba(15,18,34,0.08) !important;
  transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1),
              box-shadow 0.22s ease,
              background-color 0.2s ease,
              color 0.2s ease !important;
}
#root .ec-rail-toggle:hover {
  background-color: #6C4CF1 !important;
  color: #ffffff !important;
  border-color: #6C4CF1 !important;
  transform: translateY(-50%) scale(1.10) !important;
  box-shadow: 0 8px 22px rgba(108,76,241,0.48) !important;
}
#root .ec-rail-toggle:active { transform: translateY(-50%) scale(0.94) !important; }
#root .ec-rail-toggle:focus-visible {
  outline: 2px solid #6C4CF1 !important;
  outline-offset: 3px !important;
}

@media (max-width: 720px) {
  #root .ec-rail { display: none !important; }
}
`;

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none"
       stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

const ChevronLeft = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none"
       stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 6l-6 6 6 6" />
  </svg>
);

const ChevronRight = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none"
       stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 6l6 6-6 6" />
  </svg>
);

export function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [railExpanded, setRailExpanded] = useState(false);

  const firstName = user?.name?.split(' ')[0] || 'Guest';
  const initial   = firstName.charAt(0).toUpperCase();
  const tier      = user?.tier ?? 'guest';

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 720) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleLogout = async () => {
    setMenuOpen(false);
    try { await logout(); } catch { /* ignore */ }
    navigate('/login');
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: RAIL_CSS }} />

      <div className="ec-shell">
        <aside
          className={`ec-rail${railExpanded ? ' ec-rail--expanded' : ''}`}
          aria-label="Primary"
        >
          <Link to="/" className="ec-rail-logo" aria-label="English Coach — Home" title="English Coach">
            <span className="ec-rail-logo-mark" aria-hidden="true">E</span>
            {railExpanded && (
              <span className="ec-rail-logo-text">English Coach</span>
            )}
          </Link>

          <nav className="ec-rail-nav">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                title={item.label}
                aria-label={item.label}
                className={({ isActive }) =>
                  `ec-rail-btn${isActive ? ' ec-rail-btn--active' : ''}`
                }
              >
                <Icon name={item.icon} />
                {railExpanded && (
                  <span className="ec-rail-label">{item.label}</span>
                )}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            className="ec-rail-btn ec-rail-btn--logout"
            title="Log out"
            aria-label="Log out"
            onClick={handleLogout}
          >
            <Icon name="logout" />
            {railExpanded && (
              <span className="ec-rail-label">Log out</span>
            )}
          </button>

          <button
            type="button"
            className="ec-rail-toggle"
            onClick={() => setRailExpanded((v) => !v)}
            aria-label={railExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
            title={railExpanded ? 'Collapse' : 'Expand'}
          >
            {railExpanded ? <ChevronLeft /> : <ChevronRight />}
          </button>
        </aside>

        <main className="ec-main">
          <header className="ec-topbar">
            <button
              type="button"
              className="ec-menu-btn"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="ec-drawer"
              onClick={() => setMenuOpen((o) => !o)}
            >
              <MenuIcon />
            </button>

            <label className="ec-search">
              <Icon name="search" />
              <input
                placeholder="Search lessons, words, exams…"
                aria-label="Search"
              />
              <span className="ec-search-kbd" aria-hidden="true">⌘K</span>
            </label>

            <div className="ec-topbar-right">
              <span className="ec-tier-pill" data-tier={tier}>
                <span className="ec-tier-dot" aria-hidden="true" />
                {tier}
              </span>

              {user ? (
                <button
                  type="button"
                  className="ec-auth-btn ec-auth-btn--logout"
                  onClick={handleLogout}
                  title="Log out"
                >
                  <Icon name="logout" />
                  <span className="ec-auth-btn-label">Log out</span>
                </button>
              ) : (
                <Link to="/login" className="ec-auth-btn ec-auth-btn--login" title="Log in">
                  <Icon name="users" />
                  <span className="ec-auth-btn-label">Log in</span>
                </Link>
              )}

              <button
                type="button"
                className="ec-icon-btn ec-icon-btn--bell"
                aria-label="Notifications"
              >
                <Icon name="bell" />
                <span className="ec-notif-dot" aria-hidden="true" />
              </button>

              <Link
                to="/profile"
                className="ec-avatar"
                aria-label={`Profile — ${firstName}`}
                title={firstName}
              >
                <span className="ec-avatar-initial" aria-hidden="true">{initial}</span>
                <span className="ec-avatar-tier" data-tier={tier} aria-hidden="true" />
              </Link>
            </div>
          </header>

          <div className="ec-main-content">{children}</div>
        </main>

        <nav className="ec-bottom-nav" aria-label="Primary mobile">
          {MOBILE_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `ec-bottom-nav-btn${isActive ? ' ec-bottom-nav-btn--active' : ''}`
              }
            >
              <span className="ec-bottom-nav-icon" aria-hidden="true">
                <Icon name={item.icon} />
              </span>
              <span className="ec-bottom-nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div
          className={`ec-drawer-backdrop${menuOpen ? ' ec-drawer-backdrop--open' : ''}`}
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />

        <aside
          id="ec-drawer"
          className={`ec-drawer${menuOpen ? ' ec-drawer--open' : ''}`}
          aria-label="Main menu"
          aria-hidden={!menuOpen}
        >
          <header className="ec-drawer-head">
            <Link
              to="/"
              className="ec-drawer-logo"
              onClick={() => setMenuOpen(false)}
              aria-label="English Coach — Home"
            >
              <span className="ec-drawer-logo-mark" aria-hidden="true">E</span>
              <span className="ec-drawer-logo-text">
                <span className="ec-drawer-logo-title">English Coach</span>
                <span className="ec-drawer-logo-sub">Learn · Practice · Succeed</span>
              </span>
            </Link>

            <button
              type="button"
              className="ec-drawer-close"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            >
              <CloseIcon />
            </button>
          </header>

          <div className="ec-drawer-user">
            <span className="ec-drawer-user-avatar" aria-hidden="true">
              {initial}
              <span className="ec-drawer-user-tier" data-tier={tier} />
            </span>
            <div className="ec-drawer-user-info">
              <p className="ec-drawer-user-name">{user?.name || 'Guest learner'}</p>
              <span className="ec-drawer-user-badge" data-tier={tier}>
                {tier}
              </span>
            </div>
          </div>

          <nav className="ec-drawer-nav" aria-label="All pages">
            {NAV.map((item, i) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `ec-drawer-link${isActive ? ' ec-drawer-link--active' : ''}`
                }
                style={{ animationDelay: menuOpen ? `${0.05 + i * 0.025}s` : '0s' }}
                onClick={() => setMenuOpen(false)}
              >
                <span
                  className="ec-drawer-link-icon"
                  data-tint={item.tint || 'lime'}
                  aria-hidden="true"
                >
                  <Icon name={item.icon} />
                </span>
                <span className="ec-drawer-link-label">{item.label}</span>
                <span className="ec-drawer-link-arrow" aria-hidden="true">›</span>
              </NavLink>
            ))}
          </nav>

          <footer className="ec-drawer-foot">
            {user ? (
              <button
                type="button"
                className="ec-drawer-action ec-drawer-action--logout"
                onClick={handleLogout}
              >
                <Icon name="logout" />
                <span>Log out</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="ec-drawer-action ec-drawer-action--login"
                onClick={() => setMenuOpen(false)}
              >
                <Icon name="users" />
                <span>Log in</span>
              </Link>
            )}
          </footer>
        </aside>
      </div>

      {/* ============================================================
          GiMi — floating AI assistant (mounted once for the whole app)
         ============================================================ */}
      <GiMi />
    </>
  );
}

export default Layout;