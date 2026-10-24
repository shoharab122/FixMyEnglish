import { useEffect, useMemo, useRef, useState } from 'react';
import { curriculumApi } from '../api/curriculum';
import { Icon } from '../components/Icon';

/* ============================================================
   CURRICULUM — Langut-inspired, mobile-first (optimised)
   1500+ exercises · 30 categories · Lessons + Practice + Paragraphs + Stories
   Papers: English 2nd Paper + General only.
   (IELTS section removed.)
   ============================================================ */

const CURRICULUM_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap');
.ec-cur{
  --lang-bg:#1E1252;--lang-bg-2:#2A1A6E;--lang-bg-3:#3B2596;
  --lang-lime:#D4F55C;--lang-lime-2:#E4FF5C;--lang-lime-soft:#EDFFB0;--lang-lime-deep:#B8E62E;
  --lang-yellow:#F5E04D;--lang-purple:#7B5CF0;--lang-purple-2:#9B7BFF;
  --lang-pink:#FFB3D1;--lang-pink-2:#FF8FCB;
  --lang-mint:#B8F2D8;--lang-mint-2:#7FD9A9;
  --lang-ink:#17102E;--lang-ink-soft:#6B6488;--lang-line:#17102E;
  --lang-safe:env(safe-area-inset-bottom, 0px);
  --lang-nav-h:110px;
  --tap:48px;

  width:100%;max-width:100%;overflow-x:hidden;position:relative;
  padding-bottom:calc(var(--lang-nav-h) + var(--lang-safe));
  -webkit-text-size-adjust:100%;
}
.ec-cur,.ec-cur *{box-sizing:border-box;min-width:0;-webkit-tap-highlight-color:transparent}
.ec-cur button,.ec-cur input,.ec-cur select,.ec-cur textarea{
  touch-action:manipulation;-webkit-tap-highlight-color:transparent;font-family:inherit;
}
.ec-cur input,.ec-cur select,.ec-cur textarea{font-size:16px}
.ec-cur button{cursor:pointer}

.ec-cur-head{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:18px}
.ec-cur-eyebrow{margin:0 0 6px;font-size:11.5px;font-weight:900;letter-spacing:.16em;text-transform:uppercase;color:var(--lang-purple);opacity:.95}

/* HERO */
.ec-cur-hero{
  position:relative;overflow:hidden;border-radius:28px;
  padding:clamp(22px,4vw,38px) clamp(20px,4vw,40px);
  color:#fff;
  background:linear-gradient(140deg,#2A1A6E 0%,#1E1252 55%,#3B2596 100%);
  box-shadow:0 18px 46px rgba(30,18,82,.32);
  border:2px solid var(--lang-line);
  margin-bottom:20px;
  display:flex;align-items:center;justify-content:space-between;gap:20px;
  animation:ec-cur-fade .45s ease both;
}
.ec-cur-hero::before{
  content:'';position:absolute;inset:0;
  background-image:radial-gradient(rgba(255,255,255,.09) 1.4px,transparent 1.4px);
  background-size:22px 22px;
  mask-image:radial-gradient(circle at 15% 20%,#000,transparent 65%);
  -webkit-mask-image:radial-gradient(circle at 15% 20%,#000,transparent 65%);
  pointer-events:none;
}
.ec-cur-hero-copy{position:relative;z-index:1;max-width:580px;min-width:0;flex:1 1 auto}
.ec-cur-hero-badge{
  display:inline-flex;align-items:center;font-size:10.5px;font-weight:900;
  letter-spacing:.14em;text-transform:uppercase;padding:7px 14px;border-radius:999px;
  background:var(--lang-lime);color:var(--lang-ink);
  border:2px solid var(--lang-line);box-shadow:0 3px 0 rgba(0,0,0,.4);
  margin-bottom:14px;max-width:100%;
}
.ec-cur-hero h2{
  margin:0 0 10px;font-size:clamp(22px,2.4vw + 14px,36px);
  font-weight:900;letter-spacing:-.035em;line-height:1.1;color:#fff;word-break:break-word;
}
.ec-cur-hero h2 em{font-style:normal;color:var(--lang-lime)}
.ec-cur-hero p{margin:0 0 18px;font-size:14px;line-height:1.6;opacity:.92;font-weight:500;max-width:52ch}
.ec-cur-hero-stats{display:flex;gap:10px;flex-wrap:wrap;position:relative;z-index:1}
.ec-cur-hero-stat{
  display:flex;flex-direction:column;gap:2px;padding:9px 14px;border-radius:14px;
  background:var(--lang-lime);border:2px solid var(--lang-line);
  box-shadow:0 3px 0 var(--lang-line);min-width:80px;
}
.ec-cur-hero-stat strong{font-size:20px;font-weight:900;line-height:1;letter-spacing:-.04em;color:var(--lang-ink)}
.ec-cur-hero-stat span{font-size:9.5px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:var(--lang-ink);opacity:.75}
.ec-cur-hero-stat:nth-child(2){background:var(--lang-pink)}
.ec-cur-hero-stat:nth-child(3){background:var(--lang-purple-2)}
.ec-cur-hero-stat:nth-child(3) strong,.ec-cur-hero-stat:nth-child(3) span{color:#fff}
.ec-cur-hero-mascot{
  position:relative;z-index:1;flex-shrink:0;display:flex;align-items:center;justify-content:center;
  filter:drop-shadow(0 14px 28px rgba(0,0,0,.28));
  animation:ec-cur-bob 4s ease-in-out infinite;
}
@keyframes ec-cur-bob{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-8px) rotate(2deg)}}

/* MODE SWITCH */
.ec-cur-modes{
  display:flex;gap:8px;margin-bottom:14px;background:#fff;padding:6px;
  border:2px solid var(--lang-line);border-radius:999px;
  box-shadow:0 3px 0 var(--lang-line);width:100%;max-width:100%;
  overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch;
}
.ec-cur-modes::-webkit-scrollbar{display:none}
.ec-cur-mode{
  flex:1 1 0;min-width:120px;
  display:inline-flex;align-items:center;justify-content:center;gap:7px;
  padding:11px 18px;border-radius:999px;
  border:none;background:transparent;color:var(--lang-ink);
  font-size:13px;font-weight:900;
  transition:background .18s ease,color .18s ease;
  white-space:nowrap;min-height:var(--tap);
}
.ec-cur-mode--active{background:var(--lang-ink);color:var(--lang-lime)}
.ec-cur-mode svg{width:15px;height:15px}

/* FILTER BAR */
.ec-cur-filters{
  display:flex;gap:10px;flex-wrap:wrap;align-items:center;
  margin-bottom:16px;padding:14px;
  background:#fff;border:2px solid var(--lang-line);
  border-radius:20px;box-shadow:0 5px 0 var(--lang-line);
  animation:ec-cur-fade .45s ease both;
}
.ec-cur-filter-group{display:flex;gap:6px;flex-wrap:wrap;flex:1 1 auto}
.ec-cur-pill{
  border:2px solid var(--lang-line);background:#fff;color:var(--lang-ink);
  padding:11px 16px;border-radius:999px;font-size:13px;font-weight:900;
  transition:transform .16s ease,box-shadow .16s ease,background .16s ease,color .16s ease;
  box-shadow:0 3px 0 var(--lang-line);
  letter-spacing:.02em;min-height:var(--tap);
  display:inline-flex;align-items:center;justify-content:center;
}
.ec-cur-pill:hover{background:var(--lang-lime-soft);transform:translateY(-2px);box-shadow:0 5px 0 var(--lang-line)}
.ec-cur-pill:active{transform:translateY(1px);box-shadow:0 1px 0 var(--lang-line);background:var(--lang-lime)}
.ec-cur-pill--active{background:var(--lang-ink);color:var(--lang-lime);box-shadow:0 3px 0 var(--lang-ink)}
.ec-cur-select{
  border:2px solid var(--lang-line);background:#fff;color:var(--lang-ink);
  padding:11px 14px;border-radius:999px;font-size:13px;font-weight:900;
  outline:none;box-shadow:0 3px 0 var(--lang-line);min-height:var(--tap);min-width:140px;
}
.ec-cur-check{
  display:inline-flex;align-items:center;gap:8px;
  font-size:13px;font-weight:900;color:var(--lang-ink);cursor:pointer;
  user-select:none;padding:11px 16px;
  border:2px solid var(--lang-line);border-radius:999px;
  background:#fff;box-shadow:0 3px 0 var(--lang-line);
  min-height:var(--tap);
}
.ec-cur-check input{accent-color:var(--lang-ink);width:18px;height:18px}

/* CATEGORY TABS */
.ec-cur-cats{
  display:flex;gap:8px;overflow-x:auto;
  scrollbar-width:none;-webkit-overflow-scrolling:touch;
  padding:4px 2px 14px;margin-bottom:4px;max-width:100%;
  scroll-snap-type:x proximity;
}
.ec-cur-cats::-webkit-scrollbar{display:none}
.ec-cur-cat{
  flex:0 0 auto;scroll-snap-align:start;
  display:inline-flex;align-items:center;gap:7px;
  padding:12px 16px;border-radius:999px;
  border:2px solid var(--lang-line);background:#fff;color:var(--lang-ink);
  font-size:13px;font-weight:900;
  white-space:nowrap;min-height:var(--tap);
  transition:transform .16s ease,box-shadow .16s ease,background .16s ease,color .16s ease;
  box-shadow:0 3px 0 var(--lang-line);
}
.ec-cur-cat:hover{background:var(--lang-lime-soft);transform:translateY(-2px);box-shadow:0 5px 0 var(--lang-line)}
.ec-cur-cat:active{transform:translateY(1px);box-shadow:0 1px 0 var(--lang-line)}
.ec-cur-cat--active{background:var(--lang-ink);color:var(--lang-lime);box-shadow:0 3px 0 var(--lang-ink)}
.ec-cur-cat--active:hover{background:var(--lang-ink);color:var(--lang-lime)}
.ec-cur-cat svg{width:15px;height:15px;flex-shrink:0}
.ec-cur-cat-count{
  font-size:10px;font-weight:900;padding:2px 7px;border-radius:999px;
  background:var(--lang-lime);color:var(--lang-ink);border:2px solid var(--lang-line);
}

/* GRID */
.ec-cur-grid{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:20px;align-items:start;width:100%;max-width:100%}
.ec-cur-grid > section,.ec-cur-grid > aside{min-width:0;max-width:100%}

/* SECTION CARD */
.ec-cur-section{
  background:#fff;border:2px solid var(--lang-line);
  border-radius:24px;padding:20px;
  box-shadow:0 5px 0 var(--lang-line);margin-bottom:18px;
  background-image:radial-gradient(circle at 100% 0%,rgba(212,245,92,.10),transparent 55%);
  animation:ec-cur-fade .4s ease both;
}
.ec-cur-section-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:14px;flex-wrap:wrap}
.ec-cur-section-title{margin:0;font-size:15.5px;font-weight:900;letter-spacing:-.01em;color:var(--lang-ink)}
.ec-cur-chip{
  font-size:10.5px;font-weight:900;color:var(--lang-ink);background:var(--lang-lime);
  border:2px solid var(--lang-line);padding:4px 11px;border-radius:999px;
  letter-spacing:.05em;text-transform:uppercase;box-shadow:0 2px 0 var(--lang-line);flex-shrink:0;
}

/* LESSON VIEWER */
.ec-lesson{
  background:#fff;border:2px solid var(--lang-line);
  border-radius:24px;padding:22px;box-shadow:0 5px 0 var(--lang-line);
  margin-bottom:18px;
  background-image:radial-gradient(circle at 100% 0%,rgba(212,245,92,.14),transparent 55%);
  animation:ec-cur-fade .4s ease both;
}
.ec-lesson-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:14px;flex-wrap:wrap}
.ec-lesson-title{margin:0;font-size:18px;font-weight:900;color:var(--lang-ink);letter-spacing:-.02em}
.ec-lesson-body{display:flex;flex-direction:column;gap:14px}
.ec-lesson-block{
  background:var(--lang-lime-soft);border:2px solid var(--lang-line);
  border-radius:14px;padding:14px 16px;box-shadow:0 2px 0 var(--lang-line);
}
.ec-lesson-block h4{
  margin:0 0 8px;font-size:13px;font-weight:900;color:var(--lang-ink);
  letter-spacing:.02em;text-transform:uppercase;
  display:flex;align-items:center;gap:6px;
}
.ec-lesson-block ul{margin:0;padding-left:18px}
.ec-lesson-block li{font-size:13px;line-height:1.6;color:var(--lang-ink);font-weight:700;margin-bottom:5px}
.ec-lesson-block li:last-child{margin-bottom:0}
.ec-lesson-block code{background:var(--lang-ink);color:var(--lang-lime);padding:1px 6px;border-radius:5px;font-weight:900;font-size:12.5px}
.ec-lesson-example{
  background:#fff;border:2px dashed var(--lang-line);border-radius:12px;padding:10px 12px;
  font-size:12.5px;font-weight:700;color:var(--lang-ink-soft);line-height:1.55;
}
.ec-lesson-example strong{color:var(--lang-ink);font-weight:900}
.ec-lesson-bn{
  background:linear-gradient(160deg,#FFB3D1,#FF8FCB);color:#fff;
  border:2px solid var(--lang-line);border-radius:14px;padding:12px 14px;
  font-size:12.5px;font-weight:800;line-height:1.6;box-shadow:0 2px 0 var(--lang-line);
}

/* QUIZ */
.ec-quiz-top{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px;flex-wrap:wrap}
.ec-quiz-badge{
  display:inline-flex;align-items:center;font-size:10.5px;font-weight:900;letter-spacing:.07em;
  text-transform:uppercase;padding:6px 12px;border-radius:999px;
  background:var(--lang-lime);color:var(--lang-ink);border:2px solid var(--lang-line);
  box-shadow:0 2px 0 var(--lang-line);max-width:100%;
}
.ec-quiz-counter{font-size:11.5px;font-weight:900;color:var(--lang-ink-soft);letter-spacing:.05em;text-transform:uppercase}
.ec-quiz-progress{
  height:10px;border-radius:999px;background:#E8E5F2;overflow:hidden;
  margin-bottom:16px;border:2px solid var(--lang-line);
}
.ec-quiz-progress-fill{
  height:100%;border-radius:999px;
  background:linear-gradient(90deg,#D4F55C,#B8E62E);
  transition:width .5s cubic-bezier(.22,1,.36,1);
}
.ec-quiz-question{
  font-size:clamp(15px,1vw + 12px,18px);font-weight:900;line-height:1.4;
  margin:0 0 16px;color:var(--lang-ink);letter-spacing:-.02em;
  word-break:break-word;overflow-wrap:anywhere;
}
.ec-quiz-options{display:flex;flex-direction:column;gap:10px;margin-bottom:14px}
.ec-quiz-option{
  display:flex;align-items:center;
  border:2px solid var(--lang-line);background:#fff;color:var(--lang-ink);
  font-size:14.5px;font-weight:800;
  padding:15px 16px;border-radius:14px;text-align:left;
  transition:transform .16s ease,box-shadow .16s ease,background .16s ease;
  box-shadow:0 3px 0 var(--lang-line);
  min-height:52px;width:100%;word-break:break-word;overflow-wrap:anywhere;line-height:1.35;
}
.ec-quiz-option:hover:not(:disabled){background:var(--lang-lime-soft);transform:translateY(-2px);box-shadow:0 5px 0 var(--lang-line)}
.ec-quiz-option:active:not(:disabled){transform:translateY(1px);box-shadow:0 1px 0 var(--lang-line);background:var(--lang-lime)}
.ec-quiz-option:disabled{cursor:default}
.ec-quiz-option--correct{background:var(--lang-lime);color:var(--lang-ink);font-weight:900}
.ec-quiz-option--incorrect{background:var(--lang-pink-2);color:#fff;font-weight:900}
.ec-quiz-feedback{font-size:12.5px;font-weight:900;min-height:20px;margin-bottom:6px;letter-spacing:.02em}
.ec-quiz-feedback--good{color:#1F8A4C}
.ec-quiz-feedback--bad{color:#C4325A}
.ec-quiz-explain{
  margin:10px 0 0;font-size:12.5px;line-height:1.6;color:var(--lang-ink);
  background:var(--lang-lime-soft);border:2px solid var(--lang-line);
  border-radius:12px;padding:10px 12px;font-weight:700;
  box-shadow:0 2px 0 var(--lang-line);word-break:break-word;
}

/* TOPIC LIST */
.ec-cur-topic-list{display:flex;flex-direction:column;gap:8px;max-height:520px;overflow-y:auto;padding-right:4px}
.ec-cur-topic-btn{
  display:flex;align-items:center;gap:10px;padding:12px 13px;border-radius:14px;
  border:2px solid var(--lang-line);background:#fff;color:var(--lang-ink);
  font-size:13px;font-weight:800;text-align:left;width:100%;
  transition:transform .15s ease,box-shadow .15s ease,background .15s ease;
  box-shadow:0 3px 0 var(--lang-line);min-height:var(--tap);
}
.ec-cur-topic-btn:hover{background:var(--lang-lime-soft);transform:translateY(-1px);box-shadow:0 4px 0 var(--lang-line)}
.ec-cur-topic-btn:active{transform:translateY(1px);box-shadow:0 1px 0 var(--lang-line)}
.ec-cur-topic-btn--active{background:var(--lang-ink);color:var(--lang-lime)}
.ec-cur-topic-btn--active:hover{background:var(--lang-ink);color:var(--lang-lime)}
.ec-cur-topic-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ec-cur-topic-count{
  font-size:10.5px;font-weight:900;padding:3px 9px;border-radius:999px;
  background:var(--lang-lime);color:var(--lang-ink);border:2px solid var(--lang-line);flex-shrink:0;
}

/* WRITING BANK */
.ec-cur-bank-item{
  display:flex;align-items:center;justify-content:space-between;gap:12px;
  padding:13px 14px;border-radius:14px;
  background:var(--lang-pink);color:var(--lang-ink);
  border:2px solid var(--lang-line);font-size:13px;font-weight:800;
  transition:transform .16s ease,box-shadow .16s ease,background .16s ease;
  box-shadow:0 3px 0 var(--lang-line);min-height:var(--tap);
  word-break:break-word;text-align:left;width:100%;
}
.ec-cur-bank-item:hover{background:var(--lang-pink-2);color:#fff;transform:translateY(-2px);box-shadow:0 5px 0 var(--lang-line)}
.ec-cur-bank-item:active{transform:translateY(1px);box-shadow:0 1px 0 var(--lang-line)}

/* TRANSLATION */
.ec-cur-translation p.bn{font-size:17px;font-weight:900;margin:12px 0;color:var(--lang-ink);letter-spacing:-.015em}
.ec-cur-translation textarea{
  width:100%;border-radius:14px;border:2px solid var(--lang-line);
  padding:12px 14px;font-size:16px;font-weight:700;
  background:#fff;color:var(--lang-ink);outline:none;resize:vertical;
  box-shadow:0 3px 0 var(--lang-line);min-height:80px;
}
.ec-cur-translation textarea:focus{box-shadow:0 3px 0 var(--lang-line),0 0 0 3px rgba(212,245,92,.5)}
.ec-cur-translation-feedback{
  margin-top:10px;padding:10px 12px;border-radius:12px;
  font-size:12.5px;font-weight:800;line-height:1.5;
  border:2px solid var(--lang-line);box-shadow:0 2px 0 var(--lang-line);
}
.ec-cur-translation-feedback--good{background:var(--lang-lime-soft)}
.ec-cur-translation-feedback--bad{background:#FFE0EE}

/* SESSION */
.ec-cur-session-label{
  display:flex;justify-content:space-between;font-size:12.5px;font-weight:900;
  letter-spacing:.04em;text-transform:uppercase;margin-bottom:10px;
}

/* TOAST */
.ec-cur-xp-toast{
  position:fixed;top:78px;right:20px;z-index:50;
  background:var(--lang-ink);color:var(--lang-lime);
  padding:12px 22px;border-radius:999px;font-weight:900;font-size:13.5px;
  border:2px solid var(--lang-lime);box-shadow:0 12px 28px rgba(23,16,46,.4);
  animation:ec-toast-pop .9s ease both;letter-spacing:.03em;pointer-events:none;
  max-width:calc(100vw - 24px);
}
@keyframes ec-toast-pop{
  0%{transform:translateY(-10px) scale(.9);opacity:0}
  20%{transform:translateY(0) scale(1);opacity:1}
  80%{transform:translateY(0) scale(1);opacity:1}
  100%{transform:translateY(-8px) scale(.98);opacity:0}
}

@keyframes ec-cur-fade{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes ec-pop{0%{transform:scale(1)}50%{transform:scale(1.04)}100%{transform:scale(1)}}
.ec-pop{animation:ec-pop .35s cubic-bezier(.34,1.56,.64,1)}
@keyframes ec-shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}
.ec-shake{animation:ec-shake .4s ease}

/* PARAGRAPHS */
.ec-para-list{display:flex;flex-direction:column;gap:8px}
.ec-para-item{
  display:flex;align-items:center;justify-content:space-between;gap:10px;
  padding:12px 14px;border-radius:14px;border:2px solid var(--lang-line);
  background:#fff;color:var(--lang-ink);font-size:13px;font-weight:800;text-align:left;width:100%;
  box-shadow:0 3px 0 var(--lang-line);min-height:var(--tap);
  transition:transform .15s ease,box-shadow .15s ease,background .15s ease;
}
.ec-para-item:hover{background:var(--lang-lime-soft);transform:translateY(-1px);box-shadow:0 4px 0 var(--lang-line)}
.ec-para-item:active{transform:translateY(1px);box-shadow:0 1px 0 var(--lang-line)}
.ec-para-item--active{background:var(--lang-ink);color:var(--lang-lime)}
.ec-para-item--active:hover{background:var(--lang-ink)}
.ec-para-item-title{flex:1;min-width:0;overflow-wrap:anywhere}
.ec-para-text{
  margin:0 0 16px;font-size:15px;line-height:1.85;font-weight:600;color:var(--lang-ink);
  background:var(--lang-lime-soft);border:2px solid var(--lang-line);border-radius:14px;
  padding:16px 18px;box-shadow:0 2px 0 var(--lang-line);overflow-wrap:anywhere;
}
.ec-para-actions{display:flex;gap:10px;flex-wrap:wrap}
.ec-passage{
  margin:0 0 14px;border:2px dashed var(--lang-line);border-radius:14px;
  background:var(--lang-lime-soft);padding:8px 14px;
}
.ec-passage summary{
  font-size:11.5px;font-weight:900;letter-spacing:.06em;text-transform:uppercase;
  color:var(--lang-ink);cursor:pointer;min-height:36px;display:flex;align-items:center;
}
.ec-passage p{margin:4px 0 8px;font-size:13.5px;line-height:1.75;font-weight:600;color:var(--lang-ink);overflow-wrap:anywhere}

/* RESPONSIVE */
@media (max-width:1080px){.ec-cur-grid{grid-template-columns:minmax(0,1fr) 280px;gap:18px}}
@media (max-width:900px){
  .ec-cur-grid{grid-template-columns:1fr;gap:16px}
  .ec-cur-grid > section,.ec-cur-grid > aside{width:100%}
  .ec-cur-hero{flex-direction:column;align-items:flex-start;min-height:0}
  .ec-cur-hero-mascot{position:absolute;right:12px;bottom:12px;transform:scale(.7);transform-origin:bottom right;animation:none;opacity:.92}
  .ec-cur-topic-list{max-height:none;overflow:visible}
}
@media (max-width:720px){
  .ec-cur{padding-bottom:calc(var(--lang-nav-h) + var(--lang-safe) + 12px)}
  .ec-cur-head{margin-bottom:12px}
  .ec-cur-eyebrow{font-size:10.5px}
  .ec-cur-hero{padding:20px 18px;border-radius:22px;margin-bottom:16px}
  .ec-cur-hero h2{font-size:22px}
  .ec-cur-hero p{font-size:13px;margin-bottom:14px}
  .ec-cur-hero-badge{font-size:9.5px;padding:6px 11px;margin-bottom:12px}
  .ec-cur-hero-stats{gap:8px}
  .ec-cur-hero-stat{padding:8px 12px;min-width:72px;border-radius:12px}
  .ec-cur-hero-stat strong{font-size:17px}
  .ec-cur-hero-stat span{font-size:9px}
  .ec-cur-hero-mascot{display:none}
  .ec-cur-modes{margin-bottom:12px;padding:5px}
  .ec-cur-mode{padding:10px 12px;font-size:12.5px;min-height:44px}
  .ec-cur-filters{padding:12px;gap:8px;border-radius:18px;margin-bottom:14px}
  .ec-cur-pill{padding:10px 14px;font-size:12.5px;min-height:44px}
  .ec-cur-select{padding:10px 13px;font-size:12.5px;min-height:44px;width:100%}
  .ec-cur-check{padding:10px 13px;font-size:12.5px;min-height:44px}
  .ec-cur-cat{padding:11px 14px;font-size:12.5px;min-height:46px}
  .ec-cur-cat svg{width:14px;height:14px}
  .ec-cur-section{padding:16px;border-radius:20px;box-shadow:0 4px 0 var(--lang-line);margin-bottom:14px}
  .ec-cur-section-title{font-size:14.5px}
  .ec-lesson{padding:16px;border-radius:20px}
  .ec-lesson-title{font-size:16px}
  .ec-lesson-block{padding:12px 14px}
  .ec-lesson-block li{font-size:12.5px}
  .ec-quiz-question{font-size:15px;margin-bottom:12px}
  .ec-quiz-option{padding:14px 14px;font-size:14px;border-radius:12px;min-height:52px}
  .ec-quiz-explain{font-size:12px;padding:9px 11px}
  .ec-cur-topic-btn{padding:12px;font-size:12.5px;min-height:46px}
  .ec-cur-bank-item{padding:12px 13px;font-size:12.5px;min-height:46px}
  .ec-cur-translation p.bn{font-size:15.5px}
  .ec-para-text{font-size:14px;padding:14px;line-height:1.8}
  .ec-para-item{padding:12px;font-size:12.5px;min-height:46px}
  .ec-cur-xp-toast{
    top:auto;bottom:calc(var(--lang-nav-h) + var(--lang-safe) - 80px);
    right:12px;left:12px;text-align:center;padding:11px 18px;font-size:13px;
  }
  .ec-cur-filter-group{flex:1 1 100%}
}
@media (max-width:480px){
  .ec-cur-hero h2{font-size:20px}
  .ec-cur-hero p{font-size:12.5px}
  .ec-cur-hero-stat strong{font-size:15px}
  .ec-cur-hero-stat span{font-size:8.5px}
  .ec-quiz-question{font-size:14.5px}
  .ec-quiz-option{font-size:13.5px;padding:13px 13px}
  .ec-lesson-title{font-size:15px}
  .ec-cur-mode{font-size:12px;padding:9px 10px;min-height:42px}
}
@media (max-width:380px){
  .ec-cur-pill{padding:9px 12px;font-size:12px}
  .ec-cur-cat{padding:10px 12px;font-size:12px}
  .ec-cur-hero h2{font-size:18px}
  .ec-quiz-option{font-size:13px;padding:12px}
}
@media (prefers-reduced-motion: reduce){
  .ec-cur *,*::before,*::after{animation-duration:.001ms!important;transition-duration:.001ms!important}
}

/* ============ POLISH LAYER (Bangla typography · translation UI) ============ */
.ec-bn,.ec-cur p.bn,.ec-lesson-bn,.ec-cur-translation-label{
  font-family:'Hind Siliguri','Noto Sans Bengali','Kalpurush','SolaimanLipi','Nirmala UI',system-ui,-apple-system,'Segoe UI',sans-serif;
}
.ec-quiz-question.ec-bn,.ec-cur p.bn,.ec-lesson-bn{letter-spacing:0;line-height:1.6}
.ec-quiz-option.ec-bn{font-size:15.5px;line-height:1.55}

/* lettered answer chips (A · B · C · D) */
.ec-quiz-options{counter-reset:ecopt}
.ec-quiz-option::before{
  counter-increment:ecopt;content:counter(ecopt,upper-alpha);
  flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;
  width:28px;height:28px;margin-right:12px;border-radius:9px;
  border:2px solid var(--lang-line);background:var(--lang-lime-soft);color:var(--lang-ink);
  font-family:inherit;font-size:12px;font-weight:900;letter-spacing:0;
  transition:background .16s ease,transform .16s ease;
}
.ec-quiz-option:hover:not(:disabled)::before{background:var(--lang-lime);transform:rotate(-6deg) scale(1.06)}
.ec-quiz-option--correct::before,.ec-quiz-option--incorrect::before{background:#fff}

/* direction chip above a translation question */
.ec-quiz-dir{
  display:inline-flex;align-items:center;gap:6px;margin:0 0 10px;
  padding:6px 13px;border-radius:999px;border:2px solid var(--lang-line);
  font-size:11px;font-weight:900;letter-spacing:.04em;color:var(--lang-ink);
  box-shadow:0 2px 0 var(--lang-line);max-width:100%;
  font-family:'Hind Siliguri','Noto Sans Bengali','Kalpurush','Nirmala UI',system-ui,sans-serif;
}
.ec-quiz-dir--en{background:var(--lang-mint)}
.ec-quiz-dir--bn{background:var(--lang-pink)}

/* source-sentence card for translation questions */
.ec-quiz-question--src{
  position:relative;padding:18px 18px 18px 22px;border-radius:18px;
  background:linear-gradient(150deg,var(--lang-lime-soft) 0%,#fff 70%);
  border:2px solid var(--lang-line);box-shadow:0 4px 0 var(--lang-line);
  font-size:clamp(16px,1vw + 13px,20px);
}
.ec-quiz-question--src::before{
  content:'';position:absolute;left:0;top:14px;bottom:14px;width:6px;border-radius:0 6px 6px 0;
  background:linear-gradient(180deg,var(--lang-purple-2),var(--lang-pink-2));
}

/* typed translation practice card */
.ec-cur-translation{position:relative;overflow:hidden}
.ec-cur-translation::after{
  content:'';position:absolute;right:-46px;top:-46px;width:130px;height:130px;border-radius:50%;
  background:radial-gradient(circle,rgba(155,123,255,.22),transparent 70%);pointer-events:none;
}
.ec-cur-translation > *{position:relative;z-index:1}
.ec-cur-translation-label{margin:0;font-size:12.5px;color:var(--lang-ink-soft);font-weight:700}
.ec-cur-translation p.bn{
  padding:16px 18px;border-radius:16px;font-size:19px;font-weight:800;
  background:linear-gradient(150deg,var(--lang-lime-soft) 0%,#fff 75%);
  border:2px solid var(--lang-line);box-shadow:0 4px 0 var(--lang-line);
}
.ec-cur-translation-feedback{animation:ec-cur-pop-in .28s cubic-bezier(.22,1,.36,1) both}
@keyframes ec-cur-pop-in{from{opacity:0;transform:translateY(6px) scale(.98)}to{opacity:1;transform:none}}

/* lesson Bangla note */
.ec-lesson-bn{font-size:13.5px;font-weight:700;line-height:1.75}

@media (max-width:720px){
  .ec-cur-translation p.bn{font-size:16px;padding:14px 15px}
  .ec-quiz-question--src{padding:15px 15px 15px 19px}
  .ec-quiz-option::before{width:26px;height:26px;margin-right:10px}
  .ec-quiz-option.ec-bn{font-size:14.5px}
}
`;

/* ============================================================
   QUESTION BANK — core categories only (IELTS removed)
   Each category: name, icon, class, lesson, questions
   ============================================================ */
const QUESTION_BANK = {
  verbs: {
    name: 'Right Form of Verbs', icon: 'target', class: 'all',
    lesson: {
      rules: [
        'Present simple: add <code>-s</code> for he/she/it (He goes).',
        'Universal truths use present simple (The sun rises).',
        'Past time markers (yesterday, last week) → past simple.',
        'Interrupted past action → past continuous (was/were + V-ing).',
        '"Already / just / yet" → present perfect (have/has + V3).',
        '"Since / for" with continuing time → present perfect continuous.',
        'Earlier of two past actions → past perfect (had + V3).',
        'Future perfect: will have + V3 (By next year, I will have finished).',
        'If-clause type 1 → present simple in if-clause.',
      ],
      examples: [
        'She <strong>goes</strong> to school every day.',
        'Water <strong>boils</strong> at 100°C.',
        'They <strong>played</strong> football yesterday.',
        'I <strong>have finished</strong> my homework already.',
      ],
      bangla: 'প্রেজেন্ট সিম্পলে তৃতীয় পুরুষ একবচনে -s যোগ হয়। অতীত কালের নির্দেশক থাকলে past simple, "already/since/for" থাকলে present perfect।',
    },
    questions: [
      { p:'He ___ to school every day.', o:['go','goes','going','gone'], a:'goes', e:'3rd person singular -s.', b:'৩য় পুরুষ একবচনে -s।' },
      { p:'The sun ___ in the east.', o:['rise','rises','rising','rose'], a:'rises', e:'Universal truth.', b:'সর্বজনীন সত্য।' },
      { p:'They ___ football yesterday.', o:['play','plays','played','playing'], a:'played', e:'Past time → past simple.', b:'অতীত কাল → past simple।' },
      { p:'She ___ TV when I called.', o:['watch','watches','was watching','watched'], a:'was watching', e:'Interrupted past.', b:'অতীতের চলমান।' },
      { p:'I ___ my homework already.', o:['finish','finishes','have finished','finished'], a:'have finished', e:'"Already" → present perfect.', b:'"Already" → present perfect।' },
      { p:'Water ___ at 100°C.', o:['boil','boils','boiling','boiled'], a:'boils', e:'General truth.', b:'সাধারণ সত্য।' },
      { p:'We ___ to Dhaka next week.', o:['go','goes','will go','went'], a:'will go', e:'Future intent.', b:'ভবিষ্যৎ ইচ্ছা।' },
      { p:'He ___ his keys.', o:['lose','loses','has lost','lost'], a:'has lost', e:'Result now.', b:'ফলাফল এখন।' },
      { p:'By next year, I ___ my degree.', o:['finish','finishes','will have finished','finished'], a:'will have finished', e:'Future perfect.', b:'Future perfect।' },
      { p:'The train ___ before we arrived.', o:['leave','leaves','had left','left'], a:'had left', e:'Earlier past.', b:'আগের অতীত।' },
      { p:'Look! The baby ___ .', o:['cries','cried','is crying','cry'], a:'is crying', e:'Happening now.', b:'এখন ঘটছে।' },
      { p:'She ___ here since 2015.', o:['live','lives','has lived','lived'], a:'has lived', e:'"Since" → present perfect.', b:'"Since" → present perfect।' },
      { p:'I ___ in Dhaka for five years.', o:['live','lived','have lived','am living'], a:'have lived', e:'Duration.', b:'ব্যাপ্তি।' },
      { p:'It ___ since morning.', o:['rain','rains','has been raining','rained'], a:'has been raining', e:'Perfect continuous.', b:'Perfect continuous।' },
      { p:'We ___ each other for ten years.', o:['know','knows','have known','knew'], a:'have known', e:'Duration → present perfect.', b:'ব্যাপ্তি।' },
      { p:'She ___ dinner before I arrived.', o:['cook','cooks','had cooked','cooked'], a:'had cooked', e:'Past perfect.', b:'Past perfect।' },
      { p:'He ___ English very well.', o:['speak','speaks','speaking','spoke'], a:'speaks', e:'3rd singular.', b:'৩য় একবচন।' },
      { p:'If he ___ hard, he will succeed.', o:['work','works','worked','working'], a:'works', e:'First conditional.', b:'First conditional।' },
      { p:'I have never ___ sushi.', o:['eat','eats','eaten','ate'], a:'eaten', e:'Have + V3.', b:'Have + V3।' },
      { p:'The children ___ in the garden now.', o:['play','plays','are playing','played'], a:'are playing', e:'Present continuous plural.', b:'বহুবচন present continuous।' },
      { p:'He ___ football when he was young.', o:['play','plays','played','playing'], a:'played', e:'Past habit.', b:'অতীত অভ্যাস।' },
      { p:'It ___ hard when we left.', o:['rain','rains','was raining','rained'], a:'was raining', e:'Past continuous.', b:'Past continuous।' },
      { p:'I ___ my keys this morning.', o:['lose','loses','lost','have lost'], a:'lost', e:'Finished past time.', b:'শেষ হওয়া অতীত।' },
      { p:'The shop ___ at 9 AM daily.', o:['open','opens','opening','opened'], a:'opens', e:'Routine singular.', b:'রুটিন একবচন।' },
      { p:'My sister ___ English very well.', o:['speak','speaks','speaking','spoke'], a:'speaks', e:'3rd singular.', b:'৩য় একবচন।' },
      { p:'The train ___ at 8 AM every day.', o:['leave','leaves','leaving','left'], a:'leaves', e:'Scheduled.', b:'নির্ধারিত।' },
      { p:'She ___ her teeth twice a day.', o:['brush','brushes','brushing','brushed'], a:'brushes', e:'-es for singular.', b:'একবচনে -es।' },
      { p:'I ___ fish, but my brother hates it.', o:['love','loves','loving','loved'], a:'love', e:'"I" + base.', b:'"I" + base।' },
      { p:'Buses ___ every fifteen minutes.', o:['come','comes','coming','came'], a:'come', e:'Plural subject.', b:'বহুবচন subject।' },
      { p:'He ___ a new car last week.', o:['buy','buys','bought','buying'], a:'bought', e:'Past simple.', b:'Past simple।' },
      { p:'She ___ the answer to the question.', o:['know','knows','knew','known'], a:'knew', e:'Past simple.', b:'Past simple।' },
      { p:'They ___ to Paris in 2019.', o:['travel','travels','traveled','traveling'], a:'traveled', e:'Past simple.', b:'Past simple।' },
      { p:'I ___ him at the party.', o:['meet','meets','met','meeting'], a:'met', e:'Past irregular.', b:'অতীত irregular।' },
      { p:'They ___ the game yesterday.', o:['win','wins','won','winning'], a:'won', e:'Past simple.', b:'Past simple।' },
      { p:'She ___ a beautiful song.', o:['sing','sings','sang','singing'], a:'sang', e:'Past simple.', b:'Past simple।' },
      { p:'I ___ a letter to my friend.', o:['write','writes','wrote','writing'], a:'wrote', e:'Past simple.', b:'Past simple।' },
      { p:'She ___ her grandmother last weekend.', o:['visit','visits','visited','visiting'], a:'visited', e:'Past simple.', b:'Past simple।' },
      { p:'The kids ___ in the garden at 3 PM.', o:['play','plays','were playing','played'], a:'were playing', e:'Past continuous plural.', b:'Past continuous plural।' },
      { p:'He ___ when I saw him.', o:['run','runs','was running','ran'], a:'was running', e:'Past continuous.', b:'Past continuous।' },
      { p:'We ___ about you when you walked in.', o:['talk','talks','were talking','talked'], a:'were talking', e:'Past continuous plural.', b:'Past continuous plural।' },
      { p:'The birds ___ when I woke up.', o:['sing','sings','were singing','sang'], a:'were singing', e:'Past continuous.', b:'Past continuous।' },
      { p:'She ___ for the test all evening.', o:['study','studies','was studying','studied'], a:'was studying', e:'Past continuous.', b:'Past continuous।' },
      { p:'By the time we arrived, the movie ___ .', o:['start','starts','had started','started'], a:'had started', e:'Past perfect.', b:'Past perfect।' },
      { p:'She ___ the report before the meeting.', o:['finish','finishes','had finished','finished'], a:'had finished', e:'Past perfect.', b:'Past perfect।' },
      { p:'I had never ___ such a beautiful place.', o:['see','saw','seen','seeing'], a:'seen', e:'Had + V3.', b:'Had + V3।' },
      { p:'They ___ the house before I got there.', o:['leave','leaves','had left','left'], a:'had left', e:'Past perfect.', b:'Past perfect।' },
      { p:'She was tired because she ___ all night.', o:['work','works','had been working','worked'], a:'had been working', e:'Past perfect continuous.', b:'Past perfect continuous।' },
      { p:'The ground was wet because it ___ .', o:['rain','rains','had been raining','rained'], a:'had been raining', e:'Past perfect continuous.', b:'Past perfect continuous।' },
      { p:'He was out of breath because he ___ .', o:['run','runs','had been running','ran'], a:'had been running', e:'Past perfect continuous.', b:'Past perfect continuous।' },
      { p:'I ___ you tomorrow.', o:['call','calls','will call','called'], a:'will call', e:'Future simple.', b:'Future simple।' },
      { p:'She ___ to the party next week.', o:['come','comes','will come','came'], a:'will come', e:'Future simple.', b:'Future simple।' },
      { p:'They ___ the project by Friday.', o:['finish','finishes','will finish','finished'], a:'will finish', e:'Future simple.', b:'Future simple।' },
      { p:'We ___ dinner at 8 PM.', o:['have','has','will have','had'], a:'will have', e:'Future simple.', b:'Future simple।' },
      { p:'He ___ the answer.', o:['know','knows','will know','knew'], a:'will know', e:'Future simple.', b:'Future simple।' },
      { p:'It ___ rain tomorrow.', o:['will','is','was','does'], a:'will', e:'Future.', b:'ভবিষ্যৎ।' },
      { p:'I promise I ___ late.', o:["won't be",'is not','was not','are not'], a:"won't be", e:'Future negative.', b:'Future negative।' },
      { p:'This time tomorrow, I ___ on a beach.', o:['lie','lies','will be lying','lay'], a:'will be lying', e:'Future continuous.', b:'Future continuous।' },
      { p:'By 2030, he ___ for 20 years.', o:['work','works','will have worked','worked'], a:'will have worked', e:'Future perfect.', b:'Future perfect।' },
      { p:'If it ___ tomorrow, we will stay home.', o:['rain','rains','rained','raining'], a:'rains', e:'First conditional.', b:'First conditional।' },
      { p:'If I ___ rich, I would travel.', o:['am','was','were','be'], a:'were', e:'Second conditional.', b:'Second conditional।' },
      { p:'If she ___ harder, she would have passed.', o:['study','studied','had studied','studies'], a:'had studied', e:'Third conditional.', b:'Third conditional।' },
      { p:'If you heat ice, it ___ .', o:['melt','melts','melted','melting'], a:'melts', e:'Zero conditional.', b:'Zero conditional।' },
      { p:'If I ___ you, I would apologize.', o:['am','was','were','be'], a:'were', e:'Subjunctive.', b:'Subjunctive।' },
      { p:'If he ___ earlier, he would have caught the train.', o:['leave','left','had left','leaves'], a:'had left', e:'Third conditional.', b:'Third conditional।' },
      { p:"I'll call you if I ___ any news.", o:['hear','hears','heard','hearing'], a:'hear', e:'First conditional.', b:'First conditional।' },
      { p:'If you ___ the button, the machine stops.', o:['press','presses','pressed','pressing'], a:'press', e:'Zero conditional.', b:'Zero conditional।' },
      { p:"If it ___ sunny, we'll go to the beach.", o:['is','was','were','be'], a:'is', e:'First conditional.', b:'First conditional।' },
      { p:'If I ___ more time, I would help you.', o:['have','has','had','having'], a:'had', e:'Second conditional.', b:'Second conditional।' },
      { p:'If she ___ the truth, she would have told us.', o:['know','knew','had known','knows'], a:'had known', e:'Third conditional.', b:'Third conditional।' },
      { p:'What would you do if you ___ a million dollars?', o:['win','wins','won','winning'], a:'won', e:'Second conditional.', b:'Second conditional।' },
      { p:"Unless you ___ , you'll be late.", o:['hurry','hurries','hurried','hurrying'], a:'hurry', e:'"Unless" = if not.', b:'"Unless" = যদি না।' },
      { p:"If you don't water plants, they ___ .", o:['die','dies','died','dying'], a:'die', e:'First conditional.', b:'First conditional।' },
      { p:'If I ___ a bird, I would fly.', o:['am','was','were','be'], a:'were', e:'Subjunctive.', b:'Subjunctive।' },
    ],
  },

  articles: {
    name: 'Articles', icon: 'flag', class: 'all',
    lesson: {
      rules: [
        '<code>a</code> before consonant sound; <code>an</code> before vowel sound.',
        '<code>an</code> before silent-h words: honest, hour, honour.',
        '<code>a</code> before "yoo" sound words: university, European, useful.',
        '<code>the</code> for unique objects: the sun, the moon, the Padma.',
        '<code>the</code> before superlatives: the best, the tallest.',
        'No article with languages, meals, sports, subjects.',
        '<code>the</code> with rivers, seas, mountain ranges, monuments.',
      ],
      examples: [
        'She is <strong>an</strong> honest student.',
        'He is <strong>a</strong> university student.',
        '<strong>The</strong> Padma is long.',
        'He plays <strong>cricket</strong>.',
      ],
      bangla: 'Vowel sound থাকলে an, consonant sound থাকলে a। Silent h থাকলেও an। Unique জিনিসের আগে the।',
    },
    questions: [
      { p:'She is ___ honest student.', o:['a','an','the','—'], a:'an', e:'Silent h → vowel sound.', b:'Silent h → vowel sound।' },
      { p:'I saw ___ elephant.', o:['a','an','the','—'], a:'an', e:'Vowel sound.', b:'Vowel sound।' },
      { p:'___ Padma is long.', o:['A','An','The','—'], a:'The', e:'River → the.', b:'নদী → the।' },
      { p:'He plays ___ cricket.', o:['a','an','the','—'], a:'—', e:'Sport → no article.', b:'খেলা → article নেই।' },
      { p:'I bought ___ umbrella.', o:['a','an','the','—'], a:'an', e:'Vowel sound.', b:'Vowel sound।' },
      { p:'He is ___ best student.', o:['a','an','the','—'], a:'the', e:'Superlative.', b:'Superlative।' },
      { p:'She is ___ doctor.', o:['a','an','the','—'], a:'a', e:'Consonant sound.', b:'Consonant sound।' },
      { p:'___ book on the table is mine.', o:['A','An','The','—'], a:'The', e:'Specific.', b:'নির্দিষ্ট।' },
      { p:'She has ___ MBA.', o:['a','an','the','—'], a:'an', e:'"Em" = vowel.', b:'"Em" = vowel।' },
      { p:'___ Sun rises in the east.', o:['A','An','The','—'], a:'The', e:'Unique.', b:'একক।' },
      { p:'He speaks ___ English fluently.', o:['a','an','the','—'], a:'—', e:'Language → no article.', b:'ভাষা → article নেই।' },
      { p:'My brother is ___ engineer.', o:['a','an','the','—'], a:'an', e:'Vowel sound.', b:'Vowel sound।' },
      { p:'I like ___ music.', o:['a','an','the','—'], a:'—', e:'General.', b:'সাধারণ।' },
      { p:'___ Himalayas are in Asia.', o:['A','An','The','—'], a:'The', e:'Mountain range.', b:'পর্বতমালা।' },
      { p:'I saw ___ interesting movie.', o:['a','an','the','—'], a:'an', e:'Vowel sound.', b:'Vowel sound।' },
      { p:'___ Nile is the longest river.', o:['A','An','The','—'], a:'The', e:'River.', b:'নদী।' },
      { p:'I need ___ hour.', o:['a','an','the','—'], a:'an', e:'Silent h.', b:'Silent h।' },
      { p:'She plays ___ piano.', o:['a','an','the','—'], a:'the', e:'Instrument.', b:'বাদ্যযন্ত্র।' },
      { p:'___ rich should help the poor.', o:['A','An','The','—'], a:'The', e:'Group adjective.', b:'গোষ্ঠী।' },
      { p:'Give me ___ pen.', o:['a','an','the','—'], a:'a', e:'Consonant.', b:'Consonant।' },
      { p:'He is ___ MBA graduate.', o:['a','an','the','—'], a:'an', e:'Vowel start.', b:'Vowel start।' },
      { p:'We visited ___ Taj Mahal.', o:['a','an','the','—'], a:'the', e:'Monument.', b:'স্মৃতিস্তম্ভ।' },
      { p:'He goes to ___ school.', o:['a','an','the','—'], a:'—', e:'Institution.', b:'প্রতিষ্ঠান।' },
      { p:'___ Alps are in Europe.', o:['A','An','The','—'], a:'The', e:'Mountain range.', b:'পর্বতমালা।' },
      { p:'I have ___ idea.', o:['a','an','the','—'], a:'an', e:'Vowel sound.', b:'Vowel sound।' },
      { p:'___ Pacific is the largest ocean.', o:['A','An','The','—'], a:'The', e:'Ocean.', b:'মহাসাগর।' },
      { p:'She bought ___ new car.', o:['a','an','the','—'], a:'a', e:'Consonant.', b:'Consonant।' },
      { p:'___ Ganges is sacred.', o:['A','An','The','—'], a:'The', e:'River.', b:'নদী।' },
      { p:'I read ___ book yesterday.', o:['a','an','the','—'], a:'a', e:'First mention.', b:'প্রথম উল্লেখ।' },
      { p:'___ moon looks beautiful tonight.', o:['A','An','The','—'], a:'The', e:'Unique.', b:'একক।' },
      { p:'She is ___ European.', o:['a','an','the','—'], a:'a', e:'"Yoo" sound.', b:'"Yoo" ধ্বনি।' },
      { p:'He is ___ university student.', o:['a','an','the','—'], a:'a', e:'"Yoo" sound.', b:'"Yoo" ধ্বনি।' },
      { p:'She is ___ artist.', o:['a','an','the','—'], a:'an', e:'Vowel sound.', b:'Vowel sound।' },
      { p:'That was ___ excellent meal.', o:['a','an','the','—'], a:'an', e:'Vowel sound.', b:'Vowel sound।' },
      { p:'What ___ beautiful day!', o:['a','an','the','—'], a:'a', e:'Countable exclamatory.', b:'গণনাযোগ্য exclamatory।' },
      { p:'That is ___ useful tool.', o:['a','an','the','—'], a:'a', e:'"Yoo" sound.', b:'"Yoo" ধ্বনি।' },
      { p:'She found ___ old coin.', o:['a','an','the','—'], a:'an', e:'Vowel sound.', b:'Vowel sound।' },
      { p:'I go to ___ school every day.', o:['a','an','the','—'], a:'—', e:'Institution.', b:'প্রতিষ্ঠান।' },
      { p:'She went to ___ hospital last week.', o:['a','an','the','—'], a:'the', e:'Specific visit.', b:'নির্দিষ্ট ভিজিট।' },
      { p:'He plays ___ guitar.', o:['a','an','the','—'], a:'the', e:'Instrument.', b:'বাদ্যযন্ত্র।' },
      { p:'___ Amazon is a big river.', o:['A','An','The','—'], a:'The', e:'River.', b:'নদী।' },
      { p:'___ Philippines is in Asia.', o:['A','An','The','—'], a:'The', e:'Plural country name.', b:'বহুবচন দেশ।' },
      { p:'I love ___ music.', o:['a','an','the','—'], a:'—', e:'General.', b:'সাধারণ।' },
      { p:'She studies ___ history.', o:['a','an','the','—'], a:'—', e:'Subject.', b:'বিষয়।' },
      { p:'___ USA is a big country.', o:['A','An','The','—'], a:'The', e:'"The" with country.', b:'দেশের সাথে "the"।' },
    ],
  },

  prepositions: {
    name: 'Prepositions', icon: 'chat', class: 'all',
    lesson: {
      rules: [
        '<code>at</code> for clock time, points: at 5 PM, at the corner.',
        '<code>on</code> for days, dates, surfaces: on Friday, on the table.',
        '<code>in</code> for months, years, cities, countries: in July, in Dhaka.',
        '<code>for</code> duration: for five years.',
        '<code>since</code> starting point: since 2010.',
        'Fixed collocations: good at, afraid of, interested in, depend on.',
      ],
      examples: [
        'I will meet you <strong>on</strong> Friday.',
        'She arrived <strong>at</strong> 6 PM.',
        'He has lived here <strong>for</strong> five years.',
        'He is good <strong>at</strong> mathematics.',
      ],
      bangla: 'সময়ের বিন্দু → at, দিন/তারিখ → on, মাস/বছর/শহর → in। "Since" শুরুর সময়, "for" ব্যাপ্তি।',
    },
    questions: [
      { p:'I will meet you ___ Friday.', o:['in','on','at','by'], a:'on', e:'Days → on.', b:'দিন → on।' },
      { p:'The book is ___ the table.', o:['in','on','at','under'], a:'on', e:'Surface.', b:'পৃষ্ঠ।' },
      { p:'She arrived ___ 6 PM.', o:['in','on','at','for'], a:'at', e:'Clock time.', b:'ঘড়ির সময়।' },
      { p:'We live ___ Chattogram.', o:['in','on','at','to'], a:'in', e:'City.', b:'শহর।' },
      { p:'He is good ___ mathematics.', o:['in','on','at','for'], a:'at', e:'Good at.', b:'Good at।' },
      { p:'We waited ___ the bus.', o:['on','for','to','at'], a:'for', e:'Wait for.', b:'Wait for।' },
      { p:'She is interested ___ art.', o:['at','in','on','for'], a:'in', e:'Interested in.', b:'Interested in।' },
      { p:'He is afraid ___ dogs.', o:['at','of','in','on'], a:'of', e:'Afraid of.', b:'Afraid of।' },
      { p:'I arrived ___ the airport at 5.', o:['in','on','at','to'], a:'at', e:'Point.', b:'বিন্দু।' },
      { p:'They depend ___ their parents.', o:['on','in','at','for'], a:'on', e:'Depend on.', b:'Depend on।' },
      { p:'She listens ___ music.', o:['at','to','in','on'], a:'to', e:'Listen to.', b:'Listen to।' },
      { p:'We will meet ___ the corner.', o:['at','in','on','to'], a:'at', e:'At the corner.', b:'At the corner।' },
      { p:'He was born ___ 1990.', o:['at','in','on','for'], a:'in', e:'Years → in.', b:'বছর → in।' },
      { p:'The pen is ___ the drawer.', o:['in','on','at','to'], a:'in', e:'Enclosed.', b:'বদ্ধ স্থান।' },
      { p:'She walked ___ the bridge.', o:['on','over','at','in'], a:'over', e:'Across.', b:'উপর দিয়ে।' },
      { p:'I will see you ___ Monday morning.', o:['in','on','at','by'], a:'on', e:'Specific day.', b:'নির্দিষ্ট দিন।' },
      { p:'She was born ___ December.', o:['in','on','at','by'], a:'in', e:'Months → in.', b:'মাস → in।' },
      { p:'He is married ___ my sister.', o:['with','to','for','at'], a:'to', e:'Married to.', b:'Married to।' },
      { p:'I am angry ___ him.', o:['on','with','at','in'], a:'with', e:'Angry with (person).', b:'ব্যক্তি সহ with।' },
      { p:'She is famous ___ her cooking.', o:['of','for','in','at'], a:'for', e:'Famous for.', b:'Famous for।' },
      { p:'We arrived ___ London.', o:['at','in','on','to'], a:'in', e:'Cities → in.', b:'শহর → in।' },
      { p:'He is responsible ___ the project.', o:['of','for','in','at'], a:'for', e:'Responsible for.', b:'Responsible for।' },
      { p:'She is different ___ her sister.', o:['than','from','to','of'], a:'from', e:'Different from.', b:'Different from।' },
      { p:'I am tired ___ waiting.', o:['of','from','with','at'], a:'of', e:'Tired of.', b:'Tired of।' },
      { p:'He apologized ___ being late.', o:['of','for','to','at'], a:'for', e:'Apologize for.', b:'Apologize for।' },
      { p:'We walked ___ the river.', o:['along','in','at','to'], a:'along', e:'Beside.', b:'পাশ দিয়ে।' },
      { p:'I have been here ___ Monday.', o:['from','since','for','at'], a:'since', e:'Starting point.', b:'শুরুর সময়।' },
      { p:'She has worked here ___ five years.', o:['since','for','in','at'], a:'for', e:'Duration.', b:'ব্যাপ্তি।' },
      { p:'He died ___ cancer.', o:['of','from','by','with'], a:'of', e:'Cause of death.', b:'মৃত্যুর কারণ।' },
      { p:'I am looking forward ___ the trip.', o:['to','for','at','in'], a:'to', e:'Look forward to.', b:'Look forward to।' },
      { p:'She is allergic ___ cats.', o:['to','with','at','in'], a:'to', e:'Allergic to.', b:'Allergic to।' },
      { p:'It depends ___ the weather.', o:['at','on','in','with'], a:'on', e:'Depend on.', b:'Depend on।' },
      { p:'The picture is ___ the wall.', o:['in','on','at','by'], a:'on', e:'Surface.', b:'পৃষ্ঠ।' },
      { p:'I usually wake up ___ 7 AM.', o:['in','on','at','by'], a:'at', e:'Clock time.', b:'ঘড়ির সময়।' },
      { p:'She studies ___ the university.', o:['in','on','at','by'], a:'at', e:'Institution point.', b:'প্রতিষ্ঠান বিন্দু।' },
      { p:'I am going ___ holiday next week.', o:['in','on','at','by'], a:'on', e:'On holiday.', b:'On holiday।' },
      { p:'The restaurant is ___ the corner.', o:['in','on','at','by'], a:'on', e:'Corner.', b:'কোণা।' },
      { p:'Let us meet ___ the park.', o:['in','on','at','by'], a:'at', e:'Meeting point.', b:'মিলনস্থল।' },
      { p:'She is proud ___ her son.', o:['at','in','of','with'], a:'of', e:'Proud of.', b:'Proud of।' },
      { p:'I am worried ___ the exam.', o:['at','about','of','with'], a:'about', e:'Worried about.', b:'Worried about।' },
      { p:'He is capable ___ doing it.', o:['at','in','of','with'], a:'of', e:'Capable of.', b:'Capable of।' },
      { p:'I am familiar ___ this city.', o:['at','in','with','to'], a:'with', e:'Familiar with.', b:'Familiar with।' },
      { p:'They are satisfied ___ the result.', o:['at','in','with','on'], a:'with', e:'Satisfied with.', b:'Satisfied with।' },
      { p:'He is engaged ___ my friend.', o:['to','with','at','in'], a:'to', e:'Engaged to.', b:'Engaged to।' },
      { p:'I am not used ___ this weather.', o:['at','in','to','with'], a:'to', e:'Used to.', b:'Used to।' },
      { p:'She is similar ___ her mother.', o:['to','with','at','in'], a:'to', e:'Similar to.', b:'Similar to।' },
      { p:'He suffers ___ headaches.', o:['at','in','from','with'], a:'from', e:'Suffer from.', b:'Suffer from।' },
      { p:'This is made ___ wood.', o:['at','in','of','with'], a:'of', e:'Made of.', b:'Made of।' },
      { p:'She is keen ___ learning.', o:['at','on','of','with'], a:'on', e:'Keen on.', b:'Keen on।' },
      { p:'We talked ___ the phone.', o:['in','on','at','by'], a:'on', e:'On the phone.', b:'On the phone।' },
    ],
  },

  connectors: {
    name: 'Sentence Connectors', icon: 'zap', class: 'all',
    lesson: {
      rules: [
        '<code>so</code> — result; <code>because</code> — cause.',
        '<code>but</code> — contrast; <code>although/though</code> — concession.',
        '<code>unless</code> = if not; <code>whether…or</code> — alternative.',
        '<code>so that</code> — purpose; <code>in case</code> — precaution.',
        'Correlative: both…and, either…or, neither…nor, not only…but also.',
      ],
      examples: [
        'He studied hard, <strong>so</strong> he passed.',
        '<strong>Although</strong> it was raining, we went out.',
        'I will not go <strong>unless</strong> you allow me.',
        'He is <strong>not only</strong> intelligent <strong>but also</strong> hardworking.',
      ],
      bangla: 'ফলাফল → so, কারণ → because, বৈপরীত্য → but/although, শর্ত → if/unless। Correlative conjunction জোড়ায় জোড়ায় বসে।',
    },
    questions: [
      { p:'He studied hard, ___ he passed.', o:['so','but','or','because'], a:'so', e:'Result.', b:'ফলাফল।' },
      { p:'She is smart ___ lazy.', o:['but','and','or','because'], a:'but', e:'Contrast.', b:'বৈপরীত্য।' },
      { p:'I stayed home ___ it was raining.', o:['because','although','but','so'], a:'because', e:'Cause.', b:'কারণ।' },
      { p:'___ it was raining, we went out.', o:['Although','Because','But','So'], a:'Although', e:'Concession.', b:'ছাড়।' },
      { p:'Do you want tea ___ coffee?', o:['or','and','but','so'], a:'or', e:'Choice.', b:'বিকল্প।' },
      { p:'He is tall ___ his brother is short.', o:['while','because','so','although'], a:'while', e:'Simultaneous contrast.', b:'একই সময়ের বৈপরীত্য।' },
      { p:'I will wait ___ you come.', o:['until','because','although','but'], a:'until', e:'Time.', b:'সময়।' },
      { p:'She was tired, ___ she went to bed.', o:['so','because','although','or'], a:'so', e:'Result.', b:'ফলাফল।' },
      { p:'___ he was late, he got the job.', o:['Although','Because','But','So'], a:'Although', e:'Concession.', b:'ছাড়।' },
      { p:'I will call you ___ I arrive.', o:['when','because','although','but'], a:'when', e:'Time.', b:'সময়।' },
      { p:'It was raining, ___ we stayed inside.', o:['so','but','or','because'], a:'so', e:'Result.', b:'ফলাফল।' },
      { p:'She sings well ___ she dances better.', o:['but','and','or','so'], a:'but', e:'Contrast.', b:'বৈপরীত্য।' },
      { p:'He is rich, ___ he is not happy.', o:['but','and','or','so'], a:'but', e:'Contrast.', b:'বৈপরীত্য।' },
      { p:'I do not know ___ he will come.', o:['if','that','which','who'], a:'if', e:'Indirect question.', b:'Indirect question।' },
      { p:'___ you work hard, you will pass.', o:['If','Because','But','So'], a:'If', e:'Condition.', b:'শর্ত।' },
      { p:'He is neither rich ___ famous.', o:['nor','or','and','but'], a:'nor', e:'Neither…nor.', b:'Neither…nor।' },
      { p:'She is both smart ___ kind.', o:['and','or','but','nor'], a:'and', e:'Both…and.', b:'Both…and।' },
      { p:'___ he is poor, he is honest.', o:['Though','Because','So','But'], a:'Though', e:'Concession.', b:'ছাড়।' },
      { p:'He failed ___ he did not study.', o:['because','but','or','so'], a:'because', e:'Cause.', b:'কারণ।' },
      { p:'I waited ___ he arrived.', o:['until','because','so','but'], a:'until', e:'Time.', b:'সময়।' },
      { p:'___ the rain, we went out.', o:['Despite','Because','So','And'], a:'Despite', e:'"Despite" + noun.', b:'"Despite" + noun।' },
      { p:'He works hard ___ he can succeed.', o:['so that','because','although','or'], a:'so that', e:'Purpose.', b:'উদ্দেশ্য।' },
      { p:'Take an umbrella ___ it rains.', o:['in case','because','so','but'], a:'in case', e:'Precaution.', b:'সতর্কতা।' },
      { p:'He is not only intelligent ___ hardworking.', o:['but also','and','or','so'], a:'but also', e:'Not only…but also.', b:'Not only…but also।' },
      { p:'___ I was young, I lived in Dhaka.', o:['When','Because','But','So'], a:'When', e:'Time.', b:'সময়।' },
      { p:'She was ill, ___ she did not go.', o:['so','but','or','and'], a:'so', e:'Result.', b:'ফলাফল।' },
      { p:'He ran fast ___ he missed the bus.', o:['but','and','or','so'], a:'but', e:'Contrast.', b:'বৈপরীত্য।' },
      { p:'I will help you ___ you ask.', o:['if','but','or','so'], a:'if', e:'Condition.', b:'শর্ত।' },
      { p:'He is slow ___ steady.', o:['but','and','or','so'], a:'but', e:'Contrast.', b:'বৈপরীত্য।' },
      { p:'___ the fog, the flight was delayed.', o:['Because of','Although','But','So'], a:'Because of', e:'"Because of" + noun.', b:'"Because of" + noun।' },
      { p:'He studied hard, ___ he failed.', o:['yet','so','and','or'], a:'yet', e:'Surprising contrast.', b:'অপ্রত্যাশিত বৈপরীত্য।' },
      { p:'___ you go or stay, I do not care.', o:['Whether','If','Because','So'], a:'Whether', e:'Whether…or.', b:'Whether…or।' },
      { p:'She ran fast ___ catch the train.', o:['to','for','so','because'], a:'to', e:'Infinitive of purpose.', b:'উদ্দেশ্যের infinitive।' },
      { p:'He is ___ tired that he cannot walk.', o:['so','such','very','much'], a:'so', e:'So…that.', b:'So…that।' },
      { p:'It was ___ a cold day that we stayed in.', o:['such','so','very','too'], a:'such', e:'Such a…that.', b:'Such a…that।' },
      { p:'He works hard ___ his brother is lazy.', o:['whereas','because','so','unless'], a:'whereas', e:'Direct contrast.', b:'সরাসরি বৈপরীত্য।' },
      { p:'___ the sun set, we went home.', o:['After','Before','Since','Until'], a:'After', e:'Sequence.', b:'ক্রম।' },
      { p:'We waited ___ the rain stopped.', o:['until','after','since','for'], a:'until', e:'Time limit.', b:'সময়সীমা।' },
      { p:'___ he tried, he could not pass.', o:['However','Because','So','And'], a:'However', e:'However + adj.', b:'However + adj।' },
      { p:'___ hard he tried, he could not pass.', o:['However','Whatever','Whenever','Wherever'], a:'However', e:'Concession.', b:'ছাড়।' },
      { p:'___ you say, I will not change my mind.', o:['Whatever','However','Whenever','Wherever'], a:'Whatever', e:'No matter what.', b:'যা-ই হোক।' },
      { p:'___ you go, I will follow.', o:['Wherever','Whatever','Whenever','However'], a:'Wherever', e:'No matter where.', b:'যেখানেই হোক।' },
      { p:'I will be there ___ you need me.', o:['whenever','whatever','however','wherever'], a:'whenever', e:'No matter when.', b:'যখনই হোক।' },
      { p:'She is not only beautiful ___ intelligent.', o:['but also','and','or','so'], a:'but also', e:'Correlative.', b:'Correlative।' },
      { p:'He is either a doctor ___ an engineer.', o:['or','nor','and','but'], a:'or', e:'Either…or.', b:'Either…or।' },
      { p:'___ he is talented, he lacks confidence.', o:['Although','Because','So','And'], a:'Although', e:'Contrast.', b:'বৈপরীত্য।' },
      { p:'I will go ___ you allow me.', o:['if','unless','so','but'], a:'if', e:'Condition.', b:'শর্ত।' },
      { p:'I will not go ___ you allow me.', o:['unless','if','so','but'], a:'unless', e:'If not.', b:'যদি না।' },
      { p:'___ he came, the party started.', o:['As soon as','Until','Because','Although'], a:'As soon as', e:'Immediate time.', b:'তাৎক্ষণিক।' },
      { p:'He speaks clearly ___ everyone understands.', o:['so that','because','although','or'], a:'so that', e:'Purpose.', b:'উদ্দেশ্য।' },
    ],
  },

  modifiers: {
    name: 'Modifiers', icon: 'book', class: 'all',
    lesson: {
      rules: [
        '<code>much</code> + uncountable; <code>many</code> + countable plural.',
        '<code>a little</code> = positive uncountable; <code>little</code> = negative.',
        '<code>a few</code> = positive countable; <code>few</code> = negative.',
        '<code>very</code> + adj (no noun); <code>such a</code> + adj + singular noun.',
        '<code>too</code> = excessively (negative); <code>enough</code> after adj.',
        '<code>less</code> + uncountable; <code>fewer</code> + countable.',
      ],
      examples: [
        'I have <strong>many</strong> books.',
        'She is <strong>very</strong> kind.',
        'He is <strong>too</strong> weak to walk.',
        'I have <strong>fewer</strong> books than you.',
      ],
      bangla: 'গণনাযোগ্য plural → many/few; uncountable → much/little। "Very" সরাসরি adjective এর আগে, "such a" noun সহ।',
    },
    questions: [
      { p:'It is a ___ interesting book.', o:['very','much','so','such'], a:'very', e:'Very + adj.', b:'Very + adj।' },
      { p:'He runs ___ fast.', o:['very','much','so','such'], a:'very', e:'Very + adverb.', b:'Very + adverb।' },
      { p:'She is ___ a nice girl.', o:['such','so','very','much'], a:'such', e:'Such a + adj + noun.', b:'Such a + adj + noun।' },
      { p:'I have ___ money.', o:['much','many','a few','few'], a:'much', e:'Uncountable.', b:'Uncountable।' },
      { p:'I have ___ books.', o:['much','many','a little','little'], a:'many', e:'Countable plural.', b:'গণনাযোগ্য plural।' },
      { p:'He ate ___ rice.', o:['a few','many','a little','few'], a:'a little', e:'Uncountable positive.', b:'Uncountable positive।' },
      { p:'There are ___ students.', o:['a little','much','a few','little'], a:'a few', e:'Countable positive.', b:'Countable positive।' },
      { p:'She has ___ friends.', o:['much','a little','few','little'], a:'few', e:'Countable negative.', b:'Countable negative।' },
      { p:'I have ___ patience.', o:['many','few','little','a few'], a:'little', e:'Uncountable negative.', b:'Uncountable negative।' },
      { p:'This is ___ a good film.', o:['so','such','very','much'], a:'such', e:'Such a.', b:'Such a।' },
      { p:'The film was ___ good.', o:['such','so','very much','much'], a:'so', e:'So + adj.', b:'So + adj।' },
      { p:'He is ___ tallest boy.', o:['a','an','the','—'], a:'the', e:'Superlative.', b:'Superlative।' },
      { p:'It is ___ beautiful garden.', o:['such','such a','so','very much'], a:'such a', e:'Such a.', b:'Such a।' },
      { p:'She speaks English ___ .', o:['good','well','nice','fine'], a:'well', e:'Adverb.', b:'Adverb।' },
      { p:'The weather is ___ today.', o:['nice','nicely','goodly','well'], a:'nice', e:'Adjective after linking verb.', b:'Linking verb পর adjective।' },
      { p:'I am ___ tired.', o:['very','much','so much','such'], a:'very', e:'Very + adj.', b:'Very + adj।' },
      { p:'He is ___ honest man.', o:['a','an','the','—'], a:'an', e:'Vowel sound.', b:'Vowel sound।' },
      { p:'___ of the two boys came.', o:['Both','Either','All','Some'], a:'Both', e:'Both for two.', b:'দুইজনের জন্য Both।' },
      { p:'___ of the two roads is safe.', o:['Both','Neither','All','Some'], a:'Neither', e:'Neither of two.', b:'দুইয়ের কেউ নয়।' },
      { p:'I have ___ time to finish.', o:['enough','very','too','so'], a:'enough', e:'Before noun.', b:'Noun এর আগে।' },
      { p:'He is ___ to solve it.', o:['clever enough','enough clever','cleverly enough','too clever'], a:'clever enough', e:'Adj + enough.', b:'Adj + enough।' },
      { p:'This book is ___ than that.', o:['better','good','best','more good'], a:'better', e:'Comparative.', b:'Comparative।' },
      { p:'She is the ___ beautiful.', o:['most','more','much','many'], a:'most', e:'Superlative.', b:'Superlative।' },
      { p:'He has ___ little money.', o:['a','an','the','—'], a:'a', e:'A little positive.', b:'A little positive।' },
      { p:'___ students are absent today.', o:['Much','Many','A little','Little'], a:'Many', e:'Countable plural.', b:'গণনাযোগ্য plural।' },
      { p:'I have ___ few friends.', o:['a','an','the','—'], a:'a', e:'A few positive.', b:'A few positive।' },
      { p:'He was ___ last to arrive.', o:['a','an','the','—'], a:'the', e:'The last.', b:'The last।' },
      { p:'I had ___ wonderful time.', o:['a','an','the','—'], a:'a', e:'A wonderful time.', b:'A wonderful time।' },
      { p:'He is ___ older than me.', o:['very','much','so','such'], a:'much', e:'Much + comparative.', b:'Much + comparative।' },
      { p:'This is ___ best book.', o:['a','an','the','—'], a:'the', e:'Superlative.', b:'Superlative।' },
      { p:'It is ___ unique opportunity.', o:['a','an','the','—'], a:'a', e:'"Yoo" sound.', b:'"Yoo" ধ্বনি।' },
      { p:'There is ___ water in the glass.', o:['many','few','a little','a few'], a:'a little', e:'Uncountable.', b:'Uncountable।' },
      { p:'She has ___ money to buy it.', o:['enough','very','too','so'], a:'enough', e:'Before noun.', b:'Noun এর আগে।' },
      { p:'The box is ___ heavy to lift.', o:['too','so','very','much'], a:'too', e:'Too + adj + to.', b:'Too + adj + to।' },
      { p:'The box is ___ heavy that I cannot lift it.', o:['so','too','very','such'], a:'so', e:'So + adj + that.', b:'So + adj + that।' },
      { p:'She is ___ a kind person.', o:['so','such','very','much'], a:'such', e:'Such a.', b:'Such a।' },
      { p:'This is ___ more interesting.', o:['much','many','very','so'], a:'much', e:'Much + comparative.', b:'Much + comparative।' },
      { p:'___ of us were tired.', o:['All','Each','Every','Much'], a:'All', e:'Plural verb.', b:'বহুবচন verb।' },
      { p:'___ student must bring a pen.', o:['All','Each','Every','Some'], a:'Each', e:'Each + singular.', b:'Each + একবচন।' },
      { p:'He spent ___ money on books.', o:['many','a lot of','few','a few'], a:'a lot of', e:'A lot of both.', b:'A lot of উভয়।' },
      { p:'We have ___ homework tonight.', o:['many','few','a lot of','a few'], a:'a lot of', e:'Uncountable.', b:'Uncountable।' },
      { p:'___ people attended the meeting.', o:['Much','A little','A few','Little'], a:'A few', e:'Countable plural.', b:'গণনাযোগ্য।' },
      { p:'She is ___ most talented singer.', o:['a','an','the','—'], a:'the', e:'Superlative.', b:'Superlative।' },
      { p:'I have ___ money than you.', o:['less','fewer','little','few'], a:'less', e:'Uncountable.', b:'Uncountable।' },
      { p:'I have ___ books than you.', o:['less','fewer','little','few'], a:'fewer', e:'Countable.', b:'Countable।' },
      { p:'This is ___ easier than that.', o:['very','much','so','such'], a:'much', e:'Much + comparative.', b:'Much + comparative।' },
      { p:'He is ___ honest than his brother.', o:['very','more','much','most'], a:'more', e:'More + adj.', b:'More + adj।' },
      { p:'The film was ___ interesting.', o:['very','much','such','so much'], a:'very', e:'Very + adj.', b:'Very + adj।' },
      { p:'He drives ___ than his brother.', o:['careful','carefully','more carefully','most carefully'], a:'more carefully', e:'Comparative adverb.', b:'Comparative adverb।' },
      { p:'___ students should study regularly.', o:['A','An','The','—'], a:'The', e:'Definite group.', b:'নির্দিষ্ট গোষ্ঠী।' },
    ],
  },

  completing: {
    name: 'Completing Sentences', icon: 'users', class: 'all',
    lesson: {
      rules: [
        '<code>It is high time / It is time</code> → past subjunctive (did).',
        '<code>As if / As though</code> → past subjunctive (were/knew).',
        '<code>No sooner…than</code>, <code>Hardly…when</code>, <code>Scarcely…when</code>.',
        '<code>Would rather…than</code> + base verb.',
        '<code>Too…to</code> / <code>so…that…not</code> — same meaning.',
        '<code>It is I who</code> + verb agrees with "I".',
      ],
      examples: [
        'It is high time we <strong>changed</strong> our habit.',
        'No sooner had he arrived <strong>than</strong> it started raining.',
        'He is too weak <strong>to walk</strong>.',
        'I wish I <strong>were</strong> a bird.',
      ],
      bangla: '"It is high time" এর পরে past subjunctive বসে। "No sooner…than" fixed, "Hardly…when" fixed।',
    },
    questions: [
      { p:'If I had studied, ___', o:['I would pass.','I would have passed.','I will pass.','I pass.'], a:'I would have passed.', e:'Third conditional.', b:'Third conditional।' },
      { p:'Unless you work hard, ___', o:['you will fail.','you will pass.','you would pass.','you passed.'], a:'you will fail.', e:'Unless = if not.', b:'Unless = যদি না।' },
      { p:'It is high time ___', o:['we change our habit.','we changed our habit.','we will change.','we have changed.'], a:'we changed our habit.', e:'Past subjunctive.', b:'Past subjunctive।' },
      { p:'He speaks as if ___', o:['he knows everything.','he knew everything.','he will know.','he is knowing.'], a:'he knew everything.', e:'Past subjunctive.', b:'Past subjunctive।' },
      { p:'I wish ___', o:['I am a bird.','I was a bird.','I were a bird.','I will be a bird.'], a:'I were a bird.', e:'Past subjunctive.', b:'Past subjunctive।' },
      { p:'No sooner had he arrived ___', o:['than it started raining.','when it started raining.','then it started raining.','that it started raining.'], a:'than it started raining.', e:'No sooner…than.', b:'No sooner…than।' },
      { p:'Hardly had I reached the station ___', o:['than the train left.','when the train left.','that the train left.','the train left.'], a:'when the train left.', e:'Hardly…when.', b:'Hardly…when।' },
      { p:'It is time we ___', o:['start','started','will start','have started'], a:'started', e:'Past subjunctive.', b:'Past subjunctive।' },
      { p:'He would rather ___', o:['die than beg.','die than begging.','died than beg.','dying than beg.'], a:'die than beg.', e:'Would rather…than + base.', b:'Would rather…than + base।' },
      { p:'I would rather you ___ the truth.', o:['tell','told','will tell','have told'], a:'told', e:'Past subjunctive.', b:'Past subjunctive।' },
      { p:'As soon as he came, ___', o:['we started the meeting.','we start.','we will start.','we had start.'], a:'we started the meeting.', e:'Past sequence.', b:'অতীত ক্রম।' },
      { p:'The more you read, ___', o:['the more you learn.','you learn more.','the most you learn.','much you learn.'], a:'the more you learn.', e:'Correlative comparative.', b:'Correlative comparative।' },
      { p:'Were I rich, ___', o:['I would help the poor.','I will help the poor.','I helped the poor.','I help the poor.'], a:'I would help the poor.', e:'Inverted 2nd conditional.', b:'Inverted 2nd conditional।' },
      { p:'Had I known, ___', o:['I would come.','I would have come.','I will come.','I came.'], a:'I would have come.', e:'Inverted 3rd conditional.', b:'Inverted 3rd conditional।' },
      { p:'It is I who ___ responsible.', o:['am','is','are','be'], a:'am', e:'Agrees with I.', b:'I এর সাথে মিল।' },
      { p:'He acts as if he ___ mad.', o:['is','was','were','be'], a:'were', e:'Past subjunctive.', b:'Past subjunctive।' },
      { p:'She talks as though she ___ everything.', o:['knows','knew','will know','has known'], a:'knew', e:'Past subjunctive.', b:'Past subjunctive।' },
      { p:'I wish I ___ taller.', o:['am','was','were','be'], a:'were', e:'Past subjunctive.', b:'Past subjunctive।' },
      { p:'Barely had he finished ___', o:['when the bell rang.','than the bell rang.','that the bell rang.','the bell rang.'], a:'when the bell rang.', e:'Barely…when.', b:'Barely…when।' },
      { p:'Scarcely had we started ___', o:['than it rained.','when it rained.','that it rained.','it rained.'], a:'when it rained.', e:'Scarcely…when.', b:'Scarcely…when।' },
      { p:'He is used to ___ early.', o:['get up','getting up','got up','gets up'], a:'getting up', e:'Used to + gerund.', b:'Used to + gerund।' },
      { p:'I am looking forward to ___ you.', o:['meet','meeting','met','meets'], a:'meeting', e:'Gerund.', b:'Gerund।' },
      { p:'It is many years since ___', o:['I met him.','I have met him.','I meet him.','I will meet him.'], a:'I met him.', e:'Since + past.', b:'Since + past।' },
      { p:'No matter how hard he tries, ___', o:['he cannot win.','he can win.','he wins.','he will win.'], a:'he cannot win.', e:'Concession.', b:'ছাড়।' },
      { p:'However hard you try, ___', o:['you will not succeed easily.','you will succeed easily.','you succeed easily.','you succeeded.'], a:'you will not succeed easily.', e:'Concession.', b:'ছাড়।' },
      { p:'As long as you work hard, ___', o:['you will succeed.','you will fail.','you failed.','you are failing.'], a:'you will succeed.', e:'Condition → result.', b:'শর্ত → ফলাফল।' },
      { p:'Whether you come or not, ___', o:['the meeting will start.','the meeting starts tomorrow.','the meeting started.','the meeting is starting.'], a:'the meeting will start.', e:'Regardless.', b:'যাই হোক।' },
      { p:'In case of rain, ___', o:['we will stay home.','we stayed home.','we stay at home last week.','we would stay.'], a:'we will stay home.', e:'Precaution.', b:'সতর্কতা।' },
      { p:'He is too weak ___', o:['to walk.','to walking.','walk.','for walk.'], a:'to walk.', e:'Too + adj + to + base.', b:'Too + adj + to + base।' },
      { p:'I would rather walk ___', o:['than take a bus.','than taking a bus.','than took a bus.','then take a bus.'], a:'than take a bus.', e:'Would rather…than.', b:'Would rather…than।' },
      { p:'If you do not hurry, ___', o:['you will miss the bus.','you will catch the bus.','you missed the bus.','you miss the bus.'], a:'you will miss the bus.', e:'First conditional.', b:'First conditional।' },
      { p:'If she had known, ___', o:['she would have come.','she would come.','she will come.','she came.'], a:'she would have come.', e:'Third conditional.', b:'Third conditional।' },
      { p:'It is time you ___ your duty.', o:['do','did','will do','have done'], a:'did', e:'Past subjunctive.', b:'Past subjunctive।' },
      { p:'I wish I ___ the answer.', o:['know','knew','will know','known'], a:'knew', e:'Past subjunctive.', b:'Past subjunctive।' },
      { p:'He talks as if he ___ a king.', o:['is','was','were','be'], a:'were', e:'Past subjunctive.', b:'Past subjunctive।' },
      { p:'No sooner had we sat down ___', o:['than the film started.','when the film started.','that the film started.','the film started.'], a:'than the film started.', e:'No sooner…than.', b:'No sooner…than।' },
      { p:'She is so tired ___', o:['that she cannot walk.','to walk.','for walking.','walking.'], a:'that she cannot walk.', e:'So…that.', b:'So…that।' },
      { p:'He was too proud ___', o:['to ask for help.','that he asked help.','so he asked help.','for asking help.'], a:'to ask for help.', e:'Too…to.', b:'Too…to।' },
      { p:'I would rather die ___', o:['than lie.','than lying.','then lie.','than to lie.'], a:'than lie.', e:'Would rather…than + base.', b:'Would rather…than + base।' },
      { p:'He is not so tall ___', o:['as his brother.','than his brother.','like his brother.','that his brother.'], a:'as his brother.', e:'Not so…as.', b:'Not so…as।' },
      { p:'She is the same age ___', o:['as me.','than me.','like me.','so me.'], a:'as me.', e:'The same…as.', b:'The same…as।' },
      { p:'He is different ___', o:['from his brother.','than his brother.','to his brother.','of his brother.'], a:'from his brother.', e:'Different from.', b:'Different from।' },
      { p:'The sooner you leave, ___', o:['the better.','the best.','better.','best.'], a:'the better.', e:'Correlative.', b:'Correlative।' },
      { p:'As soon as the bell rang, ___', o:['the students left.','the students leave.','the students will leave.','the students are leaving.'], a:'the students left.', e:'Past sequence.', b:'অতীত ক্রম।' },
      { p:'No matter what happens, ___', o:['stay calm.','you stay calm will.','stayed calm.','you stayed calm.'], a:'stay calm.', e:'Imperative.', b:'Imperative।' },
      { p:'Even if it rains, ___', o:['we will go.','we will not go.','we went.','we are going.'], a:'we will go.', e:'Even if.', b:'Even if।' },
      { p:'Suppose you were rich, ___', o:['what would you do?','what will you do?','what do you do?','what did you do?'], a:'what would you do?', e:'Hypothetical.', b:'Hypothetical।' },
      { p:'Had it not been for you, ___', o:['I would have failed.','I would fail.','I will fail.','I failed.'], a:'I would have failed.', e:'Inverted 3rd.', b:'Inverted 3rd।' },
      { p:'But for your help, ___', o:['I could not have succeeded.','I could not succeed.','I cannot succeed.','I did not succeed.'], a:'I could not have succeeded.', e:'But for = without.', b:'But for = ছাড়া।' },
      { p:'Only if you work hard, ___', o:['you will succeed.','you would succeed.','you succeeded.','you succeed.'], a:'you will succeed.', e:'Strong condition.', b:'জোরালো শর্ত।' },
    ],
  },

  voice: {
    name: 'Voice Change', icon: 'chat', class: 'all',
    lesson: {
      rules: [
        'Active → Passive: object + be + V3 + by + subject.',
        'Present simple passive: <code>is/are + V3</code>.',
        'Past simple passive: <code>was/were + V3</code>.',
        'Present perfect passive: <code>has/have been + V3</code>.',
        'Modal passive: <code>modal + be + V3</code>.',
        'Imperative passive: <code>Let + object + be + V3</code>.',
      ],
      examples: [
        'Rina writes a letter → A letter <strong>is written</strong> by Rina.',
        'They built the bridge → The bridge <strong>was built</strong>.',
        'Open the door → <strong>Let</strong> the door <strong>be opened</strong>.',
      ],
      bangla: 'Passive এ object সামনে যায়, verb হয় be + V3। Imperative হলে "Let…be + V3"।',
    },
    questions: [
      { p:'Passive of: "Rina writes a letter."', o:['A letter is written by Rina.','A letter was written by Rina.','A letter has written by Rina.','A letter is writing by Rina.'], a:'A letter is written by Rina.', e:'Present simple passive.', b:'Present simple passive।' },
      { p:'Passive of: "They built the bridge."', o:['The bridge is built.','The bridge was built.','The bridge has built.','The bridge was building.'], a:'The bridge was built.', e:'Past simple passive.', b:'Past simple passive।' },
      { p:'Passive of: "He will finish the work."', o:['The work will be finished.','The work will finished.','The work would be finished.','The work is finished.'], a:'The work will be finished.', e:'Future passive.', b:'Future passive।' },
      { p:'Passive of: "She has eaten the cake."', o:['The cake has been eaten.','The cake has eaten.','The cake was eaten.','The cake is eaten.'], a:'The cake has been eaten.', e:'Present perfect passive.', b:'Present perfect passive।' },
      { p:'Passive of: "Someone stole my bag."', o:['My bag was stolen.','My bag is stolen.','My bag has stolen.','My bag was stealing.'], a:'My bag was stolen.', e:'Past simple passive.', b:'Past simple passive।' },
      { p:'Passive of: "They are painting the house."', o:['The house is being painted.','The house is painted.','The house was painted.','The house has painted.'], a:'The house is being painted.', e:'Present continuous passive.', b:'Present continuous passive।' },
      { p:'Passive of: "He can solve the problem."', o:['The problem can be solved.','The problem can solve.','The problem was solved.','The problem is solved.'], a:'The problem can be solved.', e:'Modal passive.', b:'Modal passive।' },
      { p:'Passive of: "They will announce the results."', o:['The results will be announced.','The results will announce.','The results are announced.','The results were announced.'], a:'The results will be announced.', e:'Future passive.', b:'Future passive।' },
      { p:'Passive of: "She made the cake."', o:['The cake was made by her.','The cake was made.','The cake is made.','The cake has made.'], a:'The cake was made by her.', e:'Past passive with agent.', b:'Past passive with agent।' },
      { p:'Passive of: "People speak English worldwide."', o:['English is spoken worldwide.','English is speaking worldwide.','English was spoken worldwide.','English has spoken worldwide.'], a:'English is spoken worldwide.', e:'Present simple passive.', b:'Present simple passive।' },
      { p:'Passive of: "She teaches English."', o:['English is taught by her.','English is teaching by her.','English was taught by her.','English has taught by her.'], a:'English is taught by her.', e:'Present simple passive.', b:'Present simple passive।' },
      { p:'Passive of: "They will build a new school."', o:['A new school will be built.','A new school will build.','A new school is built.','A new school was built.'], a:'A new school will be built.', e:'Future passive.', b:'Future passive।' },
      { p:'Passive of: "He wrote the letter."', o:['The letter was written by him.','The letter is written by him.','The letter has written by him.','The letter was writing by him.'], a:'The letter was written by him.', e:'Past passive.', b:'Past passive।' },
      { p:'Passive of: "They have completed the work."', o:['The work has been completed.','The work has completed.','The work was completed.','The work is completed.'], a:'The work has been completed.', e:'Present perfect passive.', b:'Present perfect passive।' },
      { p:'Passive of: "Someone is cleaning the room."', o:['The room is being cleaned.','The room is cleaned.','The room was cleaned.','The room has cleaned.'], a:'The room is being cleaned.', e:'Present continuous passive.', b:'Present continuous passive।' },
      { p:'Passive of: "She can fix the car."', o:['The car can be fixed by her.','The car can fix by her.','The car is fixed by her.','The car was fixed by her.'], a:'The car can be fixed by her.', e:'Modal passive.', b:'Modal passive।' },
      { p:'Passive of: "They must obey the rules."', o:['The rules must be obeyed.','The rules must obey.','The rules are obeyed.','The rules were obeyed.'], a:'The rules must be obeyed.', e:'Modal passive.', b:'Modal passive।' },
      { p:'Passive of: "People are watching the match."', o:['The match is being watched.','The match is watched.','The match was watched.','The match has watched.'], a:'The match is being watched.', e:'Present continuous passive.', b:'Present continuous passive।' },
      { p:'Passive of: "The chef cooked the meal."', o:['The meal was cooked by the chef.','The meal is cooked by the chef.','The meal has cooked by the chef.','The meal was cooking by the chef.'], a:'The meal was cooked by the chef.', e:'Past passive.', b:'Past passive।' },
      { p:'Passive of: "They will cancel the event."', o:['The event will be cancelled.','The event will cancel.','The event is cancelled.','The event was cancelled.'], a:'The event will be cancelled.', e:'Future passive.', b:'Future passive।' },
      { p:'Passive of: "He has written the report."', o:['The report has been written.','The report has written.','The report was written.','The report is written.'], a:'The report has been written.', e:'Present perfect passive.', b:'Present perfect passive।' },
      { p:'Passive of: "She was helping the children."', o:['The children were being helped by her.','The children were helped by her.','The children are being helped by her.','The children have been helped by her.'], a:'The children were being helped by her.', e:'Past continuous passive.', b:'Past continuous passive।' },
      { p:'Passive of: "They had finished the project."', o:['The project had been finished.','The project had finished.','The project was finished.','The project has finished.'], a:'The project had been finished.', e:'Past perfect passive.', b:'Past perfect passive।' },
      { p:'Passive of: "Someone must have taken it."', o:['It must have been taken.','It must have taken.','It was taken.','It has taken.'], a:'It must have been taken.', e:'Perfect modal passive.', b:'Perfect modal passive।' },
      { p:'Passive of: "People say that he is honest."', o:['He is said to be honest.','He is said honest.','He was said honest.','He has said honest.'], a:'He is said to be honest.', e:'Impersonal passive.', b:'Impersonal passive।' },
      { p:'Passive of: "They believe that she stole the money."', o:['She is believed to have stolen the money.','She is believed to steal.','She was believed to steal.','She believed the money.'], a:'She is believed to have stolen the money.', e:'Impersonal + perfect infinitive.', b:'Impersonal + perfect infinitive।' },
      { p:'Passive of: "Open the door."', o:['Let the door be opened.','The door is opened.','The door was opened.','The door opens.'], a:'Let the door be opened.', e:'Imperative passive.', b:'Imperative passive।' },
      { p:'Passive of: "Do not touch the wire."', o:['Let the wire not be touched.','The wire is not touched.','The wire was not touched.','Do not be touched the wire.'], a:'Let the wire not be touched.', e:'Negative imperative.', b:'Negative imperative।' },
      { p:'Passive of: "Who broke the window?"', o:['By whom was the window broken?','Who was broken the window?','Who is broken the window?','Whom broke the window?'], a:'By whom was the window broken?', e:'Wh-question passive.', b:'Wh-question passive।' },
      { p:'Passive of: "They laughed at him."', o:['He was laughed at.','He laughed at.','He is laughing.','He was laughing.'], a:'He was laughed at.', e:'Keep the preposition.', b:'Preposition রাখতে হয়।' },
      { p:'Passive of: "They look after the children."', o:['The children are looked after.','The children are looked.','The children look after.','The children were looking.'], a:'The children are looked after.', e:'Keep the preposition.', b:'Preposition রাখতে হয়।' },
      { p:'Passive of: "She sent me a letter."', o:['I was sent a letter.','A letter was sent me.','I sent a letter.','A letter is sent me.'], a:'I was sent a letter.', e:'Two-object passive.', b:'দুই object passive।' },
      { p:'Passive of: "He gave her a gift."', o:['She was given a gift.','A gift was given her.','She gave a gift.','She is given a gift.'], a:'She was given a gift.', e:'Two-object passive.', b:'দুই object passive।' },
      { p:'Passive of: "The teacher teaches us."', o:['We are taught by the teacher.','We teach by the teacher.','Us are taught.','We were taught by the teacher.'], a:'We are taught by the teacher.', e:'Present simple passive.', b:'Present simple passive।' },
      { p:'Passive of: "They did not invite him."', o:['He was not invited.','He is not invited.','He did not invite.','He has not invited.'], a:'He was not invited.', e:'Negative past passive.', b:'Negative past passive।' },
      { p:'Passive of: "Have you finished the work?"', o:['Has the work been finished?','Has the work finished?','Is the work finished?','Was the work finished?'], a:'Has the work been finished?', e:'Question passive.', b:'Question passive।' },
      { p:'Passive of: "Who did this?"', o:['By whom was this done?','Who was done this?','Who is done this?','Whom did this?'], a:'By whom was this done?', e:'Question passive.', b:'Question passive।' },
      { p:'Passive of: "Someone has stolen my bike."', o:['My bike has been stolen.','My bike has stolen.','My bike was stolen.','My bike is stolen.'], a:'My bike has been stolen.', e:'Present perfect passive.', b:'Present perfect passive।' },
      { p:'Passive of: "I will finish it."', o:['It will be finished by me.','It will finish.','It is finished.','It was finished.'], a:'It will be finished by me.', e:'Future passive.', b:'Future passive।' },
      { p:'Passive of: "She is writing a letter."', o:['A letter is being written.','A letter is written.','A letter was written.','A letter has written.'], a:'A letter is being written.', e:'Present continuous passive.', b:'Present continuous passive।' },
      { p:'Passive of: "They had sold the house."', o:['The house had been sold.','The house had sold.','The house was sold.','The house is sold.'], a:'The house had been sold.', e:'Past perfect passive.', b:'Past perfect passive।' },
      { p:'Passive of: "He should respect his parents."', o:['His parents should be respected.','His parents should respect.','His parents are respected.','His parents were respected.'], a:'His parents should be respected.', e:'Modal passive.', b:'Modal passive।' },
      { p:'Passive of: "They are going to build a bridge."', o:['A bridge is going to be built.','A bridge is going to build.','A bridge is built.','A bridge was built.'], a:'A bridge is going to be built.', e:'Going to passive.', b:'Going to passive।' },
      { p:'Passive of: "People must not smoke here."', o:['Smoking must not be done here.','Smoking must not do here.','Smoking is not smoke here.','Smoking was not done here.'], a:'Smoking must not be done here.', e:'Negative modal passive.', b:'Negative modal passive।' },
      { p:'Passive of: "I saw him crossing the road."', o:['He was seen crossing the road.','He saw crossing the road.','He is seen crossing.','He was seeing crossing.'], a:'He was seen crossing the road.', e:'Perception verb passive.', b:'Perception verb passive।' },
      { p:'Passive of: "Somebody has taken my umbrella."', o:['My umbrella has been taken.','My umbrella has taken.','My umbrella was taken.','My umbrella is taking.'], a:'My umbrella has been taken.', e:'Present perfect passive.', b:'Present perfect passive।' },
      { p:'Passive of: "They made him captain."', o:['He was made captain.','He is made captain.','He made captain.','He has made captain.'], a:'He was made captain.', e:'Object complement passive.', b:'Object complement passive।' },
      { p:'Passive of: "We expected him to win."', o:['He was expected to win.','He is expected to win.','He expected to win.','He has expected to win.'], a:'He was expected to win.', e:'Infinitive passive.', b:'Infinitive passive।' },
      { p:'Passive of: "They will have finished the work."', o:['The work will have been finished.','The work will have finished.','The work has been finished.','The work was finished.'], a:'The work will have been finished.', e:'Future perfect passive.', b:'Future perfect passive।' },
      { p:'Passive of: "Does she write poems?"', o:['Are poems written by her?','Are poems wrote by her?','Are poems writing by her?','Is poems written by her?'], a:'Are poems written by her?', e:'Question passive.', b:'Question passive।' },
    ],
  },

  narration: {
    name: 'Narration', icon: 'chat', class: 'all',
    lesson: {
      rules: [
        'Present → Past; Past → Past Perfect.',
        'Will → Would; Can → Could; May → Might; Must → Had to.',
        'Pronouns change: I → he/she, you → I/he/she, we → they.',
        'Time words shift: now → then, today → that day, tomorrow → the next day.',
        'Wh-questions → statement order. Yes/No → if/whether.',
        'Imperative → asked/told/ordered + to + base verb.',
      ],
      examples: [
        'He said, "I am tired." → He said that he <strong>was</strong> tired.',
        'She said, "I will come." → She said that she <strong>would</strong> come.',
        '"Where do you live?" → He asked where I <strong>lived</strong>.',
      ],
      bangla: 'Direct → Indirect এ present → past, will → would, now → then, tomorrow → পরের দিন।',
    },
    questions: [
      { p:'Indirect: He said, "I am tired."', o:['He said that he was tired.','He said that I am tired.','He said that he is tired.','He says he was tired.'], a:'He said that he was tired.', e:'Present → Past.', b:'Present → Past।' },
      { p:'Indirect: She said, "I will come tomorrow."', o:['She said that she would come the next day.','She said that she will come tomorrow.','She said she came tomorrow.','She said she would come tomorrow.'], a:'She said that she would come the next day.', e:'Will → Would; tomorrow → next day.', b:'Will → Would; tomorrow → next day।' },
      { p:'Indirect: He said, "Where do you live?"', o:['He asked where I lived.','He asked where do I live.','He said where I live.','He asked where did I live.'], a:'He asked where I lived.', e:'Wh-question → statement.', b:'Wh-question → statement।' },
      { p:'Indirect: She said, "I like tea."', o:['She said that she liked tea.','She said that she likes tea.','She said that I like tea.','She says she liked tea.'], a:'She said that she liked tea.', e:'Present → Past.', b:'Present → Past।' },
      { p:'Indirect: He said, "I am going home."', o:['He said that he was going home.','He said that he is going home.','He said that I am going home.','He said he goes home.'], a:'He said that he was going home.', e:'Present continuous → Past continuous.', b:'Present continuous → Past continuous।' },
      { p:'Indirect: She said, "Did you see him?"', o:['She asked if I had seen him.','She asked if I saw him.','She asked did I see him.','She said if I had seen him.'], a:'She asked if I had seen him.', e:'Yes/no → if.', b:'Yes/no → if।' },
      { p:'Indirect: He said, "I will help you."', o:['He said that he would help me.','He said that he will help me.','He said that he helps me.','He says he will help me.'], a:'He said that he would help me.', e:'Will → Would; you → me.', b:'Will → Would; you → me।' },
      { p:'Indirect: She said, "I have finished."', o:['She said that she had finished.','She said that she has finished.','She said that she finishes.','She says she finished.'], a:'She said that she had finished.', e:'Present perfect → Past perfect.', b:'Present perfect → Past perfect।' },
      { p:'Indirect: He said, "Can you help me?"', o:['He asked if I could help him.','He asked can I help him.','He asked if I can help him.','He said if I could help him.'], a:'He asked if I could help him.', e:'Can → Could.', b:'Can → Could।' },
      { p:'Indirect: She said, "I am busy now."', o:['She said that she was busy then.','She said that she is busy now.','She said that she was busy now.','She said that I was busy then.'], a:'She said that she was busy then.', e:'Now → then.', b:'Now → then।' },
      { p:'Indirect: "I am reading," he said.', o:['He said that he was reading.','He said that he is reading.','He said that I was reading.','He says he is reading.'], a:'He said that he was reading.', e:'Present cont. → Past cont.', b:'Present cont. → Past cont।' },
      { p:'Indirect: "I will come," she said.', o:['She said she would come.','She said she will come.','She said she came.','She says she would come.'], a:'She said she would come.', e:'Will → Would.', b:'Will → Would।' },
      { p:'Indirect: "I went to the market," he said.', o:['He said he had gone to the market.','He said he went to the market.','He said he goes to the market.','He says he went to the market.'], a:'He said he had gone to the market.', e:'Past → Past perfect.', b:'Past → Past perfect।' },
      { p:'Indirect: "Can you help me?" she asked.', o:['She asked if I could help her.','She asked if I can help her.','She asked can I help her.','She said if I could help her.'], a:'She asked if I could help her.', e:'Can → Could.', b:'Can → Could।' },
      { p:'Indirect: "Where is the station?" he asked.', o:['He asked where the station was.','He asked where is the station.','He asked where the station is.','He said where the station was.'], a:'He asked where the station was.', e:'Statement order.', b:'Statement order।' },
      { p:'Indirect: "I have finished," she said.', o:['She said she had finished.','She said she has finished.','She said she finished.','She said she finishes.'], a:'She said she had finished.', e:'Pres. perf. → Past perf.', b:'Pres. perf. → Past perf।' },
      { p:'Indirect: "I saw him yesterday," he said.', o:['He said he had seen him the day before.','He said he saw him yesterday.','He said he had seen him yesterday.','He says he saw him yesterday.'], a:'He said he had seen him the day before.', e:'Yesterday → the day before.', b:'Yesterday → the day before।' },
      { p:'Indirect: "We are going to the beach tomorrow," they said.', o:['They said they were going to the beach the next day.','They said they are going to the beach tomorrow.','They said they were going to the beach tomorrow.','They say they are going to the beach tomorrow.'], a:'They said they were going to the beach the next day.', e:'Cont. + time shift.', b:'Cont. + time shift।' },
      { p:'Indirect: "I love you," he said.', o:['He said he loved her.','He said he loves her.','He said I loved her.','He said he loved you.'], a:'He said he loved her.', e:'Tense & pronoun.', b:'Tense & pronoun।' },
      { p:'Indirect: "Please help me," she said.', o:['She asked me to help her.','She said please help me.','She asked me help her.','She said to help her.'], a:'She asked me to help her.', e:'Imperative → asked + to.', b:'Imperative → asked + to।' },
      { p:'Indirect: "Do not touch the wires," he said.', o:['He told us not to touch the wires.','He said do not touch the wires.','He told us to not touch the wires.','He said us not to touch the wires.'], a:'He told us not to touch the wires.', e:'Negative imperative.', b:'Negative imperative।' },
      { p:'Indirect: "I will call you tomorrow," she said.', o:['She said she would call me the next day.','She said she will call me tomorrow.','She said she would call me tomorrow.','She says she will call me tomorrow.'], a:'She said she would call me the next day.', e:'Will → Would; tomorrow → next day.', b:'Will → Would; tomorrow → next day।' },
      { p:'Indirect: "Open the door," he said.', o:['He ordered me to open the door.','He ordered to open the door.','He said open the door.','He told open the door.'], a:'He ordered me to open the door.', e:'Command → ordered.', b:'Command → ordered।' },
      { p:'Indirect: "What a beautiful day!" she said.', o:['She exclaimed that it was a beautiful day.','She said what a beautiful day.','She exclaimed what a beautiful day.','She said it is beautiful.'], a:'She exclaimed that it was a beautiful day.', e:'Exclamation → exclaimed.', b:'Exclamation → exclaimed।' },
      { p:'Indirect: "Let us go out," he said.', o:['He proposed that they should go out.','He said let us go out.','He told us go out.','He proposed to go out.'], a:'He proposed that they should go out.', e:'Let us → proposed.', b:'Let us → proposed।' },
      { p:'Indirect: "How old are you?" she asked.', o:['She asked how old I was.','She asked how old am I.','She asked how old are you.','She said how old I was.'], a:'She asked how old I was.', e:'Statement order.', b:'Statement order।' },
      { p:'Indirect: "I am sorry," he said.', o:['He said that he was sorry.','He said that I am sorry.','He said that he is sorry.','He says he is sorry.'], a:'He said that he was sorry.', e:'Present → Past.', b:'Present → Past।' },
      { p:'Indirect: "I will do it myself," she said.', o:['She said that she would do it herself.','She said that she will do it herself.','She said she does it herself.','She says she will do it herself.'], a:'She said that she would do it herself.', e:'Will → Would; myself → herself.', b:'Will → Would; myself → herself।' },
      { p:'Indirect: "Good morning," he said.', o:['He wished me a good morning.','He said good morning.','He told good morning.','He greeted good morning.'], a:'He wished me a good morning.', e:'Greeting → wished.', b:'Greeting → wished।' },
      { p:'Indirect: "Thank you," she said.', o:['She thanked me.','She said thank you.','She told thank you.','She thanked you.'], a:'She thanked me.', e:'Thanks → thanked.', b:'Thanks → thanked।' },
      { p:'Indirect: "Please sit down," he said.', o:['He requested me to sit down.','He requested to sit down.','He said please sit down.','He told sit down.'], a:'He requested me to sit down.', e:'Request → requested.', b:'Request → requested।' },
      { p:'Indirect: "What are you doing?" she asked.', o:['She asked what I was doing.','She asked what are you doing.','She said what I was doing.','She asked what am I doing.'], a:'She asked what I was doing.', e:'Statement order.', b:'Statement order।' },
      { p:'Indirect: "I shall return soon," he said.', o:['He said he would return soon.','He said he shall return soon.','He said he will return soon.','He says he would return soon.'], a:'He said he would return soon.', e:'Shall → Would.', b:'Shall → Would।' },
      { p:'Indirect: "I have been waiting for hours," he said.', o:['He said he had been waiting for hours.','He said he has been waiting for hours.','He said he was waiting for hours.','He said he waited for hours.'], a:'He said he had been waiting for hours.', e:'Pres. perf. cont. → Past perf. cont.', b:'Pres. perf. cont. → Past perf. cont।' },
      { p:'Indirect: "Do you speak English?" he asked.', o:['He asked if I spoke English.','He asked if I speak English.','He asked do I speak English.','He said if I spoke English.'], a:'He asked if I spoke English.', e:'Yes/no → if.', b:'Yes/no → if।' },
      { p:'Indirect: "Come here," she said to him.', o:['She told him to come there.','She told him to come here.','She said him come here.','She told to come here.'], a:'She told him to come there.', e:'Here → there.', b:'Here → there।' },
      { p:'Indirect: "I met him last week," she said.', o:['She said she had met him the week before.','She said she met him last week.','She said she had met him last week.','She said she met him the week before.'], a:'She said she had met him the week before.', e:'Last week → the week before.', b:'Last week → the week before।' },
      { p:'Indirect: "This is my house," he said.', o:['He said that was his house.','He said this is his house.','He said this was his house.','He said that is my house.'], a:'He said that was his house.', e:'This → that.', b:'This → that।' },
      { p:'Indirect: "These are my books," she said.', o:['She said those were her books.','She said these are her books.','She said these were my books.','She said those are my books.'], a:'She said those were her books.', e:'These → those.', b:'These → those।' },
      { p:'Indirect: "I can swim," he said.', o:['He said he could swim.','He said he can swim.','He said he would swim.','He said he swims.'], a:'He said he could swim.', e:'Can → Could.', b:'Can → Could।' },
      { p:'Indirect: "I may come," she said.', o:['She said she might come.','She said she may come.','She said she can come.','She said she would come.'], a:'She said she might come.', e:'May → Might.', b:'May → Might।' },
      { p:'Indirect: "I must go," he said.', o:['He said he had to go.','He said he must go.','He said he has to go.','He said he would go.'], a:'He said he had to go.', e:'Must → Had to.', b:'Must → Had to।' },
      { p:'Indirect: "How beautiful!" she said.', o:['She exclaimed that it was very beautiful.','She said how beautiful.','She told beautiful.','She said it is beautiful.'], a:'She exclaimed that it was very beautiful.', e:'Exclamation.', b:'Exclamation।' },
      { p:'Indirect: "Will you help me?" he asked.', o:['He asked if I would help him.','He asked if I will help him.','He asked will I help him.','He said if I would help him.'], a:'He asked if I would help him.', e:'Will → Would.', b:'Will → Would।' },
      { p:'Indirect: "I am not feeling well," she said.', o:['She said she was not feeling well.','She said she is not feeling well.','She said I was not feeling well.','She says she was not feeling well.'], a:'She said she was not feeling well.', e:'Present cont. → Past cont.', b:'Present cont. → Past cont।' },
      { p:'Indirect: "Please don\'t go," he said.', o:['He requested me not to go.','He requested me to not go.','He said please don\'t go.','He told don\'t go.'], a:'He requested me not to go.', e:'Negative request.', b:'Negative request।' },
      { p:'Indirect: "I live in Dhaka," he said.', o:['He said he lived in Dhaka.','He said he lives in Dhaka.','He said I live in Dhaka.','He says he lived in Dhaka.'], a:'He said he lived in Dhaka.', e:'Present → Past.', b:'Present → Past।' },
      { p:'Indirect: "Give me the book," he said.', o:['He asked me to give him the book.','He asked me give the book.','He said give me book.','He told give me the book.'], a:'He asked me to give him the book.', e:'Imperative → asked + to.', b:'Imperative → asked + to।' },
      { p:'Indirect: "Are you free tonight?" she asked.', o:['She asked if I was free that night.','She asked if I am free tonight.','She asked am I free tonight.','She said if I was free tonight.'], a:'She asked if I was free that night.', e:'Tonight → that night.', b:'Tonight → that night।' },
      { p:'Indirect: "I shall never forget you," he said.', o:['He said he would never forget me.','He said he shall never forget me.','He said I would never forget him.','He said he will never forget me.'], a:'He said he would never forget me.', e:'Shall → Would.', b:'Shall → Would।' },
    ],
  },

  transformation: {
    name: 'Transformation', icon: 'target', class: 'all',
    lesson: {
      rules: [
        'Superlative ↔ Positive/Comparative: No other…as…; better than any other.',
        '<code>Too…to</code> ↔ <code>so…that…not</code>.',
        'Simple ↔ Complex: with when-clause, relative clause, if-clause.',
        'Affirmative ↔ Negative (opposite sense).',
        'Exclamatory ↔ Assertive: What a…!/How…! ↔ very.',
        'As soon as → No sooner…than.',
      ],
      examples: [
        'He is too weak to walk → He is <strong>so</strong> weak <strong>that</strong> he cannot walk.',
        'No other boy is as tall as he → He is <strong>the tallest</strong> boy.',
        'Do or die → <strong>If</strong> you do not do, you will die.',
      ],
      bangla: 'Too…to কে so…that…not এ রূপান্তর। Superlative ↔ Positive (No other…as…)।',
    },
    questions: [
      { p:'"Very few boys are as good as he." → Comparative:', o:['He is better than most other boys.','He is as good as others.','He is the best boy.','He is very good.'], a:'He is better than most other boys.', e:'Very few…as → better than most.', b:'Very few…as → better than most।' },
      { p:'"No other boy is as tall as he." → Superlative:', o:['He is the tallest boy.','He is very tall.','He is taller than others.','He is as tall as others.'], a:'He is the tallest boy.', e:'No other…as → superlative.', b:'No other…as → superlative।' },
      { p:'"He is too weak to walk." → Complex:', o:['He is so weak that he cannot walk.','He is so weak that he can walk.','He is weak but he walks.','He is very weak and walks.'], a:'He is so weak that he cannot walk.', e:'Too…to → so…that…not.', b:'Too…to → so…that…not।' },
      { p:'"He is so weak that he cannot walk." → Simple:', o:['He is too weak to walk.','He is too weak not to walk.','He cannot walk.','He is weak walking.'], a:'He is too weak to walk.', e:'So…that → too…to.', b:'So…that → too…to।' },
      { p:'"He came and I went." → Complex:', o:['When he came, I went.','Because he came, I went.','If he came, I went.','As he came, I went.'], a:'When he came, I went.', e:'When-clause.', b:'When-clause।' },
      { p:'"I know his name." → Complex:', o:['I know what his name is.','I know what is his name.','I know his name is.','I know that his name.'], a:'I know what his name is.', e:'What-clause.', b:'What-clause।' },
      { p:'"On seeing the police, he ran." → Complex:', o:['When he saw the police, he ran.','Because he saw the police.','If he saw the police.','As soon as the police.'], a:'When he saw the police, he ran.', e:'On + gerund → when.', b:'On + gerund → when।' },
      { p:'"Do or die." → Complex:', o:['If you do not do, you will die.','If you do, you will die.','Either do or die.','Do and die.'], a:'If you do not do, you will die.', e:'Imperative → conditional.', b:'Imperative → conditional।' },
      { p:'"The man is my uncle. He is tall." → Complex:', o:['The man who is tall is my uncle.','The man is my uncle and tall.','The man is tall, my uncle.','The tall man my uncle.'], a:'The man who is tall is my uncle.', e:'Relative clause.', b:'Relative clause।' },
      { p:'"He is poor but honest." → Complex:', o:['Though he is poor, he is honest.','Because he is poor, he is honest.','He is poor and honest.','If he is poor, he is honest.'], a:'Though he is poor, he is honest.', e:'But → Though.', b:'But → Though।' },
      { p:'"In spite of being rich, he is unhappy." → Complex:', o:['Although he is rich, he is unhappy.','Because he is rich, he is unhappy.','He is rich and unhappy.','If he is rich, he is unhappy.'], a:'Although he is rich, he is unhappy.', e:'In spite of → Although.', b:'In spite of → Although।' },
      { p:'"He finished the work and went out." → Complex:', o:['After he had finished the work, he went out.','Before he finished the work, he went out.','When he finished the work, he goes out.','If he finished, he went out.'], a:'After he had finished the work, he went out.', e:'Past perfect sequence.', b:'Past perfect sequence।' },
      { p:'"This is the place of my birth." → Complex:', o:['This is the place where I was born.','This is the place of my birth.','This is the birth place.','This is my birth.'], a:'This is the place where I was born.', e:'Where-clause.', b:'Where-clause।' },
      { p:'"He is very old, yet he works hard." → Complex:', o:['Though he is very old, he works hard.','Because he is old, he works hard.','He is old and works hard.','If old, he works hard.'], a:'Though he is very old, he works hard.', e:'Yet → Though.', b:'Yet → Though।' },
      { p:'"The news is too good to be true." → Complex:', o:['The news is so good that it cannot be true.','The news is so good that it can be true.','The news is good and true.','The news is good to be true.'], a:'The news is so good that it cannot be true.', e:'Too…to → so…that…not.', b:'Too…to → so…that…not।' },
      { p:'"I am certain of his success." → Complex:', o:['I am certain that he will succeed.','I am certain he succeeds.','I am certain he is succeed.','I am certain his success.'], a:'I am certain that he will succeed.', e:'Certain of → certain that.', b:'Certain of → certain that।' },
      { p:'"Nobody can do this." → Interrogative:', o:['Who can do this?','Who cannot do this?','Can anybody do this?','Can nobody do this?'], a:'Who can do this?', e:'Negative → rhetorical.', b:'Negative → rhetorical।' },
      { p:'"He is a good singer." → Exclamatory:', o:['What a good singer he is!','How good singer he is!','What he is a good singer!','How a good singer!'], a:'What a good singer he is!', e:'What a + noun phrase.', b:'What a + noun phrase।' },
      { p:'"How beautiful the flower is!" → Assertive:', o:['The flower is very beautiful.','The flower is a beauty.','The flower beautiful is.','The flower is beautiful.'], a:'The flower is very beautiful.', e:'Exclamatory → assertive.', b:'Exclamatory → assertive।' },
      { p:'"He is not a fool." → Affirmative:', o:['He is wise.','He is a fool.','He is cleverness.','He is not wise.'], a:'He is wise.', e:'Double negative.', b:'Double negative।' },
      { p:'"As soon as he came, we left." → Negative:', o:['No sooner had he come than we left.','No sooner he came than we left.','No sooner did he came.','No sooner he had come.'], a:'No sooner had he come than we left.', e:'As soon as → No sooner…than.', b:'As soon as → No sooner…than।' },
      { p:'"He is honest but poor." → Complex:', o:['Though he is honest, he is poor.','Because he is honest, he is poor.','He is honest and poor.','If he is honest, he is poor.'], a:'Though he is honest, he is poor.', e:'But → Though.', b:'But → Though।' },
      { p:'"I was born in a village." → Complex:', o:['The village where I was born is small.','The village I was born.','The village of birth.','The village I born.'], a:'The village where I was born is small.', e:'Where-clause.', b:'Where-clause।' },
      { p:'"He works hard so that he can succeed." → Simple:', o:['He works hard to succeed.','He works hard succeed.','He works hard for succeed.','He works hard so succeed.'], a:'He works hard to succeed.', e:'So that → infinitive.', b:'So that → infinitive।' },
      { p:'"I went there to see him." → Complex:', o:['I went there so that I could see him.','I went there because I see him.','I went there if I see him.','I went there when I see him.'], a:'I went there so that I could see him.', e:'Infinitive → so that.', b:'Infinitive → so that।' },
      { p:'"He is the best boy in the class." → Comparative:', o:['He is better than any other boy in the class.','He is better than every boy.','He is better than most boys.','He is best than others.'], a:'He is better than any other boy in the class.', e:'Superlative → comparative.', b:'Superlative → comparative।' },
      { p:'"I saw him. He was playing." → Simple:', o:['I saw him playing.','I saw him play.','I saw playing him.','I saw he playing.'], a:'I saw him playing.', e:'Participle.', b:'Participle।' },
      { p:'"He is too weak to walk." → Negative:', o:['He is so weak that he cannot walk.','He is weak and walks.','He cannot walk.','He is weak not to walk.'], a:'He is so weak that he cannot walk.', e:'Negative of too…to.', b:'Too…to এর negative।' },
      { p:'"We must obey our parents." → Passive:', o:['Our parents must be obeyed.','Our parents must obey.','Our parents are obeyed.','Our parents were obeyed.'], a:'Our parents must be obeyed.', e:'Modal passive.', b:'Modal passive।' },
      { p:'"He said to me, \'Where are you going?\'" → Indirect:', o:['He asked me where I was going.','He asked me where am I going.','He said me where I was going.','He told me where I was going.'], a:'He asked me where I was going.', e:'Wh-question indirect.', b:'Wh-question indirect।' },
      { p:'"Please lend me your book." → Indirect:', o:['He requested me to lend him my book.','He requested to lend his book.','He said please lend me.','He told lend me his book.'], a:'He requested me to lend him my book.', e:'Request → requested.', b:'Request → requested।' },
      { p:'"How old is she?" → Assertive:', o:['I do not know how old she is.','I do not know how old is she.','I know how old she is.','I know she is old.'], a:'I do not know how old she is.', e:'Indirect question.', b:'Indirect question।' },
      { p:'"He died in 1971." → Complex:', o:['It was 1971 when he died.','It was 1971 that he died.','The year he died was 1971.','1971 was the year.'], a:'It was 1971 when he died.', e:'Emphatic.', b:'Emphatic।' },
      { p:'"He is a fool." → Negative (opposite sense):', o:['He is not a wise man.','He is not a fool.','He is wise.','He is clever.'], a:'He is not a wise man.', e:'Softened negative.', b:'Softened negative।' },
      { p:'"I know the man." → Complex (with relative):', o:['I know the man who is standing there.','I know the man.','I know who the man.','I know that man.'], a:'I know the man who is standing there.', e:'Relative clause.', b:'Relative clause।' },
      { p:'"They gave him a prize." → Passive:', o:['He was given a prize.','A prize was given.','He gave a prize.','He is given a prize.'], a:'He was given a prize.', e:'Two-object passive.', b:'Two-object passive।' },
      { p:'"The book is interesting." → Exclamatory:', o:['How interesting the book is!','What interesting book!','How interesting book!','What a interesting book!'], a:'How interesting the book is!', e:'How + adj.', b:'How + adj।' },
      { p:'"Ram is a good boy." → Negative (opposite):', o:['Ram is not a bad boy.','Ram is a bad boy.','Ram is a good man.','Ram is not good.'], a:'Ram is not a bad boy.', e:'Softened negative.', b:'Softened negative।' },
      { p:'"He is taller than I." → Positive:', o:['I am not so tall as he.','I am not tall as he.','I am tall as he.','I am as tall as he.'], a:'I am not so tall as he.', e:'Comparative → positive.', b:'Comparative → positive।' },
      { p:'"Hasan is the best boy." → Positive:', o:['No other boy is as good as Hasan.','Hasan is very good.','Hasan is good.','Hasan is better.'], a:'No other boy is as good as Hasan.', e:'Superlative → positive.', b:'Superlative → positive।' },
      { p:'"I have no pen." → Interrogative:', o:['Have I any pen?','Do I have a pen?','Have I a pen?','Do I have no pen?'], a:'Have I any pen?', e:'Negative → question.', b:'Negative → question।' },
      { p:'"He can do it." → Negative:', o:['He cannot do it.','He can not do it.','He can do not it.','He cannot does it.'], a:'He cannot do it.', e:'Can negative.', b:'Can negative।' },
      { p:'"He came late." → Negative:', o:['He did not come late.','He came not late.','He does not come late.','He not came late.'], a:'He did not come late.', e:'Past negative.', b:'Past negative।' },
      { p:'"She is singing a song." → Passive:', o:['A song is being sung by her.','A song is sung by her.','A song was sung by her.','A song has been sung.'], a:'A song is being sung by her.', e:'Present cont. passive.', b:'Present cont. passive।' },
      { p:'"I will always remember you." → Negative:', o:['I will never forget you.','I will not remember you.','I will not always remember you.','I will forget you.'], a:'I will never forget you.', e:'Always → never.', b:'Always → never।' },
      { p:'"He is a very good boy." → Exclamatory:', o:['What a good boy he is!','How a good boy he is!','What good boy he is!','How good boy he is!'], a:'What a good boy he is!', e:'What a pattern.', b:'What a pattern।' },
      { p:'"I cannot but laugh." → Affirmative:', o:['I must laugh.','I can laugh.','I do not laugh.','I will laugh.'], a:'I must laugh.', e:'Cannot but → must.', b:'Cannot but → must।' },
      { p:'"He is not so clever as his brother." → Comparative:', o:['His brother is cleverer than he.','His brother is as clever as he.','He is cleverer than his brother.','He is very clever.'], a:'His brother is cleverer than he.', e:'Not so…as → comparative.', b:'Not so…as → comparative।' },
      { p:'"She wrote a letter." → Passive:', o:['A letter was written by her.','A letter is written by her.','A letter has been written.','A letter was writing.'], a:'A letter was written by her.', e:'Past simple passive.', b:'Past simple passive।' },
      { p:'"I shall never forget her." → Affirmative:', o:['I shall always remember her.','I shall remember her.','I forget her.','I shall not remember her.'], a:'I shall always remember her.', e:'Negative → affirmative.', b:'Negative → affirmative।' },
      { p:'"This is a beautiful garden." → Exclamatory:', o:['What a beautiful garden this is!','How beautiful garden!','What beautiful garden!','How a beautiful garden!'], a:'What a beautiful garden this is!', e:'What a pattern.', b:'What a pattern।' },
    ],
  },

  synonyms: {
    name: 'Synonyms', icon: 'book', class: 'all',
    lesson: {
      rules: [
        'Synonyms are words with similar meanings.',
        'Common: happy/joyful, big/huge, brave/courageous.',
        'Frequently tested in SSC/HSC vocabulary sections.',
      ],
      examples: [
        'Happy = <strong>joyful</strong>.',
        'Begin = <strong>commence</strong>.',
        'Difficult = <strong>arduous</strong>.',
      ],
      bangla: 'Synonym = সমার্থক শব্দ। SSC/HSC তে vocabulary অংশে আসে।',
    },
    questions: [
      { p:'Synonym of "abandon"?', o:['forsake','keep','adopt','hold'], a:'forsake', e:'= forsake.', b:'= ত্যাগ করা।' },
      { p:'Synonym of "happy"?', o:['joyful','sad','angry','tired'], a:'joyful', e:'= joyful.', b:'= আনন্দিত।' },
      { p:'Synonym of "big"?', o:['huge','small','tiny','thin'], a:'huge', e:'= huge.', b:'= বিশাল।' },
      { p:'Synonym of "brave"?', o:['courageous','coward','weak','timid'], a:'courageous', e:'= courageous.', b:'= সাহসী।' },
      { p:'Synonym of "quick"?', o:['rapid','slow','lazy','dull'], a:'rapid', e:'= rapid.', b:'= দ্রুত।' },
      { p:'Synonym of "start"?', o:['begin','stop','end','halt'], a:'begin', e:'= begin.', b:'= শুরু।' },
      { p:'Synonym of "beautiful"?', o:['lovely','ugly','plain','dull'], a:'lovely', e:'= lovely.', b:'= সুন্দর।' },
      { p:'Synonym of "angry"?', o:['furious','calm','happy','glad'], a:'furious', e:'= furious.', b:'= ক্রুদ্ধ।' },
      { p:'Synonym of "smart"?', o:['clever','dull','stupid','slow'], a:'clever', e:'= clever.', b:'= চতুর।' },
      { p:'Synonym of "rich"?', o:['wealthy','poor','needy','broke'], a:'wealthy', e:'= wealthy.', b:'= ধনী।' },
      { p:'Synonym of "help"?', o:['assist','hinder','block','stop'], a:'assist', e:'= assist.', b:'= সাহায্য।' },
      { p:'Synonym of "begin"?', o:['commence','finish','end','cease'], a:'commence', e:'= commence.', b:'= শুরু।' },
      { p:'Synonym of "end"?', o:['conclude','begin','start','open'], a:'conclude', e:'= conclude.', b:'= শেষ।' },
      { p:'Synonym of "buy"?', o:['purchase','sell','trade','give'], a:'purchase', e:'= purchase.', b:'= ক্রয়।' },
      { p:'Synonym of "show"?', o:['display','hide','conceal','cover'], a:'display', e:'= display.', b:'= দেখানো।' },
      { p:'Synonym of "small"?', o:['tiny','huge','large','giant'], a:'tiny', e:'= tiny.', b:'= ছোট।' },
      { p:'Synonym of "difficult"?', o:['hard','easy','simple','plain'], a:'hard', e:'= hard.', b:'= কঠিন।' },
      { p:'Synonym of "important"?', o:['significant','trivial','minor','small'], a:'significant', e:'= significant.', b:'= গুরুত্বপূর্ণ।' },
      { p:'Synonym of "famous"?', o:['renowned','unknown','obscure','ordinary'], a:'renowned', e:'= renowned.', b:'= বিখ্যাত।' },
      { p:'Synonym of "increase"?', o:['augment','reduce','decrease','lessen'], a:'augment', e:'= augment.', b:'= বাড়ানো।' },
      { p:'Synonym of "decrease"?', o:['diminish','increase','grow','rise'], a:'diminish', e:'= diminish.', b:'= কমা।' },
      { p:'Synonym of "praise"?', o:['applaud','criticize','blame','scold'], a:'applaud', e:'= applaud.', b:'= প্রশংসা।' },
      { p:'Synonym of "criticize"?', o:['condemn','praise','applaud','laud'], a:'condemn', e:'= condemn.', b:'= নিন্দা।' },
      { p:'Synonym of "kind"?', o:['benevolent','cruel','harsh','mean'], a:'benevolent', e:'= benevolent.', b:'= দয়ালু।' },
      { p:'Synonym of "cruel"?', o:['brutal','kind','gentle','soft'], a:'brutal', e:'= brutal.', b:'= নিষ্ঠুর।' },
      { p:'Synonym of "clever"?', o:['ingenious','foolish','stupid','dull'], a:'ingenious', e:'= ingenious.', b:'= বুদ্ধিমান।' },
      { p:'Synonym of "sad"?', o:['melancholy','happy','joyful','cheerful'], a:'melancholy', e:'= melancholy.', b:'= বিষণ্ণ।' },
      { p:'Synonym of "strong"?', o:['robust','weak','frail','feeble'], a:'robust', e:'= robust.', b:'= শক্তিশালী।' },
      { p:'Synonym of "tired"?', o:['exhausted','fresh','energetic','lively'], a:'exhausted', e:'= exhausted.', b:'= ক্লান্ত।' },
      { p:'Synonym of "dangerous"?', o:['perilous','safe','harmless','secure'], a:'perilous', e:'= perilous.', b:'= বিপজ্জনক।' },
      { p:'Synonym of "enormous"?', o:['gigantic','tiny','narrow','weak'], a:'gigantic', e:'= gigantic.', b:'= বিশাল।' },
      { p:'Synonym of "assist"?', o:['aid','hinder','ignore','block'], a:'aid', e:'= aid.', b:'= সাহায্য করা।' },
      { p:'Synonym of "purchase"?', o:['acquire','sell','lose','refuse'], a:'acquire', e:'= acquire.', b:'= কেনা।' },
      { p:'Synonym of "reply"?', o:['respond','ask','ignore','question'], a:'respond', e:'= respond.', b:'= উত্তর দেওয়া।' },
      { p:'Synonym of "silent"?', o:['quiet','noisy','loud','talkative'], a:'quiet', e:'= quiet.', b:'= নীরব।' },
      { p:'Synonym of "vanish"?', o:['disappear','appear','arrive','grow'], a:'disappear', e:'= disappear.', b:'= অদৃশ্য হওয়া।' },
      { p:'Synonym of "observe"?', o:['watch','ignore','forget','hide'], a:'watch', e:'= watch.', b:'= পর্যবেক্ষণ করা।' },
      { p:'Synonym of "rescue"?', o:['save','harm','trap','abandon'], a:'save', e:'= save.', b:'= উদ্ধার করা।' },
      { p:'Synonym of "costly"?', o:['expensive','cheap','free','useless'], a:'expensive', e:'= expensive.', b:'= দামি।' },
      { p:'Synonym of "gather"?', o:['collect','scatter','spend','waste'], a:'collect', e:'= collect.', b:'= জড়ো করা।' },
      { p:'Synonym of "brief"?', o:['short','long','endless','tall'], a:'short', e:'= short.', b:'= সংক্ষিপ্ত।' },
      { p:'Synonym of "ill"?', o:['sick','healthy','fit','well'], a:'sick', e:'= sick.', b:'= অসুস্থ।' },
      { p:'Synonym of "honest"?', o:['truthful','dishonest','cunning','false'], a:'truthful', e:'= truthful.', b:'= সৎ।' },
      { p:'Synonym of "error"?', o:['mistake','accuracy','truth','success'], a:'mistake', e:'= mistake.', b:'= ভুল।' },
      { p:'Synonym of "anger"?', o:['rage','joy','calm','peace'], a:'rage', e:'= rage.', b:'= ক্রোধ।' },
      { p:'Synonym of "ancient"?', o:['old','modern','fresh','new'], a:'old', e:'= old.', b:'= প্রাচীন।' },
      { p:'Synonym of "permit"?', o:['allow','forbid','refuse','stop'], a:'allow', e:'= allow.', b:'= অনুমতি দেওয়া।' },
      { p:'Synonym of "peaceful"?', o:['calm','violent','noisy','stormy'], a:'calm', e:'= calm.', b:'= শান্তিপূর্ণ।' },
      { p:'Synonym of "strange"?', o:['odd','normal','usual','common'], a:'odd', e:'= odd.', b:'= অদ্ভুত।' },
      { p:'Synonym of "depart"?', o:['leave','arrive','stay','enter'], a:'leave', e:'= leave.', b:'= প্রস্থান করা।' },
    ],
  },

  antonyms: {
    name: 'Antonyms', icon: 'flag', class: 'all',
    lesson: {
      rules: [
        'Antonyms are words with opposite meanings.',
        'Common: happy/sad, hot/cold, big/small.',
        'Learn prefix-based opposites: un-, in-, im-, dis-, mis-.',
      ],
      examples: [
        'Brave ↔ <strong>cowardly</strong>.',
        'Increase ↔ <strong>decrease</strong>.',
        'Accept ↔ <strong>reject</strong>.',
      ],
      bangla: 'Antonym = বিপরীতার্থক শব্দ। un-, in-, dis- prefix যোগে অনেক antonym তৈরি হয়।',
    },
    questions: [
      { p:'Antonym of "brave"?', o:['cowardly','courageous','bold','valiant'], a:'cowardly', e:'Brave → cowardly.', b:'Brave → cowardly।' },
      { p:'Antonym of "happy"?', o:['sad','joyful','cheerful','glad'], a:'sad', e:'Happy → sad.', b:'Happy → sad।' },
      { p:'Antonym of "big"?', o:['small','huge','large','giant'], a:'small', e:'Big → small.', b:'Big → small।' },
      { p:'Antonym of "hot"?', o:['cold','warm','boiling','heated'], a:'cold', e:'Hot → cold.', b:'Hot → cold।' },
      { p:'Antonym of "fast"?', o:['slow','quick','rapid','swift'], a:'slow', e:'Fast → slow.', b:'Fast → slow।' },
      { p:'Antonym of "rich"?', o:['poor','wealthy','affluent','prosperous'], a:'poor', e:'Rich → poor.', b:'Rich → poor।' },
      { p:'Antonym of "begin"?', o:['end','start','open','commence'], a:'end', e:'Begin → end.', b:'Begin → end।' },
      { p:'Antonym of "day"?', o:['night','morning','noon','dawn'], a:'night', e:'Day → night.', b:'Day → night।' },
      { p:'Antonym of "love"?', o:['hate','adore','like','cherish'], a:'hate', e:'Love → hate.', b:'Love → hate।' },
      { p:'Antonym of "strong"?', o:['weak','robust','powerful','sturdy'], a:'weak', e:'Strong → weak.', b:'Strong → weak।' },
      { p:'Antonym of "light"?', o:['dark','bright','luminous','radiant'], a:'dark', e:'Light → dark.', b:'Light → dark।' },
      { p:'Antonym of "true"?', o:['false','correct','accurate','right'], a:'false', e:'True → false.', b:'True → false।' },
      { p:'Antonym of "give"?', o:['take','offer','donate','grant'], a:'take', e:'Give → take.', b:'Give → take।' },
      { p:'Antonym of "open"?', o:['close','unlock','unfold','spread'], a:'close', e:'Open → close.', b:'Open → close।' },
      { p:'Antonym of "up"?', o:['down','above','higher','top'], a:'down', e:'Up → down.', b:'Up → down।' },
      { p:'Antonym of "old"?', o:['new','ancient','aged','elderly'], a:'new', e:'Old → new.', b:'Old → new।' },
      { p:'Antonym of "soft"?', o:['hard','tender','smooth','gentle'], a:'hard', e:'Soft → hard.', b:'Soft → hard।' },
      { p:'Antonym of "positive"?', o:['negative','optimistic','hopeful','confident'], a:'negative', e:'Positive → negative.', b:'Positive → negative।' },
      { p:'Antonym of "accept"?', o:['reject','agree','approve','admit'], a:'reject', e:'Accept → reject.', b:'Accept → reject।' },
      { p:'Antonym of "above"?', o:['below','over','higher','upper'], a:'below', e:'Above → below.', b:'Above → below।' },
      { p:'Antonym of "before"?', o:['after','prior','earlier','previously'], a:'after', e:'Before → after.', b:'Before → after।' },
      { p:'Antonym of "distant"?', o:['near','far','remote','faraway'], a:'near', e:'Distant → near.', b:'Distant → near।' },
      { p:'Antonym of "build"?', o:['destroy','construct','erect','create'], a:'destroy', e:'Build → destroy.', b:'Build → destroy।' },
      { p:'Antonym of "win"?', o:['lose','triumph','succeed','conquer'], a:'lose', e:'Win → lose.', b:'Win → lose।' },
      { p:'Antonym of "arrive"?', o:['depart','reach','come','land'], a:'depart', e:'Arrive → depart.', b:'Arrive → depart।' },
      { p:'Antonym of "praise"?', o:['blame','applaud','laud','commend'], a:'blame', e:'Praise → blame.', b:'Praise → blame।' },
      { p:'Antonym of "remember"?', o:['forget','recall','recollect','memorize'], a:'forget', e:'Remember → forget.', b:'Remember → forget।' },
      { p:'Antonym of "construct"?', o:['demolish','build','create','make'], a:'demolish', e:'Construct → demolish.', b:'Construct → demolish।' },
      { p:'Antonym of "increase"?', o:['decrease','raise','grow','expand'], a:'decrease', e:'Increase → decrease.', b:'Increase → decrease।' },
      { p:'Antonym of "polite"?', o:['rude','courteous','kind','gracious'], a:'rude', e:'Polite → rude.', b:'Polite → rude।' },
      { p:'Antonym of "ancient"?', o:['modern','old','historic','aged'], a:'modern', e:'Ancient → modern.', b:'প্রাচীন → আধুনিক।' },
      { p:'Antonym of "generous"?', o:['selfish','kind','giving','charitable'], a:'selfish', e:'Generous → selfish.', b:'উদার → স্বার্থপর।' },
      { p:'Antonym of "victory"?', o:['defeat','triumph','success','conquest'], a:'defeat', e:'Victory → defeat.', b:'বিজয় → পরাজয়।' },
      { p:'Antonym of "expand"?', o:['shrink','grow','spread','widen'], a:'shrink', e:'Expand → shrink.', b:'বাড়ানো → সংকুচিত করা।' },
      { p:'Antonym of "permanent"?', o:['temporary','lasting','fixed','eternal'], a:'temporary', e:'Permanent → temporary.', b:'স্থায়ী → অস্থায়ী।' },
      { p:'Antonym of "success"?', o:['failure','victory','triumph','progress'], a:'failure', e:'Success → failure.', b:'সফলতা → ব্যর্থতা।' },
      { p:'Antonym of "friend"?', o:['enemy','pal','mate','companion'], a:'enemy', e:'Friend → enemy.', b:'বন্ধু → শত্রু।' },
      { p:'Antonym of "encourage"?', o:['discourage','inspire','support','cheer'], a:'discourage', e:'Encourage → discourage.', b:'উৎসাহ দেওয়া → নিরুৎসাহ করা।' },
      { p:'Antonym of "include"?', o:['exclude','contain','add','involve'], a:'exclude', e:'Include → exclude.', b:'অন্তর্ভুক্ত করা → বাদ দেওয়া।' },
      { p:'Antonym of "ascend"?', o:['descend','climb','rise','mount'], a:'descend', e:'Ascend → descend.', b:'ওঠা → নামা।' },
      { p:'Antonym of "optimist"?', o:['pessimist','dreamer','hopeful','believer'], a:'pessimist', e:'Optimist → pessimist.', b:'আশাবাদী → নিরাশাবাদী।' },
      { p:'Antonym of "knowledge"?', o:['ignorance','wisdom','learning','skill'], a:'ignorance', e:'Knowledge → ignorance.', b:'জ্ঞান → অজ্ঞতা।' },
      { p:'Antonym of "visible"?', o:['invisible','clear','obvious','seen'], a:'invisible', e:'Visible → invisible.', b:'দৃশ্যমান → অদৃশ্য।' },
      { p:'Antonym of "cheap"?', o:['expensive','low-priced','affordable','economical'], a:'expensive', e:'Cheap → expensive.', b:'সস্তা → দামি।' },
      { p:'Antonym of "clean"?', o:['dirty','pure','tidy','neat'], a:'dirty', e:'Clean → dirty.', b:'পরিষ্কার → নোংরা।' },
      { p:'Antonym of "early"?', o:['late','soon','quick','prompt'], a:'late', e:'Early → late.', b:'আগে → দেরিতে।' },
      { p:'Antonym of "wise"?', o:['foolish','clever','sensible','smart'], a:'foolish', e:'Wise → foolish.', b:'জ্ঞানী → বোকা।' },
      { p:'Antonym of "freedom"?', o:['slavery','liberty','independence','release'], a:'slavery', e:'Freedom → slavery.', b:'স্বাধীনতা → দাসত্ব।' },
      { p:'Antonym of "depart"?', o:['arrive','leave','exit','go'], a:'arrive', e:'Depart → arrive.', b:'প্রস্থান → আগমন।' },
      { p:'Antonym of "major"?', o:['minor','main','chief','big'], a:'minor', e:'Major → minor.', b:'প্রধান → গৌণ।' },
    ],
  },

  punctuation: {
    name: 'Punctuation', icon: 'grid', class: 'all',
    lesson: {
      rules: [
        'Comma (,) — separates items, clauses, after introductory phrases.',
        'Semicolon (;) — joins two independent clauses.',
        'Colon (:) — introduces a list or explanation.',
        'Apostrophe (’) — possessive (Rina’s book) or contraction (it’s = it is).',
        'Question mark (?), exclamation (!), period (.).',
      ],
      examples: [
        'I bought apples, bananas, and oranges.',
        'It’s raining.',
        'He said, "I am tired."',
      ],
      bangla: 'তালিকায় কমা, possessive এ apostrophe (’s), direct speech এ comma + quotation।',
    },
    questions: [
      { p:'Which is correct?', o:['I bought apples, bananas, and oranges.','I bought apples bananas and oranges.','I bought apples, bananas and oranges.','I bought, apples, bananas, and oranges.'], a:'I bought apples, bananas, and oranges.', e:'Oxford comma.', b:'Oxford comma।' },
      { p:'Which is correct?', o:['It’s raining.','Its raining.','Its’ raining.','It is’ raining.'], a:'It’s raining.', e:'It’s = it is.', b:'It’s = it is।' },
      { p:'Which is correct?', o:['Rina’s book.','Rinas book.','Rinas’ book.','Rina book.'], a:'Rina’s book.', e:'Singular possessive.', b:'Singular possessive।' },
      { p:'Which is correct?', o:['She said, "I am tired."','She said "I am tired".','She said: I am tired.','She said, I am tired.'], a:'She said, "I am tired."', e:'Direct speech.', b:'Direct speech।' },
      { p:'Which is correct?', o:['Their car is red.','There car is red.','They’re car is red.','Theyr car is red.'], a:'Their car is red.', e:'Possessive their.', b:'Possessive their।' },
      { p:'Which is correct?', o:['Who’s coming to dinner?','Whose coming to dinner?','Whos coming to dinner?','Whose’s coming to dinner?'], a:'Who’s coming to dinner?', e:'Who’s = who is.', b:'Who’s = who is।' },
      { p:'Which is correct?', o:['Its tail is long.','It’s tail is long.','Its’ tail is long.','It is tail is long.'], a:'Its tail is long.', e:'Its = possessive.', b:'Its = possessive।' },
      { p:'Which is correct?', o:['I have fewer books than him.','I have less books than him.','I have little books than him.','I have few books than him.'], a:'I have fewer books than him.', e:'Fewer for countable.', b:'Countable → fewer।' },
      { p:'Which is correct?', o:['He is taller than me.','He is taller then me.','He is taller that me.','He is tall then me.'], a:'He is taller than me.', e:'Than for comparison.', b:'তুলনায় than।' },
      { p:'Which is correct?', o:['I, too, like coffee.','I too like coffee.','I to like coffee.','I, to, like coffee.'], a:'I, too, like coffee.', e:'Too set off by commas.', b:'Too কমা দিয়ে ঘেরা।' },
      { p:'Which is correct?', o:['Let’s go.','Lets go.','Let’s’s go.','Lets’ go.'], a:'Let’s go.', e:'Let’s = let us.', b:'Let’s = let us।' },
      { p:'Which is correct?', o:['The boys’ books.','The boys’s books.','The boyss books.','The boys books.'], a:'The boys’ books.', e:'Plural possessive s’.', b:'বহুবচন possessive s’।' },
      { p:'Which is correct?', o:['We’re going home.','Were going home.','We’re’ going home.','We going home.'], a:'We’re going home.', e:'We’re = we are.', b:'We’re = we are।' },
      { p:'Which is correct?', o:['You’re welcome.','Your welcome.','Youre welcome.','Your’e welcome.'], a:'You’re welcome.', e:'You’re = you are.', b:'You’re = you are।' },
      { p:'Which is correct?', o:['He doesn’t know.','He don’t know.','He dont know.','He doesnot know.'], a:'He doesn’t know.', e:'3rd person → doesn’t.', b:'৩য় পুরুষ → doesn’t।' },
      { p:'Which is correct?', o:['I can’t do it.','I cant do it.','I cann’t do it.','I can not’t do it.'], a:'I can’t do it.', e:'Can’t = cannot.', b:'Can’t = cannot।' },
      { p:'Which is correct?', o:['It’s been a long day.','Its been a long day.','Its’ been a long day.','It been a long day.'], a:'It’s been a long day.', e:'It’s = it has.', b:'It’s = it has।' },
      { p:'Which is correct?', o:['The children’s toys.','The childrens toys.','The childrens’ toys.','The children toys.'], a:'The children’s toys.', e:'Irregular plural + ’s.', b:'Irregular plural + ’s।' },
      { p:'Which is correct?', o:['Rina and I went.','Rina and me went.','Me and Rina went.','Rina and myself went.'], a:'Rina and I went.', e:'Subject pronoun.', b:'Subject pronoun।' },
      { p:'Which is correct?', o:['Between you and me.','Between you and I.','Between we two.','Between us two I.'], a:'Between you and me.', e:'Object after preposition.', b:'Preposition পর object।' },
      { p:'Which is correct?', o:['She is taller than I am.','She is taller than me are.','She is taller than I is.','She is taller than me is.'], a:'She is taller than I am.', e:'Full clause.', b:'সম্পূর্ণ clause।' },
      { p:'Which is correct?', o:['Its fur is soft.','It’s fur is soft.','Its’ fur is soft.','It is fur is soft.'], a:'Its fur is soft.', e:'Possessive its.', b:'Possessive its।' },
      { p:'Which is correct?', o:['They’re late.','There late.','Their late.','Theyre late.'], a:'They’re late.', e:'They’re = they are.', b:'They’re = they are।' },
      { p:'Which is correct?', o:['Whose book is this?','Who’s book is this?','Whos book is this?','Whose’s book is this?'], a:'Whose book is this?', e:'Whose = possessive.', b:'Whose = possessive।' },
      { p:'Which is correct?', o:['I’d like tea.','Id like tea.','I’ld like tea.','I will like tea’d.'], a:'I’d like tea.', e:'I’d = I would.', b:'I’d = I would।' },
      { p:'Which is correct?', o:['Well, I think so.','Well I think so.','Well, I, think so.','Well; I think so.'], a:'Well, I think so.', e:'Comma after intro.', b:'Intro পর কমা।' },
      { p:'Which is correct?', o:['After dinner, we walked.','After dinner we walked,','After, dinner we walked.','After dinner; we walked,'], a:'After dinner, we walked.', e:'Comma after phrase.', b:'Phrase পর কমা।' },
      { p:'Which is correct?', o:['He said, "Yes."','He said "Yes".','He said: "Yes"','He said; "Yes"'], a:'He said, "Yes."', e:'Direct speech.', b:'Direct speech।' },
      { p:'Which is correct?', o:['Hello! How are you?','Hello, how are you.','Hello how are you?','Hello; how are you?'], a:'Hello! How are you?', e:'! and ?', b:'! এবং ?।' },
      { p:'Which is correct?', o:['My father’s car.','My fathers car.','My fathers’ car.','My father car.'], a:'My father’s car.', e:'Singular possessive.', b:'Singular possessive।' },
      { p:'Which is correct?', o:['He asked, "Where are you going?"','He asked "Where are you going"?','He asked: where are you going?','He asked; where are you going?'], a:'He asked, "Where are you going?"', e:'Direct speech with question.', b:'Question সহ direct speech।' },
      { p:'Which is correct?', o:['I have three pens: red, blue, and green.','I have three pens, red blue and green.','I have three pens; red, blue, green.','I have three pens red, blue, green.'], a:'I have three pens: red, blue, and green.', e:'Colon before list.', b:'তালিকার আগে colon।' },
      { p:'Which is correct?', o:['The dog, which is brown, barked.','The dog which is brown barked.','The dog which, is brown, barked.','The dog, which is brown barked.'], a:'The dog, which is brown, barked.', e:'Non-restrictive.', b:'Non-restrictive।' },
      { p:'Which is correct?', o:['However, I disagree.','However I disagree.','However; I disagree.','However, I, disagree.'], a:'However, I disagree.', e:'Comma after conjunctive adverb.', b:'Conjunctive adverb পর কমা।' },
      { p:'Which is correct?', o:['He said: "I am tired."','He said, "I am tired."','He said; "I am tired."','He said "I am tired."'], a:'He said, "I am tired."', e:'Comma before quotation.', b:'Quotation এর আগে কমা।' },
      { p:'Which is correct?', o:['She is, nevertheless, kind.','She is nevertheless kind.','She is; nevertheless; kind.','She is nevertheless, kind.'], a:'She is, nevertheless, kind.', e:'Parenthetical.', b:'Parenthetical।' },
      { p:'Which is correct?', o:['We need: bread, milk, and eggs.','We need: bread; milk; eggs.','We need bread, milk, and eggs.','We need, bread, milk, and eggs.'], a:'We need bread, milk, and eggs.', e:'No colon after "need".', b:'"Need" পর colon হয় না।' },
      { p:'Which is correct?', o:['My sister, who lives in Dhaka, is a doctor.','My sister who lives in Dhaka is a doctor.','My sister, who lives in Dhaka is a doctor.','My sister who lives in Dhaka, is a doctor.'], a:'My sister, who lives in Dhaka, is a doctor.', e:'Non-restrictive.', b:'Non-restrictive।' },
      { p:'Which is correct?', o:['Yes, I will come.','Yes I will come.','Yes; I will come.','Yes: I will come.'], a:'Yes, I will come.', e:'Comma after yes.', b:'Yes পর কমা।' },
      { p:'Which is correct?', o:['It was a cold, windy night.','It was a cold windy night.','It was a cold; windy night.','It was a cold: windy night.'], a:'It was a cold, windy night.', e:'Comma between adjectives.', b:'Adjective এর মধ্যে কমা।' },
      { p:'Which is correct?', o:['What a beautiful day!','What a beautiful day.','What a beautiful day?','What a beautiful day;'], a:'What a beautiful day!', e:'Exclamation.', b:'Exclamation।' },
      { p:'Which is correct?', o:['He said he would come.','He said, he would come.','He said; he would come.','He said: he would come.'], a:'He said he would come.', e:'Indirect speech.', b:'Indirect speech।' },
      { p:'Which is correct?', o:['I was born on 5 May 1990.','I was born on 5, May 1990.','I was born on 5; May 1990.','I was born on 5: May 1990.'], a:'I was born on 5 May 1990.', e:'No comma in date.', b:'তারিখে কমা নেই।' },
      { p:'Which is correct?', o:['He is, after all, my brother.','He is after all, my brother.','He is, after all my brother.','He is after all my brother.'], a:'He is, after all, my brother.', e:'Parenthetical.', b:'Parenthetical।' },
      { p:'Which is correct?', o:['Could you please help me?','Could you please help me.','Could you please help me!','Could you, please help me'], a:'Could you please help me?', e:'Question mark.', b:'প্রশ্নবোধক চিহ্ন।' },
    ],
  },

  gapClue: {
    name: 'Gap Filling (with clues)', icon: 'book', class: 'all',
    lesson: {
      rules: [
        'Use the clue in brackets to decide the correct word form.',
        'Verb tense depends on time markers and subject.',
        'Adjectives modify nouns; adverbs modify verbs.',
        'Passive: be + V3. Perfect: have/has/had + V3.',
      ],
      examples: [
        'He <strong>goes</strong> (go) to school every day.',
        'She is <strong>beautiful</strong> (beauty).',
        'The house <strong>was built</strong> (build) last year.',
      ],
      bangla: 'বন্ধনীর clue দেখে verb/noun/adjective/adverb এর সঠিক রূপ বসাতে হয়।',
    },
    questions: [
      { p:'She is ___ (honest) student.', o:['a','an','the','—'], a:'an', e:'Vowel sound.', b:'Vowel sound।' },
      { p:'He ___ (go) to school every day.', o:['go','goes','going','gone'], a:'goes', e:'3rd singular.', b:'৩য় একবচন।' },
      { p:'They ___ (play) football yesterday.', o:['play','plays','played','playing'], a:'played', e:'Past simple.', b:'Past simple।' },
      { p:'I have ___ (finish) my homework.', o:['finish','finishes','finished','finishing'], a:'finished', e:'V3.', b:'V3।' },
      { p:'The sun ___ (rise) in the east.', o:['rise','rises','rising','rose'], a:'rises', e:'Universal truth.', b:'সর্বজনীন সত্য।' },
      { p:'He was ___ (watch) TV when I called.', o:['watch','watches','watched','watching'], a:'watching', e:'Past continuous.', b:'Past continuous।' },
      { p:'She is ___ (beauty).', o:['beauty','beautiful','beautifully','beautify'], a:'beautiful', e:'Adjective.', b:'Adjective।' },
      { p:'He speaks English ___ (fluent).', o:['fluent','fluently','fluency','fluentness'], a:'fluently', e:'Adverb.', b:'Adverb।' },
      { p:'The ___ (child) are playing.', o:['child','childs','children','childrens'], a:'children', e:'Irregular plural.', b:'Irregular plural।' },
      { p:'He is ___ (strong) than his brother.', o:['strong','stronger','strongest','more strong'], a:'stronger', e:'Comparative.', b:'Comparative।' },
      { p:'This is the ___ (good) film I have seen.', o:['good','better','best','more good'], a:'best', e:'Superlative.', b:'Superlative।' },
      { p:'She has ___ (write) three books.', o:['write','writes','wrote','written'], a:'written', e:'V3.', b:'V3।' },
      { p:'If it ___ (rain), we will stay home.', o:['rain','rains','rained','raining'], a:'rains', e:'First conditional.', b:'First conditional।' },
      { p:'He ___ (go) to London last year.', o:['go','goes','went','gone'], a:'went', e:'Past simple.', b:'Past simple।' },
      { p:'The book ___ (write) by Rina.', o:['write','wrote','was written','is writing'], a:'was written', e:'Passive.', b:'Passive।' },
      { p:'She has been ___ (study) for hours.', o:['study','studies','studied','studying'], a:'studying', e:'Perfect continuous.', b:'Perfect continuous।' },
      { p:'We ___ (live) here since 2015.', o:['live','lives','lived','have lived'], a:'have lived', e:'Present perfect.', b:'Present perfect।' },
      { p:'He is ___ (interest) in music.', o:['interest','interesting','interested','interests'], a:'interested', e:'Interested in.', b:'Interested in।' },
      { p:'This is a ___ (use) book.', o:['use','useful','useless','usefully'], a:'useful', e:'Adjective.', b:'Adjective।' },
      { p:'She sings ___ (beauty).', o:['beauty','beautiful','beautifully','beautify'], a:'beautifully', e:'Adverb.', b:'Adverb।' },
      { p:'He ___ (not finish) the work yet.', o:['not finish','did not finish','has not finished','not finished'], a:'has not finished', e:'Yet → present perfect.', b:'Yet → present perfect।' },
      { p:'It ___ (rain) since morning.', o:['rain','rains','has been raining','rained'], a:'has been raining', e:'Perfect continuous.', b:'Perfect continuous।' },
      { p:'If I ___ (be) you, I would apologize.', o:['am','was','were','be'], a:'were', e:'Subjunctive.', b:'Subjunctive।' },
      { p:'She wants ___ (become) a doctor.', o:['become','becomes','to become','becoming'], a:'to become', e:'Want to.', b:'Want to।' },
      { p:'He is good at ___ (sing).', o:['sing','sings','singing','sang'], a:'singing', e:'Gerund.', b:'Gerund।' },
      { p:'He suggested ___ (go) for a walk.', o:['go','goes','going','went'], a:'going', e:'Suggest + gerund.', b:'Suggest + gerund।' },
      { p:'I look forward to ___ (meet) you.', o:['meet','meets','meeting','met'], a:'meeting', e:'Gerund.', b:'Gerund।' },
      { p:'The ___ (inform) you gave was helpful.', o:['inform','informs','information','informing'], a:'information', e:'Noun.', b:'Noun।' },
      { p:'He is ___ (success) in business.', o:['success','successful','successfully','succeed'], a:'successful', e:'Adjective.', b:'Adjective।' },
      { p:'She dances ___ (grace).', o:['grace','graceful','gracefully','gracefulness'], a:'gracefully', e:'Adverb.', b:'Adverb।' },
      { p:'He is ___ (know) for his kindness.', o:['know','known','knowing','knew'], a:'known', e:'V3.', b:'V3।' },
      { p:'The house ___ (build) last year.', o:['build','built','was built','is built'], a:'was built', e:'Past passive.', b:'Past passive।' },
      { p:'English ___ (speak) worldwide.', o:['speak','speaks','is spoken','spoke'], a:'is spoken', e:'Present passive.', b:'Present passive।' },
      { p:'She has ___ (be) to London.', o:['be','been','being','was'], a:'been', e:'V3.', b:'V3।' },
      { p:'He was ___ (disappoint) with the result.', o:['disappoint','disappointing','disappointed','disappoints'], a:'disappointed', e:'V3 adjective.', b:'V3 adjective।' },
      { p:'The film was very ___ (interest).', o:['interest','interesting','interested','interests'], a:'interesting', e:'V-ing adjective.', b:'V-ing adjective।' },
      { p:'She was ___ (excite) about the trip.', o:['excite','exciting','excited','excites'], a:'excited', e:'V3 adjective.', b:'V3 adjective।' },
      { p:'It is a ___ (bore) story.', o:['bore','bored','boring','bores'], a:'boring', e:'V-ing adjective.', b:'V-ing adjective।' },
      { p:'I was ___ (surprise) to see him.', o:['surprise','surprising','surprised','surprises'], a:'surprised', e:'V3 adjective.', b:'V3 adjective।' },
      { p:'This is an ___ (amaze) view.', o:['amaze','amazed','amazing','amazes'], a:'amazing', e:'V-ing adjective.', b:'V-ing adjective।' },
      { p:'She felt ___ (tire) after work.', o:['tire','tiring','tired','tires'], a:'tired', e:'V3 adjective.', b:'V3 adjective।' },
      { p:'It was a ___ (frighten) experience.', o:['frighten','frightened','frightening','frightens'], a:'frightening', e:'V-ing adjective.', b:'V-ing adjective।' },
      { p:'He is ___ (rely) on his parents.', o:['rely','relying','reliable','relies'], a:'reliable', e:'Adjective.', b:'Adjective।' },
      { p:'Her ___ (kind) moved us.', o:['kind','kindly','kindness','kinder'], a:'kindness', e:'Noun.', b:'Noun।' },
      { p:'They live ___ (happy).', o:['happy','happily','happiness','happier'], a:'happily', e:'Adverb.', b:'Adverb।' },
      { p:'He is very ___ (create).', o:['create','creation','creative','creatively'], a:'creative', e:'Adjective.', b:'Adjective।' },
      { p:'Her ___ (achieve) is impressive.', o:['achieve','achievement','achievable','achieved'], a:'achievement', e:'Noun.', b:'Noun।' },
      { p:'He acted ___ (brave).', o:['brave','bravery','bravely','braver'], a:'bravely', e:'Adverb.', b:'Adverb।' },
      { p:'This is a ___ (mystery) case.', o:['mystery','mysterious','mysteriously','mystify'], a:'mysterious', e:'Adjective.', b:'Adjective।' },
      { p:'His ___ (explain) was clear.', o:['explain','explanation','explanatory','explained'], a:'explanation', e:'Noun.', b:'Noun।' },
    ],
  },

  gapNoClue: {
    name: 'Gap Filling (no clues)', icon: 'flag', class: 'all',
    lesson: {
      rules: [
        'Choose the correct preposition from context.',
        'Decide article based on sound of next word.',
        'Use fixed collocations: good at, afraid of, depend on.',
        'Prepositional verbs keep their preposition.',
      ],
      examples: [
        'He is good <strong>at</strong> English.',
        'I have been here <strong>since</strong> Monday.',
        'The book belongs <strong>to</strong> me.',
      ],
      bangla: 'Context দেখে সঠিক preposition, article বা connector বসাতে হয়। Fixed collocations মুখস্থ রাখতে হয়।',
    },
    questions: [
      { p:'He is ___ honest man.', o:['a','an','the','—'], a:'an', e:'Vowel sound.', b:'Vowel sound।' },
      { p:'I met him ___ Friday.', o:['in','on','at','by'], a:'on', e:'Days.', b:'দিন।' },
      { p:'She has been living here ___ 2010.', o:['from','since','for','at'], a:'since', e:'Starting point.', b:'শুরুর সময়।' },
      { p:'I have known him ___ ten years.', o:['since','for','in','at'], a:'for', e:'Duration.', b:'ব্যাপ্তি।' },
      { p:'He is ___ MBA.', o:['a','an','the','—'], a:'an', e:'Vowel start.', b:'Vowel start।' },
      { p:'The Padma is ___ longest river.', o:['a','an','the','—'], a:'the', e:'Superlative.', b:'Superlative।' },
      { p:'He is good ___ English.', o:['in','at','on','for'], a:'at', e:'Good at.', b:'Good at।' },
      { p:'We waited ___ the bus.', o:['on','for','to','at'], a:'for', e:'Wait for.', b:'Wait for।' },
      { p:'She is afraid ___ dogs.', o:['at','of','in','on'], a:'of', e:'Afraid of.', b:'Afraid of।' },
      { p:'They arrived ___ Dhaka yesterday.', o:['at','in','on','to'], a:'in', e:'Cities.', b:'শহর।' },
      { p:'I will meet you ___ 5 PM.', o:['in','on','at','by'], a:'at', e:'Clock time.', b:'ঘড়ির সময়।' },
      { p:'He is ___ best student.', o:['a','an','the','—'], a:'the', e:'Superlative.', b:'Superlative।' },
      { p:'I like ___ music.', o:['a','an','the','—'], a:'—', e:'General.', b:'সাধারণ।' },
      { p:'She plays ___ piano.', o:['a','an','the','—'], a:'the', e:'Instrument.', b:'বাদ্যযন্ত্র।' },
      { p:'I need ___ hour.', o:['a','an','the','—'], a:'an', e:'Silent h.', b:'Silent h।' },
      { p:'He was born ___ December.', o:['in','on','at','by'], a:'in', e:'Months.', b:'মাস।' },
      { p:'We walked ___ the river.', o:['along','in','at','to'], a:'along', e:'Along.', b:'Along।' },
      { p:'He is married ___ my sister.', o:['with','to','for','at'], a:'to', e:'Married to.', b:'Married to।' },
      { p:'She is famous ___ her cooking.', o:['of','for','in','at'], a:'for', e:'Famous for.', b:'Famous for।' },
      { p:'They depend ___ their parents.', o:['on','in','at','for'], a:'on', e:'Depend on.', b:'Depend on।' },
      { p:'I am tired ___ waiting.', o:['of','from','with','at'], a:'of', e:'Tired of.', b:'Tired of।' },
      { p:'The Himalayas are ___ Asia.', o:['in','on','at','to'], a:'in', e:'Continents.', b:'মহাদেশ।' },
      { p:'She has a talent ___ music.', o:['for','in','at','of'], a:'for', e:'Talent for.', b:'Talent for।' },
      { p:'He apologized ___ being late.', o:['of','for','to','at'], a:'for', e:'Apologize for.', b:'Apologize for।' },
      { p:'I have been here ___ Monday.', o:['from','since','for','at'], a:'since', e:'Since.', b:'Since।' },
      { p:'She is different ___ her sister.', o:['than','from','to','of'], a:'from', e:'Different from.', b:'Different from।' },
      { p:'We are proud ___ our country.', o:['of','for','in','at'], a:'of', e:'Proud of.', b:'Proud of।' },
      { p:'He insisted ___ going.', o:['on','in','at','for'], a:'on', e:'Insist on.', b:'Insist on।' },
      { p:'He is responsible ___ the project.', o:['of','for','in','at'], a:'for', e:'Responsible for.', b:'Responsible for।' },
      { p:'The book belongs ___ me.', o:['with','to','for','at'], a:'to', e:'Belong to.', b:'Belong to।' },
      { p:'She is good ___ cooking.', o:['in','at','on','of'], a:'at', e:'Good at.', b:'Good at।' },
      { p:'I am fond ___ sweets.', o:['at','of','in','on'], a:'of', e:'Fond of.', b:'Fond of।' },
      { p:'He is angry ___ me.', o:['at','with','on','in'], a:'with', e:'Angry with.', b:'Angry with।' },
      { p:'I am interested ___ music.', o:['at','in','on','of'], a:'in', e:'Interested in.', b:'Interested in।' },
      { p:'She is jealous ___ her friend.', o:['at','of','in','on'], a:'of', e:'Jealous of.', b:'Jealous of।' },
      { p:'He is kind ___ animals.', o:['at','to','for','in'], a:'to', e:'Kind to.', b:'Kind to।' },
      { p:'The house is made ___ bricks.', o:['at','of','in','with'], a:'of', e:'Made of.', b:'Made of।' },
      { p:'I am sorry ___ being late.', o:['at','for','in','of'], a:'for', e:'Sorry for.', b:'Sorry for।' },
      { p:'He is expert ___ mathematics.', o:['at','in','on','of'], a:'in', e:'Expert in.', b:'Expert in।' },
      { p:'I agree ___ you.', o:['at','with','on','of'], a:'with', e:'Agree with.', b:'Agree with।' },
      { p:'We must abide ___ the rules.', o:['at','by','in','of'], a:'by', e:'Abide by.', b:'Abide by।' },
      { p:'He is addicted ___ drugs.', o:['at','to','in','of'], a:'to', e:'Addicted to.', b:'Addicted to।' },
      { p:'She is afraid ___ the dark.', o:['at','of','in','on'], a:'of', e:'Afraid of.', b:'Afraid of।' },
      { p:'He is committed ___ his work.', o:['at','to','in','of'], a:'to', e:'Committed to.', b:'Committed to।' },
      { p:'They are concerned ___ the issue.', o:['at','about','in','of'], a:'about', e:'Concerned about.', b:'Concerned about।' },
      { p:'She is confident ___ her ability.', o:['at','of','in','on'], a:'of', e:'Confident of.', b:'Confident of।' },
      { p:'He is conscious ___ his duty.', o:['at','of','in','on'], a:'of', e:'Conscious of.', b:'Conscious of।' },
      { p:'She is delighted ___ the news.', o:['at','with','in','of'], a:'with', e:'Delighted with.', b:'Delighted with।' },
      { p:'He is engaged ___ business.', o:['at','in','of','on'], a:'in', e:'Engaged in.', b:'Engaged in।' },
      { p:'I am familiar ___ this place.', o:['at','with','in','of'], a:'with', e:'Familiar with.', b:'Familiar with।' },
    ],
  },

  rearranging: {
    name: 'Rearranging Sentences', icon: 'grid', class: 'all',
    lesson: {
      rules: [
        'Basic order: Subject + Verb + Object + Adverbial.',
        'Adjectives come before nouns; adverbs come after verbs.',
        'Questions: (Wh-) + Aux + Subject + Verb?',
        'Place expressions usually come after time expressions.',
      ],
      examples: [
        'He is an honest man. (S+V+art+adj+n)',
        'I met him yesterday. (S+V+O+time)',
        'Where is he going? (Wh + be + S + V-ing)',
      ],
      bangla: 'বাক্যের স্বাভাবিক ক্রম: Subject + Verb + Object + Adverbial। Wh-প্রশ্নে Wh + Aux + Subject + Verb।',
    },
    questions: [
      { p:'Arrange: (a) He is (b) honest (c) an (d) man.', o:['He is an honest man.','An honest he is man.','Honest an man he is.','Man an honest he is.'], a:'He is an honest man.', e:'S+V+art+adj+n.', b:'S+V+art+adj+n।' },
      { p:'Arrange: (a) went (b) I (c) to (d) school.', o:['I went to school.','To school I went.','School I to went.','Went I to school.'], a:'I went to school.', e:'S+V+prep+n.', b:'S+V+prep+n।' },
      { p:'Arrange: (a) beautiful (b) is (c) she (d) very.', o:['She is very beautiful.','Very she is beautiful.','Beautiful very she is.','She very is beautiful.'], a:'She is very beautiful.', e:'S+be+adv+adj.', b:'S+be+adv+adj।' },
      { p:'Arrange: (a) in (b) lives (c) Dhaka (d) he.', o:['He lives in Dhaka.','Dhaka he lives in.','In Dhaka lives he.','Lives he Dhaka in.'], a:'He lives in Dhaka.', e:'S+V+prep+place.', b:'S+V+prep+স্থান।' },
      { p:'Arrange: (a) English (b) speaks (c) she (d) fluently.', o:['She speaks English fluently.','Fluently speaks she English.','English she speaks fluently.','She English speaks fluently.'], a:'She speaks English fluently.', e:'S+V+O+adv.', b:'S+V+O+adv।' },
      { p:'Arrange: (a) a (b) is (c) he (d) doctor.', o:['He is a doctor.','A doctor he is.','Doctor a he is.','Is he a doctor.'], a:'He is a doctor.', e:'S+be+art+n.', b:'S+be+art+n।' },
      { p:'Arrange: (a) yesterday (b) I (c) him (d) met.', o:['I met him yesterday.','Yesterday met I him.','Him I met yesterday.','I him met yesterday.'], a:'I met him yesterday.', e:'S+V+O+time.', b:'S+V+O+time।' },
      { p:'Arrange: (a) reading (b) is (c) she (d) a book.', o:['She is reading a book.','A book is she reading.','Reading she is a book.','She reading is a book.'], a:'She is reading a book.', e:'S+be+V-ing+O.', b:'S+be+V-ing+O।' },
      { p:'Arrange: (a) do (b) what (c) you (d) do?', o:['What do you do?','Do you what do?','You do what do?','What you do do?'], a:'What do you do?', e:'Wh-question.', b:'Wh-question।' },
      { p:'Arrange: (a) not (b) she (c) did (d) come.', o:['She did not come.','Did not she come.','Not did she come.','Come she did not.'], a:'She did not come.', e:'S+aux+not+V.', b:'S+aux+not+V।' },
      { p:'Arrange: (a) the (b) is (c) sun (d) bright.', o:['The sun is bright.','Bright is the sun.','Is the sun bright.','Sun is the bright.'], a:'The sun is bright.', e:'S+be+adj.', b:'S+be+adj।' },
      { p:'Arrange: (a) all (b) he (c) knows (d) everything.', o:['He knows everything.','Everything he knows all.','He everything knows.','Knows he everything.'], a:'He knows everything.', e:'S+V+O.', b:'S+V+O।' },
      { p:'Arrange: (a) my (b) is (c) this (d) book.', o:['This is my book.','My book this is.','Is this my book.','Book my is this.'], a:'This is my book.', e:'S+be+poss+n.', b:'S+be+poss+n।' },
      { p:'Arrange: (a) very (b) is (c) she (d) kind.', o:['She is very kind.','Very kind she is.','Kind very she is.','She very is kind.'], a:'She is very kind.', e:'S+be+adv+adj.', b:'S+be+adv+adj।' },
      { p:'Arrange: (a) do (b) how (c) you (d) it?', o:['How do you do it?','Do you how do it?','You how do it?','How you do it?'], a:'How do you do it?', e:'Wh-question.', b:'Wh-question।' },
      { p:'Arrange: (a) never (b) I (c) late (d) am.', o:['I am never late.','Never am I late.','Am I never late.','Late never I am.'], a:'I am never late.', e:'S+be+adv+adj.', b:'S+be+adv+adj।' },
      { p:'Arrange: (a) is (b) where (c) he (d) going?', o:['Where is he going?','He where is going?','Is where he going?','Going he is where?'], a:'Where is he going?', e:'Wh + be + S + V-ing.', b:'Wh + be + S + V-ing।' },
      { p:'Arrange: (a) English (b) do (c) speak (d) you?', o:['Do you speak English?','You do speak English?','Speak do you English?','English do you speak?'], a:'Do you speak English?', e:'Yes/no question.', b:'Yes/no question।' },
      { p:'Arrange: (a) rain (b) it (c) will (d) tomorrow.', o:['It will rain tomorrow.','Tomorrow rain it will.','Will it rain tomorrow.','Rain it will tomorrow.'], a:'It will rain tomorrow.', e:'S+aux+V+time.', b:'S+aux+V+time।' },
      { p:'Arrange: (a) himself (b) he (c) hurt.', o:['He hurt himself.','Himself he hurt.','Hurt he himself.','He himself hurt.'], a:'He hurt himself.', e:'S+V+reflexive.', b:'S+V+reflexive।' },
      { p:'Arrange: (a) in (b) was (c) born (d) he (e) Dhaka.', o:['He was born in Dhaka.','Dhaka born he was in.','Was born he in Dhaka.','In Dhaka born he was.'], a:'He was born in Dhaka.', e:'S+be+V+prep+place.', b:'S+be+V+prep+place।' },
      { p:'Arrange: (a) to (b) I (c) go (d) have.', o:['I have to go.','Have I to go.','To go I have.','Go I have to.'], a:'I have to go.', e:'S+have to+V.', b:'S+have to+V।' },
      { p:'Arrange: (a) so (b) is (c) he (d) tall.', o:['He is so tall.','So tall he is.','Tall so he is.','Is he so tall.'], a:'He is so tall.', e:'S+be+so+adj.', b:'S+be+so+adj।' },
      { p:'Arrange: (a) work (b) hard (c) must (d) you.', o:['You must work hard.','Hard must you work.','Must work you hard.','Work must you hard.'], a:'You must work hard.', e:'S+modal+V+adv.', b:'S+modal+V+adv।' },
      { p:'Arrange: (a) up (b) get (c) at 6 (d) I.', o:['I get up at 6.','Up I get at 6.','At 6 up I get.','Get I up at 6.'], a:'I get up at 6.', e:'S+phrasal V+time.', b:'S+phrasal V+time।' },
      { p:'Arrange: (a) beautiful (b) a (c) is (d) flower (e) it.', o:['It is a beautiful flower.','A beautiful flower it is.','Beautiful is a flower it.','It beautiful a is flower.'], a:'It is a beautiful flower.', e:'S+be+art+adj+n.', b:'S+be+art+adj+n।' },
      { p:'Arrange: (a) yesterday (b) came (c) she (d) late.', o:['She came late yesterday.','Late yesterday she came.','Yesterday she came late.','Came she late yesterday.'], a:'She came late yesterday.', e:'S+V+adv+time.', b:'S+V+adv+time।' },
      { p:'Arrange: (a) tea (b) like (c) I (d) hot.', o:['I like hot tea.','Hot tea I like.','Like I hot tea.','Tea hot I like.'], a:'I like hot tea.', e:'S+V+adj+O.', b:'S+V+adj+O।' },
      { p:'Arrange: (a) is (b) this (c) book (d) my.', o:['This is my book.','My book this is.','Is this my book.','Book my is this.'], a:'This is my book.', e:'S+be+poss+n.', b:'S+be+poss+n।' },
      { p:'Arrange: (a) to (b) wants (c) he (d) go.', o:['He wants to go.','To go he wants.','Wants he to go.','Go he wants to.'], a:'He wants to go.', e:'S+want to+V.', b:'S+want to+V।' },
      { p:'Arrange: (a) student (b) a (c) is (d) he (e) good.', o:['He is a good student.','A good student he is.','Good is a student he.','He a good is student.'], a:'He is a good student.', e:'S+be+art+adj+n.', b:'S+be+art+adj+n।' },
      { p:'Arrange: (a) my (b) helped (c) friend (d) me.', o:['My friend helped me.','Helped my friend me.','Me my friend helped.','Friend my helped me.'], a:'My friend helped me.', e:'S+V+O.', b:'S+V+O।' },
      { p:'Arrange: (a) is (b) my (c) this (d) house.', o:['This is my house.','My house this is.','Is this my house.','House my is this.'], a:'This is my house.', e:'S+be+poss+n.', b:'S+be+poss+n।' },
      { p:'Arrange: (a) always (b) he (c) is (d) happy.', o:['He is always happy.','Always he is happy.','Happy always he is.','He always is happy.'], a:'He is always happy.', e:'S+be+adv+adj.', b:'S+be+adv+adj।' },
      { p:'Arrange: (a) eat (b) we (c) rice (d) every day.', o:['We eat rice every day.','Every day rice we eat.','Rice we eat every day.','Eat rice we every day.'], a:'We eat rice every day.', e:'S+V+O+time.', b:'S+V+O+time।' },
      { p:'Arrange: (a) was (b) the book (c) interesting (d) very.', o:['The book was very interesting.','Very interesting the book was.','Interesting was the book very.','The book very was interesting.'], a:'The book was very interesting.', e:'S+be+adv+adj.', b:'S+be+adv+adj।' },
      { p:'Arrange: (a) him (b) I (c) yesterday (d) saw.', o:['I saw him yesterday.','Him I saw yesterday.','Yesterday saw I him.','Saw him I yesterday.'], a:'I saw him yesterday.', e:'S+V+O+time.', b:'S+V+O+time।' },
      { p:'Arrange: (a) a (b) dog (c) is (d) it.', o:['It is a dog.','A dog it is.','Dog a it is.','Is it a dog.'], a:'It is a dog.', e:'S+be+art+n.', b:'S+be+art+n।' },
      { p:'Arrange: (a) at (b) was (c) born (d) he (e) Sylhet.', o:['He was born at Sylhet.','At Sylhet born he was.','Born was he at Sylhet.','Was he at Sylhet born.'], a:'He was born at Sylhet.', e:'S+be+V+prep+place.', b:'S+be+V+prep+place।' },
      { p:'Arrange: (a) how (b) old (c) are (d) you?', o:['How old are you?','How are old you?','You how old are?','Are you how old?'], a:'How old are you?', e:'Wh-question.', b:'Wh-question।' },
      { p:'Arrange: (a) him (b) give (c) the book (d) to.', o:['Give the book to him.','To him give the book.','The book to him give.','Him the book give to.'], a:'Give the book to him.', e:'Imperative+prep+obj.', b:'Imperative+prep+obj।' },
      { p:'Arrange: (a) the (b) boys (c) playing (d) are.', o:['The boys are playing.','Playing the boys are.','Are the boys playing.','Boys the are playing.'], a:'The boys are playing.', e:'S+be+V-ing.', b:'S+be+V-ing।' },
      { p:'Arrange: (a) will (b) tomorrow (c) come (d) I.', o:['I will come tomorrow.','Tomorrow come I will.','Come tomorrow I will.','Will I come tomorrow.'], a:'I will come tomorrow.', e:'S+aux+V+time.', b:'S+aux+V+time।' },
      { p:'Arrange: (a) has (b) she (c) book (d) a.', o:['She has a book.','A book she has.','Has she a book.','Book a has she.'], a:'She has a book.', e:'S+V+art+n.', b:'S+V+art+n।' },
      { p:'Arrange: (a) kind (b) very (c) is (d) he.', o:['He is very kind.','Very kind he is.','Kind very is he.','He very is kind.'], a:'He is very kind.', e:'S+be+adv+adj.', b:'S+be+adv+adj।' },
      { p:'Arrange: (a) last (b) night (c) arrived (d) he.', o:['He arrived last night.','Last night he arrived.','Arrived he last night.','Night last he arrived.'], a:'He arrived last night.', e:'S+V+time.', b:'S+V+time।' },
      { p:'Arrange: (a) fast (b) runs (c) he (d) very.', o:['He runs very fast.','Very fast he runs.','Fast very he runs.','Runs he very fast.'], a:'He runs very fast.', e:'S+V+adv+adv.', b:'S+V+adv+adv।' },
      { p:'Arrange: (a) my (b) is (c) mother (d) a teacher.', o:['My mother is a teacher.','A teacher my mother is.','Mother my is a teacher.','Is my mother a teacher.'], a:'My mother is a teacher.', e:'S+be+art+n.', b:'S+be+art+n।' },
      { p:'Arrange: (a) want (b) I (c) water (d) some.', o:['I want some water.','Some water I want.','Water some I want.','Want I some water.'], a:'I want some water.', e:'S+V+quantifier+n.', b:'S+V+quantifier+n।' },
      { p:'Arrange: (a) here (b) come (c) please.', o:['Please come here.','Come here please.','Here come please.','Please here come.'], a:'Please come here.', e:'Polite imperative.', b:'Polite imperative।' },
    ],
  },

  translation: {
    name: 'Translation (BN ↔ EN)', icon: 'chat', class: 'all',
    lesson: {
      rules: [
        'Bangla → English: identify tense from time markers.',
        'Subject-verb agreement matters.',
        'Use correct articles (a/an/the) and prepositions.',
        'Present simple for habits; present continuous for ongoing.',
        'English → Bangla: find the tense first, then pick the matching verb ending (<code>-ি</code>, <code>-ছি</code>, <code>-েছি</code>, <code>-ব</code>).',
        'Bangla puts the <strong>verb at the end</strong> — keep the subject, time and place words in order.',
        'Passive → <code>করা হয় / হয়েছিল / হবে</code>; conditions end in <code>-লে</code>; comparison uses <code>-র চেয়ে</code>.',
        'Proverbs and fixed phrases are translated by meaning, not word by word.',
      ],
      examples: [
        'সে প্রতিদিন স্কুলে যায় → He <strong>goes</strong> to school every day.',
        'আমি ভাত খাই → I <strong>eat</strong> rice.',
        'He reads a book every day → সে প্রতিদিন একটি বই পড়<strong>ে</strong>।',
        'I am writing a letter → আমি একটি চিঠি লিখ<strong>ছি</strong>।',
        'If it rains, we will stay at home → বৃষ্টি হ<strong>লে</strong> আমরা বাড়িতে থাক<strong>ব</strong>।',
      ],
      bangla: 'বাংলা থেকে ইংরেজি অনুবাদে tense, subject-verb agreement, article ও preposition সঠিক রাখতে হয়। ইংরেজি থেকে বাংলা অনুবাদে আগে tense চিনে নাও, তারপর ক্রিয়ার সঠিক রূপ (-ি, -ছি, -েছি, -ব) বসাও এবং ক্রিয়া বাক্যের শেষে রাখো।',
    },
    questions: [
      { p:'সে প্রতিদিন স্কুলে যায়।', o:['He goes to school every day.','He go to school every day.','He going to school every day.','He went to school every day.'], a:'He goes to school every day.', e:'Habit → present simple.', b:'অভ্যাস → present simple।' },
      { p:'আমি ভাত খাই।', o:['I eat rice.','I eats rice.','I eating rice.','I ate rice.'], a:'I eat rice.', e:'I + base verb.', b:'I + base verb।' },
      { p:'তুমি কী করছ?', o:['What are you doing?','What you doing?','What do you doing?','What are doing you?'], a:'What are you doing?', e:'Present continuous question.', b:'Present continuous question।' },
      { p:'তিনি একজন ডাক্তার।', o:['He is a doctor.','He a doctor.','He is doctor.','He doctor is.'], a:'He is a doctor.', e:'Article required.', b:'Article প্রয়োজন।' },
      { p:'আমার একটি বই আছে।', o:['I have a book.','I has a book.','I am a book.','I having a book.'], a:'I have a book.', e:'Have for possession.', b:'Have for possession।' },
      { p:'সে খুব সুন্দরী।', o:['She is very beautiful.','She very beautiful.','She is very beauty.','Very beautiful she.'], a:'She is very beautiful.', e:'Very + adj.', b:'Very + adj।' },
      { p:'আমরা ইংরেজি শিখছি।', o:['We are learning English.','We learn English.','We learning English.','We are learn English.'], a:'We are learning English.', e:'Present continuous.', b:'Present continuous।' },
      { p:'সে আগামীকাল আসবে।', o:['He will come tomorrow.','He comes tomorrow.','He coming tomorrow.','He came tomorrow.'], a:'He will come tomorrow.', e:'Future simple.', b:'Future simple।' },
      { p:'আমি সকালে হাঁটতে ভালোবাসি।', o:['I love to walk in the morning.','I loving walk morning.','I love walk morning.','I walk loves in morning.'], a:'I love to walk in the morning.', e:'Love to + verb.', b:'Love to + verb।' },
      { p:'তিনি গতকাল ঢাকায় গিয়েছিলেন।', o:['He went to Dhaka yesterday.','He goes to Dhaka yesterday.','He gone to Dhaka yesterday.','He going to Dhaka yesterday.'], a:'He went to Dhaka yesterday.', e:'Past simple.', b:'Past simple।' },
      { p:'আমি তিন বছর ধরে এখানে আছি।', o:['I have been here for three years.','I am here for three years.','I was here three years.','I here three years.'], a:'I have been here for three years.', e:'Present perfect + for.', b:'Present perfect + for।' },
      { p:'আজ আকাশ পরিষ্কার।', o:['The sky is clear today.','Sky clear today.','Today clear sky.','The sky clear today.'], a:'The sky is clear today.', e:'Article + be + adj.', b:'Article + be + adj।' },
      { p:'তার দুইটি ভাই আছে।', o:['He has two brothers.','He have two brothers.','He having two brothers.','He is two brothers.'], a:'He has two brothers.', e:'3rd person → has.', b:'৩য় পুরুষ → has।' },
      { p:'আমি বই পড়তে ভালোবাসি।', o:['I love reading books.','I love read books.','I loving books.','I love to reads books.'], a:'I love reading books.', e:'Love + gerund.', b:'Love + gerund।' },
      { p:'সে আমার বন্ধু।', o:['He is my friend.','He my friend.','He is friend.','My friend he.'], a:'He is my friend.', e:'Possessive + noun.', b:'Possessive + noun।' },
      { p:'আমাদের একটি কুকুর আছে।', o:['We have a dog.','We has a dog.','We having a dog.','We are a dog.'], a:'We have a dog.', e:'Plural subject.', b:'বহুবচন subject।' },
      { p:'আজ বৃষ্টি হচ্ছে।', o:['It is raining today.','It rains today.','Today raining.','Rain today.'], a:'It is raining today.', e:'Present continuous + dummy it.', b:'Present continuous + dummy it।' },
      { p:'সে বাংলা বলতে পারে।', o:['He can speak Bangla.','He speaks can Bangla.','He can speaks Bangla.','He speaking Bangla.'], a:'He can speak Bangla.', e:'Can + base verb.', b:'Can + base verb।' },
      { p:'আমি সবসময় সত্য বলি।', o:['I always tell the truth.','I tell always truth.','I always tells truth.','I telling truth.'], a:'I always tell the truth.', e:'Frequency adverb.', b:'Frequency adverb।' },
      { p:'তিনি ইংরেজি শেখান।', o:['He teaches English.','He teach English.','He teaching English.','He taught now English.'], a:'He teaches English.', e:'3rd person -es.', b:'৩য় পুরুষ -es।' },
      { p:'আমার তিনটি বই আছে।', o:['I have three books.','I has three books.','I have three book.','I having three books.'], a:'I have three books.', e:'Plural noun.', b:'Plural noun।' },
      { p:'তিনি কখনো মিথ্যা বলেন না।', o:['He never tells a lie.','He never tell a lie.','He tells never lie.','He not tell lie.'], a:'He never tells a lie.', e:'3rd person singular.', b:'৩য় একবচন।' },
      { p:'আমি এটা পছন্দ করি না।', o:['I do not like it.','I not like it.','I does not like it.','I am not liking it.'], a:'I do not like it.', e:'Negative present simple.', b:'Negative present simple।' },
      { p:'আজ আমরা যাব।', o:['We will go today.','We go today will.','Today we going.','We going today.'], a:'We will go today.', e:'Future simple.', b:'Future simple।' },
      { p:'তিনি গতকাল এসেছিলেন।', o:['He came yesterday.','He comes yesterday.','He coming yesterday.','He has come yesterday.'], a:'He came yesterday.', e:'Past simple.', b:'Past simple।' },
      { p:'আমি এখন ব্যস্ত।', o:['I am busy now.','I busy now.','I am now busy is.','I have busy now.'], a:'I am busy now.', e:'Am + adj.', b:'Am + adj।' },
      { p:'সে আজ স্কুলে যায়নি।', o:['He did not go to school today.','He does not go to school today.','He not went school today.','He no go school today.'], a:'He did not go to school today.', e:'Past negative.', b:'Past negative।' },
      { p:'আমার একটা আইডিয়া আছে।', o:['I have an idea.','I have a idea.','I has an idea.','I having idea.'], a:'I have an idea.', e:'An before vowel.', b:'Vowel এর আগে an।' },
      { p:'তুমি কোথায় থাকো?', o:['Where do you live?','Where you live?','Where live you?','Where are you living now?'], a:'Where do you live?', e:'Wh-question.', b:'Wh-question।' },
      { p:'আমি ছোটবেলা থেকে এখানে আছি।', o:['I have been here since childhood.','I am here since childhood.','I was here from childhood.','I here from childhood.'], a:'I have been here since childhood.', e:'Present perfect + since.', b:'Present perfect + since।' },
      { p:'তিনি প্রতিদিন সংবাদপত্র পড়েন।', o:['He reads the newspaper every day.','He read newspaper every day.','He reads newspaper every days.','He reading newspaper every day.'], a:'He reads the newspaper every day.', e:'3rd singular.', b:'৩য় একবচন।' },
      { p:'আমি তোমাকে সাহায্য করব।', o:['I will help you.','I help you will.','I helping you.','I helped you will.'], a:'I will help you.', e:'Future simple.', b:'Future simple।' },
      { p:'সে আমার চেয়ে লম্বা।', o:['He is taller than me.','He is tall than me.','He is more tall than me.','He taller than me is.'], a:'He is taller than me.', e:'Comparative.', b:'Comparative।' },
      { p:'আমি বাজারে যাচ্ছি।', o:['I am going to the market.','I go to market.','I going market.','I am go market.'], a:'I am going to the market.', e:'Present continuous.', b:'Present continuous।' },
      { p:'তিনি আমার সাথে থাকেন।', o:['He lives with me.','He live with me.','He lives me with.','He living with me.'], a:'He lives with me.', e:'3rd singular.', b:'৩য় একবচন।' },
      { p:'আমরা গতকাল সিনেমা দেখেছি।', o:['We watched a movie yesterday.','We watch a movie yesterday.','We watching a movie yesterday.','We watches a movie yesterday.'], a:'We watched a movie yesterday.', e:'Past simple.', b:'Past simple।' },
      { p:'সে প্রতিদিন ব্যায়াম করে।', o:['He exercises every day.','He exercise every day.','He exercising every day.','He exercised every day.'], a:'He exercises every day.', e:'3rd singular.', b:'৩য় একবচন।' },
      { p:'আমি ইংরেজি শিখতে চাই।', o:['I want to learn English.','I want learn English.','I want learning English.','I wants to learn English.'], a:'I want to learn English.', e:'Want to + verb.', b:'Want to + verb।' },
      { p:'তিনি খুব ভালো গান গায়।', o:['He sings very well.','He sing very well.','He sings very good.','He singing very well.'], a:'He sings very well.', e:'Adverb well.', b:'Adverb well।' },
      { p:'আমার বাবা একজন শিক্ষক।', o:['My father is a teacher.','My father a teacher.','My father is teacher.','My father teacher is.'], a:'My father is a teacher.', e:'Article.', b:'Article।' },
      { p:'আমরা একসাথে খেলি।', o:['We play together.','We plays together.','We playing together.','We played together always.'], a:'We play together.', e:'Simple present.', b:'Simple present।' },
      { p:'সে এখন ঘুমাচ্ছে।', o:['He is sleeping now.','He sleeps now.','He sleep now.','He sleeping now.'], a:'He is sleeping now.', e:'Present continuous.', b:'Present continuous।' },
      { p:'আমি এটা কখনো দেখিনি।', o:['I have never seen this.','I never see this.','I did not see this.','I am never seeing this.'], a:'I have never seen this.', e:'Present perfect + never.', b:'Present perfect + never।' },
      { p:'তিনি অনেক ধনী।', o:['He is very rich.','He very rich.','He is much rich.','He rich is very.'], a:'He is very rich.', e:'Very + adj.', b:'Very + adj।' },
      { p:'আমি আগামীকাল আসব।', o:['I will come tomorrow.','I come tomorrow.','I coming tomorrow.','I came tomorrow.'], a:'I will come tomorrow.', e:'Future simple.', b:'Future simple।' },
      { p:'সে খুব দ্রুত দৌড়ায়।', o:['He runs very fast.','He run very fast.','He runs very fastly.','He running fast.'], a:'He runs very fast.', e:'Adverb fast.', b:'Adverb fast।' },
      { p:'আমার মা রান্না করছেন।', o:['My mother is cooking.','My mother cooks.','My mother cooking.','My mother cook.'], a:'My mother is cooking.', e:'Present continuous.', b:'Present continuous।' },
      { p:'তিনি বই পড়তে ভালোবাসেন।', o:['He loves reading books.','He love reading books.','He loves read books.','He loving books.'], a:'He loves reading books.', e:'Love + gerund.', b:'Love + gerund।' },
      { p:'আমি আজ স্কুলে যাব না।', o:['I will not go to school today.','I not go to school today.','I do not go to school today.','I am not go to school today.'], a:'I will not go to school today.', e:'Future negative.', b:'Future negative।' },
      { p:'সে আমার বন্ধু নয়।', o:['He is not my friend.','He not is my friend.','He is my friend not.','He no my friend.'], a:'He is not my friend.', e:'Negative be.', b:'Negative be।' },
      { p:'আমরা সপ্তাহে একদিন সিনেমা দেখি।', o:['We watch a movie once a week.','We watches a movie once a week.','We watching a movie once a week.','We watch a movie one week.'], a:'We watch a movie once a week.', e:'Habit.', b:'Habit।' },
      /* ---- English → Bangla (বাংলায় অনুবাদ) ---- */
      { p:'He reads a book every day.', o:['সে প্রতিদিন একটি বই পড়ে।', 'সে প্রতিদিন একটি বই পড়ছে।', 'সে প্রতিদিন একটি বই পড়েছিল।', 'সে প্রতিদিন একটি বই পড়বে।'], a:'সে প্রতিদিন একটি বই পড়ে।', e:'Habit or general fact → simple present tense in Bangla.', b:'অভ্যাস বা চিরন্তন সত্য বোঝাতে simple present (যেমন: পড়ে, খাই, যায়)।' },
      { p:'I drink tea every morning.', o:['আমি প্রতিদিন সকালে চা খাই।', 'আমি প্রতিদিন সকালে চা খাচ্ছি।', 'আমি গতকাল সকালে চা খেয়েছিলাম।', 'আমি প্রতিদিন সকালে চা খাব।'], a:'আমি প্রতিদিন সকালে চা খাই।', e:'Habit or general fact → simple present tense in Bangla.', b:'অভ্যাস বা চিরন্তন সত্য বোঝাতে simple present (যেমন: পড়ে, খাই, যায়)।' },
      { p:'They play football in the evening.', o:['তারা বিকেলে ফুটবল খেলে।', 'তারা বিকেলে ফুটবল খেলছে।', 'তারা বিকেলে ফুটবল খেলেছিল।', 'তারা বিকেলে ফুটবল খেলবে।'], a:'তারা বিকেলে ফুটবল খেলে।', e:'Habit or general fact → simple present tense in Bangla.', b:'অভ্যাস বা চিরন্তন সত্য বোঝাতে simple present (যেমন: পড়ে, খাই, যায়)।' },
      { p:'My mother cooks delicious food.', o:['আমার মা সুস্বাদু খাবার রান্না করেন।', 'আমার মা সুস্বাদু খাবার রান্না করছেন।', 'আমার মা সুস্বাদু খাবার রান্না করেছিলেন।', 'আমার মা সুস্বাদু খাবার রান্না করবেন।'], a:'আমার মা সুস্বাদু খাবার রান্না করেন।', e:'Habit or general fact → simple present tense in Bangla.', b:'অভ্যাস বা চিরন্তন সত্য বোঝাতে simple present (যেমন: পড়ে, খাই, যায়)।' },
      { p:'She sings very well.', o:['সে খুব ভালো গান গায়।', 'সে খুব ভালো গান গাইছে।', 'সে খুব ভালো গান গেয়েছিল।', 'সে খুব ভালো গান গাইবে।'], a:'সে খুব ভালো গান গায়।', e:'Habit or general fact → simple present tense in Bangla.', b:'অভ্যাস বা চিরন্তন সত্য বোঝাতে simple present (যেমন: পড়ে, খাই, যায়)।' },
      { p:'We go to the mosque on Fridays.', o:['আমরা শুক্রবারে মসজিদে যাই।', 'আমরা শুক্রবারে মসজিদে যাচ্ছি।', 'আমরা শুক্রবারে মসজিদে গিয়েছিলাম।', 'তারা শুক্রবারে মসজিদে যায়।'], a:'আমরা শুক্রবারে মসজিদে যাই।', e:'Habit or general fact → simple present tense in Bangla.', b:'অভ্যাস বা চিরন্তন সত্য বোঝাতে simple present (যেমন: পড়ে, খাই, যায়)।' },
      { p:'The teacher teaches us English.', o:['শিক্ষক আমাদের ইংরেজি পড়ান।', 'শিক্ষক আমাদের ইংরেজি পড়াচ্ছেন।', 'শিক্ষক আমাদের ইংরেজি পড়েছিলেন।', 'শিক্ষক আমাদের গণিত পড়ান।'], a:'শিক্ষক আমাদের ইংরেজি পড়ান।', e:'Habit or general fact → simple present tense in Bangla.', b:'অভ্যাস বা চিরন্তন সত্য বোঝাতে simple present (যেমন: পড়ে, খাই, যায়)।' },
      { p:'Fish live in water.', o:['মাছ পানিতে বাস করে।', 'মাছ পানিতে বাস করছে।', 'মাছ ডাঙায় বাস করে।', 'মাছ পানিতে বাস করবে।'], a:'মাছ পানিতে বাস করে।', e:'Habit or general fact → simple present tense in Bangla.', b:'অভ্যাস বা চিরন্তন সত্য বোঝাতে simple present (যেমন: পড়ে, খাই, যায়)।' },
      { p:'The sun rises in the east.', o:['সূর্য পূর্ব দিকে ওঠে।', 'সূর্য পূর্ব দিকে উঠছে।', 'সূর্য পশ্চিম দিকে ওঠে।', 'সূর্য পূর্ব দিকে উঠবে।'], a:'সূর্য পূর্ব দিকে ওঠে।', e:'Habit or general fact → simple present tense in Bangla.', b:'অভ্যাস বা চিরন্তন সত্য বোঝাতে simple present (যেমন: পড়ে, খাই, যায়)।' },
      { p:'My father works in a bank.', o:['আমার বাবা ব্যাংকে কাজ করেন।', 'আমার বাবা ব্যাংকে কাজ করছেন।', 'আমার বাবা ব্যাংকে কাজ করবেন।', 'আমার বাবা স্কুলে কাজ করেন।'], a:'আমার বাবা ব্যাংকে কাজ করেন।', e:'Habit or general fact → simple present tense in Bangla.', b:'অভ্যাস বা চিরন্তন সত্য বোঝাতে simple present (যেমন: পড়ে, খাই, যায়)।' },
      { p:'Rahim goes to college by bus.', o:['রহিম বাসে কলেজে যায়।', 'রহিম বাসে কলেজে যাচ্ছে।', 'রহিম বাসে কলেজে গিয়েছিল।', 'রহিম ট্রেনে কলেজে যায়।'], a:'রহিম বাসে কলেজে যায়।', e:'Habit or general fact → simple present tense in Bangla.', b:'অভ্যাস বা চিরন্তন সত্য বোঝাতে simple present (যেমন: পড়ে, খাই, যায়)।' },
      { p:'I wake up early in the morning.', o:['আমি খুব সকালে ঘুম থেকে উঠি।', 'আমি খুব সকালে ঘুম থেকে উঠছি।', 'আমি খুব সকালে ঘুম থেকে উঠেছিলাম।', 'আমি খুব সকালে ঘুমাই।'], a:'আমি খুব সকালে ঘুম থেকে উঠি।', e:'Habit or general fact → simple present tense in Bangla.', b:'অভ্যাস বা চিরন্তন সত্য বোঝাতে simple present (যেমন: পড়ে, খাই, যায়)।' },
      { p:'She does not eat meat.', o:['সে মাংস খায় না।', 'সে মাংস খাচ্ছে না।', 'সে মাংস খায়নি।', 'সে মাংস খাবে না।'], a:'সে মাংস খায় না।', e:'Habit or general fact → simple present tense in Bangla.', b:'অভ্যাস বা চিরন্তন সত্য বোঝাতে simple present (যেমন: পড়ে, খাই, যায়)।' },
      { p:'Do you like mangoes?', o:['তুমি কি আম পছন্দ করো?', 'তুমি কি আম পছন্দ করছ?', 'তুমি কি আম পছন্দ করেছিলে?', 'তুমি কি আম পছন্দ করবে?'], a:'তুমি কি আম পছন্দ করো?', e:'Habit or general fact → simple present tense in Bangla.', b:'অভ্যাস বা চিরন্তন সত্য বোঝাতে simple present (যেমন: পড়ে, খাই, যায়)।' },
      { p:'I am writing a letter.', o:['আমি একটি চিঠি লিখছি।', 'আমি একটি চিঠি লিখি।', 'আমি একটি চিঠি লিখেছি।', 'আমি একটি চিঠি লিখব।'], a:'আমি একটি চিঠি লিখছি।', e:'Ongoing action → verb ends in -ছি / -ছ / -ছে.', b:'চলমান কাজ বোঝাতে ক্রিয়ার সাথে -ছি / -ছ / -ছে যোগ হয়।' },
      { p:'They are playing in the field.', o:['তারা মাঠে খেলছে।', 'তারা মাঠে খেলে।', 'তারা মাঠে খেলেছে।', 'তারা মাঠে খেলবে।'], a:'তারা মাঠে খেলছে।', e:'Ongoing action → verb ends in -ছি / -ছ / -ছে.', b:'চলমান কাজ বোঝাতে ক্রিয়ার সাথে -ছি / -ছ / -ছে যোগ হয়।' },
      { p:'The baby is sleeping.', o:['শিশুটি ঘুমাচ্ছে।', 'শিশুটি ঘুমায়।', 'শিশুটি ঘুমিয়েছে।', 'শিশুটি ঘুমাবে।'], a:'শিশুটি ঘুমাচ্ছে।', e:'Ongoing action → verb ends in -ছি / -ছ / -ছে.', b:'চলমান কাজ বোঝাতে ক্রিয়ার সাথে -ছি / -ছ / -ছে যোগ হয়।' },
      { p:'It is raining heavily.', o:['মুষলধারে বৃষ্টি হচ্ছে।', 'মুষলধারে বৃষ্টি হয়।', 'মুষলধারে বৃষ্টি হয়েছিল।', 'মুষলধারে বৃষ্টি হবে।'], a:'মুষলধারে বৃষ্টি হচ্ছে।', e:'Ongoing action → verb ends in -ছি / -ছ / -ছে.', b:'চলমান কাজ বোঝাতে ক্রিয়ার সাথে -ছি / -ছ / -ছে যোগ হয়।' },
      { p:'What are you reading?', o:['তুমি কী পড়ছ?', 'তুমি কী পড়ো?', 'তুমি কী পড়েছ?', 'তুমি কী পড়বে?'], a:'তুমি কী পড়ছ?', e:'Ongoing action → verb ends in -ছি / -ছ / -ছে.', b:'চলমান কাজ বোঝাতে ক্রিয়ার সাথে -ছি / -ছ / -ছে যোগ হয়।' },
      { p:'She is cooking in the kitchen.', o:['সে রান্নাঘরে রান্না করছে।', 'সে রান্নাঘরে রান্না করে।', 'সে রান্নাঘরে রান্না করেছিল।', 'সে রান্নাঘরে রান্না করবে।'], a:'সে রান্নাঘরে রান্না করছে।', e:'Ongoing action → verb ends in -ছি / -ছ / -ছে.', b:'চলমান কাজ বোঝাতে ক্রিয়ার সাথে -ছি / -ছ / -ছে যোগ হয়।' },
      { p:'We are waiting for the bus.', o:['আমরা বাসের জন্য অপেক্ষা করছি।', 'আমরা বাসের জন্য অপেক্ষা করি।', 'আমরা বাসের জন্য অপেক্ষা করেছিলাম।', 'আমরা বাসের জন্য অপেক্ষা করব।'], a:'আমরা বাসের জন্য অপেক্ষা করছি।', e:'Ongoing action → verb ends in -ছি / -ছ / -ছে.', b:'চলমান কাজ বোঝাতে ক্রিয়ার সাথে -ছি / -ছ / -ছে যোগ হয়।' },
      { p:'The students are listening to the teacher.', o:['ছাত্রছাত্রীরা শিক্ষকের কথা শুনছে।', 'ছাত্রছাত্রীরা শিক্ষকের কথা শোনে।', 'ছাত্রছাত্রীরা শিক্ষকের কথা শুনেছিল।', 'ছাত্রছাত্রীরা শিক্ষকের কথা শুনবে।'], a:'ছাত্রছাত্রীরা শিক্ষকের কথা শুনছে।', e:'Ongoing action → verb ends in -ছি / -ছ / -ছে.', b:'চলমান কাজ বোঝাতে ক্রিয়ার সাথে -ছি / -ছ / -ছে যোগ হয়।' },
      { p:'He is not watching television now.', o:['সে এখন টেলিভিশন দেখছে না।', 'সে এখন টেলিভিশন দেখে না।', 'সে এখন টেলিভিশন দেখেনি।', 'সে এখন টেলিভিশন দেখবে না।'], a:'সে এখন টেলিভিশন দেখছে না।', e:'Ongoing action → verb ends in -ছি / -ছ / -ছে.', b:'চলমান কাজ বোঝাতে ক্রিয়ার সাথে -ছি / -ছ / -ছে যোগ হয়।' },
      { p:'Why are you crying?', o:['তুমি কেন কাঁদছ?', 'তুমি কেন কাঁদো?', 'তুমি কেন কেঁদেছিলে?', 'তুমি কেন কাঁদবে?'], a:'তুমি কেন কাঁদছ?', e:'Ongoing action → verb ends in -ছি / -ছ / -ছে.', b:'চলমান কাজ বোঝাতে ক্রিয়ার সাথে -ছি / -ছ / -ছে যোগ হয়।' },
      { p:'I met my friend yesterday.', o:['আমি গতকাল আমার বন্ধুর সাথে দেখা করেছিলাম।', 'আমি গতকাল আমার বন্ধুর সাথে দেখা করি।', 'আমি গতকাল আমার বন্ধুর সাথে দেখা করছি।', 'আমি গতকাল আমার বন্ধুর সাথে দেখা করব।'], a:'আমি গতকাল আমার বন্ধুর সাথে দেখা করেছিলাম।', e:'Finished past action → past form (-লাম / -ল / -েছিল).', b:'সমাপ্ত অতীত কাজ বোঝাতে -ল / -লাম / -েছিল ব্যবহার হয়।' },
      { p:'She bought a new dress.', o:['সে একটি নতুন জামা কিনেছিল।', 'সে একটি নতুন জামা কেনে।', 'সে একটি নতুন জামা কিনছে।', 'সে একটি নতুন জামা কিনবে।'], a:'সে একটি নতুন জামা কিনেছিল।', e:'Finished past action → past form (-লাম / -ল / -েছিল).', b:'সমাপ্ত অতীত কাজ বোঝাতে -ল / -লাম / -েছিল ব্যবহার হয়।' },
      { p:'We visited Sylhet last year.', o:['আমরা গত বছর সিলেটে বেড়াতে গিয়েছিলাম।', 'আমরা প্রতি বছর সিলেটে বেড়াতে যাই।', 'আমরা আগামী বছর সিলেটে বেড়াতে যাব।', 'আমরা এখন সিলেটে বেড়াতে যাচ্ছি।'], a:'আমরা গত বছর সিলেটে বেড়াতে গিয়েছিলাম।', e:'Finished past action → past form (-লাম / -ল / -েছিল).', b:'সমাপ্ত অতীত কাজ বোঝাতে -ল / -লাম / -েছিল ব্যবহার হয়।' },
      { p:'The train arrived late.', o:['ট্রেনটি দেরিতে পৌঁছেছিল।', 'ট্রেনটি দেরিতে পৌঁছায়।', 'ট্রেনটি দেরিতে পৌঁছাচ্ছে।', 'ট্রেনটি দেরিতে পৌঁছাবে।'], a:'ট্রেনটি দেরিতে পৌঁছেছিল।', e:'Finished past action → past form (-লাম / -ল / -েছিল).', b:'সমাপ্ত অতীত কাজ বোঝাতে -ল / -লাম / -েছিল ব্যবহার হয়।' },
      { p:'I did not go to the market.', o:['আমি বাজারে যাইনি।', 'আমি বাজারে যাই না।', 'আমি বাজারে যাব না।', 'আমি বাজারে যাচ্ছি না।'], a:'আমি বাজারে যাইনি।', e:'Finished past action → past form (-লাম / -ল / -েছিল).', b:'সমাপ্ত অতীত কাজ বোঝাতে -ল / -লাম / -েছিল ব্যবহার হয়।' },
      { p:'Did you finish your homework?', o:['তুমি কি তোমার বাড়ির কাজ শেষ করেছ?', 'তুমি কি তোমার বাড়ির কাজ শেষ করছ?', 'তুমি কি তোমার বাড়ির কাজ শেষ করবে?', 'তুমি কি তোমার বাড়ির কাজ শেষ করো?'], a:'তুমি কি তোমার বাড়ির কাজ শেষ করেছ?', e:'Finished past action → past form (-লাম / -ল / -েছিল).', b:'সমাপ্ত অতীত কাজ বোঝাতে -ল / -লাম / -েছিল ব্যবহার হয়।' },
      { p:'My grandfather told us a story.', o:['আমার দাদা আমাদের একটি গল্প বলেছিলেন।', 'আমার দাদা আমাদের একটি গল্প বলেন।', 'আমার দাদা আমাদের একটি গল্প বলছেন।', 'আমার দাদা আমাদের একটি গল্প বলবেন।'], a:'আমার দাদা আমাদের একটি গল্প বলেছিলেন।', e:'Finished past action → past form (-লাম / -ল / -েছিল).', b:'সমাপ্ত অতীত কাজ বোঝাতে -ল / -লাম / -েছিল ব্যবহার হয়।' },
      { p:'They won the match.', o:['তারা ম্যাচটি জিতেছিল।', 'তারা ম্যাচটি জেতে।', 'তারা ম্যাচটি জিতছে।', 'তারা ম্যাচটি জিতবে।'], a:'তারা ম্যাচটি জিতেছিল।', e:'Finished past action → past form (-লাম / -ল / -েছিল).', b:'সমাপ্ত অতীত কাজ বোঝাতে -ল / -লাম / -েছিল ব্যবহার হয়।' },
      { p:'It was a cold night.', o:['রাতটি ছিল ঠান্ডা।', 'রাতটি হবে ঠান্ডা।', 'রাতটি ছিল গরম।', 'রাতটি ঠান্ডা নয়।'], a:'রাতটি ছিল ঠান্ডা।', e:'Finished past action → past form (-লাম / -ল / -েছিল).', b:'সমাপ্ত অতীত কাজ বোঝাতে -ল / -লাম / -েছিল ব্যবহার হয়।' },
      { p:'She lost her pen yesterday.', o:['সে গতকাল তার কলমটি হারিয়েছিল।', 'সে গতকাল তার কলমটি হারায়।', 'সে গতকাল তার কলমটি হারাচ্ছে।', 'সে গতকাল তার কলমটি হারাবে।'], a:'সে গতকাল তার কলমটি হারিয়েছিল।', e:'Finished past action → past form (-লাম / -ল / -েছিল).', b:'সমাপ্ত অতীত কাজ বোঝাতে -ল / -লাম / -েছিল ব্যবহার হয়।' },
      { p:'The children were playing in the park.', o:['ছেলেমেয়েরা পার্কে খেলছিল।', 'ছেলেমেয়েরা পার্কে খেলছে।', 'ছেলেমেয়েরা পার্কে খেলে।', 'ছেলেমেয়েরা পার্কে খেলবে।'], a:'ছেলেমেয়েরা পার্কে খেলছিল।', e:'Past continuous → -ছিল / -ছিলাম.', b:'অতীতে চলমান কাজ বোঝাতে -ছিল / -ছিলাম হয়।' },
      { p:'I was reading when he came.', o:['সে যখন এল, আমি তখন পড়ছিলাম।', 'সে যখন এল, আমি তখন পড়ছি।', 'সে যখন আসবে, আমি তখন পড়ছিলাম।', 'সে যখন এল, আমি তখন পড়ব।'], a:'সে যখন এল, আমি তখন পড়ছিলাম।', e:'Past continuous → -ছিল / -ছিলাম.', b:'অতীতে চলমান কাজ বোঝাতে -ছিল / -ছিলাম হয়।' },
      { p:'I will call you tomorrow.', o:['আমি তোমাকে আগামীকাল ফোন করব।', 'আমি তোমাকে আগামীকাল ফোন করি।', 'আমি তোমাকে আগামীকাল ফোন করছি।', 'আমি তোমাকে গতকাল ফোন করেছিলাম।'], a:'আমি তোমাকে আগামীকাল ফোন করব।', e:'Future action → -ব / -বে / -বেন ending.', b:'ভবিষ্যৎ কাজ বোঝাতে ক্রিয়ার শেষে -ব / -বে / -বেন হয়।' },
      { p:'They will arrive next week.', o:['তারা আগামী সপ্তাহে পৌঁছাবে।', 'তারা আগামী সপ্তাহে পৌঁছায়।', 'তারা আগামী সপ্তাহে পৌঁছেছে।', 'তারা গত সপ্তাহে পৌঁছেছিল।'], a:'তারা আগামী সপ্তাহে পৌঁছাবে।', e:'Future action → -ব / -বে / -বেন ending.', b:'ভবিষ্যৎ কাজ বোঝাতে ক্রিয়ার শেষে -ব / -বে / -বেন হয়।' },
      { p:'It will rain tomorrow.', o:['আগামীকাল বৃষ্টি হবে।', 'আগামীকাল বৃষ্টি হয়।', 'গতকাল বৃষ্টি হয়েছিল।', 'আগামীকাল বৃষ্টি হচ্ছে।'], a:'আগামীকাল বৃষ্টি হবে।', e:'Future action → -ব / -বে / -বেন ending.', b:'ভবিষ্যৎ কাজ বোঝাতে ক্রিয়ার শেষে -ব / -বে / -বেন হয়।' },
      { p:'We shall win the game.', o:['আমরা খেলায় জিতব।', 'আমরা খেলায় জিতি।', 'আমরা খেলায় জিতেছিলাম।', 'আমরা খেলায় জিতছি।'], a:'আমরা খেলায় জিতব।', e:'Future action → -ব / -বে / -বেন ending.', b:'ভবিষ্যৎ কাজ বোঝাতে ক্রিয়ার শেষে -ব / -বে / -বেন হয়।' },
      { p:'She will not come to the party.', o:['সে পার্টিতে আসবে না।', 'সে পার্টিতে আসে না।', 'সে পার্টিতে আসেনি।', 'সে পার্টিতে আসছে না।'], a:'সে পার্টিতে আসবে না।', e:'Future action → -ব / -বে / -বেন ending.', b:'ভবিষ্যৎ কাজ বোঝাতে ক্রিয়ার শেষে -ব / -বে / -বেন হয়।' },
      { p:'Will you help me?', o:['তুমি কি আমাকে সাহায্য করবে?', 'তুমি কি আমাকে সাহায্য করো?', 'তুমি কি আমাকে সাহায্য করেছ?', 'তুমি কি আমাকে সাহায্য করছ?'], a:'তুমি কি আমাকে সাহায্য করবে?', e:'Future action → -ব / -বে / -বেন ending.', b:'ভবিষ্যৎ কাজ বোঝাতে ক্রিয়ার শেষে -ব / -বে / -বেন হয়।' },
      { p:'He will become a doctor.', o:['সে ডাক্তার হবে।', 'সে ডাক্তার হয়।', 'সে ডাক্তার হয়েছিল।', 'সে ডাক্তার হচ্ছে।'], a:'সে ডাক্তার হবে।', e:'Future action → -ব / -বে / -বেন ending.', b:'ভবিষ্যৎ কাজ বোঝাতে ক্রিয়ার শেষে -ব / -বে / -বেন হয়।' },
      { p:'The exam will begin at ten o\'clock.', o:['পরীক্ষা দশটায় শুরু হবে।', 'পরীক্ষা দশটায় শুরু হয়।', 'পরীক্ষা দশটায় শুরু হয়েছিল।', 'পরীক্ষা দশটায় শুরু হচ্ছে।'], a:'পরীক্ষা দশটায় শুরু হবে।', e:'Future action → -ব / -বে / -বেন ending.', b:'ভবিষ্যৎ কাজ বোঝাতে ক্রিয়ার শেষে -ব / -বে / -বেন হয়।' },
      { p:'I will meet my teacher next Friday.', o:['আমি আগামী শুক্রবার আমার শিক্ষকের সাথে দেখা করব।', 'আমি আগামী শুক্রবার আমার শিক্ষকের সাথে দেখা করি।', 'আমি আগামী শুক্রবার আমার শিক্ষকের সাথে দেখা করেছিলাম।', 'আমি গত শুক্রবার আমার শিক্ষকের সাথে দেখা করব।'], a:'আমি আগামী শুক্রবার আমার শিক্ষকের সাথে দেখা করব।', e:'Future action → -ব / -বে / -বেন ending.', b:'ভবিষ্যৎ কাজ বোঝাতে ক্রিয়ার শেষে -ব / -বে / -বেন হয়।' },
      { p:'What will you do after the exam?', o:['পরীক্ষার পর তুমি কী করবে?', 'পরীক্ষার পর তুমি কী করো?', 'পরীক্ষার পর তুমি কী করেছ?', 'পরীক্ষার পর তুমি কী করছ?'], a:'পরীক্ষার পর তুমি কী করবে?', e:'Future action → -ব / -বে / -বেন ending.', b:'ভবিষ্যৎ কাজ বোঝাতে ক্রিয়ার শেষে -ব / -বে / -বেন হয়।' },
      { p:'I have finished my work.', o:['আমি আমার কাজ শেষ করেছি।', 'আমি আমার কাজ শেষ করি।', 'আমি আমার কাজ শেষ করছি।', 'আমি আমার কাজ শেষ করব।'], a:'আমি আমার কাজ শেষ করেছি।', e:'Result or experience up to now → -েছি / -েছে.', b:'বর্তমানে সম্পন্ন কাজ বোঝাতে -েছি / -েছ / -েছে হয়।' },
      { p:'She has gone to school.', o:['সে স্কুলে গেছে।', 'সে স্কুলে যায়।', 'সে স্কুলে যাচ্ছে।', 'সে স্কুলে যাবে।'], a:'সে স্কুলে গেছে।', e:'Result or experience up to now → -েছি / -েছে.', b:'বর্তমানে সম্পন্ন কাজ বোঝাতে -েছি / -েছ / -েছে হয়।' },
      { p:'We have lived here for ten years.', o:['আমরা দশ বছর ধরে এখানে বাস করছি।', 'আমরা দশ বছর ধরে এখানে বাস করি।', 'আমরা দশ বছর আগে এখানে বাস করেছিলাম।', 'আমরা দশ বছর ধরে এখানে বাস করব।'], a:'আমরা দশ বছর ধরে এখানে বাস করছি।', e:'Result or experience up to now → -েছি / -েছে.', b:'বর্তমানে সম্পন্ন কাজ বোঝাতে -েছি / -েছ / -েছে হয়।' },
      { p:'He has been ill since Monday.', o:['সে সোমবার থেকে অসুস্থ।', 'সে সোমবার পর্যন্ত অসুস্থ ছিল।', 'সে সোমবার থেকে অসুস্থ হবে।', 'সে সোমবার থেকে সুস্থ।'], a:'সে সোমবার থেকে অসুস্থ।', e:'Result or experience up to now → -েছি / -েছে.', b:'বর্তমানে সম্পন্ন কাজ বোঝাতে -েছি / -েছ / -েছে হয়।' },
      { p:'Have you ever visited Dhaka?', o:['তুমি কি কখনো ঢাকায় গিয়েছ?', 'তুমি কি কখনো ঢাকায় যাও?', 'তুমি কি কখনো ঢাকায় যাবে?', 'তুমি কি কখনো ঢাকায় যাচ্ছ?'], a:'তুমি কি কখনো ঢাকায় গিয়েছ?', e:'Result or experience up to now → -েছি / -েছে.', b:'বর্তমানে সম্পন্ন কাজ বোঝাতে -েছি / -েছ / -েছে হয়।' },
      { p:'I have never told a lie.', o:['আমি কখনো মিথ্যা বলিনি।', 'আমি কখনো মিথ্যা বলি না।', 'আমি কখনো মিথ্যা বলব না।', 'আমি কখনো মিথ্যা বলছি না।'], a:'আমি কখনো মিথ্যা বলিনি।', e:'Result or experience up to now → -েছি / -েছে.', b:'বর্তমানে সম্পন্ন কাজ বোঝাতে -েছি / -েছ / -েছে হয়।' },
      { p:'The bus has already left.', o:['বাসটি ইতোমধ্যে ছেড়ে গেছে।', 'বাসটি ইতোমধ্যে ছেড়ে যায়।', 'বাসটি ইতোমধ্যে ছেড়ে যাবে।', 'বাসটি ইতোমধ্যে ছেড়ে যাচ্ছে।'], a:'বাসটি ইতোমধ্যে ছেড়ে গেছে।', e:'Result or experience up to now → -েছি / -েছে.', b:'বর্তমানে সম্পন্ন কাজ বোঝাতে -েছি / -েছ / -েছে হয়।' },
      { p:'They have just arrived.', o:['তারা এইমাত্র পৌঁছেছে।', 'তারা এইমাত্র পৌঁছায়।', 'তারা এইমাত্র পৌঁছাবে।', 'তারা এইমাত্র পৌঁছাচ্ছে।'], a:'তারা এইমাত্র পৌঁছেছে।', e:'Result or experience up to now → -েছি / -েছে.', b:'বর্তমানে সম্পন্ন কাজ বোঝাতে -েছি / -েছ / -েছে হয়।' },
      { p:'She has not eaten anything today.', o:['সে আজ কিছু খায়নি।', 'সে আজ কিছু খায় না।', 'সে আজ কিছু খাবে না।', 'সে আজ কিছু খাচ্ছে না।'], a:'সে আজ কিছু খায়নি।', e:'Result or experience up to now → -েছি / -েছে.', b:'বর্তমানে সম্পন্ন কাজ বোঝাতে -েছি / -েছ / -েছে হয়।' },
      { p:'I have known him for five years.', o:['আমি তাকে পাঁচ বছর ধরে চিনি।', 'আমি তাকে পাঁচ বছর আগে চিনতাম।', 'আমি তাকে পাঁচ বছর ধরে চিনব।', 'আমি তাকে পাঁচ বছর ধরে চিনছি।'], a:'আমি তাকে পাঁচ বছর ধরে চিনি।', e:'Result or experience up to now → -েছি / -েছে.', b:'বর্তমানে সম্পন্ন কাজ বোঝাতে -েছি / -েছ / -েছে হয়।' },
      { p:'You must obey your parents.', o:['তোমাকে অবশ্যই তোমার বাবা-মায়ের কথা মানতে হবে।', 'তুমি তোমার বাবা-মায়ের কথা মানতে পারো।', 'তোমার বাবা-মায়ের কথা মানার দরকার নেই।', 'তুমি তোমার বাবা-মায়ের কথা মানছ।'], a:'তোমাকে অবশ্যই তোমার বাবা-মায়ের কথা মানতে হবে।', e:'Modal verbs have set Bangla patterns (পারি, উচিত, হয়তো, হবে).', b:'Modal verb এর বাংলা রূপ নির্দিষ্ট: পারি, উচিত, হয়তো, অবশ্যই ... হবে।' },
      { p:'I can swim.', o:['আমি সাঁতার কাটতে পারি।', 'আমি সাঁতার কাটতে চাই।', 'আমি সাঁতার কাটব।', 'আমি সাঁতার কাটছি।'], a:'আমি সাঁতার কাটতে পারি।', e:'Modal verbs have set Bangla patterns (পারি, উচিত, হয়তো, হবে).', b:'Modal verb এর বাংলা রূপ নির্দিষ্ট: পারি, উচিত, হয়তো, অবশ্যই ... হবে।' },
      { p:'She could not solve the problem.', o:['সে সমস্যাটি সমাধান করতে পারেনি।', 'সে সমস্যাটি সমাধান করতে পারবে।', 'সে সমস্যাটি সমাধান করেছিল।', 'সে সমস্যাটি সমাধান করতে চায়নি।'], a:'সে সমস্যাটি সমাধান করতে পারেনি।', e:'Modal verbs have set Bangla patterns (পারি, উচিত, হয়তো, হবে).', b:'Modal verb এর বাংলা রূপ নির্দিষ্ট: পারি, উচিত, হয়তো, অবশ্যই ... হবে।' },
      { p:'May I come in?', o:['আমি কি ভেতরে আসতে পারি?', 'আমি কি ভেতরে এসেছি?', 'আমি ভেতরে আসছি।', 'আমি কি ভেতরে যেতে চাই?'], a:'আমি কি ভেতরে আসতে পারি?', e:'Modal verbs have set Bangla patterns (পারি, উচিত, হয়তো, হবে).', b:'Modal verb এর বাংলা রূপ নির্দিষ্ট: পারি, উচিত, হয়তো, অবশ্যই ... হবে।' },
      { p:'You should respect your elders.', o:['তোমার বড়দের সম্মান করা উচিত।', 'তুমি বড়দের সম্মান করেছ।', 'তোমার বড়দের সম্মান করা উচিত নয়।', 'তুমি বড়দের সম্মান করবে না।'], a:'তোমার বড়দের সম্মান করা উচিত।', e:'Modal verbs have set Bangla patterns (পারি, উচিত, হয়তো, হবে).', b:'Modal verb এর বাংলা রূপ নির্দিষ্ট: পারি, উচিত, হয়তো, অবশ্যই ... হবে।' },
      { p:'We ought to help the poor.', o:['আমাদের গরিবদের সাহায্য করা উচিত।', 'আমাদের গরিবদের সাহায্য করা উচিত নয়।', 'আমরা গরিবদের সাহায্য করেছি।', 'আমরা গরিবদের সাহায্য করি না।'], a:'আমাদের গরিবদের সাহায্য করা উচিত।', e:'Modal verbs have set Bangla patterns (পারি, উচিত, হয়তো, হবে).', b:'Modal verb এর বাংলা রূপ নির্দিষ্ট: পারি, উচিত, হয়তো, অবশ্যই ... হবে।' },
      { p:'He may come tomorrow.', o:['সে হয়তো আগামীকাল আসবে।', 'সে অবশ্যই আগামীকাল আসবে।', 'সে গতকাল এসেছিল।', 'সে আগামীকাল আসে না।'], a:'সে হয়তো আগামীকাল আসবে।', e:'Modal verbs have set Bangla patterns (পারি, উচিত, হয়তো, হবে).', b:'Modal verb এর বাংলা রূপ নির্দিষ্ট: পারি, উচিত, হয়তো, অবশ্যই ... হবে।' },
      { p:'You need not go there.', o:['তোমার সেখানে যাওয়ার দরকার নেই।', 'তোমাকে সেখানে যেতেই হবে।', 'তুমি সেখানে যাচ্ছ।', 'তুমি সেখানে গিয়েছিলে।'], a:'তোমার সেখানে যাওয়ার দরকার নেই।', e:'Modal verbs have set Bangla patterns (পারি, উচিত, হয়তো, হবে).', b:'Modal verb এর বাংলা রূপ নির্দিষ্ট: পারি, উচিত, হয়তো, অবশ্যই ... হবে।' },
      { p:'Can you speak English?', o:['তুমি কি ইংরেজি বলতে পারো?', 'তুমি কি ইংরেজি বলছ?', 'তুমি কি ইংরেজি বলেছিলে?', 'তুমি কি ইংরেজি বলবে?'], a:'তুমি কি ইংরেজি বলতে পারো?', e:'Modal verbs have set Bangla patterns (পারি, উচিত, হয়তো, হবে).', b:'Modal verb এর বাংলা রূপ নির্দিষ্ট: পারি, উচিত, হয়তো, অবশ্যই ... হবে।' },
      { p:'He used to play cricket.', o:['সে আগে ক্রিকেট খেলত।', 'সে এখন ক্রিকেট খেলে।', 'সে আগামীকাল ক্রিকেট খেলবে।', 'সে ক্রিকেট খেলছে।'], a:'সে আগে ক্রিকেট খেলত।', e:'Modal verbs have set Bangla patterns (পারি, উচিত, হয়তো, হবে).', b:'Modal verb এর বাংলা রূপ নির্দিষ্ট: পারি, উচিত, হয়তো, অবশ্যই ... হবে।' },
      { p:'I would like a cup of tea.', o:['আমি এক কাপ চা খেতে চাই।', 'আমি এক কাপ চা খেয়েছি।', 'আমি এক কাপ চা খাচ্ছি।', 'আমি এক কাপ চা খাই না।'], a:'আমি এক কাপ চা খেতে চাই।', e:'Modal verbs have set Bangla patterns (পারি, উচিত, হয়তো, হবে).', b:'Modal verb এর বাংলা রূপ নির্দিষ্ট: পারি, উচিত, হয়তো, অবশ্যই ... হবে।' },
      { p:'Please open the door.', o:['দয়া করে দরজাটি খুলুন।', 'দয়া করে দরজাটি বন্ধ করুন।', 'দরজাটি খুলে গেছে।', 'দয়া করে জানালাটি খুলুন।'], a:'দয়া করে দরজাটি খুলুন।', e:'Modal verbs have set Bangla patterns (পারি, উচিত, হয়তো, হবে).', b:'Modal verb এর বাংলা রূপ নির্দিষ্ট: পারি, উচিত, হয়তো, অবশ্যই ... হবে।' },
      { p:'If it rains, we will stay at home.', o:['বৃষ্টি হলে আমরা বাড়িতে থাকব।', 'বৃষ্টি হলে আমরা বাইরে যাব।', 'বৃষ্টি হয়েছিল বলে আমরা বাড়িতে ছিলাম।', 'বৃষ্টি না হলে আমরা বাড়িতে থাকব।'], a:'বৃষ্টি হলে আমরা বাড়িতে থাকব।', e:'A condition clause ends in -লে.', b:'শর্ত বোঝাতে ক্রিয়ার সাথে -লে যোগ হয়।' },
      { p:'If you study well, you will pass.', o:['তুমি মন দিয়ে পড়লে পাস করবে।', 'তুমি মন দিয়ে না পড়লে পাস করবে।', 'তুমি মন দিয়ে পড়লে ফেল করবে।', 'তুমি মন দিয়ে পড়েছিলে বলে পাস করেছিলে।'], a:'তুমি মন দিয়ে পড়লে পাস করবে।', e:'A condition clause ends in -লে.', b:'শর্ত বোঝাতে ক্রিয়ার সাথে -লে যোগ হয়।' },
      { p:'I would help you if I could.', o:['পারলে আমি তোমাকে সাহায্য করতাম।', 'পারলে আমি তোমাকে সাহায্য করব।', 'পারলে আমি তোমাকে সাহায্য করেছি।', 'না পারলে আমি তোমাকে সাহায্য করতাম।'], a:'পারলে আমি তোমাকে সাহায্য করতাম।', e:'A condition clause ends in -লে.', b:'শর্ত বোঝাতে ক্রিয়ার সাথে -লে যোগ হয়।' },
      { p:'If I were rich, I would help the poor.', o:['আমি ধনী হলে গরিবদের সাহায্য করতাম।', 'আমি ধনী হলে গরিবদের সাহায্য করব।', 'আমি ধনী হয়েছি বলে গরিবদের সাহায্য করি।', 'আমি গরিব হলে ধনীদের সাহায্য করতাম।'], a:'আমি ধনী হলে গরিবদের সাহায্য করতাম।', e:'A condition clause ends in -লে.', b:'শর্ত বোঝাতে ক্রিয়ার সাথে -লে যোগ হয়।' },
      { p:'Although he is poor, he is honest.', o:['সে গরিব হলেও সৎ।', 'সে গরিব বলে সৎ।', 'সে ধনী হলেও সৎ।', 'সে গরিব এবং অসৎ।'], a:'সে গরিব হলেও সৎ।', e:'A condition clause ends in -লে.', b:'শর্ত বোঝাতে ক্রিয়ার সাথে -লে যোগ হয়।' },
      { p:'He is so weak that he cannot walk.', o:['সে এত দুর্বল যে হাঁটতে পারে না।', 'সে এত দুর্বল যে হাঁটতে পারে।', 'সে এত শক্তিশালী যে হাঁটতে পারে না।', 'সে দুর্বল বলে হাঁটতে চায় না।'], a:'সে এত দুর্বল যে হাঁটতে পারে না।', e:'A condition clause ends in -লে.', b:'শর্ত বোঝাতে ক্রিয়ার সাথে -লে যোগ হয়।' },
      { p:'I know that he is honest.', o:['আমি জানি যে সে সৎ।', 'আমি জানি না যে সে সৎ।', 'আমি জানতাম যে সে সৎ নয়।', 'আমি জানব যে সে সৎ।'], a:'আমি জানি যে সে সৎ।', e:'A condition clause ends in -লে.', b:'শর্ত বোঝাতে ক্রিয়ার সাথে -লে যোগ হয়।' },
      { p:'She said that she was happy.', o:['সে বলল যে সে খুশি।', 'সে বলল যে সে খুশি নয়।', 'সে বলবে যে সে খুশি।', 'সে বলল যে সে দুঃখিত।'], a:'সে বলল যে সে খুশি।', e:'A condition clause ends in -লে.', b:'শর্ত বোঝাতে ক্রিয়ার সাথে -লে যোগ হয়।' },
      { p:'He asked me where I lived.', o:['সে আমাকে জিজ্ঞাসা করল আমি কোথায় থাকি।', 'সে আমাকে জিজ্ঞাসা করল আমি কোথায় যাব।', 'সে আমাকে জিজ্ঞাসা করবে আমি কোথায় থাকি।', 'আমি তাকে জিজ্ঞাসা করলাম সে কোথায় থাকে।'], a:'সে আমাকে জিজ্ঞাসা করল আমি কোথায় থাকি।', e:'A condition clause ends in -লে.', b:'শর্ত বোঝাতে ক্রিয়ার সাথে -লে যোগ হয়।' },
      { p:'Because he was ill, he did not come.', o:['অসুস্থ ছিল বলে সে আসেনি।', 'অসুস্থ ছিল বলে সে এসেছে।', 'অসুস্থ হলে সে আসবে না।', 'সে অসুস্থ ছিল, তাই সে এসেছিল।'], a:'অসুস্থ ছিল বলে সে আসেনি।', e:'A condition clause ends in -লে.', b:'শর্ত বোঝাতে ক্রিয়ার সাথে -লে যোগ হয়।' },
      { p:'Dhaka is bigger than Chattogram.', o:['ঢাকা চট্টগ্রামের চেয়ে বড়।', 'চট্টগ্রাম ঢাকার চেয়ে বড়।', 'ঢাকা চট্টগ্রামের মতো বড়।', 'ঢাকা চট্টগ্রামের চেয়ে ছোট।'], a:'ঢাকা চট্টগ্রামের চেয়ে বড়।', e:'Comparison uses "-র চেয়ে"; superlative uses "সবচেয়ে".', b:'তুলনায় "-র চেয়ে", সর্বোচ্চ মাত্রায় "সবচেয়ে" বসে।' },
      { p:'He is the tallest boy in the class.', o:['সে ক্লাসের সবচেয়ে লম্বা ছেলে।', 'সে ক্লাসের সবচেয়ে ছোট ছেলে।', 'সে ক্লাসের একটি লম্বা ছেলে।', 'সে ক্লাসের সবচেয়ে লম্বা মেয়ে।'], a:'সে ক্লাসের সবচেয়ে লম্বা ছেলে।', e:'Comparison uses "-র চেয়ে"; superlative uses "সবচেয়ে".', b:'তুলনায় "-র চেয়ে", সর্বোচ্চ মাত্রায় "সবচেয়ে" বসে।' },
      { p:'Gold is more valuable than silver.', o:['সোনা রুপার চেয়ে বেশি মূল্যবান।', 'রুপা সোনার চেয়ে বেশি মূল্যবান।', 'সোনা রুপার মতো মূল্যবান।', 'সোনা রুপার চেয়ে কম মূল্যবান।'], a:'সোনা রুপার চেয়ে বেশি মূল্যবান।', e:'Comparison uses "-র চেয়ে"; superlative uses "সবচেয়ে".', b:'তুলনায় "-র চেয়ে", সর্বোচ্চ মাত্রায় "সবচেয়ে" বসে।' },
      { p:'She is as clever as her sister.', o:['সে তার বোনের মতোই বুদ্ধিমতী।', 'সে তার বোনের চেয়ে বেশি বুদ্ধিমতী।', 'সে তার বোনের চেয়ে কম বুদ্ধিমতী।', 'সে তার ভাইয়ের চেয়ে বেশি বুদ্ধিমান।'], a:'সে তার বোনের মতোই বুদ্ধিমতী।', e:'Comparison uses "-র চেয়ে"; superlative uses "সবচেয়ে".', b:'তুলনায় "-র চেয়ে", সর্বোচ্চ মাত্রায় "সবচেয়ে" বসে।' },
      { p:'Honesty is the best policy.', o:['সততাই সর্বোৎকৃষ্ট পন্থা।', 'সততা একটি খারাপ নীতি।', 'মিথ্যাই সর্বোৎকৃষ্ট পন্থা।', 'সততা কখনো কাজে আসে না।'], a:'সততাই সর্বোৎকৃষ্ট পন্থা।', e:'Comparison uses "-র চেয়ে"; superlative uses "সবচেয়ে".', b:'তুলনায় "-র চেয়ে", সর্বোচ্চ মাত্রায় "সবচেয়ে" বসে।' },
      { p:'This is the most beautiful place I have ever seen.', o:['এটি আমার দেখা সবচেয়ে সুন্দর জায়গা।', 'এটি আমার দেখা সবচেয়ে কুৎসিত জায়গা।', 'এটি আমার দেখা একটি সুন্দর জায়গা।', 'ওটি আমি দেখব এমন সবচেয়ে সুন্দর জায়গা।'], a:'এটি আমার দেখা সবচেয়ে সুন্দর জায়গা।', e:'Comparison uses "-র চেয়ে"; superlative uses "সবচেয়ে".', b:'তুলনায় "-র চেয়ে", সর্বোচ্চ মাত্রায় "সবচেয়ে" বসে।' },
      { p:'The Padma is longer than the Karnaphuli.', o:['পদ্মা কর্ণফুলীর চেয়ে দীর্ঘ।', 'কর্ণফুলী পদ্মার চেয়ে দীর্ঘ।', 'পদ্মা কর্ণফুলীর চেয়ে ছোট।', 'পদ্মা কর্ণফুলীর মতো দীর্ঘ।'], a:'পদ্মা কর্ণফুলীর চেয়ে দীর্ঘ।', e:'Comparison uses "-র চেয়ে"; superlative uses "সবচেয়ে".', b:'তুলনায় "-র চেয়ে", সর্বোচ্চ মাত্রায় "সবচেয়ে" বসে।' },
      { p:'The letter was written by him.', o:['চিঠিটি তার দ্বারা লেখা হয়েছিল।', 'চিঠিটি তার দ্বারা লেখা হবে।', 'চিঠিটি তার দ্বারা লেখা হচ্ছে।', 'চিঠিটি তাকে লেখা হয়েছিল।'], a:'চিঠিটি তার দ্বারা লেখা হয়েছিল।', e:'Passive voice → "-া হয় / -া হয়েছিল / -া হবে".', b:'Passive voice এ "করা হয় / করা হয়েছিল / করা হবে" ব্যবহার হয়।' },
      { p:'The door was opened by the boy.', o:['দরজাটি ছেলেটির দ্বারা খোলা হয়েছিল।', 'দরজাটি ছেলেটির দ্বারা খোলা হবে।', 'দরজাটি ছেলেটির দ্বারা খোলা হয়।', 'দরজাটি ছেলেটিকে খোলা হয়েছিল।'], a:'দরজাটি ছেলেটির দ্বারা খোলা হয়েছিল।', e:'Passive voice → "-া হয় / -া হয়েছিল / -া হবে".', b:'Passive voice এ "করা হয় / করা হয়েছিল / করা হবে" ব্যবহার হয়।' },
      { p:'English is spoken all over the world.', o:['ইংরেজি সারা বিশ্বে বলা হয়।', 'ইংরেজি সারা বিশ্বে বলা হয়েছিল।', 'ইংরেজি সারা বিশ্বে বলা হবে।', 'ইংরেজি শুধু বাংলাদেশে বলা হয়।'], a:'ইংরেজি সারা বিশ্বে বলা হয়।', e:'Passive voice → "-া হয় / -া হয়েছিল / -া হবে".', b:'Passive voice এ "করা হয় / করা হয়েছিল / করা হবে" ব্যবহার হয়।' },
      { p:'The work will be finished tomorrow.', o:['কাজটি আগামীকাল শেষ করা হবে।', 'কাজটি গতকাল শেষ করা হয়েছিল।', 'কাজটি আগামীকাল শেষ করা হয়।', 'কাজটি আগামীকাল শেষ করা হচ্ছে।'], a:'কাজটি আগামীকাল শেষ করা হবে।', e:'Passive voice → "-া হয় / -া হয়েছিল / -া হবে".', b:'Passive voice এ "করা হয় / করা হয়েছিল / করা হবে" ব্যবহার হয়।' },
      { p:'A new bridge is being built.', o:['একটি নতুন সেতু নির্মাণ করা হচ্ছে।', 'একটি নতুন সেতু নির্মাণ করা হবে।', 'একটি নতুন সেতু নির্মাণ করা হয়েছিল।', 'একটি নতুন সেতু নির্মাণ করা হয়।'], a:'একটি নতুন সেতু নির্মাণ করা হচ্ছে।', e:'Passive voice → "-া হয় / -া হয়েছিল / -া হবে".', b:'Passive voice এ "করা হয় / করা হয়েছিল / করা হবে" ব্যবহার হয়।' },
      { p:'Rice is grown in Bangladesh.', o:['বাংলাদেশে ধান চাষ করা হয়।', 'বাংলাদেশে ধান চাষ করা হয়েছিল।', 'বাংলাদেশে ধান চাষ করা হচ্ছে।', 'বাংলাদেশে গম চাষ করা হয়।'], a:'বাংলাদেশে ধান চাষ করা হয়।', e:'Passive voice → "-া হয় / -া হয়েছিল / -া হবে".', b:'Passive voice এ "করা হয় / করা হয়েছিল / করা হবে" ব্যবহার হয়।' },
      { p:'The thief was caught by the police.', o:['চোরটি পুলিশের হাতে ধরা পড়ল।', 'চোরটি পুলিশকে ধরল।', 'চোরটি পুলিশের হাতে ধরা পড়বে।', 'চোরটি পুলিশের হাতে ধরা পড়ে।'], a:'চোরটি পুলিশের হাতে ধরা পড়ল।', e:'Passive voice → "-া হয় / -া হয়েছিল / -া হবে".', b:'Passive voice এ "করা হয় / করা হয়েছিল / করা হবে" ব্যবহার হয়।' },
      { p:'The match has been cancelled.', o:['খেলাটি বাতিল করা হয়েছে।', 'খেলাটি বাতিল করা হবে।', 'খেলাটি বাতিল করা হয়।', 'খেলাটি শুরু করা হয়েছে।'], a:'খেলাটি বাতিল করা হয়েছে।', e:'Passive voice → "-া হয় / -া হয়েছিল / -া হবে".', b:'Passive voice এ "করা হয় / করা হয়েছিল / করা হবে" ব্যবহার হয়।' },
      { p:'What is your name?', o:['তোমার নাম কী?', 'তোমার বাড়ি কোথায়?', 'তোমার বয়স কত?', 'তোমার নাম কে?'], a:'তোমার নাম কী?', e:'Fixed expression — learn it as a whole phrase.', b:'প্রচলিত বাক্যাংশ — পুরোটা একসাথে মনে রাখো।' },
      { p:'How are you?', o:['তুমি কেমন আছ?', 'তুমি কোথায় আছ?', 'তুমি কী করছ?', 'তুমি কেন আছ?'], a:'তুমি কেমন আছ?', e:'Fixed expression — learn it as a whole phrase.', b:'প্রচলিত বাক্যাংশ — পুরোটা একসাথে মনে রাখো।' },
      { p:'I live in Chattogram.', o:['আমি চট্টগ্রামে থাকি।', 'আমি ঢাকায় থাকি।', 'আমি চট্টগ্রামে থাকব।', 'আমি চট্টগ্রামে ছিলাম।'], a:'আমি চট্টগ্রামে থাকি।', e:'Fixed expression — learn it as a whole phrase.', b:'প্রচলিত বাক্যাংশ — পুরোটা একসাথে মনে রাখো।' },
      { p:'How old are you?', o:['তোমার বয়স কত?', 'তোমার নাম কী?', 'তোমার ওজন কত?', 'তোমার উচ্চতা কত?'], a:'তোমার বয়স কত?', e:'Fixed expression — learn it as a whole phrase.', b:'প্রচলিত বাক্যাংশ — পুরোটা একসাথে মনে রাখো।' },
      { p:'What time is it?', o:['এখন কয়টা বাজে?', 'আজ কত তারিখ?', 'এখন কোথায় বাজে?', 'কয়টা বাজবে?'], a:'এখন কয়টা বাজে?', e:'Fixed expression — learn it as a whole phrase.', b:'প্রচলিত বাক্যাংশ — পুরোটা একসাথে মনে রাখো।' },
      { p:'Thank you very much.', o:['আপনাকে অনেক ধন্যবাদ।', 'আপনাকে অনেক স্বাগতম।', 'আপনাকে অনেক দুঃখিত।', 'আমাকে অনেক ধন্যবাদ।'], a:'আপনাকে অনেক ধন্যবাদ।', e:'Fixed expression — learn it as a whole phrase.', b:'প্রচলিত বাক্যাংশ — পুরোটা একসাথে মনে রাখো।' },
      { p:'I am sorry for being late.', o:['দেরি করার জন্য আমি দুঃখিত।', 'দেরি করার জন্য আমি খুশি।', 'দেরি হওয়ার জন্য ধন্যবাদ।', 'দেরি করার জন্য আমি ধন্যবাদ জানাই।'], a:'দেরি করার জন্য আমি দুঃখিত।', e:'Fixed expression — learn it as a whole phrase.', b:'প্রচলিত বাক্যাংশ — পুরোটা একসাথে মনে রাখো।' },
      { p:'Excuse me, where is the post office?', o:['মাফ করবেন, ডাকঘর কোথায়?', 'মাফ করবেন, ব্যাংক কোথায়?', 'মাফ করবেন, ডাকঘর কখন?', 'ধন্যবাদ, ডাকঘর কোথায়?'], a:'মাফ করবেন, ডাকঘর কোথায়?', e:'Fixed expression — learn it as a whole phrase.', b:'প্রচলিত বাক্যাংশ — পুরোটা একসাথে মনে রাখো।' },
      { p:'Can you help me, please?', o:['দয়া করে আমাকে একটু সাহায্য করবেন?', 'দয়া করে আমাকে একটু অপেক্ষা করবেন?', 'আমি কি আপনাকে সাহায্য করব?', 'আমাকে সাহায্য করো না।'], a:'দয়া করে আমাকে একটু সাহায্য করবেন?', e:'Fixed expression — learn it as a whole phrase.', b:'প্রচলিত বাক্যাংশ — পুরোটা একসাথে মনে রাখো।' },
      { p:'I do not understand.', o:['আমি বুঝতে পারছি না।', 'আমি বুঝতে পেরেছি।', 'আমি বুঝব না।', 'আমি জানতে চাই।'], a:'আমি বুঝতে পারছি না।', e:'Fixed expression — learn it as a whole phrase.', b:'প্রচলিত বাক্যাংশ — পুরোটা একসাথে মনে রাখো।' },
      { p:'Please speak slowly.', o:['দয়া করে আস্তে কথা বলুন।', 'দয়া করে জোরে কথা বলুন।', 'দয়া করে কথা বলা বন্ধ করুন।', 'দয়া করে আস্তে চলুন।'], a:'দয়া করে আস্তে কথা বলুন।', e:'Fixed expression — learn it as a whole phrase.', b:'প্রচলিত বাক্যাংশ — পুরোটা একসাথে মনে রাখো।' },
      { p:'Good morning!', o:['সুপ্রভাত!', 'শুভ রাত্রি!', 'শুভ সন্ধ্যা!', 'বিদায়!'], a:'সুপ্রভাত!', e:'Fixed expression — learn it as a whole phrase.', b:'প্রচলিত বাক্যাংশ — পুরোটা একসাথে মনে রাখো।' },
      { p:'Happy birthday to you!', o:['তোমাকে জন্মদিনের শুভেচ্ছা!', 'তোমাকে নববর্ষের শুভেচ্ছা!', 'তোমাকে ঈদের শুভেচ্ছা!', 'তোমাকে বিদায়ের শুভেচ্ছা!'], a:'তোমাকে জন্মদিনের শুভেচ্ছা!', e:'Fixed expression — learn it as a whole phrase.', b:'প্রচলিত বাক্যাংশ — পুরোটা একসাথে মনে রাখো।' },
      { p:'I am hungry.', o:['আমার খিদে পেয়েছে।', 'আমার ঘুম পেয়েছে।', 'আমার পিপাসা পেয়েছে।', 'আমার খিদে পাবে।'], a:'আমার খিদে পেয়েছে।', e:'Fixed expression — learn it as a whole phrase.', b:'প্রচলিত বাক্যাংশ — পুরোটা একসাথে মনে রাখো।' },
      { p:'I am very tired.', o:['আমি খুব ক্লান্ত।', 'আমি খুব খুশি।', 'আমি খুব ব্যস্ত।', 'আমি খুব ক্ষুধার্ত।'], a:'আমি খুব ক্লান্ত।', e:'Fixed expression — learn it as a whole phrase.', b:'প্রচলিত বাক্যাংশ — পুরোটা একসাথে মনে রাখো।' },
      { p:'It is very hot today.', o:['আজ খুব গরম পড়েছে।', 'আজ খুব ঠান্ডা পড়েছে।', 'আগামীকাল খুব গরম পড়বে।', 'আজ খুব বৃষ্টি হচ্ছে।'], a:'আজ খুব গরম পড়েছে।', e:'Fixed expression — learn it as a whole phrase.', b:'প্রচলিত বাক্যাংশ — পুরোটা একসাথে মনে রাখো।' },
      { p:'Please come here.', o:['দয়া করে এখানে আসুন।', 'দয়া করে ওখানে যান।', 'দয়া করে এখানে বসুন।', 'আমি এখানে আসব।'], a:'দয়া করে এখানে আসুন।', e:'Fixed expression — learn it as a whole phrase.', b:'প্রচলিত বাক্যাংশ — পুরোটা একসাথে মনে রাখো।' },
      { p:'Please give me a glass of water.', o:['দয়া করে আমাকে এক গ্লাস পানি দিন।', 'দয়া করে আমাকে এক কাপ চা দিন।', 'দয়া করে আমাকে এক গ্লাস পানি নিন।', 'আমি তোমাকে এক গ্লাস পানি দিলাম।'], a:'দয়া করে আমাকে এক গ্লাস পানি দিন।', e:'Fixed expression — learn it as a whole phrase.', b:'প্রচলিত বাক্যাংশ — পুরোটা একসাথে মনে রাখো।' },
      { p:'Time and tide wait for none.', o:['সময় ও স্রোত কারো জন্য অপেক্ষা করে না।', 'সময় ও স্রোত সবার জন্য অপেক্ষা করে।', 'সময় সবকিছু ভুলিয়ে দেয়।', 'সময় ও স্রোত কারো জন্য অপেক্ষা করেছিল।'], a:'সময় ও স্রোত কারো জন্য অপেক্ষা করে না।', e:'Proverbs are translated by meaning, not word by word.', b:'প্রবাদ শব্দে শব্দে নয়, ভাবানুবাদ করতে হয়।' },
      { p:'Practice makes a man perfect.', o:['অনুশীলন মানুষকে নিখুঁত করে তোলে।', 'অনুশীলন মানুষকে অলস করে তোলে।', 'অনুশীলন মানুষকে নিখুঁত করেছিল।', 'অনুশীলন ছাড়াই মানুষ নিখুঁত হয়।'], a:'অনুশীলন মানুষকে নিখুঁত করে তোলে।', e:'Proverbs are translated by meaning, not word by word.', b:'প্রবাদ শব্দে শব্দে নয়, ভাবানুবাদ করতে হয়।' },
      { p:'Health is wealth.', o:['স্বাস্থ্যই সম্পদ।', 'সম্পদই স্বাস্থ্য।', 'স্বাস্থ্য একটি রোগ।', 'স্বাস্থ্য সম্পদের চেয়ে কম মূল্যবান।'], a:'স্বাস্থ্যই সম্পদ।', e:'Proverbs are translated by meaning, not word by word.', b:'প্রবাদ শব্দে শব্দে নয়, ভাবানুবাদ করতে হয়।' },
      { p:'Early to bed and early to rise makes a man healthy.', o:['তাড়াতাড়ি ঘুমানো ও তাড়াতাড়ি ওঠা মানুষকে সুস্থ রাখে।', 'দেরিতে ঘুমানো ও দেরিতে ওঠা মানুষকে সুস্থ রাখে।', 'তাড়াতাড়ি ঘুমানো ও তাড়াতাড়ি ওঠা মানুষকে অসুস্থ করে।', 'তাড়াতাড়ি ঘুমালে মানুষ সুস্থ ছিল।'], a:'তাড়াতাড়ি ঘুমানো ও তাড়াতাড়ি ওঠা মানুষকে সুস্থ রাখে।', e:'Proverbs are translated by meaning, not word by word.', b:'প্রবাদ শব্দে শব্দে নয়, ভাবানুবাদ করতে হয়।' },
      { p:'Knowledge is power.', o:['জ্ঞানই শক্তি।', 'শক্তিই জ্ঞান।', 'জ্ঞান একটি বোঝা।', 'অজ্ঞতাই শক্তি।'], a:'জ্ঞানই শক্তি।', e:'Proverbs are translated by meaning, not word by word.', b:'প্রবাদ শব্দে শব্দে নয়, ভাবানুবাদ করতে হয়।' },
      { p:'A friend in need is a friend indeed.', o:['বিপদের বন্ধুই প্রকৃত বন্ধু।', 'সুখের বন্ধুই প্রকৃত বন্ধু।', 'বন্ধু মানেই বিপদ।', 'প্রকৃত বন্ধু কখনো সাহায্য করে না।'], a:'বিপদের বন্ধুই প্রকৃত বন্ধু।', e:'Proverbs are translated by meaning, not word by word.', b:'প্রবাদ শব্দে শব্দে নয়, ভাবানুবাদ করতে হয়।' },
      { p:'Many hands make light work.', o:['অনেক হাত মিললে কাজ সহজ হয়।', 'অনেক হাত থাকলে কাজ কঠিন হয়।', 'এক হাতেই সব কাজ সহজ হয়।', 'অনেক হাত মিললে কাজ সহজ হয়েছিল।'], a:'অনেক হাত মিললে কাজ সহজ হয়।', e:'Proverbs are translated by meaning, not word by word.', b:'প্রবাদ শব্দে শব্দে নয়, ভাবানুবাদ করতে হয়।' },
      { p:'Prevention is better than cure.', o:['প্রতিকারের চেয়ে প্রতিরোধ ভালো।', 'প্রতিরোধের চেয়ে প্রতিকার ভালো।', 'প্রতিকার ও প্রতিরোধ একই।', 'প্রতিকারের চেয়ে প্রতিরোধ কঠিন।'], a:'প্রতিকারের চেয়ে প্রতিরোধ ভালো।', e:'Proverbs are translated by meaning, not word by word.', b:'প্রবাদ শব্দে শব্দে নয়, ভাবানুবাদ করতে হয়।' },
      { p:'Bangladesh is a beautiful country.', o:['বাংলাদেশ একটি সুন্দর দেশ।', 'বাংলাদেশ একটি ছোট দেশ।', 'বাংলাদেশ একটি সুন্দর শহর।', 'ভারত একটি সুন্দর দেশ।'], a:'বাংলাদেশ একটি সুন্দর দেশ।', e:'Match the nouns, place words and tense carefully.', b:'noun, স্থানবাচক শব্দ ও tense মিলিয়ে অনুবাদ করো।' },
      { p:'Dhaka is the capital of Bangladesh.', o:['ঢাকা বাংলাদেশের রাজধানী।', 'চট্টগ্রাম বাংলাদেশের রাজধানী।', 'ঢাকা ভারতের রাজধানী।', 'ঢাকা বাংলাদেশের একটি গ্রাম।'], a:'ঢাকা বাংলাদেশের রাজধানী।', e:'Match the nouns, place words and tense carefully.', b:'noun, স্থানবাচক শব্দ ও tense মিলিয়ে অনুবাদ করো।' },
      { p:'The Padma is a big river.', o:['পদ্মা একটি বড় নদী।', 'পদ্মা একটি ছোট নদী।', 'পদ্মা একটি বড় শহর।', 'পদ্মা একটি বড় পাহাড়।'], a:'পদ্মা একটি বড় নদী।', e:'Match the nouns, place words and tense carefully.', b:'noun, স্থানবাচক শব্দ ও tense মিলিয়ে অনুবাদ করো।' },
      { p:'My school is near my house.', o:['আমার স্কুল আমার বাড়ির কাছে।', 'আমার স্কুল আমার বাড়ি থেকে অনেক দূরে।', 'আমার বাড়ি আমার স্কুলের কাছে নয়।', 'আমার স্কুলের বাড়ি কাছে।'], a:'আমার স্কুল আমার বাড়ির কাছে।', e:'Match the nouns, place words and tense carefully.', b:'noun, স্থানবাচক শব্দ ও tense মিলিয়ে অনুবাদ করো।' },
      { p:'I study in class ten.', o:['আমি দশম শ্রেণিতে পড়ি।', 'আমি দশম শ্রেণিতে পড়ব।', 'আমি নবম শ্রেণিতে পড়ি।', 'আমি দশম শ্রেণিতে পড়েছিলাম।'], a:'আমি দশম শ্রেণিতে পড়ি।', e:'Match the nouns, place words and tense carefully.', b:'noun, স্থানবাচক শব্দ ও tense মিলিয়ে অনুবাদ করো।' },
      { p:'There are thirty students in my class.', o:['আমার ক্লাসে ত্রিশজন ছাত্রছাত্রী আছে।', 'আমার ক্লাসে তিনজন ছাত্রছাত্রী আছে।', 'আমার ক্লাসে ত্রিশজন ছাত্রছাত্রী ছিল।', 'আমার স্কুলে ত্রিশজন ছাত্রছাত্রী আছে।'], a:'আমার ক্লাসে ত্রিশজন ছাত্রছাত্রী আছে।', e:'Match the nouns, place words and tense carefully.', b:'noun, স্থানবাচক শব্দ ও tense মিলিয়ে অনুবাদ করো।' },
      { p:'The library opens at nine o\'clock.', o:['লাইব্রেরি নয়টায় খোলে।', 'লাইব্রেরি নয়টায় বন্ধ হয়।', 'লাইব্রেরি নয়টায় খুলবে।', 'লাইব্রেরি নয়টায় খুলেছিল।'], a:'লাইব্রেরি নয়টায় খোলে।', e:'Match the nouns, place words and tense carefully.', b:'noun, স্থানবাচক শব্দ ও tense মিলিয়ে অনুবাদ করো।' },
      { p:'He is a very honest man.', o:['সে অত্যন্ত সৎ একজন মানুষ।', 'সে অত্যন্ত অসৎ একজন মানুষ।', 'সে একজন সৎ মানুষ ছিল।', 'সে অত্যন্ত বুদ্ধিমান একজন মানুষ।'], a:'সে অত্যন্ত সৎ একজন মানুষ।', e:'Match the nouns, place words and tense carefully.', b:'noun, স্থানবাচক শব্দ ও tense মিলিয়ে অনুবাদ করো।' },
      { p:'The cat is sleeping under the table.', o:['বিড়ালটি টেবিলের নিচে ঘুমাচ্ছে।', 'বিড়ালটি টেবিলের উপর ঘুমাচ্ছে।', 'বিড়ালটি টেবিলের নিচে ঘুমায়।', 'কুকুরটি টেবিলের নিচে ঘুমাচ্ছে।'], a:'বিড়ালটি টেবিলের নিচে ঘুমাচ্ছে।', e:'Match the nouns, place words and tense carefully.', b:'noun, স্থানবাচক শব্দ ও tense মিলিয়ে অনুবাদ করো।' },
      { p:'There is a book on the table.', o:['টেবিলের উপর একটি বই আছে।', 'টেবিলের নিচে একটি বই আছে।', 'টেবিলের উপর একটি বই ছিল।', 'টেবিলের উপর একটি কলম আছে।'], a:'টেবিলের উপর একটি বই আছে।', e:'Match the nouns, place words and tense carefully.', b:'noun, স্থানবাচক শব্দ ও tense মিলিয়ে অনুবাদ করো।' },
      { p:'He lives in a village.', o:['সে একটি গ্রামে বাস করে।', 'সে একটি শহরে বাস করে।', 'সে একটি গ্রামে বাস করছে।', 'সে একটি গ্রামে বাস করত।'], a:'সে একটি গ্রামে বাস করে।', e:'Match the nouns, place words and tense carefully.', b:'noun, স্থানবাচক শব্দ ও tense মিলিয়ে অনুবাদ করো।' },
      { p:'We should plant more trees.', o:['আমাদের আরও গাছ লাগানো উচিত।', 'আমাদের আরও গাছ কাটা উচিত।', 'আমরা আরও গাছ লাগিয়েছিলাম।', 'আমাদের গাছ লাগানো উচিত নয়।'], a:'আমাদের আরও গাছ লাগানো উচিত।', e:'Match the nouns, place words and tense carefully.', b:'noun, স্থানবাচক শব্দ ও tense মিলিয়ে অনুবাদ করো।' },
      { p:'Exercise keeps us healthy.', o:['ব্যায়াম আমাদের সুস্থ রাখে।', 'ব্যায়াম আমাদের অসুস্থ করে।', 'ব্যায়াম আমাদের সুস্থ রেখেছিল।', 'ব্যায়াম আমাদের সুস্থ রাখবে না।'], a:'ব্যায়াম আমাদের সুস্থ রাখে।', e:'Match the nouns, place words and tense carefully.', b:'noun, স্থানবাচক শব্দ ও tense মিলিয়ে অনুবাদ করো।' },
    ],
  },

  idioms: {
    name: 'Idioms & Phrases', icon: 'trophy', class: 'all',
    lesson: {
      rules: [
        'Idioms have figurative meanings — not literal.',
        'Common ones: a piece of cake, break the ice, hit the books.',
        'Frequently tested in SSC/HSC comprehension.',
      ],
      examples: [
        'A piece of cake = <strong>very easy</strong>.',
        'Break the ice = <strong>start a conversation</strong>.',
        'Once in a blue moon = <strong>very rarely</strong>.',
      ],
      bangla: 'Idiom = বাগধারা। আক্ষরিক অর্থ নয়, রূপক অর্থে ব্যবহৃত হয়।',
    },
    questions: [
      { p:'"A piece of cake" means —', o:['something very easy','a tasty dessert','a small portion','an angry remark'], a:'something very easy', e:'= very easy.', b:'= খুব সহজ।' },
      { p:'"Break the ice" means —', o:['start a conversation','break something','cool down','end a meeting'], a:'start a conversation', e:'= begin conversation.', b:'= কথোপকথন শুরু।' },
      { p:'"Hit the books" means —', o:['study hard','hit books','read casually','throw books'], a:'study hard', e:'= study seriously.', b:'= মনোযোগে পড়া।' },
      { p:'"Once in a blue moon" means —', o:['very rarely','very often','every day','always'], a:'very rarely', e:'= very rarely.', b:'= খুব কম।' },
      { p:'"Under the weather" means —', o:['feeling sick','in the rain','below the sky','happy'], a:'feeling sick', e:'= unwell.', b:'= অসুস্থ।' },
      { p:'"Bite the bullet" means —', o:['face a difficult situation bravely','eat fast','shoot someone','run fast'], a:'face a difficult situation bravely', e:'= endure courageously.', b:'= সাহসে সহ্য।' },
      { p:'"Let the cat out of the bag" means —', o:['reveal a secret','free a cat','buy a cat','hide truth'], a:'reveal a secret', e:'= reveal secret.', b:'= গোপন ফাঁস।' },
      { p:'"Beat around the bush" means —', o:['avoid the main topic','hit bushes','run around','play games'], a:'avoid the main topic', e:'= avoid the point.', b:'= মূল বিষয় এড়ানো।' },
      { p:'"Cost an arm and a leg" means —', o:['very expensive','cheap','free','moderate'], a:'very expensive', e:'= very costly.', b:'= খুব দামি।' },
      { p:'"See eye to eye" means —', o:['agree','stare','look closely','fight'], a:'agree', e:'= agree fully.', b:'= একমত।' },
      { p:'"Pull someone’s leg" means —', o:['joke with someone','hurt someone','help someone','pull hard'], a:'joke with someone', e:'= tease.', b:'= মজা করা।' },
      { p:'"Spill the beans" means —', o:['reveal information','drop beans','cook beans','waste food'], a:'reveal information', e:'= reveal secret.', b:'= তথ্য ফাঁস।' },
      { p:'"Ball is in your court" means —', o:['your turn to decide','play tennis','ball is yours','take the ball'], a:'your turn to decide', e:'= your decision.', b:'= তোমার সিদ্ধান্ত।' },
      { p:'"Barking up the wrong tree" means —', o:['misunderstanding the situation','barking at a tree','running fast','barking loudly'], a:'misunderstanding the situation', e:'= wrong direction.', b:'= ভুল ধারণা।' },
      { p:'"Blessing in disguise" means —', o:['hidden benefit','hidden problem','a gift','a disguise'], a:'hidden benefit', e:'= hidden good.', b:'= আপাত ক্ষতি যা পরে উপকার।' },
      { p:'"Call it a day" means —', o:['stop working for the day','name the day','call a friend','start the day'], a:'stop working for the day', e:'= finish working.', b:'= কাজ বন্ধ।' },
      { p:'"Cut corners" means —', o:['do something poorly to save time','cut shapes','run fast','save money'], a:'do something poorly to save time', e:'= do badly.', b:'= সময় বাঁচাতে খারাপ করা।' },
      { p:'"Hit the nail on the head" means —', o:['say exactly the right thing','hit a nail','do carpentry','aim badly'], a:'say exactly the right thing', e:'= precise.', b:'= ঠিক কথা বলা।' },
      { p:'"In the same boat" means —', o:['in the same situation','on a boat','traveling together','fishing'], a:'in the same situation', e:'= same difficulty.', b:'= একই অবস্থায়।' },
      { p:'"Jump on the bandwagon" means —', o:['join a popular trend','jump high','ride a wagon','fall down'], a:'join a popular trend', e:'= follow trend.', b:'= জনপ্রিয় ধারায় যোগ।' },
      { p:'"Keep an eye on" means —', o:['watch carefully','close eyes','blink','ignore'], a:'watch carefully', e:'= monitor.', b:'= সতর্ক দৃষ্টি।' },
      { p:'"Let sleeping dogs lie" means —', o:['avoid restarting an old problem','wake a dog','feed a dog','sleep with a dog'], a:'avoid restarting an old problem', e:'= leave alone.', b:'= পুরনো বিষয় তুলা না।' },
      { p:'"Miss the boat" means —', o:['miss an opportunity','miss a ship','be late','fall in water'], a:'miss an opportunity', e:'= lose chance.', b:'= সুযোগ হাতছাড়া।' },
      { p:'"On cloud nine" means —', o:['extremely happy','on a cloud','in the sky','dreaming'], a:'extremely happy', e:'= very happy.', b:'= অত্যন্ত খুশি।' },
      { p:'"Pull yourself together" means —', o:['calm down and behave','pull a rope','gather items','get up'], a:'calm down and behave', e:'= regain composure.', b:'= শান্ত হওয়া।' },
      { p:'"See the light" means —', o:['suddenly understand','look at a light','use a lamp','find the sun'], a:'suddenly understand', e:'= understand suddenly.', b:'= হঠাৎ বোঝা।' },
      { p:'"Smell a rat" means —', o:['suspect something wrong','smell a rodent','find a mouse','detect a scent'], a:'suspect something wrong', e:'= sense deceit.', b:'= সন্দেহ করা।' },
      { p:'"Take with a grain of salt" means —', o:['accept with skepticism','eat salty food','put salt','share food'], a:'accept with skepticism', e:'= doubt slightly.', b:'= সন্দেহ নিয়ে গ্রহণ।' },
      { p:'"Throw in the towel" means —', o:['give up','wipe hands','throw cloth','start work'], a:'give up', e:'= surrender.', b:'= হাল ছাড়া।' },
      { p:'"Bury the hatchet" means —', o:['make peace','hide a weapon','dig a hole','start a fight'], a:'make peace', e:'= end quarrel.', b:'= ঝগড়া শেষ।' },
      { p:'"A bolt from the blue" means —', o:['sudden shock','blue lightning','a paint job','clear sky'], a:'sudden shock', e:'= unexpected.', b:'= অপ্রত্যাশিত।' },
      { p:'"A hard nut to crack" means —', o:['a difficult problem','a tasty snack','an easy task','a nut'], a:'a difficult problem', e:'= tough challenge.', b:'= কঠিন সমস্যা।' },
      { p:'"Out of the frying pan into the fire" means —', o:['from bad to worse','cooking','starting fresh','improving'], a:'from bad to worse', e:'= worsen.', b:'= আরও খারাপ।' },
      { p:'"A stitch in time saves nine" means —', o:['timely action prevents bigger trouble','sew quickly','count carefully','repair often'], a:'timely action prevents bigger trouble', e:'Proverb.', b:'প্রবাদ।' },
      { p:'"To take to task" means —', o:['to scold','to assign work','to praise','to help'], a:'to scold', e:'= reprimand.', b:'= তিরস্কার।' },
      { p:'"To turn a deaf ear" means —', o:['to ignore','to listen carefully','to hear less','to be deaf'], a:'to ignore', e:'= refuse to listen.', b:'= কান না দেওয়া।' },
      { p:'"To be at loggerheads" means —', o:['to be in disagreement','to be friends','to eat together','to work together'], a:'to be in disagreement', e:'= quarrel.', b:'= ঝগড়া।' },
      { p:'"To blow hot and cold" means —', o:['to be inconsistent','to feel hot','to change weather','to cook'], a:'to be inconsistent', e:'= waver.', b:'= অস্থির মনোভাব।' },
      { p:'"To burn the midnight oil" means —', o:['to study late into the night','to cook','to waste oil','to sleep early'], a:'to study late into the night', e:'= work late.', b:'= রাত জেগে পড়া।' },
      { p:'"To end in smoke" means —', o:['to end in failure','to catch fire','to smoke','to succeed'], a:'to end in failure', e:'= fail.', b:'= ব্যর্থ হওয়া।' },
      { p:'"A fish out of water" means —', o:['out of place','swimming','cooking','in a pond'], a:'out of place', e:'= uncomfortable.', b:'= অস্বস্তিকর।' },
      { p:'"To make both ends meet" means —', o:['to live within one’s means','to tie ropes','to travel','to break'], a:'to live within one’s means', e:'= manage financially.', b:'= সংসার চালানো।' },
      { p:'"To make hay while the sun shines" means —', o:['to use an opportunity','to farm','to rest','to sunbathe'], a:'to use an opportunity', e:'= seize the moment.', b:'= সুযোগ কাজে লাগানো।' },
      { p:'"A wolf in sheep\'s clothing" means —', o:['a dangerous person pretending to be good','an animal','a shepherd','a disguise'], a:'a dangerous person pretending to be good', e:'= hidden danger.', b:'= আপাত ভালো, আসলে খারাপ।' },
      { p:'"To nip in the bud" means —', o:['to stop something early','to cut flowers','to plant','to water'], a:'to stop something early', e:'= prevent early.', b:'= শুরুতে বন্ধ করা।' },
      { p:'"To play ducks and drakes" means —', o:['to waste money','to swim','to play games','to save money'], a:'to waste money', e:'= squander.', b:'= অর্থ নষ্ট।' },
      { p:'"To read between the lines" means —', o:['to understand the hidden meaning','to read fast','to skip pages','to write'], a:'to understand the hidden meaning', e:'= infer.', b:'= গোপন অর্থ বোঝা।' },
      { p:'"At the eleventh hour" means —', o:['at the last moment','at 11 o\'clock','early in the morning','at night'], a:'at the last moment', e:'= last minute.', b:'= শেষ মুহূর্তে।' },
      { p:'"To be in hot water" means —', o:['to be in trouble','to be in a bath','to cook','to be thirsty'], a:'to be in trouble', e:'= in difficulty.', b:'= বিপদে পড়া।' },
    ],
  },

  phrasalVerbs: {
    name: 'Phrasal Verbs', icon: 'zap', class: 'all',
    lesson: {
      rules: [
        'Phrasal verb = verb + preposition/adverb → new meaning.',
        'Examples: take off (remove), give up (quit), look after (care).',
        'Some are separable: turn on/off; others inseparable: look after.',
      ],
      examples: [
        'Take off your shoes. (= remove)',
        'Give up smoking. (= quit)',
        'Look after the baby. (= care for)',
      ],
      bangla: 'Phrasal verb = verb + preposition/adverb। এর অর্থ মূল verb থেকে আলাদা।',
    },
    questions: [
      { p:'Please ___ your shoes before entering.', o:['take off','take on','take in','take up'], a:'take off', e:'= remove.', b:'= খোলা।' },
      { p:'The plane will ___ at 6 AM.', o:['take off','take on','take in','take up'], a:'take off', e:'= leave ground.', b:'= উড়া শুরু।' },
      { p:'I need to ___ my homework.', o:['hand in','hand out','hand off','hand over'], a:'hand in', e:'= submit.', b:'= জমা দেওয়া।' },
      { p:'Let us ___ the meeting until tomorrow.', o:['put off','put on','put in','put up'], a:'put off', e:'= postpone.', b:'= স্থগিত।' },
      { p:'She ___ her mother.', o:['takes after','takes on','takes in','takes up'], a:'takes after', e:'= resemble.', b:'= মতো হওয়া।' },
      { p:'He ___ smoking last year.', o:['gave up','gave in','gave out','gave away'], a:'gave up', e:'= quit.', b:'= ছেড়ে দেওয়া।' },
      { p:'Can you ___ the light?', o:['turn on','turn off','turn up','turn down'], a:'turn on', e:'= switch on.', b:'= চালু।' },
      { p:'Please ___ the music.', o:['turn down','turn on','turn off','turn up'], a:'turn down', e:'= lower volume.', b:'= আওয়াজ কমানো।' },
      { p:'She ___ with her friend.', o:['fell out','fell in','fell off','fell on'], a:'fell out', e:'= quarrel.', b:'= ঝগড়া।' },
      { p:'He ___ his plan.', o:['carried out','carried on','carried off','carried in'], a:'carried out', e:'= execute.', b:'= বাস্তবায়ন।' },
      { p:'Look ___ the new word in the dictionary.', o:['up','down','in','on'], a:'up', e:'= search.', b:'= খোঁজা।' },
      { p:'I ___ my old friend yesterday.', o:['ran into','ran off','ran out','ran over'], a:'ran into', e:'= meet by chance.', b:'= আকস্মিক দেখা।' },
      { p:'Please ___ the form.', o:['fill in','fill up','fill on','fill off'], a:'fill in', e:'= complete.', b:'= পূরণ।' },
      { p:'He ___ his promise.', o:['broke','broke in','broke out','broke up'], a:'broke', e:'= break promise.', b:'= প্রতিশ্রুতি ভঙ্গ।' },
      { p:'Let us ___ this problem.', o:['deal with','deal in','deal on','deal off'], a:'deal with', e:'= handle.', b:'= মোকাবিলা।' },
      { p:'She ___ a new hobby.', o:['took up','took off','took in','took on'], a:'took up', e:'= start.', b:'= শুরু।' },
      { p:'He ___ smoking.', o:['cut down on','cut off','cut in','cut up'], a:'cut down on', e:'= reduce.', b:'= কমানো।' },
      { p:'The meeting was ___ until next week.', o:['put off','put on','put in','put up'], a:'put off', e:'= postpone.', b:'= স্থগিত।' },
      { p:'I cannot ___ this noise anymore.', o:['put up with','put on with','put in with','put off with'], a:'put up with', e:'= tolerate.', b:'= সহ্য করা।' },
      { p:'She ___ the truth eventually.', o:['found out','found in','found on','found up'], a:'found out', e:'= discover.', b:'= আবিষ্কার।' },
      { p:'I ___ at 6 AM every day.', o:['get up','get on','get in','get off'], a:'get up', e:'= rise.', b:'= ওঠা।' },
      { p:'Let us ___ the weekend.', o:['look forward to','look after','look into','look up'], a:'look forward to', e:'= anticipate.', b:'= অপেক্ষা।' },
      { p:'He ___ his father.', o:['looks up to','looks after','looks into','looks for'], a:'looks up to', e:'= admire.', b:'= শ্রদ্ধা।' },
      { p:'She ___ the exam.', o:['got through','got in','got on','got off'], a:'got through', e:'= pass.', b:'= পাস।' },
      { p:'They ___ at the party.', o:['showed up','showed in','showed off','showed on'], a:'showed up', e:'= arrive.', b:'= উপস্থিত।' },
      { p:'He ___ the book yesterday.', o:['gave back','gave in','gave out','gave away'], a:'gave back', e:'= return.', b:'= ফেরত।' },
      { p:'I will ___ you at the airport.', o:['pick up','pick in','pick on','pick off'], a:'pick up', e:'= collect.', b:'= নেওয়া।' },
      { p:'The car ___ .', o:['broke down','broke in','broke up','broke out'], a:'broke down', e:'= stop working.', b:'= বিকল।' },
      { p:'She ___ with an idea.', o:['came up','came in','came on','came off'], a:'came up', e:'= invent.', b:'= বের করা।' },
      { p:'Let us ___ the details.', o:['go over','go in','go on','go off'], a:'go over', e:'= review.', b:'= পুনরালোচনা।' },
      { p:'The meeting will ___ soon.', o:['break up','break in','break off','break out'], a:'break up', e:'= end.', b:'= শেষ।' },
      { p:'She ___ the story.', o:['made up','made in','made on','made off'], a:'made up', e:'= invent.', b:'= বানানো।' },
      { p:'Please ___ your shoes.', o:['put on','put off','put in','put out'], a:'put on', e:'= wear.', b:'= পরিধান।' },
      { p:'The fire was ___ by the firefighters.', o:['put out','put on','put in','put up'], a:'put out', e:'= extinguish.', b:'= নেভানো।' },
      { p:'I will ___ you at the station.', o:['see off','see in','see on','see through'], a:'see off', e:'= bid farewell.', b:'= বিদায়।' },
      { p:'They ___ a plan.', o:['worked out','worked in','worked on','worked up'], a:'worked out', e:'= devise.', b:'= তৈরি করা।' },
      { p:'The plane ___ at six in the morning.', o:['takes off','takes after','takes in','takes up'], a:'takes off', e:'= leaves the ground.', b:'= আকাশে ওঠা।' },
      { p:'He was ___ in a small village.', o:['brought up','brought in','brought on','brought out'], a:'brought up', e:'= raise.', b:'= লালন-পালন।' },
      { p:'The meeting was ___ because of the storm.', o:['called off','called in','called on','called up'], a:'called off', e:'= cancel.', b:'= বাতিল।' },
      { p:'He ___ the money.', o:['paid back','paid in','paid off','paid out'], a:'paid back', e:'= return.', b:'= ফেরত।' },
      { p:'I need to ___ this issue with my boss.', o:['take up','take on','take in','take off'], a:'take up', e:'= discuss.', b:'= আলোচনা।' },
      { p:'The children ___ quickly.', o:['grew up','grew in','grew on','grew out'], a:'grew up', e:'= mature.', b:'= বড় হওয়া।' },
      { p:'Please ___ the light before sleeping.', o:['turn off','turn on','turn up','turn down'], a:'turn off', e:'= switch off.', b:'= বন্ধ।' },
      { p:'We need to ___ the problem.', o:['sort out','sort in','sort on','sort up'], a:'sort out', e:'= resolve.', b:'= সমাধান।' },
      { p:'She ___ the invitation.', o:['turned down','turned up','turned on','turned in'], a:'turned down', e:'= refuse.', b:'= প্রত্যাখ্যান।' },
      { p:'He ___ his old friends.', o:['kept up with','kept in with','kept on with','kept out with'], a:'kept up with', e:'= maintain contact.', b:'= যোগাযোগ রাখা।' },
      { p:'She ___ the letters.', o:['tore up','tore in','tore on','tore off'], a:'tore up', e:'= destroy.', b:'= ছিঁড়ে ফেলা।' },
      { p:'The boat ___ in the storm.', o:['went down','went in','went on','went up'], a:'went down', e:'= sink.', b:'= ডুবে যাওয়া।' },
      { p:'He ___ a new business.', o:['set up','set in','set on','set off'], a:'set up', e:'= establish.', b:'= প্রতিষ্ঠা।' },
      { p:'Please ___ the volume.', o:['turn up','turn off','turn down','turn on'], a:'turn up', e:'= increase.', b:'= বাড়ানো।' },
      { p:'They ___ the project.', o:['gave up on','gave in on','gave out on','gave off on'], a:'gave up on', e:'= abandon.', b:'= পরিত্যাগ।' },
      { p:'I will ___ later.', o:['drop in','drop off','drop out','drop by'], a:'drop in', e:'= visit briefly.', b:'= অল্প দেখা।' },
      { p:'He was ___ by his uncle.', o:['brought up','brought in','brought on','brought about'], a:'brought up', e:'= raise.', b:'= লালন-পালন।' },
      { p:'Please ___ the trash.', o:['take out','take in','take on','take off'], a:'take out', e:'= remove.', b:'= বের করা।' },
      { p:'He ___ his notes before the exam.', o:['went over','went in','went on','went off'], a:'went over', e:'= review.', b:'= পুনরালোচনা।' },
    ],
  },

  collocations: {
    name: 'Collocations', icon: 'users', class: 'all',
    lesson: {
      rules: [
        'Collocation = words that naturally go together.',
        'Make a decision, take a photo, do homework, pay attention.',
        'Wrong pairing sounds unnatural to native speakers.',
      ],
      examples: [
        '<strong>make</strong> a decision (not do).',
        '<strong>take</strong> a photo (not make).',
        '<strong>pay</strong> attention (not do).',
      ],
      bangla: 'Collocation = শব্দের স্বাভাবিক সহাবস্থান। "Make a decision" সঠিক, "do a decision" ভুল।',
    },
    questions: [
      { p:'___ a decision.', o:['do','make','take','get'], a:'make', e:'Make a decision.', b:'Make a decision।' },
      { p:'___ a mistake.', o:['do','make','take','get'], a:'make', e:'Make a mistake.', b:'Make a mistake।' },
      { p:'___ a photo.', o:['do','make','take','get'], a:'take', e:'Take a photo.', b:'Take a photo।' },
      { p:'___ a shower.', o:['do','make','take','get'], a:'take', e:'Take a shower.', b:'Take a shower।' },
      { p:'___ a nap.', o:['do','make','take','get'], a:'take', e:'Take a nap.', b:'Take a nap।' },
      { p:'___ a break.', o:['do','make','take','get'], a:'take', e:'Take a break.', b:'Take a break।' },
      { p:'___ attention.', o:['do','make','pay','get'], a:'pay', e:'Pay attention.', b:'Pay attention।' },
      { p:'___ a promise.', o:['do','make','take','get'], a:'make', e:'Make a promise.', b:'Make a promise।' },
      { p:'___ a difference.', o:['do','make','take','get'], a:'make', e:'Make a difference.', b:'Make a difference।' },
      { p:'___ breakfast.', o:['do','make','have','get'], a:'have', e:'Have breakfast.', b:'Have breakfast।' },
      { p:'___ a headache.', o:['do','have','make','get'], a:'have', e:'Have a headache.', b:'Have a headache।' },
      { p:'___ a cold.', o:['do','make','catch','get'], a:'catch', e:'Catch a cold.', b:'Catch a cold।' },
      { p:'___ a taxi.', o:['do','make','take','get'], a:'take', e:'Take a taxi.', b:'Take a taxi।' },
      { p:'___ a risk.', o:['do','make','take','get'], a:'take', e:'Take a risk.', b:'Take a risk।' },
      { p:'___ a joke.', o:['do','make','tell','say'], a:'tell', e:'Tell a joke.', b:'Tell a joke।' },
      { p:'___ the truth.', o:['do','make','tell','say'], a:'tell', e:'Tell the truth.', b:'Tell the truth।' },
      { p:'___ a lie.', o:['do','make','tell','say'], a:'tell', e:'Tell a lie.', b:'Tell a lie।' },
      { p:'___ money.', o:['do','save','take','get'], a:'save', e:'Save money.', b:'Save money।' },
      { p:'___ an exam.', o:['do','make','take','get'], a:'take', e:'Take an exam.', b:'Take an exam।' },
      { p:'___ the piano.', o:['do','make','play','get'], a:'play', e:'Play the piano.', b:'Play the piano।' },
      { p:'___ homework.', o:['do','make','take','get'], a:'do', e:'Do homework.', b:'Do homework।' },
      { p:'___ the dishes.', o:['do','make','take','get'], a:'do', e:'Do the dishes.', b:'Do the dishes।' },
      { p:'___ a phone call.', o:['do','make','take','get'], a:'make', e:'Make a phone call.', b:'Make a phone call।' },
      { p:'___ a seat.', o:['do','make','take','get'], a:'take', e:'Take a seat.', b:'Take a seat।' },
      { p:'___ a walk.', o:['do','make','take','get'], a:'take', e:'Take a walk.', b:'Take a walk।' },
      { p:'___ a noise.', o:['do','make','take','get'], a:'make', e:'Make a noise.', b:'Make a noise।' },
      { p:'___ one\'s best.', o:['do','make','take','get'], a:'do', e:'Do one\'s best.', b:'Do one\'s best।' },
      { p:'___ a favour.', o:['do','make','take','get'], a:'do', e:'Do a favour.', b:'Do a favour।' },
      { p:'___ business.', o:['do','make','take','get'], a:'do', e:'Do business.', b:'Do business।' },
      { p:'___ the bed.', o:['do','make','take','get'], a:'make', e:'Make the bed.', b:'Make the bed।' },
      { p:'___ friends.', o:['do','make','take','get'], a:'make', e:'Make friends.', b:'Make friends।' },
      { p:'___ progress.', o:['do','make','take','get'], a:'make', e:'Make progress.', b:'Make progress।' },
      { p:'___ an appointment.', o:['do','make','take','get'], a:'make', e:'Make an appointment.', b:'Make an appointment।' },
      { p:'___ a suggestion.', o:['do','make','take','get'], a:'make', e:'Make a suggestion.', b:'Make a suggestion।' },
      { p:'___ care.', o:['do','make','take','get'], a:'take', e:'Take care.', b:'Take care।' },
      { p:'___ medicine.', o:['do','make','take','get'], a:'take', e:'Take medicine.', b:'Take medicine।' },
      { p:'___ a message.', o:['do','make','take','get'], a:'take', e:'Take a message.', b:'Take a message।' },
      { p:'___ part in a competition.', o:['do','make','take','get'], a:'take', e:'Take part in.', b:'Take part in।' },
      { p:'___ one\'s time.', o:['do','make','take','get'], a:'take', e:'Take one\'s time.', b:'Take one\'s time।' },
      { p:'___ a deep breath.', o:['do','make','take','get'], a:'take', e:'Take a deep breath.', b:'Take a deep breath।' },
      { p:'___ a mistake in grammar.', o:['do','make','take','get'], a:'make', e:'Make a mistake.', b:'Make a mistake।' },
      { p:'___ damage.', o:['do','make','take','cause'], a:'cause', e:'Cause damage.', b:'Cause damage।' },
      { p:'___ an offer.', o:['do','make','take','get'], a:'make', e:'Make an offer.', b:'Make an offer।' },
      { p:'___ an apology.', o:['do','make','take','get'], a:'make', e:'Make an apology.', b:'Make an apology।' },
      { p:'___ a complaint.', o:['do','make','take','get'], a:'make', e:'Make a complaint.', b:'Make a complaint।' },
      { p:'___ someone a compliment.', o:['do','make','pay','give'], a:'pay', e:'Pay a compliment.', b:'Pay a compliment।' },
      { p:'___ a visit.', o:['do','make','take','pay'], a:'pay', e:'Pay a visit.', b:'Pay a visit।' },
      { p:'___ an end to something.', o:['do','make','take','put'], a:'put', e:'Put an end to.', b:'Put an end to।' },
      { p:'___ a speech.', o:['do','make','take','deliver'], a:'deliver', e:'Deliver a speech.', b:'Deliver a speech।' },
      { p:'___ a lecture.', o:['do','make','give','take'], a:'give', e:'Give a lecture.', b:'Give a lecture।' },
    ],
  },

  conditionals: {
    name: 'Conditionals', icon: 'target', class: 'all',
    lesson: {
      rules: [
        'Zero: if + present simple, present simple (universal truth).',
        'First: if + present simple, will + base (real future).',
        'Second: if + past simple, would + base (unreal present).',
        'Third: if + past perfect, would have + V3 (unreal past).',
        'Inverted: Were I…; Had I…; Should it…',
      ],
      examples: [
        'If you heat ice, it <strong>melts</strong>. (Zero)',
        'If it rains, we <strong>will stay</strong> home. (First)',
        'If I <strong>were</strong> rich, I would travel. (Second)',
        'If she had studied, she <strong>would have passed</strong>. (Third)',
      ],
      bangla: 'Zero conditional = সর্বজনীন সত্য। First = সম্ভাব্য ভবিষ্যৎ। Second = অসম্ভব বর্তমান। Third = অতীতের অনুশোচনা।',
    },
    questions: [
      { p:'If you heat ice, it ___ .', o:['melt','melts','melted','will melt'], a:'melts', e:'Zero conditional.', b:'Zero conditional।' },
      { p:'If it rains, we ___ at home.', o:['stay','stays','will stay','stayed'], a:'will stay', e:'First conditional.', b:'First conditional।' },
      { p:'If I had money, I ___ a car.', o:['buy','bought','would buy','will buy'], a:'would buy', e:'Second conditional.', b:'Second conditional।' },
      { p:'If she had studied, she ___ the exam.', o:['would pass','would have passed','will pass','passes'], a:'would have passed', e:'Third conditional.', b:'Third conditional।' },
      { p:'If he ___ harder, he would succeed.', o:['studies','studied','had studied','study'], a:'studied', e:'Second conditional.', b:'Second conditional।' },
      { p:'If you had told me, I ___ helped you.', o:['would','would have','will have','had'], a:'would have', e:'Third conditional.', b:'Third conditional।' },
      { p:'If water reaches 100°C, it ___ .', o:['boils','boiled','will boil','would boil'], a:'boils', e:'Zero conditional.', b:'Zero conditional।' },
      { p:'If I were rich, I ___ the world.', o:['travel','traveled','would travel','will travel'], a:'would travel', e:'Second conditional.', b:'Second conditional।' },
      { p:'If it had not rained, we ___ out.', o:['would go','would have gone','went','go'], a:'would have gone', e:'Third conditional.', b:'Third conditional।' },
      { p:'If you don\'t hurry, you ___ the bus.', o:['miss','will miss','missed','would miss'], a:'will miss', e:'First conditional.', b:'First conditional।' },
      { p:'Unless you work hard, you ___ .', o:['will fail','would fail','failed','fail'], a:'will fail', e:'Unless + first conditional.', b:'Unless + first conditional।' },
      { p:'If I ___ you, I would apologize.', o:['am','was','were','be'], a:'were', e:'Subjunctive.', b:'Subjunctive।' },
      { p:'If they ___ , they would have won.', o:['practiced','had practiced','practice','practicing'], a:'had practiced', e:'Third conditional.', b:'Third conditional।' },
      { p:'If she ___ the truth, she would tell us.', o:['knows','knew','had known','know'], a:'knew', e:'Second conditional.', b:'Second conditional।' },
      { p:'If I ___ time, I will visit you.', o:['have','had','will have','having'], a:'have', e:'First conditional.', b:'First conditional।' },
      { p:'If he had left earlier, he ___ the train.', o:['catches','caught','would catch','would have caught'], a:'would have caught', e:'Third conditional.', b:'Third conditional।' },
      { p:'If it snows, the roads ___ slippery.', o:['become','became','will become','would become'], a:'become', e:'Zero conditional.', b:'Zero conditional।' },
      { p:'If you heat water, it ___ .', o:['boil','boils','boiled','will boil'], a:'boils', e:'Zero conditional.', b:'Zero conditional।' },
      { p:'If I hadn\'t eaten, I ___ hungry.', o:['will be','would be','would have been','am'], a:'would have been', e:'Third conditional.', b:'Third conditional।' },
      { p:'If she comes, I ___ her.', o:['meet','met','will meet','would meet'], a:'will meet', e:'First conditional.', b:'First conditional।' },
      { p:'If I ___ a bird, I would fly.', o:['am','was','were','be'], a:'were', e:'Second conditional.', b:'Second conditional।' },
      { p:'If we had known, we ___ differently.', o:['act','acted','would act','would have acted'], a:'would have acted', e:'Third conditional.', b:'Third conditional।' },
      { p:'If he doesn\'t come, we ___ without him.', o:['go','went','will go','would go'], a:'will go', e:'First conditional.', b:'First conditional।' },
      { p:'If I had a car, I ___ drive to work.', o:['will','would','would have','had'], a:'would', e:'Second conditional.', b:'Second conditional।' },
      { p:'If you had studied, you ___ the test.', o:['pass','passed','would pass','would have passed'], a:'would have passed', e:'Third conditional.', b:'Third conditional।' },
      { p:'Unless it rains, the match ___ on time.', o:['starts','will start','started','would start'], a:'will start', e:'First conditional.', b:'First conditional।' },
      { p:'If I were you, I ___ the offer.', o:['accept','accepted','would accept','will accept'], a:'would accept', e:'Second conditional.', b:'Second conditional।' },
      { p:'If you had taken the medicine, you ___ better.', o:['feel','felt','would feel','would have felt'], a:'would have felt', e:'Third conditional.', b:'Third conditional।' },
      { p:'If she studied, she ___ the exam.', o:['passes','passed','would pass','would have passed'], a:'would pass', e:'Second conditional.', b:'Second conditional।' },
      { p:'If we leave now, we ___ on time.', o:['arrive','arrived','will arrive','would arrive'], a:'will arrive', e:'First conditional.', b:'First conditional।' },
      { p:'If it had been sunny, we ___ to the beach.', o:['go','went','would go','would have gone'], a:'would have gone', e:'Third conditional.', b:'Third conditional।' },
      { p:'If I ___ my keys, I will call you.', o:['lose','lost','will lose','had lost'], a:'lose', e:'First conditional.', b:'First conditional।' },
      { p:'If you eat too much, you ___ sick.', o:['get','got','will get','would get'], a:'will get', e:'First conditional.', b:'First conditional।' },
      { p:'If I ___ harder, I would have passed.', o:['study','studied','had studied','studying'], a:'had studied', e:'Third conditional.', b:'Third conditional।' },
      { p:'Had I known, I ___ differently.', o:['act','acted','would act','would have acted'], a:'would have acted', e:'Inverted third.', b:'Inverted third।' },
      { p:'Were I you, I ___ it.', o:['do','did','would do','will do'], a:'would do', e:'Inverted second.', b:'Inverted second।' },
      { p:'Should it rain, we ___ indoors.', o:['stay','stayed','will stay','would stay'], a:'will stay', e:'Inverted first.', b:'Inverted first।' },
      { p:'If you don\'t water plants, they ___ .', o:['die','dies','will die','would die'], a:'will die', e:'First conditional.', b:'First conditional।' },
      { p:'If she had come, she ___ the surprise.', o:['sees','saw','would see','would have seen'], a:'would have seen', e:'Third conditional.', b:'Third conditional।' },
      { p:'If the weather ___ fine, we will go out.', o:['is','was','were','be'], a:'is', e:'First conditional.', b:'First conditional।' },
      { p:'If he ___ his homework, he can go out.', o:['finishes','finished','will finish','would finish'], a:'finishes', e:'First conditional.', b:'First conditional।' },
      { p:'If I ___ more time, I would learn piano.', o:['have','had','will have','would have'], a:'had', e:'Second conditional.', b:'Second conditional।' },
      { p:'If it had not been for you, I ___ failed.', o:['would','would have','will have','had'], a:'would have', e:'Third conditional.', b:'Third conditional।' },
      { p:'If she ___ English, she could work abroad.', o:['knows','knew','had known','will know'], a:'knew', e:'Second conditional.', b:'Second conditional।' },
      { p:'If you heat butter, it ___ .', o:['melt','melts','melted','would melt'], a:'melts', e:'Zero conditional.', b:'Zero conditional।' },
      { p:'If I had studied medicine, I ___ a doctor.', o:['am','was','would be','would have been'], a:'would be', e:'Mixed conditional.', b:'Mixed conditional।' },
      { p:'If you come early, we ___ dinner together.', o:['have','had','will have','would have'], a:'will have', e:'First conditional.', b:'First conditional।' },
      { p:'If I had a million dollars, I ___ it all.', o:['spend','spent','would spend','would have spent'], a:'would spend', e:'Second conditional.', b:'Second conditional।' },
      { p:'If she calls, tell her I ___ out.', o:['am','was','will be','would be'], a:'am', e:'Reported condition.', b:'Reported condition।' },
      { p:'If we had left earlier, we ___ the traffic.', o:['avoid','avoided','would avoid','would have avoided'], a:'would have avoided', e:'Third conditional.', b:'Third conditional।' },
    ],
  },

  modals: {
    name: 'Modal Verbs', icon: 'zap', class: 'all',
    lesson: {
      rules: [
        'Can = ability; May = permission/possibility; Must = obligation.',
        'Should = advice; Ought to = moral duty; Need not = not necessary.',
        'Modal + base verb (no -s, no to).',
        'Past modals: modal + have + V3 (should have done).',
      ],
      examples: [
        'You <strong>should</strong> see a doctor.',
        'She <strong>can</strong> swim well.',
        'You <strong>must not</strong> smoke here.',
      ],
      bangla: 'Modal verb এর পরে সবসময় base form বসে। Past এ modal + have + V3।',
    },
    questions: [
      { p:'You ___ see a doctor.', o:['should','would','could','might'], a:'should', e:'Advice.', b:'পরামর্শ।' },
      { p:'She ___ swim very well.', o:['can','may','must','should'], a:'can', e:'Ability.', b:'সামর্থ্য।' },
      { p:'They ___ be at home now.', o:['can','might','must','should'], a:'might', e:'Possibility.', b:'সম্ভাবনা।' },
      { p:'I ___ go to bed early tonight.', o:['must','may','might','could'], a:'must', e:'Obligation.', b:'বাধ্যবাধকতা।' },
      { p:'He ___ speak three languages.', o:['can','may','must','should'], a:'can', e:'Ability.', b:'সামর্থ্য।' },
      { p:'You ___ smoke here.', o:["mustn't",'shouldn\'t','couldn\'t','wouldn\'t'], a:"mustn't", e:'Prohibition.', b:'নিষেধ।' },
      { p:'___ I borrow your pen?', o:['May','Must','Should','Would'], a:'May', e:'Permission.', b:'অনুমতি।' },
      { p:'We ___ to help them.', o:['ought','must','should','may'], a:'ought', e:'Ought to.', b:'Ought to।' },
      { p:'She ___ take an umbrella.', o:['should','would','could','might'], a:'should', e:'Advice.', b:'পরামর্শ।' },
      { p:'You ___ be tired after such a long day.', o:['can','might','must','should'], a:'must', e:'Conclusion.', b:'সিদ্ধান্ত।' },
      { p:'He ___ be at work; I saw him at the park.', o:["can't",'mustn\'t','shouldn\'t','wouldn\'t'], a:"can't", e:'Impossibility.', b:'অসম্ভব।' },
      { p:'___ you please open the window?', o:['Could','Must','Should','May'], a:'Could', e:'Polite request.', b:'ভদ্র অনুরোধ।' },
      { p:'We ___ finish the project by tomorrow.', o:['have to','has to','having to','had'], a:'have to', e:'Obligation.', b:'বাধ্যবাধকতা।' },
      { p:'Students ___ wear uniforms.', o:['must','may','might','could'], a:'must', e:'Rule.', b:'নিয়ম।' },
      { p:'You ___ have told me earlier.', o:['should','would','could','might'], a:'should', e:'Past regret.', b:'অনুশোচনা।' },
      { p:'She ___ have forgotten.', o:['might','must','should','would'], a:'might', e:'Past possibility.', b:'অতীত সম্ভাবনা।' },
      { p:'He ___ have arrived by now.', o:['might','must','should','would'], a:'should', e:'Expectation.', b:'প্রত্যাশা।' },
      { p:'They ___ have left already.', o:['might','must','should','would'], a:'must', e:'Certain past.', b:'নিশ্চিত অতীত।' },
      { p:'I ___ rather stay home.', o:['would','should','could','might'], a:'would', e:'Preference.', b:'পছন্দ।' },
      { p:'You ___ better see a doctor.', o:['had','would','should','could'], a:'had', e:'Had better.', b:'Had better।' },
      { p:'She ___ be coming later.', o:['might','must','should','would'], a:'might', e:'Possibility.', b:'সম্ভাবনা।' },
      { p:'We ___ not have waited.', o:['should','would','could','might'], a:'should', e:'Past criticism.', b:'অতীত সমালোচনা।' },
      { p:'___ I ask a question?', o:['May','Must','Should','Would'], a:'May', e:'Permission.', b:'অনুমতি।' },
      { p:'He ___ not have done that.', o:['should','would','could','might'], a:'should', e:'Past regret.', b:'অনুশোচনা।' },
      { p:'You ___ need to hurry.', o:['might','must','should','would'], a:'might', e:'Possibility.', b:'সম্ভাবনা।' },
      { p:'She ___ have been very tired.', o:['might','must','should','would'], a:'must', e:'Logical past.', b:'অতীত যুক্তি।' },
      { p:'We ___ go now if we want to catch the train.', o:['should','would','could','might'], a:'should', e:'Advice.', b:'পরামর্শ।' },
      { p:'He ___ run faster when he was young.', o:['can','could','may','might'], a:'could', e:'Past ability.', b:'অতীত সামর্থ্য।' },
      { p:'You ___ not enter without a pass.', o:['may','must','should','would'], a:'must', e:'Prohibition.', b:'নিষেধ।' },
      { p:'They ___ come tomorrow.', o:['may','must','should','would'], a:'may', e:'Possibility.', b:'সম্ভাবনা।' },
      { p:'I ___ help you with that.', o:['can','must','should','would'], a:'can', e:'Offer.', b:'প্রস্তাব।' },
      { p:'She ___ not want to come.', o:['may','must','should','would'], a:'may', e:'Possibility.', b:'সম্ভাবনা।' },
      { p:'You ___ have seen the sign.', o:['should','would','could','might'], a:'should', e:'Past regret.', b:'অতীত অনুশোচনা।' },
      { p:'He ___ finished by now.', o:['should have','must have','could have','might have'], a:'should have', e:'Expected.', b:'প্রত্যাশিত।' },
      { p:'We ___ wait any longer.', o:["can't",'mustn\'t','shouldn\'t','wouldn\'t'], a:"can't", e:'Impossibility.', b:'অসম্ভব।' },
      { p:'___ you like some tea?', o:['Would','Should','Could','Might'], a:'Would', e:'Offering.', b:'প্রস্তাব করা।' },
      { p:'He used to ___ every evening.', o:['play','plays','played','playing'], a:'play', e:'Used to + base.', b:'Used to + base।' },
      { p:'You ___ to apologize.', o:['ought','must','should','may'], a:'ought', e:'Ought to.', b:'Ought to।' },
      { p:'I ___ rather walk than drive.', o:['would','should','could','might'], a:'would', e:'Preference.', b:'পছন্দ।' },
      { p:'She ___ not have said that.', o:['should','would','could','might'], a:'should', e:'Past regret.', b:'অতীত অনুশোচনা।' },
      { p:'We ___ respect our elders.', o:['should','would','might','could'], a:'should', e:'Moral duty.', b:'নৈতিক কর্তব্য।' },
      { p:'He ___ be very rich.', o:['must','can','should','would'], a:'must', e:'Strong probability.', b:'দৃঢ় সম্ভাবনা।' },
      { p:'You ___ have come earlier.', o:['should','would','could','might'], a:'should', e:'Advice in past.', b:'অতীতে পরামর্শ।' },
      { p:'She ___ not have gone there.', o:['should','would','could','might'], a:'should', e:'Regret.', b:'অনুশোচনা।' },
      { p:'They ___ be waiting for us.', o:['must','can','should','would'], a:'must', e:'Certainty.', b:'নিশ্চয়তা।' },
      { p:'He ___ speak English fluently.', o:['can','must','should','ought'], a:'can', e:'Ability.', b:'সামর্থ্য।' },
      { p:'You ___ not worry about it.', o:['need','must','should','would'], a:'need', e:'Need not.', b:'Need not।' },
      { p:'She ___ have missed the train.', o:['must','can','should','would'], a:'must', e:'Logical deduction.', b:'যুক্তি।' },
      { p:'I ___ like to see that film.', o:['would','should','could','might'], a:'would', e:'Wish.', b:'ইচ্ছা।' },
      { p:'You ___ take an umbrella; it may rain.', o:['should','would','could','might'], a:'should', e:'Advice.', b:'পরামর্শ।' },
    ],
  },

  wordFormation: {
    name: 'Word Formation', icon: 'book', class: 'all',
    lesson: {
      rules: [
        'Noun forms: -tion, -ment, -ness, -ity (decision, movement, kindness).',
        'Adjective forms: -ful, -ous, -ive, -able (beautiful, dangerous).',
        'Adverb forms: -ly (beautifully, quickly).',
        'Verb forms: -ise, -ify, -en (realise, beautify).',
      ],
      examples: [
        'beauty → <strong>beautiful</strong> (adj) / <strong>beautifully</strong> (adv).',
        'decide → <strong>decision</strong> (noun).',
        'success → <strong>successful</strong> (adj).',
      ],
      bangla: 'Noun → -tion/-ment/-ness; Adjective → -ful/-ous/-ive; Adverb → -ly।',
    },
    questions: [
      { p:'She is a ___ (beauty) woman.', o:['beauty','beautiful','beautify','beautifully'], a:'beautiful', e:'Adjective.', b:'Adjective।' },
      { p:'His ___ (decide) surprised everyone.', o:['decide','decisive','decision','decidedly'], a:'decision', e:'Noun.', b:'Noun।' },
      { p:'She sings ___ (beauty).', o:['beauty','beautiful','beautify','beautifully'], a:'beautifully', e:'Adverb.', b:'Adverb।' },
      { p:'It was a ___ (danger) situation.', o:['danger','dangerous','dangerously','endanger'], a:'dangerous', e:'Adjective.', b:'Adjective।' },
      { p:'He is a ___ (success) businessman.', o:['success','successful','successfully','succeed'], a:'successful', e:'Adjective.', b:'Adjective।' },
      { p:'Her ___ (kind) touched us.', o:['kind','kindly','kindness','kinder'], a:'kindness', e:'Noun.', b:'Noun।' },
      { p:'They live ___ (happy).', o:['happy','happily','happiness','happier'], a:'happily', e:'Adverb.', b:'Adverb।' },
      { p:'He is very ___ (create).', o:['create','creation','creative','creatively'], a:'creative', e:'Adjective.', b:'Adjective।' },
      { p:'Her ___ (achieve) is impressive.', o:['achieve','achievement','achievable','achieved'], a:'achievement', e:'Noun.', b:'Noun।' },
      { p:'He acted ___ (brave).', o:['brave','bravery','bravely','braver'], a:'bravely', e:'Adverb.', b:'Adverb।' },
      { p:'This is a ___ (mystery) case.', o:['mystery','mysterious','mysteriously','mystify'], a:'mysterious', e:'Adjective.', b:'Adjective।' },
      { p:'His ___ (explain) was clear.', o:['explain','explanation','explanatory','explained'], a:'explanation', e:'Noun.', b:'Noun।' },
      { p:'She has a ___ (power) voice.', o:['power','powerful','powerfully','powerless'], a:'powerful', e:'Adjective.', b:'Adjective।' },
      { p:'The ___ (perform) was amazing.', o:['perform','performer','performance','performing'], a:'performance', e:'Noun.', b:'Noun।' },
      { p:'He is a ___ (talent) musician.', o:['talent','talented','talentless','talentedly'], a:'talented', e:'Adjective.', b:'Adjective।' },
      { p:'Her ___ (move) was graceful.', o:['move','movement','moving','moved'], a:'movement', e:'Noun.', b:'Noun।' },
      { p:'This is a ___ (peace) place.', o:['peace','peaceful','peacefully','peacemaker'], a:'peaceful', e:'Adjective.', b:'Adjective।' },
      { p:'His ___ (argue) was convincing.', o:['argue','argument','arguable','arguably'], a:'argument', e:'Noun.', b:'Noun।' },
      { p:'She answered ___ (quick).', o:['quick','quickness','quickly','quicken'], a:'quickly', e:'Adverb.', b:'Adverb।' },
      { p:'His ___ (improve) is noticeable.', o:['improve','improvement','improved','improving'], a:'improvement', e:'Noun.', b:'Noun।' },
      { p:'It was an ___ (enjoy) party.', o:['enjoy','enjoyable','enjoyment','enjoyably'], a:'enjoyable', e:'Adjective.', b:'Adjective।' },
      { p:'He is a ___ (science).', o:['science','scientific','scientist','scientifically'], a:'scientist', e:'Person noun.', b:'ব্যক্তি noun।' },
      { p:'She showed great ___ (patient).', o:['patient','patience','patiently','patients'], a:'patience', e:'Noun.', b:'Noun।' },
      { p:'This is a ___ (history) place.', o:['history','historic','historically','historian'], a:'historic', e:'Adjective.', b:'Adjective।' },
      { p:'He is very ___ (ambition).', o:['ambition','ambitious','ambitiously','ambitions'], a:'ambitious', e:'Adjective.', b:'Adjective।' },
      { p:'Her ___ (appear) was sudden.', o:['appear','appearance','apparent','apparently'], a:'appearance', e:'Noun.', b:'Noun।' },
      { p:'He answered ___ (confident).', o:['confident','confidence','confidently','confidential'], a:'confidently', e:'Adverb.', b:'Adverb।' },
      { p:'The ___ (invent) was brilliant.', o:['invent','inventive','invention','inventor'], a:'invention', e:'Noun.', b:'Noun।' },
      { p:'She is ___ (care) with her work.', o:['care','careful','carefully','careless'], a:'careful', e:'Adjective.', b:'Adjective।' },
      { p:'He drives ___ (care).', o:['care','careful','carefully','careless'], a:'carefully', e:'Adverb.', b:'Adverb।' },
      { p:'Her ___ (free) was precious.', o:['free','freedom','freely','freeing'], a:'freedom', e:'Noun.', b:'Noun।' },
      { p:'The room was ___ (dark).', o:['dark','darkness','darken','darkly'], a:'dark', e:'Adjective.', b:'Adjective।' },
      { p:'She spoke with ___ (wise).', o:['wise','wisdom','wisely','wiser'], a:'wisdom', e:'Noun.', b:'Noun।' },
      { p:'He is a ___ (law).', o:['law','lawful','lawyer','lawfully'], a:'lawyer', e:'Person noun.', b:'ব্যক্তি noun।' },
      { p:'Her ___ (fail) was a lesson.', o:['fail','failure','failed','failing'], a:'failure', e:'Noun.', b:'Noun।' },
      { p:'This is a ___ (love) story.', o:['love','lovely','lovable','loving'], a:'lovely', e:'Adjective.', b:'Adjective।' },
      { p:'He ___ (success) in the exam.', o:['success','successful','succeeded','successfully'], a:'succeeded', e:'Verb.', b:'Verb।' },
      { p:'Her ___ (beautify) is natural.', o:['beautify','beauty','beautiful','beautifully'], a:'beauty', e:'Noun.', b:'Noun।' },
      { p:'She spoke ___ (courage).', o:['courage','courageous','courageously','courageousness'], a:'courageously', e:'Adverb.', b:'Adverb।' },
      { p:'His ___ (brave) was rewarded.', o:['brave','bravery','bravely','braver'], a:'bravery', e:'Noun.', b:'Noun।' },
      { p:'This is a ___ (music) instrument.', o:['music','musical','musician','musically'], a:'musical', e:'Adjective.', b:'Adjective।' },
      { p:'He is a famous ___ (music).', o:['music','musical','musician','musically'], a:'musician', e:'Person noun.', b:'ব্যক্তি noun।' },
      { p:'Her ___ (happy) was obvious.', o:['happy','happiness','happily','happier'], a:'happiness', e:'Noun.', b:'Noun।' },
      { p:'The ___ (treat) worked well.', o:['treat','treatment','treatable','treated'], a:'treatment', e:'Noun.', b:'Noun।' },
      { p:'She is very ___ (intelligence).', o:['intelligence','intelligent','intelligently','intelligible'], a:'intelligent', e:'Adjective.', b:'Adjective।' },
      { p:'Her ___ (intelligent) is remarkable.', o:['intelligence','intelligent','intelligently','intelligible'], a:'intelligence', e:'Noun.', b:'Noun।' },
      { p:'He ___ (quick) walked away.', o:['quick','quickness','quickly','quicken'], a:'quickly', e:'Adverb.', b:'Adverb।' },
      { p:'This is a ___ (use) tool.', o:['use','useful','usefully','usefulness'], a:'useful', e:'Adjective.', b:'Adjective।' },
      { p:'He was ___ (use) without his glasses.', o:['use','useful','useless','uselessly'], a:'useless', e:'Adjective.', b:'Adjective।' },
      { p:'Her ___ (kind) is well known.', o:['kind','kindly','kindness','kinder'], a:'kindness', e:'Noun.', b:'Noun।' },
    ],
  },

  questionTags: {
    name: 'Question Tags', icon: 'chat', class: 'all',
    lesson: {
      rules: [
        'Positive statement → negative tag; negative → positive.',
        'Use same auxiliary as the statement.',
        '"Let us" → shall we; "Let me" → may I.',
        '"Nobody/Somebody/Everybody" → they; "Nothing/Everything" → it.',
      ],
      examples: [
        'She is a doctor, <strong>isn’t she</strong>?',
        'You like coffee, <strong>don’t you</strong>?',
        'Let us go, <strong>shall we</strong>?',
      ],
      bangla: 'ধনাত্মক statement → ঋণাত্মক tag। "Let us" → shall we; "Nobody" → they।',
    },
    questions: [
      { p:'She is a doctor, ___?', o:['is she','isn\'t she','isn\'t it','does she'], a:"isn't she", e:'Positive → negative tag.', b:'Positive → negative tag।' },
      { p:'He can swim, ___?', o:['can he','can\'t he','does he','is he'], a:"can't he", e:'Can → can\'t.', b:'Can → can\'t।' },
      { p:'They went home, ___?', o:['did they','didn\'t they','do they','don\'t they'], a:"didn't they", e:'Past → didn\'t.', b:'Past → didn\'t।' },
      { p:'You like coffee, ___?', o:['do you','don\'t you','are you','aren\'t you'], a:"don't you", e:'Present → don\'t.', b:'Present → don\'t।' },
      { p:'She doesn\'t smoke, ___?', o:['does she','doesn\'t she','is she','isn\'t she'], a:'does she', e:'Negative → positive.', b:'Negative → positive।' },
      { p:'We should go, ___?', o:['should we','shouldn\'t we','do we','don\'t we'], a:"shouldn't we", e:'Should → shouldn\'t.', b:'Should → shouldn\'t।' },
      { p:'He has finished, ___?', o:['has he','hasn\'t he','does he','did he'], a:"hasn't he", e:'Has → hasn\'t.', b:'Has → hasn\'t।' },
      { p:'They are coming, ___?', o:['are they','aren\'t they','do they','don\'t they'], a:"aren't they", e:'Are → aren\'t.', b:'Are → aren\'t।' },
      { p:'Let us go, ___?', o:['shall we','will we','do we','should we'], a:'shall we', e:'Let us → shall we.', b:'Let us → shall we।' },
      { p:'Open the door, ___?', o:['will you','won\'t you','do you','shall we'], a:'will you', e:'Imperative → will you.', b:'Imperative → will you।' },
      { p:'I am right, ___?', o:['am I','aren\'t I','am not I','isn\'t it'], a:"aren't I", e:'Special: aren\'t I.', b:'Special: aren\'t I।' },
      { p:'Nobody came, ___?', o:['did they','didn\'t they','did he','didn\'t he'], a:'did they', e:'Nobody → they.', b:'Nobody → they।' },
      { p:'Everything is fine, ___?', o:['is it','isn\'t it','are they','aren\'t they'], a:"isn't it", e:'Everything → it.', b:'Everything → it।' },
      { p:'Everybody was happy, ___?', o:['was he','wasn\'t he','were they','weren\'t they'], a:"weren't they", e:'Everybody → they.', b:'Everybody → they।' },
      { p:'She rarely smiles, ___?', o:['does she','doesn\'t she','is she','isn\'t she'], a:'does she', e:'Rarely = negative.', b:'Rarely = negative।' },
      { p:'He hardly speaks, ___?', o:['does he','doesn\'t he','is he','isn\'t he'], a:'does he', e:'Hardly = negative.', b:'Hardly = negative।' },
      { p:'You have never been there, ___?', o:['have you','haven\'t you','did you','didn\'t you'], a:'have you', e:'Never = negative.', b:'Never = negative।' },
      { p:'There is a book, ___?', o:['is there','isn\'t there','are there','aren\'t there'], a:"isn't there", e:'There is → isn\'t there.', b:'There is → isn\'t there।' },
      { p:'She can\'t drive, ___?', o:['can she','can\'t she','does she','doesn\'t she'], a:'can she', e:'Negative → positive.', b:'Negative → positive।' },
      { p:'They were late, ___?', o:['were they','weren\'t they','are they','aren\'t they'], a:"weren't they", e:'Past plural.', b:'Past plural।' },
      { p:'He plays well, ___?', o:['does he','doesn\'t he','is he','isn\'t he'], a:"doesn't he", e:'Present → doesn\'t.', b:'Present → doesn\'t।' },
      { p:'It is raining, ___?', o:['is it','isn\'t it','does it','doesn\'t it'], a:"isn't it", e:'Is → isn\'t.', b:'Is → isn\'t।' },
      { p:'I don\'t know him, ___?', o:['do I','don\'t I','am I','aren\'t I'], a:'do I', e:'Negative → positive.', b:'Negative → positive।' },
      { p:'Let me help you, ___?', o:['shall I','will I','do I','may I'], a:'may I', e:'Let me → may I.', b:'Let me → may I।' },
      { p:'You have eaten, ___?', o:['have you','haven\'t you','did you','didn\'t you'], a:"haven't you", e:'Have → haven\'t.', b:'Have → haven\'t।' },
      { p:'She had left, ___?', o:['had she','hadn\'t she','did she','didn\'t she'], a:"hadn't she", e:'Had → hadn\'t.', b:'Had → hadn\'t।' },
      { p:'He will come, ___?', o:['will he','won\'t he','does he','doesn\'t he'], a:"won't he", e:'Will → won\'t.', b:'Will → won\'t।' },
      { p:'They had been waiting, ___?', o:['had they','hadn\'t they','were they','weren\'t they'], a:"hadn't they", e:'Had → hadn\'t.', b:'Had → hadn\'t।' },
      { p:'There were many, ___?', o:['were there','weren\'t there','was there','wasn\'t there'], a:"weren't there", e:'There were → weren\'t.', b:'There were → weren\'t।' },
      { p:'You wouldn\'t lie, ___?', o:['would you','wouldn\'t you','do you','did you'], a:'would you', e:'Negative → positive.', b:'Negative → positive।' },
      { p:'He must go, ___?', o:['must he','mustn\'t he','does he','doesn\'t he'], a:"mustn't he", e:'Must → mustn\'t.', b:'Must → mustn\'t।' },
      { p:'She said so, ___?', o:['did she','didn\'t she','does she','doesn\'t she'], a:"didn't she", e:'Past → didn\'t.', b:'Past → didn\'t।' },
      { p:'We need not go, ___?', o:['need we','needn\'t we','do we','don\'t we'], a:'need we', e:'Negative → positive.', b:'Negative → positive।' },
      { p:'Somebody called, ___?', o:['did they','did he','didn\'t they','didn\'t he'], a:'did they', e:'Somebody → they.', b:'Somebody → they।' },
      { p:'Nothing happened, ___?', o:['did it','didn\'t it','did they','didn\'t they'], a:'did it', e:'Nothing → it.', b:'Nothing → it।' },
      { p:'Anyone can do it, ___?', o:['can they','can\'t they','can he','can\'t he'], a:"can't they", e:'Anyone → they.', b:'Anyone → they।' },
      { p:'She is never late, ___?', o:['is she','isn\'t she','does she','doesn\'t she'], a:'is she', e:'Never = negative.', b:'Never = negative।' },
      { p:'It seldom rains here, ___?', o:['does it','doesn\'t it','is it','isn\'t it'], a:'does it', e:'Seldom = negative.', b:'Seldom = negative।' },
      { p:'I am not wrong, ___?', o:['am I','aren\'t I','am not I','is it'], a:'am I', e:'Negative → positive.', b:'Negative → positive।' },
      { p:'Let them go, ___?', o:['will you','shall we','will they','may they'], a:'will you', e:'Let them → will you.', b:'Let them → will you।' },
      { p:'Don\'t be late, ___?', o:['will you','won\'t you','do you','shall we'], a:'will you', e:'Negative imperative.', b:'Negative imperative।' },
      { p:'He used to smoke, ___?', o:['used he','didn\'t he','did he','usedn\'t he'], a:"didn't he", e:'Used to → didn\'t.', b:'Used to → didn\'t।' },
      { p:'You had better go, ___?', o:['had you','hadn\'t you','would you','did you'], a:"hadn't you", e:'Had better → hadn\'t you.', b:'Had better → hadn\'t you।' },
      { p:'She has to study, ___?', o:['has she','hasn\'t she','does she','doesn\'t she'], a:"doesn't she", e:'Has to → doesn\'t.', b:'Has to → doesn\'t।' },
    ],
  },

  subjectVerbAgreement: {
    name: 'Subject-Verb Agreement', icon: 'users', class: 'all',
    lesson: {
      rules: [
        'Singular subject → singular verb; plural → plural.',
        '"Each/Every/Either/Neither/Everyone/Nobody" → singular verb.',
        '"A number of" → plural; "The number of" → singular.',
        'Uncountables (news, advice, furniture) → singular verb.',
        'Collective nouns take singular unless focusing on members.',
      ],
      examples: [
        'She <strong>listens</strong> to music.',
        'Each student <strong>has</strong> a book.',
        'The news <strong>is</strong> surprising.',
      ],
      bangla: 'Each/Every/Either/Neither → singular verb। A number of → plural, the number of → singular।',
    },
    questions: [
      { p:'She ___ to music every day.', o:['listen','listens','listening','listened'], a:'listens', e:'3rd singular.', b:'৩য় singular।' },
      { p:'The dogs ___ loudly.', o:['bark','barks','barking','barked'], a:'bark', e:'Plural.', b:'Plural।' },
      { p:'My brother and I ___ good friends.', o:['am','is','are','be'], a:'are', e:'Compound plural.', b:'Compound plural।' },
      { p:'Each of the students ___ a book.', o:['have','has','having','had'], a:'has', e:'Each → singular.', b:'Each → singular।' },
      { p:'Neither of the boys ___ ready.', o:['are','is','were','be'], a:'is', e:'Neither → singular.', b:'Neither → singular।' },
      { p:'Either of the answers ___ correct.', o:['are','is','were','be'], a:'is', e:'Either → singular.', b:'Either → singular।' },
      { p:'The news ___ surprising.', o:['are','is','were','be'], a:'is', e:'News singular.', b:'News singular।' },
      { p:'Mathematics ___ my favorite subject.', o:['are','is','were','be'], a:'is', e:'Subject → singular.', b:'Subject → singular।' },
      { p:'The police ___ investigating the case.', o:['is','are','was','be'], a:'are', e:'Police plural.', b:'Police plural।' },
      { p:'Every student ___ a uniform.', o:['need','needs','needing','needed'], a:'needs', e:'Every → singular.', b:'Every → singular।' },
      { p:'A number of students ___ absent.', o:['is','are','was','be'], a:'are', e:'A number of → plural.', b:'A number of → plural।' },
      { p:'The number of students ___ increasing.', o:['are','is','were','be'], a:'is', e:'The number → singular.', b:'The number → singular।' },
      { p:'Bread and butter ___ my breakfast.', o:['are','is','were','be'], a:'is', e:'Fixed pair → singular.', b:'স্থির জোড়া → singular।' },
      { p:'Ten years ___ a long time.', o:['are','is','were','be'], a:'is', e:'Time → singular.', b:'সময় → singular।' },
      { p:'Someone ___ at the door.', o:['are','is','were','be'], a:'is', e:'Someone singular.', b:'Someone singular।' },
      { p:'Nobody ___ the answer.', o:['know','knows','knowing','knew'], a:'knows', e:'Nobody → singular.', b:'Nobody → singular।' },
      { p:'All of the cake ___ gone.', o:['are','is','were','be'], a:'is', e:'Cake uncountable.', b:'Cake uncountable।' },
      { p:'Some of the students ___ late.', o:['was','were','is','be'], a:'were', e:'Plural referent.', b:'Plural referent।' },
      { p:'Both of them ___ here.', o:['is','are','was','be'], a:'are', e:'Both plural.', b:'Both plural।' },
      { p:'Few of the children ___ present.', o:['was','were','is','be'], a:'were', e:'Few → plural.', b:'Few → plural।' },
      { p:'Many of the books ___ old.', o:['is','are','was','be'], a:'are', e:'Many → plural.', b:'Many → plural।' },
      { p:'Half of the pizza ___ eaten.', o:['were','was','are','be'], a:'was', e:'Pizza uncountable.', b:'Pizza uncountable।' },
      { p:'The information ___ useful.', o:['are','is','were','be'], a:'is', e:'Information uncountable.', b:'Information uncountable।' },
      { p:'Her advice ___ always helpful.', o:['are','is','were','be'], a:'is', e:'Advice uncountable.', b:'Advice uncountable।' },
      { p:'His furniture ___ expensive.', o:['are','is','were','be'], a:'is', e:'Furniture uncountable.', b:'Furniture uncountable।' },
      { p:'The equipment ___ broken.', o:['are','is','were','be'], a:'is', e:'Equipment uncountable.', b:'Equipment uncountable।' },
      { p:'Measles ___ a serious disease.', o:['are','is','were','be'], a:'is', e:'Disease → singular.', b:'রোগ → singular।' },
      { p:'Physics ___ difficult.', o:['are','is','were','be'], a:'is', e:'Subject → singular.', b:'Subject → singular।' },
      { p:'The scissors ___ sharp.', o:['is','are','was','be'], a:'are', e:'Paired tool plural.', b:'জোড়া যন্ত্র plural।' },
      { p:'My trousers ___ too tight.', o:['is','are','was','be'], a:'are', e:'Paired clothing plural.', b:'জোড়া পোশাক plural।' },
      { p:'The cattle ___ grazing.', o:['is','are','was','be'], a:'are', e:'Cattle plural.', b:'Cattle plural।' },
      { p:'Two hours ___ enough time.', o:['are','is','were','be'], a:'is', e:'Time → singular.', b:'সময় → singular।' },
      { p:'The audience ___ clapping.', o:['was','were','is','be'], a:'was', e:'Collective one.', b:'Collective একক।' },
      { p:'The staff ___ getting ready.', o:['is','are','was','be'], a:'are', e:'Individual members.', b:'স্বতন্ত্র সদস্য।' },
      { p:'Everyone ___ here now.', o:['are','is','were','be'], a:'is', e:'Everyone singular.', b:'Everyone singular।' },
      { p:'Something ___ wrong.', o:['are','is','were','be'], a:'is', e:'Something singular.', b:'Something singular।' },
      { p:'Everything ___ ready.', o:['are','is','were','be'], a:'is', e:'Everything singular.', b:'Everything singular।' },
      { p:'Nothing ___ impossible.', o:['are','is','were','be'], a:'is', e:'Nothing singular.', b:'Nothing singular।' },
      { p:'Here ___ the keys.', o:['is','are','was','be'], a:'are', e:'Plural after here.', b:'Here পর plural।' },
      { p:'There ___ a book on the table.', o:['are','is','were','be'], a:'is', e:'A book singular.', b:'A book singular।' },
      { p:'There ___ many people at the party.', o:['was','were','is','be'], a:'were', e:'Many people plural.', b:'Many people plural।' },
      { p:'Neither John nor his friends ___ coming.', o:['is','are','was','be'], a:'are', e:'Nearest subject plural.', b:'নিকটতম subject plural।' },
      { p:'Not only the teacher but also the students ___ happy.', o:['was','were','is','be'], a:'were', e:'Nearest subject plural.', b:'নিকটতম subject plural।' },
      { p:'One of my friends ___ a doctor.', o:['are','is','were','be'], a:'is', e:'One of → singular.', b:'One of → singular।' },
      { p:'The rich ___ becoming richer.', o:['is','are','was','be'], a:'are', e:'The rich plural.', b:'The rich plural।' },
      { p:'His trousers ___ dirty.', o:['is','are','was','be'], a:'are', e:'Paired clothing.', b:'জোড়া পোশাক।' },
      { p:'Each of the girls ___ her own room.', o:['have','has','having','had'], a:'has', e:'Each of → singular.', b:'Each of → singular।' },
      { p:'The police ___ arrived.', o:['has','have','having','had'], a:'have', e:'Police plural.', b:'Police plural।' },
      { p:'Somebody ___ left a bag here.', o:['have','has','having','had'], a:'has', e:'Somebody singular.', b:'Somebody singular।' },
      { p:'Both my parents ___ teachers.', o:['is','are','was','be'], a:'are', e:'Plural subject.', b:'Plural subject।' },
    ],
  },

  /* ================= EXTRA CORE CATEGORIES ================= */

  determiners: {
    name: 'Determiners', icon: 'flag', class: 'all',
    lesson: {
      rules: [
        '<code>This/That</code> + singular; <code>These/Those</code> + plural.',
        '<code>Some</code> in positive; <code>any</code> in negative/questions.',
        '<code>Each/Every</code> + singular noun + singular verb.',
        '<code>Both</code> + plural; <code>Neither/Either</code> + singular.',
        '<code>All/None/Most</code> + plural or uncountable.',
      ],
      examples: [
        '<strong>This</strong> book is mine.',
        'I have <strong>some</strong> money.',
        '<strong>Each</strong> student has a book.',
        '<strong>Both</strong> boys are present.',
      ],
      bangla: 'This/That একবচনে, These/Those বহুবচনে। Some ধনাত্মকে, any ঋণাত্মক/প্রশ্নে।',
    },
    questions: [
      { p:'___ book is mine.', o:['This','These','Those','Many'], a:'This', e:'Singular.', b:'একবচন।' },
      { p:'___ books are mine.', o:['This','That','These','Much'], a:'These', e:'Plural.', b:'বহুবচন।' },
      { p:'I have ___ money.', o:['many','some','few','a few'], a:'some', e:'Positive uncountable.', b:'Uncountable positive।' },
      { p:'Do you have ___ questions?', o:['some','any','much','little'], a:'any', e:'Question.', b:'প্রশ্ন।' },
      { p:'___ student must attend.', o:['All','Each','Every','Both'], a:'Each', e:'Each + singular.', b:'Each + একবচন।' },
      { p:'___ of them are present.', o:['Each','Every','Both','Much'], a:'Both', e:'Both + plural.', b:'Both + plural।' },
      { p:'___ of the two is correct.', o:['Both','Neither','All','Some'], a:'Neither', e:'Neither of two.', b:'দুইয়ের কেউ নয়।' },
      { p:'I have ___ friends in Dhaka.', o:['much','a little','a few','little'], a:'a few', e:'Countable positive.', b:'Countable positive।' },
      { p:'She has ___ patience.', o:['many','few','little','a few'], a:'little', e:'Uncountable negative.', b:'Uncountable negative।' },
      { p:'___ people were present.', o:['Much','Many','A little','Little'], a:'Many', e:'Countable.', b:'Countable।' },
      { p:'I have ___ time.', o:['many','few','a little','a few'], a:'a little', e:'Uncountable positive.', b:'Uncountable positive।' },
      { p:'___ of the boys came.', o:['Each','Every','All','Much'], a:'All', e:'All + plural.', b:'All + plural।' },
      { p:'___ of the students passed.', o:['Much','Most','Little','A little'], a:'Most', e:'Most + plural.', b:'Most + plural।' },
      { p:'There isn\'t ___ milk left.', o:['some','any','many','few'], a:'any', e:'Negative.', b:'Negative।' },
      { p:'Would you like ___ tea?', o:['any','some','many','few'], a:'some', e:'Offer.', b:'Offer।' },
      { p:'___ boy in the class passed.', o:['All','Every','Both','Some'], a:'Every', e:'Every + singular.', b:'Every + একবচন।' },
      { p:'___ of my friends came.', o:['Much','Some','Little','A little'], a:'Some', e:'Some + plural.', b:'Some + plural।' },
      { p:'I have ___ idea about it.', o:['no','not','none','nothing'], a:'no', e:'No + noun.', b:'No + noun।' },
      { p:'___ of them knew the answer.', o:['None','No','Not','Nothing'], a:'None', e:'None of.', b:'None of।' },
      { p:'___ of the two roads leads home.', o:['Either','Both','All','Some'], a:'Either', e:'Either of two.', b:'Either of two।' },
      { p:'I have ___ books than you.', o:['less','fewer','little','few'], a:'fewer', e:'Countable.', b:'Countable।' },
      { p:'She has ___ money than I.', o:['less','fewer','little','few'], a:'less', e:'Uncountable.', b:'Uncountable।' },
      { p:'He spent ___ money on books.', o:['many','a lot of','few','a few'], a:'a lot of', e:'Both types.', b:'উভয় ধরন।' },
      { p:'I have ___ homework tonight.', o:['many','few','much','a few'], a:'much', e:'Uncountable question/negative.', b:'Uncountable।' },
      { p:'___ of the cake was eaten.', o:['All','Every','Each','Many'], a:'All', e:'Uncountable.', b:'Uncountable।' },
      { p:'___ of the girls was absent.', o:['Each','Every','Many','Several'], a:'Each', e:'Each of + singular.', b:'Each of + একবচন।' },
      { p:'He has ___ friends in the city.', o:['much','few','little','a little'], a:'few', e:'Countable negative.', b:'Countable negative।' },
      { p:'There are ___ chairs in the room.', o:['much','several','a little','little'], a:'several', e:'Several + plural.', b:'Several + plural।' },
      { p:'___ people prefer tea to coffee.', o:['Much','Most','A little','Little'], a:'Most', e:'Most + plural.', b:'Most + plural।' },
      { p:'She didn\'t bring ___ food.', o:['some','any','many','few'], a:'any', e:'Negative.', b:'Negative।' },
      { p:'Let me give you ___ advice.', o:['an','a','some','many'], a:'some', e:'Uncountable positive.', b:'Uncountable positive।' },
      { p:'___ of the answers is right.', o:['Both','Neither','All','Some'], a:'Neither', e:'Neither + singular.', b:'Neither + একবচন।' },
      { p:'___ of us wants to go.', o:['None','No','Not','Nothing'], a:'None', e:'None + of.', b:'None + of।' },
      { p:'I bought ___ apples from the market.', o:['much','some','a little','little'], a:'some', e:'Countable positive.', b:'Countable positive।' },
      { p:'Take ___ of these two books.', o:['both','either','all','some'], a:'either', e:'Either of two.', b:'দুইয়ের একটি।' },
      { p:'He has ___ wealth than his brother.', o:['fewer','less','few','little'], a:'less', e:'Uncountable comparative.', b:'Uncountable comparative।' },
      { p:'There is ___ water in the glass.', o:['many','few','a little','a few'], a:'a little', e:'Uncountable positive.', b:'Uncountable positive।' },
      { p:'I have ___ patience with him.', o:['many','few','little','a few'], a:'little', e:'Uncountable negative.', b:'Uncountable negative।' },
      { p:'She spent ___ hours reading.', o:['much','several','a little','little'], a:'several', e:'Several + plural.', b:'Several + plural।' },
      { p:'___ of the students were absent.', o:['Much','Many','A little','Little'], a:'Many', e:'Many + plural.', b:'Many + plural।' },
      { p:'Do you have ___ pens I can borrow?', o:['some','any','much','little'], a:'any', e:'Question.', b:'প্রশ্ন।' },
      { p:'___ of the two boys won the race.', o:['Both','Either','All','Some'], a:'Either', e:'Either of two.', b:'দুইয়ের একজন।' },
      { p:'He has ___ interest in politics.', o:['many','few','little','a few'], a:'little', e:'Uncountable negative.', b:'Uncountable negative।' },
      { p:'___ people attended the meeting.', o:['Much','Few','A little','Little'], a:'Few', e:'Countable negative.', b:'Countable negative।' },
      { p:'Would you like ___ sugar in your tea?', o:['any','some','many','few'], a:'some', e:'Offer.', b:'Offer।' },
      { p:'I need ___ help with this problem.', o:['any','some','many','few'], a:'some', e:'Positive.', b:'Positive।' },
      { p:'___ of the milk was wasted.', o:['Many','Some','Few','Several'], a:'Some', e:'Uncountable.', b:'Uncountable।' },
      { p:'___ of the questions were easy.', o:['Much','Most','A little','Little'], a:'Most', e:'Most + plural.', b:'Most + plural।' },
      { p:'I have ___ information about this.', o:['many','few','little','a few'], a:'little', e:'Uncountable negative.', b:'Uncountable negative।' },
      { p:'___ of the two roads is safe.', o:['Both','Neither','All','Many'], a:'Neither', e:'Neither of two.', b:'দুইয়ের কেউ নয়।' },
    ],
  },

  gerundsInfinitives: {
    name: 'Gerunds & Infinitives', icon: 'book', class: 'all',
    lesson: {
      rules: [
        'Verbs + gerund: enjoy, mind, suggest, avoid, finish, practice.',
        'Verbs + infinitive: want, decide, hope, promise, agree, plan.',
        'Verbs + both (same): like, love, hate, prefer, begin, start.',
        'Verbs + both (diff meaning): stop, remember, forget, try.',
        'After preposition → gerund (good at swimming).',
      ],
      examples: [
        'She enjoys <strong>swimming</strong>.',
        'I want <strong>to go</strong> home.',
        'He stopped <strong>smoking</strong> (= quit).',
        'He stopped <strong>to smoke</strong> (= paused to smoke).',
      ],
      bangla: 'Enjoy/mind/suggest → gerund। Want/decide/hope → infinitive। Preposition এর পরে gerund।',
    },
    questions: [
      { p:'She enjoys ___ books.', o:['read','reads','reading','to read'], a:'reading', e:'Enjoy + gerund.', b:'Enjoy + gerund।' },
      { p:'I want ___ home.', o:['go','going','to go','went'], a:'to go', e:'Want + infinitive.', b:'Want + infinitive।' },
      { p:'He decided ___ medicine.', o:['study','studying','to study','studied'], a:'to study', e:'Decide + infinitive.', b:'Decide + infinitive।' },
      { p:'She suggested ___ the meeting.', o:['postpone','to postpone','postponing','postponed'], a:'postponing', e:'Suggest + gerund.', b:'Suggest + gerund।' },
      { p:'I hope ___ you soon.', o:['see','seeing','to see','saw'], a:'to see', e:'Hope + infinitive.', b:'Hope + infinitive।' },
      { p:'He avoided ___ the question.', o:['answer','to answer','answering','answered'], a:'answering', e:'Avoid + gerund.', b:'Avoid + gerund।' },
      { p:'They promised ___ on time.', o:['come','coming','to come','came'], a:'to come', e:'Promise + infinitive.', b:'Promise + infinitive।' },
      { p:'She finished ___ her homework.', o:['do','doing','to do','did'], a:'doing', e:'Finish + gerund.', b:'Finish + gerund।' },
      { p:'I plan ___ abroad.', o:['go','going','to go','went'], a:'to go', e:'Plan + infinitive.', b:'Plan + infinitive।' },
      { p:'He practices ___ every day.', o:['swim','swimming','to swim','swam'], a:'swimming', e:'Practice + gerund.', b:'Practice + gerund।' },
      { p:'She agreed ___ us.', o:['help','helping','to help','helped'], a:'to help', e:'Agree + infinitive.', b:'Agree + infinitive।' },
      { p:'I don\'t mind ___ late.', o:['work','working','to work','worked'], a:'working', e:'Mind + gerund.', b:'Mind + gerund।' },
      { p:'He wants ___ a doctor.', o:['become','becoming','to become','became'], a:'to become', e:'Want + infinitive.', b:'Want + infinitive।' },
      { p:'She likes ___ novels.', o:['read','reading','to read','Both A and B are correct'], a:'Both A and B are correct', e:'Like + both.', b:'Like + উভয়ই।' },
      { p:'He stopped ___ when he was 40.', o:['smoke','smoking','to smoke','smoked'], a:'smoking', e:'Stop + gerund = quit.', b:'Stop + gerund = ছাড়া।' },
      { p:'He stopped ___ a cigarette.', o:['smoke','smoking','to smoke','smoked'], a:'to smoke', e:'Stop + inf = pause to.', b:'Stop + inf = থামা।' },
      { p:'I remember ___ the door.', o:['lock','locking','to lock','locked'], a:'locking', e:'Remember + gerund = past.', b:'Remember + gerund = অতীত।' },
      { p:'Remember ___ the door!', o:['lock','locking','to lock','locked'], a:'to lock', e:'Remember + inf = future.', b:'Remember + inf = ভবিষ্যৎ।' },
      { p:'He is good at ___ English.', o:['speak','speaking','to speak','spoke'], a:'speaking', e:'Preposition + gerund.', b:'Preposition + gerund।' },
      { p:'I look forward to ___ from you.', o:['hear','hearing','to hear','heard'], a:'hearing', e:'To = preposition.', b:'To = preposition।' },
      { p:'She is afraid of ___ alone.', o:['travel','traveling','to travel','traveled'], a:'traveling', e:'Preposition + gerund.', b:'Preposition + gerund।' },
      { p:'Thank you for ___ me.', o:['help','helping','to help','helped'], a:'helping', e:'For + gerund.', b:'For + gerund।' },
      { p:'I am interested in ___ music.', o:['learn','learning','to learn','learned'], a:'learning', e:'In + gerund.', b:'In + gerund।' },
      { p:'He insisted on ___ the bill.', o:['pay','paying','to pay','paid'], a:'paying', e:'On + gerund.', b:'On + gerund।' },
      { p:'She is used to ___ up early.', o:['get','getting','to get','got'], a:'getting', e:'Used to + gerund.', b:'Used to + gerund।' },
      { p:'I want to ___ a doctor.', o:['become','becoming','became','becomes'], a:'become', e:'To + base.', b:'To + base।' },
      { p:'Let me ___ you.', o:['help','helping','to help','helped'], a:'help', e:'Let + base.', b:'Let + base।' },
      { p:'He made me ___ the truth.', o:['tell','telling','to tell','told'], a:'tell', e:'Make + base.', b:'Make + base।' },
      { p:'I heard him ___ the song.', o:['sing','singing','to sing','sang'], a:'sing', e:'Hear + base/gerund.', b:'Hear + base/gerund।' },
      { p:'She saw me ___ the road.', o:['cross','crossing','to cross','crossed'], a:'cross', e:'See + base.', b:'See + base।' },
      { p:'I would rather ___ at home.', o:['stay','staying','to stay','stayed'], a:'stay', e:'Would rather + base.', b:'Would rather + base।' },
      { p:'You had better ___ a doctor.', o:['see','seeing','to see','saw'], a:'see', e:'Had better + base.', b:'Had better + base।' },
      { p:'He cannot help ___ about her.', o:['think','thinking','to think','thought'], a:'thinking', e:'Cannot help + gerund.', b:'Cannot help + gerund।' },
      { p:'I am looking forward to ___ you.', o:['see','seeing','to see','saw'], a:'seeing', e:'To = preposition.', b:'To = preposition।' },
      { p:'She apologized for ___ late.', o:['be','being','to be','was'], a:'being', e:'For + gerund.', b:'For + gerund।' },
      { p:'He is capable of ___ the work.', o:['do','doing','to do','did'], a:'doing', e:'Of + gerund.', b:'Of + gerund।' },
      { p:'I am tired of ___ the same thing.', o:['do','doing','to do','did'], a:'doing', e:'Of + gerund.', b:'Of + gerund।' },
      { p:'She dreamt of ___ a singer.', o:['become','becoming','to become','became'], a:'becoming', e:'Of + gerund.', b:'Of + gerund।' },
      { p:'He objected to ___ the plan.', o:['change','changing','to change','changed'], a:'changing', e:'To = preposition.', b:'To = preposition।' },
      { p:'I don\'t feel like ___ today.', o:['work','working','to work','worked'], a:'working', e:'Feel like + gerund.', b:'Feel like + gerund।' },
      { p:'She kept ___ despite the noise.', o:['study','studying','to study','studied'], a:'studying', e:'Keep + gerund.', b:'Keep + gerund।' },
      { p:'He gave up ___ years ago.', o:['smoke','smoking','to smoke','smoked'], a:'smoking', e:'Give up + gerund.', b:'Give up + gerund।' },
      { p:'They put off ___ the meeting.', o:['hold','holding','to hold','held'], a:'holding', e:'Put off + gerund.', b:'Put off + gerund।' },
      { p:'I can\'t stand ___ in queues.', o:['wait','waiting','to wait','waited'], a:'waiting', e:'Can\'t stand + gerund.', b:'Can\'t stand + gerund।' },
      { p:'She admitted ___ the mistake.', o:['make','making','to make','made'], a:'making', e:'Admit + gerund.', b:'Admit + gerund।' },
      { p:'He denied ___ the money.', o:['steal','stealing','to steal','stole'], a:'stealing', e:'Deny + gerund.', b:'Deny + gerund।' },
      { p:'I appreciate your ___ me.', o:['help','helping','to help','helped'], a:'helping', e:'Appreciate + gerund.', b:'Appreciate + gerund।' },
      { p:'She considered ___ a new job.', o:['take','taking','to take','took'], a:'taking', e:'Consider + gerund.', b:'Consider + gerund।' },
      { p:'He mentioned ___ you yesterday.', o:['see','seeing','to see','saw'], a:'seeing', e:'Mention + gerund.', b:'Mention + gerund।' },
      { p:'I recommend ___ this book.', o:['read','reading','to read','be read'], a:'reading', e:'Recommend + gerund.', b:'Recommend + gerund।' },
      { p:'She avoided ___ him.', o:['meet','meeting','to meet','met'], a:'meeting', e:'Avoid + gerund.', b:'Avoid + gerund।' },
      { p:'He risked ___ his job.', o:['lose','losing','to lose','lost'], a:'losing', e:'Risk + gerund.', b:'Risk + gerund।' },
      { p:'I don\'t recall ___ him before.', o:['see','seeing','to see','saw'], a:'seeing', e:'Recall + gerund.', b:'Recall + gerund।' },
      { p:'She imagines ___ rich.', o:['be','being','to be','was'], a:'being', e:'Imagine + gerund.', b:'Imagine + gerund।' },
      { p:'He postponed ___ the decision.', o:['make','making','to make','made'], a:'making', e:'Postpone + gerund.', b:'Postpone + gerund।' },
      { p:'I don\'t mind ___ for you.', o:['wait','waiting','to wait','waited'], a:'waiting', e:'Mind + gerund.', b:'Mind + gerund।' },
      { p:'She succeeded in ___ the exam.', o:['pass','passing','to pass','passed'], a:'passing', e:'In + gerund.', b:'In + gerund।' },
      { p:'He is thinking of ___ a car.', o:['buy','buying','to buy','bought'], a:'buying', e:'Of + gerund.', b:'Of + gerund।' },
      { p:'I am used to ___ up early.', o:['get','getting','to get','got'], a:'getting', e:'Used to + gerund.', b:'Used to + gerund।' },
      { p:'Let\'s ___ a movie.', o:['watch','watching','to watch','watched'], a:'watch', e:'Let\'s + base.', b:'Let\'s + base।' },
      { p:'Why not ___ a break?', o:['take','taking','to take','took'], a:'take', e:'Why not + base.', b:'Why not + base।' },
      { p:'You should ___ harder.', o:['try','trying','to try','tried'], a:'try', e:'Should + base.', b:'Should + base।' },
      { p:'He made me ___ for hours.', o:['wait','waiting','to wait','waited'], a:'wait', e:'Make + base.', b:'Make + base।' },
      { p:'I had better ___ now.', o:['go','going','to go','went'], a:'go', e:'Had better + base.', b:'Had better + base।' },
      { p:'She can ___ three languages.', o:['speak','speaking','to speak','spoke'], a:'speak', e:'Can + base.', b:'Can + base।' },
      { p:'I want ___ a new phone.', o:['buy','buying','to buy','bought'], a:'to buy', e:'Want + infinitive.', b:'Want + infinitive।' },
      { p:'He hopes ___ the prize.', o:['win','winning','to win','won'], a:'to win', e:'Hope + infinitive.', b:'Hope + infinitive।' },
    ],
  },

  clauses: {
    name: 'Clauses & Phrases', icon: 'grid', class: 'all',
    lesson: {
      rules: [
        'Main clause = independent sentence; Subordinate = dependent.',
        'Noun clause: acts as subject/object (what he said).',
        'Adjective clause: modifies noun (the man who came).',
        'Adverb clause: modifies verb (when he arrived).',
        'Phrase = group of words without subject+verb.',
      ],
      examples: [
        '<strong>What he said</strong> was true. (Noun clause)',
        'The man <strong>who came</strong> is my uncle. (Adjective)',
        'He left <strong>when the bell rang</strong>. (Adverb)',
      ],
      bangla: 'Noun clause subject/object হিসেবে, Adjective clause noun modify করে, Adverb clause verb modify করে।',
    },
    questions: [
      { p:'___ he said was true.', o:['What','That','Which','Who'], a:'What', e:'Noun clause subject.', b:'Noun clause subject।' },
      { p:'I know ___ he will come.', o:['that','what','which','who'], a:'that', e:'Noun clause object.', b:'Noun clause object।' },
      { p:'The man ___ came is my uncle.', o:['who','which','whom','whose'], a:'who', e:'Adjective clause person.', b:'Adjective clause ব্যক্তি।' },
      { p:'The book ___ I read is good.', o:['who','which','whose','whom'], a:'which', e:'Adjective clause thing.', b:'Adjective clause বস্তু।' },
      { p:'He left ___ the bell rang.', o:['when','which','who','what'], a:'when', e:'Adverb clause time.', b:'Adverb clause সময়।' },
      { p:'I stayed home ___ it rained.', o:['because','which','who','that'], a:'because', e:'Adverb clause cause.', b:'Adverb clause কারণ।' },
      { p:'___ he is poor, he is honest.', o:['Although','Because','So','And'], a:'Although', e:'Adverb clause concession.', b:'Adverb clause ছাড়।' },
      { p:'She will come ___ she can.', o:['if','which','who','what'], a:'if', e:'Adverb clause condition.', b:'Adverb clause শর্ত।' },
      { p:'I don\'t know ___ he lives.', o:['where','which','who','that'], a:'where', e:'Noun clause place.', b:'Noun clause স্থান।' },
      { p:'Tell me ___ you want.', o:['what','which','who','whose'], a:'what', e:'Noun clause object.', b:'Noun clause object।' },
      { p:'The girl ___ hair is long is my sister.', o:['whose','who','which','whom'], a:'whose', e:'Possessive relative.', b:'Possessive relative।' },
      { p:'This is the house ___ I was born.', o:['where','which','who','that'], a:'where', e:'Adjective clause place.', b:'Adjective clause স্থান।' },
      { p:'I know the reason ___ he left.', o:['why','which','who','that'], a:'why', e:'Adjective clause reason.', b:'Adjective clause কারণ।' },
      { p:'___ I arrived, they had left.', o:['When','Which','Who','That'], a:'When', e:'Adverb clause time.', b:'Adverb clause সময়।' },
      { p:'He works hard ___ he may succeed.', o:['so that','because','although','but'], a:'so that', e:'Adverb clause purpose.', b:'Adverb clause উদ্দেশ্য।' },
      { p:'She was so tired ___ she fell asleep.', o:['that','which','who','what'], a:'that', e:'So...that.', b:'So...that।' },
      { p:'It is a fact ___ the earth is round.', o:['that','which','who','what'], a:'that', e:'Noun clause.', b:'Noun clause।' },
      { p:'I wonder ___ he will agree.', o:['whether','that','which','who'], a:'whether', e:'Noun clause.', b:'Noun clause।' },
      { p:'He is the boy ___ won the prize.', o:['who','which','whom','whose'], a:'who', e:'Relative pronoun.', b:'Relative pronoun।' },
      { p:'The car ___ is red is mine.', o:['which','who','whom','whose'], a:'which', e:'Relative pronoun thing.', b:'Relative pronoun বস্তু।' },
      { p:'I met the man ___ you told me about.', o:['whom','which','who','whose'], a:'whom', e:'Object relative.', b:'Object relative।' },
      { p:'She lives in a city ___ is very old.', o:['which','who','whom','whose'], a:'which', e:'Relative pronoun.', b:'Relative pronoun।' },
      { p:'___ you work hard, you will fail.', o:['Unless','If','Because','Although'], a:'Unless', e:'Adverb clause.', b:'Adverb clause।' },
      { p:'He came ___ I was out.', o:['when','which','who','that'], a:'when', e:'Adverb clause.', b:'Adverb clause।' },
      { p:'She cried ___ she was sad.', o:['because','which','who','what'], a:'because', e:'Adverb clause cause.', b:'Adverb clause কারণ।' },
      { p:'___ I was walking, I saw a bird.', o:['While','Because','Although','So'], a:'While', e:'Adverb clause time.', b:'Adverb clause সময়।' },
      { p:'He is the man ___ I saw yesterday.', o:['whom','who','which','whose'], a:'whom', e:'Object relative.', b:'Object relative।' },
      { p:'The place ___ we met is beautiful.', o:['where','which','who','that'], a:'where', e:'Relative adverb.', b:'Relative adverb।' },
      { p:'I don\'t know ___ to do.', o:['what','which','who','whose'], a:'what', e:'Infinitive clause.', b:'Infinitive clause।' },
      { p:'Tell me ___ to go.', o:['where','which','who','whose'], a:'where', e:'Infinitive clause.', b:'Infinitive clause।' },
      { p:'___ I had known, I would have come.', o:['If','Unless','Although','Because'], a:'If', e:'Adverb clause condition.', b:'Adverb clause শর্ত।' },
      { p:'He failed ___ he did not study.', o:['because','which','who','what'], a:'because', e:'Adverb clause.', b:'Adverb clause।' },
      { p:'She is the girl ___ sings well.', o:['who','which','whom','whose'], a:'who', e:'Subject relative.', b:'Subject relative।' },
      { p:'This is the book ___ changed my life.', o:['that','who','whom','whose'], a:'that', e:'Relative pronoun.', b:'Relative pronoun।' },
      { p:'I have a friend ___ father is a doctor.', o:['whose','who','which','whom'], a:'whose', e:'Possessive relative.', b:'Possessive relative।' },
      { p:'___ he tried, he could not win.', o:['However','Because','So','And'], a:'However', e:'Adverb clause.', b:'Adverb clause।' },
      { p:'I left ___ the meeting ended.', o:['after','which','who','what'], a:'after', e:'Adverb clause time.', b:'Adverb clause সময়।' },
      { p:'He is stronger ___ I thought.', o:['than','which','who','that'], a:'than', e:'Comparative clause.', b:'Comparative clause।' },
      { p:'She works ___ she can support her family.', o:['so that','because','although','but'], a:'so that', e:'Purpose clause.', b:'Purpose clause।' },
      { p:'I know the man ___ is standing there.', o:['who','which','whom','whose'], a:'who', e:'Subject relative.', b:'Subject relative।' },
      { p:'The reason ___ he came is unknown.', o:['why','which','who','what'], a:'why', e:'Relative adverb.', b:'Relative adverb।' },
      { p:'___ you say, I will not go.', o:['Whatever','However','Whenever','Wherever'], a:'Whatever', e:'Concessive clause.', b:'Concessive clause।' },
      { p:'___ he arrived, the party started.', o:['As soon as','Because','Although','If'], a:'As soon as', e:'Time clause.', b:'Time clause।' },
      { p:'I will wait ___ you return.', o:['until','because','although','so'], a:'until', e:'Time clause.', b:'Time clause।' },
      { p:'He ran fast ___ he could catch the bus.', o:['so that','because','although','if'], a:'so that', e:'Purpose clause.', b:'Purpose clause।' },
      { p:'___ she was tired, she kept working.', o:['Although','Because','So','And'], a:'Although', e:'Concessive clause.', b:'Concessive clause।' },
      { p:'I know ___ she is honest.', o:['that','which','who','what'], a:'that', e:'Noun clause.', b:'Noun clause।' },
      { p:'This is the village ___ my father was born.', o:['where','which','who','that'], a:'where', e:'Relative adverb.', b:'Relative adverb।' },
      { p:'The boy ___ I met is my cousin.', o:['whom','which','who','whose'], a:'whom', e:'Object relative.', b:'Object relative।' },
      { p:'I can\'t tell ___ he will come or not.', o:['whether','if','that','which'], a:'whether', e:'Whether...or.', b:'Whether...or।' },
      { p:'She is the one ___ helped me.', o:['who','which','whom','whose'], a:'who', e:'Subject relative.', b:'Subject relative।' },
      { p:'The dog ___ barks loudly is mine.', o:['that','who','whom','whose'], a:'that', e:'Relative pronoun.', b:'Relative pronoun।' },
      { p:'I wonder ___ he is coming.', o:['if','that','which','who'], a:'if', e:'Noun clause.', b:'Noun clause।' },
      { p:'___ I was a child, I loved sweets.', o:['When','Which','Who','That'], a:'When', e:'Adverb clause.', b:'Adverb clause।' },
      { p:'He is the man ___ car was stolen.', o:['whose','who','which','whom'], a:'whose', e:'Possessive.', b:'Possessive।' },
      { p:'I came ___ I wanted to see you.', o:['because','which','who','that'], a:'because', e:'Adverb clause.', b:'Adverb clause।' },
      { p:'She sings better ___ I do.', o:['than','which','who','that'], a:'than', e:'Comparative.', b:'Comparative।' },
      { p:'I will go ___ it rains.', o:['unless','if','because','although'], a:'unless', e:'Condition.', b:'Condition।' },
      { p:'Give me the book ___ is on the table.', o:['which','who','whom','whose'], a:'which', e:'Relative pronoun.', b:'Relative pronoun।' },
      { p:'He asked me ___ I was going.', o:['where','which','who','that'], a:'where', e:'Noun clause.', b:'Noun clause।' },
      { p:'The fact ___ he lied hurt me.', o:['that','which','who','what'], a:'that', e:'Noun clause appositive.', b:'Noun clause appositive।' },
      { p:'She spoke ___ she knew everything.', o:['as if','because','although','so'], a:'as if', e:'Adverb clause manner.', b:'Adverb clause manner।' },
      { p:'I don\'t know ___ the meeting will start.', o:['when','which','who','what'], a:'when', e:'Noun clause time.', b:'Noun clause সময়।' },
      { p:'This is ___ I wanted to show you.', o:['what','which','who','whose'], a:'what', e:'Noun clause.', b:'Noun clause।' },
      { p:'He ran ___ he could.', o:['as fast as','because','although','if'], a:'as fast as', e:'Comparison clause.', b:'Comparison clause।' },
    ],
  },

  advancedGrammar: {
    name: 'Advanced Grammar', icon: 'target', class: 'all',
    lesson: {
      rules: [
        'Inversion after negative adverbs (Never have I…).',
        'Cleft sentences for emphasis (It was John who…).',
        'Subjunctive mood (I suggest that he go).',
        'Ellipsis and substitution in conversation.',
        'Emphatic "do" (I do like it).',
        'Fronting for emphasis (Beautiful was the scenery).',
      ],
      examples: [
        '<strong>Never have I</strong> seen such a thing. (Inversion)',
        '<strong>It was John who</strong> broke the window. (Cleft)',
        'I suggest that he <strong>go</strong> now. (Subjunctive)',
        'I <strong>do</strong> like coffee. (Emphatic do)',
      ],
      bangla: 'Inversion → negative adverb শুরুতে। Cleft → It was X who...। Subjunctive → suggest/insist + base verb।',
    },
    questions: [
      { p:'___ have I seen such beauty.', o:['Never','Ever','Always','Often'], a:'Never', e:'Inversion.', b:'Inversion।' },
      { p:'Rarely ___ he speak in public.', o:['do','does','did','doing'], a:'does', e:'Inversion.', b:'Inversion।' },
      { p:'It was John ___ broke the window.', o:['who','which','whom','whose'], a:'who', e:'Cleft.', b:'Cleft।' },
      { p:'I suggest that he ___ now.', o:['go','goes','going','went'], a:'go', e:'Subjunctive.', b:'Subjunctive।' },
      { p:'She insisted that he ___ present.', o:['be','is','was','being'], a:'be', e:'Subjunctive.', b:'Subjunctive।' },
      { p:'I ___ like coffee.', o:['do','does','did','doing'], a:'do', e:'Emphatic.', b:'Emphatic।' },
      { p:'Hardly ___ I entered when the phone rang.', o:['had','have','did','do'], a:'had', e:'Inversion.', b:'Inversion।' },
      { p:'No sooner ___ he arrived than it rained.', o:['had','has','did','does'], a:'had', e:'Inversion.', b:'Inversion।' },
      { p:'Never ___ I forget you.', o:['will','would','shall','Both A and B'], a:'shall', e:'Inversion.', b:'Inversion।' },
      { p:'Little ___ he know the truth.', o:['did','does','do','done'], a:'did', e:'Inversion.', b:'Inversion।' },
      { p:'Only then ___ I understand.', o:['did','do','does','done'], a:'did', e:'Inversion.', b:'Inversion।' },
      { p:'Not only ___ she sing, but also dance.', o:['can','could','does','did'], a:'can', e:'Inversion.', b:'Inversion।' },
      { p:'Under no circumstances ___ you leave.', o:['should','would','did','do'], a:'should', e:'Inversion.', b:'Inversion।' },
      { p:'It is education ___ changes lives.', o:['that','which','who','what'], a:'that', e:'Cleft.', b:'Cleft।' },
      { p:'It was in 1990 ___ he was born.', o:['that','which','who','when'], a:'that', e:'Cleft.', b:'Cleft।' },
      { p:'I demand that she ___ the truth.', o:['tell','tells','told','telling'], a:'tell', e:'Subjunctive.', b:'Subjunctive।' },
      { p:'It is essential that he ___ on time.', o:['be','is','was','being'], a:'be', e:'Subjunctive.', b:'Subjunctive।' },
      { p:'If I ___ you, I would tell the truth.', o:['am','was','were','be'], a:'were', e:'Subjunctive.', b:'Subjunctive।' },
      { p:'I wish I ___ there.', o:['am','was','were','be'], a:'were', e:'Subjunctive.', b:'Subjunctive।' },
      { p:'He acts as if he ___ the boss.', o:['is','was','were','be'], a:'were', e:'Subjunctive.', b:'Subjunctive।' },
      { p:'She said she ___ come tomorrow.', o:['will','would','shall','should'], a:'would', e:'Reported speech.', b:'Reported speech।' },
      { p:'Beautiful ___ the scenery.', o:['was','were','is','are'], a:'was', e:'Fronting.', b:'Fronting।' },
      { p:'___ do I need your help.', o:['Nor','Or','So','And'], a:'Nor', e:'Inversion.', b:'Inversion।' },
      { p:'Here ___ the bus.', o:['comes','come','came','coming'], a:'comes', e:'Inversion.', b:'Inversion।' },
      { p:'There ___ the bell.', o:['goes','go','went','going'], a:'goes', e:'Inversion.', b:'Inversion।' },
      { p:'Nowhere ___ I find it.', o:['could','can','did','do'], a:'could', e:'Inversion.', b:'Inversion।' },
      { p:'In no way ___ she responsible.', o:['is','are','was','were'], a:'is', e:'Inversion.', b:'Inversion।' },
      { p:'On no account ___ you touch it.', o:['must','should','would','did'], a:'must', e:'Inversion.', b:'Inversion।' },
      { p:'So beautiful ___ the sunset that we stopped.', o:['was','were','is','are'], a:'was', e:'Inversion.', b:'Inversion।' },
      { p:'Such ___ his anger that he left.', o:['was','were','is','are'], a:'was', e:'Inversion.', b:'Inversion।' },
      { p:'I ___ hope you succeed.', o:['do','does','did','doing'], a:'do', e:'Emphatic.', b:'Emphatic।' },
      { p:'She ___ come to the party.', o:['did','does','done','doing'], a:'did', e:'Emphatic.', b:'Emphatic।' },
      { p:'It ___ his attitude that annoyed me.', o:['was','were','is','are'], a:'was', e:'Cleft.', b:'Cleft।' },
      { p:'What I want ___ peace.', o:['is','are','was','were'], a:'is', e:'Wh-cleft.', b:'Wh-cleft।' },
      { p:'What she said ___ true.', o:['was','were','is','Both A and C'], a:'is', e:'Wh-cleft.', b:'Wh-cleft।' },
      { p:'The reason ___ I left was personal.', o:['why','which','who','that'], a:'why', e:'Relative adverb.', b:'Relative adverb।' },
      { p:'The time ___ we met was summer.', o:['when','which','who','that'], a:'when', e:'Relative adverb.', b:'Relative adverb।' },
      { p:'The way ___ he talks annoys me.', o:['that','which','who','when'], a:'that', e:'Relative.', b:'Relative।' },
      { p:'He is the same man ___ I saw yesterday.', o:['that','which','who','whom'], a:'that', e:'Same + that.', b:'Same + that।' },
      { p:'It is high time we ___ action.', o:['take','took','will take','taking'], a:'took', e:'Subjunctive.', b:'Subjunctive।' },
      { p:'I would rather you ___ silent.', o:['keep','kept','keeping','keeps'], a:'kept', e:'Subjunctive.', b:'Subjunctive।' },
      { p:'Suppose he ___ late, what would you do?', o:['is','was','were','be'], a:'were', e:'Subjunctive.', b:'Subjunctive।' },
      { p:'Were I ___ rich, I would travel.', o:['to be','being','been','be'], a:'to be', e:'Inverted.', b:'Inverted।' },
      { p:'Had I ___ earlier, I would have met him.', o:['come','came','coming','comes'], a:'come', e:'Inverted.', b:'Inverted।' },
      { p:'Should it ___ tomorrow, we will cancel.', o:['rain','rains','rained','raining'], a:'rain', e:'Inverted.', b:'Inverted।' },
      { p:'Not until midnight ___ he arrive.', o:['did','does','do','done'], a:'did', e:'Inversion.', b:'Inversion।' },
      { p:'Hardly had I left ___ it started raining.', o:['when','than','that','then'], a:'when', e:'Hardly...when.', b:'Hardly...when।' },
      { p:'Scarcely had I sat down ___ the bell rang.', o:['when','than','that','then'], a:'when', e:'Scarcely...when.', b:'Scarcely...when।' },
      { p:'No sooner had she left ___ he came.', o:['than','when','that','then'], a:'than', e:'No sooner...than.', b:'No sooner...than।' },
      { p:'I have never ___ such a beautiful place.', o:['seen','saw','see','seeing'], a:'seen', e:'V3.', b:'V3।' },
      { p:'Rarely ___ such talent.', o:['have I seen','I have seen','I saw','did I saw'], a:'have I seen', e:'Inversion.', b:'Inversion।' },
      { p:'Little ___ that he would win.', o:['did I know','I knew','I know','do I know'], a:'did I know', e:'Inversion.', b:'Inversion।' },
      { p:'He ___ rather stay home than go out.', o:['would','should','could','might'], a:'would', e:'Preference.', b:'Preference।' },
      { p:'The earlier you come, ___ it is.', o:['the better','better','the best','best'], a:'the better', e:'Correlative.', b:'Correlative।' },
      { p:'No matter ___ hard he tries, he fails.', o:['how','what','which','who'], a:'how', e:'Concessive.', b:'Concessive।' },
      { p:'Whatever ___ , stay calm.', o:['happens','happen','happened','happening'], a:'happens', e:'Concessive.', b:'Concessive।' },
      { p:'It is I who ___ responsible.', o:['am','is','are','be'], a:'am', e:'Agreement.', b:'Agreement।' },
      { p:'It is you who ___ right.', o:['are','is','am','be'], a:'are', e:'Agreement.', b:'Agreement।' },
      { p:'It was they who ___ won.', o:['have','has','had','having'], a:'have', e:'Agreement.', b:'Agreement।' },
      { p:'He is said ___ very rich.', o:['to be','being','been','be'], a:'to be', e:'Passive reporting.', b:'Passive reporting।' },
      { p:'She is believed ___ the money.', o:['to steal','to have stolen','steal','stealing'], a:'to have stolen', e:'Perfect infinitive.', b:'Perfect infinitive।' },
      { p:'He seems ___ tired.', o:['to be','being','been','be'], a:'to be', e:'Seem + inf.', b:'Seem + inf।' },
      { p:'She appears ___ left.', o:['to have','having','have','has'], a:'to have', e:'Perfect infinitive.', b:'Perfect infinitive।' },
      { p:'He happened ___ there.', o:['to be','being','been','be'], a:'to be', e:'Happen + inf.', b:'Happen + inf।' },
    ],
  },
};

/* ============================================================
   PARAGRAPH BANK — 12 model paragraphs (SSC / HSC) + reading
   exercises. Each paragraph feeds the "Paragraphs" mode and the
   "Paragraph Reading" practice category (4 questions each).
   ============================================================ */
const PARAGRAPH_BANK = [
  {
    id: 'para-aim', title: 'Your Aim in Life', level: 'SSC',
    text: 'Every student should have a clear aim in life, because a life without an aim is like a ship without a rudder. Such a ship drifts here and there and never reaches the shore. My aim in life is to become a doctor. I have chosen this noble profession because I want to serve the poor and the sick people of my country. In our villages, many people cannot get proper treatment due to poverty. Some of them walk for miles to reach a hospital, and some never reach it at all. I have seen my own neighbours suffer for this reason, and it has touched my heart deeply. I want to stand beside such people and ease their suffering. A doctor can save a life, and there is no greater joy than that. To fulfil my aim, I study hard every day and try to do well in all my exams. I give special attention to science and mathematics, and I also read books on health to widen my knowledge. I never waste my time in idle gossip or aimless games. My parents and teachers encourage me, and their advice gives me strength. I know the road is long and difficult, and I may face many obstacles on the way. But I will not lose heart. With honesty, patience and hard work, I am sure I will achieve my goal one day. Then I will open a small clinic in my village and treat poor patients free of cost.',
    qs: [
      { p: 'Why does the writer want to become a doctor?', o: ['To serve the poor and the sick', 'To earn a lot of money', 'To travel abroad', 'To please his teachers'], a: 'To serve the poor and the sick', e: 'He wants to serve poor and sick people.', b: 'সে গরিব ও অসুস্থ মানুষের সেবা করতে চায়।' },
      { p: 'The word “noble” in the paragraph means ___.', o: ['honourable', 'costly', 'easy', 'ordinary'], a: 'honourable', e: 'Noble = honourable, worthy of respect.', b: 'Noble = মহৎ।' },
      { p: 'In “I study hard every day”, the tense is ___.', o: ['present simple', 'present continuous', 'past simple', 'future simple'], a: 'present simple', e: 'A daily habit → present simple.', b: 'দৈনন্দিন অভ্যাস → present simple।' },
      { p: 'A life without an aim is compared to ___.', o: ['a ship without a rudder', 'a bird without wings', 'a tree without leaves', 'a river without water'], a: 'a ship without a rudder', e: 'The first sentence uses this simile.', b: 'প্রথম বাক্যে এই তুলনা আছে।' },
    ],
  },
  {
    id: 'para-honesty', title: 'Honesty Is the Best Policy', level: 'SSC',
    text: 'Honesty means telling the truth and doing the right thing even when nobody is watching. It is one of the greatest virtues a man can have. An honest person is respected by everyone, while a liar loses the trust of others. A dishonest man may gain something for a short time, but sooner or later his lies are caught. There is a famous story about a shepherd boy. Once he cried “Wolf!” just for fun, and the villagers ran to help him. He laughed at them and enjoyed the joke. He did the same thing a second time, and again the villagers came running. When a real wolf came one day, the boy shouted for help, but nobody believed him. The wolf killed many of his sheep, and he lost everything. This story teaches us that a liar is not believed even when he speaks the truth. Honesty may sometimes bring a little loss, but it always brings peace of mind in the end. An honest student does not cheat in the exam, and an honest trader does not cheat his customers. Such people sleep well at night because their conscience is clear. Even small lies, if repeated, can turn into a bad habit that is hard to break. Therefore, we should be honest in our words and deeds from childhood. Parents and teachers should set an example for children by speaking the truth themselves. If we follow this simple rule, our society will become a better place to live in.',
    qs: [
      { p: 'Why did nobody help the shepherd boy when the real wolf came?', o: ['They had lost trust in him', 'They were busy', 'They were afraid of the wolf', 'They did not hear him'], a: 'They had lost trust in him', e: 'He had lied to them before, so they did not believe him.', b: 'আগে মিথ্যা বলায় কেউ তাকে বিশ্বাস করেনি।' },
      { p: 'The word “deeds” means ___.', o: ['actions', 'papers', 'dreams', 'words'], a: 'actions', e: 'Deeds = actions.', b: 'Deeds = কাজ।' },
      { p: 'The opposite of “honest” is ___.', o: ['dishonest', 'honestly', 'honesty', 'honour'], a: 'dishonest', e: 'The prefix dis- gives the opposite.', b: 'dis- যোগে বিপরীত শব্দ হয়।' },
      { p: 'According to the paragraph, honesty always brings ___.', o: ['peace of mind', 'a lot of money', 'fame', 'a big loss'], a: 'peace of mind', e: 'It always brings peace of mind in the end.', b: 'শেষে মনের শান্তি আসে।' },
    ],
  },
  {
    id: 'para-rainy', title: 'A Rainy Day', level: 'SSC',
    text: 'A rainy day is a day of heavy rainfall when the sky is covered with dark clouds. On such a day, the sun does not show its face and the whole world looks gloomy. Last Friday it rained from dawn to dusk. I woke up early in the morning to the sound of thunder, and soon the rain began to pour down. The roads of our town were flooded, and many people could not go to work. Water entered the lanes, and small children enjoyed sailing paper boats in it. The school was closed, so I stayed at home and enjoyed hot khichuri with fried eggs. My mother also made some crispy pakoras in the afternoon. I spent the rest of the day reading a story book beside the window and watching the rain. Outside, farmers were happy because the rain was good for their crops. The dry fields became green again, and the birds sang in the trees. However, the day was very hard for rickshaw pullers and day labourers, since they could not earn anything. Many poor families who lived in low-lying areas also suffered a great deal, as water entered their small huts. Some of them had to leave their homes and take shelter elsewhere. In the evening the rain stopped, and a cool breeze began to blow over the town. A rainy day, therefore, brings joy to some and sorrow to others. It reminds us that we should always help those who are in trouble.',
    qs: [
      { p: 'Why were the farmers happy?', o: ['The rain was good for their crops', 'The school was closed', 'They ate khichuri', 'The roads were flooded'], a: 'The rain was good for their crops', e: 'Rain is good for crops.', b: 'বৃষ্টি ফসলের জন্য ভালো।' },
      { p: 'The word “gloomy” means ___.', o: ['dark and sad', 'bright', 'noisy', 'crowded'], a: 'dark and sad', e: 'Gloomy = dark and dull.', b: 'Gloomy = অন্ধকার ও বিষণ্ণ।' },
      { p: '“From dawn to dusk” means ___.', o: ['from morning to evening', 'from noon to midnight', 'for one hour', 'all night long'], a: 'from morning to evening', e: 'Dawn = early morning; dusk = evening.', b: 'Dawn = ভোর, dusk = সন্ধ্যা।' },
      { p: 'Who suffered most on the rainy day?', o: ['Rickshaw pullers and day labourers', 'Teachers', 'Farmers', 'Students'], a: 'Rickshaw pullers and day labourers', e: 'They could not earn anything.', b: 'তারা কোনো আয় করতে পারেনি।' },
    ],
  },
  {
    id: 'para-time', title: 'The Importance of Time', level: 'SSC',
    text: 'Time is the most valuable thing in our life. Once it is gone, it never comes back, no matter how much money we spend. The wise proverb says, “Time and tide wait for none.” A student who wastes time cannot do well in the exam, and a farmer who sows seeds late gets a poor harvest. Even a king cannot call back a single moment that has passed. Successful people always make a daily routine and follow it strictly. They get up early, finish their work on time and do not put off today’s task until tomorrow. Great scientists and leaders of the world became great because they used every hour in a useful way. On the other hand, those who waste time in idle talk and aimless games often repent later. When the exam comes near, they run after books in a panic, but it is too late. Then they regret the days they have lost. We can use our time well if we plan our day carefully. We should give some hours to study, some to rest and some to play, and we should keep a little time for helping our family. We should also avoid spending too many hours on television and the mobile phone. Another proverb says that a stitch in time saves nine. Time lost in youth can never be made up in old age. So, we should learn the value of time from an early age and make good use of every moment.',
    qs: [
      { p: 'What does “Time and tide wait for none” teach us?', o: ['Time never waits for anyone', 'Tide is stronger than time', 'We should wait for the right time', 'Rivers never stop flowing'], a: 'Time never waits for anyone', e: 'It means time does not wait for any person.', b: 'সময় কারো জন্য অপেক্ষা করে না।' },
      { p: 'The phrasal verb “put off” means ___.', o: ['delay', 'finish', 'forget', 'start'], a: 'delay', e: 'Put off = delay.', b: 'Put off = পিছিয়ে দেওয়া।' },
      { p: 'The word “repent” means to ___.', o: ['feel sorry for what one did', 'feel proud', 'feel sleepy', 'feel angry'], a: 'feel sorry for what one did', e: 'Repent = feel regret.', b: 'Repent = অনুতপ্ত হওয়া।' },
      { p: 'Which sentence is true according to the paragraph?', o: ['A farmer who sows late gets a poor harvest.', 'Money can bring back lost time.', 'Idle talk makes people successful.', 'Time is less valuable than money.'], a: 'A farmer who sows late gets a poor harvest.', e: 'The paragraph says late sowing gives a poor harvest.', b: 'দেরিতে বীজ বুনলে ফলন কম হয়।' },
    ],
  },
  {
    id: 'para-mobile', title: 'Mobile Phone', level: 'SSC',
    text: 'The mobile phone is one of the most useful inventions of modern times. Not long ago, people had to write letters and wait for days to hear from their loved ones. Today, with a mobile phone, we can talk to our friends and relatives at any time and from any place. It also helps us to send messages, take photographs, listen to music and use the internet. Students can use it to look up the meaning of difficult words or to watch online lessons. A farmer can check the price of his crops, and a businessman can run his shop from a distance. Moreover, it is very helpful in an emergency, because we can call a doctor or the police within a moment. Many people can also send money to their family through a mobile phone without going to a bank. However, too much use of a mobile phone can be harmful. It wastes our valuable time, harms our eyes and keeps us away from family and friends. Many young people sit with their phones for hours and forget to talk to the people sitting next to them. Playing games late at night also spoils their sleep and their studies. Some people use phones to spread false news or to annoy others, which is a bad misuse of this device. A mobile phone is like a sharp knife; it can be useful or dangerous according to the way we use it. So, we should use this wonderful device wisely and never become its slave.',
    qs: [
      { p: 'How can a mobile phone help students?', o: ['By helping them look up words and watch online lessons', 'By doing their homework', 'By making exams easy', 'By replacing their teachers'], a: 'By helping them look up words and watch online lessons', e: 'The paragraph names these two uses.', b: 'অনুচ্ছেদে এই দুটি ব্যবহারের কথা আছে।' },
      { p: 'The word “emergency” means ___.', o: ['a sudden dangerous situation', 'a holiday', 'a party', 'a long journey'], a: 'a sudden dangerous situation', e: 'Emergency = urgent, dangerous situation.', b: 'Emergency = জরুরি অবস্থা।' },
      { p: 'In “too much use … can be harmful”, “harmful” is a/an ___.', o: ['adjective', 'noun', 'verb', 'adverb'], a: 'adjective', e: 'It describes the noun “use”.', b: 'এটি noun “use”-কে বর্ণনা করে।' },
      { p: 'What is the writer’s main advice?', o: ['Use the phone wisely', 'Never use a phone', 'Buy the newest phone', 'Use the phone all day'], a: 'Use the phone wisely', e: 'The last sentence advises wise use.', b: 'শেষ বাক্যে বুদ্ধিমানের মতো ব্যবহারের পরামর্শ আছে।' },
    ],
  },
  {
    id: 'para-pollution', title: 'Environmental Pollution', level: 'HSC',
    text: 'Environmental pollution is one of the greatest problems of our time. It means the contamination of air, water and soil by harmful substances. Smoke from factories and vehicles pollutes the air, while waste from mills is often thrown into rivers and makes the water unsafe. Farmers sometimes use too much chemical fertiliser, which poisons the soil and the water beneath it. In cities like Dhaka, dust and smoke cause serious breathing problems, especially for children and the elderly. Loud horns and machines also create noise pollution, which disturbs our sleep and harms our hearing. Cutting down trees without planting new ones makes the situation worse, because trees clean the air and give us oxygen. Plastic bags are another great danger. They block drains, cause water-logging in the rainy season and harm the fish and animals that swallow them. To control pollution, the government must enforce strict laws, and factories should install waste-treatment plants. Those who break the laws should be punished. At the same time, every citizen can help by planting trees, avoiding plastic bags and keeping the surroundings clean. Schools can teach children to love nature from an early age. Newspapers and television can also make people aware of the danger. Even small steps taken by millions of people can bring a big change. If we fail to act now, our rivers will die, our air will become poisonous and our cities will become unfit to live in. Future generations will have to pay a heavy price.',
    qs: [
      { p: 'What does environmental pollution mean here?', o: ['Contamination of air, water and soil', 'Growth of too many trees', 'Shortage of food', 'Increase in rainfall'], a: 'Contamination of air, water and soil', e: 'The definition is given at the start.', b: 'দ্বিতীয় বাক্যে এই সংজ্ঞা আছে।' },
      { p: 'The word “enforce” means ___.', o: ['make people obey', 'cancel', 'ignore', 'suggest'], a: 'make people obey', e: 'Enforce a law = make sure it is obeyed.', b: 'Enforce = কার্যকর করা।' },
      { p: 'Which is NOT mentioned as a way to reduce pollution?', o: ['Banning all vehicles', 'Planting trees', 'Avoiding plastic bags', 'Installing waste-treatment plants'], a: 'Banning all vehicles', e: 'The paragraph never suggests banning all vehicles.', b: 'সব যানবাহন বন্ধের কথা বলা হয়নি।' },
      { p: '“Future generations will have to pay a heavy price” means they will ___.', o: ['suffer because of our carelessness', 'become very rich', 'buy expensive things', 'pay only more taxes'], a: 'suffer because of our carelessness', e: 'The “price” is the harm we leave behind.', b: 'আমাদের অবহেলার ফল ভবিষ্যৎ প্রজন্ম ভোগ করবে।' },
    ],
  },
  {
    id: 'para-education', title: 'The Value of Education', level: 'HSC',
    text: 'Education is the backbone of a nation. It does not only mean passing examinations and getting certificates; it means building character and developing the mind. An educated person can think clearly, solve problems and take wise decisions. He knows his rights and duties, and he respects the rights of others. Education also helps a country to grow, because educated citizens work as doctors, engineers, teachers and scientists. A nation with many skilled people can produce more, earn more and live better. In Bangladesh, the number of literate people has increased over the years, but there is still much to be done, especially in remote villages. Many poor children leave school early to work and help their families. Some schools lack good teachers, books and clean toilets. The government and the society must work together to remove these problems. Girls, in particular, should be encouraged to go to school, since an educated mother raises an educated family. She can teach her children good manners and take better care of their health. True education also teaches us to be kind, honest and helpful to others. A man who has a degree but has no good character cannot be called truly educated. Therefore, students should study not only for marks but also to become good human beings. Libraries, science clubs and debates also help students learn outside the classroom. Teachers play a key role in this work. If every child gets quality education, our nation will move forward and take its rightful place in the world.',
    qs: [
      { p: 'Education is called the backbone of a nation because it ___.', o: ['supports the progress of the country', 'is very expensive', 'is only for the rich', 'is easy to get'], a: 'supports the progress of the country', e: 'A backbone is the main support.', b: 'Backbone = প্রধান অবলম্বন।' },
      { p: 'The word “remote” means ___.', o: ['far away from towns', 'very crowded', 'modern', 'rich'], a: 'far away from towns', e: 'Remote villages = distant villages.', b: 'Remote = দূরবর্তী।' },
      { p: 'The noun form of “literate” is ___.', o: ['literacy', 'literally', 'literary', 'literature'], a: 'literacy', e: 'Literate → literacy.', b: 'Literate-এর noun = literacy।' },
      { p: 'Why should girls be encouraged to go to school?', o: ['An educated mother raises an educated family', 'Girls are better than boys', 'Schools have no boys', 'It is a rule of the school'], a: 'An educated mother raises an educated family', e: 'The paragraph gives this reason.', b: 'অনুচ্ছেদে এই কারণ দেওয়া হয়েছে।' },
    ],
  },
  {
    id: 'para-digital', title: 'Digital Bangladesh', level: 'HSC',
    text: 'Digital Bangladesh is a vision of using modern technology in every sector of the country. It aims to make education, health care, banking and government services easier and faster through computers and the internet. In the past, people had to run from one office to another and wait for hours to get a simple service. Today, they can pay bills, apply for services and transfer money using their mobile phones, without standing in long queues. This saves time, money and effort, and it also reduces corruption. Students can attend online classes and search for information within seconds. Even students of remote villages can learn from the best teachers through the internet. Farmers can get advice about crops and weather through their phones, and patients can talk to doctors without travelling to the city. Moreover, technology has created new jobs for young people as freelancers and software developers. Many of them earn money from home by working for clients abroad. This brings valuable foreign money into the country. However, there are some problems too. Many people in villages still have no computer or good internet connection, and some do not know how to use technology. We must also protect our personal data and teach people to use technology safely. Cyber crime and the spread of false information are also growing risks that need strict control. Training programmes in schools and villages can help people learn computer skills. If this vision is carried out properly, our country will become smarter and more prosperous.',
    qs: [
      { p: 'What is Digital Bangladesh?', o: ['A vision of using modern technology in every sector', 'A new city', 'A computer company', 'A school for computers'], a: 'A vision of using modern technology in every sector', e: 'See the first sentence.', b: 'প্রথম বাক্য দেখো।' },
      { p: 'The word “prosperous” means ___.', o: ['successful and rich', 'poor', 'weak', 'quiet'], a: 'successful and rich', e: 'Prosperous = flourishing.', b: 'Prosperous = সমৃদ্ধ।' },
      { p: 'A “queue” is a ___.', o: ['line of waiting people', 'kind of bill', 'mobile phone', 'computer program'], a: 'line of waiting people', e: 'Queue = a line of people waiting.', b: 'Queue = সারি।' },
      { p: 'Which risk does the writer warn about?', o: ['Loss of personal data', 'Shortage of mobile phones', 'Too many schools', 'Poor roads'], a: 'Loss of personal data', e: 'We must protect our personal data.', b: 'ব্যক্তিগত তথ্য সুরক্ষার কথা বলা হয়েছে।' },
    ],
  },
  {
    id: 'para-bookfair', title: 'A Book Fair', level: 'SSC',
    text: 'The Ekushey Book Fair is the biggest book fair in Bangladesh. It is held every February in Dhaka, near the Bangla Academy and the Suhrawardy Udyan, in memory of the language martyrs of 1952. The whole month of February is a time of memory and pride for the Bengali nation, and the book fair adds to its joy. Last year I visited the fair with my friends. We went there on a Friday afternoon, and the place was already crowded. The place was full of colourful stalls, and thousands of book lovers were moving from one stall to another. Many families had come with their children, and the children were choosing picture books with great excitement. Publishers had arranged new books on novels, poems, history and science. Some stalls offered a discount, so many visitors were buying armfuls of books. I bought a collection of poems and two story books for children. My friends bought books on science and cookery. Writers were also present at some stalls and signed copies for their readers. I even saw a famous poet talking to a group of young readers with a smile. After some time, we sat on the grass and had tea and snacks. I felt proud to see so many people showing love for books and the Bengali language. I returned home tired but happy. A book fair encourages the reading habit and brings writers and readers closer together. It also reminds us of the sacrifice made for our mother tongue.',
    qs: [
      { p: 'When is the Ekushey Book Fair held?', o: ['Every February', 'Every December', 'Every April', 'Every July'], a: 'Every February', e: 'It is held every February.', b: 'প্রতি ফেব্রুয়ারিতে অনুষ্ঠিত হয়।' },
      { p: 'The fair is held in memory of ___.', o: ['the language martyrs of 1952', 'the flood of 1988', 'the first Bengali poet', 'a famous publisher'], a: 'the language martyrs of 1952', e: 'See the second sentence.', b: 'দ্বিতীয় বাক্য দেখো।' },
      { p: 'The word “stall” means ___.', o: ['a small shop or stand', 'a big hall', 'a library card', 'a bus'], a: 'a small shop or stand', e: 'Stall = a small stand for selling things.', b: 'Stall = স্টল/ছোট দোকান।' },
      { p: 'According to the writer, a book fair ___.', o: ['encourages the reading habit', 'sells only school books', 'is held only for writers', 'closes in a day'], a: 'encourages the reading habit', e: 'The concluding part says this.', b: 'শেষ বাক্যে এটি বলা আছে।' },
    ],
  },
  {
    id: 'para-exercise', title: 'Physical Exercise', level: 'SSC',
    text: 'Physical exercise is essential for a healthy life. A person who exercises regularly stays strong, active and cheerful. Exercise improves blood circulation, strengthens the muscles and keeps the heart healthy. It also reduces stress and helps us to sleep well at night. A man who exercises every day seldom falls ill, and even if he does, he recovers quickly. Walking, running, swimming and playing football are some of the best forms of exercise. Walking needs no money or equipment, so anyone can do it, and a morning walk in fresh air is especially good. Doctors advise us to exercise for at least thirty minutes every day. Old people can walk slowly, while the young can run or play games. Children grow taller and stronger when they play outdoors with their friends. Games also teach us teamwork and discipline. Unfortunately, many students today spend most of their time in front of screens and neglect outdoor activities. They sit for hours with their phones or computers and eat too much junk food. As a result, they become lazy and fall ill easily. Some of them even suffer from weak eyesight and back pain at a young age. Regular exercise also builds self-confidence and helps us face difficulties in life. Yoga and simple stretching at home are also helpful for those who cannot go outside. Schools should therefore give more time to games and sports. We should make exercise a part of our daily routine because a healthy body leads to a healthy mind.',
    qs: [
      { p: 'How long do doctors advise us to exercise every day?', o: ['At least thirty minutes', 'Five minutes', 'Three hours', 'One hour on holidays only'], a: 'At least thirty minutes', e: 'Doctors advise at least thirty minutes daily.', b: 'ডাক্তাররা প্রতিদিন অন্তত ৩০ মিনিট ব্যায়ামের পরামর্শ দেন।' },
      { p: 'The word “neglect” means ___.', o: ['pay no attention to', 'take care of', 'enjoy', 'praise'], a: 'pay no attention to', e: 'Neglect = ignore or fail to care for.', b: 'Neglect = অবহেলা করা।' },
      { p: 'Which is NOT a benefit of exercise mentioned here?', o: ['Higher marks in every subject', 'Better sleep', 'Less stress', 'A healthy heart'], a: 'Higher marks in every subject', e: 'The paragraph never promises higher marks.', b: 'নম্বর বাড়ার কথা বলা হয়নি।' },
      { p: 'Why do many students fall ill easily?', o: ['They neglect outdoor activities and spend time on screens', 'They eat too little', 'They study too much at night', 'They walk a lot'], a: 'They neglect outdoor activities and spend time on screens', e: 'See the “Unfortunately…” sentence.', b: '“Unfortunately…” বাক্যটি দেখো।' },
    ],
  },
  {
    id: 'para-early', title: 'Early Rising', level: 'SSC',
    text: 'Early rising means getting up from bed early in the morning. It is a very good habit that makes a person healthy, wealthy and wise. The morning air is fresh and pure, and a walk in it keeps our body fit. At that hour the world is calm and quiet, and the birds begin to sing. The sky turns red in the east, and the sight of the rising sun fills our mind with joy. An early riser gets plenty of time to prepare lessons and finish household tasks without hurry. His mind is fresh, so he can learn things quickly and remember them for a long time. A well-known proverb praises this habit. On the contrary, those who get up late waste the best part of the day and feel lazy and dull. They often reach school or office late and have to run in a hurry. Their work remains unfinished, and they are scolded by teachers or bosses. Great and successful people of all ages have followed this habit throughout their lives. I try to wake up at five o’clock every morning. After prayer and a short walk, I sit down to study. I finish my hardest lessons before breakfast, when my mind is clear. Then I go to school without any worry. This habit has helped me a lot in my studies, and I advise everyone to follow it. If we get up early from our childhood, it will become a part of our nature.',
    qs: [
      { p: 'What are the benefits of early rising mentioned here?', o: ['Health, wealth and wisdom', 'Fame and power', 'Long sleep', 'More time for games only'], a: 'Health, wealth and wisdom', e: 'See the second sentence.', b: 'দ্বিতীয় বাক্য দেখো।' },
      { p: 'The word “pure” means ___.', o: ['clean', 'dirty', 'hot', 'noisy'], a: 'clean', e: 'Pure air = clean air.', b: 'Pure = বিশুদ্ধ।' },
      { p: '“On the contrary” introduces ___.', o: ['an opposite idea', 'an example', 'a result', 'a conclusion'], a: 'an opposite idea', e: 'It contrasts with the previous idea.', b: 'আগের ধারণার বিপরীত ধারণা আনে।' },
      { p: 'At what time does the writer wake up?', o: ['At five o’clock', 'At six o’clock', 'At seven o’clock', 'At four o’clock'], a: 'At five o’clock', e: 'See “I try to wake up at five o’clock”.', b: '“five o’clock” অংশটি দেখো।' },
    ],
  },
  {
    id: 'para-social', title: 'Social Media', level: 'HSC',
    text: 'Social media has become a major part of our daily life. Platforms such as Facebook and YouTube allow us to share photos, ideas and news with people across the world within seconds. A student living in a village can now watch lessons given by teachers of another country. Families who live far from each other can see and talk to one another every day. Students can join online study groups, and small businesses can reach new customers at a low cost. Many young women in our country run small online shops from their homes and earn a good income. Social media also helps people raise money quickly for the sick and the poor. However, social media has its dark side too. False news spreads very quickly and can mislead thousands of people. Sometimes a single rumour on the internet creates fear and even leads to violence. Many young users become addicted and spend hours scrolling instead of studying or sleeping. They compare their lives with others and feel unhappy. Cyberbullying also hurts the feelings of many teenagers, and some of them are afraid to go to school. To enjoy its benefits, we must check the truth of every piece of news before sharing it and set a time limit for using it. Teachers can also guide students to use these platforms for learning. Parents should also talk to their children about the safe use of the internet. Used wisely, social media is a blessing; used carelessly, it is a curse.',
    qs: [
      { p: 'How can small businesses benefit from social media?', o: ['They can reach new customers at a low cost', 'They can avoid all taxes', 'They can stop advertising', 'They can close their shops'], a: 'They can reach new customers at a low cost', e: 'The paragraph says they reach customers at a low cost.', b: 'কম খরচে নতুন ক্রেতার কাছে পৌঁছানো যায়।' },
      { p: 'The word “addicted” means ___.', o: ['unable to stop doing something', 'very intelligent', 'very busy', 'careful'], a: 'unable to stop doing something', e: 'Addicted = dependent on a habit.', b: 'Addicted = আসক্ত।' },
      { p: 'Which sentence best states the writer’s view?', o: ['Social media is useful if used wisely', 'Social media is completely useless', 'Social media should be banned', 'Social media is only for teenagers'], a: 'Social media is useful if used wisely', e: 'The last sentence sums up the view.', b: 'শেষ বাক্যে মূল মত আছে।' },
      { p: 'The word “mislead” means to ___.', o: ['give a wrong idea to someone', 'guide correctly', 'teach well', 'warn in time'], a: 'give a wrong idea to someone', e: 'Mislead = lead in a wrong direction.', b: 'Mislead = ভুল পথে চালিত করা।' },
    ],
  },
];

const PARAGRAPH_QUESTIONS = PARAGRAPH_BANK.flatMap((para) =>
  para.qs.map((q) => ({ ...q, ref: para.id }))
);

QUESTION_BANK.paragraphs = {
  name: 'Paragraph Reading', icon: 'book', class: 'all',
  lesson: {
    rules: [
      'Read the whole paragraph once for the main idea <code>before</code> you look at the questions.',
      'Underline the <code>keywords</code> in the question, then find them in the text.',
      'For vocabulary questions, use the sentences around the word to guess its meaning.',
      'Beware of options that are true in real life but are <code>not mentioned</code> in the paragraph.',
      'A good paragraph has a topic sentence, supporting sentences and a concluding sentence.',
    ],
    examples: [
      '<strong>Topic sentence:</strong> Time is the most valuable thing in our life.',
      '<strong>Supporting sentence:</strong> A student who wastes time cannot do well in the exam.',
      '<strong>Concluding sentence:</strong> So, we should make good use of every moment.',
    ],
    bangla: 'আগে পুরো paragraph একবার পড়ো, তারপর প্রশ্নের keyword টেক্সটে খুঁজে নাও। যা paragraph-এ নেই, তা উত্তর নয়।',
  },
  questions: PARAGRAPH_QUESTIONS,
};

/* ============================================================
   STORY BANK — 15 short stories (~150 words each) with a moral
   and 3 reading questions each. Feeds the "Stories" mode and the
   "Story Reading" practice category.
   ============================================================ */
const STORY_BANK = [
  {
    id: 'story-crow', title: 'The Thirsty Crow',
    moral: 'Where there is a will, there is a way.', moralBn: 'যেখানে ইচ্ছা, সেখানেই উপায়।',
    text: 'One hot summer day, a crow was flying over a dry field. He was very thirsty, but he could not find a single drop of water anywhere. He flew for miles under the burning sun, and his wings began to ache. At last he saw a pot lying under a tree. He sat on its edge and looked inside. There was a little water at the bottom, but his beak could not reach it. The crow was tired and sad, yet he did not give up. He looked around and saw many small stones on the ground. A bright idea came to his mind. He picked up the stones one by one and dropped them into the pot. Slowly, the water began to rise. After some time it came up to the top. The crow drank it happily and thanked his clever mind. Then he flew away with fresh strength.',
    qs: [
      { p: 'Why could the crow not drink the water at first?', o: ['His beak could not reach it', 'The water was dirty', 'The pot was covered', 'He was not thirsty'], a: 'His beak could not reach it', e: 'There was too little water at the bottom.', b: 'পাত্রের তলায় পানি কম ছিল।' },
      { p: 'The phrase “give up” means ___.', o: ['stop trying', 'start again', 'fly away', 'sit down'], a: 'stop trying', e: 'Give up = stop trying.', b: 'Give up = হাল ছেড়ে দেওয়া।' },
      { p: 'How did the crow make the water rise?', o: ['By dropping stones into the pot', 'By breaking the pot', 'By pushing the pot over', 'By calling other crows'], a: 'By dropping stones into the pot', e: 'The stones pushed the water up.', b: 'পাথর ফেলায় পানি ওপরে উঠল।' },
    ],
  },
  {
    id: 'story-hare', title: 'The Hare and the Tortoise',
    moral: 'Slow and steady wins the race.', moralBn: 'ধীরে ও স্থির থেকে চললে জয় আসে।',
    text: 'A hare was very proud of his speed. He often laughed at a slow tortoise and called him lazy. One day the tortoise said, “Let us have a race.” The hare laughed loudly and agreed. He was sure of an easy win. The animals of the forest gathered to watch. At the start, the hare ran like the wind and soon left the tortoise far behind. He looked back and saw nothing of his rival. “I have plenty of time,” he thought, and lay down under a tree for a short sleep. The tortoise kept walking slowly and steadily without stopping even once. When the hare woke up, the sun was low in the sky. He ran as fast as he could, but it was too late. The tortoise was already crossing the finishing line, and all the animals were cheering for him. The hare hung his head in shame.',
    qs: [
      { p: 'Why did the hare lose the race?', o: ['He slept and became careless', 'He fell into a ditch', 'He did not know the way', 'He was ill'], a: 'He slept and became careless', e: 'He thought he had plenty of time and slept.', b: 'সে ভেবেছিল হাতে অনেক সময় আছে, তাই ঘুমিয়ে পড়ল।' },
      { p: 'The word “steadily” means ___.', o: ['without stopping or changing pace', 'very fast', 'with great noise', 'with fear'], a: 'without stopping or changing pace', e: 'Steadily = regularly, without a break.', b: 'Steadily = নিয়মিত, না থেমে।' },
      { p: 'What did the animals do when the tortoise won?', o: ['They cheered for him', 'They laughed at him', 'They went home', 'They gave him food'], a: 'They cheered for him', e: 'All the animals were cheering.', b: 'সব প্রাণী তাকে উৎসাহ দিচ্ছিল।' },
    ],
  },
  {
    id: 'story-dog', title: 'The Greedy Dog',
    moral: 'Greed brings loss.', moralBn: 'লোভে ক্ষতি হয়।',
    text: 'A hungry dog found a big piece of meat near a butcher’s shop. He took it in his mouth and ran away happily. He wanted to eat it in a quiet place. His tail wagged with joy as he trotted along quickly. On the way, he had to cross a narrow wooden bridge over a stream. As he walked across, he looked down and saw another dog in the water. That dog also had a piece of meat in his mouth, and it looked even bigger. The greedy dog wanted both pieces. He barked angrily at the dog in the water to frighten him. But as soon as he opened his mouth, the meat fell into the stream and sank at once. The other dog disappeared too. He had seen only his own reflection in the water. Now the poor dog had nothing, and he went home hungry and sorry.',
    qs: [
      { p: 'Why did the dog bark at the dog in the water?', o: ['He wanted the other piece of meat too', 'He was afraid of the water', 'He wanted to play', 'He was calling his master'], a: 'He wanted the other piece of meat too', e: 'He was greedy for both pieces.', b: 'সে দুটি টুকরোই চেয়েছিল।' },
      { p: 'The word “greedy” means ___.', o: ['wanting more than one needs', 'very kind', 'very weak', 'very sleepy'], a: 'wanting more than one needs', e: 'Greedy = wanting too much.', b: 'Greedy = লোভী।' },
      { p: 'The “other dog” in the water was really ___.', o: ['his own reflection', 'a friend', 'a puppy', 'a stranger'], a: 'his own reflection', e: 'He saw only his own reflection.', b: 'সে নিজের প্রতিবিম্ব দেখেছিল।' },
    ],
  },
  {
    id: 'story-fox', title: 'The Fox and the Grapes',
    moral: 'It is easy to despise what we cannot get.', moralBn: 'যা পাওয়া যায় না, তা তুচ্ছ করা সহজ।',
    text: 'One summer afternoon, a hungry fox was walking through a farm. The sun was hot, and he had not eaten since morning. He saw a bunch of ripe, juicy grapes hanging from a high vine. His mouth began to water. “What a delicious lunch they will make,” he said. He jumped as high as he could, but the grapes were too far above him. He tried again and again. Each time he fell back on the ground with a thud. He ran, he jumped, and he even tried to climb the wall, but nothing worked. At last he was tired and out of breath. He looked at the grapes once more and turned away. “I do not want them anyway,” he said proudly. “They are surely sour, and only a fool would eat them.” Then he walked away with his nose in the air, pretending that he did not care.',
    qs: [
      { p: 'Why could the fox not get the grapes?', o: ['They hung too high', 'They were not ripe', 'The farmer was watching', 'He was not hungry'], a: 'They hung too high', e: 'The grapes were too far above him.', b: 'আঙুর অনেক উঁচুতে ছিল।' },
      { p: 'The word “ripe” means ___.', o: ['fully grown and ready to eat', 'rotten', 'very small', 'still green'], a: 'fully grown and ready to eat', e: 'Ripe fruit is ready to eat.', b: 'Ripe = পাকা।' },
      { p: 'Why did the fox say the grapes were sour?', o: ['He wanted to hide his failure', 'He had tasted them', 'Someone told him so', 'They smelled bad'], a: 'He wanted to hide his failure', e: 'He pretended that he did not care.', b: 'সে ব্যর্থতা লুকাতে চেয়েছিল।' },
    ],
  },
  {
    id: 'story-lion', title: 'The Lion and the Mouse',
    moral: 'Even the small can help the great.', moralBn: 'ছোটরাও বড়দের উপকার করতে পারে।',
    text: 'A lion was sleeping under a big tree when a little mouse ran over his body. The lion woke up in anger and caught the mouse with his huge paw. The mouse shook with fear. “Please let me go, O King,” cried the mouse. “One day I will help you.” The lion laughed at the idea, but he let the mouse go. A few days later, hunters caught the lion in a strong net. He roared loudly and tried to break free, but he could not. The mouse heard the roar and ran to the spot at once. He began to bite the ropes of the net with his sharp teeth. Soon the ropes broke, and the lion was free. “Thank you, little friend,” said the lion with a smile. “I was wrong to laugh at you. Now I know that even the smallest creature can be a great help.”',
    qs: [
      { p: 'Why did the lion let the mouse go?', o: ['The mouse promised to help him one day', 'The mouse was too big to eat', 'He was not hungry', 'The mouse gave him food'], a: 'The mouse promised to help him one day', e: 'The mouse said, “One day I will help you.”', b: 'ইঁদুর বলেছিল সে একদিন সাহায্য করবে।' },
      { p: 'The word “roared” means ___.', o: ['made a loud, deep sound', 'whispered', 'ran away', 'jumped'], a: 'made a loud, deep sound', e: 'Lions roar.', b: 'Roar = গর্জন করা।' },
      { p: 'How did the mouse free the lion?', o: ['By biting the ropes of the net', 'By calling the hunters', 'By digging a hole', 'By pushing the net away'], a: 'By biting the ropes of the net', e: 'He bit the ropes with his sharp teeth.', b: 'সে ধারালো দাঁত দিয়ে দড়ি কাটল।' },
    ],
  },
  {
    id: 'story-woodcutter', title: 'The Honest Woodcutter',
    moral: 'Honesty is the best policy.', moralBn: 'সততাই সর্বোত্তম পন্থা।',
    text: 'A poor woodcutter was cutting wood on the bank of a river when his axe slipped from his hand and fell into the deep water. He sat down and began to weep, for it was his only axe. Without it, he could not earn any bread for his poor and hungry children. Suddenly a fairy rose from the river. She asked about his trouble and then dived into the water. She came back with a golden axe. “Is this yours?” she asked. “No,” said the woodcutter. She dived again and brought a silver axe. “No, that is not mine either,” he replied. The third time she brought his own iron axe. “Yes, this is mine,” he said happily. The fairy was pleased with his honesty. “You are a truthful man,” she said. “Take all three axes as your reward.” The woodcutter thanked her and went home as a rich man.',
    qs: [
      { p: 'Why was the woodcutter weeping?', o: ['He lost his only axe', 'He was hungry', 'He was lost', 'He was ill'], a: 'He lost his only axe', e: 'His axe fell into the river.', b: 'তার একমাত্র কুড়াল নদীতে পড়ে গিয়েছিল।' },
      { p: 'The word “weep” means ___.', o: ['cry', 'laugh', 'sleep', 'shout'], a: 'cry', e: 'Weep = cry.', b: 'Weep = কাঁদা।' },
      { p: 'Why did the fairy give him all three axes?', o: ['She was pleased with his honesty', 'He asked for them', 'He paid her', 'She wanted to test another man'], a: 'She was pleased with his honesty', e: 'She rewarded his truthfulness.', b: 'সে তার সততায় খুশি হয়েছিল।' },
    ],
  },
  {
    id: 'story-ant', title: 'The Ant and the Grasshopper',
    moral: 'Work today, rest tomorrow.', moralBn: 'আজ পরিশ্রম করো, কাল বিশ্রাম নাও।',
    text: 'All summer long, a grasshopper sang and danced in the sunny fields. A little ant worked hard nearby, carrying grains of corn to her nest. She went busily back and forth, though the sun was hot and the load heavy. “Why do you work so hard?” asked the grasshopper. “Come and sing with me.” The ant replied, “I am storing food for the winter. You should do the same.” The grasshopper laughed and said, “Winter is far away. Let us enjoy today.” Soon the cold winter came, and snow covered the fields. The grasshopper could find no food anywhere. He was cold, hungry and weak. At last he went to the ant’s house and begged for a little food. The ant opened her door kindly and gave him some corn. “Next summer,” she said gently, “remember to work first and play later.” The grasshopper felt ashamed and promised to change.',
    qs: [
      { p: 'What was the ant doing all summer?', o: ['Storing food for the winter', 'Singing and dancing', 'Sleeping in her nest', 'Playing in the fields'], a: 'Storing food for the winter', e: 'She carried grains of corn to her nest.', b: 'সে শীতের জন্য খাবার জমাচ্ছিল।' },
      { p: 'The verb “store” means ___.', o: ['keep for later use', 'throw away', 'sell', 'eat at once'], a: 'keep for later use', e: 'Store = save for later.', b: 'Store = জমা করা।' },
      { p: 'What did the grasshopper learn?', o: ['To work first and play later', 'To sing louder', 'To fear the ant', 'To leave the fields'], a: 'To work first and play later', e: 'The ant advised him this.', b: 'আগে কাজ, পরে খেলা।' },
    ],
  },
  {
    id: 'story-goose', title: 'The Goose with the Golden Eggs',
    moral: 'Greed destroys everything.', moralBn: 'লোভে সর্বনাশ হয়।',
    text: 'A poor farmer had a goose that laid one golden egg every day. He sold the eggs in the market and soon became rich. He bought a big house, fine clothes and a lot of land for his wife and children. But as he grew richer, he also grew greedier. “Why should I wait for one egg a day?” he thought. “If I cut open the goose, I will find all the gold inside at once.” His wife told him not to be foolish, but he would not listen. He took a knife and killed the goose. To his great surprise, there was no gold inside. It was an ordinary goose like any other. The farmer sat down and wept in sorrow. He had lost his goose and his daily gold, all because of his greed. From that day on, he lived in poverty and often remembered his foolish mistake.',
    qs: [
      { p: 'How often did the goose lay a golden egg?', o: ['Every day', 'Every week', 'Every month', 'Once a year'], a: 'Every day', e: 'It laid one golden egg every day.', b: 'সে প্রতিদিন একটি সোনার ডিম পাড়ত।' },
      { p: 'The word “ordinary” means ___.', o: ['normal, not special', 'golden', 'expensive', 'dangerous'], a: 'normal, not special', e: 'Ordinary = usual.', b: 'Ordinary = সাধারণ।' },
      { p: 'Why did the farmer kill the goose?', o: ['He wanted all the gold at once', 'He was angry with it', 'His wife told him to', 'He needed meat'], a: 'He wanted all the gold at once', e: 'He thought all the gold was inside.', b: 'সে একবারে সব সোনা চেয়েছিল।' },
    ],
  },
  {
    id: 'story-bundle', title: 'Unity Is Strength',
    moral: 'Unity is strength.', moralBn: 'একতাই বল।',
    text: 'An old farmer had four sons who quarrelled all the time. He was very sad to see them fight with one another. Their neighbours often laughed at the poor family, and the old man felt great shame because of it. One day he called them to his bedside and gave them a bundle of sticks. “Break this bundle,” he said. Each son tried with all his strength, but nobody could break it. Then the father untied the bundle and gave one stick to each son. “Now break them,” he said. The sons broke the sticks easily with their fingers. The old man smiled. “My sons,” he said, “when you are together like the bundle, no enemy can harm you. But when you are divided, anyone can break you easily.” The sons felt ashamed of their quarrels. From that day they lived in peace and helped each other in every need.',
    qs: [
      { p: 'Why did the farmer give his sons a bundle of sticks?', o: ['To teach them the value of unity', 'To make a fire', 'To sell them', 'To test only their strength'], a: 'To teach them the value of unity', e: 'He wanted them to stop quarrelling.', b: 'সে তাদের ঝগড়া থামাতে চেয়েছিল।' },
      { p: 'The word “quarrel” means ___.', o: ['fight with words', 'play together', 'sing', 'work'], a: 'fight with words', e: 'Quarrel = angry argument.', b: 'Quarrel = ঝগড়া।' },
      { p: 'What happened when the sticks were separated?', o: ['They were broken easily', 'Nobody could break them', 'They caught fire', 'They were lost'], a: 'They were broken easily', e: 'Each son broke a single stick easily.', b: 'একটি করে কাঠি সহজেই ভাঙা গেল।' },
    ],
  },
  {
    id: 'story-treasure', title: 'The Farmer and His Sons',
    moral: 'Hard work is the real treasure.', moralBn: 'কঠোর পরিশ্রমই আসল সম্পদ।',
    text: 'A farmer had three sons who were lazy and did not like to work in the fields. They slept till noon and spent most of their days in idle talk and useless games. When he became old and weak, he called them and said, “My sons, there is a great treasure buried in our field. Dig for it after I am gone.” Soon after, the old man died. The sons took spades and dug up the whole field, but they found no treasure. They felt disappointed. However, the field was now soft and ready for sowing, so they planted wheat in it. That year the crop was excellent, and they earned a lot of money by selling it. Then they understood their father’s meaning. The real treasure was hard work. From that day the sons worked in the field every year and lived happily, and they thanked their wise father.',
    qs: [
      { p: 'What did the sons find when they dug the field?', o: ['No treasure', 'Gold coins', 'A box of silver', 'A map'], a: 'No treasure', e: 'They found no treasure.', b: 'তারা কোনো গুপ্তধন পেল না।' },
      { p: 'The word “treasure” means ___.', o: ['a collection of valuable things', 'a farm tool', 'a kind of crop', 'a village'], a: 'a collection of valuable things', e: 'Treasure = riches.', b: 'Treasure = ধনসম্পদ।' },
      { p: 'What was the real treasure, according to the story?', o: ['Hard work', 'Silver', 'The father’s house', 'A hidden well'], a: 'Hard work', e: 'The father meant hard work.', b: 'বাবা পরিশ্রমকেই বুঝিয়েছিলেন।' },
    ],
  },
  {
    id: 'story-mice', title: 'The Town Mouse and the Country Mouse',
    moral: 'A simple life in peace is better than a rich life in fear.', moralBn: 'ভয়ের মধ্যে ধনী জীবনের চেয়ে শান্তিতে সরল জীবন ভালো।',
    text: 'A country mouse once invited his friend from the town to dinner. He gave him simple food like corn, nuts and roots. The town mouse ate a little and said, “My dear friend, this food is poor. Come with me to the town, and I will show you a better life.” The country mouse agreed. In the town, they entered a big house with a rich dining room. There were cakes, cheese and fruits on the table. But just as they began to eat, a cat jumped into the room. Its eyes were bright and its claws were sharp. The mice ran for their lives and hid in a small hole. The country mouse trembled with fear. “Goodbye, friend,” he said when the cat left. “Your food is rich, but your life is full of danger. I prefer my simple food in peace.” Then he went back to his village.',
    qs: [
      { p: 'What food did the country mouse offer his friend?', o: ['Corn, nuts and roots', 'Cakes and cheese', 'Fish and rice', 'Bread and jam'], a: 'Corn, nuts and roots', e: 'He gave simple food.', b: 'সে সাধারণ খাবার দিয়েছিল।' },
      { p: 'The word “tremble” means ___.', o: ['shake with fear', 'sleep deeply', 'jump with joy', 'shout loudly'], a: 'shake with fear', e: 'Tremble = shake.', b: 'Tremble = কাঁপা।' },
      { p: 'Why did the country mouse return to his village?', o: ['Town life was full of danger', 'He disliked cheese', 'He lost his way', 'His friend told him to'], a: 'Town life was full of danger', e: 'The cat frightened him.', b: 'বিড়ালের ভয়ে সে ফিরে গেল।' },
    ],
  },
  {
    id: 'story-monkey', title: 'The Monkey and the Crocodile',
    moral: 'Presence of mind saves us from danger.', moralBn: 'উপস্থিত বুদ্ধি বিপদ থেকে রক্ষা করে।',
    text: 'A clever monkey lived on a rose-apple tree on the bank of a river. A crocodile became his friend, and the monkey gave him sweet fruits every day. The crocodile took some fruits to his wife. She loved them and said, “If the fruits are so sweet, the monkey’s heart must be sweeter. Bring it to me.” The crocodile was sad, but he obeyed his wife. He invited the monkey to ride on his back and visit his home. In the middle of the river, he told the monkey his plan. The monkey was frightened but still kept calm. “Oh, my friend,” he said, “why did you not tell me earlier? I have left my heart on the tree. Take me back, and I will bring it.” The foolish crocodile swam back. The monkey leapt onto the tree and laughed. “Foolish creature,” he cried, “no one lives without a heart!”',
    qs: [
      { p: 'What did the crocodile’s wife want?', o: ['The monkey’s heart', 'More fruits', 'A new house', 'The tree'], a: 'The monkey’s heart', e: 'She asked for the monkey’s heart.', b: 'সে বানরের হৃদয় চেয়েছিল।' },
      { p: 'The phrase “kept calm” means ___.', o: ['did not panic', 'became angry', 'fell asleep', 'ran away'], a: 'did not panic', e: 'Calm = peaceful, not afraid.', b: 'Kept calm = শান্ত থাকা।' },
      { p: 'How did the monkey escape?', o: ['By saying his heart was left on the tree', 'By jumping into the river', 'By fighting the crocodile', 'By calling for help'], a: 'By saying his heart was left on the tree', e: 'He tricked the crocodile cleverly.', b: 'সে বুদ্ধি করে কৌশল করল।' },
    ],
  },
  {
    id: 'story-wind', title: 'The Wind and the Sun',
    moral: 'Kindness is stronger than force.', moralBn: 'শক্তির চেয়ে দয়া বেশি শক্তিশালী।',
    text: 'The Wind and the Sun once argued about who was stronger. Each one boasted about his great power, and neither would listen to the other. “Let us test our power,” said the Sun. “See that traveller walking on the road? Whoever can make him take off his coat is the stronger.” The Wind agreed and began to blow with all his force. He blew harder and harder, but the traveller only held his coat tighter and walked on. At last the Wind gave up. Then the Sun came out from behind a cloud and shone with a gentle warmth. The traveller felt the heat and soon began to sweat. In a short time, he took off his coat and sat down under a tree to rest. The traveller smiled and enjoyed the cool shade. The Wind had to admit defeat. The Sun had won not by force but by kindness.',
    qs: [
      { p: 'What was the contest about?', o: ['Making the traveller take off his coat', 'Crossing a river', 'Moving a mountain', 'Reaching the sky first'], a: 'Making the traveller take off his coat', e: 'The one who succeeded was stronger.', b: 'যে কোট খোলাতে পারবে সে শক্তিশালী।' },
      { p: 'The word “admit” means ___.', o: ['accept that something is true', 'refuse', 'forget', 'hide'], a: 'accept that something is true', e: 'Admit defeat = accept that one lost.', b: 'Admit = স্বীকার করা।' },
      { p: 'Why did the traveller hold his coat tighter?', o: ['The Wind blew harder', 'He wanted to sell it', 'He was afraid of the Sun', 'It began to rain'], a: 'The Wind blew harder', e: 'Stronger wind made him hold on.', b: 'বাতাস জোরে বইছিল।' },
    ],
  },
  {
    id: 'story-spider', title: 'The King and the Spider',
    moral: 'If at first you do not succeed, try, try again.', moralBn: 'বারবার চেষ্টা করলে সফলতা আসে।',
    text: 'A king once lost a great battle and hid in a dark cave. He was tired, hungry and ready to give up all hope. Enemy soldiers were searching the hills, and he dared not light a fire. As he lay on the ground, he saw a spider trying to climb up the wall to its web. The spider fell down again and again, but it never gave up. It tried six times and failed each time. The king watched it with wonder. “If it tries once more, will it succeed?” he thought. On the seventh try, the spider reached its web safely. The king jumped up with new courage. “If a tiny spider can try so many times, why can’t I?” he said. He gathered his soldiers, made a new plan and fought again. This time he won back his kingdom, and he always remembered the lesson of the spider.',
    qs: [
      { p: 'How many times did the spider fail before it succeeded?', o: ['Six times', 'Three times', 'Ten times', 'Once'], a: 'Six times', e: 'It succeeded on the seventh try.', b: 'সপ্তম চেষ্টায় সে সফল হলো।' },
      { p: 'The word “courage” means ___.', o: ['bravery', 'fear', 'laziness', 'anger'], a: 'bravery', e: 'Courage = bravery.', b: 'Courage = সাহস।' },
      { p: 'What did the king do after watching the spider?', o: ['He made a new plan and fought again', 'He left the country', 'He went to sleep', 'He asked for peace'], a: 'He made a new plan and fought again', e: 'He gathered his soldiers.', b: 'সে সৈন্য জড়ো করে আবার যুদ্ধ করল।' },
    ],
  },
  {
    id: 'story-elephant', title: 'The Blind Men and the Elephant',
    moral: 'Do not judge the whole from one part.', moralBn: 'একটি অংশ দেখে পুরোটার বিচার করা উচিত নয়।',
    text: 'Four blind men once heard that an elephant had come to their village. None of them had ever seen one, so they went to touch it. They were curious and walked slowly towards the big animal, feeling the air with their hands. The first man touched its leg and said, “An elephant is like a tree.” The second held its tail and said, “No, it is like a rope.” The third touched its ear and cried, “You are both wrong. It is like a big fan.” The fourth felt its side and said, “It is a wall.” Soon they began to quarrel loudly, each sure that he was right. A wise man passing by stopped and listened. He smiled and said, “Each of you has touched only one part. If you put all the parts together, you will know the elephant.” The four men understood their mistake and felt ashamed.',
    qs: [
      { p: 'Why did the blind men quarrel?', o: ['Each felt a different part and thought he was right', 'They were hungry', 'The elephant frightened them', 'They wanted to ride it'], a: 'Each felt a different part and thought he was right', e: 'Each touched only one part.', b: 'প্রত্যেকে আলাদা অংশ ছুঁয়েছিল।' },
      { p: 'The word “wise” means ___.', o: ['having good sense and knowledge', 'very rich', 'very young', 'very loud'], a: 'having good sense and knowledge', e: 'Wise = sensible.', b: 'Wise = জ্ঞানী।' },
      { p: 'The man who touched the ear said an elephant is like ___.', o: ['a big fan', 'a rope', 'a tree', 'a wall'], a: 'a big fan', e: 'The third man said “a big fan”.', b: 'তৃতীয় ব্যক্তি বলল “বড় পাখা”।' },
    ],
  },
];

const STORY_QUESTIONS = STORY_BANK.flatMap((st) =>
  st.qs.map((q) => ({ ...q, ref: st.id }))
);

QUESTION_BANK.stories = {
  name: 'Story Reading', icon: 'trophy', class: 'all',
  lesson: {
    rules: [
      'A story has <code>characters</code>, a <code>setting</code>, a problem and an ending.',
      'Stories are told in the <code>past tense</code>: “A crow was flying…”, “He picked up the stones.”',
      'Dialogue goes inside quotation marks, and each new speaker starts a new line.',
      'The <code>moral</code> is the lesson of the story. Write it in one short sentence.',
      'In exams, build a story from a given outline: begin → problem → turning point → ending → moral.',
    ],
    examples: [
      '<strong>Beginning:</strong> One hot summer day, a crow was flying over a dry field.',
      '<strong>Turning point:</strong> A bright idea came to his mind.',
      '<strong>Moral:</strong> Where there is a will, there is a way.',
    ],
    bangla: 'গল্প সাধারণত past tense-এ লেখা হয়। শুরু → সমস্যা → মোড় → সমাপ্তি → শিক্ষা (moral) এই ক্রমে সাজাও।',
  },
  questions: STORY_QUESTIONS,
};

const READING_SOURCES = [...PARAGRAPH_BANK, ...STORY_BANK];

/* ============================================================
   Fair answer positions — categories whose correct answer sits in
   the first slot most of the time get a stable (seeded) shuffle,
   so the answer position is not predictable and never changes
   between renders.
   ============================================================ */
function seededShuffle(arr, seed) {
  const a = arr.slice();
  let s = seed >>> 0;
  const rnd = () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

Object.entries(QUESTION_BANK).forEach(([id, c]) => {
  const firstSlot = c.questions.filter((q) => q.o[0] === q.a).length;
  if (firstSlot / c.questions.length <= 0.7) return;
  c.questions.forEach((q, i) => {
    q.o = seededShuffle(q.o, (i + 1) * 2654435761 + id.length * 97);
  });
});

/* ============================================================
   Translation bank (Bangla → English). `ok` = accepted answers,
   compared after lower-casing, removing punctuation and treating
   she/he alike (the Bangla pronoun "সে" is gender-neutral).
   ============================================================ */
const TRANSLATION_BANK = [
  { bn: 'সে প্রতিদিন সকালে হাঁটে।', model: 'He walks in the morning every day.', ok: ['he walks in the morning every day', 'he walks every morning', 'he walks every day in the morning', 'every morning he walks', 'he goes for a walk every morning', 'he takes a walk every morning'] },
  { bn: 'আমি প্রতিদিন স্কুলে যাই।', model: 'I go to school every day.', ok: ['i go to school every day', 'i go to school daily', 'every day i go to school'] },
  { bn: 'সে গতকাল ঢাকা গিয়েছিল।', model: 'He went to Dhaka yesterday.', ok: ['he went to dhaka yesterday', 'yesterday he went to dhaka'] },
  { bn: 'আমরা এখন বই পড়ছি।', model: 'We are reading books now.', ok: ['we are reading books now', 'we are reading a book now', 'now we are reading books', 'now we are reading a book', 'we are reading books at the moment'] },
  { bn: 'বৃষ্টি হচ্ছে বলে আমি বাড়িতে আছি।', model: 'I am at home because it is raining.', ok: ['i am at home because it is raining', 'i am staying at home because it is raining', 'i am staying home because it is raining', 'because it is raining i am at home', 'because it is raining i am staying at home'] },
  { bn: 'সত্য কথা বলা উচিত।', model: 'We should speak the truth.', ok: ['we should speak the truth', 'we should tell the truth', 'one should speak the truth', 'one should tell the truth', 'the truth should be spoken', 'the truth should be told'] },
  { bn: 'সে আমাকে একটি বই দিয়েছে।', model: 'He has given me a book.', ok: ['he has given me a book', 'he gave me a book', 'he has given a book to me', 'he gave a book to me'] },
  { bn: 'তুমি কঠোর পরিশ্রম করলে সফল হবে।', model: 'If you work hard, you will succeed.', ok: ['if you work hard you will succeed', 'if you work hard you will be successful', 'you will succeed if you work hard', 'you will be successful if you work hard'] },
];

/* true when a string contains Bangla script (used for typography + direction chips) */
const hasBn = (s) => /[\u0980-\u09FF]/.test(s || '');

const normalizeAnswer = (s) =>
  s.toLowerCase().replace(/[^a-z\s]/g, ' ').replace(/\bshe\b/g, 'he').replace(/\s+/g, ' ').trim();

/* Topic title → practice category (used by "Board-style question sets") */
const TOPIC_TO_CAT = [
  [/without.*clue|no.*clue/i, 'gapNoClue'],
  [/clue/i, 'gapClue'],
  [/story|stories|moral/i, 'stories'],
  [/comprehension|passage|reading|paragraph/i, 'paragraphs'],
  [/rearrang/i, 'rearranging'],
  [/translat/i, 'translation'],
  [/transform/i, 'transformation'],
  [/narrat|speech/i, 'narration'],
  [/voice/i, 'voice'],
  [/punctuat/i, 'punctuation'],
  [/preposition/i, 'prepositions'],
  [/article/i, 'articles'],
  [/connector|conjunction/i, 'connectors'],
  [/completing/i, 'completing'],
  [/synonym/i, 'synonyms'],
  [/antonym/i, 'antonyms'],
  [/phrasal/i, 'phrasalVerbs'],
  [/idiom/i, 'idioms'],
  [/\bverbs?\b|tense/i, 'verbs'],
  [/condition/i, 'conditionals'],
  [/modal/i, 'modals'],
  [/question\s*tag/i, 'questionTags'],
];

/* Type-aware fallbacks for the Writing bank (used when the API is empty) */
const FALLBACK_WRITING = {
  paragraph: PARAGRAPH_BANK.map((p) => ({ id: p.id, title: p.title })),
  composition: [
    { id: 'c1', title: 'A Journey by Train' },
    { id: 'c2', title: 'The Padma Bridge' },
    { id: 'c3', title: 'Importance of Reading Newspapers' },
  ],
  letter: [
    { id: 'l1', title: 'A Letter to a Friend about SSC Results' },
    { id: 'l2', title: 'An Application for Leave' },
    { id: 'l3', title: 'A Letter to Your Father about Your Studies' },
  ],
};

/* ============================================================
   Build TABS
   ============================================================ */
const ALL_TABS = Object.entries(QUESTION_BANK).map(([id, cat]) => ({
  id,
  label: cat.name,
  icon: cat.icon,
  count: cat.questions.length,
  class: cat.class || 'all',
}));

const CLASSES = ['SSC', 'HSC', 'General'];
/* Only English 2nd Paper + General (1st Paper removed) */
const PAPERS = ['2nd Paper', 'General'];
const BOARDS = ['Dhaka', 'Rajshahi', 'Chattogram', 'Sylhet', 'Barishal', 'Cumilla', 'Jashore', 'Dinajpur', 'Mymensingh'];

const FALLBACK_TOPICS = [
  { id: 't1', title: 'Seen Comprehension', tag: 'Reading' },
  { id: 't2', title: 'Gap Filling with Clues', tag: 'Grammar' },
  { id: 't3', title: 'Rearranging Sentences', tag: 'Grammar' },
];

const TOTAL_QUESTIONS = Object.values(QUESTION_BANK).reduce((s, c) => s + c.questions.length, 0);

/* ============================================================
   Mascot
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

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export function Curriculum() {
  const [mode, setMode] = useState('practice');
  const [cls, setCls] = useState('SSC');
  const [paper, setPaper] = useState('2nd Paper');
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
  const [toast, setToast] = useState(null);
  const [catStats, setCatStats] = useState({});
  const [translationIdx, setTranslationIdx] = useState(0);
  const [translationInput, setTranslationInput] = useState('');
  const [translationFeedback, setTranslationFeedback] = useState(null);
  const [paraId, setParaId] = useState(PARAGRAPH_BANK[0].id);
  const [paraFilter, setParaFilter] = useState('All');
  const [storyId, setStoryId] = useState(STORY_BANK[0].id);

  const mainRef = useRef(null);
  const advanceTimer = useRef(null);
  const toastTimer = useRef(null);

  /* clear pending timers on unmount (they used to fire on a dead component) */
  useEffect(() => () => {
    clearTimeout(advanceTimer.current);
    clearTimeout(toastTimer.current);
  }, []);

  useEffect(() => {
    let alive = true;
    curriculumApi.topics({ class: cls, paper, board })
      .then((t) => { if (alive) setTopics(Array.isArray(t) ? t : []); })
      .catch(() => { if (alive) setTopics([]); });
    return () => { alive = false; };
  }, [cls, paper, board]);

  useEffect(() => {
    let alive = true;
    setWritingBank([]);
    curriculumApi.writingBank(writingType)
      .then((w) => { if (alive) setWritingBank(Array.isArray(w) ? w : []); })
      .catch(() => { if (alive) setWritingBank([]); });
    return () => { alive = false; };
  }, [writingType]);

  const tabs = useMemo(() => ALL_TABS, []);

  useEffect(() => {
    if (!tabs.some((t) => t.id === catId) && tabs.length) {
      setCatId(tabs[0].id);
      setQIndex(0);
      setSelected(null);
      setFeel(null);
    }
  }, [tabs, catId]);

  const cat = QUESTION_BANK[catId] || (tabs[0] && QUESTION_BANK[tabs[0].id]);
  const question = cat ? cat.questions[qIndex] : null;
  const totalForCat = cat ? cat.questions.length : 0;

  const flash = (t, ms = 900) => {
    clearTimeout(toastTimer.current);
    setToast(t);
    toastTimer.current = setTimeout(() => setToast(null), ms);
  };

  const scrollToMain = () => {
    if (mainRef.current && mainRef.current.scrollIntoView) {
      mainRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  /* single place that changes category/question and cancels any pending auto-advance */
  const goTo = (id, index = 0) => {
    clearTimeout(advanceTimer.current);
    setCatId(id);
    setQIndex(index);
    setSelected(null);
    setFeel(null);
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
    if (correct) flash({ xp: 10 });
    clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => {
      setSelected(null);
      setFeel(null);
      setQIndex((i) => (i + 1 < totalForCat ? i + 1 : 0));
    }, 900);
  };

  const switchCat = (id) => goTo(id);

  const startPracticeFromTopic = (t) => {
    const hit = TOPIC_TO_CAT.find(([re]) => re.test(`${t.title || ''} ${t.tag || ''}`));
    if (hit && QUESTION_BANK[hit[1]]) goTo(hit[1]);
    setMode('practice');
    scrollToMain();
  };

  const openParagraph = (id) => {
    setParaId(id);
    setMode('paragraphs');
    scrollToMain();
  };

  const practiceParagraph = (id) => {
    const idx = QUESTION_BANK.paragraphs.questions.findIndex((q) => q.ref === id);
    goTo('paragraphs', Math.max(idx, 0));
    setMode('practice');
    scrollToMain();
  };

  const openStory = (id) => {
    setStoryId(id);
    setMode('stories');
    scrollToMain();
  };

  const practiceStory = (id) => {
    const idx = QUESTION_BANK.stories.questions.findIndex((q) => q.ref === id);
    goTo('stories', Math.max(idx, 0));
    setMode('practice');
    scrollToMain();
  };

  const checkTranslation = () => {
    const item = TRANSLATION_BANK[translationIdx];
    const val = normalizeAnswer(translationInput);
    if (!val) {
      setTranslationFeedback({ type: 'bad', msg: 'Please type a translation first.' });
      return;
    }
    if (item.ok.includes(val)) {
      setTranslationFeedback({ type: 'good', msg: `Correct! Model answer: "${item.model}"` });
      flash({ xp: 10 });
    } else {
      setTranslationFeedback({ type: 'bad', msg: `Not quite. Model answer: "${item.model}"` });
    }
  };

  const nextTranslation = () => {
    setTranslationIdx((i) => (i + 1) % TRANSLATION_BANK.length);
    setTranslationInput('');
    setTranslationFeedback(null);
  };

  const openWritingBank = (w) => {
    const title = w.title || '';
    const hit = writingType === 'paragraph'
      && PARAGRAPH_BANK.find((p) => p.title.toLowerCase() === title.toLowerCase());
    if (hit) {
      openParagraph(hit.id);
      flash({ note: `📖 ${hit.title}` }, 1400);
      return;
    }
    flash({ note: `📖 ${title} — model answer coming soon` }, 1800);
  };

  const isWeakCat = (id) => {
    const s = catStats[id];
    return !!s && s.total >= 3 && s.correct / s.total < 0.6;
  };

  const overallPct = score.total ? Math.round((score.correct / score.total) * 100) : 0;

  const visibleParas = paraFilter === 'All' ? PARAGRAPH_BANK : PARAGRAPH_BANK.filter((p) => p.level === paraFilter);
  const activePara = PARAGRAPH_BANK.find((p) => p.id === paraId) || PARAGRAPH_BANK[0];
  const nextPara = visibleParas.length
    ? visibleParas[(visibleParas.findIndex((p) => p.id === activePara.id) + 1) % visibleParas.length]
    : activePara;
  const activeStory = STORY_BANK.find((s) => s.id === storyId) || STORY_BANK[0];
  const nextStory = STORY_BANK[(STORY_BANK.findIndex((s) => s.id === activeStory.id) + 1) % STORY_BANK.length];
  const passage = question && question.ref ? READING_SOURCES.find((p) => p.id === question.ref) : null;
  const trans = TRANSLATION_BANK[translationIdx];

  const bankItems = (() => {
    const base = FALLBACK_WRITING[writingType] || [];
    if (!writingBank.length) return base;
    if (writingType !== 'paragraph') return writingBank;
    const seen = new Set(writingBank.map((w) => (w.title || '').toLowerCase()));
    return [...writingBank, ...base.filter((x) => !seen.has(x.title.toLowerCase()))];
  })();

  if (!cat || !question) {
    return (
      <div className="ec-cur">
        <style>{CURRICULUM_CSS}</style>
        <div className="ec-cur-section" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <p style={{ fontSize: 14, color: 'var(--lang-ink-soft)', fontWeight: 700 }}>
            Loading curriculum…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="ec-cur">
      <style>{CURRICULUM_CSS}</style>

      <div className="ec-cur-head">
        <div>
          <p className="ec-cur-eyebrow">Curriculum</p>
          <h1 className="ec-page-title">English Grammar Mastery</h1>
          <p className="ec-page-sub">
            SSC, HSC & General — {TOTAL_QUESTIONS} exercises across {tabs.length} categories, plus {PARAGRAPH_BANK.length} model paragraphs and {STORY_BANK.length} short stories.
          </p>
        </div>
      </div>

      <div className="ec-cur-hero">
        <div className="ec-cur-hero-copy">
          <span className="ec-cur-hero-badge">Bangladesh Board</span>
          <h2>Grammar practice, <em>board-style</em></h2>
          <p>Every grammar rule, gap-filling type, translation pattern and writing form — lessons + practice for school and board exams.</p>
          <div className="ec-cur-hero-stats">
            <div className="ec-cur-hero-stat"><strong>{TOTAL_QUESTIONS}</strong><span>Exercises</span></div>
            <div className="ec-cur-hero-stat"><strong>{tabs.length}</strong><span>Topics</span></div>
            <div className="ec-cur-hero-stat"><strong>{BOARDS.length}</strong><span>Boards</span></div>
          </div>
        </div>
        <div className="ec-cur-hero-mascot">
          <LangutMascot size={150} />
        </div>
      </div>

      <div className="ec-cur-modes">
        <button
          type="button"
          className={`ec-cur-mode${mode === 'practice' ? ' ec-cur-mode--active' : ''}`}
          onClick={() => setMode('practice')}
          aria-pressed={mode === 'practice'}
        >
          <Icon name="target" /> Practice
        </button>
        <button
          type="button"
          className={`ec-cur-mode${mode === 'lesson' ? ' ec-cur-mode--active' : ''}`}
          onClick={() => setMode('lesson')}
          aria-pressed={mode === 'lesson'}
        >
          <Icon name="book" /> Lessons
        </button>
        <button
          type="button"
          className={`ec-cur-mode${mode === 'paragraphs' ? ' ec-cur-mode--active' : ''}`}
          onClick={() => setMode('paragraphs')}
          aria-pressed={mode === 'paragraphs'}
        >
          <Icon name="chat" /> Paragraphs
        </button>
        <button
          type="button"
          className={`ec-cur-mode${mode === 'stories' ? ' ec-cur-mode--active' : ''}`}
          onClick={() => setMode('stories')}
          aria-pressed={mode === 'stories'}
        >
          <Icon name="trophy" /> Stories
        </button>
      </div>

      <div className="ec-cur-filters">
        <div className="ec-cur-filter-group">
          {CLASSES.map((c) => (
            <button
              type="button"
              key={c}
              className={`ec-cur-pill${cls === c ? ' ec-cur-pill--active' : ''}`}
              onClick={() => setCls(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="ec-cur-filter-group">
          {PAPERS.map((p) => (
            <button
              type="button"
              key={p}
              className={`ec-cur-pill${paper === p ? ' ec-cur-pill--active' : ''}`}
              onClick={() => setPaper(p)}
            >
              {p}
            </button>
          ))}
        </div>
        <select
          className="ec-cur-select"
          value={board}
          onChange={(e) => setBoard(e.target.value)}
          aria-label="Select board"
        >
          {BOARDS.map((b) => <option key={b} value={b}>{b} Board</option>)}
        </select>
        <label className="ec-cur-check">
          <input type="checkbox" checked={banglaHelp} onChange={(e) => setBanglaHelp(e.target.checked)} />
          🇧🇩 বাংলা
        </label>
      </div>

      <div className="ec-cur-cats">
        {tabs.map((t) => (
          <button
            type="button"
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

      {toast && (
        <div className="ec-cur-xp-toast" role="status">
          {toast.xp != null ? `+${toast.xp} XP ✨` : toast.note}
        </div>
      )}

      <div className="ec-cur-grid">
        <section ref={mainRef} style={{ scrollMarginTop: 12 }}>
          {mode === 'lesson' && cat.lesson && (
            <div className="ec-lesson">
              <div className="ec-lesson-head">
                <h2 className="ec-lesson-title">{cat.name} — Lesson</h2>
                <span className="ec-cur-chip">{cat.questions.length} exercises</span>
              </div>
              <div className="ec-lesson-body">
                <div className="ec-lesson-block">
                  <h4>📘 Key Rules</h4>
                  <ul>
                    {cat.lesson.rules.map((r, i) => (
                      <li key={i} dangerouslySetInnerHTML={{ __html: r }} />
                    ))}
                  </ul>
                </div>
                <div className="ec-lesson-block">
                  <h4>✨ Examples</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {cat.lesson.examples.map((ex, i) => (
                      <div key={i} className="ec-lesson-example" dangerouslySetInnerHTML={{ __html: ex }} />
                    ))}
                  </div>
                </div>
                <div className="ec-lesson-bn">
                  🇧🇩 {cat.lesson.bangla}
                </div>
                <button
                  type="button"
                  className="ec-cur-pill ec-cur-pill--active"
                  style={{ padding: '11px 20px', fontSize: 13, alignSelf: 'flex-start' }}
                  onClick={() => setMode('practice')}
                >
                  ▶ Start practice →
                </button>
              </div>
            </div>
          )}

          {mode === 'paragraphs' && (
            <div className="ec-lesson">
              <div className="ec-lesson-head">
                <h2 className="ec-lesson-title">Model paragraphs</h2>
                <span className="ec-cur-chip">{visibleParas.length} paragraphs</span>
              </div>
              <div className="ec-cur-filter-group" style={{ marginBottom: 14 }}>
                {['All', 'SSC', 'HSC'].map((f) => (
                  <button
                    type="button"
                    key={f}
                    className={`ec-cur-pill${paraFilter === f ? ' ec-cur-pill--active' : ''}`}
                    onClick={() => setParaFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="ec-para-list">
                {visibleParas.map((p) => (
                  <button
                    type="button"
                    key={p.id}
                    className={`ec-para-item${activePara.id === p.id ? ' ec-para-item--active' : ''}`}
                    onClick={() => setParaId(p.id)}
                  >
                    <span className="ec-para-item-title">{p.title}</span>
                    <span className="ec-cur-chip">{p.level}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {mode === 'paragraphs' && (
            <div className="ec-cur-section">
              <div className="ec-cur-section-head">
                <h2 className="ec-cur-section-title">{activePara.title}</h2>
                <span className="ec-cur-chip">{activePara.level} · {activePara.text.split(/\s+/).length} words</span>
              </div>
              <p className="ec-para-text">{activePara.text}</p>
              <div className="ec-para-actions">
                <button
                  type="button"
                  className="ec-cur-pill ec-cur-pill--active"
                  onClick={() => practiceParagraph(activePara.id)}
                >
                  ▶ Practice this paragraph
                </button>
                <button type="button" className="ec-cur-pill" onClick={() => { setParaId(nextPara.id); scrollToMain(); }}>
                  Next paragraph →
                </button>
              </div>
            </div>
          )}

          {mode === 'stories' && (
            <div className="ec-lesson">
              <div className="ec-lesson-head">
                <h2 className="ec-lesson-title">Short stories</h2>
                <span className="ec-cur-chip">{STORY_BANK.length} stories</span>
              </div>
              <div className="ec-para-list">
                {STORY_BANK.map((s) => (
                  <button
                    type="button"
                    key={s.id}
                    className={`ec-para-item${activeStory.id === s.id ? ' ec-para-item--active' : ''}`}
                    onClick={() => setStoryId(s.id)}
                  >
                    <span className="ec-para-item-title">{s.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {mode === 'stories' && (
            <div className="ec-cur-section">
              <div className="ec-cur-section-head">
                <h2 className="ec-cur-section-title">{activeStory.title}</h2>
                <span className="ec-cur-chip">{activeStory.text.split(/\s+/).length} words</span>
              </div>
              <p className="ec-para-text">{activeStory.text}</p>
              <div className="ec-lesson-block" style={{ marginBottom: 14 }}>
                <h4>🌟 Moral</h4>
                <ul><li>{activeStory.moral}</li></ul>
              </div>
              <div className="ec-lesson-bn" style={{ marginBottom: 14 }}>🇧🇩 {activeStory.moralBn}</div>
              <div className="ec-para-actions">
                <button
                  type="button"
                  className="ec-cur-pill ec-cur-pill--active"
                  onClick={() => practiceStory(activeStory.id)}
                >
                  ▶ Practice this story
                </button>
                <button type="button" className="ec-cur-pill" onClick={() => { setStoryId(nextStory.id); scrollToMain(); }}>
                  Next story →
                </button>
              </div>
            </div>
          )}

          {mode === 'practice' && (
            <div className="ec-cur-section">
              <div className="ec-quiz-top">
                <span className="ec-quiz-badge">{cat.name}</span>
                <span className="ec-quiz-counter">Question {qIndex + 1} / {totalForCat}</span>
              </div>
              <div className="ec-quiz-progress">
                <div className="ec-quiz-progress-fill" style={{ width: `${((qIndex + 1) / totalForCat) * 100}%` }} />
              </div>
              {passage && (
                <details className="ec-passage" open key={passage.id}>
                  <summary>📖 {passage.title}</summary>
                  <p>{passage.text}</p>
                </details>
              )}
              {catId === 'translation' && (
                <span className={`ec-quiz-dir ${hasBn(question.p) ? 'ec-quiz-dir--bn' : 'ec-quiz-dir--en'}`}>
                  {hasBn(question.p)
                    ? 'বাংলা → English · Translate into English'
                    : 'English → বাংলা · বাংলায় অনুবাদ করো'}
                </span>
              )}
              <p className={`ec-quiz-question${catId === 'translation' ? ' ec-quiz-question--src' : ''}${hasBn(question.p) ? ' ec-bn' : ''}`}>{question.p}</p>
              <div className="ec-quiz-options">
                {question.o.map((opt, i) => {
                  const isSelected = selected === opt;
                  const isCorrect = opt === question.a;
                  const c = `ec-quiz-option${hasBn(opt) ? ' ec-bn' : ''}${isSelected ? (isCorrect ? ' ec-quiz-option--correct ec-pop' : ' ec-quiz-option--incorrect') : ''}`;
                  return (
                    <button
                      type="button"
                      key={`${opt}-${i}`}
                      className={c}
                      onClick={() => answer(opt)}
                      disabled={!!selected && !isSelected && !isCorrect}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              <div role="status" aria-live="polite" className={`ec-quiz-feedback${feel === 'good' ? ' ec-quiz-feedback--good' : feel === 'bad' ? ' ec-quiz-feedback--bad' : ''}`}>
                {feel === 'good' && '✨ Correct!'}
                {feel === 'bad' && `Correct answer: ${question.a}`}
              </div>
              {feel && (
                <p className="ec-quiz-explain">
                  💡 {banglaHelp ? question.b : question.e}
                </p>
              )}
            </div>
          )}

          {mode === 'lesson' && !cat.lesson && (
            <div className="ec-cur-section" style={{ textAlign: 'center', padding: '40px 20px' }}>
              <p style={{ fontSize: 14, color: 'var(--lang-ink-soft)', fontWeight: 700 }}>
                Lesson coming soon for {cat.name}.
              </p>
            </div>
          )}

          <div className="ec-cur-section">
            <div className="ec-cur-section-head">
              <h2 className="ec-cur-section-title">Board-style question sets</h2>
              <span className="ec-cur-chip">{cls} · {paper}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(topics.length ? topics : FALLBACK_TOPICS).map((t) => (
                <div
                  key={t.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    padding: '12px 14px',
                    borderRadius: 14,
                    background: 'var(--lang-lime-soft)',
                    border: '2px solid var(--lang-line)',
                    boxShadow: '0 2px 0 var(--lang-line)',
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: '0 0 4px', fontWeight: 900, fontSize: 13, color: 'var(--lang-ink)' }}>{t.title}</p>
                    <span style={{
                      fontSize: 10, fontWeight: 900,
                      color: 'var(--lang-ink)', background: 'var(--lang-pink)',
                      padding: '3px 9px', borderRadius: 999,
                      border: '2px solid var(--lang-line)',
                      textTransform: 'uppercase', letterSpacing: '.05em',
                    }}>{t.tag}</span>
                  </div>
                  <button
                    type="button"
                    className="ec-cur-pill ec-cur-pill--active"
                    style={{ padding: '10px 16px', fontSize: 12, flexShrink: 0, minHeight: 44 }}
                    onClick={() => startPracticeFromTopic(t)}
                    aria-label={`Practice ${t.title}`}
                  >
                    Practice
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="ec-cur-section ec-cur-translation">
            <div className="ec-cur-section-head">
              <h2 className="ec-cur-section-title">Translation practice</h2>
              <span className="ec-cur-chip">Bangla → English · {translationIdx + 1}/{TRANSLATION_BANK.length}</span>
            </div>
            <p className="ec-cur-translation-label">
              Translate the sentence below · নিচের বাক্যটি অনুবাদ করো
            </p>
            <p className="bn">{trans.bn}</p>
            <textarea
              rows={2}
              aria-label="English translation"
              placeholder="Type the English translation…"
              value={translationInput}
              onChange={(e) => { setTranslationInput(e.target.value); setTranslationFeedback(null); }}
            />
            <button
              type="button"
              className="ec-cur-pill ec-cur-pill--active"
              style={{ marginTop: 12, padding: '11px 20px', fontSize: 13, minHeight: 46 }}
              onClick={checkTranslation}
            >
              Check
            </button>
            <button
              type="button"
              className="ec-cur-pill"
              style={{ marginTop: 12, marginLeft: 8, padding: '11px 20px', fontSize: 13, minHeight: 46 }}
              onClick={nextTranslation}
            >
              Next →
            </button>
            {translationFeedback && (
              <div className={`ec-cur-translation-feedback ec-cur-translation-feedback--${translationFeedback.type}`}>
                {translationFeedback.type === 'good' ? '✅ ' : '⚠️ '}
                {translationFeedback.msg}
              </div>
            )}
          </div>
        </section>

        <aside>
          <div className="ec-cur-section">
            <div className="ec-cur-section-head">
              <h2 className="ec-cur-section-title">All topics</h2>
              <span className="ec-cur-chip">{tabs.length}</span>
            </div>
            <div className="ec-cur-topic-list">
              {tabs.map((t) => {
                const stat = catStats[t.id];
                const pct = stat && stat.total ? Math.round((stat.correct / stat.total) * 100) : null;
                const weak = isWeakCat(t.id);
                return (
                  <button
                    type="button"
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

          <div className="ec-cur-section">
            <div className="ec-cur-section-head">
              <h2 className="ec-cur-section-title">Writing bank</h2>
            </div>
            <div className="ec-cur-filter-group" style={{ marginBottom: 12 }}>
              {['paragraph', 'composition', 'letter'].map((t) => (
                <button
                  type="button"
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
              {bankItems.map((w) => (
                <button
                  type="button"
                  key={w.id ?? w.title}
                  className="ec-cur-bank-item"
                  onClick={() => openWritingBank(w)}
                >
                  {w.title}
                </button>
              ))}
            </div>
          </div>

          <div className="ec-cur-section">
            <div className="ec-cur-section-head">
              <h2 className="ec-cur-section-title">Your session</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="ec-cur-session-label">
                <span style={{ color: 'var(--lang-ink-soft)' }}>Correct</span>
                <span style={{ color: 'var(--lang-ink)' }}>{score.correct} / {score.total}</span>
              </div>
              <div style={{
                height: 14, borderRadius: 999,
                background: '#E8E5F2', overflow: 'hidden',
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
                fontSize: 12, fontWeight: 900,
                color: 'var(--lang-ink)', background: 'var(--lang-lime)',
                border: '2px solid var(--lang-line)',
                padding: '6px 12px', borderRadius: 999,
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
