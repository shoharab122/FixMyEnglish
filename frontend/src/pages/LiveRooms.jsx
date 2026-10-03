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
const IcoCross = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" {...SVG}>
    <path d="M6 6l12 12M18 6 6 18" />
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
const IcoLight = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...SVG}>
    <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.4 1 1.1 1 1.8V17h6v-.5c0-.7.4-1.4 1-1.8A7 7 0 0 0 12 2Z" />
  </svg>
);
const IcoSpark = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...SVG}>
    <path d="M12 3v6M12 15v6M3 12h6M15 12h6" />
  </svg>
);

/* ============================================================
   Mascot
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
   MAIN STYLES
   ============================================================ */
const LIVE_CSS = `
.ec-live,.ec-class,.ec-exam,.ec-zoom-embed,.ec-connect-overlay,.ec-lobby-hero{
  --lang-bg:#1E1252;--lang-bg-2:#2A1A6E;--lang-bg-3:#3B2596;
  --lang-lime:#D4F55C;--lang-lime-2:#E4FF5C;--lang-lime-soft:#EDFFB0;--lang-lime-deep:#B8E62E;
  --lang-yellow:#F5E04D;--lang-yellow-2:#FFEC7A;
  --lang-purple:#7B5CF0;--lang-purple-2:#9B7BFF;--lang-purple-3:#6B48E8;
  --lang-pink:#FFB3D1;--lang-pink-2:#FF8FCB;--lang-pink-3:#FF69B4;
  --lang-mint:#B8F2D8;--lang-mint-2:#7FD9A9;
  --lang-ink:#17102E;--lang-ink-soft:#6B6488;--lang-line:#17102E;
  --lang-good:#4ADE80;--lang-good-deep:#16A34A;
  --lang-bad:#FCA5A5;--lang-bad-deep:#DC2626;
}
.ec-live,.ec-live *,.ec-lobby-hero,.ec-lobby-hero *,.ec-exam,.ec-exam *{box-sizing:border-box}

/* HERO */
.ec-live-hero{position:relative;overflow:hidden;border-radius:32px;padding:clamp(28px,4vw,42px) clamp(24px,4vw,44px);color:#fff;background:radial-gradient(120% 90% at 85% 15%,rgba(155,123,255,.35),transparent 55%),radial-gradient(90% 70% at 10% 90%,rgba(241,76,160,.22),transparent 55%),linear-gradient(140deg,#2A1A6E 0%,#1E1252 55%,#3B2596 100%);box-shadow:0 22px 58px rgba(30,18,82,.38),inset 0 1px 0 rgba(255,255,255,.06);border:2px solid var(--lang-line);margin-bottom:24px;min-height:240px;display:flex;align-items:center;justify-content:space-between;gap:24px}
.ec-live-hero::before{content:'';position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.11) 1.4px,transparent 1.4px);background-size:22px 22px;mask-image:radial-gradient(circle at 15% 20%,#000,transparent 65%);-webkit-mask-image:radial-gradient(circle at 15% 20%,#000,transparent 65%);pointer-events:none}
.ec-live-hero-orb{position:absolute;top:-100px;right:200px;width:280px;height:280px;border-radius:50%;background:radial-gradient(circle,rgba(212,245,92,.20),transparent 68%);animation:ec-lr-drift 14s ease-in-out infinite;pointer-events:none}
@keyframes ec-lr-drift{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-18px,16px) scale(1.08)}}
.ec-live-hero-copy{position:relative;z-index:1;max-width:600px}
.ec-live-hero-badge{display:inline-flex;align-items:center;gap:8px;font-size:10.5px;font-weight:900;letter-spacing:.16em;text-transform:uppercase;padding:8px 15px;border-radius:999px;background:var(--lang-lime);color:var(--lang-ink);border:2px solid var(--lang-line);box-shadow:0 3px 0 rgba(0,0,0,.5);margin-bottom:18px}
.ec-live-hero-badge .ec-live-dot{background:var(--lang-ink);animation:ec-live-pulse 1.6s ease-out infinite}
.ec-live-hero h1{margin:0 0 12px;font-size:clamp(28px,2.6vw + 16px,42px);font-weight:900;letter-spacing:-.04em;line-height:1.06;color:#fff}
.ec-live-hero h1 em{font-style:normal;background:linear-gradient(180deg,#E4FF5C 0%,#B8E62E 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
.ec-live-hero p{margin:0 0 24px;font-size:14.5px;line-height:1.62;opacity:.9;font-weight:500;max-width:54ch}
.ec-live-hero-chips{display:flex;gap:10px;flex-wrap:wrap;position:relative;z-index:1}
.ec-live-hero-chip{display:flex;flex-direction:column;gap:3px;padding:10px 16px;border-radius:16px;background:var(--lang-lime);color:var(--lang-ink);border:2px solid var(--lang-line);box-shadow:0 4px 0 var(--lang-line);min-width:86px;transition:transform .25s cubic-bezier(.34,1.56,.64,1)}
.ec-live-hero-chip:hover{transform:translateY(-3px)}
.ec-live-hero-chip strong{font-size:22px;font-weight:900;line-height:1;letter-spacing:-.04em;color:var(--lang-ink)}
.ec-live-hero-chip span{font-size:9.5px;font-weight:900;letter-spacing:.11em;text-transform:uppercase;color:var(--lang-ink);opacity:.72}
.ec-live-hero-chip:nth-child(2){background:var(--lang-pink)}
.ec-live-hero-chip:nth-child(3){background:var(--lang-purple-2);color:#fff}
.ec-live-hero-chip:nth-child(3) strong,.ec-live-hero-chip:nth-child(3) span{color:#fff}
.ec-live-hero-mascot{position:relative;z-index:1;flex-shrink:0;display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 16px 30px rgba(0,0,0,.32));animation:ec-lr-bob 4s ease-in-out infinite}
@keyframes ec-lr-bob{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-10px) rotate(2deg)}}
.ec-live-hero-sparkle{position:absolute;width:14px;height:14px;pointer-events:none;animation:ec-lr-sparkle 3s ease-in-out infinite}
.ec-live-hero-sparkle::before{content:'';position:absolute;inset:0;background:currentColor;clip-path:polygon(50% 0,55% 45%,100% 50%,55% 55%,50% 100%,45% 55%,0 50%,45% 45%)}
.ec-live-hero-sparkle--a{top:12%;right:26%;color:var(--lang-lime);animation-delay:0s}
.ec-live-hero-sparkle--b{top:22%;right:14%;color:var(--lang-pink);animation-delay:.6s;width:10px;height:10px}
.ec-live-hero-sparkle--c{bottom:18%;right:24%;color:var(--lang-yellow);animation-delay:1.2s;width:12px;height:12px}
@keyframes ec-lr-sparkle{0%,100%{opacity:1;transform:scale(1) rotate(0deg)}50%{opacity:.35;transform:scale(.75) rotate(30deg)}}

/* TABS */
.ec-live-tabs{display:flex;gap:10px;overflow-x:auto;scrollbar-width:none;padding:4px 4px 18px;margin-bottom:4px}
.ec-live-tabs::-webkit-scrollbar{display:none}
.ec-live-tab{flex:0 0 auto;display:inline-flex;align-items:center;gap:8px;padding:11px 18px;border-radius:999px;border:2px solid var(--lang-line);background:#fff;color:var(--lang-ink);font-size:12.5px;font-weight:900;cursor:pointer;white-space:nowrap;font-family:inherit;transition:transform .22s cubic-bezier(.34,1.56,.64,1),box-shadow .18s ease,background .2s ease,color .2s ease;box-shadow:0 4px 0 var(--lang-line);letter-spacing:.01em}
.ec-live-tab:hover{background:var(--lang-purple-2);color:#fff;transform:translateY(-3px);box-shadow:0 7px 0 var(--lang-line)}
.ec-live-tab:hover .ec-live-tab-count{background:var(--lang-lime);color:var(--lang-ink)}
.ec-live-tab:active{transform:translateY(1px) scale(.98);box-shadow:0 1px 0 var(--lang-line)}
.ec-live-tab--active{background:var(--lang-ink);color:var(--lang-lime);box-shadow:0 4px 0 var(--lang-ink)}
.ec-live-tab--active:hover{background:var(--lang-ink);color:var(--lang-lime)}
.ec-live-tab svg{width:15px;height:15px;transition:transform .3s cubic-bezier(.34,1.56,.64,1)}
.ec-live-tab:hover svg{transform:rotate(-8deg) scale(1.1)}
.ec-live-tab-count{font-size:10px;font-weight:900;padding:2px 8px;border-radius:999px;background:var(--lang-lime);color:var(--lang-ink);border:2px solid var(--lang-line);transition:background .2s ease,color .2s ease}
.ec-live-tab--active .ec-live-tab-count{background:var(--lang-lime);color:var(--lang-ink);border-color:var(--lang-line)}

/* STATS */
.ec-live-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:26px}
.ec-live-stat{position:relative;background:#fff;border:2px solid var(--lang-line);border-radius:22px;padding:20px;display:flex;flex-direction:column;gap:10px;box-shadow:0 5px 0 var(--lang-line);transition:transform .28s cubic-bezier(.34,1.56,.64,1),box-shadow .22s ease;background-image:radial-gradient(circle at 100% 0%,rgba(212,245,92,.10),transparent 55%);overflow:hidden;animation:ec-lr-slide-in .55s cubic-bezier(.22,1,.36,1) both}
.ec-live-stat:nth-child(1){animation-delay:.08s}
.ec-live-stat:nth-child(2){animation-delay:.14s}
.ec-live-stat:nth-child(3){animation-delay:.20s}
.ec-live-stat:nth-child(4){animation-delay:.26s}
.ec-live-stat::after{content:'';position:absolute;top:0;bottom:0;width:40%;background:linear-gradient(90deg,transparent,rgba(212,245,92,.32),transparent);transform:translateX(-120%);animation:ec-lr-shine 3.4s ease-in-out infinite;pointer-events:none}
@keyframes ec-lr-shine{0%{transform:translateX(-120%)}60%{transform:translateX(280%)}100%{transform:translateX(280%)}}
.ec-live-stat:hover{transform:translateY(-4px);box-shadow:0 9px 0 var(--lang-line)}
.ec-live-stat-icon{width:44px;height:44px;border-radius:14px;display:flex;align-items:center;justify-content:center;margin-bottom:4px;border:2px solid var(--lang-line);box-shadow:0 3px 0 var(--lang-line);transition:transform .3s cubic-bezier(.34,1.56,.64,1)}
.ec-live-stat:hover .ec-live-stat-icon{transform:scale(1.08) rotate(-5deg)}
.ec-live-stat-icon--lime{background:linear-gradient(160deg,#E4FF5C,#B8E62E);color:var(--lang-ink)}
.ec-live-stat-icon--yellow{background:linear-gradient(160deg,#FFEC7A,#F5E04D);color:var(--lang-ink)}
.ec-live-stat-icon--purple{background:linear-gradient(160deg,#9B7BFF,#7B5CF0);color:#fff}
.ec-live-stat-icon--pink{background:linear-gradient(160deg,#FFB3D1,#FF8FCB);color:#fff}
.ec-live-stat-value{font-size:26px;font-weight:900;color:var(--lang-ink);line-height:1;letter-spacing:-.04em;font-variant-numeric:tabular-nums}
.ec-live-stat-label{font-size:11.5px;font-weight:800;color:var(--lang-ink-soft);letter-spacing:.04em}

/* ROOMS LIST */
.ec-live-list{display:flex;flex-direction:column;gap:18px}
.ec-live-card{position:relative;background:#fff;border:2px solid var(--lang-line);border-radius:26px;padding:24px;box-shadow:0 6px 0 var(--lang-line);transition:transform .28s cubic-bezier(.34,1.56,.64,1),box-shadow .22s ease;overflow:hidden;background-image:radial-gradient(circle at 100% 0%,rgba(212,245,92,.10),transparent 55%);animation:ec-lr-slide-in .55s cubic-bezier(.22,1,.36,1) both}
@keyframes ec-lr-slide-in{from{opacity:0;transform:translateY(20px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
.ec-live-card::before{content:'';position:absolute;top:0;bottom:0;left:0;width:6px;background:linear-gradient(180deg,#D4F55C,#B8E62E);border-radius:26px 0 0 26px;opacity:0;transition:opacity .3s ease}
.ec-live-card:hover::before{opacity:1}
.ec-live-card:hover{transform:translateY(-4px);box-shadow:0 11px 0 var(--lang-line)}
.ec-live-card-top{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;margin-bottom:16px}
.ec-live-title{margin:0 0 12px;font-size:17.5px;font-weight:900;color:var(--lang-ink);line-height:1.3;letter-spacing:-.02em}
.ec-live-badge{position:relative;display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:900;color:var(--lang-ink);background:var(--lang-yellow);padding:5px 12px;border-radius:999px;border:2px solid var(--lang-line);box-shadow:0 2px 0 var(--lang-line);letter-spacing:.06em;text-transform:uppercase}
.ec-live-badge--soon{background:var(--lang-lime);color:var(--lang-ink)}
.ec-live-badge--live{background:var(--lang-pink-2);color:#fff}
.ec-live-badge--live::after{content:'';position:absolute;inset:-3px;border-radius:999px;border:2px solid var(--lang-pink-2);animation:ec-lr-badge-ring 1.8s ease-out infinite;pointer-events:none}
@keyframes ec-lr-badge-ring{0%{transform:scale(1);opacity:.9}100%{transform:scale(1.25);opacity:0}}
.ec-live-dot{width:8px;height:8px;border-radius:50%;background:var(--lang-ink);animation:ec-live-pulse 1.6s ease-out infinite;flex-shrink:0}
.ec-live-badge--soon .ec-live-dot{background:var(--lang-ink);animation:none;box-shadow:0 0 0 3px rgba(23,16,46,.25)}
.ec-live-badge--live .ec-live-dot{background:#fff;animation:ec-live-pulse-w 1.4s ease-out infinite}
@keyframes ec-live-pulse{0%{box-shadow:0 0 0 0 rgba(23,16,46,.5)}100%{box-shadow:0 0 0 12px rgba(23,16,46,0)}}
@keyframes ec-live-pulse-w{0%{box-shadow:0 0 0 0 rgba(255,255,255,.6)}100%{box-shadow:0 0 0 12px rgba(255,255,255,0)}}
.ec-live-chips{display:flex;gap:8px;flex-wrap:wrap}
.ec-live-chip{display:inline-flex;align-items:center;gap:5px;font-size:10.5px;font-weight:900;letter-spacing:.06em;text-transform:uppercase;padding:4px 11px;border-radius:999px;background:linear-gradient(160deg,#9B7BFF,#7B5CF0);color:#fff;border:2px solid var(--lang-line);box-shadow:0 2px 0 var(--lang-line);transition:transform .2s cubic-bezier(.34,1.56,.64,1)}
.ec-live-chip svg{width:12px;height:12px}
.ec-live-chip:hover{transform:translateY(-2px) scale(1.05)}
.ec-live-chip--zoom{background:linear-gradient(160deg,#4A9FFF,#0B5FFF);color:#fff}
.ec-live-fill-row{display:flex;align-items:center;gap:12px;margin-bottom:16px}
.ec-live-fill-bar{position:relative;flex:1;height:14px;border-radius:999px;background:#E8E5F2;overflow:hidden;border:2px solid var(--lang-line)}
.ec-live-fill{position:relative;height:100%;border-radius:999px;background:linear-gradient(90deg,#D4F55C,#B8E62E);transition:width 1.2s cubic-bezier(.22,1,.36,1)}
.ec-live-fill::after{content:'';position:absolute;top:0;bottom:0;width:30%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.6),transparent);animation:ec-lr-shine 2.4s ease-in-out infinite;pointer-events:none}
.ec-live-fill-pct{font-size:12.5px;font-weight:900;color:var(--lang-ink);white-space:nowrap;font-variant-numeric:tabular-nums;background:var(--lang-lime);border:2px solid var(--lang-line);padding:3px 10px;border-radius:999px;box-shadow:0 2px 0 var(--lang-line)}
.ec-live-card-meta{display:flex;gap:16px;margin-bottom:18px;font-size:12px;color:var(--lang-ink-soft);flex-wrap:wrap;font-weight:800;letter-spacing:.02em}
.ec-live-card-meta span{display:inline-flex;align-items:center;gap:6px}
.ec-live-card-meta svg{width:14px;height:14px;opacity:.85}
.ec-live-sep{height:2px;background:repeating-linear-gradient(90deg,rgba(23,16,46,.13) 0 6px,transparent 6px 12px);margin:0 0 16px;border-radius:999px}

/* BUTTONS */
.ec-live-actions{display:grid;grid-template-columns:1.5fr 1fr 1fr;gap:10px}
.ec-live-btn{position:relative;display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:12px 16px;border-radius:14px;border:2px solid var(--lang-line);font-family:inherit;font-size:12.5px;font-weight:900;cursor:pointer;white-space:nowrap;min-height:46px;transition:transform .22s cubic-bezier(.34,1.56,.64,1),box-shadow .18s ease,filter .2s ease,background .2s ease;letter-spacing:.02em;box-shadow:0 4px 0 var(--lang-line);overflow:hidden;text-decoration:none}
.ec-live-btn::before{content:'';position:absolute;top:0;bottom:0;left:-30%;width:30%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.4),transparent);transform:translateX(0);transition:transform .6s ease;pointer-events:none}
.ec-live-btn:hover:not(:disabled)::before{transform:translateX(400%)}
.ec-live-btn svg{width:16px;height:16px;flex-shrink:0;transition:transform .3s cubic-bezier(.34,1.56,.64,1)}
.ec-live-btn:hover:not(:disabled){transform:translateY(-3px);box-shadow:0 7px 0 var(--lang-line)}
.ec-live-btn:hover:not(:disabled) svg{transform:scale(1.15)}
.ec-live-btn:active:not(:disabled){transform:translateY(2px);box-shadow:0 1px 0 var(--lang-line)}
.ec-live-btn:disabled{opacity:.55;cursor:not-allowed;transform:none;box-shadow:0 4px 0 var(--lang-line)}
.ec-live-btn--primary{background:linear-gradient(160deg,#9B7BFF 0%,#7B5CF0 100%);color:#fff}
.ec-live-btn--primary:hover:not(:disabled){background:linear-gradient(160deg,#8B6BFF 0%,#6B48E8 100%)}
.ec-live-btn--lime{background:linear-gradient(160deg,#E4FF5C 0%,#B8E62E 100%);color:var(--lang-ink)}
.ec-live-btn--lime:hover:not(:disabled){background:linear-gradient(160deg,#D4F55C 0%,#A8D61E 100%)}
.ec-live-btn--pink{background:linear-gradient(160deg,#FFB3D1 0%,#FF8FCB 100%);color:#fff}
.ec-live-btn--zoom{background:linear-gradient(160deg,#4A9FFF 0%,#0B5FFF 100%);color:#fff;box-shadow:0 4px 0 var(--lang-line),0 8px 20px rgba(11,95,255,.24)}
.ec-live-btn--ghost{background:#fff;color:var(--lang-ink)}
.ec-live-btn--ghost:hover:not(:disabled){background:var(--lang-lime-soft)}
.ec-live-btn--dark{background:linear-gradient(160deg,#9B7BFF 0%,#7B5CF0 100%);color:#fff}
.ec-live-btn--yellow{background:linear-gradient(160deg,#FFEC7A 0%,#F5E04D 100%);color:var(--lang-ink)}

/* CONNECTING OVERLAY */
.ec-connect-overlay{position:fixed;inset:0;z-index:10001;background:rgba(15,18,34,.65);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:20px;animation:ec-lr-fade .25s ease both}
@keyframes ec-lr-fade{from{opacity:0}to{opacity:1}}
.ec-connect-card{background:#fff;border:3px solid var(--lang-line);border-radius:28px;padding:38px 32px;max-width:420px;width:100%;text-align:center;box-shadow:0 10px 0 var(--lang-line),0 24px 60px rgba(15,18,34,.35);animation:ec-lr-pop .35s cubic-bezier(.34,1.56,.64,1) both}
@keyframes ec-lr-pop{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}
.ec-connect-spinner{position:relative;width:64px;height:64px;border-radius:50%;margin:0 auto 22px;border:5px solid #E8E5F2;border-top-color:var(--lang-purple);animation:ec-lr-spin .8s linear infinite}
.ec-connect-spinner::after{content:'';position:absolute;inset:-14px;border-radius:50%;border:2px dashed rgba(123,92,240,.35);animation:ec-lr-spin 2.4s linear infinite reverse}
@keyframes ec-lr-spin{to{transform:rotate(360deg)}}
.ec-connect-title{margin:0 0 8px;font-size:20px;font-weight:900;color:var(--lang-ink);letter-spacing:-.02em}
.ec-connect-sub{margin:0;font-size:13.5px;line-height:1.55;color:var(--lang-ink-soft);font-weight:600}
.ec-connect-error{display:flex;align-items:flex-start;gap:10px;margin-top:18px;padding:12px 16px;border-radius:14px;background:linear-gradient(160deg,#FFB3D1,#FF8FCB);color:#fff;font-size:12.5px;font-weight:900;text-align:left;line-height:1.5;border:2px solid var(--lang-line);box-shadow:0 3px 0 var(--lang-line);letter-spacing:.01em}
.ec-connect-error svg{flex-shrink:0;margin-top:1px}

/* ZOOM EMBED */
.ec-zoom-embed{position:fixed;inset:0;z-index:9999;background:#0B0D12;display:flex;flex-direction:column;overflow:hidden}
.ec-zoom-embed-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 16px;background:rgba(0,0,0,.55);border-bottom:1px solid rgba(255,255,255,.08);color:#fff;flex-shrink:0}
.ec-zoom-embed-bar-left{display:flex;align-items:center;gap:10px;min-width:0}
.ec-zoom-embed-bar-title{font-size:13.5px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ec-zoom-embed-bar-sub{font-size:11px;color:rgba(255,255,255,.65);white-space:nowrap}
.ec-zoom-embed-bar-right{display:flex;align-items:center;gap:8px;flex-shrink:0}
.ec-zoom-embed-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:12px;border:1.5px solid rgba(255,255,255,.16);background:rgba(255,255,255,.08);color:#fff;font-family:inherit;font-size:12.5px;font-weight:900;cursor:pointer;transition:background .2s ease,border-color .2s ease,transform .18s cubic-bezier(.34,1.56,.64,1);letter-spacing:.02em}
.ec-zoom-embed-btn:hover{background:rgba(255,255,255,.16);border-color:rgba(255,255,255,.28);transform:translateY(-2px)}
.ec-zoom-embed-btn--danger{background:linear-gradient(160deg,#FFB3D1,#FF69B4);border-color:#FF69B4;color:#fff}
.ec-zoom-embed-container{flex:1;position:relative;background:#0B0D12;min-height:0}
.ec-zoom-embed-container > div{width:100%!important;height:100%!important}
.ec-zoom-embed-fallback{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:32px;text-align:center;color:#fff}
.ec-zoom-embed-fallback-icon{width:72px;height:72px;border-radius:50%;background:linear-gradient(160deg,#FFB3D1,#FF69B4);color:#fff;display:flex;align-items:center;justify-content:center;border:3px solid var(--lang-line);box-shadow:0 4px 0 rgba(0,0,0,.5)}
.ec-zoom-embed-fallback h3{margin:0;font-size:18px;font-weight:900;color:#fff;letter-spacing:-.02em}
.ec-zoom-embed-fallback p{margin:0;font-size:13px;line-height:1.55;color:rgba(255,255,255,.75);max-width:420px;font-weight:600}

/* LOBBY */
.ec-lobby-hero{position:relative;overflow:hidden;border-radius:32px;padding:clamp(28px,4vw,42px) clamp(24px,4vw,44px);color:#fff;background:radial-gradient(120% 90% at 85% 15%,rgba(155,123,255,.35),transparent 55%),radial-gradient(90% 70% at 10% 90%,rgba(241,76,160,.22),transparent 55%),linear-gradient(140deg,#2A1A6E 0%,#1E1252 55%,#3B2596 100%);box-shadow:0 22px 58px rgba(30,18,82,.38),inset 0 1px 0 rgba(255,255,255,.06);border:2px solid var(--lang-line);margin-bottom:24px;min-height:210px;animation:ec-lr-slide-in .55s cubic-bezier(.22,1,.36,1) both}
.ec-lobby-hero::before{content:'';position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.11) 1.4px,transparent 1.4px);background-size:22px 22px;mask-image:radial-gradient(circle at 15% 20%,#000,transparent 65%);-webkit-mask-image:radial-gradient(circle at 15% 20%,#000,transparent 65%);pointer-events:none}
.ec-lobby-hero-copy{position:relative;z-index:1}
.ec-lobby-hero h1{margin:0 0 10px;font-size:clamp(24px,2.2vw + 14px,34px);font-weight:900;color:#fff;letter-spacing:-.035em;line-height:1.15}
.ec-lobby-hero p{margin:0;font-size:14.5px;line-height:1.62;opacity:.9;max-width:540px;font-weight:500}
.ec-lobby-hero-badge{display:inline-flex;align-items:center;gap:8px;font-size:10.5px;font-weight:900;letter-spacing:.16em;text-transform:uppercase;padding:8px 15px;border-radius:999px;background:var(--lang-lime);color:var(--lang-ink);border:2px solid var(--lang-line);box-shadow:0 3px 0 rgba(0,0,0,.5);margin-bottom:16px}
.ec-lobby-hero-badge .ec-live-dot{background:var(--lang-ink);animation:ec-live-pulse 1.6s ease-out infinite}
.ec-lobby-hero-stats{display:flex;gap:10px;margin-top:22px;flex-wrap:wrap;position:relative;z-index:1}
.ec-lobby-hero-stat{display:flex;flex-direction:column;gap:3px;padding:10px 16px;border-radius:16px;background:linear-gradient(160deg,#E4FF5C,#B8E62E);color:var(--lang-ink);border:2px solid var(--lang-line);box-shadow:0 4px 0 var(--lang-line);min-width:90px;animation:ec-lr-pop .4s cubic-bezier(.34,1.56,.64,1) both}
.ec-lobby-hero-stat:nth-child(1){animation-delay:.15s}
.ec-lobby-hero-stat:nth-child(2){animation-delay:.25s}
.ec-lobby-hero-stat:nth-child(3){animation-delay:.35s}
.ec-lobby-hero-stat strong{font-size:22px;font-weight:900;line-height:1;letter-spacing:-.04em}
.ec-lobby-hero-stat span{font-size:9.5px;text-transform:uppercase;letter-spacing:.11em;font-weight:900;opacity:.72}
.ec-lobby-hero-stat:nth-child(2){background:linear-gradient(160deg,#FFB3D1,#FF8FCB)}
.ec-lobby-hero-stat:nth-child(3){background:linear-gradient(160deg,#9B7BFF,#7B5CF0);color:#fff}
.ec-lobby-hero-stat:nth-child(3) strong,.ec-lobby-hero-stat:nth-child(3) span{color:#fff}
.ec-lobby-grid{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:22px;align-items:start}
.ec-lobby-card{background:#fff;border:2px solid var(--lang-line);border-radius:24px;padding:24px;box-shadow:0 5px 0 var(--lang-line);margin-bottom:18px;background-image:radial-gradient(circle at 100% 0%,rgba(212,245,92,.08),transparent 55%);animation:ec-lr-slide-in .55s cubic-bezier(.22,1,.36,1) both}
.ec-lobby-card h3{margin:0 0 16px;font-size:15px;font-weight:900;color:var(--lang-ink);display:flex;align-items:center;justify-content:space-between;gap:8px;letter-spacing:-.01em}
.ec-lobby-card h3 span{font-size:10.5px;color:var(--lang-ink);background:var(--lang-lime);padding:4px 11px;border-radius:999px;font-weight:900;text-transform:uppercase;letter-spacing:.06em;border:2px solid var(--lang-line);box-shadow:0 2px 0 var(--lang-line)}
.ec-guest-form{display:flex;flex-direction:column;gap:12px}
.ec-guest-input{width:100%;padding:12px 16px;border:2px solid var(--lang-line);border-radius:14px;font-size:14px;font-weight:700;background:#fff;color:var(--lang-ink);outline:none;font-family:inherit;transition:box-shadow .18s ease, transform .18s ease;box-shadow:0 3px 0 var(--lang-line)}
.ec-guest-input:focus{box-shadow:0 3px 0 var(--lang-line),0 0 0 4px rgba(212,245,92,.5);transform:translateY(-1px)}
.ec-guest-input::placeholder{color:var(--lang-ink-soft);font-weight:500}
.ec-guest-btn{border:2px solid var(--lang-line);background:linear-gradient(160deg,#9B7BFF 0%,#7B5CF0 100%);color:#fff;padding:13px 20px;border-radius:14px;font-size:13.5px;font-weight:900;cursor:pointer;font-family:inherit;transition:transform .22s cubic-bezier(.34,1.56,.64,1),box-shadow .18s ease;box-shadow:0 4px 0 var(--lang-line);letter-spacing:.03em}
.ec-guest-btn:hover:not(:disabled){background:linear-gradient(160deg,#8B6BFF 0%,#6B48E8 100%);transform:translateY(-3px);box-shadow:0 7px 0 var(--lang-line)}
.ec-guest-btn:disabled{opacity:.5;cursor:not-allowed;transform:none}
.ec-lb-row{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:2px dashed rgba(23,16,46,.1);transition:transform .2s ease;animation:ec-lr-slide-in .45s ease both}
.ec-lb-row:last-child{border-bottom:none;padding-bottom:0}
.ec-lb-row:hover{transform:translateX(4px)}
.ec-lb-rank{width:30px;height:30px;border-radius:50%;background:#fff;color:var(--lang-ink);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:12px;flex-shrink:0;border:2px solid var(--lang-line);box-shadow:0 2px 0 var(--lang-line)}
.ec-lb-row:nth-child(1) .ec-lb-rank{background:linear-gradient(160deg,#FFEC7A,#F5E04D);animation:ec-lr-trophy-spin 4s ease-in-out infinite}
@keyframes ec-lr-trophy-spin{0%,100%{transform:rotate(-8deg) scale(1)}50%{transform:rotate(8deg) scale(1.1)}}
.ec-lb-row:nth-child(2) .ec-lb-rank{background:#E8E5F2;color:var(--lang-ink)}
.ec-lb-row:nth-child(3) .ec-lb-rank{background:linear-gradient(160deg,#FFB3D1,#FF8FCB);color:var(--lang-ink)}
.ec-lb-avatar{width:34px;height:34px;border-radius:12px;background:linear-gradient(160deg,#9B7BFF,#7B5CF0);color:#fff;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:900;border:2px solid var(--lang-line);box-shadow:0 2px 0 var(--lang-line)}
.ec-lb-name{flex:1;font-size:13px;font-weight:900;color:var(--lang-ink);min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;letter-spacing:-.01em}
.ec-lb-xp{font-size:12px;font-weight:900;color:var(--lang-ink);background:linear-gradient(160deg,#E4FF5C,#B8E62E);padding:3px 10px;border-radius:999px;border:2px solid var(--lang-line);box-shadow:0 2px 0 var(--lang-line);font-variant-numeric:tabular-nums}
.ec-lb-row--me{background:var(--lang-lime-soft);border-radius:12px;padding:12px 10px;margin:0 -10px;border-bottom:2px solid transparent}

/* LIVE CLASS */
.ec-class{position:fixed;inset:0;z-index:9999;background:#0B0D12;color:#fff;display:flex;flex-direction:column;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;overflow:hidden;animation:ec-lr-class-in .35s cubic-bezier(.22,1,.36,1) both}
@keyframes ec-lr-class-in{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}
.ec-class-top{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 16px;background:linear-gradient(180deg,rgba(0,0,0,.5),transparent);position:absolute;top:0;left:0;right:0;z-index:5;transition:opacity .3s ease,transform .3s ease}
.ec-class-info{display:flex;align-items:center;gap:10px;min-width:0}
.ec-class-rec{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:900;color:#fff;background:linear-gradient(160deg,#FFB3D1,#FF69B4);padding:4px 10px;border-radius:999px;border:2px solid var(--lang-line);box-shadow:0 2px 0 rgba(0,0,0,.4);letter-spacing:.08em;text-transform:uppercase}
.ec-class-rec-dot{width:6px;height:6px;border-radius:50%;background:#fff;animation:ec-class-rec-pulse 1.2s ease-in-out infinite}
@keyframes ec-class-rec-pulse{0%,100%{opacity:1}50%{opacity:.3}}
.ec-class-title{font-size:13.5px;font-weight:800;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ec-class-timer{font-size:12.5px;font-weight:800;color:rgba(255,255,255,.75);font-variant-numeric:tabular-nums;display:inline-flex;align-items:center;gap:5px}
.ec-class-top-right{display:flex;align-items:center;gap:8px}
.ec-class-icon-btn{width:36px;height:36px;border-radius:12px;border:none;background:rgba(255,255,255,.12);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background .2s ease,transform .2s cubic-bezier(.34,1.56,.64,1)}
.ec-class-icon-btn:hover{background:rgba(255,255,255,.22);transform:scale(1.08)}
.ec-class-stage{flex:1;padding:64px 12px 110px;overflow:hidden;display:flex;align-items:center;justify-content:center}
.ec-class-grid{width:100%;height:100%;display:grid;gap:10px;max-width:1400px;margin:0 auto}
.ec-class-grid[data-count="1"]{grid-template-columns:1fr}
.ec-class-grid[data-count="2"]{grid-template-columns:1fr 1fr}
.ec-class-grid[data-count="3"]{grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr}
.ec-class-grid[data-count="3"] > *:first-child{grid-column:1 / -1}
.ec-class-grid[data-count="4"]{grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr}
.ec-class-grid[data-count="5"],.ec-class-grid[data-count="6"]{grid-template-columns:repeat(3,1fr);grid-template-rows:1fr 1fr}
.ec-class-tile{position:relative;border-radius:18px;overflow:hidden;background:linear-gradient(135deg,#1a1d2e 0%,#0f121c 100%);border:2px solid rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;min-height:0;transition:border-color .3s ease,box-shadow .3s ease, transform .3s cubic-bezier(.34,1.56,.64,1);animation:ec-lr-slide-in .5s ease both}
.ec-class-tile--speaking{border-color:var(--lang-lime);box-shadow:0 0 0 2px rgba(212,245,92,.35),0 0 32px rgba(212,245,92,.35);animation:ec-lr-speaking-pulse 2s ease-in-out infinite}
@keyframes ec-lr-speaking-pulse{0%,100%{box-shadow:0 0 0 2px rgba(212,245,92,.35),0 0 32px rgba(212,245,92,.35)}50%{box-shadow:0 0 0 4px rgba(212,245,92,.5),0 0 40px rgba(212,245,92,.5)}}
.ec-class-avatar{width:70px;height:70px;border-radius:50%;background:linear-gradient(135deg,#9B7BFF 0%,#7B5CF0 100%);display:flex;align-items:center;justify-content:center;color:#fff;font-size:26px;font-weight:900;border:2px solid var(--lang-line);box-shadow:0 4px 0 rgba(0,0,0,.5);transition:transform .35s cubic-bezier(.34,1.56,.64,1)}
.ec-class-tile--speaking .ec-class-avatar{background:linear-gradient(135deg,#E4FF5C 0%,#B8E62E 100%);color:var(--lang-ink);box-shadow:0 0 0 4px rgba(212,245,92,.3),0 4px 0 rgba(0,0,0,.5);animation:ec-lr-avatar-bounce 1.6s ease-in-out infinite}
@keyframes ec-lr-avatar-bounce{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
.ec-class-tile-label{position:absolute;left:10px;bottom:10px;display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:999px;background:rgba(0,0,0,.6);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border:1.5px solid rgba(255,255,255,.14);font-size:11.5px;font-weight:800;color:#fff}
.ec-class-tile-mic{display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;border-radius:50%}
.ec-class-tile-mic--on{color:var(--lang-lime);animation:ec-lr-mic-on 1.8s ease-in-out infinite}
.ec-class-tile-mic--off{color:var(--lang-pink-2)}
@keyframes ec-lr-mic-on{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}
.ec-class-tile-mic svg{width:13px;height:13px}
.ec-class-self{position:absolute;right:16px;bottom:120px;z-index:4;width:200px;aspect-ratio:16/10;border-radius:16px;background:linear-gradient(135deg,#1a1d2e,#0f121c);border:2px solid rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center;box-shadow:0 12px 32px rgba(0,0,0,.55);overflow:hidden;transition:transform .3s cubic-bezier(.34,1.56,.64,1)}
.ec-class-self--off{opacity:.85}
.ec-class-self .ec-class-avatar{width:42px;height:42px;font-size:16px}
.ec-class-self .ec-class-tile-label{bottom:8px;left:8px;font-size:10.5px;padding:3px 8px}
.ec-class-bottom{position:absolute;left:0;right:0;bottom:0;z-index:5;padding:14px 16px calc(14px + env(safe-area-inset-bottom, 0px));background:linear-gradient(0deg,rgba(0,0,0,.65),transparent);display:flex;align-items:center;justify-content:center;gap:10px;transition:opacity .3s ease,transform .3s ease}
.ec-class-ctrl{width:52px;height:52px;border-radius:50%;border:none;background:rgba(255,255,255,.12);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background .2s ease,transform .22s cubic-bezier(.34,1.56,.64,1),color .2s ease;flex-shrink:0}
.ec-class-ctrl:hover{background:rgba(255,255,255,.22);transform:scale(1.08)}
.ec-class-ctrl--off{background:linear-gradient(160deg,#FFB3D1,#FF69B4);color:#fff}
.ec-class-ctrl--end{background:linear-gradient(160deg,#FFB3D1,#FF69B4);color:#fff;width:auto;padding:0 26px;border-radius:999px;gap:8px;font-size:13px;font-weight:900}
.ec-class-ctrl svg{width:20px;height:20px}
.ec-class-ctrl-label{display:none}
.ec-class--idle .ec-class-top{opacity:0;transform:translateY(-8px);pointer-events:none}
.ec-class--idle .ec-class-bottom{opacity:0;transform:translateY(8px);pointer-events:none}
.ec-class--idle{cursor:none}
.ec-class-chat{position:absolute;right:0;top:0;bottom:0;width:340px;z-index:6;background:#0F1222;border-left:1px solid rgba(255,255,255,.08);display:flex;flex-direction:column;animation:ec-lr-chat-in .3s cubic-bezier(.22,1,.36,1) both}
@keyframes ec-lr-chat-in{from{transform:translateX(100%)}to{transform:translateX(0)}}
.ec-class-chat-head{display:flex;align-items:center;justify-content:space-between;padding:16px 18px;border-bottom:1px solid rgba(255,255,255,.08);flex-shrink:0}
.ec-class-chat-head h3{margin:0;font-size:14px;font-weight:900;color:#fff}
.ec-class-chat-body{flex:1;overflow-y:auto;padding:16px 18px;display:flex;flex-direction:column;gap:12px}
.ec-class-chat-msg{display:flex;gap:10px;align-items:flex-start;animation:ec-lr-slide-in .4s ease both}
.ec-class-chat-avatar{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#9B7BFF,#7B5CF0);display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;font-weight:900;flex-shrink:0}
.ec-class-chat-body .ec-class-chat-msg:nth-child(2n) .ec-class-chat-avatar{background:linear-gradient(135deg,#FFB3D1,#FF8FCB);color:var(--lang-ink)}
.ec-class-chat-body .ec-class-chat-msg:nth-child(3n) .ec-class-chat-avatar{background:linear-gradient(135deg,#F5E04D,#B8E62E);color:var(--lang-ink)}
.ec-class-chat-content{flex:1;min-width:0}
.ec-class-chat-name{font-size:12px;font-weight:800;color:#fff;margin:0 0 3px;display:flex;align-items:center;gap:6px}
.ec-class-chat-name small{font-size:10.5px;font-weight:600;color:rgba(255,255,255,.45)}
.ec-class-chat-text{margin:0;font-size:13px;line-height:1.5;color:rgba(255,255,255,.85);word-wrap:break-word}
.ec-class-chat-text--me{color:var(--lang-lime)}
.ec-class-chat-input-wrap{padding:12px 14px;border-top:1px solid rgba(255,255,255,.08);display:flex;gap:8px;flex-shrink:0}
.ec-class-chat-input{flex:1;background:rgba(255,255,255,.08);border:1.5px solid transparent;border-radius:12px;padding:10px 14px;color:#fff;font-family:inherit;font-size:13.5px;outline:none;transition:border-color .2s ease,background .2s ease;min-width:0}
.ec-class-chat-input:focus{border-color:var(--lang-lime);background:rgba(255,255,255,.12)}
.ec-class-chat-input::placeholder{color:rgba(255,255,255,.4)}
.ec-class-chat-send{border:none;background:linear-gradient(160deg,#E4FF5C,#B8E62E);color:var(--lang-ink);width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;border:2px solid var(--lang-line);box-shadow:0 2px 0 var(--lang-line)}

/* ============================================================
   EXAM — mobile-first, instant feedback
   ============================================================ */
.ec-exam{
  position:fixed;inset:0;z-index:9999;
  background:#F8F9FC;
  color:var(--lang-ink);
  display:flex;flex-direction:column;overflow:hidden;
  height:100vh;height:100dvh;
  animation:ec-lr-class-in .35s cubic-bezier(.22,1,.36,1) both;
}

/* Header */
.ec-exam-head{
  display:flex;align-items:center;justify-content:space-between;
  gap:12px;padding:14px 20px;
  padding-top:calc(14px + env(safe-area-inset-top, 0px));
  background:#fff;
  border-bottom:2px solid var(--lang-line);
  flex-shrink:0;
  position:relative;
  z-index:10;
}
.ec-exam-head-left{display:flex;align-items:center;gap:12px;min-width:0}
.ec-exam-title{
  font-size:14.5px;font-weight:900;color:var(--lang-ink);
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  letter-spacing:-.01em;
}
.ec-exam-set{
  display:inline-flex;align-items:center;gap:6px;
  font-size:10.5px;font-weight:900;
  letter-spacing:.08em;text-transform:uppercase;
  padding:5px 11px;border-radius:999px;
  background:var(--lang-purple-2);color:#fff;
  border:2px solid var(--lang-line);
  box-shadow:0 2px 0 var(--lang-line);
  white-space:nowrap;
  flex-shrink:0;
}
.ec-exam-head-right{display:flex;align-items:center;gap:10px;flex-shrink:0}
.ec-exam-timer{
  display:inline-flex;align-items:center;gap:7px;
  padding:8px 16px;border-radius:999px;
  background:linear-gradient(160deg,#E4FF5C,#B8E62E);color:var(--lang-ink);
  font-size:13px;font-weight:900;
  border:2px solid var(--lang-line);
  box-shadow:0 3px 0 var(--lang-line);
  font-variant-numeric:tabular-nums;
  letter-spacing:.02em;
  transition:background .3s ease,color .3s ease;
}
.ec-exam-timer--warn{background:linear-gradient(160deg,#FFEC7A,#F5E04D);color:var(--lang-ink)}
.ec-exam-timer--danger{
  background:linear-gradient(160deg,#FFB3D1,#FF69B4);color:#fff;
  animation:ec-exam-warn 1.5s ease-in-out infinite;
}
@keyframes ec-exam-warn{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.7;transform:scale(1.03)}}

/* Body */
.ec-exam-body{
  flex:1;overflow-y:auto;
  padding:26px 20px 160px;
  display:flex;justify-content:center;
  -webkit-overflow-scrolling:touch;
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

/* Question card */
.ec-exam-q{
  background:#fff;
  border:3px solid var(--lang-line);
  border-radius:26px;
  padding:26px;
  box-shadow:0 8px 0 var(--lang-line);
  animation:ec-lr-q-in .5s cubic-bezier(.34,1.56,.64,1) both;
  background-image:radial-gradient(circle at 100% 0%,rgba(212,245,92,.14),transparent 55%);
  position:relative;
}
@keyframes ec-lr-q-in{
  from{opacity:0;transform:translateY(12px) scale(.98)}
  to{opacity:1;transform:translateY(0) scale(1)}
}
.ec-exam-q-num{
  font-size:11px;font-weight:900;letter-spacing:.1em;
  text-transform:uppercase;
  color:var(--lang-ink);
  background:linear-gradient(160deg,#E4FF5C,#B8E62E);
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

/* Options */
.ec-exam-options{display:flex;flex-direction:column;gap:12px}
.ec-exam-option{
  position:relative;
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
             background .2s ease,
             border-color .2s ease;
  box-shadow:0 4px 0 var(--lang-line);
  animation:ec-lr-slide-in .4s ease both;
  min-height:56px;
  overflow:hidden;
}
.ec-exam-option:nth-child(1){animation-delay:.08s}
.ec-exam-option:nth-child(2){animation-delay:.14s}
.ec-exam-option:nth-child(3){animation-delay:.20s}
.ec-exam-option:nth-child(4){animation-delay:.26s}
.ec-exam-option:hover:not(:disabled){
  background:var(--lang-lime-soft);
  transform:translateY(-3px) translateX(4px);
  box-shadow:0 7px 0 var(--lang-line);
}
.ec-exam-option:active:not(:disabled){
  transform:translateY(2px);
  box-shadow:0 1px 0 var(--lang-line);
}
.ec-exam-option:disabled{cursor:default}

/* Selected (before reveal) */
.ec-exam-option--selected{
  background:linear-gradient(160deg,#E4FF5C,#B8E62E);
  color:var(--lang-ink);
  font-weight:900;
}
.ec-exam-option--selected .ec-exam-option-letter{
  background:var(--lang-ink);
  color:var(--lang-lime);
}

/* Correct reveal */
.ec-exam-option--correct{
  background:linear-gradient(160deg,#BBF7D0 0%,#86EFAC 100%);
  color:#052E16;
  border-color:var(--lang-good-deep);
  box-shadow:0 4px 0 var(--lang-good-deep);
  font-weight:900;
  animation:ec-exam-correct-pop .5s cubic-bezier(.34,1.56,.64,1);
}
@keyframes ec-exam-correct-pop{
  0%{transform:scale(1)}
  40%{transform:scale(1.03)}
  100%{transform:scale(1)}
}
.ec-exam-option--correct .ec-exam-option-letter{
  background:var(--lang-good-deep);
  color:#fff;
  border-color:var(--lang-good-deep);
}
.ec-exam-option--correct::after{
  content:'';
  position:absolute;top:0;bottom:0;left:-30%;width:30%;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.7),transparent);
  animation:ec-lr-shine 1.2s ease-in-out 1;
  pointer-events:none;
}

/* Wrong reveal */
.ec-exam-option--wrong{
  background:linear-gradient(160deg,#FECACA 0%,#FCA5A5 100%);
  color:#450A0A;
  border-color:var(--lang-bad-deep);
  box-shadow:0 4px 0 var(--lang-bad-deep);
  font-weight:900;
  animation:ec-exam-wrong-shake .5s cubic-bezier(.36,.07,.19,.97);
}
@keyframes ec-exam-wrong-shake{
  10%,90%{transform:translateX(-2px)}
  20%,80%{transform:translateX(4px)}
  30%,50%,70%{transform:translateX(-6px)}
  40%,60%{transform:translateX(6px)}
}
.ec-exam-option--wrong .ec-exam-option-letter{
  background:var(--lang-bad-deep);
  color:#fff;
  border-color:var(--lang-bad-deep);
}

/* Faded state for other options after reveal */
.ec-exam-option--faded{
  opacity:.45;
  filter:grayscale(.4);
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
.ec-exam-option:hover:not(:disabled) .ec-exam-option-letter{transform:rotate(-8deg) scale(1.08)}

/* Feedback pill + explanation */
.ec-exam-feedback{
  margin-top:20px;
  padding:16px 18px;
  border-radius:16px;
  border:2px solid var(--lang-line);
  box-shadow:0 4px 0 var(--lang-line);
  display:flex;
  gap:12px;
  align-items:flex-start;
  animation:ec-lr-pop .4s cubic-bezier(.34,1.56,.64,1) both;
  background:#fff;
}
.ec-exam-feedback--correct{
  background:linear-gradient(160deg,#ECFDF5,#D1FAE5);
  border-color:var(--lang-good-deep);
  box-shadow:0 4px 0 var(--lang-good-deep);
}
.ec-exam-feedback--wrong{
  background:linear-gradient(160deg,#FEF2F2,#FEE2E2);
  border-color:var(--lang-bad-deep);
  box-shadow:0 4px 0 var(--lang-bad-deep);
}
.ec-exam-feedback-icon{
  width:36px;height:36px;border-radius:12px;
  display:flex;align-items:center;justify-content:center;
  flex-shrink:0;
  border:2px solid var(--lang-line);
  color:#fff;
}
.ec-exam-feedback--correct .ec-exam-feedback-icon{
  background:linear-gradient(160deg,#4ADE80,#16A34A);
  border-color:var(--lang-good-deep);
}
.ec-exam-feedback--wrong .ec-exam-feedback-icon{
  background:linear-gradient(160deg,#F87171,#DC2626);
  border-color:var(--lang-bad-deep);
}
.ec-exam-feedback-body{flex:1;min-width:0}
.ec-exam-feedback-title{
  margin:0 0 6px;
  font-size:15px;font-weight:900;
  color:var(--lang-ink);
  letter-spacing:-.01em;
  display:flex;align-items:center;gap:8px;
  flex-wrap:wrap;
}
.ec-exam-feedback-answer{
  font-size:13.5px;font-weight:800;
  color:var(--lang-ink);
  margin:0 0 6px;
  line-height:1.5;
}
.ec-exam-feedback-answer strong{
  background:rgba(22,163,74,.15);
  padding:2px 8px;border-radius:6px;
  color:var(--lang-good-deep);
  font-weight:900;
}
.ec-exam-feedback--wrong .ec-exam-feedback-answer strong{
  background:rgba(220,38,38,.12);
  color:var(--lang-bad-deep);
}
.ec-exam-feedback-explain{
  margin:0;
  font-size:13px;line-height:1.55;
  color:var(--lang-ink-soft);
  font-weight:600;
}
.ec-exam-feedback-tip{
  display:inline-flex;align-items:center;gap:6px;
  margin-top:10px;
  font-size:11.5px;font-weight:900;
  letter-spacing:.05em;text-transform:uppercase;
  color:var(--lang-ink-soft);
}

/* Footer */
.ec-exam-footer{
  position:fixed;left:0;right:0;bottom:0;
  padding:14px 20px;
  padding-bottom:calc(14px + env(safe-area-inset-bottom, 0px));
  background:#fff;
  border-top:2px solid var(--lang-line);
  display:flex;align-items:center;justify-content:space-between;gap:12px;
  z-index:20;
  box-shadow:0 -6px 24px rgba(15,18,34,.08);
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
  min-height:52px;
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
.ec-exam-nav-btn--primary{
  background:linear-gradient(160deg,#9B7BFF,#7B5CF0);
  color:#fff;
}
.ec-exam-nav-btn--primary:hover:not(:disabled){
  background:linear-gradient(160deg,#8B6BFF,#6B48E8);
  color:#fff;
}
.ec-exam-nav-btn--submit{
  background:linear-gradient(160deg,#E4FF5C,#B8E62E);
  color:var(--lang-ink);
}
.ec-exam-nav-btn--submit:hover:not(:disabled){
  background:linear-gradient(160deg,#D4F55C,#A8D61E);
  color:var(--lang-ink);
}
.ec-exam-nav-btn--next-set{
  background:linear-gradient(160deg,#E4FF5C,#B8E62E);
  color:var(--lang-ink);
  animation:ec-exam-next-pulse 1.6s ease-in-out infinite;
}
@keyframes ec-exam-next-pulse{
  0%,100%{box-shadow:0 4px 0 var(--lang-line)}
  50%{box-shadow:0 4px 0 var(--lang-line),0 0 0 8px rgba(212,245,92,.35)}
}

/* Palette */
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
  position:relative;
}
.ec-exam-palette-dot:hover{
  background:var(--lang-lime-soft);
  transform:translateY(-3px);
  box-shadow:0 4px 0 var(--lang-line);
}
.ec-exam-palette-dot--answered{background:linear-gradient(160deg,#E4FF5C,#B8E62E);color:var(--lang-ink)}
.ec-exam-palette-dot--correct{
  background:linear-gradient(160deg,#4ADE80,#16A34A);
  color:#fff;
  border-color:var(--lang-good-deep);
  box-shadow:0 2px 0 var(--lang-good-deep);
}
.ec-exam-palette-dot--wrong{
  background:linear-gradient(160deg,#F87171,#DC2626);
  color:#fff;
  border-color:var(--lang-bad-deep);
  box-shadow:0 2px 0 var(--lang-bad-deep);
}
.ec-exam-palette-dot--active{
  background:var(--lang-ink);
  color:var(--lang-lime);
  transform:translateY(-3px);
  box-shadow:0 4px 0 var(--lang-line);
}

/* Modal */
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
  background:linear-gradient(160deg,#E4FF5C,#B8E62E);color:var(--lang-ink);
  display:flex;align-items:center;justify-content:center;
  margin:0 auto 18px;
  border:2px solid var(--lang-line);
  box-shadow:0 4px 0 var(--lang-line);
  animation:ec-lr-avatar-bounce 1.6s ease-in-out infinite;
}
.ec-exam-modal-icon svg{width:32px;height:32px}
.ec-exam-modal h3{margin:0 0 10px;font-size:20px;font-weight:900;color:var(--lang-ink);letter-spacing:-.02em}
.ec-exam-modal p{margin:0 0 22px;font-size:13.5px;line-height:1.55;color:var(--lang-ink-soft);font-weight:700}
.ec-exam-modal-stats{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-bottom:24px}
.ec-exam-modal-stat{background:#fff;border:2px solid var(--lang-line);border-radius:16px;padding:14px;text-align:center;box-shadow:0 3px 0 var(--lang-line)}
.ec-exam-modal-stat strong{display:block;font-size:24px;font-weight:900;color:var(--lang-ink);line-height:1;margin-bottom:6px;letter-spacing:-.03em}
.ec-exam-modal-stat span{font-size:10.5px;font-weight:900;color:var(--lang-ink-soft);text-transform:uppercase;letter-spacing:.08em}
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
.ec-exam-modal-actions .ghost:hover{background:var(--lang-pink);color:#fff;transform:translateY(-3px);box-shadow:0 7px 0 var(--lang-line)}
.ec-exam-modal-actions .primary{background:linear-gradient(160deg,#E4FF5C,#B8E62E);color:var(--lang-ink)}
.ec-exam-modal-actions .primary:hover{background:linear-gradient(160deg,#D4F55C,#A8D61E);transform:translateY(-3px);box-shadow:0 7px 0 var(--lang-line)}

/* Result */
.ec-exam-result{position:fixed;inset:0;z-index:9999;background:#F8F9FC;display:flex;align-items:center;justify-content:center;padding:20px;animation:ec-lr-fade .3s ease both;overflow-y:auto}
.ec-exam-result-card{
  background:#fff;border:3px solid var(--lang-line);border-radius:28px;
  padding:42px 30px;max-width:480px;width:100%;text-align:center;
  box-shadow:0 12px 0 var(--lang-line),0 24px 60px rgba(15,18,34,.14);
  background-image:radial-gradient(circle at 100% 0%,rgba(212,245,92,.14),transparent 55%);
  animation:ec-lr-pop .5s cubic-bezier(.34,1.56,.64,1) both;
  margin:auto;
}
.ec-exam-result-emoji{font-size:64px;margin-bottom:16px;display:block;line-height:1;animation:ec-lr-avatar-bounce 1.8s ease-in-out infinite}
.ec-exam-result-card h2{margin:0 0 10px;font-size:26px;font-weight:900;color:var(--lang-ink);letter-spacing:-.03em}
.ec-exam-result-card p{margin:0 0 24px;font-size:14px;line-height:1.55;color:var(--lang-ink-soft);font-weight:700}
.ec-exam-result-score{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:26px}
.ec-exam-result-score div{background:#fff;border:2px solid var(--lang-line);border-radius:16px;padding:16px;box-shadow:0 3px 0 var(--lang-line);animation:ec-lr-pop .5s cubic-bezier(.34,1.56,.64,1) both}
.ec-exam-result-score div:nth-child(1){animation-delay:.15s;background:linear-gradient(160deg,#E4FF5C,#B8E62E)}
.ec-exam-result-score div:nth-child(2){animation-delay:.25s;background:linear-gradient(160deg,#FFB3D1,#FF8FCB)}
.ec-exam-result-score div:nth-child(3){animation-delay:.35s;background:linear-gradient(160deg,#9B7BFF,#7B5CF0);color:#fff}
.ec-exam-result-score div:nth-child(3) strong{color:#fff}
.ec-exam-result-score div:nth-child(3) span{color:rgba(255,255,255,.75)}
.ec-exam-result-score strong{display:block;font-size:24px;font-weight:900;color:var(--lang-ink);line-height:1;margin-bottom:6px;letter-spacing:-.03em}
.ec-exam-result-score span{font-size:10.5px;font-weight:900;color:var(--lang-ink-soft);text-transform:uppercase;letter-spacing:.08em}

/* Animations */
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
  .ec-live-hero-mascot{position:absolute;right:14px;bottom:14px;transform:scale(.72);transform-origin:bottom right;animation:none}
}

@media (max-width:720px){
  .ec-live-stats{grid-template-columns:1fr 1fr;gap:12px;margin-bottom:22px}
  .ec-live-stat{padding:16px;border-radius:18px}
  .ec-live-stat-value{font-size:22px}
  .ec-live-card{padding:18px;border-radius:22px;box-shadow:0 5px 0 var(--lang-line)}
  .ec-live-card:hover{transform:none;box-shadow:0 5px 0 var(--lang-line)}
  .ec-live-title{font-size:15.5px}
  .ec-live-card-meta{gap:12px;font-size:11.5px}
  .ec-live-actions{display:flex;overflow-x:auto;scrollbar-width:none;gap:10px;margin:0 -4px;padding:0 4px}
  .ec-live-actions::-webkit-scrollbar{display:none}
  .ec-live-btn{flex:0 0 auto;min-width:150px}
  .ec-live-btn--primary,.ec-live-btn--zoom{min-width:180px}
  .ec-live-hero{padding:24px 22px;border-radius:26px}
  .ec-live-hero h1{font-size:24px}
  .ec-live-hero p{font-size:13.5px}
  .ec-live-hero-chips{gap:8px;margin-top:16px}
  .ec-live-hero-chip{padding:8px 12px;min-width:76px;border-radius:12px}
  .ec-live-hero-chip strong{font-size:18px}
  .ec-live-hero-chip span{font-size:9px}
  .ec-live-hero-mascot{display:none}
  .ec-lobby-hero{padding:24px 22px;border-radius:26px}
  .ec-lobby-hero h1{font-size:22px}
  .ec-lobby-hero p{font-size:13.5px}
  .ec-lobby-hero-stats{gap:8px;margin-top:16px}
  .ec-lobby-hero-stat{padding:8px 12px;min-width:76px;border-radius:12px}
  .ec-lobby-hero-stat strong{font-size:18px}
  .ec-lobby-hero-stat span{font-size:9px}
  .ec-lobby-card{padding:18px;border-radius:20px}

  /* ── LIVE CLASS MOBILE ── */
  .ec-class-stage{padding:56px 8px 100px}
  .ec-class-grid{gap:8px}
  .ec-class-grid[data-count="2"],.ec-class-grid[data-count="3"],
  .ec-class-grid[data-count="4"],.ec-class-grid[data-count="5"],
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
  .ec-class-chat{width:auto;left:0;right:0;top:auto;height:70vh;border-left:none;border-top:1px solid rgba(255,255,255,.08);border-radius:20px 20px 0 0;animation:ec-lr-chat-up .3s cubic-bezier(.22,1,.36,1) both}
  @keyframes ec-lr-chat-up{from{transform:translateY(100%)}to{transform:translateY(0)}}
  .ec-class-chat-head{padding:14px 16px}
  .ec-class-chat-body{padding:14px 16px}

  /* ── EXAM MOBILE ── */
  .ec-exam-head{padding:12px 14px;padding-top:calc(12px + env(safe-area-inset-top, 0px));flex-wrap:wrap;gap:8px}
  .ec-exam-title{font-size:13px;max-width:42vw}
  .ec-exam-set{font-size:10px;padding:4px 9px}
  .ec-exam-timer{font-size:12px;padding:7px 13px}
  .ec-exam-body{padding:18px 14px 200px}
  .ec-exam-q{padding:22px 18px;border-radius:22px;box-shadow:0 6px 0 var(--lang-line)}
  .ec-exam-q-num{margin-bottom:14px;font-size:10.5px}
  .ec-exam-q-text{font-size:17px;margin-bottom:20px;line-height:1.45}
  .ec-exam-option{padding:16px 16px;font-size:14.5px;min-height:60px;gap:12px}
  .ec-exam-option-letter{width:34px;height:34px;font-size:14px}
  .ec-exam-feedback{padding:14px;border-radius:14px;gap:10px}
  .ec-exam-feedback-icon{width:32px;height:32px}
  .ec-exam-feedback-title{font-size:14px}
  .ec-exam-feedback-answer{font-size:13px}
  .ec-exam-feedback-explain{font-size:12.5px}

  /* Sticky footer with palette above nav buttons */
  .ec-exam-footer{
    flex-direction:column;gap:10px;
    padding:10px 12px;
    padding-bottom:calc(10px + env(safe-area-inset-bottom, 0px));
  }
  .ec-exam-palette{
    max-width:100%;order:-1;width:100%;
    justify-content:flex-start;
    padding:2px 0;
  }
  .ec-exam-palette-dot{width:40px;height:40px;font-size:13px;border-radius:12px}
  .ec-exam-nav{width:100%}
  .ec-exam-nav-btn{flex:1;min-height:54px;font-size:13.5px;justify-content:center}
  .ec-exam-nav-btn--submit,.ec-exam-nav-btn--next-set{flex:1.5}

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
  .ec-live-btn--primary,.ec-live-btn--zoom{min-width:160px}
  .ec-exam-palette-dot{width:36px;height:36px;font-size:12px}
  .ec-zoom-embed-bar-sub{display:none}
  .ec-exam-title{max-width:34vw}
  .ec-exam-q-text{font-size:16px}
  .ec-exam-option{font-size:14px;padding:14px;min-height:56px}
}

/* Landscape phones */
@media (max-width:900px) and (orientation:landscape) and (max-height:500px){
  .ec-exam-head{padding-top:10px;padding-bottom:10px}
  .ec-exam-body{padding-top:14px;padding-bottom:110px}
  .ec-exam-footer{flex-direction:row;padding:8px 12px}
  .ec-exam-palette{order:0;max-width:55%}
  .ec-exam-nav{width:auto}
  .ec-exam-nav-btn{padding:9px 14px;min-height:42px;font-size:12px}
}

@media (prefers-reduced-motion:reduce){
  .ec-live-dot,.ec-live-anim,.ec-class,.ec-class-chat,.ec-exam,.ec-exam-q,
  .ec-exam-modal,.ec-exam-result,.ec-connect-card,.ec-connect-overlay,
  .ec-zoom-embed,.ec-live-stat,.ec-live-card,.ec-live-hero,.ec-live-hero-mascot,
  .ec-live-hero-sparkle,.ec-live-badge--live::after,.ec-class-tile--speaking,
  .ec-class-tile-mic--on,.ec-class-avatar,.ec-lb-row,.ec-lb-rank,
  .ec-exam-option,.ec-exam-palette-dot,.ec-exam-result-score div,
  .ec-exam-result-emoji,.ec-exam-modal-icon,.ec-exam-option--correct,
  .ec-exam-option--wrong,.ec-exam-nav-btn--next-set,.ec-exam-feedback{animation:none!important}
  .ec-live-fill,.ec-exam-progress-fill{transition:none}
  .ec-live-fill::after,.ec-live-stat::after,.ec-exam-progress-fill::after,
  .ec-live-btn::before,.ec-exam-option--correct::after{animation:none!important;display:none}
  .ec-class-rec-dot,.ec-exam-timer--danger{animation:none}
  .ec-connect-spinner,.ec-connect-spinner::after{animation:none}
  .ec-live-card:hover,.ec-live-stat:hover,.ec-live-tab:hover,
  .ec-live-btn:hover:not(:disabled),.ec-guest-btn:hover:not(:disabled),
  .ec-exam-option:hover:not(:disabled),.ec-exam-nav-btn:hover:not(:disabled),
  .ec-exam-palette-dot:hover,.ec-exam-modal-actions button:hover,
  .ec-lb-row:hover,.ec-class-tile:hover,.ec-class-icon-btn:hover,
  .ec-class-ctrl:hover{transform:none}
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

const MOCK_CHAT = [
  { id: 'c1', name: 'Ms. Rahman', initials: 'MR', text: 'Welcome everyone! We’ll begin in a couple of minutes.', time: '8:01 PM' },
  { id: 'c2', name: 'Arif',       initials: 'A',  text: 'Excited for this session 🎉', time: '8:02 PM' },
  { id: 'c3', name: 'Sadia',      initials: 'S',  text: 'Can you share the practice passage PDF again?', time: '8:03 PM' },
  { id: 'c4', name: 'Ms. Rahman', initials: 'MR', text: 'Just posted it in the resources tab 👍', time: '8:03 PM' },
];

/* ============================================================
   EXAM CONFIG
   ============================================================ */
const EXAM_SET_SIZE = 20;
const EXAM_SECONDS  = 5 * 60;

/* ============================================================
   EXAM QUESTION BANK — 685 questions
   (Same as before — verified complete)
   ============================================================ */
const MOCK_QUESTIONS = [
  /* PRESENT SIMPLE */
  { q: 'She ___ to work every morning.', options: ['walk','walks','walking','walked'], answer: 1 },
  { q: 'They ___ football on Sundays.', options: ['plays','play','playing','played'], answer: 1 },
  { q: 'The sun ___ in the east.', options: ['rise','rises','rising','rose'], answer: 1 },
  { q: 'He usually ___ coffee in the morning.', options: ['drink','drinks','drinking','drank'], answer: 1 },
  { q: 'We ___ to the same school.', options: ['go','goes','going','gone'], answer: 0 },
  { q: 'My sister ___ English very well.', options: ['speak','speaks','speaking','spoke'], answer: 1 },
  { q: 'The train ___ at 8 AM every day.', options: ['leave','leaves','leaving','left'], answer: 1 },
  { q: 'I ___ fish, but my brother hates it.', options: ['love','loves','loving','loved'], answer: 0 },
  { q: 'Water ___ at 100 degrees Celsius.', options: ['boil','boils','boiling','boiled'], answer: 1 },
  { q: 'She ___ her teeth twice a day.', options: ['brush','brushes','brushing','brushed'], answer: 1 },
  { q: 'The children ___ in the park after school.', options: ['play','plays','playing','played'], answer: 0 },
  { q: 'My father ___ the newspaper every evening.', options: ['read','reads','reading','is reading'], answer: 1 },
  { q: 'It rarely ___ in this region.', options: ['rain','rains','raining','rained'], answer: 1 },
  { q: 'The shop ___ at 9 AM.', options: ['open','opens','opening','opened'], answer: 1 },
  { q: 'Buses ___ every fifteen minutes.', options: ['come','comes','coming','came'], answer: 0 },

  /* PRESENT CONTINUOUS */
  { q: 'Look! The baby ___ .', options: ['sleep','sleeps','is sleeping','slept'], answer: 2 },
  { q: 'I ___ this book at the moment.', options: ['read','reads','am reading','readed'], answer: 2 },
  { q: 'They ___ dinner right now.', options: ['have','has','are having','had'], answer: 2 },
  { q: 'Why ___ you laughing?', options: ['is','are','am','be'], answer: 1 },
  { q: 'She ___ to music in her room.', options: ['listen','listens','is listening','listened'], answer: 2 },
  { q: 'The kids ___ in the garden.', options: ['play','plays','are playing','played'], answer: 2 },
  { q: 'He ___ English this semester.', options: ['study','studies','is studying','studied'], answer: 2 },
  { q: 'We ___ for the bus.', options: ['wait','waits','are waiting','waited'], answer: 2 },
  { q: 'It ___ outside. Take an umbrella.', options: ['rain','rains','is raining','rained'], answer: 2 },
  { q: 'My mother ___ cookies right now.', options: ['bake','bakes','is baking','baked'], answer: 2 },
  { q: 'The phone ___ . Can you answer it?', options: ['ring','rings','is ringing','rang'], answer: 2 },
  { q: 'They ___ a new house this year.', options: ['build','builds','are building','built'], answer: 2 },
  { q: 'I ___ TV, so please be quiet.', options: ['watch','watches','am watching','watched'], answer: 2 },
  { q: 'She ___ with her friend on the phone.', options: ['talk','talks','is talking','talked'], answer: 2 },
  { q: 'The cat ___ on the sofa.', options: ['lie','lies','is lying','lay'], answer: 2 },

  /* PRESENT PERFECT */
  { q: 'I ___ just finished my homework.', options: ['has','have','had','am'], answer: 1 },
  { q: 'She ___ never been to Japan.', options: ['have','has','had','is'], answer: 1 },
  { q: 'They ___ already seen the movie.', options: ['has','have','had','are'], answer: 1 },
  { q: 'He ___ his keys.', options: ['lose','loses','has lost','lost'], answer: 2 },
  { q: 'We ___ each other for ten years.', options: ['know','knows','have known','knew'], answer: 2 },
  { q: 'I ___ in this city since 2010.', options: ['live','lives','have lived','lived'], answer: 2 },
  { q: 'She ___ her arm.', options: ['break','breaks','has broken','broke'], answer: 2 },
  { q: 'Have you ever ___ sushi?', options: ['eat','ate','eaten','eating'], answer: 2 },
  { q: 'The train has just ___ .', options: ['leave','leaves','left','leaving'], answer: 2 },
  { q: 'He ___ three cups of coffee today.', options: ['drink','drinks','has drunk','drank'], answer: 2 },
  { q: 'I have not ___ that book yet.', options: ['read','reads','reading','reads'], answer: 0 },
  { q: 'They ___ been married for 20 years.', options: ['has','have','had','is'], answer: 1 },
  { q: 'She has ___ her report.', options: ['finish','finishes','finished','finishing'], answer: 2 },
  { q: 'Nobody ___ seen him since Monday.', options: ['have','has','had','is'], answer: 1 },
  { q: 'I think I ___ seen this movie before.', options: ['has','have','had','am'], answer: 1 },

  /* PRESENT PERFECT CONTINUOUS */
  { q: 'She ___ for two hours.', options: ['study','studies','has been studying','studied'], answer: 2 },
  { q: 'They ___ since morning.', options: ['play','plays','have been playing','played'], answer: 2 },
  { q: 'I ___ here since 9 AM.', options: ['wait','waits','have been waiting','waited'], answer: 2 },
  { q: 'He ___ for the company for five years.', options: ['work','works','has been working','worked'], answer: 2 },
  { q: 'It ___ since last night.', options: ['rain','rains','has been raining','rained'], answer: 2 },
  { q: 'We ___ this project for months.', options: ['discuss','discusses','have been discussing','discussed'], answer: 2 },
  { q: 'She ___ all day.', options: ['cook','cooks','has been cooking','cooked'], answer: 2 },
  { q: 'My eyes are tired because I ___ at the screen.', options: ['look','looks','have been looking','looked'], answer: 2 },
  { q: 'I ___ for you all morning.', options: ['wait','waits','have been waiting','waited'], answer: 2 },
  { q: 'She ___ since she was a child.', options: ['paint','paints','has been painting','painted'], answer: 2 },

  /* PAST SIMPLE */
  { q: 'I ___ to the cinema yesterday.', options: ['go','goes','went','gone'], answer: 2 },
  { q: 'She ___ her homework last night.', options: ['do','does','did','done'], answer: 2 },
  { q: 'They ___ to Paris in 2019.', options: ['travel','travels','traveled','traveling'], answer: 2 },
  { q: 'He ___ a new car last week.', options: ['buy','buys','bought','buying'], answer: 2 },
  { q: 'We ___ dinner at 8 PM.', options: ['have','has','had','having'], answer: 2 },
  { q: 'She ___ the answer to the question.', options: ['know','knows','knew','known'], answer: 2 },
  { q: 'I ___ him at the party.', options: ['meet','meets','met','meeting'], answer: 2 },
  { q: 'They ___ the game yesterday.', options: ['win','wins','won','winning'], answer: 2 },
  { q: 'He ___ his keys on the table.', options: ['leave','leaves','left','leaving'], answer: 2 },
  { q: 'She ___ a beautiful song.', options: ['sing','sings','sang','singing'], answer: 2 },
  { q: 'The train ___ late.', options: ['arrive','arrives','arrived','arriving'], answer: 2 },
  { q: 'I ___ a letter to my friend.', options: ['write','writes','wrote','writing'], answer: 2 },
  { q: 'We ___ a good time at the beach.', options: ['have','has','had','having'], answer: 2 },
  { q: 'She ___ her grandmother last weekend.', options: ['visit','visits','visited','visiting'], answer: 2 },
  { q: 'The children ___ in the park all afternoon.', options: ['play','plays','played','playing'], answer: 2 },

  /* PAST CONTINUOUS */
  { q: 'I ___ TV when you called.', options: ['watch','watches','was watching','watched'], answer: 2 },
  { q: 'They ___ dinner when we arrived.', options: ['have','has','were having','had'], answer: 2 },
  { q: 'She ___ a book when the phone rang.', options: ['read','reads','was reading','readed'], answer: 2 },
  { q: 'The kids ___ in the garden at 3 PM.', options: ['play','plays','were playing','played'], answer: 2 },
  { q: 'What ___ you doing at 8 PM?', options: ['is','are','was','were'], answer: 3 },
  { q: 'He ___ when I saw him.', options: ['run','runs','was running','ran'], answer: 2 },
  { q: 'We ___ about you when you walked in.', options: ['talk','talks','were talking','talked'], answer: 2 },
  { q: 'It ___ hard when we left.', options: ['rain','rains','was raining','rained'], answer: 2 },
  { q: 'The birds ___ when I woke up.', options: ['sing','sings','were singing','sang'], answer: 2 },
  { q: 'She ___ for the test all evening.', options: ['study','studies','was studying','studied'], answer: 2 },

  /* PAST PERFECT */
  { q: 'By the time we arrived, the movie ___ .', options: ['start','starts','had started','started'], answer: 2 },
  { q: 'She ___ the report before the meeting.', options: ['finish','finishes','had finished','finished'], answer: 2 },
  { q: 'I had never ___ such a beautiful place.', options: ['see','saw','seen','seeing'], answer: 2 },
  { q: 'They ___ the house before I got there.', options: ['leave','leaves','had left','left'], answer: 2 },
  { q: 'He ___ English before moving to London.', options: ['study','studies','had studied','studied'], answer: 2 },
  { q: 'When I arrived, she had already ___ .', options: ['leave','leaves','left','leaving'], answer: 2 },
  { q: 'We ___ each other before that day.', options: ['never meet','never meets','had never met','never met'], answer: 2 },
  { q: 'The train ___ by the time we reached the station.', options: ['leave','leaves','had left','left'], answer: 2 },
  { q: 'She told me she ___ the movie.', options: ['see','sees','had seen','saw'], answer: 2 },
  { q: 'He was tired because he ___ all night.', options: ['work','works','had worked','worked'], answer: 2 },

  /* PAST PERFECT CONTINUOUS */
  { q: 'She was tired because she ___ all night.', options: ['work','works','had been working','worked'], answer: 2 },
  { q: 'The ground was wet because it ___ .', options: ['rain','rains','had been raining','rained'], answer: 2 },
  { q: 'He was out of breath because he ___ .', options: ['run','runs','had been running','ran'], answer: 2 },
  { q: 'My eyes were red because I ___ .', options: ['cry','cries','had been crying','cried'], answer: 2 },
  { q: 'They were exhausted because they ___ for hours.', options: ['dance','dances','had been dancing','danced'], answer: 2 },

  /* FUTURE SIMPLE */
  { q: 'I ___ you tomorrow.', options: ['call','calls','will call','called'], answer: 2 },
  { q: 'She ___ to the party next week.', options: ['come','comes','will come','came'], answer: 2 },
  { q: 'They ___ the project by Friday.', options: ['finish','finishes','will finish','finished'], answer: 2 },
  { q: 'We ___ dinner at 8 PM.', options: ['have','has','will have','had'], answer: 2 },
  { q: 'He ___ the answer.', options: ['know','knows','will know','knew'], answer: 2 },
  { q: 'It ___ rain tomorrow.', options: ['will','is','was','does'], answer: 0 },
  { q: 'I promise I ___ late.', options: ["won't be",'is not','was not','are not'], answer: 0 },
  { q: 'She ___ help you with the work.', options: ['will','is','was','does'], answer: 0 },
  { q: 'They ___ arrive at 10.', options: ['will','is','was','does'], answer: 0 },
  { q: 'We ___ the meeting tomorrow.', options: ['attend','attends','will attend','attended'], answer: 2 },

  /* FUTURE CONTINUOUS */
  { q: 'This time tomorrow, I ___ on a beach.', options: ['lie','lies','will be lying','lay'], answer: 2 },
  { q: 'At 8 PM, we ___ dinner.', options: ['have','has','will be having','had'], answer: 2 },
  { q: 'She ___ when you call.', options: ['sleep','sleeps','will be sleeping','slept'], answer: 2 },
  { q: 'They ___ at this time tomorrow.', options: ['work','works','will be working','worked'], answer: 2 },
  { q: 'I ___ a book this evening.', options: ['read','reads','will be reading','readed'], answer: 2 },

  /* FUTURE PERFECT */
  { q: 'By next year, I ___ my degree.', options: ['finish','finishes','will have finished','finished'], answer: 2 },
  { q: 'She ___ the project by Friday.', options: ['complete','completes','will have completed','completed'], answer: 2 },
  { q: 'By the time you arrive, we ___ dinner.', options: ['have','has','will have had','had'], answer: 2 },
  { q: 'They ___ the house by December.', options: ['sell','sells','will have sold','sold'], answer: 2 },
  { q: 'By 2030, he ___ for 20 years.', options: ['work','works','will have worked','worked'], answer: 2 },

  /* MIXED TENSES */
  { q: 'When I was young, I ___ every day.', options: ['play','plays','played','playing'], answer: 2 },
  { q: 'I ___ here for 5 years.', options: ['work','works','have been working','worked'], answer: 2 },
  { q: 'She ___ when I called her.', options: ['sleep','sleeps','was sleeping','slept'], answer: 2 },
  { q: 'I ___ the movie already when you told me about it.', options: ['see','sees','had seen','saw'], answer: 2 },
  { q: 'Look! The children ___ in the rain.', options: ['play','plays','are playing','played'], answer: 2 },

  /* PREPOSITIONS IN/ON/AT */
  { q: 'She arrived ___ Monday morning.', options: ['in','on','at','by'], answer: 1 },
  { q: "I'll see you ___ the weekend.", options: ['in','on','at','by'], answer: 2 },
  { q: 'He was born ___ 1990.', options: ['in','on','at','by'], answer: 0 },
  { q: "The meeting is ___ 3 o'clock.", options: ['in','on','at','by'], answer: 2 },
  { q: 'We met ___ the bus stop.', options: ['in','on','at','by'], answer: 2 },
  { q: "She's been ___ holiday for a week.", options: ['in','on','at','by'], answer: 1 },
  { q: 'They live ___ London.', options: ['in','on','at','by'], answer: 0 },
  { q: 'The book is ___ the table.', options: ['in','on','at','by'], answer: 1 },
  { q: "I'll meet you ___ the cinema.", options: ['in','on','at','by'], answer: 2 },
  { q: "He's been ___ business for 10 years.", options: ['in','on','at','by'], answer: 0 },
  { q: 'The picture is ___ the wall.', options: ['in','on','at','by'], answer: 1 },
  { q: 'I arrived ___ the airport at 8.', options: ['in','on','at','by'], answer: 2 },
  { q: "She's still ___ bed.", options: ['in','on','at','by'], answer: 0 },
  { q: 'He was born ___ July.', options: ['in','on','at','by'], answer: 0 },
  { q: 'I usually wake up ___ 7 AM.', options: ['in','on','at','by'], answer: 2 },
  { q: 'She studies ___ the university.', options: ['in','on','at','by'], answer: 2 },
  { q: "I'm going ___ holiday next week.", options: ['in','on','at','by'], answer: 1 },
  { q: 'The restaurant is ___ the corner.', options: ['in','on','at','by'], answer: 1 },
  { q: "Let's meet ___ the park.", options: ['in','on','at','by'], answer: 2 },
  { q: 'The shop opens ___ 9 AM.', options: ['in','on','at','by'], answer: 2 },

  /* FOR / SINCE */
  { q: "I've lived here ___ 2010.", options: ['for','since','in','from'], answer: 1 },
  { q: "She's been waiting ___ two hours.", options: ['for','since','in','at'], answer: 0 },
  { q: "He's worked there ___ five years.", options: ['for','since','in','at'], answer: 0 },
  { q: "I haven't seen him ___ Monday.", options: ['for','since','in','at'], answer: 1 },
  { q: "We've known each other ___ childhood.", options: ['for','since','in','at'], answer: 1 },
  { q: "She's been studying ___ morning.", options: ['for','since','in','at'], answer: 1 },
  { q: "I've had this car ___ 2015.", options: ['for','since','in','at'], answer: 1 },
  { q: "They've been married ___ 10 years.", options: ['for','since','in','at'], answer: 0 },
  { q: "It's been raining ___ last night.", options: ['for','since','in','at'], answer: 1 },
  { q: "I've been waiting ___ about an hour.", options: ['for','since','in','at'], answer: 0 },

  /* BY / UNTIL */
  { q: "I'll finish the report ___ Friday.", options: ['by','until','in','at'], answer: 0 },
  { q: 'The shop is open ___ 9 PM.', options: ['by','until','in','at'], answer: 1 },
  { q: 'Please be home ___ 10 PM.', options: ['by','until','in','at'], answer: 0 },
  { q: 'Wait here ___ I come back.', options: ['by','until','in','at'], answer: 1 },
  { q: 'You must submit the form ___ Monday.', options: ['by','until','in','at'], answer: 0 },

  /* OTHER PREPOSITIONS */
  { q: "She's good ___ math.", options: ['at','in','on','with'], answer: 0 },
  { q: "I'm interested ___ art.", options: ['at','in','on','with'], answer: 1 },
  { q: "He's afraid ___ heights.", options: ['at','in','of','with'], answer: 2 },
  { q: "She's married ___ my cousin.", options: ['to','with','at','in'], answer: 0 },
  { q: "I'm tired ___ this noise.", options: ['at','in','of','with'], answer: 2 },
  { q: "He's famous ___ his music.", options: ['at','for','in','with'], answer: 1 },
  { q: 'This book belongs ___ me.', options: ['to','with','at','in'], answer: 0 },
  { q: "She's proud ___ her son.", options: ['at','in','of','with'], answer: 2 },
  { q: "I'm worried ___ the exam.", options: ['at','about','of','with'], answer: 1 },
  { q: "He's responsible ___ the project.", options: ['at','for','in','with'], answer: 1 },
  { q: "She's allergic ___ cats.", options: ['to','with','at','in'], answer: 0 },
  { q: 'It depends ___ the weather.', options: ['at','on','in','with'], answer: 1 },
  { q: "I'm looking forward ___ the trip.", options: ['to','for','at','in'], answer: 0 },
  { q: 'He apologized ___ being late.', options: ['at','for','of','with'], answer: 1 },
  { q: "She's angry ___ me.", options: ['at','on','with','in'], answer: 2 },
  { q: "He's capable ___ doing it.", options: ['at','in','of','with'], answer: 2 },
  { q: "I'm familiar ___ this city.", options: ['at','in','with','to'], answer: 2 },
  { q: "She's different ___ her sister.", options: ['from','with','at','in'], answer: 0 },
  { q: "They're satisfied ___ the result.", options: ['at','in','with','on'], answer: 2 },
  { q: "He's engaged ___ my friend.", options: ['to','with','at','in'], answer: 0 },
  { q: "I'm not used ___ this weather.", options: ['at','in','to','with'], answer: 2 },
  { q: "She's similar ___ her mother.", options: ['to','with','at','in'], answer: 0 },
  { q: 'He suffers ___ headaches.', options: ['at','in','from','with'], answer: 2 },
  { q: 'This is made ___ wood.', options: ['at','in','of','with'], answer: 2 },
  { q: "She's keen ___ learning.", options: ['at','on','of','with'], answer: 1 },

  /* ARTICLES */
  { q: 'I saw ___ elephant at the zoo.', options: ['a','an','the','—'], answer: 1 },
  { q: "She's ___ doctor.", options: ['a','an','the','—'], answer: 0 },
  { q: "He's ___ honest man.", options: ['a','an','the','—'], answer: 1 },
  { q: 'I need ___ umbrella.', options: ['a','an','the','—'], answer: 1 },
  { q: 'This is ___ interesting book.', options: ['a','an','the','—'], answer: 1 },
  { q: 'She wants to be ___ engineer.', options: ['a','an','the','—'], answer: 1 },
  { q: 'He is ___ university student.', options: ['a','an','the','—'], answer: 0 },
  { q: 'That was ___ excellent meal.', options: ['a','an','the','—'], answer: 1 },
  { q: "She's ___ artist.", options: ['a','an','the','—'], answer: 1 },
  { q: 'I bought ___ new car.', options: ['a','an','the','—'], answer: 0 },
  { q: "He's ___ MBA graduate.", options: ['a','an','the','—'], answer: 1 },
  { q: 'She has ___ European passport.', options: ['a','an','the','—'], answer: 0 },
  { q: 'What ___ beautiful day!', options: ['a','an','the','—'], answer: 0 },
  { q: 'That is ___ useful tool.', options: ['a','an','the','—'], answer: 0 },
  { q: 'She found ___ old coin.', options: ['a','an','the','—'], answer: 1 },
  { q: '___ sun rises in the east.', options: ['A','An','The','—'], answer: 2 },
  { q: '___ moon is bright tonight.', options: ['A','An','The','—'], answer: 2 },
  { q: 'I go to ___ school every day.', options: ['a','an','the','—'], answer: 3 },
  { q: 'She went to ___ hospital last week.', options: ['a','an','the','—'], answer: 2 },
  { q: 'He plays ___ piano very well.', options: ['a','an','the','—'], answer: 2 },
  { q: '___ Amazon is a big river.', options: ['A','An','The','—'], answer: 2 },
  { q: '___ Philippines is in Asia.', options: ['A','An','The','—'], answer: 2 },
  { q: 'I love ___ music.', options: ['a','an','the','—'], answer: 3 },
  { q: 'She studies ___ history.', options: ['a','an','the','—'], answer: 3 },
  { q: '___ Nile is the longest river.', options: ['A','An','The','—'], answer: 2 },
  { q: "Let's go to ___ beach.", options: ['a','an','the','—'], answer: 2 },
  { q: 'He is in ___ bed.', options: ['a','an','the','—'], answer: 3 },
  { q: 'I have ___ breakfast at 8.', options: ['a','an','the','—'], answer: 3 },
  { q: '___ Himalayas are beautiful.', options: ['A','An','The','—'], answer: 2 },
  { q: 'She plays ___ guitar.', options: ['a','an','the','—'], answer: 2 },
  { q: '___ English is my favorite subject.', options: ['A','An','The','—'], answer: 3 },
  { q: "I'll take ___ bus to work.", options: ['a','an','the','—'], answer: 2 },
  { q: '___ USA is a big country.', options: ['A','An','The','—'], answer: 2 },
  { q: 'We went to ___ cinema yesterday.', options: ['a','an','the','—'], answer: 2 },
  { q: '___ Mount Everest is the highest mountain.', options: ['A','An','The','—'], answer: 3 },
  { q: "She's reading ___ book I gave her.", options: ['a','an','the','—'], answer: 2 },
  { q: "That's ___ boy I told you about.", options: ['a','an','the','—'], answer: 2 },
  { q: '___ rich should help the poor.', options: ['A','An','The','—'], answer: 2 },
  { q: '___ life is beautiful.', options: ['A','An','The','—'], answer: 3 },
  { q: '___ poverty is a global issue.', options: ['A','An','The','—'], answer: 3 },

  /* SUBJECT-VERB AGREEMENT */
  { q: 'She ___ to music every day.', options: ['listen','listens','listening','listened'], answer: 1 },
  { q: 'The dogs ___ loudly.', options: ['bark','barks','barking','barked'], answer: 0 },
  { q: 'My brother and I ___ good friends.', options: ['am','is','are','be'], answer: 2 },
  { q: 'Each of the students ___ a book.', options: ['have','has','having','had'], answer: 1 },
  { q: 'Neither of the boys ___ ready.', options: ['are','is','were','be'], answer: 1 },
  { q: 'Either of the answers ___ correct.', options: ['are','is','were','be'], answer: 1 },
  { q: 'The news ___ surprising.', options: ['are','is','were','be'], answer: 1 },
  { q: 'Mathematics ___ my favorite subject.', options: ['are','is','were','be'], answer: 1 },
  { q: 'The police ___ investigating the case.', options: ['is','are','was','be'], answer: 1 },
  { q: 'Every student ___ a uniform.', options: ['need','needs','needing','needed'], answer: 1 },
  { q: 'A number of students ___ absent.', options: ['is','are','was','be'], answer: 1 },
  { q: 'The number of students ___ increasing.', options: ['are','is','were','be'], answer: 1 },
  { q: 'Bread and butter ___ my breakfast.', options: ['are','is','were','be'], answer: 1 },
  { q: 'Ten years ___ a long time.', options: ['are','is','were','be'], answer: 1 },
  { q: 'Someone ___ at the door.', options: ['are','is','were','be'], answer: 1 },
  { q: 'Nobody ___ the answer.', options: ['know','knows','knowing','knew'], answer: 1 },
  { q: 'All of the cake ___ gone.', options: ['are','is','were','be'], answer: 1 },
  { q: 'Some of the students ___ late.', options: ['was','were','is','be'], answer: 1 },
  { q: 'Both of them ___ here.', options: ['is','are','was','be'], answer: 1 },
  { q: 'Few of the children ___ present.', options: ['was','were','is','be'], answer: 1 },
  { q: 'Many of the books ___ old.', options: ['is','are','was','be'], answer: 1 },
  { q: 'Half of the pizza ___ eaten.', options: ['were','was','are','be'], answer: 1 },
  { q: 'The information ___ useful.', options: ['are','is','were','be'], answer: 1 },
  { q: 'Her advice ___ always helpful.', options: ['are','is','were','be'], answer: 1 },
  { q: 'His furniture ___ expensive.', options: ['are','is','were','be'], answer: 1 },
  { q: 'The equipment ___ broken.', options: ['are','is','were','be'], answer: 1 },
  { q: 'Measles ___ a serious disease.', options: ['are','is','were','be'], answer: 1 },
  { q: 'Physics ___ difficult.', options: ['are','is','were','be'], answer: 1 },
  { q: 'The scissors ___ sharp.', options: ['is','are','was','be'], answer: 1 },
  { q: 'My trousers ___ too tight.', options: ['is','are','was','be'], answer: 1 },
  { q: 'The cattle ___ grazing.', options: ['is','are','was','be'], answer: 1 },
  { q: 'Two hours ___ enough time.', options: ['are','is','were','be'], answer: 1 },
  { q: 'The audience ___ clapping.', options: ['was','were','is','be'], answer: 0 },
  { q: 'The staff ___ getting ready.', options: ['is','are','was','be'], answer: 1 },
  { q: 'Everyone ___ here now.', options: ['are','is','were','be'], answer: 1 },
  { q: 'Something ___ wrong.', options: ['are','is','were','be'], answer: 1 },
  { q: 'Everything ___ ready.', options: ['are','is','were','be'], answer: 1 },
  { q: 'Nothing ___ impossible.', options: ['are','is','were','be'], answer: 1 },
  { q: 'Here ___ the keys.', options: ['is','are','was','be'], answer: 1 },
  { q: 'There ___ a book on the table.', options: ['are','is','were','be'], answer: 1 },
  { q: 'There ___ many people at the party.', options: ['was','were','is','be'], answer: 1 },
  { q: 'Neither John nor his friends ___ coming.', options: ['is','are','was','be'], answer: 1 },
  { q: 'Not only the teacher but also the students ___ happy.', options: ['was','were','is','be'], answer: 1 },
  { q: 'One of my friends ___ a doctor.', options: ['are','is','were','be'], answer: 1 },
  { q: 'The rich ___ becoming richer.', options: ['is','are','was','be'], answer: 1 },
  { q: 'His trousers ___ dirty.', options: ['is','are','was','be'], answer: 1 },
  { q: 'Each of the girls ___ her own room.', options: ['have','has','having','had'], answer: 1 },
  { q: 'The police ___ arrived.', options: ['has','have','having','had'], answer: 1 },
  { q: 'Somebody ___ left a bag here.', options: ['have','has','having','had'], answer: 1 },
  { q: 'Both my parents ___ teachers.', options: ['is','are','was','be'], answer: 1 },

  /* PRONOUNS */
  { q: 'This is ___ book.', options: ['me','my','mine','I'], answer: 1 },
  { q: 'She gave ___ the letter.', options: ['I','me','my','mine'], answer: 1 },
  { q: 'They like ___ .', options: ['we','us','our','ours'], answer: 1 },
  { q: 'That house is ___ .', options: ['their','them','theirs','they'], answer: 2 },
  { q: 'I hurt ___ while cooking.', options: ['me','myself','mine','I'], answer: 1 },
  { q: 'He did it ___ .', options: ['him','himself','his','he'], answer: 1 },
  { q: 'She taught ___ to play guitar.', options: ['her','herself','hers','she'], answer: 1 },
  { q: 'We enjoyed ___ .', options: ['us','ourselves','our','ours'], answer: 1 },
  { q: 'The children behaved ___ .', options: ['them','themselves','their','theirs'], answer: 1 },
  { q: 'Please help ___ .', options: ['you','yourselves','your','yours'], answer: 1 },
  { q: '___ is my friend.', options: ['Him','He','His','Himself'], answer: 1 },
  { q: '___ are going to the party.', options: ['Them','They','Their','Theirs'], answer: 1 },
  { q: 'The book is ___ .', options: ['my','mine','me','I'], answer: 1 },
  { q: "That's ___ problem, not ___ .", options: ['your / mine','you / my','yours / me','your / me'], answer: 0 },
  { q: 'She and ___ are classmates.', options: ['me','I','my','mine'], answer: 1 },
  { q: "Between you and ___, I don't like it.", options: ['I','me','my','mine'], answer: 1 },
  { q: "It's ___ who should apologize.", options: ['he','him','his','himself'], answer: 0 },
  { q: '___ of the two is better?', options: ['Who','Which','Whose','Whom'], answer: 1 },
  { q: '___ do you prefer?', options: ['Who','Whom','Whose','Which one'], answer: 1 },
  { q: "I don't know ___ to choose.", options: ['who','which','whose','whom'], answer: 1 },
  { q: '___ did you give the book to?', options: ['Who','Whom','Whose','Which'], answer: 1 },
  { q: 'This is the man ___ helped me.', options: ['which','who','whose','whom'], answer: 1 },
  { q: 'The woman ___ I met was kind.', options: ['which','who','whose','whom'], answer: 3 },
  { q: 'The house ___ I live in is old.', options: ['who','which','whose','whom'], answer: 1 },
  { q: "That's the boy ___ won the prize.", options: ['which','who','whose','whom'], answer: 1 },
  { q: 'I know the place ___ we met.', options: ['which','who','where','when'], answer: 2 },
  { q: 'Tell me the reason ___ you left.', options: ['which','who','where','why'], answer: 3 },
  { q: 'I remember the day ___ we first met.', options: ['which','when','where','why'], answer: 1 },
  { q: '___ is a beautiful city.', options: ['He','She','It','They'], answer: 2 },
  { q: '___ seems easy.', options: ['This','These','Those','Them'], answer: 0 },
  { q: 'Somebody left ___ bag here.', options: ['his','her','their','its'], answer: 2 },
  { q: 'Everyone should do ___ best.', options: ['his','their','its','one'], answer: 1 },
  { q: "If anyone calls, tell ___ I'm out.", options: ['him','her','them','it'], answer: 2 },
  { q: 'The team celebrated ___ victory.', options: ['its','their','his','her'], answer: 1 },
  { q: 'Each student must bring ___ own pen.', options: ['his','their','its','one'], answer: 1 },
  { q: 'Neither of them did ___ homework.', options: ['his','their','its','one'], answer: 1 },
  { q: 'Let ___ go home.', options: ['we','us','our','ours'], answer: 1 },
  { q: 'Give the ball to ___ .', options: ['he','him','his','himself'], answer: 1 },
  { q: 'She loves ___ more than anything.', options: ['he','him','his','himself'], answer: 1 },
  { q: "It's not ___ fault.", options: ['he','him','his','himself'], answer: 2 },

  /* CONDITIONALS */
  { q: 'If it ___ tomorrow, we\'ll stay home.', options: ['rain','rains','rained','raining'], answer: 1 },
  { q: 'If I ___ rich, I would travel.', options: ['am','was','were','be'], answer: 2 },
  { q: 'If she ___ harder, she would have passed.', options: ['study','studied','had studied','studies'], answer: 2 },
  { q: 'If you heat ice, it ___ .', options: ['melt','melts','melted','melting'], answer: 1 },
  { q: 'If I ___ you, I would apologize.', options: ['am','was','were','be'], answer: 2 },
  { q: 'If he ___ earlier, he would have caught the train.', options: ['leave','left','had left','leaves'], answer: 2 },
  { q: "I'll call you if I ___ any news.", options: ['hear','hears','heard','hearing'], answer: 0 },
  { q: 'If you ___ the button, the machine stops.', options: ['press','presses','pressed','pressing'], answer: 0 },
  { q: "If it ___ sunny, we'll go to the beach.", options: ['is','was','were','be'], answer: 0 },
  { q: 'If I ___ more time, I would help you.', options: ['have','has','had','having'], answer: 2 },
  { q: 'If she ___ the truth, she would have told us.', options: ['know','knew','had known','knows'], answer: 2 },
  { q: 'What would you do if you ___ a million dollars?', options: ['win','wins','won','winning'], answer: 2 },
  { q: "Unless you ___ , you'll be late.", options: ['hurry','hurries','hurried','hurrying'], answer: 0 },
  { q: "If you don't water plants, they ___ .", options: ['die','dies','died','dying'], answer: 0 },
  { q: 'If I ___ a bird, I would fly.', options: ['am','was','were','be'], answer: 2 },
  { q: "If we ___ the game, we'll celebrate.", options: ['win','wins','won','winning'], answer: 0 },
  { q: 'If she ___ me, I would have gone.', options: ['invite','invites','had invited','invited'], answer: 2 },
  { q: 'I would have called if I ___ your number.', options: ['have','has','had','having'], answer: 2 },
  { q: "If it hadn't rained, we ___ gone out.", options: ['would','would have','will','had'], answer: 1 },
  { q: 'If you ___ attention, you would understand.', options: ['pay','pays','paid','paying'], answer: 2 },
  { q: 'Suppose you ___ in my position, what would you do?', options: ['are','were','be','is'], answer: 1 },
  { q: 'If I had known, I ___ differently.', options: ['act','acts','would have acted','acted'], answer: 2 },
  { q: 'She would be happier if she ___ in the countryside.', options: ['live','lives','lived','living'], answer: 2 },
  { q: 'If I were you, I ___ the offer.', options: ['accept','accepts','would accept','accepted'], answer: 2 },
  { q: 'If you ___ your homework, you can go out.', options: ['finish','finishes','finished','finishing'], answer: 0 },
  { q: 'I wish I ___ taller.', options: ['am','was','were','be'], answer: 2 },
  { q: 'I wish I ___ studied harder.', options: ['have','has','had','having'], answer: 2 },
  { q: 'He wishes he ___ the exam.', options: ['pass','passes','had passed','passed'], answer: 2 },
  { q: 'If only I ___ more careful.', options: ['am','was','had been','be'], answer: 2 },
  { q: 'If I ___ his name, I would tell you.', options: ['know','knows','knew','known'], answer: 2 },
  { q: 'Had I ___ earlier, I would have helped.', options: ['arrive','arrives','arrived','arriving'], answer: 2 },
  { q: 'Should you ___ any questions, ask me.', options: ['have','has','had','having'], answer: 0 },
  { q: "Unless it ___ , we'll play football.", options: ['rain','rains','rained','raining'], answer: 1 },
  { q: 'If you ___ TV all day, your eyes will hurt.', options: ['watch','watches','watched','watching'], answer: 0 },
  { q: 'If she ___ rich, she would travel the world.', options: ['is','was','were','be'], answer: 2 },
  { q: "If we ___ a car, we'd drive there.", options: ['have','has','had','having'], answer: 2 },
  { q: 'If they ___ hard, they will succeed.', options: ['work','works','worked','working'], answer: 0 },
  { q: 'If I ___ the answer, I would tell you.', options: ['know','knows','knew','known'], answer: 2 },
  { q: 'If he ___ her, he would have been happier.', options: ['marry','marries','had married','married'], answer: 2 },
  { q: 'I would tell you if I ___ .', options: ['know','knows','knew','known'], answer: 2 },

  /* MODALS */
  { q: 'You ___ see a doctor.', options: ['should','would','could','might'], answer: 0 },
  { q: 'She ___ swim very well.', options: ['can','may','must','should'], answer: 0 },
  { q: 'They ___ be at home now.', options: ['can','might','must','should'], answer: 1 },
  { q: 'I ___ go to bed early tonight.', options: ['must','may','might','could'], answer: 0 },
  { q: 'He ___ speak three languages.', options: ['can','may','must','should'], answer: 0 },
  { q: 'You ___ smoke here.', options: ["mustn't",'shouldn\'t','couldn\'t','wouldn\'t'], answer: 0 },
  { q: '___ I borrow your pen?', options: ['May','Must','Should','Would'], answer: 0 },
  { q: 'We ___ to help them.', options: ['ought','must','should','may'], answer: 0 },
  { q: 'She ___ take an umbrella.', options: ['should','would','could','might'], answer: 0 },
  { q: 'You ___ be tired after such a long day.', options: ['can','might','must','should'], answer: 2 },
  { q: "He ___ be at work; I saw him at the park.", options: ["can't",'mustn\'t','shouldn\'t','wouldn\'t'], answer: 0 },
  { q: '___ you please open the window?', options: ['Could','Must','Should','May'], answer: 0 },
  { q: 'We ___ finish the project by tomorrow.', options: ['have to','has to','having to','had'], answer: 0 },
  { q: 'Students ___ wear uniforms.', options: ['must','may','might','could'], answer: 0 },
  { q: 'You ___ have told me earlier.', options: ['should','would','could','might'], answer: 0 },
  { q: 'She ___ have forgotten.', options: ['might','must','should','would'], answer: 0 },
  { q: 'He ___ have arrived by now.', options: ['might','must','should','would'], answer: 2 },
  { q: 'They ___ have left already.', options: ['might','must','should','would'], answer: 1 },
  { q: 'I ___ rather stay home.', options: ['would','should','could','might'], answer: 0 },
  { q: 'You ___ better see a doctor.', options: ['had','would','should','could'], answer: 0 },
  { q: 'She ___ be coming later.', options: ['might','must','should','would'], answer: 0 },
  { q: 'We ___ not have waited.', options: ['should','would','could','might'], answer: 0 },
  { q: '___ I ask a question?', options: ['May','Must','Should','Would'], answer: 0 },
  { q: 'He ___ not have done that.', options: ['should','would','could','might'], answer: 0 },
  { q: 'You ___ need to hurry.', options: ['might','must','should','would'], answer: 0 },
  { q: 'She ___ have been very tired.', options: ['might','must','should','would'], answer: 1 },
  { q: 'We ___ go now if we want to catch the train.', options: ['should','would','could','might'], answer: 0 },
  { q: 'He ___ run faster when he was young.', options: ['can','could','may','might'], answer: 1 },
  { q: 'You ___ not enter without a pass.', options: ['may','must','should','would'], answer: 0 },
  { q: 'They ___ come tomorrow.', options: ['may','must','should','would'], answer: 0 },
  { q: 'I ___ help you with that.', options: ['can','must','should','would'], answer: 0 },
  { q: 'She ___ not want to come.', options: ['may','must','should','would'], answer: 0 },
  { q: 'You ___ have seen the sign.', options: ['should','would','could','might'], answer: 0 },
  { q: 'He ___ finished by now.', options: ['should have','must have','could have','might have'], answer: 0 },
  { q: "We ___ wait any longer.", options: ["can't",'mustn\'t','shouldn\'t','wouldn\'t'], answer: 0 },
  { q: '___ you like some tea?', options: ['Would','Should','Could','Might'], answer: 0 },
  { q: 'He used to ___ every evening.', options: ['play','plays','played','playing'], answer: 0 },
  { q: 'You ___ to apologize.', options: ['ought','must','should','may'], answer: 0 },
  { q: 'I ___ rather walk than drive.', options: ['would','should','could','might'], answer: 0 },
  { q: 'She ___ not have said that.', options: ['should','would','could','might'], answer: 0 },

  /* PASSIVE */
  { q: 'The letter ___ yesterday.', options: ['send','sent','was sent','is sent'], answer: 2 },
  { q: 'English ___ all over the world.', options: ['speak','speaks','is spoken','spoke'], answer: 2 },
  { q: 'The house ___ last year.', options: ['build','built','was built','is built'], answer: 2 },
  { q: 'The homework ___ by tomorrow.', options: ['finish','finishes','will be finished','finished'], answer: 2 },
  { q: 'The car ___ now.', options: ['repair','repairs','is being repaired','repaired'], answer: 2 },
  { q: 'The room ___ every day.', options: ['clean','cleans','is cleaned','cleaned'], answer: 2 },
  { q: 'The book ___ by thousands.', options: ['read','reads','has been read','readed'], answer: 2 },
  { q: 'Dinner ___ at 8 PM.', options: ['serve','serves','will be served','served'], answer: 2 },
  { q: 'The window ___ by the storm.', options: ['break','breaks','was broken','broke'], answer: 2 },
  { q: 'The new bridge ___ next year.', options: ['build','builds','will be built','built'], answer: 2 },
  { q: 'The thief ___ by the police.', options: ['catch','catches','was caught','caught'], answer: 2 },
  { q: 'The tree ___ yesterday.', options: ['cut','cuts','was cut','cutted'], answer: 2 },
  { q: 'A new hospital ___ in our city.', options: ['build','builds','is being built','built'], answer: 2 },
  { q: 'The exam ___ by all students.', options: ['must take','must be taken','must took','must taking'], answer: 1 },
  { q: 'The cake ___ by my mother.', options: ['make','makes','was made','made'], answer: 2 },
  { q: 'The song ___ beautifully.', options: ['sing','sings','was sung','sang'], answer: 2 },
  { q: 'The letter has already ___ .', options: ['send','sends','been sent','sent'], answer: 2 },
  { q: 'The work ___ by 5 PM.', options: ['do','does','will have been done','did'], answer: 2 },
  { q: 'The car ___ tomorrow.', options: ['wash','washes','will be washed','washed'], answer: 2 },
  { q: 'The problem ___ by the team.', options: ['solve','solves','was solved','solved'], answer: 2 },
  { q: 'The report ___ now.', options: ['write','writes','is being written','wrote'], answer: 2 },
  { q: 'The flowers ___ by her.', options: ['pick','picks','were picked','picked'], answer: 2 },
  { q: 'The tickets ___ online.', options: ['can buy','can be bought','can bought','can buying'], answer: 1 },
  { q: 'The medicine ___ twice a day.', options: ['should take','should be taken','should took','should taking'], answer: 1 },
  { q: 'The house ___ at the moment.', options: ['paint','paints','is being painted','painted'], answer: 2 },
  { q: 'The results ___ tomorrow.', options: ['announce','announces','will be announced','announced'], answer: 2 },
  { q: 'The email ___ yesterday.', options: ['receive','receives','was received','received'], answer: 2 },
  { q: 'The meeting ___ next Monday.', options: ['hold','holds','will be held','held'], answer: 2 },
  { q: 'The film ___ by millions.', options: ['see','sees','has been watched','saw'], answer: 2 },
  { q: 'The book ___ before the deadline.', options: ['should return','should be returned','should returned','should returning'], answer: 1 },
  { q: 'The road ___ last month.', options: ['repair','repairs','was repaired','repaired'], answer: 2 },
  { q: 'The decision ___ by the manager.', options: ['make','makes','was made','maked'], answer: 2 },
  { q: 'The building ___ next year.', options: ['demolish','demolishes','will be demolished','demolished'], answer: 2 },
  { q: 'The winner ___ yesterday.', options: ['announce','announces','was announced','announced'], answer: 2 },
  { q: 'The project ___ by the team.', options: ['complete','completes','has been completed','completed'], answer: 2 },

  /* REPORTED SPEECH */
  { q: 'He said he ___ tired.', options: ['is','was','has','had'], answer: 1 },
  { q: 'She said she ___ busy.', options: ['is','was','has','had'], answer: 1 },
  { q: 'They said they ___ coming.', options: ['is','are','were','had'], answer: 2 },
  { q: 'He told me he ___ the movie.', options: ['see','saw','had seen','sees'], answer: 2 },
  { q: 'She said she ___ call me later.', options: ['will','would','can','may'], answer: 1 },
  { q: 'He asked if I ___ ready.', options: ['am','was','been','be'], answer: 1 },
  { q: 'She asked where I ___ .', options: ['live','lives','lived','living'], answer: 2 },
  { q: 'He asked what I ___ doing.', options: ['is','are','was','were'], answer: 2 },
  { q: 'They said they ___ arrive soon.', options: ['will','would','can','may'], answer: 1 },
  { q: 'She said she ___ been waiting.', options: ['has','had','have','was'], answer: 1 },
  { q: 'He told me to ___ quiet.', options: ['be','is','was','being'], answer: 0 },
  { q: 'She asked me ___ help her.', options: ['for','to','at','in'], answer: 1 },
  { q: 'He said he ___ finish by Friday.', options: ['will','would','can','may'], answer: 1 },
  { q: 'She said she ___ the book.', options: ['read','reads','had read','reading'], answer: 2 },
  { q: 'He asked if I ___ ever been to Paris.', options: ['have','has','had','having'], answer: 2 },
  { q: "She said she ___ like coffee.", options: ["don't",'doesn\'t','didn\'t','not'], answer: 2 },
  { q: 'He told me he ___ working.', options: ['is','was','has','had'], answer: 1 },
  { q: 'They said they ___ leaving soon.', options: ['is','are','were','had'], answer: 2 },
  { q: 'She asked when I ___ come.', options: ['will','would','can','may'], answer: 1 },
  { q: 'He said he ___ been there before.', options: ['has','had','have','was'], answer: 1 },
  { q: "She said she ___ seen him.", options: ["hasn't",'haven\'t','hadn\'t','not'], answer: 2 },
  { q: 'He asked me ___ I could help.', options: ['if','that','what','which'], answer: 0 },
  { q: 'She wanted to know ___ I was free.', options: ['that','if','what','which'], answer: 1 },
  { q: 'He said he ___ back soon.', options: ['will be','would be','was','is'], answer: 1 },
  { q: 'She said she ___ cooking.', options: ['is','was','has','had'], answer: 1 },
  { q: 'He asked where the station ___ .', options: ['is','was','has','had'], answer: 1 },
  { q: 'She said she ___ the news.', options: ['hear','hears','had heard','hearing'], answer: 2 },
  { q: "He told me he ___ come.", options: ["can't",'couldn\'t','cannot','not'], answer: 1 },
  { q: 'She asked me ___ to help.', options: ['if','whether','that','which'], answer: 1 },
  { q: 'He said he ___ finished.', options: ['has','had','have','was'], answer: 1 },

  /* RELATIVE CLAUSES */
  { q: 'The man ___ lives here is my uncle.', options: ['which','who','whose','whom'], answer: 1 },
  { q: 'The book ___ I bought is interesting.', options: ['who','which','whose','whom'], answer: 1 },
  { q: 'The girl ___ hair is long is my sister.', options: ['who','which','whose','whom'], answer: 2 },
  { q: 'This is the place ___ we met.', options: ['which','who','where','when'], answer: 2 },
  { q: 'I know a man ___ can help you.', options: ['which','who','whose','whom'], answer: 1 },
  { q: 'The car ___ he bought is red.', options: ['who','which','whose','whom'], answer: 1 },
  { q: 'The boy ___ won the race is my friend.', options: ['which','who','whose','whom'], answer: 1 },
  { q: 'The reason ___ he left is unknown.', options: ['which','who','where','why'], answer: 3 },
  { q: 'The time ___ we met was lovely.', options: ['which','when','where','why'], answer: 1 },
  { q: 'This is the house ___ I was born.', options: ['which','when','where','why'], answer: 2 },
  { q: 'The dog ___ is barking belongs to him.', options: ['who','which','whose','whom'], answer: 1 },
  { q: 'The teacher ___ taught us is retiring.', options: ['which','who','whose','whom'], answer: 1 },
  { q: "She's the person ___ I trust most.", options: ['which','who','whose','whom'], answer: 1 },
  { q: 'The film ___ we watched was boring.', options: ['who','that','whose','whom'], answer: 1 },
  { q: 'The city ___ I live is beautiful.', options: ['which','who','where','when'], answer: 2 },
  { q: "He's the boy ___ I told you about.", options: ['which','who','whose','whom'], answer: 3 },
  { q: 'The reason ___ she was late is unclear.', options: ['which','who','where','why'], answer: 3 },
  { q: 'The day ___ we met was sunny.', options: ['which','when','where','why'], answer: 1 },
  { q: "There's the man ___ car was stolen.", options: ['who','which','whose','whom'], answer: 2 },
  { q: 'This is the book ___ changed my life.', options: ['who','that','whose','whom'], answer: 1 },
  { q: "He's the teacher ___ everyone likes.", options: ['which','who','whose','whom'], answer: 1 },
  { q: 'The place ___ we stayed was nice.', options: ['which','when','where','why'], answer: 2 },
  { q: 'The thing ___ surprised me was his answer.', options: ['who','that','whose','whom'], answer: 1 },
  { q: 'I know a girl ___ speaks five languages.', options: ['which','who','whose','whom'], answer: 1 },
  { q: 'The house ___ they built is huge.', options: ['who','which','whose','whom'], answer: 1 },
  { q: 'The student ___ answers were correct won.', options: ['who','which','whose','whom'], answer: 2 },
  { q: 'This is the reason ___ I called.', options: ['which','who','where','why'], answer: 3 },
  { q: 'The moment ___ I saw her, I knew.', options: ['which','who','where','that'], answer: 3 },
  { q: 'The man ___ I spoke to was helpful.', options: ['which','who','whose','whom'], answer: 3 },
  { q: 'The dog ___ tail is short is mine.', options: ['who','which','whose','whom'], answer: 2 },

  /* COMPARATIVES */
  { q: 'She is ___ than her sister.', options: ['tall','taller','tallest','more tall'], answer: 1 },
  { q: 'This is the ___ book I have ever read.', options: ['good','better','best','more good'], answer: 2 },
  { q: 'My car is ___ than yours.', options: ['fast','faster','fastest','more fast'], answer: 1 },
  { q: 'He is the ___ student in class.', options: ['smart','smarter','smartest','more smart'], answer: 2 },
  { q: 'This test is ___ than the last one.', options: ['easy','easier','easiest','more easy'], answer: 1 },
  { q: 'It is the ___ film I have seen.', options: ['bad','worse','worst','more bad'], answer: 2 },
  { q: 'She speaks ___ than me.', options: ['fluent','more fluent','more fluently','most fluently'], answer: 2 },
  { q: 'He runs ___ than his brother.', options: ['fast','faster','fastest','more fast'], answer: 1 },
  { q: 'This is ___ interesting than that.', options: ['much','more','most','very'], answer: 1 },
  { q: 'She is the ___ of the two.', options: ['tall','taller','tallest','more tall'], answer: 1 },
  { q: 'Today is ___ than yesterday.', options: ['hot','hotter','hottest','more hot'], answer: 1 },
  { q: 'This is the ___ expensive item.', options: ['much','more','most','very'], answer: 2 },
  { q: 'He is ___ than he looks.', options: ['old','older','oldest','more old'], answer: 1 },
  { q: 'The ___ I study, the ___ I learn.', options: ['more / more','most / most','much / much','many / many'], answer: 0 },
  { q: "She's not ___ tall as her mother.", options: ['as','so','than','that'], answer: 0 },
  { q: 'This is ___ good as that.', options: ['as','so','than','that'], answer: 0 },
  { q: "He's the ___ person I know.", options: ['kind','kinder','kindest','more kind'], answer: 2 },
  { q: 'Winter is ___ than summer.', options: ['cold','colder','coldest','more cold'], answer: 1 },
  { q: 'Her English is getting ___ .', options: ['good','better','best','more good'], answer: 1 },
  { q: 'She is ___ beautiful girl in school.', options: ['the most','more','much','very'], answer: 0 },
  { q: 'He is ___ than his friends.', options: ['tall','taller','tallest','more tall'], answer: 1 },
  { q: 'This problem is ___ difficult.', options: ['much','more','most','very'], answer: 1 },
  { q: 'Tokyo is ___ than Osaka.', options: ['big','bigger','biggest','more big'], answer: 1 },
  { q: 'The weather is ___ today.', options: ['bad','worse','worst','more bad'], answer: 1 },
  { q: 'She sings ___ than anyone.', options: ['good','better','best','more good'], answer: 1 },
  { q: 'This is ___ restaurant in town.', options: ['the best','better','best','more good'], answer: 0 },
  { q: "He's ___ man I have met.", options: ['the kindest','kinder','kindest','more kind'], answer: 0 },
  { q: 'My sister is ___ than me.', options: ['young','younger','youngest','more young'], answer: 1 },
  { q: 'It was ___ day of my life.', options: ['the happiest','happier','happiest','more happy'], answer: 0 },
  { q: 'This book is ___ interesting one.', options: ['the most','more','much','very'], answer: 0 },

  /* SYNONYMS */
  { q: 'Happy means ___.', options: ['sad','joyful','angry','tired'], answer: 1 },
  { q: 'Angry means ___.', options: ['furious','happy','calm','sad'], answer: 0 },
  { q: 'Big means ___.', options: ['small','large','tiny','narrow'], answer: 1 },
  { q: 'Small means ___.', options: ['huge','tiny','wide','tall'], answer: 1 },
  { q: 'Beautiful means ___.', options: ['ugly','pretty','plain','ordinary'], answer: 1 },
  { q: 'Smart means ___.', options: ['stupid','clever','slow','dull'], answer: 1 },
  { q: 'Fast means ___.', options: ['slow','quick','late','steady'], answer: 1 },
  { q: 'Sad means ___.', options: ['happy','unhappy','glad','cheerful'], answer: 1 },
  { q: 'Cold means ___.', options: ['hot','chilly','warm','mild'], answer: 1 },
  { q: 'Hot means ___.', options: ['cold','warm','freezing','chilly'], answer: 1 },
  { q: 'Difficult means ___.', options: ['easy','hard','simple','light'], answer: 1 },
  { q: 'Easy means ___.', options: ['hard','simple','tough','complex'], answer: 1 },
  { q: 'Begin means ___.', options: ['end','start','finish','stop'], answer: 1 },
  { q: 'End means ___.', options: ['start','finish','begin','open'], answer: 1 },
  { q: 'Buy means ___.', options: ['sell','purchase','trade','barter'], answer: 1 },
  { q: 'Say means ___.', options: ['state','ask','hear','listen'], answer: 0 },
  { q: 'Ask means ___.', options: ['answer','inquire','tell','say'], answer: 1 },
  { q: 'Help means ___.', options: ['harm','assist','hinder','block'], answer: 1 },
  { q: 'Show means ___.', options: ['hide','display','cover','conceal'], answer: 1 },
  { q: 'Choose means ___.', options: ['reject','select','refuse','ignore'], answer: 1 },
  { q: 'Common means ___.', options: ['rare','usual','odd','unique'], answer: 1 },
  { q: 'Rare means ___.', options: ['common','uncommon','usual','typical'], answer: 1 },
  { q: 'Rich means ___.', options: ['poor','wealthy','needy','broke'], answer: 1 },
  { q: 'Poor means ___.', options: ['rich','needy','wealthy','affluent'], answer: 1 },
  { q: 'Brave means ___.', options: ['afraid','courageous','timid','weak'], answer: 1 },
  { q: 'Funny means ___.', options: ['serious','amusing','boring','dull'], answer: 1 },
  { q: 'Quiet means ___.', options: ['loud','silent','noisy','rowdy'], answer: 1 },
  { q: 'Loud means ___.', options: ['silent','noisy','quiet','soft'], answer: 1 },
  { q: 'Strange means ___.', options: ['normal','odd','usual','common'], answer: 1 },
  { q: 'Correct means ___.', options: ['wrong','right','false','bad'], answer: 1 },

  /* ANTONYMS */
  { q: 'Hot is the opposite of ___.', options: ['warm','cold','mild','wet'], answer: 1 },
  { q: 'Big is the opposite of ___.', options: ['huge','small','tall','wide'], answer: 1 },
  { q: 'Fast is the opposite of ___.', options: ['quick','slow','rapid','swift'], answer: 1 },
  { q: 'Happy is the opposite of ___.', options: ['glad','sad','joyful','cheerful'], answer: 1 },
  { q: 'Rich is the opposite of ___.', options: ['wealthy','poor','affluent','loaded'], answer: 1 },
  { q: 'Early is the opposite of ___.', options: ['soon','late','quick','fast'], answer: 1 },
  { q: 'Light is the opposite of ___.', options: ['bright','heavy','clear','pale'], answer: 1 },
  { q: 'Up is the opposite of ___.', options: ['above','down','over','high'], answer: 1 },
  { q: 'Open is the opposite of ___.', options: ['wide','closed','free','clear'], answer: 1 },
  { q: 'Full is the opposite of ___.', options: ['packed','empty','loaded','filled'], answer: 1 },
  { q: 'Yes is the opposite of ___.', options: ['yeah','no','ok','sure'], answer: 1 },
  { q: 'Friend is the opposite of ___.', options: ['ally','enemy','mate','pal'], answer: 1 },
  { q: 'Win is the opposite of ___.', options: ['beat','lose','triumph','succeed'], answer: 1 },
  { q: 'Begin is the opposite of ___.', options: ['start','end','open','launch'], answer: 1 },
  { q: 'High is the opposite of ___.', options: ['tall','low','above','over'], answer: 1 },
  { q: 'Clean is the opposite of ___.', options: ['neat','dirty','tidy','pure'], answer: 1 },
  { q: 'Straight is the opposite of ___.', options: ['direct','curved','linear','flat'], answer: 1 },
  { q: 'True is the opposite of ___.', options: ['right','false','real','factual'], answer: 1 },
  { q: 'Safe is the opposite of ___.', options: ['secure','dangerous','protected','sound'], answer: 1 },
  { q: 'Weak is the opposite of ___.', options: ['frail','strong','fragile','feeble'], answer: 1 },
  { q: 'Ancient is the opposite of ___.', options: ['old','modern','antique','aged'], answer: 1 },
  { q: 'Ordinary is the opposite of ___.', options: ['usual','unusual','common','plain'], answer: 1 },
  { q: 'Generous is the opposite of ___.', options: ['giving','stingy','kind','open'], answer: 1 },
  { q: 'Public is the opposite of ___.', options: ['open','private','shared','common'], answer: 1 },
  { q: 'Similar is the opposite of ___.', options: ['alike','different','same','close'], answer: 1 },

  /* PHRASAL VERBS */
  { q: 'Please ___ your shoes before entering.', options: ['take off','take on','take in','take up'], answer: 0 },
  { q: 'The plane will ___ at 6 AM.', options: ['take off','take on','take in','take up'], answer: 0 },
  { q: 'I need to ___ my homework.', options: ['hand in','hand out','hand off','hand over'], answer: 0 },
  { q: "Let's ___ the meeting until tomorrow.", options: ['put off','put on','put in','put up'], answer: 0 },
  { q: 'She ___ her mother.', options: ['takes after','takes on','takes in','takes up'], answer: 0 },
  { q: 'He ___ smoking last year.', options: ['gave up','gave in','gave out','gave away'], answer: 0 },
  { q: 'Can you ___ the light?', options: ['turn on','turn off','turn up','turn down'], answer: 0 },
  { q: 'Please ___ the music.', options: ['turn on','turn off','turn up','turn down'], answer: 3 },
  { q: 'She ___ with her friend.', options: ['fell out','fell in','fell off','fell on'], answer: 0 },
  { q: 'He ___ his plan.', options: ['carried out','carried on','carried off','carried in'], answer: 0 },
  { q: 'Look ___ the new word in the dictionary.', options: ['up','down','in','on'], answer: 0 },
  { q: 'I ___ my old friend yesterday.', options: ['ran into','ran off','ran out','ran over'], answer: 0 },
  { q: 'Please ___ the form.', options: ['fill in','fill up','fill on','fill off'], answer: 0 },
  { q: 'He ___ his promise.', options: ['broke','broke in','broke out','broke up'], answer: 0 },
  { q: "Let's ___ this problem.", options: ['deal with','deal in','deal on','deal off'], answer: 0 },
  { q: 'She ___ a new hobby.', options: ['took up','took off','took in','took on'], answer: 0 },
  { q: 'He ___ smoking.', options: ['cut down on','cut off','cut in','cut up'], answer: 0 },
  { q: 'The meeting was ___ until next week.', options: ['put off','put on','put in','put up'], answer: 0 },
  { q: "I can't ___ this noise anymore.", options: ['put up with','put on with','put in with','put off with'], answer: 0 },
  { q: 'She ___ the truth eventually.', options: ['found out','found in','found on','found up'], answer: 0 },
  { q: 'I ___ at 6 AM every day.', options: ['get up','get on','get in','get off'], answer: 0 },
  { q: "Let's ___ the weekend.", options: ['look forward to','look after','look into','look up'], answer: 0 },
  { q: 'He ___ his father.', options: ['looks up to','looks after','looks into','looks for'], answer: 0 },
  { q: 'She ___ the exam.', options: ['got through','got in','got on','got off'], answer: 0 },
  { q: 'They ___ at the party.', options: ['showed up','showed in','showed off','showed on'], answer: 0 },
  { q: 'He ___ the book yesterday.', options: ['gave back','gave in','gave out','gave away'], answer: 0 },
  { q: "I'll ___ you at the airport.", options: ['pick up','pick in','pick on','pick off'], answer: 0 },
  { q: 'The car ___ .', options: ['broke down','broke in','broke up','broke out'], answer: 0 },
  { q: 'She ___ with an idea.', options: ['came up','came in','came on','came off'], answer: 0 },
  { q: "Let's ___ the details.", options: ['go over','go in','go on','go off'], answer: 0 },

  /* COLLOCATIONS */
  { q: '___ a decision.', options: ['do','make','take','get'], answer: 1 },
  { q: '___ a mistake.', options: ['do','make','take','get'], answer: 1 },
  { q: '___ a photo.', options: ['do','make','take','get'], answer: 2 },
  { q: '___ a shower.', options: ['do','make','take','get'], answer: 2 },
  { q: '___ a nap.', options: ['do','make','take','get'], answer: 2 },
  { q: '___ a break.', options: ['do','make','take','get'], answer: 2 },
  { q: '___ attention.', options: ['do','make','pay','get'], answer: 2 },
  { q: '___ a promise.', options: ['do','make','take','get'], answer: 1 },
  { q: '___ a difference.', options: ['do','make','take','get'], answer: 1 },
  { q: '___ breakfast.', options: ['do','make','have','get'], answer: 2 },
  { q: '___ a headache.', options: ['do','have','make','get'], answer: 1 },
  { q: '___ a cold.', options: ['do','make','catch','get'], answer: 2 },
  { q: '___ a taxi.', options: ['do','make','take','get'], answer: 2 },
  { q: '___ a risk.', options: ['do','make','take','get'], answer: 2 },
  { q: '___ a joke.', options: ['do','make','tell','say'], answer: 2 },
  { q: '___ the truth.', options: ['do','make','tell','say'], answer: 2 },
  { q: '___ a lie.', options: ['do','make','tell','say'], answer: 2 },
  { q: '___ money.', options: ['do','save','take','get'], answer: 1 },
  { q: '___ an exam.', options: ['do','make','take','get'], answer: 2 },
  { q: '___ the piano.', options: ['do','make','play','get'], answer: 2 },
  { q: '___ homework.', options: ['do','make','take','get'], answer: 0 },
  { q: '___ the dishes.', options: ['do','make','take','get'], answer: 0 },
  { q: '___ a phone call.', options: ['do','make','take','get'], answer: 1 },
  { q: '___ a seat.', options: ['do','make','take','get'], answer: 2 },
  { q: '___ a walk.', options: ['do','make','take','get'], answer: 2 },

  /* IDIOMS */
  { q: 'Break the ice means ___.', options: ['start a conversation','end a party','start a fight','break something'], answer: 0 },
  { q: 'Hit the nail on the head means ___.', options: ['be exactly right','be wrong','miss a chance','get angry'], answer: 0 },
  { q: 'Piece of cake means ___.', options: ['very easy','very hard','very tasty','very big'], answer: 0 },
  { q: 'Under the weather means ___.', options: ['feeling sick','outside','under a roof','feeling great'], answer: 0 },
  { q: 'Once in a blue moon means ___.', options: ['very often','very rarely','every day','never'], answer: 1 },
  { q: 'Bite the bullet means ___.', options: ['face something difficult','eat fast','get angry','run away'], answer: 0 },
  { q: 'Cost an arm and a leg means ___.', options: ['be very cheap','be very expensive','hurt someone','be generous'], answer: 1 },
  { q: 'Let the cat out of the bag means ___.', options: ['buy a cat','reveal a secret','keep a secret','feed a pet'], answer: 1 },
  { q: "It's raining cats and dogs means ___.", options: ['raining lightly','raining heavily','not raining','petting animals'], answer: 1 },
  { q: 'Break a leg means ___.', options: ['get injured','good luck','run fast','be angry'], answer: 1 },
  { q: 'On cloud nine means ___.', options: ['very sad','extremely happy','very tired','very angry'], answer: 1 },
  { q: 'See eye to eye means ___.', options: ['look at someone','agree','disagree','be blind'], answer: 1 },
  { q: 'Kill two birds with one stone means ___.', options: ['hurt animals','accomplish two things at once','waste time','cook food'], answer: 1 },
  { q: 'A blessing in disguise means ___.', options: ['a hidden benefit','a curse','a costume','a prayer'], answer: 0 },
  { q: 'Beat around the bush means ___.', options: ['go hiking','avoid the topic','garden','be direct'], answer: 1 },
  { q: "Pull someone's leg means ___.", options: ['hurt someone','joke with someone','help someone','push someone'], answer: 1 },
  { q: 'Call it a day means ___.', options: ['stop working','name a day','start a day','celebrate'], answer: 0 },
  { q: 'Get cold feet means ___.', options: ['become nervous','feel cold','buy shoes','walk slowly'], answer: 0 },
  { q: 'Miss the boat means ___.', options: ['miss an opportunity','miss a trip','fall in water','be on time'], answer: 0 },
  { q: 'Once bitten twice shy means ___.', options: ['be cautious after bad experience','love twice','bite again','be brave'], answer: 0 },

  /* WORD FORMATION */
  { q: 'She is a ___ (beauty) woman.', options: ['beauty','beautiful','beautify','beautifully'], answer: 1 },
  { q: 'His ___ (decide) surprised everyone.', options: ['decide','decisive','decision','decidedly'], answer: 2 },
  { q: 'She sings ___ (beauty).', options: ['beauty','beautiful','beautify','beautifully'], answer: 3 },
  { q: 'It was a ___ (danger) situation.', options: ['danger','dangerous','dangerously','endanger'], answer: 1 },
  { q: 'He is a ___ (success) businessman.', options: ['success','successful','successfully','succeed'], answer: 1 },
  { q: 'Her ___ (kind) touched us.', options: ['kind','kindly','kindness','kinder'], answer: 2 },
  { q: 'They live ___ (happy).', options: ['happy','happily','happiness','happier'], answer: 1 },
  { q: 'He is very ___ (create).', options: ['create','creation','creative','creatively'], answer: 2 },
  { q: 'Her ___ (achieve) is impressive.', options: ['achieve','achievement','achievable','achieved'], answer: 1 },
  { q: 'He acted ___ (brave).', options: ['brave','bravery','bravely','braver'], answer: 2 },
  { q: 'This is a ___ (mystery) case.', options: ['mystery','mysterious','mysteriously','mystify'], answer: 1 },
  { q: 'His ___ (explain) was clear.', options: ['explain','explanation','explanatory','explained'], answer: 1 },
  { q: 'She has a ___ (power) voice.', options: ['power','powerful','powerfully','powerless'], answer: 1 },
  { q: 'The ___ (perform) was amazing.', options: ['perform','performer','performance','performing'], answer: 2 },
  { q: 'He is a ___ (talent) musician.', options: ['talent','talented','talentless','talentedly'], answer: 1 },
  { q: 'Her ___ (move) was graceful.', options: ['move','movement','moving','moved'], answer: 1 },
  { q: 'This is a ___ (peace) place.', options: ['peace','peaceful','peacefully','peacemaker'], answer: 1 },
  { q: 'His ___ (argue) was convincing.', options: ['argue','argument','arguable','arguably'], answer: 1 },
  { q: 'She answered ___ (quick).', options: ['quick','quickness','quickly','quicken'], answer: 2 },
  { q: 'His ___ (improve) is noticeable.', options: ['improve','improvement','improved','improving'], answer: 1 },

  /* CONJUNCTIONS */
  { q: 'I like tea ___ coffee.', options: ['and','but','or','so'], answer: 0 },
  { q: "She's tired ___ happy.", options: ['and','but','or','so'], answer: 1 },
  { q: 'Would you like tea ___ coffee?', options: ['and','but','or','so'], answer: 2 },
  { q: "He's smart ___ lazy.", options: ['and','but','or','so'], answer: 1 },
  { q: 'I stayed home ___ it was raining.', options: ['because','although','unless','so'], answer: 0 },
  { q: '___ it was raining, we went out.', options: ['Because','Although','Unless','So'], answer: 1 },
  { q: "I'll wait ___ you come.", options: ['because','although','until','so'], answer: 2 },
  { q: 'She came ___ she was invited.', options: ['because','although','unless','so'], answer: 0 },
  { q: "___ he's young, he's very mature.", options: ['Because','Although','Unless','So'], answer: 1 },
  { q: "I'll go ___ you go.", options: ['because','although','where','unless'], answer: 2 },
  { q: 'She stayed ___ everyone left.', options: ['because','although','until','so'], answer: 2 },
  { q: "___ you study, you'll fail.", options: ['Because','Although','Unless','So'], answer: 2 },
  { q: 'He works hard ___ he wants to succeed.', options: ['because','although','unless','so'], answer: 0 },
  { q: "I'll help ___ I can.", options: ['because','although','if','so'], answer: 2 },
  { q: 'She speaks ___ English ___ French.', options: ['both...and','either...or','neither...nor','not only...but also'], answer: 0 },
  { q: '___ Tom ___ Mary came to the party.', options: ['Both...and','Either...or','Neither...nor','Not only...but also'], answer: 2 },
  { q: 'You can have ___ cake ___ ice cream.', options: ['both...and','either...or','neither...nor','not only...but also'], answer: 1 },
  { q: "He's ___ intelligent ___ hardworking.", options: ['both...and','either...or','neither...nor','not only...but also'], answer: 0 },
  { q: "She's not ___ clever ___ her sister.", options: ['as...as','so...as','too...to','enough...to'], answer: 0 },
  { q: "I'll call you ___ I arrive.", options: ['because','although','when','unless'], answer: 2 },
];

/* ============================================================
   EXAM SETS
   ============================================================ */
function buildExamSets() {
  const sets = [];
  for (let i = 0; i < MOCK_QUESTIONS.length; i += EXAM_SET_SIZE) {
    sets.push(MOCK_QUESTIONS.slice(i, i + EXAM_SET_SIZE));
  }
  return sets;
}
const EXAM_SETS = buildExamSets();

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
    if (document.querySelector(`script[data-src="${src}"]`)) { resolve(); return; }
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

  const [examSetIndex, setExamSetIndex] = useState(0);

  useEffect(() => {
    liveRoomsApi.upcoming()
      .then((list) => {
        setRooms(Array.isArray(list) && list.length > 0 ? list : FALLBACK_ROOMS);
      })
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
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Could not reach the Zoom service';
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

  const joinLiveClassFromLobby = () => { if (activeRoom) joinLiveClass(activeRoom); };
  const startExam = (room) => { setActiveRoom(room); setView('exam'); };
  const confirmGuestJoin = () => {
    if (!guestName || !guestEmail || !activeRoom) return;
    liveRoomsApi.join(activeRoom.id, { name: guestName, email: guestEmail }).catch(() => {});
    setJoined(true);
  };
  const leaveAll = () => {
    setView('list'); setActiveRoom(null); setJoined(false); setGuestName(''); setGuestEmail('');
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

  if (zoomInfo) return <ZoomEmbedView info={zoomInfo} onExit={() => setZoomInfo(null)} />;
  if (view === 'class' && activeRoom) return <LiveClassView room={activeRoom} onLeave={() => setView('list')} />;
  if (view === 'exam' && activeRoom) {
    return (
      <ExamView
        key={examSetIndex}
        room={activeRoom}
        setIndex={examSetIndex}
        totalSets={EXAM_SETS.length}
        onExit={() => setView('list')}
        onNextSet={() => setExamSetIndex((i) => (i + 1) % EXAM_SETS.length)}
      />
    );
  }

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
                <button className="ec-live-btn ec-live-btn--primary" onClick={joinLiveClassFromLobby} disabled={!!connectingRoom}>
                  <IcoCamOn /> Join Live Class
                </button>
                <button className="ec-live-btn ec-live-btn--lime" onClick={() => setView('exam')}>
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

        {connectingRoom && <ConnectingOverlay room={connectingRoom} error={connectError} />}
      </>
    );
  }

  return (
    <>
      <style>{LIVE_CSS}</style>

      <div className="ec-live-hero ec-live-anim">
        <div className="ec-live-hero-orb" aria-hidden="true" />
        <div className="ec-live-hero-copy">
          <span className="ec-live-hero-badge">
            <span className="ec-live-dot" />
            Live exam rooms
          </span>
          <h1>Join a <em>live</em> session and level up faster</h1>
          <p>Synchronized mocks, live Zoom classes, and auto-scored exams — all in one place. Up to 100 participants per room.</p>
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

      <div className="ec-live-tabs" role="tablist">
        {[
          { id: 'all',      label: 'All rooms', icon: <Icon name="grid" /> },
          { id: 'live',     label: 'Live now',  icon: <IcoCamOn />,  count: liveCount },
          { id: 'upcoming', label: 'Upcoming',  icon: <IcoClock />,  count: upcomingCount },
        ].map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id}
            className={`ec-live-tab${tab === t.id ? ' ec-live-tab--active' : ''}`}
            onClick={() => setTab(t.id)}>
            {t.icon}{t.label}{t.count != null && <span className="ec-live-tab-count">{t.count}</span>}
          </button>
        ))}
      </div>

      <div className="ec-live-list">
        {visibleRooms.length === 0 ? (
          <div className="ec-lobby-card" style={{ textAlign: 'center', padding: '52px 24px', color: 'var(--lang-ink-soft)', borderStyle: 'dashed' }}>
            No rooms in this tab yet.
          </div>
        ) : (
          visibleRooms.map((r, i) => {
            const pct = Math.min(100, Math.max(0, Math.round(((r.joined ?? 0) / Math.max(1, r.seats ?? 1)) * 100)));
            const almostFull = pct > 80;
            return (
              <div key={r.id} className="ec-live-card" style={{ animationDelay: `${0.1 + i * 0.08}s` }}>
                <div className="ec-live-card-top">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="ec-live-title">{r.title}</p>
                    <div className="ec-live-chips">
                      {r.live ? (
                        <span className="ec-live-badge ec-live-badge--live"><span className="ec-live-dot" />Live now</span>
                      ) : (
                        <span className={`ec-live-badge${almostFull ? '' : ' ec-live-badge--soon'}`}>
                          <span className="ec-live-dot" />Starts in {r.startsIn}
                        </span>
                      )}
                      <span className="ec-live-chip">{r.level}</span>
                      {r.meetLink && (
                        <span className="ec-live-chip ec-live-chip--zoom">
                          <IcoCamOn /> {r.meetProvider === 'zoom' ? 'Zoom' : r.meetProvider === 'teams' ? 'Teams' : 'Google Meet'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="ec-live-fill-row">
                  <div className="ec-live-fill-bar"><div className="ec-live-fill" style={{ width: `${pct}%` }} /></div>
                  <span className="ec-live-fill-pct">{r.joined ?? 0}/{r.seats ?? 0}</span>
                </div>
                <div className="ec-live-card-meta">
                  <span><Icon name="users" /> {(r.seats ?? 0) - (r.joined ?? 0)} seats left</span>
                  <span><Icon name="calendar" /> {r.duration ?? r.durationMins ?? 60} min</span>
                  <span><Icon name="target" /> Auto-scored</span>
                </div>
                <div className="ec-live-sep" />
                <div className="ec-live-actions">
                  {r.meetLink ? (
                    <a href={r.meetLink} target="_blank" rel="noopener noreferrer" className="ec-live-btn ec-live-btn--zoom">
                      <IcoCamOn />Join on {r.meetProvider === 'zoom' ? 'Zoom' : r.meetProvider === 'teams' ? 'Teams' : 'Google Meet'}
                    </a>
                  ) : (
                    <button className="ec-live-btn ec-live-btn--primary" onClick={() => joinLiveClass(r)} disabled={!!connectingRoom}>
                      <IcoCamOn />{connectingRoom?.id === r.id ? 'Connecting…' : 'Join Live Class'}
                    </button>
                  )}
                  <button className="ec-live-btn ec-live-btn--lime" onClick={() => openLobby(r)}>
                    <IcoUsers /> Lobby
                  </button>
                  <button className="ec-live-btn ec-live-btn--ghost" onClick={() => startExam(r)}>
                    <IcoPlay /> Take Exam
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {connectingRoom && <ConnectingOverlay room={connectingRoom} error={connectError} />}
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
            <p className="ec-connect-sub">Preparing your secure session for<br /><strong style={{ color: 'var(--lang-ink)' }}>{room.title}</strong></p>
          </>
        ) : (
          <>
            <div className="ec-connect-spinner" style={{ borderTopColor: '#FF8FCB' }} />
            <h3 className="ec-connect-title">Couldn’t reach Zoom</h3>
            <p className="ec-connect-sub">Falling back to the in-app class…</p>
            <div className="ec-connect-error"><IcoWarn /><span>{error}</span></div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

/* ============================================================
   ZOOM EMBED
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
        const client = zoom.createClient ? zoom.createClient() : new zoom.ZoomMtg();
        clientRef.current = client;
        await client.init({
          zoomAppRoot: containerRef.current,
          language: 'en-US',
          customize: { video: { isResizable: true, viewSizes: { default: { width: 1000, height: 600 } } } },
        });
        if (cancelled) return;
        await client.join({
          sdkKey: info.sdkKey, signature: info.signature,
          meetingNumber: info.meetingNumber, password: info.password,
          userName: info.userName, userEmail: info.userEmail, tk: '',
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
      try { clientRef.current?.leaveMeeting?.(); } catch {}
      try { clientRef.current?.destroy?.(); } catch {}
    };
  }, [info]);

  const openZoomApp = () => {
    const url = `zoommtg://zoom.us/join?action=join&confno=${encodeURIComponent(info.meetingNumber)}${info.password ? `&pwd=${encodeURIComponent(info.password)}` : ''}&uname=${encodeURIComponent(info.userName)}`;
    openInNewTab(url);
  };
  const openWebFallback = () => { if (info.joinUrl) openInNewTab(info.joinUrl); };

  return (
    <div className="ec-zoom-embed">
      <style>{LIVE_CSS}</style>
      <div className="ec-zoom-embed-bar">
        <div className="ec-zoom-embed-bar-left">
          <span className="ec-class-rec"><span className="ec-class-rec-dot" />Zoom</span>
          <span className="ec-zoom-embed-bar-title">{info.room.title}</span>
          <span className="ec-zoom-embed-bar-sub">Meeting · {info.meetingNumber}</span>
        </div>
        <div className="ec-zoom-embed-bar-right">
          {info.joinUrl && <button className="ec-zoom-embed-btn" onClick={openWebFallback}><IcoExternal /> Browser</button>}
          <button className="ec-zoom-embed-btn" onClick={openZoomApp}><IcoCamOn /> Desktop app</button>
          <button className="ec-zoom-embed-btn ec-zoom-embed-btn--danger" onClick={onExit}><IcoClose /> Leave</button>
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
            <p>{error}<br />You can still join using your browser or the Zoom desktop app.</p>
            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              {info.joinUrl && <button className="ec-live-btn ec-live-btn--zoom" onClick={openWebFallback}><IcoExternal /> Open in browser</button>}
              <button className="ec-live-btn ec-live-btn--ghost" onClick={openZoomApp}><IcoCamOn /> Open Zoom app</button>
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

  useEffect(() => { const t = setInterval(() => setElapsed((s) => s + 1), 1000); return () => clearInterval(t); }, []);

  useEffect(() => {
    let timer;
    const reset = () => { setIdle(false); clearTimeout(timer); timer = setTimeout(() => setIdle(true), 3500); };
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

  const participants = CLASS_PARTICIPANTS.map((p) => p.self ? { ...p, mic, cam } : p);
  const visible = participants.slice(0, 6);

  return (
    <div className={`ec-class${idle ? ' ec-class--idle' : ''}`}>
      <style>{LIVE_CSS}</style>
      <div className="ec-class-top">
        <div className="ec-class-info">
          <span className="ec-class-rec"><span className="ec-class-rec-dot" />REC</span>
          <span className="ec-class-title">{room.title}</span>
          <span className="ec-class-timer"><IcoClock />{fmtTime(elapsed)}</span>
        </div>
        <div className="ec-class-top-right">
          <button className="ec-class-icon-btn" onClick={() => setChatOpen((v) => !v)} aria-label="Chat"><IcoChat /></button>
          <button className="ec-class-icon-btn" onClick={() => {
            const el = document.querySelector('.ec-class');
            if (!document.fullscreenElement) el?.requestFullscreen?.();
            else document.exitFullscreen?.();
          }} aria-label="Fullscreen"><IcoExpand /></button>
          <button className="ec-class-icon-btn" onClick={onLeave} aria-label="Leave"><IcoClose /></button>
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
        <button className={`ec-class-ctrl${mic ? '' : ' ec-class-ctrl--off'}`} onClick={() => setMic((v) => !v)} aria-label={mic ? 'Mute' : 'Unmute'}>
          {mic ? <IcoMicOn /> : <IcoMicOff />}
        </button>
        <button className={`ec-class-ctrl${cam ? '' : ' ec-class-ctrl--off'}`} onClick={() => setCam((v) => !v)} aria-label={cam ? 'Camera off' : 'Camera on'}>
          {cam ? <IcoCamOn /> : <IcoCamOff />}
        </button>
        <button className={`ec-class-ctrl${sharing ? ' ec-class-ctrl--off' : ''}`} onClick={() => setSharing((v) => !v)} aria-label="Share screen"><IcoShare /></button>
        <button className="ec-class-ctrl" onClick={() => setChatOpen((v) => !v)} aria-label="Chat"><IcoChat /></button>
        <button className="ec-class-ctrl" aria-label="Participants"><IcoUsers /></button>
        <button className="ec-class-ctrl ec-class-ctrl--end" onClick={onLeave} aria-label="Leave class">
          <IcoEnd /><span className="ec-class-ctrl-label">Leave</span>
        </button>
      </div>

      {chatOpen && (
        <div className="ec-class-chat">
          <div className="ec-class-chat-head">
            <h3>Chat</h3>
            <button className="ec-class-icon-btn" onClick={() => setChatOpen(false)} aria-label="Close chat"><IcoClose /></button>
          </div>
          <div className="ec-class-chat-body">
            {messages.map((m) => (
              <div key={m.id} className="ec-class-chat-msg">
                <span className="ec-class-chat-avatar">{m.initials}</span>
                <div className="ec-class-chat-content">
                  <p className="ec-class-chat-name">{m.name} <small>{m.time}</small></p>
                  <p className={`ec-class-chat-text${m.me ? ' ec-class-chat-text--me' : ''}`}>{m.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="ec-class-chat-input-wrap">
            <input className="ec-class-chat-input" placeholder="Type a message…" value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') send(); }} />
            <button className="ec-class-chat-send" onClick={send} aria-label="Send"><IcoArrowR /></button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   EXAM VIEW — mobile-first with instant feedback
   ============================================================ */
function ExamView({ room, setIndex = 0, totalSets = 1, onExit, onNextSet }) {
  const currentSet = EXAM_SETS[setIndex] || [];
  const total = currentSet.length;

  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});       // { [qIdx]: selectedOptionIdx }
  const [revealed, setRevealed] = useState({});     // { [qIdx]: true } once user answered
  const [secondsLeft, setSecondsLeft] = useState(EXAM_SECONDS);
  const [confirming, setConfirming] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const q = currentSet[idx];
  const currentPick = answers[idx];
  const currentRevealed = !!revealed[idx];

  /* Timer */
  useEffect(() => {
    if (submitted) return;
    if (secondsLeft <= 0) { setSubmitted(true); return; }
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [secondsLeft, submitted]);

  /* Pick — lock + reveal instantly */
  const pick = (i) => {
    if (currentRevealed) return;
    setAnswers((a) => ({ ...a, [idx]: i }));
    setRevealed((r) => ({ ...r, [idx]: true }));
  };

  const next = () => setIdx((i) => Math.min(total - 1, i + 1));
  const prev = () => setIdx((i) => Math.max(0, i - 1));

  const correctCount = Object.entries(answers).filter(
    ([k, v]) => currentSet[k] && currentSet[k].answer === v
  ).length;
  const wrongCount = Object.entries(answers).filter(
    ([k, v]) => currentSet[k] && currentSet[k].answer !== v
  ).length;
  const answeredCount = Object.keys(answers).length;
  const pct = total > 0 ? Math.round(((idx + 1) / total) * 100) : 0;

  const timerClass =
    secondsLeft <= 30 ? 'ec-exam-timer--danger'
    : secondsLeft <= 60 ? 'ec-exam-timer--warn'
    : '';

  const goNextSet = () => { if (typeof onNextSet === 'function') onNextSet(); };

  /* -----------------------------------------------------------
     RESULT SCREEN
     ----------------------------------------------------------- */
  if (submitted) {
    const score = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const emoji = score >= 80 ? '🎉' : score >= 60 ? '👍' : '💪';
    return (
      <div className="ec-exam-result">
        <style>{LIVE_CSS}</style>
        <div className="ec-exam-result-card">
          <span className="ec-exam-result-emoji">{emoji}</span>
          <h2>Exam submitted</h2>
          <p>{room.title} — Set {setIndex + 1} of {totalSets}</p>
          <div className="ec-exam-result-score">
            <div><strong>{correctCount}</strong><span>Correct</span></div>
            <div><strong>{wrongCount}</strong><span>Wrong</span></div>
            <div><strong>{score}%</strong><span>Score</span></div>
          </div>
          <div className="ec-exam-modal-actions">
            <button className="ghost" onClick={onExit}>Back to rooms</button>
            <button className="primary" onClick={goNextSet}>Next set →</button>
          </div>
        </div>
      </div>
    );
  }

  /* -----------------------------------------------------------
     MAIN EXAM SCREEN
     ----------------------------------------------------------- */
  return (
    <div className="ec-exam">
      <style>{LIVE_CSS}</style>

      <div className="ec-exam-head">
        <div className="ec-exam-head-left">
          <button
            className="ec-class-icon-btn"
            onClick={onExit}
            aria-label="Exit"
            style={{ background: 'var(--lang-lime-soft)', color: 'var(--lang-ink)', border: '2px solid var(--lang-line)' }}
          >
            <IcoClose />
          </button>
          <span className="ec-exam-title">{room.title}</span>
          <span className="ec-exam-set">Set {setIndex + 1} / {totalSets}</span>
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
            <span>{answeredCount} answered · {correctCount} ✓ {wrongCount} ✗</span>
          </div>
          <div className="ec-exam-progress-bar">
            <div className="ec-exam-progress-fill" style={{ width: `${pct}%` }} />
          </div>

          {q && (
            <div className="ec-exam-q" key={idx}>
              <span className="ec-exam-q-num">Question {idx + 1}</span>
              <p className="ec-exam-q-text">{q.q}</p>

              <div className="ec-exam-options">
                {q.options.map((opt, i) => {
                  const letter = String.fromCharCode(65 + i);
                  const isCorrect = i === q.answer;
                  const isPicked = currentPick === i;
                  const showCorrect = currentRevealed && isCorrect;
                  const showWrong = currentRevealed && isPicked && !isCorrect;
                  const showFaded = currentRevealed && !isCorrect && !isPicked;

                  const cls =
                    'ec-exam-option' +
                    (showCorrect ? ' ec-exam-option--correct' : '') +
                    (showWrong   ? ' ec-exam-option--wrong'   : '') +
                    (showFaded   ? ' ec-exam-option--faded'   : '') +
                    (!currentRevealed && isPicked ? ' ec-exam-option--selected' : '');

                  return (
                    <button
                      key={i}
                      className={cls}
                      onClick={() => pick(i)}
                      disabled={currentRevealed}
                    >
                      <span className="ec-exam-option-letter">
                        {showCorrect ? <IcoCheck /> : showWrong ? <IcoCross /> : letter}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Instant feedback */}
              {currentRevealed && (
                <div className={`ec-exam-feedback ec-exam-feedback--${currentPick === q.answer ? 'correct' : 'wrong'}`}>
                  <div className="ec-exam-feedback-icon">
                    {currentPick === q.answer ? <IcoCheck /> : <IcoCross />}
                  </div>
                  <div className="ec-exam-feedback-body">
                    <p className="ec-exam-feedback-title">
                      {currentPick === q.answer ? '✓ Correct!' : '✗ Not quite'}
                    </p>
                    {currentPick !== q.answer && (
                      <p className="ec-exam-feedback-answer">
                        Correct answer: <strong>{q.options[q.answer]}</strong>
                      </p>
                    )}
                    {q.explanation ? (
                      <p className="ec-exam-feedback-explain">{q.explanation}</p>
                    ) : (
                      <p className="ec-exam-feedback-explain">
                        {currentPick === q.answer
                          ? 'Well done — keep going!'
                          : `The right answer is "${q.options[q.answer]}". Remember this pattern for next time.`}
                      </p>
                    )}
                    <span className="ec-exam-feedback-tip">
                      <IcoLight /> {idx < total - 1 ? 'Tap Next to continue' : 'Tap Submit when ready'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="ec-exam-footer">
        <div className="ec-exam-palette">
          {currentSet.map((sq, i) => {
            const answered = answers[i] != null;
            const isCorrect = answered && answers[i] === sq.answer;
            const isWrong = answered && answers[i] !== sq.answer;
            const isActive = i === idx;
            return (
              <button
                key={i}
                className={
                  'ec-exam-palette-dot' +
                  (isCorrect ? ' ec-exam-palette-dot--correct' : '') +
                  (isWrong   ? ' ec-exam-palette-dot--wrong'   : '') +
                  (isActive  ? ' ec-exam-palette-dot--active'  : '')
                }
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
            <button
              className={`ec-exam-nav-btn ${currentRevealed ? 'ec-exam-nav-btn--next-set' : 'ec-exam-nav-btn--primary'}`}
              onClick={next}
            >
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
              <div className="ec-exam-modal-stat"><strong>{correctCount}</strong><span>Correct</span></div>
              <div className="ec-exam-modal-stat"><strong>{wrongCount}</strong><span>Wrong</span></div>
            </div>
            <div className="ec-exam-modal-actions">
              <button className="ghost" onClick={() => setConfirming(false)}>Keep working</button>
              <button className="primary" onClick={() => { setConfirming(false); setSubmitted(true); }}>Submit now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LiveRooms;
