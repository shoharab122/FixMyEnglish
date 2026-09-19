import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { examsApi } from '../api/exams';
import { useAuth } from '../context/AuthContext';
import { RequireTier } from '../components/RequireTier';
import { Icon } from '../components/Icon';

const EXAM_CSS = `
/* ============================================================
   SHARED TOKENS
   These MUST be declared on every top-level overlay class,
   otherwise every \`var(--lang-*)\` inside .ec-session-* resolves
   to nothing and the selected-option style silently disappears.
   ============================================================ */
.ec-exam,
.ec-session-overlay,
.ec-session-result{
  --lang-bg:#1E1252;--lang-bg-2:#2A1A6E;--lang-bg-3:#3B2596;
  --lang-lime:#D4F55C;--lang-lime-2:#E4FF5C;--lang-lime-soft:#EDFFB0;--lang-lime-deep:#B8E62E;
  --lang-yellow:#F5E04D;--lang-purple:#7B5CF0;--lang-purple-2:#9B7BFF;
  --lang-pink:#FFB3D1;--lang-pink-2:#FF8FCB;--lang-danger:#E0503C;
  --lang-ink:#17102E;--lang-ink-soft:#6B6488;--lang-line:#17102E;
}

.ec-exam,
.ec-exam *,
.ec-session-overlay,
.ec-session-overlay *,
.ec-session-result,
.ec-session-result *{box-sizing:border-box}

/* ============================================================
   MAIN PAGE
   ============================================================ */
.ec-exam-head{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:18px}
.ec-exam-eyebrow{margin:0 0 6px;font-size:11.5px;font-weight:900;letter-spacing:.16em;text-transform:uppercase;color:var(--lang-purple)}

/* Live papers section */
.ec-papers{margin-bottom:26px}
.ec-papers-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px;flex-wrap:wrap}
.ec-papers-title{margin:0;font-size:17px;font-weight:900;color:var(--lang-ink);letter-spacing:-.02em}
.ec-papers-badge{font-size:10.5px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;padding:5px 12px;border-radius:999px;background:var(--lang-pink-2);color:#fff;border:2px solid var(--lang-line);box-shadow:0 2px 0 var(--lang-line)}
.ec-papers-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px}
.ec-paper-card{position:relative;background:#fff;border:3px solid var(--lang-line);border-radius:22px;padding:20px;box-shadow:0 8px 0 var(--lang-line);transition:all .18s ease;background-image:radial-gradient(circle at 100% 0%,rgba(212,245,92,.14),transparent 55%);display:flex;flex-direction:column;gap:14px}
.ec-paper-card:hover{transform:translateY(-3px);box-shadow:0 11px 0 var(--lang-line)}
.ec-paper-card--live{border-color:var(--lang-danger);box-shadow:0 8px 0 var(--lang-danger);background-image:radial-gradient(circle at 100% 0%,rgba(255,143,203,.22),transparent 55%)}
.ec-paper-card-top{display:flex;align-items:flex-start;gap:12px}
.ec-paper-icon{width:48px;height:48px;border-radius:14px;background:var(--lang-lime);color:var(--lang-ink);display:flex;align-items:center;justify-content:center;flex-shrink:0;border:2px solid var(--lang-line);box-shadow:0 3px 0 var(--lang-line)}
.ec-paper-icon svg{width:22px;height:22px}
.ec-paper-body{flex:1;min-width:0}
.ec-paper-title{margin:0 0 6px;font-size:15px;font-weight:900;color:var(--lang-ink);line-height:1.3}
.ec-paper-live-pill{display:inline-flex;align-items:center;gap:5px;font-size:10px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;background:var(--lang-danger);color:#fff;padding:3px 9px;border-radius:999px;border:2px solid var(--lang-line);margin-left:6px}
.ec-paper-meta{display:flex;gap:8px;flex-wrap:wrap;font-size:11.5px;font-weight:800;color:var(--lang-ink-soft)}
.ec-paper-cta{display:flex;gap:8px}
.ec-paper-btn{flex:1;display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:11px 16px;border-radius:999px;font-family:inherit;font-size:12.5px;font-weight:900;cursor:pointer;text-decoration:none;border:2px solid var(--lang-line);box-shadow:0 4px 0 var(--lang-line);transition:all .15s ease}
.ec-paper-btn:hover{transform:translateY(-2px);box-shadow:0 6px 0 var(--lang-line)}
.ec-paper-btn--live{background:var(--lang-danger);color:#fff}
.ec-paper-btn--soon{background:var(--lang-lime);color:var(--lang-ink)}

/* Track tabs */
.ec-exam-tracks{display:flex;gap:10px;overflow-x:auto;scrollbar-width:none;padding:6px 4px 16px;margin-bottom:8px}
.ec-exam-tracks::-webkit-scrollbar{display:none}
.ec-exam-track{flex:0 0 auto;display:inline-flex;align-items:center;gap:8px;padding:11px 18px;border-radius:999px;border:2px solid var(--lang-line);background:#fff;color:var(--lang-ink);font-size:13px;font-weight:900;cursor:pointer;white-space:nowrap;font-family:inherit;transition:all .18s ease;box-shadow:0 3px 0 var(--lang-line)}
.ec-exam-track:hover{background:var(--lang-lime-soft);transform:translateY(-2px);box-shadow:0 5px 0 var(--lang-line)}
.ec-exam-track--active{background:var(--lang-ink);color:var(--lang-lime);box-shadow:0 3px 0 var(--lang-ink)}
.ec-exam-track svg{width:16px;height:16px}

/* Grid */
.ec-exam-grid{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:clamp(20px,3vw,28px);align-items:start}

/* Hero */
.ec-exam-hero{position:relative;overflow:hidden;border-radius:32px;padding:clamp(26px,4vw,38px) clamp(24px,4vw,40px);color:#fff;background:linear-gradient(140deg,#2A1A6E 0%,#1E1252 55%,#3B2596 100%);box-shadow:0 20px 52px rgba(30,18,82,.34);border:2px solid var(--lang-line);margin-bottom:22px;min-height:220px;display:flex;align-items:center;justify-content:space-between;gap:20px}
.ec-exam-hero::before{content:'';position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.10) 1.4px,transparent 1.4px);background-size:20px 20px;mask-image:radial-gradient(circle at 15% 20%,#000,transparent 65%);-webkit-mask-image:radial-gradient(circle at 15% 20%,#000,transparent 65%);pointer-events:none}
.ec-exam-hero-orb{position:absolute;top:-90px;right:180px;width:240px;height:240px;border-radius:50%;background:radial-gradient(circle,rgba(212,245,92,.22),transparent 68%);animation:ecExamDrift 14s ease-in-out infinite}
@keyframes ecExamDrift{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-18px,16px) scale(1.08)}}
.ec-exam-hero-copy{position:relative;z-index:1;max-width:560px}
.ec-exam-hero-badge{display:inline-flex;align-items:center;font-size:10.5px;font-weight:900;letter-spacing:.16em;text-transform:uppercase;padding:7px 14px;border-radius:999px;background:var(--lang-lime);color:var(--lang-ink);border:2px solid var(--lang-line);box-shadow:0 3px 0 rgba(0,0,0,.4);margin-bottom:16px}
.ec-exam-hero h2{margin:0 0 10px;font-size:clamp(24px,2.2vw + 16px,34px);font-weight:900;letter-spacing:-.035em;line-height:1.12;color:#fff}
.ec-exam-hero h2 em{font-style:normal;color:var(--lang-lime)}
.ec-exam-hero p{margin:0 0 22px;font-size:14px;line-height:1.6;opacity:.92;font-weight:500;max-width:52ch}
.ec-exam-hero-stats{display:flex;gap:10px;flex-wrap:wrap;position:relative;z-index:1}
.ec-exam-hero-stat{display:flex;flex-direction:column;gap:2px;padding:9px 14px;border-radius:14px;background:var(--lang-lime);border:2px solid var(--lang-line);box-shadow:0 3px 0 var(--lang-line);min-width:86px}
.ec-exam-hero-stat strong{font-size:20px;font-weight:900;line-height:1;letter-spacing:-.04em;color:var(--lang-ink)}
.ec-exam-hero-stat span{font-size:9.5px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:var(--lang-ink);opacity:.75}
.ec-exam-hero-stat:nth-child(2){background:var(--lang-pink)}
.ec-exam-hero-stat:nth-child(3){background:var(--lang-purple-2)}
.ec-exam-hero-stat:nth-child(3) strong,.ec-exam-hero-stat:nth-child(3) span{color:#fff}
.ec-exam-hero-mascot{position:relative;z-index:1;flex-shrink:0;display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 14px 28px rgba(0,0,0,.28));animation:ecExamBob 4s ease-in-out infinite}
@keyframes ecExamBob{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-10px) rotate(2deg)}}

/* Sections */
.ec-exam-sections-title{margin:0 0 14px;font-size:17px;font-weight:900;color:var(--lang-ink);letter-spacing:-.02em}
.ec-exam-sections{display:flex;flex-direction:column;gap:14px}
.ec-exam-section-card{display:flex;align-items:center;gap:16px;padding:18px 20px;border-radius:22px;background:#fff;border:3px solid var(--lang-line);box-shadow:0 8px 0 var(--lang-line);transition:all .18s ease;background-image:radial-gradient(circle at 100% 0%,rgba(212,245,92,.12),transparent 55%)}
.ec-exam-section-card:hover{transform:translateY(-3px);box-shadow:0 11px 0 var(--lang-line)}
.ec-exam-section-icon{width:48px;height:48px;border-radius:14px;display:flex;align-items:center;justify-content:center;background:var(--lang-lime);color:var(--lang-ink);border:2px solid var(--lang-line);box-shadow:0 3px 0 var(--lang-line);flex-shrink:0}
.ec-exam-section-icon svg{width:22px;height:22px}
.ec-exam-section-body{flex:1;min-width:0}
.ec-exam-section-title{margin:0 0 6px;font-size:15px;font-weight:900;color:var(--lang-ink)}
.ec-exam-section-meta{display:flex;gap:8px;align-items:center;font-size:11.5px;color:var(--lang-ink-soft);flex-wrap:wrap;font-weight:700}
.ec-exam-chip{padding:3px 10px;border-radius:999px;background:var(--lang-purple-2);color:#fff;border:2px solid var(--lang-line);font-weight:900;font-size:10.5px;text-transform:uppercase;letter-spacing:.06em;box-shadow:0 2px 0 var(--lang-line)}
.ec-exam-start{border:2px solid var(--lang-line);background:var(--lang-ink);color:var(--lang-lime);padding:11px 20px;border-radius:999px;font-size:12.5px;font-weight:900;cursor:pointer;white-space:nowrap;font-family:inherit;transition:all .16s ease;box-shadow:0 4px 0 var(--lang-line)}
.ec-exam-start:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 6px 0 var(--lang-line)}
.ec-exam-start:disabled{opacity:.55;cursor:wait}

/* Countdown */
.ec-exam-countdown{background:#fff;border:3px solid var(--lang-line);border-radius:28px;padding:24px;box-shadow:0 8px 0 var(--lang-line);text-align:center;background-image:radial-gradient(circle at 100% 0%,rgba(255,143,203,.15),transparent 55%)}
.ec-exam-countdown h3{margin:0 0 14px;font-size:14px;font-weight:900;color:var(--lang-ink);text-transform:uppercase}
.ec-exam-ring{position:relative;width:150px;height:150px;margin:8px auto 14px;display:flex;align-items:center;justify-content:center}
.ec-exam-ring svg{position:absolute;inset:0;transform:rotate(-90deg)}
.ec-exam-ring-circle{fill:none;stroke:#E8E5F2;stroke-width:10}
.ec-exam-ring-progress{fill:none;stroke:url(#ecExamGrad);stroke-width:10;stroke-linecap:round;transition:stroke-dashoffset 1.2s cubic-bezier(.22,1,.36,1)}
.ec-exam-ring-content{position:relative;z-index:1;text-align:center}
.ec-exam-days{display:block;font-size:42px;font-weight:900;color:var(--lang-ink);line-height:1}
.ec-exam-days-label{font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:.1em;color:var(--lang-ink-soft);margin-top:4px;display:block}
.ec-exam-countdown p{font-size:12.5px;color:var(--lang-ink-soft);margin:0 0 16px;line-height:1.55;font-weight:700}
.ec-exam-date-input{width:100%;padding:12px 14px;border:2px solid var(--lang-line);border-radius:14px;font-size:14px;font-weight:700;background:#fff;color:var(--lang-ink);margin-bottom:12px;outline:none;font-family:inherit;box-shadow:0 3px 0 var(--lang-line)}
.ec-exam-btn-primary{width:100%;border:2px solid var(--lang-line);background:var(--lang-lime);color:var(--lang-ink);padding:13px 20px;border-radius:999px;font-size:13.5px;font-weight:900;cursor:pointer;font-family:inherit;transition:all .16s ease;box-shadow:0 4px 0 var(--lang-line)}
.ec-exam-btn-ghost{width:100%;border:2px solid var(--lang-line);background:#fff;color:var(--lang-ink);padding:12px 20px;border-radius:999px;font-size:13px;font-weight:900;cursor:pointer;font-family:inherit;transition:all .16s ease;margin-top:10px;box-shadow:0 4px 0 var(--lang-line)}
.ec-exam-plan{margin-top:20px;background:#fff;border:3px solid var(--lang-line);border-radius:28px;padding:22px;box-shadow:0 8px 0 var(--lang-line)}
.ec-exam-plan h3{margin:0 0 16px;font-size:15px;font-weight:900;color:var(--lang-ink);display:flex;align-items:center;justify-content:space-between;gap:8px}
.ec-exam-plan h3 span{font-size:10.5px;color:var(--lang-ink);background:var(--lang-lime);border:2px solid var(--lang-line);padding:4px 11px;border-radius:999px;font-weight:900;text-transform:uppercase;letter-spacing:.06em;box-shadow:0 2px 0 var(--lang-line)}
.ec-exam-plan-item{display:flex;gap:12px;align-items:flex-start;padding:13px 0;border-bottom:2px dashed rgba(23,16,46,.1)}
.ec-exam-plan-item:last-child{border-bottom:none;padding-bottom:0}
.ec-exam-plan-icon{width:34px;height:34px;border-radius:11px;background:var(--lang-purple-2);color:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:2px solid var(--lang-line);box-shadow:0 2px 0 var(--lang-line)}
.ec-exam-plan-icon svg{width:16px;height:16px}
.ec-exam-plan-body p{margin:0 0 3px;font-size:13px;font-weight:900;color:var(--lang-ink)}
.ec-exam-plan-body span{font-size:11.5px;color:var(--lang-ink-soft);font-weight:700}

/* ============================================================
   EXAM SESSION OVERLAY
   ============================================================ */
.ec-session-overlay{
  position:fixed;inset:0;z-index:9999;
  background:#F8F9FC;
  display:flex;flex-direction:column;overflow-y:auto;
  animation:ecSessionFadeIn .3s ease both;
}
@keyframes ecSessionFadeIn{from{opacity:0}to{opacity:1}}

.ec-session-head{
  position:sticky;top:0;z-index:5;
  display:flex;align-items:center;justify-content:space-between;gap:12px;
  padding:14px 20px;background:#fff;
  border-bottom:2px solid var(--lang-line);flex-wrap:wrap;
}
.ec-session-title{font-size:15px;font-weight:900;color:var(--lang-ink);margin:0}

.ec-session-timer{
  display:inline-flex;align-items:center;gap:7px;
  padding:8px 16px;border-radius:999px;
  background:var(--lang-lime);color:var(--lang-ink);
  font-size:13px;font-weight:900;
  border:2px solid var(--lang-line);
  box-shadow:0 3px 0 var(--lang-line);
  font-variant-numeric:tabular-nums;
  transition:background .3s ease,color .3s ease;
}
.ec-session-timer--warn{background:var(--lang-yellow)}
.ec-session-timer--danger{
  background:var(--lang-pink-2);color:#fff;
  animation:ecWarn 1.4s ease-in-out infinite;
}
@keyframes ecWarn{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}

.ec-session-close{
  border:2px solid var(--lang-line);background:#fff;color:var(--lang-ink);
  padding:8px 14px;border-radius:999px;
  font-size:12.5px;font-weight:900;cursor:pointer;font-family:inherit;
  box-shadow:0 3px 0 var(--lang-line);
  transition:transform .15s ease,box-shadow .15s ease,background .15s ease;
}
.ec-session-close:hover{transform:translateY(-2px);box-shadow:0 5px 0 var(--lang-line);background:var(--lang-lime-soft)}
.ec-session-close:active{transform:translateY(1px);box-shadow:0 1px 0 var(--lang-line)}

.ec-session-body{max-width:760px;width:100%;margin:0 auto;padding:26px 20px 140px}

/* Progress bar */
.ec-session-progress{
  height:12px;border-radius:999px;
  background:#E8E5F2;border:2px solid var(--lang-line);
  overflow:hidden;margin-bottom:22px;
}
.ec-session-progress-fill{
  height:100%;
  background:linear-gradient(90deg,#D4F55C,#B8E62E);
  border-radius:999px;
  transition:width .45s cubic-bezier(.22,1,.36,1);
  position:relative;
}
.ec-session-progress-fill::after{
  content:'';position:absolute;top:0;bottom:0;left:-30%;
  width:30%;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.6),transparent);
  animation:ecShimmer 2.4s ease-in-out infinite;
  pointer-events:none;
}
@keyframes ecShimmer{0%{transform:translateX(0)}60%{transform:translateX(420%)}100%{transform:translateX(420%)}}

/* Question card with directional slide */
.ec-session-card{
  background:#fff;
  border:3px solid var(--lang-line);
  border-radius:26px;padding:26px;
  box-shadow:0 8px 0 var(--lang-line);
  margin-bottom:20px;
  background-image:radial-gradient(circle at 100% 0%,rgba(212,245,92,.14),transparent 55%);
}
.ec-session-card[data-slide="right"]{animation:ecSlideRight .42s cubic-bezier(.22,1,.36,1) both}
.ec-session-card[data-slide="left"]{animation:ecSlideLeft  .42s cubic-bezier(.22,1,.36,1) both}
@keyframes ecSlideRight{
  from{opacity:0;transform:translateX(28px) scale(.985)}
  to{opacity:1;transform:translateX(0) scale(1)}
}
@keyframes ecSlideLeft{
  from{opacity:0;transform:translateX(-28px) scale(.985)}
  to{opacity:1;transform:translateX(0) scale(1)}
}

.ec-session-qnum{
  font-size:11px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;
  background:var(--lang-lime);color:var(--lang-ink);
  display:inline-block;padding:6px 13px;border-radius:999px;
  border:2px solid var(--lang-line);
  box-shadow:0 2px 0 var(--lang-line);
  margin-bottom:16px;
}
.ec-session-qtext{
  font-size:clamp(17px,1.2vw + 13px,21px);
  font-weight:900;line-height:1.4;
  color:var(--lang-ink);margin:0 0 22px;letter-spacing:-.02em;
}

/* ---- Options ---- */
.ec-session-opt{
  position:relative;
  display:flex;align-items:center;gap:14px;
  padding:15px 20px;border-radius:16px;
  border:2px solid var(--lang-line);
  background:#fff;color:var(--lang-ink);
  font-size:14px;font-weight:800;font-family:inherit;text-align:left;
  cursor:pointer;width:100%;margin-bottom:12px;
  box-shadow:0 4px 0 var(--lang-line);
  transition:transform .2s cubic-bezier(.34,1.56,.64,1),
             box-shadow .2s ease,
             background .25s ease,
             color .25s ease;
  overflow:hidden;
}
.ec-session-opt:hover{
  background:var(--lang-lime-soft);
  transform:translateY(-2px);
  box-shadow:0 6px 0 var(--lang-line);
}
.ec-session-opt:active{
  transform:translateY(2px) scale(.995);
  box-shadow:0 1px 0 var(--lang-line);
  transition-duration:.08s;
}
.ec-session-opt--selected{
  background:var(--lang-lime);
  color:var(--lang-ink);
  font-weight:900;
  animation:ecOptPop .38s cubic-bezier(.34,1.56,.64,1);
}
@keyframes ecOptPop{
  0%{transform:scale(1)}
  45%{transform:scale(1.025)}
  100%{transform:scale(1)}
}

.ec-session-opt-letter{
  width:30px;height:30px;border-radius:10px;
  background:#fff;border:2px solid var(--lang-line);
  display:flex;align-items:center;justify-content:center;
  font-size:13px;font-weight:900;flex-shrink:0;
  transition:background .25s ease,color .25s ease,transform .25s cubic-bezier(.34,1.56,.64,1);
}
.ec-session-opt:hover .ec-session-opt-letter{transform:rotate(-6deg) scale(1.08)}
.ec-session-opt--selected .ec-session-opt-letter{
  background:var(--lang-ink);color:var(--lang-lime);
  transform:rotate(0deg) scale(1.05);
}

.ec-session-opt-text{flex:1;min-width:0;word-wrap:break-word}

.ec-session-opt-check{
  width:22px;text-align:center;
  font-size:16px;font-weight:900;
  color:var(--lang-ink);
  opacity:0;transform:translateX(-6px);
  transition:opacity .25s ease,transform .3s cubic-bezier(.34,1.56,.64,1);
}
.ec-session-opt--selected .ec-session-opt-check{
  opacity:1;transform:translateX(0);
}

/* ---- Bottom nav ---- */
.ec-session-nav{
  position:fixed;left:0;right:0;bottom:0;
  display:flex;align-items:center;justify-content:space-between;gap:12px;
  padding:14px 20px;background:#fff;
  border-top:2px solid var(--lang-line);flex-wrap:wrap;z-index:4;
}
.ec-session-nav-left{display:flex;gap:8px;flex-wrap:wrap}

.ec-session-pal{
  width:34px;height:34px;border-radius:10px;
  border:2px solid var(--lang-line);
  background:#fff;color:var(--lang-ink);
  font-size:12px;font-weight:900;cursor:pointer;
  box-shadow:0 2px 0 var(--lang-line);
  transition:transform .2s cubic-bezier(.34,1.56,.64,1),
             box-shadow .18s ease,
             background .2s ease,
             color .2s ease;
  font-variant-numeric:tabular-nums;
}
.ec-session-pal:hover{
  background:var(--lang-lime-soft);
  transform:translateY(-2px);
  box-shadow:0 4px 0 var(--lang-line);
}
.ec-session-pal--done{background:var(--lang-lime);color:var(--lang-ink)}
.ec-session-pal--now{
  background:var(--lang-ink);color:var(--lang-lime);
  transform:translateY(-2px);
  box-shadow:0 4px 0 var(--lang-line);
}

.ec-session-btn{
  border:2px solid var(--lang-line);
  background:#fff;color:var(--lang-ink);
  padding:12px 22px;border-radius:999px;
  font-size:13.5px;font-weight:900;cursor:pointer;font-family:inherit;
  box-shadow:0 4px 0 var(--lang-line);
  transition:transform .2s cubic-bezier(.34,1.56,.64,1),
             box-shadow .18s ease,
             background .2s ease,
             color .2s ease;
  position:relative;overflow:hidden;
}
.ec-session-btn:hover:not(:disabled){
  transform:translateY(-2px);
  box-shadow:0 6px 0 var(--lang-line);
}
.ec-session-btn:active:not(:disabled){
  transform:translateY(1px);
  box-shadow:0 1px 0 var(--lang-line);
}
.ec-session-btn:disabled{opacity:.5;cursor:not-allowed}
.ec-session-btn--primary{background:var(--lang-ink);color:var(--lang-lime)}
.ec-session-btn--primary:hover:not(:disabled){background:var(--lang-ink);color:var(--lang-lime)}
.ec-session-btn--submit{background:var(--lang-purple);color:#fff}
.ec-session-btn--submit:hover:not(:disabled){background:#6b4be0;color:#fff}
.ec-session-btn--submit.is-loading::after{
  content:'';position:absolute;top:0;bottom:0;left:-30%;width:30%;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.4),transparent);
  animation:ecShimmer 1.1s ease-in-out infinite;
}

/* ---- Result screen ---- */
.ec-session-result{
  max-width:520px;margin:60px auto;
  text-align:center;background:#fff;
  border:3px solid var(--lang-line);border-radius:28px;
  padding:40px 30px;
  box-shadow:0 10px 0 var(--lang-line);
  animation:ecResultIn .55s cubic-bezier(.34,1.56,.64,1) both;
}
@keyframes ecResultIn{
  from{opacity:0;transform:translateY(24px) scale(.94)}
  to{opacity:1;transform:translateY(0) scale(1)}
}
.ec-session-result-emoji{
  font-size:64px;line-height:1;margin-bottom:12px;
  display:block;
  animation:ecEmojiBounce .9s cubic-bezier(.34,1.56,.64,1) both;
}
@keyframes ecEmojiBounce{
  0%{transform:scale(.4) rotate(-10deg);opacity:0}
  60%{transform:scale(1.15) rotate(4deg);opacity:1}
  100%{transform:scale(1) rotate(0);opacity:1}
}
.ec-session-result h2{margin:0 0 8px;font-size:24px;font-weight:900;letter-spacing:-.03em;color:var(--lang-ink)}
.ec-session-result p{margin:0 0 22px;color:var(--lang-ink-soft);font-weight:700;font-size:14px}
.ec-session-result-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:24px}
.ec-session-result-cell{
  padding:16px;border:2px solid var(--lang-line);border-radius:14px;
  box-shadow:0 3px 0 var(--lang-line);
  animation:ecResultCellIn .5s cubic-bezier(.34,1.56,.64,1) both;
}
.ec-session-result-cell:nth-child(1){animation-delay:.18s}
.ec-session-result-cell:nth-child(2){animation-delay:.28s}
.ec-session-result-cell:nth-child(3){animation-delay:.38s}
@keyframes ecResultCellIn{
  from{opacity:0;transform:translateY(14px) scale(.94)}
  to{opacity:1;transform:translateY(0) scale(1)}
}
.ec-session-result-cell strong{display:block;font-size:24px;font-weight:900;color:var(--lang-ink);line-height:1}
.ec-session-result-cell span{font-size:10.5px;font-weight:900;color:var(--lang-ink-soft);text-transform:uppercase;letter-spacing:.08em;display:block;margin-top:6px}

.ec-session-loading{
  padding:80px 24px;text-align:center;
  background:#fff;border:3px dashed var(--lang-line);border-radius:24px;
  color:var(--lang-ink-soft);font-weight:700;font-size:14px;
}

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media(max-width:900px){
  .ec-exam-grid{grid-template-columns:1fr;gap:18px}
  .ec-exam-hero{flex-direction:column;align-items:flex-start;min-height:0}
  .ec-exam-hero-mascot{display:none}
}
@media(max-width:720px){
  .ec-exam-section-card{padding:14px;border-radius:18px;flex-wrap:wrap}
  .ec-exam-start{width:100%;order:3;margin-top:8px}
  .ec-papers-grid{grid-template-columns:1fr}
  .ec-session-body{padding:18px 14px 200px}
  .ec-session-nav{flex-direction:column;align-items:stretch}
  .ec-session-nav-left{justify-content:center}
  .ec-session-card{padding:20px}
  .ec-session-opt{padding:13px 16px;font-size:13.5px;border-radius:14px}
  .ec-session-opt-letter{width:26px;height:26px;font-size:12px}
  .ec-session-result{margin:24px auto;padding:30px 22px}
  .ec-session-result-grid{grid-template-columns:1fr 1fr}
}
@media(prefers-reduced-motion:reduce){
  .ec-exam-hero-orb,
  .ec-exam-hero-mascot,
  .ec-session-overlay,
  .ec-session-card,
  .ec-session-opt,
  .ec-session-opt--selected,
  .ec-session-result,
  .ec-session-result-cell,
  .ec-session-result-emoji,
  .ec-session-timer--danger,
  .ec-session-progress-fill::after,
  .ec-session-btn--submit.is-loading::after{animation:none!important}
  .ec-session-opt,
  .ec-session-opt-letter,
  .ec-session-pal,
  .ec-session-btn,
  .ec-session-close{transition:none!important}
}
`;

const FALLBACK_TRACKS = [
  { id: 'ielts', name: 'IELTS', icon: 'flag', sections: [
    { name: 'Listening', mins: 30, questions: 0, icon: 'mic' },
    { name: 'Reading', mins: 60, questions: 0, icon: 'book' },
    { name: 'Writing', mins: 60, questions: 0, icon: 'chat' },
    { name: 'Speaking', mins: 15, questions: 0, icon: 'mic' },
  ]},
  { id: 'sat', name: 'SAT', icon: 'target', sections: [
    { name: 'Reading & Writing', mins: 64, questions: 0, icon: 'book' },
    { name: 'Math', mins: 70, questions: 0, icon: 'target' },
  ]},
  { id: 'pte', name: 'PTE', icon: 'zap', sections: [
    { name: 'Speaking & Writing', mins: 77, questions: 0, icon: 'mic' },
    { name: 'Reading', mins: 32, questions: 0, icon: 'book' },
    { name: 'Listening', mins: 45, questions: 0, icon: 'bell' },
  ]},
];

const DEFAULT_PLAN = [
  { id: 'p1', icon: 'target', title: '20 min warm-up drill', meta: 'Vocabulary blitz — target 85% accuracy' },
  { id: 'p2', icon: 'book', title: '1 Reading passage', meta: 'Timed at 20 min, then review mistakes' },
  { id: 'p3', icon: 'mic', title: 'Speaking practice', meta: '2 prompts, record and self-review' },
  { id: 'p4', icon: 'flag', title: 'Listening section', meta: 'One full section, then check band score' },
];

function LangutMascot({ size = 170 }) {
  return (
    <svg viewBox="0 0 170 170" width={size} height={size} fill="none" aria-hidden="true">
      <ellipse cx="85" cy="158" rx="46" ry="7" fill="#000" opacity="0.22" />
      <path d="M40 70c-8-4-16 0-18 8s2 16 10 18" stroke="#17102E" strokeWidth="4" fill="#F5E04D" strokeLinejoin="round" />
      <path d="M130 70c8-4 16 0 18 8s-2 16-10 18" stroke="#17102E" strokeWidth="4" fill="#F5E04D" strokeLinejoin="round" />
      <path d="M85 18c-30 0-54 24-54 54 0 17 7 31 15 40 5 6 8 12 8 19 0 4 3 7 7 7h48c4 0 7-3 7-7 0-7 3-13 8-19 8-9 15-23 15-40 0-30-24-54-54-54z" fill="#F5E04D" stroke="#17102E" strokeWidth="4" strokeLinejoin="round" />
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
    </svg>
  );
}

/* ============================================================
   LIVE EXAM SESSION — full-screen overlay
   ============================================================ */
function ExamSession({ session, sectionLabel, onClose }) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [secondsLeft, setSecondsLeft] = useState((session.durationMinutes || 30) * 60);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [closing, setClosing] = useState(false);
  const [slideDir, setSlideDir] = useState('right');

  const questions = session.questions || [];
  const total = questions.length;
  const current = questions[idx];

  /* Stable key: fall back to index if the backend forgot to send an id */
  const qKeyOf = (i) => questions[i]?.id ?? `q_${i}`;
  const currentKey = qKeyOf(idx);

  /* Timer */
  useEffect(() => {
    if (result || closing || total === 0) return;
    if (secondsLeft <= 0) { doSubmit(true); return; }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, result, closing, total]);

  /* Navigation with directional slide */
  const goTo = (newIdx) => {
    if (newIdx === idx) return;
    setSlideDir(newIdx > idx ? 'right' : 'left');
    setIdx(newIdx);
  };
  const next = () => { if (idx < total - 1) goTo(idx + 1); };
  const prev = () => { if (idx > 0) goTo(idx - 1); };

  const pick = (opt) => {
    if (!current || result) return;
    setAnswers((a) => ({ ...a, [currentKey]: opt }));
  };

  const doSubmit = async (auto = false) => {
    if (submitting || result) return;
    setSubmitting(true);
    try {
      const res = await examsApi.submit(session.attemptId, answers);
      setResult({ ...res, auto });
    } catch (e) {
      // Fallback: score locally so the user still sees a result
      let correct = 0;
      questions.forEach((q, i) => {
        const key = qKeyOf(i);
        if (answers[key] && String(answers[key]).trim() === String(q.correctAnswer || '').trim()) {
          correct++;
        }
      });
      const maxScore = questions.length;
      const pct = maxScore ? Math.round((correct / maxScore) * 100) : 0;
      setResult({ score: correct, maxScore, percent: pct, auto });
    } finally {
      setSubmitting(false);
    }
  };

  const fmt = (s) => {
    if (s < 0) s = 0;
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const timerCls = secondsLeft <= 60 ? 'ec-session-timer--danger'
    : secondsLeft <= 5 * 60 ? 'ec-session-timer--warn' : '';

  /* ---------- RESULT ---------- */
  if (result) {
    const pct = result.percent ?? Math.round((result.score / Math.max(1, result.maxScore)) * 100);
    const emoji = pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '💪';
    return (
      <div className="ec-session-overlay">
        <style>{EXAM_CSS}</style>
        <div className="ec-session-result">
          <div className="ec-session-result-emoji">{emoji}</div>
          <h2>{result.auto ? "Time's up!" : 'Exam submitted'}</h2>
          <p>{sectionLabel} — your responses have been recorded.</p>
          <div className="ec-session-result-grid">
            <div className="ec-session-result-cell">
              <strong>{result.score ?? 0}</strong>
              <span>Correct</span>
            </div>
            <div className="ec-session-result-cell">
              <strong>{result.maxScore ?? total}</strong>
              <span>Total</span>
            </div>
            <div className="ec-session-result-cell">
              <strong>{pct}%</strong>
              <span>Score</span>
            </div>
          </div>
          <button className="ec-session-btn ec-session-btn--primary" onClick={onClose}>
            ← Back to Exams
          </button>
        </div>
      </div>
    );
  }

  /* ---------- EMPTY ---------- */
  if (total === 0) {
    return (
      <div className="ec-session-overlay">
        <style>{EXAM_CSS}</style>
        <div className="ec-session-body">
          <div className="ec-session-loading">
            This section has no questions yet. Ask your admin to add some.
          </div>
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <button className="ec-session-btn" onClick={onClose}>← Back</button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- ACTIVE ---------- */
  const pctProgress = Math.round(((idx + 1) / total) * 100);
  const answeredCount = Object.keys(answers).length;
  const selectedForCurrent = answers[currentKey];

  return (
    <div className="ec-session-overlay">
      <style>{EXAM_CSS}</style>

      <div className="ec-session-head">
        <div>
          <p className="ec-session-title">{sectionLabel}</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span className={`ec-session-timer ${timerCls}`}>⏱ {fmt(secondsLeft)}</span>
          <button className="ec-session-close" onClick={() => setClosing(true)}>✕ Close</button>
        </div>
      </div>

      <div className="ec-session-body">
        <div className="ec-session-progress">
          <div className="ec-session-progress-fill" style={{ width: `${pctProgress}%` }} />
        </div>

        {/* key={idx} remounts the card → slide-in animation replays on every navigation */}
        <div className="ec-session-card" key={idx} data-slide={slideDir}>
          <span className="ec-session-qnum">
            Question {idx + 1} of {total}
          </span>
          <p className="ec-session-qtext">{current?.prompt}</p>

          {(current?.options || []).map((opt, i) => {
            const letter = String.fromCharCode(65 + i);
            const isSelected = selectedForCurrent === opt;
            return (
              <button
                key={`${currentKey}-${i}`}
                type="button"
                className={`ec-session-opt${isSelected ? ' ec-session-opt--selected' : ''}`}
                onClick={() => pick(opt)}
                aria-pressed={isSelected}
              >
                <span className="ec-session-opt-letter">{letter}</span>
                <span className="ec-session-opt-text">{opt}</span>
                <span className="ec-session-opt-check" aria-hidden="true">
                  {isSelected ? '✓' : ''}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="ec-session-nav">
        <div className="ec-session-nav-left">
          {questions.map((_, i) => {
            const isAnswered = answers[qKeyOf(i)] != null;
            const now = i === idx;
            return (
              <button
                key={i}
                type="button"
                className={`ec-session-pal${isAnswered ? ' ec-session-pal--done' : ''}${now ? ' ec-session-pal--now' : ''}`}
                onClick={() => goTo(i)}
                aria-label={`Go to question ${i + 1}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            type="button"
            className="ec-session-btn"
            onClick={prev}
            disabled={idx === 0}
          >
            ← Prev
          </button>
          {idx < total - 1 ? (
            <button
              type="button"
              className="ec-session-btn ec-session-btn--primary"
              onClick={next}
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              className={`ec-session-btn ec-session-btn--submit${submitting ? ' is-loading' : ''}`}
              onClick={() => doSubmit(false)}
              disabled={submitting}
            >
              {submitting ? 'Submitting…' : `Submit Exam (${answeredCount}/${total})`}
            </button>
          )}
        </div>
      </div>

      {closing && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 10000,
            background: 'rgba(15,18,34,.65)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
          }}
          onClick={() => setClosing(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff', border: '3px solid var(--lang-line)', borderRadius: 24,
              padding: 26, maxWidth: 400, width: '100%', textAlign: 'center',
              boxShadow: '0 10px 0 var(--lang-line)',
            }}
          >
            <h3 style={{ margin: '0 0 10px', fontSize: 19, fontWeight: 900 }}>Quit exam?</h3>
            <p style={{ margin: '0 0 20px', fontSize: 13.5, color: 'var(--lang-ink-soft)', fontWeight: 700 }}>
              Your progress will be lost.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button className="ec-session-btn" onClick={() => setClosing(false)}>Keep working</button>
              <button className="ec-session-btn ec-session-btn--submit" onClick={onClose}>Quit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   MAIN PAGE
   ============================================================ */
export function Exams() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tracks, setTracks] = useState(FALLBACK_TRACKS);
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackId, setTrackId] = useState(FALLBACK_TRACKS[0].id);
  const [countdown, setCountdown] = useState(null);
  const [examDate, setExamDate] = useState('');
  const [animateRing, setAnimateRing] = useState(false);

  const [session, setSession] = useState(null);
  const [sessionLabel, setSessionLabel] = useState('');
  const [startingSection, setStartingSection] = useState(null);

  useEffect(() => {
    let cancelled = false;

    Promise.allSettled([
      examsApi.tracks(),
      examsApi.papers(),
      examsApi.countdown(),
    ]).then(([tracksRes, papersRes, cdRes]) => {
      if (cancelled) return;

      const tr =
        tracksRes.status === 'fulfilled' && Array.isArray(tracksRes.value) && tracksRes.value.length
          ? tracksRes.value
          : FALLBACK_TRACKS;
      setTracks(tr);
      setTrackId(tr[0].id);

      const pp = papersRes.status === 'fulfilled' && Array.isArray(papersRes.value)
        ? papersRes.value : [];
      setPapers(pp);

      setCountdown(cdRes.status === 'fulfilled' ? cdRes.value : null);
      setLoading(false);
    });

    const raf = requestAnimationFrame(() => setAnimateRing(true));
    return () => { cancelled = true; cancelAnimationFrame(raf); };
  }, []);

  const track = useMemo(
    () => tracks.find((t) => t.id === trackId) || tracks[0],
    [tracks, trackId]
  ) || FALLBACK_TRACKS[0];

  const saveCountdown = () => {
    if (!examDate) return;
    examsApi.setCountdown(trackId, examDate)
      .then((c) => { setCountdown(c); setExamDate(''); })
      .catch(() => { setCountdown({ examDate }); setExamDate(''); });
  };

  const clearCountdown = () => { setCountdown(null); setExamDate(''); };

  const startPaper = (paper) => navigate(`/exams/take/${paper.id}`);

  const startSection = async (section) => {
    if (!section) return;
    setStartingSection(section.name);
    try {
      const res = await examsApi.start(track.id, section.name);
      setSession(res);
      setSessionLabel(`${track.name} · ${section.name}`);
    } catch (err) {
      console.error('[Exams] failed to start section:', err);
      alert(err?.response?.data?.error || 'Could not start this section. Try again.');
    } finally {
      setStartingSection(null);
    }
  };

  const daysLeft = countdown?.examDate
    ? Math.max(0, Math.ceil((new Date(countdown.examDate) - new Date()) / 86400000))
    : null;

  const sections = track?.sections || [];
  const totalMins = sections.reduce((s, x) => s + (x.mins ?? x.durationMinutes ?? 0), 0);
  const totalQ = sections.reduce((s, x) => s + (x.questions ?? x.questionCount ?? 0), 0);
  const ringPct = daysLeft != null ? Math.max(0, Math.min(1, 1 - daysLeft / 180)) : 0;
  const R = 58;
  const CIRC = 2 * Math.PI * R;

  if (session) {
    return (
      <ExamSession
        session={session}
        sectionLabel={sessionLabel}
        onClose={() => setSession(null)}
      />
    );
  }

  return (
    <div className="ec-exam">
      <style>{EXAM_CSS}</style>

      <div className="ec-exam-head">
        <div>
          <p className="ec-exam-eyebrow">Exam Preparation</p>
          <h1 className="ec-page-title">Your exam, on your clock</h1>
          <p className="ec-page-sub">
            {papers.length > 0
              ? `${papers.length} live exam paper${papers.length === 1 ? '' : 's'} available · full IELTS, SAT and PTE tracks`
              : 'Full IELTS, SAT and PTE tracks on one shared exam engine — timer, auto-scoring, results.'}
          </p>
        </div>
      </div>

      {!loading && papers.length > 0 && (
        <section className="ec-papers">
          <div className="ec-papers-head">
            <h2 className="ec-papers-title">📝 Live &amp; Published Exam Papers</h2>
            <span className="ec-papers-badge">{papers.length}</span>
          </div>
          <div className="ec-papers-grid">
            {papers.map((p) => {
              const isLive = p.status === 'live';
              return (
                <article key={p.id} className={`ec-paper-card${isLive ? ' ec-paper-card--live' : ''}`}>
                  <div className="ec-paper-card-top">
                    <span className="ec-paper-icon"><Icon name="flag" /></span>
                    <div className="ec-paper-body">
                      <p className="ec-paper-title">
                        {p.title}
                        {isLive && <span className="ec-paper-live-pill">● LIVE</span>}
                      </p>
                      <div className="ec-paper-meta">
                        <span>🏫 {p.classLevel} · {p.paper}</span>
                        <span>🏛 {p.board}</span>
                        <span>⏱ {p.durationMins} min</span>
                        <span>🎯 {p.totalMarks} marks</span>
                      </div>
                    </div>
                  </div>
                  <div className="ec-paper-cta">
                    <button
                      type="button"
                      className={`ec-paper-btn ${isLive ? 'ec-paper-btn--live' : 'ec-paper-btn--soon'}`}
                      onClick={() => startPaper(p)}
                    >
                      {isLive ? '● Join Live →' : 'Start Exam →'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      <div className="ec-exam-tracks">
        {tracks.map((t) => (
          <button
            key={t.id}
            className={`ec-exam-track${trackId === t.id ? ' ec-exam-track--active' : ''}`}
            onClick={() => setTrackId(t.id)}
          >
            <Icon name={t.icon || 'flag'} />
            {t.name}
          </button>
        ))}
      </div>

      <div className="ec-exam-hero">
        <div className="ec-exam-hero-orb" aria-hidden="true" />
        <div className="ec-exam-hero-copy">
          <span className="ec-exam-hero-badge">{track.name} · Full track</span>
          <h2>{sections.length} sections, one <em>shared</em> exam engine</h2>
          <p>
            Timed, auto-scored, and paired with an adaptive study plan. Sit a section
            whenever you have {Math.min(...sections.map((s) => s.mins ?? s.durationMinutes ?? 30))}+ minutes.
          </p>
          <div className="ec-exam-hero-stats">
            <div className="ec-exam-hero-stat"><strong>{totalMins}</strong><span>Total minutes</span></div>
            <div className="ec-exam-hero-stat"><strong>{totalQ}</strong><span>Questions</span></div>
            <div className="ec-exam-hero-stat"><strong>{sections.length}</strong><span>Sections</span></div>
          </div>
        </div>
        <div className="ec-exam-hero-mascot"><LangutMascot size={170} /></div>
      </div>

      <div className="ec-exam-grid">
        <section>
          <h2 className="ec-exam-sections-title">{track.name} sections</h2>
          <RequireTier
            tier="premium"
            fallback={
              <div className="ec-paper-card" style={{ marginBottom: 18 }}>
                <div className="ec-paper-card-top">
                  <span className="ec-paper-icon"><Icon name="target" /></span>
                  <div className="ec-paper-body">
                    <p className="ec-paper-title">🔒 Unlock all sections</p>
                    <div className="ec-paper-meta">
                      <span>Premium unlocks all {sections.length} sections, unlimited mocks, and AI speaking scoring.</span>
                    </div>
                  </div>
                </div>
                <div className="ec-paper-cta">
                  <Link to="/pricing" className="ec-paper-btn ec-paper-btn--soon" style={{ textDecoration: 'none' }}>
                    See Premium plans →
                  </Link>
                </div>
              </div>
            }
          >
            <div className="ec-exam-sections">
              {sections.map((s, i) => {
                const qCount = s.questions ?? s.questionCount ?? 0;
                const loadingThis = startingSection === s.name;
                return (
                  <div className="ec-exam-section-card" key={(s.name || 'section') + i}>
                    <span className="ec-exam-section-icon">
                      <Icon name={s.icon || 'book'} />
                    </span>
                    <div className="ec-exam-section-body">
                      <p className="ec-exam-section-title">{s.name}</p>
                      <div className="ec-exam-section-meta">
                        <span className="ec-exam-chip">Full mock</span>
                        <span>{s.mins ?? s.durationMinutes ?? 60} min</span>
                        <span>·</span>
                        <span>{qCount} question{qCount === 1 ? '' : 's'}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="ec-exam-start"
                      onClick={() => startSection(s)}
                      disabled={!!startingSection || qCount === 0}
                      title={qCount === 0 ? 'No questions yet' : `Start ${s.name}`}
                    >
                      {loadingThis ? 'Loading…' : qCount === 0 ? 'No Qs' : 'Start'}
                    </button>
                  </div>
                );
              })}
            </div>
          </RequireTier>
        </section>

        <aside>
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
                    <circle className="ec-exam-ring-progress" cx="70" cy="70" r={R}
                      strokeDasharray={CIRC}
                      strokeDashoffset={animateRing ? CIRC * (1 - ringPct) : CIRC} />
                  </svg>
                  <div className="ec-exam-ring-content">
                    <span className="ec-exam-days">{daysLeft}</span>
                    <span className="ec-exam-days-label">days left</span>
                  </div>
                </div>
                <p>until your {track.name} exam. Your daily plan adjusts automatically.</p>
                <button className="ec-exam-btn-ghost" onClick={clearCountdown}>Change date</button>
              </>
            ) : (
              <>
                <p style={{ marginBottom: 14 }}>Set your exam date and we'll build a daily study plan for you.</p>
                <input type="date" className="ec-exam-date-input" value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 10)} />
                <button className="ec-exam-btn-primary" onClick={saveCountdown} disabled={!examDate}>
                  Set countdown
                </button>
              </>
            )}
          </div>

          <div className="ec-exam-plan">
            <h3>Today's plan <span>{DEFAULT_PLAN.length} tasks</span></h3>
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
