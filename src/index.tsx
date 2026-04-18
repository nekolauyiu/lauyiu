import { Hono } from 'hono'

const app = new Hono()

// ─── Color Palette ────────────────────────────────────────────────────────────
const BG       = '#E4D2CC'
const BG_LIGHT = '#F0E6E2'
const BG_DARK  = '#C8B0A8'
const TEXT_D   = '#3d2b24'
const TEXT_M   = '#7a5a52'
const ACCENT   = '#a07060'

// ─── Shared styles ────────────────────────────────────────────────────────────
const BASE_CSS = `
  @font-face {
    font-family: 'ZoomlaXiangsu';
    src: url('/static/fonts/ZoomlaXiangsu.otf') format('opentype');
    font-weight: normal; font-style: normal; font-display: swap;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; }
  body {
    background: ${BG};
    font-family: 'Noto Serif SC', serif;
    color: ${TEXT_D};
    min-height: 100vh;
  }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: ${BG_LIGHT}; }
  ::-webkit-scrollbar-thumb { background: ${BG_DARK}; border-radius: 3px; }
  a { text-decoration: none; color: inherit; }
  button { cursor: pointer; font-family: 'Noto Serif SC', serif; }
  input, textarea, select { font-family: 'Noto Serif SC', serif; }
`

// ─── Layout shell ─────────────────────────────────────────────────────────────
function shell(title: string, active: string, body: string, script = '') {
  return /* html */`<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/png" href="/static/favicon.png">
  <title>${title} · neko</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&family=Noto+Serif+SC:wght@300;400;500&display=swap" media="print" onload="this.media='all'">
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&family=Noto+Serif+SC:wght@300;400;500&display=swap"></noscript>
  <style>
    ${BASE_CSS}

    /* ── Layout ── */
    .wrap { display: flex; min-height: 100vh; }

    /* ── Sidebar ── */
    .sidebar {
      width: 200px; min-width: 200px;
      position: fixed; top: 0; left: 0; height: 100vh;
      display: flex; flex-direction: column;
      background: rgba(255,255,255,0.18);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      border-right: 1px solid rgba(255,255,255,0.38);
      z-index: 100;
    }
    .sb-brand {
      padding: 52px 28px 28px;
      border-bottom: 1px solid rgba(160,112,96,0.14);
      text-align: center;
    }
    .sb-brand h1 {
      font-family: 'French Script MT', 'Palatino Linotype', cursive;
      font-style: italic;
      font-size: 36px;
      letter-spacing: 2px;
      color: ${TEXT_D};
      line-height: 1;
      cursor: pointer;
      user-select: none;
      transition: opacity .2s;
    }
    .sb-brand h1:hover { opacity: .75; }
    .sb-nav { flex: 1; padding: 28px 0; }
    .sb-link {
      display: block;
      padding: 13px 28px;
      font-size: 8px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      font-family: 'Press Start 2P', monospace;
      color: ${TEXT_M};
      position: relative;
      transition: color .25s, background .25s;
      line-height: 1.8;
    }
    .sb-link:hover, .sb-link.on {
      color: ${TEXT_D};
      background: rgba(160,112,96,0.09);
    }
    .sb-link.on::before {
      content: '';
      position: absolute; left: 0; top: 50%;
      transform: translateY(-50%);
      width: 3px; height: 18px;
      background: ${ACCENT};
      border-radius: 0 2px 2px 0;
    }
    .sb-foot {
      padding: 20px 28px 28px;
      border-top: 1px solid rgba(160,112,96,0.14);
      font-family: 'Press Start 2P', monospace;
      font-size: 7px;
      color: ${TEXT_M};
      line-height: 2.2;
      letter-spacing: .4px;
    }
    .sb-foot .copy { opacity: .9; }
    .sb-foot .sub  { opacity: .65; font-size: 6px; margin-top: 4px; }
    /* ── Pixel font for English labels ── */
    .px { font-family: 'Press Start 2P', monospace; }

    /* ── Main ── */
    .main {
      flex: 1;
      margin-left: 200px;
      padding: 52px 52px 80px;
      min-height: 100vh;
    }
    .ph { margin-bottom: 36px; }
    .ph-title {
      font-family: 'Press Start 2P', monospace;
      font-size: 16px;
      color: ${TEXT_D};
      letter-spacing: 1px;
      line-height: 1.6;
    }
    .ph-sub {
      font-size: 9px;
      font-family: 'Press Start 2P', monospace;
      color: ${TEXT_M};
      letter-spacing: 1px;
      margin-top: 8px;
      line-height: 1.8;
    }

    /* ── Cards ── */
    .card {
      background: rgba(255,255,255,0.32);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.52);
      border-radius: 18px;
      padding: 28px 30px;
      margin-bottom: 16px;
      transition: transform .25s, box-shadow .25s;
      max-width: 66.67%;
      word-break: break-word;
      overflow-wrap: break-word;
    }
    .card:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(61,43,36,.09); }
    .card-click { cursor: pointer; }

    /* ── Trip card ── */
    .tc-date {
      font-size: 7px; letter-spacing: 1.5px;
      font-family: 'Press Start 2P', monospace;
      color: ${TEXT_M}; text-transform: uppercase;
    }
    .tc-title {
      font-family: 'Noto Serif SC', 'SimSun', serif;
      font-size: 17px; color: ${TEXT_D};
      font-weight: 600;
      margin: 7px 0 9px;
      line-height: 1.6;
    }
    .tc-body {
      font-family: 'Noto Serif SC', 'SimSun', serif;
      font-size: 12px; color: ${TEXT_M};
      line-height: 1.8;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      word-break: break-word;
      overflow-wrap: break-word;
    }
    .tc-foot {
      display: flex; align-items: center;
      gap: 10px; margin-top: 13px; flex-wrap: wrap;
    }
    .pill {
      background: rgba(160,112,96,.13);
      color: ${ACCENT};
      padding: 3px 11px;
      border-radius: 20px;
      font-size: 11px; letter-spacing: .8px;
    }
    .tc-time {
      margin-left: auto;
      font-size: 7px;
      font-family: 'Press Start 2P', monospace;
      color: ${ACCENT}; opacity: .8;
    }
    .tc-img-badge {
      display: inline-flex; align-items: center; gap: 4px;
      font-size: 10px; color: ${ACCENT}; opacity: .75;
      background: rgba(160,112,96,.1);
      border-radius: 20px;
      padding: 2px 9px 2px 6px;
      letter-spacing: .3px;
    }

    /* ── Form ── */
    .fg { margin-bottom: 20px; }
    .fg label {
      display: block;
      font-size: 7px; letter-spacing: 1.5px;
      text-transform: uppercase; color: ${TEXT_M};
      font-family: 'Press Start 2P', monospace;
      margin-bottom: 10px;
      line-height: 1.8;
    }
    .fg input, .fg textarea, .fg select {
      width: 100%;
      padding: 12px 16px;
      background: rgba(255,255,255,.5);
      border: 1px solid rgba(160,112,96,.28);
      border-radius: 11px;
      font-size: 14px; color: ${TEXT_D};
      outline: none;
      transition: border-color .25s, box-shadow .25s, background .25s;
    }
    .fg input[type=date] {
      font-family: 'Press Start 2P', monospace;
      font-size: 9px;
      letter-spacing: 1px;
    }
    #authNewPwd::placeholder, #authNewPwd2::placeholder {
      font-family: 'Press Start 2P', monospace;
      font-size: 7px;
      letter-spacing: .5px;
      color: ${TEXT_M};
      opacity: .7;
    }
    .fg textarea {
      min-height: 240px; resize: vertical; line-height: 1.9;
    }
    .fg input:focus, .fg textarea:focus, .fg select:focus {
      border-color: ${ACCENT};
      background: rgba(255,255,255,.7);
      box-shadow: 0 0 0 3px rgba(160,112,96,.12);
    }

    /* ── Buttons ── */
    .btn {
      padding: 11px 22px; border-radius: 8px;
      font-size: 7px; letter-spacing: 1.5px;
      font-family: 'Press Start 2P', monospace;
      border: none; transition: all .25s;
      line-height: 1.6;
    }
    .btn-p { background: ${ACCENT}; color: #fff; }
    .btn-p:hover { background: ${TEXT_D}; transform: translateY(-1px); box-shadow: 0 5px 14px rgba(61,43,36,.2); }
    .btn-s { background: rgba(160,112,96,.15); color: ${TEXT_M}; }
    .btn-s:hover { background: rgba(160,112,96,.28); }
    .btn-d { background: rgba(200,70,70,.08); color: #b04040; border: 1px solid rgba(200,70,70,.25); }
    .btn-d:hover { background: rgba(200,70,70,.17); }
    .btn-row { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }

    /* ── FAB ── */
    .fab {
      position: fixed; bottom: 36px; right: 44px;
      width: 52px; height: 52px; border-radius: 50%;
      background: ${ACCENT}; color: #fff;
      border: none; font-size: 24px;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 6px 20px rgba(160,112,96,.42);
      transition: all .25s; z-index: 50;
    }
    .fab:hover { background: ${TEXT_D}; transform: scale(1.1) translateY(-2px); }
    .fab.hidden { display: none; }

    /* ── Modal ── */
    .ov {
      position: fixed; inset: 0;
      background: rgba(61,43,36,.28);
      backdrop-filter: blur(5px);
      display: flex; align-items: center; justify-content: center;
      z-index: 200; opacity: 0; pointer-events: none;
      transition: opacity .28s;
    }
    .ov.show { opacity: 1; pointer-events: all; }
    .mbox {
      background: #ede4df;
      border-radius: 18px;
      padding: 36px 36px 32px;
      width: 540px; max-width: 92vw;
      max-height: 88vh; overflow-y: auto;
      box-shadow: 0 24px 70px rgba(61,43,36,.18);
      transform: translateY(18px);
      transition: transform .28s;
    }
    .ov.show .mbox { transform: translateY(0); }
    .mbox h3 {
      font-family: 'Press Start 2P', monospace;
      font-size: 10px; color: ${TEXT_D};
      margin-bottom: 26px;
      letter-spacing: 1px;
      line-height: 1.8;
    }

    /* ── Auth modal (password) ── */
    .auth-box {
      width: 340px; max-width: 92vw;
    }
    .auth-box .auth-hint {
      display: none;
    }
    .auth-err {
      font-size: 8px; color: #b04040;
      font-family: 'Press Start 2P', monospace;
      margin-top: 12px; display: none;
      line-height: 1.8;
    }
    /* admin panel link */
    .admin-link {
      font-size: 8px;
      font-family: 'Press Start 2P', monospace;
      color: ${TEXT_M};
      opacity: .5;
      cursor: pointer;
      margin-top: 14px;
      display: inline-block;
      letter-spacing: .5px;
      transition: opacity .2s;
    }
    .admin-link:hover { opacity: 1; }

    /* ── Detail view ── */
    .det-head {
      display: flex; justify-content: space-between;
      align-items: flex-start; margin-bottom: 18px;
    }
    .det-emoji { font-size: 26px; }
    .det-body {
      font-family: 'Noto Serif SC', 'SimSun', serif;
      font-size: 13px; line-height: 2.0;
      color: ${TEXT_D}; white-space: pre-wrap;
      word-break: break-word;
      overflow-wrap: break-word;
    }
    hr.div {
      border: none;
      border-top: 1px solid rgba(160,112,96,.22);
      margin: 20px 0;
    }

    /* ── Empty ── */
    .empty { text-align: center; padding: 72px 0; color: ${TEXT_M}; }
    .empty .ei { font-size: 44px; opacity: .45; margin-bottom: 14px; }
    .empty p  { font-size: 13px; letter-spacing: 1px; }

    /* ── Toast ── */
    .toast {
      position: fixed; bottom: 28px; left: 50%;
      transform: translateX(-50%) translateY(70px);
      background: ${TEXT_D}; color: #fff;
      padding: 11px 26px; border-radius: 22px;
      font-family: 'Press Start 2P', monospace;
      font-size: 8px; letter-spacing: 1px;
      z-index: 999; opacity: 0;
      transition: all .35s;
    }
    .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

    /* ── Upload button ── */
    /* ── Emoji picker ── */
    .emoji-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 3px;
      background: rgba(160,112,96,.06);
      border-radius: 12px;
      padding: 8px;
    }
    .emoji-grid span {
      font-size: 22px;
      width: 38px; height: 38px;
      display: flex; align-items: center; justify-content: center;
      border-radius: 8px;
      cursor: pointer;
      transition: background .12s, transform .12s;
      user-select: none;
      border: 2px solid transparent;
    }
    .emoji-grid span:hover { background: rgba(160,112,96,.22); transform: scale(1.18); }
    .emoji-grid span.selected {
      background: rgba(160,112,96,.32);
      border-color: ${ACCENT};
      transform: scale(1.12);
    }
    .upload-btn {
      display: inline-block;
      padding: 9px 18px;
      background: rgba(160,112,96,.15);
      color: ${TEXT_M};
      border-radius: 9px;
      font-size: 7px;
      font-family: 'Press Start 2P', monospace;
      letter-spacing: 1px;
      cursor: pointer;
      transition: background .2s;
      line-height: 1.6;
    }
    .upload-btn:hover { background: rgba(160,112,96,.28); }
    .img-preview-wrap {
      position: relative; display: inline-block;
    }
    .img-preview-wrap .rm-img {
      position: absolute; top: -6px; right: -6px;
      width: 18px; height: 18px; border-radius: 50%;
      background: rgba(61,43,36,.65); color: #fff;
      font-size: 11px; line-height: 18px; text-align: center;
      cursor: pointer; border: none; padding: 0;
      display: flex; align-items: center; justify-content: center;
    }
    /* ── Image grid ── */
    .img-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
      gap: 9px;
      margin-top: 14px;
    }
    .img-grid img {
      width: 100%;
      max-height: 340px;
      object-fit: contain;
      background: rgba(160,112,96,.06);
      border-radius: 10px;
      cursor: pointer;
      transition: transform .2s, box-shadow .2s;
      border: 1px solid rgba(255,255,255,.5);
      display: block;
    }
    .img-grid img:hover { transform: scale(1.04); box-shadow: 0 6px 18px rgba(61,43,36,.15); }
    /* ── Image carousel (view modal, >2 images) ── */
    .img-carousel {
      position: relative;
      margin-top: 14px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .img-carousel-track {
      display: flex;
      gap: 9px;
      overflow: hidden;
      flex: 1;
      scroll-behavior: smooth;
    }
    .img-carousel-track img {
      flex: 0 0 calc(33.333% - 6px);
      max-height: 260px;
      object-fit: contain;
      background: rgba(160,112,96,.06);
      border-radius: 10px;
      cursor: pointer;
      transition: transform .2s, box-shadow .2s;
      border: 1px solid rgba(255,255,255,.5);
    }
    .img-carousel-track img:hover { transform: scale(1.04); box-shadow: 0 6px 18px rgba(61,43,36,.15); }
    .carousel-btn {
      flex: 0 0 36px;
      width: 36px; height: 36px;
      border-radius: 50%;
      border: none;
      background: ${ACCENT};
      color: #fff;
      font-size: 16px;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 3px 10px rgba(160,112,96,.35);
      transition: background .2s, transform .2s;
      flex-shrink: 0;
      position: relative;
      z-index: 2;
      -webkit-tap-highlight-color: transparent;
      user-select: none;
    }
    .carousel-btn:hover { background: ${TEXT_D}; transform: scale(1.08); }
    .carousel-btn:disabled { opacity: .35; cursor: default; transform: none; }
    .carousel-counter { text-align:center; font-family:'Press Start 2P',monospace; font-size:7px; color:${TEXT_M}; margin-top:6px; letter-spacing:1px; }
    /* ── Link list ── */
    .link-list { display: flex; flex-direction: column; gap: 8px; margin-top: 14px; }
    .link-item {
      display: flex; align-items: center; gap: 10px;
      background: rgba(255,255,255,.38);
      border: 1px solid rgba(255,255,255,.55);
      border-radius: 10px;
      padding: 10px 14px;
      font-size: 13px; color: ${TEXT_D};
      transition: background .2s;
      text-decoration: none;
    }
    .link-item:hover { background: rgba(255,255,255,.62); }
    .link-label { font-weight: 500; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .link-url { font-size: 11px; color: ${TEXT_M}; opacity: .72; max-width: 160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    /* ── Link rows in form ── */
    .link-row { display: flex; gap: 8px; margin-bottom: 8px; align-items: center; }
    .link-row input { flex: 1; margin-bottom: 0; }
    .lrow-del {
      flex-shrink: 0; background: none; border: none;
      color: ${TEXT_M}; font-size: 20px; line-height: 1;
      opacity: .45; transition: opacity .2s; padding: 0 4px;
    }
    .lrow-del:hover { opacity: 1; color: #b04040; }
    /* ── Lightbox ── */
    .lb {
      position: fixed; inset: 0;
      background: rgba(25,14,10,.84);
      display: flex; align-items: center; justify-content: center;
      z-index: 500; opacity: 0; pointer-events: none;
      transition: opacity .25s;
    }
    .lb.show { opacity: 1; pointer-events: all; }
    .lb img { max-width: 92vw; max-height: 88vh; border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,.5); }
    .lb-close {
      position: absolute; top: 18px; right: 22px;
      background: none; border: none;
      color: #fff; font-size: 30px; opacity: .65;
      transition: opacity .2s; line-height: 1;
    }
    .lb-close:hover { opacity: 1; }
    /* ── Responsive ── */
    @media (max-width: 700px) {
      .sidebar { width: 160px; min-width: 160px; }
      .main { margin-left: 160px; padding: 32px 20px 72px; }
    }
  </style>
</head>
<body>
<div class="wrap">

  <!-- Sidebar -->
  <nav class="sidebar">
    <div class="sb-brand">
      <h1 id="nekoBtn" title="管理员入口">neko</h1>

    </div>
    <div class="sb-nav">
      <a class="sb-link ${active==='diary'?'on':''}" href="/">Diary</a>
      <a class="sb-link ${active==='contact'?'on':''}" href="/contact">Contact</a>
    </div>
    <div class="sb-foot">
      <div class="copy">@2026 lauyiu</div>
      <div class="sub">Give AI to AI,<br>return humanity<br>to humanity.</div>
    </div>
  </nav>

  <!-- Main -->
  <main class="main">
    ${body}
  </main>

</div>

<!-- ── Auth Modal ── -->
<div class="ov" id="authOv">
  <div class="mbox auth-box">
    <h3 id="authTitle">UNLOCK</h3>
    <p class="auth-hint" id="authHint">输入管理员密码以解锁编辑功能</p>
    <div class="fg">
      <label id="authLabel">PASSWORD</label>
      <input type="password" id="authPwd" placeholder="••••••••" autocomplete="current-password">
    </div>
    <div id="authNewPwdWrap" style="display:none">
      <div class="fg">
        <label>NEW PASSWORD</label>
        <input type="password" id="authNewPwd" placeholder="New password">
      </div>
      <div class="fg">
        <label>CONFIRM</label>
        <input type="password" id="authNewPwd2" placeholder="Enter the new password again">
      </div>
    </div>
    <div class="btn-row" style="margin-top:18px">
      <button class="btn btn-p" id="authOkBtn">OK</button>
      <button class="btn btn-s" onclick="closeAuth()">CANCEL</button>
    </div>
    <div class="auth-err" id="authErr">密码错误，请重试</div>
    <span class="admin-link" id="changePwdLink" onclick="switchToChangePwd()">Modify</span>
  </div>
</div>

<div id="toast" class="toast"></div>
<script>
  function showToast(m,d=2400){
    const t=document.getElementById('toast');
    t.textContent=m; t.classList.add('show');
    setTimeout(()=>t.classList.remove('show'),d);
  }

  // ── Auth state ──
  // check token expiry on load
  (function(){
    const exp = parseInt(localStorage.getItem('neko_token_exp')||'0');
    if(exp && Date.now() > exp){
      localStorage.removeItem('neko_token');
      localStorage.removeItem('neko_token_exp');
    }
  })();
  let _token = localStorage.getItem('neko_token') || '';
  let _authMode = 'login'; // 'login' | 'changepwd'

  function isAuthed(){ return !!_token; }

  function handleAuthExpired(){
    _token='';
    localStorage.removeItem('neko_token');
    localStorage.removeItem('neko_token_exp');
    applyAuthUI();
    load();
    showToast('登录已过期，请重新解锁');
  }

  function applyAuthUI(){
    // FAB always visible regardless of auth state
    // hide edit/delete buttons in view modal when not authed
    const editBtn = document.getElementById('viewEditBtn');
    const delBtn  = document.getElementById('viewDelBtn');
    const pinBtn  = document.getElementById('viewPinBtn');
    if(editBtn) editBtn.style.display = isAuthed() ? '' : 'none';
    if(delBtn)  delBtn.style.display  = isAuthed() ? '' : 'none';
    if(pinBtn)  pinBtn.style.display  = isAuthed() ? '' : 'none';
    // edit modal delete button: only show when editing existing entry
    const editDelBtn = document.getElementById('editDelBtn');
    if(editDelBtn){
      const eid = document.getElementById('eid');
      editDelBtn.style.display = (isAuthed() && eid && eid.value) ? '' : 'none';
    }
  }

  // ── Click neko → open auth modal ──
  document.getElementById('nekoBtn').addEventListener('click', function(){
    if(isAuthed()){
      // already logged in → logout
      _token=''; localStorage.removeItem('neko_token');
      applyAuthUI();
      load();
      showToast('Logout');
    } else {
      openLogin();
    }
  });

  function openLogin(){
    _authMode='login';
    document.getElementById('authTitle').textContent='UNLOCK';
    document.getElementById('authHint').textContent='';
    document.getElementById('authLabel').textContent='PASSWORD';
    document.getElementById('authPwd').value='';
    document.getElementById('authErr').style.display='none';
    document.getElementById('authNewPwdWrap').style.display='none';
    document.getElementById('changePwdLink').style.display='inline-block';
    document.getElementById('authOkBtn').textContent='OK';
    document.getElementById('authOv').classList.add('show');
    setTimeout(()=>document.getElementById('authPwd').focus(),200);
  }

  function switchToChangePwd(){
    _authMode='changepwd';
    document.getElementById('authTitle').textContent='CHANGE PWD';
    document.getElementById('authHint').textContent='';
    document.getElementById('authLabel').textContent='OLD PASSWORD';
    document.getElementById('authPwd').value='';
    document.getElementById('authErr').style.display='none';
    document.getElementById('authNewPwdWrap').style.display='block';
    document.getElementById('changePwdLink').style.display='none';
    document.getElementById('authOkBtn').textContent='CONFIRM';
  }

  function closeAuth(){
    document.getElementById('authOv').classList.remove('show');
    document.getElementById('authErr').style.display='none';
  }

  document.getElementById('authPwd').addEventListener('keydown',function(e){
    if(e.key==='Enter') document.getElementById('authOkBtn').click();
  });

  document.getElementById('authOkBtn').addEventListener('click', async function(){
    const pwd = document.getElementById('authPwd').value;
    if(!pwd){ document.getElementById('authErr').textContent='请输入密码'; document.getElementById('authErr').style.display='block'; return; }

    if(_authMode==='login'){
      // call /api/auth
      const r = await fetch('/api/auth',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({password:pwd})
      });
      if(r.ok){
        const d = await r.json();
        _token = d.token;
        localStorage.setItem('neko_token', _token);
        localStorage.setItem('neko_token_exp', String(Date.now() + 60*60*1000));
        setTimeout(function(){ _token=''; localStorage.removeItem('neko_token'); localStorage.removeItem('neko_token_exp'); applyAuthUI(); showToast('登录已过期，请重新解锁'); }, 60*60*1000);
        closeAuth();
        applyAuthUI();
        load();
        showToast('已解锁 🔓');
      } else {
        document.getElementById('authErr').textContent='密码错误，请重试';
        document.getElementById('authErr').style.display='block';
      }
    } else {
      // change password
      const np = document.getElementById('authNewPwd').value;
      const np2 = document.getElementById('authNewPwd2').value;
      if(!np){ document.getElementById('authErr').textContent='新密码不能为空'; document.getElementById('authErr').style.display='block'; return; }
      if(np!==np2){ document.getElementById('authErr').textContent='两次密码不一致'; document.getElementById('authErr').style.display='block'; return; }
      const r = await fetch('/api/admin/password',{
        method:'POST',
        headers:{'Content-Type':'application/json','Authorization':'Bearer '+_token},
        body:JSON.stringify({oldPassword:pwd, newPassword:np})
      });
      if(r.ok){
        closeAuth();
        // force re-login with new password
        _token=''; localStorage.removeItem('neko_token');
        applyAuthUI();
        showToast('密码已修改，请重新登录');
      } else {
        const d = await r.json().catch(()=>({}));
        document.getElementById('authErr').textContent = d.error||'修改失败，请检查旧密码';
        document.getElementById('authErr').style.display='block';
      }
    }
  });

  // Auth overlay: clicking outside does NOT close the dialog (only CANCEL button closes it)

  // init UI on page load - verify token validity with server
  applyAuthUI();
  (async function(){
    if(_token){
      try{
        const vr=await fetch('/api/verify',{headers:{'Authorization':'Bearer '+_token}});
        const vd=await vr.json();
        if(!vd.ok){
          // token expired on server, clear local state silently
          _token=''; localStorage.removeItem('neko_token'); localStorage.removeItem('neko_token_exp');
          applyAuthUI(); load();
        }
      }catch(e){ /* network error, keep token for now */ }
    }
  })();

  ${script}
</script>
</body>
</html>`
}

// ─── In-memory store (dev / no-KV fallback) ───────────────────────────────────
type Entry = {
  id: string
  date: string
  title: string
  content: string
  emoji: string
  tags: string[]
  images: string[]
  links: { url: string; label: string }[]
  createdAt: string
  updatedAt: string
}

const memStore: Record<string, Entry> = {}

async function getEntries(kv: KVNamespace | undefined): Promise<Entry[]> {
  if (kv) {
    const list = await kv.list({ prefix: 'trip:' })
    // Parallel fetch all entries instead of sequential (N+1 → 2 round trips)
    const values = await Promise.all(list.keys.map(k => kv.get(k.name)))
    const all: Entry[] = values.filter(Boolean).map(v => JSON.parse(v!))
    return all.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return (b.createdAt || b.date).localeCompare(a.createdAt || a.date)
    })
  }
  return Object.values(memStore).sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return (b.createdAt || b.date).localeCompare(a.createdAt || a.date)
  })
}

async function getEntry(kv: KVNamespace | undefined, id: string): Promise<Entry | null> {
  if (kv) {
    const v = await kv.get(`trip:${id}`)
    return v ? JSON.parse(v) : null
  }
  return memStore[id] ?? null
}

async function putEntry(kv: KVNamespace | undefined, e: Entry): Promise<void> {
  if (kv) { await kv.put(`trip:${e.id}`, JSON.stringify(e)); return }
  memStore[e.id] = e
}

async function delEntry(kv: KVNamespace | undefined, id: string): Promise<void> {
  if (kv) { await kv.delete(`trip:${id}`); return }
  delete memStore[id]
}

// ─── App ──────────────────────────────────────────────────────────────────────
type Env = { DIARY_KV?: KVNamespace; DIARY_PWD?: string }
const hono = new Hono<{ Bindings: Env }>()

// ── Default password fallback ──
const DEFAULT_PWD = 'neko2026'

async function getPassword(kv: KVNamespace | undefined): Promise<string> {
  if (kv) {
    const p = await kv.get('admin:password')
    if (p) return p
  }
  return DEFAULT_PWD
}

// ── Token store (in-memory, session-level) ──
function generateToken(): string {
  const arr = new Uint8Array(24)
  crypto.getRandomValues(arr)
  return Array.from(arr).map(b => b.toString(16).padStart(2,'0')).join('')
}

// ── In-memory token store (fallback when KV is not available) ──
const memTokens = new Set<string>()

// ── Token stored in KV so all Worker instances share state ──
async function createToken(kv: KVNamespace | undefined): Promise<string> {
  const token = generateToken()
  if (kv) {
    // store token with 60-min TTL
    await kv.put('token:' + token, '1', { expirationTtl: 3600 })
  } else {
    // no KV: store in-memory, expire after 1 hour
    memTokens.add(token)
    setTimeout(() => memTokens.delete(token), 60 * 60 * 1000)
  }
  return token
}

async function verifyToken(kv: KVNamespace | undefined, token: string): Promise<boolean> {
  if (!token) return false
  if (kv) {
    const val = await kv.get('token:' + token)
    return val === '1'
  }
  // no KV: fall back to in-memory set
  return memTokens.has(token)
}

// ── Auth middleware helper ──
function extractToken(req: Request): string {
  const auth = req.headers.get('Authorization') || ''
  return auth.startsWith('Bearer ') ? auth.slice(7) : ''
}

// ── Token verify endpoint ──
hono.get('/api/verify', async (c) => {
  const kv = (c.env as Env)?.DIARY_KV
  const token = extractToken(c.req.raw)
  const ok = await verifyToken(kv, token)
  return c.json({ ok })
})

// ── Auth endpoint ──
hono.post('/api/auth', async (c) => {
  const kv = (c.env as Env)?.DIARY_KV
  const { password } = await c.req.json<{ password: string }>()
  const correctPwd = await getPassword(kv)
  if (password !== correctPwd) {
    return c.json({ error: 'Invalid password' }, 401)
  }
  const token = await createToken(kv)
  return c.json({ token })
})

// ── Change password endpoint ──
hono.post('/api/admin/password', async (c) => {
  const kv = (c.env as Env)?.DIARY_KV
  const token = extractToken(c.req.raw)
  if (!await verifyToken(kv, token)) return c.json({ error: 'Unauthorized' }, 401)
  const { oldPassword, newPassword } = await c.req.json<{ oldPassword: string; newPassword: string }>()
  const correctPwd = await getPassword(kv)
  if (oldPassword !== correctPwd) return c.json({ error: '旧密码错误' }, 403)
  if (!newPassword || newPassword.length < 6) return c.json({ error: '新密码至少6位' }, 400)
  if (kv) {
    await kv.put('admin:password', newPassword)
  }
  return c.json({ ok: true })
})

// ── Diary list (home)
hono.get('/', (c) => {
  const body = /* html */`
    <div class="ph">
      <div class="ph-title">MY DIARY</div>
      <div class="ph-sub" id="ds"></div>
    </div>
    <div id="list"><div class="empty"><div class="ei">📖</div><p>加载中…</p></div></div>
    <button class="fab" id="fabBtn" title="New Entry">+</button>

    <!-- New / Edit modal -->
    <div class="ov" id="editOv">
      <div class="mbox">
        <h3 id="editTitle">NEW ENTRY</h3>
        <input type="hidden" id="eid">
        <div class="fg">
          <label>DATE</label>
          <input type="date" id="edate">
        </div>
        <div class="fg">
          <label>TITLE</label>
          <input type="text" id="etitle" placeholder="标题（选填）" maxlength="80">
        </div>
        <div class="fg">
          <label>CONTENT</label>
          <textarea id="econtent" placeholder="记录今天的行程、见闻与思考…"></textarea>
        </div>
        <div class="fg">
          <input type="hidden" id="eemoji" value="📖">
          <label>ICON <span style="font-family:sans-serif;font-size:9px;opacity:.6;letter-spacing:0">— 点击选择帖子图标（显示在标题前）</span></label>
          <div id="emojiCurrent" style="font-size:28px;margin-bottom:8px;line-height:1">📖</div>
          <div class="emoji-grid" id="emojiGrid">
            <span>😊</span><span>😂</span><span>🥰</span><span>😍</span><span>🤩</span>
            <span>😎</span><span>🥳</span><span>😢</span><span>😭</span><span>😤</span>
            <span>🤔</span><span>😴</span><span>🤗</span><span>😋</span><span>🤣</span>
            <span>❤️</span><span>🧡</span><span>💛</span><span>💚</span><span>💙</span>
            <span>💜</span><span>🖤</span><span>🤍</span><span>💕</span><span>💔</span>
            <span>🔥</span><span>⭐</span><span>🌈</span><span>🌸</span><span>🌊</span>
            <span>🌙</span><span>☀️</span><span>⛅</span><span>🌺</span><span>🍀</span>
            <span>🎉</span><span>🎊</span><span>🎵</span><span>🎨</span><span>🎮</span>
            <span>📖</span><span>✍️</span><span>📷</span><span>💡</span><span>💬</span>
            <span>✈️</span><span>🌍</span><span>🏔️</span><span>🚂</span><span>🚗</span>
            <span>🍜</span><span>🍵</span><span>☕</span><span>🍰</span><span>🍕</span>
            <span>💪</span><span>🏠</span><span>🐱</span><span>🐶</span><span>🦋</span>
          </div>
        </div>
        <div class="fg">
          <label>UPLOAD IMAGE</label>
          <div id="imgPreview" class="img-grid" style="margin-bottom:8px"></div>
          <label class="upload-btn" for="eimages">+ SELECT IMAGES</label>
          <input type="file" id="eimages" accept="image/*" multiple style="display:none">
        </div>
        <div class="fg">
          <label>VIDEO LINK</label>
          <div id="elinks"></div>
          <button class="btn btn-s" style="margin-top:8px;padding:8px 14px;font-size:6px" type="button" onclick="addLinkRow()">+ ADD LINK</button>
        </div>
        <div class="btn-row" style="margin-top:22px">
          <button class="btn btn-p" onclick="saveEntry()">SAVE</button>
          <button class="btn btn-s" onclick="closeEdit()">CANCEL</button>
          <button class="btn btn-d" id="editDelBtn" onclick="deleteCurrent()" style="margin-left:auto;display:none">DELETE</button>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <div class="lb" id="lb">
      <button class="lb-close">✕</button>
      <img src="" alt="">
    </div>

    <!-- View modal -->
    <div class="ov" id="viewOv">
      <div class="mbox">
        <div class="det-head">
          <div>
            <div class="tc-date" id="vdate"></div>
            <div style="font-family:'Noto Serif SC','SimSun',serif;font-size:20px;font-weight:600;color:${TEXT_D};margin-top:8px;line-height:1.6" id="vtitle"></div>
          </div>
          <div class="det-emoji" id="vemoji"></div>
        </div>
        <hr class="div">
        <div class="det-body" id="vcontent"></div>
        <div id="vtags" style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap"></div>
        <div id="vimages"></div>
        <div id="vlinks" class="link-list"></div>
        <hr class="div">
        <div class="btn-row">
          <button class="btn btn-p" id="viewEditBtn" onclick="editCurrent()">EDIT</button>
          <button class="btn btn-s" id="viewPinBtn" onclick="togglePin()" style="display:none">📌 PIN</button>
          <button class="btn btn-d" id="viewDelBtn" onclick="deleteCurrent()">DELETE</button>
          <button class="btn btn-s" onclick="closeView()">CLOSE</button>
        </div>
      </div>
    </div>
  `

  const script = /* js */`
    // date display
    const mo=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const nd=new Date();
    document.getElementById('ds').textContent=mo[nd.getMonth()]+' '+nd.getDate()+', '+nd.getFullYear();
    const _pad=n=>String(n).padStart(2,'0');
    document.getElementById('edate').value=nd.getFullYear()+'-'+_pad(nd.getMonth()+1)+'-'+_pad(nd.getDate());

    let cid=null;
    let _cachedList=[];

    async function load(){
      try{
        const r=await fetch('/api/trips');
        const d=await r.json();
        _cachedList=d.entries||[];
        render(_cachedList);
      }catch(err){
        // silently handle fetch errors
      }
    }

    function addOrUpdateLocal(entry){
      // convert full entry to slim (no image data) for the list cache
      const slim=Object.assign({},entry,{imageCount:(entry.images||[]).length,images:undefined});
      delete slim.images;
      const idx=_cachedList.findIndex(e=>e.id===entry.id);
      if(idx>=0){ _cachedList[idx]=slim; }
      else { _cachedList.unshift(slim); }
      // re-sort: pinned first, then by createdAt/date desc
      _cachedList.sort(function(a,b){
        if(a.pinned&&!b.pinned) return -1;
        if(!a.pinned&&b.pinned) return 1;
        return (b.createdAt||b.date).localeCompare(a.createdAt||a.date);
      });
      render(_cachedList);
    }

    function removeLocal(id){
      _cachedList=_cachedList.filter(e=>e.id!==id);
      render(_cachedList);
    }

    function render(list){
      const el=document.getElementById('list');
      if(!el) return;
      el.innerHTML='';
      if(!list.length){
        const emp=document.createElement('div');
        emp.className='empty';
        const emojiDiv=document.createElement('div');
        emojiDiv.className='ei';
        emojiDiv.textContent='✍️';
        const msg=document.createElement('p');
        msg.style.cssText="font-family:'Press Start 2P',monospace;font-size:8px;line-height:2";
        msg.textContent='NO ENTRIES YET';
        emp.appendChild(emojiDiv);
        emp.appendChild(msg);
        el.appendChild(emp);
        return;
      }
      list.forEach(function(e){
        const card=document.createElement('div');
        card.className='card card-click';
        card.addEventListener('click',function(){view(e.id);});

        const dateDiv=document.createElement('div');
        dateDiv.className='tc-date';
        dateDiv.textContent=mo[nd.getMonth()]+' '+nd.getDate()+', '+nd.getFullYear();
        if(e.pinned){
          const pin=document.createElement('span');
          pin.style.cssText='color:#a07060;font-size:9px;margin-left:4px';
          pin.textContent='📌';
          dateDiv.appendChild(pin);
        }
        card.appendChild(dateDiv);

        const titleDiv=document.createElement('div');
        titleDiv.className='tc-title';
        titleDiv.textContent=(e.emoji||'')+' '+e.title;
        card.appendChild(titleDiv);

        const bodyDiv=document.createElement('div');
        bodyDiv.className='tc-body';
        bodyDiv.textContent=e.content;
        card.appendChild(bodyDiv);

        const foot=document.createElement('div');
        foot.className='tc-foot';
        (e.tags||[]).forEach(function(t){
          const pill=document.createElement('span');
          pill.className='pill';
          pill.textContent=t;
          foot.appendChild(pill);
        });
        const imgCnt = e.imageCount || (e.images&&e.images.length) || 0;
        if(imgCnt>0){
          const badge=document.createElement('span');
          badge.className='tc-img-badge';
          badge.textContent='🖼 '+imgCnt;
          foot.appendChild(badge);
        }
        if(isAuthed()){
          const editBtn=document.createElement('button');
          editBtn.className='btn btn-p card-edit-btn';
          editBtn.style.cssText='font-size:6px;padding:5px 10px;margin-left:auto';
          editBtn.textContent='EDIT';
          editBtn.addEventListener('click',function(ev){
            ev.stopPropagation();
            cid=e.id;
            editCurrent();
          });
          foot.appendChild(editBtn);
        }
        card.appendChild(foot);
        el.appendChild(card);
      });
    }

    // image store for current edit session
    let imgData=[];

    function renderImgPreview(){
      const box=document.getElementById('imgPreview');
      box.innerHTML=imgData.map((src,i)=>
        '<div class="img-preview-wrap">'+
        '<img src="'+src+'" style="width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:10px;cursor:pointer" onclick="openLb(this.src)">'+
        '<button class="rm-img" onclick="removeImg('+i+')">\u00d7</button>'+
        '</div>'
      ).join('');
    }

    function removeImg(i){
      imgData.splice(i,1);
      renderImgPreview();
    }

    // compress image before storing: max 1200px, quality 0.72
    function compressImg(file, cb){
      const reader=new FileReader();
      reader.onload=function(ev){
        const img=new Image();
        img.onload=function(){
          const MAX=1200;
          let w=img.width, h=img.height;
          if(w>MAX||h>MAX){
            if(w>h){ h=Math.round(h*MAX/w); w=MAX; }
            else   { w=Math.round(w*MAX/h); h=MAX; }
          }
          const canvas=document.createElement('canvas');
          canvas.width=w; canvas.height=h;
          canvas.getContext('2d').drawImage(img,0,0,w,h);
          cb(canvas.toDataURL('image/jpeg',0.72));
        };
        img.src=ev.target.result;
      };
      reader.readAsDataURL(file);
    }

    document.getElementById('eimages').addEventListener('change',function(){
      const files=[...this.files];
      let done=0;
      if(!files.length) return;
      files.forEach(f=>{
        compressImg(f, function(dataUrl){
          imgData.push(dataUrl);
          done++;
          if(done===files.length) renderImgPreview();
        });
      });
      this.value='';
    });

    // emoji picker: select post icon (does NOT insert into title/content)
    (function(){
      const grid=document.getElementById('emojiGrid');
      const emojiInput=document.getElementById('eemoji');
      const emojiCurrent=document.getElementById('emojiCurrent');

      function setEmoji(emoji){
        emojiInput.value=emoji;
        emojiCurrent.textContent=emoji;
        grid.querySelectorAll('span').forEach(function(s){ s.classList.remove('selected'); });
        // highlight the matching span
        for(const s of grid.querySelectorAll('span')){
          if(s.textContent===emoji){ s.classList.add('selected'); break; }
        }
      }

      grid.addEventListener('click',function(e){
        const t=e.target;
        if(t.tagName!=='SPAN') return;
        setEmoji(t.textContent);
      });

      // expose helper for use in fabBtn / editCurrent
      window._setPostEmoji=setEmoji;
    })();

    // open new entry
    document.getElementById('fabBtn').onclick=()=>{
      if(!isAuthed()){ openLogin(); return; }
      document.getElementById('eid').value='';
      document.getElementById('etitle').value='';
      document.getElementById('econtent').value='';
      document.getElementById('elinks').innerHTML='';
      const _td=new Date(); document.getElementById('edate').value=_td.getFullYear()+'-'+String(_td.getMonth()+1).padStart(2,'0')+'-'+String(_td.getDate()).padStart(2,'0');
      document.getElementById('editTitle').textContent='NEW ENTRY';
      // reset emoji to default
      if(window._setPostEmoji) window._setPostEmoji('📖');
      imgData=[];
      renderImgPreview();
      const _edb=document.getElementById('editDelBtn'); if(_edb) _edb.style.display='none';
      document.getElementById('editOv').classList.add('show');
    };

    function closeEdit(){ document.getElementById('editOv').classList.remove('show'); }
    function closeView(){ document.getElementById('viewOv').classList.remove('show'); }

    // lightbox
    const lbEl=document.getElementById('lb');
    lbEl.querySelector('.lb-close').onclick=()=>lbEl.classList.remove('show');
    lbEl.addEventListener('click',e=>{ if(e.target===lbEl) lbEl.classList.remove('show'); });
    function openLb(src){ lbEl.querySelector('img').src=src; lbEl.classList.add('show'); }

    // add link row helper
    function addLinkRow(url,label){
      url=url||'';
      const wrap=document.getElementById('elinks');
      const row=document.createElement('div');
      row.className='link-row';
      const u=document.createElement('input');
      u.type='url'; u.placeholder='https://'; u.value=url; u.style.flex='1';
      const d=document.createElement('button');
      d.type='button'; d.className='lrow-del'; d.textContent='×';
      d.onclick=()=>row.remove();
      row.appendChild(u); row.appendChild(d);
      wrap.appendChild(row);
    }

    async function view(id){
      const r=await fetch('/api/trips/'+id);
      const d=await r.json();
      if(!d.entry) return;
      const e=d.entry; cid=id;
      document.getElementById('vdate').textContent=e.date;
      document.getElementById('vtitle').textContent=e.title;
      document.getElementById('vemoji').textContent=e.emoji;
      document.getElementById('vcontent').textContent=e.content;
      document.getElementById('vtags').innerHTML=(e.tags||[]).map(t=>'<span class="pill">'+t+'</span>').join('');
      const imgs=e.images||[];
      const vimEl=document.getElementById('vimages');
      vimEl.className='';
      vimEl.innerHTML='';
      if(imgs.length>3){
        // carousel: show 3 per page, advance by 3
        const perPage=3;
        const total=imgs.length;
        let _page=0;
        const totalPages=Math.ceil(total/perPage);

        const wrapper=document.createElement('div');
        wrapper.className='img-carousel';

        const btnL=document.createElement('button');
        btnL.type='button';
        btnL.className='carousel-btn cl';
        btnL.innerHTML='&#8592;';

        const track=document.createElement('div');
        track.className='img-carousel-track';

        const btnR=document.createElement('button');
        btnR.type='button';
        btnR.className='carousel-btn cr';
        btnR.innerHTML='&#8594;';

        const counter=document.createElement('div');
        counter.className='carousel-counter';

        wrapper.appendChild(btnL);
        wrapper.appendChild(track);
        wrapper.appendChild(btnR);
        vimEl.appendChild(wrapper);
        vimEl.appendChild(counter);

        function _carouselRender(){
          track.innerHTML='';
          const start=_page*perPage;
          imgs.slice(start, start+perPage).forEach(function(u){
            const img=document.createElement('img');
            img.src=u; img.alt=''; img.loading='lazy';
            img.onclick=function(ev){ ev.stopPropagation(); openLb(u); };
            track.appendChild(img);
          });
          btnL.disabled=(_page===0);
          btnR.disabled=(_page>=totalPages-1);
          counter.textContent=(_page+1)+' / '+totalPages;
        }

        btnL.addEventListener('click',function(ev){
          ev.preventDefault(); ev.stopPropagation();
          if(_page>0){ _page--; _carouselRender(); }
        });
        btnR.addEventListener('click',function(ev){
          ev.preventDefault(); ev.stopPropagation();
          if(_page<totalPages-1){ _page++; _carouselRender(); }
        });

        _carouselRender();
      } else {
        vimEl.className='img-grid';
        imgs.forEach(function(u){
          const img=document.createElement('img');
          img.src=u; img.alt=''; img.loading='lazy';
          img.onclick=function(){ openLb(u); };
          vimEl.appendChild(img);
        });
      }
      const lks=e.links||[];
      document.getElementById('vlinks').innerHTML=lks.map(l=>
        '<a class="link-item" href="'+l.url+'" target="_blank" rel="noopener noreferrer">'+
        '<span style="font-size:15px">🔗</span>'+
        '<span class="link-label">'+(l.label||l.url)+'</span>'+
        '<span class="link-url">'+l.url+'</span>'+
        '</a>'
      ).join('');
      // update PIN button label
      const pinBtn = document.getElementById('viewPinBtn');
      if(pinBtn) pinBtn.textContent = e.pinned ? '📌 UNPIN' : '📌 PIN';
      document.getElementById('viewOv').classList.add('show');
      // apply auth UI for edit/delete buttons
      applyAuthUI();
    }

    async function togglePin(){
      if(!isAuthed()){ showToast('请先解锁'); return; }
      // Read current pin state from local cache (no extra API call needed)
      const cached = _cachedList.find(function(e){ return e.id===cid; });
      const isPinned = cached ? !!cached.pinned : false;
      const pr = await fetch('/api/trips/'+cid+'/pin',{
        method:'POST',
        headers:{'Content-Type':'application/json','Authorization':'Bearer '+_token},
        body:JSON.stringify({pinned:!isPinned})
      });
      if(pr.ok){
        const newPinned = !isPinned;
        const pinBtn = document.getElementById('viewPinBtn');
        if(pinBtn) pinBtn.textContent = newPinned ? '📌 UNPIN' : '📌 PIN';
        showToast(newPinned ? '已置顶 📌' : '已取消置顶');
        // Update local cache: toggle pinned, re-sort
        if(cached){ cached.pinned = newPinned; }
        _cachedList.sort(function(a,b){
          if(a.pinned&&!b.pinned) return -1;
          if(!a.pinned&&b.pinned) return 1;
          return (b.createdAt||b.date).localeCompare(a.createdAt||a.date);
        });
        render(_cachedList);
      } else {
        const errD = await pr.json().catch(function(){return {};});
        showToast(errD.error === 'max 3 pins' ? '最多只能置顶 3 条' : '操作失败');
      }
    }

    function editCurrent(){
      if(!isAuthed()){ showToast('请先解锁'); return; }
      closeView();
      fetch('/api/trips/'+cid).then(r=>r.json()).then(d=>{
        const e=d.entry;
        document.getElementById('eid').value=e.id;
        document.getElementById('edate').value=e.date;
        document.getElementById('etitle').value=e.title||'';
        document.getElementById('econtent').value=e.content;
        if(window._setPostEmoji) window._setPostEmoji(e.emoji||'📖');
        imgData=[...(e.images||[])];
        renderImgPreview();
        const wrap=document.getElementById('elinks');
        wrap.innerHTML='';
        (e.links||[]).forEach(l=>addLinkRow(l.url));
        document.getElementById('editTitle').textContent='EDIT ENTRY';
        document.getElementById('editOv').classList.add('show');
        applyAuthUI();
      });
    }

    async function deleteCurrent(){
      if(!isAuthed()){ showToast('请先解锁'); return; }
      if(!cid) return;
      const r=await fetch('/api/trips/'+cid,{
        method:'DELETE',
        headers:{'Authorization':'Bearer '+_token}
      });
      if(r.ok){ closeView(); closeEdit(); showToast('DELETED'); removeLocal(cid); }
      else if(r.status===401){ closeView(); closeEdit(); handleAuthExpired(); }
      else { showToast('删除失败'); }
    }

    async function saveEntry(){
      if(!isAuthed()){ showToast('请先解锁'); return; }
      const saveBtn=document.querySelector('#editOv .btn-p');
      if(saveBtn){ saveBtn.textContent='SAVING…'; saveBtn.disabled=true; }
      try{
        const id=document.getElementById('eid').value;
        const lrows=[...document.querySelectorAll('#elinks .link-row')];
        const links=lrows.map(row=>{
          const ins=row.querySelectorAll('input');
          return {url:ins[0].value.trim(), label:''};
        }).filter(l=>l.url);
        const images=[...imgData];
        const dateVal=document.getElementById('edate').value;
        const titleVal=document.getElementById('etitle').value.trim();
        const contentVal=document.getElementById('econtent').value.trim();
        // extract first emoji from title or content as the post emoji
        // extract first emoji (works in all environments)
        const emojiVal=(document.getElementById('eemoji').value)||'📖';
        const body={
          date:dateVal,
          title:titleVal||dateVal||'日志',
          content:contentVal,
          emoji:emojiVal,
          tags:[],
          images,
          links
        };
        const url=id?'/api/trips/'+id:'/api/trips';
        const r=await fetch(url,{
          method:id?'PUT':'POST',
          headers:{'Content-Type':'application/json','Authorization':'Bearer '+_token},
          body:JSON.stringify(body)
        });
        if(r.ok){
          const saved=await r.json();
          closeEdit();
          showToast(id?'UPDATED ✓':'SAVED ✓');
          if(saved.entry) addOrUpdateLocal(saved.entry);
        }
        else if(r.status===401){ handleAuthExpired(); }
        else { showToast('保存失败'); }
      } finally {
        if(saveBtn){ saveBtn.textContent='SAVE'; saveBtn.disabled=false; }
      }
    }

    // initial load
    load();

    // All overlays: clicking outside does NOT close (must use buttons to close)
  `
  return c.html(shell('Diary', 'diary', body, script))
})

// ── Contact
hono.get('/contact', (c) => {
  const body = /* html */`
    <div class="ph">
      <div class="ph-title">CONTACT</div>
    </div>
    <div style="font-size:13px;color:${TEXT_M};line-height:3;letter-spacing:.8px;font-family:'Times New Roman',Times,serif">
      <div><a href="https://www.nekolauyiu.com" target="_blank" style="color:${ACCENT};text-decoration:none">www.nekolauyiu.com</a></div>
      <div><a href="mailto:contact@nekolauyiu.com" style="color:${ACCENT};text-decoration:none">contact@nekolauyiu.com</a></div>

    </div>
  `
  return c.html(shell('Contact', 'contact', body))
})

// ─── REST API ─────────────────────────────────────────────────────────────────

// List (public) — strip images to keep response small
hono.get('/api/trips', async (c) => {
  const kv = (c.env as Env)?.DIARY_KV
  const entries = await getEntries(kv)
  const slim = entries.map(e => ({
    id: e.id, date: e.date, title: e.title, content: e.content,
    emoji: e.emoji, tags: e.tags, links: e.links,
    pinned: e.pinned, createdAt: e.createdAt, updatedAt: e.updatedAt,
    imageCount: (e.images || []).length   // only send count, not data
  }))
  return c.json({ entries: slim })
})

// Get one (public)
hono.get('/api/trips/:id', async (c) => {
  const kv = (c.env as Env)?.DIARY_KV
  const entry = await getEntry(kv, c.req.param('id'))
  if (!entry) return c.json({ error: 'not found' }, 404)
  return c.json({ entry })
})

// Create (protected)
hono.post('/api/trips', async (c) => {
  const kv = (c.env as Env)?.DIARY_KV
  const token = extractToken(c.req.raw)
  if (!await verifyToken(kv, token)) return c.json({ error: 'Unauthorized' }, 401)
  const b = await c.req.json<Partial<Entry>>()
  const now = new Date().toISOString()
  const entry: Entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2,7)}`,
    date: b.date || now.slice(0,10),
    title: b.title || '无标题',
    content: b.content || '',
    emoji: b.emoji || '🌍',
    tags: b.tags || [],
    images: b.images || [],
    links: b.links || [],
    createdAt: now,
    updatedAt: now,
  }
  await putEntry(kv, entry)
  return c.json({ entry }, 201)
})

// Update (protected)
hono.put('/api/trips/:id', async (c) => {
  const kv = (c.env as Env)?.DIARY_KV
  const token = extractToken(c.req.raw)
  if (!await verifyToken(kv, token)) return c.json({ error: 'Unauthorized' }, 401)
  const old = await getEntry(kv, c.req.param('id'))
  if (!old) return c.json({ error: 'not found' }, 404)
  const b = await c.req.json<Partial<Entry>>()
  const entry: Entry = { ...old, ...b, id: old.id, updatedAt: new Date().toISOString() }
  await putEntry(kv, entry)
  return c.json({ entry })
})

// Pin/Unpin (protected, max 3 pins)
hono.post('/api/trips/:id/pin', async (c) => {
  const kv = (c.env as Env)?.DIARY_KV
  const token = extractToken(c.req.raw)
  if (!await verifyToken(kv, token)) return c.json({ error: 'Unauthorized' }, 401)
  const entry = await getEntry(kv, c.req.param('id'))
  if (!entry) return c.json({ error: 'not found' }, 404)
  const { pinned } = await c.req.json<{ pinned: boolean }>()
  if (pinned) {
    const all = await getEntries(kv)
    const pinCount = all.filter(e => e.pinned && e.id !== entry.id).length
    if (pinCount >= 3) return c.json({ error: 'max 3 pins' }, 400)
  }
  const updated: Entry = { ...entry, pinned, updatedAt: new Date().toISOString() }
  await putEntry(kv, updated)
  return c.json({ entry: updated })
})

// Delete (protected)
hono.delete('/api/trips/:id', async (c) => {
  const kv = (c.env as Env)?.DIARY_KV
  const token = extractToken(c.req.raw)
  if (!await verifyToken(kv, token)) return c.json({ error: 'Unauthorized' }, 401)
  await delEntry(kv, c.req.param('id'))
  return c.json({ ok: true })
})

// Fallback
hono.get('*', (c) => c.redirect('/'))

export default hono
