export function AdminTable({ columns, rows, loading, empty = 'No data', renderRow }) {
  if (loading) return <div className="ec-admin-loading">Loading…</div>;
  if (!rows || rows.length === 0) return <div className="ec-admin-empty">{empty}</div>;
  return (
    <div className="ec-admin-table-wrap">
      <table className="ec-admin-table">
        <thead>
          <tr>
            {columns.map((c) => <th key={c.key}>{c.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => renderRow ? renderRow(r) : (
            <tr key={r.id}>
              {columns.map((c) => <td key={c.key}>{c.render ? c.render(r) : r[c.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
