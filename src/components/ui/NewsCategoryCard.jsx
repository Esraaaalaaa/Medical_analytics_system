/**
 * NewsCategoryCard — colored category card with badge label and centered icon.
 *
 * Props:
 *  label      — category name (e.g. "مؤتمرات وفعاليات")
 *  icon       — lucide-react icon component
 *  bg         — Tailwind bg class (e.g. "bg-blue-100")
 *  iconColor  — Tailwind text class for icon (e.g. "text-blue-400")
 */
export default function NewsCategoryCard({ label, icon: Icon, bg, iconColor }) {
  return (
    <div className={`${bg} rounded-2xl overflow-hidden border border-white/60 cursor-pointer hover:brightness-95 transition-all`}>
      <div className="flex justify-end p-4">
        <span className="bg-white text-slate-700 text-xs font-bold px-4 py-2 rounded-lg shadow-sm">
          {label}
        </span>
      </div>

      <div className="flex items-center justify-center py-12">
        <Icon className={`w-14 h-14 ${iconColor} opacity-50`} strokeWidth={1} />
      </div>
    </div>
  )
}
