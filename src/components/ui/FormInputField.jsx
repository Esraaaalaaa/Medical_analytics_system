import { Star, DollarSign } from 'lucide-react'

/**
 * FormInputField — labeled number input for data-entry forms.
 *
 * Props:
 *  label        — Arabic field label
 *  value        — controlled string value
 *  onChange(v)  — called with raw string from input
 *  special      — marks as starred/red (e.g. تأمين صحي شامل)
 *  showCurrency — shows EGP badge + $ icon (for debt fields)
 *  placeholder  — default "0.00"
 */
export default function FormInputField({
  label,
  value,
  onChange,
  special = false,
  showCurrency = false,
  placeholder = '0.00',
}) {
  const inputBase =
    'w-full py-2 px-3 border text-right text-sm font-semibold bg-white focus:outline-none focus:ring-2 transition-all rounded-lg'

  const inputVariant = special
    ? 'border-red-200 text-red-700 focus:ring-red-300 focus:border-red-400 bg-red-50/40'
    : 'border-slate-200 text-slate-800 focus:ring-sky-300 focus:border-sky-400'

  return (
    <div className={`rounded-xl p-3 transition-colors ${special ? 'bg-red-50/50 border border-red-100' : 'bg-white border border-slate-100'}`}>
      {/* Label row */}
      <div className="flex items-center justify-end gap-1.5 mb-2">
        {special && <Star className="w-3.5 h-3.5 text-red-400 fill-red-400" />}
        <label className={`text-sm font-semibold leading-none ${special ? 'text-red-600' : 'text-slate-700'}`}>
          {label}
        </label>
      </div>

      {/* Input row */}
      {showCurrency ? (
        <div className="flex items-center gap-1.5">
          {/* $ icon — visual LEFT in RTL (DOM first, but using flex-row-reverse isn't needed since we control order) */}
          <div className="w-7 h-8 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-lg shrink-0">
            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            step="0.01"
            min="0"
            className={`${inputBase} ${inputVariant} flex-1`}
          />
          {/* EGP badge — visual RIGHT in RTL */}
          <span className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 shrink-0">
            EGP
          </span>
        </div>
      ) : (
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          step="0.01"
          min="0"
          className={`${inputBase} ${inputVariant}`}
        />
      )}
    </div>
  )
}
