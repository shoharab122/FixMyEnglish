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

  /* Prevent any child from pushing past the viewport */
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
  gap:12px;margin-bottom:16px;flex-wrap:wrap;
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
}
.ec-grade-btn:hover{transform:translateY(-2px);box-shadow:0 6px 0 var(--lang-line)}
.ec-grade-btn:active{transform:translateY(2px);box-shadow:0 1px 0 var(--lang-line)}
.ec-grade-btn--prev{background:#fff}
.ec-grade-btn--next{background:var(--lang-lime)}
.ec-grade-btn--prev svg,.ec-grade-btn--next svg{width:16px;height:16px;vertical-align:-3px;margin:0 2px}

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
  /* leave room for the app's bottom nav bar */
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

  /* 2x2 stat grid for mobile */
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

  /* Tabs: sticky — no negative margins (prevents overflow) */
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

  /* Flashcards */
  .ec-flash-wrap{min-height:260px;margin-bottom:16px}
  .ec-flash{height:260px}
  .ec-flash-face{padding:22px 18px;border-radius:24px;gap:12px}
  .ec-flash-word{font-size:clamp(26px,8vw,34px)}
  .ec-flash-back .ec-flash-word{font-size:20px}
  .ec-flash-sub{font-size:12.5px;line-height:1.5}
  .ec-flash-back .ec-flash-sub{font-size:13px}
  .ec-flash-pos{font-size:10px;padding:6px 12px}
  .ec-flash-hint{font-size:10px;bottom:14px}

  /* Grade buttons: 2 columns, compact */
  .ec-grade-row{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
  .ec-grade-btn{
    min-height:52px;
    font-size:13px;
    padding:12px 8px;
    border-radius:16px;
  }

  /* Quiz / cards */
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

  /* Dictionary */
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

  /* Sidebar cards */
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

  /* Toast */
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

/* Landscape phones */
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
   FULL DICTIONARY — 500+ words across 10 units
   ============================================================ */
const DICTIONARY = [
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
  { w:'benchwarmer', pos:'noun', m:'a player who rarely plays in a game', ex:'He was a benchwarmer for most of the season.', syn:['reserve','substitute'], unit:7 },
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

/* Build quiz question from a word */
function buildQuestion(word) {
  const others = DICTIONARY.filter((x) => x.w !== word.w).slice(0, 40);
  const wrong = [];
  const shuffled = [...others].sort(() => Math.random() - 0.5);
  for (const w of shuffled) {
    if (wrong.length >= 3) break;
    if (!wrong.some((o) => o.m === w.m)) wrong.push(w);
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

  /* Flashcards */
  const [deck, setDeck] = useState([]);
  const [index, setIndex] = useState(0);
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

  /* Word of the day — API then fallback */
  useEffect(() => {
    vocabApi.wordOfDay()
      .then((d) => setWordOfDay(d || FALLBACK_WORD_OF_DAY))
      .catch(() => setWordOfDay(FALLBACK_WORD_OF_DAY));
  }, []);

  /* Load flashcards deck from API or fallback to dictionary */
  useEffect(() => {
    if (mode !== 'Flashcards') return;
    vocabApi.deck()
      .then((d) => {
        const list = (d && d.length) ? d : DICTIONARY.map((x) => ({
          id: x.w, word: x.w, meaning: x.m, example: x.ex,
        }));
        setDeck(list);
        setIndex(0);
        setFlipped(false);
      })
      .catch(() => {
        setDeck(DICTIONARY.map((x) => ({
          id: x.w, word: x.w, meaning: x.m, example: x.ex,
        })));
        setIndex(0);
        setFlipped(false);
      });
  }, [mode]);

  /* Load quiz */
  useEffect(() => {
    if (mode !== 'Quiz') return;
    vocabApi.quiz(10, unit === 'all' ? undefined : unit)
      .then((q) => { setQuiz(q); setQIndex(0); setSelected(null); })
      .catch(() => {
        const pool = unit === 'all'
          ? DICTIONARY
          : DICTIONARY.filter((w) => w.unit === Number(unit.replace('Unit ', '')));
        const questions = pool.slice(0, 10).map(buildQuestion);
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
  const card = deck[index];
  const goNext = () => {
    if (!card) return;
    setFlipped(false);
    setIndex((i) => (i + 1 < deck.length ? i + 1 : 0));
  };
  const goPrev = () => {
    if (!card) return;
    setFlipped(false);
    setIndex((i) => (i - 1 >= 0 ? i - 1 : deck.length - 1));
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
    return DICTIONARY.filter((w) => {
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
          <p className="ec-page-sub">Spaced repetition, quizzes, a blitz round, and a searchable dictionary of {DICTIONARY.length}+ words.</p>
        </div>
      </div>

      {/* Hero */}
      <div className="ec-voc-hero ec-voc-anim">
        <div className="ec-voc-hero-orb" aria-hidden="true" />
        <div className="ec-voc-hero-orb ec-voc-hero-orb--pink" aria-hidden="true" />
        <div className="ec-voc-hero-copy">
          <span className="ec-voc-hero-badge">English For Today · NCTB aligned</span>
          <h1>We help you <em>love</em> learning</h1>
          <p>Practice with spaced repetition, test yourself with quizzes, and browse the full dictionary — all in one place.</p>
          <div className="ec-voc-hero-stats">
            <div className="ec-voc-hero-stat"><strong>{DICTIONARY.length}</strong><span>Words</span></div>
            <div className="ec-voc-hero-stat"><strong>{masteryCount}</strong><span>Mastered</span></div>
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
            card ? (
              <div className="ec-voc-anim" key="flash">
                <div className="ec-flash-counter">
                  <span className="ec-flash-counter-label">
                    Card <strong>{index + 1}</strong> of {deck.length}
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
                    Next <span aria-hidden="true">→</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="ec-dict-empty">No cards due right now — try the Dictionary tab.</div>
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
                  {(quizQuestion.options || []).map((opt) => {
                    const isSelected = selected === opt;
                    const correctOpt = quizQuestion.answer ?? quizQuestion.a;
                    const isCorrect = opt === correctOpt;
                    return (
                      <button
                        key={opt}
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
                    {(blitzQuestion.options || []).map((opt) => {
                      const isSelected = selected === opt;
                      const correctOpt = blitzQuestion.answer ?? blitzQuestion.a;
                      const isCorrect = opt === correctOpt;
                      return (
                        <button
                          key={opt}
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
                    {dictQ.options.map((opt) => {
                      const isSelected = dictSelected === opt;
                      const isCorrect = opt === dictQ.answer;
                      const cls = `ec-quiz-option${isSelected ? (isCorrect ? ' ec-quiz-option--correct' : ' ec-quiz-option--incorrect') : ''}`;
                      return (
                        <button key={opt} className={cls} onClick={() => answerDict(opt)} disabled={!!dictSelected && !isSelected && !isCorrect}>
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
                  filteredDict.slice(0, 200).map((w) => (
                    <div key={w.w} className="ec-dict-item">
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

              {reviewQ && (
                <div className={`ec-quiz-card${reviewSelected ? (reviewSelected === reviewQ.answer ? ' ec-pop' : ' ec-shake') : ''}`} style={{ marginBottom: 18 }}>
                  <div className="ec-quiz-top">
                    <span className="ec-quiz-badge">Review quiz{savedWords.size >= 4 ? ' · saved words' : ''}</span>
                    <span className="ec-quiz-counter">{reviewScore.correct} / {reviewScore.total} correct</span>
                  </div>
                  <p className="ec-quiz-question">{reviewQ.prompt}</p>
                  <div className="ec-quiz-options">
                    {reviewQ.options.map((opt) => {
                      const isSelected = reviewSelected === opt;
                      const isCorrect = opt === reviewQ.answer;
                      const cls = `ec-quiz-option${isSelected ? (isCorrect ? ' ec-quiz-option--correct' : ' ec-quiz-option--incorrect') : ''}`;
                      return (
                        <button key={opt} className={cls} onClick={() => answerReview(opt)} disabled={!!reviewSelected && !isSelected && !isCorrect}>
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
                      if (mode !== 'Quiz') setMode('Quiz');
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
            <p className="ec-voc-xp-hint">+5 XP per correct flashcard · +10 per quiz · +15 per blitz</p>
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
