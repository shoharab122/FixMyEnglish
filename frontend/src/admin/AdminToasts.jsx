import { useEffect, useState } from 'react';

let seq = 0;

export function AdminToasts() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const onToast = (e) => {
      const id = ++seq;
      const { type = 'info', message = '' } = e.detail || {};
      setItems((prev) => [...prev, { id, type, message }]);
      setTimeout(
        () => setItems((prev) => prev.filter((t) => t.id !== id)),
        3000
      );
    };
    window.addEventListener('admin:toast', onToast);
    return () => window.removeEventListener('admin:toast', onToast);
  }, []);

  if (!items.length) return null;

  return (
    <div className="ec-admin-toasts" role="status" aria-live="polite">
      {items.map((t) => (
        <div key={t.id} className={`ec-admin-toast ec-admin-toast--${t.type}`}>
          <span aria-hidden="true">
            {t.type === 'error' ? '⚠️' : t.type === 'success' ? '✅' : 'ℹ️'}
          </span>{' '}
          {t.message}
        </div>
      ))}
    </div>
  );
}

export default AdminToasts;
