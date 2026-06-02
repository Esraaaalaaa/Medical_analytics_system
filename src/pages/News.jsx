import { useState } from 'react'
import MainLayout from '../components/layout/MainLayout'
import PageHeader from '../components/ui/PageHeader'
import NewsArticleCard from '../components/ui/NewsArticleCard'
import NewsCategoryCard from '../components/ui/NewsCategoryCard'
import { FileText, Search, Star, Calendar, ArrowLeft, Mic, Award, Activity } from 'lucide-react'

const FEATURED = {
  badge: 'خبر رئيسي',
  category: 'توجيهات رئاسية',
  date: 'اليوم',
  title: 'الرئيس يوجه بزيادة مخصصات تطوير المستشفيات الجامعية لدعم منظومة الصحة',
}

const ARTICLES = [
  {
    id: 1,
    date: '2 نوفمبر 2025',
    title: 'انطلاق فعاليات المؤتمر السنوي للبحث العلمي الطبي',
    body: 'تبدأ غداً فعاليات المؤتمر السنوي الذي يجمع نخبة من الباحثين والأطباء من مختلف الجامعات المصرية لمناقشة أحدث المستجدات في البحث العلمي الطبي وتطبيقاته السريرية...',
  },
  {
    id: 2,
    date: '5 نوفمبر 2025',
    title: 'تكريم المستشفيات المتميزة في تطبيق منظومة التأمين الصحي الشامل',
    body: 'أعلن المجلس الأعلى للمستشفيات الجامعية عن قائمة المستشفيات المتميزة التي حققت أعلى معدلات الأداء في تقديم الخدمات ضمن منظومة التأمين الصحي الشامل...',
  },
  {
    id: 3,
    date: '10 نوفمبر 2025',
    title: 'توقيع بروتوكول تعاون مع هيئة الشراء الموحد',
    body: 'في إطار توجيهات القيادة السياسية بترشيد الإنفاق وتوحيد جهات التوريد، تم توقيع بروتوكول تعاون شامل بين المجلس الأعلى للمستشفيات الجامعية وهيئة الشراء الموحد...',
    accentColor: 'bg-emerald-400',
  },
  {
    id: 4,
    date: '12 نوفمبر 2025',
    title: 'افتتاح وحدة الرعاية المركزة الجديدة بمستشفيات جامعة المنصورة',
    body: 'شهد وزير التعليم العالي والبحث العلمي اليوم افتتاح وحدة الرعاية المركزة المطورة بمستشفيات جامعة المنصورة، والتي تضم 40 سريراً مجهزاً بأحدث التقنيات الطبية العالمية...',
  },
]

const CATEGORIES = [
  { id: 1, label: 'شراكات استراتيجية', icon: FileText, bg: 'bg-emerald-100', iconColor: 'text-emerald-400' },
  { id: 2, label: 'تطوير وإحلال',      icon: Activity, bg: 'bg-purple-100',  iconColor: 'text-purple-300' },
  { id: 3, label: 'مؤتمرات وفعاليات',  icon: Mic,      bg: 'bg-blue-100',    iconColor: 'text-blue-400'   },
  { id: 4, label: 'تكريم وجوائز',      icon: Award,    bg: 'bg-yellow-100',  iconColor: 'text-yellow-500' },
]

export default function News() {
  const [search, setSearch] = useState('')
  const visible = ARTICLES.filter(
    a => !search || a.title.includes(search) || a.body.includes(search)
  )

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
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-transparent to-transparent pointer-events-none" />
          <div className="relative">
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
            <h2 className="text-white font-bold text-[22px] leading-relaxed text-right mb-6">
              {FEATURED.title}
            </h2>
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

        {/* مؤتمرات وفعاليات + تكريم وجوائز — before their articles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          {CATEGORIES.slice(2).map(cat => (
            <NewsCategoryCard key={cat.id} {...cat} />
          ))}
        </div>

        {/* Article cards 1 & 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          {visible.slice(0, 2).map(article => (
            <NewsArticleCard key={article.id} {...article} />
          ))}
        </div>

        {/* شراكات استراتيجية + تطوير وإحلال — before their articles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          {CATEGORIES.slice(0, 2).map(cat => (
            <NewsCategoryCard key={cat.id} {...cat} />
          ))}
        </div>

        {/* Article cards 3 & 4 */}
        {visible.length > 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            {visible.slice(2).map(article => (
              <NewsArticleCard key={article.id} {...article} />
            ))}
          </div>
        )}

        {/* Load more button */}
        <div className="flex justify-center mt-2 mb-4">
          <button
            className="border-2 border-[#0d1526] text-[#0d1526] font-bold text-sm px-8 py-3
              rounded-xl hover:bg-[#0d1526] hover:text-white transition-all duration-150"
          >
            تحميل المزيد من الأخبار
          </button>
        </div>
      </div>
    </MainLayout>
  )
}
