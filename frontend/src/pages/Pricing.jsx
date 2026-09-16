import { useEffect, useMemo, useState } from 'react';
import { paymentsApi } from '../api/payments';
import { Icon } from '../components/Icon';

const PRICING_CSS = `
/* ============================================================
   PRICING — Langut-inspired
   Deep purple + lime-yellow + chunky black outlines.
   ============================================================ */

.ec-price{
  --lang-bg:        #1E1252;
  --lang-bg-2:      #2A1A6E;
  --lang-bg-3:      #3B2596;
  --lang-lime:      #D4F55C;
  --lang-lime-2:    #E4FF5C;
  --lang-lime-soft: #EDFFB0;
  --lang-lime-deep: #B8E62E;
  --lang-yellow:    #F5E04D;
  --lang-purple:    #7B5CF0;
  --lang-purple-2:  #9B7BFF;
  --lang-pink:      #FFB3D1;
  --lang-pink-2:    #FF8FCB;
  --lang-mint:      #B8F2D8;
  --lang-mint-2:    #7FD9A9;
  --lang-ink:       #17102E;
  --lang-ink-soft:  #6B6488;
  --lang-line:      #17102E;
}

.ec-price,
.ec-price *{box-sizing:border-box}

/* ============================================================
   HEAD
   ============================================================ */
.ec-price-head{text-align:center;max-width:660px;margin:0 auto 26px}
.ec-price-eyebrow{
  margin:0 0 8px;font-size:11.5px;font-weight:900;
  letter-spacing:.16em;text-transform:uppercase;
  color:var(--lang-purple);opacity:.95;
}
.ec-price-title{
  margin:0 0 10px;
  font-size:clamp(26px,3vw + 14px,38px);
  font-weight:900;letter-spacing:-.035em;
  line-height:1.1;
  color:var(--lang-ink);
}
.ec-price-title em{font-style:normal;color:var(--lang-purple)}
.ec-price-sub{
  margin:0 auto;font-size:14px;line-height:1.6;
  color:var(--lang-ink-soft);
  max-width:540px;font-weight:600;
}

/* ============================================================
   CYCLE TOGGLE — chunky
   ============================================================ */
.ec-price-toggle{display:flex;justify-content:center;margin:0 auto 22px}
.ec-price-toggle-inner{
  display:inline-flex;
  background:#fff;
  border:2px solid var(--lang-line);
  border-radius:999px;
  padding:5px;gap:4px;
  box-shadow:0 4px 0 var(--lang-line);
}
.ec-price-toggle-btn{
  border:2px solid transparent;
  background:transparent;
  color:var(--lang-ink-soft);
  font-size:12.5px;font-weight:900;
  padding:9px 20px;border-radius:999px;
  cursor:pointer;font-family:inherit;
  transition:all .18s ease;
  white-space:nowrap;
  letter-spacing:.02em;
  display:inline-flex;align-items:center;gap:6px;
}
.ec-price-toggle-btn:hover:not(.ec-price-toggle-btn--active){
  color:var(--lang-ink);
  background:var(--lang-lime-soft);
}
.ec-price-toggle-btn--active{
  background:var(--lang-ink);
  color:var(--lang-lime);
  border-color:var(--lang-line);
  box-shadow:0 2px 0 var(--lang-line);
}
.ec-price-toggle-save{
  font-size:9.5px;font-weight:900;
  background:var(--lang-lime);
  color:var(--lang-ink);
  border:2px solid var(--lang-line);
  border-radius:999px;
  padding:2px 8px;margin-left:4px;
  text-transform:uppercase;letter-spacing:.06em;
}
.ec-price-toggle-btn--active .ec-price-toggle-save{
  background:var(--lang-lime);
  color:var(--lang-ink);
}

/* ============================================================
   PAYMENT METHODS — chunky pills
   ============================================================ */
.ec-price-methods{
  display:flex;justify-content:center;
  gap:10px;flex-wrap:wrap;margin:0 auto 30px;
}
.ec-price-method{
  display:inline-flex;align-items:center;gap:8px;
  border:2px solid var(--lang-line);
  background:#fff;
  color:var(--lang-ink);
  font-size:12.5px;font-weight:900;
  padding:10px 18px;border-radius:999px;
  cursor:pointer;font-family:inherit;
  transition:transform .16s ease,box-shadow .16s ease,background .16s ease;
  white-space:nowrap;
  box-shadow:0 3px 0 var(--lang-line);
  letter-spacing:.02em;
}
.ec-price-method:hover{
  background:var(--lang-lime-soft);
  transform:translateY(-2px);
  box-shadow:0 5px 0 var(--lang-line);
}
.ec-price-method:active{
  transform:translateY(1px);
  box-shadow:0 1px 0 var(--lang-line);
}
.ec-price-method--active{
  background:var(--lang-ink);
  color:var(--lang-lime);
  box-shadow:0 3px 0 var(--lang-ink);
}
.ec-price-method-dot{
  width:8px;height:8px;border-radius:50%;
  background:currentColor;opacity:.65;
}
.ec-price-method--active .ec-price-method-dot{
  background:var(--lang-lime);opacity:1;
}

/* ============================================================
   GRID
   ============================================================ */
.ec-price-grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
  gap:22px;align-items:stretch;margin-bottom:36px;
}

/* ============================================================
   PRICE CARDS — chunky
   ============================================================ */
.ec-price-card{
  position:relative;
  display:flex;flex-direction:column;
  background:#fff;
  border:3px solid var(--lang-line);
  border-radius:28px;
  padding:26px;
  box-shadow:0 10px 0 var(--lang-line);
  transition:transform .22s ease,box-shadow .22s ease;
  overflow:hidden;
  background-image:radial-gradient(circle at 100% 0%,rgba(212,245,92,.12),transparent 55%);
}
.ec-price-card:hover{
  transform:translateY(-4px);
  box-shadow:0 14px 0 var(--lang-line);
}

.ec-price-card--featured{
  background:linear-gradient(155deg,#7B5CF0 0%,#5A3FD9 60%,#3B2596 100%);
  color:#fff;
  background-image:radial-gradient(circle at 100% 0%,rgba(212,245,92,.22),transparent 55%),
                   linear-gradient(155deg,#7B5CF0 0%,#5A3FD9 60%,#3B2596 100%);
}
.ec-price-card--featured:hover{
  box-shadow:0 14px 0 var(--lang-line);
}

/* Chunky corner badge (replaces rotated ribbon) */
.ec-price-badge{
  position:absolute;
  top:16px;right:16px;
  background:var(--lang-lime);
  color:var(--lang-ink);
  font-size:10px;font-weight:900;
  letter-spacing:.1em;text-transform:uppercase;
  padding:6px 14px;
  border-radius:999px;
  border:2px solid var(--lang-line);
  box-shadow:0 3px 0 var(--lang-line);
  z-index:2;
}

.ec-price-card-name{
  position:relative;z-index:1;
  margin:0 0 8px;font-size:16px;font-weight:900;
  letter-spacing:-.015em;
  color:var(--lang-ink);
}
.ec-price-card--featured .ec-price-card-name{color:#fff}

.ec-price-card-tagline{
  position:relative;z-index:1;
  margin:0 0 20px;font-size:12.5px;
  line-height:1.55;
  color:var(--lang-ink-soft);
  min-height:34px;font-weight:600;
}
.ec-price-card--featured .ec-price-card-tagline{color:rgba(255,255,255,.85)}

.ec-price-card-price{
  position:relative;z-index:1;
  display:flex;align-items:baseline;
  gap:8px;margin-bottom:22px;
  flex-wrap:wrap;
}
.ec-price-card-amount{
  font-size:clamp(28px,2.6vw + 14px,40px);
  font-weight:900;letter-spacing:-.04em;
  line-height:1;color:var(--lang-ink);
}
.ec-price-card--featured .ec-price-card-amount{color:var(--lang-lime)}
.ec-price-card-period{
  font-size:12.5px;font-weight:900;
  color:var(--lang-ink-soft);
  letter-spacing:.02em;
}
.ec-price-card--featured .ec-price-card-period{color:rgba(255,255,255,.75)}
.ec-price-card-strike{
  font-size:13px;font-weight:900;
  color:var(--lang-ink-soft);
  text-decoration:line-through;
  opacity:.65;margin-left:4px;
}
.ec-price-card--featured .ec-price-card-strike{color:rgba(255,255,255,.7)}

.ec-price-features{
  position:relative;z-index:1;
  list-style:none;padding:0;margin:0 0 24px;
  display:flex;flex-direction:column;gap:12px;flex:1;
}
.ec-price-feature{
  display:flex;gap:10px;align-items:flex-start;
  font-size:13px;line-height:1.5;
  color:var(--lang-ink);font-weight:700;
}
.ec-price-card--featured .ec-price-feature{color:rgba(255,255,255,.95)}
.ec-price-feature-icon{
  width:22px;height:22px;border-radius:50%;
  background:var(--lang-lime);
  color:var(--lang-ink);
  display:flex;align-items:center;justify-content:center;
  flex-shrink:0;margin-top:1px;
  font-size:11px;font-weight:900;
  border:2px solid var(--lang-line);
  box-shadow:0 2px 0 var(--lang-line);
}
.ec-price-card--featured .ec-price-feature-icon{
  background:var(--lang-lime);
  color:var(--lang-ink);
  box-shadow:0 2px 0 rgba(0,0,0,.4);
}
.ec-price-feature strong{font-weight:900}

.ec-price-card-cta{
  position:relative;z-index:1;
  width:100%;
  border:2px solid var(--lang-line);
  background:var(--lang-ink);
  color:var(--lang-lime);
  padding:14px 24px;border-radius:999px;
  font-size:14px;font-weight:900;
  cursor:pointer;font-family:inherit;
  transition:transform .16s ease,box-shadow .16s ease;
  display:inline-flex;align-items:center;justify-content:center;gap:8px;
  box-shadow:0 4px 0 var(--lang-line);
  letter-spacing:.03em;
}
.ec-price-card-cta:hover:not(:disabled){
  transform:translateY(-2px);
  box-shadow:0 6px 0 var(--lang-line);
}
.ec-price-card-cta:active:not(:disabled){
  transform:translateY(2px);
  box-shadow:0 1px 0 var(--lang-line);
}
.ec-price-card-cta:disabled{
  opacity:.6;cursor:not-allowed;transform:none;box-shadow:0 4px 0 var(--lang-line);
}
.ec-price-card--featured .ec-price-card-cta{
  background:var(--lang-lime);
  color:var(--lang-ink);
  box-shadow:0 4px 0 rgba(0,0,0,.5);
}
.ec-price-card--featured .ec-price-card-cta:hover:not(:disabled){
  box-shadow:0 6px 0 rgba(0,0,0,.5);
}
.ec-price-card--featured .ec-price-card-cta:active:not(:disabled){
  box-shadow:0 1px 0 rgba(0,0,0,.5);
}

.ec-price-note{
  position:relative;z-index:1;
  margin:14px 0 0;font-size:11px;
  text-align:center;
  color:var(--lang-ink-soft);
  font-weight:800;letter-spacing:.02em;
}
.ec-price-card--featured .ec-price-note{color:rgba(255,255,255,.7)}

/* ============================================================
   TRUST STRIP
   ============================================================ */
.ec-price-trust{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(200px,1fr));
  gap:16px;margin:36px 0;
}
.ec-price-trust-item{
  display:flex;align-items:center;gap:14px;
  padding:18px;
  border-radius:20px;
  background:#fff;
  border:2px solid var(--lang-line);
  box-shadow:0 5px 0 var(--lang-line);
  transition:transform .18s ease,box-shadow .18s ease;
}
.ec-price-trust-item:hover{
  transform:translateY(-3px);
  box-shadow:0 8px 0 var(--lang-line);
}
.ec-price-trust-icon{
  width:44px;height:44px;border-radius:14px;
  background:var(--lang-lime);
  color:var(--lang-ink);
  display:flex;align-items:center;justify-content:center;
  flex-shrink:0;
  border:2px solid var(--lang-line);
  box-shadow:0 2px 0 var(--lang-line);
}
.ec-price-trust-icon svg{width:22px;height:22px}
.ec-price-trust-body p{
  margin:0 0 3px;font-size:13.5px;font-weight:900;
  color:var(--lang-ink);
  letter-spacing:-.01em;
}
.ec-price-trust-body span{
  font-size:11.5px;color:var(--lang-ink-soft);
  line-height:1.45;display:block;
  font-weight:700;
}

/* ============================================================
   FAQ
   ============================================================ */
.ec-price-faq{margin-top:44px}
.ec-price-faq h2{
  margin:0 0 20px;font-size:22px;font-weight:900;
  letter-spacing:-.025em;color:var(--lang-ink);
}
.ec-price-faq-item{
  background:#fff;
  border:2px solid var(--lang-line);
  border-radius:20px;
  margin-bottom:12px;
  overflow:hidden;
  box-shadow:0 5px 0 var(--lang-line);
  transition:transform .18s ease,box-shadow .18s ease;
}
.ec-price-faq-item:hover{
  transform:translateY(-2px);
  box-shadow:0 7px 0 var(--lang-line);
}
.ec-price-faq-item--open{
  background-image:radial-gradient(circle at 100% 0%,rgba(212,245,92,.10),transparent 55%);
}
.ec-price-faq-q{
  display:flex;justify-content:space-between;align-items:center;
  gap:14px;width:100%;
  padding:18px 22px;
  border:none;background:transparent;
  text-align:left;
  font-size:14px;font-weight:900;
  color:var(--lang-ink);
  cursor:pointer;font-family:inherit;
  letter-spacing:-.01em;
}
.ec-price-faq-q-icon{
  width:30px;height:30px;border-radius:50%;
  background:var(--lang-lime);
  color:var(--lang-ink);
  display:flex;align-items:center;justify-content:center;
  flex-shrink:0;
  transition:transform .25s ease,background .2s ease,color .2s ease;
  font-size:16px;font-weight:900;
  border:2px solid var(--lang-line);
  box-shadow:0 2px 0 var(--lang-line);
}
.ec-price-faq-item--open .ec-price-faq-q-icon{
  transform:rotate(45deg);
  background:var(--lang-ink);
  color:var(--lang-lime);
}
.ec-price-faq-a{
  padding:0 22px 20px;
  font-size:13px;line-height:1.65;
  color:var(--lang-ink-soft);
  font-weight:600;
  animation:ec-price-fade .3s ease;
}
@keyframes ec-price-fade{
  from{opacity:0;transform:translateY(-4px)}
  to{opacity:1;transform:translateY(0)}
}

/* ============================================================
   FINAL CTA — deep purple
   ============================================================ */
.ec-price-final{
  position:relative;overflow:hidden;
  border-radius:28px;
  padding:32px 28px;
  color:#fff;
  text-align:center;
  background:linear-gradient(140deg,#2A1A6E 0%,#1E1252 55%,#3B2596 100%);
  border:2px solid var(--lang-line);
  box-shadow:0 16px 0 var(--lang-line),0 20px 52px rgba(30,18,82,.28);
  margin-top:44px;
}
.ec-price-final::before{
  content:'';position:absolute;inset:0;
  background-image:radial-gradient(rgba(255,255,255,.10) 1.4px,transparent 1.4px);
  background-size:20px 20px;
  mask-image:radial-gradient(circle at 20% 30%,#000,transparent 70%);
  -webkit-mask-image:radial-gradient(circle at 20% 30%,#000,transparent 70%);
  pointer-events:none;
}
.ec-price-final-orb{
  position:absolute;top:-80px;right:-80px;
  width:280px;height:280px;border-radius:50%;
  background:radial-gradient(circle,rgba(212,245,92,.25),transparent 68%);
  animation:ec-price-drift 12s ease-in-out infinite;
}
@keyframes ec-price-drift{
  0%,100%{transform:translate(0,0) scale(1)}
  50%{transform:translate(-16px,14px) scale(1.08)}
}
.ec-price-final h3{
  margin:0 0 10px;
  font-size:clamp(20px,1.6vw + 12px,26px);
  font-weight:900;letter-spacing:-.025em;
  position:relative;z-index:1;color:#fff;
}
.ec-price-final h3 em{font-style:normal;color:var(--lang-lime)}
.ec-price-final p{
  margin:0 auto 22px;
  font-size:14px;line-height:1.6;
  opacity:.92;max-width:520px;
  position:relative;z-index:1;font-weight:500;
}
.ec-price-final-actions{
  display:flex;justify-content:center;
  gap:14px;flex-wrap:wrap;position:relative;z-index:1;
}
.ec-price-final-btn{
  border:2px solid var(--lang-line);
  background:var(--lang-lime);
  color:var(--lang-ink);
  padding:14px 26px;border-radius:999px;
  font-size:14px;font-weight:900;
  cursor:pointer;font-family:inherit;
  transition:transform .16s ease,box-shadow .16s ease;
  box-shadow:0 4px 0 var(--lang-line);
  letter-spacing:.03em;
}
.ec-price-final-btn:hover{
  transform:translateY(-2px);
  box-shadow:0 6px 0 var(--lang-line);
}
.ec-price-final-btn:active{
  transform:translateY(2px);
  box-shadow:0 1px 0 var(--lang-line);
}
.ec-price-final-link{
  color:#fff;
  font-size:13.5px;font-weight:900;
  text-decoration:none;
  padding:12px 20px;
  border-radius:999px;
  border:2px solid rgba(255,255,255,.35);
  background:rgba(255,255,255,.10);
  align-self:center;
  transition:background .18s ease,border-color .18s ease;
  letter-spacing:.02em;
}
.ec-price-final-link:hover{
  background:rgba(255,255,255,.20);
  border-color:rgba(255,255,255,.6);
}

/* ============================================================
   ANIMATIONS
   ============================================================ */
@keyframes ec-price-fade-in{
  from{opacity:0;transform:translateY(14px)}
  to{opacity:1;transform:translateY(0)}
}
.ec-price-anim{animation:ec-price-fade-in .5s ease both}

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media(max-width:900px){
  .ec-price-grid{grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px}
}
@media(max-width:720px){
  .ec-price-head{margin-bottom:22px}
  .ec-price-title{font-size:25px}
  .ec-price-sub{font-size:13px}
  .ec-price-toggle-inner{padding:4px}
  .ec-price-toggle-btn{padding:8px 14px;font-size:12px}
  .ec-price-toggle-save{padding:2px 6px;font-size:9px}
  .ec-price-methods{gap:8px;margin-bottom:22px}
  .ec-price-method{padding:9px 14px;font-size:12px}
  .ec-price-grid{grid-template-columns:1fr;gap:20px}
  .ec-price-card{padding:22px;border-radius:24px;box-shadow:0 8px 0 var(--lang-line)}
  .ec-price-card:hover{transform:none;box-shadow:0 8px 0 var(--lang-line)}
  .ec-price-card--featured:hover{box-shadow:0 8px 0 var(--lang-line)}
  .ec-price-card-amount{font-size:30px}
  .ec-price-trust{grid-template-columns:1fr 1fr;gap:12px;margin:28px 0}
  .ec-price-trust-item{padding:14px;gap:12px;border-radius:16px}
  .ec-price-trust-icon{width:38px;height:38px;border-radius:12px}
  .ec-price-trust-icon svg{width:18px;height:18px}
  .ec-price-trust-body p{font-size:12.5px}
  .ec-price-trust-body span{font-size:11px}
  .ec-price-faq h2{font-size:19px}
  .ec-price-faq-q{padding:16px 18px;font-size:13.5px}
  .ec-price-faq-a{padding:0 18px 18px;font-size:12.5px}
  .ec-price-final{padding:26px 22px;border-radius:24px;box-shadow:0 10px 0 var(--lang-line),0 16px 40px rgba(30,18,82,.28)}
  .ec-price-final-actions{flex-direction:column;align-items:stretch}
  .ec-price-final-btn{width:100%}
  .ec-price-final-link{align-self:center;margin-top:6px}
}
@media(max-width:380px){
  .ec-price-trust{grid-template-columns:1fr}
  .ec-price-method{padding:8px 12px;font-size:11.5px}
  .ec-price-toggle-btn{padding:7px 12px;font-size:11.5px}
}
@media(prefers-reduced-motion:reduce){
  .ec-price-anim{animation:none}
  .ec-price-final-orb{animation:none}
  .ec-price-card:hover,.ec-price-trust-item:hover,
  .ec-price-faq-item:hover,.ec-price-method:hover,
  .ec-price-method:active,.ec-price-toggle-btn{transition:none}
  .ec-price-card:hover,.ec-price-trust-item:hover,
  .ec-price-faq-item:hover,.ec-price-method:hover{transform:none}
  .ec-price-faq-a{animation:none}
}
`;

/* ---------- Data ---------- */
const PACKAGES = [
  {
    id: 'ielts',
    name: 'IELTS Full Prep',
    tagline: 'Everything you need for all four IELTS sections.',
    price: 1200,
    currency: '৳',
    period: 'one-time',
    strike: 1600,
    features: [
      'Listening, Reading, Writing, Speaking mocks',
      'AI speaking scoring',
      'Personalized study plan',
      'Lifetime access to updates',
    ],
    icon: 'flag',
  },
  {
    id: 'sat',
    name: 'SAT Full Prep',
    tagline: 'Reading, Writing and Math on one shared engine.',
    price: 1500,
    currency: '৳',
    period: 'one-time',
    strike: 2000,
    features: [
      'Reading, Writing, Math mocks',
      'Score analytics dashboard',
      'Weak-area drills',
      'Full-length practice exams',
    ],
    icon: 'target',
  },
  {
    id: 'pte',
    name: 'PTE Full Prep',
    tagline: 'All PTE sections with AI speaking feedback.',
    price: 1200,
    currency: '৳',
    period: 'one-time',
    strike: 1600,
    features: [
      'All sections, unlimited mocks',
      'AI speaking scoring',
      'Adaptive study plan',
      'Progress analytics',
    ],
    icon: 'zap',
  },
  {
    id: 'all-access',
    name: 'All-Access Premium',
    tagline: 'Every track, every feature, every month.',
    price: 350,
    currency: '৳',
    period: '/ month',
    strike: null,
    featured: true,
    features: [
      'IELTS, SAT and PTE — every track',
      'Unlimited full-length mocks',
      'AI speaking scoring',
      'Live exam rooms priority seating',
      'Cancel anytime',
    ],
    icon: 'trophy',
  },
];

const METHODS = [
  { id: 'bkash', label: 'bKash' },
  { id: 'nagad', label: 'Nagad' },
  { id: 'card',  label: 'Card' },
  { id: 'stripe', label: 'Stripe' },
];

const TRUST = [
  { id: 't1', icon: 'shield', title: 'Secure checkout', desc: 'Encrypted payment via bKash, Nagad & SSLCommerz.' },
  { id: 't2', icon: 'zap',    title: 'Instant activation', desc: 'Access your plan immediately after payment.' },
  { id: 't3', icon: 'trophy', title: 'Money-back promise', desc: 'Not satisfied? Request a refund within 7 days.' },
  { id: 't4', icon: 'users',  title: 'Trusted by learners', desc: 'Used by 10,000+ SSC, HSC, IELTS & SAT students.' },
];

const FAQ = [
  {
    q: 'How do I pay with bKash or Nagad?',
    a: 'Select your preferred method, tap Buy now, and you’ll receive a payment prompt. Complete the transaction in your bKash or Nagad app — access unlocks automatically once the payment is confirmed.',
  },
  {
    q: 'Can I switch from one-time to the monthly plan?',
    a: 'Yes. Your one-time purchases stay on your account forever. The monthly All-Access plan adds all tracks and premium features on top, and you can cancel any time from your profile.',
  },
  {
    q: 'Is the AI speaking score reliable?',
    a: 'Our AI speaking engine is trained on thousands of IELTS and PTE attempts and gives a band-style score across fluency, pronunciation, vocabulary and grammar. It’s a strong practice companion — not an official exam result.',
  },
  {
    q: 'Do you offer refunds?',
    a: 'Yes. If you’re not satisfied within 7 days of purchase, contact support and we’ll refund you in full — no questions asked.',
  },
  {
    q: 'Will my plan work on mobile?',
    a: 'Absolutely. Everything — mocks, AI scoring, live rooms — is designed mobile-first and works on any phone, tablet or desktop browser.',
  },
];

/* Fallback trust icon (Icon.jsx has no 'shield') */
function TrustIcon({ name }) {
  if (name === 'shield') {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3 4.5 6v6c0 4.5 3.2 8.4 7.5 9.5 4.3-1.1 7.5-5 7.5-9.5V6L12 3Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    );
  }
  return <Icon name={name} />;
}

/* ============================================================
   Mascot — Langut-style yellow blob
   ============================================================ */
function LangutMascot({ size = 120 }) {
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

/* ---------- Component ---------- */
export function Pricing() {
  const [packages, setPackages] = useState([]);
  const [method, setMethod] = useState('bkash');
  const [cycle, setCycle] = useState('one-time');
  const [busyId, setBusyId] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    paymentsApi
      .packages()
      .then((p) => setPackages(p?.length ? p : PACKAGES))
      .catch(() => setPackages(PACKAGES));
  }, []);

  const list = packages.length ? packages : PACKAGES;

  const visible = useMemo(() => {
    if (cycle === 'one-time') return list.filter((p) => p.period === 'one-time' || !p.period || p.period !== '/ month');
    if (cycle === 'monthly') return list.filter((p) => p.period === '/ month' || p.period === 'monthly');
    return list;
  }, [list, cycle]);

  const checkout = (id) => {
    setBusyId(id);
    paymentsApi
      .checkout(id, method)
      .catch(() => {})
      .finally(() => setTimeout(() => setBusyId(null), 700));
  };

  return (
    <div className="ec-price">
      <style>{PRICING_CSS}</style>

      {/* Heading */}
      <div className="ec-price-head ec-price-anim">
        <p className="ec-price-eyebrow">Pricing</p>
        <h1 className="ec-price-title">Simple pricing, <em>real</em> results</h1>
        <p className="ec-price-sub">
          Pick a one-time track or unlock everything with All-Access. Pay with bKash, Nagad, card, or Stripe.
        </p>
      </div>

      {/* Cycle toggle */}
      <div className="ec-price-toggle ec-price-anim">
        <div className="ec-price-toggle-inner" role="tablist">
          {[
            { id: 'one-time', label: 'One-time tracks' },
            { id: 'monthly', label: 'Monthly', save: 'Save 60%' },
            { id: 'all', label: 'All plans' },
          ].map((c) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={cycle === c.id}
              className={`ec-price-toggle-btn${cycle === c.id ? ' ec-price-toggle-btn--active' : ''}`}
              onClick={() => setCycle(c.id)}
            >
              {c.label}
              {c.save && <span className="ec-price-toggle-save">{c.save}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Payment methods */}
      <div className="ec-price-methods ec-price-anim">
        {METHODS.map((m) => (
          <button
            key={m.id}
            className={`ec-price-method${method === m.id ? ' ec-price-method--active' : ''}`}
            onClick={() => setMethod(m.id)}
          >
            <span className="ec-price-method-dot" />
            {m.label}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="ec-price-grid">
        {visible.map((p, i) => {
          const isFeatured = !!p.featured;
          const strike = p.strike ? `${p.currency || '৳'} ${p.strike.toLocaleString()}` : null;
          const amount = typeof p.price === 'number'
            ? `${p.currency || '৳'} ${p.price.toLocaleString()}`
            : p.price;
          const period = p.period || 'one-time';
          const busy = busyId === p.id;

          return (
            <div
              key={p.id}
              className={`ec-price-card${isFeatured ? ' ec-price-card--featured' : ''} ec-price-anim`}
              style={{ animationDelay: `${0.05 + i * 0.06}s` }}
            >
              {isFeatured && <span className="ec-price-badge">Popular</span>}

              <p className="ec-price-card-name">{p.name}</p>
              <p className="ec-price-card-tagline">{p.tagline || 'All the essentials to get you ready.'}</p>

              <div className="ec-price-card-price">
                <span className="ec-price-card-amount">{amount}</span>
                <span className="ec-price-card-period">{period}</span>
                {strike && <span className="ec-price-card-strike">{strike}</span>}
              </div>

              <ul className="ec-price-features">
                {p.features.map((f) => (
                  <li className="ec-price-feature" key={f}>
                    <span className="ec-price-feature-icon">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                className="ec-price-card-cta"
                onClick={() => checkout(p.id)}
                disabled={busy}
              >
                {busy ? 'Processing…' : isFeatured ? 'Start Premium' : 'Buy now'}
                {!busy && <span aria-hidden="true">→</span>}
              </button>

              <p className="ec-price-note">
                {isFeatured
                  ? 'Cancel anytime · No hidden fees'
                  : 'One-time payment · Lifetime access'}
              </p>
            </div>
          );
        })}
      </div>

      {/* Trust strip */}
      <div className="ec-price-trust">
        {TRUST.map((t, i) => (
          <div
            key={t.id}
            className="ec-price-trust-item ec-price-anim"
            style={{ animationDelay: `${0.15 + i * 0.04}s` }}
          >
            <span className="ec-price-trust-icon"><TrustIcon name={t.icon} /></span>
            <div className="ec-price-trust-body">
              <p>{t.title}</p>
              <span>{t.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="ec-price-faq">
        <h2>Frequently asked questions</h2>
        {FAQ.map((item, i) => {
          const open = openFaq === i;
          return (
            <div
              key={item.q}
              className={`ec-price-faq-item${open ? ' ec-price-faq-item--open' : ''}`}
            >
              <button
                className="ec-price-faq-q"
                aria-expanded={open}
                onClick={() => setOpenFaq(open ? -1 : i)}
              >
                <span>{item.q}</span>
                <span className="ec-price-faq-q-icon" aria-hidden="true">+</span>
              </button>
              {open && <div className="ec-price-faq-a">{item.a}</div>}
            </div>
          );
        })}
      </div>

      {/* Final CTA */}
      <div className="ec-price-final ec-price-anim">
        <div className="ec-price-final-orb" aria-hidden="true" />
        <h3>Not sure which plan <em>fits</em> you?</h3>
        <p>Start with a single track, or go All-Access and try everything for 30 days. Cancel anytime, no questions asked.</p>
        <div className="ec-price-final-actions">
          <button className="ec-price-final-btn" onClick={() => checkout('all-access')}>
            Start All-Access
          </button>
          <a href="#/exams" className="ec-price-final-link">Compare tracks →</a>
        </div>
      </div>
    </div>
  );
}

export default Pricing;