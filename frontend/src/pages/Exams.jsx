import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { examsApi } from '../api/exams';
import { useAuth } from '../context/AuthContext';
import { RequireTier } from '../components/RequireTier';
import { Icon } from '../components/Icon';

const EXAM_CSS = `
/* ============================================================
   EXAMS — Langut-inspired
   Deep purple + lime-yellow + chunky black outlines.
   ============================================================ */

.ec-exam{
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

.ec-exam,
.ec-exam *{box-sizing:border-box}

/* ============================================================
   HEAD
   ============================================================ */
.ec-exam-head{
  display:flex;align-items:flex-end;justify-content:space-between;
  gap:16px;flex-wrap:wrap;margin-bottom:18px;
}
.ec-exam-eyebrow{
  margin:0 0 6px;font-size:11.5px;font-weight:900;
  letter-spacing:.16em;text-transform:uppercase;
  color:var(--lang-purple);opacity:.95;
}

/* ============================================================
   TRACK TABS
   ============================================================ */
.ec-exam-tracks{
  display:flex;gap:10px;overflow-x:auto;scrollbar-width:none;
  padding:6px 4px 16px;margin-bottom:8px;
}
.ec-exam-tracks::-webkit-scrollbar{display:none}
.ec-exam-track{
  flex:0 0 auto;
  display:inline-flex;align-items:center;gap:8px;
  padding:11px 18px;border-radius:999px;
  border:2px solid var(--lang-line);
  background:#fff;color:var(--lang-ink);
  font-size:13px;font-weight:900;
  cursor:pointer;white-space:nowrap;
  transition:all .18s ease;
  box-shadow:0 3px 0 var(--lang-line);
  letter-spacing:.01em;
}
.ec-exam-track:hover{
  background:var(--lang-lime-soft);
  transform:translateY(-2px);
  box-shadow:0 5px 0 var(--lang-line);
}
.ec-exam-track:active{
  transform:translateY(1px);
  box-shadow:0 1px 0 var(--lang-line);
}
.ec-exam-track--active{
  background:var(--lang-ink);color:var(--lang-lime);
  box-shadow:0 3px 0 var(--lang-ink);
}
.ec-exam-track svg{width:16px;height:16px}

/* ============================================================
   GRID
   ============================================================ */
.ec-exam-grid{
  display:grid;grid-template-columns:minmax(0,1fr) 340px;
  gap:clamp(20px,3vw,28px);align-items:start;
}

/* ============================================================
   HERO — deep purple, chunky stats, mascot
   ============================================================ */
.ec-exam-hero{
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
.ec-exam-hero::before{
  content:'';position:absolute;inset:0;
  background-image:radial-gradient(rgba(255,255,255,.10) 1.4px,transparent 1.4px);
  background-size:20px 20px;
  mask-image:radial-gradient(circle at 15% 20%,#000,transparent 65%);
  -webkit-mask-image:radial-gradient(circle at 15% 20%,#000,transparent 65%);
  pointer-events:none;
}
.ec-exam-hero-orb{
  position:absolute;top:-90px;right:180px;
  width:240px;height:240px;border-radius:50%;
  background:radial-gradient(circle,rgba(212,245,92,.22),transparent 68%);
  animation:ec-exam-drift 14s ease-in-out infinite;
}
@keyframes ec-exam-drift{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-18px,16px) scale(1.08)}}
.ec-exam-hero-copy{position:relative;z-index:1;max-width:560px}
.ec-exam-hero-badge{
  display:inline-flex;align-items:center;
  font-size:10.5px;font-weight:900;
  letter-spacing:.16em;text-transform:uppercase;
  padding:7px 14px;border-radius:999px;
  background:var(--lang-lime);color:var(--lang-ink);
  border:2px solid var(--lang-line);
  box-shadow:0 3px 0 rgba(0,0,0,.4);
  margin-bottom:16px;
}
.ec-exam-hero h2{
  margin:0 0 10px;
  font-size:clamp(24px,2.2vw + 16px,34px);
  font-weight:900;
  letter-spacing:-.035em;
  line-height:1.12;
  color:#fff;
}
.ec-exam-hero h2 em{font-style:normal;color:var(--lang-lime)}
.ec-exam-hero p{
  margin:0 0 22px;
  font-size:14px;line-height:1.6;
  opacity:.92;font-weight:500;max-width:52ch;
}
.ec-exam-hero-stats{display:flex;gap:10px;flex-wrap:wrap;position:relative;z-index:1}
.ec-exam-hero-stat{
  display:flex;flex-direction:column;gap:2px;
  padding:9px 14px;
  border-radius:14px;
  background:var(--lang-lime);
  border:2px solid var(--lang-line);
  box-shadow:0 3px 0 var(--lang-line);
  min-width:86px;
}
.ec-exam-hero-stat strong{
  font-size:20px;font-weight:900;line-height:1;
  letter-spacing:-.04em;
  color:var(--lang-ink);
}
.ec-exam-hero-stat span{
  font-size:9.5px;font-weight:900;letter-spacing:.1em;
  text-transform:uppercase;color:var(--lang-ink);opacity:.75;
}
.ec-exam-hero-stat:nth-child(2){background:var(--lang-pink)}
.ec-exam-hero-stat:nth-child(3){background:var(--lang-purple-2)}
.ec-exam-hero-stat:nth-child(3) strong,
.ec-exam-hero-stat:nth-child(3) span{color:#fff}

/* Mascot */
.ec-exam-hero-mascot{
  position:relative;z-index:1;
  flex-shrink:0;
  display:flex;align-items:center;justify-content:center;
  filter:drop-shadow(0 14px 28px rgba(0,0,0,.28));
  animation:ec-exam-bob 4s ease-in-out infinite;
}
@keyframes ec-exam-bob{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-10px) rotate(2deg)}}

/* ============================================================
   SECTIONS HEADING
   ============================================================ */
.ec-exam-sections-title{
  margin:0 0 14px;
  font-size:17px;font-weight:900;
  color:var(--lang-ink);
  letter-spacing:-.02em;
}

/* ============================================================
   SECTION CARDS — chunky
   ============================================================ */
.ec-exam-sections{display:flex;flex-direction:column;gap:14px}
.ec-exam-section-card{
  display:flex;align-items:center;gap:16px;
  padding:18px 20px;border-radius:22px;
  background:#fff;
  border:3px solid var(--lang-line);
  box-shadow:0 8px 0 var(--lang-line);
  transition:all .18s ease;
  background-image:radial-gradient(circle at 100% 0%,rgba(212,245,92,.12),transparent 55%);
}
.ec-exam-section-card:hover{
  transform:translateY(-3px);
  box-shadow:0 11px 0 var(--lang-line);
}
.ec-exam-section-icon{
  width:48px;height:48px;border-radius:14px;
  display:flex;align-items:center;justify-content:center;
  background:var(--lang-lime);
  color:var(--lang-ink);
  border:2px solid var(--lang-line);
  box-shadow:0 3px 0 var(--lang-line);
  flex-shrink:0;
}
.ec-exam-section-icon svg{width:22px;height:22px}
.ec-exam-section-body{flex:1;min-width:0}
.ec-exam-section-title{
  margin:0 0 6px;font-size:15px;font-weight:900;
  color:var(--lang-ink);
  letter-spacing:-.01em;
}
.ec-exam-section-meta{
  display:flex;gap:8px;align-items:center;
  font-size:11.5px;color:var(--lang-ink-soft);
  flex-wrap:wrap;font-weight:700;
}
.ec-exam-chip{
  padding:3px 10px;border-radius:999px;
  background:var(--lang-purple-2);color:#fff;
  border:2px solid var(--lang-line);
  font-weight:900;font-size:10.5px;
  text-transform:uppercase;letter-spacing:.06em;
  box-shadow:0 2px 0 var(--lang-line);
}
.ec-exam-chip--amber{background:var(--lang-yellow);color:var(--lang-ink)}
.ec-exam-chip--pink{background:var(--lang-pink-2);color:#fff}

.ec-exam-start{
  border:2px solid var(--lang-line);
  background:var(--lang-ink);color:var(--lang-lime);
  padding:11px 20px;border-radius:999px;
  font-size:12.5px;font-weight:900;
  cursor:pointer;white-space:nowrap;
  font-family:inherit;
  transition:all .16s ease;
  box-shadow:0 4px 0 var(--lang-line);
  letter-spacing:.04em;
}
.ec-exam-start:hover:not(:disabled){
  transform:translateY(-2px);
  box-shadow:0 6px 0 var(--lang-line);
}
.ec-exam-start:active:not(:disabled){
  transform:translateY(2px);
  box-shadow:0 1px 0 var(--lang-line);
}
.ec-exam-start:disabled{opacity:.55;cursor:not-allowed}

/* ============================================================
   COUNTDOWN CARD
   ============================================================ */
.ec-exam-countdown{
  background:#fff;
  border:3px solid var(--lang-line);
  border-radius:28px;
  padding:24px;
  box-shadow:0 8px 0 var(--lang-line);
  text-align:center;position:relative;overflow:hidden;
  background-image:radial-gradient(circle at 100% 0%,rgba(255,143,203,.15),transparent 55%);
}
.ec-exam-countdown h3{
  margin:0 0 14px;font-size:14px;font-weight:900;
  letter-spacing:.02em;color:var(--lang-ink);
  position:relative;z-index:1;
  text-transform:uppercase;
}

.ec-exam-ring{
  position:relative;width:150px;height:150px;
  margin:8px auto 14px;
  display:flex;align-items:center;justify-content:center;
}
.ec-exam-ring svg{position:absolute;inset:0;transform:rotate(-90deg)}
.ec-exam-ring-circle{
  fill:none;
  stroke:#E8E5F2;
  stroke-width:10;
}
.ec-exam-ring-progress{
  fill:none;
  stroke:url(#ecExamGrad);
  stroke-width:10;
  stroke-linecap:round;
  transition:stroke-dashoffset 1.2s cubic-bezier(.22,1,.36,1);
}
.ec-exam-ring-content{position:relative;z-index:1;text-align:center}
.ec-exam-days{
  display:block;font-size:42px;font-weight:900;
  color:var(--lang-ink);
  line-height:1;letter-spacing:-.04em;
}
.ec-exam-days-label{
  font-size:11px;font-weight:900;
  text-transform:uppercase;letter-spacing:.1em;
  color:var(--lang-ink-soft);
  margin-top:4px;display:block;
}
.ec-exam-countdown p{
  font-size:12.5px;color:var(--lang-ink-soft);
  margin:0 0 16px;line-height:1.55;
  position:relative;z-index:1;font-weight:700;
}

.ec-exam-date-input{
  width:100%;
  padding:12px 14px;
  border:2px solid var(--lang-line);
  border-radius:14px;
  font-size:14px;font-weight:700;
  background:#fff;color:var(--lang-ink);
  margin-bottom:12px;outline:none;
  transition:box-shadow .18s ease;
  font-family:inherit;
  box-shadow:0 3px 0 var(--lang-line);
}
.ec-exam-date-input:focus{
  box-shadow:0 3px 0 var(--lang-line),0 0 0 4px rgba(212,245,92,.5);
}

.ec-exam-btn-primary{
  width:100%;
  border:2px solid var(--lang-line);
  background:var(--lang-lime);color:var(--lang-ink);
  padding:13px 20px;border-radius:999px;
  font-size:13.5px;font-weight:900;
  cursor:pointer;font-family:inherit;
  transition:all .16s ease;
  box-shadow:0 4px 0 var(--lang-line);
  letter-spacing:.04em;
}
.ec-exam-btn-primary:hover:not(:disabled){
  transform:translateY(-2px);
  box-shadow:0 6px 0 var(--lang-line);
}
.ec-exam-btn-primary:active:not(:disabled){
  transform:translateY(2px);
  box-shadow:0 1px 0 var(--lang-line);
}
.ec-exam-btn-primary:disabled{opacity:.55;cursor:not-allowed}

.ec-exam-btn-ghost{
  width:100%;
  border:2px solid var(--lang-line);
  background:#fff;color:var(--lang-ink);
  padding:12px 20px;border-radius:999px;
  font-size:13px;font-weight:900;
  cursor:pointer;font-family:inherit;
  transition:all .16s ease;
  margin-top:10px;
  box-shadow:0 4px 0 var(--lang-line);
}
.ec-exam-btn-ghost:hover{
  background:var(--lang-lime-soft);
  transform:translateY(-2px);
  box-shadow:0 6px 0 var(--lang-line);
}
.ec-exam-btn-ghost:active{
  transform:translateY(2px);
  box-shadow:0 1px 0 var(--lang-line);
}

/* ============================================================
   DAILY PLAN CARD
   ============================================================ */
.ec-exam-plan{
  margin-top:20px;
  background:#fff;
  border:3px solid var(--lang-line);
  border-radius:28px;
  padding:22px;
  box-shadow:0 8px 0 var(--lang-line);
  background-image:radial-gradient(circle at 100% 0%,rgba(212,245,92,.10),transparent 55%);
}
.ec-exam-plan h3{
  margin:0 0 16px;font-size:15px;font-weight:900;
  color:var(--lang-ink);
  display:flex;align-items:center;justify-content:space-between;
  gap:8px;letter-spacing:-.01em;
}
.ec-exam-plan h3 span{
  font-size:10.5px;
  color:var(--lang-ink);
  background:var(--lang-lime);
  border:2px solid var(--lang-line);
  padding:4px 11px;border-radius:999px;
  font-weight:900;
  text-transform:uppercase;letter-spacing:.06em;
  box-shadow:0 2px 0 var(--lang-line);
}
.ec-exam-plan-item{
  display:flex;gap:12px;align-items:flex-start;
  padding:13px 0;
  border-bottom:2px dashed rgba(23,16,46,.1);
}
.ec-exam-plan-item:last-child{
  border-bottom:none;padding-bottom:0;
}
.ec-exam-plan-icon{
  width:34px;height:34px;border-radius:11px;
  background:var(--lang-purple-2);color:#fff;
  display:flex;align-items:center;justify-content:center;
  flex-shrink:0;
  border:2px solid var(--lang-line);
  box-shadow:0 2px 0 var(--lang-line);
}
.ec-exam-plan-icon svg{width:16px;height:16px}
.ec-exam-plan-body{flex:1;min-width:0}
.ec-exam-plan-body p{
  margin:0 0 3px;font-size:13px;font-weight:900;
  color:var(--lang-ink);
}
.ec-exam-plan-body span{
  font-size:11.5px;color:var(--lang-ink-soft);
  font-weight:700;
}

/* ============================================================
   PREMIUM BANNER
   ============================================================ */
.ec-exam-premium-banner{
  border-radius:22px;
  padding:22px;
  background:var(--lang-yellow);
  border:3px solid var(--lang-line);
  box-shadow:0 8px 0 var(--lang-line);
  margin-bottom:20px;
}
.ec-exam-premium-banner h4{
  margin:0 0 8px;font-size:15px;font-weight:900;
  color:var(--lang-ink);
  display:flex;align-items:center;gap:8px;
  letter-spacing:-.01em;
}
.ec-exam-premium-banner p{
  margin:0 0 16px;font-size:13px;
  line-height:1.6;color:var(--lang-ink);
  opacity:.85;font-weight:600;
}
.ec-exam-premium-actions{
  display:flex;align-items:center;gap:12px;flex-wrap:wrap;
}
.ec-exam-premium-actions button{
  border:2px solid var(--lang-line);
  background:var(--lang-ink);color:var(--lang-lime);
  padding:11px 20px;border-radius:999px;
  font-size:12.5px;font-weight:900;
  cursor:pointer;font-family:inherit;
  transition:all .16s ease;
  box-shadow:0 4px 0 var(--lang-line);
  letter-spacing:.03em;
}
.ec-exam-premium-actions button:hover{
  transform:translateY(-2px);
  box-shadow:0 6px 0 var(--lang-line);
}
.ec-exam-premium-actions button:active{
  transform:translateY(2px);
  box-shadow:0 1px 0 var(--lang-line);
}
.ec-exam-premium-actions a{
  font-size:12.5px;font-weight:900;
  color:var(--lang-ink);
  text-decoration:none;
  border-bottom:2px dashed var(--lang-ink);
  padding-bottom:2px;
  transition:opacity .18s ease;
}
.ec-exam-premium-actions a:hover{opacity:.7}

/* ============================================================
   ANIMATIONS
   ============================================================ */
@keyframes ec-fade-slide-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.ec-exam-anim{animation:ec-fade-slide-in .45s ease both}
.ec-exam-anim-1{animation-delay:.05s}
.ec-exam-anim-2{animation-delay:.1s}
.ec-exam-anim-3{animation-delay:.15s}

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media(max-width:900px){
  .ec-exam-grid{grid-template-columns:1fr;gap:18px}
  .ec-exam-hero{flex-direction:column;align-items:flex-start;min-height:0}
  .ec-exam-hero-mascot{
    position:absolute;right:14px;bottom:14px;
    transform:scale(.72);transform-origin:bottom right;
    animation:none;
  }
}
@media(max-width:720px){
  .ec-exam-head{flex-direction:column;align-items:flex-start;gap:8px;margin-bottom:14px}
  .ec-exam-hero{padding:22px 20px;border-radius:26px}
  .ec-exam-hero h2{font-size:22px}
  .ec-exam-hero p{font-size:13px}
  .ec-exam-hero-stats{gap:8px;margin-top:14px}
  .ec-exam-hero-stat{padding:8px 12px;min-width:74px;border-radius:12px}
  .ec-exam-hero-stat strong{font-size:17px}
  .ec-exam-hero-stat span{font-size:9px}
  .ec-exam-hero-mascot{display:none}
  .ec-exam-track{padding:10px 15px;font-size:12.5px}
  .ec-exam-section-card{padding:14px;border-radius:18px;box-shadow:0 6px 0 var(--lang-line);flex-wrap:wrap}
  .ec-exam-section-icon{width:42px;height:42px}
  .ec-exam-section-icon svg{width:19px;height:19px}
  .ec-exam-section-title{font-size:14px}
  .ec-exam-start{width:100%;order:3;margin-top:8px}
  .ec-exam-countdown{padding:18px;border-radius:22px;box-shadow:0 6px 0 var(--lang-line)}
  .ec-exam-ring{width:124px;height:124px}
  .ec-exam-days{font-size:34px}
  .ec-exam-plan{padding:18px;border-radius:22px;box-shadow:0 6px 0 var(--lang-line)}
  .ec-exam-premium-banner{padding:18px;border-radius:18px;box-shadow:0 6px 0 var(--lang-line)}
  .ec-exam-premium-actions button,
  .ec-exam-premium-actions a{width:100%;text-align:center}
}
@media(prefers-reduced-motion:reduce){
  .ec-exam-hero-orb{animation:none}
  .ec-exam-hero-mascot{animation:none}
  .ec-exam-anim{animation:none}
  .ec-exam-track,.ec-exam-section-card,.ec-exam-start,
  .ec-exam-btn-primary,.ec-exam-btn-ghost,
  .ec-exam-premium-actions button{transition:none!important}
}
`;

const TRACKS = [
  { id: 'ielts', name: 'IELTS', icon: 'flag',
    sections: [
      { name: 'Listening', mins: 30, questions: 40, icon: 'mic' },
      { name: 'Reading', mins: 60, questions: 40, icon: 'book' },
      { name: 'Writing', mins: 60, questions: 2, icon: 'chat' },
      { name: 'Speaking', mins: 15, questions: 3, icon: 'mic' },
    ],
  },
  { id: 'sat', name: 'SAT', icon: 'target',
    sections: [
      { name: 'Reading & Writing', mins: 64, questions: 54, icon: 'book' },
      { name: 'Math', mins: 70, questions: 44, icon: 'target' },
    ],
  },
  { id: 'pte', name: 'PTE', icon: 'zap',
    sections: [
      { name: 'Speaking & Writing', mins: 77, questions: 60, icon: 'mic' },
      { name: 'Reading', mins: 32, questions: 14, icon: 'book' },
      { name: 'Listening', mins: 45, questions: 20, icon: 'bell' },
    ],
  },
];

const DEFAULT_PLAN = [
  { id: 'p1', icon: 'target', title: '20 min warm-up drill', meta: 'Vocabulary blitz — target 85% accuracy' },
  { id: 'p2', icon: 'book', title: '1 Reading passage', meta: 'Timed at 20 min, then review mistakes' },
  { id: 'p3', icon: 'mic', title: 'Speaking practice', meta: '2 prompts, record and self-review' },
  { id: 'p4', icon: 'flag', title: 'Listening section', meta: 'One full section, then check band score' },
];

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

export function Exams() {
  const { user } = useAuth();
  const [trackId, setTrackId] = useState('ielts');
  const [countdown, setCountdown] = useState(null);
  const [examDate, setExamDate] = useState('');
  const [animateRing, setAnimateRing] = useState(false);

  useEffect(() => {
    examsApi.countdown().then(setCountdown).catch(() => setCountdown(null));
    const t = requestAnimationFrame(() => setAnimateRing(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const track = useMemo(() => TRACKS.find((t) => t.id === trackId), [trackId]);

  const saveCountdown = () => {
    if (!examDate) return;
    examsApi.setCountdown(trackId, examDate)
      .then((c) => { setCountdown(c); setExamDate(''); })
      .catch(() => { setCountdown({ examDate }); setExamDate(''); });
  };

  const clearCountdown = () => {
    setCountdown(null);
    setExamDate('');
  };

  const daysLeft = countdown?.examDate
    ? Math.max(0, Math.ceil((new Date(countdown.examDate) - new Date()) / 86400000))
    : null;

  const totalMins = track.sections.reduce((s, x) => s + x.mins, 0);
  const totalQ = track.sections.reduce((s, x) => s + x.questions, 0);
  const ringPct = daysLeft != null ? Math.max(0, Math.min(1, 1 - daysLeft / 180)) : 0;
  const R = 58;
  const CIRC = 2 * Math.PI * R;

  return (
    <div className="ec-exam">
      <style>{EXAM_CSS}</style>

      <div className="ec-exam-head ec-exam-anim">
        <div>
          <p className="ec-exam-eyebrow">Exam Preparation</p>
          <h1 className="ec-page-title">Your exam, on your clock</h1>
          <p className="ec-page-sub">
            Full IELTS, SAT and PTE tracks on one shared exam engine — timer, auto-scoring, results.
          </p>
        </div>
      </div>

      <div className="ec-exam-tracks ec-exam-anim ec-exam-anim-1">
        {TRACKS.map((t) => (
          <button
            key={t.id}
            className={`ec-exam-track${trackId === t.id ? ' ec-exam-track--active' : ''}`}
            onClick={() => setTrackId(t.id)}
          >
            <Icon name={t.icon} />
            {t.name}
          </button>
        ))}
      </div>

      <div className="ec-exam-hero ec-exam-anim ec-exam-anim-2">
        <div className="ec-exam-hero-orb" aria-hidden="true" />
        <div className="ec-exam-hero-copy">
          <span className="ec-exam-hero-badge">{track.name} · Full track</span>
          <h2>{track.sections.length} sections, one <em>shared</em> exam engine</h2>
          <p>Timed, auto-scored, and paired with an adaptive study plan. Sit a section whenever you have {Math.min(...track.sections.map(s => s.mins))}+ minutes.</p>
          <div className="ec-exam-hero-stats">
            <div className="ec-exam-hero-stat">
              <strong>{totalMins}</strong>
              <span>Total minutes</span>
            </div>
            <div className="ec-exam-hero-stat">
              <strong>{totalQ}</strong>
              <span>Questions</span>
            </div>
            <div className="ec-exam-hero-stat">
              <strong>{track.sections.length}</strong>
              <span>Sections</span>
            </div>
          </div>
        </div>
        <div className="ec-exam-hero-mascot">
          <LangutMascot size={170} />
        </div>
      </div>

      <div className="ec-exam-grid">
        <section className="ec-exam-anim ec-exam-anim-3">
          <h2 className="ec-exam-sections-title">{track.name} sections</h2>

          <RequireTier
            tier="premium"
            fallback={
              <>
                <div className="ec-exam-premium-banner">
                  <h4>🔒 Unlock all sections</h4>
                  <p>{track.sections[0].name} is free to try. Premium unlocks all {track.sections.length} sections, unlimited full-length mocks, and AI speaking scoring.</p>
                  <div className="ec-exam-premium-actions">
                    <button>Try {track.sections[0].name} free</button>
                    <Link to="/pricing">See Premium plans →</Link>
                  </div>
                </div>
                <div className="ec-exam-sections">
                  <div className="ec-exam-section-card">
                    <span className="ec-exam-section-icon"><Icon name={track.sections[0].icon} /></span>
                    <div className="ec-exam-section-body">
                      <p className="ec-exam-section-title">{track.sections[0].name}</p>
                      <div className="ec-exam-section-meta">
                        <span className="ec-exam-chip ec-exam-chip--amber">Free</span>
                        <span>{track.sections[0].mins} min</span>
                        <span>·</span>
                        <span>{track.sections[0].questions} questions</span>
                      </div>
                    </div>
                    <button className="ec-exam-start">Start free</button>
                  </div>
                </div>
              </>
            }
          >
            <div className="ec-exam-sections">
              {track.sections.map((s) => (
                <div className="ec-exam-section-card" key={s.name}>
                  <span className="ec-exam-section-icon"><Icon name={s.icon} /></span>
                  <div className="ec-exam-section-body">
                    <p className="ec-exam-section-title">{s.name}</p>
                    <div className="ec-exam-section-meta">
                      <span className="ec-exam-chip">Full mock</span>
                      <span>{s.mins} min</span>
                      <span>·</span>
                      <span>{s.questions} questions</span>
                    </div>
                  </div>
                  <button className="ec-exam-start">Start</button>
                </div>
              ))}
            </div>
          </RequireTier>
        </section>

        <aside className="ec-exam-anim ec-exam-anim-3">
          <div className="ec-exam-countdown">
            <h3>Exam countdown</h3>

            {countdown?.examDate ? (
              <>
                <div className="ec-exam-ring">
                  <svg viewBox="0 0 140 140" aria-hidden="true">
                    <defs>
                      <linearGradient id="ecExamGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#D4F55C" />
                        <stop offset="100%" stopColor="#B8E62E" />
                      </linearGradient>
                    </defs>
                    <circle className="ec-exam-ring-circle" cx="70" cy="70" r={R} />
                    <circle
                      className="ec-exam-ring-progress"
                      cx="70" cy="70" r={R}
                      strokeDasharray={CIRC}
                      strokeDashoffset={animateRing ? CIRC * (1 - ringPct) : CIRC}
                    />
                  </svg>
                  <div className="ec-exam-ring-content">
                    <span className="ec-exam-days">{daysLeft}</span>
                    <span className="ec-exam-days-label">days left</span>
                  </div>
                </div>
                <p>
                  until your {track.name} exam. Your daily plan adjusts automatically.
                </p>
                <button className="ec-exam-btn-ghost" onClick={clearCountdown}>Change date</button>
              </>
            ) : (
              <>
                <p style={{ marginBottom: 14 }}>
                  Set your exam date and we’ll build a daily study plan for you.
                </p>
                <input
                  type="date"
                  className="ec-exam-date-input"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 10)}
                />
                <button className="ec-exam-btn-primary" onClick={saveCountdown} disabled={!examDate}>
                  Set countdown
                </button>
              </>
            )}
          </div>

          <div className="ec-exam-plan">
            <h3>Today’s plan <span>{DEFAULT_PLAN.length} tasks</span></h3>
            {DEFAULT_PLAN.map((p) => (
              <div className="ec-exam-plan-item" key={p.id}>
                <span className="ec-exam-plan-icon"><Icon name={p.icon} /></span>
                <div className="ec-exam-plan-body">
                  <p>{p.title}</p>
                  <span>{p.meta}</span>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Exams;