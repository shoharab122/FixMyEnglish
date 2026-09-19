import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CloseIcon } from './icons';

export function AdminModal({
  title,
  onClose,
  children,
  actions,
  disableBackdropClose = false,
}) {
  const cardRef = useRef(null);
  const onCloseRef = useRef(onClose);

  // Keep latest onClose without re-running the effect
  onCloseRef.current = onClose;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const card = cardRef.current;

    // Focus the FIRST INPUT inside the modal (not the close button),
    // and only on mount. If nothing is focusable, focus the card itself.
    if (card && !card.contains(document.activeElement)) {
      const firstInput = card.querySelector(
        'input:not([type="hidden"]), textarea, select'
      );
      if (firstInput && typeof firstInput.focus === 'function') {
        firstInput.focus();
      } else {
        card.setAttribute('tabindex', '-1');
        card.focus();
      }
    }

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current?.();
        return;
      }
      if (e.key !== 'Tab') return;

      // Recompute the focusable list on every Tab press so it stays fresh
      const card2 = cardRef.current;
      if (!card2) return;
      const focusable = card2.querySelectorAll(
        'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run ONCE on mount — this is the bug fix

  const handleBackdrop = (e) => {
    if (disableBackdropClose) return;
    if (e.target === e.currentTarget) onCloseRef.current?.();
  };

  return createPortal(
    <div className="ec-admin-modal" onMouseDown={handleBackdrop}>
      <div
        className="ec-admin-modal-card"
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="ec-admin-modal-head">
          <h3>{title}</h3>
          <button
            type="button"
            onClick={() => onCloseRef.current?.()}
            aria-label="Close dialog"
            className="ec-admin-modal-close"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="ec-admin-modal-body">{children}</div>
        {actions && <div className="ec-admin-modal-actions">{actions}</div>}
      </div>
    </div>,
    document.body
  );
}

export default AdminModal;
