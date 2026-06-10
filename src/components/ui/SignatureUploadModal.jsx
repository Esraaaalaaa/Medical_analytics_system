import { useRef, useState } from 'react'
import { X, Upload, Image as ImageIcon, Trash2, CheckCircle2 } from 'lucide-react'

export default function SignatureUploadModal({
  open,
  title = 'إضافة توقيع أو ختم',
  subtitle,
  currentImage,
  onClose,
  onSave,
  onRemove,
}) {
  const inputRef = useRef(null)
  const [preview, setPreview] = useState(currentImage ?? null)

  if (!open) return null

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    onSave?.(preview)
    onClose?.()
  }

  const handleRemove = () => {
    setPreview(null)
    onRemove?.()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl" dir="rtl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="text-right">
            <h3 className="text-lg font-black text-slate-900">{title}</h3>
            {subtitle && (
              <p className="mt-1 text-sm font-medium leading-6 text-slate-500">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="p-5">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex min-h-52 w-full flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/70 p-5 transition-all hover:border-sky-300 hover:bg-sky-50/50"
          >
            {preview ? (
              <img
                src={preview}
                alt="معاينة التوقيع"
                className="max-h-44 max-w-full rounded-2xl object-contain"
              />
            ) : (
              <>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-sky-600 shadow-sm">
                  <ImageIcon className="h-7 w-7" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-black text-slate-700">
                    اضغط لاختيار صورة التوقيع أو الختم
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-400">
                    PNG أو JPG مناسبين للعرض التجريبي
                  </p>
                </div>
              </>
            )}
          </button>

          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={handleRemove}
            className="flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 transition-colors hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4" />
            حذف الصورة
          </button>

          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50"
            >
              إلغاء
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={!preview}
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <CheckCircle2 className="h-4 w-4" />
              حفظ
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}