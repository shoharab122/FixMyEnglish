export function Field({ label, error, hint, children }) {
  return (
    <div className="ec-admin-form-row">
      {label && <label className="ec-admin-form-label">{label}</label>}
      {children}
      {hint && !error && <div className="ec-admin-form-hint">{hint}</div>}
      {error && <div className="ec-admin-form-error" role="alert">⚠️ {error}</div>}
    </div>
  );
}

export function TextInput({ value, onChange, ...rest }) {
  return (
    <input
      className="ec-admin-input"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      {...rest}
    />
  );
}

export function NumInput({ value, onChange, ...rest }) {
  return (
    <input
      type="number"
      className="ec-admin-input"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      {...rest}
    />
  );
}

export function Select({ value, onChange, options, ...rest }) {
  return (
    <select
      className="ec-admin-select"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      {...rest}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

export function TextArea({ value, onChange, ...rest }) {
  return (
    <textarea
      className="ec-admin-textarea"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      {...rest}
    />
  );
}