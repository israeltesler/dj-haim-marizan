export const ASSETS = {
  hero: '/images/hero-haim-marizan.jpg',
  statement: '/images/statement-haim-marizan.jpg',
  album: 'https://assets.uberdesigner.ai/dj-zak/album.webp',
  play: 'https://assets.uberdesigner.ai/dj-zak/play.svg',
  playLarge: 'https://assets.uberdesigner.ai/dj-zak/play-lg.svg',
}

export const ARTIST = {
  first: 'DJ',
  name: 'Haim',
  surname: 'Marizan',
  descriptor: 'די ג׳יי לחתונות, בר ובת מצווה ואירועים',
  spec: '[ חתונות · בר מצווה · אירועים ]',
}

export const HERO_NOTES = [
  '• מוזיקה לכל שלב בערב — מקבלת הפנים',
  'ועד סוף הריקודים, בקצב שמתאים לכם.',
  '',
  '• הגברה, תאורה ותיאום מלא מול האולם,',
  'בצפון ובמרכז הארץ.',
]

export const STATEMENT_KICKER = 'קצת עליי'

export const STATEMENT_LINES = [
  'חיים מריזן מתאים את המוזיקה',
  'לזוג, לאורחים ולמה שאתם',
  'מחפשים — מעברים רכים בין',
  'חופה, רחבה, סלואו וסגנונות,',
  'והגברה נקייה לכל גודל אולם.',
]

export const STATEMENT_NOTE = [
  'במזרחית, פופ עכשווי, דאנס,',
  'קלאסיקות ורומנטיקה — לפי גיל',
  'האורחים, הזוג והאירוע שלכם.',
  'המטרה: ערב זורם, חגיגי ומרגש.',
]

export const EQUIPMENT_LABEL = 'מה מגיע איתי'
export const EQUIPMENT = ['מערכת הגברה', 'מיקרופונים', 'תאורת אווירה']

export const MENU_LINKS: [label: string, href: string][] = [
  ['קצת עליי', '#statement'],
  ['דוגמה', '#release'],
  ['צור קשר', '#tour'],
]

export const NAV = {
  menu: 'תפריט',
  localSuffix: ' · שעון מקומי',
  seeSchedule: 'בואו נסגור תאריך',
}

/** עדכן מספר וואטסאפ בפורמט בינלאומי ללא + (למשל 972501234567) */
export const SOCIAL = {
  whatsapp: 'https://wa.me/972500000000',
  instagram: 'https://www.instagram.com/dj_haim_merizan/',
  whatsappLabel: 'WhatsApp',
  instagramLabel: 'Instagram',
}

export const RELEASE = {
  kicker: '// האזנה לדוגמה',
  dateLine: 'חתונות · בר ובת מצווה · אירועי חברה',
  titleLine1: 'דוגמה',
  titleLine2: 'לסט',
  titleAria: 'דוגמה לסט לאירוע',
  lpTag: '[LIVE]',
  albumCoverAlt: 'תמונה לדוגמה — סט מוזיקלי לאירוע',
  playTheme: 'נגן דוגמת סט',
  pauseTheme: 'השהה את דוגמת הסט',
  caption1: 'האזינו לקטע לדוגמה מהסט',
  caption2: '10 שלבים · סביב שעה ורבע של ערב',
  cursor1: 'להאזנה',
  cursor2: 'לדוגמה',
}

export const TRACKLIST = {
  sectionAria: 'תכנון הערב',
  kicker: 'איך בנוי הערב',
  colNumber: '#',
  colName: 'שלב',
  colExample: 'דוגמה',
  colDuration: 'זמן משוער',
  playExcerpt: 'נגן דוגמה של',
  pauseExcerpt: 'השהה דוגמה של',
  bottomLine: 'רוצים סאונד כזה גם באירוע שלכם?',
  viewSchedule: 'השאירו פרטים',
}

export const LEAD_FORM = {
  titlePart1: 'בואו\u00a0',
  titlePart2: 'נדבר',
  titleAria: 'יצירת קשר לתיאום אירוע',
  kicker: '// השאירו פרטים',
  colName: 'שם',
  colPhone: 'טלפון',
  colEmail: 'אימייל',
  colEvent: 'פרטי האירוע',
  colAction: 'שליחה',
  namePlaceholder: 'שם מלא',
  phonePlaceholder: '050-0000000',
  emailPlaceholder: 'כתובת אימייל',
  eventTypeLabel: 'סוג האירוע',
  eventTypeDefault: 'בחרו סוג אירוע',
  eventTypes: ['חתונה', 'בר או בת מצווה', 'אירוע חברה', 'יום הולדת', 'אחר'],
  datePlaceholder: 'תאריך משוער',
  locationPlaceholder: 'אזור או שם האולם',
  guestsPlaceholder: 'כמה אורחים (בערך)',
  messagePlaceholder:
    'ספרו על האירוע: מה חשוב לכם במוזיקה, איזה סגנונות אתם אוהבים וכל פרט שכדאי לדעת.',
  submit: 'שלחו פנייה',
  success: 'תודה! קיבלנו את הפרטים וניצור איתכם קשר בהקדם.',
  footerNote:
    '* מגיע לפני האירוע להגברה ולבדיקת סאונד, ומתאם איתכם או עם האולם מראש.',
  footerCredit: 'חיים מריזן · די ג׳יי לחתונות ואירועים',
}

export const MAIN_THEME: string | null = null

export type Track = {
  title: string
  excerpt: number
  duration: string
  preview: string | null
}

export const TRACKS: Track[] = [
  ['קבלת פנים — אווירה רגועה', 32, '00:45'],
  ['כניסה לחופה', 43, '00:12'],
  ['יציאה מהחופה — כניסה חגיגית', 40, '00:18'],
  ['פתיחת רחבה', 42, '00:55'],
  ['שיא המסיבה', 41, '01:30'],
  ['מזרחית, טרנס ודאנס', 41, '00:40'],
  ['פופ והיטים עכשוויים', 44, '01:15'],
  ['שירים איטיים ורומנטיים', 38, '00:25'],
  ['אחרי חצות', 39, '00:50'],
  ['סיום הערב', 46, '00:20'],
].map(([title, excerpt, duration]) => ({
  title: String(title),
  excerpt: Number(excerpt),
  duration: String(duration),
  preview: null,
}))

export const META = {
  title: 'DJ Haim Marizan · די ג׳יי לחתונות ואירועים',
  description:
    'Haim Marizan — די ג׳יי מקצועי לחתונות, בר ובת מצווה ואירועים בצפון ובמרכז. האזינו לדוגמה, ראו איך בנוי הערב והשאירו פרטים לחזרה.',
}
