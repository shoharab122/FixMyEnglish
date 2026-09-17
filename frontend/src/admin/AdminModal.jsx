import { CloseIcon } from './icons';

export function AdminModal({ title, onClose, children, actions }) {
  return (
    <div className="ec-admin-modal" onClick={onClose}>
      <div className="ec-admin-modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{ width: 36, height: 36, borderRadius: 12, border: '2px solid var(--a-line)', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <CloseIcon />
          </button>
        </div>
        <div style={{ marginTop: 20 }}>{children}</div>
        {actions && <div className="ec-admin-modal-actions">{actions}</div>}
      </div>
    </div>
  );
}
