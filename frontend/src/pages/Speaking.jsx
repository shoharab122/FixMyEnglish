import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { speakingApi } from '../api/speaking';
import { Icon } from '../components/Icon';

/* ============================================================
   STYLES — Langut-inspired
   ============================================================ */
const SPEAK_CSS = `
.ec-spk{
  --lang-bg:#1E1252;--lang-bg-2:#2A1A6E;--lang-bg-3:#3B2596;
  --lang-lime:#D4F55C;--lang-lime-2:#E4FF5C;--lang-lime-soft:#EDFFB0;--lang-lime-deep:#B8E62E;
  --lang-yellow:#F5E04D;--lang-purple:#7B5CF0;--lang-purple-2:#9B7BFF;
  --lang-pink:#FFB3D1;--lang-pink-2:#FF8FCB;
  --lang-mint:#B8F2D8;--lang-mint-2:#7FD9A9;
  --lang-ink:#17102E;--lang-ink-soft:#6B6488;--lang-line:#17102E;
}
.ec-spk,.ec-spk *{box-sizing:border-box}

.ec-spk-head{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:18px}
.ec-spk-eyebrow{margin:0 0 6px;font-size:11.5px;font-weight:900;letter-spacing:.16em;text-transform:uppercase;color:var(--lang-purple);opacity:.95}

.ec-spk-hero{
  position:relative;overflow:hidden;border-radius:32px;
  padding:clamp(26px,4vw,40px) clamp(24px,4vw,42px);
  color:#fff;
  background:linear-gradient(140deg,#2A1A6E 0%,#1E1252 55%,#3B2596 100%);
  box-shadow:0 20px 52px rgba(30,18,82,.34);
  border:2px solid var(--lang-line);margin-bottom:22px;min-height:240px;
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
.ec-spk-hero-orb{position:absolute;top:-90px;right:180px;width:260px;height:260px;border-radius:50%;background:radial-gradient(circle,rgba(212,245,92,.22),transparent 68%);animation:ec-spk-drift 14s ease-in-out infinite}
@keyframes ec-spk-drift{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-18px,16px) scale(1.08)}}
.ec-spk-hero-copy{position:relative;z-index:1;max-width:580px}
.ec-spk-hero-badge{
  display:inline-flex;align-items:center;font-size:10.5px;font-weight:900;
  letter-spacing:.16em;text-transform:uppercase;padding:7px 14px;border-radius:999px;
  background:var(--lang-lime);color:var(--lang-ink);border:2px solid var(--lang-line);
  box-shadow:0 3px 0 rgba(0,0,0,.4);margin-bottom:16px;
}
.ec-spk-hero h1{margin:0 0 10px;font-size:clamp(26px,2.4vw + 16px,38px);font-weight:900;letter-spacing:-.035em;line-height:1.1;color:#fff}
.ec-spk-hero h1 em{font-style:normal;color:var(--lang-lime)}
.ec-spk-hero p{margin:0 0 22px;font-size:14px;line-height:1.6;opacity:.92;font-weight:500;max-width:52ch}
.ec-spk-hero-stats{display:flex;gap:10px;flex-wrap:wrap;position:relative;z-index:1}
.ec-spk-hero-stat{display:flex;flex-direction:column;gap:2px;padding:9px 14px;border-radius:14px;background:var(--lang-lime);border:2px solid var(--lang-line);box-shadow:0 3px 0 var(--lang-line);min-width:80px}
.ec-spk-hero-stat strong{font-size:20px;font-weight:900;line-height:1;letter-spacing:-.04em;color:var(--lang-ink)}
.ec-spk-hero-stat span{font-size:9.5px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:var(--lang-ink);opacity:.75}
.ec-spk-hero-stat:nth-child(2){background:var(--lang-pink)}
.ec-spk-hero-stat:nth-child(3){background:var(--lang-purple-2)}
.ec-spk-hero-stat:nth-child(3) strong,
.ec-spk-hero-stat:nth-child(3) span{color:#fff}
.ec-spk-hero-stat:nth-child(4){background:var(--lang-yellow)}
.ec-spk-hero-mascot{position:relative;z-index:1;flex-shrink:0;display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 14px 28px rgba(0,0,0,.28));animation:ec-spk-bob 4s ease-in-out infinite}
@keyframes ec-spk-bob{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-10px) rotate(2deg)}}

.ec-spk-tabs{display:flex;gap:10px;overflow-x:auto;scrollbar-width:none;padding:6px 4px 16px;margin-bottom:8px}
.ec-spk-tabs::-webkit-scrollbar{display:none}
.ec-spk-tab{
  flex:0 0 auto;display:inline-flex;align-items:center;gap:8px;
  padding:11px 18px;border-radius:999px;border:2px solid var(--lang-line);
  background:#fff;color:var(--lang-ink);font-size:13px;font-weight:900;
  cursor:pointer;white-space:nowrap;transition:all .18s ease;font-family:inherit;
  box-shadow:0 3px 0 var(--lang-line);letter-spacing:.01em;
}
.ec-spk-tab:hover{background:var(--lang-lime-soft);transform:translateY(-2px);box-shadow:0 5px 0 var(--lang-line)}
.ec-spk-tab:active{transform:translateY(1px);box-shadow:0 1px 0 var(--lang-line)}
.ec-spk-tab--active{background:var(--lang-ink);color:var(--lang-lime);box-shadow:0 3px 0 var(--lang-ink)}
.ec-spk-tab--active:hover{background:var(--lang-ink);color:var(--lang-lime)}
.ec-spk-tab svg{width:16px;height:16px}

.ec-spk-cats{display:flex;gap:10px;overflow-x:auto;scrollbar-width:none;padding:6px 4px 14px;margin-bottom:8px}
.ec-spk-cats::-webkit-scrollbar{display:none}
.ec-spk-cat{
  flex:0 0 auto;padding:9px 16px;border-radius:999px;
  border:2px solid var(--lang-line);background:#fff;color:var(--lang-ink);
  font-size:12px;font-weight:900;cursor:pointer;white-space:nowrap;
  transition:all .16s ease;font-family:inherit;display:inline-flex;align-items:center;gap:6px;
  box-shadow:0 3px 0 var(--lang-line);
}
.ec-spk-cat:hover{background:var(--lang-lime-soft);transform:translateY(-2px);box-shadow:0 5px 0 var(--lang-line)}
.ec-spk-cat:active{transform:translateY(1px);box-shadow:0 1px 0 var(--lang-line)}
.ec-spk-cat--active{background:var(--lang-ink);color:var(--lang-lime);box-shadow:0 3px 0 var(--lang-ink)}
.ec-spk-cat-count{font-size:10px;font-weight:900;padding:2px 7px;border-radius:999px;background:var(--lang-lime);color:var(--lang-ink);border:2px solid var(--lang-line)}
.ec-spk-cat--active .ec-spk-cat-count{background:var(--lang-lime);color:var(--lang-ink);border-color:var(--lang-line)}

.ec-spk-grid{display:grid;grid-template-columns:minmax(0,1fr) 330px;gap:22px;align-items:start}

.ec-spk-panel{
  background:#fff;border:3px solid var(--lang-line);border-radius:32px;padding:28px;
  box-shadow:0 10px 0 var(--lang-line);position:relative;overflow:hidden;
  background-image:radial-gradient(circle at 100% 0%,rgba(212,245,92,.14),transparent 55%);
}
.ec-spk-prompt-counter{
  position:relative;z-index:1;font-size:12px;font-weight:900;
  color:var(--lang-ink-soft);margin:0 0 10px;text-transform:uppercase;letter-spacing:.08em;
  display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:center;
}
.ec-spk-prompt-tag{font-size:10.5px;font-weight:900;padding:4px 12px;border-radius:999px;background:var(--lang-lime);color:var(--lang-ink);border:2px solid var(--lang-line);box-shadow:0 2px 0 var(--lang-line);letter-spacing:.06em;text-transform:uppercase}
.ec-spk-prompt-text{position:relative;z-index:1;font-size:clamp(18px,1.6vw + 12px,22px);font-weight:900;line-height:1.4;margin:12px 0 20px;color:var(--lang-ink);letter-spacing:-.02em;max-width:680px}
.ec-spk-prompt-hint{position:relative;z-index:1;font-size:12.5px;color:var(--lang-ink-soft);margin:-12px 0 22px;font-weight:700}

.ec-spk-record-wrap{position:relative;z-index:1;display:inline-flex;align-items:center;justify-content:center;width:130px;height:130px;margin:8px auto 4px}
.ec-spk-record-ring{position:absolute;inset:0;border-radius:50%;border:3px solid rgba(123,92,240,.55);animation:ec-spk-ring 2.4s ease-out infinite}
.ec-spk-record-ring:nth-child(2){animation-delay:.8s}
.ec-spk-record-ring:nth-child(3){animation-delay:1.6s}
@keyframes ec-spk-ring{0%{transform:scale(.6);opacity:.9}80%{transform:scale(1.35);opacity:0}100%{opacity:0}}
.ec-spk-record-wrap--active .ec-spk-record-ring{border-color:rgba(255,143,203,.75)}
.ec-spk-record-btn{
  position:relative;z-index:1;width:92px;height:92px;border-radius:50%;
  border:3px solid var(--lang-line);
  background:linear-gradient(135deg,var(--lang-purple) 0%,var(--lang-purple-2) 100%);
  color:#fff;font-size:32px;display:flex;align-items:center;justify-content:center;cursor:pointer;
  box-shadow:0 6px 0 var(--lang-line);transition:transform .18s ease,box-shadow .18s ease;
}
.ec-spk-record-btn:hover:not(:disabled){transform:translateY(-3px);box-shadow:0 9px 0 var(--lang-line)}
.ec-spk-record-btn:active:not(:disabled){transform:translateY(2px);box-shadow:0 2px 0 var(--lang-line)}
.ec-spk-record-btn:disabled{opacity:.55;cursor:not-allowed}
.ec-spk-record-btn--active{background:linear-gradient(135deg,var(--lang-pink-2) 0%,#E0503C 100%);box-shadow:0 6px 0 var(--lang-line)}

.ec-spk-record-status{position:relative;z-index:1;font-size:14px;font-weight:900;color:var(--lang-ink);margin:16px 0 4px;text-align:center;letter-spacing:.01em}
.ec-spk-record-time{position:relative;z-index:1;font-size:26px;font-weight:900;color:var(--lang-ink);letter-spacing:-.03em;font-variant-numeric:tabular-nums;text-align:center;background:var(--lang-lime);border:2px solid var(--lang-line);border-radius:14px;padding:6px 18px;display:inline-block;box-shadow:0 3px 0 var(--lang-line)}

.ec-spk-live-level{
  position:relative;z-index:1;
  display:flex;align-items:center;gap:10px;
  max-width:360px;margin:10px auto 0;
  padding:8px 14px;border-radius:999px;
  background:#fff;border:2px solid var(--lang-line);
  box-shadow:0 2px 0 var(--lang-line);
  font-size:11px;font-weight:900;
  color:var(--lang-ink-soft);letter-spacing:.04em;text-transform:uppercase;
}
.ec-spk-live-level-track{
  flex:1;height:8px;border-radius:999px;background:#E8E5F2;overflow:hidden;
  border:1.5px solid var(--lang-line);
}
.ec-spk-live-level-fill{
  height:100%;border-radius:999px;
  background:linear-gradient(90deg,#B8E62E,#D4F55C);
  transition:width .08s linear;
}
.ec-spk-live-level--silent .ec-spk-live-level-fill{background:linear-gradient(90deg,#FF8FCB,#E0503C)}
.ec-spk-live-level--silent{color:#A52C1C}

.ec-spk-record-warning{
  position:relative;z-index:1;
  display:inline-flex;align-items:center;gap:8px;
  font-size:12.5px;font-weight:900;color:var(--lang-ink);
  background:var(--lang-yellow);
  padding:10px 16px;border-radius:999px;
  border:2px solid var(--lang-line);
  box-shadow:0 3px 0 var(--lang-line);
  margin:12px auto 0;
  animation:ec-spk-warning-pulse 1.6s ease-in-out infinite;
}
@keyframes ec-spk-warning-pulse{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}

.ec-spk-wave{position:relative;z-index:1;height:48px;margin:14px auto 8px;max-width:420px;display:flex;align-items:center;justify-content:center;gap:3px}
.ec-spk-wave-bar{width:4px;background:var(--lang-ink);border-radius:2px;transition:height .15s ease}
.ec-spk-wave-idle .ec-spk-wave-bar{height:4px !important;opacity:.35}
.ec-spk-wave-live .ec-spk-wave-bar{background:linear-gradient(180deg,var(--lang-purple-2),var(--lang-purple));animation:ec-spk-wave-bounce .8s ease-in-out infinite}
@keyframes ec-spk-wave-bounce{0%,100%{transform:scaleY(.5)}50%{transform:scaleY(1.2)}}

.ec-spk-error{
  position:relative;z-index:1;font-size:13px;color:var(--lang-ink);
  background:var(--lang-pink-2);padding:12px 16px;border-radius:14px;
  display:inline-block;margin:14px 0 0;font-weight:900;
  border:2px solid var(--lang-line);box-shadow:0 3px 0 var(--lang-line);
  max-width:520px;text-align:left;
}
.ec-spk-info{
  position:relative;z-index:1;font-size:13px;color:var(--lang-ink);
  background:var(--lang-yellow);padding:12px 16px;border-radius:14px;
  display:inline-block;margin:14px 0 0;font-weight:900;
  border:2px solid var(--lang-line);box-shadow:0 3px 0 var(--lang-line);
  max-width:520px;text-align:left;
}

.ec-spk-transcript{
  position:relative;z-index:1;background:var(--lang-lime-soft);
  border:2px solid var(--lang-line);border-radius:18px;padding:18px 20px;
  margin-top:22px;text-align:left;min-height:90px;box-shadow:0 4px 0 var(--lang-line);
}
.ec-spk-transcript-label{font-size:10.5px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:var(--lang-ink);margin:0 0 12px;display:flex;align-items:center;gap:6px}
.ec-spk-transcript-label::before{content:'';width:8px;height:8px;border-radius:50%;background:var(--lang-ink);box-shadow:0 0 0 3px rgba(23,16,46,.15)}
.ec-spk-transcript-text{font-size:14.5px;line-height:1.7;color:var(--lang-ink);margin:0;font-weight:700;word-wrap:break-word}
.ec-spk-transcript-text em{font-style:normal;color:var(--lang-ink-soft);opacity:.85}
.ec-spk-transcript-empty{font-size:13.5px;color:var(--lang-ink-soft);font-style:italic;margin:0;font-weight:600}
.ec-spk-transcript mark{background:var(--lang-pink-2);color:#fff;padding:3px 8px;border-radius:8px;font-weight:900;border:2px solid var(--lang-line);box-decoration-break:clone;-webkit-box-decoration-break:clone}
.ec-spk-transcript-meta{display:flex;gap:16px;flex-wrap:wrap;margin-top:14px;padding-top:12px;border-top:2px dashed rgba(23,16,46,.15);font-size:11.5px;font-weight:900;color:var(--lang-ink-soft);letter-spacing:.02em}
.ec-spk-transcript-meta span{display:inline-flex;align-items:center;gap:4px}

.ec-spk-scores{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:24px;position:relative;z-index:1}
.ec-spk-score{
  position:relative;background:#fff;border:2px solid var(--lang-line);border-radius:20px;
  padding:16px 10px 14px;transition:all .2s ease;
  animation:ec-spk-pop .45s cubic-bezier(.34,1.56,.64,1) both;
  text-align:center;overflow:hidden;box-shadow:0 4px 0 var(--lang-line);
}
.ec-spk-score::before{content:'';position:absolute;top:0;left:0;right:0;height:5px;background:var(--score-color,var(--lang-purple));border-bottom:2px solid var(--lang-line)}
.ec-spk-score:nth-child(1){animation-delay:.05s}
.ec-spk-score:nth-child(2){animation-delay:.1s}
.ec-spk-score:nth-child(3){animation-delay:.15s}
.ec-spk-score:nth-child(4){animation-delay:.2s}
.ec-spk-score:hover{transform:translateY(-3px);box-shadow:0 7px 0 var(--lang-line)}
@keyframes ec-spk-pop{from{opacity:0;transform:translateY(14px) scale(.94)}to{opacity:1;transform:translateY(0) scale(1)}}
.ec-spk-score--excellent{--score-color:#B8E62E}
.ec-spk-score--good{--score-color:#7B5CF0}
.ec-spk-score--fair{--score-color:#F5E04D}
.ec-spk-score--low{--score-color:#FF8FCB}
.ec-spk-score-ring{position:relative;width:64px;height:64px;margin:0 auto 8px;display:flex;align-items:center;justify-content:center}
.ec-spk-score-ring svg{position:absolute;inset:0;transform:rotate(-90deg)}
.ec-spk-score-ring-track{fill:none;stroke:#E8E5F2;stroke-width:5}
.ec-spk-score-ring-fill{fill:none;stroke:var(--score-color,var(--lang-purple));stroke-width:5;stroke-linecap:round;transition:stroke-dashoffset 1s cubic-bezier(.22,1,.36,1)}
.ec-spk-score-num{position:relative;z-index:1;font-size:24px;font-weight:900;color:var(--lang-ink);line-height:1;letter-spacing:-.04em;font-variant-numeric:tabular-nums}
.ec-spk-score-label{display:block;font-size:10px;font-weight:900;color:var(--lang-ink-soft);text-transform:uppercase;letter-spacing:.1em;margin-top:4px}

.ec-spk-band{
  position:relative;z-index:1;margin-top:18px;display:flex;align-items:center;justify-content:center;gap:14px;
  padding:16px 22px;border-radius:18px;background:var(--lang-yellow);
  border:2px solid var(--lang-line);box-shadow:0 4px 0 var(--lang-line);
}
.ec-spk-band-label{font-size:12.5px;font-weight:900;color:var(--lang-ink);text-transform:uppercase;letter-spacing:.08em}
.ec-spk-band-value{font-size:28px;font-weight:900;color:var(--lang-ink);line-height:1;letter-spacing:-.03em}
.ec-spk-band-value small{font-size:14px;font-weight:800;color:var(--lang-ink);opacity:.7;letter-spacing:0;margin-left:2px}

.ec-spk-faults{margin-top:24px;position:relative;z-index:1;text-align:left}
.ec-spk-faults-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px;flex-wrap:wrap}
.ec-spk-faults-title{margin:0;font-size:17px;font-weight:900;color:var(--lang-ink);letter-spacing:-.02em}
.ec-spk-faults-pill{font-size:11px;font-weight:900;padding:6px 14px;border-radius:999px;letter-spacing:.06em;text-transform:uppercase;border:2px solid var(--lang-line);box-shadow:0 2px 0 var(--lang-line)}
.ec-spk-faults-pill--ok{background:var(--lang-lime);color:var(--lang-ink)}
.ec-spk-faults-pill--warn{background:var(--lang-yellow);color:var(--lang-ink)}
.ec-spk-faults-pill--bad{background:var(--lang-pink-2);color:#fff}
.ec-spk-fault{display:flex;gap:14px;align-items:flex-start;padding:14px 16px;border-radius:16px;margin-bottom:12px;background:#fff;border:2px solid var(--lang-line);box-shadow:0 3px 0 var(--lang-line);transition:transform .18s ease,box-shadow .18s ease}
.ec-spk-fault:hover{transform:translateY(-2px);box-shadow:0 5px 0 var(--lang-line)}
.ec-spk-fault-icon{width:36px;height:36px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;border:2px solid var(--lang-line);font-weight:900}
.ec-spk-fault--ok .ec-spk-fault-icon{background:var(--lang-lime);color:var(--lang-ink)}
.ec-spk-fault--warn .ec-spk-fault-icon{background:var(--lang-yellow);color:var(--lang-ink)}
.ec-spk-fault--bad .ec-spk-fault-icon{background:var(--lang-pink-2);color:#fff}
.ec-spk-fault--ok{background:linear-gradient(180deg,#fff 0%,rgba(212,245,92,.08) 100%)}
.ec-spk-fault--warn{background:linear-gradient(180deg,#fff 0%,rgba(245,224,77,.10) 100%)}
.ec-spk-fault--bad{background:linear-gradient(180deg,#fff 0%,rgba(255,143,203,.10) 100%)}
.ec-spk-fault-body{flex:1;min-width:0}
.ec-spk-fault-body p{margin:0 0 4px;font-size:13.5px;font-weight:900;color:var(--lang-ink)}
.ec-spk-fault-body span{font-size:12.5px;color:var(--lang-ink-soft);line-height:1.55;font-weight:700;display:block}
.ec-spk-fault-body em{font-style:normal;background:var(--lang-yellow);color:var(--lang-ink);padding:2px 8px;border-radius:6px;font-weight:900;font-size:12px;border:1.5px solid var(--lang-line)}

.ec-spk-feedback{
  margin:20px 0 0;padding:18px 20px 18px 22px;background:#fff;
  border:2px solid var(--lang-line);border-left:6px solid var(--lang-lime);border-radius:16px;
  font-size:14px;line-height:1.65;color:var(--lang-ink);text-align:left;position:relative;z-index:1;
  font-weight:700;box-shadow:0 4px 0 var(--lang-line);
}

.ec-spk-actions{display:flex;justify-content:center;gap:12px;margin-top:26px;flex-wrap:wrap;position:relative;z-index:1}
.ec-spk-btn-ghost{
  border:2px solid var(--lang-line);background:#fff;color:var(--lang-ink);
  padding:13px 24px;border-radius:999px;font-size:13.5px;font-weight:900;
  cursor:pointer;font-family:inherit;display:inline-flex;align-items:center;gap:8px;
  transition:all .16s ease;box-shadow:0 4px 0 var(--lang-line);letter-spacing:.02em;
}
.ec-spk-btn-ghost:hover{background:var(--lang-lime-soft);transform:translateY(-2px);box-shadow:0 6px 0 var(--lang-line)}
.ec-spk-btn-ghost:active{transform:translateY(2px);box-shadow:0 1px 0 var(--lang-line)}
.ec-spk-btn-dark{
  border:2px solid var(--lang-line);background:var(--lang-ink);color:var(--lang-lime);
  padding:13px 26px;border-radius:999px;font-size:13.5px;font-weight:900;
  cursor:pointer;font-family:inherit;display:inline-flex;align-items:center;gap:8px;
  transition:all .16s ease;box-shadow:0 4px 0 var(--lang-line);letter-spacing:.02em;
}
.ec-spk-btn-dark:hover{transform:translateY(-2px);box-shadow:0 6px 0 var(--lang-line)}
.ec-spk-btn-dark:active{transform:translateY(2px);box-shadow:0 1px 0 var(--lang-line)}

.ec-spk-convo{
  background:#fff;border:3px solid var(--lang-line);border-radius:32px;padding:26px;
  box-shadow:0 10px 0 var(--lang-line);display:flex;flex-direction:column;
  height:calc(100vh - 300px);min-height:540px;max-height:760px;
  background-image:radial-gradient(circle at 100% 0%,rgba(255,143,203,.12),transparent 55%);
}
.ec-spk-convo-head{margin:0 0 8px;font-size:18px;font-weight:900;color:var(--lang-ink);flex-shrink:0;letter-spacing:-.02em}
.ec-spk-convo-sub{margin:0 0 20px;font-size:13px;color:var(--lang-ink-soft);line-height:1.55;flex-shrink:0;font-weight:700}
.ec-spk-convo-log{flex:1;display:flex;flex-direction:column;gap:12px;overflow-y:auto;padding-right:6px;margin-bottom:16px;min-height:0}
.ec-spk-convo-log::-webkit-scrollbar{width:6px}
.ec-spk-convo-log::-webkit-scrollbar-thumb{background:var(--lang-purple-2);border-radius:999px}
.ec-spk-convo-msg{
  border-radius:18px;padding:13px 18px;max-width:82%;font-size:14px;line-height:1.55;
  word-wrap:break-word;animation:ec-spk-msg-in .35s ease both;font-weight:700;
  border:2px solid var(--lang-line);box-shadow:0 3px 0 var(--lang-line);
}
@keyframes ec-spk-msg-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.ec-spk-convo-msg--ai{align-self:flex-start;background:var(--lang-lime);color:var(--lang-ink);border-bottom-left-radius:6px}
.ec-spk-convo-msg--user{align-self:flex-end;background:var(--lang-ink);color:var(--lang-lime);border-bottom-right-radius:6px}
.ec-spk-convo-msg audio{display:block;margin-top:10px;width:100%;max-width:240px}
.ec-spk-convo-thinking{align-self:flex-start;display:inline-flex;align-items:center;gap:6px;padding:13px 20px;border-radius:18px;background:var(--lang-lime);color:var(--lang-ink);font-size:13px;font-weight:900;border:2px solid var(--lang-line);box-shadow:0 3px 0 var(--lang-line)}
.ec-spk-convo-thinking span{width:6px;height:6px;border-radius:50%;background:currentColor;animation:ec-spk-dot 1.2s ease-in-out infinite}
.ec-spk-convo-thinking span:nth-child(2){animation-delay:.2s}
.ec-spk-convo-thinking span:nth-child(3){animation-delay:.4s}
@keyframes ec-spk-dot{0%,80%,100%{opacity:.3;transform:scale(.8)}40%{opacity:1;transform:scale(1.1)}}
.ec-spk-convo-actions{display:flex;justify-content:center;gap:12px;flex-wrap:wrap;flex-shrink:0}

.ec-spk-history{display:flex;flex-direction:column;gap:14px}
.ec-spk-history-item{
  display:flex;justify-content:space-between;align-items:center;gap:12px;background:#fff;
  border-radius:18px;padding:16px 20px;border:2px solid var(--lang-line);
  box-shadow:0 4px 0 var(--lang-line);transition:all .18s ease;
  animation:ec-spk-msg-in .35s ease both;
}
.ec-spk-history-item:hover{transform:translateY(-3px);box-shadow:0 7px 0 var(--lang-line)}
.ec-spk-history-title{margin:0 0 4px;font-weight:900;font-size:14px;color:var(--lang-ink)}
.ec-spk-history-date{font-size:11.5px;color:var(--lang-ink-soft);font-weight:700}
.ec-spk-band-pill{font-size:11px;font-weight:900;padding:6px 14px;border-radius:999px;background:var(--lang-lime);color:var(--lang-ink);border:2px solid var(--lang-line);box-shadow:0 2px 0 var(--lang-line);text-transform:uppercase;letter-spacing:.06em;white-space:nowrap}

.ec-spk-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;text-align:center;padding:52px 24px;color:var(--lang-ink-soft);font-size:13.5px;font-weight:700;background:#fff;border-radius:22px;border:2px dashed var(--lang-line)}
.ec-spk-empty-icon{width:64px;height:64px;border-radius:50%;background:var(--lang-lime);color:var(--lang-ink);display:flex;align-items:center;justify-content:center;font-size:24px;border:2px solid var(--lang-line);box-shadow:0 3px 0 var(--lang-line)}
.ec-spk-empty-icon svg{width:28px;height:28px}

.ec-spk-side{background:#fff;border:2px solid var(--lang-line);border-radius:24px;padding:22px;box-shadow:0 6px 0 var(--lang-line);margin-bottom:16px}
.ec-spk-side:last-child{margin-bottom:0}
.ec-spk-side h3{margin:0 0 16px;font-size:15px;font-weight:900;color:var(--lang-ink);display:flex;justify-content:space-between;align-items:center;gap:8px;letter-spacing:-.01em}
.ec-spk-side h3 span{font-size:10.5px;color:var(--lang-ink);background:var(--lang-lime);padding:4px 11px;border-radius:999px;font-weight:900;text-transform:uppercase;letter-spacing:.06em;border:2px solid var(--lang-line);box-shadow:0 2px 0 var(--lang-line)}
.ec-spk-tip{display:flex;gap:12px;padding:12px 0;border-bottom:2px dashed rgba(23,16,46,.1);align-items:flex-start}
.ec-spk-tip:last-child{border-bottom:none;padding-bottom:0}
.ec-spk-tip-icon{width:34px;height:34px;border-radius:11px;background:var(--lang-purple-2);color:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:14px;font-weight:900;border:2px solid var(--lang-line);box-shadow:0 2px 0 var(--lang-line)}
.ec-spk-tip-body p{margin:0 0 3px;font-size:12.5px;font-weight:900;color:var(--lang-ink)}
.ec-spk-tip-body span{font-size:11.5px;color:var(--lang-ink-soft);line-height:1.45;display:block;font-weight:600}
.ec-spk-criteria{display:flex;flex-direction:column;gap:10px}
.ec-spk-criteria-item{display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:12.5px;font-weight:900;color:var(--lang-ink);padding:12px 15px;border-radius:14px;background:var(--lang-lime-soft);border:2px solid var(--lang-line);box-shadow:0 2px 0 var(--lang-line);transition:transform .15s ease}
.ec-spk-criteria-item:hover{transform:translateX(3px)}
.ec-spk-criteria-item span:last-child{font-size:10.5px;color:var(--lang-ink);background:var(--lang-lime);padding:3px 10px;border-radius:999px;font-weight:900;text-transform:uppercase;letter-spacing:.06em;border:2px solid var(--lang-line)}

.ec-spk-toast{position:fixed;top:78px;right:20px;z-index:50;background:var(--lang-ink);color:var(--lang-lime);padding:12px 22px;border-radius:999px;font-weight:900;font-size:13px;border:2px solid var(--lang-lime);box-shadow:0 12px 28px rgba(23,16,46,.4);animation:ec-spk-toast-pop 1s ease both;letter-spacing:.03em}
@keyframes ec-spk-toast-pop{0%{transform:translateY(-10px) scale(.9);opacity:0}20%{transform:translateY(0) scale(1);opacity:1}80%{transform:translateY(0) scale(1);opacity:1}100%{transform:translateY(-8px) scale(.98);opacity:0}}

@keyframes ec-spk-fade-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.ec-spk-anim{animation:ec-spk-fade-in .45s ease both}

@media (max-width:900px){
  .ec-spk-grid{grid-template-columns:1fr;gap:18px}
  .ec-spk-hero{flex-direction:column;align-items:flex-start;min-height:0}
  .ec-spk-hero-mascot{position:absolute;right:14px;bottom:14px;transform:scale(.72);transform-origin:bottom right;animation:none}
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
  .ec-spk-convo{padding:20px;border-radius:26px;height:auto;min-height:540px;max-height:none;box-shadow:0 7px 0 var(--lang-line)}
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
  .ec-spk-anim,.ec-spk-score,.ec-spk-convo-msg,.ec-spk-history-item,.ec-spk-toast,.ec-spk-record-warning{animation:none!important}
  .ec-spk-hero-orb,.ec-spk-hero-mascot,.ec-spk-record-ring,.ec-spk-wave-bar,.ec-spk-convo-thinking span{animation:none!important}
  .ec-spk-record-btn,.ec-spk-tab,.ec-spk-cat,.ec-spk-btn-ghost,.ec-spk-btn-dark,.ec-spk-fault,.ec-spk-history-item,.ec-spk-criteria-item{transition:none!important}
  .ec-spk-score-ring-fill{transition:none!important}
}
`;

/* ============================================================
   SCORING CONFIG
   Tunables for what counts as "real speech". Tune conservatively —
   it's better to say "not enough data" than to lie with a band score.
   ============================================================ */
const SCORING = {
  silencePeak: 0.035,       // RMS peak below this = treated as silence
  minDurationSec: 2,        // refuse to score anything under this
  minWords: 5,              // refuse to score transcripts under this
  longAnswerWords: 60,      // target length for IELTS Part 2
  idealWpm: [110, 160],     // ideal IELTS speaking pace
  acceptWpm: [90, 180],     // acceptable pace
};

/* ============================================================
   PROMPT BANK — 1,004 prompts across 10 categories
   (identical to before — kept intact)
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
      'Very well, we will visit the village on Wednesday.',
      'Victor wore a velvet vest in the west wind.',
      'Vinegar and vanilla are very versatile flavours.',
      'William watched the waves while walking west.',
      'We were very weary and we wandered away.',
      'The vet warned us about the wolf in the valley.',
      'Wet weather makes the village very vibrant.',
      'Vera waved at the vendor with a wave.',
      'The three brothers think the theatre is thrilling.',
      'Thank the thoughtful thinkers for their theories.',
      'Nothing is worth the thousand threats of weather.',
      'Both brothers bathed in the northern river.',
      'My mother and father gather leather together.',
      'The pilot likes to fly the yellow plane slowly.',
      'Really royal rulers rarely rule ruthlessly.',
      'Light the lamp, Larry, before the long night.',
      'Rusty railways run along the river reeds.',
      'She said she should see the ship on the shore.',
      'Shy students should share their shiny shoes.',
      'The chef sells fresh fish at the seaside shop.',
      'The ship hit the sheep on the steep beach.',
      'Fill the small pool with clean blue water.',
      'Pull the full cart up the steep hill.',
      'Sit still, sip the hot milk, then slip away.',
      'The cat sat flat on the fat mat in the back.',
      'The knight knows how to write with his knuckles.',
      'Please sign the receipt for the scissors.',
      'The psalm was written by a psychologist.',
      'He answered honestly about the climbed mountain.',
      'The autumn wind blew through the exhausted soldier.',
      'The castle listener whistled softly at the thistle.',
      'Photograph, photographer, photographic — say them all.',
      'Economy, economic, economist — stress each one correctly.',
      'Develop, development, developmental — stress is the key.',
      'Necessary, necessarily, necessity — practice all three.',
      'Comfortable, comfortably, uncomfortable — smooth them out.',
      'What do you want to do today? — blend it all.',
      'Would you like a cup of tea? — smooth and connected.',
      'I’m going to see him in an hour. — natural rhythm.',
      'She’s been working here for ages. — connected words.',
      'There is a lot of it in there. — link every word.',
      'Did you really mean what you said yesterday?',
      'Of course I’m going to the party tonight!',
      'Wait — did you just say that?',
      'Honestly, I have absolutely no idea.',
      'What on earth were you thinking?',
      'Throughout the thoroughly thought-provoking third Thursday, the thriving theatre welcomed thirty-three thousand thoughtful guests.',
      'Sheila Shaw shined her shiny silver shoes and shuffled slowly to the shimmering shore.',
      'Peter’s poodle pranced proudly past the pretty purple pansies in the park.',
      'Betty’s brother bounced a big blue ball beside the bubbling brook.',
      'Chester chatted cheerfully with the charming children at the chilly church.',
      'Frank fried fresh fish for Fred and Fran on Friday morning.',
      'Grumpy Greg grabbed grapes and greeted the grinning green grocer.',
      'Harriet’s happy hamster hopped happily around the huge hollow house.',
      'Jolly Jack jiggled his jug of juice while joking with Jane.',
      'Kevin kindly kept kicking the colourful kite in the kitchen.',
      'Larry laughed loudly at the lovely lady’s little lamb.',
      'Mary made many marvellous muffins on Monday morning.',
      'Nina’s noisy nephew never noticed the neat new notebook.',
      'Oliver officially offered old Olivia an orange on October the eighth.',
      'Patty patiently painted pink peonies on a plain paper plate.',
      'Quincy quickly questioned the quiet queen about her quirky quilt.',
      'Rita really ran rapidly around the narrow red road.',
      'Sammy slowly sipped sweet strawberry smoothies on Saturday.',
      'Tommy tried to tie the tiny tiger’s tie twice.',
      'Uma usually uses unusual umbrellas under the umbrella stand.',
      'Victor vividly viewed the vast valley from the very high van.',
      'Wendy wondered why Willy whistled wildly while walking west.',
      'Xena excitedly explained the excellent new exercise.',
      'Yolanda yelled at the young yellow yak yesterday.',
      'Zack zealously zoomed through the zany zebra zone.',
      'Say: comfortable, vegetable, chocolate, interesting.',
      'Say: February, Wednesday, library, secretary.',
      'Say: schedule, receipt, debt, subtle.',
      'Say: courage, encourage, flourish, nourish.',
      'Say: recipe, cuisine, buffet, chauffeur.',
      'Say: thorough, though, through, thought, tough.',
      'Say: word, world, work, worm, worry.',
      'Say: early, earth, earn, learn, heard.',
      'Say: sure, sugar, pleasure, treasure, measure.',
      'Say: busy, business, biscuit, building.',
      'Say: laugh, cough, rough, enough, tough.',
      'Say: money, honey, monk, month, Monday.',
      'Say: answer, sword, two, wrong, wrist.',
      'Say: doubt, debt, subtle, thumb, plumber.',
      'Say: foreign, sovereign, campaign, sign.',
      'Say: choir, character, chemistry, chorus.',
      'Say: rhythm, rhyme, honest, hour, heir.',
      'Say: island, aisle, muscle, castle, whistle.',
      'Say: salmon, almond, calm, palm, half.',
      'Say: iron, environment, government, maintenance.',
      'A proper cup of coffee in a proper copper coffee pot.',
      'Betty Botter bought a bit of better butter.',
      'Black bugs bleed black blood.',
      'Bring back the bright blue blistering barnacles.',
      'Clean clams crammed in clean cans.',
      'Eleven elves licked eleven little liquorice lollipops.',
      'Fat frogs flying past fast.',
      'Four furious friends fought for the phone.',
      'Fresh fried fish, fish fried fresh.',
      'Great grey geese graze in green grassy groves.',
      'Harry Hunt hunts heavy hairy hares.',
      'How many yaks could a yak chuck chuck if a yak could chuck yaks?',
      'I saw a kitten eating chicken in the kitchen.',
      'If two witches were watching two watches, which witch would watch which watch?',
      'Irish wristwatch, Swiss wristwatch, Irish wristwatch.',
      'Just think, that sphinx has a sphincter that stinks.',
      'Knapsack straps snap on strong strapping young men.',
      'Lemon liniment, lemon liniment, lemon liniment.',
      'Mixed biscuits, mixed biscuits, mixed biscuits.',
      'Nine nice night nurses nursing nicely.',
      'Old oily Ollie oils old oily autos.',
      'One-one was a racehorse, two-two was one too.',
      'Pack a pink plastic pencil pouch.',
      'Picky people pick Peter Pan peanut butter.',
      'Please put the plump plum on the pretty plate.',
      'Quick queens quickly quarrelled with quirky quails.',
      'Really leery, rarely Larry, really, really leery Larry.',
      'Red blood, black blood, blue blood — say each clearly.',
      'Really rural, really rural, really rural.',
      'Rolling red wagons, rolling red wagons.',
      'Rubber baby buggy bumpers, rubber baby buggy bumpers.',
      'Sally sells sea shells by the sea shore.',
      'Send toast to ten tense stout saints’ ten tall tents.',
      'Seven slick slimy snakes slid sideways.',
      'She sees cheese, she sews sheets, she shushes.',
      'Simple Simon sat sipping cider slowly.',
      'Six sick hicks nick six slick bricks with picks and sticks.',
      'Snap crackle pop, snap crackle pop.',
      'Stupid superstition, stupid superstition.',
      'The big black bug bit the big black bear.',
      'The blue bluebird blinks, the blue bluebird blinks.',
      'The epitome of femininity is a woman who says what she means.',
      'The excellent execution of the exercise exhausted him.',
      'The great Greek grape growers grow great Greek grapes.',
      'The myth of Miss Muffet, the myth of Miss Muffet.',
      'The oboe and the obelisk, the oboe and the obelisk.',
      'The owner of the inside inn was outside his inside inn.',
      'The sad sheik’s sad sheep’s sick.',
      'The seething sea ceaseth, the seething sea sufficeth us.',
      'The sixth sheikh’s sixth sheep is sick.',
      'The sun shines on shop signs and ship signs.',
      'The very very very very very very very very weary traveller.',
      'Three grey geese in a green field grazing.',
      'Three hundred and thirty-three thousand thirsty travellers.',
      'Three short sharp sheep, three short sharp sheep.',
      'Thrice the brinded cat hath mewed.',
      'Tie twine to three tree twigs.',
      'Truly rural, truly rural, truly rural.',
      'Twelve twins twirled twelve twigs twice.',
      'Two tiny tigers take two taxis to town.',
      'Unique New York, unique New York, unique New York.',
      'We surely shall see the sun shine soon.',
      'We will walk the wet wide way westward.',
      'Which Swiss witch switched the Swiss wristwatches?',
      'Which wristwatches are Swiss wristwatches?',
      'Will you, William, will you wash the windows?',
      'Willy’s real rear wheel, Willy’s real rear wheel.',
      'You know New York, you need New York.',
      'Zebras zig and zebras zag in the zoo.',
    ],
  },
  ielts1: {
    name: 'IELTS Part 1 · Short Answers', icon: 'chat',
    prompts: [
      'What is your full name?','Where are you from?','Do you work or are you a student?',
      'What do you like most about your hometown?','Do you live in a house or an apartment?',
      'What is your favourite room in your home?','Who do you live with?','What kind of food do you like?',
      'Do you cook at home?','How often do you eat out?','What do you usually do in the evenings?',
      'Do you prefer mornings or evenings?','How do you usually travel to work or school?',
      'Do you like reading?','What kind of books do you read?','Do you prefer paper books or e-books?',
      'Do you enjoy music?','What kind of music do you listen to?','Have you ever played a musical instrument?',
      'Do you like sports?','What sports do you play?','How often do you exercise?',
      'Do you like watching sports on TV?','What is your favourite sport to watch?','Do you enjoy travelling?',
      'What places have you visited recently?','Where would you like to travel next?',
      'Do you prefer travelling alone or with others?','Do you like meeting new people?',
      'Are you good at remembering names?','What do you do on weekends?','How do you usually spend your holidays?',
      'What is your favourite season?','Do you like rainy days?','What is the weather like in your city?',
      'Do you prefer hot or cold weather?','What kind of clothes do you like to wear?','Do you like shopping?',
      'What do you usually shop for?','Do you prefer shopping online or in stores?',
      'What do you do when you feel stressed?','How do you relax?','Do you have any hobbies?',
      'How much time do you spend on your hobby?','Are you good at drawing or painting?',
      'Do you enjoy photography?','Do you have a pet?','What pets do you like?','Do you like animals?',
      'Do you have any brothers or sisters?','How often do you see your extended family?',
      'Who are you closest to in your family?','What do you usually do with your family?',
      'Do you have a large family or a small family?','Do you enjoy family gatherings?',
      'What is your favourite memory with your family?','How did you celebrate birthdays as a child?',
      'What kind of presents do you like to receive?','Do you like giving presents?',
      'What is the best gift you have ever received?','Do you use public transport?',
      'How do you usually get around your city?','What is your favourite way to travel?',
      'Do you like driving?','Have you ever used a bike to commute?','Do you prefer trains or buses?',
      'Do you like watching movies?','What kind of movies do you enjoy?','How often do you go to the cinema?',
      'Who do you usually watch movies with?','What is your favourite movie and why?',
      'Do you prefer comedy or drama?','Do you like TV series?','Do you binge-watch shows?',
      'What is the last series you watched?','Do you play video games?','What games do you like?',
      'How often do you play?','Do you use social media?','What social media platform do you use most?',
      'How much time do you spend on social media daily?','Do you like taking photographs?',
      'Do you use a smartphone or a camera to take photos?','Do you ever share your photos online?',
      'Do you like to give gifts?','What was the last gift you gave?',
      'Do you prefer giving or receiving gifts?','Do you like flowers?','What is your favourite flower?',
      'Do you ever buy flowers for yourself?','Do you like the colour of your bedroom?',
      'Would you like to change the colour of your bedroom?','What colours do you like most?',
      'Do you enjoy walking?','Where do you usually walk?','Do you walk more in the morning or evening?',
      'Do you like to plan your day?','Are you a planner or spontaneous?','Do you keep a diary or journal?',
      'Do you enjoy going to the beach?','What do you like about the sea?','Do you swim in the sea?',
      'Do you like the countryside or the city?','Why do you prefer one over the other?',
      'Do you ever go camping?','Do you like getting up early?','What time do you usually wake up?',
      'Do you need coffee or tea to start your day?','Do you drink tea or coffee?',
      'What is your favourite drink?','Do you ever drink juice?','Do you eat breakfast every day?',
      'What do you usually eat for breakfast?','Do you like traditional food from your country?',
      'What is your favourite dish?','Do you like spicy food?','Do you use cash or cards?',
      'Do you carry cash with you?','Do you save money?',
      'What would you buy if you had a million dollars?','Do you like going to markets?',
      'Do you ever cook for other people?','What is your favourite thing to cook?',
      'Do you like learning languages?','Why are you learning English?',
      'How long have you been learning English?','Do you think English is difficult?',
      'Do you speak any other languages?','Do you like meeting people from other countries?',
      'Do you have friends abroad?','Do you like using the internet?','What do you use the internet for?',
      'Do you think the internet is useful?','Do you like to use technology?',
      'Do you like to learn new technology?','How do you feel about artificial intelligence?',
      'Do you like to sleep in on weekends?','Do you take naps during the day?',
      'Do you like to listen to music while working?','Do you dance?','Do you like dancing in public?',
      'Do you like karaoke?','Do you like children?','Do you want children in the future?','Do you like babies?',
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
      'Describe a memorable wedding you attended. Say whose wedding it was, where it was held, and why it was memorable.',
      'Describe a popular book in your country. Say what it is, what it is about, and why it is popular.',
      'Describe a piece of music you enjoy. Say what it is, when you listen to it, and why you enjoy it.',
      'Describe a place where you like to go shopping. Say where it is, what it sells, and why you like it.',
      'Talk about a time you had to make a difficult decision. Say what the decision was, what you chose, and why.',
      'Describe a person you would like to meet. Say who they are, what they are like, and why you would like to meet them.',
      'Talk about a day you will never forget. Say what happened, who was there, and why you will never forget it.',
      'Describe a sport you enjoy watching. Say what it is, where you watch it, and why you enjoy it.',
      'Talk about a childhood friend. Say who they are, how you met, and what you did together.',
      'Describe a house or apartment you would like to live in. Say where it would be, what it would look like, and why you would like it.',
      'Talk about a time you did something for the first time. Say what it was, when it happened, and how you felt.',
      'Describe a skill your friend has that you admire. Say what the skill is, how your friend developed it, and why you admire it.',
      'Talk about a local shop you often visit. Say where it is, what it sells, and why you visit it.',
      'Describe a toy or game you enjoyed as a child. Say what it was, how you played with it, and why you enjoyed it.',
      'Talk about a time you were very busy. Say when it was, what you were doing, and how you managed it.',
      'Describe a piece of good news you received. Say what the news was, when you got it, and how you felt.',
      'Talk about a photograph you took that you are proud of. Say what it shows, when you took it, and why you are proud of it.',
      'Describe a place in your town where people go to relax. Say where it is, what people do there, and why they go.',
      'Talk about a time you had to apologise. Say who you apologised to, why, and what happened afterwards.',
      'Describe a member of your family you spend a lot of time with. Say who they are, what you do together, and why you enjoy their company.',
      'Talk about a popular food from your country. Say what it is, how it is made, and why it is popular.',
      'Describe a building you find interesting. Say where it is, what it looks like, and why you find it interesting.',
      'Talk about a time you received help from someone. Say who helped you, what they did, and how it made you feel.',
      'Describe a piece of technology you could not live without. Say what it is, how you use it, and why it is essential.',
      'Talk about an important decision your family made. Say what the decision was, how it affected you, and why it was important.',
      'Describe a teacher or mentor who encouraged you. Say who they are, what they did, and how it helped you.',
      'Talk about a time you travelled by yourself. Say where you went, what you did, and what you learned.',
      'Describe a gift you gave someone that they loved. Say what it was, who it was for, and why they loved it.',
      'Talk about a tradition in your country that you like. Say what it is, when it happens, and why you like it.',
      'Describe an important historical event in your country. Say what happened, when it happened, and why it was important.',
      'Talk about a time you had to work with a team. Say what the project was, who was on the team, and how it went.',
      'Describe a hobby you would like to take up. Say what it is, how you would start it, and why it interests you.',
      'Talk about a subject you found difficult at school. Say what it was, why it was difficult, and how you dealt with it.',
      'Describe an app or website that you find useful. Say what it is, how you use it, and why it helps you.',
      'Talk about a friend who is very different from you. Say who they are, how you met, and how you are different.',
      'Describe a neighbourhood you would like to live in. Say where it is, what it is like, and why you would like to live there.',
      'Talk about a time when you had to wait for something. Say what you were waiting for, how long you waited, and how you felt.',
      'Describe a piece of advice you would give to your younger self. Say what the advice would be, when you would give it, and why.',
      'Talk about a person who speaks a language you find beautiful. Say who they are, what language they speak, and why you find it beautiful.',
      'Describe a film that made you laugh. Say what it was, when you watched it, and why it made you laugh.',
      'Talk about a place where you feel the most productive. Say where it is, what you do there, and why it works for you.',
      'Describe a piece of traditional clothing in your country. Say what it is, when it is worn, and why it is special.',
      'Talk about a moment when you felt very grateful. Say what happened, who was involved, and why you felt grateful.',
      'Describe a subject you would like to teach. Say what it is, who you would teach, and why.',
      'Talk about a time you received constructive criticism. Say what it was about, how you reacted, and what you learned.',
      'Describe an outdoor activity you enjoy. Say what it is, where you do it, and why you enjoy it.',
      'Talk about a person who is very organised. Say who they are, how they stay organised, and what you can learn from them.',
      'Describe a time when you had to be patient. Say what the situation was, how you stayed patient, and what the outcome was.',
      'Talk about a childhood dream you had. Say what the dream was, why you had it, and what happened to it.',
      'Describe an item you own that has sentimental value. Say what it is, how you got it, and why it matters.',
      'Talk about a time when you felt truly happy. Say what you were doing, who you were with, and why it made you happy.',
      'Describe a public place you often visit. Say where it is, what people do there, and why you go there.',
      'Talk about a time you had to change your plans. Say what the original plan was, why it changed, and how you handled it.',
      'Describe a skill that took you a long time to learn. Say what the skill is, how long it took, and how you felt when you mastered it.',
      'Talk about a friend you have known for a long time. Say who they are, how you met, and why the friendship has lasted.',
      'Describe a hobby you used to have but stopped. Say what it was, why you stopped, and whether you would like to start again.',
      'Talk about a book you would like to give as a gift. Say what the book is, who you would give it to, and why.',
      'Describe a career you admire. Say what it is, who does it, and why you admire it.',
      'Talk about a meal you cooked for someone. Say what you cooked, who it was for, and how it went.',
      'Describe a piece of news that surprised you. Say what the news was, when you heard it, and why it surprised you.',
      'Talk about a time you helped a family member. Say who it was, what you did, and how it made you feel.',
      'Describe a personal goal you have already achieved. Say what it was, how you achieved it, and why it mattered.',
      'Talk about a place where you go to think. Say where it is, when you go there, and why it helps you think.',
      'Describe an app you would like to design. Say what it would do, who it would help, and why you would design it.',
      'Talk about a time you made a new friend. Say where you met them, what you talked about, and why you became friends.',
      'Describe something you do to stay healthy. Say what it is, how often you do it, and why it helps.',
      'Talk about an important lesson you learned from your parents. Say what the lesson was, when you learned it, and how it has helped you.',
      'Describe a favourite family photograph. Say what it shows, who is in it, and why it is your favourite.',
      'Talk about a hobby that is popular in your country. Say what it is, who does it, and why it is popular.',
      'Describe a place you like to visit on weekends. Say where it is, what you do there, and why you like it.',
      'Talk about a time you surprised someone. Say who you surprised, how you did it, and how they reacted.',
      'Describe a habit that helps you stay productive. Say what it is, when you do it, and why it works.',
      'Talk about a piece of advice you would give to a tourist visiting your country. Say what the advice is, why it matters, and how it would help.',
      'Describe a skill that everyone should learn. Say what it is, why it is important, and how people can learn it.',
      'Talk about a time you had to say no to someone. Say who it was, why you said no, and how they reacted.',
      'Describe a place where you would like to celebrate a special occasion. Say where it is, who you would invite, and why.',
      'Talk about a piece of music that reminds you of a specific time. Say what the music is, when you heard it, and why it reminds you of that time.',
      'Describe an experience that made you more confident. Say what the experience was, when it happened, and how it changed you.',
      'Talk about a person who makes you laugh. Say who they are, what they do, and why they make you laugh.',
      'Describe something you would like to learn from your grandparents. Say what it is, why it matters, and how you would learn it.',
      'Talk about a recent purchase you are happy with. Say what it is, where you bought it, and why you are happy with it.',
      'Describe a place where you have worked or studied. Say where it is, what you did there, and how you felt about it.',
      'Talk about a time when you had to be brave. Say what the situation was, what you did, and how it turned out.',
      'Describe an object you use every day. Say what it is, how you use it, and why it is important to you.',
      'Talk about a festival or holiday you would like to experience. Say what it is, where it takes place, and why you would like to experience it.',
      'Describe a decision that was difficult but correct. Say what the decision was, why it was difficult, and why it was correct.',
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
      'Why do people enjoy watching sports?','What makes a good leader?',
      'How has the internet changed the way people learn?',
      'Do you think tourism is good or bad for local communities?',
      'Should the retirement age be raised? Why or why not?',
      'How can we reduce plastic waste?','What role does money play in happiness?',
      'Should students be allowed to choose their own subjects?',
      'What are the pros and cons of living alone?',
      'How do you think jobs will change in the next 20 years?',
      'Should violent video games be banned? Why or why not?',
      'Why do some people volunteer?','What makes a city a good place to live?',
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
      'How important is it for people to have hobbies?',
      'What are the benefits of learning a musical instrument?',
      'Why do some people prefer to live alone?',
      'How can governments reduce unemployment?',
      'Should people be required to vote? Why?',
      'How has online banking changed our lives?',
      'Do you think advertising to children should be banned?',
      'What are the pros and cons of being famous?',
      'How has COVID-19 changed the way we work?',
      'Is it important to preserve traditional crafts?',
      'How can parents help their children succeed at school?',
      'What role should schools play in teaching life skills?',
      'Are video games a waste of time? Why or why not?',
      'How does social media influence body image?',
      'Should animals be kept in zoos? Why or why not?',
      'What are the benefits of reading fiction?',
      'Do you think the death penalty should exist?',
      'How can we encourage more people to recycle?',
      'Is it important to learn about other cultures?',
      'Should companies be allowed to track employees’ data?',
      'How has remote work affected family life?',
      'What are the challenges of raising children today?',
      'Should universities focus more on practical skills?',
      'How can we make cities more age-friendly?',
      'Should there be a universal basic income? Why or why not?',
      'What is the role of the arts in society?',
      'How can we reduce food waste in our homes?',
      'Should schools teach financial literacy?',
      'Do you think parenting has changed over the years?',
      'How do documentaries influence public opinion?',
      'Should private schools exist? Why or why not?',
      'What makes a good neighbourhood?','How can we encourage more people to read?',
      'Should companies allow pets in the workplace?',
      'What are the challenges of working in a global team?',
      'How has social media changed friendships?',
      'Is remote work the future of employment?',
      'Should there be limits on screen time for children?',
      'How important is sleep for productivity?',
      'What are the effects of ageing populations?',
      'Should we invest in space tourism?',
      'How can traditional medicine and modern medicine coexist?',
      'What role do grandparents play in modern families?',
      'Should governments subsidise public art?',
      'How do films shape our perception of history?',
      'Should everyone learn to code? Why or why not?',
      'What are the challenges of being bilingual?',
      'How can we make public spaces safer?',
      'Should we ban single-use plastics globally?',
      'How has artificial intelligence affected job markets?',
      'What are the pros and cons of living abroad?',
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
      'What is a book that changed your life?','Describe your dream house.',
      'What is a hobby you have recently picked up?',
      'What is something you are looking forward to?',
      'What is a small thing that makes you happy?',
      'Tell me about a time you helped someone.',
      'What is the best advice you have ever received?',
      'What would you do if you won the lottery?',
      'What is your favourite family tradition?',
      'What is a skill you wish you had?','Describe the perfect day.',
      'What is your favourite song right now?',
      'What is something you want to learn this year?',
      'Tell me about a time you were scared.','What makes you laugh?',
      'What would you like to be famous for?','What is your biggest pet peeve?',
      'What is a country you want to visit?','Describe a moment when you felt proud.',
      'What is your favourite way to relax?','What is something you are grateful for?',
      'Tell me about a place you feel safe.','What is the most beautiful place you have seen?',
      'What is a food you could eat every day?','Tell me about a memorable birthday.',
      'What is something people misunderstand about you?',
      'What is your favourite memory from school?',
      'If you could meet anyone, who would it be?',
      'What is a goal you are working towards?','Tell me about your first job.',
      'What is a smell that reminds you of childhood?',
      'What is the bravest thing you have ever done?','What makes a good friend?',
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
      'What is a small habit that improved your life?','What is your dream job?',
      'What is the most exciting thing you have done?',
      'What is something you believed as a child that was wrong?',
      'Tell me about a time you made a mistake and learned from it.',
      'What is your favourite way to spend a rainy day?',
      'What is a place that feels like home to you?',
      'What is your favourite thing to cook?',
      'What is a compliment you will never forget?',
      'What is a movie that surprised you?','What is a book you could not put down?',
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
      'What is your favourite weekend activity?','Who is your role model and why?',
      'What is the most memorable trip you have taken?',
      'What is a food you will never eat again?',
      'What is something you are really good at?',
      'What is the strangest dream you have had?',
      'If you could time travel, where would you go?',
      'What is your favourite way to exercise?','What is a hobby you want to try?',
      'What is a movie that made you think differently?',
      'Tell me about your favourite teacher.',
      'What is the best piece of advice you ever gave?',
      'What is something you would tell your younger self?',
      'What is a typical day like for you?',
      'What is your favourite thing about your city?',
      'If you could change one thing about the world, what would it be?',
      'What is a book you think everyone should read?',
      'What is your favourite breakfast?','What is something that excites you?',
      'What is a fear you have overcome?','What is your favourite thing about the summer?',
      'What is something you did last week that you enjoyed?',
      'What is your favourite drink?','What is a talent you wish you had?',
      'Tell me about a time you were embarrassed.',
      'What is a piece of music that moves you?',
      'What is your favourite thing to do on a Sunday?',
      'What is a place you have never been but want to go?',
      'What is something you do that is uniquely you?',
      'What is a lesson you learned the hard way?',
      'What is a tradition you want to start?','What is your ideal holiday?',
      'Tell me about a person who inspired you.','What is a small win you had recently?',
      'What is your favourite genre of film?',
      'What is something you would like to change about yourself?',
      'What is a book that made you laugh out loud?',
      'What is a food from your childhood you miss?',
      'What is your favourite way to spend a Saturday?',
      'If you could only eat one meal forever, what would it be?',
      'What is a sport you would love to be good at?','What is something you were wrong about?',
      'What is your favourite thing about being an adult?',
      'What is something you miss about being a child?',
      'What is your favourite thing to do with friends?',
      'What is a piece of technology you cannot live without?',
      'What is your favourite kind of weather?',
      'Tell me about a person you would like to meet.',
      'What is something you have done that you are proud of?',
      'What is your favourite thing about your job or studies?',
      'What is a challenge you are currently facing?',
      'What is something you want to achieve this year?',
      'What is your favourite animal and why?',
      'What is a weird food combination you enjoy?',
      'What is a good book you read recently?',
      'What is your favourite way to spend a day off?',
      'What is something you wish you had more time for?',
      'What is a movie that surprised you with its ending?',
      'What is something you are looking forward to this month?',
      'What is your favourite thing about autumn?',
      'What is a life lesson you would share with a friend?',
      'What is your favourite kind of cake?',
      'What is something you have done recently that was fun?',
      'If you had to describe yourself in three words, what would they be?',
      'What is a place where you feel most yourself?','What is a piece of art you love?',
      'What is a topic you could talk about for hours?',
      'What is your favourite memory from childhood?',
      'What is something you do just for yourself?','What is your favourite time of day?',
      'Tell me about a funny thing that happened to you.',
      'What is your favourite ice cream flavour?',
      'What is something you have learned recently?',
      'What is your favourite kind of exercise?','What is a goal you achieved recently?',
      'What is a bad habit you want to break?','What is a film that made you cry?',
      'What is a place you love to visit?',
      'What is your favourite childhood memory involving food?',
      'What is something that makes you feel young?','What is a value you hold most dear?',
      'What is something you do to take care of yourself?',
      'What is your favourite thing to do at the beach?',
      'What is a piece of advice you live by?','Tell me about a funny pet you know.',
      'What is your favourite way to celebrate a birthday?',
      'What is something you have recently discovered about yourself?',
      'What is your favourite thing about your best friend?',
      'What is something you enjoy doing alone?','What is your favourite season to travel?',
      'What is something you will never do again?',
      'What is your favourite way to stay healthy?',
      'What is a hobby you would recommend to anyone?',
      'What is something that always makes you smile?',
      'What is a skill you learned as an adult?',
      'What is something you do when you are stressed?',
      'What is your favourite family recipe?','What is a film you would watch again tonight?',
      'What is something you have always been curious about?',
      'What is a lesson you learned from a mistake?',
      'What is your favourite thing to do with your family?',
      'What is your favourite thing to do with your best friend?',
      'What is a trip you would like to take with your family?',
      'What is something you have accomplished this week?',
      'What is a way you have changed in the last five years?',
      'What is your favourite memory from last year?',
      'What is something you would like to be better at?',
      'What is a movie you would recommend to a friend?',
      'What is a new food you tried recently?',
      'What is your favourite way to spend a lazy day?',
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
      'You are at an embassy. Ask about the status of your visa application.',
      'You are at a bank. Report a lost bank card.',
      'You are at a supermarket. Ask where an item is and check the price.',
      'You are at a train station. Ask about train times and change a ticket.',
      'You are at a dentist. Book a cleaning appointment.',
      'You are at a doctor’s office. Ask about a referral to a specialist.',
      'You are at a ticket counter. Buy tickets for a concert.',
      'You are at a hotel reception. Ask for a late checkout.',
      'You are at a car dealership. Test-drive a car.',
      'You are at a fitness studio. Ask about yoga classes.',
      'You are at a café. Ask for a dairy-free option.',
      'You are at a restaurant. Send back food that is not what you ordered.',
      'You are at a jewellery shop. Ask about a warranty.',
      'You are at a police station. Report a stolen phone.',
      'You are at a telephone company. Change your data plan.',
      'You are at a school. Ask about your child’s progress.',
      'You are at a travel agent. Change a flight booking.',
      'You are at a hotel. Ask about airport transfer.',
      'You are at a rental car agency. Ask about fuel policy.',
      'You are at a bakery. Ask about gluten-free bread.',
      'You are at a pharmacy. Ask about a prescription refill.',
      'You are at a tailoring shop. Give measurements for a kurta.',
      'You are at a photo studio. Book a family portrait session.',
      'You are at a spa. Ask about massage options.',
      'You are at a wedding planner’s office. Discuss venue options.',
      'You are at a florist. Order flowers for a funeral.',
      'You are at a hardware store. Ask for advice on fixing a leaky tap.',
      'You are at a home décor store. Ask about return policy.',
      'You are at a pet groomer. Book an appointment for your dog.',
      'You are at a karate class. Ask about trial lessons.',
      'You are at a cooking school. Enquire about a short course.',
      'You are at a job fair. Ask about internships.',
      'You are at a bank. Apply for a loan.',
      'You are at a real estate agency. Schedule a house viewing.',
      'You are at a mobile phone shop. Get your screen repaired.',
      'You are at a car wash. Ask about detailing options.',
      'You are at a courier office. Track a missing package.',
      'You are at a driving school. Enquire about a refresher course.',
      'You are at an internet cafe. Ask about printing services.',
      'You are at a ticket office. Book a theatre ticket.',
      'You are at a music store. Ask about a trumpet for a beginner.',
      'You are at a bookshop. Ask for a book recommendation.',
      'You are at a shoe store. Ask about a return for a defective shoe.',
      'You are at a jewellery shop. Get a chain repaired.',
      'You are at a hotel. Ask about a meeting room for a business event.',
      'You are at a catering office. Plan food for a party.',
      'You are at a driving test centre. Ask about the test format.',
      'You are at a university admissions office. Ask about transfer credits.',
      'You are at a bank. Set up online banking.',
      'You are at a hospital. Ask about visiting hours.',
      'You are at a dentist. Ask about braces.',
      'You are at a school. Ask about a parent-teacher meeting.',
      'You are at a pharmacy. Ask about allergy medicine.',
      'You are at a ticket counter. Ask about refund policy.',
      'You are at a spa. Book a facial.',
      'You are at a travel agency. Ask about travel insurance.',
      'You are at a restaurant. Ask for a vegan option.',
      'You are at a bank. Ask about a safety deposit box.',
      'You are at a phone shop. Ask about phone insurance.',
      'You are at a car repair shop. Ask about a warranty on repairs.',
      'You are at a furniture store. Ask about a custom sofa.',
      'You are at a gym. Ask about a personal training plan.',
      'You are at a driving school. Book your first lesson.',
      'You are at a lawyer’s office. Ask about rental agreements.',
      'You are at a school. Ask about after-school programmes.',
    ],
  },
  story: {
    name: 'Story Retelling', icon: 'book',
    prompts: [
      'Tell the story of your first day at a new school or job.',
      'Describe a time when you got lost.','Tell about a time you helped a stranger.',
      'Describe a memorable trip with your family.','Tell about a time you missed something important.',
      'Describe a funny thing that happened to you.','Tell the story of a big mistake you made.',
      'Describe a time you overcame a fear.','Tell about a time you stood up for someone.',
      'Describe a time you tried something new.','Tell about a time you had to make a difficult choice.',
      'Describe an event that changed your plans.','Tell about a time you received unexpected help.',
      'Describe a moment when you felt truly proud.','Tell about a memorable conversation you had.',
      'Describe a time when you were very lucky.','Tell about a time you had to work in a team.',
      'Describe a moment when you were very scared.','Tell about a time you surprised someone.',
      'Describe a time you had to say sorry.','Tell about a time you met someone famous.',
      'Describe a trip that did not go as planned.','Tell about a day when everything went wrong.',
      'Describe a moment when you felt truly grateful.','Tell about a time you helped your family.',
      'Describe a time you succeeded at something difficult.','Tell about a time you had to be brave.',
      'Describe a moment when you learned an important lesson.','Tell about a time you cheered someone up.',
      'Describe a moment of unexpected kindness.','Tell about a time you felt very tired.',
      'Describe a moment when you could not stop laughing.','Tell about a time you got a surprise gift.',
      'Describe a moment when you felt left out.','Tell about a time you taught someone something.',
      'Describe a moment when you were misunderstood.','Tell about a time you forgave someone.',
      'Describe a time when you made a new friend.','Tell about a time you lost something important.',
      'Describe a moment when you felt proud of someone else.','Tell about a time you were very nervous.',
      'Describe a time you changed your mind about something.',
      'Tell about a time you did something you thought you could not do.',
      'Describe a moment when you felt truly alive.','Tell about a time you were disappointed.',
      'Describe a moment when someone surprised you with kindness.',
      'Tell about a time you had to wait a long time.',
      'Describe a moment when you felt like giving up.','Tell about a time you decided to try again.',
      'Describe a moment when you felt truly at peace.',
      'Tell about a time you had to be patient with someone.',
      'Describe a moment when you made someone smile.',
      'Tell about a time you discovered something new about yourself.',
      'Describe a moment when you felt truly connected to nature.',
      'Tell about a time you had to ask for help.',
      'Describe a moment when you felt proud of your work.',
      'Tell about a time you made a promise and kept it.',
      'Describe a moment when you felt truly loved.',
      'Tell about a time you did something kind without being asked.',
      'Describe a moment when you felt out of your comfort zone.',
      'Tell about a time you solved a difficult problem.',
      'Describe a moment when you felt inspired.',
      'Tell about a time you learned from a sibling or cousin.',
      'Describe a moment when you felt truly appreciated.',
      'Tell about a time you had to be honest even when it was hard.',
      'Describe a moment when you felt truly lucky.','Tell about a time you took a big risk.',
      'Describe a moment when you felt truly understood.',
      'Tell about a time you made a mistake and fixed it.',
      'Describe a moment when you felt truly hopeful.',
      'Tell about a time you had to make a decision quickly.',
      'Describe a moment when you felt truly inspired by someone.',
      'Tell about a time you surprised yourself.',
      'Describe a moment when you felt truly grateful for your family.',
      'Tell about a time you did something for the first time.',
      'Describe a moment when you felt truly happy being alone.',
      'Tell about a time you felt truly proud of a friend.',
      'Describe a moment when you felt truly connected to someone.',
      'Tell about a time you helped someone who needed it.',
      'Describe a moment when you felt truly afraid.',
      'Tell about a time you overcame a big challenge.',
      'Describe a moment when you felt truly happy for someone else.',
      'Tell about a time you learned a lesson the hard way.',
      'Describe a moment when you felt truly alive in nature.',
      'Tell about a time you made a friend in an unexpected place.',
      'Describe a moment when you felt truly at home.',
      'Tell about a time you realised something important about yourself.',
      'Describe a moment when you felt truly inspired by art.',
      'Tell about a time you did something that scared you.',
      'Describe a moment when you felt truly grateful for small things.',
      'Tell about a time you had to change your habits.',
      'Describe a moment when you felt truly lucky to be alive.',
      'Tell about a time you helped someone through a difficult time.',
      'Describe a moment when you felt truly proud of your country.',
      'Tell about a time you learned something from a child.',
      'Describe a moment when you felt truly at peace with a decision.',
      'Tell about a time you laughed until you cried.',
      'Describe a moment when you felt truly seen.',
      'Tell about a time you went out of your way for someone.',
      'Describe a moment when you felt truly grateful for friendship.',
    ],
  },
  describe: {
    name: 'Describe the Scenario', icon: 'target',
    prompts: [
      'Describe a typical morning in your household.',
      'Describe what you see on your way to work.','Describe your favourite café.',
      'Describe your ideal weekend.','Describe a typical family dinner.',
      'Describe the view from your window.','Describe your favourite room in your house.',
      'Describe a busy street in your city.','Describe a quiet place you like.',
      'Describe a rainy day at home.','Describe the perfect holiday.','Describe your favourite meal.',
      'Describe a memorable sunset you have seen.','Describe the inside of your favourite shop.',
      'Describe a park you often visit.','Describe your favourite childhood place.',
      'Describe a typical day at your school or work.',
      'Describe a concert or event you attended.',
      'Describe what you would take on a desert island.',
      'Describe your favourite piece of clothing.',
      'Describe the most beautiful place you have seen.','Describe your favourite photo.',
      'Describe a small town you have visited.','Describe a big city you have been to.',
      'Describe your desk or workspace.','Describe your favourite festival.',
      'Describe the kitchen of your childhood home.','Describe a market you have been to.',
      'Describe a river or lake near you.','Describe a mountain you have visited.',
      'Describe your favourite book cover.','Describe the first job you ever had.',
      'Describe a family gathering you attended.','Describe your first car or bicycle.',
      'Describe a piece of art you like.','Describe a gift that means a lot to you.',
      'Describe a family recipe.','Describe a childhood toy.',
      'Describe a place you go to feel calm.','Describe a public holiday in your country.',
      'Describe your neighbourhood.','Describe a library you have visited.',
      'Describe a shop where you like to buy clothes.','Describe a bus or train journey you took.',
      'Describe a street market you like.','Describe a hotel you stayed in.',
      'Describe a beach you have visited.','Describe a restaurant you would recommend.',
      'Describe the sound of your city at night.',
      'Describe a person you see regularly on your commute.',
      'Describe the weather today.','Describe your school or college.',
      'Describe your favourite spot in your home.','Describe a wedding you attended.',
      'Describe your morning routine.','Describe your evening routine.',
      'Describe a museum you visited.','Describe a temple, mosque, or church you have seen.',
      'Describe a monument or landmark in your city.','Describe a garden you like.',
      'Describe a hill or viewpoint you have been to.',
      'Describe a small business in your area.',
      'Describe the smell of your favourite food.',
      'Describe a piece of clothing someone gave you.',
      'Describe a bag you carry every day.','Describe a photograph on your phone.',
      'Describe a plant in your home or garden.','Describe your pet or a pet you know.',
      'Describe a favourite toy you had as a child.',
      'Describe your favourite shop for snacks.','Describe a place you go to exercise.',
      'Describe a place you go to study.','Describe a place where you celebrate birthdays.',
      'Describe a stair or hallway in your home.','Describe a family heirloom or keepsake.',
      'Describe a hand-written letter or card you received.',
      'Describe a book you have on your shelf.',
      'Describe a piece of jewellery you own.',
      'Describe a traditional dish from your region.',
      'Describe a street food you love.','Describe a music concert you attended.',
      'Describe a sports match you watched live.',
      'Describe the first time you cooked a meal for someone.',
      'Describe a long walk you have taken.','Describe a rainy day you remember well.',
      'Describe a snowy or foggy day you experienced.',
      'Describe a place you go to watch the sunset.',
      'Describe a room in your grandparents’ house.','Describe a village you visited.',
      'Describe your first day at a new job or school.','Describe a road trip you have taken.',
      'Describe a scenic train journey.','Describe a building you find interesting.',
      'Describe an old part of your city.','Describe a place where you feel safe.',
      'Describe a place where you feel inspired.',
      'Describe a place that reminds you of your childhood.',
      'Describe a place that reminds you of a family member.',
      'Describe a place you would like to take a visitor to.',
    ],
  },
  topic: {
    name: 'Topic Discussion', icon: 'chat',
    prompts: [
      'Talk about the importance of learning English in your country.',
      'Discuss the impact of social media on teenagers.',
      'Talk about the benefits of regular exercise.',
      'Discuss why reading is important.','Talk about the value of travelling.',
      'Discuss whether homework should be banned.',
      'Talk about the future of artificial intelligence.',
      'Discuss the advantages of living in a city.',
      'Talk about ways to protect the environment.',
      'Discuss the role of family in modern society.',
      'Talk about the importance of time management.',
      'Discuss whether money can buy happiness.',
      'Talk about the challenges of learning a new language.',
      'Discuss the benefits of volunteering.','Talk about the importance of sleep.',
      'Discuss whether video games are good or bad for children.',
      'Talk about the value of failure.','Discuss the effects of climate change.',
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
      'Discuss whether exams are fair.','Talk about the benefits of being bilingual.',
      'Discuss how to build good habits.','Talk about the value of arts education.',
      'Discuss whether sports stars are paid too much.',
      'Talk about the importance of mental health.',
      'Discuss how to improve public transport in your city.',
      'Talk about the value of learning history.',
      'Discuss the pros and cons of remote work.',
      'Talk about the role of teachers in society.',
      'Discuss whether social media should be regulated.',
      'Talk about how to make cities greener.',
      'Discuss the importance of preserving local traditions.',
      'Talk about the value of doing voluntary work.',
      'Discuss whether children should learn coding at school.',
      'Talk about the impact of fast fashion.','Discuss how to reduce food waste.',
      'Talk about the pros and cons of being famous.',
      'Discuss the effects of watching too much TV.',
      'Talk about the importance of having hobbies.',
      'Discuss whether exams should be replaced by projects.',
      'Talk about the value of reading fiction.',
      'Discuss how to encourage more people to read.',
      'Talk about the role of music in everyday life.',
      'Discuss whether everyone should learn a musical instrument.',
      'Talk about how technology has changed the workplace.',
      'Discuss the pros and cons of online education.',
      'Talk about the importance of play for children.',
      'Discuss the effects of advertising on young people.',
      'Talk about the value of learning about other cultures.',
      'Discuss whether parents should choose their children’s friends.',
      'Talk about the importance of sleep for students.',
      'Discuss the pros and cons of owning a pet.',
      'Talk about how to improve recycling in your community.',
      'Discuss whether city life is better than country life.',
      'Talk about the impact of tourism on small towns.',
      'Discuss the value of learning a foreign language early.',
      'Talk about how to reduce stress at work.',
      'Discuss the importance of community events.',
      'Talk about whether public transport should be free.',
      'Discuss how to make education more accessible.',
      'Talk about the role of sport in schools.',
      'Discuss whether sports should be compulsory at school.',
      'Talk about the value of doing chores as a child.',
      'Discuss whether fashion is important.','Talk about how to build a kinder society.',
      'Discuss whether social media makes us less happy.',
      'Talk about the importance of first impressions.',
      'Discuss whether everyone should learn a second language.',
      'Talk about how to make friends as an adult.',
      'Discuss whether long-distance friendships can work.',
      'Talk about the importance of family meals.',
      'Discuss whether it is better to be an only child or have siblings.',
      'Talk about the value of family traditions.',
      'Discuss whether it is important to keep old photographs.',
      'Talk about the importance of knowing your neighbours.',
      'Discuss whether charity starts at home.',
      'Talk about the value of learning practical skills at school.',
      'Discuss whether it is better to rent or buy a home.',
      'Talk about the importance of good manners.',
      'Discuss whether social media is a good way to stay in touch.',
      'Talk about the value of handwritten letters.',
      'Discuss whether everyone should know how to cook.',
      'Talk about the importance of financial literacy.',
      'Discuss whether it is better to be self-employed or work for a company.',
      'Talk about how to maintain a work-life balance.',
      'Discuss the value of taking regular breaks from technology.',
    ],
  },
  interview: {
    name: 'Interview Questions', icon: 'users',
    prompts: [
      'Tell me about yourself.','Why do you want this job?','What are your strengths?',
      'What are your weaknesses?','Where do you see yourself in five years?',
      'Why should we hire you?','What motivates you?','Describe a challenge you overcame.',
      'How do you handle stress?','What is your greatest achievement?',
      'How do you work in a team?','Describe a time you showed leadership.',
      'How do you prioritise tasks?','Tell me about a time you failed.',
      'What are your salary expectations?','Why are you leaving your current job?',
      'How do you handle criticism?','What do you do outside of work?',
      'What is your ideal work environment?','How do you learn new skills?',
      'Describe a time you disagreed with your boss.','How do you stay organised?',
      'What makes you unique?','Where do you get your best ideas?',
      'How do you handle tight deadlines?',
      'What is your favourite part of your current job?',
      'What is the most difficult thing you have had to do?',
      'How do you build relationships with coworkers?','What does success mean to you?',
      'What would your colleagues say about you?',
      'How do you handle multiple projects at once?','What is your dream career path?',
      'Describe a project you are proud of.','How do you approach learning from mistakes?',
      'Why did you choose your field?','What kind of manager do you work best with?',
      'How do you cope with change?','What are you most passionate about?',
      'How would you handle a difficult customer?','What would make you leave a job?',
      'Do you prefer working alone or in a team?','How do you stay updated in your field?',
      'What value do you bring to a team?','Describe your ideal day at work.',
      'How do you handle a heavy workload?','What questions do you have for us?',
      'How do you deal with a mistake you made?','What is your biggest professional goal?',
      'Tell me about a time you adapted to change.','How would you improve our company?',
      'What has been your biggest professional growth moment?',
      'How do you handle an underperforming teammate?','How do you set goals for yourself?',
      'Describe a time you went above and beyond.','How do you manage your time effectively?',
      'How do you respond to feedback you disagree with?',
      'Tell me about a time you had to make a difficult decision.',
      'How do you handle confidential information?',
      'Describe a time you had to learn something quickly.',
      'What is your approach to problem-solving?','How do you handle an angry client?',
      'What is your biggest weakness as a professional?',
      'How do you prioritise between urgent and important tasks?',
      'Describe a time you had to persuade someone.',
      'How do you stay motivated during repetitive work?',
      'What is your approach to teamwork?',
      'Describe your ideal working relationship with a manager.',
      'How do you feel about working overtime?','How do you handle conflicts within a team?',
      'What is a piece of feedback that changed how you work?',
      'How do you measure success in your role?',
      'How do you approach learning a new tool or software?',
      'What would your previous manager say about you?',
      'Describe a time you took initiative.','How do you handle change in priorities?',
      'What kind of company culture do you thrive in?',
      'Describe a time you had to apologise at work.',
      'How do you contribute to a positive work environment?',
      'What is your biggest strength as a team player?',
      'How do you approach a task you have never done before?',
      'Describe a time you had to say no to a request.',
      'What is your biggest career regret?','How do you keep yourself accountable?',
      'What do you do when you feel overwhelmed?','How do you like to receive feedback?',
      'Describe a time when you mentored someone.','What is your leadership style?',
      'How do you balance quality and speed?','What kind of projects excite you the most?',
      'Describe a time when you had to work with limited resources.',
      'How do you handle working with someone you do not get along with?',
      'What is your approach to giving feedback to others?',
      'How do you stay calm under pressure?',
      'Describe a time when you had to defend your decision.',
      'How do you decide when to ask for help?','What does work-life balance mean to you?',
      'Describe a time when you took a risk at work.',
      'How do you keep your skills up to date?',
      'What is a mistake you learned the most from?',
    ],
  },
};

const ALL_CATEGORIES = Object.entries(PROMPT_BANK).map(([id, c]) => ({
  id, label: c.name, icon: c.icon, prompts: c.prompts, count: c.prompts.length,
}));

const TOTAL_PROMPTS = ALL_CATEGORIES.reduce((s, c) => s + c.count, 0);

const CRITERIA = [
  { id: 'c1', label: 'Fluency & coherence', weight: '25%' },
  { id: 'c2', label: 'Lexical resource', weight: '25%' },
  { id: 'c3', label: 'Grammatical range', weight: '25%' },
  { id: 'c4', label: 'Pronunciation', weight: '25%' },
];

/* ============================================================
   FAULT DETECTION
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

  result.pace.wpm = durationSec > 0 && words.length > 0
    ? Math.round((words.length / durationSec) * 60)
    : 0;
  if (words.length === 0) result.pace.severity = 'bad';
  else if (result.pace.wpm < 80 || result.pace.wpm > 200) result.pace.severity = 'bad';
  else if (result.pace.wpm < 100 || result.pace.wpm > 170) result.pace.severity = 'warn';

  if (words.length < 20) result.length.severity = 'bad';
  else if (words.length < 45) result.length.severity = 'warn';

  const unique = new Set(words).size;
  result.vocabulary.unique = unique;
  result.vocabulary.ratio = words.length ? unique / words.length : 0;
  if (words.length < 5) result.vocabulary.severity = 'bad';
  else if (result.vocabulary.ratio < 0.4) result.vocabulary.severity = 'bad';
  else if (result.vocabulary.ratio < 0.55) result.vocabulary.severity = 'warn';

  return result;
}

/* ============================================================
   SCORING ENGINE — rewritten so scores reflect actual evidence
   Returns null when the transcript is too short to score honestly.
   ============================================================ */
function scoreFromAnalysis(faults) {
  const words = faults.length.words;
  if (words < SCORING.minWords) return null;

  const wpm = faults.pace.wpm;
  const fillerRatio = faults.fillers.count / Math.max(1, words);
  const vocabRatio = faults.vocabulary.ratio;
  const [idealLo, idealHi] = SCORING.idealWpm;
  const [acceptLo, acceptHi] = SCORING.acceptWpm;

  // --- Fluency: start at 5 (minimum valid), reward length + ideal pace, penalize fillers
  let fluency = 5;
  if (wpm >= idealLo && wpm <= idealHi) fluency += 1.5;
  else if (wpm >= acceptLo && wpm <= acceptHi) fluency += 0.5;
  else fluency -= 1;

  if (words >= 30) fluency += 0.5;
  if (words >= SCORING.longAnswerWords) fluency += 0.5;
  if (words >= 100) fluency += 0.5;
  if (fillerRatio > 0.08) fluency -= 1;
  if (fillerRatio > 0.15) fluency -= 1;

  // --- Vocabulary: driven by lexical diversity and total length
  let vocabulary = 5;
  if (vocabRatio > 0.5) vocabulary += 0.5;
  if (vocabRatio > 0.6) vocabulary += 0.5;
  if (vocabRatio > 0.7) vocabulary += 0.5;
  if (words >= SCORING.longAnswerWords) vocabulary += 0.5;
  if (words >= 100) vocabulary += 0.5;
  if (vocabRatio < 0.35) vocabulary -= 1;

  // --- Grammar: penalize repetition, reward longer connected speech
  let grammar = 5;
  if (faults.repetition.count === 0 && words >= 20) grammar += 0.5;
  if (faults.repetition.count === 0 && words >= 50) grammar += 0.5;
  if (faults.repetition.count === 0 && words >= 80) grammar += 0.5;
  if (faults.repetition.count >= 1) grammar -= 0.5;
  if (faults.repetition.count >= 2) grammar -= 1;

  // --- Pronunciation: browser-only proxy — this is a *rough* estimate
  let pronunciation = 5;
  if (wpm >= idealLo && wpm <= idealHi && fillerRatio < 0.05) pronunciation += 2;
  else if (wpm >= acceptLo && wpm <= acceptHi) pronunciation += 1;
  else if (wpm === 0) pronunciation -= 1;
  if (fillerRatio > 0.12) pronunciation -= 1;

  const clamp = (n) => Math.max(3.5, Math.min(9, Math.round(n * 10) / 10));

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
    return () => { try { r.stop(); } catch { /* noop */ } };
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
   AUDIO RECORDER + LEVEL MONITOR
   Tracks peak RMS via AnalyserNode. Returns { blob, peak, seconds }
   from stop() so the caller can gate scoring on real audio.
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
  const [liveLevel, setLiveLevel] = useState(0);

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const secondsRef = useRef(0);
  const peakLevelRef = useRef(0);
  const audioCtxRef = useRef(null);
  const rafRef = useRef(null);

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  const startTimer = () => {
    secondsRef.current = 0;
    setSeconds(0);
    timerRef.current = setInterval(() => {
      secondsRef.current += 1;
      setSeconds(secondsRef.current);
    }, 1000);
  };
  const stopTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const startLevelMonitor = (stream) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      const buffer = new Uint8Array(analyser.fftSize);
      audioCtxRef.current = ctx;

      const tick = () => {
        analyser.getByteTimeDomainData(buffer);
        let peak = 0;
        for (let i = 0; i < buffer.length; i++) {
          const v = Math.abs(buffer[i] - 128) / 128;
          if (v > peak) peak = v;
        }
        if (peak > peakLevelRef.current) peakLevelRef.current = peak;
        setLiveLevel(peak);
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch { /* ignore */ }
  };

  const stopLevelMonitor = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    try { audioCtxRef.current?.close(); } catch { /* noop */ }
    audioCtxRef.current = null;
    setLiveLevel(0);
  };

  const start = async () => {
    setError(null);
    peakLevelRef.current = 0;
    setLiveLevel(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const mimeType = pickMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecording(true);
      startTimer();
      startLevelMonitor(stream);
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
        stopLevelMonitor();
        resolve(null);
        return;
      }
      const finalSeconds = secondsRef.current;
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        chunksRef.current = [];
        stopStream();
        stopLevelMonitor();
        setRecording(false);
        resolve({ blob, peak: peakLevelRef.current, seconds: finalSeconds });
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
    stopLevelMonitor();
    setRecording(false);
    setSeconds(0);
    secondsRef.current = 0;
    peakLevelRef.current = 0;
  };

  useEffect(() => () => cancel(), []);

  return { recording, error, seconds, liveLevel, start, stop, cancel };
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
   LIVE INPUT LEVEL METER
   ============================================================ */
function LiveLevelMeter({ level }) {
  const pct = Math.max(2, Math.min(100, Math.round(level * 400)));
  const isSilent = level < SCORING.silencePeak;
  return (
    <div className={`ec-spk-live-level${isSilent ? ' ec-spk-live-level--silent' : ''}`}>
      <span>{isSilent ? '🔇 Silent' : '🎤 Mic'}</span>
      <div className="ec-spk-live-level-track">
        <div className="ec-spk-live-level-fill" style={{ width: `${pct}%` }} />
      </div>
      <span>{pct}%</span>
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
      detail: faults.pace.wpm > 0
        ? `You spoke at ${faults.pace.wpm} words per minute. Ideal range: ${SCORING.idealWpm[0]}–${SCORING.idealWpm[1]} wpm.`
        : 'Not enough audio to measure pace.',
    },
    {
      id: 'len',
      label: 'Answer length',
      severity: faults.length.severity,
      detail: `${faults.length.words} words spoken. Aim for ${SCORING.longAnswerWords}+ words for IELTS Part 2.`,
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
   Mascot
   ============================================================ */
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
      const captured = await practiceRecorder.stop();
      speech.stopRecog();

      if (!captured || !captured.blob || captured.blob.size === 0) {
        setSubmitError('No audio captured. Try again.');
        return;
      }

      const { blob, peak, seconds: dur } = captured;

      // ---- Gate 1: silence ----
      if (peak < SCORING.silencePeak) {
        setSubmitError(
          'We didn\'t hear anything. Move closer to the mic, check it\'s not muted, and try again.'
        );
        return;
      }

      // ---- Gate 2: duration ----
      if (dur < SCORING.minDurationSec) {
        setSubmitError(
          `Recording too short (${dur}s). Aim for at least ${SCORING.minDurationSec} seconds.`
        );
        return;
      }

      // Small delay to let the last final speech result land
      await new Promise((r) => setTimeout(r, 500));

      const finalText = speech.transcript || '';
      const wordList = finalText.trim().split(/\s+/).filter(Boolean);

      // ---- Gate 3: transcript ----
      if (speech.supported && wordList.length < SCORING.minWords) {
        if (wordList.length === 0) {
          setSubmitError(
            'We detected audio but couldn\'t transcribe any words. Speak more clearly, reduce background noise, or use Chrome/Edge for better recognition.'
          );
        } else {
          setSubmitError(
            `Only ${wordList.length} word${wordList.length === 1 ? '' : 's'} detected — aim for a longer answer.`
          );
        }
        return;
      }

      setScoring(true);

      try {
        const detected = detectFaults(finalText, dur);
        const bands = scoreFromAnalysis(detected);

        if (!bands) {
          setSubmitError('Not enough speech to score. Try a longer answer.');
          setScoring(false);
          return;
        }

        let feedback = '';
        try {
          const data = await speakingApi.submitAttempt(promptText, blob);
          if (data?.feedback) feedback = data.feedback;
        } catch { /* ignore */ }

        if (!feedback) {
          feedback = `You said ${detected.length.words} words in ${dur}s. ` +
            (detected.fillers.count > 0
              ? `Try to reduce filler words like "${Object.keys(detected.fillers.words).slice(0, 3).join('", "')}". `
              : 'Great job avoiding filler words. ') +
            (detected.length.words < SCORING.longAnswerWords
              ? 'Speak for longer next time to boost your fluency score.'
              : 'Nice long answer — keep it up!');
        }

        setFaults(detected);
        setResult({ ...bands, feedback, transcript: finalText, duration: dur });
        setXp((x) => x + 20);
        showToast('+20 XP 🎤');
      } finally {
        setScoring(false);
      }
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
      const captured = await conversationRecorder.stop();

      if (!captured || !captured.blob || captured.blob.size === 0) {
        setConversationError('No audio captured. Try again.');
        return;
      }
      if (captured.peak < SCORING.silencePeak) {
        setConversationError('We didn\'t hear anything. Try again.');
        return;
      }

      const { blob } = captured;
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

  /* Show the "we can't hear you" warning only after 2s of recording */
  const showSilentWarning =
    practiceRecorder.recording &&
    practiceRecorder.seconds >= 2 &&
    practiceRecorder.liveLevel < SCORING.silencePeak;

  return (
    <div className="ec-spk">
      <style>{SPEAK_CSS}</style>

      {/* Heading */}
      <div className="ec-spk-head ec-spk-anim">
        <div>
          <p className="ec-spk-eyebrow">Speaking</p>
          <h1 className="ec-page-title">Speak English with confidence</h1>
          <p className="ec-page-sub">
            {TOTAL_PROMPTS.toLocaleString()}+ exercises, live transcription, fault detection, and an AI conversation partner.
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
            <div className="ec-spk-hero-stat"><strong>{TOTAL_PROMPTS.toLocaleString()}</strong><span>Exercises</span></div>
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

      {/* Category tabs */}
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

              {practiceRecorder.recording && (
                <LiveLevelMeter level={practiceRecorder.liveLevel} />
              )}

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

              {showSilentWarning && (
                <p className="ec-spk-record-warning">🔇 We can\'t hear you — check your mic</p>
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

              {/* Score cards — only rendered when we have a valid result */}
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
                  <p className="ec-spk-info">
                    ℹ️ These scores are heuristic estimates based on transcript statistics. For real pronunciation
                    analysis, use a dedicated STT service with audio feature extraction.
                  </p>
                </>
              )}

              {faults && <FaultReport faults={faults} />}

              <div className="ec-spk-actions">
                <button className="ec-spk-btn-ghost" onClick={goToNextPrompt}>
                  Next prompt →
                </button>
                {practiceRecorder.recording && (
                  <button
                    className="ec-spk-btn-ghost"
                    onClick={() => { practiceRecorder.cancel(); speech.stopRecog(); }}
                  >
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
                <>
                  <LiveLevelMeter level={conversationRecorder.liveLevel} />
                  <p className="ec-spk-record-time">{formatTime(conversationRecorder.seconds)}</p>
                </>
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
                Live transcription requires Chrome, Edge, or Safari. You can still record in this browser,
                but scoring is disabled because we can't verify what you said.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default Speaking;
