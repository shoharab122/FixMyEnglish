import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { gamificationApi } from '../api/gamification';
import { Icon } from '../components/Icon';

const PROFILE_CSS = `
/* ============================================================
   PROFILE — Langut-inspired, organised
   ============================================================ */
.ec-prof{
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
.ec-prof,
.ec-prof *{box-sizing:border-box}

/* ============================================================
   HEAD
   ============================================================ */
.ec-prof-head{margin-bottom:20px}
.ec-prof-eyebrow{
  margin:0 0 6px;font-size:11.5px;font-weight:900;
  letter-spacing:.16em;text-transform:uppercase;
  color:var(--lang-purple);opacity:.95;
}

/* ============================================================
   HERO — avatar + identity + inline stat strip
   ============================================================ */
.ec-prof-hero{
  position:relative;overflow:hidden;
  border-radius:32px;
  padding:clamp(24px,3.4vw,34px) clamp(22px,3.4vw,36px);
  color:#fff;
  background:
    radial-gradient(120% 90% at 88% 12%, rgba(155,123,255,.34), transparent 55%),
    radial-gradient(90% 70% at 6% 92%, rgba(241,76,160,.20), transparent 55%),
    linear-gradient(140deg,#2A1A6E 0%,#1E1252 55%,#3B2596 100%);
  box-shadow:0 22px 58px rgba(30,18,82,.36), inset 0 1px 0 rgba(255,255,255,.06);
  border:2px solid var(--lang-line);
  margin-bottom:22px;
  animation:ec-prof-slide-in .55s cubic-bezier(.22,1,.36,1) both;
}
.ec-prof-hero::before{
  content:'';position:absolute;inset:0;
  background-image:radial-gradient(rgba(255,255,255,.10) 1.4px,transparent 1.4px);
  background-size:22px 22px;
  mask-image:radial-gradient(circle at 15% 20%,#000,transparent 65%);
  -webkit-mask-image:radial-gradient(circle at 15% 20%,#000,transparent 65%);
  pointer-events:none;
}
.ec-prof-hero-orb{
  position:absolute;top:-90px;right:180px;
  width:260px;height:260px;border-radius:50%;
  background:radial-gradient(circle,rgba(212,245,92,.22),transparent 68%);
  animation:ec-prof-drift 14s ease-in-out infinite;
  pointer-events:none;
}
@keyframes ec-prof-drift{
  0%,100%{transform:translate(0,0) scale(1)}
  50%{transform:translate(-18px,16px) scale(1.08)}
}

.ec-prof-hero-top{
  position:relative;z-index:1;
  display:flex;align-items:center;gap:22px;flex-wrap:wrap;
  margin-bottom:22px;
}

/* Avatar with rotating dashed ring */
.ec-prof-avatar{
  position:relative;
  width:96px;height:96px;border-radius:50%;
  flex-shrink:0;
  display:flex;align-items:center;justify-content:center;
  font-size:34px;font-weight:900;color:var(--lang-ink);
  background:linear-gradient(135deg,#F5E04D 0%,#B8E62E 100%);
  border:3px solid var(--lang-line);
  box-shadow:0 6px 0 rgba(0,0,0,.5);
}
.ec-prof-avatar::after{
  content:'';position:absolute;inset:-10px;border-radius:50%;
  border:2px dashed rgba(212,245,92,.42);
  animation:ec-prof-spin 22s linear infinite;
  pointer-events:none;
}
@keyframes ec-prof-spin{to{transform:rotate(360deg)}}

.ec-prof-identity{flex:1;min-width:0}
.ec-prof-name-row{
  display:flex;align-items:center;gap:12px;
  flex-wrap:wrap;margin-bottom:6px;
}
.ec-prof-name{
  font-size:clamp(22px,2vw + 14px,30px);font-weight:900;
  margin:0;color:#fff;letter-spacing:-.035em;line-height:1.1;
}
.ec-prof-tier{
  font-size:10.5px;font-weight:900;
  text-transform:uppercase;letter-spacing:.08em;
  padding:5px 12px;border-radius:999px;
  background:var(--lang-lime);color:var(--lang-ink);
  border:2px solid var(--lang-line);
  box-shadow:0 2px 0 rgba(0,0,0,.4);
  white-space:nowrap;
}
.ec-prof-tier[data-tier="premium"]{
  background:var(--lang-yellow);
}
.ec-prof-hero-sub{
  font-size:13.5px;line-height:1.55;color:rgba(255,255,255,.85);
  margin:0;font-weight:600;max-width:56ch;
}

/* Hero mascot */
.ec-prof-hero-mascot{
  position:absolute;
  right:22px;top:50%;transform:translateY(-50%);
  z-index:1;
  display:flex;align-items:center;justify-content:center;
  filter:drop-shadow(0 14px 28px rgba(0,0,0,.28));
  animation:ec-prof-bob 4s ease-in-out infinite;
  pointer-events:none;
}
@keyframes ec-prof-bob{
  0%,100%{transform:translateY(-50%) rotate(-2deg)}
  50%{transform:translateY(calc(-50% - 10px)) rotate(2deg)}
}
.ec-prof-sparkle{
  position:absolute;
  width:14px;height:14px;
  pointer-events:none;
  animation:ec-prof-sparkle 3s ease-in-out infinite;
}
.ec-prof-sparkle::before{
  content:'';position:absolute;inset:0;
  background:currentColor;
  clip-path:polygon(50% 0,55% 45%,100% 50%,55% 55%,50% 100%,45% 55%,0 50%,45% 45%);
}
.ec-prof-sparkle--a{top:-8%;right:6%;color:var(--lang-lime);animation-delay:0s}
.ec-prof-sparkle--b{top:18%;right:-4%;color:var(--lang-pink);animation-delay:.6s;width:10px;height:10px}
.ec-prof-sparkle--c{bottom:2%;right:2%;color:var(--lang-yellow);animation-delay:1.2s;width:12px;height:12px}
@keyframes ec-prof-sparkle{
  0%,100%{opacity:1;transform:scale(1) rotate(0deg)}
  50%{opacity:.35;transform:scale(.75) rotate(30deg)}
}

/* Inline stat strip inside hero */
.ec-prof-hero-stats{
  position:relative;z-index:1;
  display:grid;grid-template-columns:repeat(3,minmax(0,1fr));
  gap:10px;max-width:640px;
}
.ec-prof-hero-stat{
  display:flex;align-items:center;gap:12px;
  padding:12px 16px;border-radius:16px;
  background:var(--lang-lime);color:var(--lang-ink);
  border:2px solid var(--lang-line);
  box-shadow:0 4px 0 var(--lang-line);
  transition:transform .25s cubic-bezier(.34,1.56,.64,1);
  animation:ec-prof-chip-pop .5s cubic-bezier(.34,1.56,.64,1) both;
}
.ec-prof-hero-stat:nth-child(1){animation-delay:.15s}
.ec-prof-hero-stat:nth-child(2){animation-delay:.25s;background:var(--lang-pink)}
.ec-prof-hero-stat:nth-child(3){animation-delay:.35s;background:var(--lang-purple-2);color:#fff}
.ec-prof-hero-stat:hover{transform:translateY(-3px)}
@keyframes ec-prof-chip-pop{
  from{opacity:0;transform:translateY(8px) scale(.92)}
  to{opacity:1;transform:translateY(0) scale(1)}
}
.ec-prof-hero-stat-icon{
  width:34px;height:34px;border-radius:10px;
  display:flex;align-items:center;justify-content:center;
  background:rgba(255,255,255,.55);
  color:var(--lang-ink);
  border:2px solid var(--lang-line);
  box-shadow:0 2px 0 var(--lang-line);
  flex-shrink:0;
}
.ec-prof-hero-stat:nth-child(3) .ec-prof-hero-stat-icon{
  background:rgba(255,255,255,.22);
  color:#fff;
}
.ec-prof-hero-stat-icon svg{width:16px;height:16px}
.ec-prof-hero-stat-body{min-width:0}
.ec-prof-hero-stat-value{
  font-size:18px;font-weight:900;line-height:1;
  letter-spacing:-.03em;
  font-variant-numeric:tabular-nums;
  margin-bottom:3px;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
.ec-prof-hero-stat-label{
  font-size:9.5px;font-weight:900;
  letter-spacing:.1em;text-transform:uppercase;
  opacity:.75;
}

/* ============================================================
   GRID
   ============================================================ */
.ec-prof-grid{
  display:grid;grid-template-columns:minmax(0,1fr) 340px;
  gap:22px;align-items:start;
}

/* ============================================================
   CARDS
   ============================================================ */
.ec-prof-card{
  background:#fff;
  border:2px solid var(--lang-line);
  border-radius:26px;
  padding:22px;
  box-shadow:0 6px 0 var(--lang-line);
  background-image:radial-gradient(circle at 100% 0%,rgba(212,245,92,.10),transparent 55%);
}
.ec-prof-card + .ec-prof-card{margin-top:20px}
.ec-prof-card h3{
  margin:0 0 16px;font-size:15px;font-weight:900;
  color:var(--lang-ink);
  display:flex;align-items:center;justify-content:space-between;gap:8px;
  letter-spacing:-.02em;
}
.ec-prof-card h3 span{
  font-size:10.5px;
  color:var(--lang-ink);
  background:var(--lang-lime);
  padding:4px 11px;border-radius:999px;
  font-weight:900;
  letter-spacing:.06em;text-transform:uppercase;
  border:2px solid var(--lang-line);
  box-shadow:0 2px 0 var(--lang-line);
  white-space:nowrap;
}

/* ============================================================
   XP PROGRESS CARD
   ============================================================ */
.ec-prof-xp-header{
  display:flex;align-items:baseline;justify-content:space-between;
  gap:12px;margin-bottom:14px;flex-wrap:wrap;
}
.ec-prof-xp-num{
  font-size:32px;font-weight:900;
  color:var(--lang-ink);line-height:1;
  letter-spacing:-.045em;
  font-variant-numeric:tabular-nums;
}
.ec-prof-xp-num small{
  font-size:13px;font-weight:800;
  color:var(--lang-ink-soft);margin-left:6px;
  letter-spacing:0;
}
.ec-prof-xp-pct{
  font-size:13px;font-weight:900;
  color:var(--lang-ink);
  background:var(--lang-lime);
  padding:5px 13px;border-radius:999px;
  border:2px solid var(--lang-line);
  box-shadow:0 2px 0 var(--lang-line);
  letter-spacing:.03em;
  font-variant-numeric:tabular-nums;
}
.ec-prof-xp-track{
  position:relative;
  height:14px;border-radius:999px;
  background:#E8E5F2;overflow:hidden;
  margin-bottom:14px;
  border:2px solid var(--lang-line);
}
.ec-prof-xp-fill{
  position:relative;
  height:100%;border-radius:999px;
  background:linear-gradient(90deg,#D4F55C,#B8E62E);
  transition:width 1.2s cubic-bezier(.22,1,.36,1);
}
.ec-prof-xp-fill::after{
  content:'';position:absolute;top:0;bottom:0;left:-30%;
  width:30%;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.65),transparent);
  animation:ec-prof-shine 2.4s ease-in-out infinite;
  pointer-events:none;
}
@keyframes ec-prof-shine{
  0%{transform:translateX(0)}
  60%{transform:translateX(420%)}
  100%{transform:translateX(420%)}
}
.ec-prof-xp-foot{
  font-size:12.5px;color:var(--lang-ink-soft);
  margin:0;font-weight:700;letter-spacing:.01em;
}

/* ============================================================
   TODAY'S PLAN
   ============================================================ */
.ec-prof-plan-item{
  display:flex;gap:14px;align-items:flex-start;
  padding:14px 0;
  border-bottom:2px dashed rgba(23,16,46,.1);
  animation:ec-prof-slide-in .45s cubic-bezier(.22,1,.36,1) both;
}
.ec-prof-plan-item:nth-child(1){animation-delay:.1s}
.ec-prof-plan-item:nth-child(2){animation-delay:.16s}
.ec-prof-plan-item:nth-child(3){animation-delay:.22s}
.ec-prof-plan-item:last-child{
  border-bottom:none;padding-bottom:0;
}
.ec-prof-plan-icon{
  width:44px;height:44px;border-radius:14px;
  background:var(--lang-lime);
  color:var(--lang-ink);
  display:flex;align-items:center;justify-content:center;
  flex-shrink:0;
  border:2px solid var(--lang-line);
  box-shadow:0 3px 0 var(--lang-line);
  transition:transform .3s cubic-bezier(.34,1.56,.64,1);
}
.ec-prof-plan-item:nth-child(2) .ec-prof-plan-icon{background:var(--lang-pink)}
.ec-prof-plan-item:nth-child(3) .ec-prof-plan-icon{background:var(--lang-purple-2);color:#fff}
.ec-prof-plan-item:hover .ec-prof-plan-icon{
  transform:scale(1.08) rotate(-5deg);
}
.ec-prof-plan-icon svg{width:20px;height:20px}
.ec-prof-plan-body{flex:1;min-width:0}
.ec-prof-plan-body p{
  margin:0 0 4px;font-size:14px;font-weight:900;
  color:var(--lang-ink);letter-spacing:-.01em;
}
.ec-prof-plan-body span{
  font-size:11.5px;color:var(--lang-ink-soft);
  font-weight:700;
}

/* ============================================================
   ACHIEVEMENTS
   ============================================================ */
.ec-prof-badges{
  display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));
  gap:12px;
}
.ec-prof-badge{
  position:relative;
  display:flex;align-items:center;gap:12px;
  padding:14px;
  border-radius:16px;
  border:2px solid var(--lang-line);
  background:#fff;
  box-shadow:0 4px 0 var(--lang-line);
  transition:transform .26s cubic-bezier(.34,1.56,.64,1),
             box-shadow .2s ease;
  animation:ec-prof-badge-in .5s cubic-bezier(.34,1.56,.64,1) both;
}
.ec-prof-badge:nth-child(1){animation-delay:.06s}
.ec-prof-badge:nth-child(2){animation-delay:.12s}
.ec-prof-badge:nth-child(3){animation-delay:.18s}
.ec-prof-badge:nth-child(4){animation-delay:.24s}
.ec-prof-badge:nth-child(5){animation-delay:.30s}
.ec-prof-badge:nth-child(6){animation-delay:.36s}
@keyframes ec-prof-badge-in{
  from{opacity:0;transform:translateY(14px) scale(.94)}
  to{opacity:1;transform:translateY(0) scale(1)}
}
.ec-prof-badge:hover{
  transform:translateY(-4px) scale(1.02);
  box-shadow:0 8px 0 var(--lang-line);
}
.ec-prof-badge-icon{
  width:46px;height:46px;border-radius:12px;
  background:var(--lang-lime);
  color:var(--lang-ink);
  display:flex;align-items:center;justify-content:center;
  font-size:22px;flex-shrink:0;font-weight:900;
  border:2px solid var(--lang-line);
  box-shadow:0 2px 0 var(--lang-line);
  transition:transform .3s cubic-bezier(.34,1.56,.64,1);
}
.ec-prof-badge:nth-child(2n) .ec-prof-badge-icon{background:var(--lang-pink)}
.ec-prof-badge:nth-child(3n) .ec-prof-badge-icon{background:var(--lang-purple-2);color:#fff}
.ec-prof-badge:nth-child(4n) .ec-prof-badge-icon{background:var(--lang-yellow)}
.ec-prof-badge:hover .ec-prof-badge-icon{
  transform:scale(1.1) rotate(-8deg);
}
.ec-prof-badge-body{flex:1;min-width:0}
.ec-prof-badge-body p{
  margin:0;font-size:12.5px;font-weight:900;
  color:var(--lang-ink);line-height:1.3;
  letter-spacing:-.01em;
}
.ec-prof-badge-body span{
  font-size:10.5px;color:var(--lang-ink-soft);
  line-height:1.4;display:block;margin-top:3px;
  font-weight:700;
}
.ec-prof-badge--locked{
  opacity:.55;filter:grayscale(.65);
}
.ec-prof-badge--locked .ec-prof-badge-icon{
  background:#E8E5F2;
  color:var(--lang-ink-soft);
}
.ec-prof-badge--locked:hover{
  transform:translateY(-2px);
  box-shadow:0 4px 0 var(--lang-line);
}

/* ============================================================
   SIDEBAR — upgrade / membership / links
   ============================================================ */
.ec-prof-upgrade{
  position:relative;overflow:hidden;
  border-radius:24px;
  padding:24px;
  background:var(--lang-yellow);
  border:2px solid var(--lang-line);
  box-shadow:0 6px 0 var(--lang-line);
  background-image:radial-gradient(circle at 100% 0%,rgba(255,255,255,.35),transparent 55%);
  animation:ec-prof-slide-in .5s cubic-bezier(.22,1,.36,1) both;
}
.ec-prof-upgrade::after{
  content:'';position:absolute;top:0;bottom:0;left:-30%;
  width:30%;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.5),transparent);
  animation:ec-prof-shine 3.6s ease-in-out infinite;
  pointer-events:none;
}
.ec-prof-upgrade h3{
  margin:0 0 8px;font-size:16px;font-weight:900;
  color:var(--lang-ink);letter-spacing:-.02em;
  display:flex;align-items:center;gap:8px;
  position:relative;z-index:1;
}
.ec-prof-upgrade p{
  margin:0 0 16px;font-size:12.5px;
  line-height:1.55;color:var(--lang-ink);
  opacity:.85;font-weight:700;
  position:relative;z-index:1;
}
.ec-prof-upgrade a{
  display:inline-flex;align-items:center;gap:6px;
  background:var(--lang-ink);
  color:var(--lang-lime);
  padding:11px 20px;border-radius:999px;
  font-size:12.5px;font-weight:900;
  text-decoration:none;
  border:2px solid var(--lang-line);
  box-shadow:0 4px 0 var(--lang-line);
  transition:transform .22s cubic-bezier(.34,1.56,.64,1),
             box-shadow .18s ease;
  letter-spacing:.03em;
  position:relative;z-index:1;
}
.ec-prof-upgrade a:hover{
  transform:translateY(-3px);
  box-shadow:0 7px 0 var(--lang-line);
}
.ec-prof-upgrade a:active{
  transform:translateY(2px);
  box-shadow:0 1px 0 var(--lang-line);
}

.ec-prof-membership{
  background:var(--lang-lime-soft);
  border:2px solid var(--lang-line);
  border-radius:24px;
  padding:22px;
  box-shadow:0 5px 0 var(--lang-line);
  animation:ec-prof-slide-in .5s cubic-bezier(.22,1,.36,1) both;
}
.ec-prof-membership h3{
  margin:0 0 12px;font-size:15px;font-weight:900;
  color:var(--lang-ink);letter-spacing:-.02em;
  display:flex;align-items:center;gap:8px;
}
.ec-prof-membership p{
  margin:0;font-size:13px;
  color:var(--lang-ink);line-height:1.6;
  font-weight:700;opacity:.85;
}

/* Quick links */
.ec-prof-quicklinks{
  display:flex;flex-direction:column;gap:10px;
}
.ec-prof-quicklink{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:12px;
  padding:13px 16px;
  border-radius:14px;
  background:#fff;
  color:var(--lang-ink);
  border:2px solid var(--lang-line);
  box-shadow:0 3px 0 var(--lang-line);
  font-size:13px;
  font-weight:900;
  text-decoration:none;
  transition:transform .22s cubic-bezier(.34,1.56,.64,1),
             box-shadow .18s ease,
             background .2s ease;
  letter-spacing:-.01em;
  animation:ec-prof-slide-in .45s cubic-bezier(.22,1,.36,1) both;
}
.ec-prof-quicklink:nth-child(1){animation-delay:.1s}
.ec-prof-quicklink:nth-child(2){animation-delay:.16s}
.ec-prof-quicklink:nth-child(3){animation-delay:.22s}
.ec-prof-quicklink:nth-child(4){animation-delay:.28s}
.ec-prof-quicklink-left{
  display:flex;align-items:center;gap:12px;min-width:0;
}
.ec-prof-quicklink-icon{
  width:32px;height:32px;border-radius:10px;
  display:flex;align-items:center;justify-content:center;
  background:var(--lang-lime);
  color:var(--lang-ink);
  border:2px solid var(--lang-line);
  box-shadow:0 2px 0 var(--lang-line);
  flex-shrink:0;
  transition:transform .3s cubic-bezier(.34,1.56,.64,1);
}
.ec-prof-quicklink:nth-child(2) .ec-prof-quicklink-icon{background:var(--lang-pink)}
.ec-prof-quicklink:nth-child(3) .ec-prof-quicklink-icon{background:var(--lang-purple-2);color:#fff}
.ec-prof-quicklink:nth-child(4) .ec-prof-quicklink-icon{background:var(--lang-yellow)}
.ec-prof-quicklink-icon svg{width:16px;height:16px}
.ec-prof-quicklink span[aria-hidden]{
  font-size:16px;
  color:var(--lang-ink-soft);
  transition:transform .3s cubic-bezier(.34,1.56,.64,1);
}
.ec-prof-quicklink:hover{
  background:var(--lang-lime-soft);
  transform:translateY(-3px) translateX(3px);
  box-shadow:0 6px 0 var(--lang-line);
}
.ec-prof-quicklink:hover .ec-prof-quicklink-icon{
  transform:rotate(-8deg) scale(1.08);
}
.ec-prof-quicklink:hover span[aria-hidden]{
  transform:translateX(4px);
}
.ec-prof-quicklink:active{
  transform:translateY(1px);
  box-shadow:0 1px 0 var(--lang-line);
}

/* ============================================================
   SKELETON
   ============================================================ */
.ec-prof-skel{
  display:inline-block;
  background:linear-gradient(90deg,rgba(120,110,180,.14) 25%,rgba(120,110,180,.26) 37%,rgba(120,110,180,.14) 63%);
  background-size:400% 100%;
  animation:ec-prof-shimmer 1.4s ease infinite;
  border-radius:8px;
}
@keyframes ec-prof-shimmer{
  0%{background-position:100% 50%}
  100%{background-position:0 50%}
}

/* ============================================================
   ERROR
   ============================================================ */
.ec-prof-error{
  background:var(--lang-pink-2);
  border:2px solid var(--lang-line);
  border-radius:18px;
  padding:14px 18px;
  display:flex;align-items:center;justify-content:space-between;
  gap:12px;
  box-shadow:0 4px 0 var(--lang-line);
}
.ec-prof-error span{
  font-size:13px;color:#fff;
  font-weight:900;letter-spacing:.01em;
}
.ec-prof-retry{
  border:2px solid var(--lang-line);
  background:var(--lang-ink);color:var(--lang-lime);
  font-size:12px;font-weight:900;
  padding:8px 16px;border-radius:999px;
  cursor:pointer;font-family:inherit;
  transition:transform .2s cubic-bezier(.34,1.56,.64,1),
             box-shadow .18s ease;
  box-shadow:0 3px 0 var(--lang-line);
  letter-spacing:.03em;
}
.ec-prof-retry:hover{
  transform:translateY(-2px);
  box-shadow:0 5px 0 var(--lang-line);
}

/* ============================================================
   ANIMATIONS
   ============================================================ */
@keyframes ec-prof-slide-in{
  from{opacity:0;transform:translateY(14px) scale(.98)}
  to{opacity:1;transform:translateY(0) scale(1)}
}

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media(max-width:1080px){
  .ec-prof-grid{grid-template-columns:1fr}
}
@media(max-width:900px){
  .ec-prof-hero-mascot{
    right:12px;
    transform:translateY(-50%) scale(.75);
    transform-origin:right center;
  }
  @keyframes ec-prof-bob{
    0%,100%{transform:translateY(-50%) scale(.75) rotate(-2deg)}
    50%{transform:translateY(calc(-50% - 8px)) scale(.75) rotate(2deg)}
  }
}
@media(max-width:720px){
  .ec-prof-hero{padding:22px 20px;border-radius:26px}
  .ec-prof-hero-top{gap:16px;margin-bottom:18px}
  .ec-prof-avatar{width:78px;height:78px;font-size:28px}
  .ec-prof-name{font-size:22px}
  .ec-prof-hero-sub{font-size:12.5px}
  .ec-prof-hero-mascot{display:none}
  .ec-prof-hero-stats{grid-template-columns:1fr;gap:8px}
  .ec-prof-hero-stat{padding:10px 12px;border-radius:14px}
  .ec-prof-hero-stat-icon{width:30px;height:30px;border-radius:9px}
  .ec-prof-hero-stat-icon svg{width:14px;height:14px}
  .ec-prof-hero-stat-value{font-size:16px}
  .ec-prof-hero-stat-label{font-size:9px}

  .ec-prof-card{padding:18px;border-radius:22px;box-shadow:0 5px 0 var(--lang-line)}
  .ec-prof-xp-num{font-size:26px}
  .ec-prof-badges{grid-template-columns:1fr;gap:10px}
  .ec-prof-badge{padding:12px;gap:10px}
  .ec-prof-badge-icon{width:40px;height:40px;font-size:20px}
  .ec-prof-badge-body p{font-size:12px}
  .ec-prof-upgrade{padding:20px;border-radius:20px}
  .ec-prof-upgrade h3{font-size:15px}
  .ec-prof-membership{padding:18px;border-radius:20px}
}
@media(max-width:420px){
  .ec-prof-hero-stats{grid-template-columns:1fr 1fr}
  .ec-prof-hero-stat:nth-child(3){grid-column:1 / -1}
}
@media(prefers-reduced-motion:reduce){
  .ec-prof-hero,.ec-prof-hero-orb,.ec-prof-hero-mascot,
  .ec-prof-avatar::after,.ec-prof-sparkle,.ec-prof-hero-stat,
  .ec-prof-plan-item,.ec-prof-badge,
  .ec-prof-quicklink,.ec-prof-upgrade,.ec-prof-membership{animation:none!important}
  .ec-prof-xp-fill{transition:none}
  .ec-prof-xp-fill::after,.ec-prof-upgrade::after{animation:none!important;display:none}
  .ec-prof-hero-stat:hover,.ec-prof-badge:hover,
  .ec-prof-quicklink:hover,.ec-prof-retry:hover,
  .ec-prof-upgrade a:hover,.ec-prof-plan-item:hover .ec-prof-plan-icon,
  .ec-prof-badge:hover .ec-prof-badge-icon,
  .ec-prof-quicklink:hover .ec-prof-quicklink-icon{transform:none}
}
`;

/* ============================================================
   Mascot — Langut yellow blob
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

function initials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase() || '?';
}

const WEEKLY_PLAN = [
  { id: 'p1', icon: 'target', title: 'Grammar drill', meta: 'Prepositions — 15 min' },
  { id: 'p2', icon: 'book', title: 'Reading passage', meta: 'One timed passage — 20 min' },
  { id: 'p3', icon: 'mic', title: 'Speaking prompt', meta: '2 prompts, record and review' },
];

const DEFAULT_BADGES = [
  { id: 'b1', name: '50 Words Mastered', icon: '★', unlocked: true, description: 'Learn 50 new words' },
  { id: 'b2', name: '7-Day Streak', icon: '🔥', unlocked: true, description: 'Practise 7 days in a row' },
  { id: 'b3', name: 'Grammar Guru', icon: '✓', unlocked: false, description: 'Score 90% on 20 exercises' },
  { id: 'b4', name: 'First Mock Exam', icon: '🎯', unlocked: true, description: 'Complete any full mock' },
  { id: 'b5', name: 'Speaking Star', icon: '✦', unlocked: false, description: 'Get a Band 7 on speaking' },
  { id: 'b6', name: '30-Day Streak', icon: '⚡', unlocked: false, description: 'Practise 30 days in a row' },
];

const QUICK_LINKS = [
  { to: '/progress',  label: 'Full progress report', icon: 'trophy' },
  { to: '/speaking',  label: 'Speaking practice',    icon: 'mic' },
  { to: '/exams',     label: 'Exam preparation',     icon: 'flag' },
  { to: '/live-rooms',label: 'Live rooms',           icon: 'zap' },
];

export function Profile() {
  const { user, isPremium } = useAuth();
  const [xp, setXp] = useState(null);
  const [xpLoading, setXpLoading] = useState(true);
  const [xpError, setXpError] = useState(false);

  const [badges, setBadges] = useState(null);
  const [badgesLoading, setBadgesLoading] = useState(true);

  const [animateBars, setAnimateBars] = useState(false);

  const loadXp = useCallback(() => {
    setXpLoading(true);
    setXpError(false);
    gamificationApi
      .summary()
      .then((data) => setXp(data))
      .catch(() => setXpError(true))
      .finally(() => setXpLoading(false));
  }, []);

  const loadBadges = useCallback(() => {
    setBadgesLoading(true);
    gamificationApi
      .badges()
      .then((data) => setBadges(Array.isArray(data) && data.length ? data : DEFAULT_BADGES))
      .catch(() => setBadges(DEFAULT_BADGES))
      .finally(() => setBadgesLoading(false));
  }, []);

  useEffect(() => {
    loadXp();
    loadBadges();
    const t = requestAnimationFrame(() => setAnimateBars(true));
    return () => cancelAnimationFrame(t);
  }, [loadXp, loadBadges]);

  const xpToday = xp?.xpToday ?? 0;
  const xpGoal = xp?.xpGoal ?? 100;
  const xpPct = Math.max(0, Math.min(100, Math.round((xpToday / Math.max(xpGoal, 1)) * 100)));
  const shownBadges = badges || DEFAULT_BADGES;
  const unlockedCount = shownBadges.filter((b) => b.unlocked !== false && b.earned !== false).length;

  return (
    <div className="ec-prof">
      <style>{PROFILE_CSS}</style>

      <div className="ec-prof-head">
        <p className="ec-prof-eyebrow">Your account</p>
        <h1 className="ec-page-title">Profile</h1>
        <p className="ec-page-sub">Avatar, stats, achievements and today’s plan.</p>
      </div>

      {/* ============================================================
          HERO — identity + inline stat strip
         ============================================================ */}
      <div className="ec-prof-hero">
        <div className="ec-prof-hero-orb" aria-hidden="true" />

        <div className="ec-prof-hero-top">
          <div className="ec-prof-avatar" aria-hidden="true">{initials(user?.name)}</div>
          <div className="ec-prof-identity">
            <div className="ec-prof-name-row">
              <h2 className="ec-prof-name">{user?.name || 'Guest learner'}</h2>
              <span className="ec-prof-tier" data-tier={user?.tier ?? 'guest'}>
                {user?.tier ?? 'guest'}
              </span>
            </div>
            <p className="ec-prof-hero-sub">
              {isPremium
                ? 'Premium member — thanks for supporting English Coach.'
                : 'Free plan — upgrade any time to unlock AI speaking, all mocks and priority seating.'}
            </p>
          </div>
        </div>

        {/* Inline stat strip — always visible, updates with data */}
        <div className="ec-prof-hero-stats">
          <div className="ec-prof-hero-stat">
            <span className="ec-prof-hero-stat-icon"><Icon name="zap" /></span>
            <div className="ec-prof-hero-stat-body">
              <div className="ec-prof-hero-stat-value">
                {xpLoading ? '—' : (xp?.streak ?? 0)} days
              </div>
              <div className="ec-prof-hero-stat-label">Streak</div>
            </div>
          </div>
          <div className="ec-prof-hero-stat">
            <span className="ec-prof-hero-stat-icon"><Icon name="trophy" /></span>
            <div className="ec-prof-hero-stat-body">
              <div className="ec-prof-hero-stat-value">
                {xpLoading ? '—' : (xp?.rank ?? '—')}
              </div>
              <div className="ec-prof-hero-stat-label">Rank</div>
            </div>
          </div>
          <div className="ec-prof-hero-stat">
            <span className="ec-prof-hero-stat-icon"><Icon name="target" /></span>
            <div className="ec-prof-hero-stat-body">
              <div className="ec-prof-hero-stat-value">
                {xpLoading ? '—' : (xp?.rankName ?? 'Learner')}
              </div>
              <div className="ec-prof-hero-stat-label">Title</div>
            </div>
          </div>
        </div>

        <div className="ec-prof-hero-mascot">
          <span className="ec-prof-sparkle ec-prof-sparkle--a" aria-hidden="true" />
          <span className="ec-prof-sparkle ec-prof-sparkle--b" aria-hidden="true" />
          <span className="ec-prof-sparkle ec-prof-sparkle--c" aria-hidden="true" />
          <LangutMascot size={160} />
        </div>
      </div>

      {/* ============================================================
          MAIN GRID
         ============================================================ */}
      <div className="ec-prof-grid">
        <section>
          {/* Today's progress ------------------------------------------------ */}
          {xpError ? (
            <div className="ec-prof-error">
              <span>Couldn’t load today’s progress.</span>
              <button className="ec-prof-retry" onClick={loadXp}>Retry</button>
            </div>
          ) : (
            <div className="ec-prof-card" style={{ animation: 'ec-prof-slide-in .5s cubic-bezier(.22,1,.36,1) both', animationDelay: '.1s' }}>
              <h3>Today’s progress <span>{xpPct}%</span></h3>
              {xpLoading ? (
                <>
                  <span className="ec-prof-skel" style={{ width: '100%', height: 14, display: 'block', marginBottom: 10 }} />
                  <span className="ec-prof-skel" style={{ width: '100%', height: 10, display: 'block' }} />
                </>
              ) : (
                <>
                  <div className="ec-prof-xp-header">
                    <span className="ec-prof-xp-num">{xpToday}<small>/ {xpGoal} XP</small></span>
                  </div>
                  <div className="ec-prof-xp-track">
                    <div className="ec-prof-xp-fill" style={{ width: animateBars ? `${xpPct}%` : '0%' }} />
                  </div>
                  <p className="ec-prof-xp-foot">
                    {xpPct >= 100
                      ? 'Daily goal reached — well done! 🎉'
                      : `Keep going — ${xpGoal - xpToday} XP to hit today's goal.`}
                  </p>
                </>
              )}
            </div>
          )}

          {/* Today's plan ----------------------------------------------------- */}
          <div className="ec-prof-card" style={{ animation: 'ec-prof-slide-in .5s cubic-bezier(.22,1,.36,1) both', animationDelay: '.15s' }}>
            <h3>Today’s plan <span>{WEEKLY_PLAN.length} tasks</span></h3>
            {WEEKLY_PLAN.map((p) => (
              <div className="ec-prof-plan-item" key={p.id}>
                <span className="ec-prof-plan-icon"><Icon name={p.icon} /></span>
                <div className="ec-prof-plan-body">
                  <p>{p.title}</p>
                  <span>{p.meta}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Achievements ----------------------------------------------------- */}
          <div className="ec-prof-card" style={{ animation: 'ec-prof-slide-in .5s cubic-bezier(.22,1,.36,1) both', animationDelay: '.2s' }}>
            <h3>Achievements <span>{unlockedCount}/{shownBadges.length}</span></h3>

            {badgesLoading ? (
              <div className="ec-prof-badges">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div className="ec-prof-badge" key={i}>
                    <span className="ec-prof-skel" style={{ width: 46, height: 46, borderRadius: 12 }} />
                    <span className="ec-prof-skel" style={{ width: '60%', height: 12 }} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="ec-prof-badges">
                {shownBadges.map((b) => {
                  const locked = b.unlocked === false || b.earned === false;
                  return (
                    <div
                      key={b.id ?? b.name}
                      className={`ec-prof-badge${locked ? ' ec-prof-badge--locked' : ''}`}
                    >
                      <div className="ec-prof-badge-icon" aria-hidden="true">
                        {b.icon || (b.name?.[0] ?? '★')}
                      </div>
                      <div className="ec-prof-badge-body">
                        <p>{b.name}</p>
                        {b.description && <span>{b.description}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ============================================================
            SIDEBAR
           ============================================================ */}
        <aside>
          {!isPremium && (
            <div className="ec-prof-upgrade">
              <h3>⭐ Go Premium</h3>
              <p>Unlock AI speaking scoring, unlimited mock exams, and priority seating in live rooms.</p>
              <Link to="/pricing">See plans →</Link>
            </div>
          )}

          {isPremium && (
            <div className="ec-prof-membership">
              <h3>⭐ Premium active</h3>
              <p>
                You’re a Premium member. AI speaking scoring, all mock exams, and priority seating are active on your account.
              </p>
            </div>
          )}

          <div className="ec-prof-card">
            <h3>Quick links</h3>
            <div className="ec-prof-quicklinks">
              {QUICK_LINKS.map((l) => (
                <Link key={l.to} to={l.to} className="ec-prof-quicklink">
                  <span className="ec-prof-quicklink-left">
                    <span className="ec-prof-quicklink-icon" aria-hidden="true">
                      <Icon name={l.icon} />
                    </span>
                    <span>{l.label}</span>
                  </span>
                  <span aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Profile;