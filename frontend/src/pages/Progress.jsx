import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { gamificationApi } from '../api/gamification';
import { useAuth } from '../context/AuthContext';
import { Icon } from '../components/Icon';

const PROGRESS_CSS = `
/* ============================================================
   PROGRESS — Langut-inspired
   Deep purple + lime-yellow + chunky black outlines.
   ============================================================ */

.ec-prog{
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

.ec-prog,
.ec-prog *{box-sizing:border-box}

/* ============================================================
   HEAD
   ============================================================ */
.ec-prog-head{
  display:flex;align-items:flex-end;justify-content:space-between;
  gap:16px;flex-wrap:wrap;margin-bottom:20px;
}
.ec-prog-eyebrow{
  margin:0 0 6px;font-size:11.5px;font-weight:900;
  letter-spacing:.16em;text-transform:uppercase;
  color:var(--lang-purple);opacity:.95;
}

/* ============================================================
   HERO — deep purple, chunky stats, mascot
   ============================================================ */
.ec-prog-hero{
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
.ec-prog-hero::before{
  content:'';position:absolute;inset:0;
  background-image:radial-gradient(rgba(255,255,255,.10) 1.4px,transparent 1.4px);
  background-size:20px 20px;
  mask-image:radial-gradient(circle at 15% 20%,#000,transparent 65%);
  -webkit-mask-image:radial-gradient(circle at 15% 20%,#000,transparent 65%);
  pointer-events:none;
}
.ec-prog-hero-orb{
  position:absolute;top:-90px;right:180px;
  width:260px;height:260px;border-radius:50%;
  background:radial-gradient(circle,rgba(212,245,92,.22),transparent 68%);
  animation:ec-prog-drift 14s ease-in-out infinite;
}
@keyframes ec-prog-drift{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-18px,16px) scale(1.08)}}
.ec-prog-hero-copy{position:relative;z-index:1;max-width:580px}
.ec-prog-hero-badge{
  display:inline-flex;align-items:center;
  font-size:10.5px;font-weight:900;
  letter-spacing:.16em;text-transform:uppercase;
  padding:7px 14px;border-radius:999px;
  background:var(--lang-lime);color:var(--lang-ink);
  border:2px solid var(--lang-line);
  box-shadow:0 3px 0 rgba(0,0,0,.4);
  margin-bottom:16px;
}
.ec-prog-hero h1{
  margin:0 0 10px;
  font-size:clamp(26px,2.4vw + 16px,38px);
  font-weight:900;
  letter-spacing:-.035em;
  line-height:1.1;
  color:#fff;
}
.ec-prog-hero h1 em{font-style:normal;color:var(--lang-lime)}
.ec-prog-hero p{
  margin:0 0 22px;
  font-size:14px;line-height:1.6;
  opacity:.92;font-weight:500;max-width:52ch;
}

/* Price-tag style stat chips */
.ec-prog-hero-stats{display:flex;gap:10px;flex-wrap:wrap;position:relative;z-index:1}
.ec-prog-hero-stat{
  display:flex;flex-direction:column;gap:2px;
  padding:9px 14px;
  border-radius:14px;
  background:var(--lang-lime);
  border:2px solid var(--lang-line);
  box-shadow:0 3px 0 var(--lang-line);
  min-width:86px;
}
.ec-prog-hero-stat strong{
  font-size:20px;font-weight:900;line-height:1;
  letter-spacing:-.04em;
  color:var(--lang-ink);
}
.ec-prog-hero-stat span{
  font-size:9.5px;font-weight:900;letter-spacing:.1em;
  text-transform:uppercase;color:var(--lang-ink);opacity:.75;
}
.ec-prog-hero-stat:nth-child(2){background:var(--lang-pink)}
.ec-prog-hero-stat:nth-child(3){background:var(--lang-purple-2)}
.ec-prog-hero-stat:nth-child(3) strong,
.ec-prog-hero-stat:nth-child(3) span{color:#fff}

/* Mascot */
.ec-prog-hero-mascot{
  position:relative;z-index:1;
  flex-shrink:0;
  display:flex;align-items:center;justify-content:center;
  filter:drop-shadow(0 14px 28px rgba(0,0,0,.28));
  animation:ec-prog-bob 4s ease-in-out infinite;
}
@keyframes ec-prog-bob{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-10px) rotate(2deg)}}

/* ============================================================
   STAT CARDS — chunky
   ============================================================ */
.ec-prog-stats{
  display:grid;grid-template-columns:repeat(4,1fr);
  gap:16px;margin-bottom:24px;
}
.ec-prog-stat{
  position:relative;
  background:#fff;
  border:2px solid var(--lang-line);
  border-radius:22px;
  padding:20px;
  box-shadow:0 6px 0 var(--lang-line);
  display:flex;flex-direction:column;gap:10px;
  overflow:hidden;
  transition:transform .2s ease,box-shadow .2s ease;
  background-image:radial-gradient(circle at 100% 0%,rgba(212,245,92,.10),transparent 55%);
}
.ec-prog-stat:hover{
  transform:translateY(-3px);
  box-shadow:0 9px 0 var(--lang-line);
}
.ec-prog-stat-icon{
  width:44px;height:44px;border-radius:14px;
  display:flex;align-items:center;justify-content:center;
  flex-shrink:0;
  border:2px solid var(--lang-line);
  box-shadow:0 3px 0 var(--lang-line);
}
.ec-prog-stat-icon--lime   {background:var(--lang-lime);     color:var(--lang-ink)}
.ec-prog-stat-icon--yellow {background:var(--lang-yellow);   color:var(--lang-ink)}
.ec-prog-stat-icon--pink   {background:var(--lang-pink-2);   color:#fff}
.ec-prog-stat-icon--purple {background:var(--lang-purple-2); color:#fff}
.ec-prog-stat-icon svg{width:20px;height:20px}
.ec-prog-stat-value{
  font-size:clamp(20px,1.6vw + 14px,26px);
  font-weight:900;color:var(--lang-ink);
  line-height:1.1;letter-spacing:-.03em;
}
.ec-prog-stat-value small{
  font-size:12.5px;font-weight:800;
  color:var(--lang-ink-soft);margin-left:4px;
  letter-spacing:0;
}
.ec-prog-stat-label{
  font-size:12px;font-weight:800;
  color:var(--lang-ink-soft);
  letter-spacing:.02em;
}

/* ============================================================
   XP BAR CARD
   ============================================================ */
.ec-prog-xp-card{
  background:#fff;
  border:2px solid var(--lang-line);
  border-radius:24px;
  padding:22px;
  box-shadow:0 6px 0 var(--lang-line);
  margin-bottom:24px;
  background-image:radial-gradient(circle at 100% 0%,rgba(212,245,92,.10),transparent 55%);
}
.ec-prog-xp-header{
  display:flex;align-items:baseline;justify-content:space-between;
  gap:12px;margin-bottom:14px;
}
.ec-prog-xp-title{
  margin:0;font-size:14px;font-weight:900;
  color:var(--lang-ink);
  letter-spacing:-.01em;
}
.ec-prog-xp-pct{
  font-size:13px;font-weight:900;
  color:var(--lang-ink);
  background:var(--lang-lime);
  border:2px solid var(--lang-line);
  padding:4px 12px;border-radius:999px;
  box-shadow:0 2px 0 var(--lang-line);
  letter-spacing:.04em;
}
.ec-prog-xp-track{
  height:14px;border-radius:999px;
  background:#E8E5F2;overflow:hidden;
  margin-bottom:12px;
  border:2px solid var(--lang-line);
}
.ec-prog-xp-fill{
  height:100%;border-radius:999px;
  background:linear-gradient(90deg,#D4F55C,#B8E62E);
  transition:width 1.2s cubic-bezier(.22,1,.36,1);
}
.ec-prog-xp-foot{
  display:flex;justify-content:space-between;
  font-size:11.5px;color:var(--lang-ink-soft);
  font-weight:800;letter-spacing:.03em;
  text-transform:uppercase;
}

/* ============================================================
   GRID
   ============================================================ */
.ec-prog-grid{
  display:grid;grid-template-columns:minmax(0,1fr) 340px;
  gap:22px;align-items:start;
}

/* ============================================================
   CARD SHELL
   ============================================================ */
.ec-prog-card{
  background:#fff;
  border:2px solid var(--lang-line);
  border-radius:26px;
  padding:22px;
  box-shadow:0 6px 0 var(--lang-line);
  margin-bottom:20px;
  background-image:radial-gradient(circle at 100% 0%,rgba(212,245,92,.08),transparent 55%);
}
.ec-prog-card:last-child{margin-bottom:0}
.ec-prog-card-head{
  display:flex;align-items:center;justify-content:space-between;
  gap:10px;margin-bottom:18px;
}
.ec-prog-card-head h2{
  margin:0;font-size:16px;font-weight:900;
  letter-spacing:-.02em;color:var(--lang-ink);
}
.ec-prog-card-chip{
  font-size:10.5px;font-weight:900;
  color:var(--lang-ink);
  background:var(--lang-lime);
  border:2px solid var(--lang-line);
  padding:4px 11px;border-radius:999px;
  letter-spacing:.06em;text-transform:uppercase;
  box-shadow:0 2px 0 var(--lang-line);
}
.ec-prog-card-link{
  font-size:12px;font-weight:900;
  color:var(--lang-ink);
  text-decoration:none;
  padding:6px 12px;
  border-radius:999px;
  background:var(--lang-lime);
  border:2px solid var(--lang-line);
  box-shadow:0 2px 0 var(--lang-line);
  transition:transform .15s ease,box-shadow .15s ease;
}
.ec-prog-card-link:hover{
  transform:translateY(-2px);
  box-shadow:0 4px 0 var(--lang-line);
}

/* ============================================================
   HISTORY ROWS
   ============================================================ */
.ec-prog-history-row{
  display:flex;align-items:center;gap:14px;
  padding:14px 0;
  border-bottom:2px dashed rgba(23,16,46,.1);
  transition:transform .15s ease;
}
.ec-prog-history-row:last-child{
  border-bottom:none;padding-bottom:0;
}
.ec-prog-history-row:hover{transform:translateX(3px)}
.ec-prog-history-icon{
  width:38px;height:38px;border-radius:12px;
  background:var(--lang-purple-2);color:#fff;
  display:flex;align-items:center;justify-content:center;
  flex-shrink:0;
  border:2px solid var(--lang-line);
  box-shadow:0 3px 0 var(--lang-line);
}
.ec-prog-history-icon svg{width:18px;height:18px}
.ec-prog-history-info{flex:1;min-width:0}
.ec-prog-history-label{
  margin:0 0 3px;font-weight:900;font-size:13.5px;
  color:var(--lang-ink);
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
.ec-prog-history-date{
  font-size:11px;color:var(--lang-ink-soft);
  font-weight:700;letter-spacing:.02em;
}
.ec-prog-history-track{
  width:110px;height:12px;border-radius:999px;
  background:#E8E5F2;overflow:hidden;flex-shrink:0;
  border:2px solid var(--lang-line);
}
.ec-prog-history-fill{
  height:100%;border-radius:999px;
  background:linear-gradient(90deg,#D4F55C,#B8E62E);
  transition:width 1.1s cubic-bezier(.22,1,.36,1);
}
.ec-prog-history-score{
  font-size:13px;font-weight:900;
  color:var(--lang-ink);
  background:var(--lang-lime);
  border:2px solid var(--lang-line);
  padding:4px 10px;border-radius:999px;
  min-width:52px;text-align:center;flex-shrink:0;
  box-shadow:0 2px 0 var(--lang-line);
  letter-spacing:-.02em;
}

/* ============================================================
   WEEKLY CHART
   ============================================================ */
.ec-prog-chart{
  display:flex;gap:10px;align-items:flex-end;
  height:150px;margin-bottom:16px;padding:8px 4px 0;
}
.ec-prog-chart-bar{
  flex:1;display:flex;flex-direction:column;
  align-items:center;gap:8px;position:relative;
}
.ec-prog-chart-col{
  width:100%;
  border-radius:12px 12px 6px 6px;
  background:linear-gradient(180deg,#9B7BFF,#7B5CF0);
  position:relative;
  border:2px solid var(--lang-line);
  border-bottom-width:3px;
  transition:height 1s cubic-bezier(.22,1,.36,1),transform .2s ease;
  transform-origin:bottom;min-height:10px;
}
.ec-prog-chart-bar:hover .ec-prog-chart-col{
  transform:scaleY(1.04);
}
.ec-prog-chart-bar--today .ec-prog-chart-col{
  background:linear-gradient(180deg,#D4F55C,#B8E62E);
}
.ec-prog-chart-bar--empty .ec-prog-chart-col{
  background:#E8E5F2;
  border-style:dashed;
}
.ec-prog-chart-label{
  font-size:10.5px;font-weight:900;
  color:var(--lang-ink-soft);
  text-transform:uppercase;letter-spacing:.08em;
}
.ec-prog-chart-bar--today .ec-prog-chart-label{
  color:var(--lang-ink);
}
.ec-prog-chart-val{
  position:absolute;top:-24px;
  font-size:11px;font-weight:900;
  color:var(--lang-ink);
  background:var(--lang-lime);
  border:2px solid var(--lang-line);
  padding:2px 8px;border-radius:999px;
  opacity:0;transition:opacity .2s ease;
  white-space:nowrap;
}
.ec-prog-chart-bar:hover .ec-prog-chart-val{opacity:1}

/* ============================================================
   BADGES
   ============================================================ */
.ec-prog-badges{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(170px,1fr));
  gap:14px;
}
.ec-prog-badge{
  position:relative;
  display:flex;align-items:center;gap:12px;
  padding:14px;
  border-radius:16px;
  border:2px solid var(--lang-line);
  background:#fff;
  transition:transform .2s ease,box-shadow .2s ease;
  cursor:default;
  box-shadow:0 4px 0 var(--lang-line);
}
.ec-prog-badge:hover{
  transform:translateY(-3px);
  box-shadow:0 7px 0 var(--lang-line);
}
.ec-prog-badge-icon{
  width:44px;height:44px;border-radius:12px;
  background:var(--lang-lime);
  color:var(--lang-ink);
  display:flex;align-items:center;justify-content:center;
  font-size:20px;flex-shrink:0;font-weight:900;
  border:2px solid var(--lang-line);
  box-shadow:0 2px 0 var(--lang-line);
}
.ec-prog-badge-body{flex:1;min-width:0}
.ec-prog-badge-name{
  margin:0;font-size:12.5px;font-weight:900;
  color:var(--lang-ink);line-height:1.3;
  letter-spacing:-.01em;
}
.ec-prog-badge-hint{
  font-size:10.5px;color:var(--lang-ink-soft);
  line-height:1.35;display:block;margin-top:3px;
  font-weight:700;
}
.ec-prog-badge--locked{
  opacity:.55;
  filter:grayscale(.65);
}
.ec-prog-badge--locked .ec-prog-badge-icon{
  background:#E8E5F2;
  color:var(--lang-ink-soft);
}
.ec-prog-badge--locked:hover{
  transform:none;
  box-shadow:0 4px 0 var(--lang-line);
}

/* ============================================================
   WEAK AREAS
   ============================================================ */
.ec-prog-weak{display:flex;flex-direction:column;gap:12px}
.ec-prog-weak-tile{
  background:var(--lang-yellow);
  border:2px solid var(--lang-line);
  border-radius:18px;
  padding:15px 16px;
  transition:transform .18s ease,box-shadow .18s ease;
  box-shadow:0 4px 0 var(--lang-line);
}
.ec-prog-weak-tile:hover{
  transform:translateY(-2px);
  box-shadow:0 6px 0 var(--lang-line);
}
.ec-prog-weak-title{
  display:flex;justify-content:space-between;
  align-items:center;gap:8px;margin:0 0 6px;
}
.ec-prog-weak-title strong{
  font-size:13.5px;font-weight:900;
  color:var(--lang-ink);letter-spacing:-.01em;
}
.ec-prog-weak-score{
  font-size:11px;font-weight:900;
  background:var(--lang-pink-2);color:#fff;
  padding:3px 9px;border-radius:999px;
  border:2px solid var(--lang-line);
  box-shadow:0 2px 0 var(--lang-line);
  letter-spacing:.02em;
}
.ec-prog-weak-note{
  margin:0 0 12px;font-size:12px;
  line-height:1.5;color:var(--lang-ink);
  opacity:.85;font-weight:700;
}
.ec-prog-weak-btn{
  border:2px solid var(--lang-line);
  background:var(--lang-ink);
  color:var(--lang-lime);
  padding:8px 16px;border-radius:999px;
  font-size:11.5px;font-weight:900;
  cursor:pointer;font-family:inherit;
  transition:transform .16s ease,box-shadow .16s ease;
  box-shadow:0 3px 0 var(--lang-line);
  letter-spacing:.04em;
}
.ec-prog-weak-btn:hover{
  transform:translateY(-2px);
  box-shadow:0 5px 0 var(--lang-line);
}
.ec-prog-weak-btn:active{
  transform:translateY(1px);
  box-shadow:0 1px 0 var(--lang-line);
}

/* ============================================================
   STUDY PLAN
   ============================================================ */
.ec-prog-plan-list{
  list-style:none;padding:0;margin:0;
  display:flex;flex-direction:column;gap:10px;
}
.ec-prog-plan-item{
  display:flex;align-items:center;gap:12px;
  padding:12px 14px;border-radius:14px;
  background:#fff;
  border:2px solid var(--lang-line);
  box-shadow:0 3px 0 var(--lang-line);
  transition:transform .18s ease,box-shadow .18s ease,background .18s ease;
  cursor:pointer;
}
.ec-prog-plan-item:hover{
  transform:translateY(-2px);
  box-shadow:0 5px 0 var(--lang-line);
}
.ec-prog-plan-item--done{
  background:var(--lang-lime);
}
.ec-prog-plan-item--done .ec-prog-plan-text{
  text-decoration:line-through;
  opacity:.7;
}
.ec-prog-plan-check{
  width:26px;height:26px;border-radius:50%;
  border:2px solid var(--lang-line);
  background:#fff;
  display:flex;align-items:center;justify-content:center;
  flex-shrink:0;font-size:13px;font-weight:900;
  color:transparent;
  transition:all .2s ease;
  box-shadow:0 2px 0 var(--lang-line);
}
.ec-prog-plan-item--done .ec-prog-plan-check{
  background:var(--lang-ink);
  color:var(--lang-lime);
  border-color:var(--lang-line);
}
.ec-prog-plan-text{
  flex:1;font-size:13px;font-weight:900;
  color:var(--lang-ink);line-height:1.35;
}
.ec-prog-plan-meta{
  font-size:11px;color:var(--lang-ink-soft);
  font-weight:700;display:block;margin-top:3px;
}

/* ============================================================
   SKELETON
   ============================================================ */
.ec-prog-skel{
  display:inline-block;
  background:linear-gradient(90deg,rgba(120,110,180,.14) 25%,rgba(120,110,180,.26) 37%,rgba(120,110,180,.14) 63%);
  background-size:400% 100%;
  animation:ec-prog-shimmer 1.4s ease infinite;
  border-radius:8px;
}
@keyframes ec-prog-shimmer{0%{background-position:100% 50%}100%{background-position:0 50%}}

/* ============================================================
   ERROR
   ============================================================ */
.ec-prog-error{
  background:var(--lang-pink-2);
  border:2px solid var(--lang-line);
  border-radius:18px;
  padding:14px 18px;
  display:flex;align-items:center;justify-content:space-between;
  gap:12px;margin-bottom:20px;
  box-shadow:0 4px 0 var(--lang-line);
}
.ec-prog-error span{
  font-size:13px;color:#fff;font-weight:900;
  letter-spacing:.01em;
}
.ec-prog-retry{
  border:2px solid var(--lang-line);
  background:var(--lang-ink);color:var(--lang-lime);
  font-size:12px;font-weight:900;
  padding:8px 16px;border-radius:999px;
  cursor:pointer;font-family:inherit;
  transition:transform .15s ease,box-shadow .15s ease;
  box-shadow:0 3px 0 var(--lang-line);
  letter-spacing:.03em;
}
.ec-prog-retry:hover{
  transform:translateY(-2px);
  box-shadow:0 5px 0 var(--lang-line);
}

/* ============================================================
   ANIMATIONS
   ============================================================ */
@keyframes ec-prog-fade-in{
  from{opacity:0;transform:translateY(12px)}
  to{opacity:1;transform:translateY(0)}
}
.ec-prog-anim{animation:ec-prog-fade-in .45s ease both}

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width:900px){
  .ec-prog-grid{grid-template-columns:1fr;gap:18px}
  .ec-prog-stats{grid-template-columns:repeat(2,1fr)}
  .ec-prog-hero{flex-direction:column;align-items:flex-start;min-height:0}
  .ec-prog-hero-mascot{
    position:absolute;right:14px;bottom:14px;
    transform:scale(.72);transform-origin:bottom right;
    animation:none;
  }
}
@media (max-width:720px){
  .ec-prog-head{flex-direction:column;align-items:flex-start;gap:8px;margin-bottom:14px}
  .ec-prog-hero{padding:22px 20px;border-radius:26px}
  .ec-prog-hero h1{font-size:22px}
  .ec-prog-hero p{font-size:13px}
  .ec-prog-hero-stats{gap:8px;margin-top:14px}
  .ec-prog-hero-stat{padding:8px 12px;min-width:74px;border-radius:12px}
  .ec-prog-hero-stat strong{font-size:17px}
  .ec-prog-hero-stat span{font-size:9px}
  .ec-prog-hero-mascot{display:none}
  .ec-prog-stats{gap:12px;margin-bottom:20px}
  .ec-prog-stat{padding:16px;border-radius:18px}
  .ec-prog-stat-value{font-size:20px}
  .ec-prog-stat-label{font-size:11px}
  .ec-prog-xp-card{padding:18px;border-radius:20px}
  .ec-prog-card{padding:18px;border-radius:22px;margin-bottom:18px}
  .ec-prog-history-track{width:70px;height:10px}
  .ec-prog-history-icon{width:32px;height:32px}
  .ec-prog-history-label{font-size:12.5px}
  .ec-prog-chart{height:120px;gap:8px}
  .ec-prog-badges{grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}
  .ec-prog-badge{padding:12px;gap:10px}
  .ec-prog-badge-icon{width:38px;height:38px;font-size:18px}
  .ec-prog-badge-name{font-size:12px}
  .ec-prog-weak-tile{padding:14px}
  .ec-prog-plan-item{padding:11px 12px}
}
@media (max-width:380px){
  .ec-prog-stats{grid-template-columns:1fr 1fr;gap:10px}
  .ec-prog-stat{padding:14px}
  .ec-prog-stat-value{font-size:18px}
  .ec-prog-stat-value small{font-size:11px}
  .ec-prog-stat-icon{width:36px;height:36px}
  .ec-prog-stat-icon svg{width:16px;height:16px}
  .ec-prog-badges{grid-template-columns:1fr 1fr}
}
@media (prefers-reduced-motion: reduce){
  .ec-prog-anim{animation:none}
  .ec-prog-hero-orb,.ec-prog-hero-mascot{animation:none}
  .ec-prog-xp-fill,.ec-prog-history-fill,.ec-prog-chart-col{transition:none}
  .ec-prog-stat:hover,.ec-prog-badge:hover,.ec-prog-weak-tile:hover,
  .ec-prog-plan-item:hover,.ec-prog-card-link:hover,
  .ec-prog-weak-btn:hover,.ec-prog-retry:hover{transform:none}
}
`;

/* ---------- Fallback data ---------- */
const HISTORY = [
  { id: 'h1', label: 'Grammar quiz', score: 82, date: 'Mar 20', icon: 'target' },
  { id: 'h2', label: 'Vocabulary blitz', score: 65, date: 'Mar 19', icon: 'book' },
  { id: 'h3', label: 'IELTS Reading mock', score: 71, date: 'Mar 17', icon: 'flag' },
  { id: 'h4', label: 'Speaking practice', score: 74, date: 'Mar 16', icon: 'mic' },
];

const WEEK = [
  { day: 'Mon', xp: 80 },
  { day: 'Tue', xp: 120 },
  { day: 'Wed', xp: 60 },
  { day: 'Thu', xp: 140 },
  { day: 'Fri', xp: 90 },
  { day: 'Sat', xp: 160 },
  { day: 'Sun', xp: 45, today: true },
];

const WEAK_AREAS = [
  { id: 'w1', skill: 'Prepositions', score: 54, note: 'Boost this skill — a little practice goes a long way.' },
  { id: 'w2', skill: 'Listening for detail', score: 58, note: 'Boost this skill with short daily clips.' },
  { id: 'w3', skill: 'Articles', score: 62, note: 'Quick wins available — 10 questions a day.' },
];

const DEFAULT_BADGES = [
  { id: 'b1', name: '50 Words Mastered', icon: '📚', unlocked: true, hint: 'Learn 50 new words' },
  { id: 'b2', name: '7-Day Streak', icon: '🔥', unlocked: true, hint: 'Practise 7 days in a row' },
  { id: 'b3', name: 'Grammar Guru', icon: '✓', unlocked: false, hint: 'Score 90% on 20 exercises' },
  { id: 'b4', name: 'First Mock Exam', icon: '🎯', unlocked: true, hint: 'Complete any full mock' },
  { id: 'b5', name: 'Speaking Star', icon: '✦', unlocked: false, hint: 'Get a Band 7 on speaking' },
  { id: 'b6', name: '30-Day Streak', icon: '⚡', unlocked: false, hint: 'Practise 30 days in a row' },
];

const STUDY_PLAN = [
  { id: 'p1', text: '10 vocabulary flashcards', meta: 'Spaced repetition · 5 min', done: true },
  { id: 'p2', text: '1 prepositions exercise', meta: 'Grammar drill · 8 min', done: false },
  { id: 'p3', text: '5-minute listening clip', meta: 'Listening for detail · 5 min', done: false },
  { id: 'p4', text: 'Speaking prompt (optional)', meta: 'AI scoring · 10 min', done: false },
];

/* ---------- Mascot — Langut-style yellow blob ---------- */
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

/* ---------- Component ---------- */
export function Progress() {
  const { user } = useAuth();
  const [xp, setXp] = useState(null);
  const [xpLoading, setXpLoading] = useState(true);
  const [xpError, setXpError] = useState(false);

  const [badges, setBadges] = useState(null);
  const [badgesLoading, setBadgesLoading] = useState(true);

  const [animate, setAnimate] = useState(false);
  const [planDone, setPlanDone] = useState(() => {
    const initial = {};
    STUDY_PLAN.forEach((p) => { initial[p.id] = p.done; });
    return initial;
  });

  const loadXp = useCallback(() => {
    setXpLoading(true);
    setXpError(false);
    gamificationApi
      .summary()
      .then(setXp)
      .catch(() => setXpError(true))
      .finally(() => setXpLoading(false));
  }, []);

  const loadBadges = useCallback(() => {
    setBadgesLoading(true);
    gamificationApi
      .badges()
      .then((b) => setBadges(Array.isArray(b) && b.length ? b : DEFAULT_BADGES))
      .catch(() => setBadges(DEFAULT_BADGES))
      .finally(() => setBadgesLoading(false));
  }, []);

  useEffect(() => {
    loadXp();
    loadBadges();
    const t = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(t);
  }, [loadXp, loadBadges]);

  const shownBadges = badges || DEFAULT_BADGES;
  const unlockedCount = shownBadges.filter((b) => b.unlocked !== false).length;

  const xpToday = xp?.xpToday ?? 0;
  const xpGoal = xp?.xpGoal ?? 100;
  const xpPct = Math.max(0, Math.min(100, Math.round((xpToday / Math.max(xpGoal, 1)) * 100)));

  const weekMax = Math.max(...WEEK.map((d) => d.xp), 100);

  const togglePlan = (id) => {
    setPlanDone((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="ec-prog">
      <style>{PROGRESS_CSS}</style>

      {/* Heading */}
      <div className="ec-prog-head ec-prog-anim">
        <div>
          <p className="ec-prog-eyebrow">Progress</p>
          <h1 className="ec-page-title">Your progress</h1>
          <p className="ec-page-sub">
            Score history, streaks, badges, and a study plan built from how you’re actually doing.
          </p>
        </div>
      </div>

      {/* Hero */}
      <div className="ec-prog-hero ec-prog-anim">
        <div className="ec-prog-hero-orb" aria-hidden="true" />
        <div className="ec-prog-hero-copy">
          <span className="ec-prog-hero-badge">Weekly snapshot</span>
          <h1>You’re building <em>momentum</em> 🔥</h1>
          <p>Every session counts. Here’s where you stand this week and what to focus on next.</p>
          <div className="ec-prog-hero-stats">
            <div className="ec-prog-hero-stat">
              <strong>{xp?.streak ?? '—'}</strong>
              <span>Day streak</span>
            </div>
            <div className="ec-prog-hero-stat">
              <strong>{HISTORY.length}</strong>
              <span>Recent sessions</span>
            </div>
            <div className="ec-prog-hero-stat">
              <strong>{unlockedCount}/{shownBadges.length}</strong>
              <span>Badges</span>
            </div>
          </div>
        </div>
        <div className="ec-prog-hero-mascot">
          <LangutMascot size={170} />
        </div>
      </div>

      {/* Error */}
      {xpError && (
        <div className="ec-prog-error">
          <span>Couldn’t load your stats right now.</span>
          <button className="ec-prog-retry" onClick={loadXp}>Retry</button>
        </div>
      )}

      {/* Stat cards */}
      <div className="ec-prog-stats">
        <div className="ec-prog-stat ec-prog-anim" style={{ animationDelay: '0.05s' }}>
          <span className="ec-prog-stat-icon ec-prog-stat-icon--yellow"><Icon name="zap" /></span>
          {xpLoading ? (
            <span className="ec-prog-skel" style={{ width: 60, height: 22, display: 'block' }} />
          ) : (
            <span className="ec-prog-stat-value">{xp?.streak ?? '—'}<small>days</small></span>
          )}
          <span className="ec-prog-stat-label">Current streak 🔥</span>
        </div>

        <div className="ec-prog-stat ec-prog-anim" style={{ animationDelay: '0.1s' }}>
          <span className="ec-prog-stat-icon ec-prog-stat-icon--lime"><Icon name="target" /></span>
          {xpLoading ? (
            <span className="ec-prog-skel" style={{ width: 80, height: 22, display: 'block' }} />
          ) : (
            <span className="ec-prog-stat-value">{xpToday}<small>/ {xpGoal} XP</small></span>
          )}
          <span className="ec-prog-stat-label">Today’s goal</span>
        </div>

        <div className="ec-prog-stat ec-prog-anim" style={{ animationDelay: '0.15s' }}>
          <span className="ec-prog-stat-icon ec-prog-stat-icon--pink"><Icon name="trophy" /></span>
          {xpLoading ? (
            <span className="ec-prog-skel" style={{ width: 60, height: 22, display: 'block' }} />
          ) : (
            <span className="ec-prog-stat-value">Rank {xp?.rank ?? '—'}</span>
          )}
          <span className="ec-prog-stat-label">{xp?.rankName || 'Keep practising'}</span>
        </div>

        <div className="ec-prog-stat ec-prog-anim" style={{ animationDelay: '0.2s' }}>
          <span className="ec-prog-stat-icon ec-prog-stat-icon--purple"><Icon name="users" /></span>
          <span className="ec-prog-stat-value">{HISTORY.length}<small>sessions</small></span>
          <span className="ec-prog-stat-label">This week</span>
        </div>
      </div>

      {/* XP progress bar */}
      <div className="ec-prog-xp-card ec-prog-anim" style={{ animationDelay: '0.22s' }}>
        <div className="ec-prog-xp-header">
          <p className="ec-prog-xp-title">Daily XP goal</p>
          <span className="ec-prog-xp-pct">{xpPct}%</span>
        </div>
        <div className="ec-prog-xp-track">
          <div className="ec-prog-xp-fill" style={{ width: animate ? `${xpPct}%` : '0%' }} />
        </div>
        <div className="ec-prog-xp-foot">
          <span>{xpToday} XP earned</span>
          <span>{Math.max(0, xpGoal - xpToday)} XP to go</span>
        </div>
      </div>

      {/* Main grid */}
      <div className="ec-prog-grid">
        <section>
          {/* Score history */}
          <div className="ec-prog-card ec-prog-anim">
            <div className="ec-prog-card-head">
              <h2>Recent scores</h2>
              <Link to="/exams" className="ec-prog-card-link">View all →</Link>
            </div>
            {HISTORY.map((h) => (
              <div key={h.id} className="ec-prog-history-row">
                <span className="ec-prog-history-icon"><Icon name={h.icon || 'target'} /></span>
                <div className="ec-prog-history-info">
                  <p className="ec-prog-history-label">{h.label}</p>
                  <span className="ec-prog-history-date">{h.date}</span>
                </div>
                <div className="ec-prog-history-track">
                  <div className="ec-prog-history-fill" style={{ width: animate ? `${h.score}%` : '0%' }} />
                </div>
                <span className="ec-prog-history-score">{h.score}%</span>
              </div>
            ))}
          </div>

          {/* Weekly chart */}
          <div className="ec-prog-card ec-prog-anim">
            <div className="ec-prog-card-head">
              <h2>This week’s XP</h2>
              <span className="ec-prog-card-chip">{WEEK.reduce((s, d) => s + d.xp, 0)} XP</span>
            </div>
            <div className="ec-prog-chart">
              {WEEK.map((d) => {
                const pct = Math.max(8, Math.round((d.xp / weekMax) * 100));
                return (
                  <div
                    key={d.day}
                    className={`ec-prog-chart-bar${d.today ? ' ec-prog-chart-bar--today' : ''}${d.xp === 0 ? ' ec-prog-chart-bar--empty' : ''}`}
                  >
                    <span className="ec-prog-chart-val">{d.xp}</span>
                    <div
                      className="ec-prog-chart-col"
                      style={{ height: animate ? `${pct}%` : '0%' }}
                    />
                    <span className="ec-prog-chart-label">{d.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Badges */}
          <div className="ec-prog-card ec-prog-anim">
            <div className="ec-prog-card-head">
              <h2>Achievements</h2>
              <span className="ec-prog-card-chip">{unlockedCount}/{shownBadges.length}</span>
            </div>

            {badgesLoading ? (
              <div className="ec-prog-badges">
                {[0, 1, 2, 3].map((i) => (
                  <div className="ec-prog-badge" key={i}>
                    <span className="ec-prog-skel" style={{ width: 44, height: 44, borderRadius: 12 }} />
                    <span className="ec-prog-skel" style={{ width: '60%', height: 12 }} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="ec-prog-badges">
                {shownBadges.map((b) => {
                  const locked = b.unlocked === false;
                  return (
                    <div
                      key={b.id}
                      className={`ec-prog-badge${locked ? ' ec-prog-badge--locked' : ''}`}
                      title={locked ? 'Locked — keep practising' : 'Unlocked'}
                    >
                      <div className="ec-prog-badge-icon" aria-hidden="true">
                        {b.icon || (b.name?.[0] ?? '★')}
                      </div>
                      <div className="ec-prog-badge-body">
                        <p className="ec-prog-badge-name">{b.name}</p>
                        {b.hint && <span className="ec-prog-badge-hint">{b.hint}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Sidebar */}
        <aside>
          {/* Weak areas */}
          <div className="ec-prog-card ec-prog-anim">
            <div className="ec-prog-card-head">
              <h2>Weak areas</h2>
              <span className="ec-prog-card-chip">{WEAK_AREAS.length}</span>
            </div>
            <div className="ec-prog-weak">
              {WEAK_AREAS.map((w) => (
                <div key={w.id} className="ec-prog-weak-tile">
                  <p className="ec-prog-weak-title">
                    <strong>{w.skill}</strong>
                    <span className="ec-prog-weak-score">{w.score}%</span>
                  </p>
                  <p className="ec-prog-weak-note">{w.note}</p>
                  <button className="ec-prog-weak-btn">Practice now →</button>
                </div>
              ))}
            </div>
          </div>

          {/* Study plan */}
          <div className="ec-prog-card ec-prog-anim">
            <div className="ec-prog-card-head">
              <h2>Today’s plan</h2>
              <span className="ec-prog-card-chip">
                {Object.values(planDone).filter(Boolean).length}/{STUDY_PLAN.length}
              </span>
            </div>
            <ul className="ec-prog-plan-list">
              {STUDY_PLAN.map((p) => {
                const done = planDone[p.id];
                return (
                  <li
                    key={p.id}
                    className={`ec-prog-plan-item${done ? ' ec-prog-plan-item--done' : ''}`}
                    onClick={() => togglePlan(p.id)}
                  >
                    <span className="ec-prog-plan-check" aria-hidden="true">✓</span>
                    <span className="ec-prog-plan-text">
                      {p.text}
                      <span className="ec-prog-plan-meta">{p.meta}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Progress;