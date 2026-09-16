import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const TIER_RANK = { guest: 0, free: 1, premium: 2 };

export function RequireTier({ tier, fallback, children }) {
  const { user, loading } = useAuth();
  if (loading) return null;

  const currentTier = user?.tier ?? 'guest';
  if (TIER_RANK[currentTier] < TIER_RANK[tier]) {
    return fallback ?? <UpsellNotice requiredTier={tier} />;
  }
  return children;
}

function UpsellNotice({ requiredTier }) {
  return (
    <div className="ec-card" style={{ textAlign: 'center', padding: '40px 24px', maxWidth: 500, margin: '0 auto' }}>
      <div style={{ fontSize: 48, marginBottom: 8 }}>🔒</div>
      <h3 style={{ marginBottom: 8 }}>This needs a {requiredTier} account</h3>
      <p style={{ color: 'var(--ec-ink-soft)', marginBottom: 20 }}>
        Upgrade to unlock the Speaking Test, AI scoring, and all other premium features.
      </p>
      <Link to="/pricing" className="ec-btn-dark">
        See plans
      </Link>
    </div>
  );
}