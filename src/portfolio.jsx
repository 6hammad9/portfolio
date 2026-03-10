import { useState, useEffect, useRef } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

/* ─────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:      #050a0e;
    --bg2:     #0a1520;
    --bg3:     #0d1e2e;
    --accent:  #00d4ff;
    --accent2: #00ff9d;
    --accent3: #ff6b35;
    --text:    #e2eaf2;
    --muted:   #6a8a9f;
    --border:  rgba(0,212,255,0.15);
    --glow:    0 0 24px rgba(0,212,255,0.35);
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Syne', sans-serif;
    overflow-x: hidden;
    min-height: 100vh;
  }

  /* Grid overlay */
  body::before {
    content: '';
    position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(0,212,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,212,255,0.025) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
    z-index: 0;
  }

  /* Scanlines */
  body::after {
    content: '';
    position: fixed; inset: 0;
    background: repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.025) 2px,rgba(0,0,0,0.025) 4px);
    pointer-events: none;
    z-index: 1;
  }

  #root { position: relative; z-index: 2; }

  /* ── NAV ── */
  .nav {
    position: fixed; top: 0; width: 100%; z-index: 200;
    padding: 18px 60px;
    display: flex; justify-content: space-between; align-items: center;
    background: rgba(5,10,14,0.88);
    backdrop-filter: blur(22px);
    border-bottom: 1px solid var(--border);
    transition: padding 0.3s;
  }
  .nav-logo {
    font-family: 'Space Mono', monospace;
    font-size: 14px; color: var(--accent);
    letter-spacing: 2px; text-decoration: none;
  }
  .nav-logo span { color: var(--accent2); }
  .nav-links { display: flex; gap: 34px; list-style: none; align-items: center; }
  .nav-links a {
    color: var(--muted); text-decoration: none;
    font-size: 12px; letter-spacing: 1.5px;
    font-family: 'Space Mono', monospace;
    text-transform: uppercase; transition: color 0.3s;
    position: relative;
  }
  .nav-links a::after {
    content: ''; position: absolute; bottom: -4px; left: 0;
    width: 0; height: 1px; background: var(--accent); transition: width 0.3s;
  }
  .nav-links a:hover, .nav-links a.active { color: var(--accent); }
  .nav-links a:hover::after, .nav-links a.active::after { width: 100%; }
  .nav-cta {
    padding: 9px 22px;
    background: transparent; color: var(--accent);
    border: 1px solid var(--accent);
    font-family: 'Space Mono', monospace; font-size: 11px;
    letter-spacing: 1px; cursor: pointer;
    text-decoration: none; transition: all 0.3s;
    clip-path: polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px));
  }
  .nav-cta:hover { background: rgba(0,212,255,0.1); box-shadow: var(--glow); }

  /* ── SECTION COMMONS ── */
  .section { padding: 110px 60px; position: relative; }
  .section--alt { background: var(--bg2); }

  .section-header {
    display: flex; align-items: center; gap: 20px; margin-bottom: 70px;
  }
  .section-num { font-family: 'Space Mono', monospace; font-size: 13px; color: var(--accent); letter-spacing: 2px; }
  .section-title { font-size: clamp(28px,4vw,46px); font-weight: 800; letter-spacing: -1px; }
  .section-line { flex: 1; height: 1px; background: var(--border); }

  /* ── HERO ── */
  .hero {
    min-height: 100vh; display: flex; align-items: center;
    padding: 130px 60px 60px; position: relative; overflow: hidden;
  }
  .hero-orb {
    position: absolute; border-radius: 50%; filter: blur(130px); pointer-events: none;
  }
  .orb1 {
    width: 600px; height: 600px;
    background: radial-gradient(circle,rgba(0,212,255,0.13),transparent 70%);
    top: -100px; right: -100px;
    animation: orbPulse 7s ease-in-out infinite alternate;
  }
  .orb2 {
    width: 380px; height: 380px;
    background: radial-gradient(circle,rgba(0,255,157,0.09),transparent 70%);
    bottom: 60px; left: 200px;
    animation: orbPulse 9s ease-in-out infinite alternate-reverse;
  }
  @keyframes orbPulse { from { transform: scale(1); opacity: .6; } to { transform: scale(1.12); opacity: 1; } }

  .hero-tag {
    font-family: 'Space Mono', monospace; font-size: 11px;
    color: var(--accent2); letter-spacing: 4px; text-transform: uppercase;
    margin-bottom: 22px; display: flex; align-items: center; gap: 12px;
  }
  .hero-tag::before { content: ''; display: inline-block; width: 38px; height: 1px; background: var(--accent2); }

  .hero-name { font-size: clamp(52px,7.5vw,96px); font-weight: 800; line-height: 1; letter-spacing: -2px; margin-bottom: 18px; }
  .hero-name-first { color: var(--text); }
  .hero-name-last { color: transparent; -webkit-text-stroke: 1.5px var(--accent); display: block; }

  .hero-subtitle {
    font-size: 17px; color: var(--muted);
    font-family: 'Space Mono', monospace; margin-bottom: 28px;
    min-height: 26px;
  }
  .hero-subtitle .hi { color: var(--accent); }

  .hero-desc {
    font-size: 16px; line-height: 1.85; color: var(--muted);
    max-width: 580px; margin-bottom: 52px;
  }

  .hero-btns { display: flex; gap: 18px; flex-wrap: wrap; }

  .btn-fill {
    padding: 14px 36px; background: var(--accent); color: var(--bg);
    border: none; font-family: 'Space Mono', monospace; font-size: 12px;
    letter-spacing: 1px; cursor: pointer; text-decoration: none; font-weight: 700;
    clip-path: polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px));
    transition: all 0.3s; display: inline-block;
  }
  .btn-fill:hover { background: var(--accent2); box-shadow: 0 0 32px rgba(0,255,157,0.45); }

  .btn-outline {
    padding: 14px 36px; background: transparent; color: var(--accent);
    border: 1px solid var(--accent); font-family: 'Space Mono', monospace; font-size: 12px;
    letter-spacing: 1px; cursor: pointer; text-decoration: none;
    clip-path: polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px));
    transition: all 0.3s; display: inline-block;
  }
  .btn-outline:hover { background: rgba(0,212,255,0.1); box-shadow: var(--glow); }

  .hero-stats {
    position: absolute; right: 60px; bottom: 80px;
    display: flex; flex-direction: column; gap: 28px;
  }
  .stat { text-align: right; border-right: 2px solid var(--accent); padding-right: 18px; }
  .stat-num { font-size: 34px; font-weight: 800; color: var(--accent); line-height: 1; }
  .stat-lbl { font-family: 'Space Mono', monospace; font-size: 10px; color: var(--muted); letter-spacing: 2px; text-transform: uppercase; margin-top: 4px; }

  /* ── ABOUT ── */
  .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start; }
  .about-text p { font-size: 15px; line-height: 1.9; color: var(--muted); margin-bottom: 18px; }
  .about-text strong { color: var(--accent); font-weight: 600; }

  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .info-card {
    background: var(--bg3); border: 1px solid var(--border);
    padding: 22px; position: relative; overflow: hidden; transition: border-color 0.3s;
  }
  .info-card::before { content: ''; position: absolute; top: 0; left: 0; width: 3px; height: 100%; background: var(--accent); }
  .info-card:hover { border-color: var(--accent); }
  .info-lbl { font-family: 'Space Mono', monospace; font-size: 10px; color: var(--accent2); letter-spacing: 3px; text-transform: uppercase; margin-bottom: 7px; }
  .info-val { font-size: 14px; color: var(--text); font-weight: 600; }

  .lang-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-top: 10px; }
  .lang-card { background: var(--bg3); border: 1px solid var(--border); padding: 16px; text-align: center; }
  .lang-name { font-size: 13px; font-weight: 700; margin-bottom: 5px; }
  .lang-level { font-family: 'Space Mono', monospace; font-size: 10px; color: var(--accent2); letter-spacing: 2px; }

  /* ── SKILLS ── */
  .skills-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 26px; }
  .skill-cat {
    background: var(--bg3); border: 1px solid var(--border);
    padding: 30px; transition: all 0.35s; position: relative; overflow: hidden;
  }
  .skill-cat::after {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg,var(--accent),var(--accent2));
    transform: scaleX(0); transform-origin: left; transition: transform 0.4s;
  }
  .skill-cat:hover::after { transform: scaleX(1); }
  .skill-cat:hover { border-color: rgba(0,212,255,0.4); box-shadow: var(--glow); }
  .cat-icon { font-size: 26px; margin-bottom: 14px; display: block; }
  .cat-title { font-family: 'Space Mono', monospace; font-size: 10px; color: var(--accent); letter-spacing: 3px; text-transform: uppercase; margin-bottom: 18px; }
  .tag-list { display: flex; flex-wrap: wrap; gap: 7px; }
  .tag {
    padding: 4px 11px; background: rgba(0,212,255,0.07); border: 1px solid rgba(0,212,255,0.2);
    font-family: 'Space Mono', monospace; font-size: 10px; color: var(--text); letter-spacing: 0.4px; transition: all 0.2s;
  }
  .tag:hover { background: rgba(0,212,255,0.16); border-color: var(--accent); color: var(--accent); }

  /* ── TIMELINE ── */
  .timeline { position: relative; padding-left: 42px; }
  .timeline::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 1px; background: linear-gradient(to bottom,var(--accent),transparent); }
  .tl-item { position: relative; margin-bottom: 56px; }
  .tl-item::before {
    content: ''; position: absolute; left: -48px; top: 6px;
    width: 12px; height: 12px; background: var(--accent); border: 2px solid var(--bg2); outline: 2px solid var(--accent);
    clip-path: polygon(50% 0%,100% 50%,50% 100%,0% 50%);
  }
  .tl-date { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--accent2); letter-spacing: 2px; margin-bottom: 7px; }
  .tl-role { font-size: 21px; font-weight: 700; margin-bottom: 4px; }
  .tl-company { font-size: 13px; color: var(--accent); font-family: 'Space Mono', monospace; margin-bottom: 14px; }
  .tl-bullets { list-style: none; }
  .tl-bullets li { padding: 5px 0 5px 20px; color: var(--muted); font-size: 14px; line-height: 1.7; position: relative; }
  .tl-bullets li::before { content: '▸'; position: absolute; left: 0; color: var(--accent); }

  /* ── EDUCATION ── */
  .edu-certs { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
  .sub-heading { font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 22px; }
  .edu-card {
    background: var(--bg3); border: 1px solid var(--border); padding: 28px;
    margin-bottom: 20px; position: relative; overflow: hidden; transition: border-color 0.3s;
  }
  .edu-card::before { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg,var(--accent2),transparent); }
  .edu-card:hover { border-color: var(--accent2); }
  .edu-degree { font-size: 17px; font-weight: 700; margin-bottom: 6px; }
  .edu-school { font-family: 'Space Mono', monospace; font-size: 12px; color: var(--accent2); margin-bottom: 7px; }
  .edu-year { font-size: 11px; color: var(--muted); font-family: 'Space Mono', monospace; }
  .edu-note { margin-top: 10px; font-size: 13px; color: var(--muted); line-height: 1.6; }

  .cert-card {
    display: flex; align-items: flex-start; gap: 14px;
    padding: 18px; background: var(--bg3); border: 1px solid var(--border); margin-bottom: 14px; transition: border-color 0.3s;
  }
  .cert-card:hover { border-color: var(--accent3); }
  .cert-icon { width: 38px; height: 38px; background: rgba(255,107,53,0.1); border: 1px solid rgba(255,107,53,0.3); display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
  .cert-name { font-size: 13px; font-weight: 600; margin-bottom: 4px; }
  .cert-issuer { font-family: 'Space Mono', monospace; font-size: 10px; color: var(--accent3); }

  /* ── CONTACT ── */
  .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }
  .contact-lead { font-size: 34px; font-weight: 800; line-height: 1.2; margin-bottom: 18px; }
  .contact-lead span { color: var(--accent); }
  .contact-p { color: var(--muted); font-size: 15px; line-height: 1.8; margin-bottom: 36px; }
  .contact-links { display: flex; flex-direction: column; gap: 14px; }
  .c-link {
    display: flex; align-items: center; gap: 14px;
    padding: 16px 22px; background: var(--bg3); border: 1px solid var(--border);
    text-decoration: none; color: var(--text); transition: all 0.3s;
    font-family: 'Space Mono', monospace; font-size: 12px;
  }
  .c-link:hover { border-color: var(--accent); background: rgba(0,212,255,0.07); box-shadow: var(--glow); padding-left: 30px; }
  .c-icon { width: 34px; height: 34px; background: rgba(0,212,255,0.1); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0; }

  .form { display: flex; flex-direction: column; gap: 18px; }
  .form-grp { display: flex; flex-direction: column; gap: 7px; }
  .form-lbl { font-family: 'Space Mono', monospace; font-size: 10px; color: var(--accent); letter-spacing: 2px; text-transform: uppercase; }
  .form-inp, .form-ta {
    background: var(--bg3); border: 1px solid var(--border);
    padding: 13px 16px; color: var(--text); font-family: 'Syne', sans-serif;
    font-size: 14px; outline: none; transition: border-color 0.3s; resize: none;
  }
  .form-inp:focus, .form-ta:focus { border-color: var(--accent); }
  .form-ta { height: 110px; }

  /* ── FOOTER ── */
  footer {
    position: relative; z-index: 2; padding: 28px 60px;
    border-top: 1px solid var(--border);
    display: flex; justify-content: space-between; align-items: center;
    background: var(--bg);
  }
  .footer-copy { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--muted); }
  .footer-copy span { color: var(--accent); }
  .footer-links { display: flex; gap: 22px; }
  .footer-links a { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--muted); text-decoration: none; transition: color 0.3s; }
  .footer-links a:hover { color: var(--accent); }

  /* ── FADE IN ── */
  .fade { opacity: 0; transform: translateY(28px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .fade.show { opacity: 1; transform: translateY(0); }

  /* ── CURSOR BLINK ── */
  .cursor { display: inline-block; width: 2px; height: 1em; background: var(--accent); animation: blink 1s step-end infinite; vertical-align: text-bottom; margin-left: 3px; }
  @keyframes blink { 50% { opacity: 0; } }

  /* ════════════════════════════════════════════
     PROJECTS PAGE
  ════════════════════════════════════════════ */
  .projects-page { padding: 130px 60px 100px; min-height: 100vh; }
  .projects-page-header { margin-bottom: 60px; }
  .pg-eyebrow { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--accent2); letter-spacing: 4px; text-transform: uppercase; display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
  .pg-eyebrow::before { content: ''; display: inline-block; width: 36px; height: 1px; background: var(--accent2); }
  .pg-title { font-size: clamp(36px,5vw,62px); font-weight: 800; letter-spacing: -1.5px; line-height: 1.05; margin-bottom: 18px; }
  .pg-title span { color: transparent; -webkit-text-stroke: 1.5px var(--accent); }
  .pg-desc { font-size: 15px; color: var(--muted); max-width: 560px; line-height: 1.8; }

  /* filter tabs */
  .filter-tabs { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 48px; }
  .ftab {
    padding: 7px 18px; background: transparent; border: 1px solid var(--border);
    font-family: 'Space Mono', monospace; font-size: 11px; color: var(--muted);
    letter-spacing: 1px; cursor: pointer; transition: all 0.25s; text-transform: uppercase;
  }
  .ftab:hover { border-color: var(--accent); color: var(--accent); }
  .ftab.active { background: var(--accent); color: var(--bg); border-color: var(--accent); font-weight: 700; }

  /* 3-col grid */
  .flip-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 28px; }

  /* flip card */
  .flip-wrap { perspective: 1200px; height: 380px; cursor: pointer; }
  .flip-wrap:hover .flip-inner { transform: rotateY(180deg); }
  .flip-inner { position: relative; width: 100%; height: 100%; transform-style: preserve-3d; transition: transform 0.65s cubic-bezier(0.23,1,0.32,1); }
  .flip-inner.flipped { transform: rotateY(180deg); }

  .flip-front, .flip-back {
    position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden;
    border: 1px solid var(--border); overflow: hidden;
  }

  .flip-front {
    background: linear-gradient(145deg, rgba(13,30,46,0.95) 0%, rgba(5,10,14,0.97) 100%);
    display: flex; flex-direction: column; padding: 32px;
  }
  .flip-front::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(0,212,255,0.04), transparent 60%);
    pointer-events: none;
  }
  .flip-front::after {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--accent), var(--accent2), transparent);
    opacity: 0.8;
  }

  .flip-back {
    background: linear-gradient(145deg, rgba(0,30,46,0.98) 0%, rgba(0,18,30,0.99) 100%);
    transform: rotateY(180deg);
    display: flex; flex-direction: column; padding: 28px;
  }
  .flip-back::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(0,255,157,0.04), transparent 60%);
    pointer-events: none;
  }
  .flip-back::after {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--accent2), var(--accent), transparent);
    opacity: 0.8;
  }

  /* front content */
  .card-mockup {
    flex: 1; border-radius: 4px; margin-bottom: 22px; overflow: hidden; position: relative;
    display: flex; align-items: center; justify-content: center;
    background: rgba(0,0,0,0.3); border: 1px solid rgba(0,212,255,0.1);
  }
  .card-mockup-inner { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }

  .card-year { font-family: 'Space Mono', monospace; font-size: 10px; color: var(--accent2); letter-spacing: 3px; text-transform: uppercase; margin-bottom: 8px; }
  .card-name { font-size: 20px; font-weight: 800; color: var(--text); margin-bottom: 4px; letter-spacing: -0.3px; }
  .card-tagline { font-size: 12px; color: var(--muted); font-family: 'Space Mono', monospace; }

  /* back content */
  .back-name { font-size: 18px; font-weight: 800; color: var(--accent2); margin-bottom: 12px; }
  .back-desc { font-size: 13px; color: var(--muted); line-height: 1.75; margin-bottom: 18px; flex: 1; }
  .back-bullets { list-style: none; margin-bottom: 18px; }
  .back-bullets li { font-size: 12px; color: var(--muted); padding: 4px 0 4px 16px; position: relative; line-height: 1.6; }
  .back-bullets li::before { content: '▸'; position: absolute; left: 0; color: var(--accent2); font-size: 10px; }
  .back-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 18px; }
  .back-tag { padding: 3px 9px; background: rgba(0,255,157,0.08); border: 1px solid rgba(0,255,157,0.2); font-family: 'Space Mono', monospace; font-size: 9px; color: var(--accent2); }
  .back-links { display: flex; gap: 10px; margin-top: auto; }
  .back-btn {
    padding: 8px 16px; font-family: 'Space Mono', monospace; font-size: 10px; letter-spacing: 1px;
    cursor: pointer; text-decoration: none; transition: all 0.25s; display: flex; align-items: center; gap: 7px;
  }
  .back-btn-gh { background: transparent; border: 1px solid var(--accent); color: var(--accent); }
  .back-btn-gh:hover { background: rgba(0,212,255,0.12); box-shadow: var(--glow); }
  .back-btn-hint { font-family: 'Space Mono', monospace; font-size: 9px; color: var(--muted); letter-spacing: 1px; text-align: right; margin-top: auto; padding-top: 6px; }

  /* flip hint */
  .flip-hint {
    position: absolute; bottom: 12px; right: 14px;
    font-family: 'Space Mono', monospace; font-size: 9px; color: rgba(0,212,255,0.4); letter-spacing: 1px;
    display: flex; align-items: center; gap: 5px;
  }
  .flip-hint::before { content: '↺'; font-size: 11px; }

  /* page transition */
  .page-enter { animation: pageIn 0.45s ease forwards; }
  @keyframes pageIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

  /* RESPONSIVE */
  @media (max-width: 900px) {
    .flip-grid { grid-template-columns: repeat(2,1fr); }
    .skills-grid { grid-template-columns: repeat(2,1fr); }
  }
  @media (max-width: 768px) {
    .nav { padding: 16px 24px; }
    .nav-links { display: none; }
    .section, .hero, .projects-page { padding-left: 24px; padding-right: 24px; }
    .about-grid, .edu-certs, .contact-grid { grid-template-columns: 1fr; }
    .hero-stats { display: none; }
    .flip-grid { grid-template-columns: 1fr; }
    .skills-grid { grid-template-columns: 1fr; }
    footer { flex-direction: column; gap: 12px; text-align: center; }
  }
`;

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const projects = [
  {
    id: 1, year: "2025", name: "WorkAI",
    tagline: "AI Safety Monitoring Dashboard",
    category: "AI / ML",
    desc: "Industrial safety monitoring system with real-time PPE compliance detection, automated reporting, and live dashboards.",
    bullets: [
      "Human pose estimation via YOLO Pose for PPE compliance",
      "Face detection & recognition pipeline (YOLOv8 + ONNX)",
      "Automated daily / weekly / monthly compliance reports",
      "Docker deployment for portability across environments",
    ],
    tech: ["YOLOv8 Pose","ONNX","React.js","Node.js","MongoDB","Docker"],
    github: "https://github.com/6hammad9",
    color: "#00d4ff",
    icon: "🦺",
    gradient: "linear-gradient(135deg,rgba(0,212,255,0.18),rgba(0,212,255,0.04))",
  },
  {
    id: 2, year: "2025", name: "EMACS",
    tagline: "Multi-Camera Access Control",
    category: "AI / ML",
    desc: "Real-time face recognition access control across 16 simultaneous video streams with auto-whitelist synchronisation.",
    bullets: [
      "Face detection (YOLOv8) + recognition (ONNX GlintR100)",
      "16-camera simultaneous stream processing",
      "Auto-whitelist sync & unauthorized attempt tracking",
      "Security audit dashboards & compliance reporting",
    ],
    tech: ["YOLOv8","ONNX","React.js","Node.js","MongoDB"],
    github: "https://github.com/6hammad9",
    color: "#00ff9d",
    icon: "🔐",
    gradient: "linear-gradient(135deg,rgba(0,255,157,0.18),rgba(0,255,157,0.04))",
  },
  {
    id: 3, year: "2025", name: "Drone Surveillance",
    tagline: "Multi-Object Tracking Pipeline",
    category: "AI / ML",
    desc: "Drone-based real-time multi-object tracking using ByteTrack and Kalman Filter predictive trajectories in AirSim.",
    bullets: [
      "ByteTrack multi-object tracker integration",
      "Kalman Filter for predictive trajectory estimation",
      "Simulated in Microsoft AirSim environment",
      "Robust to occlusion & re-identification",
    ],
    tech: ["ByteTrack","Kalman Filter","AirSim","Python","OpenCV"],
    github: "https://github.com/6hammad9",
    color: "#ff6b35",
    icon: "🚁",
    gradient: "linear-gradient(135deg,rgba(255,107,53,0.18),rgba(255,107,53,0.04))",
  },
  {
    id: 4, year: "2023", name: "Budget Analysis",
    tagline: "Government Spending Trends",
    category: "Data Analytics",
    desc: "Longitudinal analysis of government budget data (2000–2018) using R, revealing policy-relevant spending anomalies.",
    bullets: [
      "Time series & statistical modelling in R",
      "ggplot2 visualisations of budget allocation shifts",
      "Correlation analysis: economic indicators vs. spending",
      "Policy insights & analytical reporting deliverables",
    ],
    tech: ["R","tidyverse","ggplot2","Time Series","Statistical Modeling"],
    github: "https://github.com/6hammad9",
    color: "#a78bfa",
    icon: "📊",
    gradient: "linear-gradient(135deg,rgba(167,139,250,0.18),rgba(167,139,250,0.04))",
  },
  {
    id: 5, year: "2022", name: "Cyclistic Bike-Share",
    tagline: "Google Data Analytics Capstone",
    category: "Data Analytics",
    desc: "EDA on 5.7M+ bike-share trips identifying user behaviour patterns with data-driven marketing recommendations.",
    bullets: [
      "Cleaned & preprocessed 5.7M+ records (R / tidyverse)",
      "40% difference in avg trip duration: casual vs. member",
      "Interactive ggplot2 dashboards for stakeholder comms",
      "Actionable recommendations for rider conversion strategy",
    ],
    tech: ["R","tidyverse","ggplot2","EDA","Statistics"],
    github: "https://github.com/6hammad9",
    color: "#f59e0b",
    icon: "🚲",
    gradient: "linear-gradient(135deg,rgba(245,158,11,0.18),rgba(245,158,11,0.04))",
  },
  {
    id: 6, year: "2024", name: "Node.js Full-Stack",
    tagline: "E-Commerce + Blog Platform",
    category: "Full-Stack",
    desc: "Full e-commerce platform with payment integration and a blog CMS with auth & CRUD, built from a comprehensive Node.js curriculum.",
    bullets: [
      "E-commerce: checkout, cart, Stripe payment integration",
      "Blog CMS: user auth, CRUD, responsive UI",
      "REST API & GraphQL endpoints",
      "MVC architecture with MongoDB persistence",
    ],
    tech: ["Node.js","Express.js","React.js","MongoDB","GraphQL","MVC"],
    github: "https://github.com/6hammad9",
    color: "#34d399",
    icon: "🛒",
    gradient: "linear-gradient(135deg,rgba(52,211,153,0.18),rgba(52,211,153,0.04))",
  },
];

const CATEGORIES = ["All", "AI / ML", "Data Analytics", "Full-Stack"];

/* ─────────────────────────────────────────────
   HOOKS
───────────────────────────────────────────── */
function useFadeIn() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("show"); obs.unobserve(el); } }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function useTypingEffect(words, speed = 80) {
  const [text, setText] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    const delay = deleting ? 40 : charIdx === current.length ? 2400 : speed;
    const timer = setTimeout(() => {
      if (!deleting && charIdx < current.length) { setText(current.slice(0, charIdx + 1)); setCharIdx(c => c + 1); }
      else if (!deleting && charIdx === current.length) { setDeleting(true); }
      else if (deleting && charIdx > 0) { setText(current.slice(0, charIdx - 1)); setCharIdx(c => c - 1); }
      else { setDeleting(false); setWordIdx(i => (i + 1) % words.length); }
    }, delay);
    return () => clearTimeout(timer);
  }, [text, charIdx, deleting, wordIdx, words, speed]);

  return text;
}

/* ─────────────────────────────────────────────
   COMPONENTS
───────────────────────────────────────────── */

function Fade({ children, delay = 0, style = {} }) {
  const ref = useFadeIn();
  return <div ref={ref} className="fade" style={{ transitionDelay: `${delay}s`, ...style }}>{children}</div>;
}

/* ── SVG Mockups for project cards ── */
function ProjectMockup({ icon, color, gradient, name }) {
  return (
    <div style={{ width: "100%", height: "100%", background: gradient, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      {/* circuit lines */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.15 }} viewBox="0 0 200 130">
        <line x1="0" y1="30" x2="60" y2="30" stroke={color} strokeWidth="0.8"/>
        <line x1="60" y1="30" x2="60" y2="60" stroke={color} strokeWidth="0.8"/>
        <line x1="60" y1="60" x2="140" y2="60" stroke={color} strokeWidth="0.8"/>
        <line x1="140" y1="60" x2="140" y2="100" stroke={color} strokeWidth="0.8"/>
        <line x1="140" y1="100" x2="200" y2="100" stroke={color} strokeWidth="0.8"/>
        <line x1="30" y1="0" x2="30" y2="30" stroke={color} strokeWidth="0.8"/>
        <line x1="170" y1="100" x2="170" y2="130" stroke={color} strokeWidth="0.8"/>
        <circle cx="60" cy="30" r="2.5" fill={color}/>
        <circle cx="60" cy="60" r="2.5" fill={color}/>
        <circle cx="140" cy="60" r="2.5" fill={color}/>
        <circle cx="140" cy="100" r="2.5" fill={color}/>
        <line x1="100" y1="0" x2="100" y2="20" stroke={color} strokeWidth="0.8"/>
        <line x1="100" y1="20" x2="160" y2="20" stroke={color} strokeWidth="0.8"/>
        <circle cx="100" cy="20" r="2.5" fill={color}/>
      </svg>
      {/* icon */}
      <div style={{ fontSize: 44, marginBottom: 10, filter: `drop-shadow(0 0 12px ${color})`, position: "relative", zIndex: 1 }}>{icon}</div>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color, letterSpacing: 3, textTransform: "uppercase", opacity: 0.7, position: "relative", zIndex: 1 }}>{name}</div>
    </div>
  );
}

/* ── Flip Card ── */
function FlipCard({ project, delay }) {
  const [flipped, setFlipped] = useState(false);
  const ref = useFadeIn();

  return (
    <div ref={ref} className="fade" style={{ transitionDelay: `${delay}s` }}>
      <div className="flip-wrap" onClick={() => setFlipped(f => !f)}>
        <div className={`flip-inner${flipped ? " flipped" : ""}`}>
          {/* FRONT */}
          <div className="flip-front" style={{ borderColor: `${project.color}30` }}>
            <div className="card-mockup">
              <ProjectMockup icon={project.icon} color={project.color} gradient={project.gradient} name={project.name}/>
            </div>
            <div className="card-year">{project.year} · {project.category}</div>
            <div className="card-name">{project.name}</div>
            <div className="card-tagline">{project.tagline}</div>
            <div className="flip-hint">flip for details</div>
          </div>
          {/* BACK */}
          <div className="flip-back" style={{ borderColor: `${project.color}30` }}>
            <div className="back-name">{project.name}</div>
            <div className="back-desc">{project.desc}</div>
            <ul className="back-bullets">
              {project.bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
            <div className="back-tags">
              {project.tech.map(t => <span key={t} className="back-tag">{t}</span>)}
            </div>
            <div className="back-links">
              <a href={project.github} target="_blank" rel="noreferrer" className="back-btn back-btn-gh" onClick={e => e.stopPropagation()}>
                <span>⌥</span> GitHub
              </a>
            </div>
            <div className="back-btn-hint">↺ click to flip back</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── NAV ── */
function Nav() {
  const location = useLocation();
  const isProjects = location.pathname === "/projects";
  return (
    <nav className="nav">
      <Link to="/" className="nav-logo">RHN<span>_</span></Link>
      <ul className="nav-links">
        {!isProjects && <>
          <li><a href="#about">About</a></li>
          <li><a href="#skills">Skills</a></li>
          <li><a href="#experience">Experience</a></li>
          <li><a href="#education">Education</a></li>
          <li><a href="#contact">Contact</a></li>
        </>}
        <li>
          <Link to={isProjects ? "/" : "/projects"} className={`nav-cta${isProjects ? " active" : ""}`}>
            {isProjects ? "← Portfolio" : "Projects ↗"}
          </Link>
        </li>
      </ul>
    </nav>
  );
}

/* ─────────────────────────────────────────────
   PAGES
───────────────────────────────────────────── */

function HomePage() {
  const title = useTypingEffect(["Data Analyst & ML Engineer", "Computer Vision Specialist", "Full-Stack Developer"]);

  return (
    <div className="page-enter">
      {/* HERO */}
      <section className="hero">
        <div className="hero-orb orb1"/>
        <div className="hero-orb orb2"/>
        <div>
          <Fade>
            <div className="hero-tag">Available for opportunities</div>
            <h1 className="hero-name">
              <span className="hero-name-first">Raja Hammad</span>
              <span className="hero-name-last">Naseer</span>
            </h1>
            <p className="hero-subtitle">
              <span className="hi">{title}</span><span className="cursor"/>
            </p>
            <p className="hero-desc">
              Master's student at TU Ilmenau building intelligent systems at the intersection of
              data science, computer vision, and full-stack engineering. Turning raw data into
              decisions and AI models into production-ready applications.
            </p>
            <div className="hero-btns">
              <Link to="/projects" className="btn-fill">View Projects</Link>
              <a href="#contact" className="btn-outline">Get In Touch</a>
            </div>
          </Fade>
        </div>
        <div className="hero-stats">
          {[["5.7M+","Records Analyzed"],["95%","Model Accuracy"],["2+","Years Experience"]].map(([n,l]) => (
            <div key={l} className="stat"><div className="stat-num">{n}</div><div className="stat-lbl">{l}</div></div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="section section--alt">
        <Fade><div className="section-header">
          <span className="section-num">01</span>
          <h2 className="section-title">About</h2>
          <div className="section-line"/>
        </div></Fade>
        <div className="about-grid">
          <Fade delay={0.1}>
            <div className="about-text">
              <p>I'm a <strong>data analyst and ML engineer</strong> pursuing a Master's in Computer & Systems Engineering at Technische Universität Ilmenau, Germany. My work spans the full pipeline — from data wrangling and statistical modelling to deploying real-time AI systems.</p>
              <p>I've built production-grade systems including <strong>multi-camera face recognition</strong> access control, <strong>PPE safety monitoring</strong> dashboards, and drone-based object tracking. Equally comfortable designing RESTful APIs as training YOLOv8 models.</p>
              <p>My approach is pragmatic: pick the right tool, build it clean, and make the insights <strong>actually understandable</strong> for the people who need them.</p>
            </div>
          </Fade>
          <Fade delay={0.2}>
            <div className="info-grid">
              {[["Location","Ilmenau, Germany"],["Status","M.Sc. Student @ TU Ilmenau"],["Work Permit","German Permit"],["Email","hammadnaseer2230\n@gmail.com"]].map(([l,v]) => (
                <div key={l} className="info-card"><div className="info-lbl">{l}</div><div className="info-val" style={{fontSize: l==="Email"?"11px":"14px"}}>{v}</div></div>
              ))}
              <div className="info-card" style={{gridColumn:"span 2"}}>
                <div className="info-lbl">Languages</div>
                <div className="lang-row">
                  {[["English","C1"],["German","A2"],["Urdu","Native"],["Punjabi","Native"]].map(([n,l]) => (
                    <div key={n} className="lang-card"><div className="lang-name">{n}</div><div className="lang-level">{l}</div></div>
                  ))}
                </div>
              </div>
            </div>
          </Fade>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="section">
        <Fade><div className="section-header">
          <span className="section-num">02</span>
          <h2 className="section-title">Skills</h2>
          <div className="section-line"/>
        </div></Fade>
        <div className="skills-grid">
          {[
            { icon:"🐍", title:"Languages & Scripting", tags:["Python","JavaScript","R","SQL","C#","C++"] },
            { icon:"🤖", title:"ML & AI", tags:["scikit-learn","TensorFlow","PyTorch","YOLOv8/v11","ONNX","Computer Vision","Object Detection","RAG","LLM Integration","ByteTrack"] },
            { icon:"📊", title:"Data Analysis & Viz", tags:["Pandas","NumPy","SciPy","Statsmodels","Tableau","ggplot2","Matplotlib","Seaborn","Plotly","tidyverse","Time Series"] },
            { icon:"🌐", title:"Full-Stack Web", tags:["Node.js","Express.js","React.js","Redux","REST APIs","GraphQL","MongoDB","MySQL","PostgreSQL"] },
            { icon:"⚙️", title:"DevOps & Tools", tags:["Docker","Git / GitHub","CI/CD","Linux","Jupyter","VS Code","Agile","ETL Pipelines"] },
            { icon:"🎯", title:"Soft Skills", tags:["Data Storytelling","Stakeholder Comms","Problem Solving","Critical Thinking","Presentation"] },
          ].map((cat, i) => (
            <Fade key={cat.title} delay={i * 0.07}>
              <div className="skill-cat">
                <span className="cat-icon">{cat.icon}</span>
                <div className="cat-title">{cat.title}</div>
                <div className="tag-list">{cat.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
              </div>
            </Fade>
          ))}
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="section section--alt">
        <Fade><div className="section-header">
          <span className="section-num">03</span>
          <h2 className="section-title">Experience</h2>
          <div className="section-line"/>
        </div></Fade>
        <div className="timeline">
          {[
            { date:"DEC 2023 – AUG 2024", role:"Full-Stack Developer / AI Developer", co:"Jatak Technologies · Rawalpindi, Pakistan",
              bullets:["Developed full-stack web apps with Node.js, Express.js, React.js and RESTful API endpoints","Integrated AI solutions using RAG pipelines for intelligent chatbot development","Collaborated in Agile teams using Git-based version control and CI/CD workflows"] },
            { date:"FEB 2023 – JUNE 2023", role:"AI Developer", co:"VisionTech360 · Islamabad, Pakistan",
              bullets:["Built real-time face detection (YOLOv8) and recognition (ONNX) pipelines — 95% accuracy","Developed live video dashboards (React + Node.js) for real-time monitoring","Processed detection log datasets; created visualisations to identify accuracy improvements","Integrated AI pipelines into full-stack web apps with MongoDB persistence"] },
            { date:"OCT 2023 – NOV 2023", role:"Machine Learning Intern", co:"CodeSoft · Virtual",
              bullets:["Built rule-based chatbot, tic-tac-toe AI, and image caption generator","Applied end-to-end ML concepts; recognised for problem-solving and innovation"] },
          ].map((item, i) => (
            <Fade key={item.date} delay={i * 0.1}>
              <div className="tl-item">
                <div className="tl-date">{item.date}</div>
                <div className="tl-role">{item.role}</div>
                <div className="tl-company">{item.co}</div>
                <ul className="tl-bullets">{item.bullets.map(b => <li key={b}>{b}</li>)}</ul>
              </div>
            </Fade>
          ))}
        </div>
      </section>

      {/* EDUCATION */}
      <section id="education" className="section">
        <Fade><div className="section-header">
          <span className="section-num">04</span>
          <h2 className="section-title">Education & Certs</h2>
          <div className="section-line"/>
        </div></Fade>
        <div className="edu-certs">
          <Fade delay={0.1}>
            <div>
              <div className="sub-heading" style={{color:"var(--accent2)"}}>Education</div>
              <div className="edu-card">
                <div className="edu-degree">M.Sc. Computer & Systems Engineering</div>
                <div className="edu-school">Technische Universität Ilmenau</div>
                <div className="edu-year">OCT 2025 – Present · Ilmenau, Germany</div>
                <div className="edu-note">Focus: Advanced data analytics, machine learning systems, intelligent data engineering</div>
              </div>
              <div className="edu-card">
                <div className="edu-degree">B.Sc. Computer Science</div>
                <div className="edu-school">SZABIST University</div>
                <div className="edu-year">JAN 2019 – FEB 2023 · Pakistan</div>
                <div className="edu-note">Database Systems, Statistics for CS, AI, Web Technologies, Data Structures, Digital Image Processing</div>
              </div>
            </div>
          </Fade>
          <Fade delay={0.2}>
            <div>
              <div className="sub-heading" style={{color:"var(--accent3)"}}>Certifications</div>
              {[
                { icon:"🎓", name:"Google Data Analytics Professional Certificate", issuer:"Coursera · 2022" },
                { icon:"☁️", name:"Oracle Certified AI Foundation Associate", issuer:"Oracle · 2024" },
                { icon:"⚡", name:"Node.js – The Complete Guide (MVC, REST APIs, GraphQL)", issuer:"Udemy · 2024" },
              ].map(c => (
                <div key={c.name} className="cert-card">
                  <div className="cert-icon">{c.icon}</div>
                  <div><div className="cert-name">{c.name}</div><div className="cert-issuer">{c.issuer}</div></div>
                </div>
              ))}
            </div>
          </Fade>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section section--alt">
        <Fade><div className="section-header">
          <span className="section-num">05</span>
          <h2 className="section-title">Contact</h2>
          <div className="section-line"/>
        </div></Fade>
        <div className="contact-grid">
          <Fade delay={0.1}>
            <div>
              <div className="contact-lead">Let's build something <span>remarkable</span> together.</div>
              <p className="contact-p">Open to data analyst roles, ML engineering positions, and full-stack development opportunities — especially in Germany.</p>
              <div className="contact-links">
                {[
                  { icon:"✉", label:"hammadnaseer2230@gmail.com", href:"mailto:hammadnaseer2230@gmail.com" },
                  { icon:"in", label:"linkedin.com/in/6hammad9", href:"https://linkedin.com/in/6hammad9" },
                  { icon:"gh", label:"github.com/6hammad9", href:"https://github.com/6hammad9" },
                  { icon:"📞", label:"+49 1525 2067067", href:"tel:+4915252067067" },
                ].map(l => (
                  <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="c-link">
                    <div className="c-icon">{l.icon}</div>{l.label}
                  </a>
                ))}
              </div>
            </div>
          </Fade>
          <Fade delay={0.2}>
            <div className="form">
              {[["Name","Your name","text"],["Email","your@email.com","email"],["Subject","Job opportunity / Collaboration...","text"]].map(([lbl,ph,type]) => (
                <div key={lbl} className="form-grp">
                  <label className="form-lbl">{lbl}</label>
                  <input type={type} className="form-inp" placeholder={ph}/>
                </div>
              ))}
              <div className="form-grp">
                <label className="form-lbl">Message</label>
                <textarea className="form-ta" placeholder="Tell me about the opportunity..."/>
              </div>
              <button className="btn-fill" style={{textAlign:"center"}} onClick={() => alert("Please send your message directly to hammadnaseer2230@gmail.com")}>
                Send Message
              </button>
            </div>
          </Fade>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-copy">© 2025 <span>Raja Hammad Naseer</span> · Built with intention.</div>
        <div className="footer-links">
          <a href="https://github.com/6hammad9" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://linkedin.com/in/6hammad9" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="mailto:hammadnaseer2230@gmail.com">Email</a>
        </div>
      </footer>
    </div>
  );
}

function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = activeFilter === "All"
    ? projects
    : projects.filter(p => p.category === activeFilter);

  return (
    <div className="projects-page page-enter">
      <Fade>
        <div className="projects-page-header">
          <div className="pg-eyebrow">My Work</div>
          <h1 className="pg-title">Project <span>Showcase</span></h1>
          <p className="pg-desc">A collection of AI, data analytics, and full-stack projects — hover each card, then click to flip and explore the details.</p>
        </div>
      </Fade>

      <Fade delay={0.1}>
        <div className="filter-tabs">
          {CATEGORIES.map(c => (
            <button key={c} className={`ftab${activeFilter === c ? " active" : ""}`} onClick={() => setActiveFilter(c)}>{c}</button>
          ))}
        </div>
      </Fade>

      <div className="flip-grid">
        {filtered.map((project, i) => (
          <FlipCard key={project.id} project={project} delay={i * 0.08} />
        ))}
      </div>

      <footer style={{marginTop: 80}}>
        <div className="footer-copy">© 2025 <span>Raja Hammad Naseer</span></div>
        <div className="footer-links">
          <a href="https://github.com/6hammad9" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://linkedin.com/in/6hammad9" target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
      </footer>
    </div>
  );
}

/* ─────────────────────────────────────────────
   APP ROOT
───────────────────────────────────────────── */
export default function App() {
  return (
    <>
      <style>{css}</style>
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
        </Routes>
      </Router>
    </>
  );
}
