import { useState } from 'react'
import MainLayout from '../components/layout/MainLayout'
import PageHeader from '../components/ui/PageHeader'
import { FileText, Search, Star, Calendar, ArrowLeft, Activity } from 'lucide-react'

const FEATURED = {
  badge: 'خبر رئيسي',
  category: 'توجيهات رئاسية',
  date: 'اليوم',
  title: 'الرئيس يوجه بزيادة مخصصات تطوير المستشفيات الجامعية لدعم منظومة الصحة',
}

const NEWS_CARDS = [
  {
    id: 1,
    badge: 'شراكات استراتيجية',
    date: '12 نوفمبر 2025',
    bg: 'bg-emerald-100',
    iconColor: 'text-emerald-400',
    icon: FileText,
  },
  {
    id: 2,
    badge: 'تطوير وإحلال',
    date: '10 نوفمبر 2025',
    bg: 'bg-purple-100',
    iconColor: 'text-purple-300',
    icon: Activity,
  },
]

export default function News() {
  const [search, setSearch] = useState('')

  return (
    <MainLayout>
      <div dir="ltr" className="p-6">
        <PageHeader
          title="الأخبار والأحداث"
          subtitle="أحدث التطورات، الافتتاحات، والقرارات الخاصة بالمستشفيات الجامعية"
          icon={FileText}
          leftContent={
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="بحث في الأخبار..."
                className="pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[13.5px]
                  text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2
                  focus:ring-sky-200 focus:border-sky-300 w-56 transition-all"
                dir="rtl"
              />
            </div>
          }
        />

        {/* Featured news card */}
        <div className="bg-[#0d1526] rounded-2xl p-7 mb-5 relative overflow-hidden">
          {/* Subtle radial glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-transparent to-transparent pointer-events-none" />

          <div className="relative">
            {/* Badge + meta row */}
            <div className="flex items-center justify-end gap-3 mb-4 text-white/55 text-[12.5px]">
              <div className="flex items-center gap-1.5">
                <span>{FEATURED.category}</span>
                <span className="text-white/30">•</span>
                <span>{FEATURED.date}</span>
                <Calendar className="w-3.5 h-3.5 shrink-0" />
              </div>
              <span className="flex items-center gap-1.5 bg-red-500 text-white text-[11.5px]
                font-bold px-3 py-1 rounded-full">
                <Star className="w-3 h-3 fill-white" />
                {FEATURED.badge}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-white font-bold text-[22px] leading-relaxed text-right mb-6">
              {FEATURED.title}
            </h2>

            {/* CTA button */}
            <div className="flex justify-end">
              <button className="flex items-center gap-2 bg-white text-slate-800 font-semibold
                text-[13.5px] px-5 py-2.5 rounded-xl hover:bg-slate-100 active:bg-slate-200
                transition-all duration-150">
                <ArrowLeft className="w-4 h-4" />
                اقرأ التفاصيل
              </button>
            </div>
          </div>
        </div>

        {/* News grid */}
        <div className="grid grid-cols-2 gap-4">
          {NEWS_CARDS.map(card => {
            const Icon = card.icon
            return (
              <div key={card.id} className={`${card.bg} rounded-2xl overflow-hidden border border-white/60`}>
                {/* Badge */}
                <div className="flex justify-end p-3">
                  <span className="bg-white/80 text-slate-700 text-[12px] font-semibold
                    px-3 py-1 rounded-full border border-white/60">
                    {card.badge}
                  </span>
                </div>

                {/* Placeholder image area */}
                <div className="flex items-center justify-center py-10">
                  <Icon className={`w-12 h-12 ${card.iconColor} opacity-60`} strokeWidth={1} />
                </div>

                {/* Date footer */}
                <div className="px-4 pb-4 flex items-center justify-end gap-1.5
                  text-slate-500 text-[12.5px]">
                  <span>{card.date}</span>
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </MainLayout>
  )
}
