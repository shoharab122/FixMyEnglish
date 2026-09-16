import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Icon } from '../components/Icon';

/* ============================================================
   STYLES — Langut-inspired, mobile-optimized
   ============================================================ */
const LOGIN_CSS = `
/* ============================================================
   Langut tokens
   ============================================================ */
.ec-auth{
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
  --auth-safe-t:    env(safe-area-inset-top, 0px);
  --auth-safe-b:    env(safe-area-inset-bottom, 0px);

  min-height:100vh;
  min-height:100dvh;
  display:grid;
  grid-template-columns:1.05fr 1fr;
  background:var(--lang-bg);
  color:var(--lang-ink);
  font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  position:relative;
  overflow:hidden;
  -webkit-text-size-adjust:100%;
  -webkit-tap-highlight-color:transparent;
}
.ec-auth *{box-sizing:border-box}
.ec-auth{overflow-x:hidden}

/* ============================================================
   LEFT PANEL — branding + mascot
   ============================================================ */
.ec-auth-side{
  position:relative;
  overflow:hidden;
  padding:56px 56px 40px;
  display:flex;
  flex-direction:column;
  justify-content:space-between;
  color:#fff;
  background:linear-gradient(140deg,#2A1A6E 0%,#1E1252 55%,#3B2596 100%);
  border-right:2px solid var(--lang-line);
}
.ec-auth-side::before{
  content:'';
  position:absolute;inset:0;
  background-image:radial-gradient(rgba(255,255,255,.10) 1.4px,transparent 1.4px);
  background-size:20px 20px;
  mask-image:radial-gradient(circle at 15% 20%,#000,transparent 65%);
  -webkit-mask-image:radial-gradient(circle at 15% 20%,#000,transparent 65%);
  pointer-events:none;
}
.ec-auth-orb{
  position:absolute;
  border-radius:50%;
  pointer-events:none;
  filter:blur(2px);
}
.ec-auth-orb--a{
  top:-100px;right:-100px;
  width:340px;height:340px;
  background:radial-gradient(circle,rgba(212,245,92,.28),transparent 68%);
  animation:ec-auth-drift 14s ease-in-out infinite;
}
.ec-auth-orb--b{
  bottom:-140px;left:-100px;
  width:380px;height:380px;
  background:radial-gradient(circle,rgba(255,143,203,.30),transparent 70%);
  animation:ec-auth-drift 18s ease-in-out infinite reverse;
}
.ec-auth-orb--c{
  top:40%;left:35%;
  width:200px;height:200px;
  background:radial-gradient(circle,rgba(155,123,255,.28),transparent 70%);
  animation:ec-auth-drift 22s ease-in-out infinite;
}
@keyframes ec-auth-drift{
  0%,100%{transform:translate(0,0) scale(1)}
  50%{transform:translate(-20px,18px) scale(1.1)}
}

.ec-auth-side-inner{position:relative;z-index:1;max-width:440px}
.ec-auth-logo{
  display:inline-flex;align-items:center;gap:12px;
  text-decoration:none;color:#fff;
  font-weight:900;font-size:15px;letter-spacing:-.01em;
  margin-bottom:52px;
}
.ec-auth-logo-mark{
  width:40px;height:40px;border-radius:12px;
  background:linear-gradient(135deg,#F5E04D 0%,#B8E62E 100%);
  box-shadow:0 4px 0 var(--lang-line),0 10px 24px rgba(0,0,0,.28);
  display:flex;align-items:center;justify-content:center;
  color:var(--lang-ink);
  font-size:18px;font-weight:900;
  border:2px solid var(--lang-line);
  flex-shrink:0;
}

.ec-auth-side-eyebrow{
  display:inline-block;
  font-size:10.5px;font-weight:900;
  letter-spacing:.16em;text-transform:uppercase;
  padding:7px 14px;border-radius:999px;
  background:var(--lang-lime);
  color:var(--lang-ink);
  border:2px solid var(--lang-line);
  box-shadow:0 3px 0 rgba(0,0,0,.4);
  margin-bottom:20px;
}
.ec-auth-side h1{
  margin:0 0 16px;
  font-size:clamp(28px,3vw + 14px,42px);
  font-weight:900;
  letter-spacing:-.035em;
  line-height:1.08;
  color:#fff;
}
.ec-auth-side h1 em{
  font-style:normal;
  background:linear-gradient(90deg,#E4FF5C 0%,#B8E62E 100%);
  -webkit-background-clip:text;
  background-clip:text;
  color:transparent;
}
.ec-auth-side p{
  margin:0 0 32px;
  font-size:14.5px;
  line-height:1.65;
  opacity:.92;
  max-width:400px;
  font-weight:500;
}

/* Features */
.ec-auth-features{
  list-style:none;padding:0;margin:0;
  display:flex;flex-direction:column;gap:14px;
}
.ec-auth-feature{
  display:flex;align-items:center;gap:14px;
  padding:14px 16px;
  border-radius:18px;
  background:rgba(255,255,255,.10);
  border:2px solid var(--lang-line);
  backdrop-filter:blur(8px);
  -webkit-backdrop-filter:blur(8px);
  box-shadow:0 4px 0 rgba(0,0,0,.32);
  transition:transform .26s cubic-bezier(.34,1.56,.64,1),
             background .22s ease,
             box-shadow .18s ease;
  animation:ec-auth-feature-in .55s cubic-bezier(.22,1,.36,1) both;
}
.ec-auth-feature:nth-child(1){animation-delay:.15s}
.ec-auth-feature:nth-child(2){animation-delay:.25s}
.ec-auth-feature:nth-child(3){animation-delay:.35s}
@keyframes ec-auth-feature-in{
  from{opacity:0;transform:translateX(-14px)}
  to{opacity:1;transform:translateX(0)}
}
.ec-auth-feature:hover{
  transform:translateX(6px) translateY(-2px);
  background:rgba(255,255,255,.16);
  box-shadow:0 7px 0 rgba(0,0,0,.4);
}
.ec-auth-feature-icon{
  width:42px;height:42px;border-radius:14px;
  background:var(--lang-lime);
  color:var(--lang-ink);
  display:flex;align-items:center;justify-content:center;
  flex-shrink:0;
  font-size:20px;
  border:2px solid var(--lang-line);
  box-shadow:0 2px 0 rgba(0,0,0,.4);
  transition:transform .3s cubic-bezier(.34,1.56,.64,1);
}
.ec-auth-feature:hover .ec-auth-feature-icon{
  transform:scale(1.1) rotate(-6deg);
}
.ec-auth-feature:nth-child(2) .ec-auth-feature-icon{background:var(--lang-pink)}
.ec-auth-feature:nth-child(3) .ec-auth-feature-icon{background:var(--lang-purple-2);color:#fff}
.ec-auth-feature-body p{margin:0 0 2px;font-size:13.5px;font-weight:900;color:#fff}
.ec-auth-feature-body span{font-size:12px;opacity:.88;font-weight:600;line-height:1.45;display:block}

/* Mascot corner */
.ec-auth-mascot{
  position:absolute;
  right:24px;
  bottom:72px;
  z-index:1;
  pointer-events:none;
  filter:drop-shadow(0 14px 28px rgba(0,0,0,.32));
  animation:ec-auth-bob 4s ease-in-out infinite;
}
@keyframes ec-auth-bob{
  0%,100%{transform:translateY(0) rotate(-2deg)}
  50%{transform:translateY(-10px) rotate(2deg)}
}
.ec-auth-sparkle{
  position:absolute;
  width:14px;height:14px;
  pointer-events:none;
  animation:ec-auth-sparkle 3s ease-in-out infinite;
}
.ec-auth-sparkle::before{
  content:'';position:absolute;inset:0;
  background:currentColor;
  clip-path:polygon(50% 0,55% 45%,100% 50%,55% 55%,50% 100%,45% 55%,0 50%,45% 45%);
}
.ec-auth-sparkle--a{top:6%;left:-10%;color:var(--lang-lime);animation-delay:0s}
.ec-auth-sparkle--b{top:50%;right:-8%;color:var(--lang-pink);animation-delay:.6s;width:10px;height:10px}
.ec-auth-sparkle--c{bottom:8%;left:-6%;color:var(--lang-yellow);animation-delay:1.2s;width:12px;height:12px}
@keyframes ec-auth-sparkle{
  0%,100%{opacity:1;transform:scale(1) rotate(0deg)}
  50%{opacity:.35;transform:scale(.75) rotate(30deg)}
}

.ec-auth-side-foot{
  position:relative;z-index:1;
  display:flex;align-items:center;justify-content:space-between;gap:16px;
  font-size:12px;opacity:.85;font-weight:700;
  flex-wrap:wrap;
  letter-spacing:.02em;
}

/* ============================================================
   RIGHT PANEL — form
   ============================================================ */
.ec-auth-main{
  display:flex;align-items:center;justify-content:center;
  padding:40px 32px;
  position:relative;
  overflow-y:auto;
  background:var(--lang-bg);
}

/* Mobile-only mini header */
.ec-auth-mobile-head{
  display:none;
}

.ec-auth-card{
  width:100%;
  max-width:460px;
  background:#fff;
  border:3px solid var(--lang-line);
  border-radius:32px;
  padding:36px 32px;
  box-shadow:0 12px 0 var(--lang-line),0 24px 60px rgba(30,18,82,.32);
  position:relative;
  background-image:radial-gradient(circle at 100% 0%,rgba(212,245,92,.14),transparent 55%);
  animation:ec-auth-card-in .6s cubic-bezier(.34,1.56,.64,1) both;
}
@keyframes ec-auth-card-in{
  from{opacity:0;transform:translateY(24px) scale(.94)}
  to{opacity:1;transform:translateY(0) scale(1)}
}

/* Signed-in banner */
.ec-auth-signedin{
  display:flex;align-items:center;gap:12px;
  padding:14px 16px;
  border-radius:18px;
  background:var(--lang-lime-soft);
  border:2px solid var(--lang-line);
  box-shadow:0 3px 0 var(--lang-line);
  margin-bottom:20px;
  animation:ec-auth-feature-in .5s cubic-bezier(.22,1,.36,1) both;
}
.ec-auth-signedin-dot{
  width:10px;height:10px;border-radius:50%;
  background:var(--lang-lime-deep);
  box-shadow:0 0 0 4px rgba(184,230,46,.35);
  flex-shrink:0;
  animation:ec-auth-dot-pulse 1.8s ease-out infinite;
}
@keyframes ec-auth-dot-pulse{
  0%{box-shadow:0 0 0 4px rgba(184,230,46,.35)}
  50%{box-shadow:0 0 0 8px rgba(184,230,46,.15)}
  100%{box-shadow:0 0 0 4px rgba(184,230,46,.35)}
}
.ec-auth-signedin-body{flex:1;min-width:0}
.ec-auth-signedin-body p{
  margin:0;font-size:12.5px;font-weight:800;
  color:var(--lang-ink);line-height:1.4;
}
.ec-auth-signedin-body p b{color:var(--lang-purple)}
.ec-auth-signedin-body span{
  display:block;margin-top:2px;font-size:11px;
  color:var(--lang-ink-soft);font-weight:700;
}
.ec-auth-signedin-btn{
  border:2px solid var(--lang-line);
  background:var(--lang-ink);color:var(--lang-lime);
  font-size:11.5px;font-weight:900;
  padding:8px 14px;border-radius:999px;
  cursor:pointer;font-family:inherit;
  white-space:nowrap;
  box-shadow:0 3px 0 var(--lang-line);
  transition:transform .2s cubic-bezier(.34,1.56,.64,1),
             box-shadow .18s ease;
  letter-spacing:.03em;
  min-height:36px;
}
.ec-auth-signedin-btn:hover{transform:translateY(-2px);box-shadow:0 5px 0 var(--lang-line)}
.ec-auth-signedin-btn:active{transform:translateY(1px);box-shadow:0 1px 0 var(--lang-line)}
.ec-auth-signedin-btn:disabled{opacity:.6;cursor:not-allowed}

.ec-auth-card-head{margin-bottom:26px}
.ec-auth-card-eyebrow{
  margin:0 0 6px;
  font-size:11.5px;font-weight:900;
  letter-spacing:.16em;text-transform:uppercase;
  color:var(--lang-purple);
  opacity:.95;
}
.ec-auth-card h2{
  margin:0 0 8px;
  font-size:26px;
  font-weight:900;
  letter-spacing:-.03em;
  color:var(--lang-ink);
  line-height:1.15;
}
.ec-auth-card-sub{
  margin:0;
  font-size:13.5px;
  line-height:1.55;
  color:var(--lang-ink-soft);
  font-weight:600;
}

/* ---------- Tabs — chunky ---------- */
.ec-auth-tabs{
  position:relative;
  display:grid;
  grid-template-columns:repeat(3,1fr);
  padding:5px;
  background:#E8E5F2;
  border:2px solid var(--lang-line);
  border-radius:999px;
  margin-bottom:24px;
  isolation:isolate;
  box-shadow:inset 0 2px 4px rgba(23,16,46,.06);
}
.ec-auth-tab-indicator{
  position:absolute;
  top:5px;bottom:5px;
  width:calc((100% - 10px) / 3);
  background:var(--lang-lime);
  border-radius:999px;
  box-shadow:0 2px 0 var(--lang-line);
  transition:transform .42s cubic-bezier(.34,1.56,.64,1);
  z-index:0;
}
.ec-auth-tab-indicator[data-active="0"]{transform:translateX(0)}
.ec-auth-tab-indicator[data-active="1"]{transform:translateX(100%)}
.ec-auth-tab-indicator[data-active="2"]{transform:translateX(200%)}

.ec-auth-tab{
  position:relative;z-index:1;
  border:none;background:transparent;
  color:var(--lang-ink-soft);
  font-size:12.5px;font-weight:900;
  padding:11px 6px;
  border-radius:999px;
  cursor:pointer;
  font-family:inherit;
  transition:color .25s ease, transform .2s ease;
  text-transform:capitalize;
  white-space:nowrap;
  letter-spacing:.01em;
  min-height:44px;
}
.ec-auth-tab--active{color:var(--lang-ink)}
.ec-auth-tab:hover:not(.ec-auth-tab--active){color:var(--lang-ink);transform:scale(1.03)}

/* ---------- Form ---------- */
.ec-auth-form{display:flex;flex-direction:column;gap:16px}

.ec-auth-field{
  position:relative;
  animation:ec-auth-field-in .4s cubic-bezier(.22,1,.36,1) both;
}
.ec-auth-field:nth-child(1){animation-delay:.08s}
.ec-auth-field:nth-child(2){animation-delay:.14s}
.ec-auth-field:nth-child(3){animation-delay:.20s}
.ec-auth-field:nth-child(4){animation-delay:.26s}
@keyframes ec-auth-field-in{
  from{opacity:0;transform:translateY(8px)}
  to{opacity:1;transform:translateY(0)}
}

.ec-auth-label{
  display:block;
  font-size:11.5px;
  font-weight:900;
  letter-spacing:.08em;
  text-transform:uppercase;
  color:var(--lang-ink-soft);
  margin-bottom:8px;
}

.ec-auth-input-wrap{
  position:relative;
  display:flex;align-items:center;
  background:#fff;
  border:2px solid var(--lang-line);
  border-radius:16px;
  box-shadow:0 3px 0 var(--lang-line);
  transition:box-shadow .2s ease, transform .15s ease;
}
.ec-auth-input-wrap:focus-within{
  box-shadow:0 3px 0 var(--lang-line), 0 0 0 4px rgba(212,245,92,.55);
  transform:translateY(-1px);
}
.ec-auth-input-wrap--error{
  border-color:#E0503C;
  background:#FFF5F5;
  box-shadow:0 3px 0 #E0503C;
}
.ec-auth-input-wrap--error:focus-within{
  box-shadow:0 3px 0 #E0503C, 0 0 0 4px rgba(224,80,60,.22);
}

.ec-auth-input-icon{
  padding-left:16px;
  display:flex;align-items:center;justify-content:center;
  color:var(--lang-ink-soft);
  flex-shrink:0;
  transition:color .2s ease, transform .25s cubic-bezier(.34,1.56,.64,1);
}
.ec-auth-input-wrap:focus-within .ec-auth-input-icon{
  color:var(--lang-purple);
  transform:scale(1.12);
}
.ec-auth-input-icon svg{width:18px;height:18px}

.ec-auth-input{
  flex:1;
  border:none;outline:none;background:transparent;
  padding:14px 16px;
  font-size:16px; /* prevents iOS zoom on focus */
  font-family:inherit;
  color:var(--lang-ink);
  font-weight:700;
  min-width:0;
  line-height:1.3;
}
.ec-auth-input::placeholder{color:var(--lang-ink-soft);opacity:.65;font-weight:500}

.ec-auth-input-toggle{
  border:none;background:transparent;
  color:var(--lang-ink-soft);
  padding:0 16px;
  cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  transition:color .2s ease, transform .2s cubic-bezier(.34,1.56,.64,1);
  font-family:inherit;
  min-height:44px;
  min-width:44px;
}
.ec-auth-input-toggle:hover{color:var(--lang-purple);transform:scale(1.1)}
.ec-auth-input-toggle svg{width:18px;height:18px}

.ec-auth-field-error{
  display:flex;align-items:center;gap:6px;
  font-size:11.5px;font-weight:800;
  color:#A52C1C;
  margin-top:6px;
}
.ec-auth-field-error svg{width:13px;height:13px;flex-shrink:0}

/* ---------- Password strength ---------- */
.ec-auth-strength{
  display:flex;gap:5px;
  margin-top:10px;
}
.ec-auth-strength-bar{
  flex:1;height:6px;
  border-radius:999px;
  background:#E8E5F2;
  border:1.5px solid var(--lang-line);
  transition:background .35s ease;
}
.ec-auth-strength-bar--active-1{background:var(--lang-pink-2);border-color:var(--lang-line)}
.ec-auth-strength-bar--active-2{background:var(--lang-yellow);border-color:var(--lang-line)}
.ec-auth-strength-bar--active-3{background:var(--lang-lime);border-color:var(--lang-line)}
.ec-auth-strength-label{
  font-size:10.5px;font-weight:900;
  text-transform:uppercase;
  letter-spacing:.08em;
  margin-top:6px;
  display:block;
}

/* ---------- Row: remember + forgot ---------- */
.ec-auth-row{
  display:flex;align-items:center;justify-content:space-between;
  gap:12px;flex-wrap:wrap;
}
.ec-auth-check{
  display:inline-flex;align-items:center;gap:8px;
  font-size:12.5px;font-weight:800;
  color:var(--lang-ink-soft);
  cursor:pointer;
  user-select:none;
  transition:color .2s ease;
  min-height:44px;
  padding:4px 0;
}
.ec-auth-check:hover{color:var(--lang-ink)}
.ec-auth-check input{
  accent-color:var(--lang-ink);
  width:18px;height:18px;
  cursor:pointer;
}
.ec-auth-forgot{
  font-size:12.5px;font-weight:900;
  color:var(--lang-purple);
  text-decoration:none;
  transition:opacity .2s ease;
  border-bottom:2px dashed rgba(123,92,240,.4);
  padding-bottom:1px;
  min-height:44px;
  display:inline-flex;
  align-items:center;
}
.ec-auth-forgot:hover{opacity:.75;border-color:var(--lang-purple)}

/* ---------- Alert ---------- */
.ec-auth-alert{
  display:flex;align-items:flex-start;gap:10px;
  padding:12px 16px;
  border-radius:14px;
  background:var(--lang-pink-2);
  border:2px solid var(--lang-line);
  box-shadow:0 3px 0 var(--lang-line);
  color:#fff;
  font-size:12.5px;
  font-weight:900;
  line-height:1.5;
  letter-spacing:.01em;
  animation:ec-auth-shake .5s cubic-bezier(.36,.07,.19,.97);
}
.ec-auth-alert-icon{flex-shrink:0;margin-top:1px}
.ec-auth-alert-icon svg{width:16px;height:16px}
@keyframes ec-auth-shake{
  0%,100%{transform:translateX(0)}
  15%{transform:translateX(-6px)}
  30%{transform:translateX(6px)}
  45%{transform:translateX(-4px)}
  60%{transform:translateX(4px)}
  75%{transform:translateX(-2px)}
}

/* ---------- Submit button — chunky ---------- */
.ec-auth-submit{
  position:relative;
  display:flex;align-items:center;justify-content:center;gap:10px;
  border:2px solid var(--lang-line);
  background:var(--lang-ink);
  color:var(--lang-lime);
  padding:15px 24px;
  border-radius:999px;
  font-size:14px;
  font-weight:900;
  font-family:inherit;
  letter-spacing:.02em;
  cursor:pointer;
  margin-top:6px;
  transition:transform .22s cubic-bezier(.34,1.56,.64,1),
             box-shadow .18s ease,
             background .2s ease;
  box-shadow:0 4px 0 var(--lang-line);
  overflow:hidden;
  min-height:52px;
  width:100%;
}
.ec-auth-submit::before{
  content:'';
  position:absolute;
  top:0;bottom:0;left:-30%;
  width:30%;
  background:linear-gradient(90deg,transparent,rgba(212,245,92,.28),transparent);
  transform:translateX(0);
  transition:transform .65s ease;
  pointer-events:none;
}
.ec-auth-submit:hover:not(:disabled)::before{transform:translateX(450%)}
.ec-auth-submit:hover:not(:disabled){
  transform:translateY(-3px);
  box-shadow:0 7px 0 var(--lang-line);
}
.ec-auth-submit:active:not(:disabled){
  transform:translateY(2px);
  box-shadow:0 1px 0 var(--lang-line);
}
.ec-auth-submit:disabled{
  opacity:.7;
  cursor:not-allowed;
  transform:none;
  box-shadow:0 4px 0 var(--lang-line);
}
.ec-auth-submit-spinner{
  width:16px;height:16px;
  border-radius:50%;
  border:2.5px solid rgba(212,245,92,.35);
  border-top-color:var(--lang-lime);
  animation:ec-auth-spin .7s linear infinite;
}
@keyframes ec-auth-spin{to{transform:rotate(360deg)}}
.ec-auth-submit svg,
.ec-auth-submit span[aria-hidden]{transition:transform .3s cubic-bezier(.34,1.56,.64,1)}
.ec-auth-submit:hover:not(:disabled) span[aria-hidden]{transform:translateX(4px)}

/* ---------- Divider + guest CTA ---------- */
.ec-auth-divider{
  display:flex;align-items:center;gap:12px;
  margin:24px 0 18px;
  color:var(--lang-ink-soft);
  font-size:10.5px;font-weight:900;
  letter-spacing:.14em;
  text-transform:uppercase;
}
.ec-auth-divider::before,
.ec-auth-divider::after{
  content:'';flex:1;height:2px;
  background:repeating-linear-gradient(90deg,rgba(23,16,46,.18) 0 4px,transparent 4px 8px);
  border-radius:999px;
}

.ec-auth-guest{
  display:flex;align-items:center;justify-content:center;gap:8px;
  width:100%;
  border:2px solid var(--lang-line);
  background:#fff;
  color:var(--lang-ink);
  padding:13px 20px;
  border-radius:999px;
  font-size:13px;font-weight:900;
  font-family:inherit;
  cursor:pointer;
  box-shadow:0 4px 0 var(--lang-line);
  transition:transform .22s cubic-bezier(.34,1.56,.64,1),
             box-shadow .18s ease,
             background .2s ease;
  letter-spacing:.02em;
  min-height:52px;
}
.ec-auth-guest:hover:not(:disabled){
  background:var(--lang-lime-soft);
  transform:translateY(-3px);
  box-shadow:0 7px 0 var(--lang-line);
}
.ec-auth-guest:active:not(:disabled){
  transform:translateY(2px);
  box-shadow:0 1px 0 var(--lang-line);
}
.ec-auth-guest:disabled{opacity:.6;cursor:not-allowed}

/* ---------- Legal / footer ---------- */
.ec-auth-legal{
  margin:20px 0 0;
  font-size:11.5px;
  line-height:1.65;
  color:var(--lang-ink-soft);
  text-align:center;
  font-weight:600;
}
.ec-auth-legal a{
  color:var(--lang-purple);
  text-decoration:none;
  font-weight:900;
  border-bottom:2px dashed rgba(123,92,240,.35);
  padding-bottom:1px;
}
.ec-auth-legal a:hover{border-color:var(--lang-purple)}

.ec-auth-back{
  display:inline-flex;align-items:center;gap:8px;
  margin-top:22px;
  font-size:12.5px;font-weight:900;
  color:var(--lang-ink-soft);
  text-decoration:none;
  transition:color .2s ease, transform .25s cubic-bezier(.34,1.56,.64,1);
  letter-spacing:.01em;
  min-height:44px;
  padding:4px 0;
}
.ec-auth-back:hover{
  color:var(--lang-purple);
  transform:translateX(-4px);
}
.ec-auth-back svg{width:14px;height:14px}

/* ============================================================
   RESPONSIVE — TABLET (≤ 1024px)
   ============================================================ */
@media (max-width:1024px){
  .ec-auth{
    grid-template-columns:1fr;
    background:linear-gradient(140deg,#2A1A6E 0%,#1E1252 55%,#3B2596 100%);
  }
  .ec-auth-side{display:none}
  .ec-auth-main{
    padding:32px 20px;
    min-height:100vh;
    min-height:100dvh;
    background:transparent;
    align-items:flex-start;
  }
  .ec-auth-card{
    margin-top:20px;
    margin-bottom:20px;
  }
}

/* ============================================================
   RESPONSIVE — MOBILE (≤ 720px) — full optimization
   ============================================================ */
@media (max-width:720px){
  /* Full-bleed gradient background */
  .ec-auth{
    display:block;
    background:linear-gradient(140deg,#2A1A6E 0%,#1E1252 55%,#3B2596 100%);
    min-height:100vh;
    min-height:100dvh;
    position:relative;
  }

  /* Decorative orbs kept behind */
  .ec-auth::before{
    content:'';
    position:fixed;
    top:-120px;right:-120px;
    width:320px;height:320px;
    border-radius:50%;
    background:radial-gradient(circle,rgba(212,245,92,.28),transparent 68%);
    pointer-events:none;
    z-index:0;
  }
  .ec-auth::after{
    content:'';
    position:fixed;
    bottom:-140px;left:-120px;
    width:340px;height:340px;
    border-radius:50%;
    background:radial-gradient(circle,rgba(255,143,203,.28),transparent 70%);
    pointer-events:none;
    z-index:0;
  }

  /* Compact mobile header with logo + mini mascot */
  .ec-auth-mobile-head{
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:12px;
    padding:calc(18px + var(--auth-safe-t)) 20px 20px;
    position:relative;
    z-index:2;
  }
  .ec-auth-mobile-logo{
    display:inline-flex;align-items:center;gap:10px;
    text-decoration:none;color:#fff;
    font-weight:900;font-size:14.5px;
    letter-spacing:-.01em;
  }
  .ec-auth-mobile-logo-mark{
    width:36px;height:36px;border-radius:11px;
    background:linear-gradient(135deg,#F5E04D 0%,#B8E62E 100%);
    box-shadow:0 3px 0 var(--lang-line),0 6px 16px rgba(0,0,0,.24);
    display:flex;align-items:center;justify-content:center;
    color:var(--lang-ink);
    font-size:16px;font-weight:900;
    border:2px solid var(--lang-line);
    flex-shrink:0;
  }
  .ec-auth-mobile-mascot{
    flex-shrink:0;
    filter:drop-shadow(0 8px 18px rgba(0,0,0,.28));
    animation:ec-auth-bob 4s ease-in-out infinite;
  }

  /* Main wrapper becomes the sheet container */
  .ec-auth-main{
    display:block;
    padding:0;
    min-height:auto;
    background:transparent;
    position:relative;
    z-index:1;
  }

  /* The card becomes a bottom sheet */
  .ec-auth-card{
    max-width:none;
    width:100%;
    margin:0;
    padding:26px 20px calc(24px + var(--auth-safe-b));
    border-radius:28px 28px 0 0;
    border:2px solid var(--lang-line);
    border-bottom:none;
    box-shadow:0 -10px 40px rgba(30,18,82,.32);
    min-height:calc(100vh - 120px);
    min-height:calc(100dvh - 120px);
    animation:ec-auth-sheet-in .55s cubic-bezier(.22,1,.36,1) both;
  }
  @keyframes ec-auth-sheet-in{
    from{opacity:0;transform:translateY(30px)}
    to{opacity:1;transform:translateY(0)}
  }

  /* Sheet grab handle */
  .ec-auth-card::before{
    content:'';
    display:block;
    width:48px;
    height:5px;
    border-radius:999px;
    background:#E8E5F2;
    border:1.5px solid var(--lang-line);
    margin:0 auto 22px;
  }

  .ec-auth-card h2{font-size:22px}
  .ec-auth-card-sub{font-size:13px}
  .ec-auth-card-head{margin-bottom:20px}

  /* Tabs — bigger touch targets */
  .ec-auth-tabs{margin-bottom:20px;padding:4px}
  .ec-auth-tab{
    font-size:12px;
    padding:12px 4px;
    min-height:44px;
    letter-spacing:.005em;
  }
  .ec-auth-tab-indicator{top:4px;bottom:4px;width:calc((100% - 8px) / 3)}

  /* Larger inputs for thumb + iOS no-zoom */
  .ec-auth-form{gap:14px}
  .ec-auth-input{
    padding:15px 14px;
    font-size:16px;
    line-height:1.35;
  }
  .ec-auth-input-wrap{
    border-radius:14px;
    box-shadow:0 3px 0 var(--lang-line);
    min-height:52px;
  }
  .ec-auth-input-icon{padding-left:14px}
  .ec-auth-input-icon svg{width:19px;height:19px}
  .ec-auth-input-toggle{padding:0 14px}
  .ec-auth-label{font-size:11px;margin-bottom:6px}

  .ec-auth-field-error{font-size:12px;margin-top:5px}

  /* Row stacks on very narrow */
  .ec-auth-row{
    gap:6px;
    flex-wrap:nowrap;
    align-items:center;
    justify-content:space-between;
  }
  .ec-auth-check{font-size:13px;min-height:44px}
  .ec-auth-forgot{font-size:13px;min-height:44px}

  /* Submit — bigger & easier to tap */
  .ec-auth-submit{
    padding:16px 22px;
    font-size:15px;
    min-height:56px;
    margin-top:8px;
  }

  /* Guest button */
  .ec-auth-guest{
    padding:15px 20px;
    font-size:14px;
    min-height:56px;
  }

  /* Divider */
  .ec-auth-divider{margin:22px 0 16px;font-size:10px}

  /* Legal + back */
  .ec-auth-legal{font-size:11.5px;margin-top:18px}
  .ec-auth-back{font-size:13px;margin-top:16px;min-height:44px}

  /* Signed-in banner */
  .ec-auth-signedin{
    padding:12px 14px;
    border-radius:16px;
    gap:10px;
    margin-bottom:18px;
    flex-wrap:wrap;
  }
  .ec-auth-signedin-body p{font-size:12px}
  .ec-auth-signedin-body span{font-size:10.5px}
  .ec-auth-signedin-btn{
    padding:9px 14px;
    font-size:11.5px;
    min-height:38px;
    flex-shrink:0;
  }
}

/* ============================================================
   RESPONSIVE — SMALL PHONE (≤ 380px)
   ============================================================ */
@media (max-width:380px){
  .ec-auth-mobile-head{padding:calc(14px + var(--auth-safe-t)) 16px 16px}
  .ec-auth-mobile-mascot svg{width:52px !important;height:52px !important}
  .ec-auth-mobile-logo-mark{width:32px;height:32px;font-size:14px}
  .ec-auth-mobile-logo{font-size:13.5px}

  .ec-auth-card{
    padding:22px 16px calc(20px + var(--auth-safe-b));
    border-radius:24px 24px 0 0;
  }
  .ec-auth-card h2{font-size:20px}
  .ec-auth-card-sub{font-size:12.5px}
  .ec-auth-card::before{width:40px;height:4px;margin-bottom:18px}

  .ec-auth-tab{font-size:11.5px;padding:11px 3px}
  .ec-auth-input{padding:14px 12px;font-size:16px}
  .ec-auth-input-icon{padding-left:12px}
  .ec-auth-input-icon svg{width:18px;height:18px}
  .ec-auth-input-toggle{padding:0 12px}

  .ec-auth-submit{font-size:14px;padding:15px 20px}
  .ec-auth-guest{font-size:13.5px;padding:14px 18px}

  .ec-auth-signedin-btn{padding:8px 12px;font-size:11px}
}

/* ============================================================
   LANDSCAPE SHORT PHONE (≤ 900 × 500)
   ============================================================ */
@media (max-width:900px) and (orientation:landscape) and (max-height:500px){
  .ec-auth-mobile-head{padding:12px 20px 8px}
  .ec-auth-mobile-mascot{display:none}
  .ec-auth-card{
    min-height:auto;
    padding:20px 22px 24px;
    border-radius:24px;
    margin:0 16px 16px;
    border-bottom:2px solid var(--lang-line);
  }
  .ec-auth-card::before{display:none}
  .ec-auth-card h2{font-size:20px}
  .ec-auth-tabs{margin-bottom:14px}
  .ec-auth-form{gap:10px}
}

/* ============================================================
   REDUCED MOTION
   ============================================================ */
@media (prefers-reduced-motion: reduce){
  .ec-auth-card,.ec-auth-feature,.ec-auth-field,.ec-auth-alert,
  .ec-auth-signedin,.ec-auth-submit,.ec-auth-sparkle,
  .ec-auth-mascot,.ec-auth-mobile-mascot,.ec-auth-orb--a,
  .ec-auth-orb--b,.ec-auth-orb--c,.ec-auth-signedin-dot,
  .ec-auth::before,.ec-auth::after{animation:none!important}
  .ec-auth-tab-indicator{transition:none}
  .ec-auth-submit::before{display:none}
  .ec-auth-feature:hover,.ec-auth-feature:hover .ec-auth-feature-icon,
  .ec-auth-submit:hover:not(:disabled),.ec-auth-guest:hover:not(:disabled),
  .ec-auth-signedin-btn:hover,.ec-auth-input-toggle:hover,
  .ec-auth-back:hover{transform:none}
}

/* ---------- Icons ---------- */
.ec-auth-icon-mail{width:18px;height:18px}
.ec-auth-icon-lock{width:18px;height:18px}
.ec-auth-icon-user{width:18px;height:18px}
.ec-auth-icon-eye{width:18px;height:18px}
.ec-auth-icon-eye-off{width:18px;height:18px}
.ec-auth-icon-warn{width:16px;height:16px}
.ec-auth-icon-arrow{width:14px;height:14px}
`;

/* ============================================================
   Inline icon helpers
   ============================================================ */
const MailIcon = () => (
  <svg className="ec-auth-icon-mail" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3.5 7 8.5 6 8.5-6" />
  </svg>
);

const LockIcon = () => (
  <svg className="ec-auth-icon-lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="10.5" width="16" height="10" rx="2" />
    <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
  </svg>
);

const UserIcon = () => (
  <svg className="ec-auth-icon-user" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8.5" r="3.6" />
    <path d="M4 20a8 8 0 0 1 16 0" />
  </svg>
);

const EyeIcon = () => (
  <svg className="ec-auth-icon-eye" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg className="ec-auth-icon-eye-off" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 12S6 5.5 12 5.5a9.6 9.6 0 0 1 4.2 1" />
    <path d="M21.5 12s-1.4 2.6-4 4.4" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    <path d="M3 3l18 18" />
  </svg>
);

const WarnIcon = () => (
  <svg className="ec-auth-icon-warn" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v5" />
    <circle cx="12" cy="16.5" r="0.6" fill="currentColor" />
  </svg>
);

const ArrowLeft = () => (
  <svg className="ec-auth-icon-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5" />
    <path d="m11 18-6-6 6-6" />
  </svg>
);

/* ============================================================
   Langut mascot — yellow blob
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
   Password strength helper
   ============================================================ */
function passwordStrength(pwd) {
  if (!pwd) return { score: 0, label: '' };
  let score = 0;
  if (pwd.length >= 6) score++;
  if (pwd.length >= 10) score++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
  if (/\d/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 1) return { score: 1, label: 'Weak' };
  if (score <= 3) return { score: 2, label: 'Medium' };
  return { score: 3, label: 'Strong' };
}

/* ============================================================
   Main component
   ============================================================ */
const TABS = [
  { id: 'login',    label: 'Log in' },
  { id: 'register', label: 'Register' },
  { id: 'guest',    label: 'Guest' },
];

export function Login() {
  const { user, login, register, continueAsGuest, logout } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const activeTab = TABS.findIndex((t) => t.id === mode);
  const strength = mode === 'register' ? passwordStrength(password) : { score: 0, label: '' };

  const clearField = (key) => {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const validate = () => {
    const errs = {};
    if (!email.trim()) errs.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errs.email = 'Enter a valid email address.';

    if (mode !== 'guest') {
      if (!password) errs.password = 'Password is required.';
      else if (password.length < 6) errs.password = 'Use at least 6 characters.';
    }
    if ((mode === 'register' || mode === 'guest') && !name.trim()) {
      errs.name = 'Please tell us your name.';
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setBusy(true);
    try {
      if (mode === 'login') await login(email.trim(), password);
      else if (mode === 'register') await register(email.trim(), password, name.trim());
      else await continueAsGuest(name.trim(), email.trim());
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong — please try again.');
    } finally {
      setBusy(false);
    }
  };

  const switchMode = (id) => {
    if (id === mode) return;
    setMode(id);
    setError('');
    setFieldErrors({});
    setShowPwd(false);
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await logout();
      setError('');
      setFieldErrors({});
      setMode('login');
    } finally {
      setSigningOut(false);
    }
  };

  const submitLabel =
    mode === 'login' ? 'Log in to your account'
    : mode === 'register' ? 'Create your free account'
    : 'Continue as guest';

  return (
    <>
      <style>{LOGIN_CSS}</style>

      <div className="ec-auth">

        {/* ============================================================
            LEFT PANEL — desktop-only branding + mascot
           ============================================================ */}
        <aside className="ec-auth-side">
          <span className="ec-auth-orb ec-auth-orb--a" aria-hidden="true" />
          <span className="ec-auth-orb ec-auth-orb--b" aria-hidden="true" />
          <span className="ec-auth-orb ec-auth-orb--c" aria-hidden="true" />

          <div className="ec-auth-side-inner">
            <Link to="/" className="ec-auth-logo">
              <span className="ec-auth-logo-mark">E</span>
              FixMyEnglish 
            </Link>

            <span className="ec-auth-side-eyebrow">Your English journey</span>
            <h1>
              Learn English the way you actually <em>want to</em>.
            </h1>
            <p>
              Interactive lessons, AI‑scored speaking practice, board‑ready exam prep, and a community of learners — all in one place.
            </p>

            <ul className="ec-auth-features">
              <li className="ec-auth-feature">
                <span className="ec-auth-feature-icon">🎤</span>
                <div className="ec-auth-feature-body">
                  <p>AI‑scored speaking</p>
                  <span>Real‑time feedback on fluency, vocabulary and grammar.</span>
                </div>
              </li>
              <li className="ec-auth-feature">
                <span className="ec-auth-feature-icon">🎯</span>
                <div className="ec-auth-feature-body">
                  <p>IELTS · SAT · PTE ready</p>
                  <span>Full mocks, timed drills and adaptive study plans.</span>
                </div>
              </li>
              <li className="ec-auth-feature">
                <span className="ec-auth-feature-icon">🏆</span>
                <div className="ec-auth-feature-body">
                  <p>Streaks & achievements</p>
                  <span>Stay consistent and track progress day by day.</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="ec-auth-mascot">
            <span className="ec-auth-sparkle ec-auth-sparkle--a" aria-hidden="true" />
            <span className="ec-auth-sparkle ec-auth-sparkle--b" aria-hidden="true" />
            <span className="ec-auth-sparkle ec-auth-sparkle--c" aria-hidden="true" />
            <LangutMascot size={140} />
          </div>

          <div className="ec-auth-side-foot">
            <span>© {new Date().getFullYear()} FixMyEnglish</span>
            <span>Built for Bengali learners</span>
          </div>
        </aside>

        {/* ============================================================
            MOBILE HEADER — logo + mini mascot (hidden on desktop)
           ============================================================ */}
        <div className="ec-auth-mobile-head">
          <Link to="/" className="ec-auth-mobile-logo">
            <span className="ec-auth-mobile-logo-mark">E</span>
            FixMyEnglish
          </Link>
          <div className="ec-auth-mobile-mascot">
            <LangutMascot size={60} />
          </div>
        </div>

        {/* ============================================================
            RIGHT PANEL — form card (bottom-sheet on mobile)
           ============================================================ */}
        <main className="ec-auth-main">
          <div className="ec-auth-card">

            {user && (
              <div className="ec-auth-signedin">
                <span className="ec-auth-signedin-dot" aria-hidden="true" />
                <div className="ec-auth-signedin-body">
                  <p>
                    Signed in as <b>{user.name || user.tier || 'Guest'}</b>
                  </p>
                  <span>Signing in again replaces this session.</span>
                </div>
                <button
                  type="button"
                  className="ec-auth-signedin-btn"
                  onClick={handleSignOut}
                  disabled={signingOut}
                >
                  {signingOut ? 'Signing out…' : 'Log out first'}
                </button>
              </div>
            )}

            <div className="ec-auth-card-head">
              <p className="ec-auth-card-eyebrow">Welcome</p>
              <h2>
                {mode === 'login' && 'Sign in to continue'}
                {mode === 'register' && 'Create your account'}
                {mode === 'guest' && 'Try as a guest'}
              </h2>
              <p className="ec-auth-card-sub">
                {mode === 'login' && 'Pick up right where you left off.'}
                {mode === 'register' && 'Free forever. No card required.'}
                {mode === 'guest' && 'Explore a few features without signing up.'}
              </p>
            </div>

            <div className="ec-auth-tabs" role="tablist" aria-label="Authentication mode">
              <span className="ec-auth-tab-indicator" data-active={activeTab} aria-hidden="true" />
              {TABS.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={mode === t.id}
                  className={`ec-auth-tab${mode === t.id ? ' ec-auth-tab--active' : ''}`}
                  onClick={() => switchMode(t.id)}
                  type="button"
                >
                  {t.label}
                </button>
              ))}
            </div>

            <form className="ec-auth-form" onSubmit={submit} noValidate>

              {(mode === 'register' || mode === 'guest') && (
                <div className="ec-auth-field">
                  <label className="ec-auth-label" htmlFor="ec-auth-name">Full name</label>
                  <div className={`ec-auth-input-wrap${fieldErrors.name ? ' ec-auth-input-wrap--error' : ''}`}>
                    <span className="ec-auth-input-icon"><UserIcon /></span>
                    <input
                      id="ec-auth-name"
                      className="ec-auth-input"
                      type="text"
                      placeholder="e.g. Rina Akter"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => { setName(e.target.value); clearField('name'); }}
                    />
                  </div>
                  {fieldErrors.name && (
                    <span className="ec-auth-field-error"><WarnIcon /> {fieldErrors.name}</span>
                  )}
                </div>
              )}

              <div className="ec-auth-field">
                <label className="ec-auth-label" htmlFor="ec-auth-email">Email address</label>
                <div className={`ec-auth-input-wrap${fieldErrors.email ? ' ec-auth-input-wrap--error' : ''}`}>
                  <span className="ec-auth-input-icon"><MailIcon /></span>
                  <input
                    id="ec-auth-email"
                    className="ec-auth-input"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    inputMode="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); clearField('email'); }}
                  />
                </div>
                {fieldErrors.email && (
                  <span className="ec-auth-field-error"><WarnIcon /> {fieldErrors.email}</span>
                )}
              </div>

              {mode !== 'guest' && (
                <div className="ec-auth-field">
                  <label className="ec-auth-label" htmlFor="ec-auth-password">Password</label>
                  <div className={`ec-auth-input-wrap${fieldErrors.password ? ' ec-auth-input-wrap--error' : ''}`}>
                    <span className="ec-auth-input-icon"><LockIcon /></span>
                    <input
                      id="ec-auth-password"
                      className="ec-auth-input"
                      type={showPwd ? 'text' : 'password'}
                      placeholder={mode === 'register' ? 'At least 6 characters' : 'Your password'}
                      autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); clearField('password'); }}
                    />
                    <button
                      type="button"
                      className="ec-auth-input-toggle"
                      onClick={() => setShowPwd((s) => !s)}
                      aria-label={showPwd ? 'Hide password' : 'Show password'}
                      tabIndex={-1}
                    >
                      {showPwd ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>

                  {mode === 'register' && password && (
                    <>
                      <div className="ec-auth-strength" aria-hidden="true">
                        {[1, 2, 3].map((i) => (
                          <span
                            key={i}
                            className={`ec-auth-strength-bar${
                              strength.score >= i
                                ? ` ec-auth-strength-bar--active-${strength.score}`
                                : ''
                            }`}
                          />
                        ))}
                      </div>
                      <span
                        className="ec-auth-strength-label"
                        style={{
                          color:
                            strength.score === 1 ? '#E0503C'
                            : strength.score === 2 ? '#B5760E'
                            : '#1F8A4C',
                        }}
                      >
                        {strength.label} password
                      </span>
                    </>
                  )}

                  {fieldErrors.password && (
                    <span className="ec-auth-field-error"><WarnIcon /> {fieldErrors.password}</span>
                  )}
                </div>
              )}

              {mode === 'login' && (
                <div className="ec-auth-row">
                  <label className="ec-auth-check">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                    />
                    Remember me
                  </label>
                  <a href="#/forgot" className="ec-auth-forgot" onClick={(e) => e.preventDefault()}>
                    Forgot password?
                  </a>
                </div>
              )}

              {error && (
                <div className="ec-auth-alert" role="alert">
                  <span className="ec-auth-alert-icon"><WarnIcon /></span>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="ec-auth-submit"
                disabled={busy}
              >
                {busy ? (
                  <>
                    <span className="ec-auth-submit-spinner" aria-hidden="true" />
                    Please wait…
                  </>
                ) : (
                  <>
                    {submitLabel}
                    <span aria-hidden="true">→</span>
                  </>
                )}
              </button>
            </form>

            {mode !== 'guest' && (
              <>
                <div className="ec-auth-divider">or</div>
                <button
                  type="button"
                  className="ec-auth-guest"
                  onClick={() => switchMode('guest')}
                  disabled={busy}
                >
                  👤 Continue as guest
                </button>
              </>
            )}

            <p className="ec-auth-legal">
              By continuing, you agree to our <a href="#/terms" onClick={(e) => e.preventDefault()}>Terms</a> and{' '}
              <a href="#/privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a>.
            </p>

            <Link to="/" className="ec-auth-back">
              <ArrowLeft /> Back to home
            </Link>

          </div>
        </main>

      </div>
    </>
  );
}

export default Login;