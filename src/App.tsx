import { useState, useEffect, useRef, useId } from 'react'

/** when set, Chat scrolls to this message id after return */
let chatFocusTarget: string | null = null

type MaterialFolder = { id: string; name: string; count: number }
let materialsFolders: MaterialFolder[] = [
  { id: '1', name: 'فصل سوم علوم', count: 5 },
  { id: '2', name: 'آزمایشگاه', count: 3 },
  { id: '3', name: 'نمونه سوال', count: 2 },
]
const materialsFolderListeners = new Set<() => void>()
function subscribeFolders(fn: () => void) {
  materialsFolderListeners.add(fn)
  return () => { materialsFolderListeners.delete(fn) }
}
function setMaterialsFolders(next: MaterialFolder[] | ((prev: MaterialFolder[]) => MaterialFolder[])) {
  materialsFolders = typeof next === 'function' ? next(materialsFolders) : next
  materialsFolderListeners.forEach(fn => fn())
}

function useMaterialsFolders() {
  const [, tick] = useState(0)
  useEffect(() => subscribeFolders(() => tick(x => x + 1)), [])
  return [materialsFolders, setMaterialsFolders] as const
}

function SaveToFolderSheet({
  open,
  onClose,
  onSaved,
}: {
  open: boolean
  onClose: () => void
  onSaved?: (name: string) => void
}) {
  const [folders, setFolders] = useMaterialsFolders()
  const [createOpen, setCreateOpen] = useState(false)
  const [folderName, setFolderName] = useState('')

  if (!open) return null

  const saveTo = (id: string, name: string) => {
    setFolders(prev => prev.map(x => x.id === id ? { ...x, count: x.count + 1 } : x))
    onSaved?.(name)
    onClose()
    setCreateOpen(false)
    setFolderName('')
  }

  const createAndSave = () => {
    const name = folderName.trim()
    if (!name) return
    const id = String(Date.now())
    setFolders(prev => [{ id, name, count: 1 }, ...prev])
    onSaved?.(name)
    onClose()
    setCreateOpen(false)
    setFolderName('')
  }

  return (
    <div className="overlay save-collection-overlay" onClick={onClose}>
      <div className="bottom-sheet save-collection-sheet" onClick={e => e.stopPropagation()}>
        <div className="sheet-handle" />
        {!createOpen ? (
          <>
            <button
              type="button"
              className="save-collection-main"
              onClick={() => {
                if (folders[0]) saveTo(folders[0].id, folders[0].name)
                else setCreateOpen(true)
              }}
            >
              <span className="save-collection-thumb"><Icon name="bookmark" size={20} /></span>
              <div>
                <strong>ذخیره‌شده‌ها</strong>
                <small>خصوصی · ذخیره سریع</small>
              </div>
              <Icon name="bookmark" size={18} />
            </button>
            <div className="save-collection-head">
              <strong>پوشه‌ها</strong>
              <button type="button" onClick={() => { setFolderName(''); setCreateOpen(true) }}>پوشه جدید</button>
            </div>
            <div className="folder-pick-list">
              {folders.map(f => (
                <div key={f.id} className="save-collection-row">
                  <span className="save-collection-thumb mint"><Icon name="file" size={18} /></span>
                  <div>
                    <strong>{f.name}</strong>
                    <small>{fa(f.count)} مورد</small>
                  </div>
                  <button
                    type="button"
                    className="save-collection-add"
                    aria-label={`ذخیره در ${f.name}`}
                    onClick={() => saveTo(f.id, f.name)}
                  >
                    <Icon name="plus" size={18} />
                  </button>
                </div>
              ))}
              {!folders.length && (
                <div className="sa-waiting">
                  <div>
                    <strong>پوشه‌ای وجود ندارد</strong>
                    <span>با «پوشه جدید» اولین پوشه را بسازید.</span>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="save-collection-create-bar">
              <button type="button" className="text-btn" onClick={() => setCreateOpen(false)}>انصراف</button>
              <strong>پوشه جدید</strong>
              <button type="button" className="text-btn primary" disabled={!folderName.trim()} onClick={createAndSave}>ذخیره</button>
            </div>
            <div className="save-collection-create-body">
              <span className="save-collection-preview"><Icon name="file" size={28} /></span>
              <label className="save-collection-input">
                <span>نام پوشه</span>
                <input
                  autoFocus
                  type="text"
                  placeholder="نام پوشه را بنویسید"
                  value={folderName}
                  onChange={e => setFolderName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') createAndSave() }}
                />
              </label>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

type UserRole = 'teacher' | 'student'

type Screen =
  | 'home'
  | 'messenger'
  | 'school'
  | 'chat'
  | 'conversation'
  | 'schedule'
  | 'calendar'
  | 'calls'
  | 'more'
  | 'materials'
  | 'assignments'
  | 'assignment'
  | 'assignment-create'
  | 'exam'
  | 'exam-create'
  | 'attendance'
  | 'call'
  | 'classroom'
  | 'gradebook'
  | 'storage'
  | 'grade-register'
  | 'reports'
  | 'auth'

type IconName =
  | 'search'
  | 'bell'
  | 'chevron'
  | 'more'
  | 'phone'
  | 'video'
  | 'paperclip'
  | 'smile'
  | 'send'
  | 'plus'
  | 'chat'
  | 'classes'
  | 'calendar'
  | 'calls'
  | 'grid'
  | 'close'
  | 'book'
  | 'file'
  | 'exam'
  | 'attendance'
  | 'clock'
  | 'image'
  | 'mic'
  | 'play'
  | 'pause'
  | 'speaker'
  | 'camera'
  | 'users'
  | 'check'
  | 'settings'
  | 'bookmark'
  | 'pencil'
  | 'menu'
  | 'minus'
  | 'person'
  | 'ball'
  | 'chart'
  | 'star'
  | 'lock'
  | 'home'
  | 'board'
  | 'platform'
  | 'logout'
  | 'bag'
  | 'download'

const paths: Record<IconName, React.ReactNode> = {
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
  chevron: <path d="m15 18-6-6 6-6" />,
  more: <><circle cx="5" cy="12" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="19" cy="12" r="1" fill="currentColor" /></>,
  phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c1 .3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" />,
  video: <><rect x="3" y="5" width="13" height="14" rx="3" /><path d="m16 10 5-3v10l-5-3" /></>,
  paperclip: <path d="m21.4 11.6-8.5 8.5a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7l-9.2 9.2a2 2 0 1 1-2.8-2.8l8.5-8.5" />,
  smile: <><circle cx="12" cy="12" r="9" /><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" /></>,
  send: <><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  chat: <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />,
  classes: <><path d="m3 10 9-5 9 5-9 5Z" /><path d="M7 12.5V17c3 2 7 2 10 0v-4.5M21 10v6" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M8 3v4M16 3v4M3 10h18" /></>,
  calls: <><path d="M8 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-4l-5-1-2 2c-3-1.2-5.8-4-7-7l2-2Z" /></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></>,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5Z" /><path d="M4 5.5v14" /></>,
  file: <><path d="M6 2h8l4 4v16H6Z" /><path d="M14 2v5h5M9 13h6M9 17h4" /></>,
  exam: <><path d="M8 3h8l1 3h3v16H4V6h3Z" /><path d="M9 12h6M9 16h6" /></>,
  attendance: <><circle cx="9" cy="8" r="4" /><path d="M2 21a7 7 0 0 1 14 0M17 11l2 2 4-4" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  image: <><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="9" cy="9" r="2" /><path d="m21 15-5-5L5 21" /></>,
  mic: <><rect x="9" y="3" width="6" height="12" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></>,
  play: <path d="M8 5.4v13.2a.6.6 0 0 0 .93.51l10.2-6.6a.6.6 0 0 0 0-1L8.93 4.89A.6.6 0 0 0 8 5.4Z" />,
  pause: <><rect x="7" y="5" width="3.4" height="14" rx="1.4" /><rect x="13.6" y="5" width="3.4" height="14" rx="1.4" /></>,
  speaker: <><path d="M11 5 6 9H3v6h3l5 4Z" /><path d="M15 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12" /></>,
  camera: <><path d="M14 5 12.5 3h-5L6 5H3v15h18V5Z" /><circle cx="12" cy="12" r="4" /></>,
  users: <><circle cx="9" cy="8" r="4" /><path d="M2 21a7 7 0 0 1 14 0M16 4a4 4 0 0 1 0 8M17 15a6 6 0 0 1 5 6" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" /></>,
  bookmark: <path d="M6 3h12v19l-6-4-6 4Z" />,
  pencil: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></>,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  minus: <path d="M5 12h14" />,
  person: <><circle cx="12" cy="8" r="4" /><path d="M4.5 21a7.5 7.5 0 0 1 15 0" /></>,
  ball: <><circle cx="12" cy="12" r="9" /><path d="m12 7.5 3.6 2.6-1.4 4.2H9.8l-1.4-4.2Z" /><path d="M12 3.2v4.3M5.4 8.7l3.4 1.4M18.6 8.7l-3.4 1.4M7.6 19.4l2.4-3.6M16.4 19.4l-2.4-3.6" /></>,
  chart: <path d="M4 20V11M10 20V5M16 20v-6M3 20h18" />,
  star: <path d="m12 3.5 2.6 5.3 5.9.8-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.8Z" />,
  lock: <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
  home: <path d="m19 21-7-3-7 3V9l7-3 7 3Z" />,
  board: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 19h18M7 9h1M13 9h1M7 15h1M13 15h1M11 9h1" /></>,
  platform: <><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></>,
  logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></>,
  bag: <><path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10Z" /><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><path d="M8 21v-5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v5" /></>,
  download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>,
}

function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

function IconButton({ icon, label, onClick, className = '' }: { icon: IconName; label: string; onClick?: () => void; className?: string }) {
  return <button className={`icon-button ${className}`} aria-label={label} onClick={onClick}><Icon name={icon} /></button>
}

const conversations = [
  { name: 'کلاس تجربی', msg: 'فایل تمرین امروز در گروه ارسال شد.', time: '۱۰:۴۲', unread: 3, type: 'گروه', color: 'mint', initials: 'ق' },
  { name: 'اعلانات ورود', msg: 'ورود موفق به حساب کاربری شما', time: '۱۰:۱۵', unread: 1, type: 'رسمی', color: 'blue', initials: 'او' },
  { name: 'راهبرد و توسعه', msg: 'محمدی: جلسه فردا ساعت ۸ برگزار می‌شود.', time: '۹:۲۸', unread: 0, type: 'گروه', color: 'purple', initials: 'رت' },
  { name: 'پیام‌های ذخیره‌شده', msg: 'جزوه فصل سوم علوم.pdf', time: 'دیروز', unread: 0, type: 'شخصی', color: 'green', initials: 'ذ' },
  { name: 'مسعود محبوبی', msg: 'خیلی ممنون استاد، دریافت شد.', time: 'دیروز', unread: 0, type: 'شخصی', color: 'orange', initials: 'م' },
  { name: 'اطلاع‌رسانی شاد', msg: 'نسخه جدید شاد در دسترس است.', time: 'شنبه', unread: 0, type: 'کانال', color: 'cyan', initials: 'ش' },
  { name: 'شبکه آموزشی دانش‌آموز (شاد)', msg: 'به شبکه آموزشی شاد خوش آمدید', time: 'جمعه', unread: 0, type: 'رسمی', color: 'navy', initials: 'ش' },
]

type MsgChat = { name: string; preview: string; time?: string; badge?: string; type: string; color: string; initials: string; icon?: IconName; verified?: boolean }

const messengerChats: MsgChat[] = [
  { name: 'لاک پشت کوچولو', preview: 'با یه در شیشه و خمیر بازی بسازش! 🎨', badge: 'بین', type: 'گروه', color: 'mint', initials: '🐢' },
  { name: 'پیام‌های ذخیره شده', preview: 'تصویر', time: '۰۹:۰۵', type: 'شخصی', color: 'blue', initials: '', icon: 'bookmark' },
  { name: 'اعلانات ورود', preview: 'ورود به حساب کاربری: در تاریخ ۱۴۰۵...', time: 'دوشنبه', type: 'رسمی', color: 'orange', initials: 'اع', verified: true },
  { name: 'ایمان نوری', preview: '1308035836286934785_1019013593...', time: 'دوشنبه', type: 'شخصی', color: 'blue', initials: 'ان' },
  { name: 'راهبرد و توسعه', preview: 'ایمان: طرح ارتقاء پیام رسان آموزشی.docx.', time: 'دوشنبه', type: 'گروه', color: 'red', initials: 'را' },
  { name: 'مسعود محبوبی', preview: 'https://docs.google.com/spreadsheet...', time: 'شنبه', type: 'شخصی', color: 'purple', initials: 'مم' },
  { name: 'اطلاع‌رسانی شاد', preview: 'شاد جدید رسید! نسخه جدید شاد 🎉🚀', time: 'مهر ۲۸', type: 'کانال', color: 'green', initials: 'ش', verified: true },
  { name: 'علوم تجربی · پایه نهم', preview: 'کلاس ۹۰۱ · ۲۸ دانش‌آموز · جلسه آنلاین', time: 'امروز', type: 'دروس من', color: 'green', initials: 'ع' },
  { name: 'ریاضی · پایه نهم', preview: 'کلاس ۹۰۲ · ۲۵ دانش‌آموز', time: 'امروز', type: 'دروس من', color: 'blue', initials: 'ر' },
  { name: 'آمادگی دفاعی · پایه نهم', preview: 'کلاس ۹۰۳ · ۲۲ دانش‌آموز', time: 'دیروز', type: 'دروس من', color: 'orange', initials: 'آ' },
]

const tools = [
  { title: 'ایجاد تکلیف', icon: 'book' as IconName, screen: 'assignment-create' as Screen },
  { title: 'ساخت آزمون', icon: 'exam' as IconName, screen: 'exam-create' as Screen },
  { title: 'ثبت حضور و غیاب', icon: 'attendance' as IconName, screen: 'attendance' as Screen },
  { title: 'افزودن جزوه', icon: 'file' as IconName, screen: 'materials' as Screen },
  { title: 'برنامه کلاسی', icon: 'calendar' as IconName, screen: 'schedule' as Screen },
  { title: 'ارسال فایل', icon: 'paperclip' as IconName, screen: 'chat' as Screen },
]

const quickLinks: { label: string; icon: IconName; color: string; badge?: string; screen: Screen }[] = [
  { label: 'شاد من', icon: 'person', color: 'ql-green', screen: 'more' },
    { label: 'پیام رسان', icon: 'chat', color: 'ql-blue', screen: 'messenger' },
  { label: 'آموزش', icon: 'home', color: 'ql-blue', screen: 'school' },
  { label: 'تماشا', icon: 'video', color: 'ql-red', screen: 'chat' },
  { label: 'دیدنی', icon: 'camera', color: 'ql-amber', badge: 'جدید', screen: 'materials' },
  { label: 'ورزشی', icon: 'ball', color: 'ql-purple', screen: 'schedule' },
]

const clickableQuickLinks = new Set(['پیام رسان', 'آموزش'])

function QuickLinks({ navigate, active }: { navigate: (screen: Screen) => void; active?: string }) {
  return <div className="quick-links">
    {quickLinks.map(q => {
      const clickable = clickableQuickLinks.has(q.label)
      return <button className={`quick-link ${active === q.label ? 'active' : ''} ${clickable ? '' : 'ql-disabled'}`} key={q.label} onClick={clickable ? () => navigate(q.screen) : undefined}>
      <span className={`ql-icon ${q.color}`}><Icon name={q.icon} /></span>
      <strong>{q.label}</strong>
      {q.badge && <b className="ql-badge">{q.badge}</b>}
    </button>
    })}
  </div>
}

function Avatar({ item, large = false }: { item: { color: string; initials: string }; large?: boolean }) {
  return <div className={`avatar ${item.color} ${large ? 'avatar-large' : ''}`}>{item.initials}</div>
}

function BottomMenu({ navigate, active }: { navigate: (screen: Screen) => void; active?: string }) {
  const items = [
    { label: 'تماس‌ها', icon: 'phone' as IconName, screen: 'calls' as Screen },
    { label: 'گفتگو', icon: 'chat' as IconName, screen: 'messenger' as Screen },
    { label: 'احراز هویت', icon: 'lock' as IconName, screen: 'auth' as Screen },
    { label: 'شادبین', icon: 'search' as IconName, screen: 'classroom' as Screen },
  ]
  return <nav className="msg-nav">{items.map(item => <button key={item.label} className={active === item.label ? 'active' : ''} onClick={() => navigate(item.screen)}><span><Icon name={item.icon} /></span><small>{item.label}</small></button>)}</nav>
}

function Messenger({ navigate }: { navigate: (screen: Screen) => void; goBack?: () => void; role?: UserRole }) {
  const [started] = useState(classStarted)
  const [filter, setFilter] = useState('همه')
  const filtered = filter === 'همه' ? messengerChats : filter === 'دروس من' ? messengerChats.filter(c => c.type === 'دروس من') : messengerChats.filter(c => c.type === filter)
  return <div className="screen home messenger-light" dir="rtl">
    <header className="home-header">
      <QuickLinks navigate={navigate} active="پیام رسان" />
    </header>
    <div className="home-toolbar">
      <button className="icon-button toolbar-button" aria-label="منو"><Icon name="menu" /></button>
      <button className="icon-button toolbar-button" aria-label="جست‌وجو"><Icon name="search" /></button>
    </div>
    <div className="chips">{['همه', 'دروس من', 'گروه', 'شخصی', 'کانال'].map(x => <button key={x} className={filter === x ? 'active' : ''} onClick={() => setFilter(x)}>{x}</button>)}</div>
    <main className="conversation-list">
      {started && <button className="class-banner-active" onClick={() => navigate('call')}>
        <Icon name="video" />
        <div>
          <strong>کلاس هم‌اکنون در حال برگزاری است</strong>
          <small>علوم تجربی · پایه نهم</small>
        </div>
        <Icon name="chevron" />
      </button>}
      {filtered.map(c => <button className="conversation" key={c.name} onClick={() => navigate('chat')}>
        <div className={`avatar ${c.color} ${c.icon ? 'iconed' : ''}`}>{c.icon ? <Icon name={c.icon} /> : c.initials}</div>
        <div className="conversation-copy"><div><strong>{c.name}{c.verified && <span className="verified"><Icon name="check" size={11} /></span>}</strong>{c.time && <time>{c.time}</time>}</div><div><p>{c.preview}</p>{c.badge ? <b className="unread">{c.badge}</b> : <span className="read-mark">✓✓</span>}</div></div>
      </button>)}
    </main>
    <BottomMenu navigate={navigate} active="گفتگو" />
  </div>
}

function MySchoolNav({ active, setActive }: { navigate: (screen: Screen) => void; active: string; setActive: (v: string) => void }) {
  const items: { label: string; icon: IconName }[] = [
    { label: 'خانه', icon: 'home' },
    { label: 'مدرسه من', icon: 'book' },
    { label: 'محتوای آموزشی', icon: 'board' },
    { label: 'سکوی آموزشی', icon: 'platform' },
  ]
  return (
    <nav className="msg-nav">
      {items.map(item => (
        <button
          key={item.label}
          className={active === item.label ? 'active' : ''}
          onClick={() => setActive(item.label)}
        >
          <span><Icon name={item.icon} /></span>
          <small>{item.label}</small>
        </button>
      ))}
    </nav>
  )
}

function MySchool({ navigate, role = 'teacher' }: { navigate: (screen: Screen) => void; goBack?: () => void; role?: UserRole }) {
  const [active, setActive] = useState(role === 'teacher' ? 'مدرسه من' : 'خانه')
  void role
  const subjects = [
    { name: 'علوم تجربی', image: `${import.meta.env.BASE_URL}book-cover.png` },
    { name: 'ریاضی', image: `${import.meta.env.BASE_URL}math-book-cover.png` },
    { name: 'فارسی', image: `${import.meta.env.BASE_URL}persian-book-cover.png` },
    { name: 'عربی', image: `${import.meta.env.BASE_URL}arabic-book-cover.png` },
  ]

  const contentPlaceholder = (
    <div className="school-home">
      <div className="display-banner">
        <span className="display-banner-icon"><Icon name="board" /></span>
        <div>
          <strong>محتوای آموزشی</strong>
          <small>بخش محتوای آموزشی</small>
        </div>
      </div>
    </div>
  )

  return <div className="screen" dir="rtl">
    <div className="msg-header">
      <QuickLinks navigate={navigate} active="آموزش" />
    </div>
    <main className="msg-list" style={{ paddingTop: 10 }}>
      {active === 'خانه' && (
        <div className="edu-home">
          <div className="edu-hero">
            <div className="edu-hero-text">
              <strong>مدرسه من</strong>
              <span>هر روز یه چیز تازه یاد بگیر</span>
            </div>
            <div className="edu-hero-art" aria-hidden="true">📓✏️</div>
          </div>

          <section className="edu-section">
            <div className="edu-section-head">
              <strong>دسترسی سریع</strong>
            </div>
            <div className="edu-quick-grid">
              {[
                { t: 'دروس من', i: 'book' as IconName, action: () => navigate('classroom') },
                { t: 'بانک سوال', i: 'exam' as IconName, action: () => navigate('exam') },
                { t: 'فیلم آموزشی', i: 'video' as IconName, action: () => {} },
                { t: 'بازی آموزشی', i: 'ball' as IconName, action: () => {} },
              ].map(x => (
                <button key={x.t} type="button" className="edu-quick-item" onClick={x.action}>
                  <span><Icon name={x.i} size={22} /></span>
                  <small>{x.t}</small>
                </button>
              ))}
            </div>
          </section>

          <section className="edu-section">
            <div className="edu-cards-scroll">
              {[
                { t: 'ترفندهای ریاضی: مقایسه آسان اعداد صحیح', c: '#5b8def' },
                { t: 'ترفندهای ریاضی: ترفند طلایی اعداد توان‌دار', c: '#7c5cbf' },
                { t: 'ترفندهای ریاضی: مقایسه پروانه‌ای کسرها', c: '#e07a3a' },
              ].map(card => (
                <button key={card.t} type="button" className="edu-content-card" style={{ background: `linear-gradient(145deg, ${card.c}, ${card.c}cc)` }}>
                  <strong>{card.t}</strong>
                </button>
              ))}
            </div>
          </section>

          <section className="edu-section">
            <div className="edu-section-head">
              <strong>اتاق معلمان</strong>
              <button type="button">مشاهده بیشتر</button>
            </div>
            <div className="edu-teachers-scroll">
              {['سارا', 'مریم', 'رضا', 'نرگس', 'امیر', 'زهرا', 'حسین', 'فاطمه'].map((name, i) => (
                <button key={name} type="button" className="edu-teacher-card">
                  <div className={`edu-teacher-avatar a${i % 4}`}>{name[0]}</div>
                  <small>{name}</small>
                </button>
              ))}
            </div>
          </section>

          <section className="edu-section">
            <label className="edu-ask-box">
              <Icon name="search" size={18} />
              <input placeholder="هر چی دلت میخواد بپرس" />
            </label>
          </section>

          <section className="edu-section">
            <div className="edu-section-head">
              <strong>سوالای درسیتو بپرس</strong>
            </div>
            <div className="edu-bots-scroll">
              {[
                { t: 'مرشد', c: '#3d8bfd' },
                { t: 'بوف', c: '#6b4eff' },
                { t: 'اندرز', c: '#f0a020' },
              ].map(bot => (
                <button key={bot.t} type="button" className="edu-bot-card">
                  <div className="edu-bot-icon" style={{ background: bot.c }}>{bot.t[0]}</div>
                  <strong>{bot.t}</strong>
                </button>
              ))}
            </div>
          </section>

          <section className="edu-section edu-treasure">
            <div className="edu-section-head light">
              <strong>گنجینه یادگیری</strong>
            </div>
            <div className="edu-treasure-scroll">
              {['کوئیز ۲۴', 'جونیورا', 'آناتومیار', 'مرشد', 'کی‌برد', 'اُکیان'].map(item => (
                <button key={item} type="button" className="edu-treasure-item">
                  <span>{item[0]}</span>
                  <small>{item}</small>
                </button>
              ))}
            </div>
          </section>

          <section className="edu-section">
            <div className="edu-section-head">
              <strong>ابزار تدریس معلمان</strong>
              <button type="button">بیشتر</button>
            </div>
            <div className="edu-tools-scroll">
              {[
                { t: 'اسلایدهای آموزشی', s: 'تهیه ارائه و محتوا', i: 'image' as IconName },
                { t: 'آزمون ساز', s: 'طراحی و برگزاری', i: 'exam' as IconName },
                { t: 'طرح درس', s: 'سوالات استاندارد', i: 'file' as IconName },
                { t: 'بانک سوالات', s: 'برنامه‌ریزی آموزشی', i: 'book' as IconName },
              ].map(tool => (
                <button key={tool.t} type="button" className="edu-tool-card">
                  <span className="edu-tool-icon"><Icon name={tool.i} size={20} /></span>
                  <strong>{tool.t}</strong>
                  <small>{tool.s}</small>
                </button>
              ))}
            </div>
          </section>

          <section className="edu-section" style={{ marginBottom: 20 }}>
            <div className="edu-section-head">
              <strong>کانال‌های آموزشی</strong>
            </div>
            <div className="edu-channels-scroll">
              {['علوم نهم', 'ریاضی آسان', 'فارسی خلاق', 'عربی پایه'].map(ch => (
                <button key={ch} type="button" className="edu-channel-card">
                  <div className="edu-channel-avatar">{ch[0]}</div>
                  <small>{ch}</small>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
      {active === 'مدرسه من' && (
        <div className="school-home" style={{ padding: '0 15px' }}>
          <div className="cal-split">
            <button className="calendar-banner" onClick={() => navigate('schedule')}>
              <div>
                <strong>برنامه کلاسی</strong>
                <small>۳ کلاس امروز · جلسه بعدی ۰۹:۰۰</small>
              </div>
              <span className="banner-cta">مشاهده</span>
            </button>
            <button className="calendar-banner" onClick={() => navigate('calendar')}>
              <div>
                <strong>تقویم</strong>
                <small>مهر ۱۴۰۵ · ۲ مورد الان · ۲ پیش رو</small>
              </div>
              <span className="banner-cta">مشاهده</span>
            </button>
          </div>
          <div className="subjects-section">
            <div className="subjects-heading">
              <Icon name="book" size={18} />
              <strong>دروس من</strong>
            </div>
            <div className="subjects-scroll">
              {subjects.map(subject => (
                <button className="subject-card" key={subject.name} onClick={() => navigate('classroom')}>
                  <img src={subject.image} alt={subject.name} />
                  <strong>{subject.name}</strong>
                </button>
              ))}
            </div>
          </div>
          <div className="section-heading" style={{ marginTop: 14 }}>
            <strong>تکالیف این هفته</strong>
            <button style={{ background: 'transparent', border: 0, color: 'var(--green-dark)', fontSize: 11, fontWeight: 700 }} onClick={() => { assignmentContext = null; navigate('assignments') }}>مشاهده همه</button>
          </div>
          <button className="resource" onClick={() => navigate('assignment')}>
            <span className="resource-icon green"><Icon name="book" /></span>
            <div>
              <strong>تمرین فصل سوم علوم تجربی</strong>
              <small>گروه درسی: علوم تجربی · کلاس ۹۰۱</small>
              <span>مهلت تحویل: دوشنبه، ۲۰:۰۰ · ۰ از ۲۸ تحویل</span>
            </div>
            <Icon name="chevron" />
          </button>
          <button className="resource" onClick={() => navigate('assignment')}>
            <span className="resource-icon blue"><Icon name="book" /></span>
            <div>
              <strong>گزارش آزمایش فشار هوا</strong>
              <small>گروه درسی: علوم تجربی · کلاس ۹۰۱</small>
              <span>مهلت تحویل: چهارشنبه، ۱۸:۰۰ · ۱۲ از ۲۸ تحویل</span>
            </div>
            <Icon name="chevron" />
          </button>
          <div className="section-heading" style={{ marginTop: 14 }}>
            <strong>آزمون‌های این هفته</strong>
            <button style={{ background: 'transparent', border: 0, color: 'var(--green-dark)', fontSize: 11, fontWeight: 700 }} onClick={() => navigate('exam')}>مشاهده همه</button>
          </div>
          <button className="resource" onClick={() => navigate('exam')}>
            <span className="resource-icon orange"><Icon name="exam" /></span>
            <div>
              <strong>آزمون میان‌ترم علوم تجربی</strong>
              <small>گروه درسی: علوم تجربی · کلاس ۹۰۱</small>
              <span>زمان شروع: فردا · ۰۹:۰۰ · مدت: ۳۰ دقیقه</span>
            </div>
            <Icon name="chevron" />
          </button>
        </div>
      )}
      {(active === 'محتوای آموزشی' || active === 'سکوی آموزشی') && contentPlaceholder}
    </main>
    <MySchoolNav navigate={navigate} active={active} setActive={setActive} />
  </div>
}

function CalendarPage({ navigate, goBack }: { navigate: (screen: Screen) => void; goBack: () => void }) {
  type CalKind = 'assignment' | 'exam' | 'event'
  type CalItem = { day: number; kind: CalKind; subject: string; title: string; due: string }
  type CalMonth = {
    label: string
    days: number
    offset: number
    today: number
    items: CalItem[]
  }
  const months: CalMonth[] = [
    {
      label: 'مهر ۱۴۰۵', days: 30, offset: 3, today: 4,
      items: [
        { day: 4, kind: 'assignment', subject: 'ریاضی', title: 'تمرین صفحه ۴۵', due: 'تا امروز' },
        { day: 4, kind: 'assignment', subject: 'علوم', title: 'پرسش کلاسی فصل ۲', due: 'تا امروز' },
        { day: 4, kind: 'event', subject: 'کلاس', title: 'جلسه آنلاین علوم', due: 'امروز · ۱۰:۰۰' },
        { day: 5, kind: 'assignment', subject: 'علوم', title: 'گزارش آزمایش', due: 'تا ۵ مهر' },
        { day: 5, kind: 'exam', subject: 'ریاضی', title: 'آزمونک جمع و تفریق', due: '۵ مهر' },
        { day: 5, kind: 'event', subject: 'مدرسه', title: 'فعالیت پرورشی', due: '۵ مهر' },
        { day: 8, kind: 'assignment', subject: 'فارسی', title: 'خلاصه درس', due: '۸ مهر' },
        { day: 8, kind: 'assignment', subject: 'عربی', title: 'تمرین ترجمه', due: '۸ مهر' },
        { day: 12, kind: 'event', subject: 'فارسی', title: 'انشا', due: '۱۲ مهر' },
        { day: 12, kind: 'assignment', subject: 'علوم', title: 'تمرین صفحه ۵۲', due: '۱۲ مهر' },
        { day: 12, kind: 'exam', subject: 'فارسی', title: 'آزمونک املا', due: '۱۲ مهر' },
        { day: 15, kind: 'event', subject: 'عربی', title: 'حفظ', due: '۱۵ مهر' },
        { day: 15, kind: 'assignment', subject: 'ریاضی', title: 'مسئله‌های صفحه ۶۰', due: '۱۵ مهر' },
        { day: 15, kind: 'event', subject: 'کلاس', title: 'بازدید آزمایشگاه', due: '۱۵ مهر' },
        { day: 18, kind: 'assignment', subject: 'علوم', title: 'کاربرگ فصل ۳', due: '۱۸ مهر' },
        { day: 18, kind: 'exam', subject: 'عربی', title: 'آزمونک قواعد', due: '۱۸ مهر' },
        { day: 20, kind: 'exam', subject: 'علوم', title: 'آزمون فصل ۳', due: '۲۰ مهر' },
        { day: 20, kind: 'assignment', subject: 'ریاضی', title: 'مرور قبل از آزمون', due: '۲۰ مهر' },
        { day: 20, kind: 'event', subject: 'مدرسه', title: 'همایش علمی', due: '۲۰ مهر' },
        { day: 24, kind: 'assignment', subject: 'فارسی', title: 'خواندن متن', due: '۲۴ مهر' },
        { day: 24, kind: 'assignment', subject: 'علوم', title: 'تحقیق کوتاه', due: '۲۴ مهر' },
        { day: 27, kind: 'exam', subject: 'ریاضی', title: 'آزمون میان‌ماه', due: '۲۷ مهر' },
        { day: 27, kind: 'event', subject: 'کلاس', title: 'حل تمرین گروهی', due: '۲۷ مهر' },
        { day: 30, kind: 'assignment', subject: 'عربی', title: 'تمرین پایانی', due: '۳۰ مهر' },
        { day: 30, kind: 'exam', subject: 'فارسی', title: 'آزمونک درک مطلب', due: '۳۰ مهر' },
        { day: 30, kind: 'event', subject: 'مدرسه', title: 'جمع‌بندی ماه', due: '۳۰ مهر' },
      ],
    },
    {
      label: 'آبان ۱۴۰۵', days: 30, offset: 5, today: 0,
      items: [
        { day: 3, kind: 'assignment', subject: 'ریاضی', title: 'تمرین فصل ۴', due: '۳ آبان' },
        { day: 3, kind: 'exam', subject: 'علوم', title: 'آزمونک فصل ۴', due: '۳ آبان' },
        { day: 3, kind: 'event', subject: 'کلاس', title: 'شروع واحد جدید', due: '۳ آبان' },
        { day: 7, kind: 'assignment', subject: 'فارسی', title: 'انشا کوتاه', due: '۷ آبان' },
        { day: 7, kind: 'assignment', subject: 'عربی', title: 'کلمه و معنی', due: '۷ آبان' },
        { day: 12, kind: 'exam', subject: 'ریاضی', title: 'آزمونک هندسه', due: '۱۲ آبان' },
        { day: 12, kind: 'event', subject: 'مدرسه', title: 'مسابقه علمی', due: '۱۲ آبان' },
        { day: 20, kind: 'assignment', subject: 'علوم', title: 'گزارش کار', due: '۲۰ آبان' },
        { day: 25, kind: 'exam', subject: 'فارسی', title: 'آزمون کلاسی', due: '۲۵ آبان' },
      ],
    },
    {
      label: 'آذر ۱۴۰۵', days: 30, offset: 0, today: 0,
      items: [
        { day: 7, kind: 'assignment', subject: 'ریاضی', title: 'تمرین ماهانه', due: '7 آذر' },
        { day: 7, kind: 'event', subject: 'کلاس', title: 'مرور درس', due: '7 آذر' },
        { day: 14, kind: 'exam', subject: 'علوم', title: 'آزمونک دوره‌ای', due: '14 آذر' },
        { day: 14, kind: 'assignment', subject: 'فارسی', title: 'تکلیف نوشتاری', due: '14 آذر' },
        { day: 20, kind: 'event', subject: 'مدرسه', title: 'برنامه مناسبتی', due: '20 آذر' },
        { day: 23, kind: 'assignment', subject: 'عربی', title: 'تمرین ترجمه', due: '23 آذر' },
      ],
    },
    {
      label: 'دی ۱۴۰۵', days: 30, offset: 2, today: 0,
      items: [
        { day: 8, kind: 'assignment', subject: 'ریاضی', title: 'تمرین ماهانه', due: '8 دی' },
        { day: 8, kind: 'event', subject: 'کلاس', title: 'مرور درس', due: '8 دی' },
        { day: 15, kind: 'exam', subject: 'علوم', title: 'آزمونک دوره‌ای', due: '15 دی' },
        { day: 15, kind: 'assignment', subject: 'فارسی', title: 'تکلیف نوشتاری', due: '15 دی' },
        { day: 21, kind: 'event', subject: 'مدرسه', title: 'برنامه مناسبتی', due: '21 دی' },
        { day: 24, kind: 'assignment', subject: 'عربی', title: 'تمرین ترجمه', due: '24 دی' },
      ],
    },
    {
      label: 'بهمن ۱۴۰۵', days: 30, offset: 4, today: 0,
      items: [
        { day: 9, kind: 'assignment', subject: 'ریاضی', title: 'تمرین ماهانه', due: '9 بهمن' },
        { day: 9, kind: 'event', subject: 'کلاس', title: 'مرور درس', due: '9 بهمن' },
        { day: 16, kind: 'exam', subject: 'علوم', title: 'آزمونک دوره‌ای', due: '16 بهمن' },
        { day: 16, kind: 'assignment', subject: 'فارسی', title: 'تکلیف نوشتاری', due: '16 بهمن' },
        { day: 18, kind: 'event', subject: 'مدرسه', title: 'برنامه مناسبتی', due: '18 بهمن' },
        { day: 21, kind: 'assignment', subject: 'عربی', title: 'تمرین ترجمه', due: '21 بهمن' },
      ],
    },
    {
      label: 'اسفند ۱۴۰۵', days: 29, offset: 6, today: 0,
      items: [
        { day: 10, kind: 'assignment', subject: 'ریاضی', title: 'تمرین ماهانه', due: '10 اسفند' },
        { day: 10, kind: 'event', subject: 'کلاس', title: 'مرور درس', due: '10 اسفند' },
        { day: 12, kind: 'exam', subject: 'علوم', title: 'آزمونک دوره‌ای', due: '12 اسفند' },
        { day: 12, kind: 'assignment', subject: 'فارسی', title: 'تکلیف نوشتاری', due: '12 اسفند' },
        { day: 19, kind: 'event', subject: 'مدرسه', title: 'برنامه مناسبتی', due: '19 اسفند' },
        { day: 22, kind: 'assignment', subject: 'عربی', title: 'تمرین ترجمه', due: '22 اسفند' },
      ],
    },
    {
      label: 'فروردین ۱۴۰۶', days: 31, offset: 0, today: 0,
      items: [
        { day: 11, kind: 'assignment', subject: 'ریاضی', title: 'تمرین ماهانه', due: '11 فروردین' },
        { day: 11, kind: 'event', subject: 'کلاس', title: 'مرور درس', due: '11 فروردین' },
        { day: 13, kind: 'exam', subject: 'علوم', title: 'آزمونک دوره‌ای', due: '13 فروردین' },
        { day: 13, kind: 'assignment', subject: 'فارسی', title: 'تکلیف نوشتاری', due: '13 فروردین' },
        { day: 20, kind: 'event', subject: 'مدرسه', title: 'برنامه مناسبتی', due: '20 فروردین' },
        { day: 23, kind: 'assignment', subject: 'عربی', title: 'تمرین ترجمه', due: '23 فروردین' },
      ],
    },
    {
      label: 'اردیبهشت ۱۴۰۶', days: 31, offset: 3, today: 0,
      items: [
        { day: 5, kind: 'assignment', subject: 'ریاضی', title: 'تمرین ماهانه', due: '5 اردیبهشت' },
        { day: 5, kind: 'event', subject: 'کلاس', title: 'مرور درس', due: '5 اردیبهشت' },
        { day: 14, kind: 'exam', subject: 'علوم', title: 'آزمونک دوره‌ای', due: '14 اردیبهشت' },
        { day: 14, kind: 'assignment', subject: 'فارسی', title: 'تکلیف نوشتاری', due: '14 اردیبهشت' },
        { day: 21, kind: 'event', subject: 'مدرسه', title: 'برنامه مناسبتی', due: '21 اردیبهشت' },
        { day: 24, kind: 'assignment', subject: 'عربی', title: 'تمرین ترجمه', due: '24 اردیبهشت' },
      ],
    },
    {
      label: 'خرداد ۱۴۰۶', days: 31, offset: 6, today: 0,
      items: [
        { day: 6, kind: 'assignment', subject: 'ریاضی', title: 'تمرین ماهانه', due: '6 خرداد' },
        { day: 6, kind: 'event', subject: 'کلاس', title: 'مرور درس', due: '6 خرداد' },
        { day: 15, kind: 'exam', subject: 'علوم', title: 'آزمونک دوره‌ای', due: '15 خرداد' },
        { day: 15, kind: 'assignment', subject: 'فارسی', title: 'تکلیف نوشتاری', due: '15 خرداد' },
        { day: 18, kind: 'event', subject: 'مدرسه', title: 'برنامه مناسبتی', due: '18 خرداد' },
        { day: 21, kind: 'assignment', subject: 'عربی', title: 'تمرین ترجمه', due: '21 خرداد' },
      ],
    },
    {
      label: 'تیر ۱۴۰۶', days: 31, offset: 2, today: 0,
      items: [
        { day: 7, kind: 'assignment', subject: 'ریاضی', title: 'تمرین ماهانه', due: '7 تیر' },
        { day: 7, kind: 'event', subject: 'کلاس', title: 'مرور درس', due: '7 تیر' },
        { day: 16, kind: 'exam', subject: 'علوم', title: 'آزمونک دوره‌ای', due: '16 تیر' },
        { day: 16, kind: 'assignment', subject: 'فارسی', title: 'تکلیف نوشتاری', due: '16 تیر' },
        { day: 19, kind: 'event', subject: 'مدرسه', title: 'برنامه مناسبتی', due: '19 تیر' },
        { day: 22, kind: 'assignment', subject: 'عربی', title: 'تمرین ترجمه', due: '22 تیر' },
      ],
    },
    {
      label: 'مرداد ۱۴۰۶', days: 31, offset: 5, today: 0,
      items: [
        { day: 8, kind: 'assignment', subject: 'ریاضی', title: 'تمرین ماهانه', due: '8 مرداد' },
        { day: 8, kind: 'event', subject: 'کلاس', title: 'مرور درس', due: '8 مرداد' },
        { day: 12, kind: 'exam', subject: 'علوم', title: 'آزمونک دوره‌ای', due: '12 مرداد' },
        { day: 12, kind: 'assignment', subject: 'فارسی', title: 'تکلیف نوشتاری', due: '12 مرداد' },
        { day: 20, kind: 'event', subject: 'مدرسه', title: 'برنامه مناسبتی', due: '20 مرداد' },
        { day: 23, kind: 'assignment', subject: 'عربی', title: 'تمرین ترجمه', due: '23 مرداد' },
      ],
    },
    {
      label: 'شهریور ۱۴۰۶', days: 31, offset: 1, today: 0,
      items: [
        { day: 9, kind: 'assignment', subject: 'ریاضی', title: 'تمرین ماهانه', due: '9 شهریور' },
        { day: 9, kind: 'event', subject: 'کلاس', title: 'مرور درس', due: '9 شهریور' },
        { day: 13, kind: 'exam', subject: 'علوم', title: 'آزمونک دوره‌ای', due: '13 شهریور' },
        { day: 13, kind: 'assignment', subject: 'فارسی', title: 'تکلیف نوشتاری', due: '13 شهریور' },
        { day: 21, kind: 'event', subject: 'مدرسه', title: 'برنامه مناسبتی', due: '21 شهریور' },
        { day: 24, kind: 'assignment', subject: 'عربی', title: 'تمرین ترجمه', due: '24 شهریور' },
      ],
    }
  ]
  const kindLabel: Record<CalKind, string> = {
    assignment: 'تکلیف',
    exam: 'آزمون',
    event: 'رویداد',
  }
  const [monthIdx, setMonthIdx] = useState(0)
  const m = months[monthIdx]
  const kindsOnDay = (day: number) => new Set(m.items.filter(it => it.day === day).map(it => it.kind))
  const daysWithItems = [...new Set(m.items.map(it => it.day))].sort((a, b) => a - b)

  const scrollToDay = (day: number) => {
    if (!kindsOnDay(day).size) return
    const el = document.getElementById(`cal-day-${day}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="screen inner-screen calendar-screen">
      <SubHeader screen="calendar" back={goBack} rightIcon={null} subtitle={`${m.label} · همه دروس`} />
      <main className="inner-content calendar-layout">
        <div className="calendar-sticky">
          <div className="month-card month-page calendar-top-card">
            <div className="month-card-head">
              <button type="button" className="month-nav" disabled={monthIdx === 0} onClick={() => setMonthIdx(i => Math.max(0, i - 1))}>قبلی</button>
              <strong>{m.label}</strong>
              <button type="button" className="month-nav" disabled={monthIdx === months.length - 1} onClick={() => setMonthIdx(i => Math.min(months.length - 1, i + 1))}>بعدی</button>
            </div>
            <div className="month-grid">
              {['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'].map(d => (
                <span key={d} className="mg-dayname">{d}</span>
              ))}
              {Array.from({ length: m.offset }, (_, i) => (
                <span key={`e${i}`} className="mg-cell empty" />
              ))}
              {Array.from({ length: m.days }, (_, i) => {
                const day = i + 1
                const cls = ['mg-cell']
                if (day === m.today) cls.push('today')
                const kinds = kindsOnDay(day)
                if (kinds.has('assignment')) cls.push('has-assignment')
                if (kinds.has('exam')) cls.push('has-exam')
                if (kinds.has('event')) cls.push('has-event')
                if (kinds.size) cls.push('is-clickable')
                return (
                  <span
                    key={day}
                    className={cls.join(' ')}
                    role={kinds.size ? 'button' : undefined}
                    tabIndex={kinds.size ? 0 : undefined}
                    onClick={() => scrollToDay(day)}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') scrollToDay(day) }}
                  >
                    {fa(day)}
                  </span>
                )
              })}
            </div>
            <div className="month-legend">
              <strong className="legend-title">راهنما</strong>
              <span><i className="dot assignment" />تکلیف</span>
              <span><i className="dot exam" />آزمون</span>
              <span><i className="dot event" />رویداد</span>
            </div>
          </div>
        </div>
        <div className="calendar-scroll">
          <div className="month-tasks">
            {daysWithItems.length === 0 && (
              <div className="report-empty-hint">رویدادی برای این ماه ثبت نشده است.</div>
            )}
            {daysWithItems.map(day => {
              const list = m.items.filter(it => it.day === day)
              return (
                <div className="mt-group kind-by-date" key={day} id={`cal-day-${day}`}>
                  <em>{fa(day)} {m.label.replace(/\s*\d+$/, '').trim()}</em>
                  {list.map(it => (
                    <button
                      type="button"
                      className={`cal-item-link kind-${it.kind}`}
                      key={`${it.day}-${it.kind}-${it.title}`}
                      onClick={() => {
                        if (it.kind === 'assignment') {
                          assignmentContext = { subject: it.subject, klass: 'کلاس ۹۰۱' }
                          navigate('assignment')
                          return
                        }
                        if (it.kind === 'exam') {
                          navigate('exam')
                          return
                        }
                        // event → classroom / chat context
                        navigate('classroom')
                      }}
                    >
                      <i className={`dot ${it.kind}`} />
                      <span className="cal-item-copy">
                        <b>{kindLabel[it.kind]}</b> · {it.subject} · {it.title}
                        <small>{it.due}</small>
                      </span>
                      <Icon name="chevron" size={16} />
                    </button>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}



let classStarted = false
let assignmentContext: { subject: string; klass: string } | null = null
type PublishedExam = { title: string; kind: 'آزمون' | 'آزمونک'; day: string; time: string; startKey: string; at: string }
/** last exam published from exam-create; shows in Chat until start time */
let publishedExam: PublishedExam | null = null


function Chat({ navigate, goBack, role = 'teacher' }: { navigate: (screen: Screen) => void; goBack: () => void; role?: UserRole }) {
  const isStudent = role === 'student'
  const [sheet, setSheet] = useState<'tools' | 'attach' | null>(null)
  const [started, setStarted] = useState(classStarted)
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState<string[]>([])
  const [seconds, setSeconds] = useState(0)
  const [toast, setToast] = useState<string | null>(null)
  const [mediaMode, setMediaMode] = useState<'voice' | 'video'>('voice')
  const [recording, setRecording] = useState(false)
  const recordTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const didRecord = useRef(false)
  const [selectedStudent, setSelectedStudent] = useState<{ name: string; initials: string } | null>(null)
  const [scoreValue, setScoreValue] = useState('0')
  const [scoreDesc, setScoreDesc] = useState('')
  const [scoreSuccess, setScoreSuccess] = useState(false)
  const [showCallPopup, setShowCallPopup] = useState(false)
  const [bagOpen, setBagOpen] = useState(false)
  const [activityOpen, setActivityOpen] = useState(true)
  const [saveSheetOpen, setSaveSheetOpen] = useState(false)
  const [saveTargetId, setSaveTargetId] = useState<string | null>(null)
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({})

  const exam = publishedExam
  const examReady = Boolean(exam && `${nowShamsi().date} ${nowShamsi().time}` >= exam.startKey)

  useEffect(() => {
    const timer = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!chatFocusTarget) return
    const id = chatFocusTarget
    chatFocusTarget = null
    const t = window.setTimeout(() => {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        el.classList.add('message-highlight')
        window.setTimeout(() => el.classList.remove('message-highlight'), 1800)
      }
    }, 80)
    return () => window.clearTimeout(t)
  }, [])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const remS = s % 60
    return fa(`${m.toString().padStart(2, '0')}:${remS.toString().padStart(2, '0')}`)
  }

  const send = () => { if (message.trim()) { setSent([...sent, message]); setMessage('') } }
  const startPress = () => {
    didRecord.current = false
    recordTimer.current = setTimeout(() => { didRecord.current = true; setRecording(true) }, 400)
  }
  const endPress = () => {
    if (recordTimer.current) { clearTimeout(recordTimer.current); recordTimer.current = null }
    if (!didRecord.current) { setMediaMode(m => m === 'voice' ? 'video' : 'voice') }
    setRecording(false)
  }
  
  const handleScoreSubmit = () => {
    if (selectedStudent) {
      setScoreSuccess(true)
      setTimeout(() => {
        setScoreSuccess(false)
        setSelectedStudent(null)
        setScoreDesc('')
        setScoreValue('0')
      }, 1500)
    }
  }
  return <div className="screen chat-screen">
    <header className="chat-header">
      <IconButton icon="chevron" label="بازگشت" onClick={goBack} />
      <Avatar item={conversations[0]} />
      <button className="chat-person" onClick={() => navigate('classroom')}>
        <strong>کلاس تجربی<span className="verified"><Icon name="check" size={11} /></span></strong>
        <span>۲۸ عضو، ۶ نفر آنلاین</span>
      </button>
      {!isStudent && <IconButton icon="bag" label="کیف / کوله پشتی" onClick={() => setBagOpen(true)} />}
      <IconButton icon="more" label="گزینه‌های بیشتر" />
    </header>
    {exam && (
      <div className={`exam-shortcut-banner ${examReady ? 'ready' : ''}`}>
        <span className="exam-shortcut-icon"><Icon name="exam" /></span>
        <div className="exam-shortcut-info">
          <strong>{exam.title}</strong>
          <small>شروع: {exam.day} · ساعت {exam.time}</small>
        </div>
        <button
          type="button"
          className="exam-shortcut-btn"
          disabled={!examReady}
          onClick={() => {
            chatFocusTarget = 'chat-msg-exam'
            navigate('exam')
          }}
        >
          {examReady ? 'مشاهده' : 'در انتظار شروع'}
        </button>
      </div>
    )}
    {started && <div className="live-banner" onClick={() => navigate('call')}>
      <i className="live-dot" />
      <strong>کلاس در حال برگزاری</strong>
      <small>{formatTime(seconds)}</small>
    </div>}
    {!isStudent && <div className={`recent-activity ${activityOpen ? 'open' : 'collapsed'}`}>
      <div className="activity-head">
        <small>{started ? 'دانش‌آموزان فعال' : 'دانش‌آموزان'}</small>
      </div>
      {activityOpen && <div className="activity-list">
        {[
          { n: 'علی', online: true }, { n: 'فاطمه', online: true }, { n: 'آراد', online: true },
          { n: 'یسنا', online: true }, { n: 'امیررضا', online: true }, { n: 'مبینا', online: false },
          { n: 'محمد', online: false }, { n: 'زهرا', online: false }, { n: 'حسین', online: false },
          { n: 'نگار', online: false },
        ].sort((a, b) => Number(b.online) - Number(a.online)).map((s) => (
          <button className="active-student" key={s.n} onClick={() => setSelectedStudent({ name: s.n, initials: s.n[0] })}>
            <div className={`avatar-small ${s.online ? 'online' : 'offline'}`}>
              {s.n[0]}
              <i className="status-dot" />
            </div>
            <span>{s.n}</span>
          </button>
        ))}
      </div>}
      <button className="activity-tab" onClick={() => setActivityOpen(o => !o)} aria-label={activityOpen ? 'جمع کردن' : 'باز کردن'}>
        <Icon name="chevron" size={15} />
      </button>
    </div>}
    <main className="messages">
      <div className="day"><span>امروز</span></div>
      <div className="message-row received"><div className="message-bubble"><strong className="sender">خانم کریمی</strong><p>سلام بچه‌ها، وقتتون بخیر. فایل تمرین فصل سوم رو براتون فرستادم.</p><span>۱۰:۲۸</span></div></div>
      <div className="message-row received"><div className="message-bubble attachment-card"><div className="file-icon"><Icon name="file" /></div><div><strong>تمرین فصل سوم علوم.pdf</strong><small>۲٫۴ مگابایت · PDF</small></div>{!isStudent && <button type="button" className={`bookmark-btn ${savedIds['chat-pdf'] ? 'saved' : ''}`} aria-label="ذخیره فایل" onClick={() => {
            if (savedIds['chat-pdf']) {
              setSavedIds(prev => ({ ...prev, 'chat-pdf': false }))
              setToast('از ذخیره‌ها حذف شد')
              setTimeout(() => setToast(null), 1400)
              return
            }
            setSaveTargetId('chat-pdf')
            setSaveSheetOpen(true)
          }}><Icon name="bookmark" /></button>}<span>۱۰:۲۹</span></div></div>
      <div className="message-row sent"><div className="message-bubble"><p>ممنون خانم، تا چه روزی فرصت داریم؟</p><span>۱۰:۳۴ <b>✓✓</b></span></div></div>
      <div className="message-row received" id="chat-msg-assignment">
        <div className="message-bubble announcement">
          <small>تکلیف جدید</small>
          <strong>تمرین فصل سوم</strong>
          <p>مهلت تحویل: دوشنبه، ساعت ۲۰:۰۰</p>
          <button onClick={() => {
            chatFocusTarget = 'chat-msg-assignment'
            navigate('assignment')
          }}>مشاهده تکلیف</button>
          <span>۱۰:۳۶</span>
        </div>
      </div>
      {exam && (
        <div className="message-row received" id="chat-msg-exam">
          <div className="message-bubble announcement exam-announcement">
            <small>{exam.kind}</small>
            <strong>{exam.title}</strong>
            <p>شروع: {exam.day} · ساعت {exam.time}</p>
            <button
              type="button"
              disabled={!examReady}
              onClick={() => {
                chatFocusTarget = 'chat-msg-exam'
                navigate('exam')
              }}
            >
              {examReady ? 'مشاهده' : 'در انتظار شروع'}
            </button>
            <span>{exam.at}</span>
          </div>
        </div>
      )}
      <div className="message-row received"><div className="message-bubble voice"><button aria-label="پخش پیام صوتی"><span>▶</span></button><div className="wave"><i/><i/><i/><i/><i/><i/><i/><i/></div><small>۰:۳۷</small><span>۱۰:۴۱</span></div></div>
      {sent.map((text, i) => <div className="message-row sent" key={i}><div className="message-bubble"><p>{text}</p><span>اکنون <b>✓</b></span></div></div>)}
    </main>
    <div className="composer-wrap">
      <div className="composer">
        {message.trim() === '' ? (
          <>
            <button type="button" className="icon-button media-button" aria-label="پیام صوتی/تصویری" onPointerDown={startPress} onPointerUp={endPress} onPointerLeave={endPress}>
              <Icon name={mediaMode === 'video' ? 'video' : 'mic'} />
            </button>
            <IconButton icon="paperclip" label="پیوست" onClick={() => setSheet('attach')} />
          </>
        ) : (
          <IconButton icon="send" label="ارسال" onClick={send} className="send-button" />
        )}
        <textarea rows={1} value={message} onChange={e => setMessage(e.target.value)} placeholder="پیام خود را بنویسید..." />
        {recording && <span className="recording-indicator">در حال ضبط...</span>}
        <IconButton icon="smile" label="شکلک" />
      </div>
    </div>
    <SaveToFolderSheet
      open={saveSheetOpen}
      onClose={() => { setSaveSheetOpen(false); setSaveTargetId(null) }}
      onSaved={(name) => {
        if (saveTargetId) setSavedIds(prev => ({ ...prev, [saveTargetId]: true }))
        setSaveTargetId(null)
        setToast(`در پوشه «${name}» ذخیره شد`)
        setTimeout(() => setToast(null), 1600)
      }}
    />
    {toast && <div className="toast">{toast}</div>}
    {bagOpen && (
      <div className="overlay" style={{ alignItems: 'center' }} onClick={() => setBagOpen(false)}>
        <section
          className="bottom-sheet"
          style={{ borderRadius: 22, margin: '0 16px', maxWidth: 360, width: '100%', paddingBottom: 20 }}
          onClick={e => e.stopPropagation()}
        >
          <div className="sheet-handle" />
          <div className="sheet-title">
            <div>
              <strong>کیف ابزار کلاس</strong>
              <span>یک گزینه را انتخاب کنید</span>
            </div>
            <IconButton icon="close" label="بستن" onClick={() => setBagOpen(false)} />
          </div>
          <div className="tool-grid">
            <button type="button" onClick={() => { setBagOpen(false); navigate('assignment-create') }}>
              <span><Icon name="book" /></span>
              <strong>ایجاد تکلیف</strong>
            </button>
            <button type="button" onClick={() => { setBagOpen(false); navigate('exam-create') }}>
              <span><Icon name="exam" /></span>
              <strong>ایجاد آزمون</strong>
            </button>
            <button type="button" onClick={() => { setBagOpen(false); navigate('grade-register') }}>
              <span><Icon name="chart" /></span>
              <strong>ثبت نمره</strong>
            </button>
            <button type="button" className="is-decorative">
              <span><Icon name="classes" /></span>
              <strong>ورود به کلاسا</strong>
            </button>
            <button type="button" onClick={() => { setBagOpen(false); setShowCallPopup(true) }}>
              <span><Icon name="phone" /></span>
              <strong>گفتگوی صوتی</strong>
            </button>
          </div>
        </section>
      </div>
    )}
    {showCallPopup && <div className="overlay" onClick={() => setShowCallPopup(false)}>
      <section className="bottom-sheet call-popup" onClick={e => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div className="sheet-title"><div><strong>شروع کلاس</strong><span>آیا می‌خواهید کلاس را شروع کنید؟</span></div><IconButton icon="close" label="بستن" onClick={() => setShowCallPopup(false)} /></div>
        <div className="sticky-action" style={{position:'static', border:0, padding:0, marginTop:12}}>
          <button className="secondary" onClick={() => setShowCallPopup(false)}>لغو</button>
          <button onClick={() => { classStarted = true; setStarted(true); setShowCallPopup(false); navigate('call') }}>شروع کلاس</button>
        </div>
      </section>
    </div>}
    {sheet && <div className="overlay" onClick={() => setSheet(null)}>
      <section className="bottom-sheet" onClick={e => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div className="sheet-title"><div><strong>{sheet === 'tools' ? 'ابزارهای کلاس' : 'افزودن پیوست'}</strong><span>{sheet === 'tools' ? 'یک فعالیت آموزشی انتخاب کنید' : 'نوع فایل را انتخاب کنید'}</span></div><IconButton icon="close" label="بستن" onClick={() => setSheet(null)} /></div>
        {sheet === 'tools' ? <div className="tool-grid">{tools.map(t => <button key={t.title} onClick={() => { setSheet(null); navigate(t.screen) }}><span><Icon name={t.icon} /></span><strong>{t.title}</strong></button>)}</div> :
          <div className="tool-grid attach-grid">{[{t:'تصویر و ویدیو',i:'image'}, {t:'فایل',i:'file'}, {t:'دوربین',i:'camera'}, {t:'موقعیت مکانی',i:'grid'}].map(x => <button key={x.t} onClick={() => setSheet(null)}><span><Icon name={x.i as IconName} /></span><strong>{x.t}</strong></button>)}</div>}
      </section>
    </div>}

    {selectedStudent && <div className="overlay" onClick={() => setSelectedStudent(null)}>
      <section className="bottom-sheet score-sheet" onClick={e => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div className="score-student-header">
          <div className="avatar-small large">{selectedStudent.initials}</div>
          <div>
            <strong>{selectedStudent.name}</strong>
            <small>ثبت امتیاز و بازخورد آموزشی</small>
          </div>
          <IconButton icon="close" label="بستن" onClick={() => setSelectedStudent(null)} />
        </div>
        {scoreSuccess ? (
          <div className="score-success">
            <span className="success-icon"><Icon name="check" size={28} /></span>
            <strong>امتیاز با موفقیت ثبت شد</strong>
            <p>در سابقه دانش‌آموز ثبت گردید</p>
          </div>
        ) : (
          <div className="score-form">
            <div className="score-stepper">
              <button type="button" className="score-step-btn positive" onClick={() => setScoreValue(v => String((Number(v) || 0) + 1))} aria-label="افزایش">
                <Icon name="plus" size={18} />
              </button>
              <label className="field score-value-field">
                <input type="text" inputMode="numeric" value={fa(scoreValue)} onChange={e => setScoreValue(toEn(e.target.value).replace(/[^0-9-]/g, ''))} placeholder="امتیاز" />
              </label>
              <button type="button" className="score-step-btn negative" onClick={() => setScoreValue(v => String((Number(v) || 0) - 1))} aria-label="کاهش">
                <Icon name="minus" size={18} />
              </button>
            </div>

            <div className={`quick-reasons ${(Number(scoreValue) || 0) >= 0 ? 'positive' : 'negative'}`}>
              <small>توضیحات پیشنهادی:</small>
              <div className="chips compact">
                {((Number(scoreValue) || 0) >= 0
                  ? ['پاسخ صحیح به پرسش', 'مشارکت فعال', 'انجام کامل تکلیف']
                  : ['عدم انجام تکلیف', 'تأخیر در ورود', 'بی‌توجهی به درس']
                ).map(reason => (
                  <button key={reason} type="button" className={scoreDesc === reason ? 'active' : ''} onClick={() => setScoreDesc(reason)}>
                    {reason}
                  </button>
                ))}
              </div>
            </div>
            <label className="field">
              <span>توضیح دلخواه</span>
              <textarea rows={2} value={scoreDesc} onChange={e => setScoreDesc(e.target.value)} placeholder="علت ثبت امتیاز را بنویسید..." />
            </label>
            <button type="button" className={`submit-score-btn ${(Number(scoreValue) || 0) >= 0 ? 'positive' : 'negative'}`} onClick={handleScoreSubmit}>
              ثبت امتیاز {(Number(scoreValue) || 0) >= 0 ? `مثبت (+${fa(scoreValue)})` : `منفی (${fa(scoreValue)})`}
            </button>
          </div>
        )}
      </section>
    </div>}
  </div>
}

function Conversation({ goBack }: { navigate: (screen: Screen) => void; goBack: () => void }) {
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState<string[]>([])
  const [saveSheetOpen, setSaveSheetOpen] = useState(false)
  const [saveTargetId, setSaveTargetId] = useState<string | null>(null)
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({})
  const [toast, setToast] = useState<string | null>(null)
  const send = () => { if (message.trim()) { setSent([...sent, message]); setMessage('') } }
  const chat = messengerChats[0]
  return <div className="screen chat-screen conversation-light" dir="rtl">
    <header className="chat-header">
      <IconButton icon="chevron" label="بازگشت" onClick={goBack} />
      <div className={`avatar ${chat.color} ${chat.icon ? 'iconed' : ''}`}>{chat.icon ? <Icon name={chat.icon} /> : chat.initials}</div>
      <button className="chat-person">
        <strong>{chat.name}{chat.verified && <span className="verified"><Icon name="check" size={11} /></span>}</strong>
        <span>آنلاین</span>
      </button>
      <IconButton icon="phone" label="تماس صوتی" />
      <IconButton icon="more" label="گزینه‌های بیشتر" />
    </header>
    <main className="messages">
      <div className="day"><span>امروز</span></div>
      <div className="message-row received"><div className="message-bubble"><strong className="sender">لاک پشت کوچولو</strong><p>با یه در شیشه و خمیر بازی بسازش! 🎨</p><span>۰۹:۰۵</span></div></div>
      <div className="message-row received"><div className="message-bubble attachment-card"><div className="file-icon"><Icon name="image" /></div><div><strong>تصویر</strong><small>۱٫۲ مگابایت · JPG</small></div><button type="button" className={`bookmark-btn ${savedIds['conv-img'] ? 'saved' : ''}`} aria-label="ذخیره فایل" onClick={() => {
            if (savedIds['conv-img']) {
              setSavedIds(prev => ({ ...prev, 'conv-img': false }))
              setToast('از ذخیره‌ها حذف شد')
              setTimeout(() => setToast(null), 1400)
              return
            }
            setSaveTargetId('conv-img')
            setSaveSheetOpen(true)
          }}><Icon name="bookmark" /></button><span>۰۹:۰۶</span></div></div>
      <div className="message-row sent"><div className="message-bubble"><p>عالیه! چطور ساخته میشه؟</p><span>۰۹:۱۰ <b>✓✓</b></span></div></div>
      <div className="message-row received"><div className="message-bubble"><p>با یه در شیشه خالی و خمیر بازی شروع کن 🐢</p><span>۰۹:۱۲</span></div></div>
      {sent.map((text, i) => <div className="message-row sent" key={i}><div className="message-bubble"><p>{text}</p><span>اکنون <b>✓</b></span></div></div>)}
    </main>
    <div className="composer-wrap">
      <div className="composer">
        <IconButton icon="plus" label="ابزارها" className="plus-button" />
        <IconButton icon="paperclip" label="پیوست" />
        <textarea rows={1} value={message} onChange={e => setMessage(e.target.value)} placeholder="پیام خود را بنویسید..." />
        <IconButton icon="smile" label="شکلک" />
        <IconButton icon="send" label="ارسال" onClick={send} className="send-button" />
      </div>
    </div>
    <SaveToFolderSheet
      open={saveSheetOpen}
      onClose={() => { setSaveSheetOpen(false); setSaveTargetId(null) }}
      onSaved={(name) => {
        if (saveTargetId) setSavedIds(prev => ({ ...prev, [saveTargetId]: true }))
        setSaveTargetId(null)
        setToast(`در پوشه «${name}» ذخیره شد`)
        setTimeout(() => setToast(null), 1600)
      }}
    />
    {toast && <div className="toast">{toast}</div>}
  </div>
}

const screenMeta: Partial<Record<Screen, { title: string; subtitle: string }>> = {
  calendar: { title: 'تقویم', subtitle: 'مهر ۱۴۰۵ · همه دروس' },
  materials: { title: 'منابع کلاسی', subtitle: 'کلاس علوم تجربی' },
  assignment: { title: 'جزئیات تکلیف', subtitle: 'علوم تجربی · کلاس ۹۰۱' },
  'assignment-create': { title: 'ایجاد تکلیف', subtitle: 'فعالیت جدید برای کلاس' },
  exam: { title: 'آزمون‌ها', subtitle: 'کلاس ۹۰۱' },
  'exam-create': { title: 'ساخت آزمون', subtitle: 'تنظیمات و پرسش‌ها' },
  attendance: { title: 'حضور و غیاب', subtitle: 'علوم تجربی · امروز' },
  assignments: { title: 'تکالیف', subtitle: 'همه دروس · این هفته' },
  gradebook: { title: 'ثبت نمره', subtitle: 'علوم تجربی · نیم‌ترم اول' },
  'grade-register': { title: 'ثبت نمره', subtitle: 'علوم تجربی · کلاس ۹۰۱' },
  storage: { title: 'مدیریت حافظه', subtitle: 'علوم تجربی · کلاس ۹۰۱' },
}

function SubHeader({ screen, back, rightIcon = 'more', onRightClick, rightLabel = 'بیشتر', rightText, rightExtra, showSearchBtn = false, onSearchClick, title, subtitle, searchOpen = false, searchValue = '', onSearchChange, onSearchClose, searchPlaceholder = 'جست‌وجو...' }: {
  screen: Screen
  back: () => void
  rightIcon?: IconName | null
  onRightClick?: () => void
  rightLabel?: string
  rightText?: string
  rightExtra?: import('react').ReactNode
  showSearchBtn?: boolean
  onSearchClick?: () => void
  title?: string
  subtitle?: string
  searchOpen?: boolean
  searchValue?: string
  onSearchChange?: (v: string) => void
  onSearchClose?: () => void
  searchPlaceholder?: string
}) {
  const meta = screenMeta[screen]!
  if (searchOpen) {
    return (
      <header className="sub-header sub-header-search">
        <IconButton icon="chevron" label="بازگشت به حالت قبل" onClick={onSearchClose ?? back} />
        <label className="header-search-field">
          <span className="header-search-icon" aria-hidden="true"><Icon name="search" size={18} /></span>
          <input
            autoFocus
            type="search"
            value={searchValue}
            placeholder={searchPlaceholder}
            onChange={e => onSearchChange?.(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Escape') onSearchClose?.()
            }}
          />
          {!!searchValue && (
            <button
              type="button"
              className="header-search-clear"
              aria-label="پاک کردن"
              onClick={() => onSearchChange?.('')}
            >
              <Icon name="close" size={16} />
            </button>
          )}
        </label>
      </header>
    )
  }
  return (
    <header className="sub-header">
      <IconButton icon="chevron" label="بازگشت" onClick={back} />
      <div><strong>{title ?? meta.title}</strong><span>{subtitle ?? meta.subtitle}</span></div>
      <div className="sub-header-actions">
        {rightExtra}
        {showSearchBtn && (
          <IconButton icon="search" label="جست‌وجو" onClick={onSearchClick} />
        )}
        {rightText ? (
          <button
            type="button"
            className={`header-text-btn ${rightText === 'خروجی' ? 'is-export' : rightText === 'ویرایش' ? 'is-edit' : ''}`}
            onClick={onRightClick}
            aria-label={rightText}
          >
            {rightText}
          </button>
        ) : !showSearchBtn && !rightExtra && rightIcon ? (
          <IconButton icon={rightIcon} label={rightLabel} onClick={onRightClick} />
        ) : null}
      </div>
    </header>
  )
}

function FormField({ label, placeholder, type = 'text' }: { label: string; placeholder: string; type?: string }) {
  return <label className="field"><span>{label}</span><input type={type} placeholder={placeholder} /></label>
}

function Materials({ navigate, goBack }: { navigate: (s: Screen) => void; goBack: () => void }) {
  const [folders, setFolders] = useMaterialsFolders()
  const [activeFolder, setActiveFolder] = useState<{ id: string; name: string } | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [folderName, setFolderName] = useState('')
  const [pickFolderOpen, setPickFolderOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all'|'pdf'|'video'|'image'|'audio'|'text'>('all')
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadTitle, setUploadTitle] = useState('')
  const [uploadText, setUploadText] = useState('')
  const [uploadType, setUploadType] = useState<'pdf'|'video'|'image'|'audio'|'text'>('pdf')
  const [uploadFile, setUploadFile] = useState<string | null>(null)

  const [items, setItems] = useState([
    {n:'جزوه فصل سوم علوم',m:'PDF · ۲٫۴ مگابایت',i:'file' as IconName, type:'pdf' as const},
    {n:'آزمایش فشار هوا',m:'ویدیو · ۰۸:۳۴',i:'video' as IconName, type:'video' as const},
    {n:'نمودار چرخه آب',m:'تصویر · ۱٫۲ مگابایت',i:'image' as IconName, type:'image' as const},
    {n:'فایل صوتی درس سوم',m:'صدا · MP3 · ۴٫۱ مگابایت',i:'mic' as IconName, type:'audio' as const},
    {n:'یادداشت درس سوم',m:'متن · ۱۲۰ کلمه',i:'file' as IconName, type:'text' as const},
  ])

  const typeMeta: Record<'pdf'|'video'|'image'|'audio'|'text', { icon: IconName; meta: string }> = {
    pdf: { icon: 'file', meta: 'PDF · فایل جدید' },
    video: { icon: 'video', meta: 'ویدیو · فایل جدید' },
    image: { icon: 'image', meta: 'تصویر · فایل جدید' },
    audio: { icon: 'mic', meta: 'صدا · فایل جدید' },
    text: { icon: 'file', meta: 'متن · یادداشت' },
  }

  const submitUpload = () => {
    const title = uploadTitle.trim() || (uploadType === 'text' ? 'یادداشت جدید' : 'فایل جدید')
    const meta = typeMeta[uploadType]
    const note = uploadText.trim()
    setItems(prev => [{
      n: title,
      m: note ? `${meta.meta} · ${note.slice(0, 24)}${note.length > 24 ? '…' : ''}` : meta.meta,
      i: meta.icon,
      type: uploadType,
    }, ...prev])
    if (activeFolder) {
      setFolders(prev => prev.map(f => f.id === activeFolder.id ? { ...f, count: f.count + 1 } : f))
    }
    setFilter(uploadType)
    setUploadOpen(false)
    setUploadTitle('')
    setUploadText('')
    setUploadFile(null)
    setUploadType('pdf')
    setToast('در پوشه ذخیره شد')
    setTimeout(() => setToast(null), 1600)
  }
  const q = query.trim()
  const filtered = items.filter(x => {
    const byType = filter === 'all' || x.type === filter
    const byQuery = !q || x.n.includes(q) || x.m.includes(q)
    return byType && byQuery
  })
  const labels = {all:'همه', pdf:'PDF', video:'ویدیو', image:'تصویر', audio:'صدا', text:'متن'} as const

  const createFolder = () => {
    const name = folderName.trim()
    if (!name) return
    setFolders(prev => [{ id: String(Date.now()), name, count: 0 }, ...prev])
    setFolderName('')
    setCreateOpen(false)
  }

  if (!activeFolder) {
    return <div className="screen inner-screen">
      <SubHeader
        screen="materials"
        back={goBack}
        title="پوشه‌ها"
        subtitle="منابع کلاسی"
        showSearchBtn
        onSearchClick={() => setSearchOpen(true)}
        searchOpen={searchOpen}
        searchValue={query}
        onSearchChange={setQuery}
        onSearchClose={() => { setSearchOpen(false); setQuery('') }}
        searchPlaceholder="جست‌وجو در پوشه‌ها..."
      />
      <main className="inner-content">
        <div className="section-heading">
          <strong>پوشه‌های کلاس</strong>
          <span>{fa(folders.filter(f => !query.trim() || f.name.includes(query.trim())).length)} پوشه</span>
        </div>
        {folders.filter(f => !query.trim() || f.name.includes(query.trim())).map(f => (
          <button
            key={f.id}
            type="button"
            className="resource folder-card"
            onClick={() => { setSearchOpen(false); setQuery(''); setActiveFolder({ id: f.id, name: f.name }) }}
          >
            <span className="resource-icon mint"><Icon name="file" /></span>
            <div>
              <strong>{f.name}</strong>
              <small>پوشه منابع</small>
              <span>{fa(f.count)} مورد</span>
            </div>
            <Icon name="chevron" />
          </button>
        ))}
        {!folders.length && (
          <div className="empty">
            <Icon name="file" size={40} />
            <strong>پوشه‌ای نیست</strong>
            <span>با دکمه + پایین صفحه پوشه بسازید.</span>
          </div>
        )}
        {folders.length > 0 && !folders.some(f => !query.trim() || f.name.includes(query.trim())) && (
          <div className="empty">
            <Icon name="search" size={40} />
            <strong>موردی پیدا نشد</strong>
            <span>عبارت دیگری را جست‌وجو کنید.</span>
          </div>
        )}
      </main>
      <button className="fab" aria-label="ایجاد پوشه" onClick={() => setCreateOpen(true)}>
        <Icon name="plus" />
      </button>
      {createOpen && (
        <div className="overlay group-grade-overlay" onClick={() => setCreateOpen(false)}>
          <div className="bottom-sheet group-grade-sheet" onClick={e => e.stopPropagation()}>
            <div className="sheet-handle" />
            <div className="sheet-title">
              <div>
                <strong>پوشه جدید</strong>
                <span>نام دلخواه پوشه را وارد کنید</span>
              </div>
              <IconButton icon="close" label="بستن" onClick={() => setCreateOpen(false)} />
            </div>
            <div className="group-grade-body">
              <label className="field">
                <span>نام پوشه</span>
                <input
                  autoFocus
                  type="text"
                  placeholder="مثلاً فصل سوم"
                  value={folderName}
                  onChange={e => setFolderName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') createFolder() }}
                />
              </label>
            </div>
            <div className="group-grade-footer">
              <button type="button" className="secondary" onClick={() => setCreateOpen(false)}>انصراف</button>
              <button type="button" className="primary" onClick={createFolder} disabled={!folderName.trim()}>ایجاد</button>
            </div>
          </div>
        </div>
      )}
    </div>
  }

  return <div className="screen inner-screen">
    <SubHeader
      screen="materials"
      back={() => {
        setSearchOpen(false)
        setQuery('')
        setActiveFolder(null)
      }}
      title={activeFolder.name}
      subtitle="منابع کلاسی"
      rightIcon="search"
      rightLabel="جست‌وجو"
      onRightClick={() => setSearchOpen(true)}
      searchOpen={searchOpen}
      searchValue={query}
      onSearchChange={setQuery}
      onSearchClose={() => { setSearchOpen(false); setQuery('') }}
      searchPlaceholder={`جست‌وجو در ${activeFolder.name}`}
    />
    <main className="inner-content">
      <div className="chips compact scrollable">{(['all','pdf','video','image','audio','text'] as const).map((k) => <button key={k} className={filter===k?'active':''} onClick={()=>setFilter(k)}>{labels[k]}</button>)}</div>
      <div className="section-heading"><strong>محتوای پوشه</strong><span>{String(filtered.length).replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[+d])} مورد</span></div>
      {filtered.map(x => <button className="resource" key={x.n} onClick={() => navigate('chat')}><span className="resource-icon"><Icon name={x.i} /></span><div><strong>{x.n}</strong><small>{x.m}</small><span>یکشنبه، ۲۴ فروردین</span></div><Icon name="chevron" /></button>)}
      {!filtered.length && (
        <div className="empty compact-empty">
          <Icon name="search" size={32} />
          <strong>موردی پیدا نشد</strong>
          <span>عبارت دیگری را جست‌وجو کنید.</span>
        </div>
      )}
      <button type="button" className="save-message" onClick={() => setPickFolderOpen(true)}>
        <Icon name="bookmark" />
        <div>
          <strong>ذخیره از گفتگو</strong>
          <span>انتخاب پوشه برای ذخیره پیام یا فایل</span>
        </div>
      </button>
    </main>

    <button
      className="fab"
      aria-label="افزودن محتوا"
      onClick={() => setUploadOpen(true)}
    >
      <Icon name="plus" />
    </button>

    {uploadOpen && (
      <div className="overlay group-grade-overlay" onClick={() => setUploadOpen(false)}>
        <div className="bottom-sheet group-grade-sheet" onClick={e => e.stopPropagation()}>
          <div className="sheet-handle" />
          <div className="sheet-title">
            <div>
              <strong>افزودن به پوشه</strong>
              <span>{activeFolder?.name || 'منابع کلاسی'}</span>
            </div>
            <IconButton icon="close" label="بستن" onClick={() => setUploadOpen(false)} />
          </div>
          <div className="group-grade-body">
            <label className="field">
              <span>عنوان</span>
              <input
                type="text"
                placeholder="مثلاً جزوه فصل چهارم"
                value={uploadTitle}
                onChange={e => setUploadTitle(e.target.value)}
              />
            </label>
            <label className="field">
              <span>توضیح / متن</span>
              <textarea
                rows={3}
                placeholder="متن یادداشت یا توضیح فایل..."
                value={uploadText}
                onChange={e => setUploadText(e.target.value)}
              />
            </label>
            <button
              type="button"
              className="upload"
              onClick={() => setUploadFile(uploadFile ? null : 'فایل.pdf')}
            >
              <Icon name="paperclip" />
              <div>
                <strong>{uploadFile ? 'تغییر فایل' : 'افزودن فایل'}</strong>
                <span>{uploadFile || 'PDF، ویدیو، تصویر یا صدا'}</span>
              </div>
              <Icon name={uploadFile ? 'check' : 'plus'} />
            </button>
          </div>
          <div className="group-grade-footer">
            <button type="button" className="secondary" onClick={() => setUploadOpen(false)}>انصراف</button>
            <button type="button" className="primary" onClick={submitUpload}>ذخیره در پوشه</button>
          </div>
        </div>
      </div>
    )}

    <SaveToFolderSheet
      open={pickFolderOpen}
      onClose={() => { setPickFolderOpen(false); setCreateOpen(false); setFolderName('') }}
      onSaved={(name) => {
        setToast(`در پوشه «${name}» ذخیره شد`)
        setTimeout(() => setToast(null), 1600)
      }}
    />
    {toast && <div className="toast">{toast}</div>}
  </div>
}

function Assignments({ navigate, goBack, role = 'teacher' }: { navigate: (s: Screen) => void; goBack: () => void; role?: UserRole }) {
  const isStudent = role === 'student'
  const weekDays = [
    'شنبه',
    'یکشنبه',
    'دوشنبه',
    'سه‌شنبه',
    'چهارشنبه',
  ]

  const addDays = (date: Date, amount: number) => {
    const result = new Date(date)
    result.setDate(result.getDate() + amount)
    return result
  }

  const getSaturday = (date: Date) => {
    const result = new Date(date)
    const offset = (result.getDay() + 1) % 7
    result.setDate(result.getDate() - offset)
    result.setHours(12, 0, 0, 0)
    return result
  }

  const toInputDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      day: 'numeric',
      month: 'long',
    }).format(date)

  const [selectedDate, setSelectedDate] = useState(() => new Date())
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')

  const searchQuery = query.trim()
  const closeSearch = () => {
    setSearchOpen(false)
    setQuery('')
  }

  const weekStart = getSaturday(selectedDate)
  const weekDates = weekDays.map((_, index) =>
    addDays(weekStart, index)
  )
  const weekEnd = weekDates[4]

  const data: {
    t: string
    day: number
    m: string
    s: string
    color: string
    subject: string
  }[] = [
    { t: 'تمرین فصل سوم', day: 2, m: 'مهلت: دوشنبه، ۲۰:۰۰', s: '۰ از ۲۸ تحویل', color: 'green', subject: 'علوم تجربی' },
    { t: 'گزارش آزمایش فشار هوا', day: 4, m: 'مهلت: چهارشنبه، ۱۸:۰۰', s: '۱۲ از ۲۸ تحویل', color: 'blue', subject: 'علوم تجربی' },
    { t: 'پروژه نمودار چرخه آب', day: 0, m: 'شروع: شنبه، ۰۹:۰۰', s: 'منتشر نشده', color: 'orange', subject: 'علوم تجربی' },
    { t: 'تمرین فصل دوم', day: 1, m: 'پایان: یکشنبه، ۲۰:۰۰', s: '۲۶ از ۲۸ تحویل', color: 'purple', subject: 'علوم تجربی' },
    { t: 'تکلیف کلاسی اول', day: 3, m: 'مهلت: سه‌شنبه، ۱۸:۰۰', s: '۱۰ از ۲۸ تحویل', color: 'mint', subject: 'علوم تجربی' },
    { t: 'تمرین معادله درجه دوم', day: 1, m: 'مهلت: یکشنبه، ۲۱:۰۰', s: '۸ از ۲۵ تحویل', color: 'blue', subject: 'ریاضی' },
    { t: 'مسائل هندسه فصل ۴', day: 3, m: 'مهلت: سه‌شنبه، ۱۹:۰۰', s: '۱۵ از ۲۵ تحویل', color: 'purple', subject: 'ریاضی' },
    { t: 'آزمونک جمع و تفریق اعداد صحیح', day: 0, m: 'شروع: شنبه، ۱۰:۰۰', s: 'منتشر نشده', color: 'green', subject: 'ریاضی' },
    { t: 'انشا: توصیف یک روز بارانی', day: 2, m: 'مهلت: دوشنبه، ۱۸:۰۰', s: '۵ از ۲۸ تحویل', color: 'orange', subject: 'فارسی' },
    { t: 'تمرین املا و دیکته', day: 4, m: 'مهلت: چهارشنبه، ۱۷:۰۰', s: '۲۰ از ۲۸ تحویل', color: 'mint', subject: 'فارسی' },
    { t: 'ترجمه درس سوم', day: 1, m: 'مهلت: یکشنبه، ۲۰:۰۰', s: '۱۱ از ۲۲ تحویل', color: 'blue', subject: 'عربی' },
    { t: 'تمرین صرف و نحو', day: 3, m: 'مهلت: سه‌شنبه، ۲۱:۰۰', s: '۷ از ۲۲ تحویل', color: 'purple', subject: 'عربی' },
  ]

  const ctxSubject = assignmentContext?.subject || ''
  const baseData = ctxSubject ? data.filter(item => item.subject === ctxSubject) : data
  const filteredData = searchQuery
    ? baseData.filter(item =>
        item.t.includes(searchQuery) ||
        item.subject.includes(searchQuery) ||
        item.m.includes(searchQuery)
      )
    : baseData

  return (
   <div className="screen inner-screen">
      <SubHeader
        screen="assignments"
        back={goBack}
        title={ctxSubject ? `تکالیف ${ctxSubject}` : undefined}
        subtitle={ctxSubject ? `${ctxSubject} · این هفته` : undefined}
        showSearchBtn
        onSearchClick={() => setSearchOpen(true)}
        searchOpen={searchOpen}
        searchValue={query}
        onSearchChange={setQuery}
        onSearchClose={closeSearch}
        searchPlaceholder="جست‌وجو در تکالیف..."
      />

      <main className="inner-content">
        <div className="assignment-week-navigation">
          <button
            type="button"
            className="assignment-week-arrow"
            onClick={() =>
              setSelectedDate(addDays(weekStart, -7))
            }
          >
            <span>‹</span>
            <small>هفته قبل</small>
          </button>

          <label className="assignment-date-picker">
            <span className="assignment-date-icon">
              <Icon name="calendar" />
            </span>

            <span className="assignment-date-text">
              <strong>
                {formatDate(weekStart)} تا {formatDate(weekEnd)}
              </strong>
              <small>برای انتخاب تاریخ کلیک کنید</small>
            </span>

            <span className="assignment-date-chevron">⌄</span>

            <input
              type="date"
              value={toInputDate(selectedDate)}
              onChange={(e) => {
                if (e.target.value) {
                  const [year, month, day] =
                    e.target.value.split('-').map(Number)

                  setSelectedDate(
                    new Date(year, month - 1, day, 12)
                  )
                }
              }}
              aria-label="انتخاب تاریخ"
            />
          </label>

          <button
            type="button"
            className="assignment-week-arrow"
            onClick={() =>
              setSelectedDate(addDays(weekStart, 7))
            }
          >
            <span>›</span>
            <small>هفته بعد</small>
          </button>
        </div>

        <div className="assignment-week-list">
          {weekDays.map((day, index) => {
            const items = filteredData.filter(
              item => item.day === index
            )

            if (searchQuery && !items.length) return null

            return (
              <section className="assignment-day-section" key={day}>
                <div className="assignment-day-title">
                  <strong>{day}</strong>
                  <span>{formatDate(weekDates[index])}</span>
                  <span className="assignment-day-count">
                    {fa(items.length)} مورد
                  </span>
                </div>

                {items.length ? (
                  items.map(item => (
                    <button
                      className="resource"
                      key={`${item.subject}-${item.t}`}
                      onClick={() => navigate('assignment')}
                    >
                      <span className={`resource-icon ${item.color}`}>
                        <Icon name="book" />
                      </span>

                      <div>
                        <strong>{item.t}</strong>
                        <small>گروه درسی: {item.subject} · {item.m}</small>
                        <span>{isStudent
                          ? (item.s.includes('منتشر')
                              ? 'هنوز شروع نشده'
                              : item.s.startsWith('۰') || item.s.startsWith('0')
                                ? 'ارسال نشده'
                                : item.s.includes('۲۶') || item.s.includes('۲۸')
                                  ? 'ارسال شده · مشاهده بازخورد'
                                  : 'در انتظار بازخورد')
                          : item.s}</span>
                      </div>

                      <Icon name="chevron" />
                    </button>
                  ))
                ) : (
                  <div className="assignment-day-empty">
                    {isStudent ? 'تکلیفی برای این روز ندارید.' : 'تکلیفی برای این روز ثبت نشده است.'}
                  </div>
                )}
              </section>
            )
          })}
        </div>

        {searchQuery && !filteredData.length && (
          <div className="empty compact-empty">
            <Icon name="search" size={32} />
            <strong>موردی پیدا نشد</strong>
            <span>عبارت دیگری را جست‌وجو کنید.</span>
          </div>
        )}
      </main>

      {!isStudent && (
        <button
          className="fab"
          aria-label="ایجاد تکلیف"
          onClick={() => navigate('assignment-create')}
        >
          <Icon name="plus" />
        </button>
      )}
    </div>
  )
}

const students: string[] = ['علی احمدی', 'فاطمه محمدی', 'آراد حسینی', 'یسنا کریمی', 'امیررضا صالحی', 'مبینا اکبری']

function Assignment({ goBack, role = 'teacher' }: { navigate: (s: Screen) => void; goBack: () => void; role?: UserRole }) {
  const isStudent = role === 'student'
  const [meta, setMeta] = useState({
    title: 'تمرین فصل سوم',
    description: 'لطفاً سوالات صفحهٔ ۴۲ تا ۴۵ کتاب علوم را حل کنید و فایل پاسخ را ارسال نمایید. در صورت نیاز می‌توانید توضیح صوتی هم ضمیمه کنید.',
    deadline: 'دوشنبه، ساعت ۲۰:۰۰',
    fileName: 'تمرین فصل سوم علوم.pdf',
    fileSize: '۲٫۴ مگابایت',
    voice: '۰:۳۷',
  })
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(meta)
  const [toast, setToast] = useState<string | null>(null)

  const [textAnswer, setTextAnswer] = useState('')
  const [attachments, setAttachments] = useState<{ type: 'file' | 'image' | 'voice'; label: string }[]>([])
  const [recording, setRecording] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [editingSubmission, setEditingSubmission] = useState(false)
  const [submittedAt, setSubmittedAt] = useState<{ date: string; time: string; ts: number } | null>(null)
  const [delayLabel, setDelayLabel] = useState<string | null>(null)
  const assignmentDeadlineTs = useRef(Date.now() - 90 * 60 * 1000).current
  const [teacherViewed, setTeacherViewed] = useState(false)
  const [studentSearch, setStudentSearch] = useState('')
  const [teacherFeedback] = useState({
    text: 'پاسخ خوب بود؛ فقط بخش سوم را کامل‌تر بنویس.',
    score: '۱۷',
    voice: false,
  })

  const initialRows = students.map((name, i) => ({
    name,
    status: i % 3 === 0 ? 'انتظار' : 'تحویل',
    file: i % 3 === 0 ? '' : `پاسخ_${name.split(' ')[0]}.pdf`,
    textAnswer: i % 3 === 0 ? '' : `پاسخ ${name.split(' ')[0]} برای تمرین فصل سوم. سوالات صفحه ۴۲ تا ۴۵ حل شده است.`,
    voiceAnswer: i % 3 === 0 ? '' : '۰:۲۴',
    score: '',
    feedback: '',
    hasVoiceFeedback: false,
  }))

  const [rows, setRows] = useState(initialRows)
  const [activeVoice, setActiveVoice] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [groupSheet, setGroupSheet] = useState(false)
  const [maxScore, setMaxScore] = useState('20')
  const [groupScore, setGroupScore] = useState('')
  const [feedbackIndex, setFeedbackIndex] = useState<number | null>(null)
  const [feedbackDraft, setFeedbackDraft] = useState('')
  const [feedbackScoreKind, setFeedbackScoreKind] = useState<'کمی' | 'کیفی'>('کمی')
  const [feedbackQuantScale, setFeedbackQuantScale] = useState('۲۰/۰')
  const [feedbackScoreValue, setFeedbackScoreValue] = useState('')
  const qualitativeFeedbackOptions = ['خیلی خوب', 'نیاز به تلاش بیشتر']
  const feedbackMaxScore = feedbackQuantScale.startsWith('custom:')
    ? Number(feedbackQuantScale.slice(7)) || 20
    : feedbackQuantScale.startsWith('۲۰') ? 20 : feedbackQuantScale.startsWith('۱۰') ? 10 : 5

  const submittedCount = rows.filter(r => r.status === 'تحویل').length
  const updateRow = (index: number, patch: Partial<(typeof rows)[0]>) => {
    setRows(prev => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)))
  }

  const exportZip = () => {
    setToast('در حال آماده‌سازی فایل ZIP...')
    setTimeout(() => setToast('خروجی ZIP آماده شد (شبیه‌سازی)'), 900)
    setTimeout(() => setToast(null), 2200)
  }

  const openGroupGrade = () => {
    setGroupScore('')
    setGroupSheet(true)
  }

  const applyGroupGrade = () => {
    const maxN = Number(toEn(maxScore).replace(/[^\d]/g, '')) || 20
    const scoreN = Number(toEn(groupScore).replace(/[^\d]/g, ''))
    const delivered = rows.filter(r => r.status === 'تحویل')
    if (delivered.length === 0) {
      setToast('هنوز کسی تحویل نداده است')
      setTimeout(() => setToast(null), 1400)
      return
    }
    if (!groupScore.trim() || Number.isNaN(scoreN)) {
      setToast('نمره را وارد کنید')
      setTimeout(() => setToast(null), 1400)
      return
    }
    if (scoreN > maxN) {
      setToast(`نمره نمی‌تواند بیشتر از ${fa(maxN)} باشد`)
      setTimeout(() => setToast(null), 1600)
      return
    }
    const value = String(scoreN)
    setRows(prev => prev.map(r => (
      r.status === 'تحویل' ? { ...r, score: value } : r
    )))
    setGroupSheet(false)
    setSaving(true)
    setToast(`نمره ${fa(value)} از ${fa(maxN)} برای ${fa(delivered.length)} نفر ثبت شد`)
    setTimeout(() => {
      setSaving(false)
      setToast(null)
    }, 1600)
  }

  const openEdit = () => {
    setDraft(meta)
    setEditing(true)
  }

  const saveEdit = () => {
    setMeta({ ...draft })
    setEditing(false)
    setToast('تغییرات تکلیف ذخیره شد')
    setTimeout(() => setToast(null), 1400)
  }

  const addAttachment = (type: 'file' | 'image' | 'voice') => {
    const labels = {
      file: 'پاسخ_تمرین.pdf',
      image: 'عکس_پاسخ.jpg',
      voice: 'پیام_صوتی.m4a',
    }
    setAttachments(prev => [...prev, { type, label: labels[type] }])
    setToast(type === 'voice' ? 'پیام صوتی اضافه شد' : 'فایل اضافه شد')
    setTimeout(() => setToast(null), 1200)
    if (type === 'voice') setRecording(false)
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const formatDelay = (ms: number) => {
    if (ms <= 0) return null
    const totalMin = Math.floor(ms / 60000)
    const hours = Math.floor(totalMin / 60)
    const mins = totalMin % 60
    if (hours > 0 && mins > 0) return `${fa(hours)} ساعت و ${fa(mins)} دقیقه تأخیر`
    if (hours > 0) return `${fa(hours)} ساعت تأخیر`
    return `${fa(mins)} دقیقه تأخیر`
  }

  const submitHomework = () => {
    if (!textAnswer.trim() && attachments.length === 0) {
      setToast('متن یا فایل پاسخ را اضافه کنید')
      setTimeout(() => setToast(null), 1400)
      return
    }
    const now = new Date()
    const shamsi = nowShamsi()
    const ts = now.getTime()
    setSubmittedAt({ date: shamsi.date, time: shamsi.time, ts })
    setDelayLabel(formatDelay(ts - assignmentDeadlineTs))
    setSubmitted(true)
    setEditingSubmission(false)
    setTeacherViewed(false)
    setToast(editingSubmission ? 'ارسال به‌روزرسانی شد' : 'تکلیف با موفقیت ارسال شد')
    setTimeout(() => setToast(null), 1600)
    setTimeout(() => setTeacherViewed(true), 3500)
  }

  const deleteSubmission = () => {
    setSubmitted(false)
    setSubmittedAt(null)
    setDelayLabel(null)
    setEditingSubmission(false)
    setTeacherViewed(false)
    setTextAnswer('')
    setAttachments([])
    setToast('ارسال تکلیف حذف شد')
    setTimeout(() => setToast(null), 1400)
  }

  if (isStudent) {
    const showForm = !submitted || editingSubmission
    return <div className="screen inner-screen">
      <SubHeader screen="assignment" back={goBack} title={meta.title} subtitle="علوم تجربی · کلاس ۹۰۱" rightIcon="download" rightLabel="دانلود تکلیف" onRightClick={() => setToast('دانلود تکلیف شروع شد')} />
      <main className="inner-content form-page">
        <div className="display-banner">
          <span className="display-banner-icon"><Icon name="book" /></span>
          <div>
            <strong>{meta.title}</strong>
            <small>علوم تجربی · کلاس ۹۰۱ · مهلت {meta.deadline}</small>
          </div>
        </div>

        <section className={`sa-status-card ${submitted ? 'is-sent' : 'is-pending'}`}>
          <div className="sa-status-top">
            <div className={`sa-status-badge ${submitted ? 'ok' : 'wait'}`}>
              <Icon name={submitted ? 'check' : 'clock'} size={16} />
              <span>{submitted ? 'ارسال‌شده' : 'ارسال نشده'}</span>
            </div>
            {submitted && submittedAt && (
              <div className="sa-status-time">
                <strong>{submittedAt.time}</strong>
                <small>{submittedAt.date}</small>
              </div>
            )}
          </div>
          {!submitted && (
            <p className="sa-status-hint">پاسخ خود را قبل از مهلت ارسال کنید.</p>
          )}
          {submitted && submittedAt && !editingSubmission && (
            <div className="sa-status-stats">
              <div className="sa-stat">
                <small>تأخیر</small>
                <strong className={delayLabel ? 'late-text' : 'on-time-text'}>{delayLabel ?? 'بدون تأخیر'}</strong>
              </div>
              <div className="sa-stat">
                <small>معلم</small>
                <strong className={teacherViewed ? 'on-time-text' : 'wait-text'}>
                  {teacherViewed ? 'مشاهده کرده' : 'هنوز ندیده'}
                </strong>
              </div>
            </div>
          )}
          {submitted && !editingSubmission && (
            <div className="sa-status-actions">
              <button type="button" onClick={() => setEditingSubmission(true)}>
                <Icon name="pencil" size={15} /> ویرایش
              </button>
              <button type="button" className="danger" onClick={deleteSubmission}>
                <Icon name="close" size={15} /> حذف
              </button>
            </div>
          )}
        </section>

        {submitted && !editingSubmission && (
          <section className="sa-panel">
            <div className="sa-panel-head">
              <strong>بازخورد معلم</strong>
              <span className={`sa-chip ${teacherViewed ? 'ok' : 'wait'}`}>
                {teacherViewed ? 'ثبت‌شده' : 'منتظر بررسی'}
              </span>
            </div>
            {teacherViewed ? (
              <div className="sa-feedback">
                <div className="sa-score">
                  <span>نمره</span>
                  <b>{fa(teacherFeedback.score)}<small> از ۲۰</small></b>
                </div>
                <p>{teacherFeedback.text}</p>
              </div>
            ) : (
              <div className="sa-waiting">
                <Icon name="bell" size={22} />
                <div>
                  <strong>هنوز بازخوردی نیست</strong>
                  <span>بعد از مشاهده معلم، نمره و نظر اینجا می‌آید.</span>
                </div>
              </div>
            )}
          </section>
        )}

        <section className="sa-panel">
          <div className="sa-panel-head">
            <strong>توضیحات معلم</strong>
          </div>
          <p className="sa-desc">{meta.description}</p>
        </section>

        <section className="sa-panel">
          <div className="sa-panel-head">
            <strong>فایل‌های معلم</strong>
            <span>۲ مورد</span>
          </div>
          <div className="sa-file-list">
            <button type="button" className="resource" onClick={() => { setToast('دانلود شروع شد'); setTimeout(() => setToast(null), 1200) }}>
              <span className="resource-icon green"><Icon name="file" /></span>
              <div>
                <strong>{meta.fileName}</strong>
                <small>فایل ضمیمه</small>
                <span>{meta.fileSize} · دانلود</span>
              </div>
              <Icon name="chevron" />
            </button>
            <button type="button" className="resource">
              <span className="resource-icon blue"><Icon name="mic" /></span>
              <div>
                <strong>توضیح صوتی معلم</strong>
                <small>پیام صوتی راهنما</small>
                <span>مدت: {meta.voice}</span>
              </div>
              <Icon name="chevron" />
            </button>
          </div>
        </section>

        {showForm && (
          <section className="sa-panel">
            <div className="sa-panel-head">
              <strong>{editingSubmission ? 'ویرایش پاسخ' : 'پاسخ شما'}</strong>
              <span>{attachments.length ? `${fa(attachments.length)} پیوست` : 'بدون پیوست'}</span>
            </div>

            <label className="field">
              <span>پاسخ متنی</span>
              <textarea
                rows={4}
                placeholder="توضیح یا پاسخ خود را بنویسید..."
                value={textAnswer}
                onChange={e => setTextAnswer(e.target.value)}
              />
            </label>

            <div className="sa-upload-stack">
              <button type="button" className="upload" onClick={() => addAttachment('file')}>
                <Icon name="paperclip" />
                <div>
                  <strong>افزودن فایل</strong>
                  <span>PDF، ورد یا فایل متنی</span>
                </div>
                <Icon name="plus" />
              </button>
              <button
                type="button"
                className={`upload ${recording ? 'upload-recording' : ''}`}
                onClick={() => {
                  if (recording) addAttachment('voice')
                  else setRecording(true)
                }}
              >
                <Icon name="mic" />
                <div>
                  <strong>{recording ? 'در حال ضبط... توقف و ذخیره' : 'افزودن پیام صوتی'}</strong>
                  <span>{recording ? 'برای ذخیره دوباره لمس کنید' : 'صوت کوتاه به‌عنوان پاسخ'}</span>
                </div>
                <Icon name={recording ? 'check' : 'plus'} />
              </button>
            </div>

            {attachments.length > 0 && (
              <div className="student-attach-list">
                {attachments.map((a, i) => (
                  <div className="resource student-attach-row" key={`${a.label}-${i}`}>
                    <span className={`resource-icon ${a.type === 'voice' ? 'blue' : a.type === 'image' ? 'orange' : 'green'}`}>
                      <Icon name={a.type === 'voice' ? 'mic' : a.type === 'image' ? 'image' : 'file'} />
                    </span>
                    <div>
                      <strong>{a.label}</strong>
                      <small>{a.type === 'voice' ? 'پیام صوتی' : a.type === 'image' ? 'تصویر' : 'فایل'}</small>
                    </div>
                    <button type="button" className="attach-remove" aria-label="حذف" onClick={() => removeAttachment(i)}>
                      <Icon name="close" size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {submitted && !editingSubmission && (
          <section className="sa-panel">
            <div className="sa-panel-head">
              <strong>پاسخ ارسال‌شده</strong>
            </div>
            {textAnswer.trim() ? (
              <p className="sa-desc">{textAnswer}</p>
            ) : null}
            {attachments.length > 0 && (
              <div className="student-attach-list">
                {attachments.map((a, i) => (
                  <div className="resource student-attach-row" key={`sent-${a.label}-${i}`}>
                    <span className={`resource-icon ${a.type === 'voice' ? 'blue' : a.type === 'image' ? 'orange' : 'green'}`}>
                      <Icon name={a.type === 'voice' ? 'mic' : a.type === 'image' ? 'image' : 'file'} />
                    </span>
                    <div>
                      <strong>{a.label}</strong>
                      <small>{a.type === 'voice' ? 'پیام صوتی' : a.type === 'image' ? 'تصویر' : 'فایل'}</small>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!textAnswer.trim() && attachments.length === 0 && (
              <div className="sa-waiting">
                <div>
                  <strong>محتوایی ثبت نشده</strong>
                </div>
              </div>
            )}
          </section>
        )}
      </main>
      <div className="sticky-action">
        {showForm ? (
          <>
            {editingSubmission && (
              <button className="secondary" onClick={() => setEditingSubmission(false)}>انصراف</button>
            )}
            <button onClick={submitHomework}>
              {editingSubmission ? 'ذخیره و ارسال مجدد' : 'ارسال تکلیف'}
            </button>
          </>
        ) : (
          <button className="secondary" onClick={goBack}>بازگشت</button>
        )}
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  }

  if (editing) {
    return <div className="screen inner-screen">
      <header className="sub-header">
        <IconButton icon="chevron" label="بازگشت" onClick={() => setEditing(false)} />
        <div><strong>ویرایش تکلیف</strong><span>علوم تجربی · کلاس ۹۰۱</span></div>
        <IconButton icon="check" label="ذخیره" onClick={saveEdit} />
      </header>
      <main className="inner-content form-page">
        <label className="field"><span>عنوان تکلیف</span>
          <input type="text" value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} />
        </label>
        <label className="field"><span>توضیحات</span>
          <textarea rows={4} value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })} />
        </label>
        <label className="field"><span>مهلت تحویل</span>
          <div className="two-fields">
            <select aria-label="تاریخ" onChange={e => setDraft(d => ({ ...d, deadline: e.target.value }))}>
              <option value="">تاریخ</option>
              {reportDateRange().map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <input type="time" onChange={e => setDraft(d => ({ ...d, deadline: (d.deadline || '') + ' ' + e.target.value }))} />
          </div>
        </label>
        <button type="button" className="upload">
          <Icon name="paperclip" />
          <div><strong>تغییر فایل ضمیمه</strong><span>PDF، تصویر یا فایل متنی</span></div>
          <Icon name="plus" />
        </button>
        <button type="button" className="upload">
          <Icon name="mic" />
          <div><strong>تغییر توضیح صوتی</strong><span>ضبط یا جایگزینی پیام صوتی</span></div>
          <Icon name="plus" />
        </button>
      </main>
      <div className="sticky-action">
        <button className="secondary" onClick={() => setEditing(false)}>انصراف</button>
        <button onClick={saveEdit}>ذخیره تغییرات</button>
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  }

  return <div className="screen inner-screen">
    <SubHeader
      screen="assignment"
      back={goBack}
      title={meta.title}
      subtitle="علوم تجربی · کلاس ۹۰۱"
      rightIcon="pencil"
      rightLabel="ویرایش"
      onRightClick={openEdit}
    />
    <main className="inner-content">
      <section className="assignment-detail-card">
        <div className="section-heading" style={{ margin: 0 }}>
          <strong>توضیحات تکلیف</strong>
        </div>
        <p className="assignment-desc">{meta.description}</p>

        <div className="assignment-assets">
          <button type="button" className="asset-chip">
            <Icon name="file" size={16} />
            <span>
              <strong>{meta.fileName}</strong>
              <small>{meta.fileSize}</small>
            </span>
          </button>
          <button type="button" className="asset-chip voice-chip">
            <Icon name="mic" size={16} />
            <span>
              <strong>توضیح صوتی معلم</strong>
              <small>{meta.voice}</small>
            </span>
          </button>
        </div>

        <div className="assign-status-box">
          <div className="assign-ring-wrap">
            <div
              className="assign-ring"
              style={{ ['--pct' as string]: `${Math.round((submittedCount / students.length) * 100)}%` }}
            >
              <div className="assign-ring-inner">
                <strong>{fa(submittedCount)}</strong>
                <small>از {fa(students.length)}</small>
              </div>
            </div>
            <div className="assign-ring-label">
              <strong>وضعیت تحویل</strong>
              <div className="assign-thin-bar">
                <i style={{ width: `${Math.round((submittedCount / students.length) * 100)}%` }} />
              </div>
              <span>{fa(submittedCount)} از {fa(students.length)} نفر</span>
            </div>
          </div>
          <div className="assign-deadline-banner">
            <span className="assign-deadline-icon"><Icon name="clock" size={18} /></span>
            <div>
              <strong>مهلت تحویل</strong>
              <small>{meta.deadline}</small>
            </div>
          </div>
        </div>

        <button type="button" className="export-zip-btn" onClick={exportZip}>
          <Icon name="file" size={16} />
          خروجی همه فایل‌ها (ZIP)
        </button>
      </section>

      <div className="section-heading student-search-heading" style={{ marginTop: 16 }}>
        <input
          type="search"
          className="student-search-input"
          placeholder="جست‌وجو در دانش‌آموزان..."
          value={studentSearch}
          onChange={e => setStudentSearch(e.target.value)}
        />
        <button type="button" className="heading-action-btn" onClick={openGroupGrade}>
          ثبت نمره گروهی
        </button>
      </div>

      <div className="assignment-table-wrap">
        <table className="assignment-table">
          <thead>
            <tr>
              <th>دانش‌آموز</th>
              <th>وضعیت</th>
              <th>نمره</th>
              <th>مشاهده پاسخ</th>
              <th>دانلود سریع</th>
            </tr>
          </thead>
          <tbody>
            {rows.filter(row => !studentSearch.trim() || row.name.includes(studentSearch.trim())).map((row, i) => {
              const canFeedback = row.status === 'تحویل'
              return (
              <tr key={row.name}>
                <td>
                  <button
                    type="button"
                    className="assignment-student-cell student-cell-open"
                    disabled={!canFeedback}
                    onClick={() => {
                      setFeedbackIndex(i)
                      setFeedbackDraft(row.feedback)
                    }}
                    aria-label={`مشاهده پاسخ ${row.name}`}
                  >
                    <div className="student-avatar">{row.name[0]}</div>
                    <strong>{row.name}</strong>
                  </button>
                </td>
                <td>
                  <span className={`status-pill ${row.status === 'تحویل' ? 'ok' : 'wait'}`}>{row.status}</span>
                </td>
                <td>
                  <input
                    className="score-input compact"
                    inputMode="numeric"
                    placeholder={fa(maxScore || '20')}
                    disabled={!canFeedback}
                    value={row.score ? fa(row.score) : ''}
                    onChange={e => updateRow(i, { score: toEn(e.target.value).replace(/[^\d]/g, '') })}
                  />
                </td>
                <td>
                  {canFeedback ? (
                    <button
                      type="button"
                      className="table-action-btn view"
                      onClick={() => {
                        setFeedbackIndex(i)
                        setFeedbackDraft(row.feedback)
                      }}
                    >
                      مشاهده
                    </button>
                  ) : (
                    <span className="muted-dash">—</span>
                  )}
                </td>
                <td>
                  {canFeedback ? (
                    <button
                      type="button"
                      className="table-action-btn view"
                      aria-label={`دانلود پاسخ ${row.name}`}
                      onClick={() => {
                        setToast(`دانلود پاسخ ${row.name} شروع شد`)
                        setTimeout(() => setToast(null), 1400)
                      }}
                    >
                      <Icon name="download" size={14} />
                    </button>
                  ) : (
                    <span className="muted-dash">—</span>
                  )}
                </td>
              </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </main>
    <div className="sticky-action">
      <button onClick={() => {
        setSaving(true)
        setToast('تغییرات ثبت شد')
        setTimeout(() => { setSaving(false); setToast(null) }, 1400)
      }} disabled={saving}>
        {saving ? <><Icon name="check" /> ثبت شد</> : 'ثبت تغییرات'}
      </button>
    </div>

    {groupSheet && (
      <div className="overlay group-grade-overlay" onClick={() => setGroupSheet(false)}>
        <div className="bottom-sheet group-grade-sheet" onClick={e => e.stopPropagation()}>
          <div className="sheet-handle" />
          <div className="sheet-title">
            <div>
              <strong>ثبت نمره گروهی</strong>
              <span>فقط برای {fa(submittedCount)} نفر تحویل‌داده</span>
            </div>
            <IconButton icon="close" label="بستن" onClick={() => setGroupSheet(false)} />
          </div>
          <div className="group-grade-body">
            <label className="field">
              <span>حداکثر نمره</span>
              <input
                inputMode="numeric"
                value={maxScore ? fa(maxScore) : ''}
                placeholder="۲۰"
                onChange={e => setMaxScore(toEn(e.target.value).replace(/[^\d]/g, ''))}
              />
            </label>
            <label className="field">
              <span>نمره مشترک</span>
              <input
                inputMode="numeric"
                value={groupScore ? fa(groupScore) : ''}
                placeholder={`مثلاً ${fa(maxScore || '20')}`}
                onChange={e => setGroupScore(toEn(e.target.value).replace(/[^\d]/g, ''))}
              />
            </label>
            <p className="group-grade-hint">
              نمره فقط برای دانش‌آموزانی که وضعیت «تحویل» دارند ثبت می‌شود. بقیه بدون نمره می‌مانند.
            </p>
          </div>
          <div className="group-grade-footer">
            <button type="button" className="secondary" onClick={() => setGroupSheet(false)}>انصراف</button>
            <button type="button" className="primary" onClick={applyGroupGrade}>ثبت</button>
          </div>
        </div>
      </div>
    )}

    {feedbackIndex !== null && rows[feedbackIndex] && (() => {
      const row = rows[feedbackIndex]
      const deliveredIndexes = rows
        .map((r, i) => (r.status === 'تحویل' ? i : -1))
        .filter(i => i >= 0)
      const pos = deliveredIndexes.indexOf(feedbackIndex)
      const prevIdx = pos > 0 ? deliveredIndexes[pos - 1] : null
      const nextIdx = pos >= 0 && pos < deliveredIndexes.length - 1 ? deliveredIndexes[pos + 1] : null

      const studentFirstName = row.name.split(' ')[0]

      const goToStudent = (idx: number | null, opts?: { savedName?: string }) => {
        if (opts?.savedName) {
          setToast(`بازخوردی برای ${opts.savedName} ثبت شد`)
          setTimeout(() => setToast(null), 1800)
        }
        if (idx === null) {
          setFeedbackIndex(null)
          return
        }
        setFeedbackIndex(idx)
        setFeedbackDraft(rows[idx].feedback)
        setActiveVoice(null)
      }

      const saveCurrentFeedback = () => {
        updateRow(feedbackIndex, { feedback: feedbackDraft })
      }

      const saveFeedbackAndNext = () => {
        saveCurrentFeedback()
        if (nextIdx !== null) {
          goToStudent(nextIdx, { savedName: studentFirstName })
        } else {
          setToast(`بازخوردی برای ${studentFirstName} ثبت شد`)
          setTimeout(() => setToast(null), 1800)
          setFeedbackIndex(null)
        }
      }

      return (
      <div className="overlay group-grade-overlay" onClick={() => setFeedbackIndex(null)}>
        <div className="bottom-sheet student-answer-sheet" onClick={e => e.stopPropagation()}>
          <div className="sheet-handle" />

          <div className="student-answer-scroll">
            <div className="sap-hero">
              <button
                type="button"
                className="sap-nav-btn prev"
                aria-label="قبلی"
                disabled={prevIdx === null}
                onClick={() => goToStudent(prevIdx)}
              >
                قبلی
              </button>
              <div className="sap-hero-main">
                <div className="sap-avatar-wrap">
                  <img
                    className="sap-avatar-img"
                    src={`https://images.irantarh.com/pr:sharp/rs:fill:0:375:0/plain/s3:/uploads/designs/1401/07/25/ax-irani/41.jpg`}
                    alt={row.name}
                  />
                </div>
                <div className="sap-hero-text">
                  <strong>{row.name}</strong>
                  <small>علوم تجربی · کلاس ۹۰۱</small>
                </div>
              </div>
              <span className="sap-student-position">{fa(pos + 1)} از {fa(deliveredIndexes.length)}</span>
              <button
                type="button"
                className="sap-nav-btn next"
                aria-label="بعدی"
                disabled={nextIdx === null}
                onClick={() => {
                  saveCurrentFeedback()
                  goToStudent(nextIdx, { savedName: studentFirstName })
                }}
              >
                بعدی
              </button>
            </div>

            <div className="sap-section">
              <div className="sap-section-title">
                <Icon name="book" size={16} />
                <strong>پاسخ دانش‌آموز</strong>
              </div>
              {row.textAnswer ? (
                <p className="sap-text">{row.textAnswer}</p>
              ) : (
                <div className="sap-empty">متن پاسخ ثبت نشده</div>
              )}
              <div className="sap-assets">
                {row.file && (
                  <button type="button" className="sap-asset">
                    <span className="resource-icon green"><Icon name="file" size={18} /></span>
                    <div>
                      <strong>{row.file}</strong>
                      <small>فایل ارسالی · مشاهده</small>
                    </div>
                  </button>
                )}
                {row.voiceAnswer && (
                  <button type="button" className="sap-asset">
                    <span className="resource-icon blue"><Icon name="mic" size={18} /></span>
                    <div>
                      <strong>پیام صوتی</strong>
                      <small>مدت {row.voiceAnswer} · پخش</small>
                    </div>
                  </button>
                )}
              </div>
            </div>

            <div className="sap-section">
              <div className="sap-section-title">
                <Icon name="chat" size={16} />
                <strong>بازخورد معلم</strong>
              </div>
              <label className="field">
                <span>متن بازخورد</span>
                <textarea
                  rows={3}
                  placeholder="نظر خود را برای دانش‌آموز بنویسید..."
                  value={feedbackDraft}
                  onChange={e => setFeedbackDraft(e.target.value)}
                />
              </label>
              <button
                type="button"
                className={`sap-voice-btn ${row.hasVoiceFeedback || activeVoice === feedbackIndex ? 'active' : ''}`}
                onClick={() => {
                  if (activeVoice === feedbackIndex) {
                    setActiveVoice(null)
                    updateRow(feedbackIndex, { hasVoiceFeedback: true })
                    setToast('بازخورد صوتی ذخیره شد')
                    setTimeout(() => setToast(null), 1200)
                  } else {
                    setActiveVoice(feedbackIndex)
                  }
                }}
              >
                <Icon name="mic" size={18} />
                <span>
                  {activeVoice === feedbackIndex
                    ? 'در حال ضبط... برای توقف بزنید'
                    : row.hasVoiceFeedback
                      ? 'بازخورد صوتی ثبت شده'
                      : 'ضبط بازخورد صوتی'}
                </span>
              </button>
            </div>

            {!isStudent && (
              <div className="sap-section">
                <div className="score-kind-card" style={{ marginBottom: 0 }}>
                  <div className="score-kind-label">نوع نمره</div>
                  <div className="score-kind-tabs">
                    {(['کمی', 'کیفی'] as const).map(k => (
                      <button
                        key={k}
                        type="button"
                        className={feedbackScoreKind === k ? 'active' : ''}
                        onClick={() => {
                          setFeedbackScoreKind(k)
                          setFeedbackScoreValue('')
                        }}
                      >
                        {k === 'کمی' ? 'عددی' : 'توصیفی'}
                      </button>
                    ))}
                  </div>
                  <div className="score-kind-hint">
                    {feedbackScoreKind === 'کمی' && (
                      <div className="score-kind-scales">
                        <span className="chips-prefix">پیش‌فرض:</span>
                        {['۲۰/۰', '۱۰/۰', '۵/۰'].map(s => (
                          <button
                            key={s}
                            type="button"
                            className={feedbackQuantScale === s ? 'active' : ''}
                            onClick={() => setFeedbackQuantScale(s)}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                    {feedbackScoreKind === 'کیفی' && (
                      <span>خیلی خوب / نیاز به تلاش بیشتر</span>
                    )}
                  </div>

                  {feedbackScoreKind === 'کمی' && (
                    <label className="field" style={{ marginTop: 10, marginBottom: 0 }}>
                      <span>نمره (از {fa(feedbackMaxScore)})</span>
                      <input
                        inputMode="numeric"
                        placeholder={fa(feedbackMaxScore)}
                        value={feedbackScoreValue ? fa(feedbackScoreValue) : (row.score ? fa(row.score) : '')}
                        onChange={e => {
                          const raw = toEn(e.target.value).replace(/[^\d]/g, '')
                          if (raw && Number(raw) > feedbackMaxScore) return
                          setFeedbackScoreValue(raw)
                          updateRow(feedbackIndex, { score: raw })
                        }}
                      />
                    </label>
                  )}
                  {feedbackScoreKind === 'کیفی' && (
                    <div className="group-qual-options" style={{ marginTop: 10 }}>
                      {qualitativeFeedbackOptions.map(o => (
                        <button
                          key={o}
                          type="button"
                          className={(feedbackScoreValue || row.score) === o ? 'active' : ''}
                          onClick={() => {
                            setFeedbackScoreValue(o)
                            updateRow(feedbackIndex, { score: o })
                          }}
                        >
                          {o}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="student-answer-footer">
            <button type="button" className="secondary" onClick={() => setFeedbackIndex(null)}>بستن</button>
            <button type="button" className="primary" onClick={saveFeedbackAndNext}>ثبت</button>
          </div>
        </div>
      </div>
      )
    })()}

    {toast && <div className="toast">{toast}</div>}
  </div>
}

const VOICE_WAVE_BARS = [7, 14, 20, 11, 17, 9, 22, 13, 18, 8, 15, 21, 10, 16, 12, 19]
const MAX_VOICE_SECONDS = 60
const TEACHER_SUBJECTS = ['علوم تجربی', 'ریاضی', 'ادبیات فارسی', 'عربی', 'مطالعات اجتماعی', 'زبان انگلیسی']
const TEACHER_CLASSES = ['کلاس ۹۰۱', 'کلاس ۹۰۲', 'کلاس ۹۰۳', 'کلاس ۸۰۱', 'کلاس ۸۰۲']

function AssignmentCreate({ goBack }: { navigate?: (s: Screen) => void; goBack: () => void }) {
  const [published, setPublished] = useState(false)
  const [subject, setSubject] = useState(assignmentContext?.subject || '')
  const [klass, setKlass] = useState(assignmentContext?.klass || '')
  const [recording, setRecording] = useState(false)
  const [recSeconds, setRecSeconds] = useState(0)
  const [voiceNote, setVoiceNote] = useState<{ url: string | null; seconds: number } | null>(null)
  const [playing, setPlaying] = useState(false)

  const recorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const voiceUrlRef = useRef<string | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const wantRecRef = useRef(false)
  const pendingSecondsRef = useRef(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const recTimerRef = useRef<number | null>(null)
  const playTimerRef = useRef<number | null>(null)

  const fmtTime = (s: number) => fa(`${Math.floor(s / 60)}:${String(Math.max(0, Math.floor(s)) % 60).padStart(2, '0')}`)

  const stopRecTimer = () => {
    if (recTimerRef.current !== null) { window.clearInterval(recTimerRef.current); recTimerRef.current = null }
  }
  const stopPlayTimer = () => {
    if (playTimerRef.current !== null) { window.clearTimeout(playTimerRef.current); playTimerRef.current = null }
  }
  const releaseStream = () => {
    const stream = streamRef.current
    if (stream) { stream.getTracks().forEach(t => t.stop()); streamRef.current = null }
  }
  const finishVoice = (seconds: number, url: string | null) => {
    if (voiceUrlRef.current && voiceUrlRef.current !== url) URL.revokeObjectURL(voiceUrlRef.current)
    voiceUrlRef.current = url
    pendingSecondsRef.current = 0
    setVoiceNote({ url, seconds: Math.max(1, Math.round(seconds)) })
    setRecording(false)
    setPlaying(false)
  }

  const startVoice = () => {
    stopPlayTimer()
    setPlaying(false)
    setRecSeconds(0)
    setRecording(true)
    chunksRef.current = []
    wantRecRef.current = true
    pendingSecondsRef.current = 0
    recTimerRef.current = window.setInterval(() => setRecSeconds(v => v + 1), 1000)

    try {
      if (navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== 'undefined') {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
          if (!wantRecRef.current) { stream.getTracks().forEach(t => t.stop()); return }
          streamRef.current = stream
          try {
            const recorder = new MediaRecorder(stream)
            recorder.ondataavailable = e => { if (e.data && e.data.size > 0) chunksRef.current.push(e.data) }
            recorder.onstop = () => {
              releaseStream()
              let url: string | null = null
              try {
                if (chunksRef.current.length) {
                  url = URL.createObjectURL(new Blob(chunksRef.current, { type: chunksRef.current[0].type || 'audio/webm' }))
                }
              } catch { url = null }
              finishVoice(pendingSecondsRef.current || 1, url)
            }
            recorder.start()
            recorderRef.current = recorder
          } catch {
            releaseStream()
            finishVoice(pendingSecondsRef.current || 1, null)
          }
        }).catch(() => { /* میکروفون در دسترس نیست؛ ضبط به‌صورت شبیه‌سازی ادامه پیدا می‌کند */ })
      }
    } catch { /* ignore */ }
  }

  const stopVoice = () => {
    stopRecTimer()
    if (!wantRecRef.current) return
    wantRecRef.current = false
    const seconds = Math.max(1, recSeconds)
    pendingSecondsRef.current = seconds
    setRecording(false)
    const recorder = recorderRef.current
    recorderRef.current = null
    if (recorder && recorder.state !== 'inactive') {
      try { recorder.stop() } catch { releaseStream(); finishVoice(seconds, null) }
    } else {
      releaseStream()
      finishVoice(seconds, null)
    }
  }

  useEffect(() => {
    if (recording && recSeconds >= MAX_VOICE_SECONDS) stopVoice()
  }, [recording, recSeconds])

  useEffect(() => () => {
    stopRecTimer()
    stopPlayTimer()
    wantRecRef.current = false
    const recorder = recorderRef.current
    if (recorder && recorder.state !== 'inactive') { try { recorder.stop() } catch { /* ignore */ } }
    releaseStream()
    if (voiceUrlRef.current) { URL.revokeObjectURL(voiceUrlRef.current); voiceUrlRef.current = null }
    const el = audioRef.current
    if (el) { try { el.pause() } catch { /* ignore */ } }
  }, [])

  const toggleVoicePlay = () => {
    if (!voiceNote) return
    const el = audioRef.current
    if (playing) {
      stopPlayTimer()
      if (el) { try { el.pause() } catch { /* ignore */ } }
      setPlaying(false)
      return
    }
    setPlaying(true)
    if (voiceNote.url && el) {
      try { el.currentTime = 0 } catch { /* ignore */ }
      const promise = el.play()
      if (promise && typeof promise.catch === 'function') promise.catch(() => { stopPlayTimer(); setPlaying(false) })
    } else {
      playTimerRef.current = window.setTimeout(() => setPlaying(false), voiceNote.seconds * 1000)
    }
  }

  const removeVoice = () => {
    stopPlayTimer()
    const el = audioRef.current
    if (el) { try { el.pause() } catch { /* ignore */ } }
    if (voiceUrlRef.current) { URL.revokeObjectURL(voiceUrlRef.current); voiceUrlRef.current = null }
    setVoiceNote(null)
    setPlaying(false)
  }

  return <div className="screen inner-screen">
    <SubHeader
      screen="assignment-create"
      back={goBack}
      rightIcon={null}
      subtitle={([subject, klass].filter(Boolean).join(' · ')) || undefined}
    />
    <main className="inner-content form-page">
      {!assignmentContext && (<label className="field">
        <span>درس و کلاس</span>
        <div className="two-fields">
          <select value={subject} onChange={e => setSubject(e.target.value)} aria-label="درس">
            <option value="">درس را انتخاب کنید</option>
            {TEACHER_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={klass} onChange={e => setKlass(e.target.value)} aria-label="کلاس">
            <option value="">کلاس را انتخاب کنید</option>
            {TEACHER_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </label>)}
      <FormField label="عنوان تکلیف" placeholder="مثلاً تمرین فصل سوم" />
      <label className="field"><span>توضیحات</span><textarea rows={4} placeholder="توضیحات و راهنمای انجام تکلیف..." /></label>

      <div className="voice-note-block">
        {!voiceNote && !recording && (
          <button type="button" className="upload" onClick={startVoice}>
            <Icon name="mic" />
            <div><strong>افزودن صوت</strong><span>توضیحات تکلیف را با صدا بگویید</span></div>
            <Icon name="plus" />
          </button>
        )}

        {recording && (
          <button type="button" className="upload upload-recording" onClick={stopVoice}>
            <Icon name="mic" />
            <div><strong>در حال ضبط... {fmtTime(recSeconds)}</strong><span>برای پایان و ذخیره بزنید</span></div>
            <Icon name="check" />
          </button>
        )}

        {voiceNote && (
          <div className="voice-note-row">
            <button type="button" className="voice-note-play" aria-label={playing ? 'توقف پخش صوت' : 'پخش صوت'} onClick={toggleVoicePlay}>
              <Icon name={playing ? 'pause' : 'play'} size={15} />
            </button>
            <div className="voice-note-info">
              <strong>صوت توضیحات</strong>
              <small>{fmtTime(voiceNote.seconds)}</small>
            </div>
            <div className={`voice-wave ${playing ? 'playing' : ''}`}>
              {VOICE_WAVE_BARS.map((h, i) => <i key={i} style={{ height: h, animationDelay: `${(i % 7) * 0.08}s` }} />)}
            </div>
            <button type="button" className="attach-remove" aria-label="حذف صوت" onClick={removeVoice}>
              <Icon name="close" size={16} />
            </button>
            {voiceNote.url && (
              <audio
                ref={audioRef}
                src={voiceNote.url}
                style={{ display: 'none' }}
                onEnded={() => { stopPlayTimer(); setPlaying(false) }}
              />
            )}
          </div>
        )}
      </div>

      <button className="upload"><Icon name="paperclip" /><div><strong>افزودن فایل</strong><span>PDF، تصویر یا فایل متنی</span></div><Icon name="plus" /></button>
      <label className="field"><span>مهلت تحویل</span><div className="two-fields"><select><option value="">تاریخ</option>{reportDateRange().map(d => <option key={d} value={d}>{d}</option>)}</select><input type="time" /></div></label>
    </main>
    <div className="sticky-action">
      <button onClick={() => { setPublished(true); setTimeout(() => goBack(), 900) }}>
        {published ? <><Icon name="check" /> تکلیف منتشر شد</> : 'انتشار تکلیف'}
      </button>
    </div>
  </div>
}

function Exam({ navigate, goBack, role = 'teacher' }: { navigate: (s: Screen) => void; goBack: () => void; role?: UserRole }) {
  const isStudent = role === 'student'
  const weekDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه']

  const addDays = (date: Date, amount: number) => {
    const result = new Date(date)
    result.setDate(result.getDate() + amount)
    return result
  }

  const getSaturday = (date: Date) => {
    const result = new Date(date)
    const offset = (result.getDay() + 1) % 7
    result.setDate(result.getDate() - offset)
    result.setHours(12, 0, 0, 0)
    return result
  }

  const toInputDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      day: 'numeric',
      month: 'long',
    }).format(date)

  const [selectedDate, setSelectedDate] = useState(() => new Date())
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [createMenuOpen, setCreateMenuOpen] = useState(false)
  type ExamItem = {
    t: string
    day: number
    m: string
    s: string
    color: string
    kind: 'آزمون' | 'آزمونک'
    description: string
    fileName: string
    fileSize: string
    voice: string
    startAt: string
    endAt: string
  }
  const [selected, setSelected] = useState<ExamItem | null>(null)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<ExamItem | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [examRows, setExamRows] = useState(() => students.map((name, i) => ({
    name,
    status: i % 3 === 0 ? 'غایب' : 'شرکت‌کرده',
    score: '',
    feedback: '',
    hasVoiceFeedback: false,
  })))
  const [examStudentSearch, setExamStudentSearch] = useState('')
  const [examMaxScore, setExamMaxScore] = useState('20')
  const [examGroupSheet, setExamGroupSheet] = useState(false)
  const [examGroupScore, setExamGroupScore] = useState('')
  const [examFeedbackIndex, setExamFeedbackIndex] = useState<number | null>(null)
  const [examFeedbackDraft, setExamFeedbackDraft] = useState('')
  const [examSaving, setExamSaving] = useState(false)
  const [examStarted, setExamStarted] = useState(false)
  const [examAnswer, setExamAnswer] = useState('')
  const [examFile, setExamFile] = useState<string | null>(null)
  const [examVoice, setExamVoice] = useState(false)
  const [examRecording, setExamRecording] = useState(false)
  const [examSubmitted, setExamSubmitted] = useState(false)
  const [examScoreKind, setExamScoreKind] = useState<'کمی' | 'کیفی'>('کمی')
  const [examQuantScale, setExamQuantScale] = useState('۲۰/۰')
  const [examScoreValue, setExamScoreValue] = useState('')
  const [examActiveVoice, setExamActiveVoice] = useState<number | null>(null)
  const examQualitativeOptions = ['خیلی خوب', 'نیاز به تلاش بیشتر']
  const examFeedbackMaxScore = examQuantScale.startsWith('custom:')
    ? Number(examQuantScale.slice(7)) || 20
    : examQuantScale.startsWith('۲۰') ? 20 : examQuantScale.startsWith('۱۰') ? 10 : 5
  const updateExamRow = (index: number, patch: Partial<(typeof examRows)[0]>) => {
    setExamRows(prev => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)))
  }
  const weekStart = getSaturday(selectedDate)
  const weekDates = weekDays.map((_, index) => addDays(weekStart, index))
  const weekEnd = weekDates[4]

  const [data, setData] = useState<ExamItem[]>([
    {
      t: 'آزمون میان‌ترم علوم تجربی',
      day: 2,
      m: 'شروع: دوشنبه، ۰۹:۰۰ · پایان: ۰۹:۳۰',
      s: '۳۰ دقیقه · ۲۸ شرکت‌کننده',
      color: 'orange',
      kind: 'آزمون',
      description: 'سوالات میان‌ترم از فصل‌های ۱ تا ۳ طرح شده است. فایل نمونه سوال و توضیح صوتی ضمیمه شده است.',
      fileName: 'نمونه_سوال_میان‌ترم.pdf',
      fileSize: '۱٫۸ مگابایت',
      voice: '۰:۴۵',
      startAt: 'دوشنبه، ۰۹:۰۰',
      endAt: 'دوشنبه، ۰۹:۳۰',
    },
    {
      t: 'آزمونک فصل دوم ریاضی',
      day: 0,
      m: 'شروع: شنبه، ۱۰:۳۰ · پایان: ۱۰:۴۵',
      s: '۱۵ دقیقه · ۲۵ شرکت‌کننده',
      color: 'blue',
      kind: 'آزمونک',
      description: 'شامل مبحث جمع و تفریق اعداد صحیح. فقط ۱۵ دقیقه فرصت دارید.',
      fileName: 'آزمونک_فصل۲.pdf',
      fileSize: '۰٫۶ مگابایت',
      voice: '۰:۲۰',
      startAt: 'شنبه، ۱۰:۳۰',
      endAt: 'شنبه، ۱۰:۴۵',
    },
    {
      t: 'آزمونک آمادگی دفاعی',
      day: 3,
      m: 'شروع: سه‌شنبه، ۱۱:۰۰ · پایان: ۱۱:۲۰',
      s: '۲۰ دقیقه · ۲۲ شرکت‌کننده',
      color: 'green',
      kind: 'آزمونک',
      description: 'شامل درس سوم، به‌صورت تشریحی و کوتاه. فایل راهنما و صوت معلم را قبل از شروع ببینید.',
      fileName: 'راهنما_آزمونک.pdf',
      fileSize: '۰٫۹ مگابایت',
      voice: '۰:۳۲',
      startAt: 'سه‌شنبه، ۱۱:۰۰',
      endAt: 'سه‌شنبه، ۱۱:۲۰',
    },
    {
      t: 'آزمون پایان فصل فارسی',
      day: 4,
      m: 'شروع: چهارشنبه، ۰۸:۳۰ · پایان: ۰۹:۱۵',
      s: '۴۵ دقیقه · منتشر نشده',
      color: 'purple',
      kind: 'آزمون',
      description: 'شامل درک مطلب و املا است. هنوز منتشر نشده و قابل ویرایش است.',
      fileName: 'آزمون_پایان_فصل.pdf',
      fileSize: '۲٫۱ مگابایت',
      voice: '۰:۵۵',
      startAt: 'چهارشنبه، ۰۸:۳۰',
      endAt: 'چهارشنبه، ۰۹:۱۵',
    },
    {
      t: 'آزمونک آنلاین علوم',
      day: 1,
      m: 'شروع: یکشنبه، ۱۴:۰۰ · پایان: ۱۴:۱۰',
      s: '۱۰ دقیقه · ۱۸ از ۲۸ شرکت',
      color: 'mint',
      kind: 'آزمونک',
      description: 'آنلاین و ۱۰ دقیقه‌ای، از آزمایش فشار هوا.',
      fileName: 'سوالات_آنلاین.pdf',
      fileSize: '۰٫۴ مگابایت',
      voice: '۰:۱۵',
      startAt: 'یکشنبه، ۱۴:۰۰',
      endAt: 'یکشنبه، ۱۴:۱۰',
    },
  ])

  const filteredData = searchQuery.trim()
    ? data.filter(item => item.t.includes(searchQuery.trim()) || item.m.includes(searchQuery.trim()))
    : data

  const openEdit = () => {
    if (!selected) return
    setDraft({ ...selected })
    setEditing(true)
  }
  const cancelEdit = () => {
    setDraft(selected)
    setEditing(false)
  }
  const saveEdit = () => {
    if (!selected || !draft) return
    const next = {
      ...draft,
      m: `شروع: ${draft.startAt} · پایان: ${draft.endAt}`,
    }
    setData(prev => prev.map(x => x.t === selected.t ? next : x))
    setSelected(next)
    setDraft(next)
    setEditing(false)
    setToast('تغییرات ذخیره شد')
    setTimeout(() => setToast(null), 1400)
  }

  if (selected) {
    const view = editing && draft ? draft : selected
    return (
      <div className="screen inner-screen">
        <SubHeader
          screen="exam"
          back={() => { setSelected(null); setEditing(false) }}
          title={view.t}
          subtitle="کلاس ۹۰۱"
          rightIcon={!isStudent && !editing ? 'pencil' : null}
          rightLabel={!isStudent && !editing ? 'ویرایش' : ''}
          onRightClick={!isStudent && !editing ? openEdit : undefined}
        />
        <main className="inner-content">
          <div className="assignment-detail-head">
            <span className={`resource-icon ${view.color}`}>
              <Icon name="exam" />
            </span>
            <div>
              <strong>{view.t}</strong>
              <small>علوم تجربی · کلاس ۹۰۱</small>
            </div>
          </div>

          {!editing ? (
            <>
              <section className="sa-panel">
                <div className="sa-panel-head"><strong>بازه زمانی</strong></div>
                <div className="week-summary-banner" style={{ margin: 0 }}>
                  <div className="week-summary-item">
                    <strong style={{ fontSize: 12 }}>{view.startAt}</strong>
                    <span>شروع</span>
                  </div>
                  <div className="week-summary-item">
                    <strong style={{ fontSize: 12 }}>{view.endAt}</strong>
                    <span>پایان</span>
                  </div>
                  <div className="week-summary-item">
                    <strong style={{ fontSize: 12 }}>{view.kind}</strong>
                    <span>نوع</span>
                  </div>
                </div>
              </section>

              <section className="sa-panel">
                <div className="sa-panel-head"><strong>توضیحات</strong></div>
                <p className="sa-desc">{view.description}</p>
              </section>

              <section className="sa-panel">
                <div className="sa-panel-head">
                  <strong>فایل و صوت</strong>
                  <span>۲ مورد</span>
                </div>
                <div className="sa-file-list">
                  <button type="button" className="resource" onClick={() => { setToast('دانلود شروع شد'); setTimeout(() => setToast(null), 1200) }}>
                    <span className="resource-icon green"><Icon name="file" /></span>
                    <div>
                      <strong>{view.fileName}</strong>
                      <small>فایل ضمیمه</small>
                      <span>{view.fileSize} · دانلود</span>
                    </div>
                    <Icon name="chevron" />
                  </button>
                  <button type="button" className="resource">
                    <span className="resource-icon blue"><Icon name="mic" /></span>
                    <div>
                      <strong>توضیح صوتی</strong>
                      <small>پیام صوتی راهنما</small>
                      <span>مدت: {view.voice}</span>
                    </div>
                    <Icon name="chevron" />
                  </button>
                </div>
              </section>

              {!isStudent && (
                <section className="sa-panel">
                  <div className="sa-panel-head"><strong>وضعیت کلاس</strong></div>
                  <p className="sa-desc">{view.s}</p>
                </section>
              )}

              {!isStudent && (
                <>
                  <div className="section-heading student-search-heading" style={{ marginTop: 16 }}>
                    <strong>دانش‌آموزان</strong>
                    <span>{fa(examRows.filter(r => r.status === 'شرکت‌کرده').length)} از {fa(examRows.length)} شرکت‌کرده</span>
                  </div>
                  <div className="section-heading student-search-heading">
                    <input
                      className="student-search-input"
                      placeholder="جست‌وجو در دانش‌آموزان..."
                      value={examStudentSearch}
                      onChange={e => setExamStudentSearch(e.target.value)}
                    />
                    <button type="button" className="heading-action-btn" onClick={() => { setExamGroupScore(''); setExamGroupSheet(true) }}>
                      ثبت نمره گروهی
                    </button>
                  </div>
                  <div className="assignment-table-wrap">
                    <table className="assignment-table">
                      <thead>
                        <tr>
                          <th>دانش‌آموز</th>
                          <th>وضعیت</th>
                          <th>نمره</th>
                          <th>بازخورد</th>
                          <th>دانلود سریع</th>
                        </tr>
                      </thead>
                      <tbody>
                        {examRows
                          .filter(row => !examStudentSearch.trim() || row.name.includes(examStudentSearch.trim()))
                          .map((row) => {
                            const realIndex = examRows.findIndex(r => r.name === row.name)
                            const canGrade = row.status === 'شرکت‌کرده'
                            return (
                              <tr key={row.name}>
                                <td>
                                  <button
                                    type="button"
                                    className="assignment-student-cell student-cell-open"
                                    disabled={!canGrade}
                                    onClick={() => {
                                      if (!canGrade) return
                                      setExamFeedbackIndex(realIndex)
                                      setExamFeedbackDraft(examRows[realIndex].feedback)
                                    }}
                                    aria-label={`مشاهده پاسخ ${row.name}`}
                                  >
                                    <img
                                      className="student-photo"
                                      alt={row.name}
                                      src={`https://images.irantarh.com/pr:sharp/rs:fill:0:375:0/plain/s3:/uploads/designs/1401/07/25/ax-irani/41.jpg`}
                                    />
                                    <strong>{row.name}</strong>
                                  </button>
                                </td>
                                <td>
                                  <span className={`status-pill ${canGrade ? 'ok' : 'wait'}`}>{row.status}</span>
                                </td>
                                <td>
                                  <input
                                    className="score-input compact"
                                    inputMode="numeric"
                                    placeholder={fa(examMaxScore || '20')}
                                    disabled={!canGrade}
                                    value={row.score ? fa(row.score) : ''}
                                    onChange={e => updateExamRow(realIndex, { score: toEn(e.target.value).replace(/[^\d]/g, '') })}
                                  />
                                </td>
                                <td>
                                  {canGrade ? (
                                    <button
                                      type="button"
                                      className={`table-action-btn ${row.feedback ? 'view' : 'register'}`}
                                      onClick={() => {
                                        setExamFeedbackIndex(realIndex)
                                        setExamFeedbackDraft(row.feedback)
                                      }}
                                    >
                                      {row.feedback ? 'مشاهده' : 'بازخورد'}
                                    </button>
                                  ) : (
                                    <span className="muted-dash">—</span>
                                  )}
                                </td>
                                <td>
                                  {canGrade ? (
                                    <button
                                      type="button"
                                      className="table-action-btn view"
                                      aria-label={`دانلود پاسخ ${row.name}`}
                                      onClick={() => {
                                        setToast(`دانلود پاسخ ${row.name} شروع شد`)
                                        setTimeout(() => setToast(null), 1400)
                                      }}
                                    >
                                      <Icon name="download" size={14} />
                                    </button>
                                  ) : (
                                    <span className="muted-dash">—</span>
                                  )}
                                </td>
                              </tr>
                            )
                          })}
                      </tbody>
                    </table>
                  </div>
                  <div className="sticky-action">
                    <button
                      type="button"
                      disabled={examSaving}
                      onClick={() => {
                        setExamSaving(true)
                        setToast('نمرات و بازخوردها ثبت شد')
                        setTimeout(() => { setExamSaving(false); setToast(null) }, 1400)
                      }}
                    >
                      {examSaving ? <><Icon name="check" /> ثبت شد</> : 'ثبت تغییرات'}
                    </button>
                  </div>
                </>
              )}

              {isStudent && (
                <div className="exam-start-block">
                  <button
                    type="button"
                    className="exam-start-btn"
                    onClick={() => {
                      if (!examStarted) {
                        setExamStarted(true)
                        return
                      }
                      if (examSubmitted) return
                      if (!examAnswer.trim() && !examFile && !examVoice) {
                        setToast('ابتدا پاسخی وارد کنید')
                        setTimeout(() => setToast(null), 1400)
                        return
                      }
                      setExamSubmitted(true)
                      setToast('پاسخ شما بارگذاری شد')
                      setTimeout(() => setToast(null), 1400)
                    }}
                  >
                    {examSubmitted ? (
                      <><Icon name="check" /> بارگذاری شد</>
                    ) : examStarted ? (
                      'بارگذاری'
                    ) : (
                      'شروع'
                    )}
                  </button>

                  {examStarted && (
                    <div className="sa-panel exam-answer-panel">
                      <div className="sa-panel-head">
                        <strong>پاسخ شما</strong>
                        <span>
                          {[examAnswer.trim() ? 'متن' : '', examFile ? 'فایل' : '', examVoice ? 'صوت' : ''].filter(Boolean).join(' · ') || 'بدون پاسخ'}
                        </span>
                      </div>

                      <label className="field">
                        <span>پاسخ متنی</span>
                        <textarea
                          rows={4}
                          placeholder="پاسخ خود را بنویسید..."
                          value={examAnswer}
                          onChange={e => setExamAnswer(e.target.value)}
                          disabled={examSubmitted}
                        />
                      </label>

                      <div className="sa-upload-stack">
                        <button
                          type="button"
                          className="upload"
                          disabled={examSubmitted}
                          onClick={() => {
                            setExamFile('پاسخ_آزمون.pdf')
                            setToast('فایل پیوست شد')
                            setTimeout(() => setToast(null), 1200)
                          }}
                        >
                          <Icon name="paperclip" />
                          <div>
                            <strong>{examFile || 'افزودن فایل'}</strong>
                            <span>{examFile ? 'فایل پیوست شد · لمس برای تغییر' : 'PDF، ورد یا فایل متنی'}</span>
                          </div>
                          <Icon name={examFile ? 'check' : 'plus'} />
                        </button>
                        <button
                          type="button"
                          className={`upload ${examRecording ? 'upload-recording' : ''}`}
                          disabled={examSubmitted}
                          onClick={() => {
                            if (examRecording) {
                              setExamVoice(true)
                              setExamRecording(false)
                            } else {
                              setExamRecording(true)
                            }
                          }}
                        >
                          <Icon name="mic" />
                          <div>
                            <strong>{examVoice ? 'پیام صوتی ثبت شد' : examRecording ? 'در حال ضبط... توقف و ذخیره' : 'افزودن پیام صوتی'}</strong>
                            <span>{examRecording ? 'برای ذخیره دوباره لمس کنید' : 'صوت کوتاه به‌عنوان پاسخ'}</span>
                          </div>
                          <Icon name={examVoice || examRecording ? 'check' : 'plus'} />
                        </button>
                      </div>

                      <div className="exam-answer-actions">
                        <button
                          type="button"
                          className="secondary"
                          onClick={() => {
                            setExamStarted(false)
                            setExamAnswer('')
                            setExamFile(null)
                            setExamVoice(false)
                            setExamRecording(false)
                            setExamSubmitted(false)
                          }}
                        >
                          انصراف
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setToast('پایان ثبت شد')
                            setTimeout(() => setToast(null), 1600)
                          }}
                        >
                          پایان
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              <label className="field">
                <span>نوع</span>
                <div className="score-kind-tabs">
                  {(['آزمون', 'آزمونک'] as const).map(k => (
                    <button
                      key={k}
                      type="button"
                      className={draft?.kind === k ? 'active' : ''}
                      onClick={() => setDraft(d => d ? { ...d, kind: k } : d)}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </label>
              <label className="field">
                <span>عنوان</span>
                <input
                  type="text"
                  value={draft?.t || ''}
                  onChange={e => setDraft(d => d ? { ...d, t: e.target.value } : d)}
                />
              </label>
              <label className="field">
                <span>توضیحات</span>
                <textarea
                  rows={4}
                  value={draft?.description || ''}
                  onChange={e => setDraft(d => d ? { ...d, description: e.target.value } : d)}
                />
              </label>
              <label className="field">
                <span>شروع</span>
                <input
                  type="text"
                  value={draft?.startAt || ''}
                  onChange={e => setDraft(d => d ? { ...d, startAt: e.target.value } : d)}
                  placeholder="مثلاً دوشنبه، ۰۹:۰۰"
                />
              </label>
              <label className="field">
                <span>پایان</span>
                <input
                  type="text"
                  value={draft?.endAt || ''}
                  onChange={e => setDraft(d => d ? { ...d, endAt: e.target.value } : d)}
                  placeholder="مثلاً دوشنبه، ۰۹:۳۰"
                />
              </label>
              <label className="field">
                <span>نام فایل</span>
                <input
                  type="text"
                  value={draft?.fileName || ''}
                  onChange={e => setDraft(d => d ? { ...d, fileName: e.target.value } : d)}
                />
              </label>
              <label className="field">
                <span>مدت صوت</span>
                <input
                  type="text"
                  value={draft?.voice || ''}
                  onChange={e => setDraft(d => d ? { ...d, voice: e.target.value } : d)}
                />
              </label>
              <div className="sticky-action two">
                <button type="button" className="secondary" onClick={cancelEdit}>انصراف</button>
                <button type="button" onClick={saveEdit}>ذخیره تغییرات</button>
              </div>
            </>
          )}
        </main>

        {examGroupSheet && (
          <div className="overlay group-grade-overlay" onClick={() => setExamGroupSheet(false)}>
            <div className="bottom-sheet group-grade-sheet" onClick={e => e.stopPropagation()}>
              <div className="sheet-handle" />
              <div className="sheet-title">
                <div>
                  <strong>ثبت نمره گروهی</strong>
                  <span>فقط برای شرکت‌کنندگان</span>
                </div>
                <IconButton icon="close" label="بستن" onClick={() => setExamGroupSheet(false)} />
              </div>
              <div className="group-grade-body">
                <label className="field">
                  <span>حداکثر نمره</span>
                  <input inputMode="numeric" value={fa(examMaxScore)} onChange={e => setExamMaxScore(toEn(e.target.value).replace(/[^\d]/g, ''))} />
                </label>
                <label className="field">
                  <span>نمره مشترک</span>
                  <input inputMode="numeric" placeholder="مثلاً ۲۰" value={examGroupScore ? fa(examGroupScore) : ''} onChange={e => setExamGroupScore(toEn(e.target.value).replace(/[^\d]/g, ''))} />
                </label>
                <p className="group-grade-hint">نمره فقط برای دانش‌آموزانی که وضعیت «شرکت‌کرده» دارند ثبت می‌شود.</p>
              </div>
              <div className="group-grade-footer">
                <button type="button" className="secondary" onClick={() => setExamGroupSheet(false)}>انصراف</button>
                <button
                  type="button"
                  className="primary"
                  onClick={() => {
                    const maxN = Number(examMaxScore) || 20
                    const scoreN = Number(examGroupScore)
                    const joined = examRows.filter(r => r.status === 'شرکت‌کرده')
                    if (!joined.length) {
                      setToast('هنوز کسی شرکت نکرده است')
                      setTimeout(() => setToast(null), 1400)
                      return
                    }
                    if (!examGroupScore.trim() || Number.isNaN(scoreN)) {
                      setToast('نمره را وارد کنید')
                      setTimeout(() => setToast(null), 1400)
                      return
                    }
                    if (scoreN > maxN) {
                      setToast(`نمره نمی‌تواند بیشتر از ${fa(maxN)} باشد`)
                      setTimeout(() => setToast(null), 1600)
                      return
                    }
                    const value = String(scoreN)
                    setExamRows(prev => prev.map(r => r.status === 'شرکت‌کرده' ? { ...r, score: value } : r))
                    setExamGroupSheet(false)
                    setToast(`نمره ${fa(value)} برای ${fa(joined.length)} نفر ثبت شد`)
                    setTimeout(() => setToast(null), 1600)
                  }}
                >
                  ثبت
                </button>
              </div>
            </div>
          </div>
        )}

        {examFeedbackIndex !== null && examRows[examFeedbackIndex] && (() => {
          const row = examRows[examFeedbackIndex]
          const joinedIndexes = examRows
            .map((r, i) => (r.status === 'شرکت‌کرده' ? i : -1))
            .filter(i => i >= 0)
          const pos = joinedIndexes.indexOf(examFeedbackIndex)
          const prevIdx = pos > 0 ? joinedIndexes[pos - 1] : null
          const nextIdx = pos >= 0 && pos < joinedIndexes.length - 1 ? joinedIndexes[pos + 1] : null
          const firstName = row.name.split(' ')[0]

          const goToStudent = (idx: number | null, opts?: { savedName?: string }) => {
            if (opts?.savedName) {
              setToast(`بازخوردی برای ${opts.savedName} ثبت شد`)
              setTimeout(() => setToast(null), 1800)
            }
            if (idx === null) {
              setExamFeedbackIndex(null)
              return
            }
            setExamFeedbackIndex(idx)
            setExamFeedbackDraft(examRows[idx].feedback)
            setExamActiveVoice(null)
          }

          const saveAndNext = () => {
            updateExamRow(examFeedbackIndex, { feedback: examFeedbackDraft })
            if (nextIdx !== null) goToStudent(nextIdx, { savedName: firstName })
            else {
              setToast(`بازخوردی برای ${firstName} ثبت شد`)
              setTimeout(() => setToast(null), 1800)
              setExamFeedbackIndex(null)
            }
          }

          return (
            <div className="overlay group-grade-overlay" onClick={() => setExamFeedbackIndex(null)}>
              <div className="bottom-sheet student-answer-sheet" onClick={e => e.stopPropagation()}>
                <div className="sheet-handle" />
                <div className="student-answer-scroll">
                  <div className="sap-hero">
                    <button
                      type="button"
                      className="sap-nav-btn prev"
                      aria-label="قبلی"
                      disabled={prevIdx === null}
                      onClick={() => goToStudent(prevIdx)}
                    >
                      قبلی
                    </button>
                    <div className="sap-hero-main">
                      <div className="sap-avatar-wrap">
                        <img
                          className="sap-avatar-img"
                          src={`https://images.irantarh.com/pr:sharp/rs:fill:0:375:0/plain/s3:/uploads/designs/1401/07/25/ax-irani/41.jpg`}
                          alt={row.name}
                        />
                      </div>
                      <div className="sap-hero-text">
                        <strong>{row.name}</strong>
                        <small>علوم تجربی · کلاس ۹۰۱ · {fa(pos + 1)} از {fa(joinedIndexes.length)}</small>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="sap-nav-btn next"
                      aria-label="بعدی"
                      disabled={nextIdx === null}
                      onClick={() => goToStudent(nextIdx)}
                    >
                      بعدی
                    </button>
                  </div>

                  <div className="sap-section">
                    <div className="sap-section-title">
                      <Icon name="exam" size={16} />
                      <strong>پاسخ دانش‌آموز</strong>
                    </div>
                    <p className="sa-desc">
                      {row.status === 'شرکت‌کرده'
                        ? `پاسخ ${firstName} ثبت شده است.`
                        : 'این دانش‌آموز هنوز شرکت نکرده است.'}
                    </p>
                    <div className="sa-file-list">
                      <button type="button" className="resource">
                        <span className="resource-icon green"><Icon name="file" /></span>
                        <div>
                          <strong>پاسخ_{firstName}.pdf</strong>
                          <small>فایل ارسالی</small>
                          <span>برای مشاهده لمس کنید</span>
                        </div>
                        <Icon name="chevron" />
                      </button>
                    </div>
                  </div>

                  <div className="sap-section">
                    <div className="sap-section-title">
                      <Icon name="chat" size={16} />
                      <strong>بازخورد معلم</strong>
                    </div>
                    <label className="field">
                      <span>متن بازخورد</span>
                      <textarea
                        rows={3}
                        placeholder="نظر خود را برای دانش‌آموز بنویسید..."
                        value={examFeedbackDraft}
                        onChange={e => setExamFeedbackDraft(e.target.value)}
                      />
                    </label>
                    <button
                      type="button"
                      className={`sap-voice-btn ${row.hasVoiceFeedback || examActiveVoice === examFeedbackIndex ? 'active' : ''}`}
                      onClick={() => {
                        if (examActiveVoice === examFeedbackIndex) {
                          setExamActiveVoice(null)
                          updateExamRow(examFeedbackIndex, { hasVoiceFeedback: true })
                          setToast('بازخورد صوتی ذخیره شد')
                          setTimeout(() => setToast(null), 1200)
                        } else {
                          setExamActiveVoice(examFeedbackIndex)
                        }
                      }}
                    >
                      <Icon name="mic" size={18} />
                      <span>
                        {examActiveVoice === examFeedbackIndex
                          ? 'در حال ضبط... برای توقف بزنید'
                          : row.hasVoiceFeedback
                            ? 'بازخورد صوتی ثبت شده'
                            : 'ضبط بازخورد صوتی'}
                      </span>
                    </button>
                  </div>

                  <div className="sap-section">
                    <div className="score-kind-card" style={{ marginBottom: 0 }}>
                      <div className="score-kind-label">نوع نمره</div>
                      <div className="score-kind-tabs">
                        {(['کمی', 'کیفی'] as const).map(k => (
                          <button
                            key={k}
                            type="button"
                            className={examScoreKind === k ? 'active' : ''}
                            onClick={() => {
                              setExamScoreKind(k)
                              setExamScoreValue('')
                            }}
                          >
                            {k === 'کمی' ? 'عددی' : 'توصیفی'}
                          </button>
                        ))}
                      </div>
                      <div className="score-kind-hint">
                        {examScoreKind === 'کمی' && (
                          <div className="score-kind-scales">
                            <span className="chips-prefix">پیش‌فرض:</span>
                            {['۲۰/۰', '۱۰/۰', '۵/۰'].map(s => (
                              <button
                                key={s}
                                type="button"
                                className={examQuantScale === s ? 'active' : ''}
                                onClick={() => setExamQuantScale(s)}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        )}
                        {examScoreKind === 'کیفی' && (
                          <span>خیلی خوب / نیاز به تلاش بیشتر</span>
                        )}
                      </div>

                      {examScoreKind === 'کمی' && (
                        <label className="field" style={{ marginTop: 10, marginBottom: 0 }}>
                          <span>نمره (از {fa(examFeedbackMaxScore)})</span>
                          <input
                            inputMode="numeric"
                            placeholder={fa(examFeedbackMaxScore)}
                            value={examScoreValue ? fa(examScoreValue) : (row.score ? fa(row.score) : '')}
                            onChange={e => {
                              const raw = toEn(e.target.value).replace(/[^\d]/g, '')
                              if (raw && Number(raw) > examFeedbackMaxScore) return
                              setExamScoreValue(raw)
                              updateExamRow(examFeedbackIndex, { score: raw })
                            }}
                          />
                        </label>
                      )}
                      {examScoreKind === 'کیفی' && (
                        <div className="group-qual-options" style={{ marginTop: 10 }}>
                          {examQualitativeOptions.map(o => (
                            <button
                              key={o}
                              type="button"
                              className={(examScoreValue || row.score) === o ? 'active' : ''}
                              onClick={() => {
                                setExamScoreValue(o)
                                updateExamRow(examFeedbackIndex, { score: o })
                              }}
                            >
                              {o}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="group-grade-footer">
                  <button type="button" className="secondary" onClick={() => setExamFeedbackIndex(null)}>بستن</button>
                  <button type="button" className="primary" onClick={saveAndNext}>ثبت</button>
                </div>
              </div>
            </div>
          )
        })()}

        {toast && <div className="toast">{toast}</div>}
      </div>
    )
  }

  return (
    <div className="screen inner-screen">
      <SubHeader
        screen="exam"
        back={goBack}
        showSearchBtn
        onSearchClick={() => setSearchOpen(true)}
        searchOpen={searchOpen}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchClose={() => { setSearchOpen(false); setSearchQuery('') }}
        searchPlaceholder="جست‌وجو..."
      />
      <main className="inner-content">
        <div className="assignment-week-navigation">
          <button type="button" className="assignment-week-arrow" onClick={() => setSelectedDate(addDays(weekStart, -7))}>
            <span>‹</span>
            <small>هفته قبل</small>
          </button>
          <label className="assignment-date-picker">
            <span className="assignment-date-icon"><Icon name="calendar" /></span>
            <span className="assignment-date-text">
              <strong>{formatDate(weekStart)} تا {formatDate(weekEnd)}</strong>
              <small>برای انتخاب تاریخ کلیک کنید</small>
            </span>
            <span className="assignment-date-chevron">›</span>
            <input
              type="date"
              value={toInputDate(selectedDate)}
              onChange={e => {
                if (!e.target.value) return
                setSelectedDate(new Date(e.target.value + 'T12:00:00'))
              }}
            />
          </label>
          <button type="button" className="assignment-week-arrow" onClick={() => setSelectedDate(addDays(weekStart, 7))}>
            <span>›</span>
            <small>هفته بعد</small>
          </button>
        </div>

        <div className="assignment-week-list">
          {weekDays.map((dayName, dayIndex) => {
            const items = filteredData.filter(item => item.day === dayIndex)
            return (
              <section className="assignment-day-section" key={dayName}>
                <div className="assignment-day-title">
                  <strong>{dayName}</strong>
                  <span>{formatDate(weekDates[dayIndex])}</span>
                  <span className="assignment-day-count">{fa(items.length)} مورد</span>
                </div>
                {items.length ? (
                  items.map(item => (
                    <button className="resource" key={item.t} onClick={() => {
                      setSelected(item)
                      setEditing(false)
                      setDraft(item)
                      setExamStarted(false)
                      setExamAnswer('')
                      setExamFile(null)
                      setExamVoice(false)
                      setExamRecording(false)
                      setExamSubmitted(false)
                    }}>
                      <span className={`resource-icon ${item.color}`}>
                        <Icon name="exam" />
                      </span>
                      <div>
                        <strong>{item.t}</strong>
                        <small>{item.m}</small>
                        <span>{isStudent
                          ? (item.s.includes('منتشر')
                              ? 'هنوز شروع نشده'
                              : item.s.includes('۱۸')
                                ? 'شرکت کرده‌اید'
                                : 'آماده شرکت')
                          : item.s}</span>
                      </div>
                      <Icon name="chevron" />
                    </button>
                  ))
                ) : (
                  <div className="assignment-day-empty">موردی برای این روز ثبت نشده است.</div>
                )}
              </section>
            )
          })}
        </div>
      </main>

      {!isStudent && (
        <button
          className="fab"
          aria-label="ایجاد آزمون"
          onClick={() => setCreateMenuOpen(true)}
        >
          <Icon name="plus" />
        </button>
      )}

      {createMenuOpen && (
        <div className="overlay group-grade-overlay" onClick={() => setCreateMenuOpen(false)}>
          <div className="bottom-sheet group-grade-sheet" onClick={e => e.stopPropagation()}>
            <div className="sheet-handle" />
            <div className="sheet-title">
              <div>
                <strong>ایجاد آزمون</strong>
                <span>نوع ساخت را انتخاب کنید</span>
              </div>
              <IconButton icon="close" label="بستن" onClick={() => setCreateMenuOpen(false)} />
            </div>
            <div className="classroom-grid" style={{ padding: '8px 0 12px' }}>
              <button
                type="button"
                onClick={() => {
                  setCreateMenuOpen(false)
                }}
              >
                <span><Icon name="exam" /></span>
                <strong>آزمون‌ساز</strong>
                <small>طراحی سریع و حرفه‌ای</small>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCreateMenuOpen(false)
                  navigate('exam-create')
                }}
              >
                <span><Icon name="pencil" /></span>
                <strong>ساخت کلاسیک</strong>
                <small>تنظیم دستی پرسش‌ها و زمان</small>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ExamCreate({ goBack }: { navigate?: (s: Screen) => void; goBack: () => void }) {
  const [published, setPublished] = useState(false)
  const [kind, setKind] = useState<'آزمون' | 'آزمونک'>('آزمون')
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [fileLabel, setFileLabel] = useState<string | null>(null)
  const [recording, setRecording] = useState(false)
  const [recSeconds, setRecSeconds] = useState(0)
  const [voiceNote, setVoiceNote] = useState<{ seconds: number } | null>(null)
  const [playing, setPlaying] = useState(false)
  const recTimerRef = useRef<number | null>(null)
  const [startDay, setStartDay] = useState(() => examDateRange()[0])
  const [startTime, setStartTime] = useState('09:00')
  const [endDay, setEndDay] = useState(() => examDateRange()[0])
  const [endTime, setEndTime] = useState('09:30')

  const fmtTime = (s: number) => fa(`${Math.floor(s / 60)}:${String(Math.max(0, Math.floor(s)) % 60).padStart(2, '0')}`)

  const startVoice = () => {
    setPlaying(false)
    setRecSeconds(0)
    setRecording(true)
    if (recTimerRef.current !== null) window.clearInterval(recTimerRef.current)
    recTimerRef.current = window.setInterval(() => setRecSeconds(v => v + 1), 1000)
  }
  const stopVoice = () => {
    if (recTimerRef.current !== null) { window.clearInterval(recTimerRef.current); recTimerRef.current = null }
    setVoiceNote({ seconds: Math.max(1, recSeconds) })
    setRecording(false)
  }
  const removeVoice = () => {
    setVoiceNote(null)
    setPlaying(false)
    setRecSeconds(0)
  }

  return <div className="screen inner-screen">
    <SubHeader
      screen="exam-create"
      back={goBack}
      title={kind === 'آزمونک' ? 'ساخت آزمونک' : 'ساخت آزمون'}
      subtitle="فایل، صوت و بازه زمانی شروع تا پایان"
    />
    <main className="inner-content form-page">
      <label className="field">
        <span>نوع دسته‌بندی</span>
        <select value={kind} onChange={e => setKind(e.target.value as 'آزمون' | 'آزمونک')}>
          <option value="آزمون">آزمون</option>
          <option value="آزمونک">آزمونک</option>
        </select>
      </label>

      <label className="field">
        <span>عنوان</span>
        <input
          type="text"
          placeholder={kind === 'آزمونک' ? 'مثلاً آزمونک فصل دوم' : 'مثلاً آزمون میان‌ترم علوم'}
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </label>

      <label className="field">
        <span>توضیحات</span>
        <textarea
          rows={4}
          placeholder="راهنما، نکات مهم و دستورالعمل‌ها..."
          value={desc}
          onChange={e => setDesc(e.target.value)}
        />
      </label>

      <div className="voice-note-block">
        {!voiceNote && !recording && (
          <button type="button" className="upload" onClick={startVoice}>
            <Icon name="mic" />
            <div><strong>افزودن صوت</strong><span>توضیح صوتی</span></div>
            <Icon name="plus" />
          </button>
        )}
        {recording && (
          <button type="button" className="upload upload-recording" onClick={stopVoice}>
            <Icon name="mic" />
            <div><strong>در حال ضبط... {fmtTime(recSeconds)}</strong><span>برای پایان و ذخیره بزنید</span></div>
            <Icon name="check" />
          </button>
        )}
        {voiceNote && (
          <div className="voice-note-row">
            <button
              type="button"
              className="voice-note-play"
              aria-label={playing ? 'توقف' : 'پخش'}
              onClick={() => setPlaying(p => !p)}
            >
              <Icon name={playing ? 'pause' : 'play'} size={15} />
            </button>
            <div className="voice-note-info">
              <strong>صوت توضیحات</strong>
              <small>{fmtTime(voiceNote.seconds)}</small>
            </div>
            <button type="button" className="attach-remove" aria-label="حذف صوت" onClick={removeVoice}>
              <Icon name="close" size={16} />
            </button>
          </div>
        )}
      </div>

      <button
        type="button"
        className="upload"
        onClick={() => setFileLabel(kind === 'آزمونک' ? 'برگه_آزمونک.pdf' : 'برگه_آزمون.pdf')}
      >
        <Icon name="paperclip" />
        <div>
          <strong>{fileLabel ? 'تغییر فایل' : 'افزودن فایل'}</strong>
          <span>{fileLabel || 'PDF، تصویر یا فایل متنی'}</span>
        </div>
        <Icon name={fileLabel ? 'check' : 'plus'} />
      </button>
      {fileLabel && (
        <div className="voice-note-row" style={{ marginTop: 8 }}>
          <span className="resource-icon green" style={{ width: 36, height: 36, display: 'grid', placeItems: 'center', borderRadius: 10 }}>
            <Icon name="file" size={18} />
          </span>
          <div className="voice-note-info">
            <strong>{fileLabel}</strong>
            <small>پیوست</small>
          </div>
          <button type="button" className="attach-remove" aria-label="حذف فایل" onClick={() => setFileLabel(null)}>
            <Icon name="close" size={16} />
          </button>
        </div>
      )}

      <label className="field">
        <span>شروع</span>
        <div className="two-fields">
          <select value={startDay} onChange={e => setStartDay(e.target.value)}>
            <option value="">تاریخ شروع</option>
            {examDateRange().map(d => <option key={`s-${d}`} value={d}>{d}</option>)}
          </select>
          <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} aria-label="ساعت شروع" />
        </div>
      </label>

      <label className="field">
        <span>پایان</span>
        <div className="two-fields">
          <select value={endDay} onChange={e => setEndDay(e.target.value)}>
            <option value="">تاریخ پایان</option>
            {examDateRange().map(d => <option key={`e-${d}`} value={d}>{d}</option>)}
          </select>
          <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} aria-label="ساعت پایان" />
        </div>
      </label>

      <div className="score-kind-hint" style={{ marginTop: 4 }}>
        برخلاف تکلیف، حتماً بازهٔ زمانی شروع و پایان دارد.
      </div>
    </main>
    <div className="sticky-action two">
      <button type="button" className="secondary" onClick={goBack}>انصراف</button>
      <button
        type="button"
        onClick={() => {
          const now = shamsiOf(new Date())
          const day = startDay || now.date
          const time = fa(startTime || '09:00')
          publishedExam = {
            title: title.trim() || kind,
            kind,
            day,
            time,
            startKey: `${day} ${time}`,
            at: now.time,
          }
          setPublished(true)
          setTimeout(() => goBack(), 900)
        }}
      >
        {published ? <><Icon name="check" /> منتشر شد</> : 'انتشار'}
      </button>
    </div>
  </div>
}

type AttendanceRecord = {
  id: string
  dateLabel: string
  dayLabel: string
  timeLabel: string
  createdAt: number
  status: Record<number, string>
}

let attendanceHistoryStore: AttendanceRecord[] = [
  {
    id: 'a1',
    dateLabel: '۱۴۰۵/۰۷/۱۵',
    dayLabel: 'دوشنبه',
    timeLabel: '۰۸:۱۵',
    createdAt: Date.now() - 2 * 60 * 60 * 1000,
    status: Object.fromEntries(students.map((_, i) => [i, i % 5 === 0 ? 'غایب' : i % 4 === 0 ? 'تأخیر' : 'حاضر'])),
  },
  {
    id: 'a2',
    dateLabel: '۱۴۰۵/۰۷/۱۴',
    dayLabel: 'یکشنبه',
    timeLabel: '۰۸:۱۰',
    createdAt: Date.now() - 30 * 60 * 60 * 1000,
    status: Object.fromEntries(students.map((_, i) => [i, i % 6 === 0 ? 'غایب' : 'حاضر'])),
  },
  {
    id: 'a3',
    dateLabel: '۱۴۰۵/۰۷/۱۳',
    dayLabel: 'شنبه',
    timeLabel: '۰۸:۲۰',
    createdAt: Date.now() - 54 * 60 * 60 * 1000,
    status: Object.fromEntries(students.map((_, i) => [i, i % 3 === 0 ? 'تأخیر' : 'حاضر'])),
  },
]

function Attendance({ goBack, role = 'teacher' }: { navigate: (s: Screen) => void; goBack: () => void; role?: UserRole }) {
  const isStudent = role === 'student'
  const [view, setView] = useState<'list' | 'register' | 'detail'>('list')
  const [history, setHistory] = useState<AttendanceRecord[]>(attendanceHistoryStore)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [status, setStatus] = useState<Record<number, string>>({})
  const [nowLabel, setNowLabel] = useState(() => nowShamsi())
  const [exportOpen, setExportOpen] = useState(false)
  const [exportFrom, setExportFrom] = useState('')
  const [exportTo, setExportTo] = useState('')
  const [toast, setToast] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const id = setInterval(() => setNowLabel(nowShamsi()), 1000)
    return () => clearInterval(id)
  }, [])

  const active = history.find(h => h.id === activeId) || null
  const canEdit = !isStudent && !!active

  const openDetail = (id: string) => {
    const rec = history.find(h => h.id === id)
    if (!rec) return
    setActiveId(id)
    setStatus({ ...rec.status })
    setView('detail')
  }

  const startRegister = () => {
    setActiveId(null)
    setStatus({})
    setView('register')
  }

  const saveRegister = () => {
    const n = nowShamsi()
    const dayNames = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه']
    const rec: AttendanceRecord = {
      id: String(Date.now()),
      dateLabel: n.date,
      dayLabel: dayNames[new Date().getDay()],
      timeLabel: n.time,
      createdAt: Date.now(),
      status: { ...status },
    }
    const next = [rec, ...history]
    attendanceHistoryStore = next
    setHistory(next)
    setView('list')
  }

  const saveEdit = () => {
    if (!activeId || !canEdit) return
    const next = history.map(h => h.id === activeId ? { ...h, status: { ...status } } : h)
    attendanceHistoryStore = next
    setHistory(next)
    setView('list')
    setActiveId(null)
  }

  const present = Object.values(status).filter(x => x === 'حاضر').length
  const absent = Object.values(status).filter(x => x === 'غایب').length
  const late = Object.values(status).filter(x => x === 'تأخیر').length

  const dateOptions = Array.from(new Set(history.map(h => h.dateLabel)))
  const searchQ = searchQuery.trim()
  const filteredHistory = searchQ
    ? history.filter(h => h.dateLabel.includes(searchQ) || h.dayLabel.includes(searchQ) || h.timeLabel.includes(searchQ))
    : history

  const exportHistory = () => {
    const filtered = history.filter(h => {
      const after = !exportFrom || h.dateLabel >= exportFrom
      const before = !exportTo || h.dateLabel <= exportTo
      return after && before
    })
    const lines = ['تاریخ,روز,ساعت,حاضر,غایب,تأخیر']
    filtered.forEach(item => {
      const p = Object.values(item.status).filter(x => x === 'حاضر').length
      const a = Object.values(item.status).filter(x => x === 'غایب').length
      const l = Object.values(item.status).filter(x => x === 'تأخیر').length
      lines.push([item.dateLabel, item.dayLabel, item.timeLabel, p, a, l].join(','))
    })
    const blob = new Blob(['\ufeff' + lines.join('\n')], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'تاریخچه-حضور-غیاب.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setExportOpen(false)
    setToast('خروجی تاریخچه دانلود شد')
    setTimeout(() => setToast(null), 1600)
  }

  if (view === 'list') {
    return (
      <div className="screen inner-screen">
        <SubHeader
          screen="attendance"
          back={goBack}
          rightIcon={isStudent ? null : 'clock'}
          rightLabel={isStudent ? '' : 'تاریخچه و خروجی'}
          onRightClick={isStudent ? undefined : () => setExportOpen(true)}
          showSearchBtn={isStudent}
          onSearchClick={isStudent ? () => setSearchOpen(true) : undefined}
          searchOpen={isStudent ? searchOpen : false}
          searchValue={isStudent ? searchQuery : ''}
          onSearchChange={isStudent ? setSearchQuery : undefined}
          onSearchClose={isStudent ? () => { setSearchOpen(false); setSearchQuery('') } : undefined}
          searchPlaceholder="جست‌وجو در حضور و غیاب..."
          title={isStudent ? 'حضور و غیاب من' : undefined}
          subtitle={isStudent ? 'وضعیت حضور شما' : undefined}
        />
        <div className="att-datetime-bar">
          <div>
            <Icon name="calendar" size={14} />
            <strong>{nowLabel.date}</strong>
          </div>
          <span>{nowLabel.time}</span>
        </div>
        <main className="inner-content">
          <div className="section-heading">
            <strong>تاریخچه حضور و غیاب</strong>
            <span>{fa(filteredHistory.length)} مورد</span>
          </div>
          {filteredHistory.map(item => {
            const p = Object.values(item.status).filter(x => x === 'حاضر').length
            const a = Object.values(item.status).filter(x => x === 'غایب').length
            const editable = !isStudent
            return (
              <button
                key={item.id}
                type="button"
                className="att-history-bar"
                onClick={() => openDetail(item.id)}
              >
                <div className="att-history-main">
                  <strong>{item.dateLabel}</strong>
                  <small>{item.timeLabel} · {fa(p)} حاضر · {fa(a)} غایب{editable ? ' · قابل ویرایش' : ''}</small>
                </div>
                <span className="att-history-day">{item.dayLabel}</span>
              </button>
            )
          })}
          {!history.length && (
            <div className="empty">
              <Icon name="attendance" size={40} />
              <strong>هنوز ثبت نشده</strong>
              <span>با دکمه + پایین صفحه، حضور و غیاب ثبت کنید.</span>
            </div>
          )}
          {history.length > 0 && !filteredHistory.length && (
            <div className="empty">
              <Icon name="search" size={40} />
              <strong>موردی پیدا نشد</strong>
              <span>عبارت دیگری را جست‌وجو کنید.</span>
            </div>
          )}
        </main>
        {!isStudent && (
        <button className="fab" aria-label="ثبت حضور و غیاب جدید" onClick={startRegister}>
          <Icon name="plus" />
        </button>
      )}

        {exportOpen && (
          <div className="overlay group-grade-overlay" onClick={() => setExportOpen(false)}>
            <div className="bottom-sheet group-grade-sheet" onClick={e => e.stopPropagation()}>
              <div className="sheet-handle" />
              <div className="sheet-title">
                <div>
                  <strong>خروجی تاریخچه</strong>
                  <span>بازه تاریخ را انتخاب کنید</span>
                </div>
                <IconButton icon="close" label="بستن" onClick={() => setExportOpen(false)} />
              </div>
              <div className="group-grade-body">
                <div className="two-fields">
                  <label className="field">
                    <span>از تاریخ</span>
                    <select value={exportFrom} onChange={e => setExportFrom(e.target.value)}>
                      <option value="">همه</option>
                      {dateOptions.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </label>
                  <label className="field">
                    <span>تا تاریخ</span>
                    <select value={exportTo} onChange={e => setExportTo(e.target.value)}>
                      <option value="">همه</option>
                      {dateOptions.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </label>
                </div>
                <p className="group-grade-hint">
                  خروجی شامل حاضر، غایب و تأخیر هر روز در بازه انتخابی است.
                </p>
              </div>
              <div className="group-grade-footer">
                <button type="button" className="secondary" onClick={() => setExportOpen(false)}>انصراف</button>
                <button type="button" className="primary" onClick={exportHistory}>خروجی</button>
              </div>
            </div>
          </div>
        )}
        {toast && <div className="toast">{toast}</div>}
      </div>
    )
  }

  return (
    <div className="screen inner-screen">
      <SubHeader
        screen="attendance"
        back={() => { setView('list'); setActiveId(null) }}
        title={view === 'register' ? 'ثبت حضور و غیاب' : 'جزئیات حضور و غیاب'}
        subtitle={view === 'detail' && active ? `${active.dateLabel} · ${active.dayLabel}` : undefined}
      />
      <main className="inner-content">
        <div className="attendance-summary">
          <div><strong className="green-text">{fa(present)}</strong><span>حاضر</span></div>
          <div><strong className="red-text">{fa(absent)}</strong><span>غایب</span></div>
          <div><strong>{fa(late)}</strong><span>تأخیر</span></div>
        </div>
        <div className="section-heading">
          <strong>فهرست دانش‌آموزان</strong>
          {(view === 'register' || canEdit) && (
            <button type="button" onClick={() => setStatus(Object.fromEntries(students.map((_, i) => [i, 'حاضر'])))}>همه حاضر</button>
          )}
        </div>
        {(isStudent ? students.slice(0, 1) : students).map((name, i) => (
          <div className="student" key={name}>
            <div className="student-avatar">{name[0]}</div>
            <strong>{isStudent ? 'شما · ' + name : name}</strong>
            <div>
              {['حاضر', 'غایب', 'تأخیر'].map(s => (
                <button
                  key={s}
                  type="button"
                  className={`${s} ${status[i] === s ? 'active' : ''}`}
                  disabled={isStudent}
                  onClick={() => {
                    if (isStudent) return
                    setStatus({ ...status, [i]: s })
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ))}
      </main>
      {(view === 'register' || canEdit) && (
        <div className="sticky-action">
          <button type="button" onClick={view === 'register' ? saveRegister : saveEdit}>
            {view === 'register' ? 'ثبت حضور و غیاب' : 'ذخیره تغییرات'}
          </button>
        </div>
      )}
    </div>
  )
}

const scheduleItems = [
  { time:'۰۸:۰۰', title:'ریاضی پایه نهم', info:'کلاس ۹۰۲ · ۴۵ دقیقه', color:'green', days:[22,24,26,29,31,2] },
  { time:'۰۹:۰۰', title:'علوم تجربی', info:'کلاس ۹۰۱ · جلسه آنلاین', color:'blue', days:[23,24,25,26,30,31,1,3] },
  { time:'۱۱:۳۰', title:'جلسه گروه آموزشی', info:'اتاق دبیران · ۳۰ دقیقه', color:'orange', days:[24,25,27,29,31] },
]

const studentScheduleEvents: { day: number; type: 'assignment' | 'exam'; title: string; subject: string; screen: Screen }[] = [
  { day: 24, type: 'assignment', title: 'تمرین فصل سوم', subject: 'علوم تجربی', screen: 'assignments' },
  { day: 26, type: 'exam', title: 'آزمون فصل سوم', subject: 'علوم تجربی', screen: 'exam' },
  { day: 28, type: 'assignment', title: 'تمرین فصل چهارم', subject: 'علوم تجربی', screen: 'assignments' },
  { day: 30, type: 'exam', title: 'آزمون فصل چهارم', subject: 'علوم تجربی', screen: 'exam' },
]

const fa = (n: number | string) => String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[+d])
const toEn = (s: string) => String(s).replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))

function reportDateRange(): string[] {
  const out: string[] = []
  for (let d = 1; d <= 30; d++) {
    out.push(`${fa(1405)}/${fa(7).replace(/\d/g, x => '۰۱۲۳۴۵۶۷۸۹'[+x])}/${String(d).padStart(2, '0').replace(/\d/g, x => '۰۱۲۳۴۵۶۷۸۹'[+x])}`)
  }
  out.push(`${fa(1405)}/${String(8).padStart(2, '0').replace(/\d/g, x => '۰۱۲۳۴۵۶۷۸۹'[+x])}/${String(1).padStart(2, '0').replace(/\d/g, x => '۰۱۲۳۴۵۶۷۸۹'[+x])}`)
  return out
}

const faDays = ['ش','ی','د','س','چ','پ','ج']
const faDayFull = ['شنبه','یکشنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنجشنبه','جمعه']
const dateCells = Array.from({ length: 14 }, (_, i) => {
  const d = 22 + i
  return { day: d > 31 ? d - 31 : d, label: faDays[i % 7], month: d > 31 ? 'اردیبهشت' : 'فروردین' }
})
const scheduleWeekDays = dateCells.slice(0, 5)
const scheduleTimes = ['۰۸:۰۰', '۰۹:۰۰', '۱۱:۳۰']

function MainSection({ screen, navigate, goBack, role, setRole }: { screen: Screen; navigate: (s: Screen) => void; goBack?: () => void; role: UserRole; setRole: (r: UserRole) => void }) {
  const todayLabel = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    weekday: 'long', day: 'numeric', month: 'long'
  }).format(new Date())
  const isTeacher = role === 'teacher'
  const isStudent = role === 'student'
  return <div className="screen main-section"><main className="section-content">
    {screen === 'schedule' && (
      isStudent ? (
        <section className="weekly-schedule student-calendar" dir="rtl">
          <div className="sub-header" style={{ position: 'static', borderRadius: 12, marginBottom: 12 }}>
            <IconButton icon="chevron" label="بازگشت" onClick={() => goBack && goBack()} />
            <div><strong>تقویم درسی</strong><span>علوم تجربی · پایه نهم</span></div>
          </div>
          <div className="schedule-today-date">امروز، {todayLabel}</div>
          <div className="calendar-grid">
            {dateCells.map((c, i) => {
              const ev = studentScheduleEvents.find(e => e.day === c.day)
              return (
                <button
                  key={i}
                  type="button"
                  className={`calendar-day ${ev ? 'has-event ' + ev.type : ''}`}
                  onClick={() => ev && navigate(ev.screen)}
                  disabled={!ev}
                >
                  <span className="calendar-day-num">{fa(c.day)}</span>
                  <span className="calendar-day-label">{c.label}</span>
                  {ev && <span className="calendar-event-dot" />}
                </button>
              )
            })}
          </div>
          <div className="calendar-events">
            <div className="activity-head"><small>پیش‌رو</small></div>
            {studentScheduleEvents.map((e, i) => (
              <button key={i} type="button" className="calendar-event-row" onClick={() => navigate(e.screen)}>
                <span className={`calendar-event-badge ${e.type}`}>{e.type === 'exam' ? 'آزمون' : 'تکلیف'}</span>
                <div>
                  <strong>{e.title}</strong>
                  <small>{fa(e.day)} · {e.subject}</small>
                </div>
                <Icon name="chevron" />
              </button>
            ))}
          </div>
        </section>
      ) : (
        <section className="weekly-schedule" dir="rtl">
          <div className="sub-header" style={{ position: 'static', borderRadius: 12, marginBottom: 12 }}>
            <IconButton icon="chevron" label="بازگشت" onClick={() => goBack && goBack()} />
            <div><strong>برنامه کلاسی</strong><span>علوم تجربی · پایه نهم</span></div>
          </div>
          <div className="schedule-today-date">امروز، {todayLabel}</div>
      <div className="schedule-table-wrap">
        <table className="schedule-table">
          <thead>
            <tr>
              <th className="schedule-day-heading">روز</th>
              {scheduleTimes.map(time => <th key={time}>{time}</th>)}
            </tr>
          </thead>
          <tbody>
            {scheduleWeekDays.map((day, dayIndex) => {
              const dayName = faDayFull[dayIndex]
              const dayClasses = scheduleItems.filter(item => item.days.includes(day.day))
              return <tr key={dayName}>
                <th scope="row" className="schedule-day-name">{dayName}</th>
                {scheduleTimes.map(time => {
                  const item = dayClasses.find(entry => entry.time === time)
                  return <td key={`${dayName}-${time}`}>
                    {item ? (
                      <button
                        type="button"
                        className={`schedule-class-cell ${item.color}`}
                        onClick={() => navigate('chat')}
                        aria-label={`ورود به چت ${item.title}`}
                      >
                        <strong>{item.title}</strong>
                        <span>{item.info}</span>
                      </button>
                    ) : <span className="schedule-empty-cell">—</span>}
                  </td>
                })}
              </tr>
            })}
          </tbody>
        </table>
      </div>
    </section>))}
    {screen === 'calls' && <><div className="call-tabs"><button className="active">همه</button><button>ازدست‌رفته</button></div>{conversations.slice(0,5).map((c,i)=><button className="call-row" key={c.name} onClick={()=>navigate('call')}><Avatar item={c}/><div><strong>{c.name}</strong><span className={i===1?'missed':''}>{i===1?'تماس ازدست‌رفته':'تماس ورودی'} · {c.time}</span></div><Icon name={i%2?'video':'phone'}/></button>)}</>}
    {screen === 'more' && <>
      <div className="profile-card">
        <button className="profile-large">{isTeacher ? 'س' : 'ع'}</button>
        <div>
          <strong>{isTeacher ? 'سارا کریمی' : 'علی احمدی'}</strong>
          <span>{isTeacher ? 'دبیر علوم تجربی' : 'دانش‌آموز پایه نهم'}</span>
          <small>{isTeacher ? 'school-321@shad.ir' : 'student-901@shad.ir'}</small>
        </div>
        <Icon name="chevron"/>
      </div>
      <div className="role-switch">
        <span>نقش فعال</span>
        <div>
          <button type="button" className={role === 'teacher' ? 'active' : ''} onClick={() => setRole('teacher')}>معلم</button>
          <button type="button" className={role === 'student' ? 'active' : ''} onClick={() => setRole('student')}>دانش‌آموز</button>
        </div>
      </div>
      <div className="more-grid">
        {(isTeacher
          ? [{t:'تکالیف',i:'book',s:'assignments'},{t:'آزمون‌ها',i:'exam',s:'exam'},{t:'منابع کلاسی',i:'file',s:'materials'},{t:'حضور و غیاب',i:'attendance',s:'attendance'}]
          : [{t:'تکالیف من',i:'book',s:'assignments'},{t:'آزمون‌ها',i:'exam',s:'exam'},{t:'منابع کلاسی',i:'file',s:'materials'}]
        ).map(x=><button key={x.t} onClick={()=>navigate(x.s as Screen)}><span><Icon name={x.i as IconName}/></span><strong>{x.t}</strong></button>)}
      </div>
      <div className="settings-list">
        <button><Icon name="settings"/><div><strong>تنظیمات</strong><span>حساب، حریم خصوصی و اعلان‌ها</span></div><Icon name="chevron"/></button>
        <button><Icon name="bookmark"/><div><strong>پیام‌های ذخیره‌شده</strong><span>فایل‌ها و پیام‌های مهم شما</span></div><Icon name="chevron"/></button>
      </div>
    </>}
  </main></div>
}

function CallScreen({ goBack }: { navigate: (s: Screen) => void; goBack: () => void }) {
  const [connected, setConnected] = useState(true)
  const [video, setVideo] = useState(false)
  return <div className={`screen call-screen ${video?'video-call':''}`}>
    <div className="call-top"><IconButton icon="chevron" label="بازگشت" onClick={goBack}/><span>تماس رمزگذاری‌شده</span><IconButton icon="users" label="شرکت‌کنندگان"/></div>
    <div className="caller"><Avatar item={conversations[0]} large/><strong>کلاس تجربی</strong><span>{connected?'۰۰:۲۴':'در حال برقراری تماس...'}</span></div>
    {video && <div className="self-video"><div>س</div><span>شما</span></div>}
    <div className="call-controls">
      {connected && <><button><span><Icon name="mic"/></span><small>بی‌صدا</small></button><button><span><Icon name="speaker"/></span><small>بلندگو</small></button><button className={video?'selected':''} onClick={()=>setVideo(!video)}><span><Icon name="camera"/></span><small>دوربین</small></button></>}
      <button className="end" onClick={()=>{ classStarted = false; goBack() }}><span><Icon name="phone"/></span><small>{connected?'پایان':'رد تماس'}</small></button>
      {!connected && <button className="accept" onClick={()=>setConnected(true)}><span><Icon name="phone"/></span><small>پاسخ</small></button>}
    </div>
  </div>
}

const classSections: { title: string; sub: string; icon: IconName; screen: Screen }[] = [
  { title: 'تکالیف', sub: '۲ تکلیف فعال', icon: 'book', screen: 'assignments' },
  { title: 'آزمون‌ها', sub: '۱ مورد پیش‌رو', icon: 'exam', screen: 'exam' },
  { title: 'منابع کلاسی', sub: '۴ فایل این هفته', icon: 'file', screen: 'materials' },
  { title: 'حضور و غیاب', sub: 'ثبت امروز', icon: 'attendance', screen: 'attendance' },
  { title: 'ثبت نمره', sub: '۲۸ دانش‌آموز', icon: 'chart', screen: 'gradebook' },
]

function Classroom({ navigate, goBack, role = 'teacher' }: { navigate: (s: Screen) => void; goBack: () => void; role?: UserRole }) {
  const isStudent = role === 'student'
  const visibleSections = isStudent
    ? [
        { title: 'تکالیف من', sub: 'ارسال و پیگیری', icon: 'book' as IconName, screen: 'assignments' as Screen },
        { title: 'آزمون‌ها', sub: 'برنامه و نتایج', icon: 'exam' as IconName, screen: 'exam' as Screen },
        { title: 'منابع کلاسی', sub: 'جزوه و فایل‌ها', icon: 'file' as IconName, screen: 'materials' as Screen },
        { title: 'تقویم درسی', sub: 'علوم تجربی · تکالیف و آزمون‌ها', icon: 'calendar' as IconName, screen: 'schedule' as Screen },
      ]
    : classSections
  const [mediaTab, setMediaTab] = useState('نمای کلی')
  const mediaTabs = ['نمای کلی', 'رسانه', 'فایل‌ها', 'لینک‌ها', 'موسیقی', 'صدا', 'گیف‌ها']
  const mediaContent: Record<string, { t: string; m: string; i: IconName }[]> = {
    'فایل‌ها': [
      { t: 'طرح ارتقاء پیام‌رسان آموزشی.docx', m: '۰۵.۰۸.۰۴ · ۱۱:۵۲ · ۲٫۰ MB', i: 'file' },
      { t: 'جزوه فصل سوم علوم.pdf', m: '۰۴.۰۸.۰۴ · ۰۹:۱۰ · ۲٫۴ MB', i: 'file' },
    ],
    'لینک‌ها': [
      { t: 'https://docs.google.com/spreadsheet...', m: 'ارسال‌شده توسط مسعود', i: 'grid' },
      { t: 'https://shad.ir/help', m: 'ارسال‌شده توسط اعلانات', i: 'grid' },
    ],
    'موسیقی': [
      { t: 'آهنگ آغازین کلاس', m: '۰۲:۱۵ · MP3', i: 'mic' },
    ],
    'صدا': [
      { t: 'پیام صوتی خانم کریمی', m: '۰:۳۷', i: 'mic' },
    ],
    'گیف‌ها': [
      { t: 'گیف تبریک', m: 'GIF', i: 'image' },
    ],
  }
  return <div className="screen inner-screen">
    <header className="sub-header">
      <IconButton icon="chevron" label="بازگشت" onClick={goBack} />
      <div><strong>علوم تجربی · پایه نهم</strong><span>کلاس ۹۰۱ · ۲۸ دانش‌آموز</span></div>
      <IconButton icon="more" label="بیشتر" />
    </header>
    <main className="inner-content classroom-content">
      <div className="start-class">
        <span className="start-play">
          <img src={`${import.meta.env.BASE_URL}book-cover.png`} alt="علوم تجربی" />
        </span>
        <strong>علوم تجربی · پایه نهم</strong>
        <small>۲۸ عضو · ۶ نفر آنلاین</small>
        <div className="start-cta-group">
          <span className="start-cta is-decorative">
            ورود به کلاسا
          </span>
          <span
            className="start-cta secondary-cta"
            role="button"
            tabIndex={0}
            onClick={() => navigate('chat')}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('chat') } }}
          >
            ورود به گروه کلاس
          </span>
        </div>
        <div className="start-divider" />
        <div className="start-actions">
          <span role="button" tabIndex={0} onClick={() => navigate('messenger')}><i><Icon name="logout" size={18} /></i><small>ترک کردن</small></span>
          <span role="button" tabIndex={0}><i><Icon name="bell" size={18} /></i><small>بی‌صدا کردن</small></span>
          <span role="button" tabIndex={0} onClick={() => navigate('chat')}><i><Icon name="chat" size={18} /></i><small>پیام‌ها</small></span>
        </div>
      </div>
      <div className="media-tabs">
        <div className="media-tabs-scroll">
          {mediaTabs.map(t => <button key={t} className={mediaTab === t ? 'active' : ''} onClick={() => setMediaTab(t)}>{t}</button>)}
        </div>
        <div className="media-tab-content">
          {mediaTab === 'نمای کلی' ? (
            <div className="classroom-grid" style={{padding:0}}>
              {visibleSections.map((x) => <button key={x.title} onClick={() => {
                if (x.title === 'تکالیف' || x.title === 'تکالیف من') {
                  assignmentContext = { subject: 'علوم تجربی', klass: 'کلاس ۹۰۱' }
                } else {
                  assignmentContext = null
                }
                navigate(x.screen)
              }}>
                <span><Icon name={x.icon} /></span>
                <strong>{x.title}</strong>
                <small>{x.sub}</small>
              </button>)}
              {!isStudent && (
                <button onClick={() => navigate('reports')}>
                  <span><Icon name="chart" /></span>
                  <strong>گزارش‌های کلاس</strong>
                  <small>حضور و غیاب، نمره‌ها، تکالیف و موارد کلاسی</small>
                </button>
              )}
              {!isStudent && <button className="storage-tile" onClick={() => navigate('storage')}>
                <span className="storage-cyl"><StorageGauge used={6} total={10} mini /></span>
                <div>
                  <strong>مدیریت حافظه</strong>
                  <small>۶ از ۱۰ گیگ اشغال شده</small>
                </div>
                <Icon name="chevron" />
              </button>}
            </div>
          ) : mediaTab === 'رسانه' ? (
            <div className="media-overview">
              {mediaTabs.filter(t => t !== 'نمای کلی' && t !== 'رسانه').map(t => <button key={t} onClick={() => setMediaTab(t)}>
                <span><Icon name={t === 'فایل‌ها' ? 'file' : t === 'لینک‌ها' ? 'grid' : t === 'موسیقی' || t === 'صدا' ? 'mic' : 'image'} /></span>
                <strong>{t}</strong>
                <small>{(mediaContent[t] || []).length} مورد</small>
              </button>)}
            </div>
          ) : (
            (mediaContent[mediaTab] || []).map((x, i) => <div className="media-row" key={i}>
              <span className="media-row-icon"><Icon name={x.i} /></span>
              <div><strong>{x.t}</strong><small>{x.m}</small></div>
              <Icon name="chevron" />
            </div>)
          )}
        </div>
      </div>
    </main>

  </div>
}

type GradeEntry = {
  id: string
  type: string
  date: string
  time: string
  scores: Record<number, string>
  avg: string
}

let gradeHistoryStore: GradeEntry[] = []

function shamsiOf(d: Date) {
  // Gregorian -> Jalali (accurate civil conversion)
  let gy = d.getFullYear()
  let gm = d.getMonth() + 1
  let gd = d.getDate()
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]
  let gy2 = (gm > 2) ? (gy + 1) : gy
  let days = 355666 + (365 * gy) + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) + gd + g_d_m[gm - 1]
  let jy = -1595 + (33 * Math.floor(days / 12053))
  days %= 12053
  jy += 4 * Math.floor(days / 1461)
  days %= 1461
  if (days > 365) {
    jy += Math.floor((days - 1) / 365)
    days = (days - 1) % 365
  }
  const jm = (days < 186)
    ? 1 + Math.floor(days / 31)
    : 7 + Math.floor((days - 186) / 30)
  const jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30))
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  const ss = String(d.getSeconds()).padStart(2, '0')
  return {
    date: `${fa(jy)}/${fa(String(jm).padStart(2, '0'))}/${fa(String(jd).padStart(2, '0'))}`,
    time: fa(`${hh}:${mm}`),
    timeWithSec: fa(`${hh}:${mm}:${ss}`),
  }
}

function nowShamsi() {
  return shamsiOf(new Date())
}

/** today + next 20 days, as Shamsi date options for scheduling */
function examDateRange(): string[] {
  const out: string[] = []
  const base = new Date()
  for (let i = 0; i < 21; i++) {
    out.push(shamsiOf(new Date(base.getFullYear(), base.getMonth(), base.getDate() + i)).date)
  }
  return out
}

function Gradebook({ navigate, goBack, role = 'teacher' }: { navigate: (s: Screen) => void; goBack: () => void; role?: UserRole }) {
  const isStudent = role === 'student'
  const [, setTick] = useState(0)
  const [filterDate, setFilterDate] = useState('')
  const [selected, setSelected] = useState<GradeEntry | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const history = gradeHistoryStore
  const uniqueDates = Array.from(new Set(history.map(h => h.date)))
  const filteredHistory = history.filter(h => {
    const byDate = !filterDate || h.date === filterDate
    const q = searchQuery.trim()
    const byQuery = !q || h.type.includes(q) || h.date.includes(q)
    return byDate && byQuery
  })
  const now = nowShamsi()

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 30000)
    return () => clearInterval(id)
  }, [])

  if (selected) {
    return <div className="screen inner-screen">
      <SubHeader
        screen="gradebook"
        back={() => setSelected(null)}
        rightText={isStudent ? undefined : 'ویرایش'}
        showSearchBtn
        onSearchClick={() => setSearchOpen(true)}
        searchOpen={searchOpen}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchClose={() => { setSearchOpen(false); setSearchQuery('') }}
        searchPlaceholder="جست‌وجو در نمرات..."
      />
      <div className="grade-fixed-date">
        <Icon name="calendar" size={16} />
        <strong>{selected.date}</strong>
        <span>{selected.time}</span>
      </div>
      <main className="inner-content">
        <div className="attendance-summary">
          <div><strong>{fa(Object.keys(selected.scores).length)}</strong><span>ثبت‌شده</span></div>
          <div><strong className="green-text">{fa(selected.avg)}</strong><span>میانگین</span></div>
          <div><strong>{fa(20)}</strong><span>از نمره</span></div>
        </div>
        <div className="section-heading"><strong>{selected.type}</strong><span>نیم‌ترم اول</span></div>
        {students.map((name, i) => (
          <div className="student" key={name}>
            <div className="student-avatar">{name[0]}</div>
            <strong>{name}</strong>
            <span className="score-readonly">{selected.scores[i] !== undefined && selected.scores[i] !== '' ? fa(selected.scores[i]) : '—'}</span>
          </div>
        ))}
      </main>
      <div className="sticky-action"><button onClick={() => setSelected(null)}>بازگشت به فهرست</button></div>
    </div>
  }

  return <div className="screen inner-screen">
    <SubHeader
      screen="gradebook"
      back={goBack}
      rightText={isStudent ? undefined : 'خروجی'}
      showSearchBtn
      onSearchClick={() => setSearchOpen(true)}
      searchOpen={searchOpen}
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      onSearchClose={() => { setSearchOpen(false); setSearchQuery('') }}
      searchPlaceholder={isStudent ? 'جست‌وجو در نمرات من...' : 'جست‌وجو در عناوین نمره...'}
      title={isStudent ? 'نمرات من' : undefined}
      subtitle={isStudent ? 'علوم تجربی · پایه نهم' : undefined}
    />
    <div className="grade-fixed-date">
      <Icon name="calendar" size={16} />
      <strong>{now.date}</strong>
      <span>{now.time}</span>
    </div>
    <main className="inner-content">
      <div className="grade-summary-card">
        <div className="grade-summary-item">
          <strong>{fa(history.length)}</strong>
          <span>ثبت کل</span>
        </div>
        <div className="grade-summary-item">
          <strong>{fa(uniqueDates.length)}</strong>
          <span>روزهای فعال</span>
        </div>
        <div className="grade-summary-item">
          <strong>{fa(students.length)}</strong>
          <span>دانش‌آموز</span>
        </div>
      </div>
      {uniqueDates.length > 0 && (
        <div className="grade-filter-row">
          <label className="field grade-filter-field"><span>فیلتر تاریخ</span>
            <select value={filterDate} onChange={e => setFilterDate(e.target.value)}>
              <option value="">همهٔ تاریخ‌ها</option>
              {uniqueDates.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </label>
        </div>
      )}
      <div className="section-heading" style={{ marginTop: 8 }}>
        <strong>نمرات ثبت‌شده</strong>
        <span>{fa(filteredHistory.length)} مورد</span>
      </div>
      {filteredHistory.length ? filteredHistory.map(h => (
        <button type="button" className="history-card" key={h.id} onClick={() => setSelected(h)} style={{ width: '100%', cursor: 'pointer', textAlign: 'right' }}>
          <span className="history-icon"><Icon name="chart" size={18} /></span>
          <div className="history-info">
            <strong>{h.type}</strong>
            <small>{h.date} · ساعت {h.time} · میانگین {fa(h.avg)}</small>
          </div>
          <Icon name="chevron" size={14} />
        </button>
      )) : (
        <div className="empty grade-empty">
          <Icon name="chart" size={40} />
          <strong>هنوز نمره‌ای ثبت نشده</strong>
          <span>{isStudent ? 'وقتی معلم نمره ثبت کند اینجا نمایش داده می‌شود.' : 'با دکمهٔ + پایین صفحه، عنوان نمره را انتخاب و نمرات را وارد کنید.'}</span>
        </div>
      )}
    </main>
    {!isStudent && (
      <button className="fab" aria-label="ثبت نمرهٔ جدید" onClick={() => navigate('grade-register')}><Icon name="plus" /></button>
    )}
  </div>
}

function GradeRegister({ goBack }: { navigate: (s: Screen) => void; goBack: () => void }) {
  const suggestedTypes = ['آزمونک', 'آزمون']
  const qualitativeOptions = ['خیلی خوب', 'نیاز به تلاش بیشتر']
  const quantitativeScales = ['۲۰/۰', '۱۰/۰', '۵/۰']
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [pickDate, setPickDate] = useState(() => nowShamsi().date)
  const [scoreKind, setScoreKind] = useState<'کمی' | 'کیفی'>('کمی')
  const [quantScale, setQuantScale] = useState('۲۰/۰')
  const [customMaxOpen, setCustomMaxOpen] = useState(false)
  const [customMaxInput, setCustomMaxInput] = useState('')
  const [scores, setScores] = useState<Record<number, string>>({})
  const [now, setNow] = useState(() => nowShamsi())
  const [saved, setSaved] = useState(false)
  const [groupOpen, setGroupOpen] = useState(false)
  const [groupValue, setGroupValue] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmDate, setConfirmDate] = useState(() => nowShamsi().date)
  const [confirmTime, setConfirmTime] = useState(() => nowShamsi().time)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const id = setInterval(() => setNow(nowShamsi()), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    setScores({})
    setGroupValue('')
  }, [scoreKind, quantScale])

  const vals = Object.values(scores).filter(v => v.trim() !== '')
  const numericVals = vals.map(v => Number(toEn(v))).filter(n => !Number.isNaN(n))
  const avg = scoreKind === 'کمی' && numericVals.length
    ? (numericVals.reduce((a, b) => a + b, 0) / numericVals.length).toFixed(1)
    : '—'
  const filled = vals.length
  const maxScore = quantScale.startsWith('custom:')
    ? Number(quantScale.slice(7)) || 20
    : quantScale.startsWith('۲۰') ? 20 : quantScale.startsWith('۱۰') ? 10 : 5

  const openConfirm = () => {
    if (!category || vals.length === 0) return
    setConfirmDate(pickDate.trim() || now.date)
    setConfirmTime(now.time)
    setConfirmOpen(true)
  }

  const handleRegister = () => {
    const type = [category, title.trim()].filter(Boolean).join(' · ') || 'نمره'
    if (vals.length === 0) return
    const entry: GradeEntry = {
      id: `${Date.now()}`,
      type: `${type} · ${scoreKind === 'کمی' ? 'عددی' : 'توصیفی'}`,
      date: confirmDate || pickDate || now.date,
      time: confirmTime || now.time,
      scores: { ...scores },
      avg: String(avg),
    }
    gradeHistoryStore = [entry, ...gradeHistoryStore]
    setConfirmOpen(false)
    setSaved(true)
    setTimeout(() => goBack(), 900)
  }

  return (
    <div className="screen inner-screen">
      <SubHeader
        screen="grade-register"
        back={goBack}
        showSearchBtn
        onSearchClick={() => setSearchOpen(true)}
        searchOpen={searchOpen}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchClose={() => { setSearchOpen(false); setSearchQuery('') }}
        searchPlaceholder="جست‌وجوی دانش‌آموز..."
      />
      <div className="grade-fixed-date">
        <Icon name="calendar" size={16} />
        <strong>{now.date}</strong>
        <span>{now.time}</span>
      </div>
      <main className="inner-content">
        <div className="attendance-summary">
          <div><strong>{fa(students.length)}</strong><span>دانش‌آموز</span></div>
          <div><strong className="green-text">{fa(filled)}</strong><span>واردشده</span></div>
          <div><strong className="green-text">{scoreKind === 'کمی' ? fa(avg) : '—'}</strong><span>میانگین</span></div>
        </div>

        <div className="two-fields">
          <label className="field">
            <span>نوع دسته‌بندی</span>
            <select value={category} onChange={e => setCategory(e.target.value)}>
              <option value="">انتخاب کنید</option>
              {suggestedTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <label className="field">
            <span>تاریخ</span>
            <input
              type="text"
              placeholder="۱۴۰۵/۰۸/۱۷"
              value={pickDate}
              onChange={e => setPickDate(e.target.value)}
            />
          </label>
        </div>

        <div className={category ? '' : 'grade-form-locked'} aria-disabled={!category}>
          <label className="field">
            <span>عنوان نمره</span>
            <input
              type="text"
              placeholder="مثلاً آزمونک فصل سوم"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </label>

        <div className="score-kind-card">
          <div className="score-kind-label">نوع نمره</div>
          <div className="score-kind-tabs">
            {(['کمی', 'کیفی'] as const).map(k => (
              <button
                key={k}
                type="button"
                className={scoreKind === k ? 'active' : ''}
                onClick={() => setScoreKind(k)}
              >
                {k === 'کمی' ? 'عددی' : 'توصیفی'}
              </button>
            ))}
          </div>
          <div className="score-kind-hint">
            {scoreKind === 'کیفی' && (
              <span>خیلی خوب / نیاز به تلاش بیشتر</span>
            )}
            {scoreKind === 'کمی' && (
              <div className="score-kind-scales">
                <span className="chips-prefix">پیش‌فرض:</span>
                {quantitativeScales.map(s => (
                  <button
                    key={s}
                    type="button"
                    className={quantScale === s ? 'active' : ''}
                    onClick={() => setQuantScale(s)}
                  >
                    {s}
                  </button>
                ))}
                <button
                  type="button"
                  className={`custom-range-btn ${quantScale.startsWith('custom:') ? 'active' : ''}`}
                  onClick={() => {
                    setCustomMaxInput(quantScale.startsWith('custom:') ? quantScale.slice(7) : '')
                    setCustomMaxOpen(true)
                  }}
                >
                  بازه دلخواه
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="section-heading">
          <strong>{[category, title.trim()].filter(Boolean).join(' · ') || 'نمره'}</strong>
          <button
            type="button"
            className="group-score-btn"
            onClick={() => { setGroupValue(''); setGroupOpen(true) }}
          >
            ثبت گروهی
          </button>
        </div>

        {students.map((name, i) => ({ name, i })).filter(x => !searchQuery.trim() || x.name.includes(searchQuery.trim())).map(({ name, i }) => (
          <div className="student" key={name}>
            <div className="student-avatar">{name[0]}</div>
            <strong>{name}</strong>
            {scoreKind === 'کمی' && (
              <input
                className="score-input"
                inputMode="numeric"
                placeholder={fa(maxScore)}
                value={scores[i] !== undefined && scores[i] !== '' ? fa(scores[i]) : ''}
                onChange={e => {
                  const raw = toEn(e.target.value).replace(/[^\d]/g, '')
                  if (raw && Number(raw) > maxScore) return
                  setScores(prev => ({ ...prev, [i]: raw }))
                }}
              />
            )}
            {scoreKind === 'کیفی' && (
              <select
                className="score-select"
                value={scores[i] || ''}
                onChange={e => setScores(prev => ({ ...prev, [i]: e.target.value }))}
              >
                <option value="">انتخاب</option>
                {qualitativeOptions.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            )}
          </div>
        ))}
        </div>
      </main>

      <div className="sticky-action">
        <button type="button" onClick={openConfirm} disabled={!category || vals.length === 0 || saved}>
          {saved ? <><Icon name="check" /> ثبت شد</> : `ثبت ${[category, title.trim()].filter(Boolean).join(' · ') || 'نمره'}`}
        </button>
      </div>

      {confirmOpen && (
        <div className="overlay group-grade-overlay" onClick={() => setConfirmOpen(false)}>
          <div className="bottom-sheet group-grade-sheet" onClick={e => e.stopPropagation()}>
            <div className="sheet-handle" />
            <div className="sheet-title">
              <div>
                <strong>تأیید ثبت نمره</strong>
                <span>تاریخ و ساعت برگزاری را مشخص کنید</span>
              </div>
              <IconButton icon="close" label="بستن" onClick={() => setConfirmOpen(false)} />
            </div>
            <div className="group-grade-body">
              <div className="two-fields">
                <label className="field">
                  <span>تاریخ</span>
                  <input type="text" placeholder="۱۴۰۵/۰۸/۱۷" value={confirmDate} onChange={e => setConfirmDate(e.target.value)} />
                </label>
                <label className="field">
                  <span>ساعت</span>
                  <input type="text" inputMode="numeric" placeholder="۱۰:۳۰" value={confirmTime} onChange={e => setConfirmTime(e.target.value)} />
                </label>
              </div>
              <div className="score-kind-scales" style={{ marginTop: 4 }}>
                <button type="button" onClick={() => { setConfirmDate(now.date); setConfirmTime(now.time) }}>همین الان</button>
              </div>
              <p className="group-grade-hint">
                {fa(filled)} نمره برای «{[category, title.trim()].filter(Boolean).join(' · ') || 'نمره'}» با نوع {scoreKind === 'کمی' ? 'عددی' : 'توصیفی'} ثبت می‌شود.
              </p>
            </div>
            <div className="group-grade-footer">
              <button type="button" className="secondary" onClick={() => setConfirmOpen(false)}>انصراف</button>
              <button type="button" className="primary" onClick={handleRegister} disabled={saved}>ثبت</button>
            </div>
          </div>
        </div>
      )}

      {customMaxOpen && (
        <div className="overlay group-grade-overlay" onClick={() => setCustomMaxOpen(false)}>
          <div className="bottom-sheet group-grade-sheet" onClick={e => e.stopPropagation()}>
            <div className="sheet-handle" />
            <div className="sheet-title">
              <div>
                <strong>بازه دلخواه</strong>
                <span>حداکثر نمره را مشخص کنید (از ۰ تا این عدد)</span>
              </div>
              <IconButton icon="close" label="بستن" onClick={() => setCustomMaxOpen(false)} />
            </div>
            <div className="group-grade-body">
              <label className="field">
                <span>حداکثر نمره</span>
                <input
                  autoFocus
                  inputMode="numeric"
                  placeholder="مثلاً ۲۵"
                  value={customMaxInput ? fa(customMaxInput) : ''}
                  onChange={e => setCustomMaxInput(toEn(e.target.value).replace(/[^\d]/g, ''))}
                />
              </label>
            </div>
            <div className="group-grade-footer">
              <button type="button" className="secondary" onClick={() => setCustomMaxOpen(false)}>انصراف</button>
              <button
                type="button"
                className="primary"
                disabled={!customMaxInput || Number(customMaxInput) <= 0}
                onClick={() => {
                  if (!customMaxInput || Number(customMaxInput) <= 0) return
                  setQuantScale(`custom:${customMaxInput}`)
                  setCustomMaxOpen(false)
                }}
              >
                تأیید
              </button>
            </div>
          </div>
        </div>
      )}

      {groupOpen && (
        <div className="overlay group-grade-overlay" onClick={() => setGroupOpen(false)}>
          <div className="bottom-sheet group-grade-sheet" onClick={e => e.stopPropagation()}>
            <div className="sheet-handle" />
            <div className="sheet-title">
              <div>
                <strong>ثبت گروهی · {scoreKind === 'کمی' ? 'عددی' : 'توصیفی'}</strong>
                <span>یک مقدار برای همه دانش‌آموزان</span>
              </div>
              <IconButton icon="close" label="بستن" onClick={() => setGroupOpen(false)} />
            </div>
            <div className="group-grade-body">
              {scoreKind === 'کمی' && (
                <label className="field">
                  <span>نمره مشترک (از {fa(maxScore)})</span>
                  <input
                    inputMode="numeric"
                    placeholder={`مثلاً ${fa(maxScore)}`}
                    value={groupValue ? fa(groupValue) : ''}
                    onChange={e => {
                      const raw = toEn(e.target.value).replace(/[^\d]/g, '')
                      if (raw && Number(raw) > maxScore) return
                      setGroupValue(raw)
                    }}
                  />
                </label>
              )}
              {scoreKind === 'کیفی' && (
                <div className="group-qual-options">
                  {qualitativeOptions.map(o => (
                    <button
                      key={o}
                      type="button"
                      className={groupValue === o ? 'active' : ''}
                      onClick={() => setGroupValue(o)}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              )}
              <p className="group-grade-hint">
                این مقدار برای هر {fa(students.length)} دانش‌آموز ثبت می‌شود و مقادیر قبلی را جایگزین می‌کند.
              </p>
            </div>
            <div className="group-grade-footer">
              <button type="button" className="secondary" onClick={() => setGroupOpen(false)}>انصراف</button>
              <button
                type="button"
                className="primary"
                disabled={!groupValue.trim()}
                onClick={() => {
                  if (!groupValue.trim()) return
                  setScores(Object.fromEntries(students.map((_, i) => [i, groupValue.trim()])))
                  setGroupOpen(false)
                }}
              >
                اعمال برای همه
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

type StatCategory = {
  id: string
  label: string
  value: string
}

const defaultCategories: StatCategory[] = [
  { id: '1', label: 'آزمونک', value: '۱۶' },
  { id: '3', label: 'تکالیف تحویل داده', value: '۸۰٪' },
  { id: '4', label: 'فعالیت کلاسی', value: '۱۵' },
  { id: '5', label: 'آزمون', value: '۱۴' },
  { id: '6', label: 'حضور', value: '۹۰٪' },
]

const categoryOptions = [
  'آزمونک',
  'تکالیف',
  'فعالیت کلاسی',
  'آزمون',
  'حضور و غیاب',
]

function Reports({ goBack }: { navigate: (s: Screen) => void; goBack: () => void }) {
  const [periodMode, setPeriodMode] = useState<'summer' | 'months' | 'terms'>('months')
  const [periodValue, setPeriodValue] = useState<string | null>('مهر')
  const [selected, setSelected] = useState<string | null>(null)
  const [reportMode, setReportMode] = useState<'individual' | 'collective'>('individual')
  const [studentQuery, setStudentQuery] = useState('')
  const [detailTab, setDetailTab] = useState('بازخورد کلاسی')
  const [weekIndex, setWeekIndex] = useState(0)
  const [toast, setToast] = useState<string | null>(null)

  const collectiveCats = ['آزمونک', 'تکالیف', 'فعالیت کلاسی', 'آزمون', 'حضور و غیاب', 'بازخورد کلاسی']

  const [cardStats, setCardStats] = useState<StatCategory[]>(defaultCategories)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<StatCategory | null>(null)
  const [newLabel, setNewLabel] = useState(categoryOptions[0])
  const [newValue, setNewValue] = useState('')
  const [filterStudentQuery, setFilterStudentQuery] = useState('')
  const [filterStudents, setFilterStudents] = useState<string[]>([])
  const [filterAllStudents, setFilterAllStudents] = useState(true)
  const [filterCategories, setFilterCategories] = useState<string[]>(['آزمونک', 'حضور و غیاب'])
  const [filterPeriods, setFilterPeriods] = useState<string[]>([])
  const [exportPage, setExportPage] = useState(false)

  const summerMonths = ['تیر', 'مرداد', 'شهریور']
  const academicMonths = ['مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند', 'فروردین', 'اردیبهشت', 'خرداد']
  const terms = ['نوبت اول', 'نوبت دوم']

  const handleDownloadFullReport = () => {
    const reportText = `گزارش کامل سوابق دانش‌آموز\nنام: ${selected ?? 'همه دانش‌آموزان'}\nبازه: ${periodValue ?? 'کل سال'}\nتاریخ خروجی: ${nowShamsi().date}\n-----------------------------------\n` +
      cardStats.map(s => `${s.label}: ${s.value}`).join('\n')
    
    const element = document.createElement('a')
    const file = new Blob([reportText], { type: 'text/plain;charset=utf-8' })
    element.href = URL.createObjectURL(file)
    element.download = `گزارش_${selected ?? 'کلاس'}_${periodValue ?? 'سال'}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)

    setToast('گزارش کامل دانلود شد')
    setTimeout(() => setToast(null), 1800)
  }

  const handleSaveCategory = () => {
    if (!newValue.trim()) return
    if (editingItem) {
      setCardStats(prev => prev.map(item => item.id === editingItem.id ? { ...item, label: newLabel, value: newValue } : item))
      setToast('آیتم به‌روزرسانی شد')
    } else {
      if (cardStats.length >= 6) {
        setToast('حداکثر ۶ مورد می‌توانید ثبت کنید')
        setTimeout(() => setToast(null), 1600)
        return
      }
      setCardStats(prev => [...prev, { id: String(Date.now()), label: newLabel, value: newValue }])
      setToast('آیتم جدید اضافه شد')
    }
    setEditingItem(null)
    setNewValue('')
    setTimeout(() => setToast(null), 1400)
  }

  const handleDeleteCategory = (id: string) => {
    setCardStats(prev => prev.filter(item => item.id !== id))
    setToast('آیتم حذف شد')
    setTimeout(() => setToast(null), 1400)
  }

  const handleBack = () => {
    if (periodValue) {
      setPeriodValue(null)
      return
    }
    if (selected) {
      setSelected(null)
      return
    }
    if (exportPage) {
      setExportPage(false)
      return
    }
    goBack()
  }

  if (exportPage) {
    const allMonths = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند']
    const studentMatches = students.filter(n => !filterStudentQuery.trim() || n.includes(filterStudentQuery.trim()))
    const toggleCategory = (c: string) => {
      setFilterCategories(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])
    }
    const togglePeriod = (p: string) => {
      setFilterPeriods(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])
    }
    const addStudent = (name: string) => {
      setFilterAllStudents(false)
      setFilterStudents(prev => prev.includes(name) ? prev : [...prev, name])
      setFilterStudentQuery('')
    }
    const removeStudent = (name: string) => {
      setFilterStudents(prev => {
        const next = prev.filter(x => x !== name)
        if (!next.length) setFilterAllStudents(true)
        return next
      })
    }
    const downloadReport = (type: 'csv' | 'pdf') => {
      const chosenStudents = filterAllStudents ? students : filterStudents
      const chosenCats = filterCategories.length ? filterCategories : categoryOptions
      const chosenPeriods = filterPeriods.length ? filterPeriods : (periodMode === 'terms' ? terms : periodMode === 'summer' ? summerMonths : academicMonths)
      const header = ['دانش‌آموز', ...chosenCats, 'بازه']
      const lines = [header.join(',')]
      chosenStudents.forEach((name, i) => {
        const row = [
          name,
          ...chosenCats.map((_, ci) => String(12 + ((i + ci) % 8))),
          chosenPeriods.join(' | ') || 'همه',
        ]
        lines.push(row.join(','))
      })
      const content = lines.join('\n')
      const blob = new Blob(['\ufeff' + content], { type: type === 'csv' ? 'text/csv;charset=utf-8' : 'application/pdf' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = type === 'csv' ? 'گزارش-کلاس.csv' : 'گزارش-کلاس.pdf'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setToast(type === 'csv' ? 'خروجی اکسل (CSV) دانلود شد' : 'خروجی PDF دانلود شد')
      setTimeout(() => setToast(null), 1600)
    }

    return <div className="screen inner-screen">
      <SubHeader
        screen="gradebook"
        back={() => setExportPage(false)}
        title="دریافت خروجی"
        subtitle="فیلتر و دانلود گزارش"
      />
      <main className="inner-content report-builder">
        <section className="report-filter-card">
          <div className="report-filter-head">
            <strong>انتخاب دانش‌آموز</strong>
            <button
              type="button"
              className={`mini-chip ${filterAllStudents ? 'active' : ''}`}
              onClick={() => { setFilterAllStudents(true); setFilterStudents([]) }}
            >
              همه
            </button>
          </div>
          <div className="report-search-row">
            <Icon name="search" size={16} />
            <input
              type="search"
              placeholder="جست‌وجوی نام دانش‌آموز..."
              value={filterStudentQuery}
              onChange={e => setFilterStudentQuery(e.target.value)}
            />
          </div>
          {!!filterStudentQuery.trim() && (
            <div className="report-suggest-list">
              {studentMatches.slice(0, 6).map(name => (
                <button key={name} type="button" onClick={() => addStudent(name)}>
                  <img className="student-photo tiny" src={`https://images.irantarh.com/pr:sharp/rs:fill:0:375:0/plain/s3:/uploads/designs/1401/07/25/ax-irani/41.jpg`} alt="" />
                  <span>{name}</span>
                  <Icon name="plus" size={14} />
                </button>
              ))}
              {!studentMatches.length && <small className="muted">موردی پیدا نشد</small>}
            </div>
          )}
          <div className="report-selected-chips">
            {filterAllStudents ? (
              <span className="selected-chip all">همه دانش‌آموزان</span>
            ) : filterStudents.map(name => (
              <span className="selected-chip" key={name}>
                {name}
                <button type="button" aria-label="حذف" onClick={() => removeStudent(name)}><Icon name="close" size={12} /></button>
              </span>
            ))}
          </div>
        </section>

        <section className="report-filter-card">
          <div className="report-filter-head">
            <strong>دسته‌بندی / نمرات</strong>
            <small>{fa(filterCategories.length)} مورد</small>
          </div>
          <div className="chips compact scrollable" style={{ padding: 0, margin: 0 }}>
            {categoryOptions.map(c => (
              <button
                key={c}
                type="button"
                className={filterCategories.includes(c) ? 'active' : ''}
                onClick={() => toggleCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </section>

        <section className="report-filter-card">
          <div className="report-filter-head">
            <strong>بازه زمانی</strong>
            <small>ماه یا نوبت</small>
          </div>
          <div className="report-period-tabs">
            <button type="button" className={periodMode === 'summer' ? 'active' : ''} onClick={() => setPeriodMode('summer')}>ترم تابستانی</button>
            <button type="button" className={periodMode === 'months' ? 'active' : ''} onClick={() => setPeriodMode('months')}>ماه‌های تحصیلی</button>
            <button type="button" className={periodMode === 'terms' ? 'active' : ''} onClick={() => setPeriodMode('terms')}>نوبت‌ها</button>
          </div>

          {periodMode === 'summer' && (
            <div className="report-period-grid three">
              {summerMonths.map(m => (
                <button
                  key={m}
                  type="button"
                  className={`report-period-card ${filterPeriods.includes(m) ? 'selected' : ''}`}
                  onClick={() => togglePeriod(m)}
                >
                  <strong>{m}</strong>
                  <small>تابستان</small>
                </button>
              ))}
            </div>
          )}

          {periodMode === 'months' && (
            <div className="report-period-grid months">
              {allMonths.map(m => (
                <button
                  key={m}
                  type="button"
                  className={`report-period-card ${filterPeriods.includes(m) ? 'selected' : ''}`}
                  onClick={() => togglePeriod(m)}
                >
                  <strong>{m}</strong>
                  <small>ماه</small>
                </button>
              ))}
            </div>
          )}

          {periodMode === 'terms' && (
            <div className="report-period-grid two">
              {terms.map(m => (
                <button
                  key={m}
                  type="button"
                  className={`report-period-card ${filterPeriods.includes(m) ? 'selected' : ''}`}
                  onClick={() => togglePeriod(m)}
                >
                  <strong>{m}</strong>
                  <small>نوبت</small>
                </button>
              ))}
            </div>
          )}

          {!!filterPeriods.length && (
            <div className="report-selected-chips" style={{ marginTop: 10 }}>
              {filterPeriods.map(p => (
                <span className="selected-chip" key={p}>
                  {p}
                  <button type="button" aria-label="حذف" onClick={() => togglePeriod(p)}><Icon name="close" size={12} /></button>
                </span>
              ))}
            </div>
          )}
        </section>

        <section className="report-filter-card download-card">
          <div className="report-filter-head">
            <strong>خروجی گزارش</strong>
            <small>اکسل یا PDF</small>
          </div>
          <div className="report-download-actions">
            <button type="button" className="download-btn excel" onClick={() => downloadReport('csv')}>
              <Icon name="file" size={18} />
              <div>
                <strong>دانلود اکسل</strong>
                <small>خروجی CSV</small>
              </div>
            </button>
            <button type="button" className="download-btn pdf" onClick={() => downloadReport('pdf')}>
              <Icon name="book" size={18} />
              <div>
                <strong>دانلود PDF</strong>
                <small>خروجی متنی</small>
              </div>
            </button>
          </div>
        </section>
      </main>
      {toast && <div className="toast">{toast}</div>}
    </div>
  }

  // 1) First: student list
  if (!selected) {
    const visibleStudents = students.filter(n => !studentQuery.trim() || n.includes(studentQuery.trim()))
    const entries = (() => {
      switch (detailTab) {
        case 'آزمونک': return ['آزمونک ۱', 'آزمونک ۲', 'آزمونک ۳', 'آزمونک ۴', 'آزمونک ۵']
        case 'تکالیف': return ['تکلیف ۱', 'تکلیف ۲', 'تکلیف ۳', 'تکلیف ۴', 'تکلیف ۵']
        case 'فعالیت کلاسی': return ['فعالیت ۱', 'فعالیت ۲', 'فعالیت ۳', 'فعالیت ۴', 'فعالیت ۵']
        case 'آزمون': return ['آزمون ۱', 'آزمون ۲', 'آزمون ۳', 'آزمون ۴', 'آزمون ۵']
        case 'بازخورد کلاسی': return ['بازخورد ۱', 'بازخورد ۲', 'بازخورد ۳', 'بازخورد ۴', 'بازخورد ۵']
        default: return ['هفته ۱', 'هفته ۲', 'هفته ۳', 'هفته ۴', 'هفته ۵']
      }
    })()
    const isPctTab = detailTab === 'حضور و غیاب'
    const tabIdx = collectiveCats.indexOf(detailTab)
    const scoresFor = (name: string) => {
      const si = students.indexOf(name)
      return entries.map((_, ei) => {
        if (isPctTab) return `${fa(86 + ((si * 7 + ei * 3 + 5) % 15))}٪`
        if (detailTab === 'فعالیت کلاسی') {
          return (si + ei * 2) % 4 === 3 ? 'نیاز به تلاش بیشتر' : 'خیلی خوب'
        }
        if (detailTab === 'بازخورد کلاسی') {
          const opts = ['۳+', '۰', '۲−', '۵+', '۱−', '۰', '۴+']
          return opts[(si + ei * 2) % opts.length]
        }
        if ((si * 5 + ei * 3 + tabIdx) % 7 === 6) return (si + ei) % 2 ? 'نیاز به تلاش بیشتر' : 'خیلی خوب'
        return `${fa(14 + ((si * 3 + ei * 5 + tabIdx * 2) % 7))}/۲۰`
      })
    }
    const toNum = (v: string): number | null => {
      if (v.includes('خیلی خوب')) return 20
      if (v.includes('نیاز به تلاش')) return 10
      const ascii = v.replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
      const num = parseFloat(ascii)
      return Number.isNaN(num) ? null : num
    }
    const avgOf = (nums: number[]) => (nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : null)
    const fmtAvg = (n: number | null) => {
      if (n === null) return '—'
      const v = fa(n.toFixed(1).replace('.', '٫'))
      return isPctTab ? `${v}٪` : `${v}/۲۰`
    }
    const rowNums = (name: string) => scoresFor(name).map(toNum).filter((n): n is number => n !== null)
    const rowAvg = (name: string) => fmtAvg(avgOf(rowNums(name)))
    const colAvg = (ei: number) => fmtAvg(avgOf(
      visibleStudents.map(name => toNum(scoresFor(name)[ei])).filter((n): n is number => n !== null)
    ))
    const overallAvg = fmtAvg(avgOf(
      visibleStudents.map(name => avgOf(rowNums(name))).filter((n): n is number => n !== null)
    ))
    return <div className="screen inner-screen">
      <SubHeader
        screen="gradebook"
        back={goBack}
        title="گزارش‌های کلاس"
        subtitle={reportMode === 'collective' ? 'گزارش جمعی همه دانش‌آموزان' : 'انتخاب دانش‌آموز'}
        rightIcon={null}
        rightExtra={(
          <div className="header-mode-toggle" role="group" aria-label="حالت گزارش">
            <button
              type="button"
              className={reportMode === 'individual' ? 'active' : ''}
              onClick={() => setReportMode('individual')}
            >
              فردی
            </button>
            <button
              type="button"
              className={reportMode === 'collective' ? 'active' : ''}
              onClick={() => setReportMode('collective')}
            >
              جمعی
            </button>
          </div>
        )}
      />
      <main className="inner-content">
        <div className="report-topbar">
          <div className="report-search-row">
            <Icon name="search" size={16} />
            <input
              type="search"
              placeholder="جست‌وجوی نام دانش‌آموز..."
              value={studentQuery}
              onChange={e => setStudentQuery(e.target.value)}
            />
          </div>
          <button type="button" className="export-mini" onClick={() => setExportPage(true)}>خروجی</button>
        </div>
        {reportMode === 'individual' ? (
          <>
            <div className="section-heading">
              <strong>دانش‌آموزان</strong>
              <span>{fa(visibleStudents.length)} نفر</span>
            </div>
            {visibleStudents.length === 0 ? (
              <div className="report-empty-hint">دانش‌آموزی با این نام پیدا نشد.</div>
            ) : visibleStudents.map((name) => (
              <button
                className="student student-row-photo"
                key={name}
                onClick={() => { setSelected(name); setDetailTab('بازخورد کلاسی'); setWeekIndex(0); setPeriodValue(null) }}
                style={{width:'100%', border:0, background:'transparent', cursor:'pointer'}}
              >
                <img
                  className="student-photo"
                  src={`https://images.irantarh.com/pr:sharp/rs:fill:0:375:0/plain/s3:/uploads/designs/1401/07/25/ax-irani/41.jpg`}
                  alt={name}
                />
                <strong>{name}</strong>
              </button>
            ))}
          </>
        ) : (
          <>
            <div className="section-heading">
              <strong>گزارش جمعی</strong>
              <span>{fa(visibleStudents.length)} نفر</span>
            </div>
            <div className="chips compact scrollable student-detail-tabs" style={{ marginBottom: 10 }}>
              {collectiveCats.map(tab => (
                <button
                  key={tab}
                  type="button"
                  className={detailTab === tab ? 'active' : ''}
                  onClick={() => setDetailTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            {visibleStudents.length === 0 ? (
              <div className="report-empty-hint">دانش‌آموزی با این نام پیدا نشد.</div>
            ) : detailTab === 'حضور و غیاب' ? (() => {
              const months = ['مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند', 'فروردین', 'اردیبهشت', 'خرداد']
              const attFor = (name: string) => {
                const si = students.indexOf(name)
                return months.map((_, mi) => {
                  const delay = (si * 3 + mi * 2) % 3
                  const absent = (si * 5 + mi * 3) % 3
                  return { delay, absent }
                })
              }
              const sumPair = (pairs: { delay: number; absent: number }[]) => ({
                delay: pairs.reduce((s, p) => s + p.delay, 0),
                absent: pairs.reduce((s, p) => s + p.absent, 0),
              })
              const classMonth = months.map((_, mi) => {
                const delays = visibleStudents.map(n => attFor(n)[mi].delay)
                const absents = visibleStudents.map(n => attFor(n)[mi].absent)
                return {
                  delay: delays.reduce((a, b) => a + b, 0),
                  absent: absents.reduce((a, b) => a + b, 0),
                }
              })
              const classTotal = sumPair(classMonth)
              return (
                <div className="assignment-table-wrap">
                  <table className="report-detail-table collective-table att-month-table" dir="rtl">
                    <thead>
                      <tr>
                        <th rowSpan={2}>#</th>
                        <th rowSpan={2}>دانش‌آموز</th>
                        {months.map(m => (
                          <th key={m} colSpan={2} className="month-group-head">{m}</th>
                        ))}
                        <th colSpan={2} className="month-group-head total-head">جمع</th>
                      </tr>
                      <tr>
                        {months.flatMap(m => [
                          <th key={`${m}-d`} className="sub-col">تأخیر</th>,
                          <th key={`${m}-a`} className="sub-col">غیبت</th>,
                        ])}
                        <th className="sub-col">تأخیر</th>
                        <th className="sub-col">غیبت</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleStudents.map((name, i) => {
                        const pairs = attFor(name)
                        const total = sumPair(pairs)
                        return (
                          <tr key={name}>
                            <td>{fa(i + 1)}</td>
                            <td><strong>{name}</strong></td>
                            {pairs.flatMap((p, mi) => [
                              <td key={`${name}-d-${mi}`}>{p.delay ? fa(p.delay) : '—'}</td>,
                              <td key={`${name}-a-${mi}`}>{p.absent ? fa(p.absent) : '—'}</td>,
                            ])}
                            <td className="avg-cell total-delay">{total.delay ? fa(total.delay) : '—'}</td>
                            <td className="avg-cell total-absent">{total.absent ? fa(total.absent) : '—'}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                    <tfoot className="collective-foot">
                      <tr>
                        <td colSpan={2}><strong>جمع کلاس</strong></td>
                        {classMonth.flatMap((p, mi) => [
                          <td key={`c-d-${mi}`} className="foot-delay">{p.delay ? fa(p.delay) : '—'}</td>,
                          <td key={`c-a-${mi}`} className="foot-absent">{p.absent ? fa(p.absent) : '—'}</td>,
                        ])}
                        <td className="foot-delay total-delay">{classTotal.delay ? fa(classTotal.delay) : '—'}</td>
                        <td className="foot-absent total-absent">{classTotal.absent ? fa(classTotal.absent) : '—'}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )
            })() : (
              <div className="assignment-table-wrap">
                <table className="report-detail-table collective-table" dir="rtl">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>دانش‌آموز</th>
                      {entries.map(e => <th key={e}>{e}</th>)}
                      {detailTab !== 'فعالیت کلاسی' && detailTab !== 'بازخورد کلاسی' && <th>میانگین وزنی</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {visibleStudents.map((name, i) => (
                      <tr key={name}>
                        <td>{fa(i + 1)}</td>
                        <td><strong>{name}</strong></td>
                        {scoresFor(name).map((v, ei) => <td key={ei}>{v}</td>)}
                        {detailTab !== 'فعالیت کلاسی' && detailTab !== 'بازخورد کلاسی' && <td className="avg-cell">{rowAvg(name)}</td>}
                      </tr>
                    ))}
                  </tbody>
                  {detailTab !== 'فعالیت کلاسی' && detailTab !== 'بازخورد کلاسی' && (
                    <tfoot className="collective-foot">
                      <tr>
                        <td colSpan={2}><strong>میانگین وزنی کلاس</strong></td>
                        {entries.map((e, ei) => <td key={e}>{colAvg(ei)}</td>)}
                        <td>{overallAvg}</td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  }

  // period selection removed: go straight to detail view

  return <div className="screen inner-screen">
    <SubHeader
      screen="gradebook"
      back={handleBack}
      title={selected ?? periodValue}
      subtitle={selected ? (periodValue ?? undefined) : (periodMode === 'summer' ? 'ترم تابستانی' : periodMode === 'terms' ? 'نوبت‌ها' : 'ماه‌های تحصیلی')}
      rightIcon="file"
      rightLabel="دانلود گزارش"
      onRightClick={handleDownloadFullReport}
    />
    <main className="inner-content">
        <div className="student-card-wrap">
          <div className="student-fifa-card">
            <button
              type="button"
              className="fifa-edit-btn"
              onClick={handleDownloadFullReport}
              aria-label="دانلود گزارش کارت"
            >
              <Icon name="download" size={16} />
            </button>
            <div className="fifa-art">
              <img
                src={`https://images.irantarh.com/pr:sharp/rs:fill:0:375:0/plain/s3:/uploads/designs/1401/07/25/ax-irani/41.jpg`}
                alt={selected}
              />
            </div>
            <div className="fifa-left">
              <div className="fifa-overall">
                <b>{cardStats[0]?.value ?? '۱۵'}</b>
                <span>کلی</span>
              </div>
              <span className="fifa-flag" role="img" aria-label="ایران">🇮🇷</span>
              <small className="fifa-class">۹۰۱</small>
            </div>
            <div className="fifa-bottom">
              <strong className="fifa-name">{selected}</strong>
              <small className="fifa-sub">علوم تجربی · {periodValue}</small>
              <div className="fifa-stats" onClick={() => setEditModalOpen(true)} style={{ cursor: 'pointer' }}>
                <div className="fifa-col">
                  {cardStats.slice(0, 3).map(item => (
                    <div key={item.id} className="fifa-stat">
                      <b>{item.value}</b>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
                <div className="fifa-divider" />
                <div className="fifa-col">
                  {cardStats.slice(3, 6).map(item => (
                    <div key={item.id} className="fifa-stat">
                      <b>{item.value}</b>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="chips compact scrollable student-detail-tabs" style={{ marginTop: 14, marginBottom: 10 }}>
            {collectiveCats.map(tab => (
              <button
                key={tab}
                type="button"
                className={detailTab === tab ? 'active' : ''}
                onClick={() => setDetailTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {(() => {
            const si = selected ? students.indexOf(selected) : 0
            const d = (offset: number) => `۱۴۰۵/${fa(7).padStart(2, '۰')}/${fa(weekIndex * 7 + offset).padStart(2, '۰')}`

            if (detailTab === 'حضور و غیاب') {
              const totalSessions = 14
              const absences = [
                { date: d(2), kind: 'غایب' as const, note: 'بدون اطلاع' },
                { date: d(5), kind: 'تأخیر' as const, note: '۱۲ دقیقه' },
                { date: d(8), kind: 'غایب' as const, note: 'موجه' },
                { date: d(11), kind: 'تأخیر' as const, note: '۸ دقیقه' },
              ].slice(0, 2 + (si % 3))
              const delayCount = absences.filter(a => a.kind === 'تأخیر').length
              const absentCount = absences.filter(a => a.kind === 'غایب').length
              const presentCount = totalSessions - absentCount - delayCount
              const pct = Math.round((presentCount / totalSessions) * 100)

              return (
                <>
                  <div className="week-summary-banner">
                    <div className="week-summary-item">
                      <strong>{fa(delayCount)}</strong>
                      <span>تأخیر</span>
                    </div>
                    <div className="week-summary-item">
                      <strong className={absentCount ? 'danger-text' : undefined}>{fa(absentCount)}</strong>
                      <span>غیبت</span>
                    </div>
                    <div className="week-summary-item">
                      <strong>{fa(pct)}٪</strong>
                      <span>درصد حضور</span>
                    </div>
                  </div>

                  <div className="week-days-list">
                    <div className="section-heading" style={{ margin: '4px 0 8px' }}>
                      <strong>تأخیر و غیبت‌ها</strong>
                      <span>از {fa(totalSessions)} جلسه</span>
                    </div>
                    <div className="assignment-table-wrap">
                      <table className="report-detail-table" dir="rtl">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>تاریخ</th>
                            <th>وضعیت</th>
                            <th>توضیح</th>
                            <th>پیام</th>
                          </tr>
                        </thead>
                        <tbody>
                          {absences.length === 0 ? (
                            <tr>
                              <td colSpan={5} style={{ textAlign: 'center', padding: 16, color: 'var(--muted)' }}>
                                تأخیر یا غیبتی ثبت نشده است.
                              </td>
                            </tr>
                          ) : absences.map((a, i) => (
                            <tr key={i}>
                              <td>{fa(i + 1)}</td>
                              <td>{a.date}</td>
                              <td>
                                <span className={`status-pill ${a.kind === 'غایب' ? 'wait' : 'ok'}`}>
                                  {a.kind}
                                </span>
                              </td>
                              <td>{a.note}</td>
                              <td>
                                <button
                                  type="button"
                                  className="table-action-btn register"
                                  onClick={() => {
                                    setToast(`پیام برای والدین ${selected || ''} ارسال شد`)
                                    setTimeout(() => setToast(null), 1600)
                                  }}
                                >
                                  پیام به والدین
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )
            }

            type Ev = { date: string; name: string; type: string; score: number | null; max: number; desc: string }
            const byTab: Record<string, Ev[]> = {
              'آزمونک': [
                { date: d(1), name: 'آزمونک فصل ۱', type: 'آزمونک', score: 1, max: 5, desc: 'کوتاه' },
                { date: d(2), name: 'آزمونک فصل ۲', type: 'آزمونک', score: 4, max: 5, desc: 'مبحث جمع' },
                { date: d(3), name: 'آزمونک فصل ۳', type: 'آزمونک', score: null, max: 3, desc: 'غایب در جلسه' },
                { date: d(4), name: 'آزمونک مرور', type: 'آزمونک', score: 2, max: 3, desc: 'خوب' },
                { date: d(5), name: 'آزمونک پایانی', type: 'آزمونک', score: 14, max: 20, desc: 'جامع' },
              ],
              'تکالیف': [
                { date: d(1), name: 'تکلیف فصل ۱', type: 'تکالیف', score: 17, max: 20, desc: 'تحویل به موقع' },
                { date: d(2), name: 'تکلیف فصل ۲', type: 'تکالیف', score: 14, max: 20, desc: 'ناقص' },
                { date: d(3), name: 'تکلیف فصل ۳', type: 'تکالیف', score: null, max: 20, desc: 'غایب در جلسه' },
                { date: d(4), name: 'تکلیف مرور', type: 'تکالیف', score: 3, max: 5, desc: 'کوتاه' },
                { date: d(5), name: 'تکلیف پروژه', type: 'تکالیف', score: 16, max: 20, desc: 'پروژه گروهی' },
              ],
              'فعالیت کلاسی': [
                { date: d(1), name: 'فعالیت ۱', type: 'فعالیت کلاسی', score: 5, max: 5, desc: 'مشارکت' },
                { date: d(2), name: 'فعالیت ۲', type: 'فعالیت کلاسی', score: 4, max: 5, desc: 'گروهی' },
                { date: d(3), name: 'فعالیت ۳', type: 'فعالیت کلاسی', score: null, max: 5, desc: 'غایب در جلسه' },
                { date: d(4), name: 'فعالیت ۴', type: 'فعالیت کلاسی', score: 14, max: 20, desc: 'ارائه' },
                { date: d(5), name: 'فعالیت ۵', type: 'فعالیت کلاسی', score: 3, max: 5, desc: 'تمرین کلاسی' },
              ],
              'آزمون': [
                { date: d(1), name: 'آزمون میان‌ترم', type: 'آزمون', score: 16, max: 20, desc: 'فصل ۱–۳' },
                { date: d(2), name: 'آزمون فصلی', type: 'آزمون', score: 14, max: 20, desc: 'فصل ۲' },
                { date: d(3), name: 'آزمون عملی', type: 'آزمون', score: null, max: 20, desc: 'غایب در جلسه' },
                { date: d(4), name: 'آزمون کتبی', type: 'آزمون', score: 18, max: 20, desc: 'خوب' },
                { date: d(5), name: 'آزمون پایانی', type: 'آزمون', score: 15, max: 20, desc: 'نهایی' },
              ],
              'بازخورد کلاسی': [
                { date: d(1), name: 'بازخورد ۱', type: 'بازخورد کلاسی', score: 3, max: 1, desc: 'مشارکت فعال در بحث کلاس' },
                { date: d(1), name: 'بازخورد ۲', type: 'بازخورد کلاسی', score: 2, max: 1, desc: 'پاسخ کامل به پرسش معلم' },
                { date: d(2), name: 'بازخورد ۱', type: 'بازخورد کلاسی', score: -2, max: 1, desc: 'نیاز به تمرکز بیشتر هنگام تدریس' },
                { date: d(3), name: 'بازخورد ۱', type: 'بازخورد کلاسی', score: 0, max: 1, desc: 'حضور داشت؛ مشارکت خنثی بود' },
                { date: d(3), name: 'بازخورد ۲', type: 'بازخورد کلاسی', score: 4, max: 1, desc: 'همکاری خوب در گروه' },
                { date: d(3), name: 'بازخورد ۳', type: 'بازخورد کلاسی', score: -1, max: 1, desc: 'تذکر دربارهٔ نظم کلاس' },
                { date: d(4), name: 'بازخورد ۱', type: 'بازخورد کلاسی', score: 5, max: 1, desc: 'ارائهٔ روشن و منسجم' },
              ],
            }
            const events = (byTab[detailTab] ?? byTab['آزمونک']).map((e, idx) => {
              if (idx === 2 && si % 2 === 1) return { ...e, score: Math.max(1, e.max - 1), desc: 'شرکت کرده' }
              return e
            })
            const attended = events.filter(e => e.score !== null)
            // normalize each score to 20, then simple average
            const avg20 = attended.length
              ? attended.reduce((s, e) => s + ((e.score as number) / e.max) * 20, 0) / attended.length
              : 0
            const avgLabel = attended.length ? fa(avg20.toFixed(1)) : '—'
            const partLabel = `${fa(attended.length)} از ${fa(events.length)}`
            const fbPlus = events.filter(e => (e.score ?? 0) > 0).length
            const fbMinus = events.filter(e => (e.score ?? 0) < 0).length
            const fbPlusSum = events.filter(e => (e.score ?? 0) > 0).reduce((s, e) => s + (e.score as number), 0)
            const fbMinusSum = events.filter(e => (e.score ?? 0) < 0).reduce((s, e) => s + Math.abs(e.score as number), 0)

            return (
              <>
                {detailTab === 'بازخورد کلاسی' ? (
                <div className="week-summary-banner">
                  <div className="week-summary-item">
                    <strong className="fb-plus-text">{fa(fbPlusSum)}+</strong>
                    <span>{fa(fbPlus)} مورد مثبت</span>
                  </div>
                  <div className="week-summary-item">
                    <strong className="danger-text">{fa(fbMinusSum)}−</strong>
                    <span>{fa(fbMinus)} مورد منفی</span>
                  </div>
                </div>
                ) : (
                <div className="week-summary-banner">
                  <div className="week-summary-item">
                    <strong>{avgLabel}</strong>
                    <span>میانگین از ۲۰</span>
                  </div>
                  <div className="week-summary-item">
                    <strong>{partLabel}</strong>
                    <span>شرکت‌کرده</span>
                  </div>
                  <div className="week-summary-item">
                    <strong className={events.length - attended.length ? 'danger-text' : undefined}>
                      {fa(events.length - attended.length)}
                    </strong>
                    <span>غایب</span>
                  </div>
                </div>
                )}

                <div className="week-days-list">
                  <div className="section-heading" style={{ margin: '4px 0 8px' }}>
                    <strong>{detailTab === 'بازخورد کلاسی' ? 'بازخوردهای ثبت‌شده' : 'رویدادهای این کلاس'}</strong>
                    <span>{detailTab === 'بازخورد کلاسی' ? `${fa(new Set(events.map(e => e.date)).size)} روز · ${fa(events.length)} بازخورد` : `${partLabel} شرکت کرده`}</span>
                  </div>
                  <div className="assignment-table-wrap">
                    <table className={`report-detail-table${detailTab === 'بازخورد کلاسی' ? ' feedback-date-table' : ''}`} dir="rtl">
                      <thead>
                        <tr>
                          {detailTab === 'بازخورد کلاسی' ? (
                            <>
                              <th>تاریخ</th>
                              <th>بازخوردها</th>
                              <th>امتیاز</th>
                              <th>توضیحات</th>
                            </>
                          ) : (
                            <>
                              <th>#</th>
                              <th>تاریخ</th>
                              <th>عنوان</th>
                              <th>نمره</th>
                              <th>توضیح</th>
                              <th>صوت</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {detailTab === 'بازخورد کلاسی' ? (() => {
                          const groups: { date: string; items: typeof events }[] = []
                          events.forEach(e => {
                            const g = groups.find(x => x.date === e.date)
                            if (g) g.items.push(e)
                            else groups.push({ date: e.date, items: [e] })
                          })
                          return groups.map((g) => (
                            <tr key={g.date}>
                              <td>{g.date}</td>
                              <td className="feedback-stack-cell">
                                <div className="feedback-stack">
                                  {g.items.map((_, fi) => (
                                    <div className="feedback-stack-item" key={fi}>
                                      <strong>{fa(fi + 1)}</strong>
                                    </div>
                                  ))}
                                </div>
                              </td>
                              <td className="feedback-stack-cell">
                                <div className="feedback-stack">
                                  {g.items.map((e, fi) => {
                                    const val = e.score ?? 0
                                    const pol = val > 0 ? 'plus' : val < 0 ? 'minus' : 'zero'
                                    const polLabel = val > 0 ? `${fa(val)}+` : val < 0 ? `${fa(Math.abs(val))}−` : '۰'
                                    return (
                                      <div className="feedback-stack-item score-only" key={fi}>
                                        <span className={`feedback-polarity ${pol}`}>{polLabel}</span>
                                      </div>
                                    )
                                  })}
                                </div>
                              </td>
                              <td className="feedback-stack-cell">
                                <div className="feedback-stack">
                                  {g.items.map((e, fi) => (
                                    <div className="feedback-stack-item desc-only" key={fi} title={e.desc || ''}>
                                      <small>{e.desc || '—'}</small>
                                    </div>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          ))
                        })() : events.map((e, i) => (
                          <tr key={i}>
                            <td>{fa(i + 1)}</td>
                            <td>{e.date}</td>
                            <td>{e.name}</td>
                            <td>
                              {e.score === null
                                ? <span className="status-pill wait">غایب</span>
                                : `${fa(e.score)}/${fa(e.max)}`}
                            </td>
                            <td>{e.desc}</td>
                            <td>
                              {e.score === null ? (
                                <span className="muted-dash">—</span>
                              ) : (
                                <button type="button" className="table-action-btn view" onClick={() => setToast('پخش صوت')}>
                                  <Icon name="play" size={14} />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )
          })()}

          {/* student-detail-panel removed */}
        </div>
    </main>

    {editModalOpen && (
      <div className="overlay group-grade-overlay" onClick={() => setEditModalOpen(false)}>
        <div className="bottom-sheet group-grade-sheet" onClick={e => e.stopPropagation()}>
          <div className="sheet-handle" />
          <div className="sheet-title">
            <div>
              <strong>مدیریت موارد گزارش کارت فیفا</strong>
              <span>حذف، ویرایش و جایگزینی آیتم‌های گزارش</span>
            </div>
            <IconButton icon="close" label="بستن" onClick={() => setEditModalOpen(false)} />
          </div>

          <div className="fifa-edit-list">
            {cardStats.map(item => (
              <div className="fifa-edit-item" key={item.id}>
                <div>
                  <strong>{item.label}</strong>
                  <small>مقدار: {item.value}</small>
                </div>
                <div className="fifa-edit-actions">
                  <button type="button" className="fifa-edit-sub-btn" onClick={() => { setEditingItem(item); setNewLabel(item.label); setNewValue(item.value) }}>
                    <Icon name="pencil" size={14} />
                  </button>
                  <button type="button" className="fifa-edit-sub-btn danger" onClick={() => handleDeleteCategory(item.id)}>
                    <Icon name="close" size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="group-grade-body" style={{ marginTop: 12 }}>
            <label className="field">
              <span>{editingItem ? 'تغییر دسته‌بندی' : 'انتخاب دسته‌بندی جدید'}</span>
              <select value={newLabel} onChange={e => setNewLabel(e.target.value)}>
                {categoryOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>مقدار / نمره</span>
              <input
                type="text"
                placeholder="مثلاً ۱۸ یا ۹۵٪"
                value={newValue}
                onChange={e => setNewValue(e.target.value)}
              />
            </label>
          </div>

          <div className="group-grade-footer">
            <button type="button" className="secondary" onClick={() => setEditModalOpen(false)}>بستن</button>
            <button type="button" className="primary" onClick={handleSaveCategory}>
              {editingItem ? 'جایگزینی و ذخیره' : 'افزودن مورد جدید'}
            </button>
          </div>
        </div>
      </div>
    )}

    {toast && <div className="toast">{toast}</div>}
  </div>
}

function Auth({ navigate, goBack, setRole }: { navigate: (s: Screen) => void; goBack: () => void; setRole: (r: UserRole) => void }) {
  const [leaving, setLeaving] = useState<UserRole | null>(null)

  const enterAs = (role: UserRole) => {
    if (leaving) return
    setLeaving(role)
    setRole(role)
    window.setTimeout(() => {
      navigate('messenger')
    }, 280)
  }

  return <div className={`screen inner-screen auth-screen ${leaving ? 'auth-leaving' : ''}`}>
    <header className="sub-header">
      <IconButton icon="chevron" label="بازگشت" onClick={goBack} />
      <div><strong>احراز هویت</strong><span>انتخاب نقش کاربری</span></div>
      <IconButton icon="lock" label="امن" />
    </header>
    <main className="inner-content classroom-content">
      <div className="display-banner">
        <span className="display-banner-icon"><Icon name="lock" /></span>
        <div>
          <strong>احراز هویت</strong>
          <small>برای ادامه، نقش خود را انتخاب کنید</small>
        </div>
      </div>
      <div className="classroom-grid">
        <button
          className={leaving === 'teacher' ? 'active-role' : ''}
          onClick={() => enterAs('teacher')}
          disabled={!!leaving}
        >
          <span><Icon name="person" /></span>
          <strong>معلم</strong>
          <small>مدیریت کلاس، نمرات و تکالیف</small>
        </button>
        <button
          className={leaving === 'student' ? 'active-role' : ''}
          onClick={() => enterAs('student')}
          disabled={!!leaving}
        >
          <span><Icon name="users" /></span>
          <strong>دانش‌آموز</strong>
          <small>مشاهدهٔ دروس و ارسال تکلیف</small>
        </button>
      </div>
      {leaving && (
        <div className="auth-enter-hint">
          در حال ورود به پیام‌رسان...
        </div>
      )}
    </main>
  </div>
}

function StorageGauge({ used, total, mini = false }: { used: number; total: number; mini?: boolean }) {
  const uid = useId()
  const ratio = Math.max(0, Math.min(1, used / total))
  const usedLabel = used % 1 === 0 ? String(used) : used.toFixed(1)
  const topY = 14
  const botY = 62
  const cx = 48
  const rx = 36
  const ry = 10
  const wall = 7
  const innerRx = rx - wall
  const innerRy = ry - 2.5
  const fillTop = botY - (botY - topY) * ratio
  const width = mini ? 80 : 136
  const height = mini ? 64 : 110
  return (
    <span className={`storage-gauge ${mini ? 'mini' : ''}`} style={{ width, height, position: 'relative', display: 'inline-block' }}>
      <svg viewBox="0 0 96 84" width={width} height={height} aria-hidden="true">
        <defs>
          <clipPath id={`tube-${uid}`}>
            <path d={`M${cx - innerRx} ${topY} A${innerRx} ${innerRy} 0 0 1 ${cx + innerRx} ${topY} V${botY} A${innerRx} ${innerRy} 0 0 1 ${cx - innerRx} ${botY} Z`} />
          </clipPath>
        </defs>
        <rect
          x={cx - innerRx}
          y={fillTop}
          width={innerRx * 2}
          height={botY + innerRy - fillTop}
          fill="rgba(17,156,120,.22)"
          clipPath={`url(#tube-${uid})`}
        />
        <ellipse cx={cx} cy={fillTop} rx={innerRx} ry={innerRy} fill="rgba(17,156,120,.42)" />
        <path
          d={`M${cx - rx} ${topY} V${botY} A${rx} ${ry} 0 0 0 ${cx + rx} ${botY} V${topY}`}
          fill="none"
          stroke="var(--green)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <ellipse cx={cx} cy={topY} rx={rx} ry={ry} fill="none" stroke="var(--green)" strokeWidth="3.5" />
        <ellipse cx={cx} cy={topY} rx={innerRx} ry={innerRy} fill="white" stroke="var(--green)" strokeWidth="2.5" />
        <ellipse cx={cx} cy={botY} rx={rx} ry={ry} fill="none" stroke="var(--green)" strokeWidth="3.5" />
      </svg>
      <em className="storage-gauge-label">{usedLabel}/10 گیگ</em>
    </span>
  )
}

function StorageManage({ goBack }: { goBack: () => void }) {
  type FileItem = { id: string; name: string; meta: string; size: number }
  type CatItem = { id: string; title: string; icon: IconName; files: FileItem[] }

  const [cats, setCats] = useState<CatItem[]>([
    {
      id: 'assignments', title: 'تکالیف', icon: 'book',
      files: [
        { id: 'a1', name: 'پاسخ تمرین فصل سوم.pdf', meta: 'علی احمدی · ۲٫۱ مگ', size: 0.35 },
        { id: 'a2', name: 'گزارش آزمایش.docx', meta: 'فاطمه محمدی · ۱٫۴ مگ', size: 0.28 },
        { id: 'a3', name: 'تصاویر تکلیف.zip', meta: 'آراد حسینی · ۸٫۲ مگ', size: 0.52 },
        { id: 'a4', name: 'ویس توضیح تکلیف.m4a', meta: 'یسنا کریمی · ۳٫۱ مگ', size: 0.25 },
        { id: 'a5', name: 'پروژه گروهی.pdf', meta: 'امیررضا صالحی · ۴٫۵ مگ', size: 0.4 },
      ],
    },
    {
      id: 'exams', title: 'آزمون‌ها', icon: 'exam',
      files: [
        { id: 'e1', name: 'پاسخ آزمونک فصل ۲.pdf', meta: 'مبینا اکبری · ۱٫۱ مگ', size: 0.2 },
        { id: 'e2', name: 'برگه آزمون میان‌ترم.pdf', meta: 'علی احمدی · ۲٫۴ مگ', size: 0.3 },
        { id: 'e3', name: 'فایل صوتی پاسخ.m4a', meta: 'فاطمه محمدی · ۵٫۰ مگ', size: 0.35 },
        { id: 'e4', name: 'آزمون عملی.zip', meta: 'آراد حسینی · ۶٫۲ مگ', size: 0.35 },
      ],
    },
    {
      id: 'materials', title: 'منابع کلاسی', icon: 'file',
      files: [
        { id: 'm1', name: 'جزوه فصل سوم.pdf', meta: 'منبع معلم · ۲٫۴ مگ', size: 0.4 },
        { id: 'm2', name: 'ویدیو آزمایش.mp4', meta: 'منبع معلم · ۱۸ مگ', size: 0.55 },
        { id: 'm3', name: 'اسلاید درس.pptx', meta: 'منبع معلم · ۵٫۱ مگ', size: 0.3 },
        { id: 'm4', name: 'فایل صوتی درس.mp3', meta: 'منبع معلم · ۴٫۱ مگ', size: 0.25 },
      ],
    },
    {
      id: 'media', title: 'رسانه‌های گفتگو', icon: 'image',
      files: [
        { id: 'g1', name: 'تصویر تخته.jpg', meta: 'گفتگو · ۲٫۲ مگ', size: 0.25 },
        { id: 'g2', name: 'ویس کلاس.m4a', meta: 'گفتگو · ۳٫۸ مگ', size: 0.3 },
        { id: 'g3', name: 'عکس فعالیت.png', meta: 'گفتگو · ۱٫۶ مگ', size: 0.2 },
        { id: 'g4', name: 'فایل پیوست.pdf', meta: 'گفتگو · ۲٫۱ مگ', size: 0.15 },
      ],
    },
  ])
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null)
  const [selected, setSelected] = useState<string[]>([])
  const [toast, setToast] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')

  const q = query.trim()
  const visibleCats = cats.map(c => ({
    ...c,
    files: q
      ? c.files.filter(f => f.name.includes(q) || f.meta.includes(q) || c.title.includes(q))
      : c.files,
  })).filter(c => !q || c.files.length > 0)

  const allFiles = cats.flatMap(c => c.files)
  const used = allFiles.reduce((s, f) => s + f.size, 0)
  const total = 10
  const fmt = (n: number) => {
    const s = n % 1 === 0 ? String(n) : n.toFixed(1)
    return fa(s).replace(/\./g, '٫')
  }

  const toggleFile = (id: string) => {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  }

  const toggleCatFiles = (cat: CatItem) => {
    const ids = cat.files.map(f => f.id)
    if (!ids.length) return
    const allOn = ids.every(id => selected.includes(id))
    setSelected(s => allOn ? s.filter(id => !ids.includes(id)) : Array.from(new Set([...s, ...ids])))
  }

  const toggleAll = () => {
    if (!allFiles.length) return
    if (selected.length === allFiles.length) setSelected([])
    else setSelected(allFiles.map(f => f.id))
  }

  const removeSelected = () => {
    if (!selected.length) {
      setToast('موردی برای حذف انتخاب نشده است')
      setTimeout(() => setToast(null), 1600)
      return
    }
    const count = selected.length
    setCats(list => list.map(c => ({
      ...c,
      files: c.files.filter(f => !selected.includes(f.id)),
    })))
    setSelected([])
    setToast(`${fa(count)} مورد حذف شد`)
    setTimeout(() => setToast(null), 1600)
  }

  const selectedCat = cats.find(cat => cat.id === selectedCatId)

  if (selectedCat) {
    const categoryFiles = q
      ? selectedCat.files.filter(file => file.name.includes(q) || file.meta.includes(q))
      : selectedCat.files
    const categorySelected = selectedCat.files.length > 0 &&
      selectedCat.files.every(file => selected.includes(file.id))

    return (
      <div className="screen inner-screen">
        <SubHeader
          screen="storage"
          back={() => { setSelectedCatId(null); setQuery(''); setSearchOpen(false) }}
          title={selectedCat.title}
          subtitle={`${fa(selectedCat.files.length)} مورد · ${fmt(selectedCat.files.reduce((sum, file) => sum + file.size, 0))} گیگ`}
          rightIcon={null}
          showSearchBtn
          searchOpen={searchOpen}
          searchValue={query}
          onSearchClick={() => setSearchOpen(true)}
          onSearchChange={setQuery}
          onSearchClose={() => { setSearchOpen(false); setQuery('') }}
          searchPlaceholder="جست‌وجو در این بخش..."
        />
        <main className="inner-content form-page">
          <div className="storage-section-head">
            <strong>فایل‌های {selectedCat.title}</strong>
            <button
              type="button"
              className="storage-select-all"
              onClick={() => toggleCatFiles(selectedCat)}
              disabled={!selectedCat.files.length}
            >
              {categorySelected ? 'لغو انتخاب همه' : 'انتخاب همه'}
            </button>
          </div>
          {categoryFiles.length === 0 ? (
            <div className="empty compact-empty">
              <Icon name="search" size={32} />
              <strong>{selectedCat.files.length ? 'نتیجه‌ای پیدا نشد' : 'این بخش خالی است'}</strong>
              <span>{selectedCat.files.length ? 'عبارت جست‌وجو را تغییر دهید.' : 'فایلی در این دسته‌بندی ذخیره نشده است.'}</span>
            </div>
          ) : (
            <div className="storage-list">
              <div className="storage-group open">
                <div className="storage-files">
                  {categoryFiles.map(file => {
                    const checked = selected.includes(file.id)
                    return (
                      <button
                        type="button"
                        key={file.id}
                        className={`storage-file-row ${checked ? 'checked' : ''}`}
                        onClick={() => toggleFile(file.id)}
                      >
                        <span className={`storage-check ${checked ? 'on' : ''}`} />
                        <div>
                          <strong>{file.name}</strong>
                          <small>{file.meta}</small>
                        </div>
                        <span className="storage-row-size">{fmt(file.size)} گیگ</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </main>
        {selectedCat.files.length > 0 && (
          <div className="sticky-action">
            <button disabled={!selected.length} onClick={removeSelected}>
              {selected.length ? `حذف ${fa(selected.length)} مورد انتخاب‌شده` : 'حذف انتخاب‌شده‌ها'}
            </button>
          </div>
        )}
        {toast && <div className="toast">{toast}</div>}
      </div>
    )
  }

  return (
    <div className="screen inner-screen">
      <SubHeader
        screen="storage"
        back={goBack}
        title="مدیریت حافظه"
        subtitle={`${fmt(used)} از ${fa(total)} گیگ استفاده شده`}
        rightIcon={null}
        showSearchBtn
        searchOpen={searchOpen}
        searchValue={query}
        onSearchClick={() => setSearchOpen(true)}
        onSearchChange={setQuery}
        onSearchClose={() => { setSearchOpen(false); setQuery('') }}
        searchPlaceholder="جست‌وجو در فایل‌ها..."
      />
      <main className="inner-content form-page">
        <div className="storage-hero">
          <StorageGauge used={used} total={total} />
          <div className="storage-summary">
            <strong>{fmt(used)} گیگ استفاده شده</strong>
            <span>{fmt(Math.max(0, total - used))} گیگ آزاد</span>
          </div>
        </div>
        <div className="storage-section-head">
          <strong>موارد ذخیره‌شده</strong>
          <button type="button" className="storage-select-all" onClick={toggleAll} disabled={!allFiles.length}>
            {allFiles.length && selected.length === allFiles.length ? 'لغو انتخاب همه' : 'انتخاب همه'}
          </button>
        </div>
        {allFiles.length === 0 ? (
          <div className="empty compact-empty">
            <Icon name="check" size={32} />
            <strong>موردی برای حذف نیست</strong>
            <span>همه فایل‌ها پاک شده‌اند و حافظه آزاد است.</span>
          </div>
        ) : visibleCats.length === 0 ? (
          <div className="empty compact-empty">
            <Icon name="search" size={32} />
            <strong>نتیجه‌ای پیدا نشد</strong>
            <span>عبارت جست‌وجو را تغییر دهید.</span>
          </div>
        ) : (
          <div className="storage-list">
            {visibleCats.map(cat => {
              const catSize = cat.files.reduce((s, f) => s + f.size, 0)
              const catSelected = cat.files.length > 0 && cat.files.every(f => selected.includes(f.id))
              return (
                <div className="storage-group" key={cat.id}>
                  <button
                    type="button"
                    className={`storage-row ${catSelected ? 'checked' : ''}`}
                    onClick={() => { setSelectedCatId(cat.id); setQuery(''); setSearchOpen(false) }}
                  >
                    <span
                      className={`storage-check ${catSelected ? 'on' : ''}`}
                      onClick={e => { e.stopPropagation(); toggleCatFiles(cat) }}
                    />
                    <span className="storage-row-icon"><Icon name={cat.icon} /></span>
                    <div>
                      <strong>{cat.title}</strong>
                      <small>{cat.files.length ? `${fa(cat.files.length)} مورد` : 'خالی'}</small>
                    </div>
                    <span className="storage-row-size">{fmt(catSize)} گیگ</span>
                    <span className="storage-chevron" aria-hidden="true">‹</span>
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </main>
      {allFiles.length > 0 && (
        <div className="sticky-action">
          <button disabled={!selected.length} onClick={removeSelected}>
            {selected.length ? `حذف ${fa(selected.length)} مورد انتخاب‌شده` : 'حذف انتخاب‌شده‌ها'}
          </button>
        </div>
      )}
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}


export default function App() {
  const [history, setHistory] = useState<Screen[]>(['messenger'])
  const [role, setRole] = useState<UserRole>('teacher')
  const screen = history[history.length - 1]

  const navigate = (next: Screen) => {
    if (next === screen) return
    setHistory(h => [...h, next])
    window.scrollTo(0, 0)
  }

  const goBack = () => {
    setHistory(h => (h.length <= 1 ? h : h.slice(0, -1)))
    window.scrollTo(0, 0)
  }

  return <div className="app-shell" dir="rtl" data-role={role}>
    {screen === 'home' && <Messenger navigate={navigate} goBack={goBack} role={role}/>}
    {screen === 'messenger' && <Messenger navigate={navigate} goBack={goBack} role={role}/>}
    {screen === 'school' && <MySchool navigate={navigate} goBack={goBack} role={role}/>}
    {screen === 'calendar' && <CalendarPage navigate={navigate} goBack={goBack}/>}
    {screen === 'chat' && <Chat navigate={navigate} goBack={goBack} role={role}/>}
    {screen === 'conversation' && <Conversation navigate={navigate} goBack={goBack}/>}
    {screen === 'materials' && <Materials navigate={navigate} goBack={goBack}/>}
    {screen === 'assignment' && <Assignment navigate={navigate} goBack={goBack} role={role}/>}
    {screen === 'assignment-create' && <AssignmentCreate goBack={goBack}/>}
    {screen === 'assignments' && <Assignments navigate={navigate} goBack={goBack} role={role}/>}
    {screen === 'exam' && <Exam navigate={navigate} goBack={goBack} role={role}/>}
    {screen === 'exam-create' && <ExamCreate goBack={goBack}/>}
    {screen === 'attendance' && <Attendance navigate={navigate} goBack={goBack} role={role}/>}
    {screen === 'classroom' && <Classroom navigate={navigate} goBack={goBack} role={role}/>}
    {screen === 'storage' && <StorageManage goBack={goBack}/>}
    {screen === 'gradebook' && <Gradebook navigate={navigate} goBack={goBack} role={role}/>}
    {screen === 'grade-register' && <GradeRegister navigate={navigate} goBack={goBack}/>}
    {screen === 'reports' && <Reports navigate={navigate} goBack={goBack}/>}
    {screen === 'auth' && <Auth navigate={navigate} goBack={goBack} setRole={setRole}/>}
    {['schedule','calls','more'].includes(screen) && <MainSection screen={screen} navigate={navigate} goBack={goBack} role={role} setRole={setRole}/>}
    {['calls','auth'].includes(screen) && <BottomMenu navigate={navigate} active={screen === 'calls' ? 'تماس‌ها' : 'احراز هویت'} />}
    {screen === 'call' && <CallScreen navigate={navigate} goBack={goBack}/>}
  </div>
}