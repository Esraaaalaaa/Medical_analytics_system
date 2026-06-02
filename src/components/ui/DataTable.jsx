import { ChevronLeft } from 'lucide-react'

/**
 * DataTable — generic table with optional two-level grouped headers.
 *
 * columns: [{ key, header, group?, highlight?, className? }]
 *   - columns without `group` span both header rows (rowSpan=2)
 *   - columns with `group` appear in the second header row
 *
 * groups: [{ id, label, colorClass, bgClass }]
 *   - each group renders a colSpan header in the first row
 *
 * data: array of row objects keyed by column.key
 * onRowClick(row): optional, makes rows clickable
 */
export default function DataTable({ columns = [], groups = [], data = [], onRowClick, noTopRadius = false, dir = 'rtl', bodyDir }) {
  const hasGroups = groups.length > 0
  const ungrouped = columns.filter(c => !c.group)
  const grouped   = columns.filter(c => c.group)
  
  // If bodyDir is not specified, use same as table dir
  const actualBodyDir = bodyDir || dir

  const renderCell = (col, row) => {
    const raw = row[col.key]
    const isEmpty = raw === '—' || raw === null || raw === undefined || raw === '' || raw === 0

    if (isEmpty) {
      return <span className="text-slate-400 select-none text-sm">0</span>
    }

    // Format numbers with commas
    const formatted = typeof raw === 'number' ? raw.toLocaleString() : raw

    let cls = 'text-slate-800 font-medium'
    if (col.group === 'debt') {
      cls = col.highlight ? 'text-red-600 font-bold' : 'text-red-600 font-medium'
    } else if (col.group === 'recv') {
      cls = col.highlight ? 'text-emerald-600 font-bold' : 'text-emerald-600 font-medium'
    } else if (col.group === 'emergency') {
      cls = 'text-slate-800 font-medium'
    } else if (col.group === 'inpatient') {
      cls = 'text-slate-800 font-medium'
    } else if (col.group === 'outpatient') {
      cls = 'text-slate-800 font-medium'
    }

    return <span className={cls}>{formatted}</span>
  }

  return (
    <div className={`overflow-x-auto border border-slate-200 shadow-sm bg-white ${noTopRadius ? 'rounded-b-xl' : 'rounded-xl'}`}>
      <table className="w-full text-sm border-collapse" dir={dir}>
        <thead>
          {/* Row 1: ungrouped (rowSpan=2) + group headers */}
          <tr className="bg-slate-100 border-b border-slate-200">
            {ungrouped.map(col => (
              <th
                key={col.key}
                rowSpan={hasGroups ? 2 : 1}
                className={`px-4 py-3.5 font-bold text-slate-700 border-l border-slate-200 last:border-l-0 align-middle text-sm ${col.className || 'text-center'}`}
              >
                {col.header}
              </th>
            ))}
            {hasGroups && groups.map(group => (
              <th
                key={group.id}
                colSpan={columns.filter(c => c.group === group.id).length}
                className={`px-4 py-3 text-center text-sm font-bold border-l border-slate-200 ${group.colorClass || 'text-slate-700'} ${group.bgClass || 'bg-slate-50'}`}
              >
                {group.label}
              </th>
            ))}
          </tr>

          {/* Row 2: grouped sub-headers */}
          {hasGroups && (
            <tr className="bg-white border-b-2 border-slate-200">
              {grouped.map(col => {
                let bgColor = 'bg-slate-50'
                if (col.group === 'debt') bgColor = 'bg-red-50/60'
                else if (col.group === 'recv') bgColor = 'bg-emerald-50/60'
                else if (col.group === 'emergency') bgColor = 'bg-red-50/60'
                else if (col.group === 'inpatient') bgColor = 'bg-blue-50/60'
                else if (col.group === 'outpatient') bgColor = 'bg-slate-50'

                return (
                  <th
                    key={col.key}
                    className={`px-4 py-2.5 text-center text-xs font-semibold text-slate-700 border-l border-slate-100 ${bgColor}`}
                  >
                    {col.header}
                  </th>
                )
              })}
            </tr>
          )}
        </thead>

        <tbody dir={actualBodyDir}>
          {data.map((row, i) => (
            <tr
              key={row.id ?? i}
              onClick={() => onRowClick?.(row)}
              className={`border-b border-slate-100 last:border-b-0 transition-colors ${
                i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
              } ${onRowClick ? 'cursor-pointer hover:bg-sky-50 group' : ''}`}
            >
              {columns.map(col => (
                <td
                  key={col.key}
                  className={`px-4 py-3.5 border-l border-slate-100 last:border-l-0 ${col.className || 'text-center'}`}
                >
                  {renderCell(col, row)}
                </td>
              ))}
              {onRowClick && (
                <td className="w-8 pl-2 pr-3 text-slate-300 group-hover:text-sky-500 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
