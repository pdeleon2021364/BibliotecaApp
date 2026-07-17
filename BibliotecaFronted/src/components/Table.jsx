export default function Table({ columns, data }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-madera-200 shadow-warm-sm">
      <table className="w-full">
        <thead>
          <tr className="bg-madera-800 text-white">
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={row.id}
              className={`border-b border-madera-100 transition-colors hover:bg-madera-100/60 ${
                index % 2 === 0 ? "bg-white" : "bg-madera-100/30"
              }`}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-sm text-madera-700">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
