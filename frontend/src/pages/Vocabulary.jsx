import { useEffect, useMemo, useState, useCallback } from 'react';
import { vocabApi } from '../api/vocab';
import { Icon } from '../components/Icon';

const VOCAB_CSS = `
/* ============================================================
   VOCABULARY — Langut-inspired (fully mobile-optimised)
   Deep purple + lime-yellow + chunky black outlines.
   ============================================================ */

.ec-voc{
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
  --lang-ink:       #17102E;
  --lang-ink-soft:  #6B6488;
  --lang-white:     #FFFFFF;
  --lang-grey:      #EDEAF6;
  --lang-line:      #17102E;
  --lang-radius:    26px;
  --lang-radius-sm: 18px;
  --lang-safe:      env(safe-area-inset-bottom, 0px);
  --lang-nav-h:     110px;

  width:100%;
  max-width:100%;
  overflow-x:hidden;
  position:relative;
}

.ec-voc,
.ec-voc *{
  box-sizing:border-box;
  -webkit-tap-highlight-color:transparent;
  min-width:0;
}
.ec-voc button,
.ec-voc input,
.ec-voc [role="button"]{
  -webkit-tap-highlight-color:transparent;
  touch-action:manipulation;
}
.ec-voc input{font-size:16px}
.ec-voc img,.ec-voc svg{max-width:100%;height:auto}

/* ============================================================
   HEADING
   ============================================================ */
.ec-voc-head{
  display:flex;align-items:flex-end;justify-content:space-between;
  gap:16px;flex-wrap:wrap;margin-bottom:20px;
}
.ec-voc-eyebrow{
  margin:0 0 6px;font-size:11.5px;font-weight:900;
  letter-spacing:.16em;text-transform:uppercase;
  color:var(--lang-purple);opacity:.95;
}

/* ============================================================
   HERO
   ============================================================ */
.ec-voc-hero{
  position:relative;
  overflow:hidden;
  border-radius:32px;
  padding:clamp(24px,4vw,44px) clamp(20px,4vw,44px);
  color:#fff;
  background:linear-gradient(140deg,#2A1A6E 0%,#1E1252 55%,#3B2596 100%);
  box-shadow:0 24px 60px rgba(30,18,82,.32);
  border:2px solid #17102E;
  margin-bottom:24px;
  min-height:280px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:20px;
  max-width:100%;
}
.ec-voc-hero::before{
  content:'';position:absolute;inset:0;
  background-image:radial-gradient(rgba(255,255,255,.10) 1.4px,transparent 1.4px);
  background-size:20px 20px;
  mask-image:radial-gradient(circle at 15% 20%,#000,transparent 65%);
  -webkit-mask-image:radial-gradient(circle at 15% 20%,#000,transparent 65%);
  pointer-events:none;
}
.ec-voc-hero-orb{
  position:absolute;top:-90px;right:180px;
  width:240px;height:240px;border-radius:50%;
  background:radial-gradient(circle,rgba(212,245,92,.22),transparent 68%);
  animation:ec-voc-drift 14s ease-in-out infinite;
  pointer-events:none;
}
.ec-voc-hero-orb--pink{
  top:auto;bottom:-100px;left:-60px;right:auto;
  width:220px;height:220px;
  background:radial-gradient(circle,rgba(255,143,203,.24),transparent 70%);
  animation-delay:-6s;
}
@keyframes ec-voc-drift{
  0%,100%{transform:translate(0,0) scale(1)}
  50%{transform:translate(-18px,16px) scale(1.08)}
}

.ec-voc-hero-copy{position:relative;z-index:2;max-width:560px;min-width:0;flex:1 1 auto}
.ec-voc-hero-badge{
  display:inline-flex;align-items:center;
  font-size:10.5px;font-weight:900;letter-spacing:.16em;text-transform:uppercase;
  padding:7px 14px;border-radius:999px;
  background:var(--lang-lime);color:var(--lang-ink);
  margin-bottom:18px;
  border:2px solid var(--lang-ink);
  box-shadow:0 4px 0 rgba(23,16,46,.35);
  max-width:100%;
}
.ec-voc-hero h1{
  margin:0 0 12px;
  font-size:clamp(24px,2.6vw + 16px,42px);
  font-weight:900;
  letter-spacing:-.035em;
  line-height:1.08;
  color:#fff;
  word-break:break-word;
}
.ec-voc-hero h1 em{font-style:normal;color:var(--lang-lime);}
.ec-voc-hero p{
  margin:0 0 22px;
  font-size:14.5px;line-height:1.6;
  opacity:.92;font-weight:500;max-width:52ch;
}

.ec-voc-hero-stats{
  display:flex;gap:12px;flex-wrap:wrap;
  position:relative;z-index:2;
  max-width:100%;
}
.ec-voc-hero-stat{
  display:flex;flex-direction:column;gap:2px;
  padding:10px 16px;
  border-radius:16px;
  background:var(--lang-lime);
  border:2px solid var(--lang-ink);
  box-shadow:0 4px 0 var(--lang-ink);
  min-width:86px;
  min-width:0;
  flex:0 1 auto;
}
.ec-voc-hero-stat strong{
  font-size:22px;font-weight:900;line-height:1;
  letter-spacing:-.04em;color:var(--lang-ink);
}
.ec-voc-hero-stat span{
  font-size:10px;font-weight:900;letter-spacing:.1em;
  text-transform:uppercase;color:var(--lang-ink);opacity:.75;
}
.ec-voc-hero-stat:nth-child(2){background:var(--lang-pink);}
.ec-voc-hero-stat:nth-child(3){background:var(--lang-purple-2);color:#fff;}
.ec-voc-hero-stat:nth-child(3) strong,
.ec-voc-hero-stat:nth-child(3) span{color:#fff;}
.ec-voc-hero-stat:nth-child(4){background:var(--lang-yellow);}

.ec-voc-hero-mascot{
  position:relative;z-index:2;
  flex-shrink:0;
  display:flex;align-items:center;justify-content:center;
  filter:drop-shadow(0 14px 28px rgba(0,0,0,.28));
  animation:ec-voc-bob 4s ease-in-out infinite;
  pointer-events:none;
}
@keyframes ec-voc-bob{
  0%,100%{transform:translateY(0) rotate(-2deg)}
  50%{transform:translateY(-10px) rotate(2deg)}
}

/* ============================================================
   MODE TABS — chunky pills
   ============================================================ */
.ec-voc-tabs{
  display:flex;gap:10px;
  overflow-x:auto;overflow-y:hidden;
  scroll-snap-type:x proximity;
  scrollbar-width:none;
  -webkit-overflow-scrolling:touch;
  padding:6px 2px 18px;
  margin:0 0 6px;
  max-width:100%;
}
.ec-voc-tabs::-webkit-scrollbar{display:none}
.ec-voc-tab{
  flex:0 0 auto;scroll-snap-align:start;
  display:inline-flex;align-items:center;gap:8px;
  padding:12px 20px;
  border-radius:999px;
  border:2px solid var(--lang-line);
  background:#fff;
  color:var(--lang-ink);
  font-size:13px;font-weight:900;
  cursor:pointer;white-space:nowrap;
  font-family:inherit;
  transition:all .18s ease;
  box-shadow:0 3px 0 var(--lang-line);
  letter-spacing:.01em;
  min-height:44px;
}
.ec-voc-tab:hover{background:var(--lang-lime-soft);transform:translateY(-2px);box-shadow:0 5px 0 var(--lang-line)}
.ec-voc-tab:active{transform:translateY(1px);box-shadow:0 1px 0 var(--lang-line)}
.ec-voc-tab--active{
  background:var(--lang-ink);color:var(--lang-lime);
  box-shadow:0 3px 0 var(--lang-ink);
}
.ec-voc-tab--active:hover{background:var(--lang-ink);color:var(--lang-lime)}
.ec-voc-tab svg{width:16px;height:16px;flex-shrink:0}

/* ============================================================
   GRID — desktop: content + sidebar
   ============================================================ */
.ec-voc-grid{
  display:grid;
  grid-template-columns:minmax(0,1fr) 330px;
  gap:clamp(20px,3vw,28px);
  align-items:start;
  width:100%;
  max-width:100%;
}
.ec-voc-grid > section,
.ec-voc-grid > aside{
  min-width:0;
  max-width:100%;
}

/* ============================================================
   FLASHCARDS
   ============================================================ */
.ec-flash-wrap{
  perspective:1600px;
  min-height:320px;
  margin-bottom:22px;
  max-width:100%;
}
.ec-flash{
  position:relative;width:100%;height:320px;
  transform-style:preserve-3d;
  transition:transform .8s cubic-bezier(.2,1,.3,1);
  cursor:pointer;
  max-width:100%;
}
.ec-flash[data-flipped="true"]{transform:rotateY(180deg)}
.ec-flash-face{
  position:absolute;inset:0;
  backface-visibility:hidden;-webkit-backface-visibility:hidden;
  border-radius:32px;padding:34px;
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;gap:16px;
  border:3px solid var(--lang-line);
  box-shadow:0 10px 0 var(--lang-line);
  overflow:hidden;
}
.ec-flash-front{
  background:#fff;
  background-image:radial-gradient(circle at 100% 0%,rgba(212,245,92,.35),transparent 55%);
  text-align:center;
}
.ec-flash-back{
  background:linear-gradient(150deg,#7B5CF0 0%,#5A3FD9 100%);
  color:#fff;
  transform:rotateY(180deg);
  text-align:center;
  background-image:radial-gradient(circle at 0% 100%,rgba(212,245,92,.22),transparent 55%),
                   linear-gradient(150deg,#7B5CF0 0%,#5A3FD9 100%);
}
.ec-flash-pos{
  font-size:10.5px;font-weight:900;letter-spacing:.16em;
  text-transform:uppercase;
  padding:7px 15px;border-radius:999px;
  background:var(--lang-lime);color:var(--lang-ink);
  border:2px solid var(--lang-line);
  box-shadow:0 3px 0 var(--lang-line);
}
.ec-flash-back .ec-flash-pos{
  background:var(--lang-lime);color:var(--lang-ink);
  border-color:var(--lang-line);
  box-shadow:0 3px 0 rgba(0,0,0,.4);
}
.ec-flash-word{
  font-size:clamp(32px,4.4vw + 14px,50px);
  font-weight:900;letter-spacing:-.04em;line-height:1.05;
  margin:0;color:var(--lang-ink);
  word-break:break-word;overflow-wrap:anywhere;
}
.ec-flash-back .ec-flash-word{
  font-size:clamp(20px,2.4vw + 12px,30px);
  color:#fff;letter-spacing:-.025em;font-weight:800;
  max-width:560px;
}
.ec-flash-sub{
  font-size:14px;color:var(--lang-ink-soft);
  margin:0;line-height:1.6;max-width:520px;font-weight:600;
}
.ec-flash-back .ec-flash-sub{
  color:rgba(255,255,255,.94);font-style:italic;font-size:15px;
}
.ec-flash-hint{
  position:absolute;bottom:20px;left:50%;transform:translateX(-50%);
  font-size:11px;font-weight:900;
  color:var(--lang-ink-soft);opacity:.65;
  letter-spacing:.1em;text-transform:uppercase;
  white-space:nowrap;
}
.ec-flash-back .ec-flash-hint{color:rgba(255,255,255,.75)}
.ec-flash-syn{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:6px;max-width:100%}
.ec-flash-syn span{
  font-size:11.5px;font-weight:900;
  padding:5px 13px;border-radius:999px;
  background:var(--lang-lime);color:var(--lang-ink);
  border:2px solid var(--lang-line);
}

.ec-flash-counter{
  display:flex;align-items:center;justify-content:space-between;
  gap:12px;margin-bottom:10px;flex-wrap:wrap;
}
.ec-flash-counter-label{
  font-size:12.5px;font-weight:900;
  color:var(--lang-ink-soft);
  letter-spacing:.05em;text-transform:uppercase;
}
.ec-flash-counter-label strong{color:var(--lang-ink);font-weight:900}
.ec-flash-mastery{display:flex;align-items:center;gap:6px}
.ec-flash-mastery-dot{
  width:12px;height:12px;border-radius:50%;
  background:#E8E5F2;
  border:2px solid var(--lang-line);
  transition:all .3s ease;
}
.ec-flash-mastery-dot--on{
  background:var(--lang-lime);
  box-shadow:0 0 0 3px rgba(212,245,92,.4);
}

/* ---------- Daily goal bar ---------- */
.ec-flash-daily{
  display:flex;align-items:center;justify-content:space-between;
  gap:10px;flex-wrap:wrap;margin-bottom:8px;
}
.ec-flash-daily-text{
  font-size:11.5px;font-weight:900;
  letter-spacing:.08em;text-transform:uppercase;
  color:var(--lang-ink-soft);
}
.ec-flash-daily-text strong{color:var(--lang-ink)}
.ec-flash-daily-track{
  height:12px;border-radius:999px;background:#E8E5F2;overflow:hidden;
  border:2px solid var(--lang-line);
  margin-bottom:18px;
}
.ec-flash-daily-fill{
  height:100%;border-radius:999px;
  background:linear-gradient(90deg,#D4F55C,#B8E62E);
  transition:width .5s cubic-bezier(.22,1,.36,1);
}
.ec-flash-daily-fill--done{
  background:linear-gradient(90deg,#FF8FCB,#D4F55C);
}

/* ---------- Grade buttons ---------- */
.ec-grade-row{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;width:100%}
.ec-grade-btn{
  border:2px solid var(--lang-line);
  padding:15px 10px;
  border-radius:18px;
  font-size:13.5px;font-weight:900;
  cursor:pointer;font-family:inherit;
  color:var(--lang-ink);letter-spacing:.03em;
  transition:all .15s ease;
  box-shadow:0 4px 0 var(--lang-line);
  min-height:56px;
  min-width:0;
  word-break:break-word;
  background:#fff;
}
.ec-grade-btn:hover{transform:translateY(-2px);box-shadow:0 6px 0 var(--lang-line)}
.ec-grade-btn:active{transform:translateY(2px);box-shadow:0 1px 0 var(--lang-line)}
.ec-grade-btn--prev{background:#fff}
.ec-grade-btn--next{background:var(--lang-lime)}
.ec-grade-btn--good{background:var(--lang-lime)}
.ec-grade-btn svg{width:16px;height:16px;vertical-align:-3px;margin:0 2px}

/* ============================================================
   QUIZ / BLITZ
   ============================================================ */
.ec-quiz-card{
  background:#fff;
  border-radius:32px;
  padding:28px;
  border:3px solid var(--lang-line);
  box-shadow:0 10px 0 var(--lang-line);
  width:100%;
  max-width:100%;
  min-width:0;
  overflow:hidden;
}
.ec-quiz-top{
  display:flex;align-items:center;justify-content:space-between;
  gap:12px;margin-bottom:16px;flex-wrap:wrap;
}
.ec-quiz-badge{
  display:inline-flex;align-items:center;
  font-size:11px;font-weight:900;letter-spacing:.1em;
  text-transform:uppercase;
  padding:7px 14px;border-radius:999px;
  background:var(--lang-lime);color:var(--lang-ink);
  border:2px solid var(--lang-line);
  box-shadow:0 3px 0 var(--lang-line);
  max-width:100%;
}
.ec-quiz-badge--blitz{
  background:var(--lang-pink-2);color:#fff;
}
.ec-quiz-counter{
  font-size:12.5px;font-weight:900;
  color:var(--lang-ink-soft);
  letter-spacing:.04em;text-transform:uppercase;
}
.ec-quiz-progress{
  height:12px;border-radius:999px;
  background:#E8E5F2;overflow:hidden;
  margin-bottom:22px;
  border:2px solid var(--lang-line);
}
.ec-quiz-progress-fill{
  height:100%;
  background:linear-gradient(90deg,#D4F55C,#B8E62E);
  transition:width .5s cubic-bezier(.22,1,.36,1);
}
.ec-quiz-question{
  font-size:clamp(17px,1.3vw + 14px,22px);
  font-weight:900;line-height:1.35;
  margin:0 0 22px;color:var(--lang-ink);
  letter-spacing:-.02em;
  word-break:break-word;overflow-wrap:anywhere;
}
.ec-quiz-options{
  display:flex;flex-direction:column;gap:12px;margin-bottom:18px;
  width:100%;max-width:100%;min-width:0;
}
.ec-quiz-option{
  display:flex;align-items:center;
  border:2px solid var(--lang-line);
  background:#fff;color:var(--lang-ink);
  font-size:14.5px;font-weight:800;
  padding:16px 20px;border-radius:18px;
  text-align:left;cursor:pointer;
  transition:all .16s ease;
  font-family:inherit;
  box-shadow:0 4px 0 var(--lang-line);
  min-height:52px;
  width:100%;
  max-width:100%;
  min-width:0;
  word-break:break-word;overflow-wrap:anywhere;
  white-space:normal;
  line-height:1.35;
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
  color:var(--lang-ink);
  font-weight:900;
}
.ec-quiz-option--incorrect{
  background:var(--lang-pink-2);
  border-color:var(--lang-line);
  color:#fff;font-weight:900;
}
.ec-quiz-foot{
  display:flex;justify-content:space-between;
  font-size:12.5px;font-weight:800;
  color:var(--lang-ink-soft);
  flex-wrap:wrap;gap:8px;
  padding-top:14px;
  border-top:2px dashed rgba(23,16,46,.15);
}
.ec-quiz-timer{color:var(--lang-pink-2)}

/* ============================================================
   DICTIONARY
   ============================================================ */
.ec-dict-bar{
  display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap;align-items:center;
  width:100%;max-width:100%;
}
.ec-dict-search{
  flex:1 1 200px;
  min-width:0;
  max-width:100%;
  display:flex;align-items:center;gap:10px;
  background:#fff;
  border:2px solid var(--lang-line);
  border-radius:999px;
  padding:13px 20px;
  color:var(--lang-ink-soft);
  box-shadow:0 4px 0 var(--lang-line);
  transition:all .2s ease;
}
.ec-dict-search:focus-within{
  box-shadow:0 4px 0 var(--lang-line),0 0 0 4px rgba(212,245,92,.5);
}
.ec-dict-search input{
  flex:1 1 auto;
  min-width:0;
  border:none;outline:none;background:transparent;
  font-size:16px;color:var(--lang-ink);
  font-family:inherit;font-weight:700;
}
.ec-dict-search input::placeholder{font-weight:500;color:var(--lang-ink-soft);text-overflow:ellipsis}
.ec-dict-clear{
  border:2px solid var(--lang-line);
  background:var(--lang-lime);color:var(--lang-ink);
  width:26px;height:26px;border-radius:50%;
  font-size:11px;font-weight:900;
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;font-family:inherit;
  box-shadow:0 2px 0 var(--lang-line);
  flex-shrink:0;
  padding:0;
}
.ec-dict-clear:hover{transform:translateY(-1px);box-shadow:0 3px 0 var(--lang-line)}

.ec-dict-filters{
  display:flex;gap:8px;
  overflow-x:auto;overflow-y:hidden;
  scrollbar-width:none;
  -webkit-overflow-scrolling:touch;
  padding-bottom:8px;margin-bottom:16px;
  max-width:100%;
}
.ec-dict-filters::-webkit-scrollbar{display:none}
.ec-dict-filter{
  flex:0 0 auto;
  border:2px solid var(--lang-line);
  background:#fff;color:var(--lang-ink);
  font-size:12px;font-weight:900;
  padding:9px 15px;border-radius:999px;
  cursor:pointer;white-space:nowrap;
  transition:all .16s ease;font-family:inherit;
  box-shadow:0 3px 0 var(--lang-line);
  letter-spacing:.02em;
  min-height:40px;
}
.ec-dict-filter:hover{
  background:var(--lang-lime-soft);
  transform:translateY(-2px);
  box-shadow:0 5px 0 var(--lang-line);
}
.ec-dict-filter--active{
  background:var(--lang-ink);color:var(--lang-lime);
  box-shadow:0 3px 0 var(--lang-ink);
}

.ec-dict-list{
  display:flex;flex-direction:column;gap:14px;
  width:100%;max-width:100%;min-width:0;
}
.ec-dict-item{
  background:#fff;
  border:2px solid var(--lang-line);
  border-radius:22px;
  padding:20px 22px;
  box-shadow:0 5px 0 var(--lang-line);
  transition:all .18s ease;
  width:100%;max-width:100%;min-width:0;
  overflow:hidden;
}
.ec-dict-item:hover{
  transform:translateY(-3px);
  box-shadow:0 8px 0 var(--lang-line);
}
.ec-dict-item-head{
  display:flex;align-items:flex-start;justify-content:space-between;
  gap:12px;margin-bottom:8px;flex-wrap:wrap;
}
.ec-dict-word{
  margin:0;font-size:19px;font-weight:900;
  color:var(--lang-ink);letter-spacing:-.02em;
  word-break:break-word;overflow-wrap:anywhere;
  min-width:0;
}
.ec-dict-pos{
  font-size:10.5px;font-weight:900;
  text-transform:uppercase;letter-spacing:.08em;
  padding:4px 11px;border-radius:999px;
  background:var(--lang-purple-2);color:#fff;
  border:2px solid var(--lang-line);
  box-shadow:0 2px 0 var(--lang-line);
  white-space:nowrap;
  flex-shrink:0;
}
.ec-dict-meaning{
  margin:0 0 8px;font-size:14px;line-height:1.55;
  color:var(--lang-ink);font-weight:700;
  word-break:break-word;
}
.ec-dict-example{
  margin:0 0 12px;font-size:13px;line-height:1.6;
  color:var(--lang-ink-soft);font-style:italic;font-weight:500;
  word-break:break-word;
}
.ec-dict-meta{display:flex;gap:8px;flex-wrap:wrap;align-items:center;max-width:100%}
.ec-dict-syn{
  font-size:11.5px;font-weight:900;
  padding:4px 11px;border-radius:999px;
  background:var(--lang-purple-2);color:#fff;
  border:2px solid var(--lang-line);
  box-shadow:0 2px 0 var(--lang-line);
}
.ec-dict-unit{
  font-size:11.5px;font-weight:900;
  padding:4px 11px;border-radius:999px;
  background:var(--lang-lime);color:var(--lang-ink);
  border:2px solid var(--lang-line);
  box-shadow:0 2px 0 var(--lang-line);
}
.ec-dict-star{
  border:2px solid var(--lang-line);
  background:#fff;
  font-size:16px;cursor:pointer;
  padding:0;border-radius:10px;
  color:#C8C4D6;
  transition:all .16s ease;
  box-shadow:0 2px 0 var(--lang-line);
  line-height:1;
  min-width:40px;
  min-height:40px;
  flex-shrink:0;
}
.ec-dict-star--on{
  color:var(--lang-ink);
  background:var(--lang-yellow);
  transform:scale(1.06);
}
.ec-dict-star:hover{transform:scale(1.1)}
.ec-dict-empty{
  text-align:center;padding:60px 24px;
  color:var(--lang-ink-soft);
  font-size:14px;font-weight:700;
  background:#fff;border-radius:24px;
  border:2px dashed var(--lang-line);
  width:100%;max-width:100%;
}

/* ============================================================
   SIDEBAR CARDS
   ============================================================ */
.ec-voc-card{
  background:#fff;
  border:2px solid var(--lang-line);
  border-radius:26px;
  padding:22px;
  box-shadow:0 6px 0 var(--lang-line);
  margin-bottom:18px;
  width:100%;max-width:100%;min-width:0;
  overflow:hidden;
}
.ec-voc-card:last-child{margin-bottom:0}
.ec-voc-card h3{
  margin:0 0 16px;
  font-size:15px;font-weight:900;
  color:var(--lang-ink);
  display:flex;align-items:center;justify-content:space-between;
  gap:8px;letter-spacing:-.01em;
}
.ec-voc-card h3 span{
  font-size:10.5px;
  color:var(--lang-ink);
  background:var(--lang-lime);
  padding:4px 11px;border-radius:999px;
  font-weight:900;
  text-transform:uppercase;letter-spacing:.08em;
  border:2px solid var(--lang-line);
  box-shadow:0 2px 0 var(--lang-line);
  flex-shrink:0;
}
.ec-voc-wod-word{
  font-size:28px;font-weight:900;margin:0 0 8px;
  color:var(--lang-ink);letter-spacing:-.035em;line-height:1.1;
  word-break:break-word;
}
.ec-voc-wod-meaning{
  font-size:13.5px;color:var(--lang-ink-soft);
  margin:0 0 10px;line-height:1.6;font-weight:600;
}
.ec-voc-wod-ex{
  font-size:13px;font-style:italic;
  color:var(--lang-ink-soft);margin:0;
  line-height:1.6;font-weight:500;
}

.ec-voc-xp-bar{
  display:flex;justify-content:space-between;
  font-size:12px;font-weight:900;
  color:var(--lang-ink-soft);
  margin-bottom:10px;
  letter-spacing:.03em;text-transform:uppercase;
  gap:8px;flex-wrap:wrap;
}
.ec-voc-xp-track{
  height:14px;border-radius:999px;
  background:#E8E5F2;overflow:hidden;
  margin-bottom:10px;
  border:2px solid var(--lang-line);
}
.ec-voc-xp-fill{
  height:100%;border-radius:999px;
  background:linear-gradient(90deg,#D4F55C,#B8E62E);
  transition:width 1s cubic-bezier(.22,1,.36,1);
}
.ec-voc-xp-hint{
  font-size:11.5px;color:var(--lang-ink-soft);
  margin:0;font-weight:600;line-height:1.55;
}

.ec-voc-units{display:flex;flex-direction:column;gap:8px;max-width:100%}
.ec-voc-unit-btn{
  display:flex;align-items:center;justify-content:space-between;
  gap:10px;padding:11px 14px;
  border-radius:14px;
  border:2px solid var(--lang-line);
  background:#fff;color:var(--lang-ink);
  font-size:13px;font-weight:800;
  cursor:pointer;font-family:inherit;
  width:100%;max-width:100%;min-width:0;
  transition:all .15s ease;
  box-shadow:0 3px 0 var(--lang-line);
  min-height:44px;
  text-align:left;
}
.ec-voc-unit-btn:hover{
  background:var(--lang-lime-soft);
  transform:translateY(-1px);
  box-shadow:0 4px 0 var(--lang-line);
}
.ec-voc-unit-btn--active{
  background:var(--lang-ink);color:var(--lang-lime);
}
.ec-voc-unit-count{
  font-size:11px;font-weight:900;
  padding:3px 9px;border-radius:999px;
  background:var(--lang-lime);color:var(--lang-ink);
  border:2px solid var(--lang-line);
  flex-shrink:0;
}
.ec-voc-unit-btn--active .ec-voc-unit-count{
  background:var(--lang-lime);color:var(--lang-ink);
}

.ec-voc-reward-list{display:flex;flex-direction:column;gap:10px}
.ec-voc-reward{
  display:flex;align-items:center;gap:12px;
  padding:12px 14px;border-radius:16px;
  background:#fff;
  border:2px solid var(--lang-line);
  box-shadow:0 3px 0 var(--lang-line);
  transition:all .15s ease;
  min-width:0;
}
.ec-voc-reward:hover{transform:translateY(-1px)}
.ec-voc-reward-icon{
  width:38px;height:38px;border-radius:12px;
  background:var(--lang-lime);color:var(--lang-ink);
  display:flex;align-items:center;justify-content:center;
  font-size:18px;flex-shrink:0;
  border:2px solid var(--lang-line);
}
.ec-voc-reward-body{flex:1;min-width:0}
.ec-voc-reward-body p{margin:0;font-size:13px;font-weight:900;color:var(--lang-ink)}
.ec-voc-reward-body span{font-size:11.5px;color:var(--lang-ink-soft);font-weight:600}
.ec-voc-reward-xp{
  font-size:12px;font-weight:900;
  color:var(--lang-ink);
  background:var(--lang-yellow);
  padding:3px 10px;border-radius:999px;
  border:2px solid var(--lang-line);
  white-space:nowrap;
  flex-shrink:0;
}

/* ============================================================
   TOAST
   ============================================================ */
.ec-voc-toast{
  position:fixed;top:78px;right:20px;z-index:50;
  background:var(--lang-ink);color:var(--lang-lime);
  padding:13px 22px;border-radius:999px;
  font-weight:900;font-size:13.5px;
  border:2px solid var(--lang-lime);
  box-shadow:0 12px 28px rgba(23,16,46,.4);
  animation:ec-voc-toast-pop 1s ease both;
  letter-spacing:.03em;
  pointer-events:none;
  max-width:calc(100vw - 24px);
}
@keyframes ec-voc-toast-pop{
  0%{transform:translateY(-10px) scale(.9);opacity:0}
  20%{transform:translateY(0) scale(1);opacity:1}
  80%{transform:translateY(0) scale(1);opacity:1}
  100%{transform:translateY(-8px) scale(.98);opacity:0}
}

/* ============================================================
   ANIMATIONS
   ============================================================ */
@keyframes ec-voc-fade-in{
  from{opacity:0;transform:translateY(14px)}
  to{opacity:1;transform:translateY(0)}
}
.ec-voc-anim{animation:ec-voc-fade-in .45s cubic-bezier(.22,1,.36,1) both}
@keyframes ec-voc-pop{0%{transform:scale(1)}50%{transform:scale(1.05)}100%{transform:scale(1)}}
.ec-voc-pop{animation:ec-voc-pop .4s cubic-bezier(.34,1.56,.64,1)}
@keyframes ec-voc-shake{
  0%,100%{transform:translateX(0)}
  20%{transform:translateX(-8px)}40%{transform:translateX(8px)}
  60%{transform:translateX(-5px)}80%{transform:translateX(5px)}
}
.ec-voc-shake{animation:ec-voc-shake .45s ease}

/* ============================================================
   RESPONSIVE — Tablet
   ============================================================ */
@media (max-width:1024px){
  .ec-voc-grid{grid-template-columns:minmax(0,1fr) 280px;gap:20px}
}

/* ============================================================
   RESPONSIVE — Mobile (single column, no overflow)
   ============================================================ */
@media (max-width:900px){
  .ec-voc-grid{
    grid-template-columns:minmax(0,1fr);
    gap:18px;
    width:100%;
    max-width:100%;
  }
  .ec-voc-grid > section,
  .ec-voc-grid > aside{
    min-width:0;
    max-width:100%;
    width:100%;
  }
  .ec-voc-hero{
    flex-direction:column;
    align-items:flex-start;
    min-height:0;
    padding:26px 22px;
  }
  .ec-voc-hero-mascot{
    position:absolute;
    right:14px;bottom:14px;
    transform:scale(.72);
    transform-origin:bottom right;
    animation:none;
    opacity:.95;
    pointer-events:none;
  }
  .ec-voc-grid > aside{order:2}
  .ec-voc-grid > section{order:1}
}

@media (max-width:720px){
  .ec-voc{
    padding-bottom:calc(var(--lang-nav-h) + var(--lang-safe));
  }

  .ec-voc-head{margin-bottom:14px}
  .ec-voc-eyebrow{font-size:10.5px;margin-bottom:4px}

  .ec-voc-hero{
    padding:22px 20px;
    border-radius:24px;
    margin-bottom:16px;
    box-shadow:0 12px 30px rgba(30,18,82,.28);
  }
  .ec-voc-hero h1{font-size:24px;line-height:1.12}
  .ec-voc-hero p{font-size:13.5px;margin-bottom:16px;max-width:100%}
  .ec-voc-hero-badge{font-size:9.5px;padding:6px 11px;margin-bottom:12px}

  .ec-voc-hero-stats{
    display:grid;
    grid-template-columns:repeat(2,minmax(0,1fr));
    gap:8px;
    width:100%;
    max-width:100%;
    margin-top:4px;
  }
  .ec-voc-hero-stat{
    padding:10px 12px;
    min-width:0;
    border-radius:14px;
    box-shadow:0 3px 0 var(--lang-ink);
  }
  .ec-voc-hero-stat strong{font-size:18px}
  .ec-voc-hero-stat span{font-size:9.5px}
  .ec-voc-hero-mascot{display:none}

  .ec-voc-tabs{
    position:sticky;
    top:0;
    z-index:20;
    background:rgba(255,255,255,.94);
    -webkit-backdrop-filter:blur(10px);
    backdrop-filter:blur(10px);
    margin:0;
    padding:10px 0 12px;
    border-bottom:2px solid rgba(23,16,46,.08);
    width:100%;
    max-width:100%;
  }
  .ec-voc-tab{
    padding:10px 16px;
    font-size:12.5px;
    min-height:42px;
    box-shadow:0 3px 0 var(--lang-line);
  }

  .ec-flash-wrap{min-height:260px;margin-bottom:16px}
  .ec-flash{height:260px}
  .ec-flash-face{padding:22px 18px;border-radius:24px;gap:12px}
  .ec-flash-word{font-size:clamp(26px,8vw,34px)}
  .ec-flash-back .ec-flash-word{font-size:20px}
  .ec-flash-sub{font-size:12.5px;line-height:1.5}
  .ec-flash-back .ec-flash-sub{font-size:13px}
  .ec-flash-pos{font-size:10px;padding:6px 12px}
  .ec-flash-hint{font-size:10px;bottom:14px}

  .ec-grade-row{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
  .ec-grade-btn{
    min-height:52px;
    font-size:13px;
    padding:12px 8px;
    border-radius:16px;
  }

  .ec-quiz-card{
    padding:20px 18px;
    border-radius:24px;
    box-shadow:0 6px 0 var(--lang-line);
  }
  .ec-quiz-question{font-size:16px;line-height:1.4;margin-bottom:16px}
  .ec-quiz-options{gap:10px;margin-bottom:14px}
  .ec-quiz-option{
    padding:14px 16px;
    font-size:14px;
    border-radius:16px;
    min-height:50px;
    box-shadow:0 3px 0 var(--lang-line);
  }
  .ec-quiz-option:hover:not(:disabled){transform:none;box-shadow:0 3px 0 var(--lang-line)}
  .ec-quiz-option:active:not(:disabled){transform:translateY(2px);box-shadow:0 1px 0 var(--lang-line)}
  .ec-quiz-top{gap:8px;margin-bottom:12px}
  .ec-quiz-badge{font-size:10px;padding:6px 11px}
  .ec-quiz-counter{font-size:11px}
  .ec-quiz-progress{height:10px;margin-bottom:16px}
  .ec-quiz-foot{font-size:11.5px;gap:6px}

  .ec-dict-bar{gap:8px}
  .ec-dict-search{padding:11px 16px;border-radius:999px}
  .ec-dict-search input{font-size:16px}
  .ec-dict-filters{gap:6px;margin-bottom:12px;padding-right:2px}
  .ec-dict-filter{padding:8px 13px;font-size:11.5px;min-height:38px}
  .ec-dict-list{gap:10px}
  .ec-dict-item{padding:16px 16px;border-radius:18px;box-shadow:0 4px 0 var(--lang-line)}
  .ec-dict-item:hover{transform:none;box-shadow:0 4px 0 var(--lang-line)}
  .ec-dict-item-head{margin-bottom:6px;gap:8px}
  .ec-dict-word{font-size:17px}
  .ec-dict-meaning{font-size:13.5px;margin-bottom:6px}
  .ec-dict-example{font-size:12.5px;margin-bottom:10px}
  .ec-dict-pos{font-size:10px;padding:3px 9px}
  .ec-dict-syn,.ec-dict-unit{font-size:11px;padding:3px 9px}
  .ec-dict-empty{padding:40px 18px;font-size:13px;border-radius:18px}

  .ec-voc-card{
    padding:18px 16px;
    border-radius:22px;
    margin-bottom:14px;
    box-shadow:0 5px 0 var(--lang-line);
  }
  .ec-voc-card h3{font-size:14px;margin-bottom:12px}
  .ec-voc-wod-word{font-size:24px}
  .ec-voc-wod-meaning{font-size:13px}
  .ec-voc-wod-ex{font-size:12.5px}
  .ec-voc-unit-btn{padding:10px 12px;font-size:12.5px;min-height:44px}
  .ec-voc-units{gap:6px}

  .ec-voc-toast{
    top:auto;
    bottom:calc(var(--lang-nav-h) + var(--lang-safe) - 90px);
    right:12px;
    left:12px;
    text-align:center;
    padding:12px 18px;
    font-size:13px;
    max-width:calc(100vw - 24px);
  }
}

@media (max-width:480px){
  .ec-voc-hero h1{font-size:22px}
  .ec-voc-hero p{font-size:13px}
  .ec-voc-hero-stat strong{font-size:16px}
  .ec-voc-hero-stat span{font-size:9px}

  .ec-flash{height:240px}
  .ec-flash-wrap{min-height:240px}
  .ec-flash-word{font-size:26px}
  .ec-flash-face{padding:18px 14px}

  .ec-quiz-card{padding:16px 14px}
  .ec-quiz-question{font-size:15px}
  .ec-quiz-option{padding:13px 14px;font-size:13.5px}

  .ec-grade-btn{font-size:12px;padding:10px 6px;min-height:48px}

  .ec-voc-tab{padding:9px 14px;font-size:12px}
  .ec-voc-tab svg{width:14px;height:14px}

  .ec-dict-search{padding:10px 14px}
}

@media (max-width:380px){
  .ec-voc-hero-stats{grid-template-columns:repeat(2,minmax(0,1fr))}
  .ec-voc-hero-stat strong{font-size:15px}
  .ec-voc-hero-stat span{font-size:8.5px}
  .ec-voc-hero h1{font-size:20px}
  .ec-flash-word{font-size:22px}
  .ec-flash-back .ec-flash-word{font-size:17px}
  .ec-flash{height:220px}
  .ec-flash-wrap{min-height:220px}
  .ec-dict-word{font-size:16px}
  .ec-quiz-question{font-size:14.5px}
  .ec-quiz-option{font-size:13px;padding:12px 12px}
}

@media (max-height:500px) and (orientation:landscape){
  .ec-flash{height:220px}
  .ec-flash-wrap{min-height:220px}
}

@media (prefers-reduced-motion: reduce){
  .ec-voc-anim,.ec-voc-pop,.ec-voc-shake,.ec-voc-toast{animation:none!important}
  .ec-voc-hero-orb{animation:none}
  .ec-voc-hero-mascot{animation:none}
  .ec-flash{transition:none}
}
`;

/* ============================================================
   CORE DICTIONARY  (~440 words across 10 units)
   ============================================================ */
const CORE_DICTIONARY = [
  /* ---------- Unit 1: Family & Friends ---------- */
  { w:'affection', pos:'noun', m:'a gentle feeling of liking or love', ex:'She has great affection for her grandmother.', syn:['love','fondness'], unit:1 },
  { w:'bond', pos:'noun', m:'a close connection between people', ex:'The bond between the two sisters is unbreakable.', syn:['tie','connection'], unit:1 },
  { w:'cherish', pos:'verb', m:'to love and care for something deeply', ex:'I cherish the memories of my childhood.', syn:['treasure','prize'], unit:1 },
  { w:'companion', pos:'noun', m:'a person who spends time with you', ex:'A dog is a loyal companion.', syn:['friend','mate'], unit:1 },
  { w:'concern', pos:'noun', m:'worry or care about someone or something', ex:'Her main concern is her family.', syn:['worry','care'], unit:1 },
  { w:'devoted', pos:'adjective', m:'very loving and loyal', ex:'He is a devoted father.', syn:['loyal','faithful'], unit:1 },
  { w:'esteem', pos:'noun', m:'respect and admiration', ex:'He is held in high esteem by his colleagues.', syn:['respect','regard'], unit:1 },
  { w:'familiar', pos:'adjective', m:'well known; easy to recognise', ex:'Her face looked familiar.', syn:['known','recognisable'], unit:1 },
  { w:'generous', pos:'adjective', m:'willing to give more than is necessary', ex:'She is very generous with her time.', syn:['liberal','openhanded'], unit:1 },
  { w:'grateful', pos:'adjective', m:'feeling thankful', ex:'I am grateful for your help.', syn:['thankful','appreciative'], unit:1 },
  { w:'harmony', pos:'noun', m:'peaceful agreement', ex:'The family lives in harmony.', syn:['peace','concord'], unit:1 },
  { w:'hospitable', pos:'adjective', m:'friendly and welcoming to guests', ex:'Bangladeshi people are very hospitable.', syn:['welcoming','friendly'], unit:1 },
  { w:'intimate', pos:'adjective', m:'very close and personal', ex:'They shared intimate details of their lives.', syn:['close','personal'], unit:1 },
  { w:'loyal', pos:'adjective', m:'always supporting someone', ex:'A loyal friend is a treasure.', syn:['faithful','devoted'], unit:1 },
  { w:'mutual', pos:'adjective', m:'shared by two or more people', ex:'The respect between them is mutual.', syn:['shared','reciprocal'], unit:1 },
  { w:'nurture', pos:'verb', m:'to care for and help grow', ex:'Parents nurture their children.', syn:['raise','foster'], unit:1 },
  { w:'reliable', pos:'adjective', m:'able to be trusted', ex:'She is a reliable friend.', syn:['dependable','trustworthy'], unit:1 },
  { w:'respect', pos:'noun', m:'a feeling of admiration', ex:'We should show respect to elders.', syn:['esteem','regard'], unit:1 },
  { w:'sincere', pos:'adjective', m:'honest and genuine', ex:'She gave a sincere apology.', syn:['honest','genuine'], unit:1 },
  { w:'sympathy', pos:'noun', m:'feeling of pity for someone', ex:'He expressed sympathy for the family.', syn:['compassion','pity'], unit:1 },
  { w:'trust', pos:'noun', m:'belief in someone’s honesty', ex:'Trust is the foundation of friendship.', syn:['faith','confidence'], unit:1 },
  { w:'understanding', pos:'noun', m:'the ability to understand', ex:'Mutual understanding is important.', syn:['comprehension','insight'], unit:1 },
  { w:'warmth', pos:'noun', m:'kindness and affection', ex:'She greeted us with warmth.', syn:['affection','friendliness'], unit:1 },
  { w:'welcome', pos:'verb', m:'to greet someone in a friendly way', ex:'We welcomed the guests warmly.', syn:['greet','receive'], unit:1 },
  { w:'youth', pos:'noun', m:'the period of being young', ex:'He spent his youth in Dhaka.', syn:['adolescence','boyhood'], unit:1 },
  { w:'acquaintance', pos:'noun', m:'a person you know slightly', ex:'He is just an acquaintance, not a close friend.', syn:['contact','associate'], unit:1 },
  { w:'affectionate', pos:'adjective', m:'showing warmth and love', ex:'She is affectionate towards her siblings.', syn:['loving','tender'], unit:1 },
  { w:'ally', pos:'noun', m:'a person who supports you', ex:'She has always been my closest ally.', syn:['supporter','partner'], unit:1 },
  { w:'attachment', pos:'noun', m:'a feeling of love or loyalty', ex:'She has a deep attachment to her hometown.', syn:['bond','fondness'], unit:1 },
  { w:'benevolent', pos:'adjective', m:'kind and generous', ex:'He is a benevolent grandfather.', syn:['kind','charitable'], unit:1 },
  { w:'bicker', pos:'verb', m:'to argue about small things', ex:'The siblings bickered over the remote.', syn:['squabble','quarrel'], unit:1 },
  { w:'confide', pos:'verb', m:'to tell someone a secret', ex:'She confided in her best friend.', syn:['disclose','entrust'], unit:1 },
  { w:'considerate', pos:'adjective', m:'thinking of others’ feelings', ex:'He is always considerate of his parents.', syn:['thoughtful','caring'], unit:1 },
  { w:'dependable', pos:'adjective', m:'able to be relied on', ex:'She is a dependable neighbour.', syn:['reliable','trustworthy'], unit:1 },
  { w:'empathy', pos:'noun', m:'the ability to understand others’ feelings', ex:'A good friend shows empathy.', syn:['compassion','understanding'], unit:1 },
  { w:'estranged', pos:'adjective', m:'no longer close or friendly', ex:'He became estranged from his cousin.', syn:['alienated','distant'], unit:1 },
  { w:'fellowship', pos:'noun', m:'friendly companionship', ex:'The club offers a sense of fellowship.', syn:['camaraderie','companionship'], unit:1 },
  { w:'foster', pos:'verb', m:'to encourage the growth of something', ex:'Parents foster confidence in children.', syn:['nurture','promote'], unit:1 },
  { w:'genuine', pos:'adjective', m:'real and sincere', ex:'His concern for her was genuine.', syn:['authentic','true'], unit:1 },
  { w:'kinship', pos:'noun', m:'a family relationship', ex:'They felt a sense of kinship despite living apart.', syn:['relation','connection'], unit:1 },
  { w:'obligation', pos:'noun', m:'a duty to do something', ex:'She feels an obligation to visit her parents.', syn:['duty','responsibility'], unit:1 },
  { w:'reconcile', pos:'verb', m:'to become friendly again after a quarrel', ex:'The brothers reconciled after years apart.', syn:['make peace','settle'], unit:1 },
  { w:'reunion', pos:'noun', m:'a meeting of people after a separation', ex:'The family reunion was held in Sylhet.', syn:['gathering','get-together'], unit:1 },
  { w:'sibling', pos:'noun', m:'a brother or sister', ex:'She has two siblings.', syn:['brother/sister','kin'], unit:1 },
  { w:'solidarity', pos:'noun', m:'unity based on shared interests', ex:'The neighbours showed solidarity during the flood.', syn:['unity','support'], unit:1 },
  { w:'tender', pos:'adjective', m:'gentle and kind', ex:'She gave her son a tender hug.', syn:['gentle','loving'], unit:1 },
  { w:'thoughtful', pos:'adjective', m:'showing care for others', ex:'It was a thoughtful gift.', syn:['considerate','caring'], unit:1 },
  { w:'unconditional', pos:'adjective', m:'without limits or conditions', ex:'A mother’s love is often unconditional.', syn:['absolute','unreserved'], unit:1 },
  { w:'vow', pos:'noun', m:'a serious promise', ex:'They exchanged marriage vows.', syn:['pledge','oath'], unit:1 },

  /* ---------- Unit 2: Education ---------- */
  { w:'academic', pos:'adjective', m:'related to education or study', ex:'Her academic results are excellent.', syn:['scholarly','educational'], unit:2 },
  { w:'achieve', pos:'verb', m:'to succeed in doing something', ex:'She achieved top marks in the exam.', syn:['accomplish','attain'], unit:2 },
  { w:'assignment', pos:'noun', m:'a piece of work given by a teacher', ex:'I finished my homework assignment.', syn:['task','homework'], unit:2 },
  { w:'curriculum', pos:'noun', m:'the subjects taught in a school', ex:'The curriculum includes maths and science.', syn:['syllabus','programme'], unit:2 },
  { w:'discipline', pos:'noun', m:'controlled behaviour; order', ex:'Discipline is key to success.', syn:['order','control'], unit:2 },
  { w:'diligent', pos:'adjective', m:'working hard and carefully', ex:'She is a diligent student.', syn:['hardworking','industrious'], unit:2 },
  { w:'educate', pos:'verb', m:'to teach someone', ex:'We should educate every child.', syn:['teach','instruct'], unit:2 },
  { w:'eligible', pos:'adjective', m:'having the right to do something', ex:'She is eligible for the scholarship.', syn:['qualified','entitled'], unit:2 },
  { w:'examination', pos:'noun', m:'a formal test', ex:'The examination starts at 10 AM.', syn:['test','exam'], unit:2 },
  { w:'expertise', pos:'noun', m:'great skill or knowledge', ex:'She has expertise in physics.', syn:['skill','mastery'], unit:2 },
  { w:'graduate', pos:'verb', m:'to complete a course of study', ex:'He graduated from Dhaka University.', syn:['complete','finish'], unit:2 },
  { w:'illustrate', pos:'verb', m:'to explain with examples or pictures', ex:'The teacher illustrated the point.', syn:['demonstrate','explain'], unit:2 },
  { w:'intelligent', pos:'adjective', m:'able to learn and understand well', ex:'She is an intelligent student.', syn:['clever','smart'], unit:2 },
  { w:'knowledge', pos:'noun', m:'information and understanding', ex:'Knowledge is power.', syn:['wisdom','learning'], unit:2 },
  { w:'lecture', pos:'noun', m:'a formal talk on a subject', ex:'The lecture was very informative.', syn:['talk','speech'], unit:2 },
  { w:'memorise', pos:'verb', m:'to learn something by heart', ex:'Students often memorise poems.', syn:['learn','commit to memory'], unit:2 },
  { w:'outstanding', pos:'adjective', m:'extremely good', ex:'She has an outstanding result.', syn:['excellent','remarkable'], unit:2 },
  { w:'prestigious', pos:'adjective', m:'respected and admired', ex:'He studies at a prestigious school.', syn:['renowned','esteemed'], unit:2 },
  { w:'progress', pos:'noun', m:'movement towards a goal', ex:'You are making good progress.', syn:['advance','development'], unit:2 },
  { w:'qualification', pos:'noun', m:'a certificate or skill', ex:'She has all the qualifications.', syn:['credential','certificate'], unit:2 },
  { w:'scholarship', pos:'noun', m:'money given to a student for study', ex:'He won a full scholarship.', syn:['grant','award'], unit:2 },
  { w:'study', pos:'verb', m:'to spend time learning', ex:'I study English every day.', syn:['learn','review'], unit:2 },
  { w:'successful', pos:'adjective', m:'achieving your goals', ex:'She is a successful doctor.', syn:['triumphant','prosperous'], unit:2 },
  { w:'tutor', pos:'noun', m:'a private teacher', ex:'Her tutor helped her with maths.', syn:['instructor','coach'], unit:2 },
  { w:'wisdom', pos:'noun', m:'good judgement based on experience', ex:'Age brings wisdom.', syn:['insight','sagacity'], unit:2 },
  { w:'analyse', pos:'verb', m:'to examine something in detail', ex:'Students must analyse the poem carefully.', syn:['examine','study'], unit:2 },
  { w:'apprentice', pos:'noun', m:'a person learning a trade', ex:'He worked as an apprentice carpenter.', syn:['trainee','learner'], unit:2 },
  { w:'aptitude', pos:'noun', m:'a natural ability to do something', ex:'She has an aptitude for mathematics.', syn:['talent','flair'], unit:2 },
  { w:'coursework', pos:'noun', m:'work done as part of a course', ex:'Her coursework counts towards the final grade.', syn:['assignment','project work'], unit:2 },
  { w:'comprehend', pos:'verb', m:'to understand something fully', ex:'It took time to comprehend the theory.', syn:['understand','grasp'], unit:2 },
  { w:'concentrate', pos:'verb', m:'to focus your attention', ex:'She concentrated hard during the test.', syn:['focus','attend'], unit:2 },
  { w:'conscientious', pos:'adjective', m:'careful and thorough in one’s work', ex:'He is a conscientious student.', syn:['diligent','meticulous'], unit:2 },
  { w:'curious', pos:'adjective', m:'eager to learn or know', ex:'Curious children ask many questions.', syn:['inquisitive','interested'], unit:2 },
  { w:'debate', pos:'noun', m:'a formal discussion of an issue', ex:'The class held a debate on climate change.', syn:['discussion','argument'], unit:2 },
  { w:'enrol', pos:'verb', m:'to officially join a course', ex:'She enrolled in an English course.', syn:['register','sign up'], unit:2 },
  { w:'evaluate', pos:'verb', m:'to judge the value of something', ex:'Teachers evaluate student progress regularly.', syn:['assess','appraise'], unit:2 },
  { w:'faculty', pos:'noun', m:'a department of a university', ex:'She teaches at the science faculty.', syn:['department','staff'], unit:2 },
  { w:'grasp', pos:'verb', m:'to understand something', ex:'It took a while to grasp the concept.', syn:['understand','comprehend'], unit:2 },
  { w:'hypothesis', pos:'noun', m:'an idea to be tested', ex:'The scientist tested her hypothesis.', syn:['theory','assumption'], unit:2 },
  { w:'literacy', pos:'noun', m:'the ability to read and write', ex:'Literacy rates have improved.', syn:['reading ability','education'], unit:2 },
  { w:'motivate', pos:'verb', m:'to give someone a reason to act', ex:'The teacher motivated her students.', syn:['inspire','encourage'], unit:2 },
  { w:'plagiarism', pos:'noun', m:'copying someone else’s work as your own', ex:'Plagiarism is strictly forbidden.', syn:['copying','theft'], unit:2 },
  { w:'proficient', pos:'adjective', m:'skilled at doing something', ex:'She is proficient in three languages.', syn:['skilled','competent'], unit:2 },
  { w:'revise', pos:'verb', m:'to study again before an exam', ex:'I need to revise before the test.', syn:['review','study'], unit:2 },
  { w:'scholar', pos:'noun', m:'a person with great knowledge', ex:'He is a respected scholar of history.', syn:['academic','expert'], unit:2 },
  { w:'seminar', pos:'noun', m:'a small class for discussion', ex:'We attended a seminar on ethics.', syn:['workshop','class'], unit:2 },
  { w:'syllabus', pos:'noun', m:'an outline of a course of study', ex:'Check the syllabus for exam topics.', syn:['curriculum','programme'], unit:2 },
  { w:'thesis', pos:'noun', m:'a long piece of research writing', ex:'She is writing her master’s thesis.', syn:['dissertation','paper'], unit:2 },
  { w:'vocabulary', pos:'noun', m:'the words known and used by a person', ex:'Reading builds your vocabulary.', syn:['lexicon','wordbank'], unit:2 },

  /* ---------- Unit 3: Nature & Environment ---------- */
  { w:'abundant', pos:'adjective', m:'existing in large quantities', ex:'Fish are abundant in this river.', syn:['plentiful','ample'], unit:3 },
  { w:'atmosphere', pos:'noun', m:'the air around the earth', ex:'Pollution damages the atmosphere.', syn:['air','sky'], unit:3 },
  { w:'biodiversity', pos:'noun', m:'the variety of plants and animals', ex:'The Sundarbans has rich biodiversity.', syn:['variety','diversity'], unit:3 },
  { w:'climate', pos:'noun', m:'the usual weather of a place', ex:'Bangladesh has a tropical climate.', syn:['weather','conditions'], unit:3 },
  { w:'conserve', pos:'verb', m:'to protect and save', ex:'We must conserve water.', syn:['preserve','protect'], unit:3 },
  { w:'deforestation', pos:'noun', m:'cutting down of forests', ex:'Deforestation causes flooding.', syn:['tree removal','forest loss'], unit:3 },
  { w:'drought', pos:'noun', m:'a long period without rain', ex:'The drought destroyed the crops.', syn:['dry spell','aridity'], unit:3 },
  { w:'ecosystem', pos:'noun', m:'a community of living things', ex:'The mangrove ecosystem is fragile.', syn:['habitat','biome'], unit:3 },
  { w:'endangered', pos:'adjective', m:'at risk of extinction', ex:'The Bengal tiger is endangered.', syn:['threatened','at risk'], unit:3 },
  { w:'erosion', pos:'noun', m:'gradual wearing away of soil', ex:'River erosion is a serious problem.', syn:['wearing away','corrosion'], unit:3 },
  { w:'fertile', pos:'adjective', m:'able to produce good crops', ex:'The soil here is very fertile.', syn:['productive','rich'], unit:3 },
  { w:'flood', pos:'noun', m:'overflow of water onto dry land', ex:'The flood destroyed many homes.', syn:['inundation','deluge'], unit:3 },
  { w:'forest', pos:'noun', m:'a large area with many trees', ex:'The forest is home to many animals.', syn:['woods','jungle'], unit:3 },
  { w:'greenhouse', pos:'noun', m:'a building for growing plants', ex:'Greenhouse gases cause warming.', syn:['glasshouse','hothouse'], unit:3 },
  { w:'habitat', pos:'noun', m:'the natural home of an animal', ex:'The panda’s habitat is shrinking.', syn:['home','environment'], unit:3 },
  { w:'harvest', pos:'noun', m:'the gathering of crops', ex:'The rice harvest was good this year.', syn:['crop','yield'], unit:3 },
  { w:'landscape', pos:'noun', m:'the visible features of an area', ex:'The landscape of Sylhet is beautiful.', syn:['scenery','terrain'], unit:3 },
  { w:'natural', pos:'adjective', m:'existing in nature', ex:'We should use natural resources wisely.', syn:['innate','wild'], unit:3 },
  { w:'pollution', pos:'noun', m:'harmful substances in the environment', ex:'Air pollution affects our health.', syn:['contamination','dirt'], unit:3 },
  { w:'preserve', pos:'verb', m:'to keep something safe', ex:'We must preserve the environment.', syn:['protect','conserve'], unit:3 },
  { w:'recycle', pos:'verb', m:'to reuse materials', ex:'Recycle plastic to save the planet.', syn:['reuse','reprocess'], unit:3 },
  { w:'resource', pos:'noun', m:'a useful material or supply', ex:'Water is a precious resource.', syn:['asset','supply'], unit:3 },
  { w:'rural', pos:'adjective', m:'relating to the countryside', ex:'Rural life is peaceful.', syn:['pastoral','country'], unit:3 },
  { w:'scenery', pos:'noun', m:'natural features of a landscape', ex:'The scenery of Cox’s Bazar is stunning.', syn:['view','vista'], unit:3 },
  { w:'species', pos:'noun', m:'a group of similar living things', ex:'Many species are becoming extinct.', syn:['kind','type'], unit:3 },
  { w:'sustainable', pos:'adjective', m:'able to continue without harm', ex:'We need sustainable development.', syn:['viable','maintainable'], unit:3 },
  { w:'urban', pos:'adjective', m:'relating to a city', ex:'Urban life has its challenges.', syn:['metropolitan','city'], unit:3 },
  { w:'wildlife', pos:'noun', m:'wild animals and plants', ex:'Wildlife must be protected.', syn:['fauna','nature'], unit:3 },
  { w:'arid', pos:'adjective', m:'having very little rainfall', ex:'The arid region receives little rain.', syn:['dry','parched'], unit:3 },
  { w:'canopy', pos:'noun', m:'the top layer of a forest', ex:'Monkeys move through the forest canopy.', syn:['treetop','cover'], unit:3 },
  { w:'carbon footprint', pos:'noun', m:'the amount of carbon dioxide a person produces', ex:'Cycling reduces your carbon footprint.', syn:['emissions','impact'], unit:3 },
  { w:'contaminate', pos:'verb', m:'to make something impure', ex:'Chemicals contaminated the river.', syn:['pollute','taint'], unit:3 },
  { w:'depletion', pos:'noun', m:'the reduction in amount of something', ex:'Ozone depletion is a global concern.', syn:['reduction','exhaustion'], unit:3 },
  { w:'emission', pos:'noun', m:'a substance released into the air', ex:'Factories must cut carbon emissions.', syn:['discharge','output'], unit:3 },
  { w:'extinct', pos:'adjective', m:'no longer existing', ex:'The dodo is an extinct bird.', syn:['dead','vanished'], unit:3 },
  { w:'fossil fuel', pos:'noun', m:'fuel formed from ancient remains', ex:'We rely too heavily on fossil fuels.', syn:['coal','oil'], unit:3 },
  { w:'irrigation', pos:'noun', m:'supplying land with water', ex:'Irrigation helps crops grow in dry areas.', syn:['watering','water supply'], unit:3 },
  { w:'mangrove', pos:'noun', m:'a tree that grows in coastal swamps', ex:'The Sundarbans is famous for its mangroves.', syn:['swamp tree','coastal forest'], unit:3 },
  { w:'organic', pos:'adjective', m:'grown without chemicals', ex:'She only buys organic vegetables.', syn:['natural','chemical-free'], unit:3 },
  { w:'renewable', pos:'adjective', m:'able to be replaced naturally', ex:'Solar power is a renewable energy source.', syn:['sustainable','replenishable'], unit:3 },
  { w:'reservoir', pos:'noun', m:'a place where water is stored', ex:'The reservoir supplies water to the city.', syn:['tank','basin'], unit:3 },
  { w:'sediment', pos:'noun', m:'matter that settles at the bottom of water', ex:'Sediment builds up near the river mouth.', syn:['silt','deposit'], unit:3 },
  { w:'terrain', pos:'noun', m:'the physical features of land', ex:'The hilly terrain made walking difficult.', syn:['landscape','ground'], unit:3 },
  { w:'toxic', pos:'adjective', m:'poisonous', ex:'The factory released toxic waste.', syn:['poisonous','harmful'], unit:3 },
  { w:'tropical', pos:'adjective', m:'relating to the hottest regions of the earth', ex:'Bangladesh has a tropical monsoon climate.', syn:['equatorial','humid'], unit:3 },
  { w:'vegetation', pos:'noun', m:'plants in an area', ex:'Dense vegetation covers the hillside.', syn:['plant life','flora'], unit:3 },
  { w:'wetland', pos:'noun', m:'land that is covered by water', ex:'Wetlands support many bird species.', syn:['marsh','swamp'], unit:3 },

  /* ---------- Unit 4: Health & Fitness ---------- */
  { w:'allergy', pos:'noun', m:'a bad reaction to something', ex:'She has a peanut allergy.', syn:['sensitivity','intolerance'], unit:4 },
  { w:'balanced', pos:'adjective', m:'having the right amounts', ex:'Eat a balanced diet.', syn:['proportionate','harmonious'], unit:4 },
  { w:'calorie', pos:'noun', m:'a unit of energy in food', ex:'This cake has many calories.', syn:['energy unit','kilocalorie'], unit:4 },
  { w:'chronic', pos:'adjective', m:'continuing for a long time', ex:'He has a chronic illness.', syn:['persistent','long-term'], unit:4 },
  { w:'cure', pos:'verb', m:'to make someone healthy again', ex:'Doctors can cure many diseases.', syn:['heal','treat'], unit:4 },
  { w:'diet', pos:'noun', m:'the food you usually eat', ex:'A healthy diet includes fruits.', syn:['nutrition','food'], unit:4 },
  { w:'exercise', pos:'noun', m:'physical activity for health', ex:'Regular exercise keeps you fit.', syn:['workout','training'], unit:4 },
  { w:'fatigue', pos:'noun', m:'extreme tiredness', ex:'He suffers from constant fatigue.', syn:['tiredness','exhaustion'], unit:4 },
  { w:'fitness', pos:'noun', m:'the state of being physically healthy', ex:'Yoga improves fitness.', syn:['health','wellness'], unit:4 },
  { w:'hygiene', pos:'noun', m:'practices for keeping clean', ex:'Good hygiene prevents disease.', syn:['cleanliness','sanitation'], unit:4 },
  { w:'immune', pos:'adjective', m:'protected against a disease', ex:'Vaccines make us immune.', syn:['resistant','protected'], unit:4 },
  { w:'infection', pos:'noun', m:'a disease caused by germs', ex:'Wash your hands to prevent infection.', syn:['disease','contagion'], unit:4 },
  { w:'injury', pos:'noun', m:'physical harm', ex:'He suffered an injury during the match.', syn:['wound','damage'], unit:4 },
  { w:'medicine', pos:'noun', m:'a substance used to treat illness', ex:'Take your medicine on time.', syn:['drug','remedy'], unit:4 },
  { w:'mental', pos:'adjective', m:'relating to the mind', ex:'Mental health is as important as physical health.', syn:['psychological','cognitive'], unit:4 },
  { w:'nutrition', pos:'noun', m:'the process of getting food', ex:'Good nutrition helps growth.', syn:['nourishment','diet'], unit:4 },
  { w:'obesity', pos:'noun', m:'being extremely overweight', ex:'Obesity is a growing problem.', syn:['overweight','corpulence'], unit:4 },
  { w:'patient', pos:'noun', m:'a person receiving medical care', ex:'The patient is recovering well.', syn:['sufferer','client'], unit:4 },
  { w:'physical', pos:'adjective', m:'relating to the body', ex:'Physical activity keeps us healthy.', syn:['bodily','corporeal'], unit:4 },
  { w:'prescription', pos:'noun', m:'a doctor’s written order for medicine', ex:'The doctor gave me a prescription.', syn:['order','script'], unit:4 },
  { w:'prevention', pos:'noun', m:'stopping something from happening', ex:'Prevention is better than cure.', syn:['avoidance','precaution'], unit:4 },
  { w:'recovery', pos:'noun', m:'returning to good health', ex:'Her recovery took three weeks.', syn:['healing','recuperation'], unit:4 },
  { w:'stress', pos:'noun', m:'mental or emotional pressure', ex:'Exams cause a lot of stress.', syn:['tension','pressure'], unit:4 },
  { w:'symptom', pos:'noun', m:'a sign of illness', ex:'Fever is a common symptom.', syn:['sign','indication'], unit:4 },
  { w:'therapy', pos:'noun', m:'treatment for illness', ex:'She is undergoing therapy.', syn:['treatment','remedy'], unit:4 },
  { w:'vitamin', pos:'noun', m:'a nutrient the body needs', ex:'Oranges are rich in vitamin C.', syn:['nutrient','supplement'], unit:4 },
  { w:'wellness', pos:'noun', m:'the state of being healthy', ex:'Wellness is a lifelong journey.', syn:['health','fitness'], unit:4 },
  { w:'ailment', pos:'noun', m:'a minor illness', ex:'He suffers from a common ailment.', syn:['illness','sickness'], unit:4 },
  { w:'cardiovascular', pos:'adjective', m:'relating to the heart and blood vessels', ex:'Running improves cardiovascular health.', syn:['heart-related','circulatory'], unit:4 },
  { w:'diagnose', pos:'verb', m:'to identify a disease', ex:'The doctor diagnosed the illness quickly.', syn:['identify','detect'], unit:4 },
  { w:'endorphin', pos:'noun', m:'a hormone that reduces pain and boosts mood', ex:'Exercise releases endorphins.', syn:['hormone','mood chemical'], unit:4 },
  { w:'epidemic', pos:'noun', m:'a widespread outbreak of disease', ex:'The epidemic spread across the region.', syn:['outbreak','plague'], unit:4 },
  { w:'first aid', pos:'noun', m:'basic emergency medical treatment', ex:'She gave first aid to the injured man.', syn:['emergency care'], unit:4 },
  { w:'immunity', pos:'noun', m:'protection against disease', ex:'Vaccines build immunity.', syn:['resistance','protection'], unit:4 },
  { w:'inflammation', pos:'noun', m:'redness and swelling caused by injury', ex:'The wound showed signs of inflammation.', syn:['swelling','irritation'], unit:4 },
  { w:'insomnia', pos:'noun', m:'the inability to sleep', ex:'Stress often causes insomnia.', syn:['sleeplessness'], unit:4 },
  { w:'nutrient', pos:'noun', m:'a substance needed for growth', ex:'Vegetables are full of nutrients.', syn:['nourishment','vitamin'], unit:4 },
  { w:'obese', pos:'adjective', m:'extremely overweight', ex:'Poor diet can make people obese.', syn:['overweight','fat'], unit:4 },
  { w:'physiotherapy', pos:'noun', m:'treatment using physical exercises', ex:'He attends physiotherapy after his injury.', syn:['physical therapy'], unit:4 },
  { w:'posture', pos:'noun', m:'the position of the body', ex:'Good posture prevents back pain.', syn:['stance','carriage'], unit:4 },
  { w:'rehabilitation', pos:'noun', m:'the process of recovering health or ability', ex:'He is undergoing rehabilitation after surgery.', syn:['recovery','treatment'], unit:4 },
  { w:'resilient', pos:'adjective', m:'able to recover quickly', ex:'Children are often physically resilient.', syn:['tough','hardy'], unit:4 },
  { w:'sanitation', pos:'noun', m:'systems for keeping places clean', ex:'Good sanitation prevents disease.', syn:['hygiene','cleanliness'], unit:4 },
  { w:'sedentary', pos:'adjective', m:'involving little physical activity', ex:'A sedentary lifestyle can cause health problems.', syn:['inactive','stationary'], unit:4 },
  { w:'stamina', pos:'noun', m:'the ability to sustain physical effort', ex:'Marathon runners need great stamina.', syn:['endurance','energy'], unit:4 },
  { w:'vaccinate', pos:'verb', m:'to give a vaccine to prevent disease', ex:'Children should be vaccinated on time.', syn:['immunise','inoculate'], unit:4 },

  /* ---------- Unit 5: Travel & Culture ---------- */
  { w:'accommodation', pos:'noun', m:'a place to stay', ex:'We booked hotel accommodation.', syn:['lodging','housing'], unit:5 },
  { w:'adventure', pos:'noun', m:'an exciting experience', ex:'The trip was a real adventure.', syn:['exploit','escapade'], unit:5 },
  { w:'ancestor', pos:'noun', m:'a family member from long ago', ex:'Our ancestors built this village.', syn:['forefather','predecessor'], unit:5 },
  { w:'architecture', pos:'noun', m:'the design of buildings', ex:'The architecture of Lalbagh Fort is stunning.', syn:['design','structure'], unit:5 },
  { w:'attraction', pos:'noun', m:'a place that draws visitors', ex:'The museum is a major attraction.', syn:['draw','appeal'], unit:5 },
  { w:'culture', pos:'noun', m:'the customs of a people', ex:'Bangali culture is rich and diverse.', syn:['tradition','heritage'], unit:5 },
  { w:'custom', pos:'noun', m:'a traditional practice', ex:'It is a custom to greet elders.', syn:['tradition','practice'], unit:5 },
  { w:'destination', pos:'noun', m:'the place you are travelling to', ex:'Cox’s Bazar is a popular destination.', syn:['goal','end point'], unit:5 },
  { w:'diverse', pos:'adjective', m:'varied; different from each other', ex:'Bangladesh has a diverse culture.', syn:['varied','assorted'], unit:5 },
  { w:'festival', pos:'noun', m:'a special celebration', ex:'Pohela Boishakh is a famous festival.', syn:['celebration','fête'], unit:5 },
  { w:'heritage', pos:'noun', m:'traditions passed down', ex:'We must protect our heritage.', syn:['legacy','tradition'], unit:5 },
  { w:'hospitality', pos:'noun', m:'friendly treatment of guests', ex:'Their hospitality was unforgettable.', syn:['welcome','generosity'], unit:5 },
  { w:'itinerary', pos:'noun', m:'a planned route of travel', ex:'Our itinerary includes three cities.', syn:['plan','schedule'], unit:5 },
  { w:'journey', pos:'noun', m:'travel from one place to another', ex:'The journey took ten hours.', syn:['trip','voyage'], unit:5 },
  { w:'landmark', pos:'noun', m:'an important building or site', ex:'The Shaheed Minar is a landmark.', syn:['monument','feature'], unit:5 },
  { w:'legacy', pos:'noun', m:'something left by a predecessor', ex:'His legacy lives on.', syn:['heritage','inheritance'], unit:5 },
  { w:'memorable', pos:'adjective', m:'worth remembering', ex:'It was a memorable trip.', syn:['unforgettable','notable'], unit:5 },
  { w:'monument', pos:'noun', m:'a structure honouring a person or event', ex:'The monument stands in the square.', syn:['memorial','statue'], unit:5 },
  { w:'native', pos:'adjective', m:'belonging to a place by birth', ex:'She is a native of Sylhet.', syn:['indigenous','local'], unit:5 },
  { w:'pilgrimage', pos:'noun', m:'a journey to a holy place', ex:'Hajj is a pilgrimage to Makkah.', syn:['holy journey','pilgrim’s journey'], unit:5 },
  { w:'resort', pos:'noun', m:'a place for holidays', ex:'We stayed at a beach resort.', syn:['retreat','spa'], unit:5 },
  { w:'souvenir', pos:'noun', m:'something kept as a reminder', ex:'I bought a souvenir from Cox’s Bazar.', syn:['keepsake','memento'], unit:5 },
  { w:'tourism', pos:'noun', m:'the business of holidays', ex:'Tourism brings money to the region.', syn:['travel industry','holiday trade'], unit:5 },
  { w:'tradition', pos:'noun', m:'a long-established custom', ex:'It is a family tradition.', syn:['custom','convention'], unit:5 },
  { w:'voyage', pos:'noun', m:'a long journey by sea', ex:'The voyage lasted three months.', syn:['cruise','expedition'], unit:5 },
  { w:'baggage', pos:'noun', m:'bags and suitcases for a trip', ex:'Check your baggage before boarding.', syn:['luggage','bags'], unit:5 },
  { w:'boarding pass', pos:'noun', m:'a document allowing entry to a flight', ex:'Please show your boarding pass.', syn:['ticket'], unit:5 },
  { w:'commemorate', pos:'verb', m:'to honour the memory of something', ex:'The festival commemorates the harvest.', syn:['celebrate','honour'], unit:5 },
  { w:'cosmopolitan', pos:'adjective', m:'containing people from many countries', ex:'Dhaka is becoming more cosmopolitan.', syn:['international','diverse'], unit:5 },
  { w:'customary', pos:'adjective', m:'usual or traditional', ex:'It is customary to remove shoes indoors.', syn:['traditional','usual'], unit:5 },
  { w:'excursion', pos:'noun', m:'a short trip for pleasure', ex:'We went on a day excursion to the hills.', syn:['outing','trip'], unit:5 },
  { w:'exotic', pos:'adjective', m:'unusual and from a foreign country', ex:'They tried exotic fruits abroad.', syn:['foreign','unusual'], unit:5 },
  { w:'expedition', pos:'noun', m:'a journey for a specific purpose', ex:'The team went on a mountain expedition.', syn:['journey','trek'], unit:5 },
  { w:'immigrant', pos:'noun', m:'a person who moves to another country', ex:'The immigrant found work in the city.', syn:['migrant','settler'], unit:5 },
  { w:'indigenous', pos:'adjective', m:'originating naturally in a place', ex:'The Chakma are an indigenous people.', syn:['native','local'], unit:5 },
  { w:'nomadic', pos:'adjective', m:'moving from place to place', ex:'They lead a nomadic lifestyle.', syn:['wandering','itinerant'], unit:5 },
  { w:'panorama', pos:'noun', m:'a wide view of an area', ex:'The hill offers a panorama of the valley.', syn:['view','vista'], unit:5 },
  { w:'quaint', pos:'adjective', m:'attractively old-fashioned', ex:'They stayed in a quaint village.', syn:['charming','picturesque'], unit:5 },
  { w:'ritual', pos:'noun', m:'a series of actions in a ceremony', ex:'The wedding ritual lasted all day.', syn:['ceremony','rite'], unit:5 },
  { w:'sightseeing', pos:'noun', m:'visiting interesting places', ex:'We spent the day sightseeing.', syn:['touring','exploring'], unit:5 },
  { w:'transit', pos:'noun', m:'the act of passing through a place', ex:'We had a two-hour transit in Dubai.', syn:['stopover','passage'], unit:5 },
  { w:'trek', pos:'noun', m:'a long, difficult journey on foot', ex:'They went on a trek in the hills.', syn:['hike','march'], unit:5 },
  { w:'visa', pos:'noun', m:'official permission to enter a country', ex:'She applied for a student visa.', syn:['permit','authorisation'], unit:5 },
  { w:'wanderlust', pos:'noun', m:'a strong desire to travel', ex:'Her wanderlust took her across Asia.', syn:['travel bug'], unit:5 },

  /* ---------- Unit 6: Science & Technology ---------- */
  { w:'algorithm', pos:'noun', m:'a set of steps for solving a problem', ex:'The algorithm sorts data quickly.', syn:['procedure','method'], unit:6 },
  { w:'artificial', pos:'adjective', m:'made by humans, not natural', ex:'Artificial intelligence is changing the world.', syn:['synthetic','man-made'], unit:6 },
  { w:'automation', pos:'noun', m:'the use of machines to do work', ex:'Automation increases productivity.', syn:['mechanisation','robotisation'], unit:6 },
  { w:'breakthrough', pos:'noun', m:'an important discovery', ex:'Scientists made a breakthrough.', syn:['discovery','advance'], unit:6 },
  { w:'circuit', pos:'noun', m:'a path for electric current', ex:'The circuit was broken.', syn:['loop','path'], unit:6 },
  { w:'digital', pos:'adjective', m:'using electronic technology', ex:'We live in a digital age.', syn:['electronic','computerised'], unit:6 },
  { w:'discovery', pos:'noun', m:'finding something new', ex:'The discovery changed medicine.', syn:['finding','breakthrough'], unit:6 },
  { w:'engineer', pos:'noun', m:'a person who designs machines', ex:'She is a software engineer.', syn:['designer','developer'], unit:6 },
  { w:'experiment', pos:'noun', m:'a scientific test', ex:'The experiment proved the theory.', syn:['test','trial'], unit:6 },
  { w:'innovation', pos:'noun', m:'a new idea or method', ex:'Innovation drives progress.', syn:['invention','novelty'], unit:6 },
  { w:'internet', pos:'noun', m:'a global computer network', ex:'The internet connects the world.', syn:['web','cyberspace'], unit:6 },
  { w:'invention', pos:'noun', m:'something new that is created', ex:'The telephone was a great invention.', syn:['creation','innovation'], unit:6 },
  { w:'laboratory', pos:'noun', m:'a room for scientific work', ex:'Experiments are done in the laboratory.', syn:['lab','workshop'], unit:6 },
  { w:'machine', pos:'noun', m:'a device that does work', ex:'The machine produces shoes.', syn:['device','apparatus'], unit:6 },
  { w:'microscope', pos:'noun', m:'an instrument for viewing tiny objects', ex:'We saw cells under the microscope.', syn:['magnifier','scope'], unit:6 },
  { w:'network', pos:'noun', m:'a group of connected things', ex:'The network covers the whole city.', syn:['system','web'], unit:6 },
  { w:'physics', pos:'noun', m:'the science of matter and energy', ex:'Physics explains motion.', syn:['science','mechanics'], unit:6 },
  { w:'progress', pos:'noun', m:'advancement over time', ex:'Technological progress is rapid.', syn:['advance','development'], unit:6 },
  { w:'research', pos:'noun', m:'careful study to find facts', ex:'She conducts cancer research.', syn:['study','investigation'], unit:6 },
  { w:'robot', pos:'noun', m:'a machine that does tasks automatically', ex:'Robots work in factories.', syn:['android','automaton'], unit:6 },
  { w:'satellite', pos:'noun', m:'an object orbiting a planet', ex:'The satellite sends signals.', syn:['spacecraft','orbiter'], unit:6 },
  { w:'software', pos:'noun', m:'programs used by a computer', ex:'The software is easy to use.', syn:['program','application'], unit:6 },
  { w:'technology', pos:'noun', m:'the use of scientific knowledge', ex:'Technology is advancing fast.', syn:['engineering','science'], unit:6 },
  { w:'theory', pos:'noun', m:'an idea explaining something', ex:'Darwin’s theory of evolution.', syn:['hypothesis','idea'], unit:6 },
  { w:'vaccine', pos:'noun', m:'a substance that protects against disease', ex:'The vaccine saved millions.', syn:['immunisation','inoculation'], unit:6 },
  { w:'artificial intelligence', pos:'noun', m:'computer systems that mimic human thinking', ex:'Artificial intelligence powers many apps today.', syn:['AI','machine intelligence'], unit:6 },
  { w:'bandwidth', pos:'noun', m:'the capacity of a network to transfer data', ex:'Video calls need more bandwidth.', syn:['capacity','data rate'], unit:6 },
  { w:'biotechnology', pos:'noun', m:'technology based on biology', ex:'Biotechnology has improved crop yields.', syn:['bioscience'], unit:6 },
  { w:'compatible', pos:'adjective', m:'able to work together', ex:'This charger is compatible with most phones.', syn:['suitable','matching'], unit:6 },
  { w:'database', pos:'noun', m:'an organised set of data', ex:'The database stores customer records.', syn:['data store','archive'], unit:6 },
  { w:'encryption', pos:'noun', m:'the process of coding information', ex:'Encryption protects your passwords.', syn:['encoding','coding'], unit:6 },
  { w:'firmware', pos:'noun', m:'software built into hardware', ex:'Update the firmware to fix the bug.', syn:['embedded software'], unit:6 },
  { w:'gadget', pos:'noun', m:'a small useful device', ex:'She loves the latest gadgets.', syn:['device','tool'], unit:6 },
  { w:'genome', pos:'noun', m:'the complete genetic material of an organism', ex:'Scientists mapped the human genome.', syn:['genetic code'], unit:6 },
  { w:'malfunction', pos:'verb', m:'to fail to work properly', ex:'The engine malfunctioned mid-flight.', syn:['break down','fail'], unit:6 },
  { w:'nanotechnology', pos:'noun', m:'technology at a very small scale', ex:'Nanotechnology may transform medicine.', syn:['nanoscience'], unit:6 },
  { w:'obsolete', pos:'adjective', m:'no longer in use', ex:'The old software is now obsolete.', syn:['outdated','out of date'], unit:6 },
  { w:'prototype', pos:'noun', m:'an early model of a product', ex:'Engineers built a working prototype.', syn:['model','sample'], unit:6 },
  { w:'quantum', pos:'adjective', m:'relating to the smallest units of energy', ex:'Quantum computers could change everything.', syn:['subatomic'], unit:6 },
  { w:'server', pos:'noun', m:'a computer that provides data to others', ex:'The server crashed during the update.', syn:['host computer'], unit:6 },
  { w:'simulate', pos:'verb', m:'to imitate a process using a model', ex:'The program simulates weather patterns.', syn:['model','mimic'], unit:6 },
  { w:'synthesise', pos:'verb', m:'to combine parts into a whole', ex:'Scientists synthesised a new compound.', syn:['combine','create'], unit:6 },
  { w:'upload', pos:'verb', m:'to send data to a remote system', ex:'She uploaded the files to the cloud.', syn:['transfer','send'], unit:6 },
  { w:'virtual reality', pos:'noun', m:'a computer-generated simulated environment', ex:'Virtual reality is used in training.', syn:['VR'], unit:6 },

  /* ---------- Unit 7: Sports & Games ---------- */
  { w:'athlete', pos:'noun', m:'a person who plays sports', ex:'The athlete won gold.', syn:['sportsperson','player'], unit:7 },
  { w:'captain', pos:'noun', m:'the leader of a team', ex:'He is the team captain.', syn:['leader','skipper'], unit:7 },
  { w:'champion', pos:'noun', m:'the winner of a competition', ex:'She became the world champion.', syn:['winner','victor'], unit:7 },
  { w:'coach', pos:'noun', m:'a person who trains athletes', ex:'The coach trained them hard.', syn:['trainer','instructor'], unit:7 },
  { w:'compete', pos:'verb', m:'to take part in a contest', ex:'Ten teams will compete.', syn:['contend','vie'], unit:7 },
  { w:'defeat', pos:'verb', m:'to beat someone in a contest', ex:'They defeated the rivals.', syn:['beat','overcome'], unit:7 },
  { w:'endurance', pos:'noun', m:'the ability to keep going', ex:'Running requires endurance.', syn:['stamina','persistence'], unit:7 },
  { w:'exercise', pos:'noun', m:'physical activity', ex:'Exercise keeps you healthy.', syn:['workout','training'], unit:7 },
  { w:'fitness', pos:'noun', m:'good physical condition', ex:'Fitness is important for athletes.', syn:['health','conditioning'], unit:7 },
  { w:'league', pos:'noun', m:'a group of teams that compete', ex:'The football league begins today.', syn:['association','conference'], unit:7 },
  { w:'match', pos:'noun', m:'a sports contest', ex:'The match ended in a draw.', syn:['game','contest'], unit:7 },
  { w:'medal', pos:'noun', m:'a metal disc given as an award', ex:'He won a silver medal.', syn:['award','decoration'], unit:7 },
  { w:'opponent', pos:'noun', m:'a person you compete against', ex:'My opponent was strong.', syn:['rival','adversary'], unit:7 },
  { w:'referee', pos:'noun', m:'the official who enforces rules', ex:'The referee blew the whistle.', syn:['umpire','judge'], unit:7 },
  { w:'score', pos:'noun', m:'the number of points', ex:'The final score was 3-1.', syn:['points','tally'], unit:7 },
  { w:'stadium', pos:'noun', m:'a large sports venue', ex:'The stadium was full.', syn:['arena','ground'], unit:7 },
  { w:'tactic', pos:'noun', m:'a plan to achieve a goal', ex:'The coach changed tactics.', syn:['strategy','plan'], unit:7 },
  { w:'team', pos:'noun', m:'a group playing together', ex:'The team practised daily.', syn:['squad','side'], unit:7 },
  { w:'tournament', pos:'noun', m:'a series of contests', ex:'The tournament lasted two weeks.', syn:['competition','championship'], unit:7 },
  { w:'training', pos:'noun', m:'preparation for sports', ex:'Training begins at dawn.', syn:['practice','drill'], unit:7 },
  { w:'trophy', pos:'noun', m:'a cup given as a prize', ex:'They lifted the trophy.', syn:['cup','prize'], unit:7 },
  { w:'victory', pos:'noun', m:'success in a contest', ex:'The victory was well deserved.', syn:['triumph','win'], unit:7 },
  { w:'agility', pos:'noun', m:'the ability to move quickly and easily', ex:'The gymnast showed great agility.', syn:['nimbleness','quickness'], unit:7 },
  { w:'amateur', pos:'noun', m:'a person who does something for pleasure, not pay', ex:'He started as an amateur boxer.', syn:['nonprofessional','hobbyist'], unit:7 },
  { w:'disqualify', pos:'verb', m:'to remove from a competition for breaking rules', ex:'The runner was disqualified for a false start.', syn:['bar','exclude'], unit:7 },
  { w:'draw', pos:'noun', m:'a game that ends with equal scores', ex:'The match ended in a 1-1 draw.', syn:['tie','stalemate'], unit:7 },
  { w:'foul', pos:'noun', m:'an action that breaks the rules', ex:'The referee called a foul.', syn:['violation','infringement'], unit:7 },
  { w:'gymnastics', pos:'noun', m:'exercises that show strength and flexibility', ex:'She practises gymnastics every day.', syn:['acrobatics'], unit:7 },
  { w:'marathon', pos:'noun', m:'a long-distance running race', ex:'He finished the marathon in four hours.', syn:['long race'], unit:7 },
  { w:'mascot', pos:'noun', m:'an animal or figure representing a team', ex:'The team’s mascot entertained the crowd.', syn:['symbol','emblem'], unit:7 },
  { w:'penalty', pos:'noun', m:'a punishment for breaking a rule', ex:'The team was awarded a penalty kick.', syn:['punishment','sanction'], unit:7 },
  { w:'qualify', pos:'verb', m:'to earn the right to compete', ex:'They qualified for the finals.', syn:['earn a place','advance'], unit:7 },
  { w:'relay', pos:'noun', m:'a race between teams passing a baton', ex:'The relay team broke the record.', syn:['relay race'], unit:7 },
  { w:'rival', pos:'noun', m:'a person or team competing against another', ex:'The two clubs are fierce rivals.', syn:['opponent','competitor'], unit:7 },
  { w:'spectator', pos:'noun', m:'a person watching an event', ex:'Thousands of spectators filled the stadium.', syn:['viewer','onlooker'], unit:7 },
  { w:'sportsmanship', pos:'noun', m:'fair and generous behaviour in sport', ex:'He showed great sportsmanship after losing.', syn:['fair play'], unit:7 },
  { w:'strategy', pos:'noun', m:'a plan to achieve success', ex:'The coach explained the game strategy.', syn:['plan','tactic'], unit:7 },
  { w:'substitute', pos:'noun', m:'a player who replaces another', ex:'The substitute scored the winning goal.', syn:['replacement','reserve'], unit:7 },
  { w:'underdog', pos:'noun', m:'a competitor expected to lose', ex:'The underdog team won the championship.', syn:['long shot'], unit:7 },
  { w:'warm-up', pos:'noun', m:'light exercise before an activity', ex:'A good warm-up prevents injury.', syn:['stretching'], unit:7 },

  /* ---------- Unit 8: Food & Cuisine ---------- */
  { w:'appetite', pos:'noun', m:'the desire to eat', ex:'Exercise increases appetite.', syn:['hunger','desire'], unit:8 },
  { w:'beverage', pos:'noun', m:'a drink', ex:'Tea is a popular beverage.', syn:['drink','liquid'], unit:8 },
  { w:'cuisine', pos:'noun', m:'a style of cooking', ex:'Bangali cuisine is flavourful.', syn:['cooking','food'], unit:8 },
  { w:'delicious', pos:'adjective', m:'tasting very good', ex:'The biryani was delicious.', syn:['tasty','scrumptious'], unit:8 },
  { w:'delicacy', pos:'noun', m:'a special food', ex:'Hilsa is a Bengali delicacy.', syn:['speciality','treat'], unit:8 },
  { w:'diet', pos:'noun', m:'the usual food one eats', ex:'A vegetarian diet is healthy.', syn:['nutrition','food'], unit:8 },
  { w:'feast', pos:'noun', m:'a large special meal', ex:'They had a feast at the wedding.', syn:['banquet','meal'], unit:8 },
  { w:'flavour', pos:'noun', m:'the taste of food', ex:'The curry had a rich flavour.', syn:['taste','savour'], unit:8 },
  { w:'fresh', pos:'adjective', m:'recently made or picked', ex:'Fresh vegetables are best.', syn:['new','crisp'], unit:8 },
  { w:'garnish', pos:'verb', m:'to decorate food', ex:'Garnish with coriander.', syn:['decorate','adorn'], unit:8 },
  { w:'ingredient', pos:'noun', m:'a substance in a recipe', ex:'Salt is a key ingredient.', syn:['component','element'], unit:8 },
  { w:'menu', pos:'noun', m:'a list of dishes', ex:'The menu has many options.', syn:['list','bill of fare'], unit:8 },
  { w:'nutritious', pos:'adjective', m:'full of nutrients', ex:'Fish is a nutritious food.', syn:['nourishing','healthy'], unit:8 },
  { w:'recipe', pos:'noun', m:'instructions for cooking', ex:'Follow the recipe carefully.', syn:['instructions','method'], unit:8 },
  { w:'restaurant', pos:'noun', m:'a place where meals are served', ex:'The restaurant was crowded.', syn:['eatery','diner'], unit:8 },
  { w:'savoury', pos:'adjective', m:'salty or spicy, not sweet', ex:'They served savoury snacks.', syn:['salty','spicy'], unit:8 },
  { w:'snack', pos:'noun', m:'a small meal', ex:'She had a light snack.', syn:['bite','refreshment'], unit:8 },
  { w:'spice', pos:'noun', m:'a substance that flavours food', ex:'Cinnamon is a popular spice.', syn:['seasoning','condiment'], unit:8 },
  { w:'taste', pos:'noun', m:'the flavour of food', ex:'The taste was excellent.', syn:['flavour','savour'], unit:8 },
  { w:'vegetarian', pos:'noun', m:'a person who eats no meat', ex:'She is a strict vegetarian.', syn:['meat-free','plant-based'], unit:8 },
  { w:'waiter', pos:'noun', m:'a person who serves food', ex:'The waiter took our order.', syn:['server','attendant'], unit:8 },
  { w:'aroma', pos:'noun', m:'a pleasant smell', ex:'The aroma of fresh bread filled the kitchen.', syn:['fragrance','scent'], unit:8 },
  { w:'bland', pos:'adjective', m:'lacking strong flavour', ex:'The soup tasted bland without salt.', syn:['tasteless','mild'], unit:8 },
  { w:'condiment', pos:'noun', m:'a sauce or spice added to food', ex:'Ketchup is a common condiment.', syn:['sauce','seasoning'], unit:8 },
  { w:'digest', pos:'verb', m:'to break down food in the body', ex:'It takes hours to digest a heavy meal.', syn:['break down','absorb'], unit:8 },
  { w:'edible', pos:'adjective', m:'safe to eat', ex:'Not all mushrooms are edible.', syn:['consumable','eatable'], unit:8 },
  { w:'ferment', pos:'verb', m:'to change chemically through bacteria or yeast', ex:'Yogurt is made by fermenting milk.', syn:['brew','culture'], unit:8 },
  { w:'gourmet', pos:'adjective', m:'relating to high-quality food', ex:'They opened a gourmet restaurant.', syn:['fine','high-end'], unit:8 },
  { w:'marinate', pos:'verb', m:'to soak food in a flavoured liquid', ex:'Marinate the chicken overnight.', syn:['soak','season'], unit:8 },
  { w:'nourish', pos:'verb', m:'to provide with food for growth', ex:'A good breakfast nourishes the body.', syn:['feed','sustain'], unit:8 },
  { w:'palatable', pos:'adjective', m:'pleasant to taste', ex:'The dish was surprisingly palatable.', syn:['tasty','agreeable'], unit:8 },
  { w:'perishable', pos:'adjective', m:'likely to decay quickly', ex:'Milk is a perishable item.', syn:['spoilable'], unit:8 },
  { w:'pungent', pos:'adjective', m:'having a strong, sharp smell or taste', ex:'The curry had a pungent aroma.', syn:['sharp','strong'], unit:8 },
  { w:'ration', pos:'noun', m:'a fixed amount of food allowed', ex:'Each family received a food ration.', syn:['allowance','portion'], unit:8 },
  { w:'sample', pos:'verb', m:'to taste a small amount of food', ex:'We sampled dishes at the food fair.', syn:['taste','try'], unit:8 },
  { w:'staple', pos:'noun', m:'a basic food eaten regularly', ex:'Rice is a staple food in Bangladesh.', syn:['basic food','main food'], unit:8 },
  { w:'stale', pos:'adjective', m:'no longer fresh', ex:'The bread had gone stale.', syn:['old','not fresh'], unit:8 },
  { w:'texture', pos:'noun', m:'the feel or consistency of food', ex:'The cake has a soft texture.', syn:['consistency','feel'], unit:8 },

  /* ---------- Unit 9: Work & Career ---------- */
  { w:'ambition', pos:'noun', m:'a strong desire to succeed', ex:'Her ambition is to be a doctor.', syn:['aspiration','goal'], unit:9 },
  { w:'apply', pos:'verb', m:'to make a formal request', ex:'She applied for the job.', syn:['request','petition'], unit:9 },
  { w:'career', pos:'noun', m:'a person’s work over time', ex:'He built a career in banking.', syn:['profession','vocation'], unit:9 },
  { w:'colleague', pos:'noun', m:'a person you work with', ex:'My colleagues are supportive.', syn:['coworker','associate'], unit:9 },
  { w:'competent', pos:'adjective', m:'having enough skill', ex:'She is a competent manager.', syn:['capable','skilled'], unit:9 },
  { w:'dedicated', pos:'adjective', m:'working hard for a purpose', ex:'He is a dedicated teacher.', syn:['committed','devoted'], unit:9 },
  { w:'employer', pos:'noun', m:'a person who hires workers', ex:'My employer treats us well.', syn:['boss','company'], unit:9 },
  { w:'experience', pos:'noun', m:'knowledge from doing something', ex:'She has ten years of experience.', syn:['practice','expertise'], unit:9 },
  { w:'freelance', pos:'adjective', m:'working independently', ex:'He is a freelance writer.', syn:['independent','self-employed'], unit:9 },
  { w:'interview', pos:'noun', m:'a formal meeting for a job', ex:'The interview went well.', syn:['meeting','consultation'], unit:9 },
  { w:'leader', pos:'noun', m:'a person who guides others', ex:'She is a strong leader.', syn:['chief','head'], unit:9 },
  { w:'opportunity', pos:'noun', m:'a favourable chance', ex:'This is a great opportunity.', syn:['chance','opening'], unit:9 },
  { w:'promotion', pos:'noun', m:'a higher position at work', ex:'She received a promotion.', syn:['advancement','upgrade'], unit:9 },
  { w:'resume', pos:'noun', m:'a written summary of a career', ex:'Send your resume by email.', syn:['CV','bio'], unit:9 },
  { w:'salary', pos:'noun', m:'regular payment for work', ex:'His salary increased this year.', syn:['pay','wage'], unit:9 },
  { w:'skill', pos:'noun', m:'the ability to do something well', ex:'Programming is a valuable skill.', syn:['ability','talent'], unit:9 },
  { w:'teamwork', pos:'noun', m:'working well together', ex:'Teamwork leads to success.', syn:['cooperation','collaboration'], unit:9 },
  { w:'vocation', pos:'noun', m:'a strong feeling to do a job', ex:'Teaching is her vocation.', syn:['calling','profession'], unit:9 },
  { w:'appraisal', pos:'noun', m:'an assessment of an employee’s work', ex:'She received a positive appraisal this year.', syn:['review','evaluation'], unit:9 },
  { w:'benefits', pos:'noun', m:'advantages given by an employer', ex:'The job offers good health benefits.', syn:['perks','allowances'], unit:9 },
  { w:'burnout', pos:'noun', m:'exhaustion caused by overwork', ex:'He suffered burnout after months of overtime.', syn:['exhaustion','fatigue'], unit:9 },
  { w:'compensation', pos:'noun', m:'payment for work or loss', ex:'The compensation package is generous.', syn:['payment','remuneration'], unit:9 },
  { w:'deadline', pos:'noun', m:'the latest time to complete something', ex:'The report deadline is Friday.', syn:['cutoff','due date'], unit:9 },
  { w:'delegate', pos:'verb', m:'to give a task to someone else', ex:'Good managers delegate tasks.', syn:['assign','entrust'], unit:9 },
  { w:'entrepreneur', pos:'noun', m:'a person who starts a business', ex:'She is a successful entrepreneur.', syn:['business owner','founder'], unit:9 },
  { w:'internship', pos:'noun', m:'a period of practical work training', ex:'He completed an internship at a bank.', syn:['traineeship'], unit:9 },
  { w:'negotiate', pos:'verb', m:'to discuss to reach an agreement', ex:'They negotiated a better salary.', syn:['bargain','discuss'], unit:9 },
  { w:'networking', pos:'noun', m:'building professional relationships', ex:'Networking helped her find a job.', syn:['connecting'], unit:9 },
  { w:'onboarding', pos:'noun', m:'the process of introducing a new employee', ex:'The onboarding process took a week.', syn:['orientation'], unit:9 },
  { w:'pension', pos:'noun', m:'regular payment after retirement', ex:'He receives a government pension.', syn:['retirement fund'], unit:9 },
  { w:'productivity', pos:'noun', m:'the rate of producing work', ex:'New tools improved productivity.', syn:['efficiency','output'], unit:9 },
  { w:'redundant', pos:'adjective', m:'no longer needed for a job', ex:'Fifty workers were made redundant.', syn:['laid off','unemployed'], unit:9 },
  { w:'resign', pos:'verb', m:'to formally leave a job', ex:'She resigned after ten years.', syn:['quit','step down'], unit:9 },
  { w:'stipend', pos:'noun', m:'a fixed regular payment, often small', ex:'Interns receive a monthly stipend.', syn:['allowance','payment'], unit:9 },
  { w:'supervisor', pos:'noun', m:'a person who oversees workers', ex:'Report any issues to your supervisor.', syn:['manager','overseer'], unit:9 },
  { w:'workforce', pos:'noun', m:'all the people who work in an organisation', ex:'The workforce grew by 20 percent.', syn:['staff','employees'], unit:9 },
  { w:'workload', pos:'noun', m:'the amount of work to be done', ex:'Her workload increased this month.', syn:['task load'], unit:9 },

  /* ---------- Unit 10: Bangladesh & Liberation War ---------- */
  { w:'agreement', pos:'noun', m:'an arrangement accepted by all', ex:'The two sides signed an agreement.', syn:['deal','accord'], unit:10 },
  { w:'betray', pos:'verb', m:'to be disloyal to someone', ex:'He betrayed his country.', syn:['deceive','desert'], unit:10 },
  { w:'bravery', pos:'noun', m:'courageous behaviour', ex:'The soldiers showed bravery.', syn:['courage','valour'], unit:10 },
  { w:'casualty', pos:'noun', m:'a person killed or injured', ex:'The war caused many casualties.', syn:['victim','loss'], unit:10 },
  { w:'ceasefire', pos:'noun', m:'an agreement to stop fighting', ex:'A ceasefire was declared.', syn:['truce','armistice'], unit:10 },
  { w:'constitution', pos:'noun', m:'the basic laws of a country', ex:'The constitution guarantees rights.', syn:['charter','law'], unit:10 },
  { w:'democracy', pos:'noun', m:'government by the people', ex:'Bangladesh is a democracy.', syn:['self-government','republic'], unit:10 },
  { w:'freedom', pos:'noun', m:'the state of being free', ex:'We fought for freedom.', syn:['liberty','independence'], unit:10 },
  { w:'hero', pos:'noun', m:'a brave person admired by others', ex:'He is a national hero.', syn:['champion','idol'], unit:10 },
  { w:'independence', pos:'noun', m:'being free from control', ex:'Bangladesh gained independence in 1971.', syn:['freedom','autonomy'], unit:10 },
  { w:'liberation', pos:'noun', m:'the act of setting free', ex:'The Liberation War lasted nine months.', syn:['freedom','release'], unit:10 },
  { w:'martyr', pos:'noun', m:'a person who dies for a cause', ex:'We honour our martyrs.', syn:['sacrificer','hero'], unit:10 },
  { w:'memorial', pos:'noun', m:'something that remembers a person', ex:'The memorial stands tall.', syn:['monument','remembrance'], unit:10 },
  { w:'nation', pos:'noun', m:'a country and its people', ex:'Our nation is proud.', syn:['country','state'], unit:10 },
  { w:'occupation', pos:'noun', m:'the control of a place by force', ex:'The occupation lasted nine months.', syn:['control','seizure'], unit:10 },
  { w:'patriot', pos:'noun', m:'a person who loves their country', ex:'He is a true patriot.', syn:['nationalist','loyalist'], unit:10 },
  { w:'rebel', pos:'noun', m:'a person who fights against authority', ex:'The rebels took up arms.', syn:['insurgent','freedom fighter'], unit:10 },
  { w:'refugee', pos:'noun', m:'a person forced to leave home', ex:'Millions became refugees.', syn:['displaced person','exile'], unit:10 },
  { w:'sacrifice', pos:'noun', m:'giving up something valuable', ex:'They made great sacrifices.', syn:['offering','loss'], unit:10 },
  { w:'sovereignty', pos:'noun', m:'the right to govern oneself', ex:'We defend our sovereignty.', syn:['autonomy','independence'], unit:10 },
  { w:'struggle', pos:'noun', m:'a hard effort', ex:'The struggle was long.', syn:['fight','effort'], unit:10 },
  { w:'tribute', pos:'noun', m:'an act showing respect', ex:'We pay tribute to the heroes.', syn:['honour','homage'], unit:10 },
  { w:'triumph', pos:'noun', m:'a great victory', ex:'Independence was a triumph.', syn:['victory','conquest'], unit:10 },
  { w:'unity', pos:'noun', m:'being joined as one', ex:'Unity is our strength.', syn:['oneness','solidarity'], unit:10 },
  { w:'veteran', pos:'noun', m:'a person with long experience', ex:'The veteran told his story.', syn:['expert','old hand'], unit:10 },
  { w:'allegiance', pos:'noun', m:'loyalty to a country or cause', ex:'They swore allegiance to the new nation.', syn:['loyalty','fidelity'], unit:10 },
  { w:'atrocity', pos:'noun', m:'an extremely cruel act', ex:'The war saw many atrocities.', syn:['cruelty','brutality'], unit:10 },
  { w:'commemorate', pos:'verb', m:'to remember officially with respect', ex:'We commemorate Victory Day every December.', syn:['honour','remember'], unit:10 },
  { w:'commonwealth', pos:'noun', m:'a group of self-governing states', ex:'Bangladesh joined the Commonwealth in 1972.', syn:['federation','union'], unit:10 },
  { w:'declaration', pos:'noun', m:'a formal public statement', ex:'The declaration of independence was read aloud.', syn:['announcement','proclamation'], unit:10 },
  { w:'genocide', pos:'noun', m:'the deliberate killing of a large group', ex:'The genocide of 1971 must never be forgotten.', syn:['mass killing'], unit:10 },
  { w:'guerrilla', pos:'noun', m:'a member of an irregular fighting force', ex:'Guerrilla fighters resisted the occupation.', syn:['freedom fighter','insurgent'], unit:10 },
  { w:'homage', pos:'noun', m:'special honour shown publicly', ex:'They paid homage to the fallen soldiers.', syn:['tribute','respect'], unit:10 },
  { w:'insurgency', pos:'noun', m:'an armed rebellion against authority', ex:'The insurgency lasted nine months.', syn:['uprising','revolt'], unit:10 },
  { w:'liberate', pos:'verb', m:'to set a place or people free', ex:'The forces liberated the town in December.', syn:['free','release'], unit:10 },
  { w:'militia', pos:'noun', m:'a group of civilians trained as soldiers', ex:'A local militia joined the resistance.', syn:['armed group'], unit:10 },
  { w:'mobilise', pos:'verb', m:'to organise people for action', ex:'The nation mobilised for the struggle.', syn:['organise','rally'], unit:10 },
  { w:'proclamation', pos:'noun', m:'an official public announcement', ex:'The proclamation of independence was historic.', syn:['declaration','announcement'], unit:10 },
  { w:'reconstruction', pos:'noun', m:'the rebuilding of something destroyed', ex:'Reconstruction began soon after the war.', syn:['rebuilding'], unit:10 },
  { w:'resistance', pos:'noun', m:'the act of fighting against something', ex:'The resistance grew stronger each month.', syn:['opposition','struggle'], unit:10 },
  { w:'solidarity', pos:'noun', m:'unity of purpose among people', ex:'The world showed solidarity with the refugees.', syn:['unity','support'], unit:10 },
  { w:'surrender', pos:'verb', m:'to stop fighting and give up', ex:'The occupying army surrendered in December.', syn:['give up','capitulate'], unit:10 },
  { w:'testimony', pos:'noun', m:'a formal statement of evidence', ex:'Survivors gave testimony about the war.', syn:['account','evidence'], unit:10 },
  { w:'valiant', pos:'adjective', m:'showing great courage', ex:'The valiant soldiers fought bravely.', syn:['brave','courageous'], unit:10 },
];

/* ============================================================
   EXTRA DICTIONARY  (~690 more words — pushes total past 1000)
   ============================================================ */
const EXTRA_DICTIONARY = [
  /* ---------- Unit 1 extras ---------- */
  { w:'adore', pos:'verb', m:'to love someone very much', ex:'She adores her little brother.', syn:['love','cherish'], unit:1 },
  { w:'amicable', pos:'adjective', m:'friendly and without quarrels', ex:'They reached an amicable agreement.', syn:['friendly','peaceable'], unit:1 },
  { w:'ancestry', pos:'noun', m:'the origin of a family', ex:'She traced her ancestry to Sylhet.', syn:['lineage','descent'], unit:1 },
  { w:'anniversary', pos:'noun', m:'a date remembered each year', ex:'They celebrated their wedding anniversary.', syn:['celebration','commemoration'], unit:1 },
  { w:'befriend', pos:'verb', m:'to become a friend to someone', ex:'He befriended the new student.', syn:['support','help'], unit:1 },
  { w:'beloved', pos:'adjective', m:'much loved', ex:'She is a beloved grandmother.', syn:['cherished','adored'], unit:1 },
  { w:'bonding', pos:'noun', m:'the forming of a close relationship', ex:'The trip was a bonding experience.', syn:['closeness','attachment'], unit:1 },
  { w:'brotherhood', pos:'noun', m:'the relationship between brothers', ex:'They share a strong brotherhood.', syn:['fellowship','kinship'], unit:1 },
  { w:'caring', pos:'adjective', m:'showing kindness to others', ex:'She is a caring mother.', syn:['kind','compassionate'], unit:1 },
  { w:'closeness', pos:'noun', m:'the state of being close', ex:'There is great closeness in their family.', syn:['intimacy','familiarity'], unit:1 },
  { w:'comrade', pos:'noun', m:'a close companion', ex:'He is a trusted comrade.', syn:['companion','ally'], unit:1 },
  { w:'confidant', pos:'noun', m:'a person you share secrets with', ex:'She is my closest confidant.', syn:['adviser','friend'], unit:1 },
  { w:'consanguinity', pos:'noun', m:'relationship by blood', ex:'Their consanguinity was traced through records.', syn:['blood relation'], unit:1 },
  { w:'cousin', pos:'noun', m:'a child of your aunt or uncle', ex:'My cousin lives in Chittagong.', syn:['relative','kin'], unit:1 },
  { w:'cuddle', pos:'verb', m:'to hold close affectionately', ex:'She cuddled the baby.', syn:['hug','embrace'], unit:1 },
  { w:'dedication', pos:'noun', m:'loyal commitment to someone', ex:'His dedication to his family is admirable.', syn:['commitment','devotion'], unit:1 },
  { w:'dependability', pos:'noun', m:'the quality of being reliable', ex:'Her dependability makes her a great friend.', syn:['reliability','trustworthiness'], unit:1 },
  { w:'descendant', pos:'noun', m:'a person descended from an ancestor', ex:'He is a descendant of a famous poet.', syn:['offspring','heir'], unit:1 },
  { w:'devotion', pos:'noun', m:'great love and loyalty', ex:'Her devotion to her parents is clear.', syn:['loyalty','dedication'], unit:1 },
  { w:'doting', pos:'adjective', m:'showing excessive love', ex:'He is a doting father.', syn:['adoring','fond'], unit:1 },
  { w:'elder', pos:'noun', m:'an older person', ex:'Respect your elders.', syn:['senior','ancestor'], unit:1 },
  { w:'embrace', pos:'verb', m:'to hug someone', ex:'They embraced after the long trip.', syn:['hug','hold'], unit:1 },
  { w:'endear', pos:'verb', m:'to make someone loved', ex:'Her kindness endeared her to everyone.', syn:['charm','attach'], unit:1 },
  { w:'extended family', pos:'noun', m:'relatives beyond parents and children', ex:'They live with their extended family.', syn:['relatives','kin'], unit:1 },
  { w:'fondness', pos:'noun', m:'liking for someone or something', ex:'She has a fondness for her old school.', syn:['affection','liking'], unit:1 },
  { w:'forgive', pos:'verb', m:'to stop being angry with someone', ex:'She forgave her brother.', syn:['pardon','excuse'], unit:1 },
  { w:'fraternal', pos:'adjective', m:'relating to brothers', ex:'They share a fraternal bond.', syn:['brotherly'], unit:1 },
  { w:'friendship', pos:'noun', m:'a relationship between friends', ex:'Their friendship lasted decades.', syn:['companionship','amity'], unit:1 },
  { w:'generosity', pos:'noun', m:'willingness to give', ex:'Her generosity helped many families.', syn:['kindness','liberality'], unit:1 },
  { w:'grandparent', pos:'noun', m:'the parent of your parent', ex:'My grandparent tells great stories.', syn:['grandfather','grandmother'], unit:1 },
  { w:'grief', pos:'noun', m:'deep sadness after loss', ex:'She was overcome with grief.', syn:['sorrow','mourning'], unit:1 },
  { w:'guardian', pos:'noun', m:'a person who protects another', ex:'Her uncle became her guardian.', syn:['protector','custodian'], unit:1 },
  { w:'household', pos:'noun', m:'all the people living in a house', ex:'The household has eight members.', syn:['family','home'], unit:1 },
  { w:'hug', pos:'noun', m:'holding someone closely', ex:'She gave her mother a warm hug.', syn:['embrace','cuddle'], unit:1 },
  { w:'in-law', pos:'noun', m:'a relative by marriage', ex:'Her in-laws live nearby.', syn:['relative'], unit:1 },
  { w:'intimacy', pos:'noun', m:'close personal familiarity', ex:'Their intimacy grew over the years.', syn:['closeness','familiarity'], unit:1 },
  { w:'jealousy', pos:'noun', m:'resentment of another’s success', ex:'Jealousy can damage friendships.', syn:['envy','resentment'], unit:1 },
  { w:'kin', pos:'noun', m:'your relatives', ex:'All his kin gathered for the wedding.', syn:['relatives','family'], unit:1 },
  { w:'kindred', pos:'adjective', m:'similar in nature; related', ex:'They are kindred spirits.', syn:['related','akin'], unit:1 },
  { w:'longing', pos:'noun', m:'a strong desire for someone', ex:'She felt a longing for home.', syn:['yearning','craving'], unit:1 },
  { w:'loved one', pos:'noun', m:'a person you love', ex:'He missed his loved ones abroad.', syn:['beloved','family member'], unit:1 },
  { w:'matriarch', pos:'noun', m:'the female head of a family', ex:'The matriarch ruled the household kindly.', syn:['mother figure'], unit:1 },
  { w:'nephew', pos:'noun', m:'the son of your brother or sister', ex:'My nephew started school today.', syn:['relative','kin'], unit:1 },
  { w:'niece', pos:'noun', m:'the daughter of your brother or sister', ex:'His niece lives in Rajshahi.', syn:['relative','kin'], unit:1 },
  { w:'offspring', pos:'noun', m:'a person’s children', ex:'They raised three offspring.', syn:['children','descendants'], unit:1 },
  { w:'orphan', pos:'noun', m:'a child whose parents have died', ex:'The orphan was cared for by relatives.', syn:['waif'], unit:1 },
  { w:'patriarch', pos:'noun', m:'the male head of a family', ex:'The patriarch made all the decisions.', syn:['father figure'], unit:1 },
  { w:'paternal', pos:'adjective', m:'relating to the father', ex:'She lives with her paternal aunt.', syn:['fatherly'], unit:1 },
  { w:'maternal', pos:'adjective', m:'relating to the mother', ex:'His maternal uncle visited us.', syn:['motherly'], unit:1 },
  { w:'peer', pos:'noun', m:'a person of the same age', ex:'He learned a lot from his peers.', syn:['equal','contemporary'], unit:1 },
  { w:'protect', pos:'verb', m:'to keep someone safe', ex:'Parents protect their children.', syn:['guard','defend'], unit:1 },
  { w:'quarrel', pos:'noun', m:'an angry argument', ex:'They had a quarrel over money.', syn:['dispute','argument'], unit:1 },
  { w:'relative', pos:'noun', m:'a member of your family', ex:'Many relatives came to the reunion.', syn:['relation','kin'], unit:1 },
  { w:'rely', pos:'verb', m:'to depend on someone', ex:'I can rely on my sister.', syn:['depend','trust'], unit:1 },
  { w:'sibling rivalry', pos:'noun', m:'competition between brothers and sisters', ex:'Sibling rivalry is common in large families.', syn:['competition'], unit:1 },
  { w:'supportive', pos:'adjective', m:'giving help and encouragement', ex:'Her family is very supportive.', syn:['helpful','encouraging'], unit:1 },
  { w:'togetherness', pos:'noun', m:'the state of being close together', ex:'Festivals bring a sense of togetherness.', syn:['unity','closeness'], unit:1 },
  { w:'uncle', pos:'noun', m:'the brother of your parent', ex:'My uncle taught me to ride a bike.', syn:['relative','kin'], unit:1 },
  { w:'widow', pos:'noun', m:'a woman whose husband has died', ex:'The widow raised her children alone.', syn:['surviving spouse'], unit:1 },
  { w:'widower', pos:'noun', m:'a man whose wife has died', ex:'The widower moved in with his son.', syn:['surviving spouse'], unit:1 },

  /* ---------- Unit 2 extras ---------- */
  { w:'admission', pos:'noun', m:'the act of joining a school', ex:'Admission to the college opens in June.', syn:['enrolment','entry'], unit:2 },
  { w:'alumnus', pos:'noun', m:'a former student of a school', ex:'He is a proud alumnus of Dhaka College.', syn:['graduate','former student'], unit:2 },
  { w:'apt', pos:'adjective', m:'quick to learn', ex:'She is apt at mathematics.', syn:['quick','clever'], unit:2 },
  { w:'attendance', pos:'noun', m:'being present at school', ex:'Attendance is taken every morning.', syn:['presence','participation'], unit:2 },
  { w:'blackboard', pos:'noun', m:'a dark board for writing in class', ex:'The teacher wrote on the blackboard.', syn:['chalkboard','board'], unit:2 },
  { w:'bookworm', pos:'noun', m:'a person who loves reading', ex:'She is a real bookworm.', syn:['reader','scholar'], unit:2 },
  { w:'campus', pos:'noun', m:'the grounds of a school', ex:'The campus is green and quiet.', syn:['grounds','site'], unit:2 },
  { w:'certificate', pos:'noun', m:'an official document of achievement', ex:'She received her certificate today.', syn:['diploma','award'], unit:2 },
  { w:'chancellor', pos:'noun', m:'the head of a university', ex:'The chancellor addressed the graduates.', syn:['head','president'], unit:2 },
  { w:'classmate', pos:'noun', m:'a person in your class', ex:'My classmate helped me with homework.', syn:['peer','fellow student'], unit:2 },
  { w:'coaching', pos:'noun', m:'extra teaching outside school', ex:'He takes coaching in physics.', syn:['tutoring','training'], unit:2 },
  { w:'college', pos:'noun', m:'a place of higher education', ex:'She studies at a government college.', syn:['institute','academy'], unit:2 },
  { w:'comprehension', pos:'noun', m:'the ability to understand', ex:'Reading comprehension is tested in exams.', syn:['understanding','grasp'], unit:2 },
  { w:'concept', pos:'noun', m:'an abstract idea', ex:'The concept was hard to grasp.', syn:['idea','notion'], unit:2 },
  { w:'correction', pos:'noun', m:'the act of making something right', ex:'The teacher made a correction in red ink.', syn:['amendment','fix'], unit:2 },
  { w:'credit', pos:'noun', m:'recognition for academic work', ex:'Each course carries three credits.', syn:['recognition','point'], unit:2 },
  { w:'dean', pos:'noun', m:'a senior university official', ex:'The dean approved the new course.', syn:['head','administrator'], unit:2 },
  { w:'degree', pos:'noun', m:'an academic qualification', ex:'She earned a degree in English.', syn:['qualification','diploma'], unit:2 },
  { w:'dictation', pos:'noun', m:'writing words spoken by a teacher', ex:'The class had a spelling dictation.', syn:['transcription'], unit:2 },
  { w:'diploma', pos:'noun', m:'a certificate from a school', ex:'He received a diploma in engineering.', syn:['certificate','degree'], unit:2 },
  { w:'distance learning', pos:'noun', m:'study done away from school', ex:'Distance learning became popular during the pandemic.', syn:['online study','remote learning'], unit:2 },
  { w:'dropout', pos:'noun', m:'a student who leaves school early', ex:'The dropout rate has fallen.', syn:['leaver'], unit:2 },
  { w:'elective', pos:'noun', m:'an optional course', ex:'She chose music as an elective.', syn:['option','choice subject'], unit:2 },
  { w:'enrolment', pos:'noun', m:'the act of registering for a course', ex:'Enrolment closes on Friday.', syn:['registration','admission'], unit:2 },
  { w:'essay', pos:'noun', m:'a short piece of writing', ex:'I wrote an essay on climate change.', syn:['composition','paper'], unit:2 },
  { w:'exam', pos:'noun', m:'a formal test of knowledge', ex:'The final exam is next week.', syn:['test','assessment'], unit:2 },
  { w:'extracurricular', pos:'adjective', m:'outside the normal course of study', ex:'She takes part in extracurricular activities.', syn:['additional','supplementary'], unit:2 },
  { w:'feedback', pos:'noun', m:'comments about your work', ex:'The teacher gave useful feedback.', syn:['response','comment'], unit:2 },
  { w:'flashcard', pos:'noun', m:'a card used for learning', ex:'Flashcards help memorise vocabulary.', syn:['study card'], unit:2 },
  { w:'foundation', pos:'noun', m:'the basic starting point of study', ex:'A good foundation in maths is essential.', syn:['basis','base'], unit:2 },
  { w:'grade', pos:'noun', m:'a mark showing quality of work', ex:'She got a good grade in English.', syn:['mark','score'], unit:2 },
  { w:'grammar', pos:'noun', m:'the rules of a language', ex:'English grammar can be tricky.', syn:['syntax','rules'], unit:2 },
  { w:'handwriting', pos:'noun', m:'the style of writing by hand', ex:'Her handwriting is very neat.', syn:['script','penmanship'], unit:2 },
  { w:'headmaster', pos:'noun', m:'the head of a school', ex:'The headmaster gave a speech.', syn:['principal','head teacher'], unit:2 },
  { w:'higher education', pos:'noun', m:'study after secondary school', ex:'She plans to pursue higher education.', syn:['university study','tertiary education'], unit:2 },
  { w:'homework', pos:'noun', m:'school work done at home', ex:'Finish your homework before dinner.', syn:['assignment','task'], unit:2 },
  { w:'honours', pos:'noun', m:'a high level of academic degree', ex:'He graduated with honours.', syn:['distinction','accolade'], unit:2 },
  { w:'institute', pos:'noun', m:'an organisation for education', ex:'She studies at a technical institute.', syn:['college','academy'], unit:2 },
  { w:'instructor', pos:'noun', m:'a person who teaches', ex:'The instructor explained the lesson.', syn:['teacher','trainer'], unit:2 },
  { w:'library', pos:'noun', m:'a place with books for reading', ex:'I study in the library every evening.', syn:['reading room','archive'], unit:2 },
  { w:'mark', pos:'noun', m:'a score given for work', ex:'She got full marks in science.', syn:['grade','score'], unit:2 },
  { w:'mentor', pos:'noun', m:'an experienced adviser', ex:'His mentor guided his research.', syn:['guide','adviser'], unit:2 },
  { w:'notebook', pos:'noun', m:'a book for writing notes', ex:'Write the answer in your notebook.', syn:['exercise book','journal'], unit:2 },
  { w:'online class', pos:'noun', m:'a lesson held over the internet', ex:'Online classes started at nine.', syn:['virtual class','e-learning'], unit:2 },
  { w:'pass', pos:'verb', m:'to succeed in an exam', ex:'She passed the exam with flying colours.', syn:['succeed','qualify'], unit:2 },
  { w:'practical', pos:'noun', m:'a lesson involving doing, not just theory', ex:'The chemistry practical was interesting.', syn:['experiment','hands-on class'], unit:2 },
  { w:'principal', pos:'noun', m:'the head of a school or college', ex:'The principal announced the results.', syn:['head','director'], unit:2 },
  { w:'professor', pos:'noun', m:'a senior university teacher', ex:'The professor published a new book.', syn:['lecturer','academic'], unit:2 },
  { w:'pupil', pos:'noun', m:'a school child', ex:'The pupils wore clean uniforms.', syn:['student','schoolchild'], unit:2 },
  { w:'quiz', pos:'noun', m:'a short informal test', ex:'We had a vocabulary quiz today.', syn:['test','assessment'], unit:2 },
  { w:'register', pos:'noun', m:'an official list of names', ex:'The teacher called the register.', syn:['roll','record'], unit:2 },
  { w:'revision', pos:'noun', m:'study done before an exam', ex:'Revision starts two weeks before finals.', syn:['review','study'], unit:2 },
  { w:'scholarly', pos:'adjective', m:'relating to serious academic study', ex:'She published a scholarly article.', syn:['academic','learned'], unit:2 },
  { w:'schooling', pos:'noun', m:'education received at school', ex:'He had little formal schooling.', syn:['education','instruction'], unit:2 },
  { w:'secondary', pos:'adjective', m:'relating to the stage after primary school', ex:'She teaches at a secondary school.', syn:['high school level'], unit:2 },
  { w:'session', pos:'noun', m:'a period of teaching', ex:'The morning session ends at noon.', syn:['class','period'], unit:2 },
  { w:'student', pos:'noun', m:'a person who studies', ex:'She is a diligent student.', syn:['pupil','learner'], unit:2 },
  { w:'subject', pos:'noun', m:'an area of study', ex:'Physics is my favourite subject.', syn:['course','discipline'], unit:2 },
  { w:'teacher', pos:'noun', m:'a person who educates others', ex:'Our teacher is very kind.', syn:['instructor','tutor'], unit:2 },
  { w:'textbook', pos:'noun', m:'a book used for study', ex:'Open your textbook to page ten.', syn:['coursebook','manual'], unit:2 },
  { w:'tuition', pos:'noun', m:'teaching, often paid for', ex:'He takes private tuition in maths.', syn:['coaching','instruction'], unit:2 },
  { w:'undergraduate', pos:'noun', m:'a university student without a degree yet', ex:'She is an undergraduate in physics.', syn:['student'], unit:2 },
  { w:'uniform', pos:'noun', m:'special clothes worn at school', ex:'Students must wear a uniform.', syn:['dress code','outfit'], unit:2 },
  { w:'university', pos:'noun', m:'a place of higher learning', ex:'He studies at Dhaka University.', syn:['college','institute'], unit:2 },
  { w:'viva', pos:'noun', m:'an oral examination', ex:'She passed her viva with ease.', syn:['oral exam'], unit:2 },

  /* ---------- Unit 3 extras ---------- */
  { w:'acre', pos:'noun', m:'a unit of land area', ex:'He owns five acres of farmland.', syn:['land unit'], unit:3 },
  { w:'air quality', pos:'noun', m:'the cleanliness of the air', ex:'Air quality has worsened in the city.', syn:['air purity'], unit:3 },
  { w:'altitude', pos:'noun', m:'height above sea level', ex:'The village sits at a high altitude.', syn:['elevation','height'], unit:3 },
  { w:'amphibian', pos:'noun', m:'an animal living on land and in water', ex:'Frogs are amphibians.', syn:['water-land animal'], unit:3 },
  { w:'aquatic', pos:'adjective', m:'living or growing in water', ex:'Aquatic plants fill the pond.', syn:['marine','water'], unit:3 },
  { w:'avalanche', pos:'noun', m:'a mass of snow falling down a mountain', ex:'The avalanche blocked the road.', syn:['snowslide','landslide'], unit:3 },
  { w:'bay', pos:'noun', m:'a curved part of a coastline', ex:'Boats sheltered in the bay.', syn:['cove','gulf'], unit:3 },
  { w:'breeze', pos:'noun', m:'a gentle wind', ex:'A cool breeze blew from the river.', syn:['wind','draught'], unit:3 },
  { w:'canal', pos:'noun', m:'a man-made waterway', ex:'The canal irrigates nearby fields.', syn:['channel','waterway'], unit:3 },
  { w:'carnivore', pos:'noun', m:'an animal that eats meat', ex:'The tiger is a carnivore.', syn:['meat-eater','predator'], unit:3 },
  { w:'cascade', pos:'noun', m:'a small waterfall', ex:'The cascade fell over the rocks.', syn:['waterfall','falls'], unit:3 },
  { w:'coastline', pos:'noun', m:'the edge of the land by the sea', ex:'Bangladesh has a long coastline.', syn:['shore','seaboard'], unit:3 },
  { w:'compost', pos:'noun', m:'decayed material used to fertilise soil', ex:'They make compost from kitchen waste.', syn:['fertiliser','humus'], unit:3 },
  { w:'coral', pos:'noun', m:'a hard substance formed by sea animals', ex:'Coral reefs are dying worldwide.', syn:['reef'], unit:3 },
  { w:'crop', pos:'noun', m:'plants grown for food', ex:'The rice crop was excellent.', syn:['harvest','produce'], unit:3 },
  { w:'cyclone', pos:'noun', m:'a violent tropical storm', ex:'The cyclone damaged coastal villages.', syn:['hurricane','typhoon'], unit:3 },
  { w:'dam', pos:'noun', m:'a barrier that holds back water', ex:'The dam supplies electricity.', syn:['barrier','reservoir'], unit:3 },
  { w:'delta', pos:'noun', m:'land formed at a river mouth', ex:'The Ganges delta is the largest in the world.', syn:['river mouth'], unit:3 },
  { w:'desert', pos:'noun', m:'a very dry area with little rain', ex:'Camels live in the desert.', syn:['wasteland','dunes'], unit:3 },
  { w:'dew', pos:'noun', m:'small drops of water on grass', ex:'Dew covered the morning grass.', syn:['moisture','condensation'], unit:3 },
  { w:'disaster', pos:'noun', m:'a sudden harmful event', ex:'The flood was a national disaster.', syn:['catastrophe','calamity'], unit:3 },
  { w:'dune', pos:'noun', m:'a hill of sand', ex:'We walked over the sand dunes.', syn:['sand hill','mound'], unit:3 },
  { w:'earthquake', pos:'noun', m:'a sudden shaking of the ground', ex:'The earthquake measured 6.0.', syn:['tremor','quake'], unit:3 },
  { w:'ecology', pos:'noun', m:'the study of living things and their environment', ex:'Ecology teaches us to respect nature.', syn:['environmental science'], unit:3 },
  { w:'estuary', pos:'noun', m:'the wide mouth of a river', ex:'Fish breed in the estuary.', syn:['river mouth','inlet'], unit:3 },
  { w:'fauna', pos:'noun', m:'the animals of a region', ex:'The fauna of the Sundarbans is unique.', syn:['wildlife','animals'], unit:3 },
  { w:'flora', pos:'noun', m:'the plants of a region', ex:'The flora of the hills is diverse.', syn:['plants','vegetation'], unit:3 },
  { w:'fog', pos:'noun', m:'thick cloud near the ground', ex:'Dense fog delayed the flight.', syn:['mist','haze'], unit:3 },
  { w:'fossil', pos:'noun', m:'the remains of an ancient living thing', ex:'They found a dinosaur fossil.', syn:['remains','relic'], unit:3 },
  { w:'glacier', pos:'noun', m:'a large mass of moving ice', ex:'The glacier is melting rapidly.', syn:['ice sheet'], unit:3 },
  { w:'grove', pos:'noun', m:'a small group of trees', ex:'A mango grove surrounds the house.', syn:['orchard','wood'], unit:3 },
  { w:'gulf', pos:'noun', m:'a large area of sea partly surrounded by land', ex:'The Gulf of Bengal is rich in fish.', syn:['bay','inlet'], unit:3 },
  { w:'herbivore', pos:'noun', m:'an animal that eats plants', ex:'Cows are herbivores.', syn:['plant-eater'], unit:3 },
  { w:'hillock', pos:'noun', m:'a small hill', ex:'A hillock rose behind the village.', syn:['mound','knoll'], unit:3 },
  { w:'humidity', pos:'noun', m:'the amount of water in the air', ex:'High humidity makes summer uncomfortable.', syn:['moisture','dampness'], unit:3 },
  { w:'hurricane', pos:'noun', m:'a violent tropical storm', ex:'The hurricane destroyed the coast.', syn:['cyclone','typhoon'], unit:3 },
  { w:'island', pos:'noun', m:'land surrounded by water', ex:'They visited a small island.', syn:['isle','atoll'], unit:3 },
  { w:'lagoon', pos:'noun', m:'a shallow lake near the sea', ex:'The lagoon was full of fish.', syn:['pool','inlet'], unit:3 },
  { w:'lake', pos:'noun', m:'a large area of water surrounded by land', ex:'We rowed across the lake.', syn:['pond','reservoir'], unit:3 },
  { w:'landfill', pos:'noun', m:'a place where waste is buried', ex:'The landfill is almost full.', syn:['dump','waste site'], unit:3 },
  { w:'landslide', pos:'noun', m:'the sliding of rock and earth down a slope', ex:'The landslide blocked the highway.', syn:['rockfall','mudslide'], unit:3 },
  { w:'lava', pos:'noun', m:'hot melted rock from a volcano', ex:'Lava flowed down the mountain.', syn:['magma','molten rock'], unit:3 },
  { w:'litter', pos:'noun', m:'waste left in public places', ex:'Do not drop litter in the park.', syn:['rubbish','trash'], unit:3 },
  { w:'marine', pos:'adjective', m:'relating to the sea', ex:'Marine life is under threat.', syn:['oceanic','aquatic'], unit:3 },
  { w:'meadow', pos:'noun', m:'a field of grass', ex:'Cattle grazed in the meadow.', syn:['field','pasture'], unit:3 },
  { w:'mist', pos:'noun', m:'thin fog', ex:'Morning mist covered the river.', syn:['haze','fog'], unit:3 },
  { w:'monsoon', pos:'noun', m:'a seasonal wind bringing heavy rain', ex:'The monsoon arrives in June.', syn:['rainy season'], unit:3 },
  { w:'moss', pos:'noun', m:'a small green plant growing on damp surfaces', ex:'Moss grew on the old wall.', syn:['lichen','bryophyte'], unit:3 },
  { w:'mountain', pos:'noun', m:'a very high natural elevation', ex:'They climbed the mountain.', syn:['peak','summit'], unit:3 },
  { w:'ocean', pos:'noun', m:'a very large body of salt water', ex:'The ocean covers most of the earth.', syn:['sea','deep'], unit:3 },
  { w:'ozone', pos:'noun', m:'a gas that protects the earth from radiation', ex:'The ozone layer is healing slowly.', syn:['atmospheric gas'], unit:3 },
  { w:'pasture', pos:'noun', m:'land covered with grass for animals', ex:'The sheep grazed in the pasture.', syn:['meadow','grassland'], unit:3 },
  { w:'peak', pos:'noun', m:'the top of a mountain', ex:'Snow covers the peak all year.', syn:['summit','top'], unit:3 },
  { w:'pesticide', pos:'noun', m:'a chemical used to kill pests', ex:'Pesticides can harm bees.', syn:['insecticide','chemical'], unit:3 },
  { w:'plateau', pos:'noun', m:'a flat area of high land', ex:'The plateau is ideal for farming.', syn:['tableland','highland'], unit:3 },
  { w:'pond', pos:'noun', m:'a small area of still water', ex:'Ducks swam in the pond.', syn:['pool','puddle'], unit:3 },
  { w:'prairie', pos:'noun', m:'a large area of flat grassland', ex:'Bison once roamed the prairie.', syn:['grassland','savanna'], unit:3 },
  { w:'rainfall', pos:'noun', m:'the amount of rain that falls', ex:'Rainfall was below average this year.', syn:['precipitation','rain'], unit:3 },
  { w:'rainforest', pos:'noun', m:'a dense forest with heavy rainfall', ex:'Rainforests are home to many species.', syn:['jungle','tropical forest'], unit:3 },
  { w:'reef', pos:'noun', m:'a ridge of rock or coral in the sea', ex:'The reef protects the shore.', syn:['coral','shoal'], unit:3 },
  { w:'ridge', pos:'noun', m:'a long narrow raised part of land', ex:'They walked along the ridge.', syn:['crest','spine'], unit:3 },
  { w:'sanctuary', pos:'noun', m:'a safe place for wildlife', ex:'The sanctuary protects rare birds.', syn:['reserve','refuge'], unit:3 },
  { w:'savanna', pos:'noun', m:'a grassy plain in a hot region', ex:'Lions live on the savanna.', syn:['grassland','prairie'], unit:3 },
  { w:'shore', pos:'noun', m:'the land along the edge of water', ex:'We walked along the shore.', syn:['coast','beach'], unit:3 },
  { w:'soil', pos:'noun', m:'the top layer of earth', ex:'Rich soil produces good crops.', syn:['earth','dirt'], unit:3 },
  { w:'stream', pos:'noun', m:'a small narrow river', ex:'A stream runs behind the house.', syn:['brook','creek'], unit:3 },
  { w:'summit', pos:'noun', m:'the highest point', ex:'They reached the summit at dawn.', syn:['peak','top'], unit:3 },
  { w:'sunlight', pos:'noun', m:'light from the sun', ex:'Plants need sunlight to grow.', syn:['sunshine','daylight'], unit:3 },
  { w:'swamp', pos:'noun', m:'an area of soft wet ground', ex:'The swamp is full of frogs.', syn:['marsh','bog'], unit:3 },
  { w:'thunder', pos:'noun', m:'the loud sound after lightning', ex:'Thunder followed the flash.', syn:['rumble','boom'], unit:3 },
  { w:'tide', pos:'noun', m:'the rise and fall of the sea', ex:'The tide comes in twice a day.', syn:['current','flow'], unit:3 },
  { w:'timber', pos:'noun', m:'wood used for building', ex:'The timber is used for furniture.', syn:['wood','lumber'], unit:3 },
  { w:'tornado', pos:'noun', m:'a violent spinning wind', ex:'The tornado destroyed the village.', syn:['twister','whirlwind'], unit:3 },
  { w:'valley', pos:'noun', m:'low land between hills', ex:'The valley is green and fertile.', syn:['vale','glen'], unit:3 },
  { w:'volcano', pos:'noun', m:'a mountain that can erupt', ex:'The volcano erupted last year.', syn:['crater','peak'], unit:3 },
  { w:'waterfall', pos:'noun', m:'water falling from a height', ex:'The waterfall is a tourist attraction.', syn:['cascade','falls'], unit:3 },
  { w:'watershed', pos:'noun', m:'an area draining into a river', ex:'The watershed supplies the whole region.', syn:['basin','catchment'], unit:3 },
  { w:'weather', pos:'noun', m:'the state of the atmosphere', ex:'The weather is hot today.', syn:['climate','conditions'], unit:3 },

  /* ---------- Unit 4 extras ---------- */
  { w:'acupuncture', pos:'noun', m:'a treatment using thin needles', ex:'Acupuncture helped relieve her pain.', syn:['needle therapy'], unit:4 },
  { w:'allergic', pos:'adjective', m:'having a bad reaction to something', ex:'He is allergic to dust.', syn:['sensitive','intolerant'], unit:4 },
  { w:'anaemia', pos:'noun', m:'a condition of weak blood', ex:'Anaemia is common in children.', syn:['blood deficiency'], unit:4 },
  { w:'antibiotic', pos:'noun', m:'a medicine that kills bacteria', ex:'The doctor prescribed an antibiotic.', syn:['medicine','drug'], unit:4 },
  { w:'antibody', pos:'noun', m:'a substance that fights infection', ex:'Antibodies protect against viruses.', syn:['defence','immune protein'], unit:4 },
  { w:'asthma', pos:'noun', m:'a condition that makes breathing hard', ex:'He uses an inhaler for asthma.', syn:['breathing problem'], unit:4 },
  { w:'bandage', pos:'noun', m:'a strip of cloth for a wound', ex:'She wrapped a bandage around his arm.', syn:['dressing','wrap'], unit:4 },
  { w:'bacteria', pos:'noun', m:'tiny organisms that can cause disease', ex:'Some bacteria are helpful.', syn:['germs','microbes'], unit:4 },
  { w:'blood pressure', pos:'noun', m:'the force of blood in the arteries', ex:'High blood pressure is dangerous.', syn:['BP','arterial pressure'], unit:4 },
  { w:'calcium', pos:'noun', m:'a mineral needed for strong bones', ex:'Milk is rich in calcium.', syn:['mineral','nutrient'], unit:4 },
  { w:'carbohydrate', pos:'noun', m:'a nutrient that gives energy', ex:'Rice is full of carbohydrates.', syn:['starch','sugar'], unit:4 },
  { w:'checkup', pos:'noun', m:'a routine medical examination', ex:'She had her annual checkup.', syn:['examination','screening'], unit:4 },
  { w:'clinic', pos:'noun', m:'a place for medical treatment', ex:'The clinic opens at eight.', syn:['health centre','surgery'], unit:4 },
  { w:'contagious', pos:'adjective', m:'able to spread from person to person', ex:'Measles is highly contagious.', syn:['infectious','catching'], unit:4 },
  { w:'dehydration', pos:'noun', m:'the loss of too much water from the body', ex:'Dehydration can be dangerous in summer.', syn:['fluid loss'], unit:4 },
  { w:'dentist', pos:'noun', m:'a doctor who treats teeth', ex:'Visit the dentist twice a year.', syn:['dental surgeon'], unit:4 },
  { w:'diabetes', pos:'noun', m:'a disease caused by too much sugar in the blood', ex:'He manages his diabetes with diet.', syn:['sugar disease'], unit:4 },
  { w:'diagnosis', pos:'noun', m:'the identification of an illness', ex:'The diagnosis was confirmed by tests.', syn:['identification','assessment'], unit:4 },
  { w:'dose', pos:'noun', m:'an amount of medicine taken at one time', ex:'Take one dose after meals.', syn:['portion','amount'], unit:4 },
  { w:'dressing', pos:'noun', m:'a covering for a wound', ex:'The nurse changed the dressing.', syn:['bandage','plaster'], unit:4 },
  { w:'fever', pos:'noun', m:'a body temperature higher than normal', ex:'She has a high fever.', syn:['temperature','pyrexia'], unit:4 },
  { w:'flu', pos:'noun', m:'an illness like a bad cold', ex:'He was in bed with flu.', syn:['influenza','cold'], unit:4 },
  { w:'fracture', pos:'noun', m:'a broken bone', ex:'The X-ray showed a fracture.', syn:['break','crack'], unit:4 },
  { w:'germ', pos:'noun', m:'a tiny organism that causes disease', ex:'Wash your hands to kill germs.', syn:['microbe','bacteria'], unit:4 },
  { w:'heal', pos:'verb', m:'to become healthy again', ex:'The wound healed in a week.', syn:['recover','mend'], unit:4 },
  { w:'healthcare', pos:'noun', m:'medical services', ex:'Healthcare should be affordable.', syn:['medical care','health service'], unit:4 },
  { w:'herbal', pos:'adjective', m:'made from plants', ex:'She prefers herbal remedies.', syn:['plant-based','natural'], unit:4 },
  { w:'hospital', pos:'noun', m:'a place where sick people are treated', ex:'He was taken to hospital.', syn:['clinic','infirmary'], unit:4 },
  { w:'hydration', pos:'noun', m:'keeping enough water in the body', ex:'Hydration is vital during exercise.', syn:['fluid intake'], unit:4 },
  { w:'illness', pos:'noun', m:'a state of being unwell', ex:'She recovered from a long illness.', syn:['sickness','disease'], unit:4 },
  { w:'immune system', pos:'noun', m:'the body’s defence against disease', ex:'Sleep strengthens the immune system.', syn:['defences','immunity'], unit:4 },
  { w:'inhaler', pos:'noun', m:'a device for breathing in medicine', ex:'He always carries his inhaler.', syn:['breathing device'], unit:4 },
  { w:'injection', pos:'noun', m:'medicine given with a needle', ex:'The nurse gave him an injection.', syn:['shot','jab'], unit:4 },
  { w:'injured', pos:'adjective', m:'hurt physically', ex:'Two players were injured.', syn:['hurt','wounded'], unit:4 },
  { w:'intensive care', pos:'noun', m:'special medical treatment for serious illness', ex:'He was moved to intensive care.', syn:['ICU','critical care'], unit:4 },
  { w:'malaria', pos:'noun', m:'a disease spread by mosquitoes', ex:'Malaria is common in tropical areas.', syn:['mosquito disease'], unit:4 },
  { w:'malnutrition', pos:'noun', m:'poor health from lack of food', ex:'Malnutrition affects many children.', syn:['undernourishment'], unit:4 },
  { w:'medication', pos:'noun', m:'medicine used to treat illness', ex:'Take your medication daily.', syn:['medicine','drugs'], unit:4 },
  { w:'midwife', pos:'noun', m:'a person who helps with childbirth', ex:'The midwife delivered the baby.', syn:['birth attendant'], unit:4 },
  { w:'mineral', pos:'noun', m:'a natural substance needed by the body', ex:'Minerals are essential for health.', syn:['nutrient','element'], unit:4 },
  { w:'nurse', pos:'noun', m:'a person who cares for the sick', ex:'The nurse checked his pulse.', syn:['caregiver','attendant'], unit:4 },
  { w:'nursing', pos:'noun', m:'the profession of caring for the sick', ex:'She studied nursing in Dhaka.', syn:['caregiving'], unit:4 },
  { w:'operate', pos:'verb', m:'to perform surgery', ex:'The surgeon operated on his knee.', syn:['perform surgery'], unit:4 },
  { w:'painkiller', pos:'noun', m:'a medicine that reduces pain', ex:'She took a painkiller for her headache.', syn:['analgesic','pain reliever'], unit:4 },
  { w:'pharmacy', pos:'noun', m:'a shop that sells medicine', ex:'The pharmacy is next to the clinic.', syn:['chemist','drugstore'], unit:4 },
  { w:'plaster', pos:'noun', m:'a strip used to cover a small wound', ex:'He put a plaster on the cut.', syn:['bandage','dressing'], unit:4 },
  { w:'protein', pos:'noun', m:'a nutrient needed for growth', ex:'Fish and eggs are rich in protein.', syn:['nutrient','amino acid source'], unit:4 },
  { w:'pulse', pos:'noun', m:'the beat of the heart', ex:'The nurse checked his pulse.', syn:['heartbeat','throb'], unit:4 },
  { w:'quarantine', pos:'noun', m:'a period of isolation to prevent disease', ex:'Travellers were placed in quarantine.', syn:['isolation','separation'], unit:4 },
  { w:'remedy', pos:'noun', m:'a treatment for illness', ex:'Honey is a natural remedy for coughs.', syn:['cure','treatment'], unit:4 },
  { w:'surgery', pos:'noun', m:'medical treatment by operation', ex:'He needs surgery on his back.', syn:['operation','procedure'], unit:4 },
  { w:'surgeon', pos:'noun', m:'a doctor who performs operations', ex:'The surgeon saved his life.', syn:['operating doctor'], unit:4 },
  { w:'swelling', pos:'noun', m:'an enlarged part of the body', ex:'The swelling went down after a day.', syn:['inflammation','puffiness'], unit:4 },
  { w:'thermometer', pos:'noun', m:'an instrument for measuring temperature', ex:'The thermometer showed 102 degrees.', syn:['temperature gauge'], unit:4 },
  { w:'treatment', pos:'noun', m:'medical care for an illness', ex:'The treatment lasted three weeks.', syn:['therapy','care'], unit:4 },
  { w:'vaccination', pos:'noun', m:'giving a vaccine to prevent disease', ex:'Vaccination saves millions of lives.', syn:['immunisation','inoculation'], unit:4 },
  { w:'virus', pos:'noun', m:'a tiny organism that causes disease', ex:'The virus spreads through the air.', syn:['pathogen','germ'], unit:4 },
  { w:'ward', pos:'noun', m:'a room in a hospital for patients', ex:'She works in the children’s ward.', syn:['room','unit'], unit:4 },
  { w:'wound', pos:'noun', m:'an injury to the body', ex:'Clean the wound carefully.', syn:['injury','cut'], unit:4 },

  /* ---------- Unit 5 extras ---------- */
  { w:'abroad', pos:'adverb', m:'in or to a foreign country', ex:'She studies abroad.', syn:['overseas','foreign'], unit:5 },
  { w:'airfare', pos:'noun', m:'the cost of a plane ticket', ex:'Airfare doubled during the holidays.', syn:['ticket price'], unit:5 },
  { w:'airport', pos:'noun', m:'a place where planes take off', ex:'We reached the airport early.', syn:['terminal','aerodrome'], unit:5 },
  { w:'antique', pos:'noun', m:'an old valuable object', ex:'The shop sells antiques.', syn:['relic','curio'], unit:5 },
  { w:'artefact', pos:'noun', m:'an object made by humans long ago', ex:'The museum displays ancient artefacts.', syn:['relic','artifact'], unit:5 },
  { w:'backpack', pos:'noun', m:'a bag carried on the back', ex:'He travelled with a single backpack.', syn:['rucksack','knapsack'], unit:5 },
  { w:'backpacking', pos:'noun', m:'travelling cheaply with a backpack', ex:'They went backpacking across Asia.', syn:['budget travel'], unit:5 },
  { w:'bazaar', pos:'noun', m:'a market with many small shops', ex:'We bought spices at the bazaar.', syn:['market','souk'], unit:5 },
  { w:'bilingual', pos:'adjective', m:'able to speak two languages', ex:'She is bilingual in Bangla and English.', syn:['two-language'], unit:5 },
  { w:'boarding', pos:'noun', m:'getting on a plane or ship', ex:'Boarding begins at gate three.', syn:['embarkation'], unit:5 },
  { w:'brochure', pos:'noun', m:'a booklet with information', ex:'The travel brochure listed tours.', syn:['pamphlet','leaflet'], unit:5 },
  { w:'caravan', pos:'noun', m:'a group travelling together', ex:'A caravan crossed the desert.', syn:['convoy','train'], unit:5 },
  { w:'carnival', pos:'noun', m:'a public festival with music and dancing', ex:'The carnival filled the streets.', syn:['festival','fête'], unit:5 },
  { w:'ceremony', pos:'noun', m:'a formal event', ex:'The wedding ceremony was colourful.', syn:['rite','ritual'], unit:5 },
  { w:'citizenship', pos:'noun', m:'being a legal member of a country', ex:'She applied for citizenship.', syn:['nationality','belonging'], unit:5 },
  { w:'compass', pos:'noun', m:'an instrument showing direction', ex:'The hiker used a compass.', syn:['direction finder'], unit:5 },
  { w:'crossroads', pos:'noun', m:'a place where roads meet', ex:'Turn left at the crossroads.', syn:['junction','intersection'], unit:5 },
  { w:'cruise', pos:'noun', m:'a holiday on a ship', ex:'They took a cruise to Singapore.', syn:['voyage','sail'], unit:5 },
  { w:'currency', pos:'noun', m:'the money used in a country', ex:'What is the currency of Malaysia?', syn:['money','coinage'], unit:5 },
  { w:'departure', pos:'noun', m:'the act of leaving', ex:'Our departure is at six.', syn:['leaving','exit'], unit:5 },
  { w:'dialect', pos:'noun', m:'a form of a language spoken in an area', ex:'The Chittagong dialect is distinct.', syn:['variety','patois'], unit:5 },
  { w:'diplomacy', pos:'noun', m:'managing relations between countries', ex:'Diplomacy prevented the conflict.', syn:['statecraft','negotiation'], unit:5 },
  { w:'embassy', pos:'noun', m:'the office of an ambassador', ex:'She went to the embassy for a visa.', syn:['consulate','mission'], unit:5 },
  { w:'emigrate', pos:'verb', m:'to leave your country to live elsewhere', ex:'They emigrated to Canada.', syn:['migrate','relocate'], unit:5 },
  { w:'ethnic', pos:'adjective', m:'relating to a group with shared culture', ex:'Bangladesh has many ethnic groups.', syn:['cultural','racial'], unit:5 },
  { w:'etiquette', pos:'noun', m:'rules of polite behaviour', ex:'Travel etiquette varies by country.', syn:['manners','protocol'], unit:5 },
  { w:'ferry', pos:'noun', m:'a boat that carries people across water', ex:'We crossed the river by ferry.', syn:['boat','shuttle'], unit:5 },
  { w:'folklore', pos:'noun', m:'traditional stories of a people', ex:'Bangali folklore is rich in tales.', syn:['legend','mythology'], unit:5 },
  { w:'gastronomy', pos:'noun', m:'the art of good eating', ex:'Bangali gastronomy is famous.', syn:['cuisine','cooking'], unit:5 },
  { w:'guidebook', pos:'noun', m:'a book with travel information', ex:'The guidebook listed local sights.', syn:['handbook','manual'], unit:5 },
  { w:'hostel', pos:'noun', m:'a cheap place to stay', ex:'They stayed in a youth hostel.', syn:['lodging','inn'], unit:5 },
  { w:'immigration', pos:'noun', m:'the process of entering another country', ex:'Immigration checks took an hour.', syn:['entry control'], unit:5 },
  { w:'inhabit', pos:'verb', m:'to live in a place', ex:'Few people inhabit the remote island.', syn:['occupy','populate'], unit:5 },
  { w:'itinerant', pos:'adjective', m:'travelling from place to place', ex:'He led an itinerant life.', syn:['wandering','nomadic'], unit:5 },
  { w:'legend', pos:'noun', m:'an old traditional story', ex:'The legend explains the river’s origin.', syn:['myth','tale'], unit:5 },
  { w:'locale', pos:'noun', m:'the place where something happens', ex:'The film was shot in a rural locale.', syn:['setting','site'], unit:5 },
  { w:'luggage', pos:'noun', m:'bags taken on a journey', ex:'Our luggage was lost.', syn:['baggage','bags'], unit:5 },
  { w:'metropolis', pos:'noun', m:'a very large city', ex:'Dhaka is a bustling metropolis.', syn:['megacity','capital'], unit:5 },
  { w:'migration', pos:'noun', m:'moving from one place to another', ex:'Bird migration happens in winter.', syn:['movement','relocation'], unit:5 },
  { w:'mosque', pos:'noun', m:'a Muslim place of worship', ex:'The mosque is full on Fridays.', syn:['masjid','temple'], unit:5 },
  { w:'nomad', pos:'noun', m:'a person who moves from place to place', ex:'The nomads travel with their herds.', syn:['wanderer','migrant'], unit:5 },
  { w:'overseas', pos:'adverb', m:'in a foreign country', ex:'He works overseas.', syn:['abroad','foreign'], unit:5 },
  { w:'passport', pos:'noun', m:'an official document for travel', ex:'Check your passport’s expiry date.', syn:['travel document'], unit:5 },
  { w:'pilgrim', pos:'noun', m:'a person travelling to a holy place', ex:'Pilgrims gather for the festival.', syn:['traveller','devotee'], unit:5 },
  { w:'postcard', pos:'noun', m:'a card sent by post', ex:'She sent a postcard from Cox’s Bazar.', syn:['note','greeting card'], unit:5 },
  { w:'safari', pos:'noun', m:'a trip to see wild animals', ex:'They went on a safari in Africa.', syn:['expedition','game drive'], unit:5 },
  { w:'shrine', pos:'noun', m:'a holy place', ex:'The shrine attracts many visitors.', syn:['temple','sanctuary'], unit:5 },
  { w:'stopover', pos:'noun', m:'a short stay during a journey', ex:'We had a stopover in Doha.', syn:['layover','transit'], unit:5 },
  { w:'suburb', pos:'noun', m:'an area outside a city centre', ex:'They live in a quiet suburb.', syn:['outskirts','neighbourhood'], unit:5 },
  { w:'terminal', pos:'noun', m:'a building at an airport', ex:'The flight leaves from terminal two.', syn:['station','depot'], unit:5 },
  { w:'tourist', pos:'noun', m:'a person travelling for pleasure', ex:'Tourists flock to the beach.', syn:['visitor','traveller'], unit:5 },
  { w:'translator', pos:'noun', m:'a person who converts languages', ex:'The translator helped the delegation.', syn:['interpreter','linguist'], unit:5 },
  { w:'tribe', pos:'noun', m:'a group of people with shared customs', ex:'The tribe lives in the hills.', syn:['clan','community'], unit:5 },

  /* ---------- Unit 6 extras ---------- */
  { w:'aeroplane', pos:'noun', m:'a flying vehicle', ex:'The aeroplane landed safely.', syn:['aircraft','plane'], unit:6 },
  { w:'app', pos:'noun', m:'a program on a phone', ex:'This app teaches vocabulary.', syn:['application','program'], unit:6 },
  { w:'astronomy', pos:'noun', m:'the study of stars and planets', ex:'She is fascinated by astronomy.', syn:['space science'], unit:6 },
  { w:'atom', pos:'noun', m:'the smallest unit of matter', ex:'An atom has a nucleus.', syn:['particle','molecule'], unit:6 },
  { w:'battery', pos:'noun', m:'a device that stores electricity', ex:'The battery is almost dead.', syn:['cell','power source'], unit:6 },
  { w:'biology', pos:'noun', m:'the study of living things', ex:'Biology explains how life works.', syn:['life science'], unit:6 },
  { w:'bluetooth', pos:'noun', m:'a wireless connection technology', ex:'Connect the speaker via Bluetooth.', syn:['wireless'], unit:6 },
  { w:'browser', pos:'noun', m:'a program for viewing websites', ex:'Open the link in your browser.', syn:['web client'], unit:6 },
  { w:'bug', pos:'noun', m:'an error in a computer program', ex:'The developer fixed the bug.', syn:['error','glitch'], unit:6 },
  { w:'cable', pos:'noun', m:'a wire for carrying electricity or signals', ex:'Plug in the HDMI cable.', syn:['wire','cord'], unit:6 },
  { w:'calculator', pos:'noun', m:'a device for doing maths', ex:'Use a calculator for the sums.', syn:['computing device'], unit:6 },
  { w:'camera', pos:'noun', m:'a device for taking photographs', ex:'The phone has a great camera.', syn:['photographic device'], unit:6 },
  { w:'chemistry', pos:'noun', m:'the study of substances', ex:'Chemistry explains reactions.', syn:['chemical science'], unit:6 },
  { w:'chip', pos:'noun', m:'a tiny electronic circuit', ex:'The chip powers the phone.', syn:['microchip','processor'], unit:6 },
  { w:'cloud', pos:'noun', m:'remote storage on the internet', ex:'Save your files to the cloud.', syn:['online storage'], unit:6 },
  { w:'code', pos:'noun', m:'instructions written for a computer', ex:'She writes clean code.', syn:['program','script'], unit:6 },
  { w:'computer', pos:'noun', m:'an electronic machine for processing data', ex:'My computer is very slow.', syn:['PC','machine'], unit:6 },
  { w:'cyber', pos:'adjective', m:'relating to computers and networks', ex:'Cyber security is essential.', syn:['digital','online'], unit:6 },
  { w:'data', pos:'noun', m:'facts and information', ex:'The data shows a clear trend.', syn:['information','facts'], unit:6 },
  { w:'device', pos:'noun', m:'a machine made for a purpose', ex:'This device measures temperature.', syn:['gadget','instrument'], unit:6 },
  { w:'download', pos:'verb', m:'to copy data from the internet', ex:'Download the file before class.', syn:['retrieve','transfer'], unit:6 },
  { w:'drone', pos:'noun', m:'a small remote-controlled flying machine', ex:'Drones are used for delivery.', syn:['UAV','quadcopter'], unit:6 },
  { w:'electricity', pos:'noun', m:'energy carried by wires', ex:'Electricity was cut for two hours.', syn:['power','current'], unit:6 },
  { w:'electronics', pos:'noun', m:'the study of electrical circuits', ex:'He studies electronics at college.', syn:['circuitry'], unit:6 },
  { w:'email', pos:'noun', m:'a message sent electronically', ex:'She sent an email to her teacher.', syn:['electronic mail','message'], unit:6 },
  { w:'energy', pos:'noun', m:'the power to do work', ex:'Solar energy is clean.', syn:['power','force'], unit:6 },
  { w:'engine', pos:'noun', m:'a machine that produces power', ex:'The engine started with a roar.', syn:['motor','machine'], unit:6 },
  { w:'file', pos:'noun', m:'a collection of data on a computer', ex:'Save the file as a PDF.', syn:['document','record'], unit:6 },
  { w:'formula', pos:'noun', m:'a mathematical rule', ex:'Learn the formula by heart.', syn:['equation','rule'], unit:6 },
  { w:'frequency', pos:'noun', m:'the rate at which something repeats', ex:'The radio frequency was unclear.', syn:['rate','repetition'], unit:6 },
  { w:'fuel', pos:'noun', m:'material burned to produce energy', ex:'The car ran out of fuel.', syn:['petrol','energy source'], unit:6 },
  { w:'genetics', pos:'noun', m:'the study of genes', ex:'Genetics explains inherited traits.', syn:['heredity science'], unit:6 },
  { w:'geometry', pos:'noun', m:'the study of shapes', ex:'Geometry is his favourite topic.', syn:['mathematics of shape'], unit:6 },
  { w:'gravity', pos:'noun', m:'the force that pulls objects down', ex:'Gravity keeps us on the ground.', syn:['attraction','pull'], unit:6 },
  { w:'hacker', pos:'noun', m:'a person who breaks into computer systems', ex:'The hacker stole personal data.', syn:['intruder','cracker'], unit:6 },
  { w:'hardware', pos:'noun', m:'the physical parts of a computer', ex:'Upgrade the hardware for speed.', syn:['equipment','machinery'], unit:6 },
  { w:'headphone', pos:'noun', m:'a device worn over the ears', ex:'He listens with headphones.', syn:['earphone','headset'], unit:6 },
  { w:'keyboard', pos:'noun', m:'a set of keys for typing', ex:'The keyboard needs cleaning.', syn:['input device'], unit:6 },
  { w:'laser', pos:'noun', m:'a narrow beam of light', ex:'Lasers are used in surgery.', syn:['light beam'], unit:6 },
  { w:'lens', pos:'noun', m:'a curved piece of glass', ex:'The camera lens is scratched.', syn:['glass','optic'], unit:6 },
  { w:'machine learning', pos:'noun', m:'computers learning from data', ex:'Machine learning powers recommendations.', syn:['AI training'], unit:6 },
  { w:'magnet', pos:'noun', m:'an object that attracts iron', ex:'The magnet stuck to the fridge.', syn:['lodestone'], unit:6 },
  { w:'mathematics', pos:'noun', m:'the study of numbers', ex:'Mathematics is the language of science.', syn:['maths','arithmetic'], unit:6 },
  { w:'memory', pos:'noun', m:'the storage capacity of a computer', ex:'The phone has plenty of memory.', syn:['storage','RAM'], unit:6 },
  { w:'microchip', pos:'noun', m:'a tiny electronic circuit', ex:'Microchips power modern devices.', syn:['chip','processor'], unit:6 },
  { w:'mobile', pos:'noun', m:'a phone you can carry', ex:'She bought a new mobile.', syn:['cell phone','handset'], unit:6 },
  { w:'monitor', pos:'noun', m:'a screen for a computer', ex:'The monitor is 24 inches wide.', syn:['screen','display'], unit:6 },
  { w:'mouse', pos:'noun', m:'a device for controlling a cursor', ex:'Click with the mouse.', syn:['pointing device'], unit:6 },
  { w:'nuclear', pos:'adjective', m:'relating to the energy inside atoms', ex:'Nuclear power is controversial.', syn:['atomic'], unit:6 },
  { w:'password', pos:'noun', m:'a secret word for access', ex:'Never share your password.', syn:['passcode','key'], unit:6 },
  { w:'printer', pos:'noun', m:'a machine that prints documents', ex:'The printer is out of ink.', syn:['printing machine'], unit:6 },
  { w:'processor', pos:'noun', m:'the part of a computer that does calculations', ex:'A faster processor speeds up work.', syn:['CPU','chip'], unit:6 },
  { w:'program', pos:'noun', m:'a set of computer instructions', ex:'She wrote a simple program.', syn:['software','code'], unit:6 },
  { w:'radar', pos:'noun', m:'a system that detects objects by radio waves', ex:'Radar tracks the aeroplane.', syn:['detection system'], unit:6 },
  { w:'rocket', pos:'noun', m:'a vehicle that travels into space', ex:'The rocket launched successfully.', syn:['spacecraft','missile'], unit:6 },
  { w:'screen', pos:'noun', m:'the flat surface showing images', ex:'The screen cracked.', syn:['display','monitor'], unit:6 },
  { w:'sensor', pos:'noun', m:'a device that detects changes', ex:'The sensor detects motion.', syn:['detector','probe'], unit:6 },
  { w:'smartphone', pos:'noun', m:'a phone with computer features', ex:'Everyone has a smartphone now.', syn:['mobile','handset'], unit:6 },
  { w:'solar', pos:'adjective', m:'relating to the sun', ex:'Solar panels reduce electricity bills.', syn:['sun-powered'], unit:6 },
  { w:'spacecraft', pos:'noun', m:'a vehicle for travelling in space', ex:'The spacecraft reached Mars.', syn:['rocket','shuttle'], unit:6 },
  { w:'telescope', pos:'noun', m:'an instrument for viewing distant objects', ex:'We saw Saturn through the telescope.', syn:['scope','spyglass'], unit:6 },
  { w:'turbine', pos:'noun', m:'a machine that generates power from flow', ex:'Wind turbines generate electricity.', syn:['generator'], unit:6 },
  { w:'update', pos:'verb', m:'to make something more current', ex:'Update the app to fix bugs.', syn:['upgrade','refresh'], unit:6 },
  { w:'user', pos:'noun', m:'a person who uses something', ex:'The app has a million users.', syn:['consumer','operator'], unit:6 },
  { w:'virus', pos:'noun', m:'a harmful computer program', ex:'A virus deleted his files.', syn:['malware','worm'], unit:6 },
  { w:'website', pos:'noun', m:'a set of pages on the internet', ex:'Visit the school website.', syn:['site','web page'], unit:6 },
  { w:'wireless', pos:'adjective', m:'without connecting wires', ex:'The wireless network is fast.', syn:['cordless','Wi-Fi'], unit:6 },

  /* ---------- Unit 7 extras ---------- */
  { w:'archery', pos:'noun', m:'the sport of shooting arrows', ex:'Archery is an ancient sport.', syn:['bow and arrow'], unit:7 },
  { w:'arena', pos:'noun', m:'a place for sports or events', ex:'The arena was packed.', syn:['stadium','ground'], unit:7 },
  { w:'athletics', pos:'noun', m:'track and field sports', ex:'She excels in athletics.', syn:['track and field'], unit:7 },
  { w:'badminton', pos:'noun', m:'a game played with rackets and a shuttlecock', ex:'They play badminton every evening.', syn:['racket sport'], unit:7 },
  { w:'baseball', pos:'noun', m:'a game played with a bat and ball', ex:'Baseball is popular in Japan.', syn:['bat sport'], unit:7 },
  { w:'basketball', pos:'noun', m:'a game where you throw a ball in a hoop', ex:'He plays basketball after school.', syn:['hoop sport'], unit:7 },
  { w:'bat', pos:'noun', m:'a stick used to hit a ball', ex:'He swung the bat hard.', syn:['club','racket'], unit:7 },
  { w:'batsman', pos:'noun', m:'a player who hits the ball', ex:'The batsman scored a century.', syn:['hitter','batter'], unit:7 },
  { w:'bicycle', pos:'noun', m:'a two-wheeled vehicle', ex:'She rides her bicycle to school.', syn:['bike','cycle'], unit:7 },
  { w:'bowler', pos:'noun', m:'a player who throws the ball', ex:'The bowler took three wickets.', syn:['pitcher','thrower'], unit:7 },
  { w:'boxing', pos:'noun', m:'a sport of fighting with fists', ex:'Boxing requires strength and speed.', syn:['pugilism'], unit:7 },
  { w:'captaincy', pos:'noun', m:'the role of being captain', ex:'She took over the captaincy.', syn:['leadership'], unit:7 },
  { w:'catch', pos:'verb', m:'to grab a moving ball', ex:'He caught the ball one-handed.', syn:['grab','seize'], unit:7 },
  { w:'championship', pos:'noun', m:'a competition to find the best', ex:'They won the championship.', syn:['tournament','title'], unit:7 },
  { w:'chess', pos:'noun', m:'a board game of strategy', ex:'He plays chess every evening.', syn:['board game'], unit:7 },
  { w:'cricket', pos:'noun', m:'a bat-and-ball game popular in Bangladesh', ex:'Cricket is a national passion.', syn:['bat sport'], unit:7 },
  { w:'cycle', pos:'verb', m:'to ride a bicycle', ex:'They cycled to the village.', syn:['ride','bike'], unit:7 },
  { w:'defender', pos:'noun', m:'a player who stops attacks', ex:'The defender cleared the ball.', syn:['back','protector'], unit:7 },
  { w:'dribble', pos:'verb', m:'to move a ball with small touches', ex:'He dribbled past two players.', syn:['manoeuvre'], unit:7 },
  { w:'field', pos:'noun', m:'the area where a game is played', ex:'The field was muddy.', syn:['pitch','ground'], unit:7 },
  { w:'football', pos:'noun', m:'a game played by kicking a ball', ex:'Football is played worldwide.', syn:['soccer'], unit:7 },
  { w:'friendly', pos:'noun', m:'a match that is not part of a competition', ex:'They played a friendly on Sunday.', syn:['practice match'], unit:7 },
  { w:'goalkeeper', pos:'noun', m:'a player who guards the goal', ex:'The goalkeeper made a great save.', syn:['keeper','goalie'], unit:7 },
  { w:'goal', pos:'noun', m:'a point scored in football', ex:'He scored the winning goal.', syn:['score','point'], unit:7 },
  { w:'golf', pos:'noun', m:'a game played with clubs and a small ball', ex:'He plays golf on weekends.', syn:['club sport'], unit:7 },
  { w:'gymnasium', pos:'noun', m:'a room for physical exercise', ex:'The gymnasium has new equipment.', syn:['gym','fitness centre'], unit:7 },
  { w:'halftime', pos:'noun', m:'a break in the middle of a match', ex:'The score was level at halftime.', syn:['interval','break'], unit:7 },
  { w:'helmet', pos:'noun', m:'a hard hat for protection', ex:'Always wear a helmet when cycling.', syn:['protective headgear'], unit:7 },
  { w:'hockey', pos:'noun', m:'a game played with sticks and a ball', ex:'Hockey is popular in South Asia.', syn:['stick sport'], unit:7 },
  { w:'hurdle', pos:'noun', m:'a barrier jumped over in a race', ex:'She cleared every hurdle.', syn:['obstacle','barrier'], unit:7 },
  { w:'javelin', pos:'noun', m:'a long spear thrown in athletics', ex:'He threw the javelin far.', syn:['spear'], unit:7 },
  { w:'jersey', pos:'noun', m:'a shirt worn by a sports player', ex:'He wore the number 10 jersey.', syn:['shirt','kit'], unit:7 },
  { w:'jog', pos:'verb', m:'to run slowly', ex:'She jogs every morning.', syn:['run','trot'], unit:7 },
  { w:'kabaddi', pos:'noun', m:'a South Asian team sport', ex:'Kabaddi is played across Bangladesh.', syn:['tag sport'], unit:7 },
  { w:'kick', pos:'verb', m:'to hit with the foot', ex:'He kicked the ball into the net.', syn:['strike','boot'], unit:7 },
  { w:'lose', pos:'verb', m:'to be beaten in a contest', ex:'They lost the final.', syn:['be defeated','suffer defeat'], unit:7 },
  { w:'net', pos:'noun', m:'a mesh used in many sports', ex:'The ball hit the net.', syn:['mesh'], unit:7 },
  { w:'offside', pos:'adjective', m:'in an illegal position in football', ex:'The goal was ruled offside.', syn:['illegal position'], unit:7 },
  { w:'olympics', pos:'noun', m:'an international sports event', ex:'The Olympics are held every four years.', syn:['games','competition'], unit:7 },
  { w:'pass', pos:'verb', m:'to send the ball to a teammate', ex:'He passed the ball neatly.', syn:['transfer','kick'], unit:7 },
  { w:'pitch', pos:'noun', m:'the field for cricket or football', ex:'The pitch was dry and hard.', syn:['field','ground'], unit:7 },
  { w:'player', pos:'noun', m:'a person who takes part in a game', ex:'Eleven players are on the field.', syn:['participant','athlete'], unit:7 },
  { w:'rowing', pos:'noun', m:'the sport of propelling a boat with oars', ex:'They won the rowing competition.', syn:['oarsmanship'], unit:7 },
  { w:'rugby', pos:'noun', m:'a game played with an oval ball', ex:'Rugby is popular in New Zealand.', syn:['football variant'], unit:7 },
  { w:'runner-up', pos:'noun', m:'the second-place finisher', ex:'She was runner-up in the final.', syn:['second place'], unit:7 },
  { w:'save', pos:'noun', m:'a stop of a shot by a goalkeeper', ex:'The keeper made a brilliant save.', syn:['block','stop'], unit:7 },
  { w:'scoreboard', pos:'noun', m:'a board showing the score', ex:'The scoreboard showed 2-0.', syn:['display board'], unit:7 },
  { w:'serve', pos:'verb', m:'to start play by hitting the ball', ex:'She served an ace.', syn:['start play'], unit:7 },
  { w:'shuttlecock', pos:'noun', m:'the object hit in badminton', ex:'The shuttlecock landed out of bounds.', syn:['birdie'], unit:7 },
  { w:'skate', pos:'verb', m:'to move on ice or wheels', ex:'They skated on the frozen pond.', syn:['glide'], unit:7 },
  { w:'ski', pos:'verb', m:'to move over snow on long boards', ex:'They skied down the slope.', syn:['glide on snow'], unit:7 },
  { w:'sprint', pos:'noun', m:'a short fast race', ex:'He won the 100-metre sprint.', syn:['dash','race'], unit:7 },
  { w:'squash', pos:'noun', m:'a racket game played in a walled court', ex:'They play squash at the club.', syn:['racket sport'], unit:7 },
  { w:'stump', pos:'noun', m:'a wicket in cricket', ex:'The ball hit the stumps.', syn:['wicket'], unit:7 },
  { w:'swim', pos:'verb', m:'to move through water', ex:'She swims every morning.', syn:['bathe','paddle'], unit:7 },
  { w:'tackle', pos:'noun', m:'an attempt to take the ball from an opponent', ex:'His tackle stopped the attack.', syn:['challenge','interception'], unit:7 },
  { w:'tennis', pos:'noun', m:'a racket game played over a net', ex:'They play tennis on Sundays.', syn:['racket sport'], unit:7 },
  { w:'throw', pos:'verb', m:'to send something through the air', ex:'He threw the ball to first base.', syn:['hurl','toss'], unit:7 },
  { w:'umpire', pos:'noun', m:'an official in cricket or tennis', ex:'The umpire raised his finger.', syn:['referee','judge'], unit:7 },
  { w:'volleyball', pos:'noun', m:'a game played over a high net', ex:'They played volleyball on the beach.', syn:['net sport'], unit:7 },
  { w:'wicket', pos:'noun', m:'a set of stumps in cricket', ex:'He took five wickets.', syn:['stumps','target'], unit:7 },
  { w:'wrestling', pos:'noun', m:'a sport of grappling', ex:'Wrestling is an ancient sport.', syn:['grappling'], unit:7 },

  /* ---------- Unit 8 extras ---------- */
  { w:'almond', pos:'noun', m:'an edible nut', ex:'Almonds are used in desserts.', syn:['nut'], unit:8 },
  { w:'bake', pos:'verb', m:'to cook in an oven', ex:'She baked a cake.', syn:['roast','cook'], unit:8 },
  { w:'barbecue', pos:'noun', m:'a meal cooked outdoors over fire', ex:'They had a barbecue in the garden.', syn:['grill','cookout'], unit:8 },
  { w:'batter', pos:'noun', m:'a mixture of flour and liquid', ex:'Dip the fish in batter.', syn:['mixture','dough'], unit:8 },
  { w:'beef', pos:'noun', m:'meat from a cow', ex:'Beef curry is a popular dish.', syn:['meat','cow meat'], unit:8 },
  { w:'bitter', pos:'adjective', m:'having a sharp unpleasant taste', ex:'The medicine tasted bitter.', syn:['sharp','acrid'], unit:8 },
  { w:'boil', pos:'verb', m:'to heat liquid until it bubbles', ex:'Boil the rice for twenty minutes.', syn:['simmer','cook'], unit:8 },
  { w:'bread', pos:'noun', m:'a staple food made from flour', ex:'We bought fresh bread.', syn:['loaf','baked good'], unit:8 },
  { w:'breakfast', pos:'noun', m:'the first meal of the day', ex:'Breakfast is served at seven.', syn:['morning meal'], unit:8 },
  { w:'broth', pos:'noun', m:'a thin soup', ex:'Chicken broth is good for colds.', syn:['soup','stock'], unit:8 },
  { w:'café', pos:'noun', m:'a small place serving drinks and snacks', ex:'We met at a café.', syn:['coffee shop','diner'], unit:8 },
  { w:'canteen', pos:'noun', m:'a place where food is served cheaply', ex:'Students eat in the canteen.', syn:['dining hall','refectory'], unit:8 },
  { w:'catering', pos:'noun', m:'providing food for events', ex:'The catering was excellent.', syn:['food service'], unit:8 },
  { w:'cereal', pos:'noun', m:'a grain used for food', ex:'Wheat is a common cereal.', syn:['grain','corn'], unit:8 },
  { w:'chef', pos:'noun', m:'a professional cook', ex:'The chef prepared a special dish.', syn:['cook','culinary expert'], unit:8 },
  { w:'chilli', pos:'noun', m:'a hot spicy pepper', ex:'Add green chillies for heat.', syn:['pepper','spice'], unit:8 },
  { w:'chop', pos:'verb', m:'to cut into pieces', ex:'Chop the onions finely.', syn:['cut','dice'], unit:8 },
  { w:'coconut', pos:'noun', m:'a large tropical fruit with hard shell', ex:'Coconut water is refreshing.', syn:['palm fruit'], unit:8 },
  { w:'coffee', pos:'noun', m:'a hot drink made from roasted beans', ex:'She drinks coffee every morning.', syn:['brew','espresso'], unit:8 },
  { w:'cook', pos:'verb', m:'to prepare food by heating', ex:'He cooks dinner every night.', syn:['prepare','make'], unit:8 },
  { w:'coriander', pos:'noun', m:'a herb used in cooking', ex:'Garnish with fresh coriander.', syn:['cilantro','herb'], unit:8 },
  { w:'creamy', pos:'adjective', m:'having a smooth thick texture', ex:'The soup was rich and creamy.', syn:['smooth','rich'], unit:8 },
  { w:'crispy', pos:'adjective', m:'pleasantly hard and dry', ex:'The fries were crispy.', syn:['crunchy','brittle'], unit:8 },
  { w:'curry', pos:'noun', m:'a dish cooked with spices', ex:'Chicken curry is her favourite.', syn:['spiced dish','stew'], unit:8 },
  { w:'cutlery', pos:'noun', m:'knives, forks and spoons', ex:'Set the cutlery on the table.', syn:['silverware','utensils'], unit:8 },
  { w:'dairy', pos:'noun', m:'food made from milk', ex:'She avoids dairy products.', syn:['milk products'], unit:8 },
  { w:'dessert', pos:'noun', m:'sweet food eaten after a meal', ex:'We had ice cream for dessert.', syn:['pudding','sweet'], unit:8 },
  { w:'dice', pos:'verb', m:'to cut into small cubes', ex:'Dice the carrots.', syn:['chop','cube'], unit:8 },
  { w:'dish', pos:'noun', m:'a prepared item of food', ex:'Biryani is a famous dish.', syn:['meal','recipe'], unit:8 },
  { w:'dough', pos:'noun', m:'a thick mixture of flour and water', ex:'Knead the dough well.', syn:['mixture','paste'], unit:8 },
  { w:'dumpling', pos:'noun', m:'a small ball of dough with filling', ex:'The dumplings were steamed.', syn:['wonton'], unit:8 },
  { w:'fillet', pos:'noun', m:'a piece of boneless meat or fish', ex:'Grill the fish fillet.', syn:['cut','slice'], unit:8 },
  { w:'flour', pos:'noun', m:'powder made from grain', ex:'Mix the flour with water.', syn:['powder','meal'], unit:8 },
  { w:'food court', pos:'noun', m:'an area with many food stalls', ex:'The mall has a large food court.', syn:['food hall'], unit:8 },
  { w:'fry', pos:'verb', m:'to cook in hot oil', ex:'Fry the onions until golden.', syn:['sauté','cook'], unit:8 },
  { w:'garlic', pos:'noun', m:'a strong-smelling bulb used in cooking', ex:'Add garlic to the sauce.', syn:['clove','seasoning'], unit:8 },
  { w:'ginger', pos:'noun', m:'a spicy root used in cooking', ex:'Ginger tea is soothing.', syn:['root','spice'], unit:8 },
  { w:'grain', pos:'noun', m:'a seed used as food', ex:'Rice is a staple grain.', syn:['cereal','seed'], unit:8 },
  { w:'gravy', pos:'noun', m:'a sauce made from meat juices', ex:'Serve the meat with gravy.', syn:['sauce','jus'], unit:8 },
  { w:'grill', pos:'verb', m:'to cook over direct heat', ex:'Grill the chicken for ten minutes.', syn:['barbecue','broil'], unit:8 },
  { w:'herb', pos:'noun', m:'a plant used to flavour food', ex:'Mint is a common herb.', syn:['seasoning','plant'], unit:8 },
  { w:'honey', pos:'noun', m:'a sweet substance made by bees', ex:'Add honey to your tea.', syn:['nectar','syrup'], unit:8 },
  { w:'hunger', pos:'noun', m:'the feeling of needing food', ex:'Hunger is a global problem.', syn:['appetite','famine'], unit:8 },
  { w:'juice', pos:'noun', m:'liquid from fruit or vegetables', ex:'Orange juice is refreshing.', syn:['drink','nectar'], unit:8 },
  { w:'knead', pos:'verb', m:'to press and shape dough', ex:'Knead the dough for five minutes.', syn:['work','press'], unit:8 },
  { w:'lentil', pos:'noun', m:'a small dried seed used in soups', ex:'Lentil soup is nutritious.', syn:['dal','pulse'], unit:8 },
  { w:'loaf', pos:'noun', m:'a shaped mass of bread', ex:'He bought a loaf of bread.', syn:['bread','brick'], unit:8 },
  { w:'lunch', pos:'noun', m:'the meal eaten in the middle of the day', ex:'We had lunch at noon.', syn:['midday meal'], unit:8 },
  { w:'mango', pos:'noun', m:'a sweet tropical fruit', ex:'Mangoes ripen in summer.', syn:['tropical fruit'], unit:8 },
  { w:'meal', pos:'noun', m:'food eaten at one time', ex:'We had a delicious meal.', syn:['dish','repast'], unit:8 },
  { w:'microwave', pos:'noun', m:'an oven that uses radio waves to cook', ex:'Heat the food in the microwave.', syn:['oven'], unit:8 },
  { w:'mint', pos:'noun', m:'a herb with a fresh taste', ex:'Mint chutney is popular.', syn:['herb','peppermint'], unit:8 },
  { w:'mustard', pos:'noun', m:'a yellow pungent condiment', ex:'Mustard oil is used in Bangali cooking.', syn:['condiment','sauce'], unit:8 },
  { w:'noodle', pos:'noun', m:'a strip of pasta or dough', ex:'Noodles are quick to cook.', syn:['pasta','vermicelli'], unit:8 },
  { w:'nut', pos:'noun', m:'a hard-shelled fruit', ex:'Cashew nuts are expensive.', syn:['seed','kernel'], unit:8 },
  { w:'onion', pos:'noun', m:'a round vegetable with layers', ex:'Chop the onion finely.', syn:['bulb','vegetable'], unit:8 },
  { w:'oven', pos:'noun', m:'an enclosed space for cooking', ex:'Bake the bread in the oven.', syn:['stove','cooker'], unit:8 },
  { w:'pan', pos:'noun', m:'a flat container for cooking', ex:'Heat oil in a pan.', syn:['skillet','frying pan'], unit:8 },
  { w:'pancake', pos:'noun', m:'a flat cake cooked in a pan', ex:'They ate pancakes for breakfast.', syn:['crepe','flapjack'], unit:8 },
  { w:'pepper', pos:'noun', m:'a spice used to flavour food', ex:'Add salt and pepper.', syn:['spice','seasoning'], unit:8 },
  { w:'pickle', pos:'noun', m:'vegetables preserved in vinegar or oil', ex:'Mango pickle is a favourite.', syn:['preserve','chutney'], unit:8 },
  { w:'plate', pos:'noun', m:'a flat dish for food', ex:'Put the rice on a plate.', syn:['dish','platter'], unit:8 },
  { w:'pork', pos:'noun', m:'meat from a pig', ex:'Pork is not eaten by many people here.', syn:['pig meat'], unit:8 },
  { w:'porridge', pos:'noun', m:'a soft food made from oats', ex:'He eats porridge for breakfast.', syn:['oatmeal','gruel'], unit:8 },
  { w:'poultry', pos:'noun', m:'birds raised for meat or eggs', ex:'Poultry farming is common here.', syn:['fowl','chicken'], unit:8 },
  { w:'prawn', pos:'noun', m:'a small sea animal eaten as food', ex:'Prawn curry is a delicacy.', syn:['shrimp','crustacean'], unit:8 },
  { w:'pudding', pos:'noun', m:'a sweet dish eaten after a meal', ex:'Rice pudding is a classic dessert.', syn:['dessert','sweet'], unit:8 },
  { w:'raw', pos:'adjective', m:'not cooked', ex:'Do not eat raw chicken.', syn:['uncooked','fresh'], unit:8 },
  { w:'roast', pos:'verb', m:'to cook in an oven or over fire', ex:'Roast the chicken for an hour.', syn:['bake','grill'], unit:8 },
  { w:'salad', pos:'noun', m:'a cold dish of vegetables', ex:'A fresh salad is healthy.', syn:['greens','vegetable dish'], unit:8 },
  { w:'sauce', pos:'noun', m:'a liquid served with food', ex:'Add tomato sauce to the pasta.', syn:['gravy','dressing'], unit:8 },
  { w:'sausage', pos:'noun', m:'minced meat in a casing', ex:'He fried the sausages.', syn:['frankfurter'], unit:8 },
  { w:'seafood', pos:'noun', m:'edible sea animals', ex:'Cox’s Bazar is famous for seafood.', syn:['fish','shellfish'], unit:8 },
  { w:'season', pos:'verb', m:'to add salt or spices to food', ex:'Season the soup with salt.', syn:['flavour','spice'], unit:8 },
  { w:'simmer', pos:'verb', m:'to cook just below boiling point', ex:'Let the curry simmer for an hour.', syn:['stew','bubble'], unit:8 },
  { w:'sip', pos:'verb', m:'to drink slowly in small amounts', ex:'She sipped her tea.', syn:['taste','drink'], unit:8 },
  { w:'slice', pos:'noun', m:'a thin flat piece of food', ex:'He ate a slice of cake.', syn:['piece','portion'], unit:8 },
  { w:'soup', pos:'noun', m:'a liquid dish made by boiling', ex:'Chicken soup is comforting.', syn:['broth','stew'], unit:8 },
  { w:'sour', pos:'adjective', m:'having a sharp acidic taste', ex:'The lemon was very sour.', syn:['tart','acidic'], unit:8 },
  { w:'soy sauce', pos:'noun', m:'a salty sauce made from soybeans', ex:'Add soy sauce to the noodles.', syn:['seasoning','condiment'], unit:8 },
  { w:'spicy', pos:'adjective', m:'having a strong hot flavour', ex:'The curry was too spicy.', syn:['hot','piquant'], unit:8 },
  { w:'steam', pos:'verb', m:'to cook using hot vapour', ex:'Steam the vegetables lightly.', syn:['cook','poach'], unit:8 },
  { w:'stew', pos:'noun', m:'a dish of meat and vegetables cooked slowly', ex:'Beef stew is hearty.', syn:['casserole','hotpot'], unit:8 },
  { w:'sugar', pos:'noun', m:'a sweet substance used in food', ex:'Add a spoon of sugar.', syn:['sweetener','sucrose'], unit:8 },
  { w:'sweet', pos:'adjective', m:'having a sugary taste', ex:'The mango was very sweet.', syn:['sugary','honeyed'], unit:8 },
  { w:'tablespoon', pos:'noun', m:'a large spoon for serving', ex:'Add two tablespoons of oil.', syn:['serving spoon'], unit:8 },
  { w:'tamarind', pos:'noun', m:'a sour tropical fruit used in cooking', ex:'Tamarind adds tang to the dish.', syn:['sour fruit'], unit:8 },
  { w:'teaspoon', pos:'noun', m:'a small spoon for stirring', ex:'Add a teaspoon of salt.', syn:['small spoon'], unit:8 },
  { w:'toast', pos:'noun', m:'bread browned by heat', ex:'She had toast and eggs.', syn:['browned bread'], unit:8 },
  { w:'turmeric', pos:'noun', m:'a yellow spice used in cooking', ex:'Turmeric gives curry its colour.', syn:['spice','haldi'], unit:8 },
  { w:'vegetable', pos:'noun', m:'a plant eaten as food', ex:'Eat plenty of vegetables.', syn:['greens','produce'], unit:8 },
  { w:'vinegar', pos:'noun', m:'a sour liquid used in cooking', ex:'Add vinegar to the salad.', syn:['acid','condiment'], unit:8 },
  { w:'yoghurt', pos:'noun', m:'a thick food made from fermented milk', ex:'Yoghurt is good for digestion.', syn:['curd','dahi'], unit:8 },

  /* ---------- Unit 9 extras ---------- */
  { w:'accountant', pos:'noun', m:'a person who keeps financial records', ex:'The accountant filed the taxes.', syn:['bookkeeper','auditor'], unit:9 },
  { w:'advertisement', pos:'noun', m:'a public notice promoting something', ex:'The advertisement appeared online.', syn:['promotion','notice'], unit:9 },
  { w:'appoint', pos:'verb', m:'to choose someone for a job', ex:'She was appointed manager.', syn:['nominate','assign'], unit:9 },
  { w:'attendance', pos:'noun', m:'being present at work', ex:'Attendance is recorded daily.', syn:['presence','punctuality'], unit:9 },
  { w:'audit', pos:'noun', m:'an official examination of accounts', ex:'The annual audit begins Monday.', syn:['inspection','review'], unit:9 },
  { w:'bonus', pos:'noun', m:'extra money given for good work', ex:'Employees received a year-end bonus.', syn:['reward','incentive'], unit:9 },
  { w:'boss', pos:'noun', m:'a person in charge at work', ex:'My boss is very supportive.', syn:['manager','supervisor'], unit:9 },
  { w:'branch', pos:'noun', m:'a local office of a company', ex:'She works at the Gulshan branch.', syn:['office','division'], unit:9 },
  { w:'business', pos:'noun', m:'an organisation that trades', ex:'He runs a small business.', syn:['company','enterprise'], unit:9 },
  { w:'candidate', pos:'noun', m:'a person applying for a job', ex:'Ten candidates were shortlisted.', syn:['applicant','contender'], unit:9 },
  { w:'career path', pos:'noun', m:'the sequence of jobs a person has', ex:'She chose a career path in medicine.', syn:['profession','route'], unit:9 },
  { w:'client', pos:'noun', m:'a person who pays for services', ex:'The client approved the design.', syn:['customer','patron'], unit:9 },
  { w:'commission', pos:'noun', m:'payment based on sales', ex:'Sales staff earn a commission.', syn:['fee','percentage'], unit:9 },
  { w:'company', pos:'noun', m:'a business organisation', ex:'The company employs 500 people.', syn:['firm','business'], unit:9 },
  { w:'contract', pos:'noun', m:'a formal written agreement', ex:'She signed a two-year contract.', syn:['agreement','deal'], unit:9 },
  { w:'cover letter', pos:'noun', m:'a letter sent with a CV', ex:'Write a strong cover letter.', syn:['application letter'], unit:9 },
  { w:'coworker', pos:'noun', m:'a person you work with', ex:'My coworkers are friendly.', syn:['colleague','associate'], unit:9 },
  { w:'credentials', pos:'noun', m:'qualifications and experience', ex:'Her credentials are impressive.', syn:['qualifications','certificates'], unit:9 },
  { w:'customer', pos:'noun', m:'a person who buys goods', ex:'The customer is always right.', syn:['client','buyer'], unit:9 },
  { w:'demotion', pos:'noun', m:'a move to a lower position', ex:'He feared demotion after the mistake.', syn:['downgrade'], unit:9 },
  { w:'department', pos:'noun', m:'a section of an organisation', ex:'She works in the sales department.', syn:['division','section'], unit:9 },
  { w:'director', pos:'noun', m:'a senior manager of a company', ex:'The director approved the budget.', syn:['executive','chief'], unit:9 },
  { w:'dismiss', pos:'verb', m:'to remove someone from a job', ex:'He was dismissed for misconduct.', syn:['fire','sack'], unit:9 },
  { w:'duty', pos:'noun', m:'a task you must do', ex:'Her duties include filing.', syn:['responsibility','task'], unit:9 },
  { w:'earnings', pos:'noun', m:'money received from work', ex:'His earnings doubled this year.', syn:['income','wages'], unit:9 },
  { w:'employee', pos:'noun', m:'a person who works for someone', ex:'The company has 200 employees.', syn:['worker','staff member'], unit:9 },
  { w:'employment', pos:'noun', m:'the state of having a job', ex:'She found employment quickly.', syn:['work','job'], unit:9 },
  { w:'executive', pos:'noun', m:'a senior manager', ex:'The executive made the decision.', syn:['director','manager'], unit:9 },
  { w:'firm', pos:'noun', m:'a business company', ex:'He works for a law firm.', syn:['company','business'], unit:9 },
  { w:'hire', pos:'verb', m:'to give someone a job', ex:'They hired three new teachers.', syn:['employ','recruit'], unit:9 },
  { w:'incentive', pos:'noun', m:'something that motivates you', ex:'Bonuses are an incentive to work harder.', syn:['motivation','reward'], unit:9 },
  { w:'income', pos:'noun', m:'money earned regularly', ex:'Her income supports the family.', syn:['earnings','salary'], unit:9 },
  { w:'industry', pos:'noun', m:'the production of goods', ex:'The garment industry is vital.', syn:['manufacturing','trade'], unit:9 },
  { w:'jobless', pos:'adjective', m:'without a job', ex:'He has been jobless for months.', syn:['unemployed','out of work'], unit:9 },
  { w:'labour', pos:'noun', m:'work, especially physical', ex:'The labourers worked all day.', syn:['work','toil'], unit:9 },
  { w:'leadership', pos:'noun', m:'the ability to lead others', ex:'Good leadership inspires teams.', syn:['guidance','direction'], unit:9 },
  { w:'manager', pos:'noun', m:'a person who controls a business', ex:'The manager called a meeting.', syn:['supervisor','boss'], unit:9 },
  { w:'manual', pos:'adjective', m:'involving physical work', ex:'Manual labour can be tiring.', syn:['physical','hands-on'], unit:9 },
  { w:'meeting', pos:'noun', m:'a gathering to discuss work', ex:'The meeting starts at ten.', syn:['conference','gathering'], unit:9 },
  { w:'overtime', pos:'noun', m:'extra hours worked', ex:'He works overtime every Friday.', syn:['extra hours'], unit:9 },
  { w:'part-time', pos:'adjective', m:'working fewer than full hours', ex:'She has a part-time job.', syn:['casual','half-time'], unit:9 },
  { w:'payroll', pos:'noun', m:'the list of employees and their pay', ex:'Payroll is processed monthly.', syn:['wages list'], unit:9 },
  { w:'performance', pos:'noun', m:'how well someone does their job', ex:'Her performance was outstanding.', syn:['achievement','output'], unit:9 },
  { w:'profession', pos:'noun', m:'a job requiring special training', ex:'Teaching is a noble profession.', syn:['career','vocation'], unit:9 },
  { w:'promote', pos:'verb', m:'to raise someone to a higher rank', ex:'He was promoted to supervisor.', syn:['upgrade','advance'], unit:9 },
  { w:'recruit', pos:'verb', m:'to find new employees', ex:'The firm is recruiting engineers.', syn:['hire','enlist'], unit:9 },
  { w:'referee', pos:'noun', m:'a person who recommends you for a job', ex:'My referee wrote a strong letter.', syn:['recommender','reference'], unit:9 },
  { w:'retire', pos:'verb', m:'to stop working after a certain age', ex:'He retired at sixty.', syn:['step down','leave work'], unit:9 },
  { w:'retirement', pos:'noun', m:'the period after leaving work', ex:'She enjoys her retirement.', syn:['pension years'], unit:9 },
  { w:'role', pos:'noun', m:'a person’s function in a job', ex:'Her role is to manage the team.', syn:['position','function'], unit:9 },
  { w:'shift', pos:'noun', m:'a period of work time', ex:'He works the night shift.', syn:['turn','session'], unit:9 },
  { w:'staff', pos:'noun', m:'all the workers in a place', ex:'The staff were very helpful.', syn:['employees','personnel'], unit:9 },
  { w:'stakeholder', pos:'noun', m:'a person with an interest in a business', ex:'Stakeholders met to discuss the plan.', syn:['interested party'], unit:9 },
  { w:'subordinate', pos:'noun', m:'a person of lower rank', ex:'He treats his subordinates fairly.', syn:['junior','assistant'], unit:9 },
  { w:'task', pos:'noun', m:'a piece of work to be done', ex:'Finish this task by noon.', syn:['job','assignment'], unit:9 },
  { w:'trade', pos:'noun', m:'the buying and selling of goods', ex:'Trade between the countries grew.', syn:['commerce','business'], unit:9 },
  { w:'trade union', pos:'noun', m:'an organisation of workers', ex:'The trade union negotiated wages.', syn:['labour union'], unit:9 },
  { w:'unemployed', pos:'adjective', m:'without a job', ex:'He has been unemployed since June.', syn:['jobless','out of work'], unit:9 },
  { w:'vacancy', pos:'noun', m:'an available job position', ex:'There is a vacancy in sales.', syn:['opening','position'], unit:9 },
  { w:'wage', pos:'noun', m:'money paid for work', ex:'Wages are paid weekly.', syn:['pay','salary'], unit:9 },
  { w:'workshop', pos:'noun', m:'a session for learning skills', ex:'She attended a writing workshop.', syn:['seminar','training'], unit:9 },

  /* ---------- Unit 10 extras ---------- */
  { w:'accede', pos:'verb', m:'to agree to a demand', ex:'The ruler was forced to accede.', syn:['agree','consent'], unit:10 },
  { w:'ammunition', pos:'noun', m:'bullets and shells used in fighting', ex:'The fighters ran out of ammunition.', syn:['munitions','shells'], unit:10 },
  { w:'army', pos:'noun', m:'a country’s military force', ex:'The army advanced towards the capital.', syn:['military','forces'], unit:10 },
  { w:'autonomy', pos:'noun', m:'the right to govern oneself', ex:'The province demanded autonomy.', syn:['self-rule','independence'], unit:10 },
  { w:'battalion', pos:'noun', m:'a large unit of soldiers', ex:'A battalion marched through the town.', syn:['regiment','unit'], unit:10 },
  { w:'battle', pos:'noun', m:'a fight between armed forces', ex:'The battle lasted three days.', syn:['clash','combat'], unit:10 },
  { w:'bombing', pos:'noun', m:'an attack using bombs', ex:'The bombing destroyed the bridge.', syn:['shelling','strike'], unit:10 },
  { w:'border', pos:'noun', m:'the line between two countries', ex:'Refugees crossed the border.', syn:['frontier','boundary'], unit:10 },
  { w:'cabinet', pos:'noun', m:'the senior ministers of a government', ex:'The cabinet met to discuss the crisis.', syn:['ministry','council'], unit:10 },
  { w:'camp', pos:'noun', m:'a place where people stay temporarily', ex:'Refugees lived in a camp.', syn:['encampment','settlement'], unit:10 },
  { w:'capital', pos:'noun', m:'the main city of a country', ex:'Dhaka became the capital in 1971.', syn:['seat of government'], unit:10 },
  { w:'cavalry', pos:'noun', m:'soldiers who fight on horseback', ex:'The cavalry charged at dawn.', syn:['mounted troops'], unit:10 },
  { w:'civilian', pos:'noun', m:'a person not in the armed forces', ex:'Civilians suffered greatly in the war.', syn:['non-combatant','citizen'], unit:10 },
  { w:'colonial', pos:'adjective', m:'relating to rule by another country', ex:'Colonial rule ended in 1947.', syn:['imperial','occupying'], unit:10 },
  { w:'commander', pos:'noun', m:'a person in charge of troops', ex:'The commander gave the order.', syn:['leader','chief'], unit:10 },
  { w:'conflict', pos:'noun', m:'a serious disagreement or war', ex:'The conflict lasted nine months.', syn:['war','struggle'], unit:10 },
  { w:'conspiracy', pos:'noun', m:'a secret plan to do harm', ex:'The conspiracy was uncovered.', syn:['plot','scheme'], unit:10 },
  { w:'coup', pos:'noun', m:'a sudden seizure of power', ex:'The coup changed the country’s history.', syn:['takeover','overthrow'], unit:10 },
  { w:'crisis', pos:'noun', m:'a time of great danger', ex:'The political crisis deepened.', syn:['emergency','turning point'], unit:10 },
  { w:'curfew', pos:'noun', m:'a rule requiring people to stay indoors', ex:'A curfew was imposed at night.', syn:['restriction','lockdown'], unit:10 },
  { w:'de facto', pos:'adjective', m:'existing in fact, though not officially', ex:'It became the de facto capital.', syn:['actual','effective'], unit:10 },
  { w:'defence', pos:'noun', m:'protection against attack', ex:'They organised the defence of the city.', syn:['protection','guard'], unit:10 },
  { w:'delegate', pos:'noun', m:'a person representing a group', ex:'Delegates met to discuss the future.', syn:['representative','envoy'], unit:10 },
  { w:'dictatorship', pos:'noun', m:'rule by one person with total power', ex:'The dictatorship suppressed dissent.', syn:['tyranny','autocracy'], unit:10 },
  { w:'diplomat', pos:'noun', m:'an official representing a country abroad', ex:'The diplomat negotiated a ceasefire.', syn:['envoy','ambassador'], unit:10 },
  { w:'displaced', pos:'adjective', m:'forced to leave home', ex:'Millions were displaced by the war.', syn:['uprooted','refugee'], unit:10 },
  { w:'document', pos:'noun', m:'a written record', ex:'The document listed the demands.', syn:['record','paper'], unit:10 },
  { w:'election', pos:'noun', m:'a process of choosing leaders', ex:'The first election was held in 1973.', syn:['vote','poll'], unit:10 },
  { w:'enemy', pos:'noun', m:'a person or country you fight', ex:'The enemy advanced from the east.', syn:['foe','adversary'], unit:10 },
  { w:'execution', pos:'noun', m:'the killing of someone as punishment', ex:'The execution shocked the world.', syn:['killing','capital punishment'], unit:10 },
  { w:'exile', pos:'noun', m:'being forced to live abroad', ex:'He spent years in exile.', syn:['banishment','expulsion'], unit:10 },
  { w:'famine', pos:'noun', m:'a severe shortage of food', ex:'Famine followed the war.', syn:['starvation','hunger'], unit:10 },
  { w:'flag', pos:'noun', m:'a symbol of a country', ex:'The flag was raised at dawn.', syn:['banner','standard'], unit:10 },
  { w:'forces', pos:'noun', m:'armed military groups', ex:'The forces advanced at night.', syn:['troops','army'], unit:10 },
  { w:'front', pos:'noun', m:'the line where armies meet', ex:'He fought on the eastern front.', syn:['battlefront','line'], unit:10 },
  { w:'garrison', pos:'noun', m:'a group of troops stationed in a place', ex:'The garrison surrendered at dawn.', syn:['troops','post'], unit:10 },
  { w:'governor', pos:'noun', m:'an official who rules a region', ex:'The governor declared martial law.', syn:['administrator','ruler'], unit:10 },
  { w:'invade', pos:'verb', m:'to enter a country by force', ex:'Troops invaded from the west.', syn:['attack','occupy'], unit:10 },
  { w:'junta', pos:'noun', m:'a military group ruling a country', ex:'The junta seized power.', syn:['military government'], unit:10 },
  { w:'leader', pos:'noun', m:'a person who guides a group', ex:'The leader addressed the nation.', syn:['chief','head'], unit:10 },
  { w:'martial law', pos:'noun', m:'military control of a country', ex:'Martial law was declared in 1971.', syn:['military rule'], unit:10 },
  { w:'massacre', pos:'noun', m:'the killing of many people', ex:'The massacre is remembered every year.', syn:['slaughter','carnage'], unit:10 },
  { w:'memoir', pos:'noun', m:'a book about one’s own life', ex:'He wrote a memoir of the war.', syn:['autobiography','recollection'], unit:10 },
  { w:'military', pos:'adjective', m:'relating to armed forces', ex:'Military rule lasted for years.', syn:['armed','soldierly'], unit:10 },
  { w:'militant', pos:'noun', m:'a person who uses force for a cause', ex:'Militants attacked the convoy.', syn:['fighter','radical'], unit:10 },
  { w:'minister', pos:'noun', m:'a senior government official', ex:'The minister visited the camp.', syn:['official','secretary'], unit:10 },
  { w:'nationalism', pos:'noun', m:'strong love for one’s country', ex:'Nationalism united the people.', syn:['patriotism','loyalty'], unit:10 },
  { w:'negotiation', pos:'noun', m:'discussion to reach an agreement', ex:'Negotiations lasted for weeks.', syn:['talks','dialogue'], unit:10 },
  { w:'offensive', pos:'noun', m:'a military attack', ex:'The offensive began in November.', syn:['attack','assault'], unit:10 },
  { w:'oppression', pos:'noun', m:'cruel and unjust treatment', ex:'They rose against oppression.', syn:['tyranny','subjugation'], unit:10 },
  { w:'parliament', pos:'noun', m:'the law-making body of a country', ex:'Parliament passed the new law.', syn:['assembly','legislature'], unit:10 },
  { w:'partition', pos:'noun', m:'the division of a country', ex:'Partition in 1947 changed the region.', syn:['division','split'], unit:10 },
  { w:'patriotism', pos:'noun', m:'love and loyalty to one’s country', ex:'Patriotism inspired the freedom fighters.', syn:['nationalism','devotion'], unit:10 },
  { w:'platoon', pos:'noun', m:'a small unit of soldiers', ex:'A platoon guarded the bridge.', syn:['squad','unit'], unit:10 },
  { w:'prisoner', pos:'noun', m:'a person held captive', ex:'Prisoners were released after the war.', syn:['captive','detainee'], unit:10 },
  { w:'protest', pos:'noun', m:'a public expression of objection', ex:'Students led a protest march.', syn:['demonstration','objection'], unit:10 },
  { w:'radio', pos:'noun', m:'a device for receiving broadcasts', ex:'The declaration was broadcast on radio.', syn:['wireless','transmitter'], unit:10 },
  { w:'rally', pos:'noun', m:'a large public meeting', ex:'A rally was held at the university.', syn:['gathering','demonstration'], unit:10 },
  { w:'regime', pos:'noun', m:'a government, often authoritarian', ex:'The regime collapsed in December.', syn:['government','administration'], unit:10 },
  { w:'revolt', pos:'noun', m:'a rebellion against authority', ex:'The revolt spread quickly.', syn:['uprising','rebellion'], unit:10 },
  { w:'revolution', pos:'noun', m:'a complete change of government', ex:'The revolution changed everything.', syn:['uprising','overthrow'], unit:10 },
  { w:'sector', pos:'noun', m:'a part of an area or society', ex:'Each sector had a commander.', syn:['zone','region'], unit:10 },
  { w:'slogan', pos:'noun', m:'a short memorable phrase', ex:'“Joy Bangla” was the rallying slogan.', syn:['catchphrase','motto'], unit:10 },
  { w:'soldier', pos:'noun', m:'a member of an army', ex:'Every soldier fought bravely.', syn:['trooper','fighter'], unit:10 },
  { w:'sovereign', pos:'adjective', m:'having full independent power', ex:'Bangladesh became a sovereign state.', syn:['independent','autonomous'], unit:10 },
  { w:'speech', pos:'noun', m:'a formal talk to an audience', ex:'The speech inspired the nation.', syn:['address','oration'], unit:10 },
  { w:'strategy', pos:'noun', m:'a plan for achieving a goal', ex:'The strategy was to divide the forces.', syn:['plan','tactic'], unit:10 },
  { w:'troops', pos:'noun', m:'soldiers in an army', ex:'Troops withdrew at the end of the war.', syn:['forces','soldiers'], unit:10 },
  { w:'uprising', pos:'noun', m:'a rebellion against authority', ex:'The uprising began in March.', syn:['revolt','rebellion'], unit:10 },
  { w:'victory', pos:'noun', m:'success in a war or contest', ex:'Victory came on 16 December.', syn:['triumph','win'], unit:10 },
  { w:'warrior', pos:'noun', m:'a brave fighter', ex:'The warrior fought to the end.', syn:['fighter','soldier'], unit:10 },
  { w:'wounded', pos:'adjective', m:'injured in battle', ex:'Wounded soldiers were taken to hospital.', syn:['injured','hurt'], unit:10 },
  { w:'zone', pos:'noun', m:'an area with a special purpose', ex:'Each zone had its own commander.', syn:['region','sector'], unit:10 },
];

/* ---------- Combined dictionary (1,100+ words) ---------- */
const DICTIONARY = [...CORE_DICTIONARY, ...EXTRA_DICTIONARY];

/* ---------- Daily flashcard limit ---------- */
const DAILY_LIMIT = 30;
const DAILY_KEY = 'ec-voc-daily-v2';

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/* Deterministic shuffle so the same day always yields the same 30 words */
function seededShuffle(arr, seed) {
  let s = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    s ^= seed.charCodeAt(i);
    s = Math.imul(s, 16777619);
  }
  const rand = () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

/* ---------- Fallback if API returns nothing ---------- */
const FALLBACK_WORD_OF_DAY = {
  word: 'resilience',
  meaning: 'the ability to recover quickly from difficulties',
  example: 'The resilience of the Bangladeshi people is remarkable.',
};

/* ---------- Reward tiers based on XP ---------- */
const REWARDS = [
  { id: 'r1', icon: '🌱', title: 'Seedling', xp: 50, desc: 'Learn your first 5 words' },
  { id: 'r2', icon: '🌿', title: 'Sprout', xp: 150, desc: 'Master 25 words' },
  { id: 'r3', icon: '🌳', title: 'Tree', xp: 400, desc: 'Master 75 words' },
  { id: 'r4', icon: '🏆', title: 'Champion', xp: 1000, desc: 'Master 200 words' },
  { id: 'r5', icon: '💎', title: 'Legend', xp: 2500, desc: 'Master 500 words' },
];

const MODES = [
  { id: 'Flashcards', label: 'Flashcards', icon: 'book' },
  { id: 'Quiz',       label: 'Quiz',       icon: 'target' },
  { id: 'Blitz',      label: 'Blitz',      icon: 'zap' },
  { id: 'Dictionary', label: 'Dictionary', icon: 'grid' },
  { id: 'Progress',   label: 'Progress',   icon: 'trophy' },
];

const POS_FILTERS = ['All', 'noun', 'verb', 'adjective'];

/* Build a quiz question from a word */
function buildQuestion(word) {
  const pool = DICTIONARY.filter((x) => x.w !== word.w && x.m !== word.m);
  const wrong = [];
  while (wrong.length < 3 && pool.length) {
    const idx = Math.floor(Math.random() * pool.length);
    const cand = pool.splice(idx, 1)[0];
    if (!wrong.some((o) => o.m === cand.m)) wrong.push(cand);
  }
  const options = [word.m, ...wrong.map((o) => o.m)].sort(() => Math.random() - 0.5);
  return {
    prompt: `What does “${word.w}” mean?`,
    options,
    answer: word.m,
    word,
  };
}

/* ============================================================
   Mascot — Langut-style yellow blob
   ============================================================ */
function LangutMascot({ size = 170 }) {
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
      <path
        d="M85 40c-20 0-36 14-36 34 0 13 6 22 12 29"
        stroke="#FBF0A0" strokeWidth="7" strokeLinecap="round" fill="none"
      />
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

export function Vocabulary() {
  const [mode, setMode] = useState('Flashcards');
  const [wordOfDay, setWordOfDay] = useState(null);

  /* ---------- Daily flashcard session (30 words / day) ---------- */
  const [daily, setDaily] = useState(() => {
    const today = getTodayKey();
    try {
      const raw = localStorage.getItem(DAILY_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.date === today) {
          return {
            date: today,
            index: typeof parsed.index === 'number' ? parsed.index : 0,
            viewed: Array.isArray(parsed.viewed) ? parsed.viewed : [],
          };
        }
      }
    } catch (e) { /* ignore */ }
    return { date: today, index: 0, viewed: [] };
  });
  const [sessionDone, setSessionDone] = useState(false);

  /* Flashcards */
  const [flipped, setFlipped] = useState(false);
  const [mastery, setMastery] = useState({});
  const [unit, setUnit] = useState('all');

  /* Quiz */
  const [quiz, setQuiz] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);

  /* Blitz */
  const [blitz, setBlitz] = useState(null);
  const [blitzTime, setBlitzTime] = useState(30);
  const [blitzScore, setBlitzScore] = useState(0);
  const [blitzRunning, setBlitzRunning] = useState(false);

  /* Dictionary */
  const [search, setSearch] = useState('');
  const [posFilter, setPosFilter] = useState('All');
  const [unitFilter, setUnitFilter] = useState('all');
  const [savedWords, setSavedWords] = useState(() => new Set());

  /* Rewards */
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(1);
  const [toast, setToast] = useState(null);

  const showToast = (text) => {
    setToast(text);
    setTimeout(() => setToast(null), 1000);
  };

  const awardXp = (amount) => {
    setXp((prev) => {
      const next = prev + amount;
      const reached = REWARDS.find((r) => next >= r.xp && prev < r.xp);
      if (reached) showToast(`🏆 ${reached.title} unlocked!`);
      else showToast(`+${amount} XP`);
      return next;
    });
  };

  /* Persist the daily session */
  useEffect(() => {
    try { localStorage.setItem(DAILY_KEY, JSON.stringify(daily)); } catch (e) { /* ignore */ }
  }, [daily]);

  /* Word of the day — API then fallback */
  useEffect(() => {
    vocabApi.wordOfDay()
      .then((d) => setWordOfDay(d || FALLBACK_WORD_OF_DAY))
      .catch(() => setWordOfDay(FALLBACK_WORD_OF_DAY));
  }, []);

  /* ---------- Build today’s 30-word deck ---------- */
  const dailyDeck = useMemo(() => {
    const unitNum = unit === 'all' ? null : Number(String(unit).replace('Unit ', ''));
    const pool = unitNum ? DICTIONARY.filter((w) => w.unit === unitNum) : DICTIONARY;
    const src = pool.length >= DAILY_LIMIT ? pool : DICTIONARY;
    const shuffled = seededShuffle(src, `${daily.date}::${unit}`);
    return shuffled.slice(0, DAILY_LIMIT).map((w) => ({
      id: `${w.w}-${w.unit}`,
      word: w.w,
      meaning: w.m,
      example: w.ex,
      syn: w.syn,
      pos: w.pos,
      unit: w.unit,
    }));
  }, [daily.date, unit]);

  const safeIndex = Math.min(daily.index, Math.max(0, dailyDeck.length - 1));
  const card = dailyDeck[safeIndex];
  const dailyCount = daily.viewed.length;
  const dailyPct = Math.min(100, Math.round((dailyCount / DAILY_LIMIT) * 100));

  /* Mark the current card as viewed today */
  useEffect(() => {
    if (mode !== 'Flashcards' || !card) return;
    setDaily((prev) => (
      prev.viewed.includes(card.id) ? prev : { ...prev, viewed: [...prev.viewed, card.id] }
    ));
  }, [mode, card]);

  /* Reset position when the unit changes */
  useEffect(() => {
    setFlipped(false);
    setSessionDone(false);
    setDaily((prev) => ({ ...prev, index: 0 }));
  }, [unit]);

  /* Load quiz */
  useEffect(() => {
    if (mode !== 'Quiz') return;
    vocabApi.quiz(10, unit === 'all' ? undefined : unit)
      .then((q) => { setQuiz(q); setQIndex(0); setSelected(null); })
      .catch(() => {
        const unitNum = unit === 'all' ? null : Number(String(unit).replace('Unit ', ''));
        const pool = unitNum ? DICTIONARY.filter((w) => w.unit === unitNum) : DICTIONARY;
        const questions = [...pool].sort(() => Math.random() - 0.5).slice(0, 10).map(buildQuestion);
        setQuiz({ questions });
        setQIndex(0);
        setSelected(null);
      });
  }, [mode, unit]);

  /* Load blitz */
  useEffect(() => {
    if (mode !== 'Blitz') return;
    vocabApi.blitz()
      .then((b) => { setBlitz(b); setQIndex(0); setSelected(null); setBlitzTime(30); setBlitzScore(0); setBlitzRunning(false); })
      .catch(() => {
        const questions = [...DICTIONARY].sort(() => Math.random() - 0.5).slice(0, 20).map(buildQuestion);
        setBlitz({ questions });
        setQIndex(0);
        setSelected(null);
        setBlitzTime(30);
        setBlitzScore(0);
        setBlitzRunning(false);
      });
  }, [mode]);

  /* Blitz timer */
  useEffect(() => {
    if (!blitzRunning || mode !== 'Blitz') return;
    if (blitzTime <= 0) { setBlitzRunning(false); return; }
    const t = setTimeout(() => setBlitzTime((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [blitzRunning, blitzTime, mode]);

  /* ---------- Flashcards ---------- */
  const goNext = () => {
    const wasFlipped = flipped;
    setFlipped(false);
    if (card && wasFlipped) {
      setMastery((m) => ({ ...m, [card.word]: Math.min(3, (m[card.word] ?? 0) + 1) }));
      awardXp(5);
    }
    if (daily.index >= dailyDeck.length - 1) {
      setSessionDone(true);
    } else {
      setDaily((p) => ({ ...p, index: p.index + 1 }));
    }
  };

  const goPrev = () => {
    setFlipped(false);
    setSessionDone(false);
    if (daily.index > 0) setDaily((p) => ({ ...p, index: p.index - 1 }));
  };

  const restartSession = () => {
    setFlipped(false);
    setSessionDone(false);
    setDaily((p) => ({ ...p, index: 0 }));
  };

  /* ---------- Quiz ---------- */
  const quizQuestion = quiz?.questions?.[qIndex];
  const pickAnswer = (opt) => {
    if (selected) return;
    setSelected(opt);
    const correct = quizQuestion && (quizQuestion.answer === opt || quizQuestion.a === opt);
    if (correct) awardXp(10);
    setTimeout(() => {
      setSelected(null);
      setQIndex((i) => (quiz?.questions && i + 1 < quiz.questions.length ? i + 1 : 0));
    }, 850);
  };

  /* ---------- Blitz ---------- */
  const blitzQuestion = blitz?.questions?.[qIndex];
  const pickBlitz = (opt) => {
    if (selected || !blitzRunning) return;
    setSelected(opt);
    const correct = blitzQuestion && (blitzQuestion.answer === opt || blitzQuestion.a === opt);
    if (correct) {
      setBlitzScore((s) => s + 1);
      awardXp(15);
    }
    setTimeout(() => {
      setSelected(null);
      setQIndex((i) => (blitz?.questions && i + 1 < blitz.questions.length ? i + 1 : 0));
    }, 450);
  };

  const startBlitz = () => {
    setBlitzTime(30);
    setBlitzScore(0);
    setQIndex(0);
    setSelected(null);
    setBlitzRunning(true);
  };

  /* ---------- Dictionary ---------- */
  const filteredDict = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = DICTIONARY.filter((w) => {
      if (posFilter !== 'All' && w.pos !== posFilter) return false;
      if (unitFilter !== 'all' && w.unit !== Number(unitFilter)) return false;
      if (!q) return true;
      return (
        w.w.toLowerCase().includes(q) ||
        w.m.toLowerCase().includes(q) ||
        w.ex.toLowerCase().includes(q) ||
        (w.syn || []).some((s) => s.toLowerCase().includes(q))
      );
    });
    return [...list].sort((a, b) => a.unit - b.unit || a.w.localeCompare(b.w));
  }, [search, posFilter, unitFilter]);

  const toggleSave = (word) => {
    setSavedWords((prev) => {
      const next = new Set(prev);
      if (next.has(word)) next.delete(word);
      else next.add(word);
      return next;
    });
  };

  /* ---------- Dictionary Quick Check exercise ---------- */
  const [dictQ, setDictQ] = useState(null);
  const [dictSelected, setDictSelected] = useState(null);
  const [dictScore, setDictScore] = useState({ correct: 0, total: 0 });

  const nextDictQuestion = useCallback(() => {
    const pool = filteredDict.length >= 4 ? filteredDict : DICTIONARY;
    const word = pool[Math.floor(Math.random() * pool.length)];
    setDictQ(buildQuestion(word));
    setDictSelected(null);
  }, [filteredDict]);

  useEffect(() => {
    if (mode === 'Dictionary' && !dictQ) nextDictQuestion();
  }, [mode, dictQ, nextDictQuestion]);

  const answerDict = (opt) => {
    if (dictSelected || !dictQ) return;
    setDictSelected(opt);
    const correct = opt === dictQ.answer;
    setDictScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
    if (correct) awardXp(5);
    setTimeout(nextDictQuestion, 900);
  };

  /* ---------- Progress Review Quiz exercise ---------- */
  const [reviewQ, setReviewQ] = useState(null);
  const [reviewSelected, setReviewSelected] = useState(null);
  const [reviewScore, setReviewScore] = useState({ correct: 0, total: 0 });

  const nextReviewQuestion = useCallback(() => {
    const savedList = DICTIONARY.filter((w) => savedWords.has(w.w));
    const pool = savedList.length >= 4 ? savedList : DICTIONARY;
    const word = pool[Math.floor(Math.random() * pool.length)];
    setReviewQ(buildQuestion(word));
    setReviewSelected(null);
  }, [savedWords]);

  useEffect(() => {
    if (mode === 'Progress' && !reviewQ) nextReviewQuestion();
  }, [mode, reviewQ, nextReviewQuestion]);

  const answerReview = (opt) => {
    if (reviewSelected || !reviewQ) return;
    setReviewSelected(opt);
    const correct = opt === reviewQ.answer;
    setReviewScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
    if (correct) awardXp(5);
    setTimeout(nextReviewQuestion, 900);
  };

  /* ---------- Progress ---------- */
  const masteryCount = Object.values(mastery).filter((v) => v >= 3).length;
  const currentReward = REWARDS.find((r) => xp < r.xp) || REWARDS[REWARDS.length - 1];
  const prevRewardXp = REWARDS.filter((r) => r.xp <= xp).slice(-1)[0]?.xp ?? 0;
  const rewardProgress = currentReward.xp > prevRewardXp
    ? Math.min(100, Math.round(((xp - prevRewardXp) / (currentReward.xp - prevRewardXp)) * 100))
    : 100;

  return (
    <div className="ec-voc">
      <style>{VOCAB_CSS}</style>

      {/* Heading */}
      <div className="ec-voc-head ec-voc-anim">
        <div>
          <p className="ec-voc-eyebrow">Vocabulary</p>
          <h1 className="ec-page-title">Build your English word bank</h1>
          <p className="ec-page-sub">
            Spaced repetition, quizzes, a blitz round, and a searchable dictionary of {DICTIONARY.length}+ words.
            Learn 30 new words every day.
          </p>
        </div>
      </div>

      {/* Hero */}
      <div className="ec-voc-hero ec-voc-anim">
        <div className="ec-voc-hero-orb" aria-hidden="true" />
        <div className="ec-voc-hero-orb ec-voc-hero-orb--pink" aria-hidden="true" />
        <div className="ec-voc-hero-copy">
          <span className="ec-voc-hero-badge">English For Today · NCTB aligned</span>
          <h1>We help you <em>love</em> learning</h1>
          <p>
            Practice with spaced repetition, test yourself with quizzes, and browse the full dictionary —
            with a fresh set of {DAILY_LIMIT} words every single day.
          </p>
          <div className="ec-voc-hero-stats">
            <div className="ec-voc-hero-stat"><strong>{DICTIONARY.length}</strong><span>Words</span></div>
            <div className="ec-voc-hero-stat"><strong>{dailyCount}/{DAILY_LIMIT}</strong><span>Today</span></div>
            <div className="ec-voc-hero-stat"><strong>{xp}</strong><span>XP earned</span></div>
            <div className="ec-voc-hero-stat"><strong>{streak}</strong><span>Day streak</span></div>
          </div>
        </div>
        <div className="ec-voc-hero-mascot">
          <LangutMascot size={180} />
        </div>
      </div>

      {/* Tabs */}
      <div className="ec-voc-tabs" role="tablist">
        {MODES.map((m) => (
          <button
            key={m.id}
            role="tab"
            aria-selected={mode === m.id}
            className={`ec-voc-tab${mode === m.id ? ' ec-voc-tab--active' : ''}`}
            onClick={() => setMode(m.id)}
          >
            <Icon name={m.icon} />
            {m.label}
          </button>
        ))}
      </div>

      {toast && <div className="ec-voc-toast">{toast}</div>}

      <div className="ec-voc-grid">
        <section>
          {/* ---------- FLASHCARDS ---------- */}
          {mode === 'Flashcards' && (
            sessionDone ? (
              <div className="ec-quiz-card ec-voc-anim" key="flash-done">
                <div className="ec-quiz-top">
                  <span className="ec-quiz-badge">Daily goal reached</span>
                  <span className="ec-quiz-counter">{dailyCount} / {DAILY_LIMIT} words today</span>
                </div>
                <h2 style={{ margin: '4px 0 10px', fontSize: 24, fontWeight: 900, color: 'var(--lang-ink)', letterSpacing: '-.025em' }}>
                  🎉 You finished today’s {DAILY_LIMIT} words!
                </h2>
                <p style={{ fontSize: 14, color: 'var(--lang-ink-soft)', lineHeight: 1.6, margin: '0 0 20px', fontWeight: 600 }}>
                  Come back tomorrow for a brand-new set of {DAILY_LIMIT} words. Your streak keeps growing —
                  you’ve now seen <strong>{dailyCount}</strong> words today.
                </p>
                <div className="ec-grade-row">
                  <button className="ec-grade-btn ec-grade-btn--prev" onClick={restartSession}>
                    ↻ Review today’s set
                  </button>
                  <button className="ec-grade-btn ec-grade-btn--next" onClick={() => setMode('Quiz')}>
                    Take the quiz →
                  </button>
                </div>
              </div>
            ) : card ? (
              <div className="ec-voc-anim" key="flash">
                <div className="ec-flash-daily">
                  <span className="ec-flash-daily-text">
                    Daily goal · <strong>{dailyCount}</strong> / {DAILY_LIMIT} words
                  </span>
                  <span className="ec-flash-counter-label">
                    Card <strong>{safeIndex + 1}</strong> of {dailyDeck.length}
                  </span>
                </div>
                <div className="ec-flash-daily-track" aria-hidden="true">
                  <div
                    className={`ec-flash-daily-fill${dailyCount >= DAILY_LIMIT ? ' ec-flash-daily-fill--done' : ''}`}
                    style={{ width: `${dailyPct}%` }}
                  />
                </div>

                <div className="ec-flash-counter">
                  <span className="ec-flash-counter-label">
                    {card.pos ? card.pos : 'word'} · unit {card.unit}
                  </span>
                  <span className="ec-flash-mastery" title={`Mastery: ${mastery[card.word] ?? 0}/3`}>
                    {[0, 1, 2, 3].map((n) => (
                      <span
                        key={n}
                        className={`ec-flash-mastery-dot${(mastery[card.word] ?? 0) > n ? ' ec-flash-mastery-dot--on' : ''}`}
                      />
                    ))}
                  </span>
                </div>

                <div className="ec-flash-wrap">
                  <div className="ec-flash" data-flipped={flipped} onClick={() => setFlipped((f) => !f)}>
                    <div className="ec-flash-face ec-flash-front">
                      <span className="ec-flash-pos">Tap to reveal</span>
                      <p className="ec-flash-word">{card.word}</p>
                      <span className="ec-flash-hint">Tap card to flip</span>
                    </div>
                    <div className="ec-flash-face ec-flash-back">
                      <span className="ec-flash-pos">Meaning</span>
                      <p className="ec-flash-word">{card.meaning}</p>
                      {card.example && <p className="ec-flash-sub">“{card.example}”</p>}
                      {card.syn && (
                        <div className="ec-flash-syn">
                          {card.syn.slice(0, 3).map((s) => <span key={s}>{s}</span>)}
                        </div>
                      )}
                      <span className="ec-flash-hint">Tap to flip back</span>
                    </div>
                  </div>
                </div>

                <div className="ec-grade-row">
                  <button className="ec-grade-btn ec-grade-btn--prev" onClick={goPrev}>
                    <span aria-hidden="true">←</span> Previous
                  </button>
                  <button className="ec-grade-btn ec-grade-btn--next" onClick={goNext}>
                    {safeIndex >= dailyDeck.length - 1 ? 'Finish' : 'Next'} <span aria-hidden="true">→</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="ec-dict-empty">No cards available — try the Dictionary tab.</div>
            )
          )}

          {/* ---------- QUIZ ---------- */}
          {mode === 'Quiz' && (
            quizQuestion ? (
              <div className="ec-quiz-card ec-voc-anim" key="quiz">
                <div className="ec-quiz-top">
                  <span className="ec-quiz-badge">Quiz</span>
                  <span className="ec-quiz-counter">Question {qIndex + 1} / {quiz.questions.length}</span>
                </div>
                <div className="ec-quiz-progress">
                  <div className="ec-quiz-progress-fill" style={{ width: `${((qIndex + 1) / quiz.questions.length) * 100}%` }} />
                </div>
                <p className="ec-quiz-question">{quizQuestion.prompt || `What does “${quizQuestion.word?.w}” mean?`}</p>
                <div className="ec-quiz-options">
                  {(quizQuestion.options || []).map((opt, oi) => {
                    const isSelected = selected === opt;
                    const correctOpt = quizQuestion.answer ?? quizQuestion.a;
                    const isCorrect = opt === correctOpt;
                    return (
                      <button
                        key={`${opt}-${oi}`}
                        className={`ec-quiz-option${isSelected ? (isCorrect ? ' ec-quiz-option--correct ec-voc-pop' : ' ec-quiz-option--incorrect ec-voc-shake') : ''}`}
                        onClick={() => pickAnswer(opt)}
                        disabled={!!selected && !isSelected && !isCorrect}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                <div className="ec-quiz-foot">
                  <span>Correct answers earn <strong>+10 XP</strong></span>
                  <span>{xp} XP total</span>
                </div>
              </div>
            ) : (
              <div className="ec-dict-empty">Loading questions…</div>
            )
          )}

          {/* ---------- BLITZ ---------- */}
          {mode === 'Blitz' && (
            !blitzRunning ? (
              <div className="ec-quiz-card ec-voc-anim" key="blitz-start">
                <div className="ec-quiz-top">
                  <span className="ec-quiz-badge ec-quiz-badge--blitz">⚡ Blitz</span>
                  <span className="ec-quiz-counter">30-second speed round</span>
                </div>
                <h2 style={{ margin: '6px 0 10px', fontSize: 22, fontWeight: 900, color: 'var(--lang-ink)', letterSpacing: '-.02em' }}>
                  Ready to go fast?
                </h2>
                <p style={{ fontSize: 13.5, color: 'var(--lang-ink-soft)', lineHeight: 1.6, margin: '0 0 20px', fontWeight: 600 }}>
                  Answer as many word meanings as you can in 30 seconds. Each correct answer earns <strong>+15 XP</strong>.
                </p>
                <button className="ec-grade-btn ec-grade-btn--good" style={{ padding: '14px 26px', width: 'auto' }} onClick={startBlitz}>
                  Start Blitz →
                </button>
              </div>
            ) : (
              blitzQuestion ? (
                <div className="ec-quiz-card ec-voc-anim" key="blitz">
                  <div className="ec-quiz-top">
                    <span className="ec-quiz-badge ec-quiz-badge--blitz">⚡ Blitz · {blitzTime}s left</span>
                    <span className="ec-quiz-counter">Score: {blitzScore}</span>
                  </div>
                  <div className="ec-quiz-progress">
                    <div
                      className="ec-quiz-progress-fill"
                      style={{ width: `${(blitzTime / 30) * 100}%`, background: 'linear-gradient(90deg,#FF8FCB,#D4F55C)' }}
                    />
                  </div>
                  <p className="ec-quiz-question">{blitzQuestion.prompt || `What does “${blitzQuestion.word?.w}” mean?`}</p>
                  <div className="ec-quiz-options">
                    {(blitzQuestion.options || []).map((opt, oi) => {
                      const isSelected = selected === opt;
                      const correctOpt = blitzQuestion.answer ?? blitzQuestion.a;
                      const isCorrect = opt === correctOpt;
                      return (
                        <button
                          key={`${opt}-${oi}`}
                          className={`ec-quiz-option${isSelected ? (isCorrect ? ' ec-quiz-option--correct ec-voc-pop' : ' ec-quiz-option--incorrect ec-voc-shake') : ''}`}
                          onClick={() => pickBlitz(opt)}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="ec-dict-empty">Loading…</div>
              )
            )
          )}

          {/* ---------- DICTIONARY ---------- */}
          {mode === 'Dictionary' && (
            <div className="ec-voc-anim" key="dict">
              {dictQ && (
                <div className={`ec-quiz-card${dictSelected ? (dictSelected === dictQ.answer ? ' ec-pop' : ' ec-shake') : ''}`} style={{ marginBottom: 18 }}>
                  <div className="ec-quiz-top">
                    <span className="ec-quiz-badge">Quick check</span>
                    <span className="ec-quiz-counter">{dictScore.correct} / {dictScore.total} correct</span>
                  </div>
                  <p className="ec-quiz-question">{dictQ.prompt}</p>
                  <div className="ec-quiz-options">
                    {dictQ.options.map((opt, oi) => {
                      const isSelected = dictSelected === opt;
                      const isCorrect = opt === dictQ.answer;
                      const cls = `ec-quiz-option${isSelected ? (isCorrect ? ' ec-quiz-option--correct' : ' ec-quiz-option--incorrect') : ''}`;
                      return (
                        <button key={`${opt}-${oi}`} className={cls} onClick={() => answerDict(opt)} disabled={!!dictSelected && !isSelected && !isCorrect}>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="ec-dict-bar">
                <div className="ec-dict-search">
                  <Icon name="search" />
                  <input
                    type="text"
                    placeholder="Search a word, meaning, example or synonym…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {search && (
                    <button className="ec-dict-clear" onClick={() => setSearch('')} aria-label="Clear">✕</button>
                  )}
                </div>
              </div>

              <div className="ec-dict-filters">
                {POS_FILTERS.map((p) => (
                  <button
                    key={p}
                    className={`ec-dict-filter${posFilter === p ? ' ec-dict-filter--active' : ''}`}
                    onClick={() => setPosFilter(p)}
                  >
                    {p === 'All' ? 'All types' : p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
                <button
                  className={`ec-dict-filter${unitFilter === 'all' ? ' ec-dict-filter--active' : ''}`}
                  onClick={() => setUnitFilter('all')}
                >
                  All units
                </button>
                {Array.from({ length: 10 }, (_, i) => i + 1).map((u) => (
                  <button
                    key={u}
                    className={`ec-dict-filter${unitFilter === String(u) ? ' ec-dict-filter--active' : ''}`}
                    onClick={() => setUnitFilter(String(u))}
                  >
                    Unit {u}
                  </button>
                ))}
              </div>

              <div className="ec-dict-list">
                {filteredDict.length === 0 ? (
                  <div className="ec-dict-empty">No words match your filters.</div>
                ) : (
                  filteredDict.slice(0, 250).map((w) => (
                    <div key={`${w.w}-${w.unit}`} className="ec-dict-item">
                      <div className="ec-dict-item-head">
                        <h4 className="ec-dict-word">{w.w}</h4>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <span className="ec-dict-pos">{w.pos}</span>
                          <button
                            className={`ec-dict-star${savedWords.has(w.w) ? ' ec-dict-star--on' : ''}`}
                            onClick={() => toggleSave(w.w)}
                            aria-label="Save word"
                          >
                            {savedWords.has(w.w) ? '★' : '☆'}
                          </button>
                        </div>
                      </div>
                      <p className="ec-dict-meaning">{w.m}</p>
                      <p className="ec-dict-example">“{w.ex}”</p>
                      <div className="ec-dict-meta">
                        <span className="ec-dict-unit">Unit {w.unit}</span>
                        {(w.syn || []).map((s) => (
                          <span key={s} className="ec-dict-syn">{s}</span>
                        ))}
                      </div>
                    </div>
                  ))
                )}
                {filteredDict.length > 250 && (
                  <div className="ec-dict-empty">
                    Showing the first 250 of {filteredDict.length} matching words — refine your search to see more.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ---------- PROGRESS ---------- */}
          {mode === 'Progress' && (
            <div className="ec-voc-anim" key="progress">
              <div className="ec-quiz-card" style={{ marginBottom: 18 }}>
                <div className="ec-quiz-top">
                  <span className="ec-quiz-badge">Your learning</span>
                  <span className="ec-quiz-counter">{masteryCount} words mastered</span>
                </div>
                <div className="ec-voc-xp-bar">
                  <span>{currentReward.title}</span>
                  <span>{xp} / {currentReward.xp} XP</span>
                </div>
                <div className="ec-voc-xp-track">
                  <div className="ec-voc-xp-fill" style={{ width: `${rewardProgress}%` }} />
                </div>
                <p className="ec-voc-xp-hint">
                  {rewardProgress >= 100
                    ? 'Reward unlocked! Keep going 🎉'
                    : `${currentReward.xp - xp} XP to unlock ${currentReward.title}`}
                </p>
              </div>

              <div className="ec-quiz-card" style={{ marginBottom: 18 }}>
                <div className="ec-quiz-top">
                  <span className="ec-quiz-badge">Today’s goal</span>
                  <span className="ec-quiz-counter">{dailyCount} / {DAILY_LIMIT} words</span>
                </div>
                <div className="ec-flash-daily-track">
                  <div
                    className={`ec-flash-daily-fill${dailyCount >= DAILY_LIMIT ? ' ec-flash-daily-fill--done' : ''}`}
                    style={{ width: `${dailyPct}%` }}
                  />
                </div>
                <p className="ec-voc-xp-hint">
                  {dailyCount >= DAILY_LIMIT
                    ? 'Daily limit reached — come back tomorrow for a fresh set of 30 words!'
                    : `${DAILY_LIMIT - dailyCount} more words to hit today’s limit of ${DAILY_LIMIT}.`}
                </p>
              </div>

              {reviewQ && (
                <div className={`ec-quiz-card${reviewSelected ? (reviewSelected === reviewQ.answer ? ' ec-pop' : ' ec-shake') : ''}`} style={{ marginBottom: 18 }}>
                  <div className="ec-quiz-top">
                    <span className="ec-quiz-badge">Review quiz{savedWords.size >= 4 ? ' · saved words' : ''}</span>
                    <span className="ec-quiz-counter">{reviewScore.correct} / {reviewScore.total} correct</span>
                  </div>
                  <p className="ec-quiz-question">{reviewQ.prompt}</p>
                  <div className="ec-quiz-options">
                    {reviewQ.options.map((opt, oi) => {
                      const isSelected = reviewSelected === opt;
                      const isCorrect = opt === reviewQ.answer;
                      const cls = `ec-quiz-option${isSelected ? (isCorrect ? ' ec-quiz-option--correct' : ' ec-quiz-option--incorrect') : ''}`;
                      return (
                        <button key={`${opt}-${oi}`} className={cls} onClick={() => answerReview(opt)} disabled={!!reviewSelected && !isSelected && !isCorrect}>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="ec-quiz-card">
                <h3 style={{ marginTop: 0, fontSize: 15, fontWeight: 900, letterSpacing: '-.01em' }}>Reward milestones</h3>
                <div className="ec-voc-reward-list">
                  {REWARDS.map((r) => {
                    const unlocked = xp >= r.xp;
                    return (
                      <div
                        key={r.id}
                        className="ec-voc-reward"
                        style={!unlocked ? { opacity: 0.5, filter: 'grayscale(.55)' } : undefined}
                      >
                        <span className="ec-voc-reward-icon">{r.icon}</span>
                        <div className="ec-voc-reward-body">
                          <p>{r.title}</p>
                          <span>{r.desc}</span>
                        </div>
                        <span className="ec-voc-reward-xp">{r.xp} XP</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ---------- SIDEBAR ---------- */}
        <aside>
          {/* Daily goal */}
          <div className="ec-voc-card ec-voc-anim">
            <h3>Today’s goal <span>{dailyCount}/{DAILY_LIMIT}</span></h3>
            <div className="ec-voc-xp-bar">
              <span>Daily word limit</span>
              <span>{dailyPct}%</span>
            </div>
            <div className="ec-voc-xp-track">
              <div
                className="ec-voc-xp-fill"
                style={{
                  width: `${dailyPct}%`,
                  background: dailyCount >= DAILY_LIMIT
                    ? 'linear-gradient(90deg,#FF8FCB,#D4F55C)'
                    : 'linear-gradient(90deg,#D4F55C,#B8E62E)',
                }}
              />
            </div>
            <p className="ec-voc-xp-hint">
              {dailyCount >= DAILY_LIMIT
                ? 'Daily limit reached 🎉 A new set of 30 arrives tomorrow.'
                : `${DAILY_LIMIT - dailyCount} words left in today’s set of ${DAILY_LIMIT}.`}
            </p>
          </div>

          {/* Word of the day */}
          <div className="ec-voc-card ec-voc-anim">
            <h3>Word of the day <span>Today</span></h3>
            {wordOfDay ? (
              <>
                <p className="ec-voc-wod-word">{wordOfDay.word}</p>
                <p className="ec-voc-wod-meaning">{wordOfDay.meaning}</p>
                {wordOfDay.example && <p className="ec-voc-wod-ex">“{wordOfDay.example}”</p>}
              </>
            ) : (
              <p className="ec-voc-wod-meaning">Loading…</p>
            )}
          </div>

          {/* Units */}
          <div className="ec-voc-card ec-voc-anim">
            <h3>Units <span>10 total</span></h3>
            <div className="ec-voc-units">
              <button
                className={`ec-voc-unit-btn${unit === 'all' ? ' ec-voc-unit-btn--active' : ''}`}
                onClick={() => setUnit('all')}
              >
                All units
                <span className="ec-voc-unit-count">{DICTIONARY.length}</span>
              </button>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((u) => {
                const count = DICTIONARY.filter((w) => w.unit === u).length;
                return (
                  <button
                    key={u}
                    className={`ec-voc-unit-btn${unit === `Unit ${u}` ? ' ec-voc-unit-btn--active' : ''}`}
                    onClick={() => {
                      setUnit(unit === `Unit ${u}` ? 'all' : `Unit ${u}`);
                    }}
                  >
                    Unit {u}
                    <span className="ec-voc-unit-count">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* XP / Streak */}
          <div className="ec-voc-card ec-voc-anim">
            <h3>Today’s rewards <span>{xp} XP</span></h3>
            <div className="ec-voc-xp-bar">
              <span>Day streak</span>
              <span>{streak} 🔥</span>
            </div>
            <div className="ec-voc-xp-track">
              <div className="ec-voc-xp-fill" style={{ width: `${Math.min(100, xp / 5)}%` }} />
            </div>
            <p className="ec-voc-xp-hint">+5 XP per flashcard · +10 per quiz · +15 per blitz</p>
          </div>

          {/* Saved */}
          {savedWords.size > 0 && (
            <div className="ec-voc-card ec-voc-anim">
              <h3>Saved words <span>{savedWords.size}</span></h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {[...savedWords].slice(0, 12).map((w) => (
                  <span key={w} className="ec-dict-syn">{w}</span>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default Vocabulary;
