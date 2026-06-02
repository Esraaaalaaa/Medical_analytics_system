import { ChevronLeft, ChevronRight } from 'lucide-react'

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
export default function DataTable({ columns = [], groups = [], data = [], onRowClick, rtl = false }) {
  const borderSide = rtl ? 'border-r' : 'border-l'
  const ChevronIcon = rtl ? ChevronRight : ChevronLeft
  const hasGroups = groups.length > 0
  const ungrouped = columns.filter(c => !c.group)
  const grouped   = columns.filter(c => c.group)

  const renderCell = (col, row) => {
    const raw = row[col.key]
    const isEmpty = raw === '—' || raw === null || raw === undefined || raw === ''

    if (isEmpty) {
      return <span className="text-slate-300 select-none">—</span>
    }

    let cls = 'text-slate-700'
    if (col.group === 'debt') {
      cls = col.highlight ? 'text-red-600 font-bold' : 'text-red-500'
    } else if (col.group === 'recv') {
      cls = col.highlight ? 'text-emerald-600 font-bold' : 'text-emerald-500'
    }

    return <span className={cls}>{raw}</span>
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
      <table className="w-full text-sm border-collapse">
        <thead>
          {/* Row 1: ungrouped (rowSpan=2) + group headers */}
          <tr className="bg-slate-50 border-b border-slate-200">
            {ungrouped.map(col => (
              <th
                key={col.key}
                rowSpan={hasGroups ? 2 : 1}
                className={`px-4 py-3 font-semibold text-slate-600 ${borderSide} border-slate-200 last:border-0 align-middle ${col.className || 'text-center'}`}
              >
                {col.header}
              </th>
            ))}
            {hasGroups && groups.map(group => (
              <th
                key={group.id}
                colSpan={columns.filter(c => c.group === group.id).length}
                className={`px-4 py-2.5 text-center text-[13px] font-bold ${borderSide} border-slate-200 ${group.colorClass || 'text-slate-600'} ${group.bgClass || ''}`}
              >
                {group.label}
              </th>
            ))}
          </tr>

          {/* Row 2: grouped sub-headers */}
          {hasGroups && (
            <tr className="border-b-2 border-slate-200">
              {grouped.map(col => (
                <th
                  key={col.key}
                  className={`px-4 py-2 text-center text-[12px] font-semibold text-slate-500 ${borderSide} border-slate-100 ${
                    col.group === 'debt' ? 'bg-red-50/60' : 'bg-emerald-50/60'
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          )}
        </thead>

        <tbody>
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
                  className={`px-4 py-3.5 ${borderSide} border-slate-100 last:border-0 ${col.className || 'text-center'}`}
                >
                  {renderCell(col, row)}
                </td>
              ))}
              {onRowClick && (
                <td className="w-8 pl-2 pr-3 text-slate-300 group-hover:text-sky-500 transition-colors">
                  <ChevronIcon className="w-4 h-4" />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
