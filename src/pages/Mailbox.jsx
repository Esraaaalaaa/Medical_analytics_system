import { useState } from 'react'
import MainLayout from '../components/layout/MainLayout'
import {
  Trash2, Forward, Search, Download,
  FileText, Send, Image, Paperclip,
} from 'lucide-react'

const MESSAGES = [
  {
    id: 1,
    sender: 'د. محمد علي',
    initials: 'م',
    avatarBg: 'bg-slate-600',
    subject: 'مراجعة تقرير الربع الثالث',
    preview: 'يرجى التكرم بمراجعة الأرقام الواردة في...',
    time: '10:42 ص',
    read: true,
    body: [
      'السيد الفاضل،',
      'تحية طيبة وبعد،',
      'يرجى التكرم بمراجعة الأرقام الواردة في تقرير المستحقات الخاص بالربع الثالث من العام الحالي، حيث لوحظ وجود بعض التفاوتات في بنود قوائم الانتظار مقارنة بالتقارير السابقة.',
      'برجاء الإفادة في أقرب وقت ممكن لاعتماد التقرير النهائي.',
      'وتفضلوا بقبول فائق الاحترام.',
    ],
    attachment: { name: 'report_Q3_v2.pdf', size: 'MB 1.2' },
  },
  {
    id: 2,
    sender: 'إدارة الشؤون المالية',
    initials: 'ش',
    avatarBg: 'bg-blue-600',
    subject: 'اعتماد مخصصات جديدة',
    preview: 'نود إعلامكم بأنه تم الموافقة على...',
    time: 'أمس',
    read: false,
    body: [
      'تحية طيبة،',
      'نود إعلامكم بأنه تم الموافقة على المخصصات الجديدة للعام المقبل وفق المعدلات المرفقة للاطلاع والاعتماد.',
      'وتفضلوا بقبول التحيات.',
    ],
    attachment: null,
  },
  {
    id: 3,
    sender: 'مدير مستشفيات بنها',
    initials: 'ب',
    avatarBg: 'bg-emerald-600',
    subject: 'تنسيق حالات الانتظار',
    preview: 'بخصوص الحالات المحولة من طرفكم...',
    time: 'الثلاثاء',
    read: true,
    body: [
      'تحية طيبة،',
      'بخصوص الحالات المحولة من طرفكم، نرجو التنسيق المسبق قبل أي إحالة جديدة لضمان توفر الطاقة الاستيعابية اللازمة.',
      'شكراً لتعاونكم.',
    ],
    attachment: null,
  },
]

export default function Mailbox() {
  const [selectedId, setSelectedId] = useState(1)
  const [msgs, setMsgs]             = useState(MESSAGES)
  const [reply, setReply]           = useState('')

  const selected = msgs.find(m => m.id === selectedId)

  const handleSelect = (id) => {
    setSelectedId(id)
    setMsgs(prev => prev.map(m => m.id === id ? { ...m, read: true } : m))
  }

  return (
    <MainLayout>
      {/* dir="ltr": first child → LEFT (detail), second child → RIGHT (list) */}
      <div dir="ltr" className="flex h-full overflow-hidden  max-w-8xl" >

        {/* ── LEFT: detail pane ── */}
        <div className="flex-1 flex flex-col overflow-hidden border-r border-slate-200">

          {/* Action bar */}
          <div className="flex items-center gap-1 px-5 py-3 border-b border-slate-200 shrink-0">
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <Trash2 className="w-4 h-4 text-slate-500" />
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <Forward className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          {/* Scrollable email body */}
          <div className="flex-1 overflow-y-auto px-10 py-7" dir="rtl">
            {selected && (
              <>
                {/* Subject */}
                <h2 className="text-[20px] font-bold text-slate-800 mb-5 leading-snug">
                  {selected.subject}
                </h2>

                {/* Sender info — avatar second in RTL flex = LEFT */}
                <div className="flex items-start gap-3 mb-8">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-700 text-[14px]">{selected.sender}</p>
                    <p className="text-slate-400 text-[12.5px] mt-0.5">
                      إلى: أنت • {selected.time} صباحاً
                    </p>
                  </div>
                  <div className={`w-10 h-10 rounded-full ${selected.avatarBg}
                    flex items-center justify-center shrink-0 text-white font-bold text-[15px]`}>
                    {selected.initials}
                  </div>
                </div>

                {/* Body */}
                <div className="text-slate-700 text-[14px] leading-[2.1] space-y-4">
                  {selected.body.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>

                {/* Attachment — in RTL: [pdf-icon RIGHT] [name] [download LEFT] */}
                {selected.attachment && (
                  <div className="mt-8 inline-flex items-center gap-3
                    border border-slate-200 rounded-xl p-3 bg-slate-50">
                    <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-700 text-[13px]">
                        {selected.attachment.name}
                      </p>
                      <p className="text-slate-400 text-[11.5px]">{selected.attachment.size}</p>
                    </div>
                    <button className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors shrink-0">
                      <Download className="w-4 h-4 text-slate-500" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Reply box — stays at the bottom */}
          <div className="border-t border-slate-200 p-4 shrink-0">
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
              <textarea
                value={reply}
                onChange={e => setReply(e.target.value)}
                placeholder="انقر هنا للرد..."
                rows={3}
                dir="rtl"
                className="w-full px-4 pt-3 pb-2 text-slate-700 text-[13.5px] resize-none
                  focus:outline-none placeholder:text-slate-400 block"
              />
              <div className="flex items-center justify-between px-3 pb-3 border-t border-slate-100 pt-2">
                <button className="flex items-center gap-2 bg-[#0d1526] hover:bg-slate-800 text-white
                  px-4 py-2 rounded-lg text-[13px] font-semibold transition-all duration-150">
                  <Send className="w-3.5 h-3.5" />
                  <span>إرسال</span>
                </button>
                <div className="flex gap-1">
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <Paperclip className="w-4 h-4 text-slate-400" />
                  </button>
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <Image className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: message list ── */}
        <div className="w-[285px] shrink-0 flex flex-col overflow-hidden bg-white"  max-w-8xl dir="rtl">

          {/* Header */}
          <div className="px-4 pt-5 pb-3 border-b border-slate-200 shrink-0">
            <h2 className="text-[17px] font-bold text-slate-800 mb-3">صندوق البريد</h2>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="بحث في الرسائل..."
                dir="rtl"
                className="w-full pr-9 pl-3 py-2.5 rounded-xl border border-slate-200 text-[13px]
                  text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2
                  focus:ring-sky-200 focus:border-sky-300 transition-all"
              />
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto">
            {msgs.map(msg => (
              <button
                key={msg.id}
                onClick={() => handleSelect(msg.id)}
                className={`w-full text-right px-4 py-3.5 border-b border-slate-100
                  transition-colors ${
                  selectedId === msg.id
                    ? 'bg-slate-100'
                    : 'bg-white hover:bg-slate-50'
                }`}
              >
                {/* Sender row: [sender + dot → RIGHT] [time → LEFT] in RTL justify-between */}
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className={`text-[13.5px] truncate ${
                      !msg.read ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'
                    }`}>
                      {msg.sender}
                    </span>
                    {!msg.read && (
                      <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                    )}
                  </div>
                  <span className="text-[11.5px] text-slate-400 shrink-0">{msg.time}</span>
                </div>

                <p className={`text-[12.5px] truncate mb-0.5 ${
                  !msg.read ? 'font-semibold text-slate-700' : 'text-slate-600'
                }`}>
                  {msg.subject}
                </p>
                <p className="text-[12px] text-slate-400 truncate">{msg.preview}</p>
              </button>
            ))}
          </div>
        </div>

      </div>
    </MainLayout>
  )
}
