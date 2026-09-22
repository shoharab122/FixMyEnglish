import { useEffect, useState, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { vocabApi } from '../api/vocab';
import { gamificationApi } from '../api/gamification';
import { paymentsApi } from '../api/payments';
import { Icon } from '../components/Icon';
import './Overview.css';

/* ---------- Static content ---------- */
const PROGRESS_CARDS = [
  {
    id: 'p1',
    label: 'Beginner’s Language Mastery',
    percent: 86,
    accent: 'lime',
    icon: 'book',
    next: 'Lesson 12 · Family vocabulary',
    remaining: '3 lessons to go',
  },
  {
    id: 'p2',
    label: 'English Essentials Course',
    percent: 32,
    accent: 'pink',
    icon: 'target',
    next: 'Unit 4 · Past tense verbs',
    remaining: '18 lessons to go',
  },
  {
    id: 'p3',
    label: 'Novice to Proficient English',
    percent: 5,
    accent: 'purple',
    icon: 'flag',
    next: 'Module 1 · Foundations',
    remaining: '42 lessons to go',
  },
];

const CATEGORIES = [
  { id: 'c1', label: 'Vocabulary', hint: '1,240 words', icon: 'book',   color: 'lime',   to: '/vocabulary' },
  { id: 'c2', label: 'Grammar',    hint: '86 rules',    icon: 'target', color: 'pink',   to: '/grammar' },
  { id: 'c3', label: 'Speaking',   hint: '24 rooms',    icon: 'mic',    color: 'purple', to: '/speaking' },
  { id: 'c4', label: 'Exams',      hint: '12 papers',   icon: 'flag',   color: 'yellow', to: '/exams' },
];

const ARTICLES = [
  {
    id: 'a1',
    title: 'Mastering Vocabulary: Proven Strategies for Efficient English Word Learning',
    meta: 'Technique · 5 min read',
    tag: 'Vocabulary',
    art: 'vocab',
    author: 'Nusrat H.',
  },
  {
    id: 'a2',
    title: 'Embarking on English: A Beginner’s Guide to Kickstart Your Language Learning',
    meta: 'Technique · 5 min read',
    tag: 'Getting started',
    art: 'start',
    author: 'Tanvir A.',
  },
];

const UPCOMING_COURSES = [
  {
    id: 'c1',
    tags: ['Beginner', 'Grammar'],
    title: 'English Grammar',
    blurb: 'Basic English grammar includes learning verbs, nouns, and simple sentence structure.',
    duration: '3 months',
    lessons: '56 lessons',
    price: '৳ 800',
    featured: true,
    accent: 'yellow',
    icon: 'target',
    rating: 4.9,
    students: 1240,
  },
  {
    id: 'c2',
    tags: ['Intermediate', 'Vocabulary'],
    title: 'Idioms about friendship',
    blurb: 'Friendship idioms add colorful expressions like “to be on the same page”.',
    duration: '2 weeks',
    lessons: '10 lessons',
    price: '৳ 350',
    featured: false,
    accent: 'purple',
    icon: 'book',
    rating: 4.7,
    students: 412,
  },
];

/* Calendar data — a real three-week window built from today's actual date,
   so "today" is always correct instead of a frozen, stale date. */
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function buildCalendarWeeks() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const mondayOffset = (today.getDay() + 6) % 7; // 0 = Monday ... 6 = Sunday
  const currentMonday = new Date(today);
  currentMonday.setDate(today.getDate() - mondayOffset);

  return [-1, 0, 1].map((weekOffset) => {
    const weekStart = new Date(currentMonday);
    weekStart.setDate(currentMonday.getDate() + weekOffset * 7);

    const days = DAY_LABELS.map((d, i) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      const isToday = date.getTime() === today.getTime();
      const isPast = date.getTime() < today.getTime();
      // Plausible practice history: most past weekdays practiced, weekends lighter
      const isWeekend = i >= 5;
      const has = isPast && (isWeekend ? i === 5 : true) && date.getDate() % 4 !== 0;
      return { d, n: date.getDate(), has, today: isToday, month: date.getMonth(), year: date.getFullYear() };
    });

    const anchor = days[3]; // Thursday best represents "which month this week belongs to"
    return {
      label: `${MONTH_NAMES[anchor.month]} ${anchor.year}`,
      short: MONTH_SHORT[anchor.month],
      days,
    };
  });
}

const CALENDAR_WEEKS = buildCalendarWeeks();
const TODAY_WEEK_INDEX = 1;
const TODAY_DAY_NUMBER = CALENDAR_WEEKS[TODAY_WEEK_INDEX].days.find((d) => d.today)?.n ?? new Date().getDate();

/* ---------- Helpers ---------- */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 5) return 'Burning the midnight oil';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  if (h < 21) return 'Good evening';
  return 'Good night';
}

function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target == null || target === 0) { setValue(0); return undefined; }
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

/* ============================================================
   Mascot — Langut-style yellow blob
   ============================================================ */
const MASCOT_STYLES = `
.ec-mascot-btn {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  display: inline-flex;
  line-height: 0;
  transition: transform 0.2s ease;
}
.ec-mascot-btn:hover { transform: translateY(-3px) scale(1.04); }
.ec-mascot-btn:active { transform: translateY(0) scale(0.96); }
.ec-mascot-btn:focus-visible {
  outline: 3px solid #D4F55C;
  outline-offset: 6px;
  border-radius: 50%;
}

.ec-mascot-glow,
.ec-mascot-eyes,
.ec-mascot-spark {
  transform-box: fill-box;
  transform-origin: center;
}

.ec-mascot-glow { transition: opacity 0.35s ease; }
.ec-mascot-svg--on .ec-mascot-glow { opacity: 0.9; animation: ec-mascot-breathe 2.6s ease-in-out infinite; }
.ec-mascot-svg--off .ec-mascot-glow { opacity: 0; }

.ec-mascot-svg--off { filter: grayscale(0.6) brightness(0.72); }
.ec-mascot-svg--on { filter: none; }

.ec-mascot-svg--off .ec-mascot-filament { opacity: 0.35; }

.ec-mascot-eyes { animation: ec-mascot-blink 4.5s ease-in-out infinite; }

.ec-mascot-svg--on .ec-mascot-spark--a { animation: ec-mascot-twinkle 1.8s ease-in-out infinite; }
.ec-mascot-svg--on .ec-mascot-spark--b { animation: ec-mascot-twinkle 1.8s ease-in-out infinite 0.5s; }
.ec-mascot-svg--off .ec-mascot-spark { opacity: 0.15; }

.ec-mascot-btn--pulse .ec-mascot-glow { animation: ec-mascot-pulse 0.45s ease-out; }

@keyframes ec-mascot-breathe {
  0%, 100% { opacity: 0.75; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.06); }
}
@keyframes ec-mascot-blink {
  0%, 92%, 100% { transform: scaleY(1); }
  95% { transform: scaleY(0.12); }
}
@keyframes ec-mascot-twinkle {
  0%, 100% { opacity: 0.35; transform: scale(0.85); }
  50% { opacity: 1; transform: scale(1.2); }
}
@keyframes ec-mascot-pulse {
  0% { opacity: 1; transform: scale(0.6); }
  100% { opacity: 0; transform: scale(1.6); }
}

/* Mobile: keep the mascot out of the headline's way — tucked in the corner, not centered */
@media (max-width: 640px) {
  .ec-hero { position: relative; }
  .ec-hero-art {
    position: absolute;
    top: 10px;
    right: 10px;
    margin: 0;
    transform: scale(0.68);
    transform-origin: top right;
    z-index: 5;
  }
}
`;

function LangutMascot({ size = 180 }) {
  const [isOn, setIsOn] = useState(true);
  const [pulse, setPulse] = useState(false);

  const handleClick = useCallback(() => {
    setIsOn((v) => !v);
    setPulse(true);
    setTimeout(() => setPulse(false), 450);
  }, []);

  return (
    <>
      <style>{MASCOT_STYLES}</style>
      <button
        type="button"
        className={`ec-mascot-btn${pulse ? ' ec-mascot-btn--pulse' : ''}`}
        onClick={handleClick}
        aria-label={isOn ? 'Mascot bulb — tap to switch off' : 'Mascot bulb — tap to switch on'}
        aria-pressed={isOn}
        title={isOn ? 'Tap to switch off' : 'Tap to switch on'}
      >
        <svg
          viewBox="0 0 170 170"
          width={size}
          height={size}
          fill="none"
          aria-hidden="true"
          className={`ec-mascot-svg${isOn ? ' ec-mascot-svg--on' : ' ec-mascot-svg--off'}`}
        >
          <defs>
            <radialGradient id="bulbGlow" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#FFF7C2" stopOpacity="0.95" />
              <stop offset="55%" stopColor="#F5E04D" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#F5E04D" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Ambient bulb glow */}
          <circle className="ec-mascot-glow" cx="85" cy="78" r="70" fill="url(#bulbGlow)" />

          <ellipse cx="85" cy="158" rx="46" ry="7" fill="#000" opacity="0.22" />

          {/* Arms */}
          <path d="M40 70c-8-4-16 0-18 8s2 16 10 18" stroke="#17102E" strokeWidth="4" fill="#F5E04D" strokeLinejoin="round" />
          <path d="M130 70c8-4 16 0 18 8s-2 16-10 18" stroke="#17102E" strokeWidth="4" fill="#F5E04D" strokeLinejoin="round" />

          {/* Bulb body */}
          <path
            d="M85 18c-30 0-54 24-54 54 0 17 7 31 15 40 5 6 8 12 8 19 0 4 3 7 7 7h48c4 0 7-3 7-7 0-7 3-13 8-19 8-9 15-23 15-40 0-30-24-54-54-54z"
            fill="#F5E04D"
            stroke="#17102E"
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* Filament-style highlight */}
          <path
            className="ec-mascot-filament"
            d="M85 40c-20 0-36 14-36 34 0 13 6 22 12 29"
            stroke="#FBF0A0"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />

          {/* Screw-base threads, like a real bulb */}
          <path d="M70 130h30" stroke="#17102E" strokeWidth="3" strokeLinecap="round" opacity="0.35" />
          <path d="M71 136h28" stroke="#17102E" strokeWidth="3" strokeLinecap="round" opacity="0.35" />

          {/* Eyes */}
          <g className="ec-mascot-eyes">
            <circle cx="68" cy="76" r="11" fill="#fff" stroke="#17102E" strokeWidth="3.5" />
            <circle cx="70" cy="78" r="4.8" fill="#17102E" />
            <circle cx="71.6" cy="76.4" r="1.5" fill="#fff" />
            <circle cx="102" cy="76" r="11" fill="#fff" stroke="#17102E" strokeWidth="3.5" />
            <circle cx="104" cy="78" r="4.8" fill="#17102E" />
            <circle cx="105.6" cy="76.4" r="1.5" fill="#fff" />
          </g>

          <path d="M76 98c3 5 6 7 9 7s6-2 9-7" stroke="#17102E" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <circle cx="56" cy="94" r="4.5" fill="#FF8FCB" opacity="0.55" />
          <circle cx="114" cy="94" r="4.5" fill="#FF8FCB" opacity="0.55" />

          {/* Feet */}
          <ellipse cx="70" cy="132" rx="12" ry="5.5" fill="#F5E04D" stroke="#17102E" strokeWidth="3.5" />
          <ellipse cx="100" cy="132" rx="12" ry="5.5" fill="#F5E04D" stroke="#17102E" strokeWidth="3.5" />

          {/* Twinkling sparkles */}
          <path className="ec-mascot-spark ec-mascot-spark--a" d="M22 40l3-7 3 7-7 3 7 3-3 7-3-7-7-3z" fill="#D4F55C" />
          <path className="ec-mascot-spark ec-mascot-spark--b" d="M148 46l2.5-6 2.5 6-6 2.5 6 2.5-2.5 6-2.5-6-6-2.5z" fill="#FF8FCB" />
        </svg>
      </button>
    </>
  );
}

/* ============================================================
   Article illustrations — hand-drawn SVGs related to topic
   ============================================================ */
function ArticleArtVocab() {
  return (
    <svg viewBox="0 0 200 140" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className="ec-article-svg">
      <defs>
        <linearGradient id="ecVocabBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFE5F2" />
          <stop offset="100%" stopColor="#FF8FCB" />
        </linearGradient>
      </defs>
      <rect width="200" height="140" fill="url(#ecVocabBg)" />
      <circle cx="170" cy="15" r="45" fill="#fff" opacity="0.22" />
      <circle cx="25" cy="125" r="40" fill="#fff" opacity="0.16" />

      {/* Book stack */}
      <rect x="55" y="95" width="90" height="16" rx="4" fill="#D4F55C" stroke="#17102E" strokeWidth="2.5" />
      <rect x="60" y="80" width="80" height="16" rx="4" fill="#9B7BFF" stroke="#17102E" strokeWidth="2.5" />
      <rect x="65" y="65" width="70" height="16" rx="4" fill="#F5E04D" stroke="#17102E" strokeWidth="2.5" />
      <line x1="80" y1="103" x2="120" y2="103" stroke="#17102E" strokeWidth="2" strokeLinecap="round" />
      <line x1="82" y1="88" x2="118" y2="88" stroke="#17102E" strokeWidth="2" strokeLinecap="round" />
      <line x1="85" y1="73" x2="115" y2="73" stroke="#17102E" strokeWidth="2" strokeLinecap="round" />

      {/* Floating word bubbles */}
      <g className="ec-float-slow">
        <circle cx="48" cy="45" r="15" fill="#fff" stroke="#17102E" strokeWidth="2.5" />
        <text x="48" y="51" textAnchor="middle" fontSize="14" fontWeight="900" fill="#17102E" fontFamily="sans-serif">A</text>
      </g>
      <g className="ec-float-mid">
        <circle cx="86" cy="32" r="18" fill="#D4F55C" stroke="#17102E" strokeWidth="2.5" />
        <text x="86" y="39" textAnchor="middle" fontSize="16" fontWeight="900" fill="#17102E" fontFamily="sans-serif">B</text>
      </g>
      <g className="ec-float-fast">
        <circle cx="126" cy="46" r="15" fill="#9B7BFF" stroke="#17102E" strokeWidth="2.5" />
        <text x="126" y="52" textAnchor="middle" fontSize="14" fontWeight="900" fill="#fff" fontFamily="sans-serif">C</text>
      </g>

      {/* Sparkles */}
      <path d="M168 68l2-6 2 6-6 2 6 2-2 6-2-6-6-2z" fill="#17102E" />
      <path d="M32 78l1.5-4 1.5 4-4 1.5 4 1.5-1.5 4-1.5-4-4-1.5z" fill="#17102E" />
    </svg>
  );
}

function ArticleArtStart() {
  return (
    <svg viewBox="0 0 200 140" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className="ec-article-svg">
      <defs>
        <linearGradient id="ecStartBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E5DCFF" />
          <stop offset="100%" stopColor="#7B5CF0" />
        </linearGradient>
      </defs>
      <rect width="200" height="140" fill="url(#ecStartBg)" />
      <circle cx="30" cy="25" r="50" fill="#fff" opacity="0.14" />
      <circle cx="180" cy="120" r="45" fill="#fff" opacity="0.12" />

      {/* Trajectory path */}
      <path
        d="M20 120 Q60 90 100 60 T180 20"
        stroke="#D4F55C"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="6 6"
        fill="none"
        opacity="0.9"
      />

      {/* Rocket */}
      <g className="ec-rocket">
        <path
          d="M100 30c-8 10-12 22-12 34l12 8 12-8c0-12-4-24-12-34z"
          fill="#fff"
          stroke="#17102E"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <circle cx="100" cy="52" r="5" fill="#D4F55C" stroke="#17102E" strokeWidth="2" />
        <path d="M88 72l-7 11 10-4z" fill="#D4F55C" stroke="#17102E" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M112 72l7 11-10-4z" fill="#D4F55C" stroke="#17102E" strokeWidth="2.5" strokeLinejoin="round" />
        {/* Flame */}
        <path d="M100 82c-3 5-3 10 0 14 3-4 3-9 0-14z" fill="#F5A623" stroke="#17102E" strokeWidth="2" strokeLinejoin="round" />
      </g>

      {/* Stars */}
      <circle cx="45" cy="42" r="2.5" fill="#fff" />
      <circle cx="152" cy="58" r="2" fill="#fff" />
      <circle cx="165" cy="100" r="2.5" fill="#fff" />
      <circle cx="60" cy="88" r="1.8" fill="#D4F55C" />
      <path d="M40 105l2-6 2 6-6 2 6 2-2 6-2-6-6-2z" fill="#D4F55C" />
      <path d="M170 28l1.5-4 1.5 4-4 1.5 4 1.5-1.5 4-1.5-4-4-1.5z" fill="#fff" />
    </svg>
  );
}

function ArticleArt({ kind }) {
  if (kind === 'vocab') return <ArticleArtVocab />;
  if (kind === 'start') return <ArticleArtStart />;
  return null;
}

function Skeleton({ w = '100%', h = 14, radius = 8, style }) {
  return <span className="ec-skel" style={{ width: w, height: h, borderRadius: radius, ...style }} />;
}

function XpIcon({ name, accent }) {
  return (
    <span className={`ec-xp-icon ec-xp-icon--${accent}`} aria-hidden="true">
      <Icon name={name} />
    </span>
  );
}

function Counter({ value, suffix = '' }) {
  const displayed = useCountUp(value);
  return <>{displayed}{suffix}</>;
}

export function Overview() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [wordOfDay, setWordOfDay] = useState(null);
  const [wordLoading, setWordLoading] = useState(true);

  const [xp, setXp] = useState(null);
  const [xpLoading, setXpLoading] = useState(true);
  const [xpError, setXpError] = useState(false);

  const [weekIndex, setWeekIndex] = useState(TODAY_WEEK_INDEX);
  const [activeDay, setActiveDay] = useState(TODAY_DAY_NUMBER);

  const [buying, setBuying] = useState(null);
  const [bought, setBought] = useState(new Set());
  const [buyError, setBuyError] = useState(null);

  const [animateBars, setAnimateBars] = useState(false);

  const heroRef = useRef(null);

  const loadWord = useCallback(() => {
    setWordLoading(true);
    return vocabApi
      .wordOfDay()
      .then((d) => setWordOfDay(d))
      .catch(() => setWordOfDay(null))
      .finally(() => setWordLoading(false));
  }, []);

  const loadXp = useCallback(() => {
    setXpLoading(true);
    setXpError(false);
    return gamificationApi
      .summary()
      .then((d) => setXp(d))
      .catch(() => setXpError(true))
      .finally(() => setXpLoading(false));
  }, []);

  useEffect(() => {
    loadWord();
    loadXp();
    const t = requestAnimationFrame(() => setAnimateBars(true));
    return () => cancelAnimationFrame(t);
  }, [loadWord, loadXp]);

  /* Desktop-only hero parallax */
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return undefined;
    if (window.matchMedia('(pointer: coarse)').matches) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
      el.style.setProperty('--px', `${x}px`);
      el.style.setProperty('--py', `${y}px`);
    };
    const onLeave = () => {
      el.style.setProperty('--px', '0px');
      el.style.setProperty('--py', '0px');
    };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const firstName = user?.name?.split(' ')[0] || 'there';
  const greeting = getGreeting();
  const week = CALENDAR_WEEKS[weekIndex];

  const goPrevWeek = () => setWeekIndex((i) => Math.max(0, i - 1));
  const goNextWeek = () => setWeekIndex((i) => Math.min(CALENDAR_WEEKS.length - 1, i + 1));

  /* Weekly practice count */
  const practiceDays = week.days.filter((d) => d.has).length;

  const buyCourse = (course) => {
    if (bought.has(course.id) || buying) return;
    setBuyError(null);
    setBuying(course.id);
    paymentsApi
      .checkout(course.id, 'bkash')
      .then(() => setBought((prev) => new Set(prev).add(course.id)))
      .catch(() => setBuyError(course.id))
      .finally(() => setBuying(null));
  };

  const xpGoalPct = xp?.xpGoal
    ? Math.min(100, Math.round((xp.xpToday / xp.xpGoal) * 100))
    : 0;

  const continueLesson = {
    title: 'Family & Friends',
    subtitle: 'Unit 1 · 20 words',
    progress: 45,
    to: '/vocabulary',
  };

  return (
    <div className="ec-overview">
      {/* ---------- Greeting ---------- */}
      <div className="ec-overview-head ec-anim-in">
        <div className="ec-overview-head-text">
          <p className="ec-overview-eyebrow">{greeting}</p>
          <h1 className="ec-page-title">Welcome back, {firstName}</h1>
          <p className="ec-page-sub">Small steps every day add up. Let’s keep the streak alive.</p>
        </div>
      </div>

      <div className="ec-grid">
        <section className="ec-col-main">
          {/* ============================================================
             HERO
             ============================================================ */}
          <div className="ec-hero ec-anim-in" style={{ animationDelay: '0.05s' }} ref={heroRef}>
            <div className="ec-hero-orb ec-hero-orb--a" aria-hidden="true" />
            <div className="ec-hero-orb ec-hero-orb--b" aria-hidden="true" />

            <div className="ec-hero-copy">
              <div className="ec-hero-badges">
                <span className="ec-hero-badge">Today’s focus</span>
                <span className="ec-hero-streak">
                  <Icon name="zap" />
                  <strong>{xp?.streak ?? 12}</strong> day streak
                </span>
              </div>

              {wordLoading ? (
                <>
                  <Skeleton w="80%" h={26} style={{ marginBottom: 10 }} />
                  <Skeleton w="55%" h={26} style={{ marginBottom: 22 }} />
                </>
              ) : (
                <h2 className="ec-hero-headline">
                  {wordOfDay
                    ? <>Learn <em>“{wordOfDay.word}”</em> today</>
                    : 'Ready to learn English?'}
                </h2>
              )}

              {!wordLoading && wordOfDay?.meaning && (
                <p className="ec-hero-sub">{wordOfDay.meaning}</p>
              )}

              <div className="ec-hero-actions">
                <Link to="/vocabulary" className="ec-btn-primary ec-btn-primary--lime">
                  Start learning
                  <span className="ec-btn-arrow" aria-hidden="true">→</span>
                </Link>
                <Link to="/progress" className="ec-hero-link">View progress</Link>
              </div>

              {/* Continue learning mini card */}
              <Link to={continueLesson.to} className="ec-hero-continue">
                <span className="ec-hero-continue-icon" aria-hidden="true">
                  <Icon name="book" />
                </span>
                <span className="ec-hero-continue-body">
                  <span className="ec-hero-continue-label">Continue where you left off</span>
                  <strong className="ec-hero-continue-title">{continueLesson.title}</strong>
                  <span className="ec-hero-continue-sub">{continueLesson.subtitle}</span>
                </span>
                <span className="ec-hero-continue-progress">
                  <svg viewBox="0 0 36 36" width="42" height="42" aria-hidden="true">
                    <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,.22)" strokeWidth="4" />
                    <circle
                      cx="18" cy="18" r="15" fill="none"
                      stroke="#D4F55C" strokeWidth="4" strokeLinecap="round"
                      strokeDasharray={`${(continueLesson.progress / 100) * 94.2} 94.2`}
                      transform="rotate(-90 18 18)"
                    />
                  </svg>
                  <span className="ec-hero-continue-pct">{continueLesson.progress}%</span>
                </span>
              </Link>
            </div>

            <div className="ec-hero-art">
              <LangutMascot size={200} />
            </div>
          </div>

          {/* ============================================================
             CATEGORIES
             ============================================================ */}
          <div className="ec-section-head ec-section-head--tight">
            <h2 className="ec-section-title">Choose what to learn</h2>
            <Link to="/curriculum" className="ec-section-link">See all →</Link>
          </div>

          <div className="ec-categories ec-anim-in" style={{ animationDelay: '0.08s' }}>
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat.id}
                type="button"
                className={`ec-category ec-category--${cat.color}`}
                onClick={() => navigate(cat.to)}
                style={{ animationDelay: `${0.1 + i * 0.05}s` }}
              >
                <span className="ec-category-icon" aria-hidden="true">
                  <Icon name={cat.icon} />
                </span>
                <span className="ec-category-label">{cat.label}</span>
                <span className="ec-category-hint">{cat.hint}</span>
              </button>
            ))}
          </div>

          {/* ============================================================
             XP ROW
             ============================================================ */}
          <div className="ec-section-head ec-section-head--tight">
            <h2 className="ec-section-title">Your activity</h2>
          </div>

          <div className="ec-xp-row ec-anim-in" style={{ animationDelay: '0.1s' }}>
            {xpLoading ? (
              [0, 1, 2].map((i) => (
                <div className="ec-xp-card" key={i}>
                  <Skeleton w={44} h={44} radius={14} />
                  <Skeleton w="60%" h={22} style={{ marginTop: 14 }} />
                  <Skeleton w="80%" h={12} style={{ marginTop: 6 }} />
                </div>
              ))
            ) : xpError ? (
              <div className="ec-xp-card ec-xp-card--error">
                <span className="ec-xp-label">Couldn’t load your stats.</span>
                <button type="button" className="ec-btn-primary ec-btn-primary--sm" onClick={loadXp}>
                  Retry
                </button>
              </div>
            ) : xp ? (
              <>
                <div className="ec-xp-card ec-xp-card--streak">
                  <XpIcon name="zap" accent="yellow" />
                  <span className="ec-xp-value">
                    <Counter value={xp.streak} />
                    <span className="ec-xp-unit">days</span>
                  </span>
                  <span className="ec-xp-label">Current streak</span>
                  <span className="ec-xp-trend ec-xp-trend--up">🔥 Personal best</span>
                </div>

                <div className="ec-xp-card ec-xp-card--goal">
                  <XpIcon name="target" accent="lime" />
                  <span className="ec-xp-value">
                    <Counter value={xp.xpToday} />
                    <span className="ec-xp-unit">/ {xp.xpGoal}</span>
                  </span>
                  <span className="ec-xp-label">Today’s XP</span>
                  <div className="ec-xp-mini">
                    <div className="ec-xp-mini-fill" style={{ width: animateBars ? `${xpGoalPct}%` : '0%' }} />
                  </div>
                  <span className="ec-xp-trend">{xpGoalPct}% of daily goal</span>
                </div>

                <div className="ec-xp-card ec-xp-card--rank">
                  <XpIcon name="trophy" accent="pink" />
                  <span className="ec-xp-value">
                    #<Counter value={xp.rank} />
                  </span>
                  <span className="ec-xp-label">{xp.rankName}</span>
                  <span className="ec-xp-trend">+3 this week</span>
                </div>
              </>
            ) : null}
          </div>

          {/* ============================================================
             PROGRESS
             ============================================================ */}
          <div className="ec-section-head">
            <h2 className="ec-section-title">Your lessons</h2>
            <Link to="/progress" className="ec-section-link">See all →</Link>
          </div>

          <div className="ec-progress-row">
            {PROGRESS_CARDS.map((c, i) => (
              <div
                className={`ec-progress-card ec-progress-card--${c.accent} ec-anim-in`}
                key={c.id}
                style={{ animationDelay: `${0.1 + i * 0.06}s` }}
                onClick={() => navigate('/curriculum')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate('/curriculum'); }}
              >
                <div className="ec-progress-top">
                  <span className="ec-progress-icon" aria-hidden="true">
                    <Icon name={c.icon} />
                  </span>
                  <span className="ec-progress-pct">
                    <Counter value={c.percent} suffix="%" />
                  </span>
                </div>
                <p className="ec-progress-label">{c.label}</p>
                <p className="ec-progress-next">{c.next}</p>
                <div className="ec-progress-bar-row">
                  <div className="ec-progress-bar">
                    <div
                      className="ec-progress-bar-fill"
                      style={{ width: animateBars ? `${c.percent}%` : '0%' }}
                    />
                  </div>
                </div>
                <div className="ec-progress-foot">
                  <span className="ec-progress-caption">{c.remaining}</span>
                  <span className="ec-progress-cta" aria-hidden="true">
                    Continue
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* ============================================================
             ARTICLES — now with real illustrations
             ============================================================ */}
          <div className="ec-section-head">
            <h2 className="ec-section-title">Top articles</h2>
            <Link to="/curriculum" className="ec-section-link">Browse all →</Link>
          </div>

          <div className="ec-article-row">
            {ARTICLES.map((a, i) => (
              <article
                className="ec-article-card ec-anim-in"
                key={a.id}
                style={{ animationDelay: `${0.15 + i * 0.06}s` }}
                tabIndex={0}
              >
                <div className={`ec-article-art ec-article-art--${a.art}`} aria-hidden="true">
                  <ArticleArt kind={a.art} />
                  <span className="ec-article-tag">{a.tag}</span>
                  <span className="ec-article-bookmark">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 4h12v16l-6-4-6 4z" />
                    </svg>
                  </span>
                </div>
                <div className="ec-article-body">
                  <h3>{a.title}</h3>
                  <div className="ec-article-foot">
                    <span className="ec-article-avatar" aria-hidden="true">
                      {a.author.charAt(0)}
                    </span>
                    <span className="ec-article-meta">{a.author} · {a.meta}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ============================================================
           SIDEBAR
           ============================================================ */}
        <aside className="ec-col-side">
          {/* ---------- Calendar (redesigned) ---------- */}
          <div className="ec-calendar-card ec-anim-in" style={{ animationDelay: '0.1s' }}>
            <div className="ec-calendar-head">
              <div className="ec-calendar-head-copy">
                <span className="ec-calendar-eyebrow">Practice calendar</span>
                <h3>{week.label}</h3>
              </div>
              <div className="ec-calendar-nav">
                <button
                  type="button"
                  aria-label="Previous month"
                  onClick={goPrevWeek}
                  disabled={weekIndex === 0}
                >
                  ‹
                </button>
                <button
                  type="button"
                  aria-label="Next month"
                  onClick={goNextWeek}
                  disabled={weekIndex === CALENDAR_WEEKS.length - 1}
                >
                  ›
                </button>
              </div>
            </div>

            <div className="ec-calendar-stats">
              <div className="ec-calendar-stat">
                <span className="ec-calendar-stat-value">{practiceDays}</span>
                <span className="ec-calendar-stat-label">days active</span>
              </div>
              <div className="ec-calendar-stat">
                <span className="ec-calendar-stat-value">{practiceDays * 45}</span>
                <span className="ec-calendar-stat-label">XP this week</span>
              </div>
              <div className="ec-calendar-stat ec-calendar-stat--streak">
                <span className="ec-calendar-stat-value">
                  🔥 {xp?.streak ?? 7}
                </span>
                <span className="ec-calendar-stat-label">streak</span>
              </div>
            </div>

            <div className="ec-calendar-weekdays" aria-hidden="true">
              <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
            </div>

            <div className="ec-calendar-days">
              {week.days.map((w) => {
                const isActive = activeDay === w.n;
                const isToday = w.today;
                return (
                  <button
                    type="button"
                    key={w.n}
                    className={
                      `ec-calendar-day${isActive ? ' ec-calendar-day--active' : ''}` +
                      `${isToday ? ' ec-calendar-day--today' : ''}` +
                      `${w.has ? ' ec-calendar-day--practiced' : ''}`
                    }
                    onClick={() => setActiveDay(w.n)}
                  >
                    <strong>{w.n}</strong>
                    <span className={`ec-calendar-dot${w.has ? ' ec-calendar-dot--on' : ''}`} />
                  </button>
                );
              })}
            </div>

            <div className="ec-calendar-legend">
              <span className="ec-calendar-legend-item">
                <i className="ec-calendar-dot ec-calendar-dot--on" /> Practiced
              </span>
              <span className="ec-calendar-legend-item">
                <i className="ec-calendar-dot ec-calendar-dot--today" /> Today
              </span>
              <span className="ec-calendar-legend-item">
                <i className="ec-calendar-dot" /> Not yet
              </span>
            </div>
          </div>

          {/* ---------- Courses ---------- */}
          <div className="ec-section-head ec-section-head--aside">
            <h2 className="ec-section-title">Courses</h2>
            <Link to="/pricing" className="ec-section-link">All →</Link>
          </div>

          <div className="ec-course-list">
            {UPCOMING_COURSES.map((c, i) => {
              const isBought = bought.has(c.id);
              const isBuying = buying === c.id;
              const failed = buyError === c.id;
              return (
                <div
                  className={`ec-course-card ec-course-card--${c.accent} ec-anim-in`}
                  key={c.id}
                  style={{ animationDelay: `${0.15 + i * 0.08}s` }}
                >
                  {c.featured && <span className="ec-course-ribbon">Popular</span>}

                  <div className="ec-course-head-row">
                    <div className="ec-course-badge" aria-hidden="true">
                      <Icon name={c.icon} />
                    </div>
                    <div className="ec-course-tags">
                      {c.tags.map((t) => (
                        <span className={`ec-tag ec-tag--${t.toLowerCase()}`} key={t}>{t}</span>
                      ))}
                    </div>
                  </div>

                  <div className="ec-course-body">
                    <h3>{c.title}</h3>
                    <p className="ec-course-blurb">{c.blurb}</p>

                    <div className="ec-course-rating">
                      <span className="ec-course-stars" aria-hidden="true">★★★★★</span>
                      <strong>{c.rating}</strong>
                      <span className="ec-course-students">· {c.students.toLocaleString()} students</span>
                    </div>

                    <div className="ec-course-foot">
                      <span><Icon name="calendar" /> {c.duration}</span>
                      <span><Icon name="book" /> {c.lessons}</span>
                    </div>
                  </div>

                  <div className="ec-course-cta">
                    <span className="ec-course-price">{c.price}</span>
                    <button
                      type="button"
                      className={`ec-btn-pill${isBought ? ' ec-btn-pill--bought' : ''}`}
                      onClick={() => buyCourse(c)}
                      disabled={isBuying || isBought}
                    >
                      {isBought ? 'Owned ✓' : isBuying ? 'Processing…' : failed ? 'Retry' : 'Enroll now'}
                    </button>
                  </div>
                  {failed && <span className="ec-buy-error">Payment failed — try again</span>}
                </div>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Overview;
