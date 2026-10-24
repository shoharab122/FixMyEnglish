import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { vocabApi } from '../api/vocab';
import { gamificationApi } from '../api/gamification';
import { paymentsApi } from '../api/payments';
import { Icon } from '../components/Icon';
import './Overview.css';

/* ============================================================
   Static content (module scope → never re-created on render)
   ============================================================ */
const PROGRESS_CARDS = [
  { id: 'p1', label: 'Beginner’s Language Mastery', percent: 86, accent: 'lime',   icon: 'book',   next: 'Lesson 12 · Family vocabulary', lessonsLeft: 3 },
  { id: 'p2', label: 'English Essentials Course',   percent: 32, accent: 'pink',   icon: 'target', next: 'Unit 4 · Past tense verbs',     lessonsLeft: 18 },
  { id: 'p3', label: 'Novice to Proficient English', percent: 5,  accent: 'purple', icon: 'flag',   next: 'Module 1 · Foundations',        lessonsLeft: 42 },
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
    category: 'Technique', readTime: '5 min read', tag: 'Vocabulary', art: 'vocab', author: 'Nusrat H.',
  },
  {
    id: 'a2',
    title: 'Embarking on English: A Beginner’s Guide to Kickstart Your Language Learning',
    category: 'Technique', readTime: '5 min read', tag: 'Getting started', art: 'start', author: 'Tanvir A.',
  },
];

const UPCOMING_COURSES = [
  {
    id: 'c1', tags: ['Beginner', 'Grammar'], title: 'English Grammar',
    blurb: 'Basic English grammar includes learning verbs, nouns, and simple sentence structure.',
    duration: '3 months', lessons: '56 lessons', price: '৳ 800',
    featured: true, accent: 'yellow', icon: 'target', rating: 4.9, students: 1240,
  },
  {
    id: 'c2', tags: ['Intermediate', 'Vocabulary'], title: 'Idioms about friendship',
    blurb: 'Friendship idioms add colorful expressions like “to be on the same page”.',
    duration: '2 weeks', lessons: '10 lessons', price: '৳ 350',
    featured: false, accent: 'purple', icon: 'book', rating: 4.7, students: 412,
  },
];

const CONTINUE_LESSON = { title: 'Family & Friends', subtitle: 'Unit 1 · 20 words', progress: 45, to: '/vocabulary' };

const TOTAL_LESSONS_LEFT = PROGRESS_CARDS.reduce((s, c) => s + c.lessonsLeft, 0);
const AVG_PROGRESS = Math.round(PROGRESS_CARDS.reduce((s, c) => s + c.percent, 0) / PROGRESS_CARDS.length);
const XP_PER_SESSION = 45;

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TODAY_WEEK_INDEX = 1;

/* Three-week window built from the real date (previous, current, next week). */
function buildCalendarWeeks() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentMonday = new Date(today);
  currentMonday.setDate(today.getDate() - ((today.getDay() + 6) % 7));

  return [-1, 0, 1].map((offset) => {
    const weekStart = new Date(currentMonday);
    weekStart.setDate(currentMonday.getDate() + offset * 7);

    const days = DAY_LABELS.map((d, i) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      const isToday = date.getTime() === today.getTime();
      const isPast = date.getTime() < today.getTime();
      const has = isPast && (i < 5 || i === 5) && date.getDate() % 4 !== 0;
      return {
        key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
        d,
        n: date.getDate(),
        has,
        today: isToday,
        future: date.getTime() > today.getTime(),
        month: date.getMonth(),
        year: date.getFullYear(),
        full: `${d}, ${date.getDate()} ${MONTH_SHORT[date.getMonth()]}`,
      };
    });

    const anchor = days[3];
    return { label: `${MONTH_NAMES[anchor.month]} ${anchor.year}`, days };
  });
}

/* ============================================================
   Helpers
   ============================================================ */
const reducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    if (!Number.isFinite(target) || target <= 0) { setValue(0); return undefined; }
    if (reducedMotion()) { setValue(target); return undefined; }
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      setValue(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

const Counter = memo(function Counter({ value, suffix = '' }) {
  const displayed = useCountUp(value);
  return <>{displayed}{suffix}</>;
});

const Skeleton = memo(function Skeleton({ w = '100%', h = 14, radius = 8, style }) {
  return <span className="ec-skel" style={{ width: w, height: h, borderRadius: radius, ...style }} />;
});

/* Circular progress — pathLength=100 keeps the maths trivial */
const Ring = memo(function Ring({ value, size = 64, stroke = 7, tone = 'lime', children }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <span className={`ec-ring ec-ring--${tone}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 36 36" width={size} height={size} aria-hidden="true">
        <circle className="ec-ring-track" cx="18" cy="18" r="15.5" fill="none" strokeWidth={stroke / 2} />
        <circle
          className="ec-ring-fill"
          cx="18" cy="18" r="15.5" fill="none" strokeWidth={stroke / 2} strokeLinecap="round"
          pathLength="100" strokeDasharray="100" strokeDashoffset={100 - pct}
          transform="rotate(-90 18 18)"
        />
      </svg>
      {children && <span className="ec-ring-label">{children}</span>}
    </span>
  );
});

/* ============================================================
   Mascot (styles live in Overview.css — no runtime <style> tag)
   ============================================================ */
const LangutMascot = memo(function LangutMascot({ size = 180 }) {
  const [isOn, setIsOn] = useState(true);
  const [pulse, setPulse] = useState(false);
  const timer = useRef(0);

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleClick = useCallback(() => {
    setIsOn((v) => !v);
    setPulse(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setPulse(false), 450);
  }, []);

  return (
    <button
      type="button"
      className={`ec-mascot-btn${pulse ? ' ec-mascot-btn--pulse' : ''}`}
      onClick={handleClick}
      aria-label={isOn ? 'Mascot bulb — tap to switch off' : 'Mascot bulb — tap to switch on'}
      aria-pressed={isOn}
      title={isOn ? 'Tap to switch off' : 'Tap to switch on'}
    >
      <svg
        viewBox="0 0 170 170" width={size} height={size} fill="none" aria-hidden="true"
        className={`ec-mascot-svg${isOn ? ' ec-mascot-svg--on' : ' ec-mascot-svg--off'}`}
      >
        <defs>
          <radialGradient id="bulbGlow" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FFF7C2" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#F5E04D" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#F5E04D" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle className="ec-mascot-glow" cx="85" cy="78" r="70" fill="url(#bulbGlow)" />
        <ellipse cx="85" cy="158" rx="46" ry="7" fill="#000" opacity="0.22" />
        <path d="M40 70c-8-4-16 0-18 8s2 16 10 18" stroke="#17102E" strokeWidth="4" fill="#F5E04D" strokeLinejoin="round" />
        <path d="M130 70c8-4 16 0 18 8s-2 16-10 18" stroke="#17102E" strokeWidth="4" fill="#F5E04D" strokeLinejoin="round" />
        <path
          d="M85 18c-30 0-54 24-54 54 0 17 7 31 15 40 5 6 8 12 8 19 0 4 3 7 7 7h48c4 0 7-3 7-7 0-7 3-13 8-19 8-9 15-23 15-40 0-30-24-54-54-54z"
          fill="#F5E04D" stroke="#17102E" strokeWidth="4" strokeLinejoin="round"
        />
        <path className="ec-mascot-filament" d="M85 40c-20 0-36 14-36 34 0 13 6 22 12 29" stroke="#FBF0A0" strokeWidth="7" strokeLinecap="round" fill="none" />
        <path d="M70 130h30" stroke="#17102E" strokeWidth="3" strokeLinecap="round" opacity="0.35" />
        <path d="M71 136h28" stroke="#17102E" strokeWidth="3" strokeLinecap="round" opacity="0.35" />
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
        <ellipse cx="70" cy="132" rx="12" ry="5.5" fill="#F5E04D" stroke="#17102E" strokeWidth="3.5" />
        <ellipse cx="100" cy="132" rx="12" ry="5.5" fill="#F5E04D" stroke="#17102E" strokeWidth="3.5" />
        <path className="ec-mascot-spark ec-mascot-spark--a" d="M22 40l3-7 3 7-7 3 7 3-3 7-3-7-7-3z" fill="#D4F55C" />
        <path className="ec-mascot-spark ec-mascot-spark--b" d="M148 46l2.5-6 2.5 6-6 2.5 6 2.5-2.5 6-2.5-6-6-2.5z" fill="#FF8FCB" />
      </svg>
    </button>
  );
});

/* ============================================================
   Article illustrations
   ============================================================ */
const ArticleArtVocab = memo(function ArticleArtVocab() {
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
      <rect x="55" y="95" width="90" height="16" rx="4" fill="#D4F55C" stroke="#17102E" strokeWidth="2.5" />
      <rect x="60" y="80" width="80" height="16" rx="4" fill="#9B7BFF" stroke="#17102E" strokeWidth="2.5" />
      <rect x="65" y="65" width="70" height="16" rx="4" fill="#F5E04D" stroke="#17102E" strokeWidth="2.5" />
      <line x1="80" y1="103" x2="120" y2="103" stroke="#17102E" strokeWidth="2" strokeLinecap="round" />
      <line x1="82" y1="88" x2="118" y2="88" stroke="#17102E" strokeWidth="2" strokeLinecap="round" />
      <line x1="85" y1="73" x2="115" y2="73" stroke="#17102E" strokeWidth="2" strokeLinecap="round" />
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
      <path d="M168 68l2-6 2 6-6 2 6 2-2 6-2-6-6-2z" fill="#17102E" />
      <path d="M32 78l1.5-4 1.5 4-4 1.5 4 1.5-1.5 4-1.5-4-4-1.5z" fill="#17102E" />
    </svg>
  );
});

const ArticleArtStart = memo(function ArticleArtStart() {
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
      <path d="M20 120 Q60 90 100 60 T180 20" stroke="#D4F55C" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="6 6" fill="none" opacity="0.9" />
      <g className="ec-rocket">
        <path d="M100 30c-8 10-12 22-12 34l12 8 12-8c0-12-4-24-12-34z" fill="#fff" stroke="#17102E" strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="100" cy="52" r="5" fill="#D4F55C" stroke="#17102E" strokeWidth="2" />
        <path d="M88 72l-7 11 10-4z" fill="#D4F55C" stroke="#17102E" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M112 72l7 11-10-4z" fill="#D4F55C" stroke="#17102E" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M100 82c-3 5-3 10 0 14 3-4 3-9 0-14z" fill="#F5A623" stroke="#17102E" strokeWidth="2" strokeLinejoin="round" />
      </g>
      <circle cx="45" cy="42" r="2.5" fill="#fff" />
      <circle cx="152" cy="58" r="2" fill="#fff" />
      <circle cx="165" cy="100" r="2.5" fill="#fff" />
      <circle cx="60" cy="88" r="1.8" fill="#D4F55C" />
      <path d="M40 105l2-6 2 6-6 2 6 2-2 6-2-6-6-2z" fill="#D4F55C" />
      <path d="M170 28l1.5-4 1.5 4-4 1.5 4 1.5-1.5 4-1.5-4-4-1.5z" fill="#fff" />
    </svg>
  );
});

const ARTICLE_ART = { vocab: ArticleArtVocab, start: ArticleArtStart };

/* ============================================================
   Memoised cards — they only re-render when their own props change
   ============================================================ */
const CategoryCard = memo(function CategoryCard({ cat, index }) {
  return (
    <Link
      to={cat.to}
      className={`ec-category ec-category--${cat.color}`}
      style={{ animationDelay: `${0.08 + index * 0.04}s` }}
    >
      <span className="ec-category-icon" aria-hidden="true"><Icon name={cat.icon} /></span>
      <span className="ec-category-text">
        <span className="ec-category-label">{cat.label}</span>
        <span className="ec-category-hint">{cat.hint}</span>
      </span>
    </Link>
  );
});

const ProgressCard = memo(function ProgressCard({ c, index }) {
  const status = c.percent >= 80 ? 'Almost there' : c.percent >= 20 ? 'In progress' : 'Just started';
  return (
    <Link
      to="/curriculum"
      className={`ec-progress-card ec-progress-card--${c.accent} ec-anim-in`}
      style={{ animationDelay: `${0.08 + index * 0.05}s` }}
    >
      <div className="ec-progress-top">
        <span className="ec-progress-icon" aria-hidden="true"><Icon name={c.icon} /></span>
        <span className="ec-progress-status">{status}</span>
      </div>
      <p className="ec-progress-label">{c.label}</p>
      <p className="ec-progress-next">Up next · {c.next}</p>
      <div className="ec-progress-bar-row">
        <div
          className="ec-progress-bar" role="progressbar"
          aria-valuenow={c.percent} aria-valuemin={0} aria-valuemax={100}
          aria-label={`${c.label} progress`}
        >
          <div className="ec-progress-bar-fill" style={{ '--p': `${c.percent}%` }} />
        </div>
        <span className="ec-progress-pct"><Counter value={c.percent} suffix="%" /></span>
      </div>
      <div className="ec-progress-foot">
        <span className="ec-progress-caption">{c.lessonsLeft} lessons to go</span>
        <span className="ec-progress-cta" aria-hidden="true">
          Continue
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </Link>
  );
});

const ArticleCard = memo(function ArticleCard({ a, index }) {
  const Art = ARTICLE_ART[a.art];
  return (
    <article className="ec-article-card ec-anim-in" style={{ animationDelay: `${0.1 + index * 0.05}s` }} tabIndex={0}>
      <div className="ec-article-art" aria-hidden="true">
        {Art && <Art />}
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
          <span className="ec-article-avatar" aria-hidden="true">{a.author.charAt(0)}</span>
          <span className="ec-article-meta">
            <strong>{a.author}</strong>
            <span>{a.category} · {a.readTime}</span>
          </span>
        </div>
      </div>
    </article>
  );
});

const CourseCard = memo(function CourseCard({ c, index, isBought, isBuying, failed, onBuy }) {
  return (
    <div className={`ec-course-card ec-course-card--${c.accent} ec-anim-in`} style={{ animationDelay: `${0.1 + index * 0.06}s` }}>
      <div className="ec-course-head-row">
        <div className="ec-course-badge" aria-hidden="true"><Icon name={c.icon} /></div>
        <div className="ec-course-tags">
          {c.tags.map((t) => (
            <span className={`ec-tag ec-tag--${t.toLowerCase()}`} key={t}>{t}</span>
          ))}
        </div>
        {c.featured && <span className="ec-course-popular">Popular</span>}
      </div>

      <div className="ec-course-body">
        <h3>{c.title}</h3>
        <p className="ec-course-blurb">{c.blurb}</p>
        <div className="ec-course-rating">
          <span className="ec-course-stars" aria-hidden="true">★★★★★</span>
          <strong>{c.rating}</strong>
          <span className="ec-course-students">{c.students.toLocaleString()} students</span>
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
          onClick={() => onBuy(c)}
          disabled={isBuying || isBought}
        >
          {isBought ? 'Enrolled ✓' : isBuying ? 'Processing…' : failed ? 'Retry' : 'Enroll now'}
        </button>
      </div>
      {failed && <span className="ec-buy-error" role="alert">Payment failed. Check your bKash balance and try again.</span>}
    </div>
  );
});

/* Weekly XP bars — derived from the practice calendar + live XP for today */
const WeeklyChart = memo(function WeeklyChart({ days, xpToday, xpGoal }) {
  const { bars, total, best } = useMemo(() => {
    const list = days.map((d) => ({
      key: d.key, label: d.d.charAt(0), today: d.today, future: d.future,
      xp: d.today ? (xpToday ?? 0) : d.has ? XP_PER_SESSION : 0,
    }));
    const max = Math.max(xpGoal || 0, ...list.map((b) => b.xp), 1);
    return {
      bars: list.map((b) => ({ ...b, h: Math.max(6, Math.round((b.xp / max) * 100)) })),
      total: list.reduce((s, b) => s + b.xp, 0),
      best: Math.max(...list.map((b) => b.xp)),
    };
  }, [days, xpToday, xpGoal]);

  return (
    <div className="ec-weekly ec-anim-in" style={{ animationDelay: '0.14s' }}>
      <div className="ec-weekly-head">
        <div>
          <h3>This week</h3>
          <p>XP earned each day</p>
        </div>
        <div className="ec-weekly-totals">
          <span><strong>{total}</strong> total XP</span>
          <span><strong>{best}</strong> best day</span>
        </div>
      </div>
      <div className="ec-weekly-bars" role="img" aria-label={`Weekly XP: ${total} total, best day ${best}`}>
        {bars.map((b) => (
          <div className={`ec-bar${b.today ? ' ec-bar--today' : ''}${b.xp === 0 ? ' ec-bar--empty' : ''}`} key={b.key}>
            <span className="ec-bar-value">{b.xp > 0 ? b.xp : ''}</span>
            <span className="ec-bar-track"><span className="ec-bar-fill" style={{ '--h': `${b.h}%` }} /></span>
            <span className="ec-bar-label">{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

const PlanCard = memo(function PlanCard({ word, xp }) {
  const remaining = xp ? Math.max(0, (xp.xpGoal || 0) - (xp.xpToday || 0)) : null;
  const goalDone = xp && xp.xpGoal > 0 && remaining === 0;
  return (
    <div className="ec-plan-card ec-anim-in" style={{ animationDelay: '0.06s' }}>
      <div className="ec-plan-head">
        <h3>Today’s plan</h3>
        <span className="ec-plan-count">{goalDone ? 'Goal reached' : '3 steps'}</span>
      </div>
      <ul className="ec-plan-list">
        <li>
          <Link to="/vocabulary" className="ec-plan-item">
            <span className="ec-plan-icon ec-plan-icon--lime"><Icon name="book" /></span>
            <span className="ec-plan-text">
              <strong>{word ? `Learn “${word}”` : 'Learn a new word'}</strong>
              <span>Word of the day · 2 min</span>
            </span>
          </Link>
        </li>
        <li>
          <Link to={CONTINUE_LESSON.to} className="ec-plan-item">
            <span className="ec-plan-icon ec-plan-icon--purple"><Icon name="flag" /></span>
            <span className="ec-plan-text">
              <strong>Finish {CONTINUE_LESSON.title}</strong>
              <span>{CONTINUE_LESSON.progress}% done · {CONTINUE_LESSON.subtitle}</span>
            </span>
          </Link>
        </li>
        <li>
          <Link to="/progress" className={`ec-plan-item${goalDone ? ' ec-plan-item--done' : ''}`}>
            <span className="ec-plan-icon ec-plan-icon--yellow">{goalDone ? <CheckIcon /> : <Icon name="zap" />}</span>
            <span className="ec-plan-text">
              <strong>{goalDone ? 'Daily XP goal complete' : remaining != null ? `Earn ${remaining} more XP` : 'Hit your daily XP goal'}</strong>
              <span>{xp ? `${xp.xpToday} of ${xp.xpGoal} XP today` : 'Stats are loading…'}</span>
            </span>
          </Link>
        </li>
      </ul>
    </div>
  );
});

const CalendarCard = memo(function CalendarCard({ weeks, xpToday, streak }) {
  const [weekIndex, setWeekIndex] = useState(TODAY_WEEK_INDEX);
  const [activeKey, setActiveKey] = useState(
    () => weeks[TODAY_WEEK_INDEX].days.find((d) => d.today)?.key ?? weeks[TODAY_WEEK_INDEX].days[0].key,
  );

  const week = weeks[weekIndex];
  const practiceDays = useMemo(() => week.days.filter((d) => d.has).length, [week]);
  const activeDay = useMemo(
    () => weeks.flatMap((w) => w.days).find((d) => d.key === activeKey),
    [weeks, activeKey],
  );

  const goPrev = useCallback(() => setWeekIndex((i) => Math.max(0, i - 1)), []);
  const goNext = useCallback(() => setWeekIndex((i) => Math.min(weeks.length - 1, i + 1)), [weeks.length]);

  let detail = 'Rest day';
  if (activeDay?.today) detail = `Today · ${xpToday ?? 0} XP so far`;
  else if (activeDay?.has) detail = `Practiced · +${XP_PER_SESSION} XP`;
  else if (activeDay?.future) detail = 'Upcoming · plan a session';
  else if (activeDay) detail = 'No session recorded';

  return (
    <div className="ec-calendar-card ec-anim-in" style={{ animationDelay: '0.1s' }}>
      <div className="ec-calendar-head">
        <div className="ec-calendar-head-copy">
          <span className="ec-calendar-eyebrow">Practice calendar</span>
          <h3>{week.label}</h3>
        </div>
        <div className="ec-calendar-nav">
          <button type="button" aria-label="Previous week" onClick={goPrev} disabled={weekIndex === 0}>‹</button>
          <button type="button" aria-label="Next week" onClick={goNext} disabled={weekIndex === weeks.length - 1}>›</button>
        </div>
      </div>

      <div className="ec-calendar-stats">
        <div className="ec-calendar-stat">
          <span className="ec-calendar-stat-value">{practiceDays}<small>/7</small></span>
          <span className="ec-calendar-stat-label">days active</span>
        </div>
        <div className="ec-calendar-stat">
          <span className="ec-calendar-stat-value">{practiceDays * XP_PER_SESSION}</span>
          <span className="ec-calendar-stat-label">XP this week</span>
        </div>
        <div className="ec-calendar-stat ec-calendar-stat--streak">
          <span className="ec-calendar-stat-value">{streak != null ? streak : '–'}</span>
          <span className="ec-calendar-stat-label">day streak</span>
        </div>
      </div>

      <div className="ec-calendar-weekdays" aria-hidden="true">
        <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
      </div>

      <div className="ec-calendar-days">
        {week.days.map((w) => {
          const cls = ['ec-calendar-day'];
          if (activeKey === w.key) cls.push('ec-calendar-day--active');
          if (w.today) cls.push('ec-calendar-day--today');
          if (w.has) cls.push('ec-calendar-day--practiced');
          return (
            <button
              type="button" key={w.key} className={cls.join(' ')}
              onClick={() => setActiveKey(w.key)}
              aria-pressed={activeKey === w.key}
              aria-label={`${w.full}${w.today ? ', today' : ''}${w.has ? ', practiced' : ''}`}
            >
              <strong>{w.n}</strong>
              <span className={`ec-calendar-dot${w.has ? ' ec-calendar-dot--on' : ''}`} />
            </button>
          );
        })}
      </div>

      <div className="ec-calendar-detail" aria-live="polite">
        <strong>{activeDay?.full}</strong>
        <span>{detail}</span>
      </div>

      <div className="ec-calendar-legend">
        <span className="ec-calendar-legend-item"><i className="ec-calendar-dot ec-calendar-dot--on" /> Practiced</span>
        <span className="ec-calendar-legend-item"><i className="ec-calendar-dot ec-calendar-dot--today" /> Today</span>
        <span className="ec-calendar-legend-item"><i className="ec-calendar-dot" /> No session</span>
      </div>
    </div>
  );
});

/* ============================================================
   Overview
   ============================================================ */
export function Overview() {
  const { user } = useAuth();

  const [wordOfDay, setWordOfDay] = useState(null);
  const [wordLoading, setWordLoading] = useState(true);
  const [xp, setXp] = useState(null);
  const [xpLoading, setXpLoading] = useState(true);
  const [xpError, setXpError] = useState(false);

  const [buying, setBuying] = useState(null);
  const [bought, setBought] = useState(() => new Set());
  const [buyError, setBuyError] = useState(null);

  const alive = useRef(true);
  const buyingRef = useRef(null);
  const boughtRef = useRef(bought);
  const heroRef = useRef(null);
  const artRef = useRef(null);

  /* Calendar is computed once per mount, not on module load, so it never goes stale. */
  const weeks = useMemo(buildCalendarWeeks, []);
  const todayWeekDays = weeks[TODAY_WEEK_INDEX].days;
  const greeting = useMemo(getGreeting, []);
  const todayLabel = useMemo(
    () => new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date()),
    [],
  );

  const loadWord = useCallback(() => {
    setWordLoading(true);
    return vocabApi
      .wordOfDay()
      .then((d) => { if (alive.current) setWordOfDay(d); })
      .catch(() => { if (alive.current) setWordOfDay(null); })
      .finally(() => { if (alive.current) setWordLoading(false); });
  }, []);

  const loadXp = useCallback(() => {
    setXpLoading(true);
    setXpError(false);
    return gamificationApi
      .summary()
      .then((d) => { if (alive.current) setXp(d); })
      .catch(() => { if (alive.current) setXpError(true); })
      .finally(() => { if (alive.current) setXpLoading(false); });
  }, []);

  useEffect(() => {
    alive.current = true;
    loadWord();
    loadXp();
    return () => { alive.current = false; };
  }, [loadWord, loadXp]);

  /* Desktop-only hero parallax — rAF-throttled, writes to one element, no re-renders */
  useEffect(() => {
    const hero = heroRef.current;
    const art = artRef.current;
    if (!hero || !art || !window.matchMedia) return undefined;
    if (window.matchMedia('(pointer: coarse)').matches || reducedMotion()) return undefined;

    let raf = 0;
    let rect = null;
    let x = 0;
    let y = 0;
    const apply = () => { raf = 0; art.style.transform = `translate3d(${x}px, ${y}px, 0)`; };
    const onEnter = () => { rect = hero.getBoundingClientRect(); };
    const onMove = (e) => {
      if (!rect) rect = hero.getBoundingClientRect();
      x = -((e.clientX - rect.left) / rect.width - 0.5) * 12;
      y = -((e.clientY - rect.top) / rect.height - 0.5) * 12;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onLeave = () => { x = 0; y = 0; rect = null; if (!raf) raf = requestAnimationFrame(apply); };

    hero.addEventListener('pointerenter', onEnter, { passive: true });
    hero.addEventListener('pointermove', onMove, { passive: true });
    hero.addEventListener('pointerleave', onLeave, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      hero.removeEventListener('pointerenter', onEnter);
      hero.removeEventListener('pointermove', onMove);
      hero.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  const buyCourse = useCallback((course) => {
    if (buyingRef.current || boughtRef.current.has(course.id)) return;
    buyingRef.current = course.id;
    setBuyError(null);
    setBuying(course.id);
    paymentsApi
      .checkout(course.id, 'bkash')
      .then(() => {
        boughtRef.current = new Set(boughtRef.current).add(course.id);
        if (alive.current) setBought(boughtRef.current);
      })
      .catch(() => { if (alive.current) setBuyError(course.id); })
      .finally(() => {
        buyingRef.current = null;
        if (alive.current) setBuying(null);
      });
  }, []);

  const firstName = user?.name?.split(' ')[0] || 'there';
  const xpGoalPct = xp?.xpGoal ? Math.min(100, Math.round((xp.xpToday / xp.xpGoal) * 100)) : 0;
  const xpRemaining = xp?.xpGoal ? Math.max(0, xp.xpGoal - xp.xpToday) : 0;

  return (
    <div className="ec-overview">
      {/* ---------- Greeting ---------- */}
      <header className="ec-overview-head ec-anim-in">
        <div className="ec-overview-head-text">
          <p className="ec-overview-eyebrow">{greeting}</p>
          <h1 className="ec-page-title">Welcome back, {firstName}</h1>
          <p className="ec-page-sub">Small steps every day add up. Let’s keep the streak alive.</p>
        </div>
        <div className="ec-head-chips">
          <span className="ec-chip"><Icon name="calendar" /> {todayLabel}</span>
          {xp && (
            <span className="ec-chip ec-chip--streak">
              <Icon name="zap" /> <strong>{xp.streak}</strong> day streak
            </span>
          )}
        </div>
      </header>

      <div className="ec-grid">
        <div className="ec-col-main">
          {/* ============================ HERO ============================ */}
          <section className="ec-hero ec-anim-in" style={{ animationDelay: '0.04s' }} ref={heroRef} aria-label="Today’s focus">
            <div className="ec-hero-orb ec-hero-orb--a" aria-hidden="true" />
            <div className="ec-hero-orb ec-hero-orb--b" aria-hidden="true" />

            <div className="ec-hero-copy">
              <div className="ec-hero-badges">
                <span className="ec-hero-badge">Today’s focus</span>
                {xp && (
                  <span className="ec-hero-streak">
                    <Icon name="zap" /> <strong>{xp.streak}</strong> day streak
                  </span>
                )}
              </div>

              {wordLoading ? (
                <>
                  <Skeleton w="80%" h={28} style={{ marginBottom: 10 }} />
                  <Skeleton w="55%" h={28} style={{ marginBottom: 22 }} />
                </>
              ) : (
                <h2 className="ec-hero-headline">
                  {wordOfDay ? <>Learn <em>“{wordOfDay.word}”</em> today</> : 'Ready to learn English?'}
                </h2>
              )}

              {!wordLoading && wordOfDay && (wordOfDay.phonetic || wordOfDay.partOfSpeech) && (
                <p className="ec-hero-word-meta">
                  {wordOfDay.partOfSpeech && <span className="ec-hero-pos">{wordOfDay.partOfSpeech}</span>}
                  {wordOfDay.phonetic && <span>{wordOfDay.phonetic}</span>}
                </p>
              )}
              {!wordLoading && wordOfDay?.meaning && <p className="ec-hero-sub">{wordOfDay.meaning}</p>}
              {!wordLoading && wordOfDay?.example && <p className="ec-hero-example">“{wordOfDay.example}”</p>}

              <div className="ec-hero-actions">
                <Link to="/vocabulary" className="ec-btn-primary ec-btn-primary--lime">
                  Start learning
                  <span className="ec-btn-arrow" aria-hidden="true">→</span>
                </Link>
                <Link to="/progress" className="ec-hero-link">View progress</Link>
              </div>

              <Link to={CONTINUE_LESSON.to} className="ec-hero-continue">
                <span className="ec-hero-continue-icon" aria-hidden="true"><Icon name="book" /></span>
                <span className="ec-hero-continue-body">
                  <span className="ec-hero-continue-label">Continue where you left off</span>
                  <strong className="ec-hero-continue-title">{CONTINUE_LESSON.title}</strong>
                  <span className="ec-hero-continue-sub">{CONTINUE_LESSON.subtitle}</span>
                </span>
                <Ring value={CONTINUE_LESSON.progress} size={44} stroke={8} tone="lime-on-dark">
                  {CONTINUE_LESSON.progress}%
                </Ring>
              </Link>
            </div>

            <div className="ec-hero-art" ref={artRef}>
              <div className="ec-hero-art-bob"><LangutMascot size={200} /></div>
            </div>
          </section>

          {/* ========================= CATEGORIES ========================= */}
          <div className="ec-section-head ec-section-head--tight">
            <h2 className="ec-section-title">Choose what to learn</h2>
            <Link to="/curriculum" className="ec-section-link">See all</Link>
          </div>
          <nav className="ec-categories" aria-label="Learning categories">
            {CATEGORIES.map((cat, i) => <CategoryCard key={cat.id} cat={cat} index={i} />)}
          </nav>

          {/* =========================== ACTIVITY ========================= */}
          <div className="ec-section-head ec-section-head--tight">
            <h2 className="ec-section-title">Your activity</h2>
            <Link to="/progress" className="ec-section-link">Full stats</Link>
          </div>

          <div className="ec-xp-row ec-anim-in" style={{ animationDelay: '0.08s' }}>
            {xpLoading ? (
              [0, 1, 2].map((i) => (
                <div className="ec-xp-card" key={i} aria-hidden="true">
                  <Skeleton w={44} h={44} radius={14} />
                  <Skeleton w="60%" h={24} style={{ marginTop: 14 }} />
                  <Skeleton w="80%" h={12} style={{ marginTop: 8 }} />
                </div>
              ))
            ) : xpError ? (
              <div className="ec-xp-card ec-xp-card--error" role="alert">
                <span className="ec-xp-label">Couldn’t load your stats. Check your connection and retry.</span>
                <button type="button" className="ec-btn-primary ec-btn-primary--sm" onClick={loadXp}>Retry</button>
              </div>
            ) : xp ? (
              <>
                <div className="ec-xp-card ec-xp-card--streak">
                  <div className="ec-xp-top">
                    <span className="ec-xp-icon ec-xp-icon--yellow" aria-hidden="true"><Icon name="zap" /></span>
                    <span className="ec-xp-badge">Personal best</span>
                  </div>
                  <span className="ec-xp-value"><Counter value={xp.streak} /><span className="ec-xp-unit">days</span></span>
                  <span className="ec-xp-label">Current streak</span>
                  <div className="ec-xp-week" aria-label="Practice this week">
                    {todayWeekDays.map((d) => (
                      <span
                        key={d.key}
                        className={`ec-xp-week-day${d.has ? ' is-on' : ''}${d.today ? ' is-today' : ''}`}
                        title={d.full}
                      >
                        {d.d.charAt(0)}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="ec-xp-card ec-xp-card--goal">
                  <div className="ec-xp-top">
                    <span className="ec-xp-icon ec-xp-icon--lime" aria-hidden="true"><Icon name="target" /></span>
                    <Ring value={xpGoalPct} size={46} stroke={8} tone="lime">{xpGoalPct}%</Ring>
                  </div>
                  <span className="ec-xp-value">
                    <Counter value={xp.xpToday} />
                    <span className="ec-xp-unit">/ {xp.xpGoal} XP</span>
                  </span>
                  <span className="ec-xp-label">Today’s XP</span>
                  <span className="ec-xp-trend">
                    {xpRemaining > 0 ? `${xpRemaining} XP to reach your daily goal` : 'Daily goal reached'}
                  </span>
                </div>

                <div className="ec-xp-card ec-xp-card--rank">
                  <div className="ec-xp-top">
                    <span className="ec-xp-icon ec-xp-icon--pink" aria-hidden="true"><Icon name="trophy" /></span>
                    <span className="ec-xp-badge ec-xp-badge--up">+3 this week</span>
                  </div>
                  <span className="ec-xp-value">#<Counter value={xp.rank} /></span>
                  <span className="ec-xp-label">{xp.rankName}</span>
                  <span className="ec-xp-trend">Leaderboard rank</span>
                </div>
              </>
            ) : null}
          </div>

          <WeeklyChart days={todayWeekDays} xpToday={xp?.xpToday} xpGoal={xp?.xpGoal} />

          {/* ============================ LESSONS ========================= */}
          <section className="ec-defer">
            <div className="ec-section-head">
              <div className="ec-section-head-copy">
                <h2 className="ec-section-title">Your lessons</h2>
                <p className="ec-section-sub">
                  {PROGRESS_CARDS.length} courses · {TOTAL_LESSONS_LEFT} lessons left · {AVG_PROGRESS}% average
                </p>
              </div>
              <Link to="/progress" className="ec-section-link">See all</Link>
            </div>
            <div className="ec-progress-row">
              {PROGRESS_CARDS.map((c, i) => <ProgressCard key={c.id} c={c} index={i} />)}
            </div>
          </section>

          {/* ============================ ARTICLES ======================== */}
          <section className="ec-defer">
            <div className="ec-section-head">
              <h2 className="ec-section-title">Top articles</h2>
              <Link to="/curriculum" className="ec-section-link">Browse all</Link>
            </div>
            <div className="ec-article-row">
              {ARTICLES.map((a, i) => <ArticleCard key={a.id} a={a} index={i} />)}
            </div>
          </section>
        </div>

        {/* ============================ SIDEBAR =========================== */}
        <aside className="ec-col-side">
          <PlanCard word={wordOfDay?.word} xp={xp} />
          <CalendarCard weeks={weeks} xpToday={xp?.xpToday} streak={xp?.streak} />

          <section className="ec-defer ec-course-section">
            <div className="ec-section-head ec-section-head--aside">
              <h2 className="ec-section-title">Courses</h2>
              <Link to="/pricing" className="ec-section-link">All</Link>
            </div>
            <div className="ec-course-list">
              {UPCOMING_COURSES.map((c, i) => (
                <CourseCard
                  key={c.id} c={c} index={i}
                  isBought={bought.has(c.id)}
                  isBuying={buying === c.id}
                  failed={buyError === c.id}
                  onBuy={buyCourse}
                />
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default Overview;
