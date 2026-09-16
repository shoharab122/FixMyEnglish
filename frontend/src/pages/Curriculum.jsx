import { useEffect, useMemo, useState } from 'react';
import { curriculumApi } from '../api/curriculum';
import { Icon } from '../components/Icon';

const CURRICULUM_CSS = `
/* ============================================================
   CURRICULUM — Langut-inspired
   Deep purple + lime-yellow + chunky black outlines.
   ============================================================ */

.ec-cur{
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

.ec-cur,
.ec-cur *{box-sizing:border-box}

.ec-cur-head{
  display:flex;align-items:flex-end;justify-content:space-between;
  gap:16px;flex-wrap:wrap;margin-bottom:18px;
}
.ec-cur-eyebrow{
  margin:0 0 6px;font-size:11.5px;font-weight:900;
  letter-spacing:.16em;text-transform:uppercase;
  color:var(--lang-purple);opacity:.95;
}

/* ============================================================
   HERO — deep purple, chunky stat chips, mascot
   ============================================================ */
.ec-cur-hero{
  position:relative;overflow:hidden;
  border-radius:32px;
  padding:clamp(26px,4vw,38px) clamp(24px,4vw,40px);
  color:#fff;
  background:linear-gradient(140deg,#2A1A6E 0%,#1E1252 55%,#3B2596 100%);
  box-shadow:0 20px 52px rgba(30,18,82,.34);
  border:2px solid var(--lang-line);
  margin-bottom:22px;
  min-height:220px;
  display:flex;align-items:center;justify-content:space-between;gap:20px;
}
.ec-cur-hero::before{
  content:'';position:absolute;inset:0;
  background-image:radial-gradient(rgba(255,255,255,.10) 1.4px,transparent 1.4px);
  background-size:20px 20px;
  mask-image:radial-gradient(circle at 15% 20%,#000,transparent 65%);
  -webkit-mask-image:radial-gradient(circle at 15% 20%,#000,transparent 65%);
  pointer-events:none;
}
.ec-cur-hero-orb{
  position:absolute;top:-90px;right:180px;
  width:240px;height:240px;border-radius:50%;
  background:radial-gradient(circle,rgba(212,245,92,.22),transparent 68%);
  animation:ec-cur-drift 14s ease-in-out infinite;
}
@keyframes ec-cur-drift{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-18px,16px) scale(1.08)}}
.ec-cur-hero-copy{position:relative;z-index:1;max-width:580px}
.ec-cur-hero-badge{
  display:inline-flex;align-items:center;
  font-size:10.5px;font-weight:900;
  letter-spacing:.16em;text-transform:uppercase;
  padding:7px 14px;border-radius:999px;
  background:var(--lang-lime);color:var(--lang-ink);
  border:2px solid var(--lang-line);
  box-shadow:0 3px 0 rgba(0,0,0,.4);
  margin-bottom:16px;
}
.ec-cur-hero h1{
  margin:0 0 10px;
  font-size:clamp(26px,2.4vw + 16px,38px);
  font-weight:900;
  letter-spacing:-.035em;
  line-height:1.1;
  color:#fff;
}
.ec-cur-hero h1 em{font-style:normal;color:var(--lang-lime)}
.ec-cur-hero p{
  margin:0 0 22px;
  font-size:14px;line-height:1.6;
  opacity:.92;font-weight:500;max-width:52ch;
}

/* Price-tag style stat chips */
.ec-cur-hero-stats{display:flex;gap:10px;flex-wrap:wrap;position:relative;z-index:1}
.ec-cur-hero-stat{
  display:flex;flex-direction:column;gap:2px;
  padding:9px 14px;
  border-radius:14px;
  background:var(--lang-lime);
  border:2px solid var(--lang-line);
  box-shadow:0 3px 0 var(--lang-line);
  min-width:80px;
}
.ec-cur-hero-stat strong{
  font-size:20px;font-weight:900;line-height:1;
  letter-spacing:-.04em;
  color:var(--lang-ink);
}
.ec-cur-hero-stat span{
  font-size:9.5px;font-weight:900;letter-spacing:.1em;
  text-transform:uppercase;color:var(--lang-ink);opacity:.75;
}
.ec-cur-hero-stat:nth-child(2){background:var(--lang-pink)}
.ec-cur-hero-stat:nth-child(3){background:var(--lang-purple-2)}
.ec-cur-hero-stat:nth-child(3) strong,
.ec-cur-hero-stat:nth-child(3) span{color:#fff}

/* Mascot */
.ec-cur-hero-mascot{
  position:relative;z-index:1;
  flex-shrink:0;
  display:flex;align-items:center;justify-content:center;
  filter:drop-shadow(0 14px 28px rgba(0,0,0,.28));
  animation:ec-cur-bob 4s ease-in-out infinite;
}
@keyframes ec-cur-bob{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-10px) rotate(2deg)}}

/* ============================================================
   FILTERS BAR — chunky pills
   ============================================================ */
.ec-cur-filters{
  display:flex;gap:10px;flex-wrap:wrap;align-items:center;
  margin-bottom:18px;padding:16px 18px;
  background:#fff;
  border:2px solid var(--lang-line);
  border-radius:22px;
  box-shadow:0 6px 0 var(--lang-line);
}
.ec-cur-filter-group{display:flex;gap:6px;flex-wrap:wrap}
.ec-cur-pill{
  border:2px solid var(--lang-line);
  background:#fff;color:var(--lang-ink);
  padding:9px 16px;border-radius:999px;
  font-size:12.5px;font-weight:900;
  cursor:pointer;font-family:inherit;
  transition:all .16s ease;
  box-shadow:0 3px 0 var(--lang-line);
  letter-spacing:.02em;
}
.ec-cur-pill:hover{
  background:var(--lang-lime-soft);
  transform:translateY(-2px);
  box-shadow:0 5px 0 var(--lang-line);
}
.ec-cur-pill:active{
  transform:translateY(1px);
  box-shadow:0 1px 0 var(--lang-line);
}
.ec-cur-pill--active{
  background:var(--lang-ink);color:var(--lang-lime);
  box-shadow:0 3px 0 var(--lang-ink);
}
.ec-cur-select{
  border:2px solid var(--lang-line);
  background:#fff;color:var(--lang-ink);
  padding:9px 16px;border-radius:999px;
  font-size:12.5px;font-weight:900;
  font-family:inherit;cursor:pointer;outline:none;
  box-shadow:0 3px 0 var(--lang-line);
  transition:all .16s ease;
}
.ec-cur-select:hover{
  transform:translateY(-2px);
  box-shadow:0 5px 0 var(--lang-line);
}
.ec-cur-check{
  display:inline-flex;align-items:center;gap:8px;
  font-size:12.5px;font-weight:900;
  color:var(--lang-ink);cursor:pointer;
  user-select:none;
  padding:9px 14px;
  border:2px solid var(--lang-line);
  border-radius:999px;
  background:#fff;
  box-shadow:0 3px 0 var(--lang-line);
  transition:all .16s ease;
}
.ec-cur-check:hover{
  background:var(--lang-lime-soft);
  transform:translateY(-2px);
  box-shadow:0 5px 0 var(--lang-line);
}
.ec-cur-check input{
  accent-color:var(--lang-ink);
  width:16px;height:16px;
}

/* ============================================================
   CATEGORY TABS
   ============================================================ */
.ec-cur-cats{
  display:flex;gap:10px;overflow-x:auto;
  scrollbar-width:none;
  padding:4px 4px 16px;margin-bottom:8px;
}
.ec-cur-cats::-webkit-scrollbar{display:none}
.ec-cur-cat{
  flex:0 0 auto;
  display:inline-flex;align-items:center;gap:8px;
  padding:10px 16px;border-radius:999px;
  border:2px solid var(--lang-line);
  background:#fff;color:var(--lang-ink);
  font-size:12.5px;font-weight:900;
  cursor:pointer;white-space:nowrap;
  transition:all .16s ease;
  box-shadow:0 3px 0 var(--lang-line);
}
.ec-cur-cat:hover{
  background:var(--lang-lime-soft);
  transform:translateY(-2px);
  box-shadow:0 5px 0 var(--lang-line);
}
.ec-cur-cat:active{
  transform:translateY(1px);
  box-shadow:0 1px 0 var(--lang-line);
}
.ec-cur-cat--active{
  background:var(--lang-ink);color:var(--lang-lime);
  box-shadow:0 3px 0 var(--lang-ink);
}
.ec-cur-cat-count{
  font-size:10.5px;font-weight:900;
  padding:2px 8px;border-radius:999px;
  background:var(--lang-lime);color:var(--lang-ink);
  border:2px solid var(--lang-line);
}
.ec-cur-cat--active .ec-cur-cat-count{
  background:var(--lang-lime);color:var(--lang-ink);
}

/* ============================================================
   GRID
   ============================================================ */
.ec-cur-grid{
  display:grid;grid-template-columns:minmax(0,1fr) 320px;
  gap:22px;align-items:start;
}

/* ============================================================
   SECTION CARD — chunky
   ============================================================ */
.ec-cur-section{
  background:#fff;
  border:3px solid var(--lang-line);
  border-radius:28px;
  padding:24px;
  box-shadow:0 8px 0 var(--lang-line);
  margin-bottom:20px;
  background-image:radial-gradient(circle at 100% 0%,rgba(212,245,92,.10),transparent 55%);
}
.ec-cur-section-head{
  display:flex;align-items:center;justify-content:space-between;
  gap:10px;margin-bottom:16px;flex-wrap:wrap;
}
.ec-cur-section-title{
  margin:0;font-size:16px;font-weight:900;
  letter-spacing:-.01em;color:var(--lang-ink);
}
.ec-cur-chip{
  font-size:10.5px;font-weight:900;
  color:var(--lang-ink);
  background:var(--lang-lime);
  border:2px solid var(--lang-line);
  padding:4px 11px;border-radius:999px;
  letter-spacing:.06em;text-transform:uppercase;
  box-shadow:0 2px 0 var(--lang-line);
}

/* ============================================================
   QUIZ
   ============================================================ */
.ec-quiz-top{
  display:flex;align-items:center;justify-content:space-between;
  gap:12px;margin-bottom:12px;flex-wrap:wrap;
}
.ec-quiz-badge{
  display:inline-flex;align-items:center;
  font-size:11px;font-weight:900;letter-spacing:.08em;
  text-transform:uppercase;
  padding:6px 13px;border-radius:999px;
  background:var(--lang-lime);color:var(--lang-ink);
  border:2px solid var(--lang-line);
  box-shadow:0 3px 0 var(--lang-line);
}
.ec-quiz-counter{
  font-size:12px;font-weight:900;
  color:var(--lang-ink-soft);
  letter-spacing:.05em;text-transform:uppercase;
}
.ec-quiz-progress{
  height:12px;border-radius:999px;
  background:#E8E5F2;overflow:hidden;
  margin-bottom:20px;
  border:2px solid var(--lang-line);
}
.ec-quiz-progress-fill{
  height:100%;
  background:linear-gradient(90deg,#D4F55C,#B8E62E);
  border-radius:999px;
  transition:width .5s cubic-bezier(.22,1,.36,1);
}
.ec-quiz-question{
  font-size:clamp(16px,1.1vw + 13px,19px);
  font-weight:900;line-height:1.4;
  margin:0 0 20px;color:var(--lang-ink);
  letter-spacing:-.02em;
}
.ec-quiz-options{display:flex;flex-direction:column;gap:10px;margin-bottom:16px}
.ec-quiz-option{
  display:flex;align-items:center;
  border:2px solid var(--lang-line);
  background:#fff;color:var(--lang-ink);
  font-size:13.5px;font-weight:800;
  padding:14px 18px;border-radius:16px;
  text-align:left;cursor:pointer;
  transition:all .16s ease;font-family:inherit;
  box-shadow:0 4px 0 var(--lang-line);
}
.ec-quiz-option:hover:not(:disabled){
  background:var(--lang-lime-soft);
  transform:translateY(-2px);
  box-shadow:0 6px 0 var(--lang-line);
}
.ec-quiz-option:active:not(:disabled){
  transform:translateY(2px);
  box-shadow:0 1px 0 var(--lang-line);
}
.ec-quiz-option:disabled{cursor:default}
.ec-quiz-option--correct{
  background:var(--lang-lime);
  border-color:var(--lang-line);
  color:var(--lang-ink);font-weight:900;
}
.ec-quiz-option--incorrect{
  background:var(--lang-pink-2);
  border-color:var(--lang-line);
  color:#fff;font-weight:900;
}
.ec-quiz-feedback{
  font-size:13px;font-weight:900;
  min-height:22px;margin-bottom:8px;
  letter-spacing:.02em;
}
.ec-quiz-feedback--good{color:#1F8A4C}
.ec-quiz-feedback--bad{color:var(--lang-pink-2)}
.ec-quiz-explain{
  margin:12px 0 0;font-size:12.5px;line-height:1.6;
  color:var(--lang-ink);
  background:var(--lang-lime-soft);
  border:2px solid var(--lang-line);
  border-radius:14px;
  padding:11px 14px;
  font-weight:700;
  box-shadow:0 3px 0 var(--lang-line);
}

/* ============================================================
   TOPIC LIST (sidebar)
   ============================================================ */
.ec-cur-topic-list{
  display:flex;flex-direction:column;gap:8px;
  max-height:520px;overflow-y:auto;padding-right:4px;
}
.ec-cur-topic-btn{
  display:flex;align-items:center;gap:10px;
  padding:11px 13px;border-radius:14px;
  border:2px solid var(--lang-line);
  background:#fff;color:var(--lang-ink);
  font-size:12.5px;font-weight:800;
  text-align:left;cursor:pointer;
  transition:all .15s ease;font-family:inherit;width:100%;
  box-shadow:0 3px 0 var(--lang-line);
}
.ec-cur-topic-btn:hover{
  background:var(--lang-lime-soft);
  transform:translateY(-1px);
  box-shadow:0 4px 0 var(--lang-line);
}
.ec-cur-topic-btn--active{
  background:var(--lang-ink);color:var(--lang-lime);
}
.ec-cur-topic-btn--active:hover{
  background:var(--lang-ink);color:var(--lang-lime);
}
.ec-cur-topic-name{
  flex:1;min-width:0;overflow:hidden;
  text-overflow:ellipsis;white-space:nowrap;
}
.ec-cur-topic-count{
  font-size:10.5px;font-weight:900;
  padding:3px 9px;border-radius:999px;
  background:var(--lang-lime);color:var(--lang-ink);
  border:2px solid var(--lang-line);
  flex-shrink:0;
}
.ec-cur-topic-btn--active .ec-cur-topic-count{
  background:var(--lang-lime);color:var(--lang-ink);
  border-color:var(--lang-line);
}

/* ============================================================
   BANK ITEM (writing bank)
   ============================================================ */
.ec-cur-bank-item{
  display:flex;align-items:center;justify-content:space-between;
  gap:12px;padding:12px 15px;
  border-radius:14px;
  background:var(--lang-pink);
  color:var(--lang-ink);
  border:2px solid var(--lang-line);
  font-size:13px;font-weight:800;
  transition:all .16s ease;
  box-shadow:0 3px 0 var(--lang-line);
  cursor:pointer;
}
.ec-cur-bank-item:hover{
  background:var(--lang-pink-2);
  color:#fff;
  transform:translateY(-2px);
  box-shadow:0 5px 0 var(--lang-line);
}

/* ============================================================
   TRANSLATION
   ============================================================ */
.ec-cur-translation p.bn{
  font-size:17px;font-weight:900;
  margin:12px 0;color:var(--lang-ink);
  letter-spacing:-.015em;
}
.ec-cur-translation textarea{
  width:100%;border-radius:14px;
  border:2px solid var(--lang-line);
  padding:12px 14px;
  font-family:inherit;font-size:14px;font-weight:700;
  background:#fff;color:var(--lang-ink);
  outline:none;resize:vertical;
  transition:box-shadow .18s ease;
  box-shadow:0 3px 0 var(--lang-line);
}
.ec-cur-translation textarea:focus{
  box-shadow:0 3px 0 var(--lang-line),0 0 0 4px rgba(212,245,92,.55);
}
.ec-cur-translation textarea::placeholder{
  color:var(--lang-ink-soft);font-weight:500;
}

/* ============================================================
   SESSION PROGRESS (sidebar)
   ============================================================ */
.ec-cur-session-label{
  display:flex;justify-content:space-between;
  font-size:12.5px;font-weight:900;
  letter-spacing:.04em;text-transform:uppercase;
  margin-bottom:10px;
}

/* ============================================================
   SKELETON
   ============================================================ */
.ec-cur-skel{
  display:inline-block;
  background:linear-gradient(90deg,rgba(120,110,180,.14) 25%,rgba(120,110,180,.26) 37%,rgba(120,110,180,.14) 63%);
  background-size:400% 100%;
  animation:ec-cur-shimmer 1.4s ease infinite;
  border-radius:8px;
}
@keyframes ec-cur-shimmer{0%{background-position:100% 50%}100%{background-position:0 50%}}

/* ============================================================
   ANIMATIONS
   ============================================================ */
@keyframes ec-cur-fade{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.ec-cur-anim{animation:ec-cur-fade .4s ease both}

.ec-cur-xp-toast{
  position:fixed;top:78px;right:20px;z-index:50;
  background:var(--lang-ink);color:var(--lang-lime);
  padding:12px 22px;border-radius:999px;
  font-weight:900;font-size:13.5px;
  border:2px solid var(--lang-lime);
  box-shadow:0 12px 28px rgba(23,16,46,.4);
  animation:ec-toast-pop .9s ease both;
  letter-spacing:.03em;
}
@keyframes ec-toast-pop{
  0%{transform:translateY(-10px) scale(.9);opacity:0}
  20%{transform:translateY(0) scale(1);opacity:1}
  80%{transform:translateY(0) scale(1);opacity:1}
  100%{transform:translateY(-8px) scale(.98);opacity:0}
}

@keyframes ec-pop{0%{transform:scale(1)}50%{transform:scale(1.04)}100%{transform:scale(1)}}
.ec-pop{animation:ec-pop .35s cubic-bezier(.34,1.56,.64,1)}
@keyframes ec-shake{
  0%,100%{transform:translateX(0)}
  20%{transform:translateX(-6px)}40%{transform:translateX(6px)}
  60%{transform:translateX(-4px)}80%{transform:translateX(4px)}
}
.ec-shake{animation:ec-shake .4s ease}

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width:900px){
  .ec-cur-grid{grid-template-columns:1fr;gap:18px}
  .ec-cur-hero{flex-direction:column;align-items:flex-start;min-height:0}
  .ec-cur-hero-mascot{position:absolute;right:14px;bottom:14px;transform:scale(.72);transform-origin:bottom right;animation:none}
}
@media (max-width:720px){
  .ec-cur-head{flex-direction:column;align-items:flex-start;gap:8px}
  .ec-cur-hero{padding:22px 20px;border-radius:26px}
  .ec-cur-hero h1{font-size:24px}
  .ec-cur-hero p{font-size:13px}
  .ec-cur-hero-stats{gap:8px;margin-top:14px}
  .ec-cur-hero-stat{padding:8px 12px;min-width:70px;border-radius:12px}
  .ec-cur-hero-stat strong{font-size:17px}
  .ec-cur-hero-stat span{font-size:9px}
  .ec-cur-hero-mascot{display:none}
  .ec-cur-filters{padding:12px;gap:8px;border-radius:18px}
  .ec-cur-pill{padding:8px 13px;font-size:12px}
  .ec-cur-select{padding:8px 13px;font-size:12px}
  .ec-cur-check{padding:8px 12px;font-size:12px}
  .ec-cur-section{padding:18px;border-radius:22px;box-shadow:0 6px 0 var(--lang-line)}
  .ec-quiz-question{font-size:15px}
  .ec-quiz-option{padding:12px 14px;font-size:13px;border-radius:14px}
  .ec-cur-topic-list{max-height:none}
  .ec-cur-cat{padding:9px 14px;font-size:12px}
}
@media (max-width:380px){
  .ec-cur-pill{padding:7px 11px;font-size:11.5px}
  .ec-cur-hero h1{font-size:22px}
}
@media (prefers-reduced-motion: reduce){
  .ec-cur-anim,.ec-pop,.ec-shake,.ec-cur-xp-toast{animation:none!important}
  .ec-cur-hero-orb{animation:none}
  .ec-cur-hero-mascot{animation:none}
  .ec-cur-pill,.ec-cur-cat,.ec-cur-topic-btn,.ec-cur-bank-item{transition:none!important}
}
`;

/* ============================================================
   17 CATEGORIES × ~30 QUESTIONS = 510 EXERCISES
   ============================================================ */
const QUESTION_BANK = {
  verbs: { name: 'Right Form of Verbs', icon: 'target', questions: [
    { p:'He ___ to school every day.', o:['go','goes','going','gone'], a:'goes', e:'Third person singular in present simple takes -s.', b:'প্রেজেন্ট সিম্পলে তৃতীয় পুরুষ একবচনে verb-এ -s যোগ হয়।' },
    { p:'The sun ___ in the east.', o:['rise','rises','rising','rose'], a:'rises', e:'Universal truth → present simple.', b:'সর্বজনীন সত্য → present simple।' },
    { p:'They ___ football yesterday.', o:['play','plays','played','playing'], a:'played', e:'Past time marker → past simple.', b:'অতীত কালের নির্দেশক → past simple।' },
    { p:'She ___ TV when I called.', o:['watch','watches','was watching','watched'], a:'was watching', e:'Interrupted past action → past continuous.', b:'অতীতের চলমান কাজ → past continuous।' },
    { p:'I ___ my homework already.', o:['finish','finishes','have finished','finished'], a:'have finished', e:'"Already" → present perfect.', b:'"Already" → present perfect।' },
    { p:'Water ___ at 100°C.', o:['boil','boils','boiling','boiled'], a:'boils', e:'General truth with singular subject.', b:'একবচন subject সহ সাধারণ সত্য।' },
    { p:'We ___ to Dhaka next week.', o:['go','goes','will go','went'], a:'will go', e:'Future intent → will + base.', b:'ভবিষ্যৎ ইচ্ছা → will + base।' },
    { p:'He ___ his keys.', o:['lose','loses','has lost','lost'], a:'has lost', e:'Result affects now → present perfect.', b:'ফলাফল এখনো প্রভাব ফেলে → present perfect।' },
    { p:'By next year, I ___ my degree.', o:['finish','finishes','will have finished','finished'], a:'will have finished', e:'Future perfect for action complete before future time.', b:'Future perfect → নির্দিষ্ট ভবিষ্যৎ সময়ের আগে শেষ।' },
    { p:'The train ___ before we arrived.', o:['leave','leaves','had left','left'], a:'had left', e:'Earlier past action → past perfect.', b:'আগের অতীত কাজ → past perfect।' },
    { p:'I ___ him yesterday.', o:['see','sees','saw','seen'], a:'saw', e:'Past time → past simple.', b:'অতীত কাল → past simple।' },
    { p:'Look! The baby ___ .', o:['cries','cried','is crying','cry'], a:'is crying', e:'Action happening now → present continuous.', b:'এখন ঘটছে → present continuous।' },
    { p:'She ___ here since 2015.', o:['live','lives','has lived','lived'], a:'has lived', e:'"Since" + starting point → present perfect.', b:'"Since" + শুরুর সময় → present perfect।' },
    { p:'He ___ English very well.', o:['speak','speaks','speaking','spoke'], a:'speaks', e:'Habit with third person singular.', b:'তৃতীয় পুরুষ একবচনের অভ্যাস।' },
    { p:'They ___ dinner when the lights went out.', o:['have','had','were having','has'], a:'were having', e:'Ongoing action interrupted.', b:'চলমান কাজ মাঝে বাধা।' },
    { p:'I ___ in Dhaka for five years.', o:['live','lived','have lived','am living'], a:'have lived', e:'Duration from past to now.', b:'অতীত থেকে এখন পর্যন্ত ব্যাপ্তি।' },
    { p:'She ___ to London last year.', o:['go','goes','went','gone'], a:'went', e:'Specific past time.', b:'নির্দিষ্ট অতীত সময়।' },
    { p:'If he ___ hard, he will succeed.', o:['work','works','worked','working'], a:'works', e:'First conditional → present simple in if-clause.', b:'First conditional → if-clause এ present simple।' },
    { p:'The children ___ in the garden now.', o:['play','plays','are playing','played'], a:'are playing', e:'Plural + present continuous.', b:'বহুবচন + present continuous।' },
    { p:'My father ___ to work by bus.', o:['go','goes','going','went'], a:'goes', e:'Habit with he/she/it.', b:'he/she/it এর অভ্যাস।' },
    { p:'I have never ___ sushi.', o:['eat','eats','eaten','ate'], a:'eaten', e:'Have + past participle.', b:'Have + past participle।' },
    { p:'She ___ her homework before dinner.', o:['do','does','did','done'], a:'did', e:'Completed action.', b:'সম্পন্ন কাজ।' },
    { p:'They ___ to Paris twice.', o:['go','goes','have gone','went'], a:'have gone', e:'Experience up to now.', b:'এখন পর্যন্ত অভিজ্ঞতা।' },
    { p:'The shop ___ at 9 AM daily.', o:['open','opens','opening','opened'], a:'opens', e:'Scheduled routine with singular subject.', b:'নির্ধারিত সময়সূচি সহ একবচন subject।' },
    { p:'He ___ football when he was young.', o:['play','plays','played','playing'], a:'played', e:'Past habit → past simple.', b:'অতীতের অভ্যাস → past simple।' },
    { p:'It ___ since morning.', o:['rain','rains','has been raining','rained'], a:'has been raining', e:'Continuing action from past to now → present perfect continuous.', b:'অতীত থেকে এখন চলছে → present perfect continuous।' },
    { p:'We ___ each other for ten years.', o:['know','knows','have known','knew'], a:'have known', e:'Duration → present perfect.', b:'ব্যাপ্তি → present perfect।' },
    { p:'I ___ my keys this morning.', o:['lose','loses','lost','have lost'], a:'lost', e:'"This morning" finished time → past simple.', b:'"This morning" শেষ হওয়া সময় → past simple।' },
    { p:'She ___ dinner before I arrived.', o:['cook','cooks','had cooked','cooked'], a:'had cooked', e:'Earlier past action → past perfect.', b:'আগের অতীত কাজ → past perfect।' },
    { p:'I ___ to the gym every Sunday.', o:['go','goes','went','going'], a:'go', e:'Habit with "I" → base verb.', b:'"I" এর অভ্যাস → base verb।' },
  ]},
  articles: { name: 'Articles', icon: 'flag', questions: [
    { p:'She is ___ honest student.', o:['a','an','the','—'], a:'an', e:'Silent h → vowel sound → "an".', b:'Silent h → vowel sound → "an"।' },
    { p:'I saw ___ elephant.', o:['a','an','the','—'], a:'an', e:'Vowel sound → "an".', b:'Vowel sound → "an"।' },
    { p:'___ Padma is long.', o:['A','An','The','—'], a:'The', e:'Rivers take "the".', b:'নদীর নামের আগে "the"।' },
    { p:'He plays ___ cricket.', o:['a','an','the','—'], a:'—', e:'No article with sports.', b:'খেলার আগে article নেই।' },
    { p:'I bought ___ umbrella.', o:['a','an','the','—'], a:'an', e:'Vowel sound → "an".', b:'Vowel sound → "an"।' },
    { p:'He is ___ best student.', o:['a','an','the','—'], a:'the', e:'Superlative takes "the".', b:'Superlative এর আগে "the"।' },
    { p:'She is ___ doctor.', o:['a','an','the','—'], a:'a', e:'Consonant sound → "a".', b:'Consonant sound → "a"।' },
    { p:'___ book on the table is mine.', o:['A','An','The','—'], a:'The', e:'Specific → "the".', b:'নির্দিষ্ট → "the"।' },
    { p:'She has ___ MBA.', o:['a','an','the','—'], a:'an', e:'"M" sounds like "em".', b:'"M" এর উচ্চারণ "em"।' },
    { p:'___ Sun rises in the east.', o:['A','An','The','—'], a:'The', e:'Unique object → "the".', b:'একক বস্তু → "the"।' },
    { p:'He speaks ___ English fluently.', o:['a','an','the','—'], a:'—', e:'No article with languages.', b:'ভাষার আগে article নেই।' },
    { p:'My brother is ___ engineer.', o:['a','an','the','—'], a:'an', e:'Vowel sound → "an".', b:'Vowel sound → "an"।' },
    { p:'I like ___ music.', o:['a','an','the','—'], a:'—', e:'General → no article.', b:'সাধারণ → article নেই।' },
    { p:'___ Himalayas are in Asia.', o:['A','An','The','—'], a:'The', e:'Mountain ranges take "the".', b:'পর্বতমালার আগে "the"।' },
    { p:'I saw ___ interesting movie.', o:['a','an','the','—'], a:'an', e:'Vowel sound → "an".', b:'Vowel sound → "an"।' },
    { p:'___ Nile is the longest river.', o:['A','An','The','—'], a:'The', e:'River name → "the".', b:'নদীর নাম → "the"।' },
    { p:'I need ___ hour.', o:['a','an','the','—'], a:'an', e:'Silent h → vowel sound.', b:'Silent h → vowel sound।' },
    { p:'She plays ___ piano.', o:['a','an','the','—'], a:'the', e:'Musical instruments → "the".', b:'বাদ্যযন্ত্র → "the"।' },
    { p:'___ rich should help the poor.', o:['A','An','The','—'], a:'The', e:'Adjective as group → "the".', b:'গোষ্ঠী বোঝাতে adjective → "the"।' },
    { p:'Give me ___ pen.', o:['a','an','the','—'], a:'a', e:'Consonant sound.', b:'Consonant sound।' },
    { p:'He is ___ MBA graduate.', o:['a','an','the','—'], a:'an', e:'"em-bee-ay" starts with vowel.', b:'"em-bee-ay" vowel দিয়ে শুরু।' },
    { p:'We visited ___ Taj Mahal.', o:['a','an','the','—'], a:'the', e:'Monuments → "the".', b:'স্মৃতিস্তম্ভ → "the"।' },
    { p:'He goes to ___ school.', o:['a','an','the','—'], a:'—', e:'Institutions in general → no article.', b:'সাধারণভাবে প্রতিষ্ঠান → article নেই।' },
    { p:'___ Alps are in Europe.', o:['A','An','The','—'], a:'The', e:'Mountain ranges → "the".', b:'পর্বতমালা → "the"।' },
    { p:'I have ___ idea.', o:['a','an','the','—'], a:'an', e:'Vowel sound → "an".', b:'Vowel sound → "an"।' },
    { p:'___ Pacific is the largest ocean.', o:['A','An','The','—'], a:'The', e:'Oceans → "the".', b:'মহাসাগর → "the"।' },
    { p:'She bought ___ new car.', o:['a','an','the','—'], a:'a', e:'Consonant sound → "a".', b:'Consonant sound → "a"।' },
    { p:'___ Ganges is sacred.', o:['A','An','The','—'], a:'The', e:'River → "the".', b:'নদী → "the"।' },
    { p:'I read ___ book yesterday.', o:['a','an','the','—'], a:'a', e:'First mention, consonant sound.', b:'প্রথম উল্লেখ, consonant sound।' },
    { p:'___ moon looks beautiful tonight.', o:['A','An','The','—'], a:'The', e:'Unique object → "the".', b:'একক বস্তু → "the"।' },
  ]},
  prepositions: { name: 'Prepositions', icon: 'chat', questions: [
    { p:'I will meet you ___ Friday.', o:['in','on','at','by'], a:'on', e:'Days → "on".', b:'দিন → "on"।' },
    { p:'The book is ___ the table.', o:['in','on','at','under'], a:'on', e:'Surface → "on".', b:'পৃষ্ঠ → "on"।' },
    { p:'She arrived ___ 6 PM.', o:['in','on','at','for'], a:'at', e:'Clock time → "at".', b:'ঘড়ির সময় → "at"।' },
    { p:'We live ___ Chattogram.', o:['in','on','at','to'], a:'in', e:'City → "in".', b:'শহর → "in"।' },
    { p:'He is good ___ mathematics.', o:['in','on','at','for'], a:'at', e:'Fixed: good at.', b:'Fixed: good at।' },
    { p:'We waited ___ the bus.', o:['on','for','to','at'], a:'for', e:'Fixed: wait for.', b:'Fixed: wait for।' },
    { p:'She is interested ___ art.', o:['at','in','on','for'], a:'in', e:'Fixed: interested in.', b:'Fixed: interested in।' },
    { p:'He is afraid ___ dogs.', o:['at','of','in','on'], a:'of', e:'Fixed: afraid of.', b:'Fixed: afraid of।' },
    { p:'I arrived ___ the airport at 5.', o:['in','on','at','to'], a:'at', e:'Specific point → "at".', b:'নির্দিষ্ট বিন্দু → "at"।' },
    { p:'They depend ___ their parents.', o:['on','in','at','for'], a:'on', e:'Fixed: depend on.', b:'Fixed: depend on।' },
    { p:'She listens ___ music.', o:['at','to','in','on'], a:'to', e:'Fixed: listen to.', b:'Fixed: listen to।' },
    { p:'We will meet ___ the corner.', o:['at','in','on','to'], a:'at', e:'Fixed: at the corner.', b:'Fixed: at the corner।' },
    { p:'He was born ___ 1990.', o:['at','in','on','for'], a:'in', e:'Years → "in".', b:'বছর → "in"।' },
    { p:'The pen is ___ the drawer.', o:['in','on','at','to'], a:'in', e:'Enclosed space → "in".', b:'বদ্ধ স্থান → "in"।' },
    { p:'She walked ___ the bridge.', o:['on','over','at','in'], a:'over', e:'Across a surface → "over".', b:'উপর দিয়ে অতিক্রম → "over"।' },
    { p:'I will see you ___ Monday morning.', o:['in','on','at','by'], a:'on', e:'Specific day → "on".', b:'নির্দিষ্ট দিন → "on"।' },
    { p:'She was born ___ December.', o:['in','on','at','by'], a:'in', e:'Months → "in".', b:'মাস → "in"।' },
    { p:'The meeting is ___ 3 PM.', o:['in','on','at','by'], a:'at', e:'Clock time → "at".', b:'ঘড়ির সময় → "at"।' },
    { p:'He is married ___ my sister.', o:['with','to','for','at'], a:'to', e:'Fixed: married to.', b:'Fixed: married to।' },
    { p:'I am angry ___ him.', o:['on','with','at','in'], a:'with', e:'Fixed: angry with (person).', b:'Fixed: angry with (ব্যক্তি)।' },
    { p:'She is famous ___ her cooking.', o:['of','for','in','at'], a:'for', e:'Fixed: famous for.', b:'Fixed: famous for।' },
    { p:'We arrived ___ London.', o:['at','in','on','to'], a:'in', e:'Cities → "in".', b:'শহর → "in"।' },
    { p:'He is responsible ___ the project.', o:['of','for','in','at'], a:'for', e:'Fixed: responsible for.', b:'Fixed: responsible for।' },
    { p:'She is different ___ her sister.', o:['than','from','to','of'], a:'from', e:'Fixed: different from.', b:'Fixed: different from।' },
    { p:'I am tired ___ waiting.', o:['of','from','with','at'], a:'of', e:'Fixed: tired of.', b:'Fixed: tired of।' },
    { p:'He apologized ___ being late.', o:['of','for','to','at'], a:'for', e:'Fixed: apologize for.', b:'Fixed: apologize for।' },
    { p:'We walked ___ the river.', o:['along','in','at','to'], a:'along', e:'Beside → "along".', b:'পাশ দিয়ে → "along"।' },
    { p:'I have been here ___ Monday.', o:['from','since','for','at'], a:'since', e:'Starting point → "since".', b:'শুরুর সময় → "since"।' },
    { p:'She has worked here ___ five years.', o:['since','for','in','at'], a:'for', e:'Duration → "for".', b:'ব্যাপ্তি → "for"।' },
    { p:'He died ___ cancer.', o:['of','from','by','with'], a:'of', e:'Cause of death → "of".', b:'মৃত্যুর কারণ → "of"।' },
  ]},
  connectors: { name: 'Sentence Connectors', icon: 'zap', questions: [
    { p:'He studied hard, ___ he passed.', o:['so','but','or','because'], a:'so', e:'Result → "so".', b:'ফলাফল → "so"।' },
    { p:'She is smart ___ lazy.', o:['but','and','or','because'], a:'but', e:'Contrast → "but".', b:'বৈপরীত্য → "but"।' },
    { p:'I stayed home ___ it was raining.', o:['because','although','but','so'], a:'because', e:'Cause → "because".', b:'কারণ → "because"।' },
    { p:'___ it was raining, we went out.', o:['Although','Because','But','So'], a:'Although', e:'Concession → "Although".', b:'ছাড় → "Although"।' },
    { p:'Do you want tea ___ coffee?', o:['or','and','but','so'], a:'or', e:'Choice → "or".', b:'বিকল্প → "or"।' },
    { p:'He is tall ___ his brother is short.', o:['while','because','so','although'], a:'while', e:'Simultaneous contrast.', b:'একই সময়ের বৈপরীত্য।' },
    { p:'I will wait ___ you come.', o:['until','because','although','but'], a:'until', e:'Time → "until".', b:'সময় → "until"।' },
    { p:'She was tired, ___ she went to bed.', o:['so','because','although','or'], a:'so', e:'Result → "so".', b:'ফলাফল → "so"।' },
    { p:'___ he was late, he got the job.', o:['Although','Because','But','So'], a:'Although', e:'Contrast → "Although".', b:'বৈপরীত্য → "Although"।' },
    { p:'I will call you ___ I arrive.', o:['when','because','although','but'], a:'when', e:'Time clause → "when".', b:'সময় → "when"।' },
    { p:'It was raining, ___ we stayed inside.', o:['so','but','or','because'], a:'so', e:'Result → "so".', b:'ফলাফল → "so"।' },
    { p:'She sings well ___ she dances better.', o:['but','and','or','so'], a:'but', e:'Contrast → "but".', b:'বৈপরীত্য → "but"।' },
    { p:'He is rich, ___ he is not happy.', o:['but','and','or','so'], a:'but', e:'Contrast.', b:'বৈপরীত্য।' },
    { p:'I do not know ___ he will come.', o:['if','that','which','who'], a:'if', e:'Indirect question → "if".', b:'Indirect question → "if"।' },
    { p:'___ you work hard, you will pass.', o:['If','Because','But','So'], a:'If', e:'Condition → "If".', b:'শর্ত → "If"।' },
    { p:'He is neither rich ___ famous.', o:['nor','or','and','but'], a:'nor', e:'"Neither…nor".', b:'"Neither…nor"।' },
    { p:'She is both smart ___ kind.', o:['and','or','but','nor'], a:'and', e:'"Both…and".', b:'"Both…and"।' },
    { p:'___ he is poor, he is honest.', o:['Though','Because','So','But'], a:'Though', e:'Concession.', b:'ছাড়।' },
    { p:'He failed ___ he did not study.', o:['because','but','or','so'], a:'because', e:'Cause.', b:'কারণ।' },
    { p:'I waited ___ he arrived.', o:['until','because','so','but'], a:'until', e:'Time.', b:'সময়।' },
    { p:'___ the rain, we went out.', o:['Despite','Because','So','And'], a:'Despite', e:'"Despite" + noun.', b:'"Despite" + noun।' },
    { p:'He works hard ___ he can succeed.', o:['so that','because','although','or'], a:'so that', e:'Purpose → "so that".', b:'উদ্দেশ্য → "so that"।' },
    { p:'Take an umbrella ___ it rains.', o:['in case','because','so','but'], a:'in case', e:'Precaution → "in case".', b:'সতর্কতা → "in case"।' },
    { p:'He is not only intelligent ___ hardworking.', o:['but also','and','or','so'], a:'but also', e:'"Not only…but also".', b:'"Not only…but also"।' },
    { p:'___ I was young, I lived in Dhaka.', o:['When','Because','But','So'], a:'When', e:'Time → "When".', b:'সময় → "When"।' },
    { p:'She was ill, ___ she did not go.', o:['so','but','or','and'], a:'so', e:'Result.', b:'ফলাফল।' },
    { p:'He ran fast ___ he missed the bus.', o:['but','and','or','so'], a:'but', e:'Contrast.', b:'বৈপরীত্য।' },
    { p:'I will help you ___ you ask.', o:['if','but','or','so'], a:'if', e:'Condition.', b:'শর্ত।' },
    { p:'He is slow ___ steady.', o:['but','and','or','so'], a:'but', e:'Contrast.', b:'বৈপরীত্য।' },
    { p:'___ the fog, the flight was delayed.', o:['Because of','Although','But','So'], a:'Because of', e:'"Because of" + noun.', b:'"Because of" + noun।' },
  ]},
  modifiers: { name: 'Modifiers', icon: 'book', questions: [
    { p:'___ students should study regularly.', o:['A','An','The','—'], a:'The', e:'Definite group → "The".', b:'নির্দিষ্ট গোষ্ঠী → "The"।' },
    { p:'It is a ___ interesting book.', o:['very','much','so','such'], a:'very', e:'"Very" before adjective.', b:'Adjective এর আগে "very"।' },
    { p:'He runs ___ fast.', o:['very','much','so','such'], a:'very', e:'"Very" modifies adverb.', b:'"Very" adverb কে modify করে।' },
    { p:'She is ___ a nice girl.', o:['such','so','very','much'], a:'such', e:'"Such" + a + adj + noun.', b:'"Such" + a + adj + noun।' },
    { p:'I have ___ money.', o:['much','many','a few','few'], a:'much', e:'Uncountable → "much".', b:'Uncountable → "much"।' },
    { p:'I have ___ books.', o:['much','many','a little','little'], a:'many', e:'Countable plural → "many".', b:'গণনাযোগ্য plural → "many"।' },
    { p:'He ate ___ rice.', o:['a few','many','a little','few'], a:'a little', e:'Uncountable positive → "a little".', b:'Uncountable positive → "a little"।' },
    { p:'There are ___ students.', o:['a little','much','a few','little'], a:'a few', e:'Countable plural positive → "a few".', b:'গণনাযোগ্য plural positive → "a few"।' },
    { p:'She has ___ friends.', o:['much','a little','few','little'], a:'few', e:'Countable plural negative → "few".', b:'গণনাযোগ্য plural negative → "few"।' },
    { p:'I have ___ patience.', o:['many','few','little','a few'], a:'little', e:'Uncountable negative → "little".', b:'Uncountable negative → "little"।' },
    { p:'This is ___ a good film.', o:['so','such','very','much'], a:'such', e:'"Such a" before adjective + noun.', b:'"Such a" adjective + noun এর আগে।' },
    { p:'The film was ___ good.', o:['such','so','very much','much'], a:'so', e:'"So" + adj (no noun).', b:'"So" + adj (noun ছাড়া)।' },
    { p:'He is ___ tallest boy.', o:['a','an','the','—'], a:'the', e:'Superlative → "the".', b:'Superlative → "the"।' },
    { p:'It is ___ beautiful garden.', o:['such','such a','so','very much'], a:'such a', e:'"Such a" pattern.', b:'"Such a" pattern।' },
    { p:'She speaks English ___ .', o:['good','well','nice','fine'], a:'well', e:'Adverb modifies verb.', b:'Adverb verb modify করে।' },
    { p:'The weather is ___ today.', o:['nice','nicely','goodly','well'], a:'nice', e:'Adjective after linking verb.', b:'Linking verb এর পরে adjective।' },
    { p:'I am ___ tired.', o:['very','much','so much','such'], a:'very', e:'"Very" + adj.', b:'"Very" + adj।' },
    { p:'He is ___ honest man.', o:['a','an','the','—'], a:'an', e:'Vowel sound → "an".', b:'Vowel sound → "an"।' },
    { p:'___ of the two boys came.', o:['Both','Either','All','Some'], a:'Both', e:'"Both of" for two.', b:'দুইজনের জন্য "Both of"।' },
    { p:'___ of the two roads is safe.', o:['Both','Neither','All','Some'], a:'Neither', e:'"Neither of" = none of two.', b:'"Neither of" = দুইয়ের কেউ নয়।' },
    { p:'I have ___ time to finish.', o:['enough','very','too','so'], a:'enough', e:'"Enough" before noun.', b:'Noun এর আগে "enough"।' },
    { p:'He is ___ to solve it.', o:['clever enough','enough clever','cleverly enough','too clever'], a:'clever enough', e:'"Adj + enough" after adjective.', b:'Adjective এর পরে "adj + enough"।' },
    { p:'This book is ___ than that.', o:['better','good','best','more good'], a:'better', e:'Comparative of "good".', b:'"good" এর comparative "better"।' },
    { p:'She is the ___ beautiful.', o:['most','more','much','many'], a:'most', e:'Superlative for long adjectives.', b:'লম্বা adjective এর superlative।' },
    { p:'He has ___ little money.', o:['a','an','the','—'], a:'a', e:'"A little" positive.', b:'"A little" positive।' },
    { p:'___ students are absent today.', o:['Much','Many','A little','Little'], a:'Many', e:'Countable plural.', b:'গণনাযোগ্য plural।' },
    { p:'I have ___ few friends.', o:['a','an','the','—'], a:'a', e:'"A few" positive.', b:'"A few" positive।' },
    { p:'He was ___ last to arrive.', o:['a','an','the','—'], a:'the', e:'"The last" fixed.', b:'"The last" fixed।' },
    { p:'I had ___ wonderful time.', o:['a','an','the','—'], a:'a', e:'"A wonderful time" idiomatic.', b:'"A wonderful time" idiomatic।' },
    { p:'He is ___ older than me.', o:['very','much','so','such'], a:'much', e:'"Much" before comparative.', b:'Comparative এর আগে "much"।' },
  ]},
  completing: { name: 'Completing Sentences', icon: 'users', questions: [
    { p:'If I had studied, ___', o:['I would pass.','I would have passed.','I will pass.','I pass.'], a:'I would have passed.', e:'Third conditional.', b:'Third conditional।' },
    { p:'Unless you work hard, ___', o:['you will fail.','you will pass.','you would pass.','you passed.'], a:'you will fail.', e:'"Unless" = if not.', b:'"Unless" = যদি না।' },
    { p:'It is high time ___', o:['we change our habit.','we changed our habit.','we will change.','we have changed.'], a:'we changed our habit.', e:'"It is high time" + past subjunctive.', b:'"It is high time" + past subjunctive।' },
    { p:'He speaks as if ___', o:['he knows everything.','he knew everything.','he will know.','he is knowing.'], a:'he knew everything.', e:'"As if" + past subjunctive.', b:'"As if" + past subjunctive।' },
    { p:'I wish ___', o:['I am a bird.','I was a bird.','I were a bird.','I will be a bird.'], a:'I were a bird.', e:'Wish + past subjunctive.', b:'Wish + past subjunctive।' },
    { p:'No sooner had he arrived ___', o:['than it started raining.','when it started raining.','then it started raining.','that it started raining.'], a:'than it started raining.', e:'"No sooner…than" fixed.', b:'"No sooner…than" fixed।' },
    { p:'Hardly had I reached the station ___', o:['than the train left.','when the train left.','that the train left.','the train left.'], a:'when the train left.', e:'"Hardly…when" fixed.', b:'"Hardly…when" fixed।' },
    { p:'It is time we ___', o:['start','started','will start','have started'], a:'started', e:'"It is time" + past subjunctive.', b:'"It is time" + past subjunctive।' },
    { p:'He would rather ___', o:['die than beg.','die than begging.','died than beg.','dying than beg.'], a:'die than beg.', e:'"Would rather…than" + base verb.', b:'"Would rather…than" + base verb।' },
    { p:'I would rather you ___ the truth.', o:['tell','told','will tell','have told'], a:'told', e:'"Would rather" + past subjunctive.', b:'"Would rather" + past subjunctive।' },
    { p:'As soon as he came, ___', o:['we started the meeting.','we start.','we will start.','we had start.'], a:'we started the meeting.', e:'Sequence in past.', b:'অতীতে ক্রম।' },
    { p:'The more you read, ___', o:['the more you learn.','you learn more.','the most you learn.','much you learn.'], a:'the more you learn.', e:'"The more…the more" pattern.', b:'"The more…the more" pattern।' },
    { p:'Were I rich, ___', o:['I would help the poor.','I will help the poor.','I helped the poor.','I help the poor.'], a:'I would help the poor.', e:'Inverted second conditional.', b:'Inverted second conditional।' },
    { p:'Had I known, ___', o:['I would come.','I would have come.','I will come.','I came.'], a:'I would have come.', e:'Inverted third conditional.', b:'Inverted third conditional।' },
    { p:'It is I who ___ responsible.', o:['am','is','are','be'], a:'am', e:'"It is I who" + verb agrees with I.', b:'"It is I who" + verb I এর সাথে মিলে।' },
    { p:'He acts as if he ___ mad.', o:['is','was','were','be'], a:'were', e:'"As if" + past subjunctive.', b:'"As if" + past subjunctive।' },
    { p:'She talks as though she ___ everything.', o:['knows','knew','will know','has known'], a:'knew', e:'"As though" + past subjunctive.', b:'"As though" + past subjunctive।' },
    { p:'I wish I ___ taller.', o:['am','was','were','be'], a:'were', e:'Wish + past subjunctive.', b:'Wish + past subjunctive।' },
    { p:'Barely had he finished ___', o:['when the bell rang.','than the bell rang.','that the bell rang.','the bell rang.'], a:'when the bell rang.', e:'"Barely…when" fixed.', b:'"Barely…when" fixed।' },
    { p:'Scarcely had we started ___', o:['than it rained.','when it rained.','that it rained.','it rained.'], a:'when it rained.', e:'"Scarcely…when" fixed.', b:'"Scarcely…when" fixed।' },
    { p:'He is used to ___ early.', o:['get up','getting up','got up','gets up'], a:'getting up', e:'"Used to" + gerund = accustomed to.', b:'"Used to" + gerund = অভ্যস্ত।' },
    { p:'I am looking forward to ___ you.', o:['meet','meeting','met','meets'], a:'meeting', e:'"Looking forward to" + gerund.', b:'"Looking forward to" + gerund।' },
    { p:'It is many years since ___', o:['I met him.','I have met him.','I meet him.','I will meet him.'], a:'I met him.', e:'"Since" + past simple here.', b:'এখানে "Since" + past simple।' },
    { p:'No matter how hard he tries, ___', o:['he cannot win.','he can win.','he wins.','he will win.'], a:'he cannot win.', e:'"No matter how" = concession.', b:'"No matter how" = ছাড়।' },
    { p:'However hard you try, ___', o:['you will not succeed easily.','you will succeed easily.','you succeed easily.','you succeeded.'], a:'you will not succeed easily.', e:'Concession structure.', b:'ছাড়ের গঠন।' },
    { p:'As long as you work hard, ___', o:['you will succeed.','you will fail.','you failed.','you are failing.'], a:'you will succeed.', e:'Condition → result.', b:'শর্ত → ফলাফল।' },
    { p:'Whether you come or not, ___', o:['the meeting will start.','the meeting starts tomorrow.','the meeting started.','the meeting is starting.'], a:'the meeting will start.', e:'Regardless → future.', b:'যাই হোক → ভবিষ্যৎ।' },
    { p:'In case of rain, ___', o:['we will stay home.','we stayed home.','we stay at home last week.','we would stay.'], a:'we will stay home.', e:'Precautionary future.', b:'সতর্কতামূলক ভবিষ্যৎ।' },
    { p:'He is too weak ___', o:['to walk.','to walking.','walk.','for walk.'], a:'to walk', e:'"Too + adj + to + base verb".', b:'"Too + adj + to + base verb"।' },
    { p:'I would rather walk ___', o:['than take a bus.','than taking a bus.','than took a bus.','then take a bus.'], a:'than take a bus.', e:'"Would rather…than" + base verb.', b:'"Would rather…than" + base verb।' },
  ]},
  voice: { name: 'Voice Change', icon: 'chat', questions: [
    { p:'Passive: "Rina writes a letter."', o:['A letter is written by Rina.','A letter was written by Rina.','A letter has written by Rina.','A letter is writing by Rina.'], a:'A letter is written by Rina.', e:'Present simple passive.', b:'Present simple passive।' },
    { p:'Passive: "They built the bridge."', o:['The bridge is built.','The bridge was built.','The bridge has built.','The bridge was building.'], a:'The bridge was built.', e:'Past simple passive.', b:'Past simple passive।' },
    { p:'Passive: "He will finish the work."', o:['The work will be finished.','The work will finished.','The work would be finished.','The work is finished.'], a:'The work will be finished.', e:'Future passive.', b:'Future passive।' },
    { p:'Passive: "She has eaten the cake."', o:['The cake has been eaten.','The cake has eaten.','The cake was eaten.','The cake is eaten.'], a:'The cake has been eaten.', e:'Present perfect passive.', b:'Present perfect passive।' },
    { p:'Passive: "Someone stole my bag."', o:['My bag was stolen.','My bag is stolen.','My bag has stolen.','My bag was stealing.'], a:'My bag was stolen.', e:'Past simple passive.', b:'Past simple passive।' },
    { p:'Passive: "They are painting the house."', o:['The house is being painted.','The house is painted.','The house was painted.','The house has painted.'], a:'The house is being painted.', e:'Present continuous passive.', b:'Present continuous passive।' },
    { p:'Passive: "He can solve the problem."', o:['The problem can be solved.','The problem can solve.','The problem was solved.','The problem is solved.'], a:'The problem can be solved.', e:'Modal passive.', b:'Modal passive।' },
    { p:'Passive: "They will announce the results."', o:['The results will be announced.','The results will announce.','The results are announced.','The results were announced.'], a:'The results will be announced.', e:'Future passive.', b:'Future passive।' },
    { p:'Passive: "She made the cake."', o:['The cake was made by her.','The cake was made.','The cake is made.','The cake has made.'], a:'The cake was made by her.', e:'Past simple passive with agent.', b:'Past simple passive, agent সহ।' },
    { p:'Passive: "People speak English worldwide."', o:['English is spoken worldwide.','English is speaking worldwide.','English was spoken worldwide.','English has spoken worldwide.'], a:'English is spoken worldwide.', e:'Present simple passive.', b:'Present simple passive।' },
    { p:'Passive: "She teaches English."', o:['English is taught by her.','English is teaching by her.','English was taught by her.','English has taught by her.'], a:'English is taught by her.', e:'Present simple passive.', b:'Present simple passive।' },
    { p:'Passive: "They will build a new school."', o:['A new school will be built.','A new school will build.','A new school is built.','A new school was built.'], a:'A new school will be built.', e:'Future passive.', b:'Future passive।' },
    { p:'Passive: "He wrote the letter."', o:['The letter was written by him.','The letter is written by him.','The letter has written by him.','The letter was writing by him.'], a:'The letter was written by him.', e:'Past simple passive.', b:'Past simple passive।' },
    { p:'Passive: "They have completed the work."', o:['The work has been completed.','The work has completed.','The work was completed.','The work is completed.'], a:'The work has been completed.', e:'Present perfect passive.', b:'Present perfect passive।' },
    { p:'Passive: "Someone is cleaning the room."', o:['The room is being cleaned.','The room is cleaned.','The room was cleaned.','The room has cleaned.'], a:'The room is being cleaned.', e:'Present continuous passive.', b:'Present continuous passive।' },
    { p:'Passive: "She can fix the car."', o:['The car can be fixed by her.','The car can fix by her.','The car is fixed by her.','The car was fixed by her.'], a:'The car can be fixed by her.', e:'Modal passive.', b:'Modal passive।' },
    { p:'Passive: "They must obey the rules."', o:['The rules must be obeyed.','The rules must obey.','The rules are obeyed.','The rules were obeyed.'], a:'The rules must be obeyed.', e:'Modal passive.', b:'Modal passive।' },
    { p:'Passive: "People are watching the match."', o:['The match is being watched.','The match is watched.','The match was watched.','The match has watched.'], a:'The match is being watched.', e:'Present continuous passive.', b:'Present continuous passive।' },
    { p:'Passive: "The chef cooked the meal."', o:['The meal was cooked by the chef.','The meal is cooked by the chef.','The meal has cooked by the chef.','The meal was cooking by the chef.'], a:'The meal was cooked by the chef.', e:'Past simple passive.', b:'Past simple passive।' },
    { p:'Passive: "They will cancel the event."', o:['The event will be cancelled.','The event will cancel.','The event is cancelled.','The event was cancelled.'], a:'The event will be cancelled.', e:'Future passive.', b:'Future passive।' },
    { p:'Passive: "He has written the report."', o:['The report has been written.','The report has written.','The report was written.','The report is written.'], a:'The report has been written.', e:'Present perfect passive.', b:'Present perfect passive।' },
    { p:'Passive: "She was helping the children."', o:['The children were being helped by her.','The children were helped by her.','The children are being helped by her.','The children have been helped by her.'], a:'The children were being helped by her.', e:'Past continuous passive.', b:'Past continuous passive।' },
    { p:'Passive: "They had finished the project."', o:['The project had been finished.','The project had finished.','The project was finished.','The project has finished.'], a:'The project had been finished.', e:'Past perfect passive.', b:'Past perfect passive।' },
    { p:'Passive: "Someone must have taken it."', o:['It must have been taken.','It must have taken.','It was taken.','It has taken.'], a:'It must have been taken.', e:'Perfect modal passive.', b:'Perfect modal passive।' },
    { p:'Passive: "People say that he is honest."', o:['He is said to be honest.','He is said honest.','He was said honest.','He has said honest.'], a:'He is said to be honest.', e:'Impersonal passive.', b:'Impersonal passive।' },
    { p:'Passive: "They believe that she stole the money."', o:['She is believed to have stolen the money.','She is believed to steal.','She was believed to steal.','She believed the money.'], a:'She is believed to have stolen the money.', e:'Impersonal passive with perfect infinitive.', b:'Impersonal passive, perfect infinitive সহ।' },
    { p:'Passive: "Open the door."', o:['Let the door be opened.','The door is opened.','The door was opened.','The door opens.'], a:'Let the door be opened.', e:'Imperative passive → "Let…be".', b:'Imperative passive → "Let…be"।' },
    { p:'Passive: "Do not touch the wire."', o:['Let the wire not be touched.','The wire is not touched.','The wire was not touched.','Do not be touched the wire.'], a:'Let the wire not be touched.', e:'Negative imperative passive.', b:'Negative imperative passive।' },
    { p:'Passive: "Who broke the window?"', o:['By whom was the window broken?','Who was broken the window?','Who is broken the window?','Whom broke the window?'], a:'By whom was the window broken?', e:'Wh-question passive.', b:'Wh-question passive।' },
    { p:'Passive: "They laughed at him."', o:['He was laughed at.','He laughed at.','He is laughing.','He was laughing.'], a:'He was laughed at.', e:'Prepositional verb passive keeps preposition.', b:'Prepositional verb passive এ preposition থাকে।' },
  ]},
  narration: { name: 'Narration', icon: 'chat', questions: [
    { p:'Indirect: He said, "I am tired."', o:['He said that he was tired.','He said that I am tired.','He said that he is tired.','He says he was tired.'], a:'He said that he was tired.', e:'Present → past.', b:'Present → past।' },
    { p:'Indirect: She said, "I will come tomorrow."', o:['She said that she would come the next day.','She said that she will come tomorrow.','She said she came tomorrow.','She said she would come tomorrow.'], a:'She said that she would come the next day.', e:'Will → would; tomorrow → the next day.', b:'Will → would; tomorrow → the next day।' },
    { p:'Indirect: He said, "Where do you live?"', o:['He asked where I lived.','He asked where do I live.','He said where I live.','He asked where did I live.'], a:'He asked where I lived.', e:'Wh-question → statement.', b:'Wh-question → statement।' },
    { p:'Indirect: She said, "I like tea."', o:['She said that she liked tea.','She said that she likes tea.','She said that I like tea.','She says she liked tea.'], a:'She said that she liked tea.', e:'Present → past.', b:'Present → past।' },
    { p:'Indirect: He said, "I am going home."', o:['He said that he was going home.','He said that he is going home.','He said that I am going home.','He said he goes home.'], a:'He said that he was going home.', e:'Present continuous → past continuous.', b:'Present continuous → past continuous।' },
    { p:'Indirect: She said, "Did you see him?"', o:['She asked if I had seen him.','She asked if I saw him.','She asked did I see him.','She said if I had seen him.'], a:'She asked if I had seen him.', e:'Yes/no → if/whether.', b:'Yes/no → if/whether।' },
    { p:'Indirect: He said, "I will help you."', o:['He said that he would help me.','He said that he will help me.','He said that he helps me.','He says he will help me.'], a:'He said that he would help me.', e:'Will → would; you → me.', b:'Will → would; you → me।' },
    { p:'Indirect: She said, "I have finished."', o:['She said that she had finished.','She said that she has finished.','She said that she finishes.','She says she finished.'], a:'She said that she had finished.', e:'Present perfect → past perfect.', b:'Present perfect → past perfect।' },
    { p:'Indirect: He said, "Can you help me?"', o:['He asked if I could help him.','He asked can I help him.','He asked if I can help him.','He said if I could help him.'], a:'He asked if I could help him.', e:'Can → could; you → I; me → him.', b:'Can → could; you → I; me → him।' },
    { p:'Indirect: She said, "I am busy now."', o:['She said that she was busy then.','She said that she is busy now.','She said that she was busy now.','She said that I was busy then.'], a:'She said that she was busy then.', e:'Now → then.', b:'Now → then।' },
    { p:'Indirect: "I am reading," he said.', o:['He said that he was reading.','He said that he is reading.','He said that I was reading.','He says he is reading.'], a:'He said that he was reading.', e:'Present continuous → past continuous.', b:'Present continuous → past continuous।' },
    { p:'Indirect: "I will come," she said.', o:['She said she would come.','She said she will come.','She said she came.','She says she would come.'], a:'She said she would come.', e:'Will → would.', b:'Will → would।' },
    { p:'Indirect: "I went to the market," he said.', o:['He said he had gone to the market.','He said he went to the market.','He said he goes to the market.','He says he went to the market.'], a:'He said he had gone to the market.', e:'Past → past perfect.', b:'Past → past perfect।' },
    { p:'Indirect: "Can you help me?" she asked.', o:['She asked if I could help her.','She asked if I can help her.','She asked can I help her.','She said if I could help her.'], a:'She asked if I could help her.', e:'Can → could.', b:'Can → could।' },
    { p:'Indirect: "Where is the station?" he asked.', o:['He asked where the station was.','He asked where is the station.','He asked where the station is.','He said where the station was.'], a:'He asked where the station was.', e:'Reported question in statement order.', b:'Reported question statement order এ।' },
    { p:'Indirect: "I have finished," she said.', o:['She said she had finished.','She said she has finished.','She said she finished.','She said she finishes.'], a:'She said she had finished.', e:'Present perfect → past perfect.', b:'Present perfect → past perfect।' },
    { p:'Indirect: "I saw him yesterday," he said.', o:['He said he had seen him the day before.','He said he saw him yesterday.','He said he had seen him yesterday.','He says he saw him yesterday.'], a:'He said he had seen him the day before.', e:'Past → past perfect; yesterday → the day before.', b:'Past → past perfect; yesterday → the day before।' },
    { p:'Indirect: "We are going to the beach tomorrow," they said.', o:['They said they were going to the beach the next day.','They said they are going to the beach tomorrow.','They said they were going to the beach tomorrow.','They say they are going to the beach tomorrow.'], a:'They said they were going to the beach the next day.', e:'Continuous + time shift.', b:'Continuous + সময় পরিবর্তন।' },
    { p:'Indirect: "I love you," he said.', o:['He said he loved her.','He said he loves her.','He said I loved her.','He said he loved you.'], a:'He said he loved her.', e:'Tense and pronoun change.', b:'Tense ও pronoun পরিবর্তন।' },
    { p:'Indirect: "Please help me," she said.', o:['She asked me to help her.','She said please help me.','She asked me help her.','She said to help her.'], a:'She asked me to help her.', e:'Imperative → asked + to.', b:'Imperative → asked + to।' },
    { p:'Indirect: "Do not touch the wires," he said.', o:['He told us not to touch the wires.','He said do not touch the wires.','He told us to not touch the wires.','He said us not to touch the wires.'], a:'He told us not to touch the wires.', e:'Negative imperative → told + not to.', b:'Negative imperative → told + not to।' },
    { p:'Indirect: "I will call you tomorrow," she said.', o:['She said she would call me the next day.','She said she will call me tomorrow.','She said she would call me tomorrow.','She says she will call me tomorrow.'], a:'She said she would call me the next day.', e:'Will → would; tomorrow → next day.', b:'Will → would; tomorrow → next day।' },
    { p:'Indirect: "Open the door," he said.', o:['He ordered to open the door.','He ordered me to open the door.','He said open the door.','He told open the door.'], a:'He ordered me to open the door.', e:'Command → ordered + object + to.', b:'Command → ordered + object + to।' },
    { p:'Indirect: "What a beautiful day!" she said.', o:['She exclaimed that it was a beautiful day.','She said what a beautiful day.','She exclaimed what a beautiful day.','She said it is beautiful.'], a:'She exclaimed that it was a beautiful day.', e:'Exclamation → exclaimed that…', b:'Exclamation → exclaimed that…' },
    { p:'Indirect: "Let us go out," he said.', o:['He proposed that they should go out.','He said let us go out.','He told us go out.','He proposed to go out.'], a:'He proposed that they should go out.', e:'"Let us" → proposed/suggested.', b:'"Let us" → proposed/suggested।' },
    { p:'Indirect: "How old are you?" she asked.', o:['She asked how old I was.','She asked how old am I.','She asked how old are you.','She said how old I was.'], a:'She asked how old I was.', e:'Wh-question → statement.', b:'Wh-question → statement।' },
    { p:'Indirect: "I am sorry," he said.', o:['He said that he was sorry.','He said that I am sorry.','He said that he is sorry.','He says he is sorry.'], a:'He said that he was sorry.', e:'Present → past.', b:'Present → past।' },
    { p:'Indirect: "I will do it myself," she said.', o:['She said that she would do it herself.','She said that she will do it herself.','She said she does it herself.','She says she will do it herself.'], a:'She said that she would do it herself.', e:'Will → would; myself → herself.', b:'Will → would; myself → herself।' },
    { p:'Indirect: "Good morning," he said.', o:['He wished me a good morning.','He said good morning.','He told good morning.','He greeted good morning.'], a:'He wished me a good morning.', e:'Greeting → wished.', b:'Greeting → wished।' },
    { p:'Indirect: "Thank you," she said.', o:['She thanked me.','She said thank you.','She told thank you.','She thanked you.'], a:'She thanked me.', e:'Thanks → thanked + object.', b:'Thanks → thanked + object।' },
  ]},
  transformation: { name: 'Transformation', icon: 'target', questions: [
    { p:'"Very few boys are as good as he." → Comparative:', o:['He is better than most other boys.','He is as good as others.','He is the best boy.','He is very good.'], a:'He is better than most other boys.', e:'Very few…as → comparative "better than most".', b:'Very few…as → comparative "better than most"।' },
    { p:'"No other boy is as tall as he." → Superlative:', o:['He is the tallest boy.','He is very tall.','He is taller than others.','He is as tall as others.'], a:'He is the tallest boy.', e:'No other…as → superlative.', b:'No other…as → superlative।' },
    { p:'"He is too weak to walk." → Complex:', o:['He is so weak that he cannot walk.','He is so weak that he can walk.','He is weak but he walks.','He is very weak and walks.'], a:'He is so weak that he cannot walk.', e:'Too…to → so…that…not.', b:'Too…to → so…that…not।' },
    { p:'"He is so weak that he cannot walk." → Simple:', o:['He is too weak to walk.','He is too weak not to walk.','He cannot walk.','He is weak walking.'], a:'He is too weak to walk.', e:'So…that → too…to.', b:'So…that → too…to।' },
    { p:'"He came and I went." → Complex:', o:['When he came, I went.','Because he came, I went.','If he came, I went.','As he came, I went.'], a:'When he came, I went.', e:'Sequence → when-clause.', b:'ক্রম → when-clause।' },
    { p:'"I know his name." → Complex:', o:['I know what his name is.','I know what is his name.','I know his name is.','I know that his name.'], a:'I know what his name is.', e:'Name → what-clause.', b:'Name → what-clause।' },
    { p:'"On seeing the police, he ran." → Complex:', o:['When he saw the police, he ran.','Because he saw the police.','If he saw the police.','As soon as the police.'], a:'When he saw the police, he ran.', e:'On + gerund → when-clause.', b:'On + gerund → when-clause।' },
    { p:'"I have no money." → Complex:', o:['I have nothing that can be called money.','I have not money.','I am without money.','I am poor.'], a:'I have nothing that can be called money.', e:'Possessive → relative clause.', b:'Possessive → relative clause।' },
    { p:'"Do or die." → Complex:', o:['If you do not do, you will die.','If you do, you will die.','Either do or die.','Do and die.'], a:'If you do not do, you will die.', e:'Imperative → conditional.', b:'Imperative → conditional।' },
    { p:'"The man is my uncle. He is tall." → Complex:', o:['The man who is tall is my uncle.','The man is my uncle and tall.','The man is tall, my uncle.','The tall man my uncle.'], a:'The man who is tall is my uncle.', e:'Relative clause joining.', b:'Relative clause দিয়ে যুক্ত।' },
    { p:'"He is poor but honest." → Complex:', o:['Though he is poor, he is honest.','Because he is poor, he is honest.','He is poor and honest.','If he is poor, he is honest.'], a:'Though he is poor, he is honest.', e:'"But" → "Though".', b:'"But" → "Though"।' },
    { p:'"In spite of being rich, he is unhappy." → Complex:', o:['Although he is rich, he is unhappy.','Because he is rich, he is unhappy.','He is rich and unhappy.','If he is rich, he is unhappy.'], a:'Although he is rich, he is unhappy.', e:'In spite of → Although.', b:'In spite of → Although।' },
    { p:'"I do not know the reason of his absence." → Complex:', o:['I do not know why he is absent.','I do not know his absence.','I do not know reason.','I do not know he is absent.'], a:'I do not know why he is absent.', e:'Reason → why-clause.', b:'কারণ → why-clause।' },
    { p:'"He finished the work and went out." → Complex:', o:['After he had finished the work, he went out.','Before he finished the work, he went out.','When he finished the work, he goes out.','If he finished, he went out.'], a:'After he had finished the work, he went out.', e:'Sequence with past perfect.', b:'Past perfect সহ ক্রম।' },
    { p:'"This is the place of my birth." → Complex:', o:['This is the place where I was born.','This is the place of my birth.','This is the birth place.','This is my birth.'], a:'This is the place where I was born.', e:'Place → where-clause.', b:'স্থান → where-clause।' },
    { p:'"What is done cannot be undone." → Simple:', o:['Done work cannot be undone.','What is not done cannot be undone.','Nothing can be done.','Undone is not done.'], a:'Done work cannot be undone.', e:'Reduced clause.', b:'Clause সংক্ষিপ্ত।' },
    { p:'"He is very old, yet he works hard." → Complex:', o:['Though he is very old, he works hard.','Because he is old, he works hard.','He is old and works hard.','If old, he works hard.'], a:'Though he is very old, he works hard.', e:'"Yet" → "Though".', b:'"Yet" → "Though"।' },
    { p:'"The news is too good to be true." → Complex:', o:['The news is so good that it cannot be true.','The news is so good that it can be true.','The news is good and true.','The news is good to be true.'], a:'The news is so good that it cannot be true.', e:'Too…to → so…that…not.', b:'Too…to → so…that…not।' },
    { p:'"I am certain of his success." → Complex:', o:['I am certain that he will succeed.','I am certain he succeeds.','I am certain he is succeed.','I am certain his success.'], a:'I am certain that he will succeed.', e:'"Certain of" → "certain that".', b:'"Certain of" → "certain that"।' },
    { p:'"Nobody can do this." → Interrogative:', o:['Who can do this?','Who cannot do this?','Can anybody do this?','Can nobody do this?'], a:'Who can do this?', e:'Negative → rhetorical question.', b:'Negative → rhetorical question।' },
    { p:'"He is a good singer." → Exclamatory:', o:['What a good singer he is!','How good singer he is!','What he is a good singer!','How a good singer!'], a:'What a good singer he is!', e:'"What a" + noun phrase.', b:'"What a" + noun phrase।' },
    { p:'"How beautiful the flower is!" → Assertive:', o:['The flower is very beautiful.','The flower is a beauty.','The flower beautiful is.','The flower is beautiful.'], a:'The flower is very beautiful.', e:'Exclamatory → assertive with "very".', b:'Exclamatory → assertive, "very" সহ।' },
    { p:'"He is not a fool." → Affirmative:', o:['He is wise.','He is a fool.','He is cleverness.','He is not wise.'], a:'He is wise.', e:'Double negative → affirmative.', b:'Double negative → affirmative।' },
    { p:'"As soon as he came, we left." → Negative:', o:['No sooner had he come than we left.','No sooner he came than we left.','No sooner did he came.','No sooner he had come.'], a:'No sooner had he come than we left.', e:'"As soon as" → "No sooner…than".', b:'"As soon as" → "No sooner…than"।' },
    { p:'"He is honest but poor." → Complex:', o:['Though he is honest, he is poor.','Because he is honest, he is poor.','He is honest and poor.','If he is honest, he is poor.'], a:'Though he is honest, he is poor.', e:'"But" → "Though".', b:'"But" → "Though"।' },
    { p:'"I was born in a village." → Complex:', o:['The village where I was born is small.','The village I was born.','The village of birth.','The village I born.'], a:'The village where I was born is small.', e:'Relative clause with "where".', b:'"Where" সহ relative clause।' },
    { p:'"He works hard so that he can succeed." → Simple:', o:['He works hard to succeed.','He works hard succeed.','He works hard for succeed.','He works hard so succeed.'], a:'He works hard to succeed.', e:'"So that" → infinitive of purpose.', b:'"So that" → উদ্দেশ্যের infinitive।' },
    { p:'"I went there to see him." → Complex:', o:['I went there so that I could see him.','I went there because I see him.','I went there if I see him.','I went there when I see him.'], a:'I went there so that I could see him.', e:'Infinitive of purpose → so that.', b:'উদ্দেশ্যের infinitive → so that।' },
    { p:'"He is the best boy in the class." → Comparative:', o:['He is better than any other boy in the class.','He is better than every boy.','He is better than most boys.','He is best than others.'], a:'He is better than any other boy in the class.', e:'Superlative → comparative.', b:'Superlative → comparative।' },
    { p:'"I saw him. He was playing." → Simple:', o:['I saw him playing.','I saw him play.','I saw playing him.','I saw he playing.'], a:'I saw him playing.', e:'Perception verb + object + participle.', b:'Perception verb + object + participle।' },
  ]},
  synonyms: { name: 'Synonyms', icon: 'book', questions: [
    { p:'Synonym of "abandon"?', o:['forsake','keep','adopt','hold'], a:'forsake', e:'Abandon = forsake, desert.', b:'Abandon = ত্যাগ করা।' },
    { p:'Synonym of "happy"?', o:['joyful','sad','angry','tired'], a:'joyful', e:'Happy = joyful.', b:'Happy = আনন্দিত।' },
    { p:'Synonym of "big"?', o:['huge','small','tiny','thin'], a:'huge', e:'Big = huge, large.', b:'Big = বিশাল।' },
    { p:'Synonym of "brave"?', o:['courageous','coward','weak','timid'], a:'courageous', e:'Brave = courageous.', b:'Brave = সাহসী।' },
    { p:'Synonym of "quick"?', o:['rapid','slow','lazy','dull'], a:'rapid', e:'Quick = rapid, fast.', b:'Quick = দ্রুত।' },
    { p:'Synonym of "start"?', o:['begin','stop','end','halt'], a:'begin', e:'Start = begin.', b:'Start = শুরু করা।' },
    { p:'Synonym of "beautiful"?', o:['lovely','ugly','plain','dull'], a:'lovely', e:'Beautiful = lovely, pretty.', b:'Beautiful = সুন্দর।' },
    { p:'Synonym of "angry"?', o:['furious','calm','happy','glad'], a:'furious', e:'Angry = furious.', b:'Angry = রাগান্বিত।' },
    { p:'Synonym of "smart"?', o:['clever','dull','stupid','slow'], a:'clever', e:'Smart = clever, intelligent.', b:'Smart = চতুর।' },
    { p:'Synonym of "rich"?', o:['wealthy','poor','needy','broke'], a:'wealthy', e:'Rich = wealthy.', b:'Rich = ধনী।' },
    { p:'Synonym of "help"?', o:['assist','hinder','block','stop'], a:'assist', e:'Help = assist, aid.', b:'Help = সাহায্য করা।' },
    { p:'Synonym of "begin"?', o:['commence','finish','end','cease'], a:'commence', e:'Begin = commence.', b:'Begin = শুরু করা।' },
    { p:'Synonym of "end"?', o:['conclude','begin','start','open'], a:'conclude', e:'End = conclude, finish.', b:'End = শেষ করা।' },
    { p:'Synonym of "buy"?', o:['purchase','sell','trade','give'], a:'purchase', e:'Buy = purchase.', b:'Buy = ক্রয় করা।' },
    { p:'Synonym of "show"?', o:['display','hide','conceal','cover'], a:'display', e:'Show = display, exhibit.', b:'Show = দেখানো।' },
    { p:'Synonym of "small"?', o:['tiny','huge','large','giant'], a:'tiny', e:'Small = tiny, little.', b:'Small = ছোট।' },
    { p:'Synonym of "difficult"?', o:['hard','easy','simple','plain'], a:'hard', e:'Difficult = hard, tough.', b:'Difficult = কঠিন।' },
    { p:'Synonym of "important"?', o:['significant','trivial','minor','small'], a:'significant', e:'Important = significant.', b:'Important = গুরুত্বপূর্ণ।' },
    { p:'Synonym of "famous"?', o:['renowned','unknown','obscure','ordinary'], a:'renowned', e:'Famous = renowned.', b:'Famous = বিখ্যাত।' },
    { p:'Synonym of "increase"?', o:['augment','reduce','decrease','lessen'], a:'augment', e:'Increase = augment.', b:'Increase = বাড়ানো।' },
    { p:'Synonym of "decrease"?', o:['diminish','increase','grow','rise'], a:'diminish', e:'Decrease = diminish.', b:'Decrease = কমা।' },
    { p:'Synonym of "praise"?', o:['applaud','criticize','blame','scold'], a:'applaud', e:'Praise = applaud.', b:'Praise = প্রশংসা করা।' },
    { p:'Synonym of "criticize"?', o:['condemn','praise','applaud','laud'], a:'condemn', e:'Criticize = condemn.', b:'Criticize = নিন্দা করা।' },
    { p:'Synonym of "kind"?', o:['benevolent','cruel','harsh','mean'], a:'benevolent', e:'Kind = benevolent.', b:'Kind = দয়ালু।' },
    { p:'Synonym of "cruel"?', o:['brutal','kind','gentle','soft'], a:'brutal', e:'Cruel = brutal.', b:'Cruel = নিষ্ঠুর।' },
    { p:'Synonym of "clever"?', o:['ingenious','foolish','stupid','dull'], a:'ingenious', e:'Clever = ingenious.', b:'Clever = চতুর।' },
    { p:'Synonym of "sad"?', o:['melancholy','happy','joyful','cheerful'], a:'melancholy', e:'Sad = melancholy.', b:'Sad = দুঃখিত।' },
    { p:'Synonym of "strong"?', o:['robust','weak','frail','feeble'], a:'robust', e:'Strong = robust.', b:'Strong = শক্তিশালী।' },
    { p:'Synonym of "tired"?', o:['exhausted','fresh','energetic','lively'], a:'exhausted', e:'Tired = exhausted.', b:'Tired = ক্লান্ত।' },
    { p:'Synonym of "dangerous"?', o:['perilous','safe','harmless','secure'], a:'perilous', e:'Dangerous = perilous.', b:'Dangerous = বিপজ্জনক।' },
  ]},
  antonyms: { name: 'Antonyms', icon: 'flag', questions: [
    { p:'Antonym of "brave"?', o:['cowardly','courageous','bold','valiant'], a:'cowardly', e:'Opposite of brave → cowardly.', b:'Brave এর বিপরীত → cowardly।' },
    { p:'Antonym of "happy"?', o:['sad','joyful','cheerful','glad'], a:'sad', e:'Opposite of happy → sad.', b:'Happy এর বিপরীত → sad।' },
    { p:'Antonym of "big"?', o:['small','huge','large','giant'], a:'small', e:'Opposite of big → small.', b:'Big এর বিপরীত → small।' },
    { p:'Antonym of "hot"?', o:['cold','warm','boiling','heated'], a:'cold', e:'Opposite of hot → cold.', b:'Hot এর বিপরীত → cold।' },
    { p:'Antonym of "fast"?', o:['slow','quick','rapid','swift'], a:'slow', e:'Opposite of fast → slow.', b:'Fast এর বিপরীত → slow।' },
    { p:'Antonym of "rich"?', o:['poor','wealthy','affluent','prosperous'], a:'poor', e:'Opposite of rich → poor.', b:'Rich এর বিপরীত → poor।' },
    { p:'Antonym of "begin"?', o:['end','start','open','commence'], a:'end', e:'Opposite of begin → end.', b:'Begin এর বিপরীত → end।' },
    { p:'Antonym of "day"?', o:['night','morning','noon','dawn'], a:'night', e:'Opposite of day → night.', b:'Day এর বিপরীত → night।' },
    { p:'Antonym of "love"?', o:['hate','adore','like','cherish'], a:'hate', e:'Opposite of love → hate.', b:'Love এর বিপরীত → hate।' },
    { p:'Antonym of "strong"?', o:['weak','robust','powerful','sturdy'], a:'weak', e:'Opposite of strong → weak.', b:'Strong এর বিপরীত → weak।' },
    { p:'Antonym of "light"?', o:['dark','bright','luminous','radiant'], a:'dark', e:'Opposite of light → dark.', b:'Light এর বিপরীত → dark।' },
    { p:'Antonym of "true"?', o:['false','correct','accurate','right'], a:'false', e:'Opposite of true → false.', b:'True এর বিপরীত → false।' },
    { p:'Antonym of "give"?', o:['take','offer','donate','grant'], a:'take', e:'Opposite of give → take.', b:'Give এর বিপরীত → take।' },
    { p:'Antonym of "open"?', o:['close','unlock','unfold','spread'], a:'close', e:'Opposite of open → close.', b:'Open এর বিপরীত → close।' },
    { p:'Antonym of "up"?', o:['down','above','higher','top'], a:'down', e:'Opposite of up → down.', b:'Up এর বিপরীত → down।' },
    { p:'Antonym of "old"?', o:['new','ancient','aged','elderly'], a:'new', e:'Opposite of old → new.', b:'Old এর বিপরীত → new।' },
    { p:'Antonym of "soft"?', o:['hard','tender','smooth','gentle'], a:'hard', e:'Opposite of soft → hard.', b:'Soft এর বিপরীত → hard।' },
    { p:'Antonym of "positive"?', o:['negative','optimistic','hopeful','confident'], a:'negative', e:'Opposite of positive → negative.', b:'Positive এর বিপরীত → negative।' },
    { p:'Antonym of "accept"?', o:['reject','agree','approve','admit'], a:'reject', e:'Opposite of accept → reject.', b:'Accept এর বিপরীত → reject।' },
    { p:'Antonym of "above"?', o:['below','over','higher','upper'], a:'below', e:'Opposite of above → below.', b:'Above এর বিপরীত → below।' },
    { p:'Antonym of "before"?', o:['after','prior','earlier','previously'], a:'after', e:'Opposite of before → after.', b:'Before এর বিপরীত → after।' },
    { p:'Antonym of "distant"?', o:['near','far','remote','faraway'], a:'near', e:'Opposite of distant → near.', b:'Distant এর বিপরীত → near।' },
    { p:'Antonym of "build"?', o:['destroy','construct','erect','create'], a:'destroy', e:'Opposite of build → destroy.', b:'Build এর বিপরীত → destroy।' },
    { p:'Antonym of "win"?', o:['lose','triumph','succeed','conquer'], a:'lose', e:'Opposite of win → lose.', b:'Win এর বিপরীত → lose।' },
    { p:'Antonym of "arrive"?', o:['depart','reach','come','land'], a:'depart', e:'Opposite of arrive → depart.', b:'Arrive এর বিপরীত → depart।' },
    { p:'Antonym of "praise"?', o:['blame','applaud','laud','commend'], a:'blame', e:'Opposite of praise → blame.', b:'Praise এর বিপরীত → blame।' },
    { p:'Antonym of "remember"?', o:['forget','recall','recollect','memorize'], a:'forget', e:'Opposite of remember → forget.', b:'Remember এর বিপরীত → forget।' },
    { p:'Antonym of "construct"?', o:['demolish','build','create','make'], a:'demolish', e:'Opposite of construct → demolish.', b:'Construct এর বিপরীত → demolish।' },
    { p:'Antonym of "increase"?', o:['decrease','raise','grow','expand'], a:'decrease', e:'Opposite of increase → decrease.', b:'Increase এর বিপরীত → decrease।' },
    { p:'Antonym of "polite"?', o:['rude','courteous','kind','courteous'], a:'rude', e:'Opposite of polite → rude.', b:'Polite এর বিপরীত → rude।' },
  ]},
  punctuation: { name: 'Punctuation', icon: 'grid', questions: [
    { p:'Which is correct?', o:['I bought apples, bananas, and oranges.','I bought apples bananas and oranges.','I bought apples, bananas and oranges.','I bought, apples, bananas, and oranges.'], a:'I bought apples, bananas, and oranges.', e:'Oxford comma in list.', b:'তালিকায় Oxford comma।' },
    { p:'Which is correct?', o:['It’s raining.','Its raining.','Its’ raining.','It is’ raining.'], a:'It’s raining.', e:'It’s = it is.', b:'It’s = it is।' },
    { p:'Which is correct?', o:['Rina’s book.','Rinas book.','Rinas’ book.','Rina book.'], a:'Rina’s book.', e:'Singular possessive ’s.', b:'একবচন possessive ’s।' },
    { p:'Which is correct?', o:['She said, "I am tired."','She said "I am tired".','She said: I am tired.','She said, I am tired.'], a:'She said, "I am tired."', e:'Direct speech uses comma and quotes.', b:'Direct speech এ কমা ও quotation।' },
    { p:'Which is correct?', o:['Their car is red.','There car is red.','They’re car is red.','Theyr car is red.'], a:'Their car is red.', e:'Possessive "their".', b:'Possessive "their"।' },
    { p:'Which is correct?', o:['Who’s coming to dinner?','Whose coming to dinner?','Whos coming to dinner?','Whose’s coming to dinner?'], a:'Who’s coming to dinner?', e:'"Who’s" = who is.', b:'"Who’s" = who is।' },
    { p:'Which is correct?', o:['Its tail is long.','It’s tail is long.','Its’ tail is long.','It is tail is long.'], a:'Its tail is long.', e:'"Its" possessive.', b:'"Its" possessive।' },
    { p:'Which is correct?', o:['I have fewer books than him.','I have less books than him.','I have little books than him.','I have few books than him.'], a:'I have fewer books than him.', e:'"Fewer" for countable.', b:'গণনাযোগ্য → "fewer"।' },
    { p:'Which is correct?', o:['He is taller than me.','He is taller then me.','He is taller that me.','He is tall then me.'], a:'He is taller than me.', e:'"Than" for comparison.', b:'তুলনায় "than"।' },
    { p:'Which is correct?', o:['I, too, like coffee.','I too like coffee.','I to like coffee.','I, to, like coffee.'], a:'I, too, like coffee.', e:'"Too" set off by commas.', b:'"Too" কমা দিয়ে ঘেরা।' },
    { p:'Which is correct?', o:['Let’s go.','Lets go.','Let’s’s go.','Lets’ go.'], a:'Let’s go.', e:'Let’s = let us.', b:'Let’s = let us।' },
    { p:'Which is correct?', o:['The boys’ books.','The boys’s books.','The boy’s books are many.'], a:'The boys’ books.', e:'Plural ending -s → s’.', b:'বহুবচন -s → s’।' },
    { p:'Which is correct?', o:['We’re going home.','Were going home.','We’re’ going home.'], a:'We’re going home.', e:'We’re = we are.', b:'We’re = we are।' },
    { p:'Which is correct?', o:['You’re welcome.','Your welcome.','Youre welcome.'], a:'You’re welcome.', e:'You’re = you are.', b:'You’re = you are।' },
    { p:'Which is correct?', o:['He doesn’t know.','He don’t know.','He dont know.'], a:'He doesn’t know.', e:'Third person → doesn’t.', b:'তৃতীয় পুরুষ → doesn’t।' },
    { p:'Which is correct?', o:['I can’t do it.','I cant do it.','I cann’t do it.'], a:'I can’t do it.', e:'Can’t = cannot.', b:'Can’t = cannot।' },
    { p:'Which is correct?', o:['It’s been a long day.','Its been a long day.','Its’ been a long day.'], a:'It’s been a long day.', e:'It’s = it has.', b:'It’s = it has।' },
    { p:'Which is correct?', o:['The children’s toys.','The childrens toys.','The childrens’ toys.'], a:'The children’s toys.', e:'Irregular plural → ’s.', b:'Irregular plural → ’s।' },
    { p:'Which is correct?', o:['Rina and I went.','Rina and me went.','Me and Rina went.'], a:'Rina and I went.', e:'Subject pronoun "I".', b:'Subject pronoun "I"।' },
    { p:'Which is correct?', o:['Between you and me.','Between you and I.','Between we two.'], a:'Between you and me.', e:'Object pronoun after preposition.', b:'Preposition এর পরে object pronoun।' },
    { p:'Which is correct?', o:['She is taller than I am.','She is taller than me are.','She is taller than I is.'], a:'She is taller than I am.', e:'Full clause "than I am".', b:'সম্পূর্ণ clause "than I am"।' },
    { p:'Which is correct?', o:['Its fur is soft.','It’s fur is soft.','Its’ fur is soft.'], a:'Its fur is soft.', e:'Possessive "its".', b:'Possessive "its"।' },
    { p:'Which is correct?', o:['They’re late.','There late.','Their late.'], a:'They’re late.', e:'They’re = they are.', b:'They’re = they are।' },
    { p:'Which is correct?', o:['Whose book is this?','Who’s book is this?','Whos book is this?'], a:'Whose book is this?', e:'"Whose" possessive.', b:'"Whose" possessive।' },
    { p:'Which is correct?', o:['I’d like tea.','Id like tea.','I’ld like tea.'], a:'I’d like tea.', e:'I’d = I would.', b:'I’d = I would।' },
    { p:'Which is correct?', o:['Well, I think so.','Well I think so.','Well, I, think so.'], a:'Well, I think so.', e:'Comma after introductory word.', b:'Introductory word এর পরে কমা।' },
    { p:'Which is correct?', o:['After dinner, we walked.','After dinner we walked,','After, dinner we walked.'], a:'After dinner, we walked.', e:'Comma after introductory phrase.', b:'Introductory phrase এর পরে কমা।' },
    { p:'Which is correct?', o:['He said, "Yes."','He said "Yes".','He said: "Yes"'], a:'He said, "Yes."', e:'Direct speech punctuation.', b:'Direct speech punctuation।' },
    { p:'Which is correct?', o:['Hello! How are you?','Hello, how are you.','Hello how are you?'], a:'Hello! How are you?', e:'Exclamation and question marks.', b:'বিস্ময় ও প্রশ্নবোধক চিহ্ন।' },
    { p:'Which is correct?', o:['My father’s car.','My fathers car.','My fathers’ car.'], a:'My father’s car.', e:'Singular possessive.', b:'একবচন possessive।' },
  ]},
  gapClue: { name: 'Gap Filling (with clues)', icon: 'book', questions: [
    { p:'She is ___ (honest) student.', o:['a','an','the','—'], a:'an', e:'Vowel sound → "an".', b:'Vowel sound → "an"।' },
    { p:'He ___ (go) to school every day.', o:['go','goes','going','gone'], a:'goes', e:'Third person singular -s.', b:'তৃতীয় পুরুষ একবচনে -s।' },
    { p:'They ___ (play) football yesterday.', o:['play','plays','played','playing'], a:'played', e:'Past simple.', b:'Past simple।' },
    { p:'I have ___ (finish) my homework.', o:['finish','finishes','finished','finishing'], a:'finished', e:'Have + past participle.', b:'Have + past participle।' },
    { p:'The sun ___ (rise) in the east.', o:['rise','rises','rising','rose'], a:'rises', e:'Universal truth.', b:'সর্বজনীন সত্য।' },
    { p:'He was ___ (watch) TV when I called.', o:['watch','watches','watched','watching'], a:'watching', e:'Past continuous.', b:'Past continuous।' },
    { p:'She is ___ (beauty).', o:['beauty','beautiful','beautifully','beautify'], a:'beautiful', e:'Adjective after linking verb.', b:'Linking verb এর পরে adjective।' },
    { p:'He speaks English ___ (fluent).', o:['fluent','fluently','fluency','fluentness'], a:'fluently', e:'Adverb modifies verb.', b:'Adverb verb modify করে।' },
    { p:'The ___ (child) are playing.', o:['child','childs','children','childrens'], a:'children', e:'Irregular plural.', b:'Irregular plural।' },
    { p:'He is ___ (strong) than his brother.', o:['strong','stronger','strongest','more strong'], a:'stronger', e:'Comparative -er.', b:'Comparative -er।' },
    { p:'This is the ___ (good) film I have seen.', o:['good','better','best','more good'], a:'best', e:'Superlative.', b:'Superlative।' },
    { p:'She has ___ (write) three books.', o:['write','writes','wrote','written'], a:'written', e:'Has + past participle.', b:'Has + past participle।' },
    { p:'If it ___ (rain), we will stay home.', o:['rain','rains','rained','raining'], a:'rains', e:'First conditional.', b:'First conditional।' },
    { p:'He ___ (go) to London last year.', o:['go','goes','went','gone'], a:'went', e:'Past simple.', b:'Past simple।' },
    { p:'The book ___ (write) by Rina.', o:['write','wrote','was written','is writing'], a:'was written', e:'Passive voice.', b:'Passive voice।' },
    { p:'She has been ___ (study) for hours.', o:['study','studies','studied','studying'], a:'studying', e:'Perfect continuous.', b:'Perfect continuous।' },
    { p:'We ___ (live) here since 2015.', o:['live','lives','lived','have lived'], a:'have lived', e:'Present perfect with since.', b:'"Since" সহ present perfect।' },
    { p:'He is ___ (interest) in music.', o:['interest','interesting','interested','interests'], a:'interested', e:'Adjective with "in".', b:'"In" সহ adjective।' },
    { p:'This is a ___ (use) book.', o:['use','useful','useless','usefully'], a:'useful', e:'Adjective.', b:'Adjective।' },
    { p:'She sings ___ (beauty).', o:['beauty','beautiful','beautifully','beautify'], a:'beautifully', e:'Adverb.', b:'Adverb।' },
    { p:'He ___ (not finish) the work yet.', o:['not finish','did not finish','has not finished','not finished'], a:'has not finished', e:'Yet + present perfect.', b:'"Yet" + present perfect।' },
    { p:'It ___ (rain) since morning.', o:['rain','rains','has been raining','rained'], a:'has been raining', e:'Perfect continuous.', b:'Perfect continuous।' },
    { p:'If I ___ (be) you, I would apologize.', o:['am','was','were','be'], a:'were', e:'Second conditional.', b:'Second conditional।' },
    { p:'She wants ___ (become) a doctor.', o:['become','becomes','to become','becoming'], a:'to become', e:'"Want to" + base.', b:'"Want to" + base।' },
    { p:'He is good at ___ (sing).', o:['sing','sings','singing','sang'], a:'singing', e:'"Good at" + gerund.', b:'"Good at" + gerund।' },
    { p:'He suggested ___ (go) for a walk.', o:['go','goes','going','went'], a:'going', e:'"Suggest" + gerund.', b:'"Suggest" + gerund।' },
    { p:'I look forward to ___ (meet) you.', o:['meet','meets','meeting','met'], a:'meeting', e:'"Look forward to" + gerund.', b:'"Look forward to" + gerund।' },
    { p:'The ___ (inform) you gave was helpful.', o:['inform','informs','information','informing'], a:'information', e:'Noun form.', b:'Noun form।' },
    { p:'He is ___ (success) in business.', o:['success','successful','successfully','succeed'], a:'successful', e:'Adjective.', b:'Adjective।' },
    { p:'She dances ___ (grace).', o:['grace','graceful','gracefully','gracefulness'], a:'gracefully', e:'Adverb.', b:'Adverb।' },
  ]},
  gapNoClue: { name: 'Gap Filling (no clues)', icon: 'flag', questions: [
    { p:'He is ___ honest man.', o:['a','an','the','—'], a:'an', e:'Vowel sound → "an".', b:'Vowel sound → "an"।' },
    { p:'I met him ___ Friday.', o:['in','on','at','by'], a:'on', e:'Days → "on".', b:'দিন → "on"।' },
    { p:'She has been living here ___ 2010.', o:['from','since','for','at'], a:'since', e:'"Since" + starting point.', b:'"Since" + শুরুর সময়।' },
    { p:'I have known him ___ ten years.', o:['since','for','in','at'], a:'for', e:'"For" + duration.', b:'"For" + ব্যাপ্তি।' },
    { p:'He is ___ MBA.', o:['a','an','the','—'], a:'an', e:'"Em" sound.', b:'"Em" ধ্বনি।' },
    { p:'The Padma is ___ longest river.', o:['a','an','the','—'], a:'the', e:'Superlative.', b:'Superlative।' },
    { p:'He is good ___ English.', o:['in','at','on','for'], a:'at', e:'"Good at" fixed.', b:'"Good at" fixed।' },
    { p:'We waited ___ the bus.', o:['on','for','to','at'], a:'for', e:'"Wait for".', b:'"Wait for"।' },
    { p:'She is afraid ___ dogs.', o:['at','of','in','on'], a:'of', e:'"Afraid of".', b:'"Afraid of"।' },
    { p:'They arrived ___ Dhaka yesterday.', o:['at','in','on','to'], a:'in', e:'Cities → "in".', b:'শহর → "in"।' },
    { p:'I will meet you ___ 5 PM.', o:['in','on','at','by'], a:'at', e:'Clock time → "at".', b:'ঘড়ির সময় → "at"।' },
    { p:'He is ___ best student.', o:['a','an','the','—'], a:'the', e:'Superlative.', b:'Superlative।' },
    { p:'I like ___ music.', o:['a','an','the','—'], a:'—', e:'General.', b:'সাধারণ।' },
    { p:'She plays ___ piano.', o:['a','an','the','—'], a:'the', e:'Instruments → "the".', b:'বাদ্যযন্ত্র → "the"।' },
    { p:'I need ___ hour.', o:['a','an','the','—'], a:'an', e:'Silent h.', b:'Silent h।' },
    { p:'He was born ___ December.', o:['in','on','at','by'], a:'in', e:'Months → "in".', b:'মাস → "in"।' },
    { p:'We walked ___ the river.', o:['along','in','at','to'], a:'along', e:'Beside → "along".', b:'পাশ দিয়ে → "along"।' },
    { p:'He is married ___ my sister.', o:['with','to','for','at'], a:'to', e:'Fixed collocation.', b:'Fixed collocation।' },
    { p:'She is famous ___ her cooking.', o:['of','for','in','at'], a:'for', e:'"Famous for".', b:'"Famous for"।' },
    { p:'They depend ___ their parents.', o:['on','in','at','for'], a:'on', e:'"Depend on".', b:'"Depend on"।' },
    { p:'I am tired ___ waiting.', o:['of','from','with','at'], a:'of', e:'"Tired of".', b:'"Tired of"।' },
    { p:'The Himalayas are ___ Asia.', o:['in','on','at','to'], a:'in', e:'Continents → "in".', b:'মহাদেশ → "in"।' },
    { p:'She has a talent ___ music.', o:['for','in','at','of'], a:'for', e:'"Talent for".', b:'"Talent for"।' },
    { p:'He apologized ___ being late.', o:['of','for','to','at'], a:'for', e:'"Apologize for".', b:'"Apologize for"।' },
    { p:'I have been here ___ Monday.', o:['from','since','for','at'], a:'since', e:'"Since" + point.', b:'"Since" + বিন্দু।' },
    { p:'She is different ___ her sister.', o:['than','from','to','of'], a:'from', e:'"Different from".', b:'"Different from"।' },
    { p:'We are proud ___ our country.', o:['of','for','in','at'], a:'of', e:'"Proud of".', b:'"Proud of"।' },
    { p:'He insisted ___ going.', o:['on','in','at','for'], a:'on', e:'"Insist on".', b:'"Insist on"।' },
    { p:'He is responsible ___ the project.', o:['of','for','in','at'], a:'for', e:'"Responsible for".', b:'"Responsible for"।' },
    { p:'The book belongs ___ me.', o:['with','to','for','at'], a:'to', e:'"Belong to".', b:'"Belong to"।' },
  ]},
  rearranging: { name: 'Rearranging Sentences', icon: 'grid', questions: [
    { p:'Arrange: (a) He is (b) honest (c) an (d) man.', o:['He is an honest man.','An honest he is man.','Honest an man he is.','Man an honest he is.'], a:'He is an honest man.', e:'Subject + verb + article + adj + noun.', b:'Subject + verb + article + adj + noun।' },
    { p:'Arrange: (a) went (b) I (c) to (d) school.', o:['I went to school.','To school I went.','School I to went.','Went I to school.'], a:'I went to school.', e:'Subject + verb + prep + noun.', b:'Subject + verb + prep + noun।' },
    { p:'Arrange: (a) beautiful (b) is (c) she (d) very.', o:['She is very beautiful.','Very she is beautiful.','Beautiful very she is.','She very is beautiful.'], a:'She is very beautiful.', e:'Subject + be + intensifier + adj.', b:'Subject + be + intensifier + adj।' },
    { p:'Arrange: (a) in (b) lives (c) Dhaka (d) he.', o:['He lives in Dhaka.','Dhaka he lives in.','In Dhaka lives he.','Lives he Dhaka in.'], a:'He lives in Dhaka.', e:'Subject + verb + prep + place.', b:'Subject + verb + prep + স্থান।' },
    { p:'Arrange: (a) English (b) speaks (c) she (d) fluently.', o:['She speaks English fluently.','Fluently speaks she English.','English she speaks fluently.','She English speaks fluently.'], a:'She speaks English fluently.', e:'S + V + O + adverb.', b:'S + V + O + adverb।' },
    { p:'Arrange: (a) a (b) is (c) he (d) doctor.', o:['He is a doctor.','A doctor he is.','Doctor a he is.','Is he a doctor.'], a:'He is a doctor.', e:'S + be + article + noun.', b:'S + be + article + noun।' },
    { p:'Arrange: (a) yesterday (b) I (c) him (d) met.', o:['I met him yesterday.','Yesterday met I him.','Him I met yesterday.','I him met yesterday.'], a:'I met him yesterday.', e:'S + V + O + time.', b:'S + V + O + সময়।' },
    { p:'Arrange: (a) reading (b) is (c) she (d) a book.', o:['She is reading a book.','A book is she reading.','Reading she is a book.','She reading is a book.'], a:'She is reading a book.', e:'S + be + V-ing + O.', b:'S + be + V-ing + O।' },
    { p:'Arrange: (a) do (b) what (c) you (d) do?', o:['What do you do?','Do you what do?','You do what do?','What you do do?'], a:'What do you do?', e:'Wh-question word order.', b:'Wh-প্রশ্নের শব্দক্রম।' },
    { p:'Arrange: (a) not (b) she (c) did (d) come.', o:['She did not come.','Did not she come.','Not did she come.','Come she did not.'], a:'She did not come.', e:'S + aux + not + V.', b:'S + aux + not + V।' },
    { p:'Arrange: (a) the (b) is (c) sun (d) bright.', o:['The sun is bright.','Bright is the sun.','Is the sun bright.','Sun is the bright.'], a:'The sun is bright.', e:'S + be + adj.', b:'S + be + adj।' },
    { p:'Arrange: (a) all (b) he (c) knows (d) everything.', o:['He knows everything.','Everything he knows all.','He everything knows.','Knows he everything.'], a:'He knows everything.', e:'S + V + O.', b:'S + V + O।' },
    { p:'Arrange: (a) my (b) is (c) this (d) book.', o:['This is my book.','My book this is.','Is this my book.','Book my is this.'], a:'This is my book.', e:'Demonstrative + be + possessive + noun.', b:'Demonstrative + be + possessive + noun।' },
    { p:'Arrange: (a) very (b) is (c) she (d) kind.', o:['She is very kind.','Very kind she is.','Kind very she is.','She very is kind.'], a:'She is very kind.', e:'S + be + intensifier + adj.', b:'S + be + intensifier + adj।' },
    { p:'Arrange: (a) do (b) how (c) you (d) it?', o:['How do you do it?','Do you how do it?','You how do it?','How you do it?'], a:'How do you do it?', e:'Wh-question structure.', b:'Wh-question গঠন।' },
    { p:'Arrange: (a) never (b) I (c) late (d) am.', o:['I am never late.','Never am I late.','Am I never late.','Late never I am.'], a:'I am never late.', e:'S + be + adv + adj.', b:'S + be + adv + adj।' },
    { p:'Arrange: (a) is (b) where (c) he (d) going?', o:['Where is he going?','He where is going?','Is where he going?','Going he is where?'], a:'Where is he going?', e:'Wh-question with be.', b:'Be সহ Wh-question।' },
    { p:'Arrange: (a) English (b) do (c) speak (d) you?', o:['Do you speak English?','You do speak English?','Speak do you English?','English do you speak?'], a:'Do you speak English?', e:'Yes/no question.', b:'Yes/no প্রশ্ন।' },
    { p:'Arrange: (a) rain (b) it (c) will (d) tomorrow.', o:['It will rain tomorrow.','Tomorrow rain it will.','Will it rain tomorrow.','Rain it will tomorrow.'], a:'It will rain tomorrow.', e:'S + aux + V + time.', b:'S + aux + V + সময়।' },
    { p:'Arrange: (a) himself (b) he (c) hurt.', o:['He hurt himself.','Himself he hurt.','Hurt he himself.','He himself hurt.'], a:'He hurt himself.', e:'S + V + reflexive.', b:'S + V + reflexive।' },
    { p:'Arrange: (a) in (b) was (c) born (d) he (e) Dhaka.', o:['He was born in Dhaka.','Dhaka born he was in.','Was born he in Dhaka.','In Dhaka born he was.'], a:'He was born in Dhaka.', e:'S + be + V + prep + place.', b:'S + be + V + prep + স্থান।' },
    { p:'Arrange: (a) to (b) I (c) go (d) have.', o:['I have to go.','Have I to go.','To go I have.','Go I have to.'], a:'I have to go.', e:'S + have to + V.', b:'S + have to + V।' },
    { p:'Arrange: (a) so (b) is (c) he (d) tall.', o:['He is so tall.','So tall he is.','Tall so he is.','Is he so tall.'], a:'He is so tall.', e:'S + be + so + adj.', b:'S + be + so + adj।' },
    { p:'Arrange: (a) work (b) hard (c) must (d) you.', o:['You must work hard.','Hard must you work.','Must work you hard.','Work must you hard.'], a:'You must work hard.', e:'S + modal + V + adv.', b:'S + modal + V + adv।' },
    { p:'Arrange: (a) up (b) get (c) at 6 (d) I.', o:['I get up at 6.','Up I get at 6.','At 6 up I get.','Get I up at 6.'], a:'I get up at 6.', e:'S + phrasal V + time.', b:'S + phrasal V + সময়।' },
    { p:'Arrange: (a) beautiful (b) a (c) is (d) flower (e) it.', o:['It is a beautiful flower.','A beautiful flower it is.','Beautiful is a flower it.','It beautiful a is flower.'], a:'It is a beautiful flower.', e:'S + be + article + adj + noun.', b:'S + be + article + adj + noun।' },
    { p:'Arrange: (a) yesterday (b) came (c) she (d) late.', o:['She came late yesterday.','Late yesterday she came.','Yesterday she came late.','Came she late yesterday.'], a:'She came late yesterday.', e:'S + V + adv + time.', b:'S + V + adv + সময়।' },
    { p:'Arrange: (a) tea (b) like (c) I (d) hot.', o:['I like hot tea.','Hot tea I like.','Like I hot tea.','Tea hot I like.'], a:'I like hot tea.', e:'S + V + adj + O.', b:'S + V + adj + O।' },
    { p:'Arrange: (a) is (b) this (c) book (d) my.', o:['This is my book.','My book this is.','Is this my book.','Book my is this.'], a:'This is my book.', e:'Demonstrative + be + possessive + noun.', b:'Demonstrative + be + possessive + noun।' },
    { p:'Arrange: (a) to (b) wants (c) he (d) go.', o:['He wants to go.','To go he wants.','Wants he to go.','Go he wants to.'], a:'He wants to go.', e:'S + want to + V.', b:'S + want to + V।' },
  ]},
  translation: { name: 'Translation (BN ↔ EN)', icon: 'chat', questions: [
    { p:'সে প্রতিদিন স্কুলে যায়।', o:['He goes to school every day.','He go to school every day.','He going to school every day.','He went to school every day.'], a:'He goes to school every day.', e:'Habit → present simple.', b:'অভ্যাস → present simple।' },
    { p:'আমি ভাত খাই।', o:['I eat rice.','I eats rice.','I eating rice.','I ate rice.'], a:'I eat rice.', e:'"I" + base verb.', b:'"I" + base verb।' },
    { p:'তুমি কী করছ?', o:['What are you doing?','What you doing?','What do you doing?','What are doing you?'], a:'What are you doing?', e:'Present continuous question.', b:'Present continuous প্রশ্ন।' },
    { p:'তিনি একজন ডাক্তার।', o:['He is a doctor.','He a doctor.','He is doctor.','He doctor is.'], a:'He is a doctor.', e:'Article required.', b:'Article প্রয়োজন।' },
    { p:'আমার একটি বই আছে।', o:['I have a book.','I has a book.','I am a book.','I having a book.'], a:'I have a book.', e:'"Have" for possession.', b:'অধিকার → "have"।' },
    { p:'সে খুব সুন্দরী।', o:['She is very beautiful.','She very beautiful.','She is very beauty.','Very beautiful she.'], a:'She is very beautiful.', e:'"Very" + adj.', b:'"Very" + adj।' },
    { p:'আমরা ইংরেজি শিখছি।', o:['We are learning English.','We learn English.','We learning English.','We are learn English.'], a:'We are learning English.', e:'Present continuous.', b:'Present continuous।' },
    { p:'সে আগামীকাল আসবে।', o:['He will come tomorrow.','He comes tomorrow.','He coming tomorrow.','He came tomorrow.'], a:'He will come tomorrow.', e:'Future simple.', b:'Future simple।' },
    { p:'আমি সকালে হাঁটতে ভালোবাসি।', o:['I love to walk in the morning.','I loving walk morning.','I love walk morning.','I walk loves in morning.'], a:'I love to walk in the morning.', e:'"Love to" + verb.', b:'"Love to" + verb।' },
    { p:'তিনি গতকাল ঢাকায় গিয়েছিলেন।', o:['He went to Dhaka yesterday.','He goes to Dhaka yesterday.','He gone to Dhaka yesterday.','He going to Dhaka yesterday.'], a:'He went to Dhaka yesterday.', e:'Past simple + past time.', b:'Past simple + অতীত সময়।' },
    { p:'আমি তিন বছর ধরে এখানে আছি।', o:['I have been here for three years.','I am here for three years.','I was here three years.','I here three years.'], a:'I have been here for three years.', e:'Present perfect + for.', b:'Present perfect + for।' },
    { p:'আজ আকাশ পরিষ্কার।', o:['The sky is clear today.','Sky clear today.','Today clear sky.','The sky clear today.'], a:'The sky is clear today.', e:'Definite article + be + adj.', b:'Definite article + be + adj।' },
    { p:'তার দুইটি ভাই আছে।', o:['He has two brothers.','He have two brothers.','He having two brothers.','He is two brothers.'], a:'He has two brothers.', e:'Third person → has.', b:'তৃতীয় পুরুষ → has।' },
    { p:'আমি বই পড়তে ভালোবাসি।', o:['I love reading books.','I love read books.','I loving books.','I love to reads books.'], a:'I love reading books.', e:'Love + gerund.', b:'Love + gerund।' },
    { p:'সে আমার বন্ধু।', o:['He is my friend.','He my friend.','He is friend.','My friend he.'], a:'He is my friend.', e:'Possessive + noun.', b:'Possessive + noun।' },
    { p:'আমাদের একটি কুকুর আছে।', o:['We have a dog.','We has a dog.','We having a dog.','We are a dog.'], a:'We have a dog.', e:'Plural subject → have.', b:'বহুবচন subject → have।' },
    { p:'আজ বৃষ্টি হচ্ছে।', o:['It is raining today.','It rains today.','Today raining.','Rain today.'], a:'It is raining today.', e:'Present continuous + dummy "it".', b:'Present continuous + dummy "it"।' },
    { p:'সে বাংলা বলতে পারে।', o:['He can speak Bangla.','He speaks can Bangla.','He can speaks Bangla.','He speaking Bangla.'], a:'He can speak Bangla.', e:'Can + base verb.', b:'Can + base verb।' },
    { p:'আমি সবসময় সত্য বলি।', o:['I always tell the truth.','I tell always truth.','I always tells truth.','I telling truth.'], a:'I always tell the truth.', e:'Adverb of frequency position.', b:'Frequency adverb এর অবস্থান।' },
    { p:'তিনি ইংরেজি শেখান।', o:['He teaches English.','He teach English.','He teaching English.','He taught now English.'], a:'He teaches English.', e:'Third person singular -es.', b:'তৃতীয় পুরুষ একবচনে -es।' },
    { p:'আমার তিনটি বই আছে।', o:['I have three books.','I has three books.','I have three book.','I having three books.'], a:'I have three books.', e:'Plural noun.', b:'বহুবচন noun।' },
    { p:'তিনি কখনো মিথ্যা বলেন না।', o:['He never tells a lie.','He never tell a lie.','He tells never lie.','He not tell lie.'], a:'He never tells a lie.', e:'Third person singular.', b:'তৃতীয় পুরুষ একবচন।' },
    { p:'আমি এটা পছন্দ করি না।', o:['I do not like it.','I not like it.','I does not like it.','I am not liking it.'], a:'I do not like it.', e:'Negative present simple.', b:'নেতিবাচক present simple।' },
    { p:'আজ আমরা যাব।', o:['We will go today.','We go today will.','Today we going.','We going today.'], a:'We will go today.', e:'Future simple.', b:'Future simple।' },
    { p:'তিনি গতকাল এসেছিলেন।', o:['He came yesterday.','He comes yesterday.','He coming yesterday.','He has come yesterday.'], a:'He came yesterday.', e:'Past simple with finished time.', b:'Past simple, শেষ হওয়া সময় সহ।' },
    { p:'আমি এখন ব্যস্ত।', o:['I am busy now.','I busy now.','I am now busy is.','I have busy now.'], a:'I am busy now.', e:'"Am" + adj.', b:'"Am" + adj।' },
    { p:'সে আজ স্কুলে যায়নি।', o:['He did not go to school today.','He does not go to school today.','He not went school today.','He no go school today.'], a:'He did not go to school today.', e:'Past negative.', b:'Past negative।' },
    { p:'আমার একটা আইডিয়া আছে।', o:['I have an idea.','I have a idea.','I has an idea.','I having idea.'], a:'I have an idea.', e:'"An" before vowel sound.', b:'Vowel sound এর আগে "an"।' },
    { p:'তুমি কোথায় থাকো?', o:['Where do you live?','Where you live?','Where live you?','Where are you living now?'], a:'Where do you live?', e:'Wh-question.', b:'Wh-প্রশ্ন।' },
    { p:'আমি ছোটবেলা থেকে এখানে আছি।', o:['I have been here since childhood.','I am here since childhood.','I was here from childhood.','I here from childhood.'], a:'I have been here since childhood.', e:'Present perfect + since.', b:'Present perfect + since।' },
  ]},
  idioms: { name: 'Idioms & Phrases', icon: 'trophy', questions: [
    { p:'"A piece of cake" means —', o:['something very easy','a tasty dessert','a small portion','an angry remark'], a:'something very easy', e:'Idiom = very easy task.', b:'Idiom = খুব সহজ কাজ।' },
    { p:'"Break the ice" means —', o:['start a conversation','break something','cool down','end a meeting'], a:'start a conversation', e:'Idiom = begin a conversation.', b:'Idiom = কথোপকথন শুরু করা।' },
    { p:'"Hit the books" means —', o:['study hard','hit books','read casually','throw books'], a:'study hard', e:'Idiom = study seriously.', b:'Idiom = মনোযোগ দিয়ে পড়া।' },
    { p:'"Once in a blue moon" means —', o:['very rarely','very often','every day','always'], a:'very rarely', e:'Idiom = very rarely.', b:'Idiom = খুব কম।' },
    { p:'"Under the weather" means —', o:['feeling sick','in the rain','below the sky','happy'], a:'feeling sick', e:'Idiom = unwell.', b:'Idiom = অসুস্থ।' },
    { p:'"Bite the bullet" means —', o:['face a difficult situation bravely','eat fast','shoot someone','run fast'], a:'face a difficult situation bravely', e:'Idiom = endure courageously.', b:'Idiom = সাহসের সাথে সহ্য করা।' },
    { p:'"Let the cat out of the bag" means —', o:['reveal a secret','free a cat','buy a cat','hide truth'], a:'reveal a secret', e:'Idiom = reveal a secret.', b:'Idiom = গোপন কথা ফাঁস করা।' },
    { p:'"Beat around the bush" means —', o:['avoid the main topic','hit bushes','run around','play games'], a:'avoid the main topic', e:'Idiom = avoid the point.', b:'Idiom = মূল বিষয় এড়িয়ে যাওয়া।' },
    { p:'"Cost an arm and a leg" means —', o:['very expensive','cheap','free','moderate'], a:'very expensive', e:'Idiom = very costly.', b:'Idiom = খুব দামি।' },
    { p:'"See eye to eye" means —', o:['agree','stare','look closely','fight'], a:'agree', e:'Idiom = agree fully.', b:'Idiom = একমত হওয়া।' },
    { p:'"Pull someone’s leg" means —', o:['joke with someone','hurt someone','help someone','pull hard'], a:'joke with someone', e:'Idiom = tease playfully.', b:'Idiom = মজা করা।' },
    { p:'"Spill the beans" means —', o:['reveal information','drop beans','cook beans','waste food'], a:'reveal information', e:'Idiom = reveal a secret.', b:'Idiom = তথ্য ফাঁস করা।' },
    { p:'"Ball is in your court" means —', o:['your turn to decide','play tennis','ball is yours','take the ball'], a:'your turn to decide', e:'Idiom = your decision.', b:'Idiom = তোমার সিদ্ধান্তের পালা।' },
    { p:'"Barking up the wrong tree" means —', o:['misunderstanding the situation','barking at a tree','running fast','barking loudly'], a:'misunderstanding the situation', e:'Idiom = wrong direction.', b:'Idiom = ভুল ধারণা।' },
    { p:'"Blessing in disguise" means —', o:['hidden benefit','hidden problem','a gift','a disguise'], a:'hidden benefit', e:'Idiom = good in disguise.', b:'Idiom = আপাত ক্ষতি যা পরে উপকার।' },
    { p:'"Call it a day" means —', o:['stop working for the day','name the day','call a friend','start the day'], a:'stop working for the day', e:'Idiom = finish working.', b:'Idiom = কাজ বন্ধ করা।' },
    { p:'"Cut corners" means —', o:['do something poorly to save time','cut shapes','run fast','save money'], a:'do something poorly to save time', e:'Idiom = do badly to save effort.', b:'Idiom = সময় বাঁচাতে খারাপভাবে করা।' },
    { p:'"Hit the nail on the head" means —', o:['say exactly the right thing','hit a nail','do carpentry','aim badly'], a:'say exactly the right thing', e:'Idiom = precise.', b:'Idiom = ঠিক কথা বলা।' },
    { p:'"In the same boat" means —', o:['in the same situation','on a boat','traveling together','fishing'], a:'in the same situation', e:'Idiom = same difficulty.', b:'Idiom = একই অবস্থায়।' },
    { p:'"Jump on the bandwagon" means —', o:['join a popular trend','jump high','ride a wagon','fall down'], a:'join a popular trend', e:'Idiom = follow a trend.', b:'Idiom = জনপ্রিয় ধারায় যোগ দেওয়া।' },
    { p:'"Keep an eye on" means —', o:['watch carefully','close eyes','blink','ignore'], a:'watch carefully', e:'Idiom = monitor.', b:'Idiom = সতর্ক দৃষ্টি রাখা।' },
    { p:'"Let sleeping dogs lie" means —', o:['avoid restarting an old problem','wake a dog','feed a dog','sleep with a dog'], a:'avoid restarting an old problem', e:'Idiom = leave it alone.', b:'Idiom = পুরনো বিষয় তুলতে না যাওয়া।' },
    { p:'"Miss the boat" means —', o:['miss an opportunity','miss a ship','be late','fall in water'], a:'miss an opportunity', e:'Idiom = lose a chance.', b:'Idiom = সুযোগ হাতছাড়া করা।' },
    { p:'"On cloud nine" means —', o:['extremely happy','on a cloud','in the sky','dreaming'], a:'extremely happy', e:'Idiom = very happy.', b:'Idiom = অত্যন্ত খুশি।' },
    { p:'"Pull yourself together" means —', o:['calm down and behave','pull a rope','gather items','get up'], a:'calm down and behave', e:'Idiom = regain composure.', b:'Idiom = শান্ত হওয়া।' },
    { p:'"See the light" means —', o:['suddenly understand','look at a light','use a lamp','find the sun'], a:'suddenly understand', e:'Idiom = understand suddenly.', b:'Idiom = হঠাৎ বুঝতে পারা।' },
    { p:'"Smell a rat" means —', o:['suspect something wrong','smell a rodent','find a mouse','detect a scent'], a:'suspect something wrong', e:'Idiom = sense deceit.', b:'Idiom = সন্দেহ করা।' },
    { p:'"Take with a grain of salt" means —', o:['accept with skepticism','eat salty food','put salt','share food'], a:'accept with skepticism', e:'Idiom = doubt slightly.', b:'Idiom = সন্দেহ নিয়ে গ্রহণ করা।' },
    { p:'"The ball is in your court" means —', o:['your turn to decide','tennis ball','hold a ball','give a ball'], a:'your turn to decide', e:'Idiom = your move.', b:'Idiom = তোমার পালা।' },
    { p:'"Throw in the towel" means —', o:['give up','wipe hands','throw cloth','start work'], a:'give up', e:'Idiom = surrender.', b:'Idiom = হাল ছেড়ে দেওয়া।' },
  ]},
};

const TABS = Object.entries(QUESTION_BANK).map(([id, cat]) => ({
  id,
  label: cat.name,
  icon: cat.icon,
  count: cat.questions.length,
}));

const CLASSES = ['SSC', 'HSC'];
const PAPERS = ['1st Paper', '2nd Paper'];
const BOARDS = ['Dhaka', 'Rajshahi', 'Chattogram', 'Sylhet', 'Barishal'];

const FALLBACK_TOPICS = [
  { id: 't1', title: 'Seen Comprehension', tag: 'Reading' },
  { id: 't2', title: 'Gap Filling with Clues', tag: 'Grammar' },
  { id: 't3', title: 'Rearranging Sentences', tag: 'Grammar' },
];

const FALLBACK_WRITING = [
  { id: 'w1', title: 'Your Aim in Life' },
  { id: 'w2', title: 'A Letter to a Friend about SSC Results' },
];

const TOTAL_QUESTIONS = Object.values(QUESTION_BANK).reduce((s, c) => s + c.questions.length, 0);

/* ============================================================
   Mascot — Langut-style yellow blob
   ============================================================ */
function LangutMascot({ size = 160 }) {
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

export function Curriculum() {
  const [cls, setCls] = useState('SSC');
  const [paper, setPaper] = useState('1st Paper');
  const [board, setBoard] = useState('Dhaka');
  const [banglaHelp, setBanglaHelp] = useState(false);

  const [topics, setTopics] = useState([]);
  const [writingType, setWritingType] = useState('paragraph');
  const [writingBank, setWritingBank] = useState([]);

  const [catId, setCatId] = useState('verbs');
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feel, setFeel] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [xpToast, setXpToast] = useState(null);
  const [catStats, setCatStats] = useState({});

  useEffect(() => {
    curriculumApi.topics({ class: cls, paper, board })
      .then((t) => setTopics(t || []))
      .catch(() => setTopics([]));
  }, [cls, paper, board]);

  useEffect(() => {
    curriculumApi.writingBank(writingType)
      .then((w) => setWritingBank(w || []))
      .catch(() => setWritingBank([]));
  }, [writingType]);

  const cat = QUESTION_BANK[catId];
  const question = cat.questions[qIndex];
  const totalForCat = cat.questions.length;

  const showXp = (amount) => {
    setXpToast(amount);
    setTimeout(() => setXpToast(null), 900);
  };

  const answer = (opt) => {
    if (!question || selected) return;
    setSelected(opt);
    const correct = opt === question.a;
    setFeel(correct ? 'good' : 'bad');
    setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
    setCatStats((st) => {
      const prev = st[catId] || { correct: 0, total: 0 };
      return { ...st, [catId]: { correct: prev.correct + (correct ? 1 : 0), total: prev.total + 1 } };
    });
    if (correct) showXp(10);
    setTimeout(() => {
      setSelected(null);
      setFeel(null);
      setQIndex((i) => (i + 1 < totalForCat ? i + 1 : 0));
    }, 850);
  };

  const switchCat = (id) => {
    setCatId(id);
    setQIndex(0);
    setSelected(null);
    setFeel(null);
  };

  const isWeakCat = (id) => {
    const s = catStats[id];
    return !!s && s.total >= 3 && s.correct / s.total < 0.6;
  };

  const overallPct = score.total ? Math.round((score.correct / score.total) * 100) : 0;

  return (
    <div className="ec-cur">
      <style>{CURRICULUM_CSS}</style>

      <div className="ec-cur-head ec-cur-anim">
        <div>
          <p className="ec-cur-eyebrow">Curriculum</p>
          <h1 className="ec-page-title">Bangladeshi English</h1>
          <p className="ec-page-sub">SSC & HSC — 1st and 2nd Paper, tagged by class, paper, board.</p>
        </div>
      </div>

      <div className="ec-cur-hero ec-cur-anim">
        <div className="ec-cur-hero-orb" aria-hidden="true" />
        <div className="ec-cur-hero-copy">
          <span className="ec-cur-hero-badge">Bangladesh National Curriculum</span>
          <h1>SSC & HSC practice, <em>board-style</em></h1>
          <p>Every grammar rule, gap-filling type, translation pattern and writing form you’ll see in the exam — organized and ready to drill.</p>
          <div className="ec-cur-hero-stats">
            <div className="ec-cur-hero-stat"><strong>{TOTAL_QUESTIONS}</strong><span>Exercises</span></div>
            <div className="ec-cur-hero-stat"><strong>{TABS.length}</strong><span>Categories</span></div>
            <div className="ec-cur-hero-stat"><strong>{BOARDS.length}</strong><span>Boards</span></div>
          </div>
        </div>
        <div className="ec-cur-hero-mascot">
          <LangutMascot size={170} />
        </div>
      </div>

      <div className="ec-cur-filters ec-cur-anim">
        <div className="ec-cur-filter-group">
          {CLASSES.map((c) => (
            <button key={c} className={`ec-cur-pill${cls === c ? ' ec-cur-pill--active' : ''}`} onClick={() => setCls(c)}>{c}</button>
          ))}
        </div>
        <div className="ec-cur-filter-group">
          {PAPERS.map((p) => (
            <button key={p} className={`ec-cur-pill${paper === p ? ' ec-cur-pill--active' : ''}`} onClick={() => setPaper(p)}>{p}</button>
          ))}
        </div>
        <select className="ec-cur-select" value={board} onChange={(e) => setBoard(e.target.value)}>
          {BOARDS.map((b) => <option key={b} value={b}>{b} Board</option>)}
        </select>
        <label className="ec-cur-check">
          <input type="checkbox" checked={banglaHelp} onChange={(e) => setBanglaHelp(e.target.checked)} />
          🇧🇩 বাংলা
        </label>
      </div>

      <div className="ec-cur-cats ec-cur-anim">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`ec-cur-cat${catId === t.id ? ' ec-cur-cat--active' : ''}`}
            onClick={() => switchCat(t.id)}
          >
            <Icon name={t.icon} />
            {t.label}
            <span className="ec-cur-cat-count">{t.count}</span>
          </button>
        ))}
      </div>

      {xpToast && <div className="ec-cur-xp-toast">+{xpToast} XP ✨</div>}

      <div className="ec-cur-grid">
        <section>
          <div className="ec-cur-section ec-cur-anim">
            <div className="ec-quiz-top">
              <span className="ec-quiz-badge">{cat.name}</span>
              <span className="ec-quiz-counter">Question {qIndex + 1} / {totalForCat}</span>
            </div>
            <div className="ec-quiz-progress">
              <div className="ec-quiz-progress-fill" style={{ width: `${((qIndex + 1) / totalForCat) * 100}%` }} />
            </div>
            <p className="ec-quiz-question">{question.p}</p>
            <div className="ec-quiz-options">
              {question.o.map((opt) => {
                const isSelected = selected === opt;
                const isCorrect = opt === question.a;
                const cls = `ec-quiz-option${isSelected ? (isCorrect ? ' ec-quiz-option--correct ec-pop' : ' ec-quiz-option--incorrect') : ''}`;
                return (
                  <button
                    key={opt}
                    className={cls}
                    onClick={() => answer(opt)}
                    disabled={!!selected && !isSelected && !isCorrect}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            <div className={`ec-quiz-feedback${feel === 'good' ? ' ec-quiz-feedback--good' : feel === 'bad' ? ' ec-quiz-feedback--bad' : ''}`}>
              {feel === 'good' && '✨ Correct!'}
              {feel === 'bad' && `Correct answer: ${question.a}`}
            </div>
            {feel && (
              <p className="ec-quiz-explain">
                💡 {banglaHelp ? question.b : question.e}
              </p>
            )}
          </div>

          <div className="ec-cur-section ec-cur-anim">
            <div className="ec-cur-section-head">
              <h2 className="ec-cur-section-title">Board-style question sets</h2>
              <span className="ec-cur-chip">{cls} · {paper}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(topics.length ? topics : FALLBACK_TOPICS).map((t) => (
                <div
                  key={t.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    padding: '14px 16px',
                    borderRadius: 16,
                    background: 'var(--lang-lime-soft)',
                    border: '2px solid var(--lang-line)',
                    boxShadow: '0 3px 0 var(--lang-line)',
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: '0 0 4px', fontWeight: 900, fontSize: 13.5, color: 'var(--lang-ink)' }}>{t.title}</p>
                    <span style={{
                      fontSize: 10.5,
                      fontWeight: 900,
                      color: 'var(--lang-ink)',
                      background: 'var(--lang-pink)',
                      padding: '3px 9px',
                      borderRadius: 999,
                      border: '2px solid var(--lang-line)',
                      textTransform: 'uppercase',
                      letterSpacing: '.06em',
                    }}>{t.tag}</span>
                  </div>
                  <button
                    className="ec-cur-pill ec-cur-pill--active"
                    style={{ padding: '8px 16px', fontSize: 12, flexShrink: 0 }}
                  >
                    Practice
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="ec-cur-section ec-cur-anim ec-cur-translation">
            <div className="ec-cur-section-head">
              <h2 className="ec-cur-section-title">Translation practice</h2>
              <span className="ec-cur-chip">Bangla ↔ English</span>
            </div>
            <p style={{ margin: 0, fontSize: 12.5, color: 'var(--lang-ink-soft)', fontWeight: 700 }}>
              Translate the sentence below:
            </p>
            <p className="bn">সে প্রতিদিন সকালে হাঁটে।</p>
            <textarea rows={2} placeholder="Type the English translation…" />
            <button
              className="ec-cur-pill ec-cur-pill--active"
              style={{ marginTop: 12, padding: '10px 20px', fontSize: 12.5 }}
            >
              Check
            </button>
          </div>
        </section>

        <aside>
          <div className="ec-cur-section ec-cur-anim">
            <div className="ec-cur-section-head">
              <h2 className="ec-cur-section-title">Categories</h2>
              <span className="ec-cur-chip">{TABS.length}</span>
            </div>
            <div className="ec-cur-topic-list">
              {TABS.map((t) => {
                const stat = catStats[t.id];
                const pct = stat && stat.total ? Math.round((stat.correct / stat.total) * 100) : null;
                const weak = isWeakCat(t.id);
                return (
                  <button
                    key={t.id}
                    className={`ec-cur-topic-btn${catId === t.id ? ' ec-cur-topic-btn--active' : ''}`}
                    onClick={() => switchCat(t.id)}
                  >
                    <span className="ec-cur-topic-name">{t.label}</span>
                    {pct !== null && (
                      <span
                        className="ec-cur-topic-count"
                        style={weak ? { background: 'var(--lang-pink-2)', color: '#fff' } : undefined}
                      >
                        {pct}%
                      </span>
                    )}
                    <span className="ec-cur-topic-count">{t.count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="ec-cur-section ec-cur-anim">
            <div className="ec-cur-section-head">
              <h2 className="ec-cur-section-title">Writing bank</h2>
            </div>
            <div className="ec-cur-filter-group" style={{ marginBottom: 14 }}>
              {['paragraph', 'composition', 'letter'].map((t) => (
                <button
                  key={t}
                  className={`ec-cur-pill${writingType === t ? ' ec-cur-pill--active' : ''}`}
                  onClick={() => setWritingType(t)}
                  style={{ textTransform: 'capitalize' }}
                >
                  {t}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(writingBank.length ? writingBank : FALLBACK_WRITING).map((w) => (
                <div key={w.id} className="ec-cur-bank-item">{w.title}</div>
              ))}
            </div>
          </div>

          <div className="ec-cur-section ec-cur-anim">
            <div className="ec-cur-section-head">
              <h2 className="ec-cur-section-title">Your session</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="ec-cur-session-label">
                <span style={{ color: 'var(--lang-ink-soft)' }}>Correct</span>
                <span style={{ color: 'var(--lang-ink)' }}>{score.correct} / {score.total}</span>
              </div>
              <div style={{
                height: 14,
                borderRadius: 999,
                background: '#E8E5F2',
                overflow: 'hidden',
                border: '2px solid var(--lang-line)',
              }}>
                <div style={{
                  height: '100%',
                  width: `${overallPct}%`,
                  background: 'linear-gradient(90deg, #D4F55C, #B8E62E)',
                  borderRadius: 999,
                  transition: 'width .8s ease',
                }} />
              </div>
              <span style={{
                fontSize: 12,
                fontWeight: 900,
                color: 'var(--lang-ink)',
                background: 'var(--lang-lime)',
                border: '2px solid var(--lang-line)',
                padding: '6px 12px',
                borderRadius: 999,
                alignSelf: 'flex-end',
                boxShadow: '0 2px 0 var(--lang-line)',
                letterSpacing: '.04em',
              }}>
                {overallPct}% accuracy
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Curriculum;