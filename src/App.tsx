import { useState} from 'react'

type UserRole = 'teacher' | 'student'

type Screen =
  | 'home'
  | 'messenger'
  | 'school'
  | 'chat'
  | 'conversation'
  | 'schedule'
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
  | 'grade-register'
  | 'reports'
  | 'auth'

type IconName =
  | 'search' | 'bell' | 'chevron' | 'more' | 'phone' | 'video' | 'paperclip'
  | 'smile' | 'send' | 'plus' | 'chat' | 'classes' | 'calendar' | 'calls'
  | 'grid' | 'close' | 'book' | 'file' | 'exam' | 'attendance' | 'clock'
  | 'image' | 'mic' | 'speaker' | 'camera' | 'users' | 'check' | 'settings'
  | 'bookmark' | 'pencil' | 'menu' | 'minus' | 'person' | 'ball' | 'chart'
  | 'star' | 'lock' | 'home' | 'board' | 'platform' | 'logout'

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

function IconButton({ icon, label, onClick }: { icon: IconName; label: string; onClick?: () => void }) {
  return <button className="icon-button" aria-label={label} onClick={onClick}><Icon name={icon} /></button>
}

function SubHeader({ back, title, subtitle }: { back: () => void; title: string; subtitle: string }) {
  return <header style={{ display: 'flex', alignItems: 'center', padding: '12px 15px', background: 'white', borderBottom: '1px solid var(--line)', position: 'sticky', top: 0, zIndex: 6 }}>
    <IconButton icon="chevron" label="بازگشت" onClick={back} />
    <div style={{ display: 'flex', flexDirection: 'column', marginRight: '10px' }}>
      <strong>{title}</strong>
      <span style={{ fontSize: '9px', color: 'var(--muted)' }}>{subtitle}</span>
    </div>
  </header>
}

const fa = (n: number | string) => String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[+d])

function Assignment({ goBack, role = 'teacher' }: { navigate: (s: Screen) => void; goBack: () => void; role?: UserRole }) {
  const isStudent = role === 'student'
  const [meta] = useState({
    title: 'تمرین فصل سوم',
    description: 'لطفاً سوالات صفحهٔ ۴۲ تا ۴۵ کتاب علوم را حل کنید و فایل پاسخ را ارسال نمایید. در صورت نیاز می‌توانید توضیح صوتی هم ضمیمه کنید.',
    deadline: 'دوشنبه، ساعت ۲۰:۰۰',
    fileName: 'تمرین فصل سوم علوم.pdf',
    fileSize: '۲٫۴ مگابایت',
    voice: '۰:۳۷',
  })
  const [toast, setToast] = useState<string | null>(null)

  // student submission state
  const [textAnswer, setTextAnswer] = useState('')
  const [attachments, setAttachments] = useState<{ type: 'file' | 'image' | 'voice'; label: string }[]>([])
  const [recording, setRecording] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [editingSubmission, setEditingSubmission] = useState(false)
  const [submittedAt, setSubmittedAt] = useState<{ date: string; time: string } | null>(null)
  const [teacherViewed] = useState(false)
  const [teacherFeedback] = useState({
    text: 'پاسخ خوب بود؛ فقط بخش سوم را کامل‌تر بنویس.',
    score: '۱۷',
  })

  const addAttachment = (type: 'file' | 'image' | 'voice') => {
    const labels = { file: 'پاسخ_تمرین.pdf', image: 'عکس_پاسخ.jpg', voice: 'پیام_صوتی.m4a' }
    setAttachments(prev => [...prev, { type, label: labels[type] }])
    setToast(type === 'voice' ? 'پیام صوتی اضافه شد' : 'فایل اضافه شد')
    setTimeout(() => setToast(null), 1200)
    if (type === 'voice') setRecording(false)
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const submitHomework = () => {
    if (!textAnswer.trim() && attachments.length === 0) {
      setToast('متن یا فایل پاسخ را اضافه کنید')
      setTimeout(() => setToast(null), 1400)
      return
    }
    setSubmittedAt({ date: '۱۴۰۵/۰۷/۲۸', time: '۱۱:۳۰' })
    setSubmitted(true)
    setEditingSubmission(false)
    setToast('تکلیف با موفقیت ارسال شد')
    setTimeout(() => setToast(null), 1600)
  }

  const deleteSubmission = () => {
    setSubmitted(false)
    setSubmittedAt(null)
    setEditingSubmission(false)
    setTextAnswer('')
    setAttachments([])
    setToast('ارسال تکلیف حذف شد')
    setTimeout(() => setToast(null), 1400)
  }

  if (isStudent) {
    const showForm = !submitted || editingSubmission
    return <div className="screen inner-screen" dir="rtl">
      <SubHeader back={goBack} title={meta.title} subtitle="علوم تجربی · کلاس ۹۰۱" />
      <main className="inner-content" style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
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
          {!submitted && <p className="sa-status-hint">پاسخ خود را قبل از مهلت ارسال کنید.</p>}
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
              <span className={`sa-chip ${teacherViewed ? 'ok' : 'wait'}`}>ثبت‌شده</span>
            </div>
            <div className="sa-feedback">
              <div className="sa-score">
                <span>نمره</span>
                <b>{fa(teacherFeedback.score)}<small> از ۲۰</small></b>
              </div>
              <p>{teacherFeedback.text}</p>
            </div>
          </section>
        )}

        <section className="sa-panel">
          <div className="sa-panel-head"><strong>توضیحات معلم</strong></div>
          <p className="sa-desc">{meta.description}</p>
        </section>

        <section className="sa-panel">
          <div className="sa-panel-head"><strong>فایل‌های معلم</strong><span>۲ مورد</span></div>
          <div className="sa-file-list">
            <button type="button" className="resource" onClick={() => { setToast('دانلود شروع شد'); setTimeout(() => setToast(null), 1200) }}>
              <span className="resource-icon blue"><Icon name="file" /></span>
              <div>
                <strong>{meta.fileName}</strong>
                <small>فایل ضمیمه · {meta.fileSize}</small>
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
              <button type="button" className="upload" onClick={() => addAttachment('image')}>
                <Icon name="image" />
                <div>
                  <strong>افزودن عکس</strong>
                  <span>تصویر از گالری یا دوربین</span>
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
                  <span>{recording ? 'برای ذخیره دوباره لمس کنید' : 'ویس کوتاه به‌عنوان پاسخ'}</span>
                </div>
                <Icon name={recording ? 'check' : 'plus'} />
              </button>
            </div>

            {attachments.length > 0 && (
              <div className="student-attach-list">
                {attachments.map((a, i) => (
                  <div className="resource student-attach-row" key={i}>
                    <span className="resource-icon green"><Icon name={a.type === 'voice' ? 'mic' : 'file'} /></span>
                    <div>
                      <strong>{a.label}</strong>
                      <small>{a.type}</small>
                    </div>
                    <button type="button" className="attach-remove" onClick={() => removeAttachment(i)}>
                      <Icon name="close" size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
      <div className="sticky-action">
        {showForm ? (
          <button onClick={submitHomework}>ارسال تکلیف</button>
        ) : (
          <button className="secondary" onClick={goBack}>بازگشت</button>
        )}
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  }

  return <div className="screen inner-screen" dir="rtl">
    <SubHeader back={goBack} title={meta.title} subtitle="علوم تجربی · کلاس ۹۰۱" />
    <main className="inner-content" style={{ padding: '15px' }}>
      <p>نمایش پنل معلم برای این بخش فعال است.</p>
    </main>
  </div>
}

export default function App() {
  const [history, setHistory] = useState<Screen[]>(['assignment'])
  const [role] = useState<UserRole>('student')
  const screen = history[history.length - 1]

  const navigate = (next: Screen) => {
    setHistory(h => [...h, next])
    window.scrollTo(0, 0)
  }

  const goBack = () => {
    setHistory(h => (h.length <= 1 ? h : h.slice(0, -1)))
    window.scrollTo(0, 0)
  }

  return <div className="app-shell" dir="rtl">
    {screen === 'assignment' && <Assignment navigate={navigate} goBack={goBack} role={role} />}
  </div>
}