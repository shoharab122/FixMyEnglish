import { useEffect, useState } from 'react';
import { adminApi } from '../api/admin';
import { AdminTable } from './AdminTable';
import { AdminModal } from './AdminModal';
import { useAdminMutation } from './useAdminMutation';

export function Community() {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const { run, loading: mutating } = useAdminMutation();

  const reload = () => {
    setLoading(true);
    adminApi
      .threads()
      .then((r) => setThreads(Array.isArray(r) ? r : []))
      .catch(() => setThreads([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    reload();
  }, []);

  const hide = (id) => {
    run(() => adminApi.updateThread(id, { status: 'hidden' }), {
      audit: 'thread.hide',
      label: 'Thread hidden',
    })
      .then(reload)
      .catch(() => reload());
  };

  const unhide = (id) => {
    run(() => adminApi.updateThread(id, { status: 'open' }), {
      audit: 'thread.unhide',
      label: 'Thread restored',
    })
      .then(reload)
      .catch(() => reload());
  };

  const doDelete = () => {
    const target = confirmDelete;
    if (!target) return;
    setConfirmDelete(null);
    run(() => adminApi.deleteThread(target.id), {
      audit: 'thread.delete',
      label: 'Thread deleted',
    })
      .then(reload)
      .catch(() => reload());
  };

  return (
    <>
      <div className="ec-admin-page-head">
        <div>
          <h1 className="ec-admin-title">Community</h1>
          <p className="ec-admin-sub">
            {threads.length} threads · moderate peer-help posts
          </p>
        </div>
      </div>

      <div className="ec-admin-card">
        <AdminTable
          loading={loading}
          rows={threads}
          empty="No threads yet"
          columns={[
            { key: 'title', label: 'Title' },
            {
              key: 'author',
              label: 'Author',
              render: (t) => (
                <>
                  {t.author}
                  <br />
                  <span className="ec-admin-muted" style={{ fontSize: 11 }}>
                    {t.email}
                  </span>
                </>
              ),
            },
            { key: 'replies', label: 'Replies', render: (t) => t.replies ?? 0 },
            {
              key: 'status',
              label: 'Status',
              render: (t) => {
                const safe = ['open', 'hidden', 'answered'].includes(t.status)
                  ? t.status
                  : 'hidden';
                return (
                  <span className={`ec-admin-badge ec-admin-badge--${safe}`}>
                    {t.status}
                  </span>
                );
              },
            },
            {
              key: 'actions',
              label: '',
              render: (t) => (
                <span style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {t.status !== 'hidden' ? (
                    <button
                      className="ec-admin-btn ec-admin-btn--sm"
                      disabled={mutating}
                      onClick={() => hide(t.id)}
                    >
                      Hide
                    </button>
                  ) : (
                    <button
                      className="ec-admin-btn ec-admin-btn--lime ec-admin-btn--sm"
                      disabled={mutating}
                      onClick={() => unhide(t.id)}
                    >
                      Unhide
                    </button>
                  )}
                  <button
                    className="ec-admin-btn ec-admin-btn--danger ec-admin-btn--sm"
                    onClick={() => setConfirmDelete(t)}
                  >
                    Delete
                  </button>
                </span>
              ),
            },
          ]}
        />
      </div>

      {confirmDelete && (
        <AdminModal
          title="Delete thread?"
          onClose={() => setConfirmDelete(null)}
          actions={
            <>
              <button
                className="ec-admin-btn ec-admin-btn--ghost"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
              <button
                className="ec-admin-btn ec-admin-btn--danger"
                onClick={doDelete}
              >
                Delete
              </button>
            </>
          }
        >
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>
            Delete <strong>{confirmDelete.title}</strong> and all its replies?
          </p>
        </AdminModal>
      )}
    </>
  );
}