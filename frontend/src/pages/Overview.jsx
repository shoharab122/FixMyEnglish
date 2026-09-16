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
  { id: 'p1', label: 'Beginner’s Language Mastery', percent: 86, accent: 'lime',   icon: 'book' },
  { id: 'p2', label: 'English Essentials Course',   percent: 32, accent: 'pink',   icon: 'target' },
  { id: 'p3', label: 'Novice to Proficient English', percent: 5,  accent: 'purple', icon: 'flag' },
];

const CATEGORIES = [
  { id: 'c1', label: 'Vocabulary', icon: 'book',   color: 'lime' },
  { id: 'c2', label: 'Grammar',    icon: 'target', color: 'pink' },
  { id: 'c3', label: 'Speaking',   icon: 'mic',    color: 'purple' },
  { id: 'c4', label: 'Exams',      icon: 'flag',   color: 'yellow' },
];

const ARTICLES = [
  {
    id: 'a1',
    title: 'Mastering Vocabulary: Proven Strategies for Efficient English Word Learning',
    meta: 'Technique · 5 min read',
    tag: 'Vocabulary',
    art: 'a',
  },
  {
    id: 'a2',
    title: 'Embarking on English: A Beginner’s Guide to Kickstart Your Language Learning',
    meta: 'Technique · 5 min read',
    tag: 'Getting started',
    art: 'b',
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
  },
];

const CALENDAR_WEEKS = [
  {
    label: 'February 2024',
    days: [
      { d: 'Mon', n: 19, has: false }, { d: 'Tue', n: 20, has: true }, { d: 'Wed', n: 21, has: false },
      { d: 'Thu', n: 22, has: true }, { d: 'Fri', n: 23, has: false }, { d: 'Sat', n: 24, has: true }, { d: 'Sun', n: 25, has: false },
    ],
  },
  {
    label: 'March 2024',
    days: [
      { d: 'Mon', n: 23, has: false }, { d: 'Tue', n: 24, has: true }, { d: 'Wed', n: 25, has: true },
      { d: 'Thu', n: 26, has: true }, { d: 'Fri', n: 27, has: false }, { d: 'Sat', n: 28, has: true }, { d: 'Sun', n: 29, has: false },
    ],
  },
  {
    label: 'April 2024',
    days: [
      { d: 'Mon', n: 1, has: false }, { d: 'Tue', n: 2, has: true }, { d: 'Wed', n: 3, has: false },
      { d: 'Thu', n: 4, has: true }, { d: 'Fri', n: 5, has: false }, { d: 'Sat', n: 6, has: true }, { d: 'Sun', n: 7, has: false },
    ],
  },
];

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
    if (target == null || target === 0) { setValue(0); return; }
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
function LangutMascot({ size = 180 }) {
  return (
    <svg viewBox="0 0 170 170" width={size} height={size} fill="none" aria-hidden="true">
      <ellipse cx="85" cy="158" rx="46" ry="7" fill="#000" opacity="0.22" />
      <path d="M40 70c-8-4-16 0-18 8s2 16 10 18" stroke="#17102E" strokeWidth="4" fill="#F5E04D" strokeLinejoin="round" />
      <path d="M130 70c8-4 16 0 18 8s-2 16-10 18" stroke="#17102E" strokeWidth="4" fill="#F5E04D" strokeLinejoin="round" />
      <path
        d="M85 18c-30 0-54 24-54 54 0 17 7 31 15 40 5 6 8 12 8 19 0 4 3 7 7 7h48c4 0 7-3 7-7 0-7 3-13 8-19 8-9 15-23 15-40 0-30-24-54-54-54z"
        fill="#F5E04D"
        stroke="#17102E"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M85 40c-20 0-36 14-36 34 0 13 6 22 12 29" stroke="#FBF0A0" strokeWidth="7" strokeLinecap="round" fill="none" />
      <circle cx="68" cy="76" r="11" fill="#fff" stroke="#17102E" strokeWidth="3.5" />
      <circle cx="70" cy="78" r="4.8" fill="#17102E" />
      <circle cx="71.6" cy="76.4" r="1.5" fill="#fff" />
      <circle cx="102" cy="76" r="11" fill="#fff" stroke="#17102E" strokeWidth="3.5" />
      <circle cx="104" cy="78" r="4.8" fill="#17102E" />
      <circle cx="105.6" cy="76.4" r="1.5" fill="#fff" />
      <path d="M76 98c3 5 6 7 9 7s6-2 9-7" stroke="#17102E" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <circle cx="56" cy="94" r="4.5" fill="#FF8FCB" opacity="0.55" />
      <circle cx="114" cy="94" r="4.5" fill="#FF8FCB" opacity="0.55" />
      <ellipse cx="70" cy="132" rx="12" ry="5.5" fill="#F5E04D" stroke="#17102E" strokeWidth="3.5" />
      <ellipse cx="100" cy="132" rx="12" ry="5.5" fill="#F5E04D" stroke="#17102E" strokeWidth="3.5" />
      <path d="M22 40l3-7 3 7-7 3 7 3-3 7-3-7-7-3z" fill="#D4F55C" />
      <path d="M148 46l2.5-6 2.5 6-6 2.5 6 2.5-2.5 6-2.5-6-6-2.5z" fill="#FF8FCB" />
    </svg>
  );
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

  const [weekIndex, setWeekIndex] = useState(1);
  const [activeDay, setActiveDay] = useState(26);

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
    if (!el) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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

  return (
    <div className="ec-overview">
      {/* ---------- Greeting ---------- */}
      <div className="ec-overview-head ec-anim-in">
        <div className="ec-overview-head-text">
          <p className="ec-overview-eyebrow">{greeting}</p>
          <h1 className="ec-page-title">Welcome back, {firstName}</h1>
        </div>
      </div>

      <div className="ec-grid">
        <section className="ec-col-main">
          {/* ---------- HERO ---------- */}
          <div className="ec-hero ec-anim-in" style ={{ animationDelay: '0.05s' }} ref={heroRef}>
            <div className="ec-hero-orb" aria-hidden="true" />
            <div className="ec-hero-copy">
              <span className="ec-hero-badge">Today’s focus</span>
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
                <Link to="/vocabulary" className="ec-btn-primary">
                  Start learning
                  <span className="ec-btn-arrow" aria-hidden="true">→</span>
                </Link>
                <Link to="/progress" className="ec-hero-link">View progress</Link>
              </div>
            </div>
            <div className="ec-hero-art">
              <LangutMascot size={200} />
            </div>
          </div>

          {/* ---------- CATEGORIES ---------- */}
          <div className="ec-section-head ec-section-head--tight">
            <h2 className="ec-section-title">Choose what to learn</h2>
          </div>

          <div className="ec-categories ec-anim-in" style={{ animationDelay: '0.08s' }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`ec-category ec-category--${cat.color}`}
                onClick={() => navigate(`/${cat.id === 'c4' ? 'exams' : cat.id === 'c3' ? 'speaking' : cat.id === 'c2' ? 'grammar' : 'vocabulary'}`)}
              >
                <span className="ec-category-icon" aria-hidden="true">
                  <Icon name={cat.icon} />
                </span>
                <span className="ec-category-label">{cat.label}</span>
              </button>
            ))}
          </div>

          {/* ---------- XP row ---------- */}
          <div className="ec-section-head ec-section-head--tight">
            <h2 className="ec-section-title">Your activity</h2>
          </div>

          <div className="ec-xp-row ec-anim-in" style={{ animationDelay: '0.1s' }}>
            {xpLoading ? (
              [0, 1, 2].map((i) => (
                <div className="ec-xp-card" key={i}>
                  <Skeleton w={44} h={44} radius={22} />
                  <Skeleton w="60%" h={22} style={{ marginTop: 14 }} />
                  <Skeleton w="80%" h={12} style={{ marginTop: 6 }} />
                </div>
              ))
            ) : xpError ? (
              <div className="ec-xp-card ec-xp-card--error">
                <span className="ec-xp-label">Couldn’t load your stats.</span>
                <button className="ec-btn-primary ec-btn-primary--sm" onClick={loadXp}>Retry</button>
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
                </div>
                <div className="ec-xp-card ec-xp-card--rank">
                  <XpIcon name="trophy" accent="pink" />
                  <span className="ec-xp-value">
                    #<Counter value={xp.rank} />
                  </span>
                  <span className="ec-xp-label">{xp.rankName}</span>
                </div>
              </>
            ) : null}
          </div>

          {/* ---------- Progress ---------- */}
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
              >
                <span className="ec-progress-icon" aria-hidden="true">
                  <Icon name={c.icon} />
                </span>
                <p className="ec-progress-label">{c.label}</p>
                <div className="ec-progress-bar-row">
                  <div className="ec-progress-bar">
                    <div
                      className="ec-progress-bar-fill"
                      style={{ width: animateBars ? `${c.percent}%` : '0%' }}
                    />
                  </div>
                  <span className="ec-progress-pct">
                    <Counter value={c.percent} suffix="%" />
                  </span>
                </div>
                <span className="ec-progress-caption">Progress</span>
              </div>
            ))}
          </div>

          {/* ---------- Articles ---------- */}
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
                  <span className="ec-article-tag">{a.tag}</span>
                </div>
                <div className="ec-article-body">
                  <h3>{a.title}</h3>
                  <p className="ec-article-meta">{a.meta}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ---------- Sidebar ---------- */}
        <aside className="ec-col-side">
          <div className="ec-calendar-card ec-anim-in" style={{ animationDelay: '0.1s' }}>
            <div className="ec-calendar-head">
              <button aria-label="Previous month" onClick={goPrevWeek} disabled={weekIndex === 0}>‹</button>
              <h3>{week.label}</h3>
              <button aria-label="Next month" onClick={goNextWeek} disabled={weekIndex === CALENDAR_WEEKS.length - 1}>›</button>
            </div>
            <div className="ec-calendar-days">
              {week.days.map((w) => (
                <button
                  key={w.n}
                  className={`ec-calendar-day${activeDay === w.n ? ' ec-calendar-day--active' : ''}`}
                  onClick={() => setActiveDay(w.n)}
                >
                  <span>{w.d}</span>
                  <strong>{w.n}</strong>
                  <span className={`ec-calendar-dot${w.has ? ' ec-calendar-dot--on' : ''}`} />
                </button>
              ))}
            </div>
            <div className="ec-calendar-legend">
              <span className="ec-calendar-legend-item"><i className="ec-calendar-dot ec-calendar-dot--on" /> Practice day</span>
              <span className="ec-calendar-legend-item"><i className="ec-calendar-dot" /> No activity</span>
            </div>
          </div>

          <div className="ec-section-head ec-section-head--aside">
            <h2 className="ec-section-title">Courses</h2>
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
                  <div className="ec-course-badge" aria-hidden="true">
                    <Icon name={c.icon} />
                  </div>

                  <div className="ec-course-body">
                    <div className="ec-course-tags">
                      {c.tags.map((t) => (
                        <span className={`ec-tag ec-tag--${t.toLowerCase()}`} key={t}>{t}</span>
                      ))}
                    </div>
                    <h3>{c.title}</h3>
                    <p className="ec-course-blurb">{c.blurb}</p>
                    <div className="ec-course-foot">
                      <span><Icon name="calendar" /> {c.duration}</span>
                      <span><Icon name="book" /> {c.lessons}</span>
                    </div>
                  </div>

                  <div className="ec-course-cta">
                    <span className="ec-course-price">{c.price}</span>
                    <button
                      className={`ec-btn-pill${isBought ? ' ec-btn-pill--bought' : ''}`}
                      onClick={() => buyCourse(c)}
                      disabled={isBuying || isBought}
                    >
                      {isBought ? 'Owned ✓' : isBuying ? '…' : failed ? 'Retry' : 'Choose'}
                    </button>
                  </div>
                  {failed && <span className="ec-buy-error">Payment failed</span>}
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