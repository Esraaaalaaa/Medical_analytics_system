import { useState } from 'react'
import MainLayout from '../components/layout/MainLayout'
import PageHeader from '../components/ui/PageHeader'
import NewsArticleCard from '../components/ui/NewsArticleCard'
import NewsCategoryCard from '../components/ui/NewsCategoryCard'
import { getSession } from '../lib/authSession'
import { getRoleProfile } from '../lib/authRoles'
import {
  FileText,
  Search,
  Star,
  Calendar,
  ArrowLeft,
  Mic,
  Award,
  Activity,
} from 'lucide-react'

const FEATURED = {
  badge: 'خبر رئيسي',
  category: 'تطوير المنظومة الصحية',
  date: 'اليوم',
  title: 'تحديث خطة تطوير المستشفيات الجامعية ودعم جاهزية الأقسام الحرجة',
}

const ARTICLES = [
  {
    id: 1,
    date: '9 يونيو 2026',
    title: 'متابعة مؤشرات الأداء بالمستشفيات الجامعية خلال الربع الحالي',
    body: 'استعرض المجلس الأعلى للمستشفيات الجامعية أحدث مؤشرات الأداء التشغيلي والطبي، مع التركيز على رفع كفاءة استقبال الحالات وتقليل فترات الانتظار.',
  },
  {
    id: 2,
    date: '7 يونيو 2026',
    title: 'تحديث آليات متابعة قوائم الانتظار داخل المستشفيات الجامعية',
    body: 'تم التأكيد على أهمية تحديث بيانات قوائم الانتظار بصورة دورية لضمان دقة التقارير وسرعة اتخاذ القرار على مستوى الإدارات المختلفة.',
  },
  {
    id: 3,
    date: '5 يونيو 2026',
    title: 'توسيع التعاون مع هيئة الشراء الموحد لدعم احتياجات المستشفيات',
    body: 'ناقش ممثلو المستشفيات الجامعية آليات تحسين تدبير المستلزمات الطبية والأدوية الأساسية، بما يضمن استمرارية الخدمة داخل الأقسام الحيوية.',
    accentColor: 'bg-emerald-400',
  },
  {
    id: 4,
    date: '3 يونيو 2026',
    title: 'رفع جاهزية وحدات الرعاية المركزة والطوارئ',
    body: 'شددت المتابعة الدورية على ضرورة تحديث بيانات الأسرّة المتاحة وأجهزة الدعم الحيوي داخل وحدات الرعاية والطوارئ بشكل مستمر.',
  },
]

const CATEGORIES = [
  {
    id: 1,
    label: 'شراكات استراتيجية',
    icon: FileText,
    bg: 'bg-emerald-100',
    iconColor: 'text-emerald-500',
  },
  {
    id: 2,
    label: 'تطوير وتشغيل',
    icon: Activity,
    bg: 'bg-purple-100',
    iconColor: 'text-purple-500',
  },
  {
    id: 3,
    label: 'اجتماعات وفعاليات',
    icon: Mic,
    bg: 'bg-blue-100',
    iconColor: 'text-blue-500',
  },
  {
    id: 4,
    label: 'تكريم وتميز',
    icon: Award,
    bg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
  },
]

export default function News() {
  const [search, setSearch] = useState('')
  const session = getSession()
  const profile = getRoleProfile(session?.role)

  const visible = ARTICLES.filter(
    (article) =>
      !search ||
      article.title.includes(search) ||
      article.body.includes(search) ||
      article.date.includes(search),
  )

  return (
    <MainLayout userName={profile?.userName} userSub={profile?.userSub}>
      <div dir="rtl" className="px-4 py-6 md:px-8">
        <div className="mx-auto max-w-7xl">
          <PageHeader
            title="الأخبار والأحداث"
            subtitle="آخر الأخبار والتحديثات الخاصة بالمستشفيات الجامعية"
            icon={FileText}
            leftContent={
              <div className="relative w-full sm:w-64">
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="بحث في الأخبار..."
                  className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-4 pr-9 text-sm text-slate-700 transition-all placeholder:text-slate-400 focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  dir="rtl"
                />
              </div>
            }
          />

          <div className="relative mb-6 overflow-hidden rounded-3xl bg-slate-950 p-6 shadow-sm md:p-8">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-bl from-blue-900/40 via-transparent to-transparent" />
            <div className="pointer-events-none absolute -bottom-24 -left-20 h-60 w-60 rounded-full bg-sky-500/10 blur-3xl" />

            <div className="relative text-right">
              <div className="mb-4 flex flex-wrap items-center justify-end gap-3 text-xs font-bold text-white/60">
                <span className="flex items-center gap-1.5 rounded-full bg-red-500 px-3 py-1 text-xs font-black text-white">
                  {FEATURED.badge}
                  <Star className="h-3 w-3 fill-white" />
                </span>

                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 shrink-0" />
                  <span>{FEATURED.date}</span>
                  <span className="text-white/30">•</span>
                  <span>{FEATURED.category}</span>
                </div>
              </div>

              <h2 className="mb-6 max-w-4xl text-right text-2xl font-black leading-relaxed text-white md:text-3xl">
                {FEATURED.title}
              </h2>

              <div className="flex justify-end">
                <button className="flex items-center gap-2 rounded-2xl bg-white px-5 py-2.5 text-sm font-black text-slate-800 transition-all hover:bg-slate-100">
                  <span>اقرأ التفاصيل</span>
                  <ArrowLeft className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((cat) => (
              <NewsCategoryCard key={cat.id} {...cat} />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {visible.map((article) => (
              <NewsArticleCard key={article.id} {...article} />
            ))}
          </div>

          {visible.length === 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm font-bold text-slate-400">
              لا توجد أخبار مطابقة للبحث الحالي
            </div>
          )}

          <div className="mb-4 mt-6 flex justify-center">
            <button className="rounded-2xl border-2 border-slate-900 px-8 py-3 text-sm font-black text-slate-900 transition-all hover:bg-slate-900 hover:text-white">
              تحميل المزيد من الأخبار
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}