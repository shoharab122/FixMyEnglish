import { useEffect, useMemo, useState } from 'react';
import { grammarApi } from '../api/grammar';
import { Icon } from '../components/Icon';

const GRAMMAR_CSS = `
/* ============================================================
   GRAMMAR — Langut-inspired
   Deep purple + lime-yellow + chunky black outlines.
   ============================================================ */

.ec-grammar{
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

.ec-grammar,
.ec-grammar *{box-sizing:border-box}

.ec-grammar-head{
  display:flex;align-items:flex-end;justify-content:space-between;
  gap:16px;margin-bottom:22px;flex-wrap:wrap;
}
.ec-grammar-head-actions{display:flex;align-items:center;gap:12px;flex-shrink:0;flex-wrap:wrap}

.ec-score-track{
  font-size:12.5px;font-weight:900;
  color:var(--lang-ink);
  background:var(--lang-lime);
  border:2px solid var(--lang-line);
  border-radius:999px;
  padding:9px 16px;
  box-shadow:0 3px 0 var(--lang-line);
  letter-spacing:.02em;
}
.ec-score-good{color:var(--lang-ink);font-weight:900}

/* ---------- Mode tabs — chunky pills ---------- */
.ec-mode-tabs{
  display:flex;gap:10px;
  overflow-x:auto;scroll-snap-type:x mandatory;
  scrollbar-width:none;
  padding:6px 4px 18px;margin-bottom:8px;
}
.ec-mode-tabs::-webkit-scrollbar{display:none}
.ec-mode-tab{
  display:inline-flex;align-items:center;gap:8px;
  flex:0 0 auto;scroll-snap-align:start;
  border:2px solid var(--lang-line);
  background:#fff;
  color:var(--lang-ink);
  font-size:13px;font-weight:900;
  padding:11px 18px;
  border-radius:999px;
  cursor:pointer;white-space:nowrap;
  transition:all .18s ease;font-family:inherit;
  box-shadow:0 3px 0 var(--lang-line);
  letter-spacing:.01em;
}
.ec-mode-tab:hover{
  background:var(--lang-lime-soft);
  transform:translateY(-2px);
  box-shadow:0 5px 0 var(--lang-line);
}
.ec-mode-tab:active{
  transform:translateY(1px);
  box-shadow:0 1px 0 var(--lang-line);
}
.ec-mode-tab--active{
  background:var(--lang-ink);color:var(--lang-lime);
  box-shadow:0 3px 0 var(--lang-ink);
}
.ec-mode-tab--active:hover{background:var(--lang-ink);color:var(--lang-lime)}
.ec-mode-tab-icon{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px}
.ec-mode-tab-icon svg{width:16px;height:16px}

/* ---------- XP toast ---------- */
.ec-xp-toast{
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

/* ============================================================
   LAYOUT
   ============================================================ */
.ec-g-two-col{
  display:grid;grid-template-columns:minmax(0,1fr) 320px;
  gap:clamp(20px,3vw,28px);align-items:start;
}

/* ============================================================
   QUIZ CARD — chunky border + hard shadow
   ============================================================ */
.ec-quiz-card{
  background:#fff;
  border-radius:32px;
  padding:28px;
  border:3px solid var(--lang-line);
  box-shadow:0 10px 0 var(--lang-line);
  position:relative;overflow:hidden;
  background-image:radial-gradient(circle at 100% 0%,rgba(212,245,92,.14),transparent 55%);
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
.ec-quiz-footer{min-height:24px;display:flex;align-items:center}
.ec-quiz-feedback{font-size:13.5px;font-weight:900;letter-spacing:.02em}
.ec-quiz-feedback--good{color:#1F8A4C}
.ec-quiz-feedback--bad{color:var(--lang-pink-2)}
.ec-quiz-explain{
  margin:14px 0 0;font-size:13px;line-height:1.6;
  color:var(--lang-ink);
  background:var(--lang-lime-soft);
  border:2px solid var(--lang-line);
  border-radius:16px;
  padding:14px 16px;
  font-weight:700;
  box-shadow:0 3px 0 var(--lang-line);
}

/* ============================================================
   TOPIC PANEL (sidebar)
   ============================================================ */
.ec-topic-panel{
  background:#fff;
  border:3px solid var(--lang-line);
  border-radius:32px;
  padding:22px;
  box-shadow:0 10px 0 var(--lang-line);
}
.ec-topic-panel-head{
  display:flex;align-items:center;justify-content:space-between;
  margin-bottom:14px;
}
.ec-topic-panel-head h3{
  margin:0;font-size:16px;font-weight:900;
  color:var(--lang-ink);letter-spacing:-.02em;
}
.ec-topic-panel-count{
  font-size:11px;font-weight:900;
  color:var(--lang-ink);
  background:var(--lang-lime);
  border:2px solid var(--lang-line);
  padding:4px 11px;border-radius:999px;
  box-shadow:0 2px 0 var(--lang-line);
}
.ec-topic-list{
  display:flex;flex-direction:column;gap:8px;
  max-height:560px;overflow-y:auto;padding-right:4px;
}
.ec-topic-btn{
  display:flex;align-items:center;gap:10px;
  padding:11px 14px;border-radius:14px;
  border:2px solid var(--lang-line);
  background:#fff;color:var(--lang-ink);
  font-size:13.5px;font-weight:800;
  text-align:left;cursor:pointer;
  transition:all .15s ease;font-family:inherit;width:100%;
  box-shadow:0 3px 0 var(--lang-line);
}
.ec-topic-btn:hover{
  background:var(--lang-lime-soft);
  transform:translateY(-1px);
  box-shadow:0 4px 0 var(--lang-line);
}
.ec-topic-btn--active{
  background:var(--lang-ink);color:var(--lang-lime);
}
.ec-topic-btn--active:hover{background:var(--lang-ink);color:var(--lang-lime)}
.ec-topic-name{
  flex:1;min-width:0;overflow:hidden;
  text-overflow:ellipsis;white-space:nowrap;
}
.ec-topic-pct{
  font-size:11px;font-weight:900;
  color:var(--lang-ink);
  background:var(--lang-lime);
  border:2px solid var(--lang-line);
  padding:3px 9px;border-radius:999px;flex-shrink:0;
}
.ec-topic-pct--weak{
  color:#fff;
  background:var(--lang-pink-2);
}
.ec-topic-pct--empty{
  color:var(--lang-ink-soft);
  background:transparent;
  border-color:transparent;
  box-shadow:none;
  padding:0;
}
.ec-topic-btn--active .ec-topic-pct{
  background:var(--lang-lime);color:var(--lang-ink);
  border-color:var(--lang-line);
}

/* ============================================================
   SPOT THE MISTAKE
   ============================================================ */
.ec-spot-card{
  background:#fff;
  border:3px solid var(--lang-line);
  border-radius:32px;
  padding:30px;
  box-shadow:0 10px 0 var(--lang-line);
  background-image:radial-gradient(circle at 100% 0%,rgba(212,245,92,.14),transparent 55%);
}
.ec-spot-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
.ec-spot-hint{
  font-size:13.5px;color:var(--lang-ink-soft);
  margin:0 0 18px;font-weight:700;
  letter-spacing:.02em;
}
.ec-sentence{
  font-size:clamp(19px,1.4vw + 14px,24px);
  line-height:2.2;font-weight:900;
  color:var(--lang-ink);
  margin:0 0 14px;letter-spacing:-.01em;
}
.ec-word-tap{
  display:inline-block;padding:5px 12px;
  margin:0 3px 6px;border-radius:12px;
  cursor:pointer;transition:all .15s ease;
  font-family:inherit;
  border:2px solid transparent;
}
.ec-word-tap:hover{
  background:var(--lang-lime-soft);
  border-color:var(--lang-line);
  color:var(--lang-ink);
}
.ec-word-tap--correct{
  background:var(--lang-lime);
  border-color:var(--lang-line);
  color:var(--lang-ink);
  box-shadow:0 3px 0 var(--lang-line);
}
.ec-word-tap--wrong{
  background:var(--lang-pink-2);
  border-color:var(--lang-line);
  color:#fff;
  box-shadow:0 3px 0 var(--lang-line);
}
.ec-word-tap--reveal{
  background:var(--lang-lime);
  border-color:var(--lang-line);
  color:var(--lang-ink);
  box-shadow:0 3px 0 var(--lang-line);
}
.ec-spot-result{font-size:14.5px;font-weight:900;margin:0;letter-spacing:.02em}
.ec-spot-result--ok{color:#1F8A4C}
.ec-spot-result--bad{color:var(--lang-pink-2)}

/* ============================================================
   STORY MODE
   ============================================================ */
.ec-story-tabs{
  display:flex;gap:10px;overflow-x:auto;
  scrollbar-width:none;padding-bottom:8px;margin-bottom:16px;
}
.ec-story-tabs::-webkit-scrollbar{display:none}
.ec-story-tab{
  flex:0 0 auto;
  border:2px solid var(--lang-line);
  background:#fff;color:var(--lang-ink);
  font-size:13px;font-weight:900;
  padding:11px 18px;border-radius:999px;
  cursor:pointer;white-space:nowrap;
  transition:all .18s ease;font-family:inherit;
  box-shadow:0 3px 0 var(--lang-line);
}
.ec-story-tab:hover{
  background:var(--lang-lime-soft);
  transform:translateY(-2px);
  box-shadow:0 5px 0 var(--lang-line);
}
.ec-story-tab--active{
  background:var(--lang-ink);color:var(--lang-lime);
  box-shadow:0 3px 0 var(--lang-ink);
}
.ec-story-card{
  background:#fff;
  border:3px solid var(--lang-line);
  border-radius:32px;
  padding:30px;
  box-shadow:0 10px 0 var(--lang-line);
  background-image:radial-gradient(circle at 0% 100%,rgba(255,143,203,.10),transparent 55%);
}
.ec-story-title{
  margin:0 0 16px;font-size:22px;font-weight:900;
  color:var(--lang-ink);letter-spacing:-.025em;
}
.ec-story-body{
  line-height:2.5;font-size:16px;
  color:var(--lang-ink);font-weight:700;
}
.ec-story-blank{display:inline-block;margin:0 4px}
.ec-story-select{
  font-family:inherit;font-size:14px;font-weight:900;
  padding:8px 14px;border-radius:12px;
  border:2px solid var(--lang-line);
  background:var(--lang-lime);
  color:var(--lang-ink);
  cursor:pointer;outline:none;
  transition:all .18s ease;
  box-shadow:0 3px 0 var(--lang-line);
}
.ec-story-select:hover{
  transform:translateY(-1px);
  box-shadow:0 4px 0 var(--lang-line);
}
.ec-story-select:focus{
  box-shadow:0 3px 0 var(--lang-line),0 0 0 4px rgba(212,245,92,.6);
}
.ec-story-foot{
  margin-top:26px;display:flex;align-items:center;
  gap:16px;flex-wrap:wrap;
}
.ec-story-score{
  font-size:13.5px;font-weight:900;
  color:var(--lang-ink);
  background:var(--lang-lime);
  border:2px solid var(--lang-line);
  padding:8px 14px;border-radius:999px;
  box-shadow:0 3px 0 var(--lang-line);
  letter-spacing:.02em;
}
.ec-story-score--perfect{
  background:var(--lang-yellow);
}

/* ============================================================
   COMMON MISTAKES — flip cards
   ============================================================ */
.ec-mistakes-grid{
  display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));
  gap:22px;
}
.ec-flip-card{
  position:relative;perspective:1600px;
  cursor:pointer;min-height:300px;outline:none;
  border-radius:28px;-webkit-tap-highlight-color:transparent;
}
.ec-flip-card:focus-visible .ec-flip-inner{
  box-shadow:0 0 0 4px rgba(212,245,92,.9);
  border-radius:28px;
}
.ec-flip-inner{
  position:relative;width:100%;height:100%;min-height:300px;
  transform-style:preserve-3d;-webkit-transform-style:preserve-3d;
  transition:transform .8s cubic-bezier(.2,1,.3,1);
}
.ec-flip-card--flipped .ec-flip-inner{transform:rotateY(180deg)}

.ec-flip-face{
  position:absolute;inset:0;
  backface-visibility:hidden;-webkit-backface-visibility:hidden;
  transform:rotateY(0deg);
  border-radius:28px;
  padding:24px;
  border:3px solid var(--lang-line);
  box-shadow:0 8px 0 var(--lang-line);
  display:flex;flex-direction:column;gap:14px;
  transition:box-shadow .3s ease, visibility 0s linear .35s;
}

.ec-flip-front{
  visibility:visible;
  background:#fff;
  background-image:radial-gradient(circle at 100% 0%,rgba(255,143,203,.22),transparent 55%);
}
.ec-flip-card:hover .ec-flip-front{box-shadow:0 10px 0 var(--lang-line)}

.ec-flip-back{
  transform:rotateY(180deg);
  visibility:hidden;
  background:var(--lang-lime);
  background-image:radial-gradient(circle at 100% 0%,rgba(255,255,255,.5),transparent 55%),
                   linear-gradient(150deg,#D4F55C 0%,#B8E62E 100%);
}
.ec-flip-card:hover .ec-flip-back{box-shadow:0 10px 0 var(--lang-line)}

.ec-flip-card--flipped .ec-flip-front{visibility:hidden}
.ec-flip-card--flipped .ec-flip-back{visibility:visible}

.ec-flip-top{
  position:relative;z-index:1;
  display:flex;align-items:center;justify-content:space-between;gap:10px;
}
.ec-flip-num{
  font-size:11px;font-weight:900;letter-spacing:.08em;
  color:var(--lang-ink);
  background:#fff;
  border:2px solid var(--lang-line);
  padding:5px 12px;border-radius:999px;
  font-variant-numeric:tabular-nums;
  box-shadow:0 2px 0 var(--lang-line);
}
.ec-flip-back .ec-flip-num{
  background:#fff;color:var(--lang-ink);
}

.ec-flip-badge{
  display:inline-flex;align-items:center;gap:5px;
  font-size:10.5px;font-weight:900;letter-spacing:.08em;
  text-transform:uppercase;
  padding:5px 12px;border-radius:999px;
  border:2px solid var(--lang-line);
  white-space:nowrap;
  box-shadow:0 2px 0 var(--lang-line);
}
.ec-flip-badge--wrong{background:var(--lang-pink-2);color:#fff}
.ec-flip-badge--right{background:#fff;color:var(--lang-ink)}

.ec-flip-body{
  position:relative;z-index:1;
  display:flex;flex-direction:column;gap:6px;
  flex:1;justify-content:center;
}
.ec-flip-title{
  margin:0;font-size:18px;font-weight:900;
  letter-spacing:-.02em;color:var(--lang-ink);line-height:1.3;
}
.ec-flip-desc{
  margin:0;font-size:13.5px;line-height:1.55;
  color:var(--lang-ink-soft);font-weight:700;
}
.ec-flip-back .ec-flip-desc{color:var(--lang-ink);opacity:.85}

.ec-flip-example{
  position:relative;z-index:1;
  display:flex;align-items:flex-start;gap:10px;
  padding:13px 15px;border-radius:14px;
  font-size:13.5px;line-height:1.5;font-weight:800;
  border:2px solid var(--lang-line);
  box-shadow:0 3px 0 var(--lang-line);
}
.ec-flip-example--wrong{background:#fff;color:var(--lang-ink)}
.ec-flip-example--right{background:#fff;color:var(--lang-ink)}
.ec-flip-example-icon{
  flex-shrink:0;width:22px;height:22px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  font-size:11px;font-weight:900;color:#fff;
  border:2px solid var(--lang-line);
  margin-top:1px;
}
.ec-flip-example--wrong .ec-flip-example-icon{background:var(--lang-pink-2)}
.ec-flip-example--right .ec-flip-example-icon{background:var(--lang-lime-deep)}
.ec-flip-example-text{flex:1;min-width:0;word-wrap:break-word}

.ec-flip-hint{
  position:relative;z-index:1;
  font-size:12px;font-weight:900;
  color:var(--lang-ink-soft);
  display:inline-flex;align-items:center;gap:6px;
  letter-spacing:.02em;
}
.ec-flip-back .ec-flip-hint{color:var(--lang-ink)}
.ec-flip-hint-arrow{
  display:inline-block;
  transition:transform .3s cubic-bezier(.22,1,.36,1);
}
.ec-flip-card:hover .ec-flip-hint-arrow{transform:translateX(4px)}
.ec-flip-back .ec-flip-hint .ec-flip-hint-arrow{transform:rotate(180deg)}
.ec-flip-card:hover.ec-flip-card--flipped .ec-flip-hint .ec-flip-hint-arrow{transform:rotate(180deg) translateX(4px)}

/* ============================================================
   RULES LIBRARY
   ============================================================ */
.ec-rules{display:flex;flex-direction:column;gap:20px}
.ec-rules-toolbar{display:flex;align-items:center;gap:12px}
.ec-rules-search{
  flex:1;display:flex;align-items:center;gap:10px;
  background:#fff;
  border:2px solid var(--lang-line);
  border-radius:999px;
  padding:13px 20px;
  color:var(--lang-ink-soft);
  box-shadow:0 4px 0 var(--lang-line);
  transition:all .2s ease;
}
.ec-rules-search:focus-within{
  box-shadow:0 4px 0 var(--lang-line),0 0 0 4px rgba(212,245,92,.5);
}
.ec-rules-search input{
  flex:1;border:none;outline:none;background:transparent;
  font-size:14.5px;color:var(--lang-ink);
  font-weight:700;font-family:inherit;
}
.ec-rules-search input::placeholder{
  color:var(--lang-ink-soft);font-weight:500;
}
.ec-rules-clear{
  border:2px solid var(--lang-line);
  background:var(--lang-lime);color:var(--lang-ink);
  width:26px;height:26px;border-radius:50%;
  font-size:11px;font-weight:900;
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;font-family:inherit;
  box-shadow:0 2px 0 var(--lang-line);
}
.ec-rules-clear:hover{
  transform:translateY(-1px);
  box-shadow:0 3px 0 var(--lang-line);
}
.ec-rules-cats{
  display:flex;gap:10px;overflow-x:auto;
  scrollbar-width:none;padding-bottom:8px;
}
.ec-rules-cats::-webkit-scrollbar{display:none}
.ec-rule-cat{
  flex:0 0 auto;
  border:2px solid var(--lang-line);
  background:#fff;color:var(--lang-ink);
  font-size:12.5px;font-weight:900;
  padding:10px 16px;border-radius:999px;
  cursor:pointer;white-space:nowrap;
  transition:all .18s ease;font-family:inherit;
  box-shadow:0 3px 0 var(--lang-line);
}
.ec-rule-cat:hover{
  background:var(--lang-lime-soft);
  transform:translateY(-2px);
  box-shadow:0 5px 0 var(--lang-line);
}
.ec-rule-cat--active{
  background:var(--lang-ink);color:var(--lang-lime);
  box-shadow:0 3px 0 var(--lang-ink);
}

.ec-rule-grid{
  display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));
  gap:20px;
}
.ec-rule-card{
  background:#fff;
  border:3px solid var(--lang-line);
  border-radius:26px;
  padding:24px;
  box-shadow:0 8px 0 var(--lang-line);
  display:flex;flex-direction:column;gap:14px;
  transition:all .18s ease;
  background-image:radial-gradient(circle at 100% 0%,rgba(212,245,92,.12),transparent 55%);
}
.ec-rule-card:hover{
  transform:translateY(-4px);
  box-shadow:0 12px 0 var(--lang-line);
}

.ec-rule-head{display:flex;flex-direction:column;gap:8px}
.ec-rule-cat-tag{
  align-self:flex-start;
  font-size:10px;font-weight:900;letter-spacing:.1em;
  text-transform:uppercase;
  padding:5px 12px;border-radius:999px;
  background:var(--lang-pink);color:var(--lang-ink);
  border:2px solid var(--lang-line);
  box-shadow:0 2px 0 var(--lang-line);
}
.ec-rule-title{
  margin:6px 0 0;font-size:20px;font-weight:900;
  color:var(--lang-ink);letter-spacing:-.025em;
}
.ec-rule-summary{
  margin:0;font-size:13px;font-weight:700;
  color:var(--lang-ink-soft);
}
.ec-rule-explain{
  margin:0;font-size:13.5px;line-height:1.65;
  color:var(--lang-ink);
  background:var(--lang-lime-soft);
  border:2px solid var(--lang-line);
  border-radius:14px;
  padding:13px 15px;
  font-weight:700;
  box-shadow:0 3px 0 var(--lang-line);
}
.ec-rule-examples{
  list-style:none;margin:0;padding:0;
  display:flex;flex-direction:column;gap:8px;
}
.ec-rule-examples li{
  display:flex;align-items:flex-start;gap:8px;
  font-size:13px;line-height:1.5;
  padding:9px 12px;border-radius:12px;
  font-weight:800;
  border:2px solid var(--lang-line);
  box-shadow:0 2px 0 var(--lang-line);
}
.ec-rule-ex-icon{
  flex-shrink:0;font-weight:900;
  font-size:12px;width:16px;text-align:center;
}
.ec-rule-ex--ok{background:var(--lang-lime);color:var(--lang-ink)}
.ec-rule-ex--bad{background:var(--lang-pink-2);color:#fff}
.ec-rule-ex-note{
  color:inherit;opacity:.75;
  font-style:italic;margin-left:4px;font-weight:600;
}
.ec-rule-tips{
  background:var(--lang-yellow);
  border:2px solid var(--lang-line);
  border-radius:14px;
  padding:13px 15px;
  font-size:13px;
  color:var(--lang-ink);
  font-weight:700;
  box-shadow:0 3px 0 var(--lang-line);
}
.ec-rule-tips-label{
  font-weight:900;display:block;margin-bottom:6px;
  letter-spacing:.02em;
}
.ec-rule-tips ul{margin:0;padding-left:20px;line-height:1.6}

/* ---------- Empty state ---------- */
.ec-grammar-empty{
  text-align:center;
  color:var(--lang-ink-soft);
  font-size:14.5px;
  padding:60px 24px;
  background:#fff;
  border-radius:26px;
  border:2px dashed var(--lang-line);
  font-weight:700;
}

/* ---------- Black pill button ---------- */
.ec-btn-dark{
  background:var(--lang-ink);
  color:var(--lang-lime);
  border:2px solid var(--lang-line);
  padding:14px 26px;border-radius:999px;
  font-size:14px;font-weight:900;
  cursor:pointer;font-family:inherit;
  transition:all .15s ease;
  box-shadow:0 4px 0 var(--lang-line);
  min-height:52px;
  letter-spacing:.03em;
}
.ec-btn-dark:hover{
  transform:translateY(-2px);
  box-shadow:0 6px 0 var(--lang-line);
}
.ec-btn-dark:active{
  transform:translateY(2px);
  box-shadow:0 1px 0 var(--lang-line);
}

/* ============================================================
   ANIMATIONS
   ============================================================ */
@keyframes ec-fade-slide-in{
  from{opacity:0;transform:translateY(12px)}
  to{opacity:1;transform:translateY(0)}
}
.ec-anim-in{animation:ec-fade-slide-in .45s ease both}
@keyframes ec-pop{0%{transform:scale(1)}50%{transform:scale(1.04)}100%{transform:scale(1)}}
.ec-pop{animation:ec-pop .35s cubic-bezier(.34,1.56,.64,1)}
@keyframes ec-shake{
  0%,100%{transform:translateX(0)}
  20%{transform:translateX(-6px)}
  40%{transform:translateX(6px)}
  60%{transform:translateX(-4px)}
  80%{transform:translateX(4px)}
}
.ec-shake{animation:ec-shake .4s ease}
@keyframes ec-pulse-ring{
  0%{box-shadow:0 0 0 0 rgba(212,245,92,.6),0 10px 0 var(--lang-line)}
  100%{box-shadow:0 0 0 20px rgba(212,245,92,0),0 10px 0 var(--lang-line)}
}
.ec-pulse-ring{animation:ec-pulse-ring .8s ease}

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media(max-width:900px){
  .ec-g-two-col{grid-template-columns:1fr;gap:18px}
  .ec-rule-grid{grid-template-columns:1fr}
  .ec-topic-list{max-height:none}
  .ec-mistakes-grid{grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}
}
@media(max-width:720px){
  .ec-grammar-head{flex-direction:column;align-items:flex-start;gap:12px}
  .ec-grammar-head-actions{width:100%;justify-content:space-between}
  .ec-quiz-card,.ec-spot-card,.ec-story-card,.ec-rule-card{padding:22px;border-radius:26px}
  .ec-topic-panel{padding:18px;border-radius:26px}
  .ec-quiz-question{font-size:17px}
  .ec-quiz-option{padding:14px 16px;font-size:14px;border-radius:16px}
  .ec-sentence{font-size:18px;line-height:2}
  .ec-story-body{font-size:15px;line-height:2.2}
  .ec-story-title{font-size:19px}
  .ec-mode-tab{padding:10px 14px;font-size:12.5px}
  .ec-topic-btn{padding:11px 13px;font-size:13px}
  .ec-mistakes-grid{grid-template-columns:1fr;gap:14px}
  .ec-flip-card,.ec-flip-inner{min-height:280px}
  .ec-flip-face{padding:20px;border-radius:24px}
  .ec-flip-title{font-size:17px}
  .ec-flip-desc{font-size:13px}
  .ec-flip-example{font-size:13px;padding:12px 13px}
  .ec-rules-search{padding:12px 18px}
  .ec-rules-search input{font-size:16px}
  .ec-rule-card{padding:20px;border-radius:22px}
  .ec-rule-title{font-size:17px}
}
@media(prefers-reduced-motion:reduce){
  .ec-anim-in,.ec-pop,.ec-shake,.ec-pulse-ring,.ec-xp-toast{animation:none!important}
  .ec-flip-inner{transition:none}
  .ec-flip-card:hover .ec-flip-hint-arrow{transform:none}
  .ec-word-tap,.ec-topic-btn,.ec-mode-tab,.ec-rule-cat,.ec-story-tab{transition:none!important}
}
`;

const MODES = [
  { id: 'Exercises',        label: 'Exercises',        icon: 'target' },
  { id: 'Spot the Mistake', label: 'Spot the Mistake', icon: 'search' },
  { id: 'Story Mode',       label: 'Story Mode',       icon: 'book' },
  { id: 'Common Mistakes',  label: 'Common Mistakes',  icon: 'flag' },
  { id: 'Rules Library',    label: 'Rules Library',    icon: 'grid' },
];

/* ============================================================
   TOPIC QUESTION BANK — 400 questions across 17 topics
   ============================================================ */
const TOPIC_QUESTION_BANK = {
  t1: { name: 'Present Simple', questions: [
    { id: 'q1', prompt: 'She ___ to school every day.', options: ['go','goes','going','gone'], answer: 'goes', explain: 'He/She/It takes verb + -s.', banglaExplain: 'he/she/it এর সাথে verb-এ -s/-es যোগ হয়।' },
    { id: 'q2', prompt: 'They ___ football on Sundays.', options: ['play','plays','playing','played'], answer: 'play', explain: 'Plural subjects take the base verb.', banglaExplain: 'বহুবচন subject-এর সাথে base verb বসে।' },
    { id: 'q3', prompt: 'He ___ coffee every morning.', options: ['drink','drinks','drinking','drank'], answer: 'drinks', explain: 'Third person singular adds -s.', banglaExplain: 'তৃতীয় পুরুষ একবচনে -s যোগ হয়।' },
    { id: 'q4', prompt: 'Water ___ at 100 degrees Celsius.', options: ['boil','boils','boiling','boiled'], answer: 'boils', explain: 'General truths use present simple.', banglaExplain: 'সাধারণ সত্য বোঝাতে present simple হয়।' },
    { id: 'q5', prompt: 'My sister ___ in a hospital.', options: ['work','works','working','worked'], answer: 'works', explain: 'Third person singular adds -s.', banglaExplain: 'তৃতীয় পুরুষ একবচনে -s যোগ হয়।' },
    { id: 'q6', prompt: 'We ___ to the gym twice a week.', options: ['go','goes','going','went'], answer: 'go', explain: 'Routines with "we" use base verb.', banglaExplain: '"We" এর সাথে base verb বসে।' },
    { id: 'q7', prompt: 'The sun ___ in the east.', options: ['rise','rises','rising','rose'], answer: 'rises', explain: 'General truth — third person singular.', banglaExplain: 'সাধারণ সত্য — তৃতীয় পুরুষ একবচনে -s।' },
    { id: 'q8', prompt: 'She ___ English very well.', options: ['speak','speaks','speaking','spoke'], answer: 'speaks', explain: 'He/She/It + verb-s.', banglaExplain: 'he/she/it এর সাথে verb-s বসে।' },
    { id: 'q9', prompt: 'I ___ coffee every morning.', options: ['drink','drinks','drinking','drank'], answer: 'drink', explain: '"I" takes the base form.', banglaExplain: '"I" এর সাথে base form বসে।' },
    { id: 'q10', prompt: 'Cows ___ grass.', options: ['eat','eats','eating','ate'], answer: 'eat', explain: 'Plural noun → base verb.', banglaExplain: 'বহুবচন noun → base verb।' },
    { id: 'q11', prompt: 'My father ___ to work by bus.', options: ['go','goes','going','went'], answer: 'goes', explain: 'He/She/It takes -s.', banglaExplain: 'he/she/it এর সাথে -s যোগ হয়।' },
    { id: 'q12', prompt: 'The train ___ at 6 PM daily.', options: ['leave','leaves','leaving','left'], answer: 'leaves', explain: 'Scheduled events use present simple.', banglaExplain: 'নির্ধারিত সময়সূচির জন্য present simple হয়।' },
    { id: 'q13', prompt: 'The shop ___ at 9 AM.', options: ['open','opens','opening','opened'], answer: 'opens', explain: 'Third person singular -s.', banglaExplain: 'তৃতীয় পুরুষ একবচনে -s।' },
    { id: 'q14', prompt: 'She always ___ her teeth before bed.', options: ['brush','brushes','brushing','brushed'], answer: 'brushes', explain: 'Habits with she → -es.', banglaExplain: 'she এর অভ্যাস → -es।' },
    { id: 'q15', prompt: 'We ___ TV every evening.', options: ['watch','watches','watching','watched'], answer: 'watch', explain: 'We + base verb.', banglaExplain: 'we + base verb।' },
    { id: 'q16', prompt: 'My mother ___ delicious food.', options: ['cook','cooks','cooking','cooked'], answer: 'cooks', explain: 'She → -s.', banglaExplain: 'She → -s।' },
    { id: 'q17', prompt: 'Birds ___ in the sky.', options: ['fly','flies','flying','flew'], answer: 'fly', explain: 'Plural subject → base verb.', banglaExplain: 'বহুবচন subject → base verb।' },
    { id: 'q18', prompt: 'He ___ to work by train.', options: ['commute','commutes','commuting','commuted'], answer: 'commutes', explain: 'He → -s.', banglaExplain: 'He → -s।' },
    { id: 'q19', prompt: 'The baby ___ every two hours.', options: ['cry','cries','crying','cried'], answer: 'cries', explain: 'Baby (singular) → cries.', banglaExplain: 'Baby (একবচন) → cries।' },
    { id: 'q20', prompt: 'They ___ their grandparents every weekend.', options: ['visit','visits','visiting','visited'], answer: 'visit', explain: 'They → base verb.', banglaExplain: 'They → base verb।' },
    { id: 'q21', prompt: 'Water ___ at 0°C.', options: ['freeze','freezes','freezing','froze'], answer: 'freezes', explain: 'General truth.', banglaExplain: 'সাধারণ সত্য।' },
    { id: 'q22', prompt: 'My brother ___ video games.', options: ['play','plays','playing','played'], answer: 'plays', explain: 'He → -s.', banglaExplain: 'He → -s।' },
    { id: 'q23', prompt: 'I usually ___ up at 7 AM.', options: ['wake','wakes','waking','woke'], answer: 'wake', explain: 'I + base verb.', banglaExplain: 'I + base verb।' },
    { id: 'q24', prompt: 'The moon ___ around the earth.', options: ['go','goes','going','went'], answer: 'goes', explain: 'Singular subject → -es.', banglaExplain: 'একবচন subject → -es।' },
  ]},
  t2: { name: 'Present Continuous', questions: [
    { id: 'q1', prompt: 'Look! The baby ___ .', options: ['cries','cried','is crying','has cried'], answer: 'is crying', explain: 'Action happening now: am/is/are + -ing.', banglaExplain: 'এই মুহূর্তে চলমান কাজ: am/is/are + -ing।' },
    { id: 'q2', prompt: 'I ___ a book right now.', options: ['read','reads','am reading','have read'], answer: 'am reading', explain: '"I" takes "am" + -ing.', banglaExplain: '"I" এর সাথে "am" + -ing।' },
    { id: 'q3', prompt: 'She ___ dinner at the moment.', options: ['cook','cooks','is cooking','cooked'], answer: 'is cooking', explain: 'She + is + -ing.', banglaExplain: 'She + is + -ing।' },
    { id: 'q4', prompt: 'They ___ football in the park now.', options: ['play','plays','are playing','played'], answer: 'are playing', explain: 'They + are + -ing.', banglaExplain: 'They + are + -ing।' },
    { id: 'q5', prompt: 'He ___ TV right now.', options: ['watch','watches','is watching','watched'], answer: 'is watching', explain: 'He + is + -ing.', banglaExplain: 'He + is + -ing।' },
    { id: 'q6', prompt: 'We ___ for the bus.', options: ['wait','waits','are waiting','waited'], answer: 'are waiting', explain: 'We + are + -ing.', banglaExplain: 'We + are + -ing।' },
    { id: 'q7', prompt: 'Listen! Someone ___ at the door.', options: ['knock','knocks','is knocking','knocked'], answer: 'is knocking', explain: 'Action happening now.', banglaExplain: 'এখন ঘটছে এমন কাজ।' },
    { id: 'q8', prompt: 'The children ___ in the garden.', options: ['play','plays','are playing','played'], answer: 'are playing', explain: 'Plural + are + -ing.', banglaExplain: 'বহুবচন + are + -ing।' },
    { id: 'q9', prompt: 'I ___ to music at the moment.', options: ['listen','listens','am listening','listened'], answer: 'am listening', explain: '"At the moment" signals continuous.', banglaExplain: '"At the moment" continuous বোঝায়।' },
    { id: 'q10', prompt: 'She ___ her homework now.', options: ['do','does','is doing','did'], answer: 'is doing', explain: 'She + is + -ing.', banglaExplain: 'She + is + -ing।' },
    { id: 'q11', prompt: 'They ___ dinner together tonight.', options: ['have','has','are having','had'], answer: 'are having', explain: 'Fixed future arrangement.', banglaExplain: 'নির্দিষ্ট ভবিষ্যৎ পরিকল্পনা।' },
    { id: 'q12', prompt: 'It ___ outside right now.', options: ['rain','rains','is raining','rained'], answer: 'is raining', explain: 'Happening now — is + -ing.', banglaExplain: 'এখন ঘটছে — is + -ing।' },
    { id: 'q13', prompt: 'The cat ___ on the sofa.', options: ['sleep','sleeps','is sleeping','slept'], answer: 'is sleeping', explain: 'Now → is + -ing.', banglaExplain: 'এখন → is + -ing।' },
    { id: 'q14', prompt: 'I ___ dinner right now.', options: ['cook','cooks','am cooking','cooked'], answer: 'am cooking', explain: 'I + am + -ing.', banglaExplain: 'I + am + -ing।' },
    { id: 'q15', prompt: 'They ___ for the exam.', options: ['study','studies','are studying','studied'], answer: 'are studying', explain: 'They + are + -ing.', banglaExplain: 'They + are + -ing।' },
    { id: 'q16', prompt: 'Look! It ___ .', options: ['snow','snows','is snowing','snowed'], answer: 'is snowing', explain: 'Happening now.', banglaExplain: 'এখন ঘটছে।' },
    { id: 'q17', prompt: 'She ___ on the phone.', options: ['talk','talks','is talking','talked'], answer: 'is talking', explain: 'She + is + -ing.', banglaExplain: 'She + is + -ing।' },
    { id: 'q18', prompt: 'We ___ a movie tonight.', options: ['watch','watches','are watching','watched'], answer: 'are watching', explain: 'Fixed plan → continuous.', banglaExplain: 'নির্দিষ্ট পরিকল্পনা → continuous।' },
    { id: 'q19', prompt: 'He ___ his car.', options: ['wash','washes','is washing','washed'], answer: 'is washing', explain: 'He + is + -ing.', banglaExplain: 'He + is + -ing।' },
    { id: 'q20', prompt: 'The students ___ in the library.', options: ['read','reads','are reading','readed'], answer: 'are reading', explain: 'Plural + are + -ing.', banglaExplain: 'বহুবচন + are + -ing।' },
    { id: 'q21', prompt: 'I ___ to learn Spanish.', options: ['try','tries','am trying','tried'], answer: 'am trying', explain: 'I + am + -ing.', banglaExplain: 'I + am + -ing।' },
    { id: 'q22', prompt: 'My parents ___ in the garden.', options: ['work','works','are working','worked'], answer: 'are working', explain: 'Plural + are + -ing.', banglaExplain: 'বহুবচন + are + -ing।' },
    { id: 'q23', prompt: 'The phone ___ .', options: ['ring','rings','is ringing','rang'], answer: 'is ringing', explain: 'Happening now.', banglaExplain: 'এখন ঘটছে।' },
    { id: 'q24', prompt: 'She ___ a red dress today.', options: ['wear','wears','is wearing','wore'], answer: 'is wearing', explain: 'Temporary situation now.', banglaExplain: 'এখনকার সাময়িক অবস্থা।' },
  ]},
  t3: { name: 'Present Perfect', questions: [
    { id: 'q1', prompt: 'I ___ my homework already.', options: ['finish','finishes','have finished','finished'], answer: 'have finished', explain: 'I + have + past participle.', banglaExplain: 'I + have + past participle।' },
    { id: 'q2', prompt: 'She ___ here for ten years.', options: ['live','lives','has lived','lived'], answer: 'has lived', explain: 'Duration with "for" → present perfect.', banglaExplain: '"for" দিয়ে ব্যাপ্তি → present perfect।' },
    { id: 'q3', prompt: 'They ___ to Paris twice.', options: ['go','goes','have gone','went'], answer: 'have gone', explain: 'Experience up to now → present perfect.', banglaExplain: 'এখন পর্যন্ত অভিজ্ঞতা → present perfect।' },
    { id: 'q4', prompt: 'He ___ the door.', options: ['open','opens','has opened','opened'], answer: 'has opened', explain: 'Recent action with present relevance.', banglaExplain: 'সাম্প্রতিক কাজ, বর্তমানে প্রভাব।' },
    { id: 'q5', prompt: 'We ___ each other since 2010.', options: ['know','knows','have known','knew'], answer: 'have known', explain: '"Since" + starting point → present perfect.', banglaExplain: '"Since" + শুরুর সময় → present perfect।' },
    { id: 'q6', prompt: 'I have never ___ sushi.', options: ['eat','eats','eaten','ate'], answer: 'eaten', explain: 'Have + past participle of "eat".', banglaExplain: '"eat" এর past participle "eaten"।' },
    { id: 'q7', prompt: 'She has already ___ the film.', options: ['see','sees','seen','saw'], answer: 'seen', explain: 'Has + past participle of "see".', banglaExplain: '"see" এর past participle "seen"।' },
    { id: 'q8', prompt: 'They ___ the airport.', options: ['leave','leaves','have left','left'], answer: 'have left', explain: 'They + have + past participle.', banglaExplain: 'They + have + past participle।' },
    { id: 'q9', prompt: 'Have you ever ___ to London?', options: ['be','been','being','was'], answer: 'been', explain: 'Ever + present perfect + been.', banglaExplain: '"Ever" এর সাথে present perfect + been।' },
    { id: 'q10', prompt: 'He ___ his keys.', options: ['lose','loses','has lost','lost'], answer: 'has lost', explain: 'Result matters now.', banglaExplain: 'বর্তমানে ফলাফল গুরুত্বপূর্ণ।' },
    { id: 'q11', prompt: 'I ___ in this city since 2015.', options: ['live','lives','have lived','lived'], answer: 'have lived', explain: '"Since" → present perfect.', banglaExplain: '"Since" → present perfect।' },
    { id: 'q12', prompt: 'The train ___ already.', options: ['leave','leaves','has left','left'], answer: 'has left', explain: '"Already" → present perfect.', banglaExplain: '"Already" → present perfect।' },
    { id: 'q13', prompt: 'I ___ just ___ my lunch.', options: ['have / eat','has / eaten','have / eaten','have / ate'], answer: 'have / eaten', explain: 'Just → present perfect.', banglaExplain: '"Just" → present perfect।' },
    { id: 'q14', prompt: 'She ___ never ___ to Japan.', options: ['have / been','has / been','has / went','has / be'], answer: 'has / been', explain: 'She + has + past participle.', banglaExplain: 'She + has + past participle।' },
    { id: 'q15', prompt: 'We ___ already ___ the movie.', options: ['have / saw','have / seen','has / seen','have / see'], answer: 'have / seen', explain: 'We + have + seen.', banglaExplain: 'We + have + seen।' },
    { id: 'q16', prompt: 'He ___ not ___ his homework yet.', options: ['have / finished','has / finished','has / finish','has / finishing'], answer: 'has / finished', explain: 'Has not + past participle.', banglaExplain: 'Has not + past participle।' },
    { id: 'q17', prompt: 'They ___ been married for 20 years.', options: ['has','have','had','having'], answer: 'have', explain: 'They + have been.', banglaExplain: 'They + have been।' },
    { id: 'q18', prompt: 'I ___ known him since 2015.', options: ['have','has','had','having'], answer: 'have', explain: 'I + have known.', banglaExplain: 'I + have known।' },
    { id: 'q19', prompt: 'She ___ written three books.', options: ['have','has','had','having'], answer: 'has', explain: 'She + has written.', banglaExplain: 'She + has written।' },
    { id: 'q20', prompt: 'We ___ visited that museum twice.', options: ['have','has','had','having'], answer: 'have', explain: 'We + have visited.', banglaExplain: 'We + have visited।' },
    { id: 'q21', prompt: 'Have you ___ your keys?', options: ['find','finds','found','finding'], answer: 'found', explain: 'Have + found.', banglaExplain: 'Have + found।' },
    { id: 'q22', prompt: 'I ___ forgotten her name.', options: ['have','has','had','having'], answer: 'have', explain: 'I + have forgotten.', banglaExplain: 'I + have forgotten।' },
    { id: 'q23', prompt: 'He has just ___ home.', options: ['arrive','arrives','arrived','arriving'], answer: 'arrived', explain: 'Just + past participle.', banglaExplain: '"Just" + past participle।' },
    { id: 'q24', prompt: 'They have ___ the project.', options: ['complete','completes','completed','completing'], answer: 'completed', explain: 'Have + past participle.', banglaExplain: 'Have + past participle।' },
  ]},
  t4: { name: 'Past Simple', questions: [
    { id: 'q1', prompt: 'I ___ to Dhaka last week.', options: ['go','goes','went','going'], answer: 'went', explain: 'Past simple of "go".', banglaExplain: '"go" এর past form "went"।' },
    { id: 'q2', prompt: 'She ___ the letter yesterday.', options: ['write','writes','wrote','writing'], answer: 'wrote', explain: 'Past simple of "write".', banglaExplain: '"write" এর past form "wrote"।' },
    { id: 'q3', prompt: 'They ___ football last Sunday.', options: ['play','plays','played','playing'], answer: 'played', explain: 'Regular verb + -ed.', banglaExplain: 'নিয়মিত verb-এ -ed যোগ হয়।' },
    { id: 'q4', prompt: 'We ___ dinner at 8 PM yesterday.', options: ['have','has','had','having'], answer: 'had', explain: 'Past simple of "have".', banglaExplain: '"have" এর past form "had"।' },
    { id: 'q5', prompt: 'He ___ his homework last night.', options: ['do','does','did','doing'], answer: 'did', explain: 'Past simple of "do".', banglaExplain: '"do" এর past form "did"।' },
    { id: 'q6', prompt: 'She ___ me a gift.', options: ['give','gives','gave','giving'], answer: 'gave', explain: 'Past simple of "give".', banglaExplain: '"give" এর past form "gave"।' },
    { id: 'q7', prompt: 'The film ___ at 7 PM.', options: ['start','starts','started','starting'], answer: 'started', explain: 'Regular verb + -ed.', banglaExplain: 'নিয়মিত verb + -ed।' },
    { id: 'q8', prompt: 'We ___ the museum yesterday.', options: ['visit','visits','visited','visiting'], answer: 'visited', explain: 'Regular verb + -ed.', banglaExplain: 'নিয়মিত verb + -ed।' },
    { id: 'q9', prompt: 'He ___ to London in 2019.', options: ['move','moves','moved','moving'], answer: 'moved', explain: 'Regular past simple.', banglaExplain: 'নিয়মিত past simple।' },
    { id: 'q10', prompt: 'They ___ the news last night.', options: ['hear','hears','heard','hearing'], answer: 'heard', explain: 'Past simple of "hear".', banglaExplain: '"hear" এর past form "heard"।' },
    { id: 'q11', prompt: 'I ___ my keys this morning.', options: ['lose','loses','lost','losing'], answer: 'lost', explain: 'Past simple of "lose".', banglaExplain: '"lose" এর past form "lost"।' },
    { id: 'q12', prompt: 'She ___ an email to her boss.', options: ['send','sends','sent','sending'], answer: 'sent', explain: 'Past simple of "send".', banglaExplain: '"send" এর past form "sent"।' },
    { id: 'q13', prompt: 'I ___ a great film last night.', options: ['watch','watches','watched','watching'], answer: 'watched', explain: 'Regular verb + -ed.', banglaExplain: 'নিয়মিত verb + -ed।' },
    { id: 'q14', prompt: 'She ___ her grandmother last weekend.', options: ['visit','visits','visited','visiting'], answer: 'visited', explain: 'Regular past simple.', banglaExplain: 'নিয়মিত past simple।' },
    { id: 'q15', prompt: 'They ___ to the beach yesterday.', options: ['go','goes','went','going'], answer: 'went', explain: 'Past simple of "go".', banglaExplain: '"go" এর past form "went"।' },
    { id: 'q16', prompt: 'We ___ lunch at noon.', options: ['eat','eats','ate','eating'], answer: 'ate', explain: 'Past simple of "eat".', banglaExplain: '"eat" এর past form "ate"।' },
    { id: 'q17', prompt: 'He ___ the answer quickly.', options: ['know','knows','knew','knowing'], answer: 'knew', explain: 'Past simple of "know".', banglaExplain: '"know" এর past form "knew"।' },
    { id: 'q18', prompt: 'I ___ my keys yesterday.', options: ['find','finds','found','finding'], answer: 'found', explain: 'Past simple of "find".', banglaExplain: '"find" এর past form "found"।' },
    { id: 'q19', prompt: 'She ___ the exam easily.', options: ['pass','passes','passed','passing'], answer: 'passed', explain: 'Regular verb + -ed.', banglaExplain: 'নিয়মিত verb + -ed।' },
    { id: 'q20', prompt: 'The children ___ in the park.', options: ['play','plays','played','playing'], answer: 'played', explain: 'Regular past simple.', banglaExplain: 'নিয়মিত past simple।' },
    { id: 'q21', prompt: 'We ___ a new car last month.', options: ['buy','buys','bought','buying'], answer: 'bought', explain: 'Past simple of "buy".', banglaExplain: '"buy" এর past form "bought"।' },
    { id: 'q22', prompt: 'He ___ to school on foot.', options: ['walk','walks','walked','walking'], answer: 'walked', explain: 'Regular past simple.', banglaExplain: 'নিয়মিত past simple।' },
    { id: 'q23', prompt: 'I ___ a strange dream.', options: ['have','has','had','having'], answer: 'had', explain: 'Past simple of "have".', banglaExplain: '"have" এর past form "had"।' },
    { id: 'q24', prompt: 'They ___ the party at 10 PM.', options: ['leave','leaves','left','leaving'], answer: 'left', explain: 'Past simple of "leave".', banglaExplain: '"leave" এর past form "left"।' },
  ]},
  t5: { name: 'Past Continuous & Past Perfect', questions: [
    { id: 'q1', prompt: 'I ___ cooking when she called.', options: ['am','is','was','were'], answer: 'was', explain: 'I/He/She/It + was + -ing.', banglaExplain: 'I/he/she/it + was + -ing।' },
    { id: 'q2', prompt: 'They ___ playing when it rained.', options: ['was','were','am','is'], answer: 'were', explain: 'We/You/They + were + -ing.', banglaExplain: 'we/you/they + were + -ing।' },
    { id: 'q3', prompt: 'The train ___ before we arrived.', options: ['leave','leaves','had left','left'], answer: 'had left', explain: 'Earlier action → past perfect.', banglaExplain: 'আগের কাজ → past perfect।' },
    { id: 'q4', prompt: 'She ___ when the phone rang.', options: ['sleep','sleeps','was sleeping','slept'], answer: 'was sleeping', explain: 'Ongoing action interrupted.', banglaExplain: 'চলমান কাজ মাঝে বাধা পায়।' },
    { id: 'q5', prompt: 'He ___ the book before the exam.', options: ['read','reads','had read','reading'], answer: 'had read', explain: 'Earlier completed action.', banglaExplain: 'আগে সম্পন্ন কাজ।' },
    { id: 'q6', prompt: 'We ___ dinner when the lights went out.', options: ['have','has','were having','had'], answer: 'were having', explain: 'Past continuous with interruption.', banglaExplain: 'Past continuous with interruption।' },
    { id: 'q7', prompt: 'By the time we got there, the film ___.', options: ['start','starts','had started','has started'], answer: 'had started', explain: 'Past perfect for earlier action.', banglaExplain: 'আগের কাজের জন্য past perfect।' },
    { id: 'q8', prompt: 'They ___ TV when I came home.', options: ['watch','watches','were watching','watched'], answer: 'were watching', explain: 'Past continuous + simple past.', banglaExplain: 'Past continuous + simple past।' },
    { id: 'q9', prompt: 'I ___ reading when the bell rang.', options: ['am','was','were','is'], answer: 'was', explain: 'I + was + -ing.', banglaExplain: 'I + was + -ing।' },
    { id: 'q10', prompt: 'He ___ his keys before leaving.', options: ['lose','loses','had lost','lost'], answer: 'had lost', explain: 'Earlier completed action.', banglaExplain: 'আগে সম্পন্ন কাজ।' },
    { id: 'q11', prompt: 'It ___ raining when we woke up.', options: ['stop','stops','had stopped','has stopped'], answer: 'had stopped', explain: 'Past perfect — completed before another past action.', banglaExplain: 'Past perfect — অন্য কাজের আগে শেষ।' },
    { id: 'q12', prompt: 'She ___ when the alarm went off.', options: ['dance','dances','was dancing','danced'], answer: 'was dancing', explain: 'Past continuous interrupted.', banglaExplain: 'Past continuous মাঝে থামে।' },
    { id: 'q13', prompt: 'I ___ TV when the power went out.', options: ['watch','watches','was watching','watched'], answer: 'was watching', explain: 'Ongoing action interrupted.', banglaExplain: 'চলমান কাজ মাঝে থামে।' },
    { id: 'q14', prompt: 'They ___ when the teacher arrived.', options: ['talk','talks','were talking','talked'], answer: 'were talking', explain: 'Plural + were + -ing.', banglaExplain: 'বহুবচন + were + -ing।' },
    { id: 'q15', prompt: 'She ___ her homework when I called.', options: ['do','does','was doing','did'], answer: 'was doing', explain: 'She + was + -ing.', banglaExplain: 'She + was + -ing।' },
    { id: 'q16', prompt: 'The sun ___ when we woke up.', options: ['shine','shines','was shining','shone'], answer: 'was shining', explain: 'Ongoing past action.', banglaExplain: 'অতীতের চলমান কাজ।' },
    { id: 'q17', prompt: 'He ___ dinner when I got home.', options: ['cook','cooks','was cooking','cooked'], answer: 'was cooking', explain: 'He + was + -ing.', banglaExplain: 'He + was + -ing।' },
    { id: 'q18', prompt: 'We ___ in the park when it started raining.', options: ['walk','walks','were walking','walked'], answer: 'were walking', explain: 'We + were + -ing.', banglaExplain: 'We + were + -ing।' },
    { id: 'q19', prompt: 'By the time I arrived, they ___ .', options: ['leave','leaves','had left','left'], answer: 'had left', explain: 'Earlier action → past perfect.', banglaExplain: 'আগের কাজ → past perfect।' },
    { id: 'q20', prompt: 'She ___ before I could say anything.', options: ['go','goes','had gone','went'], answer: 'had gone', explain: 'Earlier action → past perfect.', banglaExplain: 'আগের কাজ → past perfect।' },
    { id: 'q21', prompt: 'They ___ the movie before we came.', options: ['watch','watches','had watched','watched'], answer: 'had watched', explain: 'Past perfect.', banglaExplain: 'Past perfect।' },
    { id: 'q22', prompt: 'I ___ dinner before she called.', options: ['finish','finishes','had finished','finished'], answer: 'had finished', explain: 'Earlier action → past perfect.', banglaExplain: 'আগের কাজ → past perfect।' },
    { id: 'q23', prompt: 'He ___ English before moving to London.', options: ['study','studies','had studied','studied'], answer: 'had studied', explain: 'Earlier action → past perfect.', banglaExplain: 'আগের কাজ → past perfect।' },
    { id: 'q24', prompt: 'The train ___ by the time we reached the station.', options: ['leave','leaves','had left','left'], answer: 'had left', explain: 'Past perfect for earlier action.', banglaExplain: 'আগের কাজ → past perfect।' },
  ]},
  t6: { name: 'Future Tenses', questions: [
    { id: 'q1', prompt: 'I ___ you tomorrow.', options: ['call','calls','will call','called'], answer: 'will call', explain: 'Future simple: will + base.', banglaExplain: 'Future simple: will + base।' },
    { id: 'q2', prompt: 'She ___ back next week.', options: ['come','comes','will come','came'], answer: 'will come', explain: 'Future simple.', banglaExplain: 'Future simple।' },
    { id: 'q3', prompt: 'They ___ the project by Friday.', options: ['finish','finishes','will finish','finished'], answer: 'will finish', explain: 'Future simple.', banglaExplain: 'Future simple।' },
    { id: 'q4', prompt: 'By next year, I ___ my degree.', options: ['finish','finishes','will have finished','finished'], answer: 'will have finished', explain: 'Future perfect: will have + past participle.', banglaExplain: 'Future perfect: will have + past participle।' },
    { id: 'q5', prompt: 'We ___ you at the airport.', options: ['meet','meets','will meet','met'], answer: 'will meet', explain: 'Future simple.', banglaExplain: 'Future simple।' },
    { id: 'q6', prompt: 'It ___ tomorrow.', options: ['rain','rains','will rain','rained'], answer: 'will rain', explain: 'Prediction → will.', banglaExplain: 'ভবিষ্যদ্বাণী → will।' },
    { id: 'q7', prompt: 'She ___ for London next Monday.', options: ['leave','leaves','will leave','left'], answer: 'will leave', explain: 'Future simple.', banglaExplain: 'Future simple।' },
    { id: 'q8', prompt: 'I think it ___ tonight.', options: ['rain','rains','will rain','rained'], answer: 'will rain', explain: 'Prediction with "think".', banglaExplain: '"think" সহ ভবিষ্যদ্বাণী।' },
    { id: 'q9', prompt: 'By 2030, they ___ the bridge.', options: ['build','builds','will have built','built'], answer: 'will have built', explain: 'Future perfect before a future point.', banglaExplain: 'ভবিষ্যতের নির্দিষ্ট সময়ের আগে শেষ → future perfect।' },
    { id: 'q10', prompt: 'We ___ dinner at 8.', options: ['have','has','will have','had'], answer: 'will have', explain: 'Future simple.', banglaExplain: 'Future simple।' },
    { id: 'q11', prompt: 'He ___ you the money back.', options: ['pay','pays','will pay','paid'], answer: 'will pay', explain: 'Promise → will.', banglaExplain: 'প্রতিশ্রুতি → will।' },
    { id: 'q12', prompt: 'They ___ married in June.', options: ['get','gets','will get','got'], answer: 'will get', explain: 'Future simple.', banglaExplain: 'Future simple।' },
    { id: 'q13', prompt: 'I ___ you tomorrow morning.', options: ['call','calls','will call','called'], answer: 'will call', explain: 'Future simple.', banglaExplain: 'Future simple।' },
    { id: 'q14', prompt: 'She ___ her exam next week.', options: ['take','takes','will take','took'], answer: 'will take', explain: 'Future simple.', banglaExplain: 'Future simple।' },
    { id: 'q15', prompt: 'They ___ us next month.', options: ['visit','visits','will visit','visited'], answer: 'will visit', explain: 'Future simple.', banglaExplain: 'Future simple।' },
    { id: 'q16', prompt: 'We ___ a party next Saturday.', options: ['have','has','will have','had'], answer: 'will have', explain: 'Future simple.', banglaExplain: 'Future simple।' },
    { id: 'q17', prompt: 'He ___ to the gym tomorrow.', options: ['go','goes','will go','went'], answer: 'will go', explain: 'Future simple.', banglaExplain: 'Future simple।' },
    { id: 'q18', prompt: 'I ___ the book by Friday.', options: ['finish','finishes','will finish','finished'], answer: 'will finish', explain: 'Future simple.', banglaExplain: 'Future simple।' },
    { id: 'q19', prompt: 'It ___ tomorrow, according to the forecast.', options: ['snow','snows','will snow','snowed'], answer: 'will snow', explain: 'Prediction → will.', banglaExplain: 'ভবিষ্যদ্বাণী → will।' },
    { id: 'q20', prompt: 'She ___ a doctor when she grows up.', options: ['be','is','will be','was'], answer: 'will be', explain: 'Future simple.', banglaExplain: 'Future simple।' },
    { id: 'q21', prompt: 'They ___ the results by next Monday.', options: ['announce','announces','will have announced','announced'], answer: 'will have announced', explain: 'Future perfect before a future point.', banglaExplain: 'ভবিষ্যতের নির্দিষ্ট সময়ের আগে শেষ → future perfect।' },
    { id: 'q22', prompt: 'By 2040, we ___ in this city for 30 years.', options: ['live','lives','will have lived','lived'], answer: 'will have lived', explain: 'Future perfect with duration.', banglaExplain: 'সময়ের ব্যাপ্তি → future perfect।' },
    { id: 'q23', prompt: 'I ___ you as soon as I arrive.', options: ['call','calls','will call','called'], answer: 'will call', explain: 'Future simple.', banglaExplain: 'Future simple।' },
    { id: 'q24', prompt: 'We ___ this project by next month.', options: ['complete','completes','will have completed','completed'], answer: 'will have completed', explain: 'Future perfect.', banglaExplain: 'Future perfect।' },
  ]},
  t7: { name: 'Articles', questions: [
    { id: 'q1', prompt: 'She is ___ honest student.', options: ['a','an','the','—'], answer: 'an', explain: 'Vowel sound → "an".', banglaExplain: 'Vowel sound → "an"।' },
    { id: 'q2', prompt: 'I saw ___ elephant at the zoo.', options: ['a','an','the','—'], answer: 'an', explain: 'Vowel sound → "an".', banglaExplain: 'Vowel sound → "an"।' },
    { id: 'q3', prompt: '___ Padma is the longest river.', options: ['A','An','The','—'], answer: 'The', explain: 'Rivers take "the".', banglaExplain: 'নদীর নামের আগে "the" বসে।' },
    { id: 'q4', prompt: 'He plays ___ cricket every weekend.', options: ['a','an','the','—'], answer: '—', explain: 'No article with sports.', banglaExplain: 'খেলার আগে article বসে না।' },
    { id: 'q5', prompt: 'I bought ___ umbrella yesterday.', options: ['a','an','the','—'], answer: 'an', explain: '"Umbrella" starts with vowel sound.', banglaExplain: '"Umbrella" vowel sound দিয়ে শুরু।' },
    { id: 'q6', prompt: 'He is ___ best student in the class.', options: ['a','an','the','—'], answer: 'the', explain: 'Superlatives take "the".', banglaExplain: 'Superlative এর আগে "the"।' },
    { id: 'q7', prompt: 'She is ___ doctor.', options: ['a','an','the','—'], answer: 'a', explain: 'Consonant sound → "a".', banglaExplain: 'Consonant sound → "a"।' },
    { id: 'q8', prompt: 'I saw ___ movie last night.', options: ['a','an','the','—'], answer: 'a', explain: 'First mention, consonant sound.', banglaExplain: 'প্রথম উল্লেখ, consonant sound।' },
    { id: 'q9', prompt: '___ book on the table is mine.', options: ['A','An','The','—'], answer: 'The', explain: 'Specific → "the".', banglaExplain: 'নির্দিষ্ট → "the"।' },
    { id: 'q10', prompt: 'She has ___ MBA.', options: ['a','an','the','—'], answer: 'an', explain: '"M" sounds like "em".', banglaExplain: '"M" এর উচ্চারণ "em" → "an"।' },
    { id: 'q11', prompt: '___ Sun rises in the east.', options: ['A','An','The','—'], answer: 'The', explain: 'Unique objects take "the".', banglaExplain: 'একক বস্তুর আগে "the"।' },
    { id: 'q12', prompt: 'He speaks ___ English fluently.', options: ['a','an','the','—'], answer: '—', explain: 'No article with languages.', banglaExplain: 'ভাষার আগে article বসে না।' },
    { id: 'q13', prompt: 'My brother is ___ engineer.', options: ['a','an','the','—'], answer: 'an', explain: 'Vowel sound → "an".', banglaExplain: 'Vowel sound → "an"।' },
    { id: 'q14', prompt: 'I like ___ music.', options: ['a','an','the','—'], answer: '—', explain: 'General → no article.', banglaExplain: 'সাধারণ → article নেই।' },
    { id: 'q15', prompt: '___ Himalayas are in Asia.', options: ['A','An','The','—'], answer: 'The', explain: 'Mountain ranges take "the".', banglaExplain: 'পর্বতমালার আগে "the"।' },
    { id: 'q16', prompt: 'She bought ___ new car.', options: ['a','an','the','—'], answer: 'a', explain: 'Consonant sound → "a".', banglaExplain: 'Consonant sound → "a"।' },
    { id: 'q17', prompt: 'I saw ___ interesting movie.', options: ['a','an','the','—'], answer: 'an', explain: 'Vowel sound → "an".', banglaExplain: 'Vowel sound → "an"।' },
    { id: 'q18', prompt: 'He is ___ tallest boy in the class.', options: ['a','an','the','—'], answer: 'the', explain: 'Superlative → "the".', banglaExplain: 'Superlative → "the"।' },
    { id: 'q19', prompt: '___ Nile is the longest river in Africa.', options: ['A','An','The','—'], answer: 'The', explain: 'Rivers take "the".', banglaExplain: 'নদীর আগে "the"।' },
    { id: 'q20', prompt: 'I need ___ hour to finish this.', options: ['a','an','the','—'], answer: 'an', explain: 'Silent "h" → vowel sound → "an".', banglaExplain: 'Silent "h" → vowel sound → "an"।' },
    { id: 'q21', prompt: 'She plays ___ piano beautifully.', options: ['a','an','the','—'], answer: 'the', explain: 'Musical instruments take "the".', banglaExplain: 'বাদ্যযন্ত্রের আগে "the"।' },
    { id: 'q22', prompt: '___ rich should help the poor.', options: ['A','An','The','—'], answer: 'The', explain: 'Adjective as a group → "the".', banglaExplain: 'Adjective দিয়ে গোষ্ঠী → "the"।' },
    { id: 'q23', prompt: 'Give me ___ pen, please.', options: ['a','an','the','—'], answer: 'a', explain: 'Consonant sound → "a".', banglaExplain: 'Consonant sound → "a"।' },
    { id: 'q24', prompt: 'He is ___ MBA graduate.', options: ['a','an','the','—'], answer: 'an', explain: '"M" sounds like "em" → "an".', banglaExplain: '"M" এর উচ্চারণ "em" → "an"।' },
    { id: 'q25', prompt: 'We visited ___ Taj Mahal.', options: ['a','an','the','—'], answer: 'the', explain: 'Monuments take "the".', banglaExplain: 'স্মৃতিস্তম্ভের আগে "the"।' },
    { id: 'q26', prompt: 'He goes to ___ school every day.', options: ['a','an','the','—'], answer: '—', explain: 'Institutions in general → no article.', banglaExplain: 'সাধারণভাবে প্রতিষ্ঠান → article নেই।' },
    { id: 'q27', prompt: '___ Alps are in Europe.', options: ['A','An','The','—'], answer: 'The', explain: 'Mountain ranges take "the".', banglaExplain: 'পর্বতমালার আগে "the"।' },
  ]},
  t8: { name: 'Prepositions', questions: [
    { id: 'q1', prompt: 'I will meet you ___ Friday.', options: ['in','on','at','by'], answer: 'on', explain: 'Days → "on".', banglaExplain: 'দিনের আগে "on"।' },
    { id: 'q2', prompt: 'The book is ___ the table.', options: ['in','on','at','under'], answer: 'on', explain: 'Surface → "on".', banglaExplain: 'পৃষ্ঠে → "on"।' },
    { id: 'q3', prompt: 'She arrived ___ 6 PM.', options: ['in','on','at','for'], answer: 'at', explain: 'Clock time → "at".', banglaExplain: 'ঘড়ির সময় → "at"।' },
    { id: 'q4', prompt: 'We live ___ Chattogram.', options: ['in','on','at','to'], answer: 'in', explain: 'Cities → "in".', banglaExplain: 'শহরের আগে "in"।' },
    { id: 'q5', prompt: 'He is good ___ mathematics.', options: ['in','on','at','for'], answer: 'at', explain: 'Fixed: good at.', banglaExplain: 'Fixed: good at।' },
    { id: 'q6', prompt: 'We waited ___ the bus for an hour.', options: ['on','for','to','at'], answer: 'for', explain: 'Fixed: wait for.', banglaExplain: 'Fixed: wait for।' },
    { id: 'q7', prompt: 'She is interested ___ art.', options: ['at','in','on','for'], answer: 'in', explain: 'Fixed: interested in.', banglaExplain: 'Fixed: interested in।' },
    { id: 'q8', prompt: 'He is afraid ___ dogs.', options: ['at','of','in','on'], answer: 'of', explain: 'Fixed: afraid of.', banglaExplain: 'Fixed: afraid of।' },
    { id: 'q9', prompt: 'I arrived ___ the airport at 5.', options: ['in','on','at','to'], answer: 'at', explain: 'Specific point → "at".', banglaExplain: 'নির্দিষ্ট বিন্দু → "at"।' },
    { id: 'q10', prompt: 'They depend ___ their parents.', options: ['on','in','at','for'], answer: 'on', explain: 'Fixed: depend on.', banglaExplain: 'Fixed: depend on।' },
    { id: 'q11', prompt: 'She listens ___ music every night.', options: ['at','to','in','on'], answer: 'to', explain: 'Fixed: listen to.', banglaExplain: 'Fixed: listen to।' },
    { id: 'q12', prompt: 'We will meet ___ the corner.', options: ['at','in','on','to'], answer: 'at', explain: 'Fixed: at the corner.', banglaExplain: 'Fixed: at the corner।' },
    { id: 'q13', prompt: 'He was born ___ 1990.', options: ['at','in','on','for'], answer: 'in', explain: 'Years → "in".', banglaExplain: 'বছরের আগে "in"।' },
    { id: 'q14', prompt: 'The pen is ___ the drawer.', options: ['in','on','at','to'], answer: 'in', explain: 'Enclosed space → "in".', banglaExplain: 'বদ্ধ স্থান → "in"।' },
    { id: 'q15', prompt: 'She walked ___ the bridge.', options: ['on','over','at','in'], answer: 'over', explain: 'Across a surface → "over".', banglaExplain: 'উপর দিয়ে অতিক্রম → "over"।' },
    { id: 'q16', prompt: 'I will see you ___ Monday morning.', options: ['in','on','at','by'], answer: 'on', explain: 'Specific day → "on".', banglaExplain: 'নির্দিষ্ট দিন → "on"।' },
    { id: 'q17', prompt: 'She was born ___ December.', options: ['in','on','at','by'], answer: 'in', explain: 'Months → "in".', banglaExplain: 'মাসের আগে "in"।' },
    { id: 'q18', prompt: 'The meeting is ___ 3 PM.', options: ['in','on','at','by'], answer: 'at', explain: 'Clock time → "at".', banglaExplain: 'ঘড়ির সময় → "at"।' },
    { id: 'q19', prompt: 'We walked ___ the river.', options: ['along','in','at','to'], answer: 'along', explain: '"Along" = beside a length.', banglaExplain: 'পাশ দিয়ে হাঁটা → "along"।' },
    { id: 'q20', prompt: 'He is married ___ my sister.', options: ['with','to','for','at'], answer: 'to', explain: 'Fixed: married to.', banglaExplain: 'Fixed: married to।' },
    { id: 'q21', prompt: 'I am angry ___ him.', options: ['on','with','at','in'], answer: 'with', explain: 'Fixed: angry with (a person).', banglaExplain: 'Fixed: angry with (ব্যক্তি)।' },
    { id: 'q22', prompt: 'She is famous ___ her cooking.', options: ['of','for','in','at'], answer: 'for', explain: 'Fixed: famous for.', banglaExplain: 'Fixed: famous for।' },
    { id: 'q23', prompt: 'We arrived ___ London at midnight.', options: ['at','in','on','to'], answer: 'in', explain: 'Cities → "in".', banglaExplain: 'শহরের আগে "in"।' },
    { id: 'q24', prompt: 'He is responsible ___ the project.', options: ['of','for','in','at'], answer: 'for', explain: 'Fixed: responsible for.', banglaExplain: 'Fixed: responsible for।' },
    { id: 'q25', prompt: 'She is different ___ her sister.', options: ['than','from','to','of'], answer: 'from', explain: 'Fixed: different from.', banglaExplain: 'Fixed: different from।' },
    { id: 'q26', prompt: 'I am tired ___ waiting.', options: ['of','from','with','at'], answer: 'of', explain: 'Fixed: tired of.', banglaExplain: 'Fixed: tired of।' },
    { id: 'q27', prompt: 'He apologized ___ being late.', options: ['of','for','to','at'], answer: 'for', explain: 'Fixed: apologize for.', banglaExplain: 'Fixed: apologize for।' },
  ]},
  t9: { name: 'Subject–Verb Agreement', questions: [
    { id: 'q1', prompt: 'Neither of the boys ___ ready.', options: ['is','are','were','have'], answer: 'is', explain: '"Neither of" → singular verb.', banglaExplain: '"Neither of" → singular verb।' },
    { id: 'q2', prompt: 'The team ___ playing well.', options: ['is','are','am','be'], answer: 'is', explain: 'Collective noun → singular.', banglaExplain: 'Collective noun → singular।' },
    { id: 'q3', prompt: 'My friends ___ coming.', options: ['is','are','was','has'], answer: 'are', explain: 'Plural → plural verb.', banglaExplain: 'বহুবচন → plural verb।' },
    { id: 'q4', prompt: 'Each of the students ___ a book.', options: ['have','has','are','were'], answer: 'has', explain: '"Each of" → singular.', banglaExplain: '"Each of" → singular।' },
    { id: 'q5', prompt: 'Bread and butter ___ my favourite.', options: ['is','are','were','have'], answer: 'is', explain: 'Single idea → singular.', banglaExplain: 'একক ধারণা → singular।' },
    { id: 'q6', prompt: 'Everyone ___ here.', options: ['is','are','were','have'], answer: 'is', explain: 'Indefinite pronouns → singular.', banglaExplain: 'Indefinite pronouns → singular।' },
    { id: 'q7', prompt: 'The news ___ good.', options: ['is','are','were','have'], answer: 'is', explain: '"News" is singular.', banglaExplain: '"News" singular।' },
    { id: 'q8', prompt: 'Mathematics ___ difficult.', options: ['is','are','were','have'], answer: 'is', explain: 'Subject names → singular.', banglaExplain: 'বিষয়ের নাম → singular।' },
    { id: 'q9', prompt: 'Either of the options ___ fine.', options: ['is','are','were','have'], answer: 'is', explain: '"Either of" → singular.', banglaExplain: '"Either of" → singular।' },
    { id: 'q10', prompt: 'My brother and I ___ going.', options: ['is','am','are','be'], answer: 'are', explain: 'Two subjects → plural.', banglaExplain: 'দুই subject → plural।' },
    { id: 'q11', prompt: 'The police ___ investigating.', options: ['is','are','am','be'], answer: 'are', explain: '"Police" takes plural.', banglaExplain: '"Police" plural নেয়।' },
    { id: 'q12', prompt: 'Ten dollars ___ a lot.', options: ['is','are','were','have'], answer: 'is', explain: 'Amounts → singular.', banglaExplain: 'পরিমাণ → singular।' },
    { id: 'q13', prompt: 'The committee ___ divided on the issue.', options: ['is','are','were','have'], answer: 'is', explain: 'Committee as one body → singular.', banglaExplain: 'Committee একক হিসাবে → singular।' },
    { id: 'q14', prompt: 'Each boy and each girl ___ given a prize.', options: ['was','were','are','have'], answer: 'was', explain: '"Each… and each…" → singular.', banglaExplain: '"Each… and each…" → singular।' },
    { id: 'q15', prompt: 'Fifty miles ___ a long distance.', options: ['is','are','were','have'], answer: 'is', explain: 'Measurement → singular.', banglaExplain: 'পরিমাপ → singular।' },
    { id: 'q16', prompt: 'The number of students ___ increasing.', options: ['is','are','were','have'], answer: 'is', explain: '"The number of" → singular.', banglaExplain: '"The number of" → singular।' },
    { id: 'q17', prompt: 'A number of students ___ absent.', options: ['is','are','were','has'], answer: 'are', explain: '"A number of" → plural.', banglaExplain: '"A number of" → plural।' },
    { id: 'q18', prompt: 'One of my friends ___ a doctor.', options: ['is','are','were','have'], answer: 'is', explain: '"One of" → singular.', banglaExplain: '"One of" → singular।' },
    { id: 'q19', prompt: 'Both of them ___ coming.', options: ['is','are','was','has'], answer: 'are', explain: '"Both of" → plural.', banglaExplain: '"Both of" → plural।' },
    { id: 'q20', prompt: 'Some of the water ___ spilled.', options: ['is','are','were','have'], answer: 'is', explain: '"Some of" + uncountable → singular.', banglaExplain: '"Some of" + uncountable → singular।' },
    { id: 'q21', prompt: 'All of the books ___ on the shelf.', options: ['is','are','was','has'], answer: 'are', explain: '"All of" + plural → plural.', banglaExplain: '"All of" + plural → plural।' },
    { id: 'q22', prompt: 'The teacher, along with the students, ___ present.', options: ['is','are','were','have'], answer: 'is', explain: '"Along with" doesn’t change the subject.', banglaExplain: '"Along with" subject পরিবর্তন করে না।' },
    { id: 'q23', prompt: 'Not only the teacher but also the students ___ excited.', options: ['is','are','was','has'], answer: 'are', explain: 'Verb agrees with the nearest subject.', banglaExplain: 'verb নিকটতম subject এর সাথে মিলে।' },
    { id: 'q24', prompt: 'Either John or his brothers ___ coming.', options: ['is','are','was','has'], answer: 'are', explain: 'Verb agrees with the nearest subject (brothers).', banglaExplain: 'verb নিকটতম subject (brothers) এর সাথে মিলে।' },
  ]},
  t10: { name: 'Conditionals', questions: [
    { id: 'q1', prompt: 'If it rains, I ___ stay home.', options: ['will','would','had','am'], answer: 'will', explain: 'First conditional: If + present, will.', banglaExplain: 'First conditional: If + present, will।' },
    { id: 'q2', prompt: 'If I ___ you, I would apologize.', options: ['am','was','were','be'], answer: 'were', explain: 'Second conditional uses "were".', banglaExplain: 'Second conditional এ "were"।' },
    { id: 'q3', prompt: 'If she had studied, she ___ passed.', options: ['would have','will have','would','has'], answer: 'would have', explain: 'Third conditional.', banglaExplain: 'Third conditional।' },
    { id: 'q4', prompt: 'If I had known, I ___ come earlier.', options: ['would','would have','will','had'], answer: 'would have', explain: 'Third conditional.', banglaExplain: 'Third conditional।' },
    { id: 'q5', prompt: 'If you heat ice, it ___.', options: ['melt','melts','melted','melting'], answer: 'melts', explain: 'Zero conditional — general truth.', banglaExplain: 'Zero conditional — সাধারণ সত্য।' },
    { id: 'q6', prompt: 'If he ___ hard, he will succeed.', options: ['work','works','worked','working'], answer: 'works', explain: 'First conditional: If + present simple.', banglaExplain: 'First conditional: If + present simple।' },
    { id: 'q7', prompt: 'If I ___ rich, I would travel.', options: ['am','was','were','be'], answer: 'were', explain: 'Second conditional.', banglaExplain: 'Second conditional।' },
    { id: 'q8', prompt: 'If she ___ earlier, she would have caught the train.', options: ['leave','leaves','left','had left'], answer: 'had left', explain: 'Third conditional if-clause uses past perfect.', banglaExplain: 'Third conditional if-clause এ past perfect।' },
    { id: 'q9', prompt: 'If it ___ tomorrow, we will cancel.', options: ['rain','rains','rained','raining'], answer: 'rains', explain: 'First conditional.', banglaExplain: 'First conditional।' },
    { id: 'q10', prompt: 'If I ___ a bird, I would fly.', options: ['am','was','were','be'], answer: 'were', explain: 'Second conditional.', banglaExplain: 'Second conditional।' },
    { id: 'q11', prompt: 'If you ___ me, I would have helped.', options: ['ask','asks','asked','had asked'], answer: 'had asked', explain: 'Third conditional if-clause.', banglaExplain: 'Third conditional if-clause।' },
    { id: 'q12', prompt: 'If he ___ the truth, he would tell us.', options: ['know','knows','knew','known'], answer: 'knew', explain: 'Second conditional uses past simple.', banglaExplain: 'Second conditional এ past simple।' },
    { id: 'q13', prompt: 'If you ___ hard, you will pass.', options: ['work','works','worked','working'], answer: 'work', explain: 'First conditional: If + present simple.', banglaExplain: 'First conditional: If + present simple।' },
    { id: 'q14', prompt: 'If she ___ earlier, she would have arrived on time.', options: ['leave','leaves','left','had left'], answer: 'had left', explain: 'Third conditional — past perfect.', banglaExplain: 'Third conditional — past perfect।' },
    { id: 'q15', prompt: 'If I ___ you, I would accept the offer.', options: ['am','was','were','be'], answer: 'were', explain: 'Second conditional uses "were".', banglaExplain: 'Second conditional এ "were"।' },
    { id: 'q16', prompt: 'If it ___ tomorrow, we will cancel the picnic.', options: ['rain','rains','rained','raining'], answer: 'rains', explain: 'First conditional.', banglaExplain: 'First conditional।' },
    { id: 'q17', prompt: 'If he ___ rich, he would buy a mansion.', options: ['is','was','were','be'], answer: 'were', explain: 'Second conditional.', banglaExplain: 'Second conditional।' },
    { id: 'q18', prompt: 'If you ___ ice, it melts.', options: ['heat','heats','heated','heating'], answer: 'heat', explain: 'Zero conditional.', banglaExplain: 'Zero conditional।' },
    { id: 'q19', prompt: 'If I ___ the answer, I would tell you.', options: ['know','knows','knew','known'], answer: 'knew', explain: 'Second conditional uses past simple.', banglaExplain: 'Second conditional এ past simple।' },
    { id: 'q20', prompt: 'If we ___ more time, we would have finished.', options: ['have','has','had','had had'], answer: 'had had', explain: 'Third conditional — past perfect.', banglaExplain: 'Third conditional — past perfect।' },
    { id: 'q21', prompt: 'If they ___ the truth, they would be angry.', options: ['know','knows','knew','known'], answer: 'knew', explain: 'Second conditional.', banglaExplain: 'Second conditional।' },
    { id: 'q22', prompt: 'If you ___ me, I will help you.', options: ['ask','asks','asked','asking'], answer: 'ask', explain: 'First conditional.', banglaExplain: 'First conditional।' },
    { id: 'q23', prompt: 'If she ___ the truth, she would have told us.', options: ['know','knows','knew','had known'], answer: 'had known', explain: 'Third conditional — past perfect.', banglaExplain: 'Third conditional — past perfect।' },
    { id: 'q24', prompt: 'If I ___ a millionaire, I would travel the world.', options: ['am','was','were','be'], answer: 'were', explain: 'Second conditional uses "were".', banglaExplain: 'Second conditional এ "were"।' },
  ]},
  t11: { name: 'Modals', questions: [
    { id: 'q1', prompt: 'You ___ see a doctor if the pain continues.', options: ['should','could','would','used to'], answer: 'should', explain: 'Advice → "should".', banglaExplain: 'পরামর্শ → "should"।' },
    { id: 'q2', prompt: 'She ___ speak three languages fluently.', options: ['can','should','must','may'], answer: 'can', explain: 'Ability → "can".', banglaExplain: 'সামর্থ্য → "can"।' },
    { id: 'q3', prompt: 'You ___ not smoke here — it is forbidden.', options: ['must','might','could','would'], answer: 'must', explain: 'Prohibition → "must not".', banglaExplain: 'নিষেধ → "must not"।' },
    { id: 'q4', prompt: 'She ___ be at home — her car is in the driveway.', options: ['must','can’t','shouldn’t','won’t'], answer: 'must', explain: 'Strong certainty → "must".', banglaExplain: 'দৃঢ় অনুমান → "must"।' },
    { id: 'q5', prompt: 'I ___ swim when I was five.', options: ['can','could','may','must'], answer: 'could', explain: 'Past ability → "could".', banglaExplain: 'অতীত সামর্থ্য → "could"।' },
    { id: 'q6', prompt: 'You ___ finish it by tomorrow.', options: ['must','can','might','would'], answer: 'must', explain: 'Strong obligation → "must".', banglaExplain: 'জোরালো বাধ্যবাধকতা → "must"।' },
    { id: 'q7', prompt: '___ you help me, please?', options: ['Could','Should','Must','May'], answer: 'Could', explain: 'Polite request → "Could".', banglaExplain: 'ভদ্র অনুরোধ → "Could"।' },
    { id: 'q8', prompt: 'She ___ be tired after the long trip.', options: ['might','must','can','should'], answer: 'might', explain: 'Possibility → "might".', banglaExplain: 'সম্ভাবনা → "might"।' },
    { id: 'q9', prompt: 'We ___ respect our elders.', options: ['should','could','would','might'], answer: 'should', explain: 'Advice → "should".', banglaExplain: 'পরামর্শ → "should"।' },
    { id: 'q10', prompt: 'He ___ not come yesterday.', options: ['could','can','must','will'], answer: 'could', explain: 'Past inability → "could not".', banglaExplain: 'অতীত অক্ষমতা → "could not"।' },
    { id: 'q11', prompt: 'You ___ take an umbrella — it looks like rain.', options: ['should','could','would','must not'], answer: 'should', explain: 'Advice → "should".', banglaExplain: 'পরামর্শ → "should"।' },
    { id: 'q12', prompt: '___ I borrow your pen?', options: ['May','Should','Must','Would'], answer: 'May', explain: 'Permission → "May".', banglaExplain: 'অনুমতি → "May"।' },
    { id: 'q13', prompt: 'You ___ smoke here — it’s a no-smoking zone.', options: ['mustn’t','needn’t','couldn’t','wouldn’t'], answer: 'mustn’t', explain: 'Prohibition → "mustn’t".', banglaExplain: 'নিষেধ → "mustn’t"।' },
    { id: 'q14', prompt: 'She ___ already ___ left.', options: ['may / have','may / has','can / have','must / has'], answer: 'may / have', explain: 'Modal perfect: may have + past participle.', banglaExplain: 'Modal perfect: may have + past participle।' },
    { id: 'q15', prompt: 'He ___ swim when he was five.', options: ['can','could','may','must'], answer: 'could', explain: 'Past ability → "could".', banglaExplain: 'অতীত সামর্থ্য → "could"।' },
    { id: 'q16', prompt: 'We ___ finish this by tomorrow.', options: ['must','can','might','would'], answer: 'must', explain: 'Strong obligation.', banglaExplain: 'জোরালো বাধ্যবাধকতা।' },
    { id: 'q17', prompt: '___ you pass me the salt?', options: ['Could','Should','Must','Would'], answer: 'Could', explain: 'Polite request.', banglaExplain: 'ভদ্র অনুরোধ।' },
    { id: 'q18', prompt: 'You ___ take an umbrella — it might rain.', options: ['should','must not','can’t','needn’t'], answer: 'should', explain: 'Advice → "should".', banglaExplain: 'পরামর্শ → "should"।' },
    { id: 'q19', prompt: 'She ___ be at home — the lights are off.', options: ['can’t','must','should','may'], answer: 'can’t', explain: 'Impossibility → "can’t".', banglaExplain: 'অসম্ভাবনা → "can’t"।' },
    { id: 'q20', prompt: 'They ___ arrive at any moment.', options: ['might','must','shouldn’t','can’t'], answer: 'might', explain: 'Possibility → "might".', banglaExplain: 'সম্ভাবনা → "might"।' },
    { id: 'q21', prompt: 'You ___ pay attention in class.', options: ['should','could','would','might'], answer: 'should', explain: 'Advice → "should".', banglaExplain: 'পরামর্শ → "should"।' },
    { id: 'q22', prompt: '___ I use your phone?', options: ['May','Should','Must','Would'], answer: 'May', explain: 'Permission → "May".', banglaExplain: 'অনুমতি → "May"।' },
    { id: 'q23', prompt: 'He ___ have missed the train.', options: ['might','must','should','can'], answer: 'might', explain: 'Weak possibility in the past.', banglaExplain: 'অতীতে দুর্বল সম্ভাবনা।' },
    { id: 'q24', prompt: 'I ___ rather stay home tonight.', options: ['would','should','must','could'], answer: 'would', explain: '"Would rather" = preference.', banglaExplain: '"Would rather" = পছন্দ।' },
  ]},
  t12: { name: 'Voice (Active & Passive)', questions: [
    { id: 'q1', prompt: 'Passive of: "Rina writes a letter."', options: ['A letter is written by Rina.','A letter was written by Rina.','A letter has written by Rina.','A letter is writing by Rina.'], answer: 'A letter is written by Rina.', explain: 'Present simple passive: is/am/are + past participle.', banglaExplain: 'Present simple passive: is/am/are + past participle।' },
    { id: 'q2', prompt: 'Passive of: "They built the bridge."', options: ['The bridge is built.','The bridge was built.','The bridge has built.','The bridge was building.'], answer: 'The bridge was built.', explain: 'Past simple passive: was/were + past participle.', banglaExplain: 'Past simple passive: was/were + past participle।' },
    { id: 'q3', prompt: 'Passive of: "He will finish the work."', options: ['The work will be finished.','The work will finished.','The work would be finished.','The work is finished.'], answer: 'The work will be finished.', explain: 'Future passive: will be + past participle.', banglaExplain: 'Future passive: will be + past participle।' },
    { id: 'q4', prompt: 'Passive of: "She has eaten the cake."', options: ['The cake has been eaten.','The cake has eaten.','The cake was eaten.','The cake is eaten.'], answer: 'The cake has been eaten.', explain: 'Present perfect passive: has/have been + past participle.', banglaExplain: 'Present perfect passive: has/have been + past participle।' },
    { id: 'q5', prompt: 'Passive of: "Someone stole my bag."', options: ['My bag was stolen.','My bag is stolen.','My bag has stolen.','My bag was stealing.'], answer: 'My bag was stolen.', explain: 'Past simple passive.', banglaExplain: 'Past simple passive।' },
    { id: 'q6', prompt: 'Passive of: "They are painting the house."', options: ['The house is being painted.','The house is painted.','The house was painted.','The house has painted.'], answer: 'The house is being painted.', explain: 'Present continuous passive: is/am/are being + past participle.', banglaExplain: 'Present continuous passive।' },
    { id: 'q7', prompt: 'Passive of: "He can solve the problem."', options: ['The problem can be solved.','The problem can solve.','The problem was solved.','The problem is solved.'], answer: 'The problem can be solved.', explain: 'Modal passive: modal + be + past participle.', banglaExplain: 'Modal passive: modal + be + past participle।' },
    { id: 'q8', prompt: 'Passive of: "They will announce the results."', options: ['The results will be announced.','The results will announce.','The results are announced.','The results were announced.'], answer: 'The results will be announced.', explain: 'Future passive.', banglaExplain: 'Future passive।' },
    { id: 'q9', prompt: 'Passive of: "She made the cake."', options: ['The cake was made by her.','The cake was made.','The cake is made.','The cake has made.'], answer: 'The cake was made by her.', explain: 'Past simple passive with agent.', banglaExplain: 'Past simple passive with agent।' },
    { id: 'q10', prompt: 'Passive of: "People speak English worldwide."', options: ['English is spoken worldwide.','English is speaking worldwide.','English was spoken worldwide.','English has spoken worldwide.'], answer: 'English is spoken worldwide.', explain: 'Present simple passive.', banglaExplain: 'Present simple passive।' },
    { id: 'q11', prompt: 'Passive of: "She teaches English."', options: ['English is taught by her.','English is teaching by her.','English was taught by her.','English has taught by her.'], answer: 'English is taught by her.', explain: 'Present simple passive with irregular past participle.', banglaExplain: 'Present simple passive, irregular past participle সহ।' },
    { id: 'q12', prompt: 'Passive of: "They will build a new school."', options: ['A new school will be built.','A new school will build.','A new school is built.','A new school was built.'], answer: 'A new school will be built.', explain: 'Future passive: will be + past participle.', banglaExplain: 'Future passive: will be + past participle।' },
    { id: 'q13', prompt: 'Passive of: "He wrote the letter."', options: ['The letter was written by him.','The letter is written by him.','The letter has written by him.','The letter was writing by him.'], answer: 'The letter was written by him.', explain: 'Past simple passive.', banglaExplain: 'Past simple passive।' },
    { id: 'q14', prompt: 'Passive of: "They have completed the work."', options: ['The work has been completed.','The work has completed.','The work was completed.','The work is completed.'], answer: 'The work has been completed.', explain: 'Present perfect passive.', banglaExplain: 'Present perfect passive।' },
    { id: 'q15', prompt: 'Passive of: "Someone is cleaning the room."', options: ['The room is being cleaned.','The room is cleaned.','The room was cleaned.','The room has cleaned.'], answer: 'The room is being cleaned.', explain: 'Present continuous passive.', banglaExplain: 'Present continuous passive।' },
    { id: 'q16', prompt: 'Passive of: "She can fix the car."', options: ['The car can be fixed by her.','The car can fix by her.','The car is fixed by her.','The car was fixed by her.'], answer: 'The car can be fixed by her.', explain: 'Modal passive: modal + be + past participle.', banglaExplain: 'Modal passive: modal + be + past participle।' },
    { id: 'q17', prompt: 'Passive of: "They must obey the rules."', options: ['The rules must be obeyed.','The rules must obey.','The rules are obeyed.','The rules were obeyed.'], answer: 'The rules must be obeyed.', explain: 'Modal passive.', banglaExplain: 'Modal passive।' },
    { id: 'q18', prompt: 'Passive of: "People are watching the match."', options: ['The match is being watched.','The match is watched.','The match was watched.','The match has watched.'], answer: 'The match is being watched.', explain: 'Present continuous passive.', banglaExplain: 'Present continuous passive।' },
    { id: 'q19', prompt: 'Passive of: "The chef cooked the meal."', options: ['The meal was cooked by the chef.','The meal is cooked by the chef.','The meal has cooked by the chef.','The meal was cooking by the chef.'], answer: 'The meal was cooked by the chef.', explain: 'Past simple passive.', banglaExplain: 'Past simple passive।' },
    { id: 'q20', prompt: 'Passive of: "They will cancel the event."', options: ['The event will be cancelled.','The event will cancel.','The event is cancelled.','The event was cancelled.'], answer: 'The event will be cancelled.', explain: 'Future passive.', banglaExplain: 'Future passive।' },
    { id: 'q21', prompt: 'Passive of: "He has written the report."', options: ['The report has been written.','The report has written.','The report was written.','The report is written.'], answer: 'The report has been written.', explain: 'Present perfect passive.', banglaExplain: 'Present perfect passive।' },
    { id: 'q22', prompt: 'Passive of: "She was helping the children."', options: ['The children were being helped by her.','The children were helped by her.','The children are being helped by her.','The children have been helped by her.'], answer: 'The children were being helped by her.', explain: 'Past continuous passive: was/were being + past participle.', banglaExplain: 'Past continuous passive।' },
  ]},
  t13: { name: 'Narration (Direct & Indirect)', questions: [
    { id: 'q1', prompt: 'Indirect: He said, "I am tired."', options: ['He said that he was tired.','He said that I am tired.','He said that he is tired.','He says he was tired.'], answer: 'He said that he was tired.', explain: 'Present → past in indirect speech.', banglaExplain: 'Indirect speech এ present → past।' },
    { id: 'q2', prompt: 'Indirect: She said, "I will come tomorrow."', options: ['She said that she would come the next day.','She said that she will come tomorrow.','She said she came tomorrow.','She said she would come tomorrow.'], answer: 'She said that she would come the next day.', explain: 'Will → would; tomorrow → the next day.', banglaExplain: 'Will → would; tomorrow → the next day।' },
    { id: 'q3', prompt: 'Indirect: He said, "Where do you live?"', options: ['He asked where I lived.','He asked where do I live.','He said where I live.','He asked where did I live.'], answer: 'He asked where I lived.', explain: 'Wh-questions become statements.', banglaExplain: 'Wh-প্রশ্ন statement এ পরিণত হয়।' },
    { id: 'q4', prompt: 'Indirect: She said, "I like tea."', options: ['She said that she liked tea.','She said that she likes tea.','She said that I like tea.','She says she liked tea.'], answer: 'She said that she liked tea.', explain: 'Present → past.', banglaExplain: 'Present → past।' },
    { id: 'q5', prompt: 'Indirect: He said, "I am going home."', options: ['He said that he was going home.','He said that he is going home.','He said that I am going home.','He said he goes home.'], answer: 'He said that he was going home.', explain: 'Present continuous → past continuous.', banglaExplain: 'Present continuous → past continuous।' },
    { id: 'q6', prompt: 'Indirect: She said, "Did you see him?"', options: ['She asked if I had seen him.','She asked if I saw him.','She asked did I see him.','She said if I had seen him.'], answer: 'She asked if I had seen him.', explain: 'Yes/no questions → if/whether + statement.', banglaExplain: 'Yes/no প্রশ্ন → if/whether + statement।' },
    { id: 'q7', prompt: 'Indirect: He said, "I will help you."', options: ['He said that he would help me.','He said that he will help me.','He said that he helps me.','He says he will help me.'], answer: 'He said that he would help me.', explain: 'Will → would; you → me.', banglaExplain: 'Will → would; you → me।' },
    { id: 'q8', prompt: 'Indirect: She said, "I have finished."', options: ['She said that she had finished.','She said that she has finished.','She said that she finishes.','She says she finished.'], answer: 'She said that she had finished.', explain: 'Present perfect → past perfect.', banglaExplain: 'Present perfect → past perfect।' },
    { id: 'q9', prompt: 'Indirect: He said, "Can you help me?"', options: ['He asked if I could help him.','He asked can I help him.','He asked if I can help him.','He said if I could help him.'], answer: 'He asked if I could help him.', explain: 'Can → could; you → I; me → him.', banglaExplain: 'Can → could; you → I; me → him।' },
    { id: 'q10', prompt: 'Indirect: She said, "I am busy now."', options: ['She said that she was busy then.','She said that she is busy now.','She said that she was busy now.','She said that I was busy then.'], answer: 'She said that she was busy then.', explain: 'Now → then.', banglaExplain: 'Now → then।' },
    { id: 'q11', prompt: 'Indirect: "I am reading," he said.', options: ['He said that he was reading.','He said that he is reading.','He said that I was reading.','He says he is reading.'], answer: 'He said that he was reading.', explain: 'Present continuous → past continuous.', banglaExplain: 'Present continuous → past continuous।' },
    { id: 'q12', prompt: 'Indirect: "I will come," she said.', options: ['She said she would come.','She said she will come.','She said she came.','She says she would come.'], answer: 'She said she would come.', explain: 'Will → would.', banglaExplain: 'Will → would।' },
    { id: 'q13', prompt: 'Indirect: "I went to the market," he said.', options: ['He said he had gone to the market.','He said he went to the market.','He said he goes to the market.','He says he went to the market.'], answer: 'He said he had gone to the market.', explain: 'Past simple → past perfect.', banglaExplain: 'Past simple → past perfect।' },
    { id: 'q14', prompt: 'Indirect: "Can you help me?" she asked.', options: ['She asked if I could help her.','She asked if I can help her.','She asked can I help her.','She said if I could help her.'], answer: 'She asked if I could help her.', explain: 'Can → could; you → I; me → her.', banglaExplain: 'Can → could; you → I; me → her।' },
    { id: 'q15', prompt: 'Indirect: "Where is the station?" he asked.', options: ['He asked where the station was.','He asked where is the station.','He asked where the station is.','He said where the station was.'], answer: 'He asked where the station was.', explain: 'Reported question uses statement order and past tense.', banglaExplain: 'Reported question এ statement order ও past tense।' },
    { id: 'q16', prompt: 'Indirect: "I have finished," she said.', options: ['She said she had finished.','She said she has finished.','She said she finished.','She said she finishes.'], answer: 'She said she had finished.', explain: 'Present perfect → past perfect.', banglaExplain: 'Present perfect → past perfect।' },
    { id: 'q17', prompt: 'Indirect: "I saw him yesterday," he said.', options: ['He said he had seen him the day before.','He said he saw him yesterday.','He said he had seen him yesterday.','He says he saw him yesterday.'], answer: 'He said he had seen him the day before.', explain: 'Past simple → past perfect; yesterday → the day before.', banglaExplain: 'Past simple → past perfect; yesterday → the day before।' },
    { id: 'q18', prompt: 'Indirect: "We are going to the beach tomorrow," they said.', options: ['They said they were going to the beach the next day.','They said they are going to the beach tomorrow.','They said they were going to the beach tomorrow.','They say they are going to the beach tomorrow.'], answer: 'They said they were going to the beach the next day.', explain: 'Present continuous → past continuous; tomorrow → the next day.', banglaExplain: 'Present continuous → past continuous; tomorrow → the next day।' },
    { id: 'q19', prompt: 'Indirect: "I love you," he said.', options: ['He said he loved her.','He said he loves her.','He said I loved her.','He said he loved you.'], answer: 'He said he loved her.', explain: 'Present → past; pronoun change.', banglaExplain: 'Present → past; pronoun পরিবর্তন।' },
    { id: 'q20', prompt: 'Indirect: "Please help me," she said.', options: ['She asked me to help her.','She said please help me.','She asked me help her.','She said to help her.'], answer: 'She asked me to help her.', explain: 'Imperatives → asked + to + verb.', banglaExplain: 'Imperative → asked + to + verb।' },
    { id: 'q21', prompt: 'Indirect: "Do not touch the wires," he said.', options: ['He told us not to touch the wires.','He said do not touch the wires.','He told us to not touch the wires.','He said us not to touch the wires.'], answer: 'He told us not to touch the wires.', explain: 'Negative imperative → told + not to + verb.', banglaExplain: 'Negative imperative → told + not to + verb।' },
    { id: 'q22', prompt: 'Indirect: "I will call you tomorrow," she said.', options: ['She said she would call me the next day.','She said she will call me tomorrow.','She said she would call me tomorrow.','She says she will call me tomorrow.'], answer: 'She said she would call me the next day.', explain: 'Will → would; tomorrow → the next day.', banglaExplain: 'Will → would; tomorrow → the next day।' },
  ]},
  t14: { name: 'Nouns & Pronouns', questions: [
    { id: 'q1', prompt: 'The news ___ good.', options: ['is','are','were','have'], answer: 'is', explain: '"News" is singular.', banglaExplain: '"News" singular।' },
    { id: 'q2', prompt: 'I need ___ information.', options: ['a','an','some','many'], answer: 'some', explain: 'Uncountable noun → "some".', banglaExplain: 'Uncountable noun → "some"।' },
    { id: 'q3', prompt: 'She gave me ___ advice.', options: ['a','an','some','many'], answer: 'some', explain: 'Uncountable → "some".', banglaExplain: 'Uncountable → "some"।' },
    { id: 'q4', prompt: 'Each student must bring ___ book.', options: ['his or her','their','its','his'], answer: 'his or her', explain: 'Singular antecedent → singular pronoun.', banglaExplain: 'একবচন antecedent → একবচন pronoun।' },
    { id: 'q5', prompt: 'I saw ___ in the mirror.', options: ['myself','me','I','my'], answer: 'myself', explain: 'Reflexive pronoun.', banglaExplain: 'Reflexive pronoun।' },
    { id: 'q6', prompt: 'She did it ___.', options: ['herself','her','hers','she'], answer: 'herself', explain: 'Reflexive.', banglaExplain: 'Reflexive।' },
    { id: 'q7', prompt: 'They blamed ___ for the mistake.', options: ['themselves','them','their','theirs'], answer: 'themselves', explain: 'Reflexive.', banglaExplain: 'Reflexive।' },
    { id: 'q8', prompt: 'This is ___ book.', options: ['mine','me','my','I'], answer: 'my', explain: 'Possessive adjective before a noun.', banglaExplain: 'Noun এর আগে possessive adjective।' },
    { id: 'q9', prompt: '___ is my friend.', options: ['He','Him','His','He’s'], answer: 'He', explain: 'Subject pronoun.', banglaExplain: 'Subject pronoun।' },
    { id: 'q10', prompt: 'Give it to ___.', options: ['me','I','my','mine'], answer: 'me', explain: 'Object pronoun after preposition.', banglaExplain: 'Preposition এর পরে object pronoun।' },
    { id: 'q11', prompt: 'The children ___ playing.', options: ['is','are','were','has'], answer: 'are', explain: 'Plural noun → plural verb.', banglaExplain: 'বহুবচন noun → plural verb।' },
    { id: 'q12', prompt: 'I bought ___ furniture.', options: ['a','an','some','many'], answer: 'some', explain: 'Uncountable → "some".', banglaExplain: 'Uncountable → "some"।' },
    { id: 'q13', prompt: '___ students passed the exam.', options: ['Much','Many','A little','Any'], answer: 'Many', explain: 'Countable plural → "many".', banglaExplain: 'গণনাযোগ্য plural → "many"।' },
    { id: 'q14', prompt: 'I have ___ money in my wallet.', options: ['some','many','a few','few'], answer: 'some', explain: 'Uncountable → "some".', banglaExplain: 'Uncountable → "some"।' },
    { id: 'q15', prompt: '___ is knocking at the door.', options: ['Someone','Anyone','Everyone','No one'], answer: 'Someone', explain: 'Unknown person → "someone".', banglaExplain: 'অজানা ব্যক্তি → "someone"।' },
    { id: 'q16', prompt: 'There isn’t ___ milk in the fridge.', options: ['some','any','many','a few'], answer: 'any', explain: 'Negative → "any".', banglaExplain: 'নেতিবাচক → "any"।' },
    { id: 'q17', prompt: '___ of the two answers is correct.', options: ['Neither','Either','Both','Each'], answer: 'Neither', explain: '"Neither" = not one of the two.', banglaExplain: '"Neither" = দুটোর কোনোটিই নয়।' },
    { id: 'q18', prompt: 'I bought ___ oranges from the market.', options: ['a little','a few','much','any'], answer: 'a few', explain: 'Countable plural → "a few".', banglaExplain: 'Countable plural → "a few"।' },
    { id: 'q19', prompt: 'She has ___ friends in this city.', options: ['much','many','a little','any'], answer: 'many', explain: 'Countable plural → "many".', banglaExplain: 'Countable plural → "many"।' },
    { id: 'q20', prompt: 'We had ___ fun at the party.', options: ['many','a lot of','few','any'], answer: 'a lot of', explain: 'Uncountable → "a lot of".', banglaExplain: 'Uncountable → "a lot of"।' },
    { id: 'q21', prompt: '___ wants to be happy.', options: ['Everyone','Anyone','Someone','No one'], answer: 'Everyone', explain: 'Universal → "everyone".', banglaExplain: 'সর্বজনীন → "everyone"।' },
    { id: 'q22', prompt: 'She gave the book to ___.', options: ['I','me','my','mine'], answer: 'me', explain: 'Object pronoun after preposition.', banglaExplain: 'Preposition এর পরে object pronoun।' },
    { id: 'q23', prompt: 'This is ___ own house.', options: ['me','my','mine','myself'], answer: 'my', explain: 'Possessive adjective before noun.', banglaExplain: 'Noun এর আগে possessive adjective।' },
    { id: 'q24', prompt: 'The students hurt ___.', options: ['themselves','them','their','theirs'], answer: 'themselves', explain: 'Reflexive.', banglaExplain: 'Reflexive।' },
  ]},
  t15: { name: 'Adjectives & Adverbs', questions: [
    { id: 'q1', prompt: 'This is ___ than that.', options: ['better','good','more better','best'], answer: 'better', explain: 'Comparative of "good".', banglaExplain: '"good" এর comparative "better"।' },
    { id: 'q2', prompt: 'She is the ___ talented.', options: ['most','more','many','much'], answer: 'most', explain: 'Long adjectives → most.', banglaExplain: 'লম্বা শব্দে "most"।' },
    { id: 'q3', prompt: 'He runs ___.', options: ['fast','fastly','faster','fastest'], answer: 'fast', explain: '"Fast" is both adjective and adverb.', banglaExplain: '"Fast" adjective ও adverb।' },
    { id: 'q4', prompt: 'She sings ___.', options: ['beautiful','beautifully','beauty','beautify'], answer: 'beautifully', explain: 'Adverb ending in -ly.', banglaExplain: '-ly যুক্ত adverb।' },
    { id: 'q5', prompt: 'This is ___ book I have ever read.', options: ['the best','a best','best','better'], answer: 'the best', explain: 'Superlative with "the".', banglaExplain: 'Superlative এর আগে "the"।' },
    { id: 'q6', prompt: 'He is ___ than his brother.', options: ['taller','tallest','tall','more tall'], answer: 'taller', explain: 'Comparative -er.', banglaExplain: 'Comparative -er।' },
    { id: 'q7', prompt: 'She works ___.', options: ['hard','hardly','harder','hardest'], answer: 'hard', explain: '"Hard" is an adverb here.', banglaExplain: '"Hard" এখানে adverb।' },
    { id: 'q8', prompt: 'It was a ___ day.', options: ['beautiful','beautifully','beauty','beautify'], answer: 'beautiful', explain: 'Adjective describes noun.', banglaExplain: 'Adjective noun বর্ণনা করে।' },
    { id: 'q9', prompt: 'This is ___ better.', options: ['more','most','much','many'], answer: 'much', explain: '"Much" intensifies comparatives.', banglaExplain: 'Comparative কে জোর দেয় "much"।' },
    { id: 'q10', prompt: 'He speaks English ___.', options: ['good','well','better','best'], answer: 'well', explain: 'Adverb form of "good".', banglaExplain: '"good" এর adverb "well"।' },
    { id: 'q11', prompt: 'This is the ___ film I have ever seen.', options: ['better','best','good','more good'], answer: 'best', explain: 'Superlative of "good".', banglaExplain: '"good" এর superlative "best"।' },
    { id: 'q12', prompt: 'She runs ___ than her brother.', options: ['fast','faster','fastest','more fast'], answer: 'faster', explain: 'Comparative -er.', banglaExplain: 'Comparative -er।' },
    { id: 'q13', prompt: 'He is the ___ player in the team.', options: ['better','best','good','more good'], answer: 'best', explain: 'Superlative.', banglaExplain: 'Superlative।' },
    { id: 'q14', prompt: 'This is the ___ book on the shelf.', options: ['thicker','thickest','thick','more thick'], answer: 'thickest', explain: 'Superlative -est.', banglaExplain: 'Superlative -est।' },
    { id: 'q15', prompt: 'She speaks English ___.', options: ['fluent','fluently','fluency','fluentness'], answer: 'fluently', explain: 'Adverb ending in -ly.', banglaExplain: '-ly যুক্ত adverb।' },
    { id: 'q16', prompt: 'He walks ___ than me.', options: ['slow','slowly','more slowly','slowest'], answer: 'more slowly', explain: 'Comparative of adverb.', banglaExplain: 'Adverb এর comparative।' },
    { id: 'q17', prompt: 'This problem is ___ than that one.', options: ['easy','easier','easiest','more easy'], answer: 'easier', explain: 'Comparative -ier.', banglaExplain: 'Comparative -ier।' },
    { id: 'q18', prompt: 'He drives ___.', options: ['careful','carefully','carefuly','carefulness'], answer: 'carefully', explain: 'Adverb ending in -ly.', banglaExplain: '-ly যুক্ত adverb।' },
    { id: 'q19', prompt: 'It was the ___ day of my life.', options: ['happy','happier','happiest','more happy'], answer: 'happiest', explain: 'Superlative -est.', banglaExplain: 'Superlative -est।' },
    { id: 'q20', prompt: 'She is ___ older than me.', options: ['more','much','most','many'], answer: 'much', explain: '"Much" intensifies comparatives.', banglaExplain: 'Comparative কে জোর দেয় "much"।' },
    { id: 'q21', prompt: 'He is ___ than his sister.', options: ['tall','taller','tallest','more tall'], answer: 'taller', explain: 'Comparative -er.', banglaExplain: 'Comparative -er।' },
    { id: 'q22', prompt: 'The weather today is ___ than yesterday.', options: ['bad','worse','worst','more bad'], answer: 'worse', explain: 'Comparative of "bad".', banglaExplain: '"bad" এর comparative "worse"।' },
  ]},
  t16: { name: 'Clauses & Conjunctions', questions: [
    { id: 'q1', prompt: 'I stayed home ___ it was raining.', options: ['because','although','but','so'], answer: 'because', explain: 'Cause → "because".', banglaExplain: 'কারণ → "because"।' },
    { id: 'q2', prompt: '___ it was raining, we went out.', options: ['Although','Because','But','So'], answer: 'Although', explain: 'Contrast → "Although".', banglaExplain: 'বৈপরীত্য → "Although"।' },
    { id: 'q3', prompt: 'She is smart ___ lazy.', options: ['but','and','or','because'], answer: 'but', explain: 'Contrast → "but".', banglaExplain: 'বৈপরীত্য → "but"।' },
    { id: 'q4', prompt: 'Do you want tea ___ coffee?', options: ['or','and','but','so'], answer: 'or', explain: 'Choice → "or".', banglaExplain: 'বিকল্প → "or"।' },
    { id: 'q5', prompt: 'He is tall ___ his brother is short.', options: ['while','because','so','although'], answer: 'while', explain: 'Simultaneous contrast → "while".', banglaExplain: 'একই সময়ে বৈপরীত্য → "while"।' },
    { id: 'q6', prompt: 'I will wait ___ you come.', options: ['until','because','although','but'], answer: 'until', explain: 'Time → "until".', banglaExplain: 'সময় → "until"।' },
    { id: 'q7', prompt: 'The man ___ called is my uncle.', options: ['who','which','whose','whom'], answer: 'who', explain: 'Relative pronoun for person (subject).', banglaExplain: 'ব্যক্তির জন্য relative pronoun (subject)।' },
    { id: 'q8', prompt: 'This is the book ___ I bought.', options: ['which','who','whose','whom'], answer: 'which', explain: 'Relative pronoun for things.', banglaExplain: 'বস্তুর জন্য relative pronoun।' },
    { id: 'q9', prompt: 'Dhaka, ___ is the capital, is crowded.', options: ['which','who','that','whom'], answer: 'which', explain: 'Non-defining clause → "which".', banglaExplain: 'Non-defining clause → "which"।' },
    { id: 'q10', prompt: 'I do not know ___ he will come.', options: ['whether','that','which','who'], answer: 'whether', explain: 'Indirect question → "whether".', banglaExplain: 'Indirect question → "whether"।' },
    { id: 'q11', prompt: 'I will call you ___ I arrive.', options: ['when','because','although','but'], answer: 'when', explain: 'Time clause → "when".', banglaExplain: 'সময় → "when"।' },
    { id: 'q12', prompt: 'She was tired, ___ she went to bed.', options: ['so','because','although','or'], answer: 'so', explain: 'Result → "so".', banglaExplain: 'ফলাফল → "so"।' },
    { id: 'q13', prompt: '___ he was late, he still got the job.', options: ['Although','Because','But','So'], answer: 'Although', explain: 'Contrast → "Although".', banglaExplain: 'বৈপরীত্য → "Although"।' },
    { id: 'q14', prompt: 'I do not know ___ she will come.', options: ['if','that','which','who'], answer: 'if', explain: 'Indirect question → "if".', banglaExplain: 'Indirect question → "if"।' },
    { id: 'q15', prompt: '___ you work hard, you will succeed.', options: ['If','Because','But','So'], answer: 'If', explain: 'Condition → "If".', banglaExplain: 'শর্ত → "If"।' },
    { id: 'q16', prompt: 'He is the man ___ helped me.', options: ['who','which','whose','whom'], answer: 'who', explain: 'Person subject → "who".', banglaExplain: 'ব্যক্তি subject → "who"।' },
    { id: 'q17', prompt: 'This is the house ___ Jack built.', options: ['that','who','whose','whom'], answer: 'that', explain: 'Relative pronoun for things.', banglaExplain: 'বস্তুর জন্য relative pronoun।' },
    { id: 'q18', prompt: 'She smiled ___ she was happy.', options: ['because','although','but','or'], answer: 'because', explain: 'Cause → "because".', banglaExplain: 'কারণ → "because"।' },
    { id: 'q19', prompt: 'Do it ___ you are ready.', options: ['when','because','but','or'], answer: 'when', explain: 'Time → "when".', banglaExplain: 'সময় → "when"।' },
    { id: 'q20', prompt: '___ the rain, we went out.', options: ['Though','Because','But','So'], answer: 'Though', explain: 'Contrast → "Though".', banglaExplain: 'বৈপরীত্য → "Though"।' },
    { id: 'q21', prompt: 'He is rich, ___ he is not happy.', options: ['but','and','or','so'], answer: 'but', explain: 'Contrast → "but".', banglaExplain: 'বৈপরীত্য → "but"।' },
    { id: 'q22', prompt: 'I will wait ___ you come back.', options: ['until','because','but','so'], answer: 'until', explain: 'Time → "until".', banglaExplain: 'সময় → "until"।' },
  ]},
  t17: { name: 'Punctuation & Common Confusions', questions: [
    { id: 'q1', prompt: 'Which is correct?', options: ['I bought apples, bananas, and oranges.','I bought apples bananas and oranges.','I bought apples, bananas and oranges.','I bought, apples, bananas, and oranges.'], answer: 'I bought apples, bananas, and oranges.', explain: 'Commas separate list items (Oxford comma).', banglaExplain: 'তালিকার আইটেম আলাদা করতে কমা।' },
    { id: 'q2', prompt: 'Which is correct?', options: ['It’s raining.','Its raining.','Its’ raining.','It is’ raining.'], answer: 'It’s raining.', explain: 'It’s = it is.', banglaExplain: 'It’s = it is।' },
    { id: 'q3', prompt: 'Which is correct?', options: ['Rina’s book.','Rinas book.','Rinas’ book.','Rina book.'], answer: 'Rina’s book.', explain: 'Singular possessive: ’s.', banglaExplain: 'একবচন possessive: ’s।' },
    { id: 'q4', prompt: 'Which is correct?', options: ['I have lived here for five years.','I have lived here since five years.','I live here since five years.','I am living here since five years.'], answer: 'I have lived here for five years.', explain: 'Duration → "for".', banglaExplain: 'সময়ের ব্যাপ্তি → "for"।' },
    { id: 'q5', prompt: 'Which is correct?', options: ['He said that he was busy.','He told that he was busy.','He said that he is busy.','He says that he was busy.'], answer: 'He said that he was busy.', explain: '"Say" needs no object; "tell" does.', banglaExplain: '"Say" এর object লাগে না; "tell" এর লাগে।' },
    { id: 'q6', prompt: 'Which is correct?', options: ['Do you like tea?','You like tea?','Do you like tea.','You like tea.'], answer: 'Do you like tea?', explain: 'Questions need "do" and a question mark.', banglaExplain: 'প্রশ্নে "do" ও প্রশ্নবোধক চিহ্ন লাগে।' },
    { id: 'q7', prompt: 'Which is correct?', options: ['This is better.','This is more better.','This is most better.','This is more good.'], answer: 'This is better.', explain: 'Never double the comparative.', banglaExplain: 'Comparative কখনো দুবার বসে না।' },
    { id: 'q8', prompt: 'Which is correct?', options: ['She goes to school daily.','She go to school daily.','She going to school daily.','She gone to school daily.'], answer: 'She goes to school daily.', explain: 'Third person singular adds -s.', banglaExplain: 'তৃতীয় পুরুষ একবচনে -s।' },
    { id: 'q9', prompt: 'Which is correct?', options: ['I will meet you on Friday.','I will meet you in Friday.','I will meet you at Friday.','I will meet you by Friday.'], answer: 'I will meet you on Friday.', explain: 'Days → "on".', banglaExplain: 'দিনের আগে "on"।' },
    { id: 'q10', prompt: 'Which is correct?', options: ['He is an honest man.','He is a honest man.','He is the honest man.','He is honest man.'], answer: 'He is an honest man.', explain: 'Vowel sound → "an".', banglaExplain: 'Vowel sound → "an"।' },
    { id: 'q11', prompt: 'Which is correct?', options: ['I, too, like coffee.','I too like coffee.','I to like coffee.','I, to, like coffee.'], answer: 'I, too, like coffee.', explain: 'Parenthetical "too" is set off by commas.', banglaExplain: '"too" কমা দিয়ে ঘেরা হয়।' },
    { id: 'q12', prompt: 'Which is correct?', options: ['She said, "I am tired."','She said "I am tired".','She said: I am tired.','She said, I am tired.'], answer: 'She said, "I am tired."', explain: 'Direct speech takes a comma and quotation marks.', banglaExplain: 'Direct speech এ কমা ও quotation mark।' },
    { id: 'q13', prompt: 'Which is correct?', options: ['Their car is red.','There car is red.','They’re car is red.','Theyr car is red.'], answer: 'Their car is red.', explain: 'Possessive "their".', banglaExplain: 'Possessive "their"।' },
    { id: 'q14', prompt: 'Which is correct?', options: ['He is taller than me.','He is taller then me.','He is taller that me.','He is tall then me.'], answer: 'He is taller than me.', explain: '"Than" for comparison.', banglaExplain: 'তুলনার জন্য "than"।' },
    { id: 'q15', prompt: 'Which is correct?', options: ['I have fewer books than him.','I have less books than him.','I have little books than him.','I have few books than him.'], answer: 'I have fewer books than him.', explain: '"Fewer" for countable nouns.', banglaExplain: 'Countable noun → "fewer"।' },
    { id: 'q16', prompt: 'Which is correct?', options: ['She has fewer friends than me.','She has less friends than me.','She has little friends than me.','She has few friends than me.'], answer: 'She has fewer friends than me.', explain: '"Fewer" for countable nouns.', banglaExplain: 'Countable noun → "fewer"।' },
    { id: 'q17', prompt: 'Which is correct?', options: ['Its tail is long.','It’s tail is long.','Its’ tail is long.','It is tail is long.'], answer: 'Its tail is long.', explain: '"Its" = possessive; "it’s" = it is.', banglaExplain: '"Its" = possessive; "it’s" = it is।' },
    { id: 'q18', prompt: 'Which is correct?', options: ['Who’s coming to dinner?','Whose coming to dinner?','Whos coming to dinner?','Whose’s coming to dinner?'], answer: 'Who’s coming to dinner?', explain: '"Who’s" = who is.', banglaExplain: '"Who’s" = who is।' },
  ]},
};

/* ============================================================
   SPOT THE MISTAKE
   ============================================================ */
const SPOT_SENTENCES = [
  { id: 's1', words: ['She','go','to','school','everyday','.'], mistakeIndex: 1, fix: 'goes' },
  { id: 's2', words: ['I','have','seen','him','yesterday','.'], mistakeIndex: 2, fix: 'saw' },
  { id: 's3', words: ['He','don’t','like','coffee','.'], mistakeIndex: 1, fix: 'doesn’t' },
  { id: 's4', words: ['This','is','the','most','happiest','day','.'], mistakeIndex: 3, fix: '(remove “most”)' },
  { id: 's5', words: ['Each','of','the','students','have','a','book','.'], mistakeIndex: 4, fix: 'has' },
  { id: 's6', words: ['I','am','living','here','since','2019','.'], mistakeIndex: 4, fix: 'I have been living here since 2019' },
  { id: 's7', words: ['He','is','more','taller','than','me','.'], mistakeIndex: 2, fix: '(remove “more”)' },
  { id: 's8', words: ['The','news','are','good','today','.'], mistakeIndex: 2, fix: 'is' },
];

const BD_MISTAKES = [
  { id: 'm1', title: 'Articles (a / an / the)', desc: 'Bangla has no articles, so learners often skip or misplace them.', banglaDesc: 'বাংলায় article নেই, তাই শিক্ষার্থীরা প্রায়ই article বাদ দেয় বা ভুল বসায়।', wrong: 'He is honest man.', right: 'He is an honest man.' },
  { id: 'm2', title: 'Present tense for habits', desc: 'Direct translation from Bangla often drops the -s.', banglaDesc: 'বাংলা থেকে সরাসরি অনুবাদ করলে verb-এ -s যোগ করা বাদ পড়ে।', wrong: 'She go to market daily.', right: 'She goes to the market daily.' },
  { id: 'm3', title: 'Prepositions of time/place', desc: '"In", "on", "at" don’t map 1:1 to Bangla postpositions.', banglaDesc: '"In", "on", "at" বাংলার অনুসর্গের সাথে সরাসরি মিলে না।', wrong: 'I will meet you in Friday.', right: 'I will meet you on Friday.' },
  { id: 'm4', title: 'Double comparatives/superlatives', desc: 'Never stack "more"/"most" with -er/-est.', banglaDesc: '"more"/"most" এর সাথে -er/-est একসাথে বসানো যায় না।', wrong: 'This is more better.', right: 'This is better.' },
  { id: 'm5', title: 'Missing "do/does" in questions', desc: 'Bangla forms questions with intonation, not an auxiliary.', banglaDesc: 'বাংলায় প্রশ্ন তৈরি হয় স্বরভঙ্গি দিয়ে — তাই "do/does" বাদ পড়ে।', wrong: 'You like tea?', right: 'Do you like tea?' },
  { id: 'm6', title: 'Word-for-word translation', desc: 'Sentence order from Bangla gets carried into English.', banglaDesc: 'বাংলা বাক্যের শব্দক্রম সরাসরি ইংরেজিতে ব্যবহার করা হয়।', wrong: 'My headache is doing.', right: 'I have a headache.' },
  { id: 'm7', title: 'Since vs. for', desc: '"Since" takes a starting point; "for" takes a duration.', banglaDesc: '"Since" শুরুর সময়ের সাথে, "for" ব্যাপ্তির সাথে।', wrong: 'I have lived here since five years.', right: 'I have lived here for five years.' },
  { id: 'm8', title: 'Say vs. tell', desc: '"Tell" needs an object; "say" does not.', banglaDesc: '"Tell" এর পর object লাগে; "say" এর পর লাগে না।', wrong: 'He told that he was busy.', right: 'He said that he was busy. / He told me that he was busy.' },
];

const STORIES = [
  { id: 'story1', title: 'The Missing Umbrella', parts: [
    'Rina ', { blanks: ['was','is','be'], correct: 'was' }, ' walking home when it ',
    { blanks: ['started','starts','start'], correct: 'started' }, ' to rain. She had forgotten ',
    { blanks: ['her','she','hers'], correct: 'her' }, ' umbrella at school. By the time she ',
    { blanks: ['reached','reaches','reach'], correct: 'reached' }, ' home, she ',
    { blanks: ['was','is','were'], correct: 'was' }, ' completely soaked.',
  ]},
  { id: 'story2', title: 'A Trip to Cox’s Bazar', parts: [
    'Last winter, my family ', { blanks: ['visited','visits','visit'], correct: 'visited' }, ' Cox’s Bazar. We ',
    { blanks: ['stayed','stay','staying'], correct: 'stayed' }, ' near the beach for three days. Every morning, we ',
    { blanks: ['watched','watches','watch'], correct: 'watched' }, ' the sunrise together. I wish we ',
    { blanks: ['could','can','will'], correct: 'could' }, ' go back again this year.',
  ]},
  { id: 'story3', title: 'The Exam Morning', parts: [
    'It was 7 AM and Arif ', { blanks: ['had','has','have'], correct: 'had' }, ' not slept well. He ',
    { blanks: ['had been studying','study','studies'], correct: 'had been studying' }, ' all night. When he ',
    { blanks: ['reached','reach','reaches'], correct: 'reached' }, ' the hall, the exam ',
    { blanks: ['had already started','already start','starts'], correct: 'had already started' }, '. He felt nervous but ',
    { blanks: ['kept','keep','keeps'], correct: 'kept' }, ' calm and did his best.',
  ]},
];

const RULE_CATEGORIES = [
  { id: 'all',          label: 'All' },
  { id: 'tenses',       label: 'Tenses' },
  { id: 'articles',     label: 'Articles' },
  { id: 'nouns',        label: 'Nouns & Pronouns' },
  { id: 'adjectives',   label: 'Adjectives & Adverbs' },
  { id: 'prepositions', label: 'Prepositions' },
  { id: 'modals',       label: 'Modals' },
  { id: 'conditionals', label: 'Conditionals' },
  { id: 'voice',        label: 'Voice' },
  { id: 'narration',    label: 'Narration' },
  { id: 'clauses',      label: 'Clauses & Sentences' },
  { id: 'punctuation',  label: 'Punctuation' },
];

const RULE_LIBRARY = [
  { id: 'r-t1', category: 'tenses', title: 'Present Simple', summary: 'Habits, routines, general truths.', explanation: 'Base verb; add -s/-es for he/she/it.', bangla: 'অভ্যাস বা সাধারণ সত্য। he/she/it এর সাথে -s/-es।', examples: [{ right: 'She goes to school every day.' }, { wrong: 'She go to school every day.' }], tips: ['With "every day", "usually", "never".'] },
  { id: 'r-t2', category: 'tenses', title: 'Present Continuous', summary: 'Actions happening now.', explanation: 'am/is/are + verb-ing.', bangla: 'এই মুহূর্তে চলমান কাজ। am/is/are + verb-ing।', examples: [{ right: 'I am reading a book.' }, { wrong: 'I reading a book.' }], tips: ['Not used with stative verbs (know, love).'] },
  { id: 'r-t3', category: 'tenses', title: 'Present Perfect', summary: 'Past action with present relevance.', explanation: 'has/have + past participle.', bangla: 'অতীতের কাজ যার প্রভাব বর্তমানে। has/have + past participle।', examples: [{ right: 'I have finished my homework.' }, { wrong: 'I have finished my homework yesterday.' }], tips: ['Use with just, already, yet, ever, never.'] },
  { id: 'r-t4', category: 'tenses', title: 'Present Perfect Continuous', summary: 'Started in past, still continuing.', explanation: 'has/have been + verb-ing.', bangla: 'অতীতে শুরু, এখনো চলছে। has/have been + verb-ing।', examples: [{ right: 'I have been studying for three hours.' }], tips: ['Often pairs with "for" and "since".'] },
  { id: 'r-t5', category: 'tenses', title: 'Past Simple', summary: 'Completed actions at a definite past time.', explanation: 'Regular verbs add -ed; irregular verbs change form.', bangla: 'নির্দিষ্ট অতীত সময়ে সম্পন্ন কাজ।', examples: [{ right: 'I visited Dhaka last week.' }, { wrong: 'I have visited Dhaka last week.' }], tips: ['With "yesterday", "last…", "ago".'] },
  { id: 'r-t6', category: 'tenses', title: 'Past Continuous', summary: 'Ongoing past action, often interrupted.', explanation: 'was/were + verb-ing.', bangla: 'অতীতের চলমান কাজ, প্রায়ই মাঝে বাধা। was/were + verb-ing।', examples: [{ right: 'I was cooking when she called.' }], tips: ['Pattern: was/were + V-ing + when + past simple.'] },
  { id: 'r-t7', category: 'tenses', title: 'Past Perfect', summary: 'Action before another past action.', explanation: 'had + past participle.', bangla: 'অতীতের অন্য কাজের আগে ঘটেছিল। had + past participle।', examples: [{ right: 'The train had left before we arrived.' }], tips: ['Use with "before", "after", "by the time".'] },
  { id: 'r-t8', category: 'tenses', title: 'Future Simple', summary: 'Predictions, spontaneous decisions.', explanation: 'will + base verb; "be going to" for plans.', bangla: 'ভবিষ্যদ্বাণী বা তাৎক্ষণিক সিদ্ধান্ত। will + base verb।', examples: [{ right: 'I will call you tonight.' }], tips: ['"will" = spontaneous; "going to" = planned.'] },
  { id: 'r-t9', category: 'tenses', title: 'Future Perfect', summary: 'Action completed before a future point.', explanation: 'will have + past participle.', bangla: 'ভবিষ্যতের নির্দিষ্ট সময়ের আগে শেষ। will have + past participle।', examples: [{ right: 'By next June, I will have graduated.' }], tips: ['Often pairs with "by" + future time.'] },
  { id: 'r-a1', category: 'articles', title: 'a / an — Indefinite', summary: 'Before singular countable nouns, first mention.', explanation: '"a" before consonant sounds; "an" before vowel sounds.', bangla: 'consonant sound এর আগে "a", vowel sound এর আগে "an"।', examples: [{ right: 'a university' }, { right: 'an hour' }, { wrong: 'a honest man' }], tips: ['Sound, not spelling.'] },
  { id: 'r-a2', category: 'articles', title: 'the — Definite', summary: 'Specific, unique, or superlative nouns.', explanation: 'Rivers, seas, groups, superlatives, second mention.', bangla: 'নির্দিষ্ট, একক বা superlative noun এর আগে।', examples: [{ right: 'The Padma is long.' }, { right: 'He is the best.' }], tips: ['No "the" before most countries or languages.'] },
  { id: 'r-a3', category: 'articles', title: 'Zero Article', summary: 'No article with general plural/uncountable.', explanation: 'Used for general ideas, sports, meals, languages.', bangla: 'সাধারণ অর্থে plural/uncountable, খেলা, ভাষা।', examples: [{ right: 'I like music.' }, { wrong: 'I like the music.' }], tips: ['General = no article; specific = "the".'] },
  { id: 'r-n1', category: 'nouns', title: 'Countable vs. Uncountable', summary: 'Uncountable nouns take singular verbs.', explanation: 'water, advice, information, furniture, news.', bangla: 'Uncountable noun singular verb নেয়।', examples: [{ right: 'The news is good.' }, { wrong: 'The news are good.' }], tips: ['Use "a piece of" with uncountable nouns.'] },
  { id: 'r-n2', category: 'nouns', title: 'Pronoun Agreement', summary: 'Pronouns match number, gender, person.', explanation: 'Singular noun → singular pronoun.', bangla: 'Pronoun noun এর সাথে মিলতে হবে।', examples: [{ right: 'Each student must bring his or her book.' }], tips: ['Modern usage accepts "their" as singular.'] },
  { id: 'r-d1', category: 'adjectives', title: 'Comparatives & Superlatives', summary: 'Compare two (-er) or more (-est).', explanation: 'Short: -er/-est. Long: more/most. Never combine.', bangla: 'ছোট: -er/-est, বড়: more/most। একসাথে বসে না।', examples: [{ right: 'This is better.' }, { wrong: 'This is more better.' }], tips: ['Irregular: good → better → best.'] },
  { id: 'r-d2', category: 'adjectives', title: 'Adjective vs. Adverb', summary: 'Adjectives describe nouns; adverbs describe verbs.', explanation: 'Many adverbs end in -ly, but not all (fast, hard, well).', bangla: 'Adjective noun বর্ণনা করে; adverb verb বর্ণনা করে।', examples: [{ right: 'She sings beautifully.' }, { wrong: 'She sings beautiful.' }], tips: ['"Well" is the adverb of "good".'] },
  { id: 'r-p1', category: 'prepositions', title: 'in / on / at — Time', summary: 'Prepositions of time.', explanation: 'in = months, years; on = days, dates; at = clock times.', bangla: 'in = মাস, বছর; on = দিন, তারিখ; at = ঘড়ির সময়।', examples: [{ right: 'in June, on Monday, at 6 PM' }, { wrong: 'in Friday' }], tips: ['"at night" but "in the morning".'] },
  { id: 'r-p2', category: 'prepositions', title: 'in / on / at — Place', summary: 'Prepositions of place.', explanation: 'in = enclosed, cities; on = surfaces; at = specific points.', bangla: 'in = বদ্ধ স্থান; on = পৃষ্ঠ; at = নির্দিষ্ট বিন্দু।', examples: [{ right: 'in Dhaka, on the table, at home' }], tips: ['"at home" and "at work" are fixed.'] },
  { id: 'r-p3', category: 'prepositions', title: 'Common Collocations', summary: 'Verb/adjective + preposition.', explanation: 'good at, interested in, afraid of, depend on, listen to.', bangla: 'নির্দিষ্ট verb/adjective + preposition জোড়া।', examples: [{ right: 'good at, interested in, depend on' }, { wrong: 'good in mathematics' }], tips: ['Learn them as fixed chunks.'] },
  { id: 'r-m1', category: 'modals', title: 'can / could / may / might', summary: 'Ability, possibility, permission.', explanation: 'can = ability; could = past/polite; may = permission; might = weak possibility.', bangla: 'can = সামর্থ্য; could = অতীত/ভদ্রতা; may = অনুমতি; might = দুর্বল সম্ভাবনা।', examples: [{ right: 'She can swim.' }, { right: 'Could you help me?' }], tips: ['No "to" after modals (except "ought to").'] },
  { id: 'r-m2', category: 'modals', title: 'must / should / ought to', summary: 'Obligation, advice.', explanation: 'must = strong obligation; should/ought to = advice.', bangla: 'must = বাধ্যবাধকতা; should = পরামর্শ।', examples: [{ right: 'You must wear a seatbelt.' }, { wrong: 'You must to rest.' }], tips: ['"must not" = prohibition.'] },
  { id: 'r-c1', category: 'conditionals', title: 'Zero & First Conditional', summary: 'Real conditions.', explanation: 'Zero: If + present, present. First: If + present, will + base.', bangla: 'Zero: সাধারণ সত্য। First: বাস্তব ভবিষ্যৎ।', examples: [{ right: 'If you heat ice, it melts.' }, { right: 'If it rains, I will stay home.' }, { wrong: 'If it will rain, I will stay home.' }], tips: ['Never "will" in the if-clause of first conditional.'] },
  { id: 'r-c2', category: 'conditionals', title: 'Second & Third Conditional', summary: 'Unreal present & unreal past.', explanation: 'Second: If + past, would + base. Third: If + past perfect, would have + past participle.', bangla: 'Second: কাল্পনিক বর্তমান। Third: কাল্পনিক অতীত।', examples: [{ right: 'If I were you, I would apologize.' }, { right: 'If she had studied, she would have passed.' }], tips: ['Second conditional uses "were" for all subjects.'] },
  { id: 'r-v1', category: 'voice', title: 'Active vs. Passive Voice', summary: 'Focus on doer or action.', explanation: 'Passive = be + past participle (+ by + agent).', bangla: 'Passive = be + past participle (+ by + কর্তা)।', examples: [{ right: 'Active: Rina writes a letter.' }, { right: 'Passive: A letter is written by Rina.' }], tips: ['Only transitive verbs can be made passive.'] },
  { id: 'r-nar1', category: 'narration', title: 'Direct → Indirect Speech', summary: 'Report without quoting.', explanation: 'Shift tense one step back; change pronouns and time/place words.', bangla: 'Tense একধাপ পিছিয়ে যায়; pronoun, সময়/স্থান পরিবর্তন হয়।', examples: [{ right: 'He said, "I am tired." → He said that he was tired.' }], tips: ['Questions become statements in indirect speech.'] },
  { id: 'r-cl1', category: 'clauses', title: 'Independent vs. Dependent', summary: 'Independent stands alone; dependent does not.', explanation: 'Dependent clauses start with because, although, when, if.', bangla: 'Independent একা দাঁড়াতে পারে; dependent পারে না।', examples: [{ right: 'I stayed home because it was raining.' }, { wrong: 'Because it was raining.' }], tips: ['Every sentence needs one independent clause.'] },
  { id: 'r-cl2', category: 'clauses', title: 'Relative Clauses', summary: 'Add information about a noun.', explanation: 'Defining: no commas. Non-defining: between commas.', bangla: 'Defining: কমা নেই। Non-defining: কমা থাকে।', examples: [{ right: 'The man who called is my uncle.' }, { right: 'Dhaka, which is the capital, is crowded.' }], tips: ['"That" only in defining clauses.'] },
  { id: 'r-pu1', category: 'punctuation', title: 'Comma Rules', summary: 'Separates items, clauses, phrases.', explanation: 'Lists, introductory phrases, before conjunctions, around non-defining clauses.', bangla: 'তালিকা, introductory phrase, conjunction — এসব ক্ষেত্রে কমা।', examples: [{ right: 'I bought apples, bananas, and oranges.' }, { wrong: 'I bought apples bananas and oranges.' }], tips: ['Oxford comma is optional but consistent.'] },
  { id: 'r-pu2', category: 'punctuation', title: 'Apostrophes — Possession', summary: 'Shows ownership or contraction.', explanation: 'Singular: ’s. Plural ending in -s: s’. It’s = it is; its = possessive.', bangla: 'Singular: ’s. Plural শেষে -s থাকলে: s’।', examples: [{ right: 'Rina’s book, the students’ books' }, { wrong: 'Its raining.' }], tips: ['Its = possessive; It’s = it is.'] },
];

function StorySelect({ options, value, onChange }) {
  return (
    <select className="ec-story-select" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">choose…</option>
      {options.map((o) => (<option key={o} value={o}>{o}</option>))}
    </select>
  );
}

function RuleCard({ rule, banglaMode }) {
  return (
    <article className="ec-rule-card">
      <header className="ec-rule-head">
        <span className="ec-rule-cat-tag">
          {RULE_CATEGORIES.find((c) => c.id === rule.category)?.label || rule.category}
        </span>
        <h3 className="ec-rule-title">{rule.title}</h3>
        <p className="ec-rule-summary">{rule.summary}</p>
      </header>
      <p className="ec-rule-explain">
        {banglaMode && rule.bangla ? rule.bangla : rule.explanation}
      </p>
      <ul className="ec-rule-examples">
        {rule.examples.map((ex, i) => (
          <li key={i} className={ex.wrong ? 'ec-rule-ex--bad' : 'ec-rule-ex--ok'}>
            <span className="ec-rule-ex-icon">{ex.wrong ? '✕' : '✓'}</span>
            <span>{ex.wrong || ex.right}</span>
            {ex.note && <span className="ec-rule-ex-note">— {ex.note}</span>}
          </li>
        ))}
      </ul>
      {rule.tips?.length > 0 && (
        <div className="ec-rule-tips">
          <span className="ec-rule-tips-label">💡 Tip</span>
          <ul>{rule.tips.map((t, i) => (<li key={i}>{t}</li>))}</ul>
        </div>
      )}
    </article>
  );
}

export function Grammar() {
  const [mode, setMode] = useState('Exercises');
  const [banglaMode, setBanglaMode] = useState(false);
  const [xpToast, setXpToast] = useState(null);
  const [topicStats, setTopicStats] = useState({});

  const [topicId, setTopicId] = useState('t1');
  const [questions, setQuestions] = useState(TOPIC_QUESTION_BANK.t1.questions);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feel, setFeel] = useState(null);
  const [exScore, setExScore] = useState({ correct: 0, total: 0 });

  const [spotIndex, setSpotIndex] = useState(0);
  const [pickedWord, setPickedWord] = useState(null);
  const [spotScore, setSpotScore] = useState({ correct: 0, total: 0 });
  const [spotFeel, setSpotFeel] = useState(null);

  const [storyId, setStoryId] = useState('story1');
  const [storyAnswers, setStoryAnswers] = useState({});
  const [storyChecked, setStoryChecked] = useState(false);

  const [flippedCards, setFlippedCards] = useState({});

  const [ruleCategory, setRuleCategory] = useState('all');
  const [ruleSearch, setRuleSearch] = useState('');

  const [topicBank, setTopicBank] = useState(TOPIC_QUESTION_BANK);

  useEffect(() => {
    grammarApi.topics().then((t) => {
      if (t && t.length) {
        setTopicBank((prev) => {
          const merged = { ...prev };
          t.forEach((apiTopic) => {
            const id = apiTopic.id ?? apiTopic._id;
            if (!id) return;
            merged[id] = { ...(merged[id] || {}), name: apiTopic.name || merged[id]?.name || id, questions: merged[id]?.questions || [] };
          });
          return merged;
        });
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (mode !== 'Exercises') return;
    const bank = topicBank[topicId] || TOPIC_QUESTION_BANK[topicId];
    if (!bank) return;
    grammarApi.questions(topicId)
      .then((qs) => setQuestions(qs && qs.length ? qs : bank.questions))
      .catch(() => setQuestions(bank.questions));
    setQIndex(0);
    setSelected(null);
    setFeel(null);
  }, [mode, topicId, topicBank]);

  const question = questions[qIndex];
  const spot = SPOT_SENTENCES[spotIndex];
  const story = STORIES.find((s) => s.id === storyId);

  const filteredRules = useMemo(() => {
    const q = ruleSearch.trim().toLowerCase();
    return RULE_LIBRARY.filter((r) => {
      const catOk = ruleCategory === 'all' || r.category === ruleCategory;
      if (!catOk) return false;
      if (!q) return true;
      return r.title.toLowerCase().includes(q) || r.summary.toLowerCase().includes(q) || r.explanation.toLowerCase().includes(q);
    });
  }, [ruleCategory, ruleSearch]);

  const showXp = (amount) => {
    setXpToast(amount);
    setTimeout(() => setXpToast(null), 900);
  };

  const answer = (opt) => {
    if (!question) return;
    setSelected(opt);
    const correct = opt === question.answer;
    setFeel(correct ? 'good' : 'bad');
    setExScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
    setTopicStats((stats) => {
      const prev = stats[topicId] || { correct: 0, total: 0 };
      return { ...stats, [topicId]: { correct: prev.correct + (correct ? 1 : 0), total: prev.total + 1 } };
    });
    if (correct) showXp(10);
    grammarApi.attempt(question.id, opt).catch(() => {});
    setTimeout(() => {
      setSelected(null);
      setFeel(null);
      setQIndex((i) => (i + 1 < questions.length ? i + 1 : 0));
    }, 800);
  };

  const tapWord = (i) => {
    if (pickedWord !== null) return;
    setPickedWord(i);
    const correct = i === spot.mistakeIndex;
    setSpotFeel(correct ? 'good' : 'bad');
    setSpotScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
    if (correct) showXp(5);
    setTimeout(() => {
      setPickedWord(null);
      setSpotFeel(null);
      setSpotIndex((s) => (s + 1 < SPOT_SENTENCES.length ? s + 1 : 0));
    }, 950);
  };

  const setStoryBlank = (partIndex, value) => {
    setStoryAnswers((a) => ({ ...a, [partIndex]: value }));
    setStoryChecked(false);
  };

  const storyCorrectCount = story.parts.reduce((acc, part, i) => {
    if (typeof part === 'object' && storyAnswers[i] === part.correct) return acc + 1;
    return acc;
  }, 0);
  const storyBlankCount = story.parts.filter((p) => typeof p === 'object').length;

  const isWeakTopic = (id) => {
    const s = topicStats[id];
    return !!s && s.total >= 3 && s.correct / s.total < 0.6;
  };

  const totalQuestions = Object.values(topicBank).reduce((sum, t) => sum + (t.questions?.length || 0), 0);
  const overallCorrect = exScore.correct + spotScore.correct;
  const overallTotal = exScore.total + spotScore.total;
  const overallPct = overallTotal ? Math.round((overallCorrect / overallTotal) * 100) : 0;

  return (
    <div className="ec-grammar">
      <style>{GRAMMAR_CSS}</style>

      <div className="ec-grammar-head">
        <div>
          <p style={{
            margin: '0 0 6px',
            fontSize: 11.5,
            fontWeight: 900,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--lang-purple)',
            opacity: 0.95,
          }}>
            Practice · {Object.keys(topicBank).length} topics · {totalQuestions} questions
          </p>
          <h1 className="ec-page-title">Grammar</h1>
          <p className="ec-page-sub">
            Interactive exercises, story-based lessons, a Bangla-mistake library, and a full rules reference.
          </p>
        </div>
        <div className="ec-grammar-head-actions">
          <button
            className={`ec-mode-tab${banglaMode ? ' ec-mode-tab--active' : ''}`}
            onClick={() => setBanglaMode((b) => !b)}
            style={{ borderRadius: 999, padding: '10px 16px', fontSize: 12.5 }}
          >
            🇧🇩 বাংলা {banglaMode ? 'ON' : 'OFF'}
          </button>
          {overallTotal > 0 && (
            <span className="ec-score-track">
              <span className="ec-score-good">{overallCorrect}</span>/{overallTotal} · {overallPct}%
            </span>
          )}
        </div>
      </div>

      <div className="ec-mode-tabs" role="tablist">
        {MODES.map((m) => (
          <button
            key={m.id}
            role="tab"
            aria-selected={mode === m.id}
            className={`ec-mode-tab${mode === m.id ? ' ec-mode-tab--active' : ''}`}
            onClick={() => setMode(m.id)}
          >
            <span className="ec-mode-tab-icon"><Icon name={m.icon} /></span>
            <span className="ec-mode-tab-label">{m.label}</span>
          </button>
        ))}
      </div>

      {xpToast && <div className="ec-xp-toast">+{xpToast} XP ✨</div>}

      {mode === 'Exercises' && (
        <div className="ec-g-two-col ec-anim-in" key="exercises">
          <section>
            {question ? (
              <div className={`ec-quiz-card${feel === 'good' ? ' ec-pulse-ring' : ''}${feel === 'bad' ? ' ec-shake' : ''}`}>
                <div className="ec-quiz-top">
                  <span className="ec-quiz-badge">{topicBank[topicId]?.name || 'Grammar'}</span>
                  <span className="ec-quiz-counter">Question {qIndex + 1} / {questions.length}</span>
                </div>
                <div className="ec-quiz-progress">
                  <div className="ec-quiz-progress-fill" style={{ width: `${((qIndex + 1) / questions.length) * 100}%` }} />
                </div>
                <p className="ec-quiz-question">{question.prompt}</p>
                <div className="ec-quiz-options">
                  {question.options.map((opt) => {
                    const isSelected = selected === opt;
                    const isCorrect = opt === question.answer;
                    const cls = `ec-quiz-option${isSelected ? (isCorrect ? ' ec-quiz-option--correct ec-pop' : ' ec-quiz-option--incorrect') : ''}`;
                    return (
                      <button
                        key={opt}
                        className={cls}
                        onClick={() => !selected && answer(opt)}
                        disabled={!!selected && !isSelected && !isCorrect}
                      >
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="ec-quiz-footer">
                  {feel === 'good' && <span className="ec-quiz-feedback ec-quiz-feedback--good">✨ Correct!</span>}
                  {feel === 'bad' && <span className="ec-quiz-feedback ec-quiz-feedback--bad">Correct answer: {question.answer}</span>}
                </div>
                {feel && question.explain && (
                  <p className="ec-quiz-explain">
                    💡 {banglaMode && question.banglaExplain ? question.banglaExplain : question.explain}
                  </p>
                )}
              </div>
            ) : (
              <div className="ec-grammar-empty">Pick a topic to begin.</div>
            )}
          </section>

          <aside className="ec-topic-panel">
            <header className="ec-topic-panel-head">
              <h3>Topics</h3>
              <span className="ec-topic-panel-count">{Object.keys(topicBank).length}</span>
            </header>
            <div className="ec-topic-list">
              {Object.entries(topicBank).map(([id, t]) => {
                const stat = topicStats[id];
                const pct = stat && stat.total ? Math.round((stat.correct / stat.total) * 100) : null;
                const weak = isWeakTopic(id);
                const active = topicId === id;
                return (
                  <button
                    key={id}
                    className={`ec-topic-btn${active ? ' ec-topic-btn--active' : ''}`}
                    onClick={() => setTopicId(id)}
                  >
                    <span className="ec-topic-name">{t.name}</span>
                    <span className="ec-topic-pct" style={{ fontSize: 10, padding: '2px 6px', opacity: 0.7, background: 'transparent', border: 'none', boxShadow: 'none', color: 'inherit' }}>
                      {t.questions.length}q
                    </span>
                    {pct !== null ? (
                      <span className={`ec-topic-pct${weak ? ' ec-topic-pct--weak' : ''}`}>{pct}%</span>
                    ) : (
                      <span className="ec-topic-pct ec-topic-pct--empty">—</span>
                    )}
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
      )}

      {mode === 'Spot the Mistake' && (
        <div
          className={`ec-spot-card ec-anim-in${spotFeel === 'good' ? ' ec-pulse-ring' : ''}${spotFeel === 'bad' ? ' ec-shake' : ''}`}
          key="spot"
        >
          <div className="ec-spot-head">
            <span className="ec-quiz-badge">Spot the Mistake</span>
            <span className="ec-quiz-counter">{spotIndex + 1} / {SPOT_SENTENCES.length}</span>
          </div>
          <p className="ec-spot-hint">Tap the word that’s wrong.</p>
          <p className="ec-sentence">
            {spot.words.map((w, i) => {
              const picked = pickedWord === i;
              const isCorrect = i === spot.mistakeIndex;
              const cls = `ec-word-tap${picked ? (isCorrect ? ' ec-word-tap--correct ec-pop' : ' ec-word-tap--wrong') : pickedWord !== null && isCorrect ? ' ec-word-tap--reveal' : ''}`;
              return <span key={i} className={cls} onClick={() => tapWord(i)}>{w}</span>;
            })}
          </p>
          {pickedWord !== null && (
            <p className={`ec-spot-result${pickedWord === spot.mistakeIndex ? ' ec-spot-result--ok' : ' ec-spot-result--bad'}`}>
              {pickedWord === spot.mistakeIndex ? `✅ Correct — should be “${spot.fix}”` : `❌ Not quite — correct fix: “${spot.fix}”`}
            </p>
          )}
        </div>
      )}

      {mode === 'Story Mode' && (
        <div className="ec-anim-in" key="story">
          <div className="ec-story-tabs">
            {STORIES.map((s) => (
              <button
                key={s.id}
                className={`ec-story-tab${storyId === s.id ? ' ec-story-tab--active' : ''}`}
                onClick={() => { setStoryId(s.id); setStoryAnswers({}); setStoryChecked(false); }}
              >
                {s.title}
              </button>
            ))}
          </div>
          <div className={`ec-story-card${storyChecked ? ' ec-pop' : ''}`}>
            <h3 className="ec-story-title">{story.title}</h3>
            <p className="ec-story-body">
              {story.parts.map((part, i) =>
                typeof part === 'string' ? (
                  <span key={i}>{part}</span>
                ) : (
                  <span key={i} className="ec-story-blank">
                    <StorySelect options={part.blanks} value={storyAnswers[i] || ''} onChange={(v) => setStoryBlank(i, v)} />
                  </span>
                )
              )}
            </p>
            <div className="ec-story-foot">
              <button className="ec-btn-dark" onClick={() => setStoryChecked(true)}>Check answers</button>
              {storyChecked && (
                <span className={`ec-story-score${storyCorrectCount === storyBlankCount ? ' ec-story-score--perfect' : ''}`}>
                  {storyCorrectCount} / {storyBlankCount} correct{storyCorrectCount === storyBlankCount ? ' — great job! ✨' : ''}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {mode === 'Common Mistakes' && (
        <div className="ec-mistakes-grid ec-anim-in" key="mistakes">
          {BD_MISTAKES.map((m, idx) => {
            const flipped = !!flippedCards[m.id];
            const num = String(idx + 1).padStart(2, '0');
            const toggle = () => setFlippedCards((f) => ({ ...f, [m.id]: !f[m.id] }));
            return (
              <div
                key={m.id}
                role="button"
                tabIndex={0}
                aria-label={`${m.title} — tap to ${flipped ? 'flip back' : 'see the fix'}`}
                aria-pressed={flipped}
                className={`ec-flip-card${flipped ? ' ec-flip-card--flipped' : ''}`}
                onClick={toggle}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggle();
                  }
                }}
              >
                <div className="ec-flip-inner">
                  {/* ---------- FRONT ---------- */}
                  <div className="ec-flip-face ec-flip-front">
                    <div className="ec-flip-top">
                      <span className="ec-flip-num">{num}</span>
                      <span className="ec-flip-badge ec-flip-badge--wrong">
                        ❌ Common error
                      </span>
                    </div>

                    <div className="ec-flip-body">
                      <h3 className="ec-flip-title">{m.title}</h3>
                      <p className="ec-flip-desc">
                        {banglaMode && m.banglaDesc ? m.banglaDesc : m.desc}
                      </p>
                    </div>

                    <div className="ec-flip-example ec-flip-example--wrong">
                      <span className="ec-flip-example-icon" aria-hidden="true">✕</span>
                      <span className="ec-flip-example-text">{m.wrong}</span>
                    </div>

                    <span className="ec-flip-hint">
                      Tap to reveal the correct version
                      <span className="ec-flip-hint-arrow" aria-hidden="true">→</span>
                    </span>
                  </div>

                  {/* ---------- BACK ---------- */}
                  <div className="ec-flip-face ec-flip-back">
                    <div className="ec-flip-top">
                      <span className="ec-flip-num">{num}</span>
                      <span className="ec-flip-badge ec-flip-badge--right">
                        ✓ Correct version
                      </span>
                    </div>

                    <div className="ec-flip-body">
                      <h3 className="ec-flip-title">{m.title}</h3>
                      <p className="ec-flip-desc">Use this form instead.</p>
                    </div>

                    <div className="ec-flip-example ec-flip-example--right">
                      <span className="ec-flip-example-icon" aria-hidden="true">✓</span>
                      <span className="ec-flip-example-text">{m.right}</span>
                    </div>

                    <span className="ec-flip-hint">
                      <span className="ec-flip-hint-arrow" aria-hidden="true">→</span>
                      Tap to flip back
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {mode === 'Rules Library' && (
        <div className="ec-rules ec-anim-in" key="rules">
          <div className="ec-rules-toolbar">
            <div className="ec-rules-search">
              <Icon name="search" />
              <input
                type="text"
                placeholder="Search a rule — “present perfect”, “articles”, “conditionals”…"
                value={ruleSearch}
                onChange={(e) => setRuleSearch(e.target.value)}
              />
              {ruleSearch && (
                <button className="ec-rules-clear" onClick={() => setRuleSearch('')} aria-label="Clear search">✕</button>
              )}
            </div>
          </div>

          <div className="ec-rules-cats">
            {RULE_CATEGORIES.map((c) => (
              <button
                key={c.id}
                className={`ec-rule-cat${ruleCategory === c.id ? ' ec-rule-cat--active' : ''}`}
                onClick={() => setRuleCategory(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>

          {filteredRules.length === 0 ? (
            <div className="ec-grammar-empty">No rules match your search.</div>
          ) : (
            <div className="ec-rule-grid">
              {filteredRules.map((r) => (
                <RuleCard key={r.id} rule={r} banglaMode={banglaMode} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Grammar;