import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NotificationsPanel.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const KIND_ICON = {
  badge: '🏆', live: '🔴', announcement: '📢', info: 'ℹ️',
};

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export function NotificationsPanel({ open, onClose }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch(`${API_URL}/api/notifications`, { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => setItems(Array.isArray(d.items) ? d.items : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    const onClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
    };
    window.addEventListener('keydown', onKey);
    setTimeout(() => document.addEventListener('mousedown', onClick), 0);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open, onClose]);

  if (!open) return null;

  const go = (item) => {
    if (item.to) navigate(item.to);
    onClose();
  };

  return (
    <div className="notif-panel" ref={panelRef} role="dialog" aria-label="Notifications">
      <div className="notif-head">
        <strong>Notifications</strong>
        <button type="button" onClick={onClose} aria-label="Close">×</button>
      </div>

      <div className="notif-body">
        {loading && <div className="notif-empty">Loading…</div>}
        {!loading && items.length === 0 && (
          <div className="notif-empty">
            <span className="notif-empty-icon">🔔</span>
            <p>You're all caught up</p>
            <small>New badges, live rooms, and announcements will show up here.</small>
          </div>
        )}
        {!loading && items.map((n) => (
          <button
            key={n.id}
            type="button"
            className={`notif-item${n.read ? '' : ' notif-item--unread'}`}
            onClick={() => go(n)}
          >
            <span className="notif-icon" aria-hidden="true">{KIND_ICON[n.kind] || 'ℹ️'}</span>
            <span className="notif-body-col">
              <strong>{n.title}</strong>
              {n.body && <small>{n.body}</small>}
              <span className="notif-time">{timeAgo(n.ts)}</span>
            </span>
            {!n.read && <span className="notif-dot" aria-hidden="true" />}
          </button>
        ))}
      </div>
    </div>
  );
}

export default NotificationsPanel;
