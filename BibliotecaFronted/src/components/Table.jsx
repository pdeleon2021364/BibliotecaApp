export default function Table({ columns, data }) {
  return (
    <div className="overflow-x-auto rounded-xl border-wood shadow-warm-sm">
      <table className="w-full">
        <thead>
          <tr className="bg-madera-800 text-pergamino-100">
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={row._id || row.id}
              className={`border-b border-madera-200 transition-colors hover:bg-madera-100/50 ${
                index % 2 === 0 ? "bg-pergamino-50" : "bg-pergamino-100"
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
