import { useCallback, useState } from 'react';

/**
 * Wraps an async admin mutation with loading/error state, an audit hint,
 * and a toast callback.
 *
 * const { run, loading, error } = useAdminMutation();
 * run(() => adminApi.deleteVocab(id), { audit: 'vocab.delete', label: 'Delete vocab' });
 */
export function useAdminMutation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = useCallback(async (fn, { audit, label } = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn();
      if (label) {
        window.dispatchEvent(
          new CustomEvent('admin:toast', {
            detail: { type: 'success', message: `${label} — done` },
          })
        );
      }
      if (audit) {
        // Backend logs the real audit entry on the matching endpoint.
        // This is a client-side hint only.
        try {
          const mod = await import('../api/admin');
          const api = mod.adminApi || mod.default;
          if (api?.auditHint) await api.auditHint(audit);
        } catch {
          /* ignore */
        }
      }
      return result;
    } catch (e) {
      const message =
        e?.response?.data?.error || e?.message || 'Request failed';
      setError(message);
      window.dispatchEvent(
        new CustomEvent('admin:toast', {
          detail: { type: 'error', message },
        })
      );
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { run, loading, error };
}

export default useAdminMutation;