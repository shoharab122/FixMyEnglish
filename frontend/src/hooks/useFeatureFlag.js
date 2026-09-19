import { useEffect, useState } from 'react';
import { adminApi } from '../api/admin';
import { normalizeFlag } from '../api/normalizers';
import { useAuth } from '../context/AuthContext';

let cache = { at: 0, flags: null };
const CACHE_MS = 60_000;

async function loadFlags() {
  if (Date.now() - cache.at < CACHE_MS && cache.flags) return cache.flags;
  try {
    const raw = await adminApi.featureFlags();
    const flags = (Array.isArray(raw) ? raw : []).map(normalizeFlag);
    cache = { at: Date.now(), flags };
    return flags;
  } catch { return []; }
}

export function useFeatureFlag(key) {
  const { user } = useAuth();
  const [on, setOn] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const flags = await loadFlags();
      if (cancelled) return;
      const flag = flags.find((f) => f.key === key);
      if (!flag || !flag.enabled) { setOn(false); return; }
      const tier = user?.tier ?? 'guest';
      const scope = flag.tierScope;
      setOn(scope === 'all' || scope === tier);
    })();
    return () => { cancelled = true; };
  }, [key, user?.tier]);

  return on;
}

export function invalidateFeatureFlagCache() {
  cache = { at: 0, flags: null };
}
