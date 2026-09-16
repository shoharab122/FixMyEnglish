import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { liveRoomsApi } from '../api/liveRooms';
import { useAuth } from '../context/AuthContext';
import { Icon } from '../components/Icon';

/* ============================================================
   Inline SVG icons
   ============================================================ */
const SVG = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round' };

const IcoCamOn = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...SVG}>
    <rect x="2.5" y="6.5" width="13" height="11" rx="2.5" />
    <path d="M15.5 10.5 21.5 7v10l-6-3.5" />
  </svg>
);
const IcoCamOff = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...SVG}>
    <path d="M2.5 6.5h13v11h-13z" opacity=".35" />
    <path d="M15.5 10.5 21.5 7v10l-6-3.5" opacity=".35" />
    <path d="M3 3l18 18" />
  </svg>
);
const IcoMicOn = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...SVG}>
    <rect x="9" y="2.5" width="6" height="12" rx="3" />
    <path d="M5 11.5a7 7 0 0 0 14 0M12 18.5v3M8.5 21.5h7" />
  </svg>
);
const IcoMicOff = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...SVG}>
    <path d="M9 5a3 3 0 0 1 6 0v6" opacity=".35" />
    <path d="M5 11.5a7 7 0 0 0 11 5.6M19 11.5a7 7 0 0 1-.6 2.8M12 18.5v3M8.5 21.5h7" />
    <path d="M3 3l18 18" />
  </svg>
);
const IcoShare = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...SVG}>
    <rect x="3" y="4.5" width="18" height="12" rx="2" />
    <path d="M8 20.5h8M12 16.5v4" />
    <path d="M12 12V7M10 9l2-2 2 2" />
  </svg>
);
const IcoChat = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...SVG}>
    <path d="M21 12a8 8 0 1 1-3.2-6.4L21 4l-1 4.4A7.96 7.96 0 0 1 21 12Z" />
  </svg>
);
const IcoUsers = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...SVG}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
    <circle cx="17.5" cy="9" r="2.6" />
    <path d="M15 20a4.5 4.5 0 0 1 6.5-4" />
  </svg>
);
const IcoEnd = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" {...SVG}>
    <path d="M4 14c4-4 12-4 16 0v2.5a1.5 1.5 0 0 1-1.6 1.5c-2-.2-3.9-.7-5.4-1.4a1.6 1.6 0 0 1-.8-1.1l-.1-1.6a9.5 9.5 0 0 0-4.2 0l-.1 1.6c-.1.5-.4.9-.8 1.1-1.5.7-3.4 1.2-5.4 1.4A1.5 1.5 0 0 1 4 16.5V14Z" />
  </svg>
);
const IcoExpand = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...SVG}>
    <path d="M4 9V4h5M20 15v5h-5M15 4h5v5M9 20H4v-5" />
  </svg>
);
const IcoClose = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...SVG}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
const IcoArrowL = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" {...SVG}>
    <path d="M15 6l-6 6 6 6" />
  </svg>
);
const IcoArrowR = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" {...SVG}>
    <path d="M9 6l6 6-6 6" />
  </svg>
);
const IcoCheck = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" {...SVG}>
    <path d="M5 13l4 4 10-10" />
  </svg>
);
const IcoPlay = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...SVG}>
    <path d="M6 4l14 8-14 8z" />
  </svg>
);
const IcoClock = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" {...SVG}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);
const IcoExternal = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...SVG}>
    <path d="M14 4h6v6M20 4l-9 9" />
    <path d="M20 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4" />
  </svg>
);
const IcoWarn = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...SVG}>
    <path d="M12 3 2 20h20L12 3Z" />
    <path d="M12 10v4M12 17.5v.01" />
  </svg>
);

/* ============================================================
   Mascot — Langut yellow blob
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

/* ============================================================
   MAIN STYLES — Langut-inspired with enhanced animations
   ============================================================ */
const LIVE_CSS = `
/* ============================================================
   Langut tokens
   ============================================================ */
.ec-live,
.ec-class,
.ec-exam,
.ec-zoom-embed,
.ec-connect-overlay,
.ec-lobby-hero{
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

.ec-live,
.ec-live *,
.ec-lobby-hero,
.ec-lobby-hero *,
.ec-exam,
.ec-exam *{box-sizing:border-box}

/* ============================================================
   NEW: List view hero with mascot
   ============================================================ */
.ec-live-hero{
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
.ec-live-hero::before{
  content:'';position:absolute;inset:0;
  background-image:radial-gradient(rgba(255,255,255,.10) 1.4px,transparent 1.4px);
  background-size:20px 20px;
  mask-image:radial-gradient(circle at 15% 20%,#000,transparent 65%);
  -webkit-mask-image:radial-gradient(circle at 15% 20%,#000,transparent 65%);
  pointer-events:none;
}
.ec-live-hero-orb{
  position:absolute;top:-90px;right:180px;
  width:260px;height:260px;border-radius:50%;
  background:radial-gradient(circle,rgba(212,245,92,.22),transparent 68%);
  animation:ec-lr-drift 14s ease-in-out infinite;
}
@keyframes ec-lr-drift{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-18px,16px) scale(1.08)}}

.ec-live-hero-copy{position:relative;z-index:1;max-width:580px}
.ec-live-hero-badge{
  display:inline-flex;align-items:center;gap:8px;
  font-size:10.5px;font-weight:900;
  letter-spacing:.16em;text-transform:uppercase;
  padding:7px 14px;border-radius:999px;
  background:var(--lang-lime);color:var(--lang-ink);
  border:2px solid var(--lang-line);
  box-shadow:0 3px 0 rgba(0,0,0,.4);
  margin-bottom:16px;
}
.ec-live-hero-badge .ec-live-dot{
  background:var(--lang-ink);
  animation:ec-live-pulse 1.6s ease-out infinite;
}
.ec-live-hero h1{
  margin:0 0 10px;
  font-size:clamp(26px,2.4vw + 16px,38px);
  font-weight:900;letter-spacing:-.035em;line-height:1.1;
  color:#fff;
}
.ec-live-hero h1 em{
  font-style:normal;color:var(--lang-lime);
  background:linear-gradient(180deg,#E4FF5C 0%,#B8E62E 100%);
  -webkit-background-clip:text;
  background-clip:text;
  color:transparent;
}
.ec-live-hero p{
  margin:0 0 22px;font-size:14px;line-height:1.6;
  opacity:.92;font-weight:500;max-width:52ch;
}
.ec-live-hero-chips{
  display:flex;gap:10px;flex-wrap:wrap;position:relative;z-index:1;
}
.ec-live-hero-chip{
  display:flex;flex-direction:column;gap:2px;
  padding:9px 14px;border-radius:14px;
  background:var(--lang-lime);color:var(--lang-ink);
  border:2px solid var(--lang-line);
  box-shadow:0 3px 0 var(--lang-line);
  min-width:80px;
}
.ec-live-hero-chip strong{
  font-size:20px;font-weight:900;line-height:1;
  letter-spacing:-.04em;color:var(--lang-ink);
}
.ec-live-hero-chip span{
  font-size:9.5px;font-weight:900;letter-spacing:.1em;
  text-transform:uppercase;color:var(--lang-ink);opacity:.75;
}
.ec-live-hero-chip:nth-child(2){background:var(--lang-pink)}
.ec-live-hero-chip:nth-child(3){background:var(--lang-purple-2)}
.ec-live-hero-chip:nth-child(3) strong,
.ec-live-hero-chip:nth-child(3) span{color:#fff}

.ec-live-hero-mascot{
  position:relative;z-index:1;
  flex-shrink:0;
  display:flex;align-items:center;justify-content:center;
  filter:drop-shadow(0 14px 28px rgba(0,0,0,.28));
  animation:ec-lr-bob 4s ease-in-out infinite;
}
@keyframes ec-lr-bob{
  0%,100%{transform:translateY(0) rotate(-2deg)}
  50%{transform:translateY(-10px) rotate(2deg)}
}

/* Floating sparkles around the mascot */
.ec-live-hero-sparkle{
  position:absolute;
  width:14px;height:14px;
  pointer-events:none;
  animation:ec-lr-sparkle 3s ease-in-out infinite;
}
.ec-live-hero-sparkle::before,
.ec-live-hero-sparkle::after{
  content:'';position:absolute;inset:0;
  background:currentColor;
  clip-path:polygon(50% 0,55% 45%,100% 50%,55% 55%,50% 100%,45% 55%,0 50%,45% 45%);
}
.ec-live-hero-sparkle--a{top:12%;right:26%;color:var(--lang-lime);animation-delay:0s}
.ec-live-hero-sparkle--b{top:22%;right:14%;color:var(--lang-pink);animation-delay:.6s;width:10px;height:10px}
.ec-live-hero-sparkle--c{bottom:18%;right:24%;color:var(--lang-yellow);animation-delay:1.2s;width:12px;height:12px}
@keyframes ec-lr-sparkle{
  0%,100%{opacity:1;transform:scale(1) rotate(0deg)}
  50%{opacity:.35;transform:scale(.75) rotate(30deg)}
}

/* ============================================================
   HEADING (kept for backwards compat)
   ============================================================ */
.ec-live-head{margin-bottom:22px}
.ec-live-eyebrow{
  margin:0 0 6px;font-size:11.5px;font-weight:900;
  letter-spacing:.16em;text-transform:uppercase;
  color:var(--lang-purple);opacity:.95;
}

/* ============================================================
   TABS — with spring indicator
   ============================================================ */
.ec-live-tabs{
  display:flex;gap:10px;overflow-x:auto;scrollbar-width:none;
  padding:6px 4px 16px;margin-bottom:8px;
}
.ec-live-tabs::-webkit-scrollbar{display:none}
.ec-live-tab{
  flex:0 0 auto;
  display:inline-flex;align-items:center;gap:8px;
  padding:11px 18px;border-radius:999px;
  border:2px solid var(--lang-line);
  background:#fff;color:var(--lang-ink);
  font-size:12.5px;font-weight:900;
  cursor:pointer;white-space:nowrap;font-family:inherit;
  transition:transform .22s cubic-bezier(.34,1.56,.64,1),
             box-shadow .18s ease,
             background .2s ease,
             color .2s ease;
  box-shadow:0 3px 0 var(--lang-line);
  letter-spacing:.01em;
  position:relative;
}
.ec-live-tab::after{
  content:'';position:absolute;inset:-4px;
  border-radius:999px;
  background:radial-gradient(circle,rgba(212,245,92,.35),transparent 70%);
  opacity:0;z-index:-1;
  transition:opacity .3s ease;
}
.ec-live-tab:hover{
  background:var(--lang-lime-soft);
  transform:translateY(-3px);
  box-shadow:0 6px 0 var(--lang-line);
}
.ec-live-tab:hover::after{opacity:1}
.ec-live-tab:active{
  transform:translateY(1px) scale(.98);
  box-shadow:0 1px 0 var(--lang-line);
}
.ec-live-tab--active{
  background:var(--lang-ink);color:var(--lang-lime);
  box-shadow:0 3px 0 var(--lang-ink);
  animation:ec-lr-tab-pop .4s cubic-bezier(.34,1.56,.64,1);
}
@keyframes ec-lr-tab-pop{
  0%{transform:scale(1)}
  40%{transform:scale(1.06)}
  100%{transform:scale(1)}
}
.ec-live-tab svg{width:15px;height:15px;transition:transform .3s cubic-bezier(.34,1.56,.64,1)}
.ec-live-tab:hover svg{transform:rotate(-8deg) scale(1.1)}
.ec-live-tab-count{
  font-size:10px;font-weight:900;
  padding:2px 8px;border-radius:999px;
  background:var(--lang-lime);color:var(--lang-ink);
  border:2px solid var(--lang-line);
}
.ec-live-tab--active .ec-live-tab-count{
  background:var(--lang-lime);color:var(--lang-ink);
  border-color:var(--lang-line);
}

/* ============================================================
   STATS ROW — with shimmer
   ============================================================ */
.ec-live-stats{
  display:grid;grid-template-columns:repeat(4,1fr);
  gap:14px;margin-bottom:24px;
}
.ec-live-stat{
  position:relative;
  background:#fff;
  border:2px solid var(--lang-line);
  border-radius:20px;
  padding:18px;
  display:flex;flex-direction:column;gap:8px;
  box-shadow:0 5px 0 var(--lang-line);
  transition:transform .28s cubic-bezier(.34,1.56,.64,1),box-shadow .22s ease;
  background-image:radial-gradient(circle at 100% 0%,rgba(212,245,92,.10),transparent 55%);
  overflow:hidden;
  animation:ec-lr-slide-in .55s cubic-bezier(.22,1,.36,1) both;
}
.ec-live-stat:nth-child(1){animation-delay:.08s}
.ec-live-stat:nth-child(2){animation-delay:.14s}
.ec-live-stat:nth-child(3){animation-delay:.20s}
.ec-live-stat:nth-child(4){animation-delay:.26s}

.ec-live-stat::after{
  content:'';position:absolute;top:0;bottom:0;
  width:40%;
  background:linear-gradient(90deg,transparent,rgba(212,245,92,.35),transparent);
  transform:translateX(-120%);
  animation:ec-lr-shine 3.4s ease-in-out infinite;
  pointer-events:none;
}
@keyframes ec-lr-shine{
  0%{transform:translateX(-120%)}
  60%{transform:translateX(280%)}
  100%{transform:translateX(280%)}
}
.ec-live-stat:hover{
  transform:translateY(-4px) scale(1.02);
  box-shadow:0 9px 0 var(--lang-line);
}
.ec-live-stat-icon{
  width:42px;height:42px;border-radius:14px;
  display:flex;align-items:center;justify-content:center;
  margin-bottom:4px;
  border:2px solid var(--lang-line);
  box-shadow:0 3px 0 var(--lang-line);
  transition:transform .3s cubic-bezier(.34,1.56,.64,1);
}
.ec-live-stat:hover .ec-live-stat-icon{transform:scale(1.08) rotate(-5deg)}
.ec-live-stat-icon--lime   {background:var(--lang-lime);     color:var(--lang-ink)}
.ec-live-stat-icon--yellow {background:var(--lang-yellow);   color:var(--lang-ink)}
.ec-live-stat-icon--purple {background:var(--lang-purple-2); color:#fff}
.ec-live-stat-icon--pink   {background:var(--lang-pink-2);   color:#fff}
.ec-live-stat-value{
  font-size:24px;font-weight:900;color:var(--lang-ink);
  line-height:1;letter-spacing:-.035em;
  font-variant-numeric:tabular-nums;
}
.ec-live-stat-label{
  font-size:11.5px;font-weight:800;color:var(--lang-ink-soft);
  letter-spacing:.03em;
}

/* ============================================================
   ROOMS LIST — staggered entrance
   ============================================================ */
.ec-live-list{display:flex;flex-direction:column;gap:16px}

.ec-live-card{
  position:relative;
  background:#fff;
  border:2px solid var(--lang-line);
  border-radius:26px;
  padding:22px;
  box-shadow:0 6px 0 var(--lang-line);
  transition:transform .28s cubic-bezier(.34,1.56,.64,1),box-shadow .22s ease;
  overflow:hidden;
  background-image:radial-gradient(circle at 100% 0%,rgba(212,245,92,.12),transparent 55%);
  animation:ec-lr-slide-in .55s cubic-bezier(.22,1,.36,1) both;
}
@keyframes ec-lr-slide-in{
  from{opacity:0;transform:translateY(20px) scale(.98)}
  to{opacity:1;transform:translateY(0) scale(1)}
}
.ec-live-card::before{
  content:'';position:absolute;top:0;bottom:0;left:0;
  width:6px;
  background:linear-gradient(180deg,#D4F55C,#B8E62E);
  border-radius:26px 0 0 26px;
  opacity:0;
  transition:opacity .3s ease;
}
.ec-live-card:hover::before{opacity:1}
.ec-live-card:hover{
  transform:translateY(-4px);
  box-shadow:0 11px 0 var(--lang-line);
}

.ec-live-card-top{
  display:flex;align-items:flex-start;justify-content:space-between;
  gap:14px;margin-bottom:16px;
}
.ec-live-title{
  margin:0 0 12px;font-size:17px;font-weight:900;
  color:var(--lang-ink);line-height:1.3;
  letter-spacing:-.02em;
  transition:background-position .6s ease;
  background:linear-gradient(90deg,var(--lang-ink) 0%,var(--lang-ink) 50%,#7B5CF0 75%,var(--lang-ink) 100%);
  background-size:220% 100%;
  background-position:0% 0;
  -webkit-background-clip:text;
  background-clip:text;
  color:transparent;
}
.ec-live-card:hover .ec-live-title{background-position:-100% 0}

/* Badges */
.ec-live-badge{
  position:relative;
  display:inline-flex;align-items:center;gap:6px;
  font-size:11px;font-weight:900;
  color:var(--lang-ink);
  background:var(--lang-yellow);
  padding:5px 12px;border-radius:999px;
  border:2px solid var(--lang-line);
  box-shadow:0 2px 0 var(--lang-line);
  letter-spacing:.06em;text-transform:uppercase;
}
.ec-live-badge--soon{background:var(--lang-lime);color:var(--lang-ink)}
.ec-live-badge--live{background:var(--lang-pink-2);color:#fff}
.ec-live-badge--live::after{
  content:'';position:absolute;inset:-3px;
  border-radius:999px;
  border:2px solid var(--lang-pink-2);
  animation:ec-lr-badge-ring 1.8s ease-out infinite;
  pointer-events:none;
}
@keyframes ec-lr-badge-ring{
  0%{transform:scale(1);opacity:.9}
  100%{transform:scale(1.25);opacity:0}
}

.ec-live-dot{
  width:8px;height:8px;border-radius:50%;
  background:var(--lang-ink);
  animation:ec-live-pulse 1.6s ease-out infinite;
  flex-shrink:0;
}
.ec-live-badge--soon .ec-live-dot{
  background:var(--lang-ink);
  animation:none;
  box-shadow:0 0 0 3px rgba(23,16,46,.25);
}
.ec-live-badge--live .ec-live-dot{
  background:#fff;
  animation:ec-live-pulse-w 1.4s ease-out infinite;
}
@keyframes ec-live-pulse{
  0%{box-shadow:0 0 0 0 rgba(23,16,46,.5)}
  100%{box-shadow:0 0 0 12px rgba(23,16,46,0)}
}
@keyframes ec-live-pulse-w{
  0%{box-shadow:0 0 0 0 rgba(255,255,255,.6)}
  100%{box-shadow:0 0 0 12px rgba(255,255,255,0)}
}

.ec-live-chips{display:flex;gap:8px;flex-wrap:wrap}
.ec-live-chip{
  font-size:10.5px;font-weight:900;
  letter-spacing:.06em;text-transform:uppercase;
  padding:4px 11px;border-radius:999px;
  background:var(--lang-purple-2);color:#fff;
  border:2px solid var(--lang-line);
  box-shadow:0 2px 0 var(--lang-line);
  transition:transform .2s cubic-bezier(.34,1.56,.64,1);
}
.ec-live-chip:hover{transform:translateY(-2px) scale(1.05)}
.ec-live-chip--zoom{background:#0B5FFF;color:#fff}

/* Fill bar with animated shine */
.ec-live-fill-row{
  display:flex;align-items:center;gap:12px;
  margin-bottom:16px;
}
.ec-live-fill-bar{
  position:relative;
  flex:1;height:14px;border-radius:999px;
  background:#E8E5F2;overflow:hidden;
  border:2px solid var(--lang-line);
}
.ec-live-fill{
  position:relative;
  height:100%;border-radius:999px;
  background:linear-gradient(90deg,#D4F55C,#B8E62E);
  transition:width 1.2s cubic-bezier(.22,1,.36,1);
}
.ec-live-fill::after{
  content:'';position:absolute;top:0;bottom:0;
  width:30%;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.6),transparent);
  animation:ec-lr-shine 2.4s ease-in-out infinite;
  pointer-events:none;
}
.ec-live-fill-pct{
  font-size:12.5px;font-weight:900;
  color:var(--lang-ink);
  white-space:nowrap;
  font-variant-numeric:tabular-nums;
  background:var(--lang-lime);
  border:2px solid var(--lang-line);
  padding:3px 10px;border-radius:999px;
  box-shadow:0 2px 0 var(--lang-line);
}

.ec-live-card-meta{
  display:flex;gap:16px;margin-bottom:18px;
  font-size:12px;color:var(--lang-ink-soft);
  flex-wrap:wrap;font-weight:800;
  letter-spacing:.02em;
}
.ec-live-card-meta span{display:inline-flex;align-items:center;gap:6px}
.ec-live-card-meta svg{width:14px;height:14px;opacity:.85}

.ec-live-sep{
  height:2px;
  background:repeating-linear-gradient(90deg,rgba(23,16,46,.15) 0 6px,transparent 6px 12px);
  margin:0 0 16px;
  border-radius:999px;
}

/* ============================================================
   BUTTONS
   ============================================================ */
.ec-live-actions{
  display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:10px;
}
.ec-live-btn{
  position:relative;
  display:inline-flex;align-items:center;justify-content:center;gap:7px;
  padding:12px 14px;border-radius:14px;
  border:2px solid var(--lang-line);
  font-family:inherit;font-size:12.5px;font-weight:900;
  cursor:pointer;white-space:nowrap;min-height:46px;
  transition:transform .22s cubic-bezier(.34,1.56,.64,1),
             box-shadow .18s ease,
             background .2s ease;
  letter-spacing:.02em;
  box-shadow:0 4px 0 var(--lang-line);
  overflow:hidden;
}
.ec-live-btn::before{
  content:'';position:absolute;top:0;bottom:0;left:-30%;
  width:30%;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent);
  transform:translateX(0);
  transition:transform .6s ease;
  pointer-events:none;
}
.ec-live-btn:hover:not(:disabled)::before{transform:translateX(400%)}
.ec-live-btn svg{width:16px;height:16px;flex-shrink:0;transition:transform .3s cubic-bezier(.34,1.56,.64,1)}
.ec-live-btn:hover:not(:disabled){
  transform:translateY(-3px);
  box-shadow:0 7px 0 var(--lang-line);
}
.ec-live-btn:hover:not(:disabled) svg{transform:scale(1.15)}
.ec-live-btn:active:not(:disabled){
  transform:translateY(2px);
  box-shadow:0 1px 0 var(--lang-line);
}
.ec-live-btn:disabled{
  opacity:.55;cursor:not-allowed;transform:none;
  box-shadow:0 4px 0 var(--lang-line);
}

.ec-live-btn--primary{background:var(--lang-purple);color:#fff}
.ec-live-btn--zoom{background:var(--lang-ink);color:var(--lang-lime)}
.ec-live-btn--dark{background:var(--lang-purple-2);color:#fff}
.ec-live-btn--ghost{background:#fff;color:var(--lang-ink)}
.ec-live-btn--ghost:hover:not(:disabled){background:var(--lang-lime-soft)}

/* ============================================================
   CONNECTING OVERLAY
   ============================================================ */
.ec-connect-overlay{
  position:fixed;inset:0;z-index:10001;
  background:rgba(15,18,34,.65);
  backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);
  display:flex;align-items:center;justify-content:center;padding:20px;
  animation:ec-lr-fade .25s ease both;
}
@keyframes ec-lr-fade{from{opacity:0}to{opacity:1}}
.ec-connect-card{
  background:#fff;
  border:2px solid var(--lang-line);
  border-radius:28px;
  padding:36px 32px;max-width:420px;width:100%;
  text-align:center;
  box-shadow:0 10px 0 var(--lang-line),0 24px 60px rgba(15,18,34,.35);
  animation:ec-lr-pop .35s cubic-bezier(.34,1.56,.64,1) both;
}
@keyframes ec-lr-pop{
  from{opacity:0;transform:scale(.9)}
  to{opacity:1;transform:scale(1)}
}
.ec-connect-spinner{
  position:relative;
  width:64px;height:64px;border-radius:50%;margin:0 auto 22px;
  border:5px solid #E8E5F2;
  border-top-color:var(--lang-purple);
  animation:ec-lr-spin .8s linear infinite;
}
.ec-connect-spinner::after{
  content:'';position:absolute;inset:-14px;border-radius:50%;
  border:2px dashed rgba(123,92,240,.35);
  animation:ec-lr-spin 2.4s linear infinite reverse;
}
@keyframes ec-lr-spin{to{transform:rotate(360deg)}}
.ec-connect-title{
  margin:0 0 8px;font-size:20px;font-weight:900;
  color:var(--lang-ink);letter-spacing:-.02em;
}
.ec-connect-sub{
  margin:0;font-size:13.5px;line-height:1.55;
  color:var(--lang-ink-soft);font-weight:600;
}
.ec-connect-error{
  display:flex;align-items:flex-start;gap:10px;
  margin-top:18px;padding:12px 16px;border-radius:14px;
  background:var(--lang-pink-2);color:#fff;font-size:12.5px;
  font-weight:900;text-align:left;line-height:1.5;
  border:2px solid var(--lang-line);
  box-shadow:0 3px 0 var(--lang-line);
  letter-spacing:.01em;
}
.ec-connect-error svg{flex-shrink:0;margin-top:1px}

/* ============================================================
   ZOOM EMBED (dark)
   ============================================================ */
.ec-zoom-embed{
  position:fixed;inset:0;z-index:9999;
  background:#0B0D12;display:flex;flex-direction:column;
  overflow:hidden;
}
.ec-zoom-embed-bar{
  display:flex;align-items:center;justify-content:space-between;gap:12px;
  padding:12px 16px;background:rgba(0,0,0,.55);
  border-bottom:1px solid rgba(255,255,255,.08);
  color:#fff;flex-shrink:0;
}
.ec-zoom-embed-bar-left{display:flex;align-items:center;gap:10px;min-width:0}
.ec-zoom-embed-bar-title{font-size:13.5px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ec-zoom-embed-bar-sub{font-size:11px;color:rgba(255,255,255,.65);white-space:nowrap}
.ec-zoom-embed-bar-right{display:flex;align-items:center;gap:8px;flex-shrink:0}
.ec-zoom-embed-btn{
  display:inline-flex;align-items:center;gap:6px;
  padding:8px 14px;border-radius:12px;border:1.5px solid rgba(255,255,255,.16);
  background:rgba(255,255,255,.08);color:#fff;
  font-family:inherit;font-size:12.5px;font-weight:900;cursor:pointer;
  transition:background .2s ease,border-color .2s ease,transform .18s cubic-bezier(.34,1.56,.64,1);
  letter-spacing:.02em;
}
.ec-zoom-embed-btn:hover{
  background:rgba(255,255,255,.16);
  border-color:rgba(255,255,255,.28);
  transform:translateY(-2px);
}
.ec-zoom-embed-btn:active{transform:scale(.96)}
.ec-zoom-embed-btn--danger{background:var(--lang-pink-2);border-color:var(--lang-pink-2);color:#fff}
.ec-zoom-embed-btn--danger:hover{background:#ff77bf;border-color:#ff77bf}
.ec-zoom-embed-container{flex:1;position:relative;background:#0B0D12;min-height:0}
.ec-zoom-embed-container > div{width:100%!important;height:100%!important}
.ec-zoom-embed-fallback{
  position:absolute;inset:0;display:flex;flex-direction:column;
  align-items:center;justify-content:center;gap:14px;padding:32px;text-align:center;
  color:#fff;
}
.ec-zoom-embed-fallback-icon{
  width:72px;height:72px;border-radius:50%;
  background:var(--lang-pink-2);color:#fff;
  display:flex;align-items:center;justify-content:center;
  border:3px solid var(--lang-line);
  box-shadow:0 4px 0 rgba(0,0,0,.5);
}
.ec-zoom-embed-fallback h3{margin:0;font-size:18px;font-weight:900;color:#fff;letter-spacing:-.02em}
.ec-zoom-embed-fallback p{margin:0;font-size:13px;line-height:1.55;color:rgba(255,255,255,.75);max-width:420px;font-weight:600}

/* ============================================================
   LOBBY VIEW
   ============================================================ */
.ec-lobby-hero{
  position:relative;overflow:hidden;
  border-radius:32px;
  padding:clamp(26px,4vw,38px) clamp(24px,4vw,40px);
  color:#fff;
  background:linear-gradient(140deg,#2A1A6E 0%,#1E1252 55%,#3B2596 100%);
  box-shadow:0 20px 52px rgba(30,18,82,.34);
  border:2px solid var(--lang-line);
  margin-bottom:22px;
  min-height:200px;
  animation:ec-lr-slide-in .55s cubic-bezier(.22,1,.36,1) both;
}
.ec-lobby-hero::before{
  content:'';position:absolute;inset:0;
  background-image:radial-gradient(rgba(255,255,255,.10) 1.4px,transparent 1.4px);
  background-size:20px 20px;
  mask-image:radial-gradient(circle at 15% 20%,#000,transparent 65%);
  -webkit-mask-image:radial-gradient(circle at 15% 20%,#000,transparent 65%);
  pointer-events:none;
}
.ec-lobby-hero-copy{position:relative;z-index:1}
.ec-lobby-hero h1{
  margin:0 0 10px;font-size:clamp(24px,2.2vw + 14px,32px);
  font-weight:900;color:#fff;letter-spacing:-.035em;line-height:1.15;
}
.ec-lobby-hero h1 em{font-style:normal;color:var(--lang-lime)}
.ec-lobby-hero p{
  margin:0;font-size:14px;line-height:1.6;
  opacity:.92;max-width:540px;font-weight:500;
}
.ec-lobby-hero-badge{
  display:inline-flex;align-items:center;gap:8px;
  font-size:10.5px;font-weight:900;
  letter-spacing:.16em;text-transform:uppercase;
  padding:7px 14px;border-radius:999px;
  background:var(--lang-lime);color:var(--lang-ink);
  border:2px solid var(--lang-line);
  box-shadow:0 3px 0 rgba(0,0,0,.4);
  margin-bottom:16px;
}
.ec-lobby-hero-badge .ec-live-dot{background:var(--lang-ink);animation:ec-live-pulse 1.6s ease-out infinite}
.ec-lobby-hero-stats{
  display:flex;gap:10px;margin-top:20px;flex-wrap:wrap;position:relative;z-index:1;
}
.ec-lobby-hero-stat{
  display:flex;flex-direction:column;gap:2px;
  padding:9px 14px;border-radius:14px;
  background:var(--lang-lime);color:var(--lang-ink);
  border:2px solid var(--lang-line);
  box-shadow:0 3px 0 var(--lang-line);
  min-width:86px;
  animation:ec-lr-pop .4s cubic-bezier(.34,1.56,.64,1) both;
}
.ec-lobby-hero-stat:nth-child(1){animation-delay:.15s}
.ec-lobby-hero-stat:nth-child(2){animation-delay:.25s}
.ec-lobby-hero-stat:nth-child(3){animation-delay:.35s}
.ec-lobby-hero-stat strong{
  font-size:20px;font-weight:900;line-height:1;letter-spacing:-.04em;
}
.ec-lobby-hero-stat span{
  font-size:9.5px;text-transform:uppercase;letter-spacing:.1em;
  font-weight:900;opacity:.75;
}
.ec-lobby-hero-stat:nth-child(2){background:var(--lang-pink)}
.ec-lobby-hero-stat:nth-child(3){background:var(--lang-purple-2)}
.ec-lobby-hero-stat:nth-child(3) strong,
.ec-lobby-hero-stat:nth-child(3) span{color:#fff}

.ec-lobby-grid{
  display:grid;grid-template-columns:minmax(0,1fr) 340px;
  gap:22px;align-items:start;
}
.ec-lobby-card{
  background:#fff;
  border:2px solid var(--lang-line);
  border-radius:24px;
  padding:22px;
  box-shadow:0 5px 0 var(--lang-line);
  margin-bottom:18px;
  background-image:radial-gradient(circle at 100% 0%,rgba(212,245,92,.08),transparent 55%);
  animation:ec-lr-slide-in .55s cubic-bezier(.22,1,.36,1) both;
}
.ec-lobby-card h3{
  margin:0 0 16px;font-size:15px;font-weight:900;
  color:var(--lang-ink);
  display:flex;align-items:center;justify-content:space-between;gap:8px;
  letter-spacing:-.01em;
}
.ec-lobby-card h3 span{
  font-size:10.5px;
  color:var(--lang-ink);
  background:var(--lang-lime);
  padding:4px 11px;border-radius:999px;
  font-weight:900;
  text-transform:uppercase;letter-spacing:.06em;
  border:2px solid var(--lang-line);
  box-shadow:0 2px 0 var(--lang-line);
}

.ec-guest-form{display:flex;flex-direction:column;gap:12px}
.ec-guest-input{
  width:100%;
  padding:12px 16px;
  border:2px solid var(--lang-line);
  border-radius:14px;
  font-size:14px;font-weight:700;
  background:#fff;color:var(--lang-ink);
  outline:none;font-family:inherit;
  transition:box-shadow .18s ease, transform .18s ease;
  box-shadow:0 3px 0 var(--lang-line);
}
.ec-guest-input:focus{
  box-shadow:0 3px 0 var(--lang-line),0 0 0 4px rgba(212,245,92,.5);
  transform:translateY(-1px);
}
.ec-guest-input::placeholder{color:var(--lang-ink-soft);font-weight:500}
.ec-guest-btn{
  border:2px solid var(--lang-line);
  background:var(--lang-lime);color:var(--lang-ink);
  padding:13px 20px;border-radius:999px;
  font-size:13.5px;font-weight:900;
  cursor:pointer;font-family:inherit;
  transition:transform .22s cubic-bezier(.34,1.56,.64,1),box-shadow .18s ease;
  box-shadow:0 4px 0 var(--lang-line);
  letter-spacing:.03em;
}
.ec-guest-btn:hover:not(:disabled){
  transform:translateY(-3px);
  box-shadow:0 7px 0 var(--lang-line);
}
.ec-guest-btn:active:not(:disabled){
  transform:translateY(2px);
  box-shadow:0 1px 0 var(--lang-line);
}
.ec-guest-btn:disabled{opacity:.5;cursor:not-allowed;transform:none}

/* Leaderboard */
.ec-lb-row{
  display:flex;align-items:center;gap:12px;
  padding:12px 0;
  border-bottom:2px dashed rgba(23,16,46,.1);
  transition:transform .2s ease;
  animation:ec-lr-slide-in .45s ease both;
}
.ec-lb-row:nth-child(1){animation-delay:.1s}
.ec-lb-row:nth-child(2){animation-delay:.15s}
.ec-lb-row:nth-child(3){animation-delay:.20s}
.ec-lb-row:nth-child(4){animation-delay:.25s}
.ec-lb-row:nth-child(5){animation-delay:.30s}
.ec-lb-row:last-child{border-bottom:none;padding-bottom:0}
.ec-lb-row:hover{transform:translateX(4px)}
.ec-lb-rank{
  width:30px;height:30px;border-radius:50%;
  background:#fff;color:var(--lang-ink);
  display:flex;align-items:center;justify-content:center;
  font-weight:900;font-size:12px;flex-shrink:0;
  border:2px solid var(--lang-line);
  box-shadow:0 2px 0 var(--lang-line);
}
.ec-lb-row:nth-child(1) .ec-lb-rank{
  background:var(--lang-yellow);
  animation:ec-lr-trophy-spin 4s ease-in-out infinite;
}
@keyframes ec-lr-trophy-spin{
  0%,100%{transform:rotate(-8deg) scale(1)}
  50%{transform:rotate(8deg) scale(1.1)}
}
.ec-lb-row:nth-child(2) .ec-lb-rank{background:#E8E5F2;color:var(--lang-ink)}
.ec-lb-row:nth-child(3) .ec-lb-rank{background:var(--lang-pink);color:var(--lang-ink)}
.ec-lb-avatar{
  width:34px;height:34px;border-radius:12px;
  background:var(--lang-purple-2);color:#fff;
  flex-shrink:0;display:flex;align-items:center;justify-content:center;
  font-size:13px;font-weight:900;
  border:2px solid var(--lang-line);
  box-shadow:0 2px 0 var(--lang-line);
}
.ec-lb-name{
  flex:1;font-size:13px;font-weight:900;
  color:var(--lang-ink);min-width:0;
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
  letter-spacing:-.01em;
}
.ec-lb-xp{
  font-size:12px;font-weight:900;
  color:var(--lang-ink);
  background:var(--lang-lime);
  padding:3px 10px;border-radius:999px;
  border:2px solid var(--lang-line);
  box-shadow:0 2px 0 var(--lang-line);
  font-variant-numeric:tabular-nums;
}
.ec-lb-row--me{
  background:var(--lang-lime-soft);
  border-radius:12px;
  padding:12px 10px;margin:0 -10px;
  border-bottom:2px solid transparent;
}
.ec-lb-row--me .ec-lb-name{color:var(--lang-ink)}

/* ============================================================
   LIVE CLASS (dark video UI)
   ============================================================ */
.ec-class{
  position:fixed;
  inset:0;
  z-index:9999;
  background:#0B0D12;
  color:#fff;
  display:flex;
  flex-direction:column;
  font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  overflow:hidden;
  animation:ec-lr-class-in .35s cubic-bezier(.22,1,.36,1) both;
}
@keyframes ec-lr-class-in{
  from{opacity:0;transform:scale(.96)}
  to{opacity:1;transform:scale(1)}
}

.ec-class-top{
  display:flex;align-items:center;justify-content:space-between;gap:12px;
  padding:12px 16px;background:linear-gradient(180deg,rgba(0,0,0,.5),transparent);
  position:absolute;top:0;left:0;right:0;z-index:5;
  transition:opacity .3s ease,transform .3s ease;
}
.ec-class-info{display:flex;align-items:center;gap:10px;min-width:0}
.ec-class-rec{
  display:inline-flex;align-items:center;gap:6px;
  font-size:11px;font-weight:900;
  color:#fff;background:var(--lang-pink-2);
  padding:4px 10px;border-radius:999px;
  border:2px solid var(--lang-line);
  box-shadow:0 2px 0 rgba(0,0,0,.4);
  letter-spacing:.08em;text-transform:uppercase;
}
.ec-class-rec-dot{
  width:6px;height:6px;border-radius:50%;background:#fff;
  animation:ec-class-rec-pulse 1.2s ease-in-out infinite;
}
@keyframes ec-class-rec-pulse{0%,100%{opacity:1}50%{opacity:.3}}
.ec-class-title{
  font-size:13.5px;font-weight:800;color:#fff;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
.ec-class-timer{
  font-size:12.5px;font-weight:800;
  color:rgba(255,255,255,.75);
  font-variant-numeric:tabular-nums;
  display:inline-flex;align-items:center;gap:5px;
}
.ec-class-top-right{display:flex;align-items:center;gap:8px}

.ec-class-icon-btn{
  width:36px;height:36px;border-radius:12px;border:none;
  background:rgba(255,255,255,.12);color:#fff;
  display:flex;align-items:center;justify-content:center;cursor:pointer;
  transition:background .2s ease,transform .2s cubic-bezier(.34,1.56,.64,1);
}
.ec-class-icon-btn:hover{background:rgba(255,255,255,.22);transform:scale(1.08)}
.ec-class-icon-btn:active{transform:scale(.9)}

.ec-class-stage{
  flex:1;
  padding:64px 12px 110px;
  overflow:hidden;
  display:flex;
  align-items:center;
  justify-content:center;
}
.ec-class-grid{
  width:100%;height:100%;
  display:grid;gap:10px;
  max-width:1400px;margin:0 auto;
}
.ec-class-grid[data-count="1"]{grid-template-columns:1fr}
.ec-class-grid[data-count="2"]{grid-template-columns:1fr 1fr}
.ec-class-grid[data-count="3"]{grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr}
.ec-class-grid[data-count="3"] > *:first-child{grid-column:1 / -1}
.ec-class-grid[data-count="4"]{grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr}
.ec-class-grid[data-count="5"],
.ec-class-grid[data-count="6"]{grid-template-columns:repeat(3,1fr);grid-template-rows:1fr 1fr}

.ec-class-tile{
  position:relative;border-radius:18px;overflow:hidden;
  background:linear-gradient(135deg,#1a1d2e 0%,#0f121c 100%);
  border:2px solid rgba(255,255,255,.08);
  display:flex;align-items:center;justify-content:center;
  min-height:0;
  transition:border-color .3s ease,box-shadow .3s ease, transform .3s cubic-bezier(.34,1.56,.64,1);
  animation:ec-lr-slide-in .5s ease both;
}
.ec-class-tile:hover{transform:scale(1.01)}
.ec-class-tile--speaking{
  border-color:var(--lang-lime);
  box-shadow:0 0 0 2px rgba(212,245,92,.35),0 0 32px rgba(212,245,92,.35);
  animation:ec-lr-speaking-pulse 2s ease-in-out infinite;
}
@keyframes ec-lr-speaking-pulse{
  0%,100%{box-shadow:0 0 0 2px rgba(212,245,92,.35),0 0 32px rgba(212,245,92,.35)}
  50%{box-shadow:0 0 0 4px rgba(212,245,92,.5),0 0 40px rgba(212,245,92,.5)}
}

.ec-class-avatar{
  width:70px;height:70px;border-radius:50%;
  background:linear-gradient(135deg,#8B6BFF 0%,#7B5CF0 100%);
  display:flex;align-items:center;justify-content:center;
  color:#fff;font-size:26px;font-weight:900;
  border:2px solid var(--lang-line);
  box-shadow:0 4px 0 rgba(0,0,0,.5);
  transition:transform .35s cubic-bezier(.34,1.56,.64,1);
}
.ec-class-tile:hover .ec-class-avatar{transform:scale(1.05)}
.ec-class-tile--speaking .ec-class-avatar{
  background:linear-gradient(135deg,#D4F55C 0%,#B8E62E 100%);
  color:var(--lang-ink);
  box-shadow:0 0 0 4px rgba(212,245,92,.3),0 4px 0 rgba(0,0,0,.5);
  animation:ec-lr-avatar-bounce 1.6s ease-in-out infinite;
}
@keyframes ec-lr-avatar-bounce{
  0%,100%{transform:scale(1)}
  50%{transform:scale(1.06)}
}

.ec-class-tile-label{
  position:absolute;left:10px;bottom:10px;
  display:inline-flex;align-items:center;gap:6px;
  padding:4px 10px;border-radius:999px;
  background:rgba(0,0,0,.6);
  backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
  border:1.5px solid rgba(255,255,255,.14);
  font-size:11.5px;font-weight:800;color:#fff;
}
.ec-class-tile-mic{
  display:inline-flex;align-items:center;justify-content:center;
  width:16px;height:16px;border-radius:50%;
}
.ec-class-tile-mic--on{color:var(--lang-lime);animation:ec-lr-mic-on 1.8s ease-in-out infinite}
.ec-class-tile-mic--off{color:var(--lang-pink-2)}
@keyframes ec-lr-mic-on{
  0%,100%{transform:scale(1)}
  50%{transform:scale(1.15)}
}
.ec-class-tile-mic svg{width:13px;height:13px}

.ec-class-self{
  position:absolute;right:16px;bottom:120px;z-index:4;
  width:200px;aspect-ratio:16/10;border-radius:16px;
  background:linear-gradient(135deg,#1a1d2e,#0f121c);
  border:2px solid rgba(255,255,255,.12);
  display:flex;align-items:center;justify-content:center;
  box-shadow:0 12px 32px rgba(0,0,0,.55);
  overflow:hidden;
  transition:transform .3s cubic-bezier(.34,1.56,.64,1);
}
.ec-class-self:hover{transform:scale(1.04)}
.ec-class-self--off{opacity:.85}
.ec-class-self .ec-class-avatar{width:42px;height:42px;font-size:16px}
.ec-class-self .ec-class-tile-label{bottom:8px;left:8px;font-size:10.5px;padding:3px 8px}

.ec-class-bottom{
  position:absolute;left:0;right:0;bottom:0;z-index:5;
  padding:14px 16px calc(14px + env(safe-area-inset-bottom, 0px));
  background:linear-gradient(0deg,rgba(0,0,0,.65),transparent);
  display:flex;align-items:center;justify-content:center;gap:10px;
  transition:opacity .3s ease,transform .3s ease;
}
.ec-class-ctrl{
  width:52px;height:52px;border-radius:50%;border:none;
  background:rgba(255,255,255,.12);color:#fff;
  display:flex;align-items:center;justify-content:center;cursor:pointer;
  transition:background .2s ease,transform .22s cubic-bezier(.34,1.56,.64,1),color .2s ease;
  flex-shrink:0;
}
.ec-class-ctrl:hover{background:rgba(255,255,255,.22);transform:scale(1.08)}
.ec-class-ctrl:active{transform:scale(.92)}
.ec-class-ctrl--off{background:var(--lang-pink-2);color:#fff}
.ec-class-ctrl--off:hover{background:#ff77bf}
.ec-class-ctrl--end{
  background:var(--lang-pink-2);color:#fff;
  width:auto;padding:0 26px;border-radius:999px;
  gap:8px;font-size:13px;font-weight:900;
}
.ec-class-ctrl--end:hover{background:#ff77bf}
.ec-class-ctrl svg{width:20px;height:20px}
.ec-class-ctrl-label{display:none}

.ec-class--idle .ec-class-top{opacity:0;transform:translateY(-8px);pointer-events:none}
.ec-class--idle .ec-class-bottom{opacity:0;transform:translateY(8px);pointer-events:none}
.ec-class--idle{cursor:none}

.ec-class-chat{
  position:absolute;right:0;top:0;bottom:0;width:340px;z-index:6;
  background:#0F1222;border-left:1px solid rgba(255,255,255,.08);
  display:flex;flex-direction:column;
  animation:ec-lr-chat-in .3s cubic-bezier(.22,1,.36,1) both;
}
@keyframes ec-lr-chat-in{from{transform:translateX(100%)}to{transform:translateX(0)}}
.ec-class-chat-head{
  display:flex;align-items:center;justify-content:space-between;
  padding:16px 18px;
  border-bottom:1px solid rgba(255,255,255,.08);
  flex-shrink:0;
}
.ec-class-chat-head h3{margin:0;font-size:14px;font-weight:900;color:#fff}
.ec-class-chat-body{
  flex:1;overflow-y:auto;padding:16px 18px;
  display:flex;flex-direction:column;gap:12px;
}
.ec-class-chat-msg{
  display:flex;gap:10px;align-items:flex-start;
  animation:ec-lr-slide-in .4s ease both;
}
.ec-class-chat-avatar{
  width:32px;height:32px;border-radius:50%;
  background:linear-gradient(135deg,#9B7BFF,#7B5CF0);
  display:flex;align-items:center;justify-content:center;
  color:#fff;font-size:12px;font-weight:900;flex-shrink:0;
}
.ec-class-chat-body .ec-class-chat-msg:nth-child(2n) .ec-class-chat-avatar{
  background:linear-gradient(135deg,#FFB3D1,#FF8FCB);
  color:var(--lang-ink);
}
.ec-class-chat-body .ec-class-chat-msg:nth-child(3n) .ec-class-chat-avatar{
  background:linear-gradient(135deg,#F5E04D,#B8E62E);
  color:var(--lang-ink);
}
.ec-class-chat-content{flex:1;min-width:0}
.ec-class-chat-name{
  font-size:12px;font-weight:800;color:#fff;
  margin:0 0 3px;display:flex;align-items:center;gap:6px;
}
.ec-class-chat-name small{font-size:10.5px;font-weight:600;color:rgba(255,255,255,.45)}
.ec-class-chat-text{
  margin:0;font-size:13px;line-height:1.5;
  color:rgba(255,255,255,.85);word-wrap:break-word;
}
.ec-class-chat-text--me{color:var(--lang-lime)}
.ec-class-chat-input-wrap{
  padding:12px 14px;
  border-top:1px solid rgba(255,255,255,.08);
  display:flex;gap:8px;flex-shrink:0;
}
.ec-class-chat-input{
  flex:1;
  background:rgba(255,255,255,.08);
  border:1.5px solid transparent;
  border-radius:12px;padding:10px 14px;
  color:#fff;font-family:inherit;font-size:13.5px;
  outline:none;transition:border-color .2s ease,background .2s ease;
  min-width:0;
}
.ec-class-chat-input:focus{
  border-color:var(--lang-lime);
  background:rgba(255,255,255,.12);
}
.ec-class-chat-input::placeholder{color:rgba(255,255,255,.4)}
.ec-class-chat-send{
  border:none;
  background:var(--lang-lime);color:var(--lang-ink);
  width:40px;height:40px;border-radius:12px;
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;flex-shrink:0;
  transition:background .2s ease,transform .2s cubic-bezier(.34,1.56,.64,1);
  border:2px solid var(--lang-line);
  box-shadow:0 2px 0 var(--lang-line);
}
.ec-class-chat-send:hover{background:var(--lang-lime-2);transform:translateY(-2px) scale(1.05)}
.ec-class-chat-send:active{transform:translateY(0) scale(.95)}

/* ============================================================
   EXAM VIEW
   ============================================================ */
.ec-exam{
  position:fixed;inset:0;z-index:9999;
  background:#F8F9FC;
  color:var(--lang-ink);
  display:flex;flex-direction:column;overflow:hidden;
  animation:ec-lr-class-in .35s cubic-bezier(.22,1,.36,1) both;
}
.ec-exam-head{
  display:flex;align-items:center;justify-content:space-between;
  gap:12px;padding:14px 20px;
  background:#fff;
  border-bottom:2px solid var(--lang-line);
  flex-shrink:0;
}
.ec-exam-head-left{display:flex;align-items:center;gap:12px;min-width:0}
.ec-exam-title{
  font-size:14.5px;font-weight:900;color:var(--lang-ink);
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  letter-spacing:-.01em;
}
.ec-exam-head-right{display:flex;align-items:center;gap:10px;flex-shrink:0}
.ec-exam-timer{
  display:inline-flex;align-items:center;gap:7px;
  padding:8px 16px;border-radius:999px;
  background:var(--lang-lime);color:var(--lang-ink);
  font-size:13px;font-weight:900;
  border:2px solid var(--lang-line);
  box-shadow:0 3px 0 var(--lang-line);
  font-variant-numeric:tabular-nums;
  letter-spacing:.02em;
  transition:background .3s ease,color .3s ease;
}
.ec-exam-timer--warn{background:var(--lang-yellow);color:var(--lang-ink)}
.ec-exam-timer--danger{
  background:var(--lang-pink-2);color:#fff;
  animation:ec-exam-warn 1.5s ease-in-out infinite;
}
@keyframes ec-exam-warn{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.7;transform:scale(1.03)}}

.ec-exam-body{
  flex:1;overflow-y:auto;
  padding:26px 20px 140px;display:flex;justify-content:center;
}
.ec-exam-inner{width:100%;max-width:720px}

.ec-exam-progress{
  display:flex;justify-content:space-between;align-items:center;
  margin-bottom:10px;font-size:12px;font-weight:900;
  color:var(--lang-ink-soft);
  letter-spacing:.04em;text-transform:uppercase;
}
.ec-exam-progress strong{color:var(--lang-ink);font-weight:900}
.ec-exam-progress-bar{
  height:14px;border-radius:999px;
  background:#E8E5F2;overflow:hidden;
  margin-bottom:26px;
  border:2px solid var(--lang-line);
  position:relative;
}
.ec-exam-progress-fill{
  height:100%;border-radius:999px;
  background:linear-gradient(90deg,#D4F55C,#B8E62E);
  transition:width .6s cubic-bezier(.22,1,.36,1);
  position:relative;
}
.ec-exam-progress-fill::after{
  content:'';position:absolute;top:0;bottom:0;left:-20%;
  width:20%;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.6),transparent);
  animation:ec-lr-shine 2s ease-in-out infinite;
  pointer-events:none;
}

.ec-exam-q{
  background:#fff;
  border:3px solid var(--lang-line);
  border-radius:26px;
  padding:26px;
  box-shadow:0 8px 0 var(--lang-line);
  animation:ec-lr-q-in .5s cubic-bezier(.34,1.56,.64,1) both;
  background-image:radial-gradient(circle at 100% 0%,rgba(212,245,92,.14),transparent 55%);
}
@keyframes ec-lr-q-in{
  from{opacity:0;transform:translateY(12px) scale(.98)}
  to{opacity:1;transform:translateY(0) scale(1)}
}
.ec-exam-q-num{
  font-size:11px;font-weight:900;letter-spacing:.1em;
  text-transform:uppercase;
  color:var(--lang-ink);
  background:var(--lang-lime);
  display:inline-block;padding:6px 13px;border-radius:999px;
  border:2px solid var(--lang-line);
  box-shadow:0 2px 0 var(--lang-line);
  margin-bottom:18px;
}
.ec-exam-q-text{
  font-size:clamp(17px,1.2vw + 13px,21px);
  font-weight:900;line-height:1.4;
  color:var(--lang-ink);
  margin:0 0 24px;letter-spacing:-.02em;
}
.ec-exam-options{display:flex;flex-direction:column;gap:12px}
.ec-exam-option{
  display:flex;align-items:center;gap:14px;
  padding:15px 20px;
  border-radius:16px;
  border:2px solid var(--lang-line);
  background:#fff;
  color:var(--lang-ink);
  font-size:14px;font-weight:800;
  font-family:inherit;text-align:left;cursor:pointer;
  transition:transform .22s cubic-bezier(.34,1.56,.64,1),
             box-shadow .18s ease,
             background .2s ease;
  box-shadow:0 4px 0 var(--lang-line);
  animation:ec-lr-slide-in .4s ease both;
}
.ec-exam-option:nth-child(1){animation-delay:.08s}
.ec-exam-option:nth-child(2){animation-delay:.14s}
.ec-exam-option:nth-child(3){animation-delay:.20s}
.ec-exam-option:nth-child(4){animation-delay:.26s}
.ec-exam-option:hover{
  background:var(--lang-lime-soft);
  transform:translateY(-3px) translateX(4px);
  box-shadow:0 7px 0 var(--lang-line);
}
.ec-exam-option:active{
  transform:translateY(2px);
  box-shadow:0 1px 0 var(--lang-line);
}
.ec-exam-option--selected{
  background:var(--lang-lime);
  color:var(--lang-ink);
  font-weight:900;
  animation:ec-lr-selected-pop .4s cubic-bezier(.34,1.56,.64,1);
}
@keyframes ec-lr-selected-pop{
  0%{transform:scale(1)}
  50%{transform:scale(1.03)}
  100%{transform:scale(1)}
}
.ec-exam-option-letter{
  width:30px;height:30px;border-radius:10px;flex-shrink:0;
  background:#fff;
  border:2px solid var(--lang-line);
  display:flex;align-items:center;justify-content:center;
  font-size:13px;font-weight:900;
  color:var(--lang-ink);
  transition:transform .3s cubic-bezier(.34,1.56,.64,1), background .2s ease, color .2s ease;
  box-shadow:0 2px 0 var(--lang-line);
}
.ec-exam-option:hover .ec-exam-option-letter{transform:rotate(-8deg) scale(1.08)}
.ec-exam-option--selected .ec-exam-option-letter{
  background:var(--lang-ink);
  color:var(--lang-lime);
}

.ec-exam-footer{
  position:absolute;left:0;right:0;bottom:0;
  padding:14px 20px calc(14px + env(safe-area-inset-bottom, 0px));
  background:#fff;
  border-top:2px solid var(--lang-line);
  display:flex;align-items:center;justify-content:space-between;gap:12px;
}
.ec-exam-nav{display:flex;gap:10px}
.ec-exam-nav-btn{
  display:inline-flex;align-items:center;gap:6px;
  padding:12px 18px;border-radius:14px;
  border:2px solid var(--lang-line);
  background:#fff;
  color:var(--lang-ink);
  font-size:13px;font-weight:900;
  font-family:inherit;cursor:pointer;
  transition:transform .22s cubic-bezier(.34,1.56,.64,1),box-shadow .18s ease;
  min-height:46px;
  box-shadow:0 4px 0 var(--lang-line);
  letter-spacing:.02em;
}
.ec-exam-nav-btn:hover:not(:disabled){
  background:var(--lang-lime-soft);
  transform:translateY(-3px);
  box-shadow:0 7px 0 var(--lang-line);
}
.ec-exam-nav-btn:active:not(:disabled){
  transform:translateY(2px);
  box-shadow:0 1px 0 var(--lang-line);
}
.ec-exam-nav-btn:disabled{opacity:.4;cursor:not-allowed}
.ec-exam-nav-btn--primary{background:var(--lang-ink);color:var(--lang-lime)}
.ec-exam-nav-btn--primary:hover:not(:disabled){background:var(--lang-ink);color:var(--lang-lime)}
.ec-exam-nav-btn--submit{background:var(--lang-purple);color:#fff}
.ec-exam-nav-btn--submit:hover:not(:disabled){background:#6b4be0;color:#fff}

.ec-exam-palette{
  display:flex;gap:8px;overflow-x:auto;
  scrollbar-width:none;padding:4px 0;max-width:50%;
}
.ec-exam-palette::-webkit-scrollbar{display:none}
.ec-exam-palette-dot{
  width:36px;height:36px;border-radius:10px;
  border:2px solid var(--lang-line);
  background:#fff;
  color:var(--lang-ink);
  font-size:12px;font-weight:900;
  cursor:pointer;flex-shrink:0;
  transition:transform .22s cubic-bezier(.34,1.56,.64,1),
             box-shadow .18s ease,
             background .2s ease,
             color .2s ease;
  box-shadow:0 2px 0 var(--lang-line);
  animation:ec-lr-pop .3s cubic-bezier(.34,1.56,.64,1) both;
}
.ec-exam-palette-dot:nth-child(1){animation-delay:.02s}
.ec-exam-palette-dot:nth-child(2){animation-delay:.04s}
.ec-exam-palette-dot:nth-child(3){animation-delay:.06s}
.ec-exam-palette-dot:nth-child(4){animation-delay:.08s}
.ec-exam-palette-dot:nth-child(5){animation-delay:.10s}
.ec-exam-palette-dot:nth-child(6){animation-delay:.12s}
.ec-exam-palette-dot:nth-child(7){animation-delay:.14s}
.ec-exam-palette-dot:nth-child(8){animation-delay:.16s}
.ec-exam-palette-dot:hover{
  background:var(--lang-lime-soft);
  transform:translateY(-3px);
  box-shadow:0 4px 0 var(--lang-line);
}
.ec-exam-palette-dot--answered{background:var(--lang-lime);color:var(--lang-ink)}
.ec-exam-palette-dot--active{
  background:var(--lang-ink);
  color:var(--lang-lime);
  transform:translateY(-3px);
  box-shadow:0 4px 0 var(--lang-line);
}

.ec-exam-modal{
  position:fixed;inset:0;z-index:10000;
  background:rgba(15,18,34,.65);
  backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);
  display:flex;align-items:center;justify-content:center;padding:20px;
  animation:ec-lr-fade .25s ease both;
}
.ec-exam-modal-card{
  background:#fff;
  border:3px solid var(--lang-line);
  border-radius:28px;
  padding:30px;max-width:440px;width:100%;
  box-shadow:0 10px 0 var(--lang-line),0 24px 60px rgba(15,18,34,.35);
  text-align:center;
  background-image:radial-gradient(circle at 100% 0%,rgba(212,245,92,.12),transparent 55%);
  animation:ec-lr-pop .35s cubic-bezier(.34,1.56,.64,1) both;
}
.ec-exam-modal-icon{
  width:72px;height:72px;border-radius:50%;
  background:var(--lang-lime);color:var(--lang-ink);
  display:flex;align-items:center;justify-content:center;
  margin:0 auto 18px;
  border:2px solid var(--lang-line);
  box-shadow:0 4px 0 var(--lang-line);
  animation:ec-lr-avatar-bounce 1.6s ease-in-out infinite;
}
.ec-exam-modal-icon svg{width:32px;height:32px}
.ec-exam-modal h3{
  margin:0 0 10px;font-size:20px;font-weight:900;
  color:var(--lang-ink);letter-spacing:-.02em;
}
.ec-exam-modal p{
  margin:0 0 22px;font-size:13.5px;line-height:1.55;
  color:var(--lang-ink-soft);font-weight:700;
}
.ec-exam-modal-stats{
  display:grid;grid-template-columns:repeat(2,1fr);
  gap:14px;margin-bottom:24px;
}
.ec-exam-modal-stat{
  background:#fff;
  border:2px solid var(--lang-line);
  border-radius:16px;padding:14px;
  text-align:center;
  box-shadow:0 3px 0 var(--lang-line);
}
.ec-exam-modal-stat strong{
  display:block;font-size:24px;font-weight:900;
  color:var(--lang-ink);line-height:1;margin-bottom:6px;
  letter-spacing:-.03em;
}
.ec-exam-modal-stat span{
  font-size:10.5px;font-weight:900;
  color:var(--lang-ink-soft);
  text-transform:uppercase;letter-spacing:.08em;
}
.ec-exam-modal-actions{display:flex;gap:12px}
.ec-exam-modal-actions button{
  flex:1;padding:14px 20px;border-radius:14px;
  border:2px solid var(--lang-line);
  font-family:inherit;font-size:13.5px;font-weight:900;
  cursor:pointer;transition:transform .22s cubic-bezier(.34,1.56,.64,1),box-shadow .18s ease;
  box-shadow:0 4px 0 var(--lang-line);
  letter-spacing:.03em;
}
.ec-exam-modal-actions .ghost{background:#fff;color:var(--lang-ink)}
.ec-exam-modal-actions .ghost:hover{
  background:var(--lang-lime-soft);
  transform:translateY(-3px);
  box-shadow:0 7px 0 var(--lang-line);
}
.ec-exam-modal-actions .primary{background:var(--lang-lime);color:var(--lang-ink)}
.ec-exam-modal-actions .primary:hover{
  transform:translateY(-3px);
  box-shadow:0 7px 0 var(--lang-line);
}

.ec-exam-result{
  position:fixed;inset:0;z-index:9999;
  background:#F8F9FC;
  display:flex;align-items:center;justify-content:center;padding:20px;
  animation:ec-lr-fade .3s ease both;
}
.ec-exam-result-card{
  background:#fff;
  border:3px solid var(--lang-line);
  border-radius:28px;
  padding:42px 30px;max-width:480px;width:100%;
  text-align:center;
  box-shadow:0 12px 0 var(--lang-line),0 24px 60px rgba(15,18,34,.14);
  background-image:radial-gradient(circle at 100% 0%,rgba(212,245,92,.14),transparent 55%);
  animation:ec-lr-pop .5s cubic-bezier(.34,1.56,.64,1) both;
}
.ec-exam-result-emoji{
  font-size:64px;margin-bottom:16px;display:block;line-height:1;
  animation:ec-lr-avatar-bounce 1.8s ease-in-out infinite;
}
.ec-exam-result-card h2{
  margin:0 0 10px;font-size:26px;font-weight:900;
  color:var(--lang-ink);letter-spacing:-.03em;
}
.ec-exam-result-card p{
  margin:0 0 24px;font-size:14px;line-height:1.55;
  color:var(--lang-ink-soft);font-weight:700;
}
.ec-exam-result-score{
  display:grid;grid-template-columns:repeat(3,1fr);
  gap:12px;margin-bottom:26px;
}
.ec-exam-result-score div{
  background:#fff;
  border:2px solid var(--lang-line);
  border-radius:16px;padding:16px;
  box-shadow:0 3px 0 var(--lang-line);
  animation:ec-lr-pop .5s cubic-bezier(.34,1.56,.64,1) both;
}
.ec-exam-result-score div:nth-child(1){animation-delay:.15s}
.ec-exam-result-score div:nth-child(2){animation-delay:.25s}
.ec-exam-result-score div:nth-child(3){animation-delay:.35s}
.ec-exam-result-score strong{
  display:block;font-size:24px;font-weight:900;
  color:var(--lang-ink);line-height:1;margin-bottom:6px;
  letter-spacing:-.03em;
}
.ec-exam-result-score span{
  font-size:10.5px;font-weight:900;
  color:var(--lang-ink-soft);
  text-transform:uppercase;letter-spacing:.08em;
}

/* ============================================================
   ANIMATIONS
   ============================================================ */
.ec-live-anim{animation:ec-lr-slide-in .5s cubic-bezier(.22,1,.36,1) both}
.ec-live-anim-1{animation-delay:.08s}
.ec-live-anim-2{animation-delay:.14s}
.ec-live-anim-3{animation-delay:.20s}

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width:1080px){
  .ec-lobby-grid{grid-template-columns:1fr}
  .ec-live-stats{grid-template-columns:repeat(2,1fr)}
}

@media (max-width:900px){
  .ec-live-hero{flex-direction:column;align-items:flex-start;min-height:0}
  .ec-live-hero-mascot{
    position:absolute;right:14px;bottom:14px;
    transform:scale(.72);transform-origin:bottom right;
    animation:none;
  }
}

@media (max-width:720px){
  .ec-live-head{margin-bottom:16px}
  .ec-live-stats{grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px}
  .ec-live-stat{padding:16px;border-radius:18px}
  .ec-live-stat-value{font-size:20px}

  .ec-live-card{padding:18px;border-radius:22px;box-shadow:0 5px 0 var(--lang-line)}
  .ec-live-card:hover{transform:none;box-shadow:0 5px 0 var(--lang-line)}
  .ec-live-title{font-size:15px}
  .ec-live-card-meta{gap:12px;font-size:11.5px}

  .ec-live-actions{
    display:flex;overflow-x:auto;scrollbar-width:none;
    gap:10px;margin:0 -4px;padding:0 4px;
  }
  .ec-live-actions::-webkit-scrollbar{display:none}
  .ec-live-btn{flex:0 0 auto;min-width:150px}
  .ec-live-btn--primary,
  .ec-live-btn--zoom{min-width:180px}

  .ec-live-hero{padding:22px 20px;border-radius:26px}
  .ec-live-hero h1{font-size:22px}
  .ec-live-hero p{font-size:13px}
  .ec-live-hero-chips{gap:8px;margin-top:16px}
  .ec-live-hero-chip{padding:8px 12px;min-width:74px;border-radius:12px}
  .ec-live-hero-chip strong{font-size:17px}
  .ec-live-hero-chip span{font-size:9px}
  .ec-live-hero-mascot{display:none}

  .ec-lobby-hero{padding:22px 20px;border-radius:26px}
  .ec-lobby-hero h1{font-size:22px}
  .ec-lobby-hero p{font-size:13px}
  .ec-lobby-hero-stats{gap:8px;margin-top:16px}
  .ec-lobby-hero-stat{padding:8px 12px;min-width:74px;border-radius:12px}
  .ec-lobby-hero-stat strong{font-size:17px}
  .ec-lobby-hero-stat span{font-size:9px}
  .ec-lobby-card{padding:18px;border-radius:20px}

  .ec-class-stage{padding:56px 8px 100px}
  .ec-class-grid{gap:8px}
  .ec-class-grid[data-count="2"],
  .ec-class-grid[data-count="3"],
  .ec-class-grid[data-count="4"],
  .ec-class-grid[data-count="5"],
  .ec-class-grid[data-count="6"]{grid-template-columns:1fr 1fr;grid-template-rows:auto}
  .ec-class-grid[data-count="3"] > *:first-child{grid-column:auto}
  .ec-class-avatar{width:56px;height:56px;font-size:22px}
  .ec-class-tile-label{font-size:10.5px;padding:3px 8px;left:8px;bottom:8px}
  .ec-class-self{width:120px;right:10px;bottom:108px;border-radius:12px}
  .ec-class-self .ec-class-avatar{width:32px;height:32px;font-size:13px}
  .ec-class-top{padding:10px 12px}
  .ec-class-title{font-size:12.5px}
  .ec-class-bottom{padding:10px 10px calc(10px + env(safe-area-inset-bottom, 0px));gap:8px}
  .ec-class-ctrl{width:46px;height:46px}
  .ec-class-ctrl svg{width:18px;height:18px}
  .ec-class-ctrl--end{padding:0 18px;gap:6px;font-size:12px}

  .ec-class-chat{
    width:auto;left:0;right:0;top:auto;height:70vh;
    border-left:none;border-top:1px solid rgba(255,255,255,.08);
    border-radius:20px 20px 0 0;
    animation:ec-lr-chat-up .3s cubic-bezier(.22,1,.36,1) both;
  }
  @keyframes ec-lr-chat-up{from{transform:translateY(100%)}to{transform:translateY(0)}}
  .ec-class-chat-head{padding:14px 16px}
  .ec-class-chat-body{padding:14px 16px}

  .ec-exam-head{padding:12px 14px}
  .ec-exam-title{font-size:13px}
  .ec-exam-timer{font-size:12px;padding:7px 13px}
  .ec-exam-body{padding:18px 14px 180px}
  .ec-exam-q{padding:22px 18px;border-radius:22px;box-shadow:0 6px 0 var(--lang-line)}
  .ec-exam-q-text{font-size:16px;margin-bottom:20px}
  .ec-exam-option{padding:14px 16px;font-size:13.5px}
  .ec-exam-footer{flex-direction:column;gap:10px;padding:12px 14px calc(12px + env(safe-area-inset-bottom, 0px))}
  .ec-exam-palette{max-width:100%;order:-1;width:100%;justify-content:center}
  .ec-exam-nav{width:100%}
  .ec-exam-nav-btn{flex:1}
  .ec-exam-modal-card{padding:26px 22px;border-radius:24px}
  .ec-exam-result-card{padding:34px 24px;border-radius:24px}

  .ec-zoom-embed-bar{padding:10px 12px}
  .ec-zoom-embed-bar-title{font-size:12.5px}
  .ec-zoom-embed-btn{padding:7px 11px;font-size:11.5px}
  .ec-connect-card{padding:30px 24px;border-radius:24px}
}

@media (max-width:380px){
  .ec-class-self{width:100px;bottom:100px}
  .ec-live-btn{min-width:130px}
  .ec-live-btn--primary,
  .ec-live-btn--zoom{min-width:160px}
  .ec-exam-palette-dot{width:32px;height:32px;font-size:11px}
  .ec-zoom-embed-bar-sub{display:none}
}

@media (prefers-reduced-motion:reduce){
  .ec-live-dot,.ec-live-anim,.ec-class,.ec-class-chat,.ec-exam,.ec-exam-q,
  .ec-exam-modal,.ec-exam-result,.ec-connect-card,.ec-connect-overlay,
  .ec-zoom-embed,.ec-live-stat,.ec-live-card,.ec-live-hero,.ec-live-hero-mascot,
  .ec-live-hero-sparkle,.ec-live-badge--live::after,.ec-class-tile--speaking,
  .ec-class-tile-mic--on,.ec-class-avatar,.ec-lb-row,.ec-lb-rank,
  .ec-exam-option,.ec-exam-palette-dot,.ec-exam-result-score div,
  .ec-exam-result-emoji,.ec-exam-modal-icon{animation:none!important}
  .ec-live-fill,.ec-exam-progress-fill{transition:none}
  .ec-live-fill::after,.ec-live-stat::after,.ec-exam-progress-fill::after,
  .ec-live-btn::before{animation:none!important;display:none}
  .ec-class-rec-dot{animation:none}
  .ec-exam-timer--danger{animation:none}
  .ec-connect-spinner,.ec-connect-spinner::after{animation:none}
  .ec-live-card:hover,.ec-live-stat:hover,.ec-live-tab:hover,
  .ec-live-btn:hover:not(:disabled),.ec-guest-btn:hover:not(:disabled),
  .ec-exam-option:hover,.ec-exam-nav-btn:hover:not(:disabled),
  .ec-exam-palette-dot:hover,.ec-exam-modal-actions button:hover,
  .ec-lb-row:hover,.ec-class-tile:hover,.ec-class-icon-btn:hover,
  .ec-class-ctrl:hover,.ec-class-self:hover{transform:none}
  .ec-live-tab,.ec-live-btn,.ec-guest-btn,.ec-exam-option,.ec-exam-nav-btn,
  .ec-exam-palette-dot,.ec-class-icon-btn,.ec-class-ctrl{transition:none}
}
`;

/* ============================================================
   MOCK DATA
   ============================================================ */
const FALLBACK_ROOMS = [
  { id: 'lr1', title: 'IELTS Mock — Reading & Writing', seats: 100, joined: 87, startsIn: '42 min', level: 'IELTS', duration: '2h 45m', live: false },
  { id: 'lr2', title: 'SAT Math Sprint — Geometry',      seats: 60,  joined: 21, startsIn: '1h 42m', level: 'SAT',   duration: '70 min',  live: false },
  { id: 'lr3', title: 'PTE Listening Practice',          seats: 40,  joined: 12, startsIn: '2h 15m', level: 'PTE',   duration: '45 min',  live: false },
  { id: 'lr4', title: 'Speaking Club — Fluency Drills',  seats: 30,  joined: 24, startsIn: 'Live now', level: 'Speaking', duration: '60 min', live: true },
];

const LEADERBOARD = [
  { n: 'Arif',   xp: 980 },
  { n: 'Sadia',  xp: 940 },
  { n: 'Rifat',  xp: 870 },
  { n: 'Nabila', xp: 810 },
  { n: 'You',    xp: 0, me: true },
];

const CLASS_PARTICIPANTS = [
  { id: 'p1', name: 'You',         initials: 'Y',  mic: true,  speaking: true,  self: true },
  { id: 'p2', name: 'Ms. Rahman',  initials: 'MR', mic: true,  speaking: false, host: true },
  { id: 'p3', name: 'Arif',        initials: 'A',  mic: false, speaking: false },
  { id: 'p4', name: 'Sadia',       initials: 'S',  mic: true,  speaking: false },
  { id: 'p5', name: 'Rifat',       initials: 'R',  mic: false, speaking: false },
  { id: 'p6', name: 'Nabila',      initials: 'N',  mic: true,  speaking: false },
];

const MOCK_QUESTIONS = [
  { q: 'The sun ___ in the east every morning.', options: ['rise', 'rises', 'rising', 'rose'], answer: 1 },
  { q: 'She has been living here ___ 2015.', options: ['from', 'since', 'for', 'at'], answer: 1 },
  { q: 'If I ___ you, I would accept the offer.', options: ['am', 'was', 'were', 'be'], answer: 2 },
  { q: 'The news ___ surprising to everyone.', options: ['are', 'is', 'were', 'have'], answer: 1 },
  { q: 'He is the man ___ helped me yesterday.', options: ['which', 'who', 'whose', 'whom'], answer: 1 },
  { q: 'Neither of the boys ___ ready for the test.', options: ['are', 'is', 'were', 'have'], answer: 1 },
  { q: 'By next year, I ___ my degree.', options: ['finish', 'will finish', 'will have finished', 'finished'], answer: 2 },
  { q: 'She sings ___.', options: ['beautiful', 'beautifully', 'beauty', 'beautify'], answer: 1 },
];

const MOCK_CHAT = [
  { id: 'c1', name: 'Ms. Rahman', initials: 'MR', text: 'Welcome everyone! We’ll begin in a couple of minutes.', time: '8:01 PM' },
  { id: 'c2', name: 'Arif',       initials: 'A',  text: 'Excited for this session 🎉', time: '8:02 PM' },
  { id: 'c3', name: 'Sadia',      initials: 'S',  text: 'Can you share the practice passage PDF again?', time: '8:03 PM' },
  { id: 'c4', name: 'Ms. Rahman', initials: 'MR', text: 'Just posted it in the resources tab 👍', time: '8:03 PM' },
];

/* ============================================================
   HELPERS
   ============================================================ */
function pad(n) { return n < 10 ? `0${n}` : String(n); }
function fmtTime(totalSec) {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${pad(m)}:${pad(s)}`;
}

function openInNewTab(url) {
  const a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[data-src="${src}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.dataset.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

function loadCss(href) {
  if (document.querySelector(`link[data-href="${href}"]`)) return;
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = href;
  l.dataset.href = href;
  document.head.appendChild(l);
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export function LiveRooms() {
  const { user } = useAuth();

  const [view, setView] = useState('list');
  const [activeRoom, setActiveRoom] = useState(null);

  const [rooms, setRooms] = useState([]);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [joined, setJoined] = useState(false);
  const [tab, setTab] = useState('all');

  const [connectingRoom, setConnectingRoom] = useState(null);
  const [connectError, setConnectError] = useState(null);
  const [zoomInfo, setZoomInfo] = useState(null);

  useEffect(() => {
    liveRoomsApi.upcoming()
      .then((r) => setRooms(r?.length ? r : FALLBACK_ROOMS))
      .catch(() => setRooms(FALLBACK_ROOMS));
  }, []);

  const openLobby = (room) => {
    if (user) liveRoomsApi.join(room.id).catch(() => {});
    setActiveRoom(room);
    setJoined(!!user);
    setView('lobby');
  };

  const joinLiveClass = async (room) => {
    setConnectingRoom(room);
    setConnectError(null);

    try {
      const info = await liveRoomsApi.zoom(room.id);

      if (info?.joinUrl && !info?.signature) {
        openInNewTab(info.joinUrl);
        setConnectingRoom(null);
        return;
      }

      if (info?.signature && info?.meetingNumber) {
        if (user) liveRoomsApi.join(room.id).catch(() => {});
        setZoomInfo({
          room,
          joinUrl: info.joinUrl,
          sdkKey: info.sdkKey || info.sdk_key,
          signature: info.signature,
          meetingNumber: String(info.meetingNumber),
          password: info.password || '',
          userName: info.userName || user?.name || 'Guest',
          userEmail: info.userEmail || 'guest@example.com',
          role: info.role ?? 0,
        });
        setConnectingRoom(null);
        return;
      }

      throw new Error('No Zoom join info returned from server');
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        'Could not reach the Zoom service';
      setConnectError(msg);

      setTimeout(() => {
        if (user) liveRoomsApi.join(room.id).catch(() => {});
        setActiveRoom(room);
        setJoined(true);
        setView('class');
        setConnectingRoom(null);
        setConnectError(null);
      }, 1400);
    }
  };

  const joinLiveClassFromLobby = () => {
    if (activeRoom) joinLiveClass(activeRoom);
  };

  const startExam = (room) => {
    setActiveRoom(room);
    setView('exam');
  };

  const confirmGuestJoin = () => {
    if (!guestName || !guestEmail || !activeRoom) return;
    liveRoomsApi.join(activeRoom.id, { name: guestName, email: guestEmail }).catch(() => {});
    setJoined(true);
  };

  const leaveAll = () => {
    setView('list');
    setActiveRoom(null);
    setJoined(false);
    setGuestName('');
    setGuestEmail('');
  };

  const liveCount = rooms.filter((r) => r.live).length;
  const upcomingCount = rooms.filter((r) => !r.live).length;
  const totalSeats = rooms.reduce((s, r) => s + (r.seats || 0), 0);
  const totalJoined = rooms.reduce((s, r) => s + (r.joined || 0), 0);

  const visibleRooms = rooms.filter((r) => {
    if (tab === 'live') return r.live;
    if (tab === 'upcoming') return !r.live;
    return true;
  });

  /* ============================================================
     ZOOM EMBEDDED VIEW
     ============================================================ */
  if (zoomInfo) {
    return (
      <ZoomEmbedView
        info={zoomInfo}
        onExit={() => setZoomInfo(null)}
      />
    );
  }

  /* ============================================================
     LIVE CLASS VIEW
     ============================================================ */
  if (view === 'class' && activeRoom) {
    return (
      <LiveClassView
        room={activeRoom}
        onLeave={() => setView('list')}
      />
    );
  }

  /* ============================================================
     EXAM VIEW
     ============================================================ */
  if (view === 'exam' && activeRoom) {
    return (
      <ExamView
        room={activeRoom}
        onExit={() => setView('list')}
      />
    );
  }

  /* ============================================================
     LOBBY VIEW
     ============================================================ */
  if (view === 'lobby' && activeRoom) {
    const pct = Math.min(100, Math.round((activeRoom.joined / activeRoom.seats) * 100));

    return (
      <>
        <style>{LIVE_CSS}</style>

        <div className="ec-lobby-hero ec-live-anim">
          <div className="ec-lobby-hero-copy">
            <span className="ec-lobby-hero-badge">
              <span className="ec-live-dot" />
              Waiting room · {activeRoom.startsIn === 'Live now' ? 'starting now' : `starts in ${activeRoom.startsIn}`}
            </span>
            <h1>{activeRoom.title}</h1>
            <p>Everyone starts together — questions are shuffled per user and navigation is time-locked once the exam begins.</p>
            <div className="ec-lobby-hero-stats">
              <div className="ec-lobby-hero-stat"><strong>{activeRoom.joined}</strong><span>Joined</span></div>
              <div className="ec-lobby-hero-stat"><strong>{activeRoom.seats}</strong><span>Seats</span></div>
              <div className="ec-lobby-hero-stat"><strong>{activeRoom.duration}</strong><span>Duration</span></div>
            </div>
          </div>
        </div>

        <div className="ec-lobby-grid">
          <div>
            {!user && !joined && (
              <div className="ec-lobby-card ec-live-anim ec-live-anim-1">
                <h3>Join as guest</h3>
                <p style={{ fontSize: 12.5, color: 'var(--lang-ink-soft)', marginTop: 0, marginBottom: 14, fontWeight: 700 }}>
                  No account needed — just your name and email. You’ll get a temporary seat.
                </p>
                <div className="ec-guest-form">
                  <input className="ec-guest-input" placeholder="Your name" value={guestName} onChange={(e) => setGuestName(e.target.value)} />
                  <input className="ec-guest-input" type="email" placeholder="Email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} />
                  <button className="ec-guest-btn" onClick={confirmGuestJoin} disabled={!guestName || !guestEmail}>Confirm my spot</button>
                </div>
              </div>
            )}

            <div className="ec-lobby-card ec-live-anim ec-live-anim-2">
              <h3>Room capacity <span>{pct}%</span></h3>
              <div className="ec-live-fill-row">
                <div className="ec-live-fill-bar"><div className="ec-live-fill" style={{ width: `${pct}%` }} /></div>
                <span className="ec-live-fill-pct">{pct}%</span>
              </div>
              <div className="ec-live-card-meta" style={{ marginTop: 14, marginBottom: 0 }}>
                <span><Icon name="users" /> {activeRoom.joined} of {activeRoom.seats} joined</span>
                <span><Icon name="calendar" /> {activeRoom.duration}</span>
              </div>

              <div className="ec-live-actions" style={{ marginTop: 20, gridTemplateColumns: '1fr 1fr 1fr' }}>
                <button
                  className="ec-live-btn ec-live-btn--zoom"
                  onClick={joinLiveClassFromLobby}
                  disabled={!!connectingRoom}
                >
                  <IcoCamOn /> Join Live Class
                </button>
                <button className="ec-live-btn ec-live-btn--dark" onClick={() => setView('exam')}>
                  <IcoPlay /> Start Exam
                </button>
                <button className="ec-live-btn ec-live-btn--ghost" onClick={leaveAll}>Leave</button>
              </div>
            </div>
          </div>

          <aside className="ec-live-anim ec-live-anim-3">
            <div className="ec-lobby-card">
              <h3>Live leaderboard <span>{LEADERBOARD.length}</span></h3>
              {LEADERBOARD.map((p, i) => (
                <div key={p.n} className={`ec-lb-row${p.me ? ' ec-lb-row--me' : ''}`}>
                  <span className="ec-lb-rank">{i + 1}</span>
                  <span className="ec-lb-avatar">{p.n.charAt(0)}</span>
                  <span className="ec-lb-name">{p.n}</span>
                  <span className="ec-lb-xp">{p.xp} XP</span>
                </div>
              ))}
            </div>
          </aside>
        </div>

        {connectingRoom && (
          <ConnectingOverlay room={connectingRoom} error={connectError} />
        )}
      </>
    );
  }

  /* ============================================================
     LIST VIEW (default)
     ============================================================ */
  return (
    <>
      <style>{LIVE_CSS}</style>

      {/* NEW: Hero with mascot */}
      <div className="ec-live-hero ec-live-anim">
        <div className="ec-live-hero-orb" aria-hidden="true" />
        <div className="ec-live-hero-copy">
          <span className="ec-live-hero-badge">
            <span className="ec-live-dot" />
            Live exam rooms
          </span>
          <h1>Join a <em>live</em> session and level up faster</h1>
          <p>
            Synchronized mocks, live Zoom classes, and auto-scored exams — all in one place.
            Up to 100 participants per room.
          </p>
          <div className="ec-live-hero-chips">
            <div className="ec-live-hero-chip"><strong>{liveCount}</strong><span>Live now</span></div>
            <div className="ec-live-hero-chip"><strong>{totalJoined}</strong><span>Joined</span></div>
            <div className="ec-live-hero-chip"><strong>{totalSeats}</strong><span>Seats</span></div>
          </div>
        </div>
        <div className="ec-live-hero-mascot">
          <span className="ec-live-hero-sparkle ec-live-hero-sparkle--a" aria-hidden="true" />
          <span className="ec-live-hero-sparkle ec-live-hero-sparkle--b" aria-hidden="true" />
          <span className="ec-live-hero-sparkle ec-live-hero-sparkle--c" aria-hidden="true" />
          <LangutMascot size={180} />
        </div>
      </div>

      {/* Stats */}
      <div className="ec-live-stats">
        <div className="ec-live-stat">
          <span className="ec-live-stat-icon ec-live-stat-icon--lime"><IcoCamOn /></span>
          <span className="ec-live-stat-value">{liveCount}</span>
          <span className="ec-live-stat-label">Live now</span>
        </div>
        <div className="ec-live-stat">
          <span className="ec-live-stat-icon ec-live-stat-icon--purple"><IcoClock /></span>
          <span className="ec-live-stat-value">{upcomingCount}</span>
          <span className="ec-live-stat-label">Upcoming</span>
        </div>
        <div className="ec-live-stat">
          <span className="ec-live-stat-icon ec-live-stat-icon--yellow"><IcoUsers /></span>
          <span className="ec-live-stat-value">{totalJoined}</span>
          <span className="ec-live-stat-label">Joined</span>
        </div>
        <div className="ec-live-stat">
          <span className="ec-live-stat-icon ec-live-stat-icon--pink"><IcoChat /></span>
          <span className="ec-live-stat-value">{totalSeats}</span>
          <span className="ec-live-stat-label">Total seats</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="ec-live-tabs" role="tablist">
        {[
          { id: 'all',      label: 'All rooms', icon: <Icon name="grid" /> },
          { id: 'live',     label: 'Live now',  icon: <IcoCamOn />,  count: liveCount },
          { id: 'upcoming', label: 'Upcoming',  icon: <IcoClock />,  count: upcomingCount },
        ].map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={`ec-live-tab${tab === t.id ? ' ec-live-tab--active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.icon}
            {t.label}
            {t.count != null && <span className="ec-live-tab-count">{t.count}</span>}
          </button>
        ))}
      </div>

      {/* Rooms */}
      <div className="ec-live-list">
        {visibleRooms.length === 0 ? (
          <div className="ec-lobby-card" style={{ textAlign: 'center', padding: '52px 24px', color: 'var(--lang-ink-soft)', borderStyle: 'dashed' }}>
            No rooms in this tab yet.
          </div>
        ) : (
          visibleRooms.map((r, i) => {
            const pct = Math.min(100, Math.round((r.joined / r.seats) * 100));
            const almostFull = pct > 80;
            return (
              <div
                key={r.id}
                className="ec-live-card"
                style={{ animationDelay: `${0.1 + i * 0.08}s` }}
              >
                <div className="ec-live-card-top">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="ec-live-title">{r.title}</p>
                    <div className="ec-live-chips">
                      {r.live ? (
                        <span className="ec-live-badge ec-live-badge--live">
                          <span className="ec-live-dot" />
                          Live now
                        </span>
                      ) : (
                        <span className={`ec-live-badge${almostFull ? '' : ' ec-live-badge--soon'}`}>
                          <span className="ec-live-dot" />
                          Starts in {r.startsIn}
                        </span>
                      )}
                      <span className="ec-live-chip">{r.level}</span>
                      {r.zoomMeetingId && (
                        <span className="ec-live-chip ec-live-chip--zoom">
                          <IcoCamOn /> Zoom
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="ec-live-fill-row">
                  <div className="ec-live-fill-bar">
                    <div className="ec-live-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="ec-live-fill-pct">{r.joined}/{r.seats}</span>
                </div>

                <div className="ec-live-card-meta">
                  <span><Icon name="users" /> {r.seats - r.joined} seats left</span>
                  <span><Icon name="calendar" /> {r.duration}</span>
                  <span><Icon name="target" /> Auto-scored</span>
                </div>

                <div className="ec-live-sep" />

                <div className="ec-live-actions">
                  <button
                    className="ec-live-btn ec-live-btn--zoom"
                    onClick={() => joinLiveClass(r)}
                    disabled={!!connectingRoom}
                  >
                    <IcoCamOn />
                    {connectingRoom?.id === r.id ? 'Connecting…' : 'Join Live Class'}
                  </button>
                  <button className="ec-live-btn ec-live-btn--ghost" onClick={() => openLobby(r)}>
                    <IcoUsers /> Lobby
                  </button>
                  <button className="ec-live-btn ec-live-btn--dark" onClick={() => startExam(r)}>
                    <IcoPlay /> Take Exam
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {connectingRoom && (
        <ConnectingOverlay room={connectingRoom} error={connectError} />
      )}
    </>
  );
}

/* ============================================================
   CONNECTING OVERLAY
   ============================================================ */
function ConnectingOverlay({ room, error }) {
  return createPortal(
    <div className="ec-connect-overlay">
      <div className="ec-connect-card">
        {!error ? (
          <>
            <div className="ec-connect-spinner" />
            <h3 className="ec-connect-title">Connecting to Zoom…</h3>
            <p className="ec-connect-sub">
              Preparing your secure session for<br />
              <strong style={{ color: 'var(--lang-ink)' }}>{room.title}</strong>
            </p>
          </>
        ) : (
          <>
            <div className="ec-connect-spinner" style={{ borderTopColor: '#FF8FCB' }} />
            <h3 className="ec-connect-title">Couldn’t reach Zoom</h3>
            <p className="ec-connect-sub">Falling back to the in-app class…</p>
            <div className="ec-connect-error">
              <IcoWarn />
              <span>{error}</span>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

/* ============================================================
   ZOOM EMBEDDED VIEW
   ============================================================ */
const ZOOM_SDK_VERSION = '2.18.0';
const ZOOM_SDK_SCRIPT = `https://source.zoom.us/${ZOOM_SDK_VERSION}/zoom-meeting-embedded-${ZOOM_SDK_VERSION}.min.js`;
const ZOOM_SDK_CSS = `https://source.zoom.us/${ZOOM_SDK_VERSION}/css/zoom-meeting-embedded-${ZOOM_SDK_VERSION}.min.css`;

function ZoomEmbedView({ info, onExit }) {
  const containerRef = useRef(null);
  const clientRef = useRef(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        loadCss(ZOOM_SDK_CSS);
        await loadScript(ZOOM_SDK_SCRIPT);

        if (cancelled) return;

        const zoom = window.ZoomMtgEmbedded || window.ZoomMtg;
        if (!zoom) throw new Error('Zoom SDK failed to load');

        const client = zoom.createClient
          ? zoom.createClient()
          : new zoom.ZoomMtg();
        clientRef.current = client;

        await client.init({
          zoomAppRoot: containerRef.current,
          language: 'en-US',
          customize: {
            video: {
              isResizable: true,
              viewSizes: {
                default: { width: 1000, height: 600 },
              },
            },
          },
        });

        if (cancelled) return;

        await client.join({
          sdkKey: info.sdkKey,
          signature: info.signature,
          meetingNumber: info.meetingNumber,
          password: info.password,
          userName: info.userName,
          userEmail: info.userEmail,
          tk: '',
        });

        if (!cancelled) setStatus('joined');
      } catch (err) {
        if (cancelled) return;
        setError(err?.message || 'Failed to join Zoom meeting');
        setStatus('error');
      }
    })();

    return () => {
      cancelled = true;
      try { clientRef.current?.leaveMeeting?.(); } catch { /* noop */ }
      try { clientRef.current?.destroy?.(); } catch { /* noop */ }
    };
  }, [info]);

  const openZoomApp = () => {
    const url = `zoommtg://zoom.us/join?action=join&confno=${encodeURIComponent(info.meetingNumber)}${info.password ? `&pwd=${encodeURIComponent(info.password)}` : ''}&uname=${encodeURIComponent(info.userName)}`;
    openInNewTab(url);
  };

  const openWebFallback = () => {
    if (info.joinUrl) openInNewTab(info.joinUrl);
  };

  return (
    <div className="ec-zoom-embed">
      <style>{LIVE_CSS}</style>

      <div className="ec-zoom-embed-bar">
        <div className="ec-zoom-embed-bar-left">
          <span className="ec-class-rec">
            <span className="ec-class-rec-dot" />
            Zoom
          </span>
          <span className="ec-zoom-embed-bar-title">{info.room.title}</span>
          <span className="ec-zoom-embed-bar-sub">
            Meeting · {info.meetingNumber}
          </span>
        </div>
        <div className="ec-zoom-embed-bar-right">
          {info.joinUrl && (
            <button className="ec-zoom-embed-btn" onClick={openWebFallback} title="Open in browser tab">
              <IcoExternal /> Browser
            </button>
          )}
          <button className="ec-zoom-embed-btn" onClick={openZoomApp} title="Open in desktop app">
            <IcoCamOn /> Desktop app
          </button>
          <button className="ec-zoom-embed-btn ec-zoom-embed-btn--danger" onClick={onExit}>
            <IcoClose /> Leave
          </button>
        </div>
      </div>

      <div className="ec-zoom-embed-container" ref={containerRef}>
        {status === 'loading' && (
          <div className="ec-zoom-embed-fallback">
            <div className="ec-connect-spinner" />
            <h3>Joining Zoom meeting…</h3>
            <p>Please allow camera and microphone access when prompted.</p>
          </div>
        )}

        {status === 'error' && (
          <div className="ec-zoom-embed-fallback">
            <div className="ec-zoom-embed-fallback-icon"><IcoWarn /></div>
            <h3>Couldn’t join inside the app</h3>
            <p>
              {error}<br />
              You can still join using your browser or the Zoom desktop app.
            </p>
            <div className="ec-live-actions" style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              {info.joinUrl && (
                <button className="ec-live-btn ec-live-btn--zoom" onClick={openWebFallback}>
                  <IcoExternal /> Open in browser
                </button>
              )}
              <button className="ec-live-btn ec-live-btn--ghost" onClick={openZoomApp}>
                <IcoCamOn /> Open Zoom app
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   LIVE CLASS VIEW
   ============================================================ */
function LiveClassView({ room, onLeave }) {
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [idle, setIdle] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [messages, setMessages] = useState(MOCK_CHAT);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let timer;
    const reset = () => {
      setIdle(false);
      clearTimeout(timer);
      timer = setTimeout(() => setIdle(true), 3500);
    };
    reset();
    window.addEventListener('mousemove', reset);
    window.addEventListener('touchstart', reset);
    window.addEventListener('keydown', reset);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', reset);
      window.removeEventListener('touchstart', reset);
      window.removeEventListener('keydown', reset);
    };
  }, []);

  const send = () => {
    const t = draft.trim();
    if (!t) return;
    setMessages((m) => [...m, { id: `c-${Date.now()}`, name: 'You', initials: 'Y', text: t, time: 'Now', me: true }]);
    setDraft('');
  };

  const participants = CLASS_PARTICIPANTS.map((p) =>
    p.self ? { ...p, mic, cam } : p
  );
  const visible = participants.slice(0, 6);

  return (
    <div className={`ec-class${idle ? ' ec-class--idle' : ''}`}>
      <style>{LIVE_CSS}</style>

      <div className="ec-class-top">
        <div className="ec-class-info">
          <span className="ec-class-rec">
            <span className="ec-class-rec-dot" />
            REC
          </span>
          <span className="ec-class-title">{room.title}</span>
          <span className="ec-class-timer">
            <IcoClock />
            {fmtTime(elapsed)}
          </span>
        </div>
        <div className="ec-class-top-right">
          <button className="ec-class-icon-btn" onClick={() => setChatOpen((v) => !v)} aria-label="Toggle chat" title="Chat">
            <IcoChat />
          </button>
          <button
            className="ec-class-icon-btn"
            onClick={() => {
              const el = document.querySelector('.ec-class');
              if (!document.fullscreenElement) el?.requestFullscreen?.();
              else document.exitFullscreen?.();
            }}
            aria-label="Fullscreen"
            title="Fullscreen"
          >
            <IcoExpand />
          </button>
          <button className="ec-class-icon-btn" onClick={onLeave} aria-label="Leave" title="Leave">
            <IcoClose />
          </button>
        </div>
      </div>

      <div className="ec-class-stage" onClick={() => setIdle((v) => !v)}>
        <div className="ec-class-grid" data-count={visible.length}>
          {visible.map((p) => (
            <div key={p.id} className={`ec-class-tile${p.speaking ? ' ec-class-tile--speaking' : ''}`}>
              <div className="ec-class-avatar">{p.initials}</div>
              <span className="ec-class-tile-label">
                <span className={`ec-class-tile-mic ec-class-tile-mic--${p.mic ? 'on' : 'off'}`}>
                  {p.mic ? <IcoMicOn /> : <IcoMicOff />}
                </span>
                {p.host ? 'Host · ' : ''}{p.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={`ec-class-self${cam ? '' : ' ec-class-self--off'}`}>
        <div className="ec-class-avatar">Y</div>
        <span className="ec-class-tile-label">
          <span className={`ec-class-tile-mic ec-class-tile-mic--${mic ? 'on' : 'off'}`}>
            {mic ? <IcoMicOn /> : <IcoMicOff />}
          </span>
          You
        </span>
      </div>

      <div className="ec-class-bottom">
        <button className={`ec-class-ctrl${mic ? '' : ' ec-class-ctrl--off'}`} onClick={() => setMic((v) => !v)} aria-label={mic ? 'Mute' : 'Unmute'} title={mic ? 'Mute' : 'Unmute'}>
          {mic ? <IcoMicOn /> : <IcoMicOff />}
        </button>
        <button className={`ec-class-ctrl${cam ? '' : ' ec-class-ctrl--off'}`} onClick={() => setCam((v) => !v)} aria-label={cam ? 'Camera off' : 'Camera on'} title={cam ? 'Turn camera off' : 'Turn camera on'}>
          {cam ? <IcoCamOn /> : <IcoCamOff />}
        </button>
        <button className={`ec-class-ctrl${sharing ? ' ec-class-ctrl--off' : ''}`} onClick={() => setSharing((v) => !v)} aria-label="Share screen" title="Share screen">
          <IcoShare />
        </button>
        <button className="ec-class-ctrl" onClick={() => setChatOpen((v) => !v)} aria-label="Chat" title="Chat">
          <IcoChat />
        </button>
        <button className="ec-class-ctrl" aria-label="Participants" title="Participants">
          <IcoUsers />
        </button>
        <button className="ec-class-ctrl ec-class-ctrl--end" onClick={onLeave} aria-label="Leave class" title="Leave">
          <IcoEnd />
          <span className="ec-class-ctrl-label">Leave</span>
        </button>
      </div>

      {chatOpen && (
        <div className="ec-class-chat">
          <div className="ec-class-chat-head">
            <h3>Chat</h3>
            <button className="ec-class-icon-btn" onClick={() => setChatOpen(false)} aria-label="Close chat">
              <IcoClose />
            </button>
          </div>
          <div className="ec-class-chat-body">
            {messages.map((m) => (
              <div key={m.id} className="ec-class-chat-msg">
                <span className="ec-class-chat-avatar">{m.initials}</span>
                <div className="ec-class-chat-content">
                  <p className="ec-class-chat-name">
                    {m.name} <small>{m.time}</small>
                  </p>
                  <p className={`ec-class-chat-text${m.me ? ' ec-class-chat-text--me' : ''}`}>{m.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="ec-class-chat-input-wrap">
            <input
              className="ec-class-chat-input"
              placeholder="Type a message…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
            />
            <button className="ec-class-chat-send" onClick={send} aria-label="Send">
              <IcoArrowR />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   EXAM VIEW
   ============================================================ */
function ExamView({ room, onExit }) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [confirming, setConfirming] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const total = MOCK_QUESTIONS.length;
  const q = MOCK_QUESTIONS[idx];

  useEffect(() => {
    if (submitted) return;
    if (secondsLeft <= 0) { setSubmitted(true); return; }
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [secondsLeft, submitted]);

  const pick = (i) => setAnswers((a) => ({ ...a, [idx]: i }));
  const next = () => setIdx((i) => Math.min(total - 1, i + 1));
  const prev = () => setIdx((i) => Math.max(0, i - 1));

  const correctCount = Object.entries(answers).filter(([k, v]) => MOCK_QUESTIONS[k].answer === v).length;
  const answeredCount = Object.keys(answers).length;
  const pct = Math.round(((idx + 1) / total) * 100);

  const timerClass =
    secondsLeft <= 60 ? 'ec-exam-timer--danger'
    : secondsLeft <= 5 * 60 ? 'ec-exam-timer--warn'
    : '';

  if (submitted) {
    const score = Math.round((correctCount / total) * 100);
    const emoji = score >= 80 ? '🎉' : score >= 60 ? '👍' : '💪';
    return (
      <div className="ec-exam-result">
        <style>{LIVE_CSS}</style>
        <div className="ec-exam-result-card">
          <span className="ec-exam-result-emoji">{emoji}</span>
          <h2>Exam submitted</h2>
          <p>{room.title} — your responses have been recorded.</p>
          <div className="ec-exam-result-score">
            <div><strong>{answeredCount}</strong><span>Answered</span></div>
            <div><strong>{correctCount}</strong><span>Correct</span></div>
            <div><strong>{score}%</strong><span>Score</span></div>
          </div>
          <div className="ec-exam-modal-actions">
            <button className="ghost" onClick={onExit}>Back to rooms</button>
            <button className="primary" onClick={() => { setAnswers({}); setIdx(0); setSubmitted(false); setSecondsLeft(25 * 60); }}>
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ec-exam">
      <style>{LIVE_CSS}</style>

      <div className="ec-exam-head">
        <div className="ec-exam-head-left">
          <button className="ec-class-icon-btn" onClick={onExit} aria-label="Exit" style={{ background: 'var(--lang-lime-soft)', color: 'var(--lang-ink)', border: '2px solid var(--lang-line)' }}>
            <IcoClose />
          </button>
          <span className="ec-exam-title">{room.title}</span>
        </div>
        <div className="ec-exam-head-right">
          <span className={`ec-exam-timer ${timerClass}`}>
            <IcoClock /> {fmtTime(secondsLeft)}
          </span>
        </div>
      </div>

      <div className="ec-exam-body">
        <div className="ec-exam-inner">
          <div className="ec-exam-progress">
            <span>Question <strong>{idx + 1}</strong> of {total}</span>
            <span>{answeredCount} answered</span>
          </div>
          <div className="ec-exam-progress-bar">
            <div className="ec-exam-progress-fill" style={{ width: `${pct}%` }} />
          </div>

          <div className="ec-exam-q" key={idx}>
            <span className="ec-exam-q-num">Question {idx + 1}</span>
            <p className="ec-exam-q-text">{q.q}</p>
            <div className="ec-exam-options">
              {q.options.map((opt, i) => {
                const letter = String.fromCharCode(65 + i);
                const selected = answers[idx] === i;
                return (
                  <button
                    key={i}
                    className={`ec-exam-option${selected ? ' ec-exam-option--selected' : ''}`}
                    onClick={() => pick(i)}
                  >
                    <span className="ec-exam-option-letter">{letter}</span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="ec-exam-footer">
        <div className="ec-exam-palette">
          {MOCK_QUESTIONS.map((_, i) => {
            const isAnswered = answers[i] != null;
            const isActive = i === idx;
            return (
              <button
                key={i}
                className={`ec-exam-palette-dot${isAnswered ? ' ec-exam-palette-dot--answered' : ''}${isActive ? ' ec-exam-palette-dot--active' : ''}`}
                onClick={() => setIdx(i)}
                aria-label={`Go to question ${i + 1}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
        <div className="ec-exam-nav">
          <button className="ec-exam-nav-btn" onClick={prev} disabled={idx === 0}>
            <IcoArrowL /> Prev
          </button>
          {idx < total - 1 ? (
            <button className="ec-exam-nav-btn ec-exam-nav-btn--primary" onClick={next}>
              Next <IcoArrowR />
            </button>
          ) : (
            <button className="ec-exam-nav-btn ec-exam-nav-btn--submit" onClick={() => setConfirming(true)}>
              <IcoCheck /> Submit
            </button>
          )}
        </div>
      </div>

      {confirming && (
        <div className="ec-exam-modal" onClick={() => setConfirming(false)}>
          <div className="ec-exam-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="ec-exam-modal-icon"><IcoCheck /></div>
            <h3>Submit your exam?</h3>
            <p>You can review your answers after submitting. This action can’t be undone.</p>
            <div className="ec-exam-modal-stats">
              <div className="ec-exam-modal-stat">
                <strong>{answeredCount}</strong>
                <span>Answered</span>
              </div>
              <div className="ec-exam-modal-stat">
                <strong>{total - answeredCount}</strong>
                <span>Unanswered</span>
              </div>
            </div>
            <div className="ec-exam-modal-actions">
              <button className="ghost" onClick={() => setConfirming(false)}>Keep working</button>
              <button className="primary" onClick={() => { setConfirming(false); setSubmitted(true); }}>
                Submit now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LiveRooms;