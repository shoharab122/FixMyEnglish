import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { speakingApi } from '../api/speaking';
import { Icon } from '../components/Icon';

/* ============================================================
   STYLES — Langut-inspired
   Deep purple + lime-yellow + chunky black outlines.
   ============================================================ */
const SPEAK_CSS = `
.ec-spk{
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

.ec-spk,
.ec-spk *{box-sizing:border-box}

/* ============================================================
   HEAD
   ============================================================ */
.ec-spk-head{
  display:flex;align-items:flex-end;justify-content:space-between;
  gap:16px;flex-wrap:wrap;margin-bottom:18px;
}
.ec-spk-eyebrow{
  margin:0 0 6px;font-size:11.5px;font-weight:900;
  letter-spacing:.16em;text-transform:uppercase;
  color:var(--lang-purple);opacity:.95;
}

/* ============================================================
   HERO — deep purple, chunky stats, mascot
   ============================================================ */
.ec-spk-hero{
  position:relative;overflow:hidden;
  border-radius:32px;
  padding:clamp(26px,4vw,40px) clamp(24px,4vw,42px);
  color:#fff;
  background:linear-gradient(140deg,#2A1A6E 0%,#1E1252 55%,#3B2596 100%);
  box-shadow:0 20px 52px rgba(30,18,82,.34);
  border:2px solid var(--lang-line);
  margin-bottom:22px;
  min-height:240px;
  display:flex;align-items:center;justify-content:space-between;gap:20px;
}
.ec-spk-hero::before{
  content:'';position:absolute;inset:0;
  background-image:radial-gradient(rgba(255,255,255,.10) 1.4px,transparent 1.4px);
  background-size:20px 20px;
  mask-image:radial-gradient(circle at 15% 20%,#000,transparent 65%);
  -webkit-mask-image:radial-gradient(circle at 15% 20%,#000,transparent 65%);
  pointer-events:none;
}
.ec-spk-hero-orb{
  position:absolute;top:-90px;right:180px;
  width:260px;height:260px;border-radius:50%;
  background:radial-gradient(circle,rgba(212,245,92,.22),transparent 68%);
  animation:ec-spk-drift 14s ease-in-out infinite;
}
@keyframes ec-spk-drift{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-18px,16px) scale(1.08)}}
.ec-spk-hero-copy{position:relative;z-index:1;max-width:580px}
.ec-spk-hero-badge{
  display:inline-flex;align-items:center;
  font-size:10.5px;font-weight:900;
  letter-spacing:.16em;text-transform:uppercase;
  padding:7px 14px;border-radius:999px;
  background:var(--lang-lime);color:var(--lang-ink);
  border:2px solid var(--lang-line);
  box-shadow:0 3px 0 rgba(0,0,0,.4);
  margin-bottom:16px;
}
.ec-spk-hero h1{
  margin:0 0 10px;
  font-size:clamp(26px,2.4vw + 16px,38px);
  font-weight:900;
  letter-spacing:-.035em;
  line-height:1.1;
  color:#fff;
}
.ec-spk-hero h1 em{font-style:normal;color:var(--lang-lime)}
.ec-spk-hero p{
  margin:0 0 22px;
  font-size:14px;line-height:1.6;
  opacity:.92;font-weight:500;max-width:52ch;
}

/* Price-tag style stat chips */
.ec-spk-hero-stats{display:flex;gap:10px;flex-wrap:wrap;position:relative;z-index:1}
.ec-spk-hero-stat{
  display:flex;flex-direction:column;gap:2px;
  padding:9px 14px;
  border-radius:14px;
  background:var(--lang-lime);
  border:2px solid var(--lang-line);
  box-shadow:0 3px 0 var(--lang-line);
  min-width:80px;
}
.ec-spk-hero-stat strong{
  font-size:20px;font-weight:900;line-height:1;
  letter-spacing:-.04em;
  color:var(--lang-ink);
}
.ec-spk-hero-stat span{
  font-size:9.5px;font-weight:900;letter-spacing:.1em;
  text-transform:uppercase;color:var(--lang-ink);opacity:.75;
}
.ec-spk-hero-stat:nth-child(2){background:var(--lang-pink)}
.ec-spk-hero-stat:nth-child(3){background:var(--lang-purple-2)}
.ec-spk-hero-stat:nth-child(3) strong,
.ec-spk-hero-stat:nth-child(3) span{color:#fff}
.ec-spk-hero-stat:nth-child(4){background:var(--lang-yellow)}

/* Mascot */
.ec-spk-hero-mascot{
  position:relative;z-index:1;
  flex-shrink:0;
  display:flex;align-items:center;justify-content:center;
  filter:drop-shadow(0 14px 28px rgba(0,0,0,.28));
  animation:ec-spk-bob 4s ease-in-out infinite;
}
@keyframes ec-spk-bob{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-10px) rotate(2deg)}}

/* ============================================================
   TOP TABS — chunky pills
   ============================================================ */
.ec-spk-tabs{
  display:flex;gap:10px;overflow-x:auto;scrollbar-width:none;
  padding:6px 4px 16px;margin-bottom:8px;
}
.ec-spk-tabs::-webkit-scrollbar{display:none}
.ec-spk-tab{
  flex:0 0 auto;
  display:inline-flex;align-items:center;gap:8px;
  padding:11px 18px;border-radius:999px;
  border:2px solid var(--lang-line);
  background:#fff;color:var(--lang-ink);
  font-size:13px;font-weight:900;
  cursor:pointer;white-space:nowrap;
  transition:all .18s ease;font-family:inherit;
  box-shadow:0 3px 0 var(--lang-line);
  letter-spacing:.01em;
}
.ec-spk-tab:hover{
  background:var(--lang-lime-soft);
  transform:translateY(-2px);
  box-shadow:0 5px 0 var(--lang-line);
}
.ec-spk-tab:active{
  transform:translateY(1px);
  box-shadow:0 1px 0 var(--lang-line);
}
.ec-spk-tab--active{
  background:var(--lang-ink);color:var(--lang-lime);
  box-shadow:0 3px 0 var(--lang-ink);
}
.ec-spk-tab--active:hover{background:var(--lang-ink);color:var(--lang-lime)}
.ec-spk-tab svg{width:16px;height:16px}

/* ============================================================
   CATEGORY PILLS
   ============================================================ */
.ec-spk-cats{
  display:flex;gap:10px;overflow-x:auto;scrollbar-width:none;
  padding:6px 4px 14px;margin-bottom:8px;
}
.ec-spk-cats::-webkit-scrollbar{display:none}
.ec-spk-cat{
  flex:0 0 auto;
  padding:9px 16px;border-radius:999px;
  border:2px solid var(--lang-line);
  background:#fff;color:var(--lang-ink);
  font-size:12px;font-weight:900;
  cursor:pointer;white-space:nowrap;
  transition:all .16s ease;font-family:inherit;
  display:inline-flex;align-items:center;gap:6px;
  box-shadow:0 3px 0 var(--lang-line);
}
.ec-spk-cat:hover{
  background:var(--lang-lime-soft);
  transform:translateY(-2px);
  box-shadow:0 5px 0 var(--lang-line);
}
.ec-spk-cat:active{
  transform:translateY(1px);
  box-shadow:0 1px 0 var(--lang-line);
}
.ec-spk-cat--active{
  background:var(--lang-ink);color:var(--lang-lime);
  box-shadow:0 3px 0 var(--lang-ink);
}
.ec-spk-cat-count{
  font-size:10px;font-weight:900;
  padding:2px 7px;border-radius:999px;
  background:var(--lang-lime);color:var(--lang-ink);
  border:2px solid var(--lang-line);
}
.ec-spk-cat--active .ec-spk-cat-count{
  background:var(--lang-lime);color:var(--lang-ink);
  border-color:var(--lang-line);
}

/* ============================================================
   GRID
   ============================================================ */
.ec-spk-grid{
  display:grid;grid-template-columns:minmax(0,1fr) 330px;
  gap:22px;align-items:start;
}

/* ============================================================
   RECORD PANEL — chunky card
   ============================================================ */
.ec-spk-panel{
  background:#fff;
  border:3px solid var(--lang-line);
  border-radius:32px;
  padding:28px;
  box-shadow:0 10px 0 var(--lang-line);
  position:relative;overflow:hidden;
  background-image:radial-gradient(circle at 100% 0%,rgba(212,245,92,.14),transparent 55%);
}

.ec-spk-prompt-counter{
  position:relative;z-index:1;
  font-size:12px;font-weight:900;
  color:var(--lang-ink-soft);
  margin:0 0 10px;
  text-transform:uppercase;letter-spacing:.08em;
  display:flex;justify-content:space-between;
  gap:12px;flex-wrap:wrap;align-items:center;
}
.ec-spk-prompt-tag{
  font-size:10.5px;font-weight:900;
  padding:4px 12px;border-radius:999px;
  background:var(--lang-lime);color:var(--lang-ink);
  border:2px solid var(--lang-line);
  box-shadow:0 2px 0 var(--lang-line);
  letter-spacing:.06em;text-transform:uppercase;
}
.ec-spk-prompt-text{
  position:relative;z-index:1;
  font-size:clamp(18px,1.6vw + 12px,22px);
  font-weight:900;line-height:1.4;
  margin:12px 0 20px;
  color:var(--lang-ink);
  letter-spacing:-.02em;max-width:680px;
}
.ec-spk-prompt-hint{
  position:relative;z-index:1;
  font-size:12.5px;color:var(--lang-ink-soft);
  margin:-12px 0 22px;font-weight:700;
}

/* ============================================================
   RECORD BUTTON
   ============================================================ */
.ec-spk-record-wrap{
  position:relative;z-index:1;
  display:inline-flex;align-items:center;justify-content:center;
  width:130px;height:130px;margin:8px auto 4px;
}
.ec-spk-record-ring{
  position:absolute;inset:0;border-radius:50%;
  border:3px solid rgba(123,92,240,.55);
  animation:ec-spk-ring 2.4s ease-out infinite;
}
.ec-spk-record-ring:nth-child(2){animation-delay:.8s}
.ec-spk-record-ring:nth-child(3){animation-delay:1.6s}
@keyframes ec-spk-ring{
  0%{transform:scale(.6);opacity:.9}
  80%{transform:scale(1.35);opacity:0}
  100%{opacity:0}
}
.ec-spk-record-wrap--active .ec-spk-record-ring{border-color:rgba(255,143,203,.75)}

.ec-spk-record-btn{
  position:relative;z-index:1;
  width:92px;height:92px;border-radius:50%;
  border:3px solid var(--lang-line);
  background:linear-gradient(135deg,var(--lang-purple) 0%,var(--lang-purple-2) 100%);
  color:#fff;font-size:32px;
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;
  box-shadow:0 6px 0 var(--lang-line);
  transition:transform .18s ease,box-shadow .18s ease;
}
.ec-spk-record-btn:hover:not(:disabled){
  transform:translateY(-3px);
  box-shadow:0 9px 0 var(--lang-line);
}
.ec-spk-record-btn:active:not(:disabled){
  transform:translateY(2px);
  box-shadow:0 2px 0 var(--lang-line);
}
.ec-spk-record-btn:disabled{opacity:.55;cursor:not-allowed}
.ec-spk-record-btn--active{
  background:linear-gradient(135deg,var(--lang-pink-2) 0%,#E0503C 100%);
  box-shadow:0 6px 0 var(--lang-line);
}

.ec-spk-record-status{
  position:relative;z-index:1;
  font-size:14px;font-weight:900;
  color:var(--lang-ink);
  margin:16px 0 4px;text-align:center;
  letter-spacing:.01em;
}
.ec-spk-record-time{
  position:relative;z-index:1;
  font-size:26px;font-weight:900;
  color:var(--lang-ink);
  letter-spacing:-.03em;
  font-variant-numeric:tabular-nums;
  text-align:center;
  background:var(--lang-lime);
  border:2px solid var(--lang-line);
  border-radius:14px;
  padding:6px 18px;
  display:inline-block;
  box-shadow:0 3px 0 var(--lang-line);
}
.ec-spk-record-wrap + .ec-spk-wave + .ec-spk-record-status + .ec-spk-record-time{
  /* centers the record-time when it's the only child */
  margin-left:auto;margin-right:auto;
}

/* ============================================================
   WAVEFORM
   ============================================================ */
.ec-spk-wave{
  position:relative;z-index:1;
  height:48px;margin:14px auto 8px;
  max-width:420px;
  display:flex;align-items:center;justify-content:center;gap:3px;
}
.ec-spk-wave-bar{
  width:4px;background:var(--lang-ink);border-radius:2px;
  transition:height .15s ease;
}
.ec-spk-wave-idle .ec-spk-wave-bar{
  height:4px !important;opacity:.35;
}
.ec-spk-wave-live .ec-spk-wave-bar{
  background:linear-gradient(180deg,var(--lang-purple-2),var(--lang-purple));
  animation:ec-spk-wave-bounce .8s ease-in-out infinite;
}
@keyframes ec-spk-wave-bounce{
  0%,100%{transform:scaleY(.5)}
  50%{transform:scaleY(1.2)}
}

/* ============================================================
   ERROR PILL
   ============================================================ */
.ec-spk-error{
  position:relative;z-index:1;
  font-size:13px;color:var(--lang-ink);
  background:var(--lang-pink-2);
  padding:12px 16px;border-radius:14px;
  display:inline-block;margin:14px 0 0;
  font-weight:900;
  border:2px solid var(--lang-line);
  box-shadow:0 3px 0 var(--lang-line);
}

/* ============================================================
   LIVE TRANSCRIPT
   ============================================================ */
.ec-spk-transcript{
  position:relative;z-index:1;
  background:var(--lang-lime-soft);
  border:2px solid var(--lang-line);
  border-radius:18px;
  padding:18px 20px;
  margin-top:22px;
  text-align:left;min-height:90px;
  box-shadow:0 4px 0 var(--lang-line);
}
.ec-spk-transcript-label{
  font-size:10.5px;font-weight:900;
  letter-spacing:.1em;text-transform:uppercase;
  color:var(--lang-ink);
  margin:0 0 12px;
  display:flex;align-items:center;gap:6px;
}
.ec-spk-transcript-label::before{
  content:'';width:8px;height:8px;border-radius:50%;
  background:var(--lang-ink);
  box-shadow:0 0 0 3px rgba(23,16,46,.15);
}
.ec-spk-transcript-text{
  font-size:14.5px;line-height:1.7;
  color:var(--lang-ink);margin:0;
  font-weight:700;word-wrap:break-word;
}
.ec-spk-transcript-text em{
  font-style:normal;color:var(--lang-ink-soft);opacity:.85;
}
.ec-spk-transcript-empty{
  font-size:13.5px;color:var(--lang-ink-soft);
  font-style:italic;margin:0;font-weight:600;
}
.ec-spk-transcript mark{
  background:var(--lang-pink-2);
  color:#fff;
  padding:3px 8px;border-radius:8px;
  font-weight:900;
  border:2px solid var(--lang-line);
  box-decoration-break:clone;
  -webkit-box-decoration-break:clone;
}
.ec-spk-transcript-meta{
  display:flex;gap:16px;flex-wrap:wrap;
  margin-top:14px;padding-top:12px;
  border-top:2px dashed rgba(23,16,46,.15);
  font-size:11.5px;font-weight:900;
  color:var(--lang-ink-soft);
  letter-spacing:.02em;
}
.ec-spk-transcript-meta span{display:inline-flex;align-items:center;gap:4px}

/* ============================================================
   SCORE CARDS
   ============================================================ */
.ec-spk-scores{
  display:grid;grid-template-columns:repeat(4,1fr);
  gap:14px;margin-top:24px;position:relative;z-index:1;
}
.ec-spk-score{
  position:relative;
  background:#fff;
  border:2px solid var(--lang-line);
  border-radius:20px;
  padding:16px 10px 14px;
  transition:all .2s ease;
  animation:ec-spk-pop .45s cubic-bezier(.34,1.56,.64,1) both;
  text-align:center;overflow:hidden;
  box-shadow:0 4px 0 var(--lang-line);
}
.ec-spk-score::before{
  content:'';
  position:absolute;
  top:0;left:0;right:0;height:5px;
  background:var(--score-color,var(--lang-purple));
  border-bottom:2px solid var(--lang-line);
}
.ec-spk-score:nth-child(1){animation-delay:.05s}
.ec-spk-score:nth-child(2){animation-delay:.1s}
.ec-spk-score:nth-child(3){animation-delay:.15s}
.ec-spk-score:nth-child(4){animation-delay:.2s}
.ec-spk-score:hover{
  transform:translateY(-3px);
  box-shadow:0 7px 0 var(--lang-line);
}
@keyframes ec-spk-pop{
  from{opacity:0;transform:translateY(14px) scale(.94)}
  to{opacity:1;transform:translateY(0) scale(1)}
}

.ec-spk-score--excellent{--score-color:#B8E62E;}
.ec-spk-score--good{--score-color:#7B5CF0;}
.ec-spk-score--fair{--score-color:#F5E04D;}
.ec-spk-score--low{--score-color:#FF8FCB;}

.ec-spk-score-ring{
  position:relative;
  width:64px;height:64px;
  margin:0 auto 8px;
  display:flex;align-items:center;justify-content:center;
}
.ec-spk-score-ring svg{
  position:absolute;inset:0;
  transform:rotate(-90deg);
}
.ec-spk-score-ring-track{
  fill:none;
  stroke:#E8E5F2;
  stroke-width:5;
}
.ec-spk-score-ring-fill{
  fill:none;
  stroke:var(--score-color,var(--lang-purple));
  stroke-width:5;stroke-linecap:round;
  transition:stroke-dashoffset 1s cubic-bezier(.22,1,.36,1);
}
.ec-spk-score-num{
  position:relative;z-index:1;
  font-size:24px;font-weight:900;
  color:var(--lang-ink);
  line-height:1;letter-spacing:-.04em;
  font-variant-numeric:tabular-nums;
}
.ec-spk-score-label{
  display:block;
  font-size:10px;
  font-weight:900;
  color:var(--lang-ink-soft);
  text-transform:uppercase;
  letter-spacing:.1em;
  margin-top:4px;
}

/* ============================================================
   BAND SCORE
   ============================================================ */
.ec-spk-band{
  position:relative;z-index:1;
  margin-top:18px;
  display:flex;align-items:center;justify-content:center;gap:14px;
  padding:16px 22px;
  border-radius:18px;
  background:var(--lang-yellow);
  border:2px solid var(--lang-line);
  box-shadow:0 4px 0 var(--lang-line);
}
.ec-spk-band-label{
  font-size:12.5px;font-weight:900;
  color:var(--lang-ink);
  text-transform:uppercase;letter-spacing:.08em;
}
.ec-spk-band-value{
  font-size:28px;font-weight:900;
  color:var(--lang-ink);
  line-height:1;letter-spacing:-.03em;
}
.ec-spk-band-value small{
  font-size:14px;font-weight:800;
  color:var(--lang-ink);opacity:.7;
  letter-spacing:0;margin-left:2px;
}

/* ============================================================
   FAULT REPORT
   ============================================================ */
.ec-spk-faults{
  margin-top:24px;position:relative;z-index:1;text-align:left;
}
.ec-spk-faults-head{
  display:flex;align-items:center;justify-content:space-between;
  gap:12px;margin-bottom:16px;flex-wrap:wrap;
}
.ec-spk-faults-title{
  margin:0;font-size:17px;font-weight:900;
  color:var(--lang-ink);letter-spacing:-.02em;
}
.ec-spk-faults-pill{
  font-size:11px;font-weight:900;
  padding:6px 14px;border-radius:999px;
  letter-spacing:.06em;text-transform:uppercase;
  border:2px solid var(--lang-line);
  box-shadow:0 2px 0 var(--lang-line);
}
.ec-spk-faults-pill--ok{
  background:var(--lang-lime);color:var(--lang-ink);
}
.ec-spk-faults-pill--warn{
  background:var(--lang-yellow);color:var(--lang-ink);
}
.ec-spk-faults-pill--bad{
  background:var(--lang-pink-2);color:#fff;
}
.ec-spk-fault{
  display:flex;gap:14px;align-items:flex-start;
  padding:14px 16px;border-radius:16px;
  margin-bottom:12px;
  background:#fff;
  border:2px solid var(--lang-line);
  box-shadow:0 3px 0 var(--lang-line);
  transition:transform .18s ease,box-shadow .18s ease;
}
.ec-spk-fault:hover{
  transform:translateY(-2px);
  box-shadow:0 5px 0 var(--lang-line);
}
.ec-spk-fault-icon{
  width:36px;height:36px;border-radius:12px;
  display:flex;align-items:center;justify-content:center;
  font-size:16px;flex-shrink:0;
  border:2px solid var(--lang-line);
  font-weight:900;
}
.ec-spk-fault--ok .ec-spk-fault-icon{background:var(--lang-lime);color:var(--lang-ink)}
.ec-spk-fault--warn .ec-spk-fault-icon{background:var(--lang-yellow);color:var(--lang-ink)}
.ec-spk-fault--bad .ec-spk-fault-icon{background:var(--lang-pink-2);color:#fff}
.ec-spk-fault--ok{background:linear-gradient(180deg,#fff 0%,rgba(212,245,92,.08) 100%)}
.ec-spk-fault--warn{background:linear-gradient(180deg,#fff 0%,rgba(245,224,77,.10) 100%)}
.ec-spk-fault--bad{background:linear-gradient(180deg,#fff 0%,rgba(255,143,203,.10) 100%)}
.ec-spk-fault-body{flex:1;min-width:0}
.ec-spk-fault-body p{
  margin:0 0 4px;font-size:13.5px;font-weight:900;
  color:var(--lang-ink);
}
.ec-spk-fault-body span{
  font-size:12.5px;color:var(--lang-ink-soft);
  line-height:1.55;font-weight:700;display:block;
}
.ec-spk-fault-body em{
  font-style:normal;
  background:var(--lang-yellow);
  color:var(--lang-ink);
  padding:2px 8px;border-radius:6px;
  font-weight:900;font-size:12px;
  border:1.5px solid var(--lang-line);
}

/* ============================================================
   FEEDBACK
   ============================================================ */
.ec-spk-feedback{
  margin:20px 0 0;
  padding:18px 20px 18px 22px;
  background:#fff;
  border:2px solid var(--lang-line);
  border-left:6px solid var(--lang-lime);
  border-radius:16px;
  font-size:14px;line-height:1.65;
  color:var(--lang-ink);
  text-align:left;position:relative;z-index:1;
  font-weight:700;
  box-shadow:0 4px 0 var(--lang-line);
}

/* ============================================================
   ACTION BUTTONS
   ============================================================ */
.ec-spk-actions{
  display:flex;justify-content:center;gap:12px;
  margin-top:26px;flex-wrap:wrap;position:relative;z-index:1;
}
.ec-spk-btn-ghost{
  border:2px solid var(--lang-line);
  background:#fff;color:var(--lang-ink);
  padding:13px 24px;border-radius:999px;
  font-size:13.5px;font-weight:900;
  cursor:pointer;font-family:inherit;
  display:inline-flex;align-items:center;gap:8px;
  transition:all .16s ease;
  box-shadow:0 4px 0 var(--lang-line);
  letter-spacing:.02em;
}
.ec-spk-btn-ghost:hover{
  background:var(--lang-lime-soft);
  transform:translateY(-2px);
  box-shadow:0 6px 0 var(--lang-line);
}
.ec-spk-btn-ghost:active{
  transform:translateY(2px);
  box-shadow:0 1px 0 var(--lang-line);
}
.ec-spk-btn-dark{
  border:2px solid var(--lang-line);
  background:var(--lang-ink);color:var(--lang-lime);
  padding:13px 26px;border-radius:999px;
  font-size:13.5px;font-weight:900;
  cursor:pointer;font-family:inherit;
  display:inline-flex;align-items:center;gap:8px;
  transition:all .16s ease;
  box-shadow:0 4px 0 var(--lang-line);
  letter-spacing:.02em;
}
.ec-spk-btn-dark:hover{
  transform:translateY(-2px);
  box-shadow:0 6px 0 var(--lang-line);
}
.ec-spk-btn-dark:active{
  transform:translateY(2px);
  box-shadow:0 1px 0 var(--lang-line);
}

/* ============================================================
   CONVERSATION
   ============================================================ */
.ec-spk-convo{
  background:#fff;
  border:3px solid var(--lang-line);
  border-radius:32px;
  padding:26px;
  box-shadow:0 10px 0 var(--lang-line);
  display:flex;flex-direction:column;
  height:calc(100vh - 300px);min-height:540px;max-height:760px;
  background-image:radial-gradient(circle at 100% 0%,rgba(255,143,203,.12),transparent 55%);
}
.ec-spk-convo-head{
  margin:0 0 8px;font-size:18px;font-weight:900;
  color:var(--lang-ink);flex-shrink:0;
  letter-spacing:-.02em;
}
.ec-spk-convo-sub{
  margin:0 0 20px;font-size:13px;
  color:var(--lang-ink-soft);
  line-height:1.55;flex-shrink:0;font-weight:700;
}
.ec-spk-convo-log{
  flex:1;display:flex;flex-direction:column;gap:12px;
  overflow-y:auto;padding-right:6px;margin-bottom:16px;min-height:0;
}
.ec-spk-convo-log::-webkit-scrollbar{width:6px}
.ec-spk-convo-log::-webkit-scrollbar-thumb{
  background:var(--lang-purple-2);border-radius:999px;
}
.ec-spk-convo-msg{
  border-radius:18px;
  padding:13px 18px;
  max-width:82%;
  font-size:14px;line-height:1.55;
  word-wrap:break-word;
  animation:ec-spk-msg-in .35s ease both;
  font-weight:700;
  border:2px solid var(--lang-line);
  box-shadow:0 3px 0 var(--lang-line);
}
@keyframes ec-spk-msg-in{
  from{opacity:0;transform:translateY(8px)}
  to{opacity:1;transform:translateY(0)}
}
.ec-spk-convo-msg--ai{
  align-self:flex-start;
  background:var(--lang-lime);
  color:var(--lang-ink);
  border-bottom-left-radius:6px;
}
.ec-spk-convo-msg--user{
  align-self:flex-end;
  background:var(--lang-ink);
  color:var(--lang-lime);
  border-bottom-right-radius:6px;
}
.ec-spk-convo-msg audio{
  display:block;margin-top:10px;
  width:100%;max-width:240px;
}
.ec-spk-convo-thinking{
  align-self:flex-start;
  display:inline-flex;align-items:center;gap:6px;
  padding:13px 20px;border-radius:18px;
  background:var(--lang-lime);
  color:var(--lang-ink);
  font-size:13px;font-weight:900;
  border:2px solid var(--lang-line);
  box-shadow:0 3px 0 var(--lang-line);
}
.ec-spk-convo-thinking span{
  width:6px;height:6px;border-radius:50%;
  background:currentColor;
  animation:ec-spk-dot 1.2s ease-in-out infinite;
}
.ec-spk-convo-thinking span:nth-child(2){animation-delay:.2s}
.ec-spk-convo-thinking span:nth-child(3){animation-delay:.4s}
@keyframes ec-spk-dot{
  0%,80%,100%{opacity:.3;transform:scale(.8)}
  40%{opacity:1;transform:scale(1.1)}
}
.ec-spk-convo-actions{
  display:flex;justify-content:center;gap:12px;
  flex-wrap:wrap;flex-shrink:0;
}

/* ============================================================
   HISTORY
   ============================================================ */
.ec-spk-history{display:flex;flex-direction:column;gap:14px}
.ec-spk-history-item{
  display:flex;justify-content:space-between;align-items:center;
  gap:12px;background:#fff;
  border-radius:18px;padding:16px 20px;
  border:2px solid var(--lang-line);
  box-shadow:0 4px 0 var(--lang-line);
  transition:all .18s ease;
  animation:ec-spk-msg-in .35s ease both;
}
.ec-spk-history-item:hover{
  transform:translateY(-3px);
  box-shadow:0 7px 0 var(--lang-line);
}
.ec-spk-history-title{
  margin:0 0 4px;font-weight:900;font-size:14px;
  color:var(--lang-ink);
}
.ec-spk-history-date{
  font-size:11.5px;color:var(--lang-ink-soft);
  font-weight:700;
}
.ec-spk-band-pill{
  font-size:11px;font-weight:900;
  padding:6px 14px;border-radius:999px;
  background:var(--lang-lime);color:var(--lang-ink);
  border:2px solid var(--lang-line);
  box-shadow:0 2px 0 var(--lang-line);
  text-transform:uppercase;letter-spacing:.06em;
  white-space:nowrap;
}

/* ============================================================
   EMPTY STATES
   ============================================================ */
.ec-spk-empty{
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  gap:12px;text-align:center;
  padding:52px 24px;
  color:var(--lang-ink-soft);
  font-size:13.5px;font-weight:700;
  background:#fff;
  border-radius:22px;
  border:2px dashed var(--lang-line);
}
.ec-spk-empty-icon{
  width:64px;height:64px;border-radius:50%;
  background:var(--lang-lime);
  color:var(--lang-ink);
  display:flex;align-items:center;justify-content:center;
  font-size:24px;
  border:2px solid var(--lang-line);
  box-shadow:0 3px 0 var(--lang-line);
}
.ec-spk-empty-icon svg{width:28px;height:28px}

/* ============================================================
   SIDEBAR CARDS
   ============================================================ */
.ec-spk-side{
  background:#fff;
  border:2px solid var(--lang-line);
  border-radius:24px;
  padding:22px;
  box-shadow:0 6px 0 var(--lang-line);
  margin-bottom:16px;
}
.ec-spk-side:last-child{margin-bottom:0}
.ec-spk-side h3{
  margin:0 0 16px;font-size:15px;font-weight:900;
  color:var(--lang-ink);
  display:flex;justify-content:space-between;
  align-items:center;gap:8px;letter-spacing:-.01em;
}
.ec-spk-side h3 span{
  font-size:10.5px;
  color:var(--lang-ink);
  background:var(--lang-lime);
  padding:4px 11px;border-radius:999px;
  font-weight:900;
  text-transform:uppercase;letter-spacing:.06em;
  border:2px solid var(--lang-line);
  box-shadow:0 2px 0 var(--lang-line);
}
.ec-spk-tip{
  display:flex;gap:12px;padding:12px 0;
  border-bottom:2px dashed rgba(23,16,46,.1);
  align-items:flex-start;
}
.ec-spk-tip:last-child{border-bottom:none;padding-bottom:0}
.ec-spk-tip-icon{
  width:34px;height:34px;border-radius:11px;
  background:var(--lang-purple-2);color:#fff;
  display:flex;align-items:center;justify-content:center;
  flex-shrink:0;font-size:14px;font-weight:900;
  border:2px solid var(--lang-line);
  box-shadow:0 2px 0 var(--lang-line);
}
.ec-spk-tip-body p{
  margin:0 0 3px;font-size:12.5px;font-weight:900;
  color:var(--lang-ink);
}
.ec-spk-tip-body span{
  font-size:11.5px;color:var(--lang-ink-soft);
  line-height:1.45;display:block;font-weight:600;
}
.ec-spk-criteria{display:flex;flex-direction:column;gap:10px}
.ec-spk-criteria-item{
  display:flex;align-items:center;justify-content:space-between;
  gap:10px;font-size:12.5px;font-weight:900;
  color:var(--lang-ink);
  padding:12px 15px;border-radius:14px;
  background:var(--lang-lime-soft);
  border:2px solid var(--lang-line);
  box-shadow:0 2px 0 var(--lang-line);
  transition:transform .15s ease;
}
.ec-spk-criteria-item:hover{transform:translateX(3px)}
.ec-spk-criteria-item span:last-child{
  font-size:10.5px;color:var(--lang-ink);
  background:var(--lang-lime);
  padding:3px 10px;border-radius:999px;
  font-weight:900;
  text-transform:uppercase;letter-spacing:.06em;
  border:2px solid var(--lang-line);
}

/* ============================================================
   TOAST
   ============================================================ */
.ec-spk-toast{
  position:fixed;top:78px;right:20px;z-index:50;
  background:var(--lang-ink);color:var(--lang-lime);
  padding:12px 22px;border-radius:999px;
  font-weight:900;font-size:13px;
  border:2px solid var(--lang-lime);
  box-shadow:0 12px 28px rgba(23,16,46,.4);
  animation:ec-spk-toast-pop 1s ease both;
  letter-spacing:.03em;
}
@keyframes ec-spk-toast-pop{
  0%{transform:translateY(-10px) scale(.9);opacity:0}
  20%{transform:translateY(0) scale(1);opacity:1}
  80%{transform:translateY(0) scale(1);opacity:1}
  100%{transform:translateY(-8px) scale(.98);opacity:0}
}

/* ============================================================
   ANIMATIONS
   ============================================================ */
@keyframes ec-spk-fade-in{
  from{opacity:0;transform:translateY(12px)}
  to{opacity:1;transform:translateY(0)}
}
.ec-spk-anim{animation:ec-spk-fade-in .45s ease both}

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width:900px){
  .ec-spk-grid{grid-template-columns:1fr;gap:18px}
  .ec-spk-hero{flex-direction:column;align-items:flex-start;min-height:0}
  .ec-spk-hero-mascot{
    position:absolute;right:14px;bottom:14px;
    transform:scale(.72);transform-origin:bottom right;
    animation:none;
  }
}
@media (max-width:720px){
  .ec-spk-hero{padding:22px 20px;border-radius:26px}
  .ec-spk-hero h1{font-size:23px}
  .ec-spk-hero p{font-size:13px}
  .ec-spk-hero-stats{gap:8px;margin-top:14px}
  .ec-spk-hero-stat{padding:8px 12px;min-width:74px;border-radius:12px}
  .ec-spk-hero-stat strong{font-size:17px}
  .ec-spk-hero-stat span{font-size:9px}
  .ec-spk-hero-mascot{display:none}
  .ec-spk-panel{padding:22px 18px;border-radius:26px;box-shadow:0 7px 0 var(--lang-line)}
  .ec-spk-record-wrap{width:114px;height:114px}
  .ec-spk-record-btn{width:82px;height:82px;font-size:28px}
  .ec-spk-scores{grid-template-columns:1fr 1fr;gap:12px}
  .ec-spk-score-ring{width:56px;height:56px}
  .ec-spk-score-num{font-size:22px}
  .ec-spk-score-label{font-size:9.5px}
  .ec-spk-band-value{font-size:24px}
  .ec-spk-convo{
    padding:20px;border-radius:26px;
    height:auto;min-height:540px;max-height:none;
    box-shadow:0 7px 0 var(--lang-line);
  }
  .ec-spk-convo-log{max-height:340px}
  .ec-spk-convo-msg{max-width:92%}
  .ec-spk-history-item{padding:14px 16px}
  .ec-spk-side{padding:18px;border-radius:20px;box-shadow:0 5px 0 var(--lang-line)}
  .ec-spk-fault{padding:12px 14px}
  .ec-spk-faults-title{font-size:16px}
}
@media (max-width:380px){
  .ec-spk-scores{grid-template-columns:1fr 1fr;gap:10px}
  .ec-spk-score{padding:12px 8px}
  .ec-spk-score-num{font-size:20px}
  .ec-spk-tab{padding:10px 14px;font-size:12px}
  .ec-spk-cat{padding:8px 13px;font-size:11.5px}
}
@media (prefers-reduced-motion: reduce){
  .ec-spk-anim,.ec-spk-score,.ec-spk-convo-msg,.ec-spk-history-item,.ec-spk-toast{animation:none!important}
  .ec-spk-hero-orb,.ec-spk-hero-mascot,.ec-spk-record-ring,.ec-spk-wave-bar,.ec-spk-convo-thinking span{animation:none!important}
  .ec-spk-record-btn,.ec-spk-tab,.ec-spk-cat,.ec-spk-btn-ghost,.ec-spk-btn-dark,.ec-spk-fault,.ec-spk-history-item,.ec-spk-criteria-item{transition:none!important}
  .ec-spk-score-ring-fill{transition:none!important}
}
`;

/* ============================================================
   600+ EXERCISES ACROSS 10 CATEGORIES
   ============================================================ */
const PROMPT_BANK = {
  pron: {
    name: 'Pronunciation Drills', icon: 'mic',
    prompts: [
      'The thirty-three thieves thought that they thrilled the throne throughout Thursday.',
      'She sells seashells by the seashore, and the shells she sells are seashells I’m sure.',
      'Peter Piper picked a peck of pickled peppers.',
      'How much wood would a woodchuck chuck if a woodchuck could chuck wood?',
      'Red lorry, yellow lorry, red lorry, yellow lorry.',
      'Which witch switched the Swiss wristwatches?',
      'I scream, you scream, we all scream for ice cream.',
      'Betty bought a bit of butter, but the bit of butter Betty bought was bitter.',
      'Fresh fried fish, fish fresh fried, fried fish fresh, fish fried fresh.',
      'A proper copper coffee pot, a proper cup of coffee from a proper copper coffee pot.',
      'Six sleek swans swam swiftly southwards.',
      'The sixth sick sheikh’s sixth sheep’s sick.',
      'Eleven benevolent elephants.',
      'Truly rural, truly rural, truly rural.',
      'The blue bluebird blinks.',
      'Black background, brown background, black background, brown background.',
      'A big black bug bit a big black bear.',
      'The ragged rascal ran around the rugged rock.',
      'Double bubble gum, bubbles double.',
      'How can a clam cram in a clean cream can?',
      'Fuzzy Wuzzy was a bear. Fuzzy Wuzzy had no hair.',
      'A skunk sat on a stump and thunk the stump stunk.',
      'Lesser leather never weathered wetter weather better.',
      'The cat crept into the crypt, crapped, and crept out.',
      'I thought a thought. But the thought I thought wasn’t the thought I thought I thought.',
      'Snap crackle pop, snap crackle pop, snap crackle pop.',
      'Three thin trees, three thin trees, three thin trees.',
      'Rory the warrior and Roger the worrier were reared wrongly in a rural brewery.',
      'Picky people pick Peter Pan peanut butter.',
      'Selfish shellfish, selfish shellfish.',
      'Which wristwatches are Swiss wristwatches?',
      'Send toast to ten tense stout saints’ ten tall tents.',
      'Four fine fresh fish for you.',
      'Thirty thousand thirsty thieves thundered through the thicket.',
      'Unique New York, unique New York, unique New York.',
      'Twelve twins twirled twelve twigs.',
      'The soldier’s shoulder surely hurts.',
      'She sees cheese, she sees cheese, she sees cheese.',
      'Nine nice night nurses nursing nicely.',
      'Quick kiss, quick kiss, quick kiss.',
      'Green glass globes glow greenly.',
      'A box of biscuits, a box of mixed biscuits, and a biscuit mixer.',
      'Blue glue gun, green glue gun, blue glue gun, green glue gun.',
      'Crisp crusts crackle crunchily.',
      'Two toads, totally tired, tried to trot to Toad Hall.',
      'Chester cheetah chews a chunk of cheap cheddar cheese.',
      'A tutor who tooted the flute tried to tutor two tooters to toot.',
      'Six sticky skeletons, six sticky skeletons.',
      'Wayne went to Wales to watch walruses.',
      'Fred fed Ted bread and Ted fed Fred bread.',
      'Bake big batches of bitter brown bread.',
      'A pessimistic pest exists amidst us.',
      'Pope Sixtus VI’s sixth sheep’s sick.',
      'Ripe white wheat reapers reap ripe white wheat right.',
      'How many cookies could a good cook cook if a good cook could cook cookies?',
      'Three free throws, three free throws, three free throws.',
      'Ann and Andy’s anniversary is in April.',
      'Blake the baker bakes black bread.',
      'The epitome of femininity is a woman who says what she means.',
      'Greek grapes, Greek grapes, Greek grapes.',
      'A synonym for cinnamon is a cinnamon synonym.',
      'Fresh French fried fly fritters.',
      'The myth of Miss Muffet.',
      'Sam’s shop stocks short spotted socks.',
      'Cows graze in groves on grass which grows in grooves in groves.',
      'A slimy snake slithered slowly sideways.',
      'The thirty-three thieves thrilled the throne throughout Thursday.',
      'Imagine an imaginary menagerie manager imagining managing an imaginary menagerie.',
      'A loyal warrior will rarely worry why we rule.',
      'Susie works in a shoeshine shop, she shines shoes in the shop.',
      'A rough-coated, dough-faced, thoughtful ploughman strode through the streets of Scarborough.',
      'Give papa a cup of proper coffee in a copper coffee cup.',
      'You know New York, you need New York, you know you need unique New York.',
      'Denise sees the fleece, Denise sees the fleas.',
      'How many cans can a cannibal nibble if a cannibal can nibble cans?',
      'I wish to wash my Irish wristwatch.',
      'The great Greek grape growers grow great Greek grapes.',
      'A flea and a fly flew up in a flue.',
      'I saw Susie sitting in a shoeshine shop.',
      'A Tudor who tooted a flute tried to tutor two tooters to toot.',
      'Nine nimble noblemen nibbled nuts.',
      'The sixth sheikh’s sixth sheep is sick.',
      'Two tiny tigers take two taxis to town.',
      'Elizabeth’s birthday is on the third Thursday of this month.',
      'A big black bear sat on a big black rug.',
      'Six short slow shepherds.',
      'The queen in green screamed.',
      'Crisp crusts crackle crunchily, crisp crusts crackle crunchily.',
      'Pablo Picasso put paint on paper.',
      'Six slippery snails slid slowly seaward.',
      'Three grey geese in a green field grazing.',
      'A cup of proper coffee in a copper coffee cup.',
      'The seething sea ceaseth and thus the seething sea sufficeth us.',
      'I’m not the pheasant plucker, I’m the pheasant plucker’s son.',
      'Moses supposes his toeses are roses.',
      'She stood on the balcony inexplicably mimicking him hiccuping.',
      'Betty Botter bought some butter but she said the butter’s bitter.',
      'A pleasant place to place a plaice is a place where a plaice is pleased to be placed.',
      'The blacksmith made a horseshoe for the horse.',
      'A proper cup of coffee from a proper copper coffee pot.',
    ],
  },
  ielts1: {
    name: 'IELTS Part 1 · Short Answers', icon: 'chat',
    prompts: [
      'What is your full name?',
      'Where are you from?',
      'Do you work or are you a student?',
      'What do you like most about your hometown?',
      'Do you live in a house or an apartment?',
      'What is your favourite room in your home?',
      'Who do you live with?',
      'What kind of food do you like?',
      'Do you cook at home?',
      'How often do you eat out?',
      'What do you usually do in the evenings?',
      'Do you prefer mornings or evenings?',
      'How do you usually travel to work or school?',
      'Do you like reading?',
      'What kind of books do you read?',
      'Do you prefer paper books or e-books?',
      'Do you enjoy music?',
      'What kind of music do you listen to?',
      'Have you ever played a musical instrument?',
      'Do you like sports?',
      'What sports do you play?',
      'How often do you exercise?',
      'Do you like watching sports on TV?',
      'What is your favourite sport to watch?',
      'Do you enjoy travelling?',
      'What places have you visited recently?',
      'Where would you like to travel next?',
      'Do you prefer travelling alone or with others?',
      'Do you like meeting new people?',
      'Are you good at remembering names?',
      'What do you do on weekends?',
      'How do you usually spend your holidays?',
      'What is your favourite season?',
      'Do you like rainy days?',
      'What is the weather like in your city?',
      'Do you prefer hot or cold weather?',
      'What kind of clothes do you like to wear?',
      'Do you like shopping?',
      'What do you usually shop for?',
      'Do you prefer shopping online or in stores?',
      'What do you do when you feel stressed?',
      'How do you relax?',
      'Do you have any hobbies?',
      'How much time do you spend on your hobby?',
      'Are you good at drawing or painting?',
      'Do you enjoy photography?',
      'Do you have a pet?',
      'What pets do you like?',
      'Do you like animals?',
      'Do you have any brothers or sisters?',
      'How often do you see your extended family?',
      'Who are you closest to in your family?',
      'What do you usually do with your family?',
      'Do you have a large family or a small family?',
      'Do you enjoy family gatherings?',
      'What is your favourite memory with your family?',
      'How did you celebrate birthdays as a child?',
      'What kind of presents do you like to receive?',
      'Do you like giving presents?',
      'What is the best gift you have ever received?',
      'Do you use public transport?',
      'How do you usually get around your city?',
      'What is your favourite way to travel?',
      'Do you like driving?',
      'Have you ever used a bike to commute?',
      'Do you prefer trains or buses?',
      'Do you like watching movies?',
      'What kind of movies do you enjoy?',
      'How often do you go to the cinema?',
      'Who do you usually watch movies with?',
      'What is your favourite movie and why?',
      'Do you prefer comedy or drama?',
      'Do you like TV series?',
      'Do you binge-watch shows?',
      'What is the last series you watched?',
      'Do you play video games?',
      'What games do you like?',
      'How often do you play?',
      'Do you use social media?',
      'What social media platform do you use most?',
      'How much time do you spend on social media daily?',
    ],
  },
  ielts2: {
    name: 'IELTS Part 2 · Cue Cards', icon: 'book',
    prompts: [
      'Describe a place you visited recently that you really enjoyed. Say where it is, who you went with, what you did, and why you enjoyed it.',
      'Talk about a skill you would like to learn and explain why. Say what the skill is, how you would learn it, and how it would help you.',
      'Describe a memorable meal you had with your family or friends. Say where it was, what you ate, who you were with, and why it was memorable.',
      'Talk about a book or film that changed the way you think about something. Say what it was, what it was about, and how it changed your thinking.',
      'Describe your daily routine and how you would like to change it. Say what you do, when you do it, and what you would change and why.',
      'Describe a person who has influenced you the most. Say who they are, how you know them, and why they have influenced you.',
      'Talk about a technology you use every day and why it matters. Say what it is, when you started using it, and how it has changed your life.',
      'Describe a memorable journey you have taken. Say where you went, who with, what happened, and why it was memorable.',
      'Describe a piece of advice you received that was helpful. Say who gave it to you, what it was, and how it helped.',
      'Talk about a hobby you enjoy and explain why. Say what it is, when you started it, and why you continue it.',
      'Describe a teacher who had a big impact on you. Say who they were, what they taught, and why they were special.',
      'Talk about a time when you helped someone. Say who you helped, what you did, and how you felt afterwards.',
      'Describe a childhood memory that makes you happy. Say what happened, when, who was involved, and why it makes you happy.',
      'Talk about a goal you have and how you plan to reach it. Say what it is, when you set it, and how you plan to achieve it.',
      'Describe a city you would like to live in for a year. Say which city it is, what you know about it, and why you would like to live there.',
      'Talk about a book you recently read. Say what the book was, what it was about, and why you liked or disliked it.',
      'Describe a photograph that means a lot to you. Say when it was taken, who is in it, and why it matters.',
      'Talk about a decision you regret. Say what you decided, why, and what you would do differently.',
      'Describe a restaurant you enjoy. Say where it is, what kind of food it serves, and why you like it.',
      'Talk about a festival you celebrate. Say what it is, when it is celebrated, and why it matters to you.',
      'Describe a piece of clothing you love. Say what it is, when you wear it, and why you love it.',
      'Talk about a TV show you enjoy. Say what it is, when you watch it, and why you like it.',
      'Describe a sport you would like to try. Say what it is, where you could try it, and why it interests you.',
      'Talk about a job you would like to have. Say what it is, what it involves, and why it appeals to you.',
      'Describe an interesting person you met recently. Say who they are, where you met, and why they are interesting.',
      'Talk about a place where you like to relax. Say where it is, when you go there, and why it helps you relax.',
      'Describe a childhood toy you loved. Say what it was, who gave it to you, and why you loved it.',
      'Talk about an app on your phone you use often. Say what it is, when you started using it, and why it is useful.',
      'Describe a family tradition you enjoy. Say what it is, when it happens, and why it matters.',
      'Talk about something you are good at. Say what it is, how you became good at it, and how it helps you.',
      'Describe a place in your country that tourists should visit. Say where it is, what it offers, and why tourists should go.',
      'Talk about a famous person from your country. Say who they are, what they do, and why they are famous.',
      'Describe a favourite childhood game. Say what it was, how it was played, and why you enjoyed it.',
      'Talk about an important event in your life. Say what happened, when, and why it was important.',
      'Describe a museum or art gallery you visited. Say where it was, what you saw, and what you thought.',
      'Talk about a song that means something to you. Say what the song is, when you first heard it, and why it matters.',
      'Describe a plant or flower you like. Say what it is, where it grows, and why you like it.',
      'Talk about a time you were late. Say what happened, why you were late, and how you felt.',
      'Describe a conversation you had that changed your mind. Say who with, what about, and how it changed your view.',
      'Talk about a subject you enjoyed studying. Say what it was, when you studied it, and why you enjoyed it.',
      'Describe a popular person in your school or work. Say who they are, what makes them popular, and how they influence others.',
      'Talk about a time you were proud of yourself. Say what you did, when, and why you were proud.',
      'Describe a piece of news you remember clearly. Say what it was, when you heard it, and why you remember it.',
      'Talk about a habit you would like to break. Say what the habit is, how long you have had it, and how you plan to break it.',
      'Describe a sports event you watched. Say what it was, where, and what made it exciting.',
      'Talk about a small business you would like to start. Say what it is, why you would start it, and what you would need.',
      'Describe a place where you feel at home. Say where it is, when you go there, and why it feels like home.',
      'Talk about an invention that changed the world. Say what it is, who invented it, and how it changed things.',
      'Describe a course you would like to take. Say what it is, where you could take it, and why you would like to.',
      'Talk about a conversation with a stranger. Say when it happened, what you talked about, and what you learned.',
      'Describe a time you gave someone advice. Say who they were, what the advice was, and how it helped.',
      'Talk about a movie you would recommend. Say what it is, what it is about, and why you recommend it.',
      'Describe a family member you admire. Say who they are, what they do, and why you admire them.',
      'Talk about a book you would like to write. Say what it would be about, who the characters would be, and why you would write it.',
      'Describe a time when you helped a stranger. Say where it happened, what you did, and how it made you feel.',
      'Talk about a time when you learned something new. Say what you learned, how you learned it, and why it mattered.',
      'Describe a place where you like to study or work. Say where it is, what it looks like, and why it helps you.',
      'Talk about a piece of art you like. Say what it is, where you saw it, and why you like it.',
    ],
  },
  ielts3: {
    name: 'IELTS Part 3 · Discussion', icon: 'users',
    prompts: [
      'Why do you think some people are better at learning languages than others?',
      'How has technology changed the way people communicate?',
      'Do you think traditional shops will disappear because of online shopping?',
      'Should governments invest more in public transport? Why or why not?',
      'What are the advantages and disadvantages of working from home?',
      'How can schools help students become more creative?',
      'Do you think exams are a good way to measure intelligence?',
      'Why is it important for children to learn a second language?',
      'What effect does social media have on young people?',
      'Should universities be free for everyone? Why or why not?',
      'How has globalisation affected local cultures?',
      'What role should parents play in their children’s education?',
      'Do you think AI will replace human teachers?',
      'What are the biggest challenges facing your country today?',
      'How can we encourage people to live more sustainably?',
      'Is it better to live in a city or in the countryside? Why?',
      'How important is it to preserve historic buildings?',
      'What influence do celebrities have on society?',
      'Should the government regulate fast food advertising?',
      'Why do people enjoy watching sports?',
      'What makes a good leader?',
      'How has the internet changed the way people learn?',
      'Do you think tourism is good or bad for local communities?',
      'Should the retirement age be raised? Why or why not?',
      'How can we reduce plastic waste?',
      'What role does money play in happiness?',
      'Should students be allowed to choose their own subjects?',
      'What are the pros and cons of living alone?',
      'How do you think jobs will change in the next 20 years?',
      'Should violent video games be banned? Why or why not?',
      'Why do some people volunteer?',
      'What makes a city a good place to live?',
      'Should wealthy nations help poorer ones? Why?',
      'How important is handwriting in the digital age?',
      'Do you think space exploration is worth the cost?',
      'Why do people enjoy travelling to other countries?',
      'How can families stay close in a busy world?',
      'Should children have their own smartphones?',
      'How has climate change affected your country?',
      'Is it important to learn history? Why?',
      'What can be done to reduce traffic in big cities?',
      'Should companies allow employees to dress casually?',
      'What makes some books popular for generations?',
      'How does music affect our mood?',
      'Should sports stars be paid more than teachers?',
      'Why do some people avoid change?',
      'How can we encourage more women to study science?',
      'Do you think happiness can be measured?',
      'Should there be limits on the number of cars in a city?',
      'How has your country changed in the last 20 years?',
    ],
  },
  conv: {
    name: 'Conversation Starters', icon: 'chat',
    prompts: [
      'Tell me about your best friend and how you met.',
      'What was your favourite thing to do as a child?',
      'If you could travel anywhere tomorrow, where would you go?',
      'What is the best meal you have ever had?',
      'Tell me about a teacher you will never forget.',
      'What is something new you learned this week?',
      'What does your typical weekend look like?',
      'What is the last movie that made you cry?',
      'Who is the most interesting person you know?',
      'If you had a superpower, what would it be?',
      'What is your favourite season and why?',
      'What is a book that changed your life?',
      'Describe your dream house.',
      'What is a hobby you have recently picked up?',
      'What is something you are looking forward to?',
      'What is a small thing that makes you happy?',
      'Tell me about a time you helped someone.',
      'What is the best advice you have ever received?',
      'What would you do if you won the lottery?',
      'What is your favourite family tradition?',
      'What is a skill you wish you had?',
      'Describe the perfect day.',
      'What is your favourite song right now?',
      'What is something you want to learn this year?',
      'Tell me about a time you were scared.',
      'What makes you laugh?',
      'What would you like to be famous for?',
      'What is your biggest pet peeve?',
      'What is a country you want to visit?',
      'Describe a moment when you felt proud.',
      'What is your favourite way to relax?',
      'What is something you are grateful for?',
      'Tell me about a place you feel safe.',
      'What is the most beautiful place you have seen?',
      'What is a food you could eat every day?',
      'Tell me about a memorable birthday.',
      'What is something people misunderstand about you?',
      'What is your favourite memory from school?',
      'If you could meet anyone, who would it be?',
      'What is a goal you are working towards?',
      'Tell me about your first job.',
      'What is a smell that reminds you of childhood?',
      'What is the bravest thing you have ever done?',
      'What makes a good friend?',
      'What is a movie you can watch again and again?',
      'What is the best gift you have ever given?',
      'What is a question you wish people asked you?',
      'Describe a moment when you felt truly happy.',
      'What is a language you would like to learn?',
      'What is your favourite thing about your family?',
      'What is the most useful app on your phone?',
      'What is a change you want to make in your life?',
      'What is your favourite childhood story?',
      'What is the best concert you have been to?',
      'What is a small habit that improved your life?',
      'What is your dream job?',
      'What is the most exciting thing you have done?',
      'What is something you believed as a child that was wrong?',
      'Tell me about a time you made a mistake and learned from it.',
      'What is your favourite way to spend a rainy day?',
      'What is a place that feels like home to you?',
      'What is your favourite thing to cook?',
      'What is a compliment you will never forget?',
      'What is a movie that surprised you?',
      'What is a book you could not put down?',
      'What is something you have always wanted to try?',
      'What is a good habit you want to build?',
      'What is something you have learned from failure?',
      'What is your favourite part of the day?',
      'What is a country you would like to live in?',
      'What is a subject you wish you studied more?',
      'What is a challenge you overcame?',
      'What is something that makes you feel nostalgic?',
      'What is a song that always cheers you up?',
      'What is your favourite restaurant and why?',
      'What is something you do every day without fail?',
      'What is your favourite thing about yourself?',
      'What is a small act of kindness you witnessed?',
      'What is a decision that changed your life?',
      'What is something that calms you down?',
      'What is your favourite weekend activity?',
    ],
  },
  role: {
    name: 'Role Plays', icon: 'users',
    prompts: [
      'You are at a restaurant. Order a meal, ask about ingredients, and request the bill.',
      'You are at an airport. Check in for your flight, ask about the gate, and request a window seat.',
      'You are at a hotel. Make a complaint about the noise and ask to change rooms.',
      'You are at a doctor’s office. Describe your symptoms and ask for advice.',
      'You are shopping for clothes. Ask for a different size, colour, and price.',
      'You are at a bank. Open a new account and ask about interest rates.',
      'You are at a job interview. Introduce yourself and answer the first three questions.',
      'You are asking for directions to the nearest train station.',
      'You are at a pharmacy. Describe a headache and ask for medicine.',
      'You are at a library. Ask how to become a member and borrow books.',
      'You are at a police station. Report a lost wallet.',
      'You are at a phone shop. Ask about different plans and choose one.',
      'You are at a university. Ask about admission requirements for a course.',
      'You are at a café. Order a coffee and ask about Wi-Fi.',
      'You are at a bus stop. Ask which bus goes to the city centre.',
      'You are calling customer service about a broken product.',
      'You are at a gym. Ask about membership options and a personal trainer.',
      'You are at a friend’s house. Politely decline food you don’t like.',
      'You are booking a hotel room over the phone.',
      'You are at a real estate office. Ask about apartments for rent.',
      'You are at a post office. Send a parcel and ask about delivery time.',
      'You are at a visa office. Ask about the documents required for a tourist visa.',
      'You are at a car rental agency. Rent a car and ask about insurance.',
      'You are at a hairdresser. Describe the haircut you want.',
      'You are at a travel agency. Book a holiday for two.',
      'You are at a tailor. Get a shirt altered.',
      'You are at a photographer. Ask for a passport photo.',
      'You are at a government office. Apply for a driving licence.',
      'You are at a computer repair shop. Describe the problem with your laptop.',
      'You are at a music shop. Ask about guitar lessons.',
      'You are at a bakery. Order a birthday cake.',
      'You are at a school open day. Ask about fees and subjects.',
      'You are at a pet shop. Ask about caring for a puppy.',
      'You are at a language school. Ask about class schedules.',
      'You are at a bus station. Buy a ticket and ask about the journey.',
      'You are at a taxi stand. Negotiate the fare.',
      'You are at a wedding. Congratulate the couple and chat with other guests.',
      'You are at a dinner party. Meet new people and introduce yourself.',
      'You are at a business meeting. Present a short idea.',
      'You are at a conference. Ask a speaker a question.',
      'You are at a neighbour’s house. Ask to borrow something.',
      'You are at a repair shop. Fix a broken watch.',
      'You are at a tailor’s shop. Order a custom suit.',
      'You are at a spice market. Ask about prices and buy spices.',
      'You are at a gym class. Ask the trainer for tips.',
      'You are at a museum. Ask about the exhibits.',
      'You are at a zoo. Ask about the animals.',
      'You are at a beach resort. Book a water sports activity.',
      'You are at a sports club. Register for a tournament.',
      'You are at a language exchange event. Introduce yourself and talk about your goals.',
      'You are at a customer support line for internet issues.',
      'You are at a driving school. Enquire about lessons.',
      'You are at a career fair. Talk to a company representative.',
      'You are at a university fair. Ask about scholarships.',
      'You are at a hospital reception. Book an appointment.',
      'You are at a dentist. Explain your tooth pain.',
      'You are at a shoe shop. Ask for a size in a different colour.',
      'You are at a flower shop. Order a bouquet for a friend.',
      'You are at a furniture shop. Ask about delivery and assembly.',
      'You are at a shoe repair shop. Fix a broken heel.',
    ],
  },
  story: {
    name: 'Story Retelling', icon: 'book',
    prompts: [
      'Tell the story of your first day at a new school or job.',
      'Describe a time when you got lost.',
      'Tell about a time you helped a stranger.',
      'Describe a memorable trip with your family.',
      'Tell about a time you missed something important.',
      'Describe a funny thing that happened to you.',
      'Tell the story of a big mistake you made.',
      'Describe a time you overcame a fear.',
      'Tell about a time you stood up for someone.',
      'Describe a time you tried something new.',
      'Tell about a time you had to make a difficult choice.',
      'Describe an event that changed your plans.',
      'Tell about a time you received unexpected help.',
      'Describe a moment when you felt truly proud.',
      'Tell about a memorable conversation you had.',
      'Describe a time when you were very lucky.',
      'Tell about a time you had to work in a team.',
      'Describe a moment when you were very scared.',
      'Tell about a time you surprised someone.',
      'Describe a time you had to say sorry.',
      'Tell about a time you met someone famous.',
      'Describe a trip that did not go as planned.',
      'Tell about a day when everything went wrong.',
      'Describe a moment when you felt truly grateful.',
      'Tell about a time you helped your family.',
      'Describe a time you succeeded at something difficult.',
      'Tell about a time you had to be brave.',
      'Describe a moment when you learned an important lesson.',
      'Tell about a time you cheered someone up.',
      'Describe a moment of unexpected kindness.',
      'Tell about a time you felt very tired.',
      'Describe a moment when you could not stop laughing.',
      'Tell about a time you got a surprise gift.',
      'Describe a moment when you felt left out.',
      'Tell about a time you taught someone something.',
      'Describe a moment when you were misunderstood.',
      'Tell about a time you forgave someone.',
    ],
  },
  describe: {
    name: 'Describe the Scenario', icon: 'target',
    prompts: [
      'Describe a typical morning in your household.',
      'Describe what you see on your way to work.',
      'Describe your favourite café.',
      'Describe your ideal weekend.',
      'Describe a typical family dinner.',
      'Describe the view from your window.',
      'Describe your favourite room in your house.',
      'Describe a busy street in your city.',
      'Describe a quiet place you like.',
      'Describe a rainy day at home.',
      'Describe the perfect holiday.',
      'Describe your favourite meal.',
      'Describe a memorable sunset you have seen.',
      'Describe the inside of your favourite shop.',
      'Describe a park you often visit.',
      'Describe your favourite childhood place.',
      'Describe a typical day at your school or work.',
      'Describe a concert or event you attended.',
      'Describe what you would take on a desert island.',
      'Describe your favourite piece of clothing.',
      'Describe the most beautiful place you have seen.',
      'Describe your favourite photo.',
      'Describe a small town you have visited.',
      'Describe a big city you have been to.',
      'Describe your desk or workspace.',
      'Describe your favourite festival.',
      'Describe the kitchen of your childhood home.',
      'Describe a market you have been to.',
      'Describe a river or lake near you.',
      'Describe a mountain you have visited.',
      'Describe your favourite book cover.',
      'Describe the first job you ever had.',
      'Describe a family gathering you attended.',
      'Describe your first car or bicycle.',
      'Describe a piece of art you like.',
      'Describe a gift that means a lot to you.',
      'Describe a family recipe.',
      'Describe a childhood toy.',
      'Describe a place you go to feel calm.',
      'Describe a public holiday in your country.',
    ],
  },
  topic: {
    name: 'Topic Discussion', icon: 'chat',
    prompts: [
      'Talk about the importance of learning English in your country.',
      'Discuss the impact of social media on teenagers.',
      'Talk about the benefits of regular exercise.',
      'Discuss why reading is important.',
      'Talk about the value of travelling.',
      'Discuss whether homework should be banned.',
      'Talk about the future of artificial intelligence.',
      'Discuss the advantages of living in a city.',
      'Talk about ways to protect the environment.',
      'Discuss the role of family in modern society.',
      'Talk about the importance of time management.',
      'Discuss whether money can buy happiness.',
      'Talk about the challenges of learning a new language.',
      'Discuss the benefits of volunteering.',
      'Talk about the importance of sleep.',
      'Discuss whether video games are good or bad for children.',
      'Talk about the value of failure.',
      'Discuss the effects of climate change.',
      'Talk about the role of women in the workplace.',
      'Discuss why some people love to travel and others don’t.',
      'Talk about the importance of honesty.',
      'Discuss the pros and cons of online shopping.',
      'Talk about the importance of friendship.',
      'Discuss whether technology has made us more isolated.',
      'Talk about the value of education.',
      'Discuss how to reduce stress in daily life.',
      'Talk about the importance of eating healthy.',
      'Discuss whether school uniforms should be required.',
      'Talk about the future of renewable energy.',
      'Discuss the impact of globalisation.',
      'Talk about your favourite subject and why.',
      'Discuss how schools can foster creativity.',
      'Talk about the importance of self-confidence.',
      'Discuss whether exams are fair.',
      'Talk about the benefits of being bilingual.',
      'Discuss how to build good habits.',
      'Talk about the value of arts education.',
      'Discuss whether sports stars are paid too much.',
      'Talk about the importance of mental health.',
      'Discuss how to improve public transport in your city.',
    ],
  },
  interview: {
    name: 'Interview Questions', icon: 'users',
    prompts: [
      'Tell me about yourself.',
      'Why do you want this job?',
      'What are your strengths?',
      'What are your weaknesses?',
      'Where do you see yourself in five years?',
      'Why should we hire you?',
      'What motivates you?',
      'Describe a challenge you overcame.',
      'How do you handle stress?',
      'What is your greatest achievement?',
      'How do you work in a team?',
      'Describe a time you showed leadership.',
      'How do you prioritise tasks?',
      'Tell me about a time you failed.',
      'What are your salary expectations?',
      'Why are you leaving your current job?',
      'How do you handle criticism?',
      'What do you do outside of work?',
      'What is your ideal work environment?',
      'How do you learn new skills?',
      'Describe a time you disagreed with your boss.',
      'How do you stay organised?',
      'What makes you unique?',
      'Where do you get your best ideas?',
      'How do you handle tight deadlines?',
      'What is your favourite part of your current job?',
      'What is the most difficult thing you have had to do?',
      'How do you build relationships with coworkers?',
      'What does success mean to you?',
      'What would your colleagues say about you?',
      'How do you handle multiple projects at once?',
      'What is your dream career path?',
      'Describe a project you are proud of.',
      'How do you approach learning from mistakes?',
      'Why did you choose your field?',
      'What kind of manager do you work best with?',
      'How do you cope with change?',
      'What are you most passionate about?',
      'How would you handle a difficult customer?',
      'What would make you leave a job?',
      'Do you prefer working alone or in a team?',
      'How do you stay updated in your field?',
      'What value do you bring to a team?',
      'Describe your ideal day at work.',
      'How do you handle a heavy workload?',
      'What questions do you have for us?',
      'How do you deal with a mistake you made?',
      'What is your biggest professional goal?',
      'Tell me about a time you adapted to change.',
      'How would you improve our company?',
    ],
  },
};

const ALL_CATEGORIES = Object.entries(PROMPT_BANK).map(([id, c]) => ({
  id,
  label: c.name,
  icon: c.icon,
  prompts: c.prompts,
  count: c.prompts.length,
}));

const TOTAL_PROMPTS = ALL_CATEGORIES.reduce((s, c) => s + c.count, 0);

const CRITERIA = [
  { id: 'c1', label: 'Fluency & coherence', weight: '25%' },
  { id: 'c2', label: 'Lexical resource', weight: '25%' },
  { id: 'c3', label: 'Grammatical range', weight: '25%' },
  { id: 'c4', label: 'Pronunciation', weight: '25%' },
];

/* ============================================================
   FAULT DETECTION ENGINE
   ============================================================ */
const FILLER_WORDS = ['um', 'uh', 'er', 'ah', 'like', 'you know', 'basically', 'actually', 'literally', 'so', 'well', 'anyway', 'kind of', 'sort of'];

function detectFaults(transcript, durationSec) {
  const text = (transcript || '').toLowerCase().trim();
  const words = text.split(/\s+/).filter(Boolean);
  const result = {
    fillers: { count: 0, words: {}, severity: 'ok' },
    repetition: { count: 0, examples: [], severity: 'ok' },
    pace: { wpm: 0, severity: 'ok' },
    length: { words: words.length, severity: 'ok' },
    vocabulary: { unique: 0, ratio: 0, severity: 'ok' },
  };

  const fillerMap = {};
  for (const f of FILLER_WORDS) {
    const regex = new RegExp(`\\b${f.replace(/\s+/g, '\\s+')}\\b`, 'g');
    const matches = text.match(regex);
    if (matches) {
      fillerMap[f] = matches.length;
      result.fillers.count += matches.length;
    }
  }
  result.fillers.words = fillerMap;
  const fillerRatio = words.length ? result.fillers.count / words.length : 0;
  result.fillers.severity = fillerRatio > 0.12 ? 'bad' : fillerRatio > 0.06 ? 'warn' : 'ok';

  for (let i = 0; i < words.length - 2; i++) {
    if (words[i].length > 2 && words[i] === words[i + 1] && words[i] === words[i + 2]) {
      result.repetition.count += 1;
      result.repetition.examples.push(words[i]);
    }
  }
  result.repetition.severity = result.repetition.count >= 2 ? 'bad' : result.repetition.count === 1 ? 'warn' : 'ok';

  result.pace.wpm = durationSec > 0 ? Math.round((words.length / durationSec) * 60) : 0;
  if (result.pace.wpm < 80 || result.pace.wpm > 200) result.pace.severity = 'bad';
  else if (result.pace.wpm < 100 || result.pace.wpm > 170) result.pace.severity = 'warn';

  if (words.length < 20) result.length.severity = 'bad';
  else if (words.length < 45) result.length.severity = 'warn';

  const unique = new Set(words).size;
  result.vocabulary.unique = unique;
  result.vocabulary.ratio = words.length ? unique / words.length : 0;
  if (result.vocabulary.ratio < 0.4) result.vocabulary.severity = 'bad';
  else if (result.vocabulary.ratio < 0.55) result.vocabulary.severity = 'warn';

  return result;
}

/* ============================================================
   SCORING ENGINE
   ============================================================ */
function scoreFromAnalysis(faults) {
  const wpm = faults.pace.wpm;
  const fillerRatio = faults.fillers.count / Math.max(1, faults.length.words);
  const vocabRatio = faults.vocabulary.ratio;

  let fluency = 6;
  if (wpm >= 110 && wpm <= 160) fluency = 8;
  else if (wpm >= 90 && wpm <= 180) fluency = 7;
  else if (wpm > 0) fluency = 5;
  fluency -= Math.min(2, Math.round(fillerRatio * 20));

  let vocabulary = 5;
  if (vocabRatio > 0.65) vocabulary = 8;
  else if (vocabRatio > 0.5) vocabulary = 7;
  else if (vocabRatio > 0.4) vocabulary = 6;
  if (faults.length.words > 80) vocabulary = Math.min(9, vocabulary + 1);

  let grammar = 6;
  if (faults.repetition.count === 0) grammar = 7;
  if (faults.repetition.count >= 2) grammar = 5;
  if (faults.length.words > 60 && faults.repetition.count === 0) grammar = 8;

  let pronunciation = 6;
  if (wpm >= 100 && wpm <= 170 && fillerRatio < 0.05) pronunciation = 8;
  else if (wpm >= 80 && wpm <= 190) pronunciation = 7;
  else if (wpm > 0) pronunciation = 5;

  const clamp = (n) => Math.max(3, Math.min(9, Math.round(n)));

  return {
    fluency: clamp(fluency),
    vocabulary: clamp(vocabulary),
    grammar: clamp(grammar),
    pronunciation: clamp(pronunciation),
  };
}

/* ============================================================
   SPEECH RECOGNITION HOOK
   ============================================================ */
function useSpeechRecognition() {
  const [supported, setSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interim, setInterim] = useState('');
  const recogRef = useRef(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    setSupported(true);
    const r = new SR();
    r.continuous = true;
    r.interimResults = true;
    r.lang = 'en-US';
    r.onresult = (e) => {
      let final = '';
      let pending = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) final += res[0].transcript + ' ';
        else pending += res[0].transcript;
      }
      if (final) setTranscript((t) => (t + ' ' + final).trim());
      setInterim(pending);
    };
    r.onerror = () => {};
    recogRef.current = r;
    return () => {
      try { r.stop(); } catch { /* noop */ }
    };
  }, []);

  const startRecog = useCallback(() => {
    setTranscript('');
    setInterim('');
    try { recogRef.current?.start(); } catch { /* noop */ }
  }, []);
  const stopRecog = useCallback(() => {
    try { recogRef.current?.stop(); } catch { /* noop */ }
    setInterim('');
  }, []);
  const reset = useCallback(() => {
    setTranscript('');
    setInterim('');
  }, []);

  return { supported, transcript, interim, startRecog, stopRecog, reset };
}

/* ============================================================
   AUDIO RECORDER HOOK
   ============================================================ */
function pickMimeType() {
  const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'];
  for (const type of candidates) {
    if (window.MediaRecorder?.isTypeSupported?.(type)) return type;
  }
  return '';
}

function useAudioRecorder() {
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  const startTimer = () => {
    setSeconds(0);
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  };
  const stopTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const start = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const mimeType = pickMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      recorder.ondataavailable = (e) => { if (e.data && e.data.size > 0) chunksRef.current.push(e.data); };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecording(true);
      startTimer();
      return true;
    } catch (err) {
      setError(
        err?.name === 'NotAllowedError'
          ? 'Microphone access denied. Allow mic access in your browser settings.'
          : 'Could not access your microphone.'
      );
      setRecording(false);
      stopStream();
      return false;
    }
  };

  const stop = () =>
    new Promise((resolve) => {
      const recorder = mediaRecorderRef.current;
      stopTimer();
      if (!recorder || recorder.state === 'inactive') {
        setRecording(false);
        resolve(null);
        return;
      }
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        chunksRef.current = [];
        stopStream();
        setRecording(false);
        resolve(blob);
      };
      recorder.stop();
    });

  const cancel = () => {
    const recorder = mediaRecorderRef.current;
    stopTimer();
    if (recorder && recorder.state !== 'inactive') {
      recorder.onstop = null;
      recorder.stop();
    }
    chunksRef.current = [];
    stopStream();
    setRecording(false);
    setSeconds(0);
  };

  useEffect(() => () => cancel(), []);

  return { recording, error, seconds, start, stop, cancel };
}

/* ============================================================
   WAVEFORM
   ============================================================ */
function Waveform({ active }) {
  const bars = useMemo(
    () => Array.from({ length: 32 }).map((_, i) => 18 + Math.sin(i * 0.7) * 10 + Math.random() * 14),
    [active]
  );
  return (
    <div className={`ec-spk-wave ${active ? 'ec-spk-wave-live' : 'ec-spk-wave-idle'}`}>
      {bars.map((h, i) => (
        <div key={i} className="ec-spk-wave-bar" style={{ height: `${h}px`, animationDelay: `${i * 0.045}s` }} />
      ))}
    </div>
  );
}

/* ============================================================
   TRANSCRIPT WITH HIGHLIGHTS
   ============================================================ */
function HighlightedTranscript({ text }) {
  if (!text) return null;
  const parts = text.split(/(\s+)/);
  return (
    <>
      {parts.map((part, i) => {
        const lower = part.toLowerCase().replace(/[.,!?]/g, '');
        if (FILLER_WORDS.includes(lower)) {
          return <mark key={i}>{part}</mark>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

/* ============================================================
   SCORE CARD
   ============================================================ */
function scoreClass(v) {
  if (v >= 8) return 'ec-spk-score--excellent';
  if (v >= 6.5) return 'ec-spk-score--good';
  if (v >= 5) return 'ec-spk-score--fair';
  return 'ec-spk-score--low';
}

function ScoreCard({ label, value }) {
  const R = 26;
  const CIRC = 2 * Math.PI * R;
  const pct = Math.max(0, Math.min(1, value / 9));
  return (
    <div className={`ec-spk-score ${scoreClass(value)}`}>
      <div className="ec-spk-score-ring">
        <svg viewBox="0 0 64 64">
          <circle className="ec-spk-score-ring-track" cx="32" cy="32" r={R} />
          <circle
            className="ec-spk-score-ring-fill"
            cx="32" cy="32" r={R}
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC * (1 - pct)}
          />
        </svg>
        <span className="ec-spk-score-num">{value}</span>
      </div>
      <span className="ec-spk-score-label">{label}</span>
    </div>
  );
}

/* ============================================================
   FAULT REPORT
   ============================================================ */
function FaultReport({ faults }) {
  const severityToIcon = { ok: '✓', warn: '!', bad: '✕' };
  const items = [
    {
      id: 'fillers',
      label: 'Filler words',
      severity: faults.fillers.severity,
      detail: faults.fillers.count > 0
        ? `Found ${faults.fillers.count} filler${faults.fillers.count === 1 ? '' : 's'}: ${Object.entries(faults.fillers.words).map(([w, n]) => `${w} (${n})`).join(', ')}`
        : 'No filler words detected. Excellent.',
    },
    {
      id: 'rep',
      label: 'Word repetition',
      severity: faults.repetition.severity,
      detail: faults.repetition.count > 0
        ? `Repeated words: ${[...new Set(faults.repetition.examples)].join(', ')}`
        : 'No repeated word blocks detected.',
    },
    {
      id: 'pace',
      label: 'Speaking pace',
      severity: faults.pace.severity,
      detail: `You spoke at ${faults.pace.wpm} words per minute. Ideal range: 110–160 wpm.`,
    },
    {
      id: 'len',
      label: 'Answer length',
      severity: faults.length.severity,
      detail: `${faults.length.words} words spoken. Aim for 60+ words for IELTS Part 2.`,
    },
    {
      id: 'vocab',
      label: 'Vocabulary richness',
      severity: faults.vocabulary.severity,
      detail: `${faults.vocabulary.unique} unique words (${Math.round(faults.vocabulary.ratio * 100)}% uniqueness).`,
    },
  ];

  const worstSeverity = items.reduce((acc, i) => {
    const rank = { ok: 0, warn: 1, bad: 2 };
    return rank[i.severity] > rank[acc] ? i.severity : acc;
  }, 'ok');

  const pillClass = worstSeverity === 'ok' ? 'ec-spk-faults-pill--ok' : worstSeverity === 'warn' ? 'ec-spk-faults-pill--warn' : 'ec-spk-faults-pill--bad';
  const pillText = worstSeverity === 'ok' ? 'Clean delivery' : worstSeverity === 'warn' ? 'Needs polish' : 'Fix these issues';

  return (
    <div className="ec-spk-faults">
      <div className="ec-spk-faults-head">
        <h3 className="ec-spk-faults-title">Speech analysis</h3>
        <span className={`ec-spk-faults-pill ${pillClass}`}>{pillText}</span>
      </div>
      {items.map((it) => (
        <div key={it.id} className={`ec-spk-fault ec-spk-fault--${it.severity}`}>
          <span className="ec-spk-fault-icon">{severityToIcon[it.severity]}</span>
          <div className="ec-spk-fault-body">
            <p>{it.label}</p>
            <span>{it.detail}</span>
          </div>
        </div>
      ))}
    </div>
  );
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
export function Speaking() {
  const [tab, setTab] = useState('practice');
  const [catId, setCatId] = useState('ielts2');
  const [promptIndex, setPromptIndex] = useState(0);

  const [result, setResult] = useState(null);
  const [faults, setFaults] = useState(null);
  const [scoring, setScoring] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const [sessionId, setSessionId] = useState(null);
  const [turns, setTurns] = useState([]);
  const [conversationBusy, setConversationBusy] = useState(false);
  const [conversationError, setConversationError] = useState(null);

  const [toast, setToast] = useState(null);
  const [xp, setXp] = useState(0);

  const practiceRecorder = useAudioRecorder();
  const conversationRecorder = useAudioRecorder();
  const speech = useSpeechRecognition();
  const audioUrlsRef = useRef([]);

  useEffect(() => () => {
    audioUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const showToast = (text) => {
    setToast(text);
    setTimeout(() => setToast(null), 1200);
  };

  useEffect(() => {
    setHistoryLoading(true);
    speakingApi.history()
      .then((h) => setHistory(h || []))
      .catch(() => setHistory([]))
      .finally(() => setHistoryLoading(false));
  }, []);

  const cat = ALL_CATEGORIES.find((c) => c.id === catId) || ALL_CATEGORIES[0];
  const promptText = cat.prompts[promptIndex] || '';

  /* ---------- PRACTICE ---------- */
  const handleToggleRecord = async () => {
    setSubmitError(null);
    if (practiceRecorder.recording) {
      const blob = await practiceRecorder.stop();
      speech.stopRecog();
      if (!blob || blob.size === 0) {
        setSubmitError('No audio captured. Try again.');
        return;
      }
      setScoring(true);

      setTimeout(async () => {
        const finalText = speech.transcript || '';
        const dur = practiceRecorder.seconds || Math.max(1, blob.size / 16000);

        const detected = detectFaults(finalText, dur);
        const bands = scoreFromAnalysis(detected);

        let feedback = '';
        try {
          const data = await speakingApi.submitAttempt(promptText, blob);
          if (data?.feedback) feedback = data.feedback;
        } catch { /* ignore */ }

        if (!feedback) {
          feedback = finalText
            ? `You said ${detected.length.words} words in ${dur}s. Focus on reducing filler words and speaking in longer, more connected sentences.`
            : 'We could not capture a clear transcript this time. Try speaking closer to the microphone in a quiet room.';
        }

        setFaults(detected);
        setResult({ ...bands, feedback, transcript: finalText, duration: dur });
        setXp((x) => x + 20);
        showToast('+20 XP 🎤');
        setScoring(false);
      }, 500);
    } else {
      setResult(null);
      setFaults(null);
      speech.reset();
      const ok = await practiceRecorder.start();
      if (ok) speech.startRecog();
    }
  };

  const goToNextPrompt = () => {
    practiceRecorder.cancel();
    speech.stopRecog();
    speech.reset();
    setResult(null);
    setFaults(null);
    setSubmitError(null);
    setPromptIndex((i) => (i + 1) % cat.prompts.length);
  };

  const pickCategory = (id) => {
    practiceRecorder.cancel();
    speech.stopRecog();
    speech.reset();
    setCatId(id);
    setPromptIndex(0);
    setResult(null);
    setFaults(null);
    setSubmitError(null);
  };

  /* ---------- CONVERSATION ---------- */
  const startConversation = () => {
    setConversationError(null);
    setSessionId(`session-${Date.now()}`);
    setTurns([{ role: 'ai', text: "Hi! Let's start simple — can you tell me a little about your hometown?" }]);
  };

  const handleConversationToggle = async () => {
    setConversationError(null);
    if (conversationRecorder.recording) {
      const blob = await conversationRecorder.stop();
      if (!blob || blob.size === 0) {
        setConversationError('No audio captured. Try again.');
        return;
      }
      setConversationBusy(true);
      const audioUrl = URL.createObjectURL(blob);
      audioUrlsRef.current.push(audioUrl);
      setTurns((t) => [...t, { role: 'user', text: '(your response)', audioUrl }]);
      try {
        const data = await speakingApi.conversationTurn(sessionId, blob);
        setTurns((t) => [...t, { role: 'ai', text: data?.reply || data?.text || 'Thanks — tell me more.' }]);
      } catch {
        const keywordPrompts = [
          "That's interesting — can you tell me more about that?",
          'Why do you think that matters to you?',
          'How did that make you feel at the time?',
          'Would you do anything differently now?',
          "Let's move on — how does that compare to your daily life?",
          'Can you give me a specific example?',
        ];
        const reply = keywordPrompts[turns.length % keywordPrompts.length];
        setTurns((t) => [...t, { role: 'ai', text: reply }]);
      } finally {
        setConversationBusy(false);
        setXp((x) => x + 10);
      }
    } else {
      if (!sessionId) startConversation();
      await conversationRecorder.start();
    }
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const averageScore = result
    ? Math.round(((result.fluency + result.pronunciation + result.vocabulary + result.grammar) / 4) * 10) / 10
    : null;

  return (
    <div className="ec-spk">
      <style>{SPEAK_CSS}</style>

      {/* Heading */}
      <div className="ec-spk-head ec-spk-anim">
        <div>
          <p className="ec-spk-eyebrow">Speaking</p>
          <h1 className="ec-page-title">Speak English with confidence</h1>
          <p className="ec-page-sub">
            {TOTAL_PROMPTS}+ exercises, live transcription, fault detection, and an AI conversation partner.
          </p>
        </div>
      </div>

      {/* Hero */}
      <div className="ec-spk-hero ec-spk-anim">
        <div className="ec-spk-hero-orb" aria-hidden="true" />
        <div className="ec-spk-hero-copy">
          <span className="ec-spk-hero-badge">Free · No premium required</span>
          <h1>Every attempt sharpens your <em>voice</em></h1>
          <p>Real-time speech recognition, automatic fault detection, and band-style scoring across 4 criteria.</p>
          <div className="ec-spk-hero-stats">
            <div className="ec-spk-hero-stat"><strong>{TOTAL_PROMPTS}</strong><span>Exercises</span></div>
            <div className="ec-spk-hero-stat"><strong>{ALL_CATEGORIES.length}</strong><span>Categories</span></div>
            <div className="ec-spk-hero-stat"><strong>{xp}</strong><span>XP earned</span></div>
            <div className="ec-spk-hero-stat"><strong>4</strong><span>Criteria</span></div>
          </div>
        </div>
        <div className="ec-spk-hero-mascot">
          <LangutMascot size={170} />
        </div>
      </div>

      {/* Top tabs */}
      <div className="ec-spk-tabs" role="tablist">
        {[
          { id: 'practice', label: 'Practice', icon: 'mic' },
          { id: 'conversation', label: 'Conversation', icon: 'chat' },
          { id: 'history', label: 'History', icon: 'trophy' },
        ].map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={`ec-spk-tab${tab === t.id ? ' ec-spk-tab--active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            <Icon name={t.icon} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Category tabs (practice only) */}
      {tab === 'practice' && (
        <div className="ec-spk-cats">
          {ALL_CATEGORIES.map((c) => (
            <button
              key={c.id}
              className={`ec-spk-cat${catId === c.id ? ' ec-spk-cat--active' : ''}`}
              onClick={() => pickCategory(c.id)}
            >
              <Icon name={c.icon} />
              {c.label}
              <span className="ec-spk-cat-count">{c.count}</span>
            </button>
          ))}
        </div>
      )}

      {toast && <div className="ec-spk-toast">{toast}</div>}

      <div className="ec-spk-grid">
        <section>
          {/* ---------- PRACTICE ---------- */}
          {tab === 'practice' && (
            <div className="ec-spk-panel ec-spk-anim" key="practice">
              <div className="ec-spk-prompt-counter">
                <span>{cat.label}</span>
                <span className="ec-spk-prompt-tag">
                  {promptIndex + 1} / {cat.prompts.length}
                </span>
              </div>
              <h3 className="ec-spk-prompt-text">{promptText}</h3>
              <p className="ec-spk-prompt-hint">Read the prompt or answer it in your own words.</p>

              <div className={`ec-spk-record-wrap${practiceRecorder.recording ? ' ec-spk-record-wrap--active' : ''}`}>
                <span className="ec-spk-record-ring" aria-hidden="true" />
                <span className="ec-spk-record-ring" aria-hidden="true" />
                <span className="ec-spk-record-ring" aria-hidden="true" />
                <button
                  className={`ec-spk-record-btn${practiceRecorder.recording ? ' ec-spk-record-btn--active' : ''}`}
                  onClick={handleToggleRecord}
                  disabled={scoring}
                  aria-label={practiceRecorder.recording ? 'Stop recording' : 'Start recording'}
                >
                  {practiceRecorder.recording ? '■' : '●'}
                </button>
              </div>

              <Waveform active={practiceRecorder.recording} />

              <p className="ec-spk-record-status">
                {scoring
                  ? 'Analysing your speech…'
                  : practiceRecorder.recording
                  ? 'Recording… tap to stop'
                  : 'Tap the mic to start'}
              </p>
              {practiceRecorder.recording && (
                <p className="ec-spk-record-time">{formatTime(practiceRecorder.seconds)}</p>
              )}

              {(practiceRecorder.error || submitError) && (
                <p className="ec-spk-error">{practiceRecorder.error || submitError}</p>
              )}

              {/* Live transcript */}
              {(practiceRecorder.recording || speech.transcript || speech.interim) && (
                <div className="ec-spk-transcript">
                  <p className="ec-spk-transcript-label">
                    Live transcript {speech.supported ? '' : '(not supported in this browser)'}
                  </p>
                  {speech.transcript || speech.interim ? (
                    <p className="ec-spk-transcript-text">
                      <HighlightedTranscript text={speech.transcript} />
                      {speech.interim && <em> {speech.interim}</em>}
                    </p>
                  ) : (
                    <p className="ec-spk-transcript-empty">Start speaking — your words will appear here.</p>
                  )}
                  <div className="ec-spk-transcript-meta">
                    <span>⏱ {formatTime(practiceRecorder.seconds)}</span>
                    <span>📝 {speech.transcript.split(/\s+/).filter(Boolean).length} words</span>
                    {practiceRecorder.recording && <span style={{ color: '#E0503C' }}>● REC</span>}
                  </div>
                </div>
              )}

              {/* Score cards */}
              {result && (
                <>
                  <div className="ec-spk-scores">
                    <ScoreCard label="Fluency" value={result.fluency} />
                    <ScoreCard label="Pronunciation" value={result.pronunciation} />
                    <ScoreCard label="Vocabulary" value={result.vocabulary} />
                    <ScoreCard label="Grammar" value={result.grammar} />
                  </div>
                  {averageScore != null && (
                    <div className="ec-spk-band">
                      <span className="ec-spk-band-label">Estimated band</span>
                      <span className="ec-spk-band-value">{averageScore}<small>/ 9</small></span>
                    </div>
                  )}
                  {result.feedback && <p className="ec-spk-feedback">{result.feedback}</p>}
                </>
              )}

              {/* Fault report */}
              {faults && <FaultReport faults={faults} />}

              <div className="ec-spk-actions">
                <button className="ec-spk-btn-ghost" onClick={goToNextPrompt}>
                  Next prompt →
                </button>
                {practiceRecorder.recording && (
                  <button className="ec-spk-btn-ghost" onClick={() => { practiceRecorder.cancel(); speech.stopRecog(); }}>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ---------- CONVERSATION ---------- */}
          {tab === 'conversation' && (
            <div className="ec-spk-convo ec-spk-anim" key="conv">
              <h3 className="ec-spk-convo-head">AI conversation partner</h3>
              <p className="ec-spk-convo-sub">Real spoken back-and-forth with an examiner that adapts to your answers.</p>

              <div className="ec-spk-convo-log">
                {turns.length === 0 && (
                  <p className="ec-spk-convo-sub" style={{ margin: 0 }}>Tap the mic below to start the conversation.</p>
                )}
                {turns.map((t, i) => (
                  <div key={i} className={`ec-spk-convo-msg ec-spk-convo-msg--${t.role}`}>
                    {t.text}
                    {t.audioUrl && <audio controls src={t.audioUrl} />}
                  </div>
                ))}
                {conversationBusy && (
                  <div className="ec-spk-convo-thinking">
                    <span /> <span /> <span />
                    <em style={{ fontStyle: 'normal', marginLeft: 4 }}>Examiner is thinking</em>
                  </div>
                )}
              </div>

              {(conversationRecorder.error || conversationError) && (
                <p className="ec-spk-error">{conversationRecorder.error || conversationError}</p>
              )}

              <div className={`ec-spk-record-wrap${conversationRecorder.recording ? ' ec-spk-record-wrap--active' : ''}`}>
                <span className="ec-spk-record-ring" aria-hidden="true" />
                <span className="ec-spk-record-ring" aria-hidden="true" />
                <span className="ec-spk-record-ring" aria-hidden="true" />
                <button
                  className={`ec-spk-record-btn${conversationRecorder.recording ? ' ec-spk-record-btn--active' : ''}`}
                  onClick={handleConversationToggle}
                  disabled={conversationBusy}
                  aria-label={conversationRecorder.recording ? 'Stop recording' : 'Start recording'}
                >
                  {conversationRecorder.recording ? '■' : '●'}
                </button>
              </div>

              {conversationRecorder.recording && (
                <p className="ec-spk-record-time">{formatTime(conversationRecorder.seconds)}</p>
              )}
              <p className="ec-spk-record-status">
                {conversationRecorder.recording ? 'Recording… tap to stop' : 'Tap to speak'}
              </p>

              <div className="ec-spk-convo-actions">
                {turns.length > 0 && (
                  <button
                    className="ec-spk-btn-ghost"
                    onClick={() => {
                      conversationRecorder.cancel();
                      startConversation();
                    }}
                  >
                    Restart
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ---------- HISTORY ---------- */}
          {tab === 'history' && (
            <div className="ec-spk-history ec-spk-anim" key="history">
              {historyLoading ? (
                <div className="ec-spk-empty">
                  <span className="ec-spk-empty-icon"><Icon name="trophy" /></span>
                  <span>Loading history…</span>
                </div>
              ) : history.length === 0 ? (
                <div className="ec-spk-empty">
                  <span className="ec-spk-empty-icon"><Icon name="mic" /></span>
                  <span>No past attempts yet</span>
                  <span style={{ fontSize: 12, opacity: 0.75 }}>Finish a practice prompt to see it here.</span>
                </div>
              ) : (
                history.map((h, i) => (
                  <div className="ec-spk-history-item" key={h.id} style={{ animationDelay: `${i * 0.05}s` }}>
                    <div style={{ minWidth: 0 }}>
                      <p className="ec-spk-history-title">{h.prompt}</p>
                      <span className="ec-spk-history-date">{h.date}</span>
                    </div>
                    <span className="ec-spk-band-pill">Band {h.overall}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </section>

        {/* ---------- SIDEBAR ---------- */}
        <aside>
          <div className="ec-spk-side ec-spk-anim">
            <h3>Recording tips <span>Guide</span></h3>
            {[
              { icon: '1', t: 'Find a quiet spot', d: 'Background noise hurts pronunciation accuracy.' },
              { icon: '2', t: 'Speak 45–90 seconds', d: 'Short answers cap your fluency score.' },
              { icon: '3', t: 'Avoid filler words', d: '“Um”, “like”, “you know” are auto-detected.' },
              { icon: '4', t: 'Use linking words', d: '“First…”, “However…”, “Because…”' },
            ].map((tip) => (
              <div key={tip.icon} className="ec-spk-tip">
                <span className="ec-spk-tip-icon">{tip.icon}</span>
                <div className="ec-spk-tip-body">
                  <p>{tip.t}</p>
                  <span>{tip.d}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="ec-spk-side ec-spk-anim">
            <h3>Scoring criteria <span>4 areas</span></h3>
            <div className="ec-spk-criteria">
              {CRITERIA.map((c) => (
                <div key={c.id} className="ec-spk-criteria-item">
                  <span>{c.label}</span>
                  <span>{c.weight}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="ec-spk-side ec-spk-anim">
            <h3>Your stats <span>{xp} XP</span></h3>
            <p style={{ margin: 0, fontSize: 12.5, color: 'var(--lang-ink-soft)', lineHeight: 1.6, fontWeight: 700 }}>
              {history.length === 0
                ? 'Finish your first attempt to start tracking progress.'
                : `You have completed ${history.length} attempt${history.length === 1 ? '' : 's'}. Keep going!`}
            </p>
          </div>

          {!speech.supported && (
            <div className="ec-spk-side ec-spk-anim" style={{ background: 'var(--lang-yellow)' }}>
              <h3>Browser note</h3>
              <p style={{ margin: 0, fontSize: 12.5, color: 'var(--lang-ink)', lineHeight: 1.6, fontWeight: 700 }}>
                Live transcription requires Chrome, Edge, or Safari. You can still record and score using duration-based estimates.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default Speaking;