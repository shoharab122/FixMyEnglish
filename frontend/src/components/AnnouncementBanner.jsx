import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { normalizeAnnouncement } from '../api/normalizers';
import { useAuth } from '../context/AuthContext';

export function AnnouncementBanner() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [dismissed, setDismissed] = useState(() => {
    try { return JSON.parse(localStorage.getItem('dismissedAnnouncements') || '[]'); }
    catch { return []; }
  });

  useEffect(() => {
    api.get('/api/announcements')
      .then((r) => {
        const now = Date.now();
        const active = (Array.isArray(r.data) ? r.data : [])
          .map(normalizeAnnouncement)
          .filter((a) => {
            if (!a.active) return false;
            if (a.expiresAt && new Date(a.expiresAt).getTime() < now) return false;
            const tier = user?.tier ?? 'guest';
            return a.audienceTier === 'all' || a.audienceTier === tier;
          });
        setItems(active);
      })
      .catch(() => setItems([]));
  }, [user?.tier]);

  const dismiss = (id) => {
    const next = [...dismissed, id];
    setDismissed(next);
    try { localStorage.setItem('dismissedAnnouncements', JSON.stringify(next)); } catch {}
  };

  const visible = items.filter((a) => !dismissed.includes(a.id));
  if (!visible.length) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
      {visible.map((a) => (
        <div key={a.id} style={{
          background: '#D4F55C', border: '2px solid #17102E', borderRadius: 16,
          boxShadow: '0 4px 0 #17102E', padding: '12px 16px',
          display: 'flex', alignItems: 'flex-start', gap: 12,
          fontSize: 13.5, fontWeight: 700, color: '#17102E', lineHeight: 1.5,
        }}>
          <span style={{ fontSize: 18, lineHeight: 1 }}>📢</span>
          <div style={{ flex: 1 }}>
            <strong style={{ display: 'block', marginBottom: 2 }}>{a.title}</strong>
            <span style={{ fontWeight: 600 }}>{a.body}</span>
          </div>
          <button onClick={() => dismiss(a.id)} aria-label="Dismiss" style={{
            background: '#17102E', color: '#D4F55C', border: 'none',
            borderRadius: 999, width: 26, height: 26, cursor: 'pointer',
            fontWeight: 900, fontSize: 12, lineHeight: 1, flexShrink: 0,
          }}>✕</button>
        </div>
      ))}
    </div>
  );
}

export default AnnouncementBanner;
