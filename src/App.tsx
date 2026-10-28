import { useState, useEffect, useRef } from 'react'

type Screen =
  | 'home'
  | 'messenger'
  | 'school'
  | 'chat'
  | 'conversation'
  | 'classes'
  | 'schedule'
  | 'calls'
  | 'more'
  | 'materials'
  | 'assignments'
  | 'assignment'
  | 'exam'
  | 'attendance'
  | 'call'
  | 'classroom'
  | 'gradebook'
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
  | 'lock'

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
  { title: 'ایجاد تکلیف', icon: 'book' as IconName, screen: 'assignment' as Screen },
  { title: 'ساخت آزمون', icon: 'exam' as IconName, screen: 'exam' as Screen },
  { title: 'ثبت حضور و غیاب', icon: 'attendance' as IconName, screen: 'attendance' as Screen },
  { title: 'افزودن جزوه', icon: 'file' as IconName, screen: 'materials' as Screen },
  { title: 'برنامه کلاسی', icon: 'calendar' as IconName, screen: 'schedule' as Screen },
  { title: 'ارسال فایل', icon: 'paperclip' as IconName, screen: 'chat' as Screen },
]

const quickLinks: { label: string; icon: IconName; color: string; badge?: string; screen: Screen }[] = [
  { label: 'شاد من', icon: 'person', color: 'ql-green', screen: 'more' },
    { label: 'پیام رسان', icon: 'chat', color: 'ql-blue', screen: 'messenger' },
  { label: 'مدرسه من', icon: 'home', color: 'ql-blue', screen: 'school' },
  { label: 'تماشا', icon: 'video', color: 'ql-red', screen: 'chat' },
  { label: 'دیدنی', icon: 'camera', color: 'ql-amber', badge: 'جدید', screen: 'materials' },
  { label: 'ورزشی', icon: 'ball', color: 'ql-purple', screen: 'schedule' },
]

function QuickLinks({ navigate, active }: { navigate: (screen: Screen) => void; active?: string }) {
  return <div className="quick-links">
    {quickLinks.map(q => <button className={`quick-link ${active === q.label ? 'active' : ''}`} key={q.label} onClick={() => navigate(q.screen)}>
      <span className={`ql-icon ${q.color}`}><Icon name={q.icon} /></span>
      <strong>{q.label}</strong>
      {q.badge && <b className="ql-badge">{q.badge}</b>}
    </button>)}
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

function Messenger({ navigate }: { navigate: (screen: Screen) => void }) {
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
      {filtered.map(c => <button className="conversation" key={c.name} onClick={() => navigate(c.type === 'دروس من' ? 'classroom' : 'chat')}>
        <div className={`avatar ${c.color} ${c.icon ? 'iconed' : ''}`}>{c.icon ? <Icon name={c.icon} /> : c.initials}</div>
        <div className="conversation-copy"><div><strong>{c.name}{c.verified && <span className="verified"><Icon name="check" size={11} /></span>}</strong>{c.time && <time>{c.time}</time>}</div><div><p>{c.preview}</p>{c.badge ? <b className="unread">{c.badge}</b> : <span className="read-mark">✓✓</span>}</div></div>
      </button>)}
    </main>
    <BottomMenu navigate={navigate} active="گفتگو" />
  </div>
}

function MySchoolNav({ navigate, active, setActive }: { navigate: (screen: Screen) => void; active: string; setActive: (v: any) => void }) {
  const items: { label: string; icon: IconName; screen: Screen }[] = [
    { label: 'خانه', icon: 'home', screen: 'home' },
    { label: 'دروس من', icon: 'book', screen: 'materials' },
    { label: 'آموزشی', icon: 'board', screen: 'classes' },
    { label: 'سکوی آموزش', icon: 'platform', screen: 'more' },
  ]
  return <nav className="msg-nav">{items.map(item => <button key={item.label} className={active === item.label ? 'active' : ''} onClick={() => { if (item.label === 'دروس من' || item.label === 'خانه' || item.label === 'آموزشی' || item.label === 'سکوی آموزش') { setActive(item.label) } else { navigate(item.screen) } }}><span><Icon name={item.icon} /></span><small>{item.label}</small></button>)}</nav>
}

function MySchool({ navigate }: { navigate: (screen: Screen) => void }) {
  const [active, setActive] = useState<'خانه' | 'دروس من' | 'آموزشی' | 'سکوی آموزش'>('دروس من')
  const [todayTab, setTodayTab] = useState('امروز')

  return <div className="screen" dir="rtl">
    <div className="msg-header">
      <QuickLinks navigate={navigate} active="مدرسه من" />
    </div>
    <main className="msg-list" style={{paddingTop:10}}>
      {active === 'خانه' && <div className="school-home">
        <div className="display-banner">
          <span className="display-banner-icon"><Icon name="home" /></span>
          <div>
            <strong>خانه مدرسه من</strong>
            <small>به صفحهٔ خانهٔ مدرسهٔ خود خوش آمدید</small>
          </div>
        </div>
      </div>}
      {active === 'دروس من' && <div className="school-home" style={{padding:'0 15px'}}>
        <button className="calendar-banner" onClick={() => navigate('schedule')}><div><strong>برنامه کلاسی و تقویم</strong><small>۳ کلاس امروز · جلسه بعدی ۰۹:۰۰</small></div><span className="banner-cta">مشاهده</span></button>
        <div className="hero-card"><div><small>کلاس بعدی · ۲۵ دقیقه دیگر</small><strong>علوم تجربی · پایه نهم</strong><span>۲۸ دانش‌آموز</span><button onClick={() => navigate('classroom')}>ورود به کلاس</button></div><img className="hero-book" src="/book-cover.png" alt="کتاب علوم تجربی پایه نهم" /></div>
        <div className="chips compact" style={{padding:'8px 0 6px'}}>{['امروز','دروس'].map(x => <button key={x} className={todayTab === x ? 'active' : ''} onClick={() => setTodayTab(x)}>{x}</button>)}</div>
        {todayTab === 'امروز' ? <>{['علوم تجربی · پایه نهم','ریاضی · پایه نهم','آمادگی دفاعی · پایه نهم'].map((x,i)=><button className="class-card" key={x} onClick={() => navigate('chat')}><span className={`class-icon c${i}`}><Icon name="classes" /></span><div><strong>{x}</strong><small>کلاس {901+i} · {28-i*3} دانش‌آموز</small></div><Icon name="chevron" /></button>)}</> : <>{['علوم تجربی · پایه نهم','ریاضی · پایه نهم','آمادگی دفاعی · پایه نهم'].map((x,i)=><button className="class-card" key={x} onClick={() => navigate('classroom')}><span className={`class-icon c${i}`}><Icon name="classes" /></span><div><strong>{x}</strong><small>کلاس {901+i} · {28-i*3} دانش‌آموز</small></div><Icon name="chevron" /></button>)}</>}
      </div>}
      {active === 'آموزشی' && <div className="school-home">
        <div className="display-banner">
          <span className="display-banner-icon"><Icon name="board" /></span>
          <div>
            <strong>آموزشی</strong>
            <small>بخش آموزشی مدرسهٔ من</small>
          </div>
        </div>
      </div>}
      {active === 'سکوی آموزش' && <div className="school-home">
        <div className="display-banner">
          <span className="display-banner-icon"><Icon name="platform" /></span>
          <div>
            <strong>سکوی آموزش</strong>
            <small>بخش سکوی آموزش مدرسهٔ من</small>
          </div>
        </div>
      </div>}
    </main>
    <MySchoolNav navigate={navigate} active={active} setActive={setActive} />
  </div>
}

let classStarted = false

function Chat({ navigate }: { navigate: (screen: Screen) => void }) {
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
  const [activityOpen, setActivityOpen] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(timer)
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
      <IconButton icon="chevron" label="بازگشت" onClick={() => navigate('home')} />
      <Avatar item={conversations[0]} />
      <button className="chat-person" onClick={() => navigate('classroom')}>
        <strong>کلاس تجربی<span className="verified"><Icon name="check" size={11} /></span></strong>
        <span>۲۸ عضو، ۶ نفر آنلاین</span>
      </button>
      <IconButton icon="phone" label="تماس صوتی" onClick={() => setShowCallPopup(true)} />
      <IconButton icon="more" label="گزینه‌های بیشتر" />
    </header>
    {started && <div className="live-banner" onClick={() => navigate('call')}>
      <i className="live-dot" />
      <strong>کلاس در حال برگزاری</strong>
      <small>{formatTime(seconds)}</small>
    </div>}
    <div className={`recent-activity ${activityOpen ? 'open' : 'collapsed'}`}>
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
    </div>
    <main className="messages">
      <div className="day"><span>امروز</span></div>
      <div className="message-row received"><div className="message-bubble"><strong className="sender">خانم کریمی</strong><p>سلام بچه‌ها، وقتتون بخیر. فایل تمرین فصل سوم رو براتون فرستادم.</p><span>۱۰:۲۸</span></div></div>
      <div className="message-row received"><div className="message-bubble attachment-card"><div className="file-icon"><Icon name="file" /></div><div><strong>تمرین فصل سوم علوم.pdf</strong><small>۲٫۴ مگابایت · PDF</small></div><button aria-label="ذخیره فایل" onClick={() => { setToast('در بخش جزوه ذخیره شد'); setTimeout(() => { setToast(null); navigate('materials') }, 1200) }}><Icon name="bookmark" /></button><span>۱۰:۲۹</span></div></div>
      <div className="message-row sent"><div className="message-bubble"><p>ممنون خانم، تا چه روزی فرصت داریم؟</p><span>۱۰:۳۴ <b>✓✓</b></span></div></div>
      <div className="message-row received"><div className="message-bubble announcement"><small>تکلیف جدید</small><strong>تمرین فصل سوم</strong><p>مهلت تحویل: دوشنبه، ساعت ۲۰:۰۰</p><button onClick={() => navigate('assignment')}>مشاهده تکلیف</button><span>۱۰:۳۶</span></div></div>
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
    {toast && <div className="toast">{toast}</div>}
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

function Conversation({ navigate }: { navigate: (screen: Screen) => void }) {
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState<string[]>([])
  const send = () => { if (message.trim()) { setSent([...sent, message]); setMessage('') } }
  const chat = messengerChats[0]
  return <div className="screen chat-screen conversation-light" dir="rtl">
    <header className="chat-header">
      <IconButton icon="chevron" label="بازگشت" onClick={() => navigate('messenger')} />
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
      <div className="message-row received"><div className="message-bubble attachment-card"><div className="file-icon"><Icon name="image" /></div><div><strong>تصویر</strong><small>۱٫۲ مگابایت · JPG</small></div><button aria-label="ذخیره فایل"><Icon name="bookmark" /></button><span>۰۹:۰۶</span></div></div>
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
  </div>
}

const screenMeta: Partial<Record<Screen, { title: string; subtitle: string }>> = {
  materials: { title: 'جزوه‌ها و منابع', subtitle: 'کلاس علوم تجربی' },
  assignment: { title: 'ایجاد تکلیف', subtitle: 'فعالیت جدید برای کلاس' },
  exam: { title: 'ساخت آزمون', subtitle: 'تنظیمات و پرسش‌ها' },
  attendance: { title: 'حضور و غیاب', subtitle: 'علوم تجربی · امروز' },
  assignments: { title: 'تکالیف', subtitle: 'علوم تجربی · کلاس ۹۰۱' },
  gradebook: { title: 'دفتر نمره', subtitle: 'علوم تجربی · نیم‌ترم اول' },
}

function SubHeader({ screen, back }: { screen: Screen; back: () => void }) {
  const meta = screenMeta[screen]!
  return <header className="sub-header"><IconButton icon="chevron" label="بازگشت" onClick={back} /><div><strong>{meta.title}</strong><span>{meta.subtitle}</span></div><IconButton icon="more" label="بیشتر" /></header>
}

function FormField({ label, placeholder, type = 'text' }: { label: string; placeholder: string; type?: string }) {
  return <label className="field"><span>{label}</span><input type={type} placeholder={placeholder} /></label>
}

function Materials({ navigate }: { navigate: (s: Screen) => void }) {
  const [filter, setFilter] = useState<'all'|'pdf'|'video'|'image'|'audio'|'text'>('all')
  const items = [
    {n:'جزوه فصل سوم علوم',m:'PDF · ۲٫۴ مگابایت',i:'file' as IconName, type:'pdf'},
    {n:'آزمایش فشار هوا',m:'ویدیو · ۰۸:۳۴',i:'video' as IconName, type:'video'},
    {n:'نمودار چرخه آب',m:'تصویر · ۱٫۲ مگابایت',i:'image' as IconName, type:'image'},
    {n:'فایل صوتی درس سوم',m:'صدا · MP3 · ۴٫۱ مگابایت',i:'mic' as IconName, type:'audio'},
    {n:'یادداشت درس سوم',m:'متن · ۱۲۰ کلمه',i:'file' as IconName, type:'text'},
  ]
  const filtered = filter === 'all' ? items : items.filter(x => x.type === filter)
  const labels = {all:'همه', pdf:'PDF', video:'ویدیو', image:'تصویر', audio:'صدا', text:'متن'} as const
  return <div className="screen inner-screen"><SubHeader screen="materials" back={() => navigate('classroom')} /><main className="inner-content">
    <div className="search-box"><Icon name="search" /><input placeholder="جست‌وجو در جزوه‌ها و منابع" /></div>
    <div className="chips compact scrollable">{(['all','pdf','video','image','audio','text'] as const).map((k) => <button key={k} className={filter===k?'active':''} onClick={()=>setFilter(k)}>{labels[k]}</button>)}</div>
    <div className="section-heading"><strong>این هفته</strong><span>{String(filtered.length).replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[+d])} مورد</span></div>
    {filtered.map(x => <button className="resource" key={x.n} onClick={() => navigate('chat')}><span className="resource-icon"><Icon name={x.i} /></span><div><strong>{x.n}</strong><small>{x.m}</small><span>یکشنبه، ۲۴ فروردین</span></div><Icon name="chevron" /></button>)}
    <button className="save-message"><Icon name="bookmark" /><div><strong>ذخیره از گفتگو</strong><span>پیام یا فایل مفید را به منابع اضافه کنید</span></div></button>
  </main></div>
}

function Assignments({ navigate }: { navigate: (s: Screen) => void }) {
  const [tab, setTab] = useState<'جاری' | 'آینده' | 'پایان‌یافته'>('جاری')
  const data: Record<string, { t: string; m: string; s: string; color: string }[]> = {
    'جاری': [
      { t: 'تمرین فصل سوم', m: 'مهلت: دوشنبه، ۲۰:۰۰', s: '۰ از ۲۸ تحویل', color: 'green' },
      { t: 'گزارش آزمایش فشار هوا', m: 'مهلت: چهارشنبه، ۱۸:۰۰', s: '۱۲ از ۲۸ تحویل', color: 'blue' },
    ],
    'آینده': [
      { t: 'پروژه نمودار چرخه آب', m: 'شروع: شنبه، ۰۹:۰۰', s: 'منتشر نشده', color: 'orange' },
    ],
    'پایان‌یافته': [
      { t: 'تمرین فصل دوم', m: 'پایان: یکشنبه، ۲۰:۰۰', s: '۲۶ از ۲۸ تحویل', color: 'purple' },
      { t: 'تکلیف کلاسی اول', m: 'پایان: پنجشنبه، ۱۲:۰۰', s: '۲۸ از ۲۸ تحویل', color: 'mint' },
    ],
  }
  const items = data[tab] || []
  return <div className="screen inner-screen">
    <SubHeader screen="assignments" back={() => navigate('classroom')} />
    <main className="inner-content">
      <div className="chips compact scrollable">
        {(['جاری', 'آینده', 'پایان‌یافته'] as const).map(t => <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>{t}</button>)}
      </div>
      <div className="section-heading"><strong>{tab}</strong><span>{fa(items.length)} مورد</span></div>
      {items.length ? items.map(x => <button className="resource" key={x.t} onClick={() => navigate('assignment')}>
        <span className={`resource-icon ${x.color}`}><Icon name="book" /></span>
        <div><strong>{x.t}</strong><small>{x.m}</small><span>{x.s}</span></div>
        <Icon name="chevron" />
      </button>) : <div className="empty"><Icon name="book" size={34} /><strong>تکلیفی وجود ندارد</strong><span>در این بخش تکلیفی ثبت نشده است.</span></div>}
    </main>
    <button className="fab" aria-label="ایجاد تکلیف" onClick={() => navigate('assignment')}><Icon name="plus" /></button>
  </div>
}

function Assignment({ navigate }: { navigate: (s: Screen) => void }) {
  const [published, setPublished] = useState(false)
  return <div className="screen inner-screen"><SubHeader screen="assignment" back={() => navigate('chat')} /><main className="inner-content form-page">
    <FormField label="عنوان تکلیف" placeholder="مثلاً تمرین فصل سوم" />
    <label className="field"><span>توضیحات</span><textarea rows={4} placeholder="توضیحات و راهنمای انجام تکلیف..." /></label>
    <button className="upload"><Icon name="paperclip" /><div><strong>افزودن فایل</strong><span>PDF، تصویر یا فایل متنی</span></div><Icon name="plus" /></button>
    <label className="field"><span>مهلت تحویل</span><div className="two-fields"><select><option value="">تاریخ</option>{reportDateRange().map(d => <option key={d} value={d}>{d}</option>)}</select><input type="time" /></div></label>
    <div className="switch-row"><div><strong>نمایش وضعیت تحویل</strong><span>پیشرفت دانش‌آموزان را دنبال کنید</span></div><button className="switch active" aria-label="نمایش وضعیت تحویل"><i /></button></div>
    <div className="progress-preview"><div><span>وضعیت کلاس</span><strong>۰ از ۲۸</strong></div><div className="progress"><i /></div><small>پس از انتشار، وضعیت تحویل اینجا نمایش داده می‌شود.</small></div>
  </main><div className="sticky-action"><button onClick={() => { setPublished(true); setTimeout(() => navigate('chat'), 900) }}>{published ? <><Icon name="check" /> تکلیف منتشر شد</> : 'انتشار تکلیف'}</button></div></div>
}

function Exam({ navigate }: { navigate: (s: Screen) => void }) {
  return <div className="screen inner-screen"><SubHeader screen="exam" back={() => navigate('chat')} /><main className="inner-content form-page">
    <FormField label="عنوان آزمون" placeholder="مثلاً آزمون میان‌ترم علوم" />
    <div className="section-heading"><strong>پرسش‌ها</strong><span>۱ پرسش</span></div>
    <section className="question-card"><div><b>۱</b><span>چهارگزینه‌ای</span><IconButton icon="more" label="بیشتر" /></div><input placeholder="متن پرسش را بنویسید..." />{['گزینه اول', 'گزینه دوم'].map((x,i) => <label className="option" key={x}><input type="radio" name="answer" defaultChecked={i === 0} /><input placeholder={x} /></label>)}<button className="add-option"><Icon name="plus" /> افزودن گزینه</button></section>
    <button className="outline-button"><Icon name="plus" /> افزودن پرسش</button>
    <div className="two-fields"><FormField label="مدت آزمون" placeholder="۳۰ دقیقه" /><FormField label="زمان شروع" placeholder="فردا · ۹:۰۰" /></div>
  </main><div className="sticky-action two"><button className="secondary">پیش‌نمایش</button><button>انتشار آزمون</button></div></div>
}

const students = ['علی احمدی', 'فاطمه محمدی', 'آراد حسینی', 'یسنا کریمی', 'امیررضا صالحی', 'مبینا اکبری']
function Attendance({ navigate }: { navigate: (s: Screen) => void }) {
  const [status, setStatus] = useState<Record<number, string>>({})
  return <div className="screen inner-screen"><SubHeader screen="attendance" back={() => navigate('chat')} /><main className="inner-content">
    <div className="attendance-summary"><div><strong>۲۸</strong><span>دانش‌آموز</span></div><div><strong className="green-text">{Object.values(status).filter(x=>x==='حاضر').length}</strong><span>حاضر</span></div><div><strong className="red-text">{Object.values(status).filter(x=>x==='غایب').length}</strong><span>غایب</span></div></div>
    <div className="section-heading"><strong>فهرست دانش‌آموزان</strong><button onClick={() => setStatus(Object.fromEntries(students.map((_, i) => [i, 'حاضر'])))}>همه حاضر</button></div>
    {students.map((name, i) => <div className="student" key={name}><div className="student-avatar">{name[0]}</div><strong>{name}</strong><div>{['حاضر','غایب','تأخیر'].map(s => <button key={s} className={`${s} ${status[i]===s?'active':''}`} onClick={() => setStatus({...status,[i]:s})}>{s}</button>)}</div></div>)}
  </main><div className="sticky-action"><button onClick={() => navigate('chat')}>ثبت حضور و غیاب</button></div></div>
}

const scheduleItems = [
  { time:'۰۸:۰۰', title:'ریاضی پایه نهم', info:'کلاس ۹۰۲ · ۴۵ دقیقه', color:'green', days:[22,24,26,29,31,2] },
  { time:'۰۹:۰۰', title:'علوم تجربی', info:'کلاس ۹۰۱ · جلسه آنلاین', color:'blue', days:[23,24,25,26,30,31,1,3] },
  { time:'۱۱:۳۰', title:'جلسه گروه آموزشی', info:'اتاق دبیران · ۳۰ دقیقه', color:'orange', days:[24,25,27,29,31] },
]

const fa = (n: number | string) => String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[+d])
const toEn = (s: string) => String(s).replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))

function reportDateRange(): string[] {
  const out: string[] = []
  // 1405/07/01 (Mehr 1) to 1405/08/01 (Aban 1)
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

function MainSection({ screen, navigate }: { screen: Screen; navigate: (s: Screen) => void }) {
  const [sel, setSel] = useState(2)
  const [classTab, setClassTab] = useState('کلاس‌ها')
  const [todayTab, setTodayTab] = useState('امروز')
  const cell = dateCells[sel]
  const dayItems = scheduleItems.filter(x => x.days.includes(cell.day))
  const dayTitle = `${sel === 2 ? 'امروز، ' : ''}${faDayFull[faDays.indexOf(cell.label)]} ${fa(cell.day)} ${cell.month}`
  return <div className="screen main-section"><QuickLinks navigate={navigate} /><main className="section-content">
    {screen === 'classes' && <><div className="chips compact" style={{padding:'10px 15px 6px'}}>{['کلاس‌ها','دروس من'].map(x => <button key={x} className={classTab === x ? 'active' : ''} onClick={() => setClassTab(x)}>{x}</button>)}</div>{classTab === 'کلاس‌ها' ? <><button className="calendar-banner" onClick={() => navigate('schedule')}><div><strong>برنامه کلاسی و تقویم</strong><small>۳ کلاس امروز · جلسه بعدی ۰۹:۰۰</small></div><span className="banner-cta">مشاهده</span></button><div className="hero-card"><div><small>کلاس بعدی · ۲۵ دقیقه دیگر</small><strong>علوم تجربی · پایه نهم</strong><span>۲۸ دانش‌آموز</span><button onClick={() => navigate('classroom')}>ورود به کلاس</button></div><img className="hero-book" src="/book-cover.png" alt="کتاب علوم تجربی پایه نهم" /></div><div className="chips compact" style={{padding:'8px 0 6px'}}>{['امروز','دروس'].map(x => <button key={x} className={todayTab === x ? 'active' : ''} onClick={() => setTodayTab(x)}>{x}</button>)}</div>{todayTab === 'امروز' ? <>{['علوم تجربی · ۹۰۱','ریاضی · ۹۰۲','آمادگی دفاعی · ۹۰۳'].map((x,i)=><button className="class-card" key={x} onClick={() => navigate('chat')}><span className={`class-icon c${i}`}><Icon name="classes" /></span><div><strong>{x}</strong><small>{28-i*3} دانش‌آموز · {i+2} فعالیت فعال</small></div><Icon name="chevron" /></button>)}</> : <div className="school-home">{['علوم تجربی · پایه نهم','ریاضی · پایه نهم','آمادگی دفاعی · پایه نهم'].map((c,i) => <button className="msg-row school-row" key={c} onClick={() => navigate('classroom')}><div className={`msg-avatar msg-${i===0?'green':i===1?'blue':'orange'}`}>{c.split(' ')[0][0]}</div><div className="msg-copy"><strong>{c}</strong><p>کلاس {901+i} · {28-i} دانش‌آموز</p></div><div className="msg-meta"><span className="msg-badge">ورود</span></div></button>)}</div>}</> : <div className="school-home">{['علوم تجربی · پایه نهم','ریاضی · پایه نهم','آمادگی دفاعی · پایه نهم'].map((c,i) => <button className="msg-row school-row" key={c} onClick={() => navigate('classroom')}><div className={`msg-avatar msg-${i===0?'green':i===1?'blue':'orange'}`}>{c.split(' ')[0][0]}</div><div className="msg-copy"><strong>{c}</strong><p>کلاس {901+i} · {28-i} دانش‌آموز</p></div><div className="msg-meta"><span className="msg-badge">ورود</span></div></button>)}</div>}</>}
    {screen === 'schedule' && <><div className="date-strip">{dateCells.map((c,i)=><button className={i===sel?'active':''} key={i} onClick={()=>setSel(i)}><span>{c.label}</span><strong>{fa(c.day)}</strong></button>)}</div><div className="section-heading"><strong>{dayTitle}</strong><span>{fa(dayItems.length)} برنامه</span></div>{dayItems.length ? <div className="timeline">{dayItems.map(x=><div className="timeline-row" key={x.time}><time>{x.time}</time><i className={x.color}/><button><strong>{x.title}</strong><span>{x.info}</span><small><Icon name="bell" size={14}/> یادآوری روشن</small></button></div>)}</div> : <div className="empty-day"><Icon name="calendar" /><strong>برنامه‌ای ثبت نشده</strong><span>برای {faDayFull[faDays.indexOf(cell.label)]} {fa(cell.day)} {cell.month} برنامه‌ای وجود ندارد</span></div>}</>}
    {screen === 'calls' && <><div className="call-tabs"><button className="active">همه</button><button>ازدست‌رفته</button></div>{conversations.slice(0,5).map((c,i)=><button className="call-row" key={c.name} onClick={()=>navigate('call')}><Avatar item={c}/><div><strong>{c.name}</strong><span className={i===1?'missed':''}>{i===1?'تماس ازدست‌رفته':'تماس ورودی'} · {c.time}</span></div><Icon name={i%2?'video':'phone'}/></button>)}</>}
    {screen === 'more' && <><div className="profile-card"><button className="profile-large">س</button><div><strong>سارا کریمی</strong><span>دبیر علوم تجربی</span><small>school-321@shad.ir</small></div><Icon name="chevron"/></div><div className="more-grid">{[{t:'تکالیف',i:'book',s:'assignment'},{t:'آزمون‌ها',i:'exam',s:'exam'},{t:'جزوه‌ها',i:'file',s:'materials'},{t:'حضور و غیاب',i:'attendance',s:'attendance'}].map(x=><button key={x.t} onClick={()=>navigate(x.s as Screen)}><span><Icon name={x.i as IconName}/></span><strong>{x.t}</strong></button>)}</div><div className="settings-list"><button><Icon name="settings"/><div><strong>تنظیمات</strong><span>حساب، حریم خصوصی و اعلان‌ها</span></div><Icon name="chevron"/></button><button><Icon name="bookmark"/><div><strong>پیام‌های ذخیره‌شده</strong><span>فایل‌ها و پیام‌های مهم شما</span></div><Icon name="chevron"/></button></div></>}
  </main></div>
}

function CallScreen({ navigate, back }: { navigate: (s: Screen) => void; back: Screen }) {
  const [connected, setConnected] = useState(true)
  const [video, setVideo] = useState(false)
  return <div className={`screen call-screen ${video?'video-call':''}`}>
    <div className="call-top"><IconButton icon="chevron" label="بازگشت" onClick={()=>navigate(back)}/><span>تماس رمزگذاری‌شده</span><IconButton icon="users" label="شرکت‌کنندگان"/></div>
    <div className="caller"><Avatar item={conversations[0]} large/><strong>کلاس تجربی</strong><span>{connected?'۰۰:۲۴':'در حال برقراری تماس...'}</span></div>
    {video && <div className="self-video"><div>س</div><span>شما</span></div>}
    <div className="call-controls">
      {connected && <><button><span><Icon name="mic"/></span><small>بی‌صدا</small></button><button><span><Icon name="speaker"/></span><small>بلندگو</small></button><button className={video?'selected':''} onClick={()=>setVideo(!video)}><span><Icon name="camera"/></span><small>دوربین</small></button></>}
      <button className="end" onClick={()=>{ classStarted = false; navigate(back) }}><span><Icon name="phone"/></span><small>{connected?'پایان':'رد تماس'}</small></button>
      {!connected && <button className="accept" onClick={()=>setConnected(true)}><span><Icon name="phone"/></span><small>پاسخ</small></button>}
    </div>
  </div>
}

const classSections: { title: string; sub: string; icon: IconName; screen: Screen }[] = [
  { title: 'تکالیف', sub: '۲ تکلیف فعال', icon: 'book', screen: 'assignments' },
  { title: 'آزمون‌ها', sub: '۱ آزمون پیش‌رو', icon: 'exam', screen: 'exam' },
  { title: 'جزوه‌ها', sub: '۴ فایل این هفته', icon: 'file', screen: 'materials' },
  { title: 'حضور و غیاب', sub: 'ثبت امروز', icon: 'attendance', screen: 'attendance' },
  { title: 'دفتر نمره', sub: '۲۸ دانش‌آموز', icon: 'chart', screen: 'gradebook' },
]

function Classroom({ navigate }: { navigate: (s: Screen) => void }) {
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
      <IconButton icon="chevron" label="بازگشت" onClick={() => navigate('classes')} />
      <div><strong>علوم تجربی · پایه نهم</strong><span>کلاس ۹۰۱ · ۲۸ دانش‌آموز</span></div>
      <IconButton icon="more" label="بیشتر" />
    </header>
    <main className="inner-content classroom-content">
      <button className="start-class" onClick={() => navigate('call')}>
        <span className="start-play"><Icon name="video" /></span>
        <strong>شروع کلاس</strong>
        <small>جلسهٔ آنلاین امروز · ۲۵ دقیقه دیگر</small>
        <div className="start-cta-group">
          <span className="start-cta" role="button" tabIndex={0} onClick={e => { e.stopPropagation(); navigate('classes') }}>ورود به کلاسا</span>
          <span className="start-cta" role="button" tabIndex={0} onClick={e => { e.stopPropagation(); navigate('chat') }}>ورود به گروه کلاس</span>
        </div>
        <div className="start-divider" />
        <div className="start-actions">
          <span role="button" tabIndex={0} onClick={e => { e.stopPropagation(); navigate('messenger') }}><i><Icon name="logout" size={18} /></i><small>ترک کردن</small></span>
          <span role="button" tabIndex={0} onClick={e => e.stopPropagation()}><i><Icon name="bell" size={18} /></i><small>بی‌صدا کردن</small></span>
          <span role="button" tabIndex={0} onClick={e => { e.stopPropagation(); navigate('chat') }}><i><Icon name="chat" size={18} /></i><small>پیام‌ها</small></span>
        </div>
      </button>
      <div className="media-tabs">
        <div className="media-tabs-scroll">
          {mediaTabs.map(t => <button key={t} className={mediaTab === t ? 'active' : ''} onClick={() => setMediaTab(t)}>{t}</button>)}
        </div>
        <div className="media-tab-content">
          {mediaTab === 'نمای کلی' ? (
            <div className="classroom-grid" style={{padding:0}}>
              {classSections.map((x) => <button key={x.title} onClick={() => navigate(x.screen)}>
                <span><Icon name={x.icon} /></span>
                <strong>{x.title}</strong>
                <small>{x.sub}</small>
              </button>)}
              <button onClick={() => navigate('reports')}>
                <span><Icon name="chart" /></span>
                <strong>گزارش‌های کلاس</strong>
                <small>حضور و غیاب، نمره‌ها، تکالیف و آزمون‌ها</small>
              </button>
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

function Gradebook({ navigate }: { navigate: (s: Screen) => void }) {
  const [scores, setScores] = useState<Record<number, string>>({})
  const vals = Object.values(scores).filter(v => v.trim() !== '')
  const avg = vals.length ? (vals.reduce((a, b) => a + Number(b), 0) / vals.length).toFixed(1) : '—'
  return <div className="screen inner-screen">
    <SubHeader screen="gradebook" back={() => navigate('classroom')} />
    <main className="inner-content">
      <div className="attendance-summary">
        <div><strong>{fa(28)}</strong><span>دانش‌آموز</span></div>
        <div><strong className="green-text">{fa(avg)}</strong><span>میانگین ثبت‌شده</span></div>
        <div><strong>{fa(vals.length)}</strong><span>نمره ثبت‌شده</span></div>
      </div>
      <div className="section-heading"><strong>نمرات · نیم‌ترم اول</strong><span>از {fa(20)}</span></div>
      {students.map((name, i) => <div className="student" key={name}>
        <div className="student-avatar">{name[0]}</div>
        <strong>{name}</strong>
        <input className="score-input" inputMode="numeric" placeholder="۲۰" value={fa(scores[i] ?? '')} onChange={e => setScores({ ...scores, [i]: toEn(e.target.value).replace(/[^\d]/g, '') })} />
      </div>)}
    </main>
    <div className="sticky-action"><button onClick={() => navigate('classroom')}>ثبت نمرات</button></div>
  </div>
}

function Reports({ navigate }: { navigate: (s: Screen) => void }) {
  const [selected, setSelected] = useState<string | null>(null)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [reportType, setReportType] = useState('همه')
  const allDates = reportDateRange()
  const filteredDates = allDates.filter(d => {
    const afterFrom = !fromDate || d >= fromDate
    const beforeTo = !toDate || d <= toDate
    return afterFrom && beforeTo
  })
  const types = ['همه', 'حضور و غیاب', 'نمره', 'تکلیف', 'آزمون', 'نمره کلاسی']
  const visibleTypes = reportType === 'همه' ? ['حضور و غیاب', 'نمره', 'تکلیف', 'آزمون', 'نمره کلاسی'] : [reportType]
  const typeLabel: Record<string, string> = { 'حضور و غیاب': 'حضور', 'نمره': 'نمره', 'تکلیف': 'تکلیف', 'آزمون': 'آزمون', 'نمره کلاسی': 'کلاسی' }
  const valueFor = (name: string, type: string, date: string) => {
    const i = students.indexOf(name)
    const di = allDates.indexOf(date)
    if (type === 'حضور و غیاب') return (i + di) % 4 === 0 ? 'غایب' : (i + di) % 4 === 1 ? 'تأخیر' : 'حاضر'
    if (type === 'نمره') return fa(14 + ((i + di) % 6))
    if (type === 'تکلیف') return (i + di) % 3 === 0 ? 'تحویل' : 'انتظار'
    if (type === 'آزمون') return fa(12 + ((i + di) % 7))
    if (type === 'نمره کلاسی') return fa(15 + ((i + di) % 5))
    return ''
  }
  return <div className="screen inner-screen">
    <SubHeader screen="gradebook" back={() => selected ? setSelected(null) : navigate('classroom')} />
    <main className="inner-content">
      <div className="two-fields" style={{marginBottom:10}}>
        <label className="field"><span>از تاریخ</span><select value={fromDate} onChange={e => setFromDate(e.target.value)}><option value="">همه</option>{reportDateRange().map(d => <option key={d} value={d}>{d}</option>)}</select></label>
        <label className="field"><span>تا تاریخ</span><select value={toDate} onChange={e => setToDate(e.target.value)}><option value="">همه</option>{reportDateRange().map(d => <option key={d} value={d}>{d}</option>)}</select></label>
      </div>
      <div className="chips compact scrollable" style={{marginBottom:12}}>{types.map(t => <button key={t} className={reportType === t ? 'active' : ''} onClick={() => setReportType(t)}>{t}</button>)}</div>
      {!selected ? (
        <>
          <div className="section-heading"><strong>گزارش‌های روزانه</strong><span>{filteredDates.length} روز</span></div>
          {students.map((name) => (
            <button className="student" key={name} onClick={() => setSelected(name)} style={{width:'100%', border:0, background:'transparent', cursor:'pointer'}}>
              <div className="student-avatar">{name[0]}</div>
              <strong>{name}</strong>
            </button>
          ))}
        </>
      ) : (
        <div style={{overflowX:'auto'}}>
          <table className="report-table">
            <thead>
              <tr>
                <th>عنوان</th>
                {filteredDates.map(d => <th key={d}>{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {visibleTypes.map(t => (
                <tr key={t}>
                  <td>{typeLabel[t]}</td>
                  {filteredDates.map(d => <td key={d}>{valueFor(selected, t, d)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
    <div className="sticky-action"><button onClick={() => selected ? setSelected(null) : navigate('classroom')}>{selected ? 'بازگشت به فهرست' : 'بازگشت به کلاس'}</button></div>
  </div>
}

function Auth({ navigate }: { navigate: (s: Screen) => void }) {
  const [role, setRole] = useState<'teacher' | 'student' | null>(null)
  return <div className="screen inner-screen">
    <header className="sub-header">
      <IconButton icon="chevron" label="بازگشت" onClick={() => navigate('messenger')} />
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
        <button onClick={() => setRole('teacher')}>
          <span><Icon name="person" /></span>
          <strong>معلم</strong>
          <small>مدیریت کلاس، نمرات و تکالیف</small>
        </button>
        <button onClick={() => setRole('student')}>
          <span><Icon name="users" /></span>
          <strong>دانش‌آموز</strong>
          <small>مشاهدهٔ دروس و ارسال تکلیف</small>
        </button>
      </div>
    </main>
    {role && <div className="sticky-action">
      <button onClick={() => navigate(role === 'teacher' ? 'classroom' : 'home')}>
        {role === 'teacher' ? 'ورود به عنوان معلم' : 'ورود به عنوان دانش‌آموز'}
      </button>
    </div>}
  </div>
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('messenger')
  const [callFrom, setCallFrom] = useState<Screen>('chat')
  const navigate = (next: Screen) => {
    if (next === 'call' && screen !== 'call') setCallFrom(screen)
    setScreen(next)
    window.scrollTo(0, 0)
  }
  return <div className="app-shell" dir="rtl">
    {screen === 'home' && <Messenger navigate={navigate}/>}
    {screen === 'messenger' && <Messenger navigate={navigate}/>}
    {screen === 'school' && <MySchool navigate={navigate}/>}
    {screen === 'chat' && <Chat navigate={navigate}/>}
    {screen === 'conversation' && <Conversation navigate={navigate}/>}
    {screen === 'materials' && <Materials navigate={navigate}/>}
    {screen === 'assignment' && <Assignment navigate={navigate}/>}
    {screen === 'assignments' && <Assignments navigate={navigate}/>}
    {screen === 'exam' && <Exam navigate={navigate}/>}
    {screen === 'attendance' && <Attendance navigate={navigate}/>}
    {screen === 'classroom' && <Classroom navigate={navigate}/>}
    {screen === 'gradebook' && <Gradebook navigate={navigate}/>}
    {screen === 'reports' && <Reports navigate={navigate}/>}
    {screen === 'auth' && <Auth navigate={navigate}/>}
    {['classes','schedule','calls','more'].includes(screen) && <MainSection screen={screen} navigate={navigate}/>}
    {['calls','auth'].includes(screen) && <BottomMenu navigate={navigate} active={screen === 'calls' ? 'تماس‌ها' : 'احراز هویت'} />}
    {screen === 'call' && <CallScreen navigate={navigate} back={callFrom}/>}
  </div>
}
