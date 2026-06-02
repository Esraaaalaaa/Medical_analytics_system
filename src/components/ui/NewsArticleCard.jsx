import { Calendar, Bookmark, Share2, ArrowLeft } from 'lucide-react'

/**
 * NewsArticleCard — article card with date, title, body, and footer actions.
 *
 * Props:
 *  date        — display date string (e.g. "5 نوفمبر 2025")
 *  title       — article headline
 *  body        — preview text (truncated via line-clamp)
 *  accentColor — optional Tailwind bg class for top accent bar (e.g. "bg-emerald-400")
 */
export default function NewsArticleCard({ date, title, body, accentColor }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {accentColor && <div className={`h-1 ${accentColor}`} />}

      <div className="p-5 flex-1 flex flex-col gap-2.5">
        {/* Date row */}
        <div className="flex items-center justify-between">
          <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
            <span>{date}</span>
            <Calendar className="w-3.5 h-3.5 shrink-0" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-[#0d1526] text-right leading-relaxed">
          {title}
        </h3>

        {/* Body */}
        <p className="text-xs text-slate-500 text-right leading-relaxed line-clamp-3 flex-1">
          {body}
        </p>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="text-slate-400 hover:text-slate-600 transition-colors">
            <Bookmark className="w-4 h-4" />
          </button>
          <button className="text-slate-400 hover:text-slate-600 transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
        <button className="flex items-center gap-1.5 text-[#0d1526] text-xs font-semibold hover:text-sky-600 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>قراءة المزيد</span>
        </button>
      </div>
    </div>
  )
}
