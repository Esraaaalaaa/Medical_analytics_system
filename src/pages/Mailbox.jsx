import { useMemo, useState } from 'react'
import MainLayout from '../components/layout/MainLayout'
import PageHeader from '../components/ui/PageHeader'
import { getSession } from '../lib/authSession'
import { getRoleProfile } from '../lib/authRoles'
import {
  Mail,
  Search,
  Send,
  Archive,
  Inbox,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Paperclip,
  Reply,
} from 'lucide-react'

const INITIAL_MESSAGES = [
  {
    id: 1,
    folder: 'inbox',
    sender: 'أمانة المجلس الأعلى للمستشفيات الجامعية',
    subject: 'تحديث بيانات المؤشرات الطبية لشهر يونيو',
    body:
      'يرجى مراجعة بيانات المؤشرات الطبية الخاصة بالمستشفى والتأكد من اكتمال البيانات قبل نهاية الأسبوع الجاري.',
    date: '10 يونيو 2026',
    time: '10:30 ص',
    priority: 'high',
    read: false,
    hasAttachment: true,
  },
  {
    id: 2,
    folder: 'inbox',
    sender: 'الإدارة المالية',
    subject: 'مراجعة المستحقات والمديونيات',
    body:
      'برجاء مراجعة بنود المستحقات والمديونيات وإرسال أي ملاحظات قبل اعتماد الملخص المالي النهائي.',
    date: '9 يونيو 2026',
    time: '2:15 م',
    priority: 'normal',
    read: true,
    hasAttachment: false,
  },
  {
    id: 3,
    folder: 'inbox',
    sender: 'وحدة المتابعة',
    subject: 'اجتماع متابعة الأداء الأسبوعي',
    body:
      'تم تحديد اجتماع متابعة الأداء الأسبوعي لمناقشة مؤشرات التشغيل والالتزام بإرسال التقارير في المواعيد المحددة.',
    date: '8 يونيو 2026',
    time: '12:00 م',
    priority: 'normal',
    read: true,
    hasAttachment: false,
  },
  {
    id: 4,
    folder: 'sent',
    sender: 'أنت',
    subject: 'رد: مراجعة المستحقات والمديونيات',
    body:
      'تمت مراجعة البيانات المالية، وسيتم إرسال النسخة النهائية بعد استكمال التوقيعات المطلوبة.',
    date: '7 يونيو 2026',
    time: '4:40 م',
    priority: 'normal',
    read: true,
    hasAttachment: false,
  },
  {
    id: 5,
    folder: 'archive',
    sender: 'إدارة النظم',
    subject: 'تحديث صلاحيات المستخدمين',
    body:
      'تم تحديث صلاحيات المستخدمين وفقاً للهيكل المعتمد، ويمكنكم استخدام النظام بصورة طبيعية.',
    date: '5 يونيو 2026',
    time: '9:10 ص',
    priority: 'low',
    read: true,
    hasAttachment: false,
  },
]

const FOLDERS = [
  {
    id: 'inbox',
    label: 'الوارد',
    icon: Inbox,
  },
  {
    id: 'sent',
    label: 'المرسل',
    icon: Send,
  },
  {
    id: 'archive',
    label: 'الأرشيف',
    icon: Archive,
  },
]

const PRIORITY_META = {
  high: {
    label: 'هام',
    className: 'border-red-200 bg-red-50 text-red-600',
    icon: AlertTriangle,
  },
  normal: {
    label: 'عادي',
    className: 'border-sky-200 bg-sky-50 text-sky-700',
    icon: Clock,
  },
  low: {
    label: 'للمتابعة',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    icon: CheckCircle2,
  },
}

function PriorityBadge({ priority }) {
  const meta = PRIORITY_META[priority] ?? PRIORITY_META.normal
  const Icon = meta.icon

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-black ${meta.className}`}
    >
      <span>{meta.label}</span>
      <Icon className="h-3.5 w-3.5" />
    </span>
  )
}

function MessageListItem({ message, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`block w-full border-b border-slate-100 p-4 text-right transition-colors hover:bg-slate-50 ${
        selected ? 'bg-sky-50' : 'bg-white'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 text-right">
          <div className="mb-1 flex items-center justify-start gap-2">
            {!message.read && (
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-sky-500" />
            )}

            <p className="min-w-0 truncate text-sm font-black text-slate-900">
              {message.sender}
            </p>
          </div>

          <p className="truncate text-sm font-bold text-slate-700">
            {message.subject}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 pt-0.5">
          {message.hasAttachment && (
            <Paperclip className="h-4 w-4 text-slate-400" />
          )}
        </div>
      </div>

      <p className="mt-2 line-clamp-2 text-right text-xs font-medium leading-6 text-slate-500">
        {message.body}
      </p>

      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-slate-400">
          {message.date} - {message.time}
        </span>

        <PriorityBadge priority={message.priority} />
      </div>
    </button>
  )
}

export default function Mailbox() {
  const session = getSession()
  const profile = getRoleProfile(session?.role)

  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [folder, setFolder] = useState('inbox')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(1)
  const [replyText, setReplyText] = useState('')
  const [toast, setToast] = useState('')

  const filteredMessages = useMemo(() => {
    return messages.filter((message) => {
      const matchesFolder = message.folder === folder
      const matchesSearch =
        !search ||
        message.sender.includes(search) ||
        message.subject.includes(search) ||
        message.body.includes(search)

      return matchesFolder && matchesSearch
    })
  }, [messages, folder, search])

  const selectedMessage = useMemo(() => {
    return (
      messages.find((message) => message.id === selectedId) ||
      filteredMessages[0] ||
      null
    )
  }, [messages, selectedId, filteredMessages])

  const folderCounts = useMemo(() => {
    return FOLDERS.reduce((acc, item) => {
      acc[item.id] = messages.filter((message) => message.folder === item.id).length
      return acc
    }, {})
  }, [messages])

  const unreadCount = messages.filter(
    (message) => message.folder === 'inbox' && !message.read,
  ).length

  const handleSelectMessage = (message) => {
    setSelectedId(message.id)
    setReplyText('')
    setToast('')

    if (!message.read) {
      setMessages((prev) =>
        prev.map((item) =>
          item.id === message.id ? { ...item, read: true } : item,
        ),
      )
    }
  }

  const handleArchive = () => {
    if (!selectedMessage || selectedMessage.folder === 'archive') return

    setMessages((prev) =>
      prev.map((message) =>
        message.id === selectedMessage.id
          ? { ...message, folder: 'archive', read: true }
          : message,
      ),
    )

    setFolder('archive')
    setToast('تم نقل الرسالة إلى الأرشيف.')
  }

  const handleSendReply = () => {
    if (!selectedMessage || !replyText.trim()) return

    const replyMessage = {
      id: Date.now(),
      folder: 'sent',
      sender: 'أنت',
      subject: `رد: ${selectedMessage.subject}`,
      body: replyText.trim(),
      date: 'اليوم',
      time: 'الآن',
      priority: 'normal',
      read: true,
      hasAttachment: false,
    }

    setMessages((prev) => [replyMessage, ...prev])
    setReplyText('')
    setFolder('sent')
    setSelectedId(replyMessage.id)
    setToast('تم إرسال الرد بنجاح.')
  }

  return (
    <MainLayout userName={profile?.userName} userSub={profile?.userSub}>
      <div dir="rtl" className="px-4 py-6 md:px-8">
        <div className="mx-auto max-w-7xl">
          <PageHeader
            title="صندوق البريد"
            subtitle="متابعة الرسائل الواردة والصادرة وحفظ الرسائل المهمة"
            icon={Mail}
            leftContent={
              <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-black text-sky-700">
                غير مقروء: <span dir="ltr">{unreadCount}</span>
              </div>
            }
          />

          {toast && (
            <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-right text-sm font-bold text-emerald-700">
              {toast}
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[380px_minmax(0,1fr)]">
            <aside className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-4">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="بحث في الرسائل..."
                    dir="rtl"
                    className="w-full rounded-2xl border border-slate-200 py-3 pl-4 pr-9 text-right text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
                  />
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2">
                  {FOLDERS.map((item) => {
                    const Icon = item.icon

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setFolder(item.id)
                          setToast('')
                        }}
                        className={`rounded-2xl px-3 py-3 text-sm font-black transition-colors ${
                          folder === item.id
                            ? 'bg-slate-950 text-white'
                            : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="mx-auto mb-1 h-4 w-4" />
                        <span>{item.label}</span>
                        <span className="mr-1" dir="ltr">
                          ({folderCounts[item.id] || 0})
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="max-h-[620px] overflow-y-auto">
                {filteredMessages.map((message) => (
                  <MessageListItem
                    key={message.id}
                    message={message}
                    selected={selectedMessage?.id === message.id}
                    onClick={() => handleSelectMessage(message)}
                  />
                ))}

                {filteredMessages.length === 0 && (
                  <div className="p-10 text-center text-sm font-bold text-slate-400">
                    لا توجد رسائل مطابقة
                  </div>
                )}
              </div>
            </aside>

            <section className="min-h-[640px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              {selectedMessage ? (
                <div className="flex min-h-[640px] flex-col">
                  <div className="border-b border-slate-100 p-5">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1 text-right">
                          <div className="mb-3 flex items-center justify-start gap-2">
                            <PriorityBadge priority={selectedMessage.priority} />

                            {selectedMessage.hasAttachment && (
                              <Paperclip className="h-4 w-4 text-slate-400" />
                            )}
                          </div>

                          <h3 className="text-right text-xl font-black leading-8 text-slate-900">
                            {selectedMessage.subject}
                          </h3>

                          <div className="mt-3 space-y-1 text-right">
                            <p className="text-sm font-bold text-slate-500">
                              من: {selectedMessage.sender}
                            </p>
                            <p className="text-xs font-bold text-slate-400">
                              {selectedMessage.date} - {selectedMessage.time}
                            </p>
                          </div>
                        </div>

                        {selectedMessage.folder !== 'archive' && (
                          <button
                            type="button"
                            onClick={handleArchive}
                            className="flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50"
                          >
                            <span>أرشفة</span>
                            <Archive className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 p-5">
                    <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5 text-right">
                      <p className="whitespace-pre-line text-right text-sm font-medium leading-8 text-slate-700">
                        {selectedMessage.body}
                      </p>
                    </div>

                    {selectedMessage.folder === 'inbox' && (
                      <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-5">
                        <div className="mb-3 flex items-center justify-start gap-2">
                          <Reply className="h-4 w-4 text-slate-400" />
                          <h4 className="text-sm font-black text-slate-900">
                            كتابة رد
                          </h4>
                        </div>

                        <textarea
                          value={replyText}
                          onChange={(event) => setReplyText(event.target.value)}
                          rows={5}
                          dir="rtl"
                          placeholder="اكتب الرد هنا..."
                          className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-right text-sm text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
                        />

                        <div className="mt-3 flex justify-start">
                          <button
                            type="button"
                            onClick={handleSendReply}
                            disabled={!replyText.trim()}
                            className="flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                          >
                            <span>إرسال الرد</span>
                            <Send className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[640px] items-center justify-center p-10 text-center text-sm font-bold text-slate-400">
                  اختر رسالة لعرض التفاصيل
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}