import Sidebar from './Sidebar'

export default function MainLayout({ children, userName, userSub }) {
  return (
    <div dir="rtl" className="flex h-screen bg-slate-100 overflow-hidden">
      <Sidebar userName={userName} userSub={userSub} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}