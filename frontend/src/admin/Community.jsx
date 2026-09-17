import { useEffect, useState } from 'react';
import { adminApi } from '../api/admin';
import { AdminTable } from './AdminTable';

export function Community() {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = () => {
    setLoading(true);
    adminApi.threads().then(setThreads).catch(() => setThreads([])).finally(() => setLoading(false));
  };
  useEffect(() => { reload(); }, []);

  const hide = async (id) => {
    await adminApi.updateThread(id, { status: 'hidden' });
    reload();
  };
  const unhide = async (id) => {
    await adminApi.updateThread(id, { status: 'open' });
    reload();
  };
  const remove = async (id) => {
    if (!confirm('Delete this thread and all its replies?')) return;
    await adminApi.deleteThread(id); reload();
  };

  return (
    <>
      <div className="ec-admin-page-head">
        <div>
          <h1 className="ec-admin-title">Community</h1>
          <p className="ec-admin-sub">{threads.length} threads · moderate peer-help posts</p>
        </div>
      </div>

      <div className="ec-admin-card">
        <AdminTable
          loading={loading}
          rows={threads}
          empty="No threads yet"
          columns={[
            { key: 'title', label: 'Title' },
            { key: 'author', label: 'Author', render: (t) => <>{t.author}<br /><span style={{ fontSize: 11, color: '#888' }}>{t.email}</span></> },
            { key: 'replies', label: 'Replies' },
            { key: 'status', label: 'Status', render: (t) => <span className={`ec-admin-badge ec-admin-badge--${t.status}`}>{t.status}</span> },
            {
              key: 'actions', label: '', render: (t) => (
                <span style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {t.status !== 'hidden'
                    ? <button className="ec-admin-btn ec-admin-btn--sm" onClick={() => hide(t.id)}>Hide</button>
                    : <button className="ec-admin-btn ec-admin-btn--lime ec-admin-btn--sm" onClick={() => unhide(t.id)}>Unhide</button>}
                  <button className="ec-admin-btn ec-admin-btn--danger ec-admin-btn--sm" onClick={() => remove(t.id)}>Delete</button>
                </span>
              ),
            },
          ]}
        />
      </div>
    </>
  );
}
