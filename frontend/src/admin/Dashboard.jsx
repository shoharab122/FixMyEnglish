import { useEffect, useState } from 'react';
import { adminApi } from '../api/admin';

export function Dashboard() {
  const [data, setData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([adminApi.stats(), adminApi.analytics()])
      .then(([s, a]) => {
        setData(s);
        setAnalytics(a);
      })
      .catch((e) => setError(e.response?.data?.error || 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="ec-admin-loading">Loading dashboard…</div>;
  if (error) return <div className="ec-admin-empty">⚠️ {error}</div>;
  if (!data) return <div className="ec-admin-empty">No data available.</div>;

  return (
    <>
      <div className="ec-admin-page-head">
        <div>
          <h1 className="ec-admin-title">Dashboard</h1>
          <p className="ec-admin-sub">Live overview of users, content, and revenue</p>
        </div>
      </div>

      <div className="ec-admin-stats">
        <div className="ec-admin-stat">
          <div className="ec-admin-stat-icon ec-admin-stat-icon--lime">👥</div>
          <div className="ec-admin-stat-label">Total Users</div>
          <div className="ec-admin-stat-value">{data.users?.total ?? 0}</div>
          <div className="ec-admin-stat-sub">
            {data.users?.premium ?? 0} premium · {data.users?.guest ?? 0} guests
          </div>
        </div>
        <div className="ec-admin-stat">
          <div className="ec-admin-stat-icon ec-admin-stat-icon--yellow">💰</div>
          <div className="ec-admin-stat-label">Revenue</div>
          <div className="ec-admin-stat-value">
            ৳{(data.payments?.revenueBdt ?? 0).toLocaleString()}
          </div>
          <div className="ec-admin-stat-sub">
            {data.payments?.paidPurchases ?? 0} paid purchases
          </div>
        </div>
        <div className="ec-admin-stat">
          <div className="ec-admin-stat-icon ec-admin-stat-icon--purple">📚</div>
          <div className="ec-admin-stat-label">Content</div>
          <div className="ec-admin-stat-value">
            {(data.content?.vocab ?? 0) + (data.content?.grammarQuestions ?? 0)}
          </div>
          <div className="ec-admin-stat-sub">
            {data.content?.vocab ?? 0} vocab · {data.content?.grammarQuestions ?? 0} grammar Q
          </div>
        </div>
        <div className="ec-admin-stat">
          <div className="ec-admin-stat-icon ec-admin-stat-icon--pink">🔥</div>
          <div className="ec-admin-stat-label">Active Today</div>
          <div className="ec-admin-stat-value">{data.users?.activeToday ?? 0}</div>
          <div className="ec-admin-stat-sub">{data.xpToday ?? 0} XP earned today</div>
        </div>
      </div>

      {analytics?.series?.length > 0 && (
        <div className="ec-admin-card">
          <h2>14-day activity</h2>
          <MiniChart series={analytics.series} />
        </div>
      )}

      <div className="ec-admin-card">
        <h2>Recent users</h2>
        <div className="ec-admin-table-wrap">
          <table className="ec-admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Tier</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {(data.recentUsers || []).map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email || '—'}</td>
                  <td>
                    <span className={`ec-admin-badge ec-admin-badge--${u.tier || 'guest'}`}>
                      {u.tier || 'guest'}
                    </span>
                  </td>
                  <td>
                    <span className={`ec-admin-badge ec-admin-badge--${u.role || 'user'}`}>
                      {u.role || 'user'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="ec-admin-card">
        <h2>Recent purchases</h2>
        {(data.recentPurchases || []).length === 0 ? (
          <div className="ec-admin-empty">No purchases yet</div>
        ) : (
          <div className="ec-admin-table-wrap">
            <table className="ec-admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Product</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentPurchases.map((p) => (
                  <tr key={p.id}>
                    <td>
                      {p.user?.name}
                      <br />
                      <span style={{ fontSize: 11, color: '#888' }}>
                        {p.user?.email}
                      </span>
                    </td>
                    <td>{p.product?.name || '—'}</td>
                    <td>৳{p.amountBdt}</td>
                    <td>{p.method}</td>
                    <td>
                      <span className={`ec-admin-badge ec-admin-badge--${p.status}`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

function MiniChart({ series }) {
  const maxXp = Math.max(1, ...series.map((d) => d.xp));
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 6,
        height: 120,
        padding: '8px 0',
      }}
    >
      {series.map((d) => {
        const h = Math.max(4, Math.round((d.xp / maxXp) * 100));
        return (
          <div
            key={d.date}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
            }}
            title={`${d.date}: ${d.xp} XP`}
          >
            <div
              style={{
                width: '100%',
                height: `${h}%`,
                background: 'linear-gradient(180deg, #9B7BFF, #7B5CF0)',
                borderRadius: '10px 10px 4px 4px',
                border: '2px solid #17102E',
                borderBottomWidth: 3,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

export default Dashboard;