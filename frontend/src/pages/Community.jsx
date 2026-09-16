import { useEffect, useState } from 'react';
import { communityApi } from '../api/community';
import { Icon } from '../components/Icon';

const COMMUNITY_CSS = `
/* ============================================================
   COMMUNITY — Langut-inspired
   Deep purple + lime-yellow + chunky black outlines.
   ============================================================ */

.ec-com{
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

.ec-com,
.ec-com *{box-sizing:border-box}

/* ============================================================
   HEAD
   ============================================================ */
.ec-com-head{margin-bottom:22px}
.ec-com-eyebrow{
  margin:0 0 6px;font-size:11.5px;font-weight:900;
  letter-spacing:.16em;text-transform:uppercase;
  color:var(--lang-purple);opacity:.95;
}

/* ============================================================
   HERO — deep purple, chunky stats, mascot
   ============================================================ */
.ec-com-hero{
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
.ec-com-hero::before{
  content:'';position:absolute;inset:0;
  background-image:radial-gradient(rgba(255,255,255,.10) 1.4px,transparent 1.4px);
  background-size:20px 20px;
  mask-image:radial-gradient(circle at 15% 20%,#000,transparent 65%);
  -webkit-mask-image:radial-gradient(circle at 15% 20%,#000,transparent 65%);
  pointer-events:none;
}
.ec-com-hero-orb{
  position:absolute;top:-90px;right:180px;
  width:260px;height:260px;border-radius:50%;
  background:radial-gradient(circle,rgba(212,245,92,.22),transparent 68%);
  animation:ec-com-drift 14s ease-in-out infinite;
}
@keyframes ec-com-drift{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-18px,16px) scale(1.08)}}
.ec-com-hero-copy{position:relative;z-index:1;max-width:580px}
.ec-com-hero-badge{
  display:inline-flex;align-items:center;
  font-size:10.5px;font-weight:900;
  letter-spacing:.16em;text-transform:uppercase;
  padding:7px 14px;border-radius:999px;
  background:var(--lang-lime);color:var(--lang-ink);
  border:2px solid var(--lang-line);
  box-shadow:0 3px 0 rgba(0,0,0,.4);
  margin-bottom:16px;
}
.ec-com-hero h1{
  margin:0 0 10px;
  font-size:clamp(26px,2.4vw + 16px,38px);
  font-weight:900;
  letter-spacing:-.035em;
  line-height:1.1;
  color:#fff;
}
.ec-com-hero h1 em{font-style:normal;color:var(--lang-lime)}
.ec-com-hero p{
  margin:0 0 22px;
  font-size:14px;line-height:1.6;
  opacity:.92;font-weight:500;max-width:52ch;
}

/* Price-tag style stat chips */
.ec-com-hero-stats{display:flex;gap:10px;flex-wrap:wrap;position:relative;z-index:1}
.ec-com-hero-stat{
  display:flex;flex-direction:column;gap:2px;
  padding:9px 14px;
  border-radius:14px;
  background:var(--lang-lime);
  border:2px solid var(--lang-line);
  box-shadow:0 3px 0 var(--lang-line);
  min-width:80px;
}
.ec-com-hero-stat strong{
  font-size:20px;font-weight:900;line-height:1;
  letter-spacing:-.04em;
  color:var(--lang-ink);
}
.ec-com-hero-stat span{
  font-size:9.5px;font-weight:900;letter-spacing:.1em;
  text-transform:uppercase;color:var(--lang-ink);opacity:.75;
}
.ec-com-hero-stat:nth-child(2){background:var(--lang-pink)}
.ec-com-hero-stat:nth-child(3){background:var(--lang-purple-2)}
.ec-com-hero-stat:nth-child(3) strong,
.ec-com-hero-stat:nth-child(3) span{color:#fff}
.ec-com-hero-stat:nth-child(4){background:var(--lang-yellow)}

/* Mascot */
.ec-com-hero-mascot{
  position:relative;z-index:1;
  flex-shrink:0;
  display:flex;align-items:center;justify-content:center;
  filter:drop-shadow(0 14px 28px rgba(0,0,0,.28));
  animation:ec-com-bob 4s ease-in-out infinite;
}
@keyframes ec-com-bob{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-10px) rotate(2deg)}}

/* ============================================================
   TABS
   ============================================================ */
.ec-com-tabs{
  display:flex;gap:10px;overflow-x:auto;scrollbar-width:none;
  padding:6px 4px 16px;margin-bottom:8px;
}
.ec-com-tabs::-webkit-scrollbar{display:none}
.ec-com-tab{
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
.ec-com-tab:hover{
  background:var(--lang-lime-soft);
  transform:translateY(-2px);
  box-shadow:0 5px 0 var(--lang-line);
}
.ec-com-tab:active{
  transform:translateY(1px);
  box-shadow:0 1px 0 var(--lang-line);
}
.ec-com-tab--active{
  background:var(--lang-ink);color:var(--lang-lime);
  box-shadow:0 3px 0 var(--lang-ink);
}
.ec-com-tab svg{width:16px;height:16px}

/* ============================================================
   LIST
   ============================================================ */
.ec-com-list{display:flex;flex-direction:column;gap:14px}

/* ============================================================
   ROOMS
   ============================================================ */
.ec-com-room{
  position:relative;
  display:flex;align-items:center;gap:16px;
  padding:18px 20px;
  border-radius:22px;
  background:#fff;
  border:2px solid var(--lang-line);
  box-shadow:0 6px 0 var(--lang-line);
  transition:transform .2s ease,box-shadow .2s ease;
  overflow:hidden;
  background-image:radial-gradient(circle at 100% 0%,rgba(212,245,92,.08),transparent 55%);
}
.ec-com-room:hover{
  transform:translateY(-3px);
  box-shadow:0 9px 0 var(--lang-line);
}
.ec-com-room--locked{
  background-image:radial-gradient(circle at 100% 0%,rgba(255,143,203,.10),transparent 55%);
}
.ec-com-room-icon{
  width:52px;height:52px;border-radius:16px;
  display:flex;align-items:center;justify-content:center;
  background:var(--lang-lime);
  color:var(--lang-ink);
  border:2px solid var(--lang-line);
  box-shadow:0 3px 0 var(--lang-line);
  flex-shrink:0;
  transition:transform .2s ease;
}
.ec-com-room:hover .ec-com-room-icon{
  transform:scale(1.06) rotate(-3deg);
}
.ec-com-room--locked .ec-com-room-icon{
  background:var(--lang-pink-2);
  color:#fff;
}
.ec-com-room-icon svg{width:24px;height:24px}
.ec-com-room-body{flex:1;min-width:0}
.ec-com-room-name{
  margin:0 0 6px;font-size:15px;font-weight:900;
  color:var(--lang-ink);line-height:1.3;
  letter-spacing:-.01em;
}
.ec-com-room-meta{
  display:flex;align-items:center;gap:8px;
  font-size:11.5px;color:var(--lang-ink-soft);
  flex-wrap:wrap;font-weight:700;
}
.ec-com-chip{
  display:inline-flex;align-items:center;gap:4px;
  font-size:10.5px;font-weight:900;
  letter-spacing:.06em;text-transform:uppercase;
  padding:4px 10px;border-radius:999px;
  border:2px solid var(--lang-line);
  box-shadow:0 2px 0 var(--lang-line);
}
.ec-com-chip--open     {background:var(--lang-lime);   color:var(--lang-ink)}
.ec-com-chip--locked   {background:var(--lang-pink-2); color:#fff}
.ec-com-chip--gold     {background:var(--lang-yellow); color:var(--lang-ink)}
.ec-com-chip--platinum {background:var(--lang-purple-2);color:#fff}
.ec-com-chip--bronze   {background:var(--lang-pink);   color:var(--lang-ink)}
.ec-com-room-live{
  display:inline-flex;align-items:center;gap:5px;
  font-size:10.5px;font-weight:900;
  color:var(--lang-ink);
  background:var(--lang-lime-soft);
  padding:4px 10px;border-radius:999px;
  border:2px solid var(--lang-line);
  box-shadow:0 2px 0 var(--lang-line);
  text-transform:uppercase;letter-spacing:.06em;
}
.ec-com-room-live-dot{
  width:7px;height:7px;border-radius:50%;
  background:var(--lang-ink);
  animation:ec-com-pulse 1.6s ease-out infinite;
}
@keyframes ec-com-pulse{
  0%{box-shadow:0 0 0 0 rgba(23,16,46,.5)}
  100%{box-shadow:0 0 0 10px rgba(23,16,46,0)}
}

.ec-com-enter{
  border:2px solid var(--lang-line);
  background:var(--lang-ink);color:var(--lang-lime);
  padding:11px 20px;border-radius:999px;
  font-size:12.5px;font-weight:900;
  cursor:pointer;font-family:inherit;
  transition:transform .16s ease,box-shadow .16s ease;
  white-space:nowrap;flex-shrink:0;
  display:inline-flex;align-items:center;gap:6px;
  box-shadow:0 4px 0 var(--lang-line);
  letter-spacing:.03em;
}
.ec-com-enter:hover:not(:disabled){
  transform:translateY(-2px);
  box-shadow:0 6px 0 var(--lang-line);
}
.ec-com-enter:active:not(:disabled){
  transform:translateY(2px);
  box-shadow:0 1px 0 var(--lang-line);
}
.ec-com-enter:disabled{
  background:#E8E5F2;
  color:var(--lang-ink-soft);
  cursor:not-allowed;
  box-shadow:0 4px 0 var(--lang-line);
}

/* ============================================================
   THREADS
   ============================================================ */
.ec-com-thread-panel{
  background:#fff;
  border:3px solid var(--lang-line);
  border-radius:26px;
  padding:22px;
  box-shadow:0 8px 0 var(--lang-line);
  background-image:radial-gradient(circle at 100% 0%,rgba(212,245,92,.10),transparent 55%);
}
.ec-com-composer{
  display:flex;gap:12px;margin-bottom:22px;flex-wrap:wrap;
}
.ec-com-composer input{
  flex:1;min-width:180px;
  border:2px solid var(--lang-line);
  border-radius:999px;
  padding:12px 20px;
  font-size:13.5px;font-weight:700;
  outline:none;
  background:#fff;color:var(--lang-ink);
  font-family:inherit;
  box-shadow:0 3px 0 var(--lang-line);
  transition:box-shadow .18s ease;
}
.ec-com-composer input:focus{
  box-shadow:0 3px 0 var(--lang-line),0 0 0 4px rgba(212,245,92,.5);
}
.ec-com-composer input::placeholder{
  color:var(--lang-ink-soft);font-weight:500;
}
.ec-com-composer button{
  border:2px solid var(--lang-line);
  background:var(--lang-lime);color:var(--lang-ink);
  padding:12px 24px;border-radius:999px;
  font-size:12.5px;font-weight:900;
  cursor:pointer;font-family:inherit;
  transition:transform .16s ease,box-shadow .16s ease;
  white-space:nowrap;
  box-shadow:0 4px 0 var(--lang-line);
  letter-spacing:.04em;
}
.ec-com-composer button:hover:not(:disabled){
  transform:translateY(-2px);
  box-shadow:0 6px 0 var(--lang-line);
}
.ec-com-composer button:active:not(:disabled){
  transform:translateY(2px);
  box-shadow:0 1px 0 var(--lang-line);
}
.ec-com-composer button:disabled{
  opacity:.5;cursor:not-allowed;
}

.ec-com-thread{
  display:flex;gap:14px;
  padding:16px 0;
  border-bottom:2px dashed rgba(23,16,46,.12);
  transition:transform .15s ease;
}
.ec-com-thread:last-child{
  border-bottom:none;padding-bottom:0;
}
.ec-com-thread:hover{
  transform:translateX(3px);
}
.ec-com-thread-avatar{
  width:42px;height:42px;border-radius:14px;
  background:var(--lang-purple-2);
  color:#fff;
  flex-shrink:0;
  display:flex;align-items:center;justify-content:center;
  font-size:15px;font-weight:900;
  border:2px solid var(--lang-line);
  box-shadow:0 3px 0 var(--lang-line);
}
.ec-com-thread-body{flex:1;min-width:0}
.ec-com-thread-title{
  margin:0 0 5px;font-size:14px;font-weight:900;
  color:var(--lang-ink);line-height:1.4;
  letter-spacing:-.01em;
}
.ec-com-thread-meta{
  font-size:11.5px;color:var(--lang-ink-soft);
  font-weight:700;
}
.ec-com-thread-meta strong{
  color:var(--lang-ink);font-weight:900;
}

/* ============================================================
   SQUADS
   ============================================================ */
.ec-com-squad{
  position:relative;
  background:#fff;
  border:2px solid var(--lang-line);
  border-radius:24px;
  padding:22px;
  box-shadow:0 6px 0 var(--lang-line);
  transition:transform .2s ease,box-shadow .2s ease;
  overflow:hidden;
  background-image:radial-gradient(circle at 100% 0%,rgba(212,245,92,.12),transparent 55%);
}
.ec-com-squad:hover{
  transform:translateY(-3px);
  box-shadow:0 9px 0 var(--lang-line);
}
.ec-com-squad-head{
  display:flex;justify-content:space-between;align-items:center;
  gap:12px;margin-bottom:16px;position:relative;z-index:1;
  flex-wrap:wrap;
}
.ec-com-squad-name{
  margin:0;font-size:16px;font-weight:900;
  color:var(--lang-ink);
  display:flex;align-items:center;gap:10px;
  letter-spacing:-.01em;
}
.ec-com-squad-crest{
  width:34px;height:34px;border-radius:11px;
  background:var(--lang-lime);
  color:var(--lang-ink);
  display:flex;align-items:center;justify-content:center;
  font-size:15px;font-weight:900;
  border:2px solid var(--lang-line);
  box-shadow:0 3px 0 var(--lang-line);
}
.ec-com-squad-members{
  font-size:11px;font-weight:900;
  color:var(--lang-ink);
  background:var(--lang-pink);
  border:2px solid var(--lang-line);
  padding:4px 11px;border-radius:999px;
  box-shadow:0 2px 0 var(--lang-line);
  text-transform:uppercase;letter-spacing:.06em;
}
.ec-com-squad-progress{
  position:relative;z-index:1;
  height:14px;border-radius:999px;
  background:#E8E5F2;overflow:hidden;
  margin-bottom:12px;
  border:2px solid var(--lang-line);
}
.ec-com-squad-fill{
  height:100%;border-radius:999px;
  background:linear-gradient(90deg,#D4F55C,#B8E62E);
  transition:width 1s cubic-bezier(.22,1,.36,1);
}
.ec-com-squad-foot{
  position:relative;z-index:1;
  display:flex;justify-content:space-between;align-items:center;
  font-size:12px;color:var(--lang-ink-soft);
  gap:10px;flex-wrap:wrap;font-weight:700;
}
.ec-com-squad-foot strong{
  color:var(--lang-ink);font-weight:900;
}
.ec-com-squad-join{
  border:2px solid var(--lang-line);
  background:var(--lang-ink);color:var(--lang-lime);
  padding:10px 18px;border-radius:999px;
  font-size:12px;font-weight:900;
  cursor:pointer;font-family:inherit;
  transition:transform .16s ease,box-shadow .16s ease;
  box-shadow:0 4px 0 var(--lang-line);
  letter-spacing:.03em;
}
.ec-com-squad-join:hover{
  transform:translateY(-2px);
  box-shadow:0 6px 0 var(--lang-line);
}
.ec-com-squad-join:active{
  transform:translateY(2px);
  box-shadow:0 1px 0 var(--lang-line);
}

/* ============================================================
   CTA ROW
   ============================================================ */
.ec-com-cta-row{
  display:flex;gap:12px;flex-wrap:wrap;margin-top:18px;
}
.ec-com-btn-ghost{
  border:2px solid var(--lang-line);
  background:#fff;color:var(--lang-ink);
  padding:11px 22px;border-radius:999px;
  font-size:13px;font-weight:900;
  cursor:pointer;font-family:inherit;
  transition:transform .16s ease,box-shadow .16s ease;
  display:inline-flex;align-items:center;gap:8px;
  box-shadow:0 4px 0 var(--lang-line);
  letter-spacing:.02em;
}
.ec-com-btn-ghost:hover{
  background:var(--lang-lime-soft);
  transform:translateY(-2px);
  box-shadow:0 6px 0 var(--lang-line);
}
.ec-com-btn-ghost:active{
  transform:translateY(2px);
  box-shadow:0 1px 0 var(--lang-line);
}
.ec-com-btn-ghost svg{width:15px;height:15px}

/* ============================================================
   EMPTY
   ============================================================ */
.ec-com-empty{
  text-align:center;padding:52px 24px;
  color:var(--lang-ink-soft);
  font-size:13.5px;font-weight:700;
  background:#fff;
  border-radius:22px;
  border:2px dashed var(--lang-line);
}

/* ============================================================
   ANIMATIONS
   ============================================================ */
@keyframes ec-com-fade-in{
  from{opacity:0;transform:translateY(12px)}
  to{opacity:1;transform:translateY(0)}
}
.ec-com-anim{animation:ec-com-fade-in .45s ease both}

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media(max-width:900px){
  .ec-com-hero{flex-direction:column;align-items:flex-start;min-height:0}
  .ec-com-hero-mascot{
    position:absolute;right:14px;bottom:14px;
    transform:scale(.72);transform-origin:bottom right;
    animation:none;
  }
}
@media(max-width:720px){
  .ec-com-head{margin-bottom:16px}
  .ec-com-hero{padding:22px 20px;border-radius:26px}
  .ec-com-hero h1{font-size:22px}
  .ec-com-hero p{font-size:13px}
  .ec-com-hero-stats{gap:8px;margin-top:14px}
  .ec-com-hero-stat{padding:8px 12px;min-width:74px;border-radius:12px}
  .ec-com-hero-stat strong{font-size:17px}
  .ec-com-hero-stat span{font-size:9px}
  .ec-com-hero-mascot{display:none}

  .ec-com-tab{padding:10px 15px;font-size:12.5px}

  .ec-com-room{
    padding:14px 16px;
    border-radius:20px;
    box-shadow:0 5px 0 var(--lang-line);
    flex-wrap:wrap;
  }
  .ec-com-room-icon{width:44px;height:44px;border-radius:14px}
  .ec-com-room-icon svg{width:20px;height:20px}
  .ec-com-room-name{font-size:14px}
  .ec-com-enter{
    width:100%;order:3;margin-top:10px;justify-content:center;
  }

  .ec-com-thread-panel{
    padding:18px;border-radius:22px;
    box-shadow:0 6px 0 var(--lang-line);
  }
  .ec-com-composer input{font-size:16px}

  .ec-com-squad{
    padding:18px;border-radius:22px;
    box-shadow:0 5px 0 var(--lang-line);
  }
  .ec-com-squad-head{gap:8px}
  .ec-com-squad-join{width:100%;margin-top:6px}
  .ec-com-squad-foot{flex-direction:column;align-items:stretch}
  .ec-com-squad-foot .ec-com-squad-join{
    margin-top:10px;
  }

  .ec-com-cta-row{flex-direction:column}
  .ec-com-btn-ghost{width:100%;justify-content:center}
}
@media(prefers-reduced-motion:reduce){
  .ec-com-anim{animation:none}
  .ec-com-hero-orb,.ec-com-hero-mascot{animation:none}
  .ec-com-room-live-dot{animation:none}
  .ec-com-squad-fill{transition:none}
  .ec-com-room:hover,.ec-com-room:hover .ec-com-room-icon,
  .ec-com-tab:hover,.ec-com-enter:hover:not(:disabled),
  .ec-com-composer button:hover:not(:disabled),
  .ec-com-squad:hover,.ec-com-squad-join:hover,
  .ec-com-btn-ghost:hover,.ec-com-thread:hover{transform:none}
}
`;

/* ---------- Fallback data ---------- */
const ROOMS = [
  { id: 'r1', name: 'Beginner Lounge',     minRank: 'Bronze',   locked: false, live: 24, topic: 'Casual English chat' },
  { id: 'r2', name: 'Grammar Help Desk',   minRank: 'Bronze',   locked: false, live: 12, topic: 'Ask grammar questions' },
  { id: 'r3', name: 'IELTS Warriors',      minRank: 'Gold',     locked: true,  live: 41, topic: 'IELTS strategy & mocks' },
  { id: 'r4', name: 'Top 100 Club',        minRank: 'Platinum', locked: true,  live: 8,  topic: 'Elite study circle' },
];

const THREADS = [
  { id: 't1', title: 'Difference between "since" and "for"?', author: 'Nabila', replies: 4 },
  { id: 't2', title: 'Best way to remember phrasal verbs?',   author: 'Tanvir', replies: 9 },
  { id: 't3', title: 'How to stay consistent with daily practice?', author: 'Arif', replies: 15 },
];

const SQUADS = [
  { id: 'sq1', name: 'Vocab Vikings',     members: 6, groupXp: 3400, goal: 5000, crest: 'V' },
  { id: 'sq2', name: 'Grammar Guardians', members: 4, groupXp: 1200, goal: 3000, crest: 'G' },
  { id: 'sq3', name: 'Speaking Stars',    members: 5, groupXp: 2100, goal: 4000, crest: 'S' },
];

const TABS = [
  { id: 'rooms',   label: 'Rooms',   icon: 'chat' },
  { id: 'threads', label: 'Threads', icon: 'users' },
  { id: 'squads',  label: 'Squads',  icon: 'trophy' },
];

function rankChipClass(rank) {
  const r = (rank || '').toLowerCase();
  if (r === 'gold')     return 'ec-com-chip ec-com-chip--gold';
  if (r === 'platinum') return 'ec-com-chip ec-com-chip--platinum';
  if (r === 'bronze')   return 'ec-com-chip ec-com-chip--bronze';
  return 'ec-com-chip';
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

/* ---------- Component ---------- */
export function Community() {
  const [tab, setTab] = useState('rooms');
  const [rooms, setRooms] = useState([]);
  const [threads, setThreads] = useState([]);
  const [squads, setSquads] = useState([]);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    communityApi.rooms()
      .then((r) => setRooms(r?.length ? r : ROOMS))
      .catch(() => setRooms(ROOMS));

    communityApi.squads()
      .then((s) => setSquads(s?.length ? s : SQUADS))
      .catch(() => setSquads(SQUADS));
  }, []);

  useEffect(() => {
    if (!rooms[0]) return;
    communityApi.threads(rooms[0].id)
      .then((t) => setThreads(t?.length ? t : THREADS))
      .catch(() => setThreads(THREADS));
  }, [rooms]);

  const totalLive = rooms.reduce((s, r) => s + (r.live || 0), 0);
  const openRooms = rooms.filter((r) => !r.locked).length;

  const postThread = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    setThreads((prev) => [
      { id: `local-${Date.now()}`, title: trimmed, author: 'You', replies: 0 },
      ...prev,
    ]);
    setDraft('');
  };

  return (
    <div className="ec-com">
      <style>{COMMUNITY_CSS}</style>

      {/* Hero */}
      <div className="ec-com-hero ec-com-anim">
        <div className="ec-com-hero-orb" aria-hidden="true" />
        <div className="ec-com-hero-copy">
          <span className="ec-com-hero-badge">Community</span>
          <h1>Learn together, <em>level up</em> faster</h1>
          <p>Rank-gated rooms, peer help threads and study squads — all moderated, all focused on English.</p>
          <div className="ec-com-hero-stats">
            <div className="ec-com-hero-stat">
              <strong>{rooms.length}</strong>
              <span>Rooms</span>
            </div>
            <div className="ec-com-hero-stat">
              <strong>{openRooms}</strong>
              <span>Open now</span>
            </div>
            <div className="ec-com-hero-stat">
              <strong>{totalLive}</strong>
              <span>Online</span>
            </div>
            <div className="ec-com-hero-stat">
              <strong>{squads.length}</strong>
              <span>Squads</span>
            </div>
          </div>
        </div>
        <div className="ec-com-hero-mascot">
          <LangutMascot size={170} />
        </div>
      </div>

      {/* Tabs */}
      <div className="ec-com-tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={`ec-com-tab${tab === t.id ? ' ec-com-tab--active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            <Icon name={t.icon} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Rooms */}
      {tab === 'rooms' && (
        <div className="ec-com-list ec-com-anim" key="rooms">
          {rooms.length === 0 ? (
            <div className="ec-com-empty">No rooms available yet — check back soon.</div>
          ) : (
            rooms.map((r, i) => (
              <div
                key={r.id}
                className={`ec-com-room ec-com-anim${r.locked ? ' ec-com-room--locked' : ''}`}
                style={{ animationDelay: `${0.05 + i * 0.05}s` }}
              >
                <span className="ec-com-room-icon">
                  <Icon name={r.locked ? 'logout' : 'chat'} />
                </span>
                <div className="ec-com-room-body">
                  <p className="ec-com-room-name">{r.name}</p>
                  <div className="ec-com-room-meta">
                    {r.locked ? (
                      <span className={`${rankChipClass(r.minRank)}`}>
                        🔒 {r.minRank}
                      </span>
                    ) : (
                      <span className="ec-com-chip ec-com-chip--open">Open</span>
                    )}
                    {r.live > 0 && (
                      <span className="ec-com-room-live">
                        <span className="ec-com-room-live-dot" />
                        {r.live} online
                      </span>
                    )}
                    {r.topic && <span>· {r.topic}</span>}
                  </div>
                </div>
                <button className="ec-com-enter" disabled={r.locked}>
                  {r.locked ? 'Locked' : <>Enter <span aria-hidden="true">→</span></>}
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Threads */}
      {tab === 'threads' && (
        <div className="ec-com-thread-panel ec-com-anim" key="threads">
          <div className="ec-com-composer">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') postThread(); }}
              placeholder="Ask the community a question…"
              aria-label="Ask the community a question"
            />
            <button onClick={postThread} disabled={!draft.trim()}>Post</button>
          </div>

          {threads.length === 0 ? (
            <div className="ec-com-empty">No threads yet. Be the first to ask!</div>
          ) : (
            threads.map((t) => (
              <div className="ec-com-thread" key={t.id}>
                <span className="ec-com-thread-avatar" aria-hidden="true">
                  {(t.author || '?').charAt(0).toUpperCase()}
                </span>
                <div className="ec-com-thread-body">
                  <p className="ec-com-thread-title">{t.title}</p>
                  <p className="ec-com-thread-meta">
                    Asked by <strong>{t.author}</strong> · {t.replies} {t.replies === 1 ? 'reply' : 'replies'} · admin-moderated
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Squads */}
      {tab === 'squads' && (
        <div className="ec-com-list ec-com-anim" key="squads">
          {squads.map((s, i) => {
            const pct = Math.min(100, Math.round((s.groupXp / s.goal) * 100));
            return (
              <div
                key={s.id}
                className="ec-com-squad ec-com-anim"
                style={{ animationDelay: `${0.05 + i * 0.05}s` }}
              >
                <div className="ec-com-squad-head">
                  <p className="ec-com-squad-name">
                    <span className="ec-com-squad-crest">{s.crest || s.name.charAt(0)}</span>
                    {s.name}
                  </p>
                  <span className="ec-com-squad-members">{s.members} members</span>
                </div>

                <div className="ec-com-squad-progress">
                  <div className="ec-com-squad-fill" style={{ width: `${pct}%` }} />
                </div>

                <div className="ec-com-squad-foot">
                  <span><strong>{s.groupXp.toLocaleString()}</strong> / {s.goal.toLocaleString()} group XP · {pct}%</span>
                  <button className="ec-com-squad-join">Join squad</button>
                </div>
              </div>
            );
          })}

          <div className="ec-com-cta-row">
            <button className="ec-com-btn-ghost">
              <span aria-hidden="true">+</span> Create a squad
            </button>
            <button className="ec-com-btn-ghost">
              <Icon name="search" /> Browse all squads
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Community;