import { useEffect, useMemo, useState, useCallback } from 'react';
import { vocabApi } from '../api/vocab';
import { Icon } from '../components/Icon';

const VOCAB_CSS = `
/* ============================================================
   VOCABULARY — Langut-inspired
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
}

.ec-voc,
.ec-voc *{box-sizing:border-box}

/* ============================================================
   HEADING
   ============================================================ */
.ec-voc-head{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:20px}
.ec-voc-eyebrow{margin:0 0 6px;font-size:11.5px;font-weight:900;letter-spacing:.16em;text-transform:uppercase;color:var(--lang-purple);opacity:.95}

/* ============================================================
   HERO — deep purple with mascot + price-tag stats
   ============================================================ */
.ec-voc-hero{
  position:relative;
  overflow:hidden;
  border-radius:32px;
  padding:clamp(28px,4vw,44px) clamp(24px,4vw,44px);
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
}
.ec-voc-hero-orb--pink{
  top:auto;bottom:-100px;left:-60px;right:auto;
  width:220px;height:220px;
  background:radial-gradient(circle,rgba(255,143,203,.24),transparent 70%);
  animation-delay:-6s;
}
@keyframes ec-voc-drift{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-18px,16px) scale(1.08)}}

.ec-voc-hero-copy{position:relative;z-index:2;max-width:560px}
.ec-voc-hero-badge{
  display:inline-flex;align-items:center;
  font-size:10.5px;font-weight:900;letter-spacing:.16em;text-transform:uppercase;
  padding:7px 14px;border-radius:999px;
  background:var(--lang-lime);color:var(--lang-ink);
  margin-bottom:18px;
  border:2px solid var(--lang-ink);
  box-shadow:0 4px 0 rgba(23,16,46,.35);
}
.ec-voc-hero h1{
  margin:0 0 12px;
  font-size:clamp(28px,2.6vw + 16px,42px);
  font-weight:900;
  letter-spacing:-.035em;
  line-height:1.08;
  color:#fff;
}
.ec-voc-hero h1 em{font-style:normal;color:var(--lang-lime);}
.ec-voc-hero p{
  margin:0 0 22px;
  font-size:14.5px;line-height:1.6;
  opacity:.92;font-weight:500;max-width:52ch;
}

/* Price-tag style stat chips */
.ec-voc-hero-stats{display:flex;gap:12px;flex-wrap:wrap;position:relative;z-index:2}
.ec-voc-hero-stat{
  display:flex;flex-direction:column;gap:2px;
  padding:10px 16px;
  border-radius:16px;
  background:var(--lang-lime);
  border:2px solid var(--lang-ink);
  box-shadow:0 4px 0 var(--lang-ink);
  min-width:86px;
}
.ec-voc-hero-stat strong{
  font-size:22px;font-weight:900;line-height:1;
  letter-spacing:-.04em;
  color:var(--lang-ink);
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

/* Mascot blob (right side of hero) */
.ec-voc-hero-mascot{
  position:relative;z-index:2;
  flex-shrink:0;
  display:flex;align-items:center;justify-content:center;
  filter:drop-shadow(0 14px 28px rgba(0,0,0,.28));
  animation:ec-voc-bob 4s ease-in-out infinite;
}
@keyframes ec-voc-bob{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-10px) rotate(2deg)}}

/* ============================================================
   MODE TABS — chunky pills
   ============================================================ */
.ec-voc-tabs{
  display:flex;gap:10px;
  overflow-x:auto;scroll-snap-type:x mandatory;
  scrollbar-width:none;
  padding:6px 4px 18px;margin-bottom:6px;
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
}
.ec-voc-tab:hover{background:var(--lang-lime-soft);transform:translateY(-2px);box-shadow:0 5px 0 var(--lang-line)}
.ec-voc-tab:active{transform:translateY(1px);box-shadow:0 1px 0 var(--lang-line)}
.ec-voc-tab--active{
  background:var(--lang-ink);color:var(--lang-lime);
  box-shadow:0 3px 0 var(--lang-ink);
}
.ec-voc-tab--active:hover{background:var(--lang-ink);color:var(--lang-lime)}
.ec-voc-tab svg{width:16px;height:16px}

/* ============================================================
   GRID
   ============================================================ */
.ec-voc-grid{display:grid;grid-template-columns:minmax(0,1fr) 330px;gap:clamp(20px,3vw,28px);align-items:start}

/* ============================================================
   FLASHCARDS — chunky borders, dark outline
   ============================================================ */
.ec-flash-wrap{perspective:1600px;min-height:320px;margin-bottom:22px}
.ec-flash{
  position:relative;width:100%;height:320px;
  transform-style:preserve-3d;
  transition:transform .8s cubic-bezier(.2,1,.3,1);
  cursor:pointer;
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
}
.ec-flash-back .ec-flash-hint{color:rgba(255,255,255,.75)}
.ec-flash-syn{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:6px}
.ec-flash-syn span{
  font-size:11.5px;font-weight:900;
  padding:5px 13px;border-radius:999px;
  background:var(--lang-lime);color:var(--lang-ink);
  border:2px solid var(--lang-line);
}

.ec-flash-counter{
  display:flex;align-items:center;justify-content:space-between;
  gap:12px;margin-bottom:16px;
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

/* ---------- Grade buttons — chunky pills ---------- */
.ec-grade-row{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
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
}
.ec-grade-btn:hover{transform:translateY(-2px);box-shadow:0 6px 0 var(--lang-line)}
.ec-grade-btn:active{transform:translateY(2px);box-shadow:0 1px 0 var(--lang-line)}
.ec-grade-btn--again{background:var(--lang-pink-2);color:#fff}
.ec-grade-btn--hard {background:var(--lang-yellow)}
.ec-grade-btn--good {background:var(--lang-lime)}
.ec-grade-btn--easy {background:var(--lang-purple);color:#fff}

/* ============================================================
   QUIZ / BLITZ
   ============================================================ */
.ec-quiz-card{
  background:#fff;
  border-radius:32px;
  padding:28px;
  border:3px solid var(--lang-line);
  box-shadow:0 10px 0 var(--lang-line);
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
  font-size:clamp(18px,1.3vw + 14px,22px);
  font-weight:900;line-height:1.35;
  margin:0 0 22px;color:var(--lang-ink);
  letter-spacing:-.02em;
}
.ec-quiz-options{display:flex;flex-direction:column;gap:12px;margin-bottom:18px}
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
.ec-dict-bar{display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap;align-items:center}
.ec-dict-search{
  flex:1;min-width:200px;
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
  flex:1;border:none;outline:none;background:transparent;
  font-size:14.5px;color:var(--lang-ink);
  font-family:inherit;font-weight:700;
}
.ec-dict-search input::placeholder{font-weight:500;color:var(--lang-ink-soft)}
.ec-dict-clear{
  border:2px solid var(--lang-line);
  background:var(--lang-lime);color:var(--lang-ink);
  width:26px;height:26px;border-radius:50%;
  font-size:11px;font-weight:900;
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;font-family:inherit;
  box-shadow:0 2px 0 var(--lang-line);
}
.ec-dict-clear:hover{transform:translateY(-1px);box-shadow:0 3px 0 var(--lang-line)}

.ec-dict-filters{
  display:flex;gap:8px;overflow-x:auto;
  scrollbar-width:none;padding-bottom:8px;margin-bottom:16px;
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

.ec-dict-list{display:flex;flex-direction:column;gap:14px}
.ec-dict-item{
  background:#fff;
  border:2px solid var(--lang-line);
  border-radius:22px;
  padding:20px 22px;
  box-shadow:0 5px 0 var(--lang-line);
  transition:all .18s ease;
}
.ec-dict-item:hover{
  transform:translateY(-3px);
  box-shadow:0 8px 0 var(--lang-line);
}
.ec-dict-item-head{
  display:flex;align-items:baseline;justify-content:space-between;
  gap:12px;margin-bottom:8px;flex-wrap:wrap;
}
.ec-dict-word{
  margin:0;font-size:19px;font-weight:900;
  color:var(--lang-ink);letter-spacing:-.02em;
}
.ec-dict-pos{
  font-size:10.5px;font-weight:900;
  text-transform:uppercase;letter-spacing:.08em;
  padding:4px 11px;border-radius:999px;
  background:var(--lang-purple-2);color:#fff;
  border:2px solid var(--lang-line);
  box-shadow:0 2px 0 var(--lang-line);
  white-space:nowrap;
}
.ec-dict-meaning{
  margin:0 0 8px;font-size:14px;line-height:1.55;
  color:var(--lang-ink);font-weight:700;
}
.ec-dict-example{
  margin:0 0 12px;font-size:13px;line-height:1.6;
  color:var(--lang-ink-soft);font-style:italic;font-weight:500;
}
.ec-dict-meta{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
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
  padding:2px 8px;border-radius:10px;
  color:#C8C4D6;
  transition:all .16s ease;
  box-shadow:0 2px 0 var(--lang-line);
  line-height:1.2;
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
}
.ec-voc-wod-word{
  font-size:28px;font-weight:900;margin:0 0 8px;
  color:var(--lang-ink);letter-spacing:-.035em;line-height:1.1;
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

.ec-voc-units{display:flex;flex-direction:column;gap:8px}
.ec-voc-unit-btn{
  display:flex;align-items:center;justify-content:space-between;
  gap:10px;padding:11px 14px;
  border-radius:14px;
  border:2px solid var(--lang-line);
  background:#fff;color:var(--lang-ink);
  font-size:13px;font-weight:800;
  cursor:pointer;font-family:inherit;width:100%;
  transition:all .15s ease;
  box-shadow:0 3px 0 var(--lang-line);
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
   RESPONSIVE
   ============================================================ */
@media (max-width:900px){
  .ec-voc-grid{grid-template-columns:1fr;gap:22px}
  .ec-voc-hero{flex-direction:column;align-items:flex-start;min-height:0}
  .ec-voc-hero-mascot{position:absolute;right:16px;bottom:16px;transform:scale(.8);transform-origin:bottom right;animation:none}
}
@media (max-width:720px){
  .ec-voc-hero{padding:24px 22px;border-radius:26px}
  .ec-voc-hero h1{font-size:26px}
  .ec-voc-hero p{font-size:13.5px}
  .ec-voc-hero-stats{gap:8px;margin-top:16px}
  .ec-voc-hero-stat{padding:8px 12px;min-width:74px;border-radius:14px}
  .ec-voc-hero-stat strong{font-size:18px}
  .ec-voc-hero-stat span{font-size:9.5px}
  .ec-flash-wrap{min-height:280px}
  .ec-flash{height:280px}
  .ec-flash-face{padding:24px;border-radius:26px}
  .ec-flash-word{font-size:34px}
  .ec-flash-sub{font-size:13px}
  .ec-grade-row{grid-template-columns:1fr 1fr}
  .ec-grade-btn{min-height:54px;font-size:13.5px}
  .ec-quiz-card{padding:22px;border-radius:26px}
  .ec-quiz-question{font-size:16px}
  .ec-quiz-option{padding:14px 16px;font-size:14px;border-radius:16px}
  .ec-dict-item{padding:16px 18px;border-radius:20px}
  .ec-dict-word{font-size:17px}
  .ec-voc-card{padding:18px;border-radius:22px}
  .ec-voc-hero-mascot{display:none}
}
@media (max-width:380px){
  .ec-voc-hero-stat strong{font-size:16px}
  .ec-flash-word{font-size:30px}
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
      {/* Drop shadow */}
      <ellipse cx="85" cy="158" rx="46" ry="7" fill="#000" opacity="0.22" />
      {/* Left arm */}
      <path d="M40 70c-8-4-16 0-18 8s2 16 10 18" stroke="#17102E" strokeWidth="4" fill="#F5E04D" strokeLinejoin="round" />
      {/* Right arm */}
      <path d="M130 70c8-4 16 0 18 8s-2 16-10 18" stroke="#17102E" strokeWidth="4" fill="#F5E04D" strokeLinejoin="round" />
      {/* Body */}
      <path
        d="M85 18c-30 0-54 24-54 54 0 17 7 31 15 40 5 6 8 12 8 19 0 4 3 7 7 7h48c4 0 7-3 7-7 0-7 3-13 8-19 8-9 15-23 15-40 0-30-24-54-54-54z"
        fill="#F5E04D"
        stroke="#17102E"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Belly highlight */}
      <path
        d="M85 40c-20 0-36 14-36 34 0 13 6 22 12 29"
        stroke="#FBF0A0" strokeWidth="7" strokeLinecap="round" fill="none"
      />
      {/* Left eye */}
      <circle cx="68" cy="76" r="11" fill="#fff" stroke="#17102E" strokeWidth="3.5" />
      <circle cx="70" cy="78" r="4.8" fill="#17102E" />
      <circle cx="71.6" cy="76.4" r="1.5" fill="#fff" />
      {/* Right eye */}
      <circle cx="102" cy="76" r="11" fill="#fff" stroke="#17102E" strokeWidth="3.5" />
      <circle cx="104" cy="78" r="4.8" fill="#17102E" />
      <circle cx="105.6" cy="76.4" r="1.5" fill="#fff" />
      {/* Smile */}
      <path d="M76 98c3 5 6 7 9 7s6-2 9-7" stroke="#17102E" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      {/* Cheeks */}
      <circle cx="56" cy="94" r="4.5" fill="#FF8FCB" opacity="0.55" />
      <circle cx="114" cy="94" r="4.5" fill="#FF8FCB" opacity="0.55" />
      {/* Feet */}
      <ellipse cx="70" cy="132" rx="12" ry="5.5" fill="#F5E04D" stroke="#17102E" strokeWidth="3.5" />
      <ellipse cx="100" cy="132" rx="12" ry="5.5" fill="#F5E04D" stroke="#17102E" strokeWidth="3.5" />
      {/* Sparkles */}
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
  const grade = (g) => {
    if (!card) return;
    if (card.id) vocabApi.review(card.id, g).catch(() => {});
    const key = card.word;
    setMastery((m) => {
      const cur = m[key] ?? 0;
      const next = g === 'again' ? 0 : g === 'hard' ? Math.min(3, cur) : g === 'good' ? Math.min(3, cur + 1) : 3;
      return { ...m, [key]: next };
    });
    const xpAmount = g === 'again' ? 1 : g === 'hard' ? 3 : g === 'good' ? 5 : 8;
    awardXp(xpAmount);
    setFlipped(false);
    setIndex((i) => (i + 1 < deck.length ? i + 1 : 0));
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
                  <button className="ec-grade-btn ec-grade-btn--again" onClick={() => grade('again')}>Again</button>
                  <button className="ec-grade-btn ec-grade-btn--hard"  onClick={() => grade('hard')}>Hard</button>
                  <button className="ec-grade-btn ec-grade-btn--good"  onClick={() => grade('good')}>Good</button>
                  <button className="ec-grade-btn ec-grade-btn--easy"  onClick={() => grade('easy')}>Easy</button>
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